/* global SOUNDINGS, SkewChart */
// A simple preview chart for the start page: pressure, temperature lines, temperature, dewpoint and wind.
(function () {
  'use strict';
  const { BOX, BARB_X, PW, PH, yOf, xOf, el, pathD, background, barb } = SkewChart;
  const svg = document.getElementById('herochart');
  const levels = SOUNDINGS[0].levels;
  const clip = el('clipPath', { id: 'heroclip' }, el('defs', {}, svg));
  el('rect', { x: BOX.left, y: BOX.top, width: PW, height: PH }, clip);
  const plot = el('g', { 'clip-path': 'url(#heroclip)' }, svg);
  for (const line of background) {
    if (line.kind === 'isobar' || line.kind === 'isotherm') el('path', { d: pathD(line.pts), class: 'bg ' + line.kind }, plot);
  }
  for (const [cls, key] of [['dew', 'td'], ['temp', 't']]) {
    el('path', { d: pathD(levels.map(l => [xOf(l[key], l.p), yOf(l.p)])), class: 'profile ' + cls }, plot);
  }
  el('rect', { x: BOX.left, y: BOX.top, width: PW, height: PH, class: 'frame' }, svg);
  for (const l of levels) barb(svg, BARB_X, yOf(l.p), l.wdir, l.wspd);
  // Crop away the space reserved for axis labels, which this preview leaves out.
  svg.setAttribute('viewBox', `${BOX.left - 8} 0 ${BARB_X - BOX.left + 48} ${BOX.bottom + 12}`);
})();
