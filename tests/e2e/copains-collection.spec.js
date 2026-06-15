import { test, expect } from "@playwright/test";

async function ouvrirMaison(page) {
  await page.goto("/index.html");
  await page.waitForFunction(() => window.__amModuleReady === true, null, { timeout: 20_000 });
  await expect(page.locator("#ecran-menu")).toBeVisible();
  await page.locator('.menu-tab[data-tab="renard"]').click();
  await page.locator("#btn-maison").click();
  await expect(page.locator("#ecran-maison")).toBeVisible();
}

function base(context, etoiles) {
  return context.addInitScript((nb) => {
    localStorage.setItem("maths-cp-genre", "fille");
    localStorage.setItem("maths-cp-niveau", "ce1");
    localStorage.setItem("renard-nom", "Foxy");
    localStorage.setItem("rgpd-consent", "refuse");
    localStorage.setItem("apprentissage-difficulte", "1");
    localStorage.setItem("landing-seen", "1");
    localStorage.setItem("maths-cp-etoiles", String(nb));
    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    localStorage.setItem("renard-coffre-date", today);
  }, etoiles);
}

test("les copains animaux apparaissent une fois le palier d'étoiles atteint", async ({ context, page }) => {
  await base(context, 130); // débloque lapin (50) et ours (120)
  await ouvrirMaison(page);

  const copains = page.locator("#maison-copains");
  await expect(copains).toBeVisible();
  await expect(copains.locator(".maison-copain")).toHaveCount(2);
});

test("aucun copain n'est visible quand on a trop peu d'étoiles", async ({ context, page }) => {
  await base(context, 10);
  await ouvrirMaison(page);
  await expect(page.locator("#maison-copains")).toBeHidden();
});

test("la collection liste les objets avec leur état débloqué/verrouillé", async ({ context, page }) => {
  await base(context, 130);
  await ouvrirMaison(page);

  await page.locator("#btn-collection").click();
  await expect(page.locator("#ecran-collection")).toBeVisible();

  // 7 sections (décor, accessoires, couleurs, motifs, fonds, expressions, copains)
  await expect(page.locator(".collec-section")).toHaveCount(7);

  // Au moins un objet verrouillé et un débloqué existent
  expect(await page.locator(".collec-case").count()).toBeGreaterThan(5);
  expect(await page.locator(".collec-case.verrouille").count()).toBeGreaterThan(0);

  await page.locator("#btn-retour-collection").click();
  await expect(page.locator("#ecran-maison")).toBeVisible();
});
