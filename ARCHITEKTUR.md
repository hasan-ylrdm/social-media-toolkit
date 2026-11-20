# Architektur

Stand: Version 1.0.1, Datenformat 1

## 1. Grundidee in fünf Sätzen

1. Das Werkzeug ist eine einzige HTML-Seite (`index.html`), die per Doppelklick läuft. Kein Server, kein Build, keine Fremd-Bibliothek.
2. Alles hängt an einem globalen Objekt `SM`. Jede Datei ist eine IIFE und hängt ihre Funktionen dort an.
3. Ein **Kunde** ist ein einziges großes Objekt (Stammdaten, Marke, Fotos, Strategie, Beiträge, Berichte). Dazu gibt es einmal die **Einstellungen** (meine Daten, Pakete, KI-Key, Checks, Angebote, Aufgaben).
4. Jede Änderung meldet sich über `SM.zustand.melde(quelle)`. Daraufhin wird automatisch in IndexedDB gespeichert und, wenn nötig, die Ansicht neu gezeichnet.
5. Grafiken entstehen auf einem Canvas (`js/grafik`), Dokumente als fertiges HTML zum Drucken (`js/dokumente`).

## 2. Ordner und Dateien

### Hauptordner

| Datei | Zweck |
|---|---|
| `index.html` | Das Werkzeug. Enthält nur das Grundgerüst (Seitenleiste, Ansicht) und lädt `js/ladeliste.js`. |
| `test.html` | Selbsttest. Lädt alles außer der Oberfläche und zeigt jeden Test grün oder rot. |
| `README.md` | Starten, Bedienung, Erweitern, Grenzen. |
| `ARCHITEKTUR.md` | Diese Datei. |
| `CLAUDE.md` | Regeln für eine KI, die weiterbaut. |
| `WEITERENTWICKLUNG.md` | Schritt-für-Schritt-Anleitungen, Ideen, bekannte Grenzen. |
| `CHANGELOG.md` | Was wann gebaut wurde. |
| `UEBERGABE-PROMPT.md` | Fertiger Text für die Übergabe an Claude Opus. |

### `js/ladeliste.js`

Die zentrale Liste aller Skript-Dateien in Lade-Reihenfolge, aufgeteilt in die Gruppen `kern`, `konfig`, `grafik`, `dokumente`, `ui`, `tests`. `index.html`, `test.html` und `tests/node-pruefung.js` lesen alle diese Liste. Eine neue Datei wird **nur hier** eingetragen.

### `js/kern/` – Logik ohne Oberfläche (läuft auch in Node)

| Datei | Zweck |
|---|---|
| `namespace.js` | Legt `SM` an. Enthält `SM.VERSION` und `SM.FORMAT_VERSION`. Muss als Erste geladen werden. |
| `helfer.js` | Kleine Helfer: `escapeHtml`, `slug`, `kopiere`, `neueId`, `holePfad`/`setzePfad`, `ladeHerunter`, `formatBytes`, `absaetze`. |
| `farben.js` | Farbrechnung: Hex ↔ RGB, Kontrast nach WCAG, `besteTextfarbe`, `mische`. |
| `datum.js` | Rechnen mit Kalendertagen als Text `"JJJJ-MM-TT"`: Wochentag, Monat, Ostern, n-ter Wochentag. |
| `platzhalter.js` | Ersetzt `{Firmenname}`, `{Ort}` … und liefert die Caption-Vorschläge (`captions`). |
| `datenmodell.js` | **Alle Felder**: `leererKunde`, `leererPost`, `leereFolie`, `leererBericht`, `standardEinstellungen`. |
| `migration.js` | Hält alte Kundendateien ladbar: Umbau-Schritte, fehlende Felder ergänzen, Reparaturen. |
| `zustand.js` | Aktueller Kunde und Einstellungen im Arbeitsspeicher; `melde(quelle)` informiert alle Hörer. |
| `speicher.js` | IndexedDB: Kunden und Einstellungen speichern, laden, löschen. |
| `kundendatei.js` | Kundendatei (`*.kunde.json`) und Gesamt-Sicherung lesen und schreiben; erkennt die Dateiart. |
| `baukasten-import.js` | Macht aus einem Projekt des Website-Baukastens einen Kunden oder ergänzt einen vorhandenen. |
| `zip.js` | Eigener ZIP-Schreiber (ohne Kompression) für Karussell-PNGs. |
| `bilder.js` | Fotos verkleinern, als WebP/JPEG komprimieren, zuschneiden (Canvas). |
| `kalender-daten.js` | Berechnet Feiertage, Anlässe und Salzburger Schulferien für einen Zeitraum. |
| `strategie.js` | Erzeugt aus Fragebogen, Branche und Paket einen Strategie-Vorschlag. |
| `plan-generator.js` | Erzeugt den Monatsplan: wählt Tage, verteilt die Themen-Säulen, baut Beiträge. |
| `kennzahlen.js` | Vergleicht Monatszahlen mit dem Vormonat. Erfindet nichts: leer bleibt leer. |
| `geschaeft.js` | Auswertungen für Dashboard und „Mein Geschäft": Paket und Preis je Kunde, Monatsumsatz, Aufgaben der Woche. |
| `ki.js` | Optionaler KI-Assistent: baut den Auftrag (Prompt) und schickt die Anfrage an den Anbieter. |

### `js/konfig/` – erweiterbare Inhalte (jede Datei beginnt mit einem Muster)

| Datei | Inhalt |
|---|---|
| `konstanten.js` | Status, Kanäle (mit Zeichen-Grenzen), Formate (Pixelgrößen), Töne. Dazu `SM.konfig.hole…`-Sucher. |
| `schriften.js` | Schriftpaare (nur Systemschriften). |
| `branchen.js` | 11 Branchen mit Zielgruppe, Kanal-Hinweis und Themen-Säulen. Gleiche ids wie im Website-Baukasten. |
| `beitragsarten.js` | Arten von Beiträgen: verbindet Grafik-Vorlage, Start-Texte der Grafik und Caption-Schlüssel. |
| `textbausteine-allgemein.js` | Captions für jede Branche (Auffangnetz). Erklärt alle Platzhalter. |
| `textbausteine-branchen-1.js`, `-2.js` | Captions je Branche. Das Muster steht in `textbausteine-allgemein.js`. |
| `hashtags.js` | Hashtag-Sets je Branche und je Ort, Zähler. |
| `reels-1.js` bis `reels-4.js` | Reel-Ideen je Branche (mindestens 10) und allgemeine Film-Tipps. |
| `anlaesse.js` | Feiertage und saisonale Anlässe als Regeln. |
| `kennzahlen.js` | Welche Zahlen der Monatsbericht erfasst. |
| `onboarding-fragen.js` | Fragen des Onboarding-Fragebogens. |
| `pakete.js` | Start-Vorschlag für meine drei Pakete. |
| `check-punkte.js` | Checkliste für den Social-Media-Check. |
| `akquise-vorlagen.js` | Vorlagen für E-Mail, Instagram-Nachricht und Gesprächsleitfaden. |
| `beispielkunde.js` | Der erfundene Beispielkunde „Café Muster, Hallein" mit Monatsplan und Berichten. |

### `js/grafik/` – Grafik-Vorlagen auf Canvas

| Datei | Zweck |
|---|---|
| `zeichner.js` | Werkzeugkasten `z` für Vorlagen: `fuelle`, `rechteck`, `kreis`, `foto`, `vollbild`, `abdunkeln`, `schreibe`, `pille`, `block`, `logo`, `logoEcke`, `seitenzahl`. Rechnet alles relativ zur Bildgröße. |
| `vorlagen-register.js` | `SM.grafik.registriere/hole/alle`. Enthält das Muster für neue Vorlagen. |
| `vorlagen-1.js` | Angebot, Neuigkeit, Zitat, Vorher/Nachher, Team, Öffnungszeiten. |
| `vorlagen-2.js` | Stellenanzeige, Tipp, Event, Gewinnspiel, Danke, Foto mit Text. |
| `vorlagen-3.js` | Produkt, Frage, Gruß, Titel-Folie, Liste. |
| `rendern.js` | Bringt eine Folie auf den Canvas (`zeichneFolie`), liefert PNG-Dateien (`pngDateien`) und startet den Download (`exportierePost`). |

### `js/dokumente/` – druckbare HTML-Seiten

| Datei | Zweck |
|---|---|
| `rahmen.js` | Gemeinsamer Rahmen: Seitenkopf, Druck-CSS, Absender, Schreiblinien. |
| `fragebogen.js` | Onboarding-Fragebogen und Strategie-Papier. |
| `einwilligung.js` | Vorlage: Einwilligung für Fotos und Videos (DSGVO). |
| `freigabe.js` | Freigabe-Übersicht des Monats mit „OK / Änderungswunsch". |
| `bericht.js` | Monatsbericht mit Balkendiagrammen (reines HTML/CSS). |
| `angebot.js` | Social-Media-Check (Bericht) und Angebot. |

### `js/ui/` – Oberfläche (nur im Browser)

| Datei | Zweck |
|---|---|
| `dom.js` | `el()` zum Bauen von Elementen, `knopf`, `dialog`, `meldung`, `kopiere`. |
| `formular.js` | Eingabefelder, die über einen `pfad` direkt mit den Daten verbunden sind. |
| `listen.js` | Editor für Listen (Leistungen, Pakete, Hashtag-Sets …). |
| `ki-dialog.js` | Dialogfenster des KI-Assistenten. |
| `app.js` | Start, Navigation, Kundenwechsel, automatisches Speichern, Dokumente öffnen. |
| `ansicht-dashboard.js` | Startseite: Überblick, Aufgaben, nächste Beiträge. |
| `ansicht-kunden.js`, `kunden-fotos.js` | Kundenverwaltung, Logo und Fotos. |
| `ansicht-strategie.js` | Fragebogen, Strategie, Einwilligung. |
| `ansicht-kalender.js`, `kalender-teile.js` | Monats- und Wochenansicht, Tages-Zelle, Beitrags-Chip, Drag & Drop. |
| `ansicht-post.js`, `post-folien.js`, `post-text.js`, `post-vorschau.js` | Post-Editor: Angaben, Grafik, Caption/Hashtags, Vorschau und PNG-Export. |
| `ansicht-texte.js` | Textbausteine, Hashtag-Sets, KI-Helfer. |
| `ansicht-reels.js` | Reel-Bibliothek. |
| `ansicht-freigabe.js` | Freigabe-Übersicht und Status in einem Rutsch. |
| `ansicht-berichte.js` | Kennzahlen eintragen, Bericht öffnen. |
| `ansicht-geschaeft.js`, `geschaeft-check.js`, `geschaeft-angebot.js` | Mein Geschäft: Übersicht, meine Daten, Pakete, Check, Angebote, Kontaktaufnahme. |
| `ansicht-einstellungen.js` | KI-Zugang, Gesamt-Sicherung, Beispielkunde. |

### `css/`

| Datei | Zweck |
|---|---|
| `toolkit.css` | Grundgerüst: Farben als CSS-Variablen, Seitenleiste, Kopf. |
| `toolkit-teile.css` | Wiederverwendbare Teile: Knöpfe, Felder, Gruppen, Dialog, Meldungen. |
| `toolkit-ansichten.css` | Einzelne Ansichten: Kalender, Post-Editor, Vorschau. |

Alle Klassen des Werkzeugs beginnen mit `sm-`.

### `tests/`

| Datei | Zweck |
|---|---|
| `test-rahmen.js` | Winziges Test-Gerüst: `fall`, `gleich`, `wahr`, `wirft`, `laufe`. |
| `tests-kern.js` | Helfer, Platzhalter, Datum, Kalender, Migration, Kundendatei, Baukasten-Import, ZIP, Strategie, Plan, Kennzahlen, Geschäft, KI-Auftrag. |
| `tests-inhalte.js` | Prüft die Konfiguration: jede Branche vollständig, Vorlagen, Platzhalter, Farben. |
| `tests-dokumente.js` | Jedes Dokument enthält, was es muss, und keine Versprechen. |
| `tests-browser.js` | Braucht einen Browser: IndexedDB, Bilder, Canvas, PNG-Größen, Karussell-ZIP. |
| `node-pruefung.js` | Dieselben Tests im Terminal (`node tests/node-pruefung.js`), ohne die Browser-Tests. |

### `beispiele/`

| Datei | Zweck |
|---|---|
| `cafe-muster.kunde.json` | Beispielkunde als Kundendatei (derselbe wie in `js/konfig/beispielkunde.js`). |
| `salon-musterfrau.projekt.json` | Echte Beispieldatei des Website-Baukastens, zum Testen des Imports. |

## 3. Datenfluss

```
Eingabe im Formular (js/ui/formular.js)
   │  schreibt per Pfad direkt in SM.zustand.kunde  (z. B. "stamm.firmenname")
   ▼
SM.zustand.melde(quelle)            (js/kern/zustand.js)
   │
   ├─► js/ui/app.js  beiAenderung(quelle)
   │      ├─ 'eingabe' / 'einstellungen'   → nur speichern (Ansicht bleibt, Cursor springt nicht)
   │      ├─ 'struktur' / 'einstellungen-struktur' → speichern + Ansicht neu zeichnen
   │      └─ 'laden'                       → alles neu zeichnen
   │
   └─► Speichern (leicht verzögert)  → SM.speicher.speichereKunde / speichereEinstellungen → IndexedDB
```

Die Oberfläche merkt sich nur in `SM.ui.status`, welche Ansicht, welcher Beitrag, welche Folie und welcher Monat offen sind. Das wird nicht gespeichert.

**Grafik:** `post-vorschau.js` → `SM.grafik.zeichneFolie(canvas, kunde, post, folie, nummer)` → holt die Vorlage aus dem Register, baut den Zeichner `z` (Farben aus `marke.farben` + Farbschema der Folie, Schrift aus `marke.schriftpaar`, Texte mit ersetzten Platzhaltern, geladene Fotos, Logo) → `vorlage.zeichne(z)`.

**Dokumente:** `SM.dokumente.<name>(…)` liefert ein vollständiges HTML-Dokument als Text → `SM.ui.app.oeffneDokument(html, dateiname)` öffnet es in einem neuen Tab (bei blockiertem Popup wird es heruntergeladen).

## 4. Datenmodell

Die verbindliche Quelle ist `js/kern/datenmodell.js`. Diese Übersicht muss bei jeder Änderung mitgezogen werden.

### Kunde (`SM.datenmodell.leererKunde()`)

| Feld | Typ | Bedeutung |
|---|---|---|
| `formatVersion` | Zahl | Version des Datenformats (aktuell 1). |
| `werkzeugVersion` | Text | Version des Werkzeugs beim Speichern. |
| `id` | Text | Eindeutige Kennung, z. B. `kunde-…`. |
| `erstelltAm`, `geaendertAm` | Text | ISO-Zeitstempel. |
| `stamm.firmenname`, `.slogan`, `.branche`, `.beschreibung` | Text | `branche` = id aus `branchen.js`. |
| `stamm.strasse`, `.plz`, `.ort`, `.land` | Text | Adresse. |
| `stamm.telefon`, `.email`, `.website` | Text | Kontakt. |
| `ansprechperson.name`, `.telefon`, `.email` | Text | Mein Kontakt beim Kunden. |
| `notizen` | Text | Freie Notizen (nur für mich). |
| `oeffnungszeiten.hinweis` | Text | z. B. „Termine nach Vereinbarung". |
| `oeffnungszeiten.tage[7]` | Liste | Montag zuerst: `{geschlossen, von, bis, pause, pauseVon, pauseBis}`. |
| `leistungen[]` | Liste | `{id, name, beschreibung, preis}`. |
| `marke.farben.primaer`, `.akzent`, `.hintergrund`, `.text` | Hex-Farbe | Werden von allen Grafik-Vorlagen übernommen. |
| `marke.schriftpaar` | Text | id aus `schriften.js`. |
| `marke.ton` | Text | `freundlich` \| `professionell` \| `locker`. |
| `marke.zielgruppe` | Text | Beschreibung der Zielgruppe. |
| `kanaele.instagram`, `.facebook`, `.tiktok`, `.google` | Objekt | Je `{aktiv, link}`. |
| `paket.paketId`, `.preis`, `.seit` | Text | `paketId` aus `einstellungen.pakete`; `preis` leer = Preis des Pakets. |
| `bilder[]` | Liste | `{id, name, dataUrl, breite, hoehe, bytes, alt, bereich}` mit `bereich` = `logo` \| `foto`. |
| `onboarding` | Objekt | `{frageId: Antwort}`, ids aus `onboarding-fragen.js`. |
| `strategie.erzeugtAm`, `.ziele`, `.kanalwahl`, `.hinweise` | Text | Strategie-Texte. |
| `strategie.saeulen[]` | Liste | `{id, name, beschreibung, anteil, beitragsarten[]}`; Anteile in Prozent. |
| `strategie.postsProMonat`, `.storiesProWoche`, `.reelsProMonat` | Zahl | Häufigkeit. |
| `strategie.wochentage[]` | Liste | Bevorzugte Tage, Montag = 0. |
| `events[]` | Liste | Eigene lokale Termine `{id, datum, titel}`. |
| `posts[]` | Liste | Siehe unten. |
| `hashtagSets[]` | Liste | `{id, name, tags}`. |
| `berichte[]` | Liste | Siehe unten. |

### Beitrag (`leererPost()`), Eintrag in `kunde.posts`

| Feld | Bedeutung |
|---|---|
| `id` | z. B. `post-…`. |
| `datum`, `uhrzeit` | `"JJJJ-MM-TT"`, `"HH:MM"`. |
| `kanaele[]` | `instagram` \| `facebook` \| `tiktok` \| `google`. |
| `format` | id aus `SM.konfig.formate`: `feed-quadrat`, `feed-hoch`, `story`, `reel-cover`, `google`. |
| `beitragsart` | id aus `beitragsarten.js`. |
| `saeuleId` | id einer Themen-Säule des Kunden. |
| `status` | `idee` → `entwurf` → `freigabe` → `freigegeben` → `geplant` → `veroeffentlicht`. |
| `titel` | Interner Arbeitstitel (steht im Kalender). |
| `caption`, `hashtags`, `notiz` | Texte. `hashtags` ist ein Text, keine Liste. |
| `folien[]` | Mindestens eine Folie; mehrere = Karussell. |

### Folie (`leereFolie()`), Eintrag in `post.folien`

| Feld | Bedeutung |
|---|---|
| `id` | z. B. `folie-…`. |
| `vorlage` | id einer Grafik-Vorlage. |
| `texte.titel`, `.untertitel`, `.text`, `.zusatz` | Vier feste Text-Plätze; jede Vorlage nutzt und benennt sie selbst. |
| `bildId`, `bildId2` | Fotos aus `kunde.bilder` (`bildId2` nur bei Vorher/Nachher). |
| `ausschnitt` | `{zoom 1–3, x, y in Prozent}`. |
| `textPosition` | `oben` \| `mitte` \| `unten`. |
| `ausrichtung` | `links` \| `mitte`. |
| `farbschema` | `marke` \| `hell` \| `dunkel`. |

### Bericht (`leererBericht()`), Eintrag in `kunde.berichte`

`{id, monat "JJJJ-MM", kennzahlen {kennzahlId: Zahl}, topPosts [{id, titel, wert}], einschaetzung, plan}`. Eine nicht eingetragene Kennzahl fehlt im Objekt und wird nirgends als 0 angezeigt.

### Einstellungen (`standardEinstellungen()`), gelten für alle Kunden

| Feld | Bedeutung |
|---|---|
| `formatVersion` | 1. |
| `meineDaten` | `name, firma, strasse, plz, ort, telefon, email, website, logo (Data-URL), preisHinweis`. |
| `pakete[]` | Meine Pakete (Start-Vorschlag aus `pakete.js`). |
| `ki` | `{anbieter, apiKey, modell, basisUrl}`. **Der `apiKey` verlässt nie den Browser-Speicher.** |
| `letzterKundeId` | Welcher Kunde zuletzt offen war. |
| `checks[]` | Social-Media-Checks `{id, datum, betrieb, ort, branche, link, punkte {punktId: {wert, notiz}}, fazit, paketId}`. |
| `angebote[]` | `{id, datum, empfaenger, anschrift, paketId, preis, start, laufzeit, zusatz}`. |
| `aufgaben[]` | `{id, text, faellig, erledigt, kundeId}`. |

### Beispiel (gekürzt)

```json
{
  "formatVersion": 1,
  "werkzeugVersion": "1.0.0",
  "id": "kunde-beispiel-cafe-muster",
  "stamm": { "firmenname": "Café Muster", "branche": "gastro", "ort": "Hallein", "plz": "5400" },
  "marke": {
    "farben": { "primaer": "#6b3f2a", "akzent": "#e8b04a", "hintergrund": "#fbf6ee", "text": "#2b1d14" },
    "schriftpaar": "klassisch", "ton": "freundlich"
  },
  "kanaele": { "instagram": { "aktiv": true, "link": "https://instagram.example/cafemuster" } },
  "strategie": {
    "postsProMonat": 8,
    "saeulen": [ { "id": "saeule-1", "name": "Speisen & Getränke", "anteil": 35, "beitragsarten": ["produkt", "neuigkeit"] } ]
  },
  "posts": [
    {
      "id": "post-1", "datum": "2026-11-18", "uhrzeit": "09:00",
      "kanaele": ["instagram", "facebook"], "format": "feed-hoch",
      "beitragsart": "produkt", "status": "freigabe",
      "titel": "Produkt / Leistung · Speisen & Getränke",
      "caption": "Unser Frühstück …", "hashtags": "#hallein #frühstück",
      "folien": [ { "id": "folie-1", "vorlage": "produkt",
        "texte": { "titel": "Frühstück", "untertitel": "", "text": "", "zusatz": "" },
        "bildId": "", "farbschema": "marke" } ]
    }
  ],
  "berichte": [ { "id": "bericht-1", "monat": "2026-10", "kennzahlen": { "reichweite": 1840 } } ]
}
```

Der vollständige Beispielkunde steht in `js/konfig/beispielkunde.js` und als Datei in `beispiele/cafe-muster.kunde.json`.

## 5. Speichern, Laden, Export – wie es intern läuft

### Automatisches Speichern

- Datenbank `social-media-toolkit` (IndexedDB) mit zwei Lagern: `kunden` (Schlüssel `kunde.id`, ganzer Kunde inkl. Bilder als Data-URL) und `einstellungen` (ein Eintrag `haupt`).
- `js/ui/app.js` hört auf `SM.zustand.melde()` und speichert 0,6 Sekunden nach der letzten Änderung. Der Status steht unten in der Seitenleiste.
- Beim Kundenwechsel wird der aktuelle Kunde zuerst gespeichert.

### Laden

- `SM.speicher.ladeKunde(id)` und `ladeAlleKunden()` schicken **jeden** Kunden durch `SM.migration.migriere()`.
- `migriere()`: (1) Umbau-Schritte der Reihe nach, (2) fehlende Felder aus `leererKunde()` ergänzen, (3) Reparaturen (fehlende ids, 7 Wochentage, vollständige Beiträge und Folien). Eine Datei aus einer **neueren** Format-Version wird mit klarer Meldung abgelehnt.
- Einstellungen laufen durch `migriereEinstellungen()` (fehlende Felder ergänzen).

### Kundendatei und Gesamt-Sicherung (`js/kern/kundendatei.js`)

Beide haben einen „Umschlag":

```json
{ "art": "social-media-toolkit-kunde", "formatVersion": 1, "werkzeugVersion": "1.0.0",
  "exportiertAm": "…", "kunde": { … } }

{ "art": "social-media-toolkit-sicherung", "formatVersion": 1, "werkzeugVersion": "1.0.0",
  "exportiertAm": "…", "kunden": [ … ], "einstellungen": { … ohne apiKey … } }
```

`SM.kundendatei.erkenne(text)` liefert `kunde`, `sicherung`, `baukasten` oder `unbekannt`. Beim Einspielen einer Sicherung bleibt der im Browser vorhandene KI-Key erhalten.

### Import aus dem Website-Baukasten (`js/kern/baukasten-import.js`)

| Website-Baukasten (`*.projekt.json`) | Toolkit-Kunde |
|---|---|
| `betrieb.firmenname, slogan, branche, beschreibung, strasse, plz, ort, land, telefon, email` | `stamm.<gleicher Name>` |
| `seo.domain` | `stamm.website` |
| `recht.inhaber` | `ansprechperson.name` |
| `oeffnungszeiten {hinweis, tage[7]}` | `oeffnungszeiten` (gleich) |
| `leistungen [{id, name, beschreibung, preis}]` | `leistungen` (ohne `bildId`) |
| `design.farben.primaer, akzent, hintergrund, text` | `marke.farben.<gleicher Name>` |
| `design.schriftpaar` | `marke.schriftpaar` |
| `bilder[]` | `bilder[]`; `bereich: "logo"` bleibt, alles andere wird `"foto"` |
| `social.instagram, facebook, tiktok, google` | `kanaele.<name>.link` (+ `aktiv`) |

Nicht übernommen wird alles, was nur die Website betrifft (Abschnitte, SEO-Texte, Impressum, Team, Bewertungen). `neuerKunde(text)` legt einen Kunden an, `uebernehmeIn(kunde, projekt)` ergänzt einen vorhandenen, ohne Beiträge zu ändern und ohne Fotos doppelt anzulegen. Ändert sich das Baukasten-Format, muss nur diese eine Datei angepasst werden.

### PNG-Export (`js/grafik/rendern.js`)

- Jede Folie wird in voller Größe des Formats auf einen unsichtbaren Canvas gezeichnet und als PNG ausgegeben.
- Ein Beitrag mit einer Folie wird als einzelnes PNG heruntergeladen, ein Karussell als ZIP mit nummerierten PNGs (`2026-11-04_cafe-muster_karussell_1.png`, `…_2.png`).
- Dateinamen baut `SM.grafik.dateiname()`.

### Dokumente als PDF

Das Werkzeug erzeugt kein PDF selbst. Jedes Dokument ist ein vollständiges HTML mit Druck-CSS (A4). Im neuen Tab: `Strg + P` → „Als PDF speichern".

### KI-Assistent (`js/kern/ki.js`)

`bauePrompt(aufgabeId, eingabe, kunde, tonId)` baut den Auftrag (`{system, nutzer}`) aus Firmenname, Ort, Branche, Ton, Zielgruppe und Leistungen (keine Kontaktdaten, kein Key). `frage(einstellungen, prompt)` schickt ihn mit `fetch` direkt an den Anbieter (Anthropic oder OpenAI-kompatibel). Das ist die einzige Stelle im Werkzeug, die ins Internet geht.

## 6. Versionen

- `SM.VERSION` (Werkzeug) steht in `js/kern/namespace.js` und wird unten in der Seitenleiste und in `test.html` angezeigt.
- `SM.FORMAT_VERSION` (Datenformat) steigt nur bei einem Umbau des Datenmodells, immer zusammen mit einem Migrations-Schritt.
