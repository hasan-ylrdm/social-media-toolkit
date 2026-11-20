/* =====================================================================
   ansicht-kunden.js – Kundenverwaltung
   ---------------------------------------------------------------------
   Oben: Liste aller Kunden und die Buttons zum Anlegen, Öffnen einer
   Kundendatei und Importieren aus dem Website-Baukasten.
   Darunter: alle Daten des geöffneten Kunden in aufklappbaren Gruppen.
   Fotos und Logo: js/ui/kunden-fotos.js
   ===================================================================== */
(function () {
  'use strict';

  /**
   * Legt einen neuen Kunden mit den Vorschlägen seiner Branche an.
   * @param {string} name
   * @param {string} branchenId
   * @returns {Object} Kunde
   */
  function neuerKunde(name, branchenId) {
    var kunde = SM.datenmodell.leererKunde();
    var branche = SM.konfig.holeBranche(branchenId);
    kunde.stamm.firmenname = name;
    kunde.stamm.branche = branchenId;
    // Der Ort ist beim Anlegen noch leer → neutral formulieren statt "{Ort}" stehen zu lassen
    kunde.marke.zielgruppe = branche.zielgruppe.replace(/\{Ort\}/g, 'der Region');
    return kunde;
  }

  /**
   * Öffnet eine .json-Datei: Kundendatei oder Baukasten-Projekt.
   * Gibt es die id schon, bekommt der Import eine neue (nichts überschreiben).
   */
  function oeffneDatei() {
    SM.ui.app.waehleDatei('.json,application/json').then(function (text) {
      var art = SM.kundendatei.erkenne(text);
      var kunde;
      if (art === 'kunde') {
        kunde = SM.kundendatei.ausText(text);
      } else if (art === 'baukasten') {
        kunde = SM.baukastenImport.neuerKunde(text);
      } else if (art === 'sicherung') {
        throw new Error('Das ist eine Gesamt-Sicherung. Sie wird unter „Einstellungen → Daten" eingespielt.');
      } else {
        throw new Error('Die Datei ist weder eine Kundendatei noch ein Projekt aus dem Website-Baukasten.');
      }
      var gibtEsSchon = SM.ui.app.kunden.some(function (eintrag) {
        return eintrag.id === kunde.id;
      });
      if (gibtEsSchon) {
        kunde.id = SM.helfer.neueId('kunde');
        kunde.stamm.firmenname += ' (Import)';
      }
      return SM.ui.app.uebernimmKunde(kunde).then(function () {
        SM.ui.dom.meldung(art === 'baukasten'
          ? 'Aus dem Website-Baukasten übernommen: Stammdaten, Öffnungszeiten, Leistungen, Farben und Fotos (mit Logo, falls im Projekt vorhanden).'
          : 'Kundendatei geöffnet.');
      });
    }).catch(function (fehler) {
      SM.ui.dom.meldung(fehler.message, 'fehler');
    });
  }

  /**
   * Der Bereich oben: Kundenliste und "Neu".
   * @returns {HTMLElement}
   */
  function kundenListe() {
    var el = SM.ui.dom.el;
    var knopf = SM.ui.dom.knopf;
    var aktuell = SM.zustand.kunde;

    var nameFeld = el('input', { type: 'text', id: 'neu-name', placeholder: 'z. B. Tischlerei Huber' });
    var branchenWahl = el('select', { id: 'neu-branche' }, SM.konfig.branchen.map(function (branche) {
      return el('option', { value: branche.id, text: branche.name });
    }));

    var liste = el('div', { klasse: 'sm-kundenliste' }, SM.ui.app.kunden.map(function (eintrag) {
      var istAktuell = aktuell && aktuell.id === eintrag.id;
      return knopf(eintrag.name, function () {
        SM.ui.app.waehleKunde(eintrag.id);
      }, 'sm-knopf-zweit' + (istAktuell ? ' sm-knopf-gewaehlt' : ''), istAktuell ? 'Geöffnet: ' + eintrag.name : 'Öffnen: ' + eintrag.name);
    }));

    return el('section', { klasse: 'sm-karte' }, [
      el('h2', { text: 'Meine Kunden' }),
      SM.ui.app.kunden.length > 0 ? liste : el('p', { klasse: 'sm-leer', text: 'Noch kein Kunde angelegt.' }),
      el('div', { klasse: 'sm-zeile sm-zeile-unten' }, [
        el('div', { klasse: 'sm-feld' }, [el('label', { for: 'neu-name', text: 'Neuer Kunde: Name' }), nameFeld]),
        el('div', { klasse: 'sm-feld' }, [el('label', { for: 'neu-branche', text: 'Branche' }), branchenWahl]),
        knopf('Anlegen', function () {
          if (nameFeld.value.trim() === '') {
            SM.ui.dom.meldung('Bitte zuerst einen Namen eintragen.', 'fehler');
            return;
          }
          SM.ui.app.uebernimmKunde(neuerKunde(nameFeld.value.trim(), branchenWahl.value));
        }, 'sm-knopf-haupt')
      ]),
      el('div', { klasse: 'sm-knopfreihe' }, [
        knopf('Kundendatei öffnen …', oeffneDatei, 'sm-knopf-zweit', 'Eine .kunde.json-Datei öffnen'),
        knopf('Aus Website-Baukasten importieren …', oeffneDatei, 'sm-knopf-zweit', 'Eine .projekt.json-Datei aus dem Website-Baukasten als neuen Kunden übernehmen')
      ])
    ]);
  }

  /**
   * Eingabe der Öffnungszeiten (7 Tage).
   * @returns {HTMLElement}
   */
  function oeffnungszeiten() {
    var el = SM.ui.dom.el;
    var form = SM.ui.form;
    var zeilen = SM.datum.WOCHENTAGE.map(function (name, index) {
      var basis = { basis: 'oeffnungszeiten.tage.' + index };
      return el('div', { klasse: 'sm-zeiten-zeile' }, [
        el('strong', { text: name }),
        form.feld({ pfad: 'geschlossen', label: 'geschlossen', art: 'schalter' }, basis),
        form.feld({ pfad: 'von', label: 'von', art: 'zeit' }, basis),
        form.feld({ pfad: 'bis', label: 'bis', art: 'zeit' }, basis),
        form.feld({ pfad: 'pause', label: 'Mittagspause', art: 'schalter' }, basis),
        form.feld({ pfad: 'pauseVon', label: 'Pause von', art: 'zeit' }, basis),
        form.feld({ pfad: 'pauseBis', label: 'Pause bis', art: 'zeit' }, basis)
      ]);
    });
    zeilen.push(form.feld({ pfad: 'oeffnungszeiten.hinweis', label: 'Hinweis', art: 'text', platzhalter: 'z. B. Termine nach Vereinbarung' }));
    return el('div', {}, zeilen);
  }

  /**
   * Aktionen für den geöffneten Kunden: sichern, Baukasten-Daten
   * nachladen, duplizieren, löschen.
   * @returns {HTMLElement}
   */
  function aktionen() {
    var knopf = SM.ui.dom.knopf;
    var kunde = SM.zustand.kunde;
    return SM.ui.dom.el('div', { klasse: 'sm-knopfreihe' }, [
      knopf('Kundendatei herunterladen', function () {
        SM.helfer.ladeHerunter(SM.kundendatei.dateiname(kunde), SM.kundendatei.zuText(kunde), 'application/json');
      }, 'sm-knopf-zweit', 'Sicherung dieses Kunden als .json-Datei inkl. Fotos'),
      knopf('Daten aus Website-Baukasten nachladen …', function () {
        SM.ui.app.waehleDatei('.json,application/json').then(function (text) {
          SM.baukastenImport.uebernehmeIn(kunde, SM.baukastenImport.lies(text));
          SM.zustand.melde('struktur');
          SM.ui.app.ladeKundenListe();
          SM.ui.dom.meldung('Daten übernommen. Beiträge, Strategie und Berichte sind unverändert.');
        }).catch(function (fehler) {
          SM.ui.dom.meldung(fehler.message, 'fehler');
        });
      }, 'sm-knopf-zweit', 'Stammdaten, Farben und Fotos aus einer .projekt.json in DIESEN Kunden übernehmen'),
      knopf('Duplizieren', function () {
        var kopie = SM.helfer.kopiere(kunde);
        kopie.id = SM.helfer.neueId('kunde');
        kopie.stamm.firmenname += ' (Kopie)';
        SM.ui.app.uebernimmKunde(kopie);
      }, 'sm-knopf-zweit'),
      knopf('Kunden löschen', function () {
        if (!window.confirm('„' + kunde.stamm.firmenname + '" mit allen Beiträgen, Fotos und Berichten endgültig löschen? Tipp: vorher die Kundendatei herunterladen.')) {
          return;
        }
        SM.speicher.loescheKunde(kunde.id).then(function () {
          SM.zustand.kunde = null;
          return SM.ui.app.ladeKundenListe();
        }).then(function () {
          if (SM.ui.app.kunden.length > 0) {
            return SM.ui.app.waehleKunde(SM.ui.app.kunden[0].id);
          }
          SM.zustand.setzeKunde(null);
          return null;
        });
      }, 'sm-knopf-zweit sm-knopf-gefahr')
    ]);
  }

  /**
   * Die Gruppen mit allen Daten des geöffneten Kunden.
   * @returns {HTMLElement[]}
   */
  function kundenDaten() {
    var el = SM.ui.dom.el;
    var form = SM.ui.form;
    var einstellungen = SM.zustand.einstellungen;
    var kunde = SM.zustand.kunde;

    var paketOptionen = [{ wert: '', name: '— kein Paket —' }].concat(einstellungen.pakete.map(function (paket) {
      return { wert: paket.id, name: paket.name + ' (' + SM.geschaeft.formatEuro(Number(paket.preis) || 0) + ')' };
    }));

    return [
      form.gruppe('k-stamm', 'Stammdaten', [
        form.feld({ pfad: 'stamm.firmenname', label: 'Firmenname', art: 'text' }, { beiAenderung: SM.helfer.entprelle(SM.ui.app.ladeKundenListe, 800) }),
        form.zeile([
          { pfad: 'stamm.branche', label: 'Branche', art: 'auswahl', optionen: SM.konfig.branchen.map(function (branche) {
            return { wert: branche.id, name: branche.name };
          }), hilfe: 'Bestimmt Textbausteine, Hashtags, Reel-Ideen und den Strategie-Vorschlag.' },
          { pfad: 'stamm.slogan', label: 'Slogan', art: 'text' }
        ]),
        form.feld({ pfad: 'stamm.beschreibung', label: 'Kurzbeschreibung', art: 'langtext', hilfe: 'Was macht der Betrieb? Wird auch dem KI-Assistenten mitgegeben.' }),
        form.zeile([
          { pfad: 'stamm.strasse', label: 'Straße und Hausnummer', art: 'text' },
          { pfad: 'stamm.plz', label: 'PLZ', art: 'text', klasse: 'sm-feld-schmal' },
          { pfad: 'stamm.ort', label: 'Ort', art: 'text', hilfe: 'Für {Ort} und die Orts-Hashtags.' }
        ]),
        form.zeile([
          { pfad: 'stamm.telefon', label: 'Telefon', art: 'tel' },
          { pfad: 'stamm.email', label: 'E-Mail', art: 'email' },
          { pfad: 'stamm.website', label: 'Website', art: 'url' }
        ])
      ], true),

      form.gruppe('k-person', 'Ansprechperson und Notizen', [
        form.zeile([
          { pfad: 'ansprechperson.name', label: 'Ansprechperson', art: 'text' },
          { pfad: 'ansprechperson.telefon', label: 'Telefon', art: 'tel' },
          { pfad: 'ansprechperson.email', label: 'E-Mail', art: 'email' }
        ]),
        form.feld({ pfad: 'notizen', label: 'Notizen (nur für mich)', art: 'langtext', zeilen: 4 })
      ]),

      form.gruppe('k-marke', 'Marke: Farben, Schrift, Ton, Zielgruppe', [
        form.hinweis('Farben, Schrift und Logo übernehmen alle Grafik-Vorlagen automatisch.'),
        el('div', { klasse: 'sm-zeile' }, [
          form.feld({ pfad: 'marke.farben.primaer', label: 'Hauptfarbe', art: 'farbe' }),
          form.feld({ pfad: 'marke.farben.akzent', label: 'Akzentfarbe', art: 'farbe' }),
          form.feld({ pfad: 'marke.farben.hintergrund', label: 'Heller Hintergrund', art: 'farbe' }),
          form.feld({ pfad: 'marke.farben.text', label: 'Textfarbe', art: 'farbe' })
        ]),
        form.zeile([
          { pfad: 'marke.schriftpaar', label: 'Schriften', art: 'auswahl', optionen: SM.konfig.schriften.map(function (schrift) {
            return { wert: schrift.id, name: schrift.name };
          }) },
          { pfad: 'marke.ton', label: 'Ton der Texte', art: 'auswahl', optionen: SM.konfig.toene.map(function (ton) {
            return { wert: ton.id, name: ton.name };
          }) }
        ]),
        form.feld({ pfad: 'marke.zielgruppe', label: 'Zielgruppe', art: 'langtext' })
      ]),

      form.gruppe('k-kanaele', 'Kanäle', SM.konfig.kanaele.map(function (kanal) {
        return el('div', { klasse: 'sm-zeile sm-zeile-mitte' }, [
          form.feld({ pfad: 'kanaele.' + kanal.id + '.aktiv', label: kanal.name + ' betreue ich', art: 'schalter' }),
          form.feld({ pfad: 'kanaele.' + kanal.id + '.link', label: 'Link zum Profil', art: 'url' })
        ]);
      })),

      form.gruppe('k-paket', 'Gebuchtes Paket', [
        form.zeile([
          { pfad: 'paket.paketId', label: 'Paket', art: 'auswahl', optionen: paketOptionen },
          { pfad: 'paket.preis', label: 'Abweichender Preis (€ / Monat)', art: 'text', hilfe: 'Leer = Preis des Pakets.', klasse: 'sm-feld-schmal' },
          { pfad: 'paket.seit', label: 'Kunde seit', art: 'datum', klasse: 'sm-feld-schmal' }
        ]),
        form.hinweis('Pakete und Preise bearbeitest du unter „Mein Geschäft".')
      ]),

      form.gruppe('k-zeiten', 'Öffnungszeiten', [oeffnungszeiten()]),

      form.gruppe('k-leistungen', 'Leistungen und Preise', [
        form.feld({
          pfad: 'leistungen', art: 'liste', titelFeld: 'name',
          felder: [
            { pfad: 'name', label: 'Leistung', art: 'text' },
            { pfad: 'beschreibung', label: 'Beschreibung', art: 'text' },
            { pfad: 'preis', label: 'Preis', art: 'text' }
          ],
          neu: function () {
            return { id: SM.helfer.neueId('leistung'), name: '', beschreibung: '', preis: '' };
          }
        })
      ]),

      form.gruppe('k-fotos', 'Logo und Fotos', [SM.ui.kundenFotos.baue()], true),

      form.gruppe('k-aktionen', 'Sichern, importieren, löschen', [aktionen()], true)
    ];
  }

  SM.ui.ansichten.kunden = {
    titel: 'Kunden',
    brauchtKunde: false,

    /**
     * Zeichnet die Kundenverwaltung.
     * @param {HTMLElement} behaelter
     */
    zeichne: function (behaelter) {
      behaelter.appendChild(kundenListe());
      if (SM.zustand.kunde) {
        behaelter.appendChild(SM.ui.dom.el('h2', { klasse: 'sm-abschnitt-titel', text: SM.zustand.kunde.stamm.firmenname || '(ohne Namen)' }));
        kundenDaten().forEach(function (gruppe) {
          behaelter.appendChild(gruppe);
        });
      }
    }
  };
})();
