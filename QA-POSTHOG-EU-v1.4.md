> **Update v6.11:** Für Browser-Network-Tests gilt der Same-Origin-Endpunkt `/_medi/r`, nicht die alte direkte EU-Domain.

# QA-Abnahme PostHog EU · Version 1.4 (26.11.2026)

## Automatisch geprüft

- `npm run test:analytics` (Node 22, ohne npm-Pakete): Event-Gate ohne Consent, anonymes `$pageview`/`page.display` nach Consent, UUIDv7, `project_id`, UTM-Sanitizing, PII-Schutz, Widerruf.
- `node --check` auf JS-Modul und (bei med.i.scroll) `piano.js`.
- med.i.tap: isolierter TypeScript-Check der Tracking-Dateien mit ImportMeta-Test-Shim und `.d.ts`, ohne React-Typen.
- Static Review: `trackEvent` bleibt zentraler Tracking-Einstiegspunkt für Piano und PostHog. Weitere Komponenten wurden nicht verändert.

## Nicht durchgeführt / offene Freigaben

- `npm ci`/kompletter `npm run build`: Pakete in der Offline-Umgebung nicht vollständig verfügbar. **Technische End-to-End-Build-Freigabe steht aus.**
- Live-Ingestion-Test mit eigenem EU-Projekt (noch kein Token des Nutzers vorhanden).
- Einwilligungsanbindung an die tatsächlich eingesetzte CMP und Datenschutzprüfung.
- Fachliche Prüfung des PostHog-Dashboards mit echten Eventmengen sowie KPI-Abgleich zu Piano (nach dessen Freigabe).

## Unbedingt im Staging prüfen

1. `.env`/Vercel: `VITE_POSTHOG_ENABLED=true` und EU-Projekt-Token `phc_…` setzen; `VITE_PIANO_ENABLED=false` lassen.
2. Vor Consent: Browser Network zeigt **keine** Anfragen an `/_medi/r`; keine `med_i_posthog_*`-Kennungen.
3. Nach erlaubter Zustimmung: Activity-Ansicht enthält `page.display` und `$pageview`, beide mit `project_id`.
4. Alle vorgesehenen Inhaltsinteraktionen auslösen; im PostHog-Eventstream auf IDs/Typen, Scopes, Werte prüfen.
5. Einwilligung widerrufen, erneut klicken: keine neuen Requests; Kennungen aus Local/Session Storage entfernt.
6. Browser mit Tracking-Blocker, iOS/PWA, Offline/Online und CSP testen.
7. Zwei Anwendungen mit einem Projekt-Token und unterschiedlichen `project_id`-Werten auf separaten Domains testen.
8. Erst nach Data-Model- und Privacy-Freigabe: Piano separat aktivieren und Zählsemantik vergleichen.
