/* 系统强化 —— 树形强化界面
 *
 * 界面照官方《无尽的拉格朗日》舰船蓝图 · 系统强化 重做：
 *   顶栏  舰船名 / 技术值(强化点) / 重置 / 方案
 *   左一  舰船清单
 *   左二  系统图标竖栏（M 标记 + 官方系统图标 + 类别名 + 等级点阵）
 *   主体  系统标题条 → 属性条 → 强化树（节点方块 + 连线 + 底部详情卡）
 *
 * 数据 window.OFFICIAL_ENHANCE 来自 official_enhance_data.js（自动生成）：
 *   名称/分类/描述/详细说明/逐级消耗/前置依赖 全部取自官方配置表，
 *   强化项与各模块系统按官方 system_id 对应，不做名称猜测。
 *   描述里的 [Lv.N] / [周期] 等是官方模板中由服务器下发的数值，本站未内置。
 */
(function () {
  'use strict';

  const DATA = window.SHIPS_DATA || {};
  const OFF = window.OFFICIAL_ENHANCE || {};
  const FX = window.ENHANCE_EFFECTS || {};
const AT = window.ENHANCE_ADJUST_EFFECTS || {};
  const SHIP_STATS = window.SHIP_STATS || {};
  const STATS_ALIAS = window.SHIP_STATS_ALIAS || {};
  const SYSTEM_STATS = window.SYSTEM_STATS || {};
  const ICON = 'enhance_icons/';
  // 图标文件同名换图（旧版 system_intensify → 当前版 system_intensify_new），带版本号防止读到旧缓存
  const ICON_VER = '20261003g';
  const LS_POINTS = 'ueg_tree_points';
  const LS_LV = 'ueg_tree_lv';

  let shipKey = null, ship = null, sysName = null, selTech = null;
  let points = 0, levels = {};

  try { points = parseInt(localStorage.getItem(LS_POINTS) || '0', 10) || 0; } catch (e) { points = 0; }
  try { levels = JSON.parse(localStorage.getItem(LS_LV) || '{}') || {}; } catch (e) { levels = {}; }
  function save() {
    try {
      localStorage.setItem(LS_POINTS, String(points));
      localStorage.setItem(LS_LV, JSON.stringify(levels));
    } catch (e) {}
  }

  const $ = function (id) { return document.getElementById(id); };
  const shipList = $('shipList'), sysCol = $('sysCol'), mainCol = $('mainCol');
  const ptsNum = $('ptsNum'), ptsBox = $('ptsBox'), shipTitle = $('shipTitle');

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function tip(msg) {
    const e = $('flashTip');
    e.textContent = msg; e.style.opacity = '1';
    clearTimeout(tip._t); tip._t = setTimeout(function () { e.style.opacity = '0'; }, 2400);
  }
  function icon(f) { return f ? '<img src="' + ICON + esc(f) + '?v=' + ICON_VER + '" alt="">' : ''; }

  // ---------- 等级 ----------
  function lvOf(sn, tid) {
    var s = levels[shipKey];
    if (!s || !s[sn]) return 0;
    var v = parseInt(s[sn][tid], 10);
    return isNaN(v) ? 0 : v;
  }
  function setLv(sn, tid, v) {
    var s = levels[shipKey] = levels[shipKey] || {};
    var m = s[sn] = s[sn] || {};
    if (v <= 0) delete m[tid]; else m[tid] = v;
  }
  function baseOf(t) { return t.dl || 0; }
  function absLv(t) { return baseOf(t) + lvOf(sysName, t.id); }
  function absMax(t) { return baseOf(t) + t.mx; }
  function costOf(t, abs) {
    if (!t.ct || !t.ct.length) return 0;      // 调教节点不吃科技点，没有代价表
    var i = abs - baseOf(t) - 1;
    if (i < 0 || i >= t.ct.length) return 0;
    var c = t.ct[i];
    return (typeof c === 'number' && c > 0) ? c : 0;
  }

  // ---------- 属性面板：数据源与加成计算 ----------
  const LS_PICK = 'ueg_weapon_choice';
  var weaponChoice = {};
  try { weaponChoice = JSON.parse(localStorage.getItem(LS_PICK) || '{}') || {}; } catch (e) { weaponChoice = {}; }
  function saveWeaponChoice() {
    try { localStorage.setItem(LS_PICK, JSON.stringify(weaponChoice)); } catch (e) {}
  }
  function pickKey(sn, option) { return shipKey + '|' + sn + '|' + option; }

  // 修掉引号/空格等差异后比较系统名（官方名与属性数据里的名不完全一致）
  function normName(s) { return String(s == null ? '' : s).replace(/[“”"'·\s]/g, ''); }
  function sysStatsOf(sn) {
    var m = SYSTEM_STATS[shipKey];
    if (!m || !sn) return null;
    if (m[sn]) return m[sn];
    var target = normName(sn), k;
    for (k in m) if (normName(k) === target) return m[k];
    for (k in m) {
      var n = normName(k);
      if (n && (n.indexOf(target) >= 0 || target.indexOf(n) >= 0)) return m[k];
    }
    return null;
  }

  // 舰船属性数据：按 舰名（含别名）+ 型号 取对应变体
  function statsOf(info) {
    if (!info) return null;
    var nm = info.name || '';
    var list = SHIP_STATS[nm] || SHIP_STATS[STATS_ALIAS[nm]];
    if (!list || !list.length) return null;
    var model = String(info.model || '').replace(/[型级]$/, '');
    if (model) {
      var i, sub = model.slice(0, 2);
      for (i = 0; i < list.length; i++) if ((list[i].name || '').indexOf(model) >= 0) return list[i];
      for (i = 0; i < list.length; i++) if (sub && (list[i].name || '').indexOf(sub) >= 0) return list[i];
    }
    return list[0];
  }

  // 每个互斥槽位选出当前使用的武器（默认第一个）
  function selectedWeapons() {
    var out = [], m = SYSTEM_STATS[shipKey] || {};
    for (var sn in m) {
      var slots = {}, ws = m[sn].weapons || [];
      for (var i = 0; i < ws.length; i++) {
        var o = ws[i].option || ws[i].name;
        (slots[o] = slots[o] || []).push(ws[i]);
      }
      for (var o2 in slots) {
        var list = slots[o2], saved = (weaponChoice[shipKey] || {})[sn] || {};
        var chosen = saved[o2], picked = null;
        for (var j = 0; j < list.length; j++) if (list[j].name === chosen) picked = list[j];
        out.push(picked || list[0]);
      }
    }
    return out;
  }

  function weaponTotals() {
    var list = selectedWeapons();
    var t = { damage: 0, cycle: 0, lockOn: 0, rounds: 0, cooldown: 0, duration: 0, weapons: 0 };
    for (var i = 0; i < list.length; i++) {
      var w = list[i];
      var keys = ['damage', 'cycle', 'lockOn', 'rounds', 'cooldown', 'duration'];
      for (var k = 0; k < keys.length; k++) {
        var v = w[keys[k]];
        if (v !== undefined && v !== null) t[keys[k]] += Number(v) || 0;
      }
      t.weapons++;
    }
    return t;
  }

  function weaponDpm() {
    var list = selectedWeapons(), f = { antiShip: 0, antiAir: 0, siege: 0 };
    for (var i = 0; i < list.length; i++) {
      f.antiShip += Number(list[i].dpmShip) || 0;
      f.antiAir += Number(list[i].dpmAA) || 0;
      f.siege += Number(list[i].dpmSiege) || 0;
    }
    return f;
  }

  // 强化加成：按已加点等级把效果累加成倍率。
  // 规则与官方数据表的「比例加成/比例减少」「增加/减少」两种动作对应；
  // 战斗机制类效果（集火/拦截/闪避…）不参与属性计算。
  var FX_SKIP = /集火|战略打击|子系统暴击|被武器命中|被导弹|被鱼雷|失效|自动维修|拦截|锁定|目标选择|飞行时间|闪避|反击|警戒|战斗|站位|撤退|隐藏|伪装|干扰|探测|识别/;

  // 把一条 [类型, 动作, 数值] 记到累加器里（官方强化节点与调教节点共用同一套口径）
  function addEffect(acc, type, action, value) {
    if (!isFinite(value) || value === 0 || FX_SKIP.test(type)) return;
    if (action === '比例加成' || action === '比例减少') {
      var per = (action === '比例减少' ? -value : value);
      if (/受到|被武器|被命中|被拦截/.test(type)) return;
      var absV = Math.abs(per), dirV = 1;
      if (/降低|减少/.test(type)) dirV = /冷却|持续时间|攻击间隔/.test(type) ? 1 : -1;
      if (/攻城/.test(type)) acc.siege += absV * dirV;
      else if (/防空/.test(type)) acc.aa += absV * dirV;
      else if (/冷却/.test(type)) acc.cd += absV * dirV;
      else if (/暴击/.test(type)) acc.crit += absV * dirV;
      else if (/持续时间/.test(type)) acc.dur += per;
      else if (/攻击间隔/.test(type)) acc.atkSpeed += absV * dirV;
      else if (/频率|每轮攻击|额外射击/.test(type)) acc.freq += absV * dirV;
      else if (/命中/.test(type)) acc.hit += absV * dirV;
      else if (/生命|结构值/.test(type)) acc.hp += absV * dirV;
      else if (/装甲|抗性/.test(type)) {
        if (/能量/.test(type)) acc.energy += absV * dirV; else acc.phys += absV * dirV;
      }
      else if (/巡航/.test(type)) acc.cruise += absV * dirV;
      else if (/曲速|曲率/.test(type)) acc.warp += absV * dirV;
      else if (/伤害/.test(type)) acc.dmg += absV * dirV;
    } else if (action.indexOf('增加') >= 0 || action.indexOf('减少') >= 0) {
      var add = (action.indexOf('减') >= 0 ? -value : value);
      if (/装甲|抗性|物理抵抗/.test(type)) {
        if (/能量/.test(type)) acc.energyAdd += add; else acc.physAdd += add;
      } else if (/生命|结构值/.test(type)) acc.hpAdd += add;
      else if (/伤害/.test(type)) acc.dmg += add;
    }
  }

  function mults() {
    var acc = { dmg: 0, aa: 0, siege: 0, cd: 0, hit: 0, crit: 0, hp: 0, phys: 0, energy: 0,
                cruise: 0, warp: 0, atkSpeed: 0, freq: 0, dur: 0,
                hpAdd: 0, physAdd: 0, energyAdd: 0, invested: 0 };
    if (ship) {
      var names = Object.keys(ship.systems);
      for (var i = 0; i < names.length; i++) {
        var sn = names[i], techs = ship.systems[sn].techs || [];
        for (var j = 0; j < techs.length; j++) {
          var t = techs[j], lv = lvOf(sn, t.id);
          // 调教（官方 EFFECT_TYPE==ADJUST）：第 N 级的累计加成 = 总值 × N / 等级上限，
          // 作用于它的目标强化节点，见 ops/gen_adjust_effects.py
          var at = AT[t.id];
          if (at && t.tg) {
            var span = Math.max(1, t.mx || 1);
            for (var a = 0; a < at.length; a++) {
              var act = Math.max(0, lv - at[a][0] + 1) / span;
              if (act > 0) addEffect(acc, at[a][1], at[a][2], Number(at[a][3]) * act);
            }
          }
          if (lv <= 0) continue;
          for (var c = 1; c <= lv; c++) acc.invested += costOf(t, baseOf(t) + c);
          var fx = FX[t.id];
          if (!fx) continue;
          var frac = lv / Math.max(1, t.mx || 1);
          for (var k = 0; k < fx.length; k++) {
            addEffect(acc, fx[k][0] || '', fx[k][1] || '', Number(fx[k][2]) * frac);
          }
        }
      }
    }
    var critMul = 1 + acc.crit / 100, atkMul = 1 + acc.atkSpeed / 100, freqMul = 1 + acc.freq / 100;
    return {
      fireMul: (1 + acc.dmg / 100) * critMul * atkMul * freqMul,
      aaMul: (1 + (acc.dmg + acc.aa) / 100) * critMul * atkMul * freqMul,
      siegeMul: (1 + (acc.dmg + acc.siege) / 100) * critMul * atkMul * freqMul,
      cdMul: 1 - acc.cd / 100,
      hpMul: 1 + acc.hp / 100, hpAdd: acc.hpAdd,
      physMul: 1 + acc.phys / 100, physAdd: acc.physAdd,
      energyMul: 1 + acc.energy / 100, energyAdd: acc.energyAdd,
      cruiseMul: 1 + acc.cruise / 100,
      warpMul: 1 + acc.warp / 100,
      durMul: 1 + acc.dur / 100,
      invested: acc.invested
    };
  }

  function sec1(n) { return Math.round(n * 10) / 10; }
  // 有加成时用高亮数字显示加成后的值
  function fmtStat(base, mul, add, fmtFn) {
    var hasMul = mul && Math.abs(mul - 1) > 0.0001;
    var hasAdd = add && Math.abs(add) >= 0.5;
    if (!hasMul && !hasAdd) return '<b>' + (base ? fmtFn(base) : '—') + '</b>';
    return '<b class="boost">' + fmtFn(base * (hasMul ? mul : 1) + (hasAdd ? add : 0)) + '</b>';
  }

  function shipClassOf(type) {
    var t = type || '';
    if (/航空母舰|支援舰|战列巡洋舰|战列舰/.test(t)) return '超主力舰';
    if (/巡洋舰|驱逐舰|护卫舰/.test(t)) return '主力舰';
    if (/护航艇|战机/.test(t)) return '舰载机';
    return '其他';
  }
  function shipScaleOf(type) {
    var t = type || '';
    if (/航空母舰|支援舰|战列巡洋舰|巡洋舰/.test(t)) return '大型舰船';
    if (/驱逐舰|护卫舰/.test(t)) return '小型舰船';
    return '';
  }

  // ---------- 前置 ----------
  function techById(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function prereqOf(list, t) {
    // 官方判定（system_enhance_tree._is_unlocked_self）：无前置直接解锁；
    // 任一前置节点等级 > 0 即解锁（OR）。配置第二列是 ui_level，不是等级要求。
    if (!t.pq || !t.pq.length) return null;
    var out = [];
    for (var i = 0; i < t.pq.length; i++) {
      var p = techById(list, t.pq[i][0]);
      if (!p || p.id === t.id) continue;
      out.push({ t: p, lv: absLv(p), ok: absLv(p) > 0 });
    }
    return out.length ? out : null;
  }
  function dependentsOf(list, t) {
    var out = [];
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      if (c.id === t.id || !c.pq) continue;
      for (var j = 0; j < c.pq.length; j++) if (c.pq[j][0] === t.id) { out.push(c); break; }
    }
    return out;
  }
  function unmetTxt(pq) {
    if (!pq) return '';
    var bad = pq.filter(function (x) { return !x.ok; }).map(function (x) { return x.t.n; });
    return bad.length ? bad.join('、') : '';
  }

  // ---------- 系统调校 / 调教 ----------
  // 照官方 bp_extend_system_view + system_extend_utils：
  //   扩展解锁（extend）：ENHANCE 且 UNLOCK_TYPE != 0 的节点，花武器技术解锁。
  //     UNLOCK_COST_RARITY 每个 ';' 分组 = 一条途径，形如 '36,1,2,3'：
  //     稀有度 ∈ {1,2,3} 的武器技术，ENHANCE_VALUE 之和要达到 36；多组任一满足即可。
  //   调教（adjust）：EFFECT_TYPE == 2 的节点，花武器技术掷骰提升目标强化节点，
  //     目标 = ADJUST_ENHANCE_INDEX，即同系统内「系统 id × 100 + 索引」。
  //   钥匙：效果 EFFECT_ID == EFFECT_SHIP_BLUEPRINT_ENHANCE_ADJUST(2082) 的节点
  //     （即「系统调校」），未解锁时本系统不能调教（check_tuning_available）。
  // 服务端不下发武器技术表（ENHANCE_VALUE 只有配置里的门槛），站内手工登记：
  // 每条记 名称/稀有度/类型/价值/数量，按配置校验。
  const LS_HEX = 'ueg_hex_tech';        // 舰|系统|节点 -> 武器技术清单
  const LS_HEXFAIL = 'ueg_hex_fail';    // 舰|系统|节点 -> 连续调教失败次数
  // 官方 configdata 里的硬常量
  const ADJ_FAIL_PROB_ADD = 5;                       // ENHANCE_ADJUST_FAILD_PROB_ADD：每失败一次 +5%
  const ADJ_RARITY_PROB_ADD = { 4: 5, 5: 15 };      // SYSTEM_ENHANCE_ADJUST_RARITY_PROB_ADD
  const ADJ_MAX_RARITY = 5;                         // ADJUST_WEAPON_TECH_MAX_RARITY
  var hexTech = {}, hexFail = {};
  try { hexTech = JSON.parse(localStorage.getItem(LS_HEX) || '{}') || {}; } catch (e) { hexTech = {}; }
  try { hexFail = JSON.parse(localStorage.getItem(LS_HEXFAIL) || '{}') || {}; } catch (e) { hexFail = {}; }
  function saveHex() {
    try { localStorage.setItem(LS_HEX, JSON.stringify(hexTech)); } catch (e) {}
    try { localStorage.setItem(LS_HEXFAIL, JSON.stringify(hexFail)); } catch (e) {}
  }
  function hexKey(t) { return shipKey + '|' + sysName + '|' + t.id; }
  function hexList(t) { var v = hexTech[hexKey(t)]; return Array.isArray(v) ? v : []; }
  function hexSetList(t, list) {
    var k = hexKey(t);
    if (!list || !list.length) delete hexTech[k]; else hexTech[k] = list;
  }
  function hexFails(t) { return Number(hexFail[hexKey(t)]) || 0; }
  function hexSetFails(t, n) {
    var k = hexKey(t);
    if (!n) delete hexFail[k]; else hexFail[k] = n;
  }
  // 节点类型：key = 系统调校钥匙，adjust = 调教节点，extend = 其它扩展解锁节点
  function hexKind(t) {
    if (t.ul !== -1) return '';
    if (t.tg) return 'adjust';
    if (t.ky) return 'key';
    return 'extend';
  }
  // 价值 = 数量 × ENHANCE_VALUE
  function hexValue(list, onlyRarity) {
    var s = 0;
    for (var i = 0; i < list.length; i++) {
      var it = list[i];
      if (onlyRarity && onlyRarity.indexOf(String(it.r)) < 0) continue;
      s += (Number(it.v) || 0) * Math.max(1, Number(it.c) || 1);
    }
    return s;
  }
  function hexTypeBad(list, types) {
    if (!types || !types.length) return null;
    for (var i = 0; i < list.length; i++)
      if (types.indexOf(String(list[i].t)) < 0)
        return '武器技术类型需为 ' + types.join(' / ') + '（登记的是 ' + list[i].t + '）';
    return null;
  }
  // 扩展解锁校验：返回 null 表示合格
  function hexUnlockCheck(t, list) {
    if (!list.length) return '未登记武器技术';
    var uq = t.uq || {};
    var bad = hexTypeBad(list, uq.ty);
    if (bad) return bad;
    var ways = uq.ways || [];
    if (!ways.length) return null;
    for (var i = 0; i < ways.length; i++) {
      var w = ways[i];
      if (hexValue(list, w.r) >= Number(w.v)) return null;
    }
    return '未达解锁门槛（' + ways.map(function (w) {
      return '稀有度 ' + w.r.join('/') + '、总价值 ≥ ' + w.v;
    }).join('；或 ') + '），当前总价值 ' + hexValue(list);
  }
  // 调教校验：返回 null 表示合格
  function hexAdjustCheck(t, list) {
    if (!list.length) return '未登记武器技术';
    var rl = t.rl || [];
    for (var i = 0; i < list.length; i++) {
      if (rl.length && rl.indexOf(String(list[i].r)) < 0)
        return '武器技术稀有度需为 ' + rl.join(' / ') + '（登记的是 ' + list[i].r + '）';
      if (Number(list[i].r) > ADJ_MAX_RARITY)
        return '武器技术稀有度不能超过 ' + ADJ_MAX_RARITY;
    }
    var bad = hexTypeBad(list, t.ty2);
    if (bad) return bad;
    if (t.av !== undefined && t.av !== null && hexValue(list) < Number(t.av))
      return '武器技术总价值 ' + hexValue(list) + ' < 门槛 ' + t.av;
    return null;
  }
  // 官方 refresh_success_ratio：
  //   成功率 = min(ADJUST_PROB[当前等级] + 5 × 连续失败次数, 100) + Σ(数量 × 稀有度加成)
  function hexRate(t) {
    var lv = lvOf(sysName, t.id);
    var base = t.ap && t.ap[lv] !== undefined ? Number(t.ap[lv]) : 0;
    var fails = hexFails(t);
    var fix = 0, list = hexList(t);
    for (var i = 0; i < list.length; i++)
      fix += Math.max(1, Number(list[i].c) || 1) * (ADJ_RARITY_PROB_ADD[String(list[i].r)] || 0);
    var capped = Math.min(base + fails * ADJ_FAIL_PROB_ADD, 100);
    return { lv: lv, base: base, fails: fails, capped: capped, fix: fix, total: Math.min(capped + fix, 100) };
  }
  // 本系统是否已解锁调校能力（官方 check_tuning_available：钥匙节点有等级即已解锁）
  function tuningReady(sn) {
    var s = ship && ship.systems[sn];
    if (!s || !s.tk) return true;      // 站内没有钥匙数据时不拦
    for (var i = 0; i < s.tk.length; i++) if (lvOf(sn, s.tk[i]) > 0) return true;
    return false;
  }
  // 目标强化节点被哪个调教节点提升（站内只展示，不改属性：官方按 ADJUST_DESC 的 {T} 结算）
  function tunerOf(sn, tid) {
    var s = ship && ship.systems[sn];
    if (!s) return null;
    for (var i = 0; i < s.techs.length; i++) if (s.techs[i].tg === tid) return s.techs[i];
    return null;
  }

  // ---------- 舰船栏 ----------
  var TYPE_ORDER = ['战列舰', '战列巡洋舰', '航空母舰', '巡洋舰', '驱逐舰', '护卫舰',
                    '登陆舰', '护航艇', '战机', '支援舰'];
  function renderShips(q) {
    q = (q || '').trim();
    var groups = {}, order = [];
    for (var k in DATA) {
      var w = DATA[k];
      var nm = (w.name || '') + ' ' + (w.model || '') + ' ' + (w.type || '');
      if (q && nm.indexOf(q) < 0) continue;
      var g = w.type || '其它';
      if (!groups[g]) { groups[g] = []; order.push(g); }
      groups[g].push(k);
    }
    order.sort(function (a, b) {
      var ia = TYPE_ORDER.indexOf(a), ib = TYPE_ORDER.indexOf(b);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });
    var h = '', n = 0;
    for (var i = 0; i < order.length; i++) {
      var arr = groups[order[i]]; n += arr.length;
      h += '<div class="ss-grp">' + esc(order[i]) + ' · ' + arr.length + '</div>';
      for (var j = 0; j < arr.length; j++) {
        var k2 = arr[j], w2 = DATA[k2];
        var cnt = OFF[k2] ? Object.keys(OFF[k2].systems || {}).length : 0;
        h += '<div class="ss-it' + (k2 === shipKey ? ' on' : '') + '" data-k="' + esc(k2) + '">' +
             '<span>' + esc(w2.name + '·' + w2.model) + '</span>' +
             '<span class="c">' + cnt + '</span></div>';
      }
    }
    if (!n) h = '<div class="ss-grp">无匹配</div>';
    shipList.innerHTML = h;
  }

  // ---------- 系统图标栏 ----------
  function renderSysCol() {
    if (!ship) { sysCol.innerHTML = ''; return; }
    var sys = ship.systems, keys = Object.keys(sys);
    var h = '';
    for (var i = 0; i < keys.length; i++) {
      var s = sys[keys[i]];
      var maxAdd = 0, on = 0;
      for (var k = 0; k < s.techs.length; k++) {
        if (s.techs[k].mx <= 0) continue;
        maxAdd++;
        if (lvOf(keys[i], s.techs[k].id) >= s.techs[k].mx) on++;
      }
      var pips = '';
      var shown = Math.min(maxAdd, 12);
      for (var p = 0; p < shown; p++) pips += '<i class="' + (p < on ? 'on' : '') + '"></i>';
      var isMain = /主武器|机库|轨道炮|舰首/.test(s.officialName || s.name);
      h += '<div class="sy' + (keys[i] === sysName ? ' on' : '') + '" data-s="' + esc(keys[i]) + '" title="' +
           esc((s.officialName || s.name) + '（' + (s.label || '') + '）') + '">' +
           (isMain ? '<span class="m">M</span>' : '') +
           '<span class="ex">⌃</span>' + icon(s.icon) +
           '<div class="nm">' + esc(s.label || s.officialName || s.name) + '</div>' +
           '<div class="pips">' + pips + '</div>' +
           (on ? '<span class="cnt">' + on + '/' + maxAdd + '</span>' : '') +
           '</div>';
    }
    sysCol.innerHTML = h;
  }

  // ---------- 属性面板 ----------
  var shipPanelOpen = true, sysPropsOpen = false;   // 折叠状态跨重绘保留
  function num(v) { return Math.round(Number(v) || 0).toLocaleString('zh-CN'); }

  function shipPanelHtml() {
    if (!ship) return '';
    var st = statsOf(ship);
    var enh = mults();
    var variantCount = 0;
    for (var k in DATA) if (DATA[k].name === ship.name) variantCount++;
    var wt = weaponTotals(), dp = weaponDpm();
    var brief = [];
    if (st) {
      brief.push('指挥值 ' + st.commandValue);
      brief.push('生命 ' + num((st.hp || 0) * enh.hpMul + (enh.hpAdd || 0)));
      brief.push('物理装甲 ' + num((st.physicalArmor || 0) * enh.physMul + (enh.physAdd || 0)));
    }
    if (dp.antiShip) brief.push('对舰 DPM ' + num(dp.antiShip * enh.fireMul));

    var h = '<details class="sp-panel"' + (shipPanelOpen ? ' open' : '') + '>';
    h += '<summary><span class="pt">' + esc((ship.name || '') + (ship.model ? '·' + ship.model : '')) + '</span>' +
         '<span class="ps">' + esc(brief.join(' · ')) + '</span>' +
         '<span class="pm">已投入 ' + enh.invested + ' 点</span></summary>';
    if (!st) {
      h += '<div class="sp-empty">这艘舰船在属性数据里没有记录</div></details>';
      return h;
    }
    h += '<div class="sp-top">';
    h += '<span><b>' + esc(st.type || ship.type || '') + '</b>' + (st.position ? ' · ' + esc(st.position) : '') + '</span>';
    h += '<span class="badge">' + esc(shipClassOf(ship.type)) + '</span>';
    h += '<span class="badge">' + esc(shipScaleOf(ship.type)) + '</span>';
    h += '<span>指挥值 <b>' + esc(st.commandValue) + '</b></span>';
    h += '<span>变体 <b>' + variantCount + '</b></span>';
    h += '<span>已投入科技点 <b>' + enh.invested + '</b></span>';
    h += '<span>服役上限 <b>' + esc(st.serviceLimit) + '</b></span>';
    h += '</div>';

    h += '<div class="sp-sec"><div class="sp-t">火力属性</div><div class="sp-grid">';
    h += '<span>反舰 ' + (dp.antiShip ? fmtStat(dp.antiShip, enh.fireMul, 0, num) : '—') + '<i class="src">DPM</i></span>';
    h += '<span>防空 ' + (dp.antiAir ? fmtStat(dp.antiAir, enh.aaMul, 0, num) : '—') + '<i class="src">DPM</i></span>';
    h += '<span>攻城 ' + (dp.siege ? fmtStat(dp.siege, enh.siegeMul, 0, num) : '—') + '<i class="src">DPM</i></span>';
    h += '</div></div>';

    h += '<div class="sp-sec"><div class="sp-t">基础属性</div><div class="sp-grid">';
    h += '<span>舰船生命 ' + fmtStat(st.hp || 0, enh.hpMul, enh.hpAdd, num) + '</span>';
    (function () {
      var cv = st.cruise;
      if (cv === undefined || cv === null || cv === '') h += '<span>巡航速度 <b>—</b></span>';
      else if (/^\d+$/.test(String(cv)) && enh.cruiseMul > 1.0001) h += '<span>巡航速度 <b class="boost">' + num(cv * enh.cruiseMul) + '</b></span>';
      else h += '<span>巡航速度 <b>' + esc(cv) + '</b></span>';
    })();
    h += '<span>曲速 ' + fmtStat(st.warp || 0, enh.warpMul, 0, num) + '</span>';
    h += '<span>物理装甲 ' + fmtStat(st.physicalArmor || 0, enh.physMul, enh.physAdd, num) + '</span>';
    h += '<span>能量装甲 ' + fmtStat(st.energyArmor || 0, enh.energyMul, enh.energyAdd, num) + '</span>';
    h += '<span>尺寸 <b>' + (st.size ? num(st.size) + 'm' : '—') + '</b></span>';
    h += '</div></div>';

    if (st.build) {
      h += '<div class="sp-sec"><div class="sp-t">建造</div><div class="sp-grid">';
      h += '<span>金属 <b>' + num(st.build.metal) + '</b></span>';
      h += '<span>晶体 <b>' + num(st.build.crystal) + '</b></span>';
      h += '<span>重氢 <b>' + num(st.build.deuterium) + '</b></span>';
      h += '<span>时间 <b>' + (Number(st.build.time) || 0).toFixed(2) + ' 天</b></span>';
      h += '<span>容量 <b>' + num(st.build.capacity) + '</b></span>';
      h += '</div></div>';
    }

    if (wt.weapons) {
      h += '<div class="sp-sec"><div class="sp-t">武器系统合计（' + wt.weapons + ' 件武器）</div><div class="sp-grid">';
      h += '<span>伤害 <b>' + num(wt.damage * enh.fireMul) + '</b></span>';
      h += '<span>循环 ' + fmtStat(wt.cycle, enh.cdMul, 0, sec1) + '</span>';
      h += '<span>锁定 <b>' + num(wt.lockOn) + '</b></span>';
      h += '<span>轮数 <b>' + num(wt.rounds) + '</b></span>';
      h += '<span>冷却 <b>' + (enh.cdMul < 1 ? sec1(wt.cooldown * enh.cdMul) : num(wt.cooldown)) + 's</b></span>';
      h += '<span>持续 ' + fmtStat(wt.duration, enh.durMul, 0, sec1) + 's</span>';
      h += '</div></div>';
    }
    h += '</details>';
    return h;
  }

  function sysPropsHtml(sn) {
    var ss = sysStatsOf(sn);
    if (!ss || !ss.weapons || !ss.weapons.length) return '';
    var enh = mults();
    var slots = {}, order = [];
    for (var i = 0; i < ss.weapons.length; i++) {
      var w = ss.weapons[i], o = w.option || w.name;
      if (!slots[o]) { slots[o] = []; order.push(o); }
      slots[o].push(w);
    }
    var saved = (weaponChoice[shipKey] || {})[sn] || {};
    var body = '';
    for (var a = 0; a < order.length; a++) {
      var list = slots[order[a]], chosen = null;
      for (var b = 0; b < list.length; b++) if (list[b].name === saved[order[a]]) chosen = list[b];
      if (!chosen) chosen = list[0];
      body += '<div class="fx-item">';
      body += '<div class="fx-head"><span class="fx-nm">' + esc(chosen.name) + '</span>';
      if (list.length > 1) {
        body += '<span class="fx-picks">';
        for (var c = 0; c < list.length; c++) {
          var on = list[c] === chosen;
          body += '<button class="fx-pick' + (on ? ' on' : '') + '" data-opt="' + esc(order[a]) +
                  '" data-w="' + esc(list[c].name) + '"' + (on ? ' disabled' : '') + '>' + esc(list[c].name) + '</button>';
        }
        body += '</span>';
      }
      body += '</div>';
      body += '<div class="fx-grid">';
      if (chosen.type) body += '<span class="tag">' + esc(chosen.type) + '</span>';
      if (chosen.weaponType) body += '<span class="tag">' + esc(chosen.weaponType) + '</span>';
      if (chosen.damage !== undefined) body += '<span>伤害 <b>' + num(chosen.damage * enh.fireMul) + '</b></span>';
      if (chosen.cycle !== undefined) body += '<span>循环 ' + fmtStat(chosen.cycle, enh.cdMul, 0, sec1) + '</span>';
      if (chosen.lockOn !== undefined) body += '<span>锁定 <b>' + num(chosen.lockOn) + '</b></span>';
      if (chosen.rounds !== undefined) body += '<span>轮数 <b>' + num(chosen.rounds) + '</b></span>';
      if (chosen.cooldown !== undefined) body += '<span>冷却 <b>' + (enh.cdMul < 1 ? sec1(chosen.cooldown * enh.cdMul) : num(chosen.cooldown)) + 's</b></span>';
      if (chosen.duration !== undefined) body += '<span>持续 ' + fmtStat(chosen.duration, enh.durMul, 0, sec1) + 's</span>';
      body += '</div>';
      var acts = chosen.actions || [];
      for (var d = 0; d < acts.length; d++) {
        var ac = acts[d], info = ac.name || '';
        if (ac.effect && ac.act) info += ' · ' + ac.effect + ac.act + (ac.value !== undefined ? ' +' + ac.value : '');
        if (ac.cond && ac.condValue !== undefined) info += '（' + ac.cond + ac.condValue + '）';
        body += '<div class="fx-act"><span>' + esc(info) + '</span>' +
                (ac.desc ? '<div class="fx-desc">' + esc(ac.desc) + '</div>' : '') + '</div>';
      }
      body += '</div>';
    }
    return '<details class="fx-panel"' + (sysPropsOpen ? ' open' : '') + '>' +
           '<summary><span class="pt">系统属性</span><span class="ps">' + ss.weapons.length + ' 件武器</span></summary>' +
           body + '</details>';
  }

  // 面板交互：折叠状态、互斥武器切换
  function bindPanel() {
    var p = mainCol.querySelector('.sp-panel');
    if (p) p.addEventListener('toggle', function () { shipPanelOpen = this.open; });
    var f = mainCol.querySelector('.fx-panel');
    if (f) f.addEventListener('toggle', function () { sysPropsOpen = this.open; });
    var picks = mainCol.querySelectorAll('.fx-pick');
    for (var i = 0; i < picks.length; i++) {
      picks[i].addEventListener('click', function () {
        var sn = sysName, opt = this.getAttribute('data-opt'), w = this.getAttribute('data-w');
        if (!sn || !opt) return;
        var bag = weaponChoice[shipKey] = weaponChoice[shipKey] || {};
        var slot = bag[sn] = bag[sn] || {};
        slot[opt] = w;
        saveWeaponChoice();
        renderMain();
      });
    }
  }

  // ---------- 主体 ----------
  function renderMain() {
    if (!ship) { mainCol.innerHTML = '<div class="empty">← 请选择舰船与系统</div>'; return; }
    if (!sysName) {
      mainCol.innerHTML = shipPanelHtml() + '<div class="empty">← 请选择系统</div>';
      bindPanel();
      return;
    }
    var s = ship.systems[sysName];
    var list = s.techs;
    var maxAdd = 0, lvSum = 0, spent = 0;
    for (var i = 0; i < list.length; i++) {
      var t = list[i];
      if (t.mx <= 0) continue;
      maxAdd++;
      var l = lvOf(sysName, t.id);
      lvSum += l;
      for (var c = 1; c <= l; c++) spent += costOf(t, baseOf(t) + c);
    }

    var h = shipPanelHtml() + '<div class="sys-head">' +
      '<div class="bar"><span class="t">' + esc(s.officialName || s.name) + '</span>' +
      '<span class="m">(' + lvSum + '/' + maxAdd + ')</span></div>' +
      '<span class="sp">' +
      '<span class="tbtn" style="cursor:default">' + esc(s.label || '系统') + '</span>' +
      '</span></div>';

    var chip = '';
    if (selTech) {
      var ct = techById(list, selTech.id);
      if (ct) chip = '<div class="chip">' + esc(ct.n) + ' ' + absLv(ct) + '/' + absMax(ct) + '</div>';
    }
    h += '<div class="attr-bar">' +
      '<div class="a"><span>已投入</span><b>' + spent + '</b></div>' +
      '<div class="a"><span>剩余</span><b>' + (points - spent) + '</b></div>' +
      '<div class="a"><span>强化项</span><b>' + maxAdd + '</b></div>' + chip +
      '</div>';
    h += sysPropsHtml(sysName);

    // 官方排版：rw=行(cl=列) 来自 traverse_enhance_tree 的「列=DFS深度、行=列内ui_level分组」
    // ul=-1 六边形（adjust），ul=-2 树外节点（自维修/集火，官方不进树，不渲染）
    var show = [], hx = [], ncol = 0;
    for (var j = 0; j < list.length; j++) {
      var ul = list[j].ul === undefined ? -2 : list[j].ul;
      if (ul === -1) { hx.push(list[j]); continue; }
      if (ul === -2) continue;
      show.push(list[j]);
      if ((list[j].cl || 0) + 1 > ncol) ncol = (list[j].cl || 0) + 1;
    }
    var nrow = 0;
    for (var j2 = 0; j2 < show.length; j2++) {
      if ((show[j2].rw || 0) + 1 > nrow) nrow = (show[j2].rw || 0) + 1;
    }
    if (hx.length) nrow++;                       // 六边形行排在最后
    h += '<div class="tree-wrap"><svg class="tree-svg" id="treeSvg"></svg>' +
         '<div class="tree" id="tree" style="grid-template-columns:repeat(' + ncol + ',76px)">';
    for (var q = 0; q < show.length; q++) {
      var tq = show[q];
      h += nodeHtml(tq, list, ((tq.rw || 0) + 1) + '/' + ((tq.cl || 0) + 1));
    }
    for (var q2 = 0; q2 < hx.length; q2++) {
      h += nodeHtml(hx[q2], list, nrow + '/' + (q2 + 1));
    }
    h += '</div></div>';
    h += detailHtml(list);
    h += '<div class="hint">节点方块＝官方强化项，图标与文字取自官方 <b>cfg_system_effect</b>；' +
      '连线＝官方 <b>cfg_system_enhance_tree</b> 的前置关系（要求前置达到指定等级，未满足则锁定）。' +
      '底部六边形＝官方的<b>扩展解锁</b>与<b>调教</b>项，不吃科技点：扩展解锁要登记并消耗武器技术（稀有度与总价值按配置门槛），' +
      '调教要先把本系统的「系统调校」解锁，再按 <b>ADJUST_PROB</b> 逐级掷骰提升目标强化项（连续失败每次 +5%）。' +
      '点击节点查看详情。<br>' +
      '描述中的 <b>[Lv.N]</b>、<b>[周期]</b>、<b>[持续]</b> 是官方模板里由服务器按舰船实际数据下发的数值，' +
      '本站未内置，故以标记显示，不代表最终数值。</div>';

    mainCol.innerHTML = h;
    scheduleLines(list);
    bindMain(list);
    bindPanel();
  }

  function nodeHtml(t, list, gridArea) {
    var l = lvOf(sysName, t.id);
    var maxed = t.mx <= 0 || l >= t.mx;
    var pq = prereqOf(list, t);
    var blocked = !!(pq && pq.every(function (x) { return !x.ok; }));
    var cls = 'node';
    // 六边形 = 官方调教/扩展解锁项（UNLOCK_TYPE != 0 或 EFFECT_TYPE == ADJUST），对应游戏底部那行斜纹块
    var kind = hexKind(t);
    if (kind) cls += ' hex';
    if (t.mx > 0) cls += ' addable';
    if (maxed && t.mx > 0) cls += ' maxed';
    if (blocked) cls += ' locked';
    if (selTech && selTech.id === t.id) cls += ' sel';
    var hxBad = null;
    if (kind === 'adjust') {
      hxBad = hexAdjustCheck(t, hexList(t));
      if (!tuningReady(sysName)) hxBad = '本系统的「系统调校」尚未解锁';
      else if (maxed) hxBad = null;
    }

    var cost = (t.mx > 0 && !maxed && !kind) ? costOf(t, baseOf(t) + l + 1) : 0;
    var lvTxt = '';
    if (kind === 'adjust') lvTxt = '<span class="lv">' + l + '/' + absMax(t) + '</span>';
    else if (t.mx > 0) lvTxt = '<span class="lv">' + (baseOf(t) + l) + '/' + absMax(t) + '</span>';
    if (kind === 'adjust') {
      if (!tuningReady(sysName)) cls += ' hexwait';
      else if (hxBad) cls += ' hexwait';
      else cls += ' hexok';
    } else if (kind) {
      cls += l > 0 ? ' hexok' : ' hexwait';
    }
    var flag = '';
    if (t.c === 1) flag = '<span class="flag">互</span>';
    else if (t.c === 2) flag = '<span class="flag">模</span>';
    else if (t.ut) flag = '<span class="flag">稀</span>';

    var hxTitle = '';
    if (kind === 'adjust') hxTitle = ' title="' + esc(hxBad ? hxBad : ('调教 ' + l + '/' + t.mx)) + '"';
    else if (kind) hxTitle = ' title="' + esc((kind === 'key' ? '系统调校：' : '扩展解锁：') + (l > 0 ? '已解锁' : '未解锁')) + '"';

    return '<div class="' + cls + '"' + (gridArea ? ' style="grid-area:' + gridArea + '"' : '') +
      ' data-id="' + t.id + '" data-sys="' + esc(sysName) + '"' + hxTitle + '>' +
      '<div class="box">' + flag + icon(t.ic) +
      '<span class="lb">' + esc(t.lb || t.n) + '</span>' + lvTxt +
      (cost ? '<span class="cost">' + cost + '</span>' : '') + '</div>' +
      '</div>';
  }

  function hexFormHtml(t) {
    var list = hexList(t);
    var rows = list.map(function (it, i) {
      return '<div class="hxrow" data-hxrow="' + i + '">' +
        '<input class="hxi" data-hx="n" list="hxNames" placeholder="名称" value="' + esc(it.n || '') + '">' +
        '<input class="hxi hxn" data-hx="r" placeholder="稀有度" value="' + esc(it.r == null ? '' : it.r) + '">' +
        '<input class="hxi hxn" data-hx="t" placeholder="类型" value="' + esc(it.t == null ? '' : it.t) + '">' +
        '<input class="hxi hxn" data-hx="v" placeholder="价值" value="' + esc(it.v == null ? '' : it.v) + '">' +
        '<input class="hxi hxn" data-hx="c" placeholder="数量" value="' + esc(it.c == null ? 1 : it.c) + '">' +
        '<button class="tbtn" data-act="hexdel" data-row="' + i + '">删</button>' +
        '</div>';
    }).join('');
    return '<div class="hx">' +
      '<div class="hxlabel">武器技术清单（官方按 ENHANCE_VALUE × 数量累计总价值）' +
      (t.av !== undefined && t.av !== null ? '，本项需总价值 ≥ ' + esc(t.av) : '') + '</div>' +
      rows +
      '<div class="hxrow"><button class="tbtn" data-act="hexadd">加一门技术</button>' +
      '<button class="tbtn" data-act="hexsave">保存登记</button>' +
      '<button class="tbtn" data-act="hexclear">清空</button>' +
      '<datalist id="hxNames">' + hxNameOptions() + '</datalist></div>' +
      '<div class="hxsum">合计总价值 <b>' + hexValue(list) + '</b>　共 ' +
      list.reduce(function (a, it) { return a + Math.max(1, Number(it.c) || 1); }, 0) + ' 份</div>' +
      '</div>';
  }
  // 已登记过的武器技术名称，供 datalist 复用
  function hxNameOptions() {
    var seen = {}, out = [];
    for (var k in hexTech) {
      var arr = hexTech[k] || [];
      for (var i = 0; i < arr.length; i++) {
        var n = arr[i] && arr[i].n;
        if (n && !seen[n]) { seen[n] = 1; out.push('<option value="' + esc(n) + '">'); }
      }
    }
    return out.join('');
  }

  function detailHtml(list) {
    var t = selTech && techById(list, selTech.id);
    if (!t) return '<div class="detail"><div class="d">点击上方任一强化节点查看详情、加减等级。</div></div>';
    var l = lvOf(sysName, t.id);
    var pq = prereqOf(list, t);
    var blocked = !!(pq && pq.every(function (x) { return !x.ok; }));
    var maxed = t.mx <= 0 || l >= t.mx;
    var kind = hexKind(t);
    var h = '<div class="detail" data-d="' + t.id + '">';
    h += '<div class="h">' + esc(t.n) +
      (t.lb ? '<em>' + esc(t.lb) + '</em>' : '') +
      (kind === 'key' ? '<em>系统调校</em>' : (kind === 'adjust' ? '<em>调教</em>' : (kind === 'extend' ? '<em>扩展解锁</em>' : ''))) +
      (t.c === 1 ? '<em>调整</em>' : '') + (t.c === 2 ? '<em>模组</em>' : '') +
      (baseOf(t) ? '<em>默认 ' + baseOf(t) + ' 级</em>' : '') +
      (t.ut ? '<em>稀有度解锁</em>' : '') +
      '<span style="margin-left:auto;font-size:.68rem;color:#9aa0a2">节点 ' + esc(t.id) + '</span></div>';
    if (t.ds) h += '<div class="d">' + esc(t.ds).replace(/\[([^\]]+)\]/g, '<span class="mk">[$1]</span>') + '</div>';
    if (t.d) h += '<details class="dt"><summary>详细说明</summary>' + esc(t.d) + '</details>';

    // 被本节点调教的目标
    var tuned = tunerOf(sysName, t.id);
    if (tuned) {
      h += '<div class="pq">被调教：' + esc(tuned.n) + '（节点 ' + esc(tuned.id) + '）当前调教 ' +
        lvOf(sysName, tuned.id) + ' 级。官方按 ADJUST_DESC 的「{T}」由服务器结算，本站无该数值，未计入属性。</div>';
    }

    if (t.ur) h += '<div class="pq">' + esc(t.ur) + '</div>';

    var hxBad = null;
    if (kind === 'adjust') {
      var rt = hexRate(t);
      var target = t.tg ? techById(list, t.tg) : null;
      h += '<div class="dt">调教成功率 ' + rt.total + '%' +
        '（基础 ' + rt.base + '%' +
        (rt.fails ? ' + 失败补偿 ' + (rt.fails * ADJ_FAIL_PROB_ADD) + '%（连续失败 ' + rt.fails + ' 次）' : '') +
        (rt.fix ? ' + 稀有度加成 ' + rt.fix + '%' : '') +
        '，上限 100%）' +
        (target ? '　目标：' + esc(target.n) + '（节点 ' + esc(target.id) + '）' : '') +
        '</div>';
      h += '<details class="dt"><summary>逐级概率</summary>' +
        esc(t.ap.map(function (p, i) { return '第 ' + (i + 1) + ' 级 ' + p + '%'; }).join('　')) +
        '</details>';
      if (!tuningReady(sysName)) hxBad = '本系统的「系统调校」尚未解锁';
      else hxBad = maxed ? null : hexAdjustCheck(t, hexList(t));
      h += hexFormHtml(t);
      h += '<div class="' + (hxBad ? 'pq' : 'dt') + '">' + (hxBad ? '未满足：' + esc(hxBad) : '登记合格') + '</div>';
    } else if (kind) {
      hxBad = l > 0 ? null : hexUnlockCheck(t, hexList(t));
      h += hexFormHtml(t);
      h += '<div class="' + (hxBad ? 'pq' : 'dt') + '">' +
        (hxBad ? '未满足：' + esc(hxBad) : (l > 0 ? '已解锁' : '登记合格，可解锁')) + '</div>';
    } else if (t.ap && t.ap.length) {
      var nx = t.ap[l];
      h += '<div class="dt">' + (nx !== undefined ? '下一级 ' + nx + '%　' : '') +
        '<details><summary>逐级概率</summary>' +
        esc(t.ap.map(function (p, i) { return '第 ' + (i + 1) + ' 级 ' + p + '%'; }).join('　')) +
        '</details></div>';
    }
    if (pq && unmetTxt(pq)) h += '<div class="pq">任一前置加点后解锁（当前未加）：' + esc(unmetTxt(pq)) + '</div>';

    h += '<div class="ops">';
    if (kind === 'adjust') {
      h += '<button class="tbtn" data-act="adjstep"' + (hxBad ? ' disabled' : '') + '>调教一次</button>';
      h += '<button class="tbtn" data-act="adjplan" data-lv="' + Math.min(t.mx, l + 1) + '"' +
        (maxed ? ' disabled' : '') + '>直接设到 ' + Math.min(t.mx, l + 1) + ' 级</button>';
      h += '<button class="tbtn" data-act="minus"' + (l <= 0 ? ' disabled' : '') + '>− 降 1 级</button>';
      h += '<span class="t">调教 ' + l + ' / ' + t.mx + ' 次　连续失败 ' + hexFails(t) + ' 次</span>';
    } else if (kind) {
      h += '<button class="tbtn" data-act="hexunlock"' + (l > 0 || hxBad ? ' disabled' : '') + '>解锁</button>';
      h += '<span class="t">' + (l > 0 ? '已解锁' : '未解锁') + ' · 不消耗科技点</span>';
    } else {
      h += '<button class="tbtn" data-act="minus"' + (l <= 0 ? ' disabled' : '') + '>− 降 1 级</button>';
      h += '<button class="tbtn" data-act="plus"' +
        ((t.mx <= 0 || maxed || blocked) ? ' disabled' : '') + '>＋ 升 1 级</button>';
      h += '<span class="t">当前 ' + (baseOf(t) + lvOf(sysName, t.id)) + ' / ' + absMax(t) + ' 级' +
        (maxed || t.mx <= 0 ? '' : ' · 下一级消耗 ' + costOf(t, baseOf(t) + l + 1) + ' 点') + '</span>';
    }
    h += '</div></div>';
    return h;
  }

  // ---------- 连线 ----------
  // 注意：必须在图标/字体完成布局后再测量，否则量到的是塌陷尺寸
  var lineRaf = 0;
  function scheduleLines(list) {
    if (lineRaf) cancelAnimationFrame(lineRaf);
    lineRaf = requestAnimationFrame(function () {
      lineRaf = requestAnimationFrame(function () { drawLines(list); });
    });
  }

  function drawLines(list) {
    var svg = $('treeSvg');
    var wrap = svg && svg.parentNode;
    if (!svg || !wrap) return;
    var wr = wrap.getBoundingClientRect();
    if (!wr.width || !wr.height) return;
    svg.setAttribute('viewBox', '0 0 ' + wr.width + ' ' + wr.height);
    svg.setAttribute('width', wr.width);
    svg.setAttribute('height', wr.height);
    svg.style.width = wr.width + 'px';
    svg.style.height = wr.height + 'px';
    var pos = {};
    var nodes = wrap.querySelectorAll('.node');
    var rowOf = {}, colOf = {};
    for (var li = 0; li < list.length; li++) {
      rowOf[list[li].id] = list[li].rw;
      colOf[list[li].id] = list[li].cl;
    }
    for (var i = 0; i < nodes.length; i++) {
      var r = nodes[i].getBoundingClientRect();
      var nid = nodes[i].getAttribute('data-id');
      pos[nid] = {
        x: r.left - wr.left + r.width / 2,
        y: r.top - wr.top + r.height / 2,
        cx: r.left - wr.left + r.width / 2,
        cy: r.top - wr.top + r.height / 2,
        l: r.left - wr.left, t: r.top - wr.top,
        r: r.right - wr.left, b: r.bottom - wr.top,
        row: rowOf[nid] === undefined ? -1 : rowOf[nid],
        col: colOf[nid] === undefined ? -1 : colOf[nid],
        w: r.width, h: r.height
      };
    }
    // 网格缝隙宽度：官方连线只走缝里，不压节点。取 CSS 的实际列/行间距。
    var treeEl = $('tree');
    var tcs = treeEl ? getComputedStyle(treeEl) : null;
    var colGap = tcs ? (parseFloat(tcs.columnGap) || 46) : 46;
    var rowGap = tcs ? (parseFloat(tcs.rowGap) || 14) : 14;
    var parts = [];
    // 官方连线用一个颜色画线、两端标记和环：线 2px、环外径 11px、方块 4x4（相对节点 71px）。
    // 站内节点 76px，按同比例取：线 1.5、环外径 9.2、方块 4x4。
    var LINE_C = 'rgba(255,255,255,.5)';
    var STROKE = 'stroke="' + LINE_C + '" stroke-width="1.5"';
    var PORT = 'fill="none" stroke="' + LINE_C + '" stroke-width="1.5"';
    var CAP_FILL = LINE_C;
    var CAP_LEN = 4, CAP_W = 4, PORT_BACK = 8;

    // 画一条折线：源端加方块（Node_line_start）、目标端加空心环（img_round）
    function link(pts) {
      var d = 'M' + pts[0][0] + ' ' + pts[0][1];
      for (var q = 1; q < pts.length; q++) d += ' L' + pts[q][0] + ' ' + pts[q][1];
      parts.push('<path d="' + d + '" fill="none" ' + STROKE + '/>');

      var s0 = pts[0], s1 = pts[1];
      var sdx = s1[0] - s0[0], sdy = s1[1] - s0[1];
      var slen = Math.sqrt(sdx * sdx + sdy * sdy) || 1;
      parts.push('<line x1="' + s0[0] + '" y1="' + s0[1] +
        '" x2="' + (s0[0] + sdx / slen * CAP_LEN) + '" y2="' + (s0[1] + sdy / slen * CAP_LEN) +
        '" stroke="' + CAP_FILL + '" stroke-width="' + CAP_W + '" stroke-linecap="butt"/>');

      var a = pts[pts.length - 2], b = pts[pts.length - 1];
      var dx = b[0] - a[0], dy = b[1] - a[1];
      var len = Math.sqrt(dx * dx + dy * dy) || 1;
      var back = Math.min(PORT_BACK, len / 2);
      parts.push('<circle cx="' + (b[0] - dx / len * back) + '" cy="' + (b[1] - dy / len * back) +
        '" r="4.6" ' + PORT + '/>');
    }

    // 主干：官方只在「根节点（单父为 0）且 ui_level != COMMON」时显示 panel_left_dot
    // （set_attr_data 行576-580），所以接入点是根节点，不是每行行首。
    var roots = [];
    for (var i2 = 0; i2 < list.length; i2++) {
      var t2 = list[i2];
      if (!pos[t2.id] || t2.ul === -2 || t2.ul === 0) continue;
      if (t2.ul === -1) continue;
      if (!t2.pq || !t2.pq.length) roots.push(t2);
    }
    if (roots.length) {
      var leftL = Math.min.apply(null, roots.map(function (t3) { return pos[t3.id].l; }));
      var mainX = leftL - 26;
      var ys = roots.map(function (t3) { return pos[t3.id].y; });
      var yTop = Math.min.apply(null, ys), yBot = Math.max.apply(null, ys);
      parts.push('<line x1="' + mainX + '" y1="' + yTop + '" x2="' + mainX + '" y2="' + yBot + '" ' + STROKE + '/>');
      roots.forEach(function (t4) {
        var p = pos[t4.id];
        // 接入段只画到最左一列：从主干一路横拉到右侧的列会横穿同行的其他节点
        // （游戏里主干只服务最左列，其余根节点只保留左侧的左点标记）。
        if (p.l > mainX + 1 && Math.abs(p.l - leftL) < 1) {
          parts.push('<line x1="' + mainX + '" y1="' + p.y + '" x2="' + p.l + '" y2="' + p.y + '" ' + STROKE + '/>');
        }
        parts.push('<circle cx="' + (p.l - PORT_BACK) + '" cy="' + p.y + '" r="4.6" ' + PORT + '/>');
      });
    }
    // 六边形链：官方 add_unlock_adjust_node 传 next_enhance_id，adjacent 之间画横线
    var hxa = [];
    for (var hi = 0; hi < list.length; hi++) {
      if (list[hi].ul === -1 && pos[list[hi].id]) hxa.push({ t: list[hi], p: pos[list[hi].id] });
    }
    hxa.sort(function (a, b) { return a.t.cl - b.t.cl; });
    for (var h1 = 0; h1 + 1 < hxa.length; h1++) {
      var hp = hxa[h1].p, hc = hxa[h1 + 1].p;
      link([[hp.r, hp.cy], [hc.l, hc.cy]]);
    }
    // 前置连线。形态只看两端在网格里的相对位置，照官方截图：线只走缝，不压任何节点。
    //   同行隔一列        → 列缝里一条横线
    //   相邻行 + 相邻列   → 两个面对面的角直接连
    //   同列 + 相邻行     → 行缝里一条竖线
    //   其余（跨多行/跨多列）→ 沿列缝竖走、沿行缝横穿的折线
    // 跨 2 列以上且跨行的前置线不画：兜底折线要在行缝里横穿整段，会压过别的节点
    // 并与相邻斜线交叉（全站只有 603010209→603010206 一条，见 ST59级·防御型/舰首炮台系统）。
    var hexIds = {};
    for (var h0 = 0; h0 < list.length; h0++) if (list[h0].ul === -1) hexIds[list[h0].id] = 1;
    var pqSet = {};
    for (var j = 0; j < list.length; j++) {
      var t = list[j];
      if (!t.pq || t.ul === -1) continue;
      for (var m = 0; m < t.pq.length; m++) {
        var pid = t.pq[m][0];
        if (hexIds[pid]) continue;
        var pr = techById(list, pid);
        if (!pr) continue;
        if (pr.cl !== undefined && t.cl !== undefined &&
            Math.abs((t.cl || 0) - (pr.cl || 0)) >= 2 && t.rw !== pr.rw) continue;
        pqSet[pid + '>' + t.id] = 1;
      }
    }
    Object.keys(pqSet).forEach(function (k) {
      var ab = k.split('>');
      var par = pos[ab[0]], child = pos[ab[1]];      // par = 前置, child = 需要它的
      if (!par || !child) return;
      var drw = child.row - par.row;
      var dcl = child.col - par.col;
      var known = par.row >= 0 && par.col >= 0 && child.row >= 0 && child.col >= 0;

      if (known && drw === 0 && Math.abs(dcl) === 1) {
        var yRow = child.cy;
        if (dcl > 0) link([[par.r, yRow], [child.l, yRow]]);
        else link([[par.l, yRow], [child.r, yRow]]);
        return;
      }
      // 相邻列：不管隔几行都走同一形态 —— 两个面对面的角直接连。
      // 跨多行时它退化成一条更长的斜线，但始终落在两列之间的缝里，不压节点，
      // 也不会像多段折线那样拐点落在别的斜线上（旧的兜底折线就是这么叉上的）。
      if (known && drw !== 0 && Math.abs(dcl) === 1) {
        var upD = drw > 0 ? par : child;
        var dnD = drw > 0 ? child : par;
        var p1 = [dnD.cx > upD.cx ? upD.r : upD.l, upD.b];
        var p2 = [dnD.cx > upD.cx ? dnD.l : dnD.r, dnD.t];
        link(drw > 0 ? [p1, p2] : [p2, p1]);
        return;
      }
      if (known && Math.abs(drw) === 1 && dcl === 0) {
        if (drw > 0) link([[par.cx, par.b], [child.cx, child.t]]);
        else link([[par.cx, par.t], [child.cx, child.b]]);
        return;
      }

      // 兜底：横向绕到相邻列缝，纵向穿行缝；终点始终落在后继节点上
      if (Math.abs(par.cy - child.cy) < par.h / 2) {
        var yOut0 = par.b + rowGap / 2;
        link([[par.cx, par.b], [par.cx, yOut0], [child.cx, yOut0], [child.cx, child.b]]);
        return;
      }
      var upF = child.cy < par.cy ? child : par;
      var dnF = child.cy < par.cy ? par : child;
      var yOut = upF.b + rowGap / 2;                  // 上节点下方那条行缝
      var yIn = dnF.t - rowGap / 2;                   // 下节点上方那条行缝
      var corr = dnF.cx >= upF.cx ? upF.r + colGap / 2 : upF.l - colGap / 2;
      var pts = [[upF.cx, upF.b], [upF.cx, yOut], [corr, yOut],
                 [corr, yIn], [dnF.cx, yIn], [dnF.cx, dnF.t]];
      link(child === upF ? pts.slice().reverse() : pts);
    });
    svg.innerHTML = parts.join('');
  }

  // ---------- 交互 ----------
  function bindMain(list) {
    var ns = mainCol.querySelectorAll('.node');
    for (var i = 0; i < ns.length; i++) {
      ns[i].addEventListener('click', function () {
        var id = this.getAttribute('data-id');
        selTech = techById(list, id);
        renderMain();
      });
    }
    var ops = mainCol.querySelectorAll('.detail .tbtn[data-act]');
    for (var j = 0; j < ops.length; j++) {
      ops[j].addEventListener('click', function () {
        if (!selTech) return;
        var act = this.getAttribute('data-act');
        if (act === 'plus') doPlus(list, selTech);
        else if (act === 'minus') doMinus(list, selTech);
        else if (act === 'hexsave') saveHexReg(selTech);
        else if (act === 'hexclear') clearHexReg(selTech);
        else if (act === 'hexadd') addHexRow();
        else if (act === 'hexdel') delHexRow(Number(this.getAttribute('data-row')));
        else if (act === 'hexunlock') doHexUnlock(list, selTech);
        else if (act === 'adjstep') doAdjustStep(list, selTech);
        else if (act === 'adjplan') doAdjustPlan(list, selTech, Number(this.getAttribute('data-lv')));
      });
    }
  }

  // 从详情卡里读回登记表单（未保存的行也算，方便「加一门技术」后直接保存）
  function readHexRows() {
    var rows = mainCol.querySelectorAll('.detail .hxrow[data-hxrow]');
    var out = [];
    for (var i = 0; i < rows.length; i++) {
      var g = function (n) {
        var e = rows[i].querySelector('[data-hx="' + n + '"]');
        return e ? e.value.trim() : '';
      };
      var it = { n: g('n'), r: g('r'), t: g('t'), v: g('v'), c: g('c') };
      if (it.n || it.r || it.t || it.v) out.push(it);
    }
    return out;
  }
  function addHexRow() {
    var box = mainCol.querySelector('.detail .hx');
    if (!box || !selTech) return;
    var cur = readHexRows();
    cur.push({ n: '', r: '', t: '', v: '', c: '1' });
    hexSetList(selTech, cur); saveHex();
    renderMain();
  }
  function delHexRow(idx) {
    if (!selTech) return;
    var cur = readHexRows();
    cur.splice(idx, 1);
    hexSetList(selTech, cur); saveHex();
    renderMain();
  }
  function saveHexReg(t) {
    var list = readHexRows();
    hexSetList(t, list); saveHex();
    var bad = hexKind(t) === 'adjust' ? hexAdjustCheck(t, list) : hexUnlockCheck(t, list);
    renderMain();
    if (bad) tip('已登记，但不满足要求：' + bad);
  }
  function clearHexReg(t) {
    hexSetList(t, []); hexSetFails(t, 0); saveHex(); renderMain();
  }
  // 官方 confirm_for_extend：校验通过后消耗登记的武器技术，节点置为已解锁（默认等级）
  function doHexUnlock(list, t) {
    if (lvOf(sysName, t.id) > 0) return;
    var bad = hexUnlockCheck(t, hexList(t));
    if (bad) { tip(bad); return; }
    setLv(sysName, t.id, 1);
    spendHexList(t);
    saveHex(); save(); renderAll();
    tip((t.ky ? '已开放本系统调校能力' : '已解锁') + '：' + t.n);
  }
  // 一次动作消耗清单里各一份（官方每次确认都把所选武器技术发过去）
  function spendHexList(t) {
    var list = hexList(t).map(function (it) {
      var c = Math.max(1, Number(it.c) || 1);
      return { n: it.n, r: it.r, t: it.t, v: it.v, c: c - 1 };
    }).filter(function (it) { return it.c > 0; });
    hexSetList(t, list); saveHex();
  }
  // 官方 confirm_for_adjust：校验 + 掷 ADJUST_PROB，成功 +1 级，失败累计次数 +1
  function doAdjustStep(list, t) {
    if (!tuningReady(sysName)) { tip('本系统的「系统调校」尚未解锁'); return; }
    var l = lvOf(sysName, t.id);
    if (l >= t.mx) { tip('调教等级已满'); return; }
    var bad = hexAdjustCheck(t, hexList(t));
    if (bad) { tip(bad); return; }
    var rt = hexRate(t);
    var ok = Math.random() * 100 < rt.total;
    spendHexList(t);
    if (ok) { setLv(sysName, t.id, l + 1); hexSetFails(t, 0); }
    else hexSetFails(t, hexFails(t) + 1);
    saveHex(); save(); renderAll();
    var tgt = t.tg ? techById(list, t.tg) : null;
    tip('调教' + (ok ? '成功' : '失败') + '（成功率 ' + rt.total + '%）' +
        (tgt ? '，目标 ' + tgt.n : '') +
        (ok ? '' : '，连续失败 ' + hexFails(t) + ' 次，下次 +' + (hexFails(t) * ADJ_FAIL_PROB_ADD) + '%'));
  }
  // 规划用：直接设级，不掷骰、不计失败、不消耗
  function doAdjustPlan(list, t, lv) {
    if (!tuningReady(sysName)) { tip('本系统的「系统调校」尚未解锁'); return; }
    var l = lvOf(sysName, t.id);
    var to = Math.max(0, Math.min(t.mx, Number(lv) || 0));
    if (to === l) return;
    setLv(sysName, t.id, to);
    hexSetFails(t, 0);
    saveHex(); save(); renderAll();
    tip(t.n + ' 调教等级设为 ' + to + '（规划值，未掷骰）');
  }

  function doPlus(list, t) {
    if (t.mx <= 0) { tip('该项不可加点'); return; }
    if (hexKind(t)) { tip('六边形节点不吃科技点：扩展解锁用武器技术，调教用「调教一次」'); return; }
    var l = lvOf(sysName, t.id);
    if (l >= t.mx) return;
    var pq = prereqOf(list, t);
    if (pq && unmetTxt(pq)) { tip('任一前置加点后解锁（当前未加）：' + unmetTxt(pq)); return; }
    var c = costOf(t, baseOf(t) + l + 1);
    points -= c;
    setLv(sysName, t.id, l + 1);
    save(); renderAll();
  }
  function doMinus(list, t) {
    var l = lvOf(sysName, t.id);
    if (l <= 0) return;
    if (hexKind(t) === 'adjust') {
        setLv(sysName, t.id, l - 1);
      hexSetFails(t, 0);
      saveHex(); save(); renderAll();
      tip('调教等级降到 ' + (l - 1));
      return;
    }
    if (hexKind(t)) { tip('已解锁的六边形不能降级'); return; }
    var dep = dependentsOf(list, t).filter(function (d) { return lvOf(sysName, d.id) > 0; });
    if (dep.length) { tip('降级将使以下强化项失效：' + dep.map(function (d) { return d.n; }).join('、')); return; }
    var c = costOf(t, baseOf(t) + l);
    if (c > 0) points += c;
    setLv(sysName, t.id, l - 1);
    save(); renderAll();
  }

  function spentOf() {
    if (!ship || !sysName) return 0;
    var s = ship.systems[sysName], sum = 0;
    for (var i = 0; i < s.techs.length; i++) {
      var t = s.techs[i], l = lvOf(sysName, t.id);
      for (var c = 1; c <= l; c++) sum += costOf(t, baseOf(t) + c);
    }
    return sum;
  }

  function renderAll() {
    ptsNum.textContent = String(points);
    ptsBox.className = 'pts' + (points < 0 ? ' neg' : '');
    renderSysCol();
    renderMain();
  }

  function pickShip(k) {
    shipKey = k;
    var w = DATA[k], o = OFF[k];
    ship = o ? o : null;
    sysName = ship && Object.keys(ship.systems).length ? Object.keys(ship.systems)[0] : null;
    selTech = null;
    shipTitle.textContent = w ? (w.name + '·' + w.model + (w.type ? '　' + w.type : '')) : '系统强化';
    renderShips($('q').value);
    renderSysCol();
    renderMain();
  }

  shipList.addEventListener('click', function (e) {
    var it = e.target.closest ? e.target.closest('.ss-it') : null;
    if (it) pickShip(it.getAttribute('data-k'));
  });
  $('q').addEventListener('input', function () { renderShips(this.value); });
  sysCol.addEventListener('click', function (e) {
    var it = e.target.closest ? e.target.closest('.sy') : null;
    if (!it) return;
    sysName = it.getAttribute('data-s');
    selTech = null;
    renderAll();
  });
  $('btnAddPts').addEventListener('click', function () { points += 500; save(); renderAll(); });
  $('btnReset').addEventListener('click', function () {
    if (!ship || !sysName) { tip('请先选择系统'); return; }
    var sp = spentOf();
    if (sp <= 0) { tip('当前系统没有已加点的强化项'); return; }
    if (!confirm('重置「' + (ship.systems[sysName].officialName || sysName) + '」？返还 ' + sp + ' 点')) return;
    var m = levels[shipKey][sysName];
    for (var tid in m) delete m[tid];
    points += sp;
    selTech = null;
    save(); renderAll();
    tip('已重置，返还 ' + sp + ' 点');
  });
  // ---------- 方案码 ----------
  // 一艘船各系统各强化项的等级（UEG2 另带六边形的调教登记）→ 一行文本 → base64url。
  // 明文格式：UEG2|舰船名|系统id:节点数:等级串|系统id:节点数:等级串...|@系统名:节点id:名称:稀有度:类型;...
  // 等级串按节点 id 升序逐位记录，0-9 与 A-Z 对应 0-35 级；只写入有加点的系统。
  // 登记段的文本字段做 percent 编码，名称里的 ':' ';' '|' 不会破坏分隔。
  // UEG1 是旧格式（只有等级），仍可导入。
  var LV_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var PLAN_PREFIX = 'E1-';

  function b64e(s) {
    var by = new TextEncoder().encode(s), bin = '';
    for (var i = 0; i < by.length; i++) bin += String.fromCharCode(by[i]);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function b64d(s) {
    s = s.replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    var bin = atob(s), by = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) by[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(by);
  }
  function techsOrdered(sysv) {
    return sysv.techs.slice().sort(function (a, b) { return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0); });
  }
  function makePlanCode() {
    if (!ship) return '';
    var part = [], reg = [], names = Object.keys(ship.systems);
    for (var i = 0; i < names.length; i++) {
      var sn = names[i], sysv = ship.systems[sn], techs = techsOrdered(sysv), s = '', any = false;
      for (var j = 0; j < techs.length; j++) {
        var v = lvOf(sn, techs[j].id);
        if (v > 0) any = true;
        s += LV_CHARS.charAt(Math.min(v, 35));
        // 六边形的武器技术登记与连续失败次数跟等级一起走
        var item = hexTech[shipKey + '|' + sn + '|' + techs[j].id];
        var fails = hexFail[shipKey + '|' + sn + '|' + techs[j].id];
        if (!hexKind(techs[j])) continue;
        if (!(item && item.length) && !Number(fails)) continue;   // 没登记也没失败就不占位
        var body = (item || []).map(function (it) {
          return [it.n, it.r, it.t, it.v, it.c].map(function (x) {
            return encodeURIComponent(x == null ? '' : String(x));
          }).join('~');
        }).join(',');
        reg.push(encodeURIComponent(sn) + ':' + techs[j].id + ':' + body +
                 ':' + (Number(fails) || 0));
      }
      if (any) part.push(String(sysv.id || '') + ':' + techs.length + ':' + s);
    }
    if (!part.length && !reg.length) return '';
    var body2 = 'UEG2|' + shipKey + '|' + part.join('|');
    if (reg.length) body2 += '|@' + reg.join(';');
    return PLAN_PREFIX + b64e(body2);
  }
  function applyPlanCode(code) {
    code = String(code || '').replace(/\s+/g, '');
    if (!code) { planMsg('码是空的'); return; }
    var raw = code;
    if (code.indexOf(PLAN_PREFIX) === 0) {
      try { raw = b64d(code.slice(PLAN_PREFIX.length)); }
      catch (e) { planMsg('这个码无法识别，检查是否复制完整'); return; }
    }
    var f = raw.split('|');
    if ((f[0] !== 'UEG1' && f[0] !== 'UEG2') || f.length < 3) { planMsg('不是本站的方案码'); return; }
    var key = f[1], target = OFF[key];
    if (!target || !target.systems) { planMsg('这个码对应的舰船「' + key + '」站内没有数据'); return; }
    var src = target.systems, put = {}, skip = [], total = 0, regs = 0, badReg = 0;
    for (var i = 2; i < f.length; i++) {
      if (f[i].charAt(0) === '@') {
        var items = f[i].slice(1).split(';');
        for (var a = 0; a < items.length; a++) {
          var q = items[a].split(':');
          if (q.length < 4 || !q[0] || !q[1]) { badReg++; continue; }
          var rsn = decodeURIComponent(q[0]);
          var arr = q[2] ? q[2].split(',').map(function (row) {
            var f2 = row.split('~');
            return { n: decodeURIComponent(f2[0] || ''), r: decodeURIComponent(f2[1] || ''),
                     t: decodeURIComponent(f2[2] || ''), v: decodeURIComponent(f2[3] || ''),
                     c: decodeURIComponent(f2[4] || '1') };
          }) : [];
          var rk = key + '|' + rsn + '|' + q[1];
          if (arr.length) hexTech[rk] = arr; else delete hexTech[rk];
          var fl = parseInt(q[3], 10);
          if (fl > 0) hexFail[rk] = fl; else delete hexFail[rk];
          regs++;
        }
        continue;
      }
      var seg = f[i].split(':'), sid = seg[0], cnt = parseInt(seg[1], 10), lvs = seg[2] || '';
      var sysv = null, sysn = null, key2;
      for (key2 in src) if (String(src[key2].id) === sid) { sysv = src[key2]; sysn = key2; break; }
      if (!sysv) { skip.push(sid + '（无此系统）'); continue; }
      var techs = techsOrdered(sysv);
      if (!isFinite(cnt) || cnt !== techs.length || lvs.length !== cnt) { skip.push(sid + '（节点数已变）'); continue; }
      var m = {};
      for (var j = 0; j < cnt; j++) {
        var v = LV_CHARS.indexOf(lvs.charAt(j));
        if (v > 0) { m[techs[j].id] = Math.min(v, techs[j].mx); total++; }
      }
      if (Object.keys(m).length) put[sysn] = m;
    }
    if (key !== shipKey) pickShip(key);
    levels[shipKey] = put;
    if (regs) saveHex();
    selTech = null;
    save(); renderAll();
    var w = DATA[key] || {};
    planMsg('已导入「' + ((w.name || key) + (w.model ? '·' + w.model : '')) + '」' +
            total + ' 个强化项' + (regs ? '、' + regs + ' 条调教登记' : '') +
            (badReg ? '，' + badReg + ' 条登记无法识别' : '') +
            (skip.length ? '，跳过 ' + skip.length + ' 个系统：' + skip.join('、') : ''));
  }
  function planMsg(t) {
    var e = $('planMsg');
    e.textContent = t;
    tip(t);
  }
  function openPlan(importing) {
    var mask = $('planMask'), ta = $('planCode');
    if (importing) {
      ta.value = '';
      $('planTitle').textContent = '导入方案码';
      $('planHint').textContent = '把别人给的码粘贴到下面，点「导入并应用」。码里带舰船名，会自动切到那艘船。';
    } else {
      var code = makePlanCode();
      if (!code) { tip('当前舰船还没有加点'); return; }
      ta.value = code;
      $('planTitle').textContent = '导出方案码';
      $('planHint').textContent = '复制这段码发给别人，对方粘进「导入方案码」即可看到同样的加点' +
        '（含六边形节点的调教武器技术登记）。共 ' + code.length + ' 字符。';
    }
    mask.hidden = false;
    ta.focus(); ta.select();
  }

  $('planClose').addEventListener('click', function () { $('planMask').hidden = true; });
  $('planMask').addEventListener('click', function (e) { if (e.target === this) this.hidden = true; });
  $('planCopy').addEventListener('click', function () {
    var ta = $('planCode');
    ta.focus(); ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) {}
    if (!ok && navigator.clipboard) navigator.clipboard.writeText(ta.value).then(function () {}, function () {});
    planMsg(ok ? '已复制' : '请手动复制框里的码');
  });
  $('planApply').addEventListener('click', function () { applyPlanCode($('planCode').value); });
  $('btnPlan').addEventListener('click', function () { openPlan(false); });
  $('btnImport').addEventListener('click', function () { openPlan(true); });
  window.addEventListener('resize', function () {
    if (ship && sysName) {
      var s = ship.systems[sysName];
      if (selTech) selTech = techById(s.techs, selTech.id);
      scheduleLines(s.techs);
    }
  });
  window.addEventListener('load', function () {
    if (ship && sysName) scheduleLines(ship.systems[sysName].techs);
  });

  renderShips('');
  var keys = Object.keys(DATA);
  for (var i = 0; i < keys.length; i++) if (OFF[keys[i]]) { pickShip(keys[i]); break; }
  if (!shipKey) { mainCol.innerHTML = '<div class="empty">没有已对齐官方数据的舰船</div>'; }
  console.log('官方强化数据：' + Object.keys(OFF).length + ' 艘舰船');
})();