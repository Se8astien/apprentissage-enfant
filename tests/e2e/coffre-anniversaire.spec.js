import { test, expect } from "@playwright/test";

async function ouvrirMaison(page) {
  await page.goto("/index.html");
  await page.waitForFunction(() => window.__amModuleReady === true, null, {
    timeout: 20_000,
  });
  await expect(page.locator("#ecran-menu")).toBeVisible();
  await page.locator('.menu-tab[data-tab="renard"]').click();
  await page.locator("#btn-maison").click();
  await expect(page.locator("#ecran-maison")).toBeVisible();
}

test("le coffre du jour donne une récompense puis disparaît", async ({ context, page }) => {
  await context.addInitScript(() => {
    localStorage.setItem("maths-cp-genre", "fille");
    localStorage.setItem("maths-cp-niveau", "ce1");
    localStorage.setItem("renard-nom", "Foxy");
    localStorage.setItem("rgpd-consent", "refuse");
    localStorage.setItem("apprentissage-difficulte", "1");
    localStorage.setItem("landing-seen", "1");
    localStorage.setItem("maths-cp-etoiles", "30");
  });

  await ouvrirMaison(page);

  const coffre = page.locator("#maison-coffre");
  await expect(coffre).toBeVisible();
  await coffre.click({ force: true });
  await expect(coffre).toHaveClass(/maison-coffre--ouvert/);

  // La date d'ouverture est mémorisée
  const date = await page.evaluate(() => localStorage.getItem("renard-coffre-date"));
  expect(date).toBeTruthy();

  // Au rechargement, le coffre n'est plus disponible aujourd'hui
  await page.reload();
  await page.waitForFunction(() => window.__amModuleReady === true);
  await page.locator('.menu-tab[data-tab="renard"]').click();
  await page.locator("#btn-maison").click();
  await expect(page.locator("#maison-coffre")).toBeHidden();
});

test("le jour de l'anniversaire du renard, une bannière de fête s'affiche", async ({ context, page }) => {
  await context.addInitScript(() => {
    const d = new Date();
    const mmjj = `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    localStorage.setItem("maths-cp-genre", "fille");
    localStorage.setItem("maths-cp-niveau", "ce1");
    localStorage.setItem("renard-nom", "Foxy");
    localStorage.setItem("rgpd-consent", "refuse");
    localStorage.setItem("apprentissage-difficulte", "1");
    localStorage.setItem("landing-seen", "1");
    localStorage.setItem("maths-cp-etoiles", "30");
    // Né il y a un an aujourd'hui
    localStorage.setItem("renard-naissance", `${d.getFullYear() - 1}-${mmjj}`);
  });

  await ouvrirMaison(page);
  await expect(page.locator("#maison-anniv")).toBeVisible();
  await expect(page.locator("#maison-anniv")).toContainText("anniversaire");
});
