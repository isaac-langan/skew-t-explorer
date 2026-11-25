// Light/dark theme. Loaded in <head> so the page doesn't flash the wrong colors.
(function () {
  'use strict';
  const root = document.documentElement;
  let saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) { /* storage may be blocked */ }
  // Light is the default. A visitor's own choice is remembered.
  root.dataset.theme = saved === 'dark' ? 'dark' : 'light';

  document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('theme');
    const label = () => { button.textContent = root.dataset.theme === 'dark' ? 'Light mode' : 'Dark mode'; };
    button.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('theme', root.dataset.theme); } catch (e) { /* not remembered */ }
      label();
    });
    label();
  });
})();
