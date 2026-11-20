/* =====================================================================
   vorlagen-2.js – Grafik-Vorlagen: Stellenanzeige, Tipp, Event,
   Gewinnspiel, Danke, Foto mit Text
   ---------------------------------------------------------------------
   MUSTER und Regeln für neue Vorlagen: js/grafik/vorlagen-register.js
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- Wir suchen Mitarbeiter ---------- */
  SM.grafik.registriere({
    id: 'stellenanzeige', name: 'Wir suchen Mitarbeiter', bilder: 1,
    plaetze: { titel: 'Überschrift', untertitel: 'Stelle', text: 'Kurztext', zusatz: 'Kontakt' },
    zeichne: function (z) {
      var f = z.farben;
      var e = z.e;
      var aufFoto = z.vollbild(0.45, 0.8);
      var farbe = aufFoto ? '#ffffff' : f.schrift;
      if (!aufFoto) {
        z.kreis(z.b * 0.88, z.h * 0.22, 20 * e, f.betonung, 0.2);
        z.kreis(z.b * 0.1, z.h * 0.86, 14 * e, f.betonung, 0.14);
      }
      // Kontakt-Kasten unten
      var kastenHoehe = SM.helfer.istLeer(z.texte.zusatz) ? 0 : 12 * e;
      if (kastenHoehe > 0) {
        var kastenY = z.unten - kastenHoehe;
        z.rechteck(z.rand, kastenY, z.b - 2 * z.rand, kastenHoehe, 2 * e, f.betonung);
        z.block([{ text: z.texte.zusatz, groesse: 3.6, gewicht: '700', farbe: f.aufBetonung }],
          { x: z.rand + 3 * e, y: kastenY, b: z.b - 2 * z.rand - 6 * e, h: kastenHoehe, position: 'mitte', ausrichtung: 'mitte' });
      }
      var oben = z.oben + 12 * e;
      z.block([
        { text: z.texte.titel, groesse: 11, art: 'ueberschrift', farbe: farbe },
        { text: z.texte.untertitel, pille: true, groesse: 3.2, abstand: 4 },
        { text: z.texte.text, groesse: 3.9, farbe: farbe, abstand: 4 }
      ], { x: z.rand, y: oben, b: z.b - 2 * z.rand, h: z.unten - kastenHoehe - 4 * e - oben, position: 'mitte' });
      z.logoEcke(aufFoto);
      z.seitenzahl();
    }
  });

  /* ---------- Tipp der Woche ---------- */
  SM.grafik.registriere({
    id: 'tipp', name: 'Tipp der Woche', bilder: 0,
    plaetze: { untertitel: 'Dachzeile', titel: 'Tipp (kurz)', text: 'Erklärung', zusatz: 'Fußzeile' },
    zeichne: function (z) {
      var f = z.farben;
      var e = z.e;
      z.fuelle(f.flaeche);
      // Glühbirnen-Ersatz: Kreis mit "i" als ruhiges Zeichen für "Tipp"
      var kreisRadius = 8 * e;
      var kreisX = z.rand + kreisRadius;
      var kreisY = z.oben + 12 * e + kreisRadius;
      z.kreis(kreisX, kreisY, kreisRadius, f.betonung);
      z.schreibe('!', kreisX - kreisRadius, kreisY - 5.6 * e, kreisRadius * 2,
        { groesse: 9, art: 'ueberschrift', farbe: f.aufBetonung, ausrichtung: 'mitte', zeilenhoehe: 1.2 });
      z.schreibe(SM.helfer.istLeer(z.texte.untertitel) ? '' : z.texte.untertitel, kreisX + kreisRadius + 3 * e, kreisY - 2.4 * e,
        z.b - z.rand - (kreisX + kreisRadius + 3 * e), { groesse: 3.4, gewicht: '700', gross: true });
      var oben = kreisY + kreisRadius + 5 * e;
      var fussHoehe = SM.helfer.istLeer(z.texte.zusatz) ? 0 : 7 * e;
      z.block([
        { text: z.texte.titel, groesse: 7.6, art: 'ueberschrift' },
        { text: z.texte.text, groesse: 3.9, abstand: 3 }
      ], { x: z.rand, y: oben, b: z.b - 2 * z.rand, h: z.unten - fussHoehe - oben, position: 'oben' });
      z.block([{ text: z.texte.zusatz, groesse: 3, gewicht: '700', farbe: SM.farben.mische(f.schrift, f.flaeche, 0.25) }],
        { x: z.rand, y: z.unten - fussHoehe, b: z.b - 2 * z.rand - 16 * e, h: fussHoehe, position: 'unten', ausrichtung: 'links' });
      z.logoEcke();
      z.seitenzahl();
    }
  });

  /* ---------- Event / Veranstaltung ---------- */
  SM.grafik.registriere({
    id: 'event', name: 'Event / Veranstaltung', bilder: 1,
    plaetze: { untertitel: 'Dachzeile', titel: 'Name der Veranstaltung', text: 'Ort / Details', zusatz: 'Datum und Uhrzeit' },
    zeichne: function (z) {
      var f = z.farben;
      var e = z.e;
      var aufFoto = z.vollbild(0.3, 0.82);
      var farbe = aufFoto ? '#ffffff' : f.schrift;
      // Datums-Kasten oben links
      var kastenHoehe = 0;
      if (!SM.helfer.istLeer(z.texte.zusatz)) {
        kastenHoehe = 16 * e;
        z.rechteck(z.rand, z.oben + 2 * e, 40 * e, kastenHoehe, 2 * e, f.betonung);
        z.block([{ text: z.texte.zusatz, groesse: 4.4, art: 'ueberschrift', farbe: f.aufBetonung }],
          { x: z.rand + 3 * e, y: z.oben + 2 * e, b: 34 * e, h: kastenHoehe, position: 'mitte', ausrichtung: 'links' });
      }
      var oben = z.oben + kastenHoehe + 8 * e;
      z.block([
        { text: z.texte.untertitel, groesse: 3.2, gewicht: '700', gross: true, farbe: aufFoto ? '#ffffff' : f.betonung },
        { text: z.texte.titel, groesse: 9.5, art: 'ueberschrift', farbe: farbe, abstand: 2 },
        { linie: !SM.helfer.istLeer(z.texte.text), abstand: 3.5 },
        { text: z.texte.text, groesse: 3.9, farbe: farbe, abstand: 3 }
      ], { x: z.rand, y: oben, b: z.b - 2 * z.rand, h: z.unten - oben });
      z.logoEcke(aufFoto);
      z.seitenzahl();
    }
  });

  /* ---------- Gewinnspiel ---------- */
  SM.grafik.registriere({
    id: 'gewinnspiel', name: 'Gewinnspiel', bilder: 1,
    plaetze: { titel: 'Überschrift', untertitel: 'Dachzeile', text: 'Gewinn / Ablauf', zusatz: 'Teilnahmeschluss' },
    zeichne: function (z) {
      var f = z.farben;
      var e = z.e;
      z.fuelle(f.flaeche);
      // Konfetti aus festen Punkten (kein Zufall: jede Grafik sieht gleich aus)
      var punkte = [[8, 9, 3], [22, 4, 1.6], [38, 11, 2.2], [56, 5, 1.4], [71, 12, 2.6], [90, 6, 1.8],
        [94, 24, 2.4], [5, 30, 1.6], [96, 52, 1.5], [4, 62, 2.4], [92, 80, 2.8], [10, 88, 1.8], [30, 95, 2.2], [64, 93, 1.5], [80, 97, 2]];
      punkte.forEach(function (punkt, index) {
        z.kreis(z.b * punkt[0] / 100, z.h * punkt[1] / 100, punkt[2] * e, index % 2 === 0 ? f.betonung : f.schrift, index % 2 === 0 ? 0.85 : 0.18);
      });
      var oben = z.oben + 14 * e;
      var unten = z.unten;
      if (z.bild) {
        // Foto des Gewinns als runder Ausschnitt
        var groesse = z.b * 0.42;
        z.foto(z.bild, (z.b - groesse) / 2, oben, groesse, groesse, groesse / 2);
        oben += groesse + 4 * e;
      }
      z.block([
        { text: z.texte.untertitel, pille: true },
        { text: z.texte.titel, groesse: 11, art: 'ueberschrift', abstand: 3 },
        { text: z.texte.text, groesse: 4, abstand: 3 },
        { text: z.texte.zusatz, groesse: 3.1, gewicht: '700', abstand: 3 }
      ], { x: z.rand + 3 * e, y: oben, b: z.b - 2 * z.rand - 6 * e, h: unten - oben, position: 'mitte', ausrichtung: 'mitte' });
      z.logoEcke();
      z.seitenzahl();
    }
  });

  /* ---------- Danke / Meilenstein ---------- */
  SM.grafik.registriere({
    id: 'danke', name: 'Danke / Meilenstein', bilder: 1,
    plaetze: { titel: 'Große Zeile (z. B. „Danke!" oder „1.000")', untertitel: 'Dachzeile', text: 'Text', zusatz: 'Absender' },
    zeichne: function (z) {
      var f = z.farben;
      var e = z.e;
      var aufFoto = z.vollbild(0.55, 0.7);
      var farbe = aufFoto ? '#ffffff' : f.schrift;
      if (!aufFoto) {
        // Ring als ruhiger Schmuck hinter dem Text
        z.kreis(z.b / 2, z.h / 2, 38 * e, f.betonung, 0.16);
        z.kreis(z.b / 2, z.h / 2, 30 * e, f.flaeche, 1);
      }
      var oben = z.oben + 12 * e;
      z.block([
        { text: z.texte.untertitel, groesse: 3.2, gewicht: '700', gross: true, farbe: aufFoto ? '#ffffff' : f.betonung },
        { text: z.texte.titel, groesse: 14, art: 'ueberschrift', farbe: farbe, abstand: 2 },
        { text: z.texte.text, groesse: 4, farbe: farbe, abstand: 3 },
        { linie: !SM.helfer.istLeer(z.texte.zusatz), abstand: 4 },
        { text: z.texte.zusatz, groesse: 3.2, gewicht: '700', farbe: farbe, abstand: 2.5 }
      ], { x: z.rand + 2 * e, y: oben, b: z.b - 2 * z.rand - 4 * e, h: z.unten - oben, position: 'mitte', ausrichtung: 'mitte' });
      z.logoEcke(aufFoto);
      z.seitenzahl();
    }
  });

  /* ---------- Foto mit Text (Einblick) ---------- */
  SM.grafik.registriere({
    id: 'foto-text', name: 'Foto mit Text', bilder: 1,
    plaetze: { untertitel: 'Dachzeile', titel: 'Überschrift', text: 'Text' },
    zeichne: function (z) {
      var e = z.e;
      z.fuelle(z.farben.flaeche);
      z.foto(z.bild, 0, 0, z.b, z.h);
      if (z.bild) {
        // Nur dort abdunkeln, wo der Text steht
        var position = z.folie.textPosition || 'unten';
        if (position === 'oben') {
          z.abdunkeln(0, 0, z.b, z.h * 0.6, 0.72, 0);
        } else if (position === 'mitte') {
          z.abdunkeln(0, 0, z.b, z.h, 0.45, 0.45);
        } else {
          z.abdunkeln(0, z.h * 0.4, z.b, z.h * 0.6, 0, 0.8);
        }
      }
      var farbe = z.bild ? '#ffffff' : z.farben.schrift;
      var oben = z.oben + 12 * e;
      z.block([
        { text: z.texte.untertitel, pille: true },
        { text: z.texte.titel, groesse: 8, art: 'ueberschrift', farbe: farbe, abstand: 2.5 },
        { text: z.texte.text, groesse: 3.8, farbe: farbe, abstand: 2.5 }
      ], { x: z.rand, y: oben, b: z.b - 2 * z.rand, h: z.unten - oben });
      z.logoEcke(!!z.bild);
      z.seitenzahl();
    }
  });
})();
