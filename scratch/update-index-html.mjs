import fs from 'fs';
import path from 'path';

const ROOT = '/Users/louislaville/Desktop/kit-charts';
const indexPath = path.join(ROOT, 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

// 1. Update badges & counters
content = content.replace(
  /<div class="toolbar-badge-total">\d+ Templates<\/div>/,
  '<div class="toolbar-badge-total">82 Templates</div>'
);

content = content.replace(
  /(<section class="portal-section" id="section-charts">[\s\S]*?<h2 class="section-title">[\s\S]*?<span class="section-count-tag">)\d+ templates(<\/span>)/,
  '$159 templates$2'
);

content = content.replace(
  /<li><a href="#section-charts">📊 Graphiques \(\d+\)<\/a><\/li>/,
  '<li><a href="#section-charts">📊 Graphiques (59)</a></li>'
);

// 2. Update CATALOG entries
const NEW_CATALOG_ENTRIES = {
  '01-comparaison': `      {
        id: 'bar-target-overlay',
        title: 'Barres + Marqueur de Cible (Target Overlay)',
        category: '01-comparaison',
        categoryLabel: '01. Comparaison',
        plugin: null,
        pluginLabel: 'Combo Hybride',
        cognitiveRank: 'Rang 1 (Position sur échelle commune & marqueur transversal)',
        cognitiveSummary: 'Barres horizontales de réalisation combinées à un marqueur de cible perpendiculaire et deltas de variance automatisés.',
        tags: ['comparaison', 'combo', 'cible', 'target', 'benchmark', 'variance', 'kpi', 'delta', 'stephen few']
      },`,

  '02-composition-part-to-whole': `      {
        id: 'pareto-chart',
        title: 'Diagramme de Pareto (Loi 80/20)',
        category: '02-composition-part-to-whole',
        categoryLabel: '02. Composition',
        plugin: null,
        pluginLabel: 'Combo Hybride',
        cognitiveRank: 'Rang 1 (Position triée) & Rang 4 (Courbe de cumul)',
        cognitiveSummary: 'Barres triées par fréquence décroissante et courbe de pourcentage cumulé avec seuil des 80% (causes vitales) et coefficient de Gini.',
        tags: ['composition', 'combo', 'pareto', '80/20', 'qualité', 'juran', 'gini', 'cumul', 'vital few']
      },
      {
        id: 'stacked-total-line',
        title: 'Barres Empilées + Ligne de Total',
        category: '02-composition-part-to-whole',
        categoryLabel: '02. Composition',
        plugin: null,
        pluginLabel: 'Combo Hybride',
        cognitiveRank: 'Rang 1 (Ligne de total globale) & Rang 3 (Segments empilés)',
        cognitiveSummary: 'Décomposition part-to-whole des composantes et courbe de synthèse du total consolidé pour supprimer le calcul mental.',
        tags: ['composition', 'combo', 'empilé', 'stacked', 'total', 'macro', 'somme', 'skau', 'kosara']
      },`,

  '03-distribution': `      {
        id: 'histogramme-kde',
        title: 'Histogramme + Densité Continue (KDE)',
        category: '03-distribution',
        categoryLabel: '03. Distribution',
        plugin: null,
        pluginLabel: 'Combo Hybride',
        cognitiveRank: 'Rang 2 (Hauteur de barre) & Rang 4 (Courbe de densité continue)',
        cognitiveSummary: 'Décompte empirique par classes de Freedman-Diaconis et estimation de densité continue par noyau gaussien de Silverman sur axe commun.',
        tags: ['distribution', 'combo', 'histogramme', 'kde', 'densité', 'silverman', 'freedman-diaconis', 'gauss']
      },
      {
        id: 'box-strip-plot',
        title: 'Box Plot + Strip / Jitter Plot',
        category: '03-distribution',
        categoryLabel: '03. Distribution',
        plugin: null,
        pluginLabel: 'Combo Hybride',
        cognitiveRank: 'Rang 1 (Position de points) & Rang 2 (Boîte de Tukey)',
        cognitiveSummary: 'Résumé robuste à 5 nombres de Tukey et superposition déterministe au nombre d\'or des observations individuelles (Weissgerber 2015).',
        tags: ['distribution', 'combo', 'box plot', 'strip plot', 'jitter', 'tukey', 'weissgerber', 'outliers', 'points']
      },
      {
        id: 'raincloud-plot',
        title: 'Raincloud Plot (Half-Violin + Box + Rain)',
        category: '03-distribution',
        categoryLabel: '03. Distribution',
        plugin: null,
        pluginLabel: 'Combo Hybride',
        cognitiveRank: 'Architecture Tri-Hybride (Macro KDE + Méso Box + Micro Rain)',
        cognitiveSummary: 'Demi-densité KDE asymétrique sans redondance bilatérale, micro-boîte de Tukey et semis de points individuels jitterés (Allen & Kievit 2019).',
        tags: ['distribution', 'combo', 'raincloud', 'demi-violon', 'kievit', 'allen', 'micro-box', 'rain', 'densité']
      },`,

  '04-correlation-relation': `      {
        id: 'scatter-regression',
        title: 'Scatter Plot + Régression Linéaire + IC 95%',
        category: '04-correlation-relation',
        categoryLabel: '04. Corrélation',
        plugin: null,
        pluginLabel: 'Combo Hybride',
        cognitiveRank: 'Rang 1 (Position 2D) & Rang 4 (Tendance OLS et IC 95%)',
        cognitiveSummary: 'Nuage de points bivarié, ajustement par moindres carrés ordinaires (OLS), intervalle de confiance 95% et coefficient de Pearson.',
        tags: ['corrélation', 'combo', 'scatter', 'régression', 'ols', 'anscombe', 'intervalle de confiance', 'pearson']
      },
      {
        id: 'joint-scatter-marginals',
        title: 'Scatter Plot + Distributions Marginales (Jointplot)',
        category: '04-correlation-relation',
        categoryLabel: '04. Corrélation',
        plugin: null,
        pluginLabel: 'Combo Hybride',
        cognitiveRank: 'Rang 1 (Position 2D) & Rang 4 (Rubans marginaux KDE & Ellipse 95%)',
        cognitiveSummary: 'Nuage de points 2D central, densités marginales univariées KDE projetées sur les axes et ellipse de covariance bivariée à 95%.',
        tags: ['corrélation', 'combo', 'jointplot', 'marginal', 'densité', 'ellipse', 'covariance', 'tufte']
      },`,

  '05-evolution-temporelle': `      {
        id: 'candlestick-volume',
        title: 'Chandeliers Japonais + Volume (OHLCV)',
        category: '05-evolution-temporelle',
        categoryLabel: '05. Évolution',
        plugin: null,
        pluginLabel: 'Combo Hybride',
        cognitiveRank: 'Rang 1 (Position sur continuum temporel partagé)',
        cognitiveSummary: 'Panneaux empilés verticaux synchronisés sur l\'axe temporel : cours boursier OHLC et volume de transactions avec moyenne mobile.',
        tags: ['évolution', 'combo', 'chandeliers', 'candlestick', 'ohlc', 'volume', 'finance', 'bourse', 'vma']
      },
      {
        id: 'dual-axis-controlled',
        title: 'Double Axe Y Normalisé (Dual-Axis Contrôlé)',
        category: '05-evolution-temporelle',
        categoryLabel: '05. Évolution',
        plugin: null,
        pluginLabel: 'Combo Hybride',
        cognitiveRank: 'Rang 4 (Continuité temporelle & garde-fous chromatiques)',
        cognitiveSummary: 'Deux séries temporelles d\'unités hétérogènes avec zéros rigoureusement alignés, appariement chromatique série-axe et Pearson r.',
        tags: ['évolution', 'combo', 'double axe', 'dual axis', 'normalisation', 'base 100', 'pearson', 'corrélation']
      },
      {
        id: 'price-indicator-overlays',
        title: 'Prix + Overlays Indicateurs (SMA / Bollinger)',
        category: '05-evolution-temporelle',
        categoryLabel: '05. Évolution',
        plugin: null,
        pluginLabel: 'Combo Hybride',
        cognitiveRank: 'Rang 4 (Continuité temporelle & canal de volatilité à 3 couches max)',
        cognitiveSummary: 'Série de prix chronologique avec canal de volatilité de Bollinger (±2σ) et moyenne mobile SMA sous contrainte cognitive de 3 couches max.',
        tags: ['évolution', 'combo', 'prix', 'indicateurs', 'bollinger', 'sma', 'moyenne mobile', 'volatilité', 'miller']
      },`,

  '06-flux-processus': `      {
        id: 'gantt-progress',
        title: 'Gantt + Avancement + Ligne \\'Aujourd\\\'hui\\'',
        category: '06-flux-processus',
        categoryLabel: '06. Flux',
        plugin: null,
        pluginLabel: 'Combo Hybride',
        cognitiveRank: 'Rang 1 (Position horizontale & marqueur temporel préattentif)',
        cognitiveSummary: 'Planning de projet avec barres flottantes d\'intervalles, avancement interne et repère vertical préattentif de la date courante.',
        tags: ['flux', 'combo', 'gantt', 'planning', 'projet', 'avancement', 'progress', 'today', 'retard', 'jalon']
      },
      {
        id: 'waterfall-cumulative-line',
        title: 'Waterfall + Ligne Cumulée Continue',
        category: '06-flux-processus',
        categoryLabel: '06. Flux',
        plugin: null,
        pluginLabel: 'Combo Hybride',
        cognitiveRank: 'Rang 1 (Position de solde) & Rang 3 (Barres de variation)',
        cognitiveSummary: 'Pont de variance séquentiel des gains/pertes et courbe de trajectoire du solde net cumulé reliant les étapes clés.',
        tags: ['flux', 'combo', 'waterfall', 'cascade', 'pont financier', 'ebitda', 'cumul', 'variance', 'solde']
      },`
};

// Check if each entry is already present in CATALOG to avoid duplicate insertions
for (const [cat, snippet] of Object.entries(NEW_CATALOG_ENTRIES)) {
  // Find the category block in CATALOG
  const catSearchStr = `// ${cat.replace(/^[0-9]+-/, '')}`;
  // Let's insert at the end of each category group before the next category comment
}

// Write helper script to parse and insert entries into CATALOG array
fs.writeFileSync(indexPath, content, 'utf8');
console.log('Updated counters in index.html');
