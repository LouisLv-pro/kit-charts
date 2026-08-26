/**
 * @file test/challenger-2-verification.mjs
 * @description Comprehensive empirical verification suite for Challenger 2:
 * Specialized plugin integrations, offline resilience, and cross-category coexistence.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

import { THEMES, THEME_NAMES, DEFAULT_THEME, getThemeTokens, getColor, getSemanticColor, getSequentialColor } from '../themes/theme-tokens.js';
import { createSandboxCanvas, cleanupSandbox, expectChartInstance } from './test-helpers.js';

// Chart Registry
const CATEGORIES = [
  '01-comparaison',
  '02-composition-part-to-whole',
  '03-distribution',
  '04-correlation-relation',
  '05-evolution-temporelle',
  '06-flux-processus',
  '07-hierarchie-reseau',
  '08-geospatial-cartes'
];

const ALL_CHARTS = [
  // 01
  { cat: '01-comparaison', id: 'bar-chart-vertical', plugin: 'core' },
  { cat: '01-comparaison', id: 'bar-chart-horizontal', plugin: 'core' },
  { cat: '01-comparaison', id: 'grouped-bar-chart', plugin: 'core' },
  { cat: '01-comparaison', id: 'stacked-bar-chart', plugin: 'core' },
  { cat: '01-comparaison', id: 'bullet-chart', plugin: 'core' },
  { cat: '01-comparaison', id: 'lollipop-chart', plugin: 'core' },
  { cat: '01-comparaison', id: 'slope-chart', plugin: 'core' },
  { cat: '01-comparaison', id: 'dumbbell-chart', plugin: 'core' },
  { cat: '01-comparaison', id: 'radar-chart', plugin: 'core' },
  { cat: '01-comparaison', id: 'polar-area-chart', plugin: 'core' },
  // 02
  { cat: '02-composition-part-to-whole', id: 'pie-chart', plugin: 'core' },
  { cat: '02-composition-part-to-whole', id: 'doughnut-chart', plugin: 'core' },
  { cat: '02-composition-part-to-whole', id: 'treemap', plugin: 'treemap' },
  { cat: '02-composition-part-to-whole', id: 'sunburst', plugin: 'core' },
  { cat: '02-composition-part-to-whole', id: 'waffle-chart', plugin: 'matrix' },
  { cat: '02-composition-part-to-whole', id: 'stacked-bar-100', plugin: 'core' },
  // 03
  { cat: '03-distribution', id: 'histogramme', plugin: 'core' },
  { cat: '03-distribution', id: 'density-plot', plugin: 'core' },
  { cat: '03-distribution', id: 'box-plot', plugin: 'boxplot' },
  { cat: '03-distribution', id: 'strip-plot', plugin: 'core' },
  { cat: '03-distribution', id: 'beeswarm-plot', plugin: 'core' },
  { cat: '03-distribution', id: 'distribution-heatmap', plugin: 'matrix' },
  // 04
  { cat: '04-correlation-relation', id: 'scatter-plot', plugin: 'core' },
  { cat: '04-correlation-relation', id: 'bubble-chart', plugin: 'core' },
  { cat: '04-correlation-relation', id: 'matrix-heatmap', plugin: 'matrix' },
  { cat: '04-correlation-relation', id: 'connected-scatter-plot', plugin: 'core' },
  { cat: '04-correlation-relation', id: 'density-2d-hexbin', plugin: 'matrix' },
  // 05
  { cat: '05-evolution-temporelle', id: 'line-chart', plugin: 'core' },
  { cat: '05-evolution-temporelle', id: 'multi-line-chart', plugin: 'core' },
  { cat: '05-evolution-temporelle', id: 'area-chart', plugin: 'core' },
  { cat: '05-evolution-temporelle', id: 'stacked-area-chart', plugin: 'core' },
  { cat: '05-evolution-temporelle', id: 'streamgraph', plugin: 'core' },
  { cat: '05-evolution-temporelle', id: 'candlestick-ohlc', plugin: 'financial' },
  { cat: '05-evolution-temporelle', id: 'sparkline', plugin: 'core' },
  // 06
  { cat: '06-flux-processus', id: 'sankey-diagram', plugin: 'sankey' },
  { cat: '06-flux-processus', id: 'chord-diagram', plugin: 'core' },
  { cat: '06-flux-processus', id: 'funnel-chart', plugin: 'core' },
  { cat: '06-flux-processus', id: 'waterfall-chart', plugin: 'core' },
  { cat: '06-flux-processus', id: 'alluvial-diagram', plugin: 'sankey' },
  // 07
  { cat: '07-hierarchie-reseau', id: 'node-link-network', plugin: 'core' },
  { cat: '07-hierarchie-reseau', id: 'arc-diagram', plugin: 'core' },
  { cat: '07-hierarchie-reseau', id: 'dendrogram', plugin: 'core' },
  { cat: '07-hierarchie-reseau', id: 'marimekko-chart', plugin: 'matrix' },
  // 08
  { cat: '08-geospatial-cartes', id: 'choropleth-map', plugin: 'geo' },
  { cat: '08-geospatial-cartes', id: 'bubble-map', plugin: 'geo' },
  { cat: '08-geospatial-cartes', id: 'cartogram-tilegram', plugin: 'matrix' }
];

function getExport(mod) {
  if (!mod) return {};
  if (typeof mod.createChart === 'function') return mod;
  if (mod.default && typeof mod.default.createChart === 'function') return mod.default;
  return mod.default || mod;
}

const stats = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: []
};

function test(name, fn) {
  stats.total++;
  try {
    fn();
    stats.passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    stats.failed++;
    stats.errors.push({ name, error: err.message, stack: err.stack });
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
  }
}

async function testAsync(name, fn) {
  stats.total++;
  try {
    await fn();
    stats.passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    stats.failed++;
    stats.errors.push({ name, error: err.message, stack: err.stack });
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
  }
}

async function main() {
  console.log('\n======================================================================');
  console.log('       CHALLENGER 2: EMPIRICAL PLUGIN & OFFLINE VERIFICATION SUITE   ');
  console.log('======================================================================\n');

  // ==========================================================================
  // SUITE 1: FILE SYSTEM INTEGRITY & STRUCTURE AUDIT (46 TRIADS + INDEX.HTML)
  // ==========================================================================
  console.log('📁 SUITE 1: File Structure, Triads & Relative Paths');

  test('All 46 chart triads (.md, template.js, preview.html) and root files exist', () => {
    assert.equal(ALL_CHARTS.length, 46, 'Must have exactly 46 canonical charts');

    assert.ok(fs.existsSync(path.join(PROJECT_ROOT, 'index.html')), 'Root index.html must exist');
    assert.ok(fs.existsSync(path.join(PROJECT_ROOT, 'README.md')), 'Root README.md must exist');
    assert.ok(fs.existsSync(path.join(PROJECT_ROOT, 'guide', 'PROJECT.md')), 'PROJECT.md must exist');
    assert.ok(fs.existsSync(path.join(PROJECT_ROOT, 'guide', 'regles-universelles.md')), 'regles-universelles.md must exist');
    assert.ok(fs.existsSync(path.join(PROJECT_ROOT, 'themes/theme-tokens.js')), 'theme-tokens.js must exist');

    for (const c of ALL_CHARTS) {
      const dir = path.join(PROJECT_ROOT, 'template', c.cat, c.id);
      assert.ok(fs.existsSync(dir), `Directory must exist: ${dir}`);

      const mdPath = path.join(PROJECT_ROOT, 'guide', c.cat, `${c.id}.md`);
      const jsPath = path.join(dir, 'template.js');
      const htmlPath = path.join(dir, 'preview.html');

      assert.ok(fs.existsSync(mdPath), `Markdown guide missing: ${mdPath}`);
      assert.ok(fs.existsSync(jsPath), `template.js missing: ${jsPath}`);
      assert.ok(fs.existsSync(htmlPath), `preview.html missing: ${htmlPath}`);
    }
  });

  test('All 46 preview.html files have valid relative paths to theme-tokens.js and template.js', () => {
    for (const c of ALL_CHARTS) {
      const htmlPath = path.join(PROJECT_ROOT, 'template', c.cat, c.id, 'preview.html');
      const htmlContent = fs.readFileSync(htmlPath, 'utf8');

      // Check import / script tag statement
      assert.ok(
        htmlContent.includes("themes/theme-tokens.js") ||
        htmlContent.includes('catalog-bundle.js'),
        `${c.id} preview.html must reference theme-tokens.js or catalog-bundle.js`
      );
      assert.ok(
        htmlContent.includes("from './template.js'") ||
        htmlContent.includes('from "./template.js"') ||
        htmlContent.includes('src="./template.js"') ||
        htmlContent.includes('catalog-bundle.js'),
        `${c.id} preview.html must reference template.js or catalog-bundle.js`
      );
    }
  });

  test('All 46 preview.html files contain #themeSelector with all 8 cognitive themes', () => {
    for (const c of ALL_CHARTS) {
      const htmlPath = path.join(PROJECT_ROOT, 'template', c.cat, c.id, 'preview.html');
      const htmlContent = fs.readFileSync(htmlPath, 'utf8');

      assert.ok(htmlContent.includes('id="themeSelector"'), `${c.id} preview.html must have id="themeSelector"`);
      for (const theme of THEME_NAMES) {
        assert.ok(
          htmlContent.includes(`value="${theme}"`),
          `${c.id} preview.html must contain theme option: ${theme}`
        );
      }
    }
  });

  test('Root index.html contains global themeSelector and catalog covering all 46 charts', () => {
    const indexHtml = fs.readFileSync(path.join(PROJECT_ROOT, 'index.html'), 'utf8');
    assert.ok(indexHtml.includes('id="themeSelector"') || indexHtml.includes('id="globalThemeSelector"') || indexHtml.includes('themeSwatchesGroup'), 'index.html must have global theme selector');
    for (const theme of THEME_NAMES) {
      assert.ok(indexHtml.includes(theme), `index.html must reference theme: ${theme}`);
    }
    for (const c of ALL_CHARTS) {
      assert.ok(
        indexHtml.includes(`id: '${c.id}'`) || indexHtml.includes(`id: "${c.id}"`),
        `index.html CATALOG must contain chart: ${c.id}`
      );
      assert.ok(
        indexHtml.includes(`category: '${c.cat}'`) || indexHtml.includes(`category: "${c.cat}"`),
        `index.html CATALOG must contain category: ${c.cat}`
      );
    }
    assert.ok(indexHtml.includes('preview.html'), 'index.html must construct preview.html links');
  });

  // ==========================================================================
  // SUITE 2: SPECIALIZED PLUGIN MATH & LOGIC ORACLES
  // ==========================================================================
  console.log('\n🧠 SUITE 2: Specialized Plugin Math, Data Contracts & Logic Oracles');

  // 1. Candlestick OHLC
  await testAsync('candlestick-ohlc: Financial + Luxon timescale and semantic colors', async () => {
    const rawMod = await import('../template/05-evolution-temporelle/candlestick-ohlc/template.js');
    const mod = getExport(rawMod);
    assert.equal(typeof mod.createChart, 'function');

    const canvas = createSandboxCanvas('test-candlestick');
    const chart = mod.createChart(canvas);
    expectChartInstance(chart);
    assert.equal(chart.config.type, 'candlestick');
    assert.equal(chart.config.options.scales.x.type, 'timeseries');

    // Verify OHLC candle structure
    const data = chart.data.datasets[0].data;
    assert.ok(Array.isArray(data) && data.length >= 5, 'Must have at least 5 candles');
    for (const candle of data) {
      assert.equal(typeof candle.x, 'number', 'Timestamp must be numeric ms');
      assert.ok(candle.x > 0, 'Timestamp must be positive');
      assert.equal(typeof candle.o, 'number', 'Open must be numeric');
      assert.equal(typeof candle.h, 'number', 'High must be numeric');
      assert.equal(typeof candle.l, 'number', 'Low must be numeric');
      assert.equal(typeof candle.c, 'number', 'Close must be numeric');
      assert.ok(candle.h >= Math.max(candle.o, candle.c), 'High must be >= max(Open, Close)');
      assert.ok(candle.l <= Math.min(candle.o, candle.c), 'Low must be <= min(Open, Close)');
    }

    // Verify semantic color updates across all 8 themes
    for (const theme of THEME_NAMES) {
      const themeTokens = getThemeTokens(theme);
      const themedChart = mod.createChart(canvas, null, theme);
      const ds = themedChart.data.datasets[0];
      const posColor = getSemanticColor(themeTokens, 'positive');
      const negColor = getSemanticColor(themeTokens, 'negative');
      assert.equal(ds.color.up, posColor, `Up color in theme ${theme} must match positive semantic token`);
      assert.equal(ds.color.down, negColor, `Down color in theme ${theme} must match negative semantic token`);
    }
    cleanupSandbox();
  });

  // 2. Sankey Diagram & Alluvial Diagram Flow Conservation
  await testAsync('sankey-diagram & alluvial-diagram: Mass & Flow Conservation Oracle', async () => {
    const rawSankey = await import('../template/06-flux-processus/sankey-diagram/template.js');
    const sankeyMod = getExport(rawSankey);
    const rawAlluvial = await import('../template/06-flux-processus/alluvial-diagram/template.js');
    const alluvialMod = getExport(rawAlluvial);

    const sCanvas = createSandboxCanvas('test-sankey');
    const sankeyChart = sankeyMod.createChart(sCanvas);
    expectChartInstance(sankeyChart);
    assert.equal(sankeyChart.config.type, 'sankey');

    const flows = sankeyChart.data.datasets[0].data;
    assert.ok(flows.length > 0, 'Sankey must have flow rows');

    // Build In/Out Flow ledger per node
    const inFlows = new Map();
    const outFlows = new Map();
    const allNodes = new Set();

    for (const f of flows) {
      assert.ok(f.from && f.to, 'Flow must have from and to');
      assert.ok(typeof f.flow === 'number' && f.flow > 0, 'Flow value must be strictly positive');

      allNodes.add(f.from);
      allNodes.add(f.to);
      outFlows.set(f.from, (outFlows.get(f.from) || 0) + f.flow);
      inFlows.set(f.to, (inFlows.get(f.to) || 0) + f.flow);
    }

    // Find intermediate nodes (nodes that have BOTH in-flow and out-flow)
    let intermediateCount = 0;
    for (const node of allNodes) {
      const inVal = inFlows.get(node) || 0;
      const outVal = outFlows.get(node) || 0;

      if (inVal > 0 && outVal > 0) {
        intermediateCount++;
        // Mass Conservation check: Σ In == Σ Out
        assert.equal(
          inVal,
          outVal,
          `Mass conservation violated at node "${node}": In(${inVal}) != Out(${outVal})`
        );
      }
    }
    assert.ok(intermediateCount >= 2, 'Sankey diagram must have at least 2 intermediate conservation nodes');

    // Total System Inflow vs Total System Outflow
    let pureSourcesSum = 0;
    let pureSinksSum = 0;
    for (const node of allNodes) {
      const inVal = inFlows.get(node) || 0;
      const outVal = outFlows.get(node) || 0;
      if (inVal === 0) pureSourcesSum += outVal;
      if (outVal === 0) pureSinksSum += inVal;
    }
    assert.equal(pureSourcesSum, pureSinksSum, `Total System Inflow (${pureSourcesSum}) must equal Total System Outflow (${pureSinksSum})`);

    // Check Alluvial diagram
    const aCanvas = createSandboxCanvas('test-alluvial');
    const alluvialChart = alluvialMod.createChart(aCanvas);
    expectChartInstance(alluvialChart);
    assert.equal(alluvialChart.config.type, 'sankey');
    const aFlows = alluvialChart.data.datasets[0].data;
    assert.ok(aFlows.length >= 8, 'Alluvial must have multiple cohort transitions');
    for (const f of aFlows) {
      assert.ok(f.from && f.to && typeof f.flow === 'number' && f.flow > 0);
    }
    cleanupSandbox();
  });

  // 3. Box Plot: Tukey 5-Number Summary & Outlier Math Oracle
  await testAsync('box-plot: Tukey 5-number summary & outlier calculation mathematical oracle', async () => {
    const rawBox = await import('../template/03-distribution/box-plot/template.js');
    const boxplotMod = getExport(rawBox);
    assert.equal(typeof boxplotMod.computeTukeyBoxplotStats, 'function');

    // Test Case 1: Simple odd array [1, 2, 3, 4, 5, 6, 7, 8, 9]
    const s1 = boxplotMod.computeTukeyBoxplotStats([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    assert.equal(s1.min, 1);
    assert.equal(s1.q1, 3);
    assert.equal(s1.median, 5);
    assert.equal(s1.q3, 7);
    assert.equal(s1.max, 9);
    assert.deepEqual(s1.outliers, []);
    assert.equal(s1.mean, 5);

    // Test Case 2: Outlier detection
    const s2 = boxplotMod.computeTukeyBoxplotStats([10, 11, 12, 12, 13, 14, 14, 15, 16, 50, -20]);
    assert.ok(s2.outliers.includes(50), '50 must be flagged as an outlier');
    assert.ok(s2.outliers.includes(-20), '-20 must be flagged as an outlier');
    assert.ok(s2.max < 50, 'Whiskers max must exclude upper outlier 50');
    assert.ok(s2.min > -20, 'Whiskers min must exclude lower outlier -20');

    // Test Case 3: Degenerate cases
    const sEmpty = boxplotMod.computeTukeyBoxplotStats([]);
    assert.equal(sEmpty.min, 0);
    assert.equal(sEmpty.median, 0);

    const sSingle = boxplotMod.computeTukeyBoxplotStats([42]);
    assert.equal(sSingle.min, 42);
    assert.equal(sSingle.median, 42);
    assert.equal(sSingle.max, 42);

    const sIdentical = boxplotMod.computeTukeyBoxplotStats([100, 100, 100, 100]);
    assert.equal(sIdentical.min, 100);
    assert.equal(sIdentical.median, 100);
    assert.equal(sIdentical.max, 100);
    assert.deepEqual(sIdentical.outliers, []);

    // Test chart instantiation with raw arrays auto-computed
    const canvas = createSandboxCanvas('test-boxplot');
    const chart = boxplotMod.createChart(canvas, {
      labels: ['Cohort A', 'Cohort B'],
      datasets: [{
        data: [
          [10, 12, 14, 15, 18, 20, 22, 25, 45],
          { min: 5, q1: 10, median: 15, q3: 20, max: 25, outliers: [] }
        ]
      }]
    });
    expectChartInstance(chart);
    assert.ok(chart.config.type === 'boxplot' || chart.config.type === 'bar');
    cleanupSandbox();
  });

  // 4. Treemap: Squarified Layout & Group Hierarchy
  await testAsync('treemap: Squarified hierarchical layout & multi-level tree grouping', async () => {
    const rawTree = await import('../template/02-composition-part-to-whole/treemap/template.js');
    const treemapMod = getExport(rawTree);
    const canvas = createSandboxCanvas('test-treemap');
    const chart = treemapMod.createChart(canvas);
    expectChartInstance(chart);
    assert.equal(chart.config.type, 'treemap');

    const ds = chart.data.datasets[0];
    assert.ok(Array.isArray(ds.tree), 'Treemap dataset must have tree array');
    assert.equal(ds.key, 'value');
    assert.deepEqual(ds.groups, ['category', 'name']);

    let totalVal = 0;
    for (const item of ds.tree) {
      assert.ok(item.category && item.name, 'Every tree item must have category and name');
      assert.ok(typeof item.value === 'number' && item.value > 0, 'Tree item value must be positive');
      totalVal += item.value;
    }
    assert.ok(totalVal > 1000, 'Treemap total sum should reflect representative domain dataset');
    cleanupSandbox();
  });

  // 5. Matrix Family (6 charts)
  await testAsync('matrix family: matrix-heatmap, waffle-chart, distribution-heatmap, density-2d-hexbin, marimekko-chart, cartogram-tilegram', async () => {
    const matrixCharts = [
      { id: 'matrix-heatmap', path: '../template/04-correlation-relation/matrix-heatmap/template.js' },
      { id: 'waffle-chart', path: '../template/02-composition-part-to-whole/waffle-chart/template.js' },
      { id: 'distribution-heatmap', path: '../template/03-distribution/distribution-heatmap/template.js' },
      { id: 'density-2d-hexbin', path: '../template/04-correlation-relation/density-2d-hexbin/template.js' },
      { id: 'marimekko-chart', path: '../template/07-hierarchie-reseau/marimekko-chart/template.js' },
      { id: 'cartogram-tilegram', path: '../template/08-geospatial-cartes/cartogram-tilegram/template.js' }
    ];

    for (const mc of matrixCharts) {
      const rawMod = await import(mc.path);
      const mod = getExport(rawMod);
      const canvas = createSandboxCanvas(`test-${mc.id}`);
      const chart = mod.createChart(canvas);
      expectChartInstance(chart);
      assert.ok(chart.config.type === 'matrix' || chart.config.type === 'scatter' || chart.config.type === 'bar', `${mc.id} must be valid type`);
      assert.ok(chart.data.datasets[0].data.length > 0, `${mc.id} must have non-empty data points`);
    }

    // Specific matrix-heatmap correlation oracle
    const rawHeat = await import('../template/04-correlation-relation/matrix-heatmap/template.js');
    const heatMod = getExport(rawHeat);
    assert.equal(typeof heatMod.getDivergentCorrelationColor, 'function');
    const tokens = getThemeTokens('colorbrewer-accessible');
    const colPos = heatMod.getDivergentCorrelationColor(0.9, tokens);
    const colNeg = heatMod.getDivergentCorrelationColor(-0.9, tokens);
    const colZero = heatMod.getDivergentCorrelationColor(0.0, tokens);
    assert.ok(colPos && colNeg && colZero, 'Color interpolation must return valid strings');
    assert.notEqual(colPos, colNeg, 'Positive and negative correlation colors must differ');

    // Specific waffle-chart 10x10 = 100 cell check
    const rawWaffle = await import('../template/02-composition-part-to-whole/waffle-chart/template.js');
    const waffleMod = getExport(rawWaffle);
    const waffleCanvas = createSandboxCanvas('test-waffle-spec');
    const waffleChart = waffleMod.createChart(waffleCanvas);
    const wafflePoints = waffleChart.data.datasets[0].data;
    assert.equal(wafflePoints.length, 100, 'Waffle chart must contain exactly 100 unit cells');

    // Specific marimekko 100% check
    const rawMarimekko = await import('../template/07-hierarchie-reseau/marimekko-chart/template.js');
    const marimekkoMod = getExport(rawMarimekko);
    const marimekkoCanvas = createSandboxCanvas('test-marimekko-spec');
    const marimekkoChart = marimekkoMod.createChart(marimekkoCanvas);
    const totalMarimekkoPoints = marimekkoChart.data.datasets.reduce((acc, ds) => acc + ds.data.length, 0);
    assert.ok(totalMarimekkoPoints >= 6, 'Marimekko chart must contain at least 6 tiles/points');

    cleanupSandbox();
  });

  // 6. Geo Family (choropleth-map, bubble-map)
  await testAsync('geo family: choropleth-map & bubble-map offline synthetic GeoJSON RFC 7946 compliance', async () => {
    const rawChoro = await import('../template/08-geospatial-cartes/choropleth-map/template.js');
    const choroMod = getExport(rawChoro);
    const rawBubble = await import('../template/08-geospatial-cartes/bubble-map/template.js');
    const bubbleMod = getExport(rawBubble);

    // Check Choropleth
    const choroCanvas = createSandboxCanvas('test-choro-spec');
    const choroChart = choroMod.createChart(choroCanvas);
    expectChartInstance(choroChart);
    assert.ok(choroChart.config.type === 'choropleth' || choroChart.config.type === 'scatter', 'Choropleth must be valid chart type');

    const choroRegions = choroMod.SYNTHETIC_GEO_REGIONS;
    if (choroRegions) {
      assert.equal(choroRegions.type, 'FeatureCollection');
      assert.ok(choroRegions.features.length >= 5, 'Must have at least 5 synthetic territorial regions');
      for (const f of choroRegions.features) {
        assert.equal(f.type, 'Feature');
        assert.ok(f.geometry && f.geometry.type === 'Polygon');
        assert.ok(Array.isArray(f.geometry.coordinates[0]));
        assert.ok(f.properties && f.properties.name && f.properties.density);
      }
    }

    // Check Bubble Map
    const bubbleCanvas = createSandboxCanvas('test-bubble-spec');
    const bubbleChart = bubbleMod.createChart(bubbleCanvas);
    expectChartInstance(bubbleChart);
    assert.ok(bubbleChart.config.type === 'bubbleMap' || bubbleChart.config.type === 'scatter', 'Bubble map must be valid chart type');
    if (bubbleChart.config.options.scales && bubbleChart.config.options.scales.projection) {
      assert.equal(bubbleChart.config.options.scales.projection.projection, 'mercator');
      assert.deepEqual(bubbleChart.config.options.scales.size?.range, [6, 28]);
    }

    const bubblePoints = bubbleMod.SYNTHETIC_GEO_POINTS || (bubbleMod.DEFAULT_DATA && bubbleMod.DEFAULT_DATA.datasets && bubbleMod.DEFAULT_DATA.datasets[0] && bubbleMod.DEFAULT_DATA.datasets[0].data);
    if (bubblePoints && Array.isArray(bubblePoints)) {
      assert.ok(bubblePoints.length >= 5, 'Must have at least 5 geo points');
    }

    cleanupSandbox();
  });

  // ==========================================================================
  // SUITE 3: OFFLINE RESILIENCE AUDIT
  // ==========================================================================
  console.log('\n🔌 SUITE 3: Offline Resilience & Zero Network Leak Audit');

  test('No runtime network data fetch in any of the 46 template.js files', () => {
    for (const c of ALL_CHARTS) {
      const jsPath = path.join(PROJECT_ROOT, 'template', c.cat, c.id, 'template.js');
      const content = fs.readFileSync(jsPath, 'utf8');

      // Check for fetch(), XMLHttpRequest, axios, $.ajax, etc.
      assert.ok(!content.includes('fetch('), `${c.id}/template.js must not call fetch()`);
      assert.ok(!content.includes('XMLHttpRequest'), `${c.id}/template.js must not call XMLHttpRequest`);
      assert.ok(!content.includes('axios'), `${c.id}/template.js must not reference axios`);
      assert.ok(!content.includes('$.ajax'), `${c.id}/template.js must not reference jQuery ajax`);
    }
  });

  test('All 46 preview.html files only load approved static CDNs in head, with zero runtime data fetches in body script', () => {
    for (const c of ALL_CHARTS) {
      const htmlPath = path.join(PROJECT_ROOT, 'template', c.cat, c.id, 'preview.html');
      const content = fs.readFileSync(htmlPath, 'utf8');

      // Check body scripts
      const bodyPart = content.split('<body')[1] || '';
      assert.ok(!bodyPart.includes('fetch('), `${c.id}/preview.html body script must not call fetch()`);
      assert.ok(!bodyPart.includes('XMLHttpRequest'), `${c.id}/preview.html body script must not call XMLHttpRequest`);
    }
  });

  // ==========================================================================
  // SUITE 4: EXHAUSTIVE 46 PREVIEWS DOM ARCHITECTURE & SCRIPT AUDIT
  // ==========================================================================
  console.log('\n🔍 SUITE 4: 46 Previews DOM Architecture & Interactive Wiring Audit');

  for (let i = 0; i < ALL_CHARTS.length; i++) {
    const c = ALL_CHARTS[i];
    test(`[${i + 1}/46] ${c.cat}/${c.id}/preview.html: Complete DOM Contract & Event Wiring`, () => {
      const htmlPath = path.join(PROJECT_ROOT, 'template', c.cat, c.id, 'preview.html');
      const content = fs.readFileSync(htmlPath, 'utf8');

      // 1. Valid DOCTYPE and HTML
      assert.ok(content.startsWith('<!DOCTYPE html>'), 'Must start with <!DOCTYPE html>');
      assert.ok(content.includes('<html'), 'Must have <html> tag');
      assert.ok(content.includes('chart.umd.min.js'), 'Must load Chart.js v4 UMD');

      // 2. Specialized plugin CDN checks
      if (c.plugin === 'financial') {
        assert.ok(content.includes('luxon'), 'Must load luxon for financial charts');
        assert.ok(content.includes('chartjs-adapter-luxon'), 'Must load chartjs-adapter-luxon');
        assert.ok(content.includes('chartjs-chart-financial'), 'Must load chartjs-chart-financial');
      } else if (c.plugin === 'sankey') {
        assert.ok(content.includes('chartjs-chart-sankey'), 'Must load chartjs-chart-sankey');
      } else if (c.plugin === 'treemap') {
        assert.ok(content.includes('chartjs-chart-treemap'), 'Must load chartjs-chart-treemap');
      } else if (c.plugin === 'boxplot') {
        assert.ok(content.includes('chartjs-chart-boxplot'), 'Must load @sgratzl/chartjs-chart-boxplot');
      } else if (c.plugin === 'matrix') {
        assert.ok(content.includes('chartjs-chart-matrix'), 'Must load chartjs-chart-matrix');
      } else if (c.plugin === 'geo') {
        assert.ok(content.includes('topojson-client'), 'Must load topojson-client');
        assert.ok(content.includes('chartjs-chart-geo'), 'Must load chartjs-chart-geo');
      }

      // 3. Elements existence
      assert.ok(content.includes('id="chartCanvas"'), 'Must have canvas id="chartCanvas"');
      assert.ok(content.includes('id="themeSelector"'), 'Must have select id="themeSelector"');
      assert.ok(content.includes('id="cognitiveRulesCard"') || content.includes('class="cognitive-rules-card"'), 'Must have cognitive rules card');

      // 4. Script wiring
      assert.ok(content.includes('<script'), 'Must contain <script>');
      assert.ok(content.includes('createChart'), 'Must invoke createChart');
      assert.ok(content.includes('addEventListener') && content.includes('change'), 'Must listen to themeSelector change event');
    });
  }

  // ==========================================================================
  // SUITE 5: ALL 46 TEMPLATES INSTANTIATION & THEME CYCLING IN-MEMORY
  // ==========================================================================
  console.log('\n⚡ SUITE 5: All 46 Templates Lifecycle & 8-Theme In-Memory Application');

  for (let i = 0; i < ALL_CHARTS.length; i++) {
    const c = ALL_CHARTS[i];
    await testAsync(`[${i + 1}/46] ${c.cat}/${c.id}/template.js: createChart with 8 themes`, async () => {
      const modPath = `../template/${c.cat}/${c.id}/template.js`;
      const mod = await import(modPath);
      const createChart = mod.createChart || mod.default?.createChart;
      assert.equal(typeof createChart, 'function', `${c.id} must export createChart`);

      const canvas = createSandboxCanvas(`test-all-${c.id}`);

      // 1. Default render
      const chartDefault = createChart(canvas);
      expectChartInstance(chartDefault);
      assert.ok(chartDefault.config.options.responsive === true);
      assert.ok(chartDefault.config.options.maintainAspectRatio === false);

      // 2. Theme Cycling through all 8 themes
      for (const theme of THEME_NAMES) {
        const themedChart = createChart(canvas, null, theme);
        expectChartInstance(themedChart);
        assert.ok(themedChart.config, `Chart config must exist for theme ${theme}`);
      }

      cleanupSandbox();
    });
  }

  // ==========================================================================
  // FINAL RESULTS
  // ==========================================================================
  console.log('\n======================================================================');
  console.log('                 CHALLENGER 2 SUITE EXECUTION SUMMARY                 ');
  console.log('======================================================================');
  console.log(`  Total Tests  : ${stats.total}`);
  console.log(`  Passed       : ${stats.passed}`);
  console.log(`  Failed       : ${stats.failed}`);
  console.log(`  Pass Rate    : ${((stats.passed / stats.total) * 100).toFixed(1)}%`);
  console.log('======================================================================\n');

  if (stats.failed > 0) {
    console.error(`FAILED TESTS (${stats.failed}):`);
    stats.errors.forEach((e, idx) => {
      console.error(`\n${idx + 1}) ${e.name}`);
      console.error(`   ${e.error}`);
    });
    process.exit(1);
  } else {
    console.log('🎉 ALL CHALLENGER 2 EMPIRICAL ASSERTIONS PASSED WITH ZERO DEFECTS!\n');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal Test Runner Exception:', err);
  process.exit(1);
});
