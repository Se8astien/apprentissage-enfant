// app-analytics-dashboard.js — Analytics dashboard for pilot evaluation
// Display learning outcomes, engagement metrics, export data for analysis

import {
  calculerIndicateursPilote,
  obtenirAnalyticsGlobales,
  obtenirProgressionParDomaine,
  exporterDonneesPilote,
  telechargerRapportPilote,
} from "./app-analytics-tracking.js";

export function afficherTableauBordAnalytiques() {
  const el = document.getElementById("ecran-analytics-dashboard");
  if (!el) return;

  const indicateurs = calculerIndicateursPilote();
  const progression = obtenirProgressionParDomaine();
  const dureeTotalHeures = Math.floor(indicateurs.tempsEngagementMoyen / 3600);
  const dureeTotalMinutes = Math.floor((indicateurs.tempsEngagementMoyen % 3600) / 60);

  const html = `
    <div style="padding: 1.5rem;">
      <h2 style="margin-top: 0; font-size: 1.5rem;">📊 Analytique du Pilote</h2>
      <p style="color: #666; font-size: 0.95rem;">Données de mesure pour l'évaluation du pilote scolaire 6 semaines</p>

      <!-- MÉTRIQUES CLÉS -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
        <div class="teacher-card">
          <div style="font-size: 2.5rem; font-weight: 700; color: var(--primaire);">${indicateurs.sessionsTotales}</div>
          <div style="font-size: 0.9rem; color: #666;">Sessions totales</div>
        </div>
        <div class="teacher-card">
          <div style="font-size: 2.5rem; font-weight: 700; color: var(--succes);">${indicateurs.tauxReussiteMoyen}%</div>
          <div style="font-size: 0.9rem; color: #666;">Taux réussite moyen</div>
        </div>
        <div class="teacher-card">
          <div style="font-size: 2.5rem; font-weight: 700; color: #2196F3;">${indicateurs.tentatativesTotales}</div>
          <div style="font-size: 0.9rem; color: #666;">Questions tentées</div>
        </div>
        <div class="teacher-card">
          <div style="font-size: 2.5rem; font-weight: 700; color: #FF9800;">${indicateurs.jaloinsAtteints}</div>
          <div style="font-size: 0.9rem; color: #666;">Jalons atteints</div>
        </div>
      </div>

      <!-- PROGRESSION PAR DOMAINE -->
      <div class="teacher-card" style="margin-bottom: 2rem;">
        <h3 style="margin-top: 0;">🧠 Progression par Domaine</h3>
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          ${Object.entries(progression).map(([domaine, stats]) => {
            const pct = stats.tauxReussite || 0;
            return `
              <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                  <strong>${domaine.charAt(0).toUpperCase() + domaine.slice(1)}</strong>
                  <span style="color: var(--succes); font-weight: 700;">${pct}%</span>
                </div>
                <div style="width: 100%; background: #f0f0f0; height: 12px; border-radius: 6px; overflow: hidden;">
                  <div style="background: var(--succes); width: ${pct}%; height: 100%;"></div>
                </div>
                <div style="font-size: 0.85rem; color: #666; margin-top: 0.3rem;">
                  ${stats.reussites}/${stats.tentatives} bonnes réponses
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- JEUX LES PLUS JOUÉS -->
      <div class="teacher-card" style="margin-bottom: 2rem;">
        <h3 style="margin-top: 0;">🎮 Jeux les Plus Joués</h3>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          ${indicateurs.jeuxLesPlusJoues.map((jeu, idx) => `
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #eee;">
              <span>${idx + 1}. ${jeu}</span>
              <span style="color: #666; font-size: 0.9rem;">Très joué</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- RECOMMANDATIONS -->
      <div class="teacher-card teacher-card--action" style="margin-bottom: 2rem;">
        <h3 style="margin-top: 0;">💡 Recommandations pour la Suite</h3>
        <ul style="margin: 0; padding-left: 1.5rem; color: #555;">
          <li style="margin-bottom: 0.5rem;">Taux réussite moyen: ${indicateurs.tauxReussiteMoyen}% — ${indicateurs.tauxReussiteMoyen >= 75 ? '✅ Excellent' : indicateurs.tauxReussiteMoyen >= 60 ? '⚠️ À améliorer' : '❌ Renforcer le contenu'}</li>
          <li style="margin-bottom: 0.5rem;">Sessions totales: ${indicateurs.sessionsTotales} — ${indicateurs.sessionsTotales >= 10 ? '✅ Données significatives' : '⏳ Continuer la collecte'}</li>
          <li style="margin-bottom: 0rem;">Questions tentées: ${indicateurs.tentatativesTotales} — Bonne variété de pratique</li>
        </ul>
      </div>

      <!-- BOUTONS ACTIONS -->
      <div style="display: flex; gap: 1rem; margin-bottom: 2rem;">
        <button id="btn-export-json" style="
          flex: 1;
          background: var(--primaire);
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 0.8rem;
          cursor: pointer;
          font-weight: 600;
          font-size: 1rem;
        ">📥 Télécharger Rapport JSON</button>
        <button id="btn-copy-csv" style="
          flex: 1;
          background: #4CAF50;
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 0.8rem;
          cursor: pointer;
          font-weight: 600;
          font-size: 1rem;
        ">📋 Copier Données CSV</button>
      </div>

      <!-- NOTES PÉDAGOGIQUES -->
      <div class="teacher-card" style="background: #F5F5F5; margin-bottom: 2rem;">
        <h4 style="margin-top: 0; color: var(--primaire);">📌 Notes pour l'Analyse</h4>
        <p style="margin: 0.5rem 0; font-size: 0.95rem;">
          <strong>Données collectées:</strong> Réponses correctes/incorrectes, temps de réponse, progression de difficulté, jalons pédagogiques.
        </p>
        <p style="margin: 0.5rem 0; font-size: 0.95rem;">
          <strong>Évaluation:</strong> Taux réussite par domaine mesure l'impact sur l'apprentissage. Jalons atteints = progression pédagogique.
        </p>
        <p style="margin: 0; font-size: 0.95rem;">
          <strong>Export:</strong> Formats JSON (analyse complète) et CSV (feuille calcul).
        </p>
      </div>

      <!-- FOOTER -->
      <div style="text-align: center; padding: 1rem; border-top: 1px solid #eee;">
        <button id="btn-retour-analytics" style="
          background: none;
          border: none;
          color: var(--primaire);
          text-decoration: underline;
          cursor: pointer;
          font-size: 1rem;
        ">← Retour au tableau de bord</button>
      </div>
    </div>
  `;

  el.innerHTML = html;
  el.hidden = false;

  document.getElementById("btn-export-json").addEventListener("click", () => {
    telechargerRapportPilote();
    alert("Rapport téléchargé! Utilisez-le pour analyser les résultats du pilote.");
  });

  document.getElementById("btn-copy-csv").addEventListener("click", () => {
    const data = exporterDonneesPilote();
    navigator.clipboard.writeText(data.formatCSV).then(() => {
      alert("Données CSV copiées! Collez-les dans Excel ou Google Sheets.");
    });
  });

  document.getElementById("btn-retour-analytics").addEventListener("click", () => {
    const ecrans = document.querySelectorAll(".ecran");
    ecrans.forEach(e => e.hidden = true);
    const menuHome = document.getElementById("ecran-menu-home");
    if (menuHome) menuHome.hidden = false;
  });
}
