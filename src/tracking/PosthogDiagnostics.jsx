import { useEffect, useState } from "react";
import { getPosthogDiagnostics, sendToPosthog } from "./posthog.js";

/** Nicht-automatischer, datensparsamer QA-Modus: URL ?medi_debug=1; keine Token-Ausgabe. */
export default function PosthogDiagnostics() {
  const [show] = useState(() => new URLSearchParams(window.location.search).get("medi_debug") === "1");
  const [status, setStatus] = useState(getPosthogDiagnostics);
  const [qaTrace, setQaTrace] = useState("");
  useEffect(() => {
    if (!show) return;
    const refresh = () => setStatus(getPosthogDiagnostics());
    window.addEventListener("medi:posthog-diagnostics", refresh);
    // Consent-Event kann stattfinden, bevor PostHog den Status aktualisiert – danach beim nächsten Microtask lesen.
    const consentRefresh = () => queueMicrotask(refresh);
    window.addEventListener("medi:analytics-consent", consentRefresh);
    refresh();
    return () => { window.removeEventListener("medi:posthog-diagnostics", refresh); window.removeEventListener("medi:analytics-consent", consentRefresh); };
  }, [show]);
  if (!show) return null;
  const ready = status.enabled && status.tokenConfigured && status.consent;
  const sendQa = () => {
    const trace = `qa-${crypto.randomUUID().slice(0, 12)}`;
    setQaTrace(trace);
    sendToPosthog("med.i.qa", { qa_only: true, qa_trace_id: trace, trigger_source: "manual_diagnostic" });
  };
  const label = (value) => value ? "Ja" : "Nein";
  return (
    <aside aria-label="PostHog Testdiagnose" style={{position:"fixed",top:12,right:12,zIndex:10011,width:"min(340px,calc(100vw - 24px))",maxHeight:"55vh",overflowY:"auto",background:"#fff",color:"#161616",border:"2px solid #161616",borderRadius:12,padding:14,boxShadow:"0 4px 20px #0004",font:"13px/1.45 Arial,sans-serif"}}>
      <strong style={{display:"block",fontSize:15,marginBottom:7}}>PostHog · Diagnose (nur QA)</strong>
      <div>Integration aktiv: <strong>{label(status.enabled)}</strong></div>
      <div>Project Token konfiguriert: <strong>{label(status.tokenConfigured)}</strong> <small>{status.tokenHint}</small></div>
      <div>Analytics-Einwilligung: <strong>{label(status.consent)}</strong></div>
      <div>Deployment: <strong>{status.environment}</strong></div>
      <div>Übertragung: <strong>{status.transport}</strong></div>
      <div>HTTP-Requests: <strong>{status.attemptedCount}</strong> · HTTP erfolgreich: <strong>{status.acceptedCount}</strong></div>
      <div style={{borderTop:"1px solid #ddd",marginTop:8,paddingTop:7}}>Zuletzt: <strong>{status.lastTransport.event}</strong> – {status.lastTransport.status}{status.lastTransport.code !== null ? ` (HTTP ${status.lastTransport.code})` : ""}</div>
      <div>Serverantwort: <strong>{status.lastTransport.serverInfo}</strong></div>
      {qaTrace && <div>Testkennung: <code>{qaTrace}</code></div>}
      <button type="button" disabled={!ready} onClick={sendQa} style={{marginTop:10,width:"100%",border:0,borderRadius:7,padding:10,background:ready?"#161616":"#ddd",color:ready?"#fff":"#555",cursor:ready?"pointer":"not-allowed",fontWeight:700}}>Testevent senden (nur nach Einwilligung)</button>
      <small style={{display:"block",marginTop:7}}>Keine Anzeige des Tokens. HTTP 200 bestätigt nur die Annahme, nicht die Speicherung. Die POST-Anfrage geht über die eigene Vercel-Domain. Prüfen Sie den PostHog-Projektnamen und Data management → Ingestion warnings. Das Event heißt med.i.qa.</small>
    </aside>
  );
}
