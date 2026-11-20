/* =====================================================================
   hashtags.js – Hashtag-Sets pro Branche und pro Ort
   ---------------------------------------------------------------------
   Im Werkzeug lassen sich die Sets anklicken und kombinieren; eigene
   Sets speichere ich pro Kunde (kunde.hashtagSets).

   Es stehen hier bewusst wenige, passende Hashtags. Instagram empfiehlt
   selbst nur 3–5 pro Beitrag; erlaubt sind höchstens 30.

   NEUES SET: Eintrag nach dem Muster ergänzen.
   MUSTER:
     baeckerei: ['#bäckerei', '#frischgebacken', '#handwerk']      // in "branchen", Schlüssel = Branchen-id
     { ort: 'Golling', tags: ['#golling', '#tennengau'] }          // in "orte"; passt, wenn der Ort des Kunden so heißt
   ===================================================================== */
(function () {
  'use strict';

  SM.konfig.hashtags = {
    /* Schlüssel = Branchen-id aus branchen.js */
    branchen: {
      allgemein: ['#regional', '#lokal', '#ausderregion', '#unterstützelokal', '#kleinunternehmen'],
      friseur: ['#friseur', '#frisör', '#haare', '#haarschnitt', '#balayage', '#haarfarbe', '#friseursalon', '#neuerlook'],
      handwerk: ['#handwerk', '#handwerker', '#meisterbetrieb', '#qualitätsarbeit', '#vorhernachher', '#sanierung', '#lehremitzukunft'],
      gastro: ['#café', '#kaffee', '#frühstück', '#mittagsmenü', '#regionaleküche', '#mehlspeisen', '#genuss', '#gastgarten'],
      verein: ['#verein', '#vereinsleben', '#sport', '#teamgeist', '#nachwuchs', '#ehrenamt', '#heimspiel'],
      fitness: ['#fitness', '#training', '#gesundheit', '#physiotherapie', '#bewegung', '#rückenfit', '#kurse'],
      einzelhandel: ['#einkaufenvorort', '#shoplocal', '#neuimgeschäft', '#geschenkidee', '#fachgeschäft', '#beratung'],
      autowerkstatt: ['#werkstatt', '#kfz', '#auto', '#reifenwechsel', '#pickerl', '#service', '#kfztechnik'],
      arzt: ['#praxis', '#gesundheit', '#ordination', '#vorsorge', '#therapie'],
      fotograf: ['#fotograf', '#fotografie', '#hochzeitsfotograf', '#familienfotos', '#portrait', '#shooting', '#erinnerungen'],
      reinigung: ['#reinigung', '#gebäudereinigung', '#sauber', '#büroreinigung', '#fensterreinigung', '#vorhernachher']
    },

    /* Orte: "ort" wird mit dem Ort des Kunden verglichen (Groß-/Kleinschreibung egal) */
    orte: [
      { ort: 'Hallein', tags: ['#hallein', '#tennengau', '#salzburgerland'] },
      { ort: 'Salzburg', tags: ['#salzburg', '#salzburgcity', '#salzburgerland'] },
      { ort: 'Tennengau', tags: ['#tennengau', '#hallein', '#golling', '#kuchl', '#abtenau'] },
      { ort: 'Kuchl', tags: ['#kuchl', '#tennengau', '#salzburgerland'] },
      { ort: 'Golling', tags: ['#golling', '#tennengau', '#salzburgerland'] },
      { ort: 'Oberalm', tags: ['#oberalm', '#tennengau', '#hallein'] },
      { ort: 'Puch', tags: ['#puchbeihallein', '#tennengau', '#salzburgerland'] },
      { ort: 'Bad Vigaun', tags: ['#badvigaun', '#tennengau', '#salzburgerland'] },
      { ort: 'Anif', tags: ['#anif', '#salzburg', '#salzburgerland'] },
      { ort: 'Grödig', tags: ['#grödig', '#salzburg', '#untersberg'] }
    ],

    /* Allgemeine Region, wenn kein Ort passt */
    region: ['#salzburgerland', '#österreich']
  };

  /**
   * Macht aus einem Ortsnamen einen Hashtag.
   * @param {string} ort z. B. "Bad Vigaun"
   * @returns {string} z. B. "#badvigaun" (leer, wenn kein Ort)
   */
  SM.konfig.ortZuHashtag = function (ort) {
    var sauber = String(ort || '').toLowerCase().replace(/[^a-zäöüß0-9]/g, '');
    return sauber ? '#' + sauber : '';
  };

  /**
   * Die Hashtags für den Ort eines Kunden: das passende Orts-Set, sonst
   * der Ortsname als Hashtag plus die Region.
   * @param {string} ort
   * @returns {string[]}
   */
  SM.konfig.ortsHashtags = function (ort) {
    var gesucht = String(ort || '').trim().toLowerCase();
    for (var i = 0; i < SM.konfig.hashtags.orte.length; i += 1) {
      if (SM.konfig.hashtags.orte[i].ort.toLowerCase() === gesucht) {
        return SM.konfig.hashtags.orte[i].tags.slice();
      }
    }
    var eigener = SM.konfig.ortZuHashtag(ort);
    return (eigener ? [eigener] : []).concat(SM.konfig.hashtags.region);
  };

  /**
   * Standard-Hashtags für einen Kunden: 3 der Branche + 2 des Ortes.
   * Wird vom Plan-Generator verwendet.
   * @param {Object} kunde
   * @returns {string} Hashtags mit Leerzeichen getrennt
   */
  SM.konfig.standardHashtags = function (kunde) {
    var derBranche = SM.konfig.hashtags.branchen[kunde.stamm.branche] || SM.konfig.hashtags.branchen.allgemein;
    return derBranche.slice(0, 3).concat(SM.konfig.ortsHashtags(kunde.stamm.ort).slice(0, 2)).join(' ');
  };

  /**
   * Zählt die Hashtags in einem Text.
   * @param {string} text
   * @returns {number}
   */
  SM.konfig.zaehleHashtags = function (text) {
    return (String(text || '').match(/#[^\s#]+/g) || []).length;
  };
})();
