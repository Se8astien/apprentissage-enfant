import { test, expect } from "@playwright/test";

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem("maths-cp-genre", "fille");
    localStorage.setItem("maths-cp-niveau", "ce2");
    localStorage.setItem("renard-nom", "Foxy");
    localStorage.setItem("rgpd-consent", "refuse");
    localStorage.setItem("apprentissage-difficulte", "1");
    localStorage.setItem("landing-seen", "1");
  });
});

test("le jeu Géographie est jouable depuis le menu", async ({ page }) => {
  await page.goto("/index.html");
  await page.waitForFunction(() => window.__amModuleReady === true, null, { timeout: 20_000 });
  await expect(page.locator("#ecran-menu")).toBeVisible();

  await page.locator('.menu-tab[data-tab="jeux"]').click();
  await page.locator('.carte-jeu[data-jeu="geographie"]').click();

  await expect(page.locator("#ecran-jeu")).toBeVisible();
  await expect(page.locator("#jeu-titre")).toContainText(/🌍|🗺️/);

  const choix = page.locator("#zone-choix .btn-choix");
  await expect(choix.first()).toBeVisible();
  expect(await choix.count()).toBeGreaterThanOrEqual(2);

  await choix.first().click();
  await expect(page.locator("#ecran-jeu")).toBeVisible();
});
