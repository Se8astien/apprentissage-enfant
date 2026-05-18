// app-calendrier.js — Recommandations selon le mois scolaire et la classe

import { getNiveauCourant } from "./app-state.js";

const CALENDRIER = {
  cp: {
    9:  ["compte", "lecture"],
    10: ["addition", "lecture"],
    11: ["addition", "soustraction"],
    12: ["soustraction", "lecture"],
    1:  ["addition", "soustraction", "grammaire"],
    2:  ["multiplication", "lecture"],
    3:  ["multiplication", "grammaire"],
    4:  ["division", "lecture"],
    5:  ["fractions", "grammaire"],
    6:  ["addition", "soustraction"],
  },
  ce1: {
    9:  ["addition", "soustraction"],
    10: ["multiplication", "grammaire"],
    11: ["multiplication", "division"],
    12: ["division", "homophones"],
    1:  ["multiplication", "division", "grammaire"],
    2:  ["fractions", "homophones"],
    3:  ["heure", "grammaire"],
    4:  ["heure", "fractions"],
    5:  ["mesures", "grammaire"],
    6:  ["multiplication", "division"],
  },
  ce2: {
    9:  ["multiplication", "division"],
    10: ["fractions", "homophones"],
    11: ["fractionsCM", "grammaire"],
    12: ["decimaux", "homophones"],
    1:  ["decimaux", "fractionsCM", "grammaire"],
    2:  ["aires", "mesures"],
    3:  ["proportionnalite", "grammaire"],
    4:  ["pourcentages", "homophones"],
    5:  ["decimaux", "grammaire"],
    6:  ["fractionsCM", "division"],
  },
  cm1: {
    9:  ["decimaux", "fractionsCM"],
    10: ["fractionsCM", "proportionnalite"],
    11: ["proportionnalite", "grammaire"],
    12: ["aires", "homophones"],
    1:  ["pourcentages", "proportionnalite", "grammaire"],
    2:  ["decimaux", "fractionsCM"],
    3:  ["statistiques", "grammaire"],
    4:  ["aires", "homophones"],
    5:  ["pourcentages", "grammaire"],
    6:  ["proportionnalite", "fractionsCM"],
  },
  cm2: {
    9:  ["proportionnalite", "pourcentages"],
    10: ["pourcentages", "grammaire"],
    11: ["statistiques", "homophones"],
    12: ["decimaux", "fractionsCM"],
    1:  ["proportionnalite", "statistiques", "grammaire"],
    2:  ["pourcentages", "fractionsCM"],
    3:  ["aires", "grammaire"],
    4:  ["statistiques", "homophones"],
    5:  ["pourcentages", "grammaire"],
    6:  ["proportionnalite", "decimaux"],
  },
};

const NOMS_JEUX = {
  compte: "Compter",
  lecture: "Lecture",
  addition: "Addition",
  soustraction: "Soustraction",
  multiplication: "Multiplication",
  division: "Division",
  fractions: "Fractions",
  fractionsCM: "Fractions CM",
  decimaux: "Décimaux",
  heure: "L'heure",
  mesures: "Mesures",
  aires: "Aires",
  proportionnalite: "Proportionnalité",
  pourcentages: "Pourcentages",
  statistiques: "Statistiques",
  grammaire: "Grammaire",
  homophones: "Homophones",
};

export function getJeuxRecommandesMois() {
  const mois = new Date().getMonth() + 1;
  const niveau = getNiveauCourant();
  return (CALENDRIER[niveau]?.[mois] || []).map((id) => ({
    id,
    nom: NOMS_JEUX[id] || id,
  }));
}

export function afficherCalendrierMenu() {
  const conteneur = document.getElementById("calendrier-menu-section");
  if (!conteneur) return;
  const jeux = getJeuxRecommandesMois();
  if (!jeux.length) { conteneur.hidden = true; return; }
  const moisNom = new Date().toLocaleString("fr-FR", { month: "long" });
  conteneur.hidden = false;
  conteneur.innerHTML = `
    <div class="calendrier-section">
      <h3>📅 Programme de ${moisNom}</h3>
      <div class="calendrier-jeux">
        ${jeux.map((j) => `<span class="calendrier-jeu-badge">${j.nom}</span>`).join("")}
      </div>
    </div>
  `;
}
