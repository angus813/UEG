# -*- coding: utf-8 -*-
"""生成 public/games/enhance_effects.js —— 官方强化节点的属性加成数据。

数据来源
    旧版 public/games/ships_data.js（已从仓库删除，保留在 git 历史 d8a725a^）。
    该文件里每个科技节点带结构化 effects：{type, action, value, weapon}，
    来自官方数据表的人工整理版（英文 xlsx 翻译件）。

对齐方式
    1) 先在「同一艘船」的节点池内按 名称 / 代价数组 / 最高等级 / 描述里的数值 /
       标签 / 所属系统名 逐项打分，取最高分贪心指派（一个旧节点只分配给一个新节点）。
    2) 分数低于阈值的不采纳 —— 宁缺勿错，未命中的节点不产生加成。

输出
    window.ENHANCE_EFFECTS = { "<官方节点id>": [["类型","动作",数值,"武器"], ...] }

用法
    python ops/gen_enhance_effects.py            # 只核算并打印覆盖率
    python ops/gen_enhance_effects.py --write    # 写盘
"""

import argparse
import json
import os
import re
import subprocess
import sys

sys.stdout.reconfigure(encoding='utf-8')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OFFICIAL = os.path.join(ROOT, 'public', 'games', 'official_enhance_data.js')
OUTPUT = os.path.join(ROOT, 'public', 'games', 'enhance_effects.js')
GIT = r'D:\ai\tools\PortableGit\cmd\git.exe'
LEGACY_REV = 'd8a725a^'
LEGACY_PATH = 'public/games/ships_data.js'

# 旧 effects.type → 新 lb（节点标签）的对应，用于打分
LB_MAP = {
    '伤害提升': '伤害', '暴击伤害提升': '暴击', '暴击伤害': '暴击', '冷却缩减': '频率',
    '攻击持续时间缩减': '频率', '命中率提升': '命中', '对单一类型武器命中率提升': '命中',
    '结构值提升': '结构', '结构值': '结构', '系统结构值提升': '系统结构',
    '物理装甲提升': '抵抗', '能量装甲提升': '抵抗', '巡航速度提升': '常规',
    '曲率速度提升': '曲率', '攻击间隔缩减': '频率', '伤害抵抗提升': '抵抗',
    '攻城伤害提升': '攻城', '频率提升': '频率', '武器伤害提升': '伤害', '对舰船修理': '维修',
    '防空伤害提升': '预警', '击毁概率提升': '伤害', '系统结构提升': '系统结构',
}


def load_js_object(path):
    """读取 `window.X = {...};` 形式的文件，返回其中的对象。"""
    text = open(path, encoding='utf-8').read()
    return json.loads(text.split('=', 1)[1].strip().rstrip(';'))


def load_legacy():
    """从 git 历史取旧版 ships_data.js（含结构化 effects）。"""
    r = subprocess.run([GIT, 'show', LEGACY_REV + ':' + LEGACY_PATH],
                       cwd=ROOT, capture_output=True)
    if r.returncode != 0:
        raise SystemExit('无法从 git 读取旧数据 %s:%s\n%s'
                         % (LEGACY_REV, LEGACY_PATH, r.stderr.decode('utf-8', 'replace')))
    return json.loads(r.stdout.decode('utf-8').split('=', 1)[1].strip().rstrip(';'))


def cost_tuple(arr):
    return tuple(int(x) if x is not None else 0 for x in (arr or []))


def numbers(text):
    return set(re.findall(r'\d+(?:\.\d+)?', str(text or '')))


def name_score(a, b):
    a, b = a or '', b or ''
    if not a or not b:
        return 0
    if a == b:
        return 6
    if a in b or b in a:
        return 4
    return min(len(set(a) & set(b)), 3)


def pair_score(node, old_tech, sys_name, old_sys_name):
    score = name_score(node.get('n'), old_tech.get('name'))
    if cost_tuple(node.get('ct')) == cost_tuple(old_tech.get('progress')):
        score += 4
    if abs((old_tech.get('max') or 0) - 1 - (node.get('mx') or 0)) <= 1:
        score += 2
    a = numbers(node.get('ds'))
    b = set()
    for e in old_tech.get('effects', []):
        b |= numbers(e.get('value'))
    if a and b and (a & b):
        score += 3
    lb = node.get('lb') or ''
    if lb and lb in [LB_MAP.get(e.get('type'), '') for e in old_tech.get('effects', [])]:
        score += 3
    if sys_name == old_sys_name:
        score += 3
    elif sys_name and old_sys_name and (sys_name in old_sys_name or old_sys_name in sys_name
                                        or len(set(sys_name) & set(old_sys_name)) >= 3):
        score += 2
    return score


MIN_SCORE = 8

# 兜底：节点没配到旧数据时，用节点自己的 lb（官方标签）+ 描述里的百分数合成一条加成。
# 只处理语义明确的标签，数值必须是「xx%」形式；其余（机制类、无标签、无百分数）一律跳过。
LB_FALLBACK = {
    '伤害': ('伤害提升', '比例加成'),
    '频率': ('冷却缩减', '比例加成'),
    '命中': ('命中率提升', '比例加成'),
    '结构': ('结构值提升', '比例加成'),
    '系统结构': ('系统结构值提升', '比例加成'),
    '暴击': ('暴击伤害提升', '比例加成'),
    '曲率': ('曲率速度提升', '比例加成'),
    '攻城': ('攻城伤害提升', '比例加成'),
}


def fallback_effect(node):
    lb = node.get('lb') or ''
    ds = node.get('ds') or ''
    if lb == '抵抗':
        if '%' not in ds:
            return None
        v = percent_of(ds)
        if v is None:
            return None
        kind = '能量装甲提升' if '能量' in ds else '物理装甲提升'
        return [kind, '比例加成', v, '']
    if lb not in LB_FALLBACK:
        return None
    if '%' not in ds:
        return None
    v = percent_of(ds)
    if v is None:
        return None
    kind, action = LB_FALLBACK[lb]
    return [kind, action, v, '']


def percent_of(text):
    m = re.search(r'(\d+(?:\.\d+)?)\s*%', text or '')
    return float(m.group(1)) if m else None


def build(new_data, old_data):
    effects = {}
    stats = {'nodes': 0, 'matched': 0, 'no_ship': 0, 'fallback': 0}
    gap_ships = {}
    for ship_key, ship in new_data.items():
        old_ship = old_data.get(ship_key)
        pool = []
        if old_ship:
            for s in old_ship['systems']:
                for t in s['techs']:
                    pool.append((s['name'], t))
        nodes = [(sn, t) for sn, sd in ship['systems'].items() for t in sd['techs']]
        stats['nodes'] += len(nodes)
        if not pool:
            stats['no_ship'] += len(nodes)
            gap_ships[ship_key] = len(nodes)
            continue
        pairs = []
        for i, (sn, node) in enumerate(nodes):
            for j, (osn, tech) in enumerate(pool):
                sc = pair_score(node, tech, sn, osn)
                if sc >= MIN_SCORE:
                    pairs.append((sc, i, j))
        pairs.sort(reverse=True)
        used_node, used_tech = set(), set()
        for sc, i, j in pairs:
            if i in used_node or j in used_tech:
                continue
            used_node.add(i)
            used_tech.add(j)
            tech = pool[j][1]
            fx = [[e.get('type') or '', e.get('action') or '', e.get('value'),
                   e.get('weapon') or ''] for e in tech.get('effects', [])]
            fx = [x for x in fx if x[0] and x[2] is not None]
            if fx:
                effects[nodes[i][1]['id']] = fx
        stats['matched'] += len(used_node)
        for i, (sn, node) in enumerate(nodes):
            if i in used_node or node['id'] in effects:
                continue
            fx = fallback_effect(node)
            if fx:
                effects[node['id']] = [fx]
                stats['fallback'] += 1
        miss = 0
        for i, (sn, node) in enumerate(nodes):
            if i not in used_node and node['id'] not in effects:
                miss += 1
        if miss:
            gap_ships[ship_key] = gap_ships.get(ship_key, 0) + miss
    return effects, stats, gap_ships


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--write', action='store_true', help='写盘')
    args = ap.parse_args()

    new_data = load_js_object(OFFICIAL)
    old_data = load_legacy()
    effects, stats, gap_ships = build(new_data, old_data)

    total = stats['matched'] + stats['fallback']
    print('节点总数 %d，取得加成数据 %d（%.1f%%）＝ 旧数据对齐 %d + 描述兜底 %d，旧数据无此船 %d'
          % (stats['nodes'], total, 100.0 * total / stats['nodes'],
             stats['matched'], stats['fallback'], stats['no_ship']))
    print('有缺口舰船 %d / %d，缺口最大 10 艘：%s'
          % (len(gap_ships), len(new_data),
             sorted(gap_ships.items(), key=lambda x: -x[1])[:10]))

    if not args.write:
        print('\n（未指定 --write，仅核算）')
        return

    header = ('/* 官方强化节点的属性加成数据（自动生成，勿手改）\n'
              '   来源：旧版 ships_data.js（git %s）里的结构化 effects，\n'
              '        按 节点名/代价数组/最高等级/描述数值/标签/系统名 对齐到官方节点 id；\n'
              '        未对齐但标签明确且描述带百分数的节点，用描述兜底合成一条。\n'
              '   覆盖 %d / %d 个节点；未覆盖的视为无属性加成（多为机制类节点）。\n'
              '   字段：[类型, 动作, 数值, 武器] */\n'
              % (LEGACY_REV, total, stats['nodes']))
    body = json.dumps(effects, ensure_ascii=False, separators=(',', ':'))
    open(OUTPUT, 'w', encoding='utf-8', newline='\n').write(
        header + 'window.ENHANCE_EFFECTS = ' + body + ';\n')
    print('已写入 %s（%.1f KB）' % (OUTPUT, os.path.getsize(OUTPUT) / 1024.0))


if __name__ == '__main__':
    main()
