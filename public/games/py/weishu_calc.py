# -*- coding: utf-8 -*-
# ============================================================
#  weishu_calc.py —— 卫戍协议 · 拉格朗日战斗计算引擎
#  纯计算程序（无 DOM / 无网络依赖）：
#  · 在浏览器中通过 Pyodide 运行（weishu.js 调用）
#  · 也可独立运行自检：python weishu_calc.py --test
#  数据由 JS 传入（舰船/敌人/强化参数），本模块只负责"计算规则"：
#  伤害结算（实弹装甲/能量护盾）、锁定序列（直射前排优先/投射大船
#  优先/防空后排优先）、波次生成、回合资金、补给池抽取、强化抽取。
# ============================================================
import random

# ---------------- 锁定序列（拉格朗日规则，属于计算规则） ----------------
LOCK_SEQUENCE = [
    ('carrier', '航空母舰'),
    ('battlecruiser', '战列巡洋舰'),
    ('cruiser', '巡洋舰'),
    ('destroyer', '驱逐舰'),
    ('frigate', '护卫舰'),
    ('corvette', '护航艇'),
]

ZONE_ORDER_DIRECT = ('front', 'mid', 'back')   # 直射：前排→中排→后排
ZONE_ORDER_AIR = ('back', 'mid', 'front')      # 防空：优先后排战机/护航艇

# ============================================================
#  1. 伤害结算（拉格朗日）
# ============================================================
def calc_damage(dmg, dmg_type, armor, shield):
    """实弹受装甲抵抗（每1点装甲减1伤害，最低1）；能量先耗护盾，
    破盾后剩余伤害全额生效。返回 [实际伤害, 剩余护盾]"""
    dmg = float(dmg)
    if dmg_type == 'energy':
        shield = float(shield or 0)
        if shield > 0:
            absorbed = min(shield, dmg)
            shield -= absorbed
            return [dmg - absorbed, shield]
        return [dmg, 0.0]
    armor = float(armor or 0)
    return [max(1.0, dmg - armor), float(shield or 0)]

# ============================================================
#  2. 锁定目标（拉格朗日锁定规则）
# ============================================================
def acquire_target(tower, enemies):
    """按武器类型与锁定序列选择目标，返回目标在 enemies 中的下标；
    无可攻击目标返回 -1。tower 需含 weapon/range/col；
    enemy 需含 cls/zone/col/hp。"""
    if not enemies:
        return -1
    weapon = tower.get('weapon', 'direct')
    tcol = float(tower.get('col', 0))
    trange = float(tower.get('range', 99))

    def in_range(en):
        return abs(float(en.get('col', 0)) - tcol) <= trange

    if weapon == 'projectile':
        # 投射：按锁定序列（大船优先），不分站位
        candidates = None
        for cls, _label in LOCK_SEQUENCE:
            found = [i for i, e in enumerate(enemies) if e.get('cls') == cls]
            if found:
                candidates = found
                break
        if candidates is None:
            candidates = list(range(len(enemies)))
    else:
        # 直射/防空：按站位排优先
        zone_order = ZONE_ORDER_AIR if weapon == 'air' else ZONE_ORDER_DIRECT
        candidates = None
        for zone in zone_order:
            found = [i for i, e in enumerate(enemies) if e.get('zone') == zone]
            if found:
                candidates = found
                break
        if candidates is None:
            candidates = list(range(len(enemies)))

    # 射程过滤（范围内优先，否则取最近）
    in_range_list = [i for i in candidates if in_range(enemies[i])]
    pool = in_range_list if in_range_list else candidates
    # 同优先级内打低血量
    best = pool[0]
    for i in pool[1:]:
        if enemies[i].get('hp', 0) < enemies[best].get('hp', 0):
            best = i
    return best

# ============================================================
#  3. 战斗帧结算（Python 计算核心）
# ============================================================
def tick_combat(towers, enemies, params, now=None):
    """一帧战斗结算：所有塔按锁定规则攻击。
    towers: { 'r,c': {dmg,dmgType,weapon,range,col,lastFireTime,fireRate} }
    enemies: [ {cls,zone,col,hp,maxHp,armor,shield,...} ]
    params: { dmgMul, directMul, projMul, airMul, eliteKey }
    now: 毫秒时间戳（默认取当前时间）
    返回 { 'hits': [ {'key','idx','dmg','dealt','killed'} ], 'killed': [idx...] }
    """
    import time
    if now is None:
        now = time.time() * 1000
    hits = []
    killed = []
    params = params or {}
    dmg_mul = float(params.get('dmgMul', 1))
    direct_mul = float(params.get('directMul', 1))
    proj_mul = float(params.get('projMul', 1))
    air_mul = float(params.get('airMul', 1))
    elite_key = params.get('eliteKey')

    for key, t in towers.items():
        if not t:
            continue
        last = float(t.get('lastFireTime', 0))
        rate = float(t.get('fireRate', 1))
        if rate <= 0:
            rate = 1
        if now - last < 1000.0 / rate:
            continue
        idx = acquire_target(t, enemies)
        if idx < 0:
            continue
        # 计算伤害
        base = float(t.get('dmg', 0)) * dmg_mul
        wtype = t.get('weapon', 'direct')
        if wtype == 'direct':
            base *= direct_mul
        elif wtype == 'projectile':
            base *= proj_mul
        elif wtype == 'air':
            base *= air_mul
        if elite_key and elite_key == key:
            base *= 1.7  # 快刀乱麻：全场最高攻击舰船 +70%
        en = enemies[idx]
        # 防空武器打击战机/护航艇：防空命中率（效率×基础修正）+ 对空增伤
        is_air = en.get('cls') in ('fighter', 'corvette')
        if wtype == 'air' and is_air:
            boost = aa_damage_boost(float(t.get('dmg', 1)), float(t.get('aaAmmo', 0)))
            base *= boost
            eff = aa_efficiency(float(t.get('aaWeapons', 1)))
            base_hit = float(t.get('aaHitFighter', 0.75)) if en.get('cls') == 'fighter' else float(t.get('aaHitCorvette', 0.9))
            hit_rate = aa_hit_rate(base_hit, eff, 1, float(en.get('dodge', 0)), 0, 0)
        else:
            hit_rate = hit_roll(0.85, 0, en.get('dodge', 0.05), 0)
        if random.random() > hit_rate:
            continue
        dealt, new_shield = calc_damage(base, t.get('dmgType', 'physical'),
                                        en.get('armor', 0), en.get('shield', 0))
        # 不修改传入数据，返回结果由 JS 应用
        hits.append({
            'key': key,
            'idx': idx,
            'dmg': base,
            'dealt': dealt,
            'newShield': new_shield,
            'killed': (en.get('hp', 0) - dealt) <= 0,
        })
        if en.get('hp', 0) - dealt <= 0:
            killed.append(idx)
    return {'hits': hits, 'killed': killed}

# ============================================================
#  4. 波次生成（卫戍协议：随机两组势力）
# ============================================================
def pick_factions(faction_count, rng=None):
    """随机抽取两个不同势力下标"""
    r = rng or random
    if faction_count <= 1:
        return [0]
    f1 = r.randrange(faction_count)
    f2 = r.randrange(faction_count)
    while f2 == f1:
        f2 = r.randrange(faction_count)
    return [f1, f2]

def generate_enemy_squad(faction, wave, strat, hp_mul=1.0, rng=None):
    """按势力生成敌舰队列。
    faction: { squads: [ {cls,zone,hp,armor,shield,dmgType,weapon,reward} ] }
    strat: 'aegis' 时敌人生命 -20%（天衣无缝）
    返回 [ {cls,zone,hp,maxHp,armor,shield,dmgType,weapon,row,col,speed,reward,isFighter} ]
    """
    r = rng or random
    wave = int(wave)
    mul = 1.0 + (wave - 1) * 0.18
    hp_mul = float(hp_mul) * (0.8 if strat == 'aegis' else 1.0)
    squads = [s for s in faction.get('squads', [])]
    r.shuffle(squads)
    picked = squads[: 2 + min(1, wave // 3)]
    zone_rows = {'front': (0, 1), 'mid': (2, 3), 'back': (4, 5)}
    out = []
    for s in picked:
        count = 3 if s.get('cls') in ('corvette', 'fighter') else 1
        for i in range(count):
            lo, hi = zone_rows.get(s.get('zone', 'mid'), (2, 3))
            row = r.randrange(lo, hi + 1)
            hp = float(s.get('hp', 100)) * mul * hp_mul
            cls = s.get('cls', 'frigate')
            out.append({
                'cls': cls,
                'zone': s.get('zone', 'mid'),
                'hp': hp,
                'maxHp': hp,
                'armor': float(s.get('armor', 0)),
                'shield': float(s.get('shield', 0)),
                'dmgType': s.get('dmgType', 'physical'),
                'weapon': s.get('weapon', 'direct'),
                'row': row,
                'col': -0.8 - i * 0.6,
                'speed': 0.35 if cls in ('carrier', 'battlecruiser') else 0.5,
                'reward': float(s.get('reward', 10)),
                'isFighter': cls in ('fighter', 'corvette'),
            })
    return out

# ============================================================
#  5. 卫戍协议经济与抽取
# ============================================================
def next_round_funds(wave):
    """回合资金：入门协议 第1回合5、第2回合13、之后每回合10"""
    wave = int(wave)
    if wave <= 1:
        return 5
    if wave == 2:
        return 13
    return 10

def roll_pool(level, blueprints, rng=None):
    """补给池 3 选 1（不高于当前补给等级），返回蓝图对象列表"""
    r = rng or random
    avail = [b for b in blueprints if int(b.get('tier', 1)) <= int(level)]
    if not avail:
        return []
    r.shuffle(avail)
    return avail[:3]

def roll_upgrades(pool, rng=None):
    """回合强化三选一，返回从强化池随机抽出的 3 个对象"""
    r = rng or random
    cp = list(pool)
    r.shuffle(cp)
    return cp[:3]

def upgrade_wave_active(wave):
    """回合强化触发波次：3/6/10/12/14"""
    return int(wave) in (3, 6, 10, 12, 14)

def supply_level(wave):
    """当前补给等级 = 波次/2 + 1（上限6）"""
    return min(6, int(wave) // 2 + 1)

# ============================================================
#  自检（python weishu_calc.py --test）
# ============================================================
def _self_test():
    ok = 0
    fail = 0

    def T(name, cond):
        nonlocal ok, fail
        if cond:
            ok += 1
            print('  [PASS]', name)
        else:
            fail += 1
            print('  [FAIL]', name)

    print('== 伤害结算 ==')
    d, s = calc_damage(14, 'physical', 5, 0)
    T('实弹受装甲：14-5=9', d == 9 and s == 0)
    d, s = calc_damage(50, 'energy', 8, 20)
    T('能量破盾：50-20=30', d == 30 and s == 0)
    d, s = calc_damage(50, 'energy', 8, 0)
    T('能量无盾全额', d == 50)
    d, s = calc_damage(3, 'physical', 10, 0)
    T('实弹最低1', d == 1)

    print('== 锁定规则 ==')
    enemies = [
        {'cls': 'frigate', 'zone': 'front', 'col': 2, 'hp': 100},
        {'cls': 'cruiser', 'zone': 'mid', 'col': 3, 'hp': 300},
    ]
    t = {'weapon': 'direct', 'range': 5, 'col': 0}
    T('直射优先前排', acquire_target(t, enemies) == 0)
    enemies = [
        {'cls': 'frigate', 'zone': 'front', 'col': 2, 'hp': 100},
        {'cls': 'battlecruiser', 'zone': 'back', 'col': 4, 'hp': 700},
    ]
    t = {'weapon': 'projectile', 'range': 5, 'col': 0}
    T('投射按锁定序列打战巡', acquire_target(t, enemies) == 1)
    enemies = [
        {'cls': 'fighter', 'zone': 'back', 'col': 3, 'hp': 60},
        {'cls': 'cruiser', 'zone': 'mid', 'col': 3, 'hp': 300},
    ]
    t = {'weapon': 'air', 'range': 5, 'col': 0}
    T('防空优先后排战机', acquire_target(t, enemies) == 0)
    enemies = [{'cls': 'cruiser', 'zone': 'mid', 'col': 8, 'hp': 300}]
    t = {'weapon': 'direct', 'range': 2, 'col': 0}
    T('超出射程取最近', acquire_target(t, enemies) == 0)

    print('== 战斗帧结算 ==')
    towers = {
        '0,0': {'dmg': 14, 'dmgType': 'physical', 'weapon': 'direct',
                'range': 5, 'col': 0, 'lastFireTime': 0, 'fireRate': 1},
    }
    enemies = [
        {'cls': 'frigate', 'zone': 'front', 'col': 2, 'hp': 100,
         'maxHp': 100, 'armor': 5, 'shield': 0},
    ]
    res = tick_combat(towers, enemies, {'dmgMul': 1, 'directMul': 1,
                                        'projMul': 1, 'airMul': 1})
    T('tick命中1次', len(res['hits']) == 1)
    T('tick伤害=9（14-5）', abs(res['hits'][0]['dealt'] - 9) < 0.001)
    T('未击杀', len(res['killed']) == 0)
    enemies[0]['hp'] = 5
    res = tick_combat(towers, enemies, {'dmgMul': 1, 'directMul': 1,
                                        'projMul': 1, 'airMul': 1})
    T('残血击杀', len(res['killed']) == 1)

    print('== 经济与抽取 ==')
    T('回合资金 1→5', next_round_funds(1) == 5)
    T('回合资金 2→13', next_round_funds(2) == 13)
    T('回合资金 3→10', next_round_funds(3) == 10)
    T('强化波次 3/6/10/12/14', all(upgrade_wave_active(w) for w in (3, 6, 10, 12, 14))
      and not upgrade_wave_active(4))
    T('补给等级 Lv1→2', supply_level(1) == 1 and supply_level(3) == 2 and supply_level(12) == 6)
    r = random.Random(42)
    bps = [{'id': 'a', 'tier': 1}, {'id': 'b', 'tier': 1}, {'id': 'c', 'tier': 1},
           {'id': 'd', 'tier': 2}, {'id': 'e', 'tier': 3}]
    pool = roll_pool(1, bps, rng=r)
    T('补给池3张且不高于等级', len(pool) == 3 and all(b['tier'] <= 1 for b in pool))
    f = pick_factions(6, rng=r)
    T('随机两组不同势力', len(f) == 2 and f[0] != f[1])
    squad = generate_enemy_squad(
        {'squads': [{'cls': 'frigate', 'zone': 'front', 'hp': 100, 'armor': 5,
                     'shield': 0, 'dmgType': 'physical', 'weapon': 'direct', 'reward': 8}]},
        1, 'aegis', rng=r)
    T('天衣无缝敌人生命-20%（80）', abs(squad[0]['hp'] - 80) < 0.001)
    squad = generate_enemy_squad(
        {'squads': [{'cls': 'corvette', 'zone': 'front', 'hp': 50, 'armor': 2,
                     'shield': 0, 'dmgType': 'physical', 'weapon': 'projectile', 'reward': 5}]},
        1, None, rng=r)
    T('护航艇生成3艘', len(squad) == 3)

    print('\n结果: %d 通过 / %d 失败' % (ok, fail))
    return fail == 0


if __name__ == '__main__':
    import sys
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass
    if '--test' in sys.argv:
        sys.exit(0 if _self_test() else 1)
    else:
        print('卫戍协议 Python 计算引擎（供 Pyodide 调用）')
        print('自检: python weishu_calc.py --test')


# ============================================================
#  武器计算（参照拉格朗日武器计算文档）
# ============================================================
def hit_roll(base_hit, hit_bonus, dodge, penalty):
    """对舰实际命中率 = 基础命中率 × (1+强化命中加成-对方闪避率-命中减益)
    极限值：最低10%，最高95%"""
    rate = base_hit * (1 + hit_bonus - dodge - penalty)
    return max(0.10, min(0.95, rate))

def intercept_rate(interceptors, counter_rate):
    """总拦截率 = 1 - ∏(1-单舰拦截率)，反拦截后再乘 (1-反拦截率)
    interceptors: 各拦截船拦截率列表"""
    total = 1.0
    for r in interceptors:
        total *= (1 - r)
    rate = 1 - total
    if counter_rate:
        rate *= (1 - counter_rate)
    return rate


# ============================================================
#  防空计算（参照拉格朗日防空机制文档）
#  三种主动防空类型：全场防空(full)/半场防空(half)/同排防空(row)
#  + 反击防空(self)/灵活防空(flex)
#  优先打击入侵我方空域的敌方空中单位，随后打击敌方空域
# ============================================================
def aa_lock(tower, enemies):
    """防空锁定：按防空范围类型选择目标，返回目标索引（-1无目标）。
    tower: { aaType, col, row, range }
    aaType: full=全场防空 / half=半场防空(我方空域) / row=同排防空
            self=反击防空(自身周边) / flex=反击防空转同排防空
    敌方空中单位：fighter / corvette；防空范围内优先空中单位，其次其他单位。
    优先打击顺序：我方空域(row>=4) → 交战区(row2-3) → 敌方空域(row<2)
    """
    aa_type = tower.get('aaType', 'row')
    col = float(tower.get('col', 0))
    row = float(tower.get('row', 2))
    rng = float(tower.get('range', 5))

    def in_aa_range(e):
        er = float(e.get('row', 0))
        if abs(float(e.get('col', 0)) - col) > rng:
            return False
        if aa_type == 'full':
            return True                      # 全场防空：覆盖双方所有空域
        if aa_type == 'half':
            return er >= 4                   # 半场防空：敌方进入我方空域
        if aa_type == 'row':
            return abs(er - row) < 1         # 同排防空
        if aa_type == 'self':
            return abs(er - row) <= 0.5      # 反击防空：自身周边
        if aa_type == 'flex':
            return abs(er - row) <= 0.5 or abs(er - row) < 1  # 灵活：自身→同排
        return False

    fighters = [e for e in enemies if e.get('cls') in ('fighter', 'corvette')]
    others = [e for e in enemies if e.get('cls') not in ('fighter', 'corvette')]

    def priority(e):
        er = float(e.get('row', 0))
        return 0 if er >= 4 else (1 if er >= 2 else 2)

    pool = [e for e in fighters if in_aa_range(e)]
    if not pool:
        pool = [e for e in others if in_aa_range(e)]
    if not pool:
        return -1
    pool.sort(key=lambda e: (priority(e), float(e.get('row', 0))))
    return enemies.index(pool[0])


# ============================================================
#  防空计算补充（参照防空计算文档）
#  1) 对空增伤比例：对空增伤比 = 1 + 防空特种弹药值 / 基础单发伤害
#  2) 防空协同效率：按武器安装数（1→100%...6→30%）
#  3) 防空实际命中率 = 基础命中 × 防空协同效率 ×（1+加成-闪避-减益+己方增益）
# ============================================================
def aa_damage_boost(dph, special_ammo=0):
    """对空增伤比 = 1 + 防空特种弹药值 / 基础单发伤害（默认1）"""
    if dph <= 0:
        return 1.0
    return 1.0 + float(special_ammo or 0) / dph

def aa_efficiency(weapon_count):
    """防空协同效率：×1=100% ×2=80% ×3=70% ×4=60% ×5=45% ×6=30%（超过6按30%）"""
    table = {1: 1.0, 2: 0.8, 3: 0.7, 4: 0.6, 5: 0.45}
    n = int(weapon_count or 1)
    return table.get(n, 0.30)

def aa_hit_rate(base_hit, efficiency, hit_mod, dodge=0, bonus=0, penalty=0):
    """防空实际命中率 = 基础命中率 × 防空协同效率 ×（1+强化命中加成-对方闪避-命中减益+己方增益）
    极限 10%~95%"""
    rate = base_hit * efficiency * (1 + bonus - dodge - penalty)
    return max(0.10, min(0.95, rate))

def aa_damage(dph, special_ammo, base_dph=None):
    """防空单发伤害 = 实际单发伤害 × 对空增伤比
    增伤比 = 1 + 防空特种弹药值 / 基础单发伤害（文档示例：基础10+特种5→1.5，实际12→18）"""
    boost = aa_damage_boost(base_dph if base_dph is not None else dph, special_ammo)
    return dph * boost
