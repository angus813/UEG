// ============================================================
//  艾奥级 + 康纳马拉级 + 卡利斯托级 强化系统（全局点数共享，界面化）
// ============================================================

// 全局点数（所有舰船共用）
if (typeof window.ioaGlobalPoints === 'undefined') {
    window.ioaGlobalPoints = 0;
}

// 全局状态（以舰船ID为键，不含 points）
if (typeof window.ioaStates === 'undefined') {
    window.ioaStates = {
        'ioa-a': { version: 1.00, currentSystem: 'm', systems: { m: { 伤害: 0, 冷却: 0, 暴击: 0 }, a: { 命中: 0, 伤害: 0, 冷却: 0, 暴击: 0 }, b: { 命中: 0, 伤害: 0, 冷却: 0, 暴击: 0 }, armor: { 结构值: 0, 抵抗伤害: 0, 护盾值: 0, 导弹抗性: 0 } } },
        'ioa-b': { version: 1.00, currentSystem: 'm', systems: { m: { 伤害: 0, 冷却: 0, 暴击: 0, 小型命中: 0 }, a: { 命中: 0, 伤害: 0, 冷却: 0, 暴击: 0 }, b: { 命中: 0, 伤害: 0, 冷却: 0, 暴击: 0 }, armor: { 结构值: 0, 抵抗伤害: 0, 护盾值: 0, 导弹抗性: 0 } } },
        'ioa-c': { version: 1.00, currentSystem: 'm', systems: { m: { 伤害: 0, 冷却: 0, 暴击: 0, 大型命中: 0 }, a: { 命中: 0, 伤害: 0, 冷却: 0, 暴击: 0 }, b: { 命中: 0, 伤害: 0, 冷却: 0, 暴击: 0 }, armor: { 结构值: 0, 抵抗伤害: 0, 护盾值: 0, 导弹抗性: 0 } } },
        'konara': {
            version: 1.00,
            currentSystem: 'm',
            systems: {
                m: { 伤害: 0, 冷却: 0, 命中1: 0, 命中2: 0, 策略强化: 0 },
                a: { 命中1: 0, 命中2: 0, 伤害: 0, 冷却: 0 },
                armor: { 结构值: 0, 抵抗伤害: 0, 护盾值: 0 }
            }
        },
        'konara-b': {
            version: 1.00,
            currentSystem: 'm',
            systems: {
                m: { 伤害: 0, 冷却: 0, 命中1: 0, 策略强化: 0 },
                a: { 命中1: 0, 命中2: 0, 伤害: 0, 冷却: 0 },
                armor: { 结构值: 0, 抵抗伤害: 0, 护盾值: 0 }
            }
        },
        'kalisto': {
            version: 1.00,
            currentSystem: 'm',
            systems: {
                m: { 伤害: 0, 冷却: 0, 命中1: 0, 暴击: 0, 策略强化: 0 },
                a: { 命中1: 0, 命中2: 0, 伤害: 0, 冷却: 0 },
                armor: { 结构值: 0, 抵抗伤害: 0, 护盾值: 0 }
            }
        },
        'kalisto-b': {
            version: 1.00,
            currentSystem: 'm',
            systems: {
                m: { 伤害: 0, 冷却: 0, 命中1: 0, 暴击: 0, 策略强化: 0 },
                a: { 命中1: 0, 命中2: 0, 伤害: 0, 冷却: 0 },
                armor: { 结构值: 0, 抵抗伤害: 0, 护盾值: 0 }
            }
        }
    };
}

// 获取状态
function getIoaState(shipId) {
    if (!window.ioaStates[shipId]) {
        window.ioaStates[shipId] = { version: 1.00, currentSystem: 'm', systems: { m: {}, a: {}, armor: {} } };
    }
    return window.ioaStates[shipId];
}

// ---- 计算加成后属性 ----
function calcBonusStats(shipId) {
    const state = getIoaState(shipId);
    const isKonara = (shipId === 'konara' || shipId === 'konara-b');
    const isKalisto = (shipId === 'kalisto' || shipId === 'kalisto-b');

    let m = state.systems.m;
    let a = state.systems.a;
    let b = state.systems.b || {};
    let armor = state.systems.armor;

    let base;
    if (shipId === 'ioa-a') {
        base = { mAntiship: 24000, bAntiship: 3085, aAa: 787, mCoolBase: 10, aCoolBase: 4, bCoolBase: 20, structure: 62120, resist: 50, shield: 10, mSiege: 5760, aSiege: 126, pop: 18, pos: '中排' };
    } else if (shipId === 'ioa-b') {
        base = { mAntiship: 20400, bAntiship: 5440, aAa: 787, mCoolBase: 1, aCoolBase: 4, bCoolBase: 13, structure: 62120, resist: 50, shield: 10, mSiege: 20400, aSiege: 0, pop: 18, pos: '中排' };
    } else if (shipId === 'ioa-c') {
        base = { mAntiship: 20100, bAntiship: 3085, aAa: 385, mCoolBase: 6, aCoolBase: 4, bCoolBase: 20, structure: 62120, resist: 50, shield: 10, mSiege: 20100, aSiege: 0, pop: 18, pos: '中排' };
    } else if (shipId === 'konara') {
        base = { mAntiship: 11900, bAntiship: 0, aAa: 993, mCoolBase: 12, aCoolBase: 6, bCoolBase: 0, structure: 71600, resist: 30, shield: 10, mSiege: 11900, aSiege: 0, pop: 16, pos: '中排' };
    } else if (shipId === 'konara-b') {
        base = { mAntiship: 26181, bAntiship: 0, aAa: 993, mCoolBase: 10, aCoolBase: 6, bCoolBase: 0, structure: 71600, resist: 30, shield: 10, mSiege: 26181, aSiege: 0, pop: 20, pos: '后排' };
    } else if (shipId === 'kalisto') {
        base = {
            mAntiship: 18133,
            bAntiship: 0,
            aAa: 236,
            mCoolBase: 24,
            aCoolBase: 4,
            bCoolBase: 0,
            structure: 79630,
            resist: 40,
            shield: 10,
            mSiege: 18133,
            aSiege: 0,
            pop: 18,
            pos: '后排'
        };
    } else { // 'kalisto-b'
        base = {
            mAntiship: 21200,
            bAntiship: 0,
            aAa: 236,
            mCoolBase: 20,
            aCoolBase: 4,
            bCoolBase: 0,
            structure: 79630,
            resist: 40,
            shield: 10,
            mSiege: 21200,
            aSiege: 0,
            pop: 20,
            pos: '后排'
        };
    }

    const mDmg = m.伤害 || 0;
    const aDmg = a.伤害 || 0;
    const mCool = m.冷却 || 0;
    const aCool = a.冷却 || 0;
    const strat = m.策略强化 || 0;

    // 命中项
    let mHit1 = 0, mHit2 = 0, aHit1 = 0, aHit2 = 0;
    if (shipId === 'konara-b') {
        mHit1 = (m.命中1 || 0) * 6;
    } else if (shipId === 'konara') {
        mHit1 = (m.命中1 || 0) * 2;
        mHit2 = (m.命中2 || 0) * 3;
    } else if (shipId === 'ioa-b') {
        mHit1 = (m.小型命中 || 0) * 6;
    } else if (shipId === 'ioa-c') {
        mHit1 = (m.大型命中 || 0) * 6;
    } else if (isKalisto) {
        mHit1 = (m.命中1 || 0) * 6; // 对大型命中
    }
    if (isKonara || isKalisto) {
        aHit1 = (a.命中1 || 0) * 2;
        aHit2 = (a.命中2 || 0) * 3;
    }

    // 暴击伤害加成（仅卡利斯托系列）
    let critDmgBonus = 0;
    if (isKalisto) {
        critDmgBonus = (m.暴击 || 0) * 16; // 每级+16%
    }

    // 装甲
    const structPct = armor.结构值 * 4;
    const resistAdd = armor.抵抗伤害 * 6;
    const shieldPct = armor.护盾值 * 6;

    const mAntishipFinal = Math.round(base.mAntiship * (1 + (mDmg * 4) / 100));
    const aAaFinal = Math.round(base.aAa * (1 + (aDmg * 4) / 100));
    let bAntishipFinal = 0;
    if (base.bAntiship > 0) {
        const bDmg = b.伤害 || 0;
        bAntishipFinal = Math.round(base.bAntiship * (1 + (bDmg * 4) / 100));
    }
    const totalAntiship = mAntishipFinal + bAntishipFinal;

    // 冷却计算（卡利斯托M系统冷却-3%/级，其他-6%/级）
    let mCoolPct = mCool * 6;
    if (isKalisto) mCoolPct = mCool * 3; // 卡利斯托M系统特殊
    const mCoolFinal = base.mCoolBase * (1 - mCoolPct / 100);
    const aCoolPct = aCool * 6;
    const aCoolFinal = base.aCoolBase * (1 - aCoolPct / 100);
    let bCoolFinal = 0;
    if (base.bCoolBase > 0) {
        const bCool = b.冷却 || 0;
        bCoolFinal = base.bCoolBase * (1 - (bCool * 6) / 100);
    }

    const structureFinal = Math.round(base.structure * (1 + structPct / 100));
    const resistFinal = base.resist + resistAdd;
    const shieldFinal = Math.round((base.shield + base.shield * shieldPct / 100) * 10) / 10;

    let critRate = 0;
    if (!isKonara && !isKalisto) {
        const mCrit = m.暴击 || 0;
        critRate = Math.round(mCrit * 2 * 10) / 10;
    } else if (isKalisto) {
        critRate = 15; // 基础暴击率15%
    }

    return {
        aa: aAaFinal,
        antiship: totalAntiship,
        structure: structureFinal,
        resist: resistFinal,
        shield: shieldFinal,
        missileResist: 0,
        torpedoResist: 0,
        critRate: critRate,
        critDmgBonus: critDmgBonus,
        mHit1: mHit1,
        mHit2: mHit2,
        aHit1: aHit1,
        aHit2: aHit2,
        strategy: strat,
        pop: base.pop,
        pos: base.pos,

        mAntiship: mAntishipFinal,
        bAntiship: bAntishipFinal,
        aAa: aAaFinal,
        mCool: Math.round(mCoolFinal * 10) / 10,
        aCool: Math.round(aCoolFinal * 10) / 10,
        bCool: Math.round(bCoolFinal * 10) / 10,
        mSiege: base.mSiege,
        aSiege: base.aSiege,

        mDmgPct: mDmg * 4,
        aDmgPct: aDmg * 4,
        mCoolPct: mCoolPct,
        aCoolPct: aCoolPct,
        stratLevel: strat
    };
}

// ---- 获取点数 ----
function addIoaPoints() {
    const cost = 10;
    if (window.energy < cost) { alert(`能量不足，需要 ${cost} 能量`); return; }
    window.energy -= cost;
    window.updateEnergy();
    window.ioaGlobalPoints += 1;
    if (window._currentIoaShipId) {
        renderIoaModal(window._currentIoaShipId);
    }
}

// ---- 升级强化项 ----
function upgradeIoaItem(shipId, systemKey, itemName) {
    const state = getIoaState(shipId);
    const system = state.systems[systemKey];
    const currentLevel = system[itemName] || 0;

    if (itemName === '策略强化') {
        if (currentLevel >= 1) { alert('策略强化已达最高等级！'); return; }
        if (window.ioaGlobalPoints < 20) { alert('策略强化需要 20 点强化点数'); return; }
        window.ioaGlobalPoints -= 20;
        system[itemName] = 1;
        state.version = Math.round((state.version + 0.20) * 100) / 100;
        renderIoaModal(shipId);
        return;
    }

    if (currentLevel >= 5) { alert('已达最高等级！'); return; }
    if (window.ioaGlobalPoints < 2) { alert('强化点数不足，需要 2 点'); return; }
    window.ioaGlobalPoints -= 2;
    system[itemName] = currentLevel + 1;
    state.version = Math.round((state.version + 0.02) * 100) / 100;
    renderIoaModal(shipId);
}

// ---- 重置强化 ----
function resetIoa(shipId) {
    if (!confirm('确定重置该舰船所有强化等级吗？已花费的点数将全部退还到全局点数。')) return;
    const state = getIoaState(shipId);
    let totalSpent = 0;
    for (const sys in state.systems) {
        for (const key in state.systems[sys]) {
            const lv = state.systems[sys][key];
            if (key === '策略强化') {
                totalSpent += lv * 20;
            } else {
                totalSpent += lv * 2;
            }
            state.systems[sys][key] = 0;
        }
    }
    window.ioaGlobalPoints += totalSpent;
    state.version = 1.00;
    state.currentSystem = 'm';
    renderIoaModal(shipId);
    alert(`重置成功！已退还 ${totalSpent} 点强化点数到全局。`);
}

// ---- 计算单项加成 ----
function getBonus(shipId, systemKey, itemName) {
    const state = getIoaState(shipId);
    const level = state.systems[systemKey]?.[itemName] || 0;
    const isKalisto = (shipId === 'kalisto' || shipId === 'kalisto-b');
    const isKonaraB = (shipId === 'konara-b');
    if (itemName === '伤害') return level * 4;
    if (itemName === '冷却') {
        if (isKalisto && systemKey === 'm') return level * 3;
        return level * 6;
    }
    if (itemName === '命中1') {
        if (isKonaraB || isKalisto) return level * 6;
        return level * 2;
    }
    if (itemName === '命中2') return level * 3;
    if (itemName === '暴击') return level * 16;
    if (itemName === '结构值') return level * 4;
    if (itemName === '抵抗伤害') return level * 6;
    if (itemName === '护盾值') return level * 6;
    return 0;
}

// ---- 根据系统生成详情 ----
function getSystemDetail(shipId, systemKey) {
    const stats = calcBonusStats(shipId);
    const isKonara = (shipId === 'konara' || shipId === 'konara-b');
    const isKalisto = (shipId === 'kalisto' || shipId === 'kalisto-b');
    const isKalistoB = (shipId === 'kalisto-b');
    let html = '';

    if (systemKey === 'm') {
        if (shipId === 'ioa-a') {
            html = `...艾奥A M系统...`; // 保持原有
        } else if (shipId === 'ioa-b') {
            html = `...艾奥B M系统...`;
        } else if (shipId === 'ioa-c') {
            html = `...艾奥C M系统...`;
        } else if (shipId === 'konara') {
            html = `...康纳马拉A M系统...`;
        } else if (shipId === 'konara-b') {
            html = `...康纳马拉B M系统...`;
        } else if (isKalisto) {
            const weaponName = isKalistoB ? '“超新星-白K"MK2-AT-8-820A型 反舰鱼雷' : '“超新星-白K"MK2-AT-8-700型 集束鱼雷';
            const antiship = isKalistoB ? 21200 : 18133;
            const duration = isKalistoB ? 16 : 12;
            const cool = stats.mCool;
            const singleDmg = isKalistoB ? 1600 : 350;
            const ammo = isKalistoB ? '1x8' : '4x8';
            const desc = isKalistoB ?
                '由“奥布斯蒂恩”矿业公司设计并建造的巡洋舰卡利斯托级专用武器库，由“永远的北极星投射系统”整合。可以发射“超新星-S”重型鱼雷，8个独立的箱型发射模块围绕战舰核心筒安装两组，使其拥有针对任何重型的打击能力。' :
                '由“奥布斯蒂恩”矿业公司设计并建造的巡洋舰卡利斯托级专用武器库，由“永远的北极星投射系统”整合。可以发射“超新星-C”集束鱼雷，8个独立的箱型发射模块围绕战舰核心筒安装两组，使其拥有极为强大的火力输出能力。';
            // ---- 策略修正：卡利斯托-A 为“重型弹药”，卡利斯托-B 为“重点目标” ----
            let stratName, stratDesc;
            if (isKalistoB) {
                stratName = '重点目标';
                stratDesc = '对方包含战列巡洋舰时，优先对其打击，并提高25%伤害。';
            } else {
                stratName = '重型弹药';
                stratDesc = '目标为巡洋舰时，伤害提升60%，攻击持续时间延长30%。';
            }
            html = `
                <strong>M系统：</strong>${weaponName} x1<br>
                · 对舰火力：${stats.mAntiship}/分钟 &nbsp;|&nbsp; 持续时间：${duration}秒<br>
                · 伤害类型：实弹伤害 &nbsp;|&nbsp; 弹药数×攻击次数：${ammo}<br>
                · 优先目标：大型舰船 &nbsp;|&nbsp; 冷却时间：${cool}秒<br>
                · 弹道类型：投射武器 &nbsp;|&nbsp; 锁定时间：5.0秒<br>
                · 单发伤害：${singleDmg}<br>
                · 性能介绍：${desc}<br>
                · <strong>词条：</strong><br>
                · 暴击：有15%概率对目标额外造成${stats.critDmgBonus+170}%暴击伤害（基础170%+强化加成${stats.critDmgBonus}%）<br>
                · 防空轻量弹药：打击舰载机目标时，换用轻量级弹药以换取机动性能，单发伤害额外减少335（仅对舰载机目标生效）<br>
                · 反击防空（效果同A系统）<br>
                <br>
                <strong>策略强化（${stratName}）：</strong><br>
                · ${stratDesc}<br>
                · 当前状态：${stats.strategy === 1 ? '✅ 已激活' : '❌ 未激活（需20点数）'}
            `;
        }
    } else if (systemKey === 'a') {
        if (isKalisto) {
            html = `
                <strong>A系统：</strong>AG-112UB 快速火炮 x2<br>
                · 防空火力：${stats.aAa}/分钟 &nbsp;|&nbsp; 模块属性<br>
                · 伤害类型：实弹伤害 &nbsp;|&nbsp; 弹药数×攻击次数：1x1<br>
                · 优先目标：舰载机 &nbsp;|&nbsp; 冷却时间：${stats.aCool}秒<br>
                · 弹道类型：直射武器 &nbsp;|&nbsp; 锁定时间：3.0秒<br>
                · 单发伤害：35<br>
                · 性能介绍：快速打击火炮，可以针对小型舰船目标进行快速定位和打击。<br>
                · <strong>词条：</strong>反击防空（自身未被空中目标攻击时，可以打击以同一排友方舰船为目标的对方空中目标。当自身被空中目标打击时，能够快速反击该空中目标。反击时，命中率+10%。）
            `;
        } else {
            // 其他舰船A系统
        }
    } else if (systemKey === 'armor') {
        html = `
            <strong>装甲系统：</strong><br>
            · 结构值：${stats.structure}<br>
            · 抵抗伤害：${stats.resist}<br>
            · 护盾值：${stats.shield}%<br>
            ${shipId === 'ioa-a' || shipId === 'ioa-b' || shipId === 'ioa-c' ? `· 导弹抗性：${stats.missileResist}%` : ''}
        `;
    } else if (systemKey === 'b') {
        // B系统（仅艾奥）
    }
    return html;
}

// ---- 渲染强化界面 ----
function renderIoaModal(shipId) {
    window._currentIoaShipId = shipId;
    const state = getIoaState(shipId);
    const currentSys = state.currentSystem;
    const isKonara = (shipId === 'konara' || shipId === 'konara-b');
    const isKalisto = (shipId === 'kalisto' || shipId === 'kalisto-b');

    const systemNames = {
        m: 'M系统',
        a: 'A系统',
        armor: '装甲系统'
    };
    if (!isKonara && !isKalisto) {
        systemNames.b = 'B系统';
    }

    let itemLabels = {
        m: ['伤害', '冷却', '暴击'],
        a: ['命中', '伤害', '冷却', '暴击'],
        armor: ['结构值', '抵抗伤害', '护盾值', '导弹抗性']
    };
    if (isKonara) {
        if (shipId === 'konara-b') {
            itemLabels.m = ['伤害', '冷却', '命中1', '策略强化'];
        } else {
            itemLabels.m = ['伤害', '冷却', '命中1', '命中2', '策略强化'];
        }
        itemLabels.a = ['命中1', '命中2', '伤害', '冷却'];
        itemLabels.armor = ['结构值', '抵抗伤害', '护盾值'];
        delete systemNames.b;
    } else if (isKalisto) {
        itemLabels.m = ['伤害', '冷却', '命中1', '暴击', '策略强化'];
        itemLabels.a = ['命中1', '命中2', '伤害', '冷却'];
        itemLabels.armor = ['结构值', '抵抗伤害', '护盾值'];
        delete systemNames.b;
    } else {
        // 艾奥系列
        if (shipId === 'ioa-a') {
            itemLabels.m = ['伤害', '冷却', '暴击'];
            itemLabels.a = ['命中', '伤害', '冷却', '暴击'];
            itemLabels.b = ['命中', '伤害', '冷却', '暴击'];
            itemLabels.armor = ['结构值', '抵抗伤害', '护盾值', '导弹抗性'];
        } else if (shipId === 'ioa-b') {
            itemLabels.m = ['伤害', '冷却', '暴击', '小型命中'];
            itemLabels.a = ['命中', '伤害', '冷却', '暴击'];
            itemLabels.b = ['命中', '伤害', '冷却', '暴击'];
            itemLabels.armor = ['结构值', '抵抗伤害', '护盾值', '导弹抗性'];
        } else if (shipId === 'ioa-c') {
            itemLabels.m = ['伤害', '冷却', '暴击', '大型命中'];
            itemLabels.a = ['命中', '伤害', '冷却', '暴击'];
            itemLabels.b = ['命中', '伤害', '冷却', '暴击'];
            itemLabels.armor = ['结构值', '抵抗伤害', '护盾值', '导弹抗性'];
        }
    }

    const systemData = state.systems[currentSys];
    const items = itemLabels[currentSys] || [];

    // 生成强化树
    let treeHtml = items.map((item) => {
        const level = systemData[item] || 0;
        const isMax = (item === '策略强化') ? (level >= 1) : (level >= 5);
        const costReq = (item === '策略强化') ? 20 : 2;
        const disabled = isMax || window.ioaGlobalPoints < costReq;
        let bonusText = '';
        if (currentSys !== 'armor') {
            const bonus = getBonus(shipId, currentSys, item);
            if (item === '伤害' && bonus > 0) bonusText = ` (+${bonus}%)`;
            else if (item === '冷却' && bonus > 0) {
                bonusText = ` (-${bonus}%)`;
            } else if (item === '命中1') {
                if (shipId === 'konara-b' || isKalisto) {
                    bonusText = ` (+${bonus}% 对大型舰船)`;
                } else {
                    bonusText = ` (+${bonus}%)`;
                }
            } else if (item === '命中2' && bonus > 0) {
                if (shipId === 'konara') {
                    bonusText = ` (+${bonus}% 对大型舰船)`;
                } else {
                    bonusText = ` (+${bonus}%)`;
                }
            } else if (item === '暴击' && bonus > 0) {
                bonusText = ` (+${bonus}% 暴击伤害)`;
            } else if (item === '策略强化') {
                bonusText = ` (消耗20点，满级1)`;
            }
        } else {
            if (item === '结构值') {
                const val = getBonus(shipId, currentSys, item);
                bonusText = ` (+${val}%)`;
            } else if (item === '抵抗伤害') {
                const val = getBonus(shipId, currentSys, item);
                bonusText = ` (+${val})`;
            } else if (item === '护盾值') {
                const val = getBonus(shipId, currentSys, item);
                bonusText = ` (+${val}%)`;
            }
        }
        const costText = (item === '策略强化') ? '20点' : '2点';
        return `
            <div class="ioa-tree-item">
                <span class="name">${item}${bonusText}</span>
                <span class="level">${isMax ? '已满' : 'Lv.'+level+'/5'}</span>
                <button class="btn-upgrade" ${disabled ? 'disabled' : ''} onclick="upgradeIoaItem('${shipId}','${currentSys}','${item}')">
                    ${isMax ? '已满' : '升级 ('+costText+')'}
                </button>
            </div>
        `;
    }).join('');

    const stats = calcBonusStats(shipId);

    // 效果摘要
    let effectHtml = '';
    if (currentSys === 'm') {
        let extra = '';
        if (isKonara) {
            // 康纳马拉M摘要略
        } else if (isKalisto) {
            extra = ` &nbsp;|&nbsp; <span style="color:#88ccff;">大型命中：+${stats.mHit1}%</span> &nbsp;|&nbsp; <span style="color:#ff6a00;">暴击伤害：+${stats.critDmgBonus}%</span>`;
            if (stats.strategy === 1) {
                extra += ` &nbsp;|&nbsp; <span style="color:#ffaa44;">策略已激活</span>`;
            }
        } else {
            // 艾奥
        }
        effectHtml = `
            <div style="background:#0d1116;border:1px solid #1f2833;border-radius:4px;padding:8px 12px;margin:8px 0;">
                <strong style="color:#b0c7d6;">当前M系统强化效果：</strong><br>
                <span style="color:#ffaa44;">伤害加成：+${stats.mDmgPct}%</span> &nbsp;|&nbsp;
                <span style="color:#88ccff;">冷却缩减：-${stats.mCoolPct}%</span>
                ${extra}
            </div>
        `;
    } else if (currentSys === 'a') {
        let extra = '';
        if (isKonara || isKalisto) {
            extra = ` &nbsp;|&nbsp; <span style="color:#88ccff;">导弹/鱼雷命中：+${stats.aHit1}%</span> &nbsp;|&nbsp; <span style="color:#88ccff;">舰载机命中：+${stats.aHit2}%</span>`;
        }
        effectHtml = `
            <div style="background:#0d1116;border:1px solid #1f2833;border-radius:4px;padding:8px 12px;margin:8px 0;">
                <strong style="color:#b0c7d6;">当前A系统强化效果：</strong><br>
                <span style="color:#ffaa44;">伤害加成：+${stats.aDmgPct}%</span> &nbsp;|&nbsp;
                <span style="color:#88ccff;">冷却缩减：-${stats.aCoolPct}%</span>
                ${extra}
            </div>
        `;
    } else if (currentSys === 'armor') {
        const armorItems = itemLabels.armor;
        const armorLevels = armorItems.map(item => {
            const lv = systemData[item] || 0;
            return `${item}: Lv.${lv}`;
        }).join(' &nbsp;|&nbsp; ');
        effectHtml = `
            <div style="background:#0d1116;border:1px solid #1f2833;border-radius:4px;padding:8px 12px;margin:8px 0;">
                <strong style="color:#b0c7d6;">当前装甲等级：</strong><br>
                <span style="color:#ffaa44;">${armorLevels}</span>
            </div>
        `;
    } else if (currentSys === 'b') {
        effectHtml = `<div>B系统强化效果略</div>`;
    }

    const versionClass = state.version >= 2.00 ? 'gold' : '';

    let shipName;
    if (shipId === 'konara') shipName = '康纳马拉混沌级-A';
    else if (shipId === 'konara-b') shipName = '康纳马拉混沌级-B';
    else if (shipId === 'kalisto') shipName = '卡利斯托-A';
    else if (shipId === 'kalisto-b') shipName = '卡利斯托-B';
    else if (shipId === 'ioa-a') shipName = '艾奥-A型';
    else if (shipId === 'ioa-b') shipName = '艾奥-B型';
    else if (shipId === 'ioa-c') shipName = '艾奥-C型';
    else shipName = '未知舰船';

    // 属性面板
    const statsHtml = `
        <div class="ioa-stats" style="margin-top:8px;">
            <div><span class="stat-label">站位：</span><span class="stat-value">${stats.pos}</span></div>
            <div><span class="stat-label">单舰人口：</span><span class="stat-value">${stats.pop}</span></div>
            <div><span class="stat-label">防空火力：</span><span class="stat-value">${stats.aa} /分钟</span></div>
            <div><span class="stat-label">对舰火力：</span><span class="stat-value">${stats.antiship} /分钟</span></div>
            <div><span class="stat-label">结构值：</span><span class="stat-value">${stats.structure}</span></div>
            <div><span class="stat-label">服役限制：</span><span class="stat-value">8</span></div>
            <div><span class="stat-label">抵抗伤害：</span><span class="stat-value">${stats.resist}</span></div>
            <div><span class="stat-label">护盾值：</span><span class="stat-value">${stats.shield}%</span></div>
            ${isKalisto ? `<div><span class="stat-label">暴击率：</span><span class="stat-value">${stats.critRate}%</span></div>` : ''}
            ${!isKonara && !isKalisto ? `<div><span class="stat-label">暴击率：</span><span class="stat-value">${stats.critRate}%</span></div>` : ''}
            ${(isKonara || isKalisto) ? `<div><span class="stat-label">策略强化：</span><span class="stat-value">${stats.strategy === 1 ? '✅ 已激活' : '未激活'}</span></div>` : ''}
        </div>
    `;

    const detailHtml = getSystemDetail(shipId, currentSys);

    const html = `
        <div class="bp-panel" style="width:100%;height:100%;">
            <div class="bp-header">
                <span class="bp-title" style="color:#ff8c2e;">🔧 ${shipName} · 强化配置</span>
                <button class="bp-back" id="ioaBackBtn">← 返回</button>
            </div>
            <div style="display:flex;gap:12px;flex:1;min-height:300px;">
                <div style="width:120px;flex-shrink:0;background:rgba(10,14,18,0.6);border-radius:8px;border:1px solid #1a222b;overflow-y:auto;padding:4px 0;">
                    ${Object.keys(systemNames).map(key => `
                        <div class="ioa-system ${key === currentSys ? 'active' : ''}" style="padding:8px 12px;cursor:pointer;border-bottom:1px solid #1a222b;color:#b0c7d6;transition:0.15s;${key === currentSys ? 'background:#1f3340;border-left:3px solid #00c8ff;color:#88ccff;' : ''}" onclick="switchIoaSystem('${shipId}','${key}')">${systemNames[key]}</div>
                    `).join('')}
                </div>
                <div style="flex:1;background:rgba(10,14,18,0.4);border-radius:8px;border:1px solid #1a222b;padding:12px 16px;display:flex;flex-direction:column;overflow-y:auto;">
                    <div style="overflow-y:auto;flex:1;">
                        ${treeHtml}
                        ${effectHtml}
                    </div>
                    ${statsHtml}
                    <div style="margin-top:8px;border-top:1px solid #1f2833;padding-top:8px;max-height:150px;overflow-y:auto;font-size:0.85rem;color:#b0c7d6;">
                        ${detailHtml}
                    </div>
                </div>
            </div>
            <div style="margin-top:12px;display:flex;gap:12px;align-items:center;border-top:1px solid #1f2833;padding-top:10px;flex-wrap:wrap;">
                <span style="color:#6a8a9e;">版本号：<span class="${versionClass}" style="font-weight:700;color:${state.version>=2.00?'#ffd700':'#88ccff'};">${state.version.toFixed(2)}</span></span>
                <span style="color:#6a8a9e;">全局强化点数：<span style="color:#ffaa44;font-weight:700;">${window.ioaGlobalPoints}</span></span>
                <button class="btn-get-points" onclick="addIoaPoints()" style="background:#00c8ff;border:none;color:#000;padding:4px 16px;border-radius:4px;cursor:pointer;font-weight:600;">+1 点数 (10能量)</button>
                <button class="btn-reset" onclick="resetIoa('${shipId}')" style="background:#cc3344;border:none;color:#fff;padding:4px 16px;border-radius:4px;cursor:pointer;font-weight:600;">🔄 重置</button>
            </div>
        </div>
    `;

    const leftPanel = document.getElementById('leftPanel');
    leftPanel.innerHTML = html;
    leftPanel.dataset.mode = 'ioa';

    document.getElementById('ioaBackBtn').addEventListener('click', function() {
        window.resetToWelcome();
    });
}

// ---- 切换系统 ----
function switchIoaSystem(shipId, systemKey) {
    const state = getIoaState(shipId);
    state.currentSystem = systemKey;
    renderIoaModal(shipId);
}

// ---- 打开强化界面 ----
function openIoaModal(shipId) {
    console.log(`openIoaModal 被调用，舰船: ${shipId}`);
    const leftPanel = document.getElementById('leftPanel');
    if (leftPanel.dataset.mode === 'blueprint') {
        window.resetToWelcome();
    }
    setTimeout(() => {
        renderIoaModal(shipId);
    }, 20);
}

// ---- 能量兑换 ----
function exchangeEnergyToPoints() {
    if (window.energy < 3) {
        alert('能量不足，需要 3 能量');
        return;
    }
    window.energy -= 3;
    window.updateEnergy();
    window.ioaGlobalPoints += 2;
    if (window._allocData) {
        document.getElementById('btnSupply').click();
    }
    if (window._currentIoaShipId) {
        renderIoaModal(window._currentIoaShipId);
    }
    alert('兑换成功！获得 2 个全局升级点');
}

// ---- 暴露全局接口 ----
window.openIoaModal = openIoaModal;
window.addIoaPoints = addIoaPoints;
window.upgradeIoaItem = upgradeIoaItem;
window.switchIoaSystem = switchIoaSystem;
window.exchangeEnergyToPoints = exchangeEnergyToPoints;
window.resetIoa = resetIoa;
window.calcBonusStats = calcBonusStats;

console.log('🚀 ships.js 已加载（含卡利斯托-A/B，策略已修正）');