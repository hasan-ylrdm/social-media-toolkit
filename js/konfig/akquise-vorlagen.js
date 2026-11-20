/* =====================================================================
   akquise-vorlagen.js – Vorlagen für die erste Kontaktaufnahme
   ---------------------------------------------------------------------
   Platzhalter:
     aus "Meine Daten":   {MeinName} {MeinTelefon} {MeineEmail} {MeinOrt}
     vom Formular:        {Betrieb} {Ansprechperson} {Ort} {Aufhaenger}
   Leere Platzhalter bleiben sichtbar stehen, damit ich sie nicht vergesse.

   Regeln: ehrlich, kurz, kein Druck, keine Versprechen. Wer nicht
   antwortet, wird höchstens einmal freundlich erinnert.

   RECHTLICHER HINWEIS (keine Rechtsberatung): In Österreich ist Werbung
   per E-Mail oder Direktnachricht ohne vorherige Einwilligung nur sehr
   eingeschränkt erlaubt (§ 174 TKG 2021). Sicherer ist der persönliche
   Besuch oder ein Brief. Der Hinweis steht auch in der Oberfläche.

   NEUE VORLAGE: Eintrag nach dem Muster ergänzen.
   MUSTER:
     {
       id: 'brief',                    // eindeutig
       name: 'Brief',                  // Anzeigename
       art: 'text',                    // 'text' = ein Textblock, 'leitfaden' = Liste von Schritten
       betreff: 'Betreff …',           // nur bei E-Mail
       text: 'Guten Tag {Ansprechperson}, …'
     }
   ===================================================================== */
(function () {
  'use strict';

  SM.konfig.akquiseVorlagen = [
    {
      id: 'email', name: 'E-Mail', art: 'text',
      betreff: 'Social Media für {Betrieb} – eine Idee aus {MeinOrt}',
      text:
        'Guten Tag {Ansprechperson},\n\n' +
        'mein Name ist {MeinName}, ich komme aus {MeinOrt} und betreue die Social-Media-Kanäle kleiner Betriebe in der Region.\n\n' +
        '{Aufhaenger}\n\n' +
        'Ich habe mir Ihr Profil angesehen und ein paar Ideen notiert, wie es mit wenig Aufwand für Sie noch mehr hergeben könnte. ' +
        'Die kurze Übersicht bringe ich gern unverbindlich vorbei oder schicke sie Ihnen zu.\n\n' +
        'Wenn das für Sie interessant ist, freue ich mich über eine kurze Antwort. Wenn nicht, ist das auch völlig in Ordnung – dann melde ich mich nicht noch einmal.\n\n' +
        'Freundliche Grüße\n{MeinName}\n{MeinTelefon}\n{MeineEmail}'
    },
    {
      id: 'instagram', name: 'Instagram-Nachricht', art: 'text', betreff: '',
      text:
        'Hallo {Ansprechperson}, ich bin {MeinName} aus {MeinOrt}. {Aufhaenger} ' +
        'Ich betreue Social Media für kleine Betriebe in der Region und hätte ein paar konkrete Ideen für euer Profil. ' +
        'Darf ich euch die kurz zeigen? Ganz unverbindlich. Wenn kein Interesse besteht, einfach ignorieren – ich melde mich dann nicht mehr.'
    },
    {
      id: 'erinnerung', name: 'Freundliche Erinnerung (einmalig)', art: 'text',
      betreff: 'Kurze Nachfrage – Social Media für {Betrieb}',
      text:
        'Guten Tag {Ansprechperson},\n\n' +
        'ich habe Ihnen vor ein paar Tagen wegen der Social-Media-Betreuung geschrieben und wollte nur kurz nachfragen, ob meine Nachricht angekommen ist.\n\n' +
        'Falls das Thema im Moment nicht passt, ist das kein Problem – dann melde ich mich nicht mehr.\n\n' +
        'Freundliche Grüße\n{MeinName}\n{MeinTelefon}'
    },
    {
      id: 'besuch', name: 'Gesprächsleitfaden für den persönlichen Besuch', art: 'leitfaden', betreff: '',
      text:
        'Vorbereitung: Profil ansehen, Social-Media-Check ausdrucken, einen ruhigen Zeitpunkt wählen (nicht zur Stoßzeit).\n' +
        'Einstieg: „Grüß Gott, ich bin {MeinName} aus {MeinOrt}. Haben Sie zwei Minuten? Wenn es gerade nicht passt, komme ich gern ein anderes Mal."\n' +
        'Aufhänger: {Aufhaenger}\n' +
        'Zuhören: „Wie machen Sie das im Moment mit Instagram und Facebook? Wer kümmert sich darum, und wie viel Zeit kostet das?"\n' +
        'Zeigen: Den Social-Media-Check übergeben – zuerst sagen, was gut ist, dann zwei, drei konkrete Vorschläge.\n' +
        'Angebot: „Ich könnte das für Sie übernehmen: Planung, Grafiken, Texte – Sie geben nur frei." Pakete zeigen, Preise nennen.\n' +
        'Ehrlich bleiben: Keine Versprechen zu Followern oder Umsatz. Sagen, was ich tue und wie viel Zeit es dem Betrieb spart.\n' +
        'Einwände: „Keine Zeit" → genau dafür ist die Betreuung da. „Zu teuer" → mit dem kleinsten Paket starten, monatlich kündbar. „Bringt nichts" → nachfragen, was bisher probiert wurde.\n' +
        'Abschluss: Nächsten Schritt vereinbaren (Angebot schicken, Termin in einer Woche). Visitenkarte oder Angebot dalassen.\n' +
        'Danach: Am selben Tag Notizen im Toolkit eintragen und eine Aufgabe für die Nachfrage anlegen.'
    }
  ];

  /**
   * Füllt eine Akquise-Vorlage mit meinen Daten und den Angaben zum Betrieb.
   * @param {string} text Vorlagen-Text mit Platzhaltern
   * @param {Object} meineDaten einstellungen.meineDaten
   * @param {Object} angaben {betrieb, ansprechperson, ort, aufhaenger}
   * @returns {string}
   */
  SM.konfig.fuelleAkquise = function (text, meineDaten, angaben) {
    return SM.platzhalter.ersetze(text, null, {
      meinname: meineDaten.name,
      meintelefon: meineDaten.telefon,
      meineemail: meineDaten.email,
      meinort: meineDaten.ort,
      betrieb: angaben.betrieb,
      ansprechperson: angaben.ansprechperson,
      ort: angaben.ort,
      aufhaenger: angaben.aufhaenger
    });
  };
})();
