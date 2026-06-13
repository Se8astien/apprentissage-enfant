// games-geo.js — Géographie (drapeaux, capitales, régions de France)

import {
  elTitre,
  elQuestion,
  elChoix,
  getNiveauCourant,
  getDifficulte,
  melanger,
  setBonneReponse,
} from "./app-state.js";

import { apresReponse } from "./app-nav.js";

function filtrerParNiveau(donnees, niveauActuel, mappingNiveaux) {
  const niveaux = mappingNiveaux[niveauActuel] || Object.values(mappingNiveaux)[0];
  return donnees.filter(d => niveaux.includes(d.niveau));
}

const NIVEAUX_CUMULES = {
  cp: ["cp"],
  ce1: ["cp", "ce1"],
  ce2: ["cp", "ce1", "ce2"],
  cm1: ["cp", "ce1", "ce2", "cm1"],
  cm2: ["cp", "ce1", "ce2", "cm1", "cm2"],
};

// ── Drapeaux (CP → CM2) ──────────────────────────────────────────────────────
const DRAPEAUX_DONNEES = [
  { pays: "France", drapeau: "🇫🇷", niveau: "cp" },
  { pays: "Italie", drapeau: "🇮🇹", niveau: "cp" },
  { pays: "Espagne", drapeau: "🇪🇸", niveau: "cp" },
  { pays: "Allemagne", drapeau: "🇩🇪", niveau: "ce1" },
  { pays: "Royaume-Uni", drapeau: "🇬🇧", niveau: "ce1" },
  { pays: "Portugal", drapeau: "🇵🇹", niveau: "ce1" },
  { pays: "Belgique", drapeau: "🇧🇪", niveau: "ce1" },
  { pays: "États-Unis", drapeau: "🇺🇸", niveau: "ce2" },
  { pays: "Canada", drapeau: "🇨🇦", niveau: "ce2" },
  { pays: "Brésil", drapeau: "🇧🇷", niveau: "ce2" },
  { pays: "Japon", drapeau: "🇯🇵", niveau: "ce2" },
  { pays: "Chine", drapeau: "🇨🇳", niveau: "cm1" },
  { pays: "Égypte", drapeau: "🇪🇬", niveau: "cm1" },
  { pays: "Maroc", drapeau: "🇲🇦", niveau: "cm1" },
  { pays: "Inde", drapeau: "🇮🇳", niveau: "cm1" },
  { pays: "Australie", drapeau: "🇦🇺", niveau: "cm2" },
  { pays: "Suède", drapeau: "🇸🇪", niveau: "cm2" },
  { pays: "Grèce", drapeau: "🇬🇷", niveau: "cm2" },
  { pays: "Mexique", drapeau: "🇲🇽", niveau: "cm2" },
];

// ── Capitales (CE2 → CM2) ────────────────────────────────────────────────────
const CAPITALES_DONNEES = [
  { pays: "France", capitale: "Paris", niveau: "ce2" },
  { pays: "Italie", capitale: "Rome", niveau: "ce2" },
  { pays: "Espagne", capitale: "Madrid", niveau: "ce2" },
  { pays: "Allemagne", capitale: "Berlin", niveau: "ce2" },
  { pays: "Royaume-Uni", capitale: "Londres", niveau: "ce2" },
  { pays: "Portugal", capitale: "Lisbonne", niveau: "cm1" },
  { pays: "Belgique", capitale: "Bruxelles", niveau: "cm1" },
  { pays: "Pays-Bas", capitale: "Amsterdam", niveau: "cm1" },
  { pays: "Suisse", capitale: "Berne", niveau: "cm1" },
  { pays: "États-Unis", capitale: "Washington", niveau: "cm1" },
  { pays: "Japon", capitale: "Tokyo", niveau: "cm2" },
  { pays: "Chine", capitale: "Pékin", niveau: "cm2" },
  { pays: "Égypte", capitale: "Le Caire", niveau: "cm2" },
  { pays: "Russie", capitale: "Moscou", niveau: "cm2" },
  { pays: "Grèce", capitale: "Athènes", niveau: "cm2" },
];

// ── Régions de France (CE1 → CM2) ────────────────────────────────────────────
const REGIONS_DONNEES = [
  { question: "Dans quelle région se trouve Paris ?", reponse: "Île-de-France", autres: ["Bretagne", "Normandie", "Occitanie"], niveau: "ce1" },
  { question: "Quelle région est célèbre pour ses plages et l'océan Atlantique au sud-ouest ?", reponse: "Nouvelle-Aquitaine", autres: ["Île-de-France", "Grand Est", "Corse"], niveau: "ce1" },
  { question: "Quelle île française se trouve en Méditerranée ?", reponse: "Corse", autres: ["Bretagne", "Normandie", "Occitanie"], niveau: "ce2" },
  { question: "Quelle région se trouve tout au nord-ouest, avec une grande péninsule ?", reponse: "Bretagne", autres: ["Provence-Alpes-Côte d'Azur", "Centre-Val de Loire", "Hauts-de-France"], niveau: "ce2" },
  { question: "Quelle région borde l'Allemagne et la Suisse à l'est ?", reponse: "Grand Est", autres: ["Nouvelle-Aquitaine", "Pays de la Loire", "Bretagne"], niveau: "cm1" },
  { question: "Dans quelle région se trouvent Marseille et Nice ?", reponse: "Provence-Alpes-Côte d'Azur", autres: ["Grand Est", "Normandie", "Centre-Val de Loire"], niveau: "cm1" },
  { question: "Quelle région du sud est connue pour Toulouse et Montpellier ?", reponse: "Occitanie", autres: ["Hauts-de-France", "Bourgogne-Franche-Comté", "Île-de-France"], niveau: "cm2" },
  { question: "Quelle région se trouve tout au nord, à la frontière avec la Belgique ?", reponse: "Hauts-de-France", autres: ["Occitanie", "Auvergne-Rhône-Alpes", "Bretagne"], niveau: "cm2" },
];

function poserQuestionDrapeau() {
  const niveau = getNiveauCourant();
  const diff = getDifficulte();
  const donnees = filtrerParNiveau(DRAPEAUX_DONNEES, niveau, NIVEAUX_CUMULES);
  const item = donnees[Math.floor(Math.random() * donnees.length)];
  const nbChoix = 2 + diff;

  elTitre.textContent = "🌍 Drapeaux du monde";
  elQuestion.innerHTML = `
    <p style="font-size:3rem">${item.drapeau}</p>
    <p>De quel pays est ce drapeau ?</p>
  `;

  const distracteurs = melanger(donnees.filter(d => d.pays !== item.pays)).slice(0, nbChoix - 1).map(d => d.pays);
  const options = melanger([item.pays, ...distracteurs]);
  const bonIndex = options.indexOf(item.pays);
  setBonneReponse(bonIndex);

  elChoix.innerHTML = "";
  options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn-choix";
    btn.textContent = opt;
    btn.addEventListener("click", () => apresReponse(idx, btn, bonIndex));
    elChoix.appendChild(btn);
  });
}

function poserQuestionCapitale() {
  const niveau = getNiveauCourant();
  const diff = getDifficulte();
  const donnees = filtrerParNiveau(CAPITALES_DONNEES, niveau, NIVEAUX_CUMULES);
  const item = donnees[Math.floor(Math.random() * donnees.length)];
  const nbChoix = 2 + diff;

  elTitre.textContent = "🌍 Capitales du monde";
  elQuestion.innerHTML = `<p>Quelle est la capitale de <strong>${item.pays}</strong> ?</p>`;

  const distracteurs = melanger(donnees.filter(d => d.capitale !== item.capitale)).slice(0, nbChoix - 1).map(d => d.capitale);
  const options = melanger([item.capitale, ...distracteurs]);
  const bonIndex = options.indexOf(item.capitale);
  setBonneReponse(bonIndex);

  elChoix.innerHTML = "";
  options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn-choix";
    btn.textContent = opt;
    btn.addEventListener("click", () => apresReponse(idx, btn, bonIndex));
    elChoix.appendChild(btn);
  });
}

function poserQuestionRegion() {
  const niveau = getNiveauCourant();
  const donnees = filtrerParNiveau(REGIONS_DONNEES, niveau, NIVEAUX_CUMULES);
  const item = donnees[Math.floor(Math.random() * donnees.length)];

  elTitre.textContent = "🗺️ Régions de France";
  elQuestion.innerHTML = `<p>${item.question}</p>`;

  const options = melanger([item.reponse, ...item.autres]);
  const bonIndex = options.indexOf(item.reponse);
  setBonneReponse(bonIndex);

  elChoix.innerHTML = "";
  options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn-choix";
    btn.textContent = opt;
    btn.addEventListener("click", () => apresReponse(idx, btn, bonIndex));
    elChoix.appendChild(btn);
  });
}

export function lancerGeographie() {
  const niveau = getNiveauCourant();
  const capitalesDispo = filtrerParNiveau(CAPITALES_DONNEES, niveau, NIVEAUX_CUMULES).length > 0;
  const regionsDispo = filtrerParNiveau(REGIONS_DONNEES, niveau, NIVEAUX_CUMULES).length > 0;

  const types = ["drapeau"];
  if (capitalesDispo) types.push("capitale");
  if (regionsDispo) types.push("region");

  const type = types[Math.floor(Math.random() * types.length)];
  if (type === "capitale") poserQuestionCapitale();
  else if (type === "region") poserQuestionRegion();
  else poserQuestionDrapeau();
}
