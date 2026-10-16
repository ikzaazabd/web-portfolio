// ==========================================================
// macOS Photo Booth Window & Camera Effects
// ==========================================================

import { playShutter, playClick } from './audio.js';

export function initPhotoBooth() {
  const launchBtn = document.querySelector('.tile--photobooth');
  const win = document.querySelector('.pb-window');
  if (!win) return;

  const closeBtn = win.querySelector('.pb-light--close');
  const video = win.querySelector('.pb-video');
  const canvas = win.querySelector('.pb-canvas');
  const ctx = canvas.getContext('2d');
  const flash = win.querySelector('.pb-flash');
  const countdown = win.querySelector('.pb-countdown');
  const shutterBtn = win.querySelector('.pb-shutter');
  const effectsBtn = win.querySelector('.pb-effects-btn');
  const tray = win.querySelector('.pb-tray');
  const messageBox = win.querySelector('.pb-message');
  const startCamBtn = win.querySelector('.pb-start-cam-btn');

  let stream = null;
  let animId = null;
  let currentEffect = 0;
  const effects = ['Normal', 'Thermal', 'X-Ray', 'Noir', 'Pop-Art'];

  // Open window
  if (launchBtn) {
    launchBtn.addEventListener('click', () => {
      playClick();
      win.showModal();
      startCamera();
    });
  }

  // Close window
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      stopCamera();
      win.close();
    });
  }

  win.addEventListener('cancel', () => {
    stopCamera();
  });

  async function startCamera() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false
      });
      video.srcObject = stream;
      await video.play();
      if (messageBox) messageBox.style.display = 'none';
      drawLoop();
    } catch (err) {
      console.warn('Camera access denied or unavailable. Using virtual camera preview.');
      if (messageBox) messageBox.style.display = 'none';
      drawVirtualCamera();
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = null;
    }
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }

  // Draw Camera Frame with Real-time Filters
  function drawLoop() {
    if (!video.videoWidth) {
      animId = requestAnimationFrame(drawLoop);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw base video
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1); // Mirror
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    applyFilter();
    animId = requestAnimationFrame(drawLoop);
  }

  // Virtual animated camera simulation when camera is not permitted
  let simAngle = 0;
  function drawVirtualCamera() {
    canvas.width = 640;
    canvas.height = 480;

    simAngle += 0.03;
    const cx = canvas.width / 2 + Math.sin(simAngle) * 20;
    const cy = canvas.height / 2 + Math.cos(simAngle) * 10;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#1e293b');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Studio Avatar Hologram
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(cx, cy - 30, 70, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 120, 140, 80, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 'bold 20px -apple-system, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(' Photo Booth Live Studio', canvas.width / 2, 60);

    applyFilter();
    animId = requestAnimationFrame(drawVirtualCamera);
  }

  function applyFilter() {
    const fx = effects[currentEffect];
    if (fx === 'Normal') return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const brightness = (r + g + b) / 3;

      if (fx === 'Thermal') {
        data[i] = Math.min(255, brightness * 1.8);
        data[i + 1] = Math.sin(brightness / 255 * Math.PI) * 255;
        data[i + 2] = 255 - brightness;
      } else if (fx === 'X-Ray') {
        data[i] = 255 - r;
        data[i + 1] = 255 - g;
        data[i + 2] = 255;
      } else if (fx === 'Noir') {
        const gray = brightness > 120 ? brightness * 1.2 : brightness * 0.7;
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
      } else if (fx === 'Pop-Art') {
        data[i] = r > 128 ? 255 : 40;
        data[i + 1] = g > 128 ? 60 : 200;
        data[i + 2] = b > 128 ? 220 : 50;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  // Switch Effects
  if (effectsBtn) {
    effectsBtn.addEventListener('click', () => {
      playClick();
      currentEffect = (currentEffect + 1) % effects.length;
      effectsBtn.textContent = `Effect: ${effects[currentEffect]}`;
    });
  }

  // Shutter button with Countdown
  if (shutterBtn) {
    shutterBtn.addEventListener('click', async () => {
      let count = 3;
      countdown.hidden = false;
      countdown.textContent = count;
      playClick();

      const timer = setInterval(() => {
        count--;
        if (count > 0) {
          countdown.textContent = count;
          playClick();
        } else {
          clearInterval(timer);
          countdown.hidden = true;
          snapPhoto();
        }
      }, 700);
    });
  }

  function snapPhoto() {
    playShutter();
    flash.classList.add('is-flashing');
    setTimeout(() => flash.classList.remove('is-flashing'), 400);

    const dataUrl = canvas.toDataURL('image/png');
    const emptyNotice = tray.querySelector('.pb-tray-empty');
    if (emptyNotice) emptyNotice.remove();

    const img = document.createElement('img');
    img.src = dataUrl;
    img.className = 'pb-thumb';
    img.title = 'Click to download photo';
    img.addEventListener('click', () => {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `photobooth-${Date.now()}.png`;
      a.click();
    });
    tray.prepend(img);
  }
}
