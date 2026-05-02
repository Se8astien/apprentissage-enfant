// app-params.js — Espace parents PIN-protégé

import { effacerDonneesProfilCourant } from "./app-profils.js";
import {
  escapeHtml,
  estMinuteurDisponible,
  lireChronoJeuActif,
  piegerFocus,
} from "./app-state.js";

const PIN_CLE = "parent-pin";
const MASQUES_CLE = "jeux-masques";

const ORDRE_CAT_JEUX = ["maths", "formes", "temps", "argent", "avance", "langage", "cm", "algo", "autre"];
const ENTETE_CAT_JEUX = {
  maths: { lib: "Maths", emoji: "🔢" },
  formes: { lib: "Formes & géométrie", emoji: "🔷" },
  temps: { lib: "Temps & mesures", emoji: "📅" },
  argent: { lib: "Monnaie", emoji: "🪙" },
  avance: { lib: "Calcul avancé", emoji: "✖️" },
  langage: { lib: "Français & langues", emoji: "📚" },
  cm: { lib: "Niveau CM", emoji: "🏆" },
  algo: { lib: "Logique & code", emoji: "🤖" },
  autre: { lib: "Autres", emoji: "🎮" },
};
const SS_PARENT_DEADLINE = "parent-unlock-deadline";
const PARENT_SKIP_PIN_MS = 10 * 60 * 1000;
const PARENT_IDLE_MS = 3 * 60 * 1000;

let focusOrigineParents = null;
let idDialogSeq = 0;

function trouverCartePiegeParents(overlay) {
  return overlay.querySelector(".params-shell, .params-pin-card") || overlay;
}

function nettoyerPiegeFocusPrincipalParents(overlay) {
  const el = overlay?._parentPiegeElt;
  if (el && overlay?._parentPiegeTrap) el.removeEventListener("keydown", overlay._parentPiegeTrap);
  if (overlay) {
    delete overlay._parentPiegeElt;
    delete overlay._parentPiegeTrap;
  }
}

function nettoyerPiegeFocusDialogParents(overlay) {
  const el = overlay?._dialogPiegeElt;
  if (el && overlay?._dialogPiegeTrap) el.removeEventListener("keydown", overlay._dialogPiegeTrap);
  if (overlay) {
    delete overlay._dialogPiegeElt;
    delete overlay._dialogPiegeTrap;
  }
}

function nettoyerPiegeFocusParentsTout(overlay) {
  nettoyerPiegeFocusDialogParents(overlay);
  nettoyerPiegeFocusPrincipalParents(overlay);
}

function installerPiegeFocusPrincipalParents(overlay, mode) {
  nettoyerPiegeFocusPrincipalParents(overlay);
  overlay._piegeParentsModeLast = mode;
  const carte = trouverCartePiegeParents(overlay);
  overlay._parentPiegeElt = carte;
  overlay._parentPiegeTrap = piegerFocus(carte);
  const delaiMs = mode === "pin" || mode === "settings" ? 70 : 0;
  setTimeout(() => {
    if (!overlay.isConnected) return;
    if (mode === "pin") carte.querySelector('.btn-pin-num[data-n="1"]')?.focus();
    else if (mode === "settings") carte.querySelector(".params-tab.is-active")?.focus();
  }, delaiMs);
}

function reafficherPiegeParentApresConfirm(hostOverlay) {
  if (
    !hostOverlay.isConnected ||
    hostOverlay.querySelector(".params-confirm-root") ||
    !hostOverlay.querySelector(".params-shell, .params-pin-card")
  ) return;
  const mode =
    hostOverlay._piegeParentsModeLast ||
    (hostOverlay.querySelector(".params-pin-card") ? "pin" : "settings");
  installerPiegeFocusPrincipalParents(hostOverlay, mode);
}

function restaurerFocusOrigineParents() {
  const el = focusOrigineParents;
  focusOrigineParents = null;
  if (!el?.isConnected) {
    document.getElementById("btn-params")?.focus();
    return;
  }
  try { el.focus(); } catch {
    document.getElementById("btn-params")?.focus();
  }
}

function corpsDialogTexte(txt) {
  return escapeHtml(String(txt)).replace(/\n/g, "<br>");
}

function ouvrirDialogueParent(hostOverlay, options) {
  const {
    titre,
    message,
    annulerLib = "Annuler",
    confirmerLib = "Confirmer",
    dangereux = false,
  } = options;
  return new Promise((resolve) => {
    let termine = false;

    const idTitre = `params-dialog-titre-${++idDialogSeq}`;
    const veil = document.createElement("div");
    veil.className = "params-confirm-root";
    veil.setAttribute("role", "presentation");

    const dlg = document.createElement("div");
    dlg.className = "params-confirm-carte";
    dlg.setAttribute("role", "dialog");
    dlg.setAttribute("aria-modal", "true");
    dlg.setAttribute("aria-labelledby", idTitre);
    dlg.innerHTML = `
  <h3 class="params-confirm-titre" id="${idTitre}">${escapeHtml(titre)}</h3>
  <p class="params-confirm-msg">${corpsDialogTexte(message)}</p>
  <div class="params-confirm-btns">
    <button type="button" class="btn-params-confirm-cancel">${escapeHtml(annulerLib)}</button>
    <button type="button" class="${dangereux ? "btn-params-confirm-risk" : "btn-params-confirm-ok"}">${escapeHtml(confirmerLib)}</button>
  </div>`;

    const fin = (oui) => {
      if (termine) return;
      termine = true;
      hostOverlay._confirmationFermeture = undefined;
      veil.removeEventListener("click", onBackdrop);
      if (veil.isConnected) veil.remove();
      nettoyerPiegeFocusDialogParents(hostOverlay);
      reafficherPiegeParentApresConfirm(hostOverlay);
      resolve(Boolean(oui));
    };

    function onBackdrop(e) {
      if (e.target === veil) fin(false);
    }

    hostOverlay._confirmationFermeture = () => fin(false);

    nettoyerPiegeFocusPrincipalParents(hostOverlay);
    nettoyerPiegeFocusDialogParents(hostOverlay);
    veil.appendChild(dlg);
    hostOverlay.appendChild(veil);
    veil.addEventListener("click", onBackdrop);
    hostOverlay._dialogPiegeElt = veil;
    hostOverlay._dialogPiegeTrap = piegerFocus(veil);

    dlg.querySelector(".btn-params-confirm-cancel")?.addEventListener("click", () => fin(false));
    dlg.querySelector(".btn-params-confirm-risk, .btn-params-confirm-ok")
      ?.addEventListener("click", () => fin(true));

    dlg.querySelector(".btn-params-confirm-cancel")?.focus();
  });
}

function normaliserPourFiltre(txt) {
  if (!txt || typeof txt !== "string") return "";
  try {
    return txt
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{M}/gu, "")
      .replace(/\s+/g, " ")
      .trim();
  } catch {
    return String(txt).toLowerCase().replace(/\s+/g, " ").trim();
  }
}

function nettoyerSessionParent() {
  sessionStorage.removeItem(SS_PARENT_DEADLINE);
}

function prolongerSessionParent() {
  sessionStorage.setItem(SS_PARENT_DEADLINE, String(Date.now() + PARENT_SKIP_PIN_MS));
}

function sessionParentEncoreValide() {
  const t = parseInt(sessionStorage.getItem(SS_PARENT_DEADLINE) || "0", 10);
  return t > Date.now();
}

function nettoyerRaccourcisParent(overlay) {
  if (overlay && overlay._parentEscCleanup) {
    overlay._parentEscCleanup();
    delete overlay._parentEscCleanup;
  }
}

function brancherEscapeParent(overlay, fermerComplet) {
  nettoyerRaccourcisParent(overlay);
  const onEsc = (e) => {
    if (e.key !== "Escape") return;
    if (!overlay.isConnected) return;
    if (overlay.querySelector(".params-confirm-root")) {
      e.preventDefault();
      if (overlay._confirmationFermeture) overlay._confirmationFermeture();
      return;
    }
    e.preventDefault();
    fermerComplet();
  };
  overlay._parentEscCleanup = () => document.removeEventListener("keydown", onEsc, true);
  document.addEventListener("keydown", onEsc, true);
}

function fermerOverlayParent(overlay, onFermer, opts = {}) {
  const { fromIdle = false } = opts;
  if (!overlay.isConnected) return;
  nettoyerRaccourcisParent(overlay);
  nettoyerPiegeFocusParentsTout(overlay);
  if (overlay._parentIdleClear) {
    overlay._parentIdleClear();
    delete overlay._parentIdleClear;
  }
  nettoyerSessionParent();
  overlay.remove();
  if (onFermer) onFermer();
  restaurerFocusOrigineParents();
  if (fromIdle) {
    try {
      const accueil = document.querySelector(".accueil");
      if (accueil) {
        const prev = accueil.textContent;
        accueil.textContent = "Espace parents fermé (inactivité).";
        setTimeout(() => { accueil.textContent = prev; }, 3500);
      }
    } catch { /* ignore */ }
  }
}

function brancherIdleParent(overlay, onFermer) {
  let idleTimer;
  const bump = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      fermerOverlayParent(overlay, onFermer, { fromIdle: true });
    }, PARENT_IDLE_MS);
  };
  overlay._parentIdleClear = () => {
    clearTimeout(idleTimer);
    delete overlay._parentIdleClear;
  };
  ["pointerdown", "keydown", "touchstart", "scroll"].forEach((ev) => {
    overlay.addEventListener(ev, bump, true);
  });
  bump();
}

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

export function montrerParams(onFermer, focusDepuisOuverture) {
  if (focusDepuisOuverture instanceof HTMLElement && focusDepuisOuverture.isConnected) {
    focusOrigineParents = focusDepuisOuverture;
  } else {
    focusOrigineParents =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
  }
  const pin = localStorage.getItem(PIN_CLE);
  const overlay = document.createElement("div");
  overlay.className = "evolution-overlay params-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  const peutSauterPin = pin && sessionParentEncoreValide();
  if (peutSauterPin) {
    overlay.setAttribute("aria-label", "Espace parents");
    overlay.innerHTML = creerSettingsHtml();
    document.body.appendChild(overlay);
    brancherSettings(overlay, onFermer);
    installerPiegeFocusPrincipalParents(overlay, "settings");
  } else {
    overlay.setAttribute("aria-label", "Accès sécurisé code parent");
    overlay.innerHTML = creerPinHtml(pin ? "Code parent" : "Créer un code parent", pin ? "Valider" : "Enregistrer");
    document.body.appendChild(overlay);
    brancherPin(overlay, pin, onFermer);
    installerPiegeFocusPrincipalParents(overlay, "pin");
  }
}

function creerPinHtml(titre, label) {
  return `<div class="evolution-carte params-carte params-pin-card">
  <button type="button" class="btn-params-close btn-params-close--pin" aria-label="Fermer">×</button>
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

function fermerSansIdle(overlay, onFermer) {
  nettoyerRaccourcisParent(overlay);
  nettoyerPiegeFocusParentsTout(overlay);
  nettoyerSessionParent();
  overlay.remove();
  if (onFermer) onFermer();
  restaurerFocusOrigineParents();
}

function brancherPin(overlay, pinExistant, onFermer) {
  const dots = overlay.querySelector(".pin-dots");
  const msg = overlay.querySelector(".pin-msg");
  const btnVal = overlay.querySelector(".btn-pin-valider");
  const btnFerm = overlay.querySelector(".btn-pin-fermer");
  const btnXi = overlay.querySelector(".btn-params-close");
  if (btnXi) btnXi.addEventListener("click", () => fermerSansIdle(overlay, onFermer));
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
      prolongerSessionParent();
      nettoyerRaccourcisParent(overlay);
      nettoyerPiegeFocusParentsTout(overlay);
      overlay.setAttribute("aria-label", "Espace parents");
      overlay.innerHTML = creerSettingsHtml();
      brancherSettings(overlay, onFermer);
      installerPiegeFocusPrincipalParents(overlay, "settings");
    } else {
      msg.textContent = "Ce n'est pas le bon code.";
      saisi = "";
      dots.textContent = "○○○○";
    }
  });

  btnFerm.addEventListener("click", () => fermerSansIdle(overlay, onFermer));
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) fermerSansIdle(overlay, onFermer);
  });
  brancherEscapeParent(overlay, () => fermerSansIdle(overlay, onFermer));
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
  <button type="button" class="btn-params-close" aria-label="Fermer">×</button>
  <header class="params-head">
    <p class="params-kicker">Pour les parents</p>
    <h2 class="params-titre params-titre--lg">Espace parents</h2>
    <p class="params-lead">Chaque onglet regroupe une chose précise : l’activité, des pistes, les jeux visibles au menu, puis le compte et le code.</p>
  </header>

  <div class="params-body">
  <nav class="params-tabs" role="tablist" aria-label="Rubriques">
    <button type="button" class="params-tab is-active" data-panel="vue" role="tab" aria-selected="true">Vue d’ensemble</button>
    <button type="button" class="params-tab" data-panel="conseils" role="tab" aria-selected="false">Conseils</button>
    <button type="button" class="params-tab" data-panel="jeux" role="tab" aria-selected="false">Jeux du menu</button>
    <button type="button" class="params-tab" data-panel="compte" role="tab" aria-selected="false">Compte</button>
  </nav>

  <div class="params-panels">
    <section class="params-panel is-active" data-panel="vue" role="tabpanel">
      <h3 class="params-section-title">Activité sur ce profil</h3>
      <div class="params-kpi-grid">
        <div class="params-kpi">
          <span class="params-kpi-val">${resume.temps}</span>
          <span class="params-kpi-lbl">Minutes estimées</span>
        </div>
        <div class="params-kpi">
          <span class="params-kpi-val">${resume.reussite}<span class="params-kpi-unit">%</span></span>
          <span class="params-kpi-lbl">Réussite moyenne</span>
        </div>
        <p class="params-kpi-hint" role="note">À titre indicatif (~30&nbsp;s par question en moyenne), pas un chronomètre exact.</p>
      </div>
      <p class="params-snippet">${escapeHtml(resume.topJeux)}</p>
      <div class="params-callout">
        <span class="params-callout-ico">🎯</span>
        <div>
          <strong>À suivre en priorité</strong>
          <p class="params-callout-txt">${recoAffiche.map((x) => escapeHtml(x)).join(", ")}</p>
        </div>
      </div>
      <div class="params-chrono-wrap" id="params-chrono-bloc" hidden>
      <h3 class="params-section-title params-section-title--chrono">Temps limite par question (CE1 et +)</h3>
      <label class="params-switch params-chrono-opt">
        <input type="checkbox" class="params-check params-chrono-cb" id="params-chrono-cb">
        <span class="params-switch-track" aria-hidden="true"><span class="params-switch-thumb"></span></span>
        <span class="params-switch-label">
          <strong>Activer le temps limité</strong>
          <span class="params-chrono-desc" id="params-chrono-desc">Identique au réglage temps du bandeau violet « Réglages » pour l’enfant. Désactivé&nbsp;: temps illimité (symbole ∞).</span>
        </span>
      </label>
      </div>
      <div class="params-menu-aide">
        <h4 class="params-menu-aide-titre">Repères&nbsp;: barre du haut pour l’enfant</h4>
        <ul class="params-menu-aide-list">
          <li><strong>Réglages (violet)</strong> — nuit, sons, temps par question au menu. L’option ci‑dessus synchronise cette dernière.</li>
          <li><strong>À côté</strong> — étoiles, série et changement de profil.</li>
        </ul>
      </div>
      <h3 class="params-subtitre">Détail par jeu</h3>
      <ul class="params-stat-list">${lignes}</ul>
    </section>

    <section class="params-panel" data-panel="conseils" role="tabpanel" hidden>
      <h3 class="params-section-title">Pistes personnalisées</h3>
      <p class="params-hint-block">Court et concret&nbsp;; adapte la durée et le jour au rythme de l’enfant.</p>
      <ul class="params-conseils-list">
        ${recoDetail.map((txt) => `<li class="params-conseil-item">${txt}</li>`).join("")}
      </ul>
    </section>

    <section class="params-panel params-panel--jeux" data-panel="jeux" role="tabpanel" hidden>
      <h3 class="params-section-title">Jeux affichés pour l’enfant</h3>
      <p class="params-hint-block params-hint-jeux">À droite de chaque ligne&nbsp;: interrupteur vert = <strong>dans le menu</strong>, gris = <strong>masqué</strong>. Recherche par nom ou tri <strong>A à Z</strong>.</p>
      <div class="params-jeux-barre">
        <div class="params-jeux-entete">
          <p class="params-jeux-resume" id="params-jeux-resume-compte" aria-live="polite"></p>
          <button type="button" class="btn-params-jeux-tout" id="btn-params-jeux-tout-visible">Tout afficher</button>
        </div>
        <div class="params-jeux-filtre-row">
          <input type="search" id="params-jeux-filtre" class="params-jeux-filtre-input" placeholder="Chercher un jeu…" autocomplete="off" enterkeyhint="search" aria-label="Chercher un jeu par nom">
          <button type="button" class="btn-params-jeux-tri" id="btn-params-jeux-tri-ordre" aria-pressed="false">A à Z</button>
        </div>
      </div>
      <p id="params-jeux-filtre-vide" class="params-jeux-filtre-vide" hidden>Aucun jeu ne correspond.</p>
      <div id="params-jeux-liste" class="params-jeux-liste"></div>
    </section>

    <section class="params-panel" data-panel="compte" role="tabpanel" hidden>
      <h3 class="params-section-title">Profil et code sur cet appareil</h3>
      <div class="params-danger-intro">
        <span class="params-danger-ico">⚠️</span>
        <p><strong>Actions sensibles.</strong> Elles touchent le profil utilisé tout de suite après la fermeture de cette fenêtre.</p>
      </div>
      <div class="params-actions">
        <button type="button" class="btn-params-action btn-params-reset">Remettre les étoiles à zéro</button>
        <button type="button" class="btn-params-action btn-params-effacer">Effacer toute la progression (ce profil)</button>
        <button type="button" class="btn-params-action btn-params-pin">Changer le code parent</button>
      </div>
    </section>
  </div>
  </div>

  <div class="params-footer-sheet">
    <button type="button" class="btn-params-fermer">Fermer</button>
  </div>
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

function syncEtiquetteVisibleLigneJeu(cb) {
  const row = cb.closest(".params-jeu-row");
  if (!row) return;
  const t = row.querySelector(".params-jeu-statut-txt");
  if (t) t.textContent = cb.checked ? "Visible" : "Masqué";
  row.classList.toggle("params-jeu-row--off", !cb.checked);
}

function majResumeJeuxParent(overlay) {
  const liste = overlay.querySelector("#params-jeux-liste");
  const out = overlay.querySelector("#params-jeux-resume-compte");
  if (!liste || !out) return;
  const cbs = liste.querySelectorAll(".params-check-jeu-vis");
  const total = cbs.length;
  let vis = 0;
  cbs.forEach((c) => { if (c.checked) vis++; });
  out.textContent = total
    ? `${vis} jeu${vis !== 1 ? "x" : ""} visible${vis !== 1 ? "s" : ""} sur ${total}`
    : "";
}

function jeuxPourListeParent() {
  return [...document.querySelectorAll(".carte-jeu[data-jeu]")].map((b) => ({
    id: b.dataset.jeu,
    nom: (b.querySelector(".nom-jeu")?.textContent || b.dataset.jeu).trim(),
    desc: (b.querySelector(".desc-jeu")?.textContent || "").trim(),
    cat: (b.dataset.cat || "autre").trim(),
    emoji: (b.querySelector(".emoji-jeu")?.textContent || "🎮").trim(),
  }));
}

function ligneJeuRowHtml(j, masques) {
  const vis = !masques.includes(j.id);
  const nomE = escapeHtml(j.nom);
  const descE = j.desc ? escapeHtml(j.desc) : "";
  const emE = escapeHtml(j.emoji);
  const idSafe = escapeHtml(j.id);
  const ariaNom = escapeHtml(j.nom);
  const filtreRaw = normaliserPourFiltre(`${j.nom} ${j.desc}`);
  const filtreEsc = escapeHtml(filtreRaw);
  return `<label class="params-jeu-row${vis ? "" : " params-jeu-row--off"}" data-filtre="${filtreEsc}">
  <span class="params-jeu-row-visuel">
    <span class="params-jeu-row-emoji" aria-hidden="true">${emE}</span>
    <span class="params-jeu-row-texte">
      <strong class="params-jeu-row-nom">${nomE}</strong>${descE ? `<span class="params-jeu-row-desc">${descE}</span>` : ""}
    </span>
  </span>
  <span class="params-jeu-row-action">
    <span class="params-jeu-statut" aria-hidden="true"><span class="params-jeu-statut-txt">${vis ? "Visible" : "Masqué"}</span></span>
    <input type="checkbox" class="params-check params-check-jeu-vis" data-jeu="${idSafe}" aria-label="Afficher ${ariaNom} dans le menu enfant"${vis ? " checked" : ""}>
    <span class="params-switch-track" aria-hidden="true"><span class="params-switch-thumb"></span></span>
  </span>
</label>`;
}

function htmlListeJeuxParCategorie(masques) {
  const jeux = jeuxPourListeParent();
  const byCat = {};
  jeux.forEach((j) => {
    const k = ORDRE_CAT_JEUX.includes(j.cat) ? j.cat : "autre";
    if (!byCat[k]) byCat[k] = [];
    byCat[k].push(j);
  });
  ORDRE_CAT_JEUX.forEach((k) => {
    if (byCat[k]) byCat[k].sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
  });
  const parts = [];
  for (const cat of ORDRE_CAT_JEUX) {
    const items = byCat[cat];
    if (!items?.length) continue;
    const meta = ENTETE_CAT_JEUX[cat] || ENTETE_CAT_JEUX.autre;
    const catSafe = escapeHtml(cat);
    const lignes = items.map((j) => ligneJeuRowHtml(j, masques)).join("");
    parts.push(`<section class="params-jeux-grp" data-cat="${catSafe}">
  <h4 class="params-jeux-grp-titre"><span class="params-jeux-grp-emoji" aria-hidden="true">${escapeHtml(meta.emoji)}</span> ${escapeHtml(meta.lib)}</h4>
  <div class="params-jeux-grp-liste">${lignes}</div>
</section>`);
  }
  return parts.join("");
}

function htmlListeJeuxAlpha(masques) {
  const jeux = [...jeuxPourListeParent()].sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
  const lignes = jeux.map((j) => ligneJeuRowHtml(j, masques)).join("");
  return `<div class="params-jeux-alpha-wrap">${lignes}</div>`;
}

function appliquerFiltreJeuxDansOverlay(overlay) {
  const liste = overlay.querySelector("#params-jeux-liste");
  const vide = overlay.querySelector("#params-jeux-filtre-vide");
  const input = overlay.querySelector("#params-jeux-filtre");
  if (!liste) return;
  const q = normaliserPourFiltre(input?.value || "");
  let visibles = 0;
  liste.querySelectorAll(".params-jeu-row").forEach((row) => {
    const hay = row.getAttribute("data-filtre") || "";
    const ok = !q || hay.includes(q);
    row.hidden = !ok;
    row.style.display = ok ? "" : "none";
    if (ok) visibles++;
  });
  liste.querySelectorAll(".params-jeux-grp").forEach((grp) => {
    const any = [...grp.querySelectorAll(".params-jeu-row")].some((r) => !r.hidden && r.style.display !== "none");
    grp.hidden = !any;
  });
  const wrapAlpha = liste.querySelector(".params-jeux-alpha-wrap");
  if (wrapAlpha) wrapAlpha.hidden = Boolean(q && visibles === 0);
  if (vide) {
    vide.hidden = !(q && visibles === 0);
  }
}

function brancherListeJeuxParent(overlay) {
  const liste = overlay.querySelector("#params-jeux-liste");
  const input = overlay.querySelector("#params-jeux-filtre");
  const btnTri = overlay.querySelector("#btn-params-jeux-tri-ordre");
  const btnToutVisible = overlay.querySelector("#btn-params-jeux-tout-visible");
  if (!liste) return;

  let modeTheme = true;

  const brancherCases = () => {
    liste.querySelectorAll(".params-check-jeu-vis").forEach((cb) => {
      cb.addEventListener("change", () => {
        const m = getMasques();
        if (cb.checked) {
          const i = m.indexOf(cb.dataset.jeu);
          if (i >= 0) m.splice(i, 1);
        } else if (!m.includes(cb.dataset.jeu)) m.push(cb.dataset.jeu);
        saveMasques(m);
        syncEtiquetteVisibleLigneJeu(cb);
        majResumeJeuxParent(overlay);
      });
    });
  };

  const renderListe = () => {
    const masques = getMasques();
    liste.innerHTML = modeTheme ? htmlListeJeuxParCategorie(masques) : htmlListeJeuxAlpha(masques);
    brancherCases();
    appliquerFiltreJeuxDansOverlay(overlay);
    majResumeJeuxParent(overlay);
    if (btnTri) {
      btnTri.textContent = modeTheme ? "A à Z" : "Par thème";
      btnTri.setAttribute("aria-pressed", modeTheme ? "false" : "true");
    }
  };

  input?.addEventListener("input", () => appliquerFiltreJeuxDansOverlay(overlay));
  btnTri?.addEventListener("click", () => {
    modeTheme = !modeTheme;
    const v = input?.value;
    renderListe();
    if (input && v != null) input.value = v;
    appliquerFiltreJeuxDansOverlay(overlay);
  });
  if (btnToutVisible) {
    btnToutVisible.addEventListener("click", () => {
      saveMasques([]);
      liste.querySelectorAll(".params-check-jeu-vis").forEach((cb) => {
        cb.checked = true;
        syncEtiquetteVisibleLigneJeu(cb);
      });
      majResumeJeuxParent(overlay);
    });
  }

  renderListe();
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

  const blocChrono = overlay.querySelector("#params-chrono-bloc");
  const cbChrono = overlay.querySelector("#params-chrono-cb");
  if (blocChrono && cbChrono) {
    if (estMinuteurDisponible()) {
      blocChrono.hidden = false;
      cbChrono.checked = lireChronoJeuActif();
      cbChrono.addEventListener("change", () => {
        import("./app-nav.js").then((m) => m.reglerMinuteurPourEnfant(cbChrono.checked));
      });
    } else {
      blocChrono.hidden = true;
    }
  }

  brancherListeJeuxParent(overlay);

  const btnReset = overlay.querySelector(".btn-params-reset");
  if (btnReset) {
    btnReset.addEventListener("click", async () => {
      const ok = await ouvrirDialogueParent(overlay, {
        titre: "Remettre les étoiles à zéro ?",
        message:
          "Les étoiles de ce profil repasseront à 0 pour cet appareil. Les autres progrès (badges, stats, missions…) ne sont pas modifiés par ce bouton.",
        annulerLib: "Annuler",
        confirmerLib: "Remettre à zéro",
        dangereux: true,
      });
      if (!ok) return;
      localStorage.setItem("maths-cp-etoiles", "0");
      fermerOverlayParent(overlay, onFermer);
    });
  }

  const btnEffacer = overlay.querySelector(".btn-params-effacer");
  if (btnEffacer) {
    btnEffacer.addEventListener("click", async () => {
      const ok = await ouvrirDialogueParent(overlay, {
        titre: "Tout effacer pour ce profil ?",
        message:
          "Cette action efface la progression du profil sur cet appareil : étoiles, badges, stats, missions, maîtrise, file d’analyse locale.\n\n" +
          "Les réglages (thème, sons, consentement, code parent, jeux masqués) restent. L’appli va se recharger.",
        annulerLib: "Non, garder",
        confirmerLib: "Oui, tout effacer",
        dangereux: true,
      });
      if (!ok) return;
      focusOrigineParents = null;
      effacerDonneesProfilCourant();
      if (overlay._parentIdleClear) overlay._parentIdleClear();
      nettoyerRaccourcisParent(overlay);
      nettoyerPiegeFocusParentsTout(overlay);
      nettoyerSessionParent();
      overlay.remove();
      location.reload();
    });
  }

  const btnPin = overlay.querySelector(".btn-params-pin");
  if (btnPin) {
    btnPin.addEventListener("click", async () => {
      const ok = await ouvrirDialogueParent(overlay, {
        titre: "Changer le code parent",
        message:
          "Tu vas créer et enregistrer un nouveau code à 4 chiffres.\n\n" +
          "L’ancien code ne sera plus valide après l’étape suivante (comme lors de la première configuration).",
        annulerLib: "Annuler",
        confirmerLib: "Continuer",
        dangereux: false,
      });
      if (!ok) return;
      localStorage.removeItem(PIN_CLE);
      if (overlay._parentIdleClear) overlay._parentIdleClear();
      nettoyerRaccourcisParent(overlay);
      nettoyerPiegeFocusParentsTout(overlay);
      nettoyerSessionParent();
      overlay.remove();
      montrerParams(onFermer, document.getElementById("btn-params"));
    });
  }

  const btnFerm = overlay.querySelector(".btn-params-fermer");
  if (btnFerm) btnFerm.addEventListener("click", () => fermerOverlayParent(overlay, onFermer));
  overlay.querySelectorAll(".btn-params-close:not(.btn-params-close--pin)").forEach((b) => {
    b.addEventListener("click", () => fermerOverlayParent(overlay, onFermer));
  });
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) fermerOverlayParent(overlay, onFermer);
  });

  brancherEscapeParent(overlay, () => fermerOverlayParent(overlay, onFermer));
  brancherIdleParent(overlay, onFermer);
}

