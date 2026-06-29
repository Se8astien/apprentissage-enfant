// games-phrases.js — Remets les mots dans l'ordre (reconstruire une phrase)

import {
  elTitre,
  elQuestion,
  elChoix,
  getNiveauCourant,
  melanger,
  setBonneReponse,
  getRepondu,
} from "./app-state.js";

import { apresReponse } from "./app-nav.js";

const PHRASES = {
  cp: [
    ["Le", "chat", "dort"],
    ["Papa", "lit", "un", "livre"],
    ["La", "balle", "est", "rouge"],
    ["Je", "mange", "une", "pomme"],
    ["Le", "chien", "court", "vite"],
    ["Maman", "fait", "un", "gâteau"],
    ["Le", "soleil", "brille"],
    ["Léa", "joue", "au", "parc"],
  ],
  ce1: [
    ["Le", "petit", "oiseau", "chante", "dans", "l'arbre"],
    ["Nous", "allons", "à", "l'école", "ensemble"],
    ["Le", "chat", "noir", "dort", "sur", "le", "lit"],
    ["Tom", "dessine", "un", "beau", "soleil", "jaune"],
    ["La", "maîtresse", "raconte", "une", "belle", "histoire"],
    ["Mon", "frère", "joue", "avec", "le", "ballon"],
    ["Les", "enfants", "courent", "dans", "le", "jardin"],
  ],
  ce2: [
    ["Le", "renard", "rusé", "traverse", "la", "forêt", "sombre"],
    ["Chaque", "matin", "je", "bois", "un", "verre", "de", "lait"],
    ["Les", "élèves", "écoutent", "attentivement", "la", "leçon"],
    ["Pendant", "les", "vacances", "nous", "irons", "à", "la", "mer"],
    ["Le", "vieux", "marin", "raconte", "ses", "voyages", "lointains"],
  ],
};

function listePour(niveau) {
  if (niveau === "ce2" || niveau === "cm1" || niveau === "cm2") return PHRASES.ce2;
  if (niveau === "ce1") return PHRASES.ce1;
  return PHRASES.cp;
}

export function lancerPhraseOrdre() {
  elTitre.textContent = "🧩 Remets la phrase";
  const niveau = getNiveauCourant();
  const liste = listePour(niveau);
  const phrase = liste[Math.floor(Math.random() * liste.length)];
  setBonneReponse(1);

  // Mélange en s'assurant que ce n'est pas déjà dans l'ordre (si possible)
  let indices = phrase.map((_, i) => i);
  if (phrase.length > 1) {
    let essais = 0;
    do { indices = melanger(phrase.map((_, i) => i)); essais++; }
    while (indices.every((v, i) => v === i) && essais < 10);
  }

  const construit = []; // indices choisis dans l'ordre

  elQuestion.innerHTML = `
    <p class="phrase-consigne">Touche les mots dans le bon ordre pour faire la phrase :</p>
    <div class="phrase-zone" id="phrase-zone" aria-label="Phrase en construction"></div>
    <div class="phrase-mots" id="phrase-mots"></div>
  `;
  const zoneEl = elQuestion.querySelector("#phrase-zone");
  const motsEl = elQuestion.querySelector("#phrase-mots");

  function rendre() {
    zoneEl.innerHTML = construit.length
      ? construit.map((idx, pos) => `<button type="button" class="phrase-mot phrase-mot--place" data-pos="${pos}">${phrase[idx]}</button>`).join("")
      : `<span class="phrase-zone-vide">Touche un mot…</span>`;

    motsEl.innerHTML = indices.map((idx) => {
      const utilise = construit.includes(idx);
      return `<button type="button" class="phrase-mot${utilise ? " phrase-mot--utilise" : ""}" data-idx="${idx}"${utilise ? " disabled" : ""}>${phrase[idx]}</button>`;
    }).join("");

    zoneEl.querySelectorAll(".phrase-mot--place").forEach((b) => {
      b.addEventListener("click", () => {
        if (getRepondu()) return;
        construit.splice(Number(b.dataset.pos), 1);
        rendre();
      });
    });
    motsEl.querySelectorAll(".phrase-mot:not(.phrase-mot--utilise)").forEach((b) => {
      b.addEventListener("click", () => {
        if (getRepondu()) return;
        construit.push(Number(b.dataset.idx));
        rendre();
      });
    });
  }

  rendre();

  elChoix.innerHTML = "";
  const btnVerifier = document.createElement("button");
  btnVerifier.type = "button";
  btnVerifier.className = "btn-choix phrase-verifier";
  btnVerifier.dataset.valeur = "1";
  btnVerifier.textContent = "✅ Vérifier la phrase";
  elChoix.appendChild(btnVerifier);

  btnVerifier.addEventListener("click", () => {
    if (getRepondu()) return;
    if (construit.length !== phrase.length) {
      zoneEl.classList.add("phrase-secousse");
      setTimeout(() => zoneEl.classList.remove("phrase-secousse"), 400);
      return;
    }
    const reussi = construit.every((idx, pos) => idx === pos);
    if (!reussi) {
      zoneEl.classList.add("phrase-secousse");
      setTimeout(() => zoneEl.classList.remove("phrase-secousse"), 400);
    }
    apresReponse(reussi ? 1 : 0, btnVerifier, 1);
  });
}
