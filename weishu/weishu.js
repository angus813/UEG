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

function createEnemy(waveNum) {
    let baseHp = 50 + waveNum * 20;
    let speed = 0.6 + waveNum * 0.05;
    let armor = Math.floor(waveNum / 3) * 2;
    return {
        hp: baseHp,
        maxHp: baseHp,
        speed: speed,
        armor: armor,
        row: Math.floor(Math.random() * GRID_ROWS),
        col: -0.5,
        reward: 15 + waveNum * 2
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
                const iconMap = { guard: '⚓', destroyer: '🚢', cruiser: '🛳️', battleship: '🚢✨' };
                cell.innerHTML = '<div class="tower">' + (iconMap[grid[r][c].type] || '⚙️') + '</div>';
            }
            gridEl.appendChild(cell);
        }
    }
}

function renderEnemies() {
    const container = document.getElementById('grid');
    if (!container) return;
    container.querySelectorAll('.enemy').forEach(el => el.remove());
    const cells = container.querySelectorAll('.cell');
    enemies.forEach(enemy => {
        const row = Math.floor(enemy.row);
        const col = Math.floor(enemy.col);
        if (row >= 0 && row < GRID_ROWS && col >= 0 && col < GRID_COLS) {
            const index = row * GRID_COLS + col;
            if (cells[index]) {
                const enemyEl = document.createElement('div');
                enemyEl.className = 'enemy';
                const pct = Math.max(18, (enemy.hp / enemy.maxHp) * 90);
                enemyEl.style.width = pct + '%';
                enemyEl.style.height = pct + '%';
                enemyEl.innerHTML = Math.ceil(enemy.hp);
                cells[index].appendChild(enemyEl);
            }
        }
    });
}

function placeTower(row, col) {
    if (!gameActive || !selectedTower) return;
    if (grid[row][col]) return;
    const stats = towerStats[selectedTower];
    if (energy < stats.cost) return;
    energy -= stats.cost;
    grid[row][col] = {
        type: selectedTower,
        lastFireTime: 0,
        damage: stats.damage + globalDamageBonus,
        fireRate: stats.fireRate * globalAttackSpeed,
        range: stats.range
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
            const tower = grid[r][c];
            if (!tower) continue;
            if (now - tower.lastFireTime < 1000 / tower.fireRate) continue;
            let target = null;
            for (let enemy of enemies) {
                if (enemy.col > GRID_COLS) continue;
                const dist = Math.sqrt(Math.pow(enemy.row - r, 2) + Math.pow(enemy.col - c, 2));
                if (dist <= tower.range) {
                    if (!target || enemy.col > target.col) target = enemy;
                }
            }
            if (target) {
                tower.lastFireTime = now;
                let dmg = tower.damage - target.armor;
                if (dmg < 1) dmg = 1;
                target.hp -= dmg;
                if (target.hp <= 0) {
                    const idx = enemies.indexOf(target);
                    if (idx > -1) {
                        enemies.splice(idx, 1);
                        energy += target.reward;
                        updateEnergy();
                    }
                }
            }
        }
    }
}

function moveEnemies() {
    for (let enemy of enemies) {
        enemy.col += enemy.speed * 0.016;
    }
    enemies = enemies.filter(enemy => {
        if (enemy.col >= GRID_COLS) {
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
    const now = Date.now();
    towersAttack(now);
    moveEnemies();
    renderEnemies();
    energy = Math.min(energy + energyRegen * 0.05, 200);
    updateEnergy();
}

function spawnEnemy() {
    if (!gameActive) return;
    const enemy = createEnemy(wave);
    enemies.push(enemy);
}

function startWave() {
    const startBtn = document.getElementById('startBtn');
    if (startBtn) startBtn.style.display = 'none';
    gameActive = true;
    const enemyCount = 3 + wave * 2;
    let spawned = 0;
    if (spawnInterval) clearInterval(spawnInterval);
    spawnInterval = setInterval(() => {
        if (spawned < enemyCount) {
            spawnEnemy();
            spawned++;
        } else {
            clearInterval(spawnInterval);
            spawnInterval = null;
            checkWaveEnd();
        }
    }, 800);
}

function checkWaveEnd() {
    const checker = setInterval(() => {
        if (!gameActive) { clearInterval(checker); return; }
        if (enemies.length === 0 && !spawnInterval) {
            clearInterval(checker);
            gameActive = false;
            showUpgrade();
        }
    }, 500);
}

function showUpgrade() {
    const upgrades = [
        { name: '⚡ 能量回复 +1', effect: () => { energyRegen += 1; } },
        { name: '🔫 全体攻击 +5', effect: () => { globalDamageBonus += 5; } },
        { name: '💨 攻速 +20%', effect: () => { globalAttackSpeed *= 1.2; } },
        { name: '❤️ 生命 +2', effect: () => { life = Math.min(life + 2, 20); updateLife(); } },
        { name: '⚡ 立即 +80 能量', effect: () => { energy = Math.min(energy + 80, 200); updateEnergy(); } },
    ];
    const shuffled = [...upgrades].sort(() => Math.random() - 0.5);
    const options = shuffled.slice(0, 3);
    const container = document.getElementById('upgradeOptions');
    if (!container) return;
    container.innerHTML = options.map((opt, i) =>
        `<div class="upgrade-option" onclick="selectUpgrade(${i})">${opt.name}</div>`
    ).join('');
    document.getElementById('upgradeModal').style.display = 'flex';
    window.tempUpgrades = options;
}

window.selectUpgrade = function(index) {
    if (window.tempUpgrades && window.tempUpgrades[index]) {
        window.tempUpgrades[index].effect();
    }
    document.getElementById('upgradeModal').style.display = 'none';
    wave++;
    updateWave();
    const startBtn = document.getElementById('startBtn');
    if (startBtn) startBtn.style.display = 'block';
};

function gameOver() {
    gameActive = false;
    if (spawnInterval) clearInterval(spawnInterval);
    if (gameLoopInterval) clearInterval(gameLoopInterval);
    const finalWaves = document.getElementById('finalWaves');
    if (finalWaves) finalWaves.textContent = wave;
    const over = document.getElementById('gameOver');
    if (over) over.style.display = 'block';
}

function restartGame() {
    grid = Array(GRID_ROWS).fill().map(() => Array(GRID_COLS).fill(null));
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
    spawnInterval = null;
    gameLoopInterval = null;
    const over = document.getElementById('gameOver');
    if (over) over.style.display = 'none';
    const startBtn = document.getElementById('startBtn');
    if (startBtn) startBtn.style.display = 'block';
    updateEnergy();
    updateLife();
    updateWave();
    renderGrid();
    renderEnemies();
    bindTowerCards();
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
    modal.classList.add('active');
}

modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
    if (gameLoopInterval) clearInterval(gameLoopInterval);
    if (spawnInterval) clearInterval(spawnInterval);
    gameLoopInterval = null;
    spawnInterval = null;
    gameActive = false;
});
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        if (gameLoopInterval) clearInterval(gameLoopInterval);
        if (spawnInterval) clearInterval(spawnInterval);
        gameLoopInterval = null;
        spawnInterval = null;
        gameActive = false;
    }
});

function buildSoloGame() {
    grid = Array(GRID_ROWS).fill().map(() => Array(GRID_COLS).fill(null));
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
    spawnInterval = null;
    gameLoopInterval = null;

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
            <div class="grid-wrap">
                <div class="grid" id="grid"></div>
            </div>
            <div class="btn-start-wrap">
                <button class="btn-start" id="startBtn">⚔ 开始作战</button>
            </div>
            <div class="tower-bar" id="towerBar">
                <div class="tower-card" data-type="guard" data-cost="20">
                    <div class="tower-icon">⚓</div>
                    <div class="tower-name">护卫舰</div>
                    <div class="tower-cost">20⚡</div>
                </div>
                <div class="tower-card" data-type="destroyer" data-cost="35">
                    <div class="tower-icon">🚢</div>
                    <div class="tower-name">驱逐舰</div>
                    <div class="tower-cost">35⚡</div>
                </div>
                <div class="tower-card" data-type="cruiser" data-cost="50">
                    <div class="tower-icon">🛳️</div>
                    <div class="tower-name">巡洋舰</div>
                    <div class="tower-cost">50⚡</div>
                </div>
                <div class="tower-card" data-type="battleship" data-cost="80">
                    <div class="tower-icon">🚢✨</div>
                    <div class="tower-name">战列舰</div>
                    <div class="tower-cost">80⚡</div>
                </div>
            </div>
            <div class="game-over" id="gameOver">
                <h2>💀 防线失守</h2>
                <p>你坚持了 <span id="finalWaves">0</span> 波</p>
                <button class="btn-restart" onclick="restartGame()">🔄 重新部署</button>
            </div>
        </div>
    `;

    openModal('🛡️ 独立模拟', html);
    renderGrid();
    updateEnergy();
    updateLife();
    updateWave();
    bindTowerCards();

    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (gameActive) return;
            startWave();
            if (gameLoopInterval) clearInterval(gameLoopInterval);
            gameLoopInterval = setInterval(gameLoop, 50);
        });
    }
    bindTowerCards();
}

document.getElementById('btnSolo').addEventListener('click', buildSoloGame);

// ============================================================
//  3. 其他右侧功能（物资调配、邀约、同盟模拟保留模态框）
// ============================================================

// ---- 物资调配处 ----
document.getElementById('btnSupply').addEventListener('click', () => {
    const alloc = { attack: 0, defense: 0, speed: 0 };
    const renderSupply = () => {
        const html = `
            <p style="margin-bottom:6px;">当前能量：<strong style="color:#ff8c2e;">${Math.floor(energy)}</strong> ⚡</p>
            <p style="font-size:0.85rem;color:#6a8a9e;margin-bottom:12px;">调配资源获得临时增益（持续本波）</p>
            <div class="item-list">
                <div class="item-row">
                    <span class="left"><span class="ico">⚔️</span> 攻击强化</span>
                    <span><button class="action-btn" onclick="allocSupply('attack',10)">+10 ⚡</button></span>
                </div>
                <div class="item-row">
                    <span class="left"><span class="ico">🛡️</span> 防御强化</span>
                    <span><button class="action-btn" onclick="allocSupply('defense',10)">+10 ⚡</button></span>
                </div>
                <div class="item-row">
                    <span class="left"><span class="ico">💨</span> 移速强化</span>
                    <span><button class="action-btn" onclick="allocSupply('speed',10)">+10 ⚡</button></span>
                </div>
            </div>
            <div style="font-size:0.75rem;color:#4a6a7e;margin-top:8px;border-top:1px solid #1a222b;padding-top:10px;">
                ⚡ 当前调配：攻击 +${alloc.attack} ｜ 防御 +${alloc.defense} ｜ 速度 +${alloc.speed}
            </div>
        `;
        openModal('📦 物资调配处', html);
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

// ---- 蓝图数据库（内嵌面板） ----
document.getElementById('btnBlueprint').addEventListener('click', function() {
    const leftPanel = document.getElementById('leftPanel');
    const welcome = document.getElementById('welcomeContent');
    if (leftPanel.dataset.blueprint === 'true') {
        leftPanel.innerHTML = `
            <div class="welcome" id="welcomeContent">
                <span class="big-icon">🚀</span>
                <h2>卫戍协议</h2>
                <p>星河防线 · 塔防战略</p>
                <div class="hint">🛡️ 点击「独立模拟」开始作战</div>
            </div>
        `;
        leftPanel.dataset.blueprint = 'false';
        if (window._bpInterval) {
            clearInterval(window._bpInterval);
            window._bpInterval = null;
        }
        return;
    }

    // 初始化舰船等级对象
    if (typeof window.shipLevels === 'undefined') {
        window.shipLevels = {
            carrier: 0,
            support: 0,
            battlecruiser: 0,
            cruiser: 0,
            destroyer: 0,
            frigate: 0,
            corvette: 0,
            fighter: 0
        };
    }

    // ============================================================
    //  ★ 修改重点：航母图标替换为本地图片
    // ============================================================
    const ships = [
        {
            id: 'carrier',
            name: '航母',
            // 将 Emoji 🚀 替换为 <img> 标签，使用用户提供的图片路径
            icon: '<img src="./photo/微信图片_20260731000935_177_7.jpg" style="width:22px;height:22px;vertical-align:middle;margin-right:4px;border-radius:2px;">',
            desc: '旗舰级作战单位，提升整体攻击力',
            effect: (level) => `攻击 +${level * 3}`,
            apply: () => { globalDamageBonus += 3; }
        },
        { id: 'support', name: '支援舰', icon: '🛡️', desc: '后勤保障，提升能量回复速度', effect: (level) => `能量回复 +${(level * 0.5).toFixed(1)}`, apply: () => { energyRegen += 0.5; } },
        { id: 'battlecruiser', name: '战列巡洋舰', icon: '⚔️', desc: '重型火力，提升射速', effect: (level) => `射速 +${level * 5}%`, apply: () => { globalAttackSpeed *= 1.05; } },
        { id: 'cruiser', name: '巡洋舰', icon: '🛳️', desc: '多功能战舰，提升攻击力', effect: (level) => `攻击 +${level * 2}`, apply: () => { globalDamageBonus += 2; } },
        { id: 'destroyer', name: '驱逐舰', icon: '🚢', desc: '快速打击，提升攻击速度', effect: (level) => `攻速 +${level * 3}%`, apply: () => { globalAttackSpeed *= 1.03; } },
        { id: 'frigate', name: '护卫舰', icon: '⚓', desc: '基础防御，提升生命上限', effect: (level) => `生命 +${level * 2}`, apply: () => { life += 2; updateLife(); } },
        { id: 'corvette', name: '护航艇', icon: '🛥️', desc: '护航支援，提升能量回复', effect: (level) => `能量回复 +${(level * 0.3).toFixed(1)}`, apply: () => { energyRegen += 0.3; } },
        { id: 'fighter', name: '战机', icon: '✈️', desc: '空中优势，提升攻击力', effect: (level) => `攻击 +${level * 1}`, apply: () => { globalDamageBonus += 1; } }
    ];

    let currentShipId = 'frigate';

    function renderShipDetail(shipId) {
        const ship = ships.find(s => s.id === shipId);
        if (!ship) return '<div>未知舰种</div>';
        const level = window.shipLevels[shipId] || 0;
        const cost = 30 + level * 10;
        const isMax = level >= 5;
        const effectText = ship.effect(level);
        const nextEffect = level < 5 ? ship.effect(level + 1) : '已满级';
        const levelPercent = (level / 5) * 100;
        return `
            <div class="ship-name">${ship.icon} ${ship.name}</div>
            <div class="ship-desc">${ship.desc}</div>
            <div class="ship-level">等级：${level} / 5</div>
            <div class="level-bar"><div class="fill" style="width:${levelPercent}%;"></div></div>
            <div class="ship-effect">当前增益：${effectText}</div>
            <div class="ship-next">下一级增益：${nextEffect}</div>
            <div class="ship-cost">研究消耗：${cost} ⚡</div>
            <button class="btn-research" ${isMax ? 'disabled' : ''} onclick="researchShip('${shipId}')">
                ${isMax ? '✅ 已满级' : '🔬 研究'}
            </button>
        `;
    }

    window.researchShip = function(shipId) {
        const ship = ships.find(s => s.id === shipId);
        if (!ship) return;
        const level = window.shipLevels[shipId] || 0;
        if (level >= 5) { alert('该舰种已达最高等级！'); return; }
        const cost = 30 + level * 10;
        if (energy < cost) { alert(`⚡ 能量不足，需要 ${cost} 能量`); return; }
        energy -= cost;
        updateEnergy();
        ship.apply();
        window.shipLevels[shipId] = level + 1;
        // 更新详情
        const detailEl = document.getElementById('shipDetail');
        if (detailEl) {
            detailEl.innerHTML = renderShipDetail(shipId);
        }
        // 更新左侧徽章
        const badge = document.querySelector(`.bp-ship-item[data-ship="${shipId}"] .level-badge`);
        if (badge) badge.textContent = `Lv.${window.shipLevels[shipId]}`;
        updateEnergy();
        alert(`✅ ${ship.name} 研究成功！当前等级 ${window.shipLevels[shipId]}`);
    };

    // 构建蓝图面板HTML
    function buildBlueprintHTML() {
        return `
            <div class="bp-panel">
                <div class="bp-header">
                    <span class="bp-title">📐 蓝图数据库</span>
                    <button class="bp-back" id="bpBackBtn">← 返回</button>
                </div>
                <div class="bp-tab-bar">
                    <button class="bp-tab-btn active" data-tab="blueprint">📐 蓝图数据</button>
                    <button class="bp-tab-btn" data-tab="alliance">🤝 盟约报告</button>
                    <button class="bp-tab-btn" data-tab="enemy">👾 敌方资料</button>
                </div>
                <div class="bp-tab-content active" id="bpTabBlueprint">
                    <div class="bp-main">
                        <div class="bp-ship-list" id="shipList">
                            ${ships.map(s => `
                                <div class="bp-ship-item ${s.id === currentShipId ? 'active' : ''}" data-ship="${s.id}">
                                    <span>${s.icon} ${s.name}</span>
                                    <span class="level-badge">Lv.${window.shipLevels[s.id] || 0}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="bp-detail-card" id="shipDetail">
                            ${renderShipDetail(currentShipId)}
                        </div>
                    </div>
                </div>
                <div class="bp-tab-content" id="bpTabAlliance">
                    <div class="bp-alliance">
                        <p style="color:#b0c7d6;margin-bottom:8px;">🤝 当前盟约状态</p>
                        <div class="ally-item"><span>⚔️ 铁血同盟</span><span class="status-ok">已结盟</span><span class="bonus">攻击 +6</span></div>
                        <div class="ally-item"><span>🛸 星云联邦</span><span class="status-ok">已结盟</span><span class="bonus">能量 +30</span></div>
                        <div class="ally-item"><span>🌌 暗影议会</span><span class="status-pending">待邀请</span><span class="bonus">攻速 +10%</span></div>
                        <button class="action-btn" style="margin-top:12px;background:#00b8ff;border:none;color:#fff;padding:6px 16px;border-radius:20px;cursor:pointer;" onclick="alert('🌌 向暗影议会发出同盟邀请...')">邀请暗影议会</button>
                    </div>
                </div>
                <div class="bp-tab-content" id="bpTabEnemy">
                    <div class="bp-enemy">
                        <p style="color:#b0c7d6;margin-bottom:8px;">👾 实时敌军情报</p>
                        <div class="enemy-stat"><span class="stat-label">当前波次</span><span class="stat-value" id="enemyWaveDisplay">${wave}</span></div>
                        <div class="enemy-stat"><span class="stat-label">敌军数量</span><span class="stat-value" id="enemyCountDisplay">${enemies.length}</span></div>
                        <div class="enemy-stat"><span class="stat-label">平均生命</span><span class="stat-value" id="enemyAvgHp">${enemies.length ? Math.round(enemies.reduce((a,b)=>a+b.maxHp,0)/enemies.length) : 0}</span></div>
                        <div style="font-size:0.75rem;color:#4a6a7e;margin-top:8px;">* 数据每2秒更新</div>
                    </div>
                </div>
            </div>
        `;
    }

    leftPanel.innerHTML = buildBlueprintHTML();
    leftPanel.dataset.blueprint = 'true';

    // 绑定返回按钮
    document.getElementById('bpBackBtn').addEventListener('click', function() {
        document.getElementById('btnBlueprint').click();
    });

    // 绑定选项卡切换
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

    // 绑定舰种点击
    document.querySelectorAll('.bp-ship-item').forEach(item => {
        item.addEventListener('click', function() {
            const shipId = this.dataset.ship;
            currentShipId = shipId;
            document.querySelectorAll('.bp-ship-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            const detailEl = document.getElementById('shipDetail');
            if (detailEl) {
                detailEl.innerHTML = renderShipDetail(shipId);
            }
        });
    });

    // 启动定时器更新敌方数据
    if (window._bpInterval) clearInterval(window._bpInterval);
    window._bpInterval = setInterval(() => {
        const waveDisplay = document.getElementById('enemyWaveDisplay');
        const countDisplay = document.getElementById('enemyCountDisplay');
        const avgHpDisplay = document.getElementById('enemyAvgHp');
        if (waveDisplay) waveDisplay.textContent = wave;
        if (countDisplay) countDisplay.textContent = enemies.length;
        if (avgHpDisplay) {
            const avg = enemies.length ? Math.round(enemies.reduce((a,b)=>a+b.maxHp,0)/enemies.length) : 0;
            avgHpDisplay.textContent = avg;
        }
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
        const status = f.available ?
            `<button class="action-btn" onclick="inviteFaction(${i})">邀约</button>` :
            `<span style="color:#6a4a4a;">⏳ 冷却中</span>`;
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
        if (rewards[idx]) rewards[idx];
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
            <button class="action-btn secondary" style="flex:1;padding:8px;" onclick="document.getElementById('genericModal').classList.remove('active')">关闭</button>
        </div>
    `;
    openModal('⚔️ 同盟模拟', html);
});

// ============================================================
//  4. 初始化
// ============================================================

console.log('🚀 卫戍协议 · 星河防线 已加载（独立模拟模式）');
window.restartGame = restartGame;