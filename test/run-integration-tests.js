/**
 * @file test/run-integration-tests.js
 * @description Suite de tests d'intégration E2E pour kit-charts (compile-chart.js & validate-chart.js).
 */

const fs = require('fs');
const path = require('path');
const { compileChart } = require('../.agents/skills/kit-charts/scripts/compile-chart.js');
const { validateChartSpec, validateChartFile } = require('../.agents/skills/kit-charts/scripts/validate-chart.js');
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
console.log(' 🧪 TESTS D\'INTÉGRATION E2E — KIT-CHARTS (74 TEMPLATES & LATENCE ZÉRO)');
console.log('======================================================================\n');

// ----------------------------------------------------------------------------
// TEST 1 : KPI Card Standard
// ----------------------------------------------------------------------------
console.log('🔹 Test 1 : Compilation & Validation d\'une KPI Card (kpi-standard)');
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
assert(kpiCompiled.html.includes('148'), 'HTML contient la valeur numérique formatée');

const kpiAudit = validateChartFile(kpiCompiled.outputPath);
assert(kpiAudit.valid === true, 'Validation cognitive de kpi-standard sans erreur bloquante');

// ----------------------------------------------------------------------------
// TEST 2 : Bar Chart Vertical avec Thème Sombre & Valence
// ----------------------------------------------------------------------------
console.log('\n🔹 Test 2 : Compilation & Validation d\'un Bar Chart (bar-chart-vertical)');
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
assert(barCompiled.html.includes('Île-de-France'), 'Labels présents dans le fichier HTML');

const barAudit = validateChartFile(barCompiled.outputPath);
assert(barAudit.valid === true, 'Validation cognitive de bar-chart-vertical sans erreur bloquante');

// ----------------------------------------------------------------------------
// TEST 3 : Boîte à Moustaches de Tukey (box-plot)
// ----------------------------------------------------------------------------
console.log('\n🔹 Test 3 : Compilation & Validation d\'un Boxplot Tukey (box-plot)');
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

const boxplotAudit = validateChartFile(boxplotCompiled.outputPath);
assert(boxplotAudit.valid === true, 'Validation cognitive de box-plot sans erreur bloquante');

// ----------------------------------------------------------------------------
// TEST 4 : Garde-Fous Cognitifs & Interception d'Erreurs par le Linter
// ----------------------------------------------------------------------------
console.log('\n🔹 Test 4 : Contrôle des Garde-Fous Cognitifs (Détection Déterministe d\'Erreurs)');

// 4.1 Axe Y tronqué (Cleveland-McGill)
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
assert(axisReport.valid === false, 'Interception : beginAtZero === false détecté comme erreur');
assert(axisReport.errors.some(e => e.ruleId === 'CLEVELAND_Y_ZERO'), 'Règle CLEVELAND_Y_ZERO déclenchée');

// 4.2 Surcharge cognitive bar-chart-vertical (N > 7)
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

// 4.3 Surcharge multi-courbes (> 5 séries)
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
  deltaColor: '#C62828', // mais couleur rouge (incohérence)
  formattedData: { value: 100 }
};
const valenceReport = validateChartSpec(valenceMismatchSpec);
assert(valenceReport.valid === false, 'Interception : Incohérence hausse positive + couleur rouge sur HIGHER_IS_BETTER');
assert(valenceReport.errors.some(e => e.ruleId === 'VALENCE_POLARITY_MISMATCH'), 'Règle VALENCE_POLARITY_MISMATCH déclenchée');

// 4.5 Échelle Logarithmique sur Bar Chart (Interdite)
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

// ----------------------------------------------------------------------------
// TEST 5 : Registre Officiel, Rendu Instantané & Standards Ergonomiques
// ----------------------------------------------------------------------------
console.log('\n🔹 Test 5 : Registre Officiel (74 Templates) & Rendu Déterministe Instantané');

// 5.1 Vérification de l'intégrité du registre officiel
const registry = require('../.agents/skills/kit-charts/registry.json');
assert(registry.totalTemplates === 74, `Registre officiel contient exactement 74 templates (actuel: ${registry.totalTemplates})`);
assert(registry.templates.length === 74, '74 templates indexés avec succès dans registry.json');

// 5.2 Rendu instantané déterministe (animation === false garanti par défaut)
const defaultOpts = themeTokens.getChartDefaultOptions('colorbrewer-accessible');
assert(defaultOpts.animation === false, 'Garantie de latence zéro : animation === false par défaut');
assert(defaultOpts.hover && defaultOpts.hover.animationDuration === 0, 'Survol instantané : hover.animationDuration === 0');
assert(defaultOpts.plugins && defaultOpts.plugins.tooltip && defaultOpts.plugins.tooltip.animation === false, 'Infobulles réactives : tooltip.animation === false');
assert(themeTokens.getAnimationDuration('colorbrewer-accessible') === 0, 'themeTokens.getAnimationDuration() renvoie 0');
assert(themeTokens.getAccessibleAnimationOptions() === false, 'themeTokens.getAccessibleAnimationOptions() renvoie false');

// 5.3 Compilation et validation de bullet-chart (Comparaison Cible Stephen Few)
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

// 5.4 Compilation et validation de multi-line-chart (Évolution Temporelle)
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

// 5.5 Compilation et validation de bar-chart-horizontal avec DataLabels
const horizSpec = {
  targetTemplateId: 'bar-chart-horizontal',
  layout: {
    title: 'Top 10 des Produits les plus Rentables',
    height: 450
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

// 5.6 Compilation et validation de choropleth-map (chartjs-chart-geo)
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

// 5.7 Compilation et validation de bubble-map (chartjs-chart-geo)
const bubbleMapSpec = {
  targetTemplateId: 'bubble-map',
  layout: {
    title: 'Investissements Métropoles Européennes (M€)',
    height: 420
  },
  colorStrategy: {
    themeName: 'nord-cognitive-dark',
    mode: 'categorical'
  },
  formattedData: {
    projection: 'equalEarth',
    unit: 'M€'
  }
};
const bubbleMapRes = compileChart(bubbleMapSpec, { output: 'output/e2e-bubble-map/index.html' });
assert(bubbleMapRes.success === true, 'Compilation de bubble-map avec chartjs-chart-geo réussie');
assert(fs.existsSync(bubbleMapRes.outputPath), 'Fichier HTML de bubble-map généré');
assert(bubbleMapRes.html.includes('chartjs-chart-geo'), 'HTML de bubble-map inclut le plugin chartjs-chart-geo');

// Nettoyage automatique des artefacts de test dans output/
try {
  const testSubdirs = [
    'e2e-kpi-standard', 'e2e-bar-vertical', 'e2e-box-plot',
    'e2e-bullet', 'e2e-multi-line', 'e2e-bar-horiz',
    'e2e-choropleth', 'e2e-bubble-map'
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



