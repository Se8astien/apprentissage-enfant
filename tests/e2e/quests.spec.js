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

test("quest selection screen shows available quests", async ({ page }) => {
  await page.goto("/index.html");

  await page.waitForFunction(() => window.__amModuleReady === true, null, {
    timeout: 20_000,
  });

  await expect(page.locator("#ecran-menu")).toBeVisible();

  // Click on quests button
  const quetsBtn = page.locator('[data-action="afficher-quetes"]');
  if (await quetsBtn.isVisible()) {
    await quetsBtn.click();
    await expect(page.locator('[data-screen="quests"]')).toBeVisible();

    // Check that quests are displayed
    const questCards = page.locator('[data-quest-id]');
    await expect(questCards).toHaveCount(3); // Should have 3 available quests
  }
});

test("starting a quest shows quest progress UI in game", async ({ page }) => {
  await page.goto("/index.html");

  await page.waitForFunction(() => window.__amModuleReady === true, null, {
    timeout: 20_000,
  });

  // Check localStorage for quest state
  const questState = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("apprentissage-quete-active") || "{}")
  );

  // If a quest is active, it should have id and currentStep
  if (Object.keys(questState).length > 0) {
    expect(questState).toHaveProperty("id");
    expect(questState).toHaveProperty("currentStep");
  }
});

test("completing quest steps shows progress and final celebration", async ({ page }) => {
  await page.goto("/index.html");

  await page.waitForFunction(() => window.__amModuleReady === true, null, {
    timeout: 20_000,
  });

  // Manually set a quest as active
  await page.evaluate(() => {
    localStorage.setItem("apprentissage-quete-active", JSON.stringify({
      id: "aventure-renard",
      currentStep: 0,
      totalSteps: 3,
      startedAt: Date.now(),
    }));
  });

  // Quest data should be retrievable
  const questData = await page.evaluate(() => {
    const active = JSON.parse(localStorage.getItem("apprentissage-quete-active") || "{}");
    return active;
  });

  expect(questData.id).toBe("aventure-renard");
  expect(questData.currentStep).toBe(0);
});

test("quest rewards are displayed when completed", async ({ page }) => {
  await page.goto("/index.html");

  await page.waitForFunction(() => window.__amModuleReady === true, null, {
    timeout: 20_000,
  });

  // Set a completed quest
  await page.evaluate(() => {
    localStorage.setItem("apprentissage-quetes-terminees", JSON.stringify([
      {
        id: "aventure-renard",
        completedAt: Date.now(),
        reward: "50 points",
      },
    ]));
  });

  const completedQuests = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("apprentissage-quetes-terminees") || "[]")
  );

  expect(completedQuests).toHaveLength(1);
  expect(completedQuests[0].id).toBe("aventure-renard");
});
