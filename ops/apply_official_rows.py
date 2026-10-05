# -*- coding: utf-8 -*-
"""按官方 ui_level 重排强化树行，并拆开同格重叠、清掉残余交叉

行分配（唯一依据：树配置 PARENT_ENHANCE_ID 里自带的 ui_level）
    行序 = 树配置 ui_level 按 LEVEL_ENHANCE_HIGHT 降序排名（画面 y 轴向下）
    HIGHT: THIRD(4)=4 > UP(2)=2 > COMMON(0)=1 > DOWN(3)=0
    即同一系统内出现过的 ui 值，按 4 > 2 > 0 > 3 排序后依次占 行0、行1、行2、行3。
    验证：6010101 官方截图 = 行0 命中命中系统结构系统结构 / 行1 伤害伤害暴击 / 行2 频率攻城，逐一吻合。

同格重叠：同一 (行,列) 多于一个节点时，把多出来的那个挪到最近的空格（先试上下，
    再试左右，位移小者优先），并要求不引入新交叉。

残余交叉：列不动，节点行在 ±2 内局部搜索，只在缺陷数下降时落子。
"""
import sys, os, json, time, argparse, shutil, collections
sys.stdout.reconfigure(encoding='utf-8')
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'ops'))
import fix_tree_crossings as F

CFG = r'D:\ai\assets\星际猎人_蓝图加点解包\config'
DATA = os.path.join(ROOT, 'public', 'games', 'official_enhance.json')
DATA_JS = os.path.join(ROOT, 'public', 'games', 'official_enhance_data.js')
BAK = os.path.join(ROOT, 'ops', 'bak')

# ui_level → 高度（越大越靠上）
UI_HIGHT = {4: 4, 2: 2, 0: 1, 3: 0}


def score2(techs, row, cl, links):
    """缺陷分 + 行跨度惩罚（跨度只在缺陷分相同时起作用，不影响清零）。"""
    return F.score(techs, row, cl, links) + 0.01 * (max(row.values()) if row else 0)


def load_tree_ui():
    p = os.path.join(CFG, '_Tb_cfg_system_enhance_tree.json')
    t = json.load(open(p, encoding='utf-8'))['_Tb_cfg_system_enhance_tree']
    out = {}
    for k, v in t.items():
        s = v[0] if isinstance(v, (list, tuple)) else str(v)
        parts = s.split(';')
        try:
            out[int(k)] = int(parts[1])
        except Exception:
            continue
    return out


def official_rows(techs, ui_of):
    """按 ui_level 排名得到行号；缺 ui 的节点退回原行。"""
    tree = [t for t in techs if t.get('ul') != -2]
    present = sorted({UI_HIGHT[u] for t in tree
                      for u in [ui_of.get(int(t['id']))] if u is not None}, reverse=True)
    rank = {h: i for i, h in enumerate(present)}
    rows = {}
    for t in tree:
        u = ui_of.get(int(t['id']))
        if u is None:
            rows[t['id']] = t.get('rw', 0)
        else:
            rows[t['id']] = rank[UI_HIGHT[u]]
    return rows


def repair_overlaps(techs, row, cl):
    """同格多于一个时，把多出来的挪到最近空格，不引入新缺陷。"""
    tree = [t for t in techs if t.get('ul') != -2]
    links = F.links_of(techs)
    moved = 0
    for _ in range(len(tree) * 3):
        cells = collections.defaultdict(list)
        for i in row:
            cells[(row[i], cl[i])].append(i)
        hit = next((k for k, v in cells.items() if len(v) > 1), None)
        if hit is None:
            break
        base_def = F.defects(techs, row, cl, links)[0]
        done = False
        # 保留"有名字、有图标"的那个在原位，其余外移
        group = sorted(cells[hit], key=lambda i: (0 if techs_by_id[i].get('lb') else 1, i))
        for nid in group[1:] + group[:1]:
            cands = []
            for dr in (1, -1, 2, -2):
                for dc in (0, -1, 1):
                    nr, nc = row[nid] + dr, cl[nid] + dc
                    if nr < 0 or nc < 0:
                        continue
                    if any(j != nid and row[j] == nr and cl[j] == nc for j in row):
                        continue
                    saved = (row[nid], cl[nid])
                    row[nid], cl[nid] = nr, nc
                    d = F.defects(techs, row, cl, links)[0]
                    row[nid], cl[nid] = saved
                    cands.append((d, abs(dr) + abs(dc), dr, dc))
            if not cands:
                continue
            d, _w, dr, dc = min(cands)
            if d > base_def:
                continue
            row[nid] += dr
            cl[nid] += dc
            moved += 1
            done = True
            break
        if not done:
            break
    return moved


def polish(techs, row, cl, budget=400000, hi=None, allow_col=False):
    """列（默认不动）、行 ±2 的局部搜索，只在缺陷分下降时落子。"""
    tree = [t for t in techs if t.get('ul') != -2]
    links = F.links_of(techs)
    if hi is None:
        hi = max(row.values()) + 2
    deltas = [(-2, 0), (-1, 0), (1, 0), (2, 0)]
    if allow_col:
        deltas += [(-1, -1), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 1)]
    cur = score2(techs, row, cl, links)
    states = [0]
    for _ in range(max(6, len(tree) * 3)):
        if cur == 0 or states[0] > budget:
            break
        best = None
        for t in sorted(tree, key=lambda x: (cl[x['id']], x['id'])):
            nid = t['id']
            orow, ocol = row[nid], cl[nid]
            for dr, dc in deltas:
                nr, nc = orow + dr, ocol + dc
                if nr < 0 or nr > hi or nc < 0:
                    continue
                if any(j != nid and row[j] == nr and cl[j] == nc for j in row):
                    continue
                row[nid], cl[nid] = nr, nc
                states[0] += 1
                n2 = score2(techs, row, cl, links)
                if n2 < cur and (best is None or n2 < best[0]):
                    best = (n2, nid, nr, nc)
                row[nid], cl[nid] = orow, ocol
        if best is None:
            break
        n2, nid, nr, nc = best
        row[nid], cl[nid] = nr, nc
        cur = n2
    return cur


def deep_fix(techs, row, cl, hi=6, budget=1500000):
    """兜底：列不动、行 0..hi 的 DFS 精确搜索（小系统适用），找到 0 缺陷解即停。"""
    tree = [t for t in techs if t.get('ul') != -2]
    links = F.links_of(techs)
    by_col = collections.defaultdict(list)
    for t in sorted(tree, key=lambda x: (cl[x['id']], row[x['id']], x['id'])):
        by_col[cl[t['id']]].append(t['id'])
    order = [i for c in sorted(by_col) for i in by_col[c]]
    best = [score2(techs, row, cl, links), dict(row)]
    states = [0]

    def dfs(i, cur):
        if states[0] > budget:
            return False
        if i == len(order):
            states[0] += 1
            n = score2(techs, cur, cl, links)
            if n < best[0]:
                best[0] = n
                best[1] = dict(cur)
            return n == 0
        nid = order[i]
        old = row[nid]
        for r in range(0, hi + 1):
            if any(cur[j] == r and cl[j] == cl[nid] for j in cur):
                continue
            cur[nid] = r
            states[0] += 1
            if dfs(i + 1, cur):
                return True
            del cur[nid]
        return False

    dfs(0, {})
    return best[0], best[1]


def plateau_fix(techs, row, cl, restarts=24, iters=160, seed=20261004, hi=None,
                col_window=2, deadline=None):
    """兜底：单节点（行 ±3 / 列 ±col_window）的随机爬山，允许等分移动走出平台。"""
    import random
    rnd = random.Random(seed)
    tree = [t for t in techs if t.get('ul') != -2]
    links = F.links_of(techs)
    if hi is None:
        hi = max(row.values()) + 2
    max_col = max(cl.values()) if cl else 0
    base = dict(row)
    best = dict(row)
    best_n = score2(techs, row, cl, links)
    if F.score(techs, row, cl, links) == 0:
        return best_n, best
    n_tree = max(1, len(tree))
    restarts = max(3, min(restarts, 600 // n_tree))
    iters = max(30, min(iters, 2400 // n_tree))
    for rs in range(restarts):
        if deadline is not None and time.time() > deadline:
            break
        cur = dict(base) if rs % 2 == 0 else dict(best)
        n = score2(techs, cur, cl, links)
        for _ in range(iters):
            if deadline is not None and time.time() > deadline:
                break
            if F.score(techs, cur, cl, links) == 0:
                return score2(techs, cur, cl, links), cur
            opts = []
            for t in tree:
                nid = t['id']
                orow, ocol = cur[nid], cl[nid]
                for dr in (-3, -2, -1, 1, 2, 3):
                    for dc in (0, -1, 1, -2, 2):
                        if abs(dc) > col_window:
                            continue
                        nr, nc = orow + dr, ocol + dc
                        if nr < 0 or nr > hi or nc < 0 or nc > max_col:
                            continue
                        if any(j != nid and cur[j] == nr and cl[j] == nc for j in cur):
                            continue
                        cur[nid], cl[nid] = nr, nc
                        n2 = score2(techs, cur, cl, links)
                        cur[nid], cl[nid] = orow, ocol
                        if n2 <= n:
                            opts.append((n2, nid, nr, nc))
            if not opts:
                break
            m = min(o[0] for o in opts)
            pool = [o for o in opts if o[0] == m]
            n2, nid, nr, nc = pool[rnd.randrange(len(pool))]
            cur[nid], cl[nid] = nr, nc
            n = n2
            if n < best_n:
                best_n = n
                best = dict(cur)
        if F.score(techs, best, cl, links) == 0:
            break
    return best_n, best


def normalize_rows(row):
    """把实际用到的行号压成连续 0..k（保持相对顺序），避免空行导致画面松散。"""
    used = sorted(set(row.values()))
    remap = {r: i for i, r in enumerate(used)}
    return {i: remap[r] for i, r in row.items()}


def compact_rows(techs, row, cl):
    """在缺陷分不升高的前提下，把中间的空行逐个消掉。"""
    links = F.links_of(techs)
    cur = score2(techs, row, cl, links)
    row = dict(row)
    for _ in range(8):
        used = set(row.values())
        gap = next((r for r in range(0, (max(used) if used else 0) + 1) if r not in used), None)
        if gap is None:
            break
        cand = {i: (v - 1 if v > gap else v) for i, v in row.items()}
        s = score2(techs, cand, cl, links)
        if s <= cur:
            row, cur = cand, s
        else:
            break
    return row


techs_by_id = {}


def main():
    ap = argparse.ArgumentParser(description='按官方 ui_level 重排强化树')
    ap.add_argument('--write', action='store_true')
    ap.add_argument('--limit', type=int, default=0)
    args = ap.parse_args()

    ui_of = load_tree_ui()
    data = json.load(open(DATA, encoding='utf-8'))
    systems = [(sh, nm, sy) for sh, sv in data.items() for nm, sy in sv['systems'].items()]
    if args.limit:
        systems = systems[:args.limit]
    st = collections.Counter()
    hard = []
    t0 = time.time()
    for sh, nm, sy in systems:
        techs = sy['techs']
        global techs_by_id
        techs_by_id = {t['id']: t for t in techs}
        tree = [t for t in techs if t.get('ul') != -2]
        cl = {t['id']: t.get('cl', 0) for t in tree}
        row0 = {t['id']: t.get('rw', 0) for t in tree}
        links = F.links_of(techs)
        st['前交叉'] += F.defects(techs, row0, cl, links)[0]
        st['前重叠'] += F.collisions(row0, cl)

        row = official_rows(techs, ui_of)
        if all(i in row for i in row0):
            row0_missing = [i for i in row0 if i not in row]
            for i in row0_missing:
                row[i] = row0[i]
        st['ui交叉'] += F.defects(techs, row, cl, links)[0]
        st['ui重叠'] += F.collisions(row, cl)

        st['挪动'] += repair_overlaps(techs, row, cl)
        st['修后重叠'] += F.collisions(row, cl)
        hi0 = max(row.values()) if row else 2
        cur = F.score(techs, row, cl, links)
        cur = polish(techs, row, cl, hi=hi0)
        if F.score(techs, row, cl, links):
            cur = polish(techs, row, cl, hi=hi0 + 1)
        if F.score(techs, row, cl, links):
            cur = polish(techs, row, cl, hi=hi0 + 1, allow_col=True)
        if F.score(techs, row, cl, links):
            n2, row2 = plateau_fix(techs, row, cl, hi=hi0 + 2,
                                   deadline=time.time() + 6)
            if F.score(techs, row2, cl, links) <= F.score(techs, row, cl, links):
                row = row2
        # 行号压缩会改变几何，可能带出新缺陷 → 压缩后重跑，直到稳定
        for _round in range(3):
            if F.score(techs, row, cl, links) == 0:
                break
            n2, row2 = plateau_fix(techs, row, cl, restarts=16, iters=120, hi=hi0 + 3,
                                   deadline=time.time() + 4)
            if F.score(techs, row2, cl, links) < F.score(techs, row, cl, links):
                row = row2
        raw_row = dict(row)
        c0, to0, nh0 = F.defects(techs, raw_row, cl, links)
        flat = compact_rows(techs, normalize_rows(raw_row), cl)
        cf, tof, nhf = F.defects(techs, flat, cl, links)
        if (cf + nhf * 1000, F.collisions(flat, cl)) <= (c0 + nh0 * 1000, F.collisions(raw_row, cl)):
            row, c, to, nh = flat, cf, tof, nhf
        else:
            row, c, to, nh = raw_row, c0, to0, nh0
        st['后交叉'] += c
        st['后重合'] += to
        st['后压节点'] += nh
        st['后重叠'] += F.collisions(row, cl)
        st['最大行'] = max(st['最大行'], max(row.values()) if row else 0)
        for t in tree:
            t['rw'] = row[t['id']]
            t['cl'] = cl[t['id']]
        if c or nh or F.collisions(row, cl):
            hard.append('%s / %s 交叉%d 压节点%d 重叠%d'
                        % (sh, nm, c, nh, F.collisions(row, cl)))

    print('系统 %d | 用时 %.1fs' % (len(systems), time.time() - t0))
    print('改前：交叉 %d 重叠 %d' % (st['前交叉'], st['前重叠']))
    print('按官方 ui 行：交叉 %d 重叠 %d' % (st['ui交叉'], st['ui重叠']))
    print('拆重叠挪动 %d 次 → 重叠 %d' % (st['挪动'], st['修后重叠']))
    print('局部修正后：交叉 %d 重合 %d 压节点 %d 重叠 %d | 最大行 %d'
          % (st['后交叉'], st['后重合'], st['后压节点'], st['后重叠'], st['最大行']))
    if hard:
        print('未清零 %d 个系统:' % len(hard))
        for h in hard[:20]:
            print('   ', h)
    if not args.write:
        print('(未写盘)')
        return
    if st['后交叉'] or st['后压节点'] or st['后重叠']:
        print('仍有硬缺陷，不写盘')
        return
    stamp = time.strftime('%Y%m%d-%H%M%S')
    os.makedirs(BAK, exist_ok=True)
    for p in (DATA, DATA_JS):
        shutil.copy2(p, os.path.join(BAK, '%s.%s' % (os.path.basename(p), stamp)))
    json.dump(data, open(DATA, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    raw = open(DATA_JS, encoding='utf-8').read()
    head = raw[:raw.index('{')]
    with open(DATA_JS, 'w', encoding='utf-8', newline='') as f:
        f.write(head)
        json.dump(data, f, ensure_ascii=False, separators=(',', ':'))
    print('已写入（备份后缀 %s）' % stamp)


if __name__ == '__main__':
    main()