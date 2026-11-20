/* =====================================================================
   kennzahlen.js – Monatszahlen vergleichen
   ---------------------------------------------------------------------
   Gerechnet wird NUR mit Zahlen, die ich selbst eingetragen habe.
   Fehlt eine Zahl (leer), gibt es dafür keinen Wert und keinen Vergleich.
   ===================================================================== */
(function () {
  'use strict';

  /**
   * Sucht den Bericht eines Monats.
   * @param {Object} kunde
   * @param {string} monat "JJJJ-MM"
   * @returns {Object|null}
   */
  SM.kennzahlen.berichtVon = function (kunde, monat) {
    for (var i = 0; i < kunde.berichte.length; i += 1) {
      if (kunde.berichte[i].monat === monat) {
        return kunde.berichte[i];
      }
    }
    return null;
  };

  /**
   * Liest eine Kennzahl als Zahl.
   * @param {Object|null} bericht
   * @param {string} id
   * @returns {number|null} null, wenn nichts eingetragen ist
   */
  SM.kennzahlen.wert = function (bericht, id) {
    if (!bericht || SM.helfer.istLeer(bericht.kennzahlen[id])) {
      return null;
    }
    var zahl = Number(String(bericht.kennzahlen[id]).replace(/\./g, '').replace(',', '.'));
    return isNaN(zahl) ? null : zahl;
  };

  /**
   * Vergleicht alle erfassten Kennzahlen eines Monats mit dem Vormonat.
   * @param {Object} kunde
   * @param {string} monat "JJJJ-MM"
   * @returns {Array<Object>} je erfasster Kennzahl:
   *   {id, name, erklaerung, diagramm, wert, vormonat (oder null), differenz (oder null), prozent (oder null)}
   */
  SM.kennzahlen.vergleich = function (kunde, monat) {
    var aktuell = SM.kennzahlen.berichtVon(kunde, monat);
    var davor = SM.kennzahlen.berichtVon(kunde, SM.datum.plusMonate(monat, -1));
    var zeilen = [];

    SM.konfig.kennzahlen.forEach(function (kennzahl) {
      var wert = SM.kennzahlen.wert(aktuell, kennzahl.id);
      if (wert === null) {
        return;
      }
      var vormonat = SM.kennzahlen.wert(davor, kennzahl.id);
      var differenz = vormonat === null ? null : wert - vormonat;
      var prozent = vormonat === null || vormonat === 0 ? null : Math.round((differenz / vormonat) * 1000) / 10;
      zeilen.push({
        id: kennzahl.id,
        name: kennzahl.name,
        erklaerung: kennzahl.erklaerung,
        diagramm: kennzahl.diagramm,
        wert: wert,
        vormonat: vormonat,
        differenz: differenz,
        prozent: prozent
      });
    });
    return zeilen;
  };

  /**
   * Verlauf einer Kennzahl über die letzten Monate (für Diagramme).
   * @param {Object} kunde
   * @param {string} id Kennzahl
   * @param {string} bisMonat letzter Monat "JJJJ-MM"
   * @param {number} anzahl wie viele Monate
   * @returns {Array<{monat: string, wert: number|null}>} ältester zuerst
   */
  SM.kennzahlen.verlauf = function (kunde, id, bisMonat, anzahl) {
    var punkte = [];
    for (var i = anzahl - 1; i >= 0; i -= 1) {
      var monat = SM.datum.plusMonate(bisMonat, -i);
      punkte.push({ monat: monat, wert: SM.kennzahlen.wert(SM.kennzahlen.berichtVon(kunde, monat), id) });
    }
    return punkte;
  };

  /**
   * Schreibt eine Zahl mit Tausenderpunkt.
   * @param {number} zahl
   * @returns {string} z. B. 12345 → "12.345"
   */
  SM.kennzahlen.format = function (zahl) {
    var teile = String(Math.round(zahl * 10) / 10).split('.');
    teile[0] = teile[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return teile.join(',');
  };
})();
