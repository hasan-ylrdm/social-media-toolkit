/* =====================================================================
   bericht.js – Monatsbericht für den Kunden
   ---------------------------------------------------------------------
   Zeigt NUR Zahlen, die ich eingetragen habe. Nichts wird geschätzt
   oder erfunden: Fehlt ein Wert, fehlt er auch im Bericht; fehlt der
   Vormonat, gibt es keinen Vergleich.
   Rechnen: js/kern/kennzahlen.js · Liste der Kennzahlen: js/konfig/kennzahlen.js
   Die Diagramme sind einfache SVG-Balken (keine Bibliothek).
   ===================================================================== */
(function () {
  'use strict';

  /**
   * Zeichnet ein Balkendiagramm als SVG.
   * @param {Array<{monat: string, wert: number|null}>} punkte ältester zuerst
   * @param {string} farbe Hex-Farbe der Balken
   * @returns {string} SVG-HTML
   */
  SM.dokumente.balkenDiagramm = function (punkte, farbe) {
    var esc = SM.helfer.escapeHtml;
    var breite = 260;
    var hoehe = 110;
    var maximum = punkte.reduce(function (bisher, punkt) {
      return punkt.wert !== null && punkt.wert > bisher ? punkt.wert : bisher;
    }, 0) || 1;
    var feld = breite / punkte.length;
    var balken = punkte.map(function (punkt, index) {
      var x = index * feld + feld * 0.18;
      var b = feld * 0.64;
      var monatKurz = SM.datum.MONATE[Number(punkt.monat.slice(5, 7)) - 1].slice(0, 3);
      var beschriftung = '<text x="' + (x + b / 2) + '" y="' + (hoehe - 3) + '" text-anchor="middle" font-size="9" fill="#4a5263">' + esc(monatKurz) + '</text>';
      if (punkt.wert === null) {
        return beschriftung + '<text x="' + (x + b / 2) + '" y="' + (hoehe - 20) + '" text-anchor="middle" font-size="9" fill="#9aa2b1">–</text>';
      }
      var h = Math.max(2, (punkt.wert / maximum) * (hoehe - 34));
      var y = hoehe - 16 - h;
      var letzter = index === punkte.length - 1;
      return beschriftung +
        '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + b.toFixed(1) + '" height="' + h.toFixed(1) + '" rx="2" fill="' + farbe + '"' + (letzter ? '' : ' opacity="0.45"') + '></rect>' +
        '<text x="' + (x + b / 2) + '" y="' + (y - 3).toFixed(1) + '" text-anchor="middle" font-size="9" fill="#1b2130">' + esc(SM.kennzahlen.format(punkt.wert)) + '</text>';
    }).join('');
    return '<svg viewBox="0 0 ' + breite + ' ' + hoehe + '" width="100%" role="img" aria-label="Verlauf der letzten Monate">' + balken + '</svg>';
  };

  /**
   * Schreibt die Veränderung zum Vormonat als Text.
   * @param {Object} zeile aus SM.kennzahlen.vergleich
   * @returns {string} HTML, z. B. "+120 (+8,5 %) zum Vormonat"
   */
  function veraenderung(zeile) {
    if (zeile.differenz === null) {
      return '<span>kein Vormonat erfasst</span>';
    }
    if (zeile.differenz === 0) {
      return '<span>unverändert zum Vormonat</span>';
    }
    var plus = zeile.differenz > 0;
    return '<span class="' + (plus ? 'dok-plus' : 'dok-minus') + '">' + (plus ? '+' : '−') +
      SM.kennzahlen.format(Math.abs(zeile.differenz)) +
      (zeile.prozent === null ? '' : ' (' + (plus ? '+' : '−') + SM.kennzahlen.format(Math.abs(zeile.prozent)) + ' %)') +
      ' zum Vormonat</span>';
  }

  /**
   * Monatsbericht.
   * @param {Object} kunde
   * @param {Object} einstellungen
   * @param {string} monat "JJJJ-MM"
   * @returns {string} HTML-Dokument
   */
  SM.dokumente.bericht = function (kunde, einstellungen, monat) {
    var esc = SM.helfer.escapeHtml;
    var name = kunde.stamm.firmenname || 'Ihr Betrieb';
    var bericht = SM.kennzahlen.berichtVon(kunde, monat) || SM.datenmodell.leererBericht(monat);
    var zeilen = SM.kennzahlen.vergleich(kunde, monat);
    var farbe = SM.farben.istGueltig(kunde.marke.farben.primaer) ? kunde.marke.farben.primaer : '#2f4b7c';

    var karten = zeilen.map(function (zeile) {
      return '<div class="dok-karte"><span>' + esc(zeile.name) + '</span><b>' + esc(SM.kennzahlen.format(zeile.wert)) + '</b>' + veraenderung(zeile) + '</div>';
    }).join('');

    var diagramme = zeilen.filter(function (zeile) {
      return zeile.diagramm;
    }).map(function (zeile) {
      return '<div class="dok-karte"><strong>' + esc(zeile.name) + '</strong><br><span>' + esc(zeile.erklaerung) + '</span>' +
        SM.dokumente.balkenDiagramm(SM.kennzahlen.verlauf(kunde, zeile.id, monat, 6), farbe) + '</div>';
    }).join('');

    var topPosts = bericht.topPosts.filter(function (post) {
      return !SM.helfer.istLeer(post.titel);
    }).map(function (post, index) {
      return '<tr><td>' + (index + 1) + '.</td><td>' + esc(post.titel) + '</td><td class="dok-rechts">' + esc(post.wert || '') + '</td></tr>';
    }).join('');

    var erklaerungen = zeilen.map(function (zeile) {
      return '<li><strong>' + esc(zeile.name) + ':</strong> ' + esc(zeile.erklaerung) + '</li>';
    }).join('');

    var inhalt =
      '<h1>Monatsbericht ' + esc(SM.datum.formatMonat(monat)) + '</h1>' +
      '<p class="dok-unter">' + esc(name) + ' · Social Media</p>' +
      (zeilen.length === 0
        ? '<p><em>Für diesen Monat sind noch keine Kennzahlen eingetragen.</em></p>'
        : '<h2>Die wichtigsten Zahlen</h2><div class="dok-karten">' + karten + '</div>') +
      (diagramme ? '<h2>Verlauf der letzten Monate</h2><div class="dok-karten" style="grid-template-columns:repeat(2,1fr)">' + diagramme + '</div>' : '') +
      (topPosts ? '<h2>Beiträge, die am besten angekommen sind</h2><table><tr><th></th><th>Beitrag</th><th class="dok-rechts">Ergebnis</th></tr>' + topPosts + '</table>' : '') +
      (SM.helfer.istLeer(bericht.einschaetzung) ? '' : '<h2>Meine Einschätzung</h2>' + SM.helfer.absaetze(bericht.einschaetzung)) +
      (SM.helfer.istLeer(bericht.plan) ? '' : '<h2>Plan für den nächsten Monat</h2>' + SM.helfer.absaetze(bericht.plan)) +
      (erklaerungen ? '<h2>Was bedeuten die Zahlen?</h2><ul>' + erklaerungen + '</ul>' : '') +
      '<div class="dok-fuss">Alle Zahlen stammen aus den Statistiken der Plattformen (Instagram, Facebook, Google) für ' +
      esc(SM.datum.formatMonat(monat)) + '. Schwankungen von Monat zu Monat sind normal.</div>';

    return SM.dokumente.seite('Monatsbericht ' + SM.datum.formatMonat(monat) + ' – ' + name, inhalt, einstellungen, { farbe: farbe });
  };
})();
