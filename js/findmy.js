// Fixed map around Nongsa Digital Park. Pin movement is decorative, not live location.
export function initFindMy() {
  const map = document.querySelector('.academy-map');
  if (map) {
    // Nongsa Digital Park coordinates from its official contact page.
    const latitude = 1.185416;
    const longitude = 104.101666;
    const zoom = 16;
    const count = 2 ** zoom;
    const x = (longitude + 180) / 360 * count;
    const radians = latitude * Math.PI / 180;
    const y = (1 - Math.asinh(Math.tan(radians)) / Math.PI) / 2 * count;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const tileX = Math.floor(x) + dx;
        const tileY = Math.floor(y) + dy;
        const tile = document.createElement('img');
        tile.src = `https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`;
        tile.alt = '';
        tile.draggable = false;
        tile.loading = 'lazy';
        tile.style.left = `calc(50% + ${(tileX - x) * 256}px)`;
        tile.style.top = `calc(44% + ${(tileY - y) * 256}px)`;
        map.append(tile);
      }
    }
  }
  const pin = document.querySelector('.tile--findmy .fm-person');
  if (!pin) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let animation;
  function update() {
    animation?.cancel();
    if (motion.matches) return;
    animation = pin.animate([
      { left: '49%', top: '44%' },
      { left: '52%', top: '46%' },
      { left: '55%', top: '43%' },
      { left: '52%', top: '40%' },
      { left: '48%', top: '41%' },
      { left: '49%', top: '44%' }
    ], { duration: 32000, iterations: Infinity, easing: 'linear' });
  }
  motion.addEventListener('change', update);
  update();
}
