// app-teacher-dashboard.js — Teacher classroom analytics dashboard
// 4-tab interface: Class Overview, Individual Students, Curriculum Alignment, Session Analytics

import { obtenirProfilActuel, obtenirClassesProf } from './teacher-profile-service.js';
import { obtenirSessionsArchiviees, obtenirStatistiquesClasse, obtenirProgressionEtudiant } from './teacher-session-tracker.js';
import { obtenirObjectifParNiveau, calculerCouvertureCurriculum, genererPlanTravailQuotidien } from './teacher-curriculum-map.js';
import { afficherTableauBordAnalytiques } from './app-analytics-dashboard.js';

const TAB_ACTIF = 'am-teacher-tab-actif';
const CLASS_SELECTIONNEE = 'am-teacher-class-selected';

export function afficherTableauBordProfesseur() {
  const elTeacher = document.getElementById('ecran-teacher-dashboard');
  if (!elTeacher) return;

  const profil = obtenirProfilActuel();
  if (!profil) return;

  const classes = obtenirClassesProf(profil.id);
  if (classes.length === 0) {
    elTeacher.innerHTML = '<div style="padding: 2rem; text-align: center;">Aucune classe créée. <button id="btn-creer-classe">Créer une classe</button></div>';
    elTeacher.hidden = false;
    document.getElementById('btn-creer-classe')?.addEventListener('click', afficherCreationClasse);
    return;
  }

  const classeId = localStorage.getItem(CLASS_SELECTIONNEE) || classes[0].id;
  const classeActuelle = classes.find(c => c.id === classeId);

  if (!classeActuelle) {
    localStorage.setItem(CLASS_SELECTIONNEE, classes[0].id);
    afficherTableauBordProfesseur();
    return;
  }

  const tabActif = localStorage.getItem(TAB_ACTIF) || 'overview';
  const sessions = obtenirSessionsArchiviees().filter(s => s.classeId === classeId);

  const html = `
    <div style="padding: 1.5rem;">
      <!-- HEADER -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; gap: 1rem;">
        <h2 style="margin: 0; font-size: 1.5rem;">📊 Tableau Bord Classe</h2>
        <div style="display: flex; gap: 0.5rem;">
          <button id="btn-analytics-pilote" style="
            background: #2196F3;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: 600;
          ">📈 Analytique Pilote</button>
          <button id="btn-deconnexion-prof" style="
            background: var(--primaire);
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            cursor: pointer;
          ">Déconnexion</button>
        </div>
      </div>

      <!-- SÉLECTEUR CLASSE -->
      <div style="margin-bottom: 1.5rem;">
        <label style="font-weight: 600; margin-right: 0.5rem;">Classe:</label>
        <select id="select-classe" style="
          padding: 0.5rem;
          border-radius: 0.4rem;
          border: 1px solid #ccc;
          font-size: 1rem;
        ">
          ${classes.map(c => `<option value="${c.id}" ${c.id === classeId ? 'selected' : ''}>${c.nom} (${c.niveau.toUpperCase()})</option>`).join('')}
        </select>
      </div>

      <!-- TABS NAVIGATION -->
      <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; border-bottom: 2px solid #eee;">
        <button id="tab-overview" class="teacher-tab" ${tabActif === 'overview' ? 'data-actif="1"' : ''} style="border: none; background: none; padding: 0.8rem 1rem; cursor: pointer; border-bottom: 3px solid ${tabActif === 'overview' ? 'var(--primaire)' : 'transparent'};">
          📈 Vue globale
        </button>
        <button id="tab-etudiants" class="teacher-tab" ${tabActif === 'etudiants' ? 'data-actif="1"' : ''} style="border: none; background: none; padding: 0.8rem 1rem; cursor: pointer; border-bottom: 3px solid ${tabActif === 'etudiants' ? 'var(--primaire)' : 'transparent'};">
          👥 Élèves
        </button>
        <button id="tab-curriculum" class="teacher-tab" ${tabActif === 'curriculum' ? 'data-actif="1"' : ''} style="border: none; background: none; padding: 0.8rem 1rem; cursor: pointer; border-bottom: 3px solid ${tabActif === 'curriculum' ? 'var(--primaire)' : 'transparent'};">
          📚 Curriculum BO2020
        </button>
        <button id="tab-analytics" class="teacher-tab" ${tabActif === 'analytics' ? 'data-actif="1"' : ''} style="border: none; background: none; padding: 0.8rem 1rem; cursor: pointer; border-bottom: 3px solid ${tabActif === 'analytics' ? 'var(--primaire)' : 'transparent'};">
          📉 Analytique
        </button>
      </div>

      <!-- CONTENU TABS -->
      <div id="teacher-tab-content"></div>

      <!-- FOOTER -->
      <div style="text-align: center; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eee;">
        <button id="btn-retour-menu-prof" style="
          background: none;
          border: none;
          color: var(--primaire);
          text-decoration: underline;
          cursor: pointer;
          font-size: 1rem;
        ">← Retour au menu principal</button>
      </div>
    </div>
  `;

  elTeacher.innerHTML = html;
  elTeacher.hidden = false;

  const selectClasse = document.getElementById('select-classe');
  selectClasse.addEventListener('change', e => {
    localStorage.setItem(CLASS_SELECTIONNEE, e.target.value);
    afficherTableauBordProfesseur();
  });

  document.getElementById('tab-overview').addEventListener('click', () => afficherTab('overview', classeActuelle, sessions));
  document.getElementById('tab-etudiants').addEventListener('click', () => afficherTab('etudiants', classeActuelle, sessions));
  document.getElementById('tab-curriculum').addEventListener('click', () => afficherTab('curriculum', classeActuelle, sessions));
  document.getElementById('tab-analytics').addEventListener('click', () => afficherTab('analytics', classeActuelle, sessions));

  const btnAnalyticsPilote = document.getElementById('btn-analytics-pilote');
  if (btnAnalyticsPilote) {
    btnAnalyticsPilote.addEventListener('click', () => {
      const elAnalytics = document.getElementById('ecran-analytics-dashboard');
      if (elAnalytics) {
        const ecrans = document.querySelectorAll('.ecran');
        ecrans.forEach(e => e.hidden = true);
        afficherTableauBordAnalytiques();
      }
    });
  }

  document.getElementById('btn-deconnexion-prof').addEventListener('click', () => {
    const { deconnecterProfesseur } = require('./teacher-profile-service.js');
    deconnecterProfesseur();
    afficherEcran('ecran-menu-home');
  });

  document.getElementById('btn-retour-menu-prof').addEventListener('click', () => {
    afficherEcran('ecran-menu-home');
  });

  afficherTab(tabActif, classeActuelle, sessions);
}

function afficherTab(nomTab, classe, sessions) {
  localStorage.setItem(TAB_ACTIF, nomTab);
  const elContent = document.getElementById('teacher-tab-content');

  if (nomTab === 'overview') {
    elContent.innerHTML = afficherVueGlobale(classe, sessions);
  } else if (nomTab === 'etudiants') {
    elContent.innerHTML = afficherTabEtudiants(classe, sessions);
  } else if (nomTab === 'curriculum') {
    elContent.innerHTML = afficherTabCurriculum(classe, sessions);
  } else if (nomTab === 'analytics') {
    elContent.innerHTML = afficherTabAnalytique(classe, sessions);
  }

  attacherEventListenersTab(nomTab, classe, sessions);
}

function afficherVueGlobale(classe, sessions) {
  const stats = obtenirStatistiquesClasse(classe.id);
  const tempsHeures = Math.floor(stats.dureeTotal / 3600);
  const tempsMinutes = Math.floor((stats.dureeTotal % 3600) / 60);

  return `
    <div>
      <h3 style="margin-top: 0;">Vue d'ensemble</h3>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
        <div class="teacher-card">
          <div style="font-size: 2rem; font-weight: 700; color: var(--primaire);">${stats.sessionsTotales}</div>
          <div style="font-size: 0.9rem; color: #666;">Sessions complétées</div>
        </div>
        <div class="teacher-card">
          <div style="font-size: 2rem; font-weight: 700; color: var(--succes);">${stats.nombreEtudiants}/${classe.effectif}</div>
          <div style="font-size: 0.9rem; color: #666;">Élèves actifs</div>
        </div>
        <div class="teacher-card">
          <div style="font-size: 2rem; font-weight: 700; color: #FF9800;">${stats.tauxReussiteMoyen}%</div>
          <div style="font-size: 0.9rem; color: #666;">Taux réussite moyen</div>
        </div>
        <div class="teacher-card">
          <div style="font-size: 2rem; font-weight: 700; color: #2196F3;">${tempsHeures}h ${tempsMinutes}m</div>
          <div style="font-size: 0.9rem; color: #666;">Temps total classe</div>
        </div>
      </div>

      ${stats.sessionsTotales > 0 ? `
        <div class="teacher-card" style="margin-bottom: 1rem;">
          <h4 style="margin-top: 0;">🎮 Jeux les plus joués</h4>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${Object.entries(stats.jeuxLesPlusJoues)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([jeu, count]) => `
                <div style="display: flex; justify-content: space-between;">
                  <span>${jeu}</span>
                  <strong>${count} fois</strong>
                </div>
              `).join('')}
          </div>
        </div>
      ` : '<div class="teacher-card" style="color: #999;">Aucune session enregistrée</div>'}
    </div>
  `;
}

function afficherTabEtudiants(classe, sessions) {
  const etudiants = new Set();
  sessions.forEach(s => Object.keys(s.etudiants || {}).forEach(nom => etudiants.add(nom)));

  if (etudiants.size === 0) {
    return '<div class="teacher-card" style="color: #999;">Aucun élève enregistré</div>';
  }

  return `
    <div>
      <h3 style="margin-top: 0;">Progression individuelle</h3>
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${Array.from(etudiants).map(nom => {
          const prog = obtenirProgressionEtudiant(classe.id, nom);
          const moyenneReussite = Object.values(prog.competences).reduce((sum, c) => {
            return sum + (c.totales > 0 ? (c.reussites / c.totales) * 100 : 0);
          }, 0) / Object.keys(prog.competences).length;

          return `
            <div class="teacher-card" style="cursor: pointer;" data-etudiant="${nom}">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <strong>${nom}</strong>
                <span style="font-size: 0.9rem; color: #666;">${prog.sessionsTerminees} sessions</span>
              </div>
              <div style="width: 100%; background: #f0f0f0; height: 8px; border-radius: 4px; overflow: hidden;">
                <div style="background: var(--succes); width: ${moyenneReussite}%; height: 100%;"></div>
              </div>
              <div style="font-size: 0.85rem; color: #666; margin-top: 0.3rem;">
                Réussite moyenne: ${Math.round(moyenneReussite)}%
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function afficherTabCurriculum(classe, sessions) {
  const couverture = calculerCouvertureCurriculum(classe.niveau, sessions);

  return `
    <div>
      <h3 style="margin-top: 0;">Alignement BO 2020</h3>
      ${Object.entries(couverture).map(([domaine, objectifs]) => `
        <div class="teacher-card" style="margin-bottom: 1rem;">
          <h4 style="margin: 0 0 1rem 0;">📌 ${domaine.charAt(0).toUpperCase() + domaine.slice(1)}</h4>
          <div style="display: flex; flex-direction: column; gap: 0.8rem;">
            ${objectifs.map(o => `
              <div style="padding: 0.8rem; background: ${o.travaille ? '#D4EDDA' : '#F8F9FA'}; border-radius: 0.5rem; border-left: 4px solid ${o.travaille ? 'var(--succes)' : '#ccc'};">
                <div style="font-weight: 600;">${o.travaille ? '✅' : '⭕'} ${o.objectif.titre}</div>
                ${o.travaille ? `
                  <div style="font-size: 0.9rem; margin-top: 0.3rem; color: #666;">
                    Progression: ${Math.min(100, o.progression)}%
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function afficherTabAnalytique(classe, sessions) {
  const stats = obtenirStatistiquesClasse(classe.id);

  const domaineStats = {
    mathematiques: { reussites: 0, totales: 0 },
    lecture: { reussites: 0, totales: 0 },
    orthographe: { reussites: 0, totales: 0 },
  };

  sessions.forEach(session => {
    Object.values(session.etudiants || {}).forEach(etudiant => {
      etudiant.activites.forEach(act => {
        const domaine = mapperJeuDomaine(act.jeuId);
        if (domaine && domaineStats[domaine]) {
          domaineStats[domaine].totales++;
          if (act.reussite) domaineStats[domaine].reussites++;
        }
      });
    });
  });

  return `
    <div>
      <h3 style="margin-top: 0;">Analytique par domaine</h3>
      ${Object.entries(domaineStats).map(([domaine, stats]) => {
        const pct = stats.totales > 0 ? Math.round((stats.reussites / stats.totales) * 100) : 0;
        return `
          <div class="teacher-card" style="margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <strong>${domaine}</strong>
              <span style="color: var(--succes); font-weight: 700;">${pct}%</span>
            </div>
            <div style="width: 100%; background: #f0f0f0; height: 12px; border-radius: 6px; overflow: hidden;">
              <div style="background: var(--succes); width: ${pct}%; height: 100%;"></div>
            </div>
            <div style="font-size: 0.85rem; color: #666; margin-top: 0.3rem;">
              ${stats.reussites}/${stats.totales} bonnes réponses
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function attacherEventListenersTab(nomTab, classe, sessions) {
  if (nomTab === 'etudiants') {
    document.querySelectorAll('[data-etudiant]').forEach(el => {
      el.addEventListener('click', () => {
        const nom = el.getAttribute('data-etudiant');
        afficherDetailEtudiant(classe, sessions, nom);
      });
    });
  }
}

function afficherDetailEtudiant(classe, sessions, nomEtudiant) {
  const prog = obtenirProgressionEtudiant(classe.id, nomEtudiant);

  const html = `
    <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
      <div style="background: white; padding: 2rem; border-radius: 1rem; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
        <h3 style="margin-top: 0;">${nomEtudiant}</h3>

        <div style="margin-bottom: 1.5rem;">
          <h4>Compétences</h4>
          ${Object.entries(prog.competences).map(([domaine, stats]) => {
            const pct = stats.totales > 0 ? Math.round((stats.reussites / stats.totales) * 100) : 0;
            return `
              <div style="margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
                  <span>${domaine}</span>
                  <strong>${pct}%</strong>
                </div>
                <div style="width: 100%; background: #f0f0f0; height: 8px; border-radius: 4px; overflow: hidden;">
                  <div style="background: var(--succes); width: ${pct}%; height: 100%;"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <button id="btn-fermer-detail" style="
          width: 100%;
          background: var(--primaire);
          color: white;
          border: none;
          padding: 0.8rem;
          border-radius: 0.5rem;
          cursor: pointer;
        ">Fermer</button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);
  document.getElementById('btn-fermer-detail').addEventListener('click', e => {
    e.target.parentElement.parentElement.remove();
  });
}

function afficherCreationClasse() {
  // TODO: Implement class creation dialog
}

function afficherEcran(ecranId) {
  const ecrans = document.querySelectorAll('.ecran');
  ecrans.forEach(e => e.hidden = true);
  const ecran = document.getElementById(ecranId);
  if (ecran) ecran.hidden = false;
}

function mapperJeuDomaine(jeuId) {
  const mappings = {
    addition: 'mathematiques',
    soustraction: 'mathematiques',
    multiplication: 'mathematiques',
    division: 'mathematiques',
    fractions: 'mathematiques',
    strategieMalo: 'mathematiques',
    lecture: 'lecture',
    lecturePhrase: 'lecture',
    lectureExpress: 'lecture',
    comprendreTexte: 'lecture',
    homophones: 'orthographe',
    orthopuzzle: 'orthographe',
    ponctuationPuzzle: 'orthographe',
  };
  return mappings[jeuId];
}
