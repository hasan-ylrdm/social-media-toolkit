/* =====================================================================
   zeichner.js – Werkzeugkasten zum Zeichnen auf dem Canvas
   ---------------------------------------------------------------------
   Jede Grafik-Vorlage bekommt einen "Zeichner" (kurz: z). Er kennt die
   Größe der Grafik, die Farben und Schriften des Kunden, die Texte und
   Fotos der Folie – und bietet einfache Zeichen-Funktionen.

   WICHTIG: Alle Maße sind RELATIV. Die Einheit z.e ist ein Hundertstel
   der Breite (bei 1080 px also 10,8 px). So passt jede Vorlage auf jedes
   Format. Nie feste Pixelwerte in Vorlagen schreiben!

   Die wichtigsten Angaben am Zeichner:
     z.b, z.h        Breite und Höhe in Pixel
     z.e             Einheit = Breite / 100
     z.rand          Seitenrand (7 Einheiten)
     z.oben, z.unten sicherer Bereich für Text (bei Story/Reel bleibt oben
                     und unten Platz für die Bedienelemente der App)
     z.farben        flaeche, schrift, betonung, aufBetonung, primaer, akzent
     z.texte         titel, untertitel, text, zusatz (Platzhalter ersetzt)
     z.bild, z.bild2 Fotos (oder null)   z.logoBild  Logo (oder null)
     z.folie, z.kunde, z.nummer, z.anzahl
   ===================================================================== */
(function () {
  'use strict';

  /**
   * Erzeugt den Zeichner für eine Grafik.
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} breite Pixel
   * @param {number} hoehe Pixel
   * @param {Object} daten {farben, schrift, texte, bild, bild2, logoBild, folie, kunde, nummer, anzahl}
   * @returns {Object} Zeichner (siehe Kopfkommentar)
   */
  SM.grafik.erzeugeZeichner = function (ctx, breite, hoehe, daten) {
    var e = breite / 100;
    var hochkant = hoehe / breite > 1.6;

    var z = {
      ctx: ctx, b: breite, h: hoehe, e: e, rand: 7 * e,
      hochkant: hochkant,
      oben: hochkant ? hoehe * 0.13 : 7 * e,
      unten: hochkant ? hoehe * 0.85 : hoehe - 7 * e,
      farben: daten.farben, schrift: daten.schrift, texte: daten.texte,
      bild: daten.bild, bild2: daten.bild2, logoBild: daten.logoBild,
      folie: daten.folie, kunde: daten.kunde, nummer: daten.nummer, anzahl: daten.anzahl
    };

    // Karussell: unten einen Streifen für die Seitenzahl ("2 / 5") frei halten,
    // damit sie keinen Text überdeckt. z.seitenzahlUnten merkt sich die alte Kante.
    z.seitenzahlUnten = z.unten;
    if (z.anzahl > 1) {
      z.unten -= 5 * e;
    }

    /**
     * Baut die Schrift-Angabe für den Canvas.
     * @param {Object} stil {groesse (Einheiten), art: 'ueberschrift'|'text', gewicht}
     * @param {number} faktor Verkleinerung (1 = normal)
     * @returns {{font: string, pixel: number}}
     */
    function schriftFuer(stil, faktor) {
      var ueberschrift = stil.art === 'ueberschrift';
      var pixel = Math.round((stil.groesse || 4) * e * faktor);
      var gewicht = stil.gewicht || (ueberschrift ? z.schrift.gewicht : '400');
      var familie = ueberschrift ? z.schrift.ueberschrift : z.schrift.text;
      return { font: gewicht + ' ' + pixel + 'px ' + familie, pixel: pixel };
    }

    /**
     * Bricht einen Text in Zeilen um, die in die Breite passen.
     * @param {string} text Zeilenumbrüche im Text bleiben erhalten
     * @param {number} maxBreite Pixel
     * @returns {string[]} Zeilen (ctx.font muss vorher gesetzt sein)
     */
    z.umbrechen = function (text, maxBreite) {
      var zeilen = [];
      String(text).split('\n').forEach(function (absatz) {
        var aktuelle = '';
        absatz.split(/\s+/).forEach(function (wort) {
          var versuch = aktuelle === '' ? wort : aktuelle + ' ' + wort;
          if (aktuelle !== '' && ctx.measureText(versuch).width > maxBreite) {
            zeilen.push(aktuelle);
            aktuelle = wort;
          } else {
            aktuelle = versuch;
          }
        });
        zeilen.push(aktuelle);
      });
      return zeilen;
    };

    /**
     * Füllt ein Rechteck (ohne Angaben: die ganze Grafik).
     * @param {string} farbe
     * @param {number} [x] @param {number} [y] @param {number} [b] @param {number} [h]
     */
    z.fuelle = function (farbe, x, y, b, h) {
      ctx.fillStyle = farbe;
      ctx.fillRect(x || 0, y || 0, b === undefined ? z.b : b, h === undefined ? z.h : h);
    };

    /**
     * Legt den Pfad eines Rechtecks mit runden Ecken an (ohne zu füllen).
     * @param {number} x @param {number} y @param {number} b @param {number} h
     * @param {number} radius Pixel
     */
    z.pfadRund = function (x, y, b, h, radius) {
      var r = Math.max(0, Math.min(radius || 0, b / 2, h / 2));
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + b, y, x + b, y + h, r);
      ctx.arcTo(x + b, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + b, y, r);
      ctx.closePath();
    };

    /**
     * Zeichnet ein gefülltes Rechteck mit runden Ecken.
     * @param {number} x @param {number} y @param {number} b @param {number} h
     * @param {number} radius Pixel
     * @param {string} farbe
     */
    z.rechteck = function (x, y, b, h, radius, farbe) {
      z.pfadRund(x, y, b, h, radius);
      ctx.fillStyle = farbe;
      ctx.fill();
    };

    /**
     * Zeichnet einen gefüllten Kreis.
     * @param {number} x Mittelpunkt @param {number} y Mittelpunkt
     * @param {number} radius Pixel
     * @param {string} farbe
     * @param {number} [deckkraft] 0–1
     */
    z.kreis = function (x, y, radius, farbe, deckkraft) {
      ctx.save();
      ctx.globalAlpha = deckkraft === undefined ? 1 : deckkraft;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(0, radius), 0, Math.PI * 2);   // nie negativ (sonst Fehler bei sehr flachen Formaten)
      ctx.fillStyle = farbe;
      ctx.fill();
      ctx.restore();
    };

    /**
     * Zeichnet ein Foto formatfüllend in ein Rechteck ("cover").
     * Der Ausschnitt (Zoom und Mittelpunkt) kommt aus der Folie.
     * Ohne Foto erscheint ein Platzhalter.
     * @param {HTMLImageElement|null} bild
     * @param {number} x @param {number} y @param {number} b @param {number} h
     * @param {number} [radius] runde Ecken in Pixel
     * @returns {boolean} true, wenn ein Foto gezeichnet wurde
     */
    z.foto = function (bild, x, y, b, h, radius) {
      ctx.save();
      z.pfadRund(x, y, b, h, radius || 0);
      ctx.clip();
      if (!bild) {
        ctx.fillStyle = SM.farben.mische(z.farben.flaeche, z.farben.schrift, 0.14);
        ctx.fillRect(x, y, b, h);
        ctx.fillStyle = SM.farben.mische(z.farben.flaeche, z.farben.schrift, 0.45);
        ctx.font = '600 ' + Math.round(3.2 * e) + 'px ' + z.schrift.text;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        // Der Bearbeitungshinweis gehört nur in die Vorschau, nicht in PNG, ZIP oder Freigabe
        if (!daten.fuerExport) {
          ctx.fillText('Foto wählen', x + b / 2, y + h / 2);
        }
        ctx.restore();
        return false;
      }
      var ausschnitt = z.folie.ausschnitt || { zoom: 1, x: 50, y: 50 };
      var bildB = bild.naturalWidth || bild.width;
      var bildH = bild.naturalHeight || bild.height;
      var massstab = Math.max(b / bildB, h / bildH) * Math.max(1, Number(ausschnitt.zoom) || 1);
      var quellB = b / massstab;
      var quellH = h / massstab;
      // Mittelpunkt in Prozent; so begrenzen, dass der Ausschnitt im Bild bleibt
      var quellX = Math.min(Math.max(bildB * (ausschnitt.x / 100) - quellB / 2, 0), bildB - quellB);
      var quellY = Math.min(Math.max(bildH * (ausschnitt.y / 100) - quellH / 2, 0), bildH - quellH);
      ctx.drawImage(bild, quellX, quellY, quellB, quellH, x, y, b, h);
      ctx.restore();
      return true;
    };

    /**
     * Legt einen dunklen Verlauf über einen Bereich, damit Text auf Fotos
     * lesbar bleibt.
     * @param {number} x @param {number} y @param {number} b @param {number} h
     * @param {number} obenStaerke Deckkraft am oberen Rand (0–1)
     * @param {number} untenStaerke Deckkraft am unteren Rand (0–1)
     */
    z.abdunkeln = function (x, y, b, h, obenStaerke, untenStaerke) {
      var verlauf = ctx.createLinearGradient(0, y, 0, y + h);
      verlauf.addColorStop(0, 'rgba(0,0,0,' + obenStaerke + ')');
      verlauf.addColorStop(1, 'rgba(0,0,0,' + untenStaerke + ')');
      ctx.fillStyle = verlauf;
      ctx.fillRect(x, y, b, h);
    };

    /**
     * Füllt die ganze Grafik: mit dem Foto der Folie (abgedunkelt, damit
     * weißer Text lesbar ist) oder – ohne Foto – mit der Flächenfarbe.
     * @param {number} obenStaerke Abdunklung oben (0–1)
     * @param {number} untenStaerke Abdunklung unten (0–1)
     * @returns {boolean} true = Foto liegt darunter (Text dann weiß schreiben)
     */
    z.vollbild = function (obenStaerke, untenStaerke) {
      if (!z.bild) {
        z.fuelle(z.farben.flaeche);
        return false;
      }
      z.foto(z.bild, 0, 0, z.b, z.h);
      z.abdunkeln(0, 0, z.b, z.h, obenStaerke, untenStaerke);
      return true;
    };

    /**
     * Schreibt Text (mit automatischem Umbruch) und gibt die Höhe zurück.
     * @param {string} text
     * @param {number} x linke Kante des Textbereichs
     * @param {number} y obere Kante
     * @param {number} breite Breite des Textbereichs
     * @param {Object} stil {groesse, farbe, art, gewicht, ausrichtung: 'links'|'mitte'|'rechts', zeilenhoehe, gross}
     * @param {number} [faktor] Verkleinerung
     * @param {boolean} [nurMessen] true = nichts zeichnen, nur Höhe liefern
     * @returns {number} Höhe in Pixel
     */
    z.schreibe = function (text, x, y, breite, stil, faktor, nurMessen) {
      var schrift = schriftFuer(stil, faktor || 1);
      var inhalt = stil.gross ? String(text).toUpperCase() : String(text);
      ctx.font = schrift.font;
      var zeilen = z.umbrechen(inhalt, breite);
      var zeilenhoehe = schrift.pixel * (stil.zeilenhoehe || (stil.art === 'ueberschrift' ? 1.14 : 1.38));
      if (!nurMessen) {
        ctx.fillStyle = stil.farbe || z.farben.schrift;
        ctx.textBaseline = 'top';
        var ausrichtung = stil.ausrichtung || 'links';
        ctx.textAlign = ausrichtung === 'mitte' ? 'center' : (ausrichtung === 'rechts' ? 'right' : 'left');
        var ankerX = ausrichtung === 'mitte' ? x + breite / 2 : (ausrichtung === 'rechts' ? x + breite : x);
        zeilen.forEach(function (zeile, index) {
          ctx.fillText(zeile, ankerX, y + index * zeilenhoehe + (zeilenhoehe - schrift.pixel) / 2);
        });
      }
      return zeilen.length * zeilenhoehe;
    };

    /**
     * Zeichnet eine "Pille": kurzer Text auf farbigem, rundem Hintergrund.
     * @param {string} text
     * @param {number} x linke Kante des Bereichs @param {number} y obere Kante
     * @param {number} breite Breite des Bereichs (für die Ausrichtung)
     * @param {Object} stil {groesse, ausrichtung, pilleFarbe, farbe}
     * @param {number} [faktor]
     * @param {boolean} [nurMessen]
     * @returns {number} Höhe in Pixel
     */
    z.pille = function (text, x, y, breite, stil, faktor, nurMessen) {
      var schrift = schriftFuer({ groesse: stil.groesse || 2.6, art: 'text', gewicht: '700' }, faktor || 1);
      var hoehe = schrift.pixel * 2;
      if (nurMessen) {
        return hoehe;
      }
      ctx.font = schrift.font;
      var inhalt = String(text).toUpperCase();
      var innen = Math.min(ctx.measureText(inhalt).width, breite - schrift.pixel * 1.6);
      var pillenBreite = innen + schrift.pixel * 1.6;
      var links = stil.ausrichtung === 'mitte' ? x + (breite - pillenBreite) / 2 : x;
      z.rechteck(links, y, pillenBreite, hoehe, hoehe / 2, stil.pilleFarbe || z.farben.betonung);
      ctx.fillStyle = stil.farbe || z.farben.aufBetonung;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillText(inhalt, links + pillenBreite / 2, y + hoehe / 2 + schrift.pixel * 0.04, innen);
      return hoehe;
    };

    /**
     * Setzt mehrere Text-Teile untereinander in einen Bereich. Leere Teile
     * werden übersprungen. Passt nicht alles hinein, wird die Schrift
     * schrittweise verkleinert.
     * @param {Array<Object>} teile je Teil:
     *   {text, groesse, farbe, art, gewicht, gross, abstand (Einheiten Abstand DAVOR),
     *    pille: true (als Pille zeichnen), linie: true (kurzer Strich statt Text)}
     * @param {Object} bereich {x, y, b, h, position: 'oben'|'mitte'|'unten', ausrichtung: 'links'|'mitte'}
     *   position und ausrichtung kommen ohne Angabe aus der Folie
     * @returns {{y: number, hoehe: number}} wo der Block gelandet ist
     */
    z.block = function (teile, bereich) {
      var position = bereich.position || z.folie.textPosition || 'unten';
      var ausrichtung = bereich.ausrichtung || z.folie.ausrichtung || 'links';
      var sichtbare = teile.filter(function (teil) {
        return teil.linie || !SM.helfer.istLeer(teil.text);
      });

      /* Zeichnet oder misst alle Teile ab startY mit einem Schrift-Faktor. */
      function durchlauf(startY, faktor, nurMessen) {
        var y = startY;
        sichtbare.forEach(function (teil, index) {
          if (index > 0) {
            y += (teil.abstand === undefined ? 2 : teil.abstand) * e * faktor;
          }
          var stil = { groesse: teil.groesse, farbe: teil.farbe, art: teil.art, gewicht: teil.gewicht,
            gross: teil.gross, zeilenhoehe: teil.zeilenhoehe, pilleFarbe: teil.pilleFarbe, ausrichtung: ausrichtung };
          if (teil.linie) {
            var linienBreite = 12 * e;
            if (!nurMessen) {
              z.fuelle(teil.farbe || z.farben.betonung,
                ausrichtung === 'mitte' ? bereich.x + (bereich.b - linienBreite) / 2 : bereich.x, y, linienBreite, 0.8 * e);
            }
            y += 0.8 * e;
          } else if (teil.pille) {
            y += z.pille(teil.text, bereich.x, y, bereich.b, stil, faktor, nurMessen);
          } else {
            y += z.schreibe(teil.text, bereich.x, y, bereich.b, stil, faktor, nurMessen);
          }
        });
        return y - startY;
      }

      var faktor = 1;
      var hoehe = durchlauf(0, faktor, true);
      while (hoehe > bereich.h && faktor > 0.5) {
        faktor -= 0.06;
        hoehe = durchlauf(0, faktor, true);
      }
      var startY = bereich.y;
      if (position === 'mitte') {
        startY = bereich.y + (bereich.h - hoehe) / 2;
      } else if (position === 'unten') {
        startY = bereich.y + bereich.h - hoehe;
      }
      startY = Math.max(startY, bereich.y);
      durchlauf(startY, faktor, false);
      return { y: startY, hoehe: hoehe };
    };

    /**
     * Zeichnet das Logo des Kunden in ein Feld (Seitenverhältnis bleibt).
     * Ohne Logo passiert nichts.
     * @param {number} x @param {number} y linke obere Ecke des Feldes
     * @param {number} maxB @param {number} maxH Größe des Feldes
     * @param {string} [anker] 'links' (Standard) | 'mitte' | 'rechts'
     * @param {boolean} [mitPlatte] true = weiße Platte dahinter (für Fotos)
     * @returns {boolean} true, wenn ein Logo gezeichnet wurde
     */
    z.logo = function (x, y, maxB, maxH, anker, mitPlatte) {
      var bild = z.logoBild;
      if (!bild) {
        return false;
      }
      var bildB = bild.naturalWidth || bild.width || 300;
      var bildH = bild.naturalHeight || bild.height || 300;
      var massstab = Math.min(maxB / bildB, maxH / bildH);
      var b = bildB * massstab;
      var h = bildH * massstab;
      var links = anker === 'mitte' ? x + (maxB - b) / 2 : (anker === 'rechts' ? x + maxB - b : x);
      if (mitPlatte) {
        z.rechteck(links - e, y - e, b + 2 * e, h + 2 * e, 1.2 * e, 'rgba(255,255,255,0.92)');
      }
      ctx.drawImage(bild, links, y, b, h);
      return true;
    };

    /**
     * Logo in der Ecke oben rechts (Standard-Platz in den Vorlagen).
     * @param {boolean} [mitPlatte] siehe z.logo
     */
    z.logoEcke = function (mitPlatte) {
      z.logo(z.b - z.rand - 16 * e, z.oben, 16 * e, 9 * e, 'rechts', mitPlatte);
    };

    /**
     * Schreibt bei Karussells "2 / 5" unten rechts. Bei einer einzelnen
     * Folie passiert nichts.
     */
    z.seitenzahl = function () {
      if (z.anzahl <= 1) {
        return;
      }
      var text = z.nummer + ' / ' + z.anzahl;
      var pixel = Math.round(2.4 * e);
      ctx.font = '700 ' + pixel + 'px ' + z.schrift.text;
      var breite = ctx.measureText(text).width + pixel * 1.4;
      var x = z.b - z.rand - breite;
      var y = z.seitenzahlUnten - pixel * 1.9;
      z.rechteck(x, y, breite, pixel * 1.9, pixel, 'rgba(0,0,0,0.45)');
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, x + breite / 2, y + pixel * 0.98);
    };

    return z;
  };
})();
