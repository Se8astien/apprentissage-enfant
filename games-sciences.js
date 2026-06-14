// games-sciences.js — Sciences (corps humain, animaux, nature, matière)

import {
  elTitre,
  elQuestion,
  elChoix,
  getNiveauCourant,
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

const QUESTIONS = [
  // CP — observation simple
  { q: "🐝 Que fabrique l'abeille ?", r: "Du miel", autres: ["Du lait", "Du pain"], niveau: "cp" },
  { q: "🌳 De quoi a besoin une plante pour pousser ?", r: "De l'eau et du soleil", autres: ["Du chocolat", "Du sable seulement"], niveau: "cp" },
  { q: "🐸 Où vit la grenouille ?", r: "Près de l'eau", autres: ["Dans le désert", "Dans la neige"], niveau: "cp" },
  { q: "☀️ Quand fait-il jour ?", r: "Quand le soleil est levé", autres: ["Quand il y a la lune", "Quand il pleut"], niveau: "cp" },
  { q: "🦷 Combien de mains as-tu ?", r: "Deux", autres: ["Une", "Quatre"], niveau: "cp" },
  { q: "🐄 Que nous donne la vache ?", r: "Du lait", autres: ["Des œufs", "Du miel"], niveau: "cp" },
  // CE1 — corps et animaux
  { q: "👃 Avec quel sens sens-tu une fleur ?", r: "L'odorat", autres: ["La vue", "Le toucher"], niveau: "ce1" },
  { q: "🐔 D'où vient le poussin ?", r: "D'un œuf", autres: ["D'une graine", "D'un nid de feuilles"], niveau: "ce1" },
  { q: "🍂 En quelle saison les feuilles tombent ?", r: "L'automne", autres: ["L'été", "Le printemps"], niveau: "ce1" },
  { q: "🐛 En quoi se transforme la chenille ?", r: "En papillon", autres: ["En abeille", "En oiseau"], niveau: "ce1" },
  { q: "💧 Quels sont les 3 états de l'eau ?", r: "Solide, liquide, gazeux", autres: ["Chaud, froid, tiède", "Bleu, blanc, rouge"], niveau: "ce1" },
  // CE2 — fonctions du vivant
  { q: "🫁 À quoi servent les poumons ?", r: "À respirer", autres: ["À digérer", "À voir"], niveau: "ce2" },
  { q: "🌱 Comment appelle-t-on un animal qui ne mange que des plantes ?", r: "Un herbivore", autres: ["Un carnivore", "Un omnivore"], niveau: "ce2" },
  { q: "🌡️ À combien de degrés l'eau gèle-t-elle ?", r: "0 °C", autres: ["10 °C", "100 °C"], niveau: "ce2" },
  { q: "🦴 À quoi sert le squelette ?", r: "À soutenir le corps", autres: ["À digérer", "À respirer"], niveau: "ce2" },
  { q: "🌍 Qu'est-ce qui éclaire la Terre le jour ?", r: "Le Soleil", autres: ["La Lune", "Les étoiles"], niveau: "ce2" },
  // CM1 — notions plus précises
  { q: "🫀 Quel organe envoie le sang dans le corps ?", r: "Le cœur", autres: ["Le foie", "L'estomac"], niveau: "cm1" },
  { q: "🌡️ À combien de degrés l'eau bout-elle ?", r: "100 °C", autres: ["50 °C", "0 °C"], niveau: "cm1" },
  { q: "🪐 Quelle est la planète où nous vivons ?", r: "La Terre", autres: ["Mars", "Jupiter"], niveau: "cm1" },
  { q: "🌿 Comment appelle-t-on un animal qui mange de tout ?", r: "Un omnivore", autres: ["Un herbivore", "Un carnivore"], niveau: "cm1" },
  { q: "🍃 Quel gaz les plantes produisent-elles le jour ?", r: "L'oxygène", autres: ["Le gaz carbonique", "L'azote"], niveau: "cm1" },
  // CM2 — abstractions
  { q: "🌗 Pourquoi y a-t-il le jour et la nuit ?", r: "La Terre tourne sur elle-même", autres: ["Le Soleil s'éteint", "La Lune cache le Soleil"], niveau: "cm2" },
  { q: "🧪 Comment appelle-t-on le passage de l'eau liquide à la vapeur ?", r: "L'évaporation", autres: ["La condensation", "La fonte"], niveau: "cm2" },
  { q: "🩸 Que transporte le sang dans le corps ?", r: "L'oxygène et les nutriments", autres: ["Seulement de l'eau", "De l'air seulement"], niveau: "cm2" },
  { q: "🌞 Quel astre est au centre du système solaire ?", r: "Le Soleil", autres: ["La Terre", "La Lune"], niveau: "cm2" },
  { q: "♻️ Comment appelle-t-on la chaîne qui relie les êtres qui se mangent ?", r: "La chaîne alimentaire", autres: ["Le cycle de l'eau", "La photosynthèse"], niveau: "cm2" },
];

export function lancerSciences() {
  const niveau = getNiveauCourant();
  const donnees = filtrerParNiveau(QUESTIONS, niveau, NIVEAUX_CUMULES);
  const item = donnees[Math.floor(Math.random() * donnees.length)];

  elTitre.textContent = "🔬 Sciences";
  elQuestion.innerHTML = `<p>${item.q}</p>`;

  const options = melanger([item.r, ...item.autres]);
  const bonIndex = options.indexOf(item.r);
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
