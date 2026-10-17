import { initTheme } from './theme.js';
import { initSoundToggle, initInteractionSounds } from './audio.js?v=20261017-track';

export function initSiteControls() {
  if (document.querySelector('.site-controls')) return;

  const controls = document.createElement('div');
  controls.className = 'site-controls';
  controls.setAttribute('role', 'group');
  controls.setAttribute('aria-label', 'Page controls');
  controls.innerHTML = `
    <button class="theme-toggle" type="button" aria-label="Toggle dark/light mode">
      <svg class="icon-moon" viewBox="0 0 24 24" aria-hidden="true" width="19" height="19" fill="currentColor">
        <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z"/>
      </svg>
      <svg class="icon-sun" viewBox="0 0 24 24" aria-hidden="true" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <circle cx="12" cy="12" r="4.5" fill="currentColor"/>
        <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/>
      </svg>
    </button>
    <button class="sound-toggle" type="button" aria-label="Mute sound effects">
      <span class="sf-symbol sound-on" data-symbol="symbols-speaker-wave-2" aria-hidden="true"></span>
      <span class="sf-symbol sound-off" data-symbol="symbols-speaker-slash" aria-hidden="true"></span>
    </button>
  `;
  document.body.append(controls);

  initTheme();
  initSoundToggle();
  initInteractionSounds();
}
