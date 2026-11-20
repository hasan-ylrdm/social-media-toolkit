/* =====================================================================
   vorlagen-1.js – Grafik-Vorlagen: Angebot, Neuigkeit, Zitat,
   Vorher/Nachher, Team, Öffnungszeiten
   ---------------------------------------------------------------------
   MUSTER und Regeln für neue Vorlagen: js/grafik/vorlagen-register.js
   Zeichen-Funktionen (z.block, z.foto …): js/grafik/zeichner.js
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- Angebot / Aktion ---------- */
  SM.grafik.registriere({
    id: 'angebot', name: 'Angebot / Aktion', bilder: 1,
    plaetze: { untertitel: 'Dachzeile (z. B. „Aktion")', titel: 'Angebot', text: 'Beschreibung', zusatz: 'Gültigkeit' },
    zeichne: function (z) {
      var f = z.farben;
      var textOben = z.oben + 12 * z.e;
      z.fuelle(f.flaeche);
      if (z.bild) {
        var fotoHoehe = z.h * 0.46;
        z.foto(z.bild, 0, 0, z.b, fotoHoehe);
        textOben = fotoHoehe + 5 * z.e;
      } else {
        z.kreis(0, 0, 24 * z.e, f.betonung, 0.22);
        z.kreis(z.b, z.h, 30 * z.e, f.betonung, 0.16);
      }
      z.block([
        { text: z.texte.untertitel, pille: true },
        { text: z.texte.titel, groesse: 10, art: 'ueberschrift', abstand: 3 },
        { text: z.texte.text, groesse: 3.8, abstand: 3 },
        { linie: !SM.helfer.istLeer(z.texte.zusatz), abstand: 3 },
        { text: z.texte.zusatz, groesse: 3.1, gewicht: '700', abstand: 2 }
      ], { x: z.rand, y: textOben, b: z.b - 2 * z.rand, h: z.unten - textOben, position: z.bild ? 'mitte' : undefined });
      z.logoEcke(!!z.bild);
      z.seitenzahl();
    }
  });

  /* ---------- Neuigkeit ---------- */
  SM.grafik.registriere({
    id: 'neuigkeit', name: 'Neuigkeit', bilder: 1,
    plaetze: { untertitel: 'Dachzeile', titel: 'Überschrift', text: 'Text' },
    zeichne: function (z) {
      var aufFoto = z.vollbild(0.25, 0.78);
      var farbe = aufFoto ? '#ffffff' : z.farben.schrift;
      var einzug = aufFoto ? 0 : 3 * z.e;
      if (!aufFoto) {
        z.fuelle(z.farben.betonung, 0, 0, 2.2 * z.e, z.h);
      }
      var oben = z.oben + 12 * z.e;
      z.block([
        { text: z.texte.untertitel, pille: true },
        { text: z.texte.titel, groesse: 9, art: 'ueberschrift', farbe: farbe, abstand: 3 },
        { text: z.texte.text, groesse: 3.9, farbe: farbe, abstand: 3 }
      ], { x: z.rand + einzug, y: oben, b: z.b - 2 * z.rand - einzug, h: z.unten - oben });
      z.logoEcke(aufFoto);
      z.seitenzahl();
    }
  });

  /* ---------- Zitat / Kundenstimme ---------- */
  SM.grafik.registriere({
    id: 'zitat', name: 'Zitat / Kundenstimme', bilder: 1,
    plaetze: { text: 'Zitat', zusatz: 'Name', untertitel: 'Zusatz (z. B. „Stammkundin")' },
    zeichne: function (z) {
      var f = z.farben;
      z.fuelle(f.flaeche);
      // Großes Anführungszeichen als Schmuck
      z.schreibe('”', z.rand, z.oben + 2 * z.e, z.b - 2 * z.rand,
        { groesse: 30, art: 'ueberschrift', farbe: f.betonung, zeilenhoehe: 1 });
      var oben = z.oben + 24 * z.e;
      var fotoGroesse = 16 * z.e;
      var unten = z.bild ? z.unten - fotoGroesse - 4 * z.e : z.unten;
      z.block([
        { text: z.texte.text, groesse: 5.6, art: 'ueberschrift', zeilenhoehe: 1.3 },
        { linie: !z.bild && !SM.helfer.istLeer(z.texte.zusatz), abstand: 4 },
        { text: z.bild ? '' : z.texte.zusatz, groesse: 3.4, gewicht: '700', abstand: 2.5 },
        { text: z.bild ? '' : z.texte.untertitel, groesse: 2.9, abstand: 0.8 }
      ], { x: z.rand, y: oben, b: z.b - 2 * z.rand, h: unten - oben, position: 'mitte' });
      if (z.bild) {
        // Rundes Foto mit Name daneben
        var fotoY = z.unten - fotoGroesse;
        z.foto(z.bild, z.rand, fotoY, fotoGroesse, fotoGroesse, fotoGroesse / 2);
        z.block([
          { text: z.texte.zusatz, groesse: 3.6, gewicht: '700' },
          { text: z.texte.untertitel, groesse: 2.9, abstand: 0.8 }
        ], { x: z.rand + fotoGroesse + 4 * z.e, y: fotoY, b: z.b - 2 * z.rand - fotoGroesse - 4 * z.e, h: fotoGroesse,
          position: 'mitte', ausrichtung: 'links' });
      }
      z.logoEcke();
      z.seitenzahl();
    }
  });

  /* ---------- Vorher / Nachher ---------- */
  SM.grafik.registriere({
    id: 'vorher-nachher', name: 'Vorher / Nachher', bilder: 2,
    plaetze: { titel: 'Überschrift', untertitel: 'Beschriftungen, mit | getrennt (leer = Vorher | Nachher)', zusatz: 'Fußzeile' },
    zeichne: function (z) {
      var f = z.farben;
      var e = z.e;
      z.fuelle(f.flaeche);
      var beschriftung = (SM.helfer.istLeer(z.texte.untertitel) ? 'Vorher | Nachher' : z.texte.untertitel).split('|');
      var kopfHoehe = SM.helfer.istLeer(z.texte.titel) ? 12 * e : 20 * e;
      var fussHoehe = SM.helfer.istLeer(z.texte.zusatz) ? 0 : 8 * e;
      var fotoOben = z.oben + kopfHoehe;
      var fotoHoehe = z.unten - fussHoehe - fotoOben;
      var luecke = 1.6 * e;
      var felder;
      if (z.hochkant) {
        // Story: untereinander
        var halbeHoehe = (fotoHoehe - luecke) / 2;
        felder = [
          { x: z.rand, y: fotoOben, b: z.b - 2 * z.rand, h: halbeHoehe },
          { x: z.rand, y: fotoOben + halbeHoehe + luecke, b: z.b - 2 * z.rand, h: halbeHoehe }
        ];
      } else {
        // Feed: nebeneinander
        var halbeBreite = (z.b - 2 * z.rand - luecke) / 2;
        felder = [
          { x: z.rand, y: fotoOben, b: halbeBreite, h: fotoHoehe },
          { x: z.rand + halbeBreite + luecke, y: fotoOben, b: halbeBreite, h: fotoHoehe }
        ];
      }
      [z.bild, z.bild2].forEach(function (bild, index) {
        var feld = felder[index];
        z.foto(bild, feld.x, feld.y, feld.b, feld.h, 2 * e);
        z.pille((beschriftung[index] || '').trim() || (index === 0 ? 'Vorher' : 'Nachher'),
          feld.x + 2 * e, feld.y + 2 * e, feld.b - 4 * e, { groesse: 2.4 });
      });
      z.block([{ text: z.texte.titel, groesse: 6.5, art: 'ueberschrift' }],
        { x: z.rand, y: z.oben, b: z.b - 2 * z.rand - 18 * e, h: kopfHoehe - 3 * e, position: 'mitte', ausrichtung: 'links' });
      z.block([{ text: z.texte.zusatz, groesse: 3.1, gewicht: '700' }],
        { x: z.rand, y: z.unten - fussHoehe + 2 * e, b: z.b - 2 * z.rand, h: fussHoehe, position: 'mitte' });
      z.logoEcke();
      z.seitenzahl();
    }
  });

  /* ---------- Team-Vorstellung ---------- */
  SM.grafik.registriere({
    id: 'team', name: 'Team-Vorstellung', bilder: 1,
    plaetze: { untertitel: 'Dachzeile (z. B. „Unser Team")', titel: 'Name', text: 'Kurztext', zusatz: 'Zusatz (z. B. „Im Team seit 2019")' },
    zeichne: function (z) {
      var f = z.farben;
      var fotoHoehe = z.h * (z.hochkant ? 0.5 : 0.56);
      z.fuelle(f.flaeche);
      z.foto(z.bild, 0, 0, z.b, fotoHoehe);
      z.fuelle(f.betonung, 0, fotoHoehe, z.b, 1.2 * z.e);
      var oben = fotoHoehe + 5 * z.e;
      z.block([
        { text: z.texte.untertitel, pille: true },
        { text: z.texte.titel, groesse: 8, art: 'ueberschrift', abstand: 2.5 },
        { text: z.texte.text, groesse: 3.6, abstand: 2 },
        { text: z.texte.zusatz, groesse: 3, gewicht: '700', abstand: 2 }
      ], { x: z.rand, y: oben, b: z.b - 2 * z.rand, h: z.unten - oben, position: 'mitte' });
      z.logoEcke(true);
      z.seitenzahl();
    }
  });

  /**
   * Schreibt die Zeiten eines Tages als Text.
   * @param {Object} tag Eintrag aus kunde.oeffnungszeiten.tage
   * @returns {string} z. B. "08:00–12:00, 13:00–18:00" oder "geschlossen"
   */
  SM.grafik.zeitenText = function (tag) {
    if (tag.geschlossen) {
      return 'geschlossen';
    }
    if (tag.pause) {
      return tag.von + '–' + tag.pauseVon + ', ' + tag.pauseBis + '–' + tag.bis;
    }
    return tag.von + '–' + tag.bis;
  };

  /* ---------- Öffnungszeiten / Feiertage ---------- */
  SM.grafik.registriere({
    id: 'oeffnungszeiten', name: 'Öffnungszeiten / Feiertage', bilder: 0,
    plaetze: {
      titel: 'Überschrift', untertitel: 'Dachzeile (z. B. „Allerheiligen")',
      text: 'Eigene Zeilen (leer = Öffnungszeiten des Kunden; eine Zeile pro Tag, z. B. „Fr 31.10.: 8–12 Uhr")',
      zusatz: 'Fußzeile'
    },
    zeichne: function (z) {
      var f = z.farben;
      var e = z.e;
      z.fuelle(f.flaeche);
      z.fuelle(f.betonung, 0, 0, z.b, 1.6 * e);
      var kopf = z.block([
        { text: z.texte.untertitel, pille: true },
        { text: z.texte.titel, groesse: 7, art: 'ueberschrift', abstand: 2.5 }
      ], { x: z.rand, y: z.oben + 10 * e, b: z.b - 2 * z.rand, h: 28 * e, position: 'oben' });

      // Zeilen: eigene (aus dem Text) oder die Öffnungszeiten des Kunden
      var zeilen;
      if (SM.helfer.istLeer(z.texte.text)) {
        zeilen = z.kunde.oeffnungszeiten.tage.map(function (tag, index) {
          return [SM.datum.WOCHENTAGE[index], SM.grafik.zeitenText(tag)];
        });
      } else {
        zeilen = z.texte.text.split('\n').filter(function (zeile) {
          return zeile.trim() !== '';
        }).map(function (zeile) {
          var teile = zeile.split(':');
          return teile.length > 1 ? [teile[0].trim(), teile.slice(1).join(':').trim()] : [zeile.trim(), ''];
        });
      }
      var fussHoehe = SM.helfer.istLeer(z.texte.zusatz) ? 0 : 9 * e;
      var tabelleOben = kopf.y + kopf.hoehe + 5 * e;
      var verfuegbar = z.unten - fussHoehe - tabelleOben;
      var zeilenHoehe = Math.min(7.2 * e, verfuegbar / Math.max(zeilen.length, 1));
      var groesse = Math.min(3.6, (zeilenHoehe / e) * 0.52);
      var linienFarbe = SM.farben.mische(f.flaeche, f.schrift, 0.18);
      zeilen.forEach(function (zeile, index) {
        var y = tabelleOben + index * zeilenHoehe;
        var textY = y + (zeilenHoehe - groesse * e * 1.38) / 2;
        z.schreibe(zeile[0], z.rand, textY, z.b - 2 * z.rand, { groesse: groesse, gewicht: '700' });
        z.schreibe(zeile[1], z.rand, textY, z.b - 2 * z.rand, { groesse: groesse, ausrichtung: 'rechts' });
        z.fuelle(linienFarbe, z.rand, y + zeilenHoehe - 1, z.b - 2 * z.rand, Math.max(1, 0.15 * e));
      });
      z.block([{ text: z.texte.zusatz, groesse: 3.3, gewicht: '700' }],
        { x: z.rand, y: z.unten - fussHoehe + 2 * e, b: z.b - 2 * z.rand, h: fussHoehe, position: 'mitte' });
      z.logoEcke();
      z.seitenzahl();
    }
  });
})();
