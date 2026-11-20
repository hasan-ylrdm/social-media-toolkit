/* =====================================================================
   ansicht-berichte.js – Monatsbericht: Kennzahlen eintragen, Bericht öffnen
   ---------------------------------------------------------------------
   Ich tippe die Zahlen aus den Insights von Instagram, Facebook und
   Google ab. Das Werkzeug erfindet NIE Zahlen: leer bleibt leer.
   Kennzahlen: js/konfig/kennzahlen.js · Rechnen: js/kern/kennzahlen.js
   Dokument: js/dokumente/bericht.js
   ===================================================================== */
(function () {
  'use strict';

  /**
   * Holt den Bericht des Monats oder legt ihn an.
   * @param {Object} kunde
   * @param {string} monat
   * @returns {Object} Bericht (steht danach in kunde.berichte)
   */
  function holeOderLegeAn(kunde, monat) {
    var bericht = SM.kennzahlen.berichtVon(kunde, monat);
    if (!bericht) {
      bericht = SM.datenmodell.leererBericht(monat);
      kunde.berichte.push(bericht);
    }
    return bericht;
  }

  /**
   * Das Formular für die Kennzahlen, mit dem Wert des Vormonats daneben.
   * @param {Object} kunde
   * @param {Object} bericht
   * @returns {HTMLElement}
   */
  function kennzahlenFormular(kunde, bericht) {
    var el = SM.ui.dom.el;
    var davor = SM.kennzahlen.berichtVon(kunde, SM.datum.plusMonate(bericht.monat, -1));
    var felder = SM.konfig.kennzahlen.map(function (kennzahl) {
      var vormonat = SM.kennzahlen.wert(davor, kennzahl.id);
      return SM.ui.form.feld({
        pfad: 'kennzahlen.' + kennzahl.id, label: kennzahl.name, art: 'zahl', min: 0,
        hilfe: kennzahl.erklaerung + (vormonat === null ? '' : ' Vormonat: ' + SM.kennzahlen.format(vormonat))
      }, { basis: 'berichte.' + bericht.id });
    });
    return el('div', {}, [
      el('div', { klasse: 'sm-raster-3' }, felder),
      el('div', { klasse: 'sm-knopfreihe' }, [
        SM.ui.dom.knopf('„Veröffentlichte Beiträge" aus dem Kalender zählen', function () {
          bericht.kennzahlen.beitraege = kunde.posts.filter(function (post) {
            return post.datum.slice(0, 7) === bericht.monat && post.status === 'veroeffentlicht';
          }).length;
          SM.zustand.melde('struktur');
        }, 'sm-knopf-zweit', 'Zählt die Beiträge dieses Monats mit Status „Veröffentlicht"')
      ])
    ]);
  }

  SM.ui.ansichten.berichte = {
    titel: 'Berichte',
    brauchtKunde: true,

    /**
     * Zeichnet die Ansicht.
     * @param {HTMLElement} behaelter
     */
    zeichne: function (behaelter) {
      var el = SM.ui.dom.el;
      var form = SM.ui.form;
      var kunde = SM.zustand.kunde;
      var status = SM.ui.status;
      var bericht = holeOderLegeAn(kunde, status.monat);
      var basis = { basis: 'berichte.' + bericht.id };

      var monatFeld = el('input', { type: 'month', id: 'be-monat', value: status.monat });
      monatFeld.addEventListener('change', function () {
        if (monatFeld.value) {
          status.monat = monatFeld.value;
          SM.ui.app.zeichneNeu();
        }
      });

      behaelter.appendChild(el('div', { klasse: 'sm-kalender-leiste' }, [
        el('div', { klasse: 'sm-feld' }, [el('label', { for: 'be-monat', text: 'Berichtsmonat' }), monatFeld]),
        el('span', { klasse: 'sm-luecke' }),
        SM.ui.dom.knopf('Monatsbericht öffnen', function () {
          SM.ui.app.oeffneDokument(SM.dokumente.bericht(kunde, SM.zustand.einstellungen, status.monat),
            'bericht-' + SM.helfer.slug(kunde.stamm.firmenname) + '-' + status.monat + '.html');
        }, 'sm-knopf-haupt', 'Druckbarer Bericht für den Kunden (im neuen Tab als PDF speichern)')
      ]));

      behaelter.appendChild(form.hinweis('Nur eintragen, was in den Insights wirklich steht. Leere Felder erscheinen nicht im Bericht; ohne Vormonat gibt es keinen Vergleich.'));

      behaelter.appendChild(form.gruppe('be-zahlen', 'Kennzahlen für ' + SM.datum.formatMonat(status.monat), [
        kennzahlenFormular(kunde, bericht)
      ], true));

      behaelter.appendChild(form.gruppe('be-top', 'Top-Beiträge', [
        form.feld({
          pfad: 'topPosts', art: 'liste', titelFeld: 'titel',
          felder: [
            { pfad: 'titel', label: 'Beitrag (kurz beschrieben)', art: 'text' },
            { pfad: 'wert', label: 'Ergebnis, z. B. „412 erreichte Konten, 38 Likes"', art: 'text' }
          ],
          neu: function () {
            return { id: SM.helfer.neueId('top'), titel: '', wert: '' };
          }
        }, basis)
      ], true));

      behaelter.appendChild(form.gruppe('be-text', 'Einschätzung und Plan', [
        form.feld({ pfad: 'einschaetzung', label: 'Meine kurze Einschätzung', art: 'langtext', zeilen: 4,
          hilfe: 'Was lief gut, was weniger? Ehrlich und ohne Fachbegriffe.' }, basis),
        form.feld({ pfad: 'plan', label: 'Plan für den nächsten Monat', art: 'langtext', zeilen: 4 }, basis)
      ], true));
    }
  };
})();
