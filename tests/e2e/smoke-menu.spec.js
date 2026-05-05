import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem("maths-cp-genre", "fille");
    localStorage.setItem("maths-cp-niveau", "cp");
    localStorage.setItem("renard-nom", "Foxy");
    localStorage.setItem("rgpd-consent", "refuse");
    localStorage.setItem("apprentissage-difficulte", "1");
  });
});

test("menu visible après onboarding simulé + barre classe synchronisée au changement de niveau", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("landing-seen", "1");
  });
  await page.goto("/index.html");

  await page.waitForFunction(() => window.__amModuleReady === true, null, {
    timeout: 20_000,
  });

  await expect(page.locator("#ecran-menu")).toBeVisible();

  await page.locator("#btn-classe-menu").click();
  await expect(page.locator("#niveau-cp")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#btn-changer-rythme")).toContainText("Normal");

  await page.locator("#niveau-ce2").click();
  await page.locator("#btn-classe-menu").click();
  await expect(page.locator("#niveau-ce2")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#niveau-cp")).toHaveAttribute("aria-pressed", "false");

  await page.locator("#niveau-cm2").click();
  await expect(page.locator("#niveau-cm2")).toHaveAttribute("aria-pressed", "true");
});

test("une mauvaise réponse affiche une aide douce et la bonne réponse", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("landing-seen", "1");
  });
  await page.goto("/index.html");

  await page.waitForFunction(() => window.__amModuleReady === true, null, {
    timeout: 20_000,
  });

  await page.locator('.carte-jeu[data-jeu="addition"]').click();
  await expect(page.locator("#ecran-jeu")).toBeVisible();
  const jouerHistoire = page.getByRole("button", { name: /Jouer/i });
  if (await jouerHistoire.isVisible()) {
    await jouerHistoire.click();
  }
  const miniLeconOk = page.locator("#mini-lecon-jeu .mini-lecon-btn");
  if (await miniLeconOk.isVisible()) {
    await miniLeconOk.click();
  }

  await expect(page.locator("#outils-jeu #btn-indice-question")).toBeVisible();
  await expect(page.locator("#btn-lecture-facile")).toBeVisible();
  await page.locator("#outils-jeu #btn-indice-question").click();
  await expect(page.locator("#aide-douce")).toBeVisible();
  await expect(page.locator("#aide-douce")).toContainText("Petit coup de pouce");

  await page.locator("#btn-lecture-facile").click();
  await expect(page.locator("#btn-lecture-facile")).toHaveAttribute("aria-pressed", "true");
  const notifBadgeOk = page.locator(".badge-notif-overlay .btn-evolution-fermer");
  try {
    await notifBadgeOk.click({ timeout: 4000 });
  } catch {
    /* pas de trophée ou déjà fermé */
  }

  const bonneReponse = await page.locator("#zone-choix .btn-choix").evaluateAll((buttons) => {
    const values = buttons.map((button) => button.getAttribute("data-valeur") || "");
    const question = document.getElementById("zone-question")?.textContent || "";
    const match = question.match(/(\d+)\s*\+\s*(\d+)/);
    if (!match) return { answer: "", wrongIndex: 0 };
    const answer = String(Number(match[1]) + Number(match[2]));
    const wrongIndex = values.findIndex((value) => value !== answer);
    return { answer, wrongIndex };
  });

  expect(bonneReponse.answer).not.toBe("");
  expect(bonneReponse.wrongIndex).toBeGreaterThanOrEqual(0);
  await page.locator("#zone-choix .btn-choix").nth(bonneReponse.wrongIndex).click();

  await expect(page.locator("#aide-douce")).toBeVisible();
  await expect(page.locator("#aide-douce")).toContainText("Bonne tentative");
  await expect(page.locator("#aide-douce")).toContainText(`La bonne réponse était : ${bonneReponse.answer}`);
  await expect(page.locator("#explication-visuelle")).toBeVisible();
  await expect(page.locator("#btn-reviser-erreurs")).toBeVisible();
});

test("landing parent-centric affiche promesse, trust et preuve sociale", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.removeItem("landing-seen");
  });
  await page.goto("/index.html");

  await page.waitForFunction(() => window.__amModuleReady === true, null, {
    timeout: 20_000,
  });

  await expect(page.locator("#ecran-landing")).toBeVisible();
  await expect(page.locator(".landing-titre")).toContainText("Aidez votre enfant à progresser");
  await expect(page.locator(".landing-gratuit")).toContainText("Sans inscription");
  await expect(page.locator(".landing-trust-row")).toContainText("Espace parents protégé");
  await expect(page.locator(".landing-social-proof")).toContainText("Ce que disent les parents");
  await expect(page.locator("#btn-landing-cta")).toContainText("Tester gratuitement maintenant");
});
