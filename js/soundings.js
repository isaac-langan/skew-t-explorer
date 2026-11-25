// Made-up teaching soundings, not observations. One level every 50 mb, 1000 to 100 mb.
// t and td are in °C, wdir in degrees (direction the wind comes from), wspd in knots.
(function (root) {
  'use strict';
  const P = Array.from({ length: 19 }, (_, i) => 1000 - 50 * i);
  const make = (name, about, t, td, wdir, wspd) =>
    ({ name, about, levels: P.map((p, i) => ({ p, t: t[i], td: td[i], wdir: wdir[i], wspd: wspd[i] })) });

  const list = [
    make('Spring severe-storm day',
      'Warm, moist air near the ground sits under a thin warm layer (the cap), with cold air aloft. A lifted parcel that breaks through the cap becomes much warmer than its surroundings.',
      [28, 23.5, 22.5, 19, 15.5, 12, 8, 3.5, -1.5, -7, -13, -19.5, -26.5, -34.5, -43.5, -53, -60, -62, -63],
      [21, 19.5, 15, 8, 4, -1, -7, -12, -17, -22, -28, -34, -40, -47, -55, -63, -70, -74, -78],
      [160, 170, 180, 195, 210, 220, 230, 235, 240, 240, 245, 245, 250, 250, 255, 255, 260, 260, 265],
      [12, 22, 30, 33, 35, 38, 42, 46, 52, 56, 62, 70, 78, 85, 90, 82, 70, 55, 45]),
    make('Humid summer afternoon',
      'Deep moisture and light winds. A lifted surface parcel ends up warmer than its surroundings through a deep layer, and gets much warmer than them high up.',
      [31, 26.5, 23, 20.5, 18, 15.5, 12.5, 9.5, 6, 2, -2.5, -8.5, -15.5, -24, -34, -46, -59, -68, -72],
      [23, 21.5, 19, 16, 12.5, 9, 5, 0.5, -5, -9, -15, -21, -28, -36, -45, -55, -66, -76, -82],
      [180, 190, 200, 210, 220, 225, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 60, 70, 80],
      [5, 7, 8, 8, 10, 10, 12, 12, 14, 14, 15, 15, 18, 20, 20, 15, 10, 15, 20]),
    make('Stable winter morning',
      'A cold night has left a temperature inversion near the ground: temperature rises with height. Lifted surface air stays colder than its surroundings.',
      [-6, -3, 1, 0, -2.5, -5, -8, -11.5, -16, -21, -27, -33.5, -40.5, -48, -55, -58, -57, -58, -60],
      [-7, -5, -6, -10, -13, -17, -22, -27, -30, -35, -40, -46, -52, -59, -66, -72, -76, -79, -82],
      [340, 320, 290, 275, 270, 270, 265, 265, 260, 260, 260, 260, 260, 260, 265, 265, 270, 270, 270],
      [4, 10, 18, 24, 30, 35, 40, 45, 55, 62, 70, 80, 95, 105, 110, 95, 75, 60, 50]),
  ];
  if (typeof module !== 'undefined') module.exports = list;
  else root.SOUNDINGS = list;
})(this);
