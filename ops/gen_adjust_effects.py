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

属性定位：常量名（effect_def.py 的 EffectId）决定属性与增减，effect_label 只是 UI 分组
（实测 label=频率 的节点里同时有「冷却缩减」499 条与「飞行时间缩减」89 条，
所以不能拿 label 定属性）。站内没有出口的机制类（预警/拦截/维修/打击…）直接排除。

量纲：EFFECT_PARAM < 1000 取原值，>= 1000 取低三位（官方把多参数打包进一个数）；
EFFECT_ID=10（BATTLE_SHIP / 舰船结构值）站内旧数据吻合 0%，是 1/100 量纲，单独处理。

校准：每个 EFFECT_ID 都要过三关才采信 —— 样本 >= 5、桶吻合 >= 85%、
方向主旋律 >= 85%（同一 EFFECT_ID 下的少数反向条目视为另一条效果）、
数值换算吻合 >= 90%。不过关的不写，宁可少算不可算错。

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
LANG_TXT = r'D:\ai\memory\星际猎人_蓝图加点解包\language\zh_CN\tb_cfg_system_effect.txt'
EDEF = r'D:\ai\memory\星际猎人_战斗系统全量解包\解包\py_src\common\config\effect_def.py'

MIN_SAMPLES = 5
MIN_BUCKET_RATE = 0.85
MIN_DIR_RATE = 0.85
MIN_NUM_RATE = 0.90
MARK = 'window.ENHANCE_ADJUST_EFFECTS = '

# acc 桶：常量名词元 -> 桶，具体词在前
TOKENS = [
    ('CD_TIME', 'cd'),
    ('INIT_PREPARE_TIME', 'cd'),
    ('FLIGHT_TIME', 'dur'),
    ('WEAPON_DURATION', 'dur'),
    ('ATTACK_DURATION', 'dur'),
    ('ATTACK_INTERVAL', 'atkSpeed'),
    ('HIT_RATE', 'hit'), ('HIT_RATIO', 'hit'), ('HIT_PROB', 'hit'), ('AVOID', 'hit'),
    ('CRIT', 'crit'), ('BURST_DAMAGE', 'crit'),
    ('SHIP_HP', 'hp'), ('SYSTEM_HP', 'hp'), ('STRUCTURE', 'hp'),
    ('ENERGY_SHIELD', 'energy'), ('ENERGY_INJURY', 'dmgAdd'), ('BALLISTIC', 'physAdd'),
    ('ARMOR', 'phys'), ('SHIELD', 'phys'),
    ('DESTROY_INC', 'siege'), ('SIEGE', 'siege'), ('ANTI_AIR', 'aa'),
    ('CURVATURE_SPEED', 'warp'), ('SPEED', 'cruise'),
    ('ATTACK_TIMES', 'freq'), ('REPEAT_TIMES', 'freq'), ('ATTACK_FREQ', 'freq'),
    ('SKILL_EFFECT_COUNT', 'freq'),
    ('DAMAGE', 'dmg'),
]
DEC_TAIL = re.compile(r'_(DEC|SUB|REDUCE|DECREASE)\d*$')
# 站内 acc 里没有出口的机制类
SKIP_NAME = re.compile(r'EARLY_WARN|ANTI_MISSILE|INTERCEPT|REPAIR|FLAG_REMOTE|STRATEGIC|'
                       r'OPERATION|CONTINUE_ATK|DAMAGE_BY_STAT|ADDITIONAL_DAMAGE|'
                       r'AIRCRAFT|PREPARE_TIME|INIT_TIME|WEAPON_AIRCRAFT|TARGET_PRIORITY|'
                       r'ARMOR_PENETRATION|DO_DAMAGE_WHEN_REMOVE|SHIP_ARMOR')
# effect_label 只在常量名缺失时兜底
LABEL_FALLBACK = (('cd', r'冷却'), ('dur', r'持续时间|飞行'), ('crit', r'暴击'),
                  ('hit', r'命中|闪避'), ('hp', r'结构|生命'), ('dmg', r'伤害'),
                  ('siege', r'攻城'), ('aa', r'防空'), ('phys', r'装甲|抵抗'),
                  ('freq', r'频率'), ('warp', r'曲速'), ('cruise', r'巡航'))

# 量纲：由上面的自校准结果决定用哪一种
SCALES = {
    '原值': lambda p: p,
    '/100': lambda p: p / 100.0,
    '/1000': lambda p: p / 1000.0,
    '原值/10': lambda p: p / 10.0,
}

# 与 enhance.js 的 addEffect() 同口径，用于验证
OLD_BUCKET = [('siege', r'攻城'), ('aa', r'防空'), ('cd', r'冷却'), ('crit', r'暴击'),
              ('dur', r'持续时间|飞行时间'), ('atkSpeed', r'攻击间隔'),
              ('freq', r'频率|每轮攻击|额外射击'), ('hit', r'命中|闪避'),
              ('hp', r'生命|结构值'), ('energy', r'能量装甲|能量抵抗'),
              ('phys', r'装甲|抗性|抵抗'), ('cruise', r'巡航'), ('warp', r'曲速|曲率'),
              ('dmg', r'伤害')]
OLD_ADD = [('physAdd', r'装甲|抗性|物理抵抗'), ('hpAdd', r'生命|结构值'), ('dmgAdd', r'伤害')]


def load_json(path, var):
    text = open(path, encoding='utf-8').read()
    i = text.index('window.' + var)
    body = text[text.index('=', i) + 1:]
    end = body.index(';\nwindow.') if ';\nwindow.' in body else body.rindex(';')
    return json.loads(body[:end].strip())


def load_cfg(name):
    return json.load(open(os.path.join(CFG, name), encoding='utf-8'))[name[:-5]]


def num(value):
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        return None
    return float(value)


def effect_names():
    out = {}
    for name, val in re.findall(r'^\s*([A-Z][A-Z0-9_]+) = (\d+)\s*$',
                                open(EDEF, encoding='utf-8', errors='ignore').read(), re.M):
        out.setdefault(val, name)
    return out


def load_labels():
    out = collections.defaultdict(dict)
    for line in open(LANG_TXT, encoding='utf-8', errors='ignore'):
        m = re.match(r'cfg_system_effect#(\w+)#(\d+)::(.*)$', line.rstrip('\n'))
        if m:
            out[m.group(2)][m.group(1)] = m.group(3)
    return out


def value_of(param, eid, level_max=None):
    """单值量纲。EFFECT_ID=10 这类结构值效果参数在主效果行恒为 0，
    真实数值在同前缀的各等级行里（PARAM_LEVEL），由 param_level_value() 处理。"""
    if eid == 10:
        return param / 100.0
    return param if param < 1000 else param % 1000


def param_level_value(row, level_max):
    """EFFECT_PARAM_LEVEL 形如 '1,200;2,400;3,600;'（等级,数值）。
    取满级（level_max 级）的数值；官方 get_cur_and_next_level_value
    在有这张表时直接取该级数值，不再按 level/max_level 摊。"""
    pl = row.get('EFFECT_PARAM_LEVEL')
    if not pl or not isinstance(pl, str):
        return None
    last = None
    for item in pl.split(';'):
        parts = [x.strip() for x in item.split(',') if x.strip()]
        if len(parts) < 2 or not parts[0].isdigit():
            continue
        try:
            last = (int(parts[0]), float(parts[1]))
        except ValueError:
            continue
    if not last:
        return None
    return last[1]


def spec_of(eid, label, names):
    """(桶, 是否减少)；常量名优先，label 兜底；机制类返回 None。"""
    name = names.get(str(eid)) or ''
    if name and SKIP_NAME.search(name):
        return None
    for tok, bucket in TOKENS:
        if tok in name:
            return (bucket, bool(DEC_TAIL.search(name)))
    for bucket, pat in LABEL_FALLBACK:
        if re.search(pat, label or ''):
            return (bucket, False)
    return None


def old_spec(typ, act):
    table = OLD_BUCKET if act in ('比例加成', '比例减少') else OLD_ADD
    for nm, pat in table:
        if re.search(pat, typ or ''):
            if act in ('比例加成', '比例减少'):
                dec = (act == '比例减少') or bool(re.search(r'降低|减少|下降', typ or ''))
            else:
                dec = bool(re.search(r'减少|下降|降低', typ or ''))
            return (nm, dec)
    return None


def parse_adjust_desc(desc):
    """'1,{101},{101};2,{102},{201};' → [{'from':1,'key':'101','val':'101'}, ...]"""
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


# acc 桶 -> 站内的 [类型, 动作] 写法
BUCKET_FX = {
    'cd': ('武器冷却时间', '比例减少/增加'),
    'dur': ('攻击持续时间', '比例减少/增加'),
    'crit': ('暴击率', '比例加成'),
    'hit': ('命中率', '比例加成'),
    'hp': ('舰船结构值', '比例加成'),
    'dmg': ('伤害', '比例加成'),
    'siege': ('攻城伤害', '比例加成'),
    'aa': ('防空伤害', '比例加成'),
    'phys': ('物理装甲', '比例加成'),
    'energy': ('能量装甲', '比例加成'),
    'freq': ('攻击频率', '比例加成'),
    'atkSpeed': ('攻击间隔', '比例加成'),
    'cruise': ('巡航速度', '比例加成'),
    'warp': ('曲速', '比例加成'),
    'physAdd': ('物理装甲', '基础数值增加/减少'),
    'hpAdd': ('舰船结构值', '基础数值增加/减少'),
    'dmgAdd': ('伤害', '基础数值增加/减少'),
}


def fx_of(bucket, dec):
    typ, act = BUCKET_FX[bucket]
    if act == '比例减少/增加':
        act = '比例减少' if dec else '比例加成'
    elif act == '基础数值增加/减少':
        act = '基础数值减少' if dec else '基础数值增加'
    return [typ, act]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--write', action='store_true')
    args = ap.parse_args()

    data = load_json(DATA, 'OFFICIAL_ENHANCE')
    fx = load_json(OUT, 'ENHANCE_EFFECTS')
    eff = load_cfg('_Tb_cfg_system_effect.json')
    enh = load_cfg('_Tb_cfg_system_enhance.json')
    names = effect_names()
    labels = load_labels()

    nodes = {}
    for ship in data.values():
        for sysv in ship['systems'].values():
            for t in sysv['techs']:
                nodes[t['id']] = t

    # ---------- 校准 ----------
    rows = collections.defaultdict(collections.Counter)
    for cid, node in nodes.items():
        if not node.get('mx') or cid not in fx:
            continue
        cfg = enh.get(cid) or {}
        pfx = cfg.get('SYSTEM_EFFECT_PREFIX')
        if pfx is None:
            continue
        rowid = str(pfx * 100 + 1)
        row = eff.get(rowid) or {}
        eid = row.get('EFFECT_ID')
        spec = spec_of(eid, labels.get(rowid, {}).get('effect_label', ''), names)
        if not spec:
            continue
        bucket, dec = spec
        c = rows[eid]
        c['样本'] += 1
        param = num(row.get('EFFECT_PARAM'))
        old0 = fx[cid][0]
        # 数值换算自校准：有 PARAM_LEVEL 时官方直接取该级值，否则用 EFFECT_PARAM
        probe = param_level_value(row, node.get('mx') or 0)
        if probe is not None:
            c['数值样本'] += 1
            if abs(probe - num(old0[2] or 0)) < 1e-9:
                c['数值吻合'] += 1
            elif abs(probe / 100.0 - num(old0[2] or 0)) < 1e-9:
                c['数值吻合'] += 1
                c['换算:PARAM_LEVEL/100'] += 1
            else:
                c['换算:PARAM_LEVEL不匹配'] += 1
        elif param is not None and num(old0[2]) is not None:
            c['数值样本'] += 1
            hits = []
            for label, fn in (('原值', lambda p: p if p < 1000 else p % 1000),
                              ('/100', lambda p: (p if p < 1000 else p % 1000) / 100.0),
                              ('/1000', lambda p: (p if p < 1000 else p % 1000) / 1000.0),
                              ('原值/10', lambda p: (p if p < 1000 else p % 1000) / 10.0)):
                if abs(fn(param) - num(old0[2])) < 1e-9:
                    hits.append(label)
            if len(hits) == 1:
                c['换算:' + hits[0]] += 1
                c['数值吻合'] += 1
            elif hits:
                c['换算:混用'] += 1
        pct_like = not bucket.endswith('Add')
        for k in fx[cid]:
            o = old_spec(k[0], k[1])
            if not o or pct_like != (k[1] in ('比例加成', '比例减少')):
                continue
            c['比对样本'] += 1
            c['桶吻合' if o[0] == bucket else '桶不吻合'] += 1
            c['方向吻合' if o[1] == dec else '方向相反'] += 1

    mapping = {}
    print('EFFECT_ID 校准（样本>=%d、桶吻合>=%d%%、方向主旋律>=%d%%、数值吻合>=%d%%）：'
          % (MIN_SAMPLES, MIN_BUCKET_RATE * 100, MIN_DIR_RATE * 100, MIN_NUM_RATE * 100))
    for eid, c in sorted(rows.items(), key=lambda kv: -kv[1]['样本'])[:26]:
        cmp_n = c['比对样本']
        br = c['桶吻合'] / cmp_n if cmp_n else None
        dr = max(c['方向吻合'], c['方向相反']) / cmp_n if cmp_n else None
        nr = c['数值吻合'] / c['数值样本'] if c['数值样本'] else None
        scales = {k[3:]: v for k, v in c.items() if k.startswith('换算:')}
        # 量纲必须唯一：同一个 EFFECT_ID 下出现两种以上换算，说明它的参数不是单一量纲，
        # 宁可不算也不能猜（None = 不写）。
        dominant_scale = None
        if len(scales) == 1:
            dominant_scale = next(iter(scales))
        ok = (c['样本'] >= MIN_SAMPLES and (br is None or br >= MIN_BUCKET_RATE)
              and (dr is None or dr >= MIN_DIR_RATE) and (nr is None or nr >= MIN_NUM_RATE)
              and (c['数值样本'] == 0 or dominant_scale is not None))
        spec = spec_of(eid, '', names)
        if ok and spec:
            mapping[eid] = (spec[0], spec[1], dominant_scale or '原值')
        print('   %-8s %-38s 样本%4d 桶%6s 方向%8s 数值%6s %-10s %s' % (
            eid, (names.get(str(eid)) or '?')[:38], c['样本'],
            '-' if br is None else '%.0f%%' % (br * 100),
            '-' if not cmp_n else '%d/%d' % (max(c['方向吻合'], c['方向相反']), cmp_n),
            '-' if nr is None else '%.0f%%' % (nr * 100),
            ('量纲=' + (dominant_scale or '混用')) if c['数值样本'] else '',
            '采信' if ok else ''))
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
        rowid = str(pfx * 100 + 1)
        items = parse_adjust_desc((eff.get(rowid) or {}).get('ADJUST_DESC'))
        if not items:
            stat['无 ADJUST_DESC'] += 1
            continue
        rows_out = []
        seen = set()
        span = len(node['ap'])
        for item in items:
            if item['val'] == 'T':
                stat['条目值是 {T}，跳过'] += 1
                continue
            row_key = int(item['key']) % 100
            if row_key in seen:
                stat['同属性键重复条目，只取首条'] += 1
                continue
            subid = str(pfx * 100 + row_key)
            sub = eff.get(subid) or {}
            eid = sub.get('EFFECT_ID')
            if eid not in mapping:
                stat['EFFECT_ID 无可信映射'] += 1
                continue
            # 数值：优先 PARAM_LEVEL 的满级值（官方有这张表时直接取该级），
            # 否则 EFFECT_PARAM × 满级/上限（官方 get_cur_and_next_level_value 的摊销口径）
            total = param_level_value(sub, span)
            if total is None:
                param = num(sub.get('EFFECT_PARAM'))
                if not param:
                    stat['属性行无 EFFECT_PARAM'] += 1
                    continue
                base = param if param < 1000 else param % 1000
                total = SCALES[mapping[eid][2]](base)
                total = total * (item['from'] + span - 1) / float(span)
            if total <= 0:
                stat['数值非正'] += 1
                continue
            bucket, dec, scale = mapping[eid]
            seen.add(row_key)
            rows_out.append([item['from']] + fx_of(bucket, dec) + [round(total, 4)])
        if rows_out:
            rows_out.sort()
            out[cid] = rows_out
            stat['已生成'] += 1
        else:
            stat['无可用条目'] += 1

    for k, v in stat.most_common():
        print('   %-28s %d' % (k, v))
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