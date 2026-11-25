// Small screens: "Zoom in on chart" draws the chart at full size, so it can be scrolled and tapped precisely.
(function () {
  'use strict';
  for (const button of document.querySelectorAll('.zoom')) {
    button.addEventListener('click', () => {
      const figure = button.closest('figure'), box = figure.querySelector('.chart-scroll');
      const zoomed = figure.classList.toggle('zoomed');
      button.setAttribute('aria-pressed', String(zoomed));
      button.textContent = zoomed ? 'Show whole chart' : 'Zoom in on chart';
      // Start at the bottom left: the ground-level air and the pressure labels.
      box.scrollTo(0, zoomed ? box.scrollHeight : 0);
    });
  }
})();
