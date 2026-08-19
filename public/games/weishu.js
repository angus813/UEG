// ============================================================
//  0. Supabase 客户端接入（需先加载 supabase 库 + supabase-client.js）
//     使用 `<script src="supabase-client.js"></script>` 暴露全局 `supabase`
// ============================================================

let supabaseClient = null;
try {
  if (typeof supabase !== 'undefined' && typeof supabase.from === 'function') {
    // supabase 已经是客户端实例
    supabaseClient = supabase;
    console.log('✅ Supabase 客户端已接入');
  } else if (typeof supabase !== 'undefined' && typeof supabase.createClient === 'function') {
    // supabase 是库对象，需要手动创建客户端
    supabaseClient = supabase.createClient(
      'https://ruwjkbscaotnyhmduviz.supabase.co',
      'sb_publishable_pfDTII6yQ_Behq9Y6wYkHw_UbLW0z7m'
    );
    console.log('✅ Supabase 客户端已创建');
  }
} catch (e) {
  console.warn('⚠️ Supabase 客户端初始化失败，使用本地数据', e);
}

/**
 * 从 Supabase 加载舰船数据到 window.SHIPS_DATA
 * 表名：ships_data，id = 'all'
 * 字段：data（JSON 字符串或对象）
 */
async function ensureShipsData() {
  if (window.SHIPS_DATA && Object.keys(window.SHIPS_DATA).length > 0) return;
  if (!supabaseClient) return;

  try {
    const { data, error } = await supabaseClient
      .from('ships_data')
      .select('data')
      .eq('id', 'all')
      .single();

    if (!error && data) {
      window.SHIPS_DATA = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
      console.log('✅ 已从 Supabase 加载舰船数据');
    }
  } catch (e) {
    console.warn('⚠️ 从 Supabase 加载舰船数据失败，使用本地 ships_data.js', e);
  }
}

// ============================================================
//  1. 游戏核心逻辑（完整塔防）
// ============================================================

const GRID_COLS = 5;
const GRID_ROWS = 6;
let grid = [];
let enemies = [];
let energy = 100;
let life = 10;
let wave = 1;
let gameActive = false;
let selectedTower = null;
let spawnInterval = null;
let gameLoopInterval = null;
let energyRegen = 2;
let globalDamageBonus = 0;
let globalAttackSpeed = 1;

const towerStats = {
  guard: { name: '护卫舰', damage: 10, range: 1.5, fireRate: 1.0, cost: 20 },
  destroyer: { name: '驱逐舰', damage: 18, range: 2.5, fireRate: 1.2, cost: 35 },
  cruiser: { name: '巡洋舰', damage: 30, range: 3.0, fireRate: 0.8, cost: 50 },
  battleship: { name: '战列舰', damage: 55, range: 4.0, fireRate: 0.5, cost: 80 }
};

function createEnemy(w) {
  return {
    hp: 50 + w * 20,
    maxHp: 50 + w * 20,
    speed: 0.6 + w * 0.05,
    armor: Math.floor(w / 3) * 2,
    row: Math.floor(Math.random() * GRID_ROWS),
    col: -0.5,
    reward: 15 + w * 2
  };
}

function renderGrid() {
  const gridEl = document.getElementById('grid');
  if (!gridEl) return;
  gridEl.innerHTML = '';
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener('click', () => placeTower(r, c));
      if (grid[r][c]) {
        const icons = { guard: '⚓', destroyer: '🚢', cruiser: '🛳️', battleship: '🚢✨' };
        cell.innerHTML = '<div class="tower">' + (icons[grid[r][c].type] || '⚙️') + '</div>';
      }
      gridEl.appendChild(cell);
    }
  }
}

function renderEnemies() {
  const c = document.getElementById('grid');
  if (!c) return;
  c.querySelectorAll('.enemy').forEach(e => e.remove());
  const cells = c.querySelectorAll('.cell');
  enemies.forEach(en => {
    const r = Math.floor(en.row), col = Math.floor(en.col);
    if (r >= 0 && r < GRID_ROWS && col >= 0 && col < GRID_COLS && cells[r * GRID_COLS + col]) {
      const el = document.createElement('div');
      el.className = 'enemy';
      const pct = Math.max(18, (en.hp / en.maxHp) * 90);
      el.style.width = pct + '%';
      el.style.height = pct + '%';
      el.innerHTML = Math.ceil(en.hp);
      cells[r * GRID_COLS + col].appendChild(el);
    }
  });
}

function placeTower(r, c) {
  if (!gameActive || !selectedTower || grid[r][c]) return;
  const s = towerStats[selectedTower];
  if (energy < s.cost) return;
  energy -= s.cost;
  grid[r][c] = {
    type: selectedTower,
    lastFireTime: 0,
    damage: s.damage + globalDamageBonus,
    fireRate: s.fireRate * globalAttackSpeed,
    range: s.range
  };
  updateEnergy();
  renderGrid();
}

function updateEnergy() {
  const el = document.getElementById('energyDisplay');
  if (el) el.textContent = Math.floor(energy);
}
function updateLife() {
  const el = document.getElementById('lifeDisplay');
  if (el) el.textContent = life;
}
function updateWave() {
  const el = document.getElementById('waveDisplay');
  if (el) el.textContent = wave;
}

function towersAttack(now) {
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const t = grid[r][c];
      if (!t || now - t.lastFireTime < 1000 / t.fireRate) continue;
      let target = null;
      for (const en of enemies) {
        if (en.col > GRID_COLS) continue;
        const dist = Math.sqrt(Math.pow(en.row - r, 2) + Math.pow(en.col - c, 2));
        if (dist <= t.range && (!target || en.col > target.col)) target = en;
      }
      if (target) {
        t.lastFireTime = now;
        let dmg = t.damage - target.armor;
        if (dmg < 1) dmg = 1;
        target.hp -= dmg;
        if (target.hp <= 0) {
          const i = enemies.indexOf(target);
          if (i > -1) { enemies.splice(i, 1); energy += target.reward; updateEnergy(); }
        }
      }
    }
  }
}

function moveEnemies() {
  for (const en of enemies) en.col += en.speed * 0.016;
  enemies = enemies.filter(en => {
    if (en.col >= GRID_COLS) {
      life--;
      updateLife();
      if (life <= 0) gameOver();
      return false;
    }
    return true;
  });
}

function gameLoop() {
  if (!gameActive) return;
  towersAttack(Date.now());
  moveEnemies();
  renderEnemies();
  energy = Math.min(energy + energyRegen * 0.05, 200);
  updateEnergy();
}

function spawnEnemy() {
  if (gameActive) enemies.push(createEnemy(wave));
}

function startWave() {
  const btn = document.getElementById('startBtn');
  if (btn) btn.style.display = 'none';
  gameActive = true;
  const count = 3 + wave * 2;
  let spawned = 0;
  if (spawnInterval) clearInterval(spawnInterval);
  spawnInterval = setInterval(() => {
    if (spawned < count) { spawnEnemy(); spawned++; }
    else { clearInterval(spawnInterval); spawnInterval = null; checkWaveEnd(); }
  }, 800);
}

function checkWaveEnd() {
  const t = setInterval(() => {
    if (!gameActive) { clearInterval(t); return; }
    if (!enemies.length && !spawnInterval) {
      clearInterval(t);
      gameActive = false;
      showUpgrade();
    }
  }, 500);
}

function showUpgrade() {
  const ups = [
    { name: '⚡ 能量回复 +1', effect: () => energyRegen += 1 },
    { name: '🔫 全体攻击 +5', effect: () => globalDamageBonus += 5 },
    { name: '💨 攻速 +20%', effect: () => globalAttackSpeed *= 1.2 },
    { name: '❤️ 生命 +2', effect: () => { life = Math.min(life + 2, 20); updateLife(); } },
    { name: '⚡ 立即 +80 能量', effect: () => { energy = Math.min(energy + 80, 200); updateEnergy(); } }
  ];
  const opts = [...ups].sort(() => Math.random() - 0.5).slice(0, 3);
  const c = document.getElementById('upgradeOptions');
  if (!c) return;
  c.innerHTML = opts.map((o, i) => `<div class="upgrade-option" onclick="selectUpgrade(${i})">${o.name}</div>`).join('');
  document.getElementById('upgradeModal').style.display = 'flex';
  window.tempUpgrades = opts;
}

window.selectUpgrade = function(i) {
  if (window.tempUpgrades && window.tempUpgrades[i]) window.tempUpgrades[i].effect();
  document.getElementById('upgradeModal').style.display = 'none';
  wave++;
  updateWave();
  const btn = document.getElementById('startBtn');
  if (btn) btn.style.display = 'block';
};

function gameOver() {
  gameActive = false;
  if (spawnInterval) clearInterval(spawnInterval);
  if (gameLoopInterval) clearInterval(gameLoopInterval);
  const fw = document.getElementById('finalWaves');
  if (fw) fw.textContent = wave;
  const ov = document.getElementById('gameOver');
  if (ov) ov.style.display = 'block';
}

function restartGame() {
  grid = Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(null));
  enemies = [];
  energy = 100;
  life = 10;
  wave = 1;
  energyRegen = 2;
  globalDamageBonus = 0;
  globalAttackSpeed = 1;
  gameActive = false;
  selectedTower = null;
  if (spawnInterval) clearInterval(spawnInterval);
  if (gameLoopInterval) clearInterval(gameLoopInterval);
  spawnInterval = gameLoopInterval = null;
  const ov = document.getElementById('gameOver');
  if (ov) ov.style.display = 'none';
  const btn = document.getElementById('startBtn');
  if (btn) btn.style.display = 'block';
  updateEnergy(); updateLife(); updateWave(); renderGrid(); renderEnemies(); bindTowerCards();
}

function bindTowerCards() {
  document.querySelectorAll('#miniGameContainer .tower-card').forEach(card => {
    card.removeEventListener('click', towerCardClick);
    card.addEventListener('click', towerCardClick);
  });
}

function towerCardClick(e) {
  const card = e.currentTarget;
  document.querySelectorAll('#miniGameContainer .tower-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  selectedTower = card.dataset.type;
}

// ============================================================
//  2. 独立模拟弹窗
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
  gameLoopInterval = spawnInterval = null;
  gameActive = false;
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

function buildSoloGame() {
  grid = Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(null));
  enemies = [];
  energy = 100;
  life = 10;
  wave = 1;
  energyRegen = 2;
  globalDamageBonus = 0;
  globalAttackSpeed = 1;
  gameActive = false;
  selectedTower = null;
  if (spawnInterval) clearInterval(spawnInterval);
  if (gameLoopInterval) clearInterval(gameLoopInterval);
  spawnInterval = gameLoopInterval = null;

  const html = `
    <div id="miniGameContainer">
      <div class="mini-header">
        <div class="title">🛡️ 卫戍协议 · 独立模拟</div>
        <div class="mini-stats">
          <div class="stat"><span class="stat-icon">⚡</span><span id="energyDisplay">100</span></div>
          <div class="stat"><span class="stat-icon">❤️</span><span id="lifeDisplay">10</span></div>
          <div class="stat"><span class="stat-icon">🌊</span><span id="waveDisplay">1</span></div>
        </div>
      </div>
      <div class="grid-wrap"><div class="grid" id="grid"></div></div>
      <div class="btn-start-wrap"><button class="btn-start" id="startBtn">⚔ 开始作战</button></div>
      <div class="tower-bar" id="towerBar">
        ${['护卫舰|guard|⚓|20', '驱逐舰|destroyer|🚢|35', '巡洋舰|cruiser|🛳️|50', '战列舰|battleship|🚢✨|80'].map(x => {
          const [n, t, icon, cost] = x.split('|');
          return `<div class="tower-card" data-type="${t}" data-cost="${cost}">
            <div class="tower-icon">${icon}</div>
            <div class="tower-name">${n}</div>
            <div class="tower-cost">${cost}⚡</div>
          </div>`;
        }).join('')}
      </div>
      <div class="game-over" id="gameOver">
        <h2>💀 防线失守</h2>
        <p>你坚持了 <span id="finalWaves">0</span> 波</p>
        <button class="btn-restart" onclick="restartGame()">🔄 重新部署</button>
      </div>
    </div>
  `;

  openModal('🛡️ 独立模拟', html);
  renderGrid(); updateEnergy(); updateLife(); updateWave(); bindTowerCards();
  const btn = document.getElementById('startBtn');
  if (btn) btn.addEventListener('click', () => {
    if (gameActive) return;
    startWave();
    if (gameLoopInterval) clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(gameLoop, 50);
  });
  bindTowerCards();
}

document.getElementById('btnSolo').addEventListener('click', buildSoloGame);

// ============================================================
//  3. 物资调配、邀约、同盟模拟
// ============================================================

window.exchangeEnergyToPoints = function() {
  const cur = (typeof energy !== 'undefined') ? energy : (window.energy || 0);
  if (cur < 3) { alert('⚡ 能量不足！'); return; }
  if (typeof energy !== 'undefined') energy = cur - 3; else window.energy = cur - 3;
  if (typeof window.updateEnergy === 'function') window.updateEnergy();
  if (typeof window.ioaGlobalPoints === 'undefined') window.ioaGlobalPoints = 0;
  window.ioaGlobalPoints += 2;
  alert('✅ 兑换成功！获得 2 点强化点数（全局通用）。');
};

document.getElementById('btnSupply').addEventListener('click', () => {
  const alloc = { attack: 0, defense: 0, speed: 0 };
  const renderSupply = () => {
    openModal('📦 物资调配处', `
      <p style="margin-bottom:6px;">当前能量：<strong style="color:#ff8c2e;">${Math.floor(energy)}</strong> ⚡</p>
      <p style="font-size:0.85rem;color:#6a8a9e;margin-bottom:12px;">调配资源获得临时增益（持续本波）</p>
      <div class="item-list">
        <div class="item-row"><span class="left"><span class="ico">⚔️</span> 攻击强化</span><span><button class="action-btn" onclick="allocSupply('attack',10)">+10 ⚡</button></span></div>
        <div class="item-row"><span class="left"><span class="ico">🛡️</span> 防御强化</span><span><button class="action-btn" onclick="allocSupply('defense',10)">+10 ⚡</button></span></div>
        <div class="item-row"><span class="left"><span class="ico">💨</span> 移速强化</span><span><button class="action-btn" onclick="allocSupply('speed',10)">+10 ⚡</button></span></div>
        <div class="item-row"><span class="left"><span class="ico">⚡➜🔧</span> 能量兑换升级点</span><span><button class="action-btn" onclick="window.exchangeEnergyToPoints()">3能量 → 2升级点</button></span></div>
      </div>
      <div style="font-size:0.75rem;color:#4a6a7e;margin-top:8px;border-top:1px solid #1a222b;padding-top:10px;">
        ⚡ 当前调配：攻击 +${alloc.attack} ｜ 防御 +${alloc.defense} ｜ 速度 +${alloc.speed} ｜ 全局强化点数：${window.ioaGlobalPoints || 0}
      </div>
    `);
    window._allocData = alloc;
  };
  window.allocSupply = function(type, cost) {
    if (energy < cost) { alert('⚡ 能量不足！'); return; }
    energy -= cost;
    updateEnergy();
    const data = window._allocData || { attack: 0, defense: 0, speed: 0 };
    data[type] += 1;
    window._allocData = data;
    if (type === 'attack') globalDamageBonus += 2;
    else if (type === 'defense') { life = Math.min(life + 1, 20); updateLife(); }
    else if (type === 'speed') globalAttackSpeed *= 1.05;
    renderSupply();
  };
  renderSupply();
});

const welcomeHTML = `
  <div class="welcome" id="welcomeContent">
    <span class="big-icon">🚀</span>
    <h2>卫戍协议</h2>
    <p>星河防线 · 塔防战略</p>
    <div class="hint">🛡️ 点击「独立模拟」开始作战</div>
  </div>
`;

window.resetToWelcome = function() {
  document.getElementById('leftPanel').innerHTML = welcomeHTML;
  document.getElementById('leftPanel').dataset.mode = 'welcome';
  if (window._bpInterval) { clearInterval(window._bpInterval); window._bpInterval = null; }
  if (window._ioaInterval) { clearInterval(window._ioaInterval); window._ioaInterval = null; }
};

// ============================================================
//  4. 蓝图数据库（Supabase 优先 + 本地回退）
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
    if (shipNames.length === 0) return '<div style="color:#6a8a9e;padding:12px;">暂无舰船数据，请运行 parse_excel.py 生成 ships_data.js 或配置 Supabase</div>';
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
    let html = `<div class="ship-name">${getIcon(ship.type)} ${ship.name}${ship.model ? ' <span style="color:#00c8ff;font-size:0.85em;">· ' + ship.model + '</span>' : ''}</div>`;
    html += `<div class="ship-desc">${ship.type || '未知'} · ${ship.company || '未知'} · ${(ship.systems || []).length} 个系统</div>`;
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
          <div class="ally-item"><span>🛸 星云联邦</span><span class="status-ok">已结盟</span><span class="bonus">能量 +30</span></div>
          <div class="ally-item"><span>🌌 暗影议会</span><span class="status-pending">待邀请</span><span class="bonus">攻速 +10%</span></div>
        </div>
      </div>
      <div class="bp-tab-content" id="bpTabEnemy">
        <div class="bp-enemy">
          <p style="color:#b0c7d6;margin-bottom:8px;">👾 实时敌军情报</p>
          <div class="enemy-stat"><span class="stat-label">当前波次</span><span class="stat-value" id="enemyWaveDisplay">${wave}</span></div>
          <div class="enemy-stat"><span class="stat-label">敌军数量</span><span class="stat-value" id="enemyCountDisplay">${enemies.length}</span></div>
          <div style="font-size:0.75rem;color:#4a6a7e;margin-top:8px;">* 数据每2秒更新</div>
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

  if (window._bpInterval) clearInterval(window._bpInterval);
  window._bpInterval = setInterval(() => {
    const wd = document.getElementById('enemyWaveDisplay');
    const cd = document.getElementById('enemyCountDisplay');
    if (wd) wd.textContent = wave;
    if (cd) cd.textContent = enemies.length;
  }, 2000);
});

// ---- 模拟邀约 ----
document.getElementById('btnInvite').addEventListener('click', () => {
  const factions = [
    { name: '⚔️ 铁血同盟', desc: '军事支援 · 攻击 +8', available: true },
    { name: '🛸 星云联邦', desc: '科技支援 · 能量 +50', available: true },
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
      () => { globalDamageBonus += 8; alert('⚔️ 铁血同盟响应！攻击 +8'); },
      () => { energy = Math.min(energy + 50, 200); updateEnergy(); alert('🛸 星云联邦支援！能量 +50'); },
      () => { alert('🌌 暗影议会暂未回应...'); },
      () => { life = Math.min(life + 3, 20); updateLife(); alert('🔱 深海帝国支援！生命 +3'); },
    ];
    if (rewards[idx]) rewards[idx]();
    document.getElementById('btnInvite').click();
  };
});

// ---- 同盟模拟 ----
document.getElementById('btnAlliance').addEventListener('click', () => {
  const allies = [
    { name: '⚔️ 铁血同盟', status: '已结盟', bonus: '攻击 +6' },
    { name: '🛸 星云联邦', status: '已结盟', bonus: '能量 +30' },
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
//  5. 初始化与全局暴露
// ============================================================

console.log('🚀 卫戍协议 · 星河防线 已加载（核心 + Supabase）');
window.restartGame = restartGame;
window.openModal = openModal;
window.closeModal = closeModal;
window.exchangeEnergyToPoints = window.exchangeEnergyToPoints;
window.ensureShipsData = ensureShipsData;
