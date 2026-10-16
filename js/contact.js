// ==========================================================
// Apple Contacts Card Logic
// ==========================================================

import { playChime, playClick } from './audio.js';

export function initContact() {
  const tile = document.querySelector('.tile--contact');
  if (!tile) return;

  const copyBox = tile.querySelector('.ct-copy-box');
  const copyVal = tile.querySelector('.ct-copy-val');
  const status = tile.querySelector('.ct-status');

  if (copyBox) {
    copyBox.addEventListener('click', async () => {
      playChime();
      const email = copyVal ? copyVal.textContent.trim() : 'ikzaazabd@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        if (status) {
          status.textContent = 'Copied! ✓';
          setTimeout(() => {
            status.textContent = 'Copy';
          }, 2000);
        }
      } catch (e) {
        prompt('Copy email:', email);
      }
    });
  }

  const actions = tile.querySelectorAll('.ct-action-btn');
  actions.forEach(a => {
    a.addEventListener('click', () => playClick());
  });
}
