import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

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

async function ouvrirMenu(page) {
  await page.goto("/index.html");
  await page.waitForFunction(() => window.__amModuleReady === true, null, {
    timeout: 20_000,
  });
  await expect(page.locator("#ecran-menu")).toBeVisible();
}

async function fermerIntroHistoire(page) {
  for (const [btn, overlay] of [
    [".btn-evolution-fermer", ".evolution-overlay"],
    [".btn-mini-lecon-ok", ".mini-lecon-overlay"],
  ]) {
    const fermer = page.locator(btn);
    if (await fermer.isVisible().catch(() => false)) {
      await fermer.first().click().catch(() => {});
      await page
        .locator(overlay)
        .waitFor({ state: "detached", timeout: 5_000 })
        .catch(() => {});
    }
  }
}

async function repondreUneQuestion(page) {
  await page.locator(".zone-choix .btn-choix").first().waitFor({ timeout: 10_000 });
  await fermerIntroHistoire(page);
  await page.locator(".zone-choix .btn-choix").first().click();
  await page.locator("#btn-suivant").waitFor({ state: "visible", timeout: 10_000 });
}

test("le bouton duel ouvre le choix du jeu puis lance un duel à deux", async ({ page }) => {
  await ouvrirMenu(page);

  await page.locator("#btn-duel").click();
  await expect(page.locator("#duel-choix-overlay")).toBeVisible();
  await expect(page.locator(".duel-choix-jeu").first()).toBeVisible();

  await page.locator(".duel-choix-jeu").first().click();
  await expect(page.locator("#ecran-jeu")).toBeVisible();
  await expect(page.locator("#duel-banner")).toBeVisible();
  await expect(page.locator("#duel-banner")).toContainText("Joueur 1");
});

test("les joueurs alternent après chaque réponse", async ({ page }) => {
  await ouvrirMenu(page);
  await page.locator("#btn-duel").click();
  await page.locator(".duel-choix-jeu").first().click();
  await expect(page.locator("#duel-banner")).toContainText("Joueur 1");

  await repondreUneQuestion(page);
  await expect(page.locator("#duel-banner")).toContainText("Joueur 2");
});

test("le duel se termine par un écran de résultat puis retour menu", async ({ page }) => {
  await ouvrirMenu(page);
  await page.addInitScript(() => {});
  await page.locator("#btn-duel").click();
  await page.locator(".duel-choix-jeu").first().click();

  for (let i = 0; i < 6; i++) {
    await repondreUneQuestion(page);
    if (i < 5) {
      await fermerIntroHistoire(page);
      await page.locator("#btn-suivant").click();
    }
  }

  await expect(page.locator("#duel-resultat-overlay")).toBeVisible({ timeout: 10_000 });
  await page.locator("#btn-duel-retour-menu").click();
  await expect(page.locator("#ecran-menu")).toBeVisible();
});

test("quitter le jeu annule le duel (pas de bannière au prochain jeu)", async ({ page }) => {
  await ouvrirMenu(page);
  await page.locator("#btn-duel").click();
  await page.locator(".duel-choix-jeu").first().click();
  await expect(page.locator("#duel-banner")).toBeVisible();

  await fermerIntroHistoire(page);
  await page.locator("#btn-retour").click();
  await expect(page.locator("#ecran-menu")).toBeVisible();
  await expect(page.locator("#duel-banner")).toBeHidden();
});
