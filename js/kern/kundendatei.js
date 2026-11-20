/* =====================================================================
   kundendatei.js – Kunden als .json-Datei sichern und wieder öffnen
   ---------------------------------------------------------------------
   Zwei Dateiarten, beide mit einem "Umschlag" um die Daten:

   1) Kundendatei (ein Kunde inkl. Bilder):
      { "art": "social-media-toolkit-kunde", "formatVersion": 1,
        "werkzeugVersion": "1.0.0", "exportiertAm": "…", "kunde": { … } }

   2) Gesamt-Sicherung (alle Kunden + Einstellungen OHNE API-Key):
      { "art": "social-media-toolkit-sicherung", "formatVersion": 1, …,
        "kunden": [ … ], "einstellungen": { … } }
   ===================================================================== */
(function () {
  'use strict';

  SM.kundendatei.ART_KUNDE = 'social-media-toolkit-kunde';
  SM.kundendatei.ART_SICHERUNG = 'social-media-toolkit-sicherung';

  /**
   * Liest JSON-Text und meldet einen verständlichen Fehler.
   * @param {string} text
   * @returns {*} die gelesenen Daten
   */
  function lies(text) {
    try {
      return JSON.parse(text);
    } catch (fehler) {
      throw new Error('Die Datei ist kein lesbares JSON.');
    }
  }

  /**
   * Wandelt einen Kunden in den Text einer Kundendatei um.
   * @param {Object} kunde
   * @returns {string} JSON-Text
   */
  SM.kundendatei.zuText = function (kunde) {
    return JSON.stringify({
      art: SM.kundendatei.ART_KUNDE,
      formatVersion: SM.FORMAT_VERSION,
      werkzeugVersion: SM.VERSION,
      exportiertAm: new Date().toISOString(),
      kunde: kunde
    }, null, 1);
  };

  /**
   * Liest den Text einer Kundendatei und liefert den migrierten Kunden.
   * Akzeptiert auch einen "nackten" Kunden ohne Umschlag.
   * @param {string} text JSON-Text
   * @returns {Object} Kunde im aktuellen Format
   * @throws {Error} mit verständlicher Meldung, wenn die Datei nicht passt
   */
  SM.kundendatei.ausText = function (text) {
    var daten = lies(text);
    var roh = daten && daten.art === SM.kundendatei.ART_KUNDE ? daten.kunde : daten;
    if (!roh || typeof roh !== 'object' || !roh.stamm) {
      throw new Error('Die Datei enthält keinen Toolkit-Kunden (Feld "stamm" fehlt). ' +
        'Eine Projektdatei aus dem Website-Baukasten bitte über „Aus Website-Baukasten importieren" öffnen.');
    }
    return SM.migration.migriere(roh);
  };

  /**
   * Erkennt, was für eine Datei vorliegt.
   * @param {string} text JSON-Text
   * @returns {string} 'kunde' | 'sicherung' | 'baukasten' | 'unbekannt'
   */
  SM.kundendatei.erkenne = function (text) {
    var daten;
    try {
      daten = JSON.parse(text);
    } catch (fehler) {
      return 'unbekannt';
    }
    if (!daten || typeof daten !== 'object') {
      return 'unbekannt';
    }
    if (daten.art === SM.kundendatei.ART_SICHERUNG) {
      return 'sicherung';
    }
    if (daten.art === SM.kundendatei.ART_KUNDE || daten.stamm) {
      return 'kunde';
    }
    if (daten.art === SM.baukastenImport.ART || daten.betrieb) {
      return 'baukasten';
    }
    return 'unbekannt';
  };

  /**
   * Baut die Gesamt-Sicherung. Der API-Key wird dabei entfernt.
   * @param {Array<Object>} kunden
   * @param {Object} einstellungen
   * @returns {string} JSON-Text
   */
  SM.kundendatei.sicherungZuText = function (kunden, einstellungen) {
    var ohneKey = SM.helfer.kopiere(einstellungen);
    ohneKey.ki.apiKey = '';
    return JSON.stringify({
      art: SM.kundendatei.ART_SICHERUNG,
      formatVersion: SM.FORMAT_VERSION,
      werkzeugVersion: SM.VERSION,
      exportiertAm: new Date().toISOString(),
      kunden: kunden,
      einstellungen: ohneKey
    }, null, 1);
  };

  /**
   * Liest eine Gesamt-Sicherung.
   * @param {string} text JSON-Text
   * @returns {{kunden: Array<Object>, einstellungen: Object}} alles migriert; der API-Key ist leer
   */
  SM.kundendatei.sicherungAusText = function (text) {
    var daten = lies(text);
    if (!daten || daten.art !== SM.kundendatei.ART_SICHERUNG || !Array.isArray(daten.kunden)) {
      throw new Error('Die Datei ist keine Gesamt-Sicherung des Toolkits.');
    }
    return {
      kunden: daten.kunden.map(SM.migration.migriere),
      einstellungen: SM.migration.migriereEinstellungen(daten.einstellungen)
    };
  };

  /**
   * Schlägt einen Dateinamen für die Kundendatei vor.
   * @param {Object} kunde
   * @returns {string} z. B. "cafe-muster.kunde.json"
   */
  SM.kundendatei.dateiname = function (kunde) {
    return SM.helfer.slug(kunde.stamm.firmenname || 'kunde') + '.kunde.json';
  };
})();
