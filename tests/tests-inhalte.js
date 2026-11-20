/* =====================================================================
   tests-inhalte.js – Tests für die Konfiguration (Inhalte)
   ---------------------------------------------------------------------
   Diese Tests fangen die typischen Fehler beim Erweitern ab: neue
   Branche ohne Reel-Ideen, Beitragsart ohne Texte, Verweis auf eine
   Vorlage, die es nicht gibt … Wer in js/konfig etwas ergänzt, sieht
   hier sofort, ob noch etwas fehlt.
   ===================================================================== */
(function () {
  'use strict';

  var fall = SM.test.fall;
  var gleich = SM.test.gleich;
  var wahr = SM.test.wahr;

  var BRANCHEN = ['allgemein', 'friseur', 'handwerk', 'gastro', 'verein', 'fitness', 'einzelhandel', 'autowerkstatt', 'arzt', 'fotograf', 'reinigung'];

  fall('Inhalte', 'es gibt alle 11 Branchen (gleiche ids wie im Website-Baukasten)', function () {
    BRANCHEN.forEach(function (id) {
      wahr(SM.konfig.holeBranche(id), 'Branche fehlt: ' + id);
    });
  });

  fall('Inhalte', 'jede Branche hat Säulen (100 %), Textbausteine, Hashtags und mindestens 10 Reel-Ideen', function () {
    SM.konfig.branchen.forEach(function (branche) {
      var summe = branche.saeulen.reduce(function (zwischen, saeule) { return zwischen + saeule.anteil; }, 0);
      gleich(summe, 100, branche.id + ': Anteile der Säulen');
      branche.saeulen.forEach(function (saeule) {
        saeule.beitragsarten.forEach(function (art) {
          wahr(SM.konfig.holeBeitragsart(art), branche.id + ': unbekannte Beitragsart ' + art);
        });
      });
      wahr(SM.konfig.textbausteine[branche.id], branche.id + ': Textbausteine fehlen');
      wahr((SM.konfig.hashtags.branchen[branche.id] || []).length >= 3, branche.id + ': Hashtags fehlen');
      wahr((SM.konfig.reels[branche.id] || []).length >= 10, branche.id + ': weniger als 10 Reel-Ideen');
    });
  });

  fall('Inhalte', 'jede Reel-Idee ist vollständig (Hook, Szenen, Einblendungen, Musik, Tipp)', function () {
    Object.keys(SM.konfig.reels).forEach(function (branche) {
      SM.konfig.reels[branche].forEach(function (idee) {
        var ok = idee.titel && idee.hook && idee.szenen.length >= 2 && idee.einblendungen.length >= 1 && idee.musik && idee.tipp;
        wahr(ok, branche + ': unvollständige Idee „' + idee.titel + '"');
      });
    });
    wahr(SM.konfig.reelFilmTipps.length >= 5, 'allgemeine Film-Tipps');
  });

  fall('Inhalte', 'jede Beitragsart hat eine vorhandene Grafik-Vorlage und mindestens 2 allgemeine Captions', function () {
    SM.konfig.beitragsarten.forEach(function (art) {
      wahr(SM.grafik.hole(art.vorlage), art.id + ': Grafik-Vorlage fehlt: ' + art.vorlage);
      wahr((SM.konfig.textbausteine.allgemein[art.id] || []).length >= 2, art.id + ': weniger als 2 allgemeine Captions');
    });
  });

  fall('Inhalte', 'Textbausteine enthalten keine unbekannten Platzhalter', function () {
    var erlaubt = ['firmenname', 'ort', 'slogan', 'telefon', 'email', 'website', 'strasse', 'branche', 'ansprechperson',
      'angebot', 'preis', 'datum', 'thema', 'name', 'zitat', 'stelle', 'uhrzeit'];
    Object.keys(SM.konfig.textbausteine).forEach(function (branche) {
      Object.keys(SM.konfig.textbausteine[branche]).forEach(function (art) {
        wahr(SM.konfig.holeBeitragsart(art), branche + ': Texte für unbekannte Beitragsart ' + art);
        SM.konfig.textbausteine[branche][art].forEach(function (text) {
          SM.platzhalter.offene(text).forEach(function (platzhalter) {
            wahr(erlaubt.indexOf(platzhalter.slice(1, -1).toLowerCase()) !== -1, branche + '/' + art + ': unbekannter Platzhalter ' + platzhalter);
          });
        });
      });
    });
  });

  fall('Inhalte', 'Hashtags: Orts-Sets, eigener Ort und Zähler', function () {
    gleich(SM.konfig.ortsHashtags('hallein')[0], '#hallein', 'bekannter Ort, Schreibweise egal');
    gleich(SM.konfig.ortsHashtags('Bad Ischl')[0], '#badischl', 'unbekannter Ort wird selbst zum Hashtag');
    gleich(SM.konfig.zaehleHashtags('#a #b text #c'), 3, 'Zähler');
    var kunde = SM.datenmodell.leererKunde();
    kunde.stamm.branche = 'gastro';
    kunde.stamm.ort = 'Hallein';
    gleich(SM.konfig.zaehleHashtags(SM.konfig.standardHashtags(kunde)), 5, '3 der Branche + 2 des Ortes');
  });

  fall('Inhalte', 'mindestens 15 Grafik-Vorlagen, alle mit Namen und Text-Plätzen', function () {
    var vorlagen = SM.grafik.alle();
    wahr(vorlagen.length >= 15, 'nur ' + vorlagen.length + ' Vorlagen');
    vorlagen.forEach(function (vorlage) {
      wahr(vorlage.name && Object.keys(vorlage.plaetze).length >= 1, vorlage.id + ': Name oder Text-Plätze fehlen');
      wahr([0, 1, 2].indexOf(vorlage.bilder) !== -1, vorlage.id + ': bilder muss 0, 1 oder 2 sein');
    });
  });

  fall('Inhalte', 'Formate, Kanäle und Status sind vollständig', function () {
    gleich(SM.konfig.hole(SM.konfig.formate, 'feed-quadrat').breite + 'x' + SM.konfig.hole(SM.konfig.formate, 'feed-quadrat').hoehe, '1080x1080', 'Quadrat');
    gleich(SM.konfig.hole(SM.konfig.formate, 'feed-hoch').hoehe, 1350, 'Hochformat');
    gleich(SM.konfig.hole(SM.konfig.formate, 'story').hoehe, 1920, 'Story');
    gleich(SM.konfig.kanaele.map(function (kanal) { return kanal.id; }), ['instagram', 'facebook', 'tiktok', 'google'], 'Kanäle');
    gleich(SM.konfig.status.map(function (status) { return status.id; }), ['idee', 'entwurf', 'freigabe', 'freigegeben', 'geplant', 'veroeffentlicht'], 'Status-Reihenfolge');
    gleich(SM.konfig.hole(SM.konfig.kanaele, 'instagram').grenze, 2200, 'Zeichen-Grenze Instagram');
    gleich(SM.konfig.hole(SM.konfig.kanaele, 'instagram').hashtagMax, 5, 'Hashtag-Grenze Instagram (seit Dez. 2025)');
  });

  fall('Inhalte', 'Farben einer Grafik: lesbare Schrift in allen drei Farbschemata', function () {
    var kunde = SM.konfig.beispielKunde('2026-11');
    ['marke', 'hell', 'dunkel'].forEach(function (schema) {
      var farben = SM.grafik.farbenFuer(kunde, schema);
      wahr(SM.farben.kontrast(farben.flaeche, farben.schrift) >= 4.5, schema + ': Schrift auf Fläche zu schwach');
      wahr(SM.farben.kontrast(farben.betonung, farben.aufBetonung) >= 4.5, schema + ': Schrift auf Betonung zu schwach');
      wahr(SM.farben.kontrast(farben.flaeche, farben.betonung) >= 1.5, schema + ': Betonung hebt sich nicht ab');
    });
    gleich(SM.grafik.dateiname(kunde, kunde.posts[0], 0).slice(-4), '.png', 'Dateiname');
  });

  fall('Inhalte', 'Check-Punkte und Akquise-Vorlagen sind vollständig', function () {
    SM.konfig.checkPunkte.forEach(function (punkt) {
      wahr(punkt.id && punkt.gruppe && punkt.name && punkt.frage && punkt.lob && punkt.vorschlag, 'Check-Punkt unvollständig: ' + punkt.id);
    });
    wahr(SM.konfig.checkPunkte.length >= 12, 'mindestens 12 Check-Punkte');
    var text = SM.konfig.fuelleAkquise(SM.konfig.akquiseVorlagen[0].text,
      { name: 'Hasan Tester', telefon: '0660', email: 'h@t.example', ort: 'Hallein' },
      { betrieb: 'Café X', ansprechperson: 'Frau Huber', ort: 'Kuchl', aufhaenger: 'Ich bin Stammgast.' });
    gleich(SM.platzhalter.offene(text), [], 'alle Platzhalter der E-Mail gefüllt');
    wahr(text.indexOf('Frau Huber') !== -1 && text.indexOf('Hasan Tester') !== -1, 'Namen eingesetzt');
    gleich(SM.konfig.akquiseVorlagen.map(function (vorlage) { return vorlage.id; }), ['email', 'instagram', 'erinnerung', 'besuch'], 'vier Vorlagen');
  });

  fall('Beispielkunde', 'Café Muster: fertiger Monatsplan, Karussell, Berichte – und bereits im aktuellen Format', function () {
    var kunde = SM.konfig.beispielKunde('2026-11');
    gleich(kunde.stamm.firmenname + ', ' + kunde.stamm.ort, 'Café Muster, Hallein', 'Name und Ort');
    gleich(kunde.posts.length, kunde.strategie.postsProMonat + kunde.strategie.reelsProMonat, 'Monatsplan vollständig');
    wahr(kunde.posts.every(function (post) { return SM.platzhalter.offene(post.caption).length === 0; }), 'keine offenen Platzhalter in den Captions');
    wahr(kunde.posts.some(function (post) { return post.folien.length === 3; }), 'ein Karussell mit 3 Folien');
    wahr(kunde.posts.every(function (post) { return SM.konfig.hole(SM.konfig.status, post.status); }), 'gültige Status');
    gleich(kunde.berichte.length, 2, 'zwei Monatsberichte');
    wahr(SM.grafik.logoVon(kunde), 'Logo vorhanden');
    gleich(JSON.stringify(SM.migration.migriere(kunde)), JSON.stringify(kunde), 'Migration ändert nichts mehr');
  });
})();
