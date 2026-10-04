# -*- coding: utf-8 -*-
"""按官方预览图重排 public/games/official_enhance_data.js 的行/列，并补齐底部六边形节点。

规则（与官方截图 6010101 逐格核对过）
    行   = 同系统内出现过的 ui_level 按 THIRD(4) > UP(2) > COMMON(0) > DOWN(3)
           降序压缩排名；不再为了躲交叉挪行。
    列   = 官方树配置 PARENT_ENHANCE_ID 的 DFS 深度（多父取最深的一条）。
    底部六边形 = 官方调整节点：EFFECT_TYPE == 2 或 UNLOCK_TYPE != 0，且无默认等级。
                 这类节点多数只在 _Tb_cfg_system_enhance 里、不在树配置里，站内此前
                 完全没有，这里按官方文案补齐（名称/标签/图标/描述/详细说明）。
    树配置里 kind == 2 的节点在游戏里不进树（get_enhancement_type 不是系统强化），
    画面上看不到，这里置 ul=-2 不渲染。

只改 rw / cl / ul，并新增上述调整节点；已有节点的名称、图标、消耗、描述、前置不动。

用法
    python ops/rebuild_enhance_layout.py           # 只核算并打印
    python ops/rebuild_enhance_layout.py --write   # 写盘（写前备份到 ops/bak）
"""

import argparse
import collections
import datetime
import json
import os
import re
import shutil
import sys

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'public', 'games', 'official_enhance_data.js')
CFG = r'D:\ai\memory\星际猎人_蓝图加点解包\config'
LANG_TXT = os.path.join(os.path.dirname(CFG), 'language', 'zh_CN', 'tb_cfg_system_effect.txt')
TREE_JSON = os.path.join(CFG, '_Tb_cfg_system_enhance_tree.json')
ENH_JSON = os.path.join(CFG, '_Tb_cfg_system_enhance.json')
EFF_JSON = os.path.join(CFG, '_Tb_cfg_system_effect.json')

RANK = {4: 0, 2: 1, 0: 2, 3: 3}          # 官方 LEVEL_ENHANCE_HIGHT：THIRD 最高
HIDE_KIND = 2                             # 树配置第二项 = 2：不进树，画面不可见
PLACEHOLDER_RE = re.compile(r'\{[^}]*\}')


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
        out[k] = {'pars': pars, 'ul': ul, 'kind': kind}
    return out


def load_cfg():
    enh = json.load(open(ENH_JSON, encoding='utf-8'))['_Tb_cfg_system_enhance']
    eff = json.load(open(EFF_JSON, encoding='utf-8'))['_Tb_cfg_system_effect']
    lang = {}
    for line in open(LANG_TXT, encoding='utf-8'):
        if '::' not in line:
            continue
        key, val = line.rstrip('\r\n').split('::', 1)
        parts = key.split('#')
        if len(parts) == 3 and parts[0] == 'cfg_system_effect':
            lang[(parts[1], parts[2])] = val
    return enh, eff, lang


def effect_id(enh_row):
    pfx = (enh_row or {}).get('SYSTEM_EFFECT_PREFIX')
    return None if pfx is None else '%s01' % pfx


def is_adjust(enh_row):
    """官方判据：EFFECT_TYPE == 2 或 UNLOCK_TYPE != 0。
    注意 ENHANCE_DEFAULT_LEVEL != 0 的节点同样在官方调整列表里（截图里最左那个
    六边形就是带默认等级的解锁节点），不要排除。"""
    if not enh_row:
        return False
    return (enh_row.get('EFFECT_TYPE') == 2) or ((enh_row.get('UNLOCK_TYPE') or 0) != 0)


def build_adjust_node(cid, enh, eff, lang):
    e = enh.get(cid, {})
    eid = effect_id(e)
    pfx = e.get('SYSTEM_EFFECT_PREFIX')
    row = eff.get(str(pfx * 100 + 1), {}) if pfx is not None else {}
    lname = lang.get(('name', eid)) or ''
    label = lang.get(('effect_label', eid)) or ''
    desc = lang.get(('desc', eid)) or ''
    detail = lang.get(('desc_detail', eid)) or ''
    if desc and PLACEHOLDER_RE.search(desc):
        desc = ''
    if detail and PLACEHOLDER_RE.search(detail):
        detail = ''
    costs = e.get('ENHANCE_COST') or []
    node = {
        'id': cid,
        'n': lname or label or cid,
        'lb': label,
        'ic': row.get('PATH') or '',
    }
    if costs:
        node['mx'] = len(costs)
        node['ct'] = costs
    node['ds'] = desc
    node['d'] = detail
    node['c'] = 0
    if e.get('ADJUST_ENHANCE_INDEX') is not None:
        node['dx'] = e['ADJUST_ENHANCE_INDEX']
    return node


def dfs_depth(ids, tree):
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
    enh, eff, lang = load_cfg()

    stat = collections.Counter()
    collisions = []

    for ship_key, ship in data.items():
        for sys_name, sd in ship['systems'].items():
            sys_id = sd.get('id') or ''
            techs = sd['techs']
            have = {t['id'] for t in techs}

            # 1) 补齐官方调整节点（六边形行）
            if sys_id:
                for cid in sorted(k for k in enh
                                  if k.startswith(sys_id) and len(k) == len(sys_id) + 2):
                    if cid in have or not is_adjust(enh.get(cid)):
                        continue
                    node = build_adjust_node(cid, enh, eff, lang)
                    node['ul'] = -1
                    node['cl'] = node.get('dx', 0)
                    node['rw'] = 0
                    techs.append(node)
                    have.add(cid)
                    stat['新增六边形'] += 1

            # 2) 树配置 kind=2 的节点不进树（本身是官方调整节点的除外）
            for t in techs:
                if tree.get(t['id'], {}).get('kind') == HIDE_KIND and not is_adjust(enh.get(t['id'])):
                    if t.get('ul') != -2:
                        stat['改判隐藏'] += 1
                    t['ul'] = -2

            # 3) 列 = 配置树 DFS 深度（六边形行保持自己的排序值）
            depth = dfs_depth([t['id'] for t in techs if t.get('ul') != -1], tree)
            for t in techs:
                if t.get('ul') == -1:
                    continue
                nd = depth.get(t['id'], 0)
                if t.get('cl') != nd:
                    stat['列调整'] += 1
                    t['cl'] = nd

            # 4) 行 = ui_level 降序压缩排名
            plane = [t for t in techs if t.get('ul') not in (-1, -2)]
            present = sorted({t['ul'] for t in plane if t.get('ul') in RANK}, key=lambda u: RANK[u])
            row_of = {u: i for i, u in enumerate(present)}
            for t in techs:
                if t.get('ul') in row_of:
                    nr = row_of[t['ul']]
                    if t.get('rw') != nr:
                        stat['行调整'] += 1
                        t['rw'] = nr
                elif t.get('ul') == -1:
                    t['rw'] = 0

            # 5) 同格检查
            cells = collections.defaultdict(list)
            for t in techs:
                if t.get('ul') in row_of:
                    cells[(row_of[t['ul']], t.get('cl'))].append(t)
            for cell, lst in cells.items():
                if len(lst) > 1:
                    stat['重叠格'] += 1
                    if len(collisions) < 8:
                        collisions.append((ship_key, sys_name, cell, [x['id'] for x in lst]))

            # 6) 六边形排在数组末尾，并按链序（cl, id）排列 —— 渲染与链线顺序一致
            plane_order = [t for t in techs if t.get('ul') != -1]
            hex_order = sorted((t for t in techs if t.get('ul') == -1),
                               key=lambda t: (t.get('cl', 0), t['id']))
            sd['techs'] = plane_order + hex_order

    print('行调整 %d，列调整 %d，新增六边形 %d，改判隐藏 %d'
          % (stat['行调整'], stat['列调整'], stat['新增六边形'], stat['改判隐藏']))
    print('剩余同格重叠 %d 处' % stat['重叠格'])
    for c in collisions:
        print('   ', c)

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
    for w in sorted(worst, reverse=True)[:8]:
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
