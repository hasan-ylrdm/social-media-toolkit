# Übergabe-Prompt für Claude Opus

Den Text im Kasten in einen neuen Chat kopieren und den ganzen Projektordner (als ZIP) dazugeben. In Claude Code stattdessen den Ordner öffnen; dort wird `CLAUDE.md` automatisch gelesen, und der Text unten dient als erste Nachricht.

---

```text
Du arbeitest an meinem Projekt „Social-Media-Betreuungs-Toolkit" weiter. Der komplette Projektordner liegt bei.

WAS ES IST
Ein Werkzeug nur für mich (Hasan, AI-Student in Hallein). Damit betreue ich die Social-Media-Kanäle kleiner lokaler Betriebe: Kundenverwaltung, Onboarding und Strategie, Redaktionsplan, Post-Editor mit Grafik-Vorlagen (Canvas → PNG), Texte und Hashtags, Reel-Ideen, Freigabe-Übersicht, Monatsbericht, Akquise und Angebote. Es läuft komplett im Browser per Doppelklick auf index.html: reines HTML, CSS und JavaScript, kein Server, kein npm, keine Build-Tools, keine Fremd-Bibliotheken, offline. Es gibt ein Schwesterprojekt „Website-Baukasten", dessen Projektdateien das Toolkit importieren kann.

AKTUELLER STAND
Version 1.0.1, Datenformat 1. Vollständig und funktionsfähig:
- 11 Bereiche, 11 Branchen, 17 Grafik-Vorlagen, 5 Formate, 16 Beitragsarten
- Speichern in IndexedDB, Kundendatei (.kunde.json), Gesamt-Sicherung, Import aus dem Website-Baukasten
- Druckbare Dokumente: Fragebogen, Strategie, Einwilligung, Freigabe, Monatsbericht, Social-Media-Check, Angebot
- Optionaler KI-Assistent (API-Key nur lokal)
- Selbsttest: test.html mit 52 Tests, alle grün
- Bekannte Grenzen und offene Ideen stehen in WEITERENTWICKLUNG.md (Abschnitte 6 und 7)

BEVOR DU ETWAS ÄNDERST
1. Lies CLAUDE.md vollständig (Regeln, Konventionen, „Nicht anfassen"-Bereiche, Fallstricke).
2. Lies ARCHITEKTUR.md vollständig (alle Dateien, Datenfluss, Datenmodell).
3. Lies die Dateien, die du ändern willst, ganz, nicht nur Ausschnitte.
4. Für typische Erweiterungen (neue Branche, neue Grafik-Vorlage, neues Format, neues Feld) gibt es Schritt-für-Schritt-Anleitungen in WEITERENTWICKLUNG.md. Halte dich daran.

SO ARBEITEN WIR
- Kleine Schritte: eine Änderung pro Antwort. Nichts nebenbei umbauen, umbenennen oder umformatieren.
- Gib mir IMMER die ganzen geänderten Dateien zurück (vollständiger Inhalt, mit Pfad als Überschrift), nie Ausschnitte mit „Rest wie bisher". Ich ersetze die Dateien komplett.
- Sag zu jeder Änderung: welche Dateien geändert oder neu sind, was sich für mich ändert und was ich von Hand ausprobieren soll.
- Neue .js-Datei? Dann auch js/ladeliste.js zurückgeben (dort wird sie eingetragen).
- Für jede neue Funktion einen Test in tests/ ergänzen.
- Danach: Ich öffne test.html. Alles muss grün sein. Wird etwas rot, schicke ich dir die rote Zeile, und du behebst zuerst das, bevor wir weitermachen.
- Erhöhe SM.VERSION in js/kern/namespace.js und ergänze CHANGELOG.md. Ändert sich Aufbau oder Datenmodell, passe auch ARCHITEKTUR.md an.
- Ändert sich das Datenmodell so, dass alte Dateien nicht mehr passen: SM.FORMAT_VERSION erhöhen und einen Migrations-Schritt in js/kern/migration.js anhängen. Alte Kundendateien müssen immer ladbar bleiben.
- Schreib den Code einfach und verständlich (ich bin Anfänger in JavaScript): var und function, keine Pfeilfunktionen, deutsche Namen und Kommentare, bei jeder Funktion ein Kommentar mit Zweck, Eingaben und Rückgabe.
- Keine erfundenen Zahlen, Statistiken oder Garantien in Texten für Kunden. Der Monatsbericht zeigt nur, was ich eingetragen habe.
- Der KI-Key darf nie in eine Datei, ein Dokument oder einen Export gelangen.
- Wenn etwas unklar ist oder es mehrere sinnvolle Wege gibt: frag mich kurz, bevor du baust. Nenne deine Annahmen.
- Wenn du einen Fehler in bestehendem Code findest, der nichts mit der Aufgabe zu tun hat: sag es mir, aber ändere ihn nicht ungefragt.

MEINE ERSTE AUFGABE
[hier meine Aufgabe eintragen, z. B.: „Lege nach WEITERENTWICKLUNG.md Abschnitt 1 die Branche ‚Bäckerei' an." oder „Im Kalender soll ich nach Status filtern können."]

Bestätige zuerst in 3–5 Sätzen, dass du CLAUDE.md und ARCHITEKTUR.md gelesen hast und wie du die Aufgabe angehen würdest (welche Dateien betroffen sind). Warte dann auf mein OK.
```

---

## Tipps für mich

- **Vor jeder Sitzung eine Kopie** des Ordners anlegen (z. B. `social-media-toolkit-1.0.1`). So komme ich immer zurück.
- **Vor jeder Sitzung eine Gesamt-Sicherung** herunterladen (Einstellungen), wenn schon echte Kunden drin sind.
- **Im normalen Chat:** den Ordner als ZIP hochladen. Wird der Chat lang, einen neuen beginnen und den Prompt wieder verwenden.
- **In Claude Code:** Ordner öffnen. Dort kann Opus die Tests selbst ausführen: `node tests/node-pruefung.js`. Die Browser-Tests (Speicher, Bilder, Grafik) laufen trotzdem nur in `test.html`.
- **Nach jeder Änderung:** `test.html` doppelklicken, dann die geänderte Stelle in `index.html` mit dem Beispielkunden ausprobieren.
- **Wenn etwas kaputt ist:** Browser-Konsole öffnen (F12 → „Konsole") und die rote Fehlermeldung an Opus schicken.
