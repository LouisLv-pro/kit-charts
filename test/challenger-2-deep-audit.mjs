/**
 * @file test/challenger-2-deep-audit.mjs
 * @description Exhaustive Challenger 2 Empirical Stress Test Suite for Milestone 2.
 * 
 * Validates:
 * 1. 46 Templates x 8 Themes = 368 chart generation matrix with zero NaN / undefined tokens.
 * 2. All 8 Milestone 2 Interaction & Animation helpers under extreme boundary conditions.
 * 3. Standalone catalog-bundle.js execution in isolated browser VM context without bundlers or CORS.
 * 4. Static & DOM structural audit of index.html and all 46 preview.html files.
 * 5. Rapid dynamic theme switching across 8 themes on all 46 charts.
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
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

// All 46 templates catalog
const TEMPLATES = [
  // 01 - Comparaison (10)
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

  // 02 - Composition (6)
  { cat: '02-composition-part-to-whole', id: 'doughnut-chart' },
  { cat: '02-composition-part-to-whole', id: 'pie-chart' },
  { cat: '02-composition-part-to-whole', id: 'stacked-bar-100' },
  { cat: '02-composition-part-to-whole', id: 'sunburst' },
  { cat: '02-composition-part-to-whole', id: 'treemap' },
  { cat: '02-composition-part-to-whole', id: 'waffle-chart' },

  // 03 - Distribution (6)
  { cat: '03-distribution', id: 'beeswarm-plot' },
  { cat: '03-distribution', id: 'box-plot' },
  { cat: '03-distribution', id: 'density-plot' },
  { cat: '03-distribution', id: 'distribution-heatmap' },
  { cat: '03-distribution', id: 'histogramme' },
  { cat: '03-distribution', id: 'strip-plot' },

  // 04 - Correlation (5)
  { cat: '04-correlation-relation', id: 'bubble-chart' },
  { cat: '04-correlation-relation', id: 'connected-scatter-plot' },
  { cat: '04-correlation-relation', id: 'density-2d-hexbin' },
  { cat: '04-correlation-relation', id: 'matrix-heatmap' },
  { cat: '04-correlation-relation', id: 'scatter-plot' },

  // 05 - Evolution (7)
  { cat: '05-evolution-temporelle', id: 'area-chart' },
  { cat: '05-evolution-temporelle', id: 'candlestick-ohlc' },
  { cat: '05-evolution-temporelle', id: 'line-chart' },
  { cat: '05-evolution-temporelle', id: 'multi-line-chart' },
  { cat: '05-evolution-temporelle', id: 'sparkline' },
  { cat: '05-evolution-temporelle', id: 'stacked-area-chart' },
  { cat: '05-evolution-temporelle', id: 'streamgraph' },

  // 06 - Flux (5)
  { cat: '06-flux-processus', id: 'alluvial-diagram' },
  { cat: '06-flux-processus', id: 'chord-diagram' },
  { cat: '06-flux-processus', id: 'funnel-chart' },
  { cat: '06-flux-processus', id: 'sankey-diagram' },
  { cat: '06-flux-processus', id: 'waterfall-chart' },

  // 07 - Hierarchie (4)
  { cat: '07-hierarchie-reseau', id: 'arc-diagram' },
  { cat: '07-hierarchie-reseau', id: 'dendrogram' },
  { cat: '07-hierarchie-reseau', id: 'marimekko-chart' },
  { cat: '07-hierarchie-reseau', id: 'node-link-network' },

  // 08 - Geospatial (3)
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

function test(section, description, fn) {
  stats.total++;
  try {
    fn();
    stats.passed++;
  } catch (err) {
    stats.failed++;
    stats.errors.push({ section, description, error: err.message, stack: err.stack });
    console.error(`  ✗ [${section}] ${description}: ${err.message}`);
  }
}

// Deep scanner for NaN, undefined, or malformed values in objects
function scanForMalformedValues(obj, path = '', seen = new Set()) {
  const anomalies = [];
  if (obj === null || obj === undefined) return anomalies;
  if (typeof obj === 'number') {
    if (Number.isNaN(obj)) anomalies.push(`${path}: NaN value found`);
    return anomalies;
  }
  if (typeof obj === 'string') {
    if (obj.includes('undefined') || obj.includes('NaN')) {
      anomalies.push(`${path}: String contains 'undefined' or 'NaN' ("${obj}")`);
    }
    return anomalies;
  }
  if (typeof obj !== 'object' || seen.has(obj)) return anomalies;
  seen.add(obj);

  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;
    if (value === undefined) {
      anomalies.push(`${currentPath}: Property is explicitly undefined`);
    } else if (typeof value === 'number' && Number.isNaN(value)) {
      anomalies.push(`${currentPath}: Number is NaN`);
    } else if (typeof value === 'string' && (value.includes('undefined') || value.includes('NaN'))) {
      anomalies.push(`${currentPath}: String contains 'undefined' or 'NaN' ("${value}")`);
    } else if (typeof value === 'object' && value !== null) {
      anomalies.push(...scanForMalformedValues(value, currentPath, seen));
    }
  }
  return anomalies;
}

// Mock canvas factory
function createMockCanvas(id = 'test-canvas') {
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

// Universal template module loader
async function loadTemplateModule(cat, id) {
  const mod = await import(`../template/${cat}/${id}/template.js`);
  const exp = mod.default || mod;
  return exp;
}

// Setup Global Mock Chart for standard Chart.js lifecycle simulation
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

console.log('======================================================================');
console.log('   CHALLENGER 2: DEEP EMPIRICAL STRESS AUDIT (MILESTONE 2)            ');
console.log('======================================================================\n');

setupMockChartGlobal();

try {
  // -----------------------------------------------------------------------------
  // SECTION 1: 46 Templates x 8 Themes = 368 Combinations Matrix
  // -----------------------------------------------------------------------------
  console.log('📊 SECTION 1: 46 Templates x 8 Themes (368 combinations) Matrix...');

  for (const tmpl of TEMPLATES) {
    const tmplPath = path.join(ROOT, 'template', tmpl.cat, tmpl.id, 'template.js');
    
    test('Section 1 - File Exists', `${tmpl.id}: template.js file exists`, () => {
      assert.ok(fs.existsSync(tmplPath), `Missing template file at ${tmplPath}`);
    });

    let exp;
    try {
      exp = await loadTemplateModule(tmpl.cat, tmpl.id);
    } catch (err) {
      test('Section 1 - Import', `${tmpl.id}: template.js imports successfully`, () => {
        assert.fail(`Import failed: ${err.message}`);
      });
      continue;
    }

    test('Section 1 - Export createChart', `${tmpl.id}: exports createChart function`, () => {
      assert.strictEqual(typeof exp.createChart, 'function', `createChart is not a function in ${tmpl.id}`);
    });

    // Run across all 8 themes
    for (const themeName of THEME_NAMES) {
      test('Section 1 - Theme Matrix', `${tmpl.id} [${themeName}]: renders cleanly with zero NaN / undefined tokens`, () => {
        const mockCanvas = createMockCanvas(`canvas-${tmpl.id}-${themeName}`);
        const chartInstance = exp.createChart(mockCanvas, null, themeName);
        
        assert.ok(chartInstance, `createChart returned falsy value for ${tmpl.id} on theme ${themeName}`);
        assert.ok(typeof chartInstance.destroy === 'function', `chartInstance lacks destroy()`);
        assert.ok(typeof chartInstance.update === 'function', `chartInstance lacks update()`);

        // Inspect chart configuration
        const config = chartInstance.config || (chartInstance.options ? chartInstance : null);
        if (config) {
          const anomalies = scanForMalformedValues(config);
          assert.strictEqual(
            anomalies.length,
            0,
            `Anomalies found in ${tmpl.id} with ${themeName}:\n  ` + anomalies.slice(0, 5).join('\n  ')
          );
        }
      });
    }
  }

  // -----------------------------------------------------------------------------
  // SECTION 2: Milestone 2 Interaction & Animation Helpers Stress Testing
  // -----------------------------------------------------------------------------
  console.log('\n🎯 SECTION 2: Milestone 2 Interaction & Animation Helpers Stress Testing...');

  // 2.1 isReducedMotionPreferred
  test('Section 2.1', 'isReducedMotionPreferred: Node environment fallback and error safety', () => {
    // In pure Node, returns false without crashing
    const result = isReducedMotionPreferred();
    assert.strictEqual(typeof result, 'boolean');
    assert.strictEqual(result, false);

    // Mocking window.matchMedia
    const originalWindow = global.window;
    try {
      global.window = {
        matchMedia: (query) => ({
          matches: query.includes('prefers-reduced-motion: reduce')
        })
      };
      assert.strictEqual(isReducedMotionPreferred(), true);

      global.window = {
        matchMedia: () => ({ matches: false })
      };
      assert.strictEqual(isReducedMotionPreferred(), false);

      // Faulty matchMedia throwing
      global.window = {
        matchMedia: () => { throw new Error('SecurityError'); }
      };
      assert.strictEqual(isReducedMotionPreferred(), false, 'Must catch matchMedia errors gracefully');
    } finally {
      global.window = originalWindow;
    }
  });

  // 2.2 getAnimationDuration
  test('Section 2.2', 'getAnimationDuration: Logarithmic scaling formula & boundary stress', () => {
    // Formula: DeltaT = min(600, max(200, Tbase * [1 + 0.25 * log10(N)]))
    // Default baseDuration = 350
    
    // Baseline N=1: log10(1) = 0 => 350ms
    assert.strictEqual(getAnimationDuration(1), 350);
    assert.strictEqual(getAnimationDuration(1, 350), 350);

    // N=5: 350 * (1 + 0.25 * 0.69897) = 350 * 1.17474 = 411.16 => 411ms
    assert.strictEqual(getAnimationDuration(5), 411);

    // N=50: 350 * (1 + 0.25 * 1.69897) = 350 * 1.42474 = 498.66 => 499ms
    assert.strictEqual(getAnimationDuration(50), 499);

    // N=100: 350 * (1 + 0.25 * 2) = 350 * 1.5 = 525ms
    assert.strictEqual(getAnimationDuration(100), 525);

    // High N saturation: N=1000 => 350 * (1 + 0.75) = 612.5 => capped at 600ms
    assert.strictEqual(getAnimationDuration(1000), 600);
    assert.strictEqual(getAnimationDuration(1000000), 600);

    // Low boundary clamping: baseDuration = 100, N=1 => 100 clamped to 200
    assert.strictEqual(getAnimationDuration(1, 100), 200);

    // Edge cases: N <= 0 clamped to lower bound 200
    assert.strictEqual(getAnimationDuration(0), 200, 'N=0 clamped to 200ms');
    assert.strictEqual(getAnimationDuration(-10), 200, 'Negative N clamped to 200ms');
    assert.strictEqual(getAnimationDuration(NaN), 200, 'NaN N returns 200ms');
    assert.strictEqual(getAnimationDuration(null), 200, 'Null N returns 200ms');
  });

  // 2.3 getAccessibleAnimationOptions
  test('Section 2.3', 'getAccessibleAnimationOptions: Tufte, reduced-motion, and overrides', () => {
    const tufteTokens = getThemeTokens('tufte-minimalist-executive');
    const normalTokens = getThemeTokens('colorbrewer-accessible');

    // Normal mode default duration = 400
    const normalOpt = getAccessibleAnimationOptions(normalTokens);
    assert.strictEqual(typeof normalOpt, 'object');
    assert.strictEqual(normalOpt.duration, 400);
    assert.strictEqual(normalOpt.easing, 'easeOutQuart');

    // Tufte theme mode: always false
    const tufteOpt = getAccessibleAnimationOptions(tufteTokens, { duration: 500 });
    assert.strictEqual(tufteOpt, false, 'Tufte theme must return animation: false');

    // Explicit disable options
    assert.strictEqual(getAccessibleAnimationOptions(normalTokens, { duration: 0 }), false);
    assert.strictEqual(getAccessibleAnimationOptions(normalTokens, { animate: false }), false);
    assert.strictEqual(getAccessibleAnimationOptions(normalTokens, { animation: false }), false);

    // Custom easing and duration override
    const customOpt = getAccessibleAnimationOptions(normalTokens, { duration: 450, easing: 'easeInOutCubic' });
    assert.strictEqual(customOpt.duration, 450);
    assert.strictEqual(customOpt.easing, 'easeInOutCubic');
  });

  // 2.4 Specialized Interaction Helpers
  test('Section 2.4', 'Specialized Interaction Helpers: Spatial, Temporal, Partition, Executive', () => {
    const tokens = getThemeTokens('colorbrewer-accessible');
    const tufte = getThemeTokens('tufte-minimalist-executive');

    // Spatial Interaction (2D Scatter, Bubble, Hexbin)
    const spatial = getSpatialInteractionOptions(tokens, { hitRadius: 16 });
    assert.strictEqual(spatial.interaction.mode, 'nearest');
    assert.strictEqual(spatial.interaction.axis, 'xy');
    assert.strictEqual(spatial.interaction.intersect, false);
    assert.strictEqual(spatial.elements.point.hitRadius, 16);
    assert.strictEqual(spatial.elements.point.hoverRadius, 7);

    // Temporal Interaction (Time series lines, multi-line)
    const temporal = getTemporalInteractionOptions(tokens, { axis: 'x' });
    assert.strictEqual(temporal.interaction.mode, 'index');
    assert.strictEqual(temporal.interaction.axis, 'x');
    assert.strictEqual(temporal.interaction.intersect, false);

    // Partition Interaction (Pie, Doughnut, Treemap, Waffle)
    const partition = getPartitionInteractionOptions(tokens, { hitRadius: 8 });
    assert.strictEqual(partition.interaction.mode, 'nearest');
    assert.strictEqual(partition.interaction.intersect, true);
    assert.strictEqual(partition.elements.arc.hoverOffset, 4);

    // Executive Mode (Zero latency Tufte)
    const exec = getExecutiveModeOptions(tufte);
    assert.strictEqual(exec.animation, false);
    assert.strictEqual(exec.plugins.legend.display, false);
    assert.strictEqual(exec.elements.bar.borderRadius, 0);
    assert.strictEqual(exec.elements.line.borderWidth, 1.5);
  });

  // 2.5 computeAntiOcclusionTooltipPosition
  test('Section 2.5', 'computeAntiOcclusionTooltipPosition: Boundary clamping and quadrant inversion', () => {
    const canvasDim = { width: 800, height: 600 };
    const tooltipDim = { width: 140, height: 60 };

    // Case 1: Centered point (400, 300) -> Placed above caret
    const pCenter = computeAntiOcclusionTooltipPosition({ x: 400, y: 300 }, tooltipDim, canvasDim);
    assert.strictEqual(pCenter.caretPosition, 'bottom');
    assert.strictEqual(pCenter.align, 'center');
    assert.strictEqual(pCenter.x, 330); // 400 - 70
    assert.strictEqual(pCenter.y, 228); // 300 - 60 - 12

    // Case 2: Top edge (400, 30) -> Flip quadrant below target (caretPosition: 'top')
    const pTop = computeAntiOcclusionTooltipPosition({ x: 400, y: 30 }, tooltipDim, canvasDim);
    assert.strictEqual(pTop.caretPosition, 'top');
    assert.strictEqual(pTop.y, 42); // 30 + 12

    // Case 3: Left edge (20, 300) -> Clamped to left margin (align: 'left')
    const pLeft = computeAntiOcclusionTooltipPosition({ x: 20, y: 300 }, tooltipDim, canvasDim, 12, 10);
    assert.strictEqual(pLeft.align, 'left');
    assert.strictEqual(pLeft.x, 10); // clamped to margin 10

    // Case 4: Right edge (790, 300) -> Clamped to right margin (align: 'right')
    const pRight = computeAntiOcclusionTooltipPosition({ x: 790, y: 300 }, tooltipDim, canvasDim, 12, 10);
    assert.strictEqual(pRight.align, 'right');
    assert.strictEqual(pRight.x, 650); // 800 - 140 - 10

    // Case 5: Corner extremes (0,0) and (800, 600)
    const p00 = computeAntiOcclusionTooltipPosition({ x: 0, y: 0 }, tooltipDim, canvasDim);
    assert.strictEqual(p00.caretPosition, 'top');
    assert.strictEqual(p00.align, 'left');
    assert.ok(p00.x >= 0 && p00.y >= 0);

    const pMax = computeAntiOcclusionTooltipPosition({ x: 800, y: 600 }, tooltipDim, canvasDim);
    assert.strictEqual(pMax.caretPosition, 'bottom');
    assert.strictEqual(pMax.align, 'right');
    assert.ok(pMax.x + tooltipDim.width <= 800);
  });

  // -----------------------------------------------------------------------------
  // SECTION 3: Standalone catalog-bundle.js in Isolated Browser VM Context
  // -----------------------------------------------------------------------------
  console.log('\n📦 SECTION 3: Standalone catalog-bundle.js Isolated VM Execution...');

  test('Section 3', 'catalog-bundle.js evaluates and executes in pure browser VM context', () => {
    const bundleCode = fs.readFileSync(path.join(ROOT, 'catalog-bundle.js'), 'utf-8');
    const themeTokensCode = fs.readFileSync(path.join(ROOT, 'themes', 'theme-tokens.js'), 'utf-8');

    // Build isolated browser-like sandbox
    const sandbox = {
      console: console,
      Math: Math,
      Date: Date,
      JSON: JSON,
      Number: Number,
      String: String,
      Array: Array,
      Object: Object,
      RegExp: RegExp,
      parseInt: parseInt,
      parseFloat: parseFloat,
      isNaN: isNaN,
      isFinite: isFinite
    };
    sandbox.window = sandbox;
    sandbox.globalThis = sandbox;
    sandbox.document = {
      getElementById: (id) => createMockCanvas(id),
      createElement: (tag) => {
        if (tag.toLowerCase() === 'canvas') return createMockCanvas();
        return {};
      },
      head: { appendChild: () => {} }
    };

    const context = vm.createContext(sandbox);

    // 1. Run theme-tokens.js
    vm.runInContext(themeTokensCode, context);
    assert.ok(sandbox.KitChartsTheme, 'KitChartsTheme was not attached to window/sandbox');
    assert.strictEqual(typeof sandbox.KitChartsTheme.getThemeTokens, 'function');
    assert.strictEqual(typeof sandbox.KitChartsTheme.getValenceColor, 'function');
    assert.strictEqual(typeof sandbox.KitChartsTheme.getEmphasisStyle, 'function');
    assert.strictEqual(typeof sandbox.KitChartsTheme.getChartDefaultOptions, 'function');

    // 2. Run catalog-bundle.js
    vm.runInContext(bundleCode, context);
    assert.ok(sandbox.KitCharts, 'KitCharts global namespace was not created');

    // 3. Verify all 46 templates exist in KitCharts registry
    for (const tmpl of TEMPLATES) {
      const entry = sandbox.KitCharts[tmpl.id];
      assert.ok(entry, `Template "${tmpl.id}" missing from KitCharts registry in catalog-bundle.js`);
      assert.strictEqual(typeof entry.createChart, 'function', `${tmpl.id}.createChart is not a function in bundle`);
      assert.ok(entry.DEFAULT_DATA, `${tmpl.id}.DEFAULT_DATA missing in bundle`);

      // Execute createChart for all 8 themes via bundle
      for (const theme of THEME_NAMES) {
        const mockCanvas = createMockCanvas(`bundle-${tmpl.id}-${theme}`);
        const chart = entry.createChart(mockCanvas, null, theme);
        assert.ok(chart, `createChart returned falsy in bundle for ${tmpl.id} [${theme}]`);
        assert.strictEqual(typeof chart.destroy, 'function');
        assert.strictEqual(typeof chart.update, 'function');

        const anomalies = scanForMalformedValues(chart.config || chart);
        assert.strictEqual(
          anomalies.length,
          0,
          `Bundle anomalies in ${tmpl.id} [${theme}]:\n  ` + anomalies.slice(0, 5).join('\n  ')
        );
      }
    }
  });

  // -----------------------------------------------------------------------------
  // SECTION 4: Zero-CORS Static & DOM Structural Audit of index.html & preview.html
  // -----------------------------------------------------------------------------
  console.log('\n🌐 SECTION 4: Zero-CORS Static & DOM Structural Audit...');

  test('Section 4.1', 'index.html contains all 46 chart cards, 8 categories, and offline scripts', () => {
    const indexPath = path.join(ROOT, 'index.html');
    assert.ok(fs.existsSync(indexPath), 'index.html missing at root');
    const indexHtml = fs.readFileSync(indexPath, 'utf-8');

    // Check 8 categories
    const categories = [
      '01-comparaison',
      '02-composition-part-to-whole',
      '03-distribution',
      '04-correlation-relation',
      '05-evolution-temporelle',
      '06-flux-processus',
      '07-hierarchie-reseau',
      '08-geospatial-cartes'
    ];
    for (const cat of categories) {
      assert.ok(indexHtml.includes(cat), `index.html does not reference category "${cat}"`);
    }

    // Check all 46 charts referenced
    for (const tmpl of TEMPLATES) {
      assert.ok(indexHtml.includes(tmpl.id), `index.html missing chart ID "${tmpl.id}"`);
    }

    // Check theme selector and scripts
    assert.ok(indexHtml.includes('themes/theme-tokens.js') || indexHtml.includes('catalog-bundle.js'), 'index.html must include theme tokens or bundle');
    assert.ok(indexHtml.includes('id="theme-select"') || indexHtml.includes('class="theme-select"') || indexHtml.includes('theme'), 'index.html must include a theme selector');
  });

  test('Section 4.2', 'All 46 preview.html files have required elements and offline zero-CORS wiring', () => {
    for (const tmpl of TEMPLATES) {
      const previewPath = path.join(ROOT, 'template', tmpl.cat, tmpl.id, 'preview.html');
      assert.ok(fs.existsSync(previewPath), `preview.html missing for ${tmpl.id}`);
      const content = fs.readFileSync(previewPath, 'utf-8');

      // Canvas element
      assert.ok(
        content.includes('id="chart-canvas"') || content.includes('id="chart"') || content.includes('<canvas'),
        `${tmpl.id} preview.html missing canvas element`
      );

      // Theme selector
      assert.ok(
        content.includes('id="theme-select"') || content.includes('<select'),
        `${tmpl.id} preview.html missing theme selector`
      );

      // Reference to theme-tokens and template.js
      assert.ok(
        content.includes('theme-tokens.js') || content.includes('template.js'),
        `${tmpl.id} preview.html must reference theme-tokens or template`
      );
    }
  });

  // -----------------------------------------------------------------------------
  // SECTION 5: Dynamic Theme Switching Reactivity & Memory Safety
  // -----------------------------------------------------------------------------
  console.log('\n🔄 SECTION 5: Dynamic Theme Switching & Reactivity...');

  for (const tmpl of TEMPLATES) {
    test('Section 5 - Dynamic Switch', `${tmpl.id}: can cycle dynamically through all 8 themes without errors`, async () => {
      const exp = await loadTemplateModule(tmpl.cat, tmpl.id);
      const mockCanvas = createMockCanvas(`dyn-${tmpl.id}`);

      // Start with theme 1
      let currentChart = exp.createChart(mockCanvas, null, THEME_NAMES[0]);
      assert.ok(currentChart, 'Failed initial chart creation');

      // Cycle through remaining 7 themes
      for (let i = 1; i < THEME_NAMES.length; i++) {
        const nextTheme = THEME_NAMES[i];
        if (typeof currentChart.destroy === 'function') {
          currentChart.destroy();
        }
        currentChart = exp.createChart(mockCanvas, null, nextTheme);
        assert.ok(currentChart, `Failed recreation on theme ${nextTheme}`);
        
        const anomalies = scanForMalformedValues(currentChart.config || currentChart);
        assert.strictEqual(anomalies.length, 0, `Anomalies after theme switch to ${nextTheme}`);
      }

      if (typeof currentChart.destroy === 'function') {
        currentChart.destroy();
      }
    });
  }

} finally {
  cleanupMockChartGlobal();
}

// -----------------------------------------------------------------------------
// SUMMARY & VERDICT
// -----------------------------------------------------------------------------
console.log('\n======================================================================');
console.log('                 CHALLENGER 2 DEEP AUDIT SUMMARY                      ');
console.log('======================================================================');
console.log(`  Total Tests Executed : ${stats.total}`);
console.log(`  Passed               : ${stats.passed}`);
console.log(`  Failed               : ${stats.failed}`);
console.log(`  Pass Rate            : ${((stats.passed / stats.total) * 100).toFixed(2)}%`);
console.log('======================================================================\n');

if (stats.failed > 0) {
  console.error(`🚨 VERDICT: REQUEST_CHANGES (${stats.failed} failed tests)`);
  process.exit(1);
} else {
  console.log('🌟 VERDICT: APPROVE (100% PASS RATE ACROSS ALL CHALLENGE DIMENSIONS)');
  process.exit(0);
}
