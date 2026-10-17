export function initAmbient() {
  const player = document.querySelector('.ambient-player');
  if (!player) return;
  const audio = player.querySelector('audio');
  const play = player.querySelector('[data-audio="play"]');
  const progress = player.querySelector('progress');
  const status = player.querySelector('.ambient-error');
  function render() {
    const playing = !audio.paused && !audio.ended;
    play.innerHTML = `<span class="sf-symbol" data-symbol="symbols-${playing ? 'pause-fill' : 'play-fill'}" aria-hidden="true"></span>`;
    play.setAttribute('aria-label', playing ? 'Pause Path Of The Fireflies' : 'Play Path Of The Fireflies');
    play.setAttribute('aria-pressed', String(playing));
    progress.max = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 1;
    progress.value = audio.currentTime;
  }
  player.addEventListener('click', async event => {
    const action = event.target.closest('[data-audio]')?.dataset.audio;
    if (!action) return;
    status.textContent = '';
    try {
      if (action === 'play') {
        if (audio.paused) await audio.play(); else audio.pause();
      } else {
        audio.currentTime = 0;
      }
    } catch { status.textContent = 'Audio could not start. Please try again.'; }
    render();
  });
  for (const event of ['play', 'pause', 'timeupdate', 'loadedmetadata', 'ended']) audio.addEventListener(event, render);
  audio.addEventListener('error', () => { status.textContent = 'Audio could not load. Please try again.'; render(); });
  window.addEventListener('pagehide', () => audio.pause());
  render();
}
