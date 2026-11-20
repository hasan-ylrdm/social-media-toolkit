# Social-Media-Betreuungs-Toolkit



Werkzeug, mit dem ich die Social-Media-Kanäle kleiner lokaler Betriebe betreue (Instagram, Facebook, optional TikTok und Google-Unternehmensprofil): Strategie, Monatsplan, Post-Grafiken als PNG, Freigabe- und Monatsberichte als PDF. Kunden lassen sich direkt aus dem [Website-Baukasten](https://github.com/haso-yld/website-baukasten) übernehmen. Läuft komplett im Browser – kein Server, keine Installation, keine Fremd-Bibliotheken.

**Technik:** HTML, CSS und JavaScript · Grafiken mit Canvas · Speicherung in IndexedDB · 52 automatische Tests (`test.html`)

*Entwickelt mit Unterstützung von Claude (KI). Idee, Anforderungen und der Einsatz bei echten Kunden stammen von mir.*

Version 1.0.1 · Datenformat 1

## Starten

1. Ordner `social-media-toolkit` an einen festen Platz legen (z. B. Dokumente).
2. Doppelklick auf `index.html`. Empfohlen: Chrome oder Edge.
3. Beim allerersten Start wird der Beispielkunde „Café Muster, Hallein" mit fertigem Monatsplan angelegt.

Nach jeder Änderung am Code: `test.html` doppelklicken. Steht oben „Alles in Ordnung", funktioniert alles Wichtige.

## Bedienung in 10 Schritten

| Schritt | Bereich | Was ich dort mache |
|---|---|---|
| 1 | Mein Geschäft → Meine Daten und Pakete | Meinen Namen, Kontakt, Logo und meine drei Pakete mit Preisen eintragen. |
| 2 | Kunden | Kunden anlegen oder **aus dem Website-Baukasten importieren** (`*.projekt.json`). Logo, Fotos, Farben, Ton, Kanäle, Paket. |
| 3 | Strategie | Onboarding-Fragebogen drucken oder digital ausfüllen, dann „Strategie neu vorschlagen". Alles bearbeitbar und druckbar. Hier liegt auch die Einwilligungs-Vorlage für Fotos. |
| 4 | Kalender | „Monatsplan erzeugen" füllt den Monat nach Strategie und Paket. Beiträge mit der Maus verschieben. Feiertage, Salzburger Ferien und Anlässe sind eingeblendet. |
| 5 | Post-Editor | Format, Beitragsart, Grafik-Vorlage, Fotos, Texte. Rechts die Vorschau. „Als PNG herunterladen" (Karussell: ZIP mit nummerierten PNGs). |
| 6 | Texte & Hashtags | Textbausteine der Branche, Hashtag-Sets kombinieren und speichern, KI-Helfer. |
| 7 | Reels | Ideen pro Branche mit Kurz-Drehbuch. „Als Beitrag einplanen" legt die Idee in den Kalender. |
| 8 | Freigabe | Freigabe-Übersicht des Monats öffnen und als PDF drucken. Status in einem Rutsch weiterschalten. |
| 9 | Berichte | Zahlen aus den Insights eintragen, Monatsbericht öffnen und als PDF drucken. |
| 10 | Mein Geschäft | Social-Media-Check für mögliche Kunden, Angebote, Texte für die Kontaktaufnahme, Umsatz-Übersicht, Aufgaben. |

**PDF erzeugen:** Jedes Dokument öffnet sich in einem neuen Tab. Dort `Strg + P` → „Als PDF speichern".

**Platzhalter:** `{Firmenname}`, `{Ort}`, `{Telefon}` usw. werden automatisch ersetzt. `{Angebot}`, `{Datum}`, `{Thema}` und ähnliche bleiben sichtbar stehen, bis ich sie selbst ausfülle.

## Daten sichern (wichtig)

Alles wird automatisch **in diesem Browser** gespeichert (IndexedDB). Wer die Browserdaten löscht, löscht auch die Kunden. Deshalb regelmäßig:

- **Einstellungen → Gesamt-Sicherung herunterladen** (alle Kunden + meine Daten, ohne KI-Key), oder
- **Kunden → Kundendatei herunterladen** (ein Kunde inkl. Fotos, `*.kunde.json`).

Beide Dateien lassen sich auf jedem Computer wieder einspielen.

## Zusammenspiel mit dem Website-Baukasten

Der Website-Baukasten speichert Kunden als `*.projekt.json`. Unter **Kunden → Aus Website-Baukasten importieren** entsteht daraus ein Toolkit-Kunde mit Firmenname, Adresse, Öffnungszeiten, Leistungen, Farben, Schrift, Logo, Fotos und Social-Links. „Daten aus Website-Baukasten nachladen" aktualisiert einen bestehenden Kunden, ohne Beiträge anzufassen. Die genaue Feld-Zuordnung steht in `ARCHITEKTUR.md` und oben in `js/kern/baukasten-import.js`. Zum Testen liegt `beispiele/salon-musterfrau.projekt.json` bei.

## KI-Assistent (optional)

Unter **Einstellungen** einen API-Key eintragen (Standard: Anthropic Claude API, alternativ ein OpenAI-kompatibler Anbieter). Dann gibt es: Caption schreiben, umformulieren, kürzen, Emojis anpassen, 5 Post-Ideen, Reel-Drehbuch, Antworten auf Kommentare und Bewertungen. Mitgeschickt werden Firmenname, Ort, Branche, Ton, Zielgruppe und Leistungen, aber keine Kontaktdaten. Der Key bleibt in diesem Browser und kommt in keine Datei. Ohne Key funktioniert alles andere normal.

## Erweitern

Alle Inhalte liegen in `js/konfig/`. Jede Datei beginnt mit einem kommentierten Muster.

| Ich will … | Datei |
|---|---|
| eine neue Branche | `branchen.js` + Texte, Hashtags, Reels (siehe `WEITERENTWICKLUNG.md`, Abschnitt 1) |
| neue Captions | `textbausteine-allgemein.js`, `textbausteine-branchen-1.js`, `-2.js` |
| neue Hashtags oder Orte | `hashtags.js` |
| neue Reel-Ideen | `reels-1.js` bis `reels-4.js` |
| eine neue Grafik-Vorlage | `js/grafik/vorlagen-3.js` (siehe `WEITERENTWICKLUNG.md`, Abschnitt 2) |
| einen neuen Anlass im Kalender | `anlaesse.js` |
| andere Kennzahlen im Bericht | `kennzahlen.js` |
| andere Fragen im Fragebogen | `onboarding-fragen.js` |
| andere Punkte im Social-Media-Check | `check-punkte.js` |

Schritt-für-Schritt-Anleitungen: `WEITERENTWICKLUNG.md`. Aufbau und Datenmodell: `ARCHITEKTUR.md`. Regeln für eine KI, die weiterbaut: `CLAUDE.md`.

## Bekannte Grenzen (Kurzfassung)

- **Kein automatisches Veröffentlichen.** Das Werkzeug plant und erzeugt Grafiken und Texte. Hochladen muss ich selbst (z. B. über die Meta Business Suite).
- **Keine Kennzahlen automatisch.** Die Zahlen im Bericht tippe ich aus den Insights ab.
- **Daten liegen nur in diesem Browser.** Ohne Sicherung sind sie bei gelöschten Browserdaten weg.
- **Nur Systemschriften** in den Grafiken (keine geladenen Webfonts), damit alles offline läuft.
- **Schulferien (Salzburg) und Feiertage** werden nach festen Regeln berechnet (`js/kern/kalender-daten.js`, `js/konfig/anlaesse.js`). Schulautonome Tage und Sonderregelungen kennt das Werkzeug nicht; im Zweifel beim Land Salzburg nachsehen.
- **Rechtstexte** (Einwilligung für Fotos) sind Vorlagen und keine Rechtsberatung.
- **Zeichen-Grenzen der Plattformen** sind Stand 2025 und können sich ändern.
- Getestet in Chrome. Firefox, Safari und Edge sind nicht geprüft.

Die vollständige, ehrliche Liste steht in `WEITERENTWICKLUNG.md`, Abschnitt 7.
