import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('Dialog erlaubt Schließen ohne Consent-Änderung nur bei früherer Entscheidung; Datenschutz-Vorlage entfernt', () => {
  const jsx = fs.readFileSync(new URL('../src/consent/AnalyticsConsent.jsx', import.meta.url), 'utf8');
  const app = fs.readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
  assert.match(jsx, /choice !== null &&/);
  assert.match(jsx, /onClick=\{\(\) => setShowPanel\(false\)\}/);
  assert.match(jsx, /aria-label="Datenschutzeinstellungen ohne Änderung schließen"/);
  assert.doesNotMatch(jsx, /storeAnalyticsConsent\(choice\)/);
  assert.doesNotMatch(jsx, /pseudonymisiert|anonymisiert|Bei Zustimmung verwenden wir|Datenschutzhinweise/);
  assert.doesNotMatch(jsx, /ohne Klarnamen/);
  assert.match(jsx, /Die Analyse erfolgt nur mit Ihrer Einwilligung/);
  assert.doesNotMatch(app, /privacyHref/);
  assert.equal(fs.existsSync(new URL('../public/datenschutz.html', import.meta.url)), false);
});

test('Diagnose-Ansicht ist nur per URL-Parameter aktiv und zeigt keinen Token', () => {
  const ui = fs.readFileSync(new URL('../src/tracking/PosthogDiagnostics.jsx', import.meta.url), 'utf8');
  assert.match(ui, /get\("medi_debug"\) === "1"/);
  assert.match(ui, /Testevent senden/);
  assert.match(ui, /disabled=\{!ready\}/);
  assert.doesNotMatch(ui, /token\}/);
  assert.match(ui, /Serverantwort/);
  assert.match(ui, /qa_trace_id/);
});
