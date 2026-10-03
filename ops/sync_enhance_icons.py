# -*- coding: utf-8 -*-
"""把游戏里的强化图标同步到 public/games/enhance_icons/。

站内节点的图标名取自效果表的 PATH 字段（见 gen_official_enhance.py），
本脚本按数据里出现过的图标名，从 res_*.npk 里取出对应文件补齐。

包里有两套同名图标：
    cocosui/_resource/icon/system_intensify/icon_system_intensify_NNN.png      旧版
    cocosui/_resource/icon/system_intensify_new/icon_system_intensify_NNN.png  当前版
文件名完全相同但图形不同（PATH 字段不带目录），必须取 _new 那套，
否则节点图标与游戏里显示的不一致。

--refresh 重新导出全部图标（换图标集或怀疑文件损坏时用）；
默认只补缺失的。
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
ICON_DIR_NEW = 'system_intensify_new'
ICON_DIR_OLD = 'system_intensify'


def pick_entry(full_name):
    """同名文件在包里有新旧两套，返回应采用的那条完整路径。"""
    parts = full_name.replace('/', '\\').split('\\')
    folders = parts[:-1]
    if ICON_DIR_NEW in folders:
        return 2                                    # 优先新套
    if ICON_DIR_OLD in folders:
        return 1
    return 0


def rank_entry(full_name, base):
    """排序用：新套优先，其次旧套。"""
    r = pick_entry(full_name)
    return (-r, full_name)


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
    ap.add_argument('--refresh', action='store_true', help='重导全部图标，不只补缺失')
    args = ap.parse_args()

    need = needed_icons()
    have = set(os.listdir(ICON_DIR)) if os.path.isdir(ICON_DIR) else set()
    todo = need if args.refresh else sorted(need - have)
    print('节点引用图标 %d 种 | 本地已有 %d 种 | 本次待取 %d 种%s'
          % (len(need), len(have), len(todo), '（--refresh 全量重导）' if args.refresh else ''))
    if not todo:
        return
    if not args.write:
        print('(dry-run) 待取的前 10 个: %s' % sorted(todo)[:10])
        return

    os.makedirs(ICON_DIR, exist_ok=True)
    left = set(todo)
    total = 0
    src = {}
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
                    cur = found.get(base)
                    if cur is None or rank_entry(n, base) < rank_entry(cur, base):
                        found[base] = n
            for base, n in sorted(found.items()):
                data = r.read(n)
                if not data.startswith(b'\x89PNG'):
                    print('  跳过 %s：不是 PNG' % base)
                    continue
                with open(os.path.join(ICON_DIR, base), 'wb') as f:
                    f.write(data)
                left.discard(base)
                src[base] = ('新' if pick_entry(n) == 2 else '旧', len(data))
                total += 1
        print('  从 res_%d.npk 取到 %d 个' % (i, len(found)))
    old_picked = sorted(k for k, v in src.items() if v[0] == '旧')
    print('共写入 %d 个图标 -> %s' % (total, ICON_DIR))
    print('其中取自 system_intensify_new %d 个 / 退化取旧套 %d 个'
          % (len(src) - len(old_picked), len(old_picked)))
    if old_picked:
        print('  旧套: %s' % old_picked)
    if left:
        print('仍在游戏里找不到 %d 个: %s' % (len(left), sorted(left)[:12]))


if __name__ == '__main__':
    main()
