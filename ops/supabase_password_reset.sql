-- UEG website -- password recovery
--
-- Safe to run repeatedly (every statement is idempotent).
-- Comments are ASCII-only: the dashboard editor mangles full-width characters
-- and a dropped "--" turns Chinese text into a syntax error.
--
-- Two independent channels, because the project runs on Supabase's built-in
-- SMTP. That sender only delivers to team members listed in the dashboard and
-- is rate limited to a couple of mails per hour, so a real player will most
-- likely not receive anything. The mail path still exists (it starts working
-- the moment a custom SMTP is configured), but it cannot be the only path.
--
--   Channel A  e-mail -- resetPasswordForEmail -> reset-password.html
--   Channel B  request + admin approval (this file)
--
-- Anti-enumeration: channel B never tells the caller whether the username
-- exists. pw_request_reset always returns a ticket id, and only the admin-side
-- listing reveals that. Otherwise the endpoint would answer "your account does
-- not exist" to a stranger enumerating the member list.
--
-- Authorization: admin-only, matching the is_admin check admin.html already
-- does for the user-management page. is_staff() is deliberately NOT used here:
-- it also covers is_official / is_owner, and handing out the power to replace
-- anyone's password is a step beyond what the UI already exposes.


-- ============ 1) requests ============
-- One row per request. status: 'pending' -> 'done' (password replaced) or
-- 'rejected'. The new password is never stored here -- not even hashed. It is
-- handed to the admin once and immediately discarded, so a leaked table dump
-- cannot be replayed against an account.
create table if not exists pw_reset_requests (
  id           bigint generated always as identity primary key,
  username     text not null,
  note         text not null default '',
  contact      text not null default '',
  status       text not null default 'pending',
  created_at   timestamptz not null default now(),
  handled_by   text,
  handled_at   timestamptz,
  handle_note  text,
  constraint pw_reset_requests_status check (status in ('pending', 'done', 'rejected'))
);

create index if not exists pw_reset_requests_pending_idx
  on pw_reset_requests (status, created_at desc);

alter table pw_reset_requests enable row level security;

-- No policies are created on purpose. Direct table access stays denied for
-- anon and authenticated; every read and write goes through the SECURITY
-- DEFINER functions below, which are the only places authorization is decided.


-- ============ 2) submit a request ============
-- Callable while signed out -- someone who lost their password cannot hold a
-- token. Returns the ticket id.
create or replace function public.pw_request_reset(
  p_username text, p_note text default '', p_contact text default '')
returns bigint
language plpgsql security definer set search_path = public
as $$
declare
  v_id  bigint;
begin
  -- Whitespace / control characters are the only thing worth rejecting here.
  -- The full charset rule lives in the client (DB.register); duplicating a
  -- CJK range in SQL would mean embedding full-width characters in this file,
  -- which the dashboard editor mangles.
  if p_username is null
     or char_length(p_username) < 2
     or char_length(p_username) > 20
     or p_username ~ '[[:space:][:cntrl:]]' then
    raise exception 'BAD_USERNAME';
  end if;
  if char_length(coalesce(p_note, '')) > 500 or char_length(coalesce(p_contact, '')) > 120 then
    raise exception 'TEXT_TOO_LONG';
  end if;

  -- Already-open request for the same account: hand back the existing ticket
  -- instead of stacking duplicates, so a retry does not bury the admin queue.
  select id into v_id
    from pw_reset_requests
   where username = p_username and status = 'pending'
   order by created_at desc
   limit 1;
  if v_id is not null then
    return v_id;
  end if;

  -- Global hourly cap. Without it an anonymous endpoint is a free way to fill
  -- the queue and make the real requests invisible among the noise.
  if (select count(*) from pw_reset_requests where created_at > now() - interval '1 hour') >= 20 then
    raise exception 'RATE_LIMITED';
  end if;

  insert into pw_reset_requests (username, note, contact)
  values (p_username, coalesce(p_note, ''), coalesce(p_contact, ''))
  returning id into v_id;

  return v_id;
end;
$$;

-- ============ 3) list for the admin ============
-- account_exists is resolved here rather than in the client so the admin sees
-- it without a second round trip. Repeat submissions under one name are
-- collapsed: the oldest open ticket carries the detail, later ones only add
-- `submissions`.
-- plpgsql, not language sql: the body used to carry no authorization check at
-- all, and an unguarded "language sql" SECURITY DEFINER function is just a
-- readable view for anyone who can call it. The admin guard below is what
-- makes this function safe to expose.
create or replace function public.pw_reset_list()
returns table (
  id            bigint,
  username      text,
  note          text,
  contact       text,
  status        text,
  created_at    timestamptz,
  handled_by    text,
  handled_at    timestamptz,
  handle_note   text,
  account_exists boolean,
  submissions   bigint
)
language plpgsql security definer set search_path = public
as $$
begin
  if public.current_username() is null or not public.current_user_is_admin() then
    raise exception 'NOT_ADMIN';
  end if;

  return query
  select r.id,
         r.username,
         r.note,
         r.contact,
         r.status,
         r.created_at,
         r.handled_by,
         r.handled_at,
         r.handle_note,
         exists (select 1 from public.users u where u.username = r.username)
           or exists (select 1 from auth.users a
                      where a.raw_user_meta_data ->> 'username' = r.username),
         (select count(*) from public.pw_reset_requests x
           where x.username = r.username
             and (x.status = r.status or x.status = 'pending'))
    from public.pw_reset_requests r
   order by (r.status = 'pending') desc, r.created_at desc
   limit 200;
end;
$$;

-- ============ 4) resolve ============
-- action 'done'    -> replace auth.users.password_hash, kill live sessions
-- action 'reject'  -> close the ticket without touching the account
--
-- crypt() lives in the extensions schema on Supabase (pgcrypto is installed
-- there, not in public), so both helpers are schema-qualified rather than
-- resolved through search_path.
create or replace function public.pw_reset_resolve(
  p_id bigint, p_action text, p_newpw text default '', p_note text default '')
returns boolean
language plpgsql security definer set search_path = public
as $$
declare
  v_user  text := public.current_username();
  v_name  text;
  v_uid   text;
begin
  if v_user is null or not public.current_user_is_admin() then
    raise exception 'NOT_ADMIN';
  end if;
  if p_action not in ('done', 'reject') then
    raise exception 'BAD_ACTION';
  end if;

  select r.username into v_name
    from pw_reset_requests r
   where r.id = p_id and r.status = 'pending';
  if v_name is null then
    raise exception 'NOT_PENDING';
  end if;

  if p_action = 'done' then
    if p_newpw is null or char_length(p_newpw) < 6 then
      raise exception 'PW_TOO_SHORT';
    end if;

    -- Match on user_metadata rather than email: encEmail() URL-encodes the
    -- username into the address, so reconstructing that in SQL would mean
    -- reimplementing encodeURIComponent. user_metadata is also the field
    -- public.current_username() reads, so the two stay consistent.
    select a.id::text into v_uid
      from auth.users a
     where a.raw_user_meta_data ->> 'username' = v_name;
    if v_uid is null then
      raise exception 'NO_SUCH_ACCOUNT';
    end if;

    -- The column is encrypted_password, not password_hash: that is GoTrue's
    -- name for it. Password_hash belongs to the older PostgREST auth schema
    -- and this table has never had it.
    update auth.users
       set encrypted_password = extensions.crypt(p_newpw, extensions.gen_salt('bf')),
           updated_at         = now()
     where id::text = v_uid;

    -- Changing the password must not leave old sessions usable. user_id here is
    -- a varchar column, hence the explicit text cast.
    delete from auth.refresh_tokens where user_id = v_uid::text;
  end if;

  -- 'reject' is the wire value; the stored status is 'rejected'.
  update pw_reset_requests
     set status = case p_action when 'reject' then 'rejected' else p_action end,
         handled_by = v_user, handled_at = now(),
         handle_note = left(coalesce(p_note, ''), 500)
   where id = p_id;

  return true;
end;
$$;


-- ============ 5) grants ============
-- EXECUTE is all that matters: the table has RLS on and no policies, so these
-- three functions are the only way in.
grant execute on function public.pw_request_reset(text, text, text) to anon, authenticated;
grant execute on function public.pw_reset_list() to authenticated;
grant execute on function public.pw_reset_resolve(bigint, text, text, text) to authenticated;

-- The anon role needs USAGE on public to reach the function at all.
grant usage on schema public to anon, authenticated;