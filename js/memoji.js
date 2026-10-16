// ==========================================================
// Siri / Memoji Apple Intelligence Interaction
// ==========================================================

import { playSiriChime } from './audio.js';

export function initMemoji() {
  const tile = document.querySelector('.tile--avatar');
  if (!tile) return;

  const btn = tile.querySelector('.siri-button');
  const label = tile.querySelector('.siri-label');
  const text = tile.querySelector('.siri-text');

  let currentLook = 'pixel';
  try {
    const saved = localStorage.getItem('avatar-look');
    if (saved === 'memoji') {
      currentLook = 'memoji';
      tile.dataset.look = 'memoji';
      if (label) label.textContent = 'Change back';
    }
  } catch (e) {}

  let isBusy = false;

  const sleep = ms => new Promise(res => setTimeout(res, ms));

  async function typePrompt(message) {
    if (!text) return;
    text.textContent = '';
    for (let i = 0; i < message.length; i++) {
      text.textContent += message[i];
      await sleep(35);
    }
  }

  if (btn) {
    btn.addEventListener('click', async () => {
      if (isBusy) return;
      isBusy = true;

      playSiriChime();
      tile.classList.add('is-asking');

      const nextLook = currentLook === 'memoji' ? 'pixel' : 'memoji';
      const prompt = nextLook === 'memoji' ? 'Hey Siri, Memoji me' : 'Hey Siri, switch back';

      await typePrompt(prompt);
      await sleep(600);

      currentLook = nextLook;
      tile.dataset.look = nextLook;
      try {
        localStorage.setItem('avatar-look', nextLook);
      } catch (e) {}

      if (label) {
        label.textContent = nextLook === 'memoji' ? 'Change back' : 'Memoji me';
      }

      await sleep(800);
      tile.classList.remove('is-asking');
      if (text) text.textContent = '';
      isBusy = false;
    });
  }
}
