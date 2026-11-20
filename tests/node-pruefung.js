/* =====================================================================
   node-pruefung.js – dieselben Tests wie test.html, aber im Terminal
   ---------------------------------------------------------------------
   OPTIONAL. Das Werkzeug selbst braucht kein Node. Dieses Skript ist für
   Claude Code oder für alle gedacht, die Node installiert haben:

     node tests/node-pruefung.js             alle Tests ausführen
     node tests/node-pruefung.js --beispiel  zusätzlich die Beispiel-
                                             Kundendatei neu erzeugen

   Es lädt Kern, Konfiguration, Grafik, Dokumente und Tests (NICHT die
   Oberfläche) in der Reihenfolge aus js/ladeliste.js. Tests, die einen
   Browser brauchen (IndexedDB, Canvas), werden übersprungen – dafür
   test.html im Browser öffnen.
   Zusätzlich wird hier die echte Baukasten-Beispieldatei
   (beispiele/salon-musterfrau.projekt.json) für den Import-Test geladen.
   Ende-Code 0 = alles bestanden, 1 = mindestens ein Fehler.
   ===================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const wurzel = path.join(__dirname, '..');

// Eine abgeschlossene Umgebung, die sich wie ein Browser ohne Fenster verhält
const umgebung = vm.createContext({
  console, TextEncoder, TextDecoder, atob, btoa, setTimeout, clearTimeout, URL,
  encodeURIComponent, decodeURIComponent,
  // Text der echten Baukasten-Datei für den Import-Test (im Browser nicht verfügbar)
  SM_BAUKASTEN_BEISPIEL: fs.readFileSync(path.join(wurzel, 'beispiele', 'salon-musterfrau.projekt.json'), 'utf8')
});

/** Lädt eine Skript-Datei des Projekts in die Umgebung. */
function lade(datei) {
  vm.runInContext(fs.readFileSync(path.join(wurzel, datei), 'utf8'), umgebung, { filename: datei });
}

lade('js/ladeliste.js');
['kern', 'konfig', 'grafik', 'dokumente', 'tests'].forEach((gruppe) => {
  umgebung.SM_DATEIEN[gruppe].forEach(lade);
});

const SM = umgebung.SM;

if (process.argv.includes('--beispiel')) {
  const ziel = path.join(wurzel, 'beispiele', 'cafe-muster.kunde.json');
  fs.writeFileSync(ziel, SM.kundendatei.zuText(SM.konfig.beispielKunde()));
  console.log('Beispiel-Kundendatei geschrieben: ' + ziel);
}

console.log('Social-Media-Toolkit ' + SM.VERSION + ' – Selbsttest (Datenformat ' + SM.FORMAT_VERSION + ')\n');

SM.test.laufe((ergebnis) => {
  const zeichen = { ok: '  ✓', fehler: '  ✗', uebersprungen: '  –' }[ergebnis.status];
  console.log(zeichen + ' ' + ergebnis.gruppe + ': ' + ergebnis.name + (ergebnis.meldung ? '\n      → ' + ergebnis.meldung : ''));
}).then((summe) => {
  console.log('\n' + summe.ok + ' bestanden, ' + summe.fehler + ' fehlgeschlagen, ' +
    summe.uebersprungen + ' übersprungen (nur im Browser: test.html öffnen)');
  process.exit(summe.fehler > 0 ? 1 : 0);
});
