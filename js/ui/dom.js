/* =====================================================================
   dom.js – kleine Helfer zum Bauen der Oberfläche
   ---------------------------------------------------------------------
   Die Oberfläche wird OHNE Framework gebaut. Statt HTML-Texte
   zusammenzukleben, erzeugt el() echte Elemente – das ist sicher gegen
   kaputtes HTML und Ereignisse lassen sich direkt anhängen.

   Beispiel:
     var el = SM.ui.dom.el;
     el('button', { klasse: 'sm-knopf', type: 'button', onclick: speichere }, ['Speichern'])
   ===================================================================== */
(function () {
  'use strict';

  SM.ui.dom = {};

  /**
   * Erzeugt ein HTML-Element.
   * @param {string} tag z. B. "div"
   * @param {Object} [attribute] Sonderfälle:
   *   klasse → CSS-Klasse(n) · text → Textinhalt · on… → Ereignis (z. B. onclick)
   *   Wert true → Attribut ohne Wert · Wert false/null/undefined → Attribut weglassen
   * @param {Array<Node|string>} [kinder] Kind-Elemente oder Texte
   * @returns {HTMLElement}
   */
  SM.ui.dom.el = function (tag, attribute, kinder) {
    var element = document.createElement(tag);

    Object.keys(attribute || {}).forEach(function (name) {
      var wert = attribute[name];
      if (wert === false || wert === null || wert === undefined) {
        return;
      }
      if (name === 'klasse') {
        element.className = wert;
      } else if (name === 'text') {
        element.textContent = wert;
      } else if (name.indexOf('on') === 0 && typeof wert === 'function') {
        element.addEventListener(name.slice(2), wert);
      } else if (wert === true) {
        element.setAttribute(name, '');
      } else {
        element.setAttribute(name, wert);
      }
    });

    (kinder || []).forEach(function (kind) {
      if (kind === null || kind === undefined || kind === false) {
        return;
      }
      element.appendChild(typeof kind === 'string' ? document.createTextNode(kind) : kind);
    });
    return element;
  };

  /**
   * Entfernt alle Kinder eines Elements.
   * @param {HTMLElement} element
   */
  SM.ui.dom.leere = function (element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  };

  /**
   * Erzeugt einen Button.
   * @param {string} text Beschriftung
   * @param {Function} beiKlick
   * @param {string} [klasse] zusätzliche CSS-Klasse, z. B. "sm-knopf-haupt"
   * @param {string} [titel] Erklärung (Tooltip und Screenreader)
   * @returns {HTMLButtonElement}
   */
  SM.ui.dom.knopf = function (text, beiKlick, klasse, titel) {
    return SM.ui.dom.el('button', {
      type: 'button',
      klasse: 'sm-knopf' + (klasse ? ' ' + klasse : ''),
      onclick: beiKlick,
      title: titel,
      'aria-label': titel
    }, [text]);
  };

  /**
   * Zeigt unten rechts kurz eine Meldung an.
   * @param {string} text
   * @param {string} [art] "ok" (Standard), "fehler" oder "info"
   */
  SM.ui.dom.meldung = function (text, art) {
    var bereich = document.getElementById('meldungen');
    var kasten = SM.ui.dom.el('div', { klasse: 'sm-meldung sm-meldung-' + (art || 'ok'), text: text });
    bereich.appendChild(kasten);
    setTimeout(function () {
      kasten.remove();
    }, art === 'fehler' ? 8000 : 4000);
  };

  /**
   * Kopiert Text in die Zwischenablage und zeigt eine kurze Meldung.
   * (Über ein unsichtbares Textfeld – das funktioniert auch bei
   * Doppelklick-Start über file://, wo navigator.clipboard fehlen kann.)
   * @param {string} text
   */
  SM.ui.dom.kopiere = function (text) {
    var feld = SM.ui.dom.el('textarea', { klasse: 'sm-versteckt', 'aria-hidden': 'true' });
    feld.value = text;
    // In einem offenen Dialog einhängen, sonst bekommt das Feld dort keinen Fokus
    (document.querySelector('dialog[open]') || document.body).appendChild(feld);
    feld.select();
    var erfolg = document.execCommand('copy');
    feld.remove();
    SM.ui.dom.meldung(erfolg ? 'In die Zwischenablage kopiert.' : 'Kopieren hat nicht geklappt – bitte Text markieren und Strg+C drücken.', erfolg ? 'ok' : 'fehler');
  };

  /**
   * Öffnet ein Dialogfenster (schließt mit Esc oder dem ✕-Button).
   * @param {string} titel
   * @param {HTMLElement} inhalt
   * @param {string} [klasse] z. B. "sm-dialog-breit"
   * @returns {{element: HTMLDialogElement, schliesse: Function}}
   */
  SM.ui.dom.dialog = function (titel, inhalt, klasse) {
    var el = SM.ui.dom.el;
    var dialog = el('dialog', { klasse: 'sm-dialog' + (klasse ? ' ' + klasse : '') });

    function schliesse() {
      dialog.close();
    }

    dialog.appendChild(el('div', { klasse: 'sm-dialog-kopf' }, [
      el('h2', { text: titel }),
      SM.ui.dom.knopf('✕', schliesse, 'sm-knopf-leise', 'Schließen')
    ]));
    dialog.appendChild(el('div', { klasse: 'sm-dialog-inhalt' }, [inhalt]));
    dialog.addEventListener('close', function () {
      dialog.remove();
    });

    document.body.appendChild(dialog);
    dialog.showModal();
    return { element: dialog, schliesse: schliesse };
  };
})();
