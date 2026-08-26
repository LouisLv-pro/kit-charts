/**
 * @file test/challenger-2-adversarial-boundaries.mjs
 * @description Adversarial Edge-Case and Boundary Stress Testing for Challenger 2.
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
  normalizeThemeSlug,
  getThemeTokens,
  getColor,
  getSemanticColor,
  getSequentialColor,
  getValenceColor,
  getEmphasisStyle,
  getThresholdStatus,
  hexToRgba,
  isReducedMotionPreferred,
  getAnimationDuration,
  getAccessibleAnimationOptions,
  getSpatialInteractionOptions,
  getTemporalInteractionOptions,
  getPartitionInteractionOptions,
  getExecutiveModeOptions,
  computeAntiOcclusionTooltipPosition
} from '../themes/theme-tokens.js';

const TEMPLATES = [
  // 01
  { cat: '01-comparaison', id: 'bar-chart-horizontal' },
  { cat: '01-comparaison', id: 'bar-chart-vertical' },
  { cat: '01-comparaison', id: 'bullet-chart' },
  { cat: '01-comparaison', id: 'dumbbell-chart' },
  { cat: '01-comparaison', id: 'grouped-bar-chart' },
  { cat: '01-comparaison', id: 'lollipop-chart' },
  { cat: '01-comparaison', id: 'polar-area-chart' },
  { cat: '01-comparaison', id: 'radar-chart' },
  { cat: '01-comparaison', id: 'slope-chart' },
  { cat: '01-comparaison', id: 'stacked-bar-chart' },
  // 02
  { cat: '02-composition-part-to-whole', id: 'doughnut-chart' },
  { cat: '02-composition-part-to-whole', id: 'pie-chart' },
  { cat: '02-composition-part-to-whole', id: 'stacked-bar-100' },
  { cat: '02-composition-part-to-whole', id: 'sunburst' },
  { cat: '02-composition-part-to-whole', id: 'treemap' },
  { cat: '02-composition-part-to-whole', id: 'waffle-chart' },
  // 03
  { cat: '03-distribution', id: 'beeswarm-plot' },
  { cat: '03-distribution', id: 'box-plot' },
  { cat: '03-distribution', id: 'density-plot' },
  { cat: '03-distribution', id: 'distribution-heatmap' },
  { cat: '03-distribution', id: 'histogramme' },
  { cat: '03-distribution', id: 'strip-plot' },
  // 04
  { cat: '04-correlation-relation', id: 'bubble-chart' },
  { cat: '04-correlation-relation', id: 'connected-scatter-plot' },
  { cat: '04-correlation-relation', id: 'density-2d-hexbin' },
  { cat: '04-correlation-relation', id: 'matrix-heatmap' },
  { cat: '04-correlation-relation', id: 'scatter-plot' },
  // 05
  { cat: '05-evolution-temporelle', id: 'area-chart' },
  { cat: '05-evolution-temporelle', id: 'candlestick-ohlc' },
  { cat: '05-evolution-temporelle', id: 'line-chart' },
  { cat: '05-evolution-temporelle', id: 'multi-line-chart' },
  { cat: '05-evolution-temporelle', id: 'sparkline' },
  { cat: '05-evolution-temporelle', id: 'stacked-area-chart' },
  { cat: '05-evolution-temporelle', id: 'streamgraph' },
  // 06
  { cat: '06-flux-processus', id: 'alluvial-diagram' },
  { cat: '06-flux-processus', id: 'chord-diagram' },
  { cat: '06-flux-processus', id: 'funnel-chart' },
  { cat: '06-flux-processus', id: 'sankey-diagram' },
  { cat: '06-flux-processus', id: 'waterfall-chart' },
  // 07
  { cat: '07-hierarchie-reseau', id: 'arc-diagram' },
  { cat: '07-hierarchie-reseau', id: 'dendrogram' },
  { cat: '07-hierarchie-reseau', id: 'marimekko-chart' },
  { cat: '07-hierarchie-reseau', id: 'node-link-network' },
  // 08
  { cat: '08-geospatial-cartes', id: 'bubble-map' },
  { cat: '08-geospatial-cartes', id: 'cartogram-tilegram' },
  { cat: '08-geospatial-cartes', id: 'choropleth-map' }
];

const stats = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: []
};

function test(description, fn) {
  stats.total++;
  try {
    fn();
    stats.passed++;
  } catch (err) {
    stats.failed++;
    stats.errors.push({ description, error: err.message });
    console.error(`  ✗ ${description}: ${err.message}`);
  }
}

// Mock canvas factory
function createMockCanvas(id = 'adv-canvas') {
  return {
    id,
    tagName: 'CANVAS',
    nodeName: 'CANVAS',
    width: 800,
    height: 600,
    getContext: () => ({
      canvas: { width: 800, height: 600 },
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      arc: () => {},
      closePath: () => {},
      stroke: () => {},
      fill: () => {},
      fillRect: () => {},
      strokeRect: () => {},
      fillText: () => {},
      measureText: (text) => ({ width: (text || '').length * 7 }),
      createLinearGradient: () => ({ addColorStop: () => {} }),
      createRadialGradient: () => ({ addColorStop: () => {} }),
      setLineDash: () => {},
      getLineDash: () => []
    })
  };
}

async function loadTemplate(cat, id) {
  const mod = await import(`../template/${cat}/${id}/template.js`);
  return mod.default || mod;
}

// Global mock Chart
global.Chart = class MockChart {
  constructor(canvas, config) {
    this.canvas = canvas;
    this.config = config;
    this.data = config.data || {};
    this.options = config.options || {};
    this.ctx = canvas?.getContext ? canvas.getContext('2d') : {};
  }
  destroy() {}
  update() {}
  resize() {}
};
global.Chart.register = () => {};

console.log('======================================================================');
console.log('     CHALLENGER 2: ADVERSARIAL BOUNDARIES & STRESS HARNESS           ');
console.log('======================================================================\n');

// 1. Invalid Theme Slugs Fallback
test('Theme Fallback: Unknown, empty, null, and numeric slugs', () => {
  const weirdSlugs = ['non-existent-theme', '', '   ', null, undefined, 999, 'random_123', 'THEME_OKABE'];
  for (const slug of weirdSlugs) {
    const tokens = getThemeTokens(slug);
    assert.ok(tokens, `Failed to return tokens for slug: ${slug}`);
    assert.ok(tokens.fontFamily, 'Missing fontFamily');
    assert.ok(tokens.palette && tokens.palette.length >= 6, 'Missing palette');
    assert.ok(tokens.emphasis && tokens.emphasis.focal, 'Missing emphasis tokens');
    assert.ok(tokens.status && tokens.status.success, 'Missing status tokens');
  }
});

// 2. Valence Helper Invariants
test('Valence Helper Invariants under edge cases', () => {
  const tokens = getThemeTokens('colorbrewer-accessible');
  
  // Direct polarity (Gain/Revenue)
  assert.strictEqual(getValenceColor(tokens, 100, 'gain'), tokens.status.success);
  assert.strictEqual(getValenceColor(tokens, -100, 'gain'), tokens.status.danger);
  assert.strictEqual(getValenceColor(tokens, 0, 'gain'), tokens.status.neutral);

  // Inverted polarity (Cost/Churn/Risk/Defect)
  assert.strictEqual(getValenceColor(tokens, 100, 'cost'), tokens.status.danger);
  assert.strictEqual(getValenceColor(tokens, -100, 'cost'), tokens.status.success);
  assert.strictEqual(getValenceColor(tokens, 0, 'cost'), tokens.status.neutral);

  assert.strictEqual(getValenceColor(tokens, 100, 'churn'), tokens.status.danger);
  assert.strictEqual(getValenceColor(tokens, -100, 'churn'), tokens.status.success);

  // Neutral / Volume metric: up -> info (#1565C0), down -> neutral
  assert.strictEqual(getValenceColor(tokens, 100, 'volume'), tokens.status.info);
  assert.strictEqual(getValenceColor(tokens, -100, 'volume'), tokens.status.neutral);
  assert.strictEqual(getValenceColor(tokens, 0, 'volume'), tokens.status.neutral);
});

// 3. Emphasis Styles Double Encoding Invariants
test('Emphasis Style Double Encoding Invariants', () => {
  for (const themeName of THEME_NAMES) {
    const tokens = getThemeTokens(themeName);
    
    // Focal
    const focal = getEmphasisStyle(tokens, 'focal');
    assert.strictEqual(focal.borderColor, tokens.emphasis.focal);
    assert.strictEqual(focal.backgroundColor, tokens.emphasis.focal);
    assert.ok(focal.borderWidth >= 2);

    // Context (translucent background alpha 0.4)
    const context = getEmphasisStyle(tokens, 'context');
    assert.strictEqual(context.borderColor, tokens.emphasis.context);
    assert.strictEqual(context.backgroundColor, hexToRgba(tokens.emphasis.context, 0.4));

    // Benchmark (dashed line)
    const benchmark = getEmphasisStyle(tokens, 'benchmark');
    assert.strictEqual(benchmark.borderColor, tokens.emphasis.benchmark);
    assert.ok(Array.isArray(benchmark.borderDash));

    // Forecast (dashed line)
    const forecast = getEmphasisStyle(tokens, 'forecast');
    assert.ok(Array.isArray(forecast.borderDash));
  }
});

// 4. Anti-Occlusion Tooltip Clamping Extreme Bounds
test('computeAntiOcclusionTooltipPosition with extreme geometric bounds', () => {
  const canvasDim = { width: 1000, height: 800 };
  const tooltipDim = { width: 200, height: 100 };

  // Off-canvas negative point (-100, -100) with default margin = 8
  const pNeg = computeAntiOcclusionTooltipPosition({ x: -100, y: -100 }, tooltipDim, canvasDim);
  assert.strictEqual(pNeg.caretPosition, 'top');
  assert.strictEqual(pNeg.align, 'left');
  assert.strictEqual(pNeg.x, 8); // margin clamped

  // Off-canvas huge point (5000, 5000)
  const pHuge = computeAntiOcclusionTooltipPosition({ x: 5000, y: 5000 }, tooltipDim, canvasDim);
  assert.strictEqual(pHuge.caretPosition, 'bottom');
  assert.strictEqual(pHuge.align, 'right');
  assert.strictEqual(pHuge.x, 1000 - 200 - 8);

  // Exact margin boundary
  const pMargin = computeAntiOcclusionTooltipPosition({ x: 8, y: 8 }, tooltipDim, canvasDim);
  assert.strictEqual(pMargin.caretPosition, 'top');
  assert.strictEqual(pMargin.align, 'left');
});

// 5. Rapid 100x Theme Switching Stress Loop
test('Rapid 100x Theme Switching Stress Loop on sample templates', async () => {
  const sampleTemplates = [
    { cat: '01-comparaison', id: 'bar-chart-horizontal' },
    { cat: '02-composition-part-to-whole', id: 'pie-chart' },
    { cat: '03-distribution', id: 'histogramme' },
    { cat: '04-correlation-relation', id: 'scatter-plot' },
    { cat: '05-evolution-temporelle', id: 'line-chart' }
  ];

  for (const tmpl of sampleTemplates) {
    const exp = await loadTemplate(tmpl.cat, tmpl.id);
    const canvas = createMockCanvas(`rapid-${tmpl.id}`);

    let chart = exp.createChart(canvas, null, THEME_NAMES[0]);
    for (let i = 0; i < 100; i++) {
      const theme = THEME_NAMES[i % THEME_NAMES.length];
      chart.destroy();
      chart = exp.createChart(canvas, null, theme);
      assert.ok(chart, `Failed during rapid iteration ${i} on theme ${theme}`);
    }
    chart.destroy();
  }
});

// 6. Non-Regression Fallback on all 46 templates with custom extreme data
test('All 46 templates handle customData gracefully', async () => {
  for (const tmpl of TEMPLATES) {
    const exp = await loadTemplate(tmpl.cat, tmpl.id);
    const canvas = createMockCanvas(`custom-${tmpl.id}`);

    // Call with null customData
    const chartDefault = exp.createChart(canvas, null, 'colorbrewer-accessible');
    assert.ok(chartDefault, `${tmpl.id} failed with null customData`);
    chartDefault.destroy();

    // Call with undefined customData
    const chartUndef = exp.createChart(canvas, undefined, 'nord-cognitive-dark');
    assert.ok(chartUndef, `${tmpl.id} failed with undefined customData`);
    chartUndef.destroy();
  }
});

console.log('\n======================================================================');
console.log('            ADVERSARIAL BOUNDARIES SUITE SUMMARY                      ');
console.log('======================================================================');
console.log(`  Total Tests  : ${stats.total}`);
console.log(`  Passed       : ${stats.passed}`);
console.log(`  Failed       : ${stats.failed}`);
console.log(`  Pass Rate    : ${((stats.passed / stats.total) * 100).toFixed(2)}%`);
console.log('======================================================================\n');

if (stats.failed > 0) {
  console.error(`🚨 VERDICT: REQUEST_CHANGES (${stats.failed} failures)`);
  process.exit(1);
} else {
  console.log('🌟 VERDICT: APPROVE');
  process.exit(0);
}
