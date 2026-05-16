// app-skill-trees.js — Skill tree progression system with visual unlocking
// #21 Arbres de compétences

const ARBRES_COMPETENCES = {
  addition: {
    nom: "Addition",
    emoji: "➕",
    niveaux: [
      { id: "add-1", nom: "Bases", req: 0, difficulty: 0 },
      { id: "add-2", nom: "Sans retenue", req: 15, difficulty: 1 },
      { id: "add-3", nom: "Avec retenue", req: 30, difficulty: 2 },
      { id: "add-4", nom: "Nombre décimaux", req: 50, difficulty: 3 },
    ],
  },
  soustraction: {
    nom: "Soustraction",
    emoji: "➖",
    niveaux: [
      { id: "sub-1", nom: "Bases", req: 0, difficulty: 0 },
      { id: "sub-2", nom: "Sans emprunt", req: 15, difficulty: 1 },
      { id: "sub-3", nom: "Avec emprunt", req: 30, difficulty: 2 },
      { id: "sub-4", nom: "Nombre décimaux", req: 50, difficulty: 3 },
    ],
  },
  multiplication: {
    nom: "Multiplication",
    emoji: "✖️",
    niveaux: [
      { id: "mul-1", nom: "Tables simples", req: 0, difficulty: 0 },
      { id: "mul-2", nom: "Tables complètes", req: 20, difficulty: 1 },
      { id: "mul-3", nom: "Nombre à 2 chiffres", req: 40, difficulty: 2 },
      { id: "mul-4", nom: "Nombre à 3 chiffres", req: 60, difficulty: 3 },
    ],
  },
  division: {
    nom: "Division",
    emoji: "÷",
    niveaux: [
      { id: "div-1", nom: "Bases", req: 0, difficulty: 0 },
      { id: "div-2", nom: "Division simple", req: 25, difficulty: 1 },
      { id: "div-3", nom: "Avec reste", req: 45, difficulty: 2 },
      { id: "div-4", nom: "Nombre décimaux", req: 60, difficulty: 3 },
    ],
  },
  lecture: {
    nom: "Lecture",
    emoji: "📖",
    niveaux: [
      { id: "lec-1", nom: "Mots simples", req: 0, difficulty: 0 },
      { id: "lec-2", nom: "Phrases courtes", req: 15, difficulty: 1 },
      { id: "lec-3", nom: "Petits textes", req: 35, difficulty: 2 },
      { id: "lec-4", nom: "Compréhension", req: 50, difficulty: 3 },
    ],
  },
};

export function initialiserArbresCompetences() {
  const existing = localStorage.getItem("apprentissage-skill-tree");
  if (existing) return JSON.parse(existing);

  const tree = {
    domaines: {},
    miseAJour: Date.now(),
  };

  for (const [key, domain] of Object.entries(ARBRES_COMPETENCES)) {
    tree.domaines[key] = {
      nom: domain.nom,
      emoji: domain.emoji,
      niveaux: domain.niveaux.map((niveau, idx) => ({
        ...niveau,
        unlocked: idx === 0, // Seul le premier est déverrouillé au départ
      })),
    };
  }

  localStorage.setItem("apprentissage-skill-tree", JSON.stringify(tree));
  return tree;
}

export function obtenirArbresCompetences() {
  try {
    let tree = JSON.parse(localStorage.getItem("apprentissage-skill-tree") || "null");
    if (!tree) {
      tree = initialiserArbresCompetences();
    }
    return tree;
  } catch (e) {
    return initialiserArbresCompetences();
  }
}

export function mettreAJourMaitriseDomaine(domaine, questions, correctes) {
  const mastery = JSON.parse(localStorage.getItem("apprentissage-mastery-levels") || "{}");

  const percent = questions > 0 ? Math.round((correctes / questions) * 100) : 0;

  mastery[domaine] = {
    questions,
    correctes,
    pourcentage: percent,
    miseAJour: Date.now(),
  };

  localStorage.setItem("apprentissage-mastery-levels", JSON.stringify(mastery));

  // Vérifier si on déverrouille le prochain niveau
  verifierDebloquageNiveaux(domaine, questions);

  return mastery[domaine];
}

export function verifierDebloquageNiveaux(domaine, questionsTotal) {
  const tree = obtenirArbresCompetences();
  const domain = tree.domaines[domaine];

  if (!domain) return;

  for (let i = 0; i < domain.niveaux.length; i++) {
    const niveau = domain.niveaux[i];
    if (!niveau.unlocked && questionsTotal >= niveau.req) {
      niveau.unlocked = true;

      localStorage.setItem("apprentissage-skill-tree", JSON.stringify(tree));

      // Enregistrer le déblocage
      const unlocked = JSON.parse(localStorage.getItem("apprentissage-skills-unlocked") || "[]");
      unlocked.push({
        skillId: niveau.id,
        domaine,
        unlockedAt: Date.now(),
      });
      localStorage.setItem("apprentissage-skills-unlocked", JSON.stringify(unlocked));
    }
  }
}

export function obtenirMaitrise(domaine) {
  try {
    const mastery = JSON.parse(localStorage.getItem("apprentissage-mastery-levels") || "{}");
    return mastery[domaine] || null;
  } catch (e) {
    return null;
  }
}

export function afficherAbreCompetence(domaine) {
  const tree = obtenirArbresCompetences();
  const domain = tree.domaines[domaine];
  const mastery = obtenirMaitrise(domaine);

  if (!domain) return "";

  const masteryCourant = mastery ? mastery.pourcentage : 0;

  return `
    <div style="
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 1.5rem;
      border-radius: 0.75rem;
      margin-bottom: 1.5rem;
    ">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h3 style="margin: 0; font-size: 1.1rem;">
          ${domain.emoji} ${domain.nom}
        </h3>
        <span style="
          background: ${masteryCourant >= 80 ? "#4caf50" : masteryCourant >= 60 ? "#ff9800" : "#f44336"};
          color: white;
          padding: 0.3rem 0.8rem;
          border-radius: 1rem;
          font-size: 0.85rem;
          font-weight: 700;
        ">
          ${masteryCourant}%
        </span>
      </div>

      <div style="margin-bottom: 1rem;">
        ${domain.niveaux
          .map((niveau, idx) => {
            const estDebloque = niveau.unlocked;
            const estSuivant = idx > 0 && domain.niveaux[idx - 1].unlocked && !estDebloque;

            return `
              <div style="
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem;
                margin-bottom: 0.5rem;
                background: ${estDebloque ? "#ffffff" : "#f5f5f5"};
                border-radius: 0.5rem;
                border-left: 3px solid ${estDebloque ? "#667eea" : "#ddd"};
              ">
                <span style="font-size: 1.5rem;">
                  ${estDebloque ? "🔓" : estSuivant ? "🔒" : "⭕"}
                </span>
                <div style="flex: 1;">
                  <p style="margin: 0; font-weight: 700; font-size: 0.95rem;">
                    ${niveau.nom}
                  </p>
                  <p style="margin: 0.2rem 0 0; font-size: 0.8rem; color: #666;">
                    ${estSuivant ? `À débloquer: ${niveau.req} questions` : `Requis: ${niveau.req}`}
                  </p>
                </div>
                ${estSuivant ? `<span style="font-size: 0.85rem; color: #666;">+${niveau.req - (mastery?.questions || 0)} q</span>` : ""}
              </div>
            `;
          })
          .join("")}
      </div>

      <div style="background: rgba(0,0,0,0.05); height: 8px; border-radius: 4px; overflow: hidden;">
        <div style="
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          height: 100%;
          width: ${masteryCourant}%;
          border-radius: 4px;
          transition: width 0.3s ease;
        "></div>
      </div>
    </div>
  `;
}

export function afficherForetCompetences() {
  const tree = obtenirArbresCompetences();
  const mastery = JSON.parse(localStorage.getItem("apprentissage-mastery-levels") || "{}");

  // Calculer l'ordre: plus bas = priorité
  const domainOrder = Object.entries(mastery)
    .sort(([_, a], [__, b]) => (a.pourcentage || 0) - (b.pourcentage || 0));

  const weakDomain = domainOrder[0]?.[0];

  return `
    <div style="padding: 2rem; background: white; border-radius: 1rem;">
      <h2 style="margin: 0 0 1rem; font-size: 1.5rem;">🌳 Ton arbre de compétences</h2>

      ${
        weakDomain && mastery[weakDomain]?.pourcentage < 70
          ? `
        <div style="
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1.5rem;
        ">
          <p style="margin: 0; font-weight: 700; font-size: 0.9rem;">💡 Conseil du jour</p>
          <p style="margin: 0.5rem 0 0; font-size: 0.85rem; color: #666;">
            Tu peux améliorer tes compétences en ${ARBRES_COMPETENCES[weakDomain]?.nom || weakDomain}. Travaille y!
          </p>
        </div>
      `
          : ""
      }

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
        ${Object.entries(tree.domaines)
          .map(([key, domain]) => afficherAbreCompetence(key))
          .join("")}
      </div>
    </div>
  `;
}

export function obtenirRecommandation() {
  const mastery = JSON.parse(localStorage.getItem("apprentissage-mastery-levels") || "{}");

  let focusSkill = null;
  let reason = null;
  let minPercent = 100;

  for (const [domaine, stats] of Object.entries(mastery)) {
    if ((stats.pourcentage || 0) < minPercent) {
      minPercent = stats.pourcentage || 0;
      focusSkill = domaine;
      reason = minPercent < 60 ? "low_mastery" : "improvement_possible";
    }
  }

  if (!focusSkill) {
    const firstDomain = Object.keys(ARBRES_COMPETENCES)[0];
    focusSkill = firstDomain;
    reason = "start_journey";
  }

  const recommendation = {
    focus_skill: focusSkill,
    reason,
    suggested_at: Date.now(),
  };

  localStorage.setItem("apprentissage-skill-recommendation", JSON.stringify(recommendation));
  return recommendation;
}

export function obtenirDerniereRecommandation() {
  try {
    return JSON.parse(localStorage.getItem("apprentissage-skill-recommendation") || "null") ||
      obtenirRecommandation();
  } catch (e) {
    return obtenirRecommandation();
  }
}

export function afficherProgressionSkills(domaine) {
  const mastery = obtenirMaitrise(domaine);
  if (!mastery) return "";

  const percent = mastery.pourcentage || 0;
  const status = percent >= 85 ? "Maîtrisé ✅" : percent >= 70 ? "En bonne voie" : percent >= 50 ? "À progresser" : "Débuts";

  return `
    <div style="
      padding: 1rem;
      background: #f0f8ff;
      border-radius: 0.5rem;
      border-left: 4px solid #667eea;
    ">
      <p style="margin: 0 0 0.5rem; font-weight: 700; font-size: 0.9rem;">
        ${status} — ${percent}%
      </p>
      <p style="margin: 0; font-size: 0.85rem; color: #666;">
        ${mastery.correctes}/${mastery.questions} questions réussies
      </p>
    </div>
  `;
}
