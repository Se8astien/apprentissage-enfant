// app-analytics.js — wrapper GA4, respecte le consentement RGPD
export function track(eventName, params = {}) {
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}
