// ==========================================================
// Rearrange & Wiggle Mode (iOS Home Screen Jiggle)
// ==========================================================

import { playClick, playChime } from './audio.js?v=20261017-track';

export function initRearrange() {
  const grid = document.querySelector('.grid');
  const editBtn = document.querySelector('.ra-edit-btn');
  const bar = document.querySelector('.ra-bar');
  const doneBtn = document.querySelector('.ra-done-btn');
  const resetBtn = document.querySelector('.ra-reset-btn');

  if (!grid || !editBtn || !bar) return;

  const tiles = [...grid.children];
  const STORAGE_KEY = 'ikjas-tile-order-v2';

  // Restore saved order
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved) && saved.length > 0) {
      saved.forEach(className => {
        const match = tiles.find(t => t.classList.contains(className));
        if (match) grid.appendChild(match);
      });
    }
  } catch (e) {}

  let isEditing = false;
  let draggedTile = null;

  function setEditing(editing) {
    isEditing = editing;
    grid.classList.toggle('is-editing', editing);
    bar.hidden = !editing;
    editBtn.hidden = editing;

    tiles.forEach(tile => {
      tile.draggable = editing;
      if (editing) {
        tile.style.animationDelay = `${(Math.random() * -0.4).toFixed(2)}s`;
      } else {
        tile.style.animationDelay = '';
      }
    });

    if (editing) {
      playChime();
    } else {
      playClick();
      saveOrder();
    }
  }

  function saveOrder() {
    const currentOrder = [...grid.children].map(tile => {
      return [...tile.classList].find(c => c.startsWith('tile--')) || '';
    });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentOrder));
    } catch (e) {}
  }

  editBtn.addEventListener('click', () => setEditing(true));
  doneBtn.addEventListener('click', () => setEditing(false));

  resetBtn.addEventListener('click', () => {
    playClick();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    location.reload();
  });

  // Drag and drop event handlers
  tiles.forEach(tile => {
    tile.addEventListener('dragstart', (e) => {
      if (!isEditing) return;
      draggedTile = tile;
      tile.classList.add('is-dragging');
      e.dataTransfer.effectAllowed = 'move';
    });

    tile.addEventListener('dragend', () => {
      tile.classList.remove('is-dragging');
      draggedTile = null;
    });

    tile.addEventListener('dragover', (e) => {
      if (!isEditing || !draggedTile || draggedTile === tile) return;
      e.preventDefault();
      const rect = tile.getBoundingClientRect();
      const next = (e.clientX - rect.left) / (rect.right - rect.left) > 0.5;
      grid.insertBefore(draggedTile, next ? tile.nextSibling : tile);
    });
  });
}
