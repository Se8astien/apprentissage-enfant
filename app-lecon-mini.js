// app-lecon-mini.js — Mini-leçon ciblée après 3 erreurs sur un même jeu

const LECONS = {
  addition: {
    emoji: "➕",
    titre: "Rappel : l'addition",
    texte: "Additionner = mettre des quantités ensemble pour trouver le total.",
    etapes: ["Part du plus grand nombre", "Avance du plus petit", "Ex : 7 + 3 → pars de 7, avance de 3 → 10"],
  },
  soustraction: {
    emoji: "➖",
    titre: "Rappel : la soustraction",
    texte: "Soustraire = enlever une quantité. Le résultat est toujours plus petit.",
    etapes: ["Commence par écrire la grande valeur", "Enlève la petite", "Ex : 9 − 4 → retire 4 de 9 → 5"],
  },
  multiplication: {
    emoji: "✖️",
    titre: "Rappel : la multiplication",
    texte: "Multiplier = faire des groupes de même taille.",
    etapes: ["3 × 4 = 3 groupes de 4", "Ou 4 groupes de 3 (même chose)", "Apprends ta table pour aller plus vite !"],
  },
  division: {
    emoji: "➗",
    titre: "Rappel : la division",
    texte: "Diviser = partager équitablement. Le résultat est plus petit.",
    etapes: ["12 ÷ 3 : combien de fois 3 entre dans 12 ?", "3 × 4 = 12, donc 12 ÷ 3 = 4", "Utilise ta table de multiplication à l'envers"],
  },
  fractions: {
    emoji: "🍕",
    titre: "Rappel : les fractions",
    texte: "Une fraction montre combien de parts d'un tout on prend.",
    etapes: ["Le chiffre du bas = nombre total de parts égales", "Le chiffre du haut = parts qu'on prend", "1/4 d'une pizza = 1 part sur 4 égales"],
  },
  homophones: {
    emoji: "📖",
    titre: "Rappel : les homophones",
    texte: "Des mots qui sonnent pareil mais s'écrivent différemment selon leur sens.",
    etapes: ['« a » = verbe avoir → "Il a un chat"', '« à » = direction/lieu → "Je vais à l\'école"', 'Astuce : remplace par "avait" — si ça marche, c\'est "a"'],
  },
  grammaire: {
    emoji: "📝",
    titre: "Rappel : la grammaire",
    texte: "La grammaire, c'est les règles qui donnent du sens aux phrases.",
    etapes: ["Trouve d'abord le verbe (action)", "Puis cherche qui fait l'action (sujet)", "Le reste complète le sens"],
  },
  compte: {
    emoji: "🔢",
    titre: "Rappel : compter",
    texte: "Compter, c'est associer un nombre à chaque objet, un seul fois.",
    etapes: ["Touche chaque objet une seule fois", "Dis un nombre à chaque touche", "Le dernier nombre dit = total"],
  },
};

const _erreursParJeuSession = Object.create(null);
let _leconAfficheeJeu = null;

export function signalerErreurLecon(jeuId) {
  if (!jeuId) return;
  _erreursParJeuSession[jeuId] = (_erreursParJeuSession[jeuId] || 0) + 1;
  if (_leconAfficheeJeu === jeuId) return;
  if (_erreursParJeuSession[jeuId] >= 3) {
    _leconAfficheeJeu = jeuId;
    afficherLeconMini(jeuId);
  }
}

export function reinitialiserLeconJeu(jeuId) {
  if (jeuId) delete _erreursParJeuSession[jeuId];
  if (_leconAfficheeJeu === jeuId) _leconAfficheeJeu = null;
}

export function afficherLeconMini(jeuId) {
  const lecon = LECONS[jeuId];
  if (!lecon) return;

  const overlay = document.createElement("div");
  overlay.className = "mini-lecon-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", lecon.titre);

  const etapesHtml = lecon.etapes
    .map((e, i) => `<li data-num="${i + 1}">${e}</li>`)
    .join("");

  overlay.innerHTML = `
    <div class="mini-lecon-carte">
      <div class="mini-lecon-emoji">${lecon.emoji}</div>
      <h3 class="mini-lecon-titre">${lecon.titre}</h3>
      <p class="mini-lecon-texte">${lecon.texte}</p>
      <ol class="mini-lecon-etapes">${etapesHtml}</ol>
      <button type="button" class="btn-mini-lecon-ok">C'est compris ! 💪</button>
    </div>
  `;

  document.body.appendChild(overlay);
  overlay.querySelector(".btn-mini-lecon-ok")?.focus();
  overlay.querySelector(".btn-mini-lecon-ok")?.addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
}
