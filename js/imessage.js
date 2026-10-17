// ==========================================================
// macOS iMessage Toast Notification Banner
// ==========================================================

import { playChime, playClick } from './audio.js?v=20261017-track';

export function initIMessage() {
  const note = document.querySelector('.im-toast');
  if (!note) return;

  const closeBtn = note.querySelector('.im-close');
  const replyBtn = note.querySelector('.im-reply-btn');
  const compose = note.querySelector('.im-compose');
  const input = note.querySelector('.im-input');
  const sendBtn = note.querySelector('.im-send-btn');

  let shown = false;
  try {
    if (sessionStorage.getItem('imessage-seen')) shown = true;
  } catch (e) {}

  function showMessage() {
    if (shown) return;
    shown = true;
    try {
      sessionStorage.setItem('imessage-seen', '1');
    } catch (e) {}

    note.hidden = false;
    requestAnimationFrame(() => {
      note.classList.add('is-in');
      playChime();
    });

    // Auto dismiss after 10s if not interacting
    setTimeout(() => {
      if (!note.classList.contains('is-replying')) {
        dismissMessage();
      }
    }, 10000);
  }

  function dismissMessage() {
    note.classList.remove('is-in');
    note.classList.add('is-out');
    setTimeout(() => {
      note.hidden = true;
    }, 400);
  }

  // Trigger after 4 seconds
  setTimeout(showMessage, 4000);

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playClick();
      dismissMessage();
    });
  }

  if (replyBtn) {
    replyBtn.addEventListener('click', () => {
      playClick();
      note.classList.add('is-replying');
      if (compose) compose.hidden = false;
      if (input) input.focus();
    });
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!input || !input.value.trim()) return;
      playChime();
      alert(`Sent to Ikzaaz: "${input.value}"\n\nThanks for reaching out!`);
      dismissMessage();
    });
  }
}
