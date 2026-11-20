/* =====================================================================
   migration.js – hält ALTE Kundendateien ladbar
   ---------------------------------------------------------------------
   Jeder Kunde trägt "formatVersion". Beim Laden (aus IndexedDB oder aus
   einer .json-Datei) läuft IMMER SM.migration.migriere():

     1. Schritte aus "schritte" der Reihe nach (0 → 1 → 2 → …)
     2. Fehlende Felder werden aus leererKunde() ergänzt
     3. Kleine Reparaturen (fehlende ids, 7 Wochentage, vollständige
        Posts und Folien)

   NEUES FELD:  nur in datenmodell.js eintragen – Punkt 2 und 3 erledigen
                den Rest.
   UMBAU (Feld umbenannt, Struktur geändert):
     a) SM.FORMAT_VERSION in namespace.js um 1 erhöhen
     b) unten einen Schritt {von, nach, ausfuehren} ergänzen
     c) in tests/tests-kern.js einen Test mit einer alten Datei ergänzen
   ===================================================================== */
(function () {
  'use strict';

  /**
   * Liste aller Umbau-Schritte. MUSTER für neue Schritte:
   *
   *   {
   *     von: 1,
   *     nach: 2,
   *     beschreibung: 'stamm.telefon heißt jetzt stamm.telefonnummer',
   *     ausfuehren: function (kunde) {
   *       kunde.stamm.telefonnummer = kunde.stamm.telefon || '';
   *       delete kunde.stamm.telefon;
   *       return kunde;
   *     }
   *   }
   */
  SM.migration.schritte = [
    {
      von: 0,
      nach: 1,
      beschreibung: 'Vorab-Format ohne formatVersion: Hashtags eines Posts waren eine ' +
        'Liste und werden zu einem Text; "kanal" (ein Text) wird zu "kanaele" (Liste).',
      ausfuehren: function (kunde) {
        (kunde.posts || []).forEach(function (post) {
          if (Array.isArray(post.hashtags)) {
            post.hashtags = post.hashtags.join(' ');
          }
          if (typeof post.kanal === 'string') {
            post.kanaele = [post.kanal];
            delete post.kanal;
          }
        });
        return kunde;
      }
    }
  ];

  /**
   * Ergänzt im Ziel alle Felder, die in der Vorlage vorhanden sind, im Ziel
   * aber fehlen. Vorhandene Werte werden NIE überschrieben. Listen (Arrays)
   * werden nicht zusammengeführt.
   * @param {Object} ziel wird verändert
   * @param {Object} vorlage z. B. leererKunde()
   * @returns {Object} das Ziel
   */
  SM.migration.ergaenzeFehlende = function (ziel, vorlage) {
    Object.keys(vorlage).forEach(function (schluessel) {
      var vorlageWert = vorlage[schluessel];
      var zielWert = ziel[schluessel];

      if (zielWert === undefined || zielWert === null) {
        ziel[schluessel] = SM.helfer.kopiere(vorlageWert);
        return;
      }

      var beideObjekte =
        typeof vorlageWert === 'object' && vorlageWert !== null && !Array.isArray(vorlageWert) &&
        typeof zielWert === 'object' && !Array.isArray(zielWert);

      if (beideObjekte) {
        SM.migration.ergaenzeFehlende(zielWert, vorlageWert);
      }
    });
    return ziel;
  };

  /**
   * Kleine Reparaturen, damit sich die Oberfläche auf die Daten verlassen
   * kann: jede Liste ist eine Liste, jeder Eintrag hat eine id, es gibt
   * genau 7 Wochentage, jeder Post und jede Folie hat alle Felder.
   * @param {Object} kunde wird verändert
   */
  function repariere(kunde) {
    var listen = ['leistungen', 'bilder', 'events', 'posts', 'hashtagSets', 'berichte'];
    listen.forEach(function (name) {
      if (!Array.isArray(kunde[name])) {
        kunde[name] = [];
      }
      kunde[name].forEach(function (eintrag) {
        if (!eintrag.id) {
          eintrag.id = SM.helfer.neueId(name);
        }
      });
    });

    if (!Array.isArray(kunde.strategie.saeulen)) {
      kunde.strategie.saeulen = [];
    }
    kunde.strategie.saeulen.forEach(function (saeule) {
      if (!saeule.id) {
        saeule.id = SM.helfer.neueId('saeule');
      }
      if (!Array.isArray(saeule.beitragsarten)) {
        saeule.beitragsarten = [];
      }
    });

    var tage = kunde.oeffnungszeiten.tage;
    if (!Array.isArray(tage) || tage.length !== 7) {
      kunde.oeffnungszeiten.tage = SM.datenmodell.standardTage();
    }

    kunde.posts.forEach(function (post) {
      var postId = post.id;
      SM.migration.ergaenzeFehlende(post, SM.datenmodell.leererPost(''));
      post.id = postId;
      if (!Array.isArray(post.folien) || post.folien.length === 0) {
        post.folien = [SM.datenmodell.leereFolie()];
      }
      post.folien.forEach(function (folie) {
        var folienId = folie.id;
        SM.migration.ergaenzeFehlende(folie, SM.datenmodell.leereFolie());
        if (folienId) {
          folie.id = folienId;
        }
      });
    });

    kunde.berichte.forEach(function (bericht) {
      SM.migration.ergaenzeFehlende(bericht, SM.datenmodell.leererBericht(bericht.monat || ''));
    });
  }

  /**
   * Bringt einen geladenen Kunden auf das aktuelle Format.
   * @param {Object} roh Kunde, wie er gespeichert wurde (wird nicht verändert)
   * @returns {Object} Kunde im aktuellen Format
   * @throws {Error} wenn die Datei aus einer NEUEREN Werkzeug-Version stammt
   */
  SM.migration.migriere = function (roh) {
    if (!roh || typeof roh !== 'object') {
      throw new Error('Das ist kein gültiger Kunde.');
    }

    var kunde = SM.helfer.kopiere(roh);
    var version = Number(kunde.formatVersion) || 0;

    if (version > SM.FORMAT_VERSION) {
      throw new Error(
        'Dieser Kunde wurde mit einer neueren Version des Toolkits gespeichert ' +
        '(Format ' + version + ', dieses Werkzeug kennt nur Format ' + SM.FORMAT_VERSION + ').'
      );
    }

    while (version < SM.FORMAT_VERSION) {
      var schritt = null;
      for (var i = 0; i < SM.migration.schritte.length; i += 1) {
        if (SM.migration.schritte[i].von === version) {
          schritt = SM.migration.schritte[i];
        }
      }
      if (!schritt) {
        throw new Error('Für Format ' + version + ' fehlt ein Migrations-Schritt.');
      }
      kunde = schritt.ausfuehren(kunde);
      version = schritt.nach;
    }

    kunde.formatVersion = SM.FORMAT_VERSION;
    var vorlage = SM.datenmodell.leererKunde();
    var eigeneId = kunde.id;
    SM.migration.ergaenzeFehlende(kunde, vorlage);
    if (eigeneId) {
      kunde.id = eigeneId;
    }
    repariere(kunde);
    return kunde;
  };

  /**
   * Bringt geladene Einstellungen auf den aktuellen Stand
   * (fehlende Felder ergänzen).
   * @param {Object|null} roh
   * @returns {Object}
   */
  SM.migration.migriereEinstellungen = function (roh) {
    var einstellungen = roh ? SM.helfer.kopiere(roh) : {};
    SM.migration.ergaenzeFehlende(einstellungen, SM.datenmodell.standardEinstellungen());
    return einstellungen;
  };
})();
