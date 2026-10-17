// ==========================================================
// Apple Notes Interactivity for About Page
// ==========================================================

import { playClick } from './audio.js?v=20261017-track';

export function initNotes() {
  const windowElement = document.querySelector('.notes-window');
  const editor = document.querySelector('.note-editor');
  const sectionRows = [...document.querySelectorAll('.note-row[href^="#"]')];
  const sections = sectionRows
    .map(row => document.querySelector(row.getAttribute('href')))
    .filter(Boolean);
  const sidebarToggle = document.querySelector('.notes-sidebar-toggle');
  const folderRows = document.querySelectorAll('.folder-row');

  // Draft Note elements
  const composeButton = document.querySelector('.notes-compose');
  const aboutDocument = document.querySelector('.note-document');
  const draftEditor = document.querySelector('.note-draft');
  const draftRow = document.querySelector('.note-row--draft');
  const draftTitle = document.querySelector('.draft-title');
  const draftBody = document.querySelector('.draft-body');
  const draftBack = document.querySelector('.draft-back');
  const noteCount = document.querySelector('.note-count');
  const folderCount = document.querySelector('.folder-count');
  const accountCount = document.querySelector('.notes-account small');
  let draftCreated = false;

  function selectRow(selected) {
    document.querySelectorAll('.note-row').forEach(row => {
      row.classList.toggle('is-selected', row === selected);
    });
  }

  function setNoteCount(count) {
    const label = `${count} ${count === 1 ? 'note' : 'notes'}`;
    if (noteCount) noteCount.textContent = label;
    if (folderCount) folderCount.textContent = count;
    if (accountCount) accountCount.textContent = label;
  }

  function showAbout(row, section) {
    if (!aboutDocument || !draftEditor) return;
    aboutDocument.hidden = false;
    draftEditor.hidden = true;
    if (row) selectRow(row);
    if (section && editor) {
      requestAnimationFrame(() => {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      if (row && row.getAttribute('href')) {
        history.replaceState(null, '', row.getAttribute('href'));
      }
    }
  }

  function showDraft({ focus = false } = {}) {
    if (!aboutDocument || !draftEditor || !draftRow) return;
    try { playClick(); } catch (_) {}
    if (!draftCreated) {
      draftCreated = true;
      draftRow.hidden = false;
      setNoteCount(6);
      composeButton?.setAttribute('aria-label', 'Open temporary note');
    }
    aboutDocument.hidden = true;
    draftEditor.hidden = false;
    if (editor) editor.scrollTop = 0;
    selectRow(draftRow);
    history.replaceState(null, '', location.pathname);
    if (focus) {
      requestAnimationFrame(() => draftTitle?.focus());
    }
  }

  // Smooth scroll within .note-editor
  sectionRows.forEach(row => {
    row.addEventListener('click', event => {
      event.preventDefault();
      try { playClick(); } catch (_) {}
      const target = document.querySelector(row.getAttribute('href'));
      if (!target) return;
      showAbout(row, target);
    });
  });

  // Track active note row via IntersectionObserver inside the scrollable editor
  if (editor && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible && draftEditor?.hidden) {
        const row = sectionRows.find(r => r.getAttribute('href') === `#${visible.target.id}`);
        if (row) selectRow(row);
      }
    }, { root: editor, rootMargin: '-10% 0px -60% 0px', threshold: [0, 0.2, 0.5] });

    sections.forEach(s => observer.observe(s));
  }

  // Write Note / Compose Note interactivity
  composeButton?.addEventListener('click', () => showDraft({ focus: true }));
  draftRow?.addEventListener('click', () => showDraft({ focus: true }));
  draftBack?.addEventListener('click', () => {
    try { playClick(); } catch (_) {}
    showAbout(sectionRows[0], sections[0]);
  });

  draftTitle?.addEventListener('input', () => {
    const title = draftTitle.value.trim() || 'New Note';
    const strongEl = draftRow?.querySelector('strong');
    if (strongEl) strongEl.textContent = title;
  });

  draftBody?.addEventListener('input', () => {
    const excerpt = draftBody.innerText.trim().replace(/\s+/g, ' ');
    const spanEl = draftRow?.querySelector('span');
    if (spanEl) spanEl.textContent = excerpt ? excerpt.slice(0, 90) : 'Start typing…';
  });

  // Show / Hide Navigator toggle
  if (sidebarToggle && windowElement) {
    sidebarToggle.addEventListener('click', () => {
      try { playClick(); } catch (_) {}
      const isHidden = windowElement.classList.toggle('is-sidebar-hidden');
      sidebarToggle.setAttribute('aria-expanded', String(!isHidden));
      sidebarToggle.setAttribute('aria-label', isHidden ? 'Show Notes sidebars' : 'Hide Notes sidebars');
      sidebarToggle.classList.toggle('is-collapsed', isHidden);
    });
  }

  // Folder row selection
  folderRows.forEach(row => {
    row.addEventListener('click', () => {
      try { playClick(); } catch (_) {}
      folderRows.forEach(f => f.classList.remove('is-selected'));
      row.classList.add('is-selected');
    });
  });

  // Traffic lights sound
  const windowControls = document.querySelectorAll('.window-lights span, .notes-tool');
  windowControls.forEach(ctrl => {
    if (ctrl !== sidebarToggle && ctrl !== composeButton) {
      ctrl.addEventListener('click', () => {
        try { playClick(); } catch (_) {}
      });
    }
  });
}
