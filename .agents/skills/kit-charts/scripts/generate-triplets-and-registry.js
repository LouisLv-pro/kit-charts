/**
 * @file .agents/skills/kit-charts/scripts/generate-triplets-and-registry.js
 * @description Générateur déterministe des fragments DOM (template.html), schémas JSON (schema.json)
 * et du manifeste machine-readable (registry.json) pour tous les templates de kit-charts.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../../../..');
const TEMPLATE_DIR = path.join(ROOT_DIR, 'template');
const REGISTRY_PATH = path.join(ROOT_DIR, '.agents/skills/kit-charts/registry.json');

// Méta-informations détaillées et enrichies pour chaque template
const TEMPLATE_METADATA = {
  // 00. KPI Cards
  'kpi-standard': {
    name: 'KPI Card Standard — Synthèse Exécutive',
    desc: 'Métrique Hero dominante (32px), badge de variation contextuelle avec double encodage sémantique et micro-anneau de progression.',
    type: 'kpi',
    labelsType: 'none', minCategories: 1, maxCategories: 1, seriesCount: 1,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: true,
    compatibleAnimations: ['10-count-up', '20-delta-flash']
  },
  'kpi-sparkline': {
    name: 'KPI Card Sparkline — Micro-Tendance',
    desc: 'Métrique Hero associée à une micro-courbe continue de Tufte haute densité sans axes parasites pour apprécier la trajectoire historique.',
    type: 'kpi',
    labelsType: 'temporal', minCategories: 5, maxCategories: 30, seriesCount: 1,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: true,
    compatibleAnimations: ['09-path-drawing', '10-count-up']
  },
  'kpi-bullet': {
    name: 'KPI Card Micro-Bullet — Performance vs Cible',
    desc: 'Micro-bullet linéaire de Stephen Few comparant instantanément le réalisé à l objectif et aux plages qualitatives.',
    type: 'kpi',
    labelsType: 'none', minCategories: 1, maxCategories: 1, seriesCount: 3,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: true,
    compatibleAnimations: ['01-staged-transitions', '10-count-up']
  },
  'kpi-comparative': {
    name: 'KPI Card Comparative — Multi-Période',
    desc: 'Triangulation décisionnelle côte-à-côte entre Réalisé N, Historique N-1 et Budget prévisionnel pour éliminer les biais d ancrage.',
    type: 'kpi',
    labelsType: 'none', minCategories: 1, maxCategories: 1, seriesCount: 3,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: true,
    compatibleAnimations: ['10-count-up', '20-delta-flash']
  },
  'kpi-distribution': {
    name: 'KPI Card Décomposition — Micro-Distribution',
    desc: 'Agrégat macro consolidé complété d une barre de décomposition normalisée 100% avec légendes contiguës directes.',
    type: 'kpi',
    labelsType: 'categorical', minCategories: 2, maxCategories: 5, seriesCount: 1,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['01-staged-transitions', '10-count-up']
  },
  'kpi-status-alert': {
    name: 'KPI Card Statut & Seuil d Alerte RAG',
    desc: 'Supervision d infrastructure et de SLA avec jauge multi-seuils RAG et signalétique universelle doublement encodée.',
    type: 'kpi',
    labelsType: 'none', minCategories: 1, maxCategories: 1, seriesCount: 1,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: true,
    compatibleAnimations: ['03-preattentive-pulse', '20-delta-flash']
  },
  'kpi-composite': {
    name: 'KPI Card Composite — Équation d Affaires',
    desc: 'Indicateur clé global relié directement à ses 3 leviers causaux décomposés selon la méthode DuPont.',
    type: 'kpi',
    labelsType: 'none', minCategories: 3, maxCategories: 5, seriesCount: 1,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: true,
    compatibleAnimations: ['01-staged-transitions', '10-count-up']
  },

  // 01. Comparaison
  'bar-chart-vertical': {
    name: 'Diagramme en Barres Verticales (Column Chart)',
    desc: 'Comparaison de valeurs discrètes avec labels courts (N ≤ 7). Ligne de base Y = 0 obligatoire et espacements Gestalt.',
    type: 'chart',
    labelsType: 'categorical', minCategories: 1, maxCategories: 7, seriesCount: 1,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: true,
    compatibleAnimations: ['01-staged-transitions', '05-mot-stagger', '17-series-buildup']
  },
  'bar-chart-horizontal': {
    name: 'Diagramme en Barres Horizontales (Bar Chart)',
    desc: 'Classement ordonné et comparaison pour libellés longs ou cardinalité élevée (N ≤ 25) avec axe X = 0 absolu.',
    type: 'chart',
    labelsType: 'categorical', minCategories: 1, maxCategories: 25, seriesCount: 1,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: true,
    compatibleAnimations: ['01-staged-transitions', '05-mot-stagger', '12-bar-chart-race']
  },
  'grouped-bar-chart': {
    name: 'Barres Groupées Multi-Séries',
    desc: 'Comparaison de sous-groupes par catégorie nominale (max 4 barres par groupe) avec espacement intra-groupe resserré.',
    type: 'chart',
    labelsType: 'categorical', minCategories: 2, maxCategories: 6, seriesCount: 4,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['01-staged-transitions', '05-mot-stagger', '17-series-buildup']
  },
  'stacked-bar-chart': {
    name: 'Barres Empilées Absolues',
    desc: 'Cumul et décomposition additive par catégorie. Le segment de base est prioritaire pour la précision de lecture.',
    type: 'chart',
    labelsType: 'categorical', minCategories: 2, maxCategories: 8, seriesCount: 5,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['01-staged-transitions', '17-series-buildup']
  },
  'bullet-chart': {
    name: 'Graphique à Puces (Bullet Chart Stephen Few)',
    desc: 'Comparaison ultra-compacte Réalisé vs Cible et bandes de performance qualitatives en niveaux de gris.',
    type: 'chart',
    labelsType: 'categorical', minCategories: 1, maxCategories: 10, seriesCount: 3,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: true,
    compatibleAnimations: ['01-staged-transitions', '10-count-up']
  },
  'bar-target-overlay': {
    name: 'Barres avec Marqueur de Cible & Deltas de Variance',
    desc: 'Barres horizontales complétées d un repère de cible et de pastilles de variance absolue/relative automatiques.',
    type: 'chart',
    labelsType: 'categorical', minCategories: 1, maxCategories: 12, seriesCount: 2,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: true,
    compatibleAnimations: ['01-staged-transitions', '20-delta-flash']
  },
  'lollipop-chart': {
    name: 'Graphique Sucette (Lollipop Chart)',
    desc: 'Classement visuel élégant à haut ratio Data-Ink remplaçant les barres épaisses pour comparaisons denses (10 à 30 items).',
    type: 'chart',
    labelsType: 'categorical', minCategories: 5, maxCategories: 30, seriesCount: 1,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: true,
    compatibleAnimations: ['01-staged-transitions', '05-mot-stagger']
  },
  'slope-chart': {
    name: 'Graphique de Pente (Slope Chart)',
    desc: 'Comparaison d évolution et changement de rang entre exactement deux dates fixes sans encombrement.',
    type: 'chart',
    labelsType: 'categorical', minCategories: 2, maxCategories: 10, seriesCount: 2,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: true,
    compatibleAnimations: ['01-staged-transitions', '09-path-drawing']
  },
  'dumbbell-chart': {
    name: 'Graphique en Haltères (Dumbbell Chart)',
    desc: 'Visualisation de l écart binaire ou delta avant/après pour chaque entité le long d une ligne commune.',
    type: 'chart',
    labelsType: 'categorical', minCategories: 2, maxCategories: 15, seriesCount: 2,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: true,
    compatibleAnimations: ['01-staged-transitions', '05-mot-stagger']
  },
  'radar-chart': {
    name: 'Graphique Radar (Spider Chart)',
    desc: 'Profil multidimensionnel synthétique pour comparer au maximum 2 entités sur 3 à 8 axes.',
    type: 'chart',
    labelsType: 'categorical', minCategories: 3, maxCategories: 8, seriesCount: 2,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['01-staged-transitions', '17-series-buildup']
  },
  'polar-area-chart': {
    name: 'Diagramme en Aire Polaire (Rose de Nightingale)',
    desc: 'Encodage par surface de secteurs angulaires égaux pour données cycliques saisonnières.',
    type: 'chart',
    labelsType: 'categorical', minCategories: 3, maxCategories: 8, seriesCount: 1,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['01-staged-transitions', '17-series-buildup']
  },

  // 02. Composition
  'pie-chart': {
    name: 'Diagramme Circulaire (Camembert)',
    desc: 'Décomposition d un tout en 2 à 3 tranches maximum à fort contraste. Tri décroissant horaire obligatoire.',
    type: 'chart',
    labelsType: 'categorical', minCategories: 2, maxCategories: 3, seriesCount: 1,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['01-staged-transitions', '14-cross-type-morph']
  },
  'doughnut-chart': {
    name: 'Diagramme en Anneau (Doughnut Chart)',
    desc: 'Composition en 2 à 4 parts avec KPI central proéminent en typographie tabulaire.',
    type: 'chart',
    labelsType: 'categorical', minCategories: 2, maxCategories: 4, seriesCount: 1,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['01-staged-transitions', '10-count-up']
  },
  'treemap': {
    name: 'Treemap (Carte Proportionnelle Squarifiée)',
    desc: 'Partition hiérarchique par rectangles proportionnels pour grands volumes de catégories (10 à 50+).',
    type: 'chart',
    labelsType: 'hierarchical', minCategories: 4, maxCategories: 50, seriesCount: 1,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['04-continuous-zoom', '01-staged-transitions']
  },
  'sunburst': {
    name: 'Diagramme Rayonnement Solaire (Sunburst)',
    desc: 'Arborescence multiniveaux concentrique radialement ordonnée du centre vers la périphérie.',
    type: 'chart',
    labelsType: 'hierarchical', minCategories: 4, maxCategories: 30, seriesCount: 1,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['04-continuous-zoom', '01-staged-transitions']
  },
  'waffle-chart': {
    name: 'Grille Gaufre Isotype 100%',
    desc: 'Représentation discrète en 100 cellules unitaires (1 cellule = 1%) pour éliminer les biais d estimation d angle.',
    type: 'chart',
    labelsType: 'categorical', minCategories: 2, maxCategories: 5, seriesCount: 1,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['05-mot-stagger', '10-count-up']
  },
  'stacked-bar-100': {
    name: 'Barres Empilées Normalisées à 100%',
    desc: 'Comparaison des proportions relatives entre plusieurs groupes ou entités temporelles.',
    type: 'chart',
    labelsType: 'categorical', minCategories: 2, maxCategories: 10, seriesCount: 5,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['01-staged-transitions', '17-series-buildup']
  },
  'pareto-chart': {
    name: 'Diagramme de Pareto (Loi 80/20 & Gini)',
    desc: 'Barres d effectifs triées par ordre décroissant combinées à la courbe de pourcentage cumulé à 80%.',
    type: 'chart',
    labelsType: 'categorical', minCategories: 4, maxCategories: 15, seriesCount: 2,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['01-staged-transitions', '09-path-drawing']
  },
  'stacked-total-line': {
    name: 'Barres Empilées avec Ligne de Total Consolidé',
    desc: 'Décomposition empilée combinée à une courbe maîtresse de la trajectoire globale macro.',
    type: 'chart',
    labelsType: 'categorical', minCategories: 3, maxCategories: 12, seriesCount: 4,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['01-staged-transitions', '09-path-drawing']
  },

  // 03. Distribution
  'histogramme': {
    name: 'Histogramme Continu (Freedman-Diaconis)',
    desc: 'Distribution empirique d une variable continue avec binning optimal basé sur l intervalle interquartile.',
    type: 'chart',
    labelsType: 'interval', minCategories: 6, maxCategories: 25, seriesCount: 1,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['01-staged-transitions', '15-axis-rescale']
  },
  'density-plot': {
    name: 'Courbe de Densité Continue (KDE de Silverman)',
    desc: 'Estimation par noyau gaussien de la densité de probabilité continue d une variable.',
    type: 'chart',
    labelsType: 'continuous', minCategories: 30, maxCategories: 100, seriesCount: 3,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['09-path-drawing', '01-staged-transitions']
  },
  'histogramme-kde': {
    name: 'Histogramme avec Courbe de Densité KDE',
    desc: 'Hybride combinant l effectif empirique binné et la densité théorique lissée en double couche.',
    type: 'chart',
    labelsType: 'continuous', minCategories: 10, maxCategories: 30, seriesCount: 2,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['01-staged-transitions', '09-path-drawing']
  },
  'box-plot': {
    name: 'Boîte à Moustaches de Tukey (Box Plot)',
    desc: 'Synthèse non paramétrique de dispersion (médiane, IQR, moustaches 1.5×IQR, outliers).',
    type: 'chart',
    labelsType: 'categorical', minCategories: 1, maxCategories: 15, seriesCount: 1,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['01-staged-transitions', '05-mot-stagger']
  },
  'box-strip-plot': {
    name: 'Box Plot avec Semis de Points (Strip/Jitter)',
    desc: 'Synthèse de Tukey superposée aux observations individuelles réelles avec jitter contrôlé.',
    type: 'chart',
    labelsType: 'categorical', minCategories: 1, maxCategories: 8, seriesCount: 1,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['01-staged-transitions', '05-mot-stagger']
  },
  'raincloud-plot': {
    name: 'Raincloud Plot (Half-KDE + Box + Jitter)',
    desc: 'Visualisation tri-hybride combinant forme continue, boîte interne et données brutes déterministes.',
    type: 'chart',
    labelsType: 'categorical', minCategories: 1, maxCategories: 6, seriesCount: 1,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['01-staged-transitions', '05-mot-stagger']
  },
  'violin-plot': {
    name: 'Violin Plot (Violon avec KDE Bilatérale)',
    desc: 'Révélation de multimodalité et bimodalité par profil de densité symétrique bilatéral.',
    type: 'chart',
    labelsType: 'categorical', minCategories: 1, maxCategories: 8, seriesCount: 1,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['01-staged-transitions', '05-mot-stagger']
  },
  'strip-plot': {
    name: 'Strip Plot (Bandes de Points avec Jitter)',
    desc: 'Affichage des données brutes individuelles (N ≤ 100) le long d un axe 1D avec espacement anti-collision.',
    type: 'chart',
    labelsType: 'categorical', minCategories: 1, maxCategories: 8, seriesCount: 1,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['05-mot-stagger', '01-staged-transitions']
  },
  'beeswarm-plot': {
    name: 'Beeswarm Plot (Essaim de Points sans Collision)',
    desc: 'Distribution de points individuels empilés de manière compacte sans aucun chevauchement.',
    type: 'chart',
    labelsType: 'categorical', minCategories: 1, maxCategories: 6, seriesCount: 1,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['05-mot-stagger', '01-staged-transitions']
  },
  'distribution-heatmap': {
    name: 'Heatmap de Distribution Bivariée Binnée',
    desc: 'Concentration de densité croisée sur 2 axes discrets avec gradient de luminance perceptuel.',
    type: 'chart',
    labelsType: 'categorical', minCategories: 4, maxCategories: 20, seriesCount: 1,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['01-staged-transitions', '03-preattentive-pulse']
  },

  // 04. Correlation
  'scatter-plot': {
    name: 'Nuage de Points Bivarié (Scatter Plot)',
    desc: 'Corrélation entre 2 variables continues sur axes cartésiens X et Y avec régression visuelle.',
    type: 'chart',
    labelsType: 'continuous', minCategories: 10, maxCategories: 1000, seriesCount: 1,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['01-staged-transitions', '04-continuous-zoom', '16-motion-trails']
  },
  'scatter-regression': {
    name: 'Scatter Plot avec Régression Linéaire OLS',
    desc: 'Nuage de points + droite de tendance OLS et bande d intervalle de confiance à 95%.',
    type: 'chart',
    labelsType: 'continuous', minCategories: 15, maxCategories: 500, seriesCount: 2,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['01-staged-transitions', '09-path-drawing']
  },
  'joint-scatter-marginals': {
    name: 'Jointplot (Scatter Plot + Densités Marginales)',
    desc: 'Nuage 2D central couplé aux distributions marginales X et Y et ellipse de confiance à 95%.',
    type: 'chart',
    labelsType: 'continuous', minCategories: 20, maxCategories: 500, seriesCount: 3,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['01-staged-transitions', '09-path-drawing']
  },
  'bubble-chart': {
    name: 'Diagramme à Bulles 3D en 2D (Bubble Chart)',
    desc: 'Corrélation trivariée (X, Y) avec rayon proportionnel à la racine carrée √Z (Loi de Flannery).',
    type: 'chart',
    labelsType: 'continuous', minCategories: 5, maxCategories: 100, seriesCount: 1,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['01-staged-transitions', '04-continuous-zoom']
  },
  'matrix-heatmap': {
    name: 'Matrice de Corrélation & Tableaux Croisés',
    desc: 'Matrice carrée de coefficients de corrélation de Pearson avec échelle divergente et labels lisibles.',
    type: 'chart',
    labelsType: 'categorical', minCategories: 3, maxCategories: 20, seriesCount: 1,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: true,
    compatibleAnimations: ['01-staged-transitions', '03-preattentive-pulse']
  },
  'connected-scatter-plot': {
    name: 'Nuage de Points Relié Chronologiquement',
    desc: 'Trajectoire dynamique ordonnée de deux séries continues évoluant conjointement dans le temps.',
    type: 'chart',
    labelsType: 'temporal', minCategories: 6, maxCategories: 40, seriesCount: 1,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['09-path-drawing', '16-motion-trails']
  },
  'density-2d-hexbin': {
    name: 'Hexagonal Binning 2D (Anti-Overplotting)',
    desc: 'Agrégation de très grands volumes bivariés (N > 2 000) en pavage hexagonal de densité.',
    type: 'chart',
    labelsType: 'continuous', minCategories: 50, maxCategories: 5000, seriesCount: 1,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['01-staged-transitions', '04-continuous-zoom']
  },

  // 05. Evolution
  'line-chart': {
    name: 'Courbe Temporelle Simple (Line Chart)',
    desc: 'Évolution continue d une grandeur dans le temps avec étiquetage direct des extrema.',
    type: 'chart',
    labelsType: 'temporal', minCategories: 4, maxCategories: 50, seriesCount: 1,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['09-path-drawing', '01-staged-transitions']
  },
  'multi-line-chart': {
    name: 'Courbes Multiples (Focus + Context)',
    desc: 'Comparaison de 2 à 4 séries temporelles avec ligne active en surbrillance et séries de contexte en gris.',
    type: 'chart',
    labelsType: 'temporal', minCategories: 4, maxCategories: 50, seriesCount: 4,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['09-path-drawing', '11-focus-context', '17-series-buildup']
  },
  'area-chart': {
    name: 'Graphique en Aire Simple (Area Chart)',
    desc: 'Volume continu et masse sous la courbe (axe Y = 0 obligatoire) avec dégradé vertical subtil.',
    type: 'chart',
    labelsType: 'temporal', minCategories: 4, maxCategories: 50, seriesCount: 1,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['09-path-drawing', '01-staged-transitions']
  },
  'stacked-area-chart': {
    name: 'Aires Empilées (Stacked Area Chart)',
    desc: 'Somme de composantes additives continues évoluant de manière coordonnée sur échelle commune.',
    type: 'chart',
    labelsType: 'temporal', minCategories: 4, maxCategories: 30, seriesCount: 4,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['09-path-drawing', '17-series-buildup']
  },
  'streamgraph': {
    name: 'Streamgraph (Flux Thématique Fluide)',
    desc: 'Visualisation organique centrée sur un axe neutre pour flux thématiques et parts relatives.',
    type: 'chart',
    labelsType: 'temporal', minCategories: 6, maxCategories: 30, seriesCount: 5,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['09-path-drawing', '01-staged-transitions']
  },
  'candlestick-ohlc': {
    name: 'Chandeliers Japonais Financiers (OHLC)',
    desc: 'Série financière à 4 cours (Open, High, Low, Close) avec valence haussière/baissière stricte.',
    type: 'chart',
    labelsType: 'temporal', minCategories: 10, maxCategories: 100, seriesCount: 1,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: true,
    compatibleAnimations: ['01-staged-transitions', '13-pan-camera']
  },
  'candlestick-volume': {
    name: 'Cours OHLC avec Panneau de Volume Étagé',
    desc: 'Chandeliers financiers couplés au volume de transactions en 2 panneaux synchronisés.',
    type: 'chart',
    labelsType: 'temporal', minCategories: 10, maxCategories: 100, seriesCount: 2,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: true,
    compatibleAnimations: ['01-staged-transitions', '13-pan-camera']
  },
  'dual-axis-controlled': {
    name: 'Double Axe Y Contrôlé & Apparié',
    desc: 'Comparaison de 2 séries hétérogènes avec zéros alignés et corrélation de Pearson documentée.',
    type: 'chart',
    labelsType: 'temporal', minCategories: 6, maxCategories: 30, seriesCount: 2,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['09-path-drawing', '01-staged-transitions']
  },
  'price-indicator-overlays': {
    name: 'Série de Prix avec Moyenne Mobile & Bandes de Bollinger',
    desc: 'Cours financier + tendance SMA + canal de volatilité (±2σ) sans encombrement visuel.',
    type: 'chart',
    labelsType: 'temporal', minCategories: 15, maxCategories: 100, seriesCount: 3,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['09-path-drawing', '01-staged-transitions']
  },
  'sparkline': {
    name: 'Micro-Courbe Sparkline de Tufte',
    desc: 'Tendance historique ultra-compacte sans axes pour intégration dans tableaux et synthèses.',
    type: 'chart',
    labelsType: 'temporal', minCategories: 5, maxCategories: 30, seriesCount: 1,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['09-path-drawing', '10-count-up']
  },

  // 06. Flux
  'sankey-diagram': {
    name: 'Diagramme de Sankey (Flux Directionnels)',
    desc: 'Visualisation des transferts avec conservation exacte des flux de matière ou valeur entre étapes.',
    type: 'chart',
    labelsType: 'network', minCategories: 4, maxCategories: 30, seriesCount: 1,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['01-staged-transitions', '07-event-segmentation']
  },
  'chord-diagram': {
    name: 'Diagramme en Corde (Échanges Circulaires)',
    desc: 'Échanges bilatéraux circulaires réciproques entre entités interconnectées.',
    type: 'chart',
    labelsType: 'categorical', minCategories: 3, maxCategories: 8, seriesCount: 4,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['01-staged-transitions', '17-series-buildup']
  },
  'funnel-chart': {
    name: 'Entonnoir de Conversion (Funnel Chart)',
    desc: 'Processus séquentiel à déperdition d étapes avec taux de rétention calculés.',
    type: 'chart',
    labelsType: 'categorical', minCategories: 3, maxCategories: 8, seriesCount: 1,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['01-staged-transitions', '10-count-up']
  },
  'waterfall-chart': {
    name: 'Diagramme en Cascade (Waterfall / Pont IBCS)',
    desc: 'Bilan séquentiel des flux positifs, négatifs et sous-totaux intermédiaires selon les standards IBCS.',
    type: 'chart',
    labelsType: 'categorical', minCategories: 3, maxCategories: 12, seriesCount: 1,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: true,
    compatibleAnimations: ['01-staged-transitions', '20-delta-flash']
  },
  'waterfall-cumulative-line': {
    name: 'Waterfall avec Ligne de Solde Cumulé',
    desc: 'Cascade financière combinée à la trajectoire continue du solde net.',
    type: 'chart',
    labelsType: 'categorical', minCategories: 3, maxCategories: 12, seriesCount: 2,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: true,
    compatibleAnimations: ['01-staged-transitions', '09-path-drawing']
  },
  'gantt-progress': {
    name: 'Planning Gantt avec Avancement & Repère Aujourd hui',
    desc: 'Ordonnancement temporel de tâches avec barre interne d avancement et date courante en repère vertical.',
    type: 'chart',
    labelsType: 'categorical', minCategories: 3, maxCategories: 20, seriesCount: 1,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: true,
    compatibleAnimations: ['01-staged-transitions', '07-event-segmentation']
  },
  'alluvial-diagram': {
    name: 'Diagramme Alluvial (Redistribution de Cohortes)',
    desc: 'Évolution et redistribution de cohortes d individus à travers des étapes successives.',
    type: 'chart',
    labelsType: 'network', minCategories: 4, maxCategories: 25, seriesCount: 1,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['01-staged-transitions', '07-event-segmentation']
  },

  // 07. Hierarchie
  'node-link-network': {
    name: 'Graphe Nœuds-Liens à Force Dirigée',
    desc: 'Réseau relationnel topologique avec répulsion des nœuds et attraction des liens à équilibre mécanique.',
    type: 'chart',
    labelsType: 'network', minCategories: 5, maxCategories: 80, seriesCount: 1,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['19-critical-damping', '04-continuous-zoom']
  },
  'arc-diagram': {
    name: 'Diagramme en Arcs 1D',
    desc: 'Relations entre entités ordonnées linéairement le long d un axe unique.',
    type: 'chart',
    labelsType: 'categorical', minCategories: 4, maxCategories: 20, seriesCount: 1,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['09-path-drawing', '01-staged-transitions']
  },
  'dendrogram': {
    name: 'Dendrogramme Hiérarchique de Clustering',
    desc: 'Arbre de classification révélant les distances euclidiennes de regroupement entre sous-groupes.',
    type: 'chart',
    labelsType: 'categorical', minCategories: 4, maxCategories: 30, seriesCount: 1,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['01-staged-transitions', '09-path-drawing']
  },
  'marimekko-chart': {
    name: 'Graphique Marimekko (Mosaïque 100% × 100%)',
    desc: 'Tableau de contingence 2D avec largeur et hauteur de segments proportionnelles aux grandeurs.',
    type: 'chart',
    labelsType: 'categorical', minCategories: 2, maxCategories: 8, seriesCount: 4,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['01-staged-transitions', '17-series-buildup']
  },

  // 08. Geospatial
  'choropleth-map': {
    name: 'Carte Choroplèthe Thématique',
    desc: 'Ratios et densités normalisés par polygones géographiques administratifs avec palette séquentielle.',
    type: 'chart',
    labelsType: 'geographical', minCategories: 5, maxCategories: 100, seriesCount: 1,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['01-staged-transitions', '04-continuous-zoom']
  },
  'bubble-map': {
    name: 'Carte à Bulles Proportionnelles Géolocalisées',
    desc: 'Totaux absolus représentés par cercles de surface proportionnelle √N sur fond de carte géographique.',
    type: 'chart',
    labelsType: 'geographical', minCategories: 5, maxCategories: 100, seriesCount: 1,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['01-staged-transitions', '04-continuous-zoom']
  },
  'cartogram-tilegram': {
    name: 'Cartogramme / Tilegram Équi-Surfacique',
    desc: 'Égalité visuelle stricte entre entités territoriales sous forme de tuiles régulières.',
    type: 'chart',
    labelsType: 'geographical', minCategories: 5, maxCategories: 50, seriesCount: 1,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['01-staged-transitions', '05-mot-stagger']
  },

  // 09. Tableaux
  'table-kpi-scorecard': {
    name: 'Tableau Exécutif KPI Scorecard',
    desc: 'Synthèse multi-indicateurs exécutifs avec cibles, deltas, statuts RAG et sparklines 12 mois.',
    type: 'table',
    labelsType: 'tabular', minCategories: 3, maxCategories: 20, seriesCount: 7,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: true,
    compatibleAnimations: ['10-count-up', '20-delta-flash']
  },
  'table-heatmap-matrix': {
    name: 'Tableau Heatmap Matrice 2D',
    desc: 'Matrice de concentration avec gradient continu et inversion de contraste WCAG AAA automatique.',
    type: 'table',
    labelsType: 'tabular', minCategories: 4, maxCategories: 24, seriesCount: 12,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['03-preattentive-pulse', '01-staged-transitions']
  },
  'table-bar-in-cell': {
    name: 'Tableau Comparatif Bar-in-Cell',
    desc: 'Barres horizontales intégrées dans les cellules sur échelle commune alignée (Cleveland Rang 1).',
    type: 'table',
    labelsType: 'tabular', minCategories: 3, maxCategories: 25, seriesCount: 6,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: true,
    compatibleAnimations: ['01-staged-transitions', '05-mot-stagger']
  },
  'table-hierarchical-tree': {
    name: 'Tableau Hiérarchique (Tree Table)',
    desc: 'Arborescence multiniveaux repliable avec sous-totaux agrégés automatiques et indentations claires.',
    type: 'table',
    labelsType: 'tabular', minCategories: 4, maxCategories: 50, seriesCount: 6,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: false,
    compatibleAnimations: ['01-staged-transitions', '04-continuous-zoom']
  },
  'table-financial-variance': {
    name: 'Tableau Financier & Variance IBCS',
    desc: 'Compte de résultat (P&L) avec barres de variance divergentes sur axe 0 aligné selon les normes IBCS.',
    type: 'table',
    labelsType: 'tabular', minCategories: 5, maxCategories: 30, seriesCount: 7,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: true,
    compatibleAnimations: ['01-staged-transitions', '20-delta-flash']
  },
  'table-ranking-leaderboard': {
    name: 'Tableau de Classement & Leaderboard',
    desc: 'Classement ordonné avec podium doux, delta de rang, rang antérieur et sparkbars 6 mois.',
    type: 'table',
    labelsType: 'tabular', minCategories: 5, maxCategories: 50, seriesCount: 8,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: true,
    compatibleAnimations: ['01-staged-transitions', '12-bar-chart-race']
  },

  // Tooltip
  'tooltip': {
    name: 'Laboratoire Ergonomique des Infobulles',
    desc: 'Infobulles anti-occlusion (Mayer), zone de frappe élargie (Fitts) et chiffres tabulaires synchronisés.',
    type: 'tooltip',
    labelsType: 'temporal', minCategories: 4, maxCategories: 12, seriesCount: 3,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: true,
    compatibleAnimations: ['01-staged-transitions']
  },

  // Animations (20 motifs)
  '01-staged-transitions': {
    name: 'Animation 01 : Transitions par Étapes (Heer & Robertson)',
    desc: 'Transitions étagées isolant les changements d échelle, de position et de valeur pour éviter la surcharge.',
    type: 'animation',
    labelsType: 'categorical', minCategories: 4, maxCategories: 10, seriesCount: 1,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: false, compatibleAnimations: []
  },
  '02-anti-change-blindness': {
    name: 'Animation 02 : Anti-Cécité au Changement (Rensink)',
    desc: 'Maintien de la persistance visuelle pour guider l attention lors des mises à jour partielles.',
    type: 'animation',
    labelsType: 'categorical', minCategories: 4, maxCategories: 10, seriesCount: 1,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: false, compatibleAnimations: []
  },
  '03-preattentive-pulse': {
    name: 'Animation 03 : Alerte Préattentive Pulse',
    desc: 'Pulsation douce et limitée dans le temps (≤ 800ms) pour diriger l attention sur un seuil critique.',
    type: 'animation',
    labelsType: 'categorical', minCategories: 4, maxCategories: 10, seriesCount: 1,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: true, compatibleAnimations: []
  },
  '04-continuous-zoom': {
    name: 'Animation 04 : Zoom & Drill-down Continu',
    desc: 'Conservation du repère spatial de référence lors du passage d une vue macro à micro.',
    type: 'animation',
    labelsType: 'categorical', minCategories: 4, maxCategories: 10, seriesCount: 1,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: false, compatibleAnimations: []
  },
  '05-mot-stagger': {
    name: 'Animation 05 : Stagger Plafonné MOT (k ≤ 4)',
    desc: 'Décalage temporel respectant la capacité du système visuel humain à suivre des cibles simultanées.',
    type: 'animation',
    labelsType: 'categorical', minCategories: 4, maxCategories: 10, seriesCount: 1,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: false, compatibleAnimations: []
  },
  '06-apprehension-replay': {
    name: 'Animation 06 : Principe d Appréhension & Replay (Tversky)',
    desc: 'Contrôle utilisateur complet avec pause, reprise et scrubbing temporel pour faciliter la compréhension.',
    type: 'animation',
    labelsType: 'categorical', minCategories: 4, maxCategories: 10, seriesCount: 2,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: false, compatibleAnimations: []
  },
  '07-event-segmentation': {
    name: 'Animation 07 : Segmentation Événementielle Narrative (Zacks)',
    desc: 'Découpage d un processus complexe en étapes sémantiques distinctes avec pauses cognitives.',
    type: 'animation',
    labelsType: 'categorical', minCategories: 4, maxCategories: 10, seriesCount: 1,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: false, compatibleAnimations: []
  },
  '08-lasseter-anticipation': {
    name: 'Animation 08 : Anticipation Traditionnelle (Lasseter)',
    desc: 'Micro-mouvement préparatoire orientant l œil vers la zone d action avant l exécution principale.',
    type: 'animation',
    labelsType: 'categorical', minCategories: 4, maxCategories: 10, seriesCount: 1,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: false, compatibleAnimations: []
  },
  '09-path-drawing': {
    name: 'Animation 09 : Révélation de Tracé Chronologique',
    desc: 'Dessin progressif de gauche à droite respectant la ligne temporelle naturelle de lecture.',
    type: 'animation',
    labelsType: 'temporal', minCategories: 6, maxCategories: 20, seriesCount: 2,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: false, compatibleAnimations: []
  },
  '10-count-up': {
    name: 'Animation 10 : Compteur Numérique Tabulaire Animé',
    desc: 'Incrémentation fluide des chiffres avec amorti pour ancrer l ordre de grandeur de la valeur.',
    type: 'animation',
    labelsType: 'temporal', minCategories: 6, maxCategories: 20, seriesCount: 1,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: false, compatibleAnimations: []
  },
  '11-focus-context': {
    name: 'Animation 11 : Focus + Context Dynamique',
    desc: 'Transition fluide entre vue d ensemble atténuée et série active en surbrillance.',
    type: 'animation',
    labelsType: 'categorical', minCategories: 4, maxCategories: 10, seriesCount: 1,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: false, compatibleAnimations: []
  },
  '12-bar-chart-race': {
    name: 'Animation 12 : Course de Barres Classée (Bar Chart Race)',
    desc: 'Réordonnancement dynamique et continu des barres au fil du temps avec transitions de rang fluides.',
    type: 'animation',
    labelsType: 'categorical', minCategories: 4, maxCategories: 10, seriesCount: 1,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: false, compatibleAnimations: []
  },
  '13-pan-camera': {
    name: 'Animation 13 : Panoramique Caméra & Défilement de Fenêtre',
    desc: 'Translation fluide le long d une longue série temporelle pour révéler des fenêtres glissantes.',
    type: 'animation',
    labelsType: 'temporal', minCategories: 10, maxCategories: 50, seriesCount: 2,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: false, compatibleAnimations: []
  },
  '14-cross-type-morph': {
    name: 'Animation 14 : Morphing Barres ↔ Secteurs',
    desc: 'Transformation topologique continue préservant l identité visuelle des entités lors du changement de type.',
    type: 'animation',
    labelsType: 'categorical', minCategories: 3, maxCategories: 6, seriesCount: 1,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: false, compatibleAnimations: []
  },
  '15-axis-rescale': {
    name: 'Animation 15 : Rescaling Linéaire ↔ Logarithmique',
    desc: 'Interpolation progressive des repères d axes lors du passage entre échelle linéaire et log.',
    type: 'animation',
    labelsType: 'categorical', minCategories: 4, maxCategories: 10, seriesCount: 1,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: false, compatibleAnimations: []
  },
  '16-motion-trails': {
    name: 'Animation 16 : Traînée Cométaire & Historique de Mouvement',
    desc: 'Affichage de la trajectoire passée avec estompage pour décoder la vitesse et la direction.',
    type: 'animation',
    labelsType: 'continuous', minCategories: 5, maxCategories: 30, seriesCount: 1,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: false, compatibleAnimations: []
  },
  '17-series-buildup': {
    name: 'Animation 17 : Construction Sérielle Étagée',
    desc: 'Apparition successive et ordonnée des couches de données pour éviter la saturation perceptive.',
    type: 'animation',
    labelsType: 'categorical', minCategories: 4, maxCategories: 10, seriesCount: 4,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: false, compatibleAnimations: []
  },
  '18-scrollytelling': {
    name: 'Animation 18 : Scrollytelling à Hystérésis',
    desc: 'Déclenchement d étapes narratives calé sur le défilement de la page avec mémoire d état.',
    type: 'animation',
    labelsType: 'categorical', minCategories: 4, maxCategories: 10, seriesCount: 1,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: false, compatibleAnimations: []
  },
  '19-critical-damping': {
    name: 'Animation 19 : Amorti Critique Physique (Spring Physics)',
    desc: 'Stabilisation sans rebond oscillatoire parasite pour un rendu naturel et rigoureux.',
    type: 'animation',
    labelsType: 'categorical', minCategories: 4, maxCategories: 10, seriesCount: 1,
    dataLabels: false, antiOcclusionTooltip: true, semanticValence: false, compatibleAnimations: []
  },
  '20-delta-flash': {
    name: 'Animation 20 : Flash d Onset Delta (Alerte Mise à Jour)',
    desc: 'Signal lumineux temporaire guidant l attention sur une valeur ou cellule fraîchement mise à jour.',
    type: 'animation',
    labelsType: 'categorical', minCategories: 4, maxCategories: 10, seriesCount: 1,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: true, compatibleAnimations: []
  },
  'animation': {
    name: 'Laboratoire Complet d Animations Cognitives',
    desc: 'Showcase interactif intégrant les 20 motifs d animation et les contrôles cognitifs accessibles.',
    type: 'animation',
    labelsType: 'categorical', minCategories: 4, maxCategories: 10, seriesCount: 2,
    dataLabels: true, antiOcclusionTooltip: true, semanticValence: false, compatibleAnimations: []
  }
};

/**
 * Détecte les répertoires de templates
 */
function scanTemplates(dir) {
  let list = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.isDirectory() && !e.name.startsWith('.')) {
      const full = path.join(dir, e.name);
      if (fs.existsSync(path.join(full, 'template.js'))) {
        const subEntries = fs.readdirSync(full, { withFileTypes: true });
        const subDirsWithJs = subEntries.filter(se => se.isDirectory() && fs.existsSync(path.join(full, se.name, 'template.js')));
        if (subDirsWithJs.length > 0) {
          for (const sd of subDirsWithJs) {
            list.push(path.join(full, sd.name));
          }
          list.push(full);
        } else {
          list.push(full);
        }
      } else {
        list = list.concat(scanTemplates(full));
      }
    }
  }
  return list;
}

/**
 * Génère le fragment DOM template.html
 */
function generateHtmlTemplate(id, meta, type) {
  if (type === 'kpi') {
    return `<div class="kit-charts-card kit-charts-kpi" id="{{CONTAINER_ID}}" data-template-id="${id}" style="position: relative; width: 100%; min-height: {{HEIGHT}}px; background: var(--kc-bg-card, #FFFFFF); border: 1px solid var(--kc-border, #E2E8F0); border-radius: 12px; padding: 1.25rem; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between;">
  <div class="kit-charts-kpi-header">
    <div class="kit-charts-kpi-title" style="font-size: 0.875rem; font-weight: 500; color: var(--kc-text-secondary, #64748B);">{{TITLE}}</div>
    <div class="kit-charts-kpi-subtitle" style="font-size: 0.75rem; color: var(--kc-text-muted, #94A3B8); margin-top: 0.25rem;">{{SUBTITLE}}</div>
  </div>
  <div class="kit-charts-kpi-body" style="margin: 0.75rem 0; display: flex; align-items: baseline; justify-content: space-between; gap: 0.5rem;">
    <div class="kit-charts-kpi-value-group" style="display: flex; align-items: baseline; gap: 0.35rem;">
      <span class="kit-charts-kpi-value" style="font-size: 2rem; font-weight: 700; color: var(--kc-text-primary, #0F172A); font-variant-numeric: tabular-nums;">--</span>
      <span class="kit-charts-kpi-unit" style="font-size: 1rem; font-weight: 500; color: var(--kc-text-secondary, #64748B);"></span>
    </div>
    <div class="kit-charts-kpi-badge" style="padding: 0.25rem 0.5rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; font-variant-numeric: tabular-nums;">--</div>
  </div>
  <div class="kit-charts-kpi-chart-wrapper" style="position: relative; width: 100%; height: 60px;">
    <canvas id="{{CANVAS_ID}}" role="img" aria-label="{{TITLE}}"></canvas>
  </div>
  <div class="kit-charts-kpi-footer" style="font-size: 0.6875rem; color: var(--kc-text-muted, #94A3B8); border-top: 1px solid var(--kc-border-subtle, #F1F5F9); padding-top: 0.5rem; margin-top: 0.5rem;">
    {{FOOTNOTE}}
  </div>
</div>
`;
  }

  if (type === 'table') {
    return `<div class="kit-charts-card kit-charts-table-card" id="{{CONTAINER_ID}}" data-template-id="${id}" style="position: relative; width: 100%; background: var(--kc-bg-card, #FFFFFF); border: 1px solid var(--kc-border, #E2E8F0); border-radius: 12px; padding: 1.25rem; box-sizing: border-box; overflow-x: auto;">
  <div class="kit-charts-header" style="margin-bottom: 1rem;">
    <h2 class="kit-charts-title" style="margin: 0; font-size: 1.125rem; font-weight: 600; color: var(--kc-text-primary, #0F172A);">{{TITLE}}</h2>
    <p class="kit-charts-subtitle" style="margin: 0.25rem 0 0 0; font-size: 0.875rem; color: var(--kc-text-secondary, #64748B);">{{SUBTITLE}}</p>
  </div>
  <div class="kit-charts-table-wrapper" id="{{TABLE_ID}}" style="width: 100%;">
    <!-- Le tableau sera hydraté dynamiquement ici par template.js -->
  </div>
</div>
`;
  }

  if (type === 'animation') {
    return `<div class="kit-charts-card kit-charts-anim-card" id="{{CONTAINER_ID}}" data-template-id="${id}" style="position: relative; width: 100%; min-height: {{HEIGHT}}px; background: var(--kc-bg-card, #FFFFFF); border: 1px solid var(--kc-border, #E2E8F0); border-radius: 12px; padding: 1.25rem; box-sizing: border-box;">
  <div class="kit-charts-header" style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
    <div>
      <h2 class="kit-charts-title" style="margin: 0; font-size: 1.125rem; font-weight: 600; color: var(--kc-text-primary, #0F172A);">{{TITLE}}</h2>
      <p class="kit-charts-subtitle" style="margin: 0.25rem 0 0 0; font-size: 0.875rem; color: var(--kc-text-secondary, #64748B);">{{SUBTITLE}}</p>
    </div>
    <div class="kit-charts-anim-controls" style="display: flex; gap: 0.5rem; align-items: center;">
      <button type="button" class="btn-play" id="{{TRIGGER_ID}}" style="padding: 0.35rem 0.75rem; border-radius: 6px; border: 1px solid var(--kc-border, #CBD5E1); background: var(--kc-bg-btn, #F1F5F9); color: var(--kc-text-primary, #0F172A); font-size: 0.8125rem; font-weight: 500; cursor: pointer;">Rejouer</button>
    </div>
  </div>
  <div class="kit-charts-body" style="position: relative; width: 100%; height: {{HEIGHT}}px;">
    <canvas id="{{CANVAS_ID}}" role="img" aria-label="{{TITLE}}"></canvas>
  </div>
</div>
`;
  }

  // Standard Chart
  return `<div class="kit-charts-card" id="{{CONTAINER_ID}}" data-template-id="${id}" style="position: relative; width: 100%; min-height: {{HEIGHT}}px; background: var(--kc-bg-card, #FFFFFF); border: 1px solid var(--kc-border, #E2E8F0); border-radius: 12px; padding: 1.25rem; box-sizing: border-box;">
  <div class="kit-charts-header" style="margin-bottom: 1rem;">
    <h2 class="kit-charts-title" style="margin: 0; font-size: 1.125rem; font-weight: 600; color: var(--kc-text-primary, #0F172A);">{{TITLE}}</h2>
    <p class="kit-charts-subtitle" style="margin: 0.25rem 0 0 0; font-size: 0.875rem; color: var(--kc-text-secondary, #64748B);">{{SUBTITLE}}</p>
  </div>
  <div class="kit-charts-body" style="position: relative; width: 100%; height: {{HEIGHT}}px;">
    <canvas id="{{CANVAS_ID}}" role="img" aria-label="{{TITLE}}"></canvas>
  </div>
</div>
`;
}

/**
 * Génère le schema JSON (schema.json)
 */
function generateJsonSchema(id, meta, defaultData) {
  const schema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": meta.name || id,
    "description": meta.desc || `Schéma de validation des données pour le template ${id}`,
    "type": "object",
    "properties": {
      "targetTemplateId": {
        "type": "string",
        "enum": [id]
      },
      "layout": {
        "type": "object",
        "properties": {
          "title": { "type": "string" },
          "subtitle": { "type": "string" },
          "height": { "type": "integer", "minimum": 100, "maximum": 2000, "default": 400 }
        }
      },
      "colorStrategy": {
        "type": "object",
        "properties": {
          "themeName": {
            "type": "string",
            "enum": [
              "colorbrewer-accessible",
              "viridis-perceptual",
              "paul-tol-scientific",
              "tableau-stone-categorical",
              "okabe-ito-cud",
              "tufte-minimalist-executive",
              "nord-cognitive-dark",
              "atkinson-hyperlegible"
            ],
            "default": "colorbrewer-accessible"
          },
          "mode": {
            "type": "string",
            "enum": ["semantic-valence", "categorical", "sequential", "diverging"],
            "default": "categorical"
          },
          "metricPolarity": {
            "type": "string",
            "enum": ["HIGHER_IS_BETTER", "LOWER_IS_BETTER", "TARGET_BASED", "NEUTRAL_CATEGORICAL"]
          }
        }
      },
      "cognitiveFeatures": {
        "type": "object",
        "properties": {
          "showDataLabels": { "type": "boolean", "default": meta.dataLabels },
          "tooltip": {
            "type": "object",
            "properties": {
              "enabled": { "type": "boolean", "default": true },
              "antiOcclusion": { "type": "boolean", "default": true }
            }
          },
          "animation": {
            "type": "object",
            "properties": {
              "patternId": { "type": "string" },
              "durationMs": { "type": "integer", "maximum": 800, "default": 600 }
            }
          }
        }
      },
      "formattedData": {
        "type": "object",
        "description": "Données requises pour le rendu"
      }
    },
    "required": ["formattedData"]
  };

  // Typage dynamique de formattedData selon defaultData
  if (defaultData) {
    if (defaultData.labels && defaultData.datasets) {
      schema.properties.formattedData = {
        "type": "object",
        "properties": {
          "labels": {
            "type": "array",
            "items": { "type": "string" },
            "minItems": meta.minCategories || 1,
            "maxItems": meta.maxCategories || 50
          },
          "datasets": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "label": { "type": "string" },
                "data": {
                  "type": "array",
                  "items": { "type": ["number", "null", "object"] }
                }
              },
              "required": ["data"]
            },
            "minItems": 1,
            "maxItems": meta.seriesCount || 5
          }
        },
        "required": ["labels", "datasets"]
      };
    } else if (defaultData.columns && defaultData.rows) {
      schema.properties.formattedData = {
        "type": "object",
        "properties": {
          "title": { "type": "string" },
          "subtitle": { "type": "string" },
          "columns": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "key": { "type": "string" },
                "label": { "type": "string" },
                "align": { "type": "string", "enum": ["left", "center", "right"] }
              },
              "required": ["key", "label"]
            }
          },
          "rows": {
            "type": "array",
            "items": { "type": "object" },
            "minItems": meta.minCategories || 1,
            "maxItems": meta.maxCategories || 50
          }
        },
        "required": ["columns", "rows"]
      };
    } else if (defaultData.value !== undefined) {
      // KPI Card
      schema.properties.formattedData = {
        "type": "object",
        "properties": {
          "title": { "type": "string" },
          "value": { "type": "number" },
          "unit": { "type": "string" },
          "delta": { "type": "number" },
          "deltaLabel": { "type": "string" },
          "metricType": { "type": "string", "enum": ["gain", "cost", "revenue", "neutral"] },
          "target": { "type": "number" },
          "benchmark": { "type": "number" },
          "history": {
            "type": "array",
            "items": { "type": "number" }
          },
          "footnote": { "type": "string" }
        },
        "required": ["title", "value"]
      };
    } else {
      // Custom structure
      schema.properties.formattedData = {
        "type": "object",
        "description": "Données spécialisées du template"
      };
    }
  }

  return schema;
}

// Exécution principale
function main() {
  console.log('🚀 Début de la standardisation des triplets et génération de registry.json...');
  const templatePaths = scanTemplates(TEMPLATE_DIR);
  console.log(`📦 ${templatePaths.length} répertoires de templates détectés.`);

  const registryTemplates = [];

  for (const tPath of templatePaths) {
    const relPath = path.relative(ROOT_DIR, tPath);
    const parts = relPath.split(path.sep);
    const family = parts[1];
    const id = parts[parts.length - 1];

    const meta = TEMPLATE_METADATA[id] || {
      name: id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      desc: `Composant standardisé ${id} pour kit-charts.`,
      type: family === '00-kpi-card' ? 'kpi' : (family === '09-tableaux-dataviz' ? 'table' : (family === 'animation' ? 'animation' : 'chart')),
      labelsType: 'categorical', minCategories: 1, maxCategories: 20, seriesCount: 1,
      dataLabels: true, antiOcclusionTooltip: true, semanticValence: false,
      compatibleAnimations: []
    };

    // 1. Lire le module template.js pour extraire DEFAULT_DATA
    let defaultData = null;
    try {
      const mod = require(path.join(tPath, 'template.js'));
      defaultData = mod.DEFAULT_DATA || null;
    } catch (e) {
      // Ignorer l'erreur d'import si dépendance browser
    }

    // 2. Générer template.html
    const htmlContent = generateHtmlTemplate(id, meta, meta.type);
    fs.writeFileSync(path.join(tPath, 'template.html'), htmlContent, 'utf8');

    // 3. Générer schema.json
    const schemaContent = JSON.stringify(generateJsonSchema(id, meta, defaultData), null, 2);
    fs.writeFileSync(path.join(tPath, 'schema.json'), schemaContent, 'utf8');

    // 4. Ajouter au registre
    registryTemplates.push({
      id: id,
      family: family,
      name: meta.name,
      description: meta.desc,
      dataRequirements: {
        labelsType: meta.labelsType || 'categorical',
        minCategories: meta.minCategories || 1,
        maxCategories: meta.maxCategories || 20,
        seriesCount: meta.seriesCount || 1
      },
      supportedFeatures: {
        dataLabels: Boolean(meta.dataLabels),
        antiOcclusionTooltip: Boolean(meta.antiOcclusionTooltip),
        semanticValence: Boolean(meta.semanticValence),
        compatibleAnimations: meta.compatibleAnimations || []
      },
      paths: {
        html: path.join(relPath, 'template.html').replace(/\\/g, '/'),
        schema: path.join(relPath, 'schema.json').replace(/\\/g, '/'),
        js: path.join(relPath, 'template.js').replace(/\\/g, '/'),
        preview: path.join(relPath, 'preview.html').replace(/\\/g, '/')
      }
    });
  }

  // 5. Générer registry.json
  const registry = {
    version: '1.0.0',
    totalTemplates: registryTemplates.length,
    generatedAt: new Date().toISOString(),
    templates: registryTemplates
  };

  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2), 'utf8');
  console.log(`✅ Registre généré avec succès dans ${REGISTRY_PATH} (${registryTemplates.length} templates enregistrés).`);
}

main();
