"""enhance_calc 自测（仅本地运行：python enhance_calc_test.py）

原自测块曾内联在 enhance_calc.py 末尾。因 Pyodide 的 runPythonAsync 执行时
__name__ 恰为 '__main__'，会触发自测并 sys.exit()，导致浏览器端引擎被判定
为不可用而静默降级到 JS 引擎。故拆分为独立文件。
"""

import sys

from enhance_calc import *   # noqa: F401,F403


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

