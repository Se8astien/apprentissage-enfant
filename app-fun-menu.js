import {
  lireEtoiles,
  getNiveauCourant,
  confetti,
  lireDernierJeuMenu,
} from "./app-state.js";
import { ajouterEtoiles } from "./app-renard.js";
import { track } from "./app-analytics.js";
import { sonAccessoire } from "./app-sons.js";

const KEY_MYSTERE = "am-fun-mystere-date";
const KEY_WE_WELCOME = "am-fun-weekend-welcome";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function estWeekEnd() {
  const d = new Date().getDay();
  return d === 0 || d === 6;
}

function cartesJeuxVisibles() {
  return [...document.querySelectorAll(".carte-jeu[data-jeu]:not([hidden])")].map((b) => b.dataset.jeu).filter(Boolean);
}

function pulseCarte(jeuId) {
  const carte = document.querySelector(`.carte-jeu[data-jeu="${jeuId}"]`);
  if (!carte) return;
  try {
    carte.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } catch { /* ignore */ }
  carte.classList.add("carte-jeu--pulse");
  setTimeout(() => carte.classList.remove("carte-jeu--pulse"), 2200);
}

export function rafraichirBarreFunMenu() {
  const bar = document.getElementById("menu-fun-bar");
  if (!bar) return;
  const myst = document.getElementById("btn-fun-mystere");
  const roue = document.getElementById("btn-fun-roue");
  const we = document.getElementById("menu-fun-weekend");
  if (myst) {
    const pris = localStorage.getItem(KEY_MYSTERE) === todayISO();
    myst.disabled = pris;
    myst.textContent = pris ? "🎁 Cadeau déjà pris" : "🎁 Carte du jour";
  }
  if (we) {
    if (estWeekEnd()) {
      we.hidden = false;
      we.textContent = "🌈 Week-end : prends le temps de t'amuser !";
    } else {
      we.hidden = true;
    }
  }
  bar.hidden = false;
  if (roue) roue.disabled = cartesJeuxVisibles().length === 0;
}

function toastFun(titre, detail) {
  const app = document.querySelector(".app");
  if (!app) return;
  const el = document.createElement("div");
  el.className = "toast-progression toast-fun";
  const s = document.createElement("span");
  s.textContent = titre;
  const strong = document.createElement("strong");
  strong.textContent = detail;
  el.append(s, strong);
  app.appendChild(el);
  setTimeout(() => el.remove(), 3400);
}

export function accueillirWeekEndSiMenu() {
  if (!estWeekEnd()) return;
  const d = todayISO();
  if (localStorage.getItem(KEY_WE_WELCOME) === d) return;
  localStorage.setItem(KEY_WE_WELCOME, d);
  toastFun("Week-end !", "Profite d'un moment calme pour jouer.");
  confetti({ tier: "sparkle", sobre: true });
}

export function initFunMenuBar({ montrerJeu, assurerLanceurDansMap, lanceurs }) {
  const myst = document.getElementById("btn-fun-mystere");
  if (myst && myst.dataset.amFunBound !== "1") {
    myst.dataset.amFunBound = "1";
    myst.addEventListener("click", async () => {
      if (localStorage.getItem(KEY_MYSTERE) === todayISO()) return;
      localStorage.setItem(KEY_MYSTERE, todayISO());
      ajouterEtoiles(1);
      sonAccessoire();
      confetti({ tier: "party" });
      toastFun("Carte du jour", "+1 étoile surprise !");
      track("fun_mystere_claim", { niveau: getNiveauCourant(), etoiles: lireEtoiles() });
      rafraichirBarreFunMenu();
    });
  }
  const roue = document.getElementById("btn-fun-roue");
  if (roue && roue.dataset.amFunBound !== "1") {
    roue.dataset.amFunBound = "1";
    roue.addEventListener("click", async () => {
      const ids = cartesJeuxVisibles();
      if (!ids.length) return;
      const pick = ids[Math.floor(Math.random() * ids.length)];
      const ok = await assurerLanceurDansMap(pick, lanceurs);
      if (!ok) return;
      pulseCarte(pick);
      toastFun("Jeu au hasard", "La carte s'est arrêtée !");
      track("fun_roue", { jeu: pick, niveau: getNiveauCourant() });
      setTimeout(async () => {
        await assurerLanceurDansMap(pick, lanceurs);
        if (typeof lanceurs[pick] === "function") montrerJeu(pick, lanceurs);
      }, 650);
    });
  }
  const sug = document.getElementById("btn-fun-suggestion");
  if (sug && sug.dataset.amFunBound !== "1") {
    sug.dataset.amFunBound = "1";
    sug.addEventListener("click", async () => {
      const last = lireDernierJeuMenu();
      const ids = cartesJeuxVisibles();
      const cible = last && ids.includes(last) ? last : ids[0];
      if (!cible) return;
      const ok = await assurerLanceurDansMap(cible, lanceurs);
      if (!ok) return;
      pulseCarte(cible);
      track("fun_suggestion", { jeu: cible, niveau: getNiveauCourant() });
      document.querySelector(`.carte-jeu[data-jeu="${cible}"]`)?.click();
    });
  }
}
