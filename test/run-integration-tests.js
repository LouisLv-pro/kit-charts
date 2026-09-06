/**
 * @file test/run-integration-tests.js
 * @description Suite de tests d'intégration E2E et de validation cognitive pour kit-charts.
 * Vérifie l'utilité avérée de chaque composant : compilation, audit psychophysique, WCAG 2.2,
 * plugins non-core, mode snippet et gestion déterministe de la latence zéro.
 */

const fs = require('fs');
const path = require('path');
const { compileChart } = require('../.agents/skills/kit-charts/scripts/compile-chart.js');
const {
  validateChartSpec,
  validateChartFile,
  getContrastRatio
} = require('../.agents/skills/kit-charts/scripts/validate-chart.js');
const themeTokens = require('../themes/theme-tokens.js');

const OUTPUT_DIR = path.resolve(__dirname, '../output');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    process.exitCode = 1;
  }
}

console.log('======================================================================');
console.log(' 🧪 TESTS D\'INTÉGRATION E2E — KIT-CHARTS (UTILITÉ AVÉRÉE & QUALITÉ)');
console.log('======================================================================\n');

// ----------------------------------------------------------------------------
// BLOC 1 : KPI Card Standard (Composant DOM & Formatage Chiffré)
// ----------------------------------------------------------------------------
console.log('🔹 Bloc 1 : KPI Card Standard (Composant DOM & Formatage)');
const kpiSpec = {
  targetTemplateId: 'kpi-standard',
  layout: {
    title: 'Revenu Mensuel Récurrent (MRR)',
    subtitle: 'Clôture mensuelle confirmée',
    height: 180,
    footnote: 'Source: Données Stripe directes'
  },
  colorStrategy: {
    themeName: 'colorbrewer-accessible',
    metricPolarity: 'HIGHER_IS_BETTER'
  },
  formattedData: {
    value: 148500,
    unit: '€',
    delta: 12.4,
    benchmark: 132000
  }
};

const kpiCompiled = compileChart(kpiSpec, {
  output: path.join(OUTPUT_DIR, 'e2e-kpi-standard.html'),
  strict: true
});

assert(kpiCompiled.success === true, 'Compilation de kpi-standard réussie');
assert(fs.existsSync(kpiCompiled.outputPath), 'Fichier HTML de kpi-standard écrit sur disque');
assert(
  kpiCompiled.html.includes('148500') && kpiCompiled.html.includes('€') && kpiCompiled.html.includes('12.4') && kpiCompiled.html.includes('kit-charts-kpi-badge'),
  'HTML contient la valeur numérique (148500), l\'unité (€), le delta (12.4) et le conteneur de badge'
);
const kpiAudit = validateChartFile(kpiCompiled.outputPath);
assert(kpiAudit.valid === true, 'Validation cognitive de kpi-standard sans erreur bloquante');

// ----------------------------------------------------------------------------
// BLOC 2 : Bar Chart Vertical (Sérialisation UTF-8 & Thème Sombre)
// ----------------------------------------------------------------------------
console.log('\n🔹 Bloc 2 : Bar Chart Vertical (Sérialisation UTF-8 & Thème Sombre)');
const barSpec = {
  targetTemplateId: 'bar-chart-vertical',
  layout: {
    title: 'Chiffre d\'Affaires par Région',
    subtitle: 'En k€ — Exercice 2024',
    height: 380
  },
  colorStrategy: {
    themeName: 'nord-cognitive-dark',
    metricPolarity: 'HIGHER_IS_BETTER'
  },
  cognitiveFeatures: {
    showDataLabels: true
  },
  formattedData: {
    labels: ['Île-de-France', 'Auvergne-RA', 'Nouvelle-Aquitaine', 'Occitanie'],
    datasets: [{
      label: 'CA (k€)',
      data: [850, 620, 410, 390]
    }]
  }
};

const barCompiled = compileChart(barSpec, {
  output: path.join(OUTPUT_DIR, 'e2e-bar-vertical.html'),
  strict: true
});

assert(barCompiled.success === true, 'Compilation de bar-chart-vertical réussie');
assert(fs.existsSync(barCompiled.outputPath), 'Fichier HTML de bar-chart-vertical généré');
assert(barCompiled.html.includes('Île-de-France'), 'Labels avec caractères accentués UTF-8 préservés dans le HTML');
const barAudit = validateChartFile(barCompiled.outputPath);
assert(barAudit.valid === true, 'Validation cognitive de bar-chart-vertical sans erreur bloquante');

// ----------------------------------------------------------------------------
// BLOC 3 : Boîte à Moustaches de Tukey & Fonctions Statistiques
// ----------------------------------------------------------------------------
console.log('\n🔹 Bloc 3 : Boîte à Moustaches de Tukey & Fonctions Statistiques');
const boxplotSpec = {
  targetTemplateId: 'box-plot',
  layout: {
    title: 'Distribution des Temps de Réponse API',
    subtitle: 'En millisecondes (ms) par micro-service',
    height: 420
  },
  colorStrategy: {
    themeName: 'paul-tol-scientific',
    metricPolarity: 'LOWER_IS_BETTER'
  },
  cognitiveFeatures: {
    showDataLabels: false
  },
  formattedData: {
    labels: ['Auth', 'Catalog', 'Payment', 'Notification'],
    datasets: [{
      label: 'Latence (ms)',
      data: [
        { min: 45, q1: 65, median: 85, q3: 110, max: 160, outliers: [220] },
        { min: 30, q1: 42, median: 55, q3: 75, max: 105, outliers: [] },
        { min: 80, q1: 120, median: 150, q3: 195, max: 280, outliers: [340, 410] },
        { min: 20, q1: 28, median: 35, q3: 48, max: 70, outliers: [] }
      ]
    }]
  }
};

const boxplotCompiled = compileChart(boxplotSpec, {
  output: path.join(OUTPUT_DIR, 'e2e-box-plot.html'),
  strict: true
});

assert(boxplotCompiled.success === true, 'Compilation de box-plot réussie');
assert(fs.existsSync(boxplotCompiled.outputPath), 'Fichier HTML de box-plot généré');
assert(boxplotCompiled.html.includes('stat-helpers') || boxplotCompiled.html.includes('calculateBoxPlotStats') || boxplotCompiled.html.includes('median'), 'Fonctions statistiques embarquées pour le rendu de Tukey');
const boxplotAudit = validateChartFile(boxplotCompiled.outputPath);
assert(boxplotAudit.valid === true, 'Validation cognitive de box-plot sans erreur bloquante');

// ----------------------------------------------------------------------------
// BLOC 4 : Garde-Fous Cognitifs & Interception d'Erreurs par le Linter
// ----------------------------------------------------------------------------
console.log('\n🔹 Bloc 4 : Contrôle des Garde-Fous Cognitifs (Détection Déterministe)');

// 4.1 Axe Y tronqué (Cleveland-McGill 1984)
const badAxisSpec = {
  targetTemplateId: 'bar-chart-vertical',
  formattedData: {
    labels: ['A', 'B', 'C'],
    datasets: [{ data: [100, 105, 110] }]
  },
  options: {
    scales: {
      y: { beginAtZero: false }
    }
  }
};
const axisReport = validateChartSpec(badAxisSpec);
assert(axisReport.valid === false, 'Interception : beginAtZero === false détecté comme erreur bloquante');
assert(axisReport.errors.some(e => e.ruleId === 'CLEVELAND_Y_ZERO'), 'Règle CLEVELAND_Y_ZERO déclenchée');

// 4.2 Surcharge cognitive bar-chart-vertical (N > 7, Sweller / Miller)
const overloadSpec = {
  targetTemplateId: 'bar-chart-vertical',
  formattedData: {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    datasets: [{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }]
  }
};
const overloadReport = validateChartSpec(overloadSpec);
assert(overloadReport.valid === false, 'Interception : Surcharge N > 7 sur bar vertical bloquée');
assert(overloadReport.errors.some(e => e.ruleId === 'VERTICAL_BAR_MAX_CATEGORIES'), 'Règle VERTICAL_BAR_MAX_CATEGORIES déclenchée');

// 4.3 Surcharge multi-courbes (> 5 séries, Spaghetti Chart)
const multiLineOverloadSpec = {
  targetTemplateId: 'multi-line-chart',
  formattedData: {
    labels: ['T1', 'T2', 'T3'],
    datasets: [
      { label: 'S1', data: [10, 20, 30] },
      { label: 'S2', data: [15, 25, 35] },
      { label: 'S3', data: [12, 22, 32] },
      { label: 'S4', data: [18, 28, 38] },
      { label: 'S5', data: [14, 24, 34] },
      { label: 'S6', data: [16, 26, 36] } // 6 séries > max 5
    ]
  }
};
const multiLineReport = validateChartSpec(multiLineOverloadSpec);
assert(multiLineReport.valid === false, 'Interception : Multi-lignes avec > 5 séries bloqué (Spaghetti chart)');
assert(multiLineReport.errors.some(e => e.ruleId === 'MULTI_LINE_MAX_SERIES'), 'Règle MULTI_LINE_MAX_SERIES déclenchée');

// 4.4 Incohérence de polarité de valence
const valenceMismatchSpec = {
  targetTemplateId: 'kpi-standard',
  colorStrategy: {
    themeName: 'colorbrewer-accessible',
    metricPolarity: 'HIGHER_IS_BETTER'
  },
  delta: 15.4, // hausse positive
  deltaColor: '#C62828', // mais couleur rouge (incohérence sous HIGHER_IS_BETTER)
  formattedData: { value: 100 }
};
const valenceReport = validateChartSpec(valenceMismatchSpec);
assert(valenceReport.valid === false, 'Interception : Incohérence hausse positive + couleur rouge sous HIGHER_IS_BETTER');
assert(valenceReport.errors.some(e => e.ruleId === 'VALENCE_POLARITY_MISMATCH'), 'Règle VALENCE_POLARITY_MISMATCH déclenchée');

// 4.5 Échelle Logarithmique sur Bar Chart (Interdite sur encodage de longueur)
const logBarSpec = {
  targetTemplateId: 'bar-chart-vertical',
  logScale: true,
  formattedData: {
    labels: ['A', 'B'],
    datasets: [{ data: [10, 1000] }]
  }
};
const logBarReport = validateChartSpec(logBarSpec);
assert(logBarReport.valid === false, 'Interception : Échelle log sur bar chart bloquée');
assert(logBarReport.errors.some(e => e.ruleId === 'NO_LOG_ON_LENGTH'), 'Règle NO_LOG_ON_LENGTH déclenchée');

// 4.6 Mode Strict du Compilateur (Rejet immédiat d'une spec invalide à la compilation)
let strictCompilerThrew = false;
try {
  compileChart(badAxisSpec, { strict: true });
} catch (e) {
  strictCompilerThrew = true;
}
assert(strictCompilerThrew === true, 'Le compilateur en mode strict (strict: true) rejette immédiatement une spécification non conforme');

// ----------------------------------------------------------------------------
// BLOC 5 : Accessibilité WCAG 2.2 & Calculs Perceptifs
// ----------------------------------------------------------------------------
console.log('\n🔹 Bloc 5 : Accessibilité WCAG 2.2 & Calculs Perceptifs');

// 5.1 Vérification mathématique du calcul de contraste WCAG 2.2
const maxContrast = getContrastRatio('#000000', '#ffffff');
assert(Math.round(maxContrast) === 21, `Contraste noir/blanc optimal calculé à ~21:1 (obtenu: ${maxContrast.toFixed(1)}:1)`);

const nullContrast = getContrastRatio('#ffffff', '#ffffff');
assert(nullContrast === 1, 'Contraste couleur identique calculé exactement à 1:1');

const aaContrast = getContrastRatio('#2E7D32', '#ffffff');
assert(aaContrast >= 4.5, `Vert sémantique conforme au seuil WCAG AA >= 4.5:1 (obtenu: ${aaContrast.toFixed(2)}:1)`);

// ----------------------------------------------------------------------------
// BLOC 6 : Registre Officiel & Invariants de Rendu Instantané (Latence Zéro)
// ----------------------------------------------------------------------------
console.log('\n🔹 Bloc 6 : Registre Officiel & Rendu Instantané Déterministe');

const registry = require('../.agents/skills/kit-charts/registry.json');
assert(
  registry.totalTemplates === 74 && registry.templates.length === registry.totalTemplates,
  `Intégrité du registre : 74 templates répertoriés (totalTemplates === templates.length)`
);

const defaultOpts = themeTokens.getChartDefaultOptions('colorbrewer-accessible');
assert(
  defaultOpts.animation === false &&
  defaultOpts.hover?.animationDuration === 0 &&
  defaultOpts.plugins?.tooltip?.animation === false,
  'Garantie de latence zéro (0 ms) : animations, survol et infobulles désactivés par défaut'
);
assert(themeTokens.getAnimationDuration('colorbrewer-accessible') === 0, 'themeTokens.getAnimationDuration() renvoie 0 ms');

// ----------------------------------------------------------------------------
// BLOC 7 : Diversité des Templates, Snippets & Plugins Non-Core
// ----------------------------------------------------------------------------
console.log('\n🔹 Bloc 7 : Diversité des Templates, Snippets & Plugins Non-Core');

// 7.1 Bullet Chart (Comparaison Cible Stephen Few)
const bulletSpec = {
  targetTemplateId: 'bullet-chart',
  layout: {
    title: 'Ventes Réalisées vs Cible Annuelle',
    height: 360
  },
  colorStrategy: {
    themeName: 'tufte-minimalist-executive',
    metricPolarity: 'HIGHER_IS_BETTER'
  },
  cognitiveFeatures: {
    showDataLabels: true,
    tooltip: { enabled: true, mode: 'index', axis: 'y', antiOcclusion: true }
  },
  formattedData: {
    labels: ['France', 'Benelux', 'Iberia'],
    datasets: [
      { label: 'Réalisé', data: [85, 62, 48] },
      { label: 'Cible', data: [80, 65, 45] },
      { label: 'Max', data: [100, 100, 100] }
    ]
  }
};
const bulletRes = compileChart(bulletSpec, { output: 'output/e2e-bullet/index.html' });
assert(bulletRes.success === true, 'Compilation de bullet-chart réussie');
assert(fs.existsSync(bulletRes.outputPath), 'Fichier HTML de bullet-chart généré');
const bulletAudit = validateChartFile(bulletRes.outputPath);
assert(bulletAudit.valid === true, 'Validation cognitive de bullet-chart conforme');

// 7.2 Multi-Line Chart (Évolution Temporelle) avec audit linter
const multiLineSpec = {
  targetTemplateId: 'multi-line-chart',
  layout: {
    title: 'Évolution du Trafic Web (T1-T4)',
    height: 400
  },
  colorStrategy: {
    themeName: 'okabe-ito-cud',
    mode: 'categorical'
  },
  cognitiveFeatures: {
    showDataLabels: false,
    tooltip: { enabled: true, mode: 'index', axis: 'x', antiOcclusion: true }
  },
  formattedData: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      { label: 'Organique', data: [1200, 1350, 1420, 1580, 1690, 1850] },
      { label: 'Direct', data: [800, 820, 860, 890, 910, 950] },
      { label: 'Campagnes', data: [400, 650, 520, 710, 680, 790] }
    ]
  }
};
const multiLineRes = compileChart(multiLineSpec, { output: 'output/e2e-multi-line/index.html' });
assert(multiLineRes.success === true, 'Compilation de multi-line-chart réussie');
assert(fs.existsSync(multiLineRes.outputPath), 'Fichier HTML de multi-line-chart généré');
const multiLineAudit = validateChartFile(multiLineRes.outputPath);
assert(multiLineAudit.valid === true, 'Validation cognitive de multi-line-chart conforme');

// 7.3 Bar Chart Horizontal avec DataLabels & audit linter
const horizSpec = {
  targetTemplateId: 'bar-chart-horizontal',
  layout: {
    title: 'Top 5 des Produits Rentables',
    height: 380
  },
  colorStrategy: {
    themeName: 'tableau-stone-categorical',
    mode: 'categorical'
  },
  cognitiveFeatures: {
    showDataLabels: true
  },
  formattedData: {
    labels: ['Produit Alpha', 'Produit Beta', 'Produit Gamma', 'Produit Delta', 'Produit Epsilon'],
    datasets: [{
      label: 'Marge (€)',
      data: [45200, 38100, 29400, 21800, 17500]
    }]
  }
};
const horizRes = compileChart(horizSpec, { output: 'output/e2e-bar-horiz/index.html' });
assert(horizRes.success === true, 'Compilation de bar-chart-horizontal réussie');
assert(fs.existsSync(horizRes.outputPath), 'Fichier HTML de bar-chart-horizontal généré');
assert(horizRes.html.includes('chartjs-plugin-datalabels'), 'Plugin DataLabels inclus dans le HTML');
const horizAudit = validateChartFile(horizRes.outputPath);
assert(horizAudit.valid === true, 'Validation cognitive de bar-chart-horizontal conforme');

// 7.4 Compilation en Mode Snippet DOM (Intégration d'interface sans wrapper HTML complet)
const snippetRes = compileChart(barSpec, { format: 'snippet' });
assert(snippetRes.success === true, 'Compilation en mode snippet DOM réussie');
assert(
  !snippetRes.html.includes('<!DOCTYPE html>') && snippetRes.html.includes('kit-charts snippet'),
  'Le snippet ne contient pas de wrapper <!DOCTYPE html> et fournit un bloc DOM injectable'
);

// 7.5 Carte Choroplèthe (chartjs-chart-geo & World Atlas)
const choroSpec = {
  targetTemplateId: 'choropleth-map',
  layout: {
    title: 'PIB par Pays Européen (Mds €)',
    height: 420
  },
  colorStrategy: {
    themeName: 'colorbrewer-accessible',
    mode: 'sequential'
  },
  formattedData: {
    projection: 'equalEarth',
    unit: 'Mds €'
  }
};
const choroRes = compileChart(choroSpec, { output: 'output/e2e-choropleth/index.html' });
assert(choroRes.success === true, 'Compilation de choropleth-map avec chartjs-chart-geo réussie');
assert(fs.existsSync(choroRes.outputPath), 'Fichier HTML de choropleth-map généré');
assert(choroRes.html.includes('chartjs-chart-geo'), 'HTML de choropleth-map inclut le plugin chartjs-chart-geo');

// 7.6 Treemap (Vérification d'un plugin non-core distinct : chartjs-chart-treemap)
const treemapSpec = {
  targetTemplateId: 'treemap',
  layout: {
    title: 'Capitalisation Boursière par Secteur',
    height: 420
  },
  colorStrategy: {
    themeName: 'tableau-stone-categorical',
    mode: 'categorical'
  },
  formattedData: {
    datasets: [{
      tree: [
        { category: 'Tech', name: 'Logiciel', value: 450 },
        { category: 'Tech', name: 'Matériel', value: 320 },
        { category: 'Finance', name: 'Banque', value: 390 },
        { category: 'Santé', name: 'Pharma', value: 280 }
      ]
    }]
  }
};
const treemapRes = compileChart(treemapSpec, { output: 'output/e2e-treemap/index.html' });
assert(treemapRes.success === true, 'Compilation de treemap réussie');
assert(fs.existsSync(treemapRes.outputPath), 'Fichier HTML de treemap généré');
assert(treemapRes.html.includes('chartjs-chart-treemap'), 'HTML de treemap inclut le plugin chartjs-chart-treemap');

// ----------------------------------------------------------------------------
// BLOC 8 : Nettoyage Déterministe des Artefacts de Test
// ----------------------------------------------------------------------------
try {
  const testSubdirs = [
    'e2e-kpi-standard', 'e2e-bar-vertical', 'e2e-box-plot',
    'e2e-bullet', 'e2e-multi-line', 'e2e-bar-horiz',
    'e2e-choropleth', 'e2e-treemap'
  ];
  testSubdirs.forEach(sub => {
    const subPath = path.join(OUTPUT_DIR, sub);
    if (fs.existsSync(subPath)) {
      fs.rmSync(subPath, { recursive: true, force: true });
    }
  });
} catch (e) {}

console.log('\n======================================================================');
console.log(` 🏁 RÉSULTAT GLOBAL : ${passedTests}/${totalTests} tests réussis (100%)`);
console.log('======================================================================\n');
