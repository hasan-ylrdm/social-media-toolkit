/* =====================================================================
   vorlagen-3.js – Grafik-Vorlagen: Produkt, Frage, Gruß, Titel-Folie,
   Liste (für Karussells)
   ---------------------------------------------------------------------
   MUSTER und Regeln für neue Vorlagen: js/grafik/vorlagen-register.js
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- Produkt / Leistung ---------- */
  SM.grafik.registriere({
    id: 'produkt', name: 'Produkt / Leistung', bilder: 1,
    plaetze: { untertitel: 'Dachzeile', titel: 'Produkt / Leistung', text: 'Beschreibung', zusatz: 'Preis (erscheint im Kreis)' },
    zeichne: function (z) {
      var f = z.farben;
      var e = z.e;
      var fotoHoehe = z.h * (z.hochkant ? 0.52 : 0.58);
      z.fuelle(f.flaeche);
      z.foto(z.bild, 0, 0, z.b, fotoHoehe);
      // Preis-Kreis, halb über dem Foto
      var hatPreis = !SM.helfer.istLeer(z.texte.zusatz);
      var radius = 11 * e;
      if (hatPreis) {
        var kreisX = z.b - z.rand - radius;
        z.kreis(kreisX, fotoHoehe, radius + 0.8 * e, f.flaeche);
        z.kreis(kreisX, fotoHoehe, radius, f.betonung);
        z.block([{ text: z.texte.zusatz, groesse: 4.6, art: 'ueberschrift', farbe: f.aufBetonung }],
          { x: kreisX - radius + 1.5 * e, y: fotoHoehe - radius, b: 2 * radius - 3 * e, h: 2 * radius, position: 'mitte', ausrichtung: 'mitte' });
      }
      var oben = fotoHoehe + 5 * e;
      z.block([
        { text: z.texte.untertitel, groesse: 3, gewicht: '700', gross: true, farbe: f.betonung },
        { text: z.texte.titel, groesse: 7.6, art: 'ueberschrift', abstand: 1.5 },
        { text: z.texte.text, groesse: 3.6, abstand: 2.5 }
      ], { x: z.rand, y: oben, b: z.b - 2 * z.rand - (hatPreis ? 2 * radius + 3 * e : 0), h: z.unten - oben, position: 'mitte', ausrichtung: 'links' });
      z.logoEcke(true);
      z.seitenzahl();
    }
  });

  /* ---------- Frage an die Community ---------- */
  SM.grafik.registriere({
    id: 'frage', name: 'Frage an die Community', bilder: 0,
    plaetze: { untertitel: 'Dachzeile', titel: 'Frage', text: 'Aufforderung' },
    zeichne: function (z) {
      var f = z.farben;
      var e = z.e;
      z.fuelle(f.flaeche);
      // Großes Fragezeichen als Schmuck im Hintergrund
      z.ctx.save();
      z.ctx.globalAlpha = 0.16;
      z.schreibe('?', z.b * 0.42, z.h * 0.5 - 45 * e, z.b * 0.6,
        { groesse: 90, art: 'ueberschrift', farbe: f.betonung, ausrichtung: 'rechts', zeilenhoehe: 1 });
      z.ctx.restore();
      var oben = z.oben + 12 * e;
      z.block([
        { text: z.texte.untertitel, pille: true },
        { text: z.texte.titel, groesse: 9, art: 'ueberschrift', abstand: 3 },
        { linie: !SM.helfer.istLeer(z.texte.text), abstand: 4 },
        { text: z.texte.text, groesse: 3.8, gewicht: '700', abstand: 3 }
      ], { x: z.rand, y: oben, b: z.b - 2 * z.rand, h: z.unten - oben, position: 'mitte' });
      z.logoEcke();
      z.seitenzahl();
    }
  });

  /* ---------- Gruß / Saison ---------- */
  SM.grafik.registriere({
    id: 'gruss', name: 'Gruß / Saison', bilder: 1,
    plaetze: { untertitel: 'Dachzeile', titel: 'Gruß (z. B. „Frohe Ostern")', text: 'Zeile darunter', zusatz: 'Zusatz' },
    zeichne: function (z) {
      var f = z.farben;
      var e = z.e;
      var aufFoto = z.vollbild(0.4, 0.6);
      var farbe = aufFoto ? '#ffffff' : f.schrift;
      if (!aufFoto) {
        // Rahmen als ruhiger Schmuck
        z.ctx.strokeStyle = f.betonung;
        z.ctx.lineWidth = 0.6 * e;
        z.pfadRund(z.rand - 2 * e, z.oben - 2 * e, z.b - 2 * z.rand + 4 * e, z.unten - z.oben + 4 * e, 3 * e);
        z.ctx.stroke();
      }
      // Logo mittig unten (dieser Gruß kommt "vom Betrieb")
      var logoHoehe = z.logoBild ? 11 * e : 0;
      if (z.logoBild) {
        z.logo(z.rand, z.unten - logoHoehe - 2 * e, z.b - 2 * z.rand, logoHoehe, 'mitte', aufFoto);
      }
      var oben = z.oben + 6 * e;
      z.block([
        { text: z.texte.untertitel, groesse: 3.2, gewicht: '700', gross: true, farbe: aufFoto ? '#ffffff' : f.betonung },
        { text: z.texte.titel, groesse: 12, art: 'ueberschrift', farbe: farbe, abstand: 2.5 },
        { linie: !SM.helfer.istLeer(z.texte.text), abstand: 4 },
        { text: z.texte.text, groesse: 4.2, farbe: farbe, abstand: 3.5 },
        { text: z.texte.zusatz, groesse: 3.1, farbe: farbe, abstand: 2 }
      ], { x: z.rand + 3 * e, y: oben, b: z.b - 2 * z.rand - 6 * e, h: z.unten - logoHoehe - 8 * e - oben, position: 'mitte', ausrichtung: 'mitte' });
      z.seitenzahl();
    }
  });

  /* ---------- Titel-Folie (Reel-Cover, erste Folie im Karussell) ---------- */
  SM.grafik.registriere({
    id: 'titel-folie', name: 'Titel-Folie / Reel-Cover', bilder: 1,
    plaetze: { untertitel: 'Dachzeile', titel: 'Großer Titel', text: 'Unterzeile', zusatz: 'Fußzeile' },
    zeichne: function (z) {
      var f = z.farben;
      var e = z.e;
      var aufFoto = z.vollbild(0.5, 0.65);
      var farbe = aufFoto ? '#ffffff' : f.schrift;
      if (!aufFoto) {
        z.fuelle(f.betonung, 0, z.h - 2.4 * e, z.b, 2.4 * e);
        z.kreis(z.b, 0, 32 * e, f.betonung, 0.18);
      }
      var fussHoehe = SM.helfer.istLeer(z.texte.zusatz) ? 0 : 8 * e;
      var oben = z.oben + 12 * e;
      z.block([
        { text: z.texte.untertitel, pille: true },
        { text: z.texte.titel, groesse: 12.5, art: 'ueberschrift', farbe: farbe, abstand: 3.5 },
        { text: z.texte.text, groesse: 4.2, farbe: farbe, abstand: 3 }
      ], { x: z.rand, y: oben, b: z.b - 2 * z.rand, h: z.unten - fussHoehe - oben, position: 'mitte' });
      z.block([{ text: z.texte.zusatz, groesse: 3, gewicht: '700', farbe: farbe }],
        { x: z.rand, y: z.unten - fussHoehe, b: z.b - 2 * z.rand - 16 * e, h: fussHoehe, position: 'unten', ausrichtung: 'links' });
      z.logoEcke(aufFoto);
      z.seitenzahl();
    }
  });

  /* ---------- Liste (Inhalts-Folie im Karussell, Checkliste) ---------- */
  SM.grafik.registriere({
    id: 'liste', name: 'Liste / Schritte', bilder: 0,
    plaetze: { untertitel: 'Dachzeile', titel: 'Überschrift', text: 'Punkte (eine Zeile pro Punkt)', zusatz: 'Fußzeile' },
    zeichne: function (z) {
      var f = z.farben;
      var e = z.e;
      z.fuelle(f.flaeche);
      var kopf = z.block([
        { text: z.texte.untertitel, pille: true },
        { text: z.texte.titel, groesse: 7, art: 'ueberschrift', abstand: 2.5 }
      ], { x: z.rand, y: z.oben + 11 * e, b: z.b - 2 * z.rand, h: 30 * e, position: 'oben', ausrichtung: 'links' });

      var punkte = String(z.texte.text || '').split('\n').filter(function (zeile) {
        return zeile.trim() !== '';
      });
      var fussHoehe = SM.helfer.istLeer(z.texte.zusatz) ? 0 : 8 * e;
      var listeOben = kopf.y + kopf.hoehe + 5 * e;
      var verfuegbar = z.unten - fussHoehe - listeOben;
      var zeilenHoehe = Math.max(4 * e, Math.min(13 * e, verfuegbar / Math.max(punkte.length, 1)));   // mindestens 4 Einheiten, auch bei flachen Formaten
      var radius = Math.min(3.6 * e, zeilenHoehe * 0.36);
      punkte.forEach(function (punkt, index) {
        var y = listeOben + index * zeilenHoehe;
        var mitteY = y + zeilenHoehe / 2;
        z.kreis(z.rand + radius, mitteY, radius, f.betonung);
        z.schreibe(String(index + 1), z.rand, mitteY - radius * 0.72, radius * 2,
          { groesse: (radius / e) * 1.05, gewicht: '700', farbe: f.aufBetonung, ausrichtung: 'mitte', zeilenhoehe: 1.38 });
        z.block([{ text: punkt.trim(), groesse: 3.8 }],
          { x: z.rand + radius * 2 + 3 * e, y: y, b: z.b - 2 * z.rand - radius * 2 - 3 * e, h: zeilenHoehe, position: 'mitte', ausrichtung: 'links' });
      });
      z.block([{ text: z.texte.zusatz, groesse: 3, gewicht: '700' }],
        { x: z.rand, y: z.unten - fussHoehe, b: z.b - 2 * z.rand - 16 * e, h: fussHoehe, position: 'unten', ausrichtung: 'links' });
      z.logoEcke();
      z.seitenzahl();
    }
  });
})();
