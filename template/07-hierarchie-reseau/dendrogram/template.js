/**
 * @file template/07-hierarchie-reseau/dendrogram/template.js
 * @description Standardized Universal dendrogram Template for kit-charts.
 * Compatible with browsers (file://, http://), Node.js, and bundlers.
 */

(function(global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory(require('../../../themes/theme-tokens.js'));
  } else if (typeof define === 'function' && define.amd) {
    define(['../../../themes/theme-tokens.js'], factory);
  } else {
    global = typeof globalThis !== 'undefined' ? globalThis : global || self;
    var tokens = global.KitChartsTheme || (global.KitCharts && global.KitCharts.Theme) || {};
    var exp = factory(tokens);
    global.KitCharts = global.KitCharts || {};
    global.KitCharts['dendrogram'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function() { return {}; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function() { return {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function() { return ''; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function() { return {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function() { return {}; };
  const getPartitionInteractionOptions = (KitChartsTheme && KitChartsTheme.getPartitionInteractionOptions) || (typeof window !== 'undefined' && window.getPartitionInteractionOptions) || function() { return {}; };
  const getExecutiveModeOptions = (KitChartsTheme && KitChartsTheme.getExecutiveModeOptions) || (typeof window !== 'undefined' && window.getExecutiveModeOptions) || function() { return {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 07-hierarchie-reseau/dendrogram/template.js
 * @description Template Chart.js v4+ pour Dendrogramme & Arbre Hiérarchique (Dendrogram / Tree Diagram).
 * Psychophysique: Encodage hiérarchique par emboîtement et hauteur de branche (Cleveland-McGill: distance de dissimilarité).
 * Règle cognitive: Orientation horizontale (racine à gauche/droite, feuilles alignées), connecteurs orthogonaux stricts à 90°, ligne de coupe seuil.
 */

/**
 * Données par défaut représentatives (Segmentation hiérarchique de profils clients HCA)
 */
const DEFAULT_DATA = {
  labels: [
    'Visiteurs Occasionnels',
    'Chasseurs de Promos',
    'Acheteurs Fidèles Standard',
    'Abonnés Premium',
    'PME / Indépendants',
    'Grands Comptes B2B'
  ],
  datasets: [
    // Cluster 1 : Retail B2C (Feuilles 1 & 2)
    {
      label: 'Cluster B2C Grand Public',
      role: 'context',
      data: [
        { x: 0, y: 1 }, { x: 14, y: 1 }, { x: 14, y: 2 }, { x: 0, y: 2 },
        { x: 14, y: 1.5 }, { x: 32, y: 1.5 }, { x: 32, y: 3 }, { x: 18, y: 3 },
        { x: 18, y: 3 }, { x: 0, y: 3 }, { x: 18, y: 4 }, { x: 0, y: 4 }
      ]
    },
    // Cluster 2 : Entreprises B2B (Feuilles 5 & 6) - Cible focale haute valeur
    {
      label: 'Cluster B2B Professionnel (Cible Focale)',
      role: 'focal',
      data: [
        { x: 0, y: 5 }, { x: 22, y: 5 }, { x: 22, y: 6 }, { x: 0, y: 6 },
        { x: 22, y: 5.5 }, { x: 48, y: 5.5 }
      ]
    },
    // Tronc principal reliant les méta-clusters
    {
      label: 'Jonction Hiérarchique Principale',
      role: 'context',
      data: [
        { x: 32, y: 2.25 }, { x: 65, y: 2.25 }, { x: 65, y: 5.5 }, { x: 48, y: 5.5 }
      ]
    },
    // Ligne de coupe de seuil K=2 clusters (Benchmark de partition)
    {
      label: 'Seuil de Partition (Cutoff Benchmark)',
      role: 'benchmark',
      data: [
        { x: 40, y: 0.5 }, { x: 40, y: 6.5 }
      ]
    }
  ]
};

/**
 * Crée et initialise un Dendrogramme dans le canvas cible.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément HTMLCanvasElement
 * @param {Object} [customData=null] - Jeu de données optionnel
 * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème cognitif
 * @returns {Object} Instance Chart.js initialisée
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) {
    throw new Error(`Canvas element "${canvasTarget}" not found`);
  }

  // Destruction propre de l'instance précédente
  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const isDark = Boolean(tokens.isDark);
  const reduceMotion = isReducedMotionPreferred();

  const rawData = customData || DEFAULT_DATA;
  const rawDatasets = rawData.datasets || [];

  const datasets = rawDatasets.map((ds, idx) => {
    const isCutoff = ds.role === 'benchmark' || (ds.label && (ds.label.toLowerCase().includes('seuil') || ds.label.toLowerCase().includes('cutoff')));
    const isMainTrunk = ds.label && (ds.label.toLowerCase().includes('jonction') || ds.label.toLowerCase().includes('tronc'));

    let color = getColor(tokens, idx);
    let borderDash = [];
    let borderWidth = isTufte ? 1.5 : 2;
    let pointRadius = 3;

    if (ds.role) {
      const emp = getEmphasisStyle(tokens, ds.role, { borderWidth: isTufte ? 1.5 : (ds.role === 'focal' ? 3 : 2) });
      color = emp.borderColor || emp.backgroundColor || color;
      borderWidth = emp.borderWidth !== undefined ? emp.borderWidth : borderWidth;
      borderDash = emp.borderDash || borderDash;
      if (ds.role === 'benchmark') {
        pointRadius = 0;
      }
    } else if (ds.valence !== undefined || ds.delta !== undefined) {
      color = getValenceColor(tokens, ds.valence !== undefined ? ds.valence : ds.delta, ds.metricType || 'gain');
    } else if (isCutoff) {
      const emp = getEmphasisStyle(tokens, 'benchmark');
      color = emp.borderColor || tokens.semantic?.warning || '#F59E0B';
      borderDash = emp.borderDash || [6, 6];
      borderWidth = 1.5;
      pointRadius = 0;
    } else if (isMainTrunk) {
      color = tokens.textMuted || '#64748B';
      borderWidth = 1.5;
      pointRadius = 0;
    } else {
      color = isTufte ? (idx === 0 ? tokens.palette[0] : tokens.palette[1]) : getColor(tokens, idx);
    }

    const dataPoints = (ds.data || []).map(p => {
      if (typeof p === 'object' && p !== null) {
        return {
          x: typeof p.x === 'number' ? p.x : 0,
          y: typeof p.y === 'number' ? p.y : 0
        };
      }
      return { x: 0, y: 0 };
    });

    return {
      label: ds.label || `Branche ${idx + 1}`,
      data: dataPoints,
      borderColor: color,
      backgroundColor: color,
      borderWidth,
      borderDash,
      pointRadius,
      pointHitRadius: 12,
      pointHoverRadius: 6,
      fill: false,
      stepped: false,
      showLine: true
    };
  });

  const leafLabels = rawData.labels || [
    'Feuille 1', 'Feuille 2', 'Feuille 3', 'Feuille 4', 'Feuille 5', 'Feuille 6'
  ];

  const chartData = {
    datasets
  };

  const defaultOpts = getChartDefaultOptions(tokens);

  const config = {
    type: 'line',
    data: chartData,
    options: {
      scales: {},
      ...defaultOpts,
      animation: getAccessibleAnimationOptions(tokens, {
        duration: (isTufte || reduceMotion) ? 0 : 400,
        easing: 'easeOutQuart'
      }),
      interaction: {
        mode: 'nearest',
        intersect: false,
        axis: 'xy'
      },
      hover: {
        mode: 'nearest',
        intersect: false,
        animationDuration: (isTufte || reduceMotion) ? 0 : 100
      },
      plugins: {
        ...defaultOpts.plugins,
        legend: {
          display: datasets.length > 1 && !isTufte,
          position: 'top',
          align: 'end',
          labels: {
            color: tokens.textPrimary,
            usePointStyle: true,
            boxWidth: 8,
            font: {
              family: tokens.fontFamily,
              size: 11
            }
          }
        },
        tooltip: {
          ...defaultOpts.plugins.tooltip,
          backgroundColor: tokens.tooltipBg || '#0F172A',
          titleColor: tokens.tooltipText || '#F8FAFC',
          bodyColor: tokens.tooltipText || '#F8FAFC',
          borderColor: tokens.borderStrong || tokens.border || '#334155',
          borderWidth: 1,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          boxPadding: 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono,
            size: 12,
            weight: '400'
          },
          callbacks: {
            title: (items) => {
              if (!items.length) return '';
              const raw = items[0].raw;
              const leafIndex = Math.round(raw?.y);
              const label = leafLabels[leafIndex - 1];
              return label ? `Feuille : ${label}` : `Nœud (y = ${raw?.y})`;
            },
            label: (item) => {
              const raw = item.raw;
              const formattedX = typeof raw.x === 'number' ? raw.x.toLocaleString('fr-FR') : raw.x;
              return [
                ` Distance de dissimilarité : ${formattedX}`,
                ` Position taxonomique : ${raw.y}`
              ];
            }
          }
        }
      },
      scales: {
        x: {
          type: 'linear',
          title: {
            display: true,
            text: 'Distance de Dissimilarité (Indice de Ward / Hauteur)',
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11,
              weight: '500'
            }
          },
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 6
          }
        },
        y: {
          type: 'linear',
          min: 0.2,
          max: leafLabels.length + 0.8,
          grid: {
            display: false,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            stepSize: 1,
            color: tokens.textPrimary,
            font: {
              family: tokens.fontFamily,
              size: 11,
              weight: '500'
            },
            padding: 8,
            callback: (val) => {
              const idx = Math.round(val) - 1;
              return leafLabels[idx] || '';
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }

  // Simulation mock pour environnement Node.js headless
  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;
  moduleExports.getEmphasisStyle = moduleExports.getEmphasisStyle;
  moduleExports.getValenceColor = moduleExports.getValenceColor;
  moduleExports.getThresholdStatus = moduleExports.getThresholdStatus;

  return moduleExports;
});
