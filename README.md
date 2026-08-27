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

## Tracking

Die zentrale Modul-ID wird in `project.meta.moduleId` definiert. Die vorhandenen Events für Kapitel, Scrolltiefe, Grafik-Viewer, Video und PDF greifen diese ID automatisch auf.

## Vercel

- Framework: Vite
- Build Command: `npm run build`
- Output: `dist`
- Node.js: 22.x
