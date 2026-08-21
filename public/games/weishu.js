const CLS_ZH = {frigate:'护卫舰', destroyer:'驱逐舰', cruiser:'巡洋舰', battlecruiser:'战列巡洋舰', battleship:'战列舰', carrier:'航空母舰', fighter:'战机', corvette:'护航艇', support:'支援舰'};
const CLS_ICON = {frigate:'护', destroyer:'驱', cruiser:'巡', battlecruiser:'战', battleship:'列', carrier:'航', fighter:'机', corvette:'艇', support:'援'};
const CLS_COLOR = {frigate:'#7fd4ff', destroyer:'#9be89b', cruiser:'#ffd27f', battlecruiser:'#ff9a8a', battleship:'#ff7fa8', carrier:'#c9a5ff', fighter:'#8affd9', corvette:'#ffe27f', support:'#a5c9ff'};
const WEAPON_LABEL = {direct:'直射', projectile:'投射', air:'防空'};
const DMGTYPE_LABEL = {physical:'实弹', energy:'能量'};
const LOCK_SEQUENCE = [{cls:'carrier'}, {cls:'battlecruiser'}, {cls:'cruiser'}, {cls:'destroyer'}, {cls:'frigate'}, {cls:'support'}, {cls:'fighter'}, {cls:'corvette'}];

const CONFIG = {
  TOTAL_ROUNDS: 15,
  ROUND_CLOCK: 60,
  BREACH_CAP: 80,
  HAND_LIMIT: 24,
  EQUIP_LIMIT: 12,
  SPELL_LIMIT: 8,
  DEATH_COST: {fighter: 1, corvette: 1, frigate: 2, destroyer: 3, cruiser: 4, support: 4, battlecruiser: 5, battleship: 6, carrier: 7},
  ASSAULT_FACTOR: 0.06,
  DEPLOY_LIMIT: {carrier: 2, battlecruiser: 2, battleship: 2, cruiser: 5, destroyer: 5, frigate: 5, fighter: 5, corvette: 5, support: 5},
  MODES: {
    beginner: {name: '入门协议', life: 1000, funds: [5, 13, 10], reward: 1},
    prototype: {name: '原型协议', life: 1000, funds: [5, 1, 12], reward: 1.5},
    core: {name: '核心协议', life: 1000, funds: [3, 1, 12], reward: 2}
  },
  BARGE: [
    {slots: 1, equipSlots: 0, shield: 1, cost: 2},
    {slots: 2, equipSlots: 1, shield: 1, cost: 4},
    {slots: 4, equipSlots: 1, shield: 2, cost: 6},
    {slots: 5, equipSlots: 2, shield: 2, cost: 9},
    {slots: 5, equipSlots: 2, shield: 3, cost: 12},
    {slots: 5, equipSlots: 2, shield: 3, cost: 99}
  ],
  UPGRADE_ROUNDS: [3, 6, 10, 12, 14]
};

const EQUIP_BLUEPRINTS = [
  {id: 'dmg', name: '火力增幅器', cost: 3, desc: '攻击力+25%'},
  {id: 'armor', name: '装甲镀层', cost: 3, desc: '装甲+3'},
  {id: 'hp', name: '结构加固', cost: 3, desc: '生命上限+30%'},
  {id: 'rate', name: '急速火控', cost: 2, desc: '攻击速度+25%'},
  {id: 'range', name: '长程制导', cost: 2, desc: '射程+1'},
  {id: 'shield', name: '能量护盾', cost: 4, desc: '护盾+40'},
  {id: 'energy', name: '能量核心', cost: 4, desc: '能量伤害+40%'},
  {id: 'crit', name: '火控核心', cost: 4, desc: '暴击率+15%'}
];

const SPELL_BLUEPRINTS = [
  {id: 'bomb', name: '轨道打击', cost: 5, desc: '对全部敌方编队造成我方总攻击力300%的伤害'},
  {id: 'emp', name: '全域干扰', cost: 4, desc: '敌方全体停火3秒'},
  {id: 'repair', name: '紧急修复', cost: 4, desc: '我方全体舰船恢复40%生命'},
  {id: 'reinforce', name: '增援编队', cost: 5, desc: '立即获得1艘随机舰船加入编组'},
  {id: 'freeze', name: '时间冻结', cost: 4, desc: '敌方停止移动3秒'},
  {id: 'shield', name: '护盾发生器', cost: 3, desc: '本回合我方防御护盾+5'},
  {id: 'corrode', name: '纳米侵蚀', cost: 5, desc: '敌方每秒损失3%生命，持续5秒'},
  {id: 'focus', name: '集火指令', cost: 3, desc: '本回合我方全体攻击力+30%'}
];

const DEFENSE_STRATEGIES = [
  {id: 'aegis', name: '全域防御', org: '联合防御阵列', life: 1000, unlock: 0, desc: '我方生命值提高，所有舰船攻击、装甲、生命+15%；入门协议中敌方攻击与生命-30%', effect: function () { state.life = 1000; state.maxLife = 1000; state.bonuses.dmgMul *= 1.15; state.bonuses.armorMul *= 1.15; if (state.mode === 'beginner') state.enemyDmgMul *= 0.7; }},
  {id: 'swift', name: '精准打击', org: '雷火科技突击舰队', life: 850, unlock: 1, desc: '战斗开始后，攻击力最高的舰船获得攻击力+70%加成', effect: function () { state.life = 850; state.maxLife = 850; state.swift = true; }},
  {id: 'recycle', name: '战利品回收', org: '诺玛运输护航编队', life: 850, unlock: 1, desc: '每击倒30个敌方单位，战斗结束时奖励2-3资金', effect: function () { state.life = 850; state.maxLife = 850; state.recycle = true; }},
  {id: 'gamer', name: '军火商人', org: '比邻星自由贸易同盟', life: 800, unlock: 1, desc: '每消耗18资金，随机获得1艘不高于当前补给等级的舰船', effect: function () { state.life = 800; state.maxLife = 800; state.gacha = true; }},
  {id: 'intel', name: '情报网络', org: '未央资助计划', life: 700, unlock: 2, desc: '每回合第一次刷新为特殊刷新，可刷出补给等级+1的舰船（最高6级）', effect: function () { state.life = 700; state.maxLife = 700; state.intel = true; }},
  {id: 'spell', name: '战术支援', org: '安东尼奥斯联合舰队', life: 750, unlock: 2, desc: '补给等级到达3级后，每回合开始时随机获得1个战术指令', effect: function () { state.life = 750; state.maxLife = 750; state.spellStrategy = true; }},
  {id: 'drill', name: '军官学院', org: '木星工业学院', life: 900, unlock: 3, desc: '同名舰船仅需2艘即可晋升精锐，晋升时额外奖励1资金', effect: function () { state.life = 900; state.maxLife = 900; state.mergeCount = 2; state.mergeBonus = 1; }},
  {id: 'craft', name: '精工制造', org: '安东塔斯重工', life: 800, unlock: 3, desc: '购买舰船资金-1，购买装备与刷新资金+1', effect: function () { state.life = 800; state.maxLife = 800; state.craft = true; }}
];

const UPGRADE_POOL = [
  {name: '攻击强化', desc: '所有舰船攻击力+20%', effect: function () { state.bonuses.dmgMul *= 1.2; }},
  {name: '生命强化', desc: '所有舰船生命上限+20%', effect: function () { state.bonuses.hpMul *= 1.2; }},
  {name: '攻速强化', desc: '所有舰船攻击速度+20%', effect: function () { state.bonuses.rateMul *= 1.2; }},
  {name: '装甲强化', desc: '所有舰船装甲+5', effect: function () { state.bonuses.armorBonus += 5; }},
  {name: '射程强化', desc: '所有舰船射程+1', effect: function () { state.bonuses.rangeBonus += 1; }},
  {name: '直射火力', desc: '直射武器伤害+40%', effect: function () { state.bonuses.directMul *= 1.4; }},
  {name: '投射火力', desc: '投射武器伤害+40%', effect: function () { state.bonuses.projMul *= 1.4; }},
  {name: '防空火力', desc: '防空武器伤害+50%', effect: function () { state.bonuses.airMul *= 1.5; }},
  {name: '能量过载', desc: '能量伤害+40%', effect: function () { state.bonuses.energyMul *= 1.4; }},
  {name: '暴击系统', desc: '暴击率+15%', effect: function () { state.bonuses.critChance += 0.15; }},
  {name: '护盾强化', desc: '防御护盾+3', effect: function () { state.bonuses.shieldBonus += 3; }},
  {name: '资金注入', desc: '立即获得15资金', effect: function () { state.funds += 15; }},
  {name: '精锐化协议', desc: '编组中随机1艘舰船晋升为精锐', effect: function () { eliteRandomShip(); }},
  {name: '装备补给', desc: '随机2件装备加入手牌', effect: function () { grantEquips(); }},
  {name: '战术补给', desc: '随机1个战术指令加入手牌', effect: function () { grantSpell(); }}
];

let state = null;
let newsList = [];
let battleTimer = null;
let uiTimer = null;
let clockLeft = 0;
let overtime = 0;
let toxicActive = false;
let selectedHandIdx = null;
let upgradeTriggered = {};
const PROGRESS_KEY = 'ueg_weishu_progress';
const STATS_KEY = 'ueg_weishu_stats';

function loadProgress() {
  try { const p = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}'); return { beginner: true, prototype: !!p.prototype, core: !!p.core, coreCleared: !!p.coreCleared }; } catch (e) { return { beginner: true, prototype: false, core: false, coreCleared: false }; }
}
function saveProgress() { localStorage.setItem(PROGRESS_KEY, JSON.stringify(state.progress)); }
function loadStats() {
  try { return JSON.parse(localStorage.getItem(STATS_KEY) || '{}'); } catch (e) { return {}; }
}
function saveStats() { localStorage.setItem(STATS_KEY, JSON.stringify(state.stats)); }

function cityLevelOf(wave) {
  if (wave <= 3) return '2';
  if (wave <= 6) return '3';
  if (wave <= 8) return '5';
  if (wave <= 10) return '7';
  return '9';
}

function showModal(title, body) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = body;
  document.getElementById('genericModal').classList.add('active');
}
function closeModals() {
  document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
  const fog = document.getElementById('toxicFog');
  if (fog) fog.remove();
}
function showConfirm(title, body, cb) {
  document.getElementById('confirmTitle').textContent = title;
  document.getElementById('confirmBody').textContent = body;
  document.getElementById('confirmModal').classList.add('active');
  document.getElementById('confirmOk').onclick = function () {
    document.getElementById('confirmModal').classList.remove('active');
    if (cb) cb();
  };
  document.getElementById('confirmCancel').onclick = function () {
    document.getElementById('confirmModal').classList.remove('active');
  };
}
function flashTip(msg) {
  const old = document.getElementById('flashTip');
  if (old) old.remove();
  const tip = document.createElement('div');
  tip.id = 'flashTip';
  tip.className = 'flash-tip';
  tip.textContent = msg;
  document.body.appendChild(tip);
  setTimeout(function () { tip.remove(); }, 2200);
}
function pushNews(msg, cls) {
  newsList.push({ msg: msg, cls: cls || '' });
  if (newsList.length > 30) newsList.shift();
}

function computeEnhanceMul() {
  try {
    const st = JSON.parse(localStorage.getItem('ueg_enhance_state') || '{}');
    let total = 0;
    for (const k in st) for (const s in st[k]) for (const t in st[k][s]) total += st[k][s][t] || 0;
    return 1 + Math.min(0.5, total * 0.001);
  } catch (e) { return 1; }
}
function shipEnhanceBonus(shipName) {
  try {
    const st = JSON.parse(localStorage.getItem('ueg_enhance_state') || '{}');
    const a = shipName.replace(/[·\- ]/g, '');
    let lv = 0;
    for (const k in st) {
      const b = k.replace(/[·\- ]/g, '');
      if (a.includes(b) || b.includes(a)) for (const s in st[k]) for (const t in st[k][s]) lv += st[k][s][t] || 0;
    }
    return 1 + Math.min(0.4, lv * 0.004);
  } catch (e) { return 1; }
}

function initGame() {
  state = {
    phase: 'welcome', mode: 'beginner', strategy: null,
    factions: [], factionHp: [], factionMaxHp: [],
    life: 1000, maxLife: 70, funds: 0, techPoints: 0,
    wave: 1, bargeLevel: 1, upgradeDiscount: 0, shield: 1,
    pool: [], poolFrozen: false, hand: [], units: [], enemies: [],
    bonuses: { dmgMul: 1, hpMul: 1, rateMul: 1, armorBonus: 0, armorMul: 1, rangeBonus: 0, directMul: 1, projMul: 1, airMul: 1, shieldBonus: 0, critChance: 0, energyMul: 1 },
    enhanceMul: 1, enemyDmgMul: 1,
    swift: false, recycle: false, gacha: false, intel: false, spellStrategy: false,
    mergeCount: 3, mergeBonus: 0, craft: false,
    totalKills: 0, roundKills: 0, roundLifeLost: 0, spentFunds: 0, permits: 0,
    attackEvents: [], breakthroughUntil: 0,
    progress: loadProgress(), stats: loadStats(), blueOpenedIn: null
  };
  newsList = [];
  upgradeTriggered = {};
  closeModals();
  const panel = document.getElementById('leftPanel');
  panel.dataset.mode = 'welcome';
  panel.innerHTML = '<div class="welcome"><span class="big-icon">卫</span><h2>卫戍协议</h2><p>星河防线 · 舰队编组防御作战</p><div class="hint">点击「开始模拟」进入作战</div></div>';
}

function showModeSelect() {
  const modal = document.getElementById('modeModal');
  const list = document.getElementById('modeList');
  let html = '';
  const order = ['beginner', 'prototype', 'core'];
  order.forEach(function (k) {
    const m = CONFIG.MODES[k];
    const locked = k === 'prototype' ? !state.progress.prototype : k === 'core' ? !state.progress.core : false;
    html += '<div class="mode-card' + (locked ? ' locked' : '') + '" data-mode="' + k + '">';
    html += '<div class="mode-name">' + m.name + '</div>';
    if (locked) {
      html += '<div class="mode-lock">未解锁 · ' + (k === 'prototype' ? '通关入门协议' : '通关原型协议') + '</div>';
    } else {
      html += '<div class="mode-row"><span>敌方势力生命</span><b>' + m.life + ' 点</b></div>';
      html += '<div class="mode-row"><span>资金节奏</span><b>' + (k === 'beginner' ? '第1回合5，第2回合13，之后每回合10' : '第1回合' + m.funds[0] + '，之后每回合+1，上限' + m.funds[2]) + '</b></div>';
      html += '<div class="mode-row"><span>回合数</span><b>固定15回合</b></div>';
    }
    html += '</div>';
  });
  list.innerHTML = html;
  modal.classList.add('active');
  list.querySelectorAll('.mode-card').forEach(function (el) {
    el.addEventListener('click', function () {
      if (el.classList.contains('locked')) { flashTip('该模式尚未解锁'); return; }
      state.mode = el.dataset.mode;
      modal.classList.remove('active');
      showStrategySelect();
    });
  });
}

function strategyUnlocked(s) {
  if (s.unlock === 0) return true;
  if (s.unlock === 1) return state.progress.prototype;
  if (s.unlock === 2) return state.progress.core;
  return state.progress.coreCleared;
}
function showStrategySelect() {
  const modal = document.getElementById('strategyModal');
  const list = document.getElementById('strategyList');
  const pool = DEFENSE_STRATEGIES.filter(strategyUnlocked);
  const picks = [];
  while (picks.length < 3 && pool.length) {
    const i = Math.floor(Math.random() * pool.length);
    picks.push(pool.splice(i, 1)[0]);
  }
  let html = '';
  picks.forEach(function (s) {
    html += '<div class="strategy-card" data-id="' + s.id + '">';
    html += '<div class="sc-head"><span class="sc-name">' + s.name + '</span><span class="sc-org">' + s.org + '</span></div>';
    html += '<div class="sc-life">我方生命 ' + s.life + '</div>';
    html += '<div class="sc-desc">' + s.desc + '</div>';
    html += '</div>';
  });
  list.innerHTML = html;
  modal.classList.add('active');
  list.querySelectorAll('.strategy-card').forEach(function (el) {
    el.addEventListener('click', function () {
      const s = DEFENSE_STRATEGIES.find(function (x) { return x.id === el.dataset.id; });
      if (!s) return;
      state.strategy = s;
      modal.classList.remove('active');
      showDeployModal();
    });
  });
}

function buildShipPool() {
  return window.PLAYER_SHIPS || [];
}
function selectedShipCount(cls) {
  return state.hand.filter(function (c) { return c.ship && c.ship.cls === cls; }).length;
}
function hasCarrier() {
  return state.hand.some(function (c) { return c.ship && c.ship.carry; });
}
function carrierTotal() {
  return state.hand.reduce(function (a, c) {
    if (c.ship && c.ship.carry) { a.f += c.ship.carry.fighter; a.c += c.ship.carry.corvette; }
    return a;
  }, { f: 0, c: 0 });
}
function selectedAirCount() {
  return state.hand.reduce(function (a, c) {
    if (c.ship && (c.ship.cls === 'fighter' || c.ship.cls === 'corvette')) a++;
    return a;
  }, 0);
}

function countOfId(id) {
  return state.hand.reduce(function (a, c) { return a + (c.ship && c.ship.id === id ? 1 : 0); }, 0);
}
function totalCommand() {
  return state.hand.reduce(function (a, c) { return a + (c.ship && c.ship.cls !== 'fighter' && c.ship.cls !== 'corvette' ? c.ship.command : 0); }, 0);
}
function modOffset(card) {
  const mod = card.mod || '';
  const o = { dmgMul: 1, hpMul: 1, armorBonus: 0, repair: 0, carry: null };
  if (/炮击|攻击|火力|突击|鱼雷|导弹|离子/.test(mod)) o.dmgMul = 1.15;
  if (/装甲|防御|防护/.test(mod)) { o.hpMul = 1.1; o.armorBonus = 5; }
  if (/载机|机库|舰载/.test(mod)) o.carry = 'add';
  if (/维修|支援|后勤|工程/.test(mod)) o.repair = 1;
  return o;
}
function openModModal(s) {
  const modal = document.getElementById('modModal');
  const body = document.getElementById('modBody');
  if (!s.mods || !s.mods.length) { flashTip('该舰船没有可更换模块'); return; }
  let html = '<div class="mod-ship-name">' + s.name + '</div><div class="mod-list">';
  s.mods.forEach(function (m) {
    html += '<div class="mod-item" data-mod="' + m + '"><span>' + m + '</span><em>' + (modOffset({ mod: m }).dmgMul > 1 ? '火力型' : modOffset({ mod: m }).repair ? '支援型' : modOffset({ mod: m }).carry ? '载机型' : modOffset({ mod: m }).armorBonus ? '防御型' : '标准型') + '</em></div>';
  });
  html += '</div>';
  body.innerHTML = html;
  modal.classList.add('active');
  body.querySelectorAll('.mod-item').forEach(function (el) {
    el.addEventListener('click', function () {
      const m = el.dataset.mod;
      state.hand.forEach(function (c) { if (c.ship && c.ship.id === s.id) c.mod = m; });
      flashTip('已更换模块：' + m);
      modal.classList.remove('active');
      updateDeployLight();
      const pb = document.getElementById('deployBody');
      if (pb) pb.querySelectorAll('.dp-ship').forEach(function (x) { x.classList.remove('on'); });
      showDeployModal();
    });
  });
}
function showDeployModal() {
  const modal = document.getElementById('deployModal');
  const body = document.getElementById('deployBody');
  const pool = buildShipPool();
  const groups = {};
  for (const s of pool) (groups[s.cls] = groups[s.cls] || []).push(s);
  const total = carrierTotal();
  const airSel = selectedAirCount();
  const airLimit = total.f + total.c;
  const cmd = totalCommand();
  let html = '<div class="deploy-cmd"><span>舰队指挥值</span><b class="' + (cmd > 400 ? 'over' : '') + '">' + cmd + '/400</b><span class="dp-cmd-hint">舰载机不占指挥值</span></div>';
  html += '<div class="deploy-layout">';
  html += '<div class="deploy-left">';
  const clsOrder = ['carrier', 'battlecruiser', 'battleship', 'cruiser', 'destroyer', 'frigate', 'fighter', 'corvette', 'support'];
  for (const cls of clsOrder) {
    const list = groups[cls] || [];
    if (!list.length) continue;
    const cnt = selectedShipCount(cls);
    let locked = false;
    if (cls === 'fighter' || cls === 'corvette') locked = !hasCarrier() || airSel >= airLimit;
    html += '<div class="dp-group' + (locked ? ' locked' : '') + '" data-cls="' + cls + '">';
    html += '<div class="dp-group-title">' + CLS_ZH[cls] + ' <span class="dp-limit">' + cnt + ' 艘</span>';
    if (cls === 'fighter' || cls === 'corvette') {
      html += ' <span class="dp-aircap">搭载 ' + airSel + '/' + airLimit + '</span>';
    }
    html += '</div>';
    if (locked && (cls === 'fighter' || cls === 'corvette')) {
      html += '<div class="dp-lock-tip">需先选择搭载舰船，且战机/护航艇数量不得超过搭载量</div>';
    }
    html += '<div class="dp-ships">';
    list.forEach(function (s) {
      const have = countOfId(s.id);
      const isAir = s.cls === 'fighter' || s.cls === 'corvette';
      const maxByAir = isAir ? Math.max(0, airLimit - (airSel - have)) : 99999;
      const maxN = Math.min(s.maxShip, maxByAir);
      const canAdd = have < maxN && !locked && cmd + (isAir ? 0 : s.command) <= 400;
      html += '<div class="dp-ship' + (have ? ' on' : '') + '" data-id="' + s.id + '">';
      html += '<div class="dp-name">' + s.name + '</div>';
      html += '<div class="dp-stats">HP ' + s.hp + ' 攻 ' + s.dmg + ' 甲 ' + s.armor + ' ' + WEAPON_LABEL[s.weapon] + DMGTYPE_LABEL[s.dmgType] + ' 指挥' + s.command + '</div>';
      if (s.carry) html += '<div class="dp-carry">搭载 战机' + s.carry.fighter + ' 护航艇' + s.carry.corvette + '</div>';
      if (isAir && !hasCarrier()) html += '<div class="dp-lock-badge">需先选择搭载舰船</div>';
      html += '<div class="dp-qty">';
      html += '<button class="dp-minus" data-minus="' + s.id + '">-</button>';
      html += '<span class="dp-num">' + have + '/' + s.maxShip + '</span>';
      html += '<button class="dp-plus' + (canAdd ? '' : ' off') + '" data-plus="' + s.id + '">+</button>';
      if (s.mods && s.mods.length) html += '<button class="dp-mod" data-mod="' + s.id + '">模块</button>';
      html += '</div>';
      html += '</div>';
    });
    html += '</div></div>';
  }
  html += '</div>';
  html += renderDeployRight();
  body.innerHTML = html;
  modal.classList.add('active');
  body.querySelectorAll('[data-plus]').forEach(function (el) {
    el.addEventListener('click', function () {
      const s = pool.find(function (x) { return x.id === el.dataset.plus; });
      if (!s) return;
      const have = countOfId(s.id);
      const isAir = s.cls === 'fighter' || s.cls === 'corvette';
      if (have >= s.maxShip) { flashTip('已达该舰船服役数上限'); return; }
      if (isAir) {
        if (!hasCarrier()) { flashTip('需先选择搭载舰船'); return; }
        if (selectedAirCount() >= carrierTotal().f + carrierTotal().c) { flashTip('搭载量已满'); return; }
      } else {
        if (totalCommand() + s.command > 400) { flashTip('指挥值不足（' + totalCommand() + '+' + s.command + '>400）'); return; }
      }
      state.hand.push({ ship: s, elite: false, equips: [], lv: {}, kills: 0, lastFireTime: 0, mod: s.mods && s.mods.length ? s.mods[0] : '', spentTech: 0 });
      flashTip('已加入编组：' + s.name);
      try { updateDeployLight(); } catch (e) { if (window.console) console.error(e); }
    });
  });
  body.querySelectorAll('[data-minus]').forEach(function (el) {
    el.addEventListener('click', function () {
      const id = el.dataset.minus;
      const idx = state.hand.findIndex(function (c) { return c.ship && c.ship.id === id; });
      if (idx > -1) { state.hand.splice(idx, 1); flashTip('已移除 1 艘'); updateDeployLight(); }
    });
  });
  body.querySelectorAll('[data-mod]').forEach(function (el) {
    el.addEventListener('click', function () {
      const s = pool.find(function (x) { return x.id === el.dataset.mod; });
      if (s) openModModal(s);
    });
  });
  bindDeployRight(body);
}
function startSimulation() {
  const f1 = Math.floor(Math.random() * 6);
  let f2 = Math.floor(Math.random() * 6);
  while (f2 === f1) f2 = Math.floor(Math.random() * 6);
  state.factions = [f1, f2];
  const life = CONFIG.MODES[state.mode].life;
  state.factionMaxHp = [life, life];
  state.factionHp = [life, life];
  state.funds = 0;
  state.techPoints = 0;
  state.wave = 1;
  state.upgradeDiscount = 0;
  state.totalKills = 0;
  state.roundKills = 0;
  state.spentFunds = 0;
  state.permits = 0;
  state.bargeLevel = 1;
  state.pool = [];
  state.enemies = [];
  state.units = [];
  state.bonuses = { dmgMul: 1, hpMul: 1, rateMul: 1, armorBonus: 0, armorMul: 1, rangeBonus: 0, directMul: 1, projMul: 1, airMul: 1, shieldBonus: 0, critChance: 0, energyMul: 1 };
  state.enhanceMul = computeEnhanceMul();
  state.enemyDmgMul = 1;
  state.swift = false; state.recycle = false; state.gacha = false; state.intel = false; state.spellStrategy = false;
  state.mergeCount = 3; state.mergeBonus = 0; state.craft = false;
  upgradeTriggered = {};
  if (state.strategy && state.strategy.effect) state.strategy.effect();
  state.life = state.strategy ? state.strategy.life : 70;
  state.maxLife = state.life;
  state.shield = CONFIG.BARGE[0].shield;
  state.phase = 'prep';
  startPrepRound();
}
function startPrepRound() {
  state.phase = 'prep';
  stopBattleLoop();
  const fog = document.getElementById('toxicFog');
  if (fog) fog.remove();
  const reward = 2 + state.wave + Math.floor(state.techPoints * 0) ;
  const tpGain = Math.round((2 + state.wave) * CONFIG.MODES[state.mode].reward);
  state.techPoints += tpGain;
  state.funds += fundsOfRound(state.wave);
  state.upgradeDiscount++;
  state.shield = bargeShield();
  state.roundKills = 0;
  state.roundLifeLost = 0;
  state.attackEvents = [];
  if (state.spellStrategy && state.bargeLevel >= 3) {
    const sp = SPELL_BLUEPRINTS[Math.floor(Math.random() * SPELL_BLUEPRINTS.length)];
    state.hand.push({ type: 'spell', sp: sp });
    pushNews('战术支援：获得战术指令 ' + sp.name, 'good');
  }
  if (!state.poolFrozen) state.pool = [];
  else { state.poolFrozen = false; state.pool.forEach(function (p) { p.frozen = false; }); }
  generatePool();
  rebuildUnits();
  if (CONFIG.UPGRADE_ROUNDS.indexOf(state.wave) > -1 && !upgradeTriggered[state.wave]) {
    showUpgradeOptions();
    return;
  }
  if (state.wave > CONFIG.TOTAL_ROUNDS) {
    endGame(false);
    return;
  }
  renderPrep();
}
function renderTopStatus() {
  const m = CONFIG.MODES[state.mode];
  let html = '<div class="top-status">';
  for (let i = 0; i < 2; i++) {
    const pct = state.factionMaxHp[i] ? Math.max(0, state.factionHp[i] / state.factionMaxHp[i] * 100) : 0;
    html += '<div class="faction-bar"><div class="fb-name">敌方势力 ' + (i + 1) + '</div><div class="fb-track"><div class="fb-fill" style="width:' + pct + '%"></div></div><div class="fb-num">' + Math.max(0, state.factionHp[i]) + '</div></div>';
  }
  html += '<div class="my-bar">';
  html += '<div class="mb-row"><span class="mb-label">护盾</span><div class="shield-bar"><div class="fill" style="width:' + Math.min(100, state.shield / Math.max(1, bargeShield() + 5) * 100) + '%"></div></div><span class="mb-val">' + Math.round(state.shield) + '</span></div>';
  html += '<div class="mb-row"><span class="mb-label">生命</span><div class="life-bar"><div class="fill" style="width:' + Math.max(0, state.life / state.maxLife * 100) + '%"></div></div><span class="mb-val">' + Math.max(0, state.life) + '/' + state.maxLife + '</span></div>';
  html += '<div class="mb-row"><span class="mb-label">资金</span><span class="mb-val">' + state.funds + '</span></div>';
  html += '<div class="mb-row"><span class="mb-label">强化点</span><span class="mb-val">' + state.techPoints + '</span></div>';
  html += '<div class="mb-row"><span class="mb-label">回合</span><span class="mb-val">' + state.wave + '/' + CONFIG.TOTAL_ROUNDS + '</span></div>';
  html += '</div></div>';
  return html;
}
function renderPrep() {
  const panel = document.getElementById('leftPanel');
  panel.dataset.mode = 'prep';
  let html = '<div class="game-header">';
  html += renderTopStatus();
  html += renderNewsTicker();
  html += renderBarge();
  html += '<div class="prep-fleet">';
  html += '<div class="pf-title">我方编组（手牌区）</div>';
  html += renderFleetRows();
  html += '</div>';
  html += renderPoolSection();
  html += renderHandSection();
  html += renderActionBar('prep');
  html += '</div>';
  panel.innerHTML = html;
  renderPoolSectionBind();
}
function renderBarge() {
  const b = CONFIG.BARGE[state.bargeLevel - 1];
  const next = state.bargeLevel < 6 ? CONFIG.BARGE[state.bargeLevel] : null;
  let html = '<div class="barge-panel">';
  html += '<div class="bp-title">补给驳船 Lv.' + state.bargeLevel + '</div>';
  html += '<div class="bp-stats">';
  html += '<span>护盾 ' + b.shield + '</span>';
  html += '<span>舰船栏 ' + b.slots + '</span>';
  html += '<span>装备栏 ' + b.equipSlots + '</span>';
  html += '<span>升级价 ' + (next ? bargeUpgradeCost() : 'MAX') + '</span>';
  html += '</div>';
  if (next) {
    html += '<button class="btn-action small" id="bargeUpgradeBtn">升级驳船（' + bargeUpgradeCost() + '资金）</button>';
  }
  html += '</div>';
  return html;
}
function bargeShield() {
  return CONFIG.BARGE[state.bargeLevel - 1].shield + state.bonuses.shieldBonus;
}
function bargeUpgradeCost() {
  const base = CONFIG.BARGE[state.bargeLevel - 1].cost;
  return Math.max(0, base - state.upgradeDiscount);
}
function fundsOfRound(wave) {
  const m = CONFIG.MODES[state.mode].funds;
  if (state.mode === 'beginner') {
    if (wave === 1) return m[0];
    if (wave === 2) return m[1];
    return m[2];
  }
  return Math.min(m[2], m[0] + (wave - 1));
}
function generatePool() {
  const b = CONFIG.BARGE[state.bargeLevel - 1];
  const pool = [];
  for (let i = 0; i < b.slots; i++) {
    const s = randomShipByLevel(0);
    pool.push({ type: 'ship', ship: s, price: Math.max(2, Math.round(s.hp / 120)) });
  }
  for (let i = 0; i < b.equipSlots; i++) {
    const eq = EQUIP_BLUEPRINTS[Math.floor(Math.random() * EQUIP_BLUEPRINTS.length)];
    pool.push({ type: 'equip', eq: eq, price: eq.cost });
  }
  if (state.bargeLevel >= 3 && Math.random() < 0.5) {
    const sp = SPELL_BLUEPRINTS[Math.floor(Math.random() * SPELL_BLUEPRINTS.length)];
    pool.push({ type: 'spell', sp: sp, price: sp.cost });
  }
  state.pool = pool;
}
function randomShipByLevel(plus) {
  const pool = buildShipPool().filter(function (s) {
    const order = { frigate: 1, destroyer: 2, corvette: 2, fighter: 2, cruiser: 3, support: 3, battlecruiser: 4, battleship: 5, carrier: 6 };
    return (order[s.cls] || 3) <= state.bargeLevel + (plus || 0);
  });
  if (!pool.length) return buildShipPool()[Math.floor(Math.random() * buildShipPool().length)];
  return pool[Math.floor(Math.random() * pool.length)];
}
function refreshCost() {
  return 2 + (state.craft ? 1 : 0);
}
function renderDeployPreview() {
  const rows = [[], [], []];
  state.hand.forEach(function (card) {
    rows[clsToRow(card.ship.cls)].push(card);
  });
  const labels = ['前排', '中排', '后排'];
  let html = '<div class="dp-preview">';
  rows.forEach(function (arr, i) {
    html += '<div class="dp-prow">';
    html += '<div class="dp-plabel">' + labels[i] + '</div>';
    html += '<div class="dp-pcells">';
    if (!arr.length) {
      html += '<div class="dp-pempty">—</div>';
    } else {
      arr.forEach(function (card) {
        const color = CLS_COLOR[card.ship.cls] || '#8fa3c8';
        html += '<div class="dp-pcell" style="border-color:' + color + ';" title="' + card.ship.name + '">';
        html += '<span class="dp-picon" style="background:' + color + '26;color:' + color + ';">' + (CLS_ICON[card.ship.cls] || '◇') + '</span>';
        html += '<span class="dp-pname">' + (card.ship.shortName || card.ship.name) + '</span>';
        html += '</div>';
      });
    }
    html += '</div></div>';
  });
  html += '</div>';
  return html;
}
function renderNewsTicker() {
  let items = newsList.slice(-3).map(function (n) { return '<span class="nt-item ' + n.cls + '">' + n.msg + '</span>'; }).join('');
  return '<div class="news-ticker" id="newsTicker">' + items + '</div>';
}
function freezePool() {
  if (state.funds < 2) { flashTip('资金不足'); return; }
  state.funds -= 2;
  state.poolFrozen = true;
  pushNews('补给栏位已冻结至下一回合', 'good');
  renderPrep();
}
function refreshPool() {
  const cost = refreshCost();
  let free = false;
  if (state.intel) {
    if (!state.poolRefreshed) { free = true; state.poolRefreshed = true; }
  }
  if (!free && state.funds < cost) { flashTip('资金不足'); return; }
  if (!free) state.funds -= cost;
  generatePool();
  pushNews('补给已重新调配', '');
  renderPrep();
}
function updateDeployRight() {
  const body = document.getElementById('deployBody');
  if (!body) return;
  const right = body.querySelector('.deploy-right');
  const pool = buildShipPool();
  const total = carrierTotal();
  const airSel = selectedAirCount();
  const airLimit = total.f + total.c;
  let html = '<div class="dp-right-title">我方编组（' + state.hand.length + ' 艘）</div>';
  html += renderDeployPreview();
  html += '<div class="dp-selected">';
  if (!state.hand.length) html += '<div class="dp-empty-tip">尚未选择舰船</div>';
  state.hand.forEach(function (card, i) {
    html += '<div class="dp-sel-item"><span>' + card.ship.name + '</span><button class="btn-action small danger" data-remove="' + i + '">移除</button></div>';
  });
  html += '</div>';
  html += '<div class="dp-actions">';
  html += '<button class="btn-action primary-btn" id="deployConfirm">确认配队，开始模拟</button>';
  html += '<button class="btn-action" id="deployClear">清空</button>';
  html += '</div>';
  right.innerHTML = html;
  right.querySelectorAll('[data-remove]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const i = parseInt(btn.dataset.remove, 10);
      state.hand.splice(i, 1);
      updateDeployRight();
    });
  });
  document.getElementById('deployConfirm').addEventListener('click', function () {
    if (!state.hand.length) { flashTip('请至少选择 1 艘舰船'); return; }
    document.getElementById('deployModal').classList.remove('active');
    startSimulation();
  });
  document.getElementById('deployClear').addEventListener('click', function () {
    state.hand = [];
    updateDeployRight();
  });
  body.querySelectorAll('.dp-group').forEach(function (g) {
    const cls = g.dataset.cls;
    if (!cls) return;
    const limit = CONFIG.DEPLOY_LIMIT[cls];
    const cnt = selectedShipCount(cls);
    const cap = g.querySelector('.dp-limit');
    if (cap) cap.textContent = cnt + '/' + limit;
    let locked = false;
    if (cls === 'fighter' || cls === 'corvette') locked = !hasCarrier() || airSel >= airLimit;
    g.classList.toggle('locked', locked);
    g.querySelectorAll('.dp-ship').forEach(function (el) {
      const id = el.dataset.id;
      const on = state.hand.some(function (c) { return c.ship.id === id; });
      el.classList.toggle('on', on);
      el.classList.toggle('off', !on && (cnt >= limit || locked));
    });
  });
}
function upgradeBarge() {
  if (state.bargeLevel >= 6) { flashTip('补给等级已满'); return; }
  const cost = bargeUpgradeCost();
  if (state.funds < cost) { flashTip('资金不足'); return; }
  state.funds -= cost;
  state.bargeLevel++;
  state.upgradeDiscount = 0;
  pushNews('补给驳船升级至 Lv.' + state.bargeLevel, 'good');
  if (state.gacha) {
    const s = randomShipByLevel(0);
    state.hand.push({ ship: s, elite: false, equips: [], lv: {}, kills: 0, lastFireTime: 0 });
    pushNews('军火商人：获得舰船 ' + s.name, 'good');
  }
  renderPrep();
}
function renderDeployRight() {
  let html = '<div class="deploy-right">';
  html += '<div class="dp-right-title">我方编组（' + state.hand.length + ' 艘）</div>';
  html += renderDeployPreview();
  html += '<div class="dp-selected" id="dpSelected">';
  if (!state.hand.length) html += '<div class="dp-empty-tip">尚未选择舰船</div>';
  const byId = {};
  state.hand.forEach(function (card) { (byId[card.ship.id] = byId[card.ship.id] || []).push(card); });
  for (const id in byId) {
    const cards = byId[id];
    const card = cards[0];
    html += '<div class="dp-sel-item"><span>' + card.ship.name + ' ×' + cards.length + (card.mod ? ' [' + card.mod + ']' : '') + '</span><button class="btn-action small danger" data-remove="' + id + '">移除</button></div>';
  }
  html += '</div>';
  html += '<div class="dp-actions">';
  html += '<button class="btn-action primary-btn" id="deployConfirm">确认配队，开始模拟</button>';
  html += '<button class="btn-action" id="deployClear">清空</button>';
  html += '</div></div></div>';
  return html;
}
function updateDeployLight() {
  const body = document.getElementById('deployBody');
  if (!body) return;
  const cEl = body.querySelector('.deploy-cmd');
  if (cEl) {
    const b = cEl.querySelector('b');
    if (b) { b.textContent = totalCommand() + '/400'; b.className = totalCommand() > 400 ? 'over' : ''; }
  }
  const pool = buildShipPool();
  const airUnlocked = hasCarrier() && selectedAirCount() < carrierTotal().f + carrierTotal().c;
  body.querySelectorAll('.dp-lock-tip').forEach(function (t) {
    t.style.display = airUnlocked ? 'none' : '';
  });
  body.querySelectorAll('[data-plus]').forEach(function (el) {
    const s = pool.find(function (x) { return x.id === el.dataset.plus; });
    if (!s) return;
    const have = countOfId(s.id);
    const isAir = s.cls === 'fighter' || s.cls === 'corvette';
    let can = have < s.maxShip;
    if (isAir) can = can && hasCarrier() && selectedAirCount() < carrierTotal().f + carrierTotal().c;
    else can = can && totalCommand() + s.command <= 400;
    el.classList.toggle('off', !can);
    const num = el.parentNode.querySelector('.dp-num');
    if (num) num.textContent = have + '/' + s.maxShip;
  });
  body.querySelectorAll('.dp-lock-badge').forEach(function (b) { b.remove(); });
  if (!hasCarrier()) {
    body.querySelectorAll('.dp-ship').forEach(function (shipEl) {
      const plus = shipEl.querySelector('[data-plus]');
      if (!plus) return;
      const s = pool.find(function (x) { return x.id === plus.dataset.plus; });
      if (s && (s.cls === 'fighter' || s.cls === 'corvette')) {
        const b = document.createElement('div');
        b.className = 'dp-lock-badge';
        b.textContent = '需先选择搭载舰船';
        shipEl.insertBefore(b, shipEl.firstChild);
      }
    });
  }
  const right = body.querySelector('.deploy-right');
  if (right) {
    right.outerHTML = renderDeployRight();
    bindDeployRight(body.querySelector('.deploy-right'));
  }
}
function bindDeployRight(root) {
  root.querySelectorAll('[data-remove]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const id = btn.dataset.remove;
      state.hand = state.hand.filter(function (c) { return !(c.ship && c.ship.id === id); });
      updateDeployLight();
    });
  });
  const cf = root.querySelector('#deployConfirm');
  if (cf) cf.addEventListener('click', function () {
    if (!state.hand.length) { flashTip('请至少选择 1 艘舰船'); return; }
    document.getElementById('deployModal').classList.remove('active');
    startSimulation();
  });
  const cl = root.querySelector('#deployClear');
  if (cl) cl.addEventListener('click', function () { state.hand = []; updateDeployLight(); });
}
function countHand(type) { return state.hand.filter(function (c) { return type === 'ship' ? !!c.ship : c.type === type; }).length; }

function buyPoolItem(idx) {
  const item = state.pool[idx];
  if (!item) return;
  let price = item.price;
  if (item.type === 'ship') price = Math.max(1, price - (state.craft ? 1 : 0));
  else if (state.craft) price += 1;
  if (state.funds < price) { flashTip('资金不足'); return; }
  if (item.type === 'ship' && countHand('ship') >= CONFIG.HAND_LIMIT) { flashTip('舰船手牌区已满'); return; }
  if (item.type === 'equip' && countHand('equip') >= CONFIG.EQUIP_LIMIT) { flashTip('装备栏已满'); return; }
  if (item.type === 'spell' && countHand('spell') >= CONFIG.SPELL_LIMIT) { flashTip('战术指令栏已满'); return; }
  state.funds -= price;
  state.spentFunds += price;
  if (item.type === 'ship') {
    state.hand.push({ ship: item.ship, elite: false, equips: [], lv: {}, kills: 0, lastFireTime: 0 });
    pushNews('购入舰船：' + item.ship.name, 'good');
    tryMergeShips();
  } else if (item.type === 'equip') {
    state.hand.push({ type: 'equip', eq: item.eq, lv: 1 });
    pushNews('购入装备：' + item.eq.name, 'good');
    tryMergeEquips();
  } else {
    state.hand.push({ type: 'spell', sp: item.sp });
    pushNews('获得战术指令：' + item.sp.name, 'good');
  }
  if (state.gacha) checkGacha();
  renderPrep();
}

function checkGacha() {
  if (state.spentFunds >= 18) {
    const s = randomShipByLevel(0);
    state.hand.push({ ship: s, elite: false, equips: [], lv: {}, kills: 0, lastFireTime: 0 });
    state.spentFunds -= 18;
    pushNews('军火商人：获得舰船 ' + s.name, 'good');
  }
}

function renderPoolSection() {
  let html = '<div class="pool-section">';
  html += '<div class="pool-head"><span>补给池（驳船补给）</span><span class="pool-actions"><button class="btn-action tiny" id="refreshPoolBtn">刷新 ' + refreshCost() + '资金</button><button class="btn-action tiny" id="freezePoolBtn">冻结 2资金</button></span></div>';
  html += '<div class="pool-list">';
  if (!state.pool.length) html += '<div class="pool-empty">补给已售罄，请刷新</div>';
  state.pool.forEach(function (item, i) {
    let price = item.price;
    if (item.type === 'ship') price = Math.max(1, price - (state.craft ? 1 : 0));
    else if (state.craft) price += 1;
    let inner = '';
    if (item.type === 'ship') {
      const s = item.ship;
      inner = '<div class="pc-name">' + s.name + '</div><div class="pc-stats">HP ' + s.hp + ' 攻 ' + s.dmg + ' ' + CLS_ZH[s.cls] + '</div>';
    } else if (item.type === 'equip') {
      inner = '<div class="pc-name">' + item.eq.name + '</div><div class="pc-stats">' + item.eq.desc + '</div>';
    } else {
      inner = '<div class="pc-name">' + item.sp.name + '</div><div class="pc-stats">' + item.sp.desc + '</div>';
    }
    html += '<div class="pool-card" data-idx="' + i + '">' + inner + '<div class="pc-price">' + price + ' 资金</div></div>';
  });
  html += '</div></div>';
  return html;
}

function renderHandSection() {
  let html = '<div class="hand-section">';
  html += '<div class="hand-head"><span>手牌区 舰船 ' + countHand('ship') + '/' + CONFIG.HAND_LIMIT + ' 装备 ' + countHand('equip') + '/' + CONFIG.EQUIP_LIMIT + ' 战术 ' + countHand('spell') + '/' + CONFIG.SPELL_LIMIT + '</span><button class="btn-action tiny" id="blueOpenBtn">本局蓝图数据库</button></div>';
  html += '<div class="hand-list">';
  if (!state.hand.length) html += '<div class="pool-empty">手牌区为空</div>';
  state.hand.forEach(function (card, i) {
    if (card.ship) {
      const s = card.ship;
      html += '<div class="hand-card' + (card.elite ? ' elite' : '') + '" data-idx="' + i + '">';
      html += '<div class="hc-name">' + (s.shortName || s.name) + '</div>';
      html += '<div class="hc-cls">' + CLS_ZH[s.cls] + '</div>';
      if (card.elite) html += '<div class="hc-tag">精锐</div>';
      if (card.lv && Object.keys(card.lv).length) html += '<div class="hc-lv">强化' + Object.keys(card.lv).length + '</div>';
      html += '<button class="btn-action tiny danger" data-sell="' + i + '">出售 1</button>';
      html += '</div>';
    } else if (card.type === 'equip') {
      html += '<div class="hand-card equip" data-idx="' + i + '">';
      html += '<div class="hc-name">' + card.eq.name + ' Lv.' + card.lv + '</div>';
      html += '<div class="hc-cls">装备</div>';
      html += '<button class="btn-action tiny danger" data-sell="' + i + '">销毁</button>';
      html += '</div>';
    } else {
      html += '<div class="hand-card spell" data-idx="' + i + '">';
      html += '<div class="hc-name">' + card.sp.name + '</div>';
      html += '<div class="hc-cls">战术指令</div>';
      html += '<button class="btn-action tiny" data-use="' + i + '">使用</button>';
      html += '</div>';
    }
  });
  html += '</div></div>';
  return html;
}

function renderFleetRows() {
  const rows = [[], [], []];
  state.hand.forEach(function (card) {
    if (!card.ship) return;
    rows[card.ship.row].push(card);
  });
  const labels = ['前排', '中排', '后排'];
  let html = '<div class="fleet-rows">';
  rows.forEach(function (arr, i) {
    html += '<div class="fleet-row">';
    html += '<div class="row-label">' + labels[i] + '</div>';
    html += '<div class="row-cards">';
    if (!arr.length) html += '<div class="row-empty">—</div>';
    arr.forEach(function (card) {
      const s = card.ship;
      const color = CLS_COLOR[s.cls] || '#8fa3c8';
      html += '<div class="prep-card' + (card.elite ? ' elite' : '') + '">';
      html += '<span class="fc-icon" style="background:' + color + '26;border-color:' + color + ';color:' + color + ';">' + (CLS_ICON[s.cls] || '◇') + '</span>';
      html += '<div class="prep-card-info"><div class="pci-name">' + (s.shortName || s.name) + '</div><div class="pci-stats">HP ' + s.hp + ' 攻 ' + s.dmg + ' ' + CLS_ZH[s.cls] + '</div></div>';
      html += '</div>';
    });
    html += '</div></div>';
  });
  html += '</div>';
  return html;
}

function renderActionBar(phase) {
  if (phase === 'prep') {
    return '<div class="action-bar"><button class="btn-action primary-btn" id="startBattleBtn">开始作战</button><button class="btn-action" id="skipRoundBtn">跳过回合</button><button class="btn-action" id="abortBtn">放弃战斗</button></div>';
  }
  if (phase === 'battle') {
    return '<div class="action-bar"><span class="ab-note">自动作战中</span></div>';
  }
  return '<div class="action-bar"></div>';
}

function renderPoolSectionBind() {
  const r = document.getElementById('refreshPoolBtn');
  if (r) r.addEventListener('click', refreshPool);
  const f = document.getElementById('freezePoolBtn');
  if (f) f.addEventListener('click', freezePool);
  document.querySelectorAll('.pool-card').forEach(function (el) {
    el.addEventListener('click', function () { buyPoolItem(parseInt(el.dataset.idx, 10)); });
  });
  document.querySelectorAll('.hand-card').forEach(function (el) {
    el.addEventListener('click', function () {
      const i = parseInt(el.dataset.idx, 10);
      const card = state.hand[i];
      if (card && card.ship) {
        selectHandCard(i);
      } else if (card && card.type === 'spell') {
        useSpellFromHand(i);
      }
    });
  });
  document.querySelectorAll('[data-sell]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const i = parseInt(btn.dataset.sell, 10);
      const card = state.hand[i];
      if (card.ship) {
        state.hand.splice(i, 1);
        state.funds += 1;
        pushNews('舰船已出售给驳船，获得 1 资金', '');
      } else {
        state.hand.splice(i, 1);
        pushNews('已销毁', '');
      }
      renderPrep();
    });
  });
  document.querySelectorAll('[data-use]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      useSpellFromHand(parseInt(btn.dataset.use, 10));
    });
  });
  const bb = document.getElementById('blueOpenBtn');
  if (bb) bb.addEventListener('click', function () { state.blueOpenedIn = 'prep'; showBlueModal(); });
  const sb = document.getElementById('startBattleBtn');
  if (sb) sb.addEventListener('click', startBattle);
  const sk = document.getElementById('skipRoundBtn');
  if (sk) sk.addEventListener('click', skipRound);
  const ab = document.getElementById('abortBtn');
  if (ab) ab.addEventListener('click', abortRun);
  const bu = document.getElementById('bargeUpgradeBtn');
  if (bu) bu.addEventListener('click', upgradeBarge);
}

function selectHandCard(i) {
  const card = state.hand[i];
  if (!card || !card.ship) return;
  const s = card.ship;
  const lv = card.lv || {};
  showConfirm('舰船详情：' + s.name, '舰种 ' + CLS_ZH[s.cls] + '\n生命 ' + s.hp + ' 攻击 ' + s.dmg + ' 装甲 ' + s.armor + '\n武器 ' + WEAPON_LABEL[s.weapon] + '·' + DMGTYPE_LABEL[s.dmgType] + '\n强化等级：攻击' + (lv.dmg || 0) + ' 生命' + (lv.hp || 0) + ' 攻速' + (lv.rate || 0) + ' 装甲' + (lv.armor || 0) + ' 射程' + (lv.range || 0) + (card.elite ? '\n状态：精锐' : '') + (card.equips && card.equips.length ? '\n装备：' + card.equips.map(function (e) { return e.name; }).join('、') : ''), null);
}

function useSpellFromHand(i) {
  const card = state.hand[i];
  if (!card || card.type !== 'spell') return;
  showConfirm('使用战术指令：' + card.sp.name, card.sp.desc + '\n确认使用？', function () {
    state.hand.splice(i, 1);
    castSpell(card.sp);
    renderPrep();
  });
}

function castSpell(sp) {
  const now = Date.now();
  if (sp.id === 'bomb') {
    let total = state.units.reduce(function (a, u) { return a + (u.alive ? u.dmg : 0); }, 0);
    state.enemies.forEach(function (e) { if (e.alive) e.hp -= total * 3; });
    pushNews('轨道打击：对敌方造成 ' + Math.round(total * 3) + ' 点伤害', 'good');
  } else if (sp.id === 'emp') {
    state.enemies.forEach(function (e) { e.empUntil = now + 3000; });
    pushNews('全域干扰：敌方停火3秒', 'good');
  } else if (sp.id === 'repair') {
    state.units.forEach(function (u) { if (u.alive) u.hp = Math.min(u.maxHp, u.hp + u.maxHp * 0.4); });
    pushNews('紧急修复：我方全体恢复40%生命', 'good');
  } else if (sp.id === 'reinforce') {
    const s = randomShipByLevel(0);
    state.hand.push({ ship: s, elite: false, equips: [], lv: {}, kills: 0, lastFireTime: 0 });
    pushNews('增援编队：获得舰船 ' + s.name, 'good');
    tryMergeShips();
  } else if (sp.id === 'freeze') {
    state.enemies.forEach(function (e) { e.frozenUntil = now + 3000; });
    pushNews('时间冻结：敌方停止移动3秒', 'good');
  } else if (sp.id === 'shield') {
    state.shield += 5;
    pushNews('护盾发生器：防御护盾+5', 'good');
  } else if (sp.id === 'corrode') {
    state.corrodeUntil = now + 5000;
    pushNews('纳米侵蚀：敌方每秒损失3%生命', 'good');
  } else if (sp.id === 'focus') {
    state.battleFocusMul = 1.3;
    pushNews('集火指令：本回合我方攻击力+30%', 'good');
  }
}

function tryMergeShips() {
  const groups = {};
  state.hand.forEach(function (card, i) {
    if (card.ship && !card.elite) {
      (groups[card.ship.id] = groups[card.ship.id] || []).push({ card: card, idx: i });
    }
  });
  for (const id in groups) {
    const arr = groups[id];
    while (arr.length >= state.mergeCount) {
      const three = arr.splice(0, state.mergeCount);
      const base = three[0].card;
      const equips = [];
      three.forEach(function (x) {
        if (x.card.equips) equips.push.apply(equips, x.card.equips);
        const gi = state.hand.indexOf(x.card);
        if (gi > -1) state.hand.splice(gi, 1);
      });
      const idx = state.hand.indexOf(base);
      if (idx > -1) state.hand.splice(idx, 1);
      state.hand.push({ ship: base.ship, elite: true, equips: [], lv: base.lv || {}, kills: 0, lastFireTime: 0 });
      state.permits++;
      if (state.mergeBonus) state.funds += state.mergeBonus;
      equips.forEach(function (eq) { state.hand.push({ type: 'equip', eq: eq, lv: eq.lv || 1 }); });
      pushNews('同名合成：' + base.ship.name + ' 晋升为精锐舰船', 'good');
    }
  }
}

function tryMergeEquips() {
  const groups = {};
  state.hand.forEach(function (card, i) {
    if (card.type === 'equip') {
      (groups[card.eq.id + '_' + card.lv] = groups[card.eq.id + '_' + card.lv] || []).push({ card: card, idx: i });
    }
  });
  for (const gid in groups) {
    const arr = groups[gid];
    while (arr.length >= 2) {
      if (countHand('equip') >= CONFIG.EQUIP_LIMIT) break;
      const two = arr.splice(0, 2);
      const baseEq = two[0].card.eq;
      const lv = baseEq.lv || 1;
      if (lv >= 3) break;
      two.forEach(function (x) {
        const gi = state.hand.indexOf(x.card);
        if (gi > -1) state.hand.splice(gi, 1);
      });
      state.hand.push({ type: 'equip', eq: Object.assign({}, baseEq, { lv: lv + 1 }), lv: lv + 1 });
      pushNews('装备合成：' + baseEq.name + ' 升级至 Lv.' + (lv + 1), 'good');
    }
  }
}

function showBlueModal() {
  const modal = document.getElementById('blueModal');
  const body = document.getElementById('blueBody');
  state.blueOpenedIn = state.phase === 'battle' ? 'settle' : state.phase;
  let html = '<div class="blue-head">强化点 ' + state.techPoints + ' | 编组 ' + state.hand.filter(function (c) { return c.ship; }).length + ' 艘</div>';
  html += '<div class="blue-list">';
  state.hand.forEach(function (card, i) {
    if (!card.ship) return;
    const s = card.ship;
    const lv = card.lv || {};
    html += '<div class="blue-item" data-i="' + i + '">';
    html += '<div class="bi-name' + ((card.spentTech || 0) >= 100 ? ' gold' : '') + '">' + s.name + (card.elite ? ' [精锐]' : '') + (card.spentTech >= 100 ? ' [金色]' : '') + '</div>';
    html += '<div class="bi-stats">HP ' + s.hp + ' 攻 ' + s.dmg + ' 甲 ' + s.armor + '</div>';
    html += '<div class="bi-lv">攻' + (lv.dmg || 0) + ' 命' + (lv.hp || 0) + ' 速' + (lv.rate || 0) + ' 甲' + (lv.armor || 0) + ' 程' + (lv.range || 0) + '</div>';
    html += '</div>';
  });
  html += '</div>';
  body.innerHTML = html;
  modal.classList.add('active');
  body.querySelectorAll('.blue-item').forEach(function (el) {
    el.addEventListener('click', function () {
      showShipUpgrade(parseInt(el.dataset.i, 10));
    });
  });
}

function showShipUpgrade(handIdx) {
  const card = state.hand[handIdx];
  if (!card || !card.ship) return;
  const s = card.ship;
  const lv = card.lv || {};
  const items = [
    { k: 'dmg', name: '攻击', base: s.dmg, pct: 0.1 },
    { k: 'hp', name: '生命', base: s.hp, pct: 0.1 },
    { k: 'rate', name: '攻速', base: s.rate, pct: 0.08 },
    { k: 'armor', name: '装甲', base: s.armor, pct: 0 },
    { k: 'range', name: '射程', base: s.range, pct: 0 }
  ];
  let html = '<div class="su-head' + ((card.spentTech || 0) >= 100 ? ' gold' : '') + '">' + s.name + (card.elite ? ' [精锐]' : '') + ' <em>累计强化 ' + (card.spentTech || 0) + '/100</em></div>';
  html += '<div class="su-points">强化点 ' + state.techPoints + '</div>';
  items.forEach(function (it) {
    const cur = lv[it.k] || 0;
    const cost = cur + 1;
    html += '<div class="su-row">';
    html += '<div class="su-info"><span class="su-name">' + it.name + '</span><span class="su-lv">Lv.' + cur + '</span><span class="su-val">' + (it.pct ? '+' + Math.round(cur * it.pct * 100) + '%' : '+' + Math.round(cur * 2)) + '</span></div>';
    html += '<div class="su-track"><div class="su-fill" style="width:' + Math.min(100, cur * 20) + '%"></div></div>';
    html += '<button class="btn-action tiny" data-up="' + it.k + '">升级 ' + cost + '点</button>';
    html += '</div>';
  });
  html += '<div class="su-back"><button class="btn-action" id="suBackBtn">返回列表</button></div>';
  const body = document.getElementById('blueBody');
  body.innerHTML = html;
  body.querySelectorAll('[data-up]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const k = btn.dataset.up;
      const cur = lv[k] || 0;
      const cost = cur + 1;
      if (state.techPoints < cost) { flashTip('强化点不足'); return; }
      state.techPoints -= cost;
    card.spentTech = (card.spentTech || 0) + cost;
      lv[k] = cur + 1;
      pushNews('强化完成：' + s.shortName + ' ' + k + ' +1', 'good');
      showShipUpgrade(handIdx);
    });
  });
  document.getElementById('suBackBtn').addEventListener('click', showBlueModal);
}

function rebuildUnits() {
  state.units = state.hand.map(function (card, i) {
    if (!card.ship) return null;
    const s = card.ship;
    let dmgMul = 1, hpMul = 1, rateMul = 1, armorBonus = 0, rangeBonus = 0, energyMul = 1, critBonus = 0;
    const enh = shipEnhanceBonus(s.name);
    dmgMul *= enh; hpMul *= enh;
    const lv = card.lv || {};
    dmgMul *= 1 + (lv.dmg || 0) * 0.1;
    hpMul *= 1 + (lv.hp || 0) * 0.1;
    rateMul *= 1 + (lv.rate || 0) * 0.08;
    armorBonus += (lv.armor || 0) * 2;
    rangeBonus += (lv.range || 0) * 0.4;
    if (card.elite) { dmgMul *= 1.4; hpMul *= 1.4; rateMul *= 1.2; armorBonus += 3; }
    const mo = modOffset(card);
    dmgMul *= mo.dmgMul; hpMul *= mo.hpMul; armorBonus += mo.armorBonus;
    (card.equips || []).forEach(function (eq) {
      if (eq.id === 'dmg') dmgMul *= 1.25;
      else if (eq.id === 'armor') armorBonus += 3;
      else if (eq.id === 'hp') hpMul *= 1.3;
      else if (eq.id === 'rate') rateMul *= 1.25;
      else if (eq.id === 'range') rangeBonus += 1;
      else if (eq.id === 'energy') energyMul *= 1.4;
      else if (eq.id === 'crit') critBonus += 0.15;
    });
    const waveScale = 1 + (state.wave - 1) * 0.04;
    const maxHp = Math.round(s.hp * hpMul * state.bonuses.hpMul * waveScale);
    const hasShield = s.dmgType === 'energy' || (card.equips || []).some(function (e) { return e.id === 'shield'; });
    return {
      cardIdx: i, id: 'my_' + i, name: s.name, shortName: s.shortName || s.name, cls: s.cls, row: s.row, repair: s.repair ? 1 : 0,
      maxHp: maxHp, hp: maxHp,
      shield: hasShield ? Math.round(maxHp * 0.2) + ((card.equips || []).filter(function (e) { return e.id === 'shield'; }).length ? 40 : 0) : 0,
      dmg: Math.round(s.dmg * dmgMul * state.bonuses.dmgMul * waveScale),
      armor: s.armor + armorBonus + state.bonuses.armorBonus,
      rate: s.rate * rateMul * state.bonuses.rateMul,
      range: s.range + rangeBonus + state.bonuses.rangeBonus,
      weapon: s.weapon, dmgType: s.dmgType, energyMul: energyMul, critBonus: critBonus,
      elite: card.elite, alive: true, kills: 0, lastFireTime: 0
    };
  }).filter(function (u) { return u; });
}

function spawnEnemyWave() {
  const lv = cityLevelOf(state.wave);
  const config = (window.CITY_DEFENSE || {})[lv] || [];
  const scale = 1 + (state.wave - 1) * 0.05;
  const units = [];
  config.forEach(function (e) { for (let k = 0; k < e.count; k++) units.push(e); });
  const seg = Math.max(1, Math.ceil(units.length / 4));
  state.enemies = units.map(function (e, i) {
    const grp = Math.min(3, Math.floor(i / seg));
    const zone = e.cls === 'cruiser' ? 'mid' : (e.cls === 'destroyer' || e.cls === 'frigate' || e.cls === 'corvette' ? 'front' : 'back');
    return {
      id: 'en_' + i, name: e.zh, shortName: e.zh, cls: e.cls,
      zone: zone, count: 1, group: grp, factionIdx: grp < 2 ? 0 : 1,
      maxHp: Math.round(e.hp * scale), hp: Math.round(e.hp * scale),
      dmg: Math.round(e.atk * scale), armor: Math.round(e.armor * scale), shield: Math.round(e.shield * scale),
      dmgType: e.dmgType, weapon: e.weapon, tier: e.tier, repair: e.repair ? 1 : 0,
      alive: true, lastFireTime: 0, empUntil: 0, frozenUntil: 0
    };
  });
  pushNews('敌方舰队抵达：' + lv + ' 级城防，' + state.enemies.length + ' 艘敌舰（势力1两组 / 势力2两组，强度 ' + scale.toFixed(2) + '）', 'warn');
}
function startBattle() {
  if (state.phase !== 'prep') return;
  if (!state.hand.some(function (c) { return c.ship; })) { flashTip('编组中没有舰船'); return; }
  state.phase = 'battle';
  state.repairUntil = Date.now() + 2500;
  if (!state.poolFrozen) state.pool = [];
  else { state.poolFrozen = false; state.pool.forEach(function (p) { p.frozen = false; }); }
  const spells = state.hand.filter(function (c) { return c.type === 'spell'; });
  state.hand = state.hand.filter(function (c) { return c.type !== 'spell'; });
  spells.forEach(function (c) { castSpell(c.sp); });
  rebuildUnits();
  spawnEnemyWave();
  clockLeft = CONFIG.ROUND_CLOCK;
  overtime = 0;
  toxicActive = false;
  state.battleFocusMul = 1;
  state.attackEvents = [];
  state.breakthroughUntil = Date.now() + 30000;
  state.roundLifeLost = 0;
  renderBattle();
  startEntranceSequence();
}
function startEntranceSequence() {
  const W = window.innerWidth || 1280;
  const H = window.innerHeight || 800;
  const positions = state.enemies.map(function (e) {
    const el = document.getElementById(e.id);
    if (el && el.getBoundingClientRect) {
      const r = el.getBoundingClientRect();
      return { id: e.id, grp: e.group, x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }
    return { id: e.id, grp: e.group, x: W * 0.6 + Math.random() * W * 0.3, y: H * 0.15 + Math.random() * H * 0.6 };
  });
  warpPlayEntrance(positions, function () {
    state.enemies.forEach(function (e) { e.entered = true; });
    renderBattle();
    pushNews('敌方舰队跃迁完成，战斗开始', 'warn');
    startBattleLoop();
  });
}

function startBattleLoop() {
  stopBattleLoop();
  let last = Date.now();
  battleTimer = setInterval(function () {
    const now = Date.now();
    const dt = Math.min(0.25, (now - last) / 1000);
    last = now;
    gameTick(now, dt);
  }, 100);
  uiTimer = setInterval(function () { updateBattleUI(); }, 150);
}
function stopBattleLoop() {
  if (battleTimer) { clearInterval(battleTimer); battleTimer = null; }
  if (uiTimer) { clearInterval(uiTimer); uiTimer = null; }
}

function repairTick(now) {
  if (!state.repairUntil || now < state.repairUntil) return;
  state.repairUntil = now + 2500;
  healSide(state.units, false);
  healSide(state.enemies, true);
}
function healSide(list, isEnemy) {
  const healers = list.filter(function (u) { return u.alive && u.repair; });
  if (!healers.length) return;
  const targets = list.filter(function (u) { return u.alive && u.hp < u.maxHp; });
  if (!targets.length) return;
  healers.forEach(function (h) {
    let target = targets[0];
    for (let i = 1; i < targets.length; i++) {
      if (targets[i].hp / targets[i].maxHp < target.hp / target.maxHp) target = targets[i];
    }
    const heal = Math.max(1, Math.round(h.dmg * 1.25));
    target.hp = Math.min(target.maxHp, target.hp + heal);
    const el = document.getElementById(target.id);
    if (el) spawnDamagePop(el, heal, false, isEnemy, true);
  });
}
function gameTick(now, dt) {
  if (state.phase !== 'battle') return;
  clockLeft -= dt;
  if (clockLeft <= 0 && !toxicActive) { toxicActive = true; pushNews('战场即将恶化：毒雾开始蔓延', 'warn'); }
  if (toxicActive) overtime += dt;
  if (toxicActive) {
    const pct = Math.min(0.08, 0.03 + 0.0005 * overtime);
    state.units.forEach(function (u) { if (u.alive) u.hp -= u.maxHp * pct * dt; });
    state.enemies.forEach(function (e) { if (e.alive) e.hp -= e.maxHp * pct * dt; });
  }
  if (state.corrodeUntil && now < state.corrodeUntil) {
    state.enemies.forEach(function (e) { if (e.alive) e.hp -= e.maxHp * 0.03 * dt; });
  }
  repairTick(now);
  myAttack(now);
  enemyAttack(now);
  if (state.breakthroughUntil && now > state.breakthroughUntil) {
    state.breakthroughUntil = now + 5000;
    const dmg = Math.round(state.enemies.reduce(function (s, e) { return s + (e.alive ? e.dmg : 0); }, 0) * 0.2);
    if (dmg > 0) {
      state.shield = Math.max(0, state.shield - dmg);
      pushNews('敌方突破防线，防御护盾 -' + dmg + '（剩余护盾 ' + Math.round(state.shield) + '）', '');
    }
  }
  for (let i = state.units.length - 1; i >= 0; i--) {
    const u = state.units[i];
    if (u.alive && u.hp <= 0) {
      u.alive = false; u.hp = 0;
      const cost = CONFIG.DEATH_COST[u.cls] || 2;
      state.life -= cost;
      pushNews(u.shortName + ' 被击毁（我方生命 -' + cost + '）', 'bad');
    }
  }
  for (let i = state.enemies.length - 1; i >= 0; i--) {
    const e = state.enemies[i];
    if (e.alive && e.hp <= 0) {
      e.alive = false; e.hp = 0;
      state.totalKills++;
      state.roundKills++;
      const tp = Math.max(2, e.tier * 2);
      state.techPoints += tp;
      const cost = CONFIG.DEATH_COST[e.cls] || 2;
      let fDmg = Math.round(cost * e.count * 1.5);
      const take0 = Math.min(state.factionHp[0], fDmg);
      state.factionHp[0] -= take0;
      fDmg -= take0;
      if (fDmg > 0) {
        if (state.wave < CONFIG.TOTAL_ROUNDS) state.factionHp[1] = Math.max(100, state.factionHp[1] - fDmg);
        else state.factionHp[1] = Math.max(0, state.factionHp[1] - fDmg);
      }
      pushNews('击毁敌方编队：' + e.shortName + '（势力1生命 -' + take0 + (fDmg > 0 ? '，势力2生命 -' + fDmg : '') + '，强化点 +' + tp + '）', 'good');
    }
  }
  const myAlive = state.units.some(function (u) { return u.alive; });
  const enAlive = state.enemies.some(function (e) { return e.alive; });
  if (!enAlive) { settleRound(true); return; }
  if (!myAlive) { settleRound(false); return; }
  if (state.life <= 0) { state.life = 0; endGame(false); }
}

function myAttack(now) {
  state.units.forEach(function (u) {
    if (!u.alive) return;
    const interval = 1000 / u.rate;
    if (now - (u.lastFireTime || 0) < interval) return;
    const target = acquireTarget(u, state.enemies);
    if (!target) return;
    u.lastFireTime = now;
    if (Math.random() > 0.8) return;
    let dmg = u.dmg * state.enhanceMul * (state.battleFocusMul || 1);
    if (u.dmgType === 'energy') dmg *= u.energyMul * state.bonuses.energyMul;
    if (u.weapon === 'direct') dmg *= state.bonuses.directMul;
    if (u.weapon === 'projectile') dmg *= state.bonuses.projMul;
    if (u.weapon === 'air') dmg *= state.bonuses.airMul;
    if (state.swift && u.dmg === getMaxMyDmg()) dmg *= 1.7;
    const isCrit = Math.random() < (state.bonuses.critChance + u.critBonus);
    if (isCrit) dmg *= 1.5;
    const dealt = calcDamage(dmg, u.dmgType, target, u.weapon);
    target.hp -= dealt;
    state.attackEvents.push({ from: u.shortName, to: target.shortName, dmg: dealt, isCrit: isCrit, isEnemy: false });
    if (state.attackEvents.length > 40) state.attackEvents.shift();
  });
}

function enemyAttack(now) {
  state.enemies.forEach(function (e) {
    if (!e.alive) return;
    if (e.empUntil && now < e.empUntil) return;
    if (e.frozenUntil && now < e.frozenUntil) return;
    const interval = 1250;
    if (now - (e.lastFireTime || 0) < interval) return;
    const target = acquireTarget(e, state.units.filter(function (u) { return u.alive; }));
    if (!target) return;
    e.lastFireTime = now;
    if (Math.random() > 0.75) return;
    let dmg = e.dmg * state.enemyDmgMul;
    const isCrit = Math.random() < 0.05;
    if (isCrit) dmg *= 1.5;
    const dealt = calcDamage(dmg, e.dmgType, target, e.weapon);
    target.hp -= dealt;
    if (target.hp <= 0) target.hp = 0;
    state.attackEvents.push({ from: e.shortName, to: target.shortName, dmg: dealt, isCrit: isCrit, isEnemy: true });
    if (state.attackEvents.length > 40) state.attackEvents.shift();
  });
}

function getMaxMyDmg() {
  return state.units.reduce(function (m, u) { return u.alive ? Math.max(m, u.dmg) : m; }, 0);
}

function acquireTarget(attacker, candidates) {
  const list = candidates.filter(function (c) { return c.alive; });
  if (!list.length) return null;
  if (attacker.weapon === 'air') {
    const air = list.filter(function (c) { return c.cls === 'fighter' || c.cls === 'corvette'; });
    return (air.length ? air : list)[0];
  }
  if (attacker.weapon === 'projectile') {
    for (const seq of LOCK_SEQUENCE) {
      const found = list.filter(function (c) { return c.cls === seq.cls; });
      if (found.length) return found[0];
    }
    return list[0];
  }
  return list.sort(function (a, b) { return a.hp - b.hp; })[0];
}

function calcDamage(dmg, dmgType, target, weapon) {
  if (target.cls === 'fighter' || target.cls === 'corvette') {
    if (weapon !== 'air') return 0;
  }
  if (dmgType === 'energy') {
    if (target.shield > 0) {
      const absorbed = Math.min(target.shield, dmg);
      target.shield -= absorbed;
      return Math.max(1, dmg - absorbed);
    }
    return dmg;
  }
  return Math.max(1, dmg - target.armor);
}

function settleRound(win) {
  if (state.phase !== 'battle') return;
  state.phase = 'settle';
  stopBattleLoop();
  const fog = document.getElementById('toxicFog');
  if (fog) fog.remove();
  if (state.recycle && state.roundKills >= 30) {
    const bonus = 2 + Math.floor(Math.random() * 2);
    state.funds += bonus;
    pushNews('战利品回收：奖励 ' + bonus + ' 资金', 'good');
  }
  if (win) {
    pushNews('本回合战斗胜利：敌方舰队已被全歼', 'good');
  } else {
    pushNews('我方舰队全灭，防线告急', 'bad');
  }
  if (state.factionHp.every(function (h) { return h <= 0; })) { endGame(true); return; }
  if (state.life <= 0) { state.life = 0; endGame(false); return; }
  state.wave++;
  if (state.wave > CONFIG.TOTAL_ROUNDS) {
    endGame(false);
    return;
  }
  renderPrep();
  state.blueOpenedIn = 'settle';
  setTimeout(function () { showBlueModal(); }, 500);
}

function calcAssault() {
  let total = 0;
  state.units.forEach(function (u) {
    if (!u.alive) return;
    total += u.dmg;
  });
  return Math.round(total * CONFIG.ASSAULT_FACTOR);
}

function eliteRandomShip() {
  const list = state.hand.filter(function (c) { return c.ship && !c.elite; });
  if (!list.length) return;
  const card = list[Math.floor(Math.random() * list.length)];
  card.elite = true;
  pushNews('精锐化协议：' + card.ship.name + ' 晋升为精锐', 'good');
}
function grantEquips() {
  for (let i = 0; i < 2; i++) {
    const eq = EQUIP_BLUEPRINTS[Math.floor(Math.random() * EQUIP_BLUEPRINTS.length)];
    state.hand.push({ type: 'equip', eq: eq, lv: 1 });
  }
  tryMergeEquips();
  pushNews('装备补给：获得 2 件装备', 'good');
}
function grantSpell() {
  const sp = SPELL_BLUEPRINTS[Math.floor(Math.random() * SPELL_BLUEPRINTS.length)];
  state.hand.push({ type: 'spell', sp: sp });
  pushNews('战术补给：获得 ' + sp.name, 'good');
}

function showUpgradeOptions() {
  const modal = document.getElementById('upgradeModal');
  const body = document.getElementById('upgradeOptions');
  const pool = UPGRADE_POOL.slice();
  const picks = [];
  while (picks.length < 3 && pool.length) {
    const i = Math.floor(Math.random() * pool.length);
    picks.push(pool.splice(i, 1)[0]);
  }
  let html = '<div class="up-tip">第 ' + state.wave + ' 回合强化（三选一）</div>';
  picks.forEach(function (p) {
    html += '<div class="up-card" data-name="' + p.name + '">';
    html += '<div class="up-name">' + p.name + '</div>';
    html += '<div class="up-desc">' + p.desc + '</div>';
    html += '</div>';
  });
  body.innerHTML = html;
  modal.classList.add('active');
  body.querySelectorAll('.up-card').forEach(function (el) {
    el.addEventListener('click', function () {
      const p = UPGRADE_POOL.find(function (x) { return x.name === el.dataset.name; });
      if (!p) return;
      upgradeTriggered[state.wave] = true;
      p.effect();
      modal.classList.remove('active');
      pushNews('回合强化：' + p.name, 'good');
      renderPrep();
    });
  });
}

function renderBattle() {
  const panel = document.getElementById('leftPanel');
  panel.dataset.mode = 'battle';
  let html = '<div class="game-header battle-layout">';
  html += renderTopStatus();
  html += renderNewsTicker();
  html += '<div class="battle-clock" id="battleClock">' + Math.ceil(clockLeft) + '</div>';
  html += '<div class="battle-view">';
  html += '<div class="fleet-panel left">';
  html += '<div class="fleet-title"><span class="ft-tag my">我</span>我方舰队 <span class="fp-cnt">' + state.units.filter(function (u) { return u.alive; }).length + '/' + state.units.length + '</span></div>';
  html += renderRows(state.units, 'my');
  html += '</div>';
  html += '<div class="battle-center">';
  html += '<div class="bc-info">城防等级 <b>' + cityLevelOf(state.wave) + '</b></div>';
  html += '<div class="bc-log" id="bcLog"></div>';
  html += '<div class="bc-hint">自动作战中 · 剩余时间 <span id="clockNum">' + Math.ceil(clockLeft) + '</span>s</div>';
  html += '</div>';
  html += '<div class="fleet-panel right">';
  html += '<div class="fleet-title"><span class="ft-tag en">敌</span>敌方舰队 <span class="fp-cnt">' + state.enemies.filter(function (e) { return e.alive; }).length + '/' + state.enemies.length + '</span></div>';
  html += renderRows(state.enemies, 'en');
  html += '</div>';
  html += '</div>';
  html += renderActionBar('battle');
  html += '</div>';
  panel.innerHTML = html;
}

function clsToRow(cls) {
  if (cls === 'frigate' || cls === 'destroyer' || cls === 'fighter' || cls === 'corvette') return 0;
  if (cls === 'cruiser' || cls === 'battlecruiser' || cls === 'battleship') return 1;
  return 2;
}
function renderRows(list, side) {
  const rows = [[], [], []];
  list.forEach(function (u) {
    let r;
    if (u.zone === 'front') r = 0;
    else if (u.zone === 'mid') r = 1;
    else if (u.zone === 'back') r = 2;
    else r = u.row !== undefined ? u.row : clsToRow(u.cls);
    rows[r].push(u);
  });
  const labels = ['前排', '中排', '后排'];
  let html = '<div class="fleet-rows">';
  rows.forEach(function (arr, i) {
    html += '<div class="fleet-row">';
    html += '<div class="row-label">' + labels[i] + '</div>';
    html += '<div class="row-cards">';
    if (!arr.length) html += '<div class="row-empty">—</div>';
    arr.forEach(function (u) { html += renderFleetCard(u, side); });
    html += '</div></div>';
  });
  html += '</div>';
  return html;
}

function renderFleetCard(u, side) {
  const pct = Math.max(0, u.hp / u.maxHp * 100);
  const shieldPct = u.shield > 0 ? Math.min(100, u.shield / Math.max(1, u.maxHp * 0.2) * 100) : 0;
  const dead = !u.alive;
  const icon = CLS_ICON[u.cls] || '◇';
  const color = CLS_COLOR[u.cls] || '#8fa3c8';
  const countTxt = (side === 'en' && u.count && u.count > 1) ? ' ×' + u.count : '';
  const warping = side === 'en' && u.entered === false;
  const grpTxt = (side === 'en' && u.group !== undefined) ? '<span class="grp-tag">势力' + (u.factionIdx + 1) + '·第' + ((u.group % 2) + 1) + '组</span>' : '';
  return '<div class="fleet-card' + (dead ? ' dead' : '') + (u.elite ? ' elite' : '') + (side === 'en' ? ' enemy' : '') + (warping ? ' warp-in' : '') + '" id="' + u.id + '" data-hp="' + Math.round(u.hp) + '">' +
    '<div class="fc-head"><span class="fc-icon" style="background:' + color + '26;border-color:' + color + ';">' + icon + '</span>' +
    '<div class="fc-id"><div class="fc-name">' + (warping ? '跃迁中…' : (u.shortName || u.name)) + '</div><div class="fc-cls" style="color:' + color + ';">' + (CLS_ZH[u.cls] || '') + countTxt + grpTxt + (u.repair ? ' <span class="fc-repair">维修</span>' : '') + '</div></div></div>' +
    '<div class="fc-bar"><div class="fc-hp"><div class="fill" style="width:' + pct + '%"></div></div>' +
    (u.shield > 0 ? '<div class="fc-shield"><div class="fill" style="width:' + shieldPct + '%"></div></div>' : '') + '</div>' +
    '<div class="fc-hpnum">' + Math.max(0, Math.round(u.hp)) + '/' + u.maxHp + '</div>' +
    '<div class="fc-mini">攻 ' + u.dmg + ' 甲 ' + u.armor + ' ' + WEAPON_LABEL[u.weapon] + '·' + DMGTYPE_LABEL[u.dmgType] + '</div>' +
    '<div class="dmg-pop-wrap"></div></div>';
}

function spawnDamagePop(el, amount, isCrit, isEnemy, isHeal) {
  const wrap = el.querySelector('.dmg-pop-wrap');
  if (!wrap) return;
  const div = document.createElement('div');
  div.className = 'dmg-pop' + (isCrit ? ' crit' : '') + (isEnemy ? ' from-enemy' : '') + (isHeal ? ' heal' : '');
  div.textContent = (isHeal ? '+' : '-') + Math.max(1, Math.round(amount));
  wrap.appendChild(div);
  setTimeout(function () { if (div.parentNode) div.parentNode.removeChild(div); }, 950);
}

function renderAtkLog() {
  const evs = (state.attackEvents || []).slice(-6);
  return evs.map(function (ev) {
    return '<div class="bc-line ' + (ev.isEnemy ? 'atk-en' : 'atk-my') + '">' + ev.from + ' <span class="atk-arrow">→</span> ' + ev.to + ' <span class="atk-dmg' + (ev.isCrit ? ' crit' : '') + '">-' + Math.max(1, Math.round(ev.dmg)) + '</span></div>';
  }).join('');
}

function updateBattleUI() {
  const panel = document.getElementById('leftPanel');
  if (!panel || state.phase !== 'battle') return;
  const clockEl = document.getElementById('battleClock');
  if (clockEl) {
    clockEl.textContent = toxicActive ? '+' + Math.floor(overtime) : Math.max(0, Math.ceil(clockLeft));
    clockEl.classList.toggle('warn', toxicActive);
  }
  const clockNum = document.getElementById('clockNum');
  if (clockNum) clockNum.textContent = toxicActive ? '+' + Math.floor(overtime) : Math.max(0, Math.ceil(clockLeft));
  state.units.forEach(function (u) {
    const el = document.getElementById(u.id);
    if (!el) return;
    const prev = parseInt(el.dataset.hp || '0', 10);
    if (u.alive && u.hp < prev && prev - u.hp > 0.4) spawnDamagePop(el, prev - u.hp, false, true);
    else if (u.alive && u.hp > prev && u.hp - prev > 0.4) spawnDamagePop(el, u.hp - prev, false, true, true);
    el.dataset.hp = Math.round(u.hp);
    const f = el.querySelector('.fc-hp .fill');
    if (f) f.style.width = Math.max(0, u.hp / u.maxHp * 100) + '%';
    const n = el.querySelector('.fc-hpnum');
    if (n) n.textContent = Math.max(0, Math.round(u.hp)) + '/' + u.maxHp;
    if (!u.alive) el.classList.add('dead');
    const sh = el.querySelector('.fc-shield .fill');
    if (sh) sh.style.width = Math.min(100, u.shield / Math.max(1, u.maxHp * 0.2) * 100) + '%';
  });
  state.enemies.forEach(function (e) {
    const el = document.getElementById(e.id);
    if (!el) return;
    const prev = parseInt(el.dataset.hp || '0', 10);
    if (e.alive && e.hp < prev && prev - e.hp > 0.4) spawnDamagePop(el, prev - e.hp, false, false);
    else if (e.alive && e.hp > prev && e.hp - prev > 0.4) spawnDamagePop(el, e.hp - prev, false, false, true);
    el.dataset.hp = Math.round(e.hp);
    const f = el.querySelector('.fc-hp .fill');
    if (f) f.style.width = Math.max(0, e.hp / e.maxHp * 100) + '%';
    const n = el.querySelector('.fc-hpnum');
    if (n) n.textContent = Math.max(0, Math.round(e.hp)) + '/' + e.maxHp;
    if (!e.alive) el.classList.add('dead');
    const sh = el.querySelector('.fc-shield .fill');
    if (sh) sh.style.width = Math.min(100, e.shield / Math.max(1, e.maxHp * 0.2) * 100) + '%';
  });
  const log = document.getElementById('bcLog');
  if (log) log.innerHTML = renderAtkLog();
  const statusEl = panel.querySelector('.top-status');
  if (statusEl) statusEl.outerHTML = renderTopStatus();
  let fog = document.getElementById('toxicFog');
  if (toxicActive && !fog) {
    fog = document.createElement('div');
    fog.id = 'toxicFog';
    fog.className = 'toxic-fog';
    document.body.appendChild(fog);
  }
  if (!toxicActive && fog) fog.remove();
}

function skipRound() {
  if (state.phase !== 'prep') { flashTip('当前无法跳过'); return; }
  state.phase = 'battle';
  state.shield = 0;
  state.enemies.forEach(function (e) { e.alive = false; });
  state.units.forEach(function (u) { u.alive = false; });
  settleRound(true);
}
function abortRun() {
  if (state.phase !== 'prep') { flashTip('战斗中无法放弃'); return; }
  showConfirm('放弃战斗', '放弃后本场模拟直接结束，不进入作战结算。确定放弃？', function () {
    state.phase = 'end';
    endGame(false);
  });
}

function endGame(victory) {
  if (state.phase === 'end') return;
  state.phase = 'end';
  stopBattleLoop();
  const fog = document.getElementById('toxicFog');
  if (fog) fog.remove();
  state.stats = state.stats || {};
  if (victory) {
    state.stats.wins = (state.stats.wins || 0) + 1;
    if (state.mode === 'beginner') state.progress.prototype = true;
    if (state.mode === 'prototype') state.progress.core = true;
    if (state.mode === 'core') state.progress.coreCleared = true;
  } else {
    state.stats.losses = (state.stats.losses || 0) + 1;
  }
  state.stats.kills = (state.stats.kills || 0) + state.totalKills;
  state.stats.bestWave = Math.max(state.stats.bestWave || 0, Math.min(state.wave, CONFIG.TOTAL_ROUNDS));
  saveProgress();
  saveStats();
  const modal = document.getElementById('resultModal');
  document.getElementById('resultTitle').textContent = victory ? '作战胜利' : '作战失败';
  const tp = Math.round((state.wave + state.totalKills) * 5 * CONFIG.MODES[state.mode].reward);
  let html = '<div class="rs-line">回合 ' + Math.min(state.wave, CONFIG.TOTAL_ROUNDS) + '/' + CONFIG.TOTAL_ROUNDS + '</div>';
  html += '<div class="rs-line">模式 ' + CONFIG.MODES[state.mode].name + '</div>';
  html += '<div class="rs-line">击毁编队 ' + state.totalKills + '</div>';
  html += '<div class="rs-line">敌方势力生命 ' + state.factionHp.map(function (h) { return Math.max(0, h); }).join(' / ') + '</div>';
  html += '<div class="rs-line">奖励技术点 ' + tp + ' · 比邻星币 ' + Math.round(tp * 2) + '</div>';
  html += '<div class="rs-actions"><button class="btn-action primary-btn" id="againBtn">再来一局</button><button class="btn-action" id="backBtn">返回主页</button></div>';
  document.getElementById('resultContent').innerHTML = html;
  modal.classList.add('active');
  document.getElementById('againBtn').addEventListener('click', function () {
    modal.classList.remove('active');
    state.hand = [];
    showModeSelect();
  });
  document.getElementById('backBtn').addEventListener('click', function () {
    modal.classList.remove('active');
    initGame();
  });
}

document.addEventListener('DOMContentLoaded', function () {
  initGame();
  document.getElementById('btnSolo').addEventListener('click', function () {
    if (state.phase === 'prep' || state.phase === 'battle') {
      showConfirm('开始新模拟', '当前存在进行中的对局，开始新模拟将放弃当前对局。确定继续？', function () {
        initGame();
        showModeSelect();
      });
    } else {
      initGame();
      showModeSelect();
    }
  });
  document.getElementById('btnMode').addEventListener('click', function () {
    showModal('协议模式', '<div class="supply-panel">' + Object.keys(CONFIG.MODES).map(function (k) {
      const m = CONFIG.MODES[k];
      return '<div class="sp-sec"><div class="sp-sec-title">' + m.name + '</div>' +
        '<div class="sp-row"><span>敌方势力生命</span><span class="v">各 ' + m.life + ' 点</span></div>' +
        '<div class="sp-row"><span>资金节奏</span><span class="v">' + (k === 'beginner' ? '第1回合5，第2回合13，之后每回合10' : '第1回合' + m.funds[0] + '，之后每回合+1，上限' + m.funds[2]) + '</span></div>' +
        '<div class="sp-row"><span>回合数</span><span class="v">固定15回合</span></div></div>';
    }).join('') + '</div>');
  });
  document.getElementById('btnSupply').addEventListener('click', function () {
    if (state.phase === 'prep' || state.phase === 'battle') {
      showModal('物资调配处', '<div class="supply-panel"><div class="sp-row"><span>当前状态</span><span class="v">模拟进行中，物资调配处已关闭</span></div></div>');
      return;
    }
    const st = state.stats || {};
    showModal('物资调配处', '<div class="supply-panel">' +
      '<div class="sp-sec"><div class="sp-sec-title">历史战绩（跨局累计）</div>' +
      '<div class="sp-row"><span>胜利 / 失败</span><span class="v">' + (st.wins || 0) + ' / ' + (st.losses || 0) + '</span></div>' +
      '<div class="sp-row"><span>累计击毁编队</span><span class="v">' + (st.kills || 0) + '</span></div>' +
      '<div class="sp-row"><span>最高回合</span><span class="v">' + (st.bestWave || 0) + '</span></div></div>' +
      '<div class="sp-sec"><div class="sp-sec-title">舰队强化联动</div>' +
      '<div class="sp-row"><span>全局加成</span><span class="v">+' + Math.round((computeEnhanceMul() - 1) * 100) + '%</span></div></div>' +
      '<div class="sp-sec"><div class="sp-sec-title">配队规则</div>' +
      '<div class="sp-row"><span>航空母舰</span><span class="v">最多2艘（可配置舰载机）</span></div>' +
      '<div class="sp-row"><span>战列巡洋舰</span><span class="v">最多2艘</span></div>' +
      '<div class="sp-row"><span>其余舰种</span><span class="v">各最多5艘</span></div>' +
      '<div class="sp-row"><span>战机 / 护航艇</span><span class="v">仅选择航母后可配置</span></div></div>' +
      '<div class="sp-actions"><button class="btn-action primary-btn" id="spDeployBtn">前往舰队配置</button></div></div>');
    document.getElementById('spDeployBtn').addEventListener('click', function () {
      document.getElementById('genericModal').classList.remove('active');
      showDeployModal();
    });
  });
  document.getElementById('btnBlueprint').addEventListener('click', function () {
    const pool = buildShipPool();
    const groups = {};
    for (const s of pool) (groups[s.cls] = groups[s.cls] || []).push(s);
    let html = '<div class="bp-list">';
    const order = ['carrier', 'battlecruiser', 'battleship', 'cruiser', 'destroyer', 'frigate', 'fighter', 'corvette', 'support'];
    order.forEach(function (cls) {
      const list = groups[cls] || [];
      if (!list.length) return;
      html += '<div class="bp-type-title">' + CLS_ZH[cls] + '（' + list.length + '）</div>';
      list.forEach(function (s) {
        html += '<div class="bp-item"><span class="bp-name">' + s.name + '</span><span class="bp-stats">HP ' + s.hp + ' 攻 ' + s.dmg + ' 甲 ' + s.armor + ' ' + WEAPON_LABEL[s.weapon] + DMGTYPE_LABEL[s.dmgType] + '</span></div>';
      });
    });
    html += '</div>';
    showModal('蓝图数据库（全部舰船 ' + pool.length + ' 艘）', html);
  });
  document.getElementById('btnStrategy').addEventListener('click', function () {
    showModal('防守策略', '<div class="supply-panel"><div class="sp-tip">开局随机 3 选 1，选定后不可更改</div>' + DEFENSE_STRATEGIES.map(function (s) {
      return '<div class="sp-sec"><div class="sp-sec-title">' + s.name + '（' + s.org + '）' + (strategyUnlocked(s) ? '' : ' [未解锁]') + '</div>' +
        '<div class="sp-row"><span>我方生命</span><span class="v">' + s.life + '</span></div>' +
        '<div class="sp-row"><span>效果</span><span class="v">' + s.desc + '</span></div></div>';
    }).join('') + '</div>');
  });
  document.getElementById('modalCloseBtn').addEventListener('click', function () {
    document.querySelectorAll('.modal').forEach(function (m) { m.classList.remove('active'); });
  });
  document.querySelectorAll('.modal').forEach(function (m) {
    m.addEventListener('click', function (e) {
      if (e.target === m) {
        m.classList.remove('active');
        if (m.id === 'blueModal' && state && state.blueOpenedIn === 'settle') {
          state.blueOpenedIn = null;
          startPrepRound();
        }
      }
    });
  });
  document.getElementById('confirmOk').addEventListener('click', function () {});
  document.getElementById('confirmCancel').addEventListener('click', function () {});
});

function warpInit() {
  let c = document.getElementById('warpCanvas');
  if (!c) { c = document.createElement('canvas'); c.id = 'warpCanvas'; document.body.appendChild(c); }
  const ctx = c.getContext('2d');
  let W = 0, H = 0;
  function resize() { W = c.width = window.innerWidth; H = c.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  let phase = 'off';
  let t = 0, flash = 0, shake = 0, speed = 8, charge = 0, autoSeq = 0;
  const shipP = [];
  const rings = [];
  const entrance = { list: [], idx: 0, timer: 0, done: null };
  let last = 0;
  function spawnShipParticles(item) {
    for (let i = 0; i < 14; i++) {
      const ang = Math.random() * 6.2832;
      const rad = Math.random() * 160;
      shipP.push({ bx: item.x, by: item.y, dx: Math.cos(ang) * rad, dy: Math.sin(ang) * rad, v: 90 + Math.random() * 140, life: 0.5 + Math.random() * 0.4, maxLife: 0.5 + Math.random() * 0.4 });
    }
  }
  function step(now) {
    requestAnimationFrame(step);
    if (!last) last = now;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    t += dt;
    if (phase === 'off') { c.style.display = 'none'; return; }
    c.style.display = 'block';
    if (autoSeq > 0) {
      autoSeq -= dt;
      if (phase === 'charge' && autoSeq <= 1.2) phase = 'warp';
      else if (phase === 'warp' && autoSeq <= 0.4) phase = 'exit';
      else if (phase === 'exit' && autoSeq <= 0) { phase = 'off'; flash = 0.85; }
    }
    if (phase === 'warp') { shake = Math.min(8, shake + 14 * dt); }
    else if (phase === 'exit') { shake = Math.max(0, shake - 20 * dt); }
    else if (phase === 'charge') { charge = Math.min(1, charge + 0.5 * dt); shake = Math.min(5, shake + 10 * dt); }
    else { charge = Math.max(0, charge - 0.3 * dt); shake = Math.max(0, shake - 6 * dt); }
    if (phase === 'entrance') {
      shake = Math.min(5, shake + 3 * dt);
      entrance.timer -= dt;
      if (entrance.timer <= 0) {
        entrance.timer = 0.3;
        for (let k = 0; k < 5 && entrance.idx < entrance.list.length; k++) {
          const it = entrance.list[entrance.idx];
          spawnShipParticles(it);
          rings.push({ x: it.x, y: it.y, r: 10, a: 0.85, grp: it.grp });
          entrance.idx++;
        }
        if (entrance.idx >= entrance.list.length) {
          phase = 'off';
          flash = 0.8;
          const cb = entrance.done;
          entrance.list = []; entrance.done = null;
          if (cb) setTimeout(cb, 350);
        }
      }
    }
    shake = Math.max(0, shake - 6 * dt);
    flash = Math.max(0, flash - 0.09 * dt * 60);
    const offX = Math.sin(t * 6.9) * shake;
    const offY = Math.cos(t * 5.7) * shake * 0.7;
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.translate(offX, offY);
    for (let i = shipP.length - 1; i >= 0; i--) {
      const p = shipP[i];
      p.life -= dt;
      if (p.life <= 0) { shipP.splice(i, 1); continue; }
      p.dx *= 0.985;
      p.dy *= 0.985;
      const prx = p.bx + p.dx;
      const pry = p.by + p.dy;
      const a = Math.max(0, p.life / p.maxLife);
      const dl = Math.max(1, Math.sqrt(p.dx * p.dx + p.dy * p.dy));
      const ux = p.dx / dl, uy = p.dy / dl;
      const len = Math.min(60, p.v * 0.8 * a);
      ctx.strokeStyle = 'rgba(150,220,255,' + (a * 0.95) + ')';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(prx, pry);
      ctx.lineTo(prx - ux * len, pry - uy * len);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,' + a + ')';
      ctx.beginPath();
      ctx.arc(prx, pry, 1.5, 0, 6.2832);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    for (let i = rings.length - 1; i >= 0; i--) {
      const r = rings[i];
      r.r += 360 * dt;
      r.a -= dt * 1.4;
      if (r.a <= 0) { rings.splice(i, 1); continue; }
      ctx.strokeStyle = 'rgba(140,210,255,' + r.a + ')';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.r, 0, 6.2832);
      ctx.stroke();
      ctx.fillStyle = 'rgba(120,190,255,' + r.a * 0.12 + ')';
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.r * 0.86, 0, 6.2832);
      ctx.fill();
    }
    const cx = W / 2 + offX, cy = H / 2 + offY;
    if (phase === 'charge') {
      const g2 = ctx.createRadialGradient(cx, cy, W * 0.1, cx, cy, Math.max(W, H) * 0.72);
      g2.addColorStop(0, 'rgba(0,0,0,0)');
      g2.addColorStop(1, 'rgba(80,40,200,' + (0.22 + charge * 0.3) + ')');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(120,90,255,' + (0.2 + charge * 0.3) + ')';
      ctx.lineWidth = 1;
      for (let y = 0; y < H; y += 3) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    }
    if (phase === 'warp' || phase === 'exit') {
      const rr = 26 + 8 * Math.sin(t * 5);
      ctx.strokeStyle = 'rgba(200,30,40,0.75)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, rr, 0, 6.2832);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(140,20,30,0.5)';
      for (let a = 0; a < 6; a++) {
        ctx.beginPath();
        ctx.arc(cx, cy, rr * (0.4 + a * 0.12), t * 1.5 + a * 1.05, t * 1.5 + a * 1.05 + 1.2);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(160,20,30,0.35)';
      ctx.beginPath();
      ctx.arc(cx, cy, rr * 0.5, 0, 6.2832);
      ctx.fill();
    }
    ctx.restore();
    if (flash > 0) {
      ctx.fillStyle = 'rgba(255,255,255,' + flash.toFixed(2) + ')';
      ctx.fillRect(0, 0, W, H);
    }
  }
  requestAnimationFrame(step);
  return {
    trigger: function (mode) {
      if (mode === 'manual') {
        if (phase === 'off' || phase === 'idle') { phase = 'charge'; charge = 0; speed = 8; autoSeq = 2.2; }
        else if (phase === 'charge') { phase = 'warp'; }
      }
    },
    entrancePlay: function (list, done) {
      entrance.list = list; entrance.idx = 0; entrance.timer = 0.15; entrance.done = done;
      phase = 'entrance'; shake = 0; speed = 60;
    }
  };
}
let warpFX = null;
function warpTrigger(mode) {
  if (!warpFX) { try { warpFX = warpInit(); } catch (e) { return; } }
  warpFX.trigger(mode || 'auto');
}
function warpPlayEntrance(list, done) {
  try {
    if (!warpFX) warpFX = warpInit();
  } catch (e) { if (done) done(); return; }
  const f = warpFX;
  if (f.entrancePlay) { f.entrancePlay(list, done); return; }
  warpInitEntranceFallback(list, done);
}
function warpInitEntranceFallback(list, done) {
  let idx = 0;
  function nextBatch() {
    for (let k = 0; k < 5 && idx < list.length; k++) idx++;
    if (idx >= list.length) { setTimeout(done, 2200); return; }
    setTimeout(nextBatch, 60);
  }
  nextBatch();
}
window.addEventListener('keydown', function (e) {
  if (e.code === 'Space') { e.preventDefault(); warpTrigger('manual'); }
});
