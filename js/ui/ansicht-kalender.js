/* =====================================================================
   ansicht-kalender.js – Redaktionsplan: Monats- und Wochenansicht
   ---------------------------------------------------------------------
   - Beiträge per Drag & Drop auf einen anderen Tag ziehen
     (ohne Maus: Beitrag öffnen und das Datum im Post-Editor ändern)
   - Feiertage, Anlässe, Schulferien (Salzburg) und eigene Termine
     kommen aus js/kern/kalender-daten.js
   - "Monatsplan erzeugen" ruft js/kern/plan-generator.js
   Die Bausteine (Tages-Zelle, Beitrags-Chip) stehen in kalender-teile.js.
   ===================================================================== */
(function () {
  'use strict';

  /**
   * Die Beiträge eines Tages.
   * @param {string} datum
   * @returns {Array<Object>}
   */
  function postsAm(datum) {
    return SM.zustand.kunde.posts.filter(function (post) {
      return post.datum === datum;
    });
  }

  /**
   * Leiste über dem Kalender: blättern, Ansicht umschalten, Aktionen.
   * @returns {HTMLElement}
   */
  function leiste() {
    var el = SM.ui.dom.el;
    var knopf = SM.ui.dom.knopf;
    var status = SM.ui.status;
    var kunde = SM.zustand.kunde;
    var istMonat = status.kalenderModus === 'monat';

    /** Blättert einen Monat bzw. eine Woche weiter oder zurück. */
    function blaettere(richtung) {
      if (istMonat) {
        status.monat = SM.datum.plusMonate(status.monat, richtung);
        status.woche = SM.datum.montagVon(status.monat + '-01');
      } else {
        status.woche = SM.datum.plusTage(status.woche, 7 * richtung);
        status.monat = SM.datum.monatVon(status.woche);
      }
      SM.ui.app.zeichneNeu();
    }

    var titel = istMonat
      ? SM.datum.formatMonat(status.monat)
      : 'Woche ' + SM.datum.formatTag(status.woche) + ' – ' + SM.datum.formatTag(SM.datum.plusTage(status.woche, 6));

    return el('div', { klasse: 'sm-kalender-leiste' }, [
      knopf('‹', function () { blaettere(-1); }, 'sm-knopf-zweit', istMonat ? 'Vorheriger Monat' : 'Vorherige Woche'),
      el('strong', { klasse: 'sm-kalender-titel', text: titel }),
      knopf('›', function () { blaettere(1); }, 'sm-knopf-zweit', istMonat ? 'Nächster Monat' : 'Nächste Woche'),
      knopf('Heute', function () {
        status.monat = SM.datum.monatVon(SM.datum.heute());
        status.woche = SM.datum.montagVon(SM.datum.heute());
        SM.ui.app.zeichneNeu();
      }, 'sm-knopf-zweit'),
      knopf('Monat', function () {
        status.kalenderModus = 'monat';
        SM.ui.app.zeichneNeu();
      }, 'sm-knopf-zweit' + (istMonat ? ' sm-knopf-gewaehlt' : '')),
      knopf('Woche', function () {
        status.kalenderModus = 'woche';
        SM.ui.app.zeichneNeu();
      }, 'sm-knopf-zweit' + (istMonat ? '' : ' sm-knopf-gewaehlt')),
      el('span', { klasse: 'sm-luecke' }),
      knopf('Monatsplan erzeugen', function () {
        if (kunde.strategie.saeulen.length === 0) {
          SM.ui.dom.meldung('Zuerst unter „Strategie" einen Strategie-Vorschlag erstellen – der Plan braucht die Themen-Säulen.', 'fehler');
          return;
        }
        var vorhandene = kunde.posts.filter(function (post) {
          return post.datum.slice(0, 7) === status.monat;
        }).length;
        var frage = 'Für ' + SM.datum.formatMonat(status.monat) + ' einen Plan mit ' + kunde.strategie.postsProMonat + ' Beiträgen erzeugen?' +
          (vorhandene > 0 ? '\n\nDie ' + vorhandene + ' vorhandenen Beiträge dieses Monats bleiben erhalten; die neuen kommen dazu.' : '');
        if (!window.confirm(frage)) {
          return;
        }
        var neue = SM.planGenerator.erzeuge(kunde, status.monat);
        kunde.posts = kunde.posts.concat(neue);
        SM.zustand.melde('struktur');
        SM.ui.dom.meldung(neue.length + ' Beiträge als „Idee" angelegt. Jetzt Texte und Grafiken ausarbeiten.');
      }, 'sm-knopf-haupt', 'Erstellt aus Strategie und Paket einen ausgewogenen Plan für den angezeigten Monat')
    ]);
  }

  /**
   * Das Raster der Monatsansicht (Montag bis Sonntag, ganze Wochen).
   * @param {Object} kalender Einträge aus kalenderDaten.fuerZeitraum
   * @returns {HTMLElement}
   */
  function monatsRaster(kalender) {
    var el = SM.ui.dom.el;
    var monat = SM.ui.status.monat;
    var tage = SM.datum.tageImMonat(monat);
    var start = SM.datum.montagVon(tage[0]);
    var ende = SM.datum.plusTage(SM.datum.montagVon(tage[tage.length - 1]), 6);
    var raster = el('div', { klasse: 'sm-kalender', role: 'grid', 'aria-label': 'Monatsplan ' + SM.datum.formatMonat(monat) });

    SM.datum.WOCHENTAGE_KURZ.forEach(function (name) {
      raster.appendChild(el('div', { klasse: 'sm-kalender-kopf', text: name }));
    });
    for (var tag = start; tag <= ende; tag = SM.datum.plusTage(tag, 1)) {
      raster.appendChild(SM.ui.kalenderTeile.tagesZelle(tag, postsAm(tag), kalender[tag] || [], tag.slice(0, 7) !== monat, false));
    }
    return raster;
  }

  /**
   * Die Wochenansicht: 7 hohe Spalten mit mehr Angaben je Beitrag.
   * @param {Object} kalender
   * @returns {HTMLElement}
   */
  function wochenRaster(kalender) {
    var el = SM.ui.dom.el;
    var raster = el('div', { klasse: 'sm-kalender sm-kalender-woche', role: 'grid', 'aria-label': 'Wochenplan' });
    for (var i = 0; i < 7; i += 1) {
      var tag = SM.datum.plusTage(SM.ui.status.woche, i);
      raster.appendChild(SM.ui.kalenderTeile.tagesZelle(tag, postsAm(tag), kalender[tag] || [], false, true));
    }
    return raster;
  }

  /**
   * Eigene lokale Termine des Kunden (z. B. Stadtfest) eintragen.
   * @returns {HTMLElement}
   */
  function eigeneTermine() {
    return SM.ui.form.gruppe('kal-termine', 'Eigene lokale Termine (z. B. Stadtfest, Betriebsurlaub, Jubiläum)', [
      SM.ui.form.hinweis('Eigene Termine erscheinen im Kalender und werden vom Plan-Generator berücksichtigt.'),
      SM.ui.form.feld({
        pfad: 'events', art: 'liste', titelFeld: 'titel',
        felder: [
          { pfad: 'titel', label: 'Termin', art: 'text' },
          { pfad: 'datum', label: 'Datum', art: 'datum' }
        ],
        neu: function () {
          return { id: SM.helfer.neueId('event'), datum: SM.ui.status.monat + '-15', titel: '' };
        }
      }),
      SM.ui.dom.knopf('Kalender aktualisieren', SM.ui.app.zeichneNeu, 'sm-knopf-zweit')
    ]);
  }

  /**
   * Legende der Farben und Zeichen.
   * @returns {HTMLElement}
   */
  function legende() {
    var el = SM.ui.dom.el;
    var teile = SM.konfig.status.map(function (status) {
      return el('span', { klasse: 'sm-legende-punkt' }, [
        el('i', { style: 'background:' + status.farbe }), status.name
      ]);
    });
    teile.push(el('span', { klasse: 'sm-legende-punkt' }, [el('i', { klasse: 'sm-marke-feiertag' }), 'Feiertag']));
    teile.push(el('span', { klasse: 'sm-legende-punkt' }, [el('i', { klasse: 'sm-marke-anlass' }), 'Anlass']));
    teile.push(el('span', { klasse: 'sm-legende-punkt' }, [el('i', { klasse: 'sm-marke-event' }), 'Eigener Termin']));
    teile.push(el('span', { klasse: 'sm-legende-punkt' }, [el('i', { klasse: 'sm-marke-ferien' }), 'Schulferien Salzburg']));
    return el('div', { klasse: 'sm-legende' }, teile);
  }

  SM.ui.ansichten.kalender = {
    titel: 'Kalender',
    brauchtKunde: true,

    /**
     * Zeichnet den Kalender.
     * @param {HTMLElement} behaelter
     */
    zeichne: function (behaelter) {
      var status = SM.ui.status;
      var istMonat = status.kalenderModus === 'monat';
      var tage = SM.datum.tageImMonat(status.monat);
      var von = istMonat ? SM.datum.montagVon(tage[0]) : status.woche;
      var bis = istMonat ? SM.datum.plusTage(SM.datum.montagVon(tage[tage.length - 1]), 6) : SM.datum.plusTage(status.woche, 6);
      var kalender = SM.kalenderDaten.fuerZeitraum(von, bis, SM.zustand.kunde);

      behaelter.appendChild(leiste());
      behaelter.appendChild(istMonat ? monatsRaster(kalender) : wochenRaster(kalender));
      behaelter.appendChild(legende());
      behaelter.appendChild(SM.ui.form.hinweis('Beitrag anklicken = im Post-Editor öffnen. Ziehen = auf einen anderen Tag verschieben. „+" = neuer Beitrag an diesem Tag. Die Ferien sind berechnet – verbindlich sind die Termine der Bildungsdirektion.'));
      behaelter.appendChild(eigeneTermine());
    }
  };
})();
