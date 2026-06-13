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
  });
});

async function ouvrirMenu(page) {
  await page.goto("/index.html");
  await page.waitForFunction(() => window.__amModuleReady === true, null, {
    timeout: 20_000,
  });
  await expect(page.locator("#ecran-menu")).toBeVisible();
}

test("le dressing propose un choix de couleur du pelage et le mémorise", async ({ page }) => {
  await ouvrirMenu(page);
  await page.locator('.menu-tab[data-tab="renard"]').click();
  await page.locator("#btn-maison").click();
  await expect(page.locator("#ecran-maison")).toBeVisible();

  await page.locator("#btn-dressing").click();
  await expect(page.locator("#ecran-dressing")).toBeVisible();

  const swatches = page.locator("#dressing-couleurs .dressing-couleur");
  await expect(swatches.first()).toBeVisible();
  expect(await swatches.count()).toBeGreaterThan(3);

  // Choisir une couleur (la deuxième, différente de "défaut")
  const violet = page.locator('#dressing-couleurs .dressing-couleur[aria-label="Violet"]');
  await violet.click();
  await expect(violet).toHaveClass(/active/);

  const couleur = await page.evaluate(() => localStorage.getItem("renard-couleur"));
  expect(couleur).toBe("violet");

  // La sélection persiste au rechargement
  await page.reload();
  await page.waitForFunction(() => window.__amModuleReady === true);
  await page.locator('.menu-tab[data-tab="renard"]').click();
  await page.locator("#btn-maison").click();
  await page.locator("#btn-dressing").click();
  await expect(
    page.locator('#dressing-couleurs .dressing-couleur[aria-label="Violet"]'),
  ).toHaveClass(/active/);
});
