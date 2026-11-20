/* =====================================================================
   ansicht-texte.js – Texte & Hashtags
   ---------------------------------------------------------------------
   1. Textbausteine durchstöbern: alle Captions der Branche, nach
      Beitragsart, mit ausfüllbaren Platzhaltern ({Angebot}, {Datum} …)
   2. Hashtags: Sets der Branche und des Ortes anklicken und kombinieren,
      eigene Sets pro Kunde speichern
   3. KI-Werkzeuge (optional): Post-Ideen, Antworten auf Kommentare und
      Bewertungen
   Die Inhalte stehen in js/konfig/textbausteine-*.js und hashtags.js.
   ===================================================================== */
(function () {
  'use strict';

  /* Was ich in dieser Ansicht gerade gewählt/eingetippt habe (wird nicht gespeichert) */
  var auswahl = { beitragsart: 'angebot', werte: {}, tags: [] };

  /* Platzhalter, die ich selbst ausfülle (die anderen kommen aus dem Kunden) */
  var EIGENE_PLATZHALTER = ['Angebot', 'Preis', 'Datum', 'Thema', 'Name', 'Zitat', 'Stelle', 'Uhrzeit'];

  /**
   * Bereich 1: Textbausteine.
   * @returns {HTMLElement}
   */
  function textbausteine() {
    var el = SM.ui.dom.el;
    var kunde = SM.zustand.kunde;

    var artWahl = el('select', { id: 'tx-art' }, SM.konfig.beitragsarten.map(function (art) {
      return el('option', { value: art.id, text: art.name });
    }));
    artWahl.value = auswahl.beitragsart;
    artWahl.addEventListener('change', function () {
      auswahl.beitragsart = artWahl.value;
      SM.ui.app.zeichneNeu();
    });

    var liste = el('div', {});

    /** Zeichnet die Liste der Texte mit den aktuellen Platzhalter-Werten. */
    function zeichneListe() {
      SM.ui.dom.leere(liste);
      var captions = SM.platzhalter.captions(kunde.stamm.branche, auswahl.beitragsart);
      if (captions.length === 0) {
        liste.appendChild(el('p', { klasse: 'sm-leer', text: 'Für diese Beitragsart gibt es noch keine Texte.' }));
      }
      captions.forEach(function (vorlage) {
        var text = SM.platzhalter.ersetze(vorlage, kunde, auswahl.werte);
        liste.appendChild(el('div', { klasse: 'sm-kasten sm-textbaustein' }, [
          el('p', { text: text }),
          el('div', { klasse: 'sm-knopfreihe' }, [
            SM.ui.dom.knopf('Kopieren', function () {
              SM.ui.dom.kopiere(text);
            }, 'sm-knopf-mini'),
            el('small', { klasse: 'sm-hilfe', text: text.length + ' Zeichen' })
          ])
        ]));
      });
    }

    var platzhalterFelder = EIGENE_PLATZHALTER.map(function (name) {
      var feld = el('input', { type: 'text', id: 'tx-' + name, placeholder: '{' + name + '}' });
      feld.value = auswahl.werte[name] || '';
      feld.addEventListener('input', function () {
        auswahl.werte[name] = feld.value;
        zeichneListe();
      });
      return el('div', { klasse: 'sm-feld' }, [el('label', { for: 'tx-' + name, text: name }), feld]);
    });

    zeichneListe();
    var branche = SM.konfig.holeBranche(kunde.stamm.branche);
    return SM.ui.form.gruppe('tx-bausteine', 'Textbausteine für ' + (branche ? branche.name : 'die Branche'), [
      el('div', { klasse: 'sm-feld' }, [el('label', { for: 'tx-art', text: 'Beitragsart' }), artWahl]),
      el('p', { klasse: 'sm-hilfe', text: 'Platzhalter ausfüllen – die Texte unten passen sich sofort an. Leere Platzhalter bleiben sichtbar stehen.' }),
      el('div', { klasse: 'sm-raster-4' }, platzhalterFelder),
      liste
    ], true);
  }

  /**
   * Bereich 2: Hashtags kombinieren und eigene Sets pflegen.
   * @returns {HTMLElement}
   */
  function hashtags() {
    var el = SM.ui.dom.el;
    var kunde = SM.zustand.kunde;
    var ergebnis = el('textarea', { id: 'tx-kombi', rows: 3, 'aria-label': 'Kombinierte Hashtags' });
    var zaehler = el('small', { klasse: 'sm-hilfe' });

    /** Zeigt die aktuelle Kombination und die Anzahl. */
    function zeige() {
      ergebnis.value = auswahl.tags.join(' ');
      zaehler.textContent = auswahl.tags.length + ' Hashtags gewählt (Instagram erlaubt höchstens 5 je Beitrag).';
      zaehler.classList.toggle('sm-zu-lang', auswahl.tags.length > 5);
    }

    /**
     * Baut eine Reihe anklickbarer Hashtags.
     * @param {string} titel
     * @param {string[]} tags
     * @returns {HTMLElement}
     */
    function reihe(titel, tags) {
      return el('div', { klasse: 'sm-feld' }, [
        el('strong', { text: titel }),
        el('div', { klasse: 'sm-knopfreihe' }, tags.map(function (tag) {
          var knopf = SM.ui.dom.knopf(tag, function () {
            var index = auswahl.tags.indexOf(tag);
            if (index === -1) {
              auswahl.tags.push(tag);
            } else {
              auswahl.tags.splice(index, 1);
            }
            knopf.classList.toggle('sm-knopf-gewaehlt', index === -1);
            zeige();
          }, 'sm-knopf-mini' + (auswahl.tags.indexOf(tag) !== -1 ? ' sm-knopf-gewaehlt' : ''));
          return knopf;
        }))
      ]);
    }

    var kinder = [
      reihe('Branche', SM.konfig.hashtags.branchen[kunde.stamm.branche] || SM.konfig.hashtags.branchen.allgemein),
      reihe('Ort: ' + (kunde.stamm.ort || '(kein Ort eingetragen)'), SM.konfig.ortsHashtags(kunde.stamm.ort)),
      reihe('Allgemein regional', SM.konfig.hashtags.branchen.allgemein)
    ];
    kunde.hashtagSets.forEach(function (set) {
      kinder.push(reihe('Eigenes Set: ' + (set.name || 'ohne Namen'), String(set.tags || '').split(/\s+/).filter(Boolean)));
    });
    kinder.push(el('div', { klasse: 'sm-feld' }, [el('label', { for: 'tx-kombi', text: 'Meine Kombination' }), ergebnis, zaehler]));
    kinder.push(el('div', { klasse: 'sm-knopfreihe' }, [
      SM.ui.dom.knopf('Kopieren', function () {
        SM.ui.dom.kopiere(ergebnis.value);
      }, 'sm-knopf-zweit'),
      SM.ui.dom.knopf('Als eigenes Set speichern', function () {
        if (auswahl.tags.length === 0) {
          SM.ui.dom.meldung('Zuerst Hashtags anklicken.', 'fehler');
          return;
        }
        kunde.hashtagSets.push({ id: SM.helfer.neueId('set'), name: 'Set ' + (kunde.hashtagSets.length + 1), tags: ergebnis.value.trim() });
        SM.zustand.melde('struktur');
      }, 'sm-knopf-zweit'),
      SM.ui.dom.knopf('Auswahl leeren', function () {
        auswahl.tags = [];
        SM.ui.app.zeichneNeu();
      }, 'sm-knopf-zweit')
    ]));
    kinder.push(el('h3', { text: 'Eigene Sets dieses Kunden' }));
    kinder.push(SM.ui.form.feld({
      pfad: 'hashtagSets', art: 'liste', titelFeld: 'name',
      felder: [
        { pfad: 'name', label: 'Name des Sets', art: 'text' },
        { pfad: 'tags', label: 'Hashtags (mit Leerzeichen getrennt)', art: 'langtext', zeilen: 2 }
      ],
      neu: function () {
        return { id: SM.helfer.neueId('set'), name: '', tags: '' };
      }
    }));
    zeige();
    return SM.ui.form.gruppe('tx-hashtags', 'Hashtags', kinder, true);
  }

  /**
   * Bereich 3: KI-Werkzeuge.
   * @returns {HTMLElement}
   */
  function kiWerkzeuge() {
    var knopf = SM.ui.dom.knopf;
    return SM.ui.form.gruppe('tx-ki', 'KI-Assistent (optional)', [
      SM.ui.form.hinweis(SM.ki.istBereit(SM.zustand.einstellungen)
        ? 'Der KI-Assistent ist eingerichtet. Ergebnisse immer prüfen – die KI kann Fehler machen.'
        : 'Optional: Mit einem API-Key (Einstellungen → KI-Assistent) schreibt die KI Vorschläge. Ohne Key funktioniert alles andere ganz normal.'),
      SM.ui.dom.el('div', { klasse: 'sm-knopfreihe' }, [
        knopf('5 Post-Ideen für den Monat', function () {
          SM.ui.ki.oeffne({ aufgaben: ['ideen'], eingabe: SM.datum.formatMonat(SM.ui.status.monat) });
        }, 'sm-knopf-zweit sm-knopf-ki'),
        knopf('Antwort auf einen Kommentar', function () {
          SM.ui.ki.oeffne({ aufgaben: ['antwort-kommentar', 'antwort-bewertung'] });
        }, 'sm-knopf-zweit sm-knopf-ki'),
        knopf('Antwort auf eine Bewertung', function () {
          SM.ui.ki.oeffne({ aufgaben: ['antwort-bewertung', 'antwort-kommentar'] });
        }, 'sm-knopf-zweit sm-knopf-ki'),
        knopf('Text umformulieren oder kürzen', function () {
          SM.ui.ki.oeffne({ aufgaben: ['umformulieren', 'kuerzen', 'emojis-mehr', 'emojis-weniger', 'caption'] });
        }, 'sm-knopf-zweit sm-knopf-ki')
      ])
    ], true);
  }

  SM.ui.ansichten.texte = {
    titel: 'Texte & Hashtags',
    brauchtKunde: true,

    /**
     * Zeichnet die Ansicht.
     * @param {HTMLElement} behaelter
     */
    zeichne: function (behaelter) {
      behaelter.appendChild(textbausteine());
      behaelter.appendChild(hashtags());
      behaelter.appendChild(kiWerkzeuge());
    }
  };
})();
