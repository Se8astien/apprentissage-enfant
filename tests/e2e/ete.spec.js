import { test, expect } from "@playwright/test";

function base(context, eteState) {
  return context.addInitScript((etat) => {
    localStorage.setItem("maths-cp-genre", "fille");
    localStorage.setItem("maths-cp-niveau", "cp");
    localStorage.setItem("renard-nom", "Foxy");
    localStorage.setItem("rgpd-consent", "refuse");
    localStorage.setItem("apprentissage-difficulte", "1");
    localStorage.setItem("landing-seen", "1");
    localStorage.setItem("ete-force", "1");
    if (etat) localStorage.setItem("ete-parcours", JSON.stringify(etat));
  }, eteState);
}

async function ouvrirMenu(page) {
  await page.goto("/index.html");
  await page.waitForFunction(() => window.__amModuleReady === true, null, { timeout: 20_000 });
  await expect(page.locator("#ecran-menu")).toBeVisible();
}

async function gagnerUneQuestionAbeille(page) {
  await page.locator('.menu-tab[data-tab="jeux"]').click();
  await page.locator('.carte-jeu[data-jeu="abeille"]').click();
  await expect(page.locator("#abeille-grille")).toBeVisible();

  const data = await page.locator("#abeille-grille").evaluate((el) => {
    const cases = Array.from(el.querySelectorAll(".abeille-case"));
    const cols = getComputedStyle(el).gridTemplateColumns.split(" ").length;
    const bee = cases.findIndex((c) => c.textContent === "🐝");
    const hive = cases.findIndex((c) => c.textContent === "🍯");
    return { beeR: Math.floor(bee / cols), beeC: bee % cols, hiveR: Math.floor(hive / cols), hiveC: hive % cols };
  });
  const dr = data.hiveR - data.beeR;
  const dc = data.hiveC - data.beeC;
  const vert = dr > 0 ? "Bas" : "Haut";
  const horiz = dc > 0 ? "Droite" : "Gauche";
  for (let i = 0; i < Math.abs(dr); i++) await page.locator(`.abeille-fleche[aria-label="${vert}"]`).click();
  for (let i = 0; i < Math.abs(dc); i++) await page.locator(`.abeille-fleche[aria-label="${horiz}"]`).click();
  await page.locator(".abeille-verifier").click();
  await expect(page.locator("#feedback.ok")).toBeVisible({ timeout: 8000 });
}

test("le parcours d'été s'affiche pendant l'été avec l'étape en cours", async ({ context, page }) => {
  await base(context);
  await ouvrirMenu(page);

  const section = page.locator("#ete-section");
  await expect(section).toBeVisible();
  await expect(section).toContainText("Parcours d'été");
  await expect(section).toContainText("Étape 1/30");
  await expect(page.locator(".ete-pas")).toHaveCount(30);
});

test("le bouton révision du jour lance un jeu", async ({ context, page }) => {
  await base(context);
  await ouvrirMenu(page);

  await page.locator("#btn-ete-jouer").click();
  await expect(page.locator("#ecran-jeu")).toBeVisible();
});

test("5 bonnes réponses complètent l'étape du jour", async ({ context, page }) => {
  await base(context, { etape: 2, progres: 4, dateEtape: "2000-01-01" });
  await ouvrirMenu(page);
  await expect(page.locator("#ete-section")).toContainText("Étape 3/30 — 4/5");

  await gagnerUneQuestionAbeille(page);

  // Fermer les éventuels overlays (badge débloqué) puis attendre la fin de la toast
  while (await page.locator(".badge-notif-overlay .btn-evolution-fermer").count()) {
    await page.locator(".badge-notif-overlay .btn-evolution-fermer").first().click();
  }
  await expect(page.locator(".toast-ete")).toHaveCount(0, { timeout: 8000 });
  await page.locator("#btn-retour").click();
  await page.locator("#fin-jeu-menu").click();
  await expect(page.locator("#ecran-menu")).toBeVisible();
  await expect(page.locator("#ete-section")).toContainText("Étape du jour réussie");

  const etat = await page.evaluate(() => JSON.parse(localStorage.getItem("ete-parcours")));
  expect(etat.etape).toBe(3);
});

test("l'étape 7 débloque les lunettes de soleil", async ({ context, page }) => {
  await base(context, { etape: 6, progres: 4, dateEtape: "2000-01-01" });
  await ouvrirMenu(page);

  await gagnerUneQuestionAbeille(page);

  const acc = await page.evaluate(() => JSON.parse(localStorage.getItem("renard-accessoires") || "[]"));
  expect(acc).toContain("lunettes-soleil");
});

test("hors été (ete-force=0), la section est cachée", async ({ context, page }) => {
  await context.addInitScript(() => {
    localStorage.setItem("maths-cp-genre", "fille");
    localStorage.setItem("maths-cp-niveau", "cp");
    localStorage.setItem("renard-nom", "Foxy");
    localStorage.setItem("rgpd-consent", "refuse");
    localStorage.setItem("apprentissage-difficulte", "1");
    localStorage.setItem("landing-seen", "1");
    localStorage.setItem("ete-force", "0");
  });
  await ouvrirMenu(page);
  await expect(page.locator("#ete-section")).toBeHidden();
});
