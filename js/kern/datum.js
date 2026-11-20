/* =====================================================================
   datum.js – Rechnen mit Kalendertagen
   ---------------------------------------------------------------------
   Im ganzen Werkzeug ist ein Tag ein Text im Format "JJJJ-MM-TT"
   (z. B. "2026-11-13"), ein Monat ein Text "JJJJ-MM" (z. B. "2026-11").
   Solche Texte lassen sich direkt vergleichen und sortieren.
   Intern wird mit Date um 12:00 Uhr gerechnet, damit die Zeitumstellung
   keinen Tag verschiebt.
   ===================================================================== */
(function () {
  'use strict';

  SM.datum.WOCHENTAGE = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
  SM.datum.WOCHENTAGE_KURZ = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  SM.datum.MONATE = ['Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

  /**
   * Macht aus einer Zahl einen zweistelligen Text.
   * @param {number} zahl
   * @returns {string} z. B. 7 → "07"
   */
  function zwei(zahl) {
    return (zahl < 10 ? '0' : '') + zahl;
  }

  /**
   * Baut einen Tag-Text aus Jahr, Monat und Tag. Überläufe sind erlaubt
   * (Tag 32 im Jänner wird zum 1. Februar).
   * @param {number} jahr
   * @param {number} monat 1–12
   * @param {number} tag 1–31
   * @returns {string} "JJJJ-MM-TT"
   */
  SM.datum.iso = function (jahr, monat, tag) {
    var d = new Date(jahr, monat - 1, tag, 12);
    return d.getFullYear() + '-' + zwei(d.getMonth() + 1) + '-' + zwei(d.getDate());
  };

  /**
   * Wandelt einen Tag-Text in ein Date (12:00 Uhr Ortszeit) um.
   * @param {string} iso "JJJJ-MM-TT"
   * @returns {Date}
   */
  SM.datum.zuDate = function (iso) {
    var teile = String(iso).split('-');
    return new Date(Number(teile[0]), Number(teile[1]) - 1, Number(teile[2]), 12);
  };

  /**
   * Der heutige Tag.
   * @returns {string} "JJJJ-MM-TT"
   */
  SM.datum.heute = function () {
    var d = new Date();
    return SM.datum.iso(d.getFullYear(), d.getMonth() + 1, d.getDate());
  };

  /**
   * Zählt Tage zu einem Tag dazu (negativ = zurück).
   * @param {string} iso
   * @param {number} tage
   * @returns {string}
   */
  SM.datum.plusTage = function (iso, tage) {
    var d = SM.datum.zuDate(iso);
    return SM.datum.iso(d.getFullYear(), d.getMonth() + 1, d.getDate() + tage);
  };

  /**
   * Wochentag eines Tages, Montag = 0 … Sonntag = 6.
   * @param {string} iso
   * @returns {number}
   */
  SM.datum.wochentag = function (iso) {
    return (SM.datum.zuDate(iso).getDay() + 6) % 7;
  };

  /**
   * Der Montag der Woche, in der der Tag liegt.
   * @param {string} iso
   * @returns {string}
   */
  SM.datum.montagVon = function (iso) {
    return SM.datum.plusTage(iso, -SM.datum.wochentag(iso));
  };

  /**
   * Monat eines Tages.
   * @param {string} iso "JJJJ-MM-TT"
   * @returns {string} "JJJJ-MM"
   */
  SM.datum.monatVon = function (iso) {
    return String(iso).slice(0, 7);
  };

  /**
   * Verschiebt einen Monat (negativ = zurück).
   * @param {string} monat "JJJJ-MM"
   * @param {number} anzahl
   * @returns {string} "JJJJ-MM"
   */
  SM.datum.plusMonate = function (monat, anzahl) {
    var teile = monat.split('-');
    return SM.datum.iso(Number(teile[0]), Number(teile[1]) + anzahl, 1).slice(0, 7);
  };

  /**
   * Alle Tage eines Monats.
   * @param {string} monat "JJJJ-MM"
   * @returns {string[]} Liste von "JJJJ-MM-TT"
   */
  SM.datum.tageImMonat = function (monat) {
    var tage = [];
    var tag = monat + '-01';
    while (SM.datum.monatVon(tag) === monat) {
      tage.push(tag);
      tag = SM.datum.plusTage(tag, 1);
    }
    return tage;
  };

  /**
   * Der n-te bestimmte Wochentag eines Monats (z. B. 2. Sonntag im Mai).
   * @param {number} jahr
   * @param {number} monat 1–12
   * @param {number} wochentag Montag = 0 … Sonntag = 6
   * @param {number} n 1 = erster, 2 = zweiter …
   * @returns {string}
   */
  SM.datum.nterWochentag = function (jahr, monat, wochentag, n) {
    var erster = SM.datum.iso(jahr, monat, 1);
    var abstand = (wochentag - SM.datum.wochentag(erster) + 7) % 7;
    return SM.datum.plusTage(erster, abstand + (n - 1) * 7);
  };

  /**
   * Ostersonntag eines Jahres (Gauß/Butcher-Formel, gregorianisch).
   * @param {number} jahr
   * @returns {string}
   */
  SM.datum.ostersonntag = function (jahr) {
    var a = jahr % 19;
    var b = Math.floor(jahr / 100);
    var c = jahr % 100;
    var d = Math.floor(b / 4);
    var e = b % 4;
    var f = Math.floor((b + 8) / 25);
    var g = Math.floor((b - f + 1) / 3);
    var h = (19 * a + b - d - g + 15) % 30;
    var i = Math.floor(c / 4);
    var k = c % 4;
    var l = (32 + 2 * e + 2 * i - h - k) % 7;
    var m = Math.floor((a + 11 * h + 22 * l) / 451);
    var monat = Math.floor((h + l - 7 * m + 114) / 31);
    var tag = ((h + l - 7 * m + 114) % 31) + 1;
    return SM.datum.iso(jahr, monat, tag);
  };

  /**
   * Schreibt einen Tag gut lesbar.
   * @param {string} iso
   * @param {boolean} [mitWochentag]
   * @returns {string} z. B. "13.11.2026" oder "Fr, 13.11.2026"
   */
  SM.datum.formatTag = function (iso, mitWochentag) {
    if (!iso) {
      return '';
    }
    var teile = String(iso).split('-');
    var text = teile[2] + '.' + teile[1] + '.' + teile[0];
    return mitWochentag ? SM.datum.WOCHENTAGE_KURZ[SM.datum.wochentag(iso)] + ', ' + text : text;
  };

  /**
   * Schreibt einen Monat gut lesbar.
   * @param {string} monat "JJJJ-MM"
   * @returns {string} z. B. "November 2026"
   */
  SM.datum.formatMonat = function (monat) {
    var teile = String(monat).split('-');
    return SM.datum.MONATE[Number(teile[1]) - 1] + ' ' + teile[0];
  };
})();
