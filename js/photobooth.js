// ==========================================================
// macOS Photo Booth Window & Camera Effects
// ==========================================================

import { playShutter, playClick } from './audio.js?v=20261017-track';

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
  const effectsGrid = win.querySelector('.pb-effects-grid');
  const previewCanvases = [];
  let captureTimer;
  const tray = win.querySelector('.pb-tray');
  const messageBox = win.querySelector('.pb-message');
  const startCamBtn = win.querySelector('.pb-start-cam-btn');

  let stream = null;
  let hasPreview = false;
  let cameraRequest = 0;
  let animId = null;
  let currentEffect = 4;
  const effects = ['Thermal', 'X-Ray', 'Noir', 'Sepia', 'Normal', 'Pop-Art', 'Cool', 'Warm', 'Mono'];

  effects.forEach((name, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', name);
    const preview = document.createElement('canvas');
    preview.width = 160; preview.height = 120;
    const label = document.createElement('span'); label.textContent = name;
    button.append(preview, label); effectsGrid.append(button); previewCanvases.push(preview);
    button.addEventListener('click', () => { currentEffect = index; setEffects(false); });
  });
  function setEffects(open) {
    effectsGrid.hidden = !open;
    effectsBtn.setAttribute('aria-expanded', String(open));
    shutterBtn.disabled = open || !hasPreview;
    win.classList.toggle('pb-choosing-effects', open);
  }
  // Open window
  if (launchBtn) {
    launchBtn.addEventListener('click', () => {
      playClick();
      win.showModal();
      messageBox.style.display = 'flex';
      shutterBtn.disabled = true;
    });
  }

  startCamBtn?.addEventListener('click', startCamera);

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
    const request = ++cameraRequest;
    startCamBtn.disabled = true;
    startCamBtn.textContent = 'Connecting…';
    try {
      const acquired = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false
      });
      if (request !== cameraRequest || !win.open) { acquired.getTracks().forEach(track => track.stop()); return; }
      stream = acquired;
      video.srcObject = stream;
      await video.play();
      if (messageBox) messageBox.style.display = 'none';
      hasPreview = true;
      shutterBtn.disabled = !effectsGrid.hidden;
      drawLoop();
    } catch (err) {
      if (request !== cameraRequest || !win.open) return;
      console.warn('Camera access denied or unavailable. Using virtual camera preview.');
      if (messageBox) messageBox.style.display = 'none';
      hasPreview = true;
      shutterBtn.disabled = !effectsGrid.hidden;
      drawVirtualCamera();
    }
  }

  function stopCamera() {
    cameraRequest++;
    hasPreview = false;
    startCamBtn.disabled = false;
    startCamBtn.textContent = 'Start Camera';
    clearInterval(captureTimer);
    effectsBtn.disabled = false;
    countdown.hidden = true;
    shutterBtn.disabled = false;
    setEffects(false);
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

    if (!effectsGrid.hidden) {
      const selected = currentEffect;
      const base = ctx.getImageData(0, 0, canvas.width, canvas.height);
      previewCanvases.forEach((preview, index) => {
        ctx.putImageData(base, 0, 0); currentEffect = index; applyFilter();
        preview.getContext('2d').drawImage(canvas, 0, 0, 160, 120);
      });
      ctx.putImageData(base, 0, 0); currentEffect = selected;
    }
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

    if (!effectsGrid.hidden) {
      const selected = currentEffect;
      const base = ctx.getImageData(0, 0, canvas.width, canvas.height);
      previewCanvases.forEach((preview, index) => {
        ctx.putImageData(base, 0, 0); currentEffect = index; applyFilter();
        preview.getContext('2d').drawImage(canvas, 0, 0, 160, 120);
      });
      ctx.putImageData(base, 0, 0); currentEffect = selected;
    }
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
      } else if (fx === 'Sepia') {
        data[i] = r * .393 + g * .769 + b * .189;
        data[i + 1] = r * .349 + g * .686 + b * .168;
        data[i + 2] = r * .272 + g * .534 + b * .131;
      } else if (fx === 'Cool') {
        data[i] = r * .8; data[i + 2] = b * 1.2 + 15;
      } else if (fx === 'Warm') {
        data[i] = r * 1.2 + 15; data[i + 2] = b * .8;
      } else if (fx === 'Mono') {
        data[i] = data[i + 1] = data[i + 2] = brightness;
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
      setEffects(effectsGrid.hidden);
    });
  }

  // Shutter button with Countdown
  if (shutterBtn) {
    shutterBtn.addEventListener('click', async () => {
      shutterBtn.disabled = true;
      effectsBtn.disabled = true;
      let count = 3;
      countdown.hidden = false;
      countdown.textContent = count;
      playClick();

      captureTimer = setInterval(() => {
        count--;
        if (count > 0) {
          countdown.textContent = count;
          playClick();
        } else {
          clearInterval(captureTimer);
          shutterBtn.disabled = false;
          effectsBtn.disabled = false;
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
