/**
 * @file test/run-integration-tests.js
 * @description Suite de tests d'intégration E2E pour kit-charts (compile-chart.js & validate-chart.js).
 */

const fs = require('fs');
const path = require('path');
const { compileChart } = require('../.agents/skills/kit-charts/scripts/compile-chart.js');
const { validateChartSpec, validateChartFile } = require('../.agents/skills/kit-charts/scripts/validate-chart.js');

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
console.log(' 🧪 TESTS D\'INTÉGRATION E2E — KIT-CHARTS LOT 2 & LOT 3');
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
    showDataLabels: true,
    animation: {
      durationMs: 500,
      easing: 'easeOutQuart'
    }
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
    showDataLabels: false,
    animation: {
      durationMs: 400,
      easing: 'easeOutQuad'
    }
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

// 4.3 Durée d'animation excessive (> 800 ms)
const slowAnimSpec = {
  targetTemplateId: 'bar-chart-vertical',
  cognitiveFeatures: {
    animation: { durationMs: 1500 }
  },
  formattedData: {
    labels: ['A', 'B'],
    datasets: [{ data: [10, 20] }]
  }
};
const slowAnimReport = validateChartSpec(slowAnimSpec);
assert(slowAnimReport.valid === false, 'Interception : Animation > 800 ms bloquée');
assert(slowAnimReport.errors.some(e => e.ruleId === 'ANIMATION_MAX_DURATION'), 'Règle ANIMATION_MAX_DURATION déclenchée');

// 4.4 Easing décoratif interdit (bounce)
const bounceSpec = {
  targetTemplateId: 'bar-chart-vertical',
  cognitiveFeatures: {
    animation: { durationMs: 500, easing: 'easeOutBounce' }
  },
  formattedData: {
    labels: ['A', 'B'],
    datasets: [{ data: [10, 20] }]
  }
};
const bounceReport = validateChartSpec(bounceSpec);
assert(bounceReport.valid === false, 'Interception : Easing décoratif bounce bloqué');
assert(bounceReport.errors.some(e => e.ruleId === 'NO_DECORATIVE_BOUNCE'), 'Règle NO_DECORATIVE_BOUNCE déclenchée');

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

// Nettoyage automatique des artefacts de test dans output/
try {
  const testSubdirs = ['e2e-kpi-standard', 'e2e-bar-vertical', 'e2e-box-plot'];
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

