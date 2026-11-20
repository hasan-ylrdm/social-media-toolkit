/* =====================================================================
   farben.js – Farb-Rechnungen und Kontrast-Prüfung nach WCAG 2.1
   ===================================================================== */
(function () {
  'use strict';

  /* Mindest-Kontrast für normalen Text nach WCAG 2.1 Stufe AA */
  SM.farben.MIN_KONTRAST = 4.5;

  /**
   * Prüft, ob ein Text eine gültige Hex-Farbe ist (#abc oder #aabbcc).
   * @param {string} hex
   * @returns {boolean}
   */
  SM.farben.istGueltig = function (hex) {
    return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(String(hex || ''));
  };

  /**
   * Wandelt "#aabbcc" (oder "#abc") in {r, g, b} mit Werten 0–255 um.
   * Ungültige Farben ergeben Schwarz.
   * @param {string} hex
   * @returns {{r: number, g: number, b: number}}
   */
  SM.farben.hexZuRgb = function (hex) {
    if (!SM.farben.istGueltig(hex)) {
      return { r: 0, g: 0, b: 0 };
    }
    var h = hex.slice(1);
    if (h.length === 3) {
      h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    }
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16)
    };
  };

  /**
   * Wandelt {r, g, b} zurück in "#aabbcc".
   * @param {{r: number, g: number, b: number}} rgb
   * @returns {string}
   */
  SM.farben.rgbZuHex = function (rgb) {
    function zwei(zahl) {
      var text = Math.max(0, Math.min(255, Math.round(zahl))).toString(16);
      return text.length === 1 ? '0' + text : text;
    }
    return '#' + zwei(rgb.r) + zwei(rgb.g) + zwei(rgb.b);
  };

  /**
   * Mischt zwei Farben. anteilB = 0 → nur Farbe A, 1 → nur Farbe B.
   * @param {string} hexA
   * @param {string} hexB
   * @param {number} anteilB Wert zwischen 0 und 1
   * @returns {string} gemischte Farbe als Hex
   */
  SM.farben.mische = function (hexA, hexB, anteilB) {
    var a = SM.farben.hexZuRgb(hexA);
    var b = SM.farben.hexZuRgb(hexB);
    return SM.farben.rgbZuHex({
      r: a.r + (b.r - a.r) * anteilB,
      g: a.g + (b.g - a.g) * anteilB,
      b: a.b + (b.b - a.b) * anteilB
    });
  };

  /**
   * Relative Leuchtdichte einer Farbe (Formel aus WCAG 2.1).
   * @param {string} hex
   * @returns {number} 0 (schwarz) bis 1 (weiß)
   */
  SM.farben.leuchtdichte = function (hex) {
    var rgb = SM.farben.hexZuRgb(hex);
    function kanal(wert) {
      var c = wert / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    }
    return 0.2126 * kanal(rgb.r) + 0.7152 * kanal(rgb.g) + 0.0722 * kanal(rgb.b);
  };

  /**
   * Kontrastverhältnis zweier Farben (1 = kein Kontrast, 21 = Schwarz/Weiß).
   * @param {string} hexA
   * @param {string} hexB
   * @returns {number}
   */
  SM.farben.kontrast = function (hexA, hexB) {
    var a = SM.farben.leuchtdichte(hexA);
    var b = SM.farben.leuchtdichte(hexB);
    var hell = Math.max(a, b);
    var dunkel = Math.min(a, b);
    return (hell + 0.05) / (dunkel + 0.05);
  };

  /**
   * Wählt Schwarz oder Weiß als Schriftfarbe – je nachdem, was auf dem
   * Hintergrund besser lesbar ist. (Eines von beiden erreicht immer AA.)
   * @param {string} hintergrund Hex-Farbe
   * @returns {string} "#ffffff" oder "#000000"
   */
  SM.farben.besteTextfarbe = function (hintergrund) {
    var mitWeiss = SM.farben.kontrast(hintergrund, '#ffffff');
    var mitSchwarz = SM.farben.kontrast(hintergrund, '#000000');
    return mitWeiss >= mitSchwarz ? '#ffffff' : '#000000';
  };
})();
