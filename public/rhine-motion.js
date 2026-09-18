/* ============================================================================
   RHINE LAB ARCHIVE · 动效层 JS v2
   参考实现：LBEILC/RhineLabUI + JesseLee-CN/rhinelab-blog-theme
   ─────────────────────────────────────────────────────────────────────────
   · boot 启动序列：docking 720ms → 行错开 80ms（360ms 起）→ 退出 320ms
     纯时间函数采样（帧率无关），退出为左右移出而非整页淡出
   · 滚动数字 / 滚动文字：@kitlangton/rolling-number（460ms + motionBlur，可打断）
   · 面板过渡：入场 300ms / 退出 200ms，位移 12px / 8px，可从当前状态接续
   · 内容淡入：150ms（起始不透明度 0.35）
   · 页签：文字 150ms 淡入 + 下划线 180ms 连续移动
   · HUD 角标生长 · 扫描线 · 状态灯 · 装饰环 · 阶梯进场
   ─────────────────────────────────────────────────────────────────────────
   开关：<html data-rl-boot="off"> / <html data-rl-motion="off">
   ============================================================================ */
(function () {
  'use strict';
  var docEl = document.documentElement;
  var reduced = false;
  try { reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var motionOff = docEl.getAttribute('data-rl-motion') === 'off' || reduced;
  var bootOff = docEl.getAttribute('data-rl-boot') === 'off' || motionOff;

  /* ============================ 时序常量（源自 rhinelab-blog-theme） ============================ */
  var M = {
    DOCKING_MS: 720,           // 名称坞入
    FORM_ENTER_START_MS: 360,  // 次级行起始
    FORM_ROW_STAGGER_MS: 80,   // 行错开
    EXIT_MS: 320,              // 退出
    BOOT_HOLD_MS: 420,         // 坞入后停留
    ROLL_DURATION: 460,        // 滚动数字/文字
    ENTER_MS: 300,             // 面板入场
    EXIT_MS_PANEL: 200,        // 面板退出
    ENTER_EASE: 'cubic-bezier(0.22, 1, 0.36, 1)',
    EXIT_EASE: 'cubic-bezier(0.4, 0, 1, 1)',
    CONTENT_FADE_MS: 150,
    TAB_FADE_MS: 150,
    TAB_UNDERLINE_MS: 180
  };
  /* smoothstep：与参考实现 smooth() 一致 */
  function smooth(p) { p = p < 0 ? 0 : p > 1 ? 1 : p; return p * p * (3 - 2 * p); }
  /* 生成 smoothstep 多点关键帧，精确复现缓动 */
  function smoothFrames(from, to, steps) {
    var n = steps || 24, out = [];
    for (var i = 0; i <= n; i++) {
      var p = i / n, v = smooth(p);
      out.push(from + (to - from) * v);
    }
    return out;
  }

  /* ============================ 1. boot 启动序列（v2） ============================ */
  var boot = null, bootStart = 0, bootTimers = [];
  try {
    if (!bootOff) {
      boot = document.createElement('div');
      boot.className = 'rl-boot';
      boot.setAttribute('aria-hidden', 'true');
      boot.innerHTML =
        '<div class="rl-boot-inner">' +
          '<div class="rl-boot-name">RHINE LAB ARCHIVE</div>' +
          '<div class="rl-boot-bar"><i></i></div>' +
          '<div class="rl-boot-status">SYSTEM INITIALIZING<i></i></div>' +
        '</div>';
      docEl.appendChild(boot);
      bootStart = Date.now();
      /* 立即播放：不等 DOMContentLoaded（样式表可能阻塞它） */
      bootPlay();
    }
  } catch (e) { boot = null; }

  function bootPlay() {
    if (!boot) return;
    var name = boot.querySelector('.rl-boot-name');
    var bar = boot.querySelector('.rl-boot-bar');
    var status = boot.querySelector('.rl-boot-status');
    if (!name) return;
    try {
      /* —— 名称：坞入 720ms（缩放 + 位移，smoothstep） —— */
      var sc = smoothFrames(0.9, 1, 20), ty = smoothFrames(14, 0, 20), op = smoothFrames(0, 1, 12);
      name.animate(
        sc.map(function (v, i) { return { transform: 'scale(' + v + ') translateY(' + ty[i] + 'px)', opacity: op[Math.min(i, op.length - 1)] }; }),
        { duration: M.DOCKING_MS, easing: 'linear', fill: 'both' }
      );
      /* —— 次级行：360ms 起，每行 80ms 错开，位移 24px → 0 —— */
      [bar, status].forEach(function (el, i) {
        if (!el) return;
        var start = M.FORM_ENTER_START_MS + i * M.FORM_ROW_STAGGER_MS;
        var dur = Math.max(1, M.DOCKING_MS - start);
        var y = smoothFrames(24, 0, 16), o = smoothFrames(0, 1, 10);
        el.animate(
          y.map(function (v, k) { return { transform: 'translateY(' + v + 'px)', opacity: o[Math.min(k, o.length - 1)] }; }),
          { duration: dur, delay: start, easing: 'linear', fill: 'both' }
        );
      });
    } catch (e) {}
  }

  function bootExit() {
    if (!boot) return;
    var name = boot.querySelector('.rl-boot-name');
    var status = boot.querySelector('.rl-boot-status');
    var bar = boot.querySelector('.rl-boot-bar');
    try {
      /* 名称向左移出、状态向右移出（不做整页淡出） */
      if (name) name.animate([{ transform: 'translateX(0)', opacity: 1 }, { transform: 'translateX(-72px)', opacity: 0 }],
        { duration: M.EXIT_MS, easing: M.ENTER_EASE, fill: 'forwards' });
      if (status) status.animate([{ transform: 'translateX(0)', opacity: 1 }, { transform: 'translateX(72px)', opacity: 0 }],
        { duration: M.EXIT_MS, easing: M.ENTER_EASE, fill: 'forwards' });
      if (bar) bar.animate([{ opacity: 1 }, { opacity: 0 }], { duration: M.EXIT_MS, easing: 'linear', fill: 'forwards' });
    } catch (e) {}
    setTimeout(function () {
      if (boot) { boot.classList.add('done'); }
      setTimeout(function () { if (boot && boot.parentNode) boot.parentNode.removeChild(boot); }, 220);
      startStagger(); startCounters();
    }, M.EXIT_MS);
  }

  function bootDone() {
    if (!boot || boot.dataset.rlExiting === '1') return;
    boot.dataset.rlExiting = '1';
    var elapsed = Date.now() - bootStart;
    var minTotal = M.DOCKING_MS + M.BOOT_HOLD_MS;
    var wait = Math.max(0, minTotal - elapsed);
    setTimeout(bootExit, wait);
  }

  /* ============================ 2. 阶梯进场 ============================ */
  var STAGGER_SELECTORS = [
    '.menu-options', '.info-card', '.member-list', '.feature-cards', '.map-list',
    '.contract-grid', '.selected-list', '.stat-grid', '[data-rl-stagger]'
  ];
  function startStagger() {
    if (motionOff) return;
    try {
      STAGGER_SELECTORS.forEach(function (sel) {
        document.querySelectorAll(sel).forEach(function (el) {
          if (el.classList.contains('rl-stagger')) return;
          var kids = Array.prototype.filter.call(el.children, function (c) {
            return c.nodeType === 1 && !c.classList.contains('rl-tab-indicator') && !c.classList.contains('rl-scan-line');
          });
          if (!kids.length || kids.length > 40) return;
          kids.forEach(function (c, i) { c.style.setProperty('--rl-i', String(Math.min(i, 24))); });
          el.classList.add('rl-stagger');
        });
      });
    } catch (e) {}
  }

  /* ============================ 3. 滚动数字 / 滚动文字（rolling-number） ============================ */
  /* 面板过渡 / 内容淡入（参考 ui-transitions.ts 的 SurfaceTransition / ContentTransition） */
  function surfaceTransition(root, panel, show) {
    if (!root) return;
    try {
      if (motionOff) { root.hidden = !show; return; }
      var hidden = root.hidden;
      var opacity = hidden ? '0' : (getComputedStyle(root).opacity || '1');
      var transform = panel ? (hidden ? 'translateY(12px)' : (getComputedStyle(panel).transform || 'none')) : null;
      var dur = show ? M.ENTER_MS : M.EXIT_MS_PANEL;
      var ease = show ? M.ENTER_EASE : M.EXIT_EASE;
      root.hidden = false;
      var anims = [];
      anims.push(root.animate([{ opacity: opacity }, { opacity: show ? 1 : 0 }], { duration: dur, easing: ease, fill: 'both' }));
      if (panel) {
        anims.push(panel.animate(
          [{ transform: transform }, { transform: show ? 'translateY(0)' : 'translateY(8px)' }],
          { duration: dur, easing: ease, fill: 'both' }
        ));
      }
      var last = anims[anims.length - 1];
      if (last && last.finished) {
        last.finished.then(function () { root.hidden = !show; anims.forEach(function (a) { try { a.cancel(); } catch (e) {} }); }).catch(function () {});
      }
    } catch (e) { root.hidden = !show; }
  }

  function contentReveal(el) {
    if (!el || motionOff) return;
    try {
      var from = (el.getAnimations && el.getAnimations().some(function (a) { return a.playState === 'running'; }))
        ? (getComputedStyle(el).opacity || '0.35') : '0.35';
      el.animate([{ opacity: from }, { opacity: 1 }], { duration: M.CONTENT_FADE_MS, easing: M.ENTER_EASE });
    } catch (e) {}
  }

  var rollingReady = null;
  function rollingAsset(rel) {
    try { return new URL('vendor/' + rel, document.currentScript ? document.currentScript.src : location.href).href; }
    catch (e) { return 'vendor/' + rel; }
  }
  function ensureRollingCss() {
    if (document.querySelector('link[data-rl-rolling-css]')) return;
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.setAttribute('data-rl-rolling-css', '1');
    l.href = rollingAsset('rolling-number.css');
    document.head.appendChild(l);
  }
  function loadRolling() {
    if (rollingReady) return rollingReady;
    rollingReady = new Promise(function (resolve) {
      try {
        ensureRollingCss();
        import(rollingAsset('rolling-number.esm.js')).then(resolve).catch(function () { resolve(null); });
      } catch (e) { resolve(null); }
    });
    return rollingReady;
  }

  function startCounters() {
    if (motionOff) return;
    try {
      /* 仅接管显式标记 [data-rl-roll] 的元素：
         页面自身会动态改写 textContent 的数值（列表计数、记录值等）不能自动接管，
         否则会与 rolling-number 维护的 DOM 结构冲突。
         属性值可写数字（滚动数字）或文字（滚动文字）。 */
      var targets = [];
      document.querySelectorAll('[data-rl-roll]').forEach(function (el) { targets.push(el); });
      if (!targets.length) return;
      loadRolling().then(function (mod) {
        if (!mod || !mod.createRollingNumber) {
          /* 降级：基础计数动画 */
          targets.forEach(function (el) { fallbackCount(el); });
          return;
        }
        targets.forEach(function (el) {
          if (el.getAttribute('data-rl-rolled') === '1') return;
          el.setAttribute('data-rl-rolled', '1');
          var raw = el.getAttribute('data-rl-roll');
          var num = parseFloat(raw);
          if (!isNaN(num)) {
            /* 滚动数字：从 0 滚到目标（460ms + motionBlur，可打断） */
            try {
              var prev = (el.textContent || '').trim();
              el.textContent = '0';
              var inst = mod.createRollingNumber(el, {
                duration: M.ROLL_DURATION,
                motionBlur: true,
                animated: true,
                locales: 'en-US',
                format: { minimumIntegerDigits: 1, useGrouping: false },
                value: 0
              });
              setTimeout(function () {
                try { inst.update({ value: num }); }
                catch (e) { el.textContent = String(num); }
              }, 60);
            } catch (e) { fallbackCount(el); }
          } else {
            /* 滚动文字（中文用 direct 直替，与参考实现一致） */
            try {
              mod.createRollingText(el, {
                duration: M.ROLL_DURATION,
                motionBlur: true,
                animated: true,
                transition: 'direct',
                stagger: 'none',
                text: el.textContent || ''
              });
            } catch (e) {}
          }
        });
      });
    } catch (e) {}
  }

  function fallbackCount(el) {
    try {
      var to = parseFloat(el.getAttribute('data-rl-roll')) || 0;
      var from = 0, t0 = null, dur = M.ROLL_DURATION + 400;
      function step(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(from + (to - from) * e));
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    } catch (e) {}
  }

  /* ============================ 4. 扫描线 ============================ */
  function injectScanlines() {
    if (motionOff) return;
    try {
      document.querySelectorAll('.container, .guild-container, .admin-container, .card, .app').forEach(function (el) {
        if (el.querySelector(':scope > .rl-scan-line') || el.classList.contains('rl-scan')) return;
        el.classList.add('rl-scan');
        var line = document.createElement('div');
        line.className = 'rl-scan-line';
        line.setAttribute('aria-hidden', 'true');
        el.appendChild(line);
      });
    } catch (e) {}
  }

  /* ============================ 5. 页签（文字 150ms + 下划线 180ms） ============================ */
  function bindTabs() {
    if (motionOff) return;
    try {
      document.querySelectorAll('.tabs').forEach(function (tabs) {
        if (tabs.querySelector(':scope > .rl-tab-indicator')) return;
        var ind = document.createElement('div');
        ind.className = 'rl-tab-indicator';
        tabs.appendChild(ind);
        var lastKey = '';
        function move(animate) {
          var active = tabs.querySelector('.tab.active') || tabs.querySelector('.tab');
          if (!active) { ind.style.opacity = '0'; return; }
          ind.style.opacity = '1';
          var r = active.getBoundingClientRect(), tr = tabs.getBoundingClientRect();
          var key = Math.round(r.width) + ':' + Math.round(r.left - tr.left);
          if (key === lastKey) return;      /* 无变化就不写样式，避免自触发 */
          lastKey = key;
          ind.style.transition = animate === false ? 'none' : ('transform ' + M.TAB_UNDERLINE_MS + 'ms ' + M.ENTER_EASE + ', width ' + M.TAB_UNDERLINE_MS + 'ms ' + M.ENTER_EASE);
          ind.style.width = r.width + 'px';
          ind.style.transform = 'translateX(' + (r.left - tr.left) + 'px)';
        }
        move(false);
        setTimeout(function () { move(true); }, 100);
        window.addEventListener('resize', function () { lastKey = ''; move(false); });
        /* 仅响应 class 变化，且回调不写 class（只写自己的 style），不会自我循环 */
        try { new MutationObserver(function () { move(true); }).observe(tabs, { subtree: true, attributes: true, attributeFilter: ['class'] }); } catch (e) {}
      });
    } catch (e) {}
  }

  /* ============================ 6. 面板 / 模态：纯 CSS 实现（无观察器） ============================ */
  /* 说明：早期版本用 MutationObserver 监听每个 .modal 的 class/style 再回写 class，
     在「高频重写 DOM」的页面（如游戏）上会与页面的 modals 切换互相触发，
     造成主线程阻塞。改为纯 CSS，零副作用。 */
  function bindModals() {
    if (document.querySelector('style[data-rl-modal-css]')) return;
    var style = document.createElement('style');
    style.setAttribute('data-rl-modal-css', '1');
    style.textContent = [
      '.modal.open .modal-box, .modal.active .modal-box, .modal.open .modal-content, .modal.active .modal-content {',
      '  animation: rlPanelEnter 300ms cubic-bezier(0.22,1,0.36,1) both; }',
      '@keyframes rlPanelEnter {',
      '  from { opacity: 0; transform: translateY(12px); }',
      '  to { opacity: 1; transform: translateY(0); } }',
      '.rl-tab-content { animation: rlFadeIn 150ms cubic-bezier(0.22,1,0.36,1) both; }'
    ].join('\n');
    document.head.appendChild(style);
  }

  /* ============================ 7. 状态灯 ============================ */
  function pulseLights() {
    if (motionOff) return;
    try {
      document.querySelectorAll('.user-bar, .system-footer, .header').forEach(function (el) {
        if (el.querySelector('.rl-light, .status-light')) el.classList.add('rl-pulse');
      });
    } catch (e) {}
  }

  /* ============================ 公开 API ============================ */
  window.RhineMotion = {
    timing: M,
    boot: function () { bootDone(); },
    count: fallbackCount,
    stagger: startStagger,
    reveal: contentReveal,
    surface: surfaceTransition,
    orbit: function (el, size, speed) {
      try {
        if (!el || motionOff) return null;
        var ring = document.createElement('div');
        ring.className = 'rl-orbit' + (speed ? ' ' + speed : '');
        var s = size || 120;
        ring.style.width = s + 'px'; ring.style.height = s + 'px';
        ring.style.right = '-30px'; ring.style.top = '-30px';
        el.appendChild(ring);
        return ring;
      } catch (e) { return null; }
    }
  };

  /* ============================ 启动 ============================ */
  function init() {
    injectScanlines();
    bindTabs();
    pulseLights();
    bindModals();
    if (boot && !boot.dataset.rlExiting) bootPlay();
    if (bootOff) { startStagger(); startCounters(); }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 20); });
  } else { setTimeout(init, 20); }
  window.addEventListener('load', bootDone);
  /* 固定时长推进：坞入 + 停留（不依赖 load，避免慢速网络下遮罩过久） */
  setTimeout(bootDone, M.DOCKING_MS + M.BOOT_HOLD_MS);
  setTimeout(bootDone, 2400);   // 硬兜底
})();
