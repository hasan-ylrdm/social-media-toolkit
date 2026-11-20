/* =====================================================================
   branchen.js – die Branchen mit ihren Strategie-Vorschlägen
   ---------------------------------------------------------------------
   Die ids sind dieselben wie im Website-Baukasten (wichtig für den
   Import). Zu jeder Branche gehören außerdem:
     - Captions:    js/konfig/textbausteine-branchen-*.js
     - Hashtags:    js/konfig/hashtags.js
     - Reel-Ideen:  js/konfig/reels-*.js
   (Der Selbsttest prüft, dass jede Branche überall vorkommt.)

   NEUE BRANCHE: Eintrag nach dem Muster ergänzen, dann in den drei
   Dateien oben Einträge unter derselben id anlegen.
   Schritt für Schritt: WEITERENTWICKLUNG.md, Abschnitt 1.

   MUSTER:
     {
       id: 'baeckerei',                 // eindeutig, Kleinbuchstaben
       name: 'Bäckerei',                // Anzeigename
       zielgruppe: 'Menschen aus {Ort} und Umgebung, die …',   // Vorschlag fürs Kundenformular
       kanalHinweis: 'Instagram für Bilder, Facebook für Ältere …',
       saeulen: [                       // Themen-Säulen; Anteile ergeben zusammen 100
         { name: 'Einblicke', anteil: 30, beitragsarten: ['einblick', 'team'],
           beschreibung: 'Was passiert in der Backstube?' }
       ]
     }
   ===================================================================== */
(function () {
  'use strict';

  /**
   * Kurzschreibweise für eine Themen-Säule.
   * @param {string} name
   * @param {number} anteil Prozent
   * @param {string[]} beitragsarten ids aus beitragsarten.js
   * @param {string} beschreibung
   * @returns {Object}
   */
  function s(name, anteil, beitragsarten, beschreibung) {
    return { name: name, anteil: anteil, beitragsarten: beitragsarten, beschreibung: beschreibung };
  }

  SM.konfig.branchen = [
    {
      id: 'allgemein', name: 'Allgemein (neutral)',
      zielgruppe: 'Menschen aus {Ort} und Umgebung, die unser Angebot brauchen oder weiterempfehlen.',
      kanalHinweis: 'Instagram für Bilder und Einblicke, Facebook für Neuigkeiten und ältere Zielgruppen, das Google-Unternehmensprofil für alle, die in der Nähe suchen.',
      saeulen: [
        s('Einblicke', 30, ['einblick', 'team'], 'Zeigen, wer hinter dem Betrieb steht und wie gearbeitet wird.'),
        s('Angebote & Leistungen', 25, ['produkt', 'angebot'], 'Was es gibt, was es kostet, was gerade besonders ist.'),
        s('Kundenstimmen', 15, ['kundenstimme', 'danke'], 'Echte Rückmeldungen zeigen (nur mit Einverständnis).'),
        s('Tipps', 15, ['tipp', 'frage'], 'Nützliches Wissen aus dem Fachgebiet, kurz und einfach.'),
        s('Infos & Termine', 15, ['neuigkeit', 'oeffnungszeiten', 'saison'], 'Öffnungszeiten, Neuigkeiten, Feiertage.')
      ]
    },
    {
      id: 'friseur', name: 'Friseur / Kosmetik',
      zielgruppe: 'Frauen und Männer aus {Ort} und Umgebung, die Wert auf ein gepflegtes Aussehen legen und einen Salon suchen, dem sie vertrauen.',
      kanalHinweis: 'Instagram ist der wichtigste Kanal (Vorher-Nachher-Bilder, Reels). Facebook für Stammkundschaft, Google für Termine und Bewertungen.',
      saeulen: [
        s('Ergebnisse', 35, ['vorher-nachher', 'einblick'], 'Schnitte, Farben und Stylings zeigen – das überzeugt am meisten.'),
        s('Team & Salon', 20, ['team', 'einblick'], 'Die Menschen im Salon vorstellen, Atmosphäre zeigen.'),
        s('Pflege-Tipps', 20, ['tipp', 'frage'], 'Kurze Tipps für zu Hause, Produkte erklären.'),
        s('Angebote & Termine', 15, ['angebot', 'produkt', 'oeffnungszeiten'], 'Freie Termine, Aktionen, Gutscheine.'),
        s('Kundenstimmen', 10, ['kundenstimme', 'danke'], 'Zufriedene Kundinnen und Kunden zu Wort kommen lassen.')
      ]
    },
    {
      id: 'handwerk', name: 'Handwerk',
      zielgruppe: 'Hausbesitzer, Bauherren und Hausverwaltungen im Raum {Ort}, die einen verlässlichen Betrieb aus der Nähe suchen.',
      kanalHinweis: 'Facebook und das Google-Unternehmensprofil erreichen Hausbesitzer gut. Instagram eignet sich für Baustellen-Einblicke und die Lehrlingssuche.',
      saeulen: [
        s('Projekte', 35, ['vorher-nachher', 'einblick'], 'Fertige Arbeiten und Baustellen zeigen, gern mit Vorher-Nachher.'),
        s('Team & Werkstatt', 20, ['team', 'einblick', 'stellenanzeige'], 'Wer kommt zum Kunden? Auch für die Mitarbeitersuche wichtig.'),
        s('Tipps vom Fachmann', 20, ['tipp', 'frage'], 'Wartung, Pflege, häufige Fragen einfach beantwortet.'),
        s('Leistungen', 15, ['produkt', 'neuigkeit'], 'Was der Betrieb alles macht – viele wissen nur einen Teil.'),
        s('Kundenstimmen', 10, ['kundenstimme', 'danke'], 'Rückmeldungen und abgeschlossene Aufträge.')
      ]
    },
    {
      id: 'gastro', name: 'Gastro / Café',
      zielgruppe: 'Einheimische und Gäste in {Ort}, die gut essen, Kaffee trinken oder einen Platz für Treffen und Feiern suchen.',
      kanalHinweis: 'Instagram für Bilder von Speisen und Stimmung, Facebook für Mittagsmenü und Veranstaltungen, Google für Öffnungszeiten und Bewertungen.',
      saeulen: [
        s('Speisen & Getränke', 35, ['produkt', 'neuigkeit'], 'Gerichte, Mehlspeisen, Getränke – appetitlich fotografiert.'),
        s('Einblicke', 20, ['einblick', 'team'], 'Küche, Service, Lieferanten aus der Region.'),
        s('Angebote & Events', 20, ['angebot', 'event', 'gewinnspiel'], 'Mittagsmenü, Saisonkarte, Veranstaltungen.'),
        s('Stimmung & Gäste', 15, ['kundenstimme', 'frage', 'danke'], 'Atmosphäre zeigen, Gäste einbinden.'),
        s('Infos', 10, ['oeffnungszeiten', 'saison'], 'Öffnungszeiten, Ruhetage, Feiertage.')
      ]
    },
    {
      id: 'verein', name: 'Verein / Sport',
      zielgruppe: 'Mitglieder, Eltern, Fans und Sponsoren aus {Ort} sowie alle, die den Verein kennenlernen oder mitmachen wollen.',
      kanalHinweis: 'Facebook für Termine und Eltern, Instagram für Spielberichte, Bilder und die Jugend.',
      saeulen: [
        s('Spiele & Ergebnisse', 30, ['neuigkeit', 'event'], 'Ankündigungen, Ergebnisse, Tabellenstand.'),
        s('Menschen im Verein', 25, ['team', 'einblick'], 'Spieler, Trainerinnen, Ehrenamtliche vorstellen.'),
        s('Termine & Veranstaltungen', 20, ['event', 'saison'], 'Feste, Trainingszeiten, Schnuppertrainings.'),
        s('Mitmachen', 15, ['stellenanzeige', 'frage'], 'Neue Mitglieder und Helfer gewinnen.'),
        s('Danke & Sponsoren', 10, ['danke', 'kundenstimme'], 'Sponsoren und Helfern öffentlich danken.')
      ]
    },
    {
      id: 'fitness', name: 'Fitness / Physio',
      zielgruppe: 'Menschen aus {Ort} und Umgebung, die fitter werden, Beschwerden loswerden oder gesund bleiben wollen.',
      kanalHinweis: 'Instagram für Übungen als Reels und kurze Tipps, Facebook für Kursangebote, Google für Terminanfragen.',
      saeulen: [
        s('Übungen & Tipps', 35, ['tipp', 'frage'], 'Einfache Übungen und Wissen für den Alltag (keine Heilversprechen).'),
        s('Team & Räume', 20, ['team', 'einblick'], 'Trainerinnen und Therapeuten vorstellen, Räume zeigen.'),
        s('Kurse & Angebote', 20, ['angebot', 'produkt', 'event'], 'Kursplan, neue Kurse, Schnuppertraining.'),
        s('Erfolge & Stimmen', 15, ['kundenstimme', 'danke'], 'Erfahrungen von Mitgliedern (nur mit Einverständnis).'),
        s('Infos', 10, ['oeffnungszeiten', 'neuigkeit', 'saison'], 'Öffnungszeiten, Neuigkeiten.')
      ]
    },
    {
      id: 'einzelhandel', name: 'Einzelhandel',
      zielgruppe: 'Menschen aus {Ort} und Umgebung, die gern vor Ort einkaufen und persönliche Beratung schätzen.',
      kanalHinweis: 'Instagram für neue Ware und Schaufenster, Facebook für Aktionen, Google für Öffnungszeiten und „in der Nähe"-Suchen.',
      saeulen: [
        s('Neue Ware', 35, ['produkt', 'neuigkeit'], 'Was neu im Geschäft ist, Lieblingsstücke der Woche.'),
        s('Aktionen', 20, ['angebot', 'gewinnspiel'], 'Abverkauf, Gutscheine, Aktionen.'),
        s('Beratung & Tipps', 20, ['tipp', 'frage'], 'Wissen zum Sortiment, Geschenkideen.'),
        s('Hinter dem Ladentisch', 15, ['einblick', 'team'], 'Das Team und der Alltag im Geschäft.'),
        s('Infos & Kunden', 10, ['oeffnungszeiten', 'kundenstimme', 'saison'], 'Öffnungszeiten, Rückmeldungen.')
      ]
    },
    {
      id: 'autowerkstatt', name: 'Autowerkstatt',
      zielgruppe: 'Autofahrerinnen und Autofahrer aus {Ort} und Umgebung, die eine ehrliche Werkstatt in der Nähe suchen.',
      kanalHinweis: 'Facebook und das Google-Unternehmensprofil sind am wichtigsten (Bewertungen!). Instagram für Einblicke und die Lehrlingssuche.',
      saeulen: [
        s('Tipps rund ums Auto', 30, ['tipp', 'frage'], 'Reifenwechsel, Pickerl, Winter-Check – einfach erklärt.'),
        s('Werkstatt-Einblicke', 25, ['einblick', 'vorher-nachher'], 'Reparaturen zeigen, erklären, was gemacht wurde.'),
        s('Angebote & Termine', 20, ['angebot', 'produkt', 'oeffnungszeiten'], 'Saison-Angebote, freie Termine.'),
        s('Team', 15, ['team', 'stellenanzeige'], 'Die Mechaniker vorstellen, Lehrlinge suchen.'),
        s('Kundenstimmen', 10, ['kundenstimme', 'danke'], 'Rückmeldungen zufriedener Kunden.')
      ]
    },
    {
      id: 'arzt', name: 'Arzt / Therapie',
      zielgruppe: 'Patientinnen und Patienten aus {Ort} und Umgebung, die eine Praxis mit Zeit und Vertrauen suchen.',
      kanalHinweis: 'Zurückhaltend auftreten: Facebook und Google für Infos und Ordinationszeiten. Für Ärzte gelten Werbebeschränkungen – keine Heilversprechen, keine Patientenfotos ohne schriftliche Einwilligung.',
      saeulen: [
        s('Praxis-Infos', 30, ['oeffnungszeiten', 'neuigkeit'], 'Ordinationszeiten, Urlaub, Vertretung, Neues.'),
        s('Gesundheits-Wissen', 30, ['tipp', 'frage'], 'Sachliche, allgemeine Informationen ohne Heilversprechen.'),
        s('Team & Räume', 20, ['team', 'einblick'], 'Wer arbeitet in der Praxis, wie sieht es aus.'),
        s('Leistungen', 15, ['produkt'], 'Welche Leistungen angeboten werden.'),
        s('Saison', 5, ['saison'], 'Grüße zu Feiertagen.')
      ]
    },
    {
      id: 'fotograf', name: 'Fotograf',
      zielgruppe: 'Paare, Familien und Betriebe im Raum {Ort}, die Fotos für einen besonderen Anlass oder ihren Auftritt brauchen.',
      kanalHinweis: 'Instagram ist das Schaufenster. Facebook für Empfehlungen in lokalen Gruppen, Google für Suchanfragen.',
      saeulen: [
        s('Arbeiten', 40, ['einblick', 'produkt'], 'Die besten Bilder aus Shootings (mit Einverständnis).'),
        s('Hinter der Kamera', 20, ['einblick', 'team'], 'Wie ein Shooting abläuft, Ausrüstung, Orte.'),
        s('Tipps', 15, ['tipp', 'frage'], 'Was anziehen, wie vorbereiten, beste Tageszeit.'),
        s('Angebote & Termine', 15, ['angebot', 'event', 'saison'], 'Mini-Shootings, freie Termine, Gutscheine.'),
        s('Kundenstimmen', 10, ['kundenstimme', 'danke'], 'Rückmeldungen von Paaren und Familien.')
      ]
    },
    {
      id: 'reinigung', name: 'Reinigungsfirma',
      zielgruppe: 'Betriebe, Hausverwaltungen und Privathaushalte im Raum {Ort}, die eine verlässliche Reinigung suchen.',
      kanalHinweis: 'Facebook und Google erreichen Auftraggeber am besten. Instagram hilft vor allem bei der Mitarbeitersuche.',
      saeulen: [
        s('Vorher – Nachher', 30, ['vorher-nachher', 'einblick'], 'Ergebnisse zeigen – das versteht jeder sofort.'),
        s('Leistungen', 25, ['produkt', 'neuigkeit'], 'Was alles gereinigt wird, für wen, wie oft.'),
        s('Team & Jobs', 20, ['team', 'stellenanzeige'], 'Das Team vorstellen und Mitarbeiter suchen.'),
        s('Tipps', 15, ['tipp', 'frage'], 'Putz-Tipps für zu Hause.'),
        s('Kundenstimmen', 10, ['kundenstimme', 'danke', 'saison'], 'Rückmeldungen von Auftraggebern.')
      ]
    }
  ];
})();
