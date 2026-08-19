// ============================================================
//  卫戍协议 · 拉格朗日战斗版
//  融合三套机制：
//  ① 拉格朗日战斗系统：实弹/能量伤害、装甲/护盾、前中后排站位、
//     直射武器前排优先锁定、投射武器按锁定序列（大船优先）、防空
//  ② 明日方舟·卫戍协议玩法：回合资金、3选1补给池、开局防守策略、
//     回合强化（3/6/10/12/14回合）、势力波次、等阶舰船（Ⅰ~Ⅵ）
//  ③ 明日方舟 wiki 风格：舰船资料卡、敌人图鉴、策略说明表
// ============================================================

// ============================================================
//  0. Supabase 兼容层（保留，数据主要来自本地 ships_data.js）
// ============================================================
let supabaseClient = null;
try {
  if (typeof supabase !== 'undefined' && typeof supabase.from === 'function') {
    supabaseClient = supabase;
  } else if (typeof supabase !== 'undefined' && typeof supabase.createClient === 'function') {
    supabaseClient = supabase.createClient(
      'https://ruwjkbscaotnyhmduviz.supabase.co',
      'sb_publishable_pfDTII6yQ_Behq9Y6wYkHw_UbLW0z7m'
    );
  }
} catch (e) { /* 使用本地数据 */ }

async function ensureShipsData() {
  if (window.SHIPS_DATA && Object.keys(window.SHIPS_DATA).length > 0) return;
  if (!supabaseClient) return;
  try {
    const { data, error } = await supabaseClient.from('ships_data').select('data').eq('id', 'all').single();
    if (!error && data) window.SHIPS_DATA = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
  } catch (e) { /* 使用本地 ships_data.js */ }
}

// ============================================================
//  1. 拉格朗日战斗数据
// ============================================================
const GRID_COLS = 5;
const GRID_ROWS = 6;                       // 6行 = 前排2行 / 中排2行 / 后排2行
const ROW_ZONES = { front: [0, 1], mid: [2, 3], back: [4, 5] };
const ZONE_NAMES = { front: '前排', mid: '中排', back: '后排' };
const ZONE_ICONS = { front: '🛡️', mid: '⚔️', back: '🔭' };

// ---- 锁定序列（拉格朗日：航空母舰→战列巡洋舰→巡洋舰→驱逐舰→护卫舰） ----
const LOCK_SEQUENCE = [
  { cls: 'carrier', label: '航空母舰' },
  { cls: 'battlecruiser', label: '战列巡洋舰' },
  { cls: 'cruiser', label: '巡洋舰' },
  { cls: 'destroyer', label: '驱逐舰' },
  { cls: 'frigate', label: '护卫舰' },
  { cls: 'corvette', label: '护航艇' }
];

// ---- 舰船蓝图池（Ⅰ~Ⅵ等阶，卫戍协议式补给，资金 2~17） ----
const SHIP_BLUEPRINTS = [
  // Ⅰ阶 护卫舰/护航艇（2资金）
  { id: 'fg300',    name: 'FG300型',   icon: '⛵', cls: 'frigate',  tier: 1, cost: 2, dmg: 14, rate: 1.4, range: 2.0, dmgType: 'physical', weapon: 'direct',    armor: 4,  shield: 0, hp: 140, desc: '通用护卫舰 · 直射实弹', wiki: '通用型护卫舰，实弹直射武器，装甲抵抗削减伤害。' },
  { id: 'carilion', name: '卡利莱恩级', icon: '⛵', cls: 'frigate',  tier: 1, cost: 2, dmg: 12, rate: 1.1, range: 2.2, dmgType: 'physical', weapon: 'direct',    armor: 6,  shield: 0, hp: 170, desc: '重甲护卫舰 · 直射实弹', wiki: '重型装甲护卫舰，生存能力突出，适合前排抗伤。' },
  { id: 'xt8',      name: 'XT-8级',    icon: '⛵', cls: 'frigate',  tier: 1, cost: 2, dmg: 11, rate: 1.6, range: 1.8, dmgType: 'physical', weapon: 'projectile', armor: 3,  shield: 0, hp: 120, desc: '导弹护卫舰 · 投射实弹', wiki: '武装导弹调查船，投射武器按锁定序列打击目标。' },
  // Ⅱ阶 驱逐舰/战机（3资金）
  { id: 'ac721',    name: 'AC721',     icon: '🚢', cls: 'destroyer',tier: 2, cost: 3, dmg: 26, rate: 1.0, range: 2.6, dmgType: 'physical', weapon: 'direct',    armor: 6,  shield: 0, hp: 260, desc: '重型突击驱逐舰 · 直射实弹', wiki: '重型两栖突击舰，中型直射火力，可兼顾攻坚。' },
  { id: 'mistral',  name: '米斯特拉',   icon: '🛩️', cls: 'fighter',  tier: 2, cost: 3, dmg: 22, rate: 1.8, range: 3.0, dmgType: 'physical', weapon: 'air', aaType: 'full',
    aaWeapons: 2, aaAmmo: 0, aaHitFighter: 0.75, aaHitCorvette: 0.90,       armor: 2,  shield: 0, hp: 90,  desc: '战斗攻击机 · 主动防空', wiki: '主动防空战机，优先拦截敌方战机与护航艇。' },
  { id: 'borrow',   name: '凛冽级',    icon: '🚢', cls: 'destroyer',tier: 2, cost: 3, dmg: 30, rate: 0.7, range: 3.0, dmgType: 'energy',   weapon: 'direct',    armor: 5,  shield: 30, hp: 280, desc: '导弹驱逐舰 · 直射能量', wiki: '配备能量武器的驱逐舰，先破护盾再造成全额伤害。' },
  // Ⅲ阶 巡洋舰（5资金）
  { id: 'cas066',   name: 'CAS066级',  icon: '🛳️', cls: 'cruiser',  tier: 3, cost: 5, dmg: 44, rate: 0.8, range: 3.2, dmgType: 'physical', weapon: 'projectile', armor: 8,  shield: 0, hp: 420, desc: '导弹巡洋舰 · 投射实弹', wiki: '通用巡洋舰，投射武器按锁定序列优先打击大型舰船。' },
  { id: 'io',       name: '艾奥级',    icon: '🛳️', cls: 'cruiser',  tier: 3, cost: 5, dmg: 50, rate: 0.6, range: 3.4, dmgType: 'energy',   weapon: 'direct',    armor: 7,  shield: 40, hp: 400, desc: '离子炮巡洋舰 · 直射能量', wiki: '离子炮直射能量武器，攻城能力出众，能量伤害无视装甲。' },
  { id: 'chaos',    name: '康纳马拉混沌级', icon: '🛳️', cls: 'cruiser', tier: 3, cost: 5, dmg: 40, rate: 0.9, range: 3.0, dmgType: 'physical', weapon: 'direct',    armor: 9,  shield: 0, hp: 450, desc: '轨道炮巡洋舰 · 直射实弹', wiki: '高速等离子与轨道炮巡洋舰，中排主力输出。' },
  // Ⅳ阶 重型巡洋/战列巡洋舰（8资金）
  { id: 'callisto', name: '卡利斯托',   icon: '🛳️', cls: 'cruiser',  tier: 4, cost: 8, dmg: 75, rate: 0.5, range: 3.5, dmgType: 'physical', weapon: 'projectile', armor: 10, shield: 0, hp: 600, desc: '鱼雷突击巡洋舰 · 投射实弹', wiki: '重型鱼雷突击舰，投射武器对大型舰船伤害极高。' },
  { id: 'st59',     name: 'ST59级',    icon: '⚓', cls: 'battlecruiser', tier: 4, cost: 8, dmg: 70, rate: 0.6, range: 3.6, dmgType: 'physical', weapon: 'direct',    armor: 14, shield: 0, hp: 750, desc: '防御战列巡洋舰 · 直射实弹', wiki: '防御型战列巡洋舰，装甲厚重，前排核心抗伤。' },
  { id: 'chimaera', name: '奇美拉级',   icon: '🛳️', cls: 'cruiser',  tier: 4, cost: 8, dmg: 65, rate: 0.7, range: 3.3, dmgType: 'physical', weapon: 'direct',    armor: 12, shield: 0, hp: 550, desc: '火炮巡洋舰 · 直射实弹', wiki: '重型火炮巡洋舰，均衡的直射火力平台。' },
  // Ⅴ阶 战列巡洋舰/航空母舰（12~13资金）
  { id: 'eternal',  name: '永恒风暴级', icon: '⚓', cls: 'battlecruiser', tier: 5, cost: 12, dmg: 120, rate: 0.45, range: 4.0, dmgType: 'energy', weapon: 'direct',    armor: 16, shield: 80, hp: 1100, desc: '攻击战列巡洋舰 · 直射能量', wiki: '攻击型战列巡洋舰，旗舰级能量直射火力。' },
  { id: 'solarwhale', name: '太阳鲸',  icon: '✈️', cls: 'carrier', tier: 5, cost: 13, dmg: 55, rate: 1.0, range: 3.2, dmgType: 'physical', weapon: 'air', aaType: 'half',
    aaWeapons: 4, aaAmmo: 0, aaHitFighter: 0.60, aaHitCorvette: 0.75,       armor: 10, shield: 0, hp: 1300, desc: '无人机航空母舰 · 舰载机群', wiki: '武装战术航母，持续释放舰载机打击所有排位目标。' },
  { id: 'spear',    name: '乌拉诺斯之矛级', icon: '⚓', cls: 'battlecruiser', tier: 5, cost: 12, dmg: 110, rate: 0.5, range: 3.8, dmgType: 'physical', weapon: 'projectile', armor: 15, shield: 0, hp: 1050, desc: '重型战列巡洋舰 · 投射实弹', wiki: '重型战列巡洋舰，导弹投射按锁定序列打击。' },
  // Ⅵ阶 旗舰（16~17资金）
  { id: 'constantine', name: '新君士坦丁大帝级', icon: '⚓', cls: 'battlecruiser', tier: 6, cost: 16, dmg: 200, rate: 0.4, range: 4.2, dmgType: 'energy', weapon: 'direct', armor: 20, shield: 120, hp: 1800, desc: '综合战列巡洋舰 · 旗舰直射', wiki: '帝国旗舰，综合型能量直射，全战场压制。' },
  { id: 'cv3000',   name: 'CV3000级',  icon: '✈️', cls: 'carrier', tier: 6, cost: 17, dmg: 80, rate: 1.2, range: 3.6, dmgType: 'physical', weapon: 'air', aaType: 'half',
    aaWeapons: 4, aaAmmo: 0, aaHitFighter: 0.60, aaHitCorvette: 0.75,       armor: 12, shield: 0, hp: 2000, desc: '快速航空母舰 · 舰载机群', wiki: '快速航母，舰载机群火力覆盖，锁定序列为最高优先。' }
];

// ---- 敌方势力（拉格朗日公司，随机抽两组） ----
const ENEMY_FACTIONS = [
  {
    name: '木星工业舰队', icon: '🪐', desc: '重甲直射为主',
    squads: [
      { cls: 'frigate', zone: 'front', hp: 90, armor: 5, shield: 0, dmgType: 'physical', weapon: 'direct', reward: 8 },
      { cls: 'destroyer', zone: 'front', hp: 150, armor: 7, shield: 0, dmgType: 'physical', weapon: 'direct', reward: 12 },
      { cls: 'cruiser', zone: 'mid', hp: 300, armor: 10, shield: 20, dmgType: 'energy', weapon: 'direct', reward: 20 },
      { cls: 'battlecruiser', zone: 'mid', hp: 600, armor: 14, shield: 0, dmgType: 'physical', weapon: 'projectile', reward: 40 }
    ]
  },
  {
    name: '诺玛运输舰队', icon: '🚛', desc: '导弹投射为主',
    squads: [
      { cls: 'frigate', zone: 'front', hp: 80, armor: 4, shield: 0, dmgType: 'physical', weapon: 'projectile', reward: 8 },
      { cls: 'cruiser', zone: 'mid', hp: 280, armor: 8, shield: 30, dmgType: 'energy', weapon: 'projectile', reward: 20 },
      { cls: 'carrier', zone: 'back', hp: 900, armor: 10, shield: 0, dmgType: 'physical', weapon: 'air', reward: 50 }
    ]
  },
  {
    name: '安东尼奥斯舰队', icon: '💠', desc: '能量直射为主',
    squads: [
      { cls: 'frigate', zone: 'front', hp: 75, armor: 3, shield: 20, dmgType: 'energy', weapon: 'direct', reward: 8 },
      { cls: 'cruiser', zone: 'mid', hp: 260, armor: 7, shield: 50, dmgType: 'energy', weapon: 'direct', reward: 20 },
      { cls: 'battlecruiser', zone: 'mid', hp: 550, armor: 12, shield: 60, dmgType: 'energy', weapon: 'direct', reward: 40 }
    ]
  },
  {
    name: '神圣群星帝国舰队', icon: '🌟', desc: '混合编队',
    squads: [
      { cls: 'frigate', zone: 'front', hp: 100, armor: 6, shield: 0, dmgType: 'physical', weapon: 'direct', reward: 9 },
      { cls: 'destroyer', zone: 'front', hp: 170, armor: 8, shield: 0, dmgType: 'physical', weapon: 'projectile', reward: 13 },
      { cls: 'cruiser', zone: 'mid', hp: 320, armor: 9, shield: 30, dmgType: 'physical', weapon: 'projectile', reward: 22 },
      { cls: 'battlecruiser', zone: 'back', hp: 700, armor: 15, shield: 40, dmgType: 'energy', weapon: 'direct', reward: 45 }
    ]
  },
  {
    name: '雷火科技舰队', icon: '⚡', desc: '高速战机突袭',
    squads: [
      { cls: 'corvette', zone: 'front', hp: 50, armor: 2, shield: 0, dmgType: 'physical', weapon: 'projectile', reward: 6 },
      { cls: 'fighter', zone: 'back', hp: 60, armor: 1, shield: 0, dmgType: 'physical', weapon: 'air', reward: 8 },
      { cls: 'cruiser', zone: 'mid', hp: 240, armor: 8, shield: 0, dmgType: 'physical', weapon: 'direct', reward: 18 },
      { cls: 'battlecruiser', zone: 'back', hp: 520, armor: 13, shield: 0, dmgType: 'physical', weapon: 'direct', reward: 38 }
    ]
  },
  {
    name: '海雷丁家族舰队', icon: '🏴‍☠️', desc: '护航艇蜂群',
    squads: [
      { cls: 'corvette', zone: 'front', hp: 45, armor: 2, shield: 0, dmgType: 'physical', weapon: 'projectile', reward: 5 },
      { cls: 'corvette', zone: 'front', hp: 55, armor: 2, shield: 0, dmgType: 'physical', weapon: 'air', reward: 6 },
      { cls: 'destroyer', zone: 'front', hp: 140, armor: 6, shield: 0, dmgType: 'physical', weapon: 'projectile', reward: 12 },
      { cls: 'carrier', zone: 'back', hp: 800, armor: 9, shield: 0, dmgType: 'physical', weapon: 'air', reward: 45 }
    ]
  }
];

// ---- 防守策略（卫戍协议式：开局三选一，不可更改） ----
const DEFENSE_STRATEGIES = [
  {
    id: 'aegis', name: '天衣无缝', icon: '🛡️', life: 24, hero: '凯尔希',
    desc: '我方生命值 24。所有舰船攻击力、装甲 +15%，敌人攻击力 -20%。',
    effect: () => {
      window._stratBonus = { dmg: 1.15, armor: 1.15 };
      window._enemyDmgMul = 0.8;
    }
  },
  {
    id: 'swift', name: '快刀乱麻', icon: '⚔️', life: 14, hero: 'Sharp',
    desc: '我方生命值 14。全场攻击力最高的舰船攻击力 +70%，且攻速 +30%。',
    effect: () => {
      window._stratBonus = { dmg: 1.0, armor: 1.0, elite: true };
    }
  },
  {
    id: 'recycle', name: '回收利用', icon: '💰', life: 18, hero: '休谟斯',
    desc: '我方生命值 18。每击倒 12 个敌人，战斗结束时奖励 3 资金。',
    effect: () => {
      window._stratBonus = { dmg: 1.0, armor: 1.0, recycle: true };
    }
  },
  {
    id: 'gamer', name: '游戏高手', icon: '🎲', life: 16, hero: '绮良',
    desc: '我方生命值 16。每消耗 20 资金，获得 1 艘随机不高于当前等级的舰船。',
    effect: () => {
      window._stratBonus = { dmg: 1.0, armor: 1.0, gacha: true };
    }
  }
];

// ---- 回合强化池（第3/6/10/12/14回合） ----
const UPGRADE_POOL = [
  { name: '⚡ 资金注入 +12', effect: (g) => { g.funds += 12; } },
  { name: '🔫 全舰攻击 +15%', effect: (g) => { g.dmgMul *= 1.15; } },
  { name: '💨 全舰攻速 +20%', effect: (g) => { g.rateMul *= 1.2; } },
  { name: '🛡️ 全舰装甲 +3', effect: (g) => { g.armorBonus += 3; } },
  { name: '❤️ 生命 +3', effect: (g) => { g.life = Math.min(g.life + 3, 40); } },
  { name: '📡 射程 +0.5', effect: (g) => { g.rangeBonus += 0.5; } },
  { name: '🎖️ 免费获得随机舰船（当前等级）', effect: (g) => { g.freeShip = true; } },
  { name: '⚔️ 直射武器伤害 +25%', effect: (g) => { g.directMul *= 1.25; } },
  { name: '🚀 投射武器伤害 +25%', effect: (g) => { g.projMul *= 1.25; } },
  { name: '🛩️ 防空火力 +40%', effect: (g) => { g.airMul *= 1.4; } }
];

// ============================================================
//  2. Python 计算引擎（Pyodide · WebAssembly）
//     计算程序为 python（py/weishu_calc.py）：伤害结算、锁定规则、
//     波次生成、回合资金、补给池/强化抽取全部由 Python 计算。
//     Pyodide 加载失败时自动降级为 JS 计算引擎（游戏永不白屏）。
// ============================================================
let pyEngine = null;
let pyMode = false;
let pyInitPromise = null;

function py(fnName, ...args) {
  if (!pyMode || !pyEngine) return null;
  try {
    const r = pyEngine.globals.get(fnName)(...args);
    if (r && typeof r.toJs === 'function') {
      return r.toJs({ create_proxies: false, dict_converter: Object.fromEntries });
    }
    return r;
  } catch (e) {
    console.warn('⚠️ Python 计算失败，降级 JS 引擎:', fnName, e.message);
    return null;
  }
}

function setEngineTag(txt) {
  const el = document.getElementById('engineTag');
  if (el) el.textContent = txt;
}

// 动态加载外部脚本（异步 + 超时，绝不阻塞页面）
function loadScriptAsync(src, timeoutMs) {
  return new Promise(resolve => {
    const s = document.createElement('script');
    s.src = src;
    let done = false;
    const finish = (ok) => { if (!done) { done = true; resolve(ok); } };
    s.onload = () => finish(true);
    s.onerror = () => finish(false);
    setTimeout(() => finish(false), timeoutMs || 6000);
    document.head.appendChild(s);
  });
}

async function initPyEngine() {
  if (pyInitPromise) return pyInitPromise;
  pyInitPromise = (async () => {
    try {
      setEngineTag('⏳ Python 引擎加载中…');
      // CDN 依次尝试：jsdelivr → unpkg（各 6 秒超时）
      // 本地同源优先（修复 Edge Tracking Prevention 阻止 jsdelivr 存储），失败回退 CDN
      const cdnList = [
        'pyodide/pyodide.js',
        'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js',
        'https://unpkg.com/pyodide@0.26.4/full/pyodide.js'
      ];
      let loaded = false, loadedSrc = '';
      for (const cdn of cdnList) {
        if (await loadScriptAsync(cdn, 6000)) { loaded = true; loadedSrc = cdn; break; }
      }
      if (!loaded || typeof loadPyodide !== 'function') throw new Error('Pyodide CDN 不可用');
      const isLocal = loadedSrc === 'pyodide/pyodide.js';
    pyEngine = await loadPyodide(isLocal ? { indexURL: 'pyodide/' } : undefined);
      const resp = await fetch('py/weishu_calc.py');
      if (!resp.ok) throw new Error('py/weishu_calc.py 加载失败');
      await pyEngine.runPythonAsync(await resp.text());
      pyMode = true;
      console.log('✅ Python 计算引擎已启动（py/weishu_calc.py）');
      setEngineTag('🐍 Python 计算引擎');
      return true;
    } catch (e) {
      pyEngine = null;
      pyMode = false;
      console.warn('⚠️ Python 引擎不可用，使用 JS 计算引擎:', e.message);
      setEngineTag('⚙️ JS 计算引擎');
      return false;
    }
  })();
  return pyInitPromise;
}

// ============================================================
//  3. 游戏状态
// ============================================================
let grid = [];
let towers = {};              // key "r,c" → 舰船塔实例
let enemies = [];
let funds = 5;                // 卫戍协议入门：第1回合5资金
let life = 10;
let wave = 1;
let gameActive = false;
let selectedBlueprint = null; // 补给池选中的蓝图
let shipPool = [];            // 当前3选1补给池
let spawnInterval = null;
let gameLoopInterval = null;
let fundsTimer = null;
let strat = null;
let killsThisWave = 0;
let totalKills = 0;
let spentFunds = 0;
let g = {                    // 全局强化参数
  dmgMul: 1, rateMul: 1, armorBonus: 0, rangeBonus: 0,
  directMul: 1, projMul: 1, airMul: 1, life: 10, funds: 5, freeShip: false
};

const CLS_IMG = {
  '航空母舰': 'photo/微信图片_20260731000935_177_7.jpg',
  '支援舰': 'photo/微信图片_20260731113333_179_7.jpg',
  '战列巡洋舰': 'photo/微信图片_20260731113857_181_7.jpg',
  '巡洋舰': 'photo/微信图片_20260731113858_182_7.jpg',
  '驱逐舰': 'photo/微信图片_20260731114137_183_7.jpg',
  '护卫舰': 'photo/微信图片_20260731114208_184_7.jpg',
  '护航艇': 'photo/微信图片_20260731114434_185_7.jpg',
  '战机': 'photo/微信图片_20260731114451_186_7.jpg'
};
// 敌人舰种 → 图片（按舰种名）
CLS_ICONS = { frigate: CLS_IMG['护卫舰'], destroyer: CLS_IMG['驱逐舰'], cruiser: CLS_IMG['巡洋舰'], battlecruiser: CLS_IMG['战列巡洋舰'], carrier: CLS_IMG['航空母舰'], fighter: CLS_IMG['战机'], corvette: CLS_IMG['护航艇'] };
const CLS_ZH = { frigate: '护卫舰', destroyer: '驱逐舰', cruiser: '巡洋舰', battlecruiser: '战列巡洋舰', carrier: '航空母舰', fighter: '战机', corvette: '护航艇' };
const CLS_NAMES = { frigate: '护卫舰', destroyer: '驱逐舰', cruiser: '巡洋舰', battlecruiser: '战列巡洋舰', carrier: '航空母舰', fighter: '战机', corvette: '护航艇' };
const WEAPON_LABEL = { direct: '直射', projectile: '投射', air: '防空' };
const TIER_NUM = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ'];

// 舰船属性文本（用于补给池 / 塔信息 / 提示）
function shipAttrText(b, withName) {
  const parts = ['⚔️' + b.dmg, '💨' + b.rate, '📏' + b.range, '🛡️' + b.armor];
  if (b.shield > 0) parts.push('🔮' + b.shield);
  parts.push(WEAPON_LABEL[b.weapon] || b.weapon);
  parts.push(b.dmgType === 'energy' ? '能量' : '实弹');
  parts.push('等阶' + TIER_NUM[(b.tier || 1) - 1]);
  return (withName ? b.icon + ' ' + b.name + '：' : '') + parts.join(' ');
}

// ============================================================
//  3. 拉格朗日战斗核心
// ============================================================

// 伤害计算：实弹受装甲抵抗，能量先耗护盾（Python 引擎优先）
function calcDamage(dmg, dmgType, target) {
  const r = py('calc_damage', dmg, dmgType, target.armor, target.shield);
  if (r) {
    const dealt = Number(r[0]);
    target.shield = Number(r[1]);
    return dealt;
  }
  // JS 降级
  if (dmgType === 'energy') {
    if (target.shield > 0) {
      const absorbed = Math.min(target.shield, dmg);
      target.shield -= absorbed;
      return dmg - absorbed;   // 破盾后剩余伤害全额
    }
    return dmg;
  }
  return Math.max(1, dmg - target.armor);
}

// 锁定目标（拉格朗日锁定规则，Python 引擎优先）
function acquireTarget(tower, now) {
  const r = py('acquire_target', tower, enemies);
  if (r !== null && r !== undefined) {
    const idx = Number(r);
    return idx >= 0 ? (enemies[idx] || null) : null;
  }
  // JS 降级
  // 防空锁定（参照拉格朗日防空机制：全场/半场/同排/反击/灵活防空）
  if (tower.weapon === 'air') {
    const ar = py('aa_lock', tower, enemies);
    if (ar !== null && ar !== undefined) {
      const ai = Number(ar);
      return ai >= 0 ? (enemies[ai] || null) : null;
    }
    // JS 降级：防空范围判定
    const aaType = tower.aaType || 'row';
    const tRow = tower.row || 2;
    const inAA = enemies.filter(e => {
      if (Math.abs((e.col || 0) - (tower.col || 0)) > (tower.range || 5)) return false;
      const er = e.row || 0;
      if (aaType === 'full') return true;
      if (aaType === 'half') return er >= 4;
      if (aaType === 'row') return Math.abs(er - tRow) < 1;
      if (aaType === 'self') return Math.abs(er - tRow) <= 0.5;
      return Math.abs(er - tRow) <= 0.5 || Math.abs(er - tRow) < 1; // flex
    });
    const airTargets = inAA.filter(e => e.cls === 'fighter' || e.cls === 'corvette');
    const pool2 = airTargets.length ? airTargets : inAA;
    if (!pool2.length) return null;
    // 优先打击入侵我方空域的敌方空中单位（row>=4），随后交战区，最后敌方空域
    pool2.sort((a, b) => {
      const pa = a.row >= 4 ? 0 : (a.row >= 2 ? 1 : 2);
      const pb = b.row >= 4 ? 0 : (b.row >= 2 ? 1 : 2);
      return pa - pb;
    });
    return pool2[0];
  }
  const zoneOrder = tower.weapon === 'direct'
    ? ['front', 'mid', 'back']
    : null;

  let candidates = [];
  if (tower.weapon === 'projectile') {
    for (const seq of LOCK_SEQUENCE) {
      const found = enemies.filter(e => e.cls === seq.cls);
      if (found.length) { candidates = found; break; }
    }
    if (!candidates.length) candidates = enemies;
  } else {
    for (const zone of zoneOrder) {
      const inZone = enemies.filter(e => e.zone === zone);
      if (inZone.length) { candidates = inZone; break; }
    }
    if (!candidates.length) candidates = enemies;
  }
  if (!candidates.length) return null;
  const col = tower.col;
  const inRange = candidates.filter(e => Math.abs(e.col - col) <= tower.range);
  const list = inRange.length ? inRange : candidates;
  return list.reduce((a, b) => (a.hp < b.hp ? a : b));
}

function towersAttack(now) {
  // Python 引擎：一次调用结算全部塔的攻击
  const p = py('tick_combat', towers, enemies, {
    dmgMul: g.dmgMul,
    directMul: g.directMul,
    projMul: g.projMul,
    airMul: g.airMul,
    eliteKey: g._eliteKey || null
  }, now);
  if (p && p.hits && p.hits.length !== undefined) {
    p.hits.forEach(h => {
      const t = towers[h.key];
      if (t) t.lastFireTime = now;
      const en = enemies[h.idx];
      if (!en) return;
      en.hp -= h.dealt;
      en.shield = h.newShield;
      if (en.hp <= 0) {
        const i = enemies.indexOf(en);
        if (i > -1) enemies.splice(i, 1);
        totalKills++;
        killsThisWave++;
        if (strat === 'recycle' && totalKills % 12 === 0) {
          g.funds += 3;
          updateFunds();
        }
      }
    });
    return;
  }
  // JS 降级
  for (const key of Object.keys(towers)) {
    const t = towers[key];
    if (!t || now - t.lastFireTime < 1000 / t.fireRate) continue;
    const target = acquireTarget(t, now);
    if (!target) continue;
    t.lastFireTime = now;
    // 防空武器打击战机/护航艇：使用防空命中率（效率×基础修正）与对空增伤
    const isAirTarget = target.cls === 'fighter' || target.cls === 'corvette';
    let airHitRolled = false;
    if (t.weapon === 'air' && isAirTarget) {
      const eff = py('aa_efficiency', t.aaWeapons || 1);
      const effV = (eff !== null && eff !== undefined) ? eff : [1, 0.8, 0.7, 0.6, 0.45][Math.min(4, (t.aaWeapons || 1) - 1)] || 0.3;
      const baseHit = target.cls === 'fighter' ? (t.aaHitFighter || 0.75) : (t.aaHitCorvette || 0.9);
      const airHit = py('aa_hit_rate', baseHit, effV, 1, target.dodge || 0, 0, 0);
      const aHit = (airHit !== null && airHit !== undefined) ? airHit : Math.max(0.10, Math.min(0.95, baseHit * effV * (1 - (target.dodge || 0))));
      if (Math.random() > aHit) continue;
      airHitRolled = true;
    } else {
      // 命中判定（武器计算：基础85%×(1-闪避)，极限10%-95%）
      const hRate = Math.max(0.10, Math.min(0.95, 0.85 * (1 - (target.dodge || 0.05))));
      if (Math.random() > hRate) continue;
    }
    let dmg = t.dmg * g.dmgMul;
    if (t.weapon === 'direct') dmg *= g.directMul;
    if (t.weapon === 'projectile') dmg *= g.projMul;
    if (t.weapon === 'air') dmg *= g.airMul;
    if (t.weapon === 'air' && isAirTarget) {
      // 对空增伤（防空特种弹药）：增伤比 = 1 + 特种弹药值 / 基础单发伤害
      const boost = py('aa_damage_boost', t.dmg, t.aaAmmo || 0);
      dmg *= (boost !== null && boost !== undefined) ? boost : (1 + (t.aaAmmo || 0) / (t.dmg || 1));
    }
    // 快刀乱麻：全场最高攻击舰船 +70%
    if (g._eliteKey === key) dmg *= 1.7;
    const dealt = calcDamage(dmg, t.dmgType, target);
    target.hp -= dealt;
    if (target.hp <= 0) {
      const i = enemies.indexOf(target);
      if (i > -1) enemies.splice(i, 1);
      totalKills++;
      killsThisWave++;
      // 回收利用：每12杀 +3资金（战斗结束时结算）
      if (strat === 'recycle' && totalKills % 12 === 0) {
        g.funds += 3;
        updateFunds();
      }
    }
  }
}

// ============================================================
//  4. 卫戍协议玩法：资金 / 补给池 / 策略 / 强化
// ============================================================

function refreshPool() {
  // 当前补给等级 = 波次/2 + 1（上限6）
  const level = Math.min(6, Math.floor(wave / 2) + 1);
  // Python：roll_pool（补给池3选1）
  const r = py('roll_pool', level, SHIP_BLUEPRINTS);
  if (Array.isArray(r) && r.length) { shipPool = r; renderPool(); return; }
  // JS 降级
  const avail = SHIP_BLUEPRINTS.filter(b => b.tier <= level);
  const pool = [];
  const used = new Set();
  while (pool.length < 3 && used.size < avail.length) {
    const b = avail[Math.floor(Math.random() * avail.length)];
    if (!used.has(b.id)) { used.add(b.id); pool.push(b); }
  }
  shipPool = pool;
  renderPool();
}

function buyShip(bp) {
  if (strat === null) return;                 // 未选择策略前不可购买
  if (g.funds < bp.cost) { flashTip('资金不足！'); return; }
  g.funds -= bp.cost;
  spentFunds += bp.cost;
  selectedBlueprint = bp;
  updateFunds();
  // 游戏高手：每消耗20资金获得1艘随机舰船
  if (strat === 'gamer') {
    const gained = Math.floor(spentFunds / 20);
    window._gachaCount = (window._gachaCount || 0);
    while (window._gachaCount < gained) {
      window._gachaCount++;
      const level = Math.min(6, Math.floor(wave / 2) + 1);
      const avail = SHIP_BLUEPRINTS.filter(b => b.tier <= level);
      const rand = avail[Math.floor(Math.random() * avail.length)];
      g.freeShip = true;
      window._pendingFree = rand;
      flashTip('🎲 游戏高手：获得 ' + rand.icon + ' ' + rand.name + '！');
    }
  }
}

function grantFreeShip() {
  if (!window._pendingFree) {
    const level = Math.min(6, Math.floor(wave / 2) + 1);
    const avail = SHIP_BLUEPRINTS.filter(b => b.tier <= level);
    window._pendingFree = avail[Math.floor(Math.random() * avail.length)];
  }
  const bp = window._pendingFree;
  window._pendingFree = null;
  selectedBlueprint = bp;
  flashTip('🎖️ 免费舰船：' + bp.icon + ' ' + bp.name + '（点击网格部署）');
}

function placeShip(r, c) {
  if (grid[r][c]) {
    // 已有舰船：点击查看属性
    const t = towers[r + ',' + c];
    if (t) flashTip(shipAttrText(t, true) + ' · ' + CLS_NAMES[t.cls] || '');
    return;
  }
  if (!selectedBlueprint) { flashTip('先在补给池选择一艘舰船'); return; }
  const key = r + ',' + c;
  if (grid[r][c]) { flashTip('该位置已有舰船'); return; }
  grid[r][c] = 1;
  towers[key] = {
    bp: selectedBlueprint,
    name: selectedBlueprint.name,
    icon: selectedBlueprint.icon,
    cls: selectedBlueprint.cls,
    tier: selectedBlueprint.tier,
    dmg: selectedBlueprint.dmg,
    rate: selectedBlueprint.rate * g.rateMul,
    range: selectedBlueprint.range + g.rangeBonus,
    row: r,
    aaType: selectedBlueprint.aaType || 'row',
    dmgType: selectedBlueprint.dmgType,
    weapon: selectedBlueprint.weapon,
    armor: selectedBlueprint.armor + g.armorBonus,
    zone: r < 2 ? 'front' : (r < 4 ? 'mid' : 'back'),
    lastFireTime: 0
  };
  // 快刀乱麻：标记全场最高攻击
  if (strat === 'swift') {
    let maxKey = null, maxDmg = -1;
    Object.keys(towers).forEach(k => { if (towers[k].dmg > maxDmg) { maxDmg = towers[k].dmg; maxKey = k; } });
    g._eliteKey = maxKey;
  }
  renderGrid();
  renderTowerBar();
  flashTip('✅ 已部署 ' + selectedBlueprint.icon + ' ' + selectedBlueprint.name);
}

// ============================================================
//  5. 渲染
// ============================================================
function renderGrid() {
  const gridEl = document.getElementById('grid');
  if (!gridEl) return;
  gridEl.innerHTML = '';
  for (let r = 0; r < GRID_ROWS; r++) {
    const zone = r < 2 ? 'front' : (r < 4 ? 'mid' : 'back');
    for (let c = 0; c < GRID_COLS; c++) {
      const cell = document.createElement('div');
      cell.className = 'ws-cell zone-' + zone;
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener('click', () => placeShip(r, c));
      const key = r + ',' + c;
      if (towers[key]) {
        const t = towers[key];
        cell.innerHTML = '<div class="ws-tower tier-' + t.tier + '"><img src="' + (CLS_IMG[CLS_ZH[t.cls]] || '') + '" class="ws-tower-img"></div>'; if(false) cell.innerHTML = '<div class="ws-tower tier-' + t.tier + '">' + t.icon +
          '<span class="ws-tower-lv">' + t.tier + '</span></div>';
      }
      gridEl.appendChild(cell);
    }
  }
}
function renderEnemies() {
  const c = document.getElementById('grid');
  if (!c) return;
  c.querySelectorAll('.ws-enemy').forEach(e => e.remove());
  const cells = c.querySelectorAll('.ws-cell');
  enemies.forEach(en => {
    const row = Math.floor(en.row), col = Math.floor(en.col);
    if (row >= 0 && row < GRID_ROWS && col >= 0 && col < GRID_COLS && cells[row * GRID_COLS + col]) {
      const el = document.createElement('div');
      el.className = 'ws-enemy enemy-' + en.cls + (en.shield > 0 ? ' shielded' : '');
      const pct = Math.max(16, (en.hp / en.maxHp) * 80);
      el.style.width = pct + '%';
      el.style.height = pct + '%';
      el.innerHTML = '<img src="' + (CLS_ICONS[en.cls] || '') + '" class="ws-enemy-img">';
      el.title = (CLS_NAMES[en.cls] || '') + ' HP:' + Math.ceil(en.hp) + (en.shield > 0 ? ' 护盾:' + Math.ceil(en.shield) : '');
      cells[row * GRID_COLS + col].appendChild(el);
    }
  });
}

function renderPool() {
  const el = document.getElementById('poolBar');
  if (!el) return;
  el.innerHTML = shipPool.map(b => `
    <div class="ws-pool-card tier-${b.tier} ${selectedBlueprint && selectedBlueprint.id === b.id ? 'selected' : ''}" onclick="window._selectPool('${b.id}')">
      <div class="ws-pc-head">
        <span class="ws-pc-icon"><img src="${CLS_IMG[CLS_ZH[b.cls]] || ''}" class="ws-pc-img"></span>
        <span class="ws-pc-name">${b.name}</span>
        <span class="ws-pc-tier">等阶${TIER_NUM[(b.tier || 1) - 1]}</span>
      </div>
      <div class="ws-pc-stats">
        <span>⚔️${b.dmg}</span><span>💨${b.rate}</span><span>📏${b.range}</span><span>🛡️${b.armor}</span>${b.shield > 0 ? `<span>🔮${b.shield}</span>` : ''}
      </div>
      <div class="ws-pc-tags">
        <span class="ws-pc-tag">${WEAPON_LABEL[b.weapon] || b.weapon}</span>
        <span class="ws-pc-tag">${b.dmgType === 'energy' ? '能量' : '实弹'}</span>
      </div>
      <span class="ws-pc-cost">${b.cost}</span>
    </div>
  `).join('') || '<div class="ws-empty">补给池为空</div>';
}

window._selectPool = function(id) {
  const bp = SHIP_BLUEPRINTS.find(b => b.id === id);
  if (!bp) return;
  if (g.funds < bp.cost) { flashTip('资金不足！'); return; }
  buyShip(bp);
  renderPool();
};

function renderTowerBar() {
  const el = document.getElementById('towerBar');
  if (!el) return;
  el.innerHTML = '<span class="ws-dock-title">🛰️ 已部署舰船</span>' + Object.keys(towers).map(key => {
    const t = towers[key];
    const elite = (strat === 'swift' && g._eliteKey === key) ? ' elite' : '';
    return `<div class="ws-dock-slot${elite}" title="${t.name}">
      <img src="${CLS_IMG[CLS_ZH[t.cls]] || ''}" class="ws-dock-img">
      <span class="ws-dock-tier">${t.tier}</span>
    </div>`;
  }).join('');
}

function updateFunds() {
  const el = document.getElementById('fundsDisplay');
  if (el) el.textContent = Math.floor(g.funds);
}
function updateLife() {
  const el = document.getElementById('lifeDisplay');
  if (el) el.textContent = g.life;
}
function updateWave() {
  const el = document.getElementById('waveDisplay');
  if (el) el.textContent = wave;
}

let tipTimer = null;
function flashTip(msg) {
  const el = document.getElementById('gameTip');
  if (!el) return;
  el.textContent = msg;
  el.style.opacity = 1;
  if (tipTimer) clearTimeout(tipTimer);
  tipTimer = setTimeout(() => { el.style.opacity = 0; }, 2000);
}

// ============================================================
//  6. 波次与敌人
// ============================================================

function createEnemySquad(faction, wave) {
  // 参照城防数据：从 CITY_FLEETS 随机组合舰队（78艘城防舰船池）
  const pool = (window.CITY_FLEETS || []).filter(s => s.tier <= Math.min(6, 1 + Math.floor(wave / 2)));
  if (!pool.length) return [{ cls: 'frigate', zone: 'front', hp: 90, armor: 5, shield: 0, dmgType: 'physical', weapon: 'direct', tier: 2, reward: 8, dodge: 0.1, row: -1, col: 2, speed: 0.4 }];
  const count = Math.min(2 + Math.floor(wave / 2), 8);
  const mul = 1 + wave * 0.08;
  const squad = [];
  for (let i = 0; i < count; i++) {
    const s = pool[Math.floor(Math.random() * pool.length)];
    const hp = Math.round(s.hp * mul * (strat === 'aegis' ? 0.8 : 1));
    squad.push({
      cls: s.cls, zone: s.zone, zh: s.zh || '', en: s.en || '',
      hp: hp, maxHp: hp, armor: s.armor, shield: s.shield,
      dmgType: s.dmgType, weapon: s.weapon,
      tier: s.tier, reward: s.reward, dodge: s.dodge || 0.05,
      row: -1 - Math.random(), col: Math.floor(Math.random() * GRID_COLS),
      speed: s.cls === 'fighter' ? 0.7 : (s.cls === 'corvette' ? 0.6 : 0.35 + Math.random() * 0.15)
    });
  }
  return squad;
}

function startWave() {
  const btn = document.getElementById('startBtn');
  if (btn) btn.style.display = 'none';
  gameActive = true;
  killsThisWave = 0;
  // 随机抽取两个势力（Python：pick_factions；卫戍协议：进攻方随机两组）
  let f1, f2;
  const picks = py('pick_factions', ENEMY_FACTIONS.length);
  if (Array.isArray(picks) && picks.length >= 2) {
    f1 = ENEMY_FACTIONS[picks[0]];
    f2 = ENEMY_FACTIONS[picks[1]];
  } else {
    f1 = ENEMY_FACTIONS[Math.floor(Math.random() * ENEMY_FACTIONS.length)];
    f2 = ENEMY_FACTIONS[Math.floor(Math.random() * ENEMY_FACTIONS.length)];
    while (f2 === f1) f2 = ENEMY_FACTIONS[Math.floor(Math.random() * ENEMY_FACTIONS.length)];
  }
  const groups = [createEnemySquad(f1, wave), createEnemySquad(f2, wave)];
  let spawned = 0;
  const total = groups.reduce((a, b) => a + b.length, 0);
  if (spawnInterval) clearInterval(spawnInterval);
  spawnInterval = setInterval(() => {
    if (!gameActive) { clearInterval(spawnInterval); spawnInterval = null; return; }
    if (spawned < total) {
      // 随机从两个势力组中取敌（交替混合进攻）
      const nonEmpty = groups.map((gr, i) => ({ gr, i })).filter(x => x.gr.length > 0);
      if (nonEmpty.length) {
        const pick = nonEmpty[Math.floor(Math.random() * nonEmpty.length)];
        enemies.push(pick.gr.shift());
        spawned++;
      }
    } else {
      clearInterval(spawnInterval);
      spawnInterval = null;
      checkWaveEnd();
    }
  }, 700);
  flashTip('👾 敌军来袭：' + f1.icon + ' ' + f1.name + ' + ' + f2.icon + ' ' + f2.name);
}

function moveEnemies() {
  // 纵向战场：敌方空域（上）→ 交战区 → 我方空域（下），到达底部=漏怪
  for (const en of enemies) en.row += en.speed * 0.016;
  enemies = enemies.filter(en => {
    if (en.row >= GRID_ROWS) {
      // 我方防空拦截判定（参照武器计算：拦截率累乘，防空塔提供拦截）
      const aaCount = Object.values(towers).filter(t => t.weapon === 'air').length;
      if (aaCount > 0) {
        const rates = Array(aaCount).fill(0.08);
        const ir = py('intercept_rate', rates, 0);
        const intRate = (ir !== null && ir !== undefined) ? ir : (1 - Math.pow(1 - 0.08, aaCount));
        if (Math.random() < intRate) {
          g.killsThisWave = (g.killsThisWave || 0) + 1;
          flashTip('🛡️ 防空拦截！');
          return false;
        }
      }
      g.life--;
      updateLife();
      if (g.life <= 0) gameOver();
      return false;
    }
    return true;
  });
}
function checkWaveEnd() {
  const t = setInterval(() => {
    if (!gameActive) { clearInterval(t); return; }
    if (!enemies.length && !spawnInterval) {
      clearInterval(t);
      gameActive = false;
      wave++;
      updateWave();
      // 卫戍协议回合资金（Python：next_round_funds；入门：1→5、2→13、之后10）
      const pf = py('next_round_funds', wave);
      const nextFunds = (pf !== null && pf !== undefined) ? pf : (wave === 1 ? 5 : (wave === 2 ? 13 : 10));
      g.funds += nextFunds;
      updateFunds();
      refreshPool();
      // 回合强化：第3/6/10/12/14回合（Python：upgrade_wave_active）
      const uw = py('upgrade_wave_active', wave);
      const isUpgradeWave = (uw !== null && uw !== undefined) ? !!uw : [3, 6, 10, 12, 14].includes(wave);
      if (isUpgradeWave) showUpgrade();
      else {
        const btn = document.getElementById('startBtn');
        if (btn) { btn.style.display = 'block'; btn.innerHTML = '⚔ 开始作战（回合 ' + wave + '）'; }
      }
    }
  }, 500);
}

function showUpgrade() {
  // Python：roll_upgrades（回合强化三选一）
  const r = py('roll_upgrades', UPGRADE_POOL);
  const opts = (Array.isArray(r) && r.length) ? r
    : [...UPGRADE_POOL].sort(() => Math.random() - 0.5).slice(0, 3);
  const c = document.getElementById('upgradeOptions');
  if (!c) return;
  c.innerHTML = `
    <div style="font-size:0.75rem;color:#88ccff;margin-bottom:10px;text-align:center;">🏛️ 第 ${wave} 回合 · 回合强化（三选一）</div>
    <div class="ws-upg">
      ${opts.map((o, i) => `
        <div class="ws-upg-card" onclick="selectUpgrade(${i})">
          <span class="ws-upg-icon">${o.icon || '✨'}</span>
          <div class="ws-upg-body">
            <div class="ws-upg-name">${o.name}</div>
            <div class="ws-upg-desc">${o.desc || ''}</div>
          </div>
          <span class="ws-upg-idx">${i + 1}</span>
        </div>
      `).join('')}
    </div>
  `;
  document.getElementById('upgradeModal').style.display = 'flex';
  window.tempUpgrades = opts;
}

window.selectUpgrade = function(i) {
  if (window.tempUpgrades && window.tempUpgrades[i]) {
    const opt = window.tempUpgrades[i];
    opt.effect(g);
    if (g.freeShip) {
      g.freeShip = false;
      const list = shipPool.length ? shipPool : SHIP_BLUEPRINTS;
      const bp = list[Math.floor(Math.random() * list.length)];
      selectedBlueprint = bp;
      flashTip('🎁 免费舰船：' + bp.name + '，点击网格部署');
    }
  }
  document.getElementById('upgradeModal').style.display = 'none';
  // 强化后可立即部署免费舰船
  const btn = document.getElementById('startBtn');
  if (btn) btn.style.display = 'block';
  updateFunds();
};

function gameOver() {
  gameActive = false;
  if (spawnInterval) clearInterval(spawnInterval);
  if (gameLoopInterval) clearInterval(gameLoopInterval);
  if (fundsTimer) clearInterval(fundsTimer);
  const fw = document.getElementById('finalWaves');
  if (fw) fw.textContent = wave - 1;
  const ov = document.getElementById('gameOver');
  if (ov) {
    ov.style.display = 'block';
    const stat = ov.querySelector('.final-stats');
    if (stat) stat.innerHTML = `击毁敌舰：${totalKills} ｜ 波次：${wave - 1} ｜ 策略：${strat ? strat.name : '-'}`;
  }
}

function restartGame() {
  grid = Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(0));
  towers = {};
  enemies = [];
  wave = 1;
  killsThisWave = 0;
  totalKills = 0;
  spentFunds = 0;
  window._gachaCount = 0;
  window._pendingFree = null;
  g = { dmgMul: 1, rateMul: 1, armorBonus: 0, rangeBonus: 0, directMul: 1, projMul: 1, airMul: 1, life: 10, funds: 5, freeShip: false };
  gameActive = false;
  selectedBlueprint = null;
  shipPool = [];
  if (spawnInterval) clearInterval(spawnInterval);
  if (gameLoopInterval) clearInterval(gameLoopInterval);
  if (fundsTimer) clearInterval(fundsTimer);
  spawnInterval = gameLoopInterval = fundsTimer = null;
  const ov = document.getElementById('gameOver');
  if (ov) ov.style.display = 'none';
  const btn = document.getElementById('startBtn');
  if (btn) btn.style.display = 'block';
  updateFunds(); updateLife(); updateWave(); renderGrid(); renderEnemies(); renderPool(); renderTowerBar();
}

// ============================================================
//  7. 开局：策略选择 → 主战场
// ============================================================

function renderStrategySelect() {
  const container = document.getElementById('miniGameContainer');
  if (!container) return;
  container.innerHTML = `
    <div class="ws-topbar">
      <span class="ws-title">🏛️ 卫戍协议 · 战前准备</span>
      <span class="ws-engine">📜 选择防守策略（选定后无法更改）</span>
    </div>
    <div class="ws-strat-grid">
      ${DEFENSE_STRATEGIES.map((s, i) => `
        <div class="ws-strat-card" onclick="window._pickStrategy(${i})">
          <span class="ws-strat-life">❤️ ${s.life}</span>
          <div>
            <span class="ws-strat-icon">${s.icon}</span>
            <span class="ws-strat-name">${s.name}</span>
            <span class="ws-strat-hero">${s.hero}</span>
          </div>
          <div class="ws-strat-desc">${s.desc}</div>
        </div>
      `).join('')}
    </div>
    <div class="ws-meta">⚔️ 参照明日方舟·卫戍协议 ｜ 战斗机制参照拉格朗日战斗系统</div>
    <div class="wiki-note" style="margin-top:10px;">
      <div style="color:#88ccff;font-weight:700;margin-bottom:4px;">📖 战斗系统说明（拉格朗日）</div>
      <div style="font-size:0.72rem;line-height:1.7;color:#7a8b9a;">
        ⚔️ 直射武器：前排→中排→后排锁定，前排存在时无法锁定后排<br>
        🚀 投射武器：按锁定序列打击（航空母舰→战列巡洋舰→巡洋舰→驱逐舰→护卫舰）<br>
        🛡️ 实弹伤害受装甲抵抗；⚡ 能量伤害先消耗护盾，破盾后全额生效<br>
        🛩️ 防空武器优先拦截后排战机/护航艇
      </div>
    </div>
  `;
}

window._pickStrategy = function(idx) {
  const s = DEFENSE_STRATEGIES[idx];
  strat = s.id;
  g.life = s.life;
  s.effect();
  g.funds = 5;
  updateLife();
  buildBattlefield();
  flashTip('✅ 已选择策略：' + s.icon + ' ' + s.name);
};

function buildBattlefield() {
  grid = Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(0));
  towers = {};
  enemies = [];
  wave = 1;
  selectedBlueprint = null;
  gameActive = false;
  refreshPool();

  const container = document.getElementById('miniGameContainer');
  if (!container) return;
  const stratName = strat ? (DEFENSE_STRATEGIES.find(s => s.id === strat) || {}).name : '';
  container.innerHTML = `
    <div class="ws-topbar">
      <span class="ws-title">🛡️ 卫戍协议 · ${stratName}</span>
      <span class="ws-stat life">❤️ <b id="lifeDisplay">${g.life}</b></span>
      <span class="ws-stat">💰 <b id="fundsDisplay">${g.funds}</b></span>
      <span class="ws-stat wave">🌊 <b id="waveDisplay">${wave}</b></span>
      <span class="ws-engine" id="engineTag">⚙️ 计算引擎加载中…</span>
      <span id="gameTip" class="ws-engine"></span>
    </div>
    <div class="ws-layout">
      <div class="ws-field">
        <div class="ws-zonebar">
          <span class="ws-zone enemy">👾 敌方空域</span>
          <span class="ws-zone battle">⚔️ 交战区</span>
          <span class="ws-zone ally">🛡️ 我方空域</span>
        </div>
        <div class="ws-grid-wrap"><span class="ws-grid-tag top">敌方空域</span>        <div class="ws-grid" id="grid"></div>
        </div><span class="ws-grid-tag mid">交战区</span><span class="ws-grid-tag bottom">我方空域</span>
        <div class="ws-meta">💡 点击补给池舰船 → 点击下方两行（我方空域）部署 · 敌人从敌方空域向下进攻</div>
      </div>
      <div class="ws-side">
        <div class="ws-pool-title">📦 补给池（等级 ${Math.min(6, Math.floor(wave / 2) + 1)}）</div>
        <div class="ws-pool" id="poolBar"></div>
        <div class="ws-dock" id="towerBar"><span class="ws-dock-title">🛰️ 已部署舰船</span></div>
        <button class="ws-start" id="startBtn">⚔ 开始作战 · 回合 ${wave}</button>
        <div class="ws-meta">参照卫戍协议：第1回合5资金 · 第2回合13 · 之后每回合10</div>
      </div>
    </div>
    <div class="game-over" id="gameOver">
      <h2>💀 防线失守</h2>
      <p>你坚持了 <span id="finalWaves">0</span> 回合</p>
      <div class="final-stats" style="font-size:0.8rem;color:#6a8a9e;margin:8px 0;"></div>
      <button class="btn-restart" onclick="restartGame()">🔄 重新部署</button>
    </div>
  `;
  renderGrid(); renderPool(); renderTowerBar(); updateFunds(); updateLife(); updateWave();
  const btn = document.getElementById('startBtn');
  if (btn) btn.addEventListener('click', () => {
    if (gameActive) return;
    startWave();
    if (gameLoopInterval) clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(gameLoop, 50);
  });
}
function buildSoloGame() {
  // 确保 Python 引擎已启动（异步，未就绪时自动用 JS 引擎，就绪后无缝切换）
  initPyEngine();
  renderStrategySelect();
  openModal('🛡️ 卫戍协议 · 独立模拟', '<div id="miniGameContainer"></div>');
}

// ============================================================
//  8. 游戏循环
// ============================================================
function gameLoop() {
  if (!gameActive) return;
  towersAttack(Date.now());
  moveEnemies();
  renderEnemies();
}

// ============================================================
//  9. 模态框（保留）
// ============================================================
const modal = document.getElementById('genericModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalCloseBtn');

function openModal(title, html) {
  modalTitle.textContent = title;
  modalBody.innerHTML = html;
  modal.style.display = 'flex';
  modal.classList.add('active');
}

function closeModal() {
  modal.style.display = 'none';
  modal.classList.remove('active');
  if (gameLoopInterval) clearInterval(gameLoopInterval);
  if (spawnInterval) clearInterval(spawnInterval);
  if (fundsTimer) clearInterval(fundsTimer);
  gameLoopInterval = spawnInterval = fundsTimer = null;
  gameActive = false;
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

document.getElementById('btnSolo').addEventListener('click', buildSoloGame);

// ============================================================
//  10. 物资调配 / 邀约 / 同盟（保留，适配新状态）
// ============================================================
window.exchangeEnergyToPoints = function() {
  if (g.funds < 3) { alert('💰 资金不足！'); return; }
  g.funds -= 3;
  updateFunds();
  if (typeof window.ioaGlobalPoints === 'undefined') window.ioaGlobalPoints = 0;
  window.ioaGlobalPoints += 2;
  alert('✅ 兑换成功！获得 2 点强化点数（全局通用）。');
};

document.getElementById('btnSupply').addEventListener('click', () => {
  const alloc = { attack: 0, defense: 0, speed: 0 };
  const renderSupply = () => {
    openModal('📦 物资调配处', `
      <p style="margin-bottom:6px;">当前资金：<strong style="color:#ff8c2e;">${Math.floor(g.funds)}</strong> 💰</p>
      <p style="font-size:0.85rem;color:#6a8a9e;margin-bottom:12px;">调配资源获得临时增益（持续本回合）</p>
      <div class="item-list">
        <div class="item-row"><span class="left"><span class="ico">⚔️</span> 攻击强化</span><span><button class="action-btn" onclick="allocSupply('attack',10)">+10 💰</button></span></div>
        <div class="item-row"><span class="left"><span class="ico">🛡️</span> 装甲强化</span><span><button class="action-btn" onclick="allocSupply('defense',10)">+10 💰</button></span></div>
        <div class="item-row"><span class="left"><span class="ico">💨</span> 攻速强化</span><span><button class="action-btn" onclick="allocSupply('speed',10)">+10 💰</button></span></div>
        <div class="item-row"><span class="left"><span class="ico">💰➜🔧</span> 资金兑换升级点</span><span><button class="action-btn" onclick="window.exchangeEnergyToPoints()">3资金 → 2升级点</button></span></div>
      </div>
      <div style="font-size:0.75rem;color:#4a6a7e;margin-top:8px;border-top:1px solid #1a222b;padding-top:10px;">
        📊 当前调配：攻击 +${alloc.attack} ｜ 装甲 +${alloc.defense} ｜ 攻速 +${alloc.speed} ｜ 全局强化点数：${window.ioaGlobalPoints || 0}
      </div>
    `);
    window._allocData = alloc;
  };
  window.allocSupply = function(type, cost) {
    if (g.funds < cost) { alert('💰 资金不足！'); return; }
    g.funds -= cost;
    updateFunds();
    const data = window._allocData || { attack: 0, defense: 0, speed: 0 };
    data[type] += 1;
    window._allocData = data;
    if (type === 'attack') g.dmgMul *= 1.1;
    else if (type === 'defense') { g.armorBonus += 2; }
    else if (type === 'speed') g.rateMul *= 1.08;
    renderSupply();
  };
  renderSupply();
});

const welcomeHTML = `
  <div class="welcome" id="welcomeContent">
    <span class="big-icon">🚀</span>
    <h2>卫戍协议</h2>
    <p>星河防线 · 拉格朗日战斗系统</p>
    <div class="hint">🛡️ 点击「独立模拟」：选择防守策略 → 部署舰船 → 抵御敌方舰队</div>
  </div>
`;

window.resetToWelcome = function() {
  document.getElementById('leftPanel').innerHTML = welcomeHTML;
  document.getElementById('leftPanel').dataset.mode = 'welcome';
  if (window._bpInterval) { clearInterval(window._bpInterval); window._bpInterval = null; }
  if (window._ioaInterval) { clearInterval(window._ioaInterval); window._ioaInterval = null; }
};

// ============================================================
//  11. 蓝图数据库（保留，展示 SHIPS_DATA 全量科技）
// ============================================================
document.getElementById('btnBlueprint').addEventListener('click', async function() {
  const leftPanel = document.getElementById('leftPanel');
  if (leftPanel.dataset.mode === 'ioa') window.resetToWelcome();
  if (leftPanel.dataset.mode === 'blueprint') { window.resetToWelcome(); return; }

  await ensureShipsData();

  const shipsData = window.SHIPS_DATA || {};
  const shipNames = Object.keys(shipsData);
  let currentShipId = shipNames[0] || '';
  const typeOrder = ['战列巡洋舰', '航空母舰', '巡洋舰', '驱逐舰', '护卫舰', '护航艇', '战机', '支援舰'];

  function getIcon(type) {
    const icons = { '航空母舰': '✈️', '战列巡洋舰': '⚓', '巡洋舰': '🛳️', '驱逐舰': '🚢', '护卫舰': '⛵', '护航艇': '🚁', '战机': '🛩️', '支援舰': '🚑' };
    return icons[type] || '🚀';
  }

  function renderShipList() {
    if (shipNames.length === 0) return '<div style="color:#6a8a9e;padding:12px;">暂无舰船数据</div>';
    const grouped = {};
    shipNames.forEach(name => {
      const type = shipsData[name].type || '未知';
      if (!grouped[type]) grouped[type] = [];
      grouped[type].push(name);
    });
    let html = '';
    typeOrder.forEach(type => {
      if (!grouped[type] || grouped[type].length === 0) return;
      html += `<div style="padding:4px 10px;color:#ff8c2e;font-size:0.75rem;font-weight:700;border-bottom:1px solid #1a222b;background:rgba(255,140,46,0.06);">${type}</div>`;
      grouped[type].forEach(name => {
        const ship = shipsData[name];
        const active = name === currentShipId ? 'active' : '';
        html += `<div class="bp-ship-item ${active}" data-ship="${name}">
          <span>${getIcon(ship.type)} ${ship.model ? ship.name + '·' + ship.model : name}</span>
          <span class="level-badge">${ship.company || ''}</span>
        </div>`;
      });
    });
    return html;
  }

  function renderShipDetail(shipId) {
    if (!shipId || !shipsData[shipId]) return '<div style="color:#6a8a9e;">请选择一艘舰船</div>';
    const ship = shipsData[shipId];
    let techCount = 0, weaponCount = 0, effectCount = 0;
    (ship.systems || []).forEach(sys => {
      techCount += (sys.techs || []).length;
      weaponCount += (sys.weapons || []).length;
      (sys.techs || []).forEach(t => { effectCount += (t.effects || []).length; });
    });
    let html = `<div class="ship-name">${getIcon(ship.type)} ${ship.name}${ship.model ? ' <span style="color:#00c8ff;font-size:0.85em;">· ' + ship.model + '</span>' : ''}</div>`;
    html += `<div class="ship-desc">${ship.type || '未知'} · ${ship.company || '未知'} · ${(ship.systems || []).length} 个系统</div>`;
    html += `<div class="ship-stats">
      <span>🛡️ ${ship.type || '未知'}</span>
      <span>🏢 ${ship.company || '未知'}</span>
      <span>🧩 ${(ship.systems || []).length} 系统</span>
      <span>⚡ ${techCount} 科技</span>
      <span>🔫 ${weaponCount} 武器</span>
      <span>✨ ${effectCount} 效果</span>
    </div>`;
    if (!ship.systems || ship.systems.length === 0) {
      html += `<div style="color:#6a8a9e;margin-top:12px;font-size:0.85rem;">📡 该舰船暂无科技数据</div>`;
    } else {
      html += `<div style="margin-top:8px;font-size:0.85rem;">`;
      ship.systems.forEach(sys => {
        html += `<div style="color:#ffaa44;font-weight:700;margin-top:10px;border-bottom:1px solid #1f2a33;padding-bottom:4px;">▸ ${sys.name}</div>`;
        if (sys.techs) {
          sys.techs.forEach(tech => {
            let fx = '';
            if (tech.effects && tech.effects.length) {
              fx = tech.effects.slice(0, 4).map(e => {
                const v = (typeof e.value === 'number') ? e.value : e.value;
                return '<span style="display:inline-block;margin:3px 4px 0 0;padding:1px 7px;font-size:0.68rem;border:1px solid #1f4a3a;background:rgba(68,204,136,0.08);color:#44cc88;">' + e.type + (e.action ? ' +' + v : '') + (e.weapon ? ' · ' + e.weapon : '') + '</span>';
              }).join('');
            }
            html += `<div style="margin:6px 0;padding-left:10px;border-left:2px solid #1f2a33;">
              <span style="color:#b0c7d6;font-weight:600;">${tech.name}</span>
              <span style="color:#6a8a9e;font-size:0.75rem;display:block;margin-top:2px;">${tech.desc || ''}</span>
              ${fx ? '<span style="display:block;margin-top:3px;">' + fx + '</span>' : ''}
              <span style="color:#88ccff;font-size:0.7rem;">最高等级 ${tech.max || 5} · ${tech.points || 5} 科技点/级</span>
            </div>`;
          });
        }
        if (sys.weapons) {
          sys.weapons.forEach(w => {
            html += `<div style="margin:4px 0;padding-left:10px;font-size:0.75rem;color:#44cc88;">🔫 ${w.name}</div>`;
          });
        }
      });
      html += `</div>`;
    }
    return html;
  }

  leftPanel.innerHTML = `
    <div class="bp-panel">
      <div class="bp-header">
        <span class="bp-title">📐 蓝图数据库</span>
        <button class="bp-back" id="bpBackBtn">← 返回</button>
      </div>
      <div class="bp-tab-bar">
        <button class="bp-tab-btn active" data-tab="blueprint">🚢 舰船科技</button>
        <button class="bp-tab-btn" data-tab="alliance">🤝 盟约报告</button>
        <button class="bp-tab-btn" data-tab="enemy">👾 敌方资料</button>
      </div>
      <div class="bp-tab-content active" id="bpTabBlueprint">
        <div class="bp-main">
          <div class="bp-ship-list" id="shipList">${renderShipList()}</div>
          <div class="bp-detail-card" id="shipDetail">${renderShipDetail(currentShipId)}</div>
        </div>
      </div>
      <div class="bp-tab-content" id="bpTabAlliance">
        <div class="bp-alliance">
          <p style="color:#b0c7d6;margin-bottom:8px;">🤝 当前盟约状态</p>
          <div class="ally-item"><span>⚔️ 铁血同盟</span><span class="status-ok">已结盟</span><span class="bonus">攻击 +6</span></div>
          <div class="ally-item"><span>🛸 星云联邦</span><span class="status-ok">已结盟</span><span class="bonus">资金 +5</span></div>
          <div class="ally-item"><span>🌌 暗影议会</span><span class="status-pending">待邀请</span><span class="bonus">攻速 +10%</span></div>
        </div>
      </div>
      <div class="bp-tab-content" id="bpTabEnemy">
        <div class="bp-enemy">
          <p style="color:#b0c7d6;margin-bottom:8px;">👾 敌方势力图鉴（拉格朗日）</p>
          ${ENEMY_FACTIONS.map(f => `
            <div class="enemy-faction">
              <div style="color:#ffaa44;font-weight:700;">${f.icon} ${f.name}</div>
              <div style="font-size:0.72rem;color:#6a8a9e;">${f.desc}</div>
              <div style="font-size:0.7rem;color:#88ccff;">${f.squads.map(s => CLS_ICONS[s.cls] + CLS_NAMES[s.cls] + '(' + ZONE_NAMES[s.zone] + ')').join(' ')}</div>
            </div>
          `).join('')}
          <div style="font-size:0.75rem;color:#4a6a7e;margin-top:8px;">* 每次作战随机抽选两组势力进攻</div>
        </div>
      </div>
    </div>
  `;
  leftPanel.dataset.mode = 'blueprint';

  document.getElementById('bpBackBtn').addEventListener('click', () => window.resetToWelcome());

  document.querySelectorAll('.bp-tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.bp-tab-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const tab = this.dataset.tab;
      document.querySelectorAll('.bp-tab-content').forEach(tc => tc.classList.remove('active'));
      const target = document.getElementById('bpTab' + tab.charAt(0).toUpperCase() + tab.slice(1));
      if (target) target.classList.add('active');
    });
  });

  document.querySelectorAll('.bp-ship-item').forEach(item => {
    item.addEventListener('click', function() {
      currentShipId = this.dataset.ship;
      document.querySelectorAll('.bp-ship-item').forEach(i => i.classList.remove('active'));
      this.classList.add('active');
      const detailEl = document.getElementById('shipDetail');
      if (detailEl) detailEl.innerHTML = renderShipDetail(currentShipId);
    });
  });
});

// ---- 模拟邀约（保留） ----
document.getElementById('btnInvite').addEventListener('click', () => {
  const factions = [
    { name: '⚔️ 铁血同盟', desc: '军事支援 · 攻击 +8', available: true },
    { name: '🛸 星云联邦', desc: '科技支援 · 资金 +10', available: true },
    { name: '🌌 暗影议会', desc: '情报支援 · 攻速 +15%', available: false },
    { name: '🔱 深海帝国', desc: '后勤支援 · 生命 +3', available: true },
  ];
  let html = `<p style="font-size:0.85rem;color:#6a8a9e;">向星系势力发出邀约，获得支援</p><div class="item-list">`;
  factions.forEach((f, i) => {
    const status = f.available ? `<button class="action-btn" onclick="inviteFaction(${i})">邀约</button>` : `<span style="color:#6a4a4a;">⏳ 冷却中</span>`;
    html += `
      <div class="item-row">
        <span class="left"><span class="ico">${f.name.split(' ')[0]}</span> ${f.name}</span>
        <span style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:0.7rem;color:#6a8a9e;">${f.desc}</span>
          ${status}
        </span>
      </div>
    `;
  });
  html += `</div><div style="font-size:0.7rem;color:#4a6a7e;margin-top:6px;">🤝 邀约成功可立即获得增益</div>`;
  openModal('🤝 模拟邀约', html);

  window.inviteFaction = function(idx) {
    const rewards = [
      () => { g.dmgMul *= 1.08; flashTip('⚔️ 铁血同盟响应！攻击 +8%'); },
      () => { g.funds += 10; updateFunds(); flashTip('🛸 星云联邦支援！资金 +10'); },
      () => { flashTip('🌌 暗影议会暂未回应...'); },
      () => { g.life = Math.min(g.life + 3, 40); updateLife(); flashTip('🔱 深海帝国支援！生命 +3'); },
    ];
    if (rewards[idx]) rewards[idx]();
    document.getElementById('btnInvite').click();
  };
});

// ---- 同盟模拟（保留） ----
document.getElementById('btnAlliance').addEventListener('click', () => {
  const allies = [
    { name: '⚔️ 铁血同盟', status: '已结盟', bonus: '攻击 +8%' },
    { name: '🛸 星云联邦', status: '已结盟', bonus: '资金 +10' },
    { name: '🌌 暗影议会', status: '待邀请', bonus: '攻速 +10%' },
  ];
  let html = `
    <p style="font-size:0.9rem;color:#b0c7d6;">⚔️ <strong>同盟模拟</strong> — 联合作战</p>
    <div style="background:#0f171f;border-radius:8px;padding:12px;margin:10px 0;border:1px solid #1a222b;">
      <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:#4a6a7e;padding-bottom:6px;border-bottom:1px solid #1a222b;">
        <span>同盟势力</span><span>状态</span><span>增益</span>
      </div>
  `;
  allies.forEach(a => {
    const statusColor = a.status === '已结盟' ? '#44cc88' : '#ff8844';
    html += `
      <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #0d141c;font-size:0.85rem;">
        <span>${a.name}</span>
        <span style="color:${statusColor};">${a.status}</span>
        <span style="color:#88ccff;">${a.bonus}</span>
      </div>
    `;
  });
  html += `
    </div>
    <p style="font-size:0.8rem;color:#4a6a7e;">🤝 同盟状态下，共享部分增益效果。</p>
    <div style="display:flex;gap:8px;margin-top:10px;">
      <button class="action-btn" style="flex:1;padding:8px;" onclick="alert('🌌 向暗影议会发出同盟邀请...')">邀请暗影议会</button>
      <button class="action-btn secondary" style="flex:1;padding:8px;" onclick="closeModal()">关闭</button>
    </div>
  `;
  openModal('⚔️ 同盟模拟', html);
});

// ============================================================
//  12. 初始化与全局暴露
// ============================================================
console.log('🚀 卫戍协议 · 拉格朗日战斗版 已加载');
window.restartGame = restartGame;
window.openModal = openModal;
window.closeModal = closeModal;
window.ensureShipsData = ensureShipsData;
window.exchangeEnergyToPoints = window.exchangeEnergyToPoints;
