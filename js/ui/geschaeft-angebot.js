/* =====================================================================
   geschaeft-angebot.js – Reiter "Angebote" und "Kontaktaufnahme"
   ---------------------------------------------------------------------
   Angebote: einstellungen.angebote → Dokument SM.dokumente.angebot
   Kontaktaufnahme: Vorlagen aus js/konfig/akquise-vorlagen.js
   (E-Mail, Instagram-Nachricht, Erinnerung, Gesprächsleitfaden)
   ===================================================================== */
(function () {
  'use strict';

  var gewaehltesAngebot = '';   // id des geöffneten Angebots
  var akquise = { betrieb: '', ansprechperson: '', ort: '', aufhaenger: '' };   // Angaben für die Vorlagen (nicht gespeichert)

  /**
   * Zeichnet den Reiter "Angebote".
   * @param {HTMLElement} behaelter
   */
  SM.ui.geschaeft.angebot = function (behaelter) {
    var el = SM.ui.dom.el;
    var knopf = SM.ui.dom.knopf;
    var form = SM.ui.form;
    var einstellungen = SM.zustand.einstellungen;
    var angebot = SM.konfig.hole(einstellungen.angebote, gewaehltesAngebot);
    if (!angebot && einstellungen.angebote.length > 0) {
      angebot = einstellungen.angebote[einstellungen.angebote.length - 1];
      gewaehltesAngebot = angebot.id;
    }

    var auswahl = el('select', { id: 'angebot-auswahl', 'aria-label': 'Angebot wählen' }, einstellungen.angebote.map(function (eintrag) {
      return el('option', { value: eintrag.id, text: SM.datum.formatTag(eintrag.datum) + ' · ' + (eintrag.empfaenger || '(ohne Empfänger)') });
    }));
    auswahl.value = angebot ? angebot.id : '';
    auswahl.addEventListener('change', function () {
      gewaehltesAngebot = auswahl.value;
      SM.ui.app.zeichneNeu();
    });

    behaelter.appendChild(el('div', { klasse: 'sm-kalender-leiste' }, [
      einstellungen.angebote.length > 0 ? auswahl : el('span', { text: 'Noch kein Angebot angelegt.' }),
      el('span', { klasse: 'sm-luecke' }),
      knopf('Neues Angebot', function () {
        var kunde = SM.zustand.kunde;
        var neu = {
          id: SM.helfer.neueId('angebot'), datum: SM.datum.heute(), empfaenger: '', anschrift: '',
          paketId: einstellungen.pakete.length > 0 ? einstellungen.pakete[0].id : '', preis: '',
          start: '', laufzeit: 'monatlich kündbar', zusatz: ''
        };
        // Praktisch: Daten des geöffneten Kunden vorschlagen
        if (kunde && window.confirm('Empfänger aus dem geöffneten Kunden „' + kunde.stamm.firmenname + '" übernehmen?')) {
          neu.empfaenger = kunde.stamm.firmenname + (kunde.ansprechperson.name ? '\nz. Hd. ' + kunde.ansprechperson.name : '');
          neu.anschrift = [kunde.stamm.strasse, [kunde.stamm.plz, kunde.stamm.ort].filter(Boolean).join(' ')].filter(Boolean).join('\n');
          neu.paketId = kunde.paket.paketId || neu.paketId;
        }
        einstellungen.angebote.push(neu);
        gewaehltesAngebot = neu.id;
        SM.zustand.melde('einstellungen-struktur');
      }, 'sm-knopf-haupt')
    ]));
    if (!angebot) {
      return;
    }

    var ziel = { basis: 'angebote.' + angebot.id, ziel: 'einstellungen' };
    behaelter.appendChild(form.gruppe('a-angebot', 'Angebot', [
      form.zeile([
        { pfad: 'empfaenger', label: 'Empfänger', art: 'langtext', zeilen: 2 },
        { pfad: 'anschrift', label: 'Anschrift', art: 'langtext', zeilen: 2 }
      ], ziel),
      form.zeile([
        { pfad: 'datum', label: 'Datum', art: 'datum' },
        { pfad: 'paketId', label: 'Paket', art: 'auswahl', optionen: einstellungen.pakete.map(function (paket) {
          return { wert: paket.id, name: paket.name + ' (' + SM.geschaeft.formatEuro(Number(paket.preis) || 0) + ')' };
        }) },
        { pfad: 'preis', label: 'Abweichender Preis (€ / Monat)', art: 'zahl', min: 0, hilfe: 'Leer = Preis des Pakets.' }
      ], ziel),
      form.zeile([
        { pfad: 'start', label: 'Start', art: 'text', platzhalter: 'z. B. 1. Dezember 2026' },
        { pfad: 'laufzeit', label: 'Laufzeit', art: 'text' }
      ], ziel),
      form.feld({ pfad: 'zusatz', label: 'Zusätzlich vereinbart (optional)', art: 'langtext', zeilen: 3 }, ziel),
      form.hinweis('Das Angebot verspricht bewusst keine Follower-Zahlen oder Umsätze. Paket-Inhalte und Preise änderst du unter „Meine Daten und Pakete".'),
      el('div', { klasse: 'sm-knopfreihe' }, [
        knopf('Angebot öffnen', function () {
          SM.ui.app.oeffneDokument(SM.dokumente.angebot(angebot, einstellungen), 'angebot-' + SM.helfer.slug(angebot.empfaenger.split('\n')[0] || 'kunde') + '.html');
        }, 'sm-knopf-haupt', 'Im neuen Tab als PDF speichern'),
        knopf('Angebot löschen', function () {
          if (window.confirm('Dieses Angebot endgültig löschen?')) {
            einstellungen.angebote.splice(einstellungen.angebote.indexOf(angebot), 1);
            gewaehltesAngebot = '';
            SM.zustand.melde('einstellungen-struktur');
          }
        }, 'sm-knopf-zweit sm-knopf-gefahr')
      ])
    ], true));
  };

  /**
   * Zeichnet den Reiter "Kontaktaufnahme".
   * @param {HTMLElement} behaelter
   */
  SM.ui.geschaeft.akquise = function (behaelter) {
    var el = SM.ui.dom.el;
    var form = SM.ui.form;
    var meine = SM.zustand.einstellungen.meineDaten;
    var ausgabe = el('div', {});

    /** Zeichnet alle Vorlagen mit den aktuellen Angaben. */
    function zeichneVorlagen() {
      SM.ui.dom.leere(ausgabe);
      SM.konfig.akquiseVorlagen.forEach(function (vorlage) {
        var text = SM.konfig.fuelleAkquise(vorlage.text, meine, akquise);
        var betreff = vorlage.betreff ? SM.konfig.fuelleAkquise(vorlage.betreff, meine, akquise) : '';
        var inhalt = vorlage.art === 'leitfaden'
          ? el('ol', {}, text.split('\n').map(function (zeile) {
            return el('li', { text: zeile });
          }))
          : el('p', { klasse: 'sm-vorlagen-text', text: text });
        ausgabe.appendChild(el('section', { klasse: 'sm-karte' }, [
          el('h2', { text: vorlage.name }),
          betreff ? el('p', {}, [el('strong', { text: 'Betreff: ' }), betreff]) : null,
          inhalt,
          el('div', { klasse: 'sm-knopfreihe' }, [
            SM.ui.dom.knopf('Kopieren', function () {
              SM.ui.dom.kopiere((betreff ? 'Betreff: ' + betreff + '\n\n' : '') + text);
            }, 'sm-knopf-zweit')
          ])
        ]));
      });
    }

    var opt = { objekt: akquise, quelle: 'einstellungen', beiAenderung: zeichneVorlagen };
    behaelter.appendChild(form.hinweis('Rechtlicher Hinweis (keine Rechtsberatung): Werbung per E-Mail oder Direktnachricht ist in Österreich ohne vorherige Einwilligung nur sehr eingeschränkt erlaubt (§ 174 TKG 2021). Sicherer sind der persönliche Besuch oder ein Brief. Im Zweifel bei der WKO nachfragen.', 'warnung'));
    behaelter.appendChild(form.gruppe('ak-angaben', 'An wen geht es?', [
      form.zeile([
        { pfad: 'betrieb', label: 'Betrieb', art: 'text' },
        { pfad: 'ansprechperson', label: 'Anrede und Name, z. B. „Frau Huber"', art: 'text' },
        { pfad: 'ort', label: 'Ort', art: 'text' }
      ], opt),
      form.feld({ pfad: 'aufhaenger', label: 'Persönlicher Aufhänger (ein ehrlicher Satz)', art: 'langtext', zeilen: 2,
        platzhalter: 'z. B. Ich komme seit Jahren gern zu Ihnen und habe gesehen, dass …' }, opt),
      SM.helfer.istLeer(meine.name) ? form.hinweis('Dein Name fehlt noch (Meine Daten und Pakete) – in den Vorlagen steht deshalb {MeinName}.', 'warnung') : null
    ], true));
    behaelter.appendChild(ausgabe);
    zeichneVorlagen();
  };
})();
