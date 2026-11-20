/* =====================================================================
   schriften.js – Schriftpaare (Überschrift + Fließtext)
   ---------------------------------------------------------------------
   Es werden bewusst NUR Systemschriften verwendet: Sie sind auf jedem
   Gerät vorhanden, laden sofort und brauchen keine Verbindung zu Google
   (Google Fonts von fremden Servern ist ein bekanntes DSGVO-Problem).

   NEUES SCHRIFTPAAR: Eintrag nach dem Muster ergänzen.
   MUSTER:
     {
       id: 'mein-paar',
       name: 'Anzeigename im Editor',
       ueberschrift: 'Georgia, serif',          // CSS font-family
       text: 'system-ui, sans-serif',           // CSS font-family
       gewicht: '700',                          // Schriftstärke Überschrift
       zusatzCss: ''                            // optional: extra CSS für h1–h3
     }
   Eigene Schriftdateien (woff2) einbinden: siehe WEITERENTWICKLUNG.md.
   ===================================================================== */
(function () {
  'use strict';

  var SANS = 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

  SM.konfig.schriften = [
    {
      id: 'modern',
      name: 'Modern (serifenlos)',
      ueberschrift: SANS,
      text: SANS,
      gewicht: '700',
      zusatzCss: 'letter-spacing:-0.01em;'
    },
    {
      id: 'klassisch',
      name: 'Klassisch (Serifen-Überschrift)',
      ueberschrift: 'Georgia, "Times New Roman", Times, serif',
      text: SANS,
      gewicht: '700',
      zusatzCss: ''
    },
    {
      id: 'elegant',
      name: 'Elegant (feine Serifen)',
      ueberschrift: '"Palatino Linotype", Palatino, "Book Antiqua", "URW Palladio L", Georgia, serif',
      text: SANS,
      gewicht: '400',
      zusatzCss: 'letter-spacing:0.01em;'
    },
    {
      id: 'freundlich',
      name: 'Freundlich (rund)',
      ueberschrift: 'ui-rounded, "Trebuchet MS", "Segoe UI", Verdana, sans-serif',
      text: '"Trebuchet MS", "Segoe UI", Verdana, sans-serif',
      gewicht: '700',
      zusatzCss: ''
    },
    {
      id: 'technisch',
      name: 'Technisch (kräftig, Großbuchstaben)',
      ueberschrift: '"Arial Narrow", "Roboto Condensed", "Franklin Gothic Medium", Arial, sans-serif',
      text: SANS,
      gewicht: '700',
      zusatzCss: 'text-transform:uppercase;letter-spacing:0.03em;'
    },
    {
      id: 'buch',
      name: 'Buch (durchgehend Serifen)',
      ueberschrift: 'Georgia, "Times New Roman", Times, serif',
      text: 'Georgia, "Times New Roman", Times, serif',
      gewicht: '700',
      zusatzCss: ''
    }
  ];
})();
