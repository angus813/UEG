"""生成调教（EFFECT_TYPE == ADJUST）节点的属性加成，写进 enhance_effects.js 的第二个变量。

链路（照官方代码挖出来的）：
    bp_ui_utils.get_adjust_cur_and_next_level_value
        adjust_key_list = parse_cfg_str_to_list_of_list(adjust_config['ADJUST_DESC'])
            条目形如 '1,{101},{101};' = 从第 1 级起，作用于属性键 {101}，值同 {101}
        op_type, op_key_config = get_adjust_key_detail(adjust_key_list, key_config)
            op_type = int(条目[0])（1 增加 / 2 减少），op_key_config = 条目[1] 即 '{101}'
        get_cur_and_next_level_value(prefix, '{101}', level, add_level, max_level)
            key   = re.findall('[a-zA-Z0-9]+', '{101}')[0] = 101
            行 id = prefix × 100 + (101 % 100) = prefix × 100 + 1     ← 主效果行
            有 EFFECT_PARAM_LEVEL：直接取该级数值
            否则：当前值 = EFFECT_PARAM × level / max_level
    → 调教第 N 级的累计加成 = 该行 EFFECT_PARAM × N / max_level，max_level = ADJUST_PROB 长度

数值换算：EFFECT_PARAM < 1000 取原值，>= 1000 取低三位（官方把多参数打包进一个数）。
类型/动作：不手写，用站内已有的 3072 条加成做多数票（同一 EFFECT_ID 的常见「类型/动作」），
          样本 >= 5 且纯度 >= 90% 才采信，打印出来供核对。

用法：python ops/gen_adjust_effects.py [--write]
"""
import argparse
import collections
import json
import os
import re
import shutil
import sys
import time

sys.stdout.reconfigure(encoding='utf-8')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'public', 'games', 'official_enhance_data.js')
OUT = os.path.join(ROOT, 'public', 'games', 'enhance_effects.js')
BAK = os.path.join(ROOT, 'ops', 'bak')
CFG = r'D:\ai\memory\星际猎人_蓝图加点解包\config'
EDEF = r'D:\ai\memory\星际猎人_战斗系统全量解包\解包\py_src\common\config\effect_def.py'

MIN_SAMPLES = 5
MIN_PURITY = 0.90
MIN_NUM_RATE = 0.90          # 数值换算吻合率下限：低于此说明该效果的量纲不同（如 EFFECT_ID=10 是 1/100）
MARK = 'window.ENHANCE_ADJUST_EFFECTS = '


def load_json(path, var):
    text = open(path, encoding='utf-8').read()
    return json.loads(text[text.index('=', text.index('window.' + var)) + 1:].strip().rstrip(';'))


def load_cfg(name):
    return json.load(open(os.path.join(CFG, name), encoding='utf-8'))[name[:-5]]


def num(value):
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        return None
    return float(value)


def value_of(param):
    return param if param < 1000 else param % 1000


def effect_names():
    out = {}
    src = open(EDEF, encoding='utf-8', errors='ignore').read()
    for name, val in re.findall(r'^\s*([A-Z][A-Z0-9_]+) = (\d+)\s*$', src, re.M):
        out.setdefault(val, name)
    return out


def parse_adjust_desc(desc):
    """'1,{101},{101};2,{102},{201};' → [{'from':1,'key':'101','val':'{101}'}, ...]"""
    out = []
    for item in str(desc or '').split(';'):
        parts = [x.strip() for x in item.split(',') if x.strip()]
        if len(parts) < 3 or not parts[0].isdigit():
            continue
        key = re.findall('[a-zA-Z0-9]+', parts[1])
        val = re.findall('[a-zA-Z0-9]+', parts[2])
        if not key or not val:
            continue
        out.append({'from': int(parts[0]), 'key': key[0], 'val': val[0]})
    return sorted(out, key=lambda x: x['from'])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--write', action='store_true')
    args = ap.parse_args()

    data = load_json(DATA, 'OFFICIAL_ENHANCE')
    fx = load_json(OUT, 'ENHANCE_EFFECTS')
    eff = load_cfg('_Tb_cfg_system_effect.json')
    enh = load_cfg('_Tb_cfg_system_enhance.json')
    names = effect_names()

    nodes = {}
    for ship in data.values():
        for sysv in ship['systems'].values():
            for t in sysv['techs']:
                nodes[t['id']] = t

    # ---------- 校准：EFFECT_ID -> (类型, 动作) 多数票 + 数值换算吻合率 ----------
    votes = collections.defaultdict(collections.Counter)
    numok = collections.Counter()
    numtot = collections.Counter()
    for cid, node in nodes.items():
        if not node.get('mx') or cid not in fx:
            continue
        cfg = enh.get(cid) or {}
        pfx = cfg.get('SYSTEM_EFFECT_PREFIX')
        if pfx is None:
            continue
        row = eff.get(str(pfx * 100 + 1)) or {}
        eid = row.get('EFFECT_ID')
        param = num(row.get('EFFECT_PARAM'))
        old = fx[cid][0]
        votes[eid][(old[0] or '', old[1] or '')] += 1
        if param is not None:
            numtot[eid] += 1
            ov = num(old[2])
            if ov is not None and abs(value_of(param) - ov) < 1e-9:
                numok[eid] += 1

    mapping = {}
    print('EFFECT_ID 校准（多数票，样本 >= %d、纯度 >= %d%%、数值吻合 >= %d%%）：'
          % (MIN_SAMPLES, MIN_PURITY * 100, MIN_NUM_RATE * 100))
    for eid, cnt in sorted(votes.items(), key=lambda kv: -sum(kv[1].values()))[:22]:
        total = sum(cnt.values())
        (typ, act), n = cnt.most_common(1)[0]
        purity = n / total
        rate = numok[eid] / numtot[eid] if numtot[eid] else 0
        ok = total >= MIN_SAMPLES and purity >= MIN_PURITY and rate >= MIN_NUM_RATE
        if ok:
            mapping[eid] = (typ, act)
        print('   %-8s %-38s 样本%4d 纯度%5.1f%% 数值吻合%5.1f%% %s' % (
            eid, (names.get(str(eid)) or '')[:38], total, purity * 100, rate * 100,
            '采信' if ok else '不采信'))
    print('采信 %d 个 EFFECT_ID' % len(mapping))

    # ---------- 生成调教加成 ----------
    out = {}
    stat = collections.Counter()
    for cid, node in nodes.items():
        cfg = enh.get(cid) or {}
        if cfg.get('EFFECT_TYPE') != 2 or not node.get('ap'):
            continue
        stat['调教节点'] += 1
        pfx = cfg.get('SYSTEM_EFFECT_PREFIX')
        if pfx is None or not node.get('tg'):
            stat['缺前缀或目标'] += 1
            continue
        row = eff.get(str(pfx * 100 + 1)) or {}
        items = parse_adjust_desc(row.get('ADJUST_DESC'))
        if not items:
            stat['无 ADJUST_DESC'] += 1
            continue
        maxlv = len(node['ap'])
        rows = []
        seen_keys = set()
        for item in items:
            if item['val'] == 'T':
                stat['条目值是 {T}，跳过'] += 1
                continue
            row_key = int(item['key']) % 100
            if row_key in seen_keys:
                stat['同属性键重复条目，只取首条'] += 1
                continue
            sub = eff.get(str(pfx * 100 + row_key)) or {}
            eid = sub.get('EFFECT_ID')
            if eid not in mapping:
                stat['EFFECT_ID 无可信映射'] += 1
                continue
            param = num(sub.get('EFFECT_PARAM'))
            if not param:
                stat['属性行无 EFFECT_PARAM'] += 1
                continue
            total = value_of(param)
            if total <= 0 or total > 1000:
                stat['数值超出可信范围'] += 1
                continue
            typ, act = mapping[eid]
            seen_keys.add(row_key)
            rows.append([item['from'], typ, act, total])
        if rows:
            rows.sort()
            out[cid] = rows
            stat['已生成'] += 1
        else:
            stat['无可用条目'] += 1

    for k, v in stat.most_common():
        print('   %-28s %d' % (k, v))

    # 抽样
    for cid in list(out)[:6]:
        node = nodes[cid]
        print('   %s %s 目标=%s -> %s' % (cid, node['n'][:12], node['tg'], out[cid]))

    if not args.write:
        print('未写入（加 --write 落盘）')
        return 0

    os.makedirs(BAK, exist_ok=True)
    stamp = time.strftime('%Y%m%d-%H%M%S')
    shutil.copy2(OUT, os.path.join(BAK, 'enhance_effects.js.' + stamp))
    text = open(OUT, encoding='utf-8').read()
    idx = text.find(MARK)
    if idx >= 0:
        text = text[:idx].rstrip() + '\n'
    with open(OUT, 'w', encoding='utf-8', newline='\n') as fh:
        fh.write(text)
        fh.write(MARK + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n')
    print('已写入 %s（备份 ops/bak/enhance_effects.js.%s），调教加成 %d 个节点' % (OUT, stamp, len(out)))
    return 0


if __name__ == '__main__':
    sys.exit(main())