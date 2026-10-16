// ==========================================================
// Apple Find My Map & Campus Tracker
// ==========================================================

export async function initFindMy() {
  const tile = document.querySelector('.tile--findmy');
  if (!tile) return;

  const person = tile.querySelector('.fm-person');
  const streetLabel = tile.querySelector('.fm-street');

  let route = null;
  try {
    const res = await fetch('./assets/map/route.json');
    if (res.ok) {
      route = await res.json();
    }
  } catch (e) {
    console.warn('Could not load Find My route, using defaults.');
  }

  if (!route) {
    route = {
      width: 800,
      height: 800,
      points: [[390, 470], [430, 470], [510, 450], [515, 300], [430, 290], [350, 290], [250, 310], [250, 460], [390, 470]],
      streets: ["Academy Lab", "Design Studio", "Spatial Hub", "Coffee Commons", "Swift Workshop", "Academy Lab"]
    };
  }

  const { points, streets } = route;
  let progress = 0;
  const speed = 0.003; // Smooth animation step

  function animate() {
    progress = (progress + speed) % (points.length - 1);
    const index = Math.floor(progress);
    const fraction = progress - index;

    const p1 = points[index];
    const p2 = points[index + 1];

    if (p1 && p2 && person) {
      const x = p1[0] + (p2[0] - p1[0]) * fraction;
      const y = p1[1] + (p2[1] - p1[1]) * fraction;

      const percentX = (x / route.width) * 100;
      const percentY = (y / route.height) * 100;

      person.style.left = `${percentX}%`;
      person.style.top = `${percentY}%`;
    }

    if (streetLabel && streets[index]) {
      streetLabel.textContent = streets[index];
    }

    requestAnimationFrame(animate);
  }

  animate();
}
