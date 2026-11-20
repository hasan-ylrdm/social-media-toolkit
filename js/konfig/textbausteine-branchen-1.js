/* =====================================================================
   textbausteine-branchen-1.js – Captions für Friseur, Handwerk, Gastro,
   Verein und Fitness
   ---------------------------------------------------------------------
   Gleicher Aufbau und gleiche Platzhalter wie in
   textbausteine-allgemein.js (dort steht auch das MUSTER).
   Texte einer Branche werden VOR den allgemeinen Texten angeboten.
   Eine Branche muss nicht jede Beitragsart haben.
   ===================================================================== */
(function () {
  'use strict';

  SM.konfig.textbausteine.friseur = {
    'vorher-nachher': [
      'Von „ich brauche eine Veränderung" zu diesem Ergebnis. 👉 Wischt für das Vorher.\n\nLust auf einen neuen Look? Termine bei {Firmenname} unter {Telefon}.',
      'Neue Farbe, neuer Schnitt, neues Gefühl. Wie gefällt euch die Verwandlung?'
    ],
    angebot: [
      'Für alle, die sich etwas gönnen wollen: {Angebot}.\n\nGültig bis {Datum}. Termin sichern unter {Telefon} – wir freuen uns auf euch!',
      'Unsere Aktion im Salon: {Angebot}. Nur bis {Datum} und solange Termine frei sind.'
    ],
    tipp: [
      'Pflege-Tipp aus dem Salon: {Thema}\n\nWelche Frage zu euren Haaren sollen wir als Nächstes beantworten?',
      'Das fragen uns viele im Salon: {Thema}\n\nUnsere Antwort seht ihr im Bild. Speichern nicht vergessen!'
    ],
    oeffnungszeiten: [
      'Kurze Info aus dem Salon: {Thema}\n\nBitte denkt rechtzeitig an euren Termin – vor Feiertagen sind wir schnell ausgebucht.',
      'Damit ihr planen könnt: {Thema}\n\nTermine wie immer unter {Telefon}.'
    ],
    produkt: [
      'Unser Liebling im Salon: {Angebot}.\n\nWir zeigen euch gern, wie ihr es zu Hause richtig anwendet.',
      'Neu im Regal: {Angebot} ({Preis}). Fragt beim nächsten Termin einfach danach.'
    ]
  };

  SM.konfig.textbausteine.handwerk = {
    'vorher-nachher': [
      'Vorher eine Baustelle, nachher ein Schmuckstück. 👉 Wischt für das Vorher.\n\nSie planen etwas Ähnliches im Raum {Ort}? Rufen Sie uns an: {Telefon}',
      'Ein Projekt aus den letzten Wochen: {Thema}. So sah es vorher aus – und so jetzt.'
    ],
    einblick: [
      'Unterwegs für unsere Kunden: {Thema}\n\nSo sieht unsere Arbeit auf der Baustelle aus.',
      'Ein Blick in unsere Werkstatt: {Thema}'
    ],
    tipp: [
      'Tipp vom Fachmann: {Thema}\n\nWenn Sie unsicher sind, schauen wir uns das gern bei Ihnen an.',
      'Das sollten Hausbesitzer wissen: {Thema}\n\nFragen dazu? {Telefon}'
    ],
    stellenanzeige: [
      'Wir suchen: {Stelle} (m/w/d) für unseren Betrieb in {Ort}.\n\nBei uns erwarten dich ein eingespieltes Team und abwechslungsreiche Baustellen in der Region. Melde dich unter {Telefon} – gern auch erst einmal zum Schnuppern.',
      'Lehre mit Zukunft: Wir bilden aus! {Stelle} (m/w/d) bei {Firmenname}.\n\nSchnuppertage sind jederzeit möglich. Einfach anrufen: {Telefon}'
    ],
    produkt: [
      'Wussten Sie, dass wir auch das machen? {Angebot}\n\nFür ein unverbindliches Angebot einfach anrufen: {Telefon}',
      'Unsere Leistung im Fokus: {Angebot}. Wir beraten Sie gern vor Ort.'
    ]
  };

  SM.konfig.textbausteine.gastro = {
    produkt: [
      'Frisch aus unserer Küche: {Angebot}.\n\nGibt es ab sofort bei uns in {Ort}. Wer kommt vorbei?',
      'Heute auf der Karte: {Angebot} ({Preis}).\n\nTisch reservieren unter {Telefon}.'
    ],
    angebot: [
      'Unser Mittagsmenü diese Woche: {Angebot}.\n\nMontag bis Freitag, solange der Vorrat reicht. Mahlzeit!',
      'Nur für kurze Zeit: {Angebot}. Bis {Datum} bei {Firmenname}.'
    ],
    event: [
      '{Thema} bei {Firmenname}!\n\n📅 {Datum} ab {Uhrzeit}\n\nTisch reservieren unter {Telefon} – wir freuen uns auf einen schönen Abend mit euch.',
      'Merkt euch den {Datum} vor: {Thema}. Reservierung empfohlen!'
    ],
    einblick: [
      'So entsteht bei uns {Thema}. Ein Blick in die Küche von {Firmenname}.',
      'Bevor die ersten Gäste kommen: {Thema}'
    ],
    oeffnungszeiten: [
      'Info für unsere Gäste: {Thema}\n\nAn allen anderen Tagen kochen wir wie gewohnt für euch.',
      'Kurze Pause für unser Team: {Thema}\n\nDanach sind wir mit frischer Energie wieder für euch da!'
    ]
  };

  SM.konfig.textbausteine.verein = {
    neuigkeit: [
      'Spielbericht: {Thema}\n\nDanke an alle, die uns angefeuert haben!',
      'Neuigkeiten aus dem Verein: {Thema}'
    ],
    event: [
      'Nächstes Heimspiel: {Thema}\n\n📅 {Datum}\n🕒 {Uhrzeit}\n📍 {Ort}\n\nKommt vorbei und unterstützt unsere Mannschaft!',
      '{Thema} am {Datum} – für Speis und Trank ist gesorgt. Wir freuen uns auf viele Besucher!'
    ],
    team: [
      'Heute stellen wir vor: {Name}. {Thema}\n\nDanke für deinen Einsatz im Verein!',
      'Ohne sie läuft nichts: unsere Ehrenamtlichen. Heute: {Name}. {Thema}'
    ],
    stellenanzeige: [
      'Mitmachen bei {Firmenname}! Wir suchen: {Stelle}.\n\nSchnuppertraining ist jederzeit möglich. Einfach vorbeikommen oder melden: {Telefon}',
      'Wir suchen Helferinnen und Helfer: {Stelle}. Jede Stunde zählt – meldet euch bei uns!'
    ],
    danke: [
      'Danke an unsere Sponsoren und Unterstützer! {Thema}\n\nOhne euch wäre Vereinsarbeit in {Ort} nicht möglich.',
      'Was für ein Tag! {Thema}\n\nDanke an alle Helferinnen, Helfer und Gäste.'
    ]
  };

  SM.konfig.textbausteine.fitness = {
    tipp: [
      'Übung der Woche: {Thema}\n\nLangsam und sauber ausführen. Bei Schmerzen bitte abbrechen und abklären lassen.',
      'Kleiner Tipp für den Alltag: {Thema}\n\nProbiert es aus und sagt uns, wie es euch damit geht.'
    ],
    angebot: [
      'Jetzt kennenlernen: {Angebot}.\n\nGültig bis {Datum}. Anmeldung unter {Telefon} oder direkt bei uns in {Ort}.',
      'Für alle, die starten wollen: {Angebot}. Wir nehmen uns Zeit für euch.'
    ],
    produkt: [
      'Neu im Kursplan: {Angebot}.\n\nFür wen ist das geeignet? Fragt uns einfach – wir beraten euch gern.',
      'Unser Angebot im Fokus: {Angebot} ({Preis}).'
    ],
    team: [
      'Unser Team: {Name}. {Thema}\n\nIhr habt Fragen? {Name} hilft euch gern weiter.',
      'Wer betreut euch eigentlich? Heute stellen wir {Name} vor. {Thema}'
    ]
  };
})();
