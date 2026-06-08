// app-audio-mode.js — Audio mode with Web Speech API support
// #20 Mode Audio

let synth = null;
let recognition = null;
let isAudioEnabled = false;
let currentUtterance = null;

export function initialiserAudio() {
  const window_ = typeof window !== "undefined" ? window : globalThis;

  const SpeechRecognition = window_.SpeechRecognition || window_.webkitSpeechRecognition;

  if (window_.speechSynthesis) {
    synth = window_.speechSynthesis;
  }

  if (SpeechRecognition) {
    try {
      recognition = new SpeechRecognition();
    } catch { /* ignore */ }
  }

  chargerConfigAudio();
}

function chargerConfigAudio() {
  try {
    const config = JSON.parse(localStorage.getItem("apprentissage-audio-config") || "{}");
    isAudioEnabled = config.enabled || false;
  } catch (e) {
    isAudioEnabled = false;
  }
}

export function obtenirConfigAudio() {
  try {
    return JSON.parse(localStorage.getItem("apprentissage-audio-config") || "{}");
  } catch (e) {
    return getConfigAudioParDefaut();
  }
}

function getConfigAudioParDefaut() {
  return {
    lectureAutomatique: false,
    vitesseParole: 1.0,
    volumeGlobal: 100,
    langueNarration: "fr-FR",
    enabled: false,
  };
}

export function sauvegarderConfigAudio(config) {
  localStorage.setItem("apprentissage-audio-config", JSON.stringify(config));
  chargerConfigAudio();
}

export function deactiverAudio() {
  isAudioEnabled = false;
  arreterLecture();
  const config = obtenirConfigAudio();
  config.enabled = false;
  sauvegarderConfigAudio(config);
}

export function activerAudio() {
  isAudioEnabled = true;
  const config = obtenirConfigAudio();
  config.enabled = true;
  sauvegarderConfigAudio(config);
}

export function lireTexte(texte, options = {}) {
  if (!isAudioEnabled || !synth) return;

  arreterLecture();

  const config = obtenirConfigAudio();
  const utterance = new SpeechSynthesisUtterance(texte);

  utterance.language = config.langueNarration || "fr-FR";
  utterance.rate = options.vitesse || config.vitesseParole || 1.0;
  utterance.volume = (config.volumeGlobal || 100) / 100;
  utterance.pitch = options.pitch || 1.0;

  currentUtterance = utterance;

  synth.speak(utterance);

  enregistrerLectureHistorique(texte);
}

export function arreterLecture() {
  if (!synth) return;
  synth.cancel();
  currentUtterance = null;
}

export function estEnLecture() {
  return synth ? synth.speaking : false;
}

function enregistrerLectureHistorique(texte) {
  try {
    const state = JSON.parse(localStorage.getItem("apprentissage-audio-playback") || "{}");
    if (!state.history) state.history = [];

    state.history.push({
      texte,
      playedAt: Date.now(),
    });

    // Garder seulement les 50 derniers
    if (state.history.length > 50) {
      state.history = state.history.slice(-50);
    }

    localStorage.setItem("apprentissage-audio-playback", JSON.stringify(state));
  } catch (e) {
    // Silencieusement ignorer les erreurs
  }
}

export function demarrerReconnaissance(onResult, onError) {
  if (!recognition || !isAudioEnabled) return false;

  const config = JSON.parse(localStorage.getItem("apprentissage-speech-input") || "{}");
  if (!config.enabled) return false;

  recognition.language = config.language || "fr-FR";
  recognition.interimResults = config.interim_results || false;
  recognition.maxAlternatives = config.max_alternatives || 1;

  recognition.onresult = (event) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcriptSeg = event.results[i][0].transcript;
      transcript += transcriptSeg;
    }
    if (onResult) onResult(transcript);
  };

  recognition.onerror = (event) => {
    if (onError) onError(event.error);
  };

  recognition.start();
  return true;
}

export function arreterReconnaissance() {
  if (!recognition) return;
  recognition.stop();
}

export function creerInterfaceAudioMode() {
  const config = obtenirConfigAudio();

  return `
    <div style="padding: 2rem; background: white; border-radius: 1rem; max-width: 500px; margin: 0 auto;">
      <h2 style="margin: 0 0 1.5rem; font-size: 1.5rem;">🎧 Mode Audio</h2>

      <div style="background: ${config.enabled ? "#c8e6c9" : "#ffebee"}; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
        <p style="margin: 0; font-weight: 700; color: ${config.enabled ? "#2e7d32" : "#c62828"};">
          ${config.enabled ? "✅ Audio activé" : "❌ Audio désactivé"}
        </p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <div>
          <label style="display: block; font-weight: 700; margin-bottom: 0.5rem;">Lecture automatique</label>
          <input
            type="checkbox"
            id="audio-lecture-auto"
            ${config.lectureAutomatique ? "checked" : ""}
            style="cursor: pointer;"
          />
          <label for="audio-lecture-auto" style="margin-left: 0.5rem; font-size: 0.9rem;">
            Lire les questions à haute voix
          </label>
        </div>

        <div>
          <label style="display: block; font-weight: 700; margin-bottom: 0.5rem;">
            Vitesse de parole: ${config.vitesseParole.toFixed(1)}x
          </label>
          <input
            type="range"
            id="audio-speed"
            min="0.5"
            max="2"
            step="0.1"
            value="${config.vitesseParole}"
            style="width: 100%; cursor: pointer;"
          />
        </div>

        <div>
          <label style="display: block; font-weight: 700; margin-bottom: 0.5rem;">
            Volume: ${config.volumeGlobal}%
          </label>
          <input
            type="range"
            id="audio-volume"
            min="0"
            max="100"
            step="5"
            value="${config.volumeGlobal}"
            style="width: 100%; cursor: pointer;"
          />
        </div>

        <div>
          <label style="display: block; font-weight: 700; margin-bottom: 0.5rem;">Langue</label>
          <select id="audio-language" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 0.4rem;">
            <option value="fr-FR" ${config.langueNarration === "fr-FR" ? "selected" : ""}>Français</option>
            <option value="en-US" ${config.langueNarration === "en-US" ? "selected" : ""}>Anglais</option>
            <option value="es-ES" ${config.langueNarration === "es-ES" ? "selected" : ""}>Espagnol</option>
          </select>
        </div>

        <div style="border-top: 1px solid #eee; padding-top: 1.5rem;">
          <h3 style="margin: 0 0 1rem; font-size: 1rem;">🎤 Reconnaissance vocale</h3>
          <input
            type="checkbox"
            id="audio-speech-input"
            style="cursor: pointer;"
          />
          <label for="audio-speech-input" style="margin-left: 0.5rem; font-size: 0.9rem;">
            Pouvoir répondre à la voix
          </label>
          <p style="margin: 0.5rem 0 0; font-size: 0.8rem; color: #666;">
            💡 Parle clairement après avoir activé la reconnaissance
          </p>
        </div>

        <button
          id="btn-tester-audio"
          style="
            padding: 0.8rem;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 0.5rem;
            font-weight: 700;
            cursor: pointer;
            font-size: 0.95rem;
          "
        >
          🔊 Tester le son
        </button>

        <button
          id="btn-fermer-audio"
          style="
            padding: 0.8rem;
            background: #999;
            color: white;
            border: none;
            border-radius: 0.5rem;
            font-weight: 700;
            cursor: pointer;
          "
        >
          Fermer
        </button>
      </div>
    </div>
  `;
}

export function afficherLessonAudio(lesson) {
  if (!lesson) return "";

  return `
    <div style="
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 1rem;
      text-align: center;
    ">
      <h2 style="margin: 0 0 1rem; font-size: 1.3rem;">🎧 ${lesson.titre}</h2>

      <div style="
        background: rgba(255,255,255,0.2);
        padding: 1.5rem;
        border-radius: 0.5rem;
        margin-bottom: 1.5rem;
      ">
        <p style="margin: 0 0 0.5rem; font-size: 0.9rem; opacity: 0.9;">Durée: ${Math.round(lesson.durée / 60)} min</p>
        <div style="display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap;">
          ${lesson.contenu
            .slice(0, 3)
            .map((texte) => `<span style="background: rgba(0,0,0,0.2); padding: 0.25rem 0.5rem; border-radius: 1rem; font-size: 0.8rem;">
            ${texte.substring(0, 20)}...
          </span>`)
            .join("")}
        </div>
      </div>

      <button
        id="btn-lancer-lesson"
        style="
          padding: 0.8rem 1.5rem;
          background: white;
          color: #667eea;
          border: none;
          border-radius: 0.5rem;
          font-weight: 700;
          cursor: pointer;
          font-size: 1rem;
        "
      >
        ▶️ Écouter
      </button>
    </div>
  `;
}

export function obtenirLessonAudio(lessonId) {
  try {
    const lessons = JSON.parse(localStorage.getItem("apprentissage-audio-lessons") || "[]");
    return lessons.find((l) => l.id === lessonId);
  } catch (e) {
    return null;
  }
}

export function sauvegarderLessonCompleted(lessonId) {
  try {
    const lessons = JSON.parse(localStorage.getItem("apprentissage-audio-lessons") || "[]");
    const lesson = lessons.find((l) => l.id === lessonId);
    if (lesson) {
      lesson.completed = true;
      lesson.completedAt = Date.now();
      localStorage.setItem("apprentissage-audio-lessons", JSON.stringify(lessons));
    }
  } catch (e) {
    // Silencieusement ignorer
  }
}

export function obtenirAccessibilite() {
  try {
    return JSON.parse(localStorage.getItem("apprentissage-accessibility") || "{}");
  } catch (e) {
    return {};
  }
}

export function sauvegarderAccessibilite(settings) {
  localStorage.setItem("apprentissage-accessibility", JSON.stringify(settings));
}
