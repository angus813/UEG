









(function () {
  const DATA = window.SHIPS_DATA || {};
  const TYPE_ORDER = ['战列巡洋舰', '航空母舰', '巡洋舰', '驱逐舰', '护卫舰', '护航艇', '战机', '支援舰'];
  const ICONS = {
  '航空母舰': 'photo/微信图片_20260731000935_177_7.jpg',
  '支援舰': 'photo/微信图片_20260731113333_179_7.jpg',
  '战列巡洋舰': 'photo/微信图片_20260731113857_181_7.jpg',
  '巡洋舰': 'photo/微信图片_20260731113858_182_7.jpg',
  '驱逐舰': 'photo/微信图片_20260731114137_183_7.jpg',
  '护卫舰': 'photo/微信图片_20260731114208_184_7.jpg',
  '护航艇': 'photo/微信图片_20260731114434_185_7.jpg',
  '战机': 'photo/微信图片_20260731114451_186_7.jpg'
};
  const LS_POINTS = 'ueg_enhance_points';
  const LS_STATE = 'ueg_enhance_state';
  
  let weaponChoice = {};
  try { weaponChoice = JSON.parse(localStorage.getItem('ueg_weapon_choice') || '{}'); } catch (e) { weaponChoice = {}; }
  function saveWeaponChoice() { localStorage.setItem('ueg_weapon_choice', JSON.stringify(weaponChoice)); }
  function getWeaponChoice(shipKey, sysName, option, list) {
    const saved = (weaponChoice[shipKey] || {})[sysName] && weaponChoice[shipKey][sysName][option];
    if (saved && list.some(w => w.name === saved)) return saved;
    return (list[0] || {}).name;
  }
  function setWeaponChoice(shipKey, sysName, option, weaponName) {
    weaponChoice[shipKey] = weaponChoice[shipKey] || {};
    weaponChoice[shipKey][sysName] = weaponChoice[shipKey][sysName] || {};
    weaponChoice[shipKey][sysName][option] = weaponName;
    saveWeaponChoice();
  }
  function getSelectedWeapons() {
    // 按 option 槽位过滤：同一槽位内多武器为互斥选择，只计入 getWeaponChoice 选中的那一把，
    // 避免武器合计把互斥槽位的所有武器全部计入导致数值虚高
    const sysMap = (window.SYSTEM_STATS || {})[currentKey];
    const out = [];
    if (!sysMap) return out;
    Object.keys(sysMap).forEach(sysName => {
      const sys = sysMap[sysName] || {};
      const slots = {};
      (sys.weapons || []).forEach(w => {
        const o = w.option || w.name;
        (slots[o] = slots[o] || []).push(w);
      });
      Object.keys(slots).forEach(option => {
        const list = slots[option];
        const chosen = getWeaponChoice(currentKey, sysName, option, list);
        const picked = list.filter(w => w.name === chosen)[0] || list[0];
        if (picked) out.push(picked);
      });
    });
    return out;
  }
  function flashTip(msg) {
    const t = document.getElementById('flashTip');
    if (t) { t.textContent = msg; t.style.opacity = '1'; setTimeout(() => { t.style.opacity = '0'; }, 2600); }
    else console.log('[提示]', msg);
  }
    
  let pyEngine = null, pyMode = false, pyInitPromise = null;
  function loadScriptAsync(src, timeoutMs) {
    return new Promise(function (resolve) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = function () { resolve(true); };
      s.onerror = function () { resolve(false); };
      setTimeout(function () { resolve(false); }, timeoutMs || 6000);
      document.head.appendChild(s);
    });
  }
  async function initPyEngine() {
    if (pyInitPromise) return pyInitPromise;
    pyInitPromise = (async function () {
      try {
        var cdn = ['pyodide/pyodide.js', 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js', 'https://unpkg.com/pyodide@0.26.4/full/pyodide.js'];
        var loaded = false, loadedSrc = '';
        for (var i = 0; i < cdn.length; i++) { loaded = await loadScriptAsync(cdn[i], 6000); if (loaded) { loadedSrc = cdn[i]; break; } }
        if (!loaded || typeof loadPyodide !== 'function') throw new Error('Pyodide CDN 不可用');
        pyEngine = await loadPyodide(loadedSrc === 'pyodide/pyodide.js' ? { indexURL: 'pyodide/' } : undefined);
        var resp = await fetch('py/enhance_calc.py');
        if (!resp.ok) throw new Error('py 模块加载失败');
        await pyEngine.runPythonAsync(await resp.text());
        pyMode = true;
        console.log('🐍 Python 数据处理引擎已启动');
      } catch (e) {
        pyEngine = null; pyMode = false;
        console.warn('⚠️ Python 引擎不可用，使用 JS 计算引擎：' + e.message);
      }
      return pyMode;
    })();
    return pyInitPromise;
  }
  function py(fnName) {
    if (!pyMode || !pyEngine) return null;
    var args = Array.prototype.slice.call(arguments, 1);
    try {
      var r = pyEngine.globals.get(fnName).apply(null, args);
      if (r && typeof r.toJs === 'function') return r.toJs({ create_proxies: false, dict_converter: Object.fromEntries });
      return r;
    } catch (e) { console.warn('⚠️ Python 计算失败，降级 JS：' + fnName + ' ' + e.message); return null; }
  }
    
  function shipClass(type) {
    const t = type || '';
    if (['航空母舰', '支援舰', '战列巡洋舰'].includes(t)) return '超主力舰';
    if (['巡洋舰', '驱逐舰', '护卫舰'].includes(t)) return '主力舰';
    if (['护航艇', '战机'].includes(t)) return '舰载机';
    if (['战列舰'].includes(t)) return '超主力舰';
    return '其他';
  }
  function shipScale(type) {
    const t = type || '';
    if (['航空母舰', '支援舰', '战列巡洋舰', '巡洋舰'].includes(t)) return '大型舰船';
    if (['驱逐舰', '护卫舰'].includes(t)) return '小型舰船';
    return '';
  }
  
  const BP_PROGRESS = { '护卫舰': 35, '护航艇': 35, '战机': 35, '驱逐舰': 25, '巡洋舰': 20 };
  const BP_TIMES = { '护卫舰': 3, '护航艇': 3, '战机': 3, '驱逐舰': 4, '巡洋舰': 5 };
  let bpState = {};
  try { bpState = JSON.parse(localStorage.getItem('ueg_bp_state') || '{}'); } catch (e) { bpState = {}; }
  function saveBp() { localStorage.setItem('ueg_bp_state', JSON.stringify(bpState)); }
  function getVariants(ship) {
    return Object.keys(DATA).filter(k => DATA[k].name === ship.name)
      .map((k, i) => ({ key: k, model: DATA[k].model, letter: i === 0 ? 'A' : String.fromCharCode(66 + i - 1), main: i === 0 }));
  }
  function bpStatus(v) {
    const s = bpState[v.key] || { obtained: false, progress: 0 };
    if (v.main) return s.obtained ? { text: '✅ 已获得（主型号）', cls: 'ok' } : { text: '🔒 未获得（开箱首次必出）', cls: 'lock' };
    if (s.progress >= 100) return { text: '✅ 已研究完成', cls: 'ok' };
    if (s.progress >= 25) return { text: '🔧 研究 ' + s.progress + '% · 1艘试用', cls: 'ing' };
    if (s.progress > 0) return { text: '🔧 研究 ' + s.progress + '% · 0艘（只能看）', cls: 'ing' };
    return { text: '🔒 未获得', cls: 'lock' };
  }
  function renderBlueprint(ship) {
    const vs = getVariants(ship);
    if (!vs.length) return '';
    const cls = shipClass(ship.type);
    if (cls === '超主力舰') return renderModules(ship);
    const add = BP_PROGRESS[ship.type] || 20;
    const times = BP_TIMES[ship.type] || 5;
    let h = '<div class="bp-sec"><div class="sec-title">🔵 蓝图 · ' + cls + '（' + ship.type + '）</div>';
    h += '<div class="bp-tip">主型号 + ' + (vs.length - 1) + '个子型号 · 重复开箱给研究进度（' + add + '%-100%，' + times + '次必得）</div>';
    vs.forEach(v => {
      const st = bpStatus(v);
      const letter = v.letter;
      const special = (v.model || '').includes('离子炮') || (v.model || '').includes('英雄');
      h += '<div class="bp-variant ' + st.cls + '">';
      h += '<span class="bp-letter">' + letter + '.' + (v.main ? '主型号' : '子型号') + '</span>';
      h += '<span class="bp-model">' + (v.model || '') + (special ? ' <em>特殊子型号</em>' : '') + '</span>';
      h += '<span class="bp-status">' + st.text + '</span>';
      h += '</div>';
    });
    h += '<div class="bp-actions"><button class="bp-box" onclick="window._openBox()">📦 开箱</button>';
    h += '<button class="bp-box bp-clear" onclick="window._clearBp()">重置</button></div>';
    h += '<div class="bp-tip">▷ 重复获得蓝图时，若选择研究子型号，给的研究进度如下：护卫/护航艇/战机 35%-100%（3次必得）· 驱逐 25%-100%（4次必得）· 巡洋 20%-100%（5次必得）</div>';
    h += '<div class="bp-tip">▷ 研究进度未达100%时存在服役上限：0%-25% 0艘（只能看）· 25%-99% 1艘（试用款）</div>';
    h += '<div class="bp-tip">▷ 特殊子型号：A.限时研究协议（500比邻星币→指定型号1%-10%进度）· B.对接（如AC721-C离子炮←离子科技研究中心）· C.副本/市场（如AC720艾格勒姆未名者·英雄舰）</div>';
    h += '</div>';
    return h;
  }
  
  let moduleState = {};
  try { moduleState = JSON.parse(localStorage.getItem('ueg_module_state') || '{}'); } catch (e) { moduleState = {}; }
  window._pickModule = function (cls, opt) {
    moduleState[cls] = opt;
    localStorage.setItem('ueg_module_state', JSON.stringify(moduleState));
    renderPanel();
  };
  function renderModules(ship) {
    const sysMap = (window.SYSTEM_STATS || {})[currentKey];
    if (!sysMap) return '<div class="bp-sec"><div class="sec-title">🔧 模块系统</div><div class="bp-tip">暂无模块数据</div></div>';
    let groups = py('module_groups', sysMap, moduleState);
    if (!groups) {
      groups = [];
      const gmap = {};
      Object.entries(sysMap).forEach(([sysName, sys]) => {
        (sys.weapons || []).forEach(w => {
          const opt = w.option || w.name;
          const g = (opt.match(/^([MABCDE])/) || [null, '?'])[1];
          (gmap[g] = gmap[g] || []).push({ opt: opt, sys: sysName, weapon: w });
        });
      });
      Object.keys(gmap).sort().forEach(g => {
        const lst = gmap[g];
        const chosen = moduleState[g] || lst[0].opt;
        groups.push({ cls: g, chosen: chosen, options: lst.map(x => ({ opt: x.opt, sys: x.sys, selected: x.opt === chosen })) });
      });
    }
    let h = '<div class="bp-sec"><div class="sec-title">🔧 模块系统（蓝图+模块 · 同分类只能安装1个）</div>';
    h += '<div class="bp-tip">超主力舰蓝图由蓝图+模块组成，无子型号。模块分 M/A/B/C（D/E）类，同分类只能安装1个，首次获得自带2-4个初始模块，其余需抽取（新增系统需10技术值）</div>';
    groups.forEach(g => {
      h += '<div class="mod-group"><span class="mod-class">' + g.cls + '类</span>';
      g.options.forEach(m => {
        h += '<span class="mod-chip ' + (m.selected ? 'on' : '') + '" onclick="window._pickModule(\'' + g.cls + '\',\'' + String(m.opt).replace(/'/g, '') + '\')">' + m.opt + ' ' + m.sys + (m.selected ? ' ✅' : '') + '</span>';
      });
      h += '</div>';
    });
    h += '<div class="bp-tip">▷ 点击模块切换安装（同分类只能安装1个，默认安装初始模块）</div>';
    h += '</div>';
    return h;
  }
  window._openBox = function () {
    if (!currentKey) return;
    const ship = DATA[currentKey];
    const vs = getVariants(ship);
    if (!vs.length) return;
    if (shipClass(ship.type) === '超主力舰') { flashTip('🔧 超主力舰无子型号：模块通过抽取获得（见模块系统）'); return; }
    const add = BP_PROGRESS[ship.type] || 20;
    const mainV = vs[0];
    const st = bpState[mainV.key] || { obtained: false, progress: 0 };
    if (!st.obtained) {
      st.obtained = true;
      bpState[mainV.key] = st;
      saveBp();
      flashTip('📦 首次开箱必得主型号：A.' + (mainV.model || ''));
    } else {
      const subs = vs.slice(1).filter(v => (bpState[v.key] || { progress: 0 }).progress < 100);
      if (subs.length) {
        const pick = subs[Math.floor(Math.random() * subs.length)];
        const s = bpState[pick.key] || { obtained: true, progress: 0 };
        s.progress = Math.min(100, s.progress + add);
        bpState[pick.key] = s;
        saveBp();
        flashTip('📦 重复蓝图 → 子型号研究进度 +' + add + '%（' + pick.letter + '.' + pick.model + '）');
      } else flashTip('📦 所有子型号已研究完毕');
    }
    renderPanel();
  };
  window._clearBp = function () {
    bpState = {};
    saveBp();
    flashTip('🗑️ 蓝图研究已重置');
    renderPanel();
  };
    function computeFirepowerDpm() {
    const r = py('firepower_dpm', getSelectedWeapons());
    if (r) return { antiShip: r.antiShip || 0, antiAir: r.antiAir || 0, siege: r.siege || 0 };
        const f = { antiShip: 0, antiAir: 0, siege: 0 };
    getSelectedWeapons().forEach(w => {
      if (w.dpmShip) f.antiShip += w.dpmShip;
      if (w.dpmAA) f.antiAir += w.dpmAA;
      if (w.dpmSiege) f.siege += w.dpmSiege;
    });
    return f;
  }
    function computeWeaponTotals() {
    const list = getSelectedWeapons();
    const r = py('weapon_totals', list);
    if (r) return { damage: r.damage || 0, cycle: r.cycle || 0, lockOn: r.lockOn || 0, rounds: r.rounds || 0, cooldown: r.cooldown || 0, duration: r.duration || 0, weapons: r.weapons || 0 };
        const t = { damage: 0, cycle: 0, lockOn: 0, rounds: 0, cooldown: 0, duration: 0, weapons: 0 };
    getSelectedWeapons().forEach(w => {
      if (w.damage !== undefined) t.damage += w.damage;
      if (w.cycle !== undefined) t.cycle += w.cycle;
      if (w.lockOn !== undefined) t.lockOn += w.lockOn;
      if (w.rounds !== undefined) t.rounds += w.rounds;
      if (w.cooldown !== undefined) t.cooldown += w.cooldown;
      if (w.duration !== undefined) t.duration += w.duration;
      t.weapons++;
    });
    return t;
  }


  
  var storedPoints = localStorage.getItem(LS_POINTS);
  // parseInt("0") 为 0（falsy），不能用 || 兜底，否则技术点为 0 时刷新被重置为 300
  let points = storedPoints === null ? 300 : (parseInt(storedPoints, 10) || 0);
  let state = {};
  try { state = JSON.parse(localStorage.getItem(LS_STATE)) || {}; } catch (e) { state = {}; }
  let currentKey = null;
  let collapsedSys = {}; 

  function saveState() { localStorage.setItem(LS_STATE, JSON.stringify(state)); }
  function savePoints() { localStorage.setItem(LS_POINTS, String(points)); }
  function getLevel(shipKey, sys, tech) {
    // 避免存储的字符串值（如 "0"）污染等级：强制 parseInt 归一为数字
    var v = state[shipKey] && state[shipKey][sys] ? state[shipKey][sys][tech] : undefined;
    var n = parseInt(v, 10);
    return isNaN(n) ? 0 : n;
  }
  function setLevel(shipKey, sys, tech, lv) {
    state[shipKey] = state[shipKey] || {};
    state[shipKey][sys] = state[shipKey][sys] || {};
    if (lv <= 0) delete state[shipKey][sys][tech];
    else state[shipKey][sys][tech] = lv;
    saveState();
  }
  
  function costOf(tech, level) {
    const p = tech.progress && tech.progress[level - 1];
    return (typeof p === 'number' && p > 0) ? p : (tech.points || 5);
  }

  // 升到 lv 级的总投入 = 每级 costOf 逐级累加（progress 数组可能每级价格不同）
  function investedFor(tech, lv) {
    var sum = 0;
    for (var l = 1; l <= lv; l++) sum += costOf(tech, l);
    return sum;
  }
  
  function effValue(effect, level, max) {
    if (typeof effect.value !== 'number' || !max) return effect.value;
    const v = effect.value * level / max;
    return Math.round(v * 10) / 10;
  }

  
  const listEl = document.getElementById('shipList');
  const panelEl = document.getElementById('panel');
  const pointsEl = document.getElementById('pointsNum');

  function renderPoints() { pointsEl.textContent = points; }

  
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
        <div class="type-header">${ICONS[type] ? '<img class="type-ico" src="' + ICONS[type] + '" alt="">' : '🚀'} ${type}<span class="cnt">${keys.length}</span></div>`;
      keys.forEach(key => {
        const s = DATA[key];
        const active = key === currentKey ? 'active' : '';
        const disp = s.model ? `${s.name}·${s.model}` : s.name;
        html += `<div class="ship-item ${active}" data-key="${escapeHtml(key)}">
          <span class="ico">${ICONS[s.type] ? '<img src="' + ICONS[s.type] + '" alt="">' : '🚀'}</span>
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

  
  
  
  function computeEnhancement(ship) {
    const levels = {};
    ((ship && ship.systems) || []).forEach(sys => {
      levels[sys.name] = {};
      (sys.techs || []).forEach(t => { const lv = getLevel(currentKey, sys.name, t.name); if (lv > 0) levels[sys.name][t.name] = lv; });
    });
    const pr = py('compute_enhancement', ship.systems, levels);
    if (pr) {
      let invested = 0;
      Object.keys(levels).forEach(sn => Object.keys(levels[sn]).forEach(tn => {
        const s = (ship.systems || []).find(x => x.name === sn);
        const t = s && s.techs.find(x => x.name === tn);
        if (t) invested += investedFor(t, levels[sn][tn]);
      }));
      return { fireMul: pr.fireMul, aaMul: pr.aaMul, siegeMul: pr.siegeMul, cdMul: pr.cdMul === undefined ? 1 : pr.cdMul, hpMul: pr.hpMul, physMul: pr.physMul, energyMul: pr.energyMul, cruiseMul: pr.cruiseMul, warpMul: pr.warpMul, invested: invested, hpAdd: pr.hpAdd || 0, physAdd: pr.physAdd || 0, energyAdd: pr.energyAdd || 0 };
    }
        const acc = { dmg: 0, aa: 0, siege: 0, cd: 0, hit: 0, crit: 0, hp: 0, phys: 0, energy: 0, cruise: 0, warp: 0, atkSpeed: 0, freq: 0, physAdd: 0, energyAdd: 0, hpAdd: 0, invested: 0 };
    ((ship && ship.systems) || []).forEach(sys => (sys.techs || []).forEach(t => {
      const lv = getLevel(currentKey, sys.name, t.name);
      if (lv <= 0) return;
      acc.invested += investedFor(t, lv);
      (t.effects || []).forEach(e => {
        const raw = Number(e.value);
        if (!isFinite(raw) || raw === 0) return;
        const type = e.type || '';
        
        if (/集火|战略打击|子系统暴击|被武器命中|被导弹|被鱼雷|失效|自动维修|拦截|锁定|目标选择|飞行时间|闪避|反击|警戒|战斗|站位|撤退|隐藏|伪装|干扰|探测|识别/.test(type)) return;
        const frac = lv / Math.max(1, t.max);
        if (e.action === '比例加成' || e.action === '比例减少') {
          const per = (e.action === '比例减少' ? -raw : raw) * frac;
          const T = type;
          const absV = Math.abs(per);
          if (/受到|被武器|被命中|被拦截/.test(T)) return;
          let dirV = 1;
          if (/降低|减少/.test(T)) {
            if (/冷却|持续时间|攻击间隔/.test(T)) dirV = 1; else dirV = -1;
          }
          if (/攻城/.test(T)) acc.siege += absV * dirV;
          else if (/防空/.test(T)) acc.aa += absV * dirV;
          else if (/冷却/.test(T)) acc.cd += absV * dirV;
          else if (/暴击/.test(T)) acc.crit += absV * dirV;
          else if (/持续时间|攻击间隔/.test(T)) acc.atkSpeed += absV * dirV;
          else if (/频率|每轮攻击|额外射击/.test(T)) acc.freq += absV * dirV;
          else if (/命中/.test(T)) acc.hit += absV * dirV;
          else if (/生命|结构值/.test(T)) acc.hp += absV * dirV;
          else if (/装甲|抗性/.test(T)) { if (/能量/.test(T)) acc.energy += absV * dirV; else acc.phys += absV * dirV; }
          else if (/巡航/.test(T)) acc.cruise += absV * dirV;
          else if (/曲速/.test(T)) acc.warp += absV * dirV;
          else if (/伤害/.test(T)) acc.dmg += absV * dirV;
        } else if (/增加|减少/.test(e.action || '')) {
          
          const add = (e.action.indexOf('减') >= 0 ? -raw : raw) * frac;
          if (/装甲|抗性|物理抵抗/.test(type)) {
            if (/能量/.test(type)) acc.energyAdd += add; else acc.physAdd += add;
          } else if (/生命|结构值/.test(type)) acc.hpAdd += add;
          else if (/伤害/.test(type)) acc.dmg += add; // 效果值为百分点（如“伤害+X%”），直接累加，勿再 /100
        }
      });
    }));
    // 暴击/攻速（攻击间隔、持续时间缩减）/频率（每轮攻击、额外射击）强化此前只计算未使用，
    // 现近似计入伤害倍率（线性估算；命中率 hit 与 DPM 无简单折算关系，仅保留计算）
    const critMul = 1 + acc.crit / 100;
    const atkSpdMul = 1 + acc.atkSpeed / 100;
    const freqMul = 1 + acc.freq / 100;
    return {
      fireMul: (1 + acc.dmg / 100) * critMul * atkSpdMul * freqMul,
      aaMul: (1 + (acc.dmg + acc.aa) / 100) * critMul * atkSpdMul * freqMul,
      siegeMul: (1 + (acc.dmg + acc.siege) / 100) * critMul * atkSpdMul * freqMul,
      cdMul: 1 - acc.cd / 100,
      hpMul: 1 + acc.hp / 100, hpAdd: acc.hpAdd,
      physMul: 1 + acc.phys / 100, physAdd: acc.physAdd,
      energyMul: 1 + acc.energy / 100, energyAdd: acc.energyAdd,
      cruiseMul: 1 + acc.cruise / 100,
      warpMul: 1 + acc.warp / 100,
      invested: acc.invested
    };
  }

  
  function fmtStat(base, mul, add, fmtFn) {
    const hasMul = mul && mul > 1.0001;
    const hasAdd = add && Math.abs(add) >= 0.5;
    if (!hasMul && !hasAdd) {
      if (!base) return '<b>—</b>';
      return `<b>${fmtFn(base)}</b>`;
    }
    const boosted = base * (hasMul ? mul : 1) + (hasAdd ? add : 0);
    let gain = '';
    if (hasMul && hasAdd) gain = ` <span class="gain">+${((mul - 1) * 100).toFixed(1)}% +${Math.round(add)}</span>`;
    else if (hasMul) gain = ` <span class="gain">+${((mul - 1) * 100).toFixed(1)}%</span>`;
    else gain = ` <span class="gain">${add >= 0 ? '+' : ''}${Math.round(add)}</span>`; // 负 add 避免渲染成 "+-3"
    if (!base) return `<b class="boost">${fmtFn(boosted)}</b>${gain}`;
    return `<b class="boost">${fmtFn(boosted)}</b>${gain}`;
  }

  
  function resolveStats(ship) {
    const S = window.SHIP_STATS || {};
    const A = window.SHIP_STATS_ALIAS || {};
    const list = S[ship.name] || S[A[ship.name]];
    if (!list || !list.length) return null;
    if (!ship.model) return list[0];
    const m = ship.model.replace(/[型级]$/, '');
    const hit = list.find(s => s.name.includes(m));
    if (hit) return hit;
    const sub = m.slice(0, 2);
    const hit2 = list.find(s => s.name.includes(sub));
    if (hit2) return hit2;
    return list[0];
  }

  function renderStatsPanel(ship) {
    const st = resolveStats(ship);
    const variantCount = Object.keys(DATA).filter(k => DATA[k].name === ship.name).length;
    const enh = computeEnhancement(ship);
    const invested = enh.invested;
    const fmt = n => Math.round(n).toLocaleString('zh-CN');
    const wt = computeWeaponTotals();
    const dpm = computeFirepowerDpm();
    const wtHTML = wt.weapons ? `<div class="stat-sec"><div class="sec-title">⚔️ 武器系统合计（${wt.weapons} 槽 · 全部武器${enh.fireMul > 1.0001 ? ' ·强化+'+Math.round((enh.fireMul-1)*100)+'%' : ''}）</div>
        <div class="stat-grid">
          <span>伤害 <b>${fmt(Math.round(wt.damage * enh.fireMul))}</b></span>
          <span>循环 <b>${wt.cycle}</b></span>
          <span>锁定 <b>${wt.lockOn}</b></span>
          <span>轮数 <b>${wt.rounds}</b></span>
          <span>冷却 <b>${enh.cdMul && enh.cdMul < 1 ? (Math.round(wt.cooldown * enh.cdMul * 10) / 10) + 's <i class="src">-' + Math.round((1 - enh.cdMul) * 100) + '%</i>' : wt.cooldown + 's'}</b></span>
          <span>持续 <b>${wt.duration}s</b></span>
        </div></div>` : '';
    const r = st.ratings || {};
    const fp = st.firepower || {};
    const boostTags = [];
    if (enh.fireMul > 1.0001) boostTags.push(`火力+${((enh.fireMul - 1) * 100).toFixed(1)}%`);
    if (enh.hpMul > 1.0001) boostTags.push(`生命+${((enh.hpMul - 1) * 100).toFixed(1)}%`);
    if (enh.physMul > 1.0001) boostTags.push(`物理装甲+${((enh.physMul - 1) * 100).toFixed(1)}%`);
    if (enh.energyMul > 1.0001) boostTags.push(`能量装甲+${((enh.energyMul - 1) * 100).toFixed(1)}%`);
    if (enh.physAdd >= 0.5) boostTags.push(`物理装甲+${Math.round(enh.physAdd)}`);
    if (enh.energyAdd >= 0.5) boostTags.push(`能量装甲+${Math.round(enh.energyAdd)}`);
    return `<div class="stat-panel">
      <div class="stat-top">
        <span>🛡️ <b>${st.type || ship.type}</b>${st.position ? ' · ' + st.position : ''}</span>
        <span class="cls-badge">${shipClass(ship.type)}</span><span class="scale-badge">${shipScale(ship.type)}</span>
        <span>🚩 指挥值 <b>${st.commandValue}</b></span>
        <span>🧩 变体 <b>${variantCount}</b></span>
        <span>⚡ 已投入科技点 <b>${invested}</b></span>
        <span>🚢 服役上限 <b>${st.serviceLimit}</b></span>
        ${boostTags.length ? `<span class="gain">⚡ ${boostTags.join(' ')}</span>` : ''}
      </div>
      <div class="stat-sec"><div class="sec-title">🔥 火力属性</div>
        <div class="stat-grid">
          <span>反舰 ${dpm.antiShip ? fmtStat(dpm.antiShip, enh.fireMul, 0, fmt) : '—'}<i class="src">DPM</i></span>
          <span>防空 ${dpm.antiAir ? fmtStat(dpm.antiAir, enh.aaMul, 0, fmt) : '—'}<i class="src">DPM</i></span>
          <span>攻城 ${dpm.siege ? fmtStat(dpm.siege, enh.siegeMul, 0, fmt) : '—'}<i class="src">DPM</i></span>
        </div>
      </div>
      <div class="stat-sec"><div class="sec-title">📊 基础属性</div>
        <div class="stat-grid">
          <span>舰船生命 ${fmtStat(st.hp || 0, enh.hpMul, enh.hpAdd, fmt)}</span>
          <span>巡航速度 ${(() => { const cv = st.cruise || '—'; const m = enh.cruiseMul || 1; if (cv !== '—' && /^\d+$/.test(String(cv)) && m > 1.0001) return `<b class="boost">${Math.round(Number(cv) * m)}</b> <span class="gain">+${((m - 1) * 100).toFixed(1)}%</span>`; return `<b>${cv}</b>${m > 1.0001 ? ` <span class="gain">+${((m - 1) * 100).toFixed(1)}%</span>` : ''}`; })()}</span>
          <span>曲速 ${fmtStat(st.warp || 0, enh.warpMul, 0, fmt)}</span>
          <span>物理装甲 ${fmtStat(st.physicalArmor || 0, enh.physMul, enh.physAdd, fmt)}</span>
          <span>能量装甲 ${fmtStat(st.energyArmor || 0, enh.energyMul, enh.energyAdd, fmt)}</span>
          <span>尺寸 <b>${st.size ? fmt(st.size) + 'm' : '—'}</b></span>
        </div>
      </div>
      ${st.build ? `<div class="stat-sec"><div class="sec-title">🏗️ 建造</div>
        <div class="stat-grid">
          <span>金属 <b>${fmt(st.build.metal || 0)}</b></span>
          <span>晶体 <b>${fmt(st.build.crystal || 0)}</b></span>
          <span>重氢 <b>${fmt(st.build.deuterium || 0)}</b></span>
          <span>时间 <b>${(st.build.time || 0).toFixed(2)}天</b></span>
          <span>容量 <b>${fmt(st.build.capacity || 0)}</b></span>
        </div>
      </div>` : ''}
${wtHTML}
${renderBlueprint(ship)}
${st.desc ? `<div class="stat-sec"><div class="sec-title">📖 舰船描述</div><div class="stat-desc">${st.desc}</div></div>` : ''}
      ${st.quote ? `<details class="ship-lore"><summary>📜 舰船语录（原文）</summary><div class="lore-text">${st.quote}</div></details>` : ''}
      ${st.story ? `<details class="ship-lore"><summary>📚 舰船档案（原文）</summary><div class="lore-text">${st.story}</div></details>` : ''}
      <div class="stat-sec"><div class="sec-title">🏆 同级别排名</div>
        <div class="stat-grid">
          <span>反舰 <b>${r.antiShip || '—'}</b></span>
          <span>防空 <b>${r.antiAir || '—'}</b></span>
          <span>攻城 <b>${r.siege || '—'}</b></span>
          <span>支援 <b>${r.support || '—'}</b></span>
          <span>生存 <b>${r.survival || '—'}</b></span>
          <span>战略 <b>${r.strategy || '—'}</b></span>
        </div>
      </div>
      <div class="stat-sec"><div class="sec-title">🧩 系统（${st.modules.length}）</div>
        <div class="mod-tags">${st.modules.map(m => `<span>${m}</span>`).join('')}</div>
      </div>
    </div>`;
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ---------- 强化面板 ----------
  function renderPanel() {
    const ship = DATA[currentKey];
    // 判空提前：computeEnhancement 会访问 ship.systems，未选舰船时先返回避免空白屏崩溃
    if (!ship) { panelEl.innerHTML = '<div class="empty">← 请选择一艘舰船开始强化</div>'; return; }
    const enh = computeEnhancement(ship);

    let html = '';
    html += `<div class="ship-head">
      <span class="big-ico">${ICONS[ship.type] ? '<img src="' + ICONS[ship.type] + '" alt="">' : '🚀'}</span>
      <div>
        <span class="nm">${ship.name}</span>
        ${ship.model ? `<span class="model">${ship.model}</span>` : ''}
        <div class="meta">${ship.type}${ship.company ? ' · ' + ship.company : ''}</div>
      </div>
      <span class="tag">${ship.systems.length} 个系统</span>
    </div>`;

    // ---------- 舰船属性面板（ship_stats.js，中文） ----------
    html += renderStatsPanel(ship);

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
          // 系统属性数据（来自 system_stats.js：武器动作效果）
          const sysStats = (window.SYSTEM_STATS || {})[currentKey] ? (window.SYSTEM_STATS || {})[currentKey][sys.name] : null;
          if (sysStats && sysStats.weapons && sysStats.weapons.length) {
            html += `<div class="sys-props">`;
            // 按 option 槽位分组（同槽多武器 = 互斥选择）
            const slots = {};
            sysStats.weapons.forEach(w => {
              const o = w.option || w.name;
              (slots[o] = slots[o] || []).push(w);
            });
            Object.entries(slots).forEach(([option, list]) => {
              const chosen = getWeaponChoice(currentKey, sys.name, option, list);
              list.forEach(w => {
                const selected = w.name === chosen;
                html += `<div class="sp-item ${selected ? 'selected' : ''}">`;
                html += `<div class="sp-head"><span class="sp-name">🔫 ${w.name}</span>`;
                // 互斥槽位（同 option 多武器）生成切换按钮；data-pick 格式与 panelEl.onclick 委托解析一致：key|s系统|o槽位|w武器
                if (list.length > 1) {
                  html += `<button class="sp-pick ${selected ? 'on' : ''}" data-pick="${escapeHtml(currentKey)}|s${escapeHtml(sys.name)}|o${escapeHtml(option)}|w${escapeHtml(w.name)}" ${selected ? 'disabled' : ''}>${selected ? '✓ 已选' : '选择'}</button>`;
                }
                                html += `</div>`;
                html += `<div class="sp-stats">${w.type ? `<span class="tag">${w.type}</span>` : ''}${w.weaponType ? `<span class="tag">${w.weaponType}</span>` : ''}${w.damage !== undefined ? `<span>⚔️伤害 ${Math.round(w.damage * (enh.fireMul || 1))}${enh.fireMul > 1.0001 ? ' <i class="src">+' + Math.round((enh.fireMul - 1) * 100) + '%</i>' : ''}</span>` : ''}${w.cycle !== undefined ? `<span>💫循环 ${w.cycle}</span>` : ''}${w.lockOn !== undefined ? `<span>🔒锁定 ${w.lockOn}</span>` : ''}${w.rounds !== undefined ? `<span>🔁轮数 ${w.rounds}</span>` : ''}${w.cooldown !== undefined ? `<span>⏱️冷却 ${enh.cdMul && enh.cdMul < 1 ? (Math.round(w.cooldown * enh.cdMul * 10) / 10) + 's <i class="src">-' + Math.round((1 - enh.cdMul) * 100) + '%</i>' : w.cooldown + 's'}</span>` : ''}${w.duration !== undefined ? `<span>⏳持续 ${w.duration}s</span>` : ''}</div>`;
                w.actions.forEach(a => {
                  let info = a.name || '';
                  if (a.effect && a.act) info += ` <i>·</i> ${a.effect}${a.act}${a.value !== undefined ? ' <b>+' + a.value + '</b>' : ''}`;
                  if (a.cond && a.condValue !== undefined) info += `（${a.cond}${a.condValue}）`;
                  html += `<div class="sp-act"><span class="sp-act-name">${info}</span>${a.desc ? `<div class="sp-desc">${a.desc}</div>` : ''}</div>`;
                });
                html += `</div>`;
              });
            });
            html += `</div>`;
          }
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

    // 武器选定按钮事件委托（覆盖式绑定）
    panelEl.onclick = function (e) {
      const btn = e.target && e.target.closest ? e.target.closest('.sp-pick') : null;
      if (!btn || !btn.dataset || !btn.dataset.pick) return;
      const parts = btn.dataset.pick.split('|');
      setWeaponChoice(parts[0], parts[1].slice(1), parts[2].slice(1), parts[3].slice(1));
      renderPanel();
    };

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
        savePoints(); // 升级后立即持久化，否则刷新回滚（可刷点）
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
        savePoints(); // 降级后立即持久化，否则刷新回滚
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
        const v = effValue(e, Math.max(lv, 0), tech.max); // 未强化（lv=0）显示 0 加成，而非按 1 级估算
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
    const flash = '⚠ ' + msg;
    el.textContent = flash;
    setTimeout(() => {
      // 仅当仍显示本次提示时才恢复，避免连点时旧定时器把新提示覆盖掉
      if (el.textContent === flash) el.textContent = old;
    }, 1200);
  }

  // ---------- 技术点 ----------
  // 调试按钮已移除：生产环境不应暴露“+100 技术点”入口（enhance.html 中对应按钮已注释）
  // document.getElementById('btnAddPoints').addEventListener('click', () => {
  //   points += 100;
  //   savePoints();
  //   renderPoints();
  // });

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
  initPyEngine();
  console.log('✅ 舰船强化系统已加载：' + Object.keys(DATA).length + ' 艘舰船');
})();
