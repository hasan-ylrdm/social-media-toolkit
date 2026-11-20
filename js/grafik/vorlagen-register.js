/* =====================================================================
   vorlagen-register.js – Anmeldung der Grafik-Vorlagen
   ---------------------------------------------------------------------
   Jede Vorlage (js/grafik/vorlagen-*.js) meldet sich hier an.
   Die Oberfläche und der Export fragen nur dieses Register.

   NEUE VORLAGE (Schritt für Schritt in WEITERENTWICKLUNG.md, Abschnitt 2):
     1. In einer Datei js/grafik/vorlagen-*.js nach dem Muster anmelden
     2. test.html öffnen – der Test "Grafik" zeichnet sie in allen Formaten

   MUSTER – alle möglichen Angaben:
     SM.grafik.registriere({
       id: 'meine-vorlage',            // eindeutig; steht so in der Folie
       name: 'Meine Vorlage',          // Anzeigename im Post-Editor
       bilder: 1,                      // wie viele Fotos sie nutzt: 0, 1 oder 2
       plaetze: {                      // welche der vier Text-Plätze sie nutzt
         titel: 'Überschrift',         //   und wie sie im Editor heißen.
         untertitel: 'Dachzeile',      //   Nicht genannte Plätze werden im
         text: 'Text',                 //   Editor ausgeblendet.
         zusatz: 'Fußzeile'
       },
       zeichne: function (z) {         // z = Zeichner, siehe zeichner.js
         z.fuelle(z.farben.flaeche);
         z.block([
           { text: z.texte.untertitel, pille: true },
           { text: z.texte.titel, groesse: 8, art: 'ueberschrift' },
           { text: z.texte.text, groesse: 3.6 }
         ], { x: z.rand, y: z.oben, b: z.b - 2 * z.rand, h: z.unten - z.oben });
         z.logoEcke();
         z.seitenzahl();
       }
     });

   Regeln für zeichne():
     - nur relative Maße (z.e, z.b, z.h, z.rand, z.oben, z.unten)
     - Farben nur aus z.farben (so wirkt das Farbschema der Folie)
     - Text nur über z.block / z.schreibe / z.pille (bricht automatisch um)
   ===================================================================== */
(function () {
  'use strict';

  var vorlagen = [];

  /**
   * Meldet eine Grafik-Vorlage an.
   * @param {Object} def siehe MUSTER im Kopfkommentar
   */
  SM.grafik.registriere = function (def) {
    if (!def.id || !def.name || typeof def.zeichne !== 'function') {
      throw new Error('Grafik-Vorlage unvollständig (id, name, zeichne nötig): ' + JSON.stringify(def.id));
    }
    if (SM.grafik.hole(def.id)) {
      throw new Error('Grafik-Vorlage doppelt angemeldet: ' + def.id);
    }
    def.plaetze = def.plaetze || {};
    def.bilder = def.bilder || 0;
    vorlagen.push(def);
  };

  /**
   * Sucht eine Vorlage.
   * @param {string} id
   * @returns {Object|null}
   */
  SM.grafik.hole = function (id) {
    for (var i = 0; i < vorlagen.length; i += 1) {
      if (vorlagen[i].id === id) {
        return vorlagen[i];
      }
    }
    return null;
  };

  /**
   * Alle angemeldeten Vorlagen in der Reihenfolge der Anmeldung.
   * @returns {Array<Object>}
   */
  SM.grafik.alle = function () {
    return vorlagen.slice();
  };
})();
