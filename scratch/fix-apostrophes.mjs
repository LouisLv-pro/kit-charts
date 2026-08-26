import fs from 'fs';
import path from 'path';

const ROOT = '/Users/louislaville/Desktop/kit-charts';

const files = [
  'template/02-composition-part-to-whole/pareto-chart/template.js',
  'template/02-composition-part-to-whole/stacked-total-line/template.js',
  'template/03-distribution/violin-plot/template.js',
  'template/04-correlation-relation/joint-scatter-marginals/template.js',
  'template/06-flux-processus/gantt-progress/template.js',
  'template/06-flux-processus/waterfall-cumulative-line/template.js',
  'template/08-geospatial-cartes/cartogram-tilegram/template.js',
  'template/animation/01-staged-transitions/template.js',
  'template/animation/06-apprehension-replay/template.js',
  'template/animation/08-lasseter-anticipation/template.js'
];

for (const rel of files) {
  const filePath = path.join(ROOT, rel);
  if (!fs.existsSync(filePath)) continue;
  let code = fs.readFileSync(filePath, 'utf8');

  // Fix apostrophes
  code = code.replace(/'([^'\n]*d'[^'\n]*)'/g, '"$1"');
  code = code.replace(/'([^'\n]*l'[^'\n]*)'/g, '"$1"');
  code = code.replace(/'([^'\n]*qu'[^'\n]*)'/g, '"$1"');
  code = code.replace(/'([^'\n]*Aujourd'hui[^'\n]*)'/g, '"$1"');

  // Specific fixes
  code = code.replace(/'Erreur d'authentification'/g, '"Erreur d\'authentification"');
  code = code.replace(/'Chiffre d'Affaires'/g, '"Chiffre d\'Affaires"');
  code = code.replace(/'Chiffre d'affaires/g, '"Chiffre d\'affaires');
  code = code.replace(/'Temps d'Attente/g, '"Temps d\'Attente');
  code = code.replace(/'Temps d'attente/g, '"Temps d\'attente');
  code = code.replace(/'Frais d'Infrastructure/g, '"Frais d\'Infrastructure');
  code = code.replace(/'Frais d'infrastructure/g, '"Frais d\'infrastructure');
  code = code.replace(/'Frais d'Exploitation/g, '"Frais d\'Exploitation');
  code = code.replace(/'Provence-Alpes-Côte d'Azur'/g, '"Provence-Alpes-Côte d\'Azur"');
  code = code.replace(/'Gain d'Efficacité/g, '"Gain d\'Efficacité');
  code = code.replace(/'Gain d'efficacité/g, '"Gain d\'efficacité');
  code = code.replace(/'Score d'Appréhension/g, '"Score d\'Appréhension');
  code = code.replace(/'Taux d'Erreur/g, '"Taux d\'Erreur');
  code = code.replace(/'Taux d'erreur/g, '"Taux d\'erreur');

  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`Processed: ${rel}`);
}
