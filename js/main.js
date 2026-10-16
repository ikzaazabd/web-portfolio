// ==========================================================
// Main Application Initializer
// ==========================================================

import { initTheme } from './theme.js';
import { initSoundToggle } from './audio.js';
import { initMemoji } from './memoji.js';
import { initOfficeHours } from './officehours.js';
import { initSwitcher } from './switcher.js';
import { initNewsletter } from './newsletter.js';
import { initFreeform } from './freeform.js';
import { initPhotoBooth } from './photobooth.js';
import { initPhotos } from './photos.js';
import { initPlaylists } from './playlists.js';
import { initFindMy } from './findmy.js';
import { initContact } from './contact.js';
import { initSpotlight } from './spotlight.js';
import { initRearrange } from './rearrange.js';
import { initIMessage } from './imessage.js';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSoundToggle();
  initMemoji();
  initOfficeHours();
  initSwitcher();
  initNewsletter();
  initFreeform();
  initPhotoBooth();
  initPhotos();
  initPlaylists();
  initFindMy();
  initContact();
  initSpotlight();
  initRearrange();
  initIMessage();

  console.log(' Ikjas Apple Bento Portfolio initialized successfully.');
});
