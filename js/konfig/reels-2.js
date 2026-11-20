/* =====================================================================
   reels-2.js – Reel-Ideen für Gastro/Café, Verein/Sport, Fitness/Physio
   ---------------------------------------------------------------------
   Aufbau und MUSTER: siehe reels-1.js
   ===================================================================== */
(function () {
  'use strict';

  var r = SM.konfig.reelIdee;

  SM.konfig.reels.gastro = [
    r('So entsteht unser Bestseller', 'So entsteht unser beliebtestes Gericht', ['Zutaten', 'Zubereitung in 3 Schritten', 'Anrichten', 'Servieren'], ['Frisch gemacht', 'Jeden Tag'], 'genussvoll', 'Von oben und nah filmen, Dampf wirkt gut.'),
    r('Latte Art', 'Schau genau hin', ['Espresso läuft', 'Milch wird gegossen', 'Fertiges Muster'], ['Mit Liebe gemacht'], 'ruhig, jazzig', 'Zeitlupe verwenden, Tasse auf heller Fläche.'),
    r('Morgens im Café', 'Bevor ihr kommt …', ['Licht an', 'Kuchen in die Vitrine', 'Erste Tasse', 'Tür auf'], ['06:30', 'Guten Morgen'], 'sanft', 'Kurze Szenen, warmes Licht.'),
    r('Tagesempfehlung', 'Das gibt es heute bei uns', ['Teller wird hingestellt', 'Nahaufnahme', 'Erster Bissen'], ['Heute: …', 'Nur solange der Vorrat reicht'], 'fröhlich', 'Direkt am Fenster filmen.'),
    r('Mehlspeis-Parade', 'Welche würdest du nehmen?', ['Schwenk über die Vitrine', 'Drei Stücke einzeln', 'Frage an die Zuschauer'], ['1, 2 oder 3?'], 'verspielt', 'Langsam schwenken, Glas vorher putzen.'),
    r('Lieferanten aus der Region', 'Woher kommen unsere Zutaten?', ['Lieferung kommt an', 'Produkt in der Hand', 'Fertiges Gericht'], ['Von … aus …', 'Kurze Wege'], 'bodenständig', 'Nur echte Lieferanten nennen und vorher fragen.'),
    r('Team in der Küche', 'Wer kocht hier eigentlich?', ['Köchin winkt', 'Handgriffe', 'Teller geht raus'], ['Name – seit … bei uns'], 'beschwingt', 'In ruhigen Momenten filmen, nicht im Stress.'),
    r('Gastgarten-Eröffnung', 'Endlich wieder draußen sitzen', ['Tische werden aufgestellt', 'Sonnenschirm geht auf', 'Erstes Getränk'], ['Gastgarten offen ab …'], 'sommerlich', 'Bei Sonne filmen, Gäste nicht erkennbar zeigen.'),
    r('Neue Saisonkarte', 'Neu auf der Karte', ['Karte wird aufgeschlagen', 'Drei neue Gerichte', 'Einladung'], ['Neu', 'Ab sofort'], 'modern', 'Jedes Gericht 2 Sekunden.'),
    r('Reservieren – so geht es', 'So sicherst du dir einen Tisch', ['Handy mit Anruf/Nachricht', 'Tisch wird gedeckt', 'Begrüßung'], ['Anrufen oder schreiben', 'Wir freuen uns'], 'leicht', 'Telefonnummer groß einblenden.')
  ];

  SM.konfig.reels.verein = [
    r('Matchday', 'Heute ist Spieltag', ['Kabine', 'Einlaufen', 'Anpfiff', 'Jubel'], ['Heimspiel', 'Danke für eure Unterstützung'], 'treibend', 'Vom Spielfeldrand filmen, kurze Clips.'),
    r('Training im Schnelldurchlauf', 'So trainiert unsere U12', ['Aufwärmen', 'Übung', 'Abschlussspiel', 'Abklatschen'], ['Dienstag und Donnerstag', 'Komm zum Schnuppern'], 'fröhlich', 'Bei Kindern die Einwilligung der Eltern einholen.'),
    r('Tor der Woche', 'Das Tor der Woche', ['Aufbau', 'Abschluss', 'Jubel'], ['Tor von …'], 'episch', 'In Zeitlupe wiederholen.'),
    r('Ehrenamt sichtbar machen', 'Ohne sie gäbe es kein Heimspiel', ['Platzwart', 'Kantine', 'Kassa'], ['Danke an unsere Helfer'], 'warm', 'Jede Person kurz bei ihrer Aufgabe zeigen.'),
    r('Neue Dressen', 'Unsere neuen Dressen sind da', ['Karton wird geöffnet', 'Anziehen', 'Mannschaftsfoto'], ['Danke an unsere Sponsoren'], 'stolz', 'Sponsoren-Logos gut sichtbar zeigen.'),
    r('Spieler im Kurzporträt', '5 Fragen an …', ['Spieler kommt ins Bild', 'Schnelle Antworten', 'Daumen hoch'], ['Lieblingsverein?', 'Position?', 'Ritual?'], 'locker', 'Fragen als Text einblenden, Antworten kurz.'),
    r('Vereinsfest ankündigen', 'Merkt euch dieses Datum', ['Bilder vom letzten Fest', 'Datum groß', 'Einladung'], ['Vereinsfest am …', 'Für Speis und Trank ist gesorgt'], 'festlich', 'Datum mindestens 3 Sekunden zeigen.'),
    r('Platzpflege', 'Was vor dem Spiel passiert', ['Rasen mähen', 'Linien ziehen', 'Netze aufhängen'], ['Samstag, 7 Uhr'], 'ruhig', 'Zeitraffer vom fix aufgestellten Handy.'),
    r('Nachwuchs gesucht', 'Du willst mitspielen?', ['Kinder beim Training', 'Trainer winkt', 'Trainingszeiten'], ['Schnuppertraining jederzeit'], 'motivierend', 'Trainingszeiten und Kontakt einblenden.'),
    r('Saison-Rückblick', 'Unsere Saison in 20 Sekunden', ['Beste Momente', 'Mannschaft', 'Dank an Fans'], ['Danke für diese Saison'], 'emotional', 'Clips über die Saison sammeln.')
  ];

  SM.konfig.reels.fitness = [
    r('Übung der Woche', 'Diese Übung hilft bei verspannten Schultern', ['Ausgangsposition', 'Ausführung von vorne', 'Ausführung von der Seite'], ['10 Wiederholungen', 'Langsam ausführen'], 'ruhig', 'Ganzen Körper zeigen; keine Heilversprechen.'),
    r('3 Fehler bei der Kniebeuge', 'Machst du diese Fehler bei der Kniebeuge?', ['Fehler 1', 'Fehler 2', 'Fehler 3', 'Richtige Ausführung'], ['Knie nach innen', 'Fersen heben ab', 'Rundrücken', 'So ist es richtig'], 'modern', 'Von der Seite filmen.'),
    r('Rundgang durchs Studio', 'Komm mit durchs Studio', ['Empfang', 'Geräte', 'Kursraum', 'Umkleide'], ['Alles da, was du brauchst'], 'dynamisch', 'Außerhalb der Stoßzeiten filmen, Mitglieder nicht zeigen.'),
    r('5-Minuten-Büro-Pause', '5 Minuten gegen den steifen Nacken', ['Übung 1 am Stuhl', 'Übung 2', 'Übung 3'], ['Je 30 Sekunden'], 'leicht', 'Übungen zum Mitmachen in Echtzeit zeigen.'),
    r('Trainer stellt sich vor', 'Dein Trainer in 15 Sekunden', ['Trainer kommt ins Bild', 'Zeigt Lieblingsübung', 'Einladung'], ['Name', 'Schwerpunkt'], 'beschwingt', 'Frei sprechen lassen, ein Satz reicht.'),
    r('Neuer Kurs', 'Neu im Kursplan', ['Kursraum füllt sich', 'Ausschnitte aus dem Kurs', 'Kurszeiten'], ['Jeden Mittwoch 18:30', 'Jetzt anmelden'], 'energiegeladen', 'Teilnehmer vorher fragen oder nur von hinten zeigen.'),
    r('Erstes Training – so läuft es ab', 'Dein erstes Mal bei uns', ['Begrüßung', 'Einführung am Gerät', 'Trainingsplan'], ['1. Kennenlernen', '2. Einführung', '3. Dein Plan'], 'freundlich', 'Aus Sicht des neuen Mitglieds filmen.'),
    r('Dehnen nach dem Sitzen', 'Nach einem langen Tag am Schreibtisch', ['Hüfte dehnen', 'Brust öffnen', 'Rücken strecken'], ['Je 30 Sekunden halten'], 'entspannt', 'Auf einer Matte, ruhiger Hintergrund.'),
    r('Mythos oder Wahrheit', 'Muss man nach dem Training dehnen?', ['Frage als Text', 'Kurze sachliche Antwort', 'Einladung zu Fragen'], ['Mythos?', 'Das sagen wir dazu'], 'neugierig', 'Sachlich bleiben, keine medizinischen Versprechen.'),
    r('Gerät richtig einstellen', 'So stellst du dieses Gerät richtig ein', ['Sitz einstellen', 'Gewicht wählen', 'Saubere Ausführung'], ['1. Sitzhöhe', '2. Gewicht', '3. Los'], 'sachlich', 'Hände und Hebel in Nahaufnahme.')
  ];
})();
