// ============================================================
//  github-db.js —— 纯前端 + 自建 Python 后端版
//  依赖：config.js（api.url / api.publishableKey / github.*）
//
//  ★ 安全模型 ★
//   · GitHub Token 不再出现在前端：由后端 Python 服务保管，
//     前端只持有后端返回的 JWT 会话（localStorage 明文存储）
//   · 登录 → 后端签发 JWT（HS256，7 天有效）→ 所有请求带
//     Authorization: Bearer <JWT> + X-Publishable-Key 公开标识
//   · 密码 bcrypt 哈希存储在后端（老明文密码登录时自动升级）
//   · 管理员权限由后端依据 users.json 的 is_admin 校验
//
//  ★ DB 方法签名与之前版本完全一致，页面调用无需改动 ★
// ============================================================
(function () {
  const CFG = window.UEG_CONFIG || window.GITHUB_CONFIG;

  if (!CFG || !CFG.api || !CFG.api.url) {
    console.error('❌ 请先配置 config.js（api.url / api.publishableKey）');
    return;
  }

  const API = String(CFG.api.url).replace(/\/+$/, '');
  const LS_TOKEN = 'ueg_token';          // localStorage 会话 JWT
  const SS_SESSION = 'ueg_token_session'; // sessionStorage 会话缓存
  let memToken = null;                    // 内存中的 JWT

  // ============================================================
  //  会话管理（JWT）
  // ============================================================
  function getToken() {
    if (memToken) return memToken;
    const t = localStorage.getItem(LS_TOKEN) || sessionStorage.getItem(SS_SESSION);
    if (t) memToken = t;
    return t;
  }

  function setSession(token) {
    memToken = token;
    localStorage.setItem(LS_TOKEN, token);   // 内部站点：直接持久化会话
  }

  function clearSession() {
    memToken = null;
    localStorage.removeItem(LS_TOKEN);
    sessionStorage.removeItem(SS_SESSION);
  }

  function tokenExpired(token) {
    try {
      const part = token.split('.')[1];
      const claims = JSON.parse(decodeURIComponent(escape(atob(part.replace(/-/g, '+').replace(/_/g, '/')))));
      return !claims.exp || claims.exp * 1000 < Date.now();
    } catch (e) { return true; }
  }

  // ============================================================
  //  后端请求封装
  // ============================================================
  async function api(path, body, method) {
    const headers = { 'Content-Type': 'application/json' };
    if (CFG.api.publishableKey) headers['X-Publishable-Key'] = CFG.api.publishableKey;
    const t = getToken();
    if (t) headers['Authorization'] = 'Bearer ' + t;

    let res;
    try {
      res = await fetch(API + path, {
        method: method || (body === undefined ? 'GET' : 'POST'),
        headers,
        body: body === undefined ? undefined : JSON.stringify(body)
      });
    } catch (e) {
      return { code: 500, msg: '无法连接后端（' + API + '），请确认 Python 服务已启动' };
    }

    let j = null;
    try { j = await res.json(); } catch (e) { /* 非 JSON 响应 */ }

    if (res.ok) return j || { code: 200 };
    if (j && typeof j.code === 'number') return j;
    const detail = j && j.detail;
    return {
      code: res.status,
      msg: (typeof detail === 'string' && detail) || (j && j.msg) || ('请求失败（HTTP ' + res.status + '）')
    };
  }

  // ============================================================
  //  数据接口（对应后端 REST 端点）
  // ============================================================
  async function getUsers() {
    const r = await api('/api/users');
    if (r.code === 200 && Array.isArray(r.data)) return r.data;
    console.warn('读取用户失败:', r.msg);
    return [];
  }
  async function saveUsers(users) {
    const r = await api('/api/users/save', { users });
    return r.code === 200 ? { ok: true } : { ok: false, error: r.msg };
  }
  async function getMaps() {
    const r = await api('/api/maps');
    if (r.code === 200 && Array.isArray(r.data)) return r.data;
    console.warn('读取地图失败:', r.msg);
    return [];
  }
  async function saveMaps(maps) {
    const r = await api('/api/maps/save', { maps });
    return r.code === 200 ? { ok: true } : { ok: false, error: r.msg };
  }
  async function getShips() {
    const r = await api('/api/ships');
    if (r.code === 200 && r.data && typeof r.data === 'object') return r.data;
    console.warn('读取舰船数据失败:', r.msg);
    return {};
  }
  async function saveShips(ships) {
    const r = await api('/api/ships/save', { ships });
    return r.code === 200 ? { ok: true } : { ok: false, error: r.msg };
  }

  // ============================================================
  //  业务接口（后端 services，返回 {code,msg,data}）
  // ============================================================
  async function register(username, password) {
    return api('/api/auth/register', { username, password });
  }

  async function login(username, password) {
    const r = await api('/api/auth/login', { username, password });
    if (r.code === 200 && r.data && r.data.token) {
      setSession(r.data.token);
      delete r.data.token; // token 不进 localStorage 的 ueg_current_user
    }
    return r;
  }

  async function getUserProfile(username) {
    return api('/api/auth/profile?username=' + encodeURIComponent(username || ''));
  }

  async function updateRecord(username, record) {
    return api('/api/auth/record', { username, record: Number(record) || 0 });
  }

  /** 直接设置用户字段（admin.html 使用；白名单由后端校验） */
  async function updateUser(username, patch) {
    return api('/api/users/update', { username, patch });
  }

  async function changePassword(username, oldPw, newPw) {
    return api('/api/auth/password', { username, old_password: oldPw || '', new_password: newPw });
  }

  async function deleteUser(username) {
    return api('/api/auth/user/' + encodeURIComponent(username || ''), undefined, 'DELETE');
  }

  async function getAllUsers() {
    const r = await api('/api/users');
    if (r.code === 200 && Array.isArray(r.data)) return r;
    return r;
  }

  async function createMap(mapData, creator) {
    return api('/api/maps', mapData || {});
  }

  async function updateMap(id, mapData, username) {
    return api('/api/maps/' + encodeURIComponent(id || ''), mapData || {}, 'PUT');
  }

  async function deleteMap(id, username) {
    return api('/api/maps/' + encodeURIComponent(id || ''), undefined, 'DELETE');
  }

  // ============================================================
  //  批量导入（管理员）
  // ============================================================
  async function importShipsFromJs(jsContent) {
    const r = await api('/api/import/ships', { content: String(jsContent || '') });
    if (r.code === 200) return { ok: true, count: r.data.count };
    return { ok: false, msg: r.msg };
  }

  async function importUsersJson(jsonString) {
    const r = await api('/api/import/users', { content: String(jsonString || '') });
    if (r.code === 200) return { ok: true, count: r.data.count };
    return { ok: false, msg: r.msg };
  }

  async function importMapsJson(jsonString) {
    const r = await api('/api/import/maps', { content: String(jsonString || '') });
    if (r.code === 200) return { ok: true, count: r.data.count };
    return { ok: false, msg: r.msg };
  }

  // ============================================================
  //  对外 DB 接口（签名与之前版本完全一致）
  // ============================================================
  window.DB = {

    // ---------- 会话管理 ----------
    hasToken() { return !!getToken(); },
    getSession() { return { has: !!getToken() }; },

    /** 已废弃：GitHub Token 方案移除，登录由后端签发 JWT */
    async setToken() { return { ok: false, error: '已废弃：GitHub Token 不再需要，请直接注册/登录账号' }; },
    /** 已废弃：无需解锁 Token */
    async unlockToken() { return { ok: false, error: '已废弃：无需解锁 Token，请直接注册/登录账号' }; },

    lockToken() {
      clearSession();
      return { ok: true };
    },
    logout() { return this.lockToken(); },

    async checkSession() {
      const t = getToken();
      if (!t) return { ok: false };
      if (tokenExpired(t)) { clearSession(); return { ok: false }; }
      return { ok: true };
    },

    /** 连通性测试：后端可达性 + 登录态 */
    async testConnection() {
      const h = await api('/api/health');
      if (h.code !== 200) return { ok: false, error: h.msg };
      if (!getToken()) return { ok: true, note: '后端可达，尚未登录' };
      const me = await api('/api/auth/me');
      if (me.code === 200) return { ok: true, note: '后端可达，已登录：' + me.data.username };
      return { ok: false, error: '后端可达，但登录态无效：' + me.msg };
    },

    // ---------- 用户系统 ----------
    getUsers, saveUsers, register, login, getUserProfile, updateRecord, updateUser,
    changePassword, deleteUser, getAllUsers,

    // ---------- 地图系统 ----------
    getMaps, saveMaps, createMap, updateMap, deleteMap,

    // ---------- 舰船数据 ----------
    getShips, saveShips,

    // ---------- 批量导入 ----------
    importShipsFromJs, importUsersJson, importMapsJson
  };

  console.log('✅ GitHub 数据库模块（后端代理版 · JWT 会话）已加载，后端地址: ' + API);
})();
