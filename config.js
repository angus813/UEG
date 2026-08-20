// ============================================================
// UEG 全局配置 —— 双后端模式
//   默认 Supabase（云端，手机/任何人可访问），本地 Python 后端关闭（备选）
//   本地后端仅作为"定期同步工具"使用（每 3-4 天向 Supabase API 同步 2 个地图文件）
// ============================================================
window.UEG_CONFIG = {
  // 数据源模式：'supabase'（默认） | 'local'（本地 Python 后端，默认关闭）
  mode: 'supabase',

  // ---- Supabase（主数据源，前端直连） ----
  supabase: {
    url: 'https://ruwjkbscaotnyhmduviz.supabase.co',
    publishableKey: 'sb_publishable_pfDTII6yQ_Behq9Y6wYkHw_UbLW0z7m', // 公开 Key（前端可用）
    jwksUrl: 'https://ruwjkbscaotnyhmduviz.supabase.co/auth/v1/.well-known/jwks.json'
    // SECRET_KEY 仅存在于后端 .env，绝不下发浏览器
  },

  // ---- 本地 Python 后端（默认关闭；切回 mode:'local' 时使用） ----
  api: {
    url: 'http://127.0.0.1:8000',
    publishableKey: 'ueg-public-key-0001'
  },

  // ---- 私有 GitHub 数据仓库（本地后端同步工具使用） ----
  github: {
    owner: 'angus813',
    repo: 'ueg-data',
    branch: 'main',
    files: { users: 'users.json', maps: 'guild_maps.json', ships: 'ships_data.json' },
    adminUser: 'angus'
  }
};

// 兼容旧模块（supabase-client.js 等仍读 GITHUB_CONFIG）
window.GITHUB_CONFIG = window.UEG_CONFIG.github;
