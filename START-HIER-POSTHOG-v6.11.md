# med.i.scroll v6.11 – Lösung für PostHog-Netzwerkfehler auf Vercel

## Warum dieses Update?
Bei v6.10 zeigte die Diagnose 4 HTTP-Versuche und 0 erfolgreiche Antworten (Network-Fehler / Blocker / CORS). Das beweist einen fehlgeschlagenen Browsertransport, jedoch nicht abschließend die Ursache. v6.11 versendet Events nach Einwilligung über `/_medi/r` auf der **gleichen Vercel-Domain**. Die Vercel-Rewrite-Regel in `vercel.json` leitet das Ereignis an `https://eu.i.posthog.com/i/v0/e/` weiter. Damit entfällt der browserseitige Cross-Origin-Request zum PostHog-Server. Die Lösung folgt dem offiziellen Vercel-Reverse-Proxy-Konzept: https://posthog.com/docs/advanced/proxy/vercel

## Bereitstellung
1. Diese neue Version vollständig in das **bestehende** Projekt `med-i-scroll-template` deployen. Wichtig: `vercel.json` muss im Projektroot mit übernommen werden. Bei Vercel-Einstellungen mit einem abweichenden *Root Directory* sicherstellen, dass die verwendete `vercel.json` im tatsächlich gebauten Root liegt.
2. Die vorhandenen Environment Variables **Production** beibehalten: `VITE_POSTHOG_ENABLED=true`, `VITE_POSTHOG_PROJECT_TOKEN=phc_...`, `VITE_POSTHOG_DEPLOY_ENV=production`, `VITE_PIANO_ENABLED=false`. Project ID ist nicht erforderlich.
3. Neue Production-Build erstellen und auf `https://med-i-scroll-template.vercel.app/` freischalten.
4. Öffnen: https://med-i-scroll-template.vercel.app/?medi_debug=1 – ggf. Analytics-Einwilligung erteilen.
5. „Testevent senden“ wählen. Diagnose muss „Übertragung: Vercel Same-Origin Proxy (/_medi/r)“ zeigen.
6. Browser F12 → Netzwerk → Fetch/XHR → nach `_medi/r` filtern. Erwartet ist ein **POST an die eigene Website**, kein direkter Browser-Request an `eu.i.posthog.com`.
7. Prüfen, ob HTTP 2xx angezeigt wird; erst danach in PostHog EU → Activity → Last 24h nach `med.i.qa` suchen (alle Filter ausschalten). HTTP 2xx ist noch keine Garantie für erfolgreiche Ingestion.

## Fehlersuche nach dem Update
- **404 bei `_medi/r`**: Rewrite fehlt im aktuell veröffentlichten Deployment; falscher Project Root oder alte Version deployed.
- **4xx bei `_medi/r`**: Request und Response im DevTools-Network-Tab prüfen, ggf. Token/Anfrageformat.
- **5xx bei `_medi/r`**: Upstream/Proxy nicht erreichbar; Vercel-Logs prüfen.
- **„Failed to fetch“, ohne HTTP**: Browser-/Netzwerkfilter oder andere Netzwerkrichtlinie prüfen; Browser-Konsole konsultieren.
- **HTTP 200, aber keine Events**: Token-Endung in Diagnose mit geöffnetem PostHog EU-Projekt vergleichen, Activity-Zeitraum/Filter prüfen, PostHog Data management → Ingestion warnings konsultieren.

## Datenschutz
Die PostHog-Einwilligung ist weiterhin zwingende Voraussetzung; ohne sie werden keine Events übermittelt. PostHog-Events gehen nur nach Opt-in über Vercel an PostHog EU. Kein PostHog-SDK/Session Replay/Autocapture. Bestehende Besucherkennungen bleiben pseudonym und keine Person-Profile werden angelegt. Die Verarbeitung und Datenschutzhinweise bedürfen weiterhin einer rechtlichen Freigabe. Der Proxy ist keine Anonymisierung.

## Sonstiges
- Alle 30 Piano-Properties und das Event-Mapping bleiben bestehen.
- Die bestehende gelbe Consent-Box bleibt mit dem gekürzten Text und X-Button erhalten.
- QA-Events `med.i.qa` durch `qa_only = true` aus Kundenreports ausschließen.
- Vercel kann für die Proxy-Requests Netzwerkkosten berechnen; für künftige Hochlastprojekte Kosten prüfen.
