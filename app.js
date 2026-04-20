(function () {
  "use strict";

  const STORAGE_KEY = "maths-cp-etoiles";
  const STORAGE_NIVEAU = "maths-cp-niveau";
  const STORAGE_GENRE = "maths-cp-genre";
  const RENARD_NOM_KEY = "renard-nom";
  const RENARD_NAISSANCE_KEY = "renard-naissance";
  const RENARD_FAIM_KEY = "renard-faim";
  const RENARD_FAIM_TS_KEY = "renard-faim-ts";
  const RENARD_BONHEUR_KEY = "renard-bonheur";
  const RENARD_BONHEUR_TS_KEY = "renard-bonheur-ts";
  const RENARD_CALIN_DATE_KEY = "renard-calin-date";
  const RENARD_STREAK_KEY = "renard-streak";
  const NIVEAU = { CP: "cp", CE1: "ce1" };
  const GENRE = { FILLE: "fille", GARCON: "garcon" };

  const ANIMAUX = ["🐱", "🐶", "🐰", "🐻", "🦊", "🐸", "🐥", "🐧", "🦋", "🐝"];

  const elGenre = document.getElementById("ecran-genre");
  const elMenu = document.getElementById("ecran-menu");
  const elJeu = document.getElementById("ecran-jeu");
  const elTotal = document.getElementById("total-etoiles");
  const elBadge = document.getElementById("jeu-niveau-badge");
  const elTitre = document.getElementById("jeu-titre");
  const elQuestion = document.getElementById("zone-question");
  const elChoix = document.getElementById("zone-choix");
  const elFeedback = document.getElementById("feedback");
  const elSuivant = document.getElementById("btn-suivant");
  const btnRetour = document.getElementById("btn-retour");
  const elSousTitre = document.getElementById("sous-titre");
  const elIconeGenre = document.getElementById("icone-genre-actuel");

  let jeuCourant = null;
  let bonneReponse = null;
  let repondu = false;
  let comboActuel = 0;
  let niveauCourant = lireNiveau();
  let genreCourant = lireGenre();

  function lireNiveau() {
    const v = localStorage.getItem(STORAGE_NIVEAU);
    return v === NIVEAU.CE1 ? NIVEAU.CE1 : NIVEAU.CP;
  }

  function sauverNiveau(n) {
    localStorage.setItem(STORAGE_NIVEAU, n);
    niveauCourant = n;
  }

  function estCE1() {
    return niveauCourant === NIVEAU.CE1;
  }

  // ── Genre ────────────────────────────────────────────────────────────────

  function lireGenre() {
    const v = localStorage.getItem(STORAGE_GENRE);
    return v === GENRE.GARCON ? GENRE.GARCON : GENRE.FILLE;
  }

  function sauverGenre(g) {
    localStorage.setItem(STORAGE_GENRE, g);
    genreCourant = g;
  }

  function estFille() {
    return genreCourant === GENRE.FILLE;
  }

  function majGenre() {
    const f = estFille();
    if (elSousTitre) {
      elSousTitre.textContent = f
        ? "Des jeux pour devenir championne en maths !"
        : "Des jeux pour devenir champion en maths !";
    }
    if (elIconeGenre) elIconeGenre.textContent = f ? "👧" : "👦";
  }

  function syncNiveauButtons() {
    document.querySelectorAll(".niveau-btn").forEach((btn) => {
      btn.classList.toggle("actif", btn.dataset.niveau === niveauCourant);
    });
  }

  function majLabelsMenu() {
    const desc = document.getElementById("desc-addition");
    if (desc) desc.textContent = estCE1() ? "Jusqu'à 79" : "Jusqu'à 10";
  }

  function setBadgeVisible(visible) {
    if (!elBadge) return;
    if (visible) {
      elBadge.hidden = false;
      elBadge.textContent = estCE1() ? "Niveau : CE1" : "Niveau : CP";
    } else {
      elBadge.hidden = true;
    }
  }

  function lireEtoiles() {
    const n = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  }

  function ajouterEtoiles(n) {
    const t = lireEtoiles() + n;
    localStorage.setItem(STORAGE_KEY, String(t));
    elTotal.textContent = t;
  }

  // ── Compagnon renard ─────────────────────────────────────────────────────

  const RENARD_STADES = [
    { nom: "Bébé renard",      corps: "#f5b97e", interne: "#fde7c8", yeux: "#3d2b1f" },
    { nom: "Jeune renard",     corps: "#e8872a", interne: "#f5c07a", yeux: "#1a1a1a" },
    { nom: "Renard malin",     corps: "#c96416", interne: "#e89050", yeux: "#0d0d0d" },
    { nom: "Renard magique",   corps: "#9c59d1", interne: "#c99ef0", yeux: "#4b0082" },
    { nom: "Renard légendaire",corps: "#ffd700", interne: "#ffe999", yeux: "#c8860a" },
  ];

  function getStade(etoiles) {
    if (etoiles < 21)  return 0;
    if (etoiles < 61)  return 1;
    if (etoiles < 151) return 2;
    if (etoiles < 301) return 3;
    return 4;
  }

  const ACCESSOIRES_DEF = {
    "chapeau-base":  { nom: "🎩 Chapeau",    svg: (t) => `<rect x="30" y="8" width="40" height="6" rx="3" fill="#2d3436"/><rect x="22" y="13" width="56" height="5" rx="2.5" fill="#2d3436"/>` },
    "lunettes-base": { nom: "👓 Lunettes",   svg: (t) => `<circle cx="37" cy="63" r="8.5" fill="none" stroke="#2d3436" stroke-width="2.5"/><circle cx="63" cy="63" r="8.5" fill="none" stroke="#2d3436" stroke-width="2.5"/><line x1="45.5" y1="63" x2="54.5" y2="63" stroke="#2d3436" stroke-width="2"/><line x1="28.5" y1="63" x2="22" y2="60" stroke="#2d3436" stroke-width="2"/><line x1="71.5" y1="63" x2="78" y2="60" stroke="#2d3436" stroke-width="2"/>` },
    "echarpe-rare":  { nom: "🧣 Écharpe",    svg: (t) => `<path d="M20,88 Q35,82 50,84 Q65,82 80,88" stroke="#e74c3c" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M50,84 L54,97" stroke="#e74c3c" stroke-width="6" stroke-linecap="round"/>` },
    "couronne-legendaire": { nom: "👑 Couronne légendaire", svg: (t) => `<polygon points="28,26 34,8 50,18 66,8 72,26" fill="#ffd700" stroke="#b8860b" stroke-width="1.5"/><circle cx="34" cy="9" r="4.5" fill="#e74c3c"/><circle cx="50" cy="19" r="4.5" fill="#9b59b6"/><circle cx="66" cy="9" r="4.5" fill="#e74c3c"/>` },
  };

  function lireAccessoires() {
    try { return JSON.parse(localStorage.getItem("renard-accessoires") || "[]"); }
    catch { return []; }
  }
  function lireTenue() {
    try { return JSON.parse(localStorage.getItem("renard-tenue") || "{}"); }
    catch { return {}; }
  }
  function sauverTenue(t) { localStorage.setItem("renard-tenue", JSON.stringify(t)); }

  function svgRenard(stade, taille, opts) {
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

  function mettreAJourRenardHeader() {
    const stade  = getStade(lireEtoiles());
    const triste = lireFaim() < 20 || lireBonheur() < 20;
    const accessoires = Object.keys(lireTenue());
    const opts   = { triste, accessoires };
    const header = document.getElementById("mascotte-header");
    const genre  = document.getElementById("mascotte-genre");
    if (header) header.innerHTML = svgRenard(stade, 44, opts);
    if (genre)  genre.innerHTML  = svgRenard(stade, 72, opts);
  }

  function lireNomRenard() {
    return localStorage.getItem(RENARD_NOM_KEY) || null;
  }

  function sauverNomRenard(nom) {
    localStorage.setItem(RENARD_NOM_KEY, nom);
    if (!localStorage.getItem(RENARD_NAISSANCE_KEY)) {
      localStorage.setItem(RENARD_NAISSANCE_KEY, new Date().toISOString().slice(0, 10));
    }
  }

  function montrerNommage() {
    const elNommage = document.getElementById("ecran-nommage");
    elGenre.hidden = true;
    elGenre.classList.remove("actif");
    elNommage.hidden = false;
    elNommage.classList.add("actif");
    const foxDiv = document.getElementById("nommage-fox");
    if (foxDiv) foxDiv.innerHTML = svgRenard(0, 110);
    setTimeout(() => {
      const inp = document.getElementById("input-nom-renard");
      if (inp) inp.focus();
    }, 350);
  }

  function lireFaim() {
    const v = parseFloat(localStorage.getItem(RENARD_FAIM_KEY));
    return Number.isFinite(v) ? Math.max(0, Math.min(100, v)) : 80;
  }
  function sauverFaim(v) {
    localStorage.setItem(RENARD_FAIM_KEY, String(Math.max(0, Math.min(100, v))));
    localStorage.setItem(RENARD_FAIM_TS_KEY, String(Date.now()));
  }
  function lireBonheur() {
    const v = parseFloat(localStorage.getItem(RENARD_BONHEUR_KEY));
    return Number.isFinite(v) ? Math.max(0, Math.min(100, v)) : 80;
  }
  function sauverBonheur(v) {
    localStorage.setItem(RENARD_BONHEUR_KEY, String(Math.max(0, Math.min(100, v))));
    localStorage.setItem(RENARD_BONHEUR_TS_KEY, String(Date.now()));
  }
  function appliquerDecay(valKey, tsKey, tauxParHeure) {
    const ts = parseInt(localStorage.getItem(tsKey) || "0", 10);
    if (!ts) return;
    const heures = (Date.now() - ts) / 3600000;
    const val = parseFloat(localStorage.getItem(valKey) || "80");
    const nvVal = Math.max(0, val - tauxParHeure * heures);
    localStorage.setItem(valKey, String(nvVal));
    localStorage.setItem(tsKey, String(Date.now()));
  }
  function mettreAJourJauges() {
    appliquerDecay(RENARD_FAIM_KEY, RENARD_FAIM_TS_KEY, 20 / 24);
    appliquerDecay(RENARD_BONHEUR_KEY, RENARD_BONHEUR_TS_KEY, 15 / 24);
    // Initialiser les timestamps si première visite
    if (!localStorage.getItem(RENARD_FAIM_TS_KEY)) sauverFaim(lireFaim());
    if (!localStorage.getItem(RENARD_BONHEUR_TS_KEY)) sauverBonheur(lireBonheur());
  }
  function peutFaireCalin() {
    const d = localStorage.getItem(RENARD_CALIN_DATE_KEY);
    return d !== new Date().toISOString().slice(0, 10);
  }

  function lireStreak() {
    try { return JSON.parse(localStorage.getItem(RENARD_STREAK_KEY)) || { count: 0, lastVisit: "" }; }
    catch { return { count: 0, lastVisit: "" }; }
  }
  function sauverStreak(s) { localStorage.setItem(RENARD_STREAK_KEY, JSON.stringify(s)); }

  function mettreAJourStreak() {
    const today = new Date().toISOString().slice(0, 10);
    const s = lireStreak();
    if (s.lastVisit === today) return s;

    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const newCount = s.lastVisit === yesterday ? s.count + 1 : 1;
    const streakData = { count: newCount, lastVisit: today };
    sauverStreak(streakData);

    // Paliers de récompense
    const paliers = { 3: "chapeau-base", 7: "lunettes-base", 30: "echarpe-rare" };
    if (paliers[newCount]) debloquerAccessoire(paliers[newCount]);

    // Message si streak brisé (lastVisit existe mais n'est pas hier)
    if (s.lastVisit && s.lastVisit !== yesterday && s.count > 0) {
      if (elSousTitre) {
        elSousTitre.textContent = "Le renard t'a attendu, mais il est content que tu sois là ! 🦊";
        setTimeout(() => majGenre(), 4000);
      }
    }
    return streakData;
  }

  function afficherStreakHeader(count) {
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

  elTotal.textContent = lireEtoiles();
  syncNiveauButtons();
  majLabelsMenu();
  mettreAJourJauges();
  mettreAJourRenardHeader();
  const streakInit = mettreAJourStreak();
  afficherStreakHeader(streakInit.count);

  function debloquerAccessoire(id) {
    try {
      const liste = JSON.parse(localStorage.getItem("renard-accessoires") || "[]");
      if (!liste.includes(id)) {
        liste.push(id);
        localStorage.setItem("renard-accessoires", JSON.stringify(liste));
      }
    } catch { /* ignore */ }
  }

  function declencherEvolution(stade) {
    confetti();
    const s = RENARD_STADES[stade];
    const overlay = document.createElement("div");
    overlay.className = "evolution-overlay";
    overlay.innerHTML = `
      <div class="evolution-carte">
        <div class="evolution-renard">${svgRenard(stade, 130)}</div>
        <p class="evolution-titre">✨ Ton renard évolue !</p>
        <p class="evolution-nom-stade">Il devient : ${s.nom}</p>
        <p class="evolution-msg">Continue comme ça, tu es incroyable !</p>
        <button type="button" class="btn-evolution-fermer">Super ! 🎉</button>
      </div>`;
    document.body.appendChild(overlay);
    setTimeout(() => confetti(), 400);
    overlay.querySelector(".btn-evolution-fermer").addEventListener("click", () => {
      overlay.style.opacity = "0";
      overlay.style.transition = "opacity 0.3s";
      setTimeout(() => overlay.remove(), 300);
    });
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.querySelector(".btn-evolution-fermer").click();
    });
  }

  // Wrapper : mise à jour du renard + détection d'évolution à chaque étoile
  const _ajouterEtoilesBase = ajouterEtoiles;
  ajouterEtoiles = function(n) {
    const stadeBefore = getStade(lireEtoiles());
    _ajouterEtoilesBase(n);
    const stadeAfter = getStade(lireEtoiles());
    mettreAJourRenardHeader();
    if (stadeAfter > stadeBefore) declencherEvolution(stadeAfter);
  };

  // ── Démarrage ─────────────────────────────────────────────────────────────
  if (!lireNomRenard()) {
    montrerNommage();
  } else if (localStorage.getItem(STORAGE_GENRE)) {
    majGenre();
    montrerMenu();
    // Message de bienvenue personnalisé
    const nom = lireNomRenard();
    if (elSousTitre) {
      elSousTitre.textContent = `${nom} t'attendait ! 🦊`;
      setTimeout(() => majGenre(), 3500);
    }
  }
  // Sinon : #ecran-genre déjà actif dans le HTML

  // ── Formulaire de nommage ─────────────────────────────────────────────────
  const formNommage = document.getElementById("nommage-form");
  if (formNommage) {
    formNommage.addEventListener("submit", (e) => {
      e.preventDefault();
      const inp = document.getElementById("input-nom-renard");
      const nom = ((inp && inp.value) || "").trim().slice(0, 12) || "Foxy";
      sauverNomRenard(nom);
      const elNommage = document.getElementById("ecran-nommage");
      elNommage.classList.remove("actif");
      elNommage.hidden = true;
      elGenre.hidden = false;
      elGenre.classList.add("actif");
      mettreAJourRenardHeader();
    });
  }

  document.querySelectorAll(".niveau-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const n = btn.dataset.niveau;
      if (n === niveauCourant) return;
      sauverNiveau(n);
      syncNiveauButtons();
      majLabelsMenu();
      if (jeuCourant) {
        setBadgeVisible(true);
        resetFeedback();
        if (lanceurs[jeuCourant]) lanceurs[jeuCourant]();
      }
    });
  });

  function melanger(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function entiersDistincts(min, max, count, exclude) {
    const set = new Set(exclude != null ? [exclude] : []);
    const out = [];
    let guard = 0;
    while (out.length < count && guard++ < 100) {
      const n = min + Math.floor(Math.random() * (max - min + 1));
      if (!set.has(n)) {
        set.add(n);
        out.push(n);
      }
    }
    return out;
  }

  function propositionsAvecBonne(bonne, min, max, nbFausse) {
    if (min > max) {
      const t = min;
      min = max;
      max = t;
    }
    const fausses = entiersDistincts(min, max, nbFausse, bonne);
    return melanger([bonne, ...fausses]);
  }

  function afficherChoix(nombres, handler) {
    elChoix.innerHTML = "";
    nombres.forEach((n) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn-choix";
      b.textContent = String(n);
      b.dataset.valeur = String(n);
      b.addEventListener("click", () => handler(Number(b.dataset.valeur), b));
      elChoix.appendChild(b);
    });
  }

  function confetti() {
    const root = document.getElementById("confetti");
    const sym = ["⭐", "✨", "🌟", "💫", "🎉"];
    for (let i = 0; i < 18; i++) {
      const s = document.createElement("span");
      s.textContent = sym[i % sym.length];
      s.style.left = Math.random() * 100 + "%";
      s.style.animationDelay = Math.random() * 0.4 + "s";
      root.appendChild(s);
      setTimeout(() => s.remove(), 2500);
    }
  }

  function messagesOk() {
    return estFille()
      ? [
          "Bravo, championne !",
          "Super ! Tu as réussi !",
          "Génial ! Encore une étoile !",
          "Tu es trop forte !",
          "Parfait ! Continue comme ça !",
          "Incroyable ! Quelle championne !",
        ]
      : [
          "Bravo, champion !",
          "Super ! Tu as réussi !",
          "Génial ! Encore une étoile !",
          "Tu es trop fort !",
          "Parfait ! Continue comme ça !",
          "Incroyable ! Quel champion !",
        ];
  }

  function messagesKo() {
    return [
      "Pas grave, on réessaie !",
      "Presque ! Regarde bien…",
      "Courage, la prochaine c'est la bonne !",
    ];
  }

  function apresReponse(choix, bouton, correct) {
    if (repondu) return;
    repondu = true;
    const boutons = elChoix.querySelectorAll(".btn-choix");
    boutons.forEach((btn) => {
      btn.disabled = true;
      const v = Number(btn.dataset.valeur);
      if (v === correct) btn.classList.add("bonne");
    });
    if (choix !== correct) bouton.classList.add("mauvaise");

    if (choix === correct) {
      comboActuel++;
      const ok = messagesOk();
      elFeedback.textContent = ok[Math.floor(Math.random() * ok.length)];
      elFeedback.className = "feedback ok";
      ajouterEtoiles(1);
      sauverFaim(lireFaim() + 5);
      confetti();
      declencherReactionRenard(true);
      if (comboActuel === 10) declencherCombo(10);
      else if (comboActuel === 5) declencherCombo(5);
    } else {
      comboActuel = 0;
      const ko = messagesKo();
      elFeedback.textContent = ko[Math.floor(Math.random() * ko.length)];
      elFeedback.className = "feedback non";
      declencherReactionRenard(false);
    }
    elSuivant.hidden = false;
  }

  function declencherReactionRenard(correct) {
    const el = document.getElementById("renard-reaction");
    if (!el) return;
    el.hidden = false;
    el.className = "renard-reaction";
    const stade = getStade(lireEtoiles());
    const bulle = correct ? "Ouais ! 🎉" : "Tu y es presque !";
    el.innerHTML = `<div class="renard-bulle">${bulle}</div>${svgRenard(stade, 72)}`;
    void el.offsetWidth;
    el.classList.add(correct ? "visible" : "encourage");
    setTimeout(() => { el.hidden = true; el.className = "renard-reaction"; }, 2000);
  }

  function declencherCombo(nb) {
    const bonus = nb >= 10 ? 3 : 1;
    ajouterEtoiles(bonus);
    const nom  = lireNomRenard() || "Foxy";
    const stade = getStade(lireEtoiles());
    const overlay = document.createElement("div");
    overlay.className = "evolution-overlay";
    overlay.innerHTML = `
      <div class="evolution-carte combo-carte">
        <div class="evolution-renard">${svgRenard(stade, 100)}</div>
        <p class="combo-flamme">${nb >= 10 ? "🔥🔥 COMBO ×10 ! 🔥🔥" : "🔥 COMBO ×5 !"}</p>
        <p class="evolution-titre">${nom} est fier de toi !</p>
        <p class="evolution-msg">+${bonus} ⭐ bonus !</p>
        <button type="button" class="btn-evolution-fermer">Super !</button>
      </div>`;
    document.body.appendChild(overlay);
    confetti();
    overlay.querySelector(".btn-evolution-fermer").addEventListener("click", () => overlay.remove());
    overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
  }

  function resetFeedback() {
    elFeedback.textContent = "";
    elFeedback.className = "feedback";
    elSuivant.hidden = true;
    repondu = false;
  }

  function lancerCompte() {
    elTitre.textContent = "Compte-moi ça !";
    const n = estCE1()
      ? 10 + Math.floor(Math.random() * 9)
      : 3 + Math.floor(Math.random() * 8);
    const emoji = ANIMAUX[Math.floor(Math.random() * ANIMAUX.length)];
    const ligne = Array(n).fill(emoji).join(" ");
    elQuestion.innerHTML =
      "<p>Combien d'animaux tu vois ?</p>" +
      '<p class="ligne-emojis' +
      (n > 8 ? " petit" : "") +
      '">' +
      ligne +
      "</p>";
    bonneReponse = n;
    const props = estCE1()
      ? propositionsAvecBonne(n, Math.max(6, n - 4), Math.min(22, n + 4), 3)
      : propositionsAvecBonne(n, 1, 12, 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, bonneReponse));
  }

  function lancerAddition() {
    elTitre.textContent = "Addition magique";
    let a;
    let b;
    let total;
    let html;

    if (!estCE1()) {
      a = 1 + Math.floor(Math.random() * 9);
      b = 1 + Math.floor(Math.random() * (10 - a));
      total = a + b;
      const e1 = ANIMAUX[Math.floor(Math.random() * ANIMAUX.length)];
      let e2 = ANIMAUX[Math.floor(Math.random() * ANIMAUX.length)];
      if (e2 === e1) e2 = ANIMAUX[(ANIMAUX.indexOf(e1) + 1) % ANIMAUX.length];
      html =
        "<p>Combien en tout ?</p>" +
        '<p class="ligne-emojis">' +
        Array(a).fill(e1).join(" ") +
        " <span style='opacity:.5'>+</span> " +
        Array(b).fill(e2).join(" ") +
        "</p>" +
        '<p class="equation">' +
        a +
        " + " +
        b +
        " = ?</p>";
      const props = propositionsAvecBonne(total, 2, 10, 3);
      elQuestion.innerHTML = html;
      bonneReponse = total;
      afficherChoix(props, (val, btn) => apresReponse(val, btn, bonneReponse));
      return;
    }

    total = 21 + Math.floor(Math.random() * 59);
    a = 1 + Math.floor(Math.random() * (total - 1));
    b = total - a;

    html =
      "<p>Calcul mental — combien font :</p>" +
      '<p class="equation" style="font-size:2rem;margin-top:.75rem">' +
      a +
      " + " +
      b +
      " = ?</p>";

    elQuestion.innerHTML = html;
    bonneReponse = total;
    const pmin = Math.max(2, total - 15);
    const pmax = Math.min(95, total + 15);
    const props = propositionsAvecBonne(total, pmin, pmax, 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, bonneReponse));
  }

  function lancerSoustraction() {
    elTitre.textContent = "Les pommes";
    let total;
    let enleve;
    let reste;

    if (!estCE1()) {
      total = 4 + Math.floor(Math.random() * 7);
    } else {
      total = 21 + Math.floor(Math.random() * 69);
    }
    enleve = 1 + Math.floor(Math.random() * (total - 1));
    reste = total - enleve;

    elQuestion.innerHTML =
      "<p>Il y a <strong>" +
      total +
      "</strong> pommes 🍎</p>" +
      "<p>On en mange <strong>" +
      enleve +
      "</strong>. Combien il en reste ?</p>" +
      '<p class="equation">' +
      total +
      " − " +
      enleve +
      " = ?</p>";
    bonneReponse = reste;
    const props = estCE1()
      ? propositionsAvecBonne(reste, Math.max(0, reste - 15), Math.min(89, reste + 15), 3)
      : propositionsAvecBonne(reste, 0, 10, 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, bonneReponse));
  }

  function lancerCompare() {
    elTitre.textContent = "Le plus grand";
    let a;
    let b;

    if (!estCE1()) {
      a = 1 + Math.floor(Math.random() * 20);
      b = 1 + Math.floor(Math.random() * 20);
    } else {
      a = 100 + Math.floor(Math.random() * 900);
      b = 100 + Math.floor(Math.random() * 900);
    }
    if (a === b) b = b < 999 ? b + 1 : b - 1;
    bonneReponse = Math.max(a, b);
    elQuestion.innerHTML =
      "<p>Quel nombre est le <strong>plus grand</strong> ?</p>" +
      '<p class="equation" style="font-size:clamp(1.35rem,6vw,1.85rem)">' +
      a +
      " &nbsp; ou &nbsp; " +
      b +
      "</p>";
    afficherChoix(melanger([a, b]), (val, btn) => apresReponse(val, btn, bonneReponse));
  }

  function lancerSuite() {
    elTitre.textContent = "Numéro manquant";
    let debut, step;
    if (!estCE1()) {
      debut = 1 + Math.floor(Math.random() * 12);
      step = 1;
    } else {
      step = [1, 2, 5, 10][Math.floor(Math.random() * 4)];
      debut = 1 + Math.floor(Math.random() * Math.max(1, 95 - step * 4));
    }
    const suite = [debut, debut + step, debut + step * 2, debut + step * 3, debut + step * 4];
    const indexCache = 1 + Math.floor(Math.random() * 3);
    bonneReponse = suite[indexCache];
    const affiche = suite.map((n, i) => (i === indexCache ? "?" : String(n)));
    elQuestion.innerHTML =
      "<p>Quel nombre manque dans la suite ?</p>" +
      '<p class="suite">' +
      affiche.join(" — ") +
      "</p>";
    const min = Math.max(1, bonneReponse - step * 3);
    const max = bonneReponse + step * 3;
    const props = propositionsAvecBonne(bonneReponse, min, max, 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, bonneReponse));
  }

  function lancerDoubles() {
    elTitre.textContent = "Doubles";
    const n = estCE1() ? 10 + Math.floor(Math.random() * 16) : 1 + Math.floor(Math.random() * 5);
    const d = n + n;
    elQuestion.innerHTML =
      "<p>Le double de <strong>" +
      n +
      "</strong>, c'est combien ?</p>" +
      '<p class="equation">' +
      n +
      " + " +
      n +
      " = ?</p>";
    bonneReponse = d;
    const props = estCE1()
      ? propositionsAvecBonne(d, Math.max(10, d - 12), Math.min(60, d + 12), 3)
      : propositionsAvecBonne(d, 2, 12, 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, bonneReponse));
  }

  // ── Horloge analogique SVG ────────────────────────────────────────────────

  function svgHorloge(heure, minute, taille) {
    const cx = taille / 2;
    const cy = taille / 2;
    const r = taille / 2 - 3;
    const rad = (d) => (d * Math.PI) / 180;

    // Angles : 0° = 3h (SVG), on soustrait 90° pour démarrer à 12h
    const angleM = rad((minute / 60) * 360 - 90);
    const angleH = rad((((heure % 12) + minute / 60) / 12) * 360 - 90);

    const lonM = r * 0.72;
    const lonH = r * 0.50;

    const mX = (cx + lonM * Math.cos(angleM)).toFixed(2);
    const mY = (cy + lonM * Math.sin(angleM)).toFixed(2);
    const hX = (cx + lonH * Math.cos(angleH)).toFixed(2);
    const hY = (cy + lonH * Math.sin(angleH)).toFixed(2);

    // 12 graduations
    let ticks = "";
    for (let i = 0; i < 12; i++) {
      const a = rad(i * 30 - 90);
      const major = i % 3 === 0;
      const r1 = r - (major ? Math.round(taille * 0.09) : Math.round(taille * 0.055));
      const r2 = r - 2;
      const x1 = (cx + r1 * Math.cos(a)).toFixed(2);
      const y1 = (cy + r1 * Math.sin(a)).toFixed(2);
      const x2 = (cx + r2 * Math.cos(a)).toFixed(2);
      const y2 = (cy + r2 * Math.sin(a)).toFixed(2);
      const sw = major ? (taille > 100 ? 3 : 2) : (taille > 100 ? 1.5 : 1);
      const col = major ? "#6c5ce7" : "#c4b5f9";
      ticks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${sw}" stroke-linecap="round"/>`;
    }

    const swM = taille > 100 ? 3.5 : 2;
    const swH = taille > 100 ? 5.5 : 3.5;
    const dotR = taille > 100 ? 5.5 : 3.5;
    const bw = taille > 100 ? 3 : 2;

    return `<svg width="${taille}" height="${taille}" viewBox="0 0 ${taille} ${taille}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="white" stroke="#6c5ce7" stroke-width="${bw}"/>
  ${ticks}
  <line x1="${cx}" y1="${cy}" x2="${mX}" y2="${mY}" stroke="#00cec9" stroke-width="${swM}" stroke-linecap="round"/>
  <line x1="${cx}" y1="${cy}" x2="${hX}" y2="${hY}" stroke="#5344c7" stroke-width="${swH}" stroke-linecap="round"/>
  <circle cx="${cx}" cy="${cy}" r="${dotR}" fill="#5344c7"/>
</svg>`;
  }

  function afficherChoixHorloge(options) {
    elChoix.innerHTML = "";
    options.forEach((totalMin) => {
      const h = Math.floor(totalMin / 60) || 12;
      const m = totalMin % 60;
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn-choix";
      b.textContent = labelHeure(totalMin);
      b.dataset.valeur = String(totalMin);
      b.addEventListener("click", () => apresReponse(totalMin, b, bonneReponse));
      elChoix.appendChild(b);
    });
  }

  function labelHeure(totalMin) {
    const h = Math.floor(totalMin / 60) || 12;
    const m = totalMin % 60;
    if (m === 0) return String(h);
    return h + "h" + String(m).padStart(2, "0");
  }

  function svgHorlogeAnnotee(heure, minute, taille) {
    const cx = taille / 2, cy = taille / 2;
    const r = taille / 2 - 3;
    const rad = (d) => (d * Math.PI) / 180;
    const angleM = rad((minute / 60) * 360 - 90);
    const angleH = rad((((heure % 12) + minute / 60) / 12) * 360 - 90);
    const lonM = r * 0.68, lonH = r * 0.46;
    const mX = (cx + lonM * Math.cos(angleM)).toFixed(2);
    const mY = (cy + lonM * Math.sin(angleM)).toFixed(2);
    const hX = (cx + lonH * Math.cos(angleH)).toFixed(2);
    const hY = (cy + lonH * Math.sin(angleH)).toFixed(2);
    let ticks = "";
    for (let i = 0; i < 12; i++) {
      const a = rad(i * 30 - 90);
      const r1 = r - Math.round(taille * 0.07);
      const r2 = r - 2;
      ticks += `<line x1="${(cx + r1 * Math.cos(a)).toFixed(2)}" y1="${(cy + r1 * Math.sin(a)).toFixed(2)}" x2="${(cx + r2 * Math.cos(a)).toFixed(2)}" y2="${(cy + r2 * Math.sin(a)).toFixed(2)}" stroke="#c4b5f9" stroke-width="1.5" stroke-linecap="round"/>`;
    }
    let nums = "";
    for (let n = 1; n <= 12; n++) {
      const a = rad(n * 30 - 90);
      const nr = r * 0.74;
      nums += `<text x="${(cx + nr * Math.cos(a)).toFixed(2)}" y="${(cy + nr * Math.sin(a)).toFixed(2)}" text-anchor="middle" dominant-baseline="central" font-size="${Math.round(taille * 0.10)}" fill="#4a4068" font-weight="700" font-family="inherit">${n}</text>`;
    }
    return `<svg width="${taille}" height="${taille}" viewBox="0 0 ${taille} ${taille}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="white" stroke="#6c5ce7" stroke-width="2"/>
  ${ticks}${nums}
  <line x1="${cx}" y1="${cy}" x2="${mX}" y2="${mY}" stroke="#00cec9" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="${cx}" y1="${cy}" x2="${hX}" y2="${hY}" stroke="#5344c7" stroke-width="4" stroke-linecap="round"/>
  <circle cx="${cx}" cy="${cy}" r="3.5" fill="#5344c7"/>
</svg>`;
  }

  function montrerAideHeure() {
    resetFeedback();
    elChoix.innerHTML = "";
    const exemples = [
      { h: 3, m: 0,  label: "3h00",  sub: "grande sur le 12" },
      { h: 3, m: 15, label: "3h15",  sub: "grande sur le 3" },
      { h: 3, m: 30, label: "3h30",  sub: "grande sur le 6" },
      { h: 3, m: 45, label: "3h45",  sub: "grande sur le 9" },
    ];
    const exHTML = exemples.map((e) =>
      `<div class="aide-ex">
        <div class="grande-horloge">${svgHorlogeAnnotee(e.h, e.m, 90)}</div>
        <p class="aide-ex-label">${e.label}</p>
        <p class="aide-ex-sub">${e.sub}</p>
      </div>`
    ).join("");
    elQuestion.innerHTML = `
      <div class="aide-heure">
        <p class="aide-heure-titre">🕐 Comment lire l'heure ?</p>
        <div class="aide-heure-legende">
          <div class="aide-legende-item heures">🟣 Petite aiguille épaisse → les <strong>HEURES</strong></div>
          <div class="aide-legende-item minutes">🔵 Grande aiguille fine → les <strong>MINUTES</strong></div>
        </div>
        <div class="aide-heure-exemples">${exHTML}</div>
        <button type="button" class="btn-retour-aide" id="btn-retour-aide">← Nouvelle question</button>
      </div>`;
    document.getElementById("btn-retour-aide").addEventListener("click", lancerHeure);
  }

  function lancerHeure() {
    elTitre.textContent = "🕐";

    // CP : multiples de 5 min ; CE1 : n'importe quelle minute
    const pas = estCE1() ? 1 : 5;
    const pool = [];
    for (let h = 1; h <= 12; h++) {
      for (let m = 0; m < 60; m += pas) {
        pool.push(h * 60 + m);
      }
    }

    const bonne = pool[Math.floor(Math.random() * pool.length)];
    const bonneH = Math.floor(bonne / 60);
    const bonneM = bonne % 60;

    // Distracteurs : même heure avec minutes différentes OU heures différentes
    // Pour rendre intéressant : 2 distracteurs même heure (minutes diff), 1 heure diff
    const memHeure = pool.filter((t) => Math.floor(t / 60) === bonneH && t !== bonne);
    const autreHeure = pool.filter((t) => Math.floor(t / 60) !== bonneH);

    const distMemH = melanger(memHeure).slice(0, 2);
    const distAutreH = melanger(autreHeure).slice(0, 1);
    const fausses = melanger([...distMemH, ...distAutreH]).slice(0, 3);
    const options = melanger([bonne, ...fausses]);

    bonneReponse = bonne;

    elQuestion.innerHTML = `
      <div class="grande-horloge">${svgHorloge(bonneH || 12, bonneM, 160)}</div>
      <button type="button" class="btn-aide-heure" id="btn-aide-heure">💡 Comment lire l'heure ?</button>`;
    document.getElementById("btn-aide-heure").addEventListener("click", montrerAideHeure);
    afficherChoixHorloge(options);
  }

  // ── Pair / Impair ────────────────────────────────────────────────────────

  function svgPairesIcon(pair) {
    const n = pair ? 4 : 5;
    let circles = "";
    for (let i = 0; i < n; i++) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const color = col === 0 ? "#6c5ce7" : "#fd79a8";
      circles += `<circle cx="${20 + col * 30}" cy="${18 + row * 30}" r="11" fill="${color}" opacity="0.9"/>`;
    }
    const h = 18 + Math.ceil(n / 2) * 30;
    return `<svg width="70" height="${h}" viewBox="0 0 70 ${h}">${circles}</svg>`;
  }

  function lancerPairImpair() {
    elTitre.textContent = "🟣 🔵";
    const max = estCE1() ? 100 : 20;
    const n = 2 + Math.floor(Math.random() * (max - 1));
    const estPair = n % 2 === 0;
    bonneReponse = estPair ? 0 : 1;

    let dots = "";
    for (let i = 0; i < n; i++) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const color = col === 0 ? "#6c5ce7" : "#fd79a8";
      dots += `<circle cx="${22 + col * 30}" cy="${20 + row * 30}" r="12" fill="${color}" opacity="0.85"/>`;
    }
    const svgH = 20 + Math.ceil(n / 2) * 30;

    elQuestion.innerHTML = `<div class="pair-question">
      <span class="pair-nombre">${n}</span>
      <svg width="74" height="${svgH}" viewBox="0 0 74 ${svgH}">${dots}</svg>
    </div>`;

    elChoix.innerHTML = "";
    [{ val: 0, icon: svgPairesIcon(true) }, { val: 1, icon: svgPairesIcon(false) }].forEach(({ val, icon }) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn-choix btn-visuel2";
      b.innerHTML = icon;
      b.dataset.valeur = String(val);
      b.addEventListener("click", () => apresReponse(val, b, bonneReponse));
      elChoix.appendChild(b);
    });
  }

  // ── Dizaines & Unités ────────────────────────────────────────────────────

  function svgDizUn(diz, un) {
    const barW = 14, barH = 48, gap = 5, dotR = 8, dotGap = 20;
    let items = "";
    let x = 8;
    for (let i = 0; i < diz; i++) {
      items += `<rect x="${x}" y="6" width="${barW}" height="${barH}" rx="4" fill="#6c5ce7" opacity="0.85"/>`;
      x += barW + gap;
    }
    if (diz > 0 && un > 0) x += 10;
    for (let i = 0; i < un; i++) {
      items += `<circle cx="${x + dotR}" cy="30" r="${dotR}" fill="#fdcb6e" opacity="0.9"/>`;
      x += dotGap;
    }
    const w = Math.max(x + 10, 60);
    return `<svg width="${w}" height="60" viewBox="0 0 ${w} 60">${items}</svg>`;
  }

  function lancerDizaines() {
    elTitre.textContent = "📊";
    const max = estCE1() ? 99 : 69;
    const n = 11 + Math.floor(Math.random() * (max - 10));
    const diz = Math.floor(n / 10);
    const un = n % 10;
    bonneReponse = n;

    elQuestion.innerHTML = `<div class="diz-question">${svgDizUn(diz, un)}</div>`;
    const props = propositionsAvecBonne(n, Math.max(10, n - 22), Math.min(max, n + 22), 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, bonneReponse));
  }

  // ── Formes géométriques ──────────────────────────────────────────────────

  const FORMES = ["cercle", "carré", "rectangle", "triangle", "losange"];
  const COULEURS_FORMES = ["#6c5ce7", "#00cec9", "#fd79a8", "#fdcb6e", "#00b894", "#e17055"];

  function svgForme(type, taille, couleur) {
    const cx = taille / 2, cy = taille / 2, r = taille * 0.38;
    switch (type) {
      case "cercle":
        return `<svg width="${taille}" height="${taille}" viewBox="0 0 ${taille} ${taille}"><circle cx="${cx}" cy="${cy}" r="${r}" fill="${couleur}"/></svg>`;
      case "carré": {
        const s = r * 1.55;
        return `<svg width="${taille}" height="${taille}" viewBox="0 0 ${taille} ${taille}"><rect x="${cx - s / 2}" y="${cy - s / 2}" width="${s}" height="${s}" rx="4" fill="${couleur}"/></svg>`;
      }
      case "rectangle": {
        const rw = r * 2, rh = r * 1.1;
        return `<svg width="${taille}" height="${taille}" viewBox="0 0 ${taille} ${taille}"><rect x="${cx - rw / 2}" y="${cy - rh / 2}" width="${rw}" height="${rh}" rx="4" fill="${couleur}"/></svg>`;
      }
      case "triangle": {
        const pts = `${cx},${cy - r} ${cx - r * 0.95},${cy + r * 0.6} ${cx + r * 0.95},${cy + r * 0.6}`;
        return `<svg width="${taille}" height="${taille}" viewBox="0 0 ${taille} ${taille}"><polygon points="${pts}" fill="${couleur}"/></svg>`;
      }
      case "losange": {
        const pts = `${cx},${cy - r} ${cx + r * 0.72},${cy} ${cx},${cy + r} ${cx - r * 0.72},${cy}`;
        return `<svg width="${taille}" height="${taille}" viewBox="0 0 ${taille} ${taille}"><polygon points="${pts}" fill="${couleur}"/></svg>`;
      }
      default: return "";
    }
  }

  function lancerFormes() {
    elTitre.textContent = "🔷";
    const idx = Math.floor(Math.random() * FORMES.length);
    const forme = FORMES[idx];
    const couleurQ = COULEURS_FORMES[Math.floor(Math.random() * COULEURS_FORMES.length)];
    bonneReponse = idx;

    elQuestion.innerHTML = `<div class="forme-question">${svgForme(forme, 130, couleurQ)}</div>`;

    const autresIdx = melanger(FORMES.map((_, i) => i).filter((i) => i !== idx)).slice(0, 3);
    const optionsIdx = melanger([idx, ...autresIdx]);

    elChoix.innerHTML = "";
    optionsIdx.forEach((i) => {
      const ci = (COULEURS_FORMES.indexOf(couleurQ) + i + 1) % COULEURS_FORMES.length;
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn-choix btn-forme";
      b.innerHTML = svgForme(FORMES[i], 75, COULEURS_FORMES[ci]);
      b.dataset.valeur = String(i);
      b.addEventListener("click", () => apresReponse(i, b, bonneReponse));
      elChoix.appendChild(b);
    });
  }

  // ── Monnaie CP ──────────────────────────────────────────────────────────

  const PIECES_DEF = [
    { val: 1,   label: "1c",  color: "#b87333", r: 18 },
    { val: 2,   label: "2c",  color: "#b87333", r: 20 },
    { val: 5,   label: "5c",  color: "#b87333", r: 22 },
    { val: 10,  label: "10c", color: "#c0c0c0", r: 22 },
    { val: 20,  label: "20c", color: "#c0c0c0", r: 24 },
    { val: 50,  label: "50c", color: "#c0c0c0", r: 26 },
    { val: 100, label: "1€",  color: "#f9ca24", r: 28 },
    { val: 200, label: "2€",  color: "#f9ca24", r: 30 },
  ];

  function labelCents(v) {
    if (v === 0) return "0€";
    return v % 100 === 0 ? `${v / 100}€` : `${v}c`;
  }

  function labelEuros(v) {
    if (v === 0) return "0€";
    if (v % 100 === 0) return `${v / 100}€`;
    const euros = Math.floor(v / 100);
    const cents = String(v % 100).padStart(2, "0");
    return euros > 0 ? `${euros},${cents}€` : `0,${cents}€`;
  }

  const ARTICLES_BOUTIQUE = [
    { nom: "un livre", emoji: "📚" },
    { nom: "un jouet", emoji: "🧸" },
    { nom: "une glace", emoji: "🍦" },
    { nom: "un cahier", emoji: "📓" },
    { nom: "des crayons", emoji: "✏️" },
    { nom: "un ballon", emoji: "⚽" },
    { nom: "une gomme", emoji: "🖊️" },
    { nom: "un gâteau", emoji: "🍰" },
  ];

  function svgPiecesLigne(pieces) {
    let x = 0;
    let circles = "";
    pieces.forEach((p) => {
      x += p.r + 6;
      circles += `<circle cx="${x}" cy="32" r="${p.r}" fill="${p.color}" stroke="rgba(0,0,0,0.15)" stroke-width="1.5"/>`;
      circles += `<text x="${x}" y="${32 + p.r * 0.27}" text-anchor="middle" font-family="Fredoka,sans-serif" font-size="${Math.round(p.r * 0.65)}" font-weight="700" fill="rgba(0,0,0,0.5)">${p.label}</text>`;
      x += p.r + 6;
    });
    return `<svg width="${x}" height="64" viewBox="0 0 ${x} 64">${circles}</svg>`;
  }

  function lancerMonnaieCp() {
    elTitre.textContent = "🪙";
    const pool = estCE1() ? PIECES_DEF : PIECES_DEF.slice(0, 6);
    const nbPieces = 2 + Math.floor(Math.random() * 2);
    const chosenPieces = [];
    let total = 0;
    for (let i = 0; i < nbPieces; i++) {
      const available = pool.filter((p) => total + p.val <= (estCE1() ? 200 : 100));
      if (!available.length) break;
      const p = available[Math.floor(Math.random() * available.length)];
      chosenPieces.push(p);
      total += p.val;
    }
    if (total === 0 || chosenPieces.length < 2) { lancerMonnaieCp(); return; }
    bonneReponse = total;

    elQuestion.innerHTML = svgPiecesLigne(chosenPieces);

    const dist = entiersDistincts(Math.max(1, total - 20), total + 20, 3, total);
    const opts = melanger([total, ...dist]);
    elChoix.innerHTML = "";
    opts.forEach((v) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn-choix";
      b.textContent = labelCents(v);
      b.dataset.valeur = String(v);
      b.addEventListener("click", () => apresReponse(v, b, bonneReponse));
      elChoix.appendChild(b);
    });
  }

  // ── Moitié ──────────────────────────────────────────────────────────────

  function lancerMoitie() {
    elTitre.textContent = "✂️";
    const maxMoitie = estCE1() ? 30 : 10;
    const moitie = 1 + Math.floor(Math.random() * maxMoitie);
    const n = moitie * 2;
    bonneReponse = moitie;
    const emoji = ANIMAUX[Math.floor(Math.random() * ANIMAUX.length)];

    const row1 = Array(moitie).fill(emoji).join(" ");
    const row2 = Array(moitie).fill("❓").join(" ");
    elQuestion.innerHTML = `<div class="moitie-question">
      <div class="moitie-row">${row1}</div>
      <div class="moitie-sep">— — —</div>
      <div class="moitie-row moitie-cache">${row2}</div>
    </div>`;

    const props = propositionsAvecBonne(moitie, Math.max(1, moitie - 5), Math.min(maxMoitie + 2, moitie + 5), 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, bonneReponse));
  }

  // ── Tables de multiplication ────────────────────────────────────────────

  function lancerMultiplication() {
    elTitre.textContent = "✖️";
    const tables = estCE1() ? [2, 3, 4, 5, 10] : [2, 3, 5];
    const mult = tables[Math.floor(Math.random() * tables.length)];
    const maxFact = estCE1() ? 10 : 5;
    const fact = 1 + Math.floor(Math.random() * maxFact);
    const produit = mult * fact;
    bonneReponse = produit;

    const emoji = ANIMAUX[Math.floor(Math.random() * ANIMAUX.length)];
    let groupsHtml = "";
    if (produit <= 30) {
      for (let g = 0; g < fact; g++) {
        groupsHtml += `<div class="mult-groupe">${Array(mult).fill(emoji).join("")}</div>`;
      }
      elQuestion.innerHTML = `<div class="mult-grille">${groupsHtml}</div>`;
    } else {
      // Dots grid for larger products
      for (let g = 0; g < fact; g++) {
        let dotsSvg = "";
        for (let d = 0; d < mult; d++) {
          dotsSvg += `<circle cx="${12 + (d % 5) * 18}" cy="${12 + Math.floor(d / 5) * 18}" r="7" fill="#6c5ce7"/>`;
        }
        const dw = Math.min(mult, 5) * 18 + 6;
        const dh = Math.ceil(mult / 5) * 18 + 6;
        groupsHtml += `<svg class="mult-dots" width="${dw}" height="${dh}" viewBox="0 0 ${dw} ${dh}">${dotsSvg}</svg>`;
      }
      elQuestion.innerHTML = `<div class="mult-grille-dots">${groupsHtml}</div>`;
    }

    const pmin = Math.max(2, produit - 18), pmax = Math.min(110, produit + 18);
    const props = propositionsAvecBonne(produit, pmin, pmax, 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, bonneReponse));
  }

  // ── Division / Partage ──────────────────────────────────────────────────

  function lancerDivision() {
    elTitre.textContent = "➗";
    const diviseurs = estCE1() ? [2, 3, 4, 5, 10] : [2, 3];
    const diviseur = diviseurs[Math.floor(Math.random() * diviseurs.length)];
    const maxQuot = estCE1() ? 10 : 5;
    const quotient = 1 + Math.floor(Math.random() * maxQuot);
    const total = diviseur * quotient;
    bonneReponse = quotient;

    const emoji = ANIMAUX[Math.floor(Math.random() * ANIMAUX.length)];
    const totalLine = Array(total).fill(emoji).join(" ");
    let groupsHtml = "";
    for (let g = 0; g < diviseur; g++) {
      groupsHtml += `<div class="div-groupe">${g === 0 ? Array(quotient).fill(emoji).join("") : "❓"}</div>`;
    }
    elQuestion.innerHTML = `<div class="div-question">
      <div class="div-total">${totalLine}</div>
      <div class="div-arrow">▼</div>
      <div class="div-groupes">${groupsHtml}</div>
    </div>`;

    const props = propositionsAvecBonne(quotient, Math.max(1, quotient - 4), quotient + 4, 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, bonneReponse));
  }

  // ── Fractions ────────────────────────────────────────────────────────────

  function svgFraction(num, denom, taille) {
    const cx = taille / 2, cy = taille / 2, r = taille * 0.42;
    const angleOffset = -Math.PI / 2;
    let parts = "";
    for (let i = 0; i < denom; i++) {
      const a1 = (i / denom) * 2 * Math.PI + angleOffset;
      const a2 = ((i + 1) / denom) * 2 * Math.PI + angleOffset;
      const x1 = (cx + r * Math.cos(a1)).toFixed(2);
      const y1 = (cy + r * Math.sin(a1)).toFixed(2);
      const x2 = (cx + r * Math.cos(a2)).toFixed(2);
      const y2 = (cy + r * Math.sin(a2)).toFixed(2);
      const fill = i < num ? "#6c5ce7" : "#e8e0ff";
      const la = 1 / denom > 0.5 ? 1 : 0;
      parts += `<path d="M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${la} 1 ${x2},${y2} Z" fill="${fill}" stroke="white" stroke-width="2"/>`;
    }
    return `<svg width="${taille}" height="${taille}" viewBox="0 0 ${taille} ${taille}">
      ${parts}
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#6c5ce7" stroke-width="2"/>
    </svg>`;
  }

  function lancerFractions() {
    elTitre.textContent = "🍕";
    const pool = estCE1()
      ? [{ n: 1, d: 2 }, { n: 1, d: 4 }, { n: 3, d: 4 }, { n: 1, d: 3 }, { n: 2, d: 3 }]
      : [{ n: 1, d: 2 }, { n: 1, d: 4 }, { n: 3, d: 4 }];
    const bonne = pool[Math.floor(Math.random() * pool.length)];
    bonneReponse = bonne.n * 10 + bonne.d;

    elQuestion.innerHTML = `<div class="fraction-question">${svgFraction(bonne.n, bonne.d, 140)}</div>`;

    const fausses = melanger(pool.filter((f) => f.n !== bonne.n || f.d !== bonne.d)).slice(0, 3);
    // Pad with extra if not enough distinct options
    while (fausses.length < 3) {
      const extras = [{ n: 2, d: 4 }, { n: 1, d: 6 }, { n: 2, d: 6 }];
      const e = extras.find((x) => (x.n * 10 + x.d) !== bonneReponse && !fausses.find((f) => f.n === x.n && f.d === x.d));
      if (e) fausses.push(e); else break;
    }
    const options = melanger([bonne, ...fausses.slice(0, 3)]);

    elChoix.innerHTML = "";
    options.forEach((f) => {
      const val = f.n * 10 + f.d;
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn-choix btn-forme";
      b.innerHTML = svgFraction(f.n, f.d, 75);
      b.dataset.valeur = String(val);
      b.addEventListener("click", () => apresReponse(val, b, bonneReponse));
      elChoix.appendChild(b);
    });
  }

  // ── Mesures ──────────────────────────────────────────────────────────────

  function lancerMesures() {
    elTitre.textContent = "📏";
    const maxLen = estCE1() ? 18 : 12;
    const lenA = 3 + Math.floor(Math.random() * (maxLen - 2));
    let lenB;
    do { lenB = 3 + Math.floor(Math.random() * (maxLen - 2)); } while (lenB === lenA);
    bonneReponse = lenA > lenB ? 0 : 1;

    const scale = 18;
    const wA = lenA * scale, wB = lenB * scale;
    const maxW = Math.max(wA, wB) + 20;
    elQuestion.innerHTML = `<svg width="${maxW}" height="80" viewBox="0 0 ${maxW} 80">
      <rect x="10" y="10" width="${wA}" height="24" rx="6" fill="#6c5ce7" opacity="0.85"/>
      <rect x="10" y="46" width="${wB}" height="24" rx="6" fill="#fd79a8" opacity="0.85"/>
    </svg>`;

    elChoix.innerHTML = "";
    [{ val: 0, col: "#6c5ce7" }, { val: 1, col: "#fd79a8" }].forEach(({ val, col }) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn-choix btn-visuel2";
      b.innerHTML = `<svg width="60" height="28" viewBox="0 0 60 28"><rect x="4" y="4" width="52" height="20" rx="5" fill="${col}"/></svg>`;
      b.dataset.valeur = String(val);
      b.addEventListener("click", () => apresReponse(val, b, bonneReponse));
      elChoix.appendChild(b);
    });
  }

  // ── Monnaie CE1 ──────────────────────────────────────────────────────────

  function lancerMonnaieCe1() {
    elTitre.textContent = "🛍️";
    const prixOptions = [100, 150, 200, 250, 300, 400, 500, 750, 1000];
    const prix = prixOptions[Math.floor(Math.random() * prixOptions.length)];
    const billets = [200, 500, 1000, 2000].filter((b) => b > prix);
    if (!billets.length) { lancerMonnaieCe1(); return; }
    const paye = billets[Math.floor(Math.random() * billets.length)];
    const monnaie = paye - prix;
    bonneReponse = monnaie;

    const article = ARTICLES_BOUTIQUE[Math.floor(Math.random() * ARTICLES_BOUTIQUE.length)];

    elQuestion.innerHTML = `<div class="monnaie-question">
      <div class="monnaie-ligne">${article.emoji} Tu achètes ${article.nom}</div>
      <div class="monnaie-ligne">🏷️ Ça coûte <strong>${labelEuros(prix)}</strong></div>
      <div class="monnaie-ligne">💵 Tu donnes <strong>${labelEuros(paye)}</strong></div>
      <div class="monnaie-ligne">💰 On te rend <strong>?</strong></div>
    </div>`;

    const dist = entiersDistincts(Math.max(1, monnaie - 200), Math.min(2000, monnaie + 300), 3, monnaie);
    const opts = melanger([monnaie, ...dist]);
    elChoix.innerHTML = "";
    opts.forEach((v) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn-choix";
      b.textContent = labelEuros(v);
      b.dataset.valeur = String(v);
      b.addEventListener("click", () => apresReponse(v, b, bonneReponse));
      elChoix.appendChild(b);
    });
  }

  // ── Symétrie ────────────────────────────────────────────────────────────

  function svgDemiFigure(type, taille, gauche) {
    const cx = taille / 2, cy = taille / 2, r = taille * 0.38;
    const g = gauche ? -1 : 1;
    let shape = "";
    if (type === 0) {
      // Demi-étoile
      const pts = [];
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * 2 * Math.PI - Math.PI / 2;
        pts.push(`${(cx + r * Math.cos(a) * g).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
        const a2 = a + Math.PI / 5;
        pts.push(`${(cx + r * 0.42 * Math.cos(a2) * g).toFixed(2)},${(cy + r * 0.42 * Math.sin(a2)).toFixed(2)}`);
      }
      shape = `<polygon points="${pts.join(" ")}" fill="#fdcb6e"/>`;
    } else if (type === 1) {
      // Demi-maison
      const bx = cx - r * 0.7 * g, bw = r * 1.4;
      shape = `<rect x="${Math.min(cx, cx - r * 0.7 * g)}" y="${cy}" width="${bw}" height="${r * 0.85}" fill="#00cec9"/>
        <polygon points="${cx},${cy - r * 0.6} ${cx - r * 0.8 * g},${cy} ${cx + r * 0.8 * g},${cy}" fill="#fd79a8"/>`;
    } else {
      // Demi-papillon
      const pts1 = `${cx},${cy} ${cx + r * 0.85 * g},${cy - r * 0.65} ${cx + r * 0.4 * g},${cy + r * 0.3}`;
      const pts2 = `${cx},${cy} ${cx + r * 0.85 * g},${cy + r * 0.65} ${cx + r * 0.4 * g},${cy - r * 0.3}`;
      shape = `<polygon points="${pts1}" fill="#6c5ce7" opacity="0.85"/>
        <polygon points="${pts2}" fill="#fd79a8" opacity="0.85"/>`;
    }
    return `<svg width="${taille}" height="${taille}" viewBox="0 0 ${taille} ${taille}">
      <line x1="${cx}" y1="4" x2="${cx}" y2="${taille - 4}" stroke="#c4b5f9" stroke-width="2" stroke-dasharray="5,3"/>
      ${shape}
    </svg>`;
  }

  function lancerSymetrie() {
    elTitre.textContent = "🪞";
    const type = Math.floor(Math.random() * 3);
    bonneReponse = 1; // correct = miroir (gauche=true)

    elQuestion.innerHTML = `<div class="symetrie-question">${svgDemiFigure(type, 130, false)}</div>`;

    const options = melanger([
      { val: 1, svg: svgDemiFigure(type, 78, true) },
      { val: 0, svg: svgDemiFigure(type, 78, false) },
      { val: 2, svg: svgDemiFigure((type + 1) % 3, 78, true) },
      { val: 3, svg: svgDemiFigure((type + 2) % 3, 78, false) },
    ]);

    elChoix.innerHTML = "";
    options.forEach(({ val, svg }) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn-choix btn-forme";
      b.innerHTML = svg;
      b.dataset.valeur = String(val);
      b.addEventListener("click", () => apresReponse(val, b, bonneReponse));
      elChoix.appendChild(b);
    });
  }

  // ── Jeux de lecture ──────────────────────────────────────────────────────

  const MOTS_SYLLABES_CP = [
    { mot: "maison",  parties: ["mai", "son"] },
    { mot: "lapin",   parties: ["la", "pin"] },
    { mot: "chapeau", parties: ["cha", "peau"] },
    { mot: "robot",   parties: ["ro", "bot"] },
    { mot: "vélo",    parties: ["vé", "lo"] },
    { mot: "ballon",  parties: ["bal", "lon"] },
    { mot: "sapin",   parties: ["sa", "pin"] },
    { mot: "bateau",  parties: ["ba", "teau"] },
    { mot: "soleil",  parties: ["so", "leil"] },
    { mot: "chaton",  parties: ["cha", "ton"] },
    { mot: "mouton",  parties: ["mou", "ton"] },
    { mot: "matin",   parties: ["ma", "tin"] },
    { mot: "pomme",   parties: ["pom", "me"] },
    { mot: "nuage",   parties: ["nu", "age"] },
    { mot: "tigre",   parties: ["ti", "gre"] },
  ];

  const MOTS_SYLLABES_CE1 = [
    { mot: "papillon",   parties: ["pa", "pil", "lon"] },
    { mot: "chocolat",   parties: ["cho", "co", "lat"] },
    { mot: "tomate",     parties: ["to", "ma", "te"] },
    { mot: "biberon",    parties: ["bi", "be", "ron"] },
    { mot: "camion",     parties: ["ca", "mi", "on"] },
    { mot: "princesse",  parties: ["prin", "ces", "se"] },
    { mot: "dinosaure",  parties: ["di", "no", "saure"] },
    { mot: "araignée",   parties: ["a", "rai", "gnée"] },
    { mot: "éléphant",   parties: ["é", "lé", "phant"] },
    { mot: "domino",     parties: ["do", "mi", "no"] },
    { mot: "girafe",     parties: ["gi", "ra", "fe"] },
    { mot: "tortue",     parties: ["tor", "tue"] },
    { mot: "ananas",     parties: ["a", "na", "nas"] },
    { mot: "carotte",    parties: ["ca", "rot", "te"] },
    { mot: "licorne",    parties: ["li", "cor", "ne"] },
  ];

  function lancerSyllabes() {
    elTitre.textContent = "📖 Syllabes";
    const liste = estCE1() ? MOTS_SYLLABES_CE1 : MOTS_SYLLABES_CP;
    const item = liste[Math.floor(Math.random() * liste.length)];
    const parties = item.parties;
    const indexCache = Math.floor(Math.random() * parties.length);
    const syllabeCachee = parties[indexCache];

    const affiche = parties.map((s, i) =>
      i === indexCache
        ? `<span style="color:var(--rose);border-bottom:3px solid var(--rose);padding:0 2px;min-width:2ch;display:inline-block">___</span>`
        : `<span>${s}</span>`
    ).join('<span style="opacity:0.4;margin:0 1px">·</span>');

    elQuestion.innerHTML =
      "<p>Quelle syllabe manque ?</p>" +
      `<p style="font-size:1.7rem;font-weight:700;color:var(--primaire);letter-spacing:0.04em;margin-top:0.5rem">${affiche}</p>`;

    const toutesListes = [...MOTS_SYLLABES_CP, ...MOTS_SYLLABES_CE1];
    const piscine = toutesListes.flatMap((m) => m.parties).filter((s) => s !== syllabeCachee);
    const distracteurs = melanger(piscine).slice(0, 3);
    const options = melanger([syllabeCachee, ...distracteurs]);
    bonneReponse = options.indexOf(syllabeCachee);

    elChoix.innerHTML = "";
    options.forEach((syl, idx) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn-choix";
      b.textContent = syl;
      b.dataset.valeur = String(idx);
      b.addEventListener("click", () => apresReponse(idx, b, bonneReponse));
      elChoix.appendChild(b);
    });
  }

  const MOTS_IMAGES_CP = [
    { emoji: "🐱", mot: "chat",      fausses: ["chien", "lapin", "ours"] },
    { emoji: "🐶", mot: "chien",     fausses: ["chat", "loup", "renard"] },
    { emoji: "🐰", mot: "lapin",     fausses: ["souris", "chat", "lièvre"] },
    { emoji: "🍎", mot: "pomme",     fausses: ["poire", "cerise", "orange"] },
    { emoji: "🌸", mot: "fleur",     fausses: ["arbre", "feuille", "fruit"] },
    { emoji: "🏠", mot: "maison",    fausses: ["château", "école", "garage"] },
    { emoji: "⭐", mot: "étoile",    fausses: ["lune", "soleil", "nuage"] },
    { emoji: "🌙", mot: "lune",      fausses: ["soleil", "étoile", "nuage"] },
    { emoji: "🐟", mot: "poisson",   fausses: ["requin", "crabe", "baleine"] },
    { emoji: "🚂", mot: "train",     fausses: ["bus", "avion", "bateau"] },
    { emoji: "🦁", mot: "lion",      fausses: ["tigre", "ours", "loup"] },
    { emoji: "🐸", mot: "grenouille",fausses: ["crapaud", "lézard", "serpent"] },
    { emoji: "🌈", mot: "arc-en-ciel",fausses: ["nuage", "soleil", "pluie"] },
    { emoji: "🎈", mot: "ballon",    fausses: ["bulle", "boule", "balle"] },
    { emoji: "🍓", mot: "fraise",    fausses: ["cerise", "tomate", "pomme"] },
  ];

  const MOTS_IMAGES_CE1 = [
    { emoji: "🦋", mot: "papillon",  fausses: ["libellule", "coccinelle", "abeille"] },
    { emoji: "🐘", mot: "éléphant",  fausses: ["hippopotame", "rhinocéros", "girafe"] },
    { emoji: "🚀", mot: "fusée",     fausses: ["avion", "hélicoptère", "satellite"] },
    { emoji: "🦊", mot: "renard",    fausses: ["loup", "chacal", "coyote"] },
    { emoji: "🐊", mot: "crocodile", fausses: ["alligator", "lézard", "iguane"] },
    { emoji: "🌋", mot: "volcan",    fausses: ["montagne", "colline", "falaise"] },
    { emoji: "🐙", mot: "pieuvre",   fausses: ["méduse", "calmar", "crabe"] },
    { emoji: "🦒", mot: "girafe",    fausses: ["zèbre", "éléphant", "chameau"] },
    { emoji: "🌵", mot: "cactus",    fausses: ["palmier", "bambou", "arbuste"] },
    { emoji: "🦜", mot: "perroquet", fausses: ["toucan", "flamant", "pélican"] },
    { emoji: "🐉", mot: "dragon",    fausses: ["dinosaure", "monstre", "serpent"] },
    { emoji: "🏔️", mot: "montagne",  fausses: ["colline", "falaise", "volcan"] },
  ];

  function lancerLecture() {
    elTitre.textContent = "📚 Lecture";
    const liste = estCE1() ? MOTS_IMAGES_CE1 : MOTS_IMAGES_CP;
    const item = liste[Math.floor(Math.random() * liste.length)];

    elQuestion.innerHTML =
      "<p style='font-size:0.95rem;margin-bottom:0.25rem'>Quel mot correspond à cette image ?</p>" +
      `<span style="font-size:4.5rem;line-height:1.2;display:block">${item.emoji}</span>`;

    const fausses = melanger(item.fausses).slice(0, 3);
    const options = melanger([item.mot, ...fausses]);
    bonneReponse = options.indexOf(item.mot);

    elChoix.innerHTML = "";
    options.forEach((mot, idx) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn-choix";
      b.style.fontSize = "1rem";
      b.textContent = mot;
      b.dataset.valeur = String(idx);
      b.addEventListener("click", () => apresReponse(idx, b, bonneReponse));
      elChoix.appendChild(b);
    });
  }

  // ── Jeux d'anglais ───────────────────────────────────────────────────────

  const ANGLAIS_IMAGES_CP = [
    { emoji: "🐱", mot: "cat",     fausses: ["dog", "bird", "fish"] },
    { emoji: "🐶", mot: "dog",     fausses: ["cat", "cow", "pig"] },
    { emoji: "🏠", mot: "house",   fausses: ["school", "car", "tree"] },
    { emoji: "🌳", mot: "tree",    fausses: ["flower", "grass", "leaf"] },
    { emoji: "⭐", mot: "star",    fausses: ["moon", "sun", "cloud"] },
    { emoji: "🌙", mot: "moon",    fausses: ["star", "sun", "sky"] },
    { emoji: "🍎", mot: "apple",   fausses: ["orange", "banana", "pear"] },
    { emoji: "🎈", mot: "balloon", fausses: ["ball", "bubble", "kite"] },
    { emoji: "📚", mot: "book",    fausses: ["pen", "bag", "desk"] },
    { emoji: "🚗", mot: "car",     fausses: ["bus", "bike", "boat"] },
    { emoji: "🌸", mot: "flower",  fausses: ["tree", "leaf", "plant"] },
    { emoji: "🐟", mot: "fish",    fausses: ["bird", "frog", "crab"] },
    { emoji: "☀️", mot: "sun",     fausses: ["moon", "star", "cloud"] },
    { emoji: "🍰", mot: "cake",    fausses: ["pie", "bread", "sweet"] },
    { emoji: "🐸", mot: "frog",    fausses: ["fish", "snake", "duck"] },
  ];

  const ANGLAIS_IMAGES_CE1 = [
    { emoji: "🦋", mot: "butterfly", fausses: ["dragonfly", "ladybug", "bee"] },
    { emoji: "🐘", mot: "elephant",  fausses: ["hippo", "rhino", "giraffe"] },
    { emoji: "🚀", mot: "rocket",    fausses: ["plane", "ship", "balloon"] },
    { emoji: "🌋", mot: "volcano",   fausses: ["mountain", "hill", "island"] },
    { emoji: "🦊", mot: "fox",       fausses: ["wolf", "bear", "deer"] },
    { emoji: "🌵", mot: "cactus",    fausses: ["palm", "bamboo", "bush"] },
    { emoji: "🦜", mot: "parrot",    fausses: ["eagle", "owl", "swan"] },
    { emoji: "🍕", mot: "pizza",     fausses: ["pasta", "burger", "salad"] },
    { emoji: "🌈", mot: "rainbow",   fausses: ["thunder", "storm", "cloud"] },
    { emoji: "🎸", mot: "guitar",    fausses: ["piano", "violin", "drum"] },
    { emoji: "🐙", mot: "octopus",   fausses: ["jellyfish", "squid", "crab"] },
    { emoji: "🦒", mot: "giraffe",   fausses: ["zebra", "elephant", "camel"] },
  ];

  function lancerAnglaisMots() {
    elTitre.textContent = "🇬🇧 English";
    const liste = estCE1() ? ANGLAIS_IMAGES_CE1 : ANGLAIS_IMAGES_CP;
    const item = liste[Math.floor(Math.random() * liste.length)];

    elQuestion.innerHTML =
      "<p style='font-size:0.95rem;margin-bottom:0.25rem'>What is this in English?</p>" +
      `<span style="font-size:4.5rem;line-height:1.2;display:block">${item.emoji}</span>`;

    const fausses = melanger(item.fausses).slice(0, 3);
    const options = melanger([item.mot, ...fausses]);
    bonneReponse = options.indexOf(item.mot);

    elChoix.innerHTML = "";
    options.forEach((mot, idx) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn-choix";
      b.style.fontSize = "1rem";
      b.textContent = mot;
      b.dataset.valeur = String(idx);
      b.addEventListener("click", () => apresReponse(idx, b, bonneReponse));
      elChoix.appendChild(b);
    });
  }

  const TRAD_CP = [
    { fr: "chat",   en: "cat",    fausses: ["dog", "bird", "fish"] },
    { fr: "chien",  en: "dog",    fausses: ["cat", "cow", "pig"] },
    { fr: "rouge",  en: "red",    fausses: ["blue", "green", "yellow"] },
    { fr: "bleu",   en: "blue",   fausses: ["red", "green", "pink"] },
    { fr: "un",     en: "one",    fausses: ["two", "three", "four"] },
    { fr: "deux",   en: "two",    fausses: ["one", "three", "five"] },
    { fr: "grand",  en: "big",    fausses: ["small", "tall", "old"] },
    { fr: "petit",  en: "small",  fausses: ["big", "tall", "young"] },
    { fr: "maison", en: "house",  fausses: ["school", "park", "shop"] },
    { fr: "livre",  en: "book",   fausses: ["pen", "bag", "desk"] },
    { fr: "ami",    en: "friend", fausses: ["family", "teacher", "baby"] },
    { fr: "eau",    en: "water",  fausses: ["milk", "juice", "tea"] },
    { fr: "chat",   en: "cat",    fausses: ["fox", "bear", "wolf"] },
    { fr: "soleil", en: "sun",    fausses: ["moon", "star", "cloud"] },
    { fr: "pomme",  en: "apple",  fausses: ["pear", "orange", "grape"] },
  ];

  const TRAD_CE1 = [
    { fr: "école",    en: "school",     fausses: ["house", "park", "church"] },
    { fr: "famille",  en: "family",     fausses: ["friend", "teacher", "team"] },
    { fr: "heureux",  en: "happy",      fausses: ["sad", "angry", "tired"] },
    { fr: "rapide",   en: "fast",       fausses: ["slow", "big", "loud"] },
    { fr: "beau",     en: "beautiful",  fausses: ["ugly", "strange", "plain"] },
    { fr: "manger",   en: "to eat",     fausses: ["to drink", "to sleep", "to run"] },
    { fr: "jouer",    en: "to play",    fausses: ["to eat", "to sleep", "to read"] },
    { fr: "courir",   en: "to run",     fausses: ["to jump", "to walk", "to swim"] },
    { fr: "dormir",   en: "to sleep",   fausses: ["to eat", "to run", "to dream"] },
    { fr: "pays",     en: "country",    fausses: ["city", "town", "village"] },
    { fr: "mer",      en: "sea",        fausses: ["lake", "river", "pond"] },
    { fr: "fleur",    en: "flower",     fausses: ["tree", "leaf", "grass"] },
  ];

  function lancerTraduction() {
    elTitre.textContent = "🇬🇧 Traduction";
    const liste = estCE1() ? TRAD_CE1 : TRAD_CP;
    const item = liste[Math.floor(Math.random() * liste.length)];

    elQuestion.innerHTML =
      "<p style='font-size:0.9rem;margin-bottom:0.4rem'>Comment dit-on en anglais ?</p>" +
      `<p style="font-size:2.2rem;font-weight:700;color:var(--primaire);margin:0">${item.fr}</p>`;

    const fausses = melanger(item.fausses).slice(0, 3);
    const options = melanger([item.en, ...fausses]);
    bonneReponse = options.indexOf(item.en);

    elChoix.innerHTML = "";
    options.forEach((mot, idx) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn-choix";
      b.style.fontSize = "1rem";
      b.textContent = mot;
      b.dataset.valeur = String(idx);
      b.addEventListener("click", () => apresReponse(idx, b, bonneReponse));
      elChoix.appendChild(b);
    });
  }

  // ── Durées ───────────────────────────────────────────────────────────────

  function lancerDurees() {
    elTitre.textContent = "⏱️";
    let debutH, debutM, dureeMin, texteduree;

    if (!estCE1()) {
      debutH = 8 + Math.floor(Math.random() * 9);
      debutM = 0;
      dureeMin = [30, 60][Math.floor(Math.random() * 2)];
      texteduree = dureeMin === 60 ? "1 heure" : "30 minutes";
    } else {
      debutH = 8 + Math.floor(Math.random() * 9);
      debutM = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
      const durees = [15, 30, 45, 60, 90, 120];
      dureeMin = durees[Math.floor(Math.random() * durees.length)];
      if (dureeMin < 60) texteduree = dureeMin + " minutes";
      else if (dureeMin === 60) texteduree = "1 heure";
      else if (dureeMin === 90) texteduree = "1h30";
      else texteduree = "2 heures";
    }

    const debutMin = debutH * 60 + debutM;
    const finMin = debutMin + dureeMin;
    bonneReponse = finMin;

    const activites = ["Tu joues", "Tu lis", "Tu dessines", "Tu danses", "Tu fais du vélo"];
    const acti = activites[Math.floor(Math.random() * activites.length)];
    const affH = debutH + "h" + String(debutM).padStart(2, "0");

    elQuestion.innerHTML = `<div class="duree-question">
      <div class="grande-horloge">${svgHorloge(debutH || 12, debutM, 120)}</div>
      <p>Il est <strong>${affH}</strong>.</p>
      <p>${acti} pendant <strong>${texteduree}</strong>.</p>
      <p>À quelle heure tu t'arrêtes ?</p>
    </div>`;

    const fausses = [-60, -45, -30, -15, 15, 30, 45, 60, 90]
      .map(d => finMin + d)
      .filter(t => t > 0 && t !== finMin && Math.floor(t / 60) < 24);
    afficherChoixHorloge(melanger([finMin, ...melanger(fausses).slice(0, 3)]));
  }

  // ── Problème du jour ─────────────────────────────────────────────────────

  const PROBLEMES = {
    cp: [
      { generer() {
        const a = 4 + Math.floor(Math.random() * 5);
        const b = 1 + Math.floor(Math.random() * (a - 1));
        return { texte: `Léa a <strong>${a}</strong> 🍎. Elle en mange <strong>${b}</strong>. Combien en reste-t-il ?`, rep: a - b, min: 0, max: a + 2 };
      } },
      { generer() {
        const a = 2 + Math.floor(Math.random() * 5);
        const b = 1 + Math.floor(Math.random() * 4);
        return { texte: `Tom a <strong>${a}</strong> billes 🔵. Son ami lui en donne <strong>${b}</strong>. Combien en a-t-il maintenant ?`, rep: a + b, min: a, max: a + b + 4 };
      } },
      { generer() {
        const a = 2 + Math.floor(Math.random() * 5);
        const b = 2 + Math.floor(Math.random() * 5);
        return { texte: `Il y a <strong>${a}</strong> 🐱 dans le jardin et <strong>${b}</strong> dans la maison. Combien de chats en tout ?`, rep: a + b, min: Math.max(2, a + b - 4), max: a + b + 4 };
      } },
      { generer() {
        const a = 5 + Math.floor(Math.random() * 5);
        const b = 1 + Math.floor(Math.random() * (a - 1));
        return { texte: `On avait <strong>${a}</strong> 🎈 ballons. <strong>${b}</strong> se sont envolés. Combien en reste-t-il ?`, rep: a - b, min: 0, max: a };
      } },
      { generer() {
        const g = 3 + Math.floor(Math.random() * 5);
        const f = 3 + Math.floor(Math.random() * 5);
        return { texte: `Dans la classe, <strong>${g}</strong> 👦 garçons et <strong>${f}</strong> 👧 filles. Combien d'élèves en tout ?`, rep: g + f, min: g + f - 4, max: g + f + 4 };
      } },
    ],
    ce1: [
      { generer() {
        const a = 20 + Math.floor(Math.random() * 40);
        const b = 10 + Math.floor(Math.random() * 20);
        return { texte: `Une bibliothèque a <strong>${a}</strong> livres de BD et <strong>${b}</strong> livres de contes. Combien de livres au total ?`, rep: a + b, min: a + b - 15, max: a + b + 15 };
      } },
      { generer() {
        const tot = 30 + Math.floor(Math.random() * 40);
        const p = 5 + Math.floor(Math.random() * 20);
        return { texte: `Le bus a <strong>${tot}</strong> passagers 🚌. À l'arrêt, <strong>${p}</strong> descendent. Combien reste-t-il ?`, rep: tot - p, min: Math.max(0, tot - p - 12), max: tot - p + 12 };
      } },
      { generer() {
        const t = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
        const n = 3 + Math.floor(Math.random() * 7);
        return { texte: `Il y a <strong>${n}</strong> boîtes avec <strong>${t}</strong> 🍪 biscuits chacune. Combien de biscuits en tout ?`, rep: n * t, min: Math.max(2, n * t - 10), max: n * t + 10 };
      } },
      { generer() {
        const t = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
        const q = 2 + Math.floor(Math.random() * 8);
        return { texte: `On partage <strong>${t * q}</strong> 🍬 bonbons entre <strong>${t}</strong> enfants. Combien pour chacun ?`, rep: q, min: Math.max(1, q - 4), max: q + 4 };
      } },
      { generer() {
        const a = 20 + Math.floor(Math.random() * 30);
        const b = 5 + Math.floor(Math.random() * (a - 5));
        return { texte: `Lucie a économisé <strong>${a}</strong> € 💰. Elle dépense <strong>${b}</strong> €. Combien lui reste-t-il ?`, rep: a - b, min: Math.max(0, a - b - 10), max: a - b + 10 };
      } },
    ],
  };

  function lancerProbleme() {
    elTitre.textContent = "📖";
    const pool = estCE1() ? PROBLEMES.ce1 : PROBLEMES.cp;
    const tmpl = pool[Math.floor(Math.random() * pool.length)];
    const { texte, rep, min, max } = tmpl.generer();
    bonneReponse = rep;
    elQuestion.innerHTML = `<div class="probleme-question"><p>${texte}</p></div>`;
    const props = propositionsAvecBonne(rep, Math.max(0, min), Math.max(max, min + 5), 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, bonneReponse));
  }

  // ── Masse ────────────────────────────────────────────────────────────────

  const OBJETS_MASSE = [
    { emoji: "🍎", nom: "une pomme",    masse: 200 },
    { emoji: "📚", nom: "un livre",     masse: 500 },
    { emoji: "🧸", nom: "un doudou",    masse: 300 },
    { emoji: "⚽", nom: "un ballon",    masse: 400 },
    { emoji: "🍌", nom: "une banane",   masse: 150 },
    { emoji: "🥛", nom: "1 L de lait", masse: 1000 },
    { emoji: "🍫", nom: "un chocolat", masse: 100 },
    { emoji: "🎒", nom: "un cartable",  masse: 2000 },
    { emoji: "🐱", nom: "un chat",      masse: 4000 },
    { emoji: "🐶", nom: "un chien",     masse: 6000 },
  ];

  function formatMasse(g) {
    if (g >= 1000 && g % 1000 === 0) return (g / 1000) + " kg";
    if (g >= 1000) return Math.floor(g / 1000) + " kg " + (g % 1000) + " g";
    return g + " g";
  }

  function lancerMasse() {
    elTitre.textContent = "⚖️";
    const deux = melanger(OBJETS_MASSE).slice(0, 2);
    const [objA, objB] = deux;

    if (!estCE1()) {
      if (objA.masse === objB.masse) { lancerMasse(); return; }
      bonneReponse = objA.masse > objB.masse ? 0 : 1;
      elQuestion.innerHTML = `<div class="masse-question">
        <p>Lequel est le plus <strong>lourd</strong> ?</p>
        <div class="masse-objets">
          <div class="masse-objet">${objA.emoji}<br><span class="masse-val">${formatMasse(objA.masse)}</span></div>
          <div class="masse-vs">ou</div>
          <div class="masse-objet">${objB.emoji}<br><span class="masse-val">${formatMasse(objB.masse)}</span></div>
        </div>
      </div>`;
      elChoix.innerHTML = "";
      [{ val: 0, obj: objA }, { val: 1, obj: objB }].forEach(({ val, obj }) => {
        const b = document.createElement("button");
        b.type = "button"; b.className = "btn-choix";
        b.textContent = obj.emoji + " " + formatMasse(obj.masse);
        b.dataset.valeur = String(val);
        b.addEventListener("click", () => apresReponse(val, b, bonneReponse));
        elChoix.appendChild(b);
      });
    } else {
      const total = objA.masse + objB.masse;
      bonneReponse = total;
      elQuestion.innerHTML = `<div class="masse-question">
        <p>${objA.emoji} ${objA.nom} pèse <strong>${formatMasse(objA.masse)}</strong>.</p>
        <p>${objB.emoji} ${objB.nom} pèse <strong>${formatMasse(objB.masse)}</strong>.</p>
        <p>Combien pèsent-ils <strong>ensemble</strong> ?</p>
      </div>`;
      const step = total >= 1000 ? 500 : 50;
      const fausses = [-3, -2, -1, 1, 2, 3]
        .map(d => total + d * step)
        .filter(v => v > 0 && v !== total);
      const opts = melanger([total, ...melanger(fausses).slice(0, 3)]);
      elChoix.innerHTML = "";
      opts.forEach(v => {
        const b = document.createElement("button");
        b.type = "button"; b.className = "btn-choix";
        b.textContent = formatMasse(v);
        b.dataset.valeur = String(v);
        b.addEventListener("click", () => apresReponse(v, b, bonneReponse));
        elChoix.appendChild(b);
      });
    }
  }

  // ── Périmètre ────────────────────────────────────────────────────────────

  function svgPerimetre(type, a, b) {
    const W = 260, H = 190;
    let shape = "", labels = "";
    const fs = 15, fw = 700, fc = "#5344c7";

    if (type === "carre") {
      const s = 100, x0 = (W - s) / 2, y0 = (H - s) / 2;
      shape = `<rect x="${x0}" y="${y0}" width="${s}" height="${s}" fill="#f0eeff" stroke="#6c5ce7" stroke-width="3" rx="3"/>`;
      labels += `<text x="${W/2}" y="${y0-10}" text-anchor="middle" font-size="${fs}" font-weight="${fw}" fill="${fc}">${a} cm</text>`;
      labels += `<text x="${W/2}" y="${y0+s+20}" text-anchor="middle" font-size="${fs}" font-weight="${fw}" fill="${fc}">${a} cm</text>`;
      labels += `<text x="${x0-10}" y="${H/2+5}" text-anchor="end" font-size="${fs}" font-weight="${fw}" fill="${fc}">${a} cm</text>`;
      labels += `<text x="${x0+s+10}" y="${H/2+5}" text-anchor="start" font-size="${fs}" font-weight="${fw}" fill="${fc}">${a} cm</text>`;
    } else if (type === "rectangle") {
      const rw = 150, rh = 80, x0 = (W - rw) / 2, y0 = (H - rh) / 2;
      shape = `<rect x="${x0}" y="${y0}" width="${rw}" height="${rh}" fill="#f0eeff" stroke="#6c5ce7" stroke-width="3" rx="3"/>`;
      labels += `<text x="${W/2}" y="${y0-10}" text-anchor="middle" font-size="${fs}" font-weight="${fw}" fill="${fc}">${a} cm</text>`;
      labels += `<text x="${W/2}" y="${y0+rh+20}" text-anchor="middle" font-size="${fs}" font-weight="${fw}" fill="${fc}">${a} cm</text>`;
      labels += `<text x="${x0-10}" y="${H/2+5}" text-anchor="end" font-size="${fs}" font-weight="${fw}" fill="${fc}">${b} cm</text>`;
      labels += `<text x="${x0+rw+10}" y="${H/2+5}" text-anchor="start" font-size="${fs}" font-weight="${fw}" fill="${fc}">${b} cm</text>`;
    } else {
      const side = 110, cx = W / 2, cy = H / 2 + 10;
      const th = side * Math.sqrt(3) / 2;
      const p1 = `${cx.toFixed(1)},${(cy - th * 0.65).toFixed(1)}`;
      const p2 = `${(cx - side / 2).toFixed(1)},${(cy + th * 0.35).toFixed(1)}`;
      const p3 = `${(cx + side / 2).toFixed(1)},${(cy + th * 0.35).toFixed(1)}`;
      shape = `<polygon points="${p1} ${p2} ${p3}" fill="#f0eeff" stroke="#6c5ce7" stroke-width="3"/>`;
      labels += `<text x="${cx}" y="${(cy + th * 0.35 + 18).toFixed(1)}" text-anchor="middle" font-size="${fs}" font-weight="${fw}" fill="${fc}">${a} cm</text>`;
      labels += `<text x="${(cx - side / 4 - 14).toFixed(1)}" y="${(cy - th * 0.15).toFixed(1)}" text-anchor="end" font-size="${fs}" font-weight="${fw}" fill="${fc}">${a} cm</text>`;
      labels += `<text x="${(cx + side / 4 + 14).toFixed(1)}" y="${(cy - th * 0.15).toFixed(1)}" text-anchor="start" font-size="${fs}" font-weight="${fw}" fill="${fc}">${a} cm</text>`;
    }
    return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="font-family:Fredoka,sans-serif">${shape}${labels}</svg>`;
  }

  function lancerPerimetre() {
    elTitre.textContent = "🔲";
    const maxC = estCE1() ? 15 : 8;
    const types = estCE1() ? ["carre", "rectangle", "triangle"] : ["carre", "rectangle"];
    const type = types[Math.floor(Math.random() * types.length)];

    let a, b, perimetre;
    if (type === "carre") {
      a = 2 + Math.floor(Math.random() * (maxC - 1)); b = a;
      perimetre = 4 * a;
    } else if (type === "rectangle") {
      a = 2 + Math.floor(Math.random() * (maxC - 1));
      do { b = 2 + Math.floor(Math.random() * (maxC - 1)); } while (b === a);
      perimetre = 2 * (a + b);
    } else {
      a = 2 + Math.floor(Math.random() * (maxC - 1)); b = a;
      perimetre = 3 * a;
    }
    bonneReponse = perimetre;

    const noms = { carre: "carré", rectangle: "rectangle", triangle: "triangle équilatéral" };
    elQuestion.innerHTML = `<div class="perimetre-question">
      <p>Calcule le <strong>périmètre</strong> de ce ${noms[type]} (en cm).</p>
      ${svgPerimetre(type, a, b)}
    </div>`;

    const props = propositionsAvecBonne(perimetre, Math.max(4, perimetre - 12), perimetre + 14, 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, bonneReponse));
  }

  // ── Angles ───────────────────────────────────────────────────────────────

  function svgAngle(degres, taille) {
    const cx = taille * 0.22, cy = taille * 0.74;
    const lon = taille * 0.6;
    const rad = degres * Math.PI / 180;
    const x1 = cx + lon, y1 = cy;
    const x2 = (cx + lon * Math.cos(rad)).toFixed(2);
    const y2 = (cy - lon * Math.sin(rad)).toFixed(2);

    let mark = "";
    if (degres === 90) {
      const sq = taille * 0.13;
      mark = `<path d="M${(cx + sq).toFixed(1)},${cy} L${(cx + sq).toFixed(1)},${(cy - sq).toFixed(1)} L${cx},${(cy - sq).toFixed(1)}" fill="none" stroke="#6c5ce7" stroke-width="2"/>`;
    } else {
      const r = taille * 0.2;
      const ax = (cx + r * Math.cos(rad)).toFixed(2);
      const ay = (cy - r * Math.sin(rad)).toFixed(2);
      mark = `<path d="M${(cx + r).toFixed(1)},${cy} A${r},${r} 0 0 0 ${ax},${ay}" fill="#c4b5f9" opacity="0.55" stroke="#6c5ce7" stroke-width="1.5"/>`;
    }
    return `<svg width="${taille}" height="${taille}" viewBox="0 0 ${taille} ${taille}" xmlns="http://www.w3.org/2000/svg">
      <line x1="${cx}" y1="${cy}" x2="${x1}" y2="${y1}" stroke="#5344c7" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="#5344c7" stroke-width="3.5" stroke-linecap="round"/>
      ${mark}
      <circle cx="${cx}" cy="${cy}" r="5" fill="#5344c7"/>
    </svg>`;
  }

  function lancerAngles() {
    elTitre.textContent = "📐";
    let degres, bonneVal;

    if (!estCE1()) {
      if (Math.random() < 0.5) {
        degres = 90; bonneVal = 0;
      } else {
        degres = Math.random() < 0.5
          ? 15 + Math.floor(Math.random() * 55)
          : 110 + Math.floor(Math.random() * 55);
        bonneVal = 1;
      }
      bonneReponse = bonneVal;
      elQuestion.innerHTML = `<div class="angle-question">${svgAngle(degres, 160)}</div>`;
      elChoix.innerHTML = "";
      [{ val: 0, label: "Angle droit" }, { val: 1, label: "Pas droit" }].forEach(({ val, label }) => {
        const b = document.createElement("button");
        b.type = "button"; b.className = "btn-choix";
        b.textContent = label; b.dataset.valeur = String(val);
        b.addEventListener("click", () => apresReponse(val, b, bonneReponse));
        elChoix.appendChild(b);
      });
    } else {
      const idx = Math.floor(Math.random() * 3);
      if (idx === 0) { degres = 90; bonneVal = 0; }
      else if (idx === 1) { degres = 15 + Math.floor(Math.random() * 60); bonneVal = 1; }
      else { degres = 110 + Math.floor(Math.random() * 55); bonneVal = 2; }
      bonneReponse = bonneVal;
      elQuestion.innerHTML = `<div class="angle-question">${svgAngle(degres, 160)}</div>`;
      elChoix.innerHTML = "";
      [
        { val: 0, label: "Droit (90°)" },
        { val: 1, label: "Aigu (< 90°)" },
        { val: 2, label: "Obtus (> 90°)" },
      ].forEach(({ val, label }, i) => {
        const b = document.createElement("button");
        b.type = "button"; b.className = "btn-choix";
        b.textContent = label; b.dataset.valeur = String(val);
        if (i === 2) b.style.gridColumn = "1 / -1";
        b.addEventListener("click", () => apresReponse(val, b, bonneReponse));
        elChoix.appendChild(b);
      });
    }
  }

  const lanceurs = {
    compte: lancerCompte,
    addition: lancerAddition,
    soustraction: lancerSoustraction,
    compare: lancerCompare,
    suite: lancerSuite,
    doubles: lancerDoubles,
    heure: lancerHeure,
    pairimpair: lancerPairImpair,
    dizaines: lancerDizaines,
    formes: lancerFormes,
    monnaiecp: lancerMonnaieCp,
    moitie: lancerMoitie,
    multiplication: lancerMultiplication,
    division: lancerDivision,
    fractions: lancerFractions,
    mesures: lancerMesures,
    monnaiece1: lancerMonnaieCe1,
    symetrie: lancerSymetrie,
    syllabes: lancerSyllabes,
    lecture: lancerLecture,
    anglais: lancerAnglaisMots,
    traduction: lancerTraduction,
    durees: lancerDurees,
    probleme: lancerProbleme,
    masse: lancerMasse,
    perimetre: lancerPerimetre,
    angles: lancerAngles,
  };

  function montrerMenu() {
    jeuCourant = null;
    setBadgeVisible(false);
    elGenre.hidden = true;
    elGenre.classList.remove("actif");
    elJeu.hidden = true;
    elJeu.classList.remove("actif");
    const elMaison = document.getElementById("ecran-maison");
    if (elMaison) { elMaison.hidden = true; elMaison.classList.remove("actif"); }
    elMenu.hidden = false;
    elMenu.classList.add("actif");
    majGenre();
  }

  function montrerMaison() {
    const elMaison = document.getElementById("ecran-maison");
    if (!elMaison) return;
    elMenu.hidden = true;
    elMenu.classList.remove("actif");
    elMaison.hidden = false;
    elMaison.classList.add("actif");

    const etoiles = lireEtoiles();
    const stade   = getStade(etoiles);
    const s       = RENARD_STADES[stade];
    const nom     = lireNomRenard() || "Foxy";

    const triste = lireFaim() < 20 || lireBonheur() < 20;
    document.getElementById("maison-renard").innerHTML = svgRenard(stade, 160, { triste, accessoires: Object.keys(lireTenue()) });
    document.getElementById("maison-nom").textContent  = nom;
    document.getElementById("maison-stade").textContent = "✦ " + s.nom;
    document.getElementById("maison-etoiles-total").textContent = etoiles;

    // Jours depuis naissance
    const naissance = localStorage.getItem(RENARD_NAISSANCE_KEY);
    if (naissance) {
      const jours = Math.max(0, Math.floor((Date.now() - new Date(naissance).getTime()) / 86400000));
      document.getElementById("maison-jours").textContent =
        jours === 0 ? `Tu as ${nom} depuis aujourd'hui !`
                    : `Tu as ${nom} depuis ${jours} jour${jours > 1 ? "s" : ""} !`;
    }

    // Barre de progression vers prochain stade
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

    // Jauges faim / bonheur
    function majJaugeEl(id, barreId, valId, val) {
      document.getElementById(barreId).style.width = val + "%";
      document.getElementById(valId).textContent = Math.round(val) + "%";
    }
    majJaugeEl("faim",    "jauge-faim-barre",    "jauge-faim-val",    lireFaim());
    majJaugeEl("bonheur", "jauge-bonheur-barre",  "jauge-bonheur-val", lireBonheur());

    // Bouton Nourrir
    const btnNourrir = document.getElementById("btn-nourrir");
    btnNourrir.disabled = etoiles < 2 || lireFaim() >= 95;
    btnNourrir.onclick = () => {
      if (lireEtoiles() < 2) return;
      const t = lireEtoiles() - 2;
      localStorage.setItem(STORAGE_KEY, String(t));
      elTotal.textContent = t;
      sauverFaim(lireFaim() + 30);
      mettreAJourRenardHeader();
      montrerMaison();
    };

    // Bouton Câlin
    const btnCalin = document.getElementById("btn-calin");
    const peutCalin = peutFaireCalin();
    btnCalin.disabled = !peutCalin;
    document.getElementById("calin-dispo-label").textContent =
      peutCalin ? "1× par jour" : "✓ Déjà fait !";
    btnCalin.onclick = () => {
      if (!peutFaireCalin()) return;
      localStorage.setItem(RENARD_CALIN_DATE_KEY, new Date().toISOString().slice(0, 10));
      sauverBonheur(lireBonheur() + 20);
      mettreAJourRenardHeader();
      montrerMaison();
    };
  }

  function montrerDressing() {
    const elDressing = document.getElementById("ecran-dressing");
    const elMaison   = document.getElementById("ecran-maison");
    if (!elDressing) return;
    elMaison.hidden = true;
    elMaison.classList.remove("actif");
    elDressing.hidden = false;
    elDressing.classList.add("actif");

    const stade    = getStade(lireEtoiles());
    const nom      = lireNomRenard() || "Foxy";
    const debloques = lireAccessoires();
    const tenue    = lireTenue();

    document.getElementById("dressing-sous-titre").textContent =
      `${nom} peut porter ${debloques.length} accessoire${debloques.length !== 1 ? "s" : ""} !`;

    // Aperçu du renard avec la tenue actuelle
    document.getElementById("dressing-preview").innerHTML =
      svgRenard(stade, 120, { accessoires: Object.keys(tenue) });

    // Grille de tous les accessoires connus
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

  function montrerJeu(nom) {
    jeuCourant = nom;
    comboActuel = 0;
    elMenu.hidden = true;
    elMenu.classList.remove("actif");
    elJeu.hidden = false;
    elJeu.classList.add("actif");
    setBadgeVisible(true);
    resetFeedback();
    lanceurs[nom]();
  }

  function questionSuivante() {
    resetFeedback();
    if (jeuCourant && lanceurs[jeuCourant]) lanceurs[jeuCourant]();
  }

  document.querySelectorAll(".carte-jeu").forEach((btn) => {
    btn.addEventListener("click", () => montrerJeu(btn.dataset.jeu));
  });

  btnRetour.addEventListener("click", montrerMenu);
  elSuivant.addEventListener("click", questionSuivante);

  // ── Sélection du genre ────────────────────────────────────────────────────
  document.querySelectorAll(".btn-genre").forEach((btn) => {
    btn.addEventListener("click", () => {
      sauverGenre(btn.dataset.genre);
      montrerMenu();
    });
  });

  // Bouton discret "changer de profil" dans le menu
  const btnChangerGenre = document.getElementById("btn-changer-genre");
  if (btnChangerGenre) {
    btnChangerGenre.addEventListener("click", () => {
      elMenu.hidden = true;
      elMenu.classList.remove("actif");
      elGenre.hidden = false;
      elGenre.classList.add("actif");
    });
  }

  // Bouton Ma Maison
  const btnMaison = document.getElementById("btn-maison");
  if (btnMaison) btnMaison.addEventListener("click", montrerMaison);

  // Retour depuis Ma Maison
  const btnRetourMaison = document.getElementById("btn-retour-maison");
  if (btnRetourMaison) btnRetourMaison.addEventListener("click", montrerMenu);

  // Dressing
  const btnDressing = document.getElementById("btn-dressing");
  if (btnDressing) btnDressing.addEventListener("click", montrerDressing);
  const btnRetourDressing = document.getElementById("btn-retour-dressing");
  if (btnRetourDressing) btnRetourDressing.addEventListener("click", () => {
    const elDressing = document.getElementById("ecran-dressing");
    const elMaison   = document.getElementById("ecran-maison");
    elDressing.hidden = true;
    elDressing.classList.remove("actif");
    montrerMaison();
  });
})();
