# AKTUELL: med.i.scroll v6.11 – Netzwerkfehlerlösung

Bitte zuerst `START-HIER-POSTHOG-v6.11.md` lesen. Die neue Version benötigt die Rewrite-Regel aus `vercel.json`, um die Event-Requests über die eigene Vercel-Domain zu senden.

---

# START HIER – v6.8 · Consent + PostHog EU + Piano auf Vercel Production

**Neuer Stand:** 26.11.2026 · Consent-/Diagnose-Release v1.6.0

## 1. Quellcode bereitstellen

- Diese Version entpacken, **den Inhalt des obersten Projektordners** in das mit Vercel verbundene Git-Repository übernehmen, committen und auf den Produktionsbranch pushen.
- Alternativ aus dem Projektordner `vercel --prod` verwenden. Ein ZIP als Datei wird nicht direkt von Vercel als Anwendung deployed.
- Existierende Inhalte und App-Navigation bleiben erhalten. Die Consent-Box ist gekürzt und besitzt nach erneuter Öffnung ein Schließen-X. Zusätzlich ist eine Diagnoseansicht verfügbar.
- Nach dem Build die reguläre Domain testen. Prüfen, ob die gelbe Consent-Box beim ersten Besuch sichtbar ist.

## 2. Environment Variables in Vercel **für Production**

```dotenv
VITE_POSTHOG_ENABLED=true
VITE_POSTHOG_PROJECT_TOKEN=phc_HIER_PROJECT_TOKEN
VITE_POSTHOG_DEPLOY_ENV=production
VITE_PIANO_ENABLED=false
VITE_PIANO_ESSENTIAL_APPROVED=false
VITE_PIANO_CUSTOM_VIDEO_EVENTS=false
```

Der numerische Project ID wird nicht benötigt. Der öffentliche `phc_...`-Token wird nicht fest in den ZIP-Quellcode geschrieben. Änderungen an Vercel-Variablen werden **erst nach neuem Production-Build** wirksam.

## 3. Nutzer-Einwilligung (jetzt integriert)

- Erster Aufruf (oder nach Ablauf der lokalen Entscheidung): gelbe Consent-Box, ohne Tracking.
- `Nur notwendige Funktionen`: Anwendung nutzbar, PostHog und Piano erfassen nichts.
- `Analytics zustimmen`: bei korrekt hinterlegtem Token Beginn der PostHog-Erfassung; Piano nur bei separater Freigabe und Aktivierung.
- Nach Entscheidung: kleine Schaltfläche **Datenschutz**, darüber jederzeit erneut auswählen bzw. Zustimmung widerrufen.
- Entscheidung bleibt 180 Tage pro Domain bestehen. Kein rückwirkendes Nachsenden vorheriger Interaktionen.
- Für beide Analytics-Anbieter gilt dieselbe Einwilligung, soweit derselbe Zweck vom Datenschutzteam freigegeben wird.

## 4. Funktionsprüfung über die Production-Domain

1. Seite im privaten Browserfenster aufrufen. Banner muss sichtbar sein.
2. F12 / Netzwerk → nach `/_medi/r` suchen. **Vor Zustimmung: keine Requests.**
3. `Nur notwendige Funktionen` wählen, einige Kapitel bzw. Screens bedienen. Weiterhin **keine Requests**.
4. Über **Datenschutz** Einstellungen öffnen, `Analytics zustimmen` wählen. Netzwerkrequests prüfen; PostHog → Activity → Last hour: z. B. `page.display` und `$pageview`.
5. Weitere fachliche Interaktionen ausführen und Events nach `project_id` filtern.
6. Über **Datenschutz → Einwilligung widerrufen** Zustimmung zurücknehmen. Neue Interaktionen dürfen keine Requests mehr auslösen.
7. Seite aktualisieren: Ablehnung bleibt gespeichert. Die Entscheidung wird nach max. 180 Tagen erneut abgefragt.

**Hinweis:** Testevents auf der Production-Domain tragen `deployment_environment=production`. Für Kundenreports Testzeitraum separat notieren/ausfiltern. Event-Eingang in PostHog ist erst mit realem Token und Netzwerkrequests bestätigt.

## 5. Datenschutz-Freigabe vor breiter Datenerhebung

Die unvollständige Vorlage `/datenschutz.html` wurde auf Wunsch entfernt. **Vor einer regulären Analytics-Nutzung müssen dennoch transparente Datenschutzhinweise öffentlich zugänglich sein**, z. B. in der zentralen Vidal-MMI-Datenschutzerklärung, die zuvor explizit um diese Anwendungen und PostHog/Piano zu ergänzen und freizugeben ist (Zweck, Anbieter, IDs, IP-Verarbeitung, EU-Hosting, Rechtsgrundlage, Speicherdauer, Widerruf und Rechte). Es ist nicht ausreichend, diese Informationen vollständig wegzulassen.

Der kompakte Consent-Text lautet jetzt „ohne Klarnamen“. Vollständige Anonymisierung wäre wegen der persistenten zufälligen `distinct_id` nicht korrekt.

## 6. Gezielte Production-Diagnose und Tests

1. Nach dem neuen Deployment `https://med-i-scroll-template.vercel.app/?medi_debug=1` aufrufen.
2. Diagnose muss anzeigen: Integration aktiv **Ja**, Token konfiguriert **Ja**, Analytics-Einwilligung **Ja** (ggf. Banner zustimmen).
3. **Testevent senden** klicken, HTTP-Status ablesen und PostHog Activity auf `med.i.qa` prüfen. Testevents tragen `qa_only=true`.
4. Bei fehlender Integration oder Token Vercel Production-Variablen korrigieren und neu bauen; bei HTTP-Fehlern Browser-Netzwerk/Blocker/CSP prüfen; bei 200 aber keiner Sichtbarkeit das EU-Projekt und den Token abgleichen.
5. Schließen-Test: nach einer bestehenden Entscheidung Datenschutz öffnen und X betätigen; Entscheidung darf sich nicht ändern.

## 7. Weitere technische Hinweise

- `npm ci && npm run build` in einer Umgebung mit Paketregister oder das Vercel-Build-Log prüfen.
- `npm run test:analytics` (Node 22) ausführen.
- Wenn kein Request nach Zustimmung: Vercel Production-Variablen, Redeployment, PostHog-EU-Projekt/Token, Adblocker und `connect-src`-CSP prüfen.
- Falls Piano künftig freigegeben wird: vor Aktivierung Data Model, SDK-Consent-Modus und tatsächliche Event-Übermittlung mit Analytics/Datenschutz abstimmen.
