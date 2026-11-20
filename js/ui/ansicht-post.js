/* =====================================================================
   ansicht-post.js – Post-Editor: Rahmen und Angaben zum Beitrag
   ---------------------------------------------------------------------
   Aufbau: links die Eingaben, rechts die Live-Vorschau.
     Angaben zum Beitrag (Datum, Status, Kanäle, Format …)  → diese Datei
     Grafik und Folien                                       → post-folien.js
     Caption und Hashtags                                    → post-text.js
     Vorschau und Export                                     → post-vorschau.js
   Welcher Beitrag offen ist, steht in SM.ui.status.postId.
   ===================================================================== */
(function () {
  'use strict';

  /**
   * Der geöffnete Beitrag (oder null).
   * @returns {Object|null}
   */
  function aktuellerPost() {
    return SM.konfig.hole(SM.zustand.kunde.posts, SM.ui.status.postId);
  }

  /**
   * Alle Beiträge des Kunden nach Datum sortiert.
   * @returns {Array<Object>}
   */
  function sortiertePosts() {
    return SM.zustand.kunde.posts.slice().sort(function (a, b) {
      return a.datum < b.datum ? -1 : (a.datum > b.datum ? 1 : 0);
    });
  }

  /**
   * Leiste oben: Beitrag wählen, neu, duplizieren, löschen.
   * @param {Object|null} post
   * @returns {HTMLElement}
   */
  function leiste(post) {
    var el = SM.ui.dom.el;
    var knopf = SM.ui.dom.knopf;
    var kunde = SM.zustand.kunde;

    var auswahl = el('select', { id: 'post-auswahl', 'aria-label': 'Beitrag wählen' }, sortiertePosts().map(function (eintrag) {
      return el('option', { value: eintrag.id, text: (eintrag.datum ? SM.datum.formatTag(eintrag.datum) : 'ohne Datum') + ' · ' + (eintrag.titel || 'Beitrag') });
    }));
    auswahl.value = post ? post.id : '';
    auswahl.addEventListener('change', function () {
      SM.ui.app.oeffnePost(auswahl.value);
    });

    var knoepfe = [
      knopf('Neuer Beitrag', function () {
        SM.ui.kalenderTeile.neuerPost(SM.datum.heute());
      }, 'sm-knopf-haupt')
    ];
    if (post) {
      knoepfe.push(knopf('Duplizieren', function () {
        var kopie = SM.helfer.kopiere(post);
        kopie.id = SM.helfer.neueId('post');
        kopie.titel += ' (Kopie)';
        kopie.status = 'entwurf';
        kopie.folien.forEach(function (folie) {
          folie.id = SM.helfer.neueId('folie');
        });
        kunde.posts.push(kopie);
        SM.zustand.melde('struktur');
        SM.ui.app.oeffnePost(kopie.id);
      }, 'sm-knopf-zweit'));
      knoepfe.push(knopf('Löschen', function () {
        if (window.confirm('Diesen Beitrag endgültig löschen?')) {
          kunde.posts.splice(kunde.posts.indexOf(post), 1);
          SM.ui.status.postId = '';
          SM.zustand.melde('struktur');
        }
      }, 'sm-knopf-zweit sm-knopf-gefahr'));
    }
    return el('div', { klasse: 'sm-kalender-leiste' }, [
      kunde.posts.length > 0 ? auswahl : null,
      el('span', { klasse: 'sm-luecke' })
    ].concat(knoepfe));
  }

  /**
   * Die Gruppe "Beitrag": Datum, Status, Kanäle, Format, Art.
   * @param {Object} post
   * @returns {HTMLElement}
   */
  function angaben(post) {
    var form = SM.ui.form;
    var kunde = SM.zustand.kunde;
    var basis = { basis: 'posts.' + post.id };
    var neuZeichnen = { basis: 'posts.' + post.id, quelle: 'struktur' };
    var art = SM.konfig.holeBeitragsart(post.beitragsart);

    var saeulen = [{ wert: '', name: '— keine —' }].concat(kunde.strategie.saeulen.map(function (saeule) {
      return { wert: saeule.id, name: saeule.name };
    }));

    return form.gruppe('p-angaben', 'Beitrag', [
      form.feld({ pfad: 'titel', label: 'Arbeitstitel (steht im Kalender)', art: 'text' }, basis),
      form.zeile([
        { pfad: 'datum', label: 'Datum', art: 'datum' },
        { pfad: 'uhrzeit', label: 'Uhrzeit', art: 'zeit', klasse: 'sm-feld-schmal' },
        { pfad: 'status', label: 'Status', art: 'auswahl', optionen: SM.konfig.status.map(function (status) {
          return { wert: status.id, name: status.name };
        }) }
      ], basis),
      form.mehrfach({
        label: 'Kanäle',
        optionen: SM.konfig.kanaele.map(function (kanal) {
          return { wert: kanal.id, name: kanal.name };
        }),
        hole: function () {
          return post.kanaele;
        },
        setze: function (liste) {
          post.kanaele = liste;
          SM.zustand.melde('struktur');
        }
      }),
      form.zeile([
        { pfad: 'format', label: 'Format', art: 'auswahl', optionen: SM.konfig.formate.map(function (format) {
          return { wert: format.id, name: format.name + ' – ' + format.breite + '×' + format.hoehe };
        }) },
        { pfad: 'beitragsart', label: 'Beitragsart', art: 'auswahl', optionen: SM.konfig.beitragsarten.map(function (eintrag) {
          return { wert: eintrag.id, name: eintrag.name };
        }), hilfe: 'Bestimmt die Textvorschläge für die Caption.' }
      ], neuZeichnen),
      SM.ui.dom.el('div', { klasse: 'sm-knopfreihe' }, [
        SM.ui.dom.knopf('Vorlage und Starttexte der Beitragsart einsetzen', function () {
          var folie = post.folien[SM.ui.status.folienIndex] || post.folien[0];
          var hatText = Object.keys(folie.texte).some(function (platz) {
            return !SM.helfer.istLeer(folie.texte[platz]);
          });
          if (hatText && !window.confirm('Die Texte der gewählten Folie werden durch die Starttexte von „' + art.name + '" ersetzt. Fortfahren?')) {
            return;
          }
          folie.vorlage = art.vorlage;
          folie.texte = SM.helfer.kopiere(art.folie);
          SM.zustand.melde('struktur');
        }, 'sm-knopf-zweit', 'Setzt in der gewählten Folie die passende Grafik-Vorlage und Beispieltexte')
      ]),
      form.feld({ pfad: 'saeuleId', label: 'Themen-Säule', art: 'auswahl', optionen: saeulen }, basis),
      form.feld({ pfad: 'notiz', label: 'Notiz (nur für mich)', art: 'langtext', zeilen: 2 }, basis)
    ], true);
  }

  SM.ui.ansichten.post = {
    titel: 'Post-Editor',
    brauchtKunde: true,

    /**
     * Zeichnet den Post-Editor.
     * @param {HTMLElement} behaelter
     */
    zeichne: function (behaelter) {
      var el = SM.ui.dom.el;
      var kunde = SM.zustand.kunde;
      var post = aktuellerPost();

      // Kein Beitrag gewählt: den nächsten ab heute nehmen (sonst den letzten)
      if (!post && kunde.posts.length > 0) {
        var alle = sortiertePosts();
        post = alle.filter(function (eintrag) {
          return eintrag.datum >= SM.datum.heute();
        })[0] || alle[alle.length - 1];
        SM.ui.status.postId = post.id;
        SM.ui.status.folienIndex = 0;
      }

      behaelter.appendChild(leiste(post));
      if (!post) {
        behaelter.appendChild(el('div', { klasse: 'sm-karte' }, [
          el('p', { text: 'Noch kein Beitrag. Lege einen neuen an oder lass im Kalender einen Monatsplan erzeugen.' })
        ]));
        return;
      }
      if (SM.ui.status.folienIndex >= post.folien.length) {
        SM.ui.status.folienIndex = 0;
      }

      behaelter.appendChild(el('div', { klasse: 'sm-post' }, [
        el('div', { klasse: 'sm-post-links' }, [
          angaben(post),
          SM.ui.postFolien.baue(post),
          SM.ui.postText.baue(post)
        ]),
        el('div', { klasse: 'sm-post-rechts' }, [SM.ui.postVorschau.baue(post)])
      ]));
    },

    /**
     * Nach jedem Tastendruck: Vorschau und Zähler auffrischen.
     */
    beiEingabe: function () {
      SM.ui.postVorschau.aktualisiere();
      SM.ui.postText.aktualisiere();
    }
  };
})();
