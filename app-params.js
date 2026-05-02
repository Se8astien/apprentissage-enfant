// app-params.js — Espace parents PIN-protégé

import { effacerDonneesProfilCourant } from "./app-profils.js";
import { escapeHtml } from "./app-state.js";

const PIN_CLE = "parent-pin";
const MASQUES_CLE = "jeux-masques";

function labelJeu(id) {
  const el = document.querySelector(`.carte-jeu[data-jeu="${id}"]`);
  const nom = el?.querySelector(".nom-jeu")?.textContent?.trim();
  return nom || id;
}

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
  overlay.innerHTML = creerPinHtml(pin ? "Code parent" : "Créer un code parent", pin ? "Valider" : "Enregistrer");
  document.body.appendChild(overlay);
  brancherPin(overlay, pin, onFermer);
}

function creerPinHtml(titre, label) {
  return `<div class="evolution-carte params-carte params-pin-card">
  <header class="params-pin-head">
    <p class="params-kicker">Accès protégé</p>
    <h2 class="params-titre">${escapeHtml(titre)}</h2>
    <p class="params-pin-desc">4 chiffres — évite que l'enfant change les réglages tout seul.</p>
  </header>
  <p class="pin-dots" aria-live="polite">○○○○</p>
  <p class="pin-msg" role="alert"></p>
  <div class="pin-grille">
    ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button type="button" class="btn-pin-num" data-n="${n}">${n}</button>`).join("")}
    <button type="button" class="btn-pin-del" aria-label="Effacer une case">⌫</button>
    <button type="button" class="btn-pin-num" data-n="0">0</button>
    <button type="button" class="btn-pin-valider">${escapeHtml(label)}</button>
  </div>
  <button type="button" class="btn-pin-fermer">Annuler</button>
</div>`;
}

function brancherPin(overlay, pinExistant, onFermer) {
  const dots = overlay.querySelector(".pin-dots");
  const msg = overlay.querySelector(".pin-msg");
  const btnVal = overlay.querySelector(".btn-pin-valider");
  const btnFerm = overlay.querySelector(".btn-pin-fermer");
  let saisi = "";

  overlay.querySelectorAll(".btn-pin-num").forEach((b) => {
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
    if (saisi.length < 4) { msg.textContent = "Tape 4 chiffres."; return; }
    if (!pinExistant || saisi === pinExistant) {
      if (!pinExistant) localStorage.setItem(PIN_CLE, saisi);
      overlay.innerHTML = creerSettingsHtml();
      brancherSettings(overlay, onFermer);
    } else {
      msg.textContent = "Ce n'est pas le bon code.";
      saisi = "";
      dots.textContent = "○○○○";
    }
  });

  btnFerm.addEventListener("click", () => { overlay.remove(); if (onFermer) onFermer(); });
  overlay.addEventListener("click", (e) => { if (e.target === overlay) { overlay.remove(); if (onFermer) onFermer(); } });
}

function creerSettingsHtml() {
  const stats = lireStats();
  const resume = lireResumeParent(stats);
  const reco = lireRecommandations(stats);
  const recoDetail = lireRecommandationsDetaillees(stats);
  const lignes = Object.entries(stats)
    .filter(([, s]) => s.total > 0)
    .sort((a, b) => (b[1].total || 0) - (a[1].total || 0))
    .map(([jeu, s]) => {
      const nom = labelJeu(jeu);
      const pct = Math.round((s.bonnes / s.total) * 100);
      return `<li class="params-stat-row">
        <span class="params-stat-nom">${escapeHtml(nom)}</span>
        <span class="params-stat-val">${pct}%</span>
        <span class="params-stat-sub">${s.bonnes}/${s.total}</span>
      </li>`;
    })
    .join("") || "<li class=\"params-stat-vide\">Pas encore assez de parties pour un détail.</li>";

  const recoAffiche = reco.map((r) => (r === "Continuer les jeux variés" ? r : labelJeu(r)));

  return `<div class="evolution-carte params-carte params-shell">
  <header class="params-head">
    <p class="params-kicker">Pour les parents</p>
    <h2 class="params-titre params-titre--lg">Espace parents</h2>
    <p class="params-lead">Suivi, conseils et réglages pour ce profil sur cet appareil.</p>
  </header>

  <div class="params-tabs" role="tablist" aria-label="Rubriques">
    <button type="button" class="params-tab is-active" data-panel="vue" role="tab" aria-selected="true">Vue d’ensemble</button>
    <button type="button" class="params-tab" data-panel="conseils" role="tab" aria-selected="false">Conseils</button>
    <button type="button" class="params-tab" data-panel="jeux" role="tab" aria-selected="false">Jeux affichés</button>
    <button type="button" class="params-tab" data-panel="compte" role="tab" aria-selected="false">Compte</button>
  </div>

  <div class="params-panels">
    <section class="params-panel is-active" data-panel="vue" role="tabpanel">
      <div class="params-kpi-grid">
        <div class="params-kpi">
          <span class="params-kpi-val">${resume.temps}</span>
          <span class="params-kpi-lbl">minutes estimées</span>
        </div>
        <div class="params-kpi">
          <span class="params-kpi-val">${resume.reussite}<span class="params-kpi-unit">%</span></span>
          <span class="params-kpi-lbl">réussite moyenne</span>
        </div>
      </div>
      <p class="params-mini">${escapeHtml(resume.topJeux)}</p>
      <div class="params-callout">
        <span class="params-callout-ico">🎯</span>
        <div>
          <strong>À renforcer</strong>
          <p class="params-callout-txt">${recoAffiche.map((x) => escapeHtml(x)).join(", ")}</p>
        </div>
      </div>
      <h3 class="params-subtitre">Détail par jeu</h3>
      <ul class="params-stat-list">${lignes}</ul>
    </section>

    <section class="params-panel" data-panel="conseils" role="tabpanel" hidden>
      <p class="params-hint-block">Idées courtes, à adapter au rythme de l’enfant.</p>
      <ul class="params-conseils-list">
        ${recoDetail.map((txt) => `<li class="params-conseil-item">${txt}</li>`).join("")}
      </ul>
    </section>

    <section class="params-panel params-panel--jeux" data-panel="jeux" role="tabpanel" hidden>
      <p class="params-hint-block">Désactivé = le jeu disparaît du menu pour l’enfant. Tu peux le réactiver ici.</p>
      <div id="params-jeux-liste" class="params-jeux-liste"></div>
    </section>

    <section class="params-panel" data-panel="compte" role="tabpanel" hidden>
      <div class="params-danger-intro">
        <span class="params-danger-ico">⚠️</span>
        <p><strong>Zone sensible.</strong> Ces actions touchent le profil actuel sur cet appareil.</p>
      </div>
      <div class="params-actions">
        <button type="button" class="btn-params-action btn-params-reset">Remettre les étoiles à zéro</button>
        <button type="button" class="btn-params-action btn-params-effacer">Effacer toute la progression (ce profil)</button>
        <button type="button" class="btn-params-action btn-params-pin">Changer le code parent</button>
      </div>
    </section>
  </div>

  <button type="button" class="btn-params-fermer">Fermer</button>
</div>`;
}

function lireStats() {
  try { return JSON.parse(localStorage.getItem("stats-questions")) || {}; }
  catch { return {}; }
}

function lireResumeParent(stats) {
  const entries = Object.entries(stats).filter(([, s]) => s.total > 0);
  if (entries.length === 0) return { temps: 0, reussite: 0, topJeux: "Encore peu de parties — continue comme ça !" };
  const totalQ = entries.reduce((acc, [, s]) => acc + s.total, 0);
  const totalBonnes = entries.reduce((acc, [, s]) => acc + s.bonnes, 0);
  const topJeux = entries
    .sort((a, b) => (b[1].total || 0) - (a[1].total || 0))
    .slice(0, 3)
    .map(([jeu]) => labelJeu(jeu))
    .join(" · ");
  return {
    temps: Math.round(totalQ * 0.5),
    reussite: Math.round((totalBonnes / totalQ) * 100),
    topJeux: `Jeux les plus joués : ${topJeux}`,
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
  if (!entries.length) return ["Varie les jeux pour repérer où l’enfant a le plus besoin d’aide."];
  return entries.map(({ jeu, taux, total }) => {
    const nom = escapeHtml(labelJeu(jeu));
    if (taux < 55) return `<strong>${nom}</strong> (${taux}% sur ${total} questions) : viser 5 min par jour en débutant cette semaine.`;
    if (taux < 70) return `<strong>${nom}</strong> (${taux}% sur ${total} questions) : petites sessions de révision, souvent courtes.`;
    return `<strong>${nom}</strong> (${taux}% sur ${total} questions) : consolider avec une session courte de temps en temps.`;
  });
}

function brancherSettings(overlay, onFermer) {
  overlay.querySelectorAll(".params-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const id = tab.dataset.panel;
      overlay.querySelectorAll(".params-tab").forEach((t) => {
        const on = t === tab;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });
      overlay.querySelectorAll(".params-panel").forEach((p) => {
        const on = p.dataset.panel === id;
        p.classList.toggle("is-active", on);
        p.hidden = !on;
      });
    });
  });

  const masques = getMasques();
  const liste = overlay.querySelector("#params-jeux-liste");
  if (liste) {
    const jeux = [...document.querySelectorAll(".carte-jeu[data-jeu]")].map((b) => ({
      id: b.dataset.jeu,
      nom: b.querySelector(".nom-jeu")?.textContent || b.dataset.jeu,
    }));
    liste.innerHTML = jeux.map((j) => `<label class="params-switch">
      <input type="checkbox" class="params-check" data-jeu="${j.id}"${masques.includes(j.id) ? "" : " checked"}>
      <span class="params-switch-track" aria-hidden="true"><span class="params-switch-thumb"></span></span>
      <span class="params-switch-label">${escapeHtml(j.nom)}</span>
    </label>`).join("");
    liste.querySelectorAll(".params-check").forEach((cb) => {
      cb.addEventListener("change", () => {
        const m = getMasques();
        if (cb.checked) {
          const i = m.indexOf(cb.dataset.jeu);
          if (i >= 0) m.splice(i, 1);
        } else if (!m.includes(cb.dataset.jeu)) m.push(cb.dataset.jeu);
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

  const btnEffacer = overlay.querySelector(".btn-params-effacer");
  if (btnEffacer) {
    btnEffacer.addEventListener("click", () => {
      if (!confirm(
        "Effacer toute la progression de ce profil (étoiles, badges, stats, missions, maîtrise, file analytics locale) ?\n" +
          "Les réglages (thème, sons, consentement, code parent, jeux masqués) seront conservés."
      )) return;
      effacerDonneesProfilCourant();
      overlay.remove();
      location.reload();
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
  overlay.addEventListener("click", (e) => { if (e.target === overlay) { overlay.remove(); if (onFermer) onFermer(); } });
}
