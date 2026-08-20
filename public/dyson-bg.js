/* ============================================================
 * 电影级动态背景 —— 无尽深空中的巨型戴森球
 *
 * 场景构成（渲染顺序，自后向前）：
 *   深邃太空 + 冷色星云 + 星空
 *   球体远侧经纬骨架（暗色剪影）
 *   远侧六边形面板（微光）＋ 赤道环远侧
 *   中心恒星（脉冲金核 + 体积光晕 + 旋转上帝光）
 *   球体近侧骨架（暖橙/琥珀主光源 + 受光分桶）
 *   亮蓝六边形能量面板（斑块状戴森云，随球自转）
 *   赤道轨道环（发光传送带 + 流动能量节点 + 尾迹）
 *   子午能量流 + 轨道粒子 + 自由尘埃
 *   剪影边缘辉光 + 镜头光晕 + 前景散景
 *   暗角 + 胶片颗粒（电影后期）
 *
 * 动态：整体缓慢自转（约 63s/圈）＋ 轻微轴倾摆动
 *       恒星脉动 / 上帝光缓旋 / 面板能量脉冲
 *       环上节点穿梭 / 粒子流动 / 能量流沿子午线爬升
 * 纯 Canvas2D，性能自适应（DPR≤1.5，元素数按面积缩放）
 * ============================================================ */
(function () {
  'use strict';
  if (document.getElementById('dyson-bg')) return;
  var canvas = document.createElement('canvas');
  canvas.id = 'dyson-bg';
  var ctx = canvas.getContext('2d');
  var W = 0, H = 0, DPR = 1;
  var TAU = 6.2831853;

  /* ---------- 球体相机与灯光（模型空间为单位球，绘制时乘 R） ---------- */
  var R = 0, CX = 0, CY = 0;
  var FOCAL = 2.4, CAMD = 3.0;          /* 焦距 / 相机距离（R 的倍数） */
  var SPIN = 0.00010;                   /* 自转速度 rad/ms ≈ 63s/圈 */
  var LIGHT = [-0.55, -0.75, 0.35];     /* 暖橙主光源方向（左上） */
  (function () {
    var l = Math.sqrt(LIGHT[0] * LIGHT[0] + LIGHT[1] * LIGHT[1] + LIGHT[2] * LIGHT[2]);
    LIGHT[0] /= l; LIGHT[1] /= l; LIGHT[2] /= l;
  })();

  canvas.style.cssText = 'position:fixed;left:0;top:0;z-index:-1;pointer-events:none;';
  canvas.setAttribute('aria-hidden', 'true');

  /* ---------- 静态场景数据（模型空间） ---------- */
  var parallels = [], meridians = [];   /* 骨架采样点（单位向量） */
  var patches = [];                     /* 六边形面板斑块 */
  var ringPts = [];                     /* 赤道环采样点 */
  var ringNodes = [], particles = [], dust = [], bokeh = [], streams = [];
  var stars = [], nebula = [], vignette = null;
  var ringFrontCache = [];              /* 环近侧投影点缓存 */
  var small = false;

  function unit(x, y, z) {
    var l = Math.sqrt(x * x + y * y + z * z) || 1;
    return [x / l, y / l, z / l];
  }
  function randDir() {
    for (;;) {
      var x = Math.random() * 2 - 1, y = Math.random() * 2 - 1, z = Math.random() * 2 - 1;
      var d = x * x + y * y + z * z;
      if (d <= 1 && d > 0.01) return unit(x, y, z);
    }
  }

  function initScene() {
    small = W * H < 420000;
    var i, j;

    /* --- 经纬骨架（测地线球体支撑网） --- */
    parallels = [];
    var latStep = small ? 20 : 15;
    for (var lat = -80; lat <= 80; lat += latStep) {
      var c = Math.cos(lat * Math.PI / 180), s = Math.sin(lat * Math.PI / 180), arr = [];
      for (i = 0; i < 24; i++) {
        var a = i / 24 * TAU;
        arr.push([c * Math.cos(a), s, c * Math.sin(a)]);
      }
      parallels.push(arr);
    }
    meridians = [];
    var nMer = small ? 15 : 20;
    for (var m = 0; m < nMer; m++) {
      var lam = m / nMer * TAU, arr2 = [];
      for (j = 0; j <= 24; j++) {
        var b = (j / 24 - 0.5) * Math.PI;
        arr2.push([Math.cos(b) * Math.cos(lam), Math.sin(b), Math.cos(b) * Math.sin(lam)]);
      }
      meridians.push(arr2);
    }

    /* --- 六边形面板斑块（戴森云，切平面内蜂窝排布） --- */
    patches = [];
    var np = small ? 13 : Math.round(W * H / 80000);
    np = Math.max(10, Math.min(34, np));
    for (var p = 0; p < np; p++) {
      var d0 = randDir();
      var ref = Math.abs(d0[1]) > 0.9 ? [1, 0, 0] : [0, 1, 0];
      var u = unit(ref[1] * d0[2] - ref[2] * d0[1], ref[2] * d0[0] - ref[0] * d0[2], ref[0] * d0[1] - ref[1] * d0[0]);
      var v = [d0[1] * u[2] - d0[2] * u[1], d0[2] * u[0] - d0[0] * u[2], d0[0] * u[1] - d0[1] * u[0]];
      var aF = 0.032 + Math.random() * 0.034;
      var offs = [[0, 0], [1.5, 0.866], [1.5, -0.866], [3, 0], [3, 1.732], [3, -1.732]];
      var nHex = 1 + Math.floor(Math.random() * 5);
      var hexes = [];
      for (var h = 0; h < nHex; h++) {
        var off = offs[h], ox = off[0] * aF, oy = off[1] * aF;
        var cdir = unit(d0[0] + u[0] * ox + v[0] * oy, d0[1] + u[1] * ox + v[1] * oy, d0[2] + u[2] * ox + v[2] * oy);
        var vr = Math.random();
        hexes.push({
          cdir: cdir, aF: aF * (0.85 + Math.random() * 0.3),
          fill: vr < 0.5 ? 'rgba(64,150,255,0.92)' : (vr < 0.8 ? 'rgba(86,198,235,0.9)' : 'rgba(36,86,190,0.94)'),
          edge: vr < 0.5 ? 'rgba(150,214,255,0.85)' : (vr < 0.8 ? 'rgba(190,244,255,0.9)' : 'rgba(96,158,255,0.75)'),
          glow: Math.random() < 0.3, ph: Math.random() * TAU
        });
      }
      hexes._u = u;
      hexes._v = v;
      patches.push(hexes);
    }

    /* --- 赤道轨道环（贯穿球体的发光轨道） --- */
    ringPts = [];
    for (i = 0; i < 120; i++) {
      var ra = i / 120 * TAU;
      ringPts.push([Math.cos(ra) * 1.12, 0, Math.sin(ra) * 1.12]);
    }
    ringNodes = [];
    var nr = small ? 16 : 28;
    for (i = 0; i < nr; i++) {
      ringNodes.push({ ph: Math.random() * TAU, sp: 0.0005 + (Math.random() - 0.5) * 0.0005, w: 1.10 + Math.random() * 0.04 });
    }

    /* --- 表面轨道粒子（蓝色能量光点） --- */
    particles = [];
    var npt = small ? 42 : Math.round(W * H / 17000);
    npt = Math.max(30, Math.min(110, npt));
    for (i = 0; i < npt; i++) {
      var dd = randDir();
      particles.push({
        lat: Math.asin(dd[1]), lon: Math.atan2(dd[2], dd[0]),
        dr: (Math.random() - 0.5) * 0.00016,
        r: 0.9 + Math.random() * 1.0,
        warm: Math.random() < 0.18, tw: Math.random() * TAU
      });
    }

    /* --- 自由尘埃（球体周围漂浮） --- */
    dust = [];
    var nd = small ? 20 : 40;
    for (i = 0; i < nd; i++) {
      var dp = randDir(), df = 1.5 + Math.random() * 1.7;
      dust.push({ x: dp[0] * df, y: dp[1] * df, z: dp[2] * df, tw: Math.random() * TAU, r: 0.6 + Math.random() * 1.1 });
    }

    /* --- 前景散景（电影级纵深） --- */
    bokeh = [];
    for (i = 0; i < 9; i++) {
      var bc = Math.random();
      bokeh.push({
        x: Math.random(), y: Math.random(), r: 26 + Math.random() * 54,
        c: bc < 0.4 ? '255,180,110' : (bc < 0.75 ? '120,190,255' : '255,228,180'),
        a: 0.05 + Math.random() * 0.06,
        dx: (Math.random() - 0.5) * 0.00002, dy: (Math.random() - 0.5) * 0.00002
      });
    }

    /* --- 子午能量流（沿经线爬升的发光流） --- */
    streams = [];
    var ns = small ? 2 : 3;
    for (i = 0; i < ns; i++) {
      streams.push({ lam: i * TAU / ns + Math.random(), head: Math.random() * TAU, sp: 0.0005 + Math.random() * 0.0003 });
    }

    /* --- 星空 + 星云 + 暗角 --- */
    stars = [];
    var nst = Math.round(W * H / 18000);
    for (i = 0; i < nst; i++) {
      stars.push({ x: Math.random() * W, y: Math.random() * H, r: 0.4 + Math.random() * 1.0, warm: Math.random() < 0.12, tw: Math.random() * TAU, sp: 0.4 + Math.random() });
    }
    nebula = [
      { x: W * 0.24, y: H * 0.18, r: Math.max(W, H) * 0.32, c: '90,60,160', a: 0.075 },
      { x: W * 0.78, y: H * 0.82, r: Math.max(W, H) * 0.30, c: '40,90,170', a: 0.06 },
      { x: W * 0.52, y: H * 0.06, r: Math.max(W, H) * 0.26, c: '210,130,60', a: 0.05 }
    ];
    var vg = ctx.createRadialGradient(CX, CY, Math.min(W, H) * 0.32, CX, CY, Math.max(W, H) * 0.78);
    vg.addColorStop(0, 'rgba(1,2,8,0)');
    vg.addColorStop(0.62, 'rgba(1,2,8,0.28)');
    vg.addColorStop(1, 'rgba(1,2,8,0.88)');
    vignette = vg;
  }

  function resize() {
    DPR = Math.min(1.5, window.devicePixelRatio || 1);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    R = Math.min(W, H) * 0.40;
    CX = W * 0.5;
    CY = H * 0.47;
    initScene();
  }

  /* ---------- 太空：渐变 + 星云 + 星空 ---------- */
  function paintSky(t) {
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#020308');
    g.addColorStop(0.45, '#04060f');
    g.addColorStop(0.75, '#070a14');
    g.addColorStop(1, '#050810');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < nebula.length; i++) {
      var nb = nebula[i];
      var ng = ctx.createRadialGradient(nb.x, nb.y, 0, nb.x, nb.y, nb.r);
      ng.addColorStop(0, 'rgba(' + nb.c + ',' + nb.a + ')');
      ng.addColorStop(1, 'rgba(' + nb.c + ',0)');
      ctx.fillStyle = ng;
      ctx.beginPath(); ctx.arc(nb.x, nb.y, nb.r, 0, TAU); ctx.fill();
    }
    ctx.restore();
    for (var s = 0; s < stars.length; s++) {
      var st = stars[s];
      ctx.globalAlpha = 0.30 + 0.60 * Math.abs(Math.sin(t * 0.0004 * st.sp + st.tw));
      ctx.fillStyle = st.warm ? '#ffd9a8' : '#cdd8f5';
      ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  /* ---------- 骨架：经纬网格分桶（远侧暗 / 近侧按受光暖橙分 5 档） ---------- */
  function paintCageBuckets(sy, cy, sx, cx2) {
    var back = [];
    var front = [[], [], [], [], []];
    var i, k;
    function T(p) {
      var x1 = p[0] * cy + p[2] * sy, z1 = -p[0] * sy + p[2] * cy;
      var y2 = p[1] * cx2 - z1 * sx, z2 = p[1] * sx + z1 * cx2;
      return [x1, y2, z2];
    }
    function pushSeg(A, B) {
      var a = T(A), b = T(B);
      var mz = (a[2] + b[2]) * 0.5;
      var seg = [a[0], a[1], a[2], b[0], b[1], b[2]];
      if (mz > 0.03) { back.push(seg); return; }
      var mx = (a[0] + b[0]) * 0.5, my = (a[1] + b[1]) * 0.5;
      var nl = Math.sqrt(mx * mx + my * my + mz * mz) || 1;
      var light = Math.max(0, (mx * LIGHT[0] + my * LIGHT[1] + mz * LIGHT[2]) / nl);
      var rimN = 1 - Math.abs(mz) / nl; rimN *= rimN;
      var bri = 0.30 + 0.42 * light + 0.36 * rimN;
      var bi = bri < 0.42 ? 0 : (bri < 0.55 ? 1 : (bri < 0.68 ? 2 : (bri < 0.82 ? 3 : 4)));
      front[bi].push(seg);
    }
    for (i = 0; i < parallels.length; i++) {
      var P = parallels[i];
      for (k = 0; k < P.length; k++) pushSeg(P[k], P[(k + 1) % P.length]);
    }
    for (i = 0; i < meridians.length; i++) {
      var M = meridians[i];
      for (k = 0; k < M.length - 1; k++) pushSeg(M[k], M[k + 1]);
    }
    return { back: back, front: front };
  }

  var FCOL = [
    'rgba(26,32,50,0.95)', 'rgba(52,62,86,0.95)', 'rgba(96,108,134,0.96)',
    'rgba(150,156,172,0.97)', 'rgba(222,180,126,0.98)'
  ];

  function drawBackCage(back) {
    if (!back.length) return;
    ctx.strokeStyle = 'rgba(40,50,76,0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (var i = 0; i < back.length; i++) {
      var e = back[i];
      ctx.moveTo(CX + e[0] * R * FOCAL / (e[2] + CAMD), CY + e[1] * R * FOCAL / (e[2] + CAMD));
      ctx.lineTo(CX + e[3] * R * FOCAL / (e[5] + CAMD), CY + e[4] * R * FOCAL / (e[5] + CAMD));
    }
    ctx.stroke();
  }

  function drawFrontCage(front) {
    for (var bi = 0; bi < 5; bi++) {
      var fb = front[bi];
      if (!fb.length) continue;
      ctx.strokeStyle = FCOL[bi];
      ctx.lineWidth = bi === 4 ? 1.7 : 1.2;
      ctx.beginPath();
      for (var q = 0; q < fb.length; q++) {
        var e = fb[q];
        ctx.moveTo(CX + e[0] * R * FOCAL / (e[2] + CAMD), CY + e[1] * R * FOCAL / (e[2] + CAMD));
        ctx.lineTo(CX + e[3] * R * FOCAL / (e[5] + CAMD), CY + e[4] * R * FOCAL / (e[5] + CAMD));
      }
      ctx.stroke();
    }
  }

  /* ---------- 中心恒星（金色脉动 + 体积光晕） ---------- */
  function paintStar(t) {
    var pulse = 1 + 0.03 * Math.sin(t * 0.0008);
    var cr = R * 0.34 * pulse;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    var g1 = ctx.createRadialGradient(CX, CY, 0, CX, CY, R * 0.95);
    g1.addColorStop(0, 'rgba(255,160,70,0.32)');
    g1.addColorStop(0.55, 'rgba(255,130,50,0.09)');
    g1.addColorStop(1, 'rgba(255,120,40,0)');
    ctx.fillStyle = g1;
    ctx.beginPath(); ctx.arc(CX, CY, R * 0.95, 0, TAU); ctx.fill();
    var g2 = ctx.createRadialGradient(CX, CY, 0, CX, CY, R * 0.58);
    g2.addColorStop(0, 'rgba(255,214,130,0.58)');
    g2.addColorStop(0.6, 'rgba(255,170,80,0.25)');
    g2.addColorStop(1, 'rgba(255,150,60,0)');
    ctx.fillStyle = g2;
    ctx.beginPath(); ctx.arc(CX, CY, R * 0.58, 0, TAU); ctx.fill();
    var g3 = ctx.createRadialGradient(CX, CY, 0, CX, CY, cr);
    g3.addColorStop(0, '#fffdf4');
    g3.addColorStop(0.35, '#ffe9a8');
    g3.addColorStop(0.75, '#ffb95e');
    g3.addColorStop(1, 'rgba(255,150,50,0)');
    ctx.fillStyle = g3;
    ctx.beginPath(); ctx.arc(CX, CY, cr, 0, TAU); ctx.fill();
    ctx.restore();
  }

  /* ---------- 旋转上帝光（体积光） ---------- */
  function paintRays(t) {
    var n = small ? 7 : 9, a0 = t * 0.00006;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < n; i++) {
      var a = a0 + i / n * TAU;
      var dx = Math.cos(a), dy = Math.sin(a);
      var px = -dy, py = dx;
      var len = R * (1.55 + 0.25 * Math.sin(t * 0.0003 + i * 2.4));
      var half = 0.055 + 0.02 * Math.sin(i * 3.1);
      var g = ctx.createLinearGradient(CX, CY, CX + dx * len, CY + dy * len);
      g.addColorStop(0, 'rgba(255,196,120,0.16)');
      g.addColorStop(1, 'rgba(255,170,90,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(CX + dx * len * 0.12, CY + dy * len * 0.12);
      ctx.lineTo(CX + dx * len + px * len * half, CY + dy * len + py * len * half);
      ctx.lineTo(CX + dx * len - px * len * half, CY + dy * len - py * len * half);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  /* ---------- 六边形面板（戴森云） ---------- */
  function paintPanels(t, sy, cy, sx, cx2, frontPass) {
    ctx.save();
    for (var i = 0; i < patches.length; i++) {
      var hexes = patches[i];
      if (!hexes.length) continue;
      var u = hexes._u, v = hexes._v;
      for (var h = 0; h < hexes.length; h++) {
        var HX = hexes[h];
        var cd = HX.cdir;
        var x1 = cd[0] * cy + cd[2] * sy, z1 = -cd[0] * sy + cd[2] * cy;
        var y2 = cd[1] * cx2 - z1 * sx, z2 = cd[1] * sx + z1 * cx2;
        var isFront = z2 <= 0.02;
        if (frontPass !== isFront) continue;
        var pulse = 0.72 + 0.28 * Math.sin(t * 0.0015 + HX.ph);
        ctx.globalAlpha = isFront ? pulse : 0.13;
        var aF = HX.aF;
        ctx.beginPath();
        var pts = [];
        for (var vi = 0; vi < 6; vi++) {
          var va = vi / 6 * TAU;
          var uu = Math.cos(va) * aF, vv = Math.sin(va) * aF;
          var vx = cd[0] + u[0] * uu + v[0] * vv;
          var vy = cd[1] + u[1] * uu + v[1] * vv;
          var vz = cd[2] + u[2] * uu + v[2] * vv;
          var l = Math.sqrt(vx * vx + vy * vy + vz * vz) || 1;
          vx /= l; vy /= l; vz /= l;
          var tx = vx * cy + vz * sy, tz = -vx * sy + vz * cy;
          var ty = vy * cx2 - tz * sx, tz2 = vy * sx + tz * cx2;
          pts.push([CX + tx * R * FOCAL / (tz2 + CAMD), CY + ty * R * FOCAL / (tz2 + CAMD)]);
        }
        ctx.moveTo(pts[5][0], pts[5][1]);
        for (vi = 0; vi < 6; vi++) ctx.lineTo(pts[vi][0], pts[vi][1]);
        ctx.closePath();
        ctx.fillStyle = HX.fill;
        ctx.fill();
        if (isFront) {
          ctx.strokeStyle = HX.edge;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
        if (HX.glow && isFront) {
          ctx.globalCompositeOperation = 'lighter';
          var gx = (pts[0][0] + pts[3][0]) / 2, gy = (pts[0][1] + pts[3][1]) / 2;
          var gr = ctx.createRadialGradient(gx, gy, 0, gx, gy, aF * R * 1.5);
          gr.addColorStop(0, 'rgba(150,220,255,' + (0.34 * pulse) + ')');
          gr.addColorStop(1, 'rgba(120,200,255,0)');
          ctx.fillStyle = gr;
          ctx.beginPath(); ctx.arc(gx, gy, aF * R * 1.5, 0, TAU); ctx.fill();
          ctx.globalCompositeOperation = 'source-over';
        }
      }
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  /* ---------- 赤道轨道环：远侧（球后） ---------- */
  function paintRingBack(t, sy, cy, sx, cx2) {
    ringFrontCache = [];
    var back = [];
    for (var i = 0; i < ringPts.length; i++) {
      var P = ringPts[i];
      var x1 = P[0] * cy + P[2] * sy, z1 = -P[0] * sy + P[2] * cy;
      var y2 = P[1] * cx2 - z1 * sx, z2 = P[1] * sx + z1 * cx2;
      var pt = [CX + x1 * R * FOCAL / (z2 + CAMD), CY + y2 * R * FOCAL / (z2 + CAMD), z2];
      (z2 > 0 ? back : ringFrontCache).push(pt);
    }
    if (back.length < 3) return;
    ctx.strokeStyle = 'rgba(90,140,220,0.14)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(back[0][0], back[0][1]);
    for (var j = 1; j < back.length; j++) ctx.lineTo(back[j][0], back[j][1]);
    ctx.stroke();
  }

  /* ---------- 赤道轨道环：近侧（发光传送带 + 节点） ---------- */
  function paintRingFront(t, sy, cy, sx, cx2) {
    var pts = ringFrontCache;
    if (pts.length < 3) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgba(110,170,255,0.07)';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (var j = 1; j < pts.length; j++) ctx.lineTo(pts[j][0], pts[j][1]);
    ctx.stroke();
    /* 流动虚线：能量传送带 */
    ctx.globalCompositeOperation = 'lighter';
    ctx.setLineDash([18, 15]);
    ctx.lineDashOffset = -t * 0.05;
    ctx.strokeStyle = 'rgba(150,215,255,0.6)';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (j = 1; j < pts.length; j++) ctx.lineTo(pts[j][0], pts[j][1]);
    ctx.stroke();
    ctx.setLineDash([]);
    /* 蓝色发光节点 + 尾迹 */
    for (var i = 0; i < ringNodes.length; i++) {
      var nd = ringNodes[i];
      var a = nd.ph + t * nd.sp;
      var P2 = [Math.cos(a) * nd.w, 0, Math.sin(a) * nd.w];
      var x1 = P2[0] * cy + P2[2] * sy, z1 = -P2[0] * sy + P2[2] * cy;
      var y2 = P2[1] * cx2 - z1 * sx, z2 = P2[1] * sx + z1 * cx2;
      var nx = CX + x1 * R * FOCAL / (z2 + CAMD), ny = CY + y2 * R * FOCAL / (z2 + CAMD);
      var a2 = a - 0.07;
      var qx = Math.cos(a2) * nd.w, qz = Math.sin(a2) * nd.w;
      var qx1 = qx * cy + qz * sy, qz1 = -qx * sy + qz * cy;
      var qy2 = -qz1 * sx, qz2 = qz1 * cx2;
      var qsx = CX + qx1 * R * FOCAL / (qz2 + CAMD), qsy = CY + qy2 * R * FOCAL / (qz2 + CAMD);
      ctx.strokeStyle = 'rgba(160,220,255,0.35)';
      ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(qsx, qsy); ctx.lineTo(nx, ny); ctx.stroke();
      var r = 2.6 + 1.0 * Math.sin(t * 0.003 + i * 2.1);
      var g = ctx.createRadialGradient(nx, ny, 0, nx, ny, r * 3.2);
      g.addColorStop(0, 'rgba(235,250,255,0.95)');
      g.addColorStop(0.35, 'rgba(140,210,255,0.6)');
      g.addColorStop(1, 'rgba(100,180,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(nx, ny, r * 3.2, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }

  /* ---------- 子午能量流（沿经线爬升） ---------- */
  function paintStreams(t, sy, cy, sx, cx2) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < streams.length; i++) {
      var st = streams[i];
      var lam = st.lam, head = st.head + t * st.sp;
      ctx.strokeStyle = 'rgba(120,185,255,0.10)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (var k = 0; k <= 24; k++) {
        var b = (k / 24 - 0.5) * Math.PI;
        var dx = Math.cos(b) * Math.cos(lam), dy = Math.sin(b), dz = Math.cos(b) * Math.sin(lam);
        var x1 = dx * cy + dz * sy, z1 = -dx * sy + dz * cy;
        var y2 = dy * cx2 - z1 * sx, z2 = dy * sx + z1 * cx2;
        var px = CX + x1 * R * FOCAL / (z2 + CAMD), py = CY + y2 * R * FOCAL / (z2 + CAMD);
        if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
      for (k = 0; k < 14; k++) {
        var lat = head - k * 0.05;
        var c = Math.cos(lat), s = Math.sin(lat);
        var dx = c * Math.cos(lam), dy = s, dz = c * Math.sin(lam);
        var x1 = dx * cy + dz * sy, z1 = -dx * sy + dz * cy;
        var y2 = dy * cx2 - z1 * sx, z2 = dy * sx + z1 * cx2;
        var px = CX + x1 * R * FOCAL / (z2 + CAMD), py = CY + y2 * R * FOCAL / (z2 + CAMD);
        var fade = 1 - k / 14;
        ctx.globalAlpha = fade * 0.85;
        ctx.fillStyle = k === 0 ? '#eaffff' : 'rgba(150,215,255,0.9)';
        ctx.beginPath(); ctx.arc(px, py, (1 - k / 14) * 2.4 + 0.6, 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

  /* ---------- 表面轨道粒子 ---------- */
  function paintParticles(t, sy, cy, sx, cx2) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var lon = p.lon + t * (SPIN + p.dr);
      var c = Math.cos(p.lat), s = Math.sin(p.lat);
      var dx = c * Math.cos(lon), dy = s, dz = c * Math.sin(lon);
      var x1 = dx * cy + dz * sy, z1 = -dx * sy + dz * cy;
      var y2 = dy * cx2 - z1 * sx, z2 = dy * sx + z1 * cx2;
      var px = CX + x1 * R * FOCAL / (z2 + CAMD), py = CY + y2 * R * FOCAL / (z2 + CAMD);
      var a = (z2 <= 0 ? 0.75 : 0.2) * (0.6 + 0.4 * Math.sin(t * 0.002 + p.tw));
      ctx.globalAlpha = a;
      ctx.fillStyle = p.warm ? '#ffd9a0' : '#bcdcff';
      ctx.beginPath(); ctx.arc(px, py, p.r, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  /* ---------- 自由尘埃 ---------- */
  function paintDust(t) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < dust.length; i++) {
      var d = dust[i];
      var zc = d.z + CAMD;
      var px = CX + d.x * R * FOCAL / zc, py = CY + d.y * R * FOCAL / zc;
      if (px < -20 || px > W + 20 || py < -20 || py > H + 20) continue;
      ctx.globalAlpha = 0.12 + 0.22 * Math.abs(Math.sin(t * 0.0006 + d.tw));
      ctx.fillStyle = '#ffe2b8';
      ctx.beginPath(); ctx.arc(px, py, d.r, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  /* ---------- 剪影边缘辉光（球体轮廓描边） ---------- */
  function paintRim(t) {
    var rx = R * FOCAL / Math.sqrt(CAMD * CAMD - 1);
    var ry = rx * 0.985;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgba(255,150,70,0.10)';
    ctx.lineWidth = 16;
    ctx.beginPath(); ctx.ellipse(CX, CY, rx, ry, 0, 0, TAU); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,190,120,' + (0.20 + 0.08 * Math.sin(t * 0.001)) + ')';
    ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.ellipse(CX, CY, rx, ry, 0, 0, TAU); ctx.stroke();
    /* 受光侧（左上）方向性高光：琥珀色主光源强调 */
    ctx.strokeStyle = 'rgba(255,224,170,' + (0.22 + 0.06 * Math.sin(t * 0.001)) + ')';
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.ellipse(CX, CY, rx, ry, 0, Math.PI * 0.70, Math.PI * 1.32); ctx.stroke();
    ctx.restore();
  }

  /* ---------- 镜头光晕（朝右上角） ---------- */
  function paintFlare(t) {
    var dx = W * 0.32, dy = -H * 0.28;
    var dl = Math.sqrt(dx * dx + dy * dy) || 1;
    dx /= dl; dy /= dl;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgba(255,198,130,0.10)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(CX - dx * R * 1.9, CY - dy * R * 1.9);
    ctx.lineTo(CX + dx * R * 1.9, CY + dy * R * 1.9);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,186,120,0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(CX - dy * R * 0.9, CY + dx * R * 0.9);
    ctx.lineTo(CX + dy * R * 0.9, CY - dx * R * 0.9);
    ctx.stroke();
    var els = [[0.30, 11, 0.16], [0.55, 6.5, 0.12], [0.85, 3.6, 0.10], [1.20, 2.2, 0.085], [1.55, 1.5, 0.07]];
    for (var i = 0; i < els.length; i++) {
      var o = els[i][0] * R, r = els[i][1], a = els[i][2] * (0.75 + 0.25 * Math.sin(t * 0.0012 + i * 1.8));
      var fx = CX + dx * o, fy = CY + dy * o;
      var g = ctx.createRadialGradient(fx, fy, 0, fx, fy, r * 2.6);
      g.addColorStop(0, 'rgba(255,215,160,' + a + ')');
      g.addColorStop(1, 'rgba(255,190,120,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(fx, fy, r * 2.6, 0, TAU); ctx.fill();
    }
    ctx.fillStyle = 'rgba(130,220,255,0.10)';
    ctx.beginPath(); ctx.arc(CX + dx * R * 0.45, CY + dy * R * 0.45, 3, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,140,200,0.08)';
    ctx.beginPath(); ctx.arc(CX + dx * R * 1.0, CY + dy * R * 1.0, 2, 0, TAU); ctx.fill();
    ctx.restore();
  }

  /* ---------- 前景散景 ---------- */
  function paintBokeh(t) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < bokeh.length; i++) {
      var b = bokeh[i];
      var bx = (b.x + t * b.dx) % 1, by = (b.y + t * b.dy) % 1;
      if (bx < 0) bx += 1;
      if (by < 0) by += 1;
      var x = bx * W, y = by * H;
      var g = ctx.createRadialGradient(x, y, 0, x, y, b.r);
      g.addColorStop(0, 'rgba(' + b.c + ',' + b.a + ')');
      g.addColorStop(1, 'rgba(' + b.c + ',0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, b.r, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }

  /* ---------- 后期：暗角 + 胶片颗粒 ---------- */
  function paintPost() {
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    for (var i = 0; i < 34; i++) {
      ctx.globalAlpha = 0.018 + Math.random() * 0.03;
      ctx.fillRect(Math.random() * W, Math.random() * H, 1, 1);
    }
    ctx.globalAlpha = 1;
  }

  /* ---------- 主循环 ---------- */
  function draw(t) {
    var spin = t * SPIN;
    var sy = Math.sin(spin), cy = Math.cos(spin);
    var tilt = -0.20 + 0.03 * Math.sin(t * 0.00006);
    var sx = Math.sin(tilt), cx2 = Math.cos(tilt);

    paintSky(t);
    var buckets = paintCageBuckets(sy, cy, sx, cx2);

    /* 远侧（恒星之前，形成纵深暗部） */
    drawBackCage(buckets.back);
    paintPanels(t, sy, cy, sx, cx2, false);
    paintRingBack(t, sy, cy, sx, cx2);

    /* 恒星本体 + 体积光 */
    paintStar(t);
    paintRays(t);

    /* 近侧（剪影与受光面） */
    drawFrontCage(buckets.front);
    paintPanels(t, sy, cy, sx, cx2, true);
    paintRingFront(t, sy, cy, sx, cx2);

    /* 能量流动 */
    paintStreams(t, sy, cy, sx, cx2);
    paintParticles(t, sy, cy, sx, cx2);
    paintDust(t);

    /* 电影后期 */
    paintRim(t);
    paintFlare(t);
    paintBokeh(t);
    paintPost(t);
  }
  function loop(ts) {
    draw(ts);
    requestAnimationFrame(loop);
  }

  /* ---------- 挂载 ---------- */
  function init() {
    if (!document.body) return;
    if (document.body.firstChild) {
      document.body.insertBefore(canvas, document.body.firstChild);
    } else {
      document.body.appendChild(canvas);
    }
    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(loop);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
