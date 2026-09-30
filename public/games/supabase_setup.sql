-- UEG 卫戍协议 · Supabase 数据表
create table if not exists weishu_data (
  username text primary key,
  fleet_json text default '[]',
  stats_json text default '{}',
  updated_at timestamptz default now()
);
alter table weishu_data enable row level security;
-- RLS：读写都必须是本人（username 主键 + JWT 用户名）。
-- 原策略写侧只查 authenticated、读侧 using(true) —— 任意登录用户可改/删他人存档、
-- 未登录可读全部存档（越权）。weishu.js 也只读写自己的行（?username=eq.本人）。
drop policy if exists weishu_read on weishu_data;
create policy weishu_read on weishu_data for select using (username = public.current_username());
drop policy if exists weishu_write on weishu_data;
create policy weishu_write on weishu_data for all
  using (username = public.current_username())
  with check (username = public.current_username());
