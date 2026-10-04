# -*- coding: utf-8 -*-
"""按官方预览图重排 public/games/official_enhance_data.js 的行与列。

规则（与官方截图 6010101 逐格核对过）
    行   = 同系统内出现过的 ui_level 按 THIRD(4) > UP(2) > COMMON(0) > DOWN(3)
           降序压缩排名；不再为了躲交叉挪行。
    列   = 官方树配置 PARENT_ENHANCE_ID 的 DFS 深度（多父取最深的一条）。
    六边形行 = 树配置里 kind == 2 的节点（游戏底部那排斜纹六边形），置 ul=-1。

只改 rw / cl / ul（六边形判定），名称、图标、消耗、描述、前置关系一律不动。

用法
    python ops/rebuild_enhance_layout.py           # 只核算并打印
    python ops/rebuild_enhance_layout.py --write   # 写盘（写前备份到 ops/bak）
"""

import argparse
import collections
import datetime
import json
import os
import shutil
import sys

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'public', 'games', 'official_enhance_data.js')
CFG = r'D:\ai\memory\星际猎人_蓝图加点解包\config'
TREE_JSON = os.path.join(CFG, '_Tb_cfg_system_enhance_tree.json')

RANK = {4: 0, 2: 1, 0: 2, 3: 3}          # 官方 LEVEL_ENHANCE_HIGHT：THIRD 最高
HEX_KIND = 2                              # 树配置第二项 = 2 的节点，官方画成底部六边形


def load_data():
    text = open(DATA, encoding='utf-8').read()
    head = text[:text.index('window.OFFICIAL_ENHANCE')]
    body = text[text.index('=', text.index('window.OFFICIAL_ENHANCE')) + 1:].strip().rstrip(';')
    return head, json.loads(body)


def load_tree():
    raw = json.load(open(TREE_JSON, encoding='utf-8'))['_Tb_cfg_system_enhance_tree']
    out = {}
    for k, v in raw.items():
        body, _, lv = str(v[0]).partition(';')
        try:
            ul = int(lv.strip().rstrip(';'))
        except Exception:
            ul = 0
        pars = [x.strip() for x in body.split(',') if x.strip() and x.strip() != '0']
        kind = v[1] if isinstance(v, list) and len(v) > 1 else 0
        out[k] = {'pars': pars, 'ul': ul, 'kind': kind if kind in (1, 2) else 0}
    return out


def dfs_depth(ids, tree):
    """在给定节点集合上按配置前置算 DFS 深度；父节点不在集合里就当作根。"""
    idset = set(ids)
    depth = {}
    order = sorted(ids)

    def walk(n, d, seen):
        if n in seen or d > 30:
            return
        depth[n] = max(depth.get(n, 0), d)
        seen = seen | {n}
        for c in order:
            if n in tree.get(c, {}).get('pars', []):
                walk(c, d + 1, seen)

    for n in order:
        pars = [p for p in tree.get(n, {}).get('pars', []) if p in idset]
        if not pars:
            walk(n, 0, set())
    for n in order:
        if n not in depth:
            walk(n, 0, set())
    return depth


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--write', action='store_true')
    args = ap.parse_args()

    head, data = load_data()
    tree = load_tree()

    stat = collections.Counter()
    moved_row = moved_col = hexed = 0
    collisions = []

    for ship_key, ship in data.items():
        for sys_name, sd in ship['systems'].items():
            techs = sd['techs']
            ids = [t['id'] for t in techs]
            depth = dfs_depth(ids, tree)

            # 六边形判定：树配置 kind == 2
            for t in techs:
                k = tree.get(t['id'], {}).get('kind', 0)
                if k == HEX_KIND and t.get('ul') != -1:
                    t['ul'] = -1
                    hexed += 1

            plane = [t for t in techs if t.get('ul') not in (-1, -2)]
            present = sorted({t['ul'] for t in plane if t.get('ul') in RANK}, key=lambda u: RANK[u])
            row_of = {u: i for i, u in enumerate(present)}

            for t in techs:
                nd = depth.get(t['id'], 0)
                if t.get('cl') != nd:
                    moved_col += 1
                    t['cl'] = nd
                if t.get('ul') in row_of:
                    nr = row_of[t['ul']]
                    if t.get('rw') != nr:
                        moved_row += 1
                        t['rw'] = nr
                elif t.get('ul') == -1:
                    t['rw'] = 0

            # 同格检查（只算平面节点）
            cells = collections.defaultdict(list)
            for t in techs:
                if t.get('ul') in row_of:
                    cells[(row_of[t['ul']], t.get('cl'))].append(t)
            for cell, lst in cells.items():
                if len(lst) > 1:
                    stat['重叠格'] += 1
                    if len(collisions) < 12:
                        collisions.append((ship_key, sys_name, cell, [(x['id'], x['n']) for x in lst]))

    print('行调整 %d 个节点，列调整 %d 个节点，改判为六边形 %d 个'
          % (moved_row, moved_col, hexed))
    print('剩余同格重叠 %d 处' % stat['重叠格'])
    for c in collisions:
        print('   ', c)

    # 几何复核：真交叉 / 共线重合 / 压节点
    import fix_tree_crossings as F
    tot = collections.Counter()
    worst = []
    for ship_key, ship in data.items():
        for sys_name, sd in ship['systems'].items():
            techs = sd['techs']
            row = {t['id']: t.get('rw', 0) for t in techs}
            cl = {t['id']: t.get('cl', 0) for t in techs}
            links = F.links_of(techs)
            cross, touch, hit = F.defects(techs, row, cl, links)
            tot['交叉'] += cross
            tot['重合'] += touch
            tot['压节点'] += hit
            if cross or hit:
                worst.append((cross, hit, ship_key, sys_name))
    print('几何复核：%s' % dict(tot))
    for w in sorted(worst, reverse=True)[:10]:
        print('   交叉%d 压节点%d  %s / %s' % w)

    if not args.write:
        print('\n（未指定 --write，未写盘）')
        return

    bak = os.path.join(ROOT, 'ops', 'bak')
    os.makedirs(bak, exist_ok=True)
    stamp = datetime.datetime.now().strftime('%Y%m%d-%H%M%S')
    shutil.copy2(DATA, os.path.join(bak, 'official_enhance.json.' + stamp))
    body = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
    open(DATA, 'w', encoding='utf-8', newline='\n').write(head + 'window.OFFICIAL_ENHANCE = ' + body + ';\n')
    print('已写入 %s（备份 ops/bak/official_enhance.json.%s）' % (DATA, stamp))


if __name__ == '__main__':
    main()
