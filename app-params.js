// app-params.js — Espace parents PIN-protégé

const PIN_CLE     = "parent-pin";
const MASQUES_CLE = "jeux-masques";

export function getMasques() {
  try { return JSON.parse(localStorage.getItem(MASQUES_CLE)) || []; }
  catch { return []; }
}

function saveMasques(m) {
  localStorage.setItem(MASQUES_CLE, JSON.stringify(m));
}

export function montrerParams(onFermer) {
  const pin = localStorage.getItem(PIN_CLE);
  const overlay = document.createElement("div");
  overlay.className = "evolution-overlay params-overlay";
  overlay.innerHTML = creerPinHtml(pin ? "Espace parents 🔒" : "Créez un code parent", pin ? "Entrer" : "Définir");
  document.body.appendChild(overlay);
  brancherPin(overlay, pin, onFermer);
}

function creerPinHtml(titre, label) {
  return `<div class="evolution-carte params-carte">
  <h2 class="params-titre">${titre}</h2>
  <p class="pin-dots" aria-live="polite">○○○○</p>
  <p class="pin-msg" role="alert"></p>
  <div class="pin-grille">
    ${[1,2,3,4,5,6,7,8,9].map(n => `<button type="button" class="btn-pin-num" data-n="${n}">${n}</button>`).join("")}
    <button type="button" class="btn-pin-del" aria-label="Effacer">⌫</button>
    <button type="button" class="btn-pin-num" data-n="0">0</button>
    <button type="button" class="btn-pin-valider">${label}</button>
  </div>
  <button type="button" class="btn-pin-fermer">Fermer</button>
</div>`;
}

function brancherPin(overlay, pinExistant, onFermer) {
  const dots    = overlay.querySelector(".pin-dots");
  const msg     = overlay.querySelector(".pin-msg");
  const btnVal  = overlay.querySelector(".btn-pin-valider");
  const btnFerm = overlay.querySelector(".btn-pin-fermer");
  let saisi = "";

  overlay.querySelectorAll(".btn-pin-num").forEach(b => {
    b.addEventListener("click", () => {
      if (saisi.length >= 4) return;
      saisi += b.dataset.n;
      dots.textContent = "●".repeat(saisi.length) + "○".repeat(4 - saisi.length);
    });
  });

  overlay.querySelector(".btn-pin-del").addEventListener("click", () => {
    saisi = saisi.slice(0, -1);
    dots.textContent = "●".repeat(saisi.length) + "○".repeat(4 - saisi.length);
  });

  btnVal.addEventListener("click", () => {
    if (saisi.length < 4) { msg.textContent = "Entrez 4 chiffres."; return; }
    if (!pinExistant || saisi === pinExistant) {
      if (!pinExistant) localStorage.setItem(PIN_CLE, saisi);
      overlay.innerHTML = creerSettingsHtml();
      brancherSettings(overlay, onFermer);
    } else {
      msg.textContent = "Code incorrect.";
      saisi = "";
      dots.textContent = "○○○○";
    }
  });

  btnFerm.addEventListener("click", () => { overlay.remove(); if (onFermer) onFermer(); });
  overlay.addEventListener("click", e => { if (e.target === overlay) { overlay.remove(); if (onFermer) onFermer(); } });
}

function creerSettingsHtml() {
  const stats  = lireStats();
  const resume = lireResumeParent(stats);
  const reco = lireRecommandations(stats);
  const recoDetail = lireRecommandationsDetaillees(stats);
  const lignes = Object.entries(stats)
    .filter(([, s]) => s.total > 0)
    .map(([jeu, s]) => `<li><strong>${jeu}</strong> : ${Math.round(s.bonnes / s.total * 100)}% (${s.bonnes}/${s.total})</li>`)
    .join("") || "<li>Aucune partie jouée.</li>";
  return `<div class="evolution-carte params-carte params-content">
  <h2 class="params-titre">⚙️ Espace parents</h2>
  <details class="params-section" open>
    <summary>🧭 Résumé rapide</summary>
    <ul class="params-stats">
      <li><strong>Temps de jeu estimé</strong> : ${resume.temps} min</li>
      <li><strong>Réussite moyenne</strong> : ${resume.reussite}%</li>
      <li><strong>Top jeux</strong> : ${resume.topJeux}</li>
      <li><strong>À renforcer</strong> : ${reco.join(", ")}</li>
    </ul>
  </details>
  <details class="params-section" open>
    <summary>🎯 Conseils concrets</summary>
    <ul class="params-stats">
      ${recoDetail.map((txt) => `<li>${txt}</li>`).join("")}
    </ul>
  </details>
  <details class="params-section">
    <summary>📊 Statistiques par jeu</summary>
    <ul class="params-stats">${lignes}</ul>
  </details>
  <details class="params-section" open>
    <summary>🎮 Jeux visibles</summary>
    <p class="params-hint">Décochez pour masquer un jeu dans le menu.</p>
    <div id="params-jeux-liste"></div>
  </details>
  <details class="params-section">
    <summary>🔑 Sécurité &amp; reset</summary>
    <div class="params-actions">
      <button type="button" class="btn-params-action btn-params-reset">🗑️ Remettre les étoiles à zéro</button>
      <button type="button" class="btn-params-action btn-params-pin">🔑 Changer le code parent</button>
    </div>
  </details>
  <button type="button" class="btn-params-fermer">✓ Fermer</button>
</div>`;
}

function lireStats() {
  try { return JSON.parse(localStorage.getItem("stats-questions")) || {}; }
  catch { return {}; }
}

function lireResumeParent(stats) {
  const entries = Object.entries(stats).filter(([, s]) => s.total > 0);
  if (entries.length === 0) return { temps: 0, reussite: 0, topJeux: "Aucun" };
  const totalQ = entries.reduce((acc, [, s]) => acc + s.total, 0);
  const totalBonnes = entries.reduce((acc, [, s]) => acc + s.bonnes, 0);
  const topJeux = entries
    .sort((a, b) => (b[1].total || 0) - (a[1].total || 0))
    .slice(0, 3)
    .map(([jeu]) => jeu)
    .join(", ");
  return {
    temps: Math.round(totalQ * 0.5),
    reussite: Math.round((totalBonnes / totalQ) * 100),
    topJeux: topJeux || "Aucun",
  };
}

function lireRecommandations(stats) {
  const entries = Object.entries(stats)
    .filter(([, s]) => s.total >= 8)
    .map(([jeu, s]) => ({ jeu, taux: Math.round((s.bonnes / s.total) * 100) }))
    .sort((a, b) => a.taux - b.taux)
    .slice(0, 3)
    .map((x) => x.jeu);
  return entries.length ? entries : ["Continuer les jeux variés"];
}

function lireRecommandationsDetaillees(stats) {
  const entries = Object.entries(stats)
    .filter(([, s]) => s.total >= 8)
    .map(([jeu, s]) => ({ jeu, taux: Math.round((s.bonnes / s.total) * 100), total: s.total }))
    .sort((a, b) => a.taux - b.taux)
    .slice(0, 3);
  if (!entries.length) return ["Continuez à varier les jeux pour identifier les besoins."];
  return entries.map(({ jeu, taux, total }) => {
    if (taux < 55) return `<strong>${jeu}</strong> (${taux}% sur ${total} questions) : faire 5 min par jour en mode débutant cette semaine.`;
    if (taux < 70) return `<strong>${jeu}</strong> (${taux}% sur ${total} questions) : faire 3 mini sessions de révision ciblée.`;
    return `<strong>${jeu}</strong> (${taux}% sur ${total} questions) : consolider avec 1 session courte tous les 2 jours.`;
  });
}

function brancherSettings(overlay, onFermer) {
  const masques = getMasques();
  const liste   = overlay.querySelector("#params-jeux-liste");
  if (liste) {
    const jeux = [...document.querySelectorAll(".carte-jeu[data-jeu]")].map(b => ({
      id:  b.dataset.jeu,
      nom: b.querySelector(".nom-jeu")?.textContent || b.dataset.jeu,
    }));
    liste.innerHTML = jeux.map(j => `<label class="params-toggle">
      <input type="checkbox" class="params-check" data-jeu="${j.id}"${masques.includes(j.id) ? "" : " checked"}>
      <span>${j.nom}</span>
    </label>`).join("");
    liste.querySelectorAll(".params-check").forEach(cb => {
      cb.addEventListener("change", () => {
        const m = getMasques();
        if (cb.checked) { const i = m.indexOf(cb.dataset.jeu); if (i >= 0) m.splice(i, 1); }
        else if (!m.includes(cb.dataset.jeu)) m.push(cb.dataset.jeu);
        saveMasques(m);
      });
    });
  }

  const btnReset = overlay.querySelector(".btn-params-reset");
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      if (confirm("Remettre les étoiles à zéro pour ce profil ?")) {
        localStorage.setItem("maths-cp-etoiles", "0");
        overlay.remove();
        if (onFermer) onFermer();
      }
    });
  }

  const btnPin = overlay.querySelector(".btn-params-pin");
  if (btnPin) {
    btnPin.addEventListener("click", () => {
      localStorage.removeItem(PIN_CLE);
      overlay.remove();
      montrerParams(onFermer);
    });
  }

  const btnFerm = overlay.querySelector(".btn-params-fermer");
  if (btnFerm) btnFerm.addEventListener("click", () => { overlay.remove(); if (onFermer) onFermer(); });
  overlay.addEventListener("click", e => { if (e.target === overlay) { overlay.remove(); if (onFermer) onFermer(); } });
}
