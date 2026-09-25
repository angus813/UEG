-- ============================================================
--  UEG × MATA 站点扩展（一次执行，可重复执行）
--  用途：
--   1) MATA 截图上传与排行榜（只统计已进入数据集的截图）
--   2) 公会论坛（文字/图片/视频/表情 + 自定义气泡颜色）
--   3) 头像上传、官员角色
--   4) 公共记忆 / 知识库（MATA 端使用）
--
--  【身份约定·务必遵守】全站用「用户名」做归属键，判定用 public.current_username()
--    · current_username() 读的是 JWT 的 user_metadata.username（注册时的原始用户名）
--    · 不要用 auth.jwt() ->> 'email'：邮箱是 encodeURIComponent(用户名)+'@ueg.local'，
--      中文用户名会被百分号编码，跟网站写入的 username 对不上，写入会被 RLS 直接拒。
--    · 网站（mata.html / forum.html / profile.html）写入的 uploader/author = 用户名
--
--  说明：全部使用 publishable key + 登录 JWT（RLS 生效），不含任何 secret。
-- ============================================================

-- ---------- 1. users 表扩展 ----------
alter table public.users add column if not exists avatar_url  text;
alter table public.users add column if not exists bubble_color text default '#3a7afe';
alter table public.users add column if not exists is_official  boolean default false;
alter table public.users add column if not exists is_owner     boolean default false;
alter table public.users add column if not exists last_seen    timestamptz;

-- 会长：把 angus 标记为会长（如你的会长用户名不是 angus，请改这一行）
update public.users set is_owner = true, is_admin = true where lower(username) = 'angus';

-- ---------- 2. MATA 截图 ----------
create table if not exists public.mata_shots (
  id            bigserial primary key,
  uploader      text not null,
  storage_path  text not null,
  file_name     text,
  file_size     bigint,
  note          text,
  used_in_dataset boolean not null default false,   -- 只有 true 才计入排行榜
  labeled       boolean not null default false,      -- 是否已被 AI 标注
  created_at    timestamptz not null default now()
);
create index if not exists mata_shots_uploader_idx on public.mata_shots (uploader);
create index if not exists mata_shots_used_idx     on public.mata_shots (used_in_dataset);

alter table public.mata_shots enable row level security;

drop policy if exists mata_shots_read on public.mata_shots;
create policy mata_shots_read on public.mata_shots
  for select using (true);                       -- 排行榜/展示需要人人可见

drop policy if exists mata_shots_insert on public.mata_shots;
create policy mata_shots_insert on public.mata_shots
  for insert to authenticated
  with check (uploader = public.current_username());   -- 只能以自己名义上传

drop policy if exists mata_shots_update on public.mata_shots;
create policy mata_shots_update on public.mata_shots
  for update to authenticated
  using (uploader = public.current_username() or public.current_user_is_admin())
  with check (uploader = public.current_username() or public.current_user_is_admin());

-- 排行榜视图：只统计 used_in_dataset = true
create or replace view public.mata_leaderboard as
  select uploader,
         count(*)                                    as dataset_count,
         count(*) filter (where labeled)             as labeled_count,
         max(created_at)                             as last_upload
    from public.mata_shots
   where used_in_dataset = true
   group by uploader
   order by dataset_count desc;

grant select on public.mata_leaderboard to anon, authenticated;

-- ---------- 3. 公会论坛 ----------
create table if not exists public.forum_messages (
  id          bigserial primary key,
  author      text not null,
  kind        text not null default 'text',   -- text | image | video | emoji
  body        text,
  media_path  text,
  bubble_color text,                          -- 该条消息使用的气泡颜色（取自用户设置）
  created_at  timestamptz not null default now()
);
create index if not exists forum_messages_created_idx on public.forum_messages (created_at desc);

alter table public.forum_messages enable row level security;

drop policy if exists forum_read on public.forum_messages;
create policy forum_read on public.forum_messages for select using (true);

drop policy if exists forum_insert on public.forum_messages;
create policy forum_insert on public.forum_messages
  for insert to authenticated
  with check (author = public.current_username());

drop policy if exists forum_delete_own on public.forum_messages;
create policy forum_delete_own on public.forum_messages
  for delete to authenticated
  using (author = public.current_username() or public.current_user_is_admin());

-- 聊天消息撤回（软撤回）：只打 recalled_at 标记，正文/媒体引用清空，界面留「该消息已撤回」占位。
-- 想彻底抹掉就用上面的 forum_delete_own（DELETE）；软撤回是为了不破坏别人看过的上下文。
alter table public.forum_messages add column if not exists recalled_at timestamptz;

drop policy if exists forum_recall_own on public.forum_messages;
create policy forum_recall_own on public.forum_messages
  for update to authenticated
  using (author = public.current_username() or public.current_user_is_admin())
  with check (author = public.current_username() or public.current_user_is_admin());

-- ---------- 4. 公共记忆 / 知识库（MATA 端） ----------
-- owner 存「用户名」（MATA 侧 supa.py 的 username，不带 @ueg.local）
create table if not exists public.mata_memory (
  id         bigserial primary key,
  owner      text not null,
  content    text not null,
  source     text,                              -- 会话/任务 id
  created_at timestamptz not null default now()
);
alter table public.mata_memory enable row level security;
drop policy if exists mata_memory_all on public.mata_memory;
create policy mata_memory_all on public.mata_memory
  for all to authenticated
  using (owner = public.current_username())
  with check (owner = public.current_username());

create table if not exists public.mata_kb_docs (
  id         bigserial primary key,
  owner      text not null,
  title      text not null,
  kind       text,                              -- docx | txt | md | pdf
  size       bigint,
  text_path  text,                              -- Storage 里的纯文本路径
  created_at timestamptz not null default now()
);
alter table public.mata_kb_docs enable row level security;
drop policy if exists mata_kb_all on public.mata_kb_docs;
create policy mata_kb_all on public.mata_kb_docs
  for all to authenticated
  using (owner = public.current_username())
  with check (owner = public.current_username());

-- ---------- 5. Storage 桶 ----------
insert into storage.buckets (id, name, public)
values ('mata-shots', 'mata-shots', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('forum-media', 'forum-media', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- 桶策略：公开读；登录用户只能写/改「自己目录」下的文件（路径都是 用户名/xxx）
-- 注意：用 %I 拼整个策略名（写成 %I_read 会被拼成 "bucket"_read，直接语法错误）
do $$
declare b text;
begin
  foreach b in array array['mata-shots', 'forum-media', 'avatars'] loop
    execute format('drop policy if exists %I on storage.objects', b || '_read');
    execute format($f$create policy %I on storage.objects for select using (bucket_id = %L)$f$, b || '_read', b);

    execute format('drop policy if exists %I on storage.objects', b || '_write');
    execute format($f$create policy %I on storage.objects for insert to authenticated
                      with check (bucket_id = %L and (storage.foldername(name))[1] = public.current_username())$f$,
                   b || '_write', b);

    execute format('drop policy if exists %I on storage.objects', b || '_update');
    execute format($f$create policy %I on storage.objects for update to authenticated
                      using (bucket_id = %L and (storage.foldername(name))[1] = public.current_username())$f$,
                   b || '_update', b);

    execute format('drop policy if exists %I on storage.objects', b || '_delete');
    execute format($f$create policy %I on storage.objects for delete to authenticated
                      using (bucket_id = %L and (storage.foldername(name))[1] = public.current_username())$f$,
                   b || '_delete', b);
  end loop;
end $$;

-- 完成。执行后到 Storage 页确认 3 个桶已存在、且为 Public。
