const CLS_ZH = {frigate:'护卫舰', destroyer:'驱逐舰', cruiser:'巡洋舰', battlecruiser:'战列巡洋舰', battleship:'战列舰', carrier:'航空母舰', fighter:'战机', corvette:'护航艇', support:'支援舰'};
const CLS_ICON = {frigate:'护', destroyer:'驱', cruiser:'巡', battlecruiser:'战', battleship:'列', carrier:'航', fighter:'机', corvette:'艇', support:'援'};
const CLS_COLOR = {frigate:'#7fd4ff', destroyer:'#9be89b', cruiser:'#ffd27f', battlecruiser:'#ff9a8a', battleship:'#ff7fa8', carrier:'#c9a5ff', fighter:'#8affd9', corvette:'#ffe27f', support:'#a5c9ff'};
const WEAPON_LABEL = {direct:'直射', projectile:'投射', air:'防空'};
const DMGTYPE_LABEL = {physical:'实弹', energy:'能量'};
const LOCK_SEQUENCE = [{cls:'carrier'}, {cls:'battlecruiser'}, {cls:'cruiser'}, {cls:'destroyer'}, {cls:'frigate'}, {cls:'support'}, {cls:'fighter'}, {cls:'corvette'}];

const CONFIG = {
  TOTAL_ROUNDS: 15,
  ROUND_CLOCK: 120,
  BREACH_CAP: 60,
  // HAND_LIMIT: 手牌舰船上限已取消（对局中购买舰船不限数量），保留定义供参考
  HAND_LIMIT: 24,
  EQUIP_LIMIT: 12,
  SPELL_LIMIT: 8,
  DEATH_COST: {fighter: 1, corvette: 1, frigate: 2, destroyer: 3, cruiser: 4, support: 4, battlecruiser: 5, battleship: 6, carrier: 7},
  ASSAULT_FACTOR: 0.06,
  // DEPLOY_LIMIT: 舰种数量上限已取消；配队与对局中购买统一受指挥值 400 上限约束，保留定义供参考
  DEPLOY_LIMIT: {carrier: 2, battlecruiser: 2, battleship: 2, cruiser: 5, destroyer: 5, frigate: 5, fighter: 5, corvette: 5, support: 5},
  MODES: {
    // funds = [第1波, 每波增量, 单波上限]，fundsOfRound = min(上限, m0 + (波-1)*m1)。
    // 15 波累计：入门 615 / 原型 480 / 核心 420。
    // 原值累计 5850~8250，但去处只有驳船 132 + 装备 36 + 战术 32（约 200），
    // 加上 400 指挥值封顶后的补舰余量也不到 500 —— 94% 的钱花不出去。
    // enemyPow = 敌方标定难度系数。原来三档只改初始生命与资金，
    // 敌方强度一个数都没动，「选核心更难」基本不成立。
    beginner: {name: '入门协议', life: 500, funds: [20, 3, 9999], reward: 1, enemyPow: 0.8},
    prototype: {name: '原型协议', life: 700, funds: [18, 2, 9999], reward: 1.5, enemyPow: 1},
    core: {name: '核心协议', life: 1000, funds: [14, 2, 9999], reward: 2, enemyPow: 1.25}
  },
  BARGE: [
    {slots: 1, equipSlots: 0, shield: 1, cost: 2},
    {slots: 2, equipSlots: 1, shield: 1, cost: 4},
    {slots: 4, equipSlots: 1, shield: 2, cost: 6},
    {slots: 5, equipSlots: 2, shield: 2, cost: 9},
    {slots: 5, equipSlots: 2, shield: 3, cost: 12},
    {slots: 5, equipSlots: 2, shield: 3, cost: 99}
  ],
  UPGRADE_ROUNDS: [3, 6, 10, 12, 14],
  // ---------- 借自《无尽的拉格朗日》战斗表现层 ----------
  // 那边客户端不做伤害计算（服务器下发 after_hp / base_hit_damage /
  // critical_hit_extra_damage / hit_damage_count / miss_damage_count），
  // 只负责把它们变成「命中/未命中表现 + 弹字」。这里借用同样的表现层结构。
  // 一轮攻击拆成多段命中，逐段飘字；暴击伤害单独飘一次（base + extra）。
  HIT_SEGMENTS: 3,          // 每次攻击的命中段数
  CRIT_EXTRA_RATIO: 0.5,    // 暴击额外伤害 = 基础伤害 × 该系数（原为直接 ×1.5）
  MISS_LOG_CHANCE: 0.12     // 未命中在战报里留痕的概率（未命中无飘字，纯战报提示）
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
  {id: 'freeze', name: '时间冻结', cost: 5, desc: '敌方全体停火5秒（冻结时长更长）'},
  {id: 'shield', name: '护盾发生器', cost: 3, desc: '本回合我方防御护盾+5'},
  {id: 'corrode', name: '纳米侵蚀', cost: 5, desc: '敌方每秒损失3%生命，持续5秒'},
  {id: 'focus', name: '集火指令', cost: 3, desc: '本回合我方全体攻击力+30%'}
];

const DEFENSE_STRATEGIES = [
  {id: 'aegis', name: '全域防御', org: '联合防御阵列', life: 1000, unlock: 0, desc: '我方生命值提高，所有舰船攻击、装甲、生命+15%；入门协议中敌方攻击与生命-30%', effect: function () { state.life = 1000; state.maxLife = 1000; state.bonuses.dmgMul *= 1.15; state.bonuses.armorMul *= 1.15; if (state.mode === 'beginner') { state.enemyDmgMul *= 0.7; state.enemyHpMul *= 0.7; } }},
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
function saveStats() { localStorage.setItem(STATS_KEY, JSON.stringify(state.stats)); sbSyncStats(); }
function sbReady() { return !!(window.DB && window.UEG_CONFIG && window.UEG_CONFIG.supabase); }
function sbUser() { try { const u = JSON.parse(localStorage.getItem('ueg_current_user') || 'null'); return u && u.username ? u.username : ''; } catch (e) { return ''; } }
function sbGet(path) { if (!sbReady()) return Promise.resolve({ code: 500 }); return window.DB.rest(path, { method: 'GET' }); }
function sbWrite(path, method, body) { if (!sbReady()) return Promise.resolve({ code: 500 }); const o = { method: method, body: body }; if (method === 'PATCH' || method === 'POST') o.prefer = 'return=representation'; return window.DB.rest(path, o); }
/* 云存档写入：POST + on_conflict=username 的 upsert。
   原实现用 PATCH 只能更新「已存在」的行，新用户永远写不进去（静默失败）；
   改为 upsert 后首次写入也会自动建行。依赖 weishu_data 表（见 supabase_setup.sql）。 */
function sbUpsertWeishu(patch) {
  const u = sbUser();
  if (!u || !sbReady()) return Promise.resolve({ code: 500 });
  const row = Object.assign({ username: u, updated_at: new Date().toISOString() }, patch);
  return window.DB.rest('/rest/v1/weishu_data?on_conflict=username', {
    method: 'POST',
    prefer: 'resolution=merge-duplicates,return=representation',
    body: row
  });
}
function sbSyncFleet() {
  const u = sbUser(); if (!u) return;
  const byId = {};
  state.hand.forEach(function (c) { if (!c.ship) return; if (!byId[c.ship.id]) byId[c.ship.id] = { id: c.ship.id, count: 0, mod: c.mod || '' }; byId[c.ship.id].count++; });
  const list = [];
  for (const k in byId) list.push(byId[k]);
  sbUpsertWeishu({ fleet_json: JSON.stringify(list) }).catch(function () {});
}
function sbSyncStats() {
  const u = sbUser(); if (!u) return;
  sbUpsertWeishu({ stats_json: JSON.stringify(state.stats || {}) }).catch(function () {});
}
function sbPull() {
  const u = sbUser(); if (!u) return;
  sbGet('/rest/v1/weishu_data?username=eq.' + encodeURIComponent(u) + '&select=fleet_json,stats_json').then(function (r) {
    if (r.code === 200 && Array.isArray(r.data) && r.data[0]) {
      if (r.data[0].fleet_json) { try { localStorage.setItem('ueg_weishu_fleet', r.data[0].fleet_json); } catch (e) {} }
      if (r.data[0].stats_json) { try { const st = JSON.parse(r.data[0].stats_json); localStorage.setItem(STATS_KEY, JSON.stringify(st)); } catch (e) {} }
    }
  }).catch(function () {});
}

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
}
function showConfirm(title, body, cb, cancelCb) {
  document.getElementById('confirmTitle').textContent = title;
  document.getElementById('confirmBody').textContent = body;
  document.getElementById('confirmModal').classList.add('active');
  document.getElementById('confirmOk').onclick = function () {
    document.getElementById('confirmModal').classList.remove('active');
    if (cb) cb();
  };
  document.getElementById('confirmCancel').onclick = function () {
    document.getElementById('confirmModal').classList.remove('active');
    if (cancelCb) cancelCb();
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
    const st = JSON.parse(localStorage.getItem('ueg_tree_lv') || '{}');
    let total = 0;
    for (const k in st) for (const s in st[k]) for (const t in st[k][s]) total += st[k][s][t] || 0;
    return 1 + Math.min(0.5, total * 0.001);
  } catch (e) { return 1; }
}
function commonPrefixLen(x, y) {
  let i = 0;
  const n = Math.min(x.length, y.length);
  while (i < n && x[i] === y[i]) i++;
  return i;
}
function shipEnhanceBonus(shipName) {
  try {
    const st = JSON.parse(localStorage.getItem('ueg_tree_lv') || '{}');
    const a = shipName.replace(/[·\- ]/g, '');
    let lv = 0;
    for (const k in st) {
      const b = k.replace(/[·\- ]/g, '');
      const match = a === b || (a.length >= 4 && b.length >= 4 && commonPrefixLen(a, b) >= Math.max(4, Math.min(a.length, b.length) / 2));
      if (match) for (const s in st[k]) for (const t in st[k][s]) lv += st[k][s][t] || 0;
    }
    return 1 + Math.min(0.4, lv * 0.004);
  } catch (e) { return 1; }
}

function initGame() {
  state = {
    phase: 'welcome', mode: 'beginner', strategy: null,
    factions: [], factionHp: [], factionMaxHp: [],
    life: 1000, maxLife: 1000, funds: 0, techPoints: 0, pendingHp: null, paused: false,
    wave: 1, bargeLevel: 1, upgradeDiscount: 0, shield: 1,
    finalRound: { active: false, wave: 0, intermission: false, timer: 0, fortress: null, lockPrompted: false, fortressAoEDone: false },
    pool: [], poolFrozen: false, hand: [], units: [], enemies: [],
    bonuses: { dmgMul: 1, hpMul: 1, rateMul: 1, armorBonus: 0, armorMul: 1, rangeBonus: 0, directMul: 1, projMul: 1, airMul: 1, shieldBonus: 0, critChance: 0, energyMul: 1 },
    enhanceMul: 1, enemyDmgMul: 1,
    swift: false, recycle: false, gacha: false, intel: false, spellStrategy: false,
    mergeCount: 3, mergeBonus: 0, craft: false,
    totalKills: 0, roundKills: 0, roundLifeLost: 0, spentFunds: 0, permits: 0,
    attackEvents: [], pendingPop: {}, breakthroughUntil: 0,
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
      html += '<div class="mode-row"><span>资金节奏</span><b>' + (m.funds[2] >= 9999 ? '第1回合' + m.funds[0] + '，之后每回合+' + m.funds[1] + '，无上限' : '第1回合' + m.funds[0] + '，之后每回合+' + m.funds[1] + '，上限' + m.funds[2]) + '</b></div>';
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
    if (c.ship && c.ship.carry) {
      const mul = modOffset(c).carry ? 1.5 : 1;
      a.f += Math.round(c.ship.carry.fighter * mul);
      a.c += Math.round(c.ship.carry.corvette * mul);
    }
    return a;
  }, { f: 0, c: 0 });
}
function selectedAirCount() {
  return state.hand.reduce(function (a, c) {
    if (c.ship && (c.ship.cls === 'fighter' || c.ship.cls === 'corvette')) a++;
    return a;
  }, 0);
}
function selectedFighterCount() {
  return state.hand.reduce(function (a, c) { return a + (c.ship && c.ship.cls === 'fighter' ? 1 : 0); }, 0);
}
function selectedCorvetteCount() {
  return state.hand.reduce(function (a, c) { return a + (c.ship && c.ship.cls === 'corvette' ? 1 : 0); }, 0);
}

function countOfId(id) {
  return state.hand.reduce(function (a, c) { return a + (c.ship && c.ship.id === id ? 1 : 0); }, 0);
}
function totalCommand() {
  return state.hand.reduce(function (a, c) { return a + (c.ship && c.ship.cls !== 'fighter' && c.ship.cls !== 'corvette' ? c.ship.command : 0); }, 0);
}
// 舰载机不占指挥值（与 totalCommand 同口径），否则补舰时会被误拦。
function shipCommandCost(s) {
  return (!s || s.cls === 'fighter' || s.cls === 'corvette') ? 0 : (s.command || 0);
}
// 对局中加舰的统一闸门。
// 此前 400 上限只在初始配队（deployModal）里硬拦，补给池买舰、军火商人赠舰、
// 驳船升级赠舰、增援编队四个口子都能把编组推过上限；配合当时近乎无限的资金
//（15 波累计 5850~8250、舰船单价 10），实测可把编组堆到几百艘。
// 静默模式（quiet）给后台白送舰用，避免一次购买刷一排提示。
function canAcquireShip(s, quiet) {
  const cost = shipCommandCost(s);
  if (totalCommand() + cost > 400) {
    if (!quiet) flashTip('指挥值不足（' + totalCommand() + '+' + cost + '>400）');
    return false;
  }
  return true;
}
// ==================== 联机：舰队编组序列化与合并 ====================
// 联机局里房主要把各人的 hand 合并成一支联合舰队。三件事必须跟着走，
// 否则合并出来的舰会比单人局的弱：
//   1. lv（逐项强化等级）—— 影响 dmg/hp/rate/armor/range 五项倍率
//   2. eq（装备 id 列表）—— 影响同上，另有 shield 决定有无护盾
//   3. mod（模块）—— modOffset 决定火力/装甲/维修倾向
//   4. en（强化页加成）—— shipEnhanceBonus 读的是本机 ueg_tree_lv，
//      房主拿不到队友的强化进度，所以必须在各自浏览器上先算好再上报。
//
// 诚实说明信任边界：en 由客户端上报，房主无法核验（强化进度存在本地
// localStorage，库里没有）。它只影响自己那只舰的强度，不是竞争性数据。
function packFleet() {
  const ships = [];
  let cmds = 0;
  state.hand.forEach(function (c) {
    if (!c.ship) return;
    const cmd = (c.ship.cls !== 'fighter' && c.ship.cls !== 'corvette') ? (c.ship.command || 0) : 0;
    cmds += cmd;
    ships.push({
      sid: c.ship.id,
      lv: c.lv || {},
      el: !!c.elite,
      eq: (c.equips || []).map(function (e) { return e.id; }),
      md: c.mod || '',
      en: shipEnhanceBonus(c.ship.name),
      cm: cmd
    });
  });
  return { by: sbUser(), cm: cmds, sh: ships, ready: true };
}

// 房主合并：把各席位上报的编组装进 state.hand。
// 指挥值共享 400 上限（与单人局一致）—— 4 人各 400 会让舰队涨到 200 艘，
// 而敌人强度是按单人量定的，会变成平推。
// 超出上限时按「房主自己的舰优先、其次按加入时间」截断，
// 保证房主的编组不会被队友挤掉。
function coopMergeFleets(seats) {
  const CAP = 400;
  // 先排序：房主第一，其余按加入时间
  const ordered = seats.slice().sort(function (a, b) {
    const me = sbUser();
    if (a.username === me && b.username !== me) return -1;
    if (b.username === me && a.username !== me) return 1;
    return String(a.joined_at || '').localeCompare(String(b.joined_at || ''));
  });
  const shipById = {};
  (window.PLAYER_SHIPS || []).forEach(function (s) { shipById[s.id] = s; });

  const merged = [];
  const owners = {};
  let used = 0;
  let dropped = 0;

  ordered.forEach(function (seat) {
    const fleet = seat.fleet;
    if (!fleet || !fleet.sh || !fleet.sh.length) return;
    // p<N> 前缀里的 N 是该玩家在本局的稳定序号（席位顺序），
    // 供接收端区分来源，也用于卡面色条。
    const tag = seatTag(seat.username);
    (fleet.sh || []).forEach(function (rec) {
      const s = shipById[rec.sid];
      if (!s) return;
      const cmd = rec.cm || 0;
      if (used + cmd > CAP) { dropped++; return; }
      used += cmd;
      const idx = merged.length;
      merged.push({
        ship: s,
        // 带 owner，rebuildUnits 用它生成带前缀的 id
        owner: seat.username,
        tag: tag,
        elite: !!rec.el,
        equips: (rec.eq || []).map(function (id) { return { id: id }; }),
        lv: rec.lv || {},
        // en 是上报方算好的强化加成，直接用，不在本机重算。
        // 例外：自己的编组本地就能算细粒度加成，留给 rebuildUnits 走 ENHANCE_ATTRS，
        // 否则房主自己的舰也会退回单标量，与单人局口径不一致。
        enhOverride: (seat.username !== sbUser() && typeof rec.en === 'number') ? rec.en : null,
        mod: rec.md || '',
        kills: 0, lastFireTime: 0, spentTech: 0
      });
      owners[tag] = seat.username;
    });
  });

  // 非舰船类手牌（装备 / 法术）只保留自己的 —— 队友的装备法术在合并后
  // 无法区分归属，也不参与战斗计算，丢掉不影响战况。
  state.hand = merged;
  state.coopOwners = owners;
  state.coopUsed = used;
  state.coopDropped = dropped;
  return { used: used, dropped: dropped, count: merged.length };
}

// 玩家稳定序号：按房间席位顺序，p1 起。用用户名反查座位表，
// 保证同一局内同一人每次刷新拿到的序号不变（颜色才不会乱跳）。
// 玩家序号映射。必须用 let：coopRebuildTags 每次重建房间态都要整体替换它，
// 声明成 const 会在赋值时抛 Assignment to constant variable，
// 表现为「点开始作战后什么都不发生」。
let coopTagMap = {};
function coopRebuildTags(snap) {
  coopTagMap = {};
  snap.seats.forEach(function (s, i) { coopTagMap[s.username] = 'p' + (i + 1); });
}
function seatTag(username) {
  return coopTagMap[username] || ('p' + (Object.keys(coopTagMap).length + 1));
}

// 各玩家卡面配色：按序号在铜金/靛蓝/苔绿/赭石里循环，
// 与参考项目用 mint/amber 区分队友的做法同思路，但色相取站内调色盘。
const COOP_COLORS = ['#9b7247', '#4a6b8a', '#6b7a4a', '#8a5a4a', '#5a6b8a', '#7a5a8a'];
function coopColor(tag) {
  const m = /^p(\d+)$/.exec(tag || '');
  if (!m) return COOP_COLORS[0];
  return COOP_COLORS[(Number(m[1]) - 1) % COOP_COLORS.length];
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
function saveFleetConfig() {
  const byId = {};
  state.hand.forEach(function (c) {
    if (!c.ship) return;
    if (!byId[c.ship.id]) byId[c.ship.id] = { id: c.ship.id, count: 0, mod: c.mod || '' };
    byId[c.ship.id].count++;
  });
  const list = [];
  for (const k in byId) list.push(byId[k]);
  try {
    localStorage.setItem('ueg_weishu_fleet', JSON.stringify(list));
    flashTip('舰队配置已保存');
    sbSyncFleet();
  } catch (e) { flashTip('保存失败：' + e.message); }
}
function loadFleetConfig() {
  try {
    const raw = localStorage.getItem('ueg_weishu_fleet');
    if (!raw) {
      const u = sbUser();
      if (u) {
        sbGet('/rest/v1/weishu_data?username=eq.' + encodeURIComponent(u) + '&select=fleet_json').then(function (r) {
          if (r.code === 200 && Array.isArray(r.data) && r.data[0] && r.data[0].fleet_json) {
            localStorage.setItem('ueg_weishu_fleet', r.data[0].fleet_json);
            flashTip('已从云端加载配置');
            loadFleetConfig();
          } else flashTip('本地与云端均无已保存的配置');
        }).catch(function () { flashTip('没有已保存的配置'); });
      } else flashTip('没有已保存的配置');
      return;
    }
    const list = JSON.parse(raw);
    const pool = buildShipPool();
    state.hand = [];
    list.forEach(function (it) {
      const s = pool.find(function (x) { return x.id === it.id; });
      if (!s) return;
      const mod = s.mods && s.mods.length ? (it.mod || s.mods[0]) : '';
      for (let i = 0; i < it.count; i++) state.hand.push({ ship: s, elite: false, equips: [], lv: {}, kills: 0, lastFireTime: 0, mod: mod, spentTech: 0 });
    });
    if (totalCommand() > 400) flashTip('配置已加载：' + state.hand.length + ' 艘（指挥值 ' + totalCommand() + '/400，已超限，请调整）');
    else flashTip('配置已加载：' + state.hand.length + ' 艘');
    showDeployModal();
  } catch (e) { flashTip('加载失败：' + e.message); }
}
function showDeployModal() {
  const modal = document.getElementById('deployModal');
  const body = document.getElementById('deployBody');
  const pool = buildShipPool();
  const groups = {};
  for (const s of pool) (groups[s.cls] = groups[s.cls] || []).push(s);
  const total = carrierTotal();
  const airSelF = selectedFighterCount();
  const airSelC = selectedCorvetteCount();
  const airLimitF = total.f;
  const airLimitC = total.c;
  const cmd = totalCommand();
  let html = '<div class="deploy-cmd"><span>舰队指挥值</span><b class="' + (cmd > 400 ? 'over' : '') + '">' + cmd + '/400</b><span class="dp-cmd-hint">舰载机不占指挥值</span><span class="dp-cmd-actions"><button class="btn-action tiny" id="saveFleetBtn">保存配置</button><button class="btn-action tiny" id="loadFleetBtn">加载配置</button></span></div>';
  html += '<div class="deploy-layout">';
  html += '<div class="deploy-left">';
  const clsOrder = ['carrier', 'battlecruiser', 'battleship', 'cruiser', 'destroyer', 'frigate', 'fighter', 'corvette', 'support'];
  for (const cls of clsOrder) {
    const list = groups[cls] || [];
    if (!list.length) continue;
    const cnt = selectedShipCount(cls);
    let locked = false;
    if (cls === 'fighter' || cls === 'corvette') locked = !hasCarrier() || (cls === 'fighter' ? airSelF >= airLimitF : airSelC >= airLimitC);
    html += '<div class="dp-group' + (locked ? ' locked' : '') + '" data-cls="' + cls + '">';
    html += '<div class="dp-group-title">' + CLS_ZH[cls] + ' <span class="dp-limit">' + cnt + ' 艘</span>';
    if (cls === 'fighter' || cls === 'corvette') {
      html += ' <span class="dp-aircap">搭载 ' + (cls === 'fighter' ? airSelF + '/' + airLimitF : airSelC + '/' + airLimitC) + '</span>';
    }
    html += '</div>';
    if (locked && (cls === 'fighter' || cls === 'corvette')) {
      html += '<div class="dp-lock-tip">需先选择搭载舰船，且战机/护航艇数量不得超过搭载量</div>';
    }
    html += '<div class="dp-ships">';
    list.forEach(function (s) {
      const have = countOfId(s.id);
      const isAir = s.cls === 'fighter' || s.cls === 'corvette';
      const airUsed = s.cls === 'fighter' ? (airSelF - have) : (airSelC - have);
      const maxByAir = isAir ? Math.max(0, (s.cls === 'fighter' ? airLimitF : airLimitC) - airUsed) : 99999;
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
  const sf = document.getElementById('saveFleetBtn');
  if (sf) sf.addEventListener('click', saveFleetConfig);
  const lf = document.getElementById('loadFleetBtn');
  if (lf) lf.addEventListener('click', loadFleetConfig);
  body.querySelectorAll('[data-plus]').forEach(function (el) {
    el.addEventListener('click', function () {
      const s = pool.find(function (x) { return x.id === el.dataset.plus; });
      if (!s) return;
      const have = countOfId(s.id);
      const isAir = s.cls === 'fighter' || s.cls === 'corvette';
      if (have >= s.maxShip) { flashTip('已达该舰船服役数上限'); return; }
      if (isAir) {
        if (!hasCarrier()) { flashTip('需先选择搭载舰船'); return; }
        if (s.cls === 'fighter' ? selectedFighterCount() >= carrierTotal().f : selectedCorvetteCount() >= carrierTotal().c) { flashTip('该机种搭载量已满'); return; }
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
  state.enemyHpMul = 1;
  state.swift = false; state.recycle = false; state.gacha = false; state.intel = false; state.spellStrategy = false;
  state.mergeCount = 3; state.mergeBonus = 0; state.craft = false;
  upgradeTriggered = {};
  state.pendingHp = null;
  state.paused = false;
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
  const tpGain = Math.round((2 + state.wave) * CONFIG.MODES[state.mode].reward);
  state.techPoints += tpGain;
  state.funds += fundsOfRound(state.wave);
  state.upgradeDiscount++;
  state.shield = bargeShield();
  state.roundKills = 0;
  state.roundLifeLost = 0;
  state.attackEvents = [];
  state.pendingPop = {};
  if (state.spellStrategy && state.bargeLevel >= 3) {
    const sp = SPELL_BLUEPRINTS[Math.floor(Math.random() * SPELL_BLUEPRINTS.length)];
    state.hand.push({ type: 'spell', sp: sp });
    pushNews('战术支援：获得战术指令 ' + sp.name, 'good');
  }
  state.poolRefreshed = false;
  if (state.poolFrozen) { state.poolFrozen = false; }
  else { state.pool = []; generatePool(); }
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
// ==================== 对局 HUD ====================
// 布局参照 sganggs/Stronghold-Protocol 的 screens/game.css：
// 顶栏三段（左资源 / 中回合 / 右时钟）+ 队友列 + 底部提示条。
// 配色沿用站内浅色档案风。
// 单人局不显示队友列 —— 没有队友，显示空面板只是噪音。
function renderHudTop(opts) {
  const o = opts || {};
  const waveNow = Math.min(state.wave, CONFIG.TOTAL_ROUNDS);
  let html = '<div class="hud-top">';

  // 左段：两个势力血条
  html += '<div class="hud-left"><div class="hud-faction-bar">';
  for (let i = 0; i < 2; i++) {
    const pct = state.factionMaxHp[i] ? Math.max(0, state.factionHp[i] / state.factionMaxHp[i] * 100) : 0;
    html += '<div class="hud-faction"><div class="fb-name">' + factionName(i) + '</div>' +
      '<div class="fb-track"><div class="fb-fill" style="width:' + pct + '%"></div></div>' +
      '<div class="fb-num">' + Math.max(0, state.factionHp[i]) + '</div></div>';
  }
  html += '</div><div class="hud-meta">';
  html += '<div class="mb-row"><span class="mb-label">护盾</span><div class="shield-bar"><div class="fill" style="width:' + Math.min(100, state.shield / Math.max(1, bargeShield() + 5) * 100) + '%"></div></div><span class="mb-val">' + Math.round(state.shield) + '</span></div>';
  html += '<div class="mb-row"><span class="mb-label">生命</span><div class="life-bar"><div class="fill" style="width:' + Math.max(0, state.life / state.maxLife * 100) + '%"></div></div><span class="mb-val">' + Math.max(0, state.life) + '/' + state.maxLife + '</span></div>';
  html += '<div class="mb-row"><span class="mb-label">资金</span><span class="mb-val">' + state.funds + '</span></div>';
  html += '<div class="mb-row"><span class="mb-label">强化点</span><span class="mb-val">' + state.techPoints + '</span></div>';
  html += '</div></div>';

  // 中段：回合 + 进度格 + 阶段
  html += '<div class="hud-center">';
  html += '<div class="hud-round"><span class="hud-round-num">' + waveNow + '</span><span class="hud-round-cap">/ ' + CONFIG.TOTAL_ROUNDS + ' 回合</span></div>';
  html += '<div class="hud-phase">' + (o.phaseLabel || (state.phase === 'battle' ? '作战中' : '休整期')) + '</div>';
  html += '<div class="hud-progress">';
  for (let i = 1; i <= CONFIG.TOTAL_ROUNDS; i++) {
    // UPGRADE_ROUNDS 是强化回合（3/6/10/12/14），描边区分
    const isUp = CONFIG.UPGRADE_ROUNDS.indexOf(i) > -1;
    let cls = 'hud-pip';
    if (i < waveNow) cls += ' done';
    else if (i === waveNow) cls += ' now';
    if (isUp) cls += ' upgrade';
    html += '<div class="' + cls + '" title="第 ' + i + ' 回合' + (isUp ? '（强化）' : '') + '"></div>';
  }
  html += '</div></div>';

  // 右段：时钟（仅战斗期）
  html += '<div class="hud-right">';
  if (o.showClock) {
    const warn = clockLeft <= 15;
    html += '<div class="hud-clock' + (warn ? ' warn' : '') + '"><span>' + Math.max(0, Math.ceil(clockLeft)) + '</span><span class="hud-clock-cap">秒</span></div>';
  }
  html += renderHudTeam();
  html += '</div>';

  html += '</div>';
  return html;
}

// 队友列。座位信息来自 weishu_room.js；单人局返回空串。
function renderHudTeam() {
  const R = window.WeishuRoom;
  if (!R || !R.isHost) return '';
  const snap = R.snapshot();
  if (!snap.code) return '';
  let html = '<div class="hud-team"><div class="hud-team-title">队友 ' + snap.seatCount + '/' + snap.seatSlots + '</div>';
  snap.seats.forEach(function (s) {
    const isMe = s.username === snap.me;
    const isHost = s.username === snap.host;
    html += '<div class="hud-mate' + (isMe ? ' is-me' : '') + (isHost ? ' is-host' : '') +
      (!s.connected ? ' is-off' : '') + (s.role === 'spectator' ? ' is-spec' : '') + '">' +
      '<span class="hm-dot' + (s.connected ? ' on' : '') + '"></span>' +
      '<span class="hm-name">' + escRoom(s.username) + '</span>' +
      (isHost ? '<span class="hm-tag host">房主</span>' : '') +
      (s.role === 'spectator' ? '<span class="hm-tag">观战</span>' : '') +
      '<span class="hm-units">' + (s.ready ? '已备' : '未备') + '</span>' +
      '</div>';
  });
  for (let i = snap.seatCount; i < snap.seatSlots; i++) {
    html += '<div class="hud-mate is-off"><span class="hm-dot"></span><span class="hm-name">空席</span></div>';
  }
  html += '</div>';
  return html;
}

// 底部提示条：单人局给下一步该做什么，联机局报同步状态
function renderHudBottom() {
  let text;
  if (state.finalRound && state.finalRound.active) {
    text = '最终回合 · 第 ' + state.finalRound.wave + ' 波次' +
      (state.finalRound.intermission ? '（间期 ' + Math.max(0, state.finalRound.timer) + ' 秒，可驳船补给）' : '');
  } else if (state.phase === 'battle') {
    text = '自动作战中 · 漏过敌舰会扣目标生命值';
  } else {
    const poolLeft = (state.pool || []).filter(function (c) { return !c.bought; }).length;
    text = '休整期 · 补给池剩 ' + poolLeft + ' 项' +
      (coop.isRoom() ? (coop.isHost() ? ' · 你是房主，准备完毕后由你开始作战' : ' · 等待房主开始作战') : '');
  }
  return '<div class="hud-bottom"><div class="hud-hint">' + escRoom(text) + '</div></div>';
}

// 「我方编组（手牌区）」默认折叠，点标题展开。
// 存模块变量而不是只记 DOM 类名：renderPrep 每次买舰/合成都整块重绘，
// 只记类名的话买一次舰就会打回默认，展开态丢失。
let prepFleetOpen = false;
function renderPrep() {
  const panel = document.getElementById('leftPanel');
  panel.dataset.mode = 'prep';
  // 顶栏（回合/资金/势力血条）全宽通栏，下方分屏：主区放卡池与手牌，
  // 右栏放驳船、编组与行动按钮。理由见 weishu.css 的 .ws-split 注释。
  let html = '<div class="game-header">';
  html += renderHudTop({});
  html += renderNewsTicker();
  html += '<div class="ws-split"><div class="ws-main">';
  if (state.finalRound && state.finalRound.active) {
    html += '<div class="final-banner">最终回合 · 第 ' + state.finalRound.wave + ' 波次' + (state.finalRound.intermission ? '（间期 <span id="interTimer">' + Math.max(0, state.finalRound.timer) + '</span> 秒，可驳船补给）' : '') + '</div>';
  }
  html += renderPoolSection();
  html += renderHudBottom();
  html += '</div><div class="ws-side">';
  html += renderBarge();
  html += '<div class="prep-fleet' + (prepFleetOpen ? ' open' : '') + '">';
  html += '<button type="button" class="pf-title" id="prepFleetToggle" aria-expanded="' + (prepFleetOpen ? 'true' : 'false') + '" aria-controls="prepFleetBody">我方编组（手牌区）</button>';
  html += '<div class="pf-body" id="prepFleetBody">' + renderFleetRows() + '</div>';
  html += '</div>';
  html += renderHandSection();
  html += renderActionBar('prep');
  html += '</div></div></div>';
  panel.innerHTML = html;
  const pfToggle = document.getElementById('prepFleetToggle');
  if (pfToggle) pfToggle.addEventListener('click', function () {
    prepFleetOpen = !prepFleetOpen;
    pfToggle.setAttribute('aria-expanded', prepFleetOpen ? 'true' : 'false');
    pfToggle.closest('.prep-fleet').classList.toggle('open', prepFleetOpen);
  });
  renderPoolSectionBind();
  coopReportFleet();
}

// 编组上报（防抖）。
// renderPrep 是编组变化的统一出口 —— 买舰、合成、升级、配装、换模块
// 全都会走到这里，所以挂在这里就不会漏。防抖 800ms 是因为连续点「+」
// 会连续触发 renderPrep，逐次写库没意义。
let coopReportTimer = null;
function coopReportFleet() {
  const R = window.WeishuRoom;
  if (!R || !R.isHost || !R.isRoom()) return;
  if (coopReportTimer) clearTimeout(coopReportTimer);
  coopReportTimer = setTimeout(function () {
    R.saveFleet(packFleet()).then(function (r) {
      if (r && r.code !== 200) console.warn('[coop] 编组上报失败', r);
      // 上报后让队友看到自己的编组已被房主收录
      R.notifySeat();
      R.refresh();
    });
  }, 800);
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
  return Math.min(m[2], m[0] + (wave - 1) * m[1]);
}
function generatePool(plus) {
  const b = CONFIG.BARGE[state.bargeLevel - 1];
  const pool = [];
  for (let i = 0; i < b.slots; i++) {
    const s = randomShipByLevel(plus || 0);
    pool.push({ type: 'ship', ship: s, price: Math.min(20, Math.max(10, Math.round(s.hp / 20000))) });
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
  return pool;
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
  generatePool(free ? 1 : 0);
  pushNews('补给已重新调配', '');
  renderPrep();
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
    // 指挥值已满则只升级驳船、不送舰（静默，避免升级提示被挤掉）
    if (canAcquireShip(s, true)) {
      state.hand.push({ ship: s, elite: false, equips: [], lv: {}, kills: 0, lastFireTime: 0, mod: (s.mods && s.mods.length) ? s.mods[0] : '' });
      pushNews('军火商人：获得舰船 ' + s.name, 'good');
      tryMergeShips();
    }
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
  const airSelF = selectedFighterCount();
  const airSelC = selectedCorvetteCount();
  const airTotal = carrierTotal();
  const airLimitF = airTotal.f;
  const airLimitC = airTotal.c;
  const airUnlocked = hasCarrier() && (airSelF < airLimitF || airSelC < airLimitC);
  body.querySelectorAll('.dp-group[data-cls]').forEach(function (g2) {
    const cls = g2.dataset.cls;
    const cnt = selectedShipCount(cls);
    const limit = g2.querySelector('.dp-limit');
    if (limit) limit.textContent = cnt + ' 艘';
    if (cls === 'fighter' || cls === 'corvette') {
      const locked = !hasCarrier() || (cls === 'fighter' ? airSelF >= airLimitF : airSelC >= airLimitC);
      g2.classList.toggle('locked', locked);
      const air = g2.querySelector('.dp-aircap');
      if (air) air.textContent = '搭载 ' + (cls === 'fighter' ? airSelF + '/' + airLimitF : airSelC + '/' + airLimitC);
      const tip = g2.querySelector('.dp-lock-tip');
      if (tip) tip.style.display = airUnlocked ? 'none' : '';
    }
  });
  body.querySelectorAll('[data-plus]').forEach(function (el) {
    const s = pool.find(function (x) { return x.id === el.dataset.plus; });
    if (!s) return;
    const have = countOfId(s.id);
    const isAir = s.cls === 'fighter' || s.cls === 'corvette';
    let can = have < s.maxShip;
    if (isAir) can = can && hasCarrier() && (s.cls === 'fighter' ? selectedFighterCount() < carrierTotal().f : selectedCorvetteCount() < carrierTotal().c);
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
  if (item.type === 'equip' && countHand('equip') >= CONFIG.EQUIP_LIMIT) { flashTip('装备栏已满'); return; }
  if (item.type === 'spell' && countHand('spell') >= CONFIG.SPELL_LIMIT) { flashTip('战术指令栏已满'); return; }
  // 必须在扣款之前拦，否则钱已扣、舰没进编组。
  if (item.type === 'ship' && !canAcquireShip(item.ship)) return;
  state.funds -= price;
  state.spentFunds += price;
  if (item.type === 'ship') {
    state.hand.push({ ship: item.ship, elite: false, equips: [], lv: {}, kills: 0, lastFireTime: 0, mod: (item.ship.mods && item.ship.mods.length) ? item.ship.mods[0] : '' });
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
  state.pool.splice(idx, 1);
  if (state.gacha) checkGacha();
  renderPrep();
}

function checkGacha() {
  if (state.spentFunds < 18) return;
  const s = randomShipByLevel(0);
  // 指挥值满了就不送、也不扣累计值 —— 留到编组腾出空间后自然触发。
  if (!canAcquireShip(s, true)) return;
  state.hand.push({ ship: s, elite: false, equips: [], lv: {}, kills: 0, lastFireTime: 0, mod: (s.mods && s.mods.length) ? s.mods[0] : '' });
  state.spentFunds -= 18;
  pushNews('军火商人：获得舰船 ' + s.name, 'good');
  tryMergeShips();
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
  html += '<div class="hand-head"><span>手牌区 舰船 ' + countHand('ship') + ' 装备 ' + countHand('equip') + '/' + CONFIG.EQUIP_LIMIT + ' 战术 ' + countHand('spell') + '/' + CONFIG.SPELL_LIMIT + '</span><button class="btn-action tiny" id="blueOpenBtn">本局蓝图数据库</button></div>';
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
      if (card.equips && card.equips.length) {
        html += '<div class="hc-eq">';
        card.equips.forEach(function (eq, k) {
          html += '<span class="hc-eq-tag" data-uneq="' + i + '" data-slot="' + k + '" title="点击卸下">' + eq.name + (eq.lv > 1 ? ' Lv.' + eq.lv : '') + '</span>';
        });
        html += '</div>';
      }
      html += '<button class="btn-action tiny danger" data-sell="' + i + '">出售 1</button>';
      html += '</div>';
    } else if (card.type === 'equip') {
      html += '<div class="hand-card equip" data-idx="' + i + '">';
      html += '<div class="hc-name">' + card.eq.name + ' Lv.' + card.lv + '</div>';
      html += '<div class="hc-cls">装备 · ' + (card.eq.desc || '') + '</div>';
      html += '<button class="btn-action tiny" data-equip="' + i + '">装配到舰船</button>';
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
  document.querySelectorAll('[data-equip]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      openEquipPicker(parseInt(btn.dataset.equip, 10));
    });
  });
  document.querySelectorAll('[data-uneq]').forEach(function (tag) {
    tag.addEventListener('click', function (e) {
      e.stopPropagation();
      detachEquip(parseInt(tag.dataset.uneq, 10), parseInt(tag.dataset.slot, 10));
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

const BATTLE_ONLY_SPELLS = { bomb: 1, emp: 1, freeze: 1, corrode: 1 };
function useSpellFromHand(i) {
  const card = state.hand[i];
  if (!card || card.type !== 'spell') return;
  if (BATTLE_ONLY_SPELLS[card.sp.id]) { flashTip('该战术指令仅在战斗中生效，将在战斗开始时自动使用'); return; }
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
    if (canAcquireShip(s, true)) {
      state.hand.push({ ship: s, elite: false, equips: [], lv: {}, kills: 0, lastFireTime: 0, mod: (s.mods && s.mods.length) ? s.mods[0] : '' });
      pushNews('增援编队：获得舰船 ' + s.name, 'good');
      tryMergeShips();
    } else {
      // 战术卡已消耗却拿不到舰，必须在纸带上留痕，否则玩家不知道为什么没反应
      pushNews('增援编队：指挥值已满，未获得舰船', 'warn');
    }
  } else if (sp.id === 'freeze') {
    state.enemies.forEach(function (e) { e.frozenUntil = now + 5000; });
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
      state.hand.push({ ship: base.ship, elite: true, equips: [], lv: base.lv || {}, kills: 0, lastFireTime: 0, mod: base.mod || ((base.ship.mods && base.ship.mods.length) ? base.ship.mods[0] : '') });
      state.permits++;
      if (state.mergeBonus) state.funds += state.mergeBonus;
      equips.forEach(function (eq) { state.hand.push({ type: 'equip', eq: eq, lv: eq.lv || 1 }); });
      pushNews('同名合成：' + base.ship.name + ' 晋升为精锐舰船', 'good');
    }
  }
}

/* ============ 装备装配（补全此前缺失的交互：equips 只被读取、从未被写入） ============ */
function openEquipPicker(eqIdx) {
  const eqCard = state.hand[eqIdx];
  if (!eqCard || eqCard.type !== 'equip') return;
  const targets = [];
  state.hand.forEach(function (cd, i) { if (cd.ship) targets.push(i); });
  if (!targets.length) { flashTip('手牌区没有可装配的舰船'); return; }
  let html = '<div class="equip-pick">';
  html += '<div class="ep-title">将「' + eqCard.eq.name + '」装配到哪艘舰船？</div>';
  html += '<div class="ep-tip">装备生效于战斗中（攻/防/速/程/护盾/能量/暴击）；合成或精锐化时会自动退回手牌。</div>';
  html += '<div class="ep-list">';
  targets.forEach(function (i) {
    const s = state.hand[i].ship;
    const eqs = state.hand[i].equips || [];
    html += '<div class="ep-item" data-target="' + i + '">';
    html += '<span class="ep-name">' + (s.shortName || s.name) + '</span>';
    html += '<span class="ep-cls">' + CLS_ZH[s.cls] + ' · ' + ['前排', '中排', '后排'][s.row] + '</span>';
    html += '<span class="ep-has">' + (eqs.length ? '已装 ' + eqs.length + ' 件' : '空') + '</span>';
    html += '</div>';
  });
  html += '</div></div>';
  showModal('装配装备', html);
  document.querySelectorAll('.ep-item').forEach(function (el) {
    el.addEventListener('click', function () { attachEquip(eqIdx, parseInt(el.dataset.target, 10)); });
  });
}
function attachEquip(eqIdx, shipIdx) {
  const eqCard = state.hand[eqIdx], shipCard = state.hand[shipIdx];
  if (!eqCard || eqCard.type !== 'equip' || !shipCard || !shipCard.ship) return;
  shipCard.equips = shipCard.equips || [];
  shipCard.equips.push({ id: eqCard.eq.id, name: eqCard.eq.name, desc: eqCard.eq.desc || '', lv: eqCard.lv || 1 });
  state.hand.splice(eqIdx, 1);
  pushNews('装备装配：' + (shipCard.ship.shortName || shipCard.ship.name) + ' ← ' + eqCard.eq.name, 'good');
  closeModals();
  renderPrep();
}
function detachEquip(shipIdx, slot) {
  const shipCard = state.hand[shipIdx];
  if (!shipCard || !shipCard.ship || !shipCard.equips || !shipCard.equips[slot]) return;
  if (countHand('equip') >= CONFIG.EQUIP_LIMIT) { flashTip('装备栏已满，无法卸下'); return; }
  const eq = shipCard.equips.splice(slot, 1)[0];
  state.hand.push({ type: 'equip', eq: Object.assign({}, eq), lv: eq.lv || 1 });
  pushNews('卸下装备：' + eq.name + ' 回到手牌', '');
  renderPrep();
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
  html += '<div class="blue-actions"><button class="btn-action" id="autoUpgradeBtn">一键花费所有强化点自动强化</button></div>';
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
  const au = document.getElementById('autoUpgradeBtn');
  if (au) au.addEventListener('click', autoUpgradeAll);
  body.querySelectorAll('.blue-item').forEach(function (el) {
    el.addEventListener('click', function () {
      showShipUpgrade(parseInt(el.dataset.i, 10));
    });
  });
}

function autoUpgradeAll() {
  const cards = state.hand.filter(function (c) { return c.ship; });
  if (!cards.length) { flashTip('编组中没有舰船'); return; }
  let spent = 0, guard = 0;
  while (state.techPoints > 0 && guard < 3000) {
    guard++;
    let best = null;
    cards.forEach(function (card) {
      const lv = card.lv || {};
      ['dmg', 'hp', 'rate', 'armor', 'range'].forEach(function (k) {
        const cost = (lv[k] || 0) + 1;
        if (cost <= state.techPoints && (!best || cost < best.cost)) best = { card: card, k: k, cost: cost };
      });
    });
    if (!best) break;
    best.card.lv = best.card.lv || {};
    best.card.lv[best.k] = (best.card.lv[best.k] || 0) + 1;
    best.card.spentTech = (best.card.spentTech || 0) + best.cost;
    state.techPoints -= best.cost;
    spent += best.cost;
  }
  if (spent > 0) { pushNews('一键强化：共花费 ' + spent + ' 强化点', 'good'); showBlueModal(); }
  else flashTip('强化点不足或已全部满级');
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
    html += '<div class="su-info"><span class="su-name">' + it.name + '</span><span class="su-lv">Lv.' + cur + '</span><span class="su-val">' + (it.pct ? '+' + Math.round(cur * it.pct * 100) + '%' : (it.k === 'range' ? '+' + (cur * 0.4).toFixed(1) : '+' + Math.round(cur * 2))) + '</span></div>';
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
    // 强化加成（官方 EFFECT_TYPE==ADJUST 与普通强化节点共用一套口径）。
    //
    // 优先走 enhance.js 的细粒度桶，按属性分别生效：fireMul 已把 crit/攻速/射速
    // 三项折进伤害期望，故不再单独累加 crit，避免与 fireMul 重复计算。
    // physMul 是倍率而站内 armor 是加值，按基准装甲换算成等值加成。
    //
    // 联机时队友的 ueg_tree_lv 本机读不到，回退到上报方算好的单标量
    // （= 1 + min(0.4, 加点总数 × 0.004)，由 packFleet 生成）。
    const enhRemote = (card.enhOverride != null) ? card.enhOverride : null;
    const ea = (enhRemote == null && typeof window.ENHANCE_ATTRS === 'function')
      ? window.ENHANCE_ATTRS(s.name) : null;
    if (ea) {
      dmgMul *= ea.fireMul;
      hpMul *= ea.hpMul;
      energyMul *= ea.energyMul;
      if (ea.physMul !== 1) armorBonus += (s.armor || 0) * (ea.physMul - 1);
    } else if (enhRemote != null) {
      dmgMul *= enhRemote; hpMul *= enhRemote;
    }
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
    const waveScale = 1 + (state.wave - 1) * 0.08;
    const maxHp = Math.round(s.hp * hpMul * state.bonuses.hpMul * waveScale);
    const hasShield = s.dmgType === 'energy' || (card.equips || []).some(function (e) { return e.id === 'shield'; });
    // 防空拦截能力（借 anti_missile_list）：防空武器越强可拦越多投射物。
    // 与 weapon 对齐：有 air 武器的舰船才具备拦截能力。
    const antiMissile = s.weapon === 'air' ? Math.round(s.dmg * 0.8 + (s.armor || 0) * 2) : 0;
    return {
      // 联机联合舰队里id 带玩家序号前缀（p2_my_0）：快照里非房主靠它区分来源，
// 也用于卡面上色。单人局保持 my_<i>，不做任何额外标记。
      cardIdx: i, id: (card.tag ? card.tag + '_my_' : '') + i, name: s.name, shortName: s.shortName || s.name, cls: s.cls, row: s.row, repair: (s.repair ? 1 : 0) || (mo.repair ? 1 : 0),
      // 联机：带玩家标签，卡面据此上色并加名字前缀
      owner: card.owner || '', tag: card.tag || '',
      maxHp: maxHp, hp: maxHp,
      shield: hasShield ? Math.round(maxHp * 0.2) + ((card.equips || []).filter(function (e) { return e.id === 'shield'; }).length ? 40 : 0) : 0,
      dmg: Math.round(s.dmg * dmgMul * state.bonuses.dmgMul * waveScale),
      armor: s.armor + armorBonus + state.bonuses.armorBonus,
      rate: s.rate * rateMul * state.bonuses.rateMul,
      range: s.range + rangeBonus + state.bonuses.rangeBonus,
      weapon: s.weapon, dmgType: s.dmgType, energyMul: energyMul, critBonus: critBonus,
      antiMissile: antiMissile,
      elite: card.elite, alive: true, kills: 0, lastFireTime: 0
    };
  }).filter(function (u) { return u; });
}

function factionName(i) {
  if (state.finalRound && state.finalRound.active) return i === 0 ? '黑色舰队先锋' : '黑色打击舰队';
  return i === 0 ? '亚空间第一巡航舰队' : '亚空间第二巡航舰队';
}
function makeFortress(scale) {
  return {
    id: 'fortress', name: '特拉法加', shortName: '特拉法加', cls: 'support', zone: 'mid', count: 1,
    maxHp: 3000000, hp: 3000000, maxShield: 300000, shield: 300000,
    armor: 50, dmgType: 'physical', weapon: 'direct', tier: 99, repair: 1,
    fortress: true, alive: true, lastFireTime: 0, empUntil: 0, frozenUntil: 0, lockUntil: 0, readyUntil: 0, fireUntil: 0, cooling: false, coolUntil: 0,
    fortressHits: 0, modules: [
      { weapon: 'direct', dmgType: 'physical', targets: 2, dpm: 1000 },
      { weapon: 'direct', dmgType: 'energy', targets: 2, dpm: 1000 },
      { weapon: 'projectile', dmgType: 'physical', targets: 4, dpm: 1500 },
      { weapon: 'air', dmgType: 'physical', targets: 6, dpm: 300 }
    ]
  };
}
function finalRoundRandomShips(count, minCar, minBc) {
  const pool = window.PLAYER_SHIPS || [];
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  const carriers = pool.filter(function (s) { return s.cls === 'carrier'; });
  const bcs = pool.filter(function (s) { return s.cls === 'battlecruiser' || s.cls === 'battleship'; });
  const others = pool.filter(function (s) { return s.cls !== 'carrier' && s.cls !== 'battlecruiser' && s.cls !== 'battleship'; });
  const list = [];
  for (let i = 0; i < minCar; i++) list.push(pick(carriers));
  for (let i = 0; i < minBc; i++) list.push(pick(bcs));
  while (list.length < count) list.push(pick(others));
  return list.slice(0, count).map(function (s) {
    const nm = /天枢/.test(s.name) ? s.name + '（黑色）' : s.name;
    return { name: nm, cls: s.cls, hp: s.hp, dmg: s.dmg, armor: s.armor, shield: s.shield, dmgType: s.dmgType, weapon: s.weapon, tier: 6, repair: s.repair ? 1 : 0 };
  });
}
function finalRoundWave4Ships() {
  const pool = window.PLAYER_SHIPS || [];
  const list = [];
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  const carriers = pool.filter(function (s) { return s.cls === 'carrier'; });
  const tianshu = pool.filter(function (s) { return /天枢/.test(s.name); });
  const warspite = pool.filter(function (s) { return /止战/.test(s.name); });
  const bcs = pool.filter(function (s) { return s.cls === 'battlecruiser' || s.cls === 'battleship'; });
  const others = pool.filter(function (s) { return s.cls !== 'carrier' && !/止战/.test(s.name) && s.cls !== 'battlecruiser' && s.cls !== 'battleship'; });
  for (let i = 0; i < 5; i++) list.push(pick(tianshu.length ? tianshu : carriers));
  for (let i = 0; i < 10; i++) list.push(pick(carriers));
  for (let i = 0; i < 3; i++) list.push(pick(warspite.length ? warspite : bcs));
  for (let i = 0; i < 30; i++) list.push(pick(bcs));
  while (list.length < 150) list.push(pick(others));
  return list.slice(0, 150).map(function (s, idx) {
    const nm = /天枢/.test(s.name) ? s.name + '（黑色）' : s.name;
    return { name: nm, cls: s.cls, hp: s.hp, dmg: s.dmg, armor: s.armor, shield: s.shield, dmgType: s.dmgType, weapon: s.weapon, tier: 6, repair: s.repair ? 1 : 0 };
  });
}
let interTimer = null;
function finalRoundStart() {
  if (state.finalRound.active) return;
  state.finalRound.active = true;
  state.finalRound.wave = 0;
  state.finalRound.fortress = null;
  state.finalRound.fortressAoEDone = false;
  state.factionHp = [2000, 2000];
  state.factionMaxHp = [2000, 2000];
  pushNews('最终回合开启：黑色舰队先锋 / 黑色打击舰队（生命 2000）', 'warn');
  finalRoundNextWave();
}
function finalRoundNextWave() {
  state.finalRound.wave++;
  const w = state.finalRound.wave;
  if (w > 4) {
    state.phase = 'settle';
    renderPrep();
    endGame(true);
    return;
  }
  const scale = 1 + state.wave * 0.25;
  let units = [];
  if (w <= 3) {
    const cnt = w === 3 ? 130 : 100;
    const minCar = w === 3 ? 10 : 8;
    const minBc = w === 3 ? 28 : 25;
    const ships = finalRoundRandomShips(cnt, minCar, minBc);
    state.enemies = ships.map(function (e, i) {
      const zone = e.cls === 'cruiser' ? 'mid' : (e.cls === 'destroyer' || e.cls === 'frigate' || e.cls === 'corvette' ? 'front' : 'back');
      return {
        id: 'en_' + i, name: e.name, shortName: e.name, cls: e.cls, zone: zone, count: 1, group: 0, factionIdx: 0,
        maxHp: Math.round(e.hp * scale), hp: Math.round(e.hp * scale), dmg: Math.round(e.dmg * scale),
        armor: Math.round(e.armor * scale), shield: Math.round(e.shield * scale), dmgType: e.dmgType, weapon: e.weapon,
        tier: e.tier, repair: e.repair ? 1 : 0, alive: true, lastFireTime: 0, empUntil: 0, frozenUntil: 0
      };
    });
  } else {
    const ships = finalRoundWave4Ships();
    state.enemies = ships.map(function (e, i) {
      const zone = e.cls === 'cruiser' ? 'mid' : (e.cls === 'destroyer' || e.cls === 'frigate' || e.cls === 'corvette' ? 'front' : 'back');
      return {
        id: 'en_' + i, name: e.name, shortName: e.name, cls: e.cls, zone: zone, count: 1, group: 0, factionIdx: 0,
        maxHp: Math.round(e.hp * scale), hp: Math.round(e.hp * scale), dmg: Math.round(e.dmg * scale),
        armor: Math.round(e.armor * scale), shield: Math.round(e.shield * scale), dmgType: e.dmgType, weapon: e.weapon,
        tier: e.tier, repair: e.repair ? 1 : 0, alive: true, lastFireTime: 0, empUntil: 0, frozenUntil: 0
      };
    });
    state.enemies.forEach(function (e) { e.shield += 1000; });
    const fs2 = makeFortress(scale);
    fs2.lockUntil = Date.now() + 30000;
    fs2.readyUntil = fs2.lockUntil;
    fs2.fireUntil = fs2.lockUntil + 10000;
    state.finalRound.fortress = fs2;
    state.enemies.push(fs2);
    pushNews('要塞舰特拉法加登场！HP 3000000 · 护盾 300000 · 30秒锁血后输出10秒冷却5秒', 'warn');
  }
  state.finalRound.intermission = true;
  state.finalRound.timer = 20;
  state.phase = 'prep';
  state.shield = bargeShield();
  renderPrep();
  pushNews('最终回合 · 第 ' + w + ' 波次准备中（20秒间期，可驳船补给，舰船血量不重置）', 'warn');
  if (interTimer) clearInterval(interTimer);
  interTimer = setInterval(function () {
    state.finalRound.timer -= 1;
    const tEl = document.getElementById('interTimer');
    if (tEl) tEl.textContent = Math.max(0, state.finalRound.timer);
    if (state.finalRound.timer <= 0) {
      clearInterval(interTimer);
      interTimer = null;
      if (state.phase === 'prep' && state.finalRound.wave <= 4) {
        state.finalRound.intermission = false;
        startBattle();
      }
    }
  }, 1000);
}
function fortressAttack(now) {
  const fs2 = state.finalRound && state.finalRound.fortress;
  if (!fs2 || !fs2.alive) return;
  if (now < fs2.readyUntil) return;
  if (fs2.cooling) {
    if (now < fs2.coolUntil) return;
    fs2.cooling = false;
    fs2.fireUntil = now + 10000;
    pushNews('要塞舰武器系统充能完毕，进入输出阶段', 'warn');
  }
  if (now >= fs2.fireUntil) {
    fs2.cooling = true;
    fs2.coolUntil = now + 5000;
    pushNews('要塞舰武器输出结束，冷却5秒', 'warn');
    return;
  }
  if (now - fs2.lastFireTime < 250) return;
  fs2.lastFireTime = now;
  const myUnits = state.units.filter(function (u) { return u.alive; });
  if (!myUnits.length) return;
  myUnits.forEach(function (u) { u.fortressHits = 0; });
  fs2.modules.forEach(function (m) {
    // dpm 即每秒每目标伤害；模块轮询间隔 250ms（每秒 4 轮），故每轮伤害 = dpm / 4
    const perHit = m.dpm / 4;
    for (let k = 0; k < m.targets; k++) {
      const t = acquireTarget({ weapon: m.weapon, dmgType: m.dmgType, col: 2, range: 5 }, myUnits.filter(function (u) { return u.alive; }));
      if (!t) break;
      t.fortressHits = (t.fortressHits || 0) + 1;
      const dealt = calcDamage(perHit, m.dmgType, t, m.weapon);
      t.hp -= dealt;
      const el = document.getElementById(t.id);
      if (el) {
        spawnDamagePop(el, dealt, false, true);
        el.classList.add('fortress-hit');
        let cnt = el.querySelector('.fh-count');
        if (!cnt) { cnt = document.createElement('span'); cnt.className = 'fh-count'; el.appendChild(cnt); }
        cnt.textContent = '×' + t.fortressHits;
      }
    }
  });
}

// ==================== 敌方强度标定 ====================
// 原来是 Math.pow(1.1, wave - 1)：只看波次，与我方编组完全无关 ——
// 编组强则平推，编组弱则打不动。改为按我方实际战力标定：玩家变强敌方跟着变强，
// 再乘一个随波次上升的倾斜系数，保留「前易后难」但把曲线拉平。
const ENEMY_SCALE = {
  START_TILT: 0.85,  // 第1波敌方战力为我方的 85%（<1 即前易）
  TILT_STEP: 0.025,  // 每波 +2.5%，第15波到 1.20（>1 即后难）
  MIN: 0.15,         // 钳制：编组异常强时别把敌方刷成纸
  MAX: 6,            // 钳制：编组异常弱时别把敌方刷成铁板
  FALLBACK: 1        // 拿不到我方战力时退回不标定
};

// 战力口径两边必须一致：有效血量 × 输出。
// 有效血量 = (血 + 护盾) × (1 + 护甲/10)，护甲每 10 点等效一倍血。
// 敌方 rate 按 1（CITY_DEFENSE 没有该字段），我方用真实 rate —— 双方同式才可比。
function powerOf(hp, armor, shield, dmg, rate) {
  return (hp + shield) * (1 + armor / 10) * dmg * rate;
}
function playerPower() {
  return state.units.reduce(function (a, u) {
    return a + (u.alive ? 1 : 0) * powerOf(u.maxHp, u.armor, u.shield, u.dmg, u.rate);
  }, 0);
}
// 解出让敌方总战力等于 target 的 scale。
// 不能用 sqrt(target / base) 反解：敌方血、护甲、攻击都随 scale 线性放大，
// 而护甲在 (1 + armor/10) 里是线性项，战力随 scale 并非平方关系，
// 开方反解在护甲较大时会明显偏离目标。直接二分，40 次 × N 艘、每波一次，可忽略。
//
// state.enemyHpMul / enemyDmgMul 故意不计入：它们是玩家选的策略修正
//（如「全域防御」在入门协议给敌方 -30%），标定若把它们算进基线，
// 就会自动放大 scale 把这份削弱吃掉，玩家拿不到应得的收益。
function solveEnemyScale(units, target) {
  const powerAt = function (scale) {
    return units.reduce(function (a, e) {
      return a + powerOf(e.hp * scale, e.armor * scale, e.shield * scale, e.atk * scale, 1);
    }, 0);
  };
  if (!(target > 0)) return ENEMY_SCALE.FALLBACK;
  let lo = 0.01, hi = 50;
  if (powerAt(hi) < target) return hi;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (powerAt(mid) < target) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

function spawnEnemyWave() {
  const lv = cityLevelOf(state.wave);
  const config = (window.CITY_DEFENSE || {})[lv] || [];
  if (!config.length) {
    // 空配置会让下面 config[...] 取到 undefined，随后 e.cls 直接抛错。
    // 标定要读 config 算战力，先在这里兜住。
    state.enemies = [];
    pushNews('城市防御配置为空（' + lv + ' 级），本波没有敌舰', 'bad');
    return;
  }
  const units = [];
  config.slice(0, 6).forEach(function (e) { for (let k = 0; k < e.count; k++) units.push(e); });
  for (let k = 0; k < 30; k++) units.push(config[Math.floor(Math.random() * config.length)]);
  const seg = Math.max(1, Math.ceil(units.length / 4));
  // 标定目标：敌方总战力 = 我方总战力 × 波次倾斜 × 难度系数
  const tilt = ENEMY_SCALE.START_TILT + ENEMY_SCALE.TILT_STEP * (state.wave - 1);
  const modeF = CONFIG.MODES[state.mode].enemyPow || 1;
  let scale = ENEMY_SCALE.FALLBACK;
  const myPow = playerPower();
  if (myPow > 0) {
    scale = solveEnemyScale(units, myPow * tilt * modeF);
    scale = Math.max(ENEMY_SCALE.MIN, Math.min(ENEMY_SCALE.MAX, scale));
  }
  state.enemies = units.map(function (e, i) {
    const grp = Math.min(3, Math.floor(i / seg));
    const zone = e.cls === 'cruiser' ? 'mid' : (e.cls === 'destroyer' || e.cls === 'frigate' || e.cls === 'corvette' ? 'front' : 'back');
    return {
      id: 'en_' + i, name: e.zh, shortName: e.zh, cls: e.cls,
      zone: zone, count: 1, group: grp, factionIdx: grp < 2 ? 0 : 1,
      maxHp: Math.round(e.hp * scale * state.enemyHpMul), hp: Math.round(e.hp * scale * state.enemyHpMul),
      dmg: Math.round(e.atk * scale), armor: Math.round(e.armor * scale), shield: Math.round(e.shield * scale),
      dmgType: e.dmgType, weapon: e.weapon, tier: e.tier, repair: e.repair ? 1 : 0,
      antiMissile: e.weapon === 'air' ? Math.round(e.atk * scale * 0.8 + e.armor * scale * 2) : 0,
      alive: true, lastFireTime: 0, empUntil: 0, frozenUntil: 0
    };
  });
  pushNews('敌方舰队抵达：' + lv + ' 级舰队，' + state.enemies.length + ' 艘敌舰（标定强度 ' + scale.toFixed(2) + '，战力比 ' + (tilt * modeF).toFixed(2) + '×）', 'warn');
}
function startBattle() {
  if (state.phase !== 'prep') return;
  if (typeof interTimer !== 'undefined' && interTimer) { clearInterval(interTimer); interTimer = null; }
  if (!state.hand.some(function (c) { return c.ship; })) { flashTip('编组中没有舰船'); return; }
  // 联机：非房主不能「发起」战斗，但必须进入战斗界面 ——
  // 进了界面才会订阅房主快照、才能看到联合舰队。拦住他等于让他永远看不到战况。
  // 他本地的 units 只是占位，会被房主快照里的联合舰队整体替换掉。
  if (coop.isRoom() && !coop.isHost()) {
    state.phase = 'battle';
    state.repairUntil = Date.now() + 2500;
    rebuildUnits();
    spawnEnemyWave();
    renderBattle();
    startBattleLoop();
    flashTip('已接入联合舰队，等待房主数据');
    return;
  }
  // 联机：房主先把各人的编组合并进联合舰队，再进战斗。
  // 合并是同步的（读 seats 上已上报的 fleet），不做网络等待 ——
  // 各玩家在休整期就调好了编组并随时可上报，到点直接取最新的一份。
  if (coop.isRoom() && coop.isHost()) {
    const snap = window.WeishuRoom.snapshot();
    coopRebuildTags(snap);
    const merged = coopMergeFleets(snap.seats);
    if (merged.dropped > 0) {
      pushNews('联合舰队受 400 指挥值上限限制，' + merged.dropped + ' 艘舰未编入', 'warn');
    }
    pushNews('联合舰队就绪：' + merged.count + ' 艘（指挥值 ' + merged.used + '/400）');
    if (!merged.count) { flashTip('联合舰队为空'); return; }
    // 把房间阶段推到作战中，非房主据此知道该切到战斗界面
    window.WeishuRoom.hostUpdate({ phase: window.WeishuRoom.PHASE.COMBAT, round: state.wave });
  }
  state.phase = 'battle';
  state.repairUntil = Date.now() + 2500;
  const spells = state.hand.filter(function (c) { return c.type === 'spell'; });
  state.hand = state.hand.filter(function (c) { return c.type !== 'spell'; });
  spells.forEach(function (c) { castSpell(c.sp); });
  rebuildUnits();
  if (state.finalRound && state.finalRound.active) {
    const pending = state.pendingHp || [];
    state.pendingHp = null;
    state.units.forEach(function (u) {
      const k = pending.find(function (p) { return p.id === u.id; });
      if (k) { u.hp = Math.min(u.maxHp, Math.max(0, k.hp)); u.alive = k.alive && k.hp > 0; }
    });
    state.enemies.forEach(function (e) { e.lastFireTime = 0; });
  } else {
    spawnEnemyWave();
  }
  if (state.swift) {
    let top = null, max = 0;
    state.units.forEach(function (u) { if (u.dmg > max) { max = u.dmg; top = u; } });
    if (top) top.swiftTop = true;
  }
  clockLeft = state.finalRound && state.finalRound.active ? 180 : CONFIG.ROUND_CLOCK;
  // battleFocusMul 不能在这里清：集火指令是备战阶段点的，开战场清会让它永远无效；
  // 重置放在战斗结算（settleRound），保证本场生效、下场不带
  state.attackEvents = [];
  state.pendingPop = {};
  state.breakthroughUntil = Date.now() + 30000;
  state.roundLifeLost = 0;
  state.finalRound.waveEnded = false;
  renderBattle();
  pushNews('战斗开始', 'warn');
  startBattleLoop();
}

// ==================== 联机：战斗同步（房主权威） ====================
// 单人局与旧行为完全一致：联机未开房时 coop.isRoom() 为 false，
// 下面所有分支都走原路径。
//
// 房主跑完整模拟（gameTick），并按 SYNC_HZ_MS 广播增量快照；
// 其他客户端不跑 gameTick，只把快照合进本地 state 再渲染 ——
// 这样所有人看到的是同一份房主算出来的结果，客户端无法伪造战果。
const coop = {
  isRoom: function () {
    return !!(window.WeishuRoom && window.WeishuRoom.snapshot().code);
  },
  isHost: function () {
    return !!(window.WeishuRoom && window.WeishuRoom.isHost());
  },
  syncing: false,
  // 房主关页面时本地战斗要停下，否则「同一份结果」就不成立了
  hostLostHandled: false,
  applySnapshot: null
};

// 把快照解包成与 gameTick 产出一致的结构。
// 字段名是压缩过的（见 weishu_room.js 的 packUnit），这里一一还原。
function unpackUnit(p, mine) {
  const u = {
    id: p.i, cls: p.c, alive: !!p.al, hp: p.hp, maxHp: p.mhp, shield: p.s,
    dmg: p.d, armor: p.a, lastFireTime: p.lf, antiMissile: p.am, repair: p.rp,
    weapon: p.w, dmgType: p.dt, kills: p.k || 0, fortress: !!p.fs
  };
  if (mine) {
    // id 形如 my_3 或 p2_my_3（联机时带玩家序号前缀）
    var raw = String(p.i);
    var tag = /^p(\d+)_/.exec(raw);
    u.tag = tag ? 'p' + tag[1] : '';
    u.owner = u.tag ? (state.coopOwners && state.coopOwners[u.tag]) || '' : '';
    u.cardIdx = parseInt(raw.replace(/^p\d+_my_/, 'my_').replace('my_', ''), 10) || 0;
    u.row = p.r; u.rate = p.rt; u.range = p.rg;
    u.energyMul = p.em; u.critBonus = p.cb; u.elite = !!p.el;
  } else {
    u.zone = p.z; u.group = p.g; u.factionIdx = p.f;
    u.tier = p.t; u.empUntil = p.eu; u.frozenUntil = p.fu;
  }
  return u;
}

// 合一份增量。d.mu / d.en 只含变化的单位，d.ids 是完整名单，
// 据此删掉已阵亡并被移除的单位（阵亡单位 alive=0 仍在名单里，
// 只有真正消失的才删 —— 也就是 renderRows 用到的那些）。
function coopApply(d) {
  if (!d) return;
  const s = state;
  if (d.sh) {
    if (d.sh.roster) s.coopRoster = d.sh.roster;
    s.phase = d.sh.ph || s.phase;
    s.wave = d.sh.rd != null ? d.sh.rd : s.wave;
    s.life = d.sh.life != null ? d.sh.life : s.life;
    s.maxLife = d.sh.mlife != null ? d.sh.mlife : s.maxLife;
    s.funds = d.sh.fu != null ? d.sh.fu : s.funds;
    if (d.sh.clk != null) clockLeft = d.sh.clk;
    if (Array.isArray(d.sh.fhp)) s.factionHp = d.sh.fhp;
    if (Array.isArray(d.sh.fmhp)) s.factionMaxHp = d.sh.fmhp;
    if (d.sh.tk != null) s.totalKills = d.sh.tk;
    if (d.sh.rk != null) s.roundKills = d.sh.rk;
    if (d.sh.rll != null) s.roundLifeLost = d.sh.rll;
    if (d.sh.bl != null) s.bargeLevel = d.sh.bl;
    if (d.sh.sh != null) s.shield = d.sh.sh;
  }
  if (d.fr !== undefined) {
    if (d.fr === null) {
      if (s.finalRound && s.finalRound.fortress) s.finalRound.fortress = null;
    } else {
      if (!s.finalRound) s.finalRound = { active: true, wave: 0, timer: 0, fortress: null };
      s.finalRound.active = true;
      const f = s.finalRound.fortress || (s.finalRound.fortress = {});
      f.hp = d.fr.hp; f.maxHp = d.fr.mhp; f.shield = d.fr.sh;
      f.maxShield = d.fr.ms; f.alive = !!d.fr.al; f.hits = d.fr.hits;
    }
  }
  if (d.mu && d.mu.length) {
    const byId = {};
    s.units.forEach(function (u) { byId[u.id] = u; });
    d.mu.forEach(function (p) {
      const cur = unpackUnit(p, true);
      const old = byId[p.i];
      // 名字来源：roster（房主下发的对照表）优先，其次本地 hand，
      // 最后才回退到占位。队友的舰本地 hand 里没有，只能靠 roster。
      const r = s.coopRoster && s.coopRoster[p.i];
      if (r) { cur.name = r[0]; cur.shortName = r[1]; cur.cls = r[2]; cur.owner = r[3] || cur.owner; }
      else if (old) { cur.name = old.name; cur.shortName = old.shortName; cur.owner = old.owner; }
      else {
        const handCard = s.hand[cur.cardIdx];
        const ship = handCard && handCard.ship;
        cur.name = ship ? ship.name : '未知舰船';
        cur.shortName = ship ? (ship.shortName || ship.name) : '未知舰船';
      }
      if (old) Object.keys(cur).forEach(function (k) { old[k] = cur[k]; });
      else s.units.push(cur);
    });
  }
  if (d.en && d.en.length) {
    const byId = {};
    s.enemies.forEach(function (u) { byId[u.id] = u; });
    d.en.forEach(function (p) {
      const cur = unpackUnit(p, false);
      cur.count = 1;
      const old = byId[p.i];
      if (old) { cur.name = old.name; cur.shortName = old.shortName; Object.keys(cur).forEach(function (k) { old[k] = cur[k]; }); }
      else s.enemies.push(cur);
    });
  }
  if (d.ids) {
    const keepM = {}, keepE = {};
    d.ids.mu.forEach(function (i) { keepM[i] = 1; });
    d.ids.en.forEach(function (i) { keepE[i] = 1; });
    s.units = s.units.filter(function (u) { return keepM[u.id]; });
    s.enemies = s.enemies.filter(function (u) { return keepE[u.id]; });
  }
}

// 非房主：只渲染快照，不跑 gameTick。
function coopApplyAndRender(d) {
  coopApply(d);
  renderBattle();
  updateBattleUI();
}

function coopOnSnapshot(d, seq) {
  coop.lastSeq = seq;
  coop.lastAt = Date.now();
  coopApplyAndRender(d);
}

function coopStart(onLog) {
  const R = window.WeishuRoom;
  if (!R || !R.isRoom()) return Promise.resolve(false);
  if (R.isHost()) {
    return R.startSync(function () {
      return {
        phase: state.phase, round: state.wave, life: state.life, maxLife: state.maxLife,
        funds: state.funds, clockLeft: clockLeft, factionHp: state.factionHp,
        factionMaxHp: state.factionMaxHp, totalKills: state.totalKills,
        roundKills: state.roundKills, roundLifeLost: state.roundLifeLost,
        bargeLevel: state.bargeLevel, shield: state.shield,
        units: state.units, enemies: state.enemies, finalRound: state.finalRound
      };
    }, onLog);
  }
  return R.watchSync(coopOnSnapshot, onLog);
}

function coopStop() {
  const R = window.WeishuRoom;
  if (!R) return;
  R.stopSync();
  R.stopWatch();
  coop.syncing = false;
}

// 房主的快照超过 1.5s 没来：本地战斗暂停并提示。
// 继续跑会算出与房主不同的结果，那比停下更糟。
function coopWatchdog() {
  if (!coop.isRoom() || coop.isHost()) return;
  if (state.phase !== 'battle') return;
  if (!coop.lastAt) { coop.lastAt = Date.now(); return; }
  if (Date.now() - coop.lastAt > 1500 && !coop.hostLostHandled) {
    coop.hostLostHandled = true;
    stopBattleLoop();
    flashTip('与房主失联，战斗已暂停（等待房主重连）');
  }
}

function startBattleLoop() {
  stopBattleLoop();
  let last = Date.now();
  const remote = coop.isRoom() && !coop.isHost();
  battleTimer = setInterval(function () {
    const now = Date.now();
    const dt = Math.min(0.25, (now - last) / 1000);
    last = now;
    // 非房主不跑模拟：只等快照。否则会算出与房主不同的战况，
    // 屏幕上就会出现两套数字。
    if (!remote) gameTick(now, dt);
    else coopWatchdog();
  }, 100);
  uiTimer = setInterval(function () { updateBattleUI(); }, 150);
  // 房主开跑时启动广播；非房主订阅
  coopStart(function (msg) { console.warn('[coop]', msg); });
  coop.syncing = coop.isRoom();
  coop.hostLostHandled = false;
  coop.lastAt = Date.now();
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
  healers.forEach(function (h) {
    const targets = list.filter(function (u) { return u.alive && u !== h && u.hp < u.maxHp; });
    if (!targets.length) return;
    let target = targets[0];
    for (let i = 1; i < targets.length; i++) {
      if (targets[i].hp / targets[i].maxHp < target.hp / target.maxHp) target = targets[i];
    }
    const heal = Math.max(1, Math.round(h.dmg * 1.25));
    if (target.fortress) {
      target.shield = Math.min(target.maxShield || 300000, (target.shield || 0) + heal);
    } else {
      target.hp = Math.min(target.maxHp, target.hp + heal);
    }
    const el = document.getElementById(target.id);
    if (el) spawnDamagePop(el, heal, false, isEnemy, true);
  });
}
function gameTick(now, dt) {
  if (state.phase !== 'battle') return;
  if (state.paused) return;
  clockLeft -= dt;
  if (clockLeft <= 0 && state.finalRound && state.finalRound.active && !state.finalRound.waveEnded) {
    state.finalRound.waveEnded = true;
    state.enemies.forEach(function (e) { e.alive = false; e.hp = 0; });
    pushNews('波次时间到（3分钟），剩余敌舰撤出战场', 'warn');
  }
  if (clockLeft <= 0 && !state.finalRound.active) {
    const myLeft = state.units.some(function (u) { return u.alive; });
    const enLeft = state.enemies.some(function (e) { return e.alive; });
    if (!myLeft) { settleRound(false); return; }
    if (!enLeft) { settleRound(true); return; }
    settleRound(false, true);
    return;
  }
  if (state.finalRound && state.finalRound.fortress && !state.finalRound.fortress.alive && !state.finalRound.fortressAoEDone) {
    state.finalRound.fortressAoEDone = true;
    state.units.forEach(function (u) {
      // 我方前排 = 护卫/驱逐/战机/护航艇（row 0，用 clsToRow 判定）
      if (u.alive && clsToRow(u.cls) === 0) { u.aoeUntil = now + 10000; u.aoeDps = 1000; }
    });
    pushNews('特拉法加阵亡！对我方前排释放能量直射（10秒，每秒1000伤害）', 'warn');
  }
  state.units.forEach(function (u) {
    if (u.alive && u.aoeUntil && now < u.aoeUntil) {
      u.hp -= (u.aoeDps || 200) * dt;
      if (u.hp <= 0) { u.alive = false; u.hp = 0; const c = CONFIG.DEATH_COST[u.cls] || 2; state.life -= c; pushNews(u.shortName + '被能量直射击毁（我方生命 -' + c + '）', 'bad'); }
    }
  });
  if (state.corrodeUntil && now < state.corrodeUntil) {
    state.enemies.forEach(function (e) { if (e.alive) e.hp -= e.maxHp * 0.03 * dt; });
  }
  repairTick(now);
  myAttack(now);
  fortressAttack(now);
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
      if (e.fortress) {
        state.factionHp[0] = Math.max(0, state.factionHp[0] - 500);
        state.factionHp[1] = Math.max(0, state.factionHp[1] - 500);
        pushNews('要塞舰特拉法加被击毁！黑色舰队生命 -500', 'good');
      }
      const cost = CONFIG.DEATH_COST[e.cls] || 2;
      let fDmg = Math.round(cost * e.count * 1.5);
      const take0 = Math.min(state.factionHp[0], fDmg);
      state.factionHp[0] -= take0;
      fDmg -= take0;
      if (fDmg > 0) {
        if (state.wave < CONFIG.TOTAL_ROUNDS) {
          const prev1 = state.factionHp[1];
          state.factionHp[1] = Math.max(100, state.factionHp[1] - fDmg);
          if (prev1 > 100 && state.factionHp[1] <= 100 && !state.finalRound.active && !state.finalRound.lockPrompted) {
            state.finalRound.lockPrompted = true;
            state.paused = true;
            setTimeout(function () {
              showConfirm('是否进入最终回合？', '敌方亚空间第二巡航舰队生命已降至 100 并被锁定。进入最终回合后敌方生命恢复至 2000，并迎来 4 个波次的最终决战（第4波含要塞舰特拉法加）。', function () { state.paused = false; finalRoundStart(); }, function () { state.paused = false; });
            }, 600);
          }
        } else state.factionHp[1] = Math.max(0, state.factionHp[1] - fDmg);
      }
      pushNews('击毁敌方编队：' + e.shortName + '（势力1生命 -' + take0 + (fDmg > 0 ? '，势力2生命 -' + fDmg : '') + '，强化点 +' + tp + '）', 'good');
    }
  }
  const myAlive = state.units.some(function (u) { return u.alive; });
  const enAlive = state.enemies.some(function (e) { return e.alive; });
  if (!myAlive) { settleRound(false); return; }
  if (!enAlive) { settleRound(true); return; }
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
    if (state.swift && u.swiftTop) dmg *= 1.7;
    const isCrit = Math.random() < (state.bonuses.critChance + u.critBonus);

    // 一轮攻击拆成多段命中：逐段结算伤害并逐段飘字
    // （借 hit_damage_count / miss_damage_count 的分段表现）
    const segs = Math.max(1, CONFIG.HIT_SEGMENTS);
    let dealt = 0, sumBase = 0, sumExtra = 0, anyCrit = false;
    for (let i = 0; i < segs; i++) {
      const segDmg = dmg / segs;
      const r = calcDamageDetailed(segDmg, u.dmgType, target, u.weapon, isCrit && i === 0);
      target.hp -= r.total;
      dealt += r.total;
      sumBase += r.base;
      sumExtra += r.extra;          // 累加：暴击只在首段，但末段会把它冲掉
      if (r.extra > 0) anyCrit = true;
    }
    target.hp = Math.max(0, target.hp);
    state.pendingPop = state.pendingPop || {};
    state.pendingPop[target.id] = { base: sumBase, extra: sumExtra, crit: anyCrit };
    state.attackEvents.push({ from: u.shortName, to: target.shortName, dmg: dealt, isCrit: anyCrit, isEnemy: false });
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

    const segs = Math.max(1, CONFIG.HIT_SEGMENTS);
    let dealt = 0, sumBase = 0, sumExtra = 0, anyCrit = false;
    for (let i = 0; i < segs; i++) {
      const segDmg = dmg / segs;
      const r = calcDamageDetailed(segDmg, e.dmgType, target, e.weapon, isCrit && i === 0);
      target.hp -= r.total;
      dealt += r.total;
      sumBase += r.base;
      sumExtra += r.extra;
      if (r.extra > 0) anyCrit = true;
    }
    if (target.hp <= 0) target.hp = 0;
    state.pendingPop = state.pendingPop || {};
    state.pendingPop[target.id] = { base: sumBase, extra: sumExtra, crit: anyCrit };
    state.attackEvents.push({ from: e.shortName, to: target.shortName, dmg: dealt, isCrit: anyCrit, isEnemy: true });
    if (state.attackEvents.length > 40) state.attackEvents.shift();
  });
}

// ---------- 射程判定（方案A：排位差 ≤ floor(射程)-1） ----------
// 战场是排位制：我方 row 0前/1中/2后，敌方 zone front/mid/back（同序号=同排）。
// 射程 2.x（约 57% 的船）打不到隔排（前排够不到敌后排），3+ 全排可打；
// 射程科技 +1（2.4→3.4）即从两排限制变全排。无排位（要塞）或没配射程
//（敌方数据无 range 字段）的单位不拦，保持原行为。
function posIndexOf(u) {
  if (typeof u.row === 'number') return u.row;
  if (u.zone === 'front') return 0;
  if (u.zone === 'mid') return 1;
  if (u.zone === 'back') return 2;
  return null;
}
function inAttackRange(attacker, target) {
  const r = typeof attacker.range === 'number' ? attacker.range : 99;
  const maxGap = Math.max(0, Math.floor(r) - 1);
  const a = posIndexOf(attacker);
  const b = posIndexOf(target);
  if (a === null || b === null) return true;
  return Math.abs(a - b) <= maxGap;
}

function acquireTarget(attacker, candidates) {
  const list = candidates.filter(function (c) { return c.alive && inAttackRange(attacker, c); });
  if (!list.length) return null;
  const fortress = list.filter(function (c) { return c.fortress && !(c.lockUntil && Date.now() < c.lockUntil); });
  if (fortress.length) return fortress[0];
  if (attacker.weapon === 'air') {
    const air = list.filter(function (c) { return c.cls === 'fighter' || c.cls === 'corvette'; });
    return (air.length ? air : list)[0];
  }
  const nonAir = list.filter(function (c) { return c.cls !== 'fighter' && c.cls !== 'corvette'; });
  const pool = nonAir.length ? nonAir : list;
  if (attacker.weapon === 'projectile') {
    for (const seq of LOCK_SEQUENCE) {
      const found = pool.filter(function (c) { return c.cls === seq.cls; });
      if (found.length) return found[0];
    }
    return pool[0];
  }
  return pool.sort(function (a, b) { return a.hp - b.hp; })[0];
}

/* ---------- 防空拦截（借自 anti_missile_list） ----------
   星际猎人里投射物进入目标防区时，由目标的防空武器逐个拦截
   （anti_missile_list 每 3 个一组表示一批拦截结果）。这里改为：
   目标带 weapon==='air' 的防空属性时，按拦截率吃掉部分投射物伤害。 */
function calcInterception(target, weapon) {
  if (weapon !== 'projectile') return 0;
  const cap = target.antiMissile || 0;   // 防空拦截上限（0 = 无防空）
  if (cap <= 0) return 0;
  // 拦截率：护盾越多防空越强，但有上限，避免满盾必拦
  const rate = Math.min(0.75, 0.25 + (target.shield || 0) / 400);
  return cap * rate;
}

// ---------- 伤害结算 ----------
// 返回 { total, base, extra, intercepted }：
//   base       基础伤害（护盾吸收、护甲减伤后）
//   extra      暴击额外伤害（借 critical_hit_extra_damage）
//   intercepted 被防空拦掉的量（不进 hp，只做提示）
function calcDamageDetailed(dmg, dmgType, target, weapon, isCrit) {
  if (target.fortress && Date.now() < (target.lockUntil || 0)) {
    return { total: 0, base: 0, extra: 0, intercepted: 0 };
  }
  let incoming = dmg;
  // 防空拦截：先吃掉一部分
  const intercepted = Math.min(incoming, calcInterception(target, weapon));
  incoming -= intercepted;

  let base = 0;
  if (target.fortress) {
    base = incoming;
    if (target.shield > 0) {
      const abs = Math.min(target.shield, base);
      target.shield -= abs;
      base -= abs;
    }
    base = Math.max(0, base);
  } else if (target.cls === 'fighter' || target.cls === 'corvette') {
    if (weapon !== 'air') return { total: 0, base: 0, extra: 0, intercepted: 0 };
    base = incoming;
  } else if (dmgType === 'energy') {
    if (target.shield > 0) {
      const absorbed = Math.min(target.shield, incoming);
      target.shield -= absorbed;
      base = Math.max(1, incoming - absorbed);
    } else {
      base = incoming;
    }
  } else {
    base = Math.max(1, incoming - target.armor);
  }

  // 暴击额外伤害独立结算（不走护盾/护甲，与 base 分离）
  const extra = isCrit ? base * CONFIG.CRIT_EXTRA_RATIO : 0;
  return { total: base + extra, base: base, extra: extra, intercepted: intercepted };
}

// 保留原签名，供既有多处调用方使用
function calcDamage(dmg, dmgType, target, weapon) {
  return calcDamageDetailed(dmg, dmgType, target, weapon, false).total;
}

function settleRound(win, timeout) {
  if (state.phase !== 'battle') return;
  state.phase = 'settle';
  stopBattleLoop();
  // 集火指令（battleFocusMul）只对本场战斗生效：结算时重置，
  // 下一轮备战再点才会重新 +30%（startBattle 里不再清，否则永远无效）
  state.battleFocusMul = 1;
  if (state.recycle && state.roundKills >= 30) {
    const bonus = 2 + Math.floor(Math.random() * 2);
    state.funds += bonus;
    pushNews('战利品回收：奖励 ' + bonus + ' 资金', 'good');
  }
  if (win) {
    pushNews('本回合战斗胜利：敌方舰队已被全歼', 'good');
  } else {
    pushNews(timeout ? '作战时间到，剩余敌舰撤出战场' : '我方舰队全灭，防线告急', timeout ? '' : 'bad');
  }
  if (state.factionHp.every(function (h) { return h <= 0; })) { endGame(true); return; }
  if (state.life <= 0) { state.life = 0; endGame(false); return; }
  if (state.finalRound.active) {
    state.pendingHp = state.units.map(function (u) { return { id: u.id, hp: u.hp, alive: u.alive }; });
    finalRoundNextWave();
    return;
  }
  state.wave++;
  if (state.wave > CONFIG.TOTAL_ROUNDS) {
    if (state.finalRound.lockPrompted) finalRoundStart();
    else endGame(false);
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
  html += renderHudTop({ showClock: true, phaseLabel: '作战中' });
  const fsB = state.finalRound && state.finalRound.fortress;
  if (fsB) {
    html += '<div class="fortress-bar"><div class="fb-name">要塞舰 · 特拉法加' + (fsB.alive ? '' : '（已击毁）') + '</div>';
    html += '<div class="fort-hp"><div class="fill" style="width:' + (fsB.hp / fsB.maxHp * 100) + '%"></div><span>' + Math.max(0, Math.round(fsB.hp)) + ' / ' + fsB.maxHp + '</span></div>';
    html += '<div class="fort-sh"><div class="fill" style="width:' + (fsB.shield / fsB.maxShield * 100) + '%"></div><span>护盾 ' + Math.max(0, Math.round(fsB.shield)) + ' / ' + fsB.maxShield + '</span></div></div>';
  }
  html += renderNewsTicker();
  // 战斗期战场本身已是三栏（左我方 / 中日志 / 右敌方），再套一层分屏会把它挤扁，
  // 所以战斗期只把行动按钮收进右栏，战场保持满宽。
  html += '<div class="ws-split"><div class="ws-main">';
  html += '<div class="battle-view">';
  html += '<div class="fleet-panel left">';
  html += '<div class="fleet-title"><span class="ft-tag my">我</span>我方舰队 <span class="fp-cnt">' + state.units.filter(function (u) { return u.alive; }).length + '/' + state.units.length + '</span></div>';
  html += renderRows(state.units, 'my');
  html += '</div>';
  html += '<div class="battle-center">';
  html += '<div class="bc-info">舰队等级 <b>' + cityLevelOf(state.wave) + '</b></div>';
  html += '<div class="bc-log" id="bcLog"></div>';
  html += '</div>';
  html += '<div class="fleet-panel right">';
  html += '<div class="fleet-title"><span class="ft-tag en">敌</span>敌方舰队 <span class="fp-cnt">' + state.enemies.filter(function (e) { return e.alive; }).length + '/' + state.enemies.length + '</span></div>';
  html += renderRows(state.enemies, 'en');
  html += '</div>';
  html += '</div>';
  html += renderHudBottom();
  html += '</div><div class="ws-side">';
  html += renderActionBar('battle');
  html += '</div></div>';
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
  const grpTxt = (side === 'en' && u.group !== undefined) ? '<span class="grp-tag">' + factionName(u.factionIdx) + '·第' + ((u.group % 2) + 1) + '组</span>' : '';
  // 联机联合舰队：左侧玩家色条 + 名字前缀，让队友认得出自己的舰。
  // 只在联机局且该舰带 tag 时渲染 —— 单人局不产生任何额外标记。
  const coopOn = side !== 'en' && !!u.tag;
  const coopBar = coopOn ? '<span class="fc-owner" style="background:' + coopColor(u.tag) + '" title="' + escRoom(u.owner || '') + '"></span>' : '';
  const coopPre = coopOn ? '<span class="fc-owner-tag" style="color:' + coopColor(u.tag) + ';">' + escRoom(u.owner || u.tag) + '·</span>' : '';
  return '<div class="fleet-card' + (dead ? ' dead' : '') + (u.elite ? ' elite' : '') + (u.fortress ? ' fortress' : '') + (u.fortressHits ? ' fortress-hit' : '') + (side === 'en' ? ' enemy' : '') + (coopOn ? ' coop' : '') + '" id="' + u.id + '" data-hp="' + Math.round(u.hp) + '">' +
    '<div class="fc-head">' + coopBar + '<span class="fc-icon" style="background:' + color + '26;border-color:' + color + ';">' + icon + '</span>' +
    '<div class="fc-id"><div class="fc-name' + (u.fortress ? ' gold' : '') + '">' + coopPre + (u.shortName || u.name) + (u.fortressHits ? '<span class="fh-count">×' + u.fortressHits + '</span>' : '') + '</div><div class="fc-cls" style="color:' + color + ';">' + (CLS_ZH[u.cls] || '') + countTxt + grpTxt + (u.repair ? ' <span class="fc-repair">维修</span>' : '') + '</div></div></div>' +
    '<div class="fc-bar"><div class="fc-hp"><div class="fill" style="width:' + pct + '%"></div></div>' +
    (u.shield > 0 ? '<div class="fc-shield"><div class="fill" style="width:' + shieldPct + '%"></div></div>' : '') + '</div>' +
    '<div class="fc-hpnum">' + Math.max(0, Math.round(u.hp)) + '/' + u.maxHp + '</div>' +
    '<div class="fc-mini">攻 ' + u.dmg + ' 甲 ' + u.armor + ' ' + WEAPON_LABEL[u.weapon] + '·' + DMGTYPE_LABEL[u.dmgType] + '</div>' +
    '<div class="dmg-pop-wrap"></div></div>';
}

function spawnDamagePop(el, amount, isCrit, isEnemy, isHeal, extra) {
  const wrap = el.querySelector('.dmg-pop-wrap');
  if (!wrap) return;
  const one = function (amt, crit) {
    const div = document.createElement('div');
    div.className = 'dmg-pop' + (crit ? ' crit' : '') + (isEnemy ? ' from-enemy' : '') + (isHeal ? ' heal' : '');
    div.textContent = (isHeal ? '+' : '-') + Math.max(1, Math.round(amt));
    wrap.appendChild(div);
    setTimeout(function () { if (div.parentNode) div.parentNode.removeChild(div); }, 950);
  };
  one(amount, isCrit);
  // 暴击额外伤害独立飘一次（借自 critical_hit_extra_damage 的表现方式）
  if (extra > 0) one(extra, true);
}

function renderAtkLog() {
  const evs = (state.attackEvents || []).slice(-6);
  return evs.map(function (ev) {
    return '<div class="bc-line ' + (ev.isEnemy ? 'atk-en' : 'atk-my') + '">' + ev.from + ' <span class="atk-arrow">→</span> ' + ev.to + ' <span class="atk-dmg' + (ev.isCrit ? ' crit' : '') + '">-' + Math.max(1, Math.round(ev.dmg)) + '</span></div>';
  }).join('');
}

function updateBattleUI() {
  const panel = document.getElementById('leftPanel');
  if (!panel || state.phase !== 'battle' || state.paused) return;
  // 时钟现在只存在于 HUD 顶栏（renderHudTop 的 hud-clock），
  // 战场里的 battleClock / clockNum 都已移除。
  const hudClock = panel.querySelector('.hud-clock span');
  if (hudClock) {
    hudClock.textContent = Math.max(0, Math.ceil(clockLeft));
    const hc = panel.querySelector('.hud-clock');
    if (hc) hc.classList.toggle('warn', clockLeft <= 15);
  }
  const cntEl = panel.querySelector('.fleet-panel.right .fp-cnt');
  if (cntEl) cntEl.textContent = state.enemies.filter(function (e) { return e.alive; }).length + '/' + state.enemies.length;
  const fsb = state.finalRound && state.finalRound.fortress;
  if (fsb) {
    const fh = panel.querySelector('.fort-hp .fill');
    if (fh) fh.style.width = Math.max(0, fsb.hp / fsb.maxHp * 100) + '%';
    const fhn = panel.querySelector('.fort-hp span');
    if (fhn) fhn.textContent = Math.max(0, Math.round(fsb.hp)) + ' / ' + fsb.maxHp;
    const fsh = panel.querySelector('.fort-sh .fill');
    if (fsh) fsh.style.width = Math.max(0, fsb.shield / fsb.maxShield * 100) + '%';
    const fsn = panel.querySelector('.fort-sh span');
    if (fsn) fsn.textContent = '护盾 ' + Math.max(0, Math.round(fsb.shield)) + ' / ' + fsb.maxShield;
  }
  state.units.forEach(function (u) {
    const el = document.getElementById(u.id);
    if (!el) return;
    const prev = parseInt(el.dataset.hp || '0', 10);
    const pop = state.pendingPop && state.pendingPop[u.id];
    if (u.alive && u.hp < prev && prev - u.hp > 0.4) {
      // 有分段数据时用 base/extra 分离飘字（暴击额外伤害单独一次）
      if (pop && pop.extra > 0) spawnDamagePop(el, pop.base, pop.crit, true, false, pop.extra);
      else spawnDamagePop(el, prev - u.hp, pop ? pop.crit : false, true);
    } else if (u.alive && u.hp > prev && u.hp - prev > 0.4) spawnDamagePop(el, u.hp - prev, false, true, true);
    if (pop) delete state.pendingPop[u.id];
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
    const epop = state.pendingPop && state.pendingPop[e.id];
    if (e.alive && e.hp < prev && prev - e.hp > 0.4) {
      if (epop && epop.extra > 0) spawnDamagePop(el, epop.base, epop.crit, false, false, epop.extra);
      else spawnDamagePop(el, prev - e.hp, epop ? epop.crit : false, false);
    } else if (e.alive && e.hp > prev && e.hp - prev > 0.4) spawnDamagePop(el, e.hp - prev, false, false, true);
    if (epop) delete state.pendingPop[e.id];
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
  updateHudTop();
}

// HUD 顶栏的定点刷新。
// 不能每 150ms outerHTML 换掉整个 hud-top：一来重绘代价大，
// 二来会连带重建 .hud-team（队友列表由 onChange 驱动，会被这次替换冲掉）。
function updateHudTop() {
  const panel = document.getElementById('leftPanel');
  if (!panel) return;
  const hud = panel.querySelector('.hud-top');
  if (!hud) return;

  // 势力血条
  const fbs = hud.querySelectorAll('.hud-faction');
  for (let i = 0; i < fbs.length && i < 2; i++) {
    const max = state.factionMaxHp[i];
    const pct = max ? Math.max(0, state.factionHp[i] / max * 100) : 0;
    const fill = fbs[i].querySelector('.fb-fill');
    const num = fbs[i].querySelector('.fb-num');
    if (fill) fill.style.width = pct + '%';
    if (num) num.textContent = Math.max(0, state.factionHp[i]);
  }

  // 护盾 / 生命 / 资金 / 强化点：按 mb-label 定位，避免依赖顺序
  const rows = hud.querySelectorAll('.hud-meta .mb-row');
  for (let i = 0; i < rows.length; i++) {
    const label = rows[i].querySelector('.mb-label');
    const val = rows[i].querySelector('.mb-val');
    if (!label || !val) continue;
    const t = label.textContent;
    if (t === '护盾') {
      val.textContent = Math.round(state.shield);
      const f = rows[i].querySelector('.shield-bar .fill');
      if (f) f.style.width = Math.min(100, state.shield / Math.max(1, bargeShield() + 5) * 100) + '%';
    } else if (t === '生命') {
      val.textContent = Math.max(0, state.life) + '/' + state.maxLife;
      const f = rows[i].querySelector('.life-bar .fill');
      if (f) f.style.width = Math.max(0, state.life / state.maxLife * 100) + '%';
    } else if (t === '资金') {
      val.textContent = state.funds;
    } else if (t === '强化点') {
      val.textContent = state.techPoints;
    }
  }

  // 时钟
  const hc = hud.querySelector('.hud-clock');
  if (hc) {
    const s = hc.querySelector('span');
    if (s) s.textContent = Math.max(0, Math.ceil(clockLeft));
    hc.classList.toggle('warn', clockLeft <= 15);
  }

  // 回合数与进度格
  const waveNow = Math.min(state.wave, CONFIG.TOTAL_ROUNDS);
  const rn = hud.querySelector('.hud-round-num');
  if (rn) rn.textContent = waveNow;
  const pips = hud.querySelectorAll('.hud-progress .hud-pip');
  for (let i = 0; i < pips.length; i++) {
    const round = i + 1;
    pips[i].classList.toggle('done', round < waveNow);
    pips[i].classList.toggle('now', round === waveNow);
  }
}

function skipRound() {
  if (state.phase !== 'prep') { flashTip('当前无法跳过'); return; }
  if (state.finalRound && state.finalRound.active) { flashTip('最终回合波次无法跳过'); return; }
  // 联机时跳过是全局动作，只有房主能发起
  if (coop.isRoom() && !coop.isHost()) { flashTip('只有房主能跳过回合'); return; }
  state.phase = 'battle';
  state.shield = 0;
  state.enemies.forEach(function (e) { e.alive = false; });
  state.units.forEach(function (u) { u.alive = false; });
  settleRound(true);
  if (coop.isRoom() && coop.isHost()) {
    window.WeishuRoom.pushEvent('skip', { round: state.wave });
  }
}
function abortRun() {
  if (state.phase !== 'prep') { flashTip('战斗中无法放弃'); return; }
  if (coop.isRoom() && !coop.isHost()) { flashTip('只有房主能放弃本局'); return; }
  showConfirm('放弃战斗', '放弃后本场模拟直接结束，不进入作战结算。确定放弃？', function () {
    state.phase = 'end';
    endGame(false);
    if (coop.isRoom() && coop.isHost()) {
      window.WeishuRoom.pushEvent('abort', {});
      coopStop();
    }
  });
}

function endGame(victory) {
  if (state.phase === 'end') return;
  state.phase = 'end';
  stopBattleLoop();
  // 本局结束就停广播，别让非房主继续收一个不再更新的战场
  if (coop.isRoom()) coopStop();
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
  const tp = Math.round((state.wave + state.totalKills) * 5 * CONFIG.MODES[state.mode].reward);
  state.stats.techEarned = (state.stats.techEarned || 0) + tp;
  state.stats.coinsEarned = (state.stats.coinsEarned || 0) + Math.round(tp * 2);
  saveProgress();
  saveStats();
  const modal = document.getElementById('resultModal');
  document.getElementById('resultTitle').textContent = victory ? '作战胜利' : '作战失败';
  let html = '<div class="rs-line">回合 ' + Math.min(state.wave, CONFIG.TOTAL_ROUNDS) + '/' + CONFIG.TOTAL_ROUNDS + '</div>';
  html += '<div class="rs-line">模式 ' + CONFIG.MODES[state.mode].name + '</div>';
  html += '<div class="rs-line">击毁编队 ' + state.totalKills + '</div>';
  html += '<div class="rs-line">敌方势力生命 ' + state.factionHp.map(function (h) { return Math.max(0, h); }).join(' / ') + '</div>';
  html += '<div class="rs-line">奖励技术点 ' + tp + ' · 比邻星币 ' + Math.round(tp * 2) + '（已累计入战绩）</div>';
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
  sbPull();
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
        '<div class="sp-row"><span>资金节奏</span><span class="v">' + (m.funds[2] >= 9999 ? '第1回合' + m.funds[0] + '，之后每回合+' + m.funds[1] + '，无上限' : '第1回合' + m.funds[0] + '，之后每回合+' + m.funds[1] + '，上限' + m.funds[2]) + '</span></div>' +
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
      '<div class="sp-row"><span>最高回合</span><span class="v">' + (st.bestWave || 0) + '</span></div>' +
      '<div class="sp-row"><span>累计技术点 / 比邻星币</span><span class="v">' + (st.techEarned || 0) + ' / ' + (st.coinsEarned || 0) + '</span></div></div>' +
      '<div class="sp-sec"><div class="sp-sec-title">舰队强化联动</div>' +
      '<div class="sp-row"><span>全局加成</span><span class="v">+' + Math.round((computeEnhanceMul() - 1) * 100) + '%</span></div></div>' +
      '<div class="sp-sec"><div class="sp-sec-title">配队规则</div>' +
      '<div class="sp-row"><span>舰种数量</span><span class="v">不限（同型号受服役数上限约束）</span></div>' +
      '<div class="sp-row"><span>指挥值</span><span class="v">配队总计不超过 400</span></div>' +
      '<div class="sp-row"><span>战机 / 护航艇</span><span class="v">仅选择航母后可配置，不超过搭载量</span></div></div>' +
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
        // 回合强化必须三选一：点遮罩不关闭（否则会跳过强化且不刷新界面，流程卡住）
        if (m.id === 'upgradeModal') return;
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
  initRoomUi();
});

// ============================================================
//  联机房间界面
//  只负责「开/加入/准备/解散」的显示与调用；房间状态与同步在 weishu_room.js。
//  战斗逻辑仍走单人路径：联机接入战斗模拟是下一步，本轮先把房间层跑通。
// ============================================================
let roomState = null;
let roomUnsub = null;
// 上一次见到的房间阶段，用于边沿检测（声明在模块级：doJoin 与
// initRoomUi 都要读写它，放函数内够不着）。
// 只有阶段真正从别的值跳到 PREP 那一刻才让非房主跟随开局。
// 不能只看「当前是不是 PREP」——那样队友进房时房间若已是 PREP
//（房主已开局或上一局残留）、以及关闭房间后再打开面板，
// 都会被当成开局信号，表现为「一进房就直接开始」「再点联机房间就直接开始」。
let lastRoomPhase = null;

function escRoom(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function renderRoomLobby(snap) {
  roomState = snap;
  const box = document.getElementById('roomLobby');
  if (!box) return;

  // 未加入：只显示「建房 / 输入房间码加入」
  if (!snap.code) {
    box.innerHTML =
      '<div class="room-actions">' +
      '<button class="btn-action" id="roomCreate">创建房间</button>' +
      '</div>' +
      '<div class="sp-sec-title" style="margin-top:16px">加入房间</div>' +
      '<div class="room-code">' +
      '<input maxlength="1" data-rc="0" autocomplete="off">' +
      '<input maxlength="1" data-rc="1" autocomplete="off">' +
      '<input maxlength="1" data-rc="2" autocomplete="off">' +
      '<input maxlength="1" data-rc="3" autocomplete="off">' +
      '</div>' +
      '<div class="room-actions">' +
      '<button class="btn-action" id="roomJoin">加入</button>' +
      '<button class="btn-action" id="roomJoinSpec">观战</button>' +
      '</div>' +
      '<div class="room-err" id="roomErr"></div>';
    bindRoomLobby(box);
    return;
  }

  // 已加入：显示房间码、席位、阶段与操作
  let seats = '';
  const me = snap.me;
  const taken = {};
  snap.seats.forEach(function (s) { taken[s.username] = s.role; });
  const seatsToShow = snap.seats.slice();
  for (let i = seatsToShow.length; i < snap.seatSlots; i++) seatsToShow.push(null);
  seatsToShow.forEach(function (s) {
    if (!s) {
      seats += '<div class="room-seat is-empty"><span class="rs-name">空席</span></div>';
      return;
    }
    const isHost = s.username === snap.host;
    const isMe = s.username === me;
    seats += '<div class="room-seat' + (isHost ? ' is-host' : '') + (isMe ? ' is-me' : '') +
      (s.role === 'spectator' ? ' is-spectator' : '') + '">' +
      '<span class="rs-name">' + escRoom(s.username) + '</span>' +
      (isHost ? '<span class="rs-tag host">房主</span>' : '') +
      (s.role === 'spectator' ? '<span class="rs-tag spectator">观战</span>' : '') +
      '<span style="flex:1"></span>' +
      (s.ready ? '<span class="rs-ready">已准备</span>' : '<span class="rs-wait">未准备</span>') +
      '</div>';
    void taken;
  });
  for (let i = 0; i < snap.spectatorSlots; i++) {
    seats += '<div class="room-seat is-empty is-spectator"><span class="rs-name">观战席 ' + (i + 1) + '</span></div>';
  }

  const mine = snap.seats.filter(function (s) { return s.username === me; })[0];
  const allReady = snap.seats.filter(function (s) { return s.role === 'seat'; })
    .every(function (s) { return s.ready; }) && snap.seatCount > 0;

  box.innerHTML =
    '<div class="room-phase-row">' +
    '<span class="room-phase-label">' + escRoom(snap.phaseLabel) + '</span>' +
    '<span class="room-mates-conn room-conn ' + (snap.connected ? 'on' : 'off') + '">' +
    (snap.connected ? '实时同步中' : '轮询同步中') + '</span>' +
    '</div>' +
    '<div class="sp-sec-title">房间码</div>' +
    '<div class="room-code">' + escRoom(snap.code).split('').map(function (ch) {
      return '<input value="' + escRoom(ch) + '" readonly>';
    }).join('') + '</div>' +
    '<div class="sp-sec-title">席位 ' + snap.seatCount + '/' + snap.seatSlots + '</div>' +
    '<div class="room-seats">' + seats + '</div>' +
    '<div class="room-actions">' +
    '<button class="btn-action" id="roomReady">' + (mine && mine.ready ? '取消准备' : '准备就绪') + '</button>' +
    '<button class="btn-action" id="roomCopy">复制邀请链接</button>' +
    (snap.isHost ? '<button class="btn-action" id="roomStart"' + (allReady ? '' : ' disabled') + '>开始作战</button>' : '') +
    (snap.isHost ? '<button class="btn-action" id="roomClose">解散房间</button>' : '') +
    '<button class="btn-action" id="roomLeave">离开</button>' +
    '</div>' +
    '<div class="room-err" id="roomErr"></div>';
  bindRoomLobby(box);
}

function roomErr(msg) {
  const el = document.getElementById('roomErr');
  if (el) el.textContent = msg || '';
}

function bindRoomLobby(box) {
  const R = window.WeishuRoom;
  if (!R) return;

  // 房间码输入：自动跳格、退格回退、只接受字母数字
  const cells = box.querySelectorAll('.room-code input[data-rc]');
  cells.forEach(function (inp) {
    inp.addEventListener('input', function () {
      inp.value = inp.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 1);
      const i = Number(inp.dataset.rc);
      if (inp.value && cells[i + 1]) cells[i + 1].focus();
      roomErr('');
    });
    inp.addEventListener('keydown', function (e) {
      const i = Number(inp.dataset.rc);
      if (e.key === 'Backspace' && !inp.value && cells[i - 1]) {
        cells[i - 1].focus();
        cells[i - 1].value = '';
      }
    });
  });

  function codeOf() {
    let s = '';
    box.querySelectorAll('.room-code input[data-rc]').forEach(function (i) { s += i.value; });
    return s;
  }

  const b = function (id) { return box.querySelector('#' + id); };
  if (b('roomCreate')) {
    b('roomCreate').addEventListener('click', function () {
      roomErr('');
      R.makeRoom(state.mode).then(function (r) {
        if (r.code !== 200) roomErr(r.msg || '创建失败');
      });
    });
  }
  const doJoin = function (role) {
    roomErr('');
    const c = codeOf();
    if (c.length !== R.MAX_SEATS && c.length !== 4) { roomErr('房间码为 4 位'); return; }
    R.join(c, role).then(function (r) {
      if (r.code !== 200) { roomErr(r.msg || '加入失败'); return; }
      // 加入成功后对齐当前阶段：否则上一个房间残留的 PREP 会被
      // 下一次 onChange 当成「房主刚开局」，队友一进房就被拉进对局。
      lastRoomPhase = R.snapshot().phase;
    });
  };
  if (b('roomJoin')) b('roomJoin').addEventListener('click', function () { doJoin('seat'); });
  if (b('roomJoinSpec')) b('roomJoinSpec').addEventListener('click', function () { doJoin('spectator'); });
  if (b('roomReady')) {
    b('roomReady').addEventListener('click', function () {
      const snap = R.snapshot();
      const mine = snap.seats.filter(function (s) { return s.username === snap.me; })[0];
      R.setReady(!(mine && mine.ready)).then(function (r) {
        if (r.code !== 200) roomErr(r.msg || '操作失败');
        R.notifySeat();
      });
    });
  }
  if (b('roomCopy')) {
    b('roomCopy').addEventListener('click', function () {
      const snap = R.snapshot();
      const url = location.origin + location.pathname + '?room=' + snap.code;
      const done = function () { flashTip('邀请链接已复制'); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, function () { flashTip(url); });
      } else {
        flashTip(url);
      }
    });
  }
  if (b('roomStart')) {
    b('roomStart').addEventListener('click', function () {
      R.hostUpdate({ phase: R.PHASE.PREP, round: 1 }).then(function (r) {
        if (r.code !== 200) { roomErr(r.msg || '开始失败'); return; }
        // 房间阶段推进后必须把游戏侧也启动起来。
        // 原来成功就直接返回：只改房间的 phase，游戏仍停在欢迎界面，
        // 表现为「点开始作战毫无反应」。startSimulation 全站只有配队确认
        // 一处调用，没有任何地方响应房间进入 PREP —— 断链就在这里。
        startGameFromRoom();
      });
    });
  }
  if (b('roomClose')) {
    b('roomClose').addEventListener('click', function () {
      showConfirm('解散房间', '将解散房间并让所有成员退出，确定？', function () {
        R.closeRoom().then(function (r) { if (r.code !== 200) roomErr(r.msg || '解散失败'); });
      });
    });
  }
  if (b('roomLeave')) {
    b('roomLeave').addEventListener('click', function () {
      R.leave().then(function () { flashTip('已离开房间'); });
    });
  }
}

// 从房间进入对局：关房间面板，再走与「开始模拟」完全相同的开局入口
// （initGame + showModeSelect -> 模式 -> 防守策略 -> 配队 -> 休整期）。
// 房主由 roomStart 调用，非房主在房间 phase 变为 PREP 时调用。
// 守卫：已在对局中就不重复开，避免房间里来回切换把当前对局冲掉。
function startGameFromRoom() {
  if (state.phase === 'prep' || state.phase === 'battle') return;
  const modal = document.getElementById('roomModal');
  if (modal) modal.classList.remove('active');
  initGame();
  showModeSelect();
}

function initRoomUi() {
  const R = window.WeishuRoom;
  const btn = document.getElementById('btnRoom');
  if (!R || !btn) return;

  btn.addEventListener('click', function () {
    if (state.phase === 'prep' || state.phase === 'battle') {
      showModal('联机房间', '<div class="supply-panel"><div class="sp-row"><span>当前状态</span><span class="v">对局进行中，可在休整期切换</span></div></div>');
      return;
    }
    lastRoomPhase = R.snapshot().phase;
    renderRoomLobby(R.snapshot());
    document.getElementById('roomModal').classList.add('active');
  });

  roomUnsub = R.onChange(function (snap) {
    const modal = document.getElementById('roomModal');
    if (modal && modal.classList.contains('active')) renderRoomLobby(snap);
    if (!snap) return;
    const was = lastRoomPhase;
    lastRoomPhase = snap.phase;
    // 非房主跟随房主开局：只在阶段「变化」到 PREP 时启动。
    // 房主自己由 roomStart 直接调 startGameFromRoom，这里只负责跟随者，
    // 否则队友会一直停在房间面板上等一个永远不会来的开局。
    // 已在对局中时 startGameFromRoom 内部会返回，不会重复开。
    if (was && was !== R.PHASE.PREP && snap.phase === R.PHASE.PREP && !snap.isHost) {
      startGameFromRoom();
    }
  });

  // 支持 ?room=CODE 直达：进房后自动打开面板并填好
  const m = /[?&]room=([A-Za-z0-9]{4})/.exec(location.search);
  if (m) {
    R.join(m[1].toUpperCase(), 'seat').then(function (r) {
      if (r.code !== 200) { flashTip('加入失败：' + (r.msg || '')); return; }
      // 同上：直达进房也要对齐阶段，不把已有的 PREP 当成开局信号
      lastRoomPhase = R.snapshot().phase;
      renderRoomLobby(R.snapshot());
      document.getElementById('roomModal').classList.add('active');
    });
  }
}

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
  const rings = [];
  let last = 0;
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
    shake = Math.max(0, shake - 6 * dt);
    flash = Math.max(0, flash - 0.09 * dt * 60);
    const offX = Math.sin(t * 6.9) * shake;
    const offY = Math.cos(t * 5.7) * shake * 0.7;
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.translate(offX, offY);
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
    }
  };
}
let warpFX = null;
function warpTrigger(mode) {
  if (!warpFX) { try { warpFX = warpInit(); } catch (e) { return; } }
  warpFX.trigger(mode || 'auto');
}
window.addEventListener('keydown', function (e) {
  if (e.code === 'Space') { e.preventDefault(); warpTrigger('manual'); }
});
