// ==========================================================
// Apple Music & Spotify Player Widget
// Real Web Audio Lofi Ambient Synthesizer
// ==========================================================

import { isSoundEnabled } from './audio.js';

let audioCtx = null;
let isPlaying = false;
let chordInterval = null;

function startLofiSynth() {
  if (!isSoundEnabled()) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  // Gentle lofi progression: Cmaj7 -> Am7 -> Fmaj7 -> G7
  const chords = [
    [261.63, 329.63, 392.00, 493.88], // Cmaj7
    [220.00, 261.63, 329.63, 392.00], // Am7
    [174.61, 220.00, 261.63, 329.63], // Fmaj7
    [196.00, 246.94, 293.66, 349.23]  // G7
  ];

  let currentChord = 0;

  function playChord() {
    if (!isPlaying || !audioCtx) return;
    const now = audioCtx.currentTime;
    const freqs = chords[currentChord];

    freqs.forEach(f => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 3.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 3.2);
    });

    currentChord = (currentChord + 1) % chords.length;
  }

  playChord();
  chordInterval = setInterval(playChord, 3000);
}

function stopLofiSynth() {
  isPlaying = false;
  if (chordInterval) {
    clearInterval(chordInterval);
    chordInterval = null;
  }
}

export function initPlaylists() {
  const tile = document.querySelector('.tile--spotify');
  if (!tile) return;

  const rows = [...tile.querySelectorAll('.sp-row')];
  const cover = tile.querySelector('.sp-cover');
  const title = tile.querySelector('.sp-title');
  const meta = tile.querySelector('.sp-meta');
  const playBtn = tile.querySelector('.sp-play-btn');
  const playerCover = tile.querySelector('.sp-player-cover');
  const playerTitle = tile.querySelector('.sp-player-title');
  const miniPlayBtn = tile.querySelector('.sp-player-play');

  function select(row) {
    rows.forEach(r => r.classList.toggle('is-active', r === row));
    const name = row.querySelector('.sp-row-title').textContent;
    const coverSrc = row.querySelector('img').src;
    const color = row.dataset.color || '#3b82f6';
    const detail = row.dataset.detail || '24 tracks';

    tile.style.setProperty('--sp-color', color);
    if (cover) cover.src = coverSrc;
    if (title) title.textContent = name;
    if (meta) meta.innerHTML = `<strong>Ikjas</strong> · ${detail}`;
    if (playerCover) playerCover.src = coverSrc;
    if (playerTitle) playerTitle.textContent = name;
  }

  rows.forEach(r => {
    r.addEventListener('click', () => {
      select(r);
      if (isPlaying) {
        stopLofiSynth();
        isPlaying = true;
        startLofiSynth();
      }
    });
  });

  function togglePlay() {
    isPlaying = !isPlaying;
    const icon = isPlaying
      ? '<svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>'
      : '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';

    if (playBtn) playBtn.innerHTML = icon;
    if (miniPlayBtn) miniPlayBtn.innerHTML = icon;

    if (isPlaying) {
      startLofiSynth();
    } else {
      stopLofiSynth();
    }
  }

  if (playBtn) playBtn.addEventListener('click', togglePlay);
  if (miniPlayBtn) miniPlayBtn.addEventListener('click', togglePlay);

  select(rows[0]);
}
