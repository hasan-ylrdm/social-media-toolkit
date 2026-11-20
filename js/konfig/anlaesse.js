/* =====================================================================
   anlaesse.js – Feiertage und saisonale Anlässe im Kalender
   ---------------------------------------------------------------------
   Jeder Eintrag hat eine "regel", aus der js/kern/kalender-daten.js für
   jedes Jahr das Datum berechnet:

     { typ: 'fest', monat: 12, tag: 24 }                    fixer Tag
     { typ: 'ostern', versatz: 49 }                         Tage ab Ostersonntag (negativ = davor)
     { typ: 'nterWochentag', monat: 5, wochentag: 6, n: 2 } z. B. 2. Sonntag im Mai (Montag = 0 … Sonntag = 6);
                                                            optional versatz: Tage danach (Black Friday = Tag nach dem 4. Donnerstag)
     { typ: 'advent', n: 1 }                                1.–4. Adventsonntag
     { typ: 'schulstart' }                                  erster Schultag in Salzburg

   art:  'feiertag' = gesetzlicher Feiertag in Österreich (viele Betriebe
                      haben zu → Beitrag "Öffnungszeiten" einplanen)
         'anlass'   = guter Aufhänger für einen Beitrag
   idee: kurzer Vorschlag, was man dazu posten kann (erscheint im Kalender)

   Die Schulferien (Salzburg) werden in kalender-daten.js berechnet.

   NEUER ANLASS: Eintrag nach dem Muster ergänzen.
   MUSTER:
     { titel: 'Tag des Kaffees', art: 'anlass', regel: { typ: 'fest', monat: 10, tag: 1 }, idee: 'Lieblingskaffee zeigen' }
   ===================================================================== */
(function () {
  'use strict';

  SM.konfig.anlaesse = [
    /* Gesetzliche Feiertage Österreich */
    { titel: 'Neujahr', art: 'feiertag', regel: { typ: 'fest', monat: 1, tag: 1 }, idee: 'Neujahrsgruß und Dank an die Kunden' },
    { titel: 'Heilige Drei Könige', art: 'feiertag', regel: { typ: 'fest', monat: 1, tag: 6 }, idee: 'Öffnungszeiten rund um den Feiertag' },
    { titel: 'Ostermontag', art: 'feiertag', regel: { typ: 'ostern', versatz: 1 }, idee: 'Öffnungszeiten zu Ostern' },
    { titel: 'Staatsfeiertag', art: 'feiertag', regel: { typ: 'fest', monat: 5, tag: 1 }, idee: 'Öffnungszeiten am 1. Mai' },
    { titel: 'Christi Himmelfahrt', art: 'feiertag', regel: { typ: 'ostern', versatz: 39 }, idee: 'Öffnungszeiten am Feiertag und am Fenstertag' },
    { titel: 'Pfingstmontag', art: 'feiertag', regel: { typ: 'ostern', versatz: 50 }, idee: 'Öffnungszeiten zu Pfingsten' },
    { titel: 'Fronleichnam', art: 'feiertag', regel: { typ: 'ostern', versatz: 60 }, idee: 'Öffnungszeiten am Feiertag und am Fenstertag' },
    { titel: 'Mariä Himmelfahrt', art: 'feiertag', regel: { typ: 'fest', monat: 8, tag: 15 }, idee: 'Öffnungszeiten am Feiertag' },
    { titel: 'Nationalfeiertag', art: 'feiertag', regel: { typ: 'fest', monat: 10, tag: 26 }, idee: 'Öffnungszeiten am Nationalfeiertag' },
    { titel: 'Allerheiligen', art: 'feiertag', regel: { typ: 'fest', monat: 11, tag: 1 }, idee: 'Öffnungszeiten am Feiertag' },
    { titel: 'Mariä Empfängnis', art: 'feiertag', regel: { typ: 'fest', monat: 12, tag: 8 }, idee: 'Hat der Betrieb am 8. Dezember offen?' },
    { titel: 'Christtag', art: 'feiertag', regel: { typ: 'fest', monat: 12, tag: 25 }, idee: 'Weihnachtsgruß' },
    { titel: 'Stefanitag', art: 'feiertag', regel: { typ: 'fest', monat: 12, tag: 26 }, idee: 'Öffnungszeiten zwischen den Feiertagen' },

    /* Saisonale Anlässe */
    { titel: 'Valentinstag', art: 'anlass', regel: { typ: 'fest', monat: 2, tag: 14 }, idee: 'Angebot oder Gutschein zum Verschenken' },
    { titel: 'Faschingsdienstag', art: 'anlass', regel: { typ: 'ostern', versatz: -47 }, idee: 'Lustiger Einblick ins Team' },
    { titel: 'Weltfrauentag', art: 'anlass', regel: { typ: 'fest', monat: 3, tag: 8 }, idee: 'Die Frauen im Team vorstellen' },
    { titel: 'Frühlingsbeginn', art: 'anlass', regel: { typ: 'fest', monat: 3, tag: 20 }, idee: 'Was ist im Frühling neu?' },
    { titel: 'Palmsonntag', art: 'anlass', regel: { typ: 'ostern', versatz: -7 }, idee: 'Ostern ankündigen' },
    { titel: 'Karfreitag', art: 'anlass', regel: { typ: 'ostern', versatz: -2 }, idee: 'Öffnungszeiten zu Ostern' },
    { titel: 'Ostersonntag', art: 'anlass', regel: { typ: 'ostern', versatz: 0 }, idee: 'Ostergruß' },
    { titel: 'Muttertag', art: 'anlass', regel: { typ: 'nterWochentag', monat: 5, wochentag: 6, n: 2 }, idee: 'Geschenkidee oder Gutschein, rechtzeitig vorher posten' },
    { titel: 'Pfingstsonntag', art: 'anlass', regel: { typ: 'ostern', versatz: 49 }, idee: 'Langes Wochenende: Öffnungszeiten' },
    { titel: 'Vatertag', art: 'anlass', regel: { typ: 'nterWochentag', monat: 6, wochentag: 6, n: 2 }, idee: 'Geschenkidee oder Gutschein' },
    { titel: 'Sommerbeginn', art: 'anlass', regel: { typ: 'fest', monat: 6, tag: 21 }, idee: 'Sommer-Angebot, Urlaubszeiten ankündigen' },
    { titel: 'Schulstart Salzburg', art: 'anlass', regel: { typ: 'schulstart' }, idee: 'Alltag beginnt wieder: Angebote für den Herbst' },
    { titel: 'Herbstbeginn', art: 'anlass', regel: { typ: 'fest', monat: 9, tag: 22 }, idee: 'Was ist im Herbst neu?' },
    { titel: 'Rupertitag (Landesfeiertag Salzburg)', art: 'anlass', regel: { typ: 'fest', monat: 9, tag: 24 }, idee: 'Schulfrei in Salzburg, Rupertikirtag: lokaler Bezug' },
    { titel: 'Halloween', art: 'anlass', regel: { typ: 'fest', monat: 10, tag: 31 }, idee: 'Lockerer, lustiger Beitrag' },
    { titel: 'Martinstag', art: 'anlass', regel: { typ: 'fest', monat: 11, tag: 11 }, idee: 'Faschingsbeginn, Ganslzeit' },
    { titel: 'Black Friday', art: 'anlass', regel: { typ: 'nterWochentag', monat: 11, wochentag: 3, n: 4, versatz: 1 }, idee: 'Nur mitmachen, wenn es zum Betrieb passt' },
    { titel: '1. Advent', art: 'anlass', regel: { typ: 'advent', n: 1 }, idee: 'Adventzeit beginnt: Gutscheine, Geschenkideen' },
    { titel: '2. Advent', art: 'anlass', regel: { typ: 'advent', n: 2 }, idee: 'Einblick in die Weihnachtsvorbereitung' },
    { titel: '3. Advent', art: 'anlass', regel: { typ: 'advent', n: 3 }, idee: 'Letzte Bestell- und Terminmöglichkeiten vor Weihnachten' },
    { titel: '4. Advent', art: 'anlass', regel: { typ: 'advent', n: 4 }, idee: 'Öffnungszeiten über die Feiertage' },
    { titel: 'Krampustag', art: 'anlass', regel: { typ: 'fest', monat: 12, tag: 5 }, idee: 'Lokales Brauchtum, Krampuslauf' },
    { titel: 'Nikolaus', art: 'anlass', regel: { typ: 'fest', monat: 12, tag: 6 }, idee: 'Kleine Aufmerksamkeit für Kunden' },
    { titel: 'Heiliger Abend', art: 'anlass', regel: { typ: 'fest', monat: 12, tag: 24 }, idee: 'Weihnachtsgruß vom ganzen Team' },
    { titel: 'Silvester', art: 'anlass', regel: { typ: 'fest', monat: 12, tag: 31 }, idee: 'Rückblick auf das Jahr und Danke' }
  ];
})();
