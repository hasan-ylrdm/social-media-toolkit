/* =====================================================================
   kalender-daten.js – Feiertage, Schulferien und Anlässe berechnen
   ---------------------------------------------------------------------
   Die Anlässe selbst stehen in js/konfig/anlaesse.js. Hier wird für ein
   Jahr ausgerechnet, auf welchen Tag sie fallen.

   SCHULFERIEN SALZBURG werden nach den gesetzlichen Regeln berechnet
   (Schulzeitgesetz). Schulautonome Tage und Sonderregelungen einzelner
   Schulen fehlen – vor wichtigen Planungen bitte gegenprüfen.
     Weihnachtsferien  24.12. – 6.1.
     Semesterferien    Woche ab dem 2. Montag im Februar
     Osterferien       Samstag vor Palmsonntag – Ostermontag
     Pfingstferien     Samstag vor Pfingsten – Pfingstmontag
     Sommerferien      Samstag zwischen 5. und 11. Juli – Sonntag vor dem
                       2. Montag im September
     Herbstferien      27.10. – 31.10.
   ===================================================================== */
(function () {
  'use strict';

  /**
   * Erster Schultag in Salzburg: zweiter Montag im September.
   * @param {number} jahr
   * @returns {string}
   */
  function schulstart(jahr) {
    return SM.datum.nterWochentag(jahr, 9, 0, 2);
  }

  /**
   * Berechnet aus einer Regel das Datum für ein Jahr.
   * @param {Object} regel siehe js/konfig/anlaesse.js
   * @param {number} jahr
   * @returns {string} "JJJJ-MM-TT"
   */
  SM.kalenderDaten.datumAusRegel = function (regel, jahr) {
    if (regel.typ === 'fest') {
      return SM.datum.iso(jahr, regel.monat, regel.tag);
    }
    if (regel.typ === 'ostern') {
      return SM.datum.plusTage(SM.datum.ostersonntag(jahr), regel.versatz);
    }
    if (regel.typ === 'nterWochentag') {
      return SM.datum.plusTage(SM.datum.nterWochentag(jahr, regel.monat, regel.wochentag, regel.n), regel.versatz || 0);
    }
    if (regel.typ === 'advent') {
      // 4. Advent = letzter Sonntag vor dem 25.12.
      var heiligAbend = SM.datum.iso(jahr, 12, 24);
      var vierter = SM.datum.plusTage(heiligAbend, -((SM.datum.wochentag(heiligAbend) + 1) % 7));
      return SM.datum.plusTage(vierter, -(4 - regel.n) * 7);
    }
    if (regel.typ === 'schulstart') {
      return schulstart(jahr);
    }
    throw new Error('Unbekannte Regel in anlaesse.js: ' + regel.typ);
  };

  /**
   * Schulferien in Salzburg, die in einem Jahr beginnen.
   * @param {number} jahr
   * @returns {Array<{titel: string, von: string, bis: string}>}
   */
  SM.kalenderDaten.ferien = function (jahr) {
    var ostern = SM.datum.ostersonntag(jahr);
    var semesterStart = SM.datum.nterWochentag(jahr, 2, 0, 2);
    // Samstag zwischen 5. und 11. Juli
    var fuenfterJuli = SM.datum.iso(jahr, 7, 5);
    var sommerStart = SM.datum.plusTage(fuenfterJuli, (5 - SM.datum.wochentag(fuenfterJuli) + 7) % 7);

    return [
      { titel: 'Weihnachtsferien', von: SM.datum.iso(jahr - 1, 12, 24), bis: SM.datum.iso(jahr, 1, 6) },
      { titel: 'Semesterferien', von: semesterStart, bis: SM.datum.plusTage(semesterStart, 6) },
      { titel: 'Osterferien', von: SM.datum.plusTage(ostern, -8), bis: SM.datum.plusTage(ostern, 1) },
      { titel: 'Pfingstferien', von: SM.datum.plusTage(ostern, 48), bis: SM.datum.plusTage(ostern, 50) },
      { titel: 'Sommerferien', von: sommerStart, bis: SM.datum.plusTage(schulstart(jahr), -1) },
      { titel: 'Herbstferien', von: SM.datum.iso(jahr, 10, 27), bis: SM.datum.iso(jahr, 10, 31) },
      { titel: 'Weihnachtsferien', von: SM.datum.iso(jahr, 12, 24), bis: SM.datum.iso(jahr + 1, 1, 6) }
    ];
  };

  /**
   * Alle Kalender-Einträge für einen Zeitraum: Feiertage, Anlässe,
   * Ferientage und die eigenen Termine des Kunden.
   * @param {string} von "JJJJ-MM-TT" (einschließlich)
   * @param {string} bis "JJJJ-MM-TT" (einschließlich)
   * @param {Object|null} kunde für die eigenen Termine (kunde.events)
   * @returns {Object} {"JJJJ-MM-TT": [{titel, art, idee}]} – art: feiertag | anlass | ferien | event
   */
  SM.kalenderDaten.fuerZeitraum = function (von, bis, kunde) {
    var ergebnis = {};

    /* Trägt einen Eintrag ein, wenn der Tag im Zeitraum liegt. */
    function trageEin(datum, eintrag) {
      if (datum < von || datum > bis) {
        return;
      }
      if (!ergebnis[datum]) {
        ergebnis[datum] = [];
      }
      ergebnis[datum].push(eintrag);
    }

    var jahrVon = Number(von.slice(0, 4));
    var jahrBis = Number(bis.slice(0, 4));

    for (var jahr = jahrVon; jahr <= jahrBis; jahr += 1) {
      SM.konfig.anlaesse.forEach(function (anlass) {
        trageEin(SM.kalenderDaten.datumAusRegel(anlass.regel, jahr), {
          titel: anlass.titel, art: anlass.art, idee: anlass.idee || ''
        });
      });

      SM.kalenderDaten.ferien(jahr).forEach(function (ferien, index) {
        // Die Weihnachtsferien stehen doppelt in der Liste (Ende und Anfang des Jahres):
        // den ersten Eintrag nur im ersten Jahr des Zeitraums verwenden.
        if (index === 0 && jahr !== jahrVon) {
          return;
        }
        var tag = ferien.von;
        while (tag <= ferien.bis) {
          trageEin(tag, { titel: ferien.titel, art: 'ferien', idee: '' });
          tag = SM.datum.plusTage(tag, 1);
        }
      });
    }

    ((kunde && kunde.events) || []).forEach(function (event) {
      trageEin(event.datum, { titel: event.titel, art: 'event', idee: '', id: event.id });
    });

    return ergebnis;
  };
})();
