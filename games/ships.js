// ============================================================
//  艾奥-A型 强化系统（独立模块）
// ============================================================

// 全局状态
if (typeof window.ioaState === 'undefined') {
    window.ioaState = {
        version: 1.00,
        points: 0,
        currentSystem: 'm',
        systems: {
            m: { 伤害: 0, 冷却: 0, 暴击: 0 },
            a: { 命中: 0, 伤害: 0, 冷却: 0, 暴击: 0 },
            b: { 命中: 0, 伤害: 0, 冷却: 0, 暴击: 0 },
            armor: { 结构值: 0, 抵抗伤害: 0, 护盾值: 0, 导弹抗性: 0 }
        }
    };
}

// ---- 计算加成后属性（仅返回最终加成值） ----
function calcBonusStats() {
    const state = window.ioaState;
    const m = state.systems.m;
    const a = state.systems.a;
    const b = state.systems.b;
    const armor = state.systems.armor;

    // 各系统等级
    const mDmg = m.伤害;
    const aDmg = a.伤害;
    const bDmg = b.伤害;
    const mCool = m.冷却;
    const aCool = a.冷却;
    const bCool = b.冷却;
    const mCrit = m.暴击;

    // 装甲
    const structPct = armor.结构值 * 4;
    const resistAdd = armor.抵抗伤害 * 6;
    const shieldPct = armor.护盾值 * 6;
    const missileResist = armor.导弹抗性 * 3;
    const torpedoResist = armor.导弹抗性 * 5;

    // 基础值
    const base = {
        mAntiship: 24000,
        bAntiship: 3085,
        aAa: 787,          // A系统防空基础
        mCoolBase: 10,
        aCoolBase: 4,
        bCoolBase: 20,
        structure: 62120,
        resist: 50,
        shield: 10,
        mSiege: 5760,
        aSiege: 126
    };

    // 各武器火力加成后（A系统防空也受伤害加成）
    const mAntishipFinal = Math.round(base.mAntiship * (1 + (mDmg * 4) / 100));
    const bAntishipFinal = Math.round(base.bAntiship * (1 + (bDmg * 4) / 100));
    const aAaFinal = Math.round(base.aAa * (1 + (aDmg * 4) / 100));
    const totalAntiship = mAntishipFinal + bAntishipFinal;

    // 各武器冷却时间
    const mCoolFinal = base.mCoolBase * (1 - (mCool * 6) / 100);
    const aCoolFinal = base.aCoolBase * (1 - (aCool * 6) / 100);
    const bCoolFinal = base.bCoolBase * (1 - (bCool * 6) / 100);

    // 结构、抵抗、护盾
    const structureFinal = Math.round(base.structure * (1 + structPct / 100));
    const resistFinal = base.resist + resistAdd;
    const shieldFinal = Math.round((base.shield + base.shield * shieldPct / 100) * 10) / 10;

    // 暴击率（取M系统暴击，每级+2%）
    const critRate = Math.round(mCrit * 2 * 10) / 10;

    // 命中加成（用于效果摘要）
    const aHit = a.命中 * 2;
    const bHit = b.命中 * 2;

    return {
        // 属性面板（最终值）
        aa: aAaFinal,                 // 防空火力现在受A系统伤害加成
        antiship: totalAntiship,
        structure: structureFinal,
        resist: resistFinal,
        shield: shieldFinal,
        missileResist: Math.round(missileResist * 10) / 10,
        torpedoResist: Math.round(torpedoResist * 10) / 10,
        critRate: critRate,

        // 武器详情（最终值）
        mAntiship: mAntishipFinal,
        bAntiship: bAntishipFinal,
        aAa: aAaFinal,                // A系统防空加成后
        mCool: Math.round(mCoolFinal * 10) / 10,
        aCool: Math.round(aCoolFinal * 10) / 10,
        bCool: Math.round(bCoolFinal * 10) / 10,
        mSiege: base.mSiege,
        aSiege: base.aSiege,

        // 效果摘要（百分比）
        mDmgPct: mDmg * 4,
        aDmgPct: aDmg * 4,
        bDmgPct: bDmg * 4,
        mCoolPct: mCool * 6,
        aCoolPct: aCool * 6,
        bCoolPct: bCool * 6,
        aHit: aHit,
        bHit: bHit
    };
}

// ---- 获取点数 ----
function addIoaPoints() {
    const cost = 10;
    if (window.energy < cost) { alert(`能量不足，需要 ${cost} 能量`); return; }
    window.energy -= cost;
    window.updateEnergy();
    window.ioaState.points += 1;
    renderIoaModal();
}

// ---- 升级强化项（无前置） ----
function upgradeIoaItem(systemKey, itemName) {
    const state = window.ioaState;
    const system = state.systems[systemKey];
    const currentLevel = system[itemName];
    if (currentLevel >= 5) { alert('已达最高等级！'); return; }
    if (state.points < 2) { alert('强化点数不足，需要 2 点'); return; }
    state.points -= 2;
    system[itemName] = currentLevel + 1;
    state.version = Math.round((state.version + 0.01) * 100) / 100;
    renderIoaModal();
}

// ---- 重置强化（退还点数） ----
function resetIoa() {
    if (!confirm('确定重置所有强化等级吗？已花费的点数将全部退还。')) return;
    const state = window.ioaState;
    let totalLevels = 0;
    for (const sys in state.systems) {
        for (const key in state.systems[sys]) {
            totalLevels += state.systems[sys][key];
        }
    }
    const refundPoints = totalLevels * 2;
    for (const sys in state.systems) {
        for (const key in state.systems[sys]) {
            state.systems[sys][key] = 0;
        }
    }
    state.points += refundPoints;
    state.version = 1.00;
    state.currentSystem = 'm';
    renderIoaModal();
    alert(`重置成功！已退还 ${refundPoints} 点强化点数。`);
}

// ---- 计算单项加成（用于强化项旁显示） ----
function getBonus(systemKey, itemName) {
    const level = window.ioaState.systems[systemKey]?.[itemName] || 0;
    if (itemName === '伤害') return level * 4;
    if (itemName === '冷却') return level * 6;
    if (itemName === '命中') return level * 2;
    if (itemName === '暴击') return level * 2;
    if (itemName === '结构值') return level * 4;
    if (itemName === '抵抗伤害') return level * 6;
    if (itemName === '护盾值') return level * 6;
    if (itemName === '导弹抗性') return level * 3;
    return 0;
}

// ---- 渲染强化模态框 ----
function renderIoaModal() {
    const state = window.ioaState;
    const currentSys = state.currentSystem;
    const systemNames = {
        m: 'M系统',
        a: 'A系统',
        b: 'B系统',
        armor: '装甲系统'
    };
    const itemLabels = {
        m: ['伤害', '冷却', '暴击'],
        a: ['命中', '伤害', '冷却', '暴击'],
        b: ['命中', '伤害', '冷却', '暴击'],
        armor: ['结构值', '抵抗伤害', '护盾值', '导弹抗性']
    };
    const systemData = state.systems[currentSys];
    const items = itemLabels[currentSys] || [];

    let treeHtml = items.map((item) => {
        const level = systemData[item] || 0;
        const isMax = level >= 5;
        const disabled = isMax || state.points < 2;
        let bonusText = '';
        if (currentSys !== 'armor') {
            const bonus = getBonus(currentSys, item);
            if (item === '伤害' && bonus > 0) bonusText = ` (+${bonus}%)`;
            else if (item === '冷却' && bonus > 0) bonusText = ` (-${bonus}%)`;
            else if (item === '命中' && bonus > 0) bonusText = ` (+${bonus}%)`;
            else if (item === '暴击' && bonus > 0) bonusText = ` (+${bonus}%)`;
        } else {
            if (item === '结构值') {
                const val = getBonus(currentSys, item);
                bonusText = ` (+${val}%)`;
            } else if (item === '抵抗伤害') {
                const val = getBonus(currentSys, item);
                bonusText = ` (+${val})`;
            } else if (item === '护盾值') {
                const val = getBonus(currentSys, item);
                bonusText = ` (+${val}%)`;
            } else if (item === '导弹抗性') {
                const val = getBonus(currentSys, item);
                const torpedoVal = val * 5 / 3;
                bonusText = ` (导弹 -${val}% / 鱼雷 -${Math.round(torpedoVal)}%)`;
            }
        }
        return `
            <div class="ioa-tree-item">
                <span class="name">${item}${bonusText}</span>
                <span class="level">Lv.${level}/5</span>
                <button class="btn-upgrade" ${disabled ? 'disabled' : ''} onclick="upgradeIoaItem('${currentSys}','${item}')">
                    ${isMax ? '已满' : '升级 (2点)'}
                </button>
            </div>
        `;
    }).join('');

    const stats = calcBonusStats();

    // 强化效果摘要
    let effectHtml = '';
    if (currentSys === 'm') {
        effectHtml = `
            <div style="background:#0d1116;border:1px solid #1f2833;border-radius:4px;padding:8px 12px;margin:8px 0;">
                <strong style="color:#b0c7d6;">当前M系统强化效果：</strong><br>
                <span style="color:#ffaa44;">伤害加成：+${stats.mDmgPct}%</span> &nbsp;|&nbsp;
                <span style="color:#88ccff;">冷却缩减：-${stats.mCoolPct}%</span>
            </div>
        `;
    } else if (currentSys === 'a') {
        effectHtml = `
            <div style="background:#0d1116;border:1px solid #1f2833;border-radius:4px;padding:8px 12px;margin:8px 0;">
                <strong style="color:#b0c7d6;">当前A系统强化效果：</strong><br>
                <span style="color:#88ccff;">命中提升：+${stats.aHit}%</span> &nbsp;|&nbsp;
                <span style="color:#ffaa44;">伤害加成：+${stats.aDmgPct}%</span> &nbsp;|&nbsp;
                <span style="color:#88ccff;">冷却缩减：-${stats.aCoolPct}%</span>
            </div>
        `;
    } else if (currentSys === 'b') {
        effectHtml = `
            <div style="background:#0d1116;border:1px solid #1f2833;border-radius:4px;padding:8px 12px;margin:8px 0;">
                <strong style="color:#b0c7d6;">当前B系统强化效果：</strong><br>
                <span style="color:#88ccff;">命中提升：+${stats.bHit}%</span> &nbsp;|&nbsp;
                <span style="color:#ffaa44;">伤害加成：+${stats.bDmgPct}%</span> &nbsp;|&nbsp;
                <span style="color:#88ccff;">冷却缩减：-${stats.bCoolPct}%</span>
            </div>
        `;
    } else if (currentSys === 'armor') {
        const armorItems = itemLabels.armor;
        const armorLevels = armorItems.map(item => {
            const lv = systemData[item] || 0;
            let extra = '';
            if (item === '导弹抗性') {
                const val = lv * 3;
                const torpVal = lv * 5;
                extra = ` (导弹 -${val}% / 鱼雷 -${torpVal}%)`;
            }
            return `${item}: Lv.${lv}${extra}`;
        }).join(' &nbsp;|&nbsp; ');
        effectHtml = `
            <div style="background:#0d1116;border:1px solid #1f2833;border-radius:4px;padding:8px 12px;margin:8px 0;">
                <strong style="color:#b0c7d6;">当前装甲等级：</strong><br>
                <span style="color:#ffaa44;">${armorLevels}</span>
            </div>
        `;
    }

    const versionClass = state.version >= 2.00 ? 'gold' : '';

    const statsHtml = `
        <div class="ioa-stats" style="margin-top:8px;">
            <div><span class="stat-label">站位：</span><span class="stat-value">中排</span></div>
            <div><span class="stat-label">单舰人口：</span><span class="stat-value">18</span></div>
            <div><span class="stat-label">防空火力：</span><span class="stat-value">${stats.aa} /分钟</span></div>
            <div><span class="stat-label">对舰火力：</span><span class="stat-value">${stats.antiship} /分钟</span></div>
            <div><span class="stat-label">结构值：</span><span class="stat-value">${stats.structure}</span></div>
            <div><span class="stat-label">服役限制：</span><span class="stat-value">8</span></div>
            <div><span class="stat-label">抵抗伤害：</span><span class="stat-value">${stats.resist}</span></div>
            <div><span class="stat-label">护盾值：</span><span class="stat-value">${stats.shield}%</span></div>
            <div><span class="stat-label">导弹抗性：</span><span class="stat-value">-${stats.missileResist}%</span></div>
            <div><span class="stat-label">鱼雷抗性：</span><span class="stat-value">-${stats.torpedoResist}%</span></div>
            <div><span class="stat-label">暴击率：</span><span class="stat-value">${stats.critRate}%</span></div>
        </div>
    `;

    const weaponDetail = `
        <strong>武器系统：</strong><br>
        <strong>M系统：</strong>“雷式”MK2-AI-2x720型 x1<br>
        · 攻城火力：${stats.mSiege}/分钟 &nbsp;|&nbsp; 对舰火力：${stats.mAntiship}/分钟<br>
        · 双联装离子炮 &nbsp;|&nbsp; 能量伤害 &nbsp;|&nbsp; 持续时间：8秒<br>
        · 优先目标：大型舰船 &nbsp;|&nbsp; 冷却时间：${stats.mCool}秒<br>
        · 弹道类型：直射武器 &nbsp;|&nbsp; 伤害频率：6次 &nbsp;|&nbsp; 单发伤害：600<br>
        · 锁定时间：8.0秒<br>
        · 性能介绍：超重型双联装攻坚离子炮，能持续高。<br>
        <br>
        <strong>A系统：</strong>AG-1120B x4<br>
        · 攻城火力：${stats.aSiege}/分钟 &nbsp;|&nbsp; 防空火力：${stats.aAa}/分钟<br>
        · 快速火炮 &nbsp;|&nbsp; 实弹伤害 &nbsp;|&nbsp; 优先目标：舰载机<br>
        · 弹药数×攻击次数 &nbsp;|&nbsp; 冷却时间：${stats.aCool}秒<br>
        · 弹道类型：直射武器 &nbsp;|&nbsp; 锁定时间：3.0秒<br>
        · 单发伤害：35 &nbsp;|&nbsp; 性能介绍：反击防空，快速打击火炮，可以针对小型舰船目标进行快速定位和打击。<br>
        <br>
        <strong>B系统：</strong>AM-8x150A型<br>
        · 对舰火力：${stats.bAntiship}/分钟 &nbsp;|&nbsp; 持续时间：8秒<br>
        · 反舰导弹阵列 &nbsp;|&nbsp; 实弹伤害 &nbsp;|&nbsp; 弹药数×攻击次数：1x8<br>
        · 优先目标：小型舰船 &nbsp;|&nbsp; 冷却时间：${stats.bCool}秒<br>
        · 弹道类型：投射武器 &nbsp;|&nbsp; 锁定时间：5.0秒<br>
        · 单发伤害：100<br>
        · 性能介绍：轻型舰导弹发射阵列，可以快速发射对舰轻型导弹，对敌方中小型目标具有很强的打击能力。
    `;

    const html = `
        <div class="modal-two-col" style="max-height:80vh;overflow:hidden;">
            <div class="modal-left-col" style="overflow-y:auto;display:flex;flex-direction:column;justify-content:space-between;">
                <div>
                    <div style="display:flex;flex-direction:column;gap:6px;">
                        ${Object.keys(systemNames).map(key => `
                            <div class="ioa-system ${key === currentSys ? 'active' : ''}" onclick="switchIoaSystem('${key}')">${systemNames[key]}</div>
                        `).join('')}
                    </div>
                    <div style="margin-top:12px;font-size:0.8rem;color:#6a8a9e;border-top:1px solid #1f2833;padding-top:8px;">
                        <div>版本号：<span class="${versionClass}" style="font-weight:700;">${state.version.toFixed(2)}</span></div>
                        <div>强化点数：${state.points}</div>
                        <button class="btn-get-points" onclick="addIoaPoints()">+1 点数 (消耗10能量)</button>
                    </div>
                </div>
                <div style="margin-top:12px;padding-top:8px;border-top:1px solid #1f2833;">
                    <button class="btn-reset" onclick="resetIoa()" style="background:#cc3344;border:none;color:#fff;padding:6px 16px;border-radius:4px;cursor:pointer;font-weight:600;width:100%;">🔄 重置强化</button>
                </div>
            </div>
            <div class="modal-right-col" style="overflow-y:auto;flex:1.5;">
                <div style="overflow-y:auto;max-height:calc(80vh - 200px);">
                    ${treeHtml}
                    ${effectHtml}
                </div>
                ${statsHtml}
                <div class="ioa-weapon-detail" style="max-height:150px;overflow-y:auto;">
                    ${weaponDetail}
                </div>
            </div>
        </div>
    `;

    const fullHtml = `<div style="padding:0;">${html}</div>`;
    window.openModal('🚀 艾奥-A型 · 强化配置', fullHtml);
}

// ---- 切换系统 ----
function switchIoaSystem(systemKey) {
    window.ioaState.currentSystem = systemKey;
    renderIoaModal();
}

// ---- 打开模态框 ----
function openIoaModal() {
    console.log('openIoaModal 被调用');
    const modalEl = document.getElementById('genericModal');
    if (!modalEl) {
        console.error('genericModal not found');
        return;
    }
    modalEl.style.display = 'flex';
    modalEl.classList.add('active');
    renderIoaModal();
}

// ---- 能量兑换 ----
function exchangeEnergyToPoints() {
    if (typeof window.ioaState === 'undefined') {
        alert('强化系统尚未初始化，请先打开艾奥-A型强化配置');
        return;
    }
    if (window.energy < 3) {
        alert('能量不足，需要 3 能量');
        return;
    }
    window.energy -= 3;
    window.updateEnergy();
    window.ioaState.points += 2;
    if (window._allocData) {
        document.getElementById('btnSupply').click();
    }
    alert('兑换成功！获得 2 个升级点');
}

// ---- 暴露全局接口 ----
window.openIoaModal = openIoaModal;
window.addIoaPoints = addIoaPoints;
window.upgradeIoaItem = upgradeIoaItem;
window.switchIoaSystem = switchIoaSystem;
window.exchangeEnergyToPoints = exchangeEnergyToPoints;
window.resetIoa = resetIoa;
window.calcBonusStats = calcBonusStats;

console.log('🚀 ships.js 已加载（艾奥-A型强化系统）');