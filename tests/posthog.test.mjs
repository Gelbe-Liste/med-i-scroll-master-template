import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { webcrypto } from "node:crypto";

function storage() {
  const values = new Map();
  return {
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); },
    get length() { return values.size; }
  };
}

test("PostHog adapter: Consent, events, sessions and revocation", async () => {
  const listeners = new Map();
  const captured = [];
  const previous = { window: globalThis.window, document: globalThis.document, fetch: globalThis.fetch };
  const previousNavigator = Object.getOwnPropertyDescriptor(globalThis, "navigator");
  const previousEnv = globalThis.__TEST_ENV__;
  try {
    globalThis.__TEST_ENV__ = { VITE_POSTHOG_ENABLED:"true", VITE_POSTHOG_PROJECT_TOKEN:"phc_testtoken123", VITE_POSTHOG_DEPLOY_ENV:"preview", DEV:false };
    globalThis.window = {
      localStorage: storage(), sessionStorage: storage(),
      location: { href:"https://med-i.example.de/test?private=1&utm_source=email#frag", origin:"https://med-i.example.de", hostname:"med-i.example.de", pathname:"/test", search:"?private=1&utm_source=email" },
      addEventListener:(name, callback)=>listeners.set(name, callback)
    };
    globalThis.document = { title: "med.i QA" };
    Object.defineProperty(globalThis, "navigator", { configurable:true, value:{onLine:true} });
    globalThis.fetch = async (url, request) => {
      captured.push({url, body:JSON.parse(request.body)});
      return {ok:true,status:200,text:async()=>JSON.stringify({status:"Ok"})};
    };
    // Testumgebung ohne Vite: ausschließlich import.meta.env wird durch Test-Konfiguration ersetzt.
    const source = fs.readFileSync(new URL("../src/tracking/posthog.js", import.meta.url), "utf8")
      .replaceAll("import.meta.env", "globalThis.__TEST_ENV__");
    const posthog = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);
    posthog.initPosthogTracking({project_id:"qa-project"});
    posthog.sendToPosthog("page.display", {page:"QA | Home", page_url:"https://med-i.example.de/test?private=1#frag"});
    posthog.sendToPosthog("click.action", {click:"Open module"});
    assert.equal(captured.length, 0);
    assert.equal(window.localStorage.length, 0);
    listeners.get("medi:analytics-consent")({detail:{posthog:true}});
    await new Promise(resolve => setTimeout(resolve, 0));
    assert.deepEqual(captured.map(x=>x.body.event), ["$pageview", "page.display"]);
    assert(captured.every(x => x.url === "/_medi/r"));
    assert(captured.every(x => x.body.properties.project_id === "qa-project"));
    assert(captured.every(x => x.body.api_key === "phc_testtoken123" && x.body.distinct_id === x.body.properties.distinct_id));
    assert(captured.every(x => x.body.properties.deployment_environment === "preview"));
    assert.equal(captured[0].body.properties.$current_url, "https://med-i.example.de/test");
    assert.equal(captured[0].body.properties.$process_person_profile, false);
    assert.match(captured[0].body.properties.$session_id, /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    posthog.sendToPosthog("page.display", {page:"QA | Home"});
    assert.equal(captured.length, 2, "React StrictMode duplicate page display blocked");
    assert.equal(posthog.getPosthogDiagnostics().acceptedCount,2);
    assert.equal(posthog.getPosthogDiagnostics().lastTransport.serverInfo, "–", "QA-Ausgabe ist nur bei medi_debug=1 aktiv");
    posthog.sendToPosthog("click.action", {click:"Open contact",email:"person@example.de",destination_path:"person@example.de"});
    await new Promise(resolve => setTimeout(resolve,0));
    assert.equal(captured.length,3);
    assert(!("email" in captured[2].body.properties));
    assert(!("destination_path" in captured[2].body.properties));
    listeners.get("medi:analytics-consent")({detail:{posthog:false}});
    posthog.sendToPosthog("click.action", {click:"No consent"});
    assert.equal(captured.length,3);
    assert.equal(window.localStorage.length,0);
    assert.equal(window.sessionStorage.length,0);
    listeners.get("medi:analytics-consent")({detail:{posthog:true}});
    await new Promise(resolve => setTimeout(resolve,0));
    assert.deepEqual(captured.slice(-2).map(x=>x.body.event), ["$pageview", "page.display"], "Re-Consent muss neue Pageview ermöglichen");
  } finally {
    if (previous.window === undefined) delete globalThis.window; else globalThis.window=previous.window;
    if (previous.document === undefined) delete globalThis.document; else globalThis.document=previous.document;
    globalThis.fetch=previous.fetch;
    if (previousNavigator) Object.defineProperty(globalThis, "navigator", previousNavigator);
    if (previousEnv === undefined) delete globalThis.__TEST_ENV__; else globalThis.__TEST_ENV__=previousEnv;
  }
});
