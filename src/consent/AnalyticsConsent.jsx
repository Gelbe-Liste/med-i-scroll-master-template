import { useEffect, useState } from "react";
import {
  CONSENT_STORAGE_KEY,
  readAnalyticsConsent,
  storeAnalyticsConsent,
  broadcastAnalyticsConsent,
  buildConsentAcceptanceEvent,
} from "./analyticsConsent.js";
import { trackEvent } from "../tracking/piano";
import "./analyticsConsent.css";

/** Einheitliche Consent-Oberfläche für med.i.scroll und med.i.tap. */
export default function AnalyticsConsent({ projectId } = {}) {
  const [choice, setChoice] = useState(readAnalyticsConsent);
  const [showPanel, setShowPanel] = useState(() => readAnalyticsConsent() === null);

  useEffect(() => {
    // Vorherige Entscheidung übernehmen. Ohne Einwilligung keinerlei Analytics-Requests.
    broadcastAnalyticsConsent(readAnalyticsConsent());
    const onStorage = (event) => {
      if (event.key !== CONSENT_STORAGE_KEY && event.key !== null) return;
      const next = readAnalyticsConsent();
      setChoice(next);
      setShowPanel(next === null);
      broadcastAnalyticsConsent(next);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    // Schließen ohne Änderung ist ausschließlich bei vorheriger Entscheidung möglich.
    if (!showPanel || choice === null) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setShowPanel(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showPanel, choice]);

  const decide = (next) => {
    const consentMetrics = buildConsentAcceptanceEvent(choice, next);
    // ZUERST die ausdrückliche Einwilligung setzen und an Tracking-Adapter senden.
    storeAnalyticsConsent(next);
    // Nur ein neu erteiltes Opt-in darf als Analytics-Event gesendet werden.
    // Ablehnung und Widerruf verlassen das Gerät NICHT über Analytics.
    if (consentMetrics) trackEvent("consent.update", { ...consentMetrics, ...(projectId ? { project_id: projectId } : {}) });
    setChoice(next);
    setShowPanel(false);
  };

  return (
    <>
      {showPanel ? (
        <section className="medi-consent" role="dialog" aria-modal="false" aria-labelledby="medi-consent-title" aria-describedby="medi-consent-description">
          <div className="medi-consent__heading">
            <span className="medi-consent__shield" aria-hidden="true">✓</span>
            <h2 id="medi-consent-title">Einwilligung zur Nutzungsanalyse</h2>
            {choice !== null && (
              <button type="button" className="medi-consent__close" aria-label="Datenschutzeinstellungen ohne Änderung schließen" title="Schließen – Auswahl beibehalten" onClick={() => setShowPanel(false)}>×</button>
            )}
          </div>
          <p>Wir möchten verstehen, wie unsere medizinischen Informationsangebote genutzt werden, um ihre Qualität und Benutzerfreundlichkeit zu verbessern.</p>
          <p id="medi-consent-description">Hierzu erfassen wir Ihre Nutzungsdaten wie Kapitelaufrufe, Scrolltiefe und Interaktionen. Die Analyse erfolgt nur mit Ihrer Einwilligung. Sie können diese jederzeit widerrufen.</p>
          <div className="medi-consent__actions">
            <button type="button" className="medi-consent__button medi-consent__button--reject" onClick={() => decide("rejected")}>{choice === "accepted" ? "Einwilligung widerrufen" : "Nur notwendige Funktionen"}</button>
            <button type="button" className="medi-consent__button medi-consent__button--accept" onClick={() => decide("accepted")}>Nutzungsanalyse zustimmen</button>
          </div>
        </section>
      ) : (
        <button type="button" className="medi-consent__manage" onClick={() => setShowPanel(true)} aria-label="Consent-Einstellungen öffnen" title="Consent">
          <svg className="medi-consent__gear" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
            <path d="M19.2 13.6a1.7 1.7 0 0 0 .34 1.88l.04.05-1.9 1.9-.05-.04a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.04 1.56V19H9.29v-.39a1.7 1.7 0 0 0-1.04-1.56 1.7 1.7 0 0 0-1.88.34l-.05.04-1.9-1.9.04-.05a1.7 1.7 0 0 0 .34-1.88 1.7 1.7 0 0 0-1.56-1.04H3v-2.7h.39a1.7 1.7 0 0 0 1.56-1.04 1.7 1.7 0 0 0-.34-1.88l-.04-.05 1.9-1.9.05.04a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.04-1.56V5h5.42v.39a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.88-.34l.05-.04 1.9 1.9-.04.05a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.56 1.04H21v2.7h-.39a1.7 1.7 0 0 0-1.41 1.46Z" />
          </svg>
          <span className="medi-consent__manage-label" aria-hidden="true">Consent</span>
        </button>
      )}
    </>
  );
}
