/* =====================================================================
   onboarding-fragen.js – die Fragen des Onboarding-Fragebogens
   ---------------------------------------------------------------------
   Die Antworten landen in kunde.onboarding unter der id der Frage.
   Aus ihnen baut js/kern/strategie.js den Strategie-Vorschlag
   (verwendet werden dort: ziele, zielgruppe, besonderheiten, saison,
   dos, donts).

   NEUE FRAGE: Eintrag nach dem Muster ergänzen – sie erscheint dann
   automatisch im digitalen und im druckbaren Fragebogen.
   MUSTER:
     {
       id: 'budget',                               // eindeutig
       frage: 'Gibt es ein Budget für Werbeanzeigen?',
       hilfe: 'z. B. 50 € pro Monat für beworbene Beiträge'   // Hinweis unter dem Feld
     }
   ===================================================================== */
(function () {
  'use strict';

  SM.konfig.onboardingFragen = [
    { id: 'ziele', frage: 'Was soll Social Media für Ihren Betrieb bringen?', hilfe: 'z. B. bekannter werden in der Region, mehr Terminanfragen, Mitarbeiter finden, Stammkunden informieren' },
    { id: 'zielgruppe', frage: 'Wen wollen Sie erreichen?', hilfe: 'Alter, Wohnort, Interessen – wer sind Ihre liebsten Kundinnen und Kunden?' },
    { id: 'besonderheiten', frage: 'Was macht Ihren Betrieb besonders?', hilfe: 'Was sagen Kunden, warum sie zu Ihnen kommen? Was können Sie besser als andere?' },
    { id: 'angebote', frage: 'Welche Leistungen oder Produkte sollen im Vordergrund stehen?', hilfe: 'Die drei bis fünf wichtigsten, gern mit Preisen' },
    { id: 'saison', frage: 'Gibt es Zeiten im Jahr, die besonders wichtig sind?', hilfe: 'z. B. Advent, Ballsaison, Reifenwechsel, Gastgarten, Betriebsurlaub' },
    { id: 'konkurrenz', frage: 'Welche Betriebe in der Umgebung machen Social Media gut?', hilfe: 'Auch aus anderen Branchen – was gefällt Ihnen daran?' },
    { id: 'bisher', frage: 'Was haben Sie bisher auf Social Media gemacht?', hilfe: 'Welche Kanäle gibt es schon, was hat gut funktioniert, was nicht?' },
    { id: 'dos', frage: 'Was soll unbedingt vorkommen?', hilfe: 'Themen, Werte, bestimmte Mitarbeiter, Dialekt oder Hochdeutsch, Du oder Sie' },
    { id: 'donts', frage: 'Was soll auf keinen Fall vorkommen?', hilfe: 'Themen, Bilder, Personen, Formulierungen' },
    { id: 'fotos', frage: 'Wer liefert Fotos und Videos?', hilfe: 'Schicken Sie Bilder per WhatsApp? Darf ich einmal im Monat vorbeikommen? Wer möchte nicht fotografiert werden?' },
    { id: 'freigabe', frage: 'Wer gibt die Beiträge frei und wie schnell?', hilfe: 'Name, bevorzugter Weg (E-Mail, WhatsApp) und übliche Antwortzeit' }
  ];
})();
