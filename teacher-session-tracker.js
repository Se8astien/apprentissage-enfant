// teacher-session-tracker.js — Track classroom sessions and individual student progress
// Logs gameplay, competencies, learning outcomes for analysis

export function demarrerSessionClasse(classeId, objectif) {
  const session = {
    id: 'session-' + Date.now(),
    classeId,
    objectif,
    dateDebut: new Date().toISOString(),
    dateFin: null,
    etudiants: {},
    dureeTotale: 0,
  };

  localStorage.setItem('am-session-courante', JSON.stringify(session));
  return session;
}

export function obtenirSessionCourante() {
  try {
    return JSON.parse(localStorage.getItem('am-session-courante') || 'null');
  } catch (e) {
    console.warn('Erreur lecture session', e);
    return null;
  }
}

export function enregistrerActiviteEtudiant(sessionId, nomEtudiant, jeuId, reussite, tempsSeconde) {
  const sessions = obtenirSessionsArchiviees();
  const sessionIndex = sessions.findIndex(s => s.id === sessionId);

  if (sessionIndex < 0) return { erreur: 'Session non trouvée' };

  if (!sessions[sessionIndex].etudiants[nomEtudiant]) {
    sessions[sessionIndex].etudiants[nomEtudiant] = {
      nom: nomEtudiant,
      activites: [],
      totalReussites: 0,
      totalEchecs: 0,
      tempsTotal: 0,
    };
  }

  const activite = {
    jeuId,
    reussite,
    temps: tempsSeconde,
    timestamp: new Date().toISOString(),
  };

  sessions[sessionIndex].etudiants[nomEtudiant].activites.push(activite);
  sessions[sessionIndex].etudiants[nomEtudiant].totalReussites += reussite ? 1 : 0;
  sessions[sessionIndex].etudiants[nomEtudiant].totalEchecs += reussite ? 0 : 1;
  sessions[sessionIndex].etudiants[nomEtudiant].tempsTotal += tempsSeconde;

  localStorage.setItem('am-sessions-archiviees', JSON.stringify(sessions));
  return { succes: true };
}

export function terminerSessionClasse(sessionId) {
  const sessions = obtenirSessionsArchiviees();
  const session = sessions.find(s => s.id === sessionId);

  if (!session) return { erreur: 'Session non trouvée' };

  session.dateFin = new Date().toISOString();
  session.dureeTotale = Math.round((new Date(session.dateFin) - new Date(session.dateDebut)) / 1000);

  localStorage.setItem('am-sessions-archiviees', JSON.stringify(sessions));
  localStorage.removeItem('am-session-courante');

  return { succes: true, session };
}

export function obtenirSessionsArchiviees() {
  try {
    return JSON.parse(localStorage.getItem('am-sessions-archiviees') || '[]');
  } catch (e) {
    console.warn('Erreur lecture sessions archivées', e);
    return [];
  }
}

export function obtenirProgressionEtudiant(classeId, nomEtudiant) {
  const sessions = obtenirSessionsArchiviees();
  const sessionsClasse = sessions.filter(s => s.classeId === classeId);

  const competences = {
    mathematiques: { reussites: 0, totales: 0 },
    lecture: { reussites: 0, totales: 0 },
    orthographe: { reussites: 0, totales: 0 },
    grammaire: { reussites: 0, totales: 0 },
    logique: { reussites: 0, totales: 0 },
  };

  sessionsClasse.forEach(session => {
    const activites = (session.etudiants[nomEtudiant] || {}).activites || [];

    activites.forEach(act => {
      const domaine = mapperJeuDomaine(act.jeuId);
      if (domaine && competences[domaine]) {
        competences[domaine].totales++;
        if (act.reussite) competences[domaine].reussites++;
      }
    });
  });

  return {
    nomEtudiant,
    competences,
    sessionsTerminees: sessionsClasse.length,
    derniereActivite: obtenirDerniereActivite(sessionsClasse, nomEtudiant),
  };
}

export function obtenirStatistiquesClasse(classeId) {
  const sessions = obtenirSessionsArchiviees();
  const sessionsClasse = sessions.filter(s => s.classeId === classeId);

  const stats = {
    sessionsTotales: sessionsClasse.length,
    dureeTotal: 0,
    nombreEtudiants: 0,
    tauxReussiteMoyen: 0,
    jeuxLesPlusJoues: {},
  };

  const tousLesEtudiants = new Set();

  sessionsClasse.forEach(session => {
    stats.dureeTotal += session.dureeTotale || 0;

    Object.entries(session.etudiants || {}).forEach(([nom, data]) => {
      tousLesEtudiants.add(nom);

      data.activites.forEach(act => {
        stats.jeuxLesPlusJoues[act.jeuId] = (stats.jeuxLesPlusJoues[act.jeuId] || 0) + 1;
      });
    });
  });

  stats.nombreEtudiants = tousLesEtudiants.size;

  if (stats.sessionsTotales > 0) {
    let totalReussites = 0;
    let totalActivites = 0;

    sessionsClasse.forEach(session => {
      Object.values(session.etudiants || {}).forEach(data => {
        totalActivites += data.activites.length;
        totalReussites += data.totalReussites;
      });
    });

    stats.tauxReussiteMoyen = totalActivites > 0 ? Math.round((totalReussites / totalActivites) * 100) : 0;
  }

  return stats;
}

function mapperJeuDomaine(jeuId) {
  const mappings = {
    // Mathématiques
    addition: 'mathematiques',
    soustraction: 'mathematiques',
    multiplication: 'mathematiques',
    division: 'mathematiques',
    fractions: 'mathematiques',
    strategieMalo: 'mathematiques',

    // Lecture
    lecture: 'lecture',
    lecturePhrase: 'lecture',
    lectureExpress: 'lecture',
    comprendreTexte: 'lecture',

    // Orthographe
    homophones: 'orthographe',
    orthopuzzle: 'orthographe',
    ponctuationPuzzle: 'orthographe',

    // Grammaire
    grammaire: 'grammaire',
    conjugaison: 'grammaire',
    atelierAccords: 'grammaire',

    // Logique
    sequence: 'logique',
    code: 'logique',
    triLogique: 'logique',
  };

  return mappings[jeuId];
}

function obtenirDerniereActivite(sessions, nomEtudiant) {
  let plusRecente = null;

  sessions.forEach(session => {
    const activites = (session.etudiants[nomEtudiant] || {}).activites || [];
    activites.forEach(act => {
      if (!plusRecente || new Date(act.timestamp) > new Date(plusRecente.timestamp)) {
        plusRecente = act;
      }
    });
  });

  return plusRecente;
}
