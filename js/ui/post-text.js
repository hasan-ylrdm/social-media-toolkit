/* =====================================================================
   post-text.js – Post-Editor: Caption und Hashtags
   ---------------------------------------------------------------------
   - Textbausteine (ohne KI): Vorschläge je Branche und Beitragsart aus
     js/konfig/textbausteine-*.js, Platzhalter werden ersetzt
   - Zeichenzähler mit den Grenzen der gewählten Kanäle
     (js/konfig/konstanten.js)
   - Hashtag-Sets: Branche, Ort und eigene Sets des Kunden
   - optional: KI-Assistent (js/ui/ki-dialog.js)
   ===================================================================== */
(function () {
  'use strict';

  SM.ui.postText = {};

  var zaehlerElement = null;   // Anzeige der Zeichenzähler (wird bei jeder Eingabe aufgefrischt)
  var aktuellerPost = null;

  /**
   * Baut den Text der Zähler und Hinweise für alle Kanäle des Beitrags.
   * @param {Object} post
   * @returns {HTMLElement[]} eine Zeile pro Kanal und ggf. Warnungen
   */
  function zaehlerZeilen(post) {
    var el = SM.ui.dom.el;
    var gesamt = (post.caption + (SM.helfer.istLeer(post.hashtags) ? '' : '\n\n' + post.hashtags)).length;
    var hashtagZahl = SM.konfig.zaehleHashtags(post.hashtags) + SM.konfig.zaehleHashtags(post.caption);
    var zeilen = post.kanaele.map(function (id) {
      var kanal = SM.konfig.hole(SM.konfig.kanaele, id);
      var laenge = id === 'google' ? post.caption.length : gesamt;
      var zuLang = laenge > kanal.grenze;
      var zuVieleTags = id !== 'google' && hashtagZahl > kanal.hashtagMax;
      return el('div', { klasse: zuLang || zuVieleTags ? 'sm-zu-lang' : '' }, [
        el('strong', { text: kanal.name + ': ' + laenge + ' / ' + kanal.grenze + ' Zeichen' }),
        id === 'google' ? ' (ohne Hashtags)' : ' · ' + hashtagZahl + ' Hashtags',
        el('br'),
        el('span', { text: kanal.hinweis })
      ]);
    });
    var offene = SM.platzhalter.offene(post.caption);
    if (offene.length > 0) {
      zeilen.push(el('div', { klasse: 'sm-zu-lang', text: 'Noch auszufüllen: ' + offene.join(', ') }));
    }
    return zeilen;
  }

  /**
   * Frischt die Zähler auf (nach jedem Tastendruck).
   */
  SM.ui.postText.aktualisiere = function () {
    if (!zaehlerElement || !aktuellerPost || !document.body.contains(zaehlerElement)) {
      return;
    }
    SM.ui.dom.leere(zaehlerElement);
    zaehlerZeilen(aktuellerPost).forEach(function (zeile) {
      zaehlerElement.appendChild(zeile);
    });
  };

  /**
   * Auswahl der fertigen Textbausteine.
   * @param {Object} post
   * @returns {HTMLElement}
   */
  function textbausteine(post) {
    var el = SM.ui.dom.el;
    var kunde = SM.zustand.kunde;
    var captions = SM.platzhalter.captions(kunde.stamm.branche, post.beitragsart);
    if (captions.length === 0) {
      return SM.ui.form.hinweis('Für diese Beitragsart gibt es noch keine Textbausteine.');
    }
    var auswahl = el('select', { id: 'baustein-auswahl' }, captions.map(function (text, index) {
      var kurz = SM.platzhalter.ersetze(text, kunde).replace(/\s+/g, ' ');
      return el('option', { value: String(index), text: (index + 1) + ': ' + kurz.slice(0, 70) + (kurz.length > 70 ? ' …' : '') });
    }));
    return el('div', { klasse: 'sm-zeile sm-zeile-unten' }, [
      el('div', { klasse: 'sm-feld' }, [
        el('label', { for: 'baustein-auswahl', text: 'Textbaustein (' + captions.length + ' Vorschläge für diese Beitragsart)' }),
        auswahl
      ]),
      SM.ui.dom.knopf('Einsetzen', function () {
        if (!SM.helfer.istLeer(post.caption) && !window.confirm('Die bisherige Caption wird ersetzt. Fortfahren?')) {
          return;
        }
        post.caption = SM.platzhalter.ersetze(captions[Number(auswahl.value)], kunde);
        if (post.status === 'idee') {
          post.status = 'entwurf';
        }
        SM.zustand.melde('struktur');
      }, 'sm-knopf-zweit')
    ]);
  }

  /**
   * Buttons, die Hashtag-Sets an das Hashtag-Feld anhängen.
   * @param {Object} post
   * @returns {HTMLElement}
   */
  function hashtagKnoepfe(post) {
    var kunde = SM.zustand.kunde;
    var knopf = SM.ui.dom.knopf;

    /** Hängt Hashtags an, ohne Doppelte. */
    function haengeAn(tags) {
      var vorhandene = String(post.hashtags || '').split(/\s+/).filter(Boolean);
      tags.forEach(function (tag) {
        if (vorhandene.indexOf(tag) === -1) {
          vorhandene.push(tag);
        }
      });
      post.hashtags = vorhandene.join(' ');
      SM.zustand.melde('struktur');
    }

    var knoepfe = [
      knopf('+ Branche', function () {
        haengeAn((SM.konfig.hashtags.branchen[kunde.stamm.branche] || SM.konfig.hashtags.branchen.allgemein).slice(0, 5));
      }, 'sm-knopf-mini', 'Die ersten 5 Hashtags der Branche anhängen'),
      knopf('+ Ort', function () {
        haengeAn(SM.konfig.ortsHashtags(kunde.stamm.ort));
      }, 'sm-knopf-mini', 'Hashtags für ' + (kunde.stamm.ort || 'den Ort') + ' anhängen')
    ];
    kunde.hashtagSets.forEach(function (set) {
      knoepfe.push(knopf('+ ' + (set.name || 'Set'), function () {
        haengeAn(String(set.tags || '').split(/\s+/).filter(Boolean));
      }, 'sm-knopf-mini', 'Eigenes Set anhängen: ' + set.tags));
    });
    knoepfe.push(knopf('Leeren', function () {
      post.hashtags = '';
      SM.zustand.melde('struktur');
    }, 'sm-knopf-mini sm-knopf-gefahr'));
    return SM.ui.dom.el('div', { klasse: 'sm-knopfreihe' }, knoepfe);
  }

  /**
   * Baut die Gruppe "Text".
   * @param {Object} post
   * @returns {HTMLElement}
   */
  SM.ui.postText.baue = function (post) {
    var el = SM.ui.dom.el;
    var form = SM.ui.form;
    var basis = { basis: 'posts.' + post.id };
    aktuellerPost = post;
    zaehlerElement = el('div', { klasse: 'sm-zaehler-block', role: 'status' }, zaehlerZeilen(post));

    return form.gruppe('p-text', 'Text (Caption) und Hashtags', [
      textbausteine(post),
      form.feld({ pfad: 'caption', label: 'Caption', art: 'langtext', zeilen: 8 }, basis),
      el('div', { klasse: 'sm-knopfreihe' }, [
        SM.ui.dom.knopf('Mit KI schreiben / umformulieren / kürzen', function () {
          SM.ui.ki.oeffne({
            aufgaben: ['caption', 'umformulieren', 'kuerzen', 'emojis-mehr', 'emojis-weniger'],
            eingabe: post.caption || post.titel,
            uebernehmen: function (text) {
              post.caption = text;
              SM.zustand.melde('struktur');
            }
          });
        }, 'sm-knopf-zweit sm-knopf-ki', 'Optional – braucht einen API-Key in den Einstellungen')
      ]),
      form.feld({ pfad: 'hashtags', label: 'Hashtags', art: 'langtext', zeilen: 2, hilfe: 'Eigene Sets legst du unter „Texte & Hashtags" an.' }, basis),
      hashtagKnoepfe(post),
      zaehlerElement
    ], true);
  };
})();
