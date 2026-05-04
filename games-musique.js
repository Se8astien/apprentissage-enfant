import {
  elTitre,
  elQuestion,
  elChoix,
  setBonneReponse,
  getBonneReponse,
  estCE1,
  estCE2,
  estCM1,
  estCM2,
  melanger,
  getDifficulte,
} from "./app-state.js";

import { apresReponse, apresReponseTexte } from "./app-nav.js";

const RYTHMES = [
  { motif: "🥁 👏 🥁 👏", bonne: 4, fausses: [3, 5, 6] },
  { motif: "🎵 🎵 ⏸️ 🎵", bonne: 3, fausses: [2, 4, 5] },
  { motif: "👏 👏 👏 ⏸️ 👏", bonne: 4, fausses: [3, 5, 6] },
  { motif: "🥁 ⏸️ 🥁 ⏸️ 🥁", bonne: 3, fausses: [2, 4, 5] },
  { motif: "🎵 🎵 🎵 🎵", bonne: 4, fausses: [3, 5, 6] },
  { motif: "👏 🥁 👏 🥁 👏", bonne: 5, fausses: [3, 4, 6] },
];

const NOTES_ORDRE = ["do", "re", "mi", "fa", "sol", "la", "si"];

const TEMPOS = [
  { bpm: 68, bonne: "lent", fausses: ["moyen", "rapide", "très rapide"] },
  { bpm: 84, bonne: "moyen", fausses: ["lent", "rapide", "très rapide"] },
  { bpm: 112, bonne: "rapide", fausses: ["lent", "moyen", "très rapide"] },
  { bpm: 140, bonne: "très rapide", fausses: ["lent", "moyen", "rapide"] },
  { bpm: 76, bonne: "lent", fausses: ["moyen", "rapide", "très rapide"] },
  { bpm: 98, bonne: "moyen", fausses: ["lent", "rapide", "très rapide"] },
];

export function lancerRythmeMagique() {
  elTitre.textContent = "🥁 Rythme magique";
  const diff = getDifficulte();
  const pool = diff === 0 ? RYTHMES.slice(0, 4) : diff === 1 ? RYTHMES.slice(0, 5) : RYTHMES;
  const item = pool[Math.floor(Math.random() * pool.length)];
  const options = melanger([item.bonne, ...item.fausses.slice(0, 3)]);
  setBonneReponse(options.indexOf(item.bonne));
  elQuestion.innerHTML =
    "<p style='font-size:0.92rem;margin-bottom:0.35rem'>Combien de sons entends-tu dans ce rythme ?</p>" +
    `<p style="font-size:1.45rem;font-weight:700;color:var(--primaire);margin:0">${item.motif}</p>`;
  elChoix.innerHTML = "";
  options.forEach((opt, idx) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn-choix";
    b.style.fontSize = "1rem";
    b.textContent = String(opt);
    b.dataset.valeur = String(idx);
    b.addEventListener("click", () => apresReponse(idx, b, getBonneReponse()));
    elChoix.appendChild(b);
  });
}

export function lancerNotesMelodie() {
  elTitre.textContent = "🎼 Notes mélodie";
  const diff = getDifficulte();
  const maxIndex = estCM2() ? 6 : estCM1() ? 5 : estCE2() ? 4 : estCE1() ? 3 : 2;
  const index = Math.floor(Math.random() * (maxIndex + 1));
  const note = NOTES_ORDRE[index];
  const questionType = diff === 0 ? "apres" : Math.random() < 0.5 ? "apres" : "avant";
  const bonneNote = questionType === "apres" ? NOTES_ORDRE[Math.min(index + 1, maxIndex)] : NOTES_ORDRE[Math.max(index - 1, 0)];
  const banque = NOTES_ORDRE.slice(0, maxIndex + 1).filter((n) => n !== bonneNote);
  const fausses = melanger(banque).slice(0, 3);
  const options = melanger([bonneNote, ...fausses]);
  setBonneReponse(bonneNote);
  const texteQuestion = questionType === "apres" ? "Quelle note vient après" : "Quelle note vient avant";
  elQuestion.innerHTML =
    `<p style="font-size:0.92rem;margin-bottom:0.35rem">${texteQuestion} <strong>${note}</strong> ?</p>` +
    "<p style='font-size:0.82rem;color:#888;margin:0'>Gammes : do re mi fa sol la si</p>";
  elChoix.innerHTML = "";
  options.forEach((opt) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn-choix";
    b.style.fontSize = "1rem";
    b.textContent = opt;
    b.dataset.valeur = opt;
    b.addEventListener("click", () => apresReponseTexte(opt, b, getBonneReponse()));
    elChoix.appendChild(b);
  });
}

export function lancerTempoSprint() {
  elTitre.textContent = "🎵 Tempo sprint";
  const diff = getDifficulte();
  const pool = diff === 0 ? TEMPOS.slice(0, 4) : diff === 1 ? TEMPOS.slice(0, 5) : TEMPOS;
  const item = pool[Math.floor(Math.random() * pool.length)];
  const options = melanger([item.bonne, ...item.fausses.slice(0, 3)]);
  setBonneReponse(item.bonne);
  elQuestion.innerHTML =
    "<p style='font-size:0.92rem;margin-bottom:0.35rem'>Comment est ce tempo ?</p>" +
    `<p style="font-size:1.2rem;font-weight:800;color:var(--primaire);margin:0">${item.bpm} BPM</p>`;
  elChoix.innerHTML = "";
  options.forEach((opt) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn-choix";
    b.style.fontSize = "0.98rem";
    b.textContent = opt;
    b.dataset.valeur = opt;
    b.addEventListener("click", () => apresReponseTexte(opt, b, getBonneReponse()));
    elChoix.appendChild(b);
  });
}
