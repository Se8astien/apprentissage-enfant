// app-social-badges.js — Social badges system with sharing & cosmetics
// #17 Badges Sociaux

const BADGES_SOCIAUX = {
  "premiers-pas": {
    id: "premiers-pas",
    titre: "Premiers pas",
    emoji: "👶",
    description: "Fais ta première réponse correcte",
    categorie: "progression",
    condition: (stats) => stats.partiesTotal >= 1,
  },
  "combo-3": {
    id: "combo-3",
    titre: "En route!",
    emoji: "🚀",
    description: "Fais 3 bonnes réponses d'affilée",
    categorie: "combo",
    condition: (stats) => stats.meilleurCombo >= 3,
  },
  "combo-5": {
    id: "combo-5",
    titre: "Combo 5!",
    emoji: "🔥",
    description: "Fais 5 bonnes réponses d'affilée",
    categorie: "combo",
    condition: (stats) => stats.meilleurCombo >= 5,
  },
  "combo-10": {
    id: "combo-10",
    titre: "Combo 10!!",
    emoji: "⚡",
    description: "Fais 10 bonnes réponses d'affilée",
    categorie: "combo",
    condition: (stats) => stats.meilleurCombo >= 10,
  },
  "questions-50": {
    id: "questions-50",
    titre: "50 Questions",
    emoji: "📚",
    description: "Réponds à 50 questions",
    categorie: "volume",
    condition: (stats) => stats.partiesTotal >= 50,
  },
  "questions-100": {
    id: "questions-100",
    titre: "Cent Questions!",
    emoji: "📖",
    description: "Réponds à 100 questions",
    categorie: "volume",
    condition: (stats) => stats.partiesTotal >= 100,
  },
  "expert-addition": {
    id: "expert-addition",
    titre: "Expert Addition",
    emoji: "➕",
    description: "Maîtrise l'addition (85%+ au moins 20 questions)",
    categorie: "domaine",
    condition: (stats) => {
      const addStats = stats.parDomaine?.addition;
      return addStats && addStats.questions >= 20 && addStats.tauxReussite >= 85;
    },
  },
  "expert-soustraction": {
    id: "expert-soustraction",
    titre: "Expert Soustraction",
    emoji: "➖",
    description: "Maîtrise la soustraction (85%+ au moins 20 questions)",
    categorie: "domaine",
    condition: (stats) => {
      const subStats = stats.parDomaine?.soustraction;
      return subStats && subStats.questions >= 20 && subStats.tauxReussite >= 85;
    },
  },
  "jour-1": {
    id: "jour-1",
    titre: "Premier jour",
    emoji: "🌅",
    description: "Joue pendant 1 jour",
    categorie: "streaks",
    condition: (stats) => stats.joursConsecutifs >= 1,
  },
  "jour-7": {
    id: "jour-7",
    titre: "Une semaine!",
    emoji: "📅",
    description: "Joue pendant 7 jours consécutifs",
    categorie: "streaks",
    condition: (stats) => stats.joursConsecutifs >= 7,
  },
  "jour-30": {
    id: "jour-30",
    titre: "Un mois!",
    emoji: "🎖️",
    description: "Joue pendant 30 jours consécutifs",
    categorie: "streaks",
    condition: (stats) => stats.joursConsecutifs >= 30,
  },
};

const COSMETICS_PAR_BADGE = {
  "combo-10": {
    type: "chapeau",
    nom: "Chapeau de Champion",
    asset: "hat-champion",
  },
  "questions-100": {
    type: "lunettes",
    nom: "Lunettes du Savant",
    asset: "glasses-scholar",
  },
  "jour-30": {
    type: "cape",
    nom: "Cape de Légende",
    asset: "cape-legend",
  },
};

export function evaluerBadges(stats) {
  const deverrouilles = [];

  for (const [id, badge] of Object.entries(BADGES_SOCIAUX)) {
    if (badge.condition(stats)) {
      deverrouilles.push(id);
    }
  }

  return deverrouilles;
}

export function obtenirBadgesActuels() {
  try {
    return JSON.parse(localStorage.getItem("apprentissage-badges-sociaux") || "[]");
  } catch (e) {
    return [];
  }
}

export function debloqueBadge(badgeId) {
  if (!BADGES_SOCIAUX[badgeId]) return false;

  const badges = obtenirBadgesActuels();
  if (badges.some((b) => b.id === badgeId)) {
    return false; // Déjà déverrouillé
  }

  badges.push({
    id: badgeId,
    titre: BADGES_SOCIAUX[badgeId].titre,
    emoji: BADGES_SOCIAUX[badgeId].emoji,
    unlockedAt: Date.now(),
  });

  localStorage.setItem("apprentissage-badges-sociaux", JSON.stringify(badges));

  // Vérifier si le badge déverrouille un cosmetic
  if (COSMETICS_PAR_BADGE[badgeId]) {
    debloqueCosmeticDepuisBadge(badgeId);
  }

  return true;
}

export function debloqueCosmeticDepuisBadge(badgeId) {
  const cosmetic = COSMETICS_PAR_BADGE[badgeId];
  if (!cosmetic) return;

  const cosmetics = JSON.parse(localStorage.getItem("apprentissage-cosmetics-badges") || "{}");

  if (!cosmetics[badgeId]) {
    cosmetics[badgeId] = {
      nom: cosmetic.nom,
      type: cosmetic.type,
      asset: cosmetic.asset,
      accessible: true,
      unlockedAt: Date.now(),
    };
    localStorage.setItem("apprentissage-cosmetics-badges", JSON.stringify(cosmetics));
  }
}

export function afficherGalerieBadges() {
  const badges = obtenirBadgesActuels();
  const debloquees = new Set(badges.map((b) => b.id));

  const categories = {};
  for (const [id, badge] of Object.entries(BADGES_SOCIAUX)) {
    if (!categories[badge.categorie]) {
      categories[badge.categorie] = [];
    }
    categories[badge.categorie].push({ ...badge, debloquee: debloquees.has(id) });
  }

  const labelsCateg = {
    progression: "Progression",
    combo: "Combos",
    volume: "Volume",
    domaine: "Domaines",
    streaks: "Streaks",
  };

  return `
    <div style="padding: 2rem; background: white; border-radius: 1rem;">
      <h2 style="margin: 0 0 1.5rem; font-size: 1.5rem;">🏅 Galerie de badges</h2>

      <p style="margin: 0 0 1rem; color: #666; font-size: 0.9rem;">
        Tu as débloqué ${debloquees.size} badge(s) sur ${Object.keys(BADGES_SOCIAUX).length}
      </p>

      <div style="margin-bottom: 2rem;">
        <div style="background: #f0f8ff; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
          <p style="margin: 0; font-weight: 700; font-size: 1rem;">
            ${debloquees.size === Object.keys(BADGES_SOCIAUX).length
              ? "🌟 Tu as tous les badges!"
              : `${Object.keys(BADGES_SOCIAUX).length - debloquees.size} badge(s) à découvrir`}
          </p>
        </div>
      </div>

      ${Object.entries(categories)
        .map(
          ([categ, badges]) => `
        <div style="margin-bottom: 2rem;">
          <h3 style="margin: 0 0 1rem; font-size: 1.1rem; color: #667eea;">${labelsCateg[categ]}</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 1rem;">
            ${badges
              .map((badge) => {
                const style = badge.debloquee
                  ? "opacity: 1; transform: scale(1);"
                  : "opacity: 0.5; transform: scale(0.95);";
                return `
                  <div
                    style="
                      text-align: center;
                      padding: 1rem;
                      background: ${badge.debloquee ? "#f0fff5" : "#f5f5f5"};
                      border-radius: 0.5rem;
                      border: 2px solid ${badge.debloquee ? "#4caf50" : "#ddd"};
                      ${style}
                    "
                    title="${badge.description}"
                  >
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">${badge.emoji}</div>
                    <p style="margin: 0; font-size: 0.75rem; font-weight: 700; color: #333;">
                      ${badge.titre}
                    </p>
                    ${badge.debloquee ? '<p style="margin: 0.3rem 0 0; font-size: 0.65rem; color: #4caf50;">✓</p>' : ""}
                  </div>
                `;
              })
              .join("")}
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

export function creerProfilSocial(nomEnfant) {
  const badges = obtenirBadgesActuels();
  const profil = {
    enfantNom: nomEnfant,
    badgesDebloquees: badges,
    dateCreation: Date.now(),
    codePartage: genererCodePartage(nomEnfant, badges),
  };

  localStorage.setItem("apprentissage-profil-social", JSON.stringify(profil));
  return profil;
}

export function genererCodePartage(nomEnfant, badges) {
  const data = {
    enfant: nomEnfant,
    badges: badges.map((b) => b.id),
    date: new Date().toISOString(),
  };

  const encoded = btoa(JSON.stringify(data));
  return encoded.substring(0, 12).toUpperCase();
}

export function afficherProfilSocial() {
  try {
    const profil = JSON.parse(localStorage.getItem("apprentissage-profil-social") || "null");
    if (!profil) return afficherProfilVide();

    return `
      <div style="padding: 2rem; background: white; border-radius: 1rem; max-width: 500px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 2rem;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">🦊</div>
          <h2 style="margin: 0 0 0.5rem; font-size: 1.5rem;">${profil.enfantNom}</h2>
          <p style="margin: 0; color: #666; font-size: 0.9rem;">
            ${profil.badgesDebloquees.length} badge(s) déverrouillé(s)
          </p>
        </div>

        <div style="background: #f0f8ff; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem; text-align: center;">
          <p style="margin: 0 0 0.5rem; font-size: 0.85rem; color: #666;">Code de partage:</p>
          <p style="margin: 0; font-size: 1.3rem; font-weight: 700; font-family: monospace;">
            ${profil.codePartage}
          </p>
          <p style="margin: 0.5rem 0 0; font-size: 0.75rem; color: #666;">
            Partage ce code avec tes amis!
          </p>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <p style="margin: 0 0 0.5rem; font-weight: 700; font-size: 0.9rem;">Tes badges:</p>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
            ${profil.badgesDebloquees
              .map((badge) => `<span style="font-size: 1.5rem;" title="${badge.titre}">${badge.emoji}</span>`)
              .join("")}
          </div>
        </div>

        <button
          id="btn-voir-galerie"
          style="
            width: 100%;
            padding: 0.8rem;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 0.5rem;
            font-weight: 700;
            cursor: pointer;
          "
        >
          📚 Voir galerie complète
        </button>
      </div>
    `;
  } catch (e) {
    return afficherProfilVide();
  }
}

function afficherProfilVide() {
  return `
    <div style="padding: 2rem; text-align: center; background: #f9f9f9; border-radius: 1rem;">
      <p style="margin: 0; color: #999; font-size: 1rem;">
        Joue et déverrouille tes premiers badges! 🎮
      </p>
    </div>
  `;
}

export function obtenirStatsCosmetiques() {
  try {
    return JSON.parse(localStorage.getItem("apprentissage-cosmetics-badges") || "{}");
  } catch (e) {
    return {};
  }
}

export function mettreAJourProgressionBadge(badgeId, current, target) {
  const progress = JSON.parse(localStorage.getItem("apprentissage-badges-progress") || "{}");

  if (!progress[badgeId]) {
    progress[badgeId] = { current: 0, target };
  }

  progress[badgeId].current = Math.min(current, target);

  localStorage.setItem("apprentissage-badges-progress", JSON.stringify(progress));

  if (progress[badgeId].current >= target) {
    return debloqueBadge(badgeId);
  }

  return false;
}

export function obtenirProgressionBadge(badgeId) {
  const progress = JSON.parse(localStorage.getItem("apprentissage-badges-progress") || "{}");
  return progress[badgeId] || null;
}
