/* =====================================================================
   geschaeft.js – Auswertungen für "Mein Geschäft" und das Dashboard
   ---------------------------------------------------------------------
   Reine Rechenfunktionen: welcher Kunde hat welches Paket, monatlicher
   Umsatz, was ist diese Woche zu tun.
   ===================================================================== */
(function () {
  'use strict';

  /**
   * Das gebuchte Paket eines Kunden.
   * @param {Object} kunde
   * @param {Object} einstellungen
   * @returns {Object|null} Paket aus einstellungen.pakete
   */
  SM.geschaeft.paketVon = function (kunde, einstellungen) {
    return SM.konfig.hole(einstellungen.pakete, kunde.paket.paketId);
  };

  /**
   * Der Monatspreis eines Kunden: eigener Preis, sonst Preis des Pakets.
   * @param {Object} kunde
   * @param {Object} einstellungen
   * @returns {number} Euro pro Monat (0, wenn kein Paket gebucht)
   */
  SM.geschaeft.preisVon = function (kunde, einstellungen) {
    if (!SM.helfer.istLeer(kunde.paket.preis)) {
      // "350 €" oder "299,50" verstehen: alles außer Ziffern, Komma und Punkt entfernen
      return Number(String(kunde.paket.preis).replace(/[^\d,.]/g, '').replace(',', '.')) || 0;
    }
    var paket = SM.geschaeft.paketVon(kunde, einstellungen);
    return paket ? Number(paket.preis) || 0 : 0;
  };

  /**
   * Übersicht: Kunde, Paket, Preis und die Summe.
   * @param {Array<Object>} kunden
   * @param {Object} einstellungen
   * @returns {{zeilen: Array<{kundeId, firmenname, paketName, preis, seit}>, summe: number}}
   */
  SM.geschaeft.umsatz = function (kunden, einstellungen) {
    var summe = 0;
    var zeilen = kunden.map(function (kunde) {
      var paket = SM.geschaeft.paketVon(kunde, einstellungen);
      var preis = SM.geschaeft.preisVon(kunde, einstellungen);
      summe += preis;
      return {
        kundeId: kunde.id,
        firmenname: kunde.stamm.firmenname || '(ohne Namen)',
        paketName: paket ? paket.name : '–',
        preis: preis,
        seit: kunde.paket.seit
      };
    });
    return { zeilen: zeilen, summe: summe };
  };

  /**
   * Was diese Woche zu tun ist: Beiträge, die in dieser Woche fällig und
   * noch nicht veröffentlicht sind, Beiträge, die auf Freigabe warten,
   * und meine eigenen offenen Aufgaben (fällig bis Sonntag oder ohne Datum).
   * @param {Array<Object>} kunden
   * @param {Object} einstellungen
   * @param {string} heute "JJJJ-MM-TT"
   * @returns {Array<{art, datum, text, kundeId, kundeName, postId, aufgabeId}>} nach Datum sortiert
   */
  SM.geschaeft.aufgabenDieserWoche = function (kunden, einstellungen, heute) {
    var montag = SM.datum.montagVon(heute);
    var sonntag = SM.datum.plusTage(montag, 6);
    var liste = [];

    kunden.forEach(function (kunde) {
      kunde.posts.forEach(function (post) {
        var status = SM.konfig.hole(SM.konfig.status, post.status);
        var inDieserWoche = post.datum >= montag && post.datum <= sonntag;
        var ueberfaellig = post.datum !== '' && post.datum < montag && post.status !== 'veroeffentlicht';
        if ((inDieserWoche || ueberfaellig) && post.status !== 'veroeffentlicht') {
          liste.push({
            art: ueberfaellig ? 'ueberfaellig' : 'post',
            datum: post.datum,
            text: (post.titel || 'Beitrag') + ' – ' + (status ? status.name : post.status),
            kundeId: kunde.id,
            kundeName: kunde.stamm.firmenname,
            postId: post.id,
            aufgabeId: ''
          });
        }
      });
    });

    einstellungen.aufgaben.forEach(function (aufgabe) {
      if (!aufgabe.erledigt && (SM.helfer.istLeer(aufgabe.faellig) || aufgabe.faellig <= sonntag)) {
        var kunde = SM.konfig.hole(kunden, aufgabe.kundeId);
        liste.push({
          art: 'aufgabe',
          datum: aufgabe.faellig || '',
          text: aufgabe.text,
          kundeId: aufgabe.kundeId || '',
          kundeName: kunde ? kunde.stamm.firmenname : '',
          postId: '',
          aufgabeId: aufgabe.id
        });
      }
    });

    return liste.sort(function (a, b) {
      return (a.datum || '9999') < (b.datum || '9999') ? -1 : 1;
    });
  };

  /**
   * Schreibt einen Euro-Betrag.
   * @param {number} betrag
   * @returns {string} z. B. "€ 249"
   */
  SM.geschaeft.formatEuro = function (betrag) {
    return '€ ' + SM.kennzahlen.format(betrag);
  };
})();
