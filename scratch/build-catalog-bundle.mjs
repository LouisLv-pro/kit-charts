import fs from 'fs';
import path from 'path';

const ROOT = '/Users/louislaville/Desktop/kit-charts';

const COMBO_TEMPLATES = [
  { id: 'histogramme-kde', cat: '03-distribution' },
  { id: 'box-strip-plot', cat: '03-distribution' },
  { id: 'raincloud-plot', cat: '03-distribution' },
  { id: 'candlestick-volume', cat: '05-evolution-temporelle' },
  { id: 'pareto-chart', cat: '02-composition-part-to-whole' },
  { id: 'scatter-regression', cat: '04-correlation-relation' },
  { id: 'bar-target-overlay', cat: '01-comparaison' },
  { id: 'dual-axis-controlled', cat: '05-evolution-temporelle' },
  { id: 'joint-scatter-marginals', cat: '04-correlation-relation' },
  { id: 'stacked-total-line', cat: '02-composition-part-to-whole' },
  { id: 'gantt-progress', cat: '06-flux-processus' },
  { id: 'waterfall-cumulative-line', cat: '06-flux-processus' },
  { id: 'price-indicator-overlays', cat: '05-evolution-temporelle' }
];

function extractFactoryBody(templatePath) {
  const code = fs.readFileSync(templatePath, 'utf8');
  // Match the factory function passed at the bottom of UMD:
  // function(KitChartsTheme) { ... }
  const match = code.match(/function\s*\(\s*KitChartsTheme\s*\)\s*\{([\s\S]*)\}\s*\)\s*;\s*$/);
  if (!match) {
    throw new Error(`Could not extract factory from ${templatePath}`);
  }
  return match[1].trim();
}

function makeBundleChunk(id, cat, templatePath) {
  const factoryBody = extractFactoryBody(templatePath);
  return `
  // --------------------------------------------------------------------------
  // Chart: template/${cat}/${id}
  // --------------------------------------------------------------------------
  global.KitCharts["${id}"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {
      ${factoryBody}
    };
    return factory(KitChartsTheme);
  })();
`;
}

// 1. Read existing bundle
let bundleCode = fs.readFileSync(path.join(ROOT, 'catalog-bundle.js'), 'utf8');

// 2. Remove any previously appended combo blocks (for idempotency)
COMBO_TEMPLATES.forEach(c => {
  const chunkHeader = `// Chart: template/${c.cat}/${c.id}`;
  const regex = new RegExp(`\\s*\\/\\/ -+\\s*\\n\\s*\\/\\/ Chart: template\\/${c.cat}\\/${c.id}[\\s\\S]*?\\n\\s*\\}\\)\\(\\);`, 'g');
  bundleCode = bundleCode.replace(regex, '');
});

// Also update violin-plot if needed
const violinPath = path.join(ROOT, 'template/03-distribution/violin-plot/template.js');
const violinChunk = `
  // --------------------------------------------------------------------------
  // Chart: template/03-distribution/violin-plot
  // --------------------------------------------------------------------------
  global.KitCharts["violin-plot"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {
      ${extractFactoryBody(violinPath)}
    };
    return factory(KitChartsTheme);
  })();
`;
const violinRegex = /\s*\/\/ -+\s*\n\s*\/\/ Chart: template\/03-distribution\/violin-plot[\s\S]*?\n\s*\}\)\(\);/;
if (violinRegex.test(bundleCode)) {
  bundleCode = bundleCode.replace(violinRegex, '\n' + violinChunk.trim());
  console.log('Updated violin-plot in catalog-bundle.js');
}

// 3. Generate chunks for the 13 combo templates
let newChunks = '';
for (const c of COMBO_TEMPLATES) {
  const tplPath = path.join(ROOT, `template/${c.cat}/${c.id}/template.js`);
  newChunks += makeBundleChunk(c.id, c.cat, tplPath) + '\n';
}

// 4. Insert before closing IIFE
const closingPattern = /\}\)\(typeof globalThis !== "undefined"[\s\S]*?\);\s*$/;
if (!closingPattern.test(bundleCode)) {
  throw new Error('Could not find bundle closing IIFE');
}

bundleCode = bundleCode.replace(closingPattern, (match) => {
  return newChunks + '\n' + match;
});

fs.writeFileSync(path.join(ROOT, 'catalog-bundle.js'), bundleCode, 'utf8');
console.log('Successfully updated catalog-bundle.js with all 13 combo templates!');
