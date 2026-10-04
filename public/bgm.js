/*
 * 全站背景音乐：右下角音符按钮。
 *
 * 浏览器不允许自动播放带声音的媒体，所以默认不播；用户点过一次后记住选择，
 * 下次进站自动尝试播放，被拦下时等第一次交互再补播。
 * 音频地址相对本脚本解析，因此根目录页面与 public/ 子目录页面可共用同一份。
 */
(function () {
  'use strict';
  if (window.__uegBgm) return;

  var STORE_KEY = 'ueg_bgm_on';
  var TIME_KEY = 'ueg_bgm_time';
  var SAVE_MS = 5000;                       // 播放进度落盘间隔
  var VOLUME = 0.4;
  var Z_INDEX = 10000; // 高于启动动画层 .rl-boot（9999），避免首屏点击被挡住
  var scriptEl = document.currentScript;
  var base = scriptEl && scriptEl.src ? scriptEl.src.replace(/[^/]*$/, '') : '';

  function remembered() {
    // 未设置过 = 默认开启；用户手动关掉才记 '0'
    try { return localStorage.getItem(STORE_KEY) !== '0'; } catch (e) { return true; }
  }
  function remember(on) {
    try { localStorage.setItem(STORE_KEY, on ? '1' : '0'); } catch (e) {}
  }
  function savedTime() {
    try { var v = parseFloat(localStorage.getItem(TIME_KEY)); return isFinite(v) && v > 0 ? v : 0; }
    catch (e) { return 0; }
  }
  function saveTime() {
    try {
      if (audio && !audio.paused && isFinite(audio.currentTime)) {
        localStorage.setItem(TIME_KEY, String(audio.currentTime));
      }
    } catch (e) {}
  }

  var wantOn = remembered();
  var loading = false;
  var token = 0;
  var gestureArmed = false;
  var saveTimer = 0;

  var audio = new Audio();
  audio.loop = true;
  audio.preload = wantOn ? 'auto' : 'none'; // 已开启过的访客提前缓冲，点击即出声
  audio.volume = VOLUME;
  audio.src = base + 'audio/bgm.mp3';
  window.__uegBgm = { base: base, audio: audio };

  var style = document.createElement('style');
  style.textContent = [
    '.ueg-bgm{position:fixed;right:16px;bottom:16px;z-index:' + Z_INDEX + ';width:40px;height:40px;',
    'padding:0;border-radius:50%;border:1px solid rgba(255,255,255,.28);',
    'background:rgba(28,32,34,.82);color:#c9d3d6;cursor:pointer;display:flex;',
    'align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(0,0,0,.35);',
    'transition:color .2s,border-color .2s,transform .15s;-webkit-tap-highlight-color:transparent}',
    '.ueg-bgm:hover{color:#fff;border-color:rgba(255,255,255,.5);transform:translateY(-1px)}',
    '.ueg-bgm:focus-visible{outline:2px solid #ffd24a;outline-offset:2px}',
    '.ueg-bgm svg{width:20px;height:20px;display:block;fill:currentColor}',
    '.ueg-bgm.is-on{color:#ffd24a;border-color:rgba(255,210,74,.55);background:rgba(44,40,24,.86)}',
    '.ueg-bgm.is-loading{animation:ueg-bgm-pulse 1s ease-in-out infinite}',
    '@keyframes ueg-bgm-pulse{0%,100%{opacity:1}50%{opacity:.45}}',
    '@media (max-width:600px){.ueg-bgm{right:12px;bottom:12px;width:36px;height:36px}',
    '.ueg-bgm svg{width:18px;height:18px}}'
  ].join('');
  document.head.appendChild(style);

  var ICON = '<svg viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/></svg>';

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'ueg-bgm';
  btn.innerHTML = ICON;

  function paint() {
    btn.classList.toggle('is-on', wantOn);
    btn.classList.toggle('is-loading', loading);
    btn.setAttribute('aria-pressed', wantOn ? 'true' : 'false');
    var label = wantOn ? (loading ? '正在加载背景音乐' : '暂停背景音乐') : '播放背景音乐';
    btn.setAttribute('aria-label', label);
    btn.title = label;
  }

  function detachGesture() {
    document.removeEventListener('pointerdown', onFirstGesture, true);
    document.removeEventListener('keydown', onFirstGesture, true);
    document.removeEventListener('touchstart', onFirstGesture, true);
    gestureArmed = false;
  }

  function onFirstGesture(e) {
    detachGesture();
    if (btn.contains(e.target)) return; // 按钮自身交给 click 处理
    if (wantOn && audio.paused) beginLoad();
  }

  function armFirstGesture() {
    if (gestureArmed) return;
    gestureArmed = true;
    document.addEventListener('pointerdown', onFirstGesture, true);
    document.addEventListener('keydown', onFirstGesture, true);
    document.addEventListener('touchstart', onFirstGesture, true);
  }

  function beginLoad() {
    if (loading) return;
    loading = true;
    paint();
    // 跨页续播：接上上次离开时的进度
    var st = wantOn ? savedTime() : 0;
    if (st > 0 && (!audio.currentTime || audio.currentTime < 1)) {
      try { audio.currentTime = st; } catch (e) {}
    }
    var my = ++token;
    var p;
    try { p = audio.play(); } catch (err) { p = null; }
    if (p && p.then) {
      p.then(function () {
        if (my !== token) return;
        loading = false;
        paint();
      }).catch(function () {
        if (my !== token) return;
        loading = false;
        paint();
        armFirstGesture(); // 被浏览器拦下：保留意图，等第一次交互再试
      });
    } else {
      loading = false;
      paint();
    }
  }

  function toggle(on) {
    wantOn = on;
    if (on) {
      remember(true);
      beginLoad();
    } else {
      token++;
      loading = false;
      remember(false);
      try { audio.pause(); } catch (e) {}
      paint();
    }
  }

  btn.addEventListener('click', function () { toggle(!wantOn); });

  audio.addEventListener('playing', function () {
    loading = false;
    paint();
  });

  audio.addEventListener('waiting', function () {
    if (wantOn && audio.currentTime > 0 && audio.paused === false) {
      loading = true;
      paint();
    }
  });

  audio.addEventListener('progress', function () {
    if (!loading || !audio.duration || !audio.buffered.length) return;
    var pct = Math.min(99, Math.round(audio.buffered.end(audio.buffered.length - 1) / audio.duration * 100));
    btn.title = '正在加载背景音乐 ' + pct + '%';
  });

  audio.addEventListener('error', function () {
    loading = false;
    paint();
    btn.title = '背景音乐加载失败，点击重试';
  });

  function mount() {
    document.body.appendChild(btn);
    paint();
    if (!saveTimer) {
      saveTimer = setInterval(saveTime, SAVE_MS);
      window.addEventListener('pagehide', saveTime);
      window.addEventListener('beforeunload', saveTime);
    }
    if (wantOn) beginLoad();
  }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
