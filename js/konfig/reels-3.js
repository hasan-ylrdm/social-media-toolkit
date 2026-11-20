/* =====================================================================
   reels-3.js – Reel-Ideen für Einzelhandel, Autowerkstatt und
   Arzt/Therapie
   ---------------------------------------------------------------------
   Aufbau und MUSTER: siehe js/konfig/reels-1.js.
   Bei Arzt/Therapie besonders wichtig: keine Patienten zeigen, keine
   Heilversprechen, keine Vorher-Nachher-Bilder (Werbebeschränkungen
   für Gesundheitsberufe).
   ===================================================================== */
(function () {
  'use strict';

  var r = SM.konfig.reelIdee;

  SM.konfig.reels.einzelhandel = [
    r('Neu eingetroffen', 'Frisch ausgepackt – schaut mal', ['Karton wird geöffnet', 'Produkt in der Hand', 'Produkt im Regal'], ['Neu bei uns', 'Ab sofort im Geschäft'], 'fröhlich', 'Am Fenster filmen, Hände ruhig halten.'),
    r('3 Geschenkideen unter 30 Euro', 'Du suchst noch ein Geschenk?', ['Idee 1 zeigen', 'Idee 2 zeigen', 'Idee 3 zeigen', 'Verpackt auf der Theke'], ['Idee 1', 'Idee 2', 'Idee 3', 'Wir verpacken gratis'], 'leicht', 'Jedes Produkt 2–3 Sekunden, gleicher Hintergrund.'),
    r('Rundgang durchs Geschäft', 'Komm mit, ich zeig dir unser Geschäft', ['Eingang', 'Lieblingsregal', 'Kassa mit Gruß'], ['Mitten in {Ort}', 'Mo–Sa für euch da'], 'beschwingt', 'Langsam gehen, Handy mit beiden Händen halten.'),
    r('So verpacken wir Geschenke', 'Das schönste Packerl in 20 Sekunden', ['Papier zuschneiden', 'Falten', 'Schleife binden', 'Fertiges Packerl'], ['Gratis Geschenkservice'], 'ruhig', 'Von oben filmen (Handy auf ein Regal legen).'),
    r('Lieblingsstück der Woche', 'Mein Lieblingsstück diese Woche', ['Mitarbeiter hält das Produkt', 'Detail in Nahaufnahme', 'Preis-Schild'], ['Warum ich es mag', 'Nur solange der Vorrat reicht'], 'modern', 'Einen Satz frei sprechen lassen – das wirkt echter als Text.'),
    r('Schaufenster wird neu', 'Unser Schaufenster bekommt ein neues Gesicht', ['Altes Schaufenster', 'Umbau im Zeitraffer', 'Fertig von außen'], ['Vorher', 'Nachher'], 'dynamisch', 'Zeitraffer: Handy fix aufstellen, nicht bewegen.'),
    r('Das fragen uns Kunden oft', 'Die häufigste Frage bei uns', ['Frage als Text', 'Antwort am Produkt zeigen', 'Einladung zur Beratung'], ['Frage', 'Antwort', 'Wir beraten gern'], 'freundlich', 'Kurz und konkret bleiben.'),
    r('Vom Lieferanten ins Regal', 'Woher kommt das eigentlich?', ['Lieferung kommt an', 'Auspacken', 'Etikett mit Herkunft'], ['Aus der Region', 'Direkt vom Erzeuger'], 'warm', 'Nur zeigen, was wirklich stimmt – Herkunft nicht erfinden.'),
    r('Ein Tag im Geschäft', 'Ein Tag bei uns in 20 Sekunden', ['Aufsperren', 'Ware einräumen', 'Kundengespräch von hinten', 'Zusperren'], ['08:00', '12:00', '18:00'], 'beschwingt', 'Kunden nur mit Einverständnis oder unkenntlich zeigen.'),
    r('Aktion der Woche', 'Diese Woche bei uns im Angebot', ['Produkt', 'Preis-Schild', 'Geschäft von außen'], ['Nur bis Samstag', 'Solange der Vorrat reicht'], 'energiegeladen', 'Preis gut lesbar ins Bild halten.')
  ];

  SM.konfig.reels.autowerkstatt = [
    r('Reifenwechsel im Zeitraffer', 'Reifenwechsel in 15 Sekunden', ['Auto auf der Hebebühne', 'Räder ab', 'Räder drauf', 'Daumen hoch'], ['Jetzt Termin sichern'], 'dynamisch', 'Handy fix aufstellen, Zeitraffer-Modus.'),
    r('Was bedeutet diese Warnleuchte?', 'Diese Leuchte solltest du nicht ignorieren', ['Leuchte am Armaturenbrett', 'Mechaniker erklärt', 'Blick unter die Motorhaube'], ['Motorkontrollleuchte', 'Lieber gleich prüfen lassen'], 'sachlich', 'Im Auto ist es dunkel: Innenlicht einschalten.'),
    r('Profiltiefe selbst prüfen', 'So prüfst du dein Reifenprofil mit einer Münze', ['Münze ins Profil stecken', 'Nahaufnahme', 'Abgefahrener Reifen im Vergleich'], ['Mindestens 1,6 mm', 'Bei Winterreifen 4 mm'], 'ruhig', 'Nahaufnahme: Handy nah heran, kurz warten bis es scharf stellt.'),
    r('Vor dem Pickerl', 'Das prüfen wir beim Pickerl', ['Licht', 'Bremsen', 'Unterboden', 'Plakette'], ['Licht', 'Bremsen', 'Rost', 'Bestanden'], 'modern', 'Jede Station nur 2–3 Sekunden.'),
    r('Rundgang durch die Werkstatt', 'Komm mit in die Werkstatt', ['Tor geht auf', 'Hebebühnen', 'Werkzeugwand', 'Team winkt'], ['Meisterbetrieb in {Ort}'], 'kräftig', 'Aufgeräumte Werkstatt zeigen, Kennzeichen von Kundenautos vermeiden.'),
    r('Winter-Check', 'Ist dein Auto bereit für den Winter?', ['Batterie messen', 'Frostschutz prüfen', 'Wischerblätter', 'Reifen'], ['Batterie', 'Frostschutz', 'Wischer', 'Reifen'], 'frisch', 'Messgerät mit Anzeige gut lesbar filmen.'),
    r('Bremsen vorher – nachher', 'So sieht eine abgefahrene Bremsscheibe aus', ['Alte Scheibe', 'Neue Scheibe daneben', 'Einbau'], ['Alt', 'Neu', 'Sicher unterwegs'], 'sachlich', 'Beide Teile nebeneinander auf einen hellen Untergrund legen.'),
    r('Lehrling stellt sich vor', 'Unser Lehrling in 15 Sekunden', ['Lehrling bei der Arbeit', 'Lieblingsaufgabe', 'Gruß in die Kamera'], ['Name', 'Lehrjahr', 'Wir bilden aus'], 'beschwingt', 'Vorher fragen, ob er oder sie gezeigt werden möchte (bei unter 18: Eltern).'),
    r('Ölstand selbst prüfen', 'Ölstand prüfen in 4 Schritten', ['Motorhaube auf', 'Messstab ziehen und abwischen', 'Wieder einstecken, ziehen', 'Ablesen'], ['1', '2', '3', '4 – zwischen Min und Max'], 'ruhig', 'Messstab vor hellem Tuch zeigen.'),
    r('Das hören wir oft', 'Das Geräusch kennst du vielleicht', ['Auto fährt in die Halle', 'Mechaniker hört hin', 'Ursache gefunden'], ['Quietschen beim Bremsen?', 'Meist sind es die Beläge'], 'neugierig', 'Originalton lassen, nicht mit Musik überdecken.')
  ];

  SM.konfig.reels.arzt = [
    r('Rundgang durch die Ordination', 'So sieht es bei uns aus', ['Eingang', 'Anmeldung', 'Wartezimmer', 'Behandlungsraum (leer)'], ['Herzlich willkommen', 'Barrierefrei erreichbar'], 'ruhig', 'Nur leere Räume filmen, keine Patienten, keine Unterlagen im Bild.'),
    r('Ihr erster Termin', 'So läuft Ihr erster Besuch ab', ['Anmeldung', 'Gespräch (nur Team)', 'Verabschiedung'], ['1. Anmeldung', '2. Gespräch', '3. Nächste Schritte'], 'freundlich', 'Mit Team-Mitgliedern nachstellen, niemals mit echten Patienten.'),
    r('Team stellt sich vor', 'Wer ist für Sie da?', ['Jedes Team-Mitglied kurz', 'Gruppenbild'], ['Name und Aufgabe'], 'warm', 'Alle vorher fragen; ein Lächeln reicht, Text ist optional.'),
    r('So erreichen Sie uns', 'Termin vereinbaren – so geht es', ['Telefon', 'Online-Buchung am Bildschirm', 'Öffnungszeiten-Schild'], ['Telefonisch', 'Online', 'Unsere Zeiten'], 'sachlich', 'Bildschirm ohne Patientendaten zeigen.'),
    r('Was bringe ich mit?', 'Das brauchen Sie beim ersten Termin', ['e-card', 'Überweisung', 'Befunde in einer Mappe'], ['e-card', 'Überweisung', 'Vorbefunde'], 'leicht', 'Muster-Unterlagen ohne echte Namen verwenden.'),
    r('Parken und Anfahrt', 'So finden Sie zu uns', ['Straße', 'Parkplatz', 'Eingang', 'Lift'], ['Parkplätze vor dem Haus', '2. Stock mit Lift'], 'ruhig', 'Vom Auto bis zur Tür in einem Zug filmen.'),
    r('Urlaub und Vertretung', 'Wir sind auf Urlaub', ['Schild an der Tür', 'Kalender', 'Vertretung als Text'], ['Geschlossen von … bis …', 'Vertretung: …'], 'sachlich', 'Text groß und lange genug einblenden (mindestens 3 Sekunden).'),
    r('Ein Gerät kurz erklärt', 'Was macht eigentlich dieses Gerät?', ['Gerät im Raum', 'Team-Mitglied zeigt die Bedienung', 'Bildschirm ohne Daten'], ['Wofür es da ist', 'So läuft es ab'], 'neugierig', 'Sachlich bleiben: erklären, was passiert – nichts versprechen.'),
    r('Häufige Frage', 'Das werden wir oft gefragt', ['Frage als Text', 'Kurze sachliche Antwort', 'Hinweis auf persönliches Gespräch'], ['Frage', 'Antwort', 'Im Zweifel bitte anrufen'], 'ruhig', 'Allgemein bleiben, keine Diagnosen oder Ratschläge für Einzelfälle.'),
    r('Vorsorge-Erinnerung', 'Wann war Ihre letzte Vorsorgeuntersuchung?', ['Kalenderblatt', 'Anmeldung', 'Telefon'], ['Einmal im Jahr', 'Termin vereinbaren'], 'freundlich', 'Neutral erinnern, keine Angst machen.')
  ];
})();
