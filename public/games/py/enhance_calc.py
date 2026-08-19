# -*- coding: utf-8 -*-
# ============================================================
#  enhance_calc.py —— 强化系统数据处理引擎（纯计算，无 DOM）
#  供 Pyodide 在浏览器运行；也可独立运行（python enhance_calc.py --test）
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
           'atkSpeed': 0, 'freq': 0}
    for sys in systems:
        for t in sys.get('techs', []):
            lv = (levels.get(sys.get('name', ''), {}) or {}).get(t.get('name', ''), 0) or 0
            if lv <= 0:
                continue
            tmax = float(t.get('max') or 1) or 1
            for e in t.get('effects', []):
                act = e.get('action', '')
                if act not in ('比例加成', '比例减少'):
                    continue
                try:
                    raw = float(e.get('value') or 0)
                except (TypeError, ValueError):
                    continue
                if raw == 0:
                    continue
                sign = -1.0 if act == '比例减少' else 1.0
                per = sign * raw * lv / tmax
                typ = e.get('type', '')
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
                elif '持续时间' in typ or '攻击间隔' in typ: acc['atkSpeed'] += abs_v * dir_v
                elif '频率' in typ or '每轮攻击' in typ or '额外射击' in typ: acc['freq'] += abs_v * dir_v
                elif '命中' in typ: acc['hit'] += abs_v * dir_v
                elif '生命' in typ or '结构值' in typ: acc['hp'] += abs_v * dir_v
                elif '装甲' in typ or '抗性' in typ:
                    if '能量' in typ: acc['energy'] += abs_v * dir_v
                    else: acc['phys'] += abs_v * dir_v
                elif '巡航' in typ: acc['cruise'] += abs_v * dir_v
                elif '曲速' in typ: acc['warp'] += abs_v * dir_v
                elif '伤害' in typ: acc['dmg'] += abs_v * dir_v
    return {
        'fireMul': 1 + acc['dmg'] / 100,
        'aaMul': 1 + (acc['dmg'] + acc['aa']) / 100,
        'siegeMul': 1 + (acc['dmg'] + acc['siege']) / 100,
        'cdMul': 1 - acc['cd'] / 100,
        'hpMul': 1 + acc['hp'] / 100,
        'physMul': 1 + acc['phys'] / 100,
        'energyMul': 1 + acc['energy'] / 100,
        'cruiseMul': 1 + acc['cruise'] / 100,
        'warpMul': 1 + acc['warp'] / 100,
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
if __name__ == '__main__':
    import sys, json

    ok = 0
    fail = 0

    def T(name, cond):
        global ok, fail
        if cond:
            ok += 1
            print('[PASS]', name)
        else:
            fail += 1
            print('[FAIL]', name)

    # 1. 武器合计（不互斥）
    ws = [
        {'name': 'A', 'damage': 400, 'cycle': 2, 'rounds': 3, 'cooldown': 10},
        {'name': 'B', 'damage': 350, 'cycle': 2, 'rounds': 3, 'cooldown': 10},
    ]
    t = weapon_totals(ws)
    T('武器合计(不互斥) 400+350=750', t['damage'] == 750 and t['weapons'] == 2)

    # 2. 火力 DPM
    ws2 = [{'dpmShip': 9000, 'dpmAA': 1890}, {'dpmShip': 9600, 'dpmAA': 1344, 'dpmSiege': 290}]
    f = firepower_dpm(ws2)
    T('火力DPM 反舰18600 防空3234 攻城290', f['antiShip'] == 18600 and f['antiAir'] == 3234 and f['siege'] == 290)

    # 3. 强化乘数（伤害+10%×3/6=+5% → fireMul 1.05）
    systems = [{'name': 'S1', 'techs': [{'name': 'T1', 'max': 6, 'effects': [{'type': '伤害提升', 'action': '比例加成', 'value': 10}]}]}]
    levels = {'S1': {'T1': 3}}
    e = compute_enhancement(systems, levels)
    T('强化乘数 fireMul=1.05', abs(e['fireMul'] - 1.05) < 1e-9)

    # 4. 强化武器数值
    wb = enhanced_weapon({'damage': 400, 'dpmShip': 9000}, 1.05, 1.0, 1.0)
    T('强化武器 400→420', wb['damageBoost'] == 420 and wb['dpmShipBoost'] == 9450)

    # 5. 模块同分类互斥
    systems2 = {
        '综合投射系统': {'weapons': [{'name': 'W1', 'option': 'M1'}]},
        '矿车矩阵投射系统': {'weapons': [{'name': 'W2', 'option': 'M2'}]},
        '堡垒无人机护卫系统': {'weapons': [{'name': 'W3', 'option': 'A1'}]},
        '堡垒区域火控系统A型': {'weapons': [{'name': 'W4', 'option': 'A2'}]},
    }
    mg = module_groups(systems2, {'M': 'M2'})
    m_cls = {x['cls']: x for x in mg}
    T('模块M类同分类互斥(安装M2)', m_cls['M']['chosen'] == 'M2' and m_cls['M']['options'][0]['selected'] is False and m_cls['M']['options'][1]['selected'] is True)
    T('模块A类默认初始(A1)', m_cls['A']['chosen'] == 'A1')

    print('RESULT: %d pass / %d fail' % (ok, fail))
    sys.exit(0 if fail == 0 else 1)
