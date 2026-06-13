// app-renard.js — fox companion: SVG, accessories, dressing, streak, evolution

import { getChapitreParStade, afficherContexteHistoireMaison } from "./app-histoire.js";
import { ligneAccrocheMenu } from "./app-accroches.js";
import { sonAccessoire } from "./app-sons.js";

import {
  STORAGE_KEY,
  RENARD_NAISSANCE_KEY,
  RENARD_CALIN_DATE_KEY,
  elTotal,
  elSousTitre,
  lireEtoiles,
  _ajouterEtoilesBase,
  lireFaim,
  lireBonheur,
  sauverFaim,
  sauverBonheur,
  lireNomRenard,
  lireAccessoires,
  lireTenue,
  sauverTenue,
  debloquerAccessoire,
  lireStreak,
  sauverStreak,
  peutFaireCalin,
  majGenre,
  confetti,
  estGrand,
  localDate,
  lireDernierJeuMenu,
  localDateHier,
  escapeHtml,
  piegerFocus,
  revelerSeulEcran,
  lireDecor,
  sauverDecor,
  lireCouleur,
  sauverCouleur,
  coffreDispoAujourdhui,
  marquerCoffreOuvert,
  joursDepuisDerniereVisite,
  marquerVisite,
  estAnniversaireRenard,
  marquerAnniversaireFete,
  ageAnneesRenard,
} from "./app-state.js";

// Re-export peutFaireCalin so other modules don't need to import app-state directly
export { peutFaireCalin } from "./app-state.js";

// ── Stades d'évolution ────────────────────────────────────────────────────────
export const RENARD_STADES = [
  { nom: "Bébé renard",       nomGrand: "Renard futé",          corps: "#f5b97e", interne: "#fde7c8", yeux: "#3d2b1f" },
  { nom: "Jeune renard",      nomGrand: "Renard sagace",        corps: "#e8872a", interne: "#f5c07a", yeux: "#1a1a1a" },
  { nom: "Renard malin",      nomGrand: "Renard expert",        corps: "#c96416", interne: "#e89050", yeux: "#0d0d0d" },
  { nom: "Renard magique",    nomGrand: "Renard légendaire ⭐",  corps: "#9c59d1", interne: "#c99ef0", yeux: "#4b0082" },
  { nom: "Renard légendaire", nomGrand: "Maître renard",        corps: "#ffd700", interne: "#ffe999", yeux: "#c8860a" },
];

export function getStade(etoiles) {
  if (etoiles < 21)  return 0;
  if (etoiles < 61)  return 1;
  if (etoiles < 151) return 2;
  if (etoiles < 301) return 3;
  return 4;
}

// ── Décorations de la maison ─────────────────────────────────────────────────
export const DECOR_DEF = {
  "plante":    { nom: "🪴 Plante verte",    emoji: "🪴", cout: 5 },
  "tableau":   { nom: "🖼️ Tableau",         emoji: "🖼️", cout: 8 },
  "ballons":   { nom: "🎈 Ballons",         emoji: "🎈", cout: 8 },
  "guirlande": { nom: "✨ Guirlande",       emoji: "✨", cout: 12 },
  "tapis":     { nom: "🟫 Tapis",           emoji: "🟫", cout: 12 },
  "lampe":     { nom: "🪔 Lampe",           emoji: "🪔", cout: 15 },
  "aquarium":  { nom: "🐠 Aquarium",        emoji: "🐠", cout: 20 },
  "trophee":   { nom: "🏆 Trophée",         emoji: "🏆", cout: 25 },
  "piano":     { nom: "🎹 Piano",           emoji: "🎹", cout: 35 },
  "telescope": { nom: "🔭 Télescope",       emoji: "🔭", cout: 45 },
  "cheminee":  { nom: "🔥 Cheminée",        emoji: "🔥", cout: 60 },
  "lustre":    { nom: "💡 Lustre doré",     emoji: "💡", cout: 80 },
};

// ── Couleurs du pelage ────────────────────────────────────────────────────────
// "defaut" suit les couleurs du stade d'évolution ; les autres teignent le pelage.
export const COULEUR_DEF = {
  "defaut":  { nom: "Origine",  apercu: "#e8872a", corps: null,      interne: null },
  "roux":    { nom: "Roux vif", apercu: "#e8872a", corps: "#e8872a", interne: "#f5c07a" },
  "brun":    { nom: "Brun",     apercu: "#8d6e63", corps: "#8d6e63", interne: "#d7ccc8" },
  "gris":    { nom: "Gris",     apercu: "#95a5a6", corps: "#95a5a6", interne: "#dfe6e9" },
  "blanc":   { nom: "Blanc",    apercu: "#ecf0f1", corps: "#ecf0f1", interne: "#ffffff" },
  "violet":  { nom: "Violet",   apercu: "#9c59d1", corps: "#9c59d1", interne: "#c99ef0" },
  "bleu":    { nom: "Bleu",     apercu: "#5b8def", corps: "#5b8def", interne: "#b8cdfb" },
  "rose":    { nom: "Rose",     apercu: "#ff80ab", corps: "#ff80ab", interne: "#ffc1d8" },
};

// ── Accessoires ───────────────────────────────────────────────────────────────
export const ACCESSOIRES_DEF = {
  "chapeau-base":  { nom: "🎩 Chapeau",    svg: (t) => `<rect x="30" y="8" width="40" height="6" rx="3" fill="#2d3436"/><rect x="22" y="13" width="56" height="5" rx="2.5" fill="#2d3436"/>` },
  "lunettes-base": { nom: "👓 Lunettes",   svg: (t) => `<circle cx="37" cy="63" r="8.5" fill="none" stroke="#2d3436" stroke-width="2.5"/><circle cx="63" cy="63" r="8.5" fill="none" stroke="#2d3436" stroke-width="2.5"/><line x1="45.5" y1="63" x2="54.5" y2="63" stroke="#2d3436" stroke-width="2"/><line x1="28.5" y1="63" x2="22" y2="60" stroke="#2d3436" stroke-width="2"/><line x1="71.5" y1="63" x2="78" y2="60" stroke="#2d3436" stroke-width="2"/>` },
  "echarpe-rare":  { nom: "🧣 Écharpe",    svg: (t) => `<path d="M20,88 Q35,82 50,84 Q65,82 80,88" stroke="#e74c3c" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M50,84 L54,97" stroke="#e74c3c" stroke-width="6" stroke-linecap="round"/>` },
  "couronne-legendaire": { nom: "👑 Couronne légendaire", svg: (t) => `<polygon points="28,26 34,8 50,18 66,8 72,26" fill="#ffd700" stroke="#b8860b" stroke-width="1.5"/><circle cx="34" cy="9" r="4.5" fill="#e74c3c"/><circle cx="50" cy="19" r="4.5" fill="#9b59b6"/><circle cx="66" cy="9" r="4.5" fill="#e74c3c"/>` },
  "medaille-effort": { nom: "🏅 Médaille d'effort", svg: (t) => `<path d="M43,90 L50,103 L57,90" fill="#6c5ce7"/><circle cx="50" cy="88" r="8" fill="#fdcb6e" stroke="#b8860b" stroke-width="1.5"/><text x="50" y="92" text-anchor="middle" font-size="8" fill="#8a5a00" font-family="Arial">✓</text>` },
  "cape-courage": { nom: "🦸 Cape courage", svg: (t) => `<path d="M22,78 Q12,93 18,106 Q36,101 42,86" fill="#a29bfe" opacity="0.85"/><path d="M78,78 Q88,93 82,106 Q64,101 58,86" fill="#a29bfe" opacity="0.85"/>` },
  "sac-aventure": { nom: "🎒 Sac d'aventure", svg: (t) => `<rect x="18" y="75" width="16" height="22" rx="5" fill="#00b894" stroke="#00745e" stroke-width="1.5"/><path d="M21,78 Q26,70 31,78" fill="none" stroke="#00745e" stroke-width="2"/><line x1="21" y1="86" x2="31" y2="86" stroke="#00745e" stroke-width="1.5"/>` },
};

// ── SVG renard ────────────────────────────────────────────────────────────────
export function svgRenard(stade, taille, opts) {
  const triste = opts && opts.triste;
  const base = RENARD_STADES[Math.max(0, Math.min(4, stade))];
  const couleurId = (opts && opts.couleur != null) ? opts.couleur : lireCouleur();
  const teinte = COULEUR_DEF[couleurId];
  const s = (teinte && teinte.corps)
    ? { ...base, corps: teinte.corps, interne: teinte.interne }
    : base;
  const t = taille || 80;
  const h = Math.round(t * 1.1);

  const sourcils = triste
    ? `<path d="M29,62 Q37,57 44,63" stroke="${s.yeux}" stroke-width="2" fill="none" stroke-linecap="round"/>
       <path d="M56,63 Q63,57 71,62" stroke="${s.yeux}" stroke-width="2" fill="none" stroke-linecap="round"/>`
    : (stade >= 2
      ? `<path d="M29,54 Q37,50 44,54" stroke="${s.yeux}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
         <path d="M56,54 Q63,50 71,54" stroke="${s.yeux}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`
      : "");

  const bouche = triste
    ? `<path d="M44,80 Q50,74 56,80" stroke="#8B4513" stroke-width="1.8" fill="none" stroke-linecap="round"/>`
    : `<path d="M44,77 Q50,83 56,77" stroke="#8B4513" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;

  function etoileSvg(cx, cy, r, couleur, op) {
    const r2 = r * 0.38;
    const pts = [];
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4 - Math.PI / 2;
      const rr = i % 2 === 0 ? r : r2;
      pts.push(`${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`);
    }
    return `<polygon points="${pts.join(" ")}" fill="${couleur}" opacity="${op}"/>`;
  }

  const particules = stade === 3
    ? etoileSvg(10, 28, 6, "#e056fd", 0.75) +
      etoileSvg(84, 22, 5, "#fdcb6e", 0.80) +
      etoileSvg(87, 73, 4, "#a29bfe", 0.70) +
      etoileSvg(8,  78, 5, "#74b9ff", 0.70)
    : "";

  const couronne = stade === 4
    ? `<polygon points="33,26 39,8 50,20 61,8 67,26" fill="#ffd700" stroke="#b8860b" stroke-width="1.5" stroke-linejoin="round"/>
       <circle cx="39" cy="9"  r="4" fill="#ff6b00"/>
       <circle cx="50" cy="21" r="4" fill="#ff0080"/>
       <circle cx="61" cy="9"  r="4" fill="#ff6b00"/>`
    : "";

  const tenue = (opts && opts.accessoires != null) ? opts.accessoires : Object.keys(lireTenue());
  const accSvg = tenue.map(id => ACCESSOIRES_DEF[id] ? ACCESSOIRES_DEF[id].svg(t) : "").join("");

  return `<svg width="${t}" height="${h}" viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg">
  ${couronne}${particules}
  <polygon points="16,66 28,22 45,60" fill="${s.corps}"/>
  <polygon points="84,66 72,22 55,60" fill="${s.corps}"/>
  <polygon points="22,62 28,28 42,57" fill="${s.interne}"/>
  <polygon points="78,62 72,28 58,57" fill="${s.interne}"/>
  <ellipse cx="50" cy="70" rx="33" ry="30" fill="${s.corps}"/>
  <ellipse cx="50" cy="79" rx="23" ry="21" fill="white" opacity="0.88"/>
  ${sourcils}
  <circle cx="37" cy="63" r="7.5" fill="white"/>
  <circle cx="63" cy="63" r="7.5" fill="white"/>
  <circle cx="39" cy="64" r="4.5" fill="${s.yeux}"/>
  <circle cx="65" cy="64" r="4.5" fill="${s.yeux}"/>
  <circle cx="41" cy="62" r="1.8" fill="white"/>
  <circle cx="67" cy="62" r="1.8" fill="white"/>
  <ellipse cx="50" cy="73" rx="3.5" ry="2.5" fill="#8B4513"/>
  ${bouche}
  <circle cx="27" cy="71" r="7" fill="#ff9999" opacity="0.30"/>
  <circle cx="73" cy="71" r="7" fill="#ff9999" opacity="0.30"/>
  ${accSvg}
</svg>`;
}

// ── Header / banner update ────────────────────────────────────────────────────
export function mettreAJourRenardHeader() {
  const stade  = getStade(lireEtoiles());
  const triste = lireFaim() < 20 || lireBonheur() < 20;
  const accessoires = Object.keys(lireTenue());
  const opts   = { triste, accessoires };
  const header = document.getElementById("mascotte-header");
  const genre  = document.getElementById("mascotte-genre");
  if (header) header.innerHTML = svgRenard(stade, 44, opts);
  if (genre)  genre.innerHTML  = svgRenard(stade, 72, opts);
  mettreAJourMaisonBanner();
}

export function mettreAJourMaisonBanner() {
  const foxEl   = document.getElementById("maison-banner-fox");
  const nomEl   = document.getElementById("maison-banner-nom");
  const subEl   = document.getElementById("maison-banner-sub");
  const starsEl = document.getElementById("maison-banner-stars");
  if (!foxEl) return;
  const stade  = getStade(lireEtoiles());
  const triste = lireFaim() < 20 || lireBonheur() < 20;
  const accessoires = Object.keys(lireTenue());
  foxEl.innerHTML = svgRenard(stade, 46, { triste, accessoires });
  if (nomEl)   nomEl.textContent   = (lireNomRenard() || "Foxy") + " 🏠";
  if (subEl)   subEl.textContent   = estGrand() ? RENARD_STADES[stade].nomGrand : RENARD_STADES[stade].nom;
  if (starsEl) starsEl.textContent = "⭐ " + lireEtoiles();
}

// ── Nommage screen ────────────────────────────────────────────────────────────
export function montrerNommage() {
  const elNommage = document.getElementById("ecran-nommage");
  if (!elNommage) return;
  revelerSeulEcran(elNommage);
  const foxDiv = document.getElementById("nommage-fox");
  if (foxDiv) foxDiv.innerHTML = svgRenard(0, 110);
  const titre = document.getElementById("nommage-titre");
  if (titre) titre.innerHTML = estGrand()
    ? "Comment s'appelle<br>ton compagnon ?"
    : "Comment s'appelle<br>ton renard ?";
  const btn = document.querySelector(".btn-nommage");
  if (btn) btn.textContent = estGrand() ? "C'est parti !" : "C'est parti ! 🎉";
  setTimeout(() => {
    const inp = document.getElementById("input-nom-renard");
    if (inp) inp.focus();
  }, 350);
}

// ── Evolution overlay ─────────────────────────────────────────────────────────
function declencherEvolution(stade) {
  confetti({ tier: "burst" });
  const s = RENARD_STADES[stade];
  const overlay = document.createElement("div");
  overlay.className = "evolution-overlay";
  overlay.innerHTML = `
    <div class="evolution-carte">
      <div class="evolution-renard">${svgRenard(stade, 130)}</div>
      <p class="evolution-titre">✨ ${estGrand() ? "Ton compagnon évolue !" : "Ton renard évolue !"}</p>
      <p class="evolution-nom-stade">${estGrand() ? "Niveau" : "Il devient"} : ${estGrand() ? s.nomGrand : s.nom}</p>
      <p class="evolution-msg">${estGrand() ? "Excellent travail, continue !" : "Continue comme ça, tu es incroyable !"}</p>
      <div class="histoire-chapitre">
        <p class="histoire-chapitre-emoji">${getChapitreParStade(stade).emoji}</p>
        <p class="histoire-chapitre-titre">${getChapitreParStade(stade).titre}</p>
        <p class="histoire-chapitre-texte">${getChapitreParStade(stade).texte.replace(/\[Nom\]/g, escapeHtml(lireNomRenard() || "Foxy"))}</p>
      </div>
      <button type="button" class="btn-evolution-fermer">${estGrand() ? "Continuer" : "Super ! 🎉"}</button>
    </div>`;
  document.body.appendChild(overlay);
  piegerFocus(overlay);
  const prevFocusEvol = document.activeElement;
  setTimeout(() => confetti(estGrand() ? { tier: "sparkle", sobre: true } : { tier: "sparkle" }), 400);
  overlay.querySelector(".btn-evolution-fermer").addEventListener("click", () => {
    overlay.style.opacity = "0";
    overlay.style.transition = "opacity 0.3s";
    setTimeout(() => { overlay.remove(); if (prevFocusEvol) prevFocusEvol.focus(); }, 300);
  });
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.querySelector(".btn-evolution-fermer").click();
  });
}

// ── ajouterEtoiles (wrapped — detects evolution) ──────────────────────────────
export function ajouterEtoiles(n) {
  const stadeBefore = getStade(lireEtoiles());
  _ajouterEtoilesBase(n);
  const stadeAfter = getStade(lireEtoiles());
  mettreAJourRenardHeader();
  if (stadeAfter > stadeBefore) declencherEvolution(stadeAfter);
}

// ── Streak ────────────────────────────────────────────────────────────────────
export function mettreAJourStreak() {
  const today = localDate();
  const s = lireStreak();
  if (s.lastVisit === today) return s;

  const yesterday = localDateHier();
  const newCount = s.lastVisit === yesterday ? s.count + 1 : 1;
  const streakData = { count: newCount, lastVisit: today };
  sauverStreak(streakData);

  const paliers = { 3: "chapeau-base", 7: "lunettes-base", 30: "echarpe-rare" };
  if (paliers[newCount] && debloquerAccessoire(paliers[newCount])) sonAccessoire();

  if (s.lastVisit && s.lastVisit !== yesterday && s.count > 0) {
    if (elSousTitre) {
      elSousTitre.textContent = "Le renard t'a attendu, mais il est content que tu sois là ! 🦊";
      setTimeout(() => majGenre(), 4000);
    }
  }
  return streakData;
}

export function afficherStreakHeader(count) {
  let el = document.getElementById("streak-header");
  if (!el) {
    el = document.createElement("div");
    el.id = "streak-header";
    el.className = "streak-header";
    const scoreEl = document.querySelector(".score-global");
    if (scoreEl) scoreEl.parentNode.insertBefore(el, scoreEl);
  }
  el.textContent = count >= 2 ? `🔥 ${count}` : "";
  el.title = `${count} jour${count > 1 ? "s" : ""} d'affilée !`;
}

// ── Tamagotchi helpers ────────────────────────────────────────────────────────
function majBulle(faim, bonheur, nom, contexte = {}) {
  const el = document.getElementById("tama-bulle");
  if (!el) return;
  let msg;
  if (contexte.anniversaire)        msg = `C'est mon anniversaire ! 🎂 Merci ${nom} !`;
  else if (contexte.retourJours >= 2) msg = `Tu m'as manqué ! 💛 Contente de te revoir !`;
  else if (faim < 20)    msg = "J'ai très faim ! 🍎";
  else if (bonheur < 20) msg = "Je m'ennuie ! 🎮";
  else if (faim < 40)    msg = "J'aurais bien mangé... 🍎";
  else if (bonheur < 40) msg = "Joue avec moi ! 🎮";
  else {
    const { streak = 0, reste = null, heure = new Date().getHours() } = contexte;
    const pool = ["Je t'aime ! 💜", "Je suis heureux !", "C'est magique ! ✨", `Merci ${nom} !`, "Quelle belle journée !"];
    if (heure < 10) pool.push("Bonjour ! Prêt à apprendre ? ☀️");
    else if (heure >= 19) pool.push("Bonsoir ! On joue un peu avant le dodo ? 🌙");
    if (streak >= 3) pool.push(`${streak} jours de suite, bravo ! 🔥`);
    if (reste != null && reste <= 5) pool.push("Tu es tout proche de la prochaine évolution ! ✨");
    msg = pool[Math.floor(Math.random() * pool.length)];
  }
  el.textContent = msg;
}

function renderSegments(containerId, valeur) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const total = 5;
  const pleins = Math.round((valeur / 100) * total);
  const basse = valeur < 30;
  el.innerHTML = "";
  for (let i = 0; i < total; i++) {
    const seg = document.createElement("div");
    seg.className = "tama-segment " + (i < pleins
      ? (basse ? "critique" : (pleins <= 2 ? "mi-plein" : "plein"))
      : "vide");
    el.appendChild(seg);
  }
}

function flotterEmoji(emoji, bouton) {
  const rect = bouton.getBoundingClientRect();
  const el   = document.createElement("div");
  el.className  = "emoji-flottant";
  el.textContent = emoji;
  el.style.left = (rect.left + rect.width / 2 - 16) + "px";
  el.style.top  = rect.top + "px";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

// ── Maison screen ─────────────────────────────────────────────────────────────
export function montrerMaison(montrerMenuFn) {
  const elMaison = document.getElementById("ecran-maison");
  if (!elMaison) return;
  revelerSeulEcran(elMaison);

  const etoiles = lireEtoiles();
  const stade   = getStade(etoiles);
  const s       = RENARD_STADES[stade];
  const nom     = lireNomRenard() || "Foxy";
  const faim    = lireFaim();
  const bonheur = lireBonheur();

  const triste = faim < 20 || bonheur < 20;
  document.getElementById("maison-renard").innerHTML = svgRenard(stade, 180, { triste, accessoires: Object.keys(lireTenue()) });
  document.getElementById("maison-nom").textContent   = nom;
  document.getElementById("maison-stade").textContent = "✦ " + s.nom;
  document.getElementById("maison-etoiles-total").textContent = etoiles;

  const naissance = localStorage.getItem(RENARD_NAISSANCE_KEY);
  if (naissance) {
    const jours = Math.max(0, Math.floor((Date.now() - new Date(naissance).getTime()) / 86400000));
    document.getElementById("maison-jours").textContent =
      jours === 0 ? `Tu as ${nom} depuis aujourd'hui !`
                  : `Tu as ${nom} depuis ${jours} jour${jours > 1 ? "s" : ""} !`;
  }

  const seuils = [0, 21, 61, 151, 301];
  if (stade < 4) {
    const min = seuils[stade], max = seuils[stade + 1];
    const pct  = Math.min(100, Math.round(((etoiles - min) / (max - min)) * 100));
    const reste = max - etoiles;
    document.getElementById("maison-prog-label").textContent =
      `${reste} ⭐ pour devenir ${RENARD_STADES[stade + 1].nom}`;
    document.getElementById("maison-barre-remplie").style.width = pct + "%";
  } else {
    document.getElementById("maison-prog-label").textContent = "🏆 Stade maximum atteint !";
    document.getElementById("maison-barre-remplie").style.width = "100%";
  }

  function majJaugeEl(barreId, valId, val) {
    document.getElementById(barreId).style.width = val + "%";
    document.getElementById(valId).textContent = Math.round(val) + "%";
  }
  majJaugeEl("jauge-faim-barre",    "jauge-faim-val",    faim);
  majJaugeEl("jauge-bonheur-barre", "jauge-bonheur-val", bonheur);

  const reste = stade < 4 ? seuils[stade + 1] - etoiles : null;
  const retourJours = joursDepuisDerniereVisite();
  const anniversaire = estAnniversaireRenard();
  majBulle(faim, bonheur, nom, { streak: lireStreak(), reste, retourJours, anniversaire });
  marquerVisite();
  renderSegments("tama-faim-segments",    faim);
  renderSegments("tama-bonheur-segments", bonheur);

  const conseilEl = document.getElementById("maison-conseil");
  if (conseilEl) {
    const last = lireDernierJeuMenu();
    const tip = last ? ligneAccrocheMenu(last) : null;
    if (tip) conseilEl.textContent = tip;
    else if (triste) {
      conseilEl.textContent = estGrand()
        ? `${nom} a besoin de douceur : joue un peu ou offre un câlin.`
        : `${nom} veut un câlin ou une petite partie ! 🦊`;
    } else {
      conseilEl.textContent = estGrand()
        ? "Varie les jeux pour progresser partout."
        : "Essaie un jeu que tu n'as pas fait depuis longtemps ! ⭐";
    }
    conseilEl.hidden = false;
  }

  const mr = document.getElementById("maison-renard");
  if (mr && mr.dataset.amTap !== "1") {
    mr.dataset.amTap = "1";
    mr.addEventListener("click", () => {
      mr.classList.remove("maison-renard--wiggle");
      void mr.offsetWidth;
      mr.classList.add("maison-renard--wiggle");
    });
  }

  const btnNourrir = document.getElementById("btn-nourrir");
  btnNourrir.disabled = faim >= 95;
  btnNourrir.onclick = () => ouvrirNourrir(montrerMenuFn);

  const btnBalle = document.getElementById("btn-balle");
  if (btnBalle) {
    btnBalle.disabled = bonheur >= 98;
    btnBalle.onclick = () => jouerBalle(montrerMenuFn);
  }

  const btnCalin = document.getElementById("btn-calin");
  const peutCalin = peutFaireCalin();
  btnCalin.disabled = !peutCalin;
  document.getElementById("calin-dispo-label").textContent =
    peutCalin ? "1× par jour" : "✓ Déjà fait !";
  btnCalin.onclick = () => {
    if (!peutFaireCalin()) return;
    flotterEmoji("❤️", btnCalin);
    localStorage.setItem(RENARD_CALIN_DATE_KEY, localDate());
    sauverBonheur(lireBonheur() + 20);
    mettreAJourRenardHeader();
    montrerMaison(montrerMenuFn);
  };

  const btnJouer = document.getElementById("btn-jouer-tama");
  if (btnJouer) {
    btnJouer.onclick = () => { montrerMenuFn(); };
  }

  const conteneur = elMaison.querySelector(".maison-conteneur");
  if (conteneur) afficherContexteHistoireMaison(conteneur);

  const decorRow = document.getElementById("maison-decor-row");
  if (decorRow) {
    const decor = lireDecor();
    const items = Object.keys(decor).filter((id) => decor[id] && DECOR_DEF[id]);
    decorRow.innerHTML = items.map((id) => `<span class="maison-decor-item">${DECOR_DEF[id].emoji}</span>`).join("");
    decorRow.hidden = items.length === 0;
  }

  const annivEl = document.getElementById("maison-anniv");
  if (annivEl) {
    if (estAnniversaireRenard()) {
      const age = ageAnneesRenard();
      annivEl.textContent = `🎂 ${nom} a ${age} an${age > 1 ? "s" : ""} aujourd'hui ! Joyeux anniversaire !`;
      annivEl.hidden = false;
      marquerAnniversaireFete();
      confetti({ tier: "burst" });
    } else {
      annivEl.hidden = true;
    }
  }

  majCoffre(montrerMenuFn);
}

// ── Coffre à trésors quotidien ────────────────────────────────────────────────
const COFFRE_RECOMPENSES = [
  { type: "etoiles", valeur: 2, txt: "🎁 +2 ⭐ !" },
  { type: "etoiles", valeur: 3, txt: "🎁 +3 ⭐ !" },
  { type: "etoiles", valeur: 5, txt: "🎁 Jackpot ! +5 ⭐ !" },
  { type: "faim",    valeur: 40, txt: "🎁 Un bon repas ! 🍎" },
  { type: "bonheur", valeur: 40, txt: "🎁 Un jouet rigolo ! 🎈" },
];

function majCoffre(montrerMenuFn) {
  const coffre = document.getElementById("maison-coffre");
  if (!coffre) return;
  const txt = document.getElementById("maison-coffre-txt");

  if (!coffreDispoAujourdhui()) {
    coffre.hidden = true;
    return;
  }
  coffre.hidden = false;
  coffre.disabled = false;
  coffre.classList.remove("maison-coffre--ouvert");
  if (txt) txt.textContent = "Cadeau du jour !";

  coffre.onclick = () => {
    if (!coffreDispoAujourdhui()) return;
    marquerCoffreOuvert();
    const r = COFFRE_RECOMPENSES[Math.floor(Math.random() * COFFRE_RECOMPENSES.length)];
    if (r.type === "etoiles") {
      _ajouterEtoilesBase(r.valeur);
    } else if (r.type === "faim") {
      sauverFaim(lireFaim() + r.valeur);
    } else {
      sauverBonheur(lireBonheur() + r.valeur);
    }
    if (txt) txt.textContent = r.txt;
    coffre.classList.add("maison-coffre--ouvert");
    coffre.disabled = true;
    sonAccessoire();
    confetti({ tier: "sparkle" });
    mettreAJourRenardHeader();
    setTimeout(() => montrerMaison(montrerMenuFn), 1400);
  };
}

// ── Nourrir : choix d'aliments ────────────────────────────────────────────────
export const ALIMENTS_DEF = {
  "carotte": { emoji: "🥕", nom: "Carotte", cout: 1, faim: 15, bonheur: 0,  reaction: "Crounch crounch ! 🥕" },
  "pomme":   { emoji: "🍎", nom: "Pomme",   cout: 2, faim: 30, bonheur: 0,  reaction: "Miam, bien croquant !" },
  "poisson": { emoji: "🐟", nom: "Poisson", cout: 3, faim: 40, bonheur: 5,  reaction: "Mon préféré ! 🐟" },
  "pizza":   { emoji: "🍕", nom: "Pizza",   cout: 4, faim: 50, bonheur: 5,  reaction: "Une pizza ? Trop bon !" },
  "gateau":  { emoji: "🍰", nom: "Gâteau",  cout: 4, faim: 35, bonheur: 15, reaction: "Un délice sucré ! 😋" },
};

function fermerNourrir() {
  const ov = document.getElementById("nourrir-overlay");
  if (ov) ov.hidden = true;
}

function ouvrirNourrir(montrerMenuFn) {
  const ov = document.getElementById("nourrir-overlay");
  if (!ov) return;
  const nom = lireNomRenard() || "Foxy";
  const nomEl = document.getElementById("nourrir-nom");
  if (nomEl) nomEl.textContent = nom;

  if (ov.dataset.amWired !== "1") {
    ov.dataset.amWired = "1";
    const btnFermer = document.getElementById("nourrir-fermer");
    if (btnFermer) btnFermer.addEventListener("click", fermerNourrir);
    ov.addEventListener("click", (e) => { if (e.target === ov) fermerNourrir(); });
  }

  const grille = document.getElementById("nourrir-grille");
  grille.innerHTML = "";
  Object.entries(ALIMENTS_DEF).forEach(([id, def]) => {
    const carte = document.createElement("button");
    carte.type = "button";
    carte.className = "nourrir-aliment";
    carte.disabled = lireEtoiles() < def.cout;
    carte.setAttribute("aria-label", `${def.nom}, ${def.cout} étoiles`);
    carte.innerHTML = `<span class="nourrir-aliment-emoji">${def.emoji}</span>` +
      `<span class="nourrir-aliment-nom">${def.nom}</span>` +
      `<span class="nourrir-aliment-cout">${def.cout} ⭐</span>`;
    carte.addEventListener("click", () => {
      if (lireEtoiles() < def.cout) return;
      _ajouterEtoilesBase(-def.cout);
      sauverFaim(lireFaim() + def.faim);
      if (def.bonheur) sauverBonheur(lireBonheur() + def.bonheur);
      reagirRenard(def.reaction);
      fermerNourrir();
      mettreAJourRenardHeader();
      montrerMaison(montrerMenuFn);
    });
    grille.appendChild(carte);
  });

  ov.hidden = false;
}

function reagirRenard(message) {
  const bulle = document.getElementById("tama-bulle");
  if (bulle) bulle.textContent = message;
  const mr = document.getElementById("maison-renard");
  if (mr) {
    mr.classList.remove("maison-renard--wiggle");
    void mr.offsetWidth;
    mr.classList.add("maison-renard--wiggle");
  }
}

// ── Jouer à la balle (interaction libre) ──────────────────────────────────────
function jouerBalle(montrerMenuFn) {
  const mr = document.getElementById("maison-renard");
  if (mr) {
    const balle = document.createElement("div");
    balle.className = "balle-jouet";
    balle.textContent = "🎾";
    mr.appendChild(balle);
    mr.classList.remove("maison-renard--saute");
    void mr.offsetWidth;
    mr.classList.add("maison-renard--saute");
    setTimeout(() => balle.remove(), 900);
  }
  sauverBonheur(lireBonheur() + 8);
  reagirRenard("Ouaaah, la balle ! 🎾");
  mettreAJourRenardHeader();
  setTimeout(() => montrerMaison(montrerMenuFn), 950);
}

// ── Dressing screen ───────────────────────────────────────────────────────────
export function montrerDressing() {
  const elDressing = document.getElementById("ecran-dressing");
  if (!elDressing) return;
  revelerSeulEcran(elDressing);

  const stade    = getStade(lireEtoiles());
  const nom      = lireNomRenard() || "Foxy";
  const debloques = lireAccessoires();
  const tenue    = lireTenue();

  document.getElementById("dressing-sous-titre").textContent =
    `${nom} peut porter ${debloques.length} accessoire${debloques.length !== 1 ? "s" : ""} !`;

  document.getElementById("dressing-preview").innerHTML =
    svgRenard(stade, 120, { accessoires: Object.keys(tenue) });

  const couleurs = document.getElementById("dressing-couleurs");
  if (couleurs) {
    const choisie = lireCouleur();
    couleurs.innerHTML = "";
    Object.entries(COULEUR_DEF).forEach(([id, def]) => {
      const swatch = document.createElement("button");
      swatch.type = "button";
      swatch.className = "dressing-couleur" + (id === choisie ? " active" : "");
      swatch.style.background = def.apercu;
      swatch.title = def.nom;
      swatch.setAttribute("aria-label", def.nom);
      swatch.setAttribute("aria-pressed", id === choisie ? "true" : "false");
      swatch.addEventListener("click", () => {
        sauverCouleur(id);
        mettreAJourRenardHeader();
        montrerDressing();
      });
      couleurs.appendChild(swatch);
    });
  }

  const grille = document.getElementById("dressing-grille");
  grille.innerHTML = "";
  Object.entries(ACCESSOIRES_DEF).forEach(([id, def]) => {
    const debloque = debloques.includes(id);
    const equipe   = id in tenue;
    const carte = document.createElement("button");
    carte.type = "button";
    carte.className = "dressing-carte" + (equipe ? " equipe" : "") + (debloque ? "" : " verrouille");
    carte.innerHTML = `
      <div style="line-height:0">${svgRenard(stade, 80, { accessoires: [id] })}</div>
      <span class="dressing-carte-nom">${def.nom}</span>
      <span class="dressing-carte-badge">${equipe ? "✓ Équipé" : (debloque ? "Disponible" : "🔒 Verrouillé")}</span>`;
    if (debloque) {
      carte.addEventListener("click", () => {
        const t = lireTenue();
        if (id in t) { delete t[id]; } else { t[id] = true; }
        sauverTenue(t);
        mettreAJourRenardHeader();
        montrerDressing();
      });
    }
    grille.appendChild(carte);
  });
}

// ── Décoration screen ────────────────────────────────────────────────────────
export function montrerDecor() {
  const elDecor = document.getElementById("ecran-decor");
  if (!elDecor) return;
  revelerSeulEcran(elDecor);

  const etoiles = lireEtoiles();
  const decor = lireDecor();

  document.getElementById("decor-sous-titre").textContent =
    `Tu as ${etoiles} ⭐ — décore la maison de ${lireNomRenard() || "Foxy"} !`;

  const grille = document.getElementById("decor-grille");
  grille.innerHTML = "";
  Object.entries(DECOR_DEF).forEach(([id, def]) => {
    const possede = !!decor[id];
    const carte = document.createElement("button");
    carte.type = "button";
    carte.className = "dressing-carte" + (possede ? " equipe" : "");
    carte.innerHTML = `
      <span class="decor-carte-emoji">${def.emoji}</span>
      <span class="dressing-carte-nom">${def.nom}</span>
      <span class="dressing-carte-badge">${possede ? "✓ Installé" : `${def.cout} ⭐`}</span>`;
    if (possede) {
      carte.addEventListener("click", () => {
        const d = lireDecor();
        delete d[id];
        sauverDecor(d);
        montrerDecor();
      });
    } else if (etoiles >= def.cout) {
      carte.addEventListener("click", () => {
        const e = lireEtoiles() - def.cout;
        localStorage.setItem(STORAGE_KEY, String(e));
        if (elTotal) elTotal.textContent = e;
        const d = lireDecor();
        d[id] = true;
        sauverDecor(d);
        sonAccessoire();
        confetti({ tier: "sparkle" });
        montrerDecor();
      });
    } else {
      carte.classList.add("verrouille");
    }
    grille.appendChild(carte);
  });
}
