import fs from 'fs';
import path from 'path';

const ROOT = '/Users/louislaville/Desktop/kit-charts';

const files = [
  'template/03-distribution/box-strip-plot/template.js',
  'template/03-distribution/raincloud-plot/template.js',
  'template/03-distribution/violin-plot/template.js',
  'template/05-evolution-temporelle/candlestick-volume/template.js',
  'template/05-evolution-temporelle/dual-axis-controlled/template.js',
  'template/05-evolution-temporelle/price-indicator-overlays/template.js',
  'template/04-correlation-relation/scatter-regression/template.js',
  'template/04-correlation-relation/joint-scatter-marginals/template.js',
  'template/01-comparaison/bar-target-overlay/template.js',
  'template/02-composition-part-to-whole/stacked-total-line/template.js',
  'template/06-flux-processus/gantt-progress/template.js',
  'template/06-flux-processus/waterfall-cumulative-line/template.js',
  'template/02-composition-part-to-whole/pareto-chart/template.js',
  'template/03-distribution/histogramme-kde/template.js'
];

for (const rel of files) {
  const filePath = path.join(ROOT, rel);
  if (!fs.existsSync(filePath)) continue;
  let code = fs.readFileSync(filePath, 'utf8');

  // Fix patterns like 'word" or \'word" or 'word\"
  // Let's inspect line by line
  const lines = code.split('\n');
  const fixedLines = lines.map(line => {
    let l = line;
    // Replace 'Contrôle", \'Traitement A", 'Traitement B", \'Placebo"]
    l = l.replace(/'Contrôle",\s*\\'Traitement A",\s*'Traitement B",\s*\\'Placebo"]/g, "['Contrôle', 'Traitement A', 'Traitement B', 'Placebo']");
    l = l.replace(/typeof exports === 'object"\s*&&\s*typeof module !== \\'undefined"/g, "typeof exports === 'object' && typeof module !== 'undefined'");
    l = l.replace(/\\'/g, "'");
    return l;
  });

  const fixedCode = fixedLines.join('\n');
  if (fixedCode !== code) {
    fs.writeFileSync(filePath, fixedCode, 'utf8');
    console.log(`Updated ${rel}`);
  }
}
