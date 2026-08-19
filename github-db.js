// ============================================================
//  github-db.js —— 纯前端版（GitHub API 直接读写私有仓库）
//  依赖：config.js（owner/repo/branch/files）
//
//  ★ 安全模型（纯前端可达的最强）★
//   · GitHub Token 不存明文：在 token.html 用"主密码"加密后
//     存 localStorage（PBKDF2-SHA256 10万次迭代 → AES-GCM-256）
//   · 主密码不持久化；解密后的 Token 仅存内存变量，
//     可选"本次浏览器会话内记住"（sessionStorage，关闭标签页即清）
//   · 读写直连 GitHub Contents API，写操作自动带 sha 防冲突
//   · 未解锁 Token 时：读操作返回空数据，写操作返回错误提示
//
//  ⚠️ 限制说明：纯前端方案中，持有 Token 者即拥有全部读写权限，
//     且 users.json 内密码为明文（与既有数据兼容）。
//     本方案定位"个人/内部使用"（对应项目文档第 2 阶段）。
//
//  ★ DB 方法签名与之前版本完全一致，页面调用无需改动 ★
// ============================================================
(function () {
  const CFG = window.GITHUB_CONFIG;

  if (!CFG || !CFG.owner || !CFG.repo) {
    console.error('❌ 请先配置 config.js（owner/repo/branch/files）');
    return;
  }

  // ============================================================
  //  Token 加密存储（AES-GCM-256 + PBKDF2）
  // ============================================================
  const SALT = 'ueg-lagrange-v1';
  const LS_ENC = 'ueg_token_enc';        // localStorage 密文
  const SS_SESSION = 'ueg_token_session'; // sessionStorage 会话缓存
  let memToken = null;                    // 内存中的解密 Token

  const b64 = (s) => btoa(unescape(encodeURIComponent(s)));
  const unb64 = (s) => decodeURIComponent(escape(atob(s)));
  const b64urlBytes = (bytes) => {
    let s = '';
    bytes.forEach(b => { s += String.fromCharCode(b); });
    return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };
  const unb64urlBytes = (s) => {
    const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
    const u = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
    return u;
  };

  async function deriveKey(password) {
    const enc = new TextEncoder();
    const km = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: enc.encode(SALT), iterations: 100000, hash: 'SHA-256' },
      km,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  async function encryptToken(password, token) {
    const key = await deriveKey(password);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(token));
    const payload = new Uint8Array(iv.length + ct.byteLength);
    payload.set(iv, 0);
    payload.set(new Uint8Array(ct), iv.length);
    localStorage.setItem(LS_ENC, b64urlBytes(payload));
  }

  async function decryptToken(password) {
    const raw = localStorage.getItem(LS_ENC);
    if (!raw) throw new Error('尚未保存 Token，请先访问 token.html 设置');
    const data = unb64urlBytes(raw);
    const iv = data.slice(0, 12);
    const ct = data.slice(12);
    try {
      const key = await deriveKey(password);
      const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
      return new TextDecoder().decode(pt);
    } catch (e) {
      throw new Error('主密码错误，无法解密 Token');
    }
  }

  async function getToken() {
    if (memToken) return memToken;
    const s = sessionStorage.getItem(SS_SESSION);
    if (s) { memToken = s; return s; }
    throw new Error('Token 未解锁：请先在 token.html 输入主密码解锁');
  }

  // ============================================================
  //  GitHub Contents API 直连
  // ============================================================
  const GH = `https://api.github.com/repos/${CFG.owner}/${CFG.repo}/contents`;
  const HDR = (token) => ({
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
  });

  async function ghGet(file) {
    const token = await getToken();
    const res = await fetch(`${GH}/${encodeURIComponent(file)}?ref=${encodeURIComponent(CFG.branch)}`, { headers: HDR(token) });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`GitHub 读取失败（${res.status}）`);
    return res.json();
  }

  async function readJson(file) {
    const j = await ghGet(file);
    if (!j) return null;
    return { data: JSON.parse(unb64(j.content)), sha: j.sha };
  }

  async function ghPut(file, obj, sha) {
    const token = await getToken();
    const content = b64(JSON.stringify(obj, null, 2));
    const build = (s) => ({ message: `[UEG] update ${file}`, content, branch: CFG.branch, ...(s ? { sha: s } : {}) });
    const put = (b) => fetch(`${GH}/${encodeURIComponent(file)}`, {
      method: 'PUT',
      headers: { ...HDR(token), 'Content-Type': 'application/json' },
      body: JSON.stringify(b)
    });
    let body = build(sha);
    let res = await put(body);
    // 并发冲突 409：重读最新 sha 重试一次
    if (res.status === 409) {
      const latest = await ghGet(file);
      if (latest) { body = build(latest.sha); res = await put(body); }
    }
    if (!res.ok) {
      const t = (await res.text()).slice(0, 200);
      throw new Error(`GitHub 写入失败（${res.status}）${t}`);
    }
    return { ok: true };
  }

  // 带默认结构的数据读写（读失败返回空，写失败返回 {ok:false,error}）
  async function getUsers() {
    try { const r = await readJson(CFG.files.users); return r?.data?.users || []; }
    catch (e) { console.warn('读取用户失败:', e.message); return []; }
  }
  async function saveUsers(users) {
    try { const cur = await readJson(CFG.files.users); await ghPut(CFG.files.users, { users }, cur?.sha); return { ok: true }; }
    catch (e) { return { ok: false, error: e.message }; }
  }
  async function getMaps() {
    try { const r = await readJson(CFG.files.maps); return r?.data?.maps || []; }
    catch (e) { console.warn('读取地图失败:', e.message); return []; }
  }
  async function saveMaps(maps) {
    try { const cur = await readJson(CFG.files.maps); await ghPut(CFG.files.maps, { maps }, cur?.sha); return { ok: true }; }
    catch (e) { return { ok: false, error: e.message }; }
  }
  async function getShips() {
    try { const r = await readJson(CFG.files.ships); return r?.data?.ships || {}; }
    catch (e) { console.warn('读取舰船数据失败:', e.message); return {}; }
  }
  async function saveShips(ships) {
    try { const cur = await readJson(CFG.files.ships); await ghPut(CFG.files.ships, { ships }, cur?.sha); return { ok: true }; }
    catch (e) { return { ok: false, error: e.message }; }
  }

  // ============================================================
  //  业务逻辑（前端实现，与旧版行为一致）
  // ============================================================
  const isAdminName = (u) => u === CFG.adminUser || u === 'admin';

  async function register(username, password) {
    username = (username || '').trim();
    if (!/^[\u4e00-\u9fa5A-Za-z0-9_]{2,20}$/.test(username)) return { code: 400, msg: '用户名需为 2-20 位中文/字母/数字/下划线' };
    if (!password || password.length < 6) return { code: 400, msg: '密码长度至少 6 位' };
    const users = await getUsers();
    if (users.some(u => u.username === username)) return { code: 400, msg: '用户名已存在' };
    const user = { username, password, is_admin: isAdminName(username), highest_record: 0 };
    users.push(user);
    const r = await saveUsers(users);
    if (!r.ok) return { code: 500, msg: '保存失败: ' + r.error };
    return { code: 200, msg: '注册成功', data: { username: user.username, is_admin: user.is_admin, highest_record: user.highest_record } };
  }

  async function login(username, password) {
    const users = await getUsers();
    const user = users.find(u => u.username === username);
    if (!user) return { code: 400, msg: '用户名不存在' };
    if (user.password !== password) return { code: 400, msg: '密码错误' };
    return { code: 200, msg: '登录成功', data: { username: user.username, is_admin: user.is_admin, highest_record: user.highest_record } };
  }

  async function getUserProfile(username) {
    const users = await getUsers();
    const u = users.find(x => x.username === username);
    if (!u) return { code: 404, msg: '用户不存在' };
    return { code: 200, data: { username: u.username, is_admin: u.is_admin, highest_record: u.highest_record } };
  }

  async function updateRecord(username, record) {
    const users = await getUsers();
    const u = users.find(x => x.username === username);
    if (!u) return { code: 404, msg: '用户不存在' };
    u.highest_record = Math.max(u.highest_record || 0, Number(record) || 0);
    const r = await saveUsers(users);
    if (!r.ok) return { code: 500, msg: '保存失败: ' + r.error };
    return { code: 200, msg: '更新成功', data: { highest_record: u.highest_record } };
  }

  async function changePassword(username, oldPw, newPw) {
    if (!newPw || newPw.length < 6) return { code: 400, msg: '新密码长度至少 6 位' };
    const users = await getUsers();
    const u = users.find(x => x.username === username);
    if (!u) return { code: 404, msg: '用户不存在' };
    if (u.password !== oldPw) return { code: 400, msg: '旧密码错误' };
    u.password = newPw;
    const r = await saveUsers(users);
    if (!r.ok) return { code: 500, msg: '保存失败: ' + r.error };
    return { code: 200, msg: '密码修改成功' };
  }

  async function deleteUser(username) {
    const users = await getUsers();
    const target = users.find(u => u.username === username);
    if (!target) return { code: 404, msg: '用户不存在' };
    if (target.is_admin) return { code: 400, msg: '不可删除管理员' };
    const r = await saveUsers(users.filter(u => u.username !== username));
    if (!r.ok) return { code: 500, msg: '删除失败: ' + r.error };
    return { code: 200, msg: '删除成功' };
  }

  async function getAllUsers() {
    const users = await getUsers();
    return { code: 200, data: users.map(u => ({ username: u.username, is_admin: u.is_admin, highest_record: u.highest_record })) };
  }

  async function createMap(mapData, creator) {
    mapData = mapData || {};
    const maps = await getMaps();
    const newMap = {
      id: 'map_' + Date.now(),
      name: mapData.name || '未命名地图',
      type: mapData.type || 'template',
      protocol: mapData.protocol || null,
      creator: (creator || '未知').toString().slice(0, 50),
      created_at: new Date().toISOString(),
      shapes: Array.isArray(mapData.shapes) ? mapData.shapes : []
    };
    maps.unshift(newMap);
    const r = await saveMaps(maps);
    if (!r.ok) return { code: 500, msg: '创建失败: ' + r.error };
    return { code: 200, msg: '创建成功', data: newMap };
  }

  async function updateMap(id, mapData, username) {
    const maps = await getMaps();
    const idx = maps.findIndex(m => m.id === id);
    if (idx === -1) return { code: 404, msg: '地图不存在' };
    const map = maps[idx];
    if (map.type === 'template' && !isAdminName(username)) return { code: 403, msg: '无权限修改模板地图' };
    maps[idx] = { ...map, ...(mapData || {}), id: map.id };
    const r = await saveMaps(maps);
    if (!r.ok) return { code: 500, msg: '更新失败: ' + r.error };
    return { code: 200, msg: '更新成功', data: maps[idx] };
  }

  async function deleteMap(id, username) {
    const maps = await getMaps();
    const map = maps.find(m => m.id === id);
    if (!map) return { code: 404, msg: '地图不存在' };
    if (map.type === 'template' && !isAdminName(username)) return { code: 403, msg: '无权限删除模板地图' };
    const r = await saveMaps(maps.filter(m => m.id !== id));
    if (!r.ok) return { code: 500, msg: '删除失败: ' + r.error };
    return { code: 200, msg: '删除成功' };
  }

  async function importShipsFromJs(jsContent) {
    const m = String(jsContent || '').match(/window\.SHIPS_DATA\s*=\s*(\{[\s\S]*\})/);
    if (!m) return { ok: false, msg: '未找到 window.SHIPS_DATA' };
    try {
      const ships = JSON.parse(m[1]);
      const r = await saveShips(ships);
      if (!r.ok) return { ok: false, msg: r.error };
      return { ok: true, count: Object.keys(ships).length };
    } catch (e) { return { ok: false, msg: '解析失败: ' + e.message }; }
  }

  async function importUsersJson(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      const list = Array.isArray(parsed) ? parsed : parsed.users;
      if (!Array.isArray(list)) return { ok: false, msg: '格式不正确' };
      const r = await saveUsers(list);
      if (!r.ok) return { ok: false, msg: r.error };
      return { ok: true, count: list.length };
    } catch (e) { return { ok: false, msg: '解析失败: ' + e.message }; }
  }

  async function importMapsJson(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      const list = Array.isArray(parsed) ? parsed : parsed.maps;
      if (!Array.isArray(list)) return { ok: false, msg: '格式不正确' };
      const r = await saveMaps(list);
      if (!r.ok) return { ok: false, msg: r.error };
      return { ok: true, count: list.length };
    } catch (e) { return { ok: false, msg: '解析失败: ' + e.message }; }
  }

  // ============================================================
  //  对外 DB 接口（签名与之前版本完全一致）
  // ============================================================
  window.DB = {

    // ---------- Token 管理 ----------
    hasToken() { return !!localStorage.getItem(LS_ENC); },
    getSession() { return { has: !!(memToken || sessionStorage.getItem(SS_SESSION)) }; },

    /** 加密保存 Token（token.html 调用） */
    async setToken(password, token) {
      if (!password || password.length < 8) throw new Error('主密码至少 8 位');
      if (!token || token.length < 10) throw new Error('Token 无效');
      await encryptToken(password, token.trim());
      return { ok: true };
    },

    /** 主密码解锁 Token 到内存（remember=true 时本会话内记住） */
    async unlockToken(password, remember) {
      const token = await decryptToken(password);
      memToken = token;
      if (remember) sessionStorage.setItem(SS_SESSION, token);
      return { ok: true };
    },

    lockToken() {
      memToken = null;
      sessionStorage.removeItem(SS_SESSION);
      return { ok: true };
    },
    logout() { return this.lockToken(); },
    async checkSession() { return { ok: this.getSession().has }; },

    /** 验证 Token 是否可访问私有仓库 */
    async testConnection() {
      try {
        const token = await getToken();
        const res = await fetch(`${GH}/${encodeURIComponent(CFG.files.users)}?ref=${encodeURIComponent(CFG.branch)}`, { headers: HDR(token) });
        if (res.status === 404) return { ok: true, note: '仓库可访问（users.json 尚不存在，写入时自动创建）' };
        if (res.ok) return { ok: true };
        return { ok: false, error: 'HTTP ' + res.status };
      } catch (e) { return { ok: false, error: e.message }; }
    },

    // ---------- 用户系统 ----------
    getUsers, saveUsers, register, login, getUserProfile, updateRecord, changePassword, deleteUser, getAllUsers,

    // ---------- 地图系统 ----------
    getMaps, saveMaps, createMap, updateMap, deleteMap,

    // ---------- 舰船数据 ----------
    getShips, saveShips,

    // ---------- 批量导入 ----------
    importShipsFromJs, importUsersJson, importMapsJson
  };

  console.log('✅ GitHub 数据库模块（纯前端直连版 · Token 加密存储）已加载');
})();
