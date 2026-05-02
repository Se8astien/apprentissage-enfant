import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem("landing-seen", "1");
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
  await page.goto("/index.html");

  await page.waitForFunction(() => window.__amModuleReady === true, null, {
    timeout: 20_000,
  });

  await expect(page.locator("#ecran-menu")).toBeVisible();

  const label = page.locator("#classe-info-label");
  await expect(label).toContainText("CP");

  await expect(page.locator("#niveau-cp")).toHaveAttribute("aria-pressed", "true");

  await page.locator("#niveau-ce2").click();
  await expect(label).toContainText("CE2");
  await expect(page.locator("#niveau-ce2")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#niveau-cp")).toHaveAttribute("aria-pressed", "false");

  await page.locator("#niveau-cm2").click();
  await expect(label).toContainText("CM2");
  await expect(page.locator("#niveau-cm2")).toHaveAttribute("aria-pressed", "true");
});

test("une mauvaise réponse affiche une aide douce et la bonne réponse", async ({
  page,
}) => {
  await page.goto("/index.html");

  await page.waitForFunction(() => window.__amModuleReady === true, null, {
    timeout: 20_000,
  });

  await page.locator('.carte-jeu[data-jeu="addition"]').click();
  await expect(page.locator("#ecran-jeu")).toBeVisible();
  const intro = page.locator(".btn-evolution-fermer");
  if (await intro.isVisible()) {
    await intro.click();
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
});
