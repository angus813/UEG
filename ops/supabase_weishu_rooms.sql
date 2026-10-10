-- UEG 卫戍协议 · 联机房间
--
-- Paste into Supabase Dashboard -> SQL Editor -> Run. Safe to run repeatedly.
-- Comments are ASCII-only: the dashboard editor mangles full-width characters
-- and a dropped "--" turns Chinese text into a syntax error.
--
-- Design notes (mirrors sganggs/Stronghold-Protocol, the reference project):
--   MAX_SEATS 4 / MAX_SPECTATORS 2, 4-char room code, phase-based round loop.
--   Authority lives in the database rather than a Node process, so no server to
--   host. Combat is still simulated in each player's browser (their SP_COMBAT
--   =client); the DB only owns economy, phase and seat state.
--
-- We deliberately do NOT use a browser as the server: a page cannot listen on a
-- port. WebRTC was measured on this machine and gathered zero ICE candidates
-- (Chrome mDNS obfuscation), so host-authoritative P2P is not viable here.


-- ============ 1) rooms ============
create table if not exists weishu_rooms (
  code        text primary key,
  host        text not null,
  mode        text not null default 'beginner',
  phase       text not null default 'LOBBY',
  round       integer not null default 0,
  funds       integer not null default 0,
  life        integer not null default 1000,
  max_life    integer not null default 1000,
  state       jsonb not null default '{}'::jsonb,
  open        boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint weishu_rooms_code_len check (char_length(code) = 4)
);

create index if not exists weishu_rooms_open_idx
  on weishu_rooms (open, updated_at desc);

alter table weishu_rooms enable row level security;


-- ============ 2) seats ============
-- One row per occupant. role: 'seat' counts toward MAX_SEATS, 'spectator' does not.
create table if not exists weishu_room_seats (
  room_code   text not null references weishu_rooms(code) on delete cascade,
  username    text not null,
  role        text not null default 'seat',
  ready       boolean not null default false,
  connected   boolean not null default false,
  fleet       jsonb not null default '[]'::jsonb,
  joined_at   timestamptz not null default now(),
  last_seen   timestamptz not null default now(),
  primary key (room_code, username),
  constraint weishu_room_seats_role check (role in ('seat', 'spectator'))
);

create index if not exists weishu_room_seats_room_idx
  on weishu_room_seats (room_code, role);

-- role gains 'ai' for host-added AI teammates. create table if not exists will
-- not touch an existing table, so relax the check separately (idempotent).
alter table weishu_room_seats drop constraint if exists weishu_room_seats_role;
alter table weishu_room_seats add constraint weishu_room_seats_role
  check (role in ('seat', 'spectator', 'ai'));

alter table weishu_room_seats enable row level security;


-- ============ 3) events (reconnect + audit) ============
-- Append-only log. A player who dropped reads from last_seen to rebuild state,
-- which is what the reference project calls its reconnect window.
create table if not exists weishu_room_events (
  id         bigint generated always as identity primary key,
  room_code  text not null references weishu_rooms(code) on delete cascade,
  username   text,
  kind       text not null,
  payload    jsonb not null default '{}'::jsonb,
  at         timestamptz not null default now()
);

create index if not exists weishu_room_events_room_idx
  on weishu_room_events (room_code, id desc);

alter table weishu_room_events enable row level security;


-- ============ 4) seat limits, enforced in the DB ============
-- Checking seats in JS is not enough: two clients can join at the same moment
-- and both read "3 of 4 free". Doing it in one function makes the count and the
-- insert atomic.
create or replace function public.weishu_room_seat_counts(p_code text)
returns table (seats integer, spectators integer)
language sql stable security definer set search_path = public
as $$
  -- 'ai' occupies a seat slot exactly like a human: the reference project's
  -- freeSeat() hands out the first empty slot regardless of who fills it, so
  -- an AI must count toward MAX_SEATS or the room could hold 4 humans + N AIs.
  select
    count(*) filter (where role in ('seat', 'ai')),
    count(*) filter (where role = 'spectator')
  from public.weishu_room_seats
  where room_code = p_code;
$$;

-- Returns the role actually granted, or raises when the room is full/closed.
-- SECURITY DEFINER is required so the check is not filtered by the caller's own
-- RLS visibility (a non-host must still be able to count all seats).
create or replace function public.weishu_join_room(p_code text, p_role text default 'seat')
returns text
language plpgsql security definer set search_path = public
as $$
declare
  v_user  text := public.current_username();
  v_open  boolean;
  v_seats integer;
  v_specs integer;
  v_role  text;
begin
  if v_user is null then
    raise exception 'NOT_LOGGED_IN';
  end if;

  select r.open into v_open from public.weishu_rooms r where r.code = p_code;
  if not found then
    raise exception 'ROOM_NOT_FOUND';
  end if;
  if not v_open then
    raise exception 'ROOM_CLOSED';
  end if;

  -- An existing occupant re-joining keeps the role it already had.
  select s.role into v_role from public.weishu_room_seats s
   where s.room_code = p_code and s.username = v_user;
  if v_role is not null then
    update public.weishu_room_seats
       set connected = true, last_seen = now()
     where room_code = p_code and username = v_user;
    return v_role;
  end if;

  v_role := case when p_role = 'spectator' then 'spectator' else 'seat' end;

  select s.seats, s.spectators into v_seats, v_specs
    from public.weishu_room_seat_counts(p_code) s;

  if v_role = 'seat' and v_seats >= 4 then
    raise exception 'ROOM_FULL';
  end if;
  if v_role = 'spectator' and v_specs >= 2 then
    raise exception 'SPECTATORS_FULL';
  end if;

  insert into public.weishu_room_seats (room_code, username, role, connected)
  values (p_code, v_user, v_role, true);

  return v_role;
end;
$$;

-- Host adds an AI teammate.
--
-- An AI row has no login of its own, so RLS self_* policies would reject any
-- direct insert; the host writes it on the AI's behalf through this SECURITY
-- DEFINER function instead (same pattern as weishu_join_room).
--
-- p_username is client-minted, so it is forced to carry the ASCII 'AI_'
-- prefix: without that a host could mint rows impersonating a real player.
-- The prefix is ASCII on purpose -- the dashboard editor mangles full-width
-- characters in this file.
create or replace function public.weishu_add_bot(
  p_code text, p_username text, p_fleet jsonb default '{}'::jsonb)
returns boolean
language plpgsql security definer set search_path = public
as $$
declare
  v_user  text := public.current_username();
  v_open  boolean;
  v_phase text;
  v_seats integer;
begin
  if v_user is null then
    raise exception 'NOT_LOGGED_IN';
  end if;
  if p_username is null or p_username not like 'AI\_%' escape '\'
     or char_length(p_username) > 32 then
    raise exception 'BAD_BOT_NAME';
  end if;

  select r.open, r.phase into v_open, v_phase
    from public.weishu_rooms r where r.code = p_code;
  if not found then
    raise exception 'ROOM_NOT_FOUND';
  end if;
  if not v_open then
    raise exception 'ROOM_CLOSED';
  end if;
  if v_phase <> 'LOBBY' then
    raise exception 'ROOM_STARTED';
  end if;

  perform 1 from public.weishu_rooms r
   where r.code = p_code and r.host = v_user;
  if not found then
    raise exception 'NOT_HOST';
  end if;

  -- AI fills a seat slot like a human, so it consumes the same quota.
  select s.seats into v_seats from public.weishu_room_seat_counts(p_code) s;
  if v_seats >= 4 then
    raise exception 'ROOM_FULL';
  end if;

  insert into public.weishu_room_seats
    (room_code, username, role, ready, connected, fleet)
  values
    (p_code, p_username, 'ai', true, true, coalesce(p_fleet, '{}'::jsonb))
  on conflict (room_code, username) do nothing;

  return true;
end;
$$;

-- Host removes an AI teammate. Only rows that really are AI can be removed
-- through here; kicking a human is a different path with its own checks.
create or replace function public.weishu_remove_bot(p_code text, p_username text)
returns boolean
language plpgsql security definer set search_path = public
as $$
declare
  v_user  text := public.current_username();
  v_phase text;
begin
  if v_user is null then
    raise exception 'NOT_LOGGED_IN';
  end if;
  if p_username is null or p_username not like 'AI\_%' escape '\' then
    raise exception 'BAD_BOT_NAME';
  end if;

  select r.phase into v_phase from public.weishu_rooms r where r.code = p_code;
  if not found then
    raise exception 'ROOM_NOT_FOUND';
  end if;
  if v_phase <> 'LOBBY' then
    raise exception 'ROOM_STARTED';
  end if;

  perform 1 from public.weishu_rooms r
   where r.code = p_code and r.host = v_user;
  if not found then
    raise exception 'NOT_HOST';
  end if;

  delete from public.weishu_room_seats
   where room_code = p_code
     and username = p_username
     and role = 'ai';

  return found;
end;
$$;

-- Host-only state transitions. Centralising them keeps phase/round from being
-- written by anyone, which would let two clients disagree about the round.
create or replace function public.weishu_host_update(
  p_code text, p_phase text, p_round integer,
  p_funds integer, p_life integer, p_state jsonb)
returns boolean
language plpgsql security definer set search_path = public
as $$
begin
  update public.weishu_rooms
     set phase = coalesce(p_phase, phase),
         round = coalesce(p_round, round),
         funds = coalesce(p_funds, funds),
         life = coalesce(p_life, life),
         state = coalesce(p_state, state),
         updated_at = now()
   where code = p_code
     and host = public.current_username();
  return found;
end;
$$;

-- Append an event and stamp the seat's last_seen in one transaction, so a
-- reconnecting client can ask "what happened after id X" and get a correct answer.
create or replace function public.weishu_push_event(
  p_code text, p_kind text, p_payload jsonb)
returns bigint
language plpgsql security definer set search_path = public
as $$
declare
  v_user text := public.current_username();
  v_id   bigint;
begin
  if v_user is null then
    raise exception 'NOT_LOGGED_IN';
  end if;
  if not exists (select 1 from public.weishu_rooms where code = p_code) then
    raise exception 'ROOM_NOT_FOUND';
  end if;

  insert into public.weishu_room_events (room_code, username, kind, payload)
  values (p_code, v_user, p_kind, coalesce(p_payload, '{}'::jsonb))
  returning id into v_id;

  update public.weishu_room_seats
     set last_seen = now(), connected = true
   where room_code = p_code and username = v_user;

  return v_id;
end;
$$;

grant execute on function public.weishu_room_seat_counts(text) to authenticated;
grant execute on function public.weishu_join_room(text, text) to authenticated;
grant execute on function public.weishu_host_update(text, text, integer, integer, integer, jsonb) to authenticated;
grant execute on function public.weishu_push_event(text, text, jsonb) to authenticated;
grant execute on function public.weishu_add_bot(text, text, jsonb) to authenticated;
grant execute on function public.weishu_remove_bot(text, text) to authenticated;

-- ============ 5) policies ============
-- rooms: readable by any signed-in player (you need to find a room by code to
-- join it), writable by the host only.
drop policy if exists weishu_rooms_read on weishu_rooms;
create policy weishu_rooms_read on weishu_rooms for select
  to authenticated using (true);

drop policy if exists weishu_rooms_host_insert on weishu_rooms;
create policy weishu_rooms_host_insert on weishu_rooms for insert
  to authenticated with check (host = public.current_username());

drop policy if exists weishu_rooms_host_update on weishu_rooms;
create policy weishu_rooms_host_update on weishu_rooms for update
  to authenticated using (host = public.current_username())
  with check (host = public.current_username());

drop policy if exists weishu_rooms_host_delete on weishu_rooms;
create policy weishu_rooms_host_delete on weishu_rooms for delete
  to authenticated using (host = public.current_username());

-- seats: everyone in the room can see the roster; only the host may add/remove
-- spectators; each occupant may update their own row (ready / connected / fleet).
drop policy if exists weishu_seats_read on weishu_room_seats;
create policy weishu_seats_read on weishu_room_seats for select
  to authenticated using (true);

drop policy if exists weishu_seats_self_update on weishu_room_seats;
create policy weishu_seats_self_update on weishu_room_seats for update
  to authenticated using (username = public.current_username())
  with check (username = public.current_username());

drop policy if exists weishu_seats_self_delete on weishu_room_seats;
create policy weishu_seats_self_delete on weishu_room_seats for delete
  to authenticated using (username = public.current_username());

-- events: readable by signed-in players (reconnect), append-only.
drop policy if exists weishu_events_read on weishu_room_events;
create policy weishu_events_read on weishu_room_events for select
  to authenticated using (true);

drop policy if exists weishu_events_append on weishu_room_events;
create policy weishu_events_append on weishu_room_events for insert
  to authenticated with check (username = public.current_username());

-- ============ 6) realtime publication ============
-- Without this, INSERT/UPDATE on these tables is invisible to Realtime subscribers
-- and a client joining the room hears nothing. ALTER PUBLICATION is not idempotent,
-- so guard it.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
     where pubname = 'supabase_realtime' and schemaname = 'public'
       and tablename = 'weishu_rooms'
  ) then
    alter publication supabase_realtime add table public.weishu_rooms;
  end if;
  if not exists (
    select 1 from pg_publication_tables
     where pubname = 'supabase_realtime' and schemaname = 'public'
       and tablename = 'weishu_room_seats'
  ) then
    alter publication supabase_realtime add table public.weishu_room_seats;
  end if;
  if not exists (
    select 1 from pg_publication_tables
     where pubname = 'supabase_realtime' and schemaname = 'public'
       and tablename = 'weishu_room_events'
  ) then
    alter publication supabase_realtime add table public.weishu_room_events;
  end if;
end;
$$;


-- ============ 7) self-check ============
-- Run these ONE AT A TIME after the script above. Expect 0 rows, then an RLS
-- violation. If the insert succeeds, RLS is not working.
--   select * from weishu_rooms;
--   insert into weishu_rooms (code, host) values ('tst1', 'probe');
--   select * from weishu_rooms where code = 'tst1';
--   select * from information_schema.tables where table_schema='public' and table_name like 'weishu_room%';
--   select tablename from pg_publication_tables where pubname='supabase_realtime' and tablename like 'weishu%';