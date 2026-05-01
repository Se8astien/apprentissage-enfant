import { STORAGE_NIVEAU, RENARD_NOM_KEY } from "./app-state.js";

const STORAGE_GENRE = "maths-cp-genre";
export const STORAGE_LANDING_VU = "landing-seen";

export function etapePourStockageCourant() {
  if (!localStorage.getItem(STORAGE_GENRE)) return "genre";
  if (!localStorage.getItem(STORAGE_NIVEAU)) return "classe";
  if (!(localStorage.getItem(RENARD_NOM_KEY) || "").trim()) return "nommage";
  return "menu";
}

export function doitAfficherLanding() {
  return !localStorage.getItem(STORAGE_LANDING_VU);
}

export function fermerLandingDansDOM() {
  const el = document.getElementById("ecran-landing");
  if (!el) return;
  el.hidden = true;
  el.classList.remove("actif");
}

export function marquerLandingVu() {
  try {
    localStorage.setItem(STORAGE_LANDING_VU, "1");
  } catch { /* ignore */ }
}

export function harmoniserLandingSiStockageDejaVu() {
  const el = document.getElementById("ecran-landing");
  if (!el) return false;
  if (localStorage.getItem(STORAGE_LANDING_VU) !== "1") return false;
  const parasite = !el.hidden && el.classList.contains("actif");
  if (!parasite) return false;
  el.hidden = true;
  el.classList.remove("actif");
  return true;
}
