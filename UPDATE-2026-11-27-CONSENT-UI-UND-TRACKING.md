# Consent UI & Tracking – 6.13.0 (27.11.2026)

- Dialog: gelber Hintergrund, dezenter 1px grauer Rahmen, reduzierte Breite (~536px), 12px-Fließtext, 17px-Überschrift, kompaktere Buttons.
- Überschrift: **Einwilligung zur Nutzungsanalyse**. Button: **Nutzungsanalyse zustimmen**.
- Einstellungen: statt „Datenschutz“ nur ein **rahmenloses 26×26px-Zahnrad** unten rechts mit Schatten. Hover oder Tastaturfokus: Erweiterung auf 89px mit Label **Consent**.
- Consent-Version bleibt **v1**, weil ausschließlich die Darstellung und optionale akzeptierte Event-Metrik geändert werden; gespeicherte Zustimmung wird nicht ungefragt zurückgesetzt.
- Neues Fach-Event **`consent.update`** bei einer **neu aktiv erteilten** Zustimmung, nach der Freigabe. Properties: `consent_action=accepted`, `consent_version=1`, `trigger_source=initial_dialog|consent_settings`, `project_id` explizit aus der jeweiligen Anwendung (zusätzlich im Tracking-Kontext).
- PostHog: über bestehende EU-Vercel-Proxy-Strecke /_medi/r, nur wenn VITE_POSTHOG_ENABLED=true, öffentlicher Project Token gesetzt und Consent erteilt.
- Piano: gleiche Events über vorhandenen Tracking-Adapter bei VITE_PIANO_ENABLED=true nach zentraler Registrierung von `consent.update`, `consent_action` und `consent_version` im Piano Data Model. **Kein Essential-Override.**
- **Keine Analytics-Events für Ablehnung/Widerruf** ohne Einwilligung; eine Zustimmungsquote lässt sich mit diesen Events allein nicht ermitteln. Für vollständige CMP-Consent-Statistiken ist eine getrennte, rechtlich geprüfte Messgrundlage nötig.
- Bestehendes PostHog-, Piano-, Consent- und Kundenprojekt-Tracking bleibt unverändert.
- Produktionsveröffentlichung: erst nach separatem Repository-/Vercel-Deploy und Funktionstest.
