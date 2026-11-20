/* =====================================================================
   ki.js – OPTIONALER KI-Assistent: Aufträge bauen und Anfrage schicken
   ---------------------------------------------------------------------
   Funktioniert nur, wenn in den Einstellungen ein API-Key eingetragen
   ist. Ohne Key ist alles andere im Toolkit ganz normal benutzbar.

   SICHERHEIT:
   - Der Key liegt nur in den Einstellungen (IndexedDB dieses Browsers).
   - Er steht NIE in einer Kundendatei, Sicherung oder einem Dokument.
   - Er wird nur an den gewählten Anbieter geschickt (direkt aus dem
     Browser). Wer Zugriff auf diesen Computer hat, kann ihn auslesen.
   - Mitgeschickt werden Stammdaten des Kunden (Name, Branche, Ort,
     Leistungen, Zielgruppe, Ton) – keine Fotos, keine Kontaktdaten.

   Anbieter:
     anthropic           Anthropic Claude API (Standard)
     openai-kompatibel   jede API im OpenAI-Format (/chat/completions)
   HINWEIS: Modellnamen ändern sich. Scheitert eine Anfrage mit "model
   not found", in den Einstellungen den aktuellen Namen eintragen.

   NEUE KI-AUFGABE: Eintrag in SM.ki.AUFGABEN ergänzen (id, name,
   eingabeLabel, auftrag). Sie erscheint dann überall, wo der Dialog mit
   dieser id geöffnet wird (siehe js/ui/ki-dialog.js).
   NEUER ANBIETER: in SM.ki.frage() einen weiteren Zweig ergänzen.
   ===================================================================== */
(function () {
  'use strict';

  /* eingabeLabel: wie das Eingabefeld im Dialog heißt · auftrag: Anweisung an die KI */
  SM.ki.AUFGABEN = [
    { id: 'caption', name: 'Caption schreiben', eingabeLabel: 'Worum geht es? (Stichworte oder bisheriger Text)',
      auftrag: 'Schreibe eine Caption für einen Social-Media-Beitrag zu den folgenden Stichworten. Höchstens 80 Wörter, ein klarer Aufruf am Ende, keine Hashtags.' },
    { id: 'umformulieren', name: 'Umformulieren', eingabeLabel: 'Text',
      auftrag: 'Formuliere den folgenden Text neu. Inhalt und ungefähre Länge bleiben gleich.' },
    { id: 'kuerzen', name: 'Kürzen', eingabeLabel: 'Text',
      auftrag: 'Kürze den folgenden Text auf etwa die Hälfte. Der Sinn und der Aufruf am Ende bleiben erhalten.' },
    { id: 'emojis-mehr', name: 'Emojis ergänzen', eingabeLabel: 'Text',
      auftrag: 'Ergänze im folgenden Text sparsam passende Emojis (höchstens eines pro Absatz). Der Wortlaut bleibt sonst gleich.' },
    { id: 'emojis-weniger', name: 'Emojis entfernen', eingabeLabel: 'Text',
      auftrag: 'Entferne alle Emojis aus dem folgenden Text. Der Wortlaut bleibt sonst gleich.' },
    { id: 'ideen', name: '5 Post-Ideen für den Monat', eingabeLabel: 'Monat, Anlässe oder Wünsche (optional)',
      auftrag: 'Schlage genau 5 Ideen für Beiträge vor. Je Idee: eine Zeile Titel, eine Zeile, was zu sehen ist, eine Zeile Aufruf. Nummeriere die Ideen 1 bis 5. Die Ideen müssen mit einem Handy und ohne Budget umsetzbar sein.' },
    { id: 'reel', name: 'Reel-Drehbuch', eingabeLabel: 'Thema des Reels',
      auftrag: 'Schreibe ein Drehbuch für ein Reel von 15 bis 25 Sekunden. Gliederung genau so: HOOK (erster Satz/erstes Bild), SZENEN (3 bis 5, je eine Zeile), TEXT-EINBLENDUNGEN (je Szene), MUSIK-STIMMUNG (ein paar Worte, kein konkreter Songtitel), TIPP ZUM FILMEN mit dem Handy.' },
    { id: 'antwort-kommentar', name: 'Antwort auf Kommentar', eingabeLabel: 'Kommentar, auf den geantwortet wird',
      auftrag: 'Schlage zwei kurze Antworten auf den folgenden Kommentar vor (je höchstens 2 Sätze), freundlich und persönlich. Nummeriere sie 1 und 2.' },
    { id: 'antwort-bewertung', name: 'Antwort auf Bewertung', eingabeLabel: 'Bewertung (Text und Sterne)',
      auftrag: 'Schlage zwei Antworten auf die folgende Bewertung vor (je höchstens 4 Sätze). Bei Kritik: bedanken, sachlich bleiben, nichts abstreiten, ein Gespräch anbieten, keine Details über den Kunden nennen. Nummeriere sie 1 und 2.' }
  ];

  /**
   * Ist ein API-Key eingetragen?
   * @param {Object} einstellungen
   * @returns {boolean}
   */
  SM.ki.istBereit = function (einstellungen) {
    return !SM.helfer.istLeer(einstellungen.ki.apiKey);
  };

  /**
   * Baut die Anweisungen für die KI. Die Kundendaten gehen als Kontext mit.
   * @param {string} aufgabeId id aus SM.ki.AUFGABEN
   * @param {string} eingabe Text oder Stichworte
   * @param {Object|null} kunde
   * @param {string} [tonId] überschreibt den Ton des Kunden
   * @returns {{system: string, nutzer: string}}
   */
  SM.ki.bauePrompt = function (aufgabeId, eingabe, kunde, tonId) {
    var aufgabe = SM.konfig.hole(SM.ki.AUFGABEN, aufgabeId) || SM.ki.AUFGABEN[0];
    var ton = SM.konfig.hole(SM.konfig.toene, tonId || (kunde ? kunde.marke.ton : '')) || SM.konfig.toene[0];

    var system =
      'Du bist Social-Media-Redakteur für kleine lokale Betriebe in Österreich. ' +
      'Schreibe auf Deutsch (österreichisches Hochdeutsch), ' + ton.anweisung + ', in kurzen, klaren Sätzen. ' +
      'Bleib ehrlich: Erfinde keine Fakten, Zahlen, Preise, Auszeichnungen oder Garantien. ' +
      'Verwende nur, was in den Angaben steht; fehlt etwas, setze einen Platzhalter in eckigen Klammern, z. B. [Preis]. ' +
      'Keine Superlative, keine Heilversprechen, keine Werbefloskeln. ' +
      'Antworte NUR mit dem Ergebnis, ohne Einleitung und ohne Erklärung.';

    var kontext = 'Kein bestimmter Betrieb.';
    if (kunde) {
      var branche = SM.konfig.holeBranche(kunde.stamm.branche);
      kontext = [
        'Angaben zum Betrieb:',
        '- Name: ' + kunde.stamm.firmenname,
        '- Branche: ' + (branche ? branche.name : ''),
        '- Ort: ' + kunde.stamm.ort,
        '- Slogan: ' + kunde.stamm.slogan,
        '- Beschreibung: ' + kunde.stamm.beschreibung,
        '- Zielgruppe: ' + kunde.marke.zielgruppe,
        '- Leistungen: ' + kunde.leistungen.map(function (leistung) {
          return leistung.name;
        }).join(', '),
        '- Wichtig laut Strategie: ' + String(kunde.strategie.hinweise || '').replace(/\n/g, ' | ')
      ].join('\n');
    }

    var nutzer = kontext + '\n\nAuftrag: ' + aufgabe.auftrag +
      (SM.helfer.istLeer(eingabe) ? '' : '\n\nEingabe:\n' + eingabe);
    return { system: system, nutzer: nutzer };
  };

  /**
   * Schickt eine Anfrage an den eingestellten Anbieter.
   * @param {Object} einstellungen
   * @param {{system: string, nutzer: string}} prompt aus bauePrompt
   * @returns {Promise<string>} die Antwort als Text
   */
  SM.ki.frage = function (einstellungen, prompt) {
    var ki = einstellungen.ki;
    if (!SM.ki.istBereit(einstellungen)) {
      return Promise.reject(new Error('Kein API-Key eingetragen (Einstellungen → KI-Assistent).'));
    }

    var adresse;
    var anfrage;
    if (ki.anbieter === 'openai-kompatibel') {
      adresse = (ki.basisUrl || 'https://api.openai.com/v1').replace(/\/+$/, '') + '/chat/completions';
      anfrage = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + ki.apiKey },
        body: JSON.stringify({
          model: ki.modell,
          messages: [{ role: 'system', content: prompt.system }, { role: 'user', content: prompt.nutzer }]
        })
      };
    } else {
      adresse = (ki.basisUrl || 'https://api.anthropic.com').replace(/\/+$/, '') + '/v1/messages';
      anfrage = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ki.apiKey,
          'anthropic-version': '2023-06-01',
          // nötig, damit die Anthropic-API Anfragen direkt aus dem Browser annimmt
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: ki.modell,
          max_tokens: 900,
          system: prompt.system,
          messages: [{ role: 'user', content: prompt.nutzer }]
        })
      };
    }

    return fetch(adresse, anfrage)
      .catch(function () {
        throw new Error('Keine Verbindung zum KI-Anbieter (Internet? Adresse richtig?).');
      })
      .then(function (antwort) {
        return antwort.json().catch(function () {
          return {};
        }).then(function (daten) {
          if (!antwort.ok) {
            var grund = daten.error && daten.error.message ? daten.error.message : 'Fehler ' + antwort.status;
            throw new Error('KI-Anbieter meldet: ' + grund);
          }
          var ergebnis = ki.anbieter === 'openai-kompatibel'
            ? daten.choices && daten.choices[0] && daten.choices[0].message && daten.choices[0].message.content
            : daten.content && daten.content[0] && daten.content[0].text;
          if (SM.helfer.istLeer(ergebnis)) {
            throw new Error('Die KI hat keinen Text geliefert.');
          }
          return String(ergebnis).trim();
        });
      });
  };
})();
