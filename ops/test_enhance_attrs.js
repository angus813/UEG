// enhance_calc.js 的匹配逻辑验证：mock window / localStorage 后直接跑真文件。
const fs = require('fs');

const SHIP = 'D:\\ai\\网站\\public\\games\\enhance_calc.js';
const src = fs.readFileSync(SHIP, 'utf8');

// 造真实的缓存样例：键=shipKey，n 取自 SHIPS_DATA[k].name（纯舰名）
const CACHE = {
  '新君士坦丁大帝级·多用途型': { n: '新君士坦丁大帝级', d: 1.1523, h: 1.0871, a: 1.0442, e: 1.01, t: 120 },
  '埃迪卡拉级·重型型': { n: '埃迪卡拉级', d: 1.3100, h: 1.2200, a: 1.1500, e: 1.05, t: 300 },
  '太阳鲸·航空母舰型': { n: '太阳鲸', d: 1.0010, h: 1.0000, a: 1.0000, e: 1.00, t: 0 }
};

const store = { 'ueg_ship_attrs': JSON.stringify(CACHE) };
global.window = {};
global.localStorage = {
  getItem: k => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); }
};

eval(src);
const A = global.window.ENHANCE_ATTRS;
if (typeof A !== 'function') { console.log('FAIL: 未导出 ENHANCE_ATTRS'); process.exit(1); }

// 对局侧拿到的是 PLAYER_SHIPS[].name（「舰名-全称」），与缓存里的纯舰名不同形态
const cases = [
  ['埃迪卡拉级-重型火力支援舰', CACHE['埃迪卡拉级·重型型'], '全称 → 舰名'],
  ['新君士坦丁大帝级-综合战列巡洋舰', CACHE['新君士坦丁大帝级·多用途型'], '另一艘全称'],
  ['太阳鲸', CACHE['太阳鲸·航空母舰型'], '本身就是纯舰名'],
  ['不存在的舰船名称XYZ', null, '未命中应返回 null'],
  ['', null, '空名应返回 null']
];

let pass = 0, fail = 0;
for (const [input, expectRec, desc] of cases) {
  const got = A(input);
  // toAttrs 每次返回新对象，只能按数值判定，不能用 === 比身份
  const ok = expectRec === null
    ? got === null
    : got !== null && got.fireMul === expectRec.d && got.hpMul === expectRec.h;
  console.log((ok ? 'PASS' : 'FAIL') + '  ' + desc.padEnd(22) +
    '  入参=' + JSON.stringify(input) +
    (got ? ('  fireMul=' + got.fireMul) : '  ->null'));
  ok ? pass++ : fail++;
}

console.log('\n---- 数值保真 ----');
const a = A('埃迪卡拉级-重型火力支援舰');
const srcRec = CACHE['埃迪卡拉级·重型型'];
console.log('缓存 d/h/a/e =', srcRec.d, srcRec.h, srcRec.a, srcRec.e);
console.log('读出 fireMul/hpMul/physMul/energyMul =', a.fireMul, a.hpMul, a.physMul, a.energyMul);
const same = a.fireMul === srcRec.d && a.hpMul === srcRec.h && a.physMul === srcRec.a && a.energyMul === srcRec.e;
console.log(same ? 'PASS  四个倍率原样透传' : 'FAIL  数值被改动');
same ? pass++ : fail++;

console.log('\n---- 缓存缺失时的降级 ----');
store['ueg_ship_attrs'] = '{}';
const none = A('埃迪卡拉级-重型火力支援舰');
console.log((none === null ? 'PASS' : 'FAIL') + '  无缓存返回 null（weishu 侧据此回退单标量）');
none === null ? pass++ : fail++;
delete store['ueg_ship_attrs'];
store['ueg_ship_attrs'] = '{坏 JSON';
const broken = A('埃迪卡拉级-重型火力支援舰');
console.log((broken === null ? 'PASS' : 'FAIL') + '  坏 JSON 不抛异常，返回 null');
broken === null ? pass++ : fail++;

console.log('\n合计 ' + pass + ' 通过 / ' + fail + ' 失败');
process.exit(fail ? 1 : 0);