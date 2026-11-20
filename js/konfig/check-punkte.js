/* =====================================================================
   check-punkte.js – Checkliste für den "Social-Media-Check"
   ---------------------------------------------------------------------
   Mit dieser Liste gehe ich das Profil eines möglichen Kunden durch.
   Pro Punkt wähle ich: gut | ausbaufähig | fehlt | nicht geprüft.
   Aus "ausbaufähig" und "fehlt" entsteht im Bericht der Vorschlag.

   Regeln für die Texte: freundlich, konkret, ehrlich. Keine Zahlen,
   keine Versprechen ("mehr Kunden"), nur was man tun kann.

   NEUER PUNKT: Eintrag nach dem Muster ergänzen.
   MUSTER:
     {
       id: 'highlights',                       // eindeutig
       gruppe: 'Instagram',                    // Überschrift im Formular und im Bericht
       name: 'Story-Highlights',               // was geprüft wird
       frage: 'Gibt es Highlights für Preise, Team, Anfahrt?',   // Hilfe beim Prüfen
       lob: 'Die Highlights geben schnell einen Überblick.',       // Text im Bericht bei "gut"
       vorschlag: 'Highlights für Preise, Team und Anfahrt anlegen.' // Text bei "ausbaufähig"/"fehlt"
     }
   ===================================================================== */
(function () {
  'use strict';

  /* Mögliche Bewertungen eines Punktes */
  SM.konfig.checkWerte = [
    { id: 'gut', name: 'Gut' },
    { id: 'ausbau', name: 'Ausbaufähig' },
    { id: 'fehlt', name: 'Fehlt' },
    { id: 'offen', name: 'Nicht geprüft' }
  ];

  SM.konfig.checkPunkte = [
    { id: 'profilbild', gruppe: 'Profil', name: 'Profilbild',
      frage: 'Ist das Logo oder ein klares Bild zu sehen, auch klein noch erkennbar?',
      lob: 'Das Profilbild ist klar und auch in klein gut erkennbar.',
      vorschlag: 'Ein Profilbild verwenden, das auch in klein erkennbar ist – am besten das Logo auf ruhigem Hintergrund.' },
    { id: 'name', gruppe: 'Profil', name: 'Name und Benutzername',
      frage: 'Findet man den Betrieb, wenn man Name und Ort sucht?',
      lob: 'Der Betrieb ist über Name und Ort leicht zu finden.',
      vorschlag: 'Branche und Ort in den Profilnamen aufnehmen (z. B. „Friseur Hallein"), damit man in der Suche gefunden wird.' },
    { id: 'bio', gruppe: 'Profil', name: 'Beschreibung (Bio)',
      frage: 'Steht in zwei, drei Zeilen, was der Betrieb macht, wo er ist und für wen?',
      lob: 'Die Beschreibung sagt auf einen Blick, was man hier bekommt.',
      vorschlag: 'Die Beschreibung kürzen und klar machen: Was gibt es hier, wo ist es, wie macht man einen Termin?' },
    { id: 'link', gruppe: 'Profil', name: 'Link im Profil',
      frage: 'Führt der Link zur Website, zur Terminbuchung oder zur Speisekarte – und funktioniert er?',
      lob: 'Der Link im Profil führt direkt zum Ziel.',
      vorschlag: 'Einen funktionierenden Link zur Website oder Terminbuchung ins Profil setzen.' },
    { id: 'kontakt', gruppe: 'Profil', name: 'Kontakt-Schaltflächen',
      frage: 'Gibt es Schaltflächen für Anrufen, E-Mail, Route?',
      lob: 'Anrufen und Route sind mit einem Tipp erreichbar.',
      vorschlag: 'Das Profil auf ein Unternehmensprofil umstellen und Telefon, E-Mail und Adresse hinterlegen.' },
    { id: 'haeufigkeit', gruppe: 'Beiträge', name: 'Regelmäßigkeit',
      frage: 'Wann war der letzte Beitrag? Gibt es einen erkennbaren Rhythmus?',
      lob: 'Es erscheinen regelmäßig Beiträge – das Profil wirkt lebendig.',
      vorschlag: 'Einen festen Rhythmus einführen, lieber ein Beitrag pro Woche verlässlich als fünf auf einmal und dann lange nichts.' },
    { id: 'bildqualitaet', gruppe: 'Beiträge', name: 'Bildqualität',
      frage: 'Sind die Bilder hell, scharf und gerade? Erkennt man, worum es geht?',
      lob: 'Die Bilder sind hell, scharf und zeigen klar, worum es geht.',
      vorschlag: 'Bei Tageslicht fotografieren, die Linse vorher abwischen und das Motiv formatfüllend zeigen.' },
    { id: 'einheitlich', gruppe: 'Beiträge', name: 'Einheitliches Erscheinungsbild',
      frage: 'Erkennt man die Beiträge am Stil (Farben, Schrift, Logo)?',
      lob: 'Farben und Schrift ziehen sich durch – man erkennt den Betrieb sofort.',
      vorschlag: 'Vorlagen in den Farben und mit dem Logo des Betriebs verwenden, damit die Beiträge wiedererkennbar sind.' },
    { id: 'mischung', gruppe: 'Beiträge', name: 'Themen-Mischung',
      frage: 'Gibt es mehr als nur Angebote: Einblicke, Team, Tipps, Kundenstimmen?',
      lob: 'Die Themen wechseln sich gut ab.',
      vorschlag: 'Angebote mit Einblicken, Team-Vorstellungen und Tipps mischen – das macht das Profil persönlicher.' },
    { id: 'texte', gruppe: 'Beiträge', name: 'Texte',
      frage: 'Sind die Texte verständlich, fehlerfrei und mit einer klaren Aufforderung?',
      lob: 'Die Texte sind verständlich und sagen, was man als Nächstes tun kann.',
      vorschlag: 'Kurze Texte mit einer klaren Aufforderung am Ende (anrufen, vorbeikommen, Termin buchen).' },
    { id: 'videos', gruppe: 'Beiträge', name: 'Reels / Videos',
      frage: 'Gibt es kurze Videos? Sind sie hochkant und gut zu verstehen?',
      lob: 'Es gibt kurze Videos, die den Betrieb lebendig zeigen.',
      vorschlag: 'Ab und zu ein kurzes Video im Hochformat zeigen, zum Beispiel einen Blick hinter die Kulissen.' },
    { id: 'stories', gruppe: 'Beiträge', name: 'Stories und Highlights',
      frage: 'Werden Stories genutzt? Gibt es Highlights für Preise, Team, Anfahrt?',
      lob: 'Stories und Highlights werden genutzt.',
      vorschlag: 'Wichtige Infos (Preise, Öffnungszeiten, Anfahrt) als Highlights im Profil anheften.' },
    { id: 'antworten', gruppe: 'Kontakt mit Kunden', name: 'Antworten auf Kommentare',
      frage: 'Werden Kommentare und Fragen beantwortet?',
      lob: 'Auf Kommentare wird freundlich und zeitnah geantwortet.',
      vorschlag: 'Auf jeden Kommentar kurz antworten – das zeigt, dass jemand da ist.' },
    { id: 'google-profil', gruppe: 'Google-Unternehmensprofil', name: 'Profil vorhanden und bestätigt',
      frage: 'Gibt es ein Google-Unternehmensprofil? Ist es bestätigt?',
      lob: 'Das Google-Profil ist vorhanden und bestätigt.',
      vorschlag: 'Das Google-Unternehmensprofil beanspruchen und bestätigen – es erscheint bei jeder Suche in der Nähe.' },
    { id: 'google-daten', gruppe: 'Google-Unternehmensprofil', name: 'Öffnungszeiten und Daten',
      frage: 'Stimmen Öffnungszeiten, Telefon, Adresse und Website? Sind Feiertage eingetragen?',
      lob: 'Öffnungszeiten und Kontaktdaten sind aktuell.',
      vorschlag: 'Öffnungszeiten, Telefon und Website bei Google prüfen und Sonderzeiten für Feiertage eintragen.' },
    { id: 'google-fotos', gruppe: 'Google-Unternehmensprofil', name: 'Fotos bei Google',
      frage: 'Gibt es aktuelle eigene Fotos (außen, innen, Team, Leistungen)?',
      lob: 'Bei Google sind aktuelle eigene Fotos zu sehen.',
      vorschlag: 'Eigene aktuelle Fotos bei Google hochladen: Eingang von außen, Innenraum, Team.' },
    { id: 'bewertungen', gruppe: 'Google-Unternehmensprofil', name: 'Bewertungen',
      frage: 'Gibt es Bewertungen? Wird darauf geantwortet – auch auf kritische?',
      lob: 'Auf Bewertungen wird freundlich geantwortet.',
      vorschlag: 'Auf alle Bewertungen antworten, auch auf kritische – sachlich und freundlich. Zufriedene Kunden um eine Bewertung bitten.' },
    { id: 'facebook', gruppe: 'Facebook', name: 'Facebook-Seite',
      frage: 'Gibt es eine Seite? Stimmen die Daten? Ist sie mit Instagram verknüpft?',
      lob: 'Die Facebook-Seite ist gepflegt und aktuell.',
      vorschlag: 'Die Facebook-Seite mit Instagram verknüpfen, damit Beiträge auf beiden Kanälen erscheinen.' }
  ];
})();
