/* =====================================================================
   plan-generator.js – automatischer Monatsplan
   ---------------------------------------------------------------------
   Baut aus der Strategie eines Kunden die Beiträge für einen Monat.
   Der Plan ist bewusst VORHERSAGBAR (kein Zufall): gleiche Eingaben
   ergeben denselben Plan. So lässt er sich testen.

   Ablauf:
     1. Tage wählen: die bevorzugten Wochentage, gleichmäßig verteilt
     2. Themen-Säulen nach ihrem Anteil auf die Beiträge verteilen und
        so mischen, dass nicht dieselbe Säule hintereinander kommt
     3. Pro Beitrag: Beitragsart (reihum aus der Säule), Grafik-Vorlage,
        erste passende Caption, Standard-Hashtags
     4. Feiertage: der Beitrag davor wird zu "Öffnungszeiten"
        Anlässe (Muttertag, Advent …): stehen als Hinweis im Titel
     5. Reels laut Strategie zusätzlich, mit Ideen aus der Reel-Bibliothek

   Alle neuen Beiträge haben den Status "idee". Vorhandene Beiträge des
   Monats bleiben unberührt (die Oberfläche fragt vorher nach).
   ===================================================================== */
(function () {
  'use strict';

  /**
   * Wählt gleichmäßig verteilte Einträge aus einer Liste.
   * @param {Array} liste
   * @param {number} anzahl
   * @returns {Array} höchstens "anzahl" Einträge in ursprünglicher Reihenfolge
   */
  function verteile(liste, anzahl) {
    if (anzahl >= liste.length) {
      return liste.slice();
    }
    var auswahl = [];
    for (var i = 0; i < anzahl; i += 1) {
      auswahl.push(liste[Math.floor((i + 0.5) * liste.length / anzahl)]);
    }
    return auswahl;
  }

  /**
   * Wählt die Posting-Tage eines Monats.
   * @param {string} monat "JJJJ-MM"
   * @param {number} anzahl gewünschte Beiträge
   * @param {number[]} wochentage bevorzugte Wochentage (Montag = 0)
   * @returns {string[]} sortierte Liste von Tagen
   */
  SM.planGenerator.waehleTage = function (monat, anzahl, wochentage) {
    var alle = SM.datum.tageImMonat(monat);
    var bevorzugt = alle.filter(function (tag) {
      return wochentage.indexOf(SM.datum.wochentag(tag)) !== -1;
    });
    if (bevorzugt.length >= anzahl) {
      return verteile(bevorzugt, anzahl);
    }
    // Zu wenige bevorzugte Tage: mit anderen Werktagen (Mo–Sa) auffüllen
    var rest = alle.filter(function (tag) {
      return bevorzugt.indexOf(tag) === -1 && SM.datum.wochentag(tag) !== 6;
    });
    return bevorzugt.concat(verteile(rest, anzahl - bevorzugt.length)).sort();
  };

  /**
   * Verteilt die Säulen nach ihrem Anteil auf eine Anzahl Beiträge und
   * mischt sie gleichmäßig.
   * @param {Array<Object>} saeulen aus kunde.strategie.saeulen
   * @param {number} anzahl
   * @returns {Array<Object>} Liste mit "anzahl" Säulen (Wiederholungen möglich)
   */
  SM.planGenerator.verteileSaeulen = function (saeulen, anzahl) {
    if (saeulen.length === 0 || anzahl <= 0) {
      return [];
    }
    var summe = saeulen.reduce(function (zwischen, saeule) {
      return zwischen + (Number(saeule.anteil) || 0);
    }, 0) || saeulen.length;

    // "Guthaben"-Verfahren: Jede Säule sammelt pro Beitrag ihren Anteil an;
    // dran ist immer die Säule mit dem größten Guthaben.
    var guthaben = saeulen.map(function () {
      return 0;
    });
    var folge = [];
    for (var i = 0; i < anzahl; i += 1) {
      var beste = 0;
      saeulen.forEach(function (saeule, index) {
        guthaben[index] += (Number(saeule.anteil) || (summe / saeulen.length)) / summe;
        if (guthaben[index] > guthaben[beste] + 1e-9) {
          beste = index;
        }
      });
      guthaben[beste] -= 1;
      folge.push(saeulen[beste]);
    }
    return folge;
  };

  /**
   * Baut einen fertigen Beitrag (Status "idee") für eine Beitragsart.
   * @param {Object} kunde
   * @param {string} datum
   * @param {string} beitragsartId
   * @param {Object|null} saeule
   * @param {number} variante welche Caption-Variante (wird reihum genommen)
   * @param {Object} [zusatz] Platzhalter-Werte, z. B. {thema: 'Allerheiligen'}
   * @returns {Object} Post
   */
  SM.planGenerator.bauePost = function (kunde, datum, beitragsartId, saeule, variante, zusatz) {
    var art = SM.konfig.holeBeitragsart(beitragsartId) || SM.konfig.beitragsarten[0];
    var post = SM.datenmodell.leererPost(datum);
    var captions = SM.platzhalter.captions(kunde.stamm.branche, art.id);
    var kanaele = SM.strategie.aktiveKanaele(kunde).filter(function (kanal) {
      if (kanal === 'google') {
        return art.google;
      }
      if (kanal === 'tiktok') {
        return art.id === 'reel';
      }
      return true;
    });

    post.beitragsart = art.id;
    post.saeuleId = saeule ? saeule.id : '';
    post.kanaele = kanaele.length > 0 ? kanaele : ['instagram'];
    post.format = art.id === 'reel' ? 'reel-cover' : 'feed-hoch';
    post.titel = art.name + (saeule ? ' · ' + saeule.name : '');
    post.caption = captions.length > 0 ? SM.platzhalter.ersetze(captions[variante % captions.length], kunde, zusatz) : '';
    post.hashtags = SM.konfig.standardHashtags(kunde);

    var folie = post.folien[0];
    folie.vorlage = art.vorlage;
    ['titel', 'untertitel', 'text', 'zusatz'].forEach(function (platz) {
      folie.texte[platz] = SM.platzhalter.ersetze(art.folie[platz], kunde, zusatz);
    });
    return post;
  };

  /**
   * Erzeugt den Monatsplan.
   * @param {Object} kunde
   * @param {string} monat "JJJJ-MM"
   * @returns {Array<Object>} neue Posts (noch NICHT in kunde.posts eingetragen)
   */
  SM.planGenerator.erzeuge = function (kunde, monat) {
    var strategie = kunde.strategie;
    var anzahl = Number(strategie.postsProMonat) || 0;
    var wochentage = strategie.wochentage.length > 0 ? strategie.wochentage : SM.strategie.wochentageFuer(anzahl);
    var tage = SM.planGenerator.waehleTage(monat, anzahl, wochentage);
    var saeulen = SM.planGenerator.verteileSaeulen(strategie.saeulen, tage.length);
    var kalender = SM.kalenderDaten.fuerZeitraum(monat + '-01', SM.datum.plusTage(SM.datum.plusMonate(monat, 1) + '-01', 6), kunde);
    var zaehlerJeSaeule = {};
    var posts = [];

    tage.forEach(function (tag, index) {
      var saeule = saeulen[index] || null;
      var artId = 'neuigkeit';
      if (saeule && saeule.beitragsarten.length > 0) {
        var zaehler = zaehlerJeSaeule[saeule.id] || 0;
        artId = saeule.beitragsarten[zaehler % saeule.beitragsarten.length];
        zaehlerJeSaeule[saeule.id] = zaehler + 1;
      }
      posts.push(SM.planGenerator.bauePost(kunde, tag, artId, saeule, index));
    });

    // Feiertage und Anlässe: der letzte Beitrag in den 6 Tagen davor bekommt den Bezug.
    // Damit Feiertagsmonate (Mai, Dezember) die Mischung nicht kippen:
    //  - ein Öffnungszeiten-Beitrag steht immer VOR dem Feiertag, nie am Tag selbst
    //  - Feiertage, die höchstens 7 Tage nach dem letzten liegen, kommen in denselben Beitrag
    //  - höchstens ein Viertel der Beiträge (mindestens einer) wird zum Öffnungszeiten-Beitrag
    var schonVergeben = {};
    var maxFeiertagsPosts = Math.max(1, Math.floor(posts.length / 4));
    // Öffnungszeiten-Beiträge aus der normalen Säulen-Mischung zählen schon mit
    var feiertagsPosts = posts.filter(function (post) {
      return post.beitragsart === 'oeffnungszeiten';
    }).length;
    var letzterFeiertag = null;   // {post, datum} des zuletzt angelegten Öffnungszeiten-Beitrags
    Object.keys(kalender).sort().forEach(function (datum) {
      kalender[datum].forEach(function (eintrag) {
        if (eintrag.art !== 'feiertag' && eintrag.art !== 'anlass' && eintrag.art !== 'event') {
          return;
        }
        var istFeiertag = eintrag.art === 'feiertag';
        if (istFeiertag && letzterFeiertag && datum <= SM.datum.plusTage(letzterFeiertag.datum, 7)) {
          letzterFeiertag.post.titel += ' + ' + eintrag.titel + ' (' + SM.datum.formatTag(datum) + ')';
          letzterFeiertag.datum = datum;
          return;
        }
        if (istFeiertag && feiertagsPosts >= maxFeiertagsPosts) {
          return;
        }
        var passend = null;
        posts.forEach(function (post) {
          var davor = istFeiertag ? post.datum < datum : post.datum <= datum;
          var abstandOk = davor && post.datum >= SM.datum.plusTage(datum, -6);
          if (abstandOk && !schonVergeben[post.id]) {
            passend = post;
          }
        });
        if (!passend) {
          return;
        }
        schonVergeben[passend.id] = true;
        if (eintrag.art === 'feiertag') {
          var ersatz = SM.planGenerator.bauePost(kunde, passend.datum, 'oeffnungszeiten', null, 0, { thema: eintrag.titel });
          ersatz.id = passend.id;
          ersatz.titel = 'Öffnungszeiten: ' + eintrag.titel + ' (' + SM.datum.formatTag(datum) + ')';
          posts[posts.indexOf(passend)] = ersatz;
          schonVergeben[ersatz.id] = true;
          feiertagsPosts += 1;
          letzterFeiertag = { post: ersatz, datum: datum };
        } else {
          passend.titel += ' · Anlass: ' + eintrag.titel;
          passend.notiz = 'Anlass am ' + SM.datum.formatTag(datum) + ': ' + eintrag.titel +
            (eintrag.idee ? ' – Idee: ' + eintrag.idee : '');
        }
      });
    });

    // Reels: auf freie Samstage (sonst freie Tage) legen, Ideen aus der Bibliothek reihum
    var reelAnzahl = Number(strategie.reelsProMonat) || 0;
    if (reelAnzahl > 0) {
      var belegt = posts.map(function (post) {
        return post.datum;
      });
      var frei = SM.datum.tageImMonat(monat).filter(function (tag) {
        return belegt.indexOf(tag) === -1;
      });
      var samstage = frei.filter(function (tag) {
        return SM.datum.wochentag(tag) === 5;
      });
      var reelTage = verteile(samstage.length >= reelAnzahl ? samstage : frei, reelAnzahl);
      var ideen = SM.konfig.reelIdeenFuer(kunde.stamm.branche);
      var monatsNummer = Number(monat.slice(5, 7));
      reelTage.forEach(function (tag, index) {
        var idee = ideen.length > 0 ? ideen[(monatsNummer + index) % ideen.length] : null;
        var reel = SM.planGenerator.bauePost(kunde, tag, 'reel', null, index, { thema: idee ? idee.titel : 'Reel' });
        reel.titel = 'Reel: ' + (idee ? idee.titel : 'Idee offen');
        reel.notiz = idee ? 'Hook: ' + idee.hook + '\nSzenen: ' + idee.szenen.join(' | ') : '';
        posts.push(reel);
      });
    }

    return posts.sort(function (a, b) {
      return a.datum < b.datum ? -1 : (a.datum > b.datum ? 1 : 0);
    });
  };
})();
