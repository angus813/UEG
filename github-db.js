// ============================================================
// UEG 数据层 —— 双后端模式（window.DB 接口保持稳定，页面零改动）
//   Supabase 模式（默认）：前端直连 Supabase Auth + PostgREST
//   Local 模式（备选）   ：本地 Python 后端（github-db.js 旧实现保留）
// ============================================================
(function () {
  const CFG = window.UEG_CONFIG || {};
  const MODE = CFG.mode === 'local' ? 'local' : 'supabase';
  const SB = CFG.supabase || {};
  const API = CFG.api || {};

  // ================= 通用工具 =================
  function encEmail(username) {
    return encodeURIComponent(username) + '@ueg.local';
  }
  function enc(v) {
    return encodeURIComponent(String(v));
  }
  function getToken() {
    return localStorage.getItem('ueg_token');
  }
  function setToken(t) {
    if (t) localStorage.setItem('ueg_token', t);
    else localStorage.removeItem('ueg_token');
  }
  function tokenExpired(t) {
    try {
      const p = JSON.parse(atob(t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      if (!p.exp) return false; // 无 exp 的 token 视为有效（有效性交由后端校验）
      return p.exp * 1000 < Date.now();
    } catch (e) { return true; }
  }
  function currentUsername() {
    try {
      const cu = JSON.parse(localStorage.getItem('ueg_current_user') || 'null');
      return (cu && cu.username) || '';
    } catch (e) { return ''; }
  }
  function setCurrentUser(u) {
    if (u) localStorage.setItem('ueg_current_user', JSON.stringify(u));
    else localStorage.removeItem('ueg_current_user');
  }
  function newMapId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'map_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  }

  // ================= Supabase 模式 =================
  const SB_IMPL = {
    // ---- GoTrue（Auth）----
    async gt(path, body) {
      const headers = { apikey: SB.publishableKey, 'Content-Type': 'application/json' };
      const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 10000) : null;
      let res;
      try {
        res = await fetch(SB.url.replace(/\/+$/, '') + path, {
          method: 'POST', headers, body: JSON.stringify(body), signal: ctrl ? ctrl.signal : undefined
        });
      } catch (e) {
        return { code: 500, msg: '无法连接 Supabase（' + SB.url + '）' };
      } finally {
        if (timer) clearTimeout(timer);
      }
      let j = null;
      try { j = await res.json(); } catch (e) { }
      if (res.ok) return { code: 200, data: j };
      const msg = (j && (j.msg || j.error_description || j.message)) || ('请求失败（HTTP ' + res.status + '）');
      return { code: res.status, msg: msg, body: j };
    },

    // ---- PostgREST（数据）----
    async rest(path, opts) {
      const headers = {
        apikey: SB.publishableKey,
        'Content-Type': 'application/json',
        'X-Client-Info': 'ueg-web/2.0'
      };
      const t = getToken();
      if (t) headers.Authorization = 'Bearer ' + t;
      if (opts && opts.prefer) headers.Prefer = opts.prefer;
      const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 15000) : null;
      let res;
      try {
        res = await fetch(SB.url.replace(/\/+$/, '') + path, {
          method: (opts && opts.method) || 'GET',
          headers,
          body: opts && opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
          signal: ctrl ? ctrl.signal : undefined
        });
      } catch (e) {
        return { code: 500, msg: '无法连接 Supabase（' + SB.url + '）' };
      } finally {
        if (timer) clearTimeout(timer);
      }
      let j = null;
      try { j = await res.json(); } catch (e) { }
      if (res.ok) return { code: 200, data: j };
      const msg = (j && (j.message || j.msg || j.error_description || j.detail)) || ('请求失败（HTTP ' + res.status + '）');
      return { code: res.status, msg: msg, body: j };
    },

    // ---- 注册 ----
    async register(username, password) {
      username = (username || '').trim();
      if (!/^[\u4e00-\u9fa5A-Za-z0-9_]{2,20}$/.test(username)) return { code: 400, msg: '用户名需为2-20位中文/字母/数字/下划线' };
      if (/^(angus|admin)$/i.test(username)) return { code: 400, msg: '该用户名不可注册' };
      if (!password || password.length < 6) return { code: 400, msg: '密码长度至少6位' };
      const r = await this.gt('/auth/v1/signup', { email: encEmail(username), password, data: { username } });
      if (r.code !== 200) {
        if (r.body && (r.body.code === 'email_exists' || r.body.code === 'user_already_exists')) return { code: 400, msg: '用户名已存在' };
        if (r.body && (r.body.code === 'signup_disabled')) return { code: 400, msg: '注册功能未开启' };
        return r;
      }
      // 建档（RLS 允许插入自己的档案行）；signup 无 session 时留待登录后补建
      if (r.data && r.data.access_token) {
        setToken(r.data.access_token);
        const pr = await this.rest('/rest/v1/users', { method: 'POST', body: { username, is_admin: false, highest_record: 0 } });
        if (pr.code !== 200) return { code: 500, msg: '账号已创建，但档案初始化失败（' + pr.msg + '），请重新登录' };
      }
      return { code: 200, msg: '注册成功', data: { username, is_admin: false, highest_record: 0 } };
    },

    // ---- 登录 ----
    async login(username, password) {
      username = (username || '').trim();
      const r = await this.gt('/auth/v1/token?grant_type=password', { email: encEmail(username), password });
      if (r.code !== 200) {
        if (r.body && r.body.code === 'email_not_confirmed') return { code: 400, msg: '邮箱未确认：请在 Supabase Dashboard 关闭“Confirm email”后重试' };
        if (r.body && r.body.code === 'invalid_credentials') return { code: 400, msg: '用户名或密码错误' };
        return r;
      }
      const token = r.data.access_token;
      setToken(token);
      // 读取档案（不存在则自动补建，兼容注册后未建档的情况）
      const me = await this.rest('/rest/v1/users?select=username,is_admin,highest_record&username=eq.' + enc(username));
      let profile = null;
      if (me.code === 200 && Array.isArray(me.data) && me.data.length) profile = me.data[0];
      if (!profile) {
        const pr = await this.rest('/rest/v1/users', { method: 'POST', body: { username, is_admin: false, highest_record: 0 } });
        if (pr.code !== 200) { setToken(null); return { code: 500, msg: '登录成功但档案初始化失败（' + pr.msg + '），请稍后重试' }; }
        profile = { username, is_admin: false, highest_record: 0 };
      }
      const data = { username, is_admin: !!profile.is_admin, highest_record: profile.highest_record || 0 };
      setCurrentUser(data);
      return { code: 200, msg: '登录成功', data: data };
    },

    // ---- 用户 ----
    async getUsers() {
      const r = await this.rest('/rest/v1/users?select=username,is_admin,highest_record&order=username');
      return (r.code === 200 && Array.isArray(r.data)) ? r.data : [];
    },
    async getAllUsers() {
      const users = await this.getUsers();
      return { code: 200, data: users };
    },
    async getUserProfile(username) {
      const r = await this.rest('/rest/v1/users?select=username,is_admin,highest_record&username=eq.' + enc(username));
      if (r.code === 200 && Array.isArray(r.data) && r.data.length) {
        const u = r.data[0];
        return { code: 200, data: { username: u.username, is_admin: !!u.is_admin, highest_record: u.highest_record || 0 } };
      }
      return { code: 404, msg: '用户不存在' };
    },
    async saveUsers(users) {
      if (!Array.isArray(users)) return { ok: false, error: '参数错误' };
      for (const u of users) {
        if (!u || !u.username) continue;
        const patch = { highest_record: Math.max(0, parseInt(u.highest_record) || 0), is_admin: !!u.is_admin };
        const r = await this.rest('/rest/v1/users?username=eq.' + enc(u.username), {
          method: 'PATCH', body: patch, prefer: 'return=representation'
        });
        if (r.code === 200 && Array.isArray(r.data) && r.data.length) continue;
        // 不存在 → 插入
        const ins = await this.rest('/rest/v1/users', { method: 'POST', body: { username: u.username, ...patch } });
        if (ins.code !== 200) return { ok: false, error: ins.msg };
      }
      return { ok: true };
    },
    async updateRecord(username, record) {
      const val = Math.max(0, parseInt(record) || 0);
      if (val <= 0) return { code: 400, msg: '纪录无效' };
      // 条件更新：仅当现有纪录低于新值时写入，杜绝读-改-写竞态回退
      const u = await this.rest('/rest/v1/users?username=eq.' + enc(username) + '&highest_record=lt.' + val, {
        method: 'PATCH', body: { highest_record: val }, prefer: 'return=representation'
      });
      if (u.code !== 200) return { code: 403, msg: '无权限修改（只能修改自己或管理员）' };
      const hit = Array.isArray(u.data) && u.data.length;
      return { code: 200, msg: hit ? '更新成功' : '已有更高纪录，未覆盖', data: { highest_record: hit ? u.data[0].highest_record : val } };
    },
    async updateUser(username, patch) {
      const p = {};
      if (patch && 'highest_record' in patch) p.highest_record = Math.max(0, parseInt(patch.highest_record) || 0);
      if (!Object.keys(p).length) return { ok: false, error: '无有效字段' };
      const r = await this.rest('/rest/v1/users?username=eq.' + enc(username), {
        method: 'PATCH', body: p, prefer: 'return=representation'
      });
      if (r.code !== 200 || !(Array.isArray(r.data) && r.data.length)) return { ok: false, error: '无权限修改（只能修改自己或管理员）' };
      return { ok: true, data: p };
    },
    async changePassword(username, oldPw, newPw) {
      if (!newPw || newPw.length < 6) return { code: 400, msg: '密码长度至少6位' };
      // GoTrue：登录状态下直接更新密码（服务端校验旧密码需另行 reauth，此处省略）
      const r = await this.rest('/auth/v1/user', { method: 'PUT', body: { password: newPw } });
      if (r.code !== 200) return { code: 400, msg: '密码修改失败: ' + r.msg };
      // GoTrue 改密后旧 access_token 立即失效：清除本地会话，引导重新登录
      setToken(null);
      setCurrentUser(null);
      return { code: 200, msg: '密码修改成功，请重新登录' };
    },
    async deleteUser(username) {
      const r = await this.rest('/rest/v1/users?username=eq.' + enc(username), { method: 'DELETE' });
      if (r.code !== 200) return { code: 403, msg: r.msg };
      if (username === currentUsername()) {
        setToken(null);
        setCurrentUser(null);
      }
      return { code: 200, msg: '账号已删除（认证信息如需彻底注销，请联系管理员运行同步脚本）' };
    },

    // ---- 地图 ----
    async getMaps() {
      const r = await this.rest('/rest/v1/guild_maps?select=*&order=created_at.asc');
      return (r.code === 200 && Array.isArray(r.data)) ? r.data : [];
    },
    async saveMaps(maps) {
      if (!Array.isArray(maps)) return { ok: false, error: '参数错误' };
      for (const m of maps) {
        if (!m || !m.id) continue;
        const r = await this.rest('/rest/v1/guild_maps?id=eq.' + enc(m.id), {
          method: 'PATCH',
          body: { name: m.name, type: m.type, protocol: m.protocol, shapes: m.shapes || [] },
          prefer: 'return=representation'
        });
        if (r.code === 200 && Array.isArray(r.data) && r.data.length) continue;
        const ins = await this.rest('/rest/v1/guild_maps', {
          method: 'POST',
          body: { id: m.id, name: m.name || '未命名地图', type: m.type || 'template', protocol: m.protocol, creator: m.creator || currentUsername() || '未知', shapes: m.shapes || [] }
        });
        if (ins.code !== 200) return { ok: false, error: ins.msg };
      }
      return { ok: true };
    },
    async createMap(mapData, creator) {
      mapData = mapData || {};
      const row = {
        id: newMapId(),
        name: mapData.name || '未命名地图',
        type: mapData.type || 'template',
        protocol: mapData.protocol || null,
        creator: currentUsername() || creator || '未知',
        shapes: Array.isArray(mapData.shapes) ? mapData.shapes : []
      };
      const r = await this.rest('/rest/v1/guild_maps', { method: 'POST', body: row });
      if (r.code !== 200) return { code: 400, msg: '保存失败: ' + r.msg };
      return { code: 200, msg: '创建成功', data: row };
    },
    async updateMap(id, mapData, username) {
      mapData = mapData || {};
      const patch = {};
      for (const k of ['name', 'type', 'protocol', 'shapes', 'creator']) {
        if (k in mapData) patch[k] = mapData[k];
      }
      if (!Object.keys(patch).length) return { code: 400, msg: '无更新内容' };
      const r = await this.rest('/rest/v1/guild_maps?id=eq.' + enc(id), {
        method: 'PATCH', body: patch, prefer: 'return=representation'
      });
      if (r.code !== 200 || !(Array.isArray(r.data) && r.data.length)) {
        return { code: 403, msg: '无权限修改（模板地图仅管理员可改）' };
      }
      return { code: 200, msg: '保存成功' };
    },
    async deleteMap(id, username) {
      const r = await this.rest('/rest/v1/guild_maps?id=eq.' + enc(id), {
        method: 'DELETE', prefer: 'return=representation'
      });
      if (r.code !== 200 || !(Array.isArray(r.data) && r.data.length)) {
        return { code: 403, msg: '无权限删除（模板地图仅管理员可删）' };
      }
      return { code: 200, msg: '删除成功' };
    },

    // ---- 舰船数据 ----
    async getShips() {
      const r = await this.rest('/rest/v1/ships_data?select=data&id=eq.default');
      return (r.code === 200 && Array.isArray(r.data) && r.data.length && r.data[0].data) ? r.data[0].data : {};
    },
    async saveShips(ships) {
      const r = await this.rest('/rest/v1/ships_data?id=eq.default', {
        method: 'PATCH', body: { data: ships || {} }, prefer: 'return=representation'
      });
      if (r.code === 200 && Array.isArray(r.data) && r.data.length) return { ok: true };
      if (r.code !== 200 && r.code !== 204) return { ok: false, error: r.msg };
      // 默认行不存在（PATCH 未命中）→ 改为 upsert 插入
      const ins = await this.rest('/rest/v1/ships_data', {
        method: 'POST', body: { id: 'default', data: ships || {} }, prefer: 'return=representation'
      });
      if (ins.code !== 200) return { ok: false, error: ins.msg };
      return { ok: true };
    },

    // ---- 导入 ----
    async importShipsFromJs(jsContent) {
      try {
        const text = String(jsContent || '');
        const idx = text.indexOf('window.SHIPS_DATA');
        const eq = idx >= 0 ? text.indexOf('=', idx) : -1;
        if (idx < 0 || eq < 0) return { ok: false, msg: '未找到 window.SHIPS_DATA 定义' };
        const start = text.indexOf('{', eq);
        if (start < 0) return { ok: false, msg: '未找到有效对象' };
        // 括号配对扫描（跳过字符串字面量），提取顶层对象区间
        let depth = 0, end = -1, inStr = false, strCh = '';
        for (let i = start; i < text.length; i++) {
          const ch = text[i];
          if (inStr) { if (ch === strCh) inStr = false; continue; }
          if (ch === '"' || ch === "'" || ch === '`') { inStr = true; strCh = ch; continue; }
          if (ch === '{') depth++;
          else if (ch === '}') { depth--; if (depth === 0) { end = i + 1; break; } }
        }
        if (end < 0) return { ok: false, msg: '对象括号未闭合' };
        const snippet = text.slice(start, end);
        let ships;
        try { ships = JSON.parse(snippet); }
        catch (e1) {
          try { ships = new Function('return ' + snippet)(); }
          catch (e2) { return { ok: false, msg: '解析失败: ' + e2.message }; }
        }
        if (!ships || typeof ships !== 'object' || Array.isArray(ships)) return { ok: false, msg: '解析结果不是舰船对象' };
        const r = await this.saveShips(ships);
        if (!r.ok) return { ok: false, msg: r.error };
        return { ok: true, count: Object.keys(ships).length };
      } catch (e) {
        return { ok: false, msg: '解析失败: ' + e.message };
      }
    },
    async importUsersJson(jsonString) {
      try {
        let lst = JSON.parse(jsonString || '[]');
        lst = Array.isArray(lst) ? lst : (lst.users || []);
        const valid = lst.filter(function (u) { return u && u.username; }).length;
        const r = await this.saveUsers(lst);
        if (!r.ok) return { ok: false, msg: r.error };
        return { ok: true, count: valid };
      } catch (e) {
        return { ok: false, msg: '解析失败: ' + e.message };
      }
    },
    async importMapsJson(jsonString) {
      try {
        let lst = JSON.parse(jsonString || '[]');
        lst = Array.isArray(lst) ? lst : (lst.guild_maps || []);
        const valid = lst.filter(function (m) { return m && m.id; }).length;
        const r = await this.saveMaps(lst);
        if (!r.ok) return { ok: false, msg: r.error };
        return { ok: true, count: valid };
      } catch (e) {
        return { ok: false, msg: '解析失败: ' + e.message };
      }
    },

    // ---- 会话 ----
    hasToken() { return !!getToken(); },
    getSession() { return { has: !!getToken() }; },
    checkSession() {
      const t = getToken();
      if (!t) return Promise.resolve({ ok: false });
      if (tokenExpired(t)) { setToken(null); return Promise.resolve({ ok: false }); }
      return Promise.resolve({ ok: true });
    },
    async setToken() { return { ok: false, error: '已废弃：Supabase 模式请直接注册/登录' }; },
    async unlockToken() { return { ok: false, error: '已废弃：无需解锁 Token，请直接登录' }; },
    async lockToken() { setToken(null); return { ok: true }; },
    async logout() { setToken(null); return { ok: true }; },
    async testConnection() {
      const r = await this.rest('/auth/v1/settings'); // 公开端点探测，根路径需 secret key
      if (r.code !== 200) return { ok: false, error: r.msg };
      const t = getToken();
      if (!t) return { ok: true, note: 'Supabase 连接正常（未登录）' };
      if (tokenExpired(t)) { setToken(null); return { ok: true, note: 'Supabase 连接正常（登录已过期）' }; }
      return { ok: true, note: 'Supabase 连接正常（已登录：' + currentUsername() + '）' };
    }
  };

  // ================= Local 模式（本地 Python 后端，备选） =================
  const LS_TOKEN = 'ueg_token';
  let memToken = null;
  function localGetToken() {
    return memToken || localStorage.getItem(LS_TOKEN);
  }
  async function localApi(path, body, method) {
    const headers = { 'Content-Type': 'application/json' };
    if (API.publishableKey) headers['X-Publishable-Key'] = API.publishableKey;
    const t = localGetToken();
    if (t) headers['Authorization'] = 'Bearer ' + t;
    const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 15000) : null;
    let res;
    try {
      res = await fetch(API.url.replace(/\/+$/, '') + path, {
        method: method || (body === undefined ? 'GET' : 'POST'),
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: ctrl ? ctrl.signal : undefined
      });
    } catch (e) {
      return { code: 500, msg: '无法连接后端（' + API.url + '），请确认 Python 服务已启动' };
    } finally {
      if (timer) clearTimeout(timer);
    }
    let j = null;
    try { j = await res.json(); } catch (e) { }
    if (res.ok) return j || { code: 200 };
    if (j && typeof j.code === 'number') return j;
    const detail = j && j.detail;
    return { code: res.status, msg: typeof detail === 'string' ? detail : (j && j.msg) || ('请求失败（HTTP ' + res.status + '）') };
  }
  const LOCAL_IMPL = {
    async register(username, password) {
      return localApi('/api/auth/register', { username, password });
    },
    async login(username, password) {
      const r = await localApi('/api/auth/login', { username, password });
      if (r.code === 200 && r.data && r.data.token) {
        memToken = r.data.token;
        localStorage.setItem(LS_TOKEN, r.data.token);
        delete r.data.token;
      }
      return r;
    },
    async getUsers() {
      const r = await localApi('/api/users');
      if (r.code === 200 && Array.isArray(r.data)) return r.data;
      return [];
    },
    async getAllUsers() {
      const r = await localApi('/api/users');
      return r;
    },
    async getUserProfile(username) {
      const r = await localApi('/api/auth/profile?username=' + encodeURIComponent(username));
      if (r.code === 200 && r.data) {
        // 与 Supabase 模式返回结构保持一致
        return { code: 200, data: { username: r.data.username, is_admin: !!r.data.is_admin, highest_record: r.data.highest_record || 0 } };
      }
      return r;
    },
    async saveUsers(users) {
      const r = await localApi('/api/users/save', { users });
      return r.code === 200 ? { ok: true } : { ok: false, error: r.msg };
    },
    async updateRecord(username, record) {
      return localApi('/api/auth/record', { username, record });
    },
    async updateUser(username, patch) {
      const r = await localApi('/api/users/update', { username, patch });
      return r.code === 200 ? { ok: true, data: r.data } : { ok: false, error: r.msg };
    },
    async changePassword(username, oldPw, newPw) {
      return localApi('/api/auth/password', { username, old_password: oldPw, new_password: newPw });
    },
    async deleteUser(username) {
      return localApi('/api/auth/user/' + encodeURIComponent(username), undefined, 'DELETE');
    },
    async getMaps() {
      const r = await localApi('/api/maps');
      return (r.code === 200 && Array.isArray(r.data)) ? r.data : [];
    },
    async saveMaps(maps) {
      const r = await localApi('/api/maps/save', { maps });
      return r.code === 200 ? { ok: true } : { ok: false, error: r.msg };
    },
    async createMap(mapData, creator) {
      return localApi('/api/maps', mapData || {});
    },
    async updateMap(id, mapData, username) {
      return localApi('/api/maps/' + encodeURIComponent(id), mapData || {}, 'PUT');
    },
    async deleteMap(id, username) {
      return localApi('/api/maps/' + encodeURIComponent(id), undefined, 'DELETE');
    },
    async getShips() {
      const r = await localApi('/api/ships');
      return (r.code === 200 && r.data) ? r.data : {};
    },
    async saveShips(ships) {
      const r = await localApi('/api/ships/save', { ships });
      return r.code === 200 ? { ok: true } : { ok: false, error: r.msg };
    },
    async importShipsFromJs(jsContent) {
      const r = await localApi('/api/import/ships', { content: String(jsContent || '') });
      return r.code === 200 ? { ok: true, count: r.data.count } : { ok: false, msg: r.msg };
    },
    async importUsersJson(jsonString) {
      const r = await localApi('/api/import/users', { content: String(jsonString || '') });
      return r.code === 200 ? { ok: true, count: r.data.count } : { ok: false, msg: r.msg };
    },
    async importMapsJson(jsonString) {
      const r = await localApi('/api/import/maps', { content: String(jsonString || '') });
      return r.code === 200 ? { ok: true, count: r.data.count } : { ok: false, msg: r.msg };
    },
    hasToken() { return !!localGetToken(); },
    getSession() { return { has: !!localGetToken() }; },
    checkSession() {
      const t = localGetToken();
      if (!t) return Promise.resolve({ ok: false });
      if (tokenExpired(t)) { memToken = null; localStorage.removeItem(LS_TOKEN); return Promise.resolve({ ok: false }); }
      return Promise.resolve({ ok: true });
    },
    async setToken() { return { ok: false, error: '已废弃：GitHub Token 方案已移除，请直接注册/登录账号' }; },
    async unlockToken() { return { ok: false, error: '已废弃：无需解锁 Token，请直接登录' }; },
    async lockToken() { memToken = null; localStorage.removeItem(LS_TOKEN); return { ok: true }; },
    async logout() { memToken = null; localStorage.removeItem(LS_TOKEN); return { ok: true }; },
    async testConnection() {
      const h = await localApi('/api/health');
      if (h.code !== 200) return { ok: false, error: h.msg };
      if (!localGetToken()) return { ok: true, note: '后端可达；未登录' };
      const me = await localApi('/api/auth/me');
      if (me.code === 200) return { ok: true, note: '后端可达，已登录：' + me.data.username };
      return { ok: false, error: '后端可达，但登录态无效：' + me.msg };
    }
  };

  window.DB = MODE === 'local' ? LOCAL_IMPL : SB_IMPL;
  console.log('[UEG] 数据层模式:', MODE === 'local' ? 'local（本地后端）' : 'supabase（默认）');
})();
