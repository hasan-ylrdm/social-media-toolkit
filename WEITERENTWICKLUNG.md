# Weiterentwicklung

Schritt-für-Schritt-Anleitungen für die häufigsten Erweiterungen, Ideen für später und eine ehrliche Liste der Grenzen.

**Nach jeder Änderung:** `test.html` öffnen (alles grün?), Version in `js/kern/namespace.js` erhöhen, `CHANGELOG.md` ergänzen.

Die Anleitungen 1, 2 und 4 wurden beim Bau in einer Kopie des Projekts genau so ausprobiert (alle vier Schritte zusammen): `test.html` blieb grün, die Tests haben die neue Branche und die neue Vorlage automatisch mitgeprüft.

---

## 1. Neue Branche

Beispiel: „Bäckerei". Eine Branche braucht Einträge in **vier** Dateien unter derselben id. Fehlt einer, wird `test.html` rot und sagt, welcher.

**Schritt 1 – `js/konfig/branchen.js`:** in die Liste `SM.konfig.branchen` einen Eintrag schreiben. Die Anteile der Säulen müssen zusammen 100 ergeben, die Beitragsarten müssen in `beitragsarten.js` vorkommen.

```js
{
  id: 'baeckerei', name: 'Bäckerei',
  zielgruppe: 'Menschen aus {Ort} und Umgebung, die frisches Brot und Gebäck vom Handwerksbetrieb schätzen.',
  kanalHinweis: 'Instagram für Bilder aus der Backstube, Facebook für Angebote, Google für Öffnungszeiten.',
  saeulen: [
    s('Aus der Backstube', 40, ['einblick', 'team'], 'Zeigen, wie gebacken wird.'),
    s('Sortiment', 35, ['produkt', 'angebot'], 'Brot, Gebäck und Saisonales.'),
    s('Infos', 25, ['oeffnungszeiten', 'neuigkeit', 'saison'], 'Öffnungszeiten und Neuigkeiten.')
  ]
},
```

**Schritt 2 – Captions, `js/konfig/textbausteine-branchen-2.js`:** vor der letzten Zeile `})();` einfügen. Es müssen nicht alle Beitragsarten vorkommen; für fehlende werden die allgemeinen Texte angeboten.

```js
SM.konfig.textbausteine.baeckerei = {
  produkt: [
    'Frisch aus dem Ofen: {Thema}. Ab sofort bei {Firmenname} in {Ort}.',
    'Unser Tipp diese Woche: {Thema}. Solange der Vorrat reicht.'
  ]
};
```

**Schritt 3 – Hashtags, `js/konfig/hashtags.js`:** in `branchen: { … }` eine Zeile ergänzen (mindestens 3 Hashtags).

```js
baeckerei: ['#bäckerei', '#frischgebacken', '#handwerk', '#brot'],
```

**Schritt 4 – Reel-Ideen, `js/konfig/reels-4.js`:** vor `})();`. Der Test verlangt mindestens 10 Ideen pro Branche. Zum Start die allgemeinen übernehmen und später durch eigene ersetzen (Muster für `SM.konfig.reelIdee(…)` steht oben in `reels-1.js`):

```js
SM.konfig.reels.baeckerei = SM.konfig.reels.allgemein.slice();
```

**Schritt 5:** `test.html` öffnen. Die Branche erscheint danach überall in der Auswahl.

**Wichtig:** Soll die Branche auch im Website-Baukasten vorkommen, dort dieselbe id verwenden. Nur dann wird sie beim Import erkannt (sonst bleibt die id stehen und das Toolkit zeigt die allgemeinen Vorschläge).

---

## 2. Neue Grafik-Vorlage

Beispiel: „Jubiläum". Eine Vorlage ist ein Eintrag mit einer Funktion `zeichne(z)`. Das vollständige Muster mit allen Angaben steht oben in `js/grafik/vorlagen-register.js`.

**Schritt 1 – `js/grafik/vorlagen-3.js`:** vor `})();` einfügen.

```js
/* ---------- Jubiläum ---------- */
SM.grafik.registriere({
  id: 'jubilaeum', name: 'Jubiläum', bilder: 0,
  plaetze: { untertitel: 'Dachzeile', titel: 'Große Zahl oder Titel', text: 'Text' },
  zeichne: function (z) {
    z.fuelle(z.farben.flaeche);
    z.block([
      { text: z.texte.untertitel, pille: true },
      { text: z.texte.titel, groesse: 12, art: 'ueberschrift' },
      { text: z.texte.text, groesse: 3.6 }
    ], { x: z.rand, y: z.oben, b: z.b - 2 * z.rand, h: z.unten - z.oben, position: 'mitte', ausrichtung: 'mitte' });
    z.logoEcke();
    z.seitenzahl();
  }
});
```

**Schritt 2:** `test.html` öffnen. Der Test „Grafik: jede Vorlage zeichnet in jedem Format ohne Fehler" zeichnet die neue Vorlage in allen Formaten, mit und ohne Foto.

**Schritt 3:** Im Post-Editor unter „Grafik" die Vorlage wählen und in allen Formaten ansehen.

Regeln für `zeichne(z)`:

- Nur relative Maße: `z.b` (Breite), `z.h` (Höhe), `z.e` (1 % der kürzeren Seite), `z.rand`, `z.oben`, `z.unten`. Keine festen Pixel, sonst passt es nur in einem Format.
- Farben nur aus `z.farben` (`flaeche`, `betonung`, `aufBetonung` …). So wirken Markenfarben und das Farbschema der Folie.
- Text nur über `z.block`, `z.schreibe` oder `z.pille`. Diese brechen automatisch um.
- `bilder: 1` oder `2`, wenn die Vorlage Fotos nutzt (`z.bild`, `z.bild2`, zeichnen mit `z.foto(…)` oder `z.vollbild(…)`).

### Neue Beitragsart (verbindet Vorlage und Texte)

Soll die Vorlage auch im Plan-Generator und bei den Textvorschlägen vorkommen, in `js/konfig/beitragsarten.js` einen Eintrag nach dem Muster dort ergänzen **und** in `js/konfig/textbausteine-allgemein.js` unter derselben id mindestens zwei Captions anlegen (der Test prüft das).

---

## 3. Neues Layout bzw. neues Format

**Layout innerhalb einer Vorlage:** Jede Folie hat schon drei Schalter, die jede Vorlage beachtet: `textPosition` (oben/mitte/unten), `ausrichtung` (links/mitte) und `farbschema` (marke/hell/dunkel). Ein ganz anderes Layout ist eine eigene Vorlage (Abschnitt 2), z. B. `angebot-gross`.

**Neues Bildformat** (Beispiel: Pinterest-Pin): in `js/konfig/konstanten.js` bei `SM.konfig.formate` eine Zeile ergänzen.

```js
{ id: 'pin', name: 'Pinterest-Pin (2:3)', breite: 1000, hoehe: 1500, vorschau: 'feed' }
```

`vorschau` bestimmt den Rahmen der Vorschau: `feed`, `story` oder `google` (schlichter Rahmen). Die Vorlagen rechnen relativ zur Breite und sind für quadratische und hohe Formate gebaut. **Sehr flache Querformate (z. B. Facebook-Titelbild 1640×624) funktionieren nicht gut:** Der Selbsttest bleibt seit 1.0.1 grün, aber in etwa der Hälfte der Vorlagen überlappen oder fehlen Texte. Dafür müsste man die Vorlagen an der Höhe ausrichten (siehe Ideenliste). Der Test „Grafik" zeichnet jedes Format mit.

---

## 4. Neues Feld im Datenmodell

Beispiel: Parkmöglichkeit beim Kunden (`stamm.parken`).

**Schritt 1 – `js/kern/datenmodell.js`:** in `leererKunde()` bei `stamm` ergänzen.

```js
website: '',
parken: ''
```

Mehr ist für alte Daten nicht nötig: Die Migration ergänzt fehlende Felder beim Laden automatisch. `SM.FORMAT_VERSION` bleibt gleich.

**Schritt 2 – Eingabefeld, `js/ui/ansicht-kunden.js`:** in der Gruppe „Stammdaten" neben `stamm.website` ein Feld ergänzen.

```js
{ pfad: 'stamm.parken', label: 'Parken', art: 'text', hilfe: 'z. B. „Parkplätze im Hof"' }
```

**Schritt 3 – verwenden**, z. B. als Platzhalter `{Parken}`: in `js/kern/platzhalter.js` bei `werte = { … }` die Zeile `parken: stamm.parken` ergänzen.

**Schritt 4:** `ARCHITEKTUR.md` (Abschnitt 4, Datenmodell) nachziehen, `test.html` öffnen.

### Wenn ein Feld umbenannt oder umgebaut wird

Dann reicht Schritt 1 nicht, weil alte Kundendateien noch das alte Feld haben:

0. Das Feld in `js/kern/datenmodell.js` umbenennen (sonst legt die Migration das alte Feld leer wieder an).
1. `SM.FORMAT_VERSION` in `js/kern/namespace.js` um 1 erhöhen.
2. In `js/kern/migration.js` bei `SM.migration.schritte` einen Schritt anhängen (Muster steht dort):

```js
{
  von: 1, nach: 2,
  beschreibung: 'stamm.telefon heißt jetzt stamm.telefonnummer',
  ausfuehren: function (kunde) {
    kunde.stamm.telefonnummer = kunde.stamm.telefon || '';
    delete kunde.stamm.telefon;
    return kunde;
  }
}
```

3. In `tests/tests-kern.js` einen Test mit einem alten Kunden ergänzen (Vorbild: „Migration: altes Format …").
4. Vorhandene Schritte **nie** ändern oder löschen.

Betrifft der Umbau Felder, die aus dem Website-Baukasten kommen, auch `js/kern/baukasten-import.js` anpassen.

---

## 5. Weitere kleine Erweiterungen

| Ich will … | Wo | Hinweis |
|---|---|---|
| Neuer Anlass im Kalender | `js/konfig/anlaesse.js` | Regel-Arten stehen im Kopfkommentar. |
| Neue Kennzahl im Bericht | `js/konfig/kennzahlen.js` | Erscheint automatisch in Formular, Vergleich und Bericht. |
| Neue Frage im Fragebogen | `js/konfig/onboarding-fragen.js` | |
| Neuer Punkt im Social-Media-Check | `js/konfig/check-punkte.js` | |
| Neue Vorlage für die Kontaktaufnahme | `js/konfig/akquise-vorlagen.js` | |
| Neues Schriftpaar | `js/konfig/schriften.js` | Nur Systemschriften. |
| Neuer Ort bei den Hashtags | `js/konfig/hashtags.js`, Liste `orte` | |
| Neue KI-Aufgabe | `js/kern/ki.js`, `SM.ki.AUFGABEN` | Danach in der passenden Ansicht einen Knopf ergänzen, der `SM.ui.ki.oeffne(…)` aufruft. |
| Neues druckbares Dokument | `js/dokumente/neu.js` + `ladeliste.js` | Aufbau wie `freigabe.js`; Rahmen über `SM.dokumente.seite(…)`. |
| Neue Ansicht | `js/ui/ansicht-xyz.js` + `ladeliste.js` + `SM.ui.NAVIGATION` in `app.js` | Muster im Kopf von `app.js`. |
| Neuer Kanal | `js/konfig/konstanten.js` **und** `kunde.kanaele` in `datenmodell.js` | Gleicher Schlüssel an beiden Stellen. Danach die erwartete Kanal-Liste im Test „Formate, Kanäle und Status sind vollständig" (`tests/tests-inhalte.js`) ergänzen, sonst wird er rot. |

---

## 6. Ideen für später (nach Aufwand)

### Klein (bis etwa 1 Stunde)

- Eigene Reel-Ideen pro Kunde speichern.
- Beitrag in einen anderen Monat oder zu einem anderen Kunden kopieren.
- Filter im Kalender nach Status oder Kanal.
- Aufgaben automatisch aus dem Kalender ableiten („3 Beiträge warten auf Freigabe").
- Rückfrage vor dem Löschen von Listeneinträgen.
- Weitere Orte und Branchen-Hashtags.

### Mittel (einige Stunden)

- Stories als eigene Einträge im Monatsplan (bisher nur als Zahl in der Strategie).
- Text auf der Grafik frei mit der Maus verschieben (bisher: oben/mitte/unten, links/mitte).
- Eigene Schriften als Datei einbinden (lokal mitliefern, per `FontFace` laden).
- Freigabe-Rückmeldung des Kunden pro Beitrag festhalten (Änderungswunsch als Text).
- Jahresübersicht der Kennzahlen im Bericht.
- Rechnungs-Vorlage aus Paket und Kunde.
- Kalender-Export als `.ics`.

### Groß (ein Tag und mehr)

- Automatisches Veröffentlichen über die Meta Graph API. Braucht einen Server oder zumindest ein Meta-App-Konto mit Prüfung; passt nicht zum Grundsatz „kein Server".
- Kennzahlen automatisch aus den Insights lesen (gleiches Problem).
- Freigabe online: der Kunde klickt selbst auf „OK". Braucht einen Server.
- Video-Schnitt oder Reel-Vorlagen mit Animation.
- Synchronisation zwischen mehreren Geräten.

---

## 7. Bekannte Grenzen und Schwachstellen (ehrlich)

**Grundsätzlich**

- **Kein Veröffentlichen, kein Abruf von Zahlen.** Das Werkzeug plant, gestaltet und dokumentiert. Hochladen und Insights ablesen mache ich von Hand.
- **Daten liegen nur im Browser** (IndexedDB), pro Browser und pro Computer getrennt. Ohne Gesamt-Sicherung sind sie bei gelöschten Browserdaten weg. Es gibt keine automatische Erinnerung an die Sicherung.
- **Kein Rückgängig.** Gelöschte Beiträge, Fotos und Listeneinträge sind weg.
- **Ein Nutzer, ein Gerät.** Keine Zusammenarbeit, kein Abgleich.

**Grafik**

- **Nur Systemschriften.** Das PNG sieht auf meinem Computer so aus wie in der Vorschau, aber auf einem anderen Computer mit anderen Schriften leicht anders. Immer am selben Gerät exportieren.
- **Text sitzt nur an festen Plätzen** (oben/mitte/unten, links/mitte), nicht frei verschiebbar.
- **Sehr lange Texte** werden umgebrochen, aber nicht automatisch verkleinert; sie können aus dem Bild laufen. In der Vorschau prüfen.
- **Die Vorschau ist nachgebaut**, nicht die echte Instagram-App. Ränder und Zuschnitt im Profil-Raster können abweichen.
- **Zuschnitt** nur über Zoom und Mittelpunkt, keine Ziehpunkte.

**Inhalte**

- **Textbausteine, Hashtags und Reel-Ideen sind Startmaterial**, von einer KI geschrieben und nicht von einer Agentur geprüft. Vor dem Posten lesen und anpassen.
- **Zeichen-Grenzen und Hashtag-Empfehlungen** der Plattformen sind Stand 2025 (`js/konfig/konstanten.js`) und ändern sich gelegentlich.
- **Feiertage und Ferien** werden nach Regeln berechnet. Schulautonome Tage, verschobene Ferien und regionale Besonderheiten fehlen.
- **Paketpreise sind Beispielwerte**, keine Marktanalyse.

**Recht**

- **Die Einwilligung für Fotos ist eine Vorlage**, keine Rechtsberatung. Vor dem ersten echten Einsatz prüfen lassen (z. B. WKO).
- **Gewinnspiele** haben eigene Regeln der Plattformen und des Gesetzes; die Vorlage dafür ersetzt keine Teilnahmebedingungen.
- **Werbekennzeichnung, Musikrechte, Urheberrecht an Fotos** prüft das Werkzeug nicht.

**KI-Assistent**

- **Der Key liegt unverschlüsselt im Browser-Speicher** dieses Computers. Nicht auf fremden Computern eintragen.
- **Der Aufruf geht direkt vom Browser an den Anbieter.** Manche Anbieter blockieren das (CORS); bei Anthropic ist es über einen eigenen Header erlaubt.
- **Der Modellname** in den Einstellungen muss beim Anbieter existieren; Modelle werden regelmäßig abgelöst.

**Technik**

- **Getestet in Chrome.** Firefox, Safari und Edge wurden nicht geprüft. Safari erzeugt kein WebP (Rückfall auf JPEG ist eingebaut).
- **Drag & Drop im Kalender nur mit der Maus**, nicht per Touch.
- **Große Kunden** (viele Fotos) machen Kundendatei und Sicherung groß, weil Bilder als Data-URL in der JSON stehen.
- **Nicht jede kleine innere Hilfsfunktion** hat den vollen Kommentar mit Eingaben und Rückgabe. Alle öffentlichen Funktionen (`SM.…`) haben ihn.

### Vom unabhängigen Prüfer gefunden und noch offen (Stand 1.0.1)

- **Google-Format (1200×900) bei einzelnen Vorlagen:** „Gewinnspiel" mit Foto schneidet den Titel ab und lässt Text weg; Öffnungszeiten-Zeilen sind dort sehr klein. Vor dem Export ansehen oder für Google eine andere Vorlage nehmen.
- **Sehr flache Querformate** funktionieren in etwa der Hälfte der Vorlagen nicht gut (siehe Abschnitt 3).
- **Text positionieren** geht nur über die Schalter oben/mitte/unten und links/mitte, kein freies Verschieben. Die Vorlage „Produkt" beachtet die Schalter nicht.
- **Eigene Branchen-Captions** gibt es nur für 4–5 der 16 Beitragsarten je Branche; der Rest kommt aus den allgemeinen Texten.
- **Plan-Generator:** Stories werden nicht eingeplant; ein Beitrag kann auf einen Feiertag fallen (z. B. 25.12.); Google-Beiträge bekommen das Hochformat 1080×1350 statt 1200×900; Paket „Basis" belegt alle aktiven Kanäle.
- **Google-Kanal:** Die Standard-Texte setzen eine Telefonnummer ein, obwohl der Hinweis davon abrät; es gibt keine Warnung.
- **Logo auf Markenfläche:** Vorlagen ohne helle Platte (Frage, Gewinnspiel, Liste, Tipp, Zitat) zeichnen das Logo direkt auf die Hauptfarbe. Ein Logo in genau dieser Farbe ist dort kaum zu sehen.
- **PNG-Dateiname** enthält das Format nicht (gleicher Beitrag in zwei Formaten = gleicher Name).
- **Berichte:** Schon das Ansehen eines Monats legt einen leeren Bericht an.
- **Baukasten-Import:** Dieselbe Datei zweimal importiert ergibt zwei gleichnamige Kunden. Team-Namen, Bewertungen und Terminlink werden nicht übernommen.
- **Sicherung einspielen** führt zusammen und ersetzt nicht: Kunden, die nicht in der Sicherung sind, bleiben stehen.
- **Einwilligungs-Vorlage:** Der Satz zur Dauer ist holprig, das Recht auf Datenübertragbarkeit fehlt in der Aufzählung. **Angebot:** kein fester Hinweis zur Umsatzsteuer bzw. Kleinunternehmerregelung (in den Preis-Hinweis unter „Mein Geschäft" schreiben).
- **TikTok-Zeichengrenze:** 2200 ist die vorsichtige Grenze (gilt für Planungs-Tools); in der App sind je nach Quelle bis 4000 möglich. Plattform-Grenzen ändern sich – in `js/konfig/konstanten.js` anpassen.
- **Kommentare:** Die 17 `zeichne`-Funktionen der Vorlagen und einige kleine Hilfsfunktionen haben keinen oder nur einen kurzen Kommentar.
- **Nicht getestet:** echter KI-Aufruf (Netz war beim Test gesperrt), Firefox/Safari/Edge, echter Druckdialog (nur PDF-Ausgabe von Chrome), Touch-Bedienung, sehr viele große Fotos.

