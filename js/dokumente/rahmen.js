/* =====================================================================
   rahmen.js – gemeinsamer Rahmen aller druckbaren Dokumente
   ---------------------------------------------------------------------
   Jedes Dokument (Fragebogen, Strategie, Freigabe, Bericht, Angebot …)
   ist eine eigenständige HTML-Seite als Text. Sie wird in einem neuen
   Tab geöffnet und dort über "Drucken → Als PDF speichern" gesichert.
   Die Seite enthält ALLES selbst (Stil, Bilder als Data-URL) und lädt
   nichts aus dem Internet.

   NEUES DOKUMENT:
     1. Datei js/dokumente/<name>.js anlegen, die eine Funktion
        SM.dokumente.<name>(…) mit HTML-Text als Rückgabe hat und am Ende
        SM.dokumente.seite(titel, inhalt, einstellungen) aufruft
     2. in js/ladeliste.js unter "dokumente" eintragen
     3. in der passenden Ansicht einen Button mit
        SM.ui.app.oeffneDokument(html, 'dateiname.html') anlegen
   Der API-Key darf NIE in ein Dokument gelangen (Test "Dokumente").
   ===================================================================== */
(function () {
  'use strict';

  /* Stil aller Dokumente. Klassen beginnen mit "dok-". */
  SM.dokumente.CSS = [
    '*{box-sizing:border-box}',
    'body{margin:0;background:#eceef2;color:#1b2130;font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;font-size:11pt;line-height:1.5}',
    '.dok-leiste{position:sticky;top:0;background:#171c2b;color:#fff;padding:10px 16px;display:flex;gap:12px;align-items:center;z-index:5}',
    '.dok-leiste button{font:inherit;font-weight:700;border:0;border-radius:6px;padding:8px 16px;background:#fff;color:#171c2b;cursor:pointer}',
    '.dok-leiste span{font-size:10pt;color:#c5cbd8}',
    '.dok-blatt{background:#fff;max-width:210mm;margin:16px auto;padding:16mm 16mm 14mm;box-shadow:0 2px 14px rgba(0,0,0,.12)}',
    '.dok-kopf{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;border-bottom:2px solid var(--dok-farbe,#2f4b7c);padding-bottom:10px;margin-bottom:18px}',
    '.dok-kopf img{max-height:18mm;max-width:45mm}',
    '.dok-kopf-text{font-size:9.5pt;color:#4a5263;text-align:right}',
    '.dok-kopf-text strong{display:block;font-size:11pt;color:#1b2130}',
    'h1{font-size:20pt;line-height:1.2;margin:0 0 4px}',
    'h2{font-size:13pt;margin:20px 0 6px;color:var(--dok-farbe,#2f4b7c);break-after:avoid}',
    'h3{font-size:11pt;margin:14px 0 4px;break-after:avoid}',
    'p{margin:0 0 8px}',
    '.dok-unter{color:#4a5263;margin:0 0 14px}',
    'table{width:100%;border-collapse:collapse;margin:6px 0 12px}',
    'th,td{text-align:left;padding:6px 8px;border-bottom:1px solid #d9dde5;vertical-align:top}',
    'th{font-size:9.5pt;color:#4a5263}',
    '.dok-rechts{text-align:right}',
    '.dok-kasten{border:1px solid #d9dde5;border-radius:6px;padding:10px 12px;margin:8px 0;break-inside:avoid}',
    '.dok-hinweis{background:#fff7e0;border:1px solid #e3c768;border-radius:6px;padding:8px 12px;font-size:9.5pt;margin:10px 0;break-inside:avoid}',
    '.dok-linie{border-bottom:1px solid #9aa2b1;height:9mm}',
    '.dok-frage{break-inside:avoid;margin-bottom:12px}',
    '.dok-frage small{color:#4a5263}',
    '.dok-antwort{white-space:pre-wrap;border-left:3px solid var(--dok-farbe,#2f4b7c);padding:2px 0 2px 10px;margin-top:4px}',
    '.dok-karten{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:8px 0 14px}',
    '.dok-karte{border:1px solid #d9dde5;border-radius:6px;padding:10px;break-inside:avoid}',
    '.dok-karte b{display:block;font-size:17pt;line-height:1.2}',
    '.dok-karte span{font-size:9pt;color:#4a5263}',
    '.dok-plus{color:#136c3a}.dok-minus{color:#a3271f}',
    '.dok-balken{height:8px;border-radius:4px;background:var(--dok-farbe,#2f4b7c)}',
    '.dok-post{display:grid;grid-template-columns:52mm 1fr;gap:12px;border:1px solid #d9dde5;border-radius:6px;padding:10px;margin:10px 0;break-inside:avoid}',
    '.dok-post img{width:100%;border:1px solid #d9dde5;border-radius:4px;display:block;margin-bottom:4px}',
    '.dok-caption{white-space:pre-wrap;font-size:10pt}',
    '.dok-marke{display:inline-block;font-size:8.5pt;font-weight:700;border:1px solid #9aa2b1;border-radius:10px;padding:1px 8px;margin:0 4px 4px 0}',
    '.dok-wahl{display:flex;gap:18px;margin-top:8px;font-size:10pt}',
    '.dok-box{display:inline-block;width:4mm;height:4mm;border:1.5px solid #1b2130;vertical-align:-0.6mm;margin-right:5px}',
    '.dok-unterschrift{display:grid;grid-template-columns:1fr 1fr;gap:14mm;margin-top:16mm;break-inside:avoid}',
    '.dok-unterschrift div{border-top:1px solid #1b2130;padding-top:4px;font-size:9pt;color:#4a5263}',
    '.dok-fuss{margin-top:18px;padding-top:8px;border-top:1px solid #d9dde5;font-size:9pt;color:#4a5263}',
    '.dok-pakete{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}',
    '.dok-paket{border:1px solid #d9dde5;border-radius:6px;padding:10px;break-inside:avoid}',
    '.dok-paket.dok-gewaehlt{border:2px solid var(--dok-farbe,#2f4b7c)}',
    '.dok-paket b{font-size:12pt}.dok-paket ul{margin:6px 0 0;padding-left:18px;font-size:9.5pt}',
    '.dok-preis{font-size:15pt;font-weight:700;margin:4px 0}',
    'ul{margin:4px 0 10px;padding-left:20px}',
    '@page{size:A4;margin:12mm}',
    '@media print{body{background:#fff}.dok-leiste{display:none}.dok-blatt{box-shadow:none;margin:0;padding:0;max-width:none}}'
  ].join('\n');

  /**
   * Mein Absender-Block für den Kopf eines Dokuments.
   * @param {Object} einstellungen
   * @returns {string} HTML
   */
  SM.dokumente.absender = function (einstellungen) {
    var esc = SM.helfer.escapeHtml;
    var meine = einstellungen.meineDaten;
    var zeilen = [
      [meine.strasse, [meine.plz, meine.ort].filter(Boolean).join(' ')].filter(Boolean).join(', '),
      [meine.telefon, meine.email].filter(Boolean).join(' · '),
      meine.website
    ].filter(Boolean);
    return '<div class="dok-kopf-text"><strong>' + esc(meine.firma || meine.name || 'Mein Name (Einstellungen → Meine Daten)') + '</strong>' +
      (meine.firma && meine.name ? esc(meine.name) + '<br>' : '') +
      zeilen.map(esc).join('<br>') + '</div>';
  };

  /**
   * Leere Schreiblinien (für Ausdrucke zum Ausfüllen mit der Hand).
   * @param {number} anzahl
   * @returns {string} HTML
   */
  SM.dokumente.linien = function (anzahl) {
    var html = '';
    for (var i = 0; i < anzahl; i += 1) {
      html += '<div class="dok-linie"></div>';
    }
    return html;
  };

  /**
   * Baut die komplette HTML-Seite eines Dokuments.
   * @param {string} titel Titel im Browser-Tab und Vorschlag für den PDF-Namen
   * @param {string} inhalt HTML des Dokuments (ohne Kopf)
   * @param {Object} einstellungen für Absender und Logo
   * @param {Object} [optionen] {farbe: Akzentfarbe (Hex), logo: Data-URL statt meinem Logo, ohneAbsender: true}
   * @returns {string} vollständiges HTML-Dokument
   */
  SM.dokumente.seite = function (titel, inhalt, einstellungen, optionen) {
    var esc = SM.helfer.escapeHtml;
    var opt = optionen || {};
    var farbe = SM.farben.istGueltig(opt.farbe) ? opt.farbe : '#2f4b7c';
    // opt.logo: eigener Wert (auch '' = kein Logo); ohne Angabe mein Logo
    var logo = opt.logo !== undefined ? opt.logo : einstellungen.meineDaten.logo;
    var kopf = '<div class="dok-kopf"><div>' +
      (logo ? '<img src="' + esc(logo) + '" alt="Logo">' : '') + '</div>' +
      (opt.ohneAbsender ? '' : SM.dokumente.absender(einstellungen)) + '</div>';

    return '<!DOCTYPE html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n' +
      '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
      '<title>' + esc(titel) + '</title>\n<style>\n:root{--dok-farbe:' + farbe + '}\n' + SM.dokumente.CSS + '\n</style>\n</head>\n<body>\n' +
      '<div class="dok-leiste"><button type="button" onclick="window.print()">Drucken / Als PDF speichern</button>' +
      '<span>Im Druckdialog als Ziel „Als PDF speichern" wählen. Diese Leiste wird nicht mitgedruckt.</span></div>\n' +
      '<div class="dok-blatt">\n' + kopf + '\n' + inhalt + '\n</div>\n</body>\n</html>\n';
  };
})();
