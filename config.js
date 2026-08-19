// ============================================================
//  全局配置 —— 纯前端直连版（GitHub API 直接读写私有仓库）
//  对应 GitHub Pages: https://angus813.github.io/UEG/
//  安全说明：
//   · GitHub Token 在 token.html 用主密码加密后存本机浏览器
//     （AES-GCM-256 + PBKDF2 10万次迭代），页面代码不含 Token
//   · 所有读写直连 GitHub Contents API，无需任何后端/Serverless
// ============================================================
window.GITHUB_CONFIG = {
  owner: 'angus813',            // 仓库拥有者
  repo: 'ueg-data',             // 私有仓库名（存储数据）
  branch: 'main',               // 分支
  files: {
    users: 'users.json',        // 用户数据
    maps: 'guild_maps.json',    // 公会地图
    ships: 'ships_data.json'    // 舰船数据
  },
  adminUser: 'angus'           // 管理员用户名（注册同名账号自动成为管理员）
};
