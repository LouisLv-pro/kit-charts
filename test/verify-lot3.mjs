/**
 * @file test/verify-lot3.mjs
 * @description Dedicated Automated Verification Suite for Lot 3 (P2) Combined Templates:
 * 1. #9 Violin Plot (Enrichissement) [template/03-distribution/violin-plot/]
 * 2. #10 Joint Scatter Plot with Marginals [template/04-correlation-relation/joint-scatter-marginals/]
 * 3. #11 Stacked Bar with Total Line [template/02-composition-part-to-whole/stacked-total-line/]
 * 4. #12 Gantt with Progress & Today Line [template/06-flux-processus/gantt-progress/]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { THEME_NAMES } from '../themes/theme-tokens.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const LOT3_TEMPLATES = [
  {
    category: '03-distribution',
    id: 'violin-plot',
    expectedFunctions: ['computeGaussianKDE', 'computeScottBandwidth', 'computeSummaryStats']
  },
  {
    category: '04-correlation-relation',
    id: 'joint-scatter-marginals',
    expectedFunctions: ['computeMarginalKDEs', 'computeCovarianceEllipse']
  },
  {
    category: '02-composition-part-to-whole',
    id: 'stacked-total-line',
    expectedFunctions: ['computeStackedTotals']
  },
  {
    category: '06-flux-processus',
    id: 'gantt-progress',
    expectedFunctions: ['computeGanttProgress']
  }
];

let passed = 0;
let failed = 0;
const failureMessages = [];

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    failureMessages.push(message);
    console.error(`  ✗ FAIL: ${message}`);
  }
}

function expect(val) {
  return {
    toBe: (expected) => assert(val === expected, `Expected ${val} to be ${expected}`),
    toBeCloseTo: (expected, precision = 2) => {
      const diff = Math.abs(val - expected);
      const tolerance = Math.pow(10, -precision);
      assert(diff <= tolerance, `Expected ${val} to be close to ${expected} (tol: ${tolerance})`);
    },
    toBeDefined: () => assert(val !== undefined && val !== null, `Expected value to be defined`),
    toBeGreaterThan: (expected) => assert(val > expected, `Expected ${val} to be > ${expected}`)
  };
}

async function runLot3Verification() {
  console.log('🧪 Starting Lot 3 (P2) Deep Verification Suite...\n');

  // =========================================================================
  // 1. Documentation Markdown & Cognitive Rules
  // =========================================================================
  console.log('📚 1. Markdown Documentation & Cognitive Rules Sections:');
  for (const t of LOT3_TEMPLATES) {
    const guideMd = path.join(ROOT, 'guide', t.category, `${t.id}.md`);
    const templateMd = path.join(ROOT, 'template', t.category, t.id, `${t.id}.md`);

    assert(fs.existsSync(guideMd), `guide/${t.category}/${t.id}.md exists`);
    assert(fs.existsSync(templateMd), `template/${t.category}/${t.id}/${t.id}.md exists`);

    const content = fs.readFileSync(guideMd, 'utf-8');

    assert(
      content.includes("## 1. Fondements Scientifiques") || content.includes("## Fondements Scientifiques"),
      `${t.id}.md contains Section 1: Fondements Scientifiques`
    );
    assert(
      content.includes("## 2. Formulation Mathématique") || content.includes("## Formulation Mathématique") || content.includes("## 2. Le Piège Cognitif"),
      `${t.id}.md contains Section 2: Formulation Mathématique / Piège Cognitif`
    );
    assert(
      content.includes("## 3. Double-Encodage") || content.includes("## Double-Encodage"),
      `${t.id}.md contains Section 3: Double-Encodage & Garde-Fous`
    );
    assert(
      content.includes("## 4. Quand") || content.includes("## Quand"),
      `${t.id}.md contains Section 4: Quand utiliser / Quand ne pas utiliser`
    );
    assert(
      content.includes("## 5. Intégration Tokens") || content.includes("## Intégration Tokens"),
      `${t.id}.md contains Section 5: Intégration Tokens`
    );
    assert(
      content.includes("## 6. Données de Démonstration") || content.includes("## Données de Démonstration"),
      `${t.id}.md contains Section 6: Données de Démonstration Déterministes`
    );
    assert(
      content.includes("## 8. Règles Cognitives d'Accentuation & Valence") || content.includes("## Règles Cognitives d'Accentuation"),
      `${t.id}.md contains Section 8: Règles Cognitives d'Accentuation & Valence`
    );
    assert(
      content.includes('90/10') || content.includes('Hero'),
      `${t.id}.md documents 90/10 Visual Hierarchy / Hero vs Context`
    );
    assert(
      content.includes('Valence') || content.includes('Gain vs Coût') || content.includes('directionnalité') || content.includes('status.'),
      `${t.id}.md documents Business Valence & Directionality`
    );
    assert(
      content.includes('Seuils') || content.includes('Cible vs Réel') || content.includes('Threshold') || content.includes('benchmark'),
      `${t.id}.md documents Target vs Actual Thresholds`
    );
    assert(
      content.includes('Double Encodage') || content.includes('CVD') || content.includes('Accessibilité') || content.includes('double-encodage'),
      `${t.id}.md documents Double Encoding & CVD Accessibility`
    );
  }

  // Vérification spécifique violin-plot : Knific & Weissgerber 2018 + Hintze & Nelson 1998
  {
    const violinMd = fs.readFileSync(path.join(ROOT, 'guide', '03-distribution', 'violin-plot.md'), 'utf-8');
    assert(
      violinMd.includes('Knific & Weissgerber') && violinMd.includes('Hintze & Nelson'),
      'violin-plot.md cites Knific & Weissgerber (2018) and Hintze & Nelson (1998)'
    );
    assert(
      violinMd.includes('densité') && violinMd.includes('aire'),
      'violin-plot.md documents cognitive trap "aire du violon ∝ densité, pas n"'
    );
  }

  // =========================================================================
  // 2. Module Structure & Universal Exports
  // =========================================================================
  console.log('\n📦 2. Module Structure & Universal Exports:');
  const loadedModules = {};

  for (const t of LOT3_TEMPLATES) {
    const jsPath = path.join(ROOT, 'template', t.category, t.id, 'template.js');
    assert(fs.existsSync(jsPath), `${t.id} template.js exists`);

    const mod = await import(jsPath);
    const exp = mod.default || mod;
    loadedModules[t.id] = exp;

    assert(typeof exp.createChart === 'function', `${t.id} exports createChart()`);
    assert(typeof exp.DEFAULT_DATA === 'object', `${t.id} exports DEFAULT_DATA`);
    assert(typeof exp.getEmphasisStyle === 'function', `${t.id} exports getEmphasisStyle()`);
    assert(typeof exp.getValenceColor === 'function', `${t.id} exports getValenceColor()`);
    assert(typeof exp.getThresholdStatus === 'function', `${t.id} exports getThresholdStatus()`);

    for (const fn of t.expectedFunctions) {
      assert(typeof exp[fn] === 'function', `${t.id} exports ${fn}()`);
    }
  }

  // =========================================================================
  // 3. Mathematical Determinism & Calibration
  // =========================================================================
  console.log('\n📐 3. Mathematical Calibration & Deterministic Logic:');

  // 3.1 #9 Violin Plot KDE & Scott Bandwidth
  {
    const { computeScottBandwidth, computeGaussianKDE } = loadedModules['violin-plot'];
    const sample = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28];
    const h = computeScottBandwidth(sample);
    expect(h).toBeCloseTo(4.05, 1);
    console.log(`  ✓ Violin Scott bandwidth h = ${h.toFixed(4)} matches analytical expectation`);

    const kde = computeGaussianKDE(sample, null, 128);
    let integral = 0;
    for (let i = 0; i < kde.grid.length - 1; i++) {
      const dx = kde.grid[i + 1] - kde.grid[i];
      const avgY = (kde.density[i] + kde.density[i + 1]) / 2;
      integral += avgY * dx;
    }
    expect(integral).toBeCloseTo(1.0, 1);
    console.log(`  ✓ Violin numerical KDE integral = ${integral.toFixed(4)} ≈ 1.0`);
  }

  // 3.2 #10 Joint Scatter Marginals & Covariance Ellipse
  {
    const { computeMarginalKDEs, computeCovarianceEllipse } = loadedModules['joint-scatter-marginals'];
    const sample2D = [
      { x: 10, y: 20 }, { x: 20, y: 30 }, { x: 30, y: 40 }, { x: 40, y: 50 }, { x: 50, y: 60 }
    ];
    const marginals = computeMarginalKDEs(sample2D);
    expect(marginals.n).toBe(5);
    expect(marginals.pearsonR).toBeCloseTo(1.0, 2);
    expect(marginals.rSquared).toBeCloseTo(1.0, 2);
    expect(marginals.xKde.grid.length).toBeGreaterThan(50);
    expect(marginals.yKde.grid.length).toBeGreaterThan(50);
    console.log(`  ✓ Jointplot Pearson r = ${marginals.pearsonR}, R² = ${marginals.rSquared}`);

    const ellipse = computeCovarianceEllipse(sample2D, 0.95);
    expect(ellipse.centerX).toBeCloseTo(30, 1);
    expect(ellipse.centerY).toBeCloseTo(40, 1);
    expect(ellipse.ellipsePoints.length).toBeGreaterThan(30);
    console.log(`  ✓ Jointplot 95% covariance ellipse center = (${ellipse.centerX}, ${ellipse.centerY})`);
  }

  // 3.3 #11 Stacked Total Line Additivity & Share Computation
  {
    const { computeStackedTotals } = loadedModules['stacked-total-line'];
    const labels = ['T1', 'T2', 'T3'];
    const datasets = [
      { label: 'Layer A', data: [100, 150, 200] },
      { label: 'Layer B', data: [50, 50, 50] },
      { label: 'Layer C', data: [25, 25, 50] }
    ];
    const res = computeStackedTotals(labels, datasets);
    expect(res.totals[0]).toBe(175);
    expect(res.totals[1]).toBe(225);
    expect(res.totals[2]).toBe(300);
    expect(res.maxTotal).toBe(300);

    // Sum of shares must be 100%
    const shareSumT1 = res.shares[0][0] + res.shares[1][0] + res.shares[2][0];
    expect(shareSumT1).toBeCloseTo(100, 0);
    console.log(`  ✓ Stacked totals additivity: T1 = ${res.totals[0]}, T2 = ${res.totals[1]}, T3 = ${res.totals[2]} (shares sum = ${shareSumT1}%)`);
  }

  // 3.4 #12 Gantt Progress & Status Classification
  {
    const { computeGanttProgress } = loadedModules['gantt-progress'];
    const tasks = [
      { label: 'Task 1 (Done)', start: 0, end: 10, progress: 1.0 },
      { label: 'Task 2 (On Track)', start: 5, end: 25, progress: 0.60 },
      { label: 'Task 3 (Delayed)', start: 5, end: 20, progress: 0.10 }
    ];
    const gantt = computeGanttProgress(tasks, 15);
    expect(gantt.tasks[0].status).toBe('completed');
    expect(gantt.tasks[1].status).toBe('on-track');
    expect(gantt.tasks[2].status).toBe('delayed');
    expect(gantt.summary.completed).toBe(1);
    expect(gantt.summary.delayed).toBe(1);
    expect(gantt.summary.onTrack).toBe(1);
    console.log(`  ✓ Gantt task status classification: ${gantt.summary.completed} completed, ${gantt.summary.onTrack} on track, ${gantt.summary.delayed} delayed at Day 15`);
  }

  // =========================================================================
  // 4. Multi-Theme Headless Instantiation
  // =========================================================================
  console.log('\n🎨 4. Multi-Theme Headless Chart Instantiation (8 Themes):');
  const mockCanvas = {
    getContext: () => ({
      measureText: (txt) => ({ width: (txt || '').length * 7 }),
      fillText: () => {},
      beginPath: () => {},
      arc: () => {},
      fill: () => {},
      stroke: () => {},
      save: () => {},
      restore: () => {},
      moveTo: () => {},
      lineTo: () => {},
      closePath: () => {},
      fillRect: () => {},
      roundRect: () => {},
      setLineDash: () => {}
    }),
    parentElement: null
  };

  for (const t of LOT3_TEMPLATES) {
    const exp = loadedModules[t.id];
    for (const theme of THEME_NAMES) {
      const chart = exp.createChart(mockCanvas, null, theme);
      assert(chart && (chart.data || chart.config), `${t.id} instantiates cleanly with theme "${theme}"`);
    }
  }

  // =========================================================================
  // 5. Preview HTML Structure, Breadcrumb & Cognitive Rules
  // =========================================================================
  console.log('\n🌐 5. Preview HTML Standard Layout & Cognitive Cards:');
  for (const t of LOT3_TEMPLATES) {
    const prevFile = path.join(ROOT, 'template', t.category, t.id, 'preview.html');
    assert(fs.existsSync(prevFile), `${t.id} preview.html exists`);

    const content = fs.readFileSync(prevFile, 'utf-8');
    assert(content.includes('class="breadcrumb"'), `${t.id} preview has breadcrumb`);
    assert(content.includes('← kit-charts'), `${t.id} preview breadcrumb links back to kit-charts`);
    assert(content.includes('id="themeSelector"'), `${t.id} preview has themeSelector`);
    assert(content.includes('id="chartContainer"'), `${t.id} preview has chartContainer`);
    assert(content.includes('id="cognitiveRulesCard"'), `${t.id} preview has cognitiveRulesCard`);
    assert(
      content.includes("Quand l'utiliser") && content.includes("Quand NE PAS l'utiliser"),
      `${t.id} preview cognitiveRulesCard has strict usage rules`
    );
    assert(!content.includes('<aside') && !content.includes('sidebar-panel'), `${t.id} preview has no sidebars (ISO single column)`);
    assert(!content.includes('math-card') && !content.includes('math-formula'), `${t.id} preview contains NO math cards`);
  }

  console.log(`\n======================================================`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  if (failureMessages.length > 0) {
    console.log(`Failures:`);
    failureMessages.forEach(m => console.log(`  - ${m}`));
  }
  console.log(`======================================================\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 ALL LOT 3 (P2) VERIFICATIONS PASSED SUCCESSFULLY WITH 100% CONFORMANCE!\n');
    process.exit(0);
  }
}

runLot3Verification().catch(err => {
  console.error('Fatal Verification Error:', err);
  process.exit(1);
});
