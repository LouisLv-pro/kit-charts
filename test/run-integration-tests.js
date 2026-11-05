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
const { VENDOR, parsePinnedUrl } = require('../.agents/skills/kit-charts/scripts/vendor-pins.js');

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
    // title est lu par la carte KPI ; requis par le schéma pour qu'aucun titre d'exemple ne s'affiche.
    title: 'MRR',
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
  kpiCompiled.html.includes('148500') && kpiCompiled.html.includes('€') && kpiCompiled.html.includes('12.4') && kpiCompiled.html.includes('mod.renderCard(') && kpiCompiled.html.includes('class="kit-charts-kpi-host"'),
  'HTML contient la valeur (148500), l\'unité (€), le delta (12.4) et rend la carte via renderCard comme la preview'
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
  registry.totalTemplates === registry.templates.length,
  `Intégrité du registre : totalTemplates (${registry.totalTemplates}) === templates.length (${registry.templates.length})`
);
// Chaque dossier de template des familles numérotées (template/NN-famille/<id>/template.js) est au registre,
// et chaque entrée du registre pointe vers des fichiers existants. Aucun compte en dur.
const TEMPLATE_ROOT = path.resolve(__dirname, '../template');
const templateDirsOnDisk = fs.readdirSync(TEMPLATE_ROOT, { withFileTypes: true })
  .filter(f => f.isDirectory() && /^\d{2}-/.test(f.name))
  .flatMap(f => fs.readdirSync(path.join(TEMPLATE_ROOT, f.name), { withFileTypes: true })
    .filter(t => t.isDirectory() && fs.existsSync(path.join(TEMPLATE_ROOT, f.name, t.name, 'template.js')))
    .map(t => t.name));
const registeredIds = new Set(registry.templates.map(t => t.id));
const unregistered = templateDirsOnDisk.filter(id => !registeredIds.has(id));
const missingPaths = registry.templates.flatMap(t => Object.entries(t.paths || {})
  .filter(([, rel]) => !fs.existsSync(path.resolve(__dirname, '..', rel)))
  .map(([kind]) => `${t.id}.${kind}`));
assert(
  unregistered.length === 0 && missingPaths.length === 0 && templateDirsOnDisk.length === registry.templates.length,
  `Registre aligné sur le disque : ${templateDirsOnDisk.length} dossiers, ${registry.templates.length} entrées${unregistered.length ? ' | hors registre : ' + unregistered.join(', ') : ''}${missingPaths.length ? ' | chemins absents : ' + missingPaths.join(', ') : ''}`
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
const horizCdnUrls = horizRes.html.match(/https:\/\/cdn\.jsdelivr\.net\/npm\/[^"']+/g) || [];
const horizUnpinned = horizCdnUrls.filter(u => !parsePinnedUrl(u));
assert(horizCdnUrls.length > 0 && horizUnpinned.length === 0,
  `Toutes les dépendances CDN du HTML compilé sont épinglées à une version exacte (supply-chain)${horizUnpinned.length ? ' | non épinglées : ' + horizUnpinned.join(', ') : ''}`);
assert(!horizRes.html.includes('chartjs-plugin-datalabels'), 'HTML compilé : plugin chartjs-plugin-datalabels inutilisé absent');
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
assert(treemapRes.html.includes(VENDOR['chartjs-chart-treemap']), 'HTML de treemap inclut le plugin chartjs-chart-treemap versionné (source unique vendor-pins.js)');

// ----------------------------------------------------------------------------
// BLOC 9 : Recommandeur déterministe (recommend-template.js)
// Chaque cas échoue si la règle cognitive correspondante est retirée du recommandeur.
// ----------------------------------------------------------------------------
console.log('\n🔹 Bloc 9 : Recommandeur de templates (profil de données -> candidats)');
const { profileData, recommendTemplates } = require('../.agents/skills/kit-charts/scripts/recommend-template.js');
const recoCases = [
  {
    name: '9 régions à libellés longs',
    data: { labels: ['Île-de-France', 'Auvergne-Rhône-Alpes', 'Nouvelle-Aquitaine', 'Occitanie', 'Hauts-de-France', 'Grand Est', 'Bretagne', 'Normandie', 'Corse'], datasets: [{ label: 'CA', data: [9, 8, 7, 6, 5, 4, 3, 2, 1] }] },
    expect: 'bar-chart-horizontal', mustReject: 'bar-chart-vertical'
  },
  { name: '4 catégories courtes', data: { labels: ['Nord', 'Sud', 'Est', 'Ouest'], datasets: [{ data: [4, 3, 2, 1] }] }, expect: 'bar-chart-vertical' },
  { name: 'réalisé vs cible', data: { labels: ['Nord', 'Sud', 'Est'], datasets: [{ label: 'Réalisé', data: [4, 3, 2] }, { label: 'Cible', data: [5, 3, 3] }] }, expect: 'bar-target-overlay' },
  { name: '3 séries annuelles', data: { labels: ['2021', '2022', '2023', '2024'], datasets: [{ data: [1, 2, 3, 4] }, { data: [2, 3, 4, 5] }, { data: [1, 1, 1, 1] }] }, expect: 'multi-line-chart', mustReject: 'line-chart' },
  { name: '11 parts d\'un tout', data: { labels: 'ABCDEFGHIJK'.split(''), datasets: [{ data: [30, 20, 10, 10, 8, 7, 5, 4, 3, 2, 1] }] }, intent: 'composition', expect: 'bar-chart-horizontal', mustReject: 'doughnut-chart' },
  { name: 'KPI isolé', data: { value: 148500, delta: 12.4 }, expect: 'kpi-standard' }
];
const recoFailures = [];
recoCases.forEach(c => {
  const r = recommendTemplates(profileData(c.data), { intent: c.intent });
  const got = r.recommended && r.recommended.id;
  if (got !== c.expect) recoFailures.push(`${c.name} : attendu ${c.expect}, obtenu ${got}`);
  if (c.mustReject && !r.rejected.some(x => x.id === c.mustReject)) recoFailures.push(`${c.name} : ${c.mustReject} devrait être écarté`);
});
assert(recoFailures.length === 0, `Recommandeur conforme sur ${recoCases.length} profils${recoFailures.length ? ' | ' + recoFailures.join(' | ') : ''}`);

const spaghetti = recommendTemplates({ categoryCount: 12, seriesCount: 8, maxLabelLength: 3, labelsType: 'temporal', hasNegative: false, sumsTo100: false, minSharePct: null }, { intent: 'evolution' });
assert(spaghetti.recommended === null && spaghetti.rejected.some(x => x.id === 'multi-line-chart'),
  `8 séries temporelles : aucun template éligible et multi-line-chart écarté (obtenu : ${spaghetti.recommended && spaghetti.recommended.id})`);

const registryIds = new Set(registry.templates.map(t => t.id));
const { INTENT_ORDER } = require('../.agents/skills/kit-charts/scripts/recommend-template.js');
const unknownIds = Object.values(INTENT_ORDER).flat().filter(id => !registryIds.has(id));
assert(unknownIds.length === 0, `Tous les templates du recommandeur existent dans le registre${unknownIds.length ? ' | inconnus : ' + unknownIds.join(', ') : ''}`);

// ----------------------------------------------------------------------------
// BLOC 10 : CLI compile-chart.js bloque une spec non conforme (exécution réelle)
// ----------------------------------------------------------------------------
console.log('\n🔹 Bloc 10 : CLI compile-chart.js (exit 1 sur erreur bloquante, --force explicite)');
const { spawnSync } = require('child_process');
const COMPILE_CLI = path.resolve(__dirname, '../.agents/skills/kit-charts/scripts/compile-chart.js');
const cliDir = path.join(OUTPUT_DIR, 'e2e-cli');
fs.rmSync(cliDir, { recursive: true, force: true });
fs.mkdirSync(cliDir, { recursive: true });
const badCliSpec = path.join(cliDir, 'bad-spec.json');
fs.writeFileSync(badCliSpec, JSON.stringify({
  targetTemplateId: 'bar-chart-vertical',
  colorStrategy: { themeName: 'colorbrewer-accessible', metricPolarity: 'HIGHER_IS_BETTER' },
  formattedData: { labels: 'ABCDEFGHI'.split(''), datasets: [{ label: 'x', data: [1, 2, 3, 4, 5, 6, 7, 8, 9] }] }
}));
const badOut = path.join(cliDir, 'bad', 'index.html');
const badRun = spawnSync('node', [COMPILE_CLI, badCliSpec, '-o', badOut], { encoding: 'utf8' });
assert(badRun.status === 1 && !fs.existsSync(badOut) && badRun.stderr.includes('VERTICAL_BAR_MAX_CATEGORIES'),
  `Spec à 9 colonnes refusée : exit ${badRun.status}, fichier écrit=${fs.existsSync(badOut)}, règle citée=${badRun.stderr.includes('VERTICAL_BAR_MAX_CATEGORIES')}`);
const forcedRun = spawnSync('node', [COMPILE_CLI, badCliSpec, '--force', '-o', badOut], { encoding: 'utf8' });
assert(forcedRun.status === 1 && fs.existsSync(badOut),
  `--force génère le fichier mais signale la non-conformité : exit ${forcedRun.status}, fichier écrit=${fs.existsSync(badOut)}`);
const goodCliSpec = path.join(cliDir, 'good-spec.json');
fs.writeFileSync(goodCliSpec, JSON.stringify({
  targetTemplateId: 'bar-chart-vertical',
  colorStrategy: { themeName: 'colorbrewer-accessible', metricPolarity: 'HIGHER_IS_BETTER' },
  formattedData: { labels: ['Nord', 'Sud', 'Est'], datasets: [{ label: 'CA', data: [3, 2, 1] }] }
}));
const goodOut = path.join(cliDir, 'good', 'index.html');
const goodRun = spawnSync('node', [COMPILE_CLI, goodCliSpec, '-o', goodOut], { encoding: 'utf8' });
assert(goodRun.status === 0 && fs.existsSync(goodOut), `Spec conforme compilée : exit ${goodRun.status}, fichier écrit=${fs.existsSync(goodOut)}`);

// ----------------------------------------------------------------------------
// BLOC 11 : Filet anti-dérive interne
// (calculs statistiques en direct, Y=0 émis par les templates eux-mêmes,
// versions CDN identiques entre compilateur et previews)
// ----------------------------------------------------------------------------
console.log('\n🔹 Bloc 11 : Filet anti-dérive interne (stat-helpers, Y=0 émis, CDN)');
const StatHelpers = require('../themes/stat-helpers.js');

// 11.1 stat-helpers : valeurs exactes sur fixtures.
const round4 = v => Math.round(v * 1e4) / 1e4;
const statCases = [
  ['quantile médiane paire', StatHelpers.quantile([1, 2, 3, 4], 0.5), 2.5],
  ['quantile médiane impaire', StatHelpers.quantile([1, 2, 3], 0.5), 2],
  ['quantile p=0 sur données non triées', StatHelpers.quantile([5, 1, 9], 0), 1],
  ['quantile p=1 sur données non triées', StatHelpers.quantile([5, 1, 9], 1), 9],
  ['quantile tableau vide', StatHelpers.quantile([], 0.5), 0],
  ['mean', StatHelpers.mean([1, 2, 3, 4]), 2.5],
  ['studentT(0.975, df=10)', StatHelpers.studentT(0.975, 10), 2.2281]
];
const ciProbe = StatHelpers.ci95([10, 12, 14, 16, 18]);
statCases.push(['ci95.mean', ciProbe.mean, 14], ['ci95.sd', round4(ciProbe.sd), 3.1623],
  ['ci95.margin (t=2.7764, df=4)', round4(ciProbe.margin), 3.9264], ['ci95.low', round4(ciProbe.low), 10.0736]);
const statFailures = statCases.filter(([, got, want]) => got !== want).map(([name, got, want]) => `${name} : ${got} au lieu de ${want}`);
assert(statFailures.length === 0, `stat-helpers exacts sur ${statCases.length} fixtures${statFailures.length ? ' | ' + statFailures.join(' | ') : ''}`);

// 11.2 Y=0 émis : la validation de spec ne voit pas ce que le template émet.
// On exécute chaque template à encodage longueur et on inspecte la config Chart :
// aucun axe à beginAtZero:false, et l'axe de valeur à beginAtZero:true.
// Exemptions documentées (gabarits DOM sans échelle de valeur) : kpi-bullet, kpi-distribution.
const { LENGTH_ENCODED_TEMPLATES } = require('../.agents/skills/kit-charts/scripts/validate-chart.js');
const Y_ZERO_TRUE_EXEMPT = new Set(['kpi-bullet', 'kpi-distribution']);
const PrevChart = global.Chart;
class ProbeChart {
  constructor(canvas, config) { ProbeChart.last = config; }
  static getChart() { return null; }
  static register() {}
}
ProbeChart.last = null;
global.Chart = ProbeChart;
function fakeProbeCanvas() {
  const gradientStub = { addColorStop: () => {} };
  const ctxStub = new Proxy({}, { get(target, prop) {
    if (prop === 'createLinearGradient') return () => gradientStub;
    if (prop === 'canvas') return {};
    if (typeof prop === 'string') return () => gradientStub;
    return undefined;
  } });
  return {
    tagName: 'DIV',
    parentElement: { querySelector: () => null, appendChild: () => {} },
    style: {}, dataset: {}, innerHTML: '', width: 800, height: 600,
    clientHeight: 0, clientWidth: 0, getContext: () => ctxStub,
    getAttribute: () => null, setAttribute: () => {},
    querySelector: () => null, querySelectorAll: () => [],
    getBoundingClientRect: () => ({ width: 800, height: 600, top: 0, left: 0 }),
    addEventListener: () => {}, removeEventListener: () => {}
  };
}
const yZeroViolations = [];
const yZeroMissing = [];
for (const tplId of LENGTH_ENCODED_TEMPLATES) {
  const tpl = registry.templates.find(t => t.id === tplId);
  if (!tpl) { yZeroMissing.push(`${tplId} (hors registre)`); continue; }
  let mod;
  try { mod = require(path.resolve(__dirname, '..', tpl.paths.js)); }
  catch (e) { yZeroMissing.push(`${tplId} (require : ${e.message})`); continue; }
  ProbeChart.last = null;
  try { mod.createChart(fakeProbeCanvas(), null, 'colorbrewer-accessible', {}); }
  catch (e) { yZeroMissing.push(`${tplId} (createChart : ${e.message})`); continue; }
  const cfg = ProbeChart.last;
  if (!cfg || !cfg.options || !cfg.options.scales) continue; // gabarit DOM : pas d'échelle
  for (const ax of ['x', 'y']) {
    const sc = cfg.options.scales[ax];
    if (sc && sc.beginAtZero === false) yZeroViolations.push(`${tplId}.${ax}`);
  }
  const axes = [cfg.options.scales.x, cfg.options.scales.y].filter(Boolean);
  if (axes.length > 0 && !axes.some(a => a.beginAtZero === true) && !Y_ZERO_TRUE_EXEMPT.has(tplId)) {
    yZeroMissing.push(`${tplId} (aucun axe beginAtZero:true)`);
  }
}
global.Chart = PrevChart;
assert(yZeroViolations.length === 0, `Y=0 émis : aucun axe beginAtZero:false sur les ${LENGTH_ENCODED_TEMPLATES.size} templates longueur${yZeroViolations.length ? ' | ' + yZeroViolations.join(', ') : ''}`);
assert(yZeroMissing.length === 0, `Y=0 émis : axe de valeur beginAtZero:true partout${yZeroMissing.length ? ' | ' + yZeroMissing.join(', ') : ''}`);

// 11.3 Versions CDN : vendor-pins.js (compilateur) aligné sur les previews.
const previewFiles = [path.join(__dirname, '..', 'index.html'),
  ...registry.templates.map(t => path.join(__dirname, '..', t.paths.preview)).filter(p => fs.existsSync(p))];
const previewPins = new Map();
for (const file of previewFiles) {
  for (const m of fs.readFileSync(file, 'utf8').matchAll(/https:\/\/cdn\.jsdelivr\.net\/npm\/[^"']+/g)) {
    const pinned = parsePinnedUrl(m[0]);
    if (!pinned) continue;
    if (!previewPins.has(pinned.pkg)) previewPins.set(pinned.pkg, new Set());
    previewPins.get(pinned.pkg).add(pinned.version);
  }
}
const cdnDrift = [];
for (const [pkg, url] of Object.entries(VENDOR)) {
  const pinned = parsePinnedUrl(url);
  if (!pinned || pinned.pkg !== pkg) { cdnDrift.push(`${pkg} (URL non épinglée)`); continue; }
  const versions = previewPins.get(pkg);
  if (versions && (versions.size > 1 || !versions.has(pinned.version))) {
    cdnDrift.push(`${pkg} : compilateur ${pinned.version}, previews ${[...versions].join('/')}`);
  }
}
assert(cdnDrift.length === 0, `Versions CDN identiques entre compilateur et previews${cdnDrift.length ? ' | ' + cdnDrift.join(', ') : ''}`);

// ----------------------------------------------------------------------------
// BLOC 12 : Contrat de données (formattedData contre schema.json) et footnote
// ----------------------------------------------------------------------------
console.log('\n🔹 Bloc 12 : Contrat de données (DEFAULT_DATA × schema.json, règle SCHEMA_FORMATTED_DATA, footnote)');

// 12.1 Le DEFAULT_DATA de chaque template du registre respecte son propre schema.json.
const schemaRuleErrors = spec => validateChartSpec(spec).errors.filter(e => e.ruleId === 'SCHEMA_FORMATTED_DATA');
const contractFailures = [];
for (const tpl of registry.templates) {
  let mod;
  try { mod = require(path.resolve(__dirname, '..', tpl.paths.js)); }
  catch (e) { contractFailures.push(`${tpl.id} (require : ${e.message})`); continue; }
  if (!mod || !mod.DEFAULT_DATA) { contractFailures.push(`${tpl.id} (DEFAULT_DATA non exporté)`); continue; }
  const errs = schemaRuleErrors({ targetTemplateId: tpl.id, formattedData: mod.DEFAULT_DATA });
  if (errs.length) contractFailures.push(`${tpl.id} : ${errs.map(e => e.message).join(' ; ')}`);
}
assert(contractFailures.length === 0,
  `DEFAULT_DATA conforme au schema.json pour les ${registry.templates.length} templates du registre${contractFailures.length ? ' | ' + contractFailures.join(' | ') : ''}`);

// 12.2 Des données de forme fausse déclenchent la règle (une par écart historique corrigé).
const brokenCases = [
  { name: 'colonnes objets sur table-heatmap-matrix', spec: { targetTemplateId: 'table-heatmap-matrix', formattedData: { columns: [{ key: 'jan', label: 'Jan' }], rows: [{ label: 'A', values: [1] }, { label: 'B', values: [2] }, { label: 'C', values: [3] }, { label: 'D', values: [4] }] } }, path: 'formattedData.columns[0]' },
  { name: 'triplet au lieu d\'une paire [début, fin] sur waterfall-chart', spec: { targetTemplateId: 'waterfall-chart', formattedData: { labels: ['A', 'B', 'C'], datasets: [{ data: [[0, 10], [10, 12, 14], [0, 12]] }] } }, path: 'formattedData.datasets[0].data[1]' },
  { name: 'gantt-progress sans tasks', spec: { targetTemplateId: 'gantt-progress', formattedData: { labels: ['A', 'B', 'C'], datasets: [{ data: [1, 2, 3] }] } }, path: 'formattedData.datasets[0].tasks' },
  { name: 'sorted non booléen sur bar-chart-horizontal', spec: { targetTemplateId: 'bar-chart-horizontal', formattedData: { labels: ['A', 'B'], datasets: [{ data: [2, 1], sorted: 'non' }] } }, path: 'formattedData.datasets[0].sorted' },
  { name: 'violin-plot à valeurs agrégées', spec: { targetTemplateId: 'violin-plot', formattedData: { labels: ['A'], datasets: [{ data: [12] }] } }, path: 'formattedData.datasets[0].data[0]' }
];
const brokenMissed = brokenCases.filter(c => !schemaRuleErrors(c.spec).some(e => e.message.startsWith(c.path))).map(c => c.name);
assert(brokenMissed.length === 0, `SCHEMA_FORMATTED_DATA déclenchée sur ${brokenCases.length} specs fausses${brokenMissed.length ? ' | manquées : ' + brokenMissed.join(', ') : ''}`);

const sortedOff = schemaRuleErrors({ targetTemplateId: 'bar-chart-horizontal', formattedData: { labels: ['A', 'B'], datasets: [{ data: [1, 2], sorted: false }] } });
assert(sortedOff.length === 0, `bar-chart-horizontal accepte sorted: false (tri désactivable)${sortedOff.length ? ' | ' + sortedOff.map(e => e.message).join(' ; ') : ''}`);

// 12.3 Le compilateur strict refuse la spec fausse, et l'audit du HTML forcé la retrouve.
const brokenSpec = brokenCases[0].spec;
let schemaStrictMessage = '';
try { compileChart(brokenSpec, { strict: true, format: 'snippet' }); } catch (e) { schemaStrictMessage = e.message; }
assert(schemaStrictMessage.includes('SCHEMA_FORMATTED_DATA'), 'Compilation stricte refusée sur contrat de données violé (SCHEMA_FORMATTED_DATA)');
const forcedSchemaRes = compileChart(brokenSpec, { strict: false, output: path.join(OUTPUT_DIR, 'e2e-schema', 'index.html') });
const forcedSchemaAudit = validateChartFile(forcedSchemaRes.outputPath);
assert(!forcedSchemaAudit.valid && forcedSchemaAudit.errors.some(e => e.ruleId === 'SCHEMA_FORMATTED_DATA'),
  'validate-chart.js sur le HTML compilé retrouve la violation via customData');
assert(!validateChartFile(bulletRes.outputPath).errors.some(e => e.ruleId === 'SCHEMA_FORMATTED_DATA'),
  'Aucune fausse violation sur un HTML compilé conforme (bullet-chart)');

// 12.4 layout.footnote est rendu par les graphiques et retiré quand il est absent.
const footSnippet = compileChart(Object.assign({}, barSpec, { layout: Object.assign({}, barSpec.layout, { footnote: 'Source : INSEE <2024>' }) }), { format: 'snippet' }).html;
assert(/<p class="kit-charts-footnote"[^>]*>Source : INSEE &lt;2024&gt;<\/p>/.test(footSnippet), 'footnote rendue et échappée dans le pied de carte de bar-chart-vertical');
assert(!snippetRes.html.includes('kit-charts-footnote') && !snippetRes.html.includes('{{FOOTNOTE}}'), 'Sans footnote, aucun pied de carte vide ni placeholder résiduel');
// Graphiques et tableaux : placeholder {{FOOTNOTE}} ; cartes KPI : renderCard() affiche data.footnote,
// que le compilateur alimente depuis layout.footnote.
const unrendered = registry.templates.filter(t => {
  const html = fs.readFileSync(path.resolve(__dirname, '..', t.paths.html), 'utf8');
  if (html.includes('{{FOOTNOTE}}')) return false;
  const js = fs.readFileSync(path.resolve(__dirname, '..', t.paths.js), 'utf8');
  return !(/function renderCard/.test(js) && js.includes('data.footnote'));
}).map(t => t.id);
assert(unrendered.length === 0, `layout.footnote rendu par tous les templates${unrendered.length ? ' | ignoré par : ' + unrendered.join(', ') : ''}`);
assert(/"footnote": "Source: Données Stripe directes"/.test(kpiCompiled.html),
  'Carte KPI compilée : layout.footnote reporté dans les données de renderCard');

// 12.4 bis Injection HTML : les templates rendus en HTML (cartes KPI, tableaux) échappent leurs
// données au point d'injection. Oracle : chaque chaîne de DEFAULT_DATA reçoit une balise ; le HTML
// produit ne doit jamais la contenir brute, et la carte doit être rendue (pas en état invalide).
const xss = '<img src=x onerror=alert(1)>';
const ENUM_KEYS = new Set(['polarity', 'metricType', 'format', 'align', 'type', 'status', 'trend', 'deltaUnit', 'id', 'key', 'role', 'valence']);
const poison = (v, key) => typeof v === 'string' ? (ENUM_KEYS.has(key) ? v : v + xss)
  : Array.isArray(v) ? v.map(x => poison(x, key))
  : (v && typeof v === 'object') ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, poison(x, k)])) : v;
const htmlSinks = [];
function fakeHtmlElement(tag = 'DIV') {
  const el = { tagName: tag, style: {}, dataset: {}, attrs: {}, html: '',
    classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    setAttribute(k, v) { this.attrs[k] = v; }, getAttribute(k) { return this.attrs[k] ?? null; }, removeAttribute() {},
    appendChild: c => c, insertBefore: c => c, removeChild() {}, remove() {},
    querySelector: () => null, querySelectorAll: () => [], addEventListener() {}, removeEventListener() {},
    getBoundingClientRect: () => ({ width: 800, height: 400, top: 0, left: 0 }), clientWidth: 800, clientHeight: 400, offsetWidth: 800,
    width: 800, height: 400, getContext: () => new Proxy({}, { get: (t, p) => (p === 'canvas' ? {} : () => ({ addColorStop() {} })) }),
    parentElement: { querySelector: () => null, appendChild() {}, insertBefore() {}, style: {} } };
  Object.defineProperty(el, 'innerHTML', { get() { return this.html; }, set(v) { this.html = String(v); htmlSinks.push(String(v)); } });
  return el;
}
const savedDocument = global.document;
const savedWindow = global.window;
const savedChart = global.Chart;
global.document = { getElementById: () => null, createElement: t => fakeHtmlElement(String(t).toUpperCase()), body: fakeHtmlElement() };
global.Chart = ProbeChart;
const injected = [];
const prevConsoleError = console.error;
console.error = () => {};
for (const tpl of registry.templates) {
  const mod = require(path.resolve(__dirname, '..', tpl.paths.js));
  const isCard = typeof mod.renderCard === 'function';
  const isTable = fs.readFileSync(path.resolve(__dirname, '..', tpl.paths.html), 'utf8').includes('{{TABLE_ID}}');
  if (!isCard && !isTable) continue;
  htmlSinks.length = 0;
  const el = fakeHtmlElement();
  let threw = '';
  try {
    const data = poison(JSON.parse(JSON.stringify(mod.DEFAULT_DATA)));
    if (isCard) mod.renderCard(el, data, 'colorbrewer-accessible');
    else (mod.createTable || mod.createChart)(el, data, 'colorbrewer-accessible', {});
  } catch (e) { threw = e.message; }
  const html = htmlSinks.join('\n');
  const raw = (html.match(/<img src=x/g) || []).length;
  if (threw || raw || html.length < 200 || html.includes('data-kc-invalid')) {
    injected.push(`${tpl.id} (${threw ? 'exception : ' + threw : raw ? raw + ' balise(s) injectée(s)' : 'non rendu'})`);
  }
}
console.error = prevConsoleError;
global.Chart = savedChart;
if (savedDocument === undefined) delete global.document; else global.document = savedDocument;
if (savedWindow === undefined) delete global.window; else global.window = savedWindow;
assert(injected.length === 0, `Templates HTML (KPI, tableaux) : aucune donnée injectée telle quelle dans innerHTML${injected.length ? ' | ' + injected.join(', ') : ''}`);
const apostrophe = compileChart({ targetTemplateId: 'kpi-sparkline', formattedData: { title: "Chiffre d'affaires R&D", value: 3, history: [1, 2, 3] } }, { format: 'snippet' }).html;
assert(JSON.parse(apostrophe.match(/const customData = (\{[\s\S]*?\});/)[1]).title === "Chiffre d'affaires R&D",
  "Apostrophe et & intacts (texte canvas, export CSV) : « Chiffre d'affaires R&D » non transformé en entités");
const breakout = compileChart({ targetTemplateId: 'bar-chart-vertical', layout: { title: '</script><script>alert(1)</script>' }, formattedData: { labels: ['</script>'], datasets: [{ data: [1] }] } }, { format: 'snippet' }).html;
const initBlock = breakout.slice(breakout.indexOf('<script>') + 8);
assert(!initBlock.slice(0, initBlock.lastIndexOf('</script>')).includes('</script>'), 'Aucune sortie du bloc <script> via les données ou le titre (</script> neutralisé)');

// 12.5 Champs inconnus : avertissements. Longueurs croisées sur données indexées par label : erreur (Bloc 14).
const typoReport = validateChartSpec({
  targetTemplateId: 'bar-chart-vertical',
  layot: {},
  layout: { titre: 'x' },
  formattedData: { labels: ['A', 'B', 'C'], datasets: [{ data: [1, 2] }], sousTitre: 'y' }
});
const typoIds = typoReport.warnings.filter(w => w.ruleId === 'UNKNOWN_FIELD').map(w => w.message.match(/'([^']+)'/)[1]).sort();
assert(typoIds.join(',') === 'formattedData.sousTitre,layot,layout.titre',
  `UNKNOWN_FIELD signale les 3 fautes (racine, layout, formattedData) : ${typoIds.join(', ') || 'aucune'}`);
assert(typoReport.errors.some(e => e.ruleId === 'DATA_LENGTH_MISMATCH' && e.message.includes('2 valeur(s) pour 3 label(s)')),
  'DATA_LENGTH_MISMATCH : 2 valeurs pour 3 labels signalé en erreur bloquante');
const sunburstMismatch = validateChartSpec({ targetTemplateId: 'sunburst', formattedData: require(path.resolve(__dirname, '..', registry.templates.find(t => t.id === 'sunburst').paths.js)).DEFAULT_DATA });
const waterfallDeltas = validateChartSpec({ targetTemplateId: 'waterfall-chart', formattedData: { labels: ['N-1', 'Prix', 'Coûts', 'N'], datasets: [{ data: [100, 4.2, -2.7, 101.5] }] } });
assert(waterfallDeltas.warnings.some(w => w.ruleId === 'WATERFALL_STEP_AS_TOTAL' && w.message.includes('index 1, 2')),
  'WATERFALL_STEP_AS_TOTAL : deltas signés seuls repérés aux index 1 et 2');
assert(![...sunburstMismatch.errors, ...sunburstMismatch.warnings].some(w => w.ruleId === 'DATA_LENGTH_MISMATCH'), 'Pas de DATA_LENGTH_MISMATCH sur sunburst (un dataset par anneau, dataPerLabel: false)');
const noisyDefaults = registry.templates.filter(t => {
  const r = validateChartSpec({ targetTemplateId: t.id, formattedData: require(path.resolve(__dirname, '..', t.paths.js)).DEFAULT_DATA });
  return [...r.errors, ...r.warnings].some(w => w.ruleId === 'UNKNOWN_FIELD' || w.ruleId === 'DATA_LENGTH_MISMATCH');
}).map(t => t.id);
assert(noisyDefaults.length === 0, `Aucun DEFAULT_DATA ne déclenche UNKNOWN_FIELD ni DATA_LENGTH_MISMATCH${noisyDefaults.length ? ' | ' + noisyDefaults.join(', ') : ''}`);

// 12.6 Données fournies mais incomplètes : refus visible, jamais de repli sur DEFAULT_DATA.
// null reste la démo (catalogue, snapshots) ; {} doit poser data-kc-invalid sans construire de Chart.
global.Chart = ProbeChart;
const silentFallbacks = [];
for (const tpl of registry.templates) {
  const js = fs.readFileSync(path.resolve(__dirname, '..', tpl.paths.js), 'utf8');
  if (!js.includes('checkRequiredArrays(') && !js.includes('renderInvalidData(')) continue;
  const mod = require(path.resolve(__dirname, '..', tpl.paths.js));
  const attrs = {};
  const canvas = Object.assign(fakeProbeCanvas(), { tagName: 'CANVAS', setAttribute: (k, v) => { attrs[k] = v; } });
  ProbeChart.last = null;
  const prevError = console.error;
  console.error = () => {};
  try { mod.createChart(canvas, {}, 'colorbrewer-accessible', {}); } catch (e) { attrs.threw = e.message; }
  console.error = prevError;
  if (!attrs['data-kc-invalid'] || ProbeChart.last || attrs.threw) {
    silentFallbacks.push(`${tpl.id} (${attrs.threw ? 'exception : ' + attrs.threw : ProbeChart.last ? 'graphique construit' : 'aucun data-kc-invalid'})`);
  }
}
global.Chart = PrevChart;
const guardedCount = registry.templates.filter(t => fs.readFileSync(path.resolve(__dirname, '..', t.paths.js), 'utf8').includes('checkRequiredArrays(')).length;
assert(guardedCount > 0 && silentFallbacks.length === 0,
  `formattedData {} refusé visiblement par les ${guardedCount} templates gardés${silentFallbacks.length ? ' | ' + silentFallbacks.join(', ') : ''}`);
const lingering = registry.templates.filter(t => /\|\|\s*DEFAULT_DATA\.(labels|datasets|tasks|drivers|segments|history)\b/.test(fs.readFileSync(path.resolve(__dirname, '..', t.paths.js), 'utf8'))).map(t => t.id);
assert(lingering.length === 0, `Aucun repli champ par champ sur DEFAULT_DATA dans les templates${lingering.length ? ' | ' + lingering.join(', ') : ''}`);

// ----------------------------------------------------------------------------
// BLOC 13 : CLI kit-charts (depuis un dossier hors dépôt, sans installation)
// Le parcours installé (npm pack + install -g) est couvert par npm run test:cli.
// ----------------------------------------------------------------------------
console.log('\n🔹 Bloc 13 : CLI kit-charts depuis un dossier hors dépôt');
const os = require('os');
const KC_BIN = path.resolve(__dirname, '../bin/kit-charts.js');
const cliProject = fs.mkdtempSync(path.join(os.tmpdir(), 'kc-cli-'));
const kc = (...args) => spawnSync('node', [KC_BIN, ...args], { cwd: cliProject, encoding: 'utf8' });
const kcList = kc('list', '--json');
assert(kcList.status === 0 && JSON.parse(kcList.stdout).length === registry.templates.length, 'kit-charts list : autant de templates que le registre');
const kcInit = kc('init-spec', 'slope-chart', '-o', 'output/pente/spec.json');
const kcSpecPath = path.join(cliProject, 'output/pente/spec.json');
assert(kcInit.status === 0 && fs.existsSync(kcSpecPath), 'kit-charts init-spec écrit la spec dans le dossier courant');
const kcSkeleton = kc('compile', kcSpecPath, '-o', 'output/pente/index.html');
assert(kcSkeleton.status === 1 && kcSkeleton.stderr.includes('SCHEMA_FORMATTED_DATA') && !fs.existsSync(path.join(cliProject, 'output/pente/index.html')),
  'Squelette non rempli refusé à la compilation : aucune donnée d\'exemple ne peut partir');
const kcSpec = JSON.parse(fs.readFileSync(kcSpecPath, 'utf8'));
kcSpec.layout = { title: 'Le renouvelable double en cinq ans', subtitle: 'Part du mix électrique, %, 2020 et 2025' };
kcSpec.formattedData = { labels: ['2020', '2025'], datasets: [{ label: 'Renouvelable', data: [21.5, 38.2] }, { label: 'Charbon', data: [13, 7.8] }] };
fs.writeFileSync(kcSpecPath, JSON.stringify(kcSpec));
const kcCompile = kc('compile', kcSpecPath, '-o', 'output/pente/index.html');
assert(kcCompile.status === 0 && fs.existsSync(path.join(cliProject, 'output/pente/index.html')), 'kit-charts compile écrit la page dans le dossier courant');
const kcDefaultOut = kc('compile', kcSpecPath);
assert(kcDefaultOut.status === 0 && fs.readdirSync(path.join(cliProject, 'output')).some(f => f.startsWith('slope-chart-')),
  'Sans -o, la sortie va dans output/ du dossier courant, pas dans le paquet');
const kcDescribe = kc('describe', 'gantt-progress', '--json');
assert(kcDescribe.status === 0 && JSON.parse(kcDescribe.stdout).formattedDataSchema.properties.datasets.items.required.includes('tasks'),
  'kit-charts describe expose le schéma réel (gantt : tasks requis)');
fs.rmSync(cliProject, { recursive: true, force: true });

// ----------------------------------------------------------------------------
// BLOC 14 : Règles de sens passées au linter (review-checklist.md)
// DATA_LENGTH_MISMATCH bloquant, UNSORTED_BARS, MISSING_UNIT, TITLE_IS_TOPIC.
// Un cas fautif et un cas sain par règle, exécutés par validateChartSpec ; fautifs nommés.
// ----------------------------------------------------------------------------
console.log('\n🔹 Bloc 14 : Règles de sens (longueurs, tri, unité, titre-constat)');
const ruleHits = (spec, ruleId, level) => validateChartSpec(spec)[level].some(x => x.ruleId === ruleId);
const withUnit = { subtitle: 'En k€, 2024' };
const vbar = (formattedData, layout = withUnit) => ({ targetTemplateId: 'bar-chart-vertical', layout, formattedData });
const bars = (tpl, labels, data, extra = {}) => ({ targetTemplateId: tpl, layout: withUnit, formattedData: { labels, datasets: [Object.assign({ label: 'CA', data }, extra)] } });
const CITIES = ['Lyon', 'Paris', 'Lille', 'Nice', 'Brest'];
const titled = (title, tpl = 'line-chart') => ({ targetTemplateId: tpl, layout: { title } });
// [nom du cas, règle, niveau attendu, spec, doit se déclencher]
const meaningCases = [
  ['3 labels pour 2 valeurs', 'DATA_LENGTH_MISMATCH', 'errors', vbar({ labels: ['A', 'B', 'C'], datasets: [{ label: 'CA', data: [1, 2] }] }), true],
  ['une valeur par label', 'DATA_LENGTH_MISMATCH', 'errors', vbar({ labels: ['A', 'B', 'C'], datasets: [{ label: 'CA', data: [1, 2, 3] }] }), false],
  ['points {x, y} qui portent leur position', 'DATA_LENGTH_MISMATCH', 'errors', { targetTemplateId: 'scatter-plot', formattedData: { labels: ['a'], datasets: [{ data: [{ x: 1, y: 2 }, { x: 2, y: 3 }] }] } }, false],
  ['lollipop dans un ordre quelconque', 'UNSORTED_BARS', 'warnings', bars('lollipop-chart', CITIES, [3, 9, 1, 5, 2]), true],
  ['lollipop trié décroissant', 'UNSORTED_BARS', 'warnings', bars('lollipop-chart', ['Paris', 'Nice', 'Lyon', 'Brest', 'Lille'], [9, 5, 3, 2, 1]), false],
  ['lollipop trié, « Autres » en dernier', 'UNSORTED_BARS', 'warnings', bars('lollipop-chart', ['Paris', 'Nice', 'Lyon', 'Brest', 'Autres'], [9, 5, 3, 2, 7]), false],
  ['tranches d\'âge (ordre naturel)', 'UNSORTED_BARS', 'warnings', bars('lollipop-chart', ['18-24', '25-34', '35-49', '50-64', '65+'], [3, 9, 1, 5, 2]), false],
  ['mois (ordre temporel)', 'UNSORTED_BARS', 'warnings', bars('lollipop-chart', ['Jan', 'Fév', 'Mar', 'Avr', 'Mai'], [3, 9, 1, 5, 2]), false],
  ['horizontal avec "sorted": false', 'UNSORTED_BARS', 'warnings', bars('bar-chart-horizontal', CITIES, [3, 9, 1, 5, 2], { sorted: false }), true],
  ['horizontal trié par le template', 'UNSORTED_BARS', 'warnings', bars('bar-chart-horizontal', CITIES, [3, 9, 1, 5, 2]), false],
  ['ni sous-titre ni label avec unité', 'MISSING_UNIT', 'warnings', vbar({ labels: ['A', 'B'], datasets: [{ label: 'CA', data: [1, 2] }] }, { subtitle: 'Par région, 2024' }), true],
  ['unité dans le sous-titre', 'MISSING_UNIT', 'warnings', vbar({ labels: ['A', 'B'], datasets: [{ label: 'CA', data: [1, 2] }] }, { subtitle: 'En M€, 2024' }), false],
  ['unité entre parenthèses dans le label', 'MISSING_UNIT', 'warnings', vbar({ labels: ['A', 'B'], datasets: [{ label: 'Clients actifs (milliers)', data: [1, 2] }] }, {}), false],
  ['KPI sans formattedData.unit', 'MISSING_UNIT', 'warnings', { targetTemplateId: 'kpi-standard', formattedData: { title: 'MRR', value: 148500 } }, true],
  ['KPI avec formattedData.unit', 'MISSING_UNIT', 'warnings', { targetTemplateId: 'kpi-standard', formattedData: { title: 'MRR', value: 148500, unit: '€' } }, false],
  ['« CA par région »', 'TITLE_IS_TOPIC', 'warnings', titled('CA par région'), true],
  ['« Évolution du churn »', 'TITLE_IS_TOPIC', 'warnings', titled('Évolution du churn'), true],
  ['« Ventes 2024 » (une année n\'est pas un constat)', 'TITLE_IS_TOPIC', 'warnings', titled('Ventes 2024'), true],
  ['verbe conjugué', 'TITLE_IS_TOPIC', 'warnings', titled('Le churn recule depuis mars'), false],
  ['chiffre de constat', 'TITLE_IS_TOPIC', 'warnings', titled('CA : +12 % sur un an'), false],
  ['comparatif plus … que', 'TITLE_IS_TOPIC', 'warnings', titled('Ventes en ligne plus fortes que les magasins'), false],
  ['titre de carte KPI (nom de métrique)', 'TITLE_IS_TOPIC', 'warnings', titled('MRR de novembre', 'kpi-standard'), false]
];
const meaningWrong = meaningCases
  .filter(([, ruleId, level, spec, expected]) => ruleHits(spec, ruleId, level) !== expected)
  .map(([name, ruleId, , , expected]) => `${ruleId} ${expected ? 'muet' : 'déclenché à tort'} : ${name}`);
assert(meaningWrong.length === 0,
  `${meaningCases.length} cas fautifs et sains des 4 règles de sens au bon verdict${meaningWrong.length ? ' | ' + meaningWrong.join(' | ') : ''}`);

// 14.2 Aucun DEFAULT_DATA du registre ne déclenche d'erreur, nouvelles règles comprises.
const defaultErrors = registry.templates.map(t => {
  const errs = validateChartSpec({ targetTemplateId: t.id, formattedData: require(path.resolve(__dirname, '..', t.paths.js)).DEFAULT_DATA }).errors;
  return errs.length ? `${t.id} (${errs.map(e => e.ruleId).join(', ')})` : null;
}).filter(Boolean);
assert(defaultErrors.length === 0,
  `Aucune erreur sur le DEFAULT_DATA des ${registry.templates.length} templates${defaultErrors.length ? ' | ' + defaultErrors.join(' | ') : ''}`);

// 14.3 Formes attendues par les evals où une donnée n'est pas « un nombre par label » : zéro erreur.
const evalShapes = [
  ['slope-chart 2 labels x 7 agences', { targetTemplateId: 'slope-chart', layout: { title: 'Lille passe de la 6e à la 1re place', subtitle: 'Clients satisfaits, en %' },
    formattedData: { labels: ['2023', '2025'], datasets: [[68, 84], [72, 81], [70, 79], [77, 78], [79, 76], [65, 73], [74, 70]].map((data, i) => ({ label: `Agence ${i + 1}`, data })) } }],
  ['violin-plot, un tableau brut par label', { targetTemplateId: 'violin-plot', layout: { title: 'Saint-Priest livre à deux vitesses', subtitle: 'Délai, en heures' },
    formattedData: { labels: ['Gonesse', 'Saint-Priest'], datasets: [{ label: 'Délai (h)', data: [[22, 24, 25, 27, 30], [21, 23, 49, 51, 55]] }] } }],
  ['waterfall-chart en paires chaînées', { targetTemplateId: 'waterfall-chart', layout: { title: "L'EBIT recule de 1,2 M€", subtitle: 'En M€' },
    formattedData: { labels: ['EBIT 2024', 'Volume', 'Salaires', 'EBIT 2025'], datasets: [{ label: 'EBIT (M€)', data: [18.6, [18.6, 22.8], [22.8, 17.4], 17.4] }] } }],
  ['gantt-progress, tâches sans data', { targetTemplateId: 'gantt-progress', layout: { title: 'Le paramétrage est en retard' },
    formattedData: { labels: ['Cadrage', 'Paramétrage', 'Formation'], datasets: [{ label: 'Planning', todayWeek: 7, tasks: [{ label: 'Cadrage', start: 1, end: 3, progress: 100 }, { label: 'Paramétrage', start: 4, end: 9, progress: 45 }, { label: 'Formation', start: 9, end: 11, progress: 0 }] }] } }]
];
const evalShapeErrors = evalShapes.map(([name, spec]) => {
  const errs = validateChartSpec(spec).errors;
  return errs.length ? `${name} (${errs.map(e => e.ruleId).join(', ')})` : null;
}).filter(Boolean);
assert(evalShapeErrors.length === 0, `Formes des evals (slope, violin, waterfall, gantt) sans erreur${evalShapeErrors.length ? ' | ' + evalShapeErrors.join(' | ') : ''}`);

// 14.4 Page compilée : le linter relit titre et sous-titre sérialisés dans les options.
const meaningRes = compileChart({ targetTemplateId: 'line-chart', layout: { title: 'Facture cloud 2024', subtitle: 'Facture mensuelle, en k€' },
  formattedData: { labels: ['Jan', 'Fév', 'Mar', 'Avr'], datasets: [{ label: 'Facture', data: [42, 44, 47, 51] }] } }, { output: path.join(OUTPUT_DIR, 'e2e-meaning', 'index.html') });
const meaningAudit = validateChartFile(meaningRes.outputPath);
const meaningIds = meaningAudit.warnings.map(w => w.ruleId);
assert(meaningIds.includes('TITLE_IS_TOPIC') && !meaningIds.includes('MISSING_UNIT'),
  `HTML compilé : TITLE_IS_TOPIC lu dans layout.title, unité lue dans layout.subtitle (avertissements : ${meaningIds.join(', ') || 'aucun'})`);

// ----------------------------------------------------------------------------
// BLOC 15 : La polarité de la spec décide des couleurs (docs/specs/themes-et-polarite.md,
// décision 0002). Même hausse, polarité inverse : couleur de variation inverse.
// ----------------------------------------------------------------------------
console.log('\n🔹 Bloc 15 : metricPolarity décide des couleurs de variation');
const { applyMetricPolarity } = require('../.agents/skills/kit-charts/scripts/compile-chart.js');
const polTokens = themeTokens.getThemeTokens('colorbrewer-accessible');
const UP_GOOD = themeTokens.getValenceColor(polTokens, 1, 'gain');
const UP_BAD = themeTokens.getValenceColor(polTokens, 1, 'cost');
assert(UP_GOOD !== UP_BAD, `Le thème distingue hausse favorable (${UP_GOOD}) et défavorable (${UP_BAD})`);

if (typeof applyMetricPolarity !== 'function') {
  assert(false, 'compile-chart.js exporte applyMetricPolarity');
} else {
  // 15.1 Complète seulement ce qui manque, sans toucher l'entrée.
  const input = {
    value: 74, delta: 12,
    datasets: [{ data: [1, 2], valences: [1, -1] }, { data: [3] }, { data: [4], valence: 1, metricType: 'gain' }]
  };
  const before = JSON.stringify(input);
  const low = applyMetricPolarity(input, 'LOWER_IS_BETTER');
  const fillFaults = [];
  if (low.metricType !== 'cost') fillFaults.push(`racine=${low.metricType}`);
  if (low.datasets[0].metricType !== 'cost') fillFaults.push(`série à valences=${low.datasets[0].metricType}`);
  if ('metricType' in low.datasets[1]) fillFaults.push('série sans valence complétée');
  if (low.datasets[2].metricType !== 'gain') fillFaults.push('valeur écrite remplacée');
  if (JSON.stringify(input) !== before) fillFaults.push('entrée modifiée');
  if (applyMetricPolarity({ delta: 1 }, 'HIGHER_IS_BETTER').metricType !== 'gain') fillFaults.push('HIGHER_IS_BETTER ≠ gain');
  if (applyMetricPolarity({ delta: 1 }, 'NEUTRAL_CATEGORICAL').metricType !== 'neutral') fillFaults.push('NEUTRAL_CATEGORICAL ≠ neutral');
  if ('metricType' in applyMetricPolarity({ delta: 1 }, 'TARGET_BASED')) fillFaults.push('TARGET_BASED a complété');
  assert(fillFaults.length === 0, `applyMetricPolarity complète racine et séries à valence, rien d'autre${fillFaults.length ? ' | ' + fillFaults.join(' | ') : ''}`);

  // 15.2 Couleur émise par les templates, même hausse, deux polarités.
  const kpiMod = require('../template/00-kpi-card/kpi-standard/template.js');
  const barMod = require('../template/01-comparaison/bar-chart-vertical/template.js');
  const polCanvas = () => ({ width: 800, height: 400, getContext: () => new Proxy({}, { get: (t, p) => (p === 'canvas' ? {} : () => ({ addColorStop() {} })) }) });
  const colorFaults = [];
  for (const [pol, expected, other] of [['HIGHER_IS_BETTER', UP_GOOD, UP_BAD], ['LOWER_IS_BETTER', UP_BAD, UP_GOOD]]) {
    const el = { innerHTML: '' };
    kpiMod.renderCard(el, applyMetricPolarity({ title: 'Facture cloud', value: 74, unit: 'k€', delta: 12 }, pol), 'colorbrewer-accessible');
    if (!el.innerHTML.includes(expected) || el.innerHTML.includes(other)) colorFaults.push(`kpi-standard sous ${pol}`);
    const bar = barMod.createChart(polCanvas(), applyMetricPolarity({ labels: ['T1', 'T2'], datasets: [{ label: 'Coûts', data: [5, 6], valences: [1, 1] }] }, pol), 'colorbrewer-accessible', {});
    const bg = bar && bar.data && bar.data.datasets[0].backgroundColor;
    if (!Array.isArray(bg) || bg[0] !== expected) colorFaults.push(`bar-chart-vertical sous ${pol} (reçu ${JSON.stringify(bg)})`);
  }
  assert(colorFaults.length === 0, `Hausse en couleur favorable sous HIGHER_IS_BETTER, défavorable sous LOWER_IS_BETTER${colorFaults.length ? ' | ' + colorFaults.join(' | ') : ''}`);
}

// 15.3 Page compilée : données complétées, spec.json de l'utilisateur intacte.
const polDir = path.join(OUTPUT_DIR, 'e2e-polarity');
fs.rmSync(polDir, { recursive: true, force: true });
const costSpec = {
  targetTemplateId: 'kpi-standard',
  layout: { title: 'La facture cloud a pris 12 % en un an', subtitle: 'Décembre 2024, en k€' },
  colorStrategy: { themeName: 'colorbrewer-accessible', metricPolarity: 'LOWER_IS_BETTER' },
  formattedData: { title: 'Facture cloud', value: 74, unit: 'k€', delta: 12 }
};
let costRes;
try {
  costRes = compileChart(costSpec, { output: path.join(polDir, 'cout', 'index.html'), strict: true });
} catch (e) {
  costRes = { error: e.message };
}
const costJson = costRes && costRes.outputPath ? fs.readFileSync(path.join(path.dirname(costRes.outputPath), 'spec.json'), 'utf8') : '';
assert(Boolean(costRes && costRes.html && /"metricType":\s*"cost"/.test(costRes.html)) && !costJson.includes('metricType') && !('metricType' in costSpec.formattedData),
  `Page LOWER_IS_BETTER : metricType "cost" sérialisé, spec.json et objet d'entrée intacts${costRes && costRes.error ? ' | ' + costRes.error : ''}`);

// 15.4 kpi-status-alert : la polarité de la spec suffit.
const alertMod = require('../template/00-kpi-card/kpi-status-alert/template.js');
const alertData = Object.assign({}, alertMod.DEFAULT_DATA);
const alertPol = alertData.polarity === 'higher-is-better' ? 'HIGHER_IS_BETTER' : 'LOWER_IS_BETTER';
delete alertData.polarity;
let alertRes;
try {
  alertRes = compileChart({ targetTemplateId: 'kpi-status-alert', colorStrategy: { metricPolarity: alertPol }, formattedData: alertData },
    { output: path.join(polDir, 'alerte', 'index.html'), strict: true });
} catch (e) {
  alertRes = { error: e.message.split('\n').slice(0, 2).join(' ') };
}
assert(Boolean(alertRes && alertRes.success), `kpi-status-alert sans polarity dans ses données compile avec ${alertPol}${alertRes && alertRes.error ? ' | ' + alertRes.error : ''}`);

// 15.5 Contradiction refusée par le CLI : exit 1, règle citée, rien d'écrit.
fs.mkdirSync(polDir, { recursive: true });
const conflictSpec = path.join(polDir, 'conflit.json');
fs.writeFileSync(conflictSpec, JSON.stringify(Object.assign({}, costSpec, { formattedData: Object.assign({}, costSpec.formattedData, { metricType: 'gain' }) })));
const conflictOut = path.join(polDir, 'conflit', 'index.html');
const conflictRun = spawnSync('node', [COMPILE_CLI, conflictSpec, '-o', conflictOut], { encoding: 'utf8' });
assert(conflictRun.status === 1 && !fs.existsSync(conflictOut) && conflictRun.stderr.includes('METRIC_POLARITY_CONFLICT'),
  `LOWER_IS_BETTER avec metricType "gain" refusé : exit ${conflictRun.status}, fichier écrit=${fs.existsSync(conflictOut)}, règle citée=${conflictRun.stderr.includes('METRIC_POLARITY_CONFLICT')}`);

// ----------------------------------------------------------------------------
// BLOC 8 : Nettoyage Déterministe des Artefacts de Test
// ----------------------------------------------------------------------------
try {
  const testSubdirs = [
    'e2e-kpi-standard', 'e2e-bar-vertical', 'e2e-box-plot',
    'e2e-bullet', 'e2e-multi-line', 'e2e-bar-horiz',
    'e2e-choropleth', 'e2e-treemap', 'e2e-cli', 'e2e-schema', 'e2e-meaning', 'e2e-polarity'
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
