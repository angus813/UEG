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
  var VOLUME = 0.4;
  var scriptEl = document.currentScript;
  var base = scriptEl && scriptEl.src ? scriptEl.src.replace(/[^/]*$/, '') : '';

  function remembered() {
    try { return localStorage.getItem(STORE_KEY) === '1'; } catch (e) { return false; }
  }
  function remember(on) {
    try {
      if (on) localStorage.setItem(STORE_KEY, '1');
      else localStorage.removeItem(STORE_KEY);
    } catch (e) {}
  }

  var audio = new Audio();
  audio.loop = true;
  audio.preload = 'none';
  audio.volume = VOLUME;
  audio.src = base + 'audio/bgm.mp3';
  window.__uegBgm = { base: base, audio: audio };

  var style = document.createElement('style');
  style.textContent = [
    '.ueg-bgm{position:fixed;right:16px;bottom:16px;z-index:9998;width:40px;height:40px;',
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

  function paint(on, loading) {
    btn.classList.toggle('is-on', !!on);
    btn.classList.toggle('is-loading', !!loading);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.setAttribute('aria-label', on ? '暂停背景音乐' : '播放背景音乐');
    btn.title = on ? '暂停背景音乐' : '播放背景音乐';
  }

  var armed = false;
  function armFirstGesture() {
    if (armed) return;
    armed = true;
    var fire = function () {
      document.removeEventListener('pointerdown', fire, true);
      document.removeEventListener('keydown', fire, true);
      document.removeEventListener('touchstart', fire, true);
      armed = false;
      if (remembered() && audio.paused) start();
    };
    document.addEventListener('pointerdown', fire, true);
    document.addEventListener('keydown', fire, true);
    document.addEventListener('touchstart', fire, true);
  }

  function start() {
    paint(true, true);
    var p = audio.play();
    if (p && p.then) {
      p.then(function () {
        remember(true);
        paint(true, false);
      }).catch(function () {
        paint(false, false);
        armFirstGesture();
      });
    } else {
      remember(true);
      paint(true, false);
    }
  }

  function stop() {
    audio.pause();
    remember(false);
    paint(false, false);
  }

  btn.addEventListener('click', function () {
    if (audio.paused) start();
    else stop();
  });

  function mount() {
    document.body.appendChild(btn);
    if (remembered()) {
      paint(true, false);
      if (audio.paused) start();
    } else {
      paint(false, false);
    }
  }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
