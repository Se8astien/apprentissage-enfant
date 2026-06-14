// games-histoire.js — Histoire (repères du temps, périodes, personnages, dates)

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
  // CP — repères du temps proches de l'enfant
  { q: "📅 Qu'est-ce qui vient juste avant aujourd'hui ?", r: "Hier", autres: ["Demain", "L'an prochain"], niveau: "cp" },
  { q: "⏳ Qui est né avant toi dans la famille ?", r: "Tes grands-parents", autres: ["Ton petit frère", "Tes enfants"], niveau: "cp" },
  { q: "🏰 Où habitaient les rois et les reines autrefois ?", r: "Dans un château", autres: ["Dans un immeuble", "Dans une caravane"], niveau: "cp" },
  { q: "🕰️ Qu'utilisait-on avant les voitures pour se déplacer ?", r: "Le cheval", autres: ["L'avion", "Le métro"], niveau: "cp" },
  { q: "📜 Comment appelle-t-on une histoire très ancienne ?", r: "Le passé", autres: ["Le futur", "Le présent"], niveau: "cp" },
  // CE1 — vie d'autrefois
  { q: "🔥 Que faisaient les hommes préhistoriques pour s'éclairer et se réchauffer ?", r: "Du feu", autres: ["De l'électricité", "Des bougies parfumées"], niveau: "ce1" },
  { q: "🦣 Quel grand animal poilu chassaient les hommes préhistoriques ?", r: "Le mammouth", autres: ["Le lion", "Le dinosaure"], niveau: "ce1" },
  { q: "🪨 Avec quelle matière fabriquait-on les premiers outils ?", r: "La pierre", autres: ["Le plastique", "Le verre"], niveau: "ce1" },
  { q: "✒️ Comment écrivait-on avant les stylos ?", r: "Avec une plume", autres: ["Avec un clavier", "Avec un crayon de couleur"], niveau: "ce1" },
  { q: "🏛️ Qui commandait dans la France d'autrefois ?", r: "Le roi", autres: ["Le président", "Le maire"], niveau: "ce1" },
  // CE2 — Antiquité et Moyen Âge
  { q: "🏺 Quel peuple ancien a construit les pyramides ?", r: "Les Égyptiens", autres: ["Les Romains", "Les Vikings"], niveau: "ce2" },
  { q: "⚔️ Qui vivait dans les châteaux forts au Moyen Âge ?", r: "Les chevaliers", autres: ["Les astronautes", "Les cow-boys"], niveau: "ce2" },
  { q: "🛡️ Quel peuple gaulois résistait aux Romains ?", r: "Les Gaulois", autres: ["Les Égyptiens", "Les Grecs"], niveau: "ce2" },
  { q: "📜 Comment appelle-t-on les dessins préhistoriques sur les parois des grottes ?", r: "Des peintures rupestres", autres: ["Des photos", "Des affiches"], niveau: "ce2" },
  { q: "🏛️ Dans quel pays sont nés les Jeux olympiques ?", r: "En Grèce", autres: ["En Italie", "En Égypte"], niveau: "ce2" },
  // CM1 — grandes périodes et personnages
  { q: "👑 Quel roi a fait construire le château de Versailles ?", r: "Louis XIV", autres: ["Napoléon", "Charlemagne"], niveau: "cm1" },
  { q: "📚 Quel empereur a créé l'école pour beaucoup d'enfants, selon la légende ?", r: "Charlemagne", autres: ["César", "Vercingétorix"], niveau: "cm1" },
  { q: "🗓️ Quelle période vient juste après la Préhistoire ?", r: "L'Antiquité", autres: ["Le Moyen Âge", "L'époque moderne"], niveau: "cm1" },
  { q: "🚢 Qui est arrivé en Amérique en 1492 ?", r: "Christophe Colomb", autres: ["Napoléon", "Jules César"], niveau: "cm1" },
  { q: "⚔️ Quel général gaulois a combattu Jules César ?", r: "Vercingétorix", autres: ["Charlemagne", "Louis XIV"], niveau: "cm1" },
  // CM2 — dates et époque contemporaine
  { q: "🗽 En quelle année a eu lieu la Révolution française ?", r: "1789", autres: ["1492", "1945"], niveau: "cm2" },
  { q: "🇫🇷 Que célèbre-t-on le 14 juillet en France ?", r: "La prise de la Bastille", autres: ["La fin de la guerre", "Le couronnement du roi"], niveau: "cm2" },
  { q: "🕊️ En quelle année s'est terminée la Seconde Guerre mondiale ?", r: "1945", autres: ["1789", "1815"], niveau: "cm2" },
  { q: "👨 Quel général est devenu empereur des Français en 1804 ?", r: "Napoléon", autres: ["Louis XIV", "Charlemagne"], niveau: "cm2" },
  { q: "🗓️ Quelle période vient après le Moyen Âge ?", r: "Les Temps modernes", autres: ["L'Antiquité", "La Préhistoire"], niveau: "cm2" },
];

export function lancerHistoire() {
  const niveau = getNiveauCourant();
  const donnees = filtrerParNiveau(QUESTIONS, niveau, NIVEAUX_CUMULES);
  const item = donnees[Math.floor(Math.random() * donnees.length)];

  elTitre.textContent = "📜 Histoire";
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
