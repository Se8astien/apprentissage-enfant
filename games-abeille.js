// games-abeille.js — L'abeille programmeuse (déplacement sur grille avec flèches)

import {
  elTitre,
  elQuestion,
  elChoix,
  getNiveauCourant,
  getDifficulte,
  setBonneReponse,
  getRepondu,
} from "./app-state.js";

import { apresReponse } from "./app-nav.js";

// La grille grandit avec la classe ET avec la difficulté (maîtrise dans la
// session) : un enfant à l'aise atteint 5×5, voire 6×6, même en CP.
const TAILLE_BASE = { cp: 3, ce1: 4, ce2: 4, cm1: 5, cm2: 5 };
const OBSTACLES_BASE = { cp: 0, ce1: 0, ce2: 1, cm1: 2, cm2: 3 };

function paramsPour(niveau, diff) {
  const base = TAILLE_BASE[niveau] ?? 3;
  const taille = Math.min(6, base + diff); // diff 0/1/2 → +0/+1/+2
  const distMin = Math.max(2, taille);
  const obstacles = (OBSTACLES_BASE[niveau] ?? 0) + (diff >= 2 ? 1 : 0);
  return { taille, distMin, obstacles };
}

const DIRECTIONS = {
  haut:   { dr: -1, dc: 0, fleche: "⬆️", nom: "Haut" },
  bas:    { dr: 1,  dc: 0, fleche: "⬇️", nom: "Bas" },
  gauche: { dr: 0,  dc: -1, fleche: "⬅️", nom: "Gauche" },
  droite: { dr: 0,  dc: 1,  fleche: "➡️", nom: "Droite" },
};

function cle(r, c) { return r + "," + c; }

function cheminExiste(taille, depart, but, obstacles) {
  const vus = new Set([cle(depart.r, depart.c)]);
  const file = [depart];
  while (file.length) {
    const p = file.shift();
    if (p.r === but.r && p.c === but.c) return true;
    for (const d of Object.values(DIRECTIONS)) {
      const nr = p.r + d.dr, nc = p.c + d.dc;
      if (nr < 0 || nc < 0 || nr >= taille || nc >= taille) continue;
      const k = cle(nr, nc);
      if (vus.has(k) || obstacles.has(k)) continue;
      vus.add(k);
      file.push({ r: nr, c: nc });
    }
  }
  return false;
}

function genererPuzzle(params) {
  const { taille, distMin, obstacles: nbObstacles } = params;
  for (let essai = 0; essai < 60; essai++) {
    const depart = { r: Math.floor(Math.random() * taille), c: Math.floor(Math.random() * taille) };
    const but = { r: Math.floor(Math.random() * taille), c: Math.floor(Math.random() * taille) };
    const dist = Math.abs(depart.r - but.r) + Math.abs(depart.c - but.c);
    if (dist < distMin) continue;

    const obstacles = new Set();
    let tentatives = 0;
    while (obstacles.size < nbObstacles && tentatives < 30) {
      tentatives++;
      const r = Math.floor(Math.random() * taille);
      const c = Math.floor(Math.random() * taille);
      const k = cle(r, c);
      if ((r === depart.r && c === depart.c) || (r === but.r && c === but.c)) continue;
      obstacles.add(k);
    }

    if (cheminExiste(taille, depart, but, obstacles)) {
      return { taille, depart, but, obstacles };
    }
  }
  // Repli garanti solvable sans obstacle
  return {
    taille,
    depart: { r: 0, c: 0 },
    but: { r: taille - 1, c: taille - 1 },
    obstacles: new Set(),
  };
}

export function lancerAbeille() {
  elTitre.textContent = "🐝 L'abeille programmeuse";
  const niveau = getNiveauCourant();
  const params = paramsPour(niveau, getDifficulte());
  const puzzle = genererPuzzle(params);
  setBonneReponse(1);

  const programme = [];
  let position = { ...puzzle.depart };
  let enCours = false;

  elQuestion.innerHTML = `
    <p class="abeille-consigne">Programme les flèches pour amener l'abeille 🐝 jusqu'à la ruche 🍯 !</p>
    <div class="abeille-grille" id="abeille-grille"></div>
    <div class="abeille-programme" id="abeille-programme" aria-label="Programme de l'abeille"></div>
    <div class="abeille-commandes" id="abeille-commandes"></div>
  `;

  const grilleEl = elQuestion.querySelector("#abeille-grille");
  const progEl = elQuestion.querySelector("#abeille-programme");
  const cmdEl = elQuestion.querySelector("#abeille-commandes");

  grilleEl.style.gridTemplateColumns = `repeat(${puzzle.taille}, 1fr)`;

  function dessinerGrille() {
    grilleEl.innerHTML = "";
    for (let r = 0; r < puzzle.taille; r++) {
      for (let c = 0; c < puzzle.taille; c++) {
        const cell = document.createElement("div");
        cell.className = "abeille-case";
        const k = cle(r, c);
        if (position.r === r && position.c === c) {
          cell.textContent = "🐝";
          cell.classList.add("abeille-ici");
        } else if (puzzle.but.r === r && puzzle.but.c === c) {
          cell.textContent = "🍯";
        } else if (puzzle.obstacles.has(k)) {
          cell.textContent = "🌵";
          cell.classList.add("abeille-obstacle");
        }
        grilleEl.appendChild(cell);
      }
    }
  }

  function dessinerProgramme() {
    progEl.innerHTML = programme.length
      ? programme.map(d => `<span class="abeille-pas">${DIRECTIONS[d].fleche}</span>`).join("")
      : `<span class="abeille-prog-vide">Ajoute des flèches…</span>`;
  }

  function ajouter(dir) {
    if (enCours || getRepondu()) return;
    programme.push(dir);
    dessinerProgramme();
  }

  function effacer() {
    if (enCours || getRepondu()) return;
    programme.pop();
    dessinerProgramme();
  }

  function reinitialiser() {
    if (enCours || getRepondu()) return;
    programme.length = 0;
    position = { ...puzzle.depart };
    dessinerProgramme();
    dessinerGrille();
  }

  cmdEl.innerHTML = "";
  ["haut", "bas", "gauche", "droite"].forEach(dir => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "abeille-fleche";
    b.textContent = DIRECTIONS[dir].fleche;
    b.setAttribute("aria-label", DIRECTIONS[dir].nom);
    b.addEventListener("click", () => ajouter(dir));
    cmdEl.appendChild(b);
  });
  const bEffacer = document.createElement("button");
  bEffacer.type = "button";
  bEffacer.className = "abeille-fleche abeille-effacer";
  bEffacer.textContent = "↩️";
  bEffacer.setAttribute("aria-label", "Effacer la dernière flèche");
  bEffacer.addEventListener("click", effacer);
  cmdEl.appendChild(bEffacer);

  const bReset = document.createElement("button");
  bReset.type = "button";
  bReset.className = "abeille-fleche abeille-reset";
  bReset.textContent = "🔄";
  bReset.setAttribute("aria-label", "Tout recommencer");
  bReset.addEventListener("click", reinitialiser);
  cmdEl.appendChild(bReset);

  dessinerGrille();
  dessinerProgramme();

  // Bouton Vérifier (dans la zone de choix pour le scoring standard)
  elChoix.innerHTML = "";
  const btnVerifier = document.createElement("button");
  btnVerifier.type = "button";
  btnVerifier.className = "btn-choix abeille-verifier";
  btnVerifier.dataset.valeur = "1";
  btnVerifier.textContent = "▶️ Vérifier le trajet";
  elChoix.appendChild(btnVerifier);

  btnVerifier.addEventListener("click", () => {
    if (enCours || getRepondu()) return;
    if (programme.length === 0) return;
    enCours = true;
    position = { ...puzzle.depart };
    dessinerGrille();

    let i = 0;
    let echoue = false;
    const timer = setInterval(() => {
      if (i >= programme.length || echoue) {
        clearInterval(timer);
        enCours = false;
        const reussi = !echoue && position.r === puzzle.but.r && position.c === puzzle.but.c;
        apresReponse(reussi ? 1 : 0, btnVerifier, 1);
        return;
      }
      const d = DIRECTIONS[programme[i]];
      const nr = position.r + d.dr;
      const nc = position.c + d.dc;
      if (nr < 0 || nc < 0 || nr >= puzzle.taille || nc >= puzzle.taille || puzzle.obstacles.has(cle(nr, nc))) {
        echoue = true;
        grilleEl.classList.add("abeille-secousse");
        setTimeout(() => grilleEl.classList.remove("abeille-secousse"), 400);
      } else {
        position = { r: nr, c: nc };
        dessinerGrille();
      }
      i++;
    }, 420);
  });
}
