/* =====================================================================
   textbausteine-branchen-2.js – Captions für Einzelhandel,
   Autowerkstatt, Arzt/Therapie, Fotograf und Reinigungsfirma
   ---------------------------------------------------------------------
   Gleicher Aufbau und gleiche Platzhalter wie in
   textbausteine-allgemein.js (dort steht auch das MUSTER).
   ===================================================================== */
(function () {
  'use strict';

  SM.konfig.textbausteine.einzelhandel = {
    produkt: [
      'Neu eingetroffen: {Angebot}.\n\nAb sofort bei uns im Geschäft in {Ort} – kommt vorbei und schaut es euch an.',
      'Unser Lieblingsstück der Woche: {Angebot} ({Preis}).'
    ],
    angebot: [
      'Aktion bei {Firmenname}: {Angebot}.\n\nNur bis {Datum} und solange der Vorrat reicht.',
      'Jetzt zugreifen: {Angebot}. Gültig bis {Datum} bei uns im Geschäft.'
    ],
    tipp: [
      'Geschenkidee gesucht? {Thema}\n\nWir beraten euch gern und packen auch schön ein.',
      'Unser Tipp aus dem Geschäft: {Thema}'
    ],
    einblick: [
      'Frische Ware ist da! {Thema}\n\nSo sieht es bei uns aus, bevor wir aufsperren.',
      'Unser neues Schaufenster: {Thema}. Wie gefällt es euch?'
    ]
  };

  SM.konfig.textbausteine.autowerkstatt = {
    tipp: [
      'Tipp aus der Werkstatt: {Thema}\n\nUnsicher? Kommen Sie vorbei, wir schauen es uns kurz an.',
      'Das fragen uns viele Kunden: {Thema}\n\nUnsere Antwort seht ihr im Bild.'
    ],
    angebot: [
      'Jetzt Termin sichern: {Angebot}.\n\nGültig bis {Datum}. Anmeldung unter {Telefon}.',
      'Die Saison steht vor der Tür: {Angebot}. Termine bei {Firmenname} in {Ort} unter {Telefon}.'
    ],
    einblick: [
      'Heute in der Werkstatt: {Thema}\n\nWir erklären Ihnen immer, was gemacht wurde und warum.',
      'Ein Blick unter die Motorhaube: {Thema}'
    ],
    stellenanzeige: [
      'Wir suchen: {Stelle} (m/w/d) für unsere Werkstatt in {Ort}.\n\nDu schraubst gern und arbeitest sauber? Melde dich unter {Telefon}.',
      'Lehrling gesucht: {Stelle} (m/w/d). Schnuppertage bei {Firmenname} sind jederzeit möglich.'
    ]
  };

  SM.konfig.textbausteine.arzt = {
    oeffnungszeiten: [
      'Information für unsere Patientinnen und Patienten: {Thema}\n\nIn dringenden Fällen wenden Sie sich bitte an die Vertretung bzw. den Ärztenotdienst 141.',
      'Bitte beachten Sie: {Thema}\n\nTermine wie gewohnt unter {Telefon}.'
    ],
    tipp: [
      'Gut zu wissen: {Thema}\n\nDiese allgemeine Information ersetzt kein persönliches Gespräch. Bei Beschwerden wenden Sie sich bitte an uns.',
      'Aus der Praxis: {Thema}\n\nFragen dazu beantworten wir gern bei Ihrem nächsten Termin.'
    ],
    team: [
      'Unser Praxisteam: {Name}. {Thema}\n\nWir sind gern für Sie da.',
      'Wer empfängt Sie bei uns? Heute stellen wir {Name} vor. {Thema}'
    ],
    neuigkeit: [
      'Neu in unserer Praxis: {Thema}\n\nInformationen und Termine unter {Telefon}.',
      'Wir informieren: {Thema}'
    ]
  };

  SM.konfig.textbausteine.fotograf = {
    einblick: [
      'Aus einem meiner letzten Shootings: {Thema}\n\nDanke für das Vertrauen und den schönen Tag!',
      'So entsteht ein Bild: {Thema}. Ein kleiner Blick hinter die Kamera.'
    ],
    angebot: [
      'Mini-Shootings in {Ort}: {Angebot}.\n\nTermine am {Datum}, die Plätze sind begrenzt. Anmeldung per Nachricht oder unter {Telefon}.',
      'Verschenkt Erinnerungen: {Angebot}. Gutscheine gibt es direkt bei mir.'
    ],
    tipp: [
      'Tipp für euer Shooting: {Thema}\n\nSo fühlt ihr euch vor der Kamera wohler.',
      'Was soll ich anziehen? {Thema}\n\nDie häufigste Frage vor jedem Shooting – hier meine Antwort.'
    ],
    kundenstimme: [
      '„{Zitat}"\n\nDanke, {Name}! Es war mir eine Freude, euch zu begleiten.',
      'Solche Nachrichten sind der schönste Lohn: „{Zitat}" – {Name}'
    ]
  };

  SM.konfig.textbausteine.reinigung = {
    'vorher-nachher': [
      'Vorher – nachher. 👉 Wischt für das Vorher.\n\nSo sauber kann es bei Ihnen auch aussehen. Angebot anfordern: {Telefon}',
      'Unser Einsatz der Woche: {Thema}. Der Unterschied spricht für sich.'
    ],
    produkt: [
      'Unsere Leistung im Fokus: {Angebot}.\n\nFür Betriebe und Privathaushalte im Raum {Ort}. Unverbindliches Angebot unter {Telefon}.',
      'Wussten Sie, dass wir auch das übernehmen? {Angebot}'
    ],
    stellenanzeige: [
      'Wir suchen Reinigungskräfte (m/w/d) im Raum {Ort}: {Stelle}.\n\nFaire Bezahlung, fixe Zeiten, nettes Team. Einfach anrufen: {Telefon}',
      'Verstärke unser Team: {Stelle} (m/w/d). Teilzeit oder geringfügig möglich. Melde dich bei {Firmenname}.'
    ],
    tipp: [
      'Putz-Tipp vom Profi: {Thema}\n\nProbiert es aus – und wenn es einmal mehr sein darf, sind wir für euch da.',
      'So bleibt es länger sauber: {Thema}'
    ]
  };
})();
