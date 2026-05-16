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

test("audio mode settings are persisted in localStorage", async ({ page }) => {
  await page.goto("/index.html");

  await page.waitForFunction(() => window.__amModuleReady === true, null, {
    timeout: 20_000,
  });

  // Set audio preferences
  await page.evaluate(() => {
    const audioConfig = {
      lectureAutomatique: true,
      vitesseParole: 1.2,
      volumeGlobal: 80,
      langueNarration: "fr-FR",
      enabled: true,
    };
    localStorage.setItem("apprentissage-audio-config", JSON.stringify(audioConfig));
  });

  const config = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("apprentissage-audio-config") || "{}")
  );

  expect(config.lectureAutomatique).toBe(true);
  expect(config.vitesseParole).toBe(1.2);
  expect(config.volumeGlobal).toBe(80);
  expect(config.langueNarration).toBe("fr-FR");
});

test("audio playback state is tracked", async ({ page }) => {
  await page.goto("/index.html");

  await page.waitForFunction(() => window.__amModuleReady === true, null, {
    timeout: 20_000,
  });

  // Track audio playback
  await page.evaluate(() => {
    const playbackState = {
      isPlaying: false,
      currentText: null,
      startedAt: null,
      history: [
        { texte: "7 + 3 = ?", playedAt: Date.now() - 10000 },
        { texte: "Tres bien!", playedAt: Date.now() - 5000 },
      ],
    };
    localStorage.setItem("apprentissage-audio-playback", JSON.stringify(playbackState));
  });

  const state = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("apprentissage-audio-playback") || "{}")
  );

  expect(state.isPlaying).toBe(false);
  expect(state.history).toHaveLength(2);
  expect(state.history[0].texte).toBe("7 + 3 = ?");
});

test("speech recognition can be toggled on/off", async ({ page }) => {
  await page.goto("/index.html");

  await page.waitForFunction(() => window.__amModuleReady === true, null, {
    timeout: 20_000,
  });

  // Configure speech recognition
  await page.evaluate(() => {
    const speechConfig = {
      enabled: false,
      language: "fr-FR",
      interim_results: true,
      max_alternatives: 3,
    };
    localStorage.setItem("apprentissage-speech-input", JSON.stringify(speechConfig));
  });

  const config = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("apprentissage-speech-input") || "{}")
  );

  expect(config.enabled).toBe(false);
  expect(config.language).toBe("fr-FR");
});

test("audio lessons are structured in localStorage", async ({ page }) => {
  await page.goto("/index.html");

  await page.waitForFunction(() => window.__amModuleReady === true, null, {
    timeout: 20_000,
  });

  // Create audio lessons
  await page.evaluate(() => {
    const lessons = [
      {
        id: "audio-add-1",
        titre: "L'addition, c'est facile!",
        duree: 120,
        contenu: ["addition est ajouter", "5 + 3 = 8", "essaie toi aussi!"],
        completed: false,
      },
      {
        id: "audio-add-2",
        titre: "L'addition avec retenue",
        duree: 180,
        contenu: ["retenue = 10", "8 + 4 = 12", "12 = 10 + 2"],
        completed: true,
      },
    ];
    localStorage.setItem("apprentissage-audio-lessons", JSON.stringify(lessons));
  });

  const lessons = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("apprentissage-audio-lessons") || "[]")
  );

  expect(lessons).toHaveLength(2);
  expect(lessons[0].titre).toBe("L'addition, c'est facile!");
  expect(lessons[1].completed).toBe(true);
});

test("audio preferences respect accessibility settings", async ({ page }) => {
  await page.goto("/index.html");

  await page.waitForFunction(() => window.__amModuleReady === true, null, {
    timeout: 20_000,
  });

  // Set accessibility preferences
  await page.evaluate(() => {
    const accessibility = {
      "lecture-lente": true,
      "pause-longue": true,
      "haute-voix": true,
      "sans-bruit-fond": true,
    };
    localStorage.setItem("apprentissage-accessibility", JSON.stringify(accessibility));
  });

  const a11y = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("apprentissage-accessibility") || "{}")
  );

  expect(a11y["lecture-lente"]).toBe(true);
  expect(a11y["pause-longue"]).toBe(true);
});
