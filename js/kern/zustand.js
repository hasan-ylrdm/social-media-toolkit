/* =====================================================================
   zustand.js – der aktuelle Zustand der Oberfläche
   ---------------------------------------------------------------------
   Hier liegen der gerade gewählte Kunde und die Einstellungen.
   Regel: Nach JEDER Änderung an diesen Daten melde() aufrufen. Nur so
   erfahren die Anzeige und das automatische Speichern davon.

   "quelle" sagt, WAS sich geändert hat:
     'eingabe'        ein Feld wurde getippt → nur speichern, Ansicht bleibt
                      (sonst springt der Cursor)
     'struktur'       etwas wurde hinzugefügt/gelöscht/verschoben → Ansicht neu
     'laden'          anderer Kunde gewählt → alles neu
     'einstellungen'  Einstellungen getippt → nur speichern
     'einstellungen-struktur'  Liste in den Einstellungen geändert → Ansicht neu
   ===================================================================== */
(function () {
  'use strict';

  SM.zustand.kunde = null;           // aktueller Kunde oder null
  SM.zustand.einstellungen = null;

  var hoerer = [];

  /**
   * Meldet eine Funktion an, die bei jeder Änderung aufgerufen wird.
   * @param {Function} fn erhält (quelle)
   */
  SM.zustand.abonniere = function (fn) {
    hoerer.push(fn);
  };

  /**
   * Informiert alle angemeldeten Funktionen über eine Änderung.
   * @param {string} quelle siehe Kopfkommentar
   */
  SM.zustand.melde = function (quelle) {
    var betrifftKunde = quelle === 'eingabe' || quelle === 'struktur';
    if (SM.zustand.kunde && betrifftKunde) {
      SM.zustand.kunde.geaendertAm = new Date().toISOString();
    }
    hoerer.forEach(function (fn) {
      fn(quelle);
    });
  };

  /**
   * Setzt einen (bereits migrierten) Kunden als aktuellen Kunden.
   * @param {Object|null} kunde
   */
  SM.zustand.setzeKunde = function (kunde) {
    SM.zustand.kunde = kunde;
    SM.zustand.melde('laden');
  };
})();
