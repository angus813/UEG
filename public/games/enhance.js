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
  const ICON = 'enhance_icons/';
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
  function icon(f) { return f ? '<img src="' + ICON + esc(f) + '" alt="">' : ''; }

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
    var i = abs - baseOf(t) - 1;
    if (i < 0 || i >= t.ct.length) return 0;
    var c = t.ct[i];
    return (typeof c === 'number' && c > 0) ? c : 0;
  }

  // ---------- 前置 ----------
  function techById(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function prereqOf(list, t) {
    if (!t.pq || !t.pq.length) return null;
    var out = [];
    for (var i = 0; i < t.pq.length; i++) {
      var p = techById(list, t.pq[i][0]);
      if (!p || p.id === t.id) continue;
      var need = t.pq[i][1] || 1;
      out.push({ t: p, need: need, ok: absLv(p) >= need });
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
    return pq.filter(function (x) { return !x.ok; })
      .map(function (x) { return x.t.n + ' 达 ' + x.need + ' 级'; }).join('、');
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

  // ---------- 主体 ----------
  function renderMain() {
    if (!ship || !sysName) { mainCol.innerHTML = '<div class="empty">← 请选择舰船与系统</div>'; return; }
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

    var h = '<div class="sys-head">' +
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

    h += '<div class="tree-wrap"><svg class="tree-svg" id="treeSvg"></svg><div class="tree" id="tree">';
    // 按分层分行；ly=-1 的特殊项（系统调校/自维修/系统损坏等）排在最后一行，按官方样式显示为六边形
    var rows = {};
    for (var j = 0; j < list.length; j++) {
      var ly = list[j].ly;
      var key = ly < 0 ? '-1' : String(ly);
      (rows[key] = rows[key] || []).push(list[j]);
    }
    var rk = Object.keys(rows).sort(function (a, b) {
      if (a === '-1') return 1; if (b === '-1') return -1;
      return parseInt(a, 10) - parseInt(b, 10);
    });
    for (var r = 0; r < rk.length; r++) {
      var arr = rows[rk[r]];
      h += '<div class="trow' + (rk[r] === '-1' ? ' special' : '') + '" data-row="' + rk[r] + '">';
      for (var q = 0; q < arr.length; q++) h += nodeHtml(arr[q], list);
      h += '</div>';
    }
    h += '</div></div>';
    h += detailHtml(list);
    h += '<div class="hint">节点方块＝官方强化项，图标与文字取自官方 <b>cfg_system_effect</b>；' +
      '连线＝官方 <b>cfg_system_enhance_tree</b> 的前置关系（要求前置达到指定等级，未满足则锁定）。' +
      '底部六边形为特殊/巅峰类强化项。点击节点查看详情，详情卡内可加减等级。<br>' +
      '描述中的 <b>[Lv.N]</b>、<b>[周期]</b>、<b>[持续]</b> 是官方模板里由服务器按舰船实际数据下发的数值，' +
      '本站未内置，故以标记显示，不代表最终数值。</div>';

    mainCol.innerHTML = h;
    scheduleLines(list);
    bindMain(list);
  }

  function nodeHtml(t, list) {
    var l = lvOf(sysName, t.id);
    var maxed = t.mx <= 0 || l >= t.mx;
    var pq = prereqOf(list, t);
    var blocked = !!(pq && pq.some(function (x) { return !x.ok; }));
    var cls = 'node';
    // 特殊项（系统调校 / 自维修 / 系统损坏 等）按官方样式显示为六边形斜纹块
    if (t.ly < 0) cls += ' hex';
    if (t.mx > 0) cls += ' addable';
    if (maxed && t.mx > 0) cls += ' maxed';
    if (blocked) cls += ' locked';
    if (selTech && selTech.id === t.id) cls += ' sel';

    var cost = (t.mx > 0 && !maxed) ? costOf(t, baseOf(t) + l + 1) : 0;
    var lvTxt = '';
    if (t.mx > 0) lvTxt = '<span class="lv">' + (baseOf(t) + l) + '/' + absMax(t) + '</span>';
    var flag = '';
    if (t.c === 1) flag = '<span class="flag">互</span>';
    else if (t.c === 2) flag = '<span class="flag">模</span>';
    else if (t.ut) flag = '<span class="flag">稀</span>';

    return '<div class="' + cls + '" data-id="' + t.id + '" data-sys="' + esc(sysName) + '">' +
      '<div class="box">' + flag + icon(t.ic) +
      '<span class="lb">' + esc(t.lb || t.n) + '</span>' + lvTxt +
      (cost ? '<span class="cost">' + cost + '</span>' : '') + '</div>' +
      (t.ly < 0 ? '' : '') +
      '</div>';
  }

  function detailHtml(list) {
    var t = selTech && techById(list, selTech.id);
    if (!t) return '<div class="detail"><div class="d">点击上方任一强化节点查看详情、加减等级。</div></div>';
    var l = lvOf(sysName, t.id);
    var pq = prereqOf(list, t);
    var blocked = !!(pq && pq.some(function (x) { return !x.ok; }));
    var maxed = t.mx <= 0 || l >= t.mx;
    var h = '<div class="detail" data-d="' + t.id + '">';
    h += '<div class="h">' + esc(t.n) +
      (t.lb ? '<em>' + esc(t.lb) + '</em>' : '') +
      (t.c === 1 ? '<em>调整</em>' : '') + (t.c === 2 ? '<em>模组</em>' : '') +
      (baseOf(t) ? '<em>默认 ' + baseOf(t) + ' 级</em>' : '') +
      (t.ut ? '<em>稀有度解锁</em>' : '') +
      '<span style="margin-left:auto;font-size:.68rem;color:#9aa0a2">节点 ' + esc(t.id) + '</span></div>';
    if (t.ds) h += '<div class="d">' + esc(t.ds).replace(/\[([^\]]+)\]/g, '<span class="mk">[$1]</span>') + '</div>';
    if (t.d) h += '<details class="dt"><summary>详细说明</summary>' + esc(t.d) + '</details>';
    if (pq && unmetTxt(pq)) h += '<div class="pq">需先满足：' + esc(unmetTxt(pq)) + '</div>';
    h += '<div class="ops">';
    h += '<button class="tbtn" data-act="minus"' + (l <= 0 ? ' disabled' : '') + '>− 降 1 级</button>';
    h += '<button class="tbtn" data-act="plus"' +
      ((t.mx <= 0 || maxed || blocked) ? ' disabled' : '') + '>＋ 升 1 级</button>';
    h += '<span class="t">当前 ' + absLv(t) + ' / ' + absMax(t) + ' 级' +
      (maxed || t.mx <= 0 ? '' : ' · 下一级消耗 ' + costOf(t, baseOf(t) + l + 1) + ' 点') + '</span>';
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
    for (var i = 0; i < nodes.length; i++) {
      var r = nodes[i].getBoundingClientRect();
      pos[nodes[i].getAttribute('data-id')] = {
        x: r.left - wr.left + r.width / 2,
        y: r.top - wr.top + r.height / 2,
        l: r.left - wr.left, t: r.top - wr.top,
        r: r.right - wr.left,
        w: r.width, h: r.height
      };
    }
    var parts = [];
    // 主干：左侧竖线贯通首尾，每行首节点短横线接入。
    // 行内不画横线 —— 同一行的节点是「同一前置层」的并列项，彼此没有先后关系，
    // 画横线会暗示错误的解锁顺序（游戏里行内横线表示的是链式先后）。
    var rows = [];
    var byRow = {};
    for (var i2 = 0; i2 < list.length; i2++) {
      if (!pos[list[i2].id]) continue;
      var ly = list[i2].ly;
      (byRow[ly] = byRow[ly] || []).push({ t: list[i2], p: pos[list[i2].id] });
    }
    for (var rk in byRow) rows.push({ ly: rk, items: byRow[rk] });
    rows.sort(function (a, b) { return a.ly - b.ly; });

    if (rows.length) {
      var mainX = Math.min.apply(null, rows.map(function (r) { return r.items[0].p.l; })) - 26;
      var allY = [];
      rows.forEach(function (r) { r.items.forEach(function (x) { allY.push(x.p.y); }); });
      var yTop = Math.min.apply(null, allY), yBot = Math.max.apply(null, allY);
      parts.push('<line x1="' + mainX + '" y1="' + yTop + '" x2="' + mainX + '" y2="' + yBot +
        '" stroke="rgba(255,255,255,.45)" stroke-width="1.2"/>');
      rows.forEach(function (r) {
        var head = r.items[0].p;
        parts.push('<line x1="' + mainX + '" y1="' + head.y + '" x2="' + head.l +
          '" y2="' + head.y + '" stroke="rgba(255,255,255,.45)" stroke-width="1.2"/>');
        parts.push('<circle cx="' + head.l + '" cy="' + head.y +
          '" r="2.6" fill="rgba(255,255,255,.78)"/>');
      });
    }
    // 前置关系：父节点 -> 子节点，一父一条，绝不多连
    var seenPair = {};
    for (var j = 0; j < list.length; j++) {
      var t = list[j];
      if (!t.pq) continue;
      var a = pos[t.id];
      if (!a) continue;
      for (var m = 0; m < t.pq.length; m++) {
        var b = pos[t.pq[m][0]];
        if (!b) continue;
        var key = t.pq[m][0] + '>' + t.id;
        if (seenPair[key]) continue;
        seenPair[key] = 1;
        parts.push('<line x1="' + (b.l + b.w / 2) + '" y1="' + b.y + '" x2="' +
          (a.l + a.w / 2) + '" y2="' + a.y +
          '" stroke="rgba(255,255,255,.40)" stroke-width="1.1"/>');
      }
    }
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
    var ops = mainCol.querySelectorAll('.detail .ops .tbtn');
    for (var j = 0; j < ops.length; j++) {
      ops[j].addEventListener('click', function () {
        if (!selTech) return;
        if (this.getAttribute('data-act') === 'plus') doPlus(list, selTech);
        else doMinus(list, selTech);
      });
    }
  }

  function doPlus(list, t) {
    if (t.mx <= 0) { tip('该项不可加点'); return; }
    var l = lvOf(sysName, t.id);
    if (l >= t.mx) return;
    var pq = prereqOf(list, t);
    if (pq && unmetTxt(pq)) { tip('需先满足：' + unmetTxt(pq)); return; }
    var c = costOf(t, baseOf(t) + l + 1);
    if (c > 0 && points < c) { tip('技术值(强化点)不足，还差 ' + (c - points)); return; }
    points -= c;
    setLv(sysName, t.id, l + 1);
    save(); renderAll();
  }
  function doMinus(list, t) {
    var l = lvOf(sysName, t.id);
    if (l <= 0) return;
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
  $('btnPlan').addEventListener('click', function () {
    var mine = levels[shipKey];
    if (!mine || !Object.keys(mine).length) { tip('还没有加点'); return; }
    var blob = JSON.stringify({ v: 1, ship: shipKey, levels: mine }, null, 2);
    try { localStorage.setItem('ueg_tree_plan', blob); tip('方案已存到 ueg_tree_plan'); console.log(blob); }
    catch (e) { tip('保存失败'); }
  });
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