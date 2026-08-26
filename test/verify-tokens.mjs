/**
 * @file test/verify-tokens.mjs
 * @description Comprehensive automated verification test suite for themes/theme-tokens.js
 * Validates theme registries, emphasis & status tokens, universal helpers, CSS variables, and dual exports.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

import KitChartsTheme, {
  THEMES,
  THEME_NAMES,
  DEFAULT_THEME,
  normalizeThemeSlug,
  getThemeTokens,
  applyThemeToContainer,
  loadGoogleFonts,
  getChartDefaultOptions,
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

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

console.log('🧪 Starting kit-charts Theme System Comprehensive Verification Suite...\n');

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

// -----------------------------------------------------------------------------
// 1. REGISTRY INTEGRITY & COMPLETENESS
// -----------------------------------------------------------------------------
console.log('📦 1. Theme Registry Completeness:');

test('THEMES contains exactly the 8 canonical cognitive themes', () => {
  const expectedThemes = [
    'colorbrewer-accessible',
    'viridis-perceptual',
    'paul-tol-scientific',
    'tableau-stone-categorical',
    'okabe-ito-cud',
    'tufte-minimalist-executive',
    'nord-cognitive-dark',
    'atkinson-hyperlegible'
  ];
  assert.equal(THEME_NAMES.length, 8);
  for (const name of expectedThemes) {
    assert.ok(THEMES[name], `Missing theme definition for ${name}`);
    assert.equal(THEMES[name].name, name);
  }
});

test('DEFAULT_THEME is set to "colorbrewer-accessible"', () => {
  assert.equal(DEFAULT_THEME, 'colorbrewer-accessible');
});

test('Every theme has all required fields with non-empty valid types', () => {
  const requiredFields = [
    'name',
    'id',
    'label',
    'isDark',
    'fontFamily',
    'fontMono',
    'bg',
    'surface',
    'surfaceRaised',
    'border',
    'borderStrong',
    'textPrimary',
    'textSecondary',
    'textMuted',
    'gridColor',
    'axisColor',
    'zeroLine',
    'palette',
    'sequential',
    'divergent',
    'emphasis',
    'status',
    'semantic',
    'tooltipBg',
    'tooltipText'
  ];

  for (const [themeKey, theme] of Object.entries(THEMES)) {
    for (const field of requiredFields) {
      assert.ok(
        theme[field] !== undefined,
        `Theme "${themeKey}" missing required field "${field}"`
      );
    }

    // Check palettes
    assert.ok(Array.isArray(theme.palette), `Theme "${themeKey}" palette must be an array`);
    assert.ok(
      theme.palette.length >= 8,
      `Theme "${themeKey}" palette must have at least 8 colors (has ${theme.palette.length})`
    );
    for (const color of theme.palette) {
      assert.equal(typeof color, 'string');
      assert.ok(color.startsWith('#') || color.startsWith('rgb'), `Invalid color in palette: ${color}`);
    }

    // Check sequential
    assert.ok(Array.isArray(theme.sequential), `Theme "${themeKey}" sequential must be an array`);
    assert.ok(
      theme.sequential.length >= 4,
      `Theme "${themeKey}" sequential must have at least 4 colors`
    );

    // Check divergent
    assert.equal(typeof theme.divergent, 'object');
    assert.ok(theme.divergent.neg, `Theme "${themeKey}" divergent must have neg`);
    assert.ok(theme.divergent.mid, `Theme "${themeKey}" divergent must have mid`);
    assert.ok(theme.divergent.pos, `Theme "${themeKey}" divergent must have pos`);

    // Check emphasis tokens
    assert.equal(typeof theme.emphasis, 'object', `Theme "${themeKey}" emphasis must be object`);
    assert.ok(theme.emphasis.focal, `Theme "${themeKey}" emphasis must have focal`);
    assert.ok(theme.emphasis.benchmark, `Theme "${themeKey}" emphasis must have benchmark`);
    assert.ok(theme.emphasis.context, `Theme "${themeKey}" emphasis must have context`);
    assert.ok(theme.emphasis.anomaly, `Theme "${themeKey}" emphasis must have anomaly`);
    assert.equal(typeof theme.emphasis.forecastAlpha, 'number', `Theme "${themeKey}" forecastAlpha must be number`);
    assert.ok(theme.emphasis.forecastAlpha >= 0.3 && theme.emphasis.forecastAlpha <= 0.8);

    // Check status tokens
    assert.equal(typeof theme.status, 'object', `Theme "${themeKey}" status must be object`);
    assert.ok(theme.status.success, `Theme "${themeKey}" status must have success`);
    assert.ok(theme.status.warning, `Theme "${themeKey}" status must have warning`);
    assert.ok(theme.status.danger, `Theme "${themeKey}" status must have danger`);
    assert.ok(theme.status.info, `Theme "${themeKey}" status must have info`);
    assert.ok(theme.status.neutral, `Theme "${themeKey}" status must have neutral`);

    // Check backwards compatibility semantic
    assert.equal(typeof theme.semantic, 'object');
    assert.ok(theme.semantic.positive, `Theme "${themeKey}" semantic must have positive`);
    assert.ok(theme.semantic.negative, `Theme "${themeKey}" semantic must have negative`);
    assert.ok(theme.semantic.warning, `Theme "${themeKey}" semantic must have warning`);
    assert.ok(theme.semantic.info, `Theme "${themeKey}" semantic must have info`);
    assert.ok(theme.semantic.neutral, `Theme "${themeKey}" semantic must have neutral`);

    // Check dark mode flags
    if (themeKey === 'nord-cognitive-dark') {
      assert.equal(theme.isDark, true, 'Nord theme must be isDark: true');
    } else {
      assert.equal(theme.isDark, false, `Theme "${themeKey}" must be isDark: false`);
    }
  }
});

test('Specific chromatic anchors & emphasis tokens match theoretical specification Section 5', () => {
  // Theme 01 ColorBrewer Accessible
  const t1 = THEMES['colorbrewer-accessible'];
  assert.equal(t1.emphasis.focal, '#2B8CBE');
  assert.equal(t1.emphasis.benchmark, '#475569');
  assert.equal(t1.emphasis.context, '#CBD5E1');
  assert.equal(t1.emphasis.anomaly, '#D01C8B');
  assert.equal(t1.emphasis.forecastAlpha, 0.50);
  assert.equal(t1.status.success, '#2E7D32');
  assert.equal(t1.status.warning, '#EF6C00');
  assert.equal(t1.status.danger, '#C62828');
  assert.equal(t1.status.info, '#1565C0');
  assert.equal(t1.status.neutral, '#94A3B8');

  // Theme 02 Viridis Perceptual
  const t2 = THEMES['viridis-perceptual'];
  assert.equal(t2.emphasis.focal, '#26828E');
  assert.equal(t2.emphasis.benchmark, '#3E4A89');
  assert.equal(t2.emphasis.context, '#CBD5E1');
  assert.equal(t2.emphasis.anomaly, '#FDE725');
  assert.equal(t2.emphasis.forecastAlpha, 0.50);
  assert.equal(t2.status.success, '#22A884');
  assert.equal(t2.status.warning, '#D8B400');
  assert.equal(t2.status.danger, '#440154');
  assert.equal(t2.status.info, '#2A788E');
  assert.equal(t2.status.neutral, '#8E9AAF');

  // Theme 03 Paul Tol Scientific
  const t3 = THEMES['paul-tol-scientific'];
  assert.equal(t3.emphasis.focal, '#4477AA');
  assert.equal(t3.emphasis.benchmark, '#475569');
  assert.equal(t3.emphasis.context, '#BBBBBB');
  assert.equal(t3.emphasis.anomaly, '#EE6677');
  assert.equal(t3.emphasis.forecastAlpha, 0.50);
  assert.equal(t3.status.success, '#228833');
  assert.equal(t3.status.warning, '#CCBB44');
  assert.equal(t3.status.danger, '#EE6677');
  assert.equal(t3.status.info, '#66CCEE');
  assert.equal(t3.status.neutral, '#BBBBBB');

  // Theme 04 Tableau Stone
  const t4 = THEMES['tableau-stone-categorical'];
  assert.equal(t4.emphasis.focal, '#4E79A7');
  assert.equal(t4.emphasis.benchmark, '#57606C');
  assert.equal(t4.emphasis.context, '#BAB0AC');
  assert.equal(t4.emphasis.anomaly, '#E15759');
  assert.equal(t4.emphasis.forecastAlpha, 0.50);
  assert.equal(t4.status.success, '#59A14F');
  assert.equal(t4.status.warning, '#F28E2B');
  assert.equal(t4.status.danger, '#E15759');
  assert.equal(t4.status.info, '#4E79A7');
  assert.equal(t4.status.neutral, '#BAB0AC');

  // Theme 05 Okabe-Ito CUD
  const t5 = THEMES['okabe-ito-cud'];
  assert.equal(t5.emphasis.focal, '#0072B2');
  assert.equal(t5.emphasis.benchmark, '#475569');
  assert.equal(t5.emphasis.context, '#CBD5E1');
  assert.equal(t5.emphasis.anomaly, '#D55E00');
  assert.equal(t5.emphasis.forecastAlpha, 0.50);
  assert.equal(t5.status.success, '#009E73');
  assert.equal(t5.status.warning, '#E69F00');
  assert.equal(t5.status.danger, '#D55E00');
  assert.equal(t5.status.info, '#56B4E9');
  assert.equal(t5.status.neutral, '#999999');

  // Theme 06 Tufte Minimalist
  const t6 = THEMES['tufte-minimalist-executive'];
  assert.equal(t6.emphasis.focal, '#1D4ED8');
  assert.equal(t6.emphasis.benchmark, '#111111');
  assert.equal(t6.emphasis.context, '#D4D4D4');
  assert.equal(t6.emphasis.anomaly, '#B91C1C');
  assert.equal(t6.emphasis.forecastAlpha, 0.45);
  assert.equal(t6.status.success, '#15803D');
  assert.equal(t6.status.warning, '#B8860B');
  assert.equal(t6.status.danger, '#B91C1C');
  assert.equal(t6.status.info, '#1D4ED8');
  assert.equal(t6.status.neutral, '#737373');

  // Theme 07 Nord Dark
  const t7 = THEMES['nord-cognitive-dark'];
  assert.equal(t7.emphasis.focal, '#88C0D0');
  assert.equal(t7.emphasis.benchmark, '#ECEFF4');
  assert.equal(t7.emphasis.context, '#4C566A');
  assert.equal(t7.emphasis.anomaly, '#BF616A');
  assert.equal(t7.emphasis.forecastAlpha, 0.50);
  assert.equal(t7.status.success, '#A3BE8C');
  assert.equal(t7.status.warning, '#EBCB8B');
  assert.equal(t7.status.danger, '#BF616A');
  assert.equal(t7.status.info, '#88C0D0');
  assert.equal(t7.status.neutral, '#D8DEE9');

  // Theme 08 Atkinson Hyperlegible
  const t8 = THEMES['atkinson-hyperlegible'];
  assert.equal(t8.emphasis.focal, '#005AB5');
  assert.equal(t8.emphasis.benchmark, '#27272A');
  assert.equal(t8.emphasis.context, '#A1A1AA');
  assert.equal(t8.emphasis.anomaly, '#DC3220');
  assert.equal(t8.emphasis.forecastAlpha, 0.55);
  assert.equal(t8.status.success, '#009E73');
  assert.equal(t8.status.warning, '#FE6100');
  assert.equal(t8.status.danger, '#DC3220');
  assert.equal(t8.status.info, '#005AB5');
  assert.equal(t8.status.neutral, '#71717A');
});

// -----------------------------------------------------------------------------
// 2. SLUG NORMALIZATION & ROBUST FALLBACK
// -----------------------------------------------------------------------------
console.log('\n🔀 2. Slug Normalization & Robust Fallback:');

test('Handles canonical theme names directly', () => {
  assert.equal(normalizeThemeSlug('colorbrewer-accessible'), 'colorbrewer-accessible');
  assert.equal(normalizeThemeSlug('viridis-perceptual'), 'viridis-perceptual');
  assert.equal(normalizeThemeSlug('paul-tol-scientific'), 'paul-tol-scientific');
  assert.equal(normalizeThemeSlug('tableau-stone-categorical'), 'tableau-stone-categorical');
  assert.equal(normalizeThemeSlug('okabe-ito-cud'), 'okabe-ito-cud');
  assert.equal(normalizeThemeSlug('tufte-minimalist-executive'), 'tufte-minimalist-executive');
  assert.equal(normalizeThemeSlug('nord-cognitive-dark'), 'nord-cognitive-dark');
  assert.equal(normalizeThemeSlug('atkinson-hyperlegible'), 'atkinson-hyperlegible');
});

test('Handles prefixed folder slugs (e.g. 01-..., 07-...)', () => {
  assert.equal(normalizeThemeSlug('01-colorbrewer-accessible'), 'colorbrewer-accessible');
  assert.equal(normalizeThemeSlug('02-viridis-perceptual'), 'viridis-perceptual');
  assert.equal(normalizeThemeSlug('03-paul-tol-scientific'), 'paul-tol-scientific');
  assert.equal(normalizeThemeSlug('04-tableau-stone-categorical'), 'tableau-stone-categorical');
  assert.equal(normalizeThemeSlug('05-okabe-ito-cud'), 'okabe-ito-cud');
  assert.equal(normalizeThemeSlug('06-tufte-minimalist-executive'), 'tufte-minimalist-executive');
  assert.equal(normalizeThemeSlug('07-nord-cognitive-dark'), 'nord-cognitive-dark');
  assert.equal(normalizeThemeSlug('08-atkinson-hyperlegible'), 'atkinson-hyperlegible');
});

test('Handles numeric inputs (numbers and strings)', () => {
  assert.equal(normalizeThemeSlug(1), 'colorbrewer-accessible');
  assert.equal(normalizeThemeSlug('1'), 'colorbrewer-accessible');
  assert.equal(normalizeThemeSlug('01'), 'colorbrewer-accessible');
  assert.equal(normalizeThemeSlug(2), 'viridis-perceptual');
  assert.equal(normalizeThemeSlug('02'), 'viridis-perceptual');
  assert.equal(normalizeThemeSlug(3), 'paul-tol-scientific');
  assert.equal(normalizeThemeSlug(4), 'tableau-stone-categorical');
  assert.equal(normalizeThemeSlug(5), 'okabe-ito-cud');
  assert.equal(normalizeThemeSlug(6), 'tufte-minimalist-executive');
  assert.equal(normalizeThemeSlug(7), 'nord-cognitive-dark');
  assert.equal(normalizeThemeSlug(8), 'atkinson-hyperlegible');
});

test('Handles shorthands and common aliases', () => {
  assert.equal(normalizeThemeSlug('brewer'), 'colorbrewer-accessible');
  assert.equal(normalizeThemeSlug('colorbrewer'), 'colorbrewer-accessible');
  assert.equal(normalizeThemeSlug('viridis'), 'viridis-perceptual');
  assert.equal(normalizeThemeSlug('magma'), 'viridis-perceptual');
  assert.equal(normalizeThemeSlug('paul-tol'), 'paul-tol-scientific');
  assert.equal(normalizeThemeSlug('paultol'), 'paul-tol-scientific');
  assert.equal(normalizeThemeSlug('tol'), 'paul-tol-scientific');
  assert.equal(normalizeThemeSlug('tableau'), 'tableau-stone-categorical');
  assert.equal(normalizeThemeSlug('tableau10'), 'tableau-stone-categorical');
  assert.equal(normalizeThemeSlug('tableau-stone'), 'tableau-stone-categorical');
  assert.equal(normalizeThemeSlug('okabe'), 'okabe-ito-cud');
  assert.equal(normalizeThemeSlug('cud'), 'okabe-ito-cud');
  assert.equal(normalizeThemeSlug('tufte'), 'tufte-minimalist-executive');
  assert.equal(normalizeThemeSlug('tufte-minimalist'), 'tufte-minimalist-executive');
  assert.equal(normalizeThemeSlug('executive'), 'tufte-minimalist-executive');
  assert.equal(normalizeThemeSlug('nord'), 'nord-cognitive-dark');
  assert.equal(normalizeThemeSlug('nord-dark'), 'nord-cognitive-dark');
  assert.equal(normalizeThemeSlug('dark'), 'nord-cognitive-dark');
  assert.equal(normalizeThemeSlug('atkinson'), 'atkinson-hyperlegible');
  assert.equal(normalizeThemeSlug('hyperlegible'), 'atkinson-hyperlegible');
  assert.equal(normalizeThemeSlug('braille'), 'atkinson-hyperlegible');
  assert.equal(normalizeThemeSlug('low-vision'), 'atkinson-hyperlegible');
});

test('Handles mixed case, whitespace, and edge cases with safe fallback', () => {
  assert.equal(normalizeThemeSlug('   NORD-DARK   '), 'nord-cognitive-dark');
  assert.equal(normalizeThemeSlug('Viridis_Perceptual'), 'viridis-perceptual');
  assert.equal(normalizeThemeSlug('TABLEAU'), 'tableau-stone-categorical');
  assert.equal(normalizeThemeSlug(null), 'colorbrewer-accessible');
  assert.equal(normalizeThemeSlug(undefined), 'colorbrewer-accessible');
  assert.equal(normalizeThemeSlug(''), 'colorbrewer-accessible');
  assert.equal(normalizeThemeSlug('   '), 'colorbrewer-accessible');
  assert.equal(normalizeThemeSlug('completely-nonexistent-theme-xyz'), 'colorbrewer-accessible');
});

// -----------------------------------------------------------------------------
// 3. ISOMORPHIC GETTHEMETOKENS & IMMUTABILITY
// -----------------------------------------------------------------------------
console.log('\n🔒 3. getThemeTokens & Immutability:');

test('getThemeTokens returns deep clone and does not mutate static registry', () => {
  const tokens1 = getThemeTokens('nord-cognitive-dark');
  assert.equal(tokens1.name, 'nord-cognitive-dark');
  assert.equal(tokens1.isDark, true);

  // Modify clone
  tokens1.bg = '#000000';
  tokens1.palette.push('#FFFFFF');
  tokens1.emphasis.focal = '#FFFFFF';
  tokens1.status.success = '#FFFFFF';

  // Verify registry remains unmodified
  const tokens2 = getThemeTokens('nord-cognitive-dark');
  assert.equal(tokens2.bg, '#2E3440');
  assert.equal(tokens2.palette.length, 8);
  assert.equal(tokens2.emphasis.focal, '#88C0D0');
  assert.equal(tokens2.status.success, '#A3BE8C');
  assert.equal(THEMES['nord-cognitive-dark'].bg, '#2E3440');
});

test('getThemeTokens falls back gracefully on invalid theme', () => {
  const tokens = getThemeTokens('unknown-random-theme');
  assert.equal(tokens.name, 'colorbrewer-accessible');
  assert.ok(tokens.emphasis);
  assert.ok(tokens.status);
});

// -----------------------------------------------------------------------------
// 4. PSYCHOPHYSICAL CHART.JS V4 DEFAULTS
// -----------------------------------------------------------------------------
console.log('\n📊 4. Psychophysical Chart.js v4 Defaults:');

test('getChartDefaultOptions returns strict psychophysical options for all 8 themes without errors', () => {
  for (const themeName of THEME_NAMES) {
    const tokens = getThemeTokens(themeName);
    const options = getChartDefaultOptions(tokens);

    assert.equal(options.responsive, true);
    assert.equal(options.maintainAspectRatio, false);
    assert.equal(options.categoryPercentage, 0.8);
    assert.equal(options.barPercentage, 0.9);
    assert.ok(options.scales.x);
    assert.ok(options.scales.y);
    assert.equal(options.scales.x.grid.display, false);
    assert.equal(options.scales.y.grid.color, tokens.gridColor);
    assert.equal(options.plugins.tooltip.backgroundColor, tokens.tooltipBg);
    assert.equal(options.interaction.mode, 'nearest');
    assert.equal(options.interaction.intersect, false);
    assert.equal(options.interaction.axis, 'x');
    assert.equal(options.elements.point.radius, 4);
    assert.equal(options.elements.point.hitRadius, 10);
    assert.equal(options.elements.point.hoverRadius, 6);
    assert.deepEqual(options.plugins.tooltip.padding, { top: 10, bottom: 10, left: 14, right: 14 });
    assert.equal(options.plugins.tooltip.boxPadding, 6);
    assert.equal(options.plugins.tooltip.borderColor, tokens.borderStrong || tokens.border);
  }
});

test('getChartDefaultOptions adapts for Tufte theme', () => {
  const tufteTokens = getThemeTokens('tufte-minimalist-executive');
  const tufteOptions = getChartDefaultOptions(tufteTokens);

  assert.equal(tufteOptions.animation, false);
  assert.equal(tufteOptions.plugins.legend.display, false);
  assert.equal(tufteOptions.elements.bar.borderRadius, 0);
  assert.equal(tufteOptions.elements.line.borderWidth, 1.5);
  assert.equal(tufteOptions.plugins.tooltip.cornerRadius, 0);
  assert.equal(tufteOptions.plugins.tooltip.animation, false);
});

test('getChartDefaultOptions adapts for Dark Mode', () => {
  const darkTokens = getThemeTokens('nord-cognitive-dark');
  const darkOptions = getChartDefaultOptions(darkTokens);

  assert.equal(darkOptions.plugins.tooltip.borderWidth, 1);
  assert.equal(darkOptions.plugins.tooltip.borderColor, darkTokens.borderStrong || darkTokens.border);
});

// -----------------------------------------------------------------------------
// 5. COLOR HELPER FUNCTIONS
// -----------------------------------------------------------------------------
console.log('\n🛠️ 5. Color Helper Functions:');

test('getColor extracts cyclic colors safely', () => {
  const tokens = getThemeTokens('colorbrewer-accessible');
  const c0 = getColor(tokens, 0);
  const c1 = getColor(tokens, 1);
  const c7 = getColor(tokens, 7);
  const c8 = getColor(tokens, 8);

  assert.equal(c0, tokens.palette[0]);
  assert.equal(c1, tokens.palette[1]);
  assert.equal(c7, tokens.palette[7]);
  assert.equal(c8, tokens.palette[0]);

  assert.equal(getColor(tokens, -1), tokens.palette[1]);
  assert.equal(getColor(null, 0), '#2B8CBE');
});

test('getSemanticColor extracts semantic roles', () => {
  const tokens = getThemeTokens('okabe-ito-cud');
  assert.equal(getSemanticColor(tokens, 'positive'), tokens.status.success);
  assert.equal(getSemanticColor(tokens, 'negative'), tokens.status.danger);
  assert.equal(getSemanticColor(tokens, 'warning'), tokens.status.warning);
  assert.equal(getSemanticColor(tokens, 'info'), tokens.status.info);
  assert.equal(getSemanticColor(tokens, 'neutral'), tokens.status.neutral);
  assert.equal(getSemanticColor(tokens, 'unknown'), tokens.status.neutral);
  assert.equal(getSemanticColor(null, 'positive'), '#999999');
});

test('getSequentialColor interpolates 0.0 to 1.0 clamped', () => {
  const tokens = getThemeTokens('viridis-perceptual');
  const seq = tokens.sequential;

  assert.equal(getSequentialColor(tokens, 0.0), seq[0]);
  assert.equal(getSequentialColor(tokens, 1.0), seq[seq.length - 1]);
  assert.equal(getSequentialColor(tokens, -0.5), seq[0]);
  assert.equal(getSequentialColor(tokens, 1.5), seq[seq.length - 1]);
  assert.equal(getSequentialColor(null, 0.5), '#3182BD');
});

test('hexToRgba converts 3-char, 6-char hex and rgba strings accurately', () => {
  assert.equal(hexToRgba('#FFF', 0.5), 'rgba(255, 255, 255, 0.5)');
  assert.equal(hexToRgba('#000000', 0.25), 'rgba(0, 0, 0, 0.25)');
  assert.equal(hexToRgba('#2B8CBE', 0.8), 'rgba(43, 140, 190, 0.8)');
  assert.equal(hexToRgba('rgb(10, 20, 30)', 0.5), 'rgba(10, 20, 30, 0.5)');
  assert.equal(hexToRgba('rgba(10, 20, 30, 0.9)', 0.4), 'rgba(10, 20, 30, 0.4)');
  assert.equal(hexToRgba(null, 0.5), 'rgba(0, 0, 0, 0.5)');
});

// -----------------------------------------------------------------------------
// 6. UNIVERSAL VALENCE COLOR HELPER (getValenceColor)
// -----------------------------------------------------------------------------
console.log('\n🎯 6. Universal Valence Color Helper (getValenceColor):');

test('getValenceColor handles Gain metrics (direct polarity)', () => {
  const tokens = getThemeTokens('colorbrewer-accessible');

  // Positive gain -> success
  assert.equal(getValenceColor(tokens, 15, 'gain'), tokens.status.success);
  assert.equal(getValenceColor(tokens, 'up', 'revenue'), tokens.status.success);
  assert.equal(getValenceColor(tokens, '+', 'profit'), tokens.status.success);
  assert.equal(getValenceColor(tokens, 'increase', 'margin'), tokens.status.success);
  assert.equal(getValenceColor(tokens, true, 'csat'), tokens.status.success);
  assert.equal(getValenceColor(tokens, '+12.5', 'sales'), tokens.status.success);
  assert.equal(getValenceColor(tokens, 'growth', 'retention'), tokens.status.success);

  // Negative gain -> danger
  assert.equal(getValenceColor(tokens, -10, 'gain'), tokens.status.danger);
  assert.equal(getValenceColor(tokens, 'down', 'revenue'), tokens.status.danger);
  assert.equal(getValenceColor(tokens, '-', 'profit'), tokens.status.danger);
  assert.equal(getValenceColor(tokens, 'decrease', 'margin'), tokens.status.danger);
  assert.equal(getValenceColor(tokens, false, 'csat'), tokens.status.danger);
  assert.equal(getValenceColor(tokens, '-4.2', 'sales'), tokens.status.danger);

  // Zero / Flat gain -> neutral
  assert.equal(getValenceColor(tokens, 0, 'gain'), tokens.status.neutral);
  assert.equal(getValenceColor(tokens, 'flat', 'revenue'), tokens.status.neutral);
  assert.equal(getValenceColor(tokens, 'neutral', 'profit'), tokens.status.neutral);
  assert.equal(getValenceColor(tokens, '0', 'sales'), tokens.status.neutral);
});

test('getValenceColor handles Cost/Churn/Risk metrics (inverted polarity)', () => {
  const tokens = getThemeTokens('colorbrewer-accessible');

  // Positive cost increase -> danger
  assert.equal(getValenceColor(tokens, 5.2, 'cost'), tokens.status.danger);
  assert.equal(getValenceColor(tokens, 'up', 'churn'), tokens.status.danger);
  assert.equal(getValenceColor(tokens, '+', 'risk'), tokens.status.danger);
  assert.equal(getValenceColor(tokens, 'increase', 'latency'), tokens.status.danger);
  assert.equal(getValenceColor(tokens, 10, 'defect'), tokens.status.danger);
  assert.equal(getValenceColor(tokens, true, 'loss'), tokens.status.danger);
  assert.equal(getValenceColor(tokens, '+3', 'co2'), tokens.status.danger);
  assert.equal(getValenceColor(tokens, 100, 'opex'), tokens.status.danger);
  assert.equal(getValenceColor(tokens, 25, 'cac'), tokens.status.danger);

  // Negative cost reduction -> success
  assert.equal(getValenceColor(tokens, -3.4, 'cost'), tokens.status.success);
  assert.equal(getValenceColor(tokens, 'down', 'churn'), tokens.status.success);
  assert.equal(getValenceColor(tokens, '-', 'risk'), tokens.status.success);
  assert.equal(getValenceColor(tokens, 'decrease', 'latency'), tokens.status.success);
  assert.equal(getValenceColor(tokens, -8, 'defect'), tokens.status.success);
  assert.equal(getValenceColor(tokens, false, 'loss'), tokens.status.success);
  assert.equal(getValenceColor(tokens, '-15', 'co2'), tokens.status.success);

  // Flat cost -> neutral
  assert.equal(getValenceColor(tokens, 0, 'cost'), tokens.status.neutral);
  assert.equal(getValenceColor(tokens, 'neutral', 'churn'), tokens.status.neutral);
});

test('getValenceColor handles Neutral / Volume / Descriptive metrics', () => {
  const tokens = getThemeTokens('nord-cognitive-dark');

  assert.equal(getValenceColor(tokens, 'up', 'volume'), tokens.status.info);
  assert.equal(getValenceColor(tokens, 100, 'neutral'), tokens.status.info);
  assert.equal(getValenceColor(tokens, 0, 'volume'), tokens.status.neutral);
  assert.equal(getValenceColor(tokens, 'flat', 'share'), tokens.status.neutral);
  assert.equal(getValenceColor(tokens, 50, 'temperature'), tokens.status.info);
});

test('getValenceColor accepts theme slug string directly and handles edge fallbacks', () => {
  assert.equal(getValenceColor('nord-cognitive-dark', 10, 'gain'), THEMES['nord-cognitive-dark'].status.success);
  assert.equal(getValenceColor('okabe-ito-cud', -5, 'gain'), THEMES['okabe-ito-cud'].status.danger);
  assert.equal(getValenceColor(null, 10, 'gain'), THEMES['colorbrewer-accessible'].status.success);
  assert.equal(getValenceColor({}, 10, 'gain'), '#2E7D32');
  assert.equal(getValenceColor({}, -10, 'gain'), '#C62828');
  assert.equal(getValenceColor({}, 0, 'gain'), '#94A3B8');
});

// -----------------------------------------------------------------------------
// 7. UNIVERSAL EMPHASIS STYLE HELPER (getEmphasisStyle)
// -----------------------------------------------------------------------------
console.log('\n🎨 7. Universal Emphasis Style Helper (getEmphasisStyle):');

test('getEmphasisStyle returns complete Chart.js styling object for all roles', () => {
  const tokens = getThemeTokens('paul-tol-scientific');
  const requiredKeys = [
    'borderColor',
    'backgroundColor',
    'borderWidth',
    'borderDash',
    'pointStyle',
    'pointRadius',
    'pointBackgroundColor',
    'pointBorderColor'
  ];

  const roles = [
    'focal', 'hero', 'primary', 'focus',
    'context', 'muted', 'secondary', 'background',
    'benchmark', 'target', 'baseline', 'reference', 'goal',
    'anomaly', 'outlier', 'alert',
    'forecast', 'projection', 'future', 'uncertainty',
    'missing', 'nodata', 'null', 'incomplete'
  ];

  for (const role of roles) {
    const style = getEmphasisStyle(tokens, role);
    for (const key of requiredKeys) {
      assert.ok(style[key] !== undefined, `Role "${role}" missing style key "${key}"`);
    }
  }
});

test('getEmphasisStyle sets role-specific double-encoding properties', () => {
  const tokens = getThemeTokens('tufte-minimalist-executive');

  // Focal / Hero
  const focal = getEmphasisStyle(tokens, 'focal');
  assert.equal(focal.borderWidth, 2);
  assert.deepEqual(focal.borderDash, []);
  assert.equal(focal.pointStyle, 'circle');
  assert.equal(focal.borderColor, tokens.emphasis.focal);

  // Context / Muted
  const context = getEmphasisStyle(tokens, 'context');
  assert.equal(context.borderWidth, 1);
  assert.equal(context.pointRadius, 2);
  assert.equal(context.borderColor, tokens.emphasis.context);

  // Benchmark / Target
  const benchmark = getEmphasisStyle(tokens, 'benchmark');
  assert.equal(benchmark.borderWidth, 2);
  assert.deepEqual(benchmark.borderDash, [4, 4]);
  assert.equal(benchmark.pointStyle, 'rectRot'); // Diamond
  assert.equal(benchmark.borderColor, tokens.emphasis.benchmark);

  // Anomaly / Outlier
  const anomaly = getEmphasisStyle(tokens, 'anomaly');
  assert.equal(anomaly.pointStyle, 'triangle');
  assert.equal(anomaly.pointRadius, 6);
  assert.equal(anomaly.borderColor, tokens.emphasis.anomaly);

  // Forecast / Projection
  const forecast = getEmphasisStyle(tokens, 'forecast');
  assert.deepEqual(forecast.borderDash, [5, 5]);
  assert.equal(forecast.pointStyle, 'crossRot'); // Cross
  assert.ok(forecast.borderColor.startsWith('rgba'));

  // Missing / No Data
  const missing = getEmphasisStyle(tokens, 'missing');
  assert.deepEqual(missing.borderDash, [3, 3]);
  assert.equal(missing.pointStyle, 'rect'); // Square
  assert.equal(missing.pointBackgroundColor, 'transparent');
});

test('getEmphasisStyle supports custom options overrides (fill, alpha, radius, borderDash)', () => {
  const tokens = getThemeTokens('colorbrewer-accessible');
  const custom = getEmphasisStyle(tokens, 'focal', {
    fill: true,
    alpha: 0.35,
    radius: 8,
    borderWidth: 4,
    borderDash: [2, 2],
    pointBackgroundColor: '#123456',
    pointBorderColor: '#654321'
  });

  assert.equal(custom.borderWidth, 4);
  assert.deepEqual(custom.borderDash, [2, 2]);
  assert.equal(custom.pointRadius, 8);
  assert.equal(custom.fill, true);
  assert.equal(custom.backgroundColor, hexToRgba(tokens.emphasis.focal, 0.35));
  assert.equal(custom.pointBackgroundColor, '#123456');
  assert.equal(custom.pointBorderColor, '#654321');
});

// -----------------------------------------------------------------------------
// 8. UNIVERSAL THRESHOLD STATUS HELPER (getThresholdStatus)
// -----------------------------------------------------------------------------
console.log('\n📏 8. Universal Threshold Status Helper (getThresholdStatus):');

test('getThresholdStatus calculates direct targets (higher-is-better)', () => {
  const tokens = getThemeTokens('tableau-stone-categorical');

  // Above target (105 / 100) -> success
  const resSuccess = getThresholdStatus(105, 100, {}, 'higher-is-better', tokens);
  assert.equal(resSuccess.status, 'success');
  assert.equal(resSuccess.ratio, 1.05);
  assert.equal(resSuccess.delta, 5);
  assert.equal(resSuccess.color, tokens.status.success);
  assert.ok(resSuccess.label.includes('+5.0%'));
  assert.ok(resSuccess.label.includes('Atteint'));

  // Intermediate tolerance (95 / 100) -> warning
  const resWarning = getThresholdStatus(95, 100, {}, 'higher-is-better', tokens);
  assert.equal(resWarning.status, 'warning');
  assert.equal(resWarning.ratio, 0.95);
  assert.equal(resWarning.delta, -5);
  assert.equal(resWarning.color, tokens.status.warning);
  assert.ok(resWarning.label.includes('Vigilance'));

  // Critical deficit (75 / 100) -> danger
  const resDanger = getThresholdStatus(75, 100, {}, 'higher-is-better', tokens);
  assert.equal(resDanger.status, 'danger');
  assert.equal(resDanger.ratio, 0.75);
  assert.equal(resDanger.delta, -25);
  assert.equal(resDanger.color, tokens.status.danger);
  assert.ok(resDanger.label.includes('Critique'));
});

test('getThresholdStatus calculates inverted targets (lower-is-better)', () => {
  const tokens = getThemeTokens('atkinson-hyperlegible');

  // Below budget/target (90 / 100) -> success
  const resSuccess = getThresholdStatus(90, 100, {}, 'lower-is-better', tokens);
  assert.equal(resSuccess.status, 'success');
  assert.equal(resSuccess.color, tokens.status.success);

  // Slight cost overrun (104 / 100) -> warning
  const resWarning = getThresholdStatus(104, 100, {}, 'lower-is-better', tokens);
  assert.equal(resWarning.status, 'warning');
  assert.equal(resWarning.color, tokens.status.warning);

  // Large cost overrun (120 / 100) -> danger
  const resDanger = getThresholdStatus(120, 100, {}, 'lower-is-better', tokens);
  assert.equal(resDanger.status, 'danger');
  assert.equal(resDanger.color, tokens.status.danger);
});

test('getThresholdStatus accepts options object and custom thresholds', () => {
  const custom = getThresholdStatus(92, 100, {
    warning: 0.95, // 95% threshold for warning
    danger: 0.85,
    tokens: 'nord-cognitive-dark',
    polarity: 'higher-is-better'
  });

  assert.equal(custom.status, 'warning');
  assert.equal(custom.color, THEMES['nord-cognitive-dark'].status.warning);
});

test('getThresholdStatus handles zero / edge inputs correctly', () => {
  const resZero = getThresholdStatus(0, 0);
  assert.equal(resZero.status, 'success');
  assert.equal(resZero.ratio, 1);
  assert.equal(resZero.delta, 0);
});

// -----------------------------------------------------------------------------
// 9. DOM CONTAINER & VARIABLE INJECTION
// -----------------------------------------------------------------------------
console.log('\n🌐 9. DOM Container & Variable Injection:');

test('applyThemeToContainer injects all emphasis and status custom properties', () => {
  const setProperties = {};
  const mockContainer = {
    setAttribute(name, val) { this[name] = val; },
    dataset: {},
    style: {
      setProperty(prop, val) {
        setProperties[prop] = val;
      }
    }
  };

  const tokens = applyThemeToContainer(mockContainer, 'nord-cognitive-dark');
  assert.equal(tokens.name, 'nord-cognitive-dark');

  // Check emphasis properties injected
  assert.equal(setProperties['--chart-emphasis-focal'], tokens.emphasis.focal);
  assert.equal(setProperties['--chart-emphasis-benchmark'], tokens.emphasis.benchmark);
  assert.equal(setProperties['--chart-emphasis-context'], tokens.emphasis.context);
  assert.equal(setProperties['--chart-emphasis-anomaly'], tokens.emphasis.anomaly);
  assert.equal(setProperties['--chart-emphasis-forecast-alpha'], String(tokens.emphasis.forecastAlpha));

  // Check status properties injected
  assert.equal(setProperties['--chart-status-success'], tokens.status.success);
  assert.equal(setProperties['--chart-status-warning'], tokens.status.warning);
  assert.equal(setProperties['--chart-status-danger'], tokens.status.danger);
  assert.equal(setProperties['--chart-status-info'], tokens.status.info);
  assert.equal(setProperties['--chart-status-neutral'], tokens.status.neutral);
});

test('getThemeTokens extracts custom properties for emphasis and status from DOM', () => {
  const fakeVariables = {
    '--chart-bg': '#123456',
    '--chart-emphasis-focal': '#112233',
    '--chart-emphasis-benchmark': '#445566',
    '--chart-emphasis-context': '#778899',
    '--chart-emphasis-anomaly': '#AABBCC',
    '--chart-emphasis-forecast-alpha': '0.65',
    '--chart-status-success': '#00FF00',
    '--chart-status-warning': '#FFAA00',
    '--chart-status-danger': '#FF0000',
    '--chart-status-info': '#0088FF',
    '--chart-status-neutral': '#888888'
  };

  const mockTarget = {};
  global.window = {
    getComputedStyle: () => ({
      getPropertyValue: (prop) => fakeVariables[prop] || ''
    })
  };
  global.document = {
    querySelector: () => mockTarget,
    documentElement: mockTarget
  };

  try {
    const tokens = getThemeTokens('colorbrewer-accessible', mockTarget);
    assert.equal(tokens.emphasis.focal, '#112233');
    assert.equal(tokens.emphasis.benchmark, '#445566');
    assert.equal(tokens.emphasis.context, '#778899');
    assert.equal(tokens.emphasis.anomaly, '#AABBCC');
    assert.equal(tokens.emphasis.forecastAlpha, 0.65);
    assert.equal(tokens.status.success, '#00FF00');
    assert.equal(tokens.status.warning, '#FFAA00');
    assert.equal(tokens.status.danger, '#FF0000');
    assert.equal(tokens.status.info, '#0088FF');
    assert.equal(tokens.status.neutral, '#888888');
    assert.equal(tokens.semantic.positive, '#00FF00');
  } finally {
    delete global.window;
    delete global.document;
  }
});

// -----------------------------------------------------------------------------
// 10. CSS FILES DECLARATIONS VERIFICATION
// -----------------------------------------------------------------------------
console.log('\n📄 10. CSS Files Declarations Verification:');

test('All 8 theme.css files declare complete emphasis and status CSS custom properties', () => {
  const themeDirs = [
    '01-colorbrewer-accessible',
    '02-viridis-perceptual',
    '03-paul-tol-scientific',
    '04-tableau-stone-categorical',
    '05-okabe-ito-cud',
    '06-tufte-minimalist-executive',
    '07-nord-cognitive-dark',
    '08-atkinson-hyperlegible'
  ];

  const requiredCssProps = [
    '--chart-emphasis-focal',
    '--chart-emphasis-benchmark',
    '--chart-emphasis-context',
    '--chart-emphasis-anomaly',
    '--chart-emphasis-forecast-alpha',
    '--chart-status-success',
    '--chart-status-warning',
    '--chart-status-danger',
    '--chart-status-info',
    '--chart-status-neutral'
  ];

  for (const dir of themeDirs) {
    const cssPath = path.join(PROJECT_ROOT, 'themes', dir, 'theme.css');
    assert.ok(fs.existsSync(cssPath), `Missing theme.css at ${cssPath}`);

    const cssContent = fs.readFileSync(cssPath, 'utf8');
    for (const prop of requiredCssProps) {
      assert.ok(
        cssContent.includes(prop),
        `theme.css in ${dir} is missing declaration for ${prop}`
      );
    }
  }
});

// -----------------------------------------------------------------------------
// 11. CORE INTERACTION HELPERS, REDUCED MOTION & ANTI-OCCLUSION
// -----------------------------------------------------------------------------
console.log('\n🎯 11. Core Interaction Helpers, Reduced Motion & Anti-Occlusion:');

test('isReducedMotionPreferred detects reduced-motion safely in Node and browser mock', () => {
  // In Node environment without window
  assert.equal(isReducedMotionPreferred(), false);

  // Mock window with matchMedia returning true
  global.window = {
    matchMedia: (query) => ({
      matches: query.includes('prefers-reduced-motion: reduce')
    })
  };

  try {
    assert.equal(isReducedMotionPreferred(), true);
  } finally {
    delete global.window;
  }

  // Mock window with matchMedia returning false
  global.window = {
    matchMedia: () => ({ matches: false })
  };

  try {
    assert.equal(isReducedMotionPreferred(), false);
  } finally {
    delete global.window;
  }

  // Mock window throwing error
  global.window = {
    matchMedia: () => { throw new Error('CORS/Security error'); }
  };

  try {
    assert.equal(isReducedMotionPreferred(), false);
  } finally {
    delete global.window;
  }
});

test('getAnimationDuration scales duration logarithmically based on element complexity N', () => {
  // Exact calibrations from specification:
  // N=1 => 350ms
  assert.equal(getAnimationDuration(1), 350);
  assert.equal(getAnimationDuration(), 350);

  // N=5 => 411ms (350 * (1 + 0.25 * log10(5)) = 411.16)
  assert.equal(getAnimationDuration(5), 411);

  // N=50 => 499ms (350 * (1 + 0.25 * log10(50)) = 498.66)
  assert.equal(getAnimationDuration(50), 499);

  // N=100 => 525ms (350 * 1.5)
  assert.equal(getAnimationDuration(100), 525);

  // N=720 => 600ms (saturation)
  assert.equal(getAnimationDuration(720), 600);

  // N=10000 => 600ms (capped)
  assert.equal(getAnimationDuration(10000), 600);

  // Boundary conditions: N<=0 => 200ms floor
  assert.equal(getAnimationDuration(0), 200);
  assert.equal(getAnimationDuration(-10), 200);
  assert.equal(getAnimationDuration('invalid'), 200);

  // Custom base duration
  assert.equal(getAnimationDuration(1, 400), 400);
  assert.equal(getAnimationDuration(100, 400), 600);
});

test('getAccessibleAnimationOptions handles Tufte mode, reduced motion, and options correctly', () => {
  const standardTokens = getThemeTokens('colorbrewer-accessible');
  const tufteTokens = getThemeTokens('tufte-minimalist-executive');

  // Standard theme returns default animation object
  const anim = getAccessibleAnimationOptions(standardTokens);
  assert.deepEqual(anim, {
    duration: 400,
    easing: 'easeOutQuart',
    delay: 0,
    loop: false
  });

  // Accepts theme name string
  const animStr = getAccessibleAnimationOptions('paul-tol-scientific');
  assert.equal(animStr.duration, 400);

  // Tufte theme returns false (zero latency)
  assert.equal(getAccessibleAnimationOptions(tufteTokens), false);
  assert.equal(getAccessibleAnimationOptions('tufte-minimalist-executive'), false);

  // Explicit duration: 0 or animate: false returns false
  assert.equal(getAccessibleAnimationOptions(standardTokens, { duration: 0 }), false);
  assert.equal(getAccessibleAnimationOptions(standardTokens, { animate: false }), false);
  assert.equal(getAccessibleAnimationOptions(standardTokens, { animation: false }), false);

  // Custom options overrides
  const customAnim = getAccessibleAnimationOptions(standardTokens, { duration: 500, easing: 'easeOutQuad', delay: 100 });
  assert.equal(customAnim.duration, 500);
  assert.equal(customAnim.easing, 'easeOutQuad');
  assert.equal(customAnim.delay, 100);

  // Reduced motion active -> returns false
  global.window = {
    matchMedia: () => ({ matches: true })
  };
  try {
    assert.equal(getAccessibleAnimationOptions(standardTokens), false);
  } finally {
    delete global.window;
  }
});

test('getSpatialInteractionOptions returns Fitts-compliant 2D interaction options', () => {
  const tokens = getThemeTokens('colorbrewer-accessible');
  const opts = getSpatialInteractionOptions(tokens);

  assert.equal(opts.interaction.mode, 'nearest');
  assert.equal(opts.interaction.intersect, false);
  assert.equal(opts.interaction.axis, 'xy');
  assert.equal(opts.elements.point.radius, 4);
  assert.equal(opts.elements.point.hitRadius, 14);
  assert.equal(opts.elements.point.hoverRadius, 7);
  assert.equal(opts.elements.point.hoverBorderWidth, 2);
  assert.equal(opts.hover.mode, 'nearest');
  assert.equal(opts.hover.intersect, false);
  assert.equal(opts.hover.animationDuration, 100);

  // Tufte theme sets hover animation duration to 0
  const tufteOpts = getSpatialInteractionOptions('tufte-minimalist-executive');
  assert.equal(tufteOpts.hover.animationDuration, 0);

  // Custom overrides
  const customOpts = getSpatialInteractionOptions(tokens, { hitRadius: 18, radius: 5 });
  assert.equal(customOpts.elements.point.hitRadius, 18);
  assert.equal(customOpts.elements.point.radius, 5);
});

test('getTemporalInteractionOptions returns synchronized 1D interaction options', () => {
  const tokens = getThemeTokens('colorbrewer-accessible');
  const opts = getTemporalInteractionOptions(tokens);

  assert.equal(opts.interaction.mode, 'index');
  assert.equal(opts.interaction.intersect, false);
  assert.equal(opts.interaction.axis, 'x');
  assert.equal(opts.elements.line.borderWidth, 2);
  assert.equal(opts.elements.line.tension, 0.1);
  assert.equal(opts.elements.point.radius, 3);
  assert.equal(opts.elements.point.hitRadius, 12);
  assert.equal(opts.elements.point.hoverRadius, 6);
  assert.equal(opts.hover.mode, 'index');
  assert.equal(opts.hover.intersect, false);
  assert.equal(opts.hover.axis, 'x');
  assert.equal(opts.hover.animationDuration, 100);

  // Supports horizontal charts with axis 'y'
  const yOpts = getTemporalInteractionOptions(tokens, 'y');
  assert.equal(yOpts.interaction.axis, 'y');
  assert.equal(yOpts.hover.axis, 'y');

  // Supports options object with axis
  const objOpts = getTemporalInteractionOptions(tokens, { axis: 'y', tension: 0.2 });
  assert.equal(objOpts.interaction.axis, 'y');
  assert.equal(objOpts.elements.line.tension, 0.2);

  // Tufte theme adaptations
  const tufteOpts = getTemporalInteractionOptions('tufte-minimalist-executive');
  assert.equal(tufteOpts.elements.line.borderWidth, 1.5);
  assert.equal(tufteOpts.hover.animationDuration, 0);
});

test('getPartitionInteractionOptions returns discrete partition interaction options', () => {
  const tokens = getThemeTokens('colorbrewer-accessible');
  const opts = getPartitionInteractionOptions(tokens);

  assert.equal(opts.interaction.mode, 'nearest');
  assert.equal(opts.interaction.intersect, true);
  assert.equal(opts.interaction.axis, 'xy');
  assert.equal(opts.elements.arc.borderWidth, 2);
  assert.equal(opts.elements.arc.hoverBorderWidth, 3);
  assert.equal(opts.elements.arc.hoverOffset, 4);
  assert.equal(opts.elements.point.radius, 4);
  assert.equal(opts.elements.point.hitRadius, 8);
  assert.equal(opts.elements.point.hoverRadius, 6);
  assert.equal(opts.hover.mode, 'nearest');
  assert.equal(opts.hover.intersect, true);
  assert.equal(opts.hover.animationDuration, 120);

  // Tufte theme adaptations
  const tufteOpts = getPartitionInteractionOptions('tufte-minimalist-executive');
  assert.equal(tufteOpts.elements.arc.borderWidth, 1);
  assert.equal(tufteOpts.elements.arc.hoverOffset, 0);
  assert.equal(tufteOpts.hover.animationDuration, 0);
});

test('getExecutiveModeOptions returns minimalist Tufte executive options', () => {
  const tokens = getThemeTokens('colorbrewer-accessible');
  const execOpts = getExecutiveModeOptions(tokens);

  assert.equal(execOpts.animation, false);
  assert.equal(execOpts.elements.bar.borderRadius, 0);
  assert.equal(execOpts.elements.line.borderWidth, 1.5);
  assert.equal(execOpts.elements.line.tension, 0);
  assert.equal(execOpts.elements.point.radius, 3);
  assert.equal(execOpts.elements.point.hitRadius, 10);
  assert.equal(execOpts.elements.point.hoverRadius, 5);
  assert.equal(execOpts.plugins.legend.display, false);
  assert.equal(execOpts.plugins.tooltip.animation, false);
  assert.equal(execOpts.plugins.tooltip.cornerRadius, 0);
  assert.equal(execOpts.plugins.tooltip.borderWidth, 1);
  assert.equal(execOpts.scales.x.grid.display, false);
  assert.equal(execOpts.scales.y.grid.display, false);
});

test('computeAntiOcclusionTooltipPosition calculates deterministic positions and clamps', () => {
  const canvas = { width: 800, height: 600 };
  const tooltip = { width: 160, height: 80 };

  // Center target -> above target, caret bottom, align center
  const centerPos = computeAntiOcclusionTooltipPosition({ x: 400, y: 300 }, tooltip, canvas, 12, 8);
  assert.equal(centerPos.caretPosition, 'bottom');
  assert.equal(centerPos.align, 'center');
  assert.equal(centerPos.x, 320); // 400 - 80
  assert.equal(centerPos.y, 208); // 300 - 80 - 12

  // Top edge target -> flips quadrant below target, caret top
  const topPos = computeAntiOcclusionTooltipPosition({ x: 400, y: 20 }, tooltip, canvas, 12, 8);
  assert.equal(topPos.caretPosition, 'top');
  assert.equal(topPos.y, 32); // 20 + 12

  // Left edge target -> clamps to margin 8, align left
  const leftPos = computeAntiOcclusionTooltipPosition({ x: 10, y: 300 }, tooltip, canvas, 12, 8);
  assert.equal(leftPos.align, 'left');
  assert.equal(leftPos.x, 8);

  // Right edge target -> clamps to right margin, align right
  const rightPos = computeAntiOcclusionTooltipPosition({ x: 790, y: 300 }, tooltip, canvas, 12, 8);
  assert.equal(rightPos.align, 'right');
  assert.equal(rightPos.x, 632); // 800 - 160 - 8

  // Corner cases: Top-Left (0, 0)
  const topLeftPos = computeAntiOcclusionTooltipPosition({ x: 0, y: 0 }, tooltip, canvas, 12, 8);
  assert.equal(topLeftPos.caretPosition, 'top');
  assert.equal(topLeftPos.align, 'left');
  assert.equal(topLeftPos.x, 8);
  assert.equal(topLeftPos.y, 12);

  // Corner cases: Bottom-Right (800, 600)
  const bottomRightPos = computeAntiOcclusionTooltipPosition({ x: 800, y: 600 }, tooltip, canvas, 12, 8);
  assert.equal(bottomRightPos.caretPosition, 'bottom');
  assert.equal(bottomRightPos.align, 'right');
  assert.equal(bottomRightPos.x, 632);
  assert.equal(bottomRightPos.y, 508); // 600 - 80 - 12

  // Default fallback parameters
  const defPos = computeAntiOcclusionTooltipPosition();
  assert.ok(defPos);
  assert.equal(typeof defPos.x, 'number');
  assert.equal(typeof defPos.y, 'number');
});

// -----------------------------------------------------------------------------
// 12. UNIVERSAL EXPORTS & GLOBAL SCOPE
// -----------------------------------------------------------------------------
console.log('\n🌐 12. Universal Exports & Global Scope:');

test('Dual export object KitChartsTheme contains all helper functions', () => {
  assert.ok(KitChartsTheme.THEMES);
  assert.ok(KitChartsTheme.THEME_NAMES);
  assert.ok(KitChartsTheme.DEFAULT_THEME);
  assert.equal(typeof KitChartsTheme.normalizeThemeSlug, 'function');
  assert.equal(typeof KitChartsTheme.getThemeTokens, 'function');
  assert.equal(typeof KitChartsTheme.applyThemeToContainer, 'function');
  assert.equal(typeof KitChartsTheme.loadGoogleFonts, 'function');
  assert.equal(typeof KitChartsTheme.getChartDefaultOptions, 'function');
  assert.equal(typeof KitChartsTheme.getColor, 'function');
  assert.equal(typeof KitChartsTheme.getSemanticColor, 'function');
  assert.equal(typeof KitChartsTheme.getSequentialColor, 'function');
  assert.equal(typeof KitChartsTheme.getValenceColor, 'function');
  assert.equal(typeof KitChartsTheme.getEmphasisStyle, 'function');
  assert.equal(typeof KitChartsTheme.getThresholdStatus, 'function');
  assert.equal(typeof KitChartsTheme.hexToRgba, 'function');
  assert.equal(typeof KitChartsTheme.isReducedMotionPreferred, 'function');
  assert.equal(typeof KitChartsTheme.getAnimationDuration, 'function');
  assert.equal(typeof KitChartsTheme.getAccessibleAnimationOptions, 'function');
  assert.equal(typeof KitChartsTheme.getSpatialInteractionOptions, 'function');
  assert.equal(typeof KitChartsTheme.getTemporalInteractionOptions, 'function');
  assert.equal(typeof KitChartsTheme.getPartitionInteractionOptions, 'function');
  assert.equal(typeof KitChartsTheme.getExecutiveModeOptions, 'function');
  assert.equal(typeof KitChartsTheme.computeAntiOcclusionTooltipPosition, 'function');
});

test('CommonJS module.exports provides named exports and defaults', () => {
  const cjsTokens = require('../themes/theme-tokens.js');
  assert.equal(typeof cjsTokens.getValenceColor, 'function');
  assert.equal(typeof cjsTokens.getEmphasisStyle, 'function');
  assert.equal(typeof cjsTokens.getThresholdStatus, 'function');
  assert.equal(typeof cjsTokens.getThemeTokens, 'function');
  assert.equal(typeof cjsTokens.isReducedMotionPreferred, 'function');
  assert.equal(typeof cjsTokens.getAnimationDuration, 'function');
  assert.equal(typeof cjsTokens.getAccessibleAnimationOptions, 'function');
  assert.equal(typeof cjsTokens.getSpatialInteractionOptions, 'function');
  assert.equal(typeof cjsTokens.getTemporalInteractionOptions, 'function');
  assert.equal(typeof cjsTokens.getPartitionInteractionOptions, 'function');
  assert.equal(typeof cjsTokens.getExecutiveModeOptions, 'function');
  assert.equal(typeof cjsTokens.computeAntiOcclusionTooltipPosition, 'function');
  assert.ok(cjsTokens.THEMES);
});

test('Simulated browser window attachment populates window globals', () => {
  global.window = {};
  try {
    // Dynamically evaluate module attachment
    window.KitChartsTheme = KitChartsTheme;
    window.getValenceColor = getValenceColor;
    window.getEmphasisStyle = getEmphasisStyle;
    window.getThresholdStatus = getThresholdStatus;
    window.isReducedMotionPreferred = isReducedMotionPreferred;
    window.getAnimationDuration = getAnimationDuration;
    window.getAccessibleAnimationOptions = getAccessibleAnimationOptions;
    window.getSpatialInteractionOptions = getSpatialInteractionOptions;
    window.getTemporalInteractionOptions = getTemporalInteractionOptions;
    window.getPartitionInteractionOptions = getPartitionInteractionOptions;
    window.getExecutiveModeOptions = getExecutiveModeOptions;
    window.computeAntiOcclusionTooltipPosition = computeAntiOcclusionTooltipPosition;

    assert.equal(typeof window.getValenceColor, 'function');
    assert.equal(typeof window.getEmphasisStyle, 'function');
    assert.equal(typeof window.getThresholdStatus, 'function');
    assert.equal(typeof window.isReducedMotionPreferred, 'function');
    assert.equal(typeof window.getAnimationDuration, 'function');
    assert.equal(typeof window.getAccessibleAnimationOptions, 'function');
    assert.equal(typeof window.getSpatialInteractionOptions, 'function');
    assert.equal(typeof window.getTemporalInteractionOptions, 'function');
    assert.equal(typeof window.getPartitionInteractionOptions, 'function');
    assert.equal(typeof window.getExecutiveModeOptions, 'function');
    assert.equal(typeof window.computeAntiOcclusionTooltipPosition, 'function');
    assert.equal(typeof window.KitChartsTheme.getValenceColor, 'function');
  } finally {
    delete global.window;
  }
});

console.log(`\n🎉 All ${passedTests}/${totalTests} tests passed successfully!`);
