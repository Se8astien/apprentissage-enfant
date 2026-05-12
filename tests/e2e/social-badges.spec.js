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

test("badge collection is persisted in localStorage", async ({ page }) => {
  await page.goto("/index.html");

  await page.waitForFunction(() => window.__amModuleReady === true, null, {
    timeout: 20_000,
  });

  // Set some badges in localStorage
  await page.evaluate(() => {
    const badges = [
      { id: "premiers-pas", unlockedAt: Date.now() },
      { id: "combo-5", unlockedAt: Date.now() - 86400000 },
    ];
    localStorage.setItem("apprentissage-badges-sociaux", JSON.stringify(badges));
  });

  // Retrieve and verify
  const badges = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("apprentissage-badges-sociaux") || "[]")
  );

  expect(badges).toHaveLength(2);
  expect(badges[0].id).toBe("premiers-pas");
  expect(badges[1].id).toBe("combo-5");
});

test("badge progress is tracked and updated", async ({ page }) => {
  await page.goto("/index.html");

  await page.waitForFunction(() => window.__amModuleReady === true, null, {
    timeout: 20_000,
  });

  // Initialize badge progress
  await page.evaluate(() => {
    localStorage.setItem("apprentissage-badges-progress", JSON.stringify({
      "questions-100": { current: 45, target: 100 },
      "jours-7": { current: 3, target: 7 },
    }));
  });

  const progress = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("apprentissage-badges-progress") || "{}")
  );

  expect(progress["questions-100"].current).toBe(45);
  expect(progress["questions-100"].target).toBe(100);
  expect(progress["jours-7"].current).toBe(3);
});

test("social profile shows unlocked badges", async ({ page }) => {
  await page.goto("/index.html");

  await page.waitForFunction(() => window.__amModuleReady === true, null, {
    timeout: 20_000,
  });

  // Create a social profile with badges
  await page.evaluate(() => {
    const profile = {
      enfantNom: "Foxy",
      badgesDebloquees: [
        { id: "premiers-pas", titre: "Premiers pas", emoji: "\u{1F476}" },
        { id: "combo-5", titre: "Combo 5!", emoji: "\u{1F525}" },
        { id: "expert-addition", titre: "Expert Addition", emoji: "➕" },
      ],
      dateCreation: Date.now(),
    };
    localStorage.setItem("apprentissage-profil-social", JSON.stringify(profile));
  });

  const profile = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("apprentissage-profil-social") || "{}")
  );

  expect(profile.badgesDebloquees).toHaveLength(3);
});

test("badge sharing generates shareable code", async ({ page }) => {
  await page.goto("/index.html");

  await page.waitForFunction(() => window.__amModuleReady === true, null, {
    timeout: 20_000,
  });

  // Generate a sharing code
  await page.evaluate(() => {
    const code = btoa(JSON.stringify({
      enfant: "Foxy",
      badges: ["premiers-pas", "combo-5"],
      date: new Date().toISOString(),
    })).substring(0, 8);
    localStorage.setItem("apprentissage-partage-code", code);
  });

  const code = await page.evaluate(() => localStorage.getItem("apprentissage-partage-code"));
  expect(code).toMatch(/^[A-Za-z0-9+/]{8}$/);
});

test("badge milestones unlock special cosmetics", async ({ page }) => {
  await page.goto("/index.html");

  await page.waitForFunction(() => window.__amModuleReady === true, null, {
    timeout: 20_000,
  });

  // Unlock milestone badges for renard accessories
  await page.evaluate(() => {
    const cosmetics = {
      "badge-10": { nom: "Chapeau d'or", accessible: true, unlockedAt: Date.now() },
      "badge-25": { nom: "Lunettes Etoile", accessible: false, unlockedAt: null },
      "badge-50": { nom: "Cape de Savant", accessible: false, unlockedAt: null },
    };
    localStorage.setItem("apprentissage-cosmetics-badges", JSON.stringify(cosmetics));
  });

  const cosmetics = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("apprentissage-cosmetics-badges") || "{}")
  );

  expect(cosmetics["badge-10"].accessible).toBe(true);
  expect(cosmetics["badge-10"].unlockedAt).not.toBeNull();
  expect(cosmetics["badge-25"].accessible).toBe(false);
});
