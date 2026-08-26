/**
 * @file test/verify-kpi-cards.mjs
 * @description Automated verification suite for the 7 cognitive KPI Card templates.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

console.log('🧪 Starting KPI Cards Verification Suite...\n');

const KPI_CARDS = [
  'kpi-standard',
  'kpi-sparkline',
  'kpi-bullet',
  'kpi-comparative',
  'kpi-distribution',
  'kpi-status-alert',
  'kpi-composite'
];

// 1. Check disk files
console.log('📁 1. Verifying folder & file structure on disk...');
for (const id of KPI_CARDS) {
  const dir = path.join(ROOT, 'template', '00-kpi-card', id);
  assert.ok(fs.existsSync(dir), `Directory template/00-kpi-card/${id} must exist`);

  const templateJs = path.join(dir, 'template.js');
  const previewHtml = path.join(dir, 'preview.html');
  const docMd = path.join(dir, `${id}.md`);

  assert.ok(fs.existsSync(templateJs), `template.js must exist for ${id}`);
  assert.ok(fs.existsSync(previewHtml), `preview.html must exist for ${id}`);
  assert.ok(fs.existsSync(docMd), `${id}.md must exist for ${id}`);

  const templateContent = fs.readFileSync(templateJs, 'utf8');
  assert.ok(templateContent.includes('createChart'), `template.js must define createChart for ${id}`);
  assert.ok(templateContent.includes('DEFAULT_DATA'), `template.js must define DEFAULT_DATA for ${id}`);
}
assert.ok(fs.existsSync(path.join(ROOT, 'template', '00-kpi-card', 'preview.html')), 'Master preview.html must exist');
assert.ok(fs.existsSync(path.join(ROOT, 'guide', '00-kpi-card', 'kpi-cards.md')), 'Guide kpi-cards.md must exist');
console.log('   ✅ All 7 KPI Card folders, preview files, and docs exist on disk.\n');

// 2. Check index.html CATALOG registry
console.log('🌐 2. Verifying index.html CATALOG registration...');
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
assert.ok(indexHtml.includes('00-kpi-card'), 'index.html must contain 00-kpi-card category');
assert.ok(indexHtml.includes('00. KPI Cards'), 'index.html must contain 00. KPI Cards label');

for (const id of KPI_CARDS) {
  assert.ok(indexHtml.includes(`id: '${id}'`), `CATALOG must contain ${id}`);
}
console.log('   ✅ All 7 KPI cards registered in index.html CATALOG.\n');

// 3. Check catalog-bundle.js
console.log('📦 3. Verifying catalog-bundle.js bundle integration...');
const bundleContent = fs.readFileSync(path.join(ROOT, 'catalog-bundle.js'), 'utf8');
for (const id of KPI_CARDS) {
  assert.ok(bundleContent.includes(`global.KitCharts["${id}"]`), `catalog-bundle.js must register global.KitCharts["${id}"]`);
}
console.log('   ✅ All 7 KPI cards present in catalog-bundle.js.\n');

// 4. Test CommonJS / UMD execution of each template
console.log('⚙️ 4. Testing runtime execution of each template module...');
for (const id of KPI_CARDS) {
  const modPath = path.join(ROOT, 'template', '00-kpi-card', id, 'template.js');
  // Load via CommonJS
  const { createRequire } = await import('node:module');
  const require = createRequire(import.meta.url);
  const mod = require(modPath);

  assert.ok(typeof mod.createChart === 'function', `${id} must export createChart`);
  assert.ok(mod.DEFAULT_DATA, `${id} must export DEFAULT_DATA`);
  if (mod.renderCard) {
    assert.ok(typeof mod.renderCard === 'function', `${id} must export renderCard`);
  }
}
console.log('   ✅ All 7 KPI Card modules execute and export correctly.\n');

console.log('🎉 ALL KPI CARDS TESTS PASSED PERFECTLY!');
