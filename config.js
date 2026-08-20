// ============================================================
//  全局配置 —— 纯前端 + 自建 Python 后端版
//  认证四件套形式（URL / PUBLISHABLE_KEY / SECRET_KEY / JWKS_URL）：
//    · 前端只持有 URL、PUBLISHABLE_KEY（公开）、JWKS_URL（展示用）
//    · SECRET_KEY 与 GITHUB_TOKEN 仅存在于后端 .env，绝不下发浏览器
//  数据层：后端 Python 读写私有仓库 angus813/ueg-data（GITHUB_TOKEN 服务端保管）
// ============================================================
window.UEG_CONFIG = {
  api: {
    url: 'http://127.0.0.1:8000',            // ★ Python 后端地址（本机/内网/VPS）
    publishableKey: 'ueg-public-key-0001',   // ★ 与后端 .env 的 PUBLISHABLE_KEY 一致
    jwksUrl: 'http://127.0.0.1:8000/.well-known/jwks.json'
  },
  github: {
    owner: 'angus813',            // 仓库拥有者（后端也会读取自己的配置）
    repo: 'ueg-data',             // 私有仓库名（存储数据）
    branch: 'main',               // 分支
    files: {
      users: 'users.json',        // 用户数据
      maps: 'guild_maps.json',    // 公会地图
      ships: 'ships_data.json'    // 舰船数据
    },
    adminUser: 'angus'            // 管理员用户名（注册同名账号自动成为管理员）
  }
};

// 兼容旧模块引用（supabase-client.js 等仍读取 GITHUB_CONFIG）
window.GITHUB_CONFIG = window.UEG_CONFIG.github;
