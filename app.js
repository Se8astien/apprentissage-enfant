(function () {
  "use strict";

  const STORAGE_KEY = "maths-cp-etoiles";
  const STORAGE_NIVEAU = "maths-cp-niveau";
  const STORAGE_GENRE = "maths-cp-genre";
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
    if (desc) desc.textContent = estCE1() ? "Jusqu'à 20" : "Jusqu'à 10";
  }

  function setBadgeVisible(visible) {
    if (!elBadge) return;
    if (visible) {
      elBadge.hidden = false;
      elBadge.textContent = estCE1() ? "Niveau : fin CP — début CE1" : "Niveau : CP";
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

  elTotal.textContent = lireEtoiles();
  syncNiveauButtons();
  majLabelsMenu();

  // ── Démarrage : genre screen ou menu direct ───────────────────────────────
  if (localStorage.getItem(STORAGE_GENRE)) {
    majGenre();
    montrerMenu();
  } else {
    // Écran genre déjà actif dans le HTML, rien à faire
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
      const ok = messagesOk();
      elFeedback.textContent = ok[Math.floor(Math.random() * ok.length)];
      elFeedback.className = "feedback ok";
      ajouterEtoiles(1);
      confetti();
    } else {
      const ko = messagesKo();
      elFeedback.textContent = ko[Math.floor(Math.random() * ko.length)];
      elFeedback.className = "feedback non";
    }
    elSuivant.hidden = false;
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

    total = 11 + Math.floor(Math.random() * 10);
    a = 1 + Math.floor(Math.random() * (total - 1));
    b = total - a;

    if (total <= 12) {
      const e1 = ANIMAUX[Math.floor(Math.random() * ANIMAUX.length)];
      let e2 = ANIMAUX[Math.floor(Math.random() * ANIMAUX.length)];
      if (e2 === e1) e2 = ANIMAUX[(ANIMAUX.indexOf(e1) + 1) % ANIMAUX.length];
      html =
        "<p>Combien en tout ?</p>" +
        '<p class="ligne-emojis petit">' +
        Array(a).fill(e1).join(" ") +
        " <span style='opacity:.5'>+</span> " +
        Array(b).fill(e2).join(" ") +
        "</p>" +
        '<p class="equation">' +
        a +
        " + " +
        b +
        " = ?</p>";
    } else {
      html =
        "<p>Calcul mental — combien font :</p>" +
        '<p class="equation" style="font-size:2rem;margin-top:.75rem">' +
        a +
        " + " +
        b +
        " = ?</p>";
    }

    elQuestion.innerHTML = html;
    bonneReponse = total;
    const pmin = Math.max(2, total - 8);
    const pmax = Math.min(20, total + 8);
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
      total = 10 + Math.floor(Math.random() * 11);
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
      ? propositionsAvecBonne(reste, Math.max(0, reste - 7), Math.min(20, reste + 7), 3)
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
      a = 10 + Math.floor(Math.random() * 90);
      b = 10 + Math.floor(Math.random() * 90);
    }
    if (a === b) b = b < 99 ? b + 1 : b - 1;
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
    let debut;
    if (!estCE1()) {
      debut = 1 + Math.floor(Math.random() * 12);
    } else {
      debut = 15 + Math.floor(Math.random() * 46);
    }
    const suite = [debut, debut + 1, debut + 2, debut + 3, debut + 4];
    const indexCache = 1 + Math.floor(Math.random() * 3);
    bonneReponse = suite[indexCache];
    const affiche = suite.map((n, i) => (i === indexCache ? "?" : String(n)));
    elQuestion.innerHTML =
      "<p>Quel chiffre manque dans la suite ?</p>" +
      '<p class="suite">' +
      affiche.join(" — ") +
      "</p>";
    const min = Math.max(1, debut - 2);
    const max = debut + 6;
    const props = propositionsAvecBonne(bonneReponse, min, max, 3);
    afficherChoix(props, (val, btn) => apresReponse(val, btn, bonneReponse));
  }

  function lancerDoubles() {
    elTitre.textContent = "Doubles";
    const n = estCE1() ? 5 + Math.floor(Math.random() * 6) : 1 + Math.floor(Math.random() * 5);
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
      ? propositionsAvecBonne(d, Math.max(8, d - 6), Math.min(24, d + 6), 3)
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

    elQuestion.innerHTML = `<div class="grande-horloge">${svgHorloge(bonneH || 12, bonneM, 160)}</div>`;
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
    const max = estCE1() ? 40 : 20;
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

  const LABELS_FORMES = {
    cercle: "Cercle",
    carré: "Carré",
    rectangle: "Rectangle",
    triangle: "Triangle",
    losange: "Losange",
  };

  function lancerFormes() {
    elTitre.textContent = "🔷";
    const idx = Math.floor(Math.random() * FORMES.length);
    const forme = FORMES[idx];
    const couleurQ = COULEURS_FORMES[Math.floor(Math.random() * COULEURS_FORMES.length)];
    bonneReponse = idx;

    elQuestion.innerHTML = `<div class="forme-question">
      <p>Comment s'appelle cette forme ?</p>
      ${svgForme(forme, 150, couleurQ)}
    </div>`;

    const autresIdx = melanger(FORMES.map((_, i) => i).filter((i) => i !== idx)).slice(0, 3);
    const optionsIdx = melanger([idx, ...autresIdx]);

    elChoix.innerHTML = "";
    optionsIdx.forEach((i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn-choix";
      b.textContent = LABELS_FORMES[FORMES[i]];
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

    elQuestion.innerHTML = `<p>Combien valent ces pièces en tout ?</p>${svgPiecesLigne(chosenPieces)}`;

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
    const maxMoitie = estCE1() ? 20 : 10;
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
    const diviseurs = estCE1() ? [2, 3, 4, 5] : [2, 3];
    const diviseur = diviseurs[Math.floor(Math.random() * diviseurs.length)];
    const maxQuot = estCE1() ? 8 : 5;
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

  function lancerMonnaieCe1() {
    elTitre.textContent = "🛍️";
    const prixOptions = [50, 100, 150, 200, 250, 300];
    const prix = prixOptions[Math.floor(Math.random() * prixOptions.length)];
    const billets = [100, 200, 500].filter((b) => b > prix);
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

    const dist = entiersDistincts(Math.max(1, monnaie - 100), Math.min(500, monnaie + 150), 3, monnaie);
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
  };

  function montrerMenu() {
    jeuCourant = null;
    setBadgeVisible(false);
    elGenre.hidden = true;
    elGenre.classList.remove("actif");
    elJeu.hidden = true;
    elJeu.classList.remove("actif");
    elMenu.hidden = false;
    elMenu.classList.add("actif");
    majGenre();
  }

  function montrerJeu(nom) {
    jeuCourant = nom;
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
})();
