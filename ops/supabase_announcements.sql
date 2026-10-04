-- UEG guild site - announcements table (home page notice board)
-- Paste the WHOLE file into Supabase Dashboard -> SQL Editor -> Run.
-- Safe to run repeatedly: every statement is guarded with IF EXISTS / OR REPLACE.
-- Comments are ASCII-only on purpose: the dashboard editor mangles full-width
-- characters and a dropped "--" turns Chinese text into a syntax error.

-- 1) table
create table if not exists announcements (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  body       text not null default '',
  author     text not null default '',
  pinned     boolean not null default false,
  important  boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- list query is "order by pinned desc, created_at desc"
create index if not exists announcements_pinned_created_idx
  on announcements (pinned desc, created_at desc);

alter table announcements enable row level security;

-- 2) staff check: is the JWT username flagged as admin/owner/official in users?
--    SECURITY DEFINER is required. The users table has its own RLS that blocks a
--    normal user from reading is_admin, so without definer rights this function
--    returns false for everyone and nobody could post.
create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from users u
    where u.username = public.current_username()
      and (u.is_admin or u.is_owner or u.is_official)
  );
$$;

grant execute on function public.is_staff() to authenticated, anon;

-- 3) policies
--    read: public. A notice board is public information; "no notices yet" and
--          "not logged in" must not look the same on screen.
--    write/update/delete: is_staff() only. The page also checks this, but that
--          check is UI only - these policies are the real gate.
drop policy if exists announcements_read on announcements;
create policy announcements_read on announcements for select using (true);

drop policy if exists announcements_insert on announcements;
create policy announcements_insert on announcements for insert
  with check (public.is_staff());

drop policy if exists announcements_update on announcements;
create policy announcements_update on announcements for update
  using (public.is_staff()) with check (public.is_staff());

drop policy if exists announcements_delete on announcements;
create policy announcements_delete on announcements for delete
  using (public.is_staff());

-- 4) optional self-check - run these three ONE AT A TIME after step 3.
--    Expect 0 rows, then an RLS violation, then 0 rows.
--    If the insert succeeds, RLS is not working: run
--      delete from announcements where title = 'probe';
--    and stop using the page until it is fixed.

--   select * from announcements where true;

--   insert into announcements (title) values ('probe');

--   select * from announcements where title = 'probe';