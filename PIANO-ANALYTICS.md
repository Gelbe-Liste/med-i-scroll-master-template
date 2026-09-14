# Piano Analytics – med.i.scroll Mastertemplate v5

Stand: 08.09.2026

## Zielbild

Das Tracking wurde gegenüber v4 auf die vorhandene Vidal-/Gelbe-Liste-Semantik zurückgeführt. Vorhandene Standard-/Bestands-Events werden bevorzugt, neue Custom Events nur dort ergänzt, wo kein passendes bestehendes Event existiert.

### Wiederverwendete Events

- `page.display` – initialer Aufruf des med.i.scroll
- `click.action` – Grafik, PDF, CTA/Links, Navigation und Menü-Interaktionen
- `pop_in.display` – Anzeige des Kapitelmenüs

### Neue Custom Events

- `chapter.display` – Kapitel erstmals zu mindestens 35 % sichtbar
- `page.scroll` – Scroll-Milestones 25/50/75/100; entspricht der aktuellen Piano-Empfehlung für Scroll Tracking
- `video.start`, `video.progress`, `video.complete` – schlankes Video-Reporting, solange AV Insights nicht verbindlich eingesetzt wird

Die frühere Eventstruktur `scroll_depth`, `module_complete`, `image_view_*`, `outbound_click`, `navigation_click`, `pdf_generate_*` wird im Template nicht mehr als eigene Business-Semantik verwendet.

## Bereits vorhandene Properties, die wiederverwendet werden

`page`, `page_url`, `de_page_category`, `de_page_tags`, `product_name`, `product_mol`, `product_titulaire`, `product_ATC_class_code`, `product_ATC_class_name`, `product_UCD10_codes`, `page_type`, `visitor_type`, `article_category`, `pop_in_name`, `pop_in_type`, `click`.

Produkt-Properties werden nur gesetzt, wenn sie in `project.meta.analytics.product` gepflegt sind. Personenbezogene oder Login-bezogene Werte (`user_id`, `occupation`, `speciality_function`, `exercise_mode`) werden im Standalone-Template nicht erzeugt.

## Neue Custom Properties

| Key | Typ | Zweck |
| --- | --- | --- |
| `project_id` | STRING | stabile Projekt-ID |
| `chapter_id` | STRING | technische Kapitel-ID |
| `chapter_number` | INTEGER | Kapitelreihenfolge |
| `chapter_title` | STRING | redaktioneller Kapiteltitel |
| `content_type` | STRING | `hero`, `stats`, `standard`, `steps`, `video`, `sources`, `imprint` |
| `scroll_rate` | INTEGER | 25 / 50 / 75 / 100 |
| `image_id` | STRING | stabile Grafik-ID |
| `zoom_level` | DECIMAL | erste relevante Zoomstufe |
| `document_id` | STRING | stabile PDF-/Dokument-ID |
| `element_id` | STRING | stabile CTA-/Link-ID |
| `destination_path` | STRING | bereinigtes Ziel ohne Query-Parameter |
| `trigger_source` | STRING | `header`, `sources`, `chapter`, `menu` usw. |
| `entry_point` | STRING | `nfc_tag`, `qr_code`, `direct_link` bzw. Kampagnenquelle |
| `video_id` | STRING | stabile Video-ID |
| `video_name` | STRING | redaktioneller Videoname |
| `progress_percent` | INTEGER | 25 / 50 / 75 / 100 |

## Piano Data Management

Vor Aktivierung:

1. Custom Properties im Data Model anlegen/validieren; überwiegend Event Scope.
2. Custom Events `chapter.display`, `page.scroll`, `video.start`, `video.progress`, `video.complete` als **On Site** anlegen.
3. Bei Nutzung der aktuellen `essential`-Konfiguration die neuen Events/Properties in `pdl.consent_items.PA` nur nach interner Datenschutz-/Analytics-Freigabe als `essential` klassifizieren.
4. Erst danach produktives Tracking aktivieren.

Hinweis Video: Falls Vidal A/V Insights verbindlich nutzt, sollten die Custom-Videoevents durch die nativen `av.*`-Events mit `av_content_id` ersetzt werden. Das ist eine gesonderte Analytics-Entscheidung.

## Zentrale Konfiguration

`.env` / Vercel:

```env
VITE_PIANO_ENABLED=true
VITE_PIANO_SITE_ID=640794
VITE_PIANO_COLLECT_DOMAIN=https://rwwnhth.pa-cd.com
```

Im Mastertemplate ist Tracking bewusst deaktiviert (`false`), damit Entwicklung und Vercel-Previews nicht ungeprüft Produktivdaten erzeugen.

Projekt-/Contentwerte werden ausschließlich in `src/project.js` gepflegt. Die technische Tracking-Schicht liegt in `src/tracking/piano.js`.

## KPI-Mapping

- Reach/Visits: `page.display`
- Chapter Reach: `chapter.display` je `chapter_id`
- Scroll Depth: `page.scroll` + `scroll_rate`
- Completion Rate: Anteil der Visits mit `page.scroll` + `scroll_rate=100`
- Graphic Open Rate: `click.action` + `click="Open graphic"`
- PDF Download Rate: `click.action` + `click="Download PDF"`
- CTA CTR: `click.action` + `click="Open external link"`
- Video Start/Progress/Complete: neue Videoevents

## QA vor Livegang

- Data Model: alle neuen Properties korrekt typisiert und validiert.
- Custom Events: On Site und produktiv verfügbar.
- `page.display` genau einmal beim Einstieg.
- `chapter.display` je Kapitel maximal einmal pro App-Aufruf.
- `page.scroll` 25/50/75/100 jeweils einmal.
- Grafik: Open/Close und erster Zoom ohne Eventflut.
- PDF: `Download PDF` erst nach erfolgreicher PDF-Erstellung.
- Links: keine vollständigen URLs mit Query-Parametern als Custom Property.
- Desktop, iOS Safari und Android Chrome testen.

## Erweiterungen ab Mastertemplate v6 (14.09.2026)

### Accordion / FAQ / Praxisfälle
- Event: `accordion.toggle`
- Properties: `chapter_id`, `accordion_id`, `accordion_title`, `accordion_group`, `interaction_state`, `trigger_source`
- `interaction_state`: `open` oder `close`

### Workflow / Swipe
- Event: `workflow.slide`
- Properties: `chapter_id`, `slide_index`, `slide_total`, `slide_title`, `trigger_source`
- `trigger_source`: u. a. `button_previous`, `button_next`, `dot_navigation`, `swipe_left_forward`, `swipe_right_backward`

Die Swipe-Semantik ist bewusst: **links = vorwärts**, **rechts = rückwärts**.


### Frage/Antwort-Akkordeon
- Event: `accordion.toggle`
- `accordion_title`: angeklickte Frage
- `interaction_state`: `open` / `close`
- `trigger_source`: `accordion_question`
- `accordion_id`, `accordion_group`, `chapter_id` und `chapter_title` werden ebenfalls übergeben.
