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
# 官方 effect_def.EFFECT_SHIP_BLUEPRINT_ENHANCE_ADJUST：效果是「开放本系统调校能力」的钥匙节点
TUNE_KEY_EFFECT_ID = 2082


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
    ur = unlock_requirement(e)
    adj = adjust_fields(e, int(cid) // 100)
    if not ur and adj:
        ur = adjust_requirement(adj)
    if ur:
        node['ur'] = ur
    uq = unlock_req(e)
    if uq:
        node['uq'] = uq
    if e.get('ADJUST_PROB'):
        node['ap'] = e['ADJUST_PROB']
    if row.get('EFFECT_ID') == TUNE_KEY_EFFECT_ID:
        node['ky'] = 1
    node.update(adj)
    if node.get('ap') and 'mx' not in node:
        # 调教节点不吃科技点，等级上限就是 ADJUST_PROB 的长度
        node['mx'] = len(node['ap'])
    return node


def parse_dict_of_list(s):
    """官方 data_utils.parse_cfg_str_to_dict_of_list 的格式：
    'val11,val12,val13;val21,val22;...' → {'val11': [val12, val13], 'val21': val22}"""
    out = {}
    for group in str(s or '').split(';'):
        items = [x.strip() for x in group.split(',') if x.strip() != '']
        if len(items) < 2:
            continue
        key = items[0]
        rest = items[1:]
        out[key] = rest if len(rest) > 1 else rest[0]
    return out


def unlock_req(e):
    """返回结构化解锁条件（供站内校验用），字段含义同 unlock_requirement。

    官方 bp_extend_system_view：
      UNLOCK_COST_RARITY 每个 ';' 分组是一条途径（cal_rarity_requirement_remain 遍历
      require_rarity_cost_dict.items()，键是 value_requirement、值是稀有度集合），
      即「这些稀有度的武器技术，总价值要达到键上的门槛」。
    ways: [{v: 价值门槛, r: [稀有度...]}]，多条为「或」关系
    ty:   限定的武器技术类型
    """
    out = {}
    tl = e.get('UNLOCK_WEAPON_TECH_TYPE_LIMIT')
    types = [x.strip() for x in str(tl or '').split(',') if x.strip()]
    if types:
        out['ty'] = types
    ways = []
    for value_need, rars in parse_dict_of_list(e.get('UNLOCK_COST_RARITY')).items():
        rars = rars if isinstance(rars, list) else [rars]
        ways.append({'v': value_need, 'r': rars})
    if ways:
        out['ways'] = ways
    return out


def unlock_requirement(e):
    """按官方 bp_extend_system_view 的判定拼出人话。

    UNLOCK_TYPE_RARITY：UNLOCK_COST_RARITY 每个 ';' 分组是一条解锁途径，
        键=所需总价值（武器技术 ENHANCE_VALUE 之和），值=该途径接受的武器技术稀有度集合；
        UNLOCK_WEAPON_TECH_TYPE_LIMIT 限定武器技术类型。
    """
    parts = []
    uq = unlock_req(e)
    if uq.get('ways'):
        ways = ['稀有度 %s、总价值 ≥ %s' % ('/'.join(w['r']), w['v']) for w in uq['ways']]
        parts.append('解锁：' + '；或 '.join(ways))
    if uq.get('ty'):
        parts.append('武器技术类型 ' + '/'.join(uq['ty']))
    return '　'.join(parts)


def adjust_fields(e, system_id):
    """官方调教（EFFECT_TYPE == ADJUST）相关字段，照 bp_extend_system_view 与
    preprocess_data._process_system_enhance_enhance 取。

      ADJUST_ENHANCE_INDEX -> 目标强化节点 id = 系统 id × 100 + 索引
                               （SYSTEM_ADJUST_IN_ENHANCE[调教节点 id] = 目标 id）
      ADJUST_RARITY        -> 调教所需总价值（require_value_sum）
      ADJUST_RARITY_LIMIT  -> 可用的武器技术稀有度（未配置=不限，上限 ADJUST_WEAPON_TECH_MAX_RARITY=5）
      ADJUST_WEAPON_TECH_TYPE_LIMIT -> 可用的武器技术类型
      ADJUST_PROB          -> 逐级成功率
    """
    if e.get('EFFECT_TYPE') != 2:
        return {}
    out = {}
    idx = e.get('ADJUST_ENHANCE_INDEX')
    if idx:
        out['tg'] = str(system_id * 100 + idx)
    if e.get('ADJUST_RARITY') is not None:
        out['av'] = e['ADJUST_RARITY']
    lim = [x.strip() for x in str(e.get('ADJUST_RARITY_LIMIT') or '').split(',') if x.strip()]
    if lim:
        out['rl'] = lim
    tys = [x.strip() for x in str(e.get('ADJUST_WEAPON_TECH_TYPE_LIMIT') or '').split(',') if x.strip()]
    if tys:
        out['ty2'] = tys
    return out


def adjust_requirement(adj):
    """调教条件的人话（照 update_weapon_table_data_for_adjust 的字段口径）。"""
    parts = []
    if adj.get('av') is not None:
        parts.append('调教：武器技术总价值 ≥ %s' % adj['av'])
    if adj.get('rl'):
        parts.append('稀有度 ' + '/'.join(adj['rl']))
    if adj.get('ty2'):
        parts.append('武器技术类型 ' + '/'.join(adj['ty2']))
    return '　'.join(parts)


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

            # 2.4) 六边形节点回填解锁条件 / 逐级触发概率（官方调教判定，见 unlock_requirement）
            for t in techs:
                if t.get('ul') != -1:
                    continue
                e = enh.get(t['id'])
                if not e:
                    continue
                ur = unlock_requirement(e)
                adj = adjust_fields(e, int(t['id']) // 100)
                if not ur and adj:
                    ur = adjust_requirement(adj)
                if ur != t.get('ur'):
                    if ur:
                        t['ur'] = ur
                        stat['补解锁条件'] += 1
                    else:
                        del t['ur']
                uq = unlock_req(e)
                if uq != t.get('uq'):
                    if uq:
                        t['uq'] = uq
                    else:
                        t.pop('uq', None)
                if e.get('ADJUST_PROB') and not t.get('ap'):
                    t['ap'] = e['ADJUST_PROB']
                pfx = e.get('SYSTEM_EFFECT_PREFIX')
                row = eff.get(str(pfx * 100 + 1), {}) if pfx is not None else {}
                if row.get('EFFECT_ID') == TUNE_KEY_EFFECT_ID and not t.get('ky'):
                    t['ky'] = 1
                    stat['标钥匙'] += 1
                for k, v in adj.items():
                    if t.get(k) != v:
                        t[k] = v
                        stat['补调教字段'] += 1
                if t.get('ap') and not t.get('mx'):
                    # 调教节点不吃科技点，等级上限就是 ADJUST_PROB 的长度
                    t['mx'] = len(t['ap'])
                    stat['补调教上限'] += 1

            # 2.45) 系统调校钥匙：官方 check_tuning_available 判本系统有没有已解锁的钥匙节点
            keys = [t['id'] for t in techs if t.get('ky')]
            if keys:
                sd['tk'] = keys

            # 2.5) 补描述：官方文案里带 {101} 这类占位符的条目此前被整条丢弃，
            # 导致这些节点看不到升级效果；这里保留原文，占位符换成可读标记。
            for t in techs:
                eid = effect_id(enh.get(t['id']))
                if not eid:
                    continue
                if not t.get('ds'):
                    d = lang.get(('desc', eid)) or ''
                    if d:
                        t['ds'] = PLACEHOLDER_RE.sub('【数值】', d)
                        stat['补描述'] += 1
                if not t.get('d'):
                    dd = lang.get(('desc_detail', eid)) or ''
                    if dd:
                        t['d'] = PLACEHOLDER_RE.sub('【数值】', dd)

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

    print('行调整 %d，列调整 %d，新增六边形 %d，改判隐藏 %d，补描述 %d，补解锁条件 %d，'
          '标钥匙 %d，补调教字段 %d，补调教上限 %d'
          % (stat['行调整'], stat['列调整'], stat['新增六边形'], stat['改判隐藏'],
             stat['补描述'], stat['补解锁条件'], stat['标钥匙'], stat['补调教字段'],
             stat['补调教上限']))
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
