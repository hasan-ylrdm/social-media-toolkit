/* =====================================================================
   test-rahmen.js – winziges Test-Gerüst (ohne Fremd-Bibliothek)
   ---------------------------------------------------------------------
   Einen Test schreibt man so:

     SM.test.fall('Gruppe', 'was geprüft wird', function () {
       SM.test.gleich(1 + 1, 2, 'Rechnen klappt');
     });

   - Der Test ist bestanden, wenn die Funktion ohne Fehler durchläuft.
   - Für Dinge, die Zeit brauchen (IndexedDB, Bilder), gibt die Funktion
     ein Promise zurück.
   - {nurBrowser: true} als 4. Angabe: Test wird ohne Browser übersprungen.

   Ausführen: test.html im Browser öffnen  ODER  node tests/node-pruefung.js
   ===================================================================== */
(function () {
  'use strict';

  SM.test.faelle = [];

  /* true, wenn die Tests in einem echten Browser laufen */
  SM.test.istBrowser = typeof document !== 'undefined' && typeof indexedDB !== 'undefined';

  /**
   * Meldet einen Testfall an.
   * @param {string} gruppe Überschrift, unter der der Test erscheint
   * @param {string} name was geprüft wird
   * @param {Function} fn Testfunktion (wirft bei Fehler; darf ein Promise liefern)
   * @param {{nurBrowser: boolean}} [optionen]
   */
  SM.test.fall = function (gruppe, name, fn, optionen) {
    SM.test.faelle.push({ gruppe: gruppe, name: name, fn: fn, nurBrowser: !!(optionen && optionen.nurBrowser) });
  };

  /**
   * Prüft, ob zwei Werte gleich sind (Objekte werden als JSON verglichen).
   * @param {*} ist
   * @param {*} soll
   * @param {string} text Beschreibung für die Fehlermeldung
   */
  SM.test.gleich = function (ist, soll, text) {
    var a = JSON.stringify(ist);
    var b = JSON.stringify(soll);
    if (a !== b) {
      throw new Error(text + ' – erwartet: ' + String(b).slice(0, 200) + ', erhalten: ' + String(a).slice(0, 200));
    }
  };

  /**
   * Prüft, ob ein Wert wahr ist.
   * @param {*} wert
   * @param {string} text Beschreibung für die Fehlermeldung
   */
  SM.test.wahr = function (wert, text) {
    if (!wert) {
      throw new Error(text);
    }
  };

  /**
   * Prüft, ob eine Funktion einen Fehler wirft.
   * @param {Function} fn
   * @param {string} text Beschreibung für die Fehlermeldung
   */
  SM.test.wirft = function (fn, text) {
    var geworfen = false;
    try {
      fn();
    } catch (fehler) {
      geworfen = true;
    }
    if (!geworfen) {
      throw new Error(text + ' – es wurde kein Fehler geworfen');
    }
  };

  /**
   * Führt alle Tests nacheinander aus.
   * @param {Function} beiErgebnis wird nach jedem Test aufgerufen mit
   *        {gruppe, name, status: 'ok'|'fehler'|'uebersprungen', meldung}
   * @returns {Promise<{ok: number, fehler: number, uebersprungen: number}>}
   */
  SM.test.laufe = function (beiErgebnis) {
    var summe = { ok: 0, fehler: 0, uebersprungen: 0 };
    var kette = Promise.resolve();

    SM.test.faelle.forEach(function (fall) {
      kette = kette.then(function () {
        if (fall.nurBrowser && !SM.test.istBrowser) {
          summe.uebersprungen += 1;
          beiErgebnis({ gruppe: fall.gruppe, name: fall.name, status: 'uebersprungen', meldung: 'nur im Browser' });
          return null;
        }
        return Promise.resolve()
          .then(fall.fn)
          .then(function () {
            summe.ok += 1;
            beiErgebnis({ gruppe: fall.gruppe, name: fall.name, status: 'ok', meldung: '' });
          })
          .catch(function (fehler) {
            summe.fehler += 1;
            beiErgebnis({ gruppe: fall.gruppe, name: fall.name, status: 'fehler', meldung: fehler && fehler.message ? fehler.message : String(fehler) });
          });
      });
    });

    return kette.then(function () {
      return summe;
    });
  };
})();
