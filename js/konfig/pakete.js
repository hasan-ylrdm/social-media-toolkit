/* =====================================================================
   pakete.js – Start-Vorschlag für MEINE drei Pakete
   ---------------------------------------------------------------------
   Diese Liste wird nur beim allerersten Start übernommen. Danach
   bearbeitest du die Pakete unter "Mein Geschäft → Meine Pakete"; sie
   werden im Browser gespeichert.

   ACHTUNG: Die Preise sind reine BEISPIELWERTE zum Überschreiben.

   preis:           Zahl in Euro pro Monat (für die Umsatz-Übersicht)
   postsProMonat …: steuern Strategie und Plan-Generator
   punkte:          ein Punkt pro Zeile (Zeilenumbruch = \n), für Angebote

   MUSTER:
     {
       id: 'paket-extra',
       name: 'Extra',
       preis: 499,
       postsProMonat: 16,
       storiesProWoche: 3,
       reelsProMonat: 2,
       bericht: true,
       punkte: 'Punkt eins\nPunkt zwei'
     }
   ===================================================================== */
(function () {
  'use strict';

  SM.konfig.standardPakete = [
    {
      id: 'paket-basis', name: 'Basis', preis: 149,
      postsProMonat: 4, storiesProWoche: 0, reelsProMonat: 0, bericht: false,
      punkte: '4 Beiträge pro Monat auf einem Kanal\nGrafiken im Design des Betriebs\nTexte und passende Hashtags\nFreigabe aller Beiträge vor der Veröffentlichung'
    },
    {
      id: 'paket-standard', name: 'Standard', preis: 249,
      postsProMonat: 8, storiesProWoche: 2, reelsProMonat: 0, bericht: false,
      punkte: '8 Beiträge pro Monat auf zwei Kanälen\n2 Stories pro Woche\nRedaktionsplan für den ganzen Monat\nFreigabe aller Beiträge vor der Veröffentlichung'
    },
    {
      id: 'paket-plus', name: 'Plus', preis: 399,
      postsProMonat: 12, storiesProWoche: 3, reelsProMonat: 1, bericht: true,
      punkte: '12 Beiträge pro Monat auf zwei Kanälen\n3 Stories pro Woche\n1 Reel pro Monat (Idee, Drehbuch, Schnitt)\nMonatsbericht mit kurzer Besprechung\nPflege des Google-Unternehmensprofils'
    }
  ];
})();
