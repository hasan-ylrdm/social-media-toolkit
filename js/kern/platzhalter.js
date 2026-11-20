/* =====================================================================
   platzhalter.js – {Firmenname}, {Ort} … in Texten ersetzen
   ---------------------------------------------------------------------
   Textbausteine, Folien-Texte und Akquise-Vorlagen enthalten Platzhalter
   in geschweiften Klammern. Groß-/Kleinschreibung ist egal.
   Unbekannte oder leere Platzhalter bleiben sichtbar stehen – so sehe
   ich sofort, wo noch etwas fehlt (z. B. {Angebot}).

   NEUER PLATZHALTER: in werte() eine Zeile ergänzen.
   ===================================================================== */
(function () {
  'use strict';

  /**
   * Liefert alle Platzhalter-Werte für einen Kunden.
   * @param {Object|null} kunde
   * @param {Object} [zusatz] weitere Werte, z. B. {angebot: '−20 % auf Farbe', datum: '13.11.'}
   * @returns {Object} Schlüssel in Kleinbuchstaben → Text
   */
  SM.platzhalter.werte = function (kunde, zusatz) {
    var werte = {};
    if (kunde) {
      var stamm = kunde.stamm;
      var branche = SM.konfig.holeBranche(stamm.branche);
      werte = {
        firmenname: stamm.firmenname,
        ort: stamm.ort,
        slogan: stamm.slogan,
        telefon: stamm.telefon,
        email: stamm.email,
        website: stamm.website,
        strasse: stamm.strasse,
        branche: branche ? branche.name : '',
        ansprechperson: kunde.ansprechperson.name
      };
    }
    Object.keys(zusatz || {}).forEach(function (schluessel) {
      werte[schluessel.toLowerCase()] = zusatz[schluessel];
    });
    return werte;
  };

  /**
   * Ersetzt alle bekannten Platzhalter in einem Text.
   * @param {string} text z. B. "Willkommen bei {Firmenname} in {Ort}"
   * @param {Object|null} kunde
   * @param {Object} [zusatz] weitere Werte
   * @returns {string}
   */
  SM.platzhalter.ersetze = function (text, kunde, zusatz) {
    var werte = SM.platzhalter.werte(kunde, zusatz);
    return String(text === undefined || text === null ? '' : text).replace(/\{([A-Za-zÄÖÜäöüß]+)\}/g, function (ganz, name) {
      var wert = werte[name.toLowerCase()];
      return SM.helfer.istLeer(wert) ? ganz : String(wert);
    });
  };

  /**
   * Sucht Platzhalter, die nach dem Ersetzen noch im Text stehen.
   * @param {string} text
   * @returns {string[]} z. B. ["{Angebot}"]
   */
  SM.platzhalter.offene = function (text) {
    return String(text || '').match(/\{[A-Za-zÄÖÜäöüß]+\}/g) || [];
  };

  /**
   * Liefert die Caption-Vorschläge für eine Branche und Beitragsart:
   * zuerst die der Branche, dann die allgemeinen.
   * @param {string} branchenId
   * @param {string} beitragsartId
   * @returns {string[]} Texte mit Platzhaltern
   */
  SM.platzhalter.captions = function (branchenId, beitragsartId) {
    var alle = SM.konfig.textbausteine;
    var derBranche = (alle[branchenId] && alle[branchenId][beitragsartId]) || [];
    var allgemein = branchenId === 'allgemein' ? [] : ((alle.allgemein && alle.allgemein[beitragsartId]) || []);
    return derBranche.concat(allgemein);
  };
})();
