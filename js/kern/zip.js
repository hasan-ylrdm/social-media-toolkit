/* =====================================================================
   zip.js – eigener, kleiner ZIP-Schreiber (ohne Fremd-Bibliothek)
   ---------------------------------------------------------------------
   Schreibt ZIP-Dateien OHNE Komprimierung ("stored"). Das genügt, weil
   die Bilder (WebP) schon komprimiert sind, und macht den Code klein
   und nachvollziehbar. Jedes Entpack-Programm kann solche ZIPs öffnen.

   NICHT ANFASSEN OHNE GRUND: Die Byte-Positionen folgen exakt dem
   ZIP-Format. Nach jeder Änderung test.html laufen lassen.
   ===================================================================== */
(function () {
  'use strict';

  var crcTabelle = null;

  /**
   * Baut einmalig die Tabelle für die CRC32-Prüfsumme.
   * @returns {Uint32Array}
   */
  function holeCrcTabelle() {
    if (crcTabelle) {
      return crcTabelle;
    }
    crcTabelle = new Uint32Array(256);
    for (var n = 0; n < 256; n += 1) {
      var c = n;
      for (var k = 0; k < 8; k += 1) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }
      crcTabelle[n] = c >>> 0;
    }
    return crcTabelle;
  }

  /**
   * Berechnet die CRC32-Prüfsumme (im ZIP-Format vorgeschrieben).
   * @param {Uint8Array} bytes
   * @returns {number} vorzeichenlose 32-Bit-Zahl
   */
  SM.zip.crc32 = function (bytes) {
    var tabelle = holeCrcTabelle();
    var crc = 0xffffffff;
    for (var i = 0; i < bytes.length; i += 1) {
      crc = tabelle[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  };

  /**
   * Erzeugt eine ZIP-Datei.
   * @param {Array<{pfad: string, bytes: Uint8Array}>} dateien
   *        pfad mit "/" als Trenner, z. B. "website/css/stil.css"
   * @returns {Uint8Array} Inhalt der ZIP-Datei
   */
  SM.zip.erzeuge = function (dateien) {
    var eintraege = dateien.map(function (datei) {
      return {
        name: SM.helfer.textZuBytes(datei.pfad),
        bytes: datei.bytes,
        crc: SM.zip.crc32(datei.bytes),
        position: 0
      };
    });

    // Gesamtgröße berechnen: lokale Köpfe + Daten + Verzeichnis + Ende
    var groesse = 22;
    eintraege.forEach(function (e) {
      groesse += 30 + e.name.length + e.bytes.length; // lokaler Kopf + Daten
      groesse += 46 + e.name.length;                  // Eintrag im Verzeichnis
    });

    var puffer = new Uint8Array(groesse);
    var sicht = new DataView(puffer.buffer);
    var pos = 0;

    // Datum und Uhrzeit im alten DOS-Format
    var jetzt = new Date();
    var dosZeit = (jetzt.getHours() << 11) | (jetzt.getMinutes() << 5) | (jetzt.getSeconds() >> 1);
    var dosDatum = ((jetzt.getFullYear() - 1980) << 9) | ((jetzt.getMonth() + 1) << 5) | jetzt.getDate();

    // 1) Lokale Dateiköpfe und Daten
    eintraege.forEach(function (e) {
      e.position = pos;
      sicht.setUint32(pos, 0x04034b50, true);       // Kennung "lokaler Kopf"
      sicht.setUint16(pos + 4, 20, true);           // benötigte Version
      sicht.setUint16(pos + 6, 0x0800, true);       // Namen sind UTF-8
      sicht.setUint16(pos + 8, 0, true);            // Methode 0 = unkomprimiert
      sicht.setUint16(pos + 10, dosZeit, true);
      sicht.setUint16(pos + 12, dosDatum, true);
      sicht.setUint32(pos + 14, e.crc, true);
      sicht.setUint32(pos + 18, e.bytes.length, true);
      sicht.setUint32(pos + 22, e.bytes.length, true);
      sicht.setUint16(pos + 26, e.name.length, true);
      sicht.setUint16(pos + 28, 0, true);
      puffer.set(e.name, pos + 30);
      puffer.set(e.bytes, pos + 30 + e.name.length);
      pos += 30 + e.name.length + e.bytes.length;
    });

    // 2) Zentrales Verzeichnis
    var verzeichnisStart = pos;
    eintraege.forEach(function (e) {
      sicht.setUint32(pos, 0x02014b50, true);       // Kennung "Verzeichnis-Eintrag"
      sicht.setUint16(pos + 4, 20, true);
      sicht.setUint16(pos + 6, 20, true);
      sicht.setUint16(pos + 8, 0x0800, true);
      sicht.setUint16(pos + 10, 0, true);
      sicht.setUint16(pos + 12, dosZeit, true);
      sicht.setUint16(pos + 14, dosDatum, true);
      sicht.setUint32(pos + 16, e.crc, true);
      sicht.setUint32(pos + 20, e.bytes.length, true);
      sicht.setUint32(pos + 24, e.bytes.length, true);
      sicht.setUint16(pos + 28, e.name.length, true);
      // Bytes 30–41 bleiben 0 (keine Zusatzfelder, kein Kommentar)
      sicht.setUint32(pos + 42, e.position, true);  // wo der lokale Kopf steht
      puffer.set(e.name, pos + 46);
      pos += 46 + e.name.length;
    });

    // 3) Ende-Markierung
    sicht.setUint32(pos, 0x06054b50, true);
    sicht.setUint16(pos + 8, eintraege.length, true);
    sicht.setUint16(pos + 10, eintraege.length, true);
    sicht.setUint32(pos + 12, pos - verzeichnisStart, true);
    sicht.setUint32(pos + 16, verzeichnisStart, true);

    return puffer;
  };

  /**
   * Liest eine mit erzeuge() geschriebene ZIP-Datei wieder ein.
   * Wird für den Selbsttest gebraucht (kein allgemeiner ZIP-Leser!).
   * @param {Uint8Array} puffer
   * @returns {Array<{pfad: string, bytes: Uint8Array}>}
   */
  SM.zip.lese = function (puffer) {
    var sicht = new DataView(puffer.buffer, puffer.byteOffset, puffer.byteLength);
    var ende = puffer.length - 22;
    if (ende < 0 || sicht.getUint32(ende, true) !== 0x06054b50) {
      throw new Error('Keine gültige ZIP-Datei (Ende-Markierung fehlt).');
    }

    var anzahl = sicht.getUint16(ende + 10, true);
    var pos = sicht.getUint32(ende + 16, true);
    var dekoder = new TextDecoder();
    var dateien = [];

    for (var i = 0; i < anzahl; i += 1) {
      var laenge = sicht.getUint32(pos + 24, true);
      var namenLaenge = sicht.getUint16(pos + 28, true);
      var lokal = sicht.getUint32(pos + 42, true);
      var pfad = dekoder.decode(puffer.subarray(pos + 46, pos + 46 + namenLaenge));
      var datenStart = lokal + 30 + namenLaenge;
      dateien.push({ pfad: pfad, bytes: puffer.subarray(datenStart, datenStart + laenge) });
      pos += 46 + namenLaenge;
    }
    return dateien;
  };
})();
