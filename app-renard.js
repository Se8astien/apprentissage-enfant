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
  const s = RENARD_STADES[Math.max(0, Math.min(4, stade))];
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
function majBulle(faim, bonheur, nom) {
  const el = document.getElementById("tama-bulle");
  if (!el) return;
  let msg;
  if (faim < 20)         msg = "J'ai très faim ! 🍎";
  else if (bonheur < 20) msg = "Je m'ennuie ! 🎮";
  else if (faim < 40)    msg = "J'aurais bien mangé... 🍎";
  else if (bonheur < 40) msg = "Joue avec moi ! 🎮";
  else {
    const pool = ["Je t'aime ! 💜", "Je suis heureux !", "C'est magique ! ✨", `Merci ${nom} !`, "Quelle belle journée !"];
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

  majBulle(faim, bonheur, nom);
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
  btnNourrir.disabled = etoiles < 2 || faim >= 95;
  btnNourrir.onclick = () => {
    if (lireEtoiles() < 2) return;
    flotterEmoji("🍎", btnNourrir);
    const t = lireEtoiles() - 2;
    localStorage.setItem(STORAGE_KEY, String(t));
    elTotal.textContent = t;
    sauverFaim(lireFaim() + 30);
    mettreAJourRenardHeader();
    montrerMaison(montrerMenuFn);
  };

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
