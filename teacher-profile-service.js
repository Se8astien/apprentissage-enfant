// teacher-profile-service.js — Manage teacher profiles and PIN-based access control
// Teachers create profiles with PIN, track their classes, manage sessions

export function initialiserProfilProfesseur() {
  const profils = obtenirProfilsLocaux();
  if (profils.length === 0) {
    localStorage.setItem('am-teacher-profiles', JSON.stringify([]));
  }
}

export function creerProfilProfesseur(nom, pin) {
  if (!nom || !pin || pin.length < 4) {
    return { erreur: 'Nom et PIN (4+ chiffres) requis' };
  }

  const profils = obtenirProfilsLocaux();

  if (profils.some(p => p.nom === nom)) {
    return { erreur: 'Ce nom de professeur existe déjà' };
  }

  const nouveauProfil = {
    id: 'prof-' + Date.now(),
    nom,
    pin: pinHash(pin),
    classes: [],
    sessionsCumulees: 0,
    dateCreation: new Date().toISOString(),
    derniereConnexion: null,
  };

  profils.push(nouveauProfil);
  localStorage.setItem('am-teacher-profiles', JSON.stringify(profils));

  return { succes: true, profil: { ...nouveauProfil, pin: undefined } };
}

export function authentifierProfesseur(nom, pin) {
  const profils = obtenirProfilsLocaux();
  const profil = profils.find(p => p.nom === nom);

  if (!profil) {
    return { erreur: 'Professeur non trouvé' };
  }

  if (profil.pin !== pinHash(pin)) {
    return { erreur: 'PIN incorrect' };
  }

  profil.derniereConnexion = new Date().toISOString();
  localStorage.setItem('am-teacher-profiles', JSON.stringify(profils));
  localStorage.setItem('am-teacher-courant', profil.id);

  return { succes: true, profil: { ...profil, pin: undefined } };
}

export function obtenirProfilActuel() {
  const profilId = localStorage.getItem('am-teacher-courant');
  if (!profilId) return null;

  const profils = obtenirProfilsLocaux();
  const profil = profils.find(p => p.id === profilId);

  return profil ? { ...profil, pin: undefined } : null;
}

export function deconnecterProfesseur() {
  localStorage.removeItem('am-teacher-courant');
}

export function obtenirProfilsLocaux() {
  try {
    return JSON.parse(localStorage.getItem('am-teacher-profiles') || '[]');
  } catch (e) {
    console.warn('Erreur lecture profils professeur', e);
    return [];
  }
}

export function creerClasse(profilId, nomClasse, niveau, effectif) {
  const profils = obtenirProfilsLocaux();
  const profil = profils.find(p => p.id === profilId);

  if (!profil) return { erreur: 'Professeur non trouvé' };

  const nouvelleClasse = {
    id: 'classe-' + Date.now(),
    nom: nomClasse,
    niveau, // 'cp' | 'ce1' | 'ce2' | 'cm1' | 'cm2'
    effectif: Math.min(effectif, 30),
    eleves: [],
    sessionsPrevues: 0,
    sessionsCompletees: 0,
    dateCreation: new Date().toISOString(),
  };

  profil.classes.push(nouvelleClasse.id);
  localStorage.setItem('am-teacher-profiles', JSON.stringify(profils));

  const classes = obtenirClassesLocales();
  classes.push(nouvelleClasse);
  localStorage.setItem('am-teacher-classes', JSON.stringify(classes));

  return { succes: true, classe: nouvelleClasse };
}

export function obtenirClassesProf(profilId) {
  const profils = obtenirProfilsLocaux();
  const profil = profils.find(p => p.id === profilId);

  if (!profil) return [];

  const toutesClasses = obtenirClassesLocales();
  return toutesClasses.filter(c => profil.classes.includes(c.id));
}

export function obtenirClassesLocales() {
  try {
    return JSON.parse(localStorage.getItem('am-teacher-classes') || '[]');
  } catch (e) {
    console.warn('Erreur lecture classes', e);
    return [];
  }
}

function pinHash(pin) {
  let hash = 0;
  for (let i = 0; i < pin.length; i++) {
    const char = pin.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'pin-' + Math.abs(hash).toString(36);
}
