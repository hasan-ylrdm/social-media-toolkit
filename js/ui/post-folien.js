/* =====================================================================
   post-folien.js – Post-Editor: Grafik (Folien) bearbeiten
   ---------------------------------------------------------------------
   Ein Beitrag hat eine oder mehrere Folien (Karussell). Pro Folie:
   Vorlage, bis zu vier Texte, Foto(s) mit Ausschnitt, Textposition,
   Ausrichtung und Farbschema.
   Welche Text-Felder erscheinen, bestimmt die Vorlage über "plaetze"
   (siehe js/grafik/vorlagen-register.js).
   ===================================================================== */
(function () {
  'use strict';

  SM.ui.postFolien = {};

  /**
   * Leiste zum Wählen, Hinzufügen, Verschieben und Entfernen von Folien.
   * @param {Object} post
   * @returns {HTMLElement}
   */
  function folienLeiste(post) {
    var el = SM.ui.dom.el;
    var knopf = SM.ui.dom.knopf;
    var gewaehlt = SM.ui.status.folienIndex;

    /** Wählt eine Folie und zeichnet neu. */
    function waehle(index) {
      SM.ui.status.folienIndex = index;
      SM.ui.app.zeichneNeu();
    }

    /** Verschiebt die gewählte Folie nach links (-1) oder rechts (+1). */
    function verschiebe(richtung) {
      var ziel = gewaehlt + richtung;
      if (ziel < 0 || ziel >= post.folien.length) {
        return;
      }
      var folie = post.folien.splice(gewaehlt, 1)[0];
      post.folien.splice(ziel, 0, folie);
      SM.ui.status.folienIndex = ziel;
      SM.zustand.melde('struktur');
    }

    var knoepfe = post.folien.map(function (folie, index) {
      return knopf(String(index + 1), function () {
        waehle(index);
      }, 'sm-knopf-zweit' + (index === gewaehlt ? ' sm-knopf-gewaehlt' : ''), 'Folie ' + (index + 1));
    });
    knoepfe.push(knopf('+ Folie', function () {
      var vorherige = post.folien[post.folien.length - 1];
      var neu = SM.datenmodell.leereFolie(post.folien.length === 1 ? 'liste' : vorherige.vorlage);
      neu.farbschema = vorherige.farbschema;
      post.folien.push(neu);
      SM.ui.status.folienIndex = post.folien.length - 1;
      SM.zustand.melde('struktur');
    }, 'sm-knopf-zweit', 'Weitere Folie anhängen (macht aus dem Beitrag ein Karussell)'));

    if (post.folien.length > 1) {
      knoepfe.push(el('span', { klasse: 'sm-luecke' }));
      knoepfe.push(knopf('←', function () { verschiebe(-1); }, 'sm-knopf-mini', 'Folie nach vorne'));
      knoepfe.push(knopf('→', function () { verschiebe(1); }, 'sm-knopf-mini', 'Folie nach hinten'));
      knoepfe.push(knopf('Entfernen', function () {
        post.folien.splice(gewaehlt, 1);
        SM.ui.status.folienIndex = Math.max(0, gewaehlt - 1);
        SM.zustand.melde('struktur');
      }, 'sm-knopf-mini sm-knopf-gefahr', 'Gewählte Folie entfernen'));
    }
    return el('div', { klasse: 'sm-knopfreihe sm-folien-leiste' }, knoepfe);
  }

  /**
   * Die Felder einer Folie.
   * @param {Object} post
   * @param {Object} folie
   * @returns {HTMLElement[]}
   */
  function folienFelder(post, folie) {
    var form = SM.ui.form;
    var basis = { basis: 'posts.' + post.id + '.folien.' + folie.id };
    var neuZeichnen = { basis: basis.basis, quelle: 'struktur' };
    var vorlage = SM.grafik.hole(folie.vorlage) || SM.grafik.alle()[0];
    var kinder = [];

    kinder.push(form.feld({
      pfad: 'vorlage', label: 'Grafik-Vorlage', art: 'auswahl',
      optionen: SM.grafik.alle().map(function (eintrag) {
        return { wert: eintrag.id, name: eintrag.name };
      })
    }, neuZeichnen));

    // Text-Felder: nur die Plätze, die die Vorlage nutzt
    ['untertitel', 'titel', 'text', 'zusatz'].forEach(function (platz) {
      if (vorlage.plaetze[platz]) {
        kinder.push(form.feld({
          pfad: 'texte.' + platz, label: vorlage.plaetze[platz],
          art: platz === 'text' ? 'langtext' : 'text', zeilen: 3
        }, basis));
      }
    });

    if (vorlage.bilder >= 1) {
      if (SM.zustand.kunde.bilder.length === 0) {
        kinder.push(form.hinweis('Noch keine Fotos vorhanden. Fotos lädst du unter „Kunden → Logo und Fotos" hoch.'));
      }
      kinder.push(form.feld({ pfad: 'bildId', label: vorlage.bilder === 2 ? 'Foto links / oben (Vorher)' : 'Foto', art: 'bild' }, basis));
    }
    if (vorlage.bilder === 2) {
      kinder.push(form.feld({ pfad: 'bildId2', label: 'Foto rechts / unten (Nachher)', art: 'bild' }, basis));
    }
    if (vorlage.bilder >= 1) {
      kinder.push(form.zeile([
        { pfad: 'ausschnitt.zoom', label: 'Zoom', art: 'regler', min: 1, max: 3, schritt: 0.05 },
        { pfad: 'ausschnitt.x', label: 'Ausschnitt ← →', art: 'regler', min: 0, max: 100, schritt: 1 },
        { pfad: 'ausschnitt.y', label: 'Ausschnitt ↑ ↓', art: 'regler', min: 0, max: 100, schritt: 1 }
      ], basis));
    }

    kinder.push(form.zeile([
      { pfad: 'textPosition', label: 'Text-Position', art: 'auswahl', optionen: [
        { wert: 'oben', name: 'oben' }, { wert: 'mitte', name: 'Mitte' }, { wert: 'unten', name: 'unten' }
      ] },
      { pfad: 'ausrichtung', label: 'Ausrichtung', art: 'auswahl', optionen: [
        { wert: 'links', name: 'linksbündig' }, { wert: 'mitte', name: 'zentriert' }
      ] },
      { pfad: 'farbschema', label: 'Farbschema', art: 'auswahl', optionen: [
        { wert: 'marke', name: 'Markenfarbe' }, { wert: 'hell', name: 'hell' }, { wert: 'dunkel', name: 'dunkel' }
      ] }
    ], basis));
    kinder.push(form.hinweis('Platzhalter wie {Firmenname}, {Ort} oder {Telefon} werden in der Grafik automatisch ersetzt. Manche Vorlagen setzen Text-Position oder Ausrichtung selbst fest.'));
    return kinder;
  }

  /**
   * Baut die Gruppe "Grafik".
   * @param {Object} post
   * @returns {HTMLElement}
   */
  SM.ui.postFolien.baue = function (post) {
    var folie = post.folien[SM.ui.status.folienIndex] || post.folien[0];
    var titel = 'Grafik' + (post.folien.length > 1 ? ' – Karussell, Folie ' + (SM.ui.status.folienIndex + 1) + ' von ' + post.folien.length : '');
    return SM.ui.form.gruppe('p-grafik', titel, [folienLeiste(post)].concat(folienFelder(post, folie)), true);
  };
})();
