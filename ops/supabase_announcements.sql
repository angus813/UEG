-- UEG 公会官网 · 更新公告
-- 用法：把本文件整段粘进 Supabase Dashboard → SQL Editor → Run，可重复执行。
--
-- 设计取舍：
--   1. 读策略 using (true) —— 公告是公开信息，未登录也要能看到（首页登录框会盖住，
--      但不该把「没公告」和「没登录」两件事混在一起；weishu_data 的教训是读侧
--      收紧到本人，结果任何跨账号查看都被挡）。
--   2. 写/改/删统一走 public.is_staff()，口径与站内星河杯门禁一致
--      （is_admin / is_owner / is_official 三者任一为真）。
--      前端也做同样的判断，但前端判断只管 UI —— 真正的闸门在这条 RLS 上，
--      越权请求会被 PostgREST 直接拒掉。
--   3. is_staff() 标 security definer：users 表自身的 RLS 会挡住普通用户读 is_admin，
--      不给 definer 就查不到，函数恒返回 false，所有人都不发不了公告。

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

-- 列表按「置顶优先、时间倒序」读，索引跟着查询走
create index if not exists announcements_pinned_created_idx
  on announcements (pinned desc, created_at desc);

alter table announcements enable row level security;

-- 管理员判定：当前 JWT 里的用户名在 users 表里带管理/会长/官员标记
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

-- 兜底自检：跑完在 Dashboard 里确认下面两条都返回 0 条（RLS 没生效时会是 1）
--   select * from announcements where true;                       -- 期望 0 行
--   insert into announcements (title) values ('__probe__');        -- 期望报 RLS 违规
--   select * from announcements where title = '__probe__';         -- 期望 0 行
-- 如果 insert 成功了，说明 RLS 没拦住，立刻 delete from announcements where title = '__probe__';