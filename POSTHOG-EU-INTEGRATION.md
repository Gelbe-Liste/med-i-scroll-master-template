# Update v6.11: PostHog-Eventübermittlung erfolgt über `/_medi/r` mit Vercel-Rewrite zur EU-Capture-API. Siehe START-HIER-POSTHOG-v6.11.md.

> **Update v6.8 (26.11.2026):** Der Legacy-Capture-Adapter sendet `api_key` und `distinct_id` in dokumentierter Form. Für nachvollziehbare Fehlersuche `?medi_debug=1` verwenden. Separate Datenschutzinformationen außerhalb der Consent-Box sind vor dem öffentlichen Analytics-Betrieb erforderlich. Siehe `UPDATE-2026-11-26-v6.8-POSTHOG-FEHLERSUCHE.md`.

# Nachtrag v1.5.0: Integrierte Consent-Box – siehe START-HIER-VERCEL.md und CHANGES-2026-11-26-CONSENT.md.

# PostHog EU Cloud + Piano Analytics · Integration v1.4 · 26.11.2026

## Was ist umgesetzt?

- **Piano bleibt erhalten**. Der bestehende `src/tracking/piano.*`-Code wird weiterhin unabhängig über `VITE_PIANO_ENABLED` gesteuert.
- **PostHog erhält dieselben bereits ausgelösten Events** (`page.display`, `click.action`, `pop_in.display`, ggf. `chapter.display`, `page.scroll`, `accordion.toggle`, `workflow.slide` und `video.*`) einschließlich `project_id` und weiterer bestehender Properties. Video-Fallback-Flag betrifft weiterhin **nur Piano**.
- Zusätzlich erzeugt PostHog beim ersten zustimmungsbasierten `page.display` **ein** `$pageview` für die physische Seitenansicht (nicht für jeden virtuellen med.i.tap-Screen). Die `page.display`-Events bilden weiterhin die virtuellen Screen-/Seitenaufrufe ab.
- Kein PostHog-SDK, keine Abhängigkeit, **keine Autocapture-/Session-Replay-Funktion**: Es wird der von PostHog dokumentierte EU-Capture-Endpunkt `POST /_medi/r` genutzt, serverseitig über Vercel weitergeleitet an `https://eu.i.posthog.com/i/v0/e/`. Dies ist ein schlanker, bewusst auf Event Analytics beschränkter Adapter. Für spätere erweiterte PostHog-Produkte kann er durch ein offizielles SDK ersetzt werden.
- Consent-Gate: **keine Verbindung zu PostHog und keine pseudonyme Browserkennung vor explizitem Consent**. Die Möglichkeit, einen Account zu betreiben, ersetzt nicht die Freigabe zur Datenerfassung.
- URL-Query-Parameter und Hashes aus `page_url` und `$current_url` werden ausgeschlossen; aus der URL werden nur erlaubte UTM-Felder übernommen. Offensichtliche PII-Felder/E-Mail-Adressen werden im Adapter blockiert. **Das ist keine vollständige Datenschutzgarantie.**
- Das Event-Payload enthält `$process_person_profile: false`. Nach Consent erhält der Browser eine **pseudonyme, wiedererkennbare zufällige ID** in `localStorage`; die Session-ID (UUIDv7) wird in `sessionStorage` angelegt, nach 30 Min. Inaktivität oder spätestens 24 h erneuert. Beim Widerruf werden beide Kennungen lokal gelöscht. Bereits versandte Events sind nicht rückwirkend gelöscht.

## 1. Eigenes EU-Projekt anlegen

1. `https://eu.posthog.com` öffnen, Organisation und Projekt (z. B. **GLO – med.i Analytics**) anlegen.
2. **Public Project Token** (`phc_…`) unter `Settings > Project` kopieren. **Nie einen Personal API Key (`phx_…`) in `VITE_*` speichern.**
3. In der Vercel-Konfiguration oder lokalen `.env` der Anwendung setzen:

```dotenv
VITE_POSTHOG_ENABLED=true
VITE_POSTHOG_PROJECT_TOKEN=phc_HIER_EIGENEN_PROJEKT_TOKEN_EINFUEGEN
VITE_PIANO_ENABLED=false
```

Beide Templates können den **gleichen Project Token** nutzen. Nach Änderungen an Vite-Umgebungsvariablen neu bauen und ausrollen. Der EU-Endpunkt ist in der Vercel-Rewrite-Regel konfiguriert; der Browser sendet an die eigene Domain `/_medi/r`.

## 2. Consent-Management anbinden (Pflicht vor produktiver Nutzung)

**Neu seit Release v1.5.0:** Das Template enthält jetzt die gelbe Consent-Komponente (`src/consent/*`), die Zustimmung und Widerruf selbst speichert und an PostHog und Piano übergibt. Eine externe CMP ist für die technische Funktion nicht mehr zwingend nötig. Die technische API für eine spätere zentrale Consent-Lösung bleibt erhalten:

```js
// Nur im echten Callback der Consent-Plattform aufrufen:
window.dispatchEvent(new CustomEvent("medi:analytics-consent", {
  detail: { posthog: true, piano: true } // Einwilligung wurde erteilt
}));

// Bei Nichtzustimmung oder Widerruf:
window.dispatchEvent(new CustomEvent("medi:analytics-consent", {
  detail: { posthog: false, piano: false }
}));
```

- Eine frühere Entscheidung ist beim App-Start erneut an die Integration zu übergeben, falls weiterhin gültig.
- Alle Pre-Consent-Events werden verworfen, nicht zwischengepuffert; bei nachträglicher Zustimmung wird nur die aktuell angezeigte Seite als `page.display` plus `$pageview` nacherfasst.
- Analytics kann nach Consent-Änderung nur Daten **ab dem Zeitpunkt der Einwilligung** auswerten. Bei Widerruf keine weiteren Events.
- Bei ausgeschaltetem `VITE_POSTHOG_ENABLED` oder fehlendem Token erfolgt auch mit Consent keinerlei Übertragung.
- Die Freigabe der Rechtsabteilung/Datenschutzbeauftragten, Datenschutzhinweise, AVV/DPA, IP-Capture-Einstellung und Aufbewahrungsdauer sind zusätzlich erforderlich.

## 3. Test ohne produktive Erhebung

In einem isolierten QA-Projekt `VITE_POSTHOG_ENABLED=true` und einen **QA-Project-Token** konfigurieren; nicht mit einem echten Kundentoken in lokalen Tests mischen. Für einen ausdrücklich eingewilligten Testnutzer den Consent-Callback im Browser auslösen. Im Network-Tab nach `/_medi/r` filtern und im PostHog-Activity-Tab die Events prüfen.

| Kontrolle | Erwartung |
|---|---|
| PostHog deaktiviert oder Token fehlt | 0 Requests an `/_medi/r` |
| PostHog aktiv, Consent noch nicht erteilt | 0 Requests und keine `med_i_posthog_*`-Kennungen |
| Consent erteilt | `page.display` und genau ein `$pageview` pro Seitenladung, danach fachliche Events |
| Consent widerrufen | keine neuen Requests, lokale med.i-IDs gelöscht |
| Piano später separat freigegeben | Unabhängiger Versand der gleichen fachlichen Events an beide Provider |

> **Einschränkung:** Ein grüner Quellcode-/Unit-Test bestätigt nicht die reale PostHog-Ingestion. Die Aufnahme im EU-Cloud-Projekt ist erst bestätigt, wenn die Events in der Activity-Ansicht mit dem echten Token erscheinen.

## 4. Dashboard-Vorschlag

**Dashboard A: med.i.scroll – Performance & Engagement**

- Reichweite: `$pageview` nach `project_id`, Unique Visitors nach `distinct_id` bzw. Unique Users.
- Kapitelreichweite: `chapter.display`, Breakdown `chapter_number`/`chapter_id`.
- Scroll-Funnel: `page.scroll`, Filter `scroll_rate` 25, 50, 75, 100.
- Interaktionen: `click.action`, Filter `click`, Breakdown `element_id`, `trigger_source`.
- Downloads: `click.action`, Filter `click = Download PDF`, Breakdown `document_id`.
- Weitere Interaktion: `accordion.toggle` / `workflow.slide`, Breakdown `accordion_id` / `slide_index`.
- Video: `video.start`, `video.progress`, `video.complete` als PostHog-Custom-Events (unabhängig von der Freigabe des Piano-Custom-Video-Fallbacks).

**Dashboard B: med.i.tap – Performance & Engagement**

- Reach: `$pageview` nach `project_id`.
- Modulaufrufe: `click.action` mit `click = Open module`, Breakdown `module_id`.
- Screen Views: `page.display`, Breakdown `module_id`/`screen_id`.
- Dokument-/CTA-Klicks: `click.action`, Breakdown `document_id`/`element_id`.
- PWA: `click.action` mit `install_outcome` (`accepted` bedeutet nur Browserprompt angenommen; `installed` ist eine spätere Bestätigung).

**Reporting-Grundregel:** Für Kundenreports stets `project_id` filtern. Event-Counts, Unique Users, Visits und Screen Views nicht gleichsetzen. Bei Consent-Pflicht misst PostHog nur die Nutzer mit Einwilligung; die Zahlen sind nicht identisch mit aller Reichweite.

## 5. Technische Grenzen

- Der Adapter nutzt ausschließlich PostHogs Capture API (kein vollwertiges PostHog-JS-SDK). Native Features wie Session Replay, Autocapture, Heatmaps, Toolbar und Feature Flags sind nicht implementiert. Für diese beiden Formate ist das bewusst so gewählt.
- Browser-/Trackingblocker können Requests weiterhin verhindern. Mit v6.11 wird `/_medi/r` unter der eigenen Domain genutzt; eine CORS-Freigabe für den direkten PostHog-Browser-Endpunkt wird dadurch nicht mehr benötigt. Die Vercel-Proxy-Konfiguration muss jedoch veröffentlicht sein.
- Seiten/Screen-Navigation werden als `page.display` getrackt; ein physischer `pageview` wird pro Reload erzeugt. Die Session ID (UUIDv7) erlaubt PostHog die Session-Zuordnung, muss aber im Staging geprüft werden.
- Bei fehlendem Netzwerk werden Events nicht offline gepuffert. Die Anwendung selbst funktioniert weiter.
- Der Besuch über verschiedene Projekt-Domains führt zu getrennten anonymen Kennungen. Keine personengebundene Identifizierung.
- **Piano-spezifische Data-Model-Freigabe bleibt ausstehend**; dies wird durch PostHog nicht ersetzt.

## Quellen (technische Referenzen)

- https://posthog.com/docs/getting-started/install (offizieller Capture-Endpunkt)
- https://posthog.com/docs/data/sessions (UUIDv7 Session IDs)
- https://posthog.com/docs/data/anonymous-vs-identified-events (anonyme Verarbeitung)
- https://posthog.com/docs/product-analytics/dashboards
