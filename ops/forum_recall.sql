-- ============================================================
-- 公会论坛 · 消息撤回（软撤回）—— 独立迁移脚本
--
-- 背景：public/forum.html 早已带上「撤回」按钮与「该消息已撤回」占位，
--       但线上数据库还没有 recalled_at 列，页面会自动降级为「不显示撤回按钮」。
--       跑完本脚本、刷新页面，撤回按钮就会出现。
--
-- 特性：可重复执行（idempotent）——重复跑不会报错、不会动数据。
-- 用法：Supabase Dashboard → 左侧 SQL Editor → 新建 query → 粘贴全文 → Run
--
-- 说明：本脚本依赖 public.current_username() 与 public.current_user_is_admin()，
--       这两个身份函数由 ops/mata_site.sql 引入、线上已存在（下面会自检，缺了会报错）。
-- ============================================================

-- 0) 自检：身份函数必须在
do $$
begin
  if to_regprocedure('public.current_username()') is null then
    raise exception '缺少 public.current_username()，请先执行 ops/mata_site.sql 的身份函数部分';
  end if;
  if to_regprocedure('public.current_user_is_admin()') is null then
    raise exception '缺少 public.current_user_is_admin()，请先执行 ops/mata_site.sql 的身份函数部分';
  end if;
end $$;

-- 1) 软撤回标记列：只打时间戳，正文/媒体引用由前端清空，界面留「该消息已撤回」占位
alter table public.forum_messages
  add column if not exists recalled_at timestamptz;

-- 2) 允许「本人撤回」或「管理员撤回」
--    （前端用的是 PATCH → 需要 update 策略；没有它撤回会 401/静默失败）
drop policy if exists forum_recall_own on public.forum_messages;
create policy forum_recall_own on public.forum_messages
  for update to authenticated
  using (author = public.current_username() or public.current_user_is_admin())
  with check (author = public.current_username() or public.current_user_is_admin());

-- 3) 顺带确保「硬删除」策略也在（彻底抹掉消息 / 管理员清理时用）
drop policy if exists forum_delete_own on public.forum_messages;
create policy forum_delete_own on public.forum_messages
  for delete to authenticated
  using (author = public.current_username() or public.current_user_is_admin());

-- 4) 允许删除自己目录下的媒体对象
--    撤回图片/视频时前端会顺手把存储里的源文件也删掉（否则消息撤回了，
--    原先的公开 URL 仍可访问）。没有这条 delete 策略，删除请求会被 RLS 拒绝。
drop policy if exists forum_media_delete on storage.objects;
create policy forum_media_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'forum-media'
         and ((storage.foldername(name))[1] = public.current_username()
              or public.current_user_is_admin()));

-- ============================================================
-- 跑完可这样验证（应返回若干行，且 recalled_at 列存在）：
--   select id, author, recalled_at from public.forum_messages order by id desc limit 5;
--
-- 验证线上列已生效（浏览器控制台或任意终端）：
--   curl "https://ruwjkbscaotnyhmduviz.supabase.co/rest/v1/forum_messages?select=id,recalled_at&limit=1" \
--        -H "apikey: sb_publishable_pfDTII6yQ_Behq9Y6wYkHw_UbLW0z7m"
--   # 以前是 400 column does not exist，跑完应变成 200
-- ============================================================
