/**
 * @file test/verify-combined-lot2.mjs
 * @description Dedicated Automated Verification Test Suite for Lot 2 (P1) Combined Charts:
 * 1. pareto-chart (02-composition-part-to-whole)
 * 2. scatter-regression (04-correlation-relation)
 * 3. bar-target-overlay (01-comparaison)
 * 4. dual-axis-controlled (05-evolution-temporelle)
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

console.log('🧪 Starting Combined Charts Lot 2 (P1) Comprehensive Verification Suite...\n');

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    throw err;
  }
}

const TEMPLATES = [
  {
    name: 'pareto-chart',
    category: '02-composition-part-to-whole',
    templatePath: 'template/02-composition-part-to-whole/pareto-chart',
    guidePath: 'guide/02-composition-part-to-whole/pareto-chart.md',
    expectedFunctions: [
      'createChart',
      'DEFAULT_DATA',
      'computeParetoCumulative',
      'computeGiniCoefficient',
      'getEmphasisStyle',
      'getValenceColor',
      'getThresholdStatus'
    ]
  },
  {
    name: 'scatter-regression',
    category: '04-correlation-relation',
    templatePath: 'template/04-correlation-relation/scatter-regression',
    guidePath: 'guide/04-correlation-relation/scatter-regression.md',
    expectedFunctions: [
      'createChart',
      'DEFAULT_DATA',
      'computeLinearRegressionOLS',
      'computeConfidenceInterval95',
      'computePearsonR',
      'computeR2',
      'getEmphasisStyle',
      'getValenceColor',
      'getThresholdStatus'
    ]
  },
  {
    name: 'bar-target-overlay',
    category: '01-comparaison',
    templatePath: 'template/01-comparaison/bar-target-overlay',
    guidePath: 'guide/01-comparaison/bar-target-overlay.md',
    expectedFunctions: [
      'createChart',
      'DEFAULT_DATA',
      'computeTargetDeltas',
      'getEmphasisStyle',
      'getValenceColor',
      'getThresholdStatus'
    ]
  },
  {
    name: 'dual-axis-controlled',
    category: '05-evolution-temporelle',
    templatePath: 'template/05-evolution-temporelle/dual-axis-controlled',
    guidePath: 'guide/05-evolution-temporelle/dual-axis-controlled.md',
    expectedFunctions: [
      'createChart',
      'DEFAULT_DATA',
      'computeBase100Index',
      'computeZScores',
      'computePearsonR',
      'alignZeroScales',
      'getEmphasisStyle',
      'getValenceColor',
      'getThresholdStatus'
    ]
  }
];

// -----------------------------------------------------------------------------
// 1. PHYSICAL FILE INTEGRITY & STRUCTURE
// -----------------------------------------------------------------------------
console.log('📁 1. Physical Files & Structure Integrity:');

TEMPLATES.forEach(t => {
  test(`${t.name} has complete triad and guide files`, () => {
    const templateJs = path.join(ROOT, t.templatePath, 'template.js');
    const mdDoc = path.join(ROOT, t.templatePath, `${t.name}.md`);
    const previewHtml = path.join(ROOT, t.templatePath, 'preview.html');
    const guideDoc = path.join(ROOT, t.guidePath);

    assert.ok(fs.existsSync(templateJs), `Missing template.js at ${templateJs}`);
    assert.ok(fs.existsSync(mdDoc), `Missing doc at ${mdDoc}`);
    assert.ok(fs.existsSync(previewHtml), `Missing preview.html at ${previewHtml}`);
    assert.ok(fs.existsSync(guideDoc), `Missing guide doc at ${guideDoc}`);
  });
});

// -----------------------------------------------------------------------------
// 2. UMD MODULE EXPORTS & API:
// -----------------------------------------------------------------------------
console.log('\n📦 2. UMD Module Exports & API:');

TEMPLATES.forEach(t => {
  test(`${t.name} exports all required functions via CommonJS / UMD`, () => {
    const modulePath = path.join(ROOT, t.templatePath, 'template.js');
    const mod = require(modulePath);
    t.expectedFunctions.forEach(fn => {
      assert.ok(mod[fn] !== undefined, `Module ${t.name} is missing export '${fn}'`);
    });
  });
});

// -----------------------------------------------------------------------------
// 3. MATHEMATICAL DETERMINISM & ACCURACY
// -----------------------------------------------------------------------------
console.log('\n📐 3. Mathematical Calculations & Deterministic Algorithms:');

test('pareto-chart: computeParetoCumulative & computeGiniCoefficient', () => {
  const paretoMod = require(path.join(ROOT, 'template/02-composition-part-to-whole/pareto-chart/template.js'));
  const labels = ['A', 'B', 'C', 'D'];
  const values = [10, 50, 30, 10]; // Total = 100, Sorted: B(50), C(30), A(10), D(10)
  const res = paretoMod.computeParetoCumulative(labels, values);

  assert.deepEqual(res.sortedLabels, ['B', 'C', 'A', 'D']);
  assert.deepEqual(res.sortedValues, [50, 30, 10, 10]);
  assert.deepEqual(res.cumulativePercentages, [50, 80, 90, 100]);
  assert.equal(res.total, 100);
  assert.equal(res.thresholdIndex80, 1);

  const gini = paretoMod.computeGiniCoefficient([10, 10, 30, 50]);
  assert.ok(gini >= 0.35, 'Gini coefficient computed correctly');
});

test('scatter-regression: computeLinearRegressionOLS & computeConfidenceInterval95', () => {
  const scatterMod = require(path.join(ROOT, 'template/04-correlation-relation/scatter-regression/template.js'));
  const points = [
    { x: 10, y: 20 },
    { x: 20, y: 40 },
    { x: 30, y: 60 },
    { x: 40, y: 80 }
  ];
  const ols = scatterMod.computeLinearRegressionOLS(points);
  assert.equal(ols.slope, 2);
  assert.equal(ols.intercept, 0);
  assert.equal(ols.r, 1);
  assert.equal(ols.r2, 1);

  const ci = scatterMod.computeConfidenceInterval95(points, 5);
  assert.equal(ci.trendPoints.length, 5);
  assert.equal(ci.ciUpperPoints.length, 5);
  assert.equal(ci.ciLowerPoints.length, 5);
});

test('bar-target-overlay: computeTargetDeltas', () => {
  const barMod = require(path.join(ROOT, 'template/01-comparaison/bar-target-overlay/template.js'));
  const actuals = [120, 95, 70];
  const targets = [100, 100, 100];
  const res = barMod.computeTargetDeltas(actuals, targets, 'gain');

  assert.deepEqual(res.deltasAbs, [20, -5, -30]);
  assert.deepEqual(res.deltasRel, [20, -5, -30]);
  assert.deepEqual(res.statuses, ['success', 'warning', 'danger']);
});

test('dual-axis-controlled: computeBase100Index, computeZScores & alignZeroScales', () => {
  const dualMod = require(path.join(ROOT, 'template/05-evolution-temporelle/dual-axis-controlled/template.js'));
  const series = [50, 100, 75];
  const base100 = dualMod.computeBase100Index(series);
  assert.deepEqual(base100, [100, 200, 150]);

  const zscores = dualMod.computeZScores([10, 20, 30]);
  assert.deepEqual(zscores, [-1, 0, 1]);

  const r = dualMod.computePearsonR([10, 20, 30], [20, 40, 60]);
  assert.equal(r, 1);

  const aligned = dualMod.alignZeroScales(-10, 50, -5, 100);
  assert.equal(aligned.y1Min / aligned.y1Max, aligned.y2Min / aligned.y2Max);
});

// -----------------------------------------------------------------------------
// 4. MARKDOWN & SECTION 8 COMPLIANCE
// -----------------------------------------------------------------------------
console.log('\n📚 4. Markdown Documentation Standards & Section 8:');

TEMPLATES.forEach(t => {
  test(`${t.name} markdown has all mandatory sections`, () => {
    const mdPath = path.join(ROOT, t.templatePath, `${t.name}.md`);
    const content = fs.readFileSync(mdPath, 'utf8');

    assert.ok(content.includes('Fondements Scientifiques'), `${t.name} missing Section 1`);
    assert.ok(content.includes('Formulation Mathématique Déterministe'), `${t.name} missing Section 2`);
    assert.ok(content.includes('Double-Encodage & Garde-Fous Cognitifs'), `${t.name} missing Section 3`);
    assert.ok(/quand (l['’]|)utiliser/i.test(content) && /quand (ne pas|pas)/i.test(content), `${t.name} missing Section 4`);
    assert.ok(content.includes('Intégration Tokens') || content.includes('Intégration tokens'), `${t.name} missing Section 5`);
    assert.ok(content.includes('Données de Démonstration Déterministes') || content.includes('Données de Démonstration'), `${t.name} missing Section 6`);
    assert.ok(content.includes('Psychophysique de l\'Interaction') || content.includes('Psychophysique de l’Interaction'), `${t.name} missing Section 7`);
    assert.ok(content.includes('Règles Cognitives d\'Accentuation & Valence') || content.includes('Règles Cognitives d’Accentuation & Valence'), `${t.name} missing Section 8`);

    if (t.name === 'dual-axis-controlled') {
      assert.ok(content.includes('Danger : Corrélation Fallacieuse') || content.includes('Danger : corrélation fallacieuse'), 'dual-axis-controlled must have explicit Danger section');
    }
  });
});

// -----------------------------------------------------------------------------
// 5. HEADLESS CONFIG GENERATION ACROSS 8 THEMES
// -----------------------------------------------------------------------------
console.log('\n🎨 5. Headless Config Generation across 8 Canonical Themes:');

const THEMES = [
  'colorbrewer-accessible',
  'viridis-perceptual',
  'paul-tol-scientific',
  'tableau-stone-categorical',
  'okabe-ito-cud',
  'tufte-minimalist-executive',
  'nord-cognitive-dark',
  'atkinson-hyperlegible'
];

TEMPLATES.forEach(t => {
  test(`${t.name} creates valid Chart.js config for all 8 themes`, () => {
    const mod = require(path.join(ROOT, t.templatePath, 'template.js'));
    THEMES.forEach(th => {
      const config = mod.createChart({ parentElement: null }, null, th);
      assert.ok(config && typeof config === 'object', `createChart failed on theme ${th}`);
      assert.ok(config.type, `Missing config.type on theme ${th}`);
      assert.ok(config.data, `Missing config.data on theme ${th}`);
      assert.ok(config.options, `Missing config.options on theme ${th}`);
    });
  });
});

console.log(`\n🎉 All ${passedTests}/${totalTests} Lot 2 tests passed successfully!\n`);
