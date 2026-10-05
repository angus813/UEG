// ============================================================
//  卫戍协议 · 联机房间客户端
//
//  架构（对照 sganggs/Stronghold-Protocol 的 server/lobby.js）：
//    权威在数据库，不在某个玩家的浏览器 —— 纯前端无法监听端口，
//    而本机 WebRTC 实测收不到 ICE 候选（Chrome mDNS 混淆，SDP 458 字节
//    里一个 a=candidate 都没有）。将来有了 VPS，权威搬到 Node 时
//    只需换 weishu_host_update 的实现，本文件上层调用不用改。
//
//    MAX_SEATS 4 + MAX_SPECTATORS 2、4 位房间码、阶段式回合，
//    与参考项目一致。战斗仍在各自浏览器模拟（同其 SP_COMBAT=client），
//    数据库只管席位、准备、阶段与共享资源。
//
//  依赖：window.DB（github-db.js）+ supabase-js 的 Realtime。
//  暴露：window.WeishuRoom
// ============================================================
(function () {
  'use strict';

  const MAX_SEATS = 4;
  const MAX_SPECTATORS = 2;
  const CODE_LEN = 4;
  // 房间码去掉 0/O/1/I/l 等易混字符：口头传达或截图转发时不会认错
  const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  const PHASE = {
    LOBBY: 'LOBBY', PREP: 'PREP', COMBAT: 'COMBAT', SETTLE: 'SETTLE', RESULT: 'RESULT'
  };
  const PHASE_LABEL = {
    LOBBY: '房间大厅', PREP: '休整期', COMBAT: '作战中', SETTLE: '结算', RESULT: '本局结束'
  };

  const state = {
    code: '',
    host: '',
    mode: 'beginner',
    phase: PHASE.LOBBY,
    round: 0,
    funds: 0,
    life: 1000,
    maxLife: 1000,
    room: null,
    seats: [],
    connected: false,
    error: ''
  };
  const listeners = [];
  let channel = null;      // Realtime 频道
  let subRoom = null;      // supabase-js 客户端
  let polling = null;      // 兜底轮询（Realtime 掉线时）

  function username() {
    try {
      const u = JSON.parse(localStorage.getItem('ueg_current_user') || 'null');
      return u && u.username ? u.username : '';
    } catch (e) { return ''; }
  }

  function dbReady() {
    return !!(window.DB && window.UEG_CONFIG && window.UEG_CONFIG.supabase);
  }

  function rest(path, opts) {
    if (!dbReady()) return Promise.resolve({ code: 500, msg: '数据层未就绪' });
    const o = Object.assign({}, opts || {});
    if (o.method === 'POST' || o.method === 'PATCH') o.prefer = 'return=representation';
    return window.DB.rest(path, o);
  }

  function enc(v) { return encodeURIComponent(String(v)); }

  function emit() {
    const snap = snapshot();
    listeners.forEach(function (fn) {
      try { fn(snap); } catch (e) { console.error('[weishu-room] 监听器异常', e); }
    });
  }

  function snapshot() {
    return {
      code: state.code,
      host: state.host,
      me: username(),
      isHost: !!state.host && state.host === username(),
      mode: state.mode,
      phase: state.phase,
      phaseLabel: PHASE_LABEL[state.phase] || state.phase,
      round: state.round,
      funds: state.funds,
      life: state.life,
      maxLife: state.maxLife,
      seats: state.seats.slice(),
      seatCount: state.seats.filter(function (s) { return s.role === 'seat'; }).length,
      spectatorCount: state.seats.filter(function (s) { return s.role === 'spectator'; }).length,
      seatSlots: MAX_SEATS,
      spectatorSlots: MAX_SPECTATORS,
      connected: state.connected,
      error: state.error
    };
  }

  function newCode() {
    let s = '';
    for (let i = 0; i < CODE_LEN; i++) {
      s += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
    }
    return s;
  }

  // ---------- 房间 ----------

  function makeRoom(mode) {
    const u = username();
    if (!u) return Promise.resolve({ code: 401, msg: '请先登录' });
    if (!dbReady()) return Promise.resolve({ code: 500, msg: '数据层未就绪' });

    // 重试几次以避开撞码（4 位、去除易混字符后仍有 800 万余组合，
    // 但同一时刻多人建房撞上的概率不为零）
    return createWithRetry(u, mode, 4);
  }

  function createWithRetry(u, mode, triesLeft) {
    const code = newCode();
    return rest('/rest/v1/weishu_rooms', {
      method: 'POST',
      body: { code: code, host: u, mode: mode || 'beginner', phase: PHASE.LOBBY }
    }).then(function (r) {
      if (r.code === 200) {
        return joinExisting(code, 'seat', u).then(function (j) {
          return j.code === 200 ? { code: 200, msg: '房间已创建', data: { code: code } } : j;
        });
      }
      // 23505 = unique violation，即撞码
      if (String(r.code) === '23505' && triesLeft > 0) {
        return createWithRetry(u, mode, triesLeft - 1);
      }
      if (r.code === 401 || r.code === 403) {
        return { code: r.code, msg: '未登录或会话已过期，请重新登录' };
      }
      return { code: r.code, msg: r.msg || '创建房间失败' };
    });
  }

  function joinExisting(code, role, hostOverride) {
    const u = username();
    if (!u) return Promise.resolve({ code: 401, msg: '请先登录' });
    return rest('/rest/v1/rpc/weishu_join_room', {
      method: 'POST',
      body: { p_code: String(code || '').toUpperCase(), p_role: role || 'seat' }
    }).then(function (r) {
      if (r.code !== 200) return { code: r.code, msg: joinErrMsg(r && r.msg) };
      state.code = String(code).toUpperCase();
      state.connected = true;
      state.error = '';
      return subscribeRoom().then(function () {
        return refresh().then(function () {
          return { code: 200, msg: '已加入', data: { role: r.data, host: hostOverride || '' } };
        });
      });
    });
  }

  function join(code, role) { return joinExisting(code, role); }

  function joinErrMsg(msg) {
    const m = String(msg || '');
    if (m.indexOf('ROOM_NOT_FOUND') >= 0) return '房间不存在，检查房间码';
    if (m.indexOf('ROOM_CLOSED') >= 0) return '房间已关闭';
    if (m.indexOf('ROOM_FULL') >= 0) return '席位已满（4 人上限），可改用观战席';
    if (m.indexOf('SPECTATORS_FULL') >= 0) return '观战席已满（2 人上限）';
    if (m.indexOf('NOT_LOGGED_IN') >= 0) return '请先登录';
    return m || '加入失败';
  }

  function leave() {
    const u = username();
    const code = state.code;
    teardown();
    state.code = '';
    state.host = '';
    state.room = null;
    state.seats = [];
    if (!u || !code || !dbReady()) { emit(); return Promise.resolve({ code: 200 }); }
    return rest('/rest/v1/weishu_room_seats?room_code=eq.' + enc(code) + '&username=eq.' + enc(u),
      { method: 'DELETE' }).then(function () { emit(); return { code: 200 }; });
  }

  // ---------- 数据 ----------

  function refresh() {
    const code = state.code;
    if (!code || !dbReady()) { emit(); return Promise.resolve(); }
    return rest('/rest/v1/weishu_rooms?code=eq.' + enc(code), { method: 'GET' })
      .then(function (r) {
        const row = (r.code === 200 && Array.isArray(r.data) && r.data[0]) || null;
        if (!row) {
          // 房间已被房主删掉，或从未真正加入
          if (!state.error) state.error = '房间不存在或已被关闭';
          teardown();
          state.code = '';
          state.host = '';
          state.room = null;
          state.seats = [];
          emit();
          return null;
        }
        state.room = row;
        state.host = row.host;
        state.mode = row.mode;
        state.phase = row.phase;
        state.round = row.round;
        state.funds = row.funds;
        state.life = row.life;
        state.maxLife = row.max_life;
        state.error = '';
        return rest('/rest/v1/weishu_room_seats?room_code=eq.' + enc(code) + '&order=joined_at.asc',
          { method: 'GET' }).then(function (s) {
          state.seats = (s.code === 200 && Array.isArray(s.data)) ? s.data : [];
          emit();
        });
      });
  }

  function setReady(ready) {
    const u = username();
    if (!u || !state.code) return Promise.resolve({ code: 400, msg: '不在房间中' });
    return rest('/rest/v1/weishu_room_seats?room_code=eq.' + enc(state.code) + '&username=eq.' + enc(u),
      { method: 'PATCH', body: { ready: !!ready, connected: true } });
  }

  function saveFleet(fleet) {
    const u = username();
    if (!u || !state.code) return Promise.resolve({ code: 400 });
    return rest('/rest/v1/weishu_room_seats?room_code=eq.' + enc(state.code) + '&username=eq.' + enc(u),
      { method: 'PATCH', body: { fleet: fleet || [] } });
  }

  function closeRoom() {
    if (state.host !== username()) return Promise.resolve({ code: 403, msg: '只有房主能解散房间' });
    const code = state.code;
    return rest('/rest/v1/weishu_rooms?code=eq.' + enc(code), { method: 'DELETE' })
      .then(function () { leave(); return { code: 200, msg: '房间已解散' }; });
  }

  // 房主权威：只能房主推进阶段/回合。函数里再判一次 host，
  // 前端判断只管 UI 禁用按钮，越权请求由 RLS 与函数拒绝。
  function hostUpdate(patch) {
    if (state.host !== username()) return Promise.resolve({ code: 403, msg: '只有房主能操作' });
    const p = patch || {};
    return rest('/rest/v1/rpc/weishu_host_update', {
      method: 'POST',
      body: {
        p_code: state.code,
        p_phase: p.phase == null ? null : p.phase,
        p_round: p.round == null ? null : p.round,
        p_funds: p.funds == null ? null : p.funds,
        p_life: p.life == null ? null : p.life,
        p_state: p.roomState == null ? null : p.roomState
      }
    }).then(function (r) {
      if (r.code !== 200) return { code: r.code, msg: r.msg || '房主更新失败' };
      return refresh().then(function () { return { code: 200 }; });
    });
  }

  function pushEvent(kind, payload) {
    if (!state.code) return Promise.resolve({ code: 400 });
    return rest('/rest/v1/rpc/weishu_push_event', {
      method: 'POST',
      body: { p_code: state.code, p_kind: kind, p_payload: payload || {} }
    });
  }

  function eventsSince(id) {
    if (!state.code) return Promise.resolve([]);
    return rest('/rest/v1/weishu_room_events?room_code=eq.' + enc(state.code) +
      '&id=gt.' + (id || 0) + '&order=id.asc&limit=200', { method: 'GET' })
      .then(function (r) { return (r.code === 200 && Array.isArray(r.data)) ? r.data : []; });
  }

  // ---------- Realtime ----------

  function loadSupabase() {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      return Promise.resolve(window.supabase);
    }
    if (window.__weishuSupabasePromise) return window.__weishuSupabasePromise;
    window.__weishuSupabasePromise = new Promise(function (resolve, reject) {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      s.onload = function () {
        window.supabase && window.supabase.createClient
          ? resolve(window.supabase) : reject(new Error('supabase-js 加载后未导出 createClient'));
      };
      s.onerror = function () { reject(new Error('supabase-js 加载失败')); };
      document.head.appendChild(s);
    });
    return window.__weishuSupabasePromise;
  }

  // Realtime 的 RLS 授权靠 JWT。只读频道（public）不校验，
  // 私有频道需要先 setAuth —— 这里用「公开频道 + 表级 RLS」：
  // 读到的行仍被 weishu_rooms_read / weishu_seats_read 策略过滤。
  function subscribeRoom() {
    if (state.channel) return Promise.resolve(true);
    const code = state.code;
    return loadSupabase().then(function (mod) {
      subRoom = mod.createClient(
        window.UEG_CONFIG.supabase.url, window.UEG_CONFIG.supabase.publishableKey);
      channel = subRoom.channel('room-' + code, { config: { broadcast: { self: false } } });

      // 轻量消息：队友间的即时通知（准备状态、表情、倒计时提示）
      channel.on('broadcast', { event: 'seat' }, function () { refresh(); });

      // 数据变更：席位与阶段变动以此为准
      channel.on('postgres_changes',
        { event: '*', schema: 'public', table: 'weishu_rooms', filter: 'code=eq.' + code },
        function () { refresh(); });
      channel.on('postgres_changes',
        { event: '*', schema: 'public', table: 'weishu_room_seats', filter: 'room_code=eq.' + code },
        function () { refresh(); });

      return new Promise(function (resolve) {
        let settled = false;
        const to = setTimeout(function () {
          if (settled) return;
          settled = true;
          startPolling();
          resolve(false);
        }, 8000);
        channel.subscribe(function (status) {
          if (status === 'SUBSCRIBED') {
            if (settled) return;
            settled = true;
            clearTimeout(to);
            state.connected = true;
            startPolling();
            emit();
            resolve(true);
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            if (settled) return;
            settled = true;
            clearTimeout(to);
            state.connected = false;
            startPolling();
            emit();
            resolve(false);
          }
        });
      });
    }).catch(function (e) {
      console.error('[weishu-room] Realtime 订阅失败，改用轮询', e);
      state.connected = false;
      startPolling();
      emit();
      return false;
    });
  }

  // 兜底：Realtime 没连上时每 3s 拉一次。开着 Realtime 时也保留，
  // 因为浏览器后台标签页会节流 WebSocket，轮询能保证回来时状态是新的。
  function startPolling() {
    if (polling) return;
    polling = setInterval(function () {
      if (!state.code) { stopPolling(); return; }
      refresh();
    }, 3000);
  }

  function stopPolling() {
    if (polling) { clearInterval(polling); polling = null; }
  }

  function teardown() {
    stopPolling();
    // stopSync / stopWatch 定义在本函数之后（battle 同步块）。函数声明会提升，
    // 这里调用没问题；但 syncState 必须已初始化，否则首次调用会读 undefined。
    if (typeof stopSync === 'function') stopSync();
    if (typeof stopWatch === 'function') stopWatch();
    if (channel && subRoom) { try { subRoom.removeChannel(channel); } catch (e) {} }
    channel = null;
    subRoom = null;
  }

  // 页面隐藏时不必维持 WebSocket，回来时 refresh 一次即可
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && state.code) {
      state.connected = true;
      subscribeRoom();
      refresh();
    }
  });
  window.addEventListener('pagehide', function () { if (state.code) setConnected(false); });

  function setConnected(v) {
    const u = username();
    if (!u || !state.code) return;
    rest('/rest/v1/weishu_room_seats?room_code=eq.' + enc(state.code) + '&username=eq.' + enc(u),
      { method: 'PATCH', body: { connected: !!v } });
  }

  function notifySeat() {
    if (!channel) return;
    channel.send({ type: 'broadcast', event: 'seat', payload: { by: username(), at: Date.now() } });
  }

  // ============================================================
  //  战斗同步：房主权威
  //
  //  实测的流量压力（字段按 weishu.js 的 rebuildUnits / spawnEnemyWave 结构）：
  //    单我方单位 334B · 单敌方 308B · 共享状态 177B
  //    1人+36 敌 = 11.3 KB/帧 · 8人+60 敌 = 20.8 KB/帧
  //    按 100ms 全量广播 = 每客户端 113~234 KB/s —— 太浪费。
  //
  //  所以：5Hz 广播 + 只发变化的单位。
  //    每 200ms 一次，8人+60 敌满载约 104 KB/s 下行，4 人房间约 0.3 MB/s。
  //    静默期（没单位变化）只发共享状态，约 180 B/次。
  //
  //  房间专属频道：host-sync-<房间码>，与 room-<房间码> 分开，
  //  免得房间管理消息与高频战斗快照混在一条流里。
  // ============================================================

  const SYNC_HZ_MS = 200;
  const syncState = {
    channel: null,
    lastSent: {},          // id -> 上次发出的关键数值，用于算增量
    lastShared: '',
    timer: null,
    lastFrameAt: 0,
    lastStats: null
  };
  const syncListeners = [];

  function isHost() { return !!state.code && state.host === username(); }

  function syncEmit(snapshotData) {
    syncListeners.forEach(function (fn) {
      try { fn(snapshotData); } catch (e) { console.error('[weishu-sync] 监听器异常', e); }
    });
  }

  // 只保留渲染与命中判定要用的字段；name/shortName 由接收端按 id 查表。
  // 全字段照搬会把 name 重复 40 遍，体积翻倍且毫无意义。
  function packUnit(u, mine) {
    const base = mine ? {
      i: u.id, c: u.cls, r: u.row, hp: u.hp, mhp: u.maxHp, s: u.shield,
      d: u.dmg, a: u.armor, rt: u.rate, rg: u.range, w: u.weapon,
      dt: u.dmgType, em: u.energyMul, cb: u.critBonus, am: u.antiMissile,
      rp: u.repair, el: u.elite, al: u.alive ? 1 : 0, k: u.kills, lf: u.lastFireTime,
      // 联机联合舰队里，舰船 id 带玩家序号前缀（p2_my_0）。房主的本地有
      // 完整编组，非房主没有队友的舰 —— 名字靠 roster 查，不每帧重传。
      o: u.owner || ''
    } : {
      i: u.id, c: u.cls, z: u.zone, g: u.group, f: u.factionIdx,
      hp: u.hp, mhp: u.maxHp, s: u.shield, d: u.dmg, a: u.armor,
      dt: u.dmgType, w: u.weapon, t: u.tier, rp: u.repair, am: u.antiMissile,
      al: u.alive ? 1 : 0, lf: u.lastFireTime, eu: u.empUntil, fu: u.frozenUntil
    };
    if (u.fortress) base.fs = 1;
    return base;
  }

  function unitChanged(prev, cur) {
    if (!prev) return true;
    // 生命/护盾/位置性状态变了才重发；kills 这类累计值也算
    return prev.hp !== cur.hp || prev.s !== cur.s || prev.al !== cur.al
      || prev.lf !== cur.lf || prev.eu !== cur.eu || prev.fu !== cur.fu
      || prev.k !== cur.k;
  }

  // 把 weishu.js 的 state 压成快照。s 由 weishu.js 传入（它在闭包里，
  // 外部读不到，只能由它主动喂进来）。
  function buildSnapshot(s) {
    const mine = s.units.map(function (u) { return packUnit(u, true); });
    const enemies = s.enemies.map(function (u) { return packUnit(u, false); });
    const shared = {
      ph: s.phase, rd: s.round, life: s.life, mlife: s.maxLife,
      fu: s.funds, clk: Math.max(0, Math.ceil(s.clockLeft)),
      fhp: s.factionHp, fmhp: s.factionMaxHp,
      tk: s.totalKills, rk: s.roundKills, rll: s.roundLifeLost,
      bl: s.bargeLevel, sh: s.shield
    };
    // 联合舰队的「id -> 舰名」对照表。只在场次开始（编组确定）时变一次，
    // 之后 shared 未变就不会重发 —— 40 艘 × 约 34B ≈ 1.4KB，一次性付掉。
    if (s.units.length && (!s.coopRoster || Object.keys(s.coopRoster).length !== s.units.length)) {
      const roster = {};
      s.units.forEach(function (u) { roster[u.id] = [u.name, u.shortName || u.name, u.cls, u.owner || '']; });
      shared.roster = roster;
    }
    const fr = (s.finalRound && s.finalRound.active && s.finalRound.fortress)
      ? { hp: s.finalRound.fortress.hp, mhp: s.finalRound.fortress.maxHp,
          sh: s.finalRound.fortress.shield, ms: s.finalRound.fortress.maxShield,
          al: s.finalRound.fortress.alive ? 1 : 0, hits: s.finalRound.fortress.hits }
      : null;
    return { t: Date.now(), sh: shared, fr: fr, mu: mine, en: enemies,
             ids: { mu: mine.map(function (u) { return u.i; }),
                    en: enemies.map(function (u) { return u.i; }) } };
  }

  // 增量：与上一帧比，只发变化过的单位，并给出完整 id 名单供接收端对齐。
  // 接收端靠 ids 删除已消失的单位（阵亡单位 alive=0 仍留在名单里，
  // 由 renderRows 负责显示；只有真正不再出现的才删）。
  function diffSnapshot(prev, cur) {
    const ids = {
      mu: cur.mu.map(function (u) { return u.i; }),
      en: cur.en.map(function (u) { return u.i; })
    };
    // 首帧没有 prev 可比，整帧都算变化。仍要带 ids ——
    // 早先这里直接 return cur，把 ids 漏掉了，接收端拿不到名单就无法清理单位。
    if (!prev) {
      return { t: cur.t, sh: cur.sh, fr: cur.fr, mu: cur.mu, en: cur.en, ids: ids };
    }
    const prevMap = {};
    prev.mu.forEach(function (u) { prevMap[u.i] = u; });
    const prevEn = {};
    prev.en.forEach(function (u) { prevEn[u.i] = u; });
    const mu = cur.mu.filter(function (u) { return unitChanged(prevMap[u.i], u); });
    const en = cur.en.filter(function (u) { return unitChanged(prevEn[u.i], u); });
    const sharedChanged = JSON.stringify(prev.sh) !== JSON.stringify(cur.sh);
    const frChanged = JSON.stringify(prev.fr) !== JSON.stringify(cur.fr);
    // id 名单也变了（有人上场/退场）时必须发，哪怕数值都没变
    const idsChanged = JSON.stringify(prev.ids) !== JSON.stringify(ids)
      || !prev.ids;   // prev 若是旧格式（无 ids）则强制带一次
    if (!sharedChanged && !frChanged && !mu.length && !en.length && !idsChanged) return null;
    return {
      t: cur.t,
      sh: sharedChanged ? cur.sh : null,
      fr: frChanged ? cur.fr : null,
      mu: mu,
      en: en,
      ids: idsChanged ? ids : prev.ids
    };
  }

  function startSync(getState, onLog) {
    stopSync();
    if (!state.code) return Promise.resolve(false);
    if (!isHost()) return Promise.resolve(false);
    syncState.getState = getState;
    syncState.onLog = onLog;
    const chName = 'host-sync-' + state.code;
    return loadSupabase().then(function (mod) {
      if (!subRoom) subRoom = mod.createClient(
        window.UEG_CONFIG.supabase.url, window.UEG_CONFIG.supabase.publishableKey);
      syncState.channel = subRoom.channel(chName, { config: { broadcast: { self: false } } });
      // null 而非 {}：diffSnapshot 用 prev.mu.forEach 遍历，
      // 空对象没有 mu，首帧就会抛「Cannot read properties of undefined」。
      syncState.lastSent = null;

      // roster（id -> 舰名）只在编组变化时随 shared 发一次。后加入的玩家
      // 订阅时那一帧已经过去了，就永远拿不到舰名 —— 队友的舰只能显示
      // 「未知舰船」。所以让非房主订阅后主动要一次全量。
      syncState.channel.on('broadcast', { event: 'needFull' }, function (msg) {
        if (!msg || !msg.payload) return;
        if (msg.payload.by === username()) return;
        sendFull();
      });
      return new Promise(function (resolve) {
        let settled = false;
        const to = setTimeout(function () {
          if (settled) return;
          settled = true;
          resolve(false);
        }, 8000);
        syncState.channel.subscribe(function (status) {
          if (status === 'SUBSCRIBED') {
            if (settled) return;
            settled = true; clearTimeout(to);
            syncTimer();
            resolve(true);
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            if (settled) return;
            settled = true; clearTimeout(to);
            resolve(false);
          }
        });
      });
    }).catch(function (e) {
      console.error('[weishu-sync] 订阅失败', e);
      return false;
    });
  }

  // 不做差分地发一帧完整快照。给刚订阅 / 中途加入的客户端补底用。
function sendFull() {
  if (!syncState.channel || !state.code || !syncState.getState) return null;
  let full;
  try { full = buildSnapshot(syncState.getState()); }
  catch (e) { console.error('[weishu-sync] 取状态失败', e); return null; }
  const payload = {
    seq: (syncState.seq = (syncState.seq || 0) + 1),
    d: { t: full.t, sh: full.sh, fr: full.fr, mu: full.mu, en: full.en, ids: full.ids }
  };
  syncState.lastSent = full;
  syncState.channel.send({ type: 'broadcast', event: 'snap', payload: payload });
  return payload;
}

function syncTimer() {
    if (syncState.timer) clearInterval(syncState.timer);
    syncState.timer = setInterval(function () {
      if (!syncState.channel || !state.code || !syncState.getState) return;
      let full;
      try { full = buildSnapshot(syncState.getState()); }
      catch (e) { console.error('[weishu-sync] 取状态失败', e); return; }
      const delta = diffSnapshot(syncState.lastSent, full);
      syncState.lastSent = full;
      syncState.lastStats = { bytes: 0, sent: 0, at: Date.now() };
      if (!delta) return;                       // 无变化就不发
      const payload = JSON.stringify(delta);
      syncState.lastStats.bytes = payload.length;
      syncState.lastStats.sent = 1;
      syncState.channel.send({
        type: 'broadcast', event: 'snap',
        payload: { seq: (syncState.seq = (syncState.seq || 0) + 1), d: delta }
      }).then(function (r) {
        if (r && r.error && syncState.onLog) {
          syncState.onLog('广播失败：' + (r.error.message || r.error));
        }
      });
    }, SYNC_HZ_MS);
  }

  function stopSync() {
    if (syncState.timer) { clearInterval(syncState.timer); syncState.timer = null; }
    if (syncState.channel && subRoom) {
      try { subRoom.removeChannel(syncState.channel); } catch (e) {}
    }
    syncState.channel = null;
    syncState.lastSent = null;
    syncState.seq = 0;
  }

  // 非房主：订阅房主的快照频道
  function watchSync(onSnapshot, onLog) {
    stopWatch();
    if (!state.code || isHost()) return Promise.resolve(false);
    return loadSupabase().then(function (mod) {
      if (!subRoom) subRoom = mod.createClient(
        window.UEG_CONFIG.supabase.url, window.UEG_CONFIG.supabase.publishableKey);
      const ch = subRoom.channel('host-sync-' + state.code, { config: { broadcast: { self: false } } });
      syncState.watch = ch;
      ch.on('broadcast', { event: 'snap' }, function (msg) {
        if (!msg || !msg.payload || !msg.payload.d) return;
        try { onSnapshot(msg.payload.d, msg.payload.seq); }
        catch (e) { console.error('[weishu-sync] 处理快照出错', e); }
      });
      return new Promise(function (resolve) {
        let settled = false;
        const to = setTimeout(function () { if (!settled) { settled = true; resolve(false); } }, 8000);
        ch.subscribe(function (status) {
          if (status === 'SUBSCRIBED') {
            if (settled) return;
            settled = true; clearTimeout(to);
            // 向房主要一帧完整快照（含 roster）。房主可能还没开跑，
            // 那时不会有回应 —— 等下一次增量帧即可，两者都能补上名字。
            setTimeout(function () {
              try { ch.send({ type: 'broadcast', event: 'needFull', payload: { by: username() } }); }
              catch (e) {}
            }, 120);
            resolve(true);
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            if (settled) return;
            settled = true; clearTimeout(to); resolve(false);
          }
        });
      });
    }).catch(function (e) {
      console.error('[weishu-sync] 观看订阅失败', e);
      return false;
    });
  }

  function stopWatch() {
    if (syncState.watch && subRoom) {
      try { subRoom.removeChannel(syncState.watch); } catch (e) {}
    }
    syncState.watch = null;
  }

  window.WeishuRoom = {
    PHASE: PHASE,
    PHASE_LABEL: PHASE_LABEL,
    MAX_SEATS: MAX_SEATS,
    MAX_SPECTATORS: MAX_SPECTATORS,
    makeRoom: makeRoom,
    join: join,
    leave: leave,
    closeRoom: closeRoom,
    refresh: refresh,
    setReady: setReady,
    saveFleet: saveFleet,
    hostUpdate: hostUpdate,
    pushEvent: pushEvent,
    eventsSince: eventsSince,
    notifySeat: notifySeat,
    snapshot: snapshot,
    isHost: isHost,
    isRoom: function () { return !!state.code; },
    // 战斗同步（房主权威）
    SYNC_HZ_MS: SYNC_HZ_MS,
    startSync: startSync,
    stopSync: stopSync,
    watchSync: watchSync,
    stopWatch: stopWatch,
    buildSnapshot: buildSnapshot,
    // 暴露给自测与调试：增量算法不外露就没法在没有真实战斗的情况下验它
    diffSnapshot: diffSnapshot,
    onSnapshot: function (fn) { syncListeners.push(fn); return function () {
      const i = syncListeners.indexOf(fn);
      if (i >= 0) syncListeners.splice(i, 1);
    }; },
    syncStats: function () { return syncState.lastStats; },
    onChange: function (fn) { listeners.push(fn); return function () {
      const i = listeners.indexOf(fn);
      if (i >= 0) listeners.splice(i, 1);
    }; },
    // 仅供调试与自测
    _state: state,
    _sync: syncState
  };
})();