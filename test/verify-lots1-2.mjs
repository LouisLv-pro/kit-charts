/**
 * @file test/verify-lots1-2.mjs
 * @description Dedicated Automated Verification Suite for Lot 1 and Lot 2 Templates.
 * Tests emphasis, valence, markdown documentation, and backwards-compatibility across 16 templates.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getThemeTokens, THEME_NAMES } from '../themes/theme-tokens.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const LOT1_TEMPLATES = [
  'template/01-comparaison/bar-chart-vertical',
  'template/01-comparaison/bar-chart-horizontal',
  'template/01-comparaison/grouped-bar-chart',
  'template/01-comparaison/stacked-bar-chart',
  'template/01-comparaison/bullet-chart',
  'template/01-comparaison/lollipop-chart',
  'template/01-comparaison/slope-chart',
  'template/01-comparaison/dumbbell-chart',
  'template/01-comparaison/radar-chart',
  'template/01-comparaison/polar-area-chart'
];

const LOT2_TEMPLATES = [
  'template/02-composition-part-to-whole/pie-chart',
  'template/02-composition-part-to-whole/doughnut-chart',
  'template/02-composition-part-to-whole/stacked-bar-100',
  'template/02-composition-part-to-whole/sunburst',
  'template/02-composition-part-to-whole/treemap',
  'template/02-composition-part-to-whole/waffle-chart'
];

const ALL_TEMPLATES = [...LOT1_TEMPLATES, ...LOT2_TEMPLATES];

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

async function runVerification() {
  console.log('\n🧪 Starting Lot 1 & Lot 2 Deep Verification Suite...\n');

  // Test 1: Markdown Documentation Integrity
  console.log('📚 1. Markdown Documentation & Cognitive Rules Sections:');
  for (const tPath of ALL_TEMPLATES) {
    const parts = tPath.replace(/^template\//, '').split('/');
    const category = parts[0];
    const id = parts[1];
    const mdFile = path.join(ROOT, 'guide', category, `${id}.md`);
    assert(fs.existsSync(mdFile), `${id}.md exists`);

    const content = fs.readFileSync(mdFile, 'utf-8');
    assert(
      content.includes("## Règles Cognitives d'Accentuation & Valence") ||
      content.includes("## 8. Règles Cognitives d'Accentuation & Valence"),
      `${id}.md contains 'Règles Cognitives d'Accentuation & Valence' section`
    );
    assert(
      content.includes('90/10') || content.includes('Hero'),
      `${id}.md documents 90/10 Visual Hierarchy / Hero vs Context`
    );
    assert(
      content.includes('Valence') || content.includes('Gain vs Coût') || content.includes('directionnalité'),
      `${id}.md documents Business Valence & Directionality`
    );
    assert(
      content.includes('Seuils') || content.includes('Cible vs Réel') || content.includes('Threshold'),
      `${id}.md documents Target vs Actual Thresholds`
    );
    assert(
      content.includes('Double Encodage') || content.includes('CVD') || content.includes('Accessibilité') || content.includes('double-encodage'),
      `${id}.md documents Double Encoding & CVD Accessibility`
    );
    assert(
      content.includes('```javascript') && (content.includes('createChart') || content.includes('tokens')),
      `${id}.md includes code example for emphasis / valence`
    );
  }

  // Test 2: Module Loading and Exports
  console.log('\n📦 2. Module Loading and Factory Structure:');
  for (const tPath of ALL_TEMPLATES) {
    const parts = tPath.replace(/^template\//, '').split('/');
    const category = parts[0];
    const id = parts[1];
    const jsFile = path.join(ROOT, 'template', category, id, 'template.js');
    assert(fs.existsSync(jsFile), `${id} template.js exists`);

    const mod = await import(jsFile);
    const exp = mod.default || mod;
    assert(typeof exp.createChart === 'function', `${id} exports createChart()`);
    assert(typeof exp.DEFAULT_DATA === 'object', `${id} exports DEFAULT_DATA`);
    assert(typeof exp.getEmphasisStyle === 'function', `${id} exports getEmphasisStyle()`);
    assert(typeof exp.getValenceColor === 'function', `${id} exports getValenceColor()`);
    assert(typeof exp.getThresholdStatus === 'function', `${id} exports getThresholdStatus()`);
  }

  // Test 3: Chart Execution Across 8 Themes
  console.log('\n🎨 3. Chart Instantiation with 8 Themes (Mock Headless):');
  const mockCanvas = {
    getContext: () => ({
      measureText: () => ({ width: 40 }),
      fillText: () => {},
      beginPath: () => {},
      arc: () => {},
      fill: () => {},
      stroke: () => {},
      save: () => {},
      restore: () => {},
      moveTo: () => {},
      lineTo: () => {}
    }),
    parentElement: null
  };

  for (const tPath of ALL_TEMPLATES) {
    const parts = tPath.replace(/^template\//, '').split('/');
    const category = parts[0];
    const id = parts[1];
    const mod = await import(path.join(ROOT, 'template', category, id, 'template.js'));
    const exp = mod.default || mod;
    for (const theme of THEME_NAMES) {
      const chart = exp.createChart(mockCanvas, null, theme);
      assert(chart && (chart.data || chart.config), `${id} instantiates with theme ${theme}`);
    }
  }

  // Test 4: Semantic Emphasis Injection
  console.log('\n🎯 4. Semantic Emphasis & Valence Data Injection:');
  for (const tPath of ALL_TEMPLATES) {
    const parts = tPath.replace(/^template\//, '').split('/');
    const category = parts[0];
    const id = parts[1];
    const mod = await import(path.join(ROOT, 'template', category, id, 'template.js'));
    const exp = mod.default || mod;

    const customEmphasisData = {
      labels: ['A', 'B', 'C'],
      datasets: [{
        label: 'Test Series',
        data: [10, 20, 30],
        emphasisRoles: ['focal', 'context', 'anomaly'],
        emphasisRole: 'focal',
        valence: 1,
        metricType: 'gain'
      }]
    };

    const chart = exp.createChart(mockCanvas, customEmphasisData, 'colorbrewer-accessible');
    assert(chart && (chart.data || chart.config), `${id} handles custom emphasisRoles data`);
  }

  console.log(`\n======================================================`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log(`======================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runVerification().catch(err => {
  console.error('Fatal Verification Error:', err);
  process.exit(1);
});
