// Metadata is supplied by the owner; no camera details are inferred.
export function initPhotos() {
  const tile = document.querySelector('.tile--photos');
  if (!tile) return;
  const slides = [...tile.querySelectorAll('.ph-slide')];
  const dots = [...tile.querySelectorAll('.ph-dot')];
  const info = tile.querySelector('.ph-info-panel');
  const infoButton = tile.querySelector('.ph-info-btn');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0, timer, visible = false, paused = reducedMotion.matches;
  function schedule() {
    clearTimeout(timer);
    if (visible && !paused && info.hidden && !document.hidden) {
      timer = setTimeout(() => show((current + 1) % slides.length), 3000);
    }
  }
  function show(index) {
    current = index;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === index);
      slide.setAttribute('aria-hidden', String(i !== index));
      dots[i].setAttribute('aria-pressed', String(i === index));
    });
    const data = slides[index].dataset;
    info.querySelector('.ph-exif-date').textContent = new Date(data.date + 'T12:00:00').toLocaleDateString('en-GB', {weekday:'long', day:'numeric', month:'long', year:'numeric'});
    for (const key of ['device', 'lens', 'loc']) info.querySelector('.ph-exif-' + key).textContent = data[key];
    schedule();
  }
  function setInfo(open) {
    info.hidden = !open;
    info.classList.toggle('is-open', open);
    tile.classList.toggle('ph-showing-info', open);
    infoButton.setAttribute('aria-expanded', String(open));
    infoButton.setAttribute('aria-label', open ? 'Hide photo information' : 'Show photo information');
    schedule();
  }
  infoButton.addEventListener('click', () => setInfo(info.hidden));
  dots.forEach((dot, index) => dot.addEventListener('click', () => show(index)));
  tile.addEventListener('click', event => {
    if (event.target.closest('button, .ph-info-panel')) return;
    if (!info.hidden) return;
    show((current + 1) % slides.length);
  });
  tile.addEventListener('keydown', event => {
    if (event.key === 'Escape') { setInfo(false); infoButton.focus(); }
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      show((current + (event.key === 'ArrowRight' ? 1 : slides.length - 1)) % slides.length);
      dots[current].focus();
    }
  });
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); }, {threshold: .2}).observe(tile);
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', event => { paused = event.matches; schedule(); });
  show(0);
  schedule();
}
