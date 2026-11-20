/* =====================================================================
   ansicht-dashboard.js – Startseite: Überblick über alle Kunden
   ---------------------------------------------------------------------
   Zeigt: Zahl der Kunden, Monatsumsatz, was diese Woche zu tun ist
   (über alle Kunden), meine eigenen Aufgaben und die nächsten Anlässe.
   Rechnen: js/kern/geschaeft.js · Kalender-Daten: js/kern/kalender-daten.js
   ===================================================================== */
(function () {
  'use strict';

  /**
   * Baut eine Kennzahl-Karte.
   * @param {string} wert große Zahl
   * @param {string} name Beschriftung
   * @returns {HTMLElement}
   */
  function karte(wert, name) {
    var el = SM.ui.dom.el;
    return el('div', { klasse: 'sm-kennzahl' }, [el('b', { text: wert }), el('span', { text: name })]);
  }

  /**
   * Liste "Diese Woche": fällige Beiträge aller Kunden und meine Aufgaben.
   * @param {Array<Object>} kunden
   * @returns {HTMLElement}
   */
  function wochenListe(kunden) {
    var el = SM.ui.dom.el;
    var einstellungen = SM.zustand.einstellungen;
    var eintraege = SM.geschaeft.aufgabenDieserWoche(kunden, einstellungen, SM.datum.heute());
    if (eintraege.length === 0) {
      return el('p', { klasse: 'sm-leer', text: 'Diese Woche ist nichts offen.' });
    }
    return el('ul', { klasse: 'sm-aufgaben' }, eintraege.map(function (eintrag) {
      var datum = eintrag.datum ? SM.datum.formatTag(eintrag.datum, true) : 'ohne Datum';
      var text = el('span', {}, [
        el('strong', { text: datum + (eintrag.art === 'ueberfaellig' ? ' – überfällig' : '') }),
        ' ' + (eintrag.kundeName ? eintrag.kundeName + ': ' : '') + eintrag.text
      ]);
      var aktion;
      if (eintrag.art === 'aufgabe') {
        aktion = SM.ui.dom.knopf('Erledigt', function () {
          SM.konfig.hole(einstellungen.aufgaben, eintrag.aufgabeId).erledigt = true;
          SM.zustand.melde('einstellungen-struktur');
        }, 'sm-knopf-mini');
      } else {
        aktion = SM.ui.dom.knopf('Öffnen', function () {
          SM.ui.app.oeffnePost(eintrag.postId, eintrag.kundeId);
        }, 'sm-knopf-mini');
      }
      return el('li', { klasse: eintrag.art === 'ueberfaellig' ? 'sm-ueberfaellig' : '' }, [text, aktion]);
    }));
  }

  /**
   * Formular für eine neue eigene Aufgabe.
   * @returns {HTMLElement}
   */
  function neueAufgabe() {
    var el = SM.ui.dom.el;
    var text = el('input', { type: 'text', id: 'aufgabe-text', placeholder: 'z. B. Fotos bei Café Muster abholen' });
    var faellig = el('input', { type: 'date', id: 'aufgabe-faellig' });
    return el('div', { klasse: 'sm-zeile sm-zeile-unten' }, [
      el('div', { klasse: 'sm-feld' }, [el('label', { for: 'aufgabe-text', text: 'Neue Aufgabe' }), text]),
      el('div', { klasse: 'sm-feld sm-feld-schmal' }, [el('label', { for: 'aufgabe-faellig', text: 'Fällig am' }), faellig]),
      SM.ui.dom.knopf('Hinzufügen', function () {
        if (text.value.trim() === '') {
          return;
        }
        SM.zustand.einstellungen.aufgaben.push({
          id: SM.helfer.neueId('aufgabe'), text: text.value.trim(), faellig: faellig.value, erledigt: false,
          kundeId: ''
        });
        SM.zustand.melde('einstellungen-struktur');
      }, 'sm-knopf-zweit')
    ]);
  }

  /**
   * Die Anlässe und Feiertage der nächsten drei Wochen.
   * @returns {HTMLElement}
   */
  function naechsteAnlaesse() {
    var el = SM.ui.dom.el;
    var heute = SM.datum.heute();
    var kalender = SM.kalenderDaten.fuerZeitraum(heute, SM.datum.plusTage(heute, 21), SM.zustand.kunde);
    var zeilen = [];
    Object.keys(kalender).sort().forEach(function (datum) {
      kalender[datum].forEach(function (eintrag) {
        if (eintrag.art !== 'ferien') {
          zeilen.push(el('li', {}, [
            el('span', {}, [
              el('strong', { text: SM.datum.formatTag(datum, true) + ': ' }),
              eintrag.titel + (eintrag.idee ? ' – ' + eintrag.idee : '')
            ])
          ]));
        }
      });
    });
    return zeilen.length > 0
      ? el('ul', { klasse: 'sm-aufgaben' }, zeilen)
      : el('p', { klasse: 'sm-leer', text: 'In den nächsten drei Wochen steht kein Feiertag oder Anlass an.' });
  }

  SM.ui.ansichten.dashboard = {
    titel: 'Dashboard',
    brauchtKunde: false,

    /**
     * Zeichnet das Dashboard.
     * @param {HTMLElement} behaelter
     */
    zeichne: function (behaelter) {
      var el = SM.ui.dom.el;
      var einstellungen = SM.zustand.einstellungen;
      var inhalt = el('div', {}, [el('p', { klasse: 'sm-leer', text: 'Lädt …' })]);
      behaelter.appendChild(inhalt);

      SM.ui.app.alleKunden().then(function (kunden) {
        var umsatz = SM.geschaeft.umsatz(kunden, einstellungen);
        var montag = SM.datum.montagVon(SM.datum.heute());
        var sonntag = SM.datum.plusTage(montag, 6);
        var postsDieseWoche = 0;
        kunden.forEach(function (kunde) {
          kunde.posts.forEach(function (post) {
            if (post.datum >= montag && post.datum <= sonntag) {
              postsDieseWoche += 1;
            }
          });
        });

        SM.ui.dom.leere(inhalt);
        if (SM.helfer.istLeer(einstellungen.meineDaten.name)) {
          inhalt.appendChild(SM.ui.form.hinweis('Tipp: Trage unter „Mein Geschäft" deinen Namen, deine Kontaktdaten und deine Pakete ein – sie erscheinen in Angeboten, Berichten und Freigaben.'));
        }
        inhalt.appendChild(el('div', { klasse: 'sm-kennzahlen' }, [
          karte(String(kunden.length), kunden.length === 1 ? 'Kunde' : 'Kunden'),
          karte(SM.geschaeft.formatEuro(umsatz.summe), 'Umsatz pro Monat (laut Paketen)'),
          karte(String(postsDieseWoche), 'Beiträge diese Woche geplant')
        ]));
        inhalt.appendChild(el('div', { klasse: 'sm-spalten' }, [
          el('section', { klasse: 'sm-karte' }, [
            el('h2', { text: 'Diese Woche' }),
            wochenListe(kunden),
            neueAufgabe()
          ]),
          el('section', { klasse: 'sm-karte' }, [
            el('h2', { text: 'Nächste Anlässe und Feiertage' }),
            naechsteAnlaesse(),
            el('div', { klasse: 'sm-knopfreihe' }, [
              SM.ui.dom.knopf('Zum Kalender', function () {
                SM.ui.app.zeige('kalender');
              }, 'sm-knopf-zweit'),
              SM.ui.dom.knopf('Kunden verwalten', function () {
                SM.ui.app.zeige('kunden');
              }, 'sm-knopf-zweit')
            ])
          ])
        ]));
      });
    }
  };
})();
