/* =====================================================================
   reels-4.js – Reel-Ideen für Fotograf und Reinigungsfirma
   ---------------------------------------------------------------------
   Aufbau und MUSTER: siehe js/konfig/reels-1.js.
   ===================================================================== */
(function () {
  'use strict';

  var r = SM.konfig.reelIdee;

  SM.konfig.reels.fotograf = [
    r('Hinter den Kulissen', 'So entsteht dieses Foto', ['Aufbau am Set', 'Fotograf bei der Arbeit', 'Fertiges Bild'], ['Vorher', 'Das Ergebnis'], 'modern', 'Handy auf ein Stativ stellen und einfach mitlaufen lassen.'),
    r('Vom Rohbild zum fertigen Foto', 'Vor und nach der Bearbeitung', ['Rohbild', 'Bearbeitung am Bildschirm', 'Fertiges Bild'], ['Aus der Kamera', 'Fertig'], 'ruhig', 'Bildschirm leicht schräg filmen, damit er nicht flimmert.'),
    r('3 Posen, die immer gehen', 'Du weißt nie, wohin mit den Händen?', ['Pose 1', 'Pose 2', 'Pose 3'], ['Hände in die Taschen', 'Leicht zur Seite drehen', 'Gehen statt stehen'], 'leicht', 'Mit einer Person zeigen, die einverstanden ist.'),
    r('Was ziehe ich an?', 'Outfit-Tipps für euer Familien-Shooting', ['Kleidung auf dem Bett', 'Farben nebeneinander', 'Beispielbild'], ['Ruhige Farben', 'Keine großen Logos', 'Aufeinander abgestimmt'], 'freundlich', 'Von oben filmen.'),
    r('Meine Kameratasche', 'Das ist bei jedem Shooting dabei', ['Tasche öffnen', 'Kamera', 'Objektive', 'Kleinkram'], ['Kamera', 'Lieblingsobjektiv', 'Ersatzakku'], 'beschwingt', 'Jedes Teil kurz in die Hand nehmen.'),
    r('Lieblingsplätze in der Region', 'Hier fotografiere ich am liebsten', ['Ort 1', 'Ort 2', 'Ort 3'], ['Platz 1', 'Platz 2', 'Platz 3'], 'weit', 'Ruhige Schwenks, am besten bei Abendlicht.'),
    r('Ein Hochzeitstag in 20 Sekunden', 'Ein Hochzeitstag aus meiner Sicht', ['Ankommen', 'Trauung von hinten', 'Paarshooting', 'Feier'], ['14:00', '15:00', '17:00', '20:00'], 'gefühlvoll', 'Nur mit schriftlichem Einverständnis des Paares veröffentlichen.'),
    r('Bilder aussuchen – so geht es', 'So bekommt ihr eure Bilder', ['Online-Galerie am Bildschirm', 'Auswahl anklicken', 'Fertige Abzüge'], ['1. Galerie', '2. Auswahl', '3. Abzüge'], 'sachlich', 'Galerie mit Beispielbildern zeigen, nicht mit Kundenbildern ohne Erlaubnis.'),
    r('Licht macht den Unterschied', 'Gleiches Motiv, anderes Licht', ['Foto am Mittag', 'Foto am Abend', 'Beide nebeneinander'], ['12 Uhr', '19 Uhr'], 'ruhig', 'Dasselbe Motiv vom selben Standpunkt.'),
    r('Kundenstimme', 'Das hat mich diese Woche gefreut', ['Nachricht als Text', 'Passendes Bild', 'Gruß'], ['Danke!'], 'warm', 'Nachricht und Bild nur mit Einverständnis zeigen.')
  ];

  SM.konfig.reels.reinigung = [
    r('Vorher – Nachher', 'Schau dir diesen Unterschied an', ['Schmutzige Fläche', 'Reinigung', 'Saubere Fläche'], ['Vorher', 'Nachher'], 'zufrieden', 'Vom selben Standpunkt filmen, damit der Vergleich stimmt.'),
    r('Fenster streifenfrei', 'So werden Fenster streifenfrei', ['Einseifen', 'Abziehen', 'Kanten trocknen'], ['1. Einwaschen', '2. Abziehen', '3. Kanten'], 'ruhig', 'Gegen das Licht filmen zeigt die Streifen am besten.'),
    r('Ein Büro in 20 Sekunden', 'Büroreinigung im Zeitraffer', ['Leeres Büro', 'Team arbeitet', 'Fertig'], ['Nach Feierabend', 'Am Morgen ist alles sauber'], 'dynamisch', 'Keine Unterlagen oder Bildschirme des Kunden zeigen.'),
    r('Unser Putzwagen', 'Das haben wir immer dabei', ['Wagen', 'Tücher nach Farben', 'Geräte'], ['Rot: WC', 'Blau: Flächen', 'Gelb: Sanitär'], 'modern', 'Farbsystem kurz erklären – das zeigt Sorgfalt.'),
    r('Tipp: Kalk entfernen', 'So geht Kalk an der Armatur weg', ['Verkalkte Armatur', 'Mittel einwirken lassen', 'Abwischen', 'Glänzt'], ['Einwirken lassen', 'Nicht scheuern'], 'leicht', 'Nahaufnahme, gutes Licht.'),
    r('Team stellt sich vor', 'Wer kommt da eigentlich zu Ihnen?', ['Team-Mitglied', 'Bei der Arbeit', 'Gruß'], ['Name', 'Seit wann im Team'], 'warm', 'Vorher fragen, wer gezeigt werden möchte.'),
    r('Stiegenhaus-Reinigung', 'Ein Stiegenhaus in 15 Sekunden', ['Kehren', 'Wischen', 'Geländer', 'Fertig'], ['Jede Woche für Sie da'], 'beschwingt', 'Von oben nach unten filmen.'),
    r('Das fragen uns Kunden', 'Wie oft sollte man ein Büro reinigen?', ['Frage als Text', 'Antwort', 'Angebot'], ['Kommt auf die Nutzung an', 'Wir beraten kostenlos'], 'sachlich', 'Ehrlich antworten, nicht mehr verkaufen als nötig.'),
    r('Teppich vorher – nachher', 'Dieser Teppich war einmal hell', ['Schmutziger Teppich', 'Gerät fährt darüber', 'Sauberer Streifen'], ['Vorher', 'Nachher'], 'zufrieden', 'Die erste saubere Bahn ist der beste Moment.'),
    r('Start in den Tag', 'Unser Tag beginnt um 5 Uhr', ['Auto wird beladen', 'Fahrt', 'Erstes Objekt'], ['05:00', '05:30', '06:00'], 'ruhig', 'Im Dunkeln: Licht im Auto einschalten.')
  ];
})();
