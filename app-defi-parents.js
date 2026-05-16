// app-defi-parents.js — Défi posé par les parents depuis l'espace parents

const CLE = "am-defi-parent";

export function lireDefiParent() {
  try {
    const d = JSON.parse(localStorage.getItem(CLE));
    if (!d || !d.texte) return null;
    if (d.expire && Date.now() > d.expire) { localStorage.removeItem(CLE); return null; }
    return d;
  } catch { return null; }
}

export function sauverDefiParent(texte, jeu, cible, dureeH = 24) {
  const data = { texte, jeu: jeu || null, cible: Number(cible) || 10, progres: 0, expire: Date.now() + dureeH * 3600000 };
  localStorage.setItem(CLE, JSON.stringify(data));
}

export function progresserDefi(jeuId) {
  try {
    const d = JSON.parse(localStorage.getItem(CLE));
    if (!d || !d.texte) return;
    if (d.expire && Date.now() > d.expire) { localStorage.removeItem(CLE); return; }
    if (d.jeu && d.jeu !== jeuId) return;
    d.progres = Math.min((d.progres || 0) + 1, d.cible);
    localStorage.setItem(CLE, JSON.stringify(d));
    if (d.progres >= d.cible) {
      import("./app-sons.js").then((m) => m.sonTrophee?.());
    }
  } catch { /* ignore */ }
}

export function afficherDefiMenu() {
  const el = document.getElementById("defi-parent-banner");
  if (!el) return;
  const d = lireDefiParent();
  if (!d) { el.hidden = true; return; }
  const termine = d.progres >= d.cible;
  el.hidden = false;
  el.innerHTML = `
    <div class="defi-parent-banner">
      <span class="defi-ico">⭐</span>
      <div class="defi-txt">
        <strong>${termine ? "✅ " : ""}Défi de papa/maman</strong>
        ${d.texte} — ${d.progres}/${d.cible}${termine ? " Bravo !" : ""}
      </div>
    </div>
  `;
}
