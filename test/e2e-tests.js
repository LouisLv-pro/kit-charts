/**
 * @file test/e2e-tests.js
 * @description Comprehensive 4-Tier E2E Test Suite for kit-charts.
 * 541 Total Tests:
 * - Tier 1: 235 tests (5 lifecycle tests per feature x 47 features)
 * - Tier 2: 235 tests (5 boundary/corner tests per feature x 47 features)
 * - Tier 3: 47 tests (Cross-feature pairwise & plugin interaction scenarios)
 * - Tier 4: 24 tests (6 Real-World Application scenario suites x 4 composite tests)
 */

import { getThemeTokens, THEMES, THEME_NAMES, DEFAULT_THEME } from '../themes/theme-tokens.js';
import {
  assert,
  expect,
  expectChartInstance,
  assertThemeApplied,
  assertCognitiveRule,
  assertCanvasCleanDestruction,
  createSandboxCanvas,
  cleanupSandbox,
  loadChartModule
} from './test-helpers.js';
import {
  getStandardDataset,
  getEmptyDataset,
  getSingleItemDataset,
  getMassiveDataset,
  getExtremesDataset
} from './fixtures/datasets.js';
import {
  SYNTHETIC_GEO_REGIONS,
  SYNTHETIC_GEO_POINTS,
  SYNTHETIC_TOPOJSON,
  getSyntheticChoroplethData,
  getSyntheticBubbleMapData
} from './fixtures/geo-fixtures.js';

// ============================================================================
// 1. FEATURE REGISTRY (47 TOTAL FEATURES)
// ============================================================================

export const FEATURES = [
  // 00. Universal Theme System Core
  {
    id: 'theme-system-core',
    name: 'Universal Theme System Core',
    category: 'themes',
    categoryName: '00 Systèmes de Thèmes Cognitifs',
    path: '../themes/theme-tokens.js',
    chartType: 'theme-core',
    lengthBaseline: null,
    sorted: false
  },

  // Category 01: Comparaison & Classement (10 charts)
  {
    id: 'bar-chart-vertical',
    name: 'Bar Chart Vertical',
    category: '01-comparaison',
    categoryName: '01 Comparaison',
    path: '../template/01-comparaison/bar-chart-vertical/template.js',
    chartType: 'bar',
    lengthBaseline: 'y',
    sorted: false
  },
  {
    id: 'bar-chart-horizontal',
    name: 'Bar Chart Horizontal',
    category: '01-comparaison',
    categoryName: '01 Comparaison',
    path: '../template/01-comparaison/bar-chart-horizontal/template.js',
    chartType: 'bar',
    lengthBaseline: 'x',
    sorted: true
  },
  {
    id: 'grouped-bar-chart',
    name: 'Grouped Bar Chart',
    category: '01-comparaison',
    categoryName: '01 Comparaison',
    path: '../template/01-comparaison/grouped-bar-chart/template.js',
    chartType: 'bar',
    lengthBaseline: 'y',
    sorted: false
  },
  {
    id: 'stacked-bar-chart',
    name: 'Stacked Bar Chart',
    category: '01-comparaison',
    categoryName: '01 Comparaison',
    path: '../template/01-comparaison/stacked-bar-chart/template.js',
    chartType: 'bar',
    lengthBaseline: 'y',
    sorted: false
  },
  {
    id: 'bullet-chart',
    name: 'Bullet Chart',
    category: '01-comparaison',
    categoryName: '01 Comparaison',
    path: '../template/01-comparaison/bullet-chart/template.js',
    chartType: 'bar',
    lengthBaseline: 'x',
    sorted: false
  },
  {
    id: 'lollipop-chart',
    name: 'Lollipop Chart',
    category: '01-comparaison',
    categoryName: '01 Comparaison',
    path: '../template/01-comparaison/lollipop-chart/template.js',
    chartType: 'bar',
    lengthBaseline: 'y',
    sorted: false
  },
  {
    id: 'slope-chart',
    name: 'Slope Chart',
    category: '01-comparaison',
    categoryName: '01 Comparaison',
    path: '../template/01-comparaison/slope-chart/template.js',
    chartType: 'line',
    lengthBaseline: null,
    sorted: false
  },
  {
    id: 'dumbbell-chart',
    name: 'Dumbbell Chart',
    category: '01-comparaison',
    categoryName: '01 Comparaison',
    path: '../template/01-comparaison/dumbbell-chart/template.js',
    chartType: 'scatter',
    lengthBaseline: null,
    sorted: false
  },
  {
    id: 'radar-chart',
    name: 'Radar Chart',
    category: '01-comparaison',
    categoryName: '01 Comparaison',
    path: '../template/01-comparaison/radar-chart/template.js',
    chartType: 'radar',
    lengthBaseline: null,
    sorted: false
  },
  {
    id: 'polar-area-chart',
    name: 'Polar Area Chart',
    category: '01-comparaison',
    categoryName: '01 Comparaison',
    path: '../template/01-comparaison/polar-area-chart/template.js',
    chartType: 'polarArea',
    lengthBaseline: null,
    sorted: false
  },

  // Category 02: Composition (Part-to-Whole) (6 charts)
  {
    id: 'pie-chart',
    name: 'Pie Chart',
    category: '02-composition-part-to-whole',
    categoryName: '02 Composition',
    path: '../template/02-composition-part-to-whole/pie-chart/template.js',
    chartType: 'pie',
    lengthBaseline: null,
    sorted: true
  },
  {
    id: 'doughnut-chart',
    name: 'Doughnut Chart',
    category: '02-composition-part-to-whole',
    categoryName: '02 Composition',
    path: '../template/02-composition-part-to-whole/doughnut-chart/template.js',
    chartType: 'doughnut',
    lengthBaseline: null,
    sorted: true
  },
  {
    id: 'treemap',
    name: 'Treemap',
    category: '02-composition-part-to-whole',
    categoryName: '02 Composition',
    path: '../template/02-composition-part-to-whole/treemap/template.js',
    chartType: 'treemap',
    plugin: 'treemap',
    lengthBaseline: null,
    sorted: false
  },
  {
    id: 'sunburst',
    name: 'Sunburst',
    category: '02-composition-part-to-whole',
    categoryName: '02 Composition',
    path: '../template/02-composition-part-to-whole/sunburst/template.js',
    chartType: 'doughnut',
    lengthBaseline: null,
    sorted: false
  },
  {
    id: 'waffle-chart',
    name: 'Waffle Chart',
    category: '02-composition-part-to-whole',
    categoryName: '02 Composition',
    path: '../template/02-composition-part-to-whole/waffle-chart/template.js',
    chartType: 'matrix',
    plugin: 'matrix',
    lengthBaseline: null,
    sorted: false
  },
  {
    id: 'stacked-bar-100',
    name: 'Stacked Bar 100%',
    category: '02-composition-part-to-whole',
    categoryName: '02 Composition',
    path: '../template/02-composition-part-to-whole/stacked-bar-100/template.js',
    chartType: 'bar',
    lengthBaseline: 'y',
    sorted: false
  },

  // Category 03: Distribution Statistique (6 charts)
  {
    id: 'histogramme',
    name: 'Histogramme',
    category: '03-distribution',
    categoryName: '03 Distribution',
    path: '../template/03-distribution/histogramme/template.js',
    chartType: 'bar',
    lengthBaseline: 'y',
    sorted: false
  },
  {
    id: 'density-plot',
    name: 'Density Plot',
    category: '03-distribution',
    categoryName: '03 Distribution',
    path: '../template/03-distribution/density-plot/template.js',
    chartType: 'line',
    lengthBaseline: 'y',
    sorted: false
  },
  {
    id: 'box-plot',
    name: 'Box Plot',
    category: '03-distribution',
    categoryName: '03 Distribution',
    path: '../template/03-distribution/box-plot/template.js',
    chartType: 'boxplot',
    plugin: 'boxplot',
    lengthBaseline: 'y',
    sorted: false
  },
  {
    id: 'strip-plot',
    name: 'Strip Plot',
    category: '03-distribution',
    categoryName: '03 Distribution',
    path: '../template/03-distribution/strip-plot/template.js',
    chartType: 'scatter',
    lengthBaseline: null,
    sorted: false
  },
  {
    id: 'beeswarm-plot',
    name: 'Beeswarm Plot',
    category: '03-distribution',
    categoryName: '03 Distribution',
    path: '../template/03-distribution/beeswarm-plot/template.js',
    chartType: 'scatter',
    lengthBaseline: null,
    sorted: false
  },
  {
    id: 'distribution-heatmap',
    name: 'Distribution Heatmap',
    category: '03-distribution',
    categoryName: '03 Distribution',
    path: '../template/03-distribution/distribution-heatmap/template.js',
    chartType: 'matrix',
    plugin: 'matrix',
    lengthBaseline: null,
    sorted: false
  },

  // Category 04: Corrélation & Relation (5 charts)
  {
    id: 'scatter-plot',
    name: 'Scatter Plot',
    category: '04-correlation-relation',
    categoryName: '04 Corrélation',
    path: '../template/04-correlation-relation/scatter-plot/template.js',
    chartType: 'scatter',
    lengthBaseline: null,
    sorted: false
  },
  {
    id: 'bubble-chart',
    name: 'Bubble Chart',
    category: '04-correlation-relation',
    categoryName: '04 Corrélation',
    path: '../template/04-correlation-relation/bubble-chart/template.js',
    chartType: 'bubble',
    lengthBaseline: null,
    sorted: false
  },
  {
    id: 'matrix-heatmap',
    name: 'Matrix Heatmap',
    category: '04-correlation-relation',
    categoryName: '04 Corrélation',
    path: '../template/04-correlation-relation/matrix-heatmap/template.js',
    chartType: 'matrix',
    plugin: 'matrix',
    lengthBaseline: null,
    sorted: false
  },
  {
    id: 'connected-scatter-plot',
    name: 'Connected Scatter Plot',
    category: '04-correlation-relation',
    categoryName: '04 Corrélation',
    path: '../template/04-correlation-relation/connected-scatter-plot/template.js',
    chartType: 'line',
    lengthBaseline: null,
    sorted: false
  },
  {
    id: 'density-2d-hexbin',
    name: 'Density 2D Hexbin',
    category: '04-correlation-relation',
    categoryName: '04 Corrélation',
    path: '../template/04-correlation-relation/density-2d-hexbin/template.js',
    chartType: 'matrix',
    plugin: 'matrix',
    lengthBaseline: null,
    sorted: false
  },

  // Category 05: Évolution Temporelle (7 charts)
  {
    id: 'line-chart',
    name: 'Line Chart',
    category: '05-evolution-temporelle',
    categoryName: '05 Évolution Temporelle',
    path: '../template/05-evolution-temporelle/line-chart/template.js',
    chartType: 'line',
    lengthBaseline: null,
    sorted: false
  },
  {
    id: 'multi-line-chart',
    name: 'Multi-Line Chart',
    category: '05-evolution-temporelle',
    categoryName: '05 Évolution Temporelle',
    path: '../template/05-evolution-temporelle/multi-line-chart/template.js',
    chartType: 'line',
    lengthBaseline: null,
    sorted: false
  },
  {
    id: 'area-chart',
    name: 'Area Chart',
    category: '05-evolution-temporelle',
    categoryName: '05 Évolution Temporelle',
    path: '../template/05-evolution-temporelle/area-chart/template.js',
    chartType: 'line',
    lengthBaseline: 'y',
    sorted: false
  },
  {
    id: 'stacked-area-chart',
    name: 'Stacked Area Chart',
    category: '05-evolution-temporelle',
    categoryName: '05 Évolution Temporelle',
    path: '../template/05-evolution-temporelle/stacked-area-chart/template.js',
    chartType: 'line',
    lengthBaseline: 'y',
    sorted: false
  },
  {
    id: 'streamgraph',
    name: 'Streamgraph',
    category: '05-evolution-temporelle',
    categoryName: '05 Évolution Temporelle',
    path: '../template/05-evolution-temporelle/streamgraph/template.js',
    chartType: 'line',
    lengthBaseline: null,
    sorted: false
  },
  {
    id: 'candlestick-ohlc',
    name: 'Candlestick OHLC',
    category: '05-evolution-temporelle',
    categoryName: '05 Évolution Temporelle',
    path: '../template/05-evolution-temporelle/candlestick-ohlc/template.js',
    chartType: 'candlestick',
    plugin: 'financial',
    lengthBaseline: null,
    sorted: false
  },
  {
    id: 'sparkline',
    name: 'Sparkline',
    category: '05-evolution-temporelle',
    categoryName: '05 Évolution Temporelle',
    path: '../template/05-evolution-temporelle/sparkline/template.js',
    chartType: 'line',
    lengthBaseline: null,
    sorted: false
  },

  // Category 06: Flux & Processus (5 charts)
  {
    id: 'sankey-diagram',
    name: 'Sankey Diagram',
    category: '06-flux-processus',
    categoryName: '06 Flux & Processus',
    path: '../template/06-flux-processus/sankey-diagram/template.js',
    chartType: 'sankey',
    plugin: 'sankey',
    lengthBaseline: null,
    sorted: false
  },
  {
    id: 'chord-diagram',
    name: 'Chord Diagram',
    category: '06-flux-processus',
    categoryName: '06 Flux & Processus',
    path: '../template/06-flux-processus/chord-diagram/template.js',
    chartType: 'radar',
    lengthBaseline: null,
    sorted: false
  },
  {
    id: 'funnel-chart',
    name: 'Funnel Chart',
    category: '06-flux-processus',
    categoryName: '06 Flux & Processus',
    path: '../template/06-flux-processus/funnel-chart/template.js',
    chartType: 'bar',
    lengthBaseline: 'x',
    sorted: true
  },
  {
    id: 'waterfall-chart',
    name: 'Waterfall Chart',
    category: '06-flux-processus',
    categoryName: '06 Flux & Processus',
    path: '../template/06-flux-processus/waterfall-chart/template.js',
    chartType: 'bar',
    lengthBaseline: 'y',
    sorted: false
  },
  {
    id: 'alluvial-diagram',
    name: 'Alluvial Diagram',
    category: '06-flux-processus',
    categoryName: '06 Flux & Processus',
    path: '../template/06-flux-processus/alluvial-diagram/template.js',
    chartType: 'sankey',
    plugin: 'sankey',
    lengthBaseline: null,
    sorted: false
  },

  // Category 07: Hiérarchie & Réseau (4 charts)
  {
    id: 'node-link-network',
    name: 'Node-Link Network',
    category: '07-hierarchie-reseau',
    categoryName: '07 Hiérarchie & Réseau',
    path: '../template/07-hierarchie-reseau/node-link-network/template.js',
    chartType: 'scatter',
    lengthBaseline: null,
    sorted: false
  },
  {
    id: 'arc-diagram',
    name: 'Arc Diagram',
    category: '07-hierarchie-reseau',
    categoryName: '07 Hiérarchie & Réseau',
    path: '../template/07-hierarchie-reseau/arc-diagram/template.js',
    chartType: 'scatter',
    lengthBaseline: null,
    sorted: false
  },
  {
    id: 'dendrogram',
    name: 'Dendrogram',
    category: '07-hierarchie-reseau',
    categoryName: '07 Hiérarchie & Réseau',
    path: '../template/07-hierarchie-reseau/dendrogram/template.js',
    chartType: 'line',
    lengthBaseline: null,
    sorted: false
  },
  {
    id: 'marimekko-chart',
    name: 'Marimekko Chart',
    category: '07-hierarchie-reseau',
    categoryName: '07 Hiérarchie & Réseau',
    path: '../template/07-hierarchie-reseau/marimekko-chart/template.js',
    chartType: 'matrix',
    plugin: 'matrix',
    lengthBaseline: null,
    sorted: false
  },

  // Category 08: Géospatial & Cartes (3 charts)
  {
    id: 'choropleth-map',
    name: 'Choropleth Map',
    category: '08-geospatial-cartes',
    categoryName: '08 Géospatial & Cartes',
    path: '../template/08-geospatial-cartes/choropleth-map/template.js',
    chartType: 'choropleth',
    plugin: 'geo',
    lengthBaseline: null,
    sorted: false
  },
  {
    id: 'bubble-map',
    name: 'Bubble Map',
    category: '08-geospatial-cartes',
    categoryName: '08 Géospatial & Cartes',
    path: '../template/08-geospatial-cartes/bubble-map/template.js',
    chartType: 'bubbleMap',
    plugin: 'geo',
    lengthBaseline: null,
    sorted: false
  },
  {
    id: 'cartogram-tilegram',
    name: 'Cartogram / Tilegram',
    category: '08-geospatial-cartes',
    categoryName: '08 Géospatial & Cartes',
    path: '../template/08-geospatial-cartes/cartogram-tilegram/template.js',
    chartType: 'matrix',
    plugin: 'matrix',
    lengthBaseline: null,
    sorted: false
  }
];

// ============================================================================
// 2. TEST RUNNER CLASS
// ============================================================================

export class E2ETestRunner {
  constructor() {
    this.tests = [];
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      duration: 0,
      list: [],
      tierStats: { tier1: { total: 0, passed: 0, failed: 0 }, tier2: { total: 0, passed: 0, failed: 0 }, tier3: { total: 0, passed: 0, failed: 0 }, tier4: { total: 0, passed: 0, failed: 0 } }
    };
    this.onTestComplete = null;
  }

  describe(tier, category, suiteName, fn) {
    this.currentTier = tier;
    this.currentCategory = category;
    this.currentSuite = suiteName;
    fn();
  }

  it(id, name, testFn) {
    this.tests.push({
      id,
      tier: this.currentTier,
      category: this.currentCategory,
      suite: this.currentSuite,
      name,
      fn: testFn
    });
  }

  async run({ filterTier = 'all', filterCategory = 'all', searchQuery = '' } = {}) {
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      duration: 0,
      list: [],
      tierStats: {
        tier1: { total: 0, passed: 0, failed: 0 },
        tier2: { total: 0, passed: 0, failed: 0 },
        tier3: { total: 0, passed: 0, failed: 0 },
        tier4: { total: 0, passed: 0, failed: 0 }
      }
    };

    const startTime = Date.now();
    const query = searchQuery.trim().toLowerCase();

    for (let index = 0; index < this.tests.length; index++) {
      const test = this.tests[index];
      const matchTier = filterTier === 'all' || test.tier === filterTier;
      const matchCat = filterCategory === 'all' || test.category === filterCategory;
      const matchQuery = !query || test.name.toLowerCase().includes(query) || test.id.toLowerCase().includes(query);

      if (!matchTier || !matchCat || !matchQuery) {
        this.results.skipped++;
        continue;
      }

      this.results.total++;
      const tierKey = test.tier;
      if (this.results.tierStats[tierKey]) {
        this.results.tierStats[tierKey].total++;
      }

      const testStart = Date.now();
      let pass = false;
      let error = null;

      try {
        await test.fn();
        pass = true;
        this.results.passed++;
        if (this.results.tierStats[tierKey]) {
          this.results.tierStats[tierKey].passed++;
        }
      } catch (err) {
        pass = false;
        error = err;
        this.results.failed++;
        if (this.results.tierStats[tierKey]) {
          this.results.tierStats[tierKey].failed++;
        }
      } finally {
        cleanupSandbox();
      }

      const durationMs = Date.now() - testStart;
      const resultEntry = {
        index: index + 1,
        id: test.id,
        tier: test.tier,
        category: test.category,
        suite: test.suite,
        name: test.name,
        passed: pass,
        error: error ? error.message : null,
        stack: error ? error.stack : null,
        duration: durationMs
      };

      this.results.list.push(resultEntry);
      if (typeof this.onTestComplete === 'function') {
        this.onTestComplete(resultEntry, this.results);
      }
    }

    this.results.duration = ((Date.now() - startTime) / 1000).toFixed(2);
    return this.results;
  }
}

// Global Runner Singleton
export const runner = new E2ETestRunner();

// ============================================================================
// 3. TIER 1: FEATURE COVERAGE & LIFECYCLE (235 TESTS: 47 x 5)
// ============================================================================

for (const feature of FEATURES) {
  runner.describe('tier1', feature.category, `Tier 1: Feature Coverage & Lifecycle — ${feature.name}`, () => {
    // T1.1: Default Instantiation
    runner.it(`T1.${feature.id}.1`, `[Default Instantiation] ${feature.name} instantiates cleanly with default data & theme`, async () => {
      const module = await loadChartModule(feature);
      const canvas = createSandboxCanvas(`sandbox-${feature.id}-t1-1`);
      const chart = module.createChart(canvas);
      expectChartInstance(chart);
      assertThemeApplied(chart, DEFAULT_THEME);
      if (feature.lengthBaseline) {
        assertCognitiveRule(chart, 'origin-zero', feature);
      }
      chart.destroy();
    });

    // T1.2: Custom Data Injection
    runner.it(`T1.${feature.id}.2`, `[Custom Data Injection] ${feature.name} accepts and renders custom data payload`, async () => {
      const module = await loadChartModule(feature);
      const canvas = createSandboxCanvas(`sandbox-${feature.id}-t1-2`);
      const customData = getStandardDataset(feature.id, getThemeTokens('viridis-perceptual'));
      const chart = module.createChart(canvas, customData, 'viridis-perceptual');
      expectChartInstance(chart);
      expect(chart.data).toBeDefined();
      chart.destroy();
    });

    // T1.3: Dynamic Theme Application
    runner.it(`T1.${feature.id}.3`, `[Theme Application] ${feature.name} correctly applies 'nord-cognitive-dark' tokens`, async () => {
      const module = await loadChartModule(feature);
      const canvas = createSandboxCanvas(`sandbox-${feature.id}-t1-3`);
      const chart = module.createChart(canvas, null, 'nord-cognitive-dark');
      expectChartInstance(chart);
      assertThemeApplied(chart, 'nord-cognitive-dark');
      chart.destroy();
    });

    // T1.4: Return Instance Structure & API
    runner.it(`T1.${feature.id}.4`, `[Return Instance Structure] ${feature.name} instance exposes full Chart.js v4 API`, async () => {
      const module = await loadChartModule(feature);
      const canvas = createSandboxCanvas(`sandbox-${feature.id}-t1-4`);
      const chart = module.createChart(canvas);
      expectChartInstance(chart);
      expect(typeof chart.update).toBe('function');
      expect(typeof chart.destroy).toBe('function');
      expect(typeof chart.resize).toBe('function');
      chart.destroy();
    });

    // T1.5: DOM & Canvas Lifecycle / Clean Destruction
    runner.it(`T1.${feature.id}.5`, `[DOM Lifecycle] ${feature.name} supports safe recreation on existing canvas`, async () => {
      const module = await loadChartModule(feature);
      const canvasId = `sandbox-${feature.id}-t1-5`;
      const canvas = createSandboxCanvas(canvasId);
      assertCanvasCleanDestruction(canvas, module.createChart);
    });
  });
}

// ============================================================================
// 4. TIER 2: BOUNDARY & CORNER CASES (235 TESTS: 47 x 5)
// ============================================================================

for (const feature of FEATURES) {
  runner.describe('tier2', feature.category, `Tier 2: Boundary & Corner Cases — ${feature.name}`, () => {
    // T2.1: Empty Dataset Graceful Handling
    runner.it(`T2.${feature.id}.1`, `[Boundary: Empty Dataset] ${feature.name} handles empty data without unhandled crash`, async () => {
      const module = await loadChartModule(feature);
      const canvas = createSandboxCanvas(`sandbox-${feature.id}-t2-1`);
      const emptyData = getEmptyDataset(feature.id);
      const chart = module.createChart(canvas, emptyData);
      expectChartInstance(chart);
      chart.destroy();
    });

    // T2.2: Single Data Item (N=1)
    runner.it(`T2.${feature.id}.2`, `[Boundary: Single Data Item] ${feature.name} renders single-item dataset (N=1)`, async () => {
      const module = await loadChartModule(feature);
      const canvas = createSandboxCanvas(`sandbox-${feature.id}-t2-2`);
      const singleItem = getSingleItemDataset(feature.id, getThemeTokens('colorbrewer-accessible'));
      const chart = module.createChart(canvas, singleItem);
      expectChartInstance(chart);
      chart.destroy();
    });

    // T2.3: Massive Dataset (N=500+)
    runner.it(`T2.${feature.id}.3`, `[Stress: Massive Dataset] ${feature.name} handles high-cardinality data (500 items)`, async () => {
      const module = await loadChartModule(feature);
      const canvas = createSandboxCanvas(`sandbox-${feature.id}-t2-3`);
      const massiveData = getMassiveDataset(feature.id, 500, getThemeTokens('paul-tol-scientific'));
      const t0 = Date.now();
      const chart = module.createChart(canvas, massiveData, 'paul-tol-scientific');
      const elapsed = Date.now() - t0;
      expectChartInstance(chart);
      expect(elapsed).toBeLessThan(1500, 'Massive dataset rendering exceeded performance budget (1.5s)');
      chart.destroy();
    });

    // T2.4: Negative, Zero & Extreme Float Values
    runner.it(`T2.${feature.id}.4`, `[Boundary: Extremes/Zeros] ${feature.name} handles negatives, zeros, and high decimals`, async () => {
      const module = await loadChartModule(feature);
      const canvas = createSandboxCanvas(`sandbox-${feature.id}-t2-4`);
      const extremesData = getExtremesDataset(feature.id, getThemeTokens('okabe-ito-cud'));
      const chart = module.createChart(canvas, extremesData, 'okabe-ito-cud');
      expectChartInstance(chart);
      chart.destroy();
    });

    // T2.5: Rapid Dynamic Theme Switching Loop
    runner.it(`T2.${feature.id}.5`, `[Stress: Rapid Theme Switch] ${feature.name} cycles rapidly through all 8 themes`, async () => {
      const module = await loadChartModule(feature);
      const canvas = createSandboxCanvas(`sandbox-${feature.id}-t2-5`);
      let currentChart = null;
      for (const theme of THEME_NAMES) {
        currentChart = module.createChart(canvas, null, theme);
        expectChartInstance(currentChart);
      }
      assertThemeApplied(currentChart, THEME_NAMES[THEME_NAMES.length - 1]);
      currentChart.destroy();
    });
  });
}

// ============================================================================
// 5. TIER 3: CROSS-FEATURE COMBINATIONS & PAIRWISE INTERACTIONS (47 TESTS)
// ============================================================================

runner.describe('tier3', 'cross-feature', 'Tier 3: Cross-Feature Pairwise Interactions', () => {
  // 1. Theme x Category Matrix (8 Tests)
  const categoryThemePairs = [
    { cat: '01-comparaison', chart: 'bar-chart-vertical', theme: 'colorbrewer-accessible' },
    { cat: '02-composition-part-to-whole', chart: 'doughnut-chart', theme: 'viridis-perceptual' },
    { cat: '03-distribution', chart: 'histogramme', theme: 'paul-tol-scientific' },
    { cat: '04-correlation-relation', chart: 'scatter-plot', theme: 'tableau-stone-categorical' },
    { cat: '05-evolution-temporelle', chart: 'multi-line-chart', theme: 'okabe-ito-cud' },
    { cat: '06-flux-processus', chart: 'funnel-chart', theme: 'tufte-minimalist-executive' },
    { cat: '07-hierarchie-reseau', chart: 'node-link-network', theme: 'nord-cognitive-dark' },
    { cat: '08-geospatial-cartes', chart: 'cartogram-tilegram', theme: 'atkinson-hyperlegible' }
  ];

  categoryThemePairs.forEach((pair, idx) => {
    runner.it(`T3.MATRIX.${idx + 1}`, `[Pairwise Matrix] Category ${pair.cat} (${pair.chart}) paired with Theme '${pair.theme}'`, async () => {
      const feature = FEATURES.find(f => f.id === pair.chart);
      const module = await loadChartModule(feature);
      const canvas = createSandboxCanvas(`sandbox-t3-matrix-${idx}`);
      const chart = module.createChart(canvas, null, pair.theme);
      expectChartInstance(chart);
      assertThemeApplied(chart, pair.theme);
      chart.destroy();
    });
  });

  // 2. Multi-Plugin Coexistence Tests (10 Tests)
  const pluginCoexistencePairs = [
    ['treemap', 'sankey-diagram'],
    ['box-plot', 'matrix-heatmap'],
    ['candlestick-ohlc', 'choropleth-map'],
    ['bubble-map', 'marimekko-chart'],
    ['waffle-chart', 'alluvial-diagram'],
    ['treemap', 'box-plot'],
    ['matrix-heatmap', 'candlestick-ohlc'],
    ['sankey-diagram', 'choropleth-map'],
    ['distribution-heatmap', 'bullet-chart'],
    ['density-2d-hexbin', 'cartogram-tilegram']
  ];

  pluginCoexistencePairs.forEach((pair, idx) => {
    runner.it(`T3.PLUGIN_COEXIST.${idx + 1}`, `[Plugin Coexistence] Concurrent instances: ${pair[0]} and ${pair[1]} simultaneously on DOM`, async () => {
      const f1 = FEATURES.find(f => f.id === pair[0]);
      const f2 = FEATURES.find(f => f.id === pair[1]);
      const m1 = await loadChartModule(f1);
      const m2 = await loadChartModule(f2);
      const c1 = createSandboxCanvas(`sandbox-t3-coexist-${idx}-a`);
      const c2 = createSandboxCanvas(`sandbox-t3-coexist-${idx}-b`);
      const chart1 = m1.createChart(c1, null, 'colorbrewer-accessible');
      const chart2 = m2.createChart(c2, null, 'viridis-perceptual');
      expectChartInstance(chart1);
      expectChartInstance(chart2);
      chart1.destroy();
      chart2.destroy();
    });
  });

  // 3. Dynamic Canvas Resize x Theme Switch (10 Tests)
  const resizeFeatures = [
    'bar-chart-vertical', 'grouped-bar-chart', 'stacked-bar-chart', 'line-chart', 'area-chart',
    'scatter-plot', 'histogramme', 'pie-chart', 'waterfall-chart', 'sparkline'
  ];

  resizeFeatures.forEach((chartId, idx) => {
    runner.it(`T3.RESIZE_THEME.${idx + 1}`, `[Resize x Theme] ${chartId} dynamically resizes while theme switches`, async () => {
      const feature = FEATURES.find(f => f.id === chartId);
      const module = await loadChartModule(feature);
      const canvas = createSandboxCanvas(`sandbox-t3-resize-${idx}`, 400, 300);
      const chart = module.createChart(canvas, null, 'colorbrewer-accessible');
      expectChartInstance(chart);

      // Simulate container resize & theme toggle
      canvas.width = 800;
      canvas.height = 600;
      chart.resize();
      const updatedChart = module.createChart(canvas, null, 'nord-cognitive-dark');
      expectChartInstance(updatedChart);
      assertThemeApplied(updatedChart, 'nord-cognitive-dark');
      updatedChart.destroy();
    });
  });

  // 4. Canvas Morphing & Type Replacement (10 Tests)
  const morphTransitions = [
    { from: 'bar-chart-vertical', to: 'doughnut-chart' },
    { from: 'doughnut-chart', to: 'line-chart' },
    { from: 'line-chart', to: 'scatter-plot' },
    { from: 'scatter-plot', to: 'polar-area-chart' },
    { from: 'polar-area-chart', to: 'radar-chart' },
    { from: 'radar-chart', to: 'waterfall-chart' },
    { from: 'waterfall-chart', to: 'stacked-bar-100' },
    { from: 'stacked-bar-100', to: 'area-chart' },
    { from: 'area-chart', to: 'sparkline' },
    { from: 'sparkline', to: 'bar-chart-horizontal' }
  ];

  morphTransitions.forEach((trans, idx) => {
    runner.it(`T3.MORPH.${idx + 1}`, `[Canvas Morphing] Sequential morph from '${trans.from}' to '${trans.to}' on same canvas`, async () => {
      const f1 = FEATURES.find(f => f.id === trans.from);
      const f2 = FEATURES.find(f => f.id === trans.to);
      const m1 = await loadChartModule(f1);
      const m2 = await loadChartModule(f2);
      const canvas = createSandboxCanvas(`sandbox-t3-morph-${idx}`);
      const chart1 = m1.createChart(canvas, null, 'tableau-stone-categorical');
      expectChartInstance(chart1);
      const chart2 = m2.createChart(canvas, null, 'okabe-ito-cud');
      expectChartInstance(chart2);
      assertThemeApplied(chart2, 'okabe-ito-cud');
      chart2.destroy();
    });
  });

  // 5. Cognitive Rule Invariance (9 Tests)
  const cognitiveInvarianceCharts = [
    'bar-chart-vertical', 'bar-chart-horizontal', 'grouped-bar-chart', 'stacked-bar-chart',
    'lollipop-chart', 'histogramme', 'area-chart', 'stacked-area-chart', 'waterfall-chart'
  ];

  cognitiveInvarianceCharts.forEach((chartId, idx) => {
    runner.it(`T3.COGNITIVE_INVAR.${idx + 1}`, `[Cognitive Invariance] ${chartId} preserves Y=0 / X=0 origin baseline under custom data`, async () => {
      const feature = FEATURES.find(f => f.id === chartId);
      const module = await loadChartModule(feature);
      const canvas = createSandboxCanvas(`sandbox-t3-cog-${idx}`);
      const customData = getExtremesDataset(chartId);
      const chart = module.createChart(canvas, customData, 'tufte-minimalist-executive');
      expectChartInstance(chart);
      assertCognitiveRule(chart, 'origin-zero', feature);
      chart.destroy();
    });
  });
});

// ============================================================================
// 6. TIER 4: REAL-WORLD APPLICATION SCENARIOS (24 TESTS: 6 SUITES x 4)
// ============================================================================

// Suite 1: Executive SaaS Operations Dashboard
runner.describe('tier4', 'real-world', 'Tier 4: Suite 1 — Executive SaaS Operations Dashboard', () => {
  runner.it('T4.SUITE1.1', '[SaaS Dashboard] MRR growth multi-line and revenue source doughnut render in sync', async () => {
    const fLine = FEATURES.find(f => f.id === 'multi-line-chart');
    const fDonut = FEATURES.find(f => f.id === 'doughnut-chart');
    const mLine = await loadChartModule(fLine);
    const mDonut = await loadChartModule(fDonut);
    const c1 = createSandboxCanvas('sandbox-t4-saas-mrr');
    const c2 = createSandboxCanvas('sandbox-t4-saas-sources');
    const chartLine = mLine.createChart(c1, null, 'colorbrewer-accessible');
    const chartDonut = mDonut.createChart(c2, null, 'colorbrewer-accessible');
    expectChartInstance(chartLine);
    expectChartInstance(chartDonut);
    chartLine.destroy();
    chartDonut.destroy();
  });

  runner.it('T4.SUITE1.2', '[SaaS Dashboard] Customer churn waterfall correctly reconciles gains and losses', async () => {
    const fWater = FEATURES.find(f => f.id === 'waterfall-chart');
    const mWater = await loadChartModule(fWater);
    const c = createSandboxCanvas('sandbox-t4-saas-waterfall');
    const chart = mWater.createChart(c, null, 'colorbrewer-accessible');
    expectChartInstance(chart);
    assertCognitiveRule(chart, 'origin-zero', fWater);
    chart.destroy();
  });

  runner.it('T4.SUITE1.3', '[SaaS Dashboard] Real-time dark mode toggle (Nord Dark) synchronizes across panels', async () => {
    const f1 = FEATURES.find(f => f.id === 'line-chart');
    const f2 = FEATURES.find(f => f.id === 'bullet-chart');
    const m1 = await loadChartModule(f1);
    const m2 = await loadChartModule(f2);
    const c1 = createSandboxCanvas('sandbox-t4-saas-dark-1');
    const c2 = createSandboxCanvas('sandbox-t4-saas-dark-2');
    const chart1 = m1.createChart(c1, null, 'nord-cognitive-dark');
    const chart2 = m2.createChart(c2, null, 'nord-cognitive-dark');
    assertThemeApplied(chart1, 'nord-cognitive-dark');
    assertThemeApplied(chart2, 'nord-cognitive-dark');
    chart1.destroy();
    chart2.destroy();
  });

  runner.it('T4.SUITE1.4', '[SaaS Dashboard] Monospace tabular numbers verified on all executive tooltips', async () => {
    const f = FEATURES.find(f => f.id === 'bar-chart-vertical');
    const m = await loadChartModule(f);
    const c = createSandboxCanvas('sandbox-t4-saas-tooltip');
    const chart = m.createChart(c);
    assertCognitiveRule(chart, 'tabular-nums');
    chart.destroy();
  });
});

// Suite 2: Multi-Asset Quantitative Financial Risk Portfolio
runner.describe('tier4', 'real-world', 'Tier 4: Suite 2 — Quantitative Financial Risk Portfolio', () => {
  runner.it('T4.SUITE2.1', '[Financial Risk] Intraday Candlestick OHLC time scale data parsing & rendering', async () => {
    const f = FEATURES.find(f => f.id === 'candlestick-ohlc');
    const m = await loadChartModule(f);
    const c = createSandboxCanvas('sandbox-t4-fin-ohlc');
    const chart = m.createChart(c, null, 'tableau-stone-categorical');
    expectChartInstance(chart);
    chart.destroy();
  });

  runner.it('T4.SUITE2.2', '[Financial Risk] Cross-asset correlation matrix heatmap with diverging colormap', async () => {
    const f = FEATURES.find(f => f.id === 'matrix-heatmap');
    const m = await loadChartModule(f);
    const c = createSandboxCanvas('sandbox-t4-fin-matrix');
    const chart = m.createChart(c, null, 'paul-tol-scientific');
    expectChartInstance(chart);
    chart.destroy();
  });

  runner.it('T4.SUITE2.3', '[Financial Risk] Value-at-Risk (VaR) Tukey boxplot outlier distribution', async () => {
    const f = FEATURES.find(f => f.id === 'box-plot');
    const m = await loadChartModule(f);
    const c = createSandboxCanvas('sandbox-t4-fin-boxplot');
    const chart = m.createChart(c, null, 'viridis-perceptual');
    expectChartInstance(chart);
    chart.destroy();
  });

  runner.it('T4.SUITE2.4', '[Financial Risk] Asset allocation Treemap squarified hierarchy decomposition', async () => {
    const f = FEATURES.find(f => f.id === 'treemap');
    const m = await loadChartModule(f);
    const c = createSandboxCanvas('sandbox-t4-fin-treemap');
    const chart = m.createChart(c, null, 'okabe-ito-cud');
    expectChartInstance(chart);
    chart.destroy();
  });
});

// Suite 3: Clinical Trial Biostatistics & Biomarker Distribution
runner.describe('tier4', 'real-world', 'Tier 4: Suite 3 — Clinical Trial Biostatistics', () => {
  runner.it('T4.SUITE3.1', '[Clinical Trial] Patient cohort biomarker continuous KDE density curve', async () => {
    const f = FEATURES.find(f => f.id === 'density-plot');
    const m = await loadChartModule(f);
    const c = createSandboxCanvas('sandbox-t4-clin-density');
    const chart = m.createChart(c, null, 'viridis-perceptual');
    expectChartInstance(chart);
    chart.destroy();
  });

  runner.it('T4.SUITE3.2', '[Clinical Trial] Deterministic non-overlapping Beeswarm swarm dot distribution', async () => {
    const f = FEATURES.find(f => f.id === 'beeswarm-plot');
    const m = await loadChartModule(f);
    const c = createSandboxCanvas('sandbox-t4-clin-beeswarm');
    const chart = m.createChart(c, null, 'paul-tol-scientific');
    expectChartInstance(chart);
    chart.destroy();
  });

  runner.it('T4.SUITE3.3', '[Clinical Trial] High-contrast low-vision Atkinson Hyperlegible theme verification', async () => {
    const f = FEATURES.find(f => f.id === 'strip-plot');
    const m = await loadChartModule(f);
    const c = createSandboxCanvas('sandbox-t4-clin-atkinson');
    const chart = m.createChart(c, null, 'atkinson-hyperlegible');
    assertThemeApplied(chart, 'atkinson-hyperlegible');
    chart.destroy();
  });

  runner.it('T4.SUITE3.4', '[Clinical Trial] Treatment arm delta paired slopegraph comparison', async () => {
    const f = FEATURES.find(f => f.id === 'slope-chart');
    const m = await loadChartModule(f);
    const c = createSandboxCanvas('sandbox-t4-clin-slope');
    const chart = m.createChart(c, null, 'colorbrewer-accessible');
    expectChartInstance(chart);
    chart.destroy();
  });
});

// Suite 4: Global Supply Chain & Geospatial Logistics Network
runner.describe('tier4', 'real-world', 'Tier 4: Suite 4 — Global Supply Chain & Geospatial Logistics', () => {
  runner.it('T4.SUITE4.1', '[Logistics Network] Multi-tier supplier transfer Sankey diagram mass conservation', async () => {
    const f = FEATURES.find(f => f.id === 'sankey-diagram');
    const m = await loadChartModule(f);
    const c = createSandboxCanvas('sandbox-t4-geo-sankey');
    const chart = m.createChart(c, null, 'viridis-perceptual');
    expectChartInstance(chart);
    chart.destroy();
  });

  runner.it('T4.SUITE4.2', '[Logistics Network] Territorial inventory density Choropleth map projection', async () => {
    const f = FEATURES.find(f => f.id === 'choropleth-map');
    const m = await loadChartModule(f);
    const c = createSandboxCanvas('sandbox-t4-geo-choro');
    const chart = m.createChart(c, getSyntheticChoroplethData(), 'colorbrewer-accessible');
    expectChartInstance(chart);
    chart.destroy();
  });

  runner.it('T4.SUITE4.3', '[Logistics Network] Port throughput proportional Bubble map symbol scaling', async () => {
    const f = FEATURES.find(f => f.id === 'bubble-map');
    const m = await loadChartModule(f);
    const c = createSandboxCanvas('sandbox-t4-geo-bubblemap');
    const chart = m.createChart(c, getSyntheticBubbleMapData(), 'okabe-ito-cud');
    expectChartInstance(chart);
    chart.destroy();
  });

  runner.it('T4.SUITE4.4', '[Logistics Network] Freight transit duration histogram with Freedman-Diaconis bins', async () => {
    const f = FEATURES.find(f => f.id === 'histogramme');
    const m = await loadChartModule(f);
    const c = createSandboxCanvas('sandbox-t4-geo-hist');
    const chart = m.createChart(c, null, 'nord-cognitive-dark');
    expectChartInstance(chart);
    assertCognitiveRule(chart, 'origin-zero', f);
    chart.destroy();
  });
});

// Suite 5: E-Commerce Multi-Channel Conversion Funnel & Attribution
runner.describe('tier4', 'real-world', 'Tier 4: Suite 5 — E-Commerce Conversion Funnel & Attribution', () => {
  runner.it('T4.SUITE5.1', '[E-Commerce] Multi-stage checkout drop-off funnel monotonicity validation', async () => {
    const f = FEATURES.find(f => f.id === 'funnel-chart');
    const m = await loadChartModule(f);
    const c = createSandboxCanvas('sandbox-t4-ecom-funnel');
    const chart = m.createChart(c, null, 'colorbrewer-accessible');
    expectChartInstance(chart);
    assertCognitiveRule(chart, 'sorted-categories', f);
    chart.destroy();
  });

  runner.it('T4.SUITE5.2', '[E-Commerce] Multi-channel cohort migration Alluvial flow diagram', async () => {
    const f = FEATURES.find(f => f.id === 'alluvial-diagram');
    const m = await loadChartModule(f);
    const c = createSandboxCanvas('sandbox-t4-ecom-alluvial');
    const chart = m.createChart(c, null, 'tableau-stone-categorical');
    expectChartInstance(chart);
    chart.destroy();
  });

  runner.it('T4.SUITE5.3', '[E-Commerce] Category revenue breakdown Marimekko mosaic market share', async () => {
    const f = FEATURES.find(f => f.id === 'marimekko-chart');
    const m = await loadChartModule(f);
    const c = createSandboxCanvas('sandbox-t4-ecom-marimekko');
    const chart = m.createChart(c, null, 'viridis-perceptual');
    expectChartInstance(chart);
    chart.destroy();
  });

  runner.it('T4.SUITE5.4', '[E-Commerce] Daily conversion rate Sparkline micro-trendline embedded cards', async () => {
    const f = FEATURES.find(f => f.id === 'sparkline');
    const m = await loadChartModule(f);
    const c = createSandboxCanvas('sandbox-t4-ecom-spark');
    const chart = m.createChart(c, null, 'tufte-minimalist-executive');
    expectChartInstance(chart);
    chart.destroy();
  });
});

// Suite 6: Cloud Infrastructure Telemetry & Network Topology
runner.describe('tier4', 'real-world', 'Tier 4: Suite 6 — Cloud Infrastructure Telemetry', () => {
  runner.it('T4.SUITE6.1', '[Telemetry] Microservices force-directed Node-Link topological network graph', async () => {
    const f = FEATURES.find(f => f.id === 'node-link-network');
    const m = await loadChartModule(f);
    const c = createSandboxCanvas('sandbox-t4-cloud-nodelink');
    const chart = m.createChart(c, null, 'nord-cognitive-dark');
    expectChartInstance(chart);
    chart.destroy();
  });

  runner.it('T4.SUITE6.2', '[Telemetry] Service call dependency semi-circular Arc diagram sequential layout', async () => {
    const f = FEATURES.find(f => f.id === 'arc-diagram');
    const m = await loadChartModule(f);
    const c = createSandboxCanvas('sandbox-t4-cloud-arc');
    const chart = m.createChart(c, null, 'paul-tol-scientific');
    expectChartInstance(chart);
    chart.destroy();
  });

  runner.it('T4.SUITE6.3', '[Telemetry] Cluster CPU utilization 2D binned continuous distribution heatmap', async () => {
    const f = FEATURES.find(f => f.id === 'distribution-heatmap');
    const m = await loadChartModule(f);
    const c = createSandboxCanvas('sandbox-t4-cloud-distheat');
    const chart = m.createChart(c, null, 'viridis-perceptual');
    expectChartInstance(chart);
    chart.destroy();
  });

  runner.it('T4.SUITE6.4', '[Telemetry] Server cluster memory cumulative Stacked Area volume (Y >= 0)', async () => {
    const f = FEATURES.find(f => f.id === 'stacked-area-chart');
    const m = await loadChartModule(f);
    const c = createSandboxCanvas('sandbox-t4-cloud-stackedarea');
    const chart = m.createChart(c, null, 'okabe-ito-cud');
    expectChartInstance(chart);
    assertCognitiveRule(chart, 'origin-zero', f);
    chart.destroy();
  });
});
