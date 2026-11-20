/* =====================================================================
   fragebogen.js – druckbarer Onboarding-Fragebogen und Strategie-Papier
   ---------------------------------------------------------------------
   Fragebogen: Ist eine Antwort eingetragen, steht sie da; sonst
   erscheinen leere Linien zum Ausfüllen mit der Hand.
   Die Fragen stehen in js/konfig/onboarding-fragen.js.
   ===================================================================== */
(function () {
  'use strict';

  /**
   * Onboarding-Fragebogen eines Kunden.
   * @param {Object} kunde
   * @param {Object} einstellungen
   * @returns {string} HTML-Dokument
   */
  SM.dokumente.fragebogen = function (kunde, einstellungen) {
    var esc = SM.helfer.escapeHtml;
    var name = kunde.stamm.firmenname || 'Ihr Betrieb';

    var fragen = SM.konfig.onboardingFragen.map(function (frage, index) {
      var antwort = kunde.onboarding[frage.id];
      return '<div class="dok-frage"><strong>' + (index + 1) + '. ' + esc(frage.frage) + '</strong><br>' +
        '<small>' + esc(frage.hilfe) + '</small>' +
        (SM.helfer.istLeer(antwort) ? SM.dokumente.linien(3) : '<div class="dok-antwort">' + esc(antwort) + '</div>') +
        '</div>';
    }).join('');

    var inhalt =
      '<h1>Fragebogen zum Start</h1>' +
      '<p class="dok-unter">für ' + esc(name) + ' · Social-Media-Betreuung</p>' +
      '<p>Damit die Beiträge wirklich zu Ihrem Betrieb passen, brauche ich ein paar Antworten. ' +
      'Stichworte reichen völlig – es gibt keine falschen Antworten.</p>' +
      fragen +
      '<div class="dok-fuss">Vielen Dank! Den ausgefüllten Bogen bitte an mich zurückgeben oder fotografieren und schicken.</div>';

    return SM.dokumente.seite('Fragebogen – ' + name, inhalt, einstellungen, { farbe: kunde.marke.farben.primaer });
  };

  /**
   * Strategie-Papier eines Kunden (Ziele, Themen-Säulen, Frequenz, Kanäle).
   * @param {Object} kunde
   * @param {Object} einstellungen
   * @returns {string} HTML-Dokument
   */
  SM.dokumente.strategie = function (kunde, einstellungen) {
    var esc = SM.helfer.escapeHtml;
    var strategie = kunde.strategie;
    var name = kunde.stamm.firmenname || 'Ihr Betrieb';

    var saeulen = strategie.saeulen.map(function (saeule) {
      var anteil = Number(saeule.anteil) || 0;
      var arten = saeule.beitragsarten.map(function (id) {
        var art = SM.konfig.holeBeitragsart(id);
        return art ? art.name : id;
      }).join(', ');
      return '<tr><td><strong>' + esc(saeule.name) + '</strong><br>' + esc(saeule.beschreibung) +
        (arten ? '<br><small>Beitragsarten: ' + esc(arten) + '</small>' : '') + '</td>' +
        '<td style="width:34mm">' + anteil + ' %<div class="dok-balken" style="width:' + Math.min(anteil, 100) + '%"></div></td></tr>';
    }).join('');

    var tage = strategie.wochentage.map(function (tag) {
      return SM.datum.WOCHENTAGE[tag];
    }).join(', ');

    var inhalt =
      '<h1>Social-Media-Strategie</h1>' +
      '<p class="dok-unter">für ' + esc(name) + (kunde.stamm.ort ? ', ' + esc(kunde.stamm.ort) : '') + '</p>' +
      '<h2>Ziele</h2>' + SM.helfer.absaetze(strategie.ziele) +
      '<h2>Themen-Säulen</h2>' +
      '<p>Die Beiträge wechseln zwischen diesen Themen – so bleibt das Profil abwechslungsreich.</p>' +
      (saeulen ? '<table><tr><th>Thema</th><th>Anteil</th></tr>' + saeulen + '</table>' : '<p>Noch keine Themen-Säulen festgelegt.</p>') +
      '<h2>Wie oft wird gepostet?</h2>' +
      '<div class="dok-karten">' +
      '<div class="dok-karte"><b>' + (Number(strategie.postsProMonat) || 0) + '</b><span>Beiträge pro Monat</span></div>' +
      '<div class="dok-karte"><b>' + (Number(strategie.storiesProWoche) || 0) + '</b><span>Stories pro Woche</span></div>' +
      '<div class="dok-karte"><b>' + (Number(strategie.reelsProMonat) || 0) + '</b><span>Reels pro Monat</span></div>' +
      '</div>' +
      (tage ? '<p>Bevorzugte Tage: ' + esc(tage) + '</p>' : '') +
      '<h2>Kanäle</h2>' + SM.helfer.absaetze(strategie.kanalwahl) +
      (SM.helfer.istLeer(strategie.hinweise) ? '' : '<h2>Das ist uns wichtig</h2>' + SM.helfer.absaetze(strategie.hinweise)) +
      '<div class="dok-fuss">Diese Strategie ist ein Arbeitspapier. Wir passen sie an, sobald wir sehen, was bei Ihren Kundinnen und Kunden gut ankommt. ' +
      'Versprechen zu Reichweite oder Umsatz kann niemand seriös geben.</div>';

    return SM.dokumente.seite('Strategie – ' + name, inhalt, einstellungen, { farbe: kunde.marke.farben.primaer });
  };
})();
