// app-analytics.js — wrapper GA4, respecte le consentement RGPD
export function track(eventName, params = {}) {
  if (typeof gtag === "function") {
    gtag("event", eventName, params);
  }
}
