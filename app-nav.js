// app-nav.js — navigation/screens, stars, combo, apresReponse, montrerMenu/Jeu

import {
  elGenre,
  elMenu,
  elJeu,
  elChoix,
  elFeedback,
  elSuivant,
  getJeuCourant,
  setJeuCourant,
  getRepondu,
  setRepondu,
  getBonneReponse,
  setBadgeVisible,
  estFille,
  majGenre,
  sauverFaim,
  lireFaim,
  lireEtoiles,
  lireNomRenard,
  confetti,
  getNiveauCourant,
  getDifficulte,
  incrementDifficulte,
  getDiffLabel,
  marquerMaitrise,
  lireMaitrise,
} from "./app-state.js";

import {
  ajouterEtoiles,
  svgRenard,
  getStade,
  mettreAJourMaisonBanner,
  mettreAJourRenardHeader,
} from "./app-renard.js";

// Re-export confetti so game files can import it from here if desired
export { confetti } from "./app-state.js";

// ── Module-level combo counter (only used in nav) ─────────────────────────────
let comboActuel = 0;

// ── Messages ──────────────────────────────────────────────────────────────────
function messagesOk() {
  return estFille()
    ? [
        "Bravo, championne !",
        "Super ! Tu as réussi !",
        "Génial ! Encore une étoile !",
        "Tu es trop forte !",
        "Parfait ! Continue comme ça !",
        "Incroyable ! Quelle championne !",
      ]
    : [
        "Bravo, champion !",
        "Super ! Tu as réussi !",
        "Génial ! Encore une étoile !",
        "Tu es trop fort !",
        "Parfait ! Continue comme ça !",
        "Incroyable ! Quel champion !",
      ];
}

function messagesKo() {
  return [
    "Pas grave, on réessaie !",
    "Presque ! Regarde bien…",
    "Courage, la prochaine c'est la bonne !",
  ];
}

// ── Reaction renard ───────────────────────────────────────────────────────────
function declencherReactionRenard(correct) {
  const el = document.getElementById("renard-reaction");
  if (!el) return;
  el.hidden = false;
  el.className = "renard-reaction";
  const stade = getStade(lireEtoiles());
  const bulle = correct ? "Ouais ! 🎉" : "Tu y es presque !";
  el.innerHTML = `<div class="renard-bulle">${bulle}</div>${svgRenard(stade, 72)}`;
  void el.offsetWidth;
  el.classList.add(correct ? "visible" : "encourage");
  setTimeout(() => { el.hidden = true; el.className = "renard-reaction"; }, 2000);
}

// ── Combo ─────────────────────────────────────────────────────────────────────
function declencherCombo(nb, onFermer) {
  const bonus = nb >= 10 ? 3 : 1;
  ajouterEtoiles(bonus);
  const nom  = lireNomRenard() || "Foxy";
  const stade = getStade(lireEtoiles());
  const overlay = document.createElement("div");
  overlay.className = "evolution-overlay";
  overlay.innerHTML = `
    <div class="evolution-carte combo-carte">
      <div class="evolution-renard">${svgRenard(stade, 100)}</div>
      <p class="combo-flamme">${nb >= 10 ? "🔥🔥 COMBO ×10 ! 🔥🔥" : "🔥 COMBO ×5 !"}</p>
      <p class="evolution-titre">${nom} est fier de toi !</p>
      <p class="evolution-msg">+${bonus} ⭐ bonus !</p>
      <button type="button" class="btn-evolution-fermer">Super !</button>
    </div>`;
  document.body.appendChild(overlay);
  confetti();
  const fermer = () => { overlay.remove(); if (onFermer) onFermer(); };
  overlay.querySelector(".btn-evolution-fermer").addEventListener("click", fermer);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) fermer(); });
}

// ── Reset feedback ────────────────────────────────────────────────────────────
export function resetFeedback() {
  elFeedback.textContent = "";
  elFeedback.className = "feedback";
  elSuivant.hidden = true;
  setRepondu(false);
}

// ── apresReponse ──────────────────────────────────────────────────────────────
export function apresReponse(choix, bouton, correct) {
  if (getRepondu()) return;
  setRepondu(true);
  const boutons = elChoix.querySelectorAll(".btn-choix");
  boutons.forEach((btn) => {
    btn.disabled = true;
    const v = Number(btn.dataset.valeur);
    if (v === correct) btn.classList.add("bonne");
  });
  if (choix !== correct) bouton.classList.add("mauvaise");

  if (choix === correct) {
    comboActuel++;
    const ok = messagesOk();
    elFeedback.textContent = ok[Math.floor(Math.random() * ok.length)];
    elFeedback.className = "feedback ok";
    ajouterEtoiles(1);
    sauverFaim(lireFaim() + 5);
    confetti();
    declencherReactionRenard(true);
    if (comboActuel % 10 === 0) {
      declencherCombo(10, () => {
        marquerMaitrise(getJeuCourant(), getDifficulte());
        gererProgressionDifficulte();
      });
    } else if (comboActuel === 5) declencherCombo(5);
  } else {
    comboActuel = 0;
    const ko = messagesKo();
    elFeedback.textContent = ko[Math.floor(Math.random() * ko.length)];
    elFeedback.className = "feedback non";
    declencherReactionRenard(false);
  }
  elSuivant.hidden = false;
}

// ── apresReponseTexte — for games that use string values (compare symbols) ────
export function apresReponseTexte(choix, bouton, correct) {
  if (getRepondu()) return;
  setRepondu(true);
  const boutons = elChoix.querySelectorAll(".btn-choix");
  boutons.forEach((btn) => {
    btn.disabled = true;
    if (btn.dataset.valeur === String(correct)) btn.classList.add("bonne");
  });
  if (choix !== correct) bouton.classList.add("mauvaise");

  if (choix === correct) {
    comboActuel++;
    const ok = messagesOk();
    elFeedback.textContent = ok[Math.floor(Math.random() * ok.length)];
    elFeedback.className = "feedback ok";
    ajouterEtoiles(1);
    sauverFaim(lireFaim() + 5);
    confetti();
    declencherReactionRenard(true);
    if (comboActuel % 10 === 0) {
      declencherCombo(10, () => {
        marquerMaitrise(getJeuCourant(), getDifficulte());
        gererProgressionDifficulte();
      });
    } else if (comboActuel === 5) declencherCombo(5);
  } else {
    comboActuel = 0;
    const ko = messagesKo();
    elFeedback.textContent = ko[Math.floor(Math.random() * ko.length)];
    elFeedback.className = "feedback non";
    declencherReactionRenard(false);
  }
  elSuivant.hidden = false;
}

// ── Progression de difficulté ─────────────────────────────────────────────────
function gererProgressionDifficulte() {
  if (getDifficulte() < 2) {
    incrementDifficulte();
    afficherToastDifficulte();
    const badge = document.getElementById("diff-badge");
    if (badge) { badge.hidden = false; badge.textContent = getDiffLabel(); badge.classList.add("diff-pulse"); setTimeout(() => badge.classList.remove("diff-pulse"), 1200); }
  } else {
    proposerClasseSuivante();
  }
}

function afficherToastDifficulte() {
  const app = document.querySelector(".app");
  if (!app) return;
  const toast = document.createElement("div");
  toast.className = "toast-progression";
  toast.innerHTML = `<span>🎉 Niveau augmenté !</span><strong>${getDiffLabel()}</strong>`;
  app.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

function proposerClasseSuivante() {
  const suivantNom = { cp: "CE1 🚀", ce1: "CE2 ⭐", ce2: null }[getNiveauCourant()];
  if (!suivantNom) { confetti(); return; }
  const modal = document.getElementById("modal-classe-suivante");
  const nomEl = document.getElementById("modal-classe-nom");
  if (modal && nomEl) { nomEl.textContent = suivantNom; modal.hidden = false; }
}

// ── montrerMenu ───────────────────────────────────────────────────────────────
export function montrerMenu() {
  setJeuCourant(null);
  setBadgeVisible(false);
  elGenre.hidden = true;
  elGenre.classList.remove("actif");
  elJeu.hidden = true;
  elJeu.classList.remove("actif");
  const elMaison = document.getElementById("ecran-maison");
  if (elMaison) { elMaison.hidden = true; elMaison.classList.remove("actif"); }
  const elClasse = document.getElementById("ecran-classe");
  if (elClasse) { elClasse.hidden = true; elClasse.classList.remove("actif"); }
  const modal = document.getElementById("modal-classe-suivante");
  if (modal) modal.hidden = true;
  elMenu.hidden = false;
  elMenu.classList.add("actif");
  majGenre();
  mettreAJourMaisonBanner();
  // Update classe/difficulte info bar
  const classeLabel = document.getElementById("classe-info-label");
  const diffLabel = document.getElementById("difficulte-label");
  if (classeLabel) classeLabel.textContent = { cp: "🌱 CP", ce1: "🚀 CE1", ce2: "⭐ CE2" }[getNiveauCourant()] || "";
  if (diffLabel) diffLabel.textContent = getDiffLabel();
  document.querySelectorAll(".carte-jeu[data-jeu]").forEach(btn => {
    const m = lireMaitrise(btn.dataset.jeu);
    const n = m.filter(Boolean).length;
    let el = btn.querySelector(".maitrise-stars");
    if (!el) { el = document.createElement("span"); el.className = "maitrise-stars"; btn.appendChild(el); }
    el.textContent = n > 0 ? "★".repeat(n) + "☆".repeat(3 - n) : "";
  });
}

// ── montrerJeu ────────────────────────────────────────────────────────────────
export function montrerJeu(nom, lanceurs) {
  setJeuCourant(nom);
  comboActuel = 0;
  elMenu.hidden = true;
  elMenu.classList.remove("actif");
  elJeu.hidden = false;
  elJeu.classList.add("actif");
  setBadgeVisible(true);
  const diffBadge = document.getElementById("diff-badge");
  if (diffBadge) { diffBadge.hidden = false; diffBadge.textContent = getDiffLabel(); }
  resetFeedback();
  lanceurs[nom]();
}

// ── questionSuivante ──────────────────────────────────────────────────────────
export function questionSuivante(lanceurs) {
  resetFeedback();
  const jeu = getJeuCourant();
  if (jeu && lanceurs[jeu]) lanceurs[jeu]();
}
