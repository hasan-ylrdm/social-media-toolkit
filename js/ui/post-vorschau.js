/* =====================================================================
   post-vorschau.js – Post-Editor: Live-Vorschau und PNG-Export
   ---------------------------------------------------------------------
   Zeigt die gewählte Folie so, wie sie ungefähr in der App aussieht:
     Feed-Formate  → nachgebauter Instagram-Feed (Kopf, Bild, Text)
     Story / Reel  → Handy-Rahmen im Hochformat
     Google        → Karte wie im Google-Unternehmensprofil
   Der Canvas in der Vorschau ist GENAU die Grafik, die exportiert wird
   (js/grafik/rendern.js). Die Umgebung ist nur nachgebaut – die echten
   Apps sehen je nach Version etwas anders aus.
   ===================================================================== */
(function () {
  'use strict';

  SM.ui.postVorschau = {};

  var teile = null;   // {post, canvas, caption, hinweis} der aktuell gezeigten Vorschau

  /**
   * Der Benutzername für die Vorschau: aus dem Instagram-Link, sonst aus
   * dem Firmennamen.
   * @param {Object} kunde
   * @returns {string}
   */
  function benutzername(kunde) {
    var link = String(kunde.kanaele.instagram.link || '').replace(/\/+$/, '');
    var ausLink = link.split('/').pop();
    return ausLink && link.indexOf('/') !== -1 ? ausLink : SM.helfer.slug(kunde.stamm.firmenname || 'betrieb').replace(/-/g, '');
  }

  /**
   * Kleines rundes Profilbild (Logo oder Anfangsbuchstabe).
   * @param {Object} kunde
   * @returns {HTMLElement}
   */
  function profilbild(kunde) {
    var el = SM.ui.dom.el;
    var logo = SM.grafik.logoVon(kunde);
    if (logo) {
      return el('img', { klasse: 'sm-vs-profil', src: logo.dataUrl, alt: '' });
    }
    return el('span', { klasse: 'sm-vs-profil', style: 'background:' + kunde.marke.farben.primaer, text: (kunde.stamm.firmenname || '?').charAt(0).toUpperCase() });
  }

  /**
   * Zeichnet Grafik und Text der Vorschau neu.
   */
  function zeichne() {
    if (!teile || !document.body.contains(teile.canvas)) {
      return;
    }
    var kunde = SM.zustand.kunde;
    var post = teile.post;
    var folie = post.folien[SM.ui.status.folienIndex] || post.folien[0];
    SM.grafik.zeichneFolie(teile.canvas, kunde, post, folie).catch(function (fehler) {
      console.error(fehler);
    });

    if (teile.caption) {
      var text = post.caption || '';
      var kurz = text.length > 125 ? text.slice(0, 125) + ' … mehr' : text;
      SM.ui.dom.leere(teile.caption);
      teile.caption.appendChild(SM.ui.dom.el('strong', { text: benutzername(kunde) + ' ' }));
      teile.caption.appendChild(document.createTextNode(kurz || '(noch keine Caption)'));
      if (!SM.helfer.istLeer(post.hashtags)) {
        teile.caption.appendChild(SM.ui.dom.el('span', { klasse: 'sm-vs-tags', text: ' ' + post.hashtags }));
      }
    }

    // Hinweis auf Platzhalter, die in der Grafik noch nicht ausgefüllt sind
    var offene = [];
    var texte = SM.grafik.texteFuer(kunde, folie);
    var vorlage = SM.grafik.hole(folie.vorlage);
    Object.keys(texte).forEach(function (platz) {
      if (vorlage && vorlage.plaetze[platz]) {
        offene = offene.concat(SM.platzhalter.offene(texte[platz]));
      }
    });
    teile.hinweis.textContent = offene.length > 0 ? 'In der Grafik noch auszufüllen: ' + offene.join(', ') : '';
  }

  /* Leicht verzögert, damit beim schnellen Tippen nicht jede Taste neu zeichnet */
  SM.ui.postVorschau.aktualisiere = SM.helfer.entprelle(zeichne, 120);

  /**
   * Die Export-Buttons unter der Vorschau.
   * @param {Object} post
   * @returns {HTMLElement}
   */
  function exportKnoepfe(post) {
    var knopf = SM.ui.dom.knopf;
    var kunde = SM.zustand.kunde;
    var mehrere = post.folien.length > 1;

    /** Meldet einen Export-Fehler. */
    function fehler(problem) {
      console.error(problem);
      SM.ui.dom.meldung('Export fehlgeschlagen: ' + problem.message, 'fehler');
    }

    var knoepfe = [
      knopf(mehrere ? 'Diese Folie als PNG' : 'Als PNG herunterladen', function () {
        var index = SM.ui.status.folienIndex;
        SM.grafik.folieAlsDataUrl(kunde, post, post.folien[index], 'image/png').then(function (dataUrl) {
          SM.helfer.ladeHerunter(SM.grafik.dateiname(kunde, post, index), SM.helfer.dataUrlZuBytes(dataUrl).bytes, 'image/png');
        }).catch(fehler);
      }, 'sm-knopf-haupt')
    ];
    if (mehrere) {
      knoepfe.push(knopf('Karussell als ZIP (' + post.folien.length + ' PNGs)', function () {
        SM.grafik.exportierePost(kunde, post).then(function (datei) {
          SM.helfer.ladeHerunter(datei.name, datei.bytes, datei.mime);
        }).catch(fehler);
      }, 'sm-knopf-zweit', 'Alle Folien als nummerierte PNG-Dateien in einer ZIP'));
    }
    knoepfe.push(knopf('Caption kopieren', function () {
      var text = post.caption + (SM.helfer.istLeer(post.hashtags) ? '' : '\n\n' + post.hashtags);
      SM.ui.dom.kopiere(text);
    }, 'sm-knopf-zweit', 'Caption und Hashtags in die Zwischenablage'));
    return SM.ui.dom.el('div', { klasse: 'sm-knopfreihe' }, knoepfe);
  }

  /**
   * Baut die Vorschau für einen Beitrag.
   * @param {Object} post
   * @returns {HTMLElement}
   */
  SM.ui.postVorschau.baue = function (post) {
    var el = SM.ui.dom.el;
    var kunde = SM.zustand.kunde;
    var format = SM.konfig.hole(SM.konfig.formate, post.format) || SM.konfig.formate[0];
    var canvas = el('canvas', { klasse: 'sm-vs-canvas', role: 'img', 'aria-label': 'Vorschau der Grafik' });
    var caption = el('p', { klasse: 'sm-vs-caption' });
    var hinweis = el('p', { klasse: 'sm-zu-lang', role: 'status' });
    var name = benutzername(kunde);
    var punkte = post.folien.length > 1
      ? el('div', { klasse: 'sm-vs-punkte' }, post.folien.map(function (folie, index) {
        return el('i', { klasse: index === SM.ui.status.folienIndex ? 'sm-vs-punkt-aktiv' : '' });
      }))
      : null;
    var rahmen;

    if (format.vorschau === 'story') {
      rahmen = el('div', { klasse: 'sm-vs sm-vs-story' }, [
        canvas,
        el('div', { klasse: 'sm-vs-story-kopf' }, [profilbild(kunde), el('strong', { text: name }), el('span', { text: format.id === 'reel-cover' ? 'Reel' : 'Story' })])
      ]);
      caption = null;
    } else if (format.vorschau === 'google') {
      rahmen = el('div', { klasse: 'sm-vs sm-vs-google' }, [
        el('div', { klasse: 'sm-vs-kopf' }, [profilbild(kunde), el('div', {}, [el('strong', { text: kunde.stamm.firmenname || 'Betrieb' }), el('br'), el('small', { text: 'Beitrag im Google-Unternehmensprofil' })])]),
        canvas,
        caption
      ]);
    } else {
      rahmen = el('div', { klasse: 'sm-vs sm-vs-feed' }, [
        el('div', { klasse: 'sm-vs-kopf' }, [profilbild(kunde), el('strong', { text: name })]),
        canvas,
        punkte,
        el('div', { klasse: 'sm-vs-aktionen', 'aria-hidden': 'true', text: '♡   ◯   ➤' }),
        caption
      ]);
    }

    teile = { post: post, canvas: canvas, caption: caption, hinweis: hinweis };
    // Erst zeichnen, wenn die Vorschau auf der Seite hängt: zeichne() prüft,
    // ob der Canvas im Dokument ist – das ist er erst nach diesem return.
    window.setTimeout(zeichne, 0);

    return el('div', { klasse: 'sm-vorschau-spalte' }, [
      el('p', { klasse: 'sm-hilfe', text: 'Vorschau: ' + format.name + ' · ' + format.breite + ' × ' + format.hoehe + ' px' }),
      rahmen,
      hinweis,
      exportKnoepfe(post)
    ]);
  };
})();
