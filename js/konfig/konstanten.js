/* =====================================================================
   konstanten.js – feste Auswahllisten: Status, Kanäle, Formate, Töne
   ---------------------------------------------------------------------
   NEUES FORMAT: Eintrag in SM.konfig.formate ergänzen (Breite × Höhe in
   Pixel). Alle Grafik-Vorlagen rechnen relativ und passen sich an.
   NEUER KANAL: Eintrag in SM.konfig.kanaele ergänzen UND in
   datenmodell.js bei kunde.kanaele den gleichen Schlüssel anlegen.

   Die Zeichen-Grenzen sind die der Plattformen (Stand 2025). Plattformen
   ändern so etwas gelegentlich – bei Zweifel dort nachsehen.
   ===================================================================== */
(function () {
  'use strict';

  /* Status eines Posts, in der Reihenfolge des Arbeitsablaufs */
  SM.konfig.status = [
    { id: 'idee', name: 'Idee', farbe: '#8a93a6' },
    { id: 'entwurf', name: 'Entwurf', farbe: '#c98a1b' },
    { id: 'freigabe', name: 'Zur Freigabe', farbe: '#7b5bd6' },
    { id: 'freigegeben', name: 'Freigegeben', farbe: '#2a8f6a' },
    { id: 'geplant', name: 'Geplant', farbe: '#2c6fd1' },
    { id: 'veroeffentlicht', name: 'Veröffentlicht', farbe: '#1f6b3a' }
  ];

  /* Kanäle. grenze = maximale Zeichen der Caption, hashtagMax = erlaubte Hashtags */
  SM.konfig.kanaele = [
    {
      id: 'instagram', name: 'Instagram', kurz: 'IG', grenze: 2200, hashtagMax: 5,   // seit Dez. 2025 höchstens 5 Hashtags je Beitrag
      hinweis: 'Nur die ersten ca. 125 Zeichen sind ohne „mehr" sichtbar. Instagram erlaubt höchstens 5 Hashtags je Beitrag.'
    },
    {
      id: 'facebook', name: 'Facebook', kurz: 'FB', grenze: 63206, hashtagMax: 30,
      hinweis: 'Kurze Texte (1–3 Sätze) werden eher gelesen. Hashtags spielen kaum eine Rolle.'
    },
    {
      id: 'tiktok', name: 'TikTok', kurz: 'TT', grenze: 2200, hashtagMax: 30,
      hinweis: 'Kurz halten; der Text liegt über dem Video. Wenige, passende Hashtags. (2200 ist die vorsichtige Grenze; in der App sind je nach Quelle bis 4000 Zeichen möglich.)'
    },
    {
      id: 'google', name: 'Google-Unternehmensprofil', kurz: 'G', grenze: 1500, hashtagMax: 0,
      hinweis: 'Keine Hashtags, keine Telefonnummer im Text. Ideal sind 150–300 Zeichen mit klarer Info.'
    }
  ];

  /* Grafik-Formate */
  SM.konfig.formate = [
    { id: 'feed-quadrat', name: 'Feed-Post quadratisch', breite: 1080, hoehe: 1080, vorschau: 'feed' },
    { id: 'feed-hoch', name: 'Feed-Post hoch (4:5)', breite: 1080, hoehe: 1350, vorschau: 'feed' },
    { id: 'story', name: 'Story', breite: 1080, hoehe: 1920, vorschau: 'story' },
    { id: 'reel-cover', name: 'Reel-Cover', breite: 1080, hoehe: 1920, vorschau: 'story' },
    { id: 'google', name: 'Google-Unternehmensprofil (4:3)', breite: 1200, hoehe: 900, vorschau: 'google' }
  ];

  /* Ton der Texte (für KI-Assistent und als Notiz beim Kunden) */
  SM.konfig.toene = [
    { id: 'freundlich', name: 'Freundlich', anweisung: 'freundlich, warm und einladend' },
    { id: 'professionell', name: 'Professionell', anweisung: 'professionell, sachlich und vertrauenswürdig' },
    { id: 'locker', name: 'Locker', anweisung: 'locker und unkompliziert, aber nicht flapsig' }
  ];

  /**
   * Sucht einen Eintrag mit bestimmter id in einer Konfig-Liste.
   * @param {Array<Object>} liste z. B. SM.konfig.formate
   * @param {string} id
   * @returns {Object|null}
   */
  SM.konfig.hole = function (liste, id) {
    for (var i = 0; i < liste.length; i += 1) {
      if (liste[i].id === id) {
        return liste[i];
      }
    }
    return null;
  };

  /**
   * @param {string} id
   * @returns {Object|null} Branche aus js/konfig/branchen.js
   */
  SM.konfig.holeBranche = function (id) {
    return SM.konfig.hole(SM.konfig.branchen, id);
  };

  /**
   * @param {string} id
   * @returns {Object|null} Schriftpaar aus js/konfig/schriften.js
   */
  SM.konfig.holeSchrift = function (id) {
    return SM.konfig.hole(SM.konfig.schriften, id);
  };

  /**
   * @param {string} id
   * @returns {Object|null} Beitragsart aus js/konfig/beitragsarten.js
   */
  SM.konfig.holeBeitragsart = function (id) {
    return SM.konfig.hole(SM.konfig.beitragsarten, id);
  };
})();
