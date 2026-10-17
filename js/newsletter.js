// Mail-inspired navigation filters the two real publications.
export function initNewsletter() {
  const tile = document.querySelector('.tile--newsletter');
  if (!tile) return;
  const filters = [...tile.querySelectorAll('[data-mail-filter]')];
  const publications = [...tile.querySelectorAll('[data-publication]')];
  filters.forEach(button => button.addEventListener('click', () => {
    const selected = button.dataset.mailFilter;
    filters.forEach(item => {
      const active = item.dataset.mailFilter === selected;
      item.classList.toggle('is-current', active);
      item.setAttribute('aria-pressed', String(active));
    });
    publications.forEach(item => {
      item.hidden = selected !== 'all' && item.dataset.publication !== selected;
    });
  }));
  const toggle = tile.querySelector('.ml-sidebar-toggle');
  toggle.addEventListener('click', () => {
    const hidden = tile.classList.toggle('mail-sidebar-hidden');
    tile.querySelectorAll('.ml-heading, .ml-box').forEach(item => { item.hidden = hidden; });
    toggle.setAttribute('aria-label', hidden ? 'Show Navigator' : 'Hide Navigator');
    toggle.setAttribute('aria-expanded', String(!hidden));
  });
}
