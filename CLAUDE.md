# CLAUDE.md – Anleitung für eine KI, die an diesem Projekt weiterarbeitet

Lies zuerst diese Datei, dann `ARCHITEKTUR.md`. Erst danach Code ändern.

## Projektziel

Ein Werkzeug („Social-Media-Betreuungs-Toolkit"), mit dem Hasan die Social-Media-Kanäle kleiner lokaler Betriebe in Österreich (Raum Salzburg/Hallein) betreut: Kunden verwalten, Strategie, Redaktionsplan, Grafiken, Texte, Reel-Ideen, Freigabe, Monatsbericht, Akquise und Angebote. Nur Hasan benutzt das Werkzeug.

Es gibt ein Schwesterprojekt, den „Website-Baukasten" (globales Objekt `WB`). Das Toolkit kann dessen Projektdateien importieren. Beide Projekte sind gleich aufgebaut, aber unabhängig; sie teilen keinen Code.

Hasan ist AI-Student im ersten Semester, hat bisher wenig JavaScript-Erfahrung und will den Code selbst verstehen können. **Einfach und verständlich ist wichtiger als kurz oder elegant.**

## Technik-Regeln (nicht verhandelbar)

1. **Läuft per Doppelklick auf `index.html`** (`file://`). Kein Server, kein npm, kein Build-Schritt, kein Framework.
2. **Keine ES-Module** (`import`/`export`) und **kein `fetch()` auf lokale Dateien**: beides funktioniert unter `file://` nicht. Konfiguration liegt deshalb in `.js`-Dateien, nicht in `.json`.
3. **Offline.** Keine CDN-Links, keine Webfonts, keine externen Skripte. Fremd-Bibliotheken nur, wenn es wirklich nicht anders geht, und dann lokal im Ordner. Bisher gibt es keine.
4. **Einzige Internet-Verbindung ist der optionale KI-Assistent** (`js/kern/ki.js`). Der API-Key steht nur in den Einstellungen im Browser und darf nie in eine Kundendatei, eine Sicherung, ein Dokument oder einen Auftrag an die KI gelangen.
5. **Alte Kundendateien müssen ladbar bleiben.** Siehe „Datenmodell ändern".
6. **Keine erfundenen Zahlen.** Berichte zeigen nur, was Hasan eingetragen hat. Nicht eingetragene Kennzahlen bleiben leer und werden nie als 0 dargestellt.

## Code-Konventionen

- **Ein globales Objekt `SM`**, sonst keine globalen Variablen (Ausnahme: `SM_DATEIEN`, `SM_LADE` in `js/ladeliste.js`).
- **Jede Datei ist eine IIFE** und beginnt mit einem Kopfkommentar, der erklärt, wofür sie da ist:
  ```js
  (function () {
    'use strict';
    // …
  })();
  ```
  Ohne IIFE stoßen gleichnamige Variablen verschiedener Dateien zusammen.
- **Sprache:** Bezeichner, Kommentare und Oberfläche auf Deutsch. Umlaute in Bezeichnern ausschreiben (`oeffnungszeiten`, `groesse`).
- **Jede neue Funktion bekommt einen deutschen Kommentar:** was sie tut, Eingaben (`@param`), Rückgabe (`@returns`). Alle öffentlichen Funktionen (`SM.…`) sind so kommentiert; einige kleine innere Hilfsfunktionen haben nur einen Einzeiler. Beim Anfassen nachziehen.
- **Stil:** `var`, `function`, keine Pfeilfunktionen im Projektcode, keine verschachtelten Ternaries, keine cleveren Einzeiler. Lieber fünf klare Zeilen als eine dichte. (Nur `tests/node-pruefung.js` nutzt modernes Node-JS.)
- **Dateien klein halten:** eine Aufgabe pro Datei, höchstens etwa 300–400 Zeilen. Wird eine Datei größer, aufteilen.
- **Neue Datei → in `js/ladeliste.js` eintragen.** Nirgends sonst. Reihenfolge beachten: Eine Datei darf beim Laden nur benutzen, was vor ihr steht.
- **Oberfläche:** Elemente mit `SM.ui.dom.el()` bauen, kein `innerHTML` mit Benutzerdaten.
- **Dokumente (HTML als Text):** jeden Text aus den Daten über `SM.helfer.escapeHtml()` oder `SM.helfer.absaetze()` ausgeben, nie roh.
- **Daten ändern:** direkt in `SM.zustand.kunde` bzw. `SM.zustand.einstellungen` schreiben und danach `SM.zustand.melde(quelle)` aufrufen. Sonst wird weder gespeichert noch neu gezeichnet. Welche `quelle` wann passt, steht oben in `js/kern/zustand.js`.
- **Eingabefelder:** über `SM.ui.form.feld({pfad, label, art})` (siehe Kopf von `js/ui/formular.js`). Sie speichern von selbst.
- **CSS-Klassen:** alle mit `sm-`. Farben des Werkzeugs als CSS-Variablen in `css/toolkit.css`.
- **Grafik-Vorlagen:** nur relative Maße und nur Farben aus `z.farben` (Regeln in `js/grafik/vorlagen-register.js`).
- **Texte für Kunden** (Captions, Berichte, Check, Angebot): ehrlich. Keine erfundenen Zahlen, Statistiken, Superlative oder Garantien. `tests/tests-dokumente.js` prüft das bei Strategie und Social-Media-Check.

## Arbeitsweise

1. **Kleine Änderungen.** Eine Sache pro Schritt. Nichts „nebenbei" umbauen oder umformatieren.
2. **Erst lesen, dann ändern.** Vor einer Änderung die betroffene Datei ganz lesen und in `ARCHITEKTUR.md` nachsehen, wer sie benutzt.
3. **Ganze Dateien zurückgeben.** Hasan ersetzt Dateien komplett. Keine Ausschnitte mit „… Rest wie bisher".
4. **Bei jeder Änderung sagen:** welche Dateien geändert oder neu sind und was Hasan danach prüfen soll.
5. **Testen** (siehe unten) und für neue Funktionen einen Test ergänzen.
6. **Version erhöhen** (`SM.VERSION` in `js/kern/namespace.js`) und `CHANGELOG.md` ergänzen. Ändert sich Aufbau oder Datenmodell, auch `ARCHITEKTUR.md` anpassen.
7. **Bei Unklarheit nachfragen** statt raten. Annahmen offen nennen.

## Nicht anfassen ohne Grund

| Bereich | Warum |
|---|---|
| `js/kern/zip.js` | Byte-genaues ZIP-Format. Ein falscher Offset = kaputte ZIP-Dateien. |
| `js/kern/migration.js` – vorhandene Schritte | Alte Schritte nie ändern oder löschen, nur neue anhängen. Sonst werden alte Kundendateien unlesbar. |
| `js/kern/helfer.js` – `holePfad`/`setzePfad` | Alle Formulare und Listen hängen daran (Listen-Einträge werden über ihre `id` im Pfad gefunden). |
| `js/kern/speicher.js` – Datenbank-Name, Lager, `DB_VERSION` | Änderung ohne `onupgradeneeded`-Logik macht gespeicherte Kunden unerreichbar. |
| `js/kern/kundendatei.js` – die `art`-Kennungen | Daran werden Kundendatei, Sicherung und Baukasten-Projekt unterschieden. |
| `js/ladeliste.js` – Reihenfolge | Falsche Reihenfolge = „SM.xyz is undefined" beim Start. |
| `js/grafik/zeichner.js` – `block()` und `schreibe()` | Alle 17 Vorlagen hängen am Umbruch und an den Abständen. Jede Änderung in allen Vorlagen und Formaten ansehen. |
| `js/kern/datum.js` – Datumsformat `"JJJJ-MM-TT"` als Text | Bewusst ohne `Date`-Objekte im Datenmodell (keine Zeitzonen-Fehler). |
| Feldnamen im Datenmodell | Umbenennen braucht einen Migrations-Schritt. Neue Felder sind unkritisch. |
| Feldnamen, die aus dem Website-Baukasten kommen (`stamm`, `oeffnungszeiten`, `leistungen`, `bilder`, `marke.farben`) | Sind absichtlich gleich benannt wie dort. Bei Änderung `js/kern/baukasten-import.js` mitziehen. |
| Branchen-ids | Sind dieselben wie im Website-Baukasten. Nicht umbenennen. |
| `js/dokumente/einwilligung.js` – Inhalt | Rechtstext nur ändern, wenn Hasan es ausdrücklich will, und nie als „rechtssicher" bezeichnen. |

## Datenmodell ändern

- **Neues Feld:** in `leererKunde()` (oder `leererPost()`, `leereFolie()`, `leererBericht()`, `standardEinstellungen()`) in `js/kern/datenmodell.js` mit Standardwert eintragen. Alte Kunden bekommen es beim Laden automatisch. `FORMAT_VERSION` bleibt.
- **Umbau** (Feld umbenannt, verschoben, Typ geändert): `SM.FORMAT_VERSION` um 1 erhöhen, in `js/kern/migration.js` einen Schritt `{von, nach, beschreibung, ausfuehren}` anhängen, in `tests/tests-kern.js` einen Test mit einem alten Kunden ergänzen.
- Beispiel mit allen Schritten: `WEITERENTWICKLUNG.md`, Abschnitt 4.

## Typische Fallstricke

1. **`file://`:** kein `fetch('datei.json')`, kein `<script type="module">`, kein `import`.
2. **Cursor-Sprung:** Bei `quelle === 'eingabe'` wird die Ansicht absichtlich nicht neu gezeichnet. Wer nach einer Eingabe neu zeichnen muss (z. B. andere Vorlage gewählt), gibt dem Feld `{quelle: 'struktur'}` mit.
3. **Aufgeklappte Gruppen:** Ansichten werden komplett neu gezeichnet. `SM.ui.form.gruppe(schluessel, …)` merkt sich über den Schlüssel, was offen war. Jeder Schlüssel muss eindeutig sein.
4. **Platzhalter** werden erst beim Anzeigen/Zeichnen ersetzt. In den Daten steht `{Firmenname}`. Unbekannte oder leere Platzhalter bleiben absichtlich sichtbar stehen.
5. **Canvas und Bilder sind asynchron.** `SM.grafik.zeichneFolie()` und alles, was Fotos lädt, liefert ein Promise. Erst nach dessen Ende ist der Canvas fertig.
6. **PNG-Export braucht die volle Größe.** Die Vorschau ist nur per CSS verkleinert; gezeichnet wird immer in echter Pixelgröße des Formats.
7. **Bilder sind Data-URLs im Kunden.** Das macht Kundendateien groß, hält aber Speichern und Sicherung einfach. Nicht auf Blob-URLs umstellen (die überleben keinen Neustart).
8. **Datum als Text.** `new Date('2026-11-18')` ist UTC und kann um einen Tag verrutschen. Immer `SM.datum.zuDate()` und `SM.datum.iso()` benutzen.
9. **Wochentage:** Montag = 0, Sonntag = 6 (nicht wie bei `Date.getDay()`).
10. **Dokumente öffnen sich in einem neuen Tab.** Popup-Blocker: `SM.ui.app.oeffneDokument()` lädt die Datei dann stattdessen herunter.
11. **IndexedDB unter `file://`** gilt pro Browser. In einem anderen Browser oder Profil sind die Kunden nicht da. Dafür gibt es die Gesamt-Sicherung.
12. **Safari** erzeugt kein WebP. `bilder.js` fällt auf JPEG zurück.
13. **Neue Branche = vier Dateien** (Branche, Texte, Hashtags, Reels). `test.html` sagt, was fehlt.
14. **Der KI-Aufruf an Anthropic** braucht den Header `anthropic-dangerous-direct-browser-access`, sonst blockiert der Browser ihn. Nicht entfernen.

## Änderungen testen

1. **`test.html` im Browser öffnen** (Doppelklick). Alles muss grün sein. Das prüft Speichern, Laden, Kundendatei, Sicherung, Baukasten-Import, Migration, Platzhalter, Kalender, Plan-Generator, alle Konfig-Inhalte, alle Grafik-Vorlagen in allen Formaten, PNG-Größen, Karussell-ZIP, alle Dokumente und dass der KI-Key nirgends landet.
2. Mit Node (z. B. in Claude Code): `node tests/node-pruefung.js`. Browser-Tests werden dort übersprungen. Mit `--beispiel` wird zusätzlich `beispiele/cafe-muster.kunde.json` neu erzeugt.
3. **`index.html` öffnen** und die geänderte Stelle mit dem Beispielkunden von Hand ausprobieren (Einstellungen → Beispielkunde neu anlegen). Browser-Konsole (F12) auf Fehler prüfen.
4. Bei Änderungen an Grafik-Vorlagen: im Post-Editor alle Formate und alle drei Farbschemata ansehen, mit langem und mit leerem Text, mit und ohne Foto, dann ein PNG exportieren und öffnen.
5. Bei Änderungen an Dokumenten: Dokument öffnen und die Druckvorschau (`Strg + P`) ansehen.
6. Bei Änderungen am Datenmodell: `beispiele/cafe-muster.kunde.json` öffnen (Kunden → Kundendatei öffnen) und `beispiele/salon-musterfrau.projekt.json` importieren.

Neue Tests kommen in `tests/tests-kern.js`, `tests-inhalte.js`, `tests-dokumente.js` oder (wenn ein Browser nötig ist) `tests-browser.js`. Das Muster steht in `tests/test-rahmen.js`.

## Wo finde ich was?

| Aufgabe | Datei |
|---|---|
| Neue Branche, Texte, Hashtags, Reels, Anlässe, Kennzahlen | `js/konfig/` |
| Neue Grafik-Vorlage | `js/grafik/vorlagen-3.js` (Muster: `vorlagen-register.js`) |
| Zeichen-Werkzeuge für Vorlagen | `js/grafik/zeichner.js` |
| Formate, Kanäle, Status, Zeichen-Grenzen | `js/konfig/konstanten.js` |
| Neues Feld | `js/kern/datenmodell.js` + passende `js/ui/ansicht-*.js` |
| Monatsplan-Logik | `js/kern/plan-generator.js` |
| Strategie-Vorschlag | `js/kern/strategie.js` |
| Feiertage, Ferien | `js/kern/kalender-daten.js`, `js/konfig/anlaesse.js` |
| Druckbare Dokumente | `js/dokumente/` |
| Import aus dem Website-Baukasten | `js/kern/baukasten-import.js` |
| KI-Aufgaben und Anbieter | `js/kern/ki.js`, `js/ui/ki-dialog.js` |
| Navigation, Speichern | `js/ui/app.js` |

Schritt-für-Schritt-Anleitungen mit Beispielen: `WEITERENTWICKLUNG.md`.
