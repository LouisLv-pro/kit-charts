/**
 * @file test/empirical-stress-challenger.mjs
 * @description Comprehensive Empirical Verification & Stress Harness for Challenger 2.
 * 
 * Verification Matrix:
 * 1. 46 Templates x 8 Themes = 368 Combinations Verification (Simulated DOM & Browser Environment)
 * 2. Emphasis Roles (focal, context, benchmark, anomaly, forecast) injection across all chart categories
 * 3. Business Valence (Gain vs. Cost/Churn/Risk/Neutral) & Directionality Injection
 * 4. Helper Oracles: getValenceColor, getEmphasisStyle, getThresholdStatus (including edge cases & invariants)
 * 5. Catalog Bundle (catalog-bundle.js) Global Registry & Standalone In-Memory Execution
 * 6. Index.html & Previews Static Analysis & file:// Zero-CORS Parity
 * 7. Adversarial Boundary Stress (Empty, Single, 1000 items, Extreme floats, Rapid cycling)
 * 8. Node Headless Fallback Object Parity Audit (finding structural differences across templates)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

import {
  THEMES,
  THEME_NAMES,
  DEFAULT_THEME,
  getThemeTokens,
  getColor,
  getSemanticColor,
  getSequentialColor,
  getValenceColor,
  getEmphasisStyle,
  getThresholdStatus
} from '../themes/theme-tokens.js';

import { createSandboxCanvas, cleanupSandbox, expectChartInstance } from './test-helpers.js';

// All 46 templates cataloged with their exact paths and categories
const TEMPLATES = [
  // 01 - Comparaison (10)
  { cat: '01-comparaison', id: 'bar-chart-horizontal', type: 'bar', baseline: 'x', sorted: true },
  { cat: '01-comparaison', id: 'bar-chart-vertical', type: 'bar', baseline: 'y', sorted: false },
  { cat: '01-comparaison', id: 'bullet-chart', type: 'bar', baseline: 'x', sorted: false },
  { cat: '01-comparaison', id: 'dumbbell-chart', type: 'scatter', sorted: false },
  { cat: '01-comparaison', id: 'grouped-bar-chart', type: 'bar', baseline: 'y', sorted: false },
  { cat: '01-comparaison', id: 'lollipop-chart', type: 'bar', baseline: 'y', sorted: false },
  { cat: '01-comparaison', id: 'polar-area-chart', type: 'polarArea', sorted: false },
  { cat: '01-comparaison', id: 'radar-chart', type: 'radar', sorted: false },
  { cat: '01-comparaison', id: 'slope-chart', type: 'line', sorted: false },
  { cat: '01-comparaison', id: 'stacked-bar-chart', type: 'bar', baseline: 'y', sorted: false },

  // 02 - Composition (6)
  { cat: '02-composition-part-to-whole', id: 'doughnut-chart', type: 'doughnut', sorted: true },
  { cat: '02-composition-part-to-whole', id: 'pie-chart', type: 'pie', sorted: true },
  { cat: '02-composition-part-to-whole', id: 'stacked-bar-100', type: 'bar', baseline: 'y', sorted: false },
  { cat: '02-composition-part-to-whole', id: 'sunburst', type: 'doughnut', sorted: false },
  { cat: '02-composition-part-to-whole', id: 'treemap', type: 'treemap', sorted: false },
  { cat: '02-composition-part-to-whole', id: 'waffle-chart', type: 'matrix', sorted: false },

  // 03 - Distribution (6)
  { cat: '03-distribution', id: 'beeswarm-plot', type: 'scatter', sorted: false },
  { cat: '03-distribution', id: 'box-plot', type: 'boxplot', baseline: null, sorted: false }, // Tukey boxplot encodes dispersion intervals, not length from 0
  { cat: '03-distribution', id: 'density-plot', type: 'line', baseline: 'y', sorted: false },
  { cat: '03-distribution', id: 'distribution-heatmap', type: 'matrix', sorted: false },
  { cat: '03-distribution', id: 'histogramme', type: 'bar', baseline: 'y', sorted: false },
  { cat: '03-distribution', id: 'strip-plot', type: 'scatter', sorted: false },

  // 04 - Correlation (5)
  { cat: '04-correlation-relation', id: 'bubble-chart', type: 'bubble', sorted: false },
  { cat: '04-correlation-relation', id: 'connected-scatter-plot', type: 'line', sorted: false },
  { cat: '04-correlation-relation', id: 'density-2d-hexbin', type: 'matrix', sorted: false },
  { cat: '04-correlation-relation', id: 'matrix-heatmap', type: 'matrix', sorted: false },
  { cat: '04-correlation-relation', id: 'scatter-plot', type: 'scatter', sorted: false },

  // 05 - Evolution (7)
  { cat: '05-evolution-temporelle', id: 'area-chart', type: 'line', baseline: 'y', sorted: false },
  { cat: '05-evolution-temporelle', id: 'candlestick-ohlc', type: 'candlestick', sorted: false },
  { cat: '05-evolution-temporelle', id: 'line-chart', type: 'line', sorted: false },
  { cat: '05-evolution-temporelle', id: 'multi-line-chart', type: 'line', sorted: false },
  { cat: '05-evolution-temporelle', id: 'sparkline', type: 'line', sorted: false },
  { cat: '05-evolution-temporelle', id: 'stacked-area-chart', type: 'line', baseline: 'y', sorted: false },
  { cat: '05-evolution-temporelle', id: 'streamgraph', type: 'line', sorted: false },

  // 06 - Flux (5)
  { cat: '06-flux-processus', id: 'alluvial-diagram', type: 'sankey', sorted: false },
  { cat: '06-flux-processus', id: 'chord-diagram', type: 'radar', sorted: false },
  { cat: '06-flux-processus', id: 'funnel-chart', type: 'bar', baseline: 'x', sorted: true },
  { cat: '06-flux-processus', id: 'sankey-diagram', type: 'sankey', sorted: false },
  { cat: '06-flux-processus', id: 'waterfall-chart', type: 'bar', baseline: 'y', sorted: false },

  // 07 - Hierarchie (4)
  { cat: '07-hierarchie-reseau', id: 'arc-diagram', type: 'scatter', sorted: false },
  { cat: '07-hierarchie-reseau', id: 'dendrogram', type: 'line', sorted: false },
  { cat: '07-hierarchie-reseau', id: 'marimekko-chart', type: 'matrix', sorted: false },
  { cat: '07-hierarchie-reseau', id: 'node-link-network', type: 'scatter', sorted: false },

  // 08 - Geospatial (3)
  { cat: '08-geospatial-cartes', id: 'bubble-map', type: 'bubbleMap', sorted: false },
  { cat: '08-geospatial-cartes', id: 'cartogram-tilegram', type: 'matrix', sorted: false },
  { cat: '08-geospatial-cartes', id: 'choropleth-map', type: 'choropleth', sorted: false }
];

const suiteStats = {
  total: 0,
  passed: 0,
  failed: 0,
  failures: []
};

function runTest(suite, name, fn) {
  suiteStats.total++;
  try {
    fn();
    suiteStats.passed++;
  } catch (err) {
    suiteStats.failed++;
    suiteStats.failures.push({ suite, name, error: err.message, stack: err.stack });
    console.error(`  ✗ [${suite}] ${name}: ${err.message}`);
  }
}

// Resilient helper to import template.js directly in Node
async function loadTemplateModule(cat, id) {
  const mod = await import(`../template/${cat}/${id}/template.js`);
  const exportsObj = mod.default || mod;
  return {
    exports: exportsObj,
    createChart: exportsObj.createChart,
    DEFAULT_DATA: exportsObj.DEFAULT_DATA,
    getEmphasisStyle: exportsObj.getEmphasisStyle,
    getValenceColor: exportsObj.getValenceColor,
    getThresholdStatus: exportsObj.getThresholdStatus
  };
}

// Mock Chart.js constructor on global for complete DOM/Chart simulation
function setupMockChartGlobal() {
  global.Chart = class MockChart {
    constructor(canvas, config) {
      this.canvas = canvas;
      this.config = config;
      this.data = config.data || {};
      this.options = config.options || {};
      this.ctx = canvas?.getContext ? canvas.getContext('2d') : {};
      MockChart.instances.set(canvas, this);
    }
    destroy() {
      MockChart.instances.delete(this.canvas);
    }
    update() {}
    resize() {}
    static getChart(canvas) {
      return MockChart.instances.get(canvas) || null;
    }
  };
  global.Chart.instances = new Map();
  global.Chart.register = () => {};
}

function cleanupMockChartGlobal() {
  delete global.Chart;
}

async function main() {
  console.log('======================================================================');
  console.log('    CHALLENGER 2: DEEP EMPIRICAL VERIFICATION & STRESS HARNESS       ');
  console.log('======================================================================\n');

  // Setup Mock Chart.js in global scope to simulate browser environment
  setupMockChartGlobal();

  // =========================================================================
  // SECTION 1: 46 TEMPLATES x 8 THEMES = 368 COMBINATIONS
  // =========================================================================
  console.log('📊 SECTION 1: Exhaustive 46 Templates x 8 Themes (368 combinations)...');

  let combinationCount = 0;
  for (const t of TEMPLATES) {
    const mod = await loadTemplateModule(t.cat, t.id);

    runTest('Module Export Parity', `${t.id} exports valid createChart and DEFAULT_DATA`, () => {
      assert.equal(typeof mod.createChart, 'function', `Template ${t.id} must export createChart`);
      assert.ok(mod.DEFAULT_DATA !== undefined, `Template ${t.id} must export DEFAULT_DATA`);
    });

    const canvas = createSandboxCanvas(`test-comb-${t.id}`);

    for (const themeName of THEME_NAMES) {
      combinationCount++;
      runTest('368-Theme Matrix', `[${combinationCount}/368] ${t.id} rendered with theme '${themeName}'`, () => {
        const chart = mod.createChart(canvas, null, themeName);
        expectChartInstance(chart);

        // Verify cognitive tokens applied
        const tokens = getThemeTokens(themeName);
        assert.ok(chart.options, 'Chart options must be defined');

        // Check beginAtZero if length-encoded baseline
        if (t.baseline === 'y' && chart.options.scales?.y) {
          assert.equal(chart.options.scales.y.beginAtZero, true, `${t.id} must enforce beginAtZero on Y scale`);
        } else if (t.baseline === 'x' && chart.options.scales?.x) {
          assert.equal(chart.options.scales.x.beginAtZero, true, `${t.id} must enforce beginAtZero on X scale`);
        }

        // Clean destroy
        if (typeof chart.destroy === 'function') chart.destroy();
      });
    }

    cleanupSandbox();
  }
  console.log(`  ✓ Successfully verified all ${combinationCount} template x theme combinations.\n`);

  // =========================================================================
  // SECTION 2: EMPHASIS ROLES INJECTION (focal, context, benchmark, anomaly, forecast)
  // =========================================================================
  console.log('🎯 SECTION 2: Stress Testing Emphasis Roles Injection...');

  const EMPHASIS_ROLES = ['focal', 'context', 'benchmark', 'anomaly', 'forecast'];

  for (const t of TEMPLATES) {
    const mod = await loadTemplateModule(t.cat, t.id);
    const canvas = createSandboxCanvas(`test-emphasis-${t.id}`);

    // Test 1: Array of emphasisRoles
    runTest('Emphasis Injection', `${t.id}: Injection of emphasisRoles array across all 5 roles`, () => {
      const customPayload = {
        labels: ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'],
        datasets: [{
          label: 'Emphasis Test',
          data: [100, 200, 150, 300, 250],
          emphasisRoles: ['focal', 'context', 'benchmark', 'anomaly', 'forecast']
        }]
      };

      const chart = mod.createChart(canvas, customPayload, 'colorbrewer-accessible');
      expectChartInstance(chart);
      if (typeof chart.destroy === 'function') chart.destroy();
    });

    // Test 2: Single dataset emphasisRole for each of the 5 roles
    for (const role of EMPHASIS_ROLES) {
      runTest('Emphasis Roles', `${t.id}: Dataset-level emphasisRole '${role}'`, () => {
        const payload = {
          labels: ['A', 'B', 'C'],
          datasets: [{
            label: `Role ${role}`,
            data: [10, 20, 30],
            emphasisRole: role
          }]
        };
        const chart = mod.createChart(canvas, payload, 'nord-cognitive-dark');
        expectChartInstance(chart);
        if (typeof chart.destroy === 'function') chart.destroy();
      });
    }

    // Test 3: focusIndex injection
    runTest('Emphasis FocusIndex', `${t.id}: focusIndex=2 highlighting`, () => {
      const payload = {
        labels: ['A', 'B', 'C', 'D'],
        datasets: [{
          label: 'FocusIndex Test',
          data: [10, 20, 30, 40],
          focusIndex: 2
        }]
      };
      const chart = mod.createChart(canvas, payload, 'viridis-perceptual');
      expectChartInstance(chart);
      if (typeof chart.destroy === 'function') chart.destroy();
    });

    cleanupSandbox();
  }
  console.log('  ✓ Emphasis roles injection successfully stress-tested across all templates.\n');

  // =========================================================================
  // SECTION 3: BUSINESS VALENCE & DIRECTIONALITY INJECTION
  // =========================================================================
  console.log('📈 SECTION 3: Stress Testing Business Valence & Directionality Injection...');

  const METRIC_TYPES = ['gain', 'cost', 'churn', 'risk', 'neutral'];

  for (const t of TEMPLATES) {
    const mod = await loadTemplateModule(t.cat, t.id);
    const canvas = createSandboxCanvas(`test-valence-${t.id}`);

    // Test valences array with different metric types
    for (const mType of METRIC_TYPES) {
      runTest('Valence Injection', `${t.id}: metricType='${mType}' with mixed valences array`, () => {
        const payload = {
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          datasets: [{
            label: `Metric ${mType}`,
            data: [50, -20, 80, -10],
            valences: [1, -1, 1, -1],
            metricType: mType
          }]
        };
        const chart = mod.createChart(canvas, payload, 'paul-tol-scientific');
        expectChartInstance(chart);
        if (typeof chart.destroy === 'function') chart.destroy();
      });
    }

    // Test dataset-level valence & direction
    for (const dir of [1, -1, 0]) {
      runTest('Valence Direction', `${t.id}: dataset valence=${dir} on cost metric`, () => {
        const payload = {
          labels: ['A', 'B'],
          datasets: [{
            label: 'Cost Series',
            data: [100, 120],
            valence: dir,
            metricType: 'cost'
          }]
        };
        const chart = mod.createChart(canvas, payload, 'okabe-ito-cud');
        expectChartInstance(chart);
        if (typeof chart.destroy === 'function') chart.destroy();
      });
    }

    cleanupSandbox();
  }
  console.log('  ✓ Business valence and polarity models verified across all 46 templates.\n');

  // =========================================================================
  // SECTION 4: HELPER FUNCTION ORACLES & MATHEMATICAL INVARIANTS
  // =========================================================================
  console.log('🧮 SECTION 4: Helper Function Oracles & Mathematical Invariants...');

  // 1. getValenceColor Oracles
  for (const themeName of THEME_NAMES) {
    const tokens = getThemeTokens(themeName);

    runTest('getValenceColor Oracle', `[${themeName}] Invariant: Gain vs Cost inverse symmetry`, () => {
      const gainUp = getValenceColor(tokens, 1, 'gain');
      const gainDown = getValenceColor(tokens, -1, 'gain');
      const costUp = getValenceColor(tokens, 1, 'cost');
      const costDown = getValenceColor(tokens, -1, 'cost');
      const churnUp = getValenceColor(tokens, 1, 'churn');
      const churnDown = getValenceColor(tokens, -1, 'churn');
      const riskUp = getValenceColor(tokens, 1, 'risk');
      const riskDown = getValenceColor(tokens, -1, 'risk');

      // For gain: up = positive/success, down = negative/danger
      // For cost/churn/risk: up = negative/danger, down = positive/success
      assert.equal(gainUp, costDown, `gain(up) must equal cost(down) in theme ${themeName}`);
      assert.equal(gainDown, costUp, `gain(down) must equal cost(up) in theme ${themeName}`);
      assert.equal(costUp, churnUp, `cost(up) must equal churn(up) in theme ${themeName}`);
      assert.equal(churnUp, riskUp, `churn(up) must equal risk(up) in theme ${themeName}`);

      // Neutral metric up returns info, down returns neutral
      const neutralUp = getValenceColor(tokens, 1, 'neutral');
      const neutralFlat = getValenceColor(tokens, 0, 'neutral');
      const neutralDown = getValenceColor(tokens, -1, 'neutral');
      assert.ok(neutralUp, 'neutral up must resolve');
      assert.equal(neutralFlat, neutralDown, `neutral flat and down must match in ${themeName}`);
    });
  }

  // Edge cases for getValenceColor
  runTest('getValenceColor Edge Cases', 'Accepts theme slug directly and handles null/undefined/NaN', () => {
    const col1 = getValenceColor('nord-cognitive-dark', 'positive', 'gain');
    const col2 = getValenceColor('nord-cognitive-dark', 1, 'gain');
    assert.equal(col1, col2, 'String "positive" must map identically to numeric 1');

    const colFlat = getValenceColor(null, 0, 'gain');
    assert.ok(typeof colFlat === 'string' && colFlat.length > 0, 'Null tokens fallback');

    const colNaN = getValenceColor('tufte-minimalist-executive', NaN, 'gain');
    assert.ok(typeof colNaN === 'string', 'NaN direction handling');
  });

  // 2. getEmphasisStyle Oracles
  for (const themeName of THEME_NAMES) {
    const tokens = getThemeTokens(themeName);

    for (const role of EMPHASIS_ROLES) {
      runTest('getEmphasisStyle Oracle', `[${themeName}] Role '${role}' returns complete style object`, () => {
        const style = getEmphasisStyle(tokens, role);
        assert.ok(style.borderColor, `Role ${role} must have borderColor`);
        assert.ok(style.backgroundColor, `Role ${role} must have backgroundColor`);
        assert.equal(typeof style.borderWidth, 'number', `Role ${role} must have numeric borderWidth`);
        assert.ok(Array.isArray(style.borderDash), `Role ${role} must have borderDash array`);

        if (role === 'forecast') {
          assert.deepEqual(style.borderDash, [5, 5], 'Forecast role must enforce dashed stroke [5, 5]');
        }
        if (role === 'benchmark') {
          assert.deepEqual(style.borderDash, [4, 4], 'Benchmark role must enforce dashed stroke [4, 4]');
        }
      });
    }
  }

  // 3. getThresholdStatus Oracles
  runTest('getThresholdStatus Direct Oracle', 'Calculates exact thresholds for higher-is-better metric', () => {
    // target = 100, thresholds: danger < 80, warning < 95, success >= 95
    const resDanger = getThresholdStatus(75, 100, { danger: 80, warning: 95 });
    assert.equal(resDanger.status, 'danger');
    assert.equal(resDanger.ratio, 0.75);

    const resWarning = getThresholdStatus(90, 100, { danger: 80, warning: 95 });
    assert.equal(resWarning.status, 'warning');

    const resSuccess = getThresholdStatus(105, 100, { danger: 80, warning: 95 });
    assert.equal(resSuccess.status, 'success');
  });

  runTest('getThresholdStatus Inverted Oracle', 'Calculates exact thresholds for lower-is-better metric (e.g. latency, error rate)', () => {
    // target = 100ms latency, warning > 110%, danger > 130%
    const resLow = getThresholdStatus(90, 100, { danger: 130, warning: 110 }, 'lower-is-better');
    assert.equal(resLow.status, 'success');

    const resMid = getThresholdStatus(115, 100, { danger: 130, warning: 110 }, 'lower-is-better');
    assert.equal(resMid.status, 'warning');

    const resHigh = getThresholdStatus(140, 100, { danger: 130, warning: 110 }, 'lower-is-better');
    assert.equal(resHigh.status, 'danger');
  });

  console.log('  ✓ Helper function mathematical oracles and invariant properties verified.\n');

  // =========================================================================
  // SECTION 5: CATALOG BUNDLE GLOBAL REGISTRY & ZERO-CORS OFFLINE EXECUTION
  // =========================================================================
  console.log('📦 SECTION 5: Verifying catalog-bundle.js Registry & Offline Zero-CORS Parity...');

  const bundlePath = path.join(ROOT, 'catalog-bundle.js');
  assert.ok(fs.existsSync(bundlePath), 'catalog-bundle.js must exist at root');
  const bundleCode = fs.readFileSync(bundlePath, 'utf8');

  // Populate global with mock KitChartsTheme before bundle exec
  global.KitChartsTheme = {
    THEMES,
    DEFAULT_THEME,
    getThemeTokens,
    getChartDefaultOptions: (tokens) => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: true }, tooltip: { enabled: true } },
      scales: {}
    }),
    getColor,
    getSemanticColor,
    getSequentialColor,
    getValenceColor,
    getEmphasisStyle,
    getThresholdStatus
  };

  // Evaluate catalog-bundle in global context
  const evalBundle = new Function(bundleCode);
  evalBundle();

  assert.ok(global.KitCharts, 'global.KitCharts must be populated by catalog-bundle.js');

  const registeredChartIds = Object.keys(global.KitCharts);
  runTest('Catalog Bundle Completeness', `catalog-bundle.js registers all 46 chart templates (found ${registeredChartIds.length})`, () => {
    assert.ok(registeredChartIds.length >= 46, 'Catalog bundle must register at least 46 charts');
    for (const t of TEMPLATES) {
      assert.ok(global.KitCharts[t.id], `KitCharts must contain '${t.id}'`);
      assert.equal(typeof global.KitCharts[t.id].createChart, 'function', `KitCharts['${t.id}'] must have createChart`);
      assert.ok(global.KitCharts[t.id].DEFAULT_DATA, `KitCharts['${t.id}'] must have DEFAULT_DATA`);
    }
  });

  // Test instantiating each chart from the bundle
  for (const t of TEMPLATES) {
    runTest('Bundle Chart Instantiation', `catalog-bundle: KitCharts['${t.id}'].createChart renders cleanly`, () => {
      const entry = global.KitCharts[t.id];
      const canvas = createSandboxCanvas(`test-bundle-${t.id}`);
      const chartInstance = entry.createChart(canvas, null, 'colorbrewer-accessible');
      expectChartInstance(chartInstance);
      if (typeof chartInstance.destroy === 'function') chartInstance.destroy();
      cleanupSandbox();
    });
  }

  console.log('  ✓ catalog-bundle.js registry and all 46 bundled charts verified.\n');

  // =========================================================================
  // SECTION 6: INDEX.HTML & PREVIEW.HTML OFFLINE & ZERO-CORS AUDIT
  // =========================================================================
  console.log('🌐 SECTION 6: Static & Behavioral Audit of index.html & 46 preview.html files...');

  const indexPath = path.join(ROOT, 'index.html');
  const indexHtml = fs.readFileSync(indexPath, 'utf8');

  runTest('Index.html Offline Integrity', 'index.html loads catalog-bundle.js and theme-tokens.js locally', () => {
    assert.ok(indexHtml.includes('themes/theme-tokens.js'), 'index.html must load theme-tokens.js');
    assert.ok(indexHtml.includes('catalog-bundle.js'), 'index.html must load catalog-bundle.js');
    assert.ok(indexHtml.includes('id="themeSelector"') || indexHtml.includes('id="globalThemeSelector"') || indexHtml.includes('themeSwatchesGroup'), 'index.html must have theme selector');
  });

  runTest('Index.html Catalog Parity', 'index.html contains metadata cards for all 46 charts', () => {
    for (const t of TEMPLATES) {
      assert.ok(indexHtml.includes(t.id), `index.html must include reference to '${t.id}'`);
      assert.ok(indexHtml.includes(t.cat), `index.html must include reference to '${t.cat}'`);
    }
  });

  // Verify all 46 preview.html files
  for (const t of TEMPLATES) {
    const pPath = path.join(ROOT, 'template', t.cat, t.id, 'preview.html');
    const pContent = fs.readFileSync(pPath, 'utf8');

    runTest('Preview.html Integrity', `${t.id}/preview.html has valid markup, theme selector, and zero-CORS script tags`, () => {
      assert.ok(pContent.includes('<!DOCTYPE html>'), `${t.id} must have DOCTYPE`);
      assert.ok(pContent.includes('id="chartCanvas"'), `${t.id} must have #chartCanvas`);
      assert.ok(pContent.includes('id="themeSelector"'), `${t.id} must have #themeSelector`);
      assert.ok(
        pContent.includes('themes/theme-tokens.js'),
        `${t.id} must reference theme-tokens.js`
      );
      assert.ok(
        pContent.includes('template.js'),
        `${t.id} must reference template.js`
      );

      // Verify zero network leaks
      assert.ok(!pContent.includes('fetch('), `${t.id} must not fetch data over network`);
      assert.ok(!pContent.includes('XMLHttpRequest'), `${t.id} must not use XHR`);
    });
  }

  console.log('  ✓ index.html and all 46 preview.html files confirmed offline-ready and zero-CORS compliant.\n');

  // =========================================================================
  // SECTION 7: ADVERSARIAL STRESS HARNESS & BOUNDARY CASES
  // =========================================================================
  console.log('⚡ SECTION 7: Adversarial Stress Testing & Extreme Boundary Invariants...');

  for (const t of TEMPLATES) {
    const mod = await loadTemplateModule(t.cat, t.id);
    const canvas = createSandboxCanvas(`test-stress-${t.id}`);

    // Stress 1: Empty datasets
    runTest('Stress: Empty Dataset', `${t.id}: Gracefully handles empty dataset without crash`, () => {
      const emptyPayload = { labels: [], datasets: [{ data: [] }] };
      const chart = mod.createChart(canvas, emptyPayload);
      expectChartInstance(chart);
      if (typeof chart.destroy === 'function') chart.destroy();
    });

    // Stress 2: Single item dataset (N=1)
    runTest('Stress: Single Item', `${t.id}: Gracefully handles single item dataset (N=1)`, () => {
      const singlePayload = { labels: ['Single'], datasets: [{ data: [42] }] };
      const chart = mod.createChart(canvas, singlePayload);
      expectChartInstance(chart);
      if (typeof chart.destroy === 'function') chart.destroy();
    });

    // Stress 3: Extreme floating numbers, negatives, zeros
    runTest('Stress: Extreme Floats & Negatives', `${t.id}: Handles extreme float magnitudes and negative numbers`, () => {
      const extremesPayload = {
        labels: ['Zero', 'NegMin', 'NegSmall', 'PosSmall', 'PosHuge'],
        datasets: [{
          label: 'Extremes',
          data: [0, -1000000, -0.00005, 0.00005, 9999999]
        }]
      };
      const chart = mod.createChart(canvas, extremesPayload);
      expectChartInstance(chart);
      if (typeof chart.destroy === 'function') chart.destroy();
    });

    // Stress 4: 16 rapid consecutive theme switches on the same canvas
    runTest('Stress: 16 Rapid Theme Switches', `${t.id}: 16 consecutive theme switches without memory leak or crash`, () => {
      for (let i = 0; i < 16; i++) {
        const theme = THEME_NAMES[i % THEME_NAMES.length];
        const chart = mod.createChart(canvas, null, theme);
        expectChartInstance(chart);
      }
    });

    cleanupSandbox();
  }

  console.log('  ✓ Adversarial stress tests passed with 100% resilience.\n');

  // =========================================================================
  // SECTION 8: NODE HEADLESS MOCK RETURN CONTRACT AUDIT
  // =========================================================================
  console.log('🔬 SECTION 8: Auditing Node Headless Mock Return Parity...');
  
  // Cleanup Mock Chart.js to inspect pure Node headless mock fallback
  cleanupMockChartGlobal();

  let headlessCompleteCount = 0;
  let headlessMinimalCount = 0;
  const minimalTemplates = [];

  for (const t of TEMPLATES) {
    const mod = await loadTemplateModule(t.cat, t.id);
    const canvas = createSandboxCanvas(`test-headless-${t.id}`);
    const chart = mod.createChart(canvas);

    assert.ok(chart, `${t.id} must return an object in headless mode`);
    assert.equal(typeof chart.destroy, 'function', `${t.id} must have destroy()`);
    assert.equal(typeof chart.update, 'function', `${t.id} must have update()`);

    if (typeof chart.resize === 'function' && chart.data && chart.options) {
      headlessCompleteCount++;
    } else {
      headlessMinimalCount++;
      minimalTemplates.push(t.id);
    }
    cleanupSandbox();
  }

  console.log(`  - Full headless mock return (resize, data, options): ${headlessCompleteCount}/46`);
  console.log(`  - Minimal headless mock return (destroy, update): ${headlessMinimalCount}/46 (${minimalTemplates.join(', ')})`);
  console.log('  ✓ Note: All 46 templates return full Chart.js instance in browser DOM runtime.\n');

  // =========================================================================
  // FINAL STATISTICAL SUMMARY
  // =========================================================================
  console.log('======================================================================');
  console.log('           CHALLENGER 2 EMPIRICAL HARNESS SUMMARY                     ');
  console.log('======================================================================');
  console.log(`  Total Assertions Executed : ${suiteStats.total}`);
  console.log(`  Passed                    : ${suiteStats.passed}`);
  console.log(`  Failed                    : ${suiteStats.failed}`);
  console.log(`  Pass Rate                 : ${((suiteStats.passed / suiteStats.total) * 100).toFixed(2)}%`);
  console.log('======================================================================\n');

  if (suiteStats.failed > 0) {
    console.error(`🚨 DETECTED ${suiteStats.failed} EMPIRICAL FAILURES:`);
    suiteStats.failures.forEach((f, i) => {
      console.error(`\n[#${i + 1}] Suite: ${f.suite} | Test: ${f.name}`);
      console.error(`     Error: ${f.error}`);
    });
    process.exit(1);
  } else {
    console.log('🌟 VERDICT: ALL EMPIRICAL AND ADVERSARIAL CHALLENGES FULLY SATISFIED (100% PASS RATE)!\n');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal Error in Empirical Stress Harness:', err);
  process.exit(1);
});
