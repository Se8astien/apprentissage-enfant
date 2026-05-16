// app-objectif-semaine.js — Objectif hebdomadaire choisi par l'enfant

const CLE = "am-objectif-semaine";

const OBJECTIFS = [
  { id: "additions",       emoji: "➕", texte: "Faire 30 additions",       jeu: "addition",        cible: 30 },
  { id: "multiplications", emoji: "✖️", texte: "Maîtriser les tables de ×", jeu: "multiplication",  cible: 25 },
  { id: "lecture",         emoji: "📖", texte: "Lire 20 textes",            jeu: "lectureTexte",    cible: 20 },
  { id: "polyvalent",      emoji: "🌟", texte: "Jouer à 5 jeux différents", jeu: null,              cible: 5  },
];

function semaineCourante() {
  const d = new Date();
  const j = d.getDay() || 7;
  const lundi = new Date(d);
  lundi.setDate(d.getDate() - j + 1);
  return lundi.toISOString().slice(0, 10);
}

function lire() {
  try { return JSON.parse(localStorage.getItem(CLE)) || null; }
  catch { return null; }
}

function sauver(data) {
  localStorage.setItem(CLE, JSON.stringify(data));
}

export function getObjectifSemaine() {
  const data = lire();
  if (!data || data.semaine !== semaineCourante()) return null;
  return data;
}

export function choisirObjectif(objectifId) {
  const obj = OBJECTIFS.find((o) => o.id === objectifId);
  if (!obj) return;
  sauver({ semaine: semaineCourante(), objectifId, texte: obj.texte, emoji: obj.emoji, jeu: obj.jeu, cible: obj.cible, progres: 0 });
}

export function progresserObjectif(jeuId) {
  const data = lire();
  if (!data || data.semaine !== semaineCourante()) return;
  const obj = OBJECTIFS.find((o) => o.id === data.objectifId);
  if (!obj) return;
  const match = obj.jeu === null || obj.jeu === jeuId;
  if (!match) return;
  data.progres = Math.min((data.progres || 0) + 1, data.cible);
  sauver(data);
  if (data.progres >= data.cible) {
    import("./app-gamification.js").then((m) => {
      if (m.debloquerBadge("objectif")) {
        const b = m.BADGES.find((x) => x.id === "objectif");
        if (b) m.afficherNotifBadge(b);
      }
    });
  }
}

export function afficherObjectifMenu() {
  const conteneur = document.getElementById("objectif-semaine-banner");
  if (!conteneur) return;
  const data = getObjectifSemaine();
  if (!data) {
    _afficherChoixObjectif(conteneur);
    return;
  }
  const pct = Math.min(100, Math.round((data.progres / data.cible) * 100));
  const termine = data.progres >= data.cible;
  conteneur.innerHTML = `
    <div class="objectif-semaine-banner">
      <span class="obj-emoji">${data.emoji}</span>
      <div class="obj-texte">
        <span class="obj-titre">${termine ? "✅ " : ""}${data.texte}</span>
        <span>${data.progres}/${data.cible} ${termine ? "— Objectif atteint !" : ""}</span>
        <div class="obj-barre-wrap"><div class="obj-barre" style="width:${pct}%"></div></div>
      </div>
    </div>
  `;
  conteneur.hidden = false;
}

function _afficherChoixObjectif(conteneur) {
  conteneur.innerHTML = `
    <div class="objectif-semaine-banner" style="flex-direction:column;align-items:flex-start;gap:0.5rem;">
      <span style="font-weight:700">🎯 Choisis ton objectif de la semaine :</span>
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
        ${OBJECTIFS.map((o) => `<button type="button" class="btn-choix-objectif" data-id="${o.id}" style="padding:0.4rem 0.8rem;border-radius:99px;border:2px solid white;background:rgba(255,255,255,0.25);color:white;font-weight:600;cursor:pointer;">${o.emoji} ${o.texte}</button>`).join("")}
      </div>
    </div>
  `;
  conteneur.hidden = false;
  conteneur.querySelectorAll(".btn-choix-objectif").forEach((btn) => {
    btn.addEventListener("click", () => {
      choisirObjectif(btn.dataset.id);
      afficherObjectifMenu();
    });
  });
}
