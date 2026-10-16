// ==========================================================
// Apple Freeform Interactive Whiteboard Canvas
// ==========================================================

import { playClick } from './audio.js';

export function initFreeform() {
  const tile = document.querySelector('.tile--freeform');
  if (!tile) return;

  const viewport = tile.querySelector('.ff-viewport');
  const canvas = tile.querySelector('.ff-canvas');
  const itemsContainer = tile.querySelector('.ff-items');
  const addNoteBtn = tile.querySelector('[data-add="note"]');
  const penBtn = tile.querySelector('[data-add="pen"]');
  const clearBtn = tile.querySelector('[data-act="reset"]');
  const expandBtn = tile.querySelector('.ff-expand');
  const zoomInBtn = tile.querySelector('[data-zoom="in"]');
  const zoomOutBtn = tile.querySelector('[data-zoom="out"]');
  const zoomFitBtn = tile.querySelector('[data-zoom="fit"]');
  const zoomVal = tile.querySelector('.ff-zoom-val');

  let isPenMode = false;
  let isDrawing = false;
  let currentZoom = 1;
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    if (!canvas) return;
    const rect = viewport.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  window.addEventListener('resize', resizeCanvas);
  setTimeout(resizeCanvas, 100);

  // Pen tool drawing
  if (penBtn) {
    penBtn.addEventListener('click', () => {
      playClick();
      isPenMode = !isPenMode;
      penBtn.classList.toggle('is-active', isPenMode);
      viewport.classList.toggle('is-pen', isPenMode);
    });
  }

  canvas.addEventListener('mousedown', (e) => {
    if (!isPenMode) return;
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#007aff';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDrawing || !isPenMode) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  });

  window.addEventListener('mouseup', () => {
    if (isDrawing) {
      isDrawing = false;
      ctx.closePath();
    }
  });

  // Touch drawing
  canvas.addEventListener('touchstart', (e) => {
    if (!isPenMode) return;
    isDrawing = true;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
    ctx.strokeStyle = '#007aff';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  });

  canvas.addEventListener('touchmove', (e) => {
    if (!isDrawing || !isPenMode) return;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
    ctx.stroke();
  });

  canvas.addEventListener('touchend', () => {
    isDrawing = false;
  });

  // Dragging Sticky Notes
  function makeDraggable(note) {
    let startX = 0, startY = 0, initialLeft = 0, initialTop = 0;
    let isDragging = false;

    note.addEventListener('mousedown', (e) => {
      if (isPenMode) return;
      isDragging = true;
      note.classList.add('is-dragging');
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = note.offsetLeft;
      initialTop = note.offsetTop;
      e.stopPropagation();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      note.style.left = `${initialLeft + dx}px`;
      note.style.top = `${initialTop + dy}px`;
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        note.classList.remove('is-dragging');
      }
    });

    // Editable text
    note.addEventListener('dblclick', () => {
      const newText = prompt('Edit note text:', note.textContent);
      if (newText !== null && newText.trim() !== '') {
        note.textContent = newText;
      }
    });
  }

  // Pre-loaded notes
  const notes = [
    { text: 'ikzaazabd.site\nLifelong Digital Hub 🚀', color: 'yellow', x: 20, y: 30 },
    { text: 'Apple Academy CBL\nInfinite Learning Batam ', color: 'peach', x: 170, y: 50 },
    { text: 'Arah ML & HydroTime\nProduct & UX Prototypes', color: 'mint', x: 330, y: 30 }
  ];

  function renderNotes() {
    itemsContainer.innerHTML = '';
    notes.forEach((n) => {
      const el = document.createElement('div');
      el.className = `ff-note ff-note--${n.color}`;
      el.textContent = n.text;
      el.style.left = `${n.x}px`;
      el.style.top = `${n.y}px`;
      itemsContainer.appendChild(el);
      makeDraggable(el);
    });
  }

  renderNotes();

  // Add new sticky note
  const noteColors = ['yellow', 'peach', 'mint', 'blue', 'purple'];
  if (addNoteBtn) {
    addNoteBtn.addEventListener('click', () => {
      playClick();
      const color = noteColors[Math.floor(Math.random() * noteColors.length)];
      const text = prompt('Enter text for sticky note:', 'New Idea ✨');
      if (text) {
        const el = document.createElement('div');
        el.className = `ff-note ff-note--${color}`;
        el.textContent = text;
        el.style.left = `${Math.floor(Math.random() * 200) + 50}px`;
        el.style.top = `${Math.floor(Math.random() * 100) + 20}px`;
        itemsContainer.appendChild(el);
        makeDraggable(el);
      }
    });
  }

  // Clear / Reset Canvas
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      playClick();
      if (confirm('Clear drawings on the Freeform board?')) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        renderNotes();
      }
    });
  }

  // Expand / Fullscreen
  if (expandBtn) {
    expandBtn.addEventListener('click', () => {
      playClick();
      tile.classList.toggle('is-expanded');
      setTimeout(resizeCanvas, 300);
    });
  }

  // Zoom
  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
      currentZoom = Math.min(1.5, currentZoom + 0.1);
      updateZoom();
    });
  }
  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
      currentZoom = Math.max(0.6, currentZoom - 0.1);
      updateZoom();
    });
  }
  if (zoomFitBtn) {
    zoomFitBtn.addEventListener('click', () => {
      currentZoom = 1;
      updateZoom();
    });
  }

  function updateZoom() {
    playClick();
    if (zoomVal) zoomVal.textContent = `${Math.round(currentZoom * 100)}%`;
    itemsContainer.style.transform = `scale(${currentZoom})`;
    itemsContainer.style.transformOrigin = 'top left';
  }
}
