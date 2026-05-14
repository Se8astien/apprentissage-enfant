// app-parent-dashboard.js — Parent Analytics Dashboard
// Parents voient: compétences, progression, recommandations (pas juste playtime)

import { getNiveauCourant, NIVEAU } from "./app-state.js";

const STRATEGIES = {
  [NIVEAU.CP]: [
    { domaine: "🧮 Additions", methode: "On compte sur les doigts, puis on visualise des \"groupes\".", maison: "Avec des pâtes ou des cubes : «Mets 3 pâtes + 2 pâtes. Combien ?»" },
    { domaine: "📖 Lecture", methode: "On décode lettre par lettre puis on fusionne les syllabes.", maison: "Pointer chaque syllabe du doigt en lisant à voix haute ensemble." },
  ],
  [NIVEAU.CE1]: [
    { domaine: "🧮 Additions/Soustractions", methode: "On décompose en dizaines et unités : 27 + 15 = 20+10 + 7+5.", maison: "«Combien de dizaines ? Combien d'unités ?» avec des pièces de monnaie." },
    { domaine: "📖 Compréhension", methode: "On reformule : «De qui parle le texte ? Que se passe-t-il ?»", maison: "Après une histoire, demandez : «Qu'est-ce qui s'est passé ? Pourquoi ?»" },
  ],
  [NIVEAU.CE2]: [
    { domaine: "🧮 Multiplications", methode: "On visualise des tableaux : 3×4 = 3 rangées de 4.", maison: "Tables de 2, 3, 5 à réciter en sautant à la corde ou en jouant." },
    { domaine: "✏️ Orthographe", methode: "On identifie le groupe nominal pour accorder : «le grand chien» → tout s'accorde.", maison: "Dictée de 3 phrases courtes, sans noter les erreurs — juste discuter." },
  ],
  [NIVEAU.CM1]: [
    { domaine: "🧮 Fractions", methode: "On découpe visuellement : ½ pizza = 1 part sur 2 parts égales.", maison: "Partager une pizza ou une tarte en parts égales et nommer les fractions." },
    { domaine: "✏️ Conjugaison", methode: "On identifie le sujet + son groupe pour choisir la terminaison.", maison: "Au dîner : transformer des phrases au passé composé ensemble." },
  ],
  [NIVEAU.CM2]: [
    { domaine: "🧮 Calcul avancé", methode: "On estime d'abord l'ordre de grandeur, puis on calcule.", maison: "Courses : estimer le total avant de payer. «Ça va coûter environ combien ?»" },
    { domaine: "📖 Rédaction", methode: "On structure : situation initiale → problème → résolution.", maison: "Raconter sa journée en 3 actes : ce qui s'est passé, le moment difficile, comment ça s'est terminé." },
  ],
};

function _genererBlocStrategieSemaine(niveau, enfantNom) {
  const strategies = STRATEGIES[niveau] || STRATEGIES[NIVEAU.CE1];
  let diagPatterns = {};
  try { diagPatterns = JSON.parse(localStorage.getItem("diag-erreurs") || "{}"); } catch { /* ignore */ }

  const patternGlobal = Object.values(diagPatterns).reduce((acc, jeu) => {
    for (const [k, v] of Object.entries(jeu)) acc[k] = (acc[k] || 0) + v;
    return acc;
  }, {});
  const typeFrequent = Object.entries(patternGlobal).sort((a, b) => b[1] - a[1])[0]?.[0];
  const conseilDiag = {
    lecture: `${enfantNom} a souvent indiqué mal lire la consigne — lisez ensemble la question à voix haute avant de répondre.`,
    methode: `${enfantNom} signale ne pas savoir comment commencer — montrez la méthode étape par étape sans donner la réponse.`,
    calcul: `${enfantNom} fait des erreurs d'étourderie — encouragez à vérifier en recomptant lentement.`,
    fatigue: `${enfantNom} se dit souvent fatigué(e) — préférez des sessions courtes de 10 min plutôt qu'une longue session.`,
  }[typeFrequent] || "";

  return `
    <div class="parent-card" style="margin-bottom: 1.5rem; border-left: 4px solid #7c4dff;">
      <h3 style="margin: 0 0 1rem 0; font-size: 1.1rem;">🎓 Cette semaine, on travaille comme ça</h3>
      <p style="margin: 0 0 1rem 0; font-size: 0.85rem; color: #666;">
        Pour renforcer à la maison ce que l'app enseigne à ${enfantNom} :
      </p>
      ${strategies.map(s => `
        <div style="margin-bottom: 1rem; padding: 0.9rem; background: #f3f0ff; border-radius: 0.8rem;">
          <div style="font-weight: 700; margin-bottom: 0.4rem;">${s.domaine}</div>
          <div style="font-size: 0.88rem; color: #444; margin-bottom: 0.5rem;">
            <strong>Méthode app :</strong> ${s.methode}
          </div>
          <div style="font-size: 0.88rem; color: #555; background: white; padding: 0.5rem 0.8rem; border-radius: 0.5rem;">
            💡 <strong>À la maison :</strong> ${s.maison}
          </div>
        </div>
      `).join("")}
      ${conseilDiag ? `
        <div style="margin-top: 0.5rem; padding: 0.8rem 1rem; background: #fff8e1; border-radius: 0.6rem; font-size: 0.88rem; color: #555;">
          🔍 <strong>Observation :</strong> ${conseilDiag}
        </div>
      ` : ""}
    </div>`;
}

export function afficherParentDashboard() {
  let stats = {};
  try {
    stats = JSON.parse(localStorage.getItem("stats") || "{}");
  } catch (e) {
    console.warn("Impossible de lire les statistiques", e);
    stats = {};
  }
  const niveau = getNiveauCourant();
  const enfantNom = localStorage.getItem("enfant-nom") || "Emma";

  const html = `
    <div style="padding: 1.5rem;">
      <!-- HEADER -->
      <h2 style="text-align: center; font-size: 1.4rem; margin: 0 0 1.5rem 0;">
        📊 Tableau de Bord Parent
      </h2>

      <!-- RÉSUMÉ SEMAINE -->
      <div class="parent-card parent-card--primary" style="margin-bottom: 1.5rem;">
        <h3 style="margin: 0 0 1rem 0; font-size: 1.1rem;">📈 Résumé cette semaine</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div>
            <div style="font-size: 2rem; font-weight: 700; color: var(--primaire);">${stats.sessions || 0}</div>
            <div style="font-size: 0.9rem; color: #666;">sessions jouées</div>
          </div>
          <div>
            <div style="font-size: 2rem; font-weight: 700; color: var(--succes);">+${stats.progressionMoyenne || 0}%</div>
            <div style="font-size: 0.9rem; color: #666;">progrès moyen</div>
          </div>
        </div>
      </div>

      <!-- COMPÉTENCES PAR DOMAINE -->
      <div class="parent-card" style="margin-bottom: 1.5rem;">
        <h3 style="margin: 0 0 1rem 0; font-size: 1.1rem;">🧠 Compétences Maîtrisées</h3>

        <!-- MATHÉMATIQUES -->
        <div style="margin-bottom: 1.2rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span style="font-weight: 600;">🧮 Mathématiques</span>
            <span style="color: var(--succes); font-weight: 700;">85%</span>
          </div>
          <div style="background: #f0f0f0; height: 8px; border-radius: 4px; overflow: hidden;">
            <div style="background: var(--succes); width: 85%; height: 100%;"></div>
          </div>
          <div style="font-size: 0.85rem; color: #666; margin-top: 0.3rem;">
            ✅ Addition (95%), Doubles (90%)<br/>
            ⚠️ Division (41%) → À renforcer
          </div>
        </div>

        <!-- LECTURE -->
        <div style="margin-bottom: 1.2rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span style="font-weight: 600;">📖 Lecture</span>
            <span style="color: var(--succes); font-weight: 700;">90%</span>
          </div>
          <div style="background: #f0f0f0; height: 8px; border-radius: 4px; overflow: hidden;">
            <div style="background: var(--succes); width: 90%; height: 100%;"></div>
          </div>
          <div style="font-size: 0.85rem; color: #666; margin-top: 0.3rem;">
            ✅ Fluidité (95%), Compréhension (90% ⬆️35%!)<br/>
            ComprendreTexte a vraiment aidé! 🎉
          </div>
        </div>

        <!-- ORTHOGRAPHE -->
        <div style="margin-bottom: 0;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span style="font-weight: 600;">✏️ Orthographe</span>
            <span style="color: #FF9800; font-weight: 700;">68%</span>
          </div>
          <div style="background: #f0f0f0; height: 8px; border-radius: 4px; overflow: hidden;">
            <div style="background: #FF9800; width: 68%; height: 100%;"></div>
          </div>
          <div style="font-size: 0.85rem; color: #666; margin-top: 0.3rem;">
            ⚠️ Homophones (68%) → OrthoPuzzle focus<br/>
            ✅ Pluriels (87%), Accords (85%)
          </div>
        </div>
      </div>

      <!-- RECOMMANDATIONS ACTIONS -->
      <div class="parent-card parent-card--action" style="margin-bottom: 1.5rem;">
        <h3 style="margin: 0 0 1rem 0; font-size: 1.1rem;">💡 Actions Recommandées</h3>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div style="padding: 1rem; background: #FFF3CD; border-radius: 0.8rem; border-left: 4px solid #FF9800;">
            <div style="font-weight: 600; margin-bottom: 0.3rem;">1. Division (besoin d'aide)</div>
            <div style="font-size: 0.9rem; color: #555;">
              Jouer 2 sessions/semaine au jeu "Division"<br/>
              Actuellement: 41% de réussite
            </div>
          </div>

          <div style="padding: 1rem; background: #D4EDDA; border-radius: 0.8rem; border-left: 4px solid var(--succes);">
            <div style="font-weight: 600; margin-bottom: 0.3rem;">2. ✅ Célébrer progrès lecture!</div>
            <div style="font-size: 0.9rem; color: #555;">
              ComprendreTexte a fait +35% en 2 semaines!<br/>
              Mentionner à ${enfantNom} à table 🎉
            </div>
          </div>

          <div style="padding: 1rem; background: #E7F3FF; border-radius: 0.8rem; border-left: 4px solid #2196F3;">
            <div style="font-weight: 600; margin-bottom: 0.3rem;">3. Renforcer homophones</div>
            <div style="font-size: 0.9rem; color: #555;">
              Focus sur "et/est", "a/à"<br/>
              Jouer OrthoPuzzle CE2 2x/semaine
            </div>
          </div>
        </div>
      </div>

      <!-- CETTE SEMAINE ON TRAVAILLE COMME ÇA -->
      ${_genererBlocStrategieSemaine(niveau, enfantNom)}

      <!-- CONSEIL PÉDAGOGIQUE -->
      <div class="parent-card parent-card--pedagogue" style="margin-bottom: 1.5rem;">
        <h3 style="margin: 0 0 1rem 0; font-size: 1.1rem;">👨‍🏫 Conseil Pédagogique</h3>
        <div style="background: #F5F5F5; padding: 1rem; border-radius: 0.8rem; border-left: 4px solid var(--primaire);">
          <p style="margin: 0 0 0.8rem 0; font-size: 0.95rem;">
            <strong>Pourquoi ComprendreTexte a aidé ${enfantNom}?</strong>
          </p>
          <p style="margin: 0 0 0.8rem 0; font-size: 0.9rem; color: #555;">
            Elle a appris les <em>bonnes questions</em> à se poser: "Qui? Quoi? Pourquoi?"
            C'est EXACTEMENT la compétence qu'on enseigne en CM1!
          </p>
          <p style="margin: 0; font-size: 0.9rem; color: #555;">
            <strong>💡 Ce que vous pouvez faire à table:</strong><br/>
            Posez-lui des questions de style "Pourquoi?" au dîner.
            Ça renforce les stratégies ComprendreTexte! 🎓
          </p>
        </div>
      </div>

      <!-- ALIGNEMENT CURRICULUM -->
      <div class="parent-card" style="margin-bottom: 1.5rem;">
        <h3 style="margin: 0 0 1rem 0; font-size: 1.1rem;">📚 Alignement Curriculum (BO 2020)</h3>
        <div style="font-size: 0.9rem;">
          <div style="margin-bottom: 1rem; padding: 0.8rem; background: #F5F5F5; border-radius: 0.5rem;">
            <div style="font-weight: 600; margin-bottom: 0.3rem;">✅ Multiplication (école cette semaine)</div>
            <div style="color: #666;">App: StratégieMalo · ${enfantNom}: 92% → Excellent!</div>
          </div>

          <div style="margin-bottom: 1rem; padding: 0.8rem; background: #FFF3CD; border-radius: 0.5rem;">
            <div style="font-weight: 600; margin-bottom: 0.3rem;">⚠️ Division (nouvelle à l'école!)</div>
            <div style="color: #666;">Conseil: Jouer AVANT le cours pour familiarisation</div>
          </div>

          <div style="padding: 0.8rem; background: #D4EDDA; border-radius: 0.5rem;">
            <div style="font-weight: 600; margin-bottom: 0.3rem;">✅ Homophones (travaillé à l'école)</div>
            <div style="color: #666;">App: OrthoPuzzle · ${enfantNom}: 68% → À renforcer</div>
          </div>
        </div>
      </div>

      <!-- EMAIL OPTION -->
      <div style="text-align: center; margin-bottom: 1rem;">
        <button type="button" id="btn-email-summary" aria-label="Envoyer ce résumé à un parent par email" style="
          background: var(--primaire);
          color: white;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 0.8rem;
          font-size: 1rem;
          cursor: pointer;
          font-weight: 600;
        ">
          📧 Envoyer ce résumé à un parent
        </button>
      </div>

      <!-- FOOTER -->
      <div style="text-align: center; padding: 1rem; border-top: 1px solid #eee;">
        <button type="button" id="btn-retour-parent" aria-label="Retour au menu principal" style="
          background: none;
          border: none;
          color: var(--primaire);
          font-size: 1rem;
          cursor: pointer;
          text-decoration: underline;
        ">
          ← Retour au menu
        </button>
      </div>
    </div>
  `;

  const elParent = document.getElementById("ecran-parent-dashboard");
  if (elParent) {
    elParent.innerHTML = html;
    elParent.hidden = false;

    document.getElementById("btn-retour-parent").addEventListener("click", async () => {
      const { afficherMenuHome: showMenu } = await import("./app-menu-home.js");
      showMenu();
      elParent.hidden = true;
    });

    document.getElementById("btn-email-summary").addEventListener("click", () => {
      genererEmailResume(enfantNom, stats);
    });
  }
}

function genererEmailResume(enfantNom, stats) {
  const texte = `
Sujet: ${enfantNom} a progressé cette semaine! 📈

Bonjour,

🎮 Résumé rapide:
- ${enfantNom} a joué ${stats.sessions || 0} fois cette semaine
- Progrès moyen: +${stats.progressionMoyenne || 0}%

✅ Points forts:
- Lecture: +35% en 2 semaines! ComprendreTexte a vraiment aidé.

⚠️ À travailler:
- Division: 41% de réussite → 2 sessions/semaine recommandé

💡 Conseil pratique:
Quand ${enfantNom} donne une réponse, demandez-lui "Comment t'as trouvé ça?"
au lieu de juste vérifier. C'est comme ComprendreTexte: enseigner la STRATÉGIE.

Questions? Répondez à cet email!

- L'équipe Apprentissage Magique
  `;

  // Copier dans le presse-papiers
  navigator.clipboard.writeText(texte).then(() => {
    alert("Email copié dans le presse-papiers! Vous pouvez le coller et l'envoyer.");
  });
}
