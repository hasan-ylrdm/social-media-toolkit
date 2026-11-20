/* =====================================================================
   namespace.js – das eine globale Objekt "SM" (Social-Media-Toolkit)
   ---------------------------------------------------------------------
   Alle anderen Dateien hängen ihre Funktionen an dieses Objekt.
   Es gibt bewusst KEINE weiteren globalen Variablen.
   Diese Datei muss als ERSTE geladen werden (siehe js/ladeliste.js).
   ===================================================================== */

var SM = {
  /* Version des Werkzeugs (wird unten in der Seitenleiste angezeigt).
     Bei jeder Änderung erhöhen und in CHANGELOG.md eintragen. */
  VERSION: '1.0.1',

  /* Version des Kundendatei-Formats. NUR erhöhen, wenn sich das
     Datenmodell so ändert, dass alte Dateien umgebaut werden müssen.
     Dann in js/kern/migration.js einen Schritt ergänzen. */
  FORMAT_VERSION: 1,

  /* Kern (js/kern): reine Logik ohne Oberfläche */
  helfer: {},
  farben: {},
  datum: {},
  platzhalter: {},
  datenmodell: {},
  migration: {},
  zustand: {},
  speicher: {},
  kundendatei: {},
  baukastenImport: {},
  zip: {},
  bilder: {},
  kalenderDaten: {},
  strategie: {},
  planGenerator: {},
  kennzahlen: {},
  geschaeft: {},
  ki: {},

  /* Konfiguration (js/konfig): erweiterbare Inhalte */
  konfig: {},

  /* Grafik-Vorlagen auf Canvas (js/grafik) */
  grafik: {},

  /* Druckbare Dokumente (js/dokumente) */
  dokumente: {},

  /* Oberfläche (js/ui) */
  ui: {},

  /* Selbsttest (tests/) */
  test: {}
};
