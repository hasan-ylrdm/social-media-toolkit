/* =====================================================================
   tests-dokumente.js – Tests für die druckbaren Dokumente
   ---------------------------------------------------------------------
   Geprüft wird der erzeugte HTML-Text: Steht das Wichtige drin? Ist der
   API-Key NIE enthalten? Werden keine Zahlen erfunden?
   ===================================================================== */
(function () {
  'use strict';

  var fall = SM.test.fall;
  var gleich = SM.test.gleich;
  var wahr = SM.test.wahr;

  /**
   * Einstellungen für die Tests – mit Key, um zu prüfen, dass er nie ausgegeben wird.
   * @returns {Object}
   */
  function testEinstellungen() {
    var einstellungen = SM.datenmodell.standardEinstellungen();
    einstellungen.meineDaten.name = 'Hasan Tester';
    einstellungen.meineDaten.email = 'hasan@tester.example';
    einstellungen.meineDaten.ort = 'Hallein';
    einstellungen.ki.apiKey = 'sk-GEHEIM-12345';
    return einstellungen;
  }

  /**
   * Prüft Dinge, die für JEDES Dokument gelten.
   * @param {string} html
   * @param {string} name für die Fehlermeldung
   */
  function pruefeAllgemein(html, name) {
    wahr(html.indexOf('<!DOCTYPE html>') === 0, name + ': vollständiges HTML-Dokument');
    wahr(html.indexOf('window.print()') !== -1, name + ': Druck-Button');
    wahr(html.indexOf('sk-GEHEIM-12345') === -1, name + ': API-Key darf nie im Dokument stehen');
    wahr(html.indexOf('undefined') === -1 && html.indexOf('[object Object]') === -1 && html.indexOf('NaN') === -1, name + ': kein „undefined", „NaN" oder „[object Object]"');
    wahr(!/(src|href)="https?:/.test(html), name + ': lädt nichts aus dem Internet');
  }

  fall('Dokumente', 'Fragebogen: alle Fragen, Antworten oder Schreiblinien', function () {
    var kunde = SM.konfig.beispielKunde('2026-11');
    kunde.onboarding.konkurrenz = '';
    var html = SM.dokumente.fragebogen(kunde, testEinstellungen());
    pruefeAllgemein(html, 'Fragebogen');
    SM.konfig.onboardingFragen.forEach(function (frage) {
      wahr(html.indexOf(SM.helfer.escapeHtml(frage.frage)) !== -1, 'Frage fehlt: ' + frage.id);
    });
    wahr(html.indexOf('Bekannter werden') !== -1, 'eingetragene Antwort');
    wahr(html.indexOf('dok-linie') !== -1, 'Schreiblinien bei leerer Antwort');
    wahr(html.indexOf('Hasan Tester') !== -1, 'mein Absender');
  });

  fall('Dokumente', 'Strategie: Ziele, Säulen, Häufigkeit, Kanäle – ohne Versprechen', function () {
    var kunde = SM.konfig.beispielKunde('2026-11');
    var html = SM.dokumente.strategie(kunde, testEinstellungen());
    pruefeAllgemein(html, 'Strategie');
    kunde.strategie.saeulen.forEach(function (saeule) {
      wahr(html.indexOf(SM.helfer.escapeHtml(saeule.name)) !== -1, 'Säule fehlt: ' + saeule.name);
    });
    wahr(html.indexOf('Beiträge pro Monat') !== -1 && html.indexOf('>' + kunde.strategie.postsProMonat + '<') !== -1, 'Häufigkeit');
    wahr(html.indexOf('kann niemand seriös geben') !== -1, 'Hinweis: keine Versprechen');
  });

  fall('Dokumente', 'Einwilligung: Betrieb als Verantwortlicher, Widerruf, Hinweis „keine Rechtsberatung"', function () {
    var kunde = SM.konfig.beispielKunde('2026-11');
    ['mitarbeiter', 'kunde'].forEach(function (art) {
      var html = SM.dokumente.einwilligung(kunde, testEinstellungen(), art);
      pruefeAllgemein(html, 'Einwilligung ' + art);
      wahr(html.indexOf('keine Rechtsberatung') !== -1, 'Hinweis Vorlage');
      wahr(html.indexOf('Café Muster') !== -1 && html.indexOf('Musterplatz 3') !== -1, 'Betrieb und Anschrift');
      wahr(html.indexOf('widerrufen') !== -1 && html.indexOf('Art. 6 Abs. 1 lit. a DSGVO') !== -1, 'Widerruf und Rechtsgrundlage');
      wahr(html.indexOf('Instagram') !== -1, 'aktive Kanäle');
      wahr(html.indexOf('Hasan Tester') === -1, 'ich bin nicht der Absender');
    });
    wahr(SM.dokumente.einwilligung(kunde, testEinstellungen(), 'mitarbeiter').indexOf('Arbeitsverhältnis') !== -1, 'Mitarbeiter-Fassung');
  });

  fall('Dokumente', 'Freigabe: jeder Beitrag mit Datum, Kanal, Text und „OK / Änderungswunsch"', function () {
    var kunde = SM.konfig.beispielKunde('2026-11');
    var posts = SM.dokumente.freigabePosts(kunde, '2026-11', false);
    gleich(posts.length, kunde.posts.length, 'alle Beiträge des Monats');
    var offene = SM.dokumente.freigabePosts(kunde, '2026-11', true);
    wahr(offene.length > 0 && offene.length < posts.length, 'Filter „nur offene"');
    var grafiken = {};
    grafiken[posts[0].id] = ['data:image/jpeg;base64,TESTBILD'];
    var html = SM.dokumente.freigabe(kunde, testEinstellungen(), '2026-11', posts, grafiken);
    pruefeAllgemein(html, 'Freigabe');
    gleich(html.split('OK, so veröffentlichen').length - 1, posts.length, 'ein Freigabe-Feld pro Beitrag');
    wahr(html.indexOf('data:image/jpeg;base64,TESTBILD') !== -1, 'Grafik eingebettet');
    wahr(html.indexOf('November 2026') !== -1 && html.indexOf('Instagram') !== -1, 'Monat und Kanal');
    wahr(html.indexOf('Karussell, 3 Folien') !== -1, 'Karussell gekennzeichnet');
    wahr(SM.dokumente.freigabe(kunde, testEinstellungen(), '2031-01', [], {}).indexOf('noch keine Beiträge') !== -1, 'leerer Monat');
  });

  fall('Dokumente', 'Monatsbericht: nur eingetragene Zahlen, Vergleich, Diagramme, Top-Beiträge', function () {
    var kunde = SM.konfig.beispielKunde('2026-11');
    var html = SM.dokumente.bericht(kunde, testEinstellungen(), '2026-10');
    pruefeAllgemein(html, 'Bericht');
    wahr(html.indexOf('2.310') !== -1, 'Reichweite mit Tausenderpunkt');
    wahr(html.indexOf('+470') !== -1 && html.indexOf('25,5 %') !== -1, 'Vergleich zum Vormonat (2.310 statt 1.840)');
    wahr(html.indexOf('<svg') !== -1, 'Diagramme');
    wahr(html.indexOf('Reel: Ein Cappuccino entsteht') !== -1, 'Top-Beiträge');
    wahr(html.indexOf('Routenanfragen') !== -1 && html.indexOf('kein Vormonat erfasst') !== -1, 'Kennzahl ohne Vormonat');
    var leer = SM.dokumente.bericht(kunde, testEinstellungen(), '2031-01');
    wahr(leer.indexOf('noch keine Kennzahlen eingetragen') !== -1, 'leerer Monat: Hinweis');
    wahr(leer.indexOf('dok-karte') === -1 || leer.indexOf('<b>') === -1, 'leerer Monat: keine erfundenen Zahlen');
  });

  fall('Dokumente', 'Social-Media-Check: Lob, Vorschläge, Pakete – ohne Garantien', function () {
    var einstellungen = testEinstellungen();
    var check = { id: 'c1', datum: '2026-11-13', betrieb: 'Tischlerei Test', ort: 'Kuchl', branche: 'handwerk', link: '',
      punkte: { profilbild: { wert: 'gut', notiz: '' }, bio: { wert: 'ausbau', notiz: 'Öffnungszeiten fehlen' }, link: { wert: 'fehlt', notiz: '' }, name: { wert: 'offen', notiz: '' } },
      fazit: 'Schöne Bilder, aber selten.', paketId: 'paket-standard' };
    var html = SM.dokumente.check(check, einstellungen);
    pruefeAllgemein(html, 'Check');
    wahr(html.indexOf('Das läuft schon gut') !== -1 && html.indexOf('Profilbild') !== -1, 'Lob');
    wahr(html.indexOf('Öffnungszeiten fehlen') !== -1 && html.indexOf('(fehlt noch)') !== -1, 'Vorschläge mit Notiz');
    wahr(html.indexOf('Name und Benutzername') === -1, 'nicht geprüfte Punkte erscheinen nicht');
    wahr(html.indexOf('Was ich nicht verspreche') !== -1, 'keine Garantien');
    wahr(html.indexOf('dok-gewaehlt') !== -1 && html.indexOf('€ 249') !== -1, 'empfohlenes Paket mit Preis');
  });

  fall('Dokumente', 'Angebot: Empfänger, Paket, Preis, Ablauf', function () {
    var einstellungen = testEinstellungen();
    var angebot = { id: 'a1', datum: '2026-11-13', empfaenger: 'Café Muster\nz. Hd. Maria Muster', anschrift: 'Musterplatz 3\n5400 Hallein',
      paketId: 'paket-plus', preis: '', start: '1. Dezember 2026', laufzeit: 'monatlich kündbar', zusatz: '' };
    var html = SM.dokumente.angebot(angebot, einstellungen);
    pruefeAllgemein(html, 'Angebot');
    wahr(html.indexOf('Café Muster<br>z. Hd. Maria Muster') !== -1, 'Empfänger mit Zeilenumbruch');
    wahr(html.indexOf('Paket „Plus"') !== -1 && html.indexOf('€ 399 pro Monat') !== -1, 'Paket und Preis');
    wahr(html.indexOf('1. Dezember 2026') !== -1, 'Start');
    angebot.preis = 350;
    wahr(SM.dokumente.angebot(angebot, einstellungen).indexOf('€ 350 pro Monat') !== -1, 'abweichender Preis');
  });
})();
