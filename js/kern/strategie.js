/* =====================================================================
   strategie.js – aus Fragebogen, Branche und Paket eine Strategie bauen
   ---------------------------------------------------------------------
   Das Ergebnis ist ein VORSCHLAG. Alles lässt sich danach in der Ansicht
   "Strategie" von Hand ändern. Es wird nichts erfunden: Texte kommen aus
   den Antworten des Kunden und aus js/konfig/branchen.js.
   ===================================================================== */
(function () {
  'use strict';

  /**
   * Schlägt Posting-Tage vor, passend zur Zahl der Beiträge pro Monat.
   * @param {number} postsProMonat
   * @returns {number[]} Wochentage, Montag = 0
   */
  SM.strategie.wochentageFuer = function (postsProMonat) {
    if (postsProMonat <= 5) {
      return [3];             // Donnerstag
    }
    if (postsProMonat <= 9) {
      return [1, 4];          // Dienstag, Freitag
    }
    if (postsProMonat <= 13) {
      return [0, 2, 4];       // Montag, Mittwoch, Freitag
    }
    return [0, 1, 3, 4];
  };

  /**
   * Liste der aktiven Kanäle eines Kunden.
   * @param {Object} kunde
   * @returns {string[]} ids, z. B. ['instagram', 'facebook']
   */
  SM.strategie.aktiveKanaele = function (kunde) {
    return SM.konfig.kanaele.map(function (kanal) {
      return kanal.id;
    }).filter(function (id) {
      return kunde.kanaele[id] && kunde.kanaele[id].aktiv;
    });
  };

  /**
   * Baut einen Strategie-Vorschlag.
   * @param {Object} kunde
   * @param {Object|null} paket gebuchtes Paket (aus einstellungen.pakete) oder null
   * @returns {Object} neue Strategie (gleicher Aufbau wie kunde.strategie)
   */
  SM.strategie.erzeuge = function (kunde, paket) {
    var branche = SM.konfig.holeBranche(kunde.stamm.branche) || SM.konfig.holeBranche('allgemein');
    var antworten = kunde.onboarding || {};
    var posts = paket ? Number(paket.postsProMonat) || 0 : kunde.strategie.postsProMonat;

    var ziele = SM.helfer.istLeer(antworten.ziele)
      ? 'Noch offen – bitte den Fragebogen ausfüllen oder die Ziele hier eintragen.'
      : antworten.ziele;

    var kanalNamen = SM.strategie.aktiveKanaele(kunde).map(function (id) {
      return SM.konfig.hole(SM.konfig.kanaele, id).name;
    });
    var kanalwahl =
      (kanalNamen.length > 0 ? 'Betreut werden: ' + kanalNamen.join(', ') + '.' : 'Noch kein Kanal ausgewählt (Kunden → Kanäle).') +
      '\n' + SM.platzhalter.ersetze(branche.kanalHinweis, kunde);

    var hinweise = [];
    if (!SM.helfer.istLeer(antworten.zielgruppe) || !SM.helfer.istLeer(kunde.marke.zielgruppe)) {
      hinweise.push('Zielgruppe: ' + (antworten.zielgruppe || kunde.marke.zielgruppe));
    }
    if (!SM.helfer.istLeer(antworten.besonderheiten)) {
      hinweise.push('Das macht den Betrieb besonders: ' + antworten.besonderheiten);
    }
    if (!SM.helfer.istLeer(antworten.saison)) {
      hinweise.push('Wichtige Zeiten im Jahr: ' + antworten.saison);
    }
    if (!SM.helfer.istLeer(antworten.dos)) {
      hinweise.push('Soll vorkommen: ' + antworten.dos);
    }
    if (!SM.helfer.istLeer(antworten.donts)) {
      hinweise.push('Soll nicht vorkommen: ' + antworten.donts);
    }

    return {
      erzeugtAm: new Date().toISOString(),
      ziele: ziele,
      saeulen: branche.saeulen.map(function (saeule) {
        return {
          id: SM.helfer.neueId('saeule'),
          name: saeule.name,
          beschreibung: saeule.beschreibung,
          anteil: saeule.anteil,
          beitragsarten: saeule.beitragsarten.slice()
        };
      }),
      postsProMonat: posts,
      storiesProWoche: paket ? Number(paket.storiesProWoche) || 0 : kunde.strategie.storiesProWoche,
      reelsProMonat: paket ? Number(paket.reelsProMonat) || 0 : kunde.strategie.reelsProMonat,
      wochentage: SM.strategie.wochentageFuer(posts),
      kanalwahl: kanalwahl,
      hinweise: hinweise.join('\n')
    };
  };
})();
