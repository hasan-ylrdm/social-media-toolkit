/* =====================================================================
   ansicht-reels.js – Reel-Bibliothek
   ---------------------------------------------------------------------
   Reel-Ideen pro Branche mit Kurz-Drehbuch, Text-Einblendungen,
   Musik-Stimmung und Hinweis zum Filmen mit dem Handy.
   Die Ideen stehen in js/konfig/reels-1.js bis reels-4.js.
   Eine Idee lässt sich mit einem Klick als Beitrag einplanen.
   ===================================================================== */
(function () {
  'use strict';

  /**
   * Schreibt eine Reel-Idee als Text (zum Kopieren und für die Notiz).
   * @param {Object} idee
   * @returns {string}
   */
  function alsText(idee) {
    return [
      idee.titel,
      'Hook: ' + idee.hook,
      'Szenen: ' + idee.szenen.map(function (szene, index) {
        return (index + 1) + ') ' + szene;
      }).join('  '),
      'Text-Einblendungen: ' + idee.einblendungen.join(' | '),
      'Musik-Stimmung: ' + idee.musik,
      'Tipp: ' + idee.tipp
    ].join('\n');
  }

  /**
   * Legt aus einer Idee einen Reel-Beitrag an (in einer Woche, Status "Idee").
   * @param {Object} idee
   */
  function planeEin(idee) {
    var kunde = SM.zustand.kunde;
    var datum = SM.datum.plusTage(SM.datum.heute(), 7);
    var titel = SM.platzhalter.ersetze(idee.titel, kunde);
    var post = SM.planGenerator.bauePost(kunde, datum, 'reel', null, 0, { thema: titel });
    post.titel = 'Reel: ' + titel;
    post.notiz = SM.platzhalter.ersetze(alsText(idee), kunde);
    kunde.posts.push(post);
    SM.zustand.melde('struktur');
    SM.ui.dom.meldung('Als Beitrag am ' + SM.datum.formatTag(datum) + ' eingeplant. Das Drehbuch steht in der Notiz.');
  }

  /**
   * Baut die Karte für eine Idee.
   * @param {Object} idee
   * @param {number} index
   * @returns {HTMLElement}
   */
  function ideenKarte(idee, index) {
    var el = SM.ui.dom.el;
    var kunde = SM.zustand.kunde;
    var ersetze = function (text) {
      return SM.platzhalter.ersetze(text, kunde);
    };
    var kinder = [
      el('h3', { text: (index + 1) + '. ' + ersetze(idee.titel) }),
      el('p', {}, [el('strong', { text: 'Hook: ' }), ersetze(idee.hook)]),
      el('p', {}, [el('strong', { text: 'Kurz-Drehbuch:' })]),
      el('ol', {}, idee.szenen.map(function (szene) {
        return el('li', { text: ersetze(szene) });
      })),
      el('p', {}, [el('strong', { text: 'Text-Einblendungen: ' }), idee.einblendungen.map(ersetze).join(' · ')]),
      el('p', {}, [el('strong', { text: 'Musik-Stimmung: ' }), idee.musik]),
      el('p', {}, [el('strong', { text: 'Filmen mit dem Handy: ' }), ersetze(idee.tipp)])
    ];
    var knoepfe = [
      SM.ui.dom.knopf('Kopieren', function () {
        SM.ui.dom.kopiere(ersetze(alsText(idee)));
      }, 'sm-knopf-mini'),
      SM.ui.dom.knopf('Mit KI ausarbeiten', function () {
        SM.ui.ki.oeffne({ aufgaben: ['reel'], eingabe: ersetze(idee.titel) + ' – ' + ersetze(idee.hook) });
      }, 'sm-knopf-mini sm-knopf-ki', 'Optional – braucht einen API-Key')
    ];
    if (kunde) {
      knoepfe.unshift(SM.ui.dom.knopf('Als Beitrag einplanen', function () {
        planeEin(idee);
      }, 'sm-knopf-mini sm-knopf-haupt'));
    }
    kinder.push(el('div', { klasse: 'sm-knopfreihe' }, knoepfe));
    return el('article', { klasse: 'sm-kasten sm-reel' }, kinder);
  }

  SM.ui.ansichten.reels = {
    titel: 'Reels',
    brauchtKunde: false,

    /**
     * Zeichnet die Reel-Bibliothek.
     * @param {HTMLElement} behaelter
     */
    zeichne: function (behaelter) {
      var el = SM.ui.dom.el;
      var status = SM.ui.status;
      var kunde = SM.zustand.kunde;
      if (!status.reelBranche) {
        status.reelBranche = kunde ? kunde.stamm.branche : 'allgemein';
      }

      var wahl = el('select', { id: 'reel-branche' }, SM.konfig.branchen.map(function (branche) {
        return el('option', { value: branche.id, text: branche.name + ' (' + SM.konfig.reelIdeenFuer(branche.id).length + ' Ideen)' });
      }));
      wahl.value = status.reelBranche;
      wahl.addEventListener('change', function () {
        status.reelBranche = wahl.value;
        SM.ui.app.zeichneNeu();
      });

      behaelter.appendChild(el('div', { klasse: 'sm-kalender-leiste' }, [
        el('div', { klasse: 'sm-feld' }, [el('label', { for: 'reel-branche', text: 'Branche' }), wahl]),
        el('span', { klasse: 'sm-luecke' }),
        SM.ui.dom.knopf('Eigenes Reel-Drehbuch mit KI', function () {
          SM.ui.ki.oeffne({ aufgaben: ['reel'] });
        }, 'sm-knopf-zweit sm-knopf-ki', 'Optional – braucht einen API-Key')
      ]));

      behaelter.appendChild(SM.ui.form.gruppe('reel-tipps', 'Grundregeln: Filmen mit dem Handy', [
        el('ul', {}, SM.konfig.reelFilmTipps.map(function (tipp) {
          return el('li', { text: tipp });
        }))
      ], false));

      var raster = el('div', { klasse: 'sm-raster-2' });
      SM.konfig.reelIdeenFuer(status.reelBranche).forEach(function (idee, index) {
        raster.appendChild(ideenKarte(idee, index));
      });
      behaelter.appendChild(raster);
    }
  };
})();
