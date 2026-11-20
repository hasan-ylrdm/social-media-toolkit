/* =====================================================================
   ansicht-freigabe.js – Freigabe durch den Kunden
   ---------------------------------------------------------------------
   Zeigt die Beiträge eines Monats mit ihrem Status und erzeugt die
   druckbare Freigabe-Übersicht (js/dokumente/freigabe.js).
   Für das Dokument wird jede Grafik hier gezeichnet und als kleines
   JPEG eingebettet – deshalb dauert das Öffnen ein paar Sekunden.
   Außerdem: alle Grafiken des Monats als ZIP herunterladen.
   ===================================================================== */
(function () {
  'use strict';

  var nurOffene = false;   // nur "Entwurf" und "Zur Freigabe" ins Dokument

  /**
   * Zeichnet alle Folien der Beiträge als kleine JPEGs.
   * @param {Object} kunde
   * @param {Array<Object>} posts
   * @returns {Promise<Object>} {postId: [Data-URL je Folie]}
   */
  function zeichneGrafiken(kunde, posts) {
    var grafiken = {};
    var kette = Promise.resolve();
    posts.forEach(function (post) {
      grafiken[post.id] = [];
      post.folien.forEach(function (folie) {
        kette = kette.then(function () {
          return SM.grafik.folieAlsDataUrl(kunde, post, folie, 'image/jpeg', 540);
        }).then(function (dataUrl) {
          grafiken[post.id].push(dataUrl);
        });
      });
    });
    return kette.then(function () {
      return grafiken;
    });
  }

  /**
   * Setzt den Status mehrerer Beiträge.
   * @param {Array<Object>} posts
   * @param {string[]} vonStatus nur Beiträge mit einem dieser Status
   * @param {string} neuerStatus
   */
  function setzeStatus(posts, vonStatus, neuerStatus) {
    var anzahl = 0;
    posts.forEach(function (post) {
      if (vonStatus.indexOf(post.status) !== -1) {
        post.status = neuerStatus;
        anzahl += 1;
      }
    });
    SM.zustand.melde('struktur');
    SM.ui.dom.meldung(anzahl + ' Beiträge auf „' + SM.konfig.hole(SM.konfig.status, neuerStatus).name + '" gesetzt.');
  }

  /**
   * Tabelle der Beiträge des Monats mit Status-Auswahl.
   * @param {Array<Object>} posts
   * @returns {HTMLElement}
   */
  function tabelle(posts) {
    var el = SM.ui.dom.el;
    if (posts.length === 0) {
      return el('p', { klasse: 'sm-leer', text: 'In diesem Monat gibt es keine Beiträge.' });
    }
    var zeilen = posts.map(function (post) {
      var auswahl = el('select', { 'aria-label': 'Status von ' + (post.titel || 'Beitrag') }, SM.konfig.status.map(function (status) {
        return el('option', { value: status.id, text: status.name });
      }));
      auswahl.value = post.status;
      auswahl.addEventListener('change', function () {
        post.status = auswahl.value;
        SM.zustand.melde('eingabe');
      });
      return el('tr', {}, [
        el('td', { text: SM.datum.formatTag(post.datum, true) }),
        el('td', {}, [SM.ui.dom.knopf(post.titel || 'Beitrag', function () {
          SM.ui.app.oeffnePost(post.id);
        }, 'sm-link', 'Im Post-Editor öffnen')]),
        el('td', { text: post.kanaele.map(function (id) {
          var kanal = SM.konfig.hole(SM.konfig.kanaele, id);
          return kanal ? kanal.kurz : id;
        }).join(' ') }),
        el('td', { text: SM.helfer.istLeer(post.caption) ? 'Text fehlt' : post.caption.length + ' Zeichen', klasse: SM.helfer.istLeer(post.caption) ? 'sm-zu-lang' : '' }),
        el('td', {}, [auswahl])
      ]);
    });
    return el('table', { klasse: 'sm-tabelle' }, [
      el('thead', {}, [el('tr', {}, ['Datum', 'Beitrag', 'Kanäle', 'Text', 'Status'].map(function (titel) {
        return el('th', { text: titel });
      }))]),
      el('tbody', {}, zeilen)
    ]);
  }

  SM.ui.ansichten.freigabe = {
    titel: 'Freigabe',
    brauchtKunde: true,

    /**
     * Zeichnet die Ansicht.
     * @param {HTMLElement} behaelter
     */
    zeichne: function (behaelter) {
      var el = SM.ui.dom.el;
      var knopf = SM.ui.dom.knopf;
      var kunde = SM.zustand.kunde;
      var einstellungen = SM.zustand.einstellungen;
      var status = SM.ui.status;
      var posts = SM.dokumente.freigabePosts(kunde, status.monat, false);
      var name = SM.helfer.slug(kunde.stamm.firmenname);

      var monatFeld = el('input', { type: 'month', id: 'fg-monat', value: status.monat });
      monatFeld.addEventListener('change', function () {
        if (monatFeld.value) {
          status.monat = monatFeld.value;
          SM.ui.app.zeichneNeu();
        }
      });
      var hakenId = 'fg-nur-offene';
      var haken = el('input', { type: 'checkbox', id: hakenId });
      haken.checked = nurOffene;
      haken.addEventListener('change', function () {
        nurOffene = haken.checked;
      });

      behaelter.appendChild(el('div', { klasse: 'sm-kalender-leiste' }, [
        el('div', { klasse: 'sm-feld' }, [el('label', { for: 'fg-monat', text: 'Monat' }), monatFeld]),
        el('span', { klasse: 'sm-luecke' }),
        knopf('Alle Entwürfe → „Zur Freigabe"', function () {
          setzeStatus(posts, ['idee', 'entwurf'], 'freigabe');
        }, 'sm-knopf-zweit'),
        knopf('Alle „Zur Freigabe" → „Freigegeben"', function () {
          setzeStatus(posts, ['freigabe'], 'freigegeben');
        }, 'sm-knopf-zweit', 'Nachdem der Kunde sein OK gegeben hat')
      ]));

      behaelter.appendChild(el('section', { klasse: 'sm-karte' }, [
        el('h2', { text: 'Beiträge im ' + SM.datum.formatMonat(status.monat) }),
        tabelle(posts)
      ]));

      var statusZeile = el('p', { klasse: 'sm-hilfe', role: 'status' });
      behaelter.appendChild(el('section', { klasse: 'sm-karte' }, [
        el('h2', { text: 'Freigabe-Übersicht für den Kunden' }),
        el('p', { text: 'Ein Dokument mit Grafik, Text, Datum und Kanal jedes Beitrags und einem Feld „OK / Änderungswunsch". Im neuen Tab über „Drucken → Als PDF speichern" sichern und dem Kunden schicken.' }),
        el('div', { klasse: 'sm-schalter' }, [haken, el('label', { for: hakenId, text: 'Nur Beiträge mit Status „Entwurf" oder „Zur Freigabe" aufnehmen' })]),
        el('div', { klasse: 'sm-knopfreihe' }, [
          knopf('Freigabe-Übersicht öffnen', function () {
            var auswahl = SM.dokumente.freigabePosts(kunde, status.monat, nurOffene);
            if (auswahl.length === 0) {
              SM.ui.dom.meldung('Für diese Auswahl gibt es keine Beiträge.', 'fehler');
              return;
            }
            statusZeile.textContent = 'Grafiken werden gezeichnet …';
            zeichneGrafiken(kunde, auswahl).then(function (grafiken) {
              statusZeile.textContent = '';
              SM.ui.app.oeffneDokument(SM.dokumente.freigabe(kunde, einstellungen, status.monat, auswahl, grafiken),
                'freigabe-' + name + '-' + status.monat + '.html');
            }).catch(function (fehler) {
              statusZeile.textContent = 'Fehler: ' + fehler.message;
            });
          }, 'sm-knopf-haupt'),
          knopf('Alle Grafiken des Monats als ZIP', function () {
            if (posts.length === 0) {
              SM.ui.dom.meldung('In diesem Monat gibt es keine Beiträge.', 'fehler');
              return;
            }
            statusZeile.textContent = 'Grafiken werden gezeichnet …';
            SM.grafik.pngDateien(kunde, posts).then(function (dateien) {
              statusZeile.textContent = '';
              SM.helfer.ladeHerunter('grafiken-' + name + '-' + status.monat + '.zip', SM.zip.erzeuge(dateien), 'application/zip');
              SM.ui.dom.meldung(dateien.length + ' PNG-Dateien exportiert.');
            }).catch(function (fehler) {
              statusZeile.textContent = 'Fehler: ' + fehler.message;
            });
          }, 'sm-knopf-zweit', 'Alle Folien aller Beiträge als PNG in voller Größe')
        ]),
        statusZeile
      ]));
    }
  };
})();
