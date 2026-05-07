// app-analytics-tracking.js — Comprehensive analytics tracking for pilot evaluation
// Measures learning outcomes, engagement, and pedagogical effectiveness

import { getJeuCourant, getNiveauCourant, getDifficulte } from "./app-state.js";

const STORAGE_KEY = "am-analytics-tracking";
const SESSION_KEY = "am-current-session";

export function initAnalyticsTracking() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      sessions: [],
      gameStats: {},
      learningOutcomes: {},
      engagementMetrics: {},
    }));
  }
  demarrerNouvelleSemaine();
}

function demarrerNouvelleSemaine() {
  const session = {
    id: 'session-' + Date.now(),
    dateDebut: new Date().toISOString(),
    dateFin: null,
    dureeTotal: 0,
    jeux: {},
    competences: {
      mathematiques: { tentatives: 0, reussites: 0 },
      lecture: { tentatives: 0, reussites: 0 },
      orthographe: { tentatives: 0, reussites: 0 },
      grammaire: { tentatives: 0, reussites: 0 },
      logique: { tentatives: 0, reussites: 0 },
    },
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function enregistrerReponse(correct, tempsReponse, jeuId = null) {
  const jeu = jeuId || getJeuCourant();
  if (!jeu) return;

  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "{}");

    // Enregistrer au niveau du jeu
    if (!data.gameStats[jeu]) {
      data.gameStats[jeu] = {
        tentatives: 0,
        reussites: 0,
        tauxReussite: 0,
        tempsRéponsesMoyens: [],
        niveauxAtteints: [],
        difficulteProgression: 0,
      };
    }

    const stats = data.gameStats[jeu];
    stats.tentatives++;
    if (correct) stats.reussites++;
    stats.tauxReussite = Math.round((stats.reussites / stats.tentatives) * 100);
    stats.tempsRéponsesMoyens.push(tempsReponse);

    // Garder seulement les 50 derniers temps de réponse
    if (stats.tempsRéponsesMoyens.length > 50) {
      stats.tempsRéponsesMoyens.shift();
    }

    // Enregistrer progression de difficulté
    const diff = getDifficulte();
    if (diff > stats.difficulteProgression) {
      stats.difficulteProgression = diff;
    }

    // Enregistrer dans la session
    if (!session.jeux[jeu]) {
      session.jeux[jeu] = { tentatives: 0, reussites: 0 };
    }
    session.jeux[jeu].tentatives++;
    if (correct) session.jeux[jeu].reussites++;

    // Mettre à jour les compétences par domaine
    const domaine = mapperJeuDomaine(jeu);
    if (domaine && session.competences[domaine]) {
      session.competences[domaine].tentatives++;
      if (correct) session.competences[domaine].reussites++;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    // Vérifier les jalons (milestones)
    verifierJalons(jeu, stats);
  } catch (e) {
    console.warn("Erreur enregistrement analytics", e);
  }
}

function mapperJeuDomaine(jeuId) {
  const mappings = {
    addition: 'mathematiques', soustraction: 'mathematiques', multiplication: 'mathematiques',
    division: 'mathematiques', fractions: 'mathematiques', strategieMalo: 'mathematiques',
    lecture: 'lecture', lecturePhrase: 'lecture', lectureExpress: 'lecture', comprendreTexte: 'lecture',
    homophones: 'orthographe', orthopuzzle: 'orthographe', ponctuationPuzzle: 'orthographe',
    grammaire: 'grammaire', conjugaison: 'grammaire', atelierAccords: 'grammaire',
    sequence: 'logique', code: 'logique', triLogique: 'logique',
    vocabReseaux: 'lecture', problemesProgressifs: 'mathematiques', homophonesAvances: 'orthographe',
    amisDesmots: 'lecture', comprehensionAudio: 'lecture',
  };
  return mappings[jeuId];
}

function verifierJalons(jeuId, stats) {
  // Jalons d'apprentissage clés
  const jalons = [
    { nom: 'Premier essai', condition: stats.tentatives === 1 },
    { nom: '5 tentatives', condition: stats.tentatives === 5 },
    { nom: '10 tentatives', condition: stats.tentatives === 10 },
    { nom: '75% réussite', condition: stats.tauxReussite >= 75 },
    { nom: '90% réussite', condition: stats.tauxReussite >= 90 },
    { nom: 'Progression à Expert', condition: stats.difficulteProgression === 2 },
  ];

  jalons.forEach(j => {
    if (j.condition) {
      enregistrerJalon(jeuId, j.nom);
    }
  });
}

function enregistrerJalon(jeuId, nomJalon) {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (!data.learningOutcomes) data.learningOutcomes = {};
    if (!data.learningOutcomes[jeuId]) data.learningOutcomes[jeuId] = [];

    const jalonsExistants = data.learningOutcomes[jeuId].map(j => j.nom);
    if (!jalonsExistants.includes(nomJalon)) {
      data.learningOutcomes[jeuId].push({
        nom: nomJalon,
        date: new Date().toISOString(),
      });
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("Erreur jalon", e);
  }
}

export function obtenirSessionActuelle() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "{}");
  } catch (e) {
    return {};
  }
}

export function obtenirAnalyticsGlobales() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return data;
  } catch (e) {
    return { sessions: [], gameStats: {}, learningOutcomes: {} };
  }
}

export function calculerIndicateursPilote() {
  const data = obtenirAnalyticsGlobales();
  const session = obtenirSessionActuelle();

  // Indicateurs clés pour évaluer le pilote
  return {
    sessionsTotales: (data.sessions || []).length,
    dureeTotal: (data.sessions || []).reduce((sum, s) => sum + (s.dureeTotal || 0), 0),
    jeusMoyensParSession: Math.round(Object.keys(data.gameStats || {}).length / Math.max(1, (data.sessions || []).length)),
    tauxReussiteMoyen: calculerTauxReussiteMoyen(data.gameStats),
    jeuxLesPlusJoues: obtenirJeuxLesPlusJoues(data.gameStats, 5),
    competencesPrincipales: obtenirCompetencesPrincipales(data),
    jaloinsAtteints: Object.values(data.learningOutcomes || {}).flat().length,
    tentatativesTotales: Object.values(data.gameStats || {}).reduce((sum, g) => sum + (g.tentatives || 0), 0),
    reussitesTotales: Object.values(data.gameStats || {}).reduce((sum, g) => sum + (g.reussites || 0), 0),
    tempsEngagementMoyen: calculerTempsEngagement(data.sessions),
  };
}

function calculerTauxReussiteMoyen(gameStats) {
  const values = Object.values(gameStats || {});
  if (values.length === 0) return 0;
  const total = values.reduce((sum, g) => sum + (g.tauxReussite || 0), 0);
  return Math.round(total / values.length);
}

function obtenirJeuxLesPlusJoues(gameStats, limit) {
  return Object.entries(gameStats || {})
    .map(([jeu, stats]) => ({ jeu, tentatives: stats.tentatives || 0 }))
    .sort((a, b) => b.tentatives - a.tentatives)
    .slice(0, limit)
    .map(e => e.jeu);
}

function obtenirCompetencesPrincipales(data) {
  const competences = {};
  Object.values(data.gameStats || {}).forEach(g => {
    const domaine = mapperJeuDomaine(Object.keys(data.gameStats || {}).find(
      j => data.gameStats[j] === g
    ));
    if (domaine && !competences[domaine]) {
      competences[domaine] = 0;
    }
  });
  return competences;
}

function calculerTempsEngagement(sessions) {
  if (!sessions || sessions.length === 0) return 0;
  const total = sessions.reduce((sum, s) => sum + (s.dureeTotal || 0), 0);
  return Math.round(total / sessions.length);
}

export function exporterDonneesPilote() {
  const analytics = obtenirAnalyticsGlobales();
  const indicateurs = calculerIndicateursPilote();

  return {
    dateExport: new Date().toISOString(),
    indicateurs,
    analyticsDetaillees: analytics,
    formatCSV: genererCSV(analytics),
  };
}

function genererCSV(analytics) {
  let csv = "Jeu,Tentatives,Reussites,Taux Reussite,Temps Moyen Reponse\n";

  Object.entries(analytics.gameStats || {}).forEach(([jeu, stats]) => {
    const tempsRéponse = stats.tempsRéponsesMoyens && stats.tempsRéponsesMoyens.length > 0
      ? (stats.tempsRéponsesMoyens.reduce((a, b) => a + b, 0) / stats.tempsRéponsesMoyens.length).toFixed(2)
      : "N/A";

    csv += `"${jeu}",${stats.tentatives},${stats.reussites},${stats.tauxReussite}%,${tempsRéponse}s\n`;
  });

  return csv;
}

export function telechargerRapportPilote() {
  const rapport = exporterDonneesPilote();
  const json = JSON.stringify(rapport, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `apprentissage-magique-pilot-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function obtenirProgressionParDomaine() {
  const data = obtenirAnalyticsGlobales();
  const progression = {
    mathematiques: { tentatives: 0, reussites: 0 },
    lecture: { tentatives: 0, reussites: 0 },
    orthographe: { tentatives: 0, reussites: 0 },
    grammaire: { tentatives: 0, reussites: 0 },
    logique: { tentatives: 0, reussites: 0 },
  };

  Object.entries(data.gameStats || {}).forEach(([jeu, stats]) => {
    const domaine = mapperJeuDomaine(jeu);
    if (domaine && progression[domaine]) {
      progression[domaine].tentatives += stats.tentatives || 0;
      progression[domaine].reussites += stats.reussites || 0;
    }
  });

  // Calculer taux de réussite par domaine
  Object.keys(progression).forEach(domaine => {
    const p = progression[domaine];
    p.tauxReussite = p.tentatives > 0 ? Math.round((p.reussites / p.tentatives) * 100) : 0;
  });

  return progression;
}

// Auto-init
if (typeof window !== 'undefined') {
  initAnalyticsTracking();
}
