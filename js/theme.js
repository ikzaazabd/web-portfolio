// ==========================================================
// Theme Management (Light / Dark Appearance)
// ==========================================================

import { playClick } from './audio.js';

export function initTheme() {
  const toggleBtn = document.querySelector('.theme-toggle');
  
  function getTheme() {
    try {
      const saved = localStorage.getItem('theme');
      if (saved) return saved;
    } catch (e) {}
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {}
  }

  // Initial
  applyTheme(getTheme());

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      playClick();
      const current = document.documentElement.dataset.theme;
      const next = current === 'dark' ? 'light' : 'dark';
      
      if (document.startViewTransition) {
        document.startViewTransition(() => applyTheme(next));
      } else {
        applyTheme(next);
      }
    });
  }

  // React to OS changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    try {
      if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    } catch (err) {}
  });
}
