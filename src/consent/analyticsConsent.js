// Gemeinsame, versionsgebundene Einwilligung für PostHog und Piano Analytics.
// Lokal je Origin gespeichert: Vercel-Domains teilen die Entscheidung NICHT domainübergreifend.
// Ausschließlich die Einwilligungsentscheidung wird vor Analytics-Zustimmung gespeichert.
export const CONSENT_STORAGE_KEY = "med_i_analytics_consent_v1";
export const CONSENT_VERSION = "1";
export const CONSENT_MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;
const consentEventName = "medi:analytics-consent";

function storage() {
  try { return window.localStorage; } catch { return null; }
}

export function readAnalyticsConsent() {
  try {
    const raw = storage()?.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data.version !== CONSENT_VERSION || !["accepted", "rejected"].includes(data.choice)
      || typeof data.at !== "number" || Date.now() < data.at || Date.now() - data.at > CONSENT_MAX_AGE_MS) {
      return null;
    }
    return data.choice;
  } catch { return null; }
}

export function broadcastAnalyticsConsent(choice) {
  // Andere Analytics-Adapter können denselben Vertrag wiederverwenden.
  const granted = choice === "accepted";
  window.dispatchEvent(new CustomEvent(consentEventName, {
    detail: { posthog: granted, piano: granted, source: "med-i-consent-v1" }
  }));
}

export function storeAnalyticsConsent(choice) {
  if (!["accepted", "rejected"].includes(choice)) throw new Error("Ungültige Einwilligungsentscheidung");
  try {
    storage()?.setItem(CONSENT_STORAGE_KEY, JSON.stringify({
      version: CONSENT_VERSION, choice, at: Date.now()
    }));
  } catch { /* Private-Browsing: Entscheidung nur für die laufende Seite */ }
  broadcastAnalyticsConsent(choice);
}
