// ==========================================================
// macOS Spotlight Search Overlay Logic
// ==========================================================

import { playClick, playChime } from './audio.js?v=20261017-track';

export function initSpotlight() {
  const overlay = document.querySelector('.sl-overlay');
  const input = document.querySelector('.sl-input');
  const resultsContainer = document.querySelector('.sl-results');
  const shortcutTile = document.querySelector('.tile--shortcut');
  const navSearch = document.querySelector('.nav-search');

  if (!overlay || !input) return;

  let searchIndex = [];
  let selectedIndex = 0;
  let currentResults = [];

  // Fetch search index
  fetch('./search.json')
    .then(r => r.json())
    .then(data => { searchIndex = data; })
    .catch(() => {
      searchIndex = [
        { t: "JobSense 2027", s: "Flagship Swift & CoreML Project", g: "Projects", u: "#project-jobsense" },
        { t: "Apple Developer Academy", s: "Learning Lab & Experience", g: "Projects", u: "#project-academy" },
        { t: "Switch Theme", s: "Toggle Dark / Light appearance", g: "Actions", u: "action:theme" }
      ];
    });

  function openSpotlight() {
    playClick();
    overlay.classList.add('is-open');
    input.value = '';
    input.focus();
    renderResults('');
  }

  function closeSpotlight() {
    overlay.classList.remove('is-open');
  }

  // Keyboard shortcut ⌘K / Ctrl+K / '/'
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (overlay.classList.contains('is-open')) closeSpotlight();
      else openSpotlight();
    } else if (e.key === '/' && !overlay.classList.contains('is-open')) {
      if (['INPUT', 'TEXTAREA'].indexOf(document.activeElement.tagName) === -1) {
        e.preventDefault();
        openSpotlight();
      }
    } else if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
      closeSpotlight();
    }
  });

  if (shortcutTile) shortcutTile.addEventListener('click', openSpotlight);
  if (navSearch) navSearch.addEventListener('click', openSpotlight);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeSpotlight();
  });

  // Calculator evaluation check
  function evaluateCalc(query) {
    if (/^[\d\s+\-*/().%^]+$/.test(query) && /[\d]/.test(query) && /[+\-*/%]/.test(query)) {
      try {
        const res = Function(`"use strict"; return (${query})`)();
        if (typeof res === 'number' && !isNaN(res)) {
          return {
            t: `${query} = ${res}`,
            s: 'Calculator Result',
            g: 'Calculator',
            u: `calc:${res}`
          };
        }
      } catch (e) {}
    }
    return null;
  }

  function renderResults(query) {
    resultsContainer.innerHTML = '';
    const q = query.trim().toLowerCase();

    const calcResult = evaluateCalc(q);
    let matches = [];

    if (calcResult) {
      matches.push(calcResult);
    }

    if (q === '') {
      matches = matches.concat(searchIndex.slice(0, 8));
    } else {
      matches = matches.concat(
        searchIndex.filter(item => {
          const title = (item.t || '').toLowerCase();
          const subtitle = (item.s || '').toLowerCase();
          const keywords = (item.w || '').toLowerCase();
          return title.includes(q) || subtitle.includes(q) || keywords.includes(q);
        })
      );
    }

    currentResults = matches;
    selectedIndex = 0;

    if (matches.length === 0) {
      resultsContainer.innerHTML = '<div class="sl-empty">No results found for "' + query + '"</div>';
      return;
    }

    // Group items by category
    const grouped = {};
    matches.forEach((item, idx) => {
      const g = item.g || 'Results';
      if (!grouped[g]) grouped[g] = [];
      grouped[g].push({ item, idx });
    });

    Object.keys(grouped).forEach(groupName => {
      const groupHeader = document.createElement('div');
      groupHeader.className = 'sl-group-label';
      groupHeader.textContent = groupName;
      resultsContainer.appendChild(groupHeader);

      grouped[groupName].forEach(({ item, idx }) => {
        const div = document.createElement('div');
        div.className = `sl-item ${idx === selectedIndex ? 'is-selected' : ''}`;
        div.dataset.index = idx;
        div.innerHTML = `
          <div>
            <div class="sl-item-title">${item.t}</div>
            <div class="sl-item-sub">${item.s}</div>
          </div>
          <span style="font-size:12px;opacity:0.6;">↵</span>
        `;
        div.addEventListener('click', () => executeResult(item));
        resultsContainer.appendChild(div);
      });
    });
  }

  function updateSelection() {
    const items = resultsContainer.querySelectorAll('.sl-item');
    items.forEach((item) => {
      const idx = parseInt(item.dataset.index, 10);
      item.classList.toggle('is-selected', idx === selectedIndex);
      if (idx === selectedIndex) {
        item.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  function executeResult(item) {
    closeSpotlight();
    playChime();

    if (!item) return;

    if (item.u.startsWith('action:')) {
      const action = item.u.replace('action:', '');
      if (action === 'theme') {
        document.querySelector('.theme-toggle')?.click();
      } else if (action === 'photobooth') {
        document.querySelector('.tile--photobooth')?.click();
      } else if (action === 'officehours') {
        document.querySelector('.tile--office')?.click();
      } else if (action === 'rearrange') {
        document.querySelector('.ra-edit-btn')?.click();
      }
    } else if (item.u.startsWith('calc:')) {
      const val = item.u.replace('calc:', '');
      navigator.clipboard?.writeText(val);
      alert(`Result ${val} copied to clipboard!`);
    } else if (item.u.startsWith('http')) {
      window.open(item.u, '_blank');
    } else if (item.u.startsWith('#')) {
      const el = document.querySelector(item.u);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  input.addEventListener('input', (e) => {
    renderResults(e.target.value);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % currentResults.length;
      updateSelection();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + currentResults.length) % currentResults.length;
      updateSelection();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (currentResults[selectedIndex]) {
        executeResult(currentResults[selectedIndex]);
      }
    }
  });
}
