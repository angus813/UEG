# -*- coding: utf-8 -*-
"""把游戏里的强化图标同步到 public/games/enhance_icons/。

站内节点的图标名取自效果表的 PATH 字段（见 gen_official_enhance.py），
本脚本按数据里出现过的图标名，从 res_*.npk 里取出对应文件补齐。
"""
import os
import sys
import re
import json
import argparse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from npk_extract import NpkReader  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'public', 'games', 'official_enhance.json')
ICON_DIR = os.path.join(ROOT, 'public', 'games', 'enhance_icons')
RES_GLOB = r'D:\星际猎人\res_%d.npk'

NUM_RE = re.compile(r'icon_system_intensify_(\d+)\.png$')


def needed_icons():
    data = json.load(open(DATA, encoding='utf-8'))
    out = set()
    for _, sv in data.items():
        for _, sysv in sv.get('systems', {}).items():
            for t in sysv.get('techs', []):
                if t.get('ic'):
                    out.add(t['ic'])
    return out


def main():
    ap = argparse.ArgumentParser(description='同步强化图标')
    ap.add_argument('--write', action='store_true', help='实际写文件（默认只报告）')
    args = ap.parse_args()

    need = needed_icons()
    have = set(os.listdir(ICON_DIR)) if os.path.isdir(ICON_DIR) else set()
    missing = sorted(need - have)
    print('节点引用图标 %d 种 | 本地已有 %d 种 | 缺 %d 种' % (len(need), len(have), len(missing)))
    if not missing:
        return
    if not args.write:
        print('(dry-run) 缺的前 10 个: %s' % missing[:10])
        return

    os.makedirs(ICON_DIR, exist_ok=True)
    left = set(missing)
    total = 0
    for i in range(1, 7):
        p = RES_GLOB % i
        if not os.path.exists(p) or not left:
            continue
        found = {}
        with NpkReader(p) as r:
            names = r.names()
            for n in names:
                base = os.path.basename(n)
                if base in left and NUM_RE.match(base):
                    found[base] = n
            for base, n in found.items():
                with open(os.path.join(ICON_DIR, base), 'wb') as f:
                    f.write(r.read(n))
                left.discard(base)
                total += 1
        print('  从 res_%d.npk 取到 %d 个' % (i, len(found)))
    print('共写入 %d 个图标 -> %s' % (total, ICON_DIR))
    if left:
        print('仍在游戏里找不到 %d 个: %s' % (len(left), sorted(left)[:12]))


if __name__ == '__main__':
    main()
