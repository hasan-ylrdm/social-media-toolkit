/* =====================================================================
   helfer.js – kleine allgemeine Hilfsfunktionen
   Keine Abhängigkeit zur Oberfläche (läuft auch im Node-Test).
   ===================================================================== */
(function () {
  'use strict';

  var idZaehler = 0;

  /**
   * Macht Text sicher für die Ausgabe in HTML (verhindert kaputtes HTML).
   * @param {*} text beliebiger Wert
   * @returns {string} Text mit ersetzten Sonderzeichen
   */
  SM.helfer.escapeHtml = function (text) {
    return String(text === null || text === undefined ? '' : text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  /**
   * Erzeugt eine eindeutige ID, z. B. "bild-m3k2x1a9".
   * @param {string} praefix Wort vor der ID (z. B. "bild")
   * @returns {string}
   */
  SM.helfer.neueId = function (praefix) {
    idZaehler += 1;
    var zufall = Math.random().toString(36).slice(2, 6);
    return praefix + '-' + Date.now().toString(36) + idZaehler.toString(36) + zufall;
  };

  /**
   * Tiefe Kopie eines Daten-Objekts (nur JSON-taugliche Daten).
   * @param {*} wert
   * @returns {*} unabhängige Kopie
   */
  SM.helfer.kopiere = function (wert) {
    return JSON.parse(JSON.stringify(wert));
  };

  /**
   * Verzögert Aufrufe: fn läuft erst, wenn "ms" lang kein neuer Aufruf kam.
   * @param {Function} fn
   * @param {number} ms Wartezeit in Millisekunden
   * @returns {Function} entprellte Funktion
   */
  SM.helfer.entprelle = function (fn, ms) {
    var timer = null;
    return function () {
      var argumente = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(null, argumente);
      }, ms);
    };
  };

  /**
   * Macht aus Text einen datei- und URL-tauglichen Namen.
   * Beispiele: "Über uns & Team" → "ueber-uns-team", "Café Muster" → "cafe-muster"
   * @param {string} text
   * @returns {string}
   */
  SM.helfer.slug = function (text) {
    var ergebnis = String(text || '')
      .toLowerCase()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      // Akzente entfernen: "é" wird in "e" + Akzent-Zeichen zerlegt, das Akzent-Zeichen fliegt raus
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return ergebnis || 'datei';
  };

  /**
   * Prüft, ob ein Wert leer ist (leer, nur Leerzeichen, null, undefined).
   * @param {*} wert
   * @returns {boolean}
   */
  SM.helfer.istLeer = function (wert) {
    return wert === null || wert === undefined || String(wert).trim() === '';
  };

  /**
   * Wandelt mehrzeiligen Text in HTML-Absätze um (Text wird escaped).
   * Leerzeile = neuer Absatz, einfacher Umbruch = <br>.
   * @param {string} text
   * @returns {string} HTML
   */
  SM.helfer.absaetze = function (text) {
    var sauber = String(text || '').replace(/\r/g, '').trim();
    if (sauber === '') {
      return '';
    }
    return sauber
      .split(/\n\s*\n/)
      .map(function (absatz) {
        return '<p>' + SM.helfer.escapeHtml(absatz.trim()).replace(/\n/g, '<br>') + '</p>';
      })
      .join('');
  };

  /**
   * Ein Schritt beim Durchlaufen eines Pfades. In Listen (Arrays) darf der
   * Pfadteil eine Zahl (Index) ODER die "id" eines Eintrags sein.
   * @returns {string|number} Schlüssel im Behälter (bei Listen: Index, -1 = nicht gefunden)
   */
  function schluesselFuer(behaelter, teil) {
    if (!Array.isArray(behaelter)) {
      return teil;
    }
    if (/^\d+$/.test(teil)) {
      return Number(teil);
    }
    for (var i = 0; i < behaelter.length; i += 1) {
      if (behaelter[i] && behaelter[i].id === teil) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Liest einen Wert über einen Punkt-Pfad, z. B. "betrieb.firmenname"
   * oder "abschnitte.abschnitt-abc.titel" (Listen-Einträge über ihre id).
   * @param {Object} objekt
   * @param {string} pfad
   * @returns {*} Wert oder undefined
   */
  SM.helfer.holePfad = function (objekt, pfad) {
    var teile = String(pfad).split('.');
    var aktuell = objekt;
    for (var i = 0; i < teile.length; i += 1) {
      if (aktuell === null || aktuell === undefined) {
        return undefined;
      }
      aktuell = aktuell[schluesselFuer(aktuell, teile[i])];
    }
    return aktuell;
  };

  /**
   * Schreibt einen Wert über einen Punkt-Pfad (Gegenstück zu holePfad).
   * Fehlende Zwischen-Objekte werden angelegt.
   * @param {Object} objekt
   * @param {string} pfad
   * @param {*} wert
   * @returns {boolean} true, wenn geschrieben wurde
   */
  SM.helfer.setzePfad = function (objekt, pfad, wert) {
    var teile = String(pfad).split('.');
    var aktuell = objekt;
    for (var i = 0; i < teile.length - 1; i += 1) {
      var schluessel = schluesselFuer(aktuell, teile[i]);
      if (schluessel === -1) {
        return false;
      }
      if (aktuell[schluessel] === null || aktuell[schluessel] === undefined) {
        aktuell[schluessel] = {};
      }
      aktuell = aktuell[schluessel];
    }
    var letzter = schluesselFuer(aktuell, teile[teile.length - 1]);
    if (letzter === -1) {
      return false;
    }
    aktuell[letzter] = wert;
    return true;
  };

  /**
   * Wandelt Text in Bytes (UTF-8) um – nötig für ZIP und Downloads.
   * @param {string} text
   * @returns {Uint8Array}
   */
  SM.helfer.textZuBytes = function (text) {
    return new TextEncoder().encode(String(text));
  };

  /**
   * Zerlegt eine Data-URL ("data:image/webp;base64,....") in Typ und Bytes.
   * @param {string} dataUrl
   * @returns {{mime: string, bytes: Uint8Array}}
   */
  SM.helfer.dataUrlZuBytes = function (dataUrl) {
    var komma = dataUrl.indexOf(',');
    var kopf = dataUrl.slice(5, komma); // ohne "data:"
    var daten = dataUrl.slice(komma + 1);
    var mime = kopf.split(';')[0] || 'application/octet-stream';

    if (kopf.indexOf(';base64') === -1) {
      // Nicht base64: Inhalt ist URL-kodierter Text (z. B. SVG)
      return { mime: mime, bytes: SM.helfer.textZuBytes(decodeURIComponent(daten)) };
    }

    var binaer = atob(daten);
    var bytes = new Uint8Array(binaer.length);
    for (var i = 0; i < binaer.length; i += 1) {
      bytes[i] = binaer.charCodeAt(i);
    }
    return { mime: mime, bytes: bytes };
  };

  /**
   * Gibt eine Dateigröße lesbar aus, z. B. "182 KB".
   * @param {number} bytes
   * @returns {string}
   */
  SM.helfer.formatBytes = function (bytes) {
    if (bytes < 1024) {
      return bytes + ' B';
    }
    if (bytes < 1024 * 1024) {
      return Math.round(bytes / 1024) + ' KB';
    }
    return (bytes / (1024 * 1024)).toFixed(1).replace('.', ',') + ' MB';
  };

  /**
   * Formatiert einen ISO-Zeitstempel als "13.11.2026, 11:44".
   * @param {string} iso
   * @returns {string}
   */
  SM.helfer.formatDatum = function (iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) {
      return '';
    }
    function zwei(n) {
      return (n < 10 ? '0' : '') + n;
    }
    return zwei(d.getDate()) + '.' + zwei(d.getMonth() + 1) + '.' + d.getFullYear() +
      ', ' + zwei(d.getHours()) + ':' + zwei(d.getMinutes());
  };

  /**
   * Startet im Browser den Download einer Datei.
   * @param {string} dateiname
   * @param {Uint8Array|string} inhalt
   * @param {string} mime z. B. "application/zip"
   */
  SM.helfer.ladeHerunter = function (dateiname, inhalt, mime) {
    var blob = new Blob([inhalt], { type: mime });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = dateiname;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 2000);
  };
})();
