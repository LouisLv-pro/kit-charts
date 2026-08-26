/**
 * @file template/01-comparaison/radar-chart/template.js
 * @description Standardized Universal radar-chart Template for kit-charts.
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
    global.KitCharts['radar-chart'] = exp;
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
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function() { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function() { return {}; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function() { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function(t, o) { return o || {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return o || {}; };
  const getPartitionInteractionOptions = (KitChartsTheme && KitChartsTheme.getPartitionInteractionOptions) || (typeof window !== 'undefined' && window.getPartitionInteractionOptions) || function(t, o) { return o || {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const kitChartsDataLabelsPlugin = (KitChartsTheme && KitChartsTheme.kitChartsDataLabelsPlugin) || (typeof window !== 'undefined' && window.kitChartsDataLabelsPlugin) || null;
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 01-comparaison/radar-chart/template.js
 * @description Template Chart.js v4+ pour Graphique Radar / Profil Multivarié (Radar Chart / Spider Chart).
 * Psychophysique: Évaluation globale d'une empreinte multidimensionnelle (5 à 8 critères, max 2 entités).
 * Règle d'or: Échelle radiale partagée, opacité de remplissage faible (20-30%) pour éviter les masquages.
 */

/**
 * Données par défaut représentatives (Comparaison de profils techniques entre plateformes logicielles)
 */
const DEFAULT_DATA = {
  labels: ['Vitesse', 'Fiabilité', 'Sécurité', 'Scalabilité', 'Ergonomie', 'Documentation'],
  datasets: [
    { label: 'Plateforme A', data: [85, 92, 90, 78, 88, 95] },
    { label: 'Plateforme B', data: [70, 80, 85, 92, 75, 80] }
  ]
};

/**
 * Convertit une couleur Hex en chaîne RGBA valide.
 * @param {string} hex
 * @param {number} alpha
 * @returns {string}
 */
function hexToRgba(hex, alpha = 0.2) {
  if (!hex || typeof hex !== 'string') return `rgba(43, 140, 190, ${alpha})`;
  if (hex.startsWith('rgba') || hex.startsWith('rgb')) return hex;
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const num = parseInt(clean.substring(0, 6), 16);
  if (isNaN(num)) return `rgba(43, 140, 190, ${alpha})`;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Crée et initialise un graphique radar dans le canvas cible.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément HTMLCanvasElement
 * @param {Object} [customData=null] - Jeu de données optionnel
 * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème cognitif
 * @param {Object} [options={}] - Options additionnelles (ex: showDataLabels)
 * @returns {Object} Instance Chart.js initialisée
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
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
  const showDataLabels = (customData && customData.showDataLabels !== undefined) ? customData.showDataLabels : (options.showDataLabels !== undefined ? options.showDataLabels : true);

  // Préparation des données avec support d'accentuation et de valence
  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels ? [...rawData.labels] : [];
  const datasets = (rawData.datasets || []).map((ds, idx) => {
    const primaryColor = getColor(tokens, idx);

    let borderColor = ds.borderColor;
    let borderWidth = ds.borderWidth;
    let borderDash = ds.borderDash || [];
    let pointRadius = ds.pointRadius !== undefined ? ds.pointRadius : (isTufte ? 3 : 4);
    let pointStyle = ds.pointStyle || 'circle';
    let alpha = 0.2;

    if (ds.emphasisRole || ds.role) {
      const style = getEmphasisStyle(tokens, ds.emphasisRole || ds.role);
      borderColor = borderColor || style.borderColor || primaryColor;
      borderWidth = borderWidth !== undefined ? borderWidth : style.borderWidth;
      borderDash = style.borderDash || [];
      pointRadius = style.pointRadius || pointRadius;
      pointStyle = style.pointStyle || pointStyle;
      alpha = (ds.emphasisRole === 'context' || ds.role === 'context') ? 0.08 : 0.25;
    } else if (ds.valence !== undefined || ds.metricType) {
      const valColor = getValenceColor(tokens, ds.valence !== undefined ? ds.valence : 1, ds.metricType || 'gain');
      borderColor = borderColor || valColor;
    } else {
      borderColor = borderColor || primaryColor;
      borderWidth = borderWidth !== undefined ? borderWidth : (isTufte ? 1.5 : 2);
    }

    const fillColor = ds.backgroundColor || hexToRgba(borderColor, alpha);

    return {
      label: ds.label || `Profil ${idx + 1}`,
      data: Array.isArray(ds.data) ? [...ds.data] : [],
      backgroundColor: fillColor,
      borderColor: borderColor,
      borderWidth: borderWidth !== undefined ? borderWidth : (isTufte ? 1.5 : 2),
      borderDash: borderDash,
      pointBackgroundColor: borderColor,
      pointBorderColor: tokens.bg,
      pointBorderWidth: 1.5,
      pointRadius: pointRadius,
      pointHoverRadius: pointRadius + 3,
      pointHitRadius: 10,
      pointStyle: pointStyle,
      fill: ds.fill !== undefined ? ds.fill : true
    };
  });

  const chartData = { labels, datasets };

  // Options Chart.js v4+ pour échelle radiale 'r' avec interaction Fitts indexée
  const defaultOpts = getChartDefaultOptions(tokens);
  const config = {
    type: 'radar',
    data: chartData,
    options: {
      ...defaultOpts,
      animation: getAccessibleAnimationOptions(tokens, { duration: 450, easing: 'easeOutQuart' }),
      interaction: {
        mode: 'index',
        intersect: false
      },
      hover: {
        mode: 'index',
        intersect: false,
        animationDuration: (isTufte || isReducedMotionPreferred()) ? 0 : 100
      },
      plugins: {
        ...defaultOpts.plugins,
        datalabels: {
          display: (context) => {
            return showDataLabels && (typeof context === 'object' && context.datasetIndex !== undefined ? context.datasetIndex < 2 : true);
          },
          align: (context) => (context && context.datasetIndex === 0) ? 'end' : 'start',
          anchor: (context) => (context && context.datasetIndex === 0) ? 'end' : 'start',
          offset: 6,
          backgroundColor: (context) => hexToRgba(tokens.surface || '#FFFFFF', 0.92),
          borderColor: (context) => (context && context.dataset && context.dataset.borderColor) || tokens.border,
          borderWidth: 1,
          borderRadius: 4,
          padding: { top: 2, bottom: 2, left: 4, right: 4 },
          color: (context) => (context && context.dataset && context.dataset.borderColor) || tokens.textPrimary,
          font: {
            family: tokens.fontMono || 'monospace',
            size: 10,
            weight: '700'
          },
          formatter: (val) => {
            if (typeof val === 'number' && Math.abs(val) >= 1000) {
              return new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(val);
            }
            return val;
          }
        },
        legend: {
          ...defaultOpts.plugins.legend,
          display: !isTufte,
          position: 'top',
          align: 'end'
        },
        tooltip: {
          ...defaultOpts.plugins.tooltip,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono || 'monospace',
            size: 12,
            weight: '400'
          },
          animation: (isTufte || isReducedMotionPreferred()) ? false : { duration: 150, easing: 'easeOutQuad' },
          callbacks: {
            label: (context) => {
              const val = context.parsed.r !== null && context.parsed.r !== undefined
                ? context.parsed.r
                : context.raw;
              const formatted = typeof val === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(val)
                : val;
              return ` ${context.dataset.label || ''}: ${formatted}`;
            }
          }
        }
      },
      scales: {
        x: { display: false },
        y: { display: false },
        r: {
          angleLines: {
            color: tokens.gridColor,
            lineWidth: 1
          },
          grid: {
            color: tokens.gridColor,
            lineWidth: 1
          },
          pointLabels: {
            color: tokens.textPrimary,
            font: {
              family: tokens.fontFamily,
              size: 11,
              weight: '500'
            },
            padding: 16
          },
          ticks: {
            display: false
          },
          suggestedMin: 0
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
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    isReducedMotionPreferred: typeof isReducedMotionPreferred === 'function' ? isReducedMotionPreferred : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null,
    getSpatialInteractionOptions: typeof getSpatialInteractionOptions === 'function' ? getSpatialInteractionOptions : null,
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getPartitionInteractionOptions: typeof getPartitionInteractionOptions === 'function' ? getPartitionInteractionOptions : null,
    computeAntiOcclusionTooltipPosition: typeof computeAntiOcclusionTooltipPosition === 'function' ? computeAntiOcclusionTooltipPosition : null,
    getDataLabelOptions: typeof getDataLabelOptions === 'function' ? getDataLabelOptions : null,
    formatLabelValue: typeof formatLabelValue === 'function' ? formatLabelValue : null,
    kitChartsDataLabelsPlugin: typeof kitChartsDataLabelsPlugin !== 'undefined' ? kitChartsDataLabelsPlugin : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;
});
