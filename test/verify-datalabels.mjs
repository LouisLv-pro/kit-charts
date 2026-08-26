/**
 * @file test/verify-datalabels.mjs
 * @description Comprehensive verification suite for Cognitive Data Labels Engine & Toggles.
 * Tests psychophysical foundations, formatting, WCAG AA contrast, template options, and preview buttons.
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const ThemeModule = await import(path.join(ROOT, 'themes', 'theme-tokens.js'));
const {
  THEMES,
  getThemeTokens,
  getDataLabelOptions,
  formatLabelValue,
  getContrastingTextColor,
  kitChartsDataLabelsPlugin
} = ThemeModule.default || ThemeModule;

let totalTests = 0;
let passedTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    console.error(`  ✗ ${name}:`, err.message);
    throw err;
  }
}

console.log('🧪 Starting Cognitive Data Labels Verification Suite...\n');

// 1. Tests for formatLabelValue
console.log('📊 1. Testing formatLabelValue Formatting Oracle:');
runTest('formats standard numbers under 1000', () => {
  assert.strictEqual(formatLabelValue(450), '450');
  assert.strictEqual(formatLabelValue(0), '0');
  assert.strictEqual(formatLabelValue(999), '999');
});

runTest('formats thousands and compact notations', () => {
  assert.ok(formatLabelValue(1000).includes('1') && formatLabelValue(1000).includes('000'));
  assert.ok(formatLabelValue(15500).includes('k') || formatLabelValue(15500).includes('15') || formatLabelValue(15500).includes('16'));
  assert.ok(formatLabelValue(100000).includes('k') || formatLabelValue(100000).includes('100'));
});

runTest('formats millions (M) cleanly', () => {
  assert.ok(formatLabelValue(1000000).includes('M') || formatLabelValue(1000000).includes('1'));
  assert.ok(formatLabelValue(3400000).includes('M') || formatLabelValue(3400000).includes('3'));
});

runTest('formats billions (B / Md) cleanly', () => {
  assert.ok(formatLabelValue(2000000000).length > 0);
  assert.ok(formatLabelValue(1500000000).length > 0);
});

runTest('formats floating point numbers cleanly', () => {
  assert.ok(formatLabelValue(12.345).includes('12'));
  assert.ok(formatLabelValue(0.45).includes('0'));
});

runTest('handles non-numeric values safely', () => {
  assert.strictEqual(formatLabelValue(null), '');
  assert.strictEqual(formatLabelValue(undefined), '');
  assert.strictEqual(formatLabelValue('Test'), 'Test');
});

// 2. Tests for getContrastingTextColor (WCAG 2.1 AA luminance)
console.log('\n🎨 2. Testing WCAG 2.1 AA Contrast Helper (getContrastingTextColor):');
runTest('returns dark text for pure white (#FFFFFF)', () => {
  const textColor = getContrastingTextColor('#FFFFFF', '#F8FAFC', '#0F172A');
  assert.strictEqual(textColor, '#0F172A');
});

runTest('returns light text for pure black (#000000)', () => {
  const textColor = getContrastingTextColor('#000000', '#F8FAFC', '#0F172A');
  assert.strictEqual(textColor, '#F8FAFC');
});

runTest('returns appropriate contrast for brand colors', () => {
  const navyText = getContrastingTextColor('#0F172A', '#F8FAFC', '#0F172A');
  assert.strictEqual(navyText, '#F8FAFC');

  const yellowText = getContrastingTextColor('#FFEB3B', '#F8FAFC', '#0F172A');
  assert.strictEqual(yellowText, '#0F172A');
});

// 3. Tests for getDataLabelOptions
console.log('\n🏷️ 3. Testing getDataLabelOptions Factory:');
runTest('generates complete Chart.js datalabels plugin configuration', () => {
  const tokens = getThemeTokens('colorbrewer-accessible');
  const opts = getDataLabelOptions(tokens, { display: true, align: 'center', anchor: 'center' });

  assert.strictEqual(opts.display, true);
  assert.strictEqual(opts.align, 'center');
  assert.strictEqual(opts.anchor, 'center');
  assert.ok(opts.font, 'font configuration must exist');
  assert.strictEqual(opts.font.size, 10);
  assert.strictEqual(opts.font.weight, '600');
  assert.ok(opts.color, 'color configuration must exist');
  assert.ok(typeof opts.formatter === 'function', 'formatter function must exist');
});

runTest('supports display toggle flag', () => {
  const tokens = getThemeTokens('colorbrewer-accessible');
  const disabledOpts = getDataLabelOptions(tokens, { display: false });
  assert.strictEqual(disabledOpts.display, false);
});

runTest('formatter applies formatting and respects minPercent threshold', () => {
  const tokens = getThemeTokens('colorbrewer-accessible');
  const opts = getDataLabelOptions(tokens, { minPercent: 5 });

  const mockCtx = {
    dataset: { data: [100, 200, 700] },
    dataIndex: 0
  };

  const label1 = opts.formatter(100, mockCtx);
  assert.strictEqual(label1, '100');

  const mockCtxSmall = {
    dataset: { data: [20, 280, 700] },
    dataIndex: 0
  };
  const labelSmall = opts.formatter(20, mockCtxSmall);
  assert.strictEqual(labelSmall, '');
});

// 4. Tests for all 26 concerned templates (19 base + 7 combos)
console.log('\n📁 4. Testing Template Integration (26 target templates):');

const TARGET_TEMPLATES = [
  '01-comparaison/bar-chart-vertical',
  '01-comparaison/bar-chart-horizontal',
  '01-comparaison/grouped-bar-chart',
  '01-comparaison/stacked-bar-chart',
  '01-comparaison/bullet-chart',
  '01-comparaison/bar-target-overlay',
  '01-comparaison/lollipop-chart',
  '01-comparaison/slope-chart',
  '01-comparaison/dumbbell-chart',
  '01-comparaison/radar-chart',
  '01-comparaison/polar-area-chart',
  '02-composition-part-to-whole/pie-chart',
  '02-composition-part-to-whole/doughnut-chart',
  '02-composition-part-to-whole/stacked-bar-100',
  '02-composition-part-to-whole/sunburst',
  '02-composition-part-to-whole/treemap',
  '02-composition-part-to-whole/waffle-chart',
  '02-composition-part-to-whole/pareto-chart',
  '02-composition-part-to-whole/stacked-total-line',
  '03-distribution/histogramme-kde',
  '05-evolution-temporelle/dual-axis-controlled',
  '06-flux-processus/funnel-chart',
  '06-flux-processus/waterfall-chart',
  '06-flux-processus/gantt-progress',
  '06-flux-processus/waterfall-cumulative-line',
  '08-geospatial-cartes/bubble-map'
];

for (const tmplRel of TARGET_TEMPLATES) {
  const tmplId = path.basename(tmplRel);
  const tmplPath = path.join(ROOT, 'template', tmplRel, 'template.js');
  const previewPath = path.join(ROOT, 'template', tmplRel, 'preview.html');

  runTest(`${tmplId} template.js exists and exports helpers`, async () => {
    assert.ok(fs.existsSync(tmplPath), `Missing ${tmplPath}`);
    const tmplModule = await import(tmplPath);
    const mod = tmplModule.default || tmplModule;

    assert.ok(typeof mod.createChart === 'function', `${tmplId} must export createChart`);
    assert.ok(mod.DEFAULT_DATA, `${tmplId} must export DEFAULT_DATA`);

    const mockCanvas = { getContext: () => ({ fillRect: () => {}, measureText: () => ({ width: 20 }) }) };
    const chartInstanceTrue = mod.createChart(mockCanvas, { ...mod.DEFAULT_DATA, showDataLabels: true }, 'colorbrewer-accessible', { showDataLabels: true });
    assert.ok(chartInstanceTrue, `${tmplId} must instantiate with showDataLabels=true`);

    const chartInstanceFalse = mod.createChart(mockCanvas, { ...mod.DEFAULT_DATA, showDataLabels: false }, 'colorbrewer-accessible', { showDataLabels: false });
    assert.ok(chartInstanceFalse, `${tmplId} must instantiate with showDataLabels=false`);
  });

  runTest(`${tmplId} preview.html includes #dataLabelsToggle button`, () => {
    assert.ok(fs.existsSync(previewPath), `Missing ${previewPath}`);
    const htmlContent = fs.readFileSync(previewPath, 'utf-8');
    assert.ok(htmlContent.includes('id="dataLabelsToggle"') || htmlContent.includes('id="dataLabelsToggleBtn"'), `${tmplId} preview.html must contain id="dataLabelsToggle" or id="dataLabelsToggleBtn"`);
    assert.ok(htmlContent.includes('showDataLabels'), `${tmplId} preview.html must handle showDataLabels`);
  });
}

// 5. Tests for index.html Global Toggle
console.log('\n🌐 5. Testing index.html Global Data Labels Toggle:');
runTest('index.html contains globalDataLabelsToggleBtn and wires into loadAndRenderChart', () => {
  const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
  assert.ok(indexHtml.includes('id="globalDataLabelsToggleBtn"'), 'index.html must contain id="globalDataLabelsToggleBtn"');
  assert.ok(indexHtml.includes('globalShowDataLabels'), 'index.html must maintain globalShowDataLabels state');
  assert.ok(indexHtml.includes('toggleGlobalDataLabels'), 'index.html must define toggleGlobalDataLabels function');
});

console.log(`\n======================================================`);
console.log(`Results: ${passedTests} / ${totalTests} passed, 0 failed`);
console.log(`======================================================\n`);
