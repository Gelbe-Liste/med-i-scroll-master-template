# Update 08.10.2026 – Piano Analytics Mapping v1.2

- `page_type` auf `med.i.scroll` gesetzt.
- `article_category` an Vidal-Pagetype-Taxonomie angebunden: `Informationsseite`.
- `de_page_category` auf Vidal Specialty/Content-Type-Taxonomien umgestellt: [].
- `is_PAP=1` als persistenter gemeinsamer Kontext gesetzt.
- Custom-Property `entry_point` vollständig entfernt; Acquisition erfolgt über vorhandene Piano-UTM-Dimensionen.
- `box_names` aus dem Template-Consent-Mapping entfernt.
- Manuelle/redaktionelle `product_*`-Befüllung aus `page.display` entfernt; nur noch Pharmindex-API-basiert zulässig.
- `page.display` nicht mehr eigenmächtig als `essential` Event deklariert; finale Zuordnung bleibt Vidal Analytics/Privacy vorbehalten.
- Piano-Dokumentation und Environment-Beispiel auf Stand 08.10.2026 aktualisiert.
