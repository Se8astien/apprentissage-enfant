import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

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

test("la maison propose une boutique de décoration et affiche les objets achetés", async ({ page }) => {
  await ouvrirMenu(page);
  await page.locator('.menu-tab[data-tab="renard"]').click();
  await page.locator("#btn-maison").click();
  await expect(page.locator("#ecran-maison")).toBeVisible();

  await page.locator("#btn-decor").click();
  await expect(page.locator("#ecran-decor")).toBeVisible();

  const premiere = page.locator("#decor-grille .dressing-carte").first();
  await expect(premiere).toBeVisible();
  await premiere.click();
  await expect(premiere).toHaveClass(/equipe/);

  await page.locator("#btn-retour-decor").click();
  await expect(page.locator("#ecran-maison")).toBeVisible();
  await expect(page.locator("#maison-decor-row")).toBeVisible();
  await expect(page.locator(".maison-decor-item")).toHaveCount(1);
});

async function fermerIntro(page) {
  const intro = page.locator(".btn-evolution-fermer");
  if (await intro.isVisible().catch(() => false)) await intro.click();
  const mini = page.locator(".btn-mini-lecon-ok");
  if (await mini.isVisible().catch(() => false)) await mini.click();
  const badge = page.locator(".badge-notif-overlay .badge-notif-fermer, .badge-notif-overlay button");
  if (await badge.first().isVisible().catch(() => false)) await badge.first().click();
}

test("après une erreur, le bouton 'Montre-moi pas à pas' révèle les étapes une à une", async ({ page }) => {
  await ouvrirMenu(page);
  await page.locator('.menu-tab[data-tab="jeux"]').click();
  await page.locator('.carte-jeu[data-jeu="addition"]').click();
  await fermerIntro(page);

  let trouve = false;
  for (let tentative = 0; tentative < 8 && !trouve; tentative++) {
    await page.locator(".zone-choix .btn-choix").first().waitFor({ timeout: 10_000 });
    await fermerIntro(page);
    // Le dernier bouton est rarement la bonne réponse pour une addition générée aléatoirement
    await page.locator(".zone-choix .btn-choix").last().click();
    await page.locator("#btn-suivant").waitFor({ state: "visible", timeout: 10_000 });

    if (await page.locator(".btn-pas-a-pas").count()) {
      trouve = true;
      break;
    }
    await fermerIntro(page);
    await page.locator("#btn-suivant").click();
  }

  expect(trouve).toBe(true);
  const btnPasAPas = page.locator(".btn-pas-a-pas");
  await expect(btnPasAPas).toBeVisible();
  await btnPasAPas.click();
  await expect(page.locator(".pas-a-pas-zone")).toBeVisible();
  await expect(page.locator(".pas-a-pas-ligne")).toHaveCount(1);
});
