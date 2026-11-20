/* =====================================================================
   listen.js – Editor für Listen (Leistungen, Pakete, Hashtag-Sets, …)
   ---------------------------------------------------------------------
   Eine Liste im Datenmodell ist immer ein Array von Objekten mit "id".
   Dieser Editor zeigt jeden Eintrag aufklappbar mit seinen Feldern und
   den Buttons: nach oben, nach unten, duplizieren, löschen.

   Beispiel:
     SM.ui.listen.liste({
       pfad: 'leistungen',
       titelFeld: 'name',
       felder: [{ pfad: 'name', label: 'Leistung', art: 'text' }],
       neu: function () { return { id: SM.helfer.neueId('leistung'), name: '', beschreibung: '', preis: '' }; }
     })
   ===================================================================== */
(function () {
  'use strict';

  SM.ui.listen = {};

  var offenerEintrag = {};  // {listenPfad: id des aufgeklappten Eintrags}

  /**
   * Erzeugt einen Listen-Editor.
   * @param {Object} opt
   *   pfad {string}       Pfad der Liste, z. B. "leistungen"
   *   ziel {string}       "einstellungen" statt Kunde
   *   titel {string}      optionale Überschrift über der Liste
   *   titelFeld {string}  Feld, das als Titel des Eintrags angezeigt wird
   *   felder {Array}      Feld-Beschreibungen (siehe formular.js)
   *   neu {Function}      liefert einen neuen, leeren Eintrag MIT id
   * @returns {HTMLElement}
   */
  SM.ui.listen.liste = function (opt) {
    var el = SM.ui.dom.el;
    var knopf = SM.ui.dom.knopf;
    var behaelter = el('div', { klasse: 'sm-liste' });

    /** Liefert das Array aus dem Kunden bzw. den Einstellungen. */
    function holeListe() {
      var wurzel = opt.ziel === 'einstellungen' ? SM.zustand.einstellungen : SM.zustand.kunde;
      var liste = SM.helfer.holePfad(wurzel, opt.pfad);
      if (!Array.isArray(liste)) {
        liste = [];
        SM.helfer.setzePfad(wurzel, opt.pfad, liste);
      }
      return liste;
    }

    /** Meldet eine Änderung an der Liste und zeichnet sie neu. */
    function geaendert() {
      SM.zustand.melde(opt.ziel === 'einstellungen' ? 'einstellungen' : 'eingabe');
      zeichne();
    }

    /** Tauscht zwei Einträge (für nach oben / nach unten). */
    function verschiebe(index, richtung) {
      var liste = holeListe();
      var ziel = index + richtung;
      if (ziel < 0 || ziel >= liste.length) {
        return;
      }
      var eintrag = liste.splice(index, 1)[0];
      liste.splice(ziel, 0, eintrag);
      geaendert();
    }

    /** Baut einen einzelnen Eintrag. */
    function baueEintrag(eintrag, index, liste) {
      var titel = el('span', { klasse: 'sm-eintrag-titel', text: eintrag[opt.titelFeld] || '(noch leer)' });

      var werkzeuge = el('span', { klasse: 'sm-eintrag-knoepfe' }, [
        knopf('↑', function () { verschiebe(index, -1); }, 'sm-knopf-mini', 'Nach oben'),
        knopf('↓', function () { verschiebe(index, 1); }, 'sm-knopf-mini', 'Nach unten'),
        knopf('⧉', function () {
          var kopie = SM.helfer.kopiere(eintrag);
          kopie.id = SM.helfer.neueId('eintrag');
          liste.splice(index + 1, 0, kopie);
          offenerEintrag[opt.pfad] = kopie.id;
          geaendert();
        }, 'sm-knopf-mini', 'Duplizieren'),
        knopf('✕', function () {
          liste.splice(index, 1);
          geaendert();
        }, 'sm-knopf-mini sm-knopf-gefahr', 'Löschen')
      ]);

      var felder = SM.ui.form.felder(opt.felder, { basis: opt.pfad + '.' + eintrag.id, ziel: opt.ziel });
      var details = el('details', { klasse: 'sm-eintrag', open: offenerEintrag[opt.pfad] === eintrag.id }, [
        el('summary', {}, [titel, werkzeuge]),
        el('div', { klasse: 'sm-eintrag-inhalt' }, felder)
      ]);

      details.addEventListener('toggle', function () {
        if (details.open) {
          offenerEintrag[opt.pfad] = eintrag.id;
        } else if (offenerEintrag[opt.pfad] === eintrag.id) {
          offenerEintrag[opt.pfad] = null;
        }
      });
      // Titel in der Kopfzeile beim Tippen mitführen
      details.addEventListener('input', function () {
        titel.textContent = eintrag[opt.titelFeld] || '(noch leer)';
      });
      return details;
    }

    /** Zeichnet die ganze Liste neu. */
    function zeichne() {
      SM.ui.dom.leere(behaelter);
      var liste = holeListe();

      if (opt.titel) {
        behaelter.appendChild(el('p', { klasse: 'sm-liste-titel', text: opt.titel }));
      }
      liste.forEach(function (eintrag, index) {
        behaelter.appendChild(baueEintrag(eintrag, index, liste));
      });
      if (liste.length === 0) {
        behaelter.appendChild(el('p', { klasse: 'sm-leer', text: 'Noch keine Einträge.' }));
      }
      behaelter.appendChild(knopf('+ Eintrag hinzufügen', function () {
        var neu = opt.neu();
        liste.push(neu);
        offenerEintrag[opt.pfad] = neu.id;
        geaendert();
      }, 'sm-knopf-zweit'));
    }

    zeichne();
    return behaelter;
  };
})();
