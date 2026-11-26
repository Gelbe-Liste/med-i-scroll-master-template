> Historische Release-Notiz v6.7. Für aktuellen Stand v6.8 siehe `UPDATE-2026-11-26-v6.8-POSTHOG-FEHLERSUCHE.md`. Die unten beschriebene Datenschutz-Vorlagenseite ist ab v6.8 nicht mehr enthalten.

# Release v6.7 · Gemeinsames Analytics-Consent-Management (26.11.2026)

## Neue Funktionen

- Wiederverwendbare gelbe Consent-Box mit gleichwertiger Ablehnung und Zustimmung.
- Pflicht zur aktiven Einwilligung, **kein stillschweigendes Opt-in**; keine Analytics-Requests vor der Entscheidung.
- Entscheidung wird pro Website-Origin 180 Tage lang im `localStorage` gespeichert (rejected/accepted).
- Über dauerhaft sichtbare Schaltfläche **Datenschutz** jederzeit änderbar; nach Zustimmung heißt die Ablehnungsaktion **Einwilligung widerrufen**.
- Dieselbe Entscheidung steuert **PostHog und Piano**, wobei beide Anbieter weiterhin separat per Umgebungsvariable aktiviert werden.
- Piano-SDK wird erst nach wirksamer Zustimmung geladen. Das bisherige vorzeitige SDK-Laden ist behoben.
- Bei nachträglicher Einwilligung nur die aktuelle Seite nacherfassen; keine historischen Klicks/Scrolls.
- Bei Widerruf stoppt der Versand; PostHog entfernt lokale Besucher-/Session-Kennungen und Piano setzt opt-out.
- Neue Hinweise unter `/datenschutz.html`; diese sind **vor einem echten Kunden-Go-live rechtlich zu vervollständigen**.
- Text fachlich korrigiert: **pseudonymisiert**, nicht anonymisiert (wiedererkennbare zufällige PostHog-Kennung).
- Kein zusätzliches Consent-SDK und keine neue npm-Abhängigkeit.

## Komponenten

- `src/consent/analyticsConsent.js`: lokale, versions- und zeitgebundene Entscheidungsverwaltung.
- `src/consent/AnalyticsConsent.jsx`: identischer UI-Baustein in beiden Templates.
- `src/consent/analyticsConsent.css`: Gelbe-Liste-Gelb, mobil optimiert, barrierearme Buttons.
- `src/tracking/piano.js`: Consent-Gating auf SDK- und Event-Ebene.
- `src/tracking/posthog.js`: vorhandener Adapter unverändert, empfängt `medi:analytics-consent`.

## Validierung und Grenzen

- `npm run test:analytics`: Tests für Entscheidungsverwaltung, PostHog und Piano-Consent-Gating.
- Source-Syntaxprüfung; tatsächlicher Vercel-Build und Live-Ingestion in PostHog bleiben extern zu verifizieren.
- Die Einwilligung wird pro Origin verwaltet: unterschiedliche `*.vercel.app`-Subdomains teilen keine Entscheidung.
- Bereits versendete Daten werden bei Widerruf nicht automatisch nachträglich gelöscht.
- Keine rechtliche Freigabe: Datenempfänger, IP-Verarbeitung, Auftragsverarbeitungsvertrag, Löschfristen, Einwilligungstext und Datenschutzhinweise durch Datenschutzteam prüfen.
