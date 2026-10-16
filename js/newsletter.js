// ==========================================================
// Apple Mail / DevLogs Widget Logic
// ==========================================================

import { playClick } from './audio.js';

export function initNewsletter() {
  const tile = document.querySelector('.tile--newsletter');
  if (!tile) return;

  const rows = [...tile.querySelectorAll('.ml-row')];
  const countEl = tile.querySelector('.ml-count');

  function updateUnreadCount() {
    const unread = rows.filter(r => !r.classList.contains('is-read')).length;
    if (countEl) countEl.textContent = unread > 0 ? `${unread} new` : 'All read';
  }

  rows.forEach(row => {
    row.addEventListener('click', (e) => {
      e.preventDefault();
      playClick();
      row.classList.add('is-read');
      updateUnreadCount();

      // Show reading alert modal or toast
      const title = row.querySelector('.ml-subject')?.textContent || 'DevLog';
      const preview = row.dataset.preview || 'Article preview loading...';
      alert(` DevLog Preview: \n\n"${title}"\n\n${preview}`);
    });
  });

  updateUnreadCount();
}
