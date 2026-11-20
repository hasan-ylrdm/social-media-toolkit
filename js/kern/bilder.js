/* =====================================================================
   bilder.js – Fotos verkleinern, komprimieren und zuschneiden (Canvas)
   ---------------------------------------------------------------------
   Läuft nur im Browser. Bilder werden als Data-URL im Projekt gespeichert
   (feld "dataUrl"), damit Speichern/Laden/Projektdatei einfach bleiben.

   Ablauf beim Hochladen:  Datei → Bild laden → auf MAX_KANTE verkleinern
   → als WebP speichern (Safari kann das nicht → automatisch JPEG).
   ===================================================================== */
(function () {
  'use strict';

  SM.bilder.MAX_KANTE = 1600;          // längste Seite in Pixel
  SM.bilder.QUALITAET = 0.82;          // 0–1, WebP/JPEG-Qualität
  SM.bilder.WARN_BYTES = 400 * 1024;   // ab hier warnt die Prüfliste

  /**
   * Liest eine Datei als Data-URL.
   * @param {File} datei
   * @returns {Promise<string>}
   */
  SM.bilder.dateiZuDataUrl = function (datei) {
    return new Promise(function (erfolg, fehler) {
      var leser = new FileReader();
      leser.onload = function () {
        erfolg(leser.result);
      };
      leser.onerror = function () {
        fehler(new Error('Datei konnte nicht gelesen werden: ' + datei.name));
      };
      leser.readAsDataURL(datei);
    });
  };

  /**
   * Lädt eine Bild-Quelle (Data-URL) in ein <img>-Element.
   * @param {string} quelle
   * @returns {Promise<HTMLImageElement>}
   */
  SM.bilder.ladeBild = function (quelle) {
    return new Promise(function (erfolg, fehler) {
      var bild = new Image();
      bild.onload = function () {
        erfolg(bild);
      };
      bild.onerror = function () {
        fehler(new Error('Das ist kein lesbares Bild.'));
      };
      bild.src = quelle;
    });
  };

  /**
   * Größe einer Data-URL in Bytes (ungefähre Dateigröße des Bildes).
   * @param {string} dataUrl
   * @returns {number}
   */
  SM.bilder.groesseVon = function (dataUrl) {
    var komma = dataUrl.indexOf(',');
    if (dataUrl.slice(0, komma).indexOf(';base64') === -1) {
      return dataUrl.length - komma - 1;
    }
    return Math.round(((dataUrl.length - komma - 1) * 3) / 4);
  };

  /**
   * Dateiendung passend zum Bildtyp einer Data-URL.
   * @param {string} dataUrl
   * @returns {string} "webp", "jpg", "png" oder "svg"
   */
  SM.bilder.dateiendung = function (dataUrl) {
    var typ = dataUrl.slice(5, dataUrl.indexOf(',')).split(';')[0];
    var tabelle = {
      'image/webp': 'webp',
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/svg+xml': 'svg',
      'image/gif': 'gif'
    };
    return tabelle[typ] || 'bin';
  };

  /**
   * Zeichnet einen Ausschnitt eines Bildes in ein neues Canvas.
   * @param {HTMLImageElement} bild
   * @param {{x, y, b, h}} quelle Ausschnitt im Originalbild (Pixel)
   * @param {number} zielBreite
   * @param {number} zielHoehe
   * @returns {HTMLCanvasElement}
   */
  function zeichne(bild, quelle, zielBreite, zielHoehe) {
    var canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(zielBreite));
    canvas.height = Math.max(1, Math.round(zielHoehe));
    var ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bild, quelle.x, quelle.y, quelle.b, quelle.h, 0, 0, canvas.width, canvas.height);
    return canvas;
  }

  /**
   * Speichert ein Canvas als WebP – oder als JPEG, wenn der Browser
   * kein WebP erzeugen kann (Safari).
   * @param {HTMLCanvasElement} canvas
   * @returns {string} Data-URL
   */
  function canvasZuDataUrl(canvas) {
    var webp = canvas.toDataURL('image/webp', SM.bilder.QUALITAET);
    if (webp.indexOf('data:image/webp') === 0) {
      return webp;
    }
    return canvas.toDataURL('image/jpeg', SM.bilder.QUALITAET);
  }

  /**
   * Verkleinert einen Bild-Ausschnitt so, dass die längste Seite höchstens
   * MAX_KANTE Pixel hat, und komprimiert ihn.
   * @param {HTMLImageElement} bild
   * @param {{x, y, b, h}} ausschnitt
   * @returns {{dataUrl: string, breite: number, hoehe: number, bytes: number}}
   */
  function verkleinere(bild, ausschnitt) {
    var faktor = Math.min(1, SM.bilder.MAX_KANTE / Math.max(ausschnitt.b, ausschnitt.h));
    var canvas = zeichne(bild, ausschnitt, ausschnitt.b * faktor, ausschnitt.h * faktor);
    var dataUrl = canvasZuDataUrl(canvas);
    return {
      dataUrl: dataUrl,
      breite: canvas.width,
      hoehe: canvas.height,
      bytes: SM.bilder.groesseVon(dataUrl)
    };
  }

  /**
   * Verarbeitet eine hochgeladene Datei zu einem Bild-Eintrag für den Kunden.
   * SVG-Dateien (z. B. Logos) bleiben unverändert.
   * @param {File} datei
   * @returns {Promise<Object>} {id, name, dataUrl, breite, hoehe, bytes, alt, bereich}
   */
  SM.bilder.verarbeiteDatei = function (datei) {
    var roheDataUrl;
    return SM.bilder.dateiZuDataUrl(datei)
      .then(function (dataUrl) {
        roheDataUrl = dataUrl;
        return SM.bilder.ladeBild(dataUrl);
      })
      .then(function (bild) {
        var ergebnis;
        if (datei.type === 'image/svg+xml') {
          ergebnis = {
            dataUrl: roheDataUrl,
            breite: bild.naturalWidth || 300,
            hoehe: bild.naturalHeight || 300,
            bytes: SM.bilder.groesseVon(roheDataUrl)
          };
        } else {
          ergebnis = verkleinere(bild, { x: 0, y: 0, b: bild.naturalWidth, h: bild.naturalHeight });
        }
        return {
          id: SM.helfer.neueId('bild'),
          name: datei.name.replace(/\.[^.]+$/, ''),
          dataUrl: ergebnis.dataUrl,
          breite: ergebnis.breite,
          hoehe: ergebnis.hoehe,
          bytes: ergebnis.bytes,
          alt: '',
          bereich: 'foto'
        };
      });
  };

  /**
   * Schneidet ein vorhandenes Bild zu.
   * @param {string} dataUrl Ausgangsbild
   * @param {{x, y, b, h}} ausschnitt in Pixeln des Ausgangsbildes
   * @returns {Promise<{dataUrl, breite, hoehe, bytes}>}
   */
  SM.bilder.schneideZu = function (dataUrl, ausschnitt) {
    return SM.bilder.ladeBild(dataUrl).then(function (bild) {
      return verkleinere(bild, ausschnitt);
    });
  };
})();
