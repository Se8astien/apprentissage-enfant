// app-menu-home.js — Nouveau menu home avec 3 chemins (découverte simplifiée)
// Remplace la grille chaotique de 90 boutons par 3 choix clairs

import {
  elTitre,
  getNiveauCourant,
  getDifficulte,
} from "./app-state.js";

export function afficherMenuHome() {
  const elMenuHome = document.getElementById("ecran-menu-home");
  if (!elMenuHome) return;

  elMenuHome.hidden = false;

  // Récupérer les données pour recommandations
  const stats = localStorage.getItem("stats") ?
    JSON.parse(localStorage.getItem("stats")) :
    { jeux: {}, erreurs: {} };

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
  // Implémentation du menu par catégories
  // À faire: afficher les cartes de catégories (Maths, Lecture, Ortho...)
  // Puis les jeux de chaque catégorie avec progrès bar
  console.log("Menu catégories à implémenter");
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

function lancerJeu(jeuId) {
  // Lancer le jeu avec transition
  console.log("Lancer jeu:", jeuId);
  // À faire: importer resoudreLanceur et lancer
}

function afficherEcran(ecranId) {
  const ecrans = document.querySelectorAll(".ecran");
  ecrans.forEach(e => e.hidden = true);
  const ecran = document.getElementById(ecranId);
  if (ecran) ecran.hidden = false;
}

function afficherStatistiques() {
  console.log("Afficher statistiques");
  // À faire: tableau de bord stats enfant
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
