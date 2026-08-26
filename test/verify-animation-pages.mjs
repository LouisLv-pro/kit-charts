/**
 * @file test/verify-animation-pages.mjs
 * @description Automated verification for the 8 standalone animation pattern demo pages, folders, and main preview.
 */

import fs from 'fs';
import path from 'path';
import { assert } from './test-helpers.js';

console.log('🧪 Starting Standalone Animation Pages & Folders Verification...\n');

const patterns = [
  { folder: '01-staged-transitions', rootFile: '01-staged-transitions.html' },
  { folder: '02-anti-change-blindness', rootFile: '02-anti-change-blindness.html' },
  { folder: '03-preattentive-pulse', rootFile: '03-preattentive-pulse.html' },
  { folder: '04-continuous-zoom', rootFile: '04-continuous-zoom.html' },
  { folder: '05-mot-stagger', rootFile: '05-mot-stagger.html' },
  { folder: '06-apprehension-replay', rootFile: '06-apprehension-replay.html' },
  { folder: '07-event-segmentation', rootFile: '07-event-segmentation.html' },
  { folder: '08-lasseter-anticipation', rootFile: '08-lasseter-anticipation.html' }
];

const templateDir = path.resolve('template/animation');
let passed = 0;

// Verify main animation preview.html
const mainPreview = path.join(templateDir, 'preview.html');
assert(fs.existsSync(mainPreview), 'Main animation preview.html exists');
const mainContent = fs.readFileSync(mainPreview, 'utf8');
assert(mainContent.includes('chart.umd.min.js'), 'main preview.html loads chart.umd.min.js');
assert(mainContent.includes('theme-tokens.js'), 'main preview.html loads theme-tokens.js');
assert(mainContent.includes('breadcrumb'), 'main preview.html contains breadcrumb');
assert(/Quand l['’]utiliser/i.test(mainContent), 'main preview.html contains Quand l\'utiliser');
assert(/Quand (ne pas|pas) l['’]utiliser/i.test(mainContent), 'main preview.html contains Quand ne pas l\'utiliser');
assert(!mainContent.includes('math-formula') && !mainContent.includes('math-card'), 'main preview.html is free of math cards/formulas');
assert(!mainContent.includes('class="pattern-nav"') && !mainContent.includes('class="nav-tabs"'), 'main preview.html is free of cross-navigation pattern tabs');
assert(mainContent.includes('reducedMotionBtn'), 'main preview.html contains reduced motion button');
console.log('  ✓ Main animation laboratory preview.html verified');

patterns.forEach(p => {
  // Check folder structure
  const folderPreview = path.join(templateDir, p.folder, 'preview.html');
  const folderTemplate = path.join(templateDir, p.folder, 'template.js');
  const rootPage = path.join(templateDir, p.rootFile);

  assert(fs.existsSync(folderPreview), `Folder preview exists: ${p.folder}/preview.html`);
  assert(fs.existsSync(folderTemplate), `Folder template exists: ${p.folder}/template.js`);
  assert(fs.existsSync(rootPage), `Root HTML page exists: ${p.rootFile}`);

  // Check folder preview
  const content = fs.readFileSync(folderPreview, 'utf8');
  assert(content.includes('chart.umd.min.js'), `${p.folder} loads chart.umd.min.js`);
  assert(content.includes('theme-tokens.js'), `${p.folder} loads theme-tokens.js`);
  assert(content.includes('breadcrumb'), `${p.folder}/preview.html contains breadcrumb`);
  assert(content.includes('← kit-charts'), `${p.folder}/preview.html contains ← kit-charts link`);
  assert(content.includes('11-animation'), `${p.folder}/preview.html contains 11-animation link`);
  assert(/Quand l['’]utiliser/i.test(content), `${p.folder}/preview.html contains Quand l'utiliser`);
  assert(/Quand (ne pas|pas) l['’]utiliser/i.test(content), `${p.folder}/preview.html contains Quand ne pas l'utiliser`);
  assert(!content.includes('math-formula') && !content.includes('math-card'), `${p.folder}/preview.html is free of math cards/formulas`);
  assert(!content.includes('class="pattern-nav"') && !content.includes('class="nav-tabs"'), `${p.folder}/preview.html has no cross-tab navigation`);
  assert(content.includes('btnReducedMotion'), `${p.folder}/preview.html contains reduced motion toggle`);

  // Check root page
  const rootContent = fs.readFileSync(rootPage, 'utf8');
  assert(rootContent.includes('breadcrumb'), `${p.rootFile} contains breadcrumb`);
  assert(rootContent.includes('← kit-charts'), `${p.rootFile} contains ← kit-charts link`);
  assert(rootContent.includes('11-animation'), `${p.rootFile} contains 11-animation link`);
  assert(/Quand l['’]utiliser/i.test(rootContent), `${p.rootFile} contains Quand l'utiliser`);
  assert(/Quand (ne pas|pas) l['’]utiliser/i.test(rootContent), `${p.rootFile} contains Quand ne pas l'utiliser`);
  assert(!rootContent.includes('math-formula') && !rootContent.includes('math-card'), `${p.rootFile} is free of math cards/formulas`);
  assert(!rootContent.includes('class="pattern-nav"') && !rootContent.includes('class="nav-tabs"'), `${p.rootFile} has no cross-tab navigation`);
  assert(rootContent.includes('btnReducedMotion'), `${p.rootFile} contains reduced motion toggle`);

  console.log(`  ✓ ${p.folder} verified (preview.html, template.js, ${p.rootFile})`);
  passed++;
});

console.log(`\n🎉 All ${passed}/${patterns.length} Standalone Animation patterns verified successfully!\n`);
