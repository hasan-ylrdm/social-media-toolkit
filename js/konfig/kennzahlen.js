/* =====================================================================
   kennzahlen.js – welche Zahlen im Monatsbericht erfasst werden
   ---------------------------------------------------------------------
   Die Zahlen tippe ich aus den Insights von Instagram/Facebook/Google ab.
   Das Werkzeug erfindet NIE Zahlen: leer bleibt leer.

   NEUE KENNZAHL: Eintrag nach dem Muster ergänzen – sie erscheint dann
   automatisch im Formular, im Vergleich und im Bericht.
   MUSTER:
     {
       id: 'nachrichten',            // eindeutig; so steht es im Bericht
       name: 'Nachrichten',          // Anzeigename
       erklaerung: 'Wie viele Menschen haben geschrieben.',  // steht im Bericht für den Kunden
       bestand: false,               // true = Bestandszahl (z. B. Follower): Monatswerte nicht addieren
       diagramm: true                // true = bekommt ein Balkendiagramm im Bericht
     }
   ===================================================================== */
(function () {
  'use strict';

  SM.konfig.kennzahlen = [
    { id: 'reichweite', name: 'Reichweite', erklaerung: 'So viele verschiedene Konten haben mindestens einen Beitrag gesehen.', bestand: false, diagramm: true },
    { id: 'follower', name: 'Follower', erklaerung: 'So viele Konten folgen dem Profil am Monatsende.', bestand: true, diagramm: true },
    { id: 'interaktionen', name: 'Interaktionen', erklaerung: 'Likes, Kommentare, geteilte und gespeicherte Beiträge zusammen.', bestand: false, diagramm: true },
    { id: 'profilaufrufe', name: 'Profilaufrufe', erklaerung: 'So oft wurde das Profil geöffnet.', bestand: false, diagramm: true },
    { id: 'websiteKlicks', name: 'Website-Klicks', erklaerung: 'So oft wurde der Link zur Website angetippt.', bestand: false, diagramm: false },
    { id: 'anrufe', name: 'Anrufe', erklaerung: 'So oft wurde über das Profil die Anruf-Schaltfläche genutzt.', bestand: false, diagramm: false },
    { id: 'routen', name: 'Routenanfragen (Google)', erklaerung: 'So oft wurde im Google-Profil eine Wegbeschreibung angefordert.', bestand: false, diagramm: false },
    { id: 'bewertungen', name: 'Neue Google-Bewertungen', erklaerung: 'So viele neue Bewertungen sind in diesem Monat dazugekommen.', bestand: false, diagramm: false },
    { id: 'beitraege', name: 'Veröffentlichte Beiträge', erklaerung: 'So viele Beiträge sind in diesem Monat erschienen.', bestand: false, diagramm: false }
  ];
})();
