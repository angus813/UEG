/* 强化加成（细粒度）读取 —— 对局页专用。
 *
 * 数据由强化页算好后缓存到 localStorage['ueg_ship_attrs']（见 enhance.js 的
 * saveAttrs）。对局页刻意不加载 ships_data.js / official_enhance_data.js /
 * enhance_effects.js —— 合计约 5MB（3.0MB + 1.86MB + 252KB），塞进对局页
 * 会让每次进游戏都多拉 5MB。缓存只有「玩家点过的舰 × 5 个数」，
 * 且强化页是唯一改 levels 的地方，所以不存在失效问题。
 *
 * 字段：n=舰名  d=伤害倍率  h=结构倍率  a=装甲倍率  e=能量倍率  t=已投入强化点
 * 伤害倍率 d 已把暴击/攻速/射速折进期望（与 enhance.js 的 fireMul 同口径），
 * 对局侧因此不再单独累加 crit，避免与 d 重复计算。
 *
 * 缓存里的舰名取自 SHIPS_DATA[k].name（纯舰名），对局侧拿到的是
 * PLAYER_SHIPS[].name（「舰名-全称」），两者分隔符不同、不字面相等，
 * 故按去分隔符后比前缀匹配，与 weishu.js 的 shipEnhanceBonus 同口径。
 */
(function () {
  function strip(s) { return String(s == null ? '' : s).replace(/[·\- ]/g, ''); }

  window.ENHANCE_ATTRS = function (shipName) {
    try {
      var cache = JSON.parse(localStorage.getItem('ueg_ship_attrs') || '{}') || {};
      var n = strip(shipName);
      if (n.length < 2) return null;
      var fuzzy = null;
      for (var k in cache) {
        var rec = cache[k];
        if (!rec) continue;
        var a = strip(rec.n);
        if (!a) continue;
        if (a === n) return toAttrs(rec);
        if (fuzzy === null && a.length >= 4 && n.length >= 4) {
          var p = 0, m = Math.min(a.length, n.length);
          while (p < m && a.charAt(p) === n.charAt(p)) p++;
          if (p >= Math.max(4, Math.min(a.length, n.length) / 2)) fuzzy = rec;
        }
      }
      return fuzzy ? toAttrs(fuzzy) : null;
    } catch (e) { return null; }
  };

  function toAttrs(r) {
    return {
      fireMul: Number(r.d) > 0 ? Number(r.d) : 1,
      hpMul: Number(r.h) > 0 ? Number(r.h) : 1,
      physMul: Number(r.a) > 0 ? Number(r.a) : 1,
      energyMul: Number(r.e) > 0 ? Number(r.e) : 1,
      invested: Number(r.t) || 0
    };
  }
})();