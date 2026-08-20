// ============================================================
//  supabase-client.js —— 旧 Supabase 方案兼容层（已废弃，仅保留调用兼容）
//  项目已迁移至「纯前端 + 自建 Python 后端（读写私有 GitHub 仓库）」架构，
//  本文件把页面遗留的 supabase.from(...) 链式调用
//  透明映射到 github-db.js（DB → Python 后端 → GitHub 私有仓库）。
//  自动加载站点根目录下的 config.js 与 github-db.js。
//  支持接口：
//    from('users'|'guild_maps').select(cols).eq(k,v).order(k,{ascending}).limit(n).maybeSingle()/single()
//    from('users').update(patch).eq('username', x)          → DB.updateUser / DB.updateMap
//    from('users').delete().eq('username', x)
//    from('guild_maps').delete().eq('id', x)
//    from('guild_maps').insert([row]).select(cols)
//  所有数据操作需登录（Bearer JWT），管理员操作由后端校验。
// ============================================================
(function () {
  'use strict';

  // ---- 生成某文件在页面各上级目录的候选 URL（从最深到最浅） ----
  function scriptCandidates(file) {
    var dirs = [''];
    var parts = location.pathname.split('/').filter(Boolean);
    var cur = '';
    for (var i = 0; i < parts.length - 1; i++) {
      cur += '/' + parts[i];
      dirs.push(cur);
    }
    return dirs.reverse().map(function (d) {
      return (d + '/' + file).replace(/\/+/g, '/');
    });
  }

  function loadScript(candidates) {
    return new Promise(function (resolve) {
      var i = 0;
      (function tryNext() {
        if (i >= candidates.length) return resolve(false);
        var s = document.createElement('script');
        s.src = candidates[i++];
        s.onload = function () { resolve(true); };
        s.onerror = tryNext;
        document.head.appendChild(s);
      })();
    });
  }

  var dbPromise = null;
  function ensureDb() {
    if (window.DB && window.GITHUB_CONFIG) return Promise.resolve();
    if (dbPromise) return dbPromise;
    dbPromise = loadScript(scriptCandidates('config.js'))
      .then(function (ok) {
        if (!ok) throw new Error('无法加载 config.js（请确认站点根目录存在该文件）');
        return loadScript(scriptCandidates('github-db.js'));
      })
      .then(function (ok) {
        if (!ok) throw new Error('无法加载 github-db.js');
        if (!window.DB) throw new Error('github-db.js 初始化失败');
      });
    return dbPromise;
  }

  function currentUsername() {
    try {
      var cu = JSON.parse(localStorage.getItem('ueg_current_user') || 'null');
      return cu && cu.username ? cu.username : '';
    } catch (e) { return ''; }
  }

  // ---- 列过滤（users 永远不返回 password） ----
  function pickCols(row, cols, table) {
    if (cols === '*' || !cols) {
      if (table === 'users') {
        var safe = {};
        for (var k in row) {
          if (k !== 'password') safe[k] = row[k];
        }
        return safe;
      }
      return row;
    }
    var out = {};
    cols.split(',').forEach(function (c) {
      var k = c.trim();
      if (k && k !== 'password' && k in row) out[k] = row[k];
    });
    return out;
  }

  // ---- 查询构建器 ----
  function SbQuery(table) {
    this.table = table;
    this._cols = '*';
    this._eq = [];
    this._order = null;
    this._asc = true;
    this._limit = null;
    this._single = false;
    this._action = 'select';
    this._insertRows = null;
    this._patch = null;
  }
  SbQuery.prototype.select = function (cols) { this._cols = cols || '*'; return this; };
  SbQuery.prototype.eq = function (k, v) { this._eq.push([k, v]); return this; };
  SbQuery.prototype.order = function (k, o) { this._order = k; this._asc = !(o && o.ascending === false); return this; };
  SbQuery.prototype.limit = function (n) { this._limit = n; return this; };
  SbQuery.prototype.range = function (from, to) { this._range = [from, to]; return this; };
  SbQuery.prototype.maybeSingle = function () { this._single = true; return this; };
  SbQuery.prototype.single = function () { this._single = true; return this; };
  SbQuery.prototype.insert = function (rows) { this._action = 'insert'; this._insertRows = rows; return this; };
  SbQuery.prototype.update = function (patch) { this._action = 'update'; this._patch = patch || {}; return this; };
  SbQuery.prototype.delete = function () { this._action = 'delete'; return this; };
  SbQuery.prototype.then = function (resolve, reject) { return this._exec().then(resolve, reject); };

  SbQuery.prototype._exec = function () {
    var self = this;
    return ensureDb().then(function () {
      var DB = window.DB;

      // ===== 写入：创建地图 =====
      if (self._action === 'insert' && self.table === 'guild_maps') {
        var row = (self._insertRows && self._insertRows[0]) || {};
        return DB.createMap(row, row.creator || currentUsername()).then(function (r) {
          if (r.code === 200) return { data: [r.data], error: null };
          return { data: null, error: { message: r.msg || '创建失败' } };
        });
      }

      // ===== 写入：更新 =====
      if (self._action === 'update') {
        var eqObj = {};
        self._eq.forEach(function (e) { eqObj[e[0]] = e[1]; });
        if (self.table === 'users' && eqObj.username) {
          return DB.updateUser(eqObj.username, self._patch).then(function (r) {
            if (r.code === 200) return { data: [r.data], error: null };
            return { data: null, error: { message: r.msg || '更新失败' } };
          });
        }
        if (self.table === 'guild_maps' && eqObj.id) {
          return DB.updateMap(eqObj.id, self._patch, currentUsername()).then(function (r) {
            if (r.code === 200) return { data: [r.data], error: null };
            return { data: null, error: { message: r.msg || '更新失败（模板地图需管理员）' } };
          });
        }
        return { data: null, error: { message: '不支持的更新表: ' + self.table } };
      }

      // ===== 写入：删除 =====
      if (self._action === 'delete') {
        var eqObj = {};
        self._eq.forEach(function (e) { eqObj[e[0]] = e[1]; });
        if (self.table === 'users') {
          return DB.deleteUser(eqObj.username || '').then(function (r) {
            if (r.code === 200) return { data: null, error: null };
            return { data: null, error: { message: r.msg || '删除失败（需要管理员登录）' } };
          });
        }
        if (self.table === 'guild_maps') {
          return DB.deleteMap(eqObj.id || '', currentUsername()).then(function (r) {
            if (r.code === 200) return { data: null, error: null };
            return { data: null, error: { message: r.msg || '删除失败（需要管理员登录）' } };
          });
        }
        return { data: null, error: { message: '不支持的删除表: ' + self.table } };
      }

      // ===== 查询 =====
      var loader = self.table === 'users' ? DB.getUsers() : DB.getMaps();
      return loader.then(function (rows) {
        var list = (rows || []).slice();
        // eq 过滤
        self._eq.forEach(function (e) {
          list = list.filter(function (r) { return r[e[0]] === e[1]; });
        });
        // 排序
        if (self._order && list.length) {
          var key = self._order;
          list.sort(function (a, b) {
            var av = a[key], bv = b[key];
            if (typeof av === 'number' && typeof bv === 'number') {
              return self._asc ? av - bv : bv - av;
            }
            var sa = String(av == null ? '' : av);
            var sb = String(bv == null ? '' : bv);
            return self._asc ? sa.localeCompare(sb) : sb.localeCompare(sa);
          });
        }
        // limit
        if (self._limit) list = list.slice(0, self._limit);
        // range 分页（与 limit 二选一）
        if (self._range) list = list.slice(self._range[0], self._range[1] + 1);
        // 列过滤 + 脱敏
        list = list.map(function (r) { return pickCols(r, self._cols, self.table); });
        // single
        if (self._single) {
          return { data: list.length ? list[0] : null, error: null };
        }
        return { data: list, error: null };
      });
    }).catch(function (e) {
      return { data: null, error: { message: e && e.message ? e.message : '请求失败，请检查网络或登录状态' } };
    });
  };

  // ---- 暴露兼容接口 ----
  window.supabase = {
    from: function (table) { return new SbQuery(table); }
  };

  console.log('✅ supabase-client.js（兼容层）已加载：supabase 调用已映射到 GitHub 数据库');
})();
