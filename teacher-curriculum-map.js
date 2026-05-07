// teacher-curriculum-map.js — BO 2020 curriculum objectives mapped to games
// Teachers track which games address which learning objectives

const BO2020_OBJECTIFS = {
  cp: {
    mathematiques: [
      { id: 'math-cp-1', titre: 'Compter jusqu\'à 10', jeux: ['compte', 'addition'] },
      { id: 'math-cp-2', titre: 'Reconnaître des formes', jeux: ['formes', 'couleurs'] },
      { id: 'math-cp-3', titre: 'Lire l\'heure (demie/quarts)', jeux: ['heure'] },
    ],
    langage: [
      { id: 'lang-cp-1', titre: 'Reconnaître lettres et sons', jeux: ['alphabet', 'sons'] },
      { id: 'lang-cp-2', titre: 'Lire des mots simples', jeux: ['lecture', 'lecturePhrase'] },
      { id: 'lang-cp-3', titre: 'Écrire sans erreur les lettres', jeux: ['orthographe'] },
    ],
  },
  ce1: {
    mathematiques: [
      { id: 'math-ce1-1', titre: 'Additionner et soustraire < 20', jeux: ['addition', 'soustraction'] },
      { id: 'math-ce1-2', titre: 'Compter par 2, 5, 10', jeux: ['compte', 'multiplication'] },
      { id: 'math-ce1-3', titre: 'Mesurer longueurs/masses', jeux: ['durees', 'mesures'] },
    ],
    langage: [
      { id: 'lang-ce1-1', titre: 'Lire fluidement (décoding automatique)', jeux: ['lecture', 'lectureExpress'] },
      { id: 'lang-ce1-2', titre: 'Orthographe phonétique et approchée', jeux: ['orthopuzzle'] },
      { id: 'lang-ce1-3', titre: 'Utiliser ponctuation simple', jeux: ['ponctuationPuzzle'] },
    ],
  },
  ce2: {
    mathematiques: [
      { id: 'math-ce2-1', titre: 'Maîtriser la multiplication < 100', jeux: ['multiplication', 'strategieMalo'] },
      { id: 'math-ce2-2', titre: 'Poser opérations en colonne', jeux: ['addition', 'soustraction', 'multiplication'] },
      { id: 'math-ce2-3', titre: 'Mesurer temps, longueur, masse', jeux: ['heure', 'calendrier', 'durees'] },
    ],
    langage: [
      { id: 'lang-ce2-1', titre: 'Compréhension texte court', jeux: ['comprendreTexte', 'lectureExpress'] },
      { id: 'lang-ce2-2', titre: 'Orthographe d\'usage', jeux: ['orthopuzzle', 'homophones'] },
      { id: 'lang-ce2-3', titre: 'Conjugaison présent, passé composé', jeux: ['conjugaison'] },
    ],
  },
  cm1: {
    mathematiques: [
      { id: 'math-cm1-1', titre: 'Fractions simples (1/2, 1/4, 1/3)', jeux: ['fractions'] },
      { id: 'math-cm1-2', titre: 'Division euclidienne', jeux: ['division', 'strategieMalo'] },
      { id: 'math-cm1-3', titre: 'Lire/construire graphiques', jeux: ['graphiques'] },
    ],
    langage: [
      { id: 'lang-cm1-1', titre: 'Compréhension texte moyen', jeux: ['comprendreTexte', 'lectureExpress'] },
      { id: 'lang-cm1-2', titre: 'Analyse grammaticale simples', jeux: ['grammaire', 'conjugaison'] },
      { id: 'lang-cm1-3', titre: 'Homophones de/dés, a/à, et/est', jeux: ['homophones', 'orthopuzzle'] },
    ],
  },
  cm2: {
    mathematiques: [
      { id: 'math-cm2-1', titre: 'Fractions et décimaux', jeux: ['fractions', 'division'] },
      { id: 'math-cm2-2', titre: 'Proportionnalité', jeux: ['proportions', 'strategieMalo'] },
      { id: 'math-cm2-3', titre: 'Périmètre, aire, volume', jeux: ['perimetre', 'aire', 'volume'] },
    ],
    langage: [
      { id: 'lang-cm2-1', titre: 'Compréhension texte complexe', jeux: ['comprendreTexte', 'vocabReseaux'] },
      { id: 'lang-cm2-2', titre: 'Conjugaison avancée', jeux: ['conjugaison', 'atelierAccords'] },
      { id: 'lang-cm2-3', titre: 'Vocabulaire et expressions', jeux: ['vocabReseaux', 'amisDesmots'] },
    ],
  },
};

export function obtenirObjectifParNiveau(niveau) {
  return BO2020_OBJECTIFS[niveau] || {};
}

export function obtenirObjectifParId(niveau, domaine, objectifId) {
  const objectifs = BO2020_OBJECTIFS[niveau]?.[domaine] || [];
  return objectifs.find(o => o.id === objectifId);
}

export function mapperJeuObjectifs(jeuId) {
  const mappages = [];

  Object.entries(BO2020_OBJECTIFS).forEach(([niveau, domaines]) => {
    Object.entries(domaines).forEach(([domaine, objectifs]) => {
      objectifs.forEach(obj => {
        if (obj.jeux.includes(jeuId)) {
          mappages.push({ niveau, domaine, objectif: obj });
        }
      });
    });
  });

  return mappages;
}

export function obtenirJeuxParObjectif(niveau, domaine, objectifId) {
  const objectif = obtenirObjectifParId(niveau, domaine, objectifId);
  return objectif ? objectif.jeux : [];
}

export function calculerCouvertureCurriculum(classeNiveau, sessionsData) {
  const objectifsCibles = BO2020_OBJECTIFS[classeNiveau] || {};
  const couverture = {};

  Object.entries(objectifsCibles).forEach(([domaine, objectifs]) => {
    couverture[domaine] = objectifs.map(obj => ({
      objectif: obj,
      travaille: false,
      progression: 0,
    }));
  });

  sessionsData.forEach(session => {
    Object.values(session.etudiants || {}).forEach(etudiant => {
      etudiant.activites.forEach(act => {
        const mappages = mapperJeuObjectifs(act.jeuId);
        mappages.forEach(map => {
          if (map.niveau === classeNiveau) {
            const domaineObjs = couverture[map.domaine];
            if (domaineObjs) {
              const obj = domaineObjs.find(o => o.objectif.id === map.objectif.id);
              if (obj) {
                obj.travaille = true;
                obj.progression = Math.min(100, (obj.progression || 0) + (act.reussite ? 10 : 2));
              }
            }
          }
        });
      });
    });
  });

  return couverture;
}

export function genererPlanTravailQuotidien(niveau, faiblesses) {
  // faiblesses = { domaine: tauxEchec, ... }
  const objectifs = BO2020_OBJECTIFS[niveau] || {};
  const plan = [];

  Object.entries(faiblesses)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .forEach(([domaine, echecs]) => {
      const objs = objectifs[domaine] || [];
      if (objs.length > 0) {
        const objectif = objs[Math.floor(Math.random() * objs.length)];
        plan.push({
          domaine,
          objectif,
          priorite: echecs > 50 ? 'haute' : 'normale',
          jeuSuggest: objectif.jeux[0],
        });
      }
    });

  return plan;
}
