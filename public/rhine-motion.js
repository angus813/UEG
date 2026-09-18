/* ============================================================================
   RHINE LAB ARCHIVE · 动效层 JS v1
   启动序列 · 阶梯进场 · 数字滚动 · tab 滑动指示器 · 扫描线注入
   ─────────────────────────────────────────────────────────────────────────
   容错设计：全部包裹 try/catch，不影响页面原有脚本。
   关闭启动序列：<html data-rl-boot="off">
   关闭全部动效：<html data-rl-motion="off">（或系统 prefers-reduced-motion）
   ============================================================================ */
(function () {
  'use strict';
  var docEl = document.documentElement;
  var reduced = false;
  try { reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var motionOff = docEl.getAttribute('data-rl-motion') === 'off' || reduced;
  var bootOff = docEl.getAttribute('data-rl-boot') === 'off' || motionOff;

  /* ==================== 1. boot 启动序列 ==================== */
  var boot = null, bootStart = Date.now();
  try {
    if (!bootOff) {
      boot = document.createElement('div');
      boot.className = 'rl-boot';
      boot.setAttribute('aria-hidden', 'true');
      boot.innerHTML =
        '<div class="rl-boot-name">RHINE LAB ARCHIVE</div>' +
        '<div class="rl-boot-bar"><i></i></div>' +
        '<div class="rl-boot-status">SYSTEM INITIALIZING<i></i></div>';
      docEl.appendChild(boot);
    }
  } catch (e) { boot = null; }

  function bootDone() {
    if (!boot) return;
    try {
      var wait = Math.max(0, 760 - (Date.now() - bootStart));
      setTimeout(function () {
        boot.classList.add('done');
        setTimeout(function () { if (boot && boot.parentNode) boot.parentNode.removeChild(boot); }, 720);
        startStagger();
        startCounters();
      }, wait);
    } catch (e) { if (boot && boot.parentNode) boot.parentNode.removeChild(boot); }
  }

  /* ==================== 2. 阶梯进场 ==================== */
  var STAGGER_SELECTORS = [
    '.menu-options', '.info-card', '.member-list', '.feature-cards', '.map-list',
    '.contract-grid', '.selected-list', '.stat-grid', '.tabs', '[data-rl-stagger]'
  ];
  function startStagger() {
    if (motionOff) return;
    try {
      STAGGER_SELECTORS.forEach(function (sel) {
        document.querySelectorAll(sel).forEach(function (el) {
          if (el.classList.contains('rl-stagger')) return;
          var kids = Array.prototype.filter.call(el.children, function (c) {
            return c.nodeType === 1 && !c.classList.contains('rl-tab-indicator');
          });
          if (!kids.length || kids.length > 40) return;
          kids.forEach(function (c, i) { c.style.setProperty('--rl-i', String(Math.min(i, 24))); });
          el.classList.add('rl-stagger');
        });
      });
    } catch (e) {}
  }

  /* ==================== 3. 数字滚动 ==================== */
  function animateCount(el, to, dur) {
    var from = parseFloat(el.getAttribute('data-rl-from')) || 0;
    var t0 = null;
    dur = dur || 1100;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      var v = Math.round(from + (to - from) * e);
      el.textContent = String(v);
      if (p < 1) requestAnimationFrame(step); else el.textContent = String(to);
    }
    requestAnimationFrame(step);
  }
  function startCounters() {
    if (motionOff) return;
    try {
      document.querySelectorAll('[data-rl-count]').forEach(function (el) {
        if (el.getAttribute('data-rl-counted') === '1') return;
        el.setAttribute('data-rl-counted', '1');
        var to = parseFloat(el.getAttribute('data-rl-count'));
        if (isNaN(to)) to = parseFloat(el.textContent) || 0;
        el.classList.add('rl-count');
        animateCount(el, to);
      });
      // 自动识别「数值型」节点：.rhine-stat / .num / .record-value
      document.querySelectorAll('.rhine-stat, .record-value, .level-value').forEach(function (el) {
        if (el.getAttribute('data-rl-counted') === '1') return;
        var txt = (el.textContent || '').trim();
        if (!/^-?\d[\d,]*$/.test(txt)) return;
        var num = parseFloat(txt.replace(/,/g, ''));
        if (isNaN(num)) return;
        el.setAttribute('data-rl-counted', '1');
        el.classList.add('rl-count');
        animateCount(el, num);
      });
    } catch (e) {}
  }

  /* ==================== 4. 扫描线注入 ==================== */
  function injectScanlines() {
    if (motionOff) return;
    try {
      var targets = document.querySelectorAll('.container, .guild-container, .admin-container, .card, .app');
      targets.forEach(function (el) {
        if (el.querySelector(':scope > .rl-scan-line')) return;
        if (el.classList.contains('rl-scan')) return;
        el.classList.add('rl-scan');
        var line = document.createElement('div');
        line.className = 'rl-scan-line';
        line.setAttribute('aria-hidden', 'true');
        el.appendChild(line);
      });
    } catch (e) {}
  }

  /* ==================== 5. tab 滑动指示器 ==================== */
  function bindTabs() {
    if (motionOff) return;
    try {
      document.querySelectorAll('.tabs').forEach(function (tabs) {
        if (tabs.querySelector(':scope > .rl-tab-indicator')) return;
        var ind = document.createElement('div');
        ind.className = 'rl-tab-indicator';
        tabs.appendChild(ind);
        function move() {
          var active = tabs.querySelector('.tab.active') || tabs.querySelector('.tab');
          if (!active) { ind.style.opacity = '0'; return; }
          ind.style.opacity = '1';
          var r = active.getBoundingClientRect(), tr = tabs.getBoundingClientRect();
          ind.style.width = r.width + 'px';
          ind.style.transform = 'translateX(' + (r.left - tr.left) + 'px)';
        }
        move();
        setTimeout(move, 120);
        window.addEventListener('resize', move);
        try {
          new MutationObserver(move).observe(tabs, { subtree: true, attributes: true, attributeFilter: ['class'] });
        } catch (e) {}
      });
    } catch (e) {}
  }

  /* ==================== 6. 状态灯脉冲 ==================== */
  function pulseLights() {
    if (motionOff) return;
    try {
      document.querySelectorAll('.user-bar, .system-footer, .header').forEach(function (el) {
        if (el.querySelector('.rl-light, .status-light')) el.classList.add('rl-pulse');
      });
    } catch (e) {}
  }

  /* ==================== 7. 模态开启时的进场钩子 ==================== */
  function bindModals() {
    try {
      document.querySelectorAll('.modal').forEach(function (m) {
        if (m.getAttribute('data-rl-motion-bound') === '1') return;
        m.setAttribute('data-rl-motion-bound', '1');
        try {
          new MutationObserver(function () {
            var open = m.classList.contains('open') || m.classList.contains('active') ||
              (m.style.display && m.style.display !== 'none');
            if (open) { m.classList.add('open'); }
            else { m.classList.remove('open'); }
          }).observe(m, { attributes: true, attributeFilter: ['class', 'style'] });
        } catch (e) {}
      });
    } catch (e) {}
  }

  /* ==================== 公开 API ==================== */
  window.RhineMotion = {
    boot: function () { /* 手动结束 boot */ bootDone(); },
    count: animateCount,
    stagger: startStagger,
    /* 在元素内注入轨道装饰环 */
    orbit: function (el, size, speed) {
      try {
        if (!el || motionOff) return null;
        var ring = document.createElement('div');
        ring.className = 'rl-orbit' + (speed ? ' ' + speed : '');
        var s = size || 120;
        ring.style.width = s + 'px';
        ring.style.height = s + 'px';
        ring.style.right = '-30px';
        ring.style.top = '-30px';
        el.appendChild(ring);
        return ring;
      } catch (e) { return null; }
    }
  };

  /* ==================== 启动 ==================== */
  function init() {
    injectScanlines();
    bindTabs();
    pulseLights();
    bindModals();
    // 无 boot 时直接播放进场
    if (bootOff) { startStagger(); startCounters(); }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 30); });
  } else {
    setTimeout(init, 30);
  }
  window.addEventListener('load', bootDone);
  // 兜底：最多 2.6s 后强制结束 boot
  setTimeout(bootDone, 2600);
})();
