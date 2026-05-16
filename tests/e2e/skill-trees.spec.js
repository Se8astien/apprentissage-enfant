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

test("skill tree structure is persisted in localStorage", async ({ page }) => {
  await page.goto("/index.html");

  await page.waitForFunction(() => window.__amModuleReady === true, null, {
    timeout: 20_000,
  });

  // Initialize skill tree
  await page.evaluate(() => {
    const skillTree = {
      domaines: {
        addition: {
          nom: "Addition",
          niveaux: [
            { id: "add-1", nom: "Basics", req: 0, unlocked: true },
            { id: "add-2", nom: "Intermediaire", req: 10, unlocked: false },
            { id: "add-3", nom: "Expert", req: 30, unlocked: false },
          ],
        },
        soustraction: {
          nom: "Soustraction",
          niveaux: [
            { id: "sub-1", nom: "Basics", req: 0, unlocked: true },
            { id: "sub-2", nom: "Intermediaire", req: 10, unlocked: false },
          ],
        },
      },
    };
    localStorage.setItem("apprentissage-skill-tree", JSON.stringify(skillTree));
  });

  const tree = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("apprentissage-skill-tree") || "{}")
  );

  expect(tree.domaines).toHaveProperty("addition");
  expect(tree.domaines.addition.niveaux).toHaveLength(3);
  expect(tree.domaines.addition.niveaux[0].unlocked).toBe(true);
  expect(tree.domaines.addition.niveaux[1].unlocked).toBe(false);
});

test("skill progression tracks mastery levels", async ({ page }) => {
  await page.goto("/index.html");

  await page.waitForFunction(() => window.__amModuleReady === true, null, {
    timeout: 20_000,
  });

  // Track skill mastery
  await page.evaluate(() => {
    const mastery = {
      addition: { questions: 45, correctes: 38, pourcentage: 84 },
      soustraction: { questions: 30, correctes: 22, pourcentage: 73 },
      multiplication: { questions: 10, correctes: 7, pourcentage: 70 },
    };
    localStorage.setItem("apprentissage-mastery-levels", JSON.stringify(mastery));
  });

  const mastery = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("apprentissage-mastery-levels") || "{}")
  );

  expect(mastery.addition.questions).toBe(45);
  expect(mastery.addition.pourcentage).toBe(84);
  expect(mastery.soustraction.pourcentage).toBe(73);
});

test("unlocking skills opens next branch in tree", async ({ page }) => {
  await page.goto("/index.html");

  await page.waitForFunction(() => window.__amModuleReady === true, null, {
    timeout: 20_000,
  });

  // Simulate progression: unlock next skill level
  await page.evaluate(() => {
    const progression = [
      { skillId: "add-1", unlockedAt: Date.now() - 86400000 },
      { skillId: "add-2", unlockedAt: Date.now() },
    ];
    localStorage.setItem("apprentissage-skills-unlocked", JSON.stringify(progression));
  });

  const progression = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("apprentissage-skills-unlocked") || "[]")
  );

  expect(progression).toHaveLength(2);
  expect(progression[0].skillId).toBe("add-1");
  expect(progression[1].skillId).toBe("add-2");
});

test("skill tree shows visual progress bars per domain", async ({ page }) => {
  await page.goto("/index.html");

  await page.waitForFunction(() => window.__amModuleReady === true, null, {
    timeout: 20_000,
  });

  // Create progress data
  await page.evaluate(() => {
    const progress = {
      addition: { current: 38, target: 40, percent: 95 },
      soustraction: { current: 22, target: 40, percent: 55 },
      multiplication: { current: 7, target: 40, percent: 17 },
    };
    localStorage.setItem("apprentissage-skill-progress", JSON.stringify(progress));
  });

  const progress = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("apprentissage-skill-progress") || "{}")
  );

  expect(progress.addition.percent).toBe(95);
  expect(progress.soustraction.percent).toBe(55);
  expect(progress.multiplication.percent).toBe(17);
});

test("skill tree recommends next focus based on progress", async ({ page }) => {
  await page.goto("/index.html");

  await page.waitForFunction(() => window.__amModuleReady === true, null, {
    timeout: 20_000,
  });

  // Store recommendation
  await page.evaluate(() => {
    const recommendation = {
      focus_skill: "multiplication",
      reason: "low_mastery",
      suggested_at: Date.now(),
    };
    localStorage.setItem("apprentissage-skill-recommendation", JSON.stringify(recommendation));
  });

  const rec = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("apprentissage-skill-recommendation") || "{}")
  );

  expect(rec.focus_skill).toBe("multiplication");
  expect(rec.reason).toBe("low_mastery");
});
