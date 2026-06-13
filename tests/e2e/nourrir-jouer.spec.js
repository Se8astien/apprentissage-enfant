import { test, expect } from "@playwright/test";

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem("maths-cp-genre", "fille");
    localStorage.setItem("maths-cp-niveau", "ce1");
    localStorage.setItem("renard-nom", "Foxy");
    localStorage.setItem("rgpd-consent", "refuse");
    localStorage.setItem("apprentissage-difficulte", "1");
    localStorage.setItem("landing-seen", "1");
    localStorage.setItem("maths-cp-etoiles", "30");
    localStorage.setItem("renard-faim", "40");
    localStorage.setItem("renard-bonheur", "40");
    // Coffre déjà ouvert pour ne pas gêner les clics
    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    localStorage.setItem("renard-coffre-date", today);
  });
});

async function ouvrirMaison(page) {
  await page.goto("/index.html");
  await page.waitForFunction(() => window.__amModuleReady === true, null, { timeout: 20_000 });
  await expect(page.locator("#ecran-menu")).toBeVisible();
  await page.locator('.menu-tab[data-tab="renard"]').click();
  await page.locator("#btn-maison").click();
  await expect(page.locator("#ecran-maison")).toBeVisible();
}

test("nourrir ouvre un choix d'aliments et dépense les étoiles correspondantes", async ({ page }) => {
  await ouvrirMaison(page);

  await page.locator("#btn-nourrir").click();
  await expect(page.locator("#nourrir-overlay")).toBeVisible();

  const aliments = page.locator(".nourrir-aliment");
  expect(await aliments.count()).toBeGreaterThan(3);

  // Donner la carotte (1 étoile)
  await page.locator('.nourrir-aliment[aria-label*="Carotte"]').click();
  await expect(page.locator("#nourrir-overlay")).toBeHidden();

  const etoiles = await page.evaluate(() => Number(localStorage.getItem("maths-cp-etoiles")));
  expect(etoiles).toBe(29);

  const faim = await page.evaluate(() => parseFloat(localStorage.getItem("renard-faim")));
  expect(faim).toBeGreaterThan(40);
});

test("jouer à la balle augmente le bonheur sans coûter d'étoiles", async ({ page }) => {
  await ouvrirMaison(page);

  await page.locator("#btn-balle").click();
  await expect(page.locator("#ecran-maison")).toBeVisible();

  const bonheur = await page.evaluate(() => parseFloat(localStorage.getItem("renard-bonheur")));
  expect(bonheur).toBeGreaterThan(40);

  const etoiles = await page.evaluate(() => Number(localStorage.getItem("maths-cp-etoiles")));
  expect(etoiles).toBe(30);
});
