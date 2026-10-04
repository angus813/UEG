"""从官方配置补 enhance_effects.js 里缺的属性加成。

旧版 ships_data.js（站内早年的手写数据）没有「系统扩展调校」面板的六边形节点，
而这些节点在游戏里是实打实加属性的，数值不在描述里（描述是【数值】占位符），
只在 cfg_system_effect 的 EFFECT_PARAM 里。

取值规则（先在已有 3072 条上交叉验证过）：
  1. 官方描述里恰好一个 【数值】%，且紧跟百分号 —— 秒/概率之类的一律不碰；
  2. 属性类别从描述关键词取，口径与 enhance.js 的 mults() 一致；
  3. 数值取各等级 EFFECT_PARAM 的公共值，>=1000 的按低三位取（官方把多个参数打包进一个数），
     结果 >100 的丢弃（比例类加成不可能超 100%，这类多半是另一个缩放量纲，不敢猜）；
  4. 动作（加成/减少）按描述里的方向词判定。
规则在已覆盖节点上跑一遍交叉验证，有不一致就直接报错退出。

用法：python ops/gen_effects_from_config.py [--write]
"""
import argparse
import collections
import json
import os
import re
import shutil
import sys
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'public', 'games', 'official_enhance_data.js')
OUT = os.path.join(ROOT, 'public', 'games', 'enhance_effects.js')
BAK = os.path.join(ROOT, 'ops', 'bak')
CFG = r'D:\ai\memory\星际猎人_蓝图加点解包\config'

# 与 enhance.js mults() 同口径，顺序即优先级：先具体后宽泛
BUCKETS = [
    ('攻城', '攻城伤害'),
    ('防空', '防空伤害'),
    ('冷却时间', '武器冷却时间'),
    ('冷却', '武器冷却时间'),
    ('暴击', '暴击率'),
    ('持续时间', '攻击持续时间'),
    ('攻击间隔', '攻击间隔'),
    ('每轮攻击|额外射击|射击次数|频率', '攻击频率'),
    ('命中', '命中率'),
    ('结构值|舰船生命|生命值', '舰船结构值'),
    ('能量装甲|能量抵抗', '能量装甲'),
    ('物理装甲|物理抵抗|装甲', '物理装甲'),
    ('曲速|曲率', '曲速'),
    ('巡航', '巡航速度'),
    ('伤害', '伤害'),
]
REDUCE = re.compile(r'降低|下降|减少|缩减|减低|缩短')
# 只有这一族的节点做过交叉验证，别的缩放量纲没验证过，不碰
VERIFIED_NAMES = {'功率矩阵', '炮弹改良', '快速武器维护'}

HEADER = """/* 官方强化节点的属性加成数据（自动生成，勿手改）
   来源一：旧版 ships_data.js（git d8a725a^）里的结构化 effects，
           按 节点名/代价数组/最高等级/描述数值/标签/系统名 对齐到官方节点 id；
           未对齐但标签明确且描述带百分数的节点，用描述兜底合成一条。
   来源二：ops/gen_effects_from_config.py —— 旧数据没有的六边形（调教）节点，
           从 cfg_system_effect 的 EFFECT_PARAM 取值，属性类别与动作取自官方描述；
           规则在来源一的节点上交叉验证过（{check} 个可验证节点，数值一致 {agree} 个）。
   覆盖 {have} / {total} 个可加点节点；未覆盖的视为无属性加成（多为机制类节点或数值存疑）。
   字段：[类型, 动作, 数值, 武器] */
window.ENHANCE_EFFECTS = """


def load_json(path, var):
    text = open(path, encoding='utf-8').read()
    return json.loads(text[text.index('=', text.index('window.' + var)) + 1:].strip().rstrip(';'))


def load_cfg(name):
    return json.load(open(os.path.join(CFG, name), encoding='utf-8'))[name[:-5]]


def num(value):
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        return None
    return float(value)


def bucket_of(text):
    for pattern, name in BUCKETS:
        if re.search(pattern, text):
            return name
    return None


def value_of(eff, pfx, mx):
    """各等级 EFFECT_PARAM 的公共值；打包过（>=1000）或超出比例范围的返回 None。"""
    if pfx is None:
        return None
    vals = []
    for lv in range(1, mx + 1):
        p = num((eff.get(str(pfx * 100 + lv)) or {}).get('EFFECT_PARAM'))
        if p is None or p == 0:
            return None
        v = p % 1000 if p >= 1000 else p
        if v > 100:
            return None
        vals.append(v)
    return vals[0] if len(set(vals)) == 1 else None


def extract(node, eff, enh, restrict):
    desc = node.get('ds') or ''
    if desc.count('【数值】%') != 1 or desc.count('【数值】') != 1:
        return None
    if restrict and node['n'] not in VERIFIED_NAMES:
        return None
    name = bucket_of(desc)
    if not name:
        return None
    mx = node.get('mx') or 0
    value = value_of(eff, (enh.get(node['id']) or {}).get('SYSTEM_EFFECT_PREFIX'), mx)
    if value is None:
        return None
    return [name, '比例减少' if REDUCE.search(desc) else '比例加成', value, '']


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--write', action='store_true')
    args = ap.parse_args()

    data = load_json(DATA, 'OFFICIAL_ENHANCE')
    fx = load_json(OUT, 'ENHANCE_EFFECTS')
    eff = load_cfg('_Tb_cfg_system_effect.json')
    enh = load_cfg('_Tb_cfg_system_enhance.json')

    nodes = {}
    for ship in data.values():
        for sysv in ship['systems'].values():
            for t in sysv['techs']:
                nodes[t['id']] = t

    check = agree = 0
    added = {}
    for cid, node in nodes.items():
        if not node.get('mx'):
            continue
        # 交叉验证跑全量（不限名字），确认规则本身可靠
        probe = extract(node, eff, enh, False)
        got = extract(node, eff, enh, True) if cid not in fx else probe
        if got is None:
            continue
        if cid in fx:
            old = num(fx[cid][0][2])
            check += 1
            if old == got[2]:
                agree += 1
            else:
                print('交叉验证不一致：%s %s 旧 %s 新 %s' % (cid, node['n'], fx[cid][0], got))
        else:
            added[cid] = [got]

    if check and agree != check:
        print('交叉验证 %d/%d 一致，规则不可靠，未写入。' % (agree, check))
        return 1
    print('交叉验证：可验证 %d 个节点，数值一致 %d 个' % (check, agree))

    merged = dict(fx)
    merged.update(added)
    total = sum(1 for n in nodes.values() if n.get('mx'))
    print('新增 %d 个节点；可加点节点 %d 个，有加成 %d 个（%.1f%%）' % (
        len(added), total, len(merged), 100.0 * len(merged) / max(1, total)))
    if not args.write:
        print('未写入（加 --write 落盘）')
        return 0

    os.makedirs(BAK, exist_ok=True)
    stamp = time.strftime('%Y%m%d-%H%M%S')
    shutil.copy2(OUT, os.path.join(BAK, 'enhance_effects.js.' + stamp))
    body = HEADER.format(check=check, agree=agree, have=len(merged), total=total)
    with open(OUT, 'w', encoding='utf-8', newline='\n') as fh:
        fh.write(body + json.dumps(merged, ensure_ascii=False, separators=(',', ':')) + ';\n')
    print('已写入 %s（备份 ops/bak/enhance_effects.js.%s）' % (OUT, stamp))
    return 0


if __name__ == '__main__':
    sys.exit(main())
