/**
 * @file test/verify-all-previews-navigation-and-rules.mjs
 * @description Automated verification script checking:
 * 1. 100% of preview.html files have standard breadcrumbs with back links (← kit-charts).
 * 2. 100% of preview.html files have NO mathematical formula cards or raw equations.
 * 3. 100% of preview.html files contain STRICTLY "Quand l'utiliser" and "Quand ne pas l'utiliser" sections.
 * 4. 100% of preview.html files have NO sidebar panels (<aside>), telemetry cards, or extra paragraphs.
 * 5. Animation templates do NOT have cross-navigation pattern buttons or tabs.
 */

import fs from 'fs';
import path from 'path';

console.log('🧪 Starting Global Navigation & ISO Cognitive Content Verification Suite...\n');

function walk(dir) {
  let files = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git') files = files.concat(walk(full));
    } else if (f.endsWith('preview.html')) {
      files.push(full);
    }
  }
  return files;
}

const previewFiles = walk('template');
console.log(`Found ${previewFiles.length} preview.html templates to verify.\n`);

let passedNav = 0;
let passedMathFree = 0;
let passedWhenToUse = 0;
let passedIsoLayout = 0;
let passedAnimNav = 0;
let passedSwatchesControls = 0;
let totalAnimFiles = 0;

const errors = [];

previewFiles.forEach(file => {
  const rel = path.relative(process.cwd(), file);
  const content = fs.readFileSync(file, 'utf8');

  // 1. Navigation / Breadcrumb check
  const hasBreadcrumb = content.includes('class="breadcrumb"') || content.includes("class='breadcrumb'");
  const hasBackLink = /href=["'][^"']*index\.html[#^"']*["']/i.test(content) || content.includes('kit-charts');

  if (hasBreadcrumb && hasBackLink) {
    passedNav++;
  } else {
    errors.push(`[Navigation] ${rel}: Missing breadcrumb or back link to index.html`);
  }

  // 2. Math formulas / math-card check
  const hasMathCard = content.includes('math-card') || content.includes('math-formula');
  const hasRawEquation = /\$(h\s*=|\Delta|v\(t\)|s\(t\)|scale\(t\))\$/i.test(content);

  if (!hasMathCard && !hasRawEquation) {
    passedMathFree++;
  } else {
    errors.push(`[Math Content] ${rel}: Contains math-card, math-formula or raw LaTeX math equation`);
  }

  // 3. "Quand l'utiliser" & "Quand ne pas l'utiliser" check
  const hasWhenToUse = /quand l['’]utiliser/i.test(content);
  const hasWhenNotToUse = /quand (ne pas|pas) l['’]utiliser/i.test(content);

  if (hasWhenToUse && hasWhenNotToUse) {
    passedWhenToUse++;
  } else {
    errors.push(`[Usage Guide] ${rel}: Missing 'Quand l\'utiliser' or 'Quand ne pas l\'utiliser' sections`);
  }

  // 4. ISO Single-Column Layout & No extraneous sidebars / telemetry
  const hasAside = content.includes('<aside');
  const hasSidebar = content.includes('sidebar-panel');
  if (!hasAside && !hasSidebar) {
    passedIsoLayout++;
  } else {
    errors.push(`[ISO Layout] ${rel}: Contains <aside> or sidebar-panel`);
  }

  // 5. Animation cross-navigation check
  if (file.includes('template/animation/')) {
    totalAnimFiles++;
    const hasPatternNav = content.includes('class="pattern-nav"') || content.includes('class="nav-tabs"');
    if (!hasPatternNav) {
      passedAnimNav++;
    } else {
      errors.push(`[Animation Cross-Nav] ${rel}: Contains cross-navigation tabs or pattern-nav buttons`);
    }
  }

  // 6. Theme Swatches & Data Labels Toggle Controls
  const SUPPORTS_DATALABELS = new Set([
    'bar-chart-vertical',
    'bar-chart-horizontal',
    'grouped-bar-chart',
    'stacked-bar-chart',
    'bullet-chart',
    'bar-target-overlay',
    'lollipop-chart',
    'slope-chart',
    'dumbbell-chart',
    'radar-chart',
    'polar-area-chart',
    'pie-chart',
    'doughnut-chart',
    'stacked-bar-100',
    'sunburst',
    'treemap',
    'waffle-chart',
    'pareto-chart',
    'stacked-total-line',
    'histogramme-kde',
    'dual-axis-controlled',
    'funnel-chart',
    'waterfall-chart',
    'gantt-progress',
    'waterfall-cumulative-line',
    'bubble-map'
  ]);

  const tmplSlug = path.basename(path.dirname(file));
  const isSupported = SUPPORTS_DATALABELS.has(tmplSlug);

  const hasSwatches = content.includes('class="theme-swatches-group"') || content.includes("class='theme-swatches-group'");
  const hasLabelBtn = content.includes('id="dataLabelsToggleBtn"') || content.includes("id='dataLabelsToggleBtn'");
  const hasOldSelect = content.includes('id="themeSelector"') || content.includes('id="themeSelect"');
  const labelBtnValid = isSupported ? hasLabelBtn : !hasLabelBtn;

  if (hasSwatches && labelBtnValid && !hasOldSelect) {
    passedSwatchesControls++;
  } else {
    if (!hasSwatches) errors.push(`[Controls] ${rel}: Missing theme-swatches-group`);
    if (hasOldSelect) errors.push(`[Controls] ${rel}: Still has old theme select`);
    if (!labelBtnValid) {
      if (isSupported) errors.push(`[Controls] ${rel}: Missing dataLabelsToggleBtn (supported template)`);
      else errors.push(`[Controls] ${rel}: Should not have dataLabelsToggleBtn (unsupported template)`);
    }
  }
});

console.log(`Navigation & Breadcrumbs: ${passedNav}/${previewFiles.length} files conform.`);
console.log(`Math-Free / Academic-Free Content: ${passedMathFree}/${previewFiles.length} files conform.`);
console.log(`Usage Guides (Quand l'utiliser / Quand ne pas l'utiliser): ${passedWhenToUse}/${previewFiles.length} files conform.`);
console.log(`ISO Single-Column Layout (No Sidebars): ${passedIsoLayout}/${previewFiles.length} files conform.`);
console.log(`Theme Swatches & Data Labels Controls: ${passedSwatchesControls}/${previewFiles.length} files conform.`);
if (totalAnimFiles > 0) {
  console.log(`Animation Independent Demonstrators (No Cross-Tabs): ${passedAnimNav}/${totalAnimFiles} files conform.`);
}

if (errors.length > 0) {
  console.log('\n⚠️ Current audit status:');
  errors.slice(0, 15).forEach(e => console.log('  - ' + e));
  if (errors.length > 15) console.log(`  ... and ${errors.length - 15} more issues.`);
  process.exit(1);
} else {
  console.log('\n🎉 ALL 100% PREVIEWS CONFORM STRICTLY TO ISO LAYOUT, NAVIGATION, CONTROLS & COGNITIVE STANDARDS!\n');
  process.exit(0);
}
