/* =====================================================================
   ki-dialog.js – Dialogfenster für den KI-Assistenten
   ---------------------------------------------------------------------
   Ein Dialog für alle KI-Aufgaben (Liste in js/kern/ki.js):
   Aufgabe wählen → Eingabe → "Erzeugen" → Ergebnis ansehen, bearbeiten,
   kopieren oder übernehmen.

   Aufruf:
     SM.ui.ki.oeffne({
       aufgaben: ['caption', 'umformulieren', 'kuerzen'],   // ids aus SM.ki.AUFGABEN
       eingabe: 'bisheriger Text',                           // optional
       uebernehmen: function (text) { … }                    // optional: Button "Übernehmen"
     });
   Ohne API-Key erklärt der Dialog, wo man ihn einträgt.
   ===================================================================== */
(function () {
  'use strict';

  SM.ui.ki = {};

  /**
   * Öffnet den KI-Dialog.
   * @param {Object} opt {aufgaben: string[], eingabe: string, uebernehmen: Function}
   */
  SM.ui.ki.oeffne = function (opt) {
    var el = SM.ui.dom.el;
    var knopf = SM.ui.dom.knopf;
    var einstellungen = SM.zustand.einstellungen;
    var kunde = SM.zustand.kunde;

    if (!SM.ki.istBereit(einstellungen)) {
      SM.ui.dom.dialog('KI-Assistent', el('div', {}, [
        el('p', { text: 'Der KI-Assistent ist optional. Um ihn zu nutzen, trage unter „Einstellungen → KI-Assistent" einen API-Key ein.' }),
        el('p', { text: 'Alles andere im Toolkit funktioniert auch ohne Key – zum Beispiel die fertigen Textbausteine im Bereich „Texte & Hashtags".' }),
        knopf('Zu den Einstellungen', function () {
          document.querySelector('dialog[open]').close();
          SM.ui.app.zeige('einstellungen');
        }, 'sm-knopf-haupt')
      ]));
      return;
    }

    var aufgaben = (opt.aufgaben || []).map(function (id) {
      return SM.konfig.hole(SM.ki.AUFGABEN, id);
    }).filter(Boolean);

    var aufgabeWahl = el('select', { id: 'ki-aufgabe' }, aufgaben.map(function (aufgabe) {
      return el('option', { value: aufgabe.id, text: aufgabe.name });
    }));
    var tonWahl = el('select', { id: 'ki-ton' }, SM.konfig.toene.map(function (ton) {
      return el('option', { value: ton.id, text: ton.name });
    }));
    tonWahl.value = kunde ? kunde.marke.ton : 'freundlich';

    var eingabeLabel = el('label', { for: 'ki-eingabe' });
    var eingabe = el('textarea', { id: 'ki-eingabe', rows: 4 });
    eingabe.value = opt.eingabe || '';
    var ergebnis = el('textarea', { id: 'ki-ergebnis', rows: 10, placeholder: 'Hier erscheint das Ergebnis. Du kannst es vor dem Übernehmen bearbeiten.' });
    var status = el('p', { klasse: 'sm-hilfe', role: 'status' });

    /** Passt die Beschriftung des Eingabefelds an die gewählte Aufgabe an. */
    function zeigeLabel() {
      eingabeLabel.textContent = SM.konfig.hole(SM.ki.AUFGABEN, aufgabeWahl.value).eingabeLabel;
    }
    aufgabeWahl.addEventListener('change', zeigeLabel);
    zeigeLabel();

    var erzeugen = knopf('Erzeugen', function () {
      erzeugen.disabled = true;
      status.textContent = 'Die KI schreibt …';
      var prompt = SM.ki.bauePrompt(aufgabeWahl.value, eingabe.value, kunde, tonWahl.value);
      SM.ki.frage(einstellungen, prompt).then(function (text) {
        ergebnis.value = text;
        status.textContent = 'Fertig. Bitte prüfen: Die KI kann Fehler machen.';
      }).catch(function (fehler) {
        status.textContent = fehler.message;
      }).then(function () {
        erzeugen.disabled = false;
      });
    }, 'sm-knopf-haupt');

    var fenster;
    var knoepfe = [
      erzeugen,
      knopf('Kopieren', function () {
        ergebnis.select();
        document.execCommand('copy');
        SM.ui.dom.meldung('In die Zwischenablage kopiert.');
      }, 'sm-knopf-zweit')
    ];
    if (opt.uebernehmen) {
      knoepfe.push(knopf('Übernehmen', function () {
        if (SM.helfer.istLeer(ergebnis.value)) {
          status.textContent = 'Es gibt noch kein Ergebnis.';
          return;
        }
        opt.uebernehmen(ergebnis.value);
        fenster.schliesse();
      }, 'sm-knopf-zweit'));
    }

    fenster = SM.ui.dom.dialog('KI-Assistent', el('div', {}, [
      el('div', { klasse: 'sm-zeile' }, [
        el('div', { klasse: 'sm-feld' }, [el('label', { for: 'ki-aufgabe', text: 'Aufgabe' }), aufgabeWahl]),
        el('div', { klasse: 'sm-feld' }, [el('label', { for: 'ki-ton', text: 'Ton' }), tonWahl])
      ]),
      el('div', { klasse: 'sm-feld' }, [eingabeLabel, eingabe]),
      el('div', { klasse: 'sm-knopfreihe' }, knoepfe),
      status,
      el('div', { klasse: 'sm-feld' }, [el('label', { for: 'ki-ergebnis', text: 'Ergebnis' }), ergebnis]),
      el('p', { klasse: 'sm-hilfe', text: 'Mitgeschickt werden Name, Branche, Ort, Beschreibung, Zielgruppe und Leistungen des Kunden – keine Fotos und keine Kontaktdaten.' })
    ]), 'sm-dialog-breit');
  };
})();
