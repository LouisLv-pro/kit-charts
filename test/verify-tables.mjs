/**
 * @file test/verify-tables.mjs
 * @description Suite de vérification exhaustive des 6 templates de tableaux dataviz
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const TABLE_IDS = [
  'table-kpi-scorecard',
  'table-heatmap-matrix',
  'table-bar-in-cell',
  'table-hierarchical-tree',
  'table-financial-variance',
  'table-ranking-leaderboard'
];

const THEME_NAMES = [
  'colorbrewer-accessible',
  'viridis-perceptual',
  'paul-tol-scientific',
  'tableau-stone-categorical',
  'okabe-ito-cud',
  'tufte-minimalist-executive',
  'nord-cognitive-dark',
  'atkinson-hyperlegible'
];

console.log('🧪 Starting 09-tableaux-dataviz Verification Suite...\n');

let passedAssertions = 0;

// 1. Vérification des fichiers physiques (template.js, preview.html, guide/*.md)
console.log('📁 1. Physical Files Verification:');
TABLE_IDS.forEach(id => {
  const templatePath = path.join(rootDir, 'template', '09-tableaux-dataviz', id, 'template.js');
  const previewPath = path.join(rootDir, 'template', '09-tableaux-dataviz', id, 'preview.html');
  const guidePath = path.join(rootDir, 'guide', '09-tableaux-dataviz', `${id}.md`);

  assert(fs.existsSync(templatePath), `template.js missing for ${id}`);
  assert(fs.existsSync(previewPath), `preview.html missing for ${id}`);
  assert(fs.existsSync(guidePath), `guide/${id}.md missing`);
  passedAssertions += 3;
  console.log(`  ✓ ${id}: template.js, preview.html, ${id}.md verified`);
});

const indexGuidePath = path.join(rootDir, 'guide', '09-tableaux-dataviz', 'index.md');
assert(fs.existsSync(indexGuidePath), 'guide/09-tableaux-dataviz/index.md missing');
passedAssertions++;
console.log('  ✓ guide/09-tableaux-dataviz/index.md verified');

// 2. Vérification des modules UMD et instanciation headless
console.log('\n📊 2. UMD Modules & Headless Instantiation across 8 Themes:');
for (const id of TABLE_IDS) {
  const modulePath = path.join(rootDir, 'template', '09-tableaux-dataviz', id, 'template.js');
  const mod = await import(modulePath);
  const tableModule = mod.default || mod;

  assert(typeof tableModule.createTable === 'function', `${id}: createTable is not a function`);
  assert(typeof tableModule.createChart === 'function', `${id}: createChart is not a function`);
  assert(typeof tableModule.DEFAULT_DATA === 'object', `${id}: DEFAULT_DATA is missing`);
  passedAssertions += 3;

  for (const theme of THEME_NAMES) {
    const instance = tableModule.createTable('non-existent-id', null, theme);
    assert(instance, `${id}: createTable returned null in headless mode for theme ${theme}`);
    assert(typeof instance.destroy === 'function', `${id}: instance.destroy is missing`);
    assert(typeof instance.update === 'function', `${id}: instance.update is missing`);
    assert(typeof instance.setTheme === 'function', `${id}: instance.setTheme is missing`);
    passedAssertions += 4;
  }
  console.log(`  ✓ ${id}: UMD export + headless mock tested across 8 themes`);
}

// 3. Vérification de la présence dans catalog-bundle.js
console.log('\n📦 3. Bundle Integration Parity:');
const bundleContent = fs.readFileSync(path.join(rootDir, 'catalog-bundle.js'), 'utf-8');
TABLE_IDS.forEach(id => {
  assert(bundleContent.includes(`global.KitCharts["${id}"]`), `Missing ${id} in catalog-bundle.js`);
  passedAssertions++;
  console.log(`  ✓ ${id} registered in catalog-bundle.js`);
});

// 4. Vérification de l'intégration dans index.html
console.log('\n🌐 4. index.html Integration:');
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
assert(indexHtml.includes('09-tableaux-dataviz'), 'Missing 09-tableaux-dataviz in index.html');
passedAssertions++;

TABLE_IDS.forEach(id => {
  assert(indexHtml.includes(`id: '${id}'`), `Missing ${id} in CATALOG array in index.html`);
  passedAssertions++;
  console.log(`  ✓ ${id} present in index.html CATALOG`);
});

// 5. Vérification spécifique de la polarité et des deltas pour table-kpi-scorecard
console.log('\n🎯 5. KPI Scorecard Valence & Directionality Verification:');
const kpiScorecardMod = await import(path.join(rootDir, 'template', '09-tableaux-dataviz', 'table-kpi-scorecard', 'template.js'));
const kpiModule = kpiScorecardMod.default || kpiScorecardMod;
const kpiData = kpiModule.DEFAULT_DATA;

// CAC (cost metric, actual 840 > target 750) -> delta must be positive +12% (drift)
const cacRow = kpiData.rows.find(r => r.kpi.includes('CAC'));
assert(cacRow, 'CAC row must exist');
assert.equal(cacRow.delta, 12.0, 'CAC delta must be positive +12.0% representing cost increase');
assert.equal(cacRow.metricType, 'cost', 'CAC metricType must be cost');

// Churn (cost metric, actual 0.85 > target 0.70) -> delta must be positive +21.43% (alert)
const churnRow = kpiData.rows.find(r => r.kpi.includes('Churn'));
assert(churnRow, 'Churn row must exist');
assert.equal(churnRow.delta, 21.43, 'Churn delta must be positive +21.43%');
assert.equal(churnRow.metricType, 'cost', 'Churn metricType must be cost');

// Latence (cost metric, actual 118 < target 120) -> delta must be negative -1.67% (improvement)
const latencyRow = kpiData.rows.find(r => r.kpi.includes('Latence'));
assert(latencyRow, 'Latency row must exist');
assert.equal(latencyRow.delta, -1.67, 'Latency delta must be negative -1.67%');
assert.equal(latencyRow.metricType, 'cost', 'Latency metricType must be cost');

passedAssertions += 6;
console.log('  ✓ KPI Scorecard polarity and deltas verified (CAC: +12% cost rise, Churn: +21.43% rise, Latence: -1.67% drop)');

console.log(`\n🎉 All ${passedAssertions} assertions passed with 100% success!`);
