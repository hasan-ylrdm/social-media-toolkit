/* =====================================================================
   beispielkunde.js – der erfundene Beispielkunde "Café Muster, Hallein"
   ---------------------------------------------------------------------
   Wird beim allerersten Start angelegt, damit man sofort etwas sieht:
   Stammdaten, Marke, vier gezeichnete Beispielbilder, Logo, ausgefüllter
   Fragebogen, Strategie, ein fertiger Monatsplan für den laufenden Monat
   (aus dem Plan-Generator) und zwei Monatsberichte mit BEISPIELZAHLEN.

   Alles ist erfunden. Die Bilder sind einfache Zeichnungen (SVG), damit
   keine fremden Fotos mitgeliefert werden müssen.
   Dieselben Daten liegen als Datei unter beispiele/cafe-muster.kunde.json
   (neu erzeugen: node tests/node-pruefung.js --beispiel).
   ===================================================================== */
(function () {
  'use strict';

  /**
   * Macht aus SVG-Text einen Bild-Eintrag für den Kunden.
   * @param {string} id
   * @param {string} name Beschreibung des Bildes
   * @param {string} bereich 'logo' oder 'foto'
   * @param {number} breite @param {number} hoehe
   * @param {string} inhalt SVG-Elemente (ohne <svg>-Rahmen)
   * @returns {Object} Bild-Eintrag
   */
  function svgBild(id, name, bereich, breite, hoehe, inhalt) {
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + breite + '" height="' + hoehe + '" viewBox="0 0 ' + breite + ' ' + hoehe + '">' + inhalt + '</svg>';
    var dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    return { id: id, name: name, dataUrl: dataUrl, breite: breite, hoehe: hoehe, bytes: svg.length, alt: name, bereich: bereich };
  }

  /**
   * Die Beispielbilder (einfache Zeichnungen ohne Schrift).
   * @returns {Array<Object>}
   */
  function beispielBilder() {
    return [
      svgBild('bild-logo', 'Logo Café Muster', 'logo', 400, 400,
        '<circle cx="200" cy="200" r="190" fill="#6b3f2a"/>' +
        '<path d="M120 170h140v60a70 70 0 0 1-140 0z" fill="#fbf6ee"/>' +
        '<path d="M260 185h18a26 26 0 0 1 0 52h-22" fill="none" stroke="#fbf6ee" stroke-width="14"/>' +
        '<path d="M160 150c-12-18 12-24 0-44M200 150c-12-18 12-24 0-44M240 150c-12-18 12-24 0-44" fill="none" stroke="#e8b04a" stroke-width="9" stroke-linecap="round"/>' +
        '<rect x="110" y="300" width="180" height="12" rx="6" fill="#e8b04a"/>'),
      svgBild('bild-kaffee', 'Cappuccino von oben auf einem Holztisch', 'foto', 1200, 1200,
        '<rect width="1200" height="1200" fill="#c9a27a"/>' +
        '<path d="M0 300h1200M0 620h1200M0 930h1200" stroke="#b58c63" stroke-width="10"/>' +
        '<circle cx="600" cy="600" r="390" fill="#f4ece0"/><circle cx="600" cy="600" r="300" fill="#fffaf2"/>' +
        '<circle cx="600" cy="600" r="250" fill="#8a5a3c"/>' +
        '<path d="M600 470c-90 60-90 200 0 260c90-60 90-200 0-260z" fill="#f1dcc3"/>' +
        '<path d="M600 520c-45 35-45 125 0 160c45-35 45-125 0-160z" fill="#8a5a3c"/>' +
        '<rect x="930" y="560" width="190" height="80" rx="40" fill="#fffaf2"/>'),
      svgBild('bild-torte', 'Ein Stück Schokoladentorte auf einem Teller', 'foto', 1200, 1500,
        '<rect width="1200" height="1500" fill="#f3d9d2"/>' +
        '<ellipse cx="600" cy="1050" rx="470" ry="130" fill="#ffffff"/>' +
        '<path d="M300 1010L900 1010L900 620L300 780z" fill="#5a3222"/>' +
        '<path d="M300 880L900 760L900 820L300 940z" fill="#f6e7d3"/>' +
        '<path d="M300 780L900 620L900 560L300 720z" fill="#3b2015"/>' +
        '<circle cx="640" cy="560" r="46" fill="#c0392b"/><path d="M640 514c10-40 40-50 60-50" stroke="#2f6b3a" stroke-width="10" fill="none"/>'),
      svgBild('bild-gastraum', 'Heller Gastraum mit Tischen am Fenster', 'foto', 1600, 1100,
        '<rect width="1600" height="1100" fill="#efe6d8"/>' +
        '<rect x="120" y="110" width="560" height="460" fill="#cfe4ee"/><rect x="920" y="110" width="560" height="460" fill="#cfe4ee"/>' +
        '<path d="M400 110v460M120 340h560M1200 110v460M920 340h560" stroke="#ffffff" stroke-width="16"/>' +
        '<rect y="760" width="1600" height="340" fill="#b98d62"/>' +
        '<ellipse cx="400" cy="800" rx="230" ry="50" fill="#6b3f2a"/><rect x="385" y="800" width="30" height="220" fill="#4a2b1c"/>' +
        '<ellipse cx="1200" cy="800" rx="230" ry="50" fill="#6b3f2a"/><rect x="1185" y="800" width="30" height="220" fill="#4a2b1c"/>' +
        '<circle cx="400" cy="770" r="26" fill="#ffffff"/><circle cx="1200" cy="770" r="26" fill="#ffffff"/>' +
        '<path d="M800 60v120" stroke="#4a2b1c" stroke-width="8"/><circle cx="800" cy="220" r="60" fill="#e8b04a"/>'),
      svgBild('bild-team', 'Zwei Mitarbeiterinnen hinter der Theke', 'foto', 1200, 1200,
        '<rect width="1200" height="1200" fill="#e6d3bd"/>' +
        '<circle cx="420" cy="430" r="120" fill="#f2c9a5"/><path d="M300 400a120 120 0 0 1 240 0c-60-70-180-70-240 0z" fill="#4a2b1c"/>' +
        '<path d="M220 1000c0-260 90-360 200-360s200 100 200 360z" fill="#6b3f2a"/>' +
        '<circle cx="800" cy="460" r="110" fill="#e9b88f"/><path d="M690 440a110 110 0 0 1 220 0c-40-90-180-90-220 0z" fill="#b5651d"/>' +
        '<path d="M610 1000c0-240 80-330 190-330s190 90 190 330z" fill="#fbf6ee"/>' +
        '<rect y="960" width="1200" height="240" fill="#8a5a3c"/><rect y="940" width="1200" height="40" fill="#5a3a26"/>')
    ];
  }

  /* Beispielwerte für die Platzhalter, die der Plan-Generator offen lässt */
  var BEISPIEL_WERTE = {
    angebot: 'Frühstück für zwei', preis: '€ 19', datum: 'Sonntag', uhrzeit: '9 Uhr',
    thema: 'Hausgemachte Mehlspeisen, jeden Tag frisch', name: 'Anna', stelle: 'Servicekraft (Teilzeit)',
    zitat: 'Hier fühlt man sich vom ersten Moment an wohl.'
  };

  /**
   * Füllt in einem Beitrag die offenen Platzhalter mit Beispielwerten.
   * @param {Object} post wird verändert
   * @param {Object} kunde
   */
  function fuelle(post, kunde) {
    post.caption = SM.platzhalter.ersetze(post.caption, kunde, BEISPIEL_WERTE);
    post.folien.forEach(function (folie) {
      Object.keys(folie.texte).forEach(function (platz) {
        folie.texte[platz] = SM.platzhalter.ersetze(folie.texte[platz], kunde, BEISPIEL_WERTE);
      });
    });
  }

  /**
   * Erzeugt den kompletten Beispielkunden.
   * @param {string} [monat] "JJJJ-MM" für den Monatsplan (Standard: laufender Monat)
   * @returns {Object} Kunde im aktuellen Format
   */
  SM.konfig.beispielKunde = function (monat) {
    var planMonat = monat || SM.datum.monatVon(SM.datum.heute());
    var k = SM.datenmodell.leererKunde();
    k.id = 'kunde-beispiel-cafe-muster';

    k.stamm.firmenname = 'Café Muster';
    k.stamm.slogan = 'Dein Platz für die kleine Auszeit';
    k.stamm.branche = 'gastro';
    k.stamm.beschreibung = 'Kleines Café in der Halleiner Altstadt mit Frühstück, hausgemachten Mehlspeisen und Kaffee aus einer Salzburger Rösterei.';
    k.stamm.strasse = 'Musterplatz 3';
    k.stamm.plz = '5400';
    k.stamm.ort = 'Hallein';
    k.stamm.telefon = '+43 6245 000000';
    k.stamm.email = 'hallo@cafe-muster.example';
    k.stamm.website = 'https://www.cafe-muster.example';
    k.ansprechperson = { name: 'Maria Muster', telefon: '+43 660 0000000', email: 'maria@cafe-muster.example' };
    k.notizen = 'Erfundener Beispielkunde zum Ausprobieren. Fotos schickt Maria montags per WhatsApp.';

    k.oeffnungszeiten.tage.forEach(function (tag, index) {
      tag.geschlossen = index === 0;          // Montag Ruhetag
      tag.von = index >= 5 ? '08:00' : '07:30';
      tag.bis = index === 6 ? '14:00' : '18:00';
    });
    k.oeffnungszeiten.hinweis = 'Montag Ruhetag';

    k.leistungen = [
      { id: 'leistung-1', name: 'Frühstück „Muster"', beschreibung: 'Gebäck, Butter, Marmelade, weiches Ei, Heißgetränk', preis: '€ 11,90' },
      { id: 'leistung-2', name: 'Cappuccino', beschreibung: 'Bohnen aus einer Salzburger Rösterei', preis: '€ 4,20' },
      { id: 'leistung-3', name: 'Hausgemachte Torten', beschreibung: 'Täglich wechselnd', preis: '€ 4,90' },
      { id: 'leistung-4', name: 'Mittagsteller', beschreibung: 'Dienstag bis Freitag, 11:30–14:00', preis: '€ 10,50' }
    ];

    k.marke = {
      farben: { primaer: '#6b3f2a', akzent: '#e8b04a', hintergrund: '#fbf6ee', text: '#2b1d14' },
      schriftpaar: 'klassisch',
      ton: 'freundlich',
      zielgruppe: 'Menschen aus Hallein und Umgebung, die gern gemütlich frühstücken, sich mit Freundinnen auf einen Kaffee treffen oder eine Pause vom Einkaufen brauchen.'
    };
    k.kanaele.instagram = { aktiv: true, link: 'https://instagram.example/cafemuster' };
    k.kanaele.facebook = { aktiv: true, link: 'https://facebook.example/cafemuster' };
    k.kanaele.google = { aktiv: true, link: '' };
    k.paket = { paketId: 'paket-plus', preis: '', seit: SM.datum.plusMonate(planMonat, -2) + '-01' };
    k.bilder = beispielBilder();

    k.onboarding = {
      ziele: 'Bekannter werden bei Leuten, die neu in Hallein sind. Mehr Gäste unter der Woche am Vormittag.',
      zielgruppe: 'Frauen und Männer zwischen 25 und 60 aus Hallein, Oberalm und Kuchl. Viele Stammgäste, Mütter am Vormittag, Leute aus den Büros zu Mittag.',
      besonderheiten: 'Alles hausgemacht, ruhiger Gastgarten im Innenhof, man kennt die Gäste beim Namen.',
      angebote: 'Frühstück, Torten, Mittagsteller, Kaffee zum Mitnehmen.',
      saison: 'Gastgarten ab Mai, Advent mit Keksen und Punsch, Betriebsurlaub in der letzten Augustwoche.',
      konkurrenz: 'Die Bäckerei am Stadtplatz zeigt schöne Bilder aus der Backstube.',
      bisher: 'Instagram und Facebook gibt es, aber es wird nur alle paar Wochen etwas gepostet.',
      dos: 'Per Du, herzlich, auch einmal Dialekt. Das Team zeigen.',
      donts: 'Keine Gäste ohne Erlaubnis zeigen. Keine Rabattschlachten.',
      fotos: 'Maria schickt Fotos per WhatsApp; einmal im Monat darf ich vormittags vorbeikommen.',
      freigabe: 'Maria gibt per WhatsApp frei, meist am selben Tag.'
    };

    var paket = SM.konfig.hole(SM.konfig.standardPakete, 'paket-plus');
    k.strategie = SM.strategie.erzeuge(k, paket);
    k.events = [{ id: 'event-1', datum: planMonat + '-20', titel: 'Kekse-Backen für Kinder im Café' }];
    k.hashtagSets = [{ id: 'set-1', name: 'Stammset', tags: '#cafemuster #hallein #frühstück #mehlspeisen #tennengau' }];

    // Fertiger Monatsplan: aus dem Generator, Platzhalter gefüllt, Fotos und Status verteilt
    var fotos = ['bild-kaffee', 'bild-torte', 'bild-gastraum', 'bild-team'];
    var statusFolge = ['veroeffentlicht', 'veroeffentlicht', 'veroeffentlicht', 'geplant', 'freigegeben', 'freigabe', 'freigabe', 'entwurf'];
    k.posts = SM.planGenerator.erzeuge(k, planMonat);
    k.posts.forEach(function (post, index) {
      fuelle(post, k);
      post.id = 'post-beispiel-' + (index + 1);
      post.uhrzeit = index % 2 === 0 ? '09:00' : '17:30';
      post.status = statusFolge[Math.min(index, statusFolge.length - 1)];
      post.folien[0].id = 'folie-beispiel-' + (index + 1);
      post.folien[0].bildId = post.beitragsart === 'team' ? 'bild-team' : fotos[index % fotos.length];
      post.folien[0].bildId2 = fotos[(index + 1) % fotos.length];
      post.folien[0].farbschema = ['marke', 'hell', 'dunkel'][index % 3];
    });

    // Ein Beitrag wird zum Karussell (damit man das gleich ausprobieren kann)
    if (k.posts.length > 1) {
      var karussell = k.posts[1];
      karussell.titel = 'Karussell: 3 Gründe für ein Frühstück bei uns';
      karussell.beitragsart = 'tipp';
      karussell.format = 'feed-hoch';
      karussell.caption = 'Drei Gründe, warum sich das Aufstehen lohnt. Welcher ist deiner? Reservieren könnt ihr unter ' + k.stamm.telefon + '.';
      var titelFolie = karussell.folien[0];
      titelFolie.vorlage = 'titel-folie';
      titelFolie.texte = { titel: '3 Gründe für ein Frühstück bei uns', untertitel: 'Guten Morgen', text: 'Wischen für mehr', zusatz: '{Firmenname}' };
      titelFolie.bildId = 'bild-kaffee';
      var listenFolie = SM.datenmodell.leereFolie('liste');
      listenFolie.id = 'folie-beispiel-liste';
      listenFolie.farbschema = 'hell';
      listenFolie.texte = { titel: 'Darum bei uns', untertitel: 'Frühstück', text: 'Alles hausgemacht\nKaffee aus Salzburg\nRuhiger Gastgarten im Innenhof', zusatz: '{Firmenname}' };
      var schlussFolie = SM.datenmodell.leereFolie('angebot');
      schlussFolie.id = 'folie-beispiel-schluss';
      schlussFolie.texte = { titel: 'Frühstück für zwei um € 19', untertitel: 'Bis Sonntag', text: 'Jetzt Tisch reservieren', zusatz: '{Telefon}' };
      karussell.folien = [titelFolie, listenFolie, schlussFolie];
    }

    // Zwei Monatsberichte mit Beispielzahlen (für Vergleich und Diagramme)
    var vorletzter = SM.datenmodell.leererBericht(SM.datum.plusMonate(planMonat, -2));
    vorletzter.id = 'bericht-beispiel-1';
    vorletzter.kennzahlen = { reichweite: 1840, follower: 412, interaktionen: 156, profilaufrufe: 230, websiteKlicks: 18, anrufe: 6, beitraege: 9 };
    var letzter = SM.datenmodell.leererBericht(SM.datum.plusMonate(planMonat, -1));
    letzter.id = 'bericht-beispiel-2';
    letzter.kennzahlen = { reichweite: 2310, follower: 438, interaktionen: 204, profilaufrufe: 297, websiteKlicks: 25, anrufe: 9, routen: 14, bewertungen: 2, beitraege: 12 };
    letzter.topPosts = [
      { id: 'top-1', titel: 'Reel: Ein Cappuccino entsteht', wert: '860 erreichte Konten, 74 Likes' },
      { id: 'top-2', titel: 'Vorstellung von Anna aus dem Service', wert: '540 erreichte Konten, 61 Likes, 9 Kommentare' },
      { id: 'top-3', titel: 'Frühstücks-Aktion', wert: '490 erreichte Konten, 12 gespeichert' }
    ];
    letzter.einschaetzung = 'BEISPIELZAHLEN zum Ausprobieren. Beiträge mit Menschen aus dem Team kommen am besten an. Reine Angebots-Grafiken werden weniger oft angesehen.';
    letzter.plan = 'Ein weiteres Team-Porträt, ein Reel aus der Backstube und rechtzeitig die Öffnungszeiten für die Feiertage.';
    k.berichte = [vorletzter, letzter];

    // Durch die Migration schicken: So bekommt das Beispiel automatisch jedes
    // Feld, das später in datenmodell.js dazukommt.
    return SM.migration.migriere(k);
  };
})();
