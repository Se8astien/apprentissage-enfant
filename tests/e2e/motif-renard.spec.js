import { test, expect } from "@playwright/test";

async function ouvrirMaison(page) {
  await page.goto("/index.html");
  await page.waitForFunction(() => window.__amModuleReady === true, null, { timeout: 20_000 });
  await expect(page.locator("#ecran-menu")).toBeVisible();
  await page.locator('.menu-tab[data-tab="renard"]').click();
  await page.locator("#btn-maison").click();
  await expect(page.locator("#ecran-maison")).toBeVisible();
}

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem("maths-cp-genre", "fille");
    localStorage.setItem("maths-cp-niveau", "ce1");
    localStorage.setItem("renard-nom", "Foxy");
    localStorage.setItem("rgpd-consent", "refuse");
    localStorage.setItem("apprentissage-difficulte", "1");
    localStorage.setItem("landing-seen", "1");
  });
});

test("on peut choisir un motif de pelage dans le dressing", async ({ page }) => {
  await ouvrirMaison(page);

  await page.locator("#btn-dressing").click();
  await expect(page.locator("#ecran-dressing")).toBeVisible();

  const motifs = page.locator("#dressing-motifs button");
  expect(await motifs.count()).toBeGreaterThanOrEqual(4);

  await motifs.nth(1).click();
  await expect(motifs.nth(1)).toHaveAttribute("aria-pressed", "true");

  expect(await page.evaluate(() => localStorage.getItem("renard-motif"))).not.toBeNull();
});
