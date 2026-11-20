/* =====================================================================
   kunden-fotos.js – Logo und Fotos eines Kunden hochladen und verwalten
   ---------------------------------------------------------------------
   Hochladen per Klick oder Drag & Drop, mehrere auf einmal. Die Bilder
   werden automatisch verkleinert und komprimiert (js/kern/bilder.js).
   Jedes Bild hat einen Bereich: "logo" (wird in den Grafiken als Logo
   verwendet – das erste gewinnt) oder "foto".
   Der Zuschnitt für eine Grafik passiert NICHT hier, sondern pro Folie
   im Post-Editor (Zoom und Ausschnitt), damit das Original erhalten bleibt.
   ===================================================================== */
(function () {
  'use strict';

  SM.ui.kundenFotos = {};

  /**
   * Verarbeitet hochgeladene Dateien und hängt sie an den Kunden.
   * @param {FileList|Array<File>} dateien
   * @param {string} bereich 'logo' oder 'foto'
   */
  function ladeHoch(dateien, bereich) {
    var bilder = Array.prototype.filter.call(dateien, function (datei) {
      return datei.type.indexOf('image/') === 0;
    });
    if (bilder.length === 0) {
      SM.ui.dom.meldung('Das waren keine Bilddateien.', 'fehler');
      return;
    }
    var kunde = SM.zustand.kunde;
    var kette = Promise.resolve();
    bilder.forEach(function (datei) {
      kette = kette.then(function () {
        return SM.bilder.verarbeiteDatei(datei);
      }).then(function (bild) {
        bild.bereich = bereich;
        kunde.bilder.push(bild);
      }).catch(function () {
        SM.ui.dom.meldung('„' + datei.name + '" konnte nicht gelesen werden.', 'fehler');
      });
    });
    kette.then(function () {
      SM.zustand.melde('struktur');
      SM.ui.dom.meldung(bilder.length === 1 ? 'Bild hinzugefügt.' : bilder.length + ' Bilder hinzugefügt.');
    });
  }

  /**
   * Baut eine Ablagefläche zum Hochladen.
   * @param {string} text Beschriftung
   * @param {string} bereich 'logo' oder 'foto'
   * @param {boolean} mehrere mehrere Dateien erlauben
   * @returns {HTMLElement}
   */
  function ablage(text, bereich, mehrere) {
    var el = SM.ui.dom.el;
    var eingabe = el('input', { type: 'file', accept: 'image/*', multiple: mehrere, klasse: 'sm-versteckt', id: 'upload-' + bereich });
    eingabe.addEventListener('change', function () {
      ladeHoch(eingabe.files, bereich);
      eingabe.value = '';
    });
    var flaeche = el('label', { klasse: 'sm-ablage', for: 'upload-' + bereich }, [text, eingabe]);
    flaeche.addEventListener('dragover', function (ereignis) {
      ereignis.preventDefault();
      flaeche.classList.add('sm-ablage-aktiv');
    });
    flaeche.addEventListener('dragleave', function () {
      flaeche.classList.remove('sm-ablage-aktiv');
    });
    flaeche.addEventListener('drop', function (ereignis) {
      ereignis.preventDefault();
      flaeche.classList.remove('sm-ablage-aktiv');
      ladeHoch(ereignis.dataTransfer.files, bereich);
    });
    return flaeche;
  }

  /**
   * Entfernt ein Bild und leert alle Verweise darauf in den Folien.
   * @param {Object} bild
   */
  function loesche(bild) {
    var kunde = SM.zustand.kunde;
    kunde.bilder.splice(kunde.bilder.indexOf(bild), 1);
    kunde.posts.forEach(function (post) {
      post.folien.forEach(function (folie) {
        if (folie.bildId === bild.id) {
          folie.bildId = '';
        }
        if (folie.bildId2 === bild.id) {
          folie.bildId2 = '';
        }
      });
    });
    SM.zustand.melde('struktur');
  }

  /**
   * Baut die Karte für ein Bild.
   * @param {Object} bild
   * @returns {HTMLElement}
   */
  function bildKarte(bild) {
    var el = SM.ui.dom.el;
    return el('div', { klasse: 'sm-foto' }, [
      el('img', { src: bild.dataUrl, alt: bild.alt || bild.name }),
      el('div', { klasse: 'sm-foto-daten' }, [
        SM.ui.form.feld({ pfad: 'alt', label: 'Beschreibung', art: 'text', platzhalter: 'Was ist zu sehen?' }, { basis: 'bilder.' + bild.id }),
        SM.ui.form.feld({ pfad: 'bereich', label: 'Verwendung', art: 'auswahl', optionen: [
          { wert: 'foto', name: 'Foto' }, { wert: 'logo', name: 'Logo' }
        ] }, { basis: 'bilder.' + bild.id, quelle: 'struktur' }),
        el('p', { klasse: 'sm-foto-info', text: bild.breite + ' × ' + bild.hoehe + ' px · ' + SM.helfer.formatBytes(bild.bytes) }),
        SM.ui.dom.knopf('Löschen', function () {
          if (window.confirm('Dieses Bild wirklich löschen? Es wird auch aus allen Grafiken entfernt.')) {
            loesche(bild);
          }
        }, 'sm-knopf-zweit sm-knopf-gefahr')
      ])
    ]);
  }

  /**
   * Baut den ganzen Bereich "Logo und Fotos".
   * @returns {HTMLElement}
   */
  SM.ui.kundenFotos.baue = function () {
    var el = SM.ui.dom.el;
    var kunde = SM.zustand.kunde;
    var kinder = [
      el('div', { klasse: 'sm-zeile' }, [
        ablage('Logo hierher ziehen oder klicken (PNG mit durchsichtigem Hintergrund oder SVG)', 'logo', false),
        ablage('Fotos hierher ziehen oder klicken (mehrere möglich)', 'foto', true)
      ]),
      SM.ui.form.hinweis('Fotos von Personen nur mit Einwilligung verwenden. Eine Vorlage dafür gibt es unter „Strategie → Einwilligung für Fotos".', 'warnung')
    ];
    if (kunde.bilder.length === 0) {
      kinder.push(el('p', { klasse: 'sm-leer', text: 'Noch keine Bilder.' }));
    }
    kunde.bilder.forEach(function (bild) {
      kinder.push(bildKarte(bild));
    });
    return el('div', {}, kinder);
  };
})();
