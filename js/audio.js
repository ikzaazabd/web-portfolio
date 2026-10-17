// ==========================================================
// Web Audio API Synthesizer for Apple UI Sound FX
// Zero external audio file dependencies
// ==========================================================

let audioCtx = null;
let soundEnabled = true;

try {
  const saved = localStorage.getItem('sound-enabled');
  if (saved !== null) soundEnabled = saved === 'true';
} catch (e) {}

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isSoundEnabled() {
  return soundEnabled;
}

export function toggleSound() {
  soundEnabled = !soundEnabled;
  try {
    localStorage.setItem('sound-enabled', String(soundEnabled));
  } catch (e) {}
  return soundEnabled;
}

export function initSoundToggle() {

  const btn = document.querySelector('.sound-toggle');
  if (!btn) return;

  function updateIcon() {
    btn.classList.toggle('is-muted', !soundEnabled);
    btn.setAttribute('aria-label', soundEnabled ? 'Mute sound effects' : 'Unmute sound effects');
  }

  updateIcon();

  btn.addEventListener('click', () => {
    toggleSound();
    updateIcon();
    if (soundEnabled) playClick();
  });
}


// Apple Message Sent / Notification Chime
export function playChime() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(587.33, now); // D5
  osc1.frequency.exponentialRampToValueAtTime(880.00, now + 0.12); // A5

  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(880.00, now + 0.12);
  osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.28); // D6

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.18, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);

  osc1.start(now);
  osc2.start(now + 0.1);
  osc1.stop(now + 0.6);
  osc2.stop(now + 0.6);
}

// Siri Activation Chime
export function playSiriChime() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(440, now);
  osc1.frequency.setValueAtTime(554.37, now + 0.1);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.15, now + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

  osc1.connect(gain);
  gain.connect(ctx.destination);

  osc1.start(now);
  osc1.stop(now + 0.45);
}

// Camera Shutter Click
export function playShutter() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // White noise burst for click
  const bufferSize = ctx.sampleRate * 0.08;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1800, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.35, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
}

// Tactile Click for keyboard keycaps
let lastClick = -Infinity;
export function playClick() {
  const timestamp = performance.now();
  if (timestamp - lastClick < 70) return;
  lastClick = timestamp;
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(320, now);
  osc.frequency.exponentialRampToValueAtTime(80, now + 0.03);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.03);
}

// Click covers mouse, touch activation, and keyboard activation without pointerdown duplicates.
export function initInteractionSounds() {
  document.addEventListener('click', event => {
    if (event.target.closest('.sound-toggle, .tile--avatar, .pb-shutter')) return;
    const control = event.target.closest('button, a[href], [role="button"], .tile--photos, .tile--office');
    if (!control || control.disabled || control.getAttribute('aria-disabled') === 'true') return;
    playClick();
  });
}
