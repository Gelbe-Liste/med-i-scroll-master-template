> **Historische Dokumentation einer älteren Version.** Für v6.11 gilt ausschließlich die aktualisierte Anleitung `START-HIER-POSTHOG-v6.11.md`. Der Browser sendet jetzt nicht mehr direkt an `eu.i.posthog.com`.

# med.i.scroll v6.10 – PostHog EU: Diagnose & Consent

## Was ist neu?
- Consent-Text gekürzt: „Die Analyse erfolgt nur mit Ihrer Einwilligung.“
- Gelbe Consent-Box, Widerruf und X-Button bleiben erhalten.
- Diagnose `?medi_debug=1` zeigt jetzt HTTP-Status und eine **begrenzte, tokenfreie Zusammenfassung** der PostHog-Serverantwort.
- Ein manuell versendetes `med.i.qa`-Event bekommt eine individuelle `qa_trace_id`.
- Das Ende des öffentlichen Project Tokens wird maskiert angezeigt. Es dient nur zum **lokalen Abgleich** mit PostHog → Settings → Project → General.

## Produktions-Deployment
1. v6.10 über den bisherigen Weg in dasselbe Vercel-Projekt `med-i-scroll-template` deployen.
2. Die vier bestehenden Production-Variablen unverändert lassen: `VITE_POSTHOG_ENABLED=true`, `VITE_POSTHOG_PROJECT_TOKEN=phc_…`, `VITE_POSTHOG_DEPLOY_ENV=production`, `VITE_PIANO_ENABLED=false`.
3. Bei Änderungen an Environment Variables **neues Build** erzeugen. Nicht die `.env.example` im ZIP ändern.
4. Öffnen: https://med-i-scroll-template.vercel.app/?medi_debug=1
5. „Analytics zustimmen“ wählen, danach „Testevent senden“ und den HTTP-Status, die Serverantwort und die Testkennung notieren.
6. PostHog EU → richtiges Projekt → Activity → Events; Zeitraum „Last hour“ oder „Last 24 hours“ auswählen, alle Eventfilter entfernen, Filter für Testnutzer ausschalten. Eventname `med.i.qa` suchen.
7. Bei fehlendem Event → PostHog → Data management → Ingestion warnings prüfen. Projekt-Token-Endung in der Diagnose mit dem Token im geöffneten PostHog-Projekt abgleichen.
8. Für technische Fehler im Browser F12 → Netzwerk → Filter `eu.i.posthog.com` → letzten `i/v0/e/`-Request anklicken → HTTP-Status und Response-Text vergleichen. Den Token nicht an Dritte weitergeben, auch wenn er ein öffentlicher Client-Token ist.

## Grenzen
- Ein HTTP-200-Status sagt nur, dass PostHog die Capture-Anfrage angenommen hat, **nicht**, dass das Event tatsächlich im richtigen Projekt gespeichert und sichtbar ist.
- Der Zustand in einem externen PostHog-Konto kann aus diesem ZIP nicht ausgelesen werden. Die tatsächliche Erfassung braucht einen Live-Test im Vercel-Deployment.
- Neue Events werden nur mit aktiver Consent-Einwilligung gesendet; der QA-Modus aktiviert Consent nicht automatisch.
- `med.i.qa` sollte aus Kundenreports ausgeschlossen werden (`qa_only = true`).
- Vor produktiver Auswertung bleibt eine Datenschutzfreigabe erforderlich.

Dokumentation zur Event-Annahme: https://posthog.com/docs/api
