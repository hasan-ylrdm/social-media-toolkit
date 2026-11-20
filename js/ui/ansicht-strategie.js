/* =====================================================================
   ansicht-strategie.js – Onboarding-Fragebogen, Strategie, Einwilligung
   ---------------------------------------------------------------------
   1. Fragebogen digital ausfüllen (oder leer drucken und mitgeben)
   2. "Strategie vorschlagen": baut aus Antworten, Branche und Paket einen
      Vorschlag (js/kern/strategie.js) – alles danach frei bearbeitbar
   3. Dokumente: Fragebogen, Strategie-Papier, Einwilligung für Fotos
   ===================================================================== */
(function () {
  'use strict';

  /**
   * Der digitale Fragebogen.
   * @returns {HTMLElement}
   */
  function fragebogen() {
    var kunde = SM.zustand.kunde;
    var felder = SM.konfig.onboardingFragen.map(function (frage) {
      return SM.ui.form.feld({ pfad: 'onboarding.' + frage.id, label: frage.frage, art: 'langtext', zeilen: 2, hilfe: frage.hilfe });
    });
    felder.push(SM.ui.dom.el('div', { klasse: 'sm-knopfreihe' }, [
      SM.ui.dom.knopf('Fragebogen drucken', function () {
        SM.ui.app.oeffneDokument(SM.dokumente.fragebogen(kunde, SM.zustand.einstellungen), 'fragebogen-' + SM.helfer.slug(kunde.stamm.firmenname) + '.html');
      }, 'sm-knopf-zweit', 'Mit den bisherigen Antworten; leere Fragen bekommen Schreiblinien')
    ]));
    return SM.ui.form.gruppe('s-fragebogen', '1. Onboarding-Fragebogen', felder, SM.helfer.istLeer(kunde.strategie.erzeugtAm));
  }

  /**
   * Editor für eine Themen-Säule.
   * @param {Object} saeule
   * @param {number} index
   * @returns {HTMLElement}
   */
  function saeulenEditor(saeule, index) {
    var el = SM.ui.dom.el;
    var form = SM.ui.form;
    var kunde = SM.zustand.kunde;
    var basis = { basis: 'strategie.saeulen.' + saeule.id };
    return el('div', { klasse: 'sm-kasten' }, [
      form.zeile([
        { pfad: 'name', label: 'Themen-Säule ' + (index + 1), art: 'text' },
        { pfad: 'anteil', label: 'Anteil in %', art: 'zahl', min: 0, max: 100, klasse: 'sm-feld-schmal' }
      ], basis),
      form.feld({ pfad: 'beschreibung', label: 'Worum geht es?', art: 'text' }, basis),
      form.mehrfach({
        label: 'Beitragsarten dieser Säule',
        optionen: SM.konfig.beitragsarten.map(function (art) {
          return { wert: art.id, name: art.name };
        }),
        hole: function () {
          return saeule.beitragsarten;
        },
        setze: function (liste) {
          saeule.beitragsarten = liste;
          SM.zustand.melde('eingabe');
        }
      }),
      SM.ui.dom.knopf('Säule entfernen', function () {
        kunde.strategie.saeulen.splice(kunde.strategie.saeulen.indexOf(saeule), 1);
        SM.zustand.melde('struktur');
      }, 'sm-knopf-mini sm-knopf-gefahr')
    ]);
  }

  /**
   * Der Strategie-Teil: Vorschlag erzeugen und bearbeiten.
   * @returns {HTMLElement}
   */
  function strategie() {
    var el = SM.ui.dom.el;
    var form = SM.ui.form;
    var knopf = SM.ui.dom.knopf;
    var kunde = SM.zustand.kunde;
    var einstellungen = SM.zustand.einstellungen;
    var paket = SM.geschaeft.paketVon(kunde, einstellungen);
    var summe = kunde.strategie.saeulen.reduce(function (zwischen, saeule) {
      return zwischen + (Number(saeule.anteil) || 0);
    }, 0);

    var kinder = [
      form.hinweis(paket
        ? 'Der Vorschlag richtet sich nach dem Paket „' + paket.name + '" (' + paket.postsProMonat + ' Beiträge pro Monat) und der Branche.'
        : 'Noch kein Paket gewählt (Kunden → Gebuchtes Paket). Der Vorschlag nimmt dann die Zahlen von unten.'),
      el('div', { klasse: 'sm-knopfreihe' }, [
        knopf(SM.helfer.istLeer(kunde.strategie.erzeugtAm) ? 'Strategie vorschlagen' : 'Strategie neu vorschlagen', function () {
          var schonDa = kunde.strategie.saeulen.length > 0;
          if (schonDa && !window.confirm('Die bisherige Strategie (Ziele, Säulen, Häufigkeit) wird durch einen neuen Vorschlag ersetzt. Fortfahren?')) {
            return;
          }
          kunde.strategie = SM.strategie.erzeuge(kunde, paket);
          SM.zustand.melde('struktur');
          SM.ui.dom.meldung('Strategie-Vorschlag erstellt. Bitte durchlesen und anpassen.');
        }, 'sm-knopf-haupt'),
        knopf('Strategie drucken', function () {
          SM.ui.app.oeffneDokument(SM.dokumente.strategie(kunde, einstellungen), 'strategie-' + SM.helfer.slug(kunde.stamm.firmenname) + '.html');
        }, 'sm-knopf-zweit')
      ]),
      form.feld({ pfad: 'strategie.ziele', label: 'Ziele', art: 'langtext', zeilen: 3 }),
      el('h3', { text: 'Themen-Säulen' }),
      summe !== 100 && kunde.strategie.saeulen.length > 0
        ? form.hinweis('Die Anteile ergeben zusammen ' + summe + ' % statt 100 %. Der Plan-Generator rechnet trotzdem im richtigen Verhältnis.', 'warnung')
        : null
    ];
    kunde.strategie.saeulen.forEach(function (saeule, index) {
      kinder.push(saeulenEditor(saeule, index));
    });
    kinder.push(knopf('+ Themen-Säule hinzufügen', function () {
      kunde.strategie.saeulen.push({ id: SM.helfer.neueId('saeule'), name: '', beschreibung: '', anteil: 20, beitragsarten: [] });
      SM.zustand.melde('struktur');
    }, 'sm-knopf-zweit'));
    kinder.push(el('h3', { text: 'Häufigkeit' }));
    kinder.push(form.zeile([
      { pfad: 'strategie.postsProMonat', label: 'Beiträge pro Monat', art: 'zahl', min: 0, max: 60 },
      { pfad: 'strategie.storiesProWoche', label: 'Stories pro Woche', art: 'zahl', min: 0, max: 21 },
      { pfad: 'strategie.reelsProMonat', label: 'Reels pro Monat', art: 'zahl', min: 0, max: 30 }
    ]));
    kinder.push(form.mehrfach({
      label: 'Bevorzugte Posting-Tage',
      optionen: SM.datum.WOCHENTAGE.map(function (name, index) {
        return { wert: index, name: name };
      }),
      hole: function () {
        return kunde.strategie.wochentage;
      },
      setze: function (liste) {
        kunde.strategie.wochentage = liste;
        SM.zustand.melde('eingabe');
      }
    }));
    kinder.push(form.feld({ pfad: 'strategie.kanalwahl', label: 'Kanalwahl', art: 'langtext', zeilen: 3 }));
    kinder.push(form.feld({ pfad: 'strategie.hinweise', label: 'Das ist dem Kunden wichtig (Dos & Don\'ts, Zielgruppe, Saison)', art: 'langtext', zeilen: 5 }));

    return form.gruppe('s-strategie', '2. Strategie', kinder, true);
  }

  /**
   * Der Bereich mit der Einwilligungs-Vorlage.
   * @returns {HTMLElement}
   */
  function einwilligung() {
    var kunde = SM.zustand.kunde;
    var einstellungen = SM.zustand.einstellungen;
    var name = SM.helfer.slug(kunde.stamm.firmenname);
    return SM.ui.form.gruppe('s-einwilligung', '3. Einwilligung für Fotos von Personen (DSGVO)', [
      SM.ui.form.hinweis('Das ist eine VORLAGE und keine Rechtsberatung. Verantwortlich für die Einwilligungen ist der Betrieb. Bitte vor der ersten Verwendung prüfen lassen (z. B. bei der Wirtschaftskammer).', 'warnung'),
      SM.ui.dom.el('p', { text: 'Wer auf einem Foto oder Video erkennbar ist, muss vorher zustimmen. Am besten schriftlich, bevor die ersten Aufnahmen gemacht werden.' }),
      SM.ui.dom.el('div', { klasse: 'sm-knopfreihe' }, [
        SM.ui.dom.knopf('Vorlage für Mitarbeiter', function () {
          SM.ui.app.oeffneDokument(SM.dokumente.einwilligung(kunde, einstellungen, 'mitarbeiter'), 'einwilligung-mitarbeiter-' + name + '.html');
        }, 'sm-knopf-zweit'),
        SM.ui.dom.knopf('Vorlage für Kunden des Betriebs', function () {
          SM.ui.app.oeffneDokument(SM.dokumente.einwilligung(kunde, einstellungen, 'kunde'), 'einwilligung-kunden-' + name + '.html');
        }, 'sm-knopf-zweit')
      ])
    ]);
  }

  SM.ui.ansichten.strategie = {
    titel: 'Strategie',
    brauchtKunde: true,

    /**
     * Zeichnet die Ansicht.
     * @param {HTMLElement} behaelter
     */
    zeichne: function (behaelter) {
      behaelter.appendChild(fragebogen());
      behaelter.appendChild(strategie());
      behaelter.appendChild(einwilligung());
    }
  };
})();
