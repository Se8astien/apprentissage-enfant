export const CONSENT_KEY = "rgpd-consent";
export const GA_MEASUREMENT_ID = "G-5EDQ2KCS8X";

export function chargerTagAnalytics() {
  if (typeof window.gtag !== "function") return;
  if (document.querySelector(`script[src*="${GA_MEASUREMENT_ID}"]`)) return;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(s);
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID);
}
const QUEUE_KEY = "analytics-queue";

const EVENT_SCHEMA = {
  session_start: ["niveau", "difficulte", "profil_count"],
  session_end: ["duration_s", "last_screen", "game_name"],
  game_start: ["game_name", "niveau", "difficulte"],
  game_exit: ["game_name", "niveau", "wrong_count", "revision_prompted"],
  revision_started: ["game_name", "niveau", "wrong_count"],
  revision_declined: ["game_name", "niveau", "wrong_count"],
  question_correct: ["game_name", "niveau", "combo"],
  question_wrong: ["game_name", "niveau", "timeout"],
  combo_reached: ["game_name", "niveau", "combo"],
  difficulty_up: ["game_name", "niveau", "from", "to"],
  mini_rattrapage_start: ["game_name", "niveau", "from", "to", "questions"],
  mini_rattrapage_end: ["game_name", "niveau", "restored_to"],
};

function consentGranted() {
  return localStorage.getItem(CONSENT_KEY) === "accepte";
}

function readQueue() {
  try {
    const q = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
    return Array.isArray(q) ? q : [];
  } catch {
    return [];
  }
}

function writeQueue(queue) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue.slice(-100)));
}

function normalizeParams(eventName, params) {
  const whitelist = EVENT_SCHEMA[eventName];
  if (!whitelist) return {};
  const out = {};
  whitelist.forEach((k) => {
    if (params[k] !== undefined && params[k] !== null) out[k] = params[k];
  });
  return out;
}

function send(eventName, params) {
  if (typeof window.gtag !== "function") return false;
  window.gtag("event", eventName, params);
  return true;
}

export function flushAnalyticsQueue() {
  if (!consentGranted() || typeof window.gtag !== "function") return;
  const queue = readQueue();
  if (queue.length === 0) return;
  queue.forEach((evt) => send(evt.name, evt.params || {}));
  writeQueue([]);
}

export function setAnalyticsConsent(consentValue) {
  localStorage.setItem(CONSENT_KEY, consentValue);
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: consentValue === "accepte" ? "granted" : "denied",
    });
  }
  if (consentValue === "accepte") flushAnalyticsQueue();
}

export function track(eventName, params = {}) {
  if (!consentGranted()) return;
  const safeParams = normalizeParams(eventName, params);
  if (!navigator.onLine || !send(eventName, safeParams)) {
    const queue = readQueue();
    queue.push({ name: eventName, params: safeParams, ts: Date.now() });
    writeQueue(queue);
  }
}

window.addEventListener("online", flushAnalyticsQueue);
