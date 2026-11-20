/* =====================================================================
   datenmodell.js – wie ein Kunde und die Einstellungen aufgebaut sind
   ---------------------------------------------------------------------
   DIE Stelle für alle Felder. Ein "Kunde" ist ein einziges Objekt mit
   allem, was zu ihm gehört (Stammdaten, Marke, Fotos, Strategie, Posts,
   Berichte). So ist Speichern, Laden und die Kundendatei ganz einfach.

   NEUES FELD: hier in leererKunde() (oder leererPost() / leereFolie())
   mit Standardwert eintragen. Die Migration ergänzt es dann automatisch
   in alten Kunden. Danach ARCHITEKTUR.md (Datenmodell) nachziehen.

   Die Feldnamen von stamm, oeffnungszeiten, leistungen, bilder und
   marke.farben sind absichtlich dieselben wie im Website-Baukasten
   (dort: betrieb, oeffnungszeiten, leistungen, bilder, design.farben).
   Die Zuordnung steht in js/kern/baukasten-import.js.
   ===================================================================== */
(function () {
  'use strict';

  /**
   * Standard-Öffnungszeiten: Mo–Fr 08–18 Uhr, Sa/So geschlossen.
   * @returns {Array<Object>} 7 Einträge, Montag zuerst
   */
  SM.datenmodell.standardTage = function () {
    var tage = [];
    for (var index = 0; index < 7; index += 1) {
      tage.push({
        geschlossen: index >= 5,
        von: '08:00',
        bis: '18:00',
        pause: false,
        pauseVon: '12:00',
        pauseBis: '13:00'
      });
    }
    return tage;
  };

  /**
   * Eine leere Folie (eine Grafik). Ein Post hat mindestens eine Folie,
   * ein Karussell mehrere.
   * @param {string} [vorlage] id einer Grafik-Vorlage (js/grafik/vorlagen-*.js)
   * @returns {Object}
   */
  SM.datenmodell.leereFolie = function (vorlage) {
    return {
      id: SM.helfer.neueId('folie'),
      vorlage: vorlage || 'neuigkeit',
      /* Vier feste Text-Plätze. Jede Vorlage sagt, welche sie nutzt und wie sie heißen. */
      texte: { titel: '', untertitel: '', text: '', zusatz: '' },
      bildId: '',            // Foto aus kunde.bilder
      bildId2: '',           // zweites Foto (nur Vorher/Nachher)
      ausschnitt: { zoom: 1, x: 50, y: 50 },   // Zuschnitt: Zoom 1–3, Mittelpunkt in Prozent
      textPosition: 'unten', // oben | mitte | unten
      ausrichtung: 'links',  // links | mitte
      farbschema: 'marke'    // marke | hell | dunkel
    };
  };

  /**
   * Ein leerer Post.
   * @param {string} datum "JJJJ-MM-TT"
   * @returns {Object}
   */
  SM.datenmodell.leererPost = function (datum) {
    return {
      id: SM.helfer.neueId('post'),
      datum: datum || '',
      uhrzeit: '',
      kanaele: ['instagram'],      // instagram | facebook | tiktok | google
      format: 'feed-hoch',         // id aus SM.konfig.formate (js/konfig/konstanten.js)
      beitragsart: 'neuigkeit',    // id aus js/konfig/beitragsarten.js
      saeuleId: '',                // id einer Themen-Säule aus kunde.strategie.saeulen
      status: 'idee',              // id aus SM.konfig.status
      titel: '',                   // interner Arbeitstitel (steht im Kalender)
      caption: '',
      hashtags: '',
      notiz: '',                   // nur für mich
      folien: [SM.datenmodell.leereFolie()]
    };
  };

  /**
   * Ein leerer Monatsbericht.
   * @param {string} monat "JJJJ-MM"
   * @returns {Object}
   */
  SM.datenmodell.leererBericht = function (monat) {
    return {
      id: SM.helfer.neueId('bericht'),
      monat: monat,
      kennzahlen: {},     // {kennzahlId: Zahl} – ids aus js/konfig/kennzahlen.js; leer = nicht erfasst
      topPosts: [],       // {id, titel, wert}
      einschaetzung: '',
      plan: ''
    };
  };

  /**
   * Ein leerer Kunde mit allen Feldern und Standardwerten.
   * @returns {Object}
   */
  SM.datenmodell.leererKunde = function () {
    var jetzt = new Date().toISOString();
    return {
      formatVersion: SM.FORMAT_VERSION,
      werkzeugVersion: SM.VERSION,
      id: SM.helfer.neueId('kunde'),
      erstelltAm: jetzt,
      geaendertAm: jetzt,

      /* Stammdaten (Baukasten: "betrieb") */
      stamm: {
        firmenname: '',
        slogan: '',
        branche: 'allgemein',
        beschreibung: '',
        strasse: '',
        plz: '',
        ort: '',
        land: 'Österreich',
        telefon: '',
        email: '',
        website: ''
      },
      ansprechperson: { name: '', telefon: '', email: '' },
      notizen: '',

      oeffnungszeiten: { hinweis: '', tage: SM.datenmodell.standardTage() },
      leistungen: [],     // {id, name, beschreibung, preis}

      /* Marke: wird von allen Grafik-Vorlagen automatisch übernommen */
      marke: {
        farben: { primaer: '#2f4b7c', akzent: '#e0a458', hintergrund: '#ffffff', text: '#1d2430' },
        schriftpaar: 'modern',   // id aus js/konfig/schriften.js
        ton: 'freundlich',       // freundlich | professionell | locker
        zielgruppe: ''
      },

      /* Kanäle, die ich betreue */
      kanaele: {
        instagram: { aktiv: true, link: '' },
        facebook: { aktiv: false, link: '' },
        tiktok: { aktiv: false, link: '' },
        google: { aktiv: false, link: '' }
      },

      /* Gebuchtes Paket (ids aus einstellungen.pakete) */
      paket: { paketId: '', preis: '', seit: '' },   // preis leer = Preis des Pakets

      /* Fotos und Logo: dataUrl enthält das komprimierte Bild selbst */
      bilder: [],         // {id, name, dataUrl, breite, hoehe, bytes, alt, bereich: 'logo' | 'foto'}

      /* Antworten aus dem Onboarding-Fragebogen: {frageId: Text}, ids aus js/konfig/onboarding-fragen.js */
      onboarding: {},

      strategie: {
        erzeugtAm: '',
        ziele: '',
        saeulen: [],          // {id, name, beschreibung, anteil (Prozent), beitragsarten: [ids]}
        postsProMonat: 8,
        storiesProWoche: 0,
        reelsProMonat: 0,
        wochentage: [1, 4],   // bevorzugte Posting-Tage, Montag = 0
        kanalwahl: '',
        hinweise: ''
      },

      events: [],         // eigene lokale Termine {id, datum, titel}
      posts: [],          // siehe leererPost()
      hashtagSets: [],    // {id, name, tags}
      berichte: []        // siehe leererBericht()
    };
  };

  /**
   * Standard-Einstellungen des Werkzeugs (gelten für ALLE Kunden):
   * "Meine Daten", meine Pakete, KI-Zugang, Social-Media-Checks,
   * Angebote und Aufgaben. Der API-Key bleibt hier – er kommt NIE in eine
   * Kundendatei, eine Sicherung oder ein Dokument.
   * @returns {Object}
   */
  SM.datenmodell.standardEinstellungen = function () {
    return {
      formatVersion: 1,
      meineDaten: {
        name: '',
        firma: '',
        strasse: '',
        plz: '',
        ort: '',
        telefon: '',
        email: '',
        website: '',
        logo: '',   // Data-URL
        preisHinweis: 'Alle Preise in Euro pro Monat.'   // steht so in Angebot und Check-Bericht (also nichts Internes hineinschreiben)
      },
      pakete: SM.helfer.kopiere(SM.konfig.standardPakete || []),
      ki: {
        anbieter: 'anthropic',   // anthropic | openai-kompatibel
        apiKey: '',
        modell: 'claude-haiku-5-5',
        basisUrl: ''
      },
      letzterKundeId: '',   // welcher Kunde zuletzt geöffnet war
      checks: [],     // Social-Media-Checks {id, datum, betrieb, ort, branche, link, punkte: {punktId: {wert, notiz}}, fazit, paketId}
      angebote: [],   // {id, datum, empfaenger, anschrift, paketId, preis (leer = Paketpreis), start, laufzeit, zusatz}
      aufgaben: []    // {id, text, faellig, erledigt, kundeId}
    };
  };
})();
