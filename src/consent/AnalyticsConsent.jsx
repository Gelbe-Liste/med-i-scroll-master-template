import { useEffect, useState } from "react";
import { CONSENT_STORAGE_KEY, readAnalyticsConsent, storeAnalyticsConsent, broadcastAnalyticsConsent } from "./analyticsConsent.js";
import "./analyticsConsent.css";

/** Wiederverwendbar in med.i.scroll und med.i.tap. */
export default function AnalyticsConsent() {
  const [choice, setChoice] = useState(readAnalyticsConsent);
  const [showPanel, setShowPanel] = useState(() => readAnalyticsConsent() === null);

  useEffect(() => {
    // Bei erneutem Besuch den gespeicherten Consent an beide Tracking-Adapter übergeben.
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
    // ESC ist nur zulässig, wenn eine frühere Entscheidung vorliegt.
    if (!showPanel || choice === null) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setShowPanel(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showPanel, choice]);

  const decide = (next) => {
    storeAnalyticsConsent(next);
    setChoice(next);
    setShowPanel(false);
  };

  return (
    <>
      {showPanel ? (
        <section className="medi-consent" role="dialog" aria-modal="false" aria-labelledby="medi-consent-title" aria-describedby="medi-consent-description">
          <div className="medi-consent__heading">
            <span className="medi-consent__shield" aria-hidden="true">✓</span>
            <h2 id="medi-consent-title">Datenschutz &amp; Nutzungsanalyse</h2>
            {choice !== null && (
              <button type="button" className="medi-consent__close" aria-label="Datenschutzeinstellungen ohne Änderung schließen" title="Schließen – Auswahl beibehalten" onClick={() => setShowPanel(false)}>×</button>
            )}
          </div>
          <p>Wir möchten verstehen, wie unsere medizinischen Informationsangebote genutzt werden, um ihre Qualität und Benutzerfreundlichkeit zu verbessern.</p>
          <p id="medi-consent-description">Hierzu erfassen wir Ihre Nutzungsdaten wie Kapitelaufrufe, Scrolltiefe und Interaktionen. Die Analyse erfolgt nur mit Ihrer Einwilligung. Sie können diese jederzeit widerrufen.</p>
          <div className="medi-consent__actions">
            <button type="button" className="medi-consent__button medi-consent__button--reject" onClick={() => decide("rejected")}>{choice === "accepted" ? "Einwilligung widerrufen" : "Nur notwendige Funktionen"}</button>
            <button type="button" className="medi-consent__button medi-consent__button--accept" onClick={() => decide("accepted")}>Analytics zustimmen</button>
          </div>
        </section>
      ) : (
        <button type="button" className="medi-consent__manage" onClick={() => setShowPanel(true)} aria-label="Datenschutzeinstellungen öffnen">
          <span aria-hidden="true">⚙</span> Datenschutz
        </button>
      )}
    </>
  );
}
