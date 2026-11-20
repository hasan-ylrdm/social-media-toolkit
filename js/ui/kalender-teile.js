/* =====================================================================
   kalender-teile.js – Bausteine des Kalenders: Tages-Zelle, Beitrags-Chip
   ---------------------------------------------------------------------
   Drag & Drop mit den eingebauten Browser-Ereignissen (dragstart,
   dragover, drop) – ohne Bibliothek. Beim Ziehen wandert nur die id des
   Beitrags mit; beim Ablegen bekommt der Beitrag das Datum der Zelle.
   ===================================================================== */
(function () {
  'use strict';

  SM.ui.kalenderTeile = {};

  /**
   * Legt einen neuen Beitrag an einem Tag an und öffnet ihn.
   * @param {string} datum
   */
  SM.ui.kalenderTeile.neuerPost = function (datum) {
    var kunde = SM.zustand.kunde;
    var post = SM.planGenerator.bauePost(kunde, datum, 'neuigkeit', null, 0);
    post.titel = 'Neuer Beitrag';
    post.caption = '';
    kunde.posts.push(post);
    SM.zustand.melde('struktur');
    SM.ui.app.oeffnePost(post.id);
  };

  /**
   * Baut den Chip für einen Beitrag.
   * @param {Object} post
   * @param {boolean} ausfuehrlich true = Wochenansicht (mit Kanälen und Status-Auswahl)
   * @returns {HTMLElement}
   */
  SM.ui.kalenderTeile.postChip = function (post, ausfuehrlich) {
    var el = SM.ui.dom.el;
    var status = SM.konfig.hole(SM.konfig.status, post.status) || SM.konfig.status[0];
    var kanaele = post.kanaele.map(function (id) {
      var kanal = SM.konfig.hole(SM.konfig.kanaele, id);
      return kanal ? kanal.kurz : id;
    }).join(' ');

    var chip = el('button', {
      type: 'button', klasse: 'sm-chip', draggable: 'true',
      style: 'border-left-color:' + status.farbe,
      title: (post.titel || 'Beitrag') + ' – ' + status.name + ' (klicken zum Öffnen, ziehen zum Verschieben)'
    }, [
      el('span', { klasse: 'sm-chip-titel', text: (post.uhrzeit ? post.uhrzeit + ' ' : '') + (post.titel || 'Beitrag') }),
      el('span', { klasse: 'sm-chip-info', text: kanaele + ' · ' + status.name })
    ]);
    chip.addEventListener('click', function () {
      SM.ui.app.oeffnePost(post.id);
    });
    chip.addEventListener('dragstart', function (ereignis) {
      ereignis.dataTransfer.setData('text/plain', post.id);
      ereignis.dataTransfer.effectAllowed = 'move';
    });

    if (!ausfuehrlich) {
      return chip;
    }
    // Wochenansicht: Status direkt umstellen
    var auswahl = el('select', { 'aria-label': 'Status von ' + (post.titel || 'Beitrag') }, SM.konfig.status.map(function (eintrag) {
      return el('option', { value: eintrag.id, text: eintrag.name });
    }));
    auswahl.value = post.status;
    auswahl.addEventListener('change', function () {
      post.status = auswahl.value;
      SM.zustand.melde('struktur');
    });
    return el('div', { klasse: 'sm-chip-block' }, [chip, auswahl]);
  };

  /**
   * Baut die Zelle für einen Tag.
   * @param {string} datum "JJJJ-MM-TT"
   * @param {Array<Object>} posts Beiträge dieses Tages
   * @param {Array<Object>} eintraege Kalender-Einträge {titel, art, idee}
   * @param {boolean} ausserhalb Tag gehört nicht zum gezeigten Monat
   * @param {boolean} ausfuehrlich true = Wochenansicht
   * @returns {HTMLElement}
   */
  SM.ui.kalenderTeile.tagesZelle = function (datum, posts, eintraege, ausserhalb, ausfuehrlich) {
    var el = SM.ui.dom.el;
    var istHeute = datum === SM.datum.heute();
    var hatFerien = eintraege.some(function (eintrag) {
      return eintrag.art === 'ferien';
    });
    var klassen = 'sm-tag-zelle' + (ausserhalb ? ' sm-tag-ausserhalb' : '') + (istHeute ? ' sm-tag-heute' : '') + (hatFerien ? ' sm-tag-ferien' : '');

    var kopf = el('div', { klasse: 'sm-tag-kopf' }, [
      el('span', { klasse: 'sm-tag-nummer', text: ausfuehrlich ? SM.datum.formatTag(datum, true) : String(Number(datum.slice(8, 10))) }),
      SM.ui.dom.knopf('+', function () {
        SM.ui.kalenderTeile.neuerPost(datum);
      }, 'sm-knopf-mini sm-knopf-leise', 'Neuer Beitrag am ' + SM.datum.formatTag(datum))
    ]);

    var marken = eintraege.filter(function (eintrag) {
      return eintrag.art !== 'ferien';
    }).map(function (eintrag) {
      return el('div', { klasse: 'sm-marke sm-marke-' + eintrag.art, text: eintrag.titel, title: eintrag.titel + (eintrag.idee ? ' – Idee: ' + eintrag.idee : '') });
    });
    if (ausfuehrlich && hatFerien) {
      marken.push(el('div', { klasse: 'sm-marke sm-marke-ferien', text: eintraege.filter(function (eintrag) {
        return eintrag.art === 'ferien';
      })[0].titel }));
    }

    var zelle = el('div', { klasse: klassen, role: 'gridcell', 'aria-label': SM.datum.formatTag(datum, true) }, [kopf]
      .concat(marken)
      .concat(posts.map(function (post) {
        return SM.ui.kalenderTeile.postChip(post, ausfuehrlich);
      })));

    // Ablegen eines gezogenen Beitrags
    zelle.addEventListener('dragover', function (ereignis) {
      ereignis.preventDefault();
      zelle.classList.add('sm-tag-ziel');
    });
    zelle.addEventListener('dragleave', function () {
      zelle.classList.remove('sm-tag-ziel');
    });
    zelle.addEventListener('drop', function (ereignis) {
      ereignis.preventDefault();
      zelle.classList.remove('sm-tag-ziel');
      var post = SM.konfig.hole(SM.zustand.kunde.posts, ereignis.dataTransfer.getData('text/plain'));
      if (post && post.datum !== datum) {
        post.datum = datum;
        SM.zustand.melde('struktur');
      }
    });
    return zelle;
  };
})();
