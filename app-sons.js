// app-sons.js — Web Audio API, aucun fichier externe requis
let _ac = null;

function getAC() {
  if (!_ac) _ac = new (window.AudioContext || window.webkitAudioContext)();
  if (_ac.state === "suspended") _ac.resume();
  return _ac;
}

function jouer(notes, type = "sine") {
  if (localStorage.getItem("sons-actifs") === "non") return;
  try {
    const ac = getAC();
    let t = ac.currentTime;
    notes.forEach(([freq, dur, vol = 0.28]) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.start(t);
      osc.stop(t + dur);
      t += dur;
    });
  } catch (_) {}
}

export function sonBonne() {
  jouer([[523, 0.08], [659, 0.08], [784, 0.18]]);
}

export function sonMauvaise() {
  jouer([[280, 0.1], [220, 0.2]], "sawtooth");
}

export function sonCombo() {
  jouer([[523, 0.07], [659, 0.07], [784, 0.07], [1047, 0.3]]);
}

export function toggleSons() {
  const wasOn = localStorage.getItem("sons-actifs") !== "non";
  localStorage.setItem("sons-actifs", wasOn ? "non" : "oui");
  return !wasOn;
}

export function sonsActifs() {
  return localStorage.getItem("sons-actifs") !== "non";
}
