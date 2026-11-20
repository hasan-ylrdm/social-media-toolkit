# Changelog

Neue Einträge kommen oben dazu. Format: Version – Datum – was sich geändert hat.

Regeln für die Versionsnummer (`SM.VERSION` in `js/kern/namespace.js`):

- dritte Stelle (1.0.**1**): Fehler behoben, Texte ergänzt
- zweite Stelle (1.**1**.0): neue Funktion, neue Vorlage, neue Branche
- erste Stelle (**2**.0.0): großer Umbau

Das Datenformat (`SM.FORMAT_VERSION`) hat eine eigene Nummer und steigt nur bei einem Umbau des Datenmodells (dann mit Migrations-Schritt).

---

## 1.0.1 – 14.11.2026 – Korrekturen nach unabhängiger Prüfung

Datenformat: 1 (unverändert). Ein zweiter Agent hat alles gegen den Auftrag geprüft; behoben wurde:

- Post-Editor: Die Live-Vorschau blieb beim ersten Öffnen grau (wurde gezeichnet, bevor sie auf der Seite hing).
- Plan-Generator: Feiertagsmonate kippen die Mischung nicht mehr. Nahe Feiertage kommen in einen Beitrag, höchstens ein Viertel der Beiträge sind Öffnungszeiten, der Beitrag steht vor dem Feiertag.
- Grafik: „Foto wählen" erscheint nur noch in der Vorschau, nicht in PNG, ZIP und Freigabe. Die Karussell-Seitenzahl hat einen eigenen Streifen und überdeckt keinen Text mehr. Sehr flache Formate lösen keinen Fehler mehr aus.
- Plattform-Grenzen: Instagram erlaubt seit Dezember 2025 höchstens 5 Hashtags je Beitrag (vorher 30) – Zähler und Hinweise angepasst.
- Kundendokumente: Der interne Hinweis „Beispielpreise – bitte anpassen" steht nicht mehr im Angebot und im Check-Bericht; das Angebot beginnt mit „Guten Tag,".
- Neuer Kunde: Zielgruppe enthält nicht mehr wörtlich „{Ort}". Abweichender Preis versteht „350 €" und „299,50".
- Beispielkunde: widersprüchliche Preise in einem Beitrag bereinigt.
- Doku: Beispiel „Neues Format" durch ein erprobtes Hochformat ersetzt (flache Querformate ehrlich als Grenze genannt), Anleitungen „Neuer Kanal" und „Feld umbenennen" vervollständigt. 2 neue Tests (jetzt 52).

Bewusst NICHT geändert: siehe WEITERENTWICKLUNG.md, „Vom unabhängigen Prüfer gefunden und noch offen".

## 1.0.0 – 14.11.2026 – erste vollständige Version

Datenformat: 1. Gebaut mit Claude Fable 5.2, in diesen Etappen:

### Etappe 1 – Kern

- Globales Objekt `SM`, zentrale Ladeliste `js/ladeliste.js` (läuft per Doppelklick, ohne Module).
- Datenmodell: Kunde, Beitrag, Folie, Bericht, Einstellungen. Feldnamen für Stammdaten, Öffnungszeiten, Leistungen, Bilder und Farben wie im Website-Baukasten.
- Migration (Format 0 → 1, fehlende Felder ergänzen, Reparaturen), Zustand mit Änderungs-Meldungen.
- IndexedDB-Speicher (Kunden, Einstellungen), Kundendatei `.kunde.json`, Gesamt-Sicherung (ohne KI-Key).
- Import aus dem Website-Baukasten (neuer Kunde oder Nachladen in einen vorhandenen).
- Eigener ZIP-Schreiber, Bildverarbeitung (verkleinern, WebP/JPEG, Zuschnitt), Farb- und Datumsrechnung, Platzhalter.
- Kalender-Daten: österreichische Feiertage, Anlässe, Salzburger Schulferien (nach Regeln berechnet).
- Strategie-Vorschlag, Plan-Generator, Kennzahlen-Vergleich, Umsatz und Aufgaben, KI-Auftrag.

### Etappe 2 – Konfiguration

- 11 Branchen mit Zielgruppe, Kanal-Hinweis und Themen-Säulen (gleiche ids wie im Website-Baukasten).
- 16 Beitragsarten, Captions je Branche und Beitragsart, Hashtag-Sets je Branche und Ort.
- Reel-Bibliothek: mindestens 10 Ideen je Branche mit Hook, Szenen, Einblendungen, Musik-Stimmung, Film-Tipp.
- Anlässe, Kennzahlen, Onboarding-Fragen, Start-Pakete, Check-Punkte, Akquise-Vorlagen, 6 Schriftpaare.
- Beispielkunde „Café Muster, Hallein" mit fertigem Monatsplan, Karussell und zwei Berichten.

### Etappe 3 – Grafik

- Zeichner (Werkzeugkasten für Canvas) mit automatischem Textumbruch.
- 17 Grafik-Vorlagen: Angebot, Neuigkeit, Zitat, Vorher/Nachher, Team, Öffnungszeiten, Stellenanzeige, Tipp, Event, Gewinnspiel, Danke, Foto mit Text, Produkt, Frage, Gruß, Titel-Folie, Liste.
- 5 Formate: Feed 1080×1080 und 1080×1350, Story und Reel-Cover 1080×1920, Google-Unternehmensprofil 1200×900.
- Markenfarben, Logo und Schrift werden automatisch übernommen; drei Farbschemata je Folie.
- PNG-Export in Originalgröße, Karussell als ZIP mit nummerierten PNGs.

### Etappe 4 – Dokumente

- Onboarding-Fragebogen (leer zum Drucken oder ausgefüllt), Strategie-Papier.
- Einwilligung für Fotos und Videos (Vorlage, keine Rechtsberatung).
- Freigabe-Übersicht mit Grafik, Caption, Datum, Kanal und „OK / Änderungswunsch".
- Monatsbericht mit Diagrammen, Vergleich zum Vormonat, Top-Beiträgen, Einschätzung und Plan.
- Social-Media-Check und Angebot.

### Etappe 5 – Oberfläche

- 11 Bereiche: Dashboard, Kunden, Strategie, Kalender, Post-Editor, Texte & Hashtags, Reels, Freigabe, Berichte, Mein Geschäft, Einstellungen.
- Kalender mit Monats- und Wochenansicht, Drag & Drop, Monatsplan-Generator, eigene Termine.
- Post-Editor mit Folien, Foto-Zuschnitt, Textvorschlägen, Hashtag-Sets, Zeichenzähler je Kanal, Vorschau als Feed/Story.
- Optionaler KI-Assistent (Anthropic oder OpenAI-kompatibel).

### Etappe 6 – Tests und Dokumentation

- `test.html` mit 50 Tests (seit 1.0.1: 52; davon 8 nur im Browser), dieselben Tests per `node tests/node-pruefung.js`.
- README, ARCHITEKTUR, CLAUDE, WEITERENTWICKLUNG, CHANGELOG, UEBERGABE-PROMPT.
- Behoben vor Auslieferung: `slug()` entfernt jetzt Akzente richtig („Café" → „cafe" statt „caf").
