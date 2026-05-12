// app-quests.js — Quest system with progress tracking and celebrations
// #18 Quêtes UI intégrées

import { getNiveauCourant } from "./app-state.js";

const QUETES_DISPONIBLES = {
  "aventure-renard": {
    id: "aventure-renard",
    titre: "🎭 L'aventure du Renard",
    description: "Aide le renard à explorer la forêt magique",
    etapes: [
      {
        nom: "Prépare ton sac à dos",
        jeu: "addition",
        objectif: 5,
        description: "Fais 5 additions correctes",
      },
      {
        nom: "Traverse la rivière",
        jeu: "soustraction",
        objectif: 5,
        description: "Fais 5 soustractions correctes",
      },
      {
        nom: "Trouve le trésor",
        jeu: "multiplication",
        objectif: 5,
        description: "Fais 5 multiplications correctes",
      },
    ],
    reward: "🏆 +50 points + Accessoire spécial!",
  },
  "lecteur-champion": {
    id: "lecteur-champion",
    titre: "📚 Lecteur Champion",
    description: "Deviens un champion de la lecture",
    etapes: [
      {
        nom: "Lis les mots simples",
        jeu: "mots-cles",
        objectif: 5,
        description: "Identifie 5 mots correctement",
      },
      {
        nom: "Comprends les phrases",
        jeu: "comprehension",
        objectif: 5,
        description: "Réponds à 5 questions de compréhension",
      },
      {
        nom: "Raconte l'histoire",
        jeu: "recit",
        objectif: 5,
        description: "Raconte l'histoire correctement 5 fois",
      },
    ],
    reward: "🌟 +40 points + Trophée Lecteur",
  },
  "mathematicien-prodige": {
    id: "mathematicien-prodige",
    titre: "🔢 Mathématicien Prodige",
    description: "Maîtrise tous les calculs",
    etapes: [
      {
        nom: "Additions rapides",
        jeu: "addition",
        objectif: 10,
        description: "Fais 10 additions en moins de 2 minutes",
      },
      {
        nom: "Soustractions précises",
        jeu: "soustraction",
        objectif: 10,
        description: "Fais 10 soustractions correctes",
      },
      {
        nom: "Divisions intelligentes",
        jeu: "division",
        objectif: 10,
        description: "Fais 10 divisions correctes",
      },
    ],
    reward: "🎯 +60 points + Couronne Mathématicien",
  },
};

let queteActive = null;
let etapeCourrante = 0;

export function chargerQueteActive() {
  try {
    const stored = localStorage.getItem("apprentissage-quete-active");
    if (stored) {
      queteActive = JSON.parse(stored);
      etapeCourrante = queteActive.currentStep || 0;
    }
  } catch (e) {
    console.error("Erreur chargement quête active:", e);
  }
}

export function sauvegarderQueteActive() {
  if (queteActive) {
    localStorage.setItem(
      "apprentissage-quete-active",
      JSON.stringify({
        ...queteActive,
        currentStep: etapeCourrante,
      })
    );
  }
}

export function demarrerQuete(queteId) {
  const quete = QUETES_DISPONIBLES[queteId];
  if (!quete) return null;

  queteActive = {
    id: queteId,
    titre: quete.titre,
    etapes: quete.etapes,
    reward: quete.reward,
    startedAt: Date.now(),
    currentStep: 0,
    progresParEtape: quete.etapes.map(() => 0),
  };
  etapeCourrante = 0;

  sauvegarderQueteActive();

  return afficherDemarrerQuete(quete);
}

export function afficherDemarrerQuete(quete) {
  const etape = quete.etapes[0];
  return `
    <div style="
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 1rem;
      text-align: center;
    ">
      <h2 style="margin: 0 0 1rem; font-size: 1.5rem;">🎭 ${quete.titre}</h2>
      <p style="font-size: 1rem; margin: 0 0 1.5rem;">${quete.description}</p>
      <div style="background: rgba(255,255,255,0.2); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
        <p style="margin: 0 0 0.5rem; font-size: 0.9rem;">📍 Étape 1/${quete.etapes.length}</p>
        <p style="margin: 0; font-weight: 700; font-size: 1.1rem;">${etape.nom}</p>
        <p style="margin: 0.5rem 0 0; font-size: 0.85rem;">${etape.description}</p>
      </div>
      <button
        id="btn-demarrer-quete"
        style="
          padding: 0.8rem 1.5rem;
          background: white;
          color: #667eea;
          border: none;
          border-radius: 0.5rem;
          font-weight: 700;
          cursor: pointer;
          font-size: 1rem;
        "
      >
        🚀 Commencer
      </button>
    </div>
  `;
}

export function obtenirQueteActive() {
  return queteActive;
}

export function progresserQuete() {
  if (!queteActive) return null;

  const etapeActuelle = queteActive.etapes[etapeCourrante];
  if (!etapeActuelle) return null;

  queteActive.progresParEtape[etapeCourrante]++;

  if (queteActive.progresParEtape[etapeCourrante] >= etapeActuelle.objectif) {
    etapeCourrante++;

    if (etapeCourrante >= queteActive.etapes.length) {
      return completerQuete();
    }

    sauvegarderQueteActive();
    return afficherEtapeSuivante();
  }

  sauvegarderQueteActive();
  return null;
}

export function afficherEtapeSuivante() {
  if (!queteActive) return null;

  const etape = queteActive.etapes[etapeCourrante];
  const numEtape = etapeCourrante + 1;

  return `
    <div style="
      background: #f0f8ff;
      padding: 1rem;
      border-radius: 0.5rem;
      border-left: 4px solid #667eea;
      margin: 1rem 0;
    ">
      <p style="margin: 0 0 0.5rem; font-size: 0.85rem; color: #666;">✨ ÉTAPE ${numEtape}/${queteActive.etapes.length}</p>
      <p style="margin: 0; font-weight: 700; font-size: 1rem;">${etape.nom}</p>
      <p style="margin: 0.5rem 0 0; font-size: 0.9rem; color: #666;">${etape.description}</p>
    </div>
  `;
}

export function completerQuete() {
  if (!queteActive) return null;

  const completed = {
    ...queteActive,
    completedAt: Date.now(),
  };

  const quetes = JSON.parse(localStorage.getItem("apprentissage-quetes-terminees") || "[]");
  quetes.push(completed);
  localStorage.setItem("apprentissage-quetes-terminees", JSON.stringify(quetes));

  queteActive = null;
  localStorage.removeItem("apprentissage-quete-active");

  return afficherCelebrationQuete(completed);
}

export function afficherCelebrationQuete(quete) {
  return `
    <div style="
      text-align: center;
      padding: 2rem;
      background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
      border-radius: 1rem;
    ">
      <div style="font-size: 3rem; margin-bottom: 1rem; animation: spin 0.6s ease-out;">
        🎉
      </div>
      <h3 style="margin: 0 0 1rem; color: #333; font-size: 1.3rem;">Quête complétée!</h3>
      <p style="margin: 0 0 1.5rem; color: #666; font-size: 1rem;">
        ${quete.titre}
      </p>
      <div style="
        background: rgba(255,255,255,0.8);
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 1.5rem;
      ">
        <p style="margin: 0; font-weight: 700; font-size: 1.2rem; color: #ffd700;">
          ${quete.reward}
        </p>
      </div>
      <button
        id="btn-continuer-quete"
        style="
          padding: 0.8rem 1.5rem;
          background: #333;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-weight: 700;
          cursor: pointer;
          font-size: 1rem;
        "
      >
        ➜ Retour au menu
      </button>
    </div>
  `;
}

export function afficherSelectionQuetes() {
  const quetes = Object.values(QUETES_DISPONIBLES);
  const terminees = JSON.parse(localStorage.getItem("apprentissage-quetes-terminees") || "[]");
  const termeesIds = new Set(terminees.map((q) => q.id));

  return `
    <div style="padding: 2rem; background: white; border-radius: 1rem;">
      <h2 style="margin: 0 0 1.5rem; font-size: 1.5rem;">🎯 Tes quêtes</h2>
      <div style="display: grid; gap: 1.5rem;">
        ${quetes
          .map((quete) => {
            const completed = termeesIds.has(quete.id);
            const status = completed ? "✅ Complétée" : "🆕 Nouvelle";

            return `
              <div style="
                background: linear-gradient(135deg, ${completed ? "#c8e6c9" : "#e3f2fd"} 0%, ${completed ? "#a5d6a7" : "#bbdefb"} 100%);
                padding: 1.5rem;
                border-radius: 0.5rem;
                border-left: 4px solid ${completed ? "#4caf50" : "#2196f3"};
              ">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                  <div>
                    <h3 style="margin: 0 0 0.5rem; font-size: 1.1rem;">${quete.titre}</h3>
                    <p style="margin: 0 0 0.5rem; color: #666; font-size: 0.9rem;">${quete.description}</p>
                    <p style="margin: 0; font-size: 0.85rem; color: #666;">
                      📍 ${quete.etapes.length} étapes
                    </p>
                  </div>
                  <span style="font-size: 1rem; white-space: nowrap;">${status}</span>
                </div>
                ${!completed ? `
                  <button
                    class="btn-demarrer-quete"
                    data-quest-id="${quete.id}"
                    style="
                      width: 100%;
                      margin-top: 1rem;
                      padding: 0.7rem;
                      background: #2196f3;
                      color: white;
                      border: none;
                      border-radius: 0.4rem;
                      font-weight: 700;
                      cursor: pointer;
                    "
                  >
                    🚀 Commencer
                  </button>
                ` : ""}
              </div>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
}

export function obtenirQuestesTerminees() {
  try {
    return JSON.parse(localStorage.getItem("apprentissage-quetes-terminees") || "[]");
  } catch (e) {
    return [];
  }
}

export function reinitialiserQuetes() {
  queteActive = null;
  etapeCourrante = 0;
  localStorage.removeItem("apprentissage-quete-active");
}
