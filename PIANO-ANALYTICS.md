# Piano Analytics – Zielstand 08.10.2026 (Mapping v1.2)

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

med.i.scroll Custom Events: `chapter.display`, `page.scroll` sowie – nur falls A/V Insights nicht Zielstandard wird – `video.start`, `video.progress`, `video.complete`. Projektabhängige Interaktionen wie Accordion/Workflow bleiben als bereits implementierte Custom Events bestehen und müssen vor Aktivierung im Piano Data Model freigegeben sein.

`page.display` wird weiterhin gesendet, aber im Template nicht eigenmächtig als `essential` in `consent_items.events` ergänzt, solange die Vidal-Consent-Zuordnung nicht final bestätigt ist.

## Deployment

Tracking bleibt im Paket mit `VITE_PIANO_ENABLED=false` deaktiviert. Aktivierung erst nach Data-Model-, Privacy-/Essential- und Staging-QA. Site: `640794`, Collection Domain: `https://rwwnhth.pa-cd.com`.
