/* =====================================================================
   baukasten-import.js – Daten aus dem Website-Baukasten übernehmen
   ---------------------------------------------------------------------
   Der Website-Baukasten speichert Kunden als "*.projekt.json". Diese
   Datei liest so ein Projekt und macht daraus einen Toolkit-Kunden
   (oder ergänzt einen vorhandenen Kunden).

   ZUORDNUNG (Baukasten → Toolkit):
     betrieb.firmenname, slogan, branche, beschreibung,
       strasse, plz, ort, land, telefon, email      → stamm.<gleicher Name>
     seo.domain                                     → stamm.website
     recht.inhaber                                  → ansprechperson.name
     oeffnungszeiten {hinweis, tage[7]}             → oeffnungszeiten (gleich)
     leistungen [{id, name, beschreibung, preis}]   → leistungen (gleich, ohne bildId)
     design.farben.primaer/akzent/hintergrund/text  → marke.farben.<gleicher Name>
     design.schriftpaar                             → marke.schriftpaar
     bilder [{…, bereich}]                          → bilder; bereich "logo" bleibt
                                                      "logo", alles andere wird "foto"
     social.instagram/facebook/tiktok/google        → kanaele.<name>.link (+ aktiv)

   Nicht übernommen wird alles, was nur die Website betrifft (Abschnitte,
   Struktur, SEO-Texte, Impressum-Angaben, Team, Bewertungen).
   Ändert sich das Format des Baukastens, muss nur diese Datei angepasst
   werden (und der Test "Baukasten-Import" in tests/tests-kern.js).
   ===================================================================== */
(function () {
  'use strict';

  SM.baukastenImport.ART = 'website-baukasten-projekt';

  /**
   * Liest den Text einer Baukasten-Projektdatei.
   * @param {string} text JSON-Text (mit oder ohne Umschlag)
   * @returns {Object} das rohe Baukasten-Projekt
   * @throws {Error} wenn die Datei kein Baukasten-Projekt ist
   */
  SM.baukastenImport.lies = function (text) {
    var daten;
    try {
      daten = JSON.parse(text);
    } catch (fehler) {
      throw new Error('Die Datei ist kein lesbares JSON.');
    }
    var projekt = daten && daten.art === SM.baukastenImport.ART ? daten.projekt : daten;
    if (!projekt || typeof projekt !== 'object' || !projekt.betrieb) {
      throw new Error('Die Datei ist kein Projekt aus dem Website-Baukasten (Feld "betrieb" fehlt).');
    }
    return projekt;
  };

  /**
   * Übernimmt Text-Felder, aber nur solche mit Inhalt (leere Werte der
   * Quelle überschreiben nichts).
   * @param {Object} ziel wird verändert
   * @param {Object} quelle
   * @param {string[]} namen Feldnamen, die in beiden gleich heißen
   */
  function uebernimmFelder(ziel, quelle, namen) {
    namen.forEach(function (name) {
      if (quelle && !SM.helfer.istLeer(quelle[name])) {
        ziel[name] = quelle[name];
      }
    });
  }

  /**
   * Überträgt die Daten eines Baukasten-Projekts in einen Kunden.
   * Vorhandene Posts, Strategie und Berichte bleiben unberührt.
   * Fotos, die es (gleiche id) schon gibt, werden nicht doppelt angelegt.
   * @param {Object} kunde wird verändert
   * @param {Object} projekt rohes Baukasten-Projekt
   * @returns {Object} der Kunde
   */
  SM.baukastenImport.uebernehmeIn = function (kunde, projekt) {
    var betrieb = projekt.betrieb || {};
    uebernimmFelder(kunde.stamm, betrieb,
      ['firmenname', 'slogan', 'beschreibung', 'strasse', 'plz', 'ort', 'land', 'telefon', 'email']);

    if (SM.konfig.holeBranche(betrieb.branche)) {
      kunde.stamm.branche = betrieb.branche;
    }
    if (projekt.seo && !SM.helfer.istLeer(projekt.seo.domain)) {
      kunde.stamm.website = projekt.seo.domain;
    }
    if (projekt.recht && !SM.helfer.istLeer(projekt.recht.inhaber) && SM.helfer.istLeer(kunde.ansprechperson.name)) {
      kunde.ansprechperson.name = projekt.recht.inhaber;
    }

    // Öffnungszeiten: altes Baukasten-Format (reine Liste) und neues ({hinweis, tage})
    var zeiten = projekt.oeffnungszeiten;
    var tage = Array.isArray(zeiten) ? zeiten : (zeiten && zeiten.tage);
    if (Array.isArray(tage) && tage.length === 7) {
      kunde.oeffnungszeiten.tage = SM.helfer.kopiere(tage);
      kunde.oeffnungszeiten.hinweis = (zeiten && zeiten.hinweis) || '';
    }

    if (Array.isArray(projekt.leistungen) && projekt.leistungen.length > 0) {
      kunde.leistungen = projekt.leistungen.map(function (leistung) {
        return {
          id: leistung.id || SM.helfer.neueId('leistung'),
          name: leistung.name || '',
          beschreibung: leistung.beschreibung || '',
          preis: leistung.preis || ''
        };
      });
    }

    var design = projekt.design || {};
    uebernimmFelder(kunde.marke.farben, design.farben, ['primaer', 'akzent', 'hintergrund', 'text']);
    if (SM.konfig.holeSchrift(design.schriftpaar)) {
      kunde.marke.schriftpaar = design.schriftpaar;
    }

    (projekt.bilder || []).forEach(function (bild) {
      var schonDa = kunde.bilder.some(function (vorhanden) {
        return vorhanden.id === bild.id;
      });
      if (!schonDa && bild.dataUrl) {
        kunde.bilder.push({
          id: bild.id || SM.helfer.neueId('bild'),
          name: bild.name || '',
          dataUrl: bild.dataUrl,
          breite: bild.breite || 0,
          hoehe: bild.hoehe || 0,
          bytes: bild.bytes || 0,
          alt: bild.alt || '',
          bereich: bild.bereich === 'logo' ? 'logo' : 'foto'
        });
      }
    });

    var social = projekt.social || {};
    ['instagram', 'facebook', 'tiktok', 'google'].forEach(function (kanal) {
      if (!SM.helfer.istLeer(social[kanal])) {
        kunde.kanaele[kanal].link = social[kanal];
        kunde.kanaele[kanal].aktiv = true;
      }
    });

    return kunde;
  };

  /**
   * Erzeugt aus dem Text einer Baukasten-Projektdatei einen neuen Kunden.
   * @param {string} text JSON-Text
   * @returns {Object} neuer Kunde im aktuellen Format
   */
  SM.baukastenImport.neuerKunde = function (text) {
    var projekt = SM.baukastenImport.lies(text);
    return SM.baukastenImport.uebernehmeIn(SM.datenmodell.leererKunde(), projekt);
  };
})();
