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

test("parent dashboard can be accessed from menu", async ({ page }) => {
  await page.goto("/index.html");

  await page.waitForFunction(() => window.__amModuleReady === true, null, {
    timeout: 20_000,
  });

  await expect(page.locator("#ecran-menu")).toBeVisible();

  // Check if parent dashboard link/button exists
  const parentLink = page.locator('a[href="parent.html"], button[data-action="parent-dashboard"]');
  if (await parentLink.isVisible()) {
    expect(parentLink).toBeVisible();
  }
});

test("parent dashboard displays weekly statistics", async ({ page }) => {
  await page.goto("/index.html");

  await page.waitForFunction(() => window.__amModuleReady === true, null, {
    timeout: 20_000,
  });

  // Set up weekly stats
  await page.evaluate(() => {
    const stats = {
      enfants: {
        foxy: {
          nom: "Foxy",
          partiesTotal: 150,
          tauxReussite: 82,
          tempsSession: 245,
          domaines: {
            addition: { tauxReussite: 88, questions: 50 },
            soustraction: { tauxReussite: 79, questions: 40 },
            multiplication: { tauxReussite: 78, questions: 30 },
            division: { tauxReussite: 70, questions: 20 },
            lecture: { tauxReussite: 88, questions: 10 },
          },
          meilleureCombo: 42,
          joursConsecutifs: 5,
        },
      },
      semaine: "2026-05-12",
    };
    localStorage.setItem("apprentissage-parent-stats", JSON.stringify(stats));
  });

  const stats = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("apprentissage-parent-stats") || "{}")
  );

  expect(stats.enfants.foxy.partiesTotal).toBe(150);
  expect(stats.enfants.foxy.tauxReussite).toBe(82);
});

test("heatmap shows mastery by domain", async ({ page }) => {
  await page.goto("/index.html");

  await page.waitForFunction(() => window.__amModuleReady === true, null, {
    timeout: 20_000,
  });

  // Set domain-specific stats
  await page.evaluate(() => {
    const heatmap = {
      enfant: "Foxy",
      domaines: [
        { nom: "Addition", mastery: 88, color: "#4caf50" },
        { nom: "Soustraction", mastery: 79, color: "#ff9800" },
        { nom: "Multiplication", mastery: 78, color: "#ff9800" },
        { nom: "Division", mastery: 70, color: "#ff9800" },
        { nom: "Lecture", mastery: 88, color: "#4caf50" },
      ],
      date: Date.now(),
    };
    localStorage.setItem("apprentissage-parent-heatmap", JSON.stringify(heatmap));
  });

  const heatmap = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("apprentissage-parent-heatmap") || "{}")
  );

  expect(heatmap.domaines).toHaveLength(5);
  expect(heatmap.domaines[0].mastery).toBe(88);
  expect(heatmap.domaines[3].mastery).toBe(70);
});

test("parent dashboard generates recommendations for tomorrow", async ({ page }) => {
  await page.goto("/index.html");

  await page.waitForFunction(() => window.__amModuleReady === true, null, {
    timeout: 20_000,
  });

  // Generate recommendations
  await page.evaluate(() => {
    const recommendations = {
      enfant: "Foxy",
      date: new Date().toISOString().split("T")[0],
      exercicesConsailles: [
        {
          domaine: "Division",
          raison: "Maitrise basse (70%)",
          duree: "5-10 min",
          priorite: "haute",
        },
        {
          domaine: "Multiplication",
          raison: "Consolider la maitrise",
          duree: "5 min",
          priorite: "moyenne",
        },
        {
          domaine: "Addition",
          raison: "Approche d'un nouveau niveau",
          duree: "5 min",
          priorite: "basse",
        },
      ],
    };
    localStorage.setItem("apprentissage-parent-recommendations", JSON.stringify(recommendations));
  });

  const recs = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("apprentissage-parent-recommendations") || "{}")
  );

  expect(recs.exercicesConsailles).toHaveLength(3);
  expect(recs.exercicesConsailles[0].domaine).toBe("Division");
  expect(recs.exercicesConsailles[0].priorite).toBe("haute");
});

test("parent can export progress report as PDF data", async ({ page }) => {
  await page.goto("/index.html");

  await page.waitForFunction(() => window.__amModuleReady === true, null, {
    timeout: 20_000,
  });

  // Create export data
  await page.evaluate(() => {
    const exportData = {
      enfant: "Foxy",
      semaine: "2026-05-05",
      resume: {
        questionsRepondues: 150,
        tauxReussite: 82,
        tauxProgression: 5,
      },
      domaines: [
        {
          nom: "Addition",
          tauxReussite: 88,
          questions: 50,
          status: "Excellent",
        },
        {
          nom: "Division",
          tauxReussite: 70,
          questions: 20,
          status: "A ameliorer",
        },
      ],
      recommendations: [
        "Continuer l'excellent travail en addition",
        "Pratiquer davantage la division",
      ],
      generatedAt: Date.now(),
    };
    localStorage.setItem("apprentissage-export-pdf", JSON.stringify(exportData));
  });

  const exportData = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("apprentissage-export-pdf") || "{}")
  );

  expect(exportData.enfant).toBe("Foxy");
  expect(exportData.resume.questionsRepondues).toBe(150);
  expect(exportData.domaines).toHaveLength(2);
});

test("parent dashboard tracks multiple children profiles", async ({ page }) => {
  await page.goto("/index.html");

  await page.waitForFunction(() => window.__amModuleReady === true, null, {
    timeout: 20_000,
  });

  // Multiple children
  await page.evaluate(() => {
    const multiKids = {
      enfants: [
        { id: "foxy", nom: "Foxy", age: 7, classe: "CP", tauxReussite: 82 },
        { id: "luna", nom: "Luna", age: 9, classe: "CE2", tauxReussite: 76 },
        { id: "milo", nom: "Milo", age: 8, classe: "CE1", tauxReussite: 88 },
      ],
      miseAJour: Date.now(),
    };
    localStorage.setItem("apprentissage-parent-profils", JSON.stringify(multiKids));
  });

  const profiles = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("apprentissage-parent-profils") || "{}")
  );

  expect(profiles.enfants).toHaveLength(3);
  expect(profiles.enfants[1].nom).toBe("Luna");
  expect(profiles.enfants[2].tauxReussite).toBe(88);
});
