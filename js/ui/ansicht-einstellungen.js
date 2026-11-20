/* =====================================================================
   ansicht-einstellungen.js – KI-Zugang, Datensicherung, Info
   ---------------------------------------------------------------------
   "Meine Daten" und die Pakete stehen unter "Mein Geschäft".
   Hier: der optionale KI-Assistent, die Gesamt-Sicherung (alle Kunden +
   Einstellungen, OHNE API-Key) und Angaben zur Version.
   ===================================================================== */
(function () {
  'use strict';

  /**
   * Gruppe "KI-Assistent".
   * @returns {HTMLElement}
   */
  function kiGruppe() {
    var form = SM.ui.form;
    var ziel = { ziel: 'einstellungen' };
    var ergebnis = SM.ui.dom.el('p', { klasse: 'sm-hilfe', role: 'status' });
    return form.gruppe('e-ki', 'KI-Assistent (optional)', [
      form.hinweis('Ohne Key funktioniert alles andere ganz normal. Der Key wird nur in diesem Browser gespeichert, nie in Kundendateien, Sicherungen oder Dokumenten. Anfragen gehen direkt an den Anbieter und kosten dort Geld (meist Bruchteile eines Cents pro Text).'),
      form.zeile([
        { pfad: 'ki.anbieter', label: 'Anbieter', art: 'auswahl', optionen: [
          { wert: 'anthropic', name: 'Anthropic (Claude API)' },
          { wert: 'openai-kompatibel', name: 'OpenAI-kompatible API' }
        ] },
        { pfad: 'ki.modell', label: 'Modell', art: 'text', hilfe: 'Modellnamen ändern sich – bei „model not found" den aktuellen Namen aus der Doku des Anbieters eintragen.' }
      ], ziel),
      form.feld({ pfad: 'ki.apiKey', label: 'API-Key', art: 'passwort' }, ziel),
      form.feld({ pfad: 'ki.basisUrl', label: 'Eigene Adresse der API (nur wenn nötig)', art: 'url',
        hilfe: 'Leer = Standard-Adresse des Anbieters.' }, ziel),
      SM.ui.dom.el('div', { klasse: 'sm-knopfreihe' }, [
        SM.ui.dom.knopf('Verbindung testen', function () {
          ergebnis.textContent = 'Teste …';
          SM.ki.frage(SM.zustand.einstellungen, { system: 'Antworte nur mit dem Wort OK.', nutzer: 'Test' }).then(function (antwort) {
            ergebnis.textContent = 'Verbindung klappt. Antwort: ' + antwort.slice(0, 40);
          }).catch(function (fehler) {
            ergebnis.textContent = fehler.message;
          });
        }, 'sm-knopf-zweit')
      ]),
      ergebnis
    ], true);
  }

  /**
   * Spielt eine Gesamt-Sicherung ein. Vorhandene Kunden mit gleicher id
   * werden überschrieben, der API-Key bleibt der bisherige.
   */
  function spieleSicherungEin() {
    SM.ui.app.waehleDatei('.json,application/json').then(function (text) {
      var sicherung = SM.kundendatei.sicherungAusText(text);
      var frage = 'Die Sicherung enthält ' + sicherung.kunden.length + ' Kunden und die Einstellungen (Meine Daten, Pakete, Checks, Angebote, Aufgaben).\n\n' +
        'Kunden mit derselben Kennung werden überschrieben, die Einstellungen ersetzt. Der API-Key bleibt erhalten. Fortfahren?';
      if (!window.confirm(frage)) {
        return null;
      }
      var alterKey = SM.zustand.einstellungen.ki.apiKey;
      sicherung.einstellungen.ki.apiKey = alterKey;
      SM.zustand.einstellungen = sicherung.einstellungen;
      var kette = SM.speicher.speichereEinstellungen(sicherung.einstellungen);
      sicherung.kunden.forEach(function (kunde) {
        kette = kette.then(function () {
          return SM.speicher.speichereKunde(kunde);
        });
      });
      return kette.then(function () {
        SM.zustand.kunde = null;
        return SM.ui.app.ladeKundenListe();
      }).then(function () {
        SM.ui.dom.meldung('Sicherung eingespielt.');
        if (SM.ui.app.kunden.length > 0) {
          return SM.ui.app.waehleKunde(SM.ui.app.kunden[0].id);
        }
        SM.ui.app.zeichneNeu();
        return null;
      });
    }).catch(function (fehler) {
      SM.ui.dom.meldung(fehler.message, 'fehler');
    });
  }

  /**
   * Gruppe "Daten sichern".
   * @returns {HTMLElement}
   */
  function datenGruppe() {
    var knopf = SM.ui.dom.knopf;
    return SM.ui.form.gruppe('e-daten', 'Daten sichern und wiederherstellen', [
      SM.ui.form.hinweis('Alle Daten liegen NUR in diesem Browser auf diesem Computer. Wer den Browser-Verlauf samt Website-Daten löscht, löscht auch die Kunden. Deshalb regelmäßig die Gesamt-Sicherung herunterladen und an einem sicheren Ort ablegen.', 'warnung'),
      SM.ui.dom.el('div', { klasse: 'sm-knopfreihe' }, [
        knopf('Gesamt-Sicherung herunterladen', function () {
          SM.ui.app.alleKunden().then(function (kunden) {
            SM.helfer.ladeHerunter('social-media-toolkit-sicherung-' + SM.datum.heute() + '.json',
              SM.kundendatei.sicherungZuText(kunden, SM.zustand.einstellungen), 'application/json');
          });
        }, 'sm-knopf-haupt', 'Alle Kunden inkl. Fotos und alle Einstellungen – ohne API-Key'),
        knopf('Gesamt-Sicherung einspielen …', spieleSicherungEin, 'sm-knopf-zweit'),
        knopf('Beispielkunde „Café Muster" neu anlegen', function () {
          var beispiel = SM.konfig.beispielKunde();
          beispiel.id = SM.helfer.neueId('kunde');
          SM.ui.app.uebernimmKunde(beispiel).then(function () {
            SM.ui.dom.meldung('Beispielkunde angelegt.');
          });
        }, 'sm-knopf-zweit', 'Legt eine frische Kopie des Beispielkunden an (vorhandene bleiben)')
      ]),
      SM.ui.dom.el('p', { klasse: 'sm-hilfe', text: 'Einzelne Kunden sicherst du unter „Kunden → Sichern, importieren, löschen".' })
    ], true);
  }

  SM.ui.ansichten.einstellungen = {
    titel: 'Einstellungen',
    brauchtKunde: false,

    /**
     * Zeichnet die Ansicht.
     * @param {HTMLElement} behaelter
     */
    zeichne: function (behaelter) {
      var el = SM.ui.dom.el;
      behaelter.appendChild(SM.ui.form.hinweis('Deinen Namen, deine Kontaktdaten, dein Logo und deine Pakete findest du unter „Mein Geschäft → Meine Daten und Pakete".'));
      behaelter.appendChild(kiGruppe());
      behaelter.appendChild(datenGruppe());
      behaelter.appendChild(SM.ui.form.gruppe('e-info', 'Über dieses Werkzeug', [
        el('p', { text: 'Social-Media-Betreuungs-Toolkit, Version ' + SM.VERSION + ' · Datenformat ' + SM.FORMAT_VERSION + '.' }),
        el('p', { text: SM.konfig.branchen.length + ' Branchen · ' + SM.grafik.alle().length + ' Grafik-Vorlagen · ' + SM.konfig.beitragsarten.length + ' Beitragsarten.' }),
        el('p', { text: 'Selbsttest: die Datei test.html im Ordner des Werkzeugs öffnen – alles grün heißt, die wichtigsten Funktionen arbeiten. Anleitungen stehen in README.md und WEITERENTWICKLUNG.md.' })
      ], true));
    }
  };
})();
