import { test, expect } from "@playwright/test";

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem("maths-cp-genre", "fille");
    localStorage.setItem("maths-cp-niveau", "cp"); // CP = grille 3x3 sans obstacle
    localStorage.setItem("renard-nom", "Foxy");
    localStorage.setItem("rgpd-consent", "refuse");
    localStorage.setItem("apprentissage-difficulte", "1");
    localStorage.setItem("landing-seen", "1");
  });
});

test("on guide l'abeille jusqu'à la ruche avec les flèches", async ({ page }) => {
  await page.goto("/index.html");
  await page.waitForFunction(() => window.__amModuleReady === true, null, { timeout: 20_000 });
  await expect(page.locator("#ecran-menu")).toBeVisible();

  await page.locator('.menu-tab[data-tab="jeux"]').click();
  await page.locator('.carte-jeu[data-jeu="abeille"]').click();

  await expect(page.locator("#ecran-jeu")).toBeVisible();
  await expect(page.locator("#jeu-titre")).toContainText("🐝");
  await expect(page.locator("#abeille-grille")).toBeVisible();

  // Lire la grille pour calculer un trajet gagnant (pas d'obstacle en CP)
  const data = await page.locator("#abeille-grille").evaluate((el) => {
    const cases = Array.from(el.querySelectorAll(".abeille-case"));
    const cols = getComputedStyle(el).gridTemplateColumns.split(" ").length;
    const bee = cases.findIndex((c) => c.textContent === "🐝");
    const hive = cases.findIndex((c) => c.textContent === "🍯");
    return { cols, beeR: Math.floor(bee / cols), beeC: bee % cols, hiveR: Math.floor(hive / cols), hiveC: hive % cols };
  });

  const dr = data.hiveR - data.beeR;
  const dc = data.hiveC - data.beeC;
  const vert = dr > 0 ? "Bas" : "Haut";
  const horiz = dc > 0 ? "Droite" : "Gauche";

  for (let i = 0; i < Math.abs(dr); i++) await page.locator(`.abeille-fleche[aria-label="${vert}"]`).click();
  for (let i = 0; i < Math.abs(dc); i++) await page.locator(`.abeille-fleche[aria-label="${horiz}"]`).click();

  await expect(page.locator(".abeille-pas")).toHaveCount(Math.abs(dr) + Math.abs(dc));

  await page.locator(".abeille-verifier").click();
  await expect(page.locator("#feedback.ok")).toBeVisible({ timeout: 8000 });
});

test("la grille grandit avec la difficulté (CP expert = 5×5)", async ({ context, page }) => {
  await context.addInitScript(() => {
    localStorage.setItem("apprentissage-difficulte", "2"); // expert
    localStorage.setItem("diff-jeu-abeille", "2");
  });
  await page.goto("/index.html");
  await page.waitForFunction(() => window.__amModuleReady === true, null, { timeout: 20_000 });
  await page.locator('.menu-tab[data-tab="jeux"]').click();
  await page.locator('.carte-jeu[data-jeu="abeille"]').click();
  await expect(page.locator("#abeille-grille")).toBeVisible();

  const cols = await page.locator("#abeille-grille").evaluate(
    (el) => getComputedStyle(el).gridTemplateColumns.split(" ").length
  );
  expect(cols).toBe(5); // CP base 3 + difficulté 2 = 5×5
});

test("un mauvais programme ne fait pas gagner", async ({ page }) => {
  await page.goto("/index.html");
  await page.waitForFunction(() => window.__amModuleReady === true, null, { timeout: 20_000 });
  await page.locator('.menu-tab[data-tab="jeux"]').click();
  await page.locator('.carte-jeu[data-jeu="abeille"]').click();
  await expect(page.locator("#abeille-grille")).toBeVisible();

  // Une seule flèche au hasard ne mène (presque) jamais à la ruche en CP (dist >= 2)
  await page.locator('.abeille-fleche[aria-label="Haut"]').click();
  await page.locator(".abeille-verifier").click();
  await expect(page.locator("#feedback")).toBeVisible({ timeout: 8000 });
});
