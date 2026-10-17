try {
  const savedTheme = localStorage.getItem('theme');
  document.documentElement.dataset.theme = savedTheme ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
} catch (e) {}
