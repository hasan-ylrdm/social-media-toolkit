/* =====================================================================
   tests-browser.js – Tests, die einen echten Browser brauchen
   (IndexedDB zum Speichern, Canvas für Bilder und Grafiken)
   ---------------------------------------------------------------------
   Im Terminal (node) werden sie übersprungen. Die Tests legen in der
   Datenbank nur Einträge mit eigenen Test-ids an und löschen sie wieder;
   echte Kunden und die Einstellungen werden nicht verändert.
   ===================================================================== */
(function () {
  'use strict';

  var fall = SM.test.fall;
  var gleich = SM.test.gleich;
  var wahr = SM.test.wahr;
  var NUR_BROWSER = { nurBrowser: true };

  /**
   * Liest Breite und Höhe aus den Bytes einer PNG-Datei.
   * @param {Uint8Array} bytes
   * @returns {{istPng: boolean, breite: number, hoehe: number}}
   */
  function pngInfo(bytes) {
    var sicht = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    return {
      istPng: bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71,
      breite: sicht.getUint32(16),
      hoehe: sicht.getUint32(20)
    };
  }

  /* ---------- Speichern und Laden ---------- */
  fall('Speicher', 'Kunde speichern, laden, in der Liste finden und löschen', function () {
    var kunde = SM.konfig.beispielKunde('2026-11');
    kunde.id = 'kunde-test-speicher';
    kunde.stamm.firmenname = 'Testkunde Speicher';
    return SM.speicher.speichereKunde(kunde).then(function () {
      return SM.speicher.ladeKunde('kunde-test-speicher');
    }).then(function (geladen) {
      gleich(JSON.stringify(geladen), JSON.stringify(kunde), 'geladener Kunde = gespeicherter Kunde');
      return SM.speicher.ladeAlleKunden();
    }).then(function (alle) {
      wahr(alle.some(function (eintrag) { return eintrag.id === 'kunde-test-speicher'; }), 'in der Liste');
      return SM.speicher.loescheKunde('kunde-test-speicher');
    }).then(function () {
      return SM.speicher.ladeKunde('kunde-test-speicher');
    }).then(function (weg) {
      gleich(weg, null, 'nach dem Löschen nicht mehr da');
    });
  }, NUR_BROWSER);

  fall('Speicher', 'alter Kunde wird beim Laden automatisch migriert', function () {
    var alt = { id: 'kunde-test-alt', stamm: { firmenname: 'Alt' }, posts: [{ datum: '2026-01-01', kanal: 'instagram' }] };
    return SM.speicher.speichereKunde(alt).then(function () {
      return SM.speicher.ladeKunde('kunde-test-alt');
    }).then(function (geladen) {
      gleich(geladen.formatVersion, SM.FORMAT_VERSION, 'Format aktualisiert');
      gleich(geladen.posts[0].kanaele, ['instagram'], 'Post umgebaut');
      return SM.speicher.loescheKunde('kunde-test-alt');
    });
  }, NUR_BROWSER);

  fall('Speicher', 'Einstellungen laden liefert immer vollständige Einstellungen', function () {
    return SM.speicher.ladeEinstellungen().then(function (einstellungen) {
      wahr(einstellungen.meineDaten && einstellungen.ki && Array.isArray(einstellungen.pakete), 'alle Bereiche vorhanden');
    });
  }, NUR_BROWSER);

  /* ---------- Bilder ---------- */
  fall('Bilder', 'großes Foto wird verkleinert und komprimiert (WebP, sonst JPEG)', function () {
    var canvas = document.createElement('canvas');
    canvas.width = 3000;
    canvas.height = 2000;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#3d7a5c';
    ctx.fillRect(0, 0, 3000, 2000);
    return new Promise(function (erfolg) {
      canvas.toBlob(erfolg, 'image/png');
    }).then(function (blob) {
      return SM.bilder.verarbeiteDatei(new File([blob], 'testfoto.png', { type: 'image/png' }));
    }).then(function (bild) {
      gleich([bild.breite, bild.hoehe], [SM.bilder.MAX_KANTE, Math.round(SM.bilder.MAX_KANTE * 2 / 3)], 'auf die längste Kante verkleinert');
      wahr(/^data:image\/(webp|jpeg)/.test(bild.dataUrl), 'als WebP oder JPEG');
      gleich([bild.name, bild.bereich], ['testfoto', 'foto'], 'Name und Bereich');
    });
  }, NUR_BROWSER);

  /* ---------- Grafik und PNG-Export ---------- */
  fall('Grafik', 'jede Vorlage zeichnet in jedem Format ohne Fehler (mit und ohne Foto)', function () {
    var kunde = SM.konfig.beispielKunde('2026-11');
    var kette = Promise.resolve();
    var gezeichnet = 0;
    SM.grafik.alle().forEach(function (vorlage) {
      SM.konfig.formate.forEach(function (format, formatIndex) {
        kette = kette.then(function () {
          var post = SM.datenmodell.leererPost('2026-11-13');
          var folie = post.folien[0];
          post.format = format.id;
          folie.vorlage = vorlage.id;
          folie.texte = { titel: 'Ein ziemlich langer Titel zum Testen', untertitel: 'Dachzeile', text: 'Erste Zeile\nZweite Zeile\nDritte Zeile', zusatz: 'Bis {Datum} · {Firmenname}' };
          folie.bildId = formatIndex % 2 === 0 ? 'bild-kaffee' : '';
          folie.bildId2 = 'bild-torte';
          folie.farbschema = ['marke', 'hell', 'dunkel'][formatIndex % 3];
          var canvas = document.createElement('canvas');
          return SM.grafik.zeichneFolie(canvas, kunde, post, folie).then(function () {
            gleich([canvas.width, canvas.height], [format.breite, format.hoehe], vorlage.id + ' / ' + format.id + ': Größe');
            var pixel = canvas.getContext('2d').getImageData(format.breite / 2, format.hoehe / 2, 1, 1).data;
            wahr(pixel[3] === 255, vorlage.id + ' / ' + format.id + ': Mitte ist nicht durchsichtig');
            gezeichnet += 1;
          });
        });
      });
    });
    return kette.then(function () {
      gleich(gezeichnet, SM.grafik.alle().length * SM.konfig.formate.length, 'alle Kombinationen gezeichnet');
    });
  }, NUR_BROWSER);

  fall('Grafik', 'PNG-Export hat genau die Größe des Formats (1080×1350, 1080×1080, 1080×1920)', function () {
    var kunde = SM.konfig.beispielKunde('2026-11');
    var post = kunde.posts[0];
    var kette = Promise.resolve();
    [['feed-hoch', 1080, 1350], ['feed-quadrat', 1080, 1080], ['story', 1080, 1920], ['google', 1200, 900]].forEach(function (fallDaten) {
      kette = kette.then(function () {
        post.format = fallDaten[0];
        return SM.grafik.exportierePost(kunde, post);
      }).then(function (datei) {
        var info = pngInfo(datei.bytes);
        wahr(info.istPng && datei.mime === 'image/png' && /\.png$/.test(datei.name), fallDaten[0] + ': PNG-Datei');
        gleich([info.breite, info.hoehe], [fallDaten[1], fallDaten[2]], fallDaten[0] + ': Pixelgröße');
        wahr(datei.bytes.length > 5000, fallDaten[0] + ': Datei hat Inhalt');
      });
    });
    return kette;
  }, NUR_BROWSER);

  fall('Grafik', 'Karussell wird als ZIP mit nummerierten PNGs exportiert', function () {
    var kunde = SM.konfig.beispielKunde('2026-11');
    var karussell = kunde.posts.filter(function (post) { return post.folien.length === 3; })[0];
    return SM.grafik.exportierePost(kunde, karussell).then(function (datei) {
      gleich(datei.mime, 'application/zip', 'ZIP');
      var inhalt = SM.zip.lese(datei.bytes);
      gleich(inhalt.length, 3, 'drei Dateien');
      wahr(inhalt.every(function (eintrag, index) {
        return new RegExp('_' + (index + 1) + '\\.png$').test(eintrag.pfad) && pngInfo(eintrag.bytes).istPng;
      }), 'nummerierte PNG-Dateien');
    });
  }, NUR_BROWSER);

  fall('Grafik', 'Freigabe-Übersicht mit gezeichneten Grafiken (kleine JPEGs)', function () {
    var kunde = SM.konfig.beispielKunde('2026-11');
    var post = kunde.posts[0];
    return SM.grafik.folieAlsDataUrl(kunde, post, post.folien[0], 'image/jpeg', 540).then(function (dataUrl) {
      wahr(/^data:image\/jpeg/.test(dataUrl), 'JPEG');
      var grafiken = {};
      grafiken[post.id] = [dataUrl];
      var html = SM.dokumente.freigabe(kunde, SM.datenmodell.standardEinstellungen(), '2026-11', [post], grafiken);
      wahr(html.indexOf(dataUrl.slice(0, 60)) !== -1, 'Grafik steht im Dokument');
      wahr(html.length < 400000, 'Dokument bleibt handlich');
    });
  }, NUR_BROWSER);
})();
