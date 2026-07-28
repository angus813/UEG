// supabase-client.js
// 使用您的 Supabase 项目 URL 和 publishable key（anon key）
// 注意：绝不能在前端代码中使用 SUPABASE_SECRET_KEY！

const SUPABASE_URL = 'https://ruwjkbscaotnyhmduviz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_pfDTII6yQ_Behq9Y6wYkHw_UbLW0z7m';

// 创建 Supabase 客户端实例（全局可用）
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);