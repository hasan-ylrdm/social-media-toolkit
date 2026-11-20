/* =====================================================================
   einwilligung.js – Vorlage: Einwilligung für Fotos und Videos (DSGVO)
   ---------------------------------------------------------------------
   Für Mitarbeiterinnen/Mitarbeiter und für Kundinnen/Kunden des
   Betriebs, die auf Fotos oder Videos zu sehen sind.

   WICHTIG: Das ist eine VORLAGE und KEINE RECHTSBERATUNG. Der Hinweis
   steht gut sichtbar im Dokument UND in der Oberfläche. Verantwortlich
   im Sinn der DSGVO ist der Betrieb (mein Kunde), nicht ich.

   Rechtliche Anker der Vorlage (Österreich):
     Art. 6 Abs. 1 lit. a und Art. 7 DSGVO (Einwilligung, Widerruf)
     § 78 UrhG (Recht am eigenen Bild)
   Wer Texte ändert: sachlich bleiben, nichts versprechen, was technisch
   nicht geht (z. B. "vollständige Löschung aus dem Internet").
   ===================================================================== */
(function () {
  'use strict';

  /**
   * Einwilligungs-Vorlage.
   * @param {Object} kunde der Betrieb (Verantwortlicher)
   * @param {Object} einstellungen
   * @param {string} art 'mitarbeiter' oder 'kunde'
   * @returns {string} HTML-Dokument
   */
  SM.dokumente.einwilligung = function (kunde, einstellungen, art) {
    var esc = SM.helfer.escapeHtml;
    var stamm = kunde.stamm;
    var betrieb = stamm.firmenname || '[Name des Betriebs]';
    var anschrift = [stamm.strasse, [stamm.plz, stamm.ort].filter(Boolean).join(' ')].filter(Boolean).join(', ') || '[Anschrift]';
    var kontakt = [stamm.email, stamm.telefon].filter(Boolean).join(' · ') || '[E-Mail / Telefon]';
    var istMitarbeiter = art === 'mitarbeiter';

    var kanaele = SM.konfig.kanaele.filter(function (kanal) {
      return kunde.kanaele[kanal.id] && kunde.kanaele[kanal.id].aktiv;
    }).map(function (kanal) {
      return kanal.name;
    });
    var kanalListe = (kanaele.length > 0 ? kanaele : ['Instagram', 'Facebook']).concat(['Website des Betriebs']).map(function (name) {
      return '<span class="dok-box"></span>' + esc(name);
    }).join(' &nbsp; ');

    var inhalt =
      '<div class="dok-hinweis"><strong>Vorlage – keine Rechtsberatung.</strong> Dieses Muster ersetzt keine rechtliche Prüfung. ' +
      'Bitte vor der ersten Verwendung prüfen lassen (z. B. bei der Wirtschaftskammer oder einer Rechtsanwältin / einem Rechtsanwalt).</div>' +
      '<h1>Einwilligung zur Veröffentlichung von Fotos und Videos</h1>' +
      '<p class="dok-unter">' + (istMitarbeiter ? 'für Mitarbeiterinnen und Mitarbeiter' : 'für Kundinnen und Kunden') + '</p>' +

      '<h2>Wer ist verantwortlich?</h2>' +
      '<p>' + esc(betrieb) + ', ' + esc(anschrift) + '<br>Kontakt: ' + esc(kontakt) + '</p>' +

      '<h2>Wer willigt ein?</h2>' +
      '<table><tr><td style="width:40mm">Vor- und Nachname</td><td><div class="dok-linie"></div></td></tr>' +
      '<tr><td>Geburtsdatum (nur bei unter 18 Jahren)</td><td><div class="dok-linie"></div></td></tr></table>' +

      '<h2>Worum geht es?</h2>' +
      '<p>Ich bin damit einverstanden, dass ' + esc(betrieb) + ' Fotos und Videos, auf denen ich zu erkennen bin, ' +
      'für die Öffentlichkeitsarbeit des Betriebs verwendet. Die Aufnahmen zeigen mich ' +
      (istMitarbeiter ? 'bei meiner Arbeit oder im Team.' : 'als Kundin bzw. Kunde, zum Beispiel ein Ergebnis oder einen Besuch im Betrieb.') + '</p>' +
      '<p><strong>Veröffentlichung auf</strong> (Zutreffendes ankreuzen):<br>' + kanalListe + '</p>' +
      '<p><span class="dok-box"></span>mit Nennung meines Vornamens &nbsp; <span class="dok-box"></span>ohne Namen</p>' +

      '<h2>Was Sie wissen sollten</h2>' +
      '<ul>' +
      '<li><strong>Freiwillig:</strong> Die Einwilligung ist freiwillig. ' +
      (istMitarbeiter
        ? 'Wenn Sie nicht einwilligen oder später widerrufen, entstehen Ihnen im Arbeitsverhältnis keine Nachteile.'
        : 'Wenn Sie nicht einwilligen, entstehen Ihnen keine Nachteile; Leistungen des Betriebs hängen nicht davon ab.') + '</li>' +
      '<li><strong>Widerruf:</strong> Sie können die Einwilligung jederzeit ohne Angabe von Gründen für die Zukunft widerrufen – ' +
      'formlos an die oben genannte Kontaktadresse. Der Betrieb entfernt die Aufnahmen dann so rasch wie möglich aus seinen eigenen Kanälen.</li>' +
      '<li><strong>Grenzen:</strong> Inhalte im Internet können von anderen kopiert oder weiterverbreitet werden. ' +
      'Eine vollständige Löschung überall kann der Betrieb deshalb nicht zusichern.</li>' +
      '<li><strong>Dienste außerhalb der EU:</strong> Plattformen wie Instagram oder Facebook (Meta), TikTok und Google können Daten auch außerhalb der EU verarbeiten.</li>' +
      '<li><strong>Dauer:</strong> Die Einwilligung gilt bis zum Widerruf' + (istMitarbeiter ? ', auch nach dem Ende des Arbeitsverhältnisses nur, solange Sie nicht widerrufen' : '') + '.</li>' +
      '<li><strong>Ihre Rechte:</strong> Auskunft, Berichtigung, Löschung, Einschränkung und Widerspruch (Art. 15 bis 21 DSGVO) sowie Beschwerde bei der ' +
      'Österreichischen Datenschutzbehörde (dsb.gv.at).</li>' +
      '<li><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung); das Recht am eigenen Bild nach § 78 UrhG bleibt unberührt.</li>' +
      '</ul>' +

      '<div class="dok-kasten"><strong>Minderjährige:</strong> Bei Personen unter 14 Jahren unterschreiben die Erziehungsberechtigten. ' +
      'Zwischen 14 und 18 Jahren sollten die betroffene Person <em>und</em> eine erziehungsberechtigte Person unterschreiben.</div>' +

      '<div class="dok-unterschrift"><div>Ort, Datum</div><div>Unterschrift</div></div>' +
      '<div class="dok-unterschrift"><div>Ort, Datum</div><div>Unterschrift Erziehungsberechtigte/r (falls nötig)</div></div>' +
      '<div class="dok-fuss">Eine Kopie dieser Erklärung erhält die unterzeichnende Person. Das Original bewahrt ' + esc(betrieb) + ' auf.</div>';

    return SM.dokumente.seite('Einwilligung Fotos – ' + betrieb, inhalt, einstellungen,
      { farbe: kunde.marke.farben.primaer, ohneAbsender: true, logo: (SM.grafik.logoVon(kunde) || {}).dataUrl || '' });
  };
})();
