// ==========================================================
// Main Application Initializer
// ==========================================================

import { initFindMy } from './findmy.js';
import { initAmbient } from './ambient.js?v=20261017-track';
import { initCareer } from './career.js';
import { initSiteControls } from './site-controls.js';
import { initOfficeHours } from './officehours.js?v=20261017';
import { initSwitcher } from './switcher.js';
import { initNewsletter } from './newsletter.js?v=20261017-swap';
import { initPhotoBooth } from './photobooth.js?v=20261017-booth2';
import { initPhotos } from './photos.js?v=20261017-lively';
import { initContact } from './contact.js';
import { initSpotlight } from './spotlight.js';
import { initRearrange } from './rearrange.js';

document.addEventListener('DOMContentLoaded', () => {
  initSiteControls();
  initCareer();
  initFindMy();
  initAmbient();
  initOfficeHours();
  initSwitcher();
  initNewsletter();
  initPhotoBooth();
  initPhotos();
  initContact();
  initSpotlight();
  initRearrange();

  console.log(' Ikjas Apple Bento Portfolio initialized successfully.');
});
