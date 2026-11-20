/* =====================================================================
   rendern.js – eine Folie auf den Canvas bringen und als PNG ausgeben
   ---------------------------------------------------------------------
   Ablauf für eine Folie:
     1. Format des Posts bestimmt die Größe (js/konfig/konstanten.js)
     2. Farben aus der Marke des Kunden + Farbschema der Folie
     3. Platzhalter in den Texten ersetzen
     4. Fotos und Logo laden (asynchron, mit Zwischenspeicher)
     5. Vorlage zeichnet (js/grafik/vorlagen-*.js)

   Dieselbe Funktion zeichnet Vorschau UND Export – was ich im Editor
   sehe, ist genau das PNG.
   ===================================================================== */
(function () {
  'use strict';

  var bildSpeicher = {};   // Zwischenspeicher: Schlüssel → Promise<HTMLImageElement>

  /**
   * Berechnet die Farben einer Grafik aus der Marke und dem Farbschema.
   * @param {Object} kunde
   * @param {string} farbschema 'marke' | 'hell' | 'dunkel'
   * @returns {Object} {primaer, akzent, flaeche, schrift, betonung, aufBetonung}
   */
  SM.grafik.farbenFuer = function (kunde, farbschema) {
    var marke = kunde.marke.farben;
    var flaeche;
    var betonung;
    if (farbschema === 'hell') {
      flaeche = marke.hintergrund;
      betonung = marke.primaer;
    } else if (farbschema === 'dunkel') {
      flaeche = SM.farben.leuchtdichte(marke.text) < 0.2 ? marke.text : '#14171f';
      betonung = marke.akzent;
    } else {
      flaeche = marke.primaer;
      betonung = marke.akzent;
    }
    // Hebt sich die Betonung nicht von der Fläche ab, nehmen wir die andere Markenfarbe
    if (SM.farben.kontrast(flaeche, betonung) < 1.5) {
      betonung = SM.farben.kontrast(flaeche, marke.primaer) >= 1.5 ? marke.primaer : SM.farben.besteTextfarbe(flaeche);
    }
    var schrift = SM.farben.besteTextfarbe(flaeche);
    // Auf hellen Flächen die Textfarbe der Marke verwenden, wenn sie gut lesbar ist
    if (schrift === '#000000' && SM.farben.kontrast(flaeche, marke.text) >= 4.5) {
      schrift = marke.text;
    }
    return {
      primaer: marke.primaer,
      akzent: marke.akzent,
      flaeche: flaeche,
      schrift: schrift,
      betonung: betonung,
      aufBetonung: SM.farben.besteTextfarbe(betonung)
    };
  };

  /**
   * Die vier Texte einer Folie mit ersetzten Platzhaltern.
   * @param {Object} kunde
   * @param {Object} folie
   * @returns {{titel: string, untertitel: string, text: string, zusatz: string}}
   */
  SM.grafik.texteFuer = function (kunde, folie) {
    var texte = {};
    ['titel', 'untertitel', 'text', 'zusatz'].forEach(function (platz) {
      texte[platz] = SM.platzhalter.ersetze(folie.texte[platz], kunde);
    });
    return texte;
  };

  /**
   * Sucht das Logo eines Kunden (erstes Bild mit Bereich "logo").
   * @param {Object} kunde
   * @returns {Object|null} Bild-Eintrag
   */
  SM.grafik.logoVon = function (kunde) {
    for (var i = 0; i < kunde.bilder.length; i += 1) {
      if (kunde.bilder[i].bereich === 'logo') {
        return kunde.bilder[i];
      }
    }
    return null;
  };

  /**
   * Lädt ein Bild des Kunden als <img> (mit Zwischenspeicher).
   * @param {Object} kunde
   * @param {string} bildId
   * @returns {Promise<HTMLImageElement|null>} null, wenn es das Bild nicht gibt
   */
  SM.grafik.ladeKundenBild = function (kunde, bildId) {
    var eintrag = SM.konfig.hole(kunde.bilder, bildId);
    if (!eintrag || !eintrag.dataUrl) {
      return Promise.resolve(null);
    }
    // Länge der Data-URL gehört zum Schlüssel: nach einem Zuschnitt ändert sie sich
    var schluessel = eintrag.id + ':' + eintrag.dataUrl.length;
    if (!bildSpeicher[schluessel]) {
      bildSpeicher[schluessel] = SM.bilder.ladeBild(eintrag.dataUrl).catch(function () {
        return null;
      });
    }
    return bildSpeicher[schluessel];
  };

  /**
   * Zeichnet eine Folie auf einen Canvas (setzt auch dessen Größe).
   * @param {HTMLCanvasElement} canvas
   * @param {Object} kunde
   * @param {Object} post
   * @param {Object} folie eine Folie aus post.folien
   * @param {boolean} [fuerExport] true = ohne Bearbeitungshinweise wie "Foto wählen"
   * @returns {Promise<HTMLCanvasElement>}
   */
  SM.grafik.zeichneFolie = function (canvas, kunde, post, folie, fuerExport) {
    var format = SM.konfig.hole(SM.konfig.formate, post.format) || SM.konfig.formate[0];
    var vorlage = SM.grafik.hole(folie.vorlage) || SM.grafik.alle()[0];
    var logo = SM.grafik.logoVon(kunde);

    return Promise.all([
      SM.grafik.ladeKundenBild(kunde, folie.bildId),
      SM.grafik.ladeKundenBild(kunde, folie.bildId2),
      logo ? SM.grafik.ladeKundenBild(kunde, logo.id) : Promise.resolve(null)
    ]).then(function (bilder) {
      canvas.width = format.breite;
      canvas.height = format.hoehe;
      var ctx = canvas.getContext('2d');
      var zeichner = SM.grafik.erzeugeZeichner(ctx, format.breite, format.hoehe, {
        farben: SM.grafik.farbenFuer(kunde, folie.farbschema),
        schrift: SM.konfig.holeSchrift(kunde.marke.schriftpaar) || SM.konfig.schriften[0],
        texte: SM.grafik.texteFuer(kunde, folie),
        bild: bilder[0],
        bild2: bilder[1],
        logoBild: bilder[2],
        folie: folie,
        kunde: kunde,
        nummer: post.folien.indexOf(folie) + 1,
        anzahl: post.folien.length,
        fuerExport: fuerExport === true
      });
      ctx.clearRect(0, 0, format.breite, format.hoehe);
      vorlage.zeichne(zeichner);
      return canvas;
    });
  };

  /**
   * Erzeugt das Bild einer Folie als Data-URL.
   * @param {Object} kunde
   * @param {Object} post
   * @param {Object} folie
   * @param {string} [mime] 'image/png' (Standard, volle Größe) oder 'image/jpeg' (klein, für Dokumente)
   * @param {number} [maxBreite] nur bei JPEG: auf diese Breite verkleinern
   * @returns {Promise<string>} Data-URL
   */
  SM.grafik.folieAlsDataUrl = function (kunde, post, folie, mime, maxBreite) {
    var canvas = document.createElement('canvas');
    return SM.grafik.zeichneFolie(canvas, kunde, post, folie, true).then(function () {
      if (mime !== 'image/jpeg' || !maxBreite || canvas.width <= maxBreite) {
        return canvas.toDataURL(mime || 'image/png', 0.85);
      }
      var klein = document.createElement('canvas');
      klein.width = maxBreite;
      klein.height = Math.round(canvas.height * maxBreite / canvas.width);
      klein.getContext('2d').drawImage(canvas, 0, 0, klein.width, klein.height);
      return klein.toDataURL('image/jpeg', 0.85);
    });
  };

  /**
   * Schlägt den Dateinamen für das PNG einer Folie vor.
   * @param {Object} kunde
   * @param {Object} post
   * @param {number} index Nummer der Folie, ab 0
   * @returns {string} z. B. "2026-11-05_cafe-muster_angebot_1.png"
   */
  SM.grafik.dateiname = function (kunde, post, index) {
    var teile = [post.datum || 'ohne-datum', SM.helfer.slug(kunde.stamm.firmenname || 'kunde'), SM.helfer.slug(post.beitragsart || 'post')];
    if (post.folien.length > 1) {
      teile.push(String(index + 1));
    }
    return teile.join('_') + '.png';
  };

  /**
   * Erzeugt alle Folien mehrerer Posts als PNG-Dateien.
   * @param {Object} kunde
   * @param {Array<Object>} posts
   * @returns {Promise<Array<{pfad: string, bytes: Uint8Array}>>}
   */
  SM.grafik.pngDateien = function (kunde, posts) {
    var dateien = [];
    var kette = Promise.resolve();
    posts.forEach(function (post) {
      post.folien.forEach(function (folie, index) {
        kette = kette.then(function () {
          return SM.grafik.folieAlsDataUrl(kunde, post, folie, 'image/png');
        }).then(function (dataUrl) {
          var name = SM.grafik.dateiname(kunde, post, index);
          // Gleiche Namen (zwei Posts gleicher Art am selben Tag) eindeutig machen
          var schonDa = dateien.filter(function (datei) {
            return datei.pfad === name;
          }).length > 0;
          dateien.push({
            pfad: schonDa ? name.replace(/\.png$/, '_' + post.id.slice(-4) + '.png') : name,
            bytes: SM.helfer.dataUrlZuBytes(dataUrl).bytes
          });
        });
      });
    });
    return kette.then(function () {
      return dateien;
    });
  };

  /**
   * Exportiert einen Post: eine Folie → eine PNG-Datei, mehrere Folien →
   * nummerierte PNGs in einer ZIP-Datei.
   * @param {Object} kunde
   * @param {Object} post
   * @returns {Promise<{name: string, bytes: Uint8Array, mime: string}>}
   */
  SM.grafik.exportierePost = function (kunde, post) {
    return SM.grafik.pngDateien(kunde, [post]).then(function (dateien) {
      if (dateien.length === 1) {
        return { name: dateien[0].pfad, bytes: dateien[0].bytes, mime: 'image/png' };
      }
      return {
        name: SM.grafik.dateiname(kunde, post, 0).replace(/_1\.png$/, '') + '_karussell.zip',
        bytes: SM.zip.erzeuge(dateien),
        mime: 'application/zip'
      };
    });
  };
})();
