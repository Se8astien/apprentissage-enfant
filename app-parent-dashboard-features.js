// app-parent-dashboard-features.js — Parent dashboard analytics & recommendations
// #16 Dashboard Parent

export function calculerStatistiquesEnfant(enfantId) {
  try {
    // Récupérer toutes les statistiques de l'enfant depuis le localStorage
    const maitrise = JSON.parse(localStorage.getItem("apprentissage-mastery-levels") || "{}");
    const domaineStat = {};

    for (const [domaine, stats] of Object.entries(maitrise)) {
      domaineStat[domaine] = {
        tauxReussite: stats.pourcentage || 0,
        questions: stats.questions || 0,
        correctes: stats.correctes || 0,
      };
    }

    // Calculer le total
    const totalQuestions = Object.values(domaineStat).reduce((s, d) => s + d.questions, 0);
    const totalCorrectes = Object.values(domaineStat).reduce((s, d) => s + d.correctes, 0);
    const tauxGlobal = totalQuestions > 0 ? Math.round((totalCorrectes / totalQuestions) * 100) : 0;

    return {
      enfantId,
      totalQuestions,
      tauxReussite: tauxGlobal,
      domaines: domaineStat,
      miseAJour: Date.now(),
    };
  } catch (e) {
    return {
      enfantId,
      totalQuestions: 0,
      tauxReussite: 0,
      domaines: {},
      miseAJour: Date.now(),
    };
  }
}

export function genererHeatmap(enfantId) {
  const stats = calculerStatistiquesEnfant(enfantId);

  const domaines = Object.entries(stats.domaines).map(([nom, data]) => {
    let color = "#4caf50";
    if (data.tauxReussite < 60) color = "#f44336";
    else if (data.tauxReussite < 80) color = "#ff9800";

    return {
      nom: nom.charAt(0).toUpperCase() + nom.slice(1),
      mastery: data.tauxReussite,
      color,
      questions: data.questions,
    };
  });

  const heatmapData = {
    enfant: enfantId,
    domaines,
    tauxGlobal: stats.tauxReussite,
    date: new Date().toISOString().split("T")[0],
  };

  localStorage.setItem("apprentissage-parent-heatmap", JSON.stringify(heatmapData));
  return heatmapData;
}

export function genererRecommandations(enfantId) {
  const stats = calculerStatistiquesEnfant(enfantId);

  const exercicesConsailles = [];

  // Identifier les domaines faibles
  const domaineFaible = Object.entries(stats.domaines)
    .filter(([_, d]) => d.tauxReussite < 70 && d.questions >= 5)
    .sort(([_, a], [__, b]) => a.tauxReussite - b.tauxReussite)[0];

  if (domaineFaible) {
    exercicesConsailles.push({
      domaine: domaineFaible[0].charAt(0).toUpperCase() + domaineFaible[0].slice(1),
      raison: "Maîtrise basse (" + domaineFaible[1].tauxReussite + "%)",
      duree: "5-10 min",
      priorite: "haute",
      exercicesNum: Math.ceil(domaineFaible[1].questions * 0.2),
    });
  }

  // Domaines à consolider (70-85%)
  const domainesConsolider = Object.entries(stats.domaines).filter(
    ([_, d]) => d.tauxReussite >= 70 && d.tauxReussite < 85 && d.questions >= 5
  );

  for (const [domaine, data] of domainesConsolider.slice(0, 2)) {
    exercicesConsailles.push({
      domaine: domaine.charAt(0).toUpperCase() + domaine.slice(1),
      raison: "Consolider la maîtrise",
      duree: "5 min",
      priorite: "moyenne",
      exercicesNum: 5,
    });
  }

  // Domaines excellents (85%+)
  const domainesExcellents = Object.entries(stats.domaines).filter(([_, d]) => d.tauxReussite >= 85);
  if (domainesExcellents.length > 0) {
    const [domaine, data] = domainesExcellents[0];
    exercicesConsailles.push({
      domaine: domaine.charAt(0).toUpperCase() + domaine.slice(1),
      raison: "Excellent! Continuer!",
      duree: "5 min",
      priorite: "basse",
      exercicesNum: 3,
    });
  }

  const recommendations = {
    enfant: enfantId,
    date: new Date().toISOString().split("T")[0],
    exercicesConsailles,
    totalDuree: "5-15 min",
  };

  localStorage.setItem("apprentissage-parent-recommendations", JSON.stringify(recommendations));
  return recommendations;
}

export function afficherTableauDeBordParent(enfantId, nomEnfant = "Enfant") {
  const stats = calculerStatistiquesEnfant(enfantId);
  const heatmap = genererHeatmap(enfantId);
  const recs = genererRecommandations(enfantId);

  return `
    <div style="padding: 2rem; background: white;">
      <h1 style="margin: 0 0 1.5rem; font-size: 2rem;">📊 Tableau de bord — ${nomEnfant}</h1>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1.5rem; border-radius: 0.75rem; text-align: center;">
          <p style="margin: 0 0 0.5rem; font-size: 0.9rem; opacity: 0.9;">Questions répondues</p>
          <p style="margin: 0; font-size: 2.5rem; font-weight: 700;">${stats.totalQuestions}</p>
        </div>

        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 1.5rem; border-radius: 0.75rem; text-align: center;">
          <p style="margin: 0 0 0.5rem; font-size: 0.9rem; opacity: 0.9;">Taux de réussite</p>
          <p style="margin: 0; font-size: 2.5rem; font-weight: 700;">${stats.tauxReussite}%</p>
        </div>

        <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 1.5rem; border-radius: 0.75rem; text-align: center;">
          <p style="margin: 0 0 0.5rem; font-size: 0.9rem; opacity: 0.9;">Domaines</p>
          <p style="margin: 0; font-size: 2.5rem; font-weight: 700;">${Object.keys(stats.domaines).length}</p>
        </div>
      </div>

      <h2 style="margin: 1.5rem 0 1rem; font-size: 1.3rem;">🗺️ Carte de maîtrise</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
        ${heatmap.domaines
          .map(
            (dom) => `
          <div style="
            background: ${dom.color};
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            text-align: center;
            font-weight: 700;
          ">
            <div style="font-size: 0.85rem; margin-bottom: 0.3rem;">${dom.nom}</div>
            <div style="font-size: 1.8rem; margin-bottom: 0.3rem;">${dom.mastery}%</div>
            <div style="font-size: 0.75rem; opacity: 0.9;">${dom.questions} questions</div>
          </div>
        `
          )
          .join("")}
      </div>

      <h2 style="margin: 1.5rem 0 1rem; font-size: 1.3rem;">💡 Exercices conseillés pour demain</h2>
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${recs.exercicesConsailles
          .map(
            (ex) => `
          <div style="
            background: ${ex.priorite === "haute" ? "#ffebee" : ex.priorite === "moyenne" ? "#fff8e1" : "#f1f8e9"};
            border-left: 4px solid ${ex.priorite === "haute" ? "#f44336" : ex.priorite === "moyenne" ? "#ffc107" : "#4caf50"};
            padding: 1rem;
            border-radius: 0.5rem;
          ">
            <p style="margin: 0 0 0.3rem; font-weight: 700; font-size: 1rem;">
              ${ex.domaine}
              ${ex.priorite === "haute" ? "🔴" : ex.priorite === "moyenne" ? "🟡" : "🟢"}
            </p>
            <p style="margin: 0 0 0.5rem; font-size: 0.9rem; color: #666;">
              ${ex.raison}
            </p>
            <p style="margin: 0; font-size: 0.85rem; color: #999;">
              ⏱️ ${ex.duree} • 🎯 ${ex.exercicesNum} exercices
            </p>
          </div>
        `
          )
          .join("")}
      </div>

      <div style="margin-top: 2rem; padding: 1rem; background: #f0f8ff; border-radius: 0.5rem;">
        <p style="margin: 0; font-size: 0.9rem; color: #666;">
          📈 <strong>Note:</strong> Ces recommandations sont basées sur la performance réelle de la semaine.
        </p>
      </div>
    </div>
  `;
}

export function genererExportPDF(enfantId, nomEnfant) {
  const stats = calculerStatistiquesEnfant(enfantId);
  const recs = genererRecommandations(enfantId);
  const semaine = new Date().toISOString().split("T")[0];

  const domainesData = Object.entries(stats.domaines).map(([nom, data]) => ({
    nom: nom.charAt(0).toUpperCase() + nom.slice(1),
    tauxReussite: data.tauxReussite,
    questions: data.questions,
    status: data.tauxReussite >= 80 ? "✅ Solide" : data.tauxReussite >= 60 ? "⚠️ En cours" : "🔴 À revoir",
  }));

  const exportData = {
    enfant: nomEnfant,
    semaine,
    resume: {
      questionsRepondues: stats.totalQuestions,
      tauxReussite: stats.tauxReussite,
      nombreDomaines: Object.keys(stats.domaines).length,
    },
    domaines: domainesData,
    recommendations: recs.exercicesConsailles.map((e) => {
      const emoji = e.priorite === "haute" ? "🔴" : e.priorite === "moyenne" ? "🟡" : "🟢";
      return emoji + " " + e.domaine + ": " + e.raison;
    }),
    generatedAt: new Date().toISOString(),
  };

  localStorage.setItem("apprentissage-export-pdf", JSON.stringify(exportData));
  return exportData;
}

export function obtenirProfilsMultiplesEnfants() {
  try {
    return JSON.parse(localStorage.getItem("apprentissage-parent-profils") || "{}");
  } catch (e) {
    return { enfants: [] };
  }
}

export function ajouterEnfantProfil(enfantData) {
  const profiles = obtenirProfilsMultiplesEnfants();
  if (!profiles.enfants) profiles.enfants = [];

  if (!profiles.enfants.find((e) => e.id === enfantData.id)) {
    profiles.enfants.push({
      id: enfantData.id,
      nom: enfantData.nom,
      age: enfantData.age,
      classe: enfantData.classe,
      tauxReussite: 0,
      ajouteA: Date.now(),
    });

    profiles.miseAJour = Date.now();
    localStorage.setItem("apprentissage-parent-profils", JSON.stringify(profiles));
  }

  return profiles;
}

export function afficherTableauBordMultipleEnfants() {
  const profiles = obtenirProfilsMultiplesEnfants();

  if (!profiles.enfants || profiles.enfants.length === 0) {
    return `
      <div style="padding: 2rem; text-align: center; background: #f9f9f9; border-radius: 1rem;">
        <p style="margin: 0; color: #999; font-size: 1.1rem;">
          Aucun enfant ajouté encore. Commencez avec le premier profil! 👶
        </p>
      </div>
    `;
  }

  return `
    <div style="padding: 2rem; background: white;">
      <h1 style="margin: 0 0 1.5rem; font-size: 2rem;">👨‍👩‍👧‍👦 Suivi famille</h1>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
        ${profiles.enfants
          .map(
            (enfant) => `
          <div style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1.5rem;
            border-radius: 0.75rem;
          ">
            <h3 style="margin: 0 0 0.5rem; font-size: 1.2rem;">👦 ${enfant.nom}</h3>
            <p style="margin: 0 0 1rem; font-size: 0.9rem; opacity: 0.9;">
              ${enfant.classe} — ${enfant.age} ans
            </p>

            <div style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
              <p style="margin: 0 0 0.3rem; font-size: 0.85rem; opacity: 0.9;">Taux de réussite</p>
              <p style="margin: 0; font-size: 1.8rem; font-weight: 700;">${enfant.tauxReussite || 0}%</p>
            </div>

            <button style="
              width: 100%;
              padding: 0.7rem;
              background: white;
              color: #667eea;
              border: none;
              border-radius: 0.4rem;
              font-weight: 700;
              cursor: pointer;
              font-size: 0.9rem;
            ">
              📊 Voir le détail
            </button>
          </div>
        `
          )
          .join("")}
      </div>

      <div style="margin-top: 2rem; padding: 1rem; background: #f0f8ff; border-radius: 0.5rem; text-align: center;">
        <button style="
          padding: 0.8rem 1.5rem;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 0.4rem;
          font-weight: 700;
          cursor: pointer;
          font-size: 0.95rem;
        ">
          ➕ Ajouter un enfant
        </button>
      </div>
    </div>
  `;
}
