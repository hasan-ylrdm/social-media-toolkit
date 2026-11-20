/* =====================================================================
   beitragsarten.js – die Arten von Beiträgen
   ---------------------------------------------------------------------
   Eine Beitragsart verbindet drei Dinge:
     - die Grafik-Vorlage, die dazu passt (js/grafik/vorlagen-*.js)
     - Start-Texte für die Grafik (mit Platzhaltern)
     - den Schlüssel für die Caption-Textbausteine (= die id)

   NEUE BEITRAGSART: Eintrag nach dem Muster ergänzen und in
   js/konfig/textbausteine-allgemein.js unter derselben id mindestens
   zwei Captions anlegen (der Selbsttest prüft das).
   MUSTER:
     {
       id: 'jubilaeum',                 // eindeutig; so steht es im Post
       name: 'Jubiläum',                // Anzeigename
       vorlage: 'danke',                // id einer Grafik-Vorlage
       folie: {                         // Start-Texte der Grafik (leer lassen, was nicht passt)
         titel: '{Jahre} Jahre {Firmenname}',
         untertitel: 'Danke!',
         text: '',
         zusatz: ''
       },
       google: true                     // eignet sich auch fürs Google-Unternehmensprofil
     }
   ===================================================================== */
(function () {
  'use strict';

  SM.konfig.beitragsarten = [
    { id: 'angebot', name: 'Angebot / Aktion', vorlage: 'angebot', google: true,
      folie: { titel: '{Angebot}', untertitel: 'Aktion', text: 'Nur für kurze Zeit bei {Firmenname}', zusatz: 'Gültig bis {Datum}' } },
    { id: 'neuigkeit', name: 'Neuigkeit', vorlage: 'neuigkeit', google: true,
      folie: { titel: 'Neu bei uns', untertitel: '{Firmenname}', text: '{Thema}', zusatz: '' } },
    { id: 'kundenstimme', name: 'Zitat / Kundenstimme', vorlage: 'zitat', google: false,
      folie: { titel: '', untertitel: '', text: '{Zitat}', zusatz: '{Name}' } },
    { id: 'vorher-nachher', name: 'Vorher / Nachher', vorlage: 'vorher-nachher', google: false,
      folie: { titel: 'Vorher – Nachher', untertitel: '', text: '', zusatz: '{Firmenname}' } },
    { id: 'team', name: 'Team-Vorstellung', vorlage: 'team', google: false,
      folie: { titel: '{Name}', untertitel: 'Unser Team', text: '{Thema}', zusatz: '' } },
    { id: 'oeffnungszeiten', name: 'Öffnungszeiten / Feiertage', vorlage: 'oeffnungszeiten', google: true,
      folie: { titel: 'Unsere Öffnungszeiten', untertitel: '{Thema}', text: '', zusatz: 'Wir freuen uns auf Sie!' } },
    { id: 'stellenanzeige', name: 'Wir suchen Mitarbeiter', vorlage: 'stellenanzeige', google: true,
      folie: { titel: 'Wir suchen dich!', untertitel: '{Stelle}', text: 'Verstärke unser Team in {Ort}', zusatz: 'Jetzt bewerben: {Telefon}' } },
    { id: 'tipp', name: 'Tipp der Woche', vorlage: 'tipp', google: false,
      folie: { titel: '{Thema}', untertitel: 'Tipp der Woche', text: '', zusatz: '{Firmenname}' } },
    { id: 'event', name: 'Event / Veranstaltung', vorlage: 'event', google: true,
      folie: { titel: '{Thema}', untertitel: 'Save the Date', text: '{Ort}', zusatz: '{Datum}' } },
    { id: 'gewinnspiel', name: 'Gewinnspiel', vorlage: 'gewinnspiel', google: false,
      folie: { titel: 'Gewinnspiel', untertitel: 'Mitmachen und gewinnen', text: 'Zu gewinnen: {Angebot}', zusatz: 'Teilnahme bis {Datum}' } },
    { id: 'danke', name: 'Danke / Meilenstein', vorlage: 'danke', google: false,
      folie: { titel: 'Danke!', untertitel: '', text: '{Thema}', zusatz: '{Firmenname}' } },
    { id: 'einblick', name: 'Einblick hinter die Kulissen', vorlage: 'foto-text', google: false,
      folie: { titel: '{Thema}', untertitel: 'Einblick', text: '', zusatz: '' } },
    { id: 'produkt', name: 'Produkt / Leistung', vorlage: 'produkt', google: true,
      folie: { titel: '{Angebot}', untertitel: 'Bei {Firmenname}', text: '', zusatz: '{Preis}' } },
    { id: 'frage', name: 'Frage an die Community', vorlage: 'frage', google: false,
      folie: { titel: '{Thema}', untertitel: 'Eure Meinung', text: 'Schreibt es in die Kommentare', zusatz: '' } },
    { id: 'saison', name: 'Gruß / Saison', vorlage: 'gruss', google: true,
      folie: { titel: '{Thema}', untertitel: '', text: 'wünscht {Firmenname}', zusatz: '' } },
    { id: 'reel', name: 'Reel / Video', vorlage: 'titel-folie', google: false,
      folie: { titel: '{Thema}', untertitel: 'Reel', text: '', zusatz: '{Firmenname}' } }
  ];
})();
