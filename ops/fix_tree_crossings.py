# -*- coding: utf-8 -*-
"""消除强化树连线交叉：最小扰动地重排行分配（列不动、行 ±1、保持同列顺序）

判据（与 enhance.js drawLines 逐条对齐，浏览器实测同口径）
- 节点 76×76，列距 122、行距 90；六边形排在树下方一行，列按出现顺序
- 同行相邻列 → 横线；相邻列跨行 → 两角 45° 斜线；同列相邻行 → 竖线；其余 → 走行缝的折线
- 主干竖线在最左列左边缘 -26，接入段只画到最左一列
- 缺陷 = 真交叉（共享端点/共线不算）+ 共线重合 + 线段压节点 + 同格重叠

约束（防止图标乱序，这是上一版翻车的地方）
- cl 列号一律不动
- 每节点行号只允许在原始值 ±1 内调整（候选按 |Δ| 从小到大）
- 同一列内节点的上下顺序保持不变
- 同格唯一

求解：按列从左到右 DFS + 剪枝（已闭合的连线一旦出现缺陷立即回退），
先试 ±1，无解再放宽到 ±2；找到 0 缺陷即停。
"""
import sys, os, json, time, random, argparse, shutil, collections

sys.stdout.reconfigure(encoding='utf-8')
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'public', 'games', 'official_enhance.json')
DATA_JS = os.path.join(ROOT, 'public', 'games', 'official_enhance_data.js')
BAK = os.path.join(ROOT, 'ops', 'bak')

NODE, COLGAP, ROWGAP = 76.0, 46.0, 14.0
COLP, ROWP = NODE + COLGAP, NODE + ROWGAP
EPS = 1e-9


class Box(object):
    __slots__ = ('rw', 'cl', 'cx', 'cy', 'l', 'r', 't', 'b')

    def __init__(self, rw, cl):
        self.rw, self.cl = rw, cl
        x, y = cl * COLP + NODE / 2.0, rw * ROWP + NODE / 2.0
        self.cx, self.cy = x, y
        self.l, self.r = x - NODE / 2, x + NODE / 2
        self.t, self.b = y - NODE / 2, y + NODE / 2


def link_segments(pb, cb):
    """与 enhance.js drawLines 完全一致的连线形态。"""
    drw, dcl = cb.rw - pb.rw, cb.cl - pb.cl
    if drw == 0 and abs(dcl) == 1:
        y = cb.cy
        return [(pb.r, y), (cb.l, y)] if dcl > 0 else [(pb.l, y), (cb.r, y)]
    if drw != 0 and abs(dcl) == 1:
        up, dn = (pb, cb) if drw > 0 else (cb, pb)
        x1 = up.r if dn.cx > up.cx else up.l
        x2 = dn.l if dn.cx > up.cx else dn.r
        pts = [(x1, up.b), (x2, dn.t)]
        return pts if drw > 0 else pts[::-1]
    if abs(drw) == 1 and dcl == 0:
        return ([(pb.cx, pb.b), (cb.cx, cb.t)] if drw > 0
                else [(pb.cx, pb.t), (cb.cx, pb.b)])
    if abs(pb.cy - cb.cy) < NODE / 2:
        y = pb.b + ROWGAP / 2
        return [(pb.cx, pb.b), (pb.cx, y), (cb.cx, y), (cb.cx, cb.b)]
    up, dn = (cb, pb) if cb.cy < pb.cy else (pb, cb)
    y_out, y_in = up.b + ROWGAP / 2, dn.t - ROWGAP / 2
    corr = up.r + COLGAP / 2 if dn.cx >= up.cx else up.l - COLGAP / 2
    pts = [(up.cx, up.b), (up.cx, y_out), (corr, y_out), (corr, y_in), (dn.cx, y_in), (dn.cx, dn.t)]
    return pts if cb == up else pts[::-1]


def _cr(a, b, c):
    return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])


def _near(p, q):
    return abs(p[0] - q[0]) < 1.2 and abs(p[1] - q[1]) < 1.2


def _cross_strict(s, o):
    d1, d2 = _cr(o[0], o[1], s[0]), _cr(o[0], o[1], s[1])
    d3, d4 = _cr(s[0], s[1], o[0]), _cr(s[0], s[1], o[1])
    if not (((d1 > 0) != (d2 > 0)) and ((d3 > 0) != (d4 > 0))):
        return 0
    if any(_near(p, q) for p in s for q in o):
        return 0
    if abs(d1) < EPS or abs(d2) < EPS or abs(d3) < EPS or abs(d4) < EPS:
        return 1                                   # 共线重合
    return 2                                       # 真交叉


def links_of(techs):
    tree = {t['id']: t for t in techs if t.get('ul') != -2}
    out = []
    for cid, t in tree.items():
        for p in (t.get('pq') or []):
            if p[0] in tree and (p[0], cid) not in out:
                out.append((p[0], cid))
    return out


def build_groups(techs, row, cl, links):
    """所有要画的线段组（含六边形链与主干），顺序与 drawLines 一致。"""
    boxes = {i: Box(row[i], cl[i]) for i in row}
    groups = [link_segments(boxes[p], boxes[c]) for p, c in links]
    hexes = [t for t in techs if t.get('ul') == -1]          # 放置顺序 = techs 顺序
    hex_top = max([row[t['id']] for t in techs if t.get('ul') not in (-1, -2)] or [0]) + 1
    hx_pos = [Box(hex_top, k + 1) for k in range(len(hexes))]
    if len(hx_pos) > 1:
        order = sorted(range(len(hexes)), key=lambda i: hexes[i].get('cl', 0))
        for a, b in zip(order, order[1:]):
            groups.append([(hx_pos[a].r, hx_pos[a].cy), (hx_pos[b].l, hx_pos[b].cy)])
    roots = [t for t in techs
             if t.get('ul') not in (-1, -2, 0, None) and not (t.get('pq') or [])]
    if roots:
        left_l = min(boxes[t['id']].l for t in roots)
        main_x = left_l - 26.0
        ys = [boxes[t['id']].cy for t in roots]
        groups.append([(main_x, min(ys)), (main_x, max(ys))])
        for t in roots:
            b = boxes[t['id']]
            if b.l > main_x + 1 and abs(b.l - left_l) < 1:
                groups.append([(main_x, b.cy), (b.l, b.cy)])
    return groups, boxes


def defects(techs, row, cl, links, full=True):
    """返回 (真交叉数, 共线重合数, 压节点数)。

    full=False 时只用前置连线（DFS 剪枝用，六边形/主干在叶子上再补）。
    """
    groups, boxes = build_groups(techs, row, cl, links)
    segs = []
    for g, pts in enumerate(groups):
        for i in range(len(pts) - 1):
            segs.append((g, pts[i], pts[i + 1]))
    cross = touch = 0
    for i in range(len(segs)):
        gi, a1, a2 = segs[i]
        for j in range(i + 1, len(segs)):
            gj, b1, b2 = segs[j]
            if gi == gj:
                continue
            r = _cross_strict([a1, a2], [b1, b2])
            if r == 2:
                cross += 1
            elif r == 1:
                touch += 1
    nodehit = 0
    for _g, a1, a2 in segs:
        s = [a1, a2]
        for b in boxes.values():
            P = [(b.l, b.t), (b.r, b.t), (b.r, b.b), (b.l, b.b)]
            for m in range(4):
                q0, q1 = P[m], P[(m + 1) % 4]
                x1, y1 = _cr(q0, q1, s[0]), _cr(q0, q1, s[1])
                x2, y2 = _cr(s[0], s[1], q0), _cr(s[0], s[1], q1)
                if ((x1 > 0) != (y1 > 0)) and ((x2 > 0) != (y2 > 0)):
                    nodehit += 1
                    break
    return cross, touch, nodehit


def collisions(row, cl):
    cells = collections.Counter((row[i], cl[i]) for i in row)
    return sum(v - 1 for v in cells.values() if v > 1)


def score(techs, row, cl, links):
    """优先级：同格重叠 ≫ 压节点 ≫ 真交叉 ≫ 共线重合。"""
    cr, to, nh = defects(techs, row, cl, links)
    return 1000000000 * collisions(row, cl) + 1000000 * nh + 1000 * cr + to


def solve(techs, budget=400000, slack=2):
    """列不动、行在原始值 ±slack 内、同列保序的 DFS 求解。返回 (缺陷值, 行 dict)。"""
    tree = [t for t in techs if t.get('ul') != -2]
    if not tree:
        return 0, {}
    links = links_of(techs)
    cl = {t['id']: t.get('cl', 0) for t in tree}
    base = {t['id']: t.get('rw', 0) for t in tree}
    n0 = score(techs, base, cl, links)
    if n0 == 0:
        return 0, dict(base)
    lo_all, hi_all = 0, max(base.values()) + slack
    # 同列内按原始行排序 → 顺序保持用 strict 前驱行约束
    by_col = collections.defaultdict(list)
    for t in sorted(tree, key=lambda x: (cl[x['id']], base[x['id']], x['id'])):
        by_col[cl[t['id']]].append(t['id'])
    order = [i for c in sorted(by_col) for i in by_col[c]]    # 列主序：父在子前
    preds = collections.defaultdict(list)
    for p, c in links:
        preds[c].append(p)
    # 约束：同列保序（new[i] > new[prev]）
    seq_prev = {}
    for c, ids in by_col.items():
        for a, b in zip(ids, ids[1:]):
            seq_prev[b] = a
    states = [0]
    best = dict(base)
    best_n = [n0]

    def dfs(i, row):
        if states[0] > budget:
            return False
        if i == len(order):
            states[0] += 1
            n = score(techs, row, cl, links)
            if n < best_n[0]:
                best_n[0] = n
                best.update(row)
            return n == 0
        nid = order[i]
        prev = seq_prev.get(nid)
        lo = 0
        if prev is not None:
            lo = row[prev] + 1
        cands = sorted(range(lo, hi_all + 1),
                       key=lambda r: (abs(r - base[nid]), r))
        for r in cands:
            if any(row[j] == r and cl[j] == cl[nid] for j in row):
                continue
            row[nid] = r
            states[0] += 1
            if dfs(i + 1, row):
                return True
            del row[nid]
        return False

    dfs(0, {})
    final = dict(base)
    final.update(best)
    return score(techs, final, cl, links), final


def solve_relaxed(techs, budget=800000):
    """±1 无解时放宽到 ±2。"""
    tree = [t for t in techs if t.get('ul') != -2]
    if not tree:
        return 0, {}
    links = links_of(techs)
    cl = {t['id']: t.get('cl', 0) for t in tree}
    base = {t['id']: t.get('rw', 0) for t in tree}
    n0 = score(techs, base, cl, links)
    hi_all = max(base.values()) + 2
    by_col = collections.defaultdict(list)
    for t in sorted(tree, key=lambda x: (cl[x['id']], base[x['id']], x['id'])):
        by_col[cl[t['id']]].append(t['id'])
    order = [i for c in sorted(by_col) for i in by_col[c]]
    preds = collections.defaultdict(list)
    for p, c in links:
        preds[c].append(p)
    seq_prev = {}
    for c, ids in by_col.items():
        for a, b in zip(ids, ids[1:]):
            seq_prev[b] = a
    states = [0]
    best = dict(base)
    best_n = [n0]

    def dfs(i, row):
        if states[0] > budget:
            return False
        if i == len(order):
            states[0] += 1
            n = score(techs, row, cl, links)
            if n < best_n[0]:
                best_n[0] = n
                best.clear()
                best.update(row)
            return n == 0
        nid = order[i]
        prev = seq_prev.get(nid)
        lo = 0
        if prev is not None:
            lo = row[prev] + 1
        cands = sorted(range(lo, hi_all + 1),
                       key=lambda r: (abs(r - base[nid]), r))
        for r in cands:
            if any(row[j] == r and cl[j] == cl[nid] for j in row):
                continue
            row[nid] = r
            states[0] += 1
            if dfs(i + 1, row):
                return True
            del row[nid]
        return False

    dfs(0, {})
    final = dict(base)
    final.update(best)
    return score(techs, final, cl, links), final


def main():
    ap = argparse.ArgumentParser(description='最小扰动消除强化树连线缺陷')
    ap.add_argument('--write', action='store_true')
    ap.add_argument('--limit', type=int, default=0)
    ap.add_argument('--budget', type=int, default=400000)
    args = ap.parse_args()

    data = json.load(open(DATA, encoding='utf-8'))
    systems = [(sh, nm, sy) for sh, sv in data.items() for nm, sy in sv['systems'].items()]
    if args.limit:
        systems = systems[:args.limit]
    t0 = time.time()
    before_c = before_t = before_h = before_o = 0
    after_c = after_t = after_h = after_o = 0
    fixed = moved = rowmax_after = 0
    stuck = []
    for sh, nm, sy in systems:
        techs = sy['techs']
        tree = [t for t in techs if t.get('ul') != -2]
        links = links_of(techs)
        cl = {t['id']: t.get('cl', 0) for t in tree}
        row0 = {t['id']: t.get('rw', 0) for t in tree}
        c0, t0_, h0 = defects(techs, row0, cl, links)
        o0 = collisions(row0, cl)
        before_c += c0
        before_t += t0_
        before_h += h0
        before_o += o0
        if not (c0 or t0_ or h0 or o0):
            continue
        n, row = solve(techs, budget=args.budget, slack=1)
        if n:
            n, row2 = solve_relaxed(techs)
            if n < score(techs, row, cl, links):
                row = row2
        s0 = score(techs, row0, cl, links)
        if n < s0:
            changed = sum(1 for i in row if row[i] != row0[i])
            if changed:
                fixed += 1
                moved += changed
            for t in tree:
                t['rw'] = row[t['id']]
        rowv = {t['id']: t.get('rw', 0) for t in tree}
        c1, t1_, h1 = defects(techs, rowv, cl, links_of(techs))
        o1 = collisions(rowv, cl)
        before_c += 0
        after_c += c1
        after_t += t1_
        after_h += h1
        after_o += o1
        rowmax_after = max(rowmax_after, max(rowv.values()) if rowv else 0)
        if c1 or t1_ or h1 or o1:
            stuck.append('%s / %s 交叉%d 重合%d 压节点%d 重叠%d' % (sh, nm, c1, t1_, h1, o1))

    print('系统 %d | 改动 %d | 移动节点 %d | 用时 %.1fs' % (len(systems), fixed, moved, time.time() - t0))
    print('改前：交叉 %d 重合 %d 压节点 %d 重叠 %d' % (before_c, before_t, before_h, before_o))
    print('改后：交叉 %d 重合 %d 压节点 %d 重叠 %d | 最大行 %d（原始 2）'
          % (after_c, after_t, after_h, after_o, rowmax_after))
    if stuck:
        print('未清零 %d 个系统:' % len(stuck))
        for s in stuck[:25]:
            print('   ', s)
    if not args.write:
        print('(未写盘)')
        return
    if after_c or after_o or after_h:
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
