const sentOnce = new Set();

typeof window !== "undefined" && (window.__MALARIA_TRACKING__ = window.__MALARIA_TRACKING__ || []);

export function trackEvent(eventName, properties = {}) {
  const clean = Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined)
  );

  if (typeof window !== "undefined" && window.pa?.sendEvent) {
    window.pa.sendEvent(eventName, clean);
  } else if (typeof window !== "undefined") {
    window.__MALARIA_TRACKING__.push({ eventName, properties: clean, at: Date.now() });
    if (import.meta.env.DEV) console.info("[Piano-ready]", eventName, clean);
  }
}

export function trackOnce(key, eventName, properties = {}) {
  if (sentOnce.has(key)) return;
  sentOnce.add(key);
  trackEvent(eventName, properties);
}
