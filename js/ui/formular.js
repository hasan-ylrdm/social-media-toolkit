/* =====================================================================
   formular.js – Eingabefelder, die direkt mit den Daten verbunden sind
   ---------------------------------------------------------------------
   Ein Feld wird durch ein kleines Objekt beschrieben:
     { pfad: 'stamm.firmenname', label: 'Firmenname', art: 'text' }
   art:  text | langtext | email | tel | url | zeit | datum | monat | zahl |
         passwort | farbe | regler | auswahl | schalter | bild | liste
   weitere Angaben:
     hilfe       kleiner Erklärtext unter dem Feld
     zeilen      Höhe bei langtext (Standard 3)
     optionen    bei auswahl: [{wert, name}]
     zahl        bei auswahl: true = Wert als Zahl speichern
     min, max, schritt   bei zahl und regler
     maxZeichen  zeigt einen Zeichenzähler
     platzhalter grauer Beispieltext im leeren Feld
     klasse      zusätzliche CSS-Klasse am Feld (z. B. "sm-feld-schmal")

   Jedes Feld schreibt beim Tippen direkt in SM.zustand.kunde (oder mit
   {ziel: 'einstellungen'} in SM.zustand.einstellungen) und ruft
   SM.zustand.melde() auf → automatisches Speichern.
   Soll sich nach der Eingabe die Ansicht neu aufbauen (z. B. nach der
   Wahl einer anderen Vorlage), {quelle: 'struktur'} mitgeben.
   ===================================================================== */
(function () {
  'use strict';

  SM.ui.form = {};

  var offeneGruppen = {};   // merkt sich, welche Gruppen aufgeklappt sind
  var feldZaehler = 0;

  /**
   * Liefert das Daten-Objekt, in das ein Feld schreibt.
   * @param {Object} opt {ziel, objekt}
   * @returns {Object} Kunde, Einstellungen oder ein eigenes Objekt (opt.objekt)
   */
  function wurzel(opt) {
    if (opt.objekt) {
      return opt.objekt;
    }
    return opt.ziel === 'einstellungen' ? SM.zustand.einstellungen : SM.zustand.kunde;
  }

  /**
   * Schreibt einen Wert und meldet die Änderung.
   * @param {string} pfad
   * @param {*} wert
   * @param {Object} opt {ziel, quelle, objekt, beiAenderung}
   */
  function schreibe(pfad, wert, opt) {
    SM.helfer.setzePfad(wurzel(opt), pfad, wert);
    var standard = opt.ziel === 'einstellungen' ? 'einstellungen' : 'eingabe';
    var quelle = opt.quelle || standard;
    if (quelle === 'struktur' && opt.ziel === 'einstellungen') {
      quelle = 'einstellungen-struktur';
    }
    SM.zustand.melde(quelle);
    if (opt.beiAenderung) {
      opt.beiAenderung(wert);
    }
  }

  /**
   * Auswahlliste aller Fotos des Kunden (für art: 'bild').
   * @returns {Array<{wert, name}>}
   */
  function bildOptionen() {
    var optionen = [{ wert: '', name: '— kein Foto —' }];
    SM.zustand.kunde.bilder.forEach(function (bild) {
      if (bild.bereich !== 'logo') {
        optionen.push({ wert: bild.id, name: bild.alt || bild.name || 'Foto' });
      }
    });
    return optionen;
  }

  /**
   * Erzeugt das eigentliche Eingabe-Element passend zur Feld-Art.
   * @param {Object} def Feld-Beschreibung
   * @param {string} pfad vollständiger Pfad
   * @param {Object} opt Optionen von feld()
   * @param {string} id HTML-id für das Label
   * @returns {HTMLElement}
   */
  function eingabe(def, pfad, opt, id) {
    var el = SM.ui.dom.el;
    var wert = SM.helfer.holePfad(wurzel(opt), pfad);
    if (wert === undefined || wert === null) {
      wert = '';
    }

    if (def.art === 'langtext') {
      var bereich = el('textarea', { id: id, rows: def.zeilen || 3, placeholder: def.platzhalter });
      bereich.value = wert;
      bereich.addEventListener('input', function () {
        schreibe(pfad, bereich.value, opt);
      });
      return bereich;
    }

    if (def.art === 'auswahl' || def.art === 'bild') {
      var optionen = def.art === 'bild' ? bildOptionen() : def.optionen;
      var auswahl = el('select', { id: id }, optionen.map(function (option) {
        return el('option', { value: String(option.wert), text: option.name });
      }));
      auswahl.value = String(wert);
      auswahl.addEventListener('change', function () {
        schreibe(pfad, def.zahl ? Number(auswahl.value) : auswahl.value, opt);
      });
      return auswahl;
    }

    if (def.art === 'schalter') {
      var haken = el('input', { id: id, type: 'checkbox' });
      haken.checked = !!wert;
      haken.addEventListener('change', function () {
        schreibe(pfad, haken.checked, opt);
      });
      return haken;
    }

    var typen = { email: 'email', tel: 'tel', url: 'url', zeit: 'time', datum: 'date', monat: 'month',
      farbe: 'color', passwort: 'password', zahl: 'number', regler: 'range' };
    var feld = el('input', {
      id: id, type: typen[def.art] || 'text', placeholder: def.platzhalter, autocomplete: 'off',
      min: def.min, max: def.max, step: def.schritt
    });
    feld.value = wert;
    feld.addEventListener('input', function () {
      var istZahl = def.art === 'zahl' || def.art === 'regler';
      schreibe(pfad, istZahl ? (feld.value === '' ? '' : Number(feld.value)) : feld.value, opt);
    });
    return feld;
  }

  /**
   * Erzeugt ein beschriftetes Eingabefeld.
   * @param {Object} def Feld-Beschreibung (siehe Kopfkommentar)
   * @param {Object} [optionen]
   *   basis {string}        Pfad-Anfang, z. B. "posts.<id>"
   *   ziel {string}         "einstellungen" statt Kunde
   *   objekt {Object}       eigenes Objekt statt Kunde/Einstellungen
   *   quelle {string}       Quelle für SM.zustand.melde (Standard "eingabe")
   *   beiAenderung {Function}  wird nach jeder Eingabe aufgerufen
   * @returns {HTMLElement}
   */
  SM.ui.form.feld = function (def, optionen) {
    var el = SM.ui.dom.el;
    var opt = optionen || {};
    var pfad = opt.basis ? opt.basis + '.' + def.pfad : def.pfad;

    if (def.art === 'liste') {
      return SM.ui.listen.liste({
        pfad: pfad, ziel: opt.ziel, titel: def.label, titelFeld: def.titelFeld,
        felder: def.felder, neu: def.neu
      });
    }

    feldZaehler += 1;
    var id = 'feld-' + feldZaehler;
    var element = eingabe(def, pfad, opt, id);
    var kinder;

    if (def.art === 'schalter') {
      kinder = [el('div', { klasse: 'sm-schalter' }, [element, el('label', { for: id, text: def.label })])];
    } else {
      kinder = [el('label', { for: id, text: def.label }), element];
    }

    if (def.maxZeichen) {
      var zaehler = el('small', { klasse: 'sm-zaehler' });
      var zeige = function () {
        zaehler.textContent = element.value.length + ' / ' + def.maxZeichen + ' Zeichen';
        zaehler.classList.toggle('sm-zu-lang', element.value.length > def.maxZeichen);
      };
      element.addEventListener('input', zeige);
      zeige();
      kinder.push(zaehler);
    }
    if (def.hilfe) {
      kinder.push(el('small', { klasse: 'sm-hilfe', text: def.hilfe }));
    }
    return el('div', { klasse: 'sm-feld' + (def.klasse ? ' ' + def.klasse : '') }, kinder);
  };

  /**
   * Erzeugt mehrere Felder auf einmal.
   * @param {Array<Object>} defs Feld-Beschreibungen
   * @param {Object} [optionen] wie bei feld()
   * @returns {HTMLElement[]}
   */
  SM.ui.form.felder = function (defs, optionen) {
    return defs.map(function (def) {
      return SM.ui.form.feld(def, optionen);
    });
  };

  /**
   * Mehrere Felder nebeneinander in einer Zeile.
   * @param {Array<Object>} defs Feld-Beschreibungen
   * @param {Object} [optionen] wie bei feld()
   * @returns {HTMLElement}
   */
  SM.ui.form.zeile = function (defs, optionen) {
    return SM.ui.dom.el('div', { klasse: 'sm-zeile' }, SM.ui.form.felder(defs, optionen));
  };

  /**
   * Aufklappbare Gruppe. Die Oberfläche merkt sich, ob sie offen war.
   * @param {string} schluessel eindeutiger Name der Gruppe (zum Merken)
   * @param {string} titel
   * @param {Array<HTMLElement>} kinder
   * @param {boolean} [standardOffen] beim ersten Mal offen?
   * @returns {HTMLElement}
   */
  SM.ui.form.gruppe = function (schluessel, titel, kinder, standardOffen) {
    var el = SM.ui.dom.el;
    if (offeneGruppen[schluessel] === undefined) {
      offeneGruppen[schluessel] = !!standardOffen;
    }
    var gruppe = el('details', { klasse: 'sm-gruppe', open: offeneGruppen[schluessel] }, [
      el('summary', { text: titel }),
      el('div', { klasse: 'sm-gruppe-inhalt' }, kinder)
    ]);
    gruppe.addEventListener('toggle', function () {
      offeneGruppen[schluessel] = gruppe.open;
    });
    return gruppe;
  };

  /**
   * Hinweis-Kasten.
   * @param {string} text
   * @param {string} [art] "info" (Standard) oder "warnung"
   * @returns {HTMLElement}
   */
  SM.ui.form.hinweis = function (text, art) {
    return SM.ui.dom.el('p', { klasse: 'sm-hinweis sm-hinweis-' + (art || 'info'), text: text });
  };

  /**
   * Mehrere Ankreuz-Kästchen, die zusammen eine Liste von Werten pflegen
   * (z. B. Kanäle eines Posts oder Wochentage der Strategie).
   * @param {Object} opt
   *   label {string}                 Überschrift
   *   optionen {Array<{wert, name}>} die Kästchen
   *   hole {Function}                liefert die aktuelle Liste (Array)
   *   setze {Function}               bekommt die neue Liste
   * @returns {HTMLElement}
   */
  SM.ui.form.mehrfach = function (opt) {
    var el = SM.ui.dom.el;
    var kaestchen = opt.optionen.map(function (option) {
      feldZaehler += 1;
      var id = 'feld-' + feldZaehler;
      var haken = el('input', { id: id, type: 'checkbox' });
      haken.checked = opt.hole().indexOf(option.wert) !== -1;
      haken.addEventListener('change', function () {
        var liste = opt.hole().filter(function (wert) {
          return wert !== option.wert;
        });
        if (haken.checked) {
          liste.push(option.wert);
        }
        // Reihenfolge wie in den Optionen halten
        opt.setze(opt.optionen.map(function (o) {
          return o.wert;
        }).filter(function (wert) {
          return liste.indexOf(wert) !== -1;
        }));
      });
      return el('span', { klasse: 'sm-haken' }, [haken, el('label', { for: id, text: option.name })]);
    });
    return el('fieldset', { klasse: 'sm-feld sm-mehrfach' }, [el('legend', { text: opt.label })].concat(kaestchen));
  };
})();
