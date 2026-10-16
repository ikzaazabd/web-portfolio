// ==========================================================
// macOS App Switcher Dock Widget
// ==========================================================

import { playClick } from './audio.js';

export function initSwitcher() {
  const tile = document.querySelector('.tile--switcher');
  if (!tile) return;

  const apps = [...tile.querySelectorAll('.sw-app')];
  const panels = [...tile.querySelectorAll('.sw-panel')];
  const labelIcon = tile.querySelector('.sw-label-icon');
  const labelName = tile.querySelector('.sw-label-name');

  let activeIndex = 0;
  let autoTimer = null;

  function selectApp(index, playSound = false) {
    if (playSound) playClick();
    activeIndex = index;
    const app = apps[index];
    if (!app) return;

    apps.forEach((a, i) => a.classList.toggle('is-active', i === index));

    const appName = app.dataset.app;
    panels.forEach(p => p.classList.toggle('is-active', p.dataset.app === appName));

    if (labelIcon) labelIcon.src = app.querySelector('img').src;
    if (labelName) labelName.textContent = app.getAttribute('aria-label') || appName;
  }

  apps.forEach((app, i) => {
    app.addEventListener('click', (e) => {
      e.stopPropagation();
      clearInterval(autoTimer);
      selectApp(i, true);
    });
    app.addEventListener('mouseenter', () => {
      selectApp(i, false);
    });
  });

  // Auto-play when idle
  function startAuto() {
    autoTimer = setInterval(() => {
      if (document.hidden) return;
      const next = (activeIndex + 1) % apps.length;
      selectApp(next, false);
    }, 4500);
  }

  tile.addEventListener('mouseenter', () => clearInterval(autoTimer));
  tile.addEventListener('mouseleave', () => startAuto());

  selectApp(0, false);
  startAuto();
}
