# -*- coding: utf-8 -*-
# ============================================================
#  enhance_calc.py —— 强化系统数据处理引擎（纯计算，无 DOM）
#  供 Pyodide 在浏览器运行；本文件不得包含会 sys.exit 的自测（见 enhance_calc_test.py）
#  负责：武器系统合计（不互斥）/ 火力DPM / 强化乘数 / 模块同分类互斥
# ============================================================

import re


def weapon_totals(weapons):
    """全部武器合计（武器系统不互斥，全部计入）"""
    t = {'damage': 0, 'cycle': 0, 'lockOn': 0, 'rounds': 0, 'cooldown': 0, 'duration': 0, 'weapons': 0}
    for w in weapons:
        for k in ('damage', 'cycle', 'lockOn', 'rounds', 'cooldown', 'duration'):
            v = w.get(k)
            if v is not None:
                t[k] += float(v)
        t['weapons'] += 1
    return t


def firepower_dpm(weapons):
    """火力 DPM（反舰/防空/攻城），全部武器求和"""
    f = {'antiShip': 0, 'antiAir': 0, 'siege': 0}
    for w in weapons:
        f['antiShip'] += float(w.get('dpmShip') or 0)
        f['antiAir'] += float(w.get('dpmAA') or 0)
        f['siege'] += float(w.get('dpmSiege') or 0)
    return f


def enhanced_weapon(w, fire_mul, aa_mul, siege_mul):
    """单件武器强化后数值（返回带 Boost 字段的副本）"""
    d = dict(w)
    for k, mul in (('damage', fire_mul), ('dpmShip', fire_mul), ('dpmAA', aa_mul), ('dpmSiege', siege_mul)):
        if k in d and d[k] is not None:
            d[k + 'Boost'] = round(float(d[k]) * mul)
    return d


def compute_enhancement(systems, levels):
    """强化乘数计算
    systems: [{name, techs:[{name, max, effects:[{type, action, value}]}]}]
    levels:  {系统名: {科技名: 等级}}
    """
    acc = {'dmg': 0, 'aa': 0, 'siege': 0, 'cd': 0, 'hit': 0, 'crit': 0,
           'hp': 0, 'phys': 0, 'energy': 0, 'cruise': 0, 'warp': 0,
           'atkSpeed': 0, 'freq': 0, 'dur': 0,
           'hpAdd': 0, 'physAdd': 0, 'energyAdd': 0}
    for sys in systems:
        for t in sys.get('techs', []):
            lv = (levels.get(sys.get('name', ''), {}) or {}).get(t.get('name', ''), 0) or 0
            if lv <= 0:
                continue
            tmax = float(t.get('max') or 1) or 1
            for e in t.get('effects', []):
                act = e.get('action', '')
                typ = e.get('type', '')
                # 总排除（与 JS 降级版 enhance.js 同词表）：战斗机制类效果两边都不计
                if re.search(r'集火|战略打击|子系统暴击|被武器命中|被导弹|被鱼雷|失效|自动维修|'
                             r'拦截|锁定|目标选择|飞行时间|闪避|反击|警戒|战斗|站位|撤退|隐藏|'
                             r'伪装|干扰|探测|识别', typ):
                    continue
                try:
                    raw = float(e.get('value') or 0)
                except (TypeError, ValueError):
                    continue
                if raw == 0:
                    continue
                if act in ('比例加成', '比例减少'):
                    sign = -1.0 if act == '比例减少' else 1.0
                    per = sign * raw * lv / tmax
                    if '受到' in typ or '被武器' in typ or '被命中' in typ or '被拦截' in typ:
                        continue
                    abs_v = abs(per)
                    dir_v = 1
                    if '降低' in typ or '减少' in typ:
                        if '冷却' in typ or '持续时间' in typ or '攻击间隔' in typ:
                            dir_v = 1
                        else:
                            dir_v = -1
                    if '攻城' in typ: acc['siege'] += abs_v * dir_v
                    elif '防空' in typ: acc['aa'] += abs_v * dir_v
                    elif '冷却' in typ: acc['cd'] += abs_v * dir_v
                    elif '暴击' in typ: acc['crit'] += abs_v * dir_v
                    elif '持续时间' in typ: acc['dur'] += per
                    elif '攻击间隔' in typ: acc['atkSpeed'] += abs_v * dir_v
                    elif '频率' in typ or '每轮攻击' in typ or '额外射击' in typ: acc['freq'] += abs_v * dir_v
                    elif '命中' in typ: acc['hit'] += abs_v * dir_v
                    elif '生命' in typ or '结构值' in typ: acc['hp'] += abs_v * dir_v
                    elif '装甲' in typ or '抗性' in typ:
                        if '能量' in typ: acc['energy'] += abs_v * dir_v
                        else: acc['phys'] += abs_v * dir_v
                    elif '巡航' in typ: acc['cruise'] += abs_v * dir_v
                    elif '曲速' in typ: acc['warp'] += abs_v * dir_v
                    elif '伤害' in typ: acc['dmg'] += abs_v * dir_v
                elif '增加' in act or '减少' in act:
                    # 绝对加成（对齐 enhance.js L360-367）：此前被整段跳过
                    add = (-raw if '减' in act else raw) * lv / tmax
                    if '装甲' in typ or '抗性' in typ or '物理抵抗' in typ:
                        if '能量' in typ:
                            acc['energyAdd'] += add
                        else:
                            acc['physAdd'] += add
                    elif '生命' in typ or '结构值' in typ:
                        acc['hpAdd'] += add
                    elif '伤害' in typ:
                        # 效果值为百分点（如「伤害+X%」），直接累加，勿再 /100
                        acc['dmg'] += add
    # 暴击/攻速/频率近似计入伤害倍率（与 JS 降级版 enhance.js L372-378 一致；
    # 命中率 hit 与 DPM 无简单折算，仅保留计算）
    crit_m = 1 + acc['crit'] / 100
    atk_m = 1 + acc['atkSpeed'] / 100
    freq_m = 1 + acc['freq'] / 100
    return {
        'fireMul': (1 + acc['dmg'] / 100) * crit_m * atk_m * freq_m,
        'aaMul': (1 + (acc['dmg'] + acc['aa']) / 100) * crit_m * atk_m * freq_m,
        'siegeMul': (1 + (acc['dmg'] + acc['siege']) / 100) * crit_m * atk_m * freq_m,
        'cdMul': 1 - acc['cd'] / 100,
        'hpMul': 1 + acc['hp'] / 100,
        'hpAdd': acc['hpAdd'],
        'physMul': 1 + acc['phys'] / 100,
        'physAdd': acc['physAdd'],
        'energyMul': 1 + acc['energy'] / 100,
        'energyAdd': acc['energyAdd'],
        'cruiseMul': 1 + acc['cruise'] / 100,
        'warpMul': 1 + acc['warp'] / 100,
        'durMul': 1 + acc['dur'] / 100,
    }


def module_groups(systems, installed=None):
    """超主力舰模块：同分类（M/A/B/C/D/E）只能安装1个
    systems: {系统名: {weapons: [{name, option, ...}]}}
    installed: {分类: option}（已安装的模块，缺省取每类第一个=初始）
    """
    installed = installed or {}
    groups = {}
    for sys_name, sys in systems.items():
        for w in sys.get('weapons', []):
            opt = w.get('option') or w.get('name') or ''
            m = re.match(r'^([MABCDE])', opt)
            g = m.group(1) if m else '?'
            groups.setdefault(g, []).append({'opt': opt, 'sys': sys_name, 'weapon': w})
    result = []
    for g in sorted(groups):
        lst = groups[g]
        chosen = installed.get(g) or lst[0]['opt']
        result.append({
            'cls': g,
            'chosen': chosen,
            'options': [{'opt': x['opt'], 'sys': x['sys'], 'selected': x['opt'] == chosen} for x in lst],
        })
    return result


# ============================================================
#  自检（python enhance_calc.py --test）
# ============================================================

# ---------------------------------------------------------------------------
# 自测已移出到 enhance_calc_test.py。
# 原因：Pyodide 的 runPythonAsync 执行本文件时 __name__ == '__main__'，
# 若在此处内联自测并 sys.exit()，会让浏览器端 Python 引擎初始化失败、
# 静默降级为 JS 引擎。请勿把自测放回本文件。
# ---------------------------------------------------------------------------
