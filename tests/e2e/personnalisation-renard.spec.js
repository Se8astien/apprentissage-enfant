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

test("on peut choisir un fond de maison et il s'applique", async ({ page }) => {
  await ouvrirMaison(page);

  await page.locator("#btn-dressing").click();
  await expect(page.locator("#ecran-dressing")).toBeVisible();

  const fonds = page.locator("#dressing-fonds button");
  expect(await fonds.count()).toBeGreaterThanOrEqual(4);

  await fonds.nth(1).click();
  await expect(fonds.nth(1)).toHaveAttribute("aria-pressed", "true");

  await page.locator("#btn-retour-dressing").click();
  await expect(page.locator("#ecran-maison")).toBeVisible();
  const bg = await page.locator("#ecran-maison").evaluate(el => getComputedStyle(el).backgroundImage);
  expect(bg).not.toBe("none");
});

test("on peut choisir une expression du visage", async ({ page }) => {
  await ouvrirMaison(page);

  await page.locator("#btn-dressing").click();
  await expect(page.locator("#ecran-dressing")).toBeVisible();

  const expressions = page.locator("#dressing-expressions button");
  expect(await expressions.count()).toBeGreaterThanOrEqual(3);

  await expressions.nth(1).click();
  await expect(expressions.nth(1)).toHaveAttribute("aria-pressed", "true");
  expect(await page.evaluate(() => localStorage.getItem("renard-expression"))).not.toBeNull();
});

test("les accessoires cosmétiques (nœud, bandana, médaillon) sont disponibles dès le départ", async ({ page }) => {
  await ouvrirMaison(page);
  await page.locator("#btn-dressing").click();
  await expect(page.locator("#ecran-dressing")).toBeVisible();

  const cartes = page.locator("#dressing-grille .dressing-carte");
  const total = await cartes.count();
  let dispo = 0;
  for (let i = 0; i < total; i++) {
    if (!(await cartes.nth(i).evaluate(el => el.classList.contains("verrouille")))) dispo++;
  }
  expect(dispo).toBeGreaterThanOrEqual(3);
});
