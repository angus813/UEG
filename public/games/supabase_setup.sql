-- UEG 卫戍协议 · Supabase 数据表
create table if not exists weishu_data (
  username text primary key,
  fleet_json text default '[]',
  stats_json text default '{}',
  updated_at timestamptz default now()
);
alter table weishu_data enable row level security;
drop policy if exists weishu_read on weishu_data;
create policy weishu_read on weishu_data for select using (true);
drop policy if exists weishu_write on weishu_data;
create policy weishu_write on weishu_data for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
