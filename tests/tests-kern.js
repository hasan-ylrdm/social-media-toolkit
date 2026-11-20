/* =====================================================================
   tests-kern.js – Tests für die Logik ohne Oberfläche
   (Helfer, Platzhalter, Datum, Migration, Kundendatei, Baukasten-Import,
    ZIP, Kalender, Strategie, Plan-Generator, Kennzahlen, Geschäft, KI)
   ---------------------------------------------------------------------
   NEUER TEST nach dem Muster:
     fall('Gruppe', 'was geprüft wird', function () {
       gleich(istWert, sollWert, 'Beschreibung');
     });
   Laufen im Browser (test.html) und im Terminal (node tests/node-pruefung.js).
   ===================================================================== */
(function () {
  'use strict';

  var fall = SM.test.fall;
  var gleich = SM.test.gleich;
  var wahr = SM.test.wahr;
  var wirft = SM.test.wirft;

  /* ---------- Helfer ---------- */
  fall('Helfer', 'escapeHtml macht HTML-Zeichen unschädlich', function () {
    gleich(SM.helfer.escapeHtml('<b>"A" & B</b>'), '&lt;b&gt;&quot;A&quot; &amp; B&lt;/b&gt;', 'escapeHtml');
  });

  fall('Helfer', 'slug erzeugt Dateinamen aus Text mit Umlauten', function () {
    gleich(SM.helfer.slug('Café Müller & Söhne'), 'cafe-mueller-soehne', 'slug');
  });

  fall('Helfer', 'holePfad/setzePfad finden Listen-Einträge über ihre id', function () {
    var daten = { posts: [{ id: 'post-a', titel: 'Alt' }] };
    wahr(SM.helfer.setzePfad(daten, 'posts.post-a.titel', 'Neu'), 'setzePfad meldet Erfolg');
    gleich(SM.helfer.holePfad(daten, 'posts.post-a.titel'), 'Neu', 'holePfad');
    gleich(SM.helfer.setzePfad(daten, 'posts.gibt-es-nicht.titel', 'x'), false, 'unbekannte id');
  });

  /* ---------- Platzhalter ---------- */
  fall('Platzhalter', '{Firmenname} und {Ort} werden ersetzt (Großschreibung egal)', function () {
    var kunde = SM.datenmodell.leererKunde();
    kunde.stamm.firmenname = 'Café Muster';
    kunde.stamm.ort = 'Hallein';
    gleich(SM.platzhalter.ersetze('{Firmenname} in {ORT}', kunde), 'Café Muster in Hallein', 'ersetzt');
  });

  fall('Platzhalter', 'unbekannte und leere Platzhalter bleiben sichtbar stehen', function () {
    var kunde = SM.datenmodell.leererKunde();
    gleich(SM.platzhalter.ersetze('{Angebot} bei {Firmenname}', kunde), '{Angebot} bei {Firmenname}', 'bleibt stehen');
    gleich(SM.platzhalter.offene('{Angebot} bis {Datum}'), ['{Angebot}', '{Datum}'], 'offene');
    gleich(SM.platzhalter.ersetze('{Angebot}', kunde, { Angebot: '−20 %' }), '−20 %', 'Zusatzwert');
  });

  fall('Platzhalter', 'Captions: erst die der Branche, dann die allgemeinen', function () {
    var liste = SM.platzhalter.captions('gastro', 'angebot');
    var allgemein = SM.konfig.textbausteine.allgemein.angebot;
    wahr(liste.length > allgemein.length, 'Branche + allgemein');
    gleich(liste[liste.length - 1], allgemein[allgemein.length - 1], 'allgemeine am Ende');
  });

  /* ---------- Datum und Kalender ---------- */
  fall('Datum', 'Wochentag, Monatsrechnung und Ostern stimmen', function () {
    gleich(SM.datum.wochentag('2026-11-13'), 4, '13.11.2026 ist ein Freitag');
    gleich(SM.datum.plusMonate('2026-12', 2), '2027-02', 'über den Jahreswechsel');
    gleich(SM.datum.ostersonntag(2026), '2026-04-05', 'Ostern 2026');
    gleich(SM.datum.tageImMonat('2028-02').length, 29, 'Schaltjahr');
  });

  fall('Kalender', 'Feiertage, Anlässe, Ferien und eigene Termine erscheinen', function () {
    var kunde = SM.datenmodell.leererKunde();
    kunde.events.push({ id: 'e1', datum: '2026-05-20', titel: 'Stadtfest' });
    var mai = SM.kalenderDaten.fuerZeitraum('2026-05-01', '2026-05-31', kunde);
    var titel = function (datum) {
      return (mai[datum] || []).map(function (eintrag) { return eintrag.art + ':' + eintrag.titel; }).join('|');
    };
    wahr(titel('2026-05-01').indexOf('feiertag:Staatsfeiertag') !== -1, 'Staatsfeiertag');
    wahr(titel('2026-05-10').indexOf('Muttertag') !== -1, 'Muttertag = 2. Sonntag im Mai');
    wahr(titel('2026-05-14').indexOf('feiertag:Christi Himmelfahrt') !== -1, 'Christi Himmelfahrt');
    wahr(titel('2026-05-20').indexOf('event:Stadtfest') !== -1, 'eigener Termin');
    var august = SM.kalenderDaten.fuerZeitraum('2026-08-01', '2026-08-31', null);
    wahr((august['2026-08-10'] || []).some(function (eintrag) { return eintrag.art === 'ferien'; }), 'Sommerferien');
  });

  /* ---------- Migration ---------- */
  fall('Migration', 'altes Format (ohne Version) wird auf das aktuelle gebracht', function () {
    var alt = {
      id: 'kunde-alt',
      stamm: { firmenname: 'Altbetrieb' },
      posts: [{ datum: '2026-01-05', kanal: 'facebook', hashtags: ['#a', '#b'] }]
    };
    var neu = SM.migration.migriere(alt);
    gleich(neu.formatVersion, SM.FORMAT_VERSION, 'Version gesetzt');
    gleich(neu.stamm.firmenname, 'Altbetrieb', 'vorhandene Werte bleiben');
    gleich(neu.stamm.land, 'Österreich', 'fehlende Felder ergänzt');
    gleich(neu.posts[0].kanaele, ['facebook'], 'kanal → kanaele');
    gleich(neu.posts[0].hashtags, '#a #b', 'Hashtag-Liste → Text');
    wahr(neu.posts[0].id && neu.posts[0].folien.length === 1, 'Post bekommt id und eine Folie');
    gleich(neu.oeffnungszeiten.tage.length, 7, 'Öffnungszeiten ergänzt');
    gleich(alt.posts[0].kanal, 'facebook', 'das Original bleibt unverändert');
  });

  fall('Migration', 'Datei aus neuerer Version wird mit klarer Meldung abgelehnt', function () {
    wirft(function () {
      SM.migration.migriere({ formatVersion: SM.FORMAT_VERSION + 1, stamm: {} });
    }, 'neuere Version');
  });

  fall('Migration', 'Einstellungen: fehlende Felder werden ergänzt, Key bleibt erhalten', function () {
    var einstellungen = SM.migration.migriereEinstellungen({ ki: { apiKey: 'sk-test' }, meineDaten: { name: 'Hasan' } });
    gleich(einstellungen.ki.apiKey, 'sk-test', 'Key bleibt');
    gleich(einstellungen.meineDaten.name, 'Hasan', 'Name bleibt');
    gleich(einstellungen.pakete.length, 3, 'drei Start-Pakete');
    wahr(Array.isArray(einstellungen.aufgaben), 'Aufgaben-Liste da');
  });

  /* ---------- Kundendatei (Export / Import) ---------- */
  fall('Kundendatei', 'Export und Import ergeben denselben Kunden', function () {
    var kunde = SM.konfig.beispielKunde('2026-11');
    var zurueck = SM.kundendatei.ausText(SM.kundendatei.zuText(kunde));
    gleich(JSON.stringify(zurueck), JSON.stringify(kunde), 'Kunde nach Export und Import');
    gleich(SM.kundendatei.dateiname(kunde), 'cafe-muster.kunde.json', 'Dateiname');
  });

  fall('Kundendatei', 'erkennt Kundendatei, Sicherung, Baukasten-Projekt und Unbekanntes', function () {
    var kunde = SM.datenmodell.leererKunde();
    gleich(SM.kundendatei.erkenne(SM.kundendatei.zuText(kunde)), 'kunde', 'Kundendatei');
    gleich(SM.kundendatei.erkenne(SM.kundendatei.sicherungZuText([kunde], SM.datenmodell.standardEinstellungen())), 'sicherung', 'Sicherung');
    gleich(SM.kundendatei.erkenne('{"art":"website-baukasten-projekt","projekt":{"betrieb":{}}}'), 'baukasten', 'Baukasten');
    gleich(SM.kundendatei.erkenne('kein json'), 'unbekannt', 'kein JSON');
    wirft(function () { SM.kundendatei.ausText('{"betrieb":{}}'); }, 'Baukasten-Datei ist keine Kundendatei');
  });

  fall('Kundendatei', 'Gesamt-Sicherung enthält alle Kunden, aber NIE den API-Key', function () {
    var einstellungen = SM.datenmodell.standardEinstellungen();
    einstellungen.ki.apiKey = 'sk-GEHEIM-12345';
    einstellungen.meineDaten.name = 'Hasan Tester';
    var text = SM.kundendatei.sicherungZuText([SM.konfig.beispielKunde('2026-11')], einstellungen);
    wahr(text.indexOf('sk-GEHEIM-12345') === -1, 'Key nicht in der Sicherung');
    gleich(einstellungen.ki.apiKey, 'sk-GEHEIM-12345', 'Key bleibt in den laufenden Einstellungen');
    var zurueck = SM.kundendatei.sicherungAusText(text);
    gleich(zurueck.kunden.length, 1, 'ein Kunde');
    gleich(zurueck.einstellungen.meineDaten.name, 'Hasan Tester', 'Meine Daten');
  });

  /* ---------- Import aus dem Website-Baukasten ---------- */
  fall('Baukasten-Import', 'übernimmt Stammdaten, Zeiten, Leistungen, Farben, Fotos und Kanäle', function () {
    var projekt = {
      art: 'website-baukasten-projekt', formatVersion: 1,
      projekt: {
        betrieb: { firmenname: 'Tischlerei Test', branche: 'handwerk', ort: 'Kuchl', telefon: '+43 1', email: 'a@b.example', slogan: '' },
        seo: { domain: 'https://tischlerei.example' },
        recht: { inhaber: 'Franz Test' },
        oeffnungszeiten: { hinweis: 'Sa nach Vereinbarung', tage: SM.datenmodell.standardTage() },
        leistungen: [{ id: 'l1', name: 'Küchen', beschreibung: 'nach Maß', preis: 'ab € 5.000', bildId: 'x' }],
        design: { farben: { primaer: '#112233', akzent: '#aabbcc', hintergrund: '#ffffff', text: '#000000' }, schriftpaar: 'klassisch' },
        bilder: [
          { id: 'b-logo', name: 'Logo', dataUrl: 'data:image/png;base64,AAAA', bereich: 'logo' },
          { id: 'b-start', name: 'Werkstatt', dataUrl: 'data:image/png;base64,BBBB', bereich: 'start', alt: 'Werkstatt' }
        ],
        social: { instagram: 'https://instagram.example/tischlerei', facebook: '' }
      }
    };
    var kunde = SM.baukastenImport.neuerKunde(JSON.stringify(projekt));
    gleich(kunde.stamm.firmenname, 'Tischlerei Test', 'Firmenname');
    gleich(kunde.stamm.branche, 'handwerk', 'Branche');
    gleich(kunde.stamm.website, 'https://tischlerei.example', 'Website aus SEO-Domain');
    gleich(kunde.ansprechperson.name, 'Franz Test', 'Inhaber → Ansprechperson');
    gleich(kunde.oeffnungszeiten.hinweis, 'Sa nach Vereinbarung', 'Öffnungszeiten');
    gleich(kunde.leistungen[0], { id: 'l1', name: 'Küchen', beschreibung: 'nach Maß', preis: 'ab € 5.000' }, 'Leistung ohne bildId');
    gleich(kunde.marke.farben.primaer, '#112233', 'Farben');
    gleich(kunde.marke.schriftpaar, 'klassisch', 'Schrift');
    gleich(kunde.bilder.map(function (bild) { return bild.bereich; }), ['logo', 'foto'], 'Logo bleibt Logo, Rest wird Foto');
    gleich(kunde.kanaele.instagram, { aktiv: true, link: 'https://instagram.example/tischlerei' }, 'Instagram aktiv');
    gleich(kunde.kanaele.facebook.aktiv, false, 'leerer Link aktiviert nichts');
    gleich(kunde.formatVersion, SM.FORMAT_VERSION, 'Toolkit-Format');
  });

  fall('Baukasten-Import', 'Nachladen ändert Beiträge nicht und legt Fotos nicht doppelt an', function () {
    var kunde = SM.konfig.beispielKunde('2026-11');
    var postsVorher = JSON.stringify(kunde.posts);
    var projekt = { betrieb: { firmenname: 'Café Muster NEU', ort: '' }, bilder: [{ id: 'bild-kaffee', dataUrl: 'data:x' }, { id: 'neu-1', dataUrl: 'data:y' }] };
    var anzahlVorher = kunde.bilder.length;
    SM.baukastenImport.uebernehmeIn(kunde, projekt);
    gleich(kunde.stamm.firmenname, 'Café Muster NEU', 'Name übernommen');
    gleich(kunde.stamm.ort, 'Hallein', 'leerer Wert überschreibt nichts');
    gleich(kunde.bilder.length, anzahlVorher + 1, 'nur das neue Foto kommt dazu');
    gleich(JSON.stringify(kunde.posts), postsVorher, 'Beiträge unverändert');
    wirft(function () { SM.baukastenImport.lies('{"stamm":{}}'); }, 'Toolkit-Kunde ist kein Baukasten-Projekt');
  });

  fall('Baukasten-Import', 'die echte Beispieldatei des Website-Baukastens lässt sich importieren', function () {
    // Der Text der Datei wird nur von tests/node-pruefung.js bereitgestellt;
    // im Browser kann test.html keine Dateien von der Platte lesen.
    if (typeof SM_BAUKASTEN_BEISPIEL === 'undefined') {
      return;
    }
    var kunde = SM.baukastenImport.neuerKunde(SM_BAUKASTEN_BEISPIEL);
    gleich(kunde.stamm.firmenname, 'Salon Musterfrau', 'Firmenname');
    gleich(kunde.stamm.branche, 'friseur', 'Branche');
    gleich(kunde.stamm.ort, 'Hallein', 'Ort');
    wahr(kunde.leistungen.length > 0 && kunde.bilder.length > 0, 'Leistungen und Fotos');
    wahr(kunde.kanaele.instagram.aktiv && kunde.kanaele.facebook.aktiv, 'Kanäle aus den Social-Links');
    wahr(SM.farben.istGueltig(kunde.marke.farben.primaer), 'Farbe übernommen');
  });

  /* ---------- ZIP ---------- */
  fall('ZIP', 'erzeugte ZIP-Datei lässt sich wieder lesen', function () {
    var dateien = [
      { pfad: 'a_1.png', bytes: new Uint8Array([137, 80, 78, 71]) },
      { pfad: 'ordner/ä.txt', bytes: SM.helfer.textZuBytes('Grüß Gott') }
    ];
    var gelesen = SM.zip.lese(SM.zip.erzeuge(dateien));
    gleich(gelesen.map(function (datei) { return datei.pfad; }), ['a_1.png', 'ordner/ä.txt'], 'Pfade');
    gleich(Array.from(gelesen[0].bytes), [137, 80, 78, 71], 'Inhalt');
  });

  /* ---------- Strategie und Plan-Generator ---------- */
  fall('Strategie', 'Vorschlag nimmt Zahlen aus dem Paket und Antworten aus dem Fragebogen', function () {
    var kunde = SM.datenmodell.leererKunde();
    kunde.stamm.branche = 'friseur';
    kunde.onboarding.ziele = 'Mehr Neukunden';
    kunde.onboarding.donts = 'Keine Preise';
    var strategie = SM.strategie.erzeuge(kunde, { postsProMonat: 12, storiesProWoche: 3, reelsProMonat: 1 });
    gleich(strategie.postsProMonat, 12, 'Beiträge aus dem Paket');
    gleich(strategie.ziele, 'Mehr Neukunden', 'Ziele aus dem Fragebogen');
    wahr(strategie.hinweise.indexOf('Keine Preise') !== -1, 'Don\'ts übernommen');
    wahr(strategie.saeulen.length >= 3, 'Themen-Säulen der Branche');
    gleich(strategie.saeulen.reduce(function (summe, saeule) { return summe + saeule.anteil; }, 0), 100, 'Anteile ergeben 100');
  });

  fall('Plan-Generator', 'erzeugt die richtige Zahl Beiträge, sortiert, im Monat, vorhersagbar', function () {
    var kunde = SM.konfig.beispielKunde('2026-11');
    var plan = SM.planGenerator.erzeuge(kunde, '2027-03');
    var erwartet = kunde.strategie.postsProMonat + kunde.strategie.reelsProMonat;
    gleich(plan.length, erwartet, 'Beiträge + Reels');
    wahr(plan.every(function (post) { return post.datum.slice(0, 7) === '2027-03'; }), 'alle im Monat');
    wahr(plan.every(function (post, index) { return index === 0 || plan[index - 1].datum <= post.datum; }), 'nach Datum sortiert');
    wahr(plan.every(function (post) { return post.status === 'idee' && post.folien.length === 1; }), 'Status Idee, eine Folie');
    var nochmal = SM.planGenerator.erzeuge(kunde, '2027-03');
    gleich(nochmal.map(function (post) { return post.datum + post.beitragsart; }), plan.map(function (post) { return post.datum + post.beitragsart; }), 'gleiche Eingabe, gleicher Plan');
  });

  fall('Plan-Generator', 'mischt die Themen-Säulen nach ihrem Anteil und beachtet Feiertage', function () {
    var saeulen = [{ id: 'a', anteil: 50 }, { id: 'b', anteil: 25 }, { id: 'c', anteil: 25 }];
    var folge = SM.planGenerator.verteileSaeulen(saeulen, 8).map(function (saeule) { return saeule.id; });
    gleich(folge.filter(function (id) { return id === 'a'; }).length, 4, 'Säule mit 50 % bekommt die Hälfte');
    wahr(folge.every(function (id, index) { return index < 2 || !(folge[index - 1] === id && folge[index - 2] === id); }), 'nie dreimal dieselbe hintereinander');
    var kunde = SM.konfig.beispielKunde('2026-11');
    var dezember = SM.planGenerator.erzeuge(kunde, '2026-12');
    wahr(dezember.some(function (post) { return post.beitragsart === 'oeffnungszeiten'; }), 'vor einem Feiertag gibt es einen Öffnungszeiten-Beitrag');
  });

  fall('Plan-Generator', 'Feiertagsmonate kippen die Mischung nicht (höchstens ein Viertel Öffnungszeiten)', function () {
    var kunde = SM.konfig.beispielKunde('2026-11');
    ['2026-12', '2027-05'].forEach(function (monat) {
      var plan = SM.planGenerator.erzeuge(kunde, monat);
      var oeffnung = plan.filter(function (post) { return post.beitragsart === 'oeffnungszeiten'; });
      wahr(oeffnung.length <= Math.max(1, Math.floor(kunde.strategie.postsProMonat / 4)), monat + ': zu viele Öffnungszeiten-Beiträge (' + oeffnung.length + ')');
    });
    var dezember = SM.planGenerator.erzeuge(kunde, '2026-12');
    wahr(dezember.every(function (post) {
      return post.beitragsart !== 'oeffnungszeiten' || ['2026-12-08', '2026-12-25', '2026-12-26'].indexOf(post.datum) === -1;
    }), 'Öffnungszeiten-Beitrag steht nicht am Feiertag selbst');
  });

  fall('Geschäft', 'abweichender Preis versteht "350 €" und "299,50"', function () {
    var kunde = SM.datenmodell.leererKunde();
    kunde.paket.preis = '350 €';
    gleich(SM.geschaeft.preisVon(kunde, SM.datenmodell.standardEinstellungen()), 350, 'mit Euro-Zeichen');
    kunde.paket.preis = '299,50';
    gleich(SM.geschaeft.preisVon(kunde, SM.datenmodell.standardEinstellungen()), 299.5, 'mit Komma');
  });

  /* ---------- Kennzahlen und Geschäft ---------- */
  fall('Kennzahlen', 'Vergleich zum Vormonat rechnet richtig und erfindet nichts', function () {
    var kunde = SM.datenmodell.leererKunde();
    var oktober = SM.datenmodell.leererBericht('2026-10');
    oktober.kennzahlen = { reichweite: 1000, follower: 200 };
    var november = SM.datenmodell.leererBericht('2026-11');
    november.kennzahlen = { reichweite: 1250, follower: 200, anrufe: 4, routen: '' };
    kunde.berichte = [oktober, november];
    var zeilen = SM.kennzahlen.vergleich(kunde, '2026-11');
    gleich(zeilen.map(function (zeile) { return zeile.id; }), ['reichweite', 'follower', 'anrufe'], 'nur erfasste Kennzahlen');
    gleich([zeilen[0].differenz, zeilen[0].prozent], [250, 25], '+250 = +25 %');
    gleich(zeilen[1].differenz, 0, 'unverändert');
    gleich([zeilen[2].vormonat, zeilen[2].prozent], [null, null], 'ohne Vormonat kein Vergleich');
    gleich(SM.kennzahlen.vergleich(kunde, '2026-09'), [], 'Monat ohne Bericht: nichts');
    gleich(SM.kennzahlen.format(12345.5), '12.345,5', 'Zahlenformat');
  });

  fall('Geschäft', 'Monatsumsatz: Paketpreis oder abweichender Preis, Aufgaben der Woche', function () {
    var einstellungen = SM.datenmodell.standardEinstellungen();
    var a = SM.datenmodell.leererKunde();
    a.stamm.firmenname = 'A';
    a.paket.paketId = 'paket-basis';
    var b = SM.datenmodell.leererKunde();
    b.stamm.firmenname = 'B';
    b.paket.paketId = 'paket-plus';
    b.paket.preis = '350';
    var c = SM.datenmodell.leererKunde();
    var umsatz = SM.geschaeft.umsatz([a, b, c], einstellungen);
    gleich(umsatz.summe, 149 + 350, 'Summe');
    gleich(umsatz.zeilen[2].paketName, '–', 'ohne Paket');
    var post = SM.datenmodell.leererPost('2026-11-12');
    post.titel = 'Angebot';
    a.posts.push(post);
    einstellungen.aufgaben.push({ id: 'x', text: 'Fotos abholen', faellig: '', erledigt: false, kundeId: '' });
    einstellungen.aufgaben.push({ id: 'y', text: 'Erledigt', faellig: '', erledigt: true, kundeId: '' });
    var liste = SM.geschaeft.aufgabenDieserWoche([a, b], einstellungen, '2026-11-13');
    gleich(liste.map(function (eintrag) { return eintrag.art; }), ['post', 'aufgabe'], 'fälliger Beitrag und offene Aufgabe');
  });

  /* ---------- KI ---------- */
  fall('KI', 'Auftrag enthält Kundendaten und Ton, aber weder Key noch Kontaktdaten', function () {
    var kunde = SM.konfig.beispielKunde('2026-11');
    var prompt = SM.ki.bauePrompt('caption', 'Neue Torte', kunde, 'locker');
    var alles = prompt.system + prompt.nutzer;
    wahr(alles.indexOf('Café Muster') !== -1 && alles.indexOf('Hallein') !== -1, 'Betrieb und Ort');
    wahr(prompt.system.indexOf('locker') !== -1, 'Ton');
    wahr(prompt.nutzer.indexOf('Neue Torte') !== -1, 'Eingabe');
    wahr(alles.indexOf(kunde.stamm.telefon) === -1 && alles.indexOf(kunde.stamm.email) === -1, 'keine Kontaktdaten');
    gleich(SM.ki.istBereit(SM.datenmodell.standardEinstellungen()), false, 'ohne Key nicht bereit');
  });
})();
