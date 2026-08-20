// ============================================================
//  卫戍协议 v4.0 · 星河防线
//  核心机制：
//  ① 战前配队：物资调配处从全舰船池选择本局舰队（航母≤2含搭载、
//     战巡≤2、其余舰种各≤5），选中舰船进入手牌区
//  ② 城防舰队：敌方按回合使用 2/3/5/7/9 级城防配置
//     （来源：Lagrange's encyclopedia.xlsx City defense 表）
//  ③ 舰队编组战斗：左方玩家舰队 vs 右方敌方舰队，实弹/能量、
//     装甲/护盾、直射/投射/防空锁定、编队自动对轰
//  ④ 强化点：每回合结束奖励 + 击杀敌方舰船获得，
//     在本局蓝图数据库（手牌区舰船）中强化
//  ⑤ 卫戍协议框架：三种模式、势力生命结算、驳船补给等级、
//     同名合成、装备、战术支援、回合强化
//  ⑥ 舰队强化系统联动：读取 enhance.js 的 localStorage 强化状态
// ============================================================

// ============================================================
//  0. 全局配置
// ============================================================
const CONFIG = {
  TIER_NAMES: ['I', 'II', 'III', 'IV', 'V', 'VI'],
  MODES: {
    beginner:  { name: '入门协议', life: 20, funds: [5, 13, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10], tech: [2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7] },
    prototype: { name: '原型协议', life: 45, funds: [5, 6, 7, 8, 9, 10, 11, 12, 12, 12, 12, 12, 12, 12, 12], tech: [3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10] },
    core:      { name: '核心协议', life: 45, funds: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 12, 12, 12, 12], tech: [4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11] }
  },
  // 驳船补给等级：舰船卡位/装备卡位/战术卡位/护盾值/初始升级价
  BARGE: [
    { ships: 1, equips: 0, spells: 0, shield: 1, cost: 2 },
    { ships: 2, equips: 1, spells: 0, shield: 1, cost: 4 },
    { ships: 4, equips: 1, spells: 0, shield: 2, cost: 6 },
    { ships: 5, equips: 2, spells: 0, shield: 2, cost: 9 },
    { ships: 5, equips: 2, spells: 1, shield: 3, cost: 12 },
    { ships: 5, equips: 2, spells: 1, shield: 3, cost: 0 }
  ],
  REFRESH_COST: 2,
  FREEZE_COST: 2,
  SELL_PRICE: 1,
  ROUND_CLOCK: 60,
  BREACH_CAP: 20,
  ASSAULT_FACTOR: 0.025,
  MERGE_COUNT: 3,
  UPGRADE_ROUNDS: [3, 6, 10, 12, 14],
  HAND_LIMIT: 40,
  // 城防等级按回合划分（用户指定）
  CITY_LEVEL_BY_ROUND: [
    null, 2, 2, 2, 3, 3, 3, 5, 5, 7, 7, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9
  ],
  // 配队限制：航母≤2（含搭载战机/护航艇）、战巡≤2、其余各≤5
  DEPLOY_LIMIT: {
    carrier: 2, battlecruiser: 2, battleship: 2,
    frigate: 5, destroyer: 5, cruiser: 5, fighter: 5, corvette: 5, support: 5
  }
};

// 舰种中文映射
const CLS_ZH = {
  frigate: '护卫舰', destroyer: '驱逐舰', cruiser: '巡洋舰',
  battlecruiser: '战列巡洋舰', battleship: '战列舰', carrier: '航空母舰',
  fighter: '战机', corvette: '护航艇', support: '支援舰'
};
const WEAPON_LABEL = { direct: '直射', projectile: '投射', air: '防空' };
const DMGTYPE_LABEL = { physical: '实弹', energy: '能量' };

// 锁定序列（投射武器：航母→战巡→巡洋→驱逐→护卫）
const LOCK_SEQUENCE = [
  { cls: 'carrier', label: '航空母舰' },
  { cls: 'battlecruiser', label: '战列巡洋舰' },
  { cls: 'battleship', label: '战列舰' },
  { cls: 'cruiser', label: '巡洋舰' },
  { cls: 'destroyer', label: '驱逐舰' },
  { cls: 'frigate', label: '护卫舰' },
  { cls: 'corvette', label: '护航艇' }
];

// ============================================================
//  1. 我方舰船池（从 SHIP_STATS 提取全部舰船 + 战斗属性）
// ============================================================
const CLS_TYPE_MAP = {
  '护卫舰': 'frigate', '驱逐舰': 'destroyer', '巡洋舰': 'cruiser',
  '战列巡洋舰': 'battlecruiser', '战列舰': 'battleship',
  'aircraftcarrier': 'carrier', '航空母舰': 'carrier',
  'support': 'support', '支援舰': 'support',
  '战机': 'fighter', '护航艇': 'corvette'
};

function clampNum(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function hashStr(s) { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 9973; return h; }

function weaponProfile(cls, name) {
  const p = { rate: 1, range: 3, weapon: 'direct', dmgType: 'physical', shield: 0 };
  const n = name || '';
  if (/离子|脉冲|能量|轨道|激光/.test(n)) p.dmgType = 'energy';
  if (/鱼雷|导弹/.test(n)) p.weapon = 'projectile';
  if (/防空/.test(n)) p.weapon = 'air';
  switch (cls) {
    case 'frigate': p.rate = 1.2; p.range = 2.4; break;
    case 'destroyer': p.rate = 0.9; p.range = 2.8; if (!/鱼雷|导弹/.test(n)) p.weapon = 'projectile'; break;
    case 'cruiser': p.rate = 0.75; p.range = 3.4; if (!/防空/.test(n)) p.weapon = 'projectile'; break;
    case 'battlecruiser': p.rate = 0.6; p.range = 4.2; p.dmgType = 'energy'; break;
    case 'battleship': p.rate = 0.5; p.range = 4.6; p.weapon = 'direct'; p.dmgType = 'energy'; break;
    case 'carrier': p.rate = 1.1; p.range = 3.2; p.weapon = 'air'; break;
    case 'fighter': p.rate = 1.8; p.range = 3.0; p.weapon = 'air'; break;
    case 'corvette': p.rate = 1.4; p.range = 2.5; p.weapon = 'projectile'; break;
    case 'support': p.rate = 0.8; p.range = 3.4; p.weapon = 'direct'; break;
  }
  return p;
}

let SHIP_POOL_CACHE = null;
function buildShipPool() {
  if (SHIP_POOL_CACHE) return SHIP_POOL_CACHE;
  const stats = window.SHIP_STATS || {};
  const pool = [];
  for (const key in stats) {
    const list = stats[key];
    if (!list || !list.length) continue;
    const s0 = list[0];
    const cls = CLS_TYPE_MAP[s0.type] || 'frigate';
    const name = s0.name || key;
    const wp = weaponProfile(cls, name);
    const hp = clampNum(Math.round((s0.hp || 0) / 100), 20, 3000);
    const dpm = (s0.firepower && s0.firepower.antiShip) || 0;
    const dmg = clampNum(Math.round(dpm / 200), 8, 600);
    pool.push({
      id: key,
      name: name,
      shortName: name.split('-')[0],
      cls: cls,
      type: s0.type || cls,
      hp: hp,
      dmg: dmg,
      armor: clampNum(Math.round((s0.physicalArmor || 0) / 12), 0, 30),
      rate: wp.rate,
      range: wp.range,
      weapon: wp.weapon,
      dmgType: wp.dmgType,
      shield: wp.dmgType === 'energy' ? Math.round(hp * 0.15) : 0,
      maxShip: s0.maxShip || 5,
      desc: s0.desc || ''
    });
  }
  // 排序：按舰种顺序
  const order = ['carrier', 'battlecruiser', 'battleship', 'cruiser', 'destroyer', 'frigate', 'fighter', 'corvette', 'support'];
  pool.sort((a, b) => order.indexOf(a.cls) - order.indexOf(b.cls) || b.hp - a.hp);
  SHIP_POOL_CACHE = pool;
  return pool;
}

// ============================================================
//  2. 装备 / 战术支援 蓝图
// ============================================================
const EQUIP_BLUEPRINTS = [
  { id: 'dmg',    name: '火力增幅器', cost: 3, desc: '攻击力 +25%', apply: t => { t.dmgMul *= 1.25; } },
  { id: 'armor',  name: '装甲镀层',   cost: 3, desc: '装甲 +3',      apply: t => { t.armorBonus += 3; } },
  { id: 'hp',     name: '结构加固',   cost: 3, desc: '生命上限 +30%', apply: t => { t.hpMul *= 1.3; } },
  { id: 'rate',   name: '急速火控',   cost: 2, desc: '攻击速度 +25%', apply: t => { t.rateMul *= 1.25; } },
  { id: 'range',  name: '长程制导',   cost: 2, desc: '射程 +1',      apply: t => { t.rangeBonus += 1; } },
  { id: 'shield', name: '能量护盾',   cost: 4, desc: '护盾 +40',     apply: t => { t.shieldBonus += 40; } },
  { id: 'energy', name: '能量核心',   cost: 4, desc: '能量伤害 +40%', apply: t => { t.energyMul *= 1.4; } },
  { id: 'crit',   name: '火控核心',   cost: 4, desc: '暴击率 +15%',  apply: t => { t.critBonus += 0.15; } }
];
const EQUIP_MAX_LV = 3;

const SPELL_BLUEPRINTS = [
  { id: 'bomb',      name: '轨道轰炸',   cost: 5, desc: '对全部敌人造成我方总攻击力 300% 的伤害' },
  { id: 'emp',       name: '全域EMP',    cost: 4, desc: '敌方全体停火 3 秒' },
  { id: 'repair',    name: '紧急修复',   cost: 4, desc: '我方全体舰船恢复 40% 生命' },
  { id: 'reinforce', name: '舰载机增援', cost: 5, desc: '立即获得 1 艘随机战机/护航艇加入战场' },
  { id: 'freeze',    name: '时间冻结',   cost: 4, desc: '敌方停止移动 3 秒' },
  { id: 'shield',    name: '质子护盾',   cost: 3, desc: '本回合我方护盾 +5' },
  { id: 'corrode',   name: '纳米腐蚀',   cost: 5, desc: '敌方每秒损失 3% 生命，持续 5 秒' },
  { id: 'focus',     name: '集火指令',   cost: 3, desc: '本回合我方全体攻击力 +30%' }
];

// ============================================================
//  3. 防守策略（无明日方舟角色名）
// ============================================================
const DEFENSE_STRATEGIES = [
  {
    id: 'aegis', name: '全域防御协议', icon: '◆', life: 24, org: '联合防御舰队',
    unlock: 'initial',
    desc: '我方生命 24。所有舰船攻击力、装甲 +15%，敌方攻击力 -20%。',
    effect: () => { state.bonuses.dmgMul *= 1.15; state.bonuses.armorMul = 1.15; state.enemyDmgMul = 0.8; }
  },
  {
    id: 'swift', name: '快刀乱麻', icon: '✦', life: 14, org: '雷火科技突击舰队',
    unlock: 'prototype',
    desc: '我方生命 14。攻击力最高的舰船攻击力 +70%，攻速 +30%。',
    effect: () => { state.swift = true; }
  },
  {
    id: 'recycle', name: '回收利用', icon: '◈', life: 18, org: '诺玛运输护航编队',
    unlock: 'prototype',
    desc: '我方生命 18。每击倒 12 名敌人，战斗结束时奖励 3 资金。',
    effect: () => { state.recycle = true; }
  },
  {
    id: 'gamer', name: '游戏高手', icon: '◈', life: 16, org: '比邻星同盟贸易舰队',
    unlock: 'prototype',
    desc: '我方生命 16。每消耗 20 资金，获得 1 艘随机不高于当前补给等级的舰船。',
    effect: () => { state.gacha = true; }
  },
  {
    id: 'intel', name: '内部情报', icon: '◈', life: 30, org: '未央资助计划情报处',
    unlock: 'core',
    desc: '我方生命 30。每回合第一次刷新免费，可刷出当前补给等级 +1 的舰船。',
    effect: () => { state.intel = true; }
  },
  {
    id: 'spell', name: '战术优势', icon: '◈', life: 45, org: '维塔斯A-21实验编队',
    unlock: 'core',
    desc: '我方生命 45。补给等级到达 3 级后，每回合开始时随机获得 1 个战术支援。',
    effect: () => { state.spellStrategy = true; }
  },
  {
    id: 'drill', name: '教官团队', icon: '◈', life: 22, org: '木星工业学院',
    unlock: 'coreCleared',
    desc: '我方生命 22。同名舰船仅需 2 艘即可合成精锐，合成时额外奖励 1 资金。',
    effect: () => { state.mergeCount = 2; state.mergeBonus = 1; }
  },
  {
    id: 'craft', name: '精研技艺', icon: '◈', life: 20, org: '安东尼奥斯研究所',
    unlock: 'coreCleared',
    desc: '我方生命 20。购买舰船资金 -1，购买装备和刷新资金 +1。',
    effect: () => { state.craft = true; }
  }
];

// ============================================================
//  4. 回合强化池
// ============================================================
const UPGRADE_POOL = [
  { name: '资金注入 +12', desc: '立即获得 12 资金', effect: () => { state.funds += 12; } },
  { name: '全舰攻击 +15%', desc: '所有舰船攻击力 +15%', effect: () => { state.bonuses.dmgMul *= 1.15; } },
  { name: '全舰攻速 +20%', desc: '所有舰船攻击速度 +20%', effect: () => { state.bonuses.rateMul *= 1.2; } },
  { name: '全舰装甲 +3', desc: '所有舰船装甲 +3', effect: () => { state.bonuses.armorBonus += 3; } },
  { name: '生命 +3', desc: '我方生命上限 +3', effect: () => { state.maxLife += 3; state.life = Math.min(state.maxLife, state.life + 3); } },
  { name: '射程 +0.5', desc: '所有舰船射程 +0.5', effect: () => { state.bonuses.rangeBonus += 0.5; } },
  { name: '免费舰船', desc: '立即获得 1 艘随机当前等级舰船', effect: () => { grantRandomShip(); } },
  { name: '直射武器伤害 +25%', desc: '直射武器伤害 +25%', effect: () => { state.bonuses.directMul *= 1.25; } },
  { name: '投射武器伤害 +25%', desc: '投射武器伤害 +25%', effect: () => { state.bonuses.projMul *= 1.25; } },
  { name: '防空火力 +40%', desc: '防空武器伤害 +40%', effect: () => { state.bonuses.airMul *= 1.4; } },
  { name: '护盾值 +2', desc: '每回合护盾值 +2', effect: () => { state.bonuses.shieldBonus += 2; } },
  { name: '全舰暴击率 +10%', desc: '所有舰船暴击率 +10%', effect: () => { state.bonuses.critChance += 0.1; } },
  { name: '精锐化协议', desc: '随机 1 艘舰船立即晋升为精锐', effect: () => { eliteRandomShip(); } },
  { name: '装备补给', desc: '立即获得 2 件随机装备', effect: () => { grantRandomEquips(2); } },
  { name: '战术补给', desc: '立即获得 1 个随机战术支援', effect: () => { grantRandomSpell(); } }
];

// ============================================================
//  5. 状态
// ============================================================
let state = null;
let battleTimer = null;
let uiTimer = null;
let clockLeft = 0;
let overtime = 0;
let toxicActive = false;
let newsList = [];
let selectedHandIdx = null;

const PROGRESS_KEY = 'ueg_weishu_progress';
const STATS_KEY = 'ueg_weishu_stats';

function loadProgress() {
  try {
    const p = JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
    return { beginner: true, prototype: !!p.prototype, core: !!p.core, coreCleared: !!p.coreCleared };
  } catch (e) { return { beginner: true, prototype: false, core: false, coreCleared: false }; }
}
function saveProgress() {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify({ prototype: state.progress.prototype, core: state.progress.core, coreCleared: state.progress.coreCleared })); } catch (e) {}
}
function loadStats() {
  try { return JSON.parse(localStorage.getItem(STATS_KEY)) || { wins: 0, losses: 0, kills: 0, bestWave: 0 }; }
  catch (e) { return { wins: 0, losses: 0, kills: 0, bestWave: 0 }; }
}
function saveStats() {
  try { localStorage.setItem(STATS_KEY, JSON.stringify(state.stats)); } catch (e) {}
}

// 舰队强化联动（enhance.js localStorage）
function computeEnhanceMul() {
  try {
    const st = JSON.parse(localStorage.getItem('ueg_enhance_state') || '{}');
    let total = 0;
    for (const k in st) { const s = st[k]; for (const sys in s) { const t = s[sys]; for (const tech in t) { total += Number(t[tech]) || 0; } } }
    return 1 + Math.min(0.5, total * 0.001);
  } catch (e) { return 1; }
}
function shipEnhanceBonus(name) {
  try {
    const st = JSON.parse(localStorage.getItem('ueg_enhance_state') || '{}');
    let lv = 0;
    for (const k in st) {
      if (k.includes(name) || name.includes(k.split('·')[0])) {
        const s = st[k];
        for (const sys in s) { const t = s[sys]; for (const tech in t) { lv += Number(t[tech]) || 0; } }
      }
    }
    return lv > 0 ? 1 + Math.min(0.4, lv * 0.004) : 1;
  } catch (e) { return 1; }
}
function getEnhanceSummary() {
  try {
    const st = JSON.parse(localStorage.getItem('ueg_enhance_state') || '{}');
    let total = 0, ships = 0;
    for (const k in st) { ships++; const s = st[k]; for (const sys in s) { const t = s[sys]; for (const tech in t) { total += Number(t[tech]) || 0; } } }
    return { totalLevels: total, ships: ships, mul: 1 + Math.min(0.5, total * 0.001) };
  } catch (e) { return { totalLevels: 0, ships: 0, mul: 1 }; }
}

// ============================================================
//  6. 初始化
// ============================================================
function initGame() {
  state = {
    phase: 'welcome',
    mode: 'beginner',
    strategy: null,
    progress: loadProgress(),
    stats: loadStats(),
    factions: [],
    factionHp: [],
    factionMaxHp: [],
    maxLife: 10,
    life: 10,
    shield: 1,
    wave: 1,
    funds: 0,
    techPoints: 0,
    bargeLevel: 1,
    upgradeDiscount: 0,
    pool: [],
    poolFrozen: false,
    hand: [],          // 手牌区 = 我方舰队编组
    enemies: [],       // 敌方舰队
    units: [],         // 我方战斗单位
    totalKills: 0,
    killsThisRound: 0,
    spentFunds: 0,
    roundLifeLost: 0,
    permits: 0,
    bonuses: {
      dmgMul: 1, rateMul: 1, armorBonus: 0, armorMul: 1, rangeBonus: 0,
      directMul: 1, projMul: 1, airMul: 1, shieldBonus: 0, critChance: 0, energyMul: 1
    },
    enhanceMul: computeEnhanceMul(),
    enemyDmgMul: 1,
    swift: false, recycle: false, gacha: false, intel: false, spellStrategy: false,
    mergeCount: CONFIG.MERGE_COUNT, mergeBonus: 0, craft: false,
    gachaCount: 0,
    firstRefreshFree: false,
    battleFocusMul: 1,
    upgradeTriggered: {},
    reward: { tech: 0, coin: 0 }
  };
  selectedHandIdx = null;
  newsList = [];
  renderWelcome();
}

function renderWelcome() {
  const panel = document.getElementById('leftPanel');
  panel.dataset.mode = 'welcome';
  const enh = getEnhanceSummary();
  panel.innerHTML = `
    <div class="welcome">
      <span class="big-icon">◆</span>
      <h2>卫戍协议</h2>
      <p>星河防线 · 舰队塔防</p>
      <div class="hint">点击「开始模拟」进入作战</div>
      <div style="margin-top:16px;font-size:0.75rem;color:#5e7a8c;line-height:1.9;">
        模式进度：入门 ${state.progress.beginner ? '解锁' : '锁定'} ｜ 原型 ${state.progress.prototype ? '解锁' : '锁定'} ｜ 核心 ${state.progress.core ? '解锁' : '锁定'}
      </div>
      <div style="margin-top:8px;font-size:0.72rem;color:#7a5a3a;border:1px dashed #5a4a2a;padding:8px;display:inline-block;">
        舰队强化联动：${enh.totalLevels} 级技术 · 全属性 +${Math.round((state.enhanceMul - 1) * 100)}%
      </div>
    </div>
  `;
}

// ============================================================
//  7. 模式 / 策略选择
// ============================================================
function showModeSelect() {
  const modal = document.getElementById('modeModal');
  const list = document.getElementById('modeList');
  const p = state.progress;
  const rules = {
    beginner: '势力生命 20 · 第1回合5资金，第2回合13资金，之后每回合10资金',
    prototype: '势力生命 45 · 第1回合5资金，之后每回合+1，上限12 · 通关入门解锁',
    core: '势力生命 45 · 第1回合3资金，之后每回合+1，上限12 · 通关原型解锁'
  };
  list.innerHTML = ['beginner', 'prototype', 'core'].map(m => {
    const cfg = CONFIG.MODES[m];
    const locked = (m === 'prototype' && !p.prototype) || (m === 'core' && !p.core);
    return `
      <div class="mode-card ${locked ? 'locked' : ''}" data-mode="${m}">
        <div class="mc-head">
          <span class="mc-name">${cfg.name}</span>
          <span class="mc-status">${locked ? '未解锁' : '可选'}</span>
        </div>
        <div class="mc-desc">${rules[m]}</div>
        <div class="mc-rules">${locked ? (m === 'prototype' ? '通关入门协议后解锁' : '通关原型协议后解锁') : ''}</div>
      </div>`;
  }).join('');
  list.querySelectorAll('.mode-card').forEach(card => {
    card.addEventListener('click', () => {
      if (card.classList.contains('locked')) { flashTip('该模式尚未解锁'); return; }
      state.mode = card.dataset.mode;
      modal.classList.remove('active');
      showStrategySelect();
    });
  });
  modal.classList.add('active');
}

function strategyUnlocked(s) {
  const p = state.progress;
  if (s.unlock === 'prototype') return p.prototype;
  if (s.unlock === 'core') return p.core;
  if (s.unlock === 'coreCleared') return p.coreCleared;
  return true;
}
function showStrategySelect() {
  const modal = document.getElementById('strategyModal');
  const list = document.getElementById('strategyList');
  const avail = DEFENSE_STRATEGIES.filter(s => strategyUnlocked(s));
  const shuffled = [...avail].sort(() => Math.random() - 0.5);
  const choices = shuffled.slice(0, 3);
  list.innerHTML = choices.map(s => `
    <div class="strat-card" data-id="${s.id}">
      <div class="strat-header">
        <span class="strat-icon">${s.icon}</span>
        <span class="strat-name">${s.name}</span>
        <span class="strat-hero">${s.org}</span>
      </div>
      <div class="strat-desc">${s.desc}</div>
    </div>
  `).join('');
  list.querySelectorAll('.strat-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      state.strategy = DEFENSE_STRATEGIES.find(s => s.id === id);
      modal.classList.remove('active');
      flashTip('已选择策略：' + state.strategy.name);
      // 选择策略后进入配队
      showDeployModal();
    });
  });
  modal.classList.add('active');
}

// ============================================================
//  8. 配队（战前舰船选择，选中进手牌区）
// ============================================================
function showDeployModal() {
  const modal = document.getElementById('deployModal');
  const body = document.getElementById('deployBody');
  const pool = buildShipPool();
  const selected = new Set(state.hand.map(c => c.ship.id));

  // 按舰种分组
  const groups = {};
  for (const s of pool) (groups[s.cls] = groups[s.cls] || []).push(s);

  let html = '<div class="deploy-layout">';
  html += '<div class="deploy-left">';
  const clsOrder = ['carrier', 'battlecruiser', 'battleship', 'cruiser', 'destroyer', 'frigate', 'fighter', 'corvette', 'support'];
  for (const cls of clsOrder) {
    const list = groups[cls] || [];
    if (!list.length) continue;
    const limit = CONFIG.DEPLOY_LIMIT[cls];
    const cnt = state.hand.filter(c => c.ship.cls === cls).length;
    html += `<div class="dp-group">
      <div class="dp-group-title">${CLS_ZH[cls]} <span class="dp-limit">${cnt}/${limit}</span></div>
      <div class="dp-ships">`;
    list.forEach(s => {
      const on = selected.has(s.id);
      const disabled = !on && cnt >= limit;
      html += `<div class="dp-ship ${on ? 'on' : ''} ${disabled ? 'off' : ''}" data-id="${s.id}">
        <div class="dp-name">${s.name}</div>
        <div class="dp-stats">HP ${s.hp} · 攻 ${s.dmg} · 甲 ${s.armor} · ${WEAPON_LABEL[s.weapon]}${DMGTYPE_LABEL[s.dmgType]}</div>
      </div>`;
    });
    html += '</div></div>';
  }
  html += '</div>';

  html += '<div class="deploy-right">';
  html += `<div class="dp-right-title">已选舰队（${state.hand.length} 艘）</div>`;
  html += '<div class="dp-selected" id="dpSelected">';
  if (!state.hand.length) html += '<div style="color:#5a6b7d;font-size:0.72rem;">尚未选择舰船</div>';
  state.hand.forEach((card, i) => {
    html += `<div class="dp-sel-item"><span>${card.ship.name}</span><button class="btn-action small danger" data-remove="${i}">移除</button></div>`;
  });
  html += '</div>';
  html += `<div class="dp-actions">
    <button class="btn-action primary-btn" id="deployConfirm">确认配队，开始模拟</button>
    <button class="btn-action" id="deployClear">清空</button>
  </div>`;
  html += '</div></div>';
  body.innerHTML = html;
  modal.classList.add('active');

  // 舰船点击
  body.querySelectorAll('.dp-ship').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.id;
      const s = pool.find(x => x.id === id);
      const idx = state.hand.findIndex(c => c.ship.id === id);
      if (idx > -1) {
        state.hand.splice(idx, 1);
        flashTip('已移除：' + s.name);
      } else {
        const cnt = state.hand.filter(c => c.ship.cls === s.cls).length;
        if (cnt >= CONFIG.DEPLOY_LIMIT[s.cls]) { flashTip('该舰种已达配队上限'); return; }
        state.hand.push({ ship: s, elite: false, equips: [], lv: {}, kills: 0, lastFireTime: 0 });
        flashTip('已加入手牌区：' + s.name);
      }
      showDeployModal();
    });
  });
  // 移除
  body.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.remove);
      state.hand.splice(i, 1);
      showDeployModal();
    });
  });
  // 确认
  document.getElementById('deployConfirm').addEventListener('click', () => {
    if (!state.hand.length) { flashTip('请至少选择 1 艘舰船'); return; }
    modal.classList.remove('active');
    startSimulation();
  });
  document.getElementById('deployClear').addEventListener('click', () => {
    state.hand = [];
    showDeployModal();
  });
}

// ============================================================
//  9. 开始模拟
// ============================================================
function startSimulation() {
  const f1 = ENEMY_FACTIONS[Math.floor(Math.random() * ENEMY_FACTIONS.length)];
  let f2 = ENEMY_FACTIONS[Math.floor(Math.random() * ENEMY_FACTIONS.length)];
  while (f2 === f1) f2 = ENEMY_FACTIONS[Math.floor(Math.random() * ENEMY_FACTIONS.length)];
  state.factions = [f1, f2];
  const life = CONFIG.MODES[state.mode].life;
  state.factionMaxHp = [life, life];
  state.factionHp = [life, life];
  state.maxLife = state.strategy.life;
  state.life = state.strategy.life;
  state.funds = 0;
  state.techPoints = 0;
  state.wave = 1;
  state.upgradeDiscount = 0;
  state.totalKills = 0;
  state.spentFunds = 0;
  state.permits = 0;
  state.bargeLevel = 1;
  state.pool = [];
  state.enemies = [];
  state.units = [];
  state.bonuses = {
    dmgMul: 1, rateMul: 1, armorBonus: 0, armorMul: 1, rangeBonus: 0,
    directMul: 1, projMul: 1, airMul: 1, shieldBonus: 0, critChance: 0, energyMul: 1
  };
  state.enhanceMul = computeEnhanceMul();
  state.enemyDmgMul = 1;
  state.swift = false; state.recycle = false; state.gacha = false; state.intel = false; state.spellStrategy = false;
  state.mergeCount = CONFIG.MERGE_COUNT; state.mergeBonus = 0; state.craft = false;
  state.gachaCount = 0;
  state.upgradeTriggered = {};
  // 手牌区舰船初始化战斗状态
  state.hand.forEach(c => {
    c.elite = false;
    c.equips = [];
    c.lv = {};
    c.kills = 0;
    c.lastFireTime = 0;
  });
  state.strategy.effect();
  state.reward = { tech: 0, coin: 0 };
  pushNews('协议开始：' + state.factions[0].name + ' 与 ' + state.factions[1].name + ' 正在逼近', 'warn');
  pushNews('防守策略：' + state.strategy.name + ' 已生效');
  pushNews('舰队配队完成：' + state.hand.length + ' 艘舰船进入手牌区');
  startPrepRound();
}

// ============================================================
//  10. 休整期
// ============================================================
function cityLevelOf(wave) {
  return CONFIG.CITY_LEVEL_BY_ROUND[Math.min(wave, CONFIG.CITY_LEVEL_BY_ROUND.length - 1)] || 2;
}

function startPrepRound() {
  stopBattleLoop();
  state.phase = 'prep';
  state.killsThisRound = 0;
  state.roundLifeLost = 0;
  state.battleFocusMul = 1;
  toxicActive = false;
  overtime = 0;
  selectedHandIdx = null;
  // 舰队修复：手牌区舰船恢复满血（本局蓝图数据库强化后同步）
  rebuildUnits();

  const fundsArr = CONFIG.MODES[state.mode].funds;
  const f = fundsArr[Math.min(state.wave - 1, fundsArr.length - 1)];
  state.funds += f;
  // 回合结束强化点奖励
  const techArr = CONFIG.MODES[state.mode].tech;
  const t = techArr[Math.min(state.wave - 1, techArr.length - 1)];
  state.techPoints += t;
  flashTip('第 ' + state.wave + ' 回合资金 +' + f + '，强化点 +' + t);

  state.upgradeDiscount = Math.max(0, state.upgradeDiscount - 1);
  state.shield = bargeShield();

  if (!state.poolFrozen) state.pool = generatePool();
  else { state.poolFrozen = false; state.pool.forEach(p => { p.frozen = false; }); }
  state.firstRefreshFree = true;

  if (state.spellStrategy && state.bargeLevel >= 3) grantRandomSpell();

  if (CONFIG.UPGRADE_ROUNDS.includes(state.wave) && !state.upgradeTriggered[state.wave]) {
    state.upgradeTriggered[state.wave] = true;
    showUpgradeOptions();
    return;
  }
  renderPrep();
}

function bargeShield() {
  const b = CONFIG.BARGE[state.bargeLevel - 1];
  return (b ? b.shield : 1) + state.bonuses.shieldBonus;
}

// ============================================================
//  11. 战斗单位构建（手牌区 → 我方舰队）
// ============================================================
function rebuildUnits() {
  state.units = state.hand.map((card, i) => {
    const s = card.ship;
    let dmgMul = 1, hpMul = 1, rateMul = 1, armorBonus = 0, rangeBonus = 0, energyMul = 1, critBonus = 0;
    // 舰队强化联动
    const enh = shipEnhanceBonus(s.name);
    dmgMul *= enh; hpMul *= enh;
    // 本局强化（蓝图数据库）
    const lv = card.lv || {};
    dmgMul *= 1 + (lv.dmg || 0) * 0.1;
    hpMul *= 1 + (lv.hp || 0) * 0.1;
    rateMul *= 1 + (lv.rate || 0) * 0.08;
    armorBonus += (lv.armor || 0) * 2;
    rangeBonus += (lv.range || 0) * 0.4;
    // 精锐
    if (card.elite) { dmgMul *= 1.4; hpMul *= 1.4; rateMul *= 1.2; armorBonus += 3; }
    // 装备
    (card.equips || []).forEach(eq => {
      const base = EQUIP_BLUEPRINTS.find(x => x.id === eq.id);
      if (base) for (let k = 0; k < eq.lv; k++) {
        if (base.id === 'dmg') dmgMul *= 1.25;
        else if (base.id === 'armor') armorBonus += 3;
        else if (base.id === 'hp') hpMul *= 1.3;
        else if (base.id === 'rate') rateMul *= 1.25;
        else if (base.id === 'range') rangeBonus += 1;
        else if (base.id === 'shield') { }
        else if (base.id === 'energy') energyMul *= 1.4;
        else if (base.id === 'crit') critBonus += 0.15;
      }
    });
    const maxHp = Math.round(s.hp * hpMul);
    const hasShield = s.dmgType === 'energy' || (card.equips || []).some(e => e.id === 'shield');
    return {
      cardIdx: i,
      id: 'my_' + i,
      name: s.name,
      shortName: s.shortName,
      cls: s.cls,
      icon: s.shortName.slice(0, 1),
      maxHp: maxHp,
      hp: maxHp,
      shield: hasShield ? Math.round(s.hp * 0.15) + ((card.equips || []).filter(e => e.id === 'shield').length ? 40 : 0) : 0,
      dmg: Math.round(s.dmg * dmgMul),
      armor: s.armor + armorBonus,
      rate: s.rate * rateMul,
      range: s.range + rangeBonus,
      weapon: s.weapon,
      dmgType: s.dmgType,
      energyMul: energyMul,
      critBonus: critBonus,
      elite: card.elite,
      alive: true,
      kills: 0
    };
  });
}

// ============================================================
//  12. 补给池
// ============================================================
function generatePool() {
  const b = CONFIG.BARGE[state.bargeLevel - 1];
  const pool = [];
  const used = new Set();
  for (let i = 0; i < b.ships; i++) {
    const poolShips = buildShipPool().filter(x => !used.has(x.id));
    if (!poolShips.length) break;
    const s = poolShips[Math.floor(Math.random() * poolShips.length)];
    used.add(s.id);
    pool.push({ type: 'ship', ship: s, frozen: false });
  }
  for (let i = 0; i < b.equips; i++) {
    const eq = EQUIP_BLUEPRINTS[Math.floor(Math.random() * EQUIP_BLUEPRINTS.length)];
    pool.push({ type: 'equip', eq: eq, frozen: false });
  }
  for (let i = 0; i < (b.spells || 0); i++) {
    const sp = SPELL_BLUEPRINTS[Math.floor(Math.random() * SPELL_BLUEPRINTS.length)];
    pool.push({ type: 'spell', sp: sp, frozen: false });
  }
  return pool;
}

function refreshPool() {
  if (state.phase !== 'prep') { flashTip('当前无法刷新补给'); return; }
  let cost = CONFIG.REFRESH_COST + (state.craft ? 1 : 0);
  let free = false;
  if (state.intel && state.firstRefreshFree) { cost = 0; free = true; }
  if (state.funds < cost) { flashTip('资金不足，无法刷新'); return; }
  state.funds -= cost;
  state.spentFunds += cost;
  state.firstRefreshFree = false;
  state.pool = generatePool();
  state.poolFrozen = false;
  if (free) pushNews('内部情报：特殊刷新已免费执行');
  checkGacha();
  renderPrep();
}

function freezePool() {
  if (state.phase !== 'prep') { flashTip('当前无法冻结补给'); return; }
  if (state.poolFrozen) { flashTip('补给已处于冻结状态'); return; }
  if (state.funds < CONFIG.FREEZE_COST) { flashTip('资金不足'); return; }
  state.funds -= CONFIG.FREEZE_COST;
  state.spentFunds += CONFIG.FREEZE_COST;
  state.poolFrozen = true;
  state.pool.forEach(p => { p.frozen = true; });
  checkGacha();
  renderPrep();
}

function buyPoolItem(idx) {
  if (state.phase !== 'prep') return;
  const item = state.pool[idx];
  if (!item) return;
  let cost = 0;
  if (item.type === 'ship') cost = Math.max(2, Math.round(item.ship.hp / 90));
  else if (item.type === 'equip') cost = item.eq.cost + (state.craft ? 1 : 0);
  else cost = item.sp.cost + (state.craft ? 1 : 0);
  if (state.funds < cost) { flashTip('资金不足'); return; }
  state.funds -= cost;
  state.spentFunds += cost;
  if (item.type === 'ship') {
    if (state.hand.length >= CONFIG.HAND_LIMIT) { state.funds += cost; state.spentFunds -= cost; flashTip('手牌区已满'); return; }
    state.hand.push({ ship: item.ship, elite: false, equips: [], lv: {}, kills: 0, lastFireTime: 0 });
    tryMergeShips();
    rebuildUnits();
  } else if (item.type === 'equip') {
    if (state.hand.length >= CONFIG.HAND_LIMIT) { state.funds += cost; state.spentFunds -= cost; flashTip('手牌区已满'); return; }
    state.hand.push({ type: 'equip', eq: item.eq, lv: 1 });
    tryMergeEquips();
  } else {
    if (state.hand.length >= CONFIG.HAND_LIMIT) { state.funds += cost; state.spentFunds -= cost; flashTip('手牌区已满'); return; }
    state.hand.push({ type: 'spell', sp: item.sp });
  }
  checkGacha();
  renderPrep();
  flashTip('购入：' + (item.type === 'ship' ? item.ship.name : item.type === 'equip' ? item.eq.name : item.sp.name) + '（-' + cost + '资金）');
}

function checkGacha() {
  if (!state.gacha) return;
  const gained = Math.floor(state.spentFunds / 20);
  while (state.gachaCount < gained) {
    state.gachaCount++;
    const poolShips = buildShipPool();
    const s = poolShips[Math.floor(Math.random() * poolShips.length)];
    state.hand.push({ ship: s, elite: false, equips: [], lv: {}, kills: 0, lastFireTime: 0 });
    pushNews('游戏高手：获得 ' + s.name, 'good');
  }
}

function randomShipByLevel() {
  const poolShips = buildShipPool();
  return poolShips[Math.floor(Math.random() * poolShips.length)];
}

// ============================================================
//  13. 同名合成 / 装备 / 战术支援
// ============================================================
function tryMergeShips() {
  const groups = {};
  state.hand.forEach((card) => {
    if (card.ship && !card.elite) {
      const key = card.ship.shortName;
      (groups[key] = groups[key] || []).push(card);
    }
  });
  let merged = false;
  for (const key in groups) {
    const need = state.mergeCount;
    while (groups[key].length >= need) {
      const three = groups[key].splice(0, need);
      const equips = [];
      three.forEach(c => { if (c.equips) equips.push(...c.equips); });
      three.forEach(c => {
        const idx = state.hand.indexOf(c);
        if (idx > -1) state.hand.splice(idx, 1);
      });
      const base = three[0];
      state.hand.push({ ship: base.ship, elite: true, equips: [], lv: base.lv || {}, kills: 0, lastFireTime: 0 });
      equips.forEach(eq => { if (state.hand.length < CONFIG.HAND_LIMIT) state.hand.push({ type: 'equip', eq: eq, lv: eq.lv }); });
      state.permits++;
      if (state.mergeBonus) state.funds += state.mergeBonus;
      pushNews('同名舰船已合成精锐：' + base.ship.shortName, 'good');
      merged = true;
    }
  }
  if (merged) { rebuildUnits(); flashTip('同名舰船已合成精锐'); }
}

function tryMergeEquips() {
  const groups = {};
  state.hand.forEach(card => {
    if (card.type === 'equip') {
      const gid = card.eq.id + '_' + card.lv;
      (groups[gid] = groups[gid] || []).push(card);
    }
  });
  let merged = false;
  for (const gid in groups) {
    while (groups[gid].length >= 2) {
      const two = groups[gid].splice(0, 2);
      const baseEq = two[0].eq;
      const lv = baseEq.lv || 1;
      if (lv >= EQUIP_MAX_LV) break;
      if (state.hand.length >= CONFIG.HAND_LIMIT) break;
      two.forEach(c => { const idx = state.hand.indexOf(c); if (idx > -1) state.hand.splice(idx, 1); });
      state.hand.push({ type: 'equip', eq: { ...baseEq, lv: lv + 1 }, lv: lv + 1 });
      pushNews('同名装备已合成升级：' + baseEq.name + ' Lv.' + (lv + 1), 'good');
      merged = true;
    }
  }
  if (merged) flashTip('同名装备已合成');
}

function installEquip(handIdx, target) {
  const card = state.hand[handIdx];
  if (!card || card.type !== 'equip') return;
  if (target.equips.length >= 2) { flashTip('每艘舰船最多携带 2 件装备'); return; }
  target.equips.push({ ...card.eq, lv: card.lv });
  state.hand.splice(handIdx, 1);
  rebuildUnits();
  tryMergeEquips();
  renderPrep();
  flashTip('装备已安装：' + card.eq.name + ' → ' + target.ship.name);
}

function castSpell(sp) {
  switch (sp.id) {
    case 'bomb': {
      const totalAtk = state.units.reduce((s, u) => s + (u.alive ? u.dmg : 0), 0);
      state.enemies.forEach(e => { e.hp -= totalAtk * 3; });
      pushNews('轨道轰炸：对全部敌人造成 ' + Math.round(totalAtk * 3) + ' 点伤害', 'good');
      break;
    }
    case 'emp': state.enemies.forEach(e => { e.empUntil = Date.now() + 3000; }); pushNews('全域EMP：敌方停火 3 秒', 'good'); break;
    case 'repair': state.units.forEach(u => { if (u.alive) u.hp = Math.min(u.maxHp, u.hp + u.maxHp * 0.4); }); pushNews('紧急修复：我方全体恢复 40% 生命', 'good'); break;
    case 'reinforce': {
      const s = randomShipByLevel();
      state.hand.push({ ship: s, elite: false, equips: [], lv: {}, kills: 0, lastFireTime: 0 });
      rebuildUnits();
      pushNews('舰载机增援：' + s.name + ' 加入战场', 'good');
      break;
    }
    case 'freeze': state.enemies.forEach(e => { e.frozenUntil = Date.now() + 3000; }); pushNews('时间冻结：敌方停止开火 3 秒', 'good'); break;
    case 'shield': state.shield += 5; pushNews('质子护盾：我方护盾 +5', 'good'); break;
    case 'corrode': state.corrodeUntil = Date.now() + 5000; pushNews('纳米腐蚀：敌方每秒损失 3% 生命', 'good'); break;
    case 'focus': state.battleFocusMul = 1.3; pushNews('集火指令：本回合我方攻击力 +30%', 'good'); break;
  }
}

function useSpellFromHand(idx) {
  const card = state.hand[idx];
  if (!card || card.type !== 'spell') return;
  state.hand.splice(idx, 1);
  castSpell(card.sp);
  renderPrep();
}

function grantRandomShip() {
  const s = randomShipByLevel();
  if (state.hand.length < CONFIG.HAND_LIMIT) {
    state.hand.push({ ship: s, elite: false, equips: [], lv: {}, kills: 0, lastFireTime: 0 });
    rebuildUnits();
    flashTip('免费舰船：' + s.name + ' 已加入手牌区');
  }
}
function eliteRandomShip() {
  const ships = state.hand.filter(c => c.ship && !c.elite);
  if (ships.length) {
    const c = ships[Math.floor(Math.random() * ships.length)];
    c.elite = true;
    rebuildUnits();
    flashTip(c.ship.name + ' 已晋升为精锐舰船');
  } else grantRandomShip();
}
function grantRandomEquips(n) {
  for (let i = 0; i < n; i++) {
    const eq = EQUIP_BLUEPRINTS[Math.floor(Math.random() * EQUIP_BLUEPRINTS.length)];
    if (state.hand.length < CONFIG.HAND_LIMIT) state.hand.push({ type: 'equip', eq: eq, lv: 1 });
  }
  tryMergeEquips();
}
function grantRandomSpell() {
  const sp = SPELL_BLUEPRINTS[Math.floor(Math.random() * SPELL_BLUEPRINTS.length)];
  if (state.hand.length < CONFIG.HAND_LIMIT) state.hand.push({ type: 'spell', sp: sp });
}

// ============================================================
//  14. 本局蓝图数据库（手牌区舰船强化）
// ============================================================
function showBlueModal() {
  const modal = document.getElementById('blueModal');
  const tip = document.getElementById('blueTip');
  const body = document.getElementById('blueBody');
  state.blueOpenedIn = state.phase; // 记录打开时阶段
  tip.innerHTML = '强化点：<b class="tp-num">' + state.techPoints + '</b> ｜ 强化来源：每回合结束奖励 + 击杀敌方舰船 ｜ 每升 1 级消耗 1+等级 强化点（攻击/生命 +10%/级，攻速 +8%/级）';
  const ships = state.hand.filter(c => c.ship);
  let html = '<div class="blue-list">';
  if (!ships.length) html += '<div style="color:#5a6b7d;">手牌区没有舰船</div>';
  ships.forEach((card, i) => {
    const lv = card.lv || {};
    const cost = (l) => l + 1;
    html += `<div class="blue-ship ${card.elite ? 'elite' : ''}" data-i="${i}">
      <div class="bs-head">
        <span class="bs-name">${card.ship.name}</span>
        <span class="bs-cls">${CLS_ZH[card.ship.cls]}${card.elite ? ' · 精锐' : ''}</span>
      </div>
      <div class="bs-stats">HP ${Math.round(card.ship.hp * (1 + (lv.hp || 0) * 0.1))} · 攻 ${Math.round(card.ship.dmg * (1 + (lv.dmg || 0) * 0.1))} · 甲 ${card.ship.armor + (lv.armor || 0) * 2}</div>
      <div class="bs-upgrades">
        ${[['dmg', '攻击', lv.dmg || 0], ['hp', '生命', lv.hp || 0], ['rate', '攻速', lv.rate || 0], ['armor', '装甲', lv.armor || 0], ['range', '射程', lv.range || 0]].map(([k, label, v]) => `
          <div class="bs-up">
            <span class="bs-up-label">${label}</span>
            <span class="bs-up-lv">Lv.${v}</span>
            <button class="btn-action small ${state.techPoints >= cost(v) ? '' : 'off'}" data-up="${i}" data-key="${k}" data-cost="${cost(v)}">升级(${cost(v)}点)</button>
          </div>`).join('')}
      </div>
    </div>`;
  });
  html += '</div>';
  html += `<div class="dp-actions"><button class="btn-action" id="blueClose">关闭</button></div>`;
  body.innerHTML = html;
  modal.classList.add('active');

  body.querySelectorAll('[data-up]').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.up);
      const k = btn.dataset.key;
      const cost = parseInt(btn.dataset.cost);
      const card = state.hand[i];
      if (!card || !card.ship) return;
      if (state.techPoints < cost) { flashTip('强化点不足'); return; }
      state.techPoints -= cost;
      card.lv = card.lv || {};
      card.lv[k] = (card.lv[k] || 0) + 1;
      rebuildUnits();
      flashTip('强化成功：' + card.ship.name + ' ' + k + ' Lv.' + card.lv[k]);
      showBlueModal();
    });
  });
  document.getElementById('blueClose').addEventListener('click', () => {
    modal.classList.remove('active');
    afterBlueClose();
  });
}

// 蓝图强化界面关闭后：若处于回合结算衔接阶段则进入下一回合
function afterBlueClose() {
  if (state.blueOpenedIn === 'settle' && state.phase === 'settle') {
    startPrepRound();
  } else if (state.blueOpenedIn === 'prep') {
    renderPrep();
  }
}

// ============================================================
//  15. 回合强化
// ============================================================
function showUpgradeOptions() {
  const modal = document.getElementById('upgradeModal');
  const options = document.getElementById('upgradeOptions');
  const shuffled = [...UPGRADE_POOL].sort(() => Math.random() - 0.5);
  const choices = shuffled.slice(0, 3);
  options.innerHTML = choices.map((u, idx) => `
    <div class="upgrade-option" data-idx="${idx}">
      <div class="upgrade-name">${u.name}</div>
      <div class="upgrade-desc">${u.desc}</div>
    </div>`).join('');
  options.querySelectorAll('.upgrade-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const choice = choices[parseInt(opt.dataset.idx)];
      choice.effect();
      modal.classList.remove('active');
      pushNews('回合强化：' + choice.name, 'good');
      flashTip('获得强化：' + choice.name);
      renderPrep();
    });
  });
  modal.classList.add('active');
}

// ============================================================
//  16. 作战
// ============================================================
function spawnEnemyWave() {
  const lv = cityLevelOf(state.wave);
  const config = (window.CITY_DEFENSE || {})[lv] || [];
  state.enemies = config.map((e, i) => ({
    id: 'en_' + i,
    name: e.zh,
    cls: e.cls,
    count: e.count,
    maxHp: e.totalHp,
    hp: e.totalHp,
    dmg: e.atk,
    armor: e.armor,
    shield: e.shield || 0,
    dmgType: e.dmgType,
    weapon: e.weapon,
    tier: e.tier,
    alive: true,
    lastFireTime: 0
  }));
  pushNews('敌方舰队抵达：' + lv + ' 级城防（' + state.enemies.length + ' 个编队）', 'warn');
}

function startBattle() {
  if (state.phase !== 'prep') return;
  if (!state.units.length || !state.units.some(u => u.alive)) { flashTip('请先部署舰船'); return; }
  state.phase = 'battle';
  if (!state.poolFrozen) state.pool = [];
  else { state.poolFrozen = false; state.pool.forEach(p => { p.frozen = false; }); }
  // 使用手牌战术支援
  const spells = state.hand.filter(c => c.type === 'spell');
  state.hand = state.hand.filter(c => c.type !== 'spell');
  spells.forEach(c => castSpell(c.sp));
  spawnEnemyWave();
  clockLeft = CONFIG.ROUND_CLOCK;
  overtime = 0;
  toxicActive = false;
  renderBattle();
  pushNews('作战开始！');
  startBattleLoop();
}

function startBattleLoop() {
  stopBattleLoop();
  let last = Date.now();
  battleTimer = setInterval(() => {
    const now = Date.now();
    const dt = Math.min(0.25, (now - last) / 1000);
    last = now;
    gameTick(now, dt);
  }, 100);
  uiTimer = setInterval(() => { updateBattleUI(); }, 150);
}
function stopBattleLoop() {
  if (battleTimer) { clearInterval(battleTimer); battleTimer = null; }
  if (uiTimer) { clearInterval(uiTimer); uiTimer = null; }
}

function gameTick(now, dt) {
  if (state.phase !== 'battle') return;
  clockLeft -= dt;
  if (clockLeft <= 0 && !toxicActive) { toxicActive = true; pushNews('战场即将恶化！毒雾正在蔓延', 'warn'); }
  if (toxicActive) overtime += dt;

  if (toxicActive) {
    const pct = Math.min(0.08, 0.02 + 0.001 * overtime);
    state.units.forEach(u => { if (u.alive) u.hp -= u.maxHp * pct * dt; });
    state.enemies.forEach(e => { if (e.alive) e.hp -= e.maxHp * pct * dt; });
  }
  if (state.corrodeUntil && now < state.corrodeUntil) {
    state.enemies.forEach(e => { if (e.alive) e.hp -= e.maxHp * 0.03 * dt; });
  }
  // 我方攻击
  myAttack(now);
  // 敌方攻击
  enemyAttack(now);
  // 清理阵亡
  state.units.forEach(u => { if (u.alive && u.hp <= 0) { u.alive = false; u.hp = 0; pushNews(u.name + ' 被击毁', 'bad'); } });
  state.enemies.forEach(e => {
    if (e.alive && e.hp <= 0) {
      e.alive = false; e.hp = 0;
      state.totalKills++;
      state.killsThisRound++;
      const tp = Math.max(2, e.tier * 2);
      state.techPoints += tp;
      pushNews('击毁敌方编队：' + e.name + '（强化点 +' + tp + '）', 'good');
    }
  });
  // 结束判定
  const myAlive = state.units.some(u => u.alive);
  const enAlive = state.enemies.some(e => e.alive);
  if (!enAlive) { settleRound(true); return; }
  if (!myAlive) { settleRound(false); return; }
  if (state.life <= 0) { state.life = 0; endGame(false); }
}

function myAttack(now) {
  state.units.forEach(u => {
    if (!u.alive) return;
    const interval = 1000 / (u.rate * state.bonuses.rateMul);
    if (now - (u.lastFireTime || 0) < interval) return;
    const target = acquireTarget(u, state.enemies);
    if (!target) return;
    u.lastFireTime = now;
    const hitRate = Math.max(0.1, Math.min(0.95, 0.8 * (1 - 0.05)));
    if (Math.random() > hitRate) return;
    let dmg = u.dmg * state.bonuses.dmgMul * state.enhanceMul * state.battleFocusMul;
    if (u.dmgType === 'energy') dmg *= state.bonuses.energyMul * u.energyMul;
    if (u.weapon === 'direct') dmg *= state.bonuses.directMul;
    if (u.weapon === 'projectile') dmg *= state.bonuses.projMul;
    if (u.weapon === 'air') dmg *= state.bonuses.airMul;
    if (state.swift && u.dmg === getMaxMyDmg()) dmg *= 1.7;
    if (Math.random() < state.bonuses.critChance + u.critBonus) dmg *= 1.5;
    target.hp -= calcDamage(dmg, u.dmgType, target);
  });
}

function enemyAttack(now) {
  state.enemies.forEach(e => {
    if (!e.alive) return;
    if (e.empUntil && now < e.empUntil) return;
    if (e.frozenUntil && now < e.frozenUntil) return;
    const interval = 1000 / 0.8; // 敌方编队攻速固定 0.8/s
    if (now - (e.lastFireTime || 0) < interval) return;
    const target = acquireTarget(e, state.units.filter(u => u.alive));
    if (!target) return;
    e.lastFireTime = now;
    const hitRate = 0.75;
    if (Math.random() > hitRate) return;
    let dmg = e.dmg * state.enemyDmgMul;
    if (Math.random() < 0.05) dmg *= 1.5;
    target.hp -= calcDamage(dmg, e.dmgType, target);
    if (target.hp <= 0) target.hp = 0;
  });
}

function getMaxMyDmg() {
  return state.units.reduce((m, u) => u.alive ? Math.max(m, u.dmg) : m, 0);
}

function acquireTarget(attacker, candidates) {
  const list = candidates.filter(c => c.alive);
  if (!list.length) return null;
  // 防空：优先战机/护航艇
  if (attacker.weapon === 'air') {
    const air = list.filter(c => c.cls === 'fighter' || c.cls === 'corvette');
    return (air.length ? air : list)[0];
  }
  // 投射：锁定序列
  if (attacker.weapon === 'projectile') {
    for (const seq of LOCK_SEQUENCE) {
      const found = list.filter(c => c.cls === seq.cls);
      if (found.length) return found[0];
    }
    return list[0];
  }
  // 直射：血量最少优先
  return list.sort((a, b) => a.hp - b.hp)[0];
}

function calcDamage(dmg, dmgType, target) {
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

// ============================================================
//  17. 结算
// ============================================================
function settleRound(win) {
  if (state.phase !== 'battle') return;
  state.phase = 'settle';
  stopBattleLoop();
  // 回收利用
  if (state.recycle && state.killsThisRound > 0) {
    const bonus = Math.floor(state.killsThisRound / 12) * 3;
    if (bonus > 0) { state.funds += bonus; pushNews('回收利用：奖励 ' + bonus + ' 资金', 'good'); }
  }
  // 势力生命结算
  if (win) {
    const assault = calcAssault();
    const dmg = Math.round(state.shield + assault);
    state.factionHp = state.factionHp.map(h => Math.max(0, h - dmg));
    pushNews('防线反击：护盾 ' + Math.round(state.shield) + ' + 攻坚 ' + assault + '，对敌方造成 ' + dmg + ' 点伤害', 'good');
  } else {
    const remaining = state.enemies.reduce((s, e) => s + (e.alive ? e.dmg : 0), 0);
    const actual = Math.min(CONFIG.BREACH_CAP, Math.round(remaining * 0.3));
    state.life -= actual;
    pushNews('防线被突破！生命 -' + actual, 'bad');
  }
  renderPrep();
  if (state.factionHp.every(h => h <= 0)) { endGame(true); return; }
  if (state.life <= 0) { endGame(false); return; }
  state.wave++;
  // 回合结束 → 弹本局蓝图数据库（关闭后进入下一回合）
  state.blueOpenedIn = 'settle';
  setTimeout(() => {
    showBlueModal();
  }, 600);
}

function calcAssault() {
  let total = 0;
  state.units.forEach(u => {
    if (u.alive) total += u.dmg * state.bonuses.dmgMul * state.enhanceMul * state.battleFocusMul;
  });
  return Math.round(total * CONFIG.ASSAULT_FACTOR);
}

function endGame(victory) {
  if (state.phase === 'end') return;
  stopBattleLoop();
  state.phase = 'end';
  toxicActive = false;
  if (victory) {
    if (state.mode === 'beginner') state.progress.prototype = true;
    if (state.mode === 'prototype') state.progress.core = true;
    if (state.mode === 'core') state.progress.coreCleared = true;
    state.stats.wins++;
  } else {
    state.stats.losses++;
  }
  state.stats.kills += state.totalKills;
  state.stats.bestWave = Math.max(state.stats.bestWave, state.wave);
  saveProgress();
  saveStats();

  const modal = document.getElementById('resultModal');
  const title = document.getElementById('resultTitle');
  const content = document.getElementById('resultContent');
  const rewardTech = (state.wave + state.totalKills) * 5;
  const rewardCoin = state.wave * 40 + state.totalKills * 2;
  state.reward = { tech: rewardTech, coin: rewardCoin };
  const modeName = CONFIG.MODES[state.mode].name;
  const contentHtml = `
    <div class="result-stats">
      <div class="stat-row"><span>协议模式</span><span class="v">${modeName}</span></div>
      <div class="stat-row"><span>通关回合</span><span class="v">第 ${state.wave} 回合</span></div>
      <div class="stat-row"><span>剩余生命</span><span class="v">${Math.round(state.life)}</span></div>
      <div class="stat-row"><span>累计击毁</span><span class="v">${state.totalKills} 个编队</span></div>
      <div class="stat-row"><span>剩余强化点</span><span class="v">${state.techPoints}</span></div>
      ${state.mode === 'beginner' ? '<div class="stat-row"><span>新解锁</span><span class="v" style="color:#44cc88;">原型协议</span></div>' : ''}
      ${state.mode === 'prototype' ? '<div class="stat-row"><span>新解锁</span><span class="v" style="color:#44cc88;">核心协议</span></div>' : ''}
    </div>
    <div class="result-reward">
      <div class="reward-title">获得奖励</div>
      <div class="reward-items">
        <span class="reward-item">技术点 +${rewardTech}</span>
        <span class="reward-item">比邻星币 +${rewardCoin}</span>
      </div>
    </div>
    <div class="result-actions">
      <button class="btn-action primary-btn" id="againBtn">再来一局</button>
      <button class="btn-action" id="backBtn">返回主页</button>
    </div>`;
  if (victory) {
    title.textContent = '作战胜利';
    title.style.color = '#44cc88';
  } else {
    title.textContent = '作战失败';
    title.style.color = '#ff6a6a';
  }
  content.innerHTML = contentHtml;
  modal.classList.add('active');
  document.getElementById('againBtn').addEventListener('click', () => {
    modal.classList.remove('active');
    showModeSelect();
  });
  document.getElementById('backBtn').addEventListener('click', () => {
    modal.classList.remove('active');
    initGame();
  });
}

// ============================================================
//  18. 渲染 —— 休整期
// ============================================================
function renderPrep() {
  const panel = document.getElementById('leftPanel');
  panel.dataset.mode = 'prep';
  let html = '<div class="game-header">';
  html += renderTopStatus();
  html += renderNewsTicker();
  html += renderBarge();
  html += renderPrepFleet();   // 左：我方舰队（手牌区）
  html += renderPool();
  html += renderHandExtras();  // 装备/战术手牌
  html += renderActionBar('prep');
  html += '</div>';
  panel.innerHTML = html;
  bindPrepEvents();
}

function renderTopStatus() {
  let html = '<div class="top-status">';
  state.factions.forEach((f, i) => {
    const hp = state.factionHp[i];
    const maxHp = state.factionMaxHp[i];
    const pct = Math.max(0, hp / maxHp * 100);
    html += `<div class="faction-bar ${hp <= 0 ? 'dead' : ''}">
      <div class="fb-head"><span>${f.name}</span><span>${Math.max(0, Math.round(hp))}/${maxHp}</span></div>
      <div class="fb-hp-wrap"><div class="fb-hp" style="width:${pct}%"></div></div>
    </div>`;
  });
  const lifePct = Math.max(0, state.life / state.maxLife * 100);
  html += `<div class="my-bar">
    <div class="mb-row"><span class="mb-label">护盾</span><div class="shield-bar"><div class="fill" style="width:${Math.min(100, state.shield / Math.max(1, bargeShield() + 5) * 100)}%"></div></div><span class="mb-val">${Math.round(state.shield)}</span></div>
    <div class="mb-row"><span class="mb-label">生命</span><div class="life-bar"><div class="fill" style="width:${lifePct}%"></div></div><span class="mb-val">${Math.round(state.life)}/${state.maxLife}</span></div>
    <div class="mb-row"><span class="mb-label">资金</span><span class="mb-val">${state.funds}</span>
      <span class="mb-label" style="margin-left:8px;">强化点</span><span class="mb-val tp-num">${state.techPoints}</span>
      <span class="mb-label" style="margin-left:8px;">回合</span><span class="mb-val">第${state.wave}回合</span>
      <span class="mb-label" style="margin-left:8px;">城防</span><span class="mb-val">${cityLevelOf(state.wave)}级城</span>
    </div>
  </div>`;
  html += '</div>';
  return html;
}

function renderNewsTicker() {
  const items = newsList.slice(-4).map(n => `<span class="tick-item ${n.cls || ''}">${n.msg}</span>`).join('');
  return `<div class="news-ticker" id="newsTicker">${items}</div>`;
}

function renderBarge() {
  const b = CONFIG.BARGE[state.bargeLevel - 1];
  const cost = bargeUpgradeCost();
  const maxed = state.bargeLevel >= 6;
  return `<div class="barge-panel">
    <span class="bp-label">补给驳船</span><span class="bp-val">Lv.${state.bargeLevel}</span>
    <span class="bp-label">｜护盾</span><span class="bp-val">${b ? b.shield : 3}+${state.bonuses.shieldBonus}</span>
    <span class="bp-label">｜卡位</span><span class="bp-val">舰${b ? b.ships : 5}/装${b ? b.equips : 2}/术${b ? b.spells || 0 : 1}</span>
    <span class="bp-label">｜策略</span><span class="bp-val" style="color:#88ccff;">${state.strategy ? state.strategy.name : '未选择'}</span>
    <button class="barge-upgrade" id="bargeUpgradeBtn" ${maxed ? 'disabled' : ''}>升级补给等级（${maxed ? '已满级' : cost + '资金' + (state.upgradeDiscount > 0 ? '，已优惠' + state.upgradeDiscount : '')}）</button>
  </div>`;
}

function bargeUpgradeCost() {
  const b = CONFIG.BARGE[state.bargeLevel - 1];
  if (!b || state.bargeLevel >= 6) return 0;
  return Math.max(0, b.cost - state.upgradeDiscount);
}
function upgradeBarge() {
  if (state.phase !== 'prep') { flashTip('战斗中无法升级'); return; }
  if (state.bargeLevel >= 6) { flashTip('补给等级已满级'); return; }
  const cost = bargeUpgradeCost();
  if (state.funds < cost) { flashTip('资金不足'); return; }
  state.funds -= cost;
  state.spentFunds += cost;
  state.bargeLevel++;
  state.upgradeDiscount = 0;
  flashTip('补给等级提升至 ' + state.bargeLevel);
  renderPrep();
}

// 我方舰队（手牌区舰船）
function renderPrepFleet() {
  let html = '<div class="prep-fleet"><div class="fleet-title">我方舰队（手牌区 ' + state.hand.filter(c => c.ship).length + ' 艘）</div>';
  html += '<div class="fleet-list">';
  const ships = state.hand.filter(c => c.ship);
  if (!ships.length) html += '<div style="color:#5a6b7d;font-size:0.72rem;padding:8px;">手牌区为空，请先在物资调配处配队</div>';
  ships.forEach((card, i) => {
    const s = card.ship;
    const lv = card.lv || {};
    html += `<div class="fleet-card ${card.elite ? 'elite' : ''}" data-hi="${i}">
      <div class="fc-name">${s.shortName}<span class="fc-cls">${CLS_ZH[s.cls]}</span>${card.elite ? '<span class="fc-elite">精锐</span>' : ''}</div>
      <div class="fc-stats">HP ${Math.round(s.hp * (1 + (lv.hp || 0) * 0.1))} 攻 ${Math.round(s.dmg * (1 + (lv.dmg || 0) * 0.1))} 甲 ${s.armor + (lv.armor || 0) * 2}</div>
      <div class="fc-tags">${WEAPON_LABEL[s.weapon]}·${DMGTYPE_LABEL[s.dmgType]}${(card.equips || []).length ? ' · ' + card.equips.map(e => e.icon).join('') : ''}</div>
      <div class="fc-actions">
        <button class="btn-action small" data-equip="${i}">装装备</button>
        <button class="btn-action small" data-sell="${i}">出售+1</button>
      </div>
    </div>`;
  });
  html += '</div>';
  html += '<div class="fleet-actions">';
  html += `<button class="btn-action" id="blueBtn">本局蓝图数据库（强化点 ${state.techPoints}）</button>`;
  html += `<button class="btn-action" id="deployBtn">重新配队</button>`;
  html += '</div></div>';
  return html;
}

// 手牌区装备/战术
function renderHandExtras() {
  const extras = state.hand.filter(c => !c.ship);
  let html = '<div class="hand-section"><div class="hand-title">';
  html += '<span>手牌区（装备/战术支援 ' + extras.length + '）</span>';
  html += '</div><div class="hand-grid">';
  extras.forEach((card, i) => {
    // 找它在 hand 中的真实索引
    let realIdx = -1, cnt = 0;
    for (let k = 0; k < state.hand.length; k++) {
      if (!state.hand[k].ship) { if (cnt === i) { realIdx = k; break; } cnt++; }
    }
    if (card.type === 'equip') {
      html += `<div class="hand-card" data-idx="${realIdx}" data-kind="equip">
        <div class="hc-name">${card.eq.name}</div>
        <div class="hc-name" style="color:#ffd166;">Lv.${card.lv}</div>
        <span class="hc-sell" data-idx="${realIdx}">销毁</span>
      </div>`;
    } else {
      html += `<div class="hand-card" data-idx="${realIdx}" data-kind="spell">
        <div class="hc-name">${card.sp.name}</div>
        <div class="hc-name" style="color:#7ae0ff;">战术支援</div>
        <span class="hc-sell" data-idx="${realIdx}">销毁</span>
      </div>`;
    }
  });
  if (!extras.length) html += '<div style="font-size:0.65rem;color:#4a5a6a;padding:8px;">从补给池购买装备或战术支援</div>';
  html += '</div></div>';
  return html;
}

function renderPool() {
  let html = '<div class="pool-section"><div class="pool-title">';
  html += `<span>补给池（${state.pool.length} 项${state.poolFrozen ? ' · 已冻结' : ''}）</span>`;
  const refreshCost = CONFIG.REFRESH_COST + (state.craft ? 1 : 0);
  const free = state.intel && state.firstRefreshFree;
  html += `<span class="pool-actions">
    <button id="refreshBtn">刷新${free ? '（免费）' : '（' + refreshCost + '）'}</button>
    <button id="freezeBtn">冻结（${CONFIG.FREEZE_COST}）</button>
  </span></div>`;
  html += '<div class="pool-grid">';
  state.pool.forEach((item, idx) => {
    const cls = item.type === 'equip' ? 'equip' : item.type === 'spell' ? 'spell' : '';
    const frozen = item.frozen ? 'frozen' : '';
    html += `<div class="pool-card ${cls} ${frozen}" data-idx="${idx}">`;
    if (item.type === 'ship') {
      const cost = Math.max(2, Math.round(item.ship.hp / 90));
      html += `<div class="pool-name">${item.ship.shortName}</div>`;
      html += `<div class="pool-sub">${CLS_ZH[item.ship.cls]} · ${WEAPON_LABEL[item.ship.weapon]}${DMGTYPE_LABEL[item.ship.dmgType]}</div>`;
      html += `<div class="pool-cost">资金 ${cost}</div>`;
      html += `<div class="pool-stats">HP ${item.ship.hp} 攻 ${item.ship.dmg} 甲 ${item.ship.armor}</div>`;
    } else if (item.type === 'equip') {
      html += `<div class="pool-name">${item.eq.name}</div>`;
      html += `<div class="pool-sub">装备 · ${item.eq.desc}</div>`;
      html += `<div class="pool-cost">资金 ${item.eq.cost + (state.craft ? 1 : 0)}</div>`;
    } else {
      html += `<div class="pool-name">${item.sp.name}</div>`;
      html += `<div class="pool-sub">战术 · ${item.sp.desc}</div>`;
      html += `<div class="pool-cost">资金 ${item.sp.cost + (state.craft ? 1 : 0)}</div>`;
    }
    html += '</div>';
  });
  html += '</div></div>';
  return html;
}

function renderActionBar(phase) {
  let html = '<div class="action-bar">';
  if (phase === 'prep') {
    const hasShip = state.units.some(u => u.alive);
    html += `<button class="btn-action primary-btn" id="startBattleBtn" ${hasShip ? '' : 'disabled'}>开始作战</button>`;
    html += `<button class="btn-action" id="skipBtn">跳过回合</button>`;
    html += `<button class="btn-action" id="abortBtn">放弃战斗</button>`;
    if (!hasShip) html += '<span style="font-size:0.62rem;color:#ff5c5c;align-self:center;">手牌区没有可作战的舰船</span>';
  } else if (phase === 'battle') {
    html += '<span style="font-size:0.72rem;color:#88ccff;letter-spacing:2px;">战斗进行中 · 自动作战</span>';
  }
  html += '</div>';
  return html;
}

function bindPrepEvents() {
  const panel = document.getElementById('leftPanel');
  // 补给池购买
  panel.querySelectorAll('.pool-card').forEach(card => {
    card.addEventListener('click', () => buyPoolItem(parseInt(card.dataset.idx)));
  });
  // 手牌区装备/战术：点击装备 → 进入安装模式
  panel.querySelectorAll('.hand-card[data-kind="equip"]').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('hc-sell')) return;
      selectedHandIdx = parseInt(card.dataset.idx);
      flashTip('装备已选中，点击左侧舰船卡安装');
    });
  });
  panel.querySelectorAll('.hand-card[data-kind="spell"]').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('hc-sell')) return;
      useSpellFromHand(parseInt(card.dataset.idx));
    });
  });
  panel.querySelectorAll('.hc-sell').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx);
      state.hand.splice(idx, 1);
      renderPrep();
    });
  });
  // 舰船卡：安装装备
  panel.querySelectorAll('[data-equip]').forEach(btn => {
    btn.addEventListener('click', () => {
      const hi = parseInt(btn.dataset.equip);
      const card = state.hand.filter(c => c.ship)[hi];
      if (!card) return;
      if (selectedHandIdx === null) { flashTip('请先点击装备卡选择要安装的装备'); return; }
      const eqCard = state.hand[selectedHandIdx];
      if (!eqCard || eqCard.type !== 'equip') { flashTip('请选择装备卡'); return; }
      installEquip(selectedHandIdx, card);
      selectedHandIdx = null;
    });
  });
  // 出售舰船
  panel.querySelectorAll('[data-sell]').forEach(btn => {
    btn.addEventListener('click', () => {
      const hi = parseInt(btn.dataset.sell);
      const card = state.hand.filter(c => c.ship)[hi];
      if (!card) return;
      const idx = state.hand.indexOf(card);
      state.hand.splice(idx, 1);
      state.funds += CONFIG.SELL_PRICE;
      rebuildUnits();
      renderPrep();
      flashTip('出售 ' + card.ship.shortName + '，+1 资金');
    });
  });
  // 舰队操作
  document.getElementById('blueBtn')?.addEventListener('click', () => showBlueModal());
  document.getElementById('deployBtn')?.addEventListener('click', () => showDeployModal());
  document.getElementById('bargeUpgradeBtn')?.addEventListener('click', () => upgradeBarge());
  document.getElementById('refreshBtn')?.addEventListener('click', () => refreshPool());
  document.getElementById('freezeBtn')?.addEventListener('click', () => freezePool());
  document.getElementById('startBattleBtn')?.addEventListener('click', () => startBattle());
  document.getElementById('skipBtn')?.addEventListener('click', () => skipRound());
  document.getElementById('abortBtn')?.addEventListener('click', () => abortRun());
}

// ============================================================
//  19. 渲染 —— 战斗（左方玩家 / 右方敌方）
// ============================================================
function renderBattle() {
  const panel = document.getElementById('leftPanel');
  panel.dataset.mode = 'battle';
  let html = '<div class="game-header battle-layout">';
  html += renderTopStatus();
  html += renderNewsTicker();
  html += `<div class="battle-clock" id="battleClock">${Math.ceil(clockLeft)}</div>`;
  html += '<div class="battle-view">';
  // 左：我方舰队
  html += '<div class="fleet-panel left">';
  html += '<div class="fleet-title">我方舰队 <span class="fp-cnt">' + state.units.filter(u => u.alive).length + '/' + state.units.length + '</span></div>';
  html += '<div class="fleet-list">';
  state.units.forEach(u => {
    html += renderFleetCard(u, 'my');
  });
  html += '</div></div>';
  // 中：状态/日志
  html += '<div class="battle-center">';
  html += '<div class="bc-info">城防等级 ' + cityLevelOf(state.wave) + '</div>';
  html += '<div class="bc-log" id="bcLog">' + newsList.slice(-6).map(n => `<div class="bc-line ${n.cls || ''}">${n.msg}</div>`).join('') + '</div>';
  html += '<div class="bc-hint">自动作战中 · 剩余时间 <span id="clockNum">' + Math.ceil(clockLeft) + '</span>s</div>';
  html += '</div>';
  // 右：敌方舰队
  html += '<div class="fleet-panel right">';
  html += '<div class="fleet-title">敌方舰队 <span class="fp-cnt">' + state.enemies.filter(e => e.alive).length + '/' + state.enemies.length + '</span></div>';
  html += '<div class="fleet-list">';
  state.enemies.forEach(e => {
    html += renderFleetCard(e, 'en');
  });
  html += '</div></div>';
  html += '</div>';
  html += renderActionBar('battle');
  html += '</div>';
  panel.innerHTML = html;
}

function renderFleetCard(u, side) {
  const pct = Math.max(0, u.hp / u.maxHp * 100);
  const shieldPct = u.shield > 0 ? Math.min(100, u.shield / Math.max(1, u.maxHp * 0.15) * 100) : 0;
  const dead = !u.alive;
  return `<div class="fleet-card ${dead ? 'dead' : ''} ${u.elite ? 'elite' : ''} ${side === 'en' ? 'enemy' : ''}" id="${u.id}">
    <div class="fc-head">
      <span class="fc-name">${u.shortName}</span>
      <span class="fc-cls">${CLS_ZH[u.cls] || ''}</span>
      ${side === 'en' && u.count ? `<span class="fc-count">x${u.count}</span>` : ''}
    </div>
    <div class="fc-hp"><div class="fill" style="width:${pct}%"></div></div>
    <div class="fc-hpnum">${Math.max(0, Math.round(u.hp))}/${u.maxHp}</div>
    ${u.shield > 0 ? `<div class="fc-shield"><div class="fill" style="width:${shieldPct}%"></div></div>` : ''}
    <div class="fc-mini">攻 ${u.dmg} 甲 ${u.armor} ${WEAPON_LABEL[u.weapon]}·${DMGTYPE_LABEL[u.dmgType]}</div>
  </div>`;
}

function updateBattleUI() {
  const panel = document.getElementById('leftPanel');
  if (!panel || state.phase !== 'battle') return;
  // 时钟
  const clockEl = document.getElementById('battleClock');
  if (clockEl) {
    clockEl.textContent = toxicActive ? '+' + Math.floor(overtime) : Math.max(0, Math.ceil(clockLeft));
    clockEl.classList.toggle('warn', toxicActive);
  }
  const clockNum = document.getElementById('clockNum');
  if (clockNum) clockNum.textContent = toxicActive ? '+' + Math.floor(overtime) : Math.max(0, Math.ceil(clockLeft));
  // 我方卡片
  state.units.forEach(u => {
    const el = document.getElementById(u.id);
    if (el) {
      el.querySelector('.fc-hp .fill').style.width = Math.max(0, u.hp / u.maxHp * 100) + '%';
      el.querySelector('.fc-hpnum').textContent = Math.max(0, Math.round(u.hp)) + '/' + u.maxHp;
      if (!u.alive) el.classList.add('dead');
      const sh = el.querySelector('.fc-shield .fill');
      if (sh) sh.style.width = Math.min(100, u.shield / Math.max(1, u.maxHp * 0.15) * 100) + '%';
    }
  });
  // 敌方卡片
  state.enemies.forEach(e => {
    const el = document.getElementById(e.id);
    if (el) {
      el.querySelector('.fc-hp .fill').style.width = Math.max(0, e.hp / e.maxHp * 100) + '%';
      el.querySelector('.fc-hpnum').textContent = Math.max(0, Math.round(e.hp)) + '/' + e.maxHp;
      if (!e.alive) el.classList.add('dead');
    }
  });
  // 日志
  const log = document.getElementById('bcLog');
  if (log) log.innerHTML = newsList.slice(-6).map(n => `<div class="bc-line ${n.cls || ''}">${n.msg}</div>`).join('');
  // 顶部状态
  const statusEl = panel.querySelector('.top-status');
  if (statusEl) statusEl.outerHTML = renderTopStatus();
  // 毒雾
  let fog = document.getElementById('toxicFog');
  if (toxicActive && !fog) {
    fog = document.createElement('div');
    fog.id = 'toxicFog';
    fog.className = 'toxic-fog';
    document.body.appendChild(fog);
  }
  if (!toxicActive && fog) fog.remove();
}

// ============================================================
//  20. 跳回合 / 放弃 / 工具
// ============================================================
function skipRound() {
  if (state.phase !== 'prep') { flashTip('当前无法跳过'); return; }
  state.shield = 0;
  settleRound(false);
}
function abortRun() {
  if (state.phase !== 'prep') { flashTip('战斗中无法放弃'); return; }
  showConfirm('放弃战斗', '放弃后本场模拟直接结束，且不进入作战结算。确定放弃？', () => {
    state.phase = 'end';
    endGame(false);
  });
}
function pushNews(msg, cls) {
  newsList.push({ msg: msg, cls: cls || '' });
  if (newsList.length > 30) newsList.shift();
}
function flashTip(msg) {
  const old = document.getElementById('flashTip');
  if (old) old.remove();
  const tip = document.createElement('div');
  tip.id = 'flashTip';
  tip.className = 'flash-tip';
  tip.textContent = msg;
  document.body.appendChild(tip);
  setTimeout(() => tip.remove(), 2200);
}
function showConfirm(title, body, cb) {
  const modal = document.getElementById('confirmModal');
  document.getElementById('confirmTitle').textContent = title;
  document.getElementById('confirmBody').innerHTML = body;
  confirmCallback = cb;
  modal.classList.add('active');
}
let confirmCallback = null;
function showModal(title, content) {
  const modal = document.getElementById('genericModal');
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = content;
  modal.classList.add('active');
}

// ============================================================
//  21. 蓝图数据库 / 物资调配
// ============================================================
function renderBlueprintDB() {
  const pool = buildShipPool();
  let html = '<div class="bp-panel">';
  html += '<div class="bp-tab-bar">';
  html += '<button class="bp-tab-btn active" data-tab="ships">舰船蓝图</button>';
  html += '<button class="bp-tab-btn" data-tab="equips">装备</button>';
  html += '<button class="bp-tab-btn" data-tab="spells">战术支援</button>';
  html += '<button class="bp-tab-btn" data-tab="strategies">防守策略</button>';
  html += '</div>';
  html += '<div class="bp-tab-content active" id="tab-ships">';
  html += '<div class="bp-ship-list">';
  const groups = {};
  for (const s of pool) (groups[s.cls] = groups[s.cls] || []).push(s);
  const clsOrder = ['carrier', 'battlecruiser', 'battleship', 'cruiser', 'destroyer', 'frigate', 'fighter', 'corvette', 'support'];
  for (const cls of clsOrder) {
    const list = groups[cls];
    if (!list || !list.length) continue;
    html += `<div class="bp-type-title">${CLS_ZH[cls]}（${list.length}）</div>`;
    list.forEach(s => {
      html += `<div class="bp-ship-item">
        <span>${s.name}</span>
        <span style="color:#5a6b7d;font-size:0.62rem;">HP${s.hp} 攻${s.dmg} 甲${s.armor} ${WEAPON_LABEL[s.weapon]}${DMGTYPE_LABEL[s.dmgType]}</span>
      </div>`;
    });
  }
  html += '</div></div>';
  html += '<div class="bp-tab-content" id="tab-equips">';
  EQUIP_BLUEPRINTS.forEach(eq => {
    html += `<div class="bp-ship-item"><span>${eq.name}</span><span style="color:#5a6b7d;font-size:0.62rem;">${eq.desc}（2件同名合成升级）</span></div>`;
  });
  html += '</div>';
  html += '<div class="bp-tab-content" id="tab-spells">';
  SPELL_BLUEPRINTS.forEach(sp => {
    html += `<div class="bp-ship-item"><span>${sp.name}</span><span style="color:#5a6b7d;font-size:0.62rem;">${sp.desc}</span></div>`;
  });
  html += '</div>';
  html += '<div class="bp-tab-content" id="tab-strategies">';
  DEFENSE_STRATEGIES.forEach(s => {
    const un = strategyUnlocked(s);
    html += `<div class="bp-ship-item"><span>${s.name}（${s.org}）</span><span style="color:#5a6b7d;font-size:0.62rem;">${s.desc}</span><span style="${un ? 'color:#44cc88;' : 'color:#ff5c5c;'}">${un ? '已解锁' : '未解锁'}</span></div>`;
  });
  html += '</div>';
  html += '</div>';
  return html;
}

function renderSupplyPanel() {
  const enh = getEnhanceSummary();
  const b = CONFIG.BARGE[state.bargeLevel - 1];
  const st = state.stats || { wins: 0, losses: 0, kills: 0, bestWave: 0 };
  const fleetCount = state.hand.filter(c => c.ship).length;
  let html = '<div class="supply-panel">';
  html += '<div class="sp-sec"><div class="sp-sec-title">历史战绩（跨局累计）</div>';
  html += `<div class="sp-row"><span>胜利 / 失败</span><span class="v good">${st.wins} / ${st.losses}</span></div>`;
  html += `<div class="sp-row"><span>累计击毁编队</span><span class="v">${st.kills}</span></div>`;
  html += `<div class="sp-row"><span>最高到达回合</span><span class="v">第 ${st.bestWave} 回合</span></div>`;
  html += '</div>';
  html += '<div class="sp-sec"><div class="sp-sec-title">舰队强化联动（保留强化系统）</div>';
  html += `<div class="sp-row"><span>已投入技术等级</span><span class="v">${enh.totalLevels} 级（${enh.ships} 艘舰船）</span></div>`;
  html += `<div class="sp-row"><span>卫戍协议全属性加成</span><span class="v good">+${Math.round((enh.mul - 1) * 100)}%</span></div>`;
  html += `<div class="sp-row"><span>同名舰船额外加成</span><span class="v good">最高 +40%</span></div>`;
  html += '<div class="sp-row" style="color:#5a7a8a;font-size:0.66rem;">去「舰船强化」页面加点即可生效</div>';
  html += '</div>';
  html += '<div class="sp-sec"><div class="sp-sec-title">当前舰队（手牌区）</div>';
  html += `<div class="sp-row"><span>舰队舰船数</span><span class="v">${fleetCount} 艘</span></div>`;
  html += `<div class="sp-row"><span>配队限制</span><span class="v">航母≤2 战巡≤2 其余各≤5</span></div>`;
  html += `<div class="sp-row"><span>补给驳船</span><span class="v">Lv.${state.bargeLevel} · 护盾 ${b.shield}+${state.bonuses.shieldBonus}</span></div>`;
  html += `<div class="sp-row"><span>城防规划</span><span class="v">1-3回合2级城 · 4-6回合3级城 · 7-8回合5级城 · 9-10回合7级城 · 11+回合9级城</span></div>`;
  html += '</div>';
  html += '</div>';
  return html;
}

// ============================================================
//  22. 事件绑定
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initGame();

  document.getElementById('btnSolo')?.addEventListener('click', () => {
    if (state.phase === 'prep' || state.phase === 'battle') {
      showConfirm('开始新模拟', '当前存在进行中的对局，开始新模拟将放弃当前对局。确定继续？', () => {
        initGame();
        showModeSelect();
      });
    } else {
      initGame();
      showModeSelect();
    }
  });
  document.getElementById('btnMode')?.addEventListener('click', () => {
    showModal('协议模式', `
      <div class="supply-panel">
        <div class="sp-sec"><div class="sp-sec-title">入门协议 [初始解锁]</div>
        <div class="sp-row"><span>敌方势力生命</span><span class="v">各 20 点</span></div>
        <div class="sp-row"><span>资金节奏</span><span class="v">第1回合5，第2回合13，之后每回合10</span></div></div>
        <div class="sp-sec"><div class="sp-sec-title">原型协议 [通关入门解锁]</div>
        <div class="sp-row"><span>敌方势力生命</span><span class="v">各 45 点</span></div>
        <div class="sp-row"><span>资金节奏</span><span class="v">第1回合5，之后每回合+1，上限12</span></div></div>
        <div class="sp-sec"><div class="sp-sec-title">核心协议 [通关原型解锁]</div>
        <div class="sp-row"><span>敌方势力生命</span><span class="v">各 45 点</span></div>
        <div class="sp-row"><span>资金节奏</span><span class="v">第1回合3，之后每回合+1，上限12</span></div></div>
      </div>`);
  });
  document.getElementById('btnSupply')?.addEventListener('click', () => {
    showModal('物资调配处', renderSupplyPanel());
  });
  document.getElementById('btnBlueprint')?.addEventListener('click', () => {
    showModal('蓝图数据库（全部舰船）', renderBlueprintDB());
  });
  document.getElementById('btnStrategy')?.addEventListener('click', () => {
    showModal('策略图鉴', `
      <div class="supply-panel">
        <div style="font-size:0.7rem;color:#5a7a8a;margin-bottom:8px;">开局随机 3 选 1，选定后不可更改。部分策略需通关对应模式解锁。</div>
        ${DEFENSE_STRATEGIES.map(s => {
          const un = strategyUnlocked(s);
          return `<div class="sp-sec" style="${un ? '' : 'opacity:0.45;'}">
            <div class="sp-sec-title">${s.name} <span style="color:#ffd166;font-size:0.62rem;">${s.org}</span> ${un ? '' : '锁定'}</div>
            <div class="sp-row"><span>${s.desc}</span></div>
          </div>`;
        }).join('')}
      </div>`);
  });

  document.getElementById('modalCloseBtn')?.addEventListener('click', () => {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
  });
  document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', (e) => {
      if (e.target === m) {
        m.classList.remove('active');
        if (m.id === 'blueModal' && state && state.blueOpenedIn) afterBlueClose();
      }
    });
  });
  document.getElementById('confirmOk')?.addEventListener('click', () => {
    document.getElementById('confirmModal').classList.remove('active');
    if (confirmCallback) { const cb = confirmCallback; confirmCallback = null; cb(); }
  });
  document.getElementById('confirmCancel')?.addEventListener('click', () => {
    document.getElementById('confirmModal').classList.remove('active');
    confirmCallback = null;
  });
  // 标签页
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('bp-tab-btn')) {
      const tab = e.target.dataset.tab;
      document.querySelectorAll('.bp-tab-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      document.querySelectorAll('.bp-tab-content').forEach(c => c.classList.remove('active'));
      const target = document.getElementById('tab-' + tab);
      if (target) target.classList.add('active');
    }
  });
});

// 敌方势力（拉格朗日公司名，用于势力生命条显示）
const ENEMY_FACTIONS = [
  { name: '木星工业', icon: '木', desc: '重甲直射为主' },
  { name: '诺玛运输', icon: '诺', desc: '导弹投射为主' },
  { name: '安东尼奥斯', icon: '安', desc: '能量直射为主' },
  { name: '神圣群星帝国', icon: '神', desc: '混合编队' },
  { name: '雷火科技', icon: '雷', desc: '高速战机突袭' },
  { name: '海雷丁家族', icon: '海', desc: '护航艇蜂群' },
  { name: '比邻星同盟', icon: '比', desc: '均衡混合编队' },
  { name: '维塔斯A-21', icon: '维', desc: '无人机蜂群' }
];
