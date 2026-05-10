// app-features-advanced.js — Modes avancés et dashboards
// #3 Révision bloquante + #4 Dashboard parent + #6 Quêtes + #7 Chrono
// #8 Duels parent + #9 Créateur jeux + #12 Stats + #13 Palmarès

import { getNiveauCourant } from "./app-state.js";

// ============================================================================
// #3 - RÉVISION BLOQUANTE (après erreur)
// ============================================================================

let jeuBloque = null;
let tentativesRevision = 0;

export function activerRevisionBloquante(jeuId, concept) {
  jeuBloque = jeuId;
  tentativesRevision = 0;

  return `
    <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); color: white; padding: 2rem; border-radius: 1rem; text-align: center;">
      <h3 style="margin: 0 0 1rem;">⚠️ Attends!</h3>
      <p style="font-size: 0.95rem; margin: 0 0 1.5rem;">
        Tu dois maîtriser <strong>${concept}</strong> avant de continuer
      </p>
      <p style="font-size: 0.85rem; margin: 0 0 1rem;">
        Je te propose 3 essais rapides pour pratiquer
      </p>
      <button
        id="btn-revision-bloquante"
        style="
          padding: 0.8rem 1.5rem;
          background: white;
          color: #ff6b6b;
          border: none;
          border-radius: 0.5rem;
          font-weight: 700;
          cursor: pointer;
          font-size: 1rem;
        "
      >
        🔄 Pratiquer maintenant
      </button>
    </div>
  `;
}

export function getJeuBloque() {
  return jeuBloque;
}

export function validerRevision(reussie) {
  tentativesRevision++;
  if (reussie || tentativesRevision >= 3) {
    const result = reussie ? "✅ Bravo! Tu maîtrises maintenant!" : "⚠️ À revoir plus tard";
    jeuBloque = null;
    return result;
  }
  return `Essai ${tentativesRevision}/3...`;
}

// ============================================================================
// #4 - DASHBOARD PARENT (heatmap + recommandations)
// ============================================================================

export function genererDashboardParent(enfant, stats = {}) {

  const heatmap = `
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin: 1.5rem 0;">
      ${Object.entries(stats.competences || {}).map(([comp, score]) => {
        let couleur = "#4caf50"; // vert
        if (score < 60) couleur = "#f44336"; // rouge
        else if (score < 80) couleur = "#ff9800"; // orange

        return `
          <div style="
            background: ${couleur};
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            text-align: center;
            font-weight: 700;
          ">
            <div style="font-size: 0.85rem; margin-bottom: 0.3rem;">${comp}</div>
            <div style="font-size: 1.3rem;">${score}%</div>
          </div>
        `;
      }).join("")}
    </div>
  `;

  const recommendations = stats.competences
    ? Object.entries(stats.competences)
        .filter(([, score]) => score < 70)
        .map(([comp]) => `Refaire ${comp}`)
    : [];

  return `
    <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h2 style="margin: 0 0 1rem;">📊 Progression de ${enfant}</h2>

      <div style="margin-bottom: 1.5rem;">
        <p style="font-size: 0.9rem; color: #666; margin: 0 0 0.5rem;">Maîtrise par domaine:</p>
        ${heatmap}
      </div>

      ${recommendations.length > 0 ? `
        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 1rem; border-radius: 0.5rem;">
          <p style="font-size: 0.9rem; font-weight: 700; margin: 0 0 0.5rem;">💡 Recommandations pour cette semaine:</p>
          <ul style="margin: 0; padding-left: 1.5rem; font-size: 0.85rem;">
            ${recommendations.map(rec => `<li>${rec}</li>`).join("")}
          </ul>
        </div>
      ` : ""}
    </div>
  `;
}

// ============================================================================
// #6 - QUÊTES NARRATIVES (progression)
// ============================================================================

let etapeQuete = 0;

export function demarrerQuete(queteId, queteData) {
  etapeQuete = 0;

  return `
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; border-radius: 1rem; text-align: center;">
      <h2 style="margin: 0 0 1rem; font-size: 1.5rem;">🎭 ${queteData.titre}</h2>
      <p style="font-size: 1rem; margin: 0 0 1.5rem;">${queteData.etapes[0].description}</p>
      <p style="font-size: 0.85rem; margin: 0;">Étape 1/${queteData.etapes.length}</p>
    </div>
  `;
}

export function avanturetapeQuete() {
  etapeQuete++;
  return etapeQuete;
}

export function completerQuete(queteData) {
  return `
    <div style="text-align: center; padding: 2rem; background: #f0fff5; border-radius: 1rem;">
      <div style="font-size: 3rem; margin-bottom: 1rem;">🎉</div>
      <h3 style="margin: 0 0 1rem; color: #00b894;">Quête complétée!</h3>
      <p style="font-size: 0.95rem; margin: 0 0 1rem; color: #666;">
        ${queteData.recompense}
      </p>
    </div>
  `;
}

// ============================================================================
// #7 - CHRONO PÉDAGOGIQUE (suivi temps)
// ============================================================================

let tempsDebutSession = null;

export function demarrerChronoSession() {
  tempsDebutSession = Date.now();
}

export function obtenirTempsSession() {
  if (!tempsDebutSession) return 0;
  return Math.round((Date.now() - tempsDebutSession) / 60000); // en minutes
}

export function obtenirMessageTemps(tempsEcoule, tempsOptimal) {
  if (tempsEcoule >= tempsOptimal * 1.5) {
    return {
      type: "pause",
      message: "⏰ Tu as bien travaillé! Un repos? 😊",
      html: `
        <div style="background: #fff9c4; border-radius: 0.5rem; padding: 1rem; text-align: center;">
          <p style="margin: 0; font-weight: 700;">Tu as travaillé ${tempsEcoule} minutes!</p>
          <p style="margin: 0.5rem 0 0; font-size: 0.9rem; color: #666;">
            C'est un bon moment pour te reposer 🌟
          </p>
        </div>
      `,
    };
  }
  return null;
}

// ============================================================================
// #8 - DUELS PARENT-ENFANT (VS mode)
// ============================================================================

export function creerDuelParent(jeuId, enfant, parent) {
  return `
    <div style="text-align: center; padding: 2rem; background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); border-radius: 1rem;">
      <h2 style="margin: 0 0 1rem; font-size: 1.5rem;">⚡ VS Mode</h2>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
        <div style="background: rgba(255,255,255,0.8); padding: 1rem; border-radius: 0.5rem;">
          <p style="font-size: 0.85rem; margin: 0 0 0.3rem; color: #666;">TON ÉQUIPE</p>
          <p style="font-size: 1.3rem; font-weight: 700; margin: 0; color: #667eea;">👦 ${enfant}</p>
        </div>
        <div style="background: rgba(255,255,255,0.8); padding: 1rem; border-radius: 0.5rem;">
          <p style="font-size: 0.85rem; margin: 0 0 0.3rem; color: #666;">ADVERSAIRE</p>
          <p style="font-size: 1.3rem; font-weight: 700; margin: 0; color: #e74c3c;">👨 ${parent}</p>
        </div>
      </div>

      <p style="font-size: 0.9rem; color: #666; margin: 0;">
        Qui finira ${jeuId} en premier? 🚀
      </p>
    </div>
  `;
}

export function afficherResultatDuel(enfantScore, parentScore, enfantTemps, parentTemps) {
  const enfantGagne = enfantScore > parentScore || (enfantScore === parentScore && enfantTemps < parentTemps);

  return `
    <div style="text-align: center; padding: 2rem; background: ${enfantGagne ? '#c8e6c9' : '#ffccbc'}; border-radius: 1rem;">
      <h3 style="margin: 0 0 1rem; font-size: 1.2rem;">
        ${enfantGagne ? '🏆 TU AS GAGNÉ!' : '💪 Pas mal!'}
      </h3>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
        <div>
          <p style="font-size: 0.85rem; margin: 0; color: #666;">Toi</p>
          <p style="font-size: 1.2rem; font-weight: 700; margin: 0.3rem 0 0;">${enfantScore} pts</p>
          <p style="font-size: 0.75rem; margin: 0.2rem 0 0; color: #999;">${enfantTemps}s</p>
        </div>
        <div>
          <p style="font-size: 0.85rem; margin: 0; color: #666;">Papa/Maman</p>
          <p style="font-size: 1.2rem; font-weight: 700; margin: 0.3rem 0 0;">${parentScore} pts</p>
          <p style="font-size: 0.75rem; margin: 0.2rem 0 0; color: #999;">${parentTemps}s</p>
        </div>
      </div>

      <p style="font-size: 0.9rem; color: #666; margin: 0;">
        ${enfantGagne ? "Bravo! Tu as battu papa/maman! 🎉" : "Pas mal! Essaie de battre le record la prochaine fois!"}
      </p>
    </div>
  `;
}

// ============================================================================
// #9 - CRÉATEUR DE JEUX MAISON (structure)
// ============================================================================

export function creerInterfaceCreateurJeux() {
  return `
    <div style="padding: 2rem; background: white; border-radius: 1rem; max-width: 600px; margin: 0 auto;">
      <h2 style="margin: 0 0 1.5rem;">🎮 Créer un jeu personnel</h2>

      <form id="form-creer-jeu" style="display: flex; flex-direction: column; gap: 1rem;">
        <div>
          <label style="display: block; font-weight: 700; margin-bottom: 0.3rem;">Nom du jeu:</label>
          <input
            type="text"
            name="nom"
            placeholder="Ex: Mots de la semaine 5"
            style="
              width: 100%;
              padding: 0.7rem;
              border: 1px solid #ddd;
              border-radius: 0.4rem;
              font-size: 0.95rem;
            "
          />
        </div>

        <div>
          <label style="display: block; font-weight: 700; margin-bottom: 0.3rem;">Type:</label>
          <select
            name="type"
            style="
              width: 100%;
              padding: 0.7rem;
              border: 1px solid #ddd;
              border-radius: 0.4rem;
            "
          >
            <option>Choix multiple</option>
            <option>Drag & drop</option>
            <option>Typing</option>
            <option>Matching</option>
          </select>
        </div>

        <div>
          <label style="display: block; font-weight: 700; margin-bottom: 0.3rem;">Questions (une par ligne):</label>
          <textarea
            name="questions"
            placeholder="Question 1 | Bonne réponse | Mauvaise 1 | Mauvaise 2"
            style="
              width: 100%;
              height: 150px;
              padding: 0.7rem;
              border: 1px solid #ddd;
              border-radius: 0.4rem;
              font-family: monospace;
            "
          ></textarea>
        </div>

        <button
          type="submit"
          style="
            padding: 0.8rem;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 0.4rem;
            font-weight: 700;
            cursor: pointer;
          "
        >
          📦 Créer et partager
        </button>
      </form>
    </div>
  `;
}

// ============================================================================
// #12 - STATS DÉTAILLÉES (pour enfants curieux CM1+)
// ============================================================================

export function creerDashboardStats(enfant, stats = {}) {

  return `
    <div style="padding: 2rem; background: white; border-radius: 1rem;">
      <h2 style="margin: 0 0 1.5rem;">📈 Mes stats détaillées</h2>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem;">
        <div style="background: #f5f5f5; padding: 1rem; border-radius: 0.5rem; text-align: center;">
          <div style="font-size: 2rem; font-weight: 700; color: #667eea;">${stats.partiesTotal || 0}</div>
          <div style="font-size: 0.85rem; color: #666;">Questions répondues</div>
        </div>
        <div style="background: #f5f5f5; padding: 1rem; border-radius: 0.5rem; text-align: center;">
          <div style="font-size: 2rem; font-weight: 700; color: #00b894;">${Math.round(stats.tauxReussite || 0)}%</div>
          <div style="font-size: 0.85rem; color: #666;">Taux de réussite</div>
        </div>
        <div style="background: #f5f5f5; padding: 1rem; border-radius: 0.5rem; text-align: center;">
          <div style="font-size: 2rem; font-weight: 700; color: #ffc107;">${stats.meilleureCombo || 0}</div>
          <div style="font-size: 0.85rem; color: #666;">Meilleur combo</div>
        </div>
      </div>

      <h3 style="margin: 1.5rem 0 1rem; font-size: 1.1rem;">📊 Par domaine:</h3>
      ${Object.entries(stats.parDomaine || {}).map(([domaine, data]) => `
        <div style="margin-bottom: 1rem; padding: 1rem; background: #f9f9f9; border-radius: 0.5rem;">
          <p style="margin: 0 0 0.5rem; font-weight: 700;">${domaine}</p>
          <p style="margin: 0; font-size: 0.85rem; color: #666;">
            ${data.questions || 0} questions · ${Math.round(data.tauxReussite || 0)}% ·
            ⏱️ Moyen: ${Math.round(data.tempsMoyen || 0)}s
          </p>
        </div>
      `).join("")}

      <div style="margin-top: 2rem; padding: 1rem; background: #f0f8ff; border-radius: 0.5rem;">
        <p style="margin: 0; font-size: 0.9rem; color: #666;">
          💡 <strong>Observation:</strong> Tu es plus rapide quand tu as bien dormi! Dors 8h+
        </p>
      </div>
    </div>
  `;
}
