/* =====================================================================
   app.js – Start, Navigation, Kundenwechsel und automatisches Speichern
   ---------------------------------------------------------------------
   Jede Ansicht (js/ui/ansicht-*.js) meldet sich so an:
     SM.ui.ansichten.kalender = {
       titel: 'Kalender',
       brauchtKunde: true,                 // ohne Kunde erscheint ein Hinweis
       zeichne: function (behaelter) {…},  // baut die Ansicht komplett neu
       beiEingabe: function () {…}         // optional: nach jedem Tastendruck
     };
   NEUE ANSICHT: Datei anlegen, in js/ladeliste.js eintragen und unten in
   SM.ui.NAVIGATION ergänzen.

   Was wo gemerkt wird:
     SM.zustand.kunde / .einstellungen   die Daten (js/kern/zustand.js)
     SM.ui.status                        nur Oberfläche: welche Ansicht,
                                         welcher Post, welcher Monat …
   Speichern: jede Änderung meldet sich über SM.zustand.melde(); hier
   wird dann (leicht verzögert) in IndexedDB gespeichert.
   ===================================================================== */
(function () {
  'use strict';

  SM.ui.ansichten = {};
  SM.ui.app = {};

  /* Reihenfolge und Namen der Navigation (links) */
  SM.ui.NAVIGATION = ['dashboard', 'kunden', 'strategie', 'kalender', 'post', 'texte', 'reels', 'freigabe', 'berichte', 'geschaeft', 'einstellungen'];

  /* Zustand der Oberfläche (wird nicht gespeichert) */
  SM.ui.status = {
    ansicht: 'dashboard',
    postId: '',                // im Post-Editor geöffneter Beitrag
    folienIndex: 0,            // gewählte Folie im Post-Editor
    monat: '',                 // "JJJJ-MM" in Kalender, Freigabe, Berichte
    kalenderModus: 'monat',    // 'monat' | 'woche'
    woche: '',                 // Montag der gezeigten Woche
    geschaeftTab: 'uebersicht',
    reelBranche: ''
  };

  SM.ui.app.kunden = [];       // Kurzliste aller Kunden: [{id, name}]

  /**
   * Zeigt den Speicher-Zustand unten in der Seitenleiste.
   * @param {string} text
   * @param {boolean} [fehler] true = rot hervorheben
   */
  function zeigeStatus(text, fehler) {
    var anzeige = document.getElementById('speicher-status');
    anzeige.textContent = text;
    anzeige.classList.toggle('sm-status-fehler', !!fehler);
  }

  /**
   * Speichert den aktuellen Kunden sofort.
   * @returns {Promise}
   */
  SM.ui.app.speichereJetzt = function () {
    if (!SM.zustand.kunde) {
      return Promise.resolve();
    }
    return SM.speicher.speichereKunde(SM.zustand.kunde).then(function () {
      zeigeStatus('Gespeichert um ' + new Date().toLocaleTimeString('de-AT', { hour: '2-digit', minute: '2-digit' }));
    }).catch(function (fehler) {
      zeigeStatus('Speichern fehlgeschlagen!', true);
      SM.ui.dom.meldung('Speichern fehlgeschlagen: ' + fehler.message + ' – bitte die Kundendatei herunterladen (Kunden → Sichern).', 'fehler');
    });
  };

  /**
   * Speichert die Einstellungen sofort.
   * @returns {Promise}
   */
  SM.ui.app.speichereEinstellungen = function () {
    return SM.speicher.speichereEinstellungen(SM.zustand.einstellungen).catch(function (fehler) {
      SM.ui.dom.meldung('Einstellungen konnten nicht gespeichert werden: ' + fehler.message, 'fehler');
    });
  };

  var speichereBald = SM.helfer.entprelle(SM.ui.app.speichereJetzt, 600);
  var speichereEinstellungenBald = SM.helfer.entprelle(SM.ui.app.speichereEinstellungen, 600);

  /**
   * Liest die Kurzliste aller Kunden neu und füllt die Kunden-Auswahl.
   * @returns {Promise<Array<Object>>} alle Kunden (vollständig)
   */
  SM.ui.app.ladeKundenListe = function () {
    return SM.ui.app.alleKunden().then(function (alle) {
      SM.ui.app.kunden = alle.map(function (kunde) {
        return { id: kunde.id, name: kunde.stamm.firmenname || '(ohne Namen)' };
      });
      var auswahl = document.getElementById('kunden-auswahl');
      SM.ui.dom.leere(auswahl);
      if (SM.ui.app.kunden.length === 0) {
        auswahl.appendChild(SM.ui.dom.el('option', { value: '', text: '— noch kein Kunde —' }));
      }
      SM.ui.app.kunden.forEach(function (eintrag) {
        auswahl.appendChild(SM.ui.dom.el('option', { value: eintrag.id, text: eintrag.name }));
      });
      auswahl.value = SM.zustand.kunde ? SM.zustand.kunde.id : '';
      return alle;
    });
  };

  /**
   * Alle Kunden vollständig. Der gerade geöffnete Kunde kommt aus dem
   * Arbeitsspeicher (dort stehen die neuesten Änderungen).
   * @returns {Promise<Array<Object>>}
   */
  SM.ui.app.alleKunden = function () {
    return SM.speicher.ladeAlleKunden().then(function (alle) {
      var aktuell = SM.zustand.kunde;
      return alle.map(function (kunde) {
        return aktuell && kunde.id === aktuell.id ? aktuell : kunde;
      });
    });
  };

  /**
   * Wechselt zu einem anderen Kunden (speichert vorher den aktuellen).
   * @param {string} id
   * @returns {Promise}
   */
  SM.ui.app.waehleKunde = function (id) {
    return SM.ui.app.speichereJetzt().then(function () {
      return SM.speicher.ladeKunde(id);
    }).then(function (kunde) {
      if (!kunde) {
        SM.ui.dom.meldung('Dieser Kunde wurde nicht gefunden.', 'fehler');
        return null;
      }
      SM.ui.status.postId = '';
      SM.ui.status.folienIndex = 0;
      SM.zustand.einstellungen.letzterKundeId = kunde.id;
      SM.ui.app.speichereEinstellungen();
      SM.zustand.setzeKunde(kunde);
      return SM.ui.app.ladeKundenListe();
    });
  };

  /**
   * Nimmt einen neuen (oder importierten) Kunden auf, speichert ihn und
   * öffnet ihn.
   * @param {Object} kunde
   * @returns {Promise}
   */
  SM.ui.app.uebernimmKunde = function (kunde) {
    return SM.ui.app.speichereJetzt().then(function () {
      return SM.speicher.speichereKunde(kunde);
    }).then(function () {
      return SM.ui.app.waehleKunde(kunde.id);
    });
  };

  /**
   * Öffnet ein druckbares Dokument in einem neuen Tab. Blockiert der
   * Browser das Fenster, wird die Datei stattdessen heruntergeladen.
   * @param {string} html vollständiges HTML-Dokument (js/dokumente/*.js)
   * @param {string} dateiname z. B. "freigabe-2026-11.html"
   */
  SM.ui.app.oeffneDokument = function (html, dateiname) {
    var url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    var fenster = window.open(url, '_blank');
    if (!fenster) {
      SM.helfer.ladeHerunter(dateiname, html, 'text/html');
      SM.ui.dom.meldung('Der Browser hat das neue Fenster blockiert – das Dokument wurde heruntergeladen. Öffnen und drucken.', 'info');
    }
  };

  /**
   * Lässt mich eine Datei auswählen und liefert ihren Text.
   * @param {string} endungen z. B. ".json"
   * @returns {Promise<string>} Inhalt der gewählten Datei
   */
  SM.ui.app.waehleDatei = function (endungen) {
    return new Promise(function (erfolg) {
      var eingabe = SM.ui.dom.el('input', { type: 'file', accept: endungen });
      eingabe.addEventListener('change', function () {
        if (eingabe.files[0]) {
          eingabe.files[0].text().then(erfolg);
        }
      });
      eingabe.click();
    });
  };

  /**
   * Öffnet einen Beitrag im Post-Editor (wechselt bei Bedarf den Kunden).
   * @param {string} postId
   * @param {string} [kundeId] ohne Angabe: aktueller Kunde
   */
  SM.ui.app.oeffnePost = function (postId, kundeId) {
    var wechsel = kundeId && (!SM.zustand.kunde || SM.zustand.kunde.id !== kundeId)
      ? SM.ui.app.waehleKunde(kundeId)
      : Promise.resolve();
    wechsel.then(function () {
      SM.ui.status.postId = postId;
      SM.ui.status.folienIndex = 0;
      SM.ui.app.zeige('post');
    });
  };

  /**
   * Baut die aktuelle Ansicht neu auf (die Scroll-Position bleibt).
   */
  SM.ui.app.zeichneNeu = function () {
    var el = SM.ui.dom.el;
    var behaelter = document.getElementById('ansicht');
    var ansicht = SM.ui.ansichten[SM.ui.status.ansicht];
    var scroll = behaelter.scrollTop;
    SM.ui.dom.leere(behaelter);
    document.getElementById('ansicht-titel').textContent = ansicht.titel;
    document.getElementById('kunde-anzeige').textContent =
      ansicht.brauchtKunde && SM.zustand.kunde ? SM.zustand.kunde.stamm.firmenname : '';

    if (ansicht.brauchtKunde && !SM.zustand.kunde) {
      behaelter.appendChild(el('div', { klasse: 'sm-karte' }, [
        el('p', { text: 'Für diesen Bereich brauchst du einen Kunden.' }),
        SM.ui.dom.knopf('Zur Kundenverwaltung', function () {
          SM.ui.app.zeige('kunden');
        }, 'sm-knopf-haupt')
      ]));
    } else {
      ansicht.zeichne(behaelter);
    }
    behaelter.scrollTop = scroll;
  };

  /**
   * Wechselt die Ansicht.
   * @param {string} id Schlüssel aus SM.ui.ansichten
   */
  SM.ui.app.zeige = function (id) {
    SM.ui.status.ansicht = id;
    document.querySelectorAll('#navigation button').forEach(function (knopf) {
      var aktiv = knopf.dataset.ansicht === id;
      knopf.classList.toggle('sm-nav-aktiv', aktiv);
      if (aktiv) {
        knopf.setAttribute('aria-current', 'page');
      } else {
        knopf.removeAttribute('aria-current');
      }
    });
    document.getElementById('ansicht').scrollTop = 0;
    SM.ui.app.zeichneNeu();
  };

  /**
   * Reagiert auf Änderungen an den Daten (siehe js/kern/zustand.js).
   * @param {string} quelle
   */
  function beiAenderung(quelle) {
    var ansicht = SM.ui.ansichten[SM.ui.status.ansicht];
    if (quelle === 'eingabe') {
      zeigeStatus('Speichert …');
      speichereBald();
      if (ansicht && ansicht.beiEingabe) {
        ansicht.beiEingabe();
      }
    } else if (quelle === 'struktur') {
      zeigeStatus('Speichert …');
      speichereBald();
      SM.ui.app.zeichneNeu();
    } else if (quelle === 'laden') {
      SM.ui.app.zeichneNeu();
    } else if (quelle === 'einstellungen') {
      speichereEinstellungenBald();
    } else if (quelle === 'einstellungen-struktur') {
      speichereEinstellungenBald();
      SM.ui.app.zeichneNeu();
    }
  }

  /**
   * Baut die Navigation in der Seitenleiste.
   */
  function baueNavigation() {
    var leiste = document.getElementById('navigation');
    SM.ui.NAVIGATION.forEach(function (id) {
      var knopf = SM.ui.dom.el('button', { type: 'button', 'data-ansicht': id, text: SM.ui.ansichten[id].titel });
      knopf.addEventListener('click', function () {
        SM.ui.app.zeige(id);
      });
      leiste.appendChild(knopf);
    });
  }

  /**
   * Startet das Werkzeug: Einstellungen laden, letzten Kunden öffnen
   * (beim allerersten Start den Beispielkunden anlegen).
   */
  SM.ui.app.starte = function () {
    var heute = SM.datum.heute();
    SM.ui.status.monat = SM.datum.monatVon(heute);
    SM.ui.status.woche = SM.datum.montagVon(heute);
    document.getElementById('version').textContent = 'Version ' + SM.VERSION;
    baueNavigation();
    SM.zustand.abonniere(beiAenderung);

    document.getElementById('kunden-auswahl').addEventListener('change', function (ereignis) {
      if (ereignis.target.value) {
        SM.ui.app.waehleKunde(ereignis.target.value);
      }
    });

    // Vor dem Schließen des Fensters noch einmal speichern
    window.addEventListener('beforeunload', function () {
      if (SM.zustand.kunde) {
        SM.speicher.speichereKunde(SM.zustand.kunde);
      }
      SM.speicher.speichereEinstellungen(SM.zustand.einstellungen);
    });

    SM.speicher.ladeEinstellungen().then(function (einstellungen) {
      SM.zustand.einstellungen = einstellungen;
      return SM.speicher.ladeAlleKunden();
    }).then(function (alle) {
      if (alle.length === 0) {
        // Allererster Start: Beispielkunde, damit man sofort etwas sieht
        var beispiel = SM.konfig.beispielKunde();
        return SM.speicher.speichereKunde(beispiel).then(function () {
          SM.ui.dom.meldung('Willkommen! Der Beispielkunde „Café Muster" ist angelegt. Deine eigenen Daten trägst du unter „Mein Geschäft" ein.', 'info');
          return beispiel.id;
        });
      }
      var letzter = SM.zustand.einstellungen.letzterKundeId;
      var gibtEs = alle.some(function (kunde) {
        return kunde.id === letzter;
      });
      return gibtEs ? letzter : alle[0].id;
    }).then(function (id) {
      return SM.speicher.ladeKunde(id);
    }).then(function (kunde) {
      SM.zustand.kunde = kunde;
      return SM.ui.app.ladeKundenListe();
    }).then(function () {
      SM.ui.app.zeige('dashboard');
      zeigeStatus('Bereit');
    }).catch(function (fehler) {
      console.error(fehler);
      zeigeStatus('Start fehlgeschlagen', true);
      SM.ui.dom.meldung('Start fehlgeschlagen: ' + fehler.message, 'fehler');
    });
  };
})();
