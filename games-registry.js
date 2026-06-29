const CHARGEURS = {
  maths: () => import("./games-maths.js"),
  formes: () => import("./games-formes.js"),
  temps: () => import("./games-temps.js"),
  argent: () => import("./games-argent.js"),
  avance: () => import("./games-avance.js"),
  langage: () => import("./games-langage.js"),
  algo: () => import("./games-algo.js"),
  musique: () => import("./games-musique.js"),
  strategiemalo: () => import("./games-strategiemalo.js"),
  comprehension: () => import("./games-comprehension.js"),
  orthographe: () => import("./games-orthographe.js"),
  p2: () => import("./games-p2.js"),
  geo: () => import("./games-geo.js"),
  sciences: () => import("./games-sciences.js"),
  histoire: () => import("./games-histoire.js"),
  dessin: () => import("./games-dessin.js"),
  abeille: () => import("./games-abeille.js"),
};

const JEU_SPEC = {
  compte: ["maths", "lancerCompte"],
  addition: ["maths", "lancerAddition"],
  soustraction: ["maths", "lancerSoustraction"],
  compare: ["maths", "lancerCompare"],
  vraiFaux: ["maths", "lancerVraiFaux"],
  suite: ["maths", "lancerSuite"],
  doubles: ["maths", "lancerDoubles"],
  moitie: ["maths", "lancerMoitie"],
  dizaines: ["maths", "lancerDizaines"],
  pairimpair: ["maths", "lancerPairImpair"],
  perlesDorees: ["maths", "lancerPerlesDorees"],
  planche100: ["maths", "lancerPlanche100"],
  decimaux: ["maths", "lancerDecimaux"],
  pourquoi: ["maths", "lancerPourquoi"],
  formes: ["formes", "lancerFormes"],
  fractions: ["formes", "lancerFractions"],
  symetrie: ["formes", "lancerSymetrie"],
  perimetre: ["formes", "lancerPerimetre"],
  angles: ["formes", "lancerAngles"],
  aires: ["formes", "lancerAires"],
  courseFractions: ["formes", "lancerCourseFractions"],
  geoConstructeur: ["formes", "lancerGeoConstructeur"],
  heure: ["temps", "lancerHeure"],
  durees: ["temps", "lancerDurees"],
  mesures: ["temps", "lancerMesures"],
  masse: ["temps", "lancerMasse"],
  calendrier: ["temps", "lancerCalendrier"],
  horlogeExpress: ["temps", "lancerHorlogeExpress"],
  chronoDefi: ["temps", "lancerChronoDefi"],
  monnaiecp: ["argent", "lancerMonnaieCp"],
  monnaiece1: ["argent", "lancerMonnaieCe1"],
  marcheMalin: ["argent", "lancerMarcheMalin"],
  multiplication: ["avance", "lancerMultiplication"],
  division: ["avance", "lancerDivision"],
  probleme: ["avance", "lancerProbleme"],
  fractionsCM: ["avance", "lancerFractionsCM"],
  proportionnalite: ["avance", "lancerProportionnalite"],
  pourcentages: ["avance", "lancerPourcentages"],
  calcuMalin: ["avance", "lancerCalcuMalin"],
  syllabes: ["langage", "lancerSyllabes"],
  lecture: ["langage", "lancerLecture"],
  anglais: ["langage", "lancerAnglaisMots"],
  traduction: ["langage", "lancerTraduction"],
  sons: ["langage", "lancerSons"],
  grammaire: ["langage", "lancerGrammaire"],
  lecturePhrase: ["langage", "lancerLecturePhrase"],
  phraseMobile: ["langage", "lancerPhraseMobile"],
  lectureTexte: ["langage", "lancerLectureTexte"],
  conjugaison: ["langage", "lancerConjugaison"],
  homophones: ["langage", "lancerHomophones"],
  synonymes: ["langage", "lancerSynonymes"],
  allemand: ["langage", "lancerAllemandMots"],
  traductionAllemand: ["langage", "lancerTraductionAllemand"],
  espagnol: ["langage", "lancerEspagnolMots"],
  traductionEspagnol: ["langage", "lancerTraductionEspagnol"],
  italien: ["langage", "lancerItalienMots"],
  traductionItalien: ["langage", "lancerTraductionItalien"],
  portugais: ["langage", "lancerPortugaisMots"],
  traductionPortugais: ["langage", "lancerTraductionPortugais"],
  detectiveErreurs: ["langage", "lancerDetectiveErreurs"],
  atelierAccords: ["langage", "lancerAtelierAccords"],
  conjugaisonMission: ["langage", "lancerConjugaisonMission"],
  motsJungle: ["langage", "lancerMotsJungle"],
  rythmeMagique: ["musique", "lancerRythmeMagique"],
  notesMelodie: ["musique", "lancerNotesMelodie"],
  tempoSprint: ["musique", "lancerTempoSprint"],
  sequence: ["algo", "lancerSequence"],
  code: ["algo", "lancerCode"],
  labyrintheLogique: ["algo", "lancerLabyrintheLogique"],
  planificationRenard: ["algo", "lancerPlanificationRenard"],
  triLogique: ["algo", "lancerTriLogique"],
  strategieMalo: ["strategiemalo", "lancerStratégieMalo"],
  doublesMalo: ["strategiemalo", "lancerStrategieDoubles"],
  aller10Malo: ["strategiemalo", "lancerStrategieAller10"],
  compensationMalo: ["strategiemalo", "lancerStrategieCompensation"],
  estimationMalo: ["strategiemalo", "lancerStrategieEstimation"],
  comprendreTexte: ["comprehension", "lancerComprendreTexte"],
  comprendreTexteCE2: ["comprehension", "lancerComprendreTexteCE2"],
  comprendreTexteCM1: ["comprehension", "lancerComprendreTexteCM1"],
  comprendreTexteCM2: ["comprehension", "lancerComprendreTexteCM2"],
  orthopuzzle: ["orthographe", "lancerOrthoPuzzle"],
  orthopuzzleCE1: ["orthographe", "lancerOrthopuzzleCE1"],
  orthopuzzleCE2: ["orthographe", "lancerOrthopuzzleCE2"],
  orthopuzzleCM1: ["orthographe", "lancerOrthopuzzleCM1"],
  orthopuzzleCM2: ["orthographe", "lancerOrthopuzzleCM2"],
  vocabReseaux: ["p2", "lancerVocabReseaux"],
  problemesProgressifs: ["p2", "lancerProblèmesProgressifs"],
  lectureExpress: ["p2", "lancerLectureExpress"],
  homophonesAvances: ["p2", "lancerHomophonesAvances"],
  ponctuationPuzzle: ["p2", "lancerPonctuationPuzzle"],
  amisDesmots: ["p2", "lancerAmisDesmots"],
  comprehensionAudio: ["p2", "lancerComprehensionAudio"],
  geographie: ["geo", "lancerGeographie"],
  sciences: ["sciences", "lancerSciences"],
  histoire: ["histoire", "lancerHistoire"],
  dessin: ["dessin", "lancerDessin"],
  abeille: ["abeille", "lancerAbeille"],
};

export const LISTE_IDS_JEUX = Object.freeze(Object.keys(JEU_SPEC));

const cacheMod = {};
const cacheFn = {};

async function moduleParCle(cle) {
  if (!cacheMod[cle]) {
    const load = CHARGEURS[cle];
    if (!load) return null;
    cacheMod[cle] = await load();
  }
  return cacheMod[cle];
}

export async function resoudreLanceur(jeuId) {
  if (cacheFn[jeuId]) return cacheFn[jeuId];
  const spec = JEU_SPEC[jeuId];
  if (!spec) return undefined;
  const [modCle, nomExport] = spec;
  const mod = await moduleParCle(modCle);
  if (!mod) return undefined;
  const fn = mod[nomExport];
  if (typeof fn !== "function") return undefined;
  cacheFn[jeuId] = fn;
  return fn;
}

export async function assurerLanceurDansMap(jeuId, carte) {
  if (typeof carte[jeuId] === "function") return true;
  const fn = await resoudreLanceur(jeuId);
  if (!fn) return false;
  carte[jeuId] = fn;
  return true;
}
