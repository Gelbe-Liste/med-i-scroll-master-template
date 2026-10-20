# Piano Analytics – Zielstand 20.10.2026 (Mapping v1.3)

## Format

- `page_type`: `med.i.scroll`
- `article_category`: `Informationsseite` (Pagetype aus der Vidal-Liste)
- `de_page_category`: [] (nur Werte aus Specialty + Content Type)
- `is_PAP`: `1`
- `visitor_type`: `Not logged`

Mastertemplate: Pagetype „Informationsseite“ als neutraler Default; Specialty und Content Type sind projektspezifisch aus den Vidal-Listen zu setzen.

## Acquisition / UTM

Die frühere Custom-Property `entry_point` wird **nicht mehr verwendet**. Für Kampagnen- und Quellenattribution werden die in Piano bereits vorhandenen Dimensionen **UTM Medium**, **UTM Source** und **UTM Campaign** genutzt. Die konkrete UTM-Wertelogik für NFC, QR und Direct Link wird zentral mit Vidal Analytics/Marketing festgelegt.

## Product Properties

`product_name`, `product_mol`, `product_titulaire`, `product_ATC_class_code`, `product_ATC_class_name` und `product_UCD10_codes` dürfen nur bei einer echten Pharmindex-API-Verknüpfung mit den dort gelieferten MMI-Bezeichnungen befüllt werden. In diesem Projekt werden sie daher aktuell nicht gesendet.

`box_names` ist Medibox-spezifisch und wird nicht verwendet.

## Events

Bestandssemantik: `page.display`, `click.action`, `pop_in.display`.

med.i.scroll Custom Events: `chapter.display`, `page.scroll`; Video-Fallback `video.start`, `video.progress`, `video.complete` nur bei Freigabe statt A/V Insights. Projekte mit Accordion/Workflow nutzen zusätzlich `accordion.toggle` und `workflow.slide` mit den 7 dafür definierten Properties. Interne Sprungziele werden als `target_chapter_id` erfasst (nicht über `destination_path`).

`page.display` wird weiterhin gesendet, aber im Template nicht eigenmächtig als `essential` in `consent_items.events` ergänzt, solange die Vidal-Consent-Zuordnung nicht final bestätigt ist.

## Deployment

Tracking bleibt im Paket mit `VITE_PIANO_ENABLED=false` deaktiviert. Aktivierung erst nach Data-Model-, Privacy-/Essential- und Staging-QA. Site: `640794`, Collection Domain: `https://rwwnhth.pa-cd.com`.

## Sichtbarkeit und Wertelisten (Mapping v1.3)

- `chapter.display`: je Kapitel einmal pro Page Load, wenn ≥ 35 % der kleineren Höhe aus Kapitel und Viewport sichtbar sind. Langkapitel werden zusätzlich auf Scroll/Resize geprüft.
- `workflow.slide`: nur nach tatsächlicher Sichtbarkeit des Karussells; beim ersten sichtbaren Slide `trigger_source=viewport`, danach bei Interaktionen tatsächliche Quelle. Wiederholte Sichtbarkeit ohne Indexwechsel wird nicht erneut gezählt.
- `content_type`: `hero | stats | standard | steps | video | sources | imprint | cta | faq | cases | workflow_slide` (je nach Komponenten und Projekt).
- `destination_path`: nur Host + Pfad ohne Query/Hash; interne Sprungziele per `target_chapter_id`.
- Das Tracking wird mit `VITE_PIANO_ENABLED=false` ausgeliefert. `VITE_PIANO_ESSENTIAL_APPROVED=false` verhindert Essential-Overrides, bis die zentrale Datenschutz-Freigabe vorliegt (einschließlich `page.display`).
- Das SDK kann nach einem Ladefehler bei erneutem `initPianoTracking`-Aufruf erneut initialisiert werden.

- Custom-Videoevents sind zusätzlich über `VITE_PIANO_CUSTOM_VIDEO_EVENTS=false` standardmäßig abgeschaltet; Freigabe nur bei dokumentierter Entscheidung gegen A/V Insights.
