/* =====================================================================
   textbausteine-allgemein.js – Captions für JEDE Branche
   ---------------------------------------------------------------------
   Aufbau:  SM.konfig.textbausteine[branchenId][beitragsartId] = [Texte]
   Diese Datei legt die Branche "allgemein" an. Sie ist das Auffangnetz:
   Hat eine Branche zu einer Beitragsart keine eigenen Texte, werden
   diese hier angeboten. Deshalb braucht JEDE Beitragsart aus
   beitragsarten.js hier mindestens zwei Texte (der Selbsttest prüft es).

   Platzhalter (Groß-/Kleinschreibung egal):
     aus dem Kunden:  {Firmenname} {Ort} {Slogan} {Telefon} {Email}
                      {Website} {Strasse} {Branche} {Ansprechperson}
     von mir auszufüllen (bleiben sichtbar stehen, bis ich sie ersetze):
                      {Angebot} {Preis} {Datum} {Thema} {Name} {Zitat}
                      {Stelle} {Uhrzeit}

   Regeln für neue Texte: ehrlich, konkret, keine erfundenen Zahlen,
   keine Superlative ("der beste"), keine Garantien.

   MUSTER (neue Variante einfach in die passende Liste schreiben):
     angebot: [
       'Erster Text mit {Angebot} bei {Firmenname}.',
       'Zweiter Text …'
     ]
   ===================================================================== */
(function () {
  'use strict';

  SM.konfig.textbausteine = {};

  SM.konfig.textbausteine.allgemein = {
    angebot: [
      '{Angebot} – nur bis {Datum} bei {Firmenname} in {Ort}.\n\nEinfach vorbeikommen oder anrufen: {Telefon}',
      'Unsere Aktion im Moment: {Angebot}.\n\nGültig bis {Datum}, solange der Vorrat bzw. die Termine reichen. Wir freuen uns auf euch!',
      'Kleine Freude zwischendurch: {Angebot}.\n\nAlle Infos bekommt ihr direkt bei uns in {Ort} oder unter {Telefon}.'
    ],
    neuigkeit: [
      'Neu bei {Firmenname}: {Thema}.\n\nSchaut vorbei und überzeugt euch selbst – wir freuen uns auf euren Besuch in {Ort}.',
      'Es gibt Neuigkeiten! {Thema}\n\nFragen dazu? Schreibt uns einfach oder ruft an: {Telefon}',
      'Wir haben etwas Neues für euch: {Thema}.\n\nMehr dazu erzählen wir euch gern persönlich.'
    ],
    kundenstimme: [
      '„{Zitat}"\n\nDanke, {Name}, für diese Rückmeldung! Solche Worte freuen das ganze Team von {Firmenname}.',
      'Rückmeldungen wie diese machen unseren Tag:\n\n„{Zitat}" – {Name}\n\nVielen Dank für das Vertrauen!',
      'Was unsere Kundinnen und Kunden sagen:\n\n„{Zitat}"\n\nDanke, {Name}! Ihr wollt uns auch eure Meinung sagen? Wir freuen uns über jede Bewertung.'
    ],
    'vorher-nachher': [
      'Vorher – nachher. 👉 Wischt nach links und seht den Unterschied.\n\nGemacht von {Firmenname} in {Ort}.',
      'So sah es vorher aus – und so danach. Was sagt ihr?\n\nFragen zu so einem Projekt? Meldet euch: {Telefon}',
      'Ein Bild sagt mehr als viele Worte: unser Vorher-Nachher der Woche.'
    ],
    team: [
      'Darf ich vorstellen: {Name}! {Thema}\n\nWenn ihr das nächste Mal bei {Firmenname} seid, sagt gern Hallo.',
      'Die Menschen hinter {Firmenname}: Heute stellen wir euch {Name} vor.\n\n{Thema}',
      'Ohne unser Team geht nichts. Heute im Mittelpunkt: {Name}.\n\n{Thema}'
    ],
    oeffnungszeiten: [
      'Kurze Info zu unseren Öffnungszeiten: {Thema}\n\nAn allen anderen Tagen sind wir wie gewohnt für euch da.',
      'Bitte beachten: {Thema}\n\nDanke für euer Verständnis – wir freuen uns auf euch!',
      'Damit niemand vor verschlossener Tür steht: {Thema}\n\nTermine und Fragen gern unter {Telefon}.'
    ],
    stellenanzeige: [
      'Wir suchen Verstärkung: {Stelle} (m/w/d) in {Ort}.\n\nDu arbeitest gern im Team und möchtest bei {Firmenname} mitmachen? Melde dich einfach bei uns: {Telefon} oder {Email}.',
      'Du suchst einen neuen Job in {Ort}? Wir suchen: {Stelle} (m/w/d).\n\nSchreib uns oder komm einfach vorbei – wir freuen uns, dich kennenzulernen.',
      'Kennst du jemanden, der zu uns passt? Wir suchen {Stelle} (m/w/d).\n\nGern teilen und weitersagen – danke!'
    ],
    tipp: [
      'Tipp der Woche von {Firmenname}: {Thema}\n\nHabt ihr Fragen dazu? Schreibt sie in die Kommentare.',
      'Kurz erklärt: {Thema}\n\nSpeichert euch den Beitrag, dann habt ihr den Tipp immer zur Hand.',
      'Das werden wir oft gefragt: {Thema}\n\nUnsere Antwort seht ihr im Bild. Mehr Tipps gibt es regelmäßig hier.'
    ],
    event: [
      'Vormerken: {Thema} am {Datum} um {Uhrzeit} in {Ort}.\n\nWir freuen uns auf euch! Fragen gern unter {Telefon}.',
      'Bald ist es so weit: {Thema}.\n\n📅 {Datum}\n🕒 {Uhrzeit}\n📍 {Strasse}, {Ort}\n\nKommt vorbei und bringt gern jemanden mit.',
      'Save the Date: {Thema} am {Datum}.\n\nAlle Infos folgen hier – am besten gleich im Kalender eintragen.'
    ],
    gewinnspiel: [
      'Gewinnspiel! Wir verlosen {Angebot}.\n\nSo macht ihr mit:\n1. Diesen Beitrag liken\n2. In den Kommentaren verraten, mit wem ihr den Gewinn teilen würdet\n\nTeilnahme bis {Datum}, ab 18 Jahren. Die Gewinnerin oder der Gewinner wird per Nachricht verständigt. Das Gewinnspiel steht in keiner Verbindung zu Instagram oder Facebook. Der Rechtsweg ist ausgeschlossen.',
      'Zeit für ein Gewinnspiel: Zu gewinnen gibt es {Angebot}.\n\nEinfach bis {Datum} kommentieren. Teilnahme ab 18 Jahren, keine Barablöse. Das Gewinnspiel steht in keiner Verbindung zu Instagram oder Facebook.'
    ],
    danke: [
      'Danke! {Thema}\n\nOhne euch wäre das nicht möglich. Euer Team von {Firmenname}.',
      'Wir sagen Danke: {Thema}\n\nSchön, dass ihr uns begleitet – auf viele weitere gemeinsame Momente in {Ort}.',
      'Ein großes Dankeschön an alle, die uns unterstützen. {Thema}'
    ],
    einblick: [
      'Ein Blick hinter die Kulissen bei {Firmenname}: {Thema}',
      'So sieht ein ganz normaler Tag bei uns aus. {Thema}\n\nWas wollt ihr als Nächstes sehen?',
      'Das bekommt man sonst nicht zu sehen: {Thema}'
    ],
    produkt: [
      'Schon gewusst? Bei {Firmenname} gibt es auch {Angebot}.\n\nPreis: {Preis}. Fragen dazu beantworten wir gern unter {Telefon}.',
      'Unser Tipp für euch: {Angebot}.\n\nGibt es bei uns in {Ort} – einfach vorbeikommen oder Termin vereinbaren.',
      'Heute im Mittelpunkt: {Angebot} ({Preis}).\n\nWir beraten euch gern persönlich.'
    ],
    frage: [
      'Wir sind neugierig: {Thema}\n\nSchreibt uns eure Antwort in die Kommentare!',
      'Eure Meinung ist gefragt: {Thema}\n\nA oder B? Wir sind gespannt.',
      'Frage an euch: {Thema}'
    ],
    saison: [
      '{Thema} wünscht euch das ganze Team von {Firmenname}!',
      'Wir wünschen euch {Thema}. Danke, dass ihr uns begleitet – bis bald in {Ort}!',
      '{Thema}! Genießt die Zeit mit euren Liebsten.'
    ],
    reel: [
      '{Thema} 🎬\n\nMehr Einblicke gibt es regelmäßig hier bei {Firmenname}.',
      'Ton an! {Thema}\n\nWie gefällt euch das Video? Schreibt es uns.',
      '{Thema} – direkt aus {Ort}.'
    ]
  };
})();
