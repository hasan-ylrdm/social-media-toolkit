/* =====================================================================
   speicher.js – dauerhaftes Speichern im Browser (IndexedDB)
   ---------------------------------------------------------------------
   Warum IndexedDB und nicht localStorage? Kunden enthalten Bilder und
   werden mehrere MB groß – localStorage fasst nur ca. 5 MB insgesamt.

   Datenbank "social-media-toolkit" mit zwei Lagern (object stores):
     kunden         Schlüssel = kunde.id     (ganze Kunden inkl. Bilder)
     einstellungen  ein Eintrag "haupt"      (Meine Daten, Pakete, KI-Key,
                                              Checks, Angebote, Aufgaben)

   Alle Funktionen geben ein Promise zurück.
   ===================================================================== */
(function () {
  'use strict';

  var DB_NAME = 'social-media-toolkit';
  var DB_VERSION = 1;
  var dbVersprechen = null;

  /**
   * Öffnet die Datenbank (einmalig) und legt beim ersten Mal die Lager an.
   * @returns {Promise<IDBDatabase>}
   */
  function oeffne() {
    if (dbVersprechen) {
      return dbVersprechen;
    }
    dbVersprechen = new Promise(function (erfolg, fehler) {
      var anfrage = indexedDB.open(DB_NAME, DB_VERSION);
      anfrage.onupgradeneeded = function () {
        var db = anfrage.result;
        if (!db.objectStoreNames.contains('kunden')) {
          db.createObjectStore('kunden', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('einstellungen')) {
          db.createObjectStore('einstellungen');
        }
      };
      anfrage.onsuccess = function () {
        erfolg(anfrage.result);
      };
      anfrage.onerror = function () {
        dbVersprechen = null;
        fehler(new Error('Browser-Speicher (IndexedDB) nicht verfügbar: ' + anfrage.error));
      };
    });
    return dbVersprechen;
  }

  /**
   * Führt eine einzelne Aktion in einem Lager aus.
   * @param {string} lager Name des Lagers
   * @param {string} modus 'readonly' oder 'readwrite'
   * @param {Function} aktion erhält das Lager und gibt eine IDB-Anfrage zurück
   * @returns {Promise<*>} Ergebnis der Anfrage
   */
  function fuehreAus(lager, modus, aktion) {
    return oeffne().then(function (db) {
      return new Promise(function (erfolg, fehler) {
        var transaktion = db.transaction(lager, modus);
        var anfrage = aktion(transaktion.objectStore(lager));
        transaktion.oncomplete = function () {
          erfolg(anfrage.result);
        };
        transaktion.onerror = function () {
          fehler(transaktion.error);
        };
        transaktion.onabort = function () {
          fehler(transaktion.error || new Error('Speichern abgebrochen (Speicher voll?)'));
        };
      });
    });
  }

  /**
   * Speichert einen Kunden (überschreibt einen vorhandenen mit gleicher id).
   * @param {Object} kunde
   * @returns {Promise}
   */
  SM.speicher.speichereKunde = function (kunde) {
    return fuehreAus('kunden', 'readwrite', function (lager) {
      return lager.put(kunde);
    });
  };

  /**
   * Lädt einen Kunden und bringt ihn auf das aktuelle Format.
   * @param {string} id
   * @returns {Promise<Object|null>} Kunde oder null, wenn nicht vorhanden
   */
  SM.speicher.ladeKunde = function (id) {
    return fuehreAus('kunden', 'readonly', function (lager) {
      return lager.get(id);
    }).then(function (roh) {
      return roh ? SM.migration.migriere(roh) : null;
    });
  };

  /**
   * Löscht einen Kunden.
   * @param {string} id
   * @returns {Promise}
   */
  SM.speicher.loescheKunde = function (id) {
    return fuehreAus('kunden', 'readwrite', function (lager) {
      return lager.delete(id);
    });
  };

  /**
   * Lädt ALLE Kunden vollständig (migriert), nach Firmenname sortiert.
   * Wird für Dashboard, Umsatz-Übersicht und die Gesamt-Sicherung gebraucht.
   * @returns {Promise<Array<Object>>}
   */
  SM.speicher.ladeAlleKunden = function () {
    return fuehreAus('kunden', 'readonly', function (lager) {
      return lager.getAll();
    }).then(function (alle) {
      return alle.map(SM.migration.migriere).sort(function (a, b) {
        return a.stamm.firmenname.localeCompare(b.stamm.firmenname, 'de');
      });
    });
  };

  /**
   * Lädt die Einstellungen (oder Standardwerte beim ersten Start).
   * @returns {Promise<Object>}
   */
  SM.speicher.ladeEinstellungen = function () {
    return fuehreAus('einstellungen', 'readonly', function (lager) {
      return lager.get('haupt');
    }).then(function (roh) {
      return SM.migration.migriereEinstellungen(roh || null);
    });
  };

  /**
   * Speichert die Einstellungen.
   * @param {Object} einstellungen
   * @returns {Promise}
   */
  SM.speicher.speichereEinstellungen = function (einstellungen) {
    return fuehreAus('einstellungen', 'readwrite', function (lager) {
      return lager.put(einstellungen, 'haupt');
    });
  };
})();
