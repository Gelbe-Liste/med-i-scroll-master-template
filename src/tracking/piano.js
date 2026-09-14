const sentOnce = new Set();
const pendingEvents = [];
let persistentContext = {};
let initPromise = null;

typeof window !== "undefined" && (window.__MEDI_SCROLL_TRACKING__ = window.__MEDI_SCROLL_TRACKING__ || []);

const pianoEnabled = String(import.meta.env.VITE_PIANO_ENABLED || "false").toLowerCase() === "true";
const pianoSiteId = Number(import.meta.env.VITE_PIANO_SITE_ID || 640794);
const pianoCollectDomain = String(import.meta.env.VITE_PIANO_COLLECT_DOMAIN || "https://rwwnhth.pa-cd.com");
const pianoSdkUrl = "https://tag.aticdn.net/piano-analytics.js";

const essentialProperties = [
  // Bereits in der Gelbe-Liste-Produktivkonfiguration vorhanden
  "is_PAP",
  "page",
  "page_url",
  "de_page_category",
  "de_page_tags",
  "product_name",
  "product_mol",
  "product_titulaire",
  "product_ATC_class_code",
  "product_ATC_class_name",
  "product_UCD10_codes",
  "page_type",
  "visitor_type",
  "occupation",
  "article_category",
  "box_names",
  "pop_in_name",
  "pop_in_type",
  "click",
  // Ergänzungen für med.i.scroll – vor Livegang im Piano Data Model validieren
  "project_id",
  "chapter_id",
  "chapter_number",
  "chapter_title",
  "content_type",
  "scroll_rate",
  "image_id",
  "zoom_level",
  "document_id",
  "element_id",
  "destination_path",
  "trigger_source",
  "entry_point",
  "video_id",
  "video_name",
  "progress_percent",
  "accordion_id",
  "accordion_title",
  "accordion_group",
  "interaction_state",
  "slide_index",
  "slide_total",
  "slide_title"
];

const essentialEvents = [
  "page.display",
  "pop_in.display",
  "click.action",
  "chapter.display",
  "page.scroll",
  "video.start",
  "video.progress",
  "video.complete",
  "accordion.toggle",
  "workflow.slide"
];

function cleanProperties(properties = {}) {
  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );
}

function configureConsentLayer() {
  window._pac = window._pac || {};
  window._pac.cookieSecure = true;

  // .gelbe-liste.de nur auf Gelbe-Liste-Domains setzen; auf Vercel nicht erzwingen.
  if (/(^|\.)gelbe-liste\.de$/i.test(window.location.hostname)) {
    window._pac.cookieDomain = ".gelbe-liste.de";
  }

  window.pdl = window.pdl || {};
  window.pdl.requireConsent = true;
  const previousConsent = window.pdl.consent || {};
  window.pdl.consent = {
    ...previousConsent,
    products: Array.from(new Set([...(previousConsent.products || []), "PA"])),
    defaultPreset: {
      ...(previousConsent.defaultPreset || {}),
      PA: "essential"
    }
  };

  window.pdl.consent_items = window.pdl.consent_items || {};
  const previousPaItems = window.pdl.consent_items.PA || {};
  window.pdl.consent_items.PA = {
    ...previousPaItems,
    properties: {
      ...(previousPaItems.properties || {}),
      ...Object.fromEntries(essentialProperties.map((property) => [property, "essential"]))
    },
    events: {
      ...(previousPaItems.events || {}),
      ...Object.fromEntries(essentialEvents.map((eventName) => [eventName, "essential"]))
    }
  };
}

function loadPianoSdk() {
  return new Promise((resolve, reject) => {
    if (window.pa?.sendEvent) return resolve();

    const existing = document.querySelector(`script[src="${pianoSdkUrl}"]`);
    if (existing) {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", () => reject(new Error("Piano Analytics SDK konnte nicht geladen werden.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = pianoSdkUrl;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = resolve;
    script.onerror = () => reject(new Error("Piano Analytics SDK konnte nicht geladen werden."));
    document.head.appendChild(script);
  });
}

function flushQueue() {
  if (!window.pa?.sendEvent) return;
  while (pendingEvents.length) {
    const queued = pendingEvents.shift();
    window.pa.sendEvent(queued.eventName, queued.properties);
  }
}

export function sanitizePageUrl(url = window.location.href) {
  try {
    const parsed = new URL(url, window.location.origin);
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return window.location.origin + window.location.pathname;
  }
}

export function sanitizeDestinationPath(url) {
  try {
    const parsed = new URL(url, window.location.origin);
    return `${parsed.hostname}${parsed.pathname}`.slice(0, 255);
  } catch {
    return String(url).split(/[?#]/, 1)[0].slice(0, 255);
  }
}

export function getEntryPoint() {
  const params = new URLSearchParams(window.location.search);
  const raw = (params.get("src") || params.get("utm_source") || "").toLowerCase();
  if (["nfc", "nfc_tag", "nfc-tag"].includes(raw)) return "nfc_tag";
  if (["qr", "qr_code", "qr-code"].includes(raw)) return "qr_code";
  if (raw) return raw.replace(/[^a-z0-9_-]/g, "_").slice(0, 80);
  return "direct_link";
}

export function setTrackingContext(properties = {}) {
  persistentContext = cleanProperties({ ...persistentContext, ...properties });
  if (pianoEnabled && window.pa?.setProperties) {
    window.pa.setProperties(persistentContext, { persistent: true });
  }
}

export function initPianoTracking(properties = {}) {
  persistentContext = cleanProperties({ ...persistentContext, ...properties });
  if (!pianoEnabled) {
    if (import.meta.env.DEV) console.info("[Piano disabled]", persistentContext);
    return Promise.resolve();
  }
  if (initPromise) return initPromise;

  initPromise = (async () => {
    configureConsentLayer();
    await loadPianoSdk();
    if (!window.pa) throw new Error("Piano Analytics SDK ist nach dem Laden nicht verfügbar.");

    window.pa.setConfigurations({
      site: pianoSiteId,
      collectDomain: pianoCollectDomain
    });

    if (Object.keys(persistentContext).length && window.pa.setProperties) {
      window.pa.setProperties(persistentContext, { persistent: true });
    }

    flushQueue();
  })().catch((error) => {
    console.warn("[Piano] Initialisierung fehlgeschlagen:", error);
  });

  return initPromise;
}

export function trackEvent(eventName, properties = {}) {
  const clean = cleanProperties(properties);
  const debugPayload = { ...persistentContext, ...clean };

  window.__MEDI_SCROLL_TRACKING__?.push({ eventName, properties: debugPayload, at: Date.now() });
  if (import.meta.env.DEV || !pianoEnabled) console.info("[Tracking]", eventName, debugPayload);

  if (!pianoEnabled) return;
  if (window.pa?.sendEvent) window.pa.sendEvent(eventName, clean);
  else pendingEvents.push({ eventName, properties: clean, at: Date.now() });
}

export function trackOnce(key, eventName, properties = {}) {
  if (sentOnce.has(key)) return;
  sentOnce.add(key);
  trackEvent(eventName, properties);
}
