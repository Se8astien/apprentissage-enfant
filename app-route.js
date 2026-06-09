// app-route.js — routage des écrans onboarding/menu (un seul point de contrôle)

import { STORAGE_NIVEAU, RENARD_NOM_KEY, revelerSeulEcran } from "./app-state.js";

export const STORAGE_LANDING_VU = "landing-seen";

export function etapeCourante() {
  if (!localStorage.getItem(STORAGE_NIVEAU)) return "classe";
  if (!(localStorage.getItem(RENARD_NOM_KEY) || "").trim()) return "nommage";
  return "menu";
}

export function landingDejaVu() {
  return localStorage.getItem(STORAGE_LANDING_VU) === "1";
}

export function marquerLandingVu() {
  try { localStorage.setItem(STORAGE_LANDING_VU, "1"); }
  catch { /* ignore */ }
}

function elById(id) { return document.getElementById(id); }

export function montrerEcranParId(id) {
  const el = elById(id);
  if (!el) return false;
  revelerSeulEcran(el);
  return true;
}
