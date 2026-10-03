# -*- coding: utf-8 -*-
"""从解包 cfg + 官方百科 xlsx 重新生成 official_enhance.json / official_enhance_data.js

数据来源
  结构/所属/等级/成本/图标/类型 : memory/星际猎人_蓝图加点解包/config/_Tb_cfg_system_enhance{,_tree}.json
  文案（英文）                  : memory/Lagrange's encyclopedia.xlsx（Enhancements 表）
  已有中文文案                  : 现有 official_enhance.json（复用，不重译）

用法
  python ops/gen_official_enhance.py            # dry-run，只打印统计
  python ops/gen_official_enhance.py --write    # 落盘（先自动备份现有两份）
"""
import argparse
import collections
import difflib
import json
import os
import re
import shutil
import sys
import time
import re
import zipfile
import xml.etree.ElementTree as ET

sys.stdout.reconfigure(encoding='utf-8')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))          # 网站/
AI = os.path.dirname(ROOT)                                                   # D:\ai
CFG_DIR = os.path.join(AI, 'memory', '星际猎人_蓝图加点解包', 'config')
XLSX = os.path.join(AI, 'memory', "Lagrange's encyclopedia.xlsx")
JSON_OUT = os.path.join(ROOT, 'public', 'games', 'official_enhance.json')
JS_OUT = os.path.join(ROOT, 'public', 'games', 'official_enhance_data.js')
# 中文文案底本：优先用 ops/bak/base.json（首次生成时的原始版本），保证反复重跑结果一致；
# 没有底本时才退回当前 official_enhance.json。
TEXT_BASE = os.path.join(ROOT, 'ops', 'bak', 'base.json')
# 游戏官方文案：权威来源，名称一律以它为准
LANG_DIR = os.path.join(AI, 'memory', '星际猎人_蓝图加点解包', 'language', 'zh_CN')
LANG_TXT = os.path.join(LANG_DIR, 'tb_cfg_system_effect.txt')
LANG_NPK = r'D:\星际猎人\res_4.npk'
LANG_NAME_IN_NPK = r'language\zh_CN\tb_cfg_system_effect.txt'

NS = '{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'
COL = re.compile(r'([A-Z]+)')

# 站内已有中文覆盖不到的 18 条唯一文案，手工译文（其余全部复用现有中文）
ZH_EXTRA = {
    'Anti-Aircraft Coverage Expansion': (
        '防空覆盖扩展', '防空',
        '防空武器打击范围扩展至同行敌舰',
        '扩大防空武器的打击范围，使其可覆盖周边的敌方舰船。'),
    'Anti-Aircraft Support': (
        '防空协助', '防空',
        '系统内所有武器锁定同行敌机并发动攻击，每30秒使命中提升0%，持续25秒。',
        '定期协助己方战舰进行防空的策略。'),
    'Concentrated Attacks': (
        '集中打击', '集火',
        '优先攻击超主力舰，每30秒使每轮攻击次数增加2次、攻击持续时间提升30%、冷却时间提升30%，持续40秒。',
        '单轮装填更多弹药，对大型目标发动集中打击的策略。'),
    'Focus Cannon Fire': (
        '火力集中', '集火',
        '使所有火炮武器与本系统同步，每90秒使冷却时间下降80%，持续8秒。',
        '协调系统内火炮武器打击同一目标的作战策略。'),
    'Focused Attacks': (
        '集火攻击', '集火',
        '使系统内所有武器同步并优先攻击护卫舰与驱逐舰，进入机动模式，每30秒使命中提升40%、闪避提升300%，持续15秒。',
        '短时间集中系统内所有火力打击单一目标的打击策略，提高对目标的消灭能力。'),
    'Intensified Combustion Enhancement': (
        '燃烧效率强化', '常规',
        '使载机主武器选择目标时间下降30%',
        '提升载机引擎的加力燃烧功率，使其在飞行中获得更高的速度提升。'),
    'Morale Booster': (
        '士气激励', '增益',
        '敌方每损失一艘巡洋舰，使本系统武器冷却时间下降85%，持续10秒。',
        '敌方巡洋舰被击毁时，即时强化本系统武器的作战效能。'),
    'Navigational Computer Enhancement': (
        '导航计算机强化', '常规',
        '常规移动速度提升7%，曲率移动速度(亚光速前进速度)提升7%',
        '提升导航计算机的运算能力，可对单台引擎进行精确控制，提高舰船推进系统的效率。'),
    'Prioritize Firepower': (
        '优先火力', '频率',
        '每90秒使主武器冷却时间下降0%，并关闭系统内其他武器，持续15秒。',
        '通过暂时关闭其他武器系统来保障主武器运作的作战策略。'),
    'Prioritize Targets': (
        '优先打击', '集火',
        '敌方舰队包含航空母舰时，优先攻击该目标。',
        '优先打击敌方航空母舰的作战策略。'),
    'Rapid-Fire': (
        '快速射击', '频率',
        '每60秒使主武器射击时间和冷却时间下降50%，持续15秒。冷却10秒。',
        '通过暂时超载武器实现高速射击的作战策略。'),
    'Target Confirmation': (
        '目标确认', '命中',
        '主武器目标为城市或基地时，射击冷却时间提升30%，并使舰船载机/无人机有35%概率额外造成0%伤害。',
        '攻击城防目标时，加装制导系统以提高发现弱点的概率。'),
    'Thruster Masking': (
        '推进器遮蔽', '闪避',
        '提升对方武器锁定时间40%',
        '对战机引擎出口进行遮蔽处理，大大降低被对方雷达发现和锁定的时间。'),
    'Warehouse Expansion': (
        '仓储扩容', '仓储',
        '模块仓储容量提升80%',
        '改造并扩容仓储模块容量，提升货物承载量。'),
    'Desperate Measures II': (
        '背水一战II', '集火',
        '战斗中当敌方舰队指挥值高于自身20%时，优先攻击2个生命值最低的目标。',
        '在劣势局面下集中火力打击敌方最薄弱环节、以求突破的作战策略。'),
    'Concentrated Strike': (
        '载机集火', '集火',
        '战斗开始后，所携带载机在前4轮攻击中锁定同一目标，并使载机闪避率提升50%。',
        '将战场态势与载机同步，在战斗初期对单一目标实施集中火力的战术。'),
    'Range Extension': (
        '打击范围扩展', '战略',
        '战略打击半径+10',
        '提升在更大、更复杂空间中的探测能力。'),
    'Counter-Attack Info Gathering': (
        '反击信息收集', '闪避',
        '被直射武器(近战武器)命中率下降15%',
        '对敌方火炮、脉冲武器与离子炮进行信号探测，在敌方攻击前获取攻击信号，并与引擎系统同步，实现及时的规避机动。'),
    'Light Ammo': (
        '轻质弹药', '命中',
        '目标为护卫舰时，命中率提升30%，攻击冷却时间下降50%，伤害下降40%。',
        '目标为护卫舰时，换装更小的弹药以提升命中率与射速。'),
    'Focus Aircraft Fire': (
        '载机集火打击', '集火',
        '使所有载机与本武器系统同步，每90秒使冷却时间下降60%，持续25秒。',
        '协调载机打击同一目标的作战策略。'),
    'Pursue Targets': (
        '追击目标', '集火',
        '目标生命值低于20%时，单轮攻击次数增加1次，攻击间隔下降40%。',
        '对已受重创的敌方目标进行追击。'),
}


def colnum(ref):
    n = 0
    for ch in COL.match(ref).group(1):
        n = n * 26 + (ord(ch) - 64)
    return n


def read_xlsx_enhancements(path):
    """读 Enhancements 表（sheet6），返回行字典列表"""
    z = zipfile.ZipFile(path)
    shared = []
    root = ET.fromstring(z.read('xl/sharedStrings.xml'))
    for si in root.iter(NS + 'si'):
        shared.append(''.join(t.text or '' for t in si.iter(NS + 't')))
    root = ET.fromstring(z.read('xl/worksheets/sheet6.xml'))
    table = []
    for row in root.iter(NS + 'row'):
        cells = {}
        for c in row.iter(NS + 'c'):
            ref = c.get('r') or ''
            if not COL.match(ref):
                continue
            t = c.get('t')
            v = c.find(NS + 'v')
            if t == 's' and v is not None:
                val = shared[int(v.text)]
            elif t == 'inlineStr':
                val = ''.join(x.text or '' for x in c.iter(NS + 't'))
            else:
                val = v.text if v is not None else None
            cells[colnum(ref)] = val
        w = max(cells) if cells else 0
        table.append([cells.get(i + 1) for i in range(w)])
    hdr = [(h or '').replace('\n', ' ').strip() for h in table[1]]
    out = []
    for r in table[2:]:
        if not any(x not in (None, '') for x in r):
            continue
        out.append({hdr[i]: (r[i] if i < len(r) else None) for i in range(len(hdr))})
    return out


def load_cfg():
    tree = json.load(open(os.path.join(CFG_DIR, '_Tb_cfg_system_enhance_tree.json'), encoding='utf-8'))['_Tb_cfg_system_enhance_tree']
    enh = json.load(open(os.path.join(CFG_DIR, '_Tb_cfg_system_enhance.json'), encoding='utf-8'))['_Tb_cfg_system_enhance']
    return tree, enh


def load_official_text():
    """读游戏官方文案（res_4.npk 里的 language/zh_CN/tb_cfg_system_effect.txt）。

    文案以效果 id 为键，格式为 `cfg_system_effect#<字段>#<id>::<中文>`。
    强化节点 id 不是效果 id，需要用 _Tb_cfg_system_enhance 的 SYSTEM_EFFECT_PREFIX
    拼出：effect_id = str(SYSTEM_EFFECT_PREFIX) + '01'。
    返回 {(field, id): text}。
    """
    path = LANG_TXT
    if not os.path.exists(path):
        npk = LANG_NPK if os.path.exists(LANG_NPK) else None
        if npk is None:
            raise SystemExit('缺少官方文案：%s（也没有 %s）' % (path, LANG_NPK))
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
        from npk_extract import NpkReader
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with NpkReader(npk) as r:
            data = r.read(LANG_NAME_IN_NPK)
        with open(path, 'wb') as f:
            f.write(data)
        print('已从 %s 提取官方文案 -> %s' % (npk, path))
    out = {}
    for line in open(path, encoding='utf-8'):
        if '::' not in line:
            continue
        key, val = line.rstrip('\r\n').split('::', 1)
        parts = key.split('#')
        if len(parts) == 3 and parts[0] == 'cfg_system_effect':
            out[(parts[1], parts[2])] = val
    return out


def official_effect_id(enh_row):
    """由强化表行推出官方效果 id；无法推出时返回 None。"""
    if not isinstance(enh_row, dict):
        return None
    pfx = enh_row.get('SYSTEM_EFFECT_PREFIX')
    if pfx is None:
        return None
    return '%s01' % pfx


PLACEHOLDER_RE = re.compile(r'\{[^}]*\}')


def parse_tree(tree, pid):
    v = tree.get(pid)
    if not v:
        return None
    body, _, lv = v[0].partition(';')
    try:
        ul = int(lv.strip().rstrip(';'))          # 值有两种写法："父;等级" 与 "父;等级;"
    except Exception:
        ul = 0
    pars = [x.strip() for x in body.split(',') if x.strip() and x.strip() != '0']
    kind = v[1] if len(v) > 1 else 0
    if kind not in (1, 2):
        kind = 0
    return pars, ul, kind


def coststr(v):
    return ','.join(str(x) for x in v) if isinstance(v, list) else ('' if v is None else str(v))


def dedupe(rows):
    seen, out = set(), []
    for r in rows:
        k = (r.get('Name'), r.get('Progess'), r.get('Nb'), r.get('Max'))
        if k not in seen:
            seen.add(k)
            out.append(r)
    return out


def greedy_match(costs, ids, rows):
    """先把成本序列做 LCS 锚定，再给没锚上的节点就近补同行成本的空行。

    有些舰船 xlsx 的 Progess 与 cfg 的 ENHANCE_COST 数值不同（等级数却一致），
    最后再按「等级数相同」顺序兜一层。
    """
    a = [c for c in costs]
    b = [(r.get('Progess') or '') for r in rows]
    sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
    res, used = {}, set()
    for a0, b0, n in sm.get_matching_blocks():
        for k in range(n):
            res[ids[a0 + k]] = rows[b0 + k]
            used.add(b0 + k)
    for i, cid in enumerate(ids):
        if cid in res:
            continue
        for k, r in enumerate(rows):
            if k not in used and (r.get('Progess') or '') == a[i]:
                res[cid] = r
                used.add(k)
                break
    # 兜底：等级数一致即认（顺序对齐）
    for i, cid in enumerate(ids):
        if cid in res:
            continue
        nlev = len(a[i].split(',')) if a[i] else 0
        for k, r in enumerate(rows):
            if k in used:
                continue
            prog = r.get('Progess') or ''
            if prog and len(prog.split(',')) == nlev:
                res[cid] = r
                used.add(k)
                break
    return res


def nums(s):
    return set(re.findall(r'\d+(?:\.\d+)?', s or ''))


def build_layout(tree, enh, system_id, keep=None):
    """返回该系统内所有可渲染节点的 (ul, cl, rw, kind, pars, cost)

    收哪些节点：在 tree 表里的、被别的节点引用为前置的、以及站内已有的（keep）。
    其余同前缀节点（如 [0] 成本的系统有限维修变体）不进树。
    """
    keep = keep or set()
    ids = sorted(k for k in enh if k.startswith(system_id) and len(k) == len(system_id) + 2)
    info = {}
    for i in ids:
        if enh[i].get('ENHANCE_COST') is None:
            continue
        t = parse_tree(tree, i)
        if t is None and i not in keep:
            continue
        info[i] = {'cost': enh[i]['ENHANCE_COST'], 'tag': enh[i].get('ENHANCE_LIMIT_TAG'),
                   'dl': enh[i].get('ENHANCE_DEFAULT_LEVEL'), 'pfx': enh[i].get('SYSTEM_EFFECT_PREFIX')}
        if t is None:
            info[i].update(ul=-2, pars=[], kind=0)
        else:
            info[i].update(ul=t[1], pars=[p for p in t[0] if p in enh], kind=t[2])
    # 收拢所有被引用为前置的节点（无论是否在 tree 里）
    changed = True
    while changed:
        changed = False
        for i in list(info):
            for p in info[i]['pars']:
                if p.startswith(system_id) and len(p) == len(system_id) + 2 and p not in info and enh.get(p, {}).get('ENHANCE_COST') is not None:
                    t = parse_tree(tree, p)
                    info[p] = {'cost': enh[p]['ENHANCE_COST'], 'tag': enh[p].get('ENHANCE_LIMIT_TAG'),
                               'dl': enh[p].get('ENHANCE_DEFAULT_LEVEL'), 'pfx': enh[p].get('SYSTEM_EFFECT_PREFIX')}
                    info[p].update(ul=(t[1] if t else -2), pars=([x for x in t[0] if x in enh] if t else []), kind=(t[2] if t else 0))
                    changed = True
    # cl = 前置最大列 + 1
    cl = {}
    for _ in range(len(info) + 2):
        ch = False
        for i in info:
            ps = [p for p in info[i]['pars'] if p in cl]
            need = (max(cl[p] for p in ps) + 1) if ps else 0
            if info[i]['ul'] == -2:
                need = 0
            if cl.get(i) != need:
                cl[i] = need
                ch = True
        if not ch:
            break
    # rw = 每个 (cl, ul) 分组首次出现的行号
    children = collections.defaultdict(list)
    for i in info:
        for p in info[i]['pars']:
            children[p].append(i)
    for k in children:
        children[k].sort()
    roots = sorted(i for i in info if not [p for p in info[i]['pars'] if p in info])
    seen, order = set(), []

    def dfs(n):
        if n in seen:
            return
        seen.add(n)
        order.append(n)
        for c in children.get(n, []):
            dfs(c)
    for r in roots:
        dfs(r)
    for i in sorted(info):
        dfs(i)
    rows = collections.defaultdict(dict)
    for i in order:
        rows[cl[i]].setdefault(info[i]['ul'], len(rows[cl[i]]))
    for i in info:
        info[i]['cl'] = cl[i]
        info[i]['rw'] = rows[cl[i]][info[i]['ul']]
    return info


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--write', action='store_true')
    args = ap.parse_args()

    tree, enh = load_cfg()
    official = load_official_text()
    xrows = read_xlsx_enhancements(XLSX)
    cur = json.load(open(TEXT_BASE if os.path.exists(TEXT_BASE) else JSON_OUT, encoding='utf-8'))
    namemap = json.load(open(os.path.join(ROOT, 'public', 'games', 'ship_name_map.json'), encoding='utf-8'))['映射']

    x_by_ship = collections.defaultdict(lambda: collections.defaultdict(list))
    for r in xrows:
        x_by_ship[r['Ship']][r['Group']].append(r)

    # --- 第一遍：对齐现有节点，建 English -> 中文 词典 ---
    name2zh, desc2zh, det2zh, desc2lb, pfx2triple = {}, {}, {}, {}, {}
    desc2name, det2name = {}, {}
    for ship, sv in cur.items():
        en = namemap.get(ship)
        if not en or en not in x_by_ship:
            continue
        for sysn, sysv in sv['systems'].items():
            sid = sysv.get('id')
            if not sid:
                continue
            layout = build_layout(tree, enh, sid, {t2['id'] for t2 in sysv['techs']})
            ids = sorted(layout)
            if not ids:
                continue
            costs = [coststr(layout[i]['cost']) for i in ids]
            ds = {t['id']: t for t in sysv['techs']}
            best = (-1, -1.0, -1, None, None)
            need = collections.Counter(costs)
            for gname, rows in x_by_ship[en].items():
                rr = dedupe(rows)
                mp = greedy_match(costs, ids, rr)
                hit = tot = 0
                for cid, row in mp.items():
                    t = ds.get(cid)
                    if not t or not t.get('ds'):
                        continue
                    tot += 1
                    a, b = nums(t['ds']), nums(row.get('Description'))
                    if a and b and (a & b):
                        hit += 1
                got = collections.Counter((r.get('Progess') or '') for r in rr)
                overlap = sum(min(need[c], got[c]) for c in need) / max(1, len(costs))
                fits = 1 if len(rr) >= len(ids) else 0
                score = (hit, overlap, fits, gname, rr)
                if score[:3] > best[:3]:
                    best = score
            if best[3] is None:
                continue
            sysv['_group'] = best[3]
            sysv['_rows'] = best[4]
            mp = greedy_match(costs, ids, sysv['_rows'])
            sysv['_map'] = mp
            for cid, row in mp.items():
                t = ds.get(cid)
                if not t:
                    continue
                tr = (row.get('Name') or '', row.get('Description') or '', row.get('Detail') or '')
                if t.get('n'):
                    name2zh.setdefault(tr[0], collections.Counter())[t['n']] += 1
                if t.get('ds'):
                    desc2zh.setdefault(tr[1], collections.Counter())[t['ds']] += 1
                    desc2lb.setdefault(tr[1], collections.Counter())[t.get('lb') or ''] += 1
                if t.get('d'):
                    det2zh.setdefault(tr[2], collections.Counter())[t['d']] += 1
                    det2name.setdefault(tr[2], collections.Counter())[t['n']] += 1
                if t.get('n'):
                    desc2name.setdefault(tr[1], collections.Counter())[t['n']] += 1
                if layout[cid]['pfx'] is not None:
                    pfx2triple.setdefault(layout[cid]['pfx'], collections.Counter())[tr] += 1

    def zh_of(counter, key):
        c = counter.get(key)
        return c.most_common(1)[0][0] if c else None

    # --- 第二遍：重建 ---
    added = kept = 0
    report = collections.Counter()
    out = {}
    for ship, sv in cur.items():
        sv2 = {k: v for k, v in sv.items() if k != 'systems'}
        sys2 = {}
        for sysn, sysv in sv['systems'].items():
            sid = sysv.get('id')
            layout = build_layout(tree, enh, sid, {t2['id'] for t2 in sysv['techs']}) if sid else {}
            rows = sysv.get('_rows') or []
            mp = sysv.get('_map') or {}
            existing = {t['id']: t for t in sysv['techs']}
            techs = []
            for cid in sorted(layout):
                li = layout[cid]
                t = existing.get(cid)
                if t is None:
                    # 新节点：文字取 xlsx
                    row = mp.get(cid)
                    if row is None and li['pfx'] is not None and pfx2triple.get(li['pfx']):
                        row = None
                    tr = (row.get('Name') or '', row.get('Description') or '', row.get('Detail') or '') if row else None
                    if tr is None:
                        # 用同特效前缀的已有节点文案
                        cand = pfx2triple.get(li['pfx'])
                        if cand:
                            tr = cand.most_common(1)[0][0]
                            report['by-prefix'] += 1
                        else:
                            tr = ('', '', '')
                            report['no-text'] += 1
                    zname = name2zh.get(tr[0], collections.Counter()).most_common(1)
                    zdesc = desc2zh.get(tr[1], collections.Counter()).most_common(1)
                    zdet = det2zh.get(tr[2], collections.Counter()).most_common(1)
                    extra = ZH_EXTRA.get(tr[0])
                    if zname:
                        n = zname[0][0]
                    elif desc2name.get(tr[1]):
                        n = desc2name[tr[1]].most_common(1)[0][0]
                        report['name-by-desc'] += 1
                    elif extra:
                        n = extra[0]
                    else:
                        n = tr[0]
                        if n:
                            report['name-english'] += 1
                    lb = (desc2lb.get(tr[1], collections.Counter()).most_common(1) or [('', 0)])[0][0] or (extra[1] if extra else '')
                    dsx = zdesc[0][0] if zdesc else (extra[2] if extra else tr[1])
                    dtx = zdet[0][0] if zdet else (extra[3] if extra else tr[2])
                    t = {'id': cid, 'n': n, 'lb': lb,
                         'ic': ('icon_system_intensify_%s.png' % li['pfx']) if li['pfx'] is not None else '',
                         'mx': len(li['cost']) if li['cost'] else 0, 'ct': li['cost'],
                         'ds': dsx, 'd': dtx, 'c': li['kind']}
                    if li['pars']:
                        t['pq'] = [[p, li['ul']] for p in li['pars']]
                    if li['dl'] is not None:
                        t['dl'] = li['dl']
                    added += 1
                    if not n:
                        report['empty-name'] += 1
                else:
                    t = dict(t)
                    kept += 1

                # 官方文案覆盖：名称以游戏原文为准（xlsx 对齐会把名字配错），
                # 描述只在站内为空、且官方文本不含 {参数} 占位符时补。
                eid = official_effect_id(enh.get(cid))
                if eid is not None:
                    off_name = official.get(('name', eid))
                    if off_name:
                        if not t.get('n'):
                            report['official-fill-name'] += 1
                        elif t['n'] != off_name:
                            report['official-fix-name'] += 1
                        t['n'] = off_name
                    if not t.get('ds'):
                        off_desc = official.get(('desc', eid))
                        if off_desc and not PLACEHOLDER_RE.search(off_desc):
                            t['ds'] = off_desc
                            report['official-fill-desc'] += 1
                    if not t.get('d'):
                        off_detail = official.get(('desc_detail', eid))
                        if off_detail and not PLACEHOLDER_RE.search(off_detail):
                            t['d'] = off_detail
                            report['official-fill-detail'] += 1

                t['ul'] = li['ul']
                t['cl'] = li['cl']
                t['rw'] = li['rw']
                if li['pars']:
                    t['pq'] = [[p, li['ul']] for p in li['pars']]
                else:
                    t.pop('pq', None)
                t['c'] = li['kind']
                techs.append(t)
            s2 = {k: v for k, v in sysv.items() if not k.startswith('_')}
            s2['techs'] = techs
            sys2[sysn] = s2
        sv2['systems'] = sys2
        out[ship] = sv2

    print('节点：保留 %d，新增 %d' % (kept, added))
    print('新增节点文字来源:', dict(report))
    print('词典规模: 名称 %d / 描述 %d / 详述 %d' % (len(name2zh), len(desc2zh), len(det2zh)))
    empty = sum(1 for sh in out.values() for sy in sh['systems'].values() for t in sy['techs'] if not t.get('n'))
    print('最终仍无名称的节点:', empty)
    tot = sum(len(sy['techs']) for sh in out.values() for sy in sh['systems'].values())
    print('总节点数:', tot)

    if not args.write:
        print('\n(dry-run，未写文件)')
        return
    stamp = time.strftime('%Y%m%d-%H%M%S')
    bak_dir = os.path.join(ROOT, 'ops', 'bak')          # 备份放 public 外面，免得被当静态资源部署
    os.makedirs(bak_dir, exist_ok=True)
    shutil.copy2(JSON_OUT, os.path.join(bak_dir, os.path.basename(JSON_OUT) + '.bak-' + stamp))
    shutil.copy2(JS_OUT, os.path.join(bak_dir, os.path.basename(JS_OUT) + '.bak-' + stamp))
    old_js = open(JS_OUT, encoding='utf-8').read()
    head = old_js[:old_js.index('window.OFFICIAL_ENHANCE')]
    payload = json.dumps(out, ensure_ascii=False, separators=(',', ':'))
    open(JSON_OUT, 'w', encoding='utf-8').write(payload)
    open(JS_OUT, 'w', encoding='utf-8').write(head + 'window.OFFICIAL_ENHANCE = ' + payload + ';\n')
    print('\n已写入（备份后缀 %s）' % stamp)


if __name__ == '__main__':
    main()
