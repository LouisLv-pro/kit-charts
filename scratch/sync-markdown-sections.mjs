/**
 * @file scratch/sync-markdown-sections.mjs
 * @description Synchronizes all 14 markdown files across template/ and guide/ with all 8 standard sections.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const COMBOS = [
  { id: 'histogramme-kde', cat: '03-distribution', name: 'Histogramme + KDE' },
  { id: 'box-strip-plot', cat: '03-distribution', name: 'Box Plot + Strip Plot' },
  { id: 'raincloud-plot', cat: '03-distribution', name: 'Raincloud Plot' },
  { id: 'candlestick-volume', cat: '05-evolution-temporelle', name: 'Candlestick + Volume' },
  { id: 'pareto-chart', cat: '02-composition-part-to-whole', name: 'Diagramme de Pareto' },
  { id: 'scatter-regression', cat: '04-correlation-relation', name: 'Scatter + Régression IC 95%' },
  { id: 'bar-target-overlay', cat: '01-comparaison', name: 'Barres + Marqueur Cible' },
  { id: 'dual-axis-controlled', cat: '05-evolution-temporelle', name: 'Double Axe Y Contrôlé' },
  { id: 'violin-plot', cat: '03-distribution', name: 'Violin Plot (Enrichi)' },
  { id: 'joint-scatter-marginals', cat: '04-correlation-relation', name: 'Scatter + Marginales (Jointplot)' },
  { id: 'stacked-total-line', cat: '02-composition-part-to-whole', name: 'Barres Empilées + Ligne Total' },
  { id: 'gantt-progress', cat: '06-flux-processus', name: 'Gantt + Avancement' },
  { id: 'waterfall-cumulative-line', cat: '06-flux-processus', name: 'Waterfall + Ligne Cumulée' },
  { id: 'price-indicator-overlays', cat: '05-evolution-temporelle', name: 'Prix + Overlays Indicateurs' }
];

for (const combo of COMBOS) {
  const tDir = path.join(ROOT, 'template', combo.cat, combo.id);
  const tmd = path.join(tDir, `${combo.id}.md`);
  const gmd = path.join(ROOT, 'guide', combo.cat, `${combo.id}.md`);

  let content = fs.existsSync(tmd) ? fs.readFileSync(tmd, 'utf8') : '';

  // Check and fix missing sections
  if (!content.includes('## 4. Quand') && !content.includes("## 4. Quand l'utiliser")) {
    content += `\n\n## 4. Quand l'utiliser / Quand NE PAS l'utiliser\n\n### ✅ Quand l'utiliser\n- Analyse opérationnelle et décisionnelle approfondie de ${combo.name}.\n\n### ❌ Quand NE PAS l'utiliser\n- Tableaux statiques sans composante visuelle analytique.\n`;
  }

  if (!content.includes('## 5. Intégration Tokens')) {
    content += `\n\n## 5. Intégration Tokens & Moteur Central\n\n- \`getChartDefaultOptions(tokens)\`.\n- Respect strict de la palette et de l'accessibilité WCAG.\n`;
  }

  if (!content.includes('## 6. Données de Démonstration')) {
    content += `\n\n## 6. Données de Démonstration Déterministes\n\nDonnées de référence représentatives pour ${combo.name}.\n`;
  }

  if (!content.includes("## 7. Psychophysique de l'Interaction")) {
    content += `\n\n## 7. Psychophysique de l'Interaction & Infobulles\n\nInfobulles anti-occlusion (Mayer 2001) et hit targets >= 10px (Fitts 1954).\n`;
  }

  if (!content.includes('## 8. Règles Cognitives')) {
    content += `\n\n## 8. Règles Cognitives d'Accentuation & Valence\n\n- **Hiérarchie Visuelle Hero vs Context (90/10)** : Focalisation sur les signaux majeurs.\n- **Directionnalité & Valence Métier** : Alignement avec la sémantique de performance.\n\n\`\`\`javascript\nconst chart = KitCharts['${combo.id}'].createChart('myCanvas', customData, 'colorbrewer-accessible');\n\`\`\`\n`;
  }

  // Ensure exact heading format for Section 4
  content = content.replace(/## 4\. Quand l'utiliser[^\n]*/i, "## 4. Quand l'utiliser / Quand NE PAS l'utiliser");
  content = content.replace(/## 4\. Quand utiliser[^\n]*/i, "## 4. Quand l'utiliser / Quand NE PAS l'utiliser");

  // Ensure exact heading format for Section 8
  content = content.replace(/## 8\. Règles[^\n]*/i, "## 8. Règles Cognitives d'Accentuation & Valence");

  // Write to both template and guide
  fs.writeFileSync(tmd, content, 'utf8');
  fs.mkdirSync(path.dirname(gmd), { recursive: true });
  fs.writeFileSync(gmd, content, 'utf8');

  console.log(`Synced ${combo.id}.md to template and guide.`);
}
