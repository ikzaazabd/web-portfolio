// ==========================================================
// Apple Photos Gallery Slideshow & EXIF Inspector
// ==========================================================

import { playClick } from './audio.js';

export function initPhotos() {
  const tile = document.querySelector('.tile--photos');
  if (!tile) return;

  const slides = [...tile.querySelectorAll('.ph-slide')];
  const infoBtn = tile.querySelector('.ph-info-btn');
  const infoPanel = tile.querySelector('.ph-info-panel');
  let current = 0;

  function showSlide(index) {
    slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
    const active = slides[index];
    if (infoPanel && active) {
      infoPanel.querySelector('.ph-exif-device').textContent = active.dataset.device || 'Apple iPhone 15 Pro';
      infoPanel.querySelector('.ph-exif-lens').textContent = active.dataset.lens || 'Main Camera — 24 mm f/1.78';
      infoPanel.querySelector('.ph-exif-mp').textContent = active.dataset.mp || '48 MP · 8064 × 6048';
      infoPanel.querySelector('.ph-exif-loc').textContent = active.dataset.loc || 'Apple Developer Academy';
    }
  }

  tile.addEventListener('click', (e) => {
    if (infoBtn && infoBtn.contains(e.target)) return;
    if (infoPanel && infoPanel.contains(e.target)) {
      infoPanel.classList.remove('is-open');
      return;
    }
    playClick();
    current = (current + 1) % slides.length;
    showSlide(current);
  });

  if (infoBtn) {
    infoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playClick();
      if (infoPanel) infoPanel.classList.toggle('is-open');
    });
  }

  showSlide(0);
}
