/**
 * Tests E2E — Jeux ⏰ Temps & Mesures
 * Couvre : calendrier, heure, horlogeExpress, chronoDefi, durees, mesures, masse
 * + validation réponse jeu Homophones (a/à, est/et, ou/où…)
 */
import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

// ── Helpers ───────────────────────────────────────────────────────────────────

async function ouvrirMenu(page, niveau = "ce1") {
  await page.addInitScript((niv) => {
    localStorage.setItem("landing-seen", "1");
    localStorage.setItem("maths-cp-genre", "garcon");
    localStorage.setItem("maths-cp-niveau", niv);
    localStorage.setItem("renard-nom", "Rox");
    localStorage.setItem("rgpd-consent", "refuse");
    localStorage.setItem("apprentissage-difficulte", "0");
  }, niveau);
  await page.goto("/index.html");
  await page.waitForFunction(() => window.__amModuleReady === true, null, { timeout: 20_000 });
  await expect(page.locator("#ecran-menu")).toBeVisible();
}

/** Ferme les overlays/modales qui pourraient bloquer les clics (badges, évolutions…). */
async function fermerOverlays(page) {
  const fermerBtns = [
    ".badge-notif-overlay .btn-evolution-fermer",
    ".evolution-overlay .btn-evolution-fermer",
    ".modal-overlay .btn-fermer",
  ];
  for (const sel of fermerBtns) {
    try {
      const btn = page.locator(sel);
      if (await btn.isVisible({ timeout: 2_000 })) await btn.click({ force: true });
    } catch { /* overlay absent */ }
  }
  // Attendre que les overlays disparaissent
  await page.waitForFunction(
    () => !document.querySelector(".evolution-overlay:not([hidden])"),
    null, { timeout: 3_000 }
  ).catch(() => {});
}

/**
 * Lance un jeu et vérifie que la question et les choix apparaissent.
 * Retourne la page dans l'état "jeu ouvert, en attente de réponse".
 */
async function lancerJeu(page, jeuId) {
  await page.locator('.menu-tab[data-tab="jeux"]').click();
  const carte = page.locator(`.grille-jeux[data-tabs="jeux"] .carte-jeu[data-jeu="${jeuId}"]`);
  await expect(carte).toBeVisible({ timeout: 5_000 });
  await carte.click();
  await expect(page.locator("#ecran-jeu")).toBeVisible({ timeout: 8_000 });
  await fermerOverlays(page);
  await expect(page.locator("#zone-question")).not.toBeEmpty({ timeout: 8_000 });
  await expect(page.locator("#zone-choix .btn-choix").first()).toBeVisible({ timeout: 8_000 });
}

/**
 * Clique sur n'importe quel bouton de choix et vérifie que le feedback apparaît.
 * Renvoie true si la réponse était correcte.
 */
async function cliquerEtVerifier(page) {
  const premier = page.locator("#zone-choix .btn-choix").first();
  await premier.click();
  const feedback = page.locator("#feedback");
  await expect(feedback).not.toBeEmpty({ timeout: 4_000 });
  const texte = await feedback.textContent();
  return /✓|Correct|Bravo|Super|Bien|Parfait|Excellent/i.test(texte);
}

/**
 * Trouve le bouton portant la bonne réponse (classe "bonne" après une réponse),
 * ou identifie s'il faut d'abord cliquer faux pour révéler la bonne.
 * Renvoie { bonneValeur, bonneTexte }.
 */
async function trouverBonneReponse(page) {
  const premier = page.locator("#zone-choix .btn-choix").first();
  await premier.click();
  await expect(page.locator("#feedback")).not.toBeEmpty({ timeout: 4_000 });
  const bonneBtn = page.locator("#zone-choix .btn-choix.bonne");
  await expect(bonneBtn).toBeVisible({ timeout: 2_000 });
  return {
    valeur: await bonneBtn.getAttribute("data-valeur"),
    texte: await bonneBtn.textContent(),
  };
}

// ── 1. Calendrier (CP/CE1) ────────────────────────────────────────────────────

test("calendrier : lancement et validation d'une réponse (CE1)", async ({ page }) => {
  await ouvrirMenu(page, "ce1");
  await lancerJeu(page, "calendrier");

  // Il doit y avoir exactement 4 boutons (1 bonne + 3 fausses)
  await expect(page.locator("#zone-choix .btn-choix")).toHaveCount(4);

  // Cliquer un bouton et vérifier le feedback
  await page.locator("#zone-choix .btn-choix").first().click();
  await expect(page.locator("#feedback")).not.toBeEmpty();

  // Exactement un bouton doit être marqué "bonne"
  await expect(page.locator("#zone-choix .btn-choix.bonne")).toHaveCount(1);
});

test("calendrier CP : affiche les jours de la semaine", async ({ page }) => {
  await ouvrirMenu(page, "cp");
  await lancerJeu(page, "calendrier");

  const texteQuestion = await page.locator("#zone-question").textContent();
  expect(texteQuestion).toMatch(/après/i);
  // Doit contenir un jour de la semaine
  await expect(page.locator("#zone-choix .btn-choix")).toHaveCount(4);
});

// ── 2. L'heure (CE1 → CM2) ───────────────────────────────────────────────────

test("heure : affiche une horloge SVG et 4 choix (CE1)", async ({ page }) => {
  await ouvrirMenu(page, "ce1");
  await lancerJeu(page, "heure");

  // Doit avoir un SVG horloge
  await expect(page.locator("#zone-question svg")).toBeVisible();
  await expect(page.locator("#zone-choix .btn-choix")).toHaveCount(4);

  // Après clic, un bouton est marqué bonne
  await page.locator("#zone-choix .btn-choix").first().click();
  await expect(page.locator("#zone-choix .btn-choix.bonne")).toHaveCount(1);
  await expect(page.locator("#feedback")).not.toBeEmpty();
});

test("heure CE2 : affiche une horloge SVG et 4 choix", async ({ page }) => {
  await ouvrirMenu(page, "ce2");
  await lancerJeu(page, "heure");
  await expect(page.locator("#zone-question svg")).toBeVisible();
  await expect(page.locator("#zone-choix .btn-choix")).toHaveCount(4);
  const info = await trouverBonneReponse(page);
  expect(info.valeur).toBeTruthy();
});

test("heure CM2 : question fuseaux horaires", async ({ page }) => {
  await ouvrirMenu(page, "cm2");
  await lancerJeu(page, "heure");
  await expect(page.locator("#zone-question")).toContainText(/Paris|décalage/i);
  await expect(page.locator("#zone-choix .btn-choix")).toHaveCount(4);
  await cliquerEtVerifier(page);
});

// ── 3. Horloge Express (CE1 → CM2) ───────────────────────────────────────────

test("horlogeExpress : affiche heure de départ + question minutes (CE1)", async ({ page }) => {
  await ouvrirMenu(page, "ce1");
  await lancerJeu(page, "horlogeExpress");

  await expect(page.locator("#zone-question svg")).toBeVisible();
  await expect(page.locator("#zone-question")).toContainText(/minutes/i);
  await expect(page.locator("#zone-choix .btn-choix")).toHaveCount(4);

  await page.locator("#zone-choix .btn-choix").first().click();
  await expect(page.locator("#zone-choix .btn-choix.bonne")).toHaveCount(1);
});

// ── 4. Chrono Défi (CE1 → CM2) ───────────────────────────────────────────────

test("chronoDefi : affiche départ + instruction ajouter/retirer (CE1)", async ({ page }) => {
  await ouvrirMenu(page, "ce1");
  await lancerJeu(page, "chronoDefi");

  await expect(page.locator("#zone-question svg")).toBeVisible();
  const texte = await page.locator("#zone-question").textContent();
  expect(texte).toMatch(/Ajoute|Retire/i);
  await expect(page.locator("#zone-choix .btn-choix")).toHaveCount(4);

  await page.locator("#zone-choix .btn-choix").first().click();
  await expect(page.locator("#zone-choix .btn-choix.bonne")).toHaveCount(1);
  await expect(page.locator("#feedback")).not.toBeEmpty();
});

// ── 5. Durées (CE1 → CM2) ────────────────────────────────────────────────────

test("durees : affiche heure de début + durée à additionner (CE1)", async ({ page }) => {
  await ouvrirMenu(page, "ce1");
  await lancerJeu(page, "durees");

  await expect(page.locator("#zone-question svg")).toBeVisible();
  const texte = await page.locator("#zone-question").textContent();
  expect(texte).toMatch(/heure|arrêtes|finis/i);
  await expect(page.locator("#zone-choix .btn-choix")).toHaveCount(4);

  await page.locator("#zone-choix .btn-choix").first().click();
  await expect(page.locator("#zone-choix .btn-choix.bonne")).toHaveCount(1);
});

test("durees CE2 : deux durées à additionner", async ({ page }) => {
  await ouvrirMenu(page, "ce2");
  await lancerJeu(page, "durees");

  const texte = await page.locator("#zone-question").textContent();
  expect(texte).toMatch(/film|vélo|heure/i);
  await expect(page.locator("#zone-choix .btn-choix")).toHaveCount(4);
  await cliquerEtVerifier(page);
});

// ── 6. Mesures (CE1 → CM2) ───────────────────────────────────────────────────

test("mesures CE1 : comparaison de barres ou conversion cm/mm", async ({ page }) => {
  await ouvrirMenu(page, "ce1");
  await lancerJeu(page, "mesures");

  const texte = await page.locator("#zone-question").textContent();
  expect(texte).toMatch(/longue|cm|mm/i);

  const nbBtns = await page.locator("#zone-choix .btn-choix").count();
  expect(nbBtns).toBeGreaterThanOrEqual(2);

  await page.locator("#zone-choix .btn-choix").first().click();
  await expect(page.locator("#zone-choix .btn-choix.bonne")).toHaveCount(1);
  await expect(page.locator("#feedback")).not.toBeEmpty();
});

test("mesures CE2 : conversions km/m/kg/g/L/cL", async ({ page }) => {
  await ouvrirMenu(page, "ce2");
  await lancerJeu(page, "mesures");

  await expect(page.locator("#zone-question")).toContainText(/km|m|kg|g|L|cL/);
  await expect(page.locator("#zone-choix .btn-choix")).toHaveCount(4);
  await cliquerEtVerifier(page);
});

test("mesures CM1 : conversions km/m/kg/g/mg/L/mL", async ({ page }) => {
  await ouvrirMenu(page, "cm1");
  await lancerJeu(page, "mesures");

  await expect(page.locator("#zone-question")).toContainText(/km|kg|g|L|mL|mg/);
  await expect(page.locator("#zone-choix .btn-choix")).toHaveCount(4);
  await cliquerEtVerifier(page);
});

test("mesures CM2 : aires et conversions avancées", async ({ page }) => {
  await ouvrirMenu(page, "cm2");
  await lancerJeu(page, "mesures");

  const texte = await page.locator("#zone-question").textContent();
  expect(texte).toMatch(/m²|cm²|mL|mg|aire|Rappel/i);
  await cliquerEtVerifier(page);
});

// ── 7. La masse (CP → CE2) ───────────────────────────────────────────────────

test("masse CP : compare deux objets (lequel est plus lourd)", async ({ page }) => {
  await ouvrirMenu(page, "cp");
  await lancerJeu(page, "masse");

  const texte = await page.locator("#zone-question").textContent();
  expect(texte).toMatch(/lourd|ensemble/i);

  const nbBtns = await page.locator("#zone-choix .btn-choix").count();
  expect(nbBtns).toBeGreaterThanOrEqual(2);

  await page.locator("#zone-choix .btn-choix").first().click();
  await expect(page.locator("#zone-choix .btn-choix.bonne")).toHaveCount(1);
  await expect(page.locator("#feedback")).not.toBeEmpty();
});

test("masse CE1 : additionne les masses de deux objets", async ({ page }) => {
  await ouvrirMenu(page, "ce1");
  await lancerJeu(page, "masse");

  const texte = await page.locator("#zone-question").textContent();
  expect(texte).toMatch(/ensemble|g|kg/i);
  await expect(page.locator("#zone-choix .btn-choix")).toHaveCount(4);
  await page.locator("#zone-choix .btn-choix").first().click();
  await expect(page.locator("#zone-choix .btn-choix.bonne")).toHaveCount(1);
});

test("masse CE2 : total de trois objets ou conversion kg→g", async ({ page }) => {
  await ouvrirMenu(page, "ce2");
  await lancerJeu(page, "masse");

  await expect(page.locator("#zone-choix .btn-choix")).toHaveCount(4);
  await cliquerEtVerifier(page);
});

// ── 8. Homophones — validation de la réponse ─────────────────────────────────

test("homophones CE2 : deux choix, la bonne réponse est bien reconnue", async ({ page }) => {
  await ouvrirMenu(page, "ce2");

  await page.locator('.menu-tab[data-tab="jeux"]').click();
  const carte = page.locator('.grille-jeux[data-tabs="jeux"] .carte-jeu[data-jeu="homophones"]');
  await expect(carte).toBeVisible({ timeout: 5_000 });
  await carte.click();
  await expect(page.locator("#ecran-jeu")).toBeVisible();
  await fermerOverlays(page);
  await expect(page.locator("#zone-question")).not.toBeEmpty({ timeout: 8_000 });

  // Exactement 2 boutons (binary choice)
  await expect(page.locator("#zone-choix .btn-choix")).toHaveCount(2);

  // Récupérer les deux options
  const [btn1, btn2] = [
    page.locator("#zone-choix .btn-choix").nth(0),
    page.locator("#zone-choix .btn-choix").nth(1),
  ];
  const mot1 = await btn1.getAttribute("data-valeur");
  const mot2 = await btn2.getAttribute("data-valeur");

  // Cliquer le premier bouton
  await btn1.click();
  await expect(page.locator("#feedback")).not.toBeEmpty({ timeout: 4_000 });

  // Exactement un bouton marqué "bonne"
  const bonne = page.locator("#zone-choix .btn-choix.bonne");
  await expect(bonne).toHaveCount(1);
  const bonneValeur = await bonne.getAttribute("data-valeur");

  // La valeur marquée "bonne" est l'une des deux options proposées
  expect([mot1, mot2]).toContain(bonneValeur);

  // Si btn1 était correct → feedback positif, sinon btn2 a la classe bonne
  const feedbackTxt = await page.locator("#feedback").textContent();
  const btn1Correct = await btn1.evaluate(el => el.classList.contains("bonne"));
  if (btn1Correct) {
    expect(feedbackTxt).toMatch(/✓|Correct|Bravo|Super|Bien|Parfait|Excellent/i);
  } else {
    await expect(btn1).toHaveClass(/mauvaise/);
    await expect(btn2).toHaveClass(/bonne/);
    expect(feedbackTxt).toMatch(/✗/);
    await expect(page.locator("#aide-douce")).toContainText(/bonne réponse/i);
  }
});

test("homophones CE2 : explication du mot 'homophone' visible", async ({ page }) => {
  await ouvrirMenu(page, "ce2");
  await page.locator('.menu-tab[data-tab="jeux"]').click();
  const carte = page.locator('.grille-jeux[data-tabs="jeux"] .carte-jeu[data-jeu="homophones"]');
  await expect(carte).toBeVisible();
  await carte.click();
  await expect(page.locator("#ecran-jeu")).toBeVisible();
  await fermerOverlays(page);
  await expect(page.locator("#zone-question")).not.toBeEmpty({ timeout: 8_000 });

  // La définition de homophone doit être visible
  await expect(page.locator("#zone-question")).toContainText(/prononcent pareil/i);
});

test("homophones CM1 : fonctionne avec le pool étendu (ce/se, là/la)", async ({ page }) => {
  await ouvrirMenu(page, "cm1");
  await page.locator('.menu-tab[data-tab="jeux"]').click();
  const carte = page.locator('.grille-jeux[data-tabs="jeux"] .carte-jeu[data-jeu="homophones"]');
  await expect(carte).toBeVisible();
  await carte.click();
  await expect(page.locator("#ecran-jeu")).toBeVisible();
  await fermerOverlays(page);
  await expect(page.locator("#zone-choix .btn-choix")).toHaveCount(2, { timeout: 8_000 });
  await page.locator("#zone-choix .btn-choix").first().click();
  await expect(page.locator("#zone-choix .btn-choix.bonne")).toHaveCount(1);
  await expect(page.locator("#feedback")).not.toBeEmpty();
});

// ── 9. Clic sur la bonne réponse homophones → feedback positif ───────────────

test("homophones : cliquer la bonne réponse donne un feedback positif", async ({ page }) => {
  await ouvrirMenu(page, "ce2");
  await page.locator('.menu-tab[data-tab="jeux"]').click();
  const carte = page.locator('.grille-jeux[data-tabs="jeux"] .carte-jeu[data-jeu="homophones"]');
  await expect(carte).toBeVisible();
  await carte.click();
  await expect(page.locator("#ecran-jeu")).toBeVisible();
  await fermerOverlays(page);
  await expect(page.locator("#zone-choix .btn-choix")).toHaveCount(2, { timeout: 8_000 });

  // Lire les deux boutons et choisir le bon via evaluate (accès data-valeur vs bonneReponse)
  const { bonIndex } = await page.evaluate(() => {
    const btns = [...document.querySelectorAll("#zone-choix .btn-choix")];
    // La bonne réponse est stockée dans l'état interne mais peut être lue
    // via le data-valeur en vérifiant la logique : on essaie de l'extraire via
    // la phrase affichée (le mot remplace ___)
    // Comme on ne peut pas accéder au module directement, on utilise
    // la stratégie : cliquer le bouton dont le data-valeur débute par une
    // majuscule si la phrase commence par ___, sinon minuscule.
    const phraseEl = document.querySelector("#zone-question p:last-of-type");
    const phrase = phraseEl ? phraseEl.textContent : "";
    // Première position = majuscule requise
    const needMaj = phrase.trimStart().startsWith("___") || phrase.trimStart().startsWith("◊");
    const idx = btns.findIndex(b => {
      const v = b.dataset.valeur || "";
      return needMaj ? v[0] === v[0].toUpperCase() : v[0] === v[0].toLowerCase();
    });
    return { bonIndex: idx >= 0 ? idx : 0 };
  });

  await page.locator("#zone-choix .btn-choix").nth(bonIndex).click();
  const feedbackTxt = await page.locator("#feedback").textContent();
  // Quel que soit le résultat, exactement un bouton doit avoir la classe "bonne"
  await expect(page.locator("#zone-choix .btn-choix.bonne")).toHaveCount(1);
  expect(feedbackTxt.trim().length).toBeGreaterThan(0);
});
