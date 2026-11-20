/* =====================================================================
   ladeliste.js – DIE zentrale Liste aller Skript-Dateien
   ---------------------------------------------------------------------
   Warum gibt es diese Datei?
   Das Werkzeug läuft per Doppelklick (file://). Dort funktionieren weder
   ES-Module (import/export) noch fetch(). Deshalb werden alle Dateien als
   klassische <script>-Dateien geladen – in genau der Reihenfolge unten.

   WICHTIG: Wer eine neue .js-Datei anlegt, trägt sie NUR HIER ein.
   index.html, test.html und tests/node-pruefung.js lesen alle diese Liste.
   Reihenfolge: Eine Datei darf nur verwenden, was VOR ihr geladen wurde
   (Ausnahme: innerhalb von Funktionen, die erst später aufgerufen werden).
   ===================================================================== */

var SM_DATEIEN = {
  /* Kern: reine Logik ohne Oberfläche (läuft auch ohne Browser) */
  kern: [
    'js/kern/namespace.js',
    'js/kern/helfer.js',
    'js/kern/farben.js',
    'js/kern/datum.js',
    'js/kern/platzhalter.js',
    'js/kern/datenmodell.js',
    'js/kern/migration.js',
    'js/kern/zustand.js',
    'js/kern/speicher.js',
    'js/kern/kundendatei.js',
    'js/kern/baukasten-import.js',
    'js/kern/zip.js',
    'js/kern/bilder.js',
    'js/kern/kalender-daten.js',
    'js/kern/strategie.js',
    'js/kern/plan-generator.js',
    'js/kern/kennzahlen.js',
    'js/kern/geschaeft.js',
    'js/kern/ki.js'
  ],

  /* Konfiguration: erweiterbare Inhalte (Branchen, Texte, Hashtags, Reels …) */
  konfig: [
    'js/konfig/konstanten.js',
    'js/konfig/schriften.js',
    'js/konfig/branchen.js',
    'js/konfig/beitragsarten.js',
    'js/konfig/textbausteine-allgemein.js',
    'js/konfig/textbausteine-branchen-1.js',
    'js/konfig/textbausteine-branchen-2.js',
    'js/konfig/hashtags.js',
    'js/konfig/reels-1.js',
    'js/konfig/reels-2.js',
    'js/konfig/reels-3.js',
    'js/konfig/reels-4.js',
    'js/konfig/anlaesse.js',
    'js/konfig/kennzahlen.js',
    'js/konfig/onboarding-fragen.js',
    'js/konfig/pakete.js',
    'js/konfig/check-punkte.js',
    'js/konfig/akquise-vorlagen.js',
    'js/konfig/beispielkunde.js'
  ],

  /* Grafik: Vorlagen, die auf dem Canvas zeichnen */
  grafik: [
    'js/grafik/zeichner.js',
    'js/grafik/vorlagen-register.js',
    'js/grafik/vorlagen-1.js',
    'js/grafik/vorlagen-2.js',
    'js/grafik/vorlagen-3.js',
    'js/grafik/rendern.js'
  ],

  /* Dokumente: druckbare HTML-Seiten (Fragebogen, Freigabe, Bericht …) */
  dokumente: [
    'js/dokumente/rahmen.js',
    'js/dokumente/fragebogen.js',
    'js/dokumente/einwilligung.js',
    'js/dokumente/freigabe.js',
    'js/dokumente/bericht.js',
    'js/dokumente/angebot.js'
  ],

  /* Oberfläche (nur im Browser) */
  ui: [
    'js/ui/dom.js',
    'js/ui/formular.js',
    'js/ui/listen.js',
    'js/ui/ki-dialog.js',
    'js/ui/app.js',
    'js/ui/ansicht-dashboard.js',
    'js/ui/kunden-fotos.js',
    'js/ui/ansicht-kunden.js',
    'js/ui/ansicht-strategie.js',
    'js/ui/kalender-teile.js',
    'js/ui/ansicht-kalender.js',
    'js/ui/post-folien.js',
    'js/ui/post-text.js',
    'js/ui/post-vorschau.js',
    'js/ui/ansicht-post.js',
    'js/ui/ansicht-texte.js',
    'js/ui/ansicht-reels.js',
    'js/ui/ansicht-freigabe.js',
    'js/ui/ansicht-berichte.js',
    'js/ui/ansicht-geschaeft.js',
    'js/ui/geschaeft-check.js',
    'js/ui/geschaeft-angebot.js',
    'js/ui/ansicht-einstellungen.js'
  ],

  /* Selbsttest */
  tests: [
    'tests/test-rahmen.js',
    'tests/tests-kern.js',
    'tests/tests-inhalte.js',
    'tests/tests-dokumente.js',
    'tests/tests-browser.js'
  ]
};

/**
 * Lädt die genannten Gruppen nacheinander als <script>-Dateien.
 * @param {string[]} gruppen  z. B. ['kern', 'konfig', 'grafik', 'dokumente', 'ui']
 * @param {Function} fertig   wird aufgerufen, wenn alles geladen ist
 */
function SM_LADE(gruppen, fertig) {
  var dateien = [];
  gruppen.forEach(function (gruppe) {
    dateien = dateien.concat(SM_DATEIEN[gruppe]);
  });

  var index = 0;

  /* Lädt die nächste Datei; ruft sich nach jedem Laden selbst wieder auf. */
  function ladeNaechste() {
    if (index >= dateien.length) {
      fertig();
      return;
    }
    var skript = document.createElement('script');
    skript.src = dateien[index];
    skript.onload = function () {
      index += 1;
      ladeNaechste();
    };
    skript.onerror = function () {
      document.body.insertAdjacentHTML(
        'afterbegin',
        '<p style="background:#b00020;color:#fff;padding:12px;font-family:sans-serif">' +
          'Datei konnte nicht geladen werden: ' + dateien[index] +
          ' – steht sie richtig in js/ladeliste.js?</p>'
      );
    };
    document.head.appendChild(skript);
  }

  ladeNaechste();
}
