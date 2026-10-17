// A zoomable Freeform-style board. The same content moves into a native dialog.
export function initCareer() {
  const tile = document.querySelector('#experience');
  if (!tile) return;
  const viewport = tile.querySelector('.career-viewport');
  const board = tile.querySelector('.career-board');
  const controls = tile.querySelector('.career-controls');
  const output = controls.querySelector('output');
  const expand = tile.querySelector('.career-expand');
  const dialog = document.createElement('dialog');
  dialog.className = 'career-dialog';
  dialog.setAttribute('aria-label', 'Work experience timeline');
  dialog.innerHTML = '<header class="career-dialog-header"><strong>My journey · Work experience</strong><button type="button" aria-label="Close timeline">Done</button></header>';
  document.body.append(dialog);
  let zoom = 1;
  function fit() {
    const scale = Math.min((viewport.clientWidth - 24) / 900, (viewport.clientHeight - 24) / 350) * zoom;
    board.style.transform = 'scale(' + scale + ')';
    board.style.width = '900px';
    output.textContent = Math.round(scale * 100) + '%';
    viewport.style.setProperty('--board-width', 900 * scale + 24 + 'px');
    viewport.style.setProperty('--board-height', 350 * scale + 24 + 'px');
  }
  controls.addEventListener('click', event => {
    const action = event.target.closest('[data-career-zoom]')?.dataset.careerZoom;
    if (!action) return;
    zoom = action === 'fit' ? 1 : Math.max(0.75, Math.min(3, zoom + (action === 'in' ? .25 : -.25)));
    fit();
  });
  expand.addEventListener('click', () => {
    dialog.append(viewport, controls);
    dialog.showModal();
    zoom = 1;
    fit();
  });
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    tile.append(viewport, controls);
    zoom = 1;
    fit();
    expand.focus();
  });
  new ResizeObserver(fit).observe(viewport);
  fit();
}
