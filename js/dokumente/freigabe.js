/* =====================================================================
   freigabe.js – Freigabe-Übersicht für den Kunden
   ---------------------------------------------------------------------
   Alle Beiträge eines Monats mit Grafik, Text, Datum und Kanal und einem
   Feld "OK / Änderungswunsch". Der Kunde bekommt das als PDF oder
   Ausdruck und gibt frei.

   Die Grafiken werden in der Oberfläche gezeichnet und als kleine
   JPEG-Data-URLs übergeben (siehe js/ui/ansicht-freigabe.js). Ohne
   Grafiken (z. B. im Selbsttest ohne Browser) erscheint nur der Text.
   ===================================================================== */
(function () {
  'use strict';

  /**
   * Die Beiträge eines Monats, die in die Freigabe gehören, nach Datum.
   * @param {Object} kunde
   * @param {string} monat "JJJJ-MM"
   * @param {boolean} [nurOffene] true = nur Status "Entwurf" und "Zur Freigabe"
   * @returns {Array<Object>} Posts
   */
  SM.dokumente.freigabePosts = function (kunde, monat, nurOffene) {
    return kunde.posts.filter(function (post) {
      var imMonat = post.datum.slice(0, 7) === monat;
      var offen = post.status === 'entwurf' || post.status === 'freigabe';
      return imMonat && (!nurOffene || offen);
    }).sort(function (a, b) {
      return a.datum < b.datum ? -1 : (a.datum > b.datum ? 1 : 0);
    });
  };

  /**
   * Freigabe-Übersicht.
   * @param {Object} kunde
   * @param {Object} einstellungen
   * @param {string} monat "JJJJ-MM"
   * @param {Array<Object>} posts die Beiträge (z. B. aus freigabePosts)
   * @param {Object} [grafiken] {postId: [Data-URL je Folie]}
   * @returns {string} HTML-Dokument
   */
  SM.dokumente.freigabe = function (kunde, einstellungen, monat, posts, grafiken) {
    var esc = SM.helfer.escapeHtml;
    var name = kunde.stamm.firmenname || 'Ihr Betrieb';
    var bilder = grafiken || {};

    var karten = posts.map(function (post, index) {
      var kanaele = post.kanaele.map(function (id) {
        var kanal = SM.konfig.hole(SM.konfig.kanaele, id);
        return '<span class="dok-marke">' + esc(kanal ? kanal.name : id) + '</span>';
      }).join('');
      var format = SM.konfig.hole(SM.konfig.formate, post.format);
      var art = SM.konfig.holeBeitragsart(post.beitragsart);
      var grafik = (bilder[post.id] || []).map(function (dataUrl, folienIndex) {
        return '<img src="' + esc(dataUrl) + '" alt="Grafik ' + (folienIndex + 1) + ' zu Beitrag ' + (index + 1) + '">';
      }).join('');

      return '<div class="dok-post"><div>' + (grafik || '<div class="dok-kasten">Grafik folgt</div>') + '</div><div>' +
        '<strong>' + (index + 1) + '. ' + esc(SM.datum.formatTag(post.datum, true)) + (post.uhrzeit ? ', ' + esc(post.uhrzeit) + ' Uhr' : '') + '</strong><br>' +
        kanaele + '<span class="dok-marke">' + esc(format ? format.name : post.format) + '</span>' +
        (art ? '<span class="dok-marke">' + esc(art.name) + '</span>' : '') +
        (post.folien.length > 1 ? '<span class="dok-marke">Karussell, ' + post.folien.length + ' Folien</span>' : '') +
        '<div class="dok-caption">' + esc(post.caption || '(Text folgt)') + '</div>' +
        (SM.helfer.istLeer(post.hashtags) ? '' : '<p class="dok-caption" style="color:#4a5263">' + esc(post.hashtags) + '</p>') +
        '<div class="dok-wahl"><span><span class="dok-box"></span>OK, so veröffentlichen</span><span><span class="dok-box"></span>Änderungswunsch:</span></div>' +
        SM.dokumente.linien(2) +
        '</div></div>';
    }).join('');

    var inhalt =
      '<h1>Freigabe der Beiträge</h1>' +
      '<p class="dok-unter">' + esc(name) + ' · ' + esc(SM.datum.formatMonat(monat)) + ' · ' + posts.length + ' Beiträge</p>' +
      '<p>Bitte sehen Sie sich die geplanten Beiträge an und kreuzen Sie bei jedem „OK" an oder notieren Sie Ihren Änderungswunsch. ' +
      'Veröffentlicht wird nur, was Sie freigegeben haben.</p>' +
      (karten || '<p><em>Für diesen Monat gibt es noch keine Beiträge.</em></p>') +
      '<div class="dok-unterschrift"><div>Ort, Datum</div><div>Freigegeben von (Unterschrift)</div></div>' +
      '<div class="dok-fuss">Rückmeldung bitte an ' + esc(einstellungen.meineDaten.name || 'mich') +
      (einstellungen.meineDaten.email ? ' · ' + esc(einstellungen.meineDaten.email) : '') +
      (einstellungen.meineDaten.telefon ? ' · ' + esc(einstellungen.meineDaten.telefon) : '') + '</div>';

    return SM.dokumente.seite('Freigabe ' + SM.datum.formatMonat(monat) + ' – ' + name, inhalt, einstellungen,
      { farbe: kunde.marke.farben.primaer });
  };
})();
