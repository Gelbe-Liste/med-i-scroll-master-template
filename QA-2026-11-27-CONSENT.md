# Automatisierte Consent-Tests (inklusive expliziter Projekt-ID)

```
TAP version 13
# Subtest: Nur eine neue ausdrückliche Zustimmung wird als Consent-Analytics vorbereitet
ok 1 - Nur eine neue ausdrückliche Zustimmung wird als Consent-Analytics vorbereitet
  ---
  duration_ms: 2.083361
  type: 'test'
  ...
# Subtest: UI: kompaktes Dialogdesign, neue Bezeichnungen und rahmenloser Hover-Consent-Button
ok 2 - UI: kompaktes Dialogdesign, neue Bezeichnungen und rahmenloser Hover-Consent-Button
  ---
  duration_ms: 4.157599
  type: 'test'
  ...
# Subtest: Dialog erlaubt Schließen ohne Consent-Änderung nur bei früherer Entscheidung; Datenschutz-Vorlage entfernt
ok 3 - Dialog erlaubt Schließen ohne Consent-Änderung nur bei früherer Entscheidung; Datenschutz-Vorlage entfernt
  ---
  duration_ms: 1.788528
  type: 'test'
  ...
# Subtest: Diagnose-Ansicht ist nur per URL-Parameter aktiv und zeigt keinen Token
ok 4 - Diagnose-Ansicht ist nur per URL-Parameter aktiv und zeigt keinen Token
  ---
  duration_ms: 0.777508
  type: 'test'
  ...
# Subtest: Consent wird nicht implizit gewährt; erlaubt Ablehnung, spätere Zustimmung, Widerruf und Ablauf
ok 5 - Consent wird nicht implizit gewährt; erlaubt Ablehnung, spätere Zustimmung, Widerruf und Ablauf
  ---
  duration_ms: 7.629427
  type: 'test'
  ...
# Subtest: normaler Browser-Tab ist kein Standalone-Modus
ok 6 - normaler Browser-Tab ist kein Standalone-Modus
  ---
  duration_ms: 1.207354
  type: 'test'
  ...
# Subtest: iOS Home-Bildschirm Standalone
ok 7 - iOS Home-Bildschirm Standalone
  ---
  duration_ms: 0.286721
  type: 'test'
  ...
# Subtest: Display-Mode standalone über CSS Media Query
ok 8 - Display-Mode standalone über CSS Media Query
  ---
  duration_ms: 0.25263
  type: 'test'
  ...
# Subtest: fehlende APIs werden sicher behandelt
ok 9 - fehlende APIs werden sicher behandelt
  ---
  duration_ms: 0.353571
  type: 'test'
  ...
# Subtest: Piano SDK und Events warten auf Consent; Widerruf stoppt Übermittlung
ok 10 - Piano SDK und Events warten auf Consent; Widerruf stoppt Übermittlung
  ---
  duration_ms: 17.38693
  type: 'test'
  ...
# Subtest: Vercel same-origin PostHog proxy routes only capture to EU Cloud
ok 11 - Vercel same-origin PostHog proxy routes only capture to EU Cloud
  ---
  duration_ms: 3.146098
  type: 'test'
  ...
# Subtest: PostHog adapter: Consent, events, sessions and revocation
ok 12 - PostHog adapter: Consent, events, sessions and revocation
  ---
  duration_ms: 15.791583
  type: 'test'
  ...
1..12
# tests 12
# suites 0
# pass 12
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 666.896898

```
