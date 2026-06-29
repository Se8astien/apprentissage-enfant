import { test, expect } from "@playwright/test";

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem("maths-cp-genre", "fille");
    localStorage.setItem("maths-cp-niveau", "cp");
    localStorage.setItem("renard-nom", "Foxy");
    localStorage.setItem("rgpd-consent", "refuse");
    localStorage.setItem("apprentissage-difficulte", "1");
    localStorage.setItem("landing-seen", "1");
  });
});

async function ouvrirJeu(page) {
  await page.goto("/index.html");
  await page.waitForFunction(() => window.__amModuleReady === true, null, { timeout: 20_000 });
  await page.locator('.menu-tab[data-tab="jeux"]').click();
  await page.locator('.carte-jeu[data-jeu="phraseOrdre"]').click();
  await expect(page.locator("#ecran-jeu")).toBeVisible();
  await expect(page.locator("#phrase-mots")).toBeVisible();
}

test("on reconstruit la phrase dans le bon ordre", async ({ page }) => {
  await ouvrirJeu(page);

  // La phrase correcte = les mots triés par data-idx croissant
  const ordre = await page.locator("#phrase-mots").evaluate((el) => {
    const mots = Array.from(el.querySelectorAll(".phrase-mot"));
    return mots.map((m) => Number(m.dataset.idx)).sort((a, b) => a - b);
  });

  for (const idx of ordre) {
    await page.locator(`#phrase-mots .phrase-mot[data-idx="${idx}"]`).click();
  }

  await expect(page.locator("#phrase-zone .phrase-mot--place")).toHaveCount(ordre.length);

  await page.locator(".phrase-verifier").click();
  await expect(page.locator("#feedback.ok")).toBeVisible({ timeout: 6000 });
});

test("un mauvais ordre ne valide pas la phrase", async ({ page }) => {
  await ouvrirJeu(page);

  const ordre = await page.locator("#phrase-mots").evaluate((el) => {
    const mots = Array.from(el.querySelectorAll(".phrase-mot"));
    return mots.map((m) => Number(m.dataset.idx)).sort((a, b) => b - a); // ordre inversé
  });
  if (ordre.length < 2) return; // phrase trop courte pour inverser

  for (const idx of ordre) {
    await page.locator(`#phrase-mots .phrase-mot[data-idx="${idx}"]`).click();
  }
  await page.locator(".phrase-verifier").click();
  await expect(page.locator("#feedback")).toBeVisible({ timeout: 6000 });
  await expect(page.locator("#feedback.ok")).toHaveCount(0);
});
