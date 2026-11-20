/* =====================================================================
   angebot.js – Social-Media-Check (Bericht) und Angebot
   ---------------------------------------------------------------------
   Beide Dokumente gehen an (mögliche) Kunden. Regeln für die Texte:
   freundlich, ehrlich, konkret. KEINE erfundenen Statistiken, KEINE
   Garantien zu Followern, Reichweite oder Umsatz.

   Checkliste: js/konfig/check-punkte.js · Pakete: einstellungen.pakete
   ===================================================================== */
(function () {
  'use strict';

  /**
   * Baut die drei Paket-Karten.
   * @param {Object} einstellungen
   * @param {string} gewaehltId id des hervorgehobenen Pakets ('' = keines)
   * @returns {string} HTML
   */
  SM.dokumente.paketKarten = function (einstellungen, gewaehltId) {
    var esc = SM.helfer.escapeHtml;
    return '<div class="dok-pakete">' + einstellungen.pakete.map(function (paket) {
      var punkte = String(paket.punkte || '').split('\n').filter(function (zeile) {
        return zeile.trim() !== '';
      }).map(function (zeile) {
        return '<li>' + esc(zeile.trim()) + '</li>';
      }).join('');
      return '<div class="dok-paket' + (paket.id === gewaehltId ? ' dok-gewaehlt' : '') + '">' +
        '<b>' + esc(paket.name) + '</b>' + (paket.id === gewaehltId ? ' <span class="dok-marke">Empfehlung</span>' : '') +
        '<div class="dok-preis">' + esc(SM.geschaeft.formatEuro(Number(paket.preis) || 0)) + ' <small style="font-size:9pt;font-weight:400">/ Monat</small></div>' +
        '<ul>' + punkte + '</ul></div>';
    }).join('') + '</div>' +
      (SM.helfer.istLeer(einstellungen.meineDaten.preisHinweis) ? '' : '<p style="font-size:9pt;color:#4a5263;margin-top:6px">' + esc(einstellungen.meineDaten.preisHinweis) + '</p>');
  };

  /**
   * Bericht zum Social-Media-Check eines möglichen Kunden.
   * @param {Object} check Eintrag aus einstellungen.checks
   * @param {Object} einstellungen
   * @returns {string} HTML-Dokument
   */
  SM.dokumente.check = function (check, einstellungen) {
    var esc = SM.helfer.escapeHtml;
    var gut = [];
    var vorschlaege = [];
    SM.konfig.checkPunkte.forEach(function (punkt) {
      var eintrag = check.punkte[punkt.id] || {};
      var notiz = SM.helfer.istLeer(eintrag.notiz) ? '' : ' <em>' + esc(eintrag.notiz) + '</em>';
      if (eintrag.wert === 'gut') {
        gut.push('<li><strong>' + esc(punkt.name) + ':</strong> ' + esc(punkt.lob) + notiz + '</li>');
      } else if (eintrag.wert === 'ausbau' || eintrag.wert === 'fehlt') {
        vorschlaege.push('<li><strong>' + esc(punkt.name) + (eintrag.wert === 'fehlt' ? ' (fehlt noch)' : '') + ':</strong> ' + esc(punkt.vorschlag) + notiz + '</li>');
      }
    });

    var inhalt =
      '<h1>Social-Media-Check</h1>' +
      '<p class="dok-unter">für ' + esc(check.betrieb || 'Ihren Betrieb') + (check.ort ? ', ' + esc(check.ort) : '') +
      ' · Stand ' + esc(SM.datum.formatTag(check.datum)) + '</p>' +
      '<p>Ich habe mir Ihren Auftritt in den sozialen Medien und bei Google angesehen. Hier ist, was mir aufgefallen ist – kurz und ehrlich.</p>' +
      (gut.length > 0 ? '<h2>Das läuft schon gut</h2><ul>' + gut.join('') + '</ul>' : '') +
      (vorschlaege.length > 0
        ? '<h2>Hier sehe ich Möglichkeiten</h2><ul>' + vorschlaege.join('') + '</ul>'
        : '<h2>Hier sehe ich Möglichkeiten</h2><p>Bei den geprüften Punkten habe ich nichts gefunden, was dringend geändert werden müsste.</p>') +
      (SM.helfer.istLeer(check.fazit) ? '' : '<h2>Mein Eindruck</h2>' + SM.helfer.absaetze(check.fazit)) +
      '<h2>Wenn Sie das nicht selbst machen möchten</h2>' +
      '<p>Ich kann die Betreuung für Sie übernehmen: Planung, Grafiken im Design Ihres Betriebs, Texte und Veröffentlichung. ' +
      'Sie geben jeden Beitrag frei, bevor er erscheint.</p>' +
      SM.dokumente.paketKarten(einstellungen, check.paketId) +
      '<div class="dok-kasten"><strong>Was ich nicht verspreche:</strong> bestimmte Follower-Zahlen, Reichweiten oder Umsätze. ' +
      'Das kann niemand seriös garantieren. Was ich zusage: regelmäßige, gepflegte Beiträge und eine klare Abstimmung mit Ihnen.</div>' +
      '<div class="dok-fuss">Dieser Check ist kostenlos und unverbindlich. Er beruht auf dem, was öffentlich sichtbar war.</div>';

    return SM.dokumente.seite('Social-Media-Check – ' + (check.betrieb || 'Betrieb'), inhalt, einstellungen);
  };

  /**
   * Angebot für die Social-Media-Betreuung.
   * @param {Object} angebot Eintrag aus einstellungen.angebote
   * @param {Object} einstellungen
   * @returns {string} HTML-Dokument
   */
  SM.dokumente.angebot = function (angebot, einstellungen) {
    var esc = SM.helfer.escapeHtml;
    var paket = SM.konfig.hole(einstellungen.pakete, angebot.paketId);
    var punkte = paket ? String(paket.punkte || '').split('\n').filter(function (zeile) {
      return zeile.trim() !== '';
    }).map(function (zeile) {
      return '<li>' + esc(zeile.trim()) + '</li>';
    }).join('') : '';

    var inhalt =
      '<p>' + esc(angebot.empfaenger || '[Empfänger]').replace(/\n/g, '<br>') + '<br>' + esc(angebot.anschrift || '').replace(/\n/g, '<br>') + '</p>' +
      '<p class="dok-rechts">' + esc(SM.datum.formatTag(angebot.datum)) + '</p>' +
      '<h1>Angebot: Social-Media-Betreuung</h1>' +
      '<p>Guten Tag,</p>' +
      '<p>vielen Dank für das Gespräch. Gern biete ich Ihnen die laufende Betreuung Ihrer Social-Media-Kanäle an:</p>' +
      (paket
        ? '<div class="dok-kasten"><strong>Paket „' + esc(paket.name) + '"</strong>' +
          '<div class="dok-preis">' + esc(SM.geschaeft.formatEuro(Number(angebot.preis) || Number(paket.preis) || 0)) + ' pro Monat</div><ul>' + punkte + '</ul></div>'
        : '<div class="dok-kasten">Noch kein Paket gewählt.</div>') +
      '<h2>Ablauf</h2>' +
      '<ul><li>Start: ' + esc(angebot.start || 'nach Vereinbarung') + '</li>' +
      '<li>Laufzeit: ' + esc(angebot.laufzeit || 'monatlich kündbar') + '</li>' +
      '<li>Zu Beginn klären wir gemeinsam Ziele und Themen (kurzer Fragebogen).</li>' +
      '<li>Sie erhalten jeden Monat alle Beiträge vorab zur Freigabe.</li>' +
      '<li>Fotos und Infos kommen von Ihnen; nach Absprache fotografiere ich auch vor Ort.</li></ul>' +
      (SM.helfer.istLeer(angebot.zusatz) ? '' : '<h2>Zusätzlich vereinbart</h2>' + SM.helfer.absaetze(angebot.zusatz)) +
      '<h2>Alle Pakete im Überblick</h2>' + SM.dokumente.paketKarten(einstellungen, angebot.paketId) +
      '<div class="dok-kasten">Ich verspreche keine bestimmten Follower-Zahlen, Reichweiten oder Umsätze – das kann niemand seriös garantieren. ' +
      'Was ich zusage: regelmäßige, gepflegte Beiträge im Stil Ihres Betriebs und eine verlässliche Abstimmung.</div>' +
      '<p>Dieses Angebot ist freibleibend und gilt 30 Tage. Bei Fragen melden Sie sich jederzeit.</p>' +
      '<p>Freundliche Grüße<br>' + esc(einstellungen.meineDaten.name || '[Mein Name]') + '</p>' +
      '<div class="dok-unterschrift"><div>Ort, Datum</div><div>Auftrag erteilt (Unterschrift)</div></div>';

    return SM.dokumente.seite('Angebot – ' + (angebot.empfaenger || 'Social-Media-Betreuung'), inhalt, einstellungen);
  };
})();
