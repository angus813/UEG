// ============================================================
//  enhance.js —— 舰船强化系统（参照网易官方强化界面重设计）
//  数据：ships_data.js（window.SHIPS_DATA，全中文 + 结构化实际效果）
//  机制：
//   · 全局技术点（所有舰船共用，localStorage 持久化）
//   · 每个科技项可加点 / 降级，每级消耗点数（progress 数组逐级定义）
//   · 等级状态按 舰船 → 系统 → 科技 保存
//   · 每个科技项展示：效果描述、详细说明、实际游戏效果标签
//     （伤害加成 / 冷却缩减 / 命中率提升 等，按等级线性估算当前值）
// ============================================================
(function () {
  const DATA = window.SHIPS_DATA || {};
  const TYPE_ORDER = ['战列巡洋舰', '航空母舰', '巡洋舰', '驱逐舰', '护卫舰', '护航艇', '战机', '支援舰'];
  const ICONS = { '航空母舰': '✈️', '战列巡洋舰': '⚓', '巡洋舰': '🛳️', '驱逐舰': '🚢', '护卫舰': '⛵', '护航艇': '🚁', '战机': '🛩️', '支援舰': '🚑' };
  const LS_POINTS = 'ueg_enhance_points';
  const LS_STATE = 'ueg_enhance_state';

  // ---------- 状态 ----------
  let points = parseInt(localStorage.getItem(LS_POINTS)) || 300;
  let state = {};
  try { state = JSON.parse(localStorage.getItem(LS_STATE)) || {}; } catch (e) { state = {}; }
  let currentKey = null;
  let collapsedSys = {}; // 折叠的系统

  function saveState() { localStorage.setItem(LS_STATE, JSON.stringify(state)); }
  function savePoints() { localStorage.setItem(LS_POINTS, String(points)); }
  function getLevel(shipKey, sys, tech) { return state[shipKey]?.[sys]?.[tech] || 0; }
  function setLevel(shipKey, sys, tech, lv) {
    state[shipKey] = state[shipKey] || {};
    state[shipKey][sys] = state[shipKey][sys] || {};
    if (lv <= 0) delete state[shipKey][sys][tech];
    else state[shipKey][sys][tech] = lv;
    saveState();
  }
  // 升到第 level 级所需的点数（1-based；progress 数组逐级定义）
  function costOf(tech, level) {
    const p = tech.progress && tech.progress[level - 1];
    return (typeof p === 'number' && p > 0) ? p : (tech.points || 5);
  }
  // 线性估算某等级的实际效果值（value 为满级值）
  function effValue(effect, level, max) {
    if (typeof effect.value !== 'number' || !max) return effect.value;
    const v = effect.value * level / max;
    return Math.round(v * 10) / 10;
  }

  // ---------- DOM ----------
  const listEl = document.getElementById('shipList');
  const panelEl = document.getElementById('panel');
  const pointsEl = document.getElementById('pointsNum');

  function renderPoints() { pointsEl.textContent = points; }

  // ---------- 舰船列表（按类型分组） ----------
  function renderShipList() {
    const grouped = {};
    for (const key of Object.keys(DATA)) {
      const t = DATA[key].type || '未知';
      if (!grouped[t]) grouped[t] = [];
      grouped[t].push(key);
    }
    let html = '';
    for (const type of TYPE_ORDER) {
      const keys = grouped[type] || [];
      if (!keys.length) continue;
      html += `<div class="type-group">
        <div class="type-header">${ICONS[type] || '🚀'} ${type}<span class="cnt">${keys.length}</span></div>`;
      keys.forEach(key => {
        const s = DATA[key];
        const active = key === currentKey ? 'active' : '';
        const disp = s.model ? `${s.name}·${s.model}` : s.name;
        html += `<div class="ship-item ${active}" data-key="${escapeHtml(key)}">
          <span class="ico">${ICONS[s.type] || '🚀'}</span>
          <div><div class="nm">${s.name}</div>${s.model ? `<div class="model">${s.model}</div>` : ''}</div>
          <span class="co">${s.company || ''}</span>
        </div>`;
      });
      html += '</div>';
    }
    listEl.innerHTML = html || '<div class="empty">暂无舰船数据</div>';
    listEl.querySelectorAll('.ship-item').forEach(el => {
      el.addEventListener('click', () => {
        currentKey = el.dataset.key;
        renderShipList();
        renderPanel();
      });
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ---------- 强化面板 ----------
  function renderPanel() {
    const ship = DATA[currentKey];
    if (!ship) { panelEl.innerHTML = '<div class="empty">← 请选择一艘舰船开始强化</div>'; return; }

    let html = '';
    html += `<div class="ship-head">
      <span class="big-ico">${ICONS[ship.type] || '🚀'}</span>
      <div>
        <span class="nm">${ship.name}</span>
        ${ship.model ? `<span class="model">${ship.model}</span>` : ''}
        <div class="meta">${ship.type}${ship.company ? ' · ' + ship.company : ''}</div>
      </div>
      <span class="tag">${ship.systems.length} 个系统</span>
    </div>`;

    if (!ship.systems.length) {
      html += '<div class="empty">该舰船暂无科技数据</div>';
    } else {
      ship.systems.forEach((sys, si) => {
        const sysKey = ship.name + '|' + ship.model + '|' + sys.name;
        const open = collapsedSys[sysKey] !== true;
        const techCount = sys.techs.length;
        html += `<div class="sys-block">
          <div class="sys-header ${open ? 'open' : ''}" data-sys="${si}">
            <span class="arrow">▶</span>
            <span class="nm">${sys.name}</span>
            <span class="wn">${sys.weapons.length ? '🔫 ' + sys.weapons.length + ' 武器' : ''} · ${techCount} 项科技</span>
          </div>`;
        if (open) {
          html += `<div class="sys-body">`;
          sys.techs.forEach((tech, ti) => {
            html += renderTechItem(ship, sys, tech, ti);
          });
          if (sys.weapons.length) {
            html += `<div class="weapon-tags">`;
            sys.weapons.forEach(w => { html += `<span class="wp-tag">🔫 ${w.name}</span>`; });
            html += `</div>`;
          }
          html += `</div>`;
        }
        html += `</div>`;
      });
    }

    html += `<div class="panel-foot">数据来源：data/ 舰船功能·系统·效果表格（build-ships.js 自动生成，全中文）</div>`;
    panelEl.innerHTML = html;

    // 系统折叠
    panelEl.querySelectorAll('.sys-header').forEach(h => {
      h.addEventListener('click', () => {
        const sys = ship.systems[parseInt(h.dataset.sys)];
        const sysKey = ship.name + '|' + ship.model + '|' + sys.name;
        collapsedSys[sysKey] = collapsedSys[sysKey] !== true ? true : false;
        renderPanel();
      });
    });

    // 加点 / 降级（事件委托到面板）
    panelEl.querySelectorAll('.op-btn.plus').forEach(b => {
      b.addEventListener('click', () => {
        const ti = parseInt(b.dataset.ti), si = parseInt(b.dataset.si);
        const tech = ship.systems[si].techs[ti];
        const cur = getLevel(currentKey, ship.systems[si].name, tech.name);
        if (cur >= tech.max) return;
        const cost = costOf(tech, cur + 1);
        if (points < cost) { flashPoints('技术点不足！'); return; }
        points -= cost;
        setLevel(currentKey, ship.systems[si].name, tech.name, cur + 1);
        renderPoints(); renderPanel();
      });
    });
    panelEl.querySelectorAll('.op-btn.minus').forEach(b => {
      b.addEventListener('click', () => {
        const ti = parseInt(b.dataset.ti), si = parseInt(b.dataset.si);
        const tech = ship.systems[si].techs[ti];
        const cur = getLevel(currentKey, ship.systems[si].name, tech.name);
        if (cur <= 0) return;
        points += costOf(tech, cur); // 返还当前等级消耗
        setLevel(currentKey, ship.systems[si].name, tech.name, cur - 1);
        renderPoints(); renderPanel();
      });
    });
  }

  // 单个科技项卡片
  function renderTechItem(ship, sys, tech, ti) {
    const si = ship.systems.indexOf(sys);
    const lv = getLevel(currentKey, sys.name, tech.name);
    const maxed = lv >= tech.max;
    let dots = '';
    for (let i = 0; i < tech.max; i++) {
      dots += `<span class="lv-dot ${i < lv ? (maxed ? 'maxed' : 'on') : ''}"></span>`;
    }
    // 实际效果标签（按当前等级线性估算）
    let fxHtml = '';
    if (tech.effects && tech.effects.length) {
      fxHtml = `<div class="fx-tags">`;
      tech.effects.forEach(e => {
        const v = effValue(e, Math.max(lv, 1), tech.max);
        const valStr = typeof v === 'number' ? (v % 1 === 0 ? v : v.toFixed(1)) : v;
        let tag = `<span class="fx-tag">${e.type}`;
        if (e.action) tag += ` <b>${e.action} ${valStr}</b>`;
        if (e.weapon) tag += `<span class="w">${e.weapon}</span>`;
        tag += `</span>`;
        fxHtml += tag;
      });
      fxHtml += `</div>`;
    }
    return `<div class="tech-item">
      <div class="tech-head">
        <span class="tech-name">${tech.name}</span>
        <span class="tech-max">最高 ${tech.max} 级 · ${tech.points || 5} 点/级</span>
        <span class="tech-ops">
          <button class="op-btn minus" data-si="${si}" data-ti="${ti}" ${lv <= 0 ? 'disabled' : ''}>−</button>
          <span class="lv-text">Lv.${lv}/${tech.max}</span>
          <button class="op-btn plus" data-si="${si}" data-ti="${ti}" ${maxed ? 'disabled' : ''}>＋</button>
        </span>
      </div>
      <div class="lv-dots">${dots}</div>
      ${tech.desc ? `<div class="tech-desc">${tech.desc}</div>` : ''}
      ${fxHtml}
      ${tech.detail ? `<details class="tech-detail"><summary>详细说明</summary>${tech.detail}</details>` : ''}
    </div>`;
  }

  function flashPoints(msg) {
    const el = pointsEl;
    const old = el.textContent;
    el.textContent = '⚠ ' + msg;
    setTimeout(() => { el.textContent = old; }, 1200);
  }

  // ---------- 技术点 ----------
  document.getElementById('btnAddPoints').addEventListener('click', () => {
    points += 100;
    savePoints();
    renderPoints();
  });

  // ---------- 初始化 ----------
  renderPoints();
  renderShipList();
  if (!currentKey && Object.keys(DATA).length) {
    currentKey = Object.keys(DATA)[0];
    renderShipList();
    renderPanel();
  } else {
    renderPanel();
  }
  console.log('✅ 舰船强化系统已加载：' + Object.keys(DATA).length + ' 艘舰船');
})();
