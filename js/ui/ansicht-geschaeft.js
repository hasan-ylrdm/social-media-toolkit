/* =====================================================================
   ansicht-geschaeft.js – Mein Geschäft: Übersicht, meine Daten, Pakete
   ---------------------------------------------------------------------
   Fünf Reiter:
     Übersicht        Kunden, Pakete, Monatsumsatz, meine Aufgaben
     Meine Daten      Name, Kontakt, Logo und meine Pakete mit Preisen
     Social-Media-Check   → js/ui/geschaeft-check.js
     Angebote             → js/ui/geschaeft-angebot.js
     Kontaktaufnahme      → js/ui/geschaeft-akquise.js
   Alles hier liegt in den EINSTELLUNGEN (gilt für alle Kunden), nicht
   beim einzelnen Kunden. Felder brauchen deshalb {ziel: 'einstellungen'}.
   ===================================================================== */
(function () {
  'use strict';

  SM.ui.geschaeft = {};   // die Reiter aus den anderen Dateien hängen sich hier an

  var REITER = [
    { id: 'uebersicht', name: 'Übersicht' },
    { id: 'daten', name: 'Meine Daten und Pakete' },
    { id: 'check', name: 'Social-Media-Check' },
    { id: 'angebot', name: 'Angebote' },
    { id: 'akquise', name: 'Kontaktaufnahme' }
  ];

  /**
   * Reiter "Übersicht": wer hat welches Paket, Summe, Aufgaben.
   * @param {HTMLElement} behaelter
   */
  function uebersicht(behaelter) {
    var el = SM.ui.dom.el;
    var einstellungen = SM.zustand.einstellungen;
    var platz = el('div', {}, [el('p', { klasse: 'sm-leer', text: 'Lädt …' })]);
    behaelter.appendChild(platz);

    SM.ui.app.alleKunden().then(function (kunden) {
      var umsatz = SM.geschaeft.umsatz(kunden, einstellungen);
      SM.ui.dom.leere(platz);
      platz.appendChild(el('div', { klasse: 'sm-kennzahlen' }, [
        el('div', { klasse: 'sm-kennzahl' }, [el('b', { text: SM.geschaeft.formatEuro(umsatz.summe) }), el('span', { text: 'Umsatz pro Monat (laut Paketen)' })]),
        el('div', { klasse: 'sm-kennzahl' }, [el('b', { text: SM.geschaeft.formatEuro(umsatz.summe * 12) }), el('span', { text: 'hochgerechnet auf 12 Monate, wenn alles so bleibt' })]),
        el('div', { klasse: 'sm-kennzahl' }, [el('b', { text: String(kunden.length) }), el('span', { text: 'Kunden' })])
      ]));
      platz.appendChild(el('section', { klasse: 'sm-karte' }, [
        el('h2', { text: 'Kunden und Pakete' }),
        umsatz.zeilen.length === 0 ? el('p', { klasse: 'sm-leer', text: 'Noch keine Kunden.' }) : el('table', { klasse: 'sm-tabelle' }, [
          el('thead', {}, [el('tr', {}, ['Kunde', 'Paket', 'Kunde seit', 'Preis / Monat'].map(function (titel) {
            return el('th', { text: titel });
          }))]),
          el('tbody', {}, umsatz.zeilen.map(function (zeile) {
            return el('tr', {}, [
              el('td', {}, [SM.ui.dom.knopf(zeile.firmenname, function () {
                SM.ui.app.waehleKunde(zeile.kundeId).then(function () {
                  SM.ui.app.zeige('kunden');
                });
              }, 'sm-link', 'Kunden öffnen')]),
              el('td', { text: zeile.paketName }),
              el('td', { text: zeile.seit ? SM.datum.formatTag(zeile.seit) : '–' }),
              el('td', { text: SM.geschaeft.formatEuro(zeile.preis) })
            ]);
          }).concat([el('tr', { klasse: 'sm-summe' }, [
            el('td', { text: 'Summe' }), el('td'), el('td'), el('td', { text: SM.geschaeft.formatEuro(umsatz.summe) })
          ])]))
        ]),
        SM.ui.form.hinweis('Das ist der Umsatz laut gebuchten Paketen – keine Buchhaltung. Steuern und Sozialversicherung (SVS) gehen davon noch ab; frag dazu die WKO-Gründerberatung oder eine Steuerberatung.')
      ]));
      platz.appendChild(el('section', { klasse: 'sm-karte' }, [
        el('h2', { text: 'Meine Aufgaben' }),
        SM.ui.form.feld({
          pfad: 'aufgaben', art: 'liste', titelFeld: 'text',
          felder: [
            { pfad: 'text', label: 'Aufgabe', art: 'text' },
            { pfad: 'faellig', label: 'Fällig am', art: 'datum' },
            { pfad: 'erledigt', label: 'erledigt', art: 'schalter' }
          ],
          neu: function () {
            return { id: SM.helfer.neueId('aufgabe'), text: '', faellig: '', erledigt: false, kundeId: '' };
          }
        }, { ziel: 'einstellungen' })
      ]));
    });
  }

  /**
   * Reiter "Meine Daten und Pakete".
   * @param {HTMLElement} behaelter
   */
  function meineDaten(behaelter) {
    var el = SM.ui.dom.el;
    var form = SM.ui.form;
    var ziel = { ziel: 'einstellungen' };
    var meine = SM.zustand.einstellungen.meineDaten;

    var logoEingabe = el('input', { type: 'file', accept: 'image/*', id: 'mein-logo', klasse: 'sm-versteckt' });
    logoEingabe.addEventListener('change', function () {
      if (!logoEingabe.files[0]) {
        return;
      }
      SM.bilder.verarbeiteDatei(logoEingabe.files[0]).then(function (bild) {
        meine.logo = bild.dataUrl;
        SM.zustand.melde('einstellungen-struktur');
      }).catch(function () {
        SM.ui.dom.meldung('Das Logo konnte nicht gelesen werden.', 'fehler');
      });
    });

    behaelter.appendChild(form.gruppe('g-meine', 'Meine Daten (erscheinen in Angeboten, Berichten und Freigaben)', [
      form.zeile([
        { pfad: 'meineDaten.name', label: 'Mein Name', art: 'text' },
        { pfad: 'meineDaten.firma', label: 'Firmenname (falls vorhanden)', art: 'text' }
      ], ziel),
      form.zeile([
        { pfad: 'meineDaten.strasse', label: 'Straße und Hausnummer', art: 'text' },
        { pfad: 'meineDaten.plz', label: 'PLZ', art: 'text', klasse: 'sm-feld-schmal' },
        { pfad: 'meineDaten.ort', label: 'Ort', art: 'text' }
      ], ziel),
      form.zeile([
        { pfad: 'meineDaten.telefon', label: 'Telefon', art: 'tel' },
        { pfad: 'meineDaten.email', label: 'E-Mail', art: 'email' },
        { pfad: 'meineDaten.website', label: 'Website', art: 'url' }
      ], ziel),
      el('div', { klasse: 'sm-zeile sm-zeile-mitte' }, [
        meine.logo ? el('img', { src: meine.logo, alt: 'Mein Logo', klasse: 'sm-logo-vorschau' }) : null,
        el('label', { for: 'mein-logo', klasse: 'sm-knopf sm-knopf-zweit', text: meine.logo ? 'Logo ersetzen …' : 'Mein Logo hochladen …' }),
        logoEingabe,
        meine.logo ? SM.ui.dom.knopf('Logo entfernen', function () {
          meine.logo = '';
          SM.zustand.melde('einstellungen-struktur');
        }, 'sm-knopf-zweit sm-knopf-gefahr') : null
      ]),
      form.feld({ pfad: 'meineDaten.preisHinweis', label: 'Hinweis unter den Preisen', art: 'langtext', zeilen: 2,
        hilfe: 'z. B. „Alle Preise pro Monat. Umsatzsteuerfrei aufgrund der Kleinunternehmerregelung." – was für dich gilt, klärt die WKO oder eine Steuerberatung.' }, ziel)
    ], true));

    behaelter.appendChild(form.gruppe('g-pakete', 'Meine Pakete', [
      form.hinweis('Die Start-Preise sind Beispielwerte. Die Zahlen (Beiträge, Stories, Reels) steuern den Strategie-Vorschlag und den Plan-Generator.', 'warnung'),
      form.feld({
        pfad: 'pakete', art: 'liste', titelFeld: 'name',
        felder: [
          { pfad: 'name', label: 'Name des Pakets', art: 'text' },
          { pfad: 'preis', label: 'Preis in € pro Monat', art: 'zahl', min: 0 },
          { pfad: 'postsProMonat', label: 'Beiträge pro Monat', art: 'zahl', min: 0 },
          { pfad: 'storiesProWoche', label: 'Stories pro Woche', art: 'zahl', min: 0 },
          { pfad: 'reelsProMonat', label: 'Reels pro Monat', art: 'zahl', min: 0 },
          { pfad: 'bericht', label: 'mit Monatsbericht', art: 'schalter' },
          { pfad: 'punkte', label: 'Leistungen (ein Punkt pro Zeile, erscheinen im Angebot)', art: 'langtext', zeilen: 5 }
        ],
        neu: function () {
          return { id: SM.helfer.neueId('paket'), name: '', preis: 0, postsProMonat: 4, storiesProWoche: 0, reelsProMonat: 0, bericht: false, punkte: '' };
        }
      }, ziel)
    ], true));
  }

  SM.ui.ansichten.geschaeft = {
    titel: 'Mein Geschäft',
    brauchtKunde: false,

    /**
     * Zeichnet die Ansicht mit dem gewählten Reiter.
     * @param {HTMLElement} behaelter
     */
    zeichne: function (behaelter) {
      var status = SM.ui.status;
      behaelter.appendChild(SM.ui.dom.el('div', { klasse: 'sm-reiter', role: 'tablist' }, REITER.map(function (reiter) {
        return SM.ui.dom.el('button', {
          type: 'button', role: 'tab', 'aria-selected': reiter.id === status.geschaeftTab ? 'true' : 'false',
          klasse: reiter.id === status.geschaeftTab ? 'sm-reiter-aktiv' : '', text: reiter.name,
          onclick: function () {
            status.geschaeftTab = reiter.id;
            SM.ui.app.zeichneNeu();
          }
        });
      })));

      if (status.geschaeftTab === 'daten') {
        meineDaten(behaelter);
      } else if (status.geschaeftTab === 'check') {
        SM.ui.geschaeft.check(behaelter);
      } else if (status.geschaeftTab === 'angebot') {
        SM.ui.geschaeft.angebot(behaelter);
      } else if (status.geschaeftTab === 'akquise') {
        SM.ui.geschaeft.akquise(behaelter);
      } else {
        uebersicht(behaelter);
      }
    }
  };
})();
