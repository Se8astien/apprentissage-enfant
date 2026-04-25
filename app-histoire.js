// app-histoire.js — narrative layer: "La Quête de la Forêt Lumineuse"

import { lireEtoiles, lireNomRenard } from "./app-state.js";

const CHAPITRES = [
  {
    stade: 0,
    emoji: "🌑",
    titre: "La Forêt endormie",
    texte: "[Nom] vient de s'éveiller dans une forêt plongée dans le noir. La magie a disparu… mais toi, tu es là !",
    seuil: 0,
  },
  {
    stade: 1,
    emoji: "🌱",
    titre: "L'Éveil de la Forêt",
    texte: "Les premières lueurs apparaissent ! [Nom] trace un sentier dans l'obscurité. La forêt commence à se réveiller !",
    seuil: 21,
  },
  {
    stade: 2,
    emoji: "🌲",
    titre: "Les Épreuves",
    texte: "Un vieux gardien barre le chemin. Il ne laisse passer que les plus savants… et [Nom] a toi !",
    seuil: 61,
  },
  {
    stade: 3,
    emoji: "🌟",
    titre: "La Source Magique",
    texte: "Au cœur de la forêt, une source endormie attend. Tes connaissances ont le pouvoir de la réveiller !",
    seuil: 151,
  },
  {
    stade: 4,
    emoji: "🏆",
    titre: "La Légende",
    texte: "La Forêt Lumineuse brille à nouveau ! [Nom] et toi, vous êtes devenus une véritable légende !",
    seuil: 301,
  },
];

const SEUILS = [0, 21, 61, 151, 301];
const HISTOIRE_INTRO_KEY = "histoire-intro-vue";

function nomFox() {
  return lireNomRenard() || "Foxy";
}

function personnaliser(texte) {
  return texte.replace(/\[Nom\]/g, nomFox());
}

export function getChapitreParStade(stade) {
  return CHAPITRES[Math.min(Math.max(stade, 0), 4)];
}

export function getChapitreActuel() {
  const etoiles = lireEtoiles();
  let idx = 0;
  for (let i = 1; i < SEUILS.length; i++) {
    if (etoiles >= SEUILS[i]) idx = i;
  }
  return CHAPITRES[idx];
}

export function afficherIntroHistoire(nom) {
  if (localStorage.getItem(HISTOIRE_INTRO_KEY)) return;
  localStorage.setItem(HISTOIRE_INTRO_KEY, "1");

  const prenom = nom || "Foxy";
  const texte = `Il y a longtemps, une forêt magique brillait de mille étoiles. Mais la magie s'est endormie… ${prenom} a besoin de toi pour la réveiller ! Chaque bonne réponse rallume une étoile. L'aventure commence !`;

  const overlay = document.createElement("div");
  overlay.className = "evolution-overlay";
  overlay.innerHTML = `
    <div class="evolution-carte histoire-intro-carte">
      <p class="histoire-intro-emoji">🌑🦊✨</p>
      <p class="evolution-titre">La Forêt Lumineuse</p>
      <p class="histoire-intro-texte">${texte}</p>
      <button type="button" class="btn-evolution-fermer">C'est parti ! 🌟</button>
    </div>`;
  document.body.appendChild(overlay);
  const fermer = () => {
    overlay.style.opacity = "0";
    overlay.style.transition = "opacity 0.3s";
    setTimeout(() => overlay.remove(), 300);
  };
  overlay.querySelector(".btn-evolution-fermer").addEventListener("click", fermer);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) fermer(); });
}

export function afficherContexteHistoireMaison(container) {
  const ancien = container.querySelector("#histoire-maison-panel");
  if (ancien) ancien.remove();

  const etoiles = lireEtoiles();
  const chapitre = getChapitreActuel();
  const stade = chapitre.stade;

  let progression = "";
  if (stade < 4) {
    const seuilSuivant = SEUILS[stade + 1];
    const seuilActuel  = SEUILS[stade];
    const pct  = Math.min(100, Math.round(((etoiles - seuilActuel) / (seuilSuivant - seuilActuel)) * 100));
    const reste = seuilSuivant - etoiles;
    const chapSuivant = CHAPITRES[stade + 1];
    progression = `
      <p class="histoire-panel-suivant">${reste} ⭐ pour : ${chapSuivant.emoji} ${chapSuivant.titre}</p>
      <div class="histoire-barre-fond"><div class="histoire-barre-fill" style="width:${pct}%"></div></div>`;
  } else {
    progression = `<p class="histoire-panel-suivant">🏆 Aventure terminée — tu es une légende !</p>`;
  }

  const panel = document.createElement("div");
  panel.id = "histoire-maison-panel";
  panel.className = "histoire-panel";
  panel.innerHTML = `
    <p class="histoire-panel-label">📖 Notre aventure</p>
    <p class="histoire-panel-chapitre">${chapitre.emoji} <strong>${chapitre.titre}</strong></p>
    <p class="histoire-panel-texte">${personnaliser(chapitre.texte)}</p>
    ${progression}`;

  const jauges = container.querySelector(".maison-jauges");
  if (jauges) {
    container.insertBefore(panel, jauges);
  } else {
    container.appendChild(panel);
  }
}
