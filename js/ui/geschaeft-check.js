/* =====================================================================
   geschaeft-check.js – Reiter "Social-Media-Check" (für mögliche Kunden)
   ---------------------------------------------------------------------
   Ich gehe das Profil eines Betriebs mit der Checkliste durch
   (js/konfig/check-punkte.js). Daraus entsteht ein kurzer, freundlicher
   Bericht mit Verbesserungsvorschlägen und meinem Angebot
   (js/dokumente/angebot.js → SM.dokumente.check).
   Die Checks liegen in einstellungen.checks.
   ===================================================================== */
(function () {
  'use strict';

  var gewaehlterCheck = '';   // id des geöffneten Checks

  /**
   * Legt einen neuen, leeren Check an.
   * @returns {Object}
   */
  function neuerCheck() {
    return {
      id: SM.helfer.neueId('check'), datum: SM.datum.heute(), betrieb: '', ort: '', branche: 'allgemein',
      link: '', punkte: {}, fazit: '', paketId: ''
    };
  }

  /**
   * Die Checkliste: pro Punkt Bewertung und Notiz, nach Gruppen.
   * @param {Object} check
   * @returns {HTMLElement[]}
   */
  function checkliste(check) {
    var el = SM.ui.dom.el;
    var kinder = [];
    var letzteGruppe = '';
    SM.konfig.checkPunkte.forEach(function (punkt) {
      if (punkt.gruppe !== letzteGruppe) {
        kinder.push(el('h3', { text: punkt.gruppe }));
        letzteGruppe = punkt.gruppe;
      }
      if (!check.punkte[punkt.id]) {
        check.punkte[punkt.id] = { wert: 'offen', notiz: '' };
      }
      var basis = { basis: 'checks.' + check.id + '.punkte.' + punkt.id, ziel: 'einstellungen' };
      kinder.push(el('div', { klasse: 'sm-check-zeile' }, [
        el('div', {}, [el('strong', { text: punkt.name }), el('br'), el('small', { klasse: 'sm-hilfe', text: punkt.frage })]),
        SM.ui.form.feld({ pfad: 'wert', label: 'Bewertung', art: 'auswahl', optionen: SM.konfig.checkWerte.map(function (wert) {
          return { wert: wert.id, name: wert.name };
        }) }, basis),
        SM.ui.form.feld({ pfad: 'notiz', label: 'Notiz (erscheint im Bericht)', art: 'text' }, basis)
      ]));
    });
    return kinder;
  }

  /**
   * Zeichnet den Reiter.
   * @param {HTMLElement} behaelter
   */
  SM.ui.geschaeft.check = function (behaelter) {
    var el = SM.ui.dom.el;
    var knopf = SM.ui.dom.knopf;
    var form = SM.ui.form;
    var einstellungen = SM.zustand.einstellungen;
    var check = SM.konfig.hole(einstellungen.checks, gewaehlterCheck);
    if (!check && einstellungen.checks.length > 0) {
      check = einstellungen.checks[einstellungen.checks.length - 1];
      gewaehlterCheck = check.id;
    }

    var auswahl = el('select', { id: 'check-auswahl', 'aria-label': 'Check wählen' }, einstellungen.checks.map(function (eintrag) {
      return el('option', { value: eintrag.id, text: SM.datum.formatTag(eintrag.datum) + ' · ' + (eintrag.betrieb || '(ohne Namen)') });
    }));
    auswahl.value = check ? check.id : '';
    auswahl.addEventListener('change', function () {
      gewaehlterCheck = auswahl.value;
      SM.ui.app.zeichneNeu();
    });

    behaelter.appendChild(el('div', { klasse: 'sm-kalender-leiste' }, [
      einstellungen.checks.length > 0 ? auswahl : el('span', { text: 'Noch kein Check angelegt.' }),
      el('span', { klasse: 'sm-luecke' }),
      knopf('Neuer Check', function () {
        var neu = neuerCheck();
        einstellungen.checks.push(neu);
        gewaehlterCheck = neu.id;
        SM.zustand.melde('einstellungen-struktur');
      }, 'sm-knopf-haupt')
    ]));
    if (!check) {
      behaelter.appendChild(form.hinweis('So geht es: Profil des Betriebs öffnen, Punkt für Punkt durchgehen, Bericht ausdrucken und persönlich vorbeibringen.'));
      return;
    }

    var ziel = { basis: 'checks.' + check.id, ziel: 'einstellungen' };
    var paketOptionen = [{ wert: '', name: '— keine Empfehlung —' }].concat(einstellungen.pakete.map(function (paket) {
      return { wert: paket.id, name: paket.name };
    }));

    behaelter.appendChild(form.gruppe('c-betrieb', 'Betrieb', [
      form.zeile([
        { pfad: 'betrieb', label: 'Name des Betriebs', art: 'text' },
        { pfad: 'ort', label: 'Ort', art: 'text' },
        { pfad: 'datum', label: 'Datum des Checks', art: 'datum', klasse: 'sm-feld-schmal' }
      ], ziel),
      form.zeile([
        { pfad: 'branche', label: 'Branche', art: 'auswahl', optionen: SM.konfig.branchen.map(function (branche) {
          return { wert: branche.id, name: branche.name };
        }) },
        { pfad: 'link', label: 'Link zum Profil (nur für mich)', art: 'url' }
      ], ziel)
    ], true));
    behaelter.appendChild(form.gruppe('c-liste', 'Checkliste', checkliste(check), true));
    behaelter.appendChild(form.gruppe('c-fazit', 'Eindruck und Empfehlung', [
      form.feld({ pfad: 'fazit', label: 'Mein Eindruck in zwei, drei Sätzen', art: 'langtext', zeilen: 4,
        hilfe: 'Freundlich und ehrlich. Keine Versprechen zu Followern oder Umsatz.' }, ziel),
      form.feld({ pfad: 'paketId', label: 'Empfohlenes Paket (wird im Bericht hervorgehoben)', art: 'auswahl', optionen: paketOptionen }, ziel),
      el('div', { klasse: 'sm-knopfreihe' }, [
        knopf('Bericht öffnen', function () {
          SM.ui.app.oeffneDokument(SM.dokumente.check(check, einstellungen), 'social-media-check-' + SM.helfer.slug(check.betrieb || 'betrieb') + '.html');
        }, 'sm-knopf-haupt'),
        knopf('Als Kunden anlegen', function () {
          var kunde = SM.datenmodell.leererKunde();
          kunde.stamm.firmenname = check.betrieb;
          kunde.stamm.ort = check.ort;
          kunde.stamm.branche = check.branche;
          kunde.paket.paketId = check.paketId;
          kunde.notizen = 'Aus Social-Media-Check vom ' + SM.datum.formatTag(check.datum) + (check.fazit ? ': ' + check.fazit : '');
          if (/instagram\.com/.test(check.link)) {
            kunde.kanaele.instagram.link = check.link;
          }
          SM.ui.app.uebernimmKunde(kunde).then(function () {
            SM.ui.app.zeige('kunden');
          });
        }, 'sm-knopf-zweit', 'Wenn der Betrieb zugesagt hat'),
        knopf('Check löschen', function () {
          if (window.confirm('Diesen Check endgültig löschen?')) {
            einstellungen.checks.splice(einstellungen.checks.indexOf(check), 1);
            gewaehlterCheck = '';
            SM.zustand.melde('einstellungen-struktur');
          }
        }, 'sm-knopf-zweit sm-knopf-gefahr')
      ])
    ], true));
  };
})();
