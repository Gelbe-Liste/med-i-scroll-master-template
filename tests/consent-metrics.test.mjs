import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { buildConsentAcceptanceEvent, CONSENT_VERSION } from "../src/consent/analyticsConsent.js";

test("Nur eine neue ausdrückliche Zustimmung wird als Consent-Analytics vorbereitet", () => {
  assert.deepEqual(buildConsentAcceptanceEvent(null, "accepted"), {
    consent_action: "accepted", consent_version: CONSENT_VERSION, trigger_source: "initial_dialog",
  });
  assert.deepEqual(buildConsentAcceptanceEvent("rejected", "accepted"), {
    consent_action: "accepted", consent_version: CONSENT_VERSION, trigger_source: "consent_settings",
  });
  for (const prev of [null, "accepted", "rejected"]) {
    assert.equal(buildConsentAcceptanceEvent(prev, "rejected"), null, "Eine Ablehnung darf niemals gesendet werden");
  }
  assert.equal(buildConsentAcceptanceEvent("accepted", "accepted"), null);
});

test("UI: kompaktes Dialogdesign, neue Bezeichnungen und rahmenloser Hover-Consent-Button", () => {
  const jsx = fs.readFileSync(new URL("../src/consent/AnalyticsConsent.jsx", import.meta.url), "utf8");
  const css = fs.readFileSync(new URL("../src/consent/analyticsConsent.css", import.meta.url), "utf8");
  assert.match(jsx, /Einwilligung zur Nutzungsanalyse/);
  assert.match(jsx, /Nutzungsanalyse zustimmen/);
  assert.match(jsx, /className="medi-consent__gear"/);
  assert.match(jsx, /aria-label="Consent-Einstellungen öffnen"/);
  assert.match(jsx, /project_id: projectId/);
  assert.match(css, /width: min\(536px/);
  assert.match(css, /border: 1px solid rgba\(77, 86, 99, \.34\)/);
  assert.match(css, /width: 26px; height: 26px/);
  assert.match(css, /width: 89px/);
  assert.match(css, /border: none/);
  const afterConsent = jsx.indexOf('storeAnalyticsConsent(next)');
  const thenTracking = jsx.indexOf('trackEvent("consent.update", { ...consentMetrics');
  assert.ok(afterConsent !== -1 && thenTracking > afterConsent, "Erst Zustimmen, dann Event");
});
