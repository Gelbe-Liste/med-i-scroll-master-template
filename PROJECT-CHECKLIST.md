# Checkliste für ein neues med.i.scroll-Projekt

## 1. Projektstammdaten in `src/project.js`
- Projekttitel
- Rubrik / Eyebrow
- `moduleId` für Piano
- PDF-Dateiname
- PDF-Metadaten

## 2. Kapitel
- eindeutige `id`
- laufende `number`
- kurzer Navigationstitel `nav`
- Kicker, Titel, Untertitel
- Kapiteltyp `kind`
- `tone` und `align`
- Hintergrundbild + `focal`
- Inhalte
- bei relevanten Fachgrafiken: `zoomable: true`

## 3. Medien
- Bilder nach `public/assets/images/`
- Videos nach `public/assets/video/`
- Dateinamen ohne Leerzeichen verwenden
- Weboptimierte Auflösung/Dateigröße verwenden

## 4. Quellen
- vollständige Quellenangaben in `project.sources`
- URLs prüfen

## 5. Impressum
- Angaben in `project.imprint` prüfen
- Bildnachweise aktualisieren

## 6. Qualitätssicherung
- Desktop
- iPhone / Safari
- Android / Chrome
- Grafik-Zoom
- Kapitelmenü
- Scrollbuttons
- PDF-Erstellung
- externe Links
- Piano-Events

## 7. Deployment
- eigenes GitHub-Repository aus dem Mastertemplate
- eigenes Vercel-Projekt
- Node 22.x
