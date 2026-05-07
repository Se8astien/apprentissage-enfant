// app-menu-home.js — Nouveau menu home avec 3 chemins (découverte simplifiée)
// Remplace la grille chaotique de 90 boutons par 3 choix clairs

import {
  elTitre,
  getNiveauCourant,
  getDifficulte,
  revelerSeulEcran,
  lireMaitrise,
} from "./app-state.js";
import { resoudreLanceur } from "./games-registry.js";
import { montrerJeu } from "./app-nav.js";

const ECRAN_ID = "ecran-menu-home";

export function afficherMenuHome() {
  const elMenuHome = document.getElementById(ECRAN_ID);
  if (!elMenuHome) return;

  elMenuHome.hidden = false;

  // Récupérer les données pour recommandations (avec gestion d'erreur)
  let stats = { jeux: {}, erreurs: {} };
  try {
    const statsRaw = localStorage.getItem("stats");
    if (statsRaw) stats = JSON.parse(statsRaw);
  } catch (e) {
    console.warn("Impossible de lire les statistiques", e);
  }

  // Trouver le jeu où l'enfant struggle le plus
  const jeuFaible = trouverJeuFaible(stats);
  const jeuPrefere = trouverJeuPrefere(stats);

  const html = `
    <div style="padding: 1.5rem 0;">
      <!-- HEADER RENARD -->
      <div style="text-align: center; margin-bottom: 2rem;">
        <div style="font-size: 3rem; margin-bottom: 0.5rem;" id="renard-mini">🦊</div>
        <p style="font-size: 1.2rem; font-weight: 700; margin: 0 0 0.3rem 0; color: var(--primaire);">
          Noctis <span id="renard-level">Level 1</span>
        </p>
        <div style="display: flex; gap: 1.5rem; justify-content: center; font-size: 0.9rem;">
          <div>🍎 <span id="renard-faim">████░░</span></div>
          <div>❤️ <span id="renard-bonheur">████░░</span></div>
        </div>
      </div>

      <!-- TITRE -->
      <h2 style="text-align: center; font-size: 1.5rem; margin: 0 0 2rem 0;">
        Qu'est-ce que tu veux faire?
      </h2>

      <!-- CHEMIN 1: RECOMMANDÉ (IA) -->
      <button type="button" id="btn-path-recommande" class="menu-home-card menu-home-card--primary" style="margin-bottom: 1.5rem;">
        <div style="display: flex; align-items: flex-start; gap: 1rem;">
          <div style="font-size: 2.5rem; flex-shrink: 0;">💡</div>
          <div style="text-align: left; flex-grow: 1;">
            <h3 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">On te propose...</h3>
            <p id="recommande-jeu" style="margin: 0.3rem 0; font-size: 1rem; font-weight: 700; color: var(--primaire);">
              ${jeuFaible.nom || 'Addition'} ${jeuFaible.emoji || '🎈'}
            </p>
            <p id="recommande-raison" style="margin: 0; font-size: 0.85rem; color: #666;">
              ${jeuFaible.raison || 'Aide pour progresser'}
            </p>
          </div>
        </div>
      </button>

      <!-- CHEMIN 2: TOUS LES JEUX (CATÉGORIES) -->
      <button type="button" id="btn-path-tous" class="menu-home-card" style="margin-bottom: 1.5rem;">
        <div style="display: flex; align-items: flex-start; gap: 1rem;">
          <div style="font-size: 2.5rem; flex-shrink: 0;">📚</div>
          <div style="text-align: left; flex-grow: 1;">
            <h3 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">Tous les jeux</h3>
            <p style="margin: 0.3rem 0; font-size: 0.9rem; color: #666;">
              Par catégorie (Maths, Lecture, Orthographe...)
            </p>
            <div style="display: flex; gap: 0.3rem; margin-top: 0.5rem; flex-wrap: wrap;">
              <span style="background: #f0f0f0; padding: 0.3rem 0.6rem; border-radius: 0.4rem; font-size: 0.8rem;">
                🧮 Maths
              </span>
              <span style="background: #f0f0f0; padding: 0.3rem 0.6rem; border-radius: 0.4rem; font-size: 0.8rem;">
                📖 Lecture
              </span>
              <span style="background: #f0f0f0; padding: 0.3rem 0.6rem; border-radius: 0.4rem; font-size: 0.8rem;">
                ✏️ Ortho
              </span>
            </div>
          </div>
        </div>
      </button>

      <!-- CHEMIN 3: ALÉATOIRE (SURPRISE) -->
      <button type="button" id="btn-path-aleatoire" class="menu-home-card" style="margin-bottom: 2rem;">
        <div style="display: flex; align-items: flex-start; gap: 1rem;">
          <div style="font-size: 2.5rem; flex-shrink: 0;">🎲</div>
          <div style="text-align: left; flex-grow: 1;">
            <h3 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">Jeu au hasard</h3>
            <p style="margin: 0.3rem 0; font-size: 0.9rem; color: #666;">
              L'app choisit pour toi! Surprise! 🎉
            </p>
          </div>
        </div>
      </button>

      <!-- BOTTOM NAVIGATION -->
      <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eee;">
        <button type="button" id="btn-maison-menu" class="btn-icon-menu" aria-label="Ma Maison">
          <span style="font-size: 1.8rem;">🏠</span>
          <span style="font-size: 0.8rem; display: block;">Maison</span>
        </button>
        <button type="button" id="btn-stats-menu" class="btn-icon-menu" aria-label="Statistiques">
          <span style="font-size: 1.8rem;">📊</span>
          <span style="font-size: 0.8rem; display: block;">Stats</span>
        </button>
        <button type="button" id="btn-parent-menu" class="btn-icon-menu" aria-label="Parent (Analytics)">
          <span style="font-size: 1.8rem;">👨‍👩‍👧</span>
          <span style="font-size: 0.8rem; display: block;">Parent</span>
        </button>
      </div>
    </div>
  `;

  elMenuHome.innerHTML = html;

  // Event listeners
  document.getElementById("btn-path-recommande").addEventListener("click", () => {
    lancerJeu(jeuFaible.id);
  });

  document.getElementById("btn-path-tous").addEventListener("click", () => {
    afficherMenuCategories();
  });

  document.getElementById("btn-path-aleatoire").addEventListener("click", () => {
    lancerJeuAleatoire();
  });

  document.getElementById("btn-maison-menu").addEventListener("click", () => {
    afficherEcran("ecran-maison");
  });

  document.getElementById("btn-stats-menu").addEventListener("click", () => {
    afficherStatistiques();
  });

  document.getElementById("btn-parent-menu").addEventListener("click", async () => {
    const { afficherParentDashboard: showParentDash } = await import("./app-parent-dashboard.js");
    showParentDash();
  });
}

function trouverJeuFaible(stats) {
  // Retourner le jeu où l'enfant a la plus faible réussite
  const jeusSorted = Object.entries(stats.jeux || {})
    .map(([id, data]) => ({
      id,
      nom: data.nom || id,
      emoji: data.emoji || '🎮',
      reussite: (data.reussite || 50),
    }))
    .sort((a, b) => a.reussite - b.reussite);

  return jeusSorted[0] || {
    id: "addition",
    nom: "Addition",
    emoji: "🎈",
    raison: "Continue à t'entraîner!"
  };
}

function trouverJeuPrefere(stats) {
  const jeusSorted = Object.entries(stats.jeux || {})
    .map(([id, data]) => ({
      id,
      nom: data.nom || id,
      emoji: data.emoji || '🎮',
      sessions: (data.sessions || 0),
    }))
    .sort((a, b) => b.sessions - a.sessions);

  return jeusSorted[0] || { id: "addition", nom: "Addition", emoji: "🎈" };
}

function afficherMenuCategories() {
  const elMenuHome = document.getElementById("ecran-menu-home");
  if (!elMenuHome) return;

  const categories = [
    { nom: "Mathématiques", emoji: "🧮", jeux: ["addition", "soustraction", "multiplication", "division", "fractions"] },
    { nom: "Lecture", emoji: "📖", jeux: ["lecture", "syllabes", "lecturePhrase", "comprendreTexte", "lectureExpress"] },
    { nom: "Orthographe", emoji: "✏️", jeux: ["homophones", "orthopuzzle", "ponctuationPuzzle"] },
    { nom: "Grammaire", emoji: "▲", jeux: ["grammaire", "conjugaison", "atelierAccords"] },
    { nom: "Logique", emoji: "🤖", jeux: ["sequence", "code", "triLogique"] },
  ];

  const html = `
    <div style="padding: 1.5rem;">
      <h2 style="text-align: center; font-size: 1.4rem; margin: 0 0 1.5rem 0;">
        📚 Catégories de jeux
      </h2>
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${categories.map(cat => `
          <button type="button" class="menu-home-card" style="cursor: pointer;">
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="font-size: 2rem;">${cat.emoji}</div>
              <div style="text-align: left; flex-grow: 1;">
                <h3 style="margin: 0; font-size: 1.1rem;">${cat.nom}</h3>
                <p style="margin: 0.3rem 0 0 0; font-size: 0.9rem; color: #666;">${cat.jeux.length} jeux</p>
              </div>
              <div style="color: var(--primaire); font-size: 1.5rem;">→</div>
            </div>
          </button>
        `).join('')}
      </div>
      <button type="button" id="btn-retour-categories" aria-label="Retour au menu principal" style="
        margin-top: 1.5rem;
        background: none;
        border: none;
        color: var(--primaire);
        font-size: 1rem;
        cursor: pointer;
        text-decoration: underline;
      ">← Retour au menu</button>
    </div>
  `;

  elMenuHome.innerHTML = html;
  document.getElementById("btn-retour-categories").addEventListener("click", afficherMenuHome);
}

function lancerJeuAleatoire() {
  // Choisir un jeu aléatoire et le lancer
  const LISTE_JEUX = [
    "addition", "soustraction", "multiplication", "fractions",
    "lecture", "syllabes", "conjugaison", "grammaire",
    "formes", "symmetrie", "angles", "perimetre",
    "heure", "calendrier", "durees",
  ];
  const jeuRandom = LISTE_JEUX[Math.floor(Math.random() * LISTE_JEUX.length)];
  lancerJeu(jeuRandom);
}

async function lancerJeu(jeuId) {
  const lanceur = await resoudreLanceur(jeuId);
  if (lanceur && typeof lanceur === "function") {
    montrerJeu(jeuId, { [jeuId]: lanceur });
  }
}

function afficherEcran(ecranId) {
  const ecrans = document.querySelectorAll(".ecran");
  ecrans.forEach(e => e.hidden = true);
  const ecran = document.getElementById(ecranId);
  if (ecran) ecran.hidden = false;
}

function afficherStatistiques() {
  const elMenuHome = document.getElementById("ecran-menu-home");
  if (!elMenuHome) return;

  const stats = localStorage.getItem("stats") ? JSON.parse(localStorage.getItem("stats")) : { jeux: {}, sessions: 0 };
  const etoiles = parseInt(localStorage.getItem("etoiles") || "0");
  const enfantNom = localStorage.getItem("enfant-nom") || "Enfant";

  const jeusMaitris = Object.entries(stats.jeux || {})
    .filter(([id, data]) => lireMaitrise(id).some(Boolean))
    .length;

  const jeusMoins50 = Object.entries(stats.jeux || {})
    .filter(([id, data]) => (data.reussite || 50) < 50)
    .map(([id, data]) => ({ id, nom: data.nom || id, reussite: data.reussite || 50 }))
    .sort((a, b) => a.reussite - b.reussite)
    .slice(0, 3);

  const html = `
    <div style="padding: 1.5rem;">
      <h2 style="text-align: center; font-size: 1.4rem; margin: 0 0 1.5rem 0;">
        📊 Statistiques de ${enfantNom}
      </h2>

      <div class="parent-card parent-card--primary" style="margin-bottom: 1.5rem;">
        <h3 style="margin: 0 0 1rem 0;">🏆 Progression</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div style="text-align: center;">
            <div style="font-size: 2.5rem; font-weight: 700;">${etoiles}</div>
            <div style="font-size: 0.9rem; color: rgba(255,255,255,0.8);">⭐ étoiles</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 2.5rem; font-weight: 700;">${jeusMaitris}</div>
            <div style="font-size: 0.9rem; color: rgba(255,255,255,0.8);">🎮 jeux maîtrisés</div>
          </div>
        </div>
      </div>

      ${jeusMoins50.length > 0 ? `
        <div class="parent-card parent-card--action" style="margin-bottom: 1.5rem;">
          <h3 style="margin: 0 0 1rem 0;">⚠️ À travailler</h3>
          <div style="display: flex; flex-direction: column; gap: 0.8rem;">
            ${jeusMoins50.map(jeu => `
              <div style="padding: 0.8rem; background: rgba(255,152,0,0.1); border-radius: 0.5rem;">
                <div style="font-weight: 600;">${jeu.nom}</div>
                <div style="font-size: 0.9rem; color: #666; margin-top: 0.3rem;">Réussite: ${jeu.reussite}%</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
        <div class="parent-card" style="text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">${stats.sessions || 0}</div>
          <div style="font-size: 0.9rem; color: #666;">sessions jouées</div>
        </div>
        <div class="parent-card" style="text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">${Object.keys(stats.jeux || {}).length}</div>
          <div style="font-size: 0.9rem; color: #666;">jeux essayés</div>
        </div>
      </div>

      <button type="button" id="btn-retour-stats" aria-label="Retour au menu principal" style="
        width: 100%;
        background: var(--primaire);
        color: white;
        border: none;
        padding: 0.8rem 1.5rem;
        border-radius: 0.8rem;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
      ">← Retour au menu</button>
    </div>
  `;

  elMenuHome.innerHTML = html;
  document.getElementById("btn-retour-stats").addEventListener("click", afficherMenuHome);
}

export function rendreRenardVisibleMenuHome() {
  // Mettre à jour le renard et ses jauges en temps réel
  const renard = localStorage.getItem("renard-nom") || "Noctis";
  const etoiles = parseInt(localStorage.getItem("etoiles") || "0");
  const level = Math.floor(etoiles / 50) + 1;

  const el = document.getElementById("renard-level");
  if (el) el.textContent = `Level ${level}`;

  // Jauges
  // À faire: calculer faim et bonheur basés sur le temps
}
