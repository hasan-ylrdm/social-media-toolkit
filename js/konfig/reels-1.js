/* =====================================================================
   reels-1.js – Reel-Bibliothek: Grundgerüst, Film-Tipps und die Ideen
   für Allgemein, Friseur/Kosmetik und Handwerk
   ---------------------------------------------------------------------
   Aufbau:  SM.konfig.reels[branchenId] = [Ideen]
   Weitere Branchen stehen in reels-2.js bis reels-4.js.
   Jede Branche hat mindestens 10 Ideen (der Selbsttest prüft das).

   NEUE IDEE: mit SM.konfig.reelIdee(…) nach dem Muster in die Liste der
   Branche schreiben.
   MUSTER:
     SM.konfig.reelIdee(
       'Titel der Idee',
       'Hook: der erste Satz/das erste Bild (1–2 Sekunden)',
       ['Szene 1', 'Szene 2', 'Szene 3'],            // Kurz-Drehbuch
       ['Text-Einblendung 1', 'Text-Einblendung 2'],  // was im Video als Text erscheint
       'Musik-Stimmung',
       'Hinweis zum Filmen mit dem Handy'
     )
   ===================================================================== */
(function () {
  'use strict';

  /**
   * Baut eine Reel-Idee.
   * @param {string} titel
   * @param {string} hook
   * @param {string[]} szenen
   * @param {string[]} einblendungen
   * @param {string} musik
   * @param {string} tipp
   * @returns {Object} {titel, hook, szenen, einblendungen, musik, tipp}
   */
  SM.konfig.reelIdee = function (titel, hook, szenen, einblendungen, musik, tipp) {
    return { titel: titel, hook: hook, szenen: szenen, einblendungen: einblendungen, musik: musik, tipp: tipp };
  };

  /**
   * Die Reel-Ideen einer Branche (ohne Rückgriff auf "allgemein").
   * @param {string} branchenId
   * @returns {Array<Object>}
   */
  SM.konfig.reelIdeenFuer = function (branchenId) {
    return SM.konfig.reels[branchenId] || SM.konfig.reels.allgemein || [];
  };

  /* Allgemeine Hinweise zum Filmen mit dem Handy (stehen oben in der Bibliothek) */
  SM.konfig.reelFilmTipps = [
    'Immer hochkant filmen (9:16) und die Linse vorher abwischen.',
    'Licht von vorne oder von der Seite: ans Fenster stellen, nie gegen das Fenster filmen.',
    'Kurze Szenen von 2–4 Sekunden drehen – lieber mehr Szenen als eine lange.',
    'Handy mit beiden Händen halten oder anlehnen; langsame, ruhige Bewegungen.',
    'Wichtige Texte in die Mitte: oben und unten verdecken Schaltflächen der App das Bild.',
    'Die ersten 2 Sekunden entscheiden: mit dem spannendsten Bild oder einer Frage beginnen.',
    'Ton: Bei Sprache nah ans Handy gehen und Hintergrundgeräusche abstellen.',
    'Personen nur mit Einwilligung filmen (Vorlage unter „Strategie").',
    'Musik nur aus der Bibliothek der App wählen – dort ist die Nutzung für Geschäftskonten geregelt.',
    'Gesamtlänge 10–30 Sekunden reicht für die meisten Ideen.'
  ];

  var r = SM.konfig.reelIdee;
  SM.konfig.reels = {};

  SM.konfig.reels.allgemein = [
    r('Ein Tag bei uns', 'So sieht ein Tag bei uns aus', ['Aufsperren am Morgen', 'Drei kurze Arbeitsszenen', 'Team winkt zum Feierabend'], ['07:30 – Aufsperren', 'Mittendrin', 'Bis morgen!'], 'fröhlich, leicht', 'Über den Tag verteilt je 3 Sekunden filmen.'),
    r('3 Dinge, die du über uns nicht wusstest', '3 Dinge, die kaum jemand über uns weiß', ['Fakt 1 mit passendem Bild', 'Fakt 2', 'Fakt 3 und Einladung'], ['1.', '2.', '3.', 'Komm vorbei!'], 'neugierig, modern', 'Nur wahre Fakten nennen, jede Szene gleich lang.'),
    r('Team-Vorstellung im Schnelldurchlauf', 'Das ist unser Team', ['Jede Person kommt ins Bild und winkt', 'Name wird eingeblendet', 'Gruppenbild'], ['Name + Aufgabe je Person', 'Wir freuen uns auf euch'], 'beschwingt', 'Alle am selben Platz filmen, dann wirkt der Schnitt wie ein Wechsel.'),
    r('Häufigste Frage beantwortet', 'Das werden wir am häufigsten gefragt', ['Frage als Text', 'Antwort in zwei Sätzen in die Kamera', 'Hinweis auf Kontakt'], ['Die Frage', 'Die Antwort in Stichworten'], 'ruhig', 'Auf Augenhöhe filmen, kurz und frei sprechen.'),
    r('Vom Auftrag zum Ergebnis', 'Vom ersten Gespräch bis zum fertigen Ergebnis', ['Anfrage/Beratung', 'Arbeit in 3 Schritten', 'Fertiges Ergebnis'], ['Schritt 1', 'Schritt 2', 'Fertig!'], 'motivierend', 'Das Ergebnis am Ende 2 Sekunden länger zeigen.'),
    r('Wo ihr uns findet', 'So findet ihr zu uns', ['Blick von der Straße', 'Eingang', 'Begrüßung drinnen'], ['Adresse', 'Öffnungszeiten'], 'entspannt', 'Den Weg aus Sicht eines Kunden gehen und filmen.'),
    r('Unser Lieblings-Werkzeug', 'Ohne das geht bei uns nichts', ['Gegenstand in Nahaufnahme', 'Im Einsatz', 'Ergebnis'], ['Unser wichtigstes Werkzeug', 'Darum'], 'verspielt', 'Nahaufnahmen wirken am Handy am besten.'),
    r('Danke an unsere Kunden', 'Danke!', ['Team sagt nacheinander Danke', 'Bilder aus dem Alltag', 'Gemeinsames Winken'], ['Danke für euer Vertrauen'], 'warm', 'Jede Person nur ein Wort sagen lassen, dann zusammenschneiden.'),
    r('Vorher – Nachher', 'Schaut euch diesen Unterschied an', ['Vorher-Bild', 'Schneller Übergang (Hand vor die Linse)', 'Nachher-Bild'], ['Vorher', 'Nachher'], 'Überraschung, Beat-Wechsel', 'Vorher und Nachher aus derselben Position filmen.'),
    r('Saison-Gruß', 'Wir wünschen euch …', ['Dekorierter Betrieb', 'Team mit Gruß', 'Hinweis auf Öffnungszeiten'], ['Schöne Feiertage', 'Wir sind wieder da am …'], 'festlich', 'Kurz halten, maximal 10 Sekunden.')
  ];

  SM.konfig.reels.friseur = [
    r('Verwandlung in 10 Sekunden', 'Von „ich brauch was Neues" zu …', ['Kundin von hinten vorher', 'Farbe auftragen, Waschen, Föhnen im Zeitraffer', 'Dreh zur Kamera mit dem Ergebnis'], ['Vorher', '3 Stunden später', 'Nachher'], 'Beat mit Wechsel beim Ergebnis', 'Einwilligung der Kundin einholen, am Fenster filmen.'),
    r('Balayage Schritt für Schritt', 'So entsteht eine Balayage', ['Abteilen', 'Aufhellen', 'Tönen', 'Ergebnis im Licht'], ['1. Abteilen', '2. Aufhellen', '3. Glossing', 'Fertig'], 'ruhig, elegant', 'Jede Szene 2–3 Sekunden, Hände in Nahaufnahme.'),
    r('3 Fehler beim Föhnen', 'Diese 3 Fehler machen fast alle beim Föhnen', ['Fehler 1 zeigen', 'Fehler 2', 'Fehler 3', 'So geht es richtig'], ['Zu heiß', 'Ohne Hitzeschutz', 'Gegen die Wuchsrichtung', 'So geht\'s'], 'locker', 'Am Übungskopf oder einer Kollegin zeigen.'),
    r('Ein Tag im Salon', 'Ein Samstag bei uns im Salon', ['Aufsperren', 'Kaffee für die erste Kundin', 'Drei Arbeitsszenen', 'Zusammenkehren'], ['08:00', 'Los geht\'s', 'Feierabend'], 'fröhlich', 'Über den Tag verteilt kurze Clips sammeln.'),
    r('Produkt richtig anwenden', 'So viel Shampoo brauchst du wirklich', ['Menge in der Hand zeigen', 'Aufschäumen', 'Ergebnis'], ['Eine haselnussgroße Menge reicht', 'Nur am Ansatz'], 'leicht', 'Nahaufnahme der Hand, heller Hintergrund.'),
    r('Schnitt im Zeitraffer', 'Ein Haarschnitt in 15 Sekunden', ['Kamm durchs Haar', 'Schneiden im Zeitraffer', 'Finish'], ['Vorher', 'Nachher'], 'schneller Beat', 'Handy auf ein Stativ oder ins Regal stellen.'),
    r('Team stellt sich vor', 'Wer schneidet hier eigentlich?', ['Jede Stylistin dreht sich im Stuhl zur Kamera', 'Name und Spezialgebiet eingeblendet'], ['Name – Spezialgebiet'], 'beschwingt', 'Alle am selben Stuhl filmen.'),
    r('Trendfarbe der Saison', 'Diese Farbe wollen jetzt alle', ['Farbkarte', 'Ergebnis an einer Kundin', 'Detail im Licht'], ['Trend im Herbst', 'Passt zu'], 'modern', 'Nur mit Einwilligung, Farben bei Tageslicht filmen.'),
    r('Was kostet eigentlich …?', 'Was kostet eine neue Haarfarbe?', ['Frage als Text', 'Erklärung, wovon der Preis abhängt', 'Hinweis auf Beratung'], ['Kommt an auf: Länge, Technik, Zeit', 'Beratung kostenlos'], 'ruhig', 'Ehrlich bleiben und echte Preise aus der Preisliste nennen.'),
    r('Hochsteckfrisur für Ball oder Hochzeit', 'Ballsaison? So entsteht eine Hochsteckfrisur', ['Ausgangshaar', 'Stecken in 3 Schritten', 'Ergebnis von allen Seiten'], ['Jetzt Termin sichern'], 'festlich', 'Um die Frisur herumgehen, langsam drehen.')
  ];

  SM.konfig.reels.handwerk = [
    r('Baustelle im Zeitraffer', 'Ein Tag Arbeit in 15 Sekunden', ['Leerer Raum am Morgen', 'Zeitraffer der Arbeit', 'Fertiger Stand am Abend'], ['07:00', '16:00', 'Fertig'], 'kraftvoll', 'Handy fix montieren, alle 10 Minuten ein paar Sekunden filmen.'),
    r('Vorher – Nachher Sanierung', 'So sah das Bad vorher aus', ['Altes Bad', 'Übergang', 'Neues Bad im Schwenk'], ['Vorher', 'Nachher', 'In 2 Wochen'], 'Überraschung', 'Gleicher Standpunkt für beide Aufnahmen; echte Dauer nennen.'),
    r('Werkzeug erklärt', 'Wofür braucht man das eigentlich?', ['Werkzeug in der Hand', 'Im Einsatz', 'Ergebnis'], ['Das ist ein …', 'Dafür brauchen wir es'], 'neugierig', 'Nahaufnahme, Maschine aus Sicherheitsgründen fest halten.'),
    r('3 Tipps vom Fachmann', '3 Dinge, die Sie vor dem Winter prüfen sollten', ['Tipp 1 vor Ort zeigen', 'Tipp 2', 'Tipp 3'], ['1.', '2.', '3.', 'Fragen? Anrufen'], 'sachlich', 'Draußen bei Tageslicht filmen.'),
    r('Lehrling zeigt seine Arbeit', 'Das habe ich in meinem ersten Lehrjahr gelernt', ['Lehrling stellt sich vor', 'Zeigt ein Werkstück', 'Einladung zum Schnuppern'], ['Name, 1. Lehrjahr', 'Wir bilden aus'], 'motivierend', 'Bei Minderjährigen Einwilligung der Eltern einholen.'),
    r('Material-Kunde', 'Warum wir dieses Material verwenden', ['Material in der Hand', 'Verarbeitung', 'Fertige Fläche'], ['Langlebig', 'Aus der Region'], 'ruhig', 'Struktur in Nahaufnahme zeigen.'),
    r('Fuhrpark und Team', 'Wir rücken aus', ['Autos fahren vom Hof', 'Ankunft beim Kunden', 'Team bei der Arbeit'], ['Unterwegs im Tennengau'], 'dynamisch', 'Kennzeichen fremder Autos nicht zeigen.'),
    r('Pfusch erkennen', 'Woran erkennt man saubere Arbeit?', ['Detail einer sauberen Fuge/Kante', 'Erklärung', 'Gesamtbild'], ['Darauf achten wir'], 'sachlich', 'Keine fremden Betriebe schlechtmachen, nur eigene Arbeit zeigen.'),
    r('Werkstatt-Rundgang', 'Kommt mit in unsere Werkstatt', ['Tür geht auf', 'Maschinen', 'Team grüßt'], ['Hier entsteht alles'], 'entspannt', 'Langsam gehen, Handy ruhig auf Brusthöhe.'),
    r('Kundenprojekt übergeben', 'Der schönste Moment: die Übergabe', ['Letzter Handgriff', 'Kunde sieht das Ergebnis', 'Handschlag'], ['Fertig!', 'Danke für den Auftrag'], 'warm', 'Kunden vorher fragen, ob sie gezeigt werden wollen.')
  ];
})();
