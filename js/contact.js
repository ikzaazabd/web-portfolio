// Native links handle Instagram, LinkedIn, GitHub, CV download, and email.
import { playClick } from './audio.js?v=20261017-track';

export function initContact() {
  document.querySelectorAll('.tile--contact a').forEach(link => {
    link.addEventListener('click', () => playClick());
  });
}
