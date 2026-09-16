# med.i.scroll Mastertemplate v6.2

Neu in v6.2: animierte Kennzahlen (0 → Zielwert), optimierte Stats-Grafikrahmen und eindeutige Aktiv/Inaktiv-Zustände der Workflow-Navigation. Details: `UPDATE-2026-09-16-v6.2_Interaktive-Kennzahlen-und-Workflow.md`.

# Gelbe Liste med.i.scroll – Mastertemplate

Dieses Repository ist die wiederverwendbare technische Basis für neue med.i.scroll-Projekte.

## Für ein neues Projekt müssen normalerweise nur zwei Bereiche geändert werden

1. `src/project.js` – alle Texte, Kapitel, Links, Quellen, Impressum, PDF-Dateiname, Tracking-ID und Medienpfade.
2. `public/assets/` – Bilder, Grafiken, Videos und ggf. weitere Dateien.

Die React-Komponenten, Navigation, Zoom-Viewer, mobile Darstellung und PDF-Engine bleiben unverändert.

## Neues Projekt anlegen

1. Dieses Repository in GitHub als Template Repository markieren oder duplizieren.
2. Neues Repository aus dem Template erzeugen, z. B. `med-i-scroll-pneumokokken-kinder`.
3. `src/project.js` anpassen.
4. Medien nach `public/assets/images/`, `public/assets/video/` etc. kopieren.
5. In Vercel das neue GitHub-Repository als neues Projekt importieren.
6. Node.js 22.x verwenden.

## Unterstützte Kapiteltypen

- `hero` – Einstieg / Key Visual
- `stats` – Kennzahlen / Facts
- `standard` – Fließtext, Listen, Zitate, Hinweisboxen
- `steps` – Schritt-für-Schritt / Entscheidungslogik
- `video` – Video mit Poster und CTA
- `sources` – Quellen + PDF-Erstellung
- `imprint` – Impressum

## Optionale Kapitel-Properties

- `zoomable: true` – zeigt „Grafik öffnen“ und aktiviert Vollbild/Zoom.
- `wide: true` – breiter Textrahmen.
- `long: true` – mehr vertikaler Platz für umfangreiche Inhalte.
- `background` – Hintergrundbild.
- `focal` – Bildfokus, z. B. `center 30%`.
- `tone` – `dark` oder `light`.
- `align` – `left` oder `right`.

## PDF

Der Header-PDF-Button erzeugt eine echte clientseitige DIN-A4-Hochformat-PDF mit jsPDF. Dateiname und Metadaten werden in `project.meta` gepflegt.

## Piano Analytics Tracking

Die stabile Projekt-ID wird in `project.meta.projectId` definiert. Die Tracking-Schicht liegt zentral in `src/tracking/piano.js` und verwendet bevorzugt die vorhandene Vidal-/Gelbe-Liste-Semantik. Scroll Tracking wurde auf die aktuelle Piano-Logik `page.scroll` + `scroll_rate` umgestellt; Kapitel- und Video-Events werden als klar definierte Custom Events geführt.

Im Mastertemplate ist `VITE_PIANO_ENABLED=false`. Nach Validierung der neuen Properties/Events im Piano Data Model und interner Datenschutzfreigabe wird die Variable im produktiven Vercel-Projekt auf `true` gesetzt.

Details: `PIANO-ANALYTICS.md`.

## Vercel

- Framework: Vite
- Build Command: `npm run build`
- Output: `dist`
- Node.js: 22.x

## Erweiterungen ab v6 (14.09.2026)

Zusätzlich unterstützt das Template:

- `steps`: mobile Workflow-/Swipe-Navigation; links = vorwärts, rechts = rückwärts.
- `accordionItems`: aufklappbare FAQ-/Praxisfall-Inhalte in `standard`-Kapiteln.
- `cta`: eigener Kapiteltyp mit `primaryCta`, optionalen `badges`, `bullets`, `inlineImage` und `note`.
- erweiterte Impressum-/Sponsoring-Felder.
- PDF-Ausgabe dieser neuen Inhaltstypen.
- erweitertes Piano-Tracking für Accordion und Workflow.

Beispiel Accordion in einem `standard`-Kapitel:
```js
accordionItems: [
  { id: "faq-1", heading: "Frage", teaser: "Kurze Einordnung", answer: "Antwort" }
]
```

Beispiel CTA-Kapitel:
```js
{
  id: "vertiefung",
  kind: "cta",
  kicker: "Vertiefung",
  title: "Mehr erfahren",
  paragraphs: ["Einführender Text"],
  badges: ["Merkmal 1", "Merkmal 2"],
  primaryCta: { label: "Jetzt öffnen", url: "https://www.gelbe-liste.de/", analyticsId: "cta-vertiefung" }
}
```


## Aufklappbare Frage/Antwort-Felder
Für FAQ- oder Praxisfragen kann jedes `standard`-Kapitel `accordionItems` enthalten. Die Frage selbst ist die klickbare gelbe Zeile; die Antwort wird darunter auf- bzw. zugeklappt. Beispiel:

```js
accordionVariant: "faq",
accordionItems: [
  {
    id: "faq-1",
    question: "Frage?",
    answer: ["Antwort Absatz 1.", "Antwort Absatz 2."]
  }
]
```

Die Interaktion wird über Piano Analytics als `accordion.toggle` erfasst.
