// ==========================================================
// Apple Calendar "Up Next" / Office Hours Widget
// ==========================================================

import { playClick, playChime } from './audio.js?v=20261017-track';

export function initOfficeHours() {
  const tile = document.querySelector('.tile--office');
  if (!tile) return;

  const weekdayEl = tile.querySelector('.ch-weekday');
  const dateEl = tile.querySelector('.ch-date');
  const picker = tile.querySelector('.ch-picker');
  const daysList = tile.querySelector('.ch-days-list');
  const closeBtn = tile.querySelector('.ch-picker-close');

  const now = new Date();
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = weekdays[now.getDay()];
  const dateNum = now.getDate();

  if (weekdayEl) weekdayEl.textContent = dayName;
  if (dateEl) dateEl.textContent = dateNum;

  // Generate next 3 business days
  if (daysList) {
    daysList.innerHTML = '';
    let count = 0;
    let offset = 1;
    while (count < 3) {
      const d = new Date();
      d.setDate(now.getDate() + offset);
      if (d.getDay() !== 0 && d.getDay() !== 6) { // Skip weekends
        const dayStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ch-day-btn';
        btn.innerHTML = `<span>${dayStr}</span><span style="font-size:12px;opacity:0.8">30m slot ↗</span>`;
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          playChime();
          const email = 'ikzaazabd@gmail.com';
          const subject = encodeURIComponent(`Coffee Chat / Discussion: ${dayStr}`);
          const body = encodeURIComponent(`Hi Ikzaaz,\n\nI visited ikzaazabd.site and would love to connect for a 30-minute chat regarding ${dayStr}.\n\nLooking forward to speaking with you!`);
          window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
          if (picker) { picker.classList.remove('is-open'); picker.setAttribute('aria-hidden', 'true'); }
        });
        daysList.appendChild(btn);
        count++;
      }
      offset++;
    }
  }

  // Open picker
  tile.addEventListener('click', (e) => {
    if (picker && !picker.contains(e.target)) {
      playClick();
      picker.classList.add('is-open');
      picker.setAttribute('aria-hidden', 'false');
      picker.querySelector('button')?.focus();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playClick();
      if (picker) { picker.classList.remove('is-open'); picker.setAttribute('aria-hidden', 'true'); }
    });
  }
}
