/**
 * @file template/01-comparaison/bullet-chart/template.js
 * @description Standardized Universal bullet-chart Template for kit-charts.
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
    global.KitCharts['bullet-chart'] = exp;
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
  const resolveThresholds = (KitChartsTheme && KitChartsTheme.resolveThresholds) || (typeof window !== 'undefined' && window.resolveThresholds) || null;
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
 * @file 01-comparaison/bullet-chart/template.js
 * @description Template Chart.js v4+ pour Graphique à Puces (Stephen Few Bullet Chart).
 * Psychophysique: Remplacement compact et dense des cadrans/jauges analogiques.
 * Règle d'or: beginAtZero: true sur X, bande de performance, seuils qualitatifs et cible.
 */

/**
 * Données par défaut représentatives (Performance commerciale vs objectifs et paliers)
 */
const DEFAULT_DATA = {
  labels: ['Ventes EMEA', 'Ventes APAC', 'Ventes AMER'],
  datasets: [
    { label: 'Réalisé', data: [275, 185, 310] },
    { label: 'Objectif', data: [250, 200, 300] },
    { label: 'Excellent', data: [300, 250, 350] },
    { label: 'Moyen', data: [200, 150, 250] },
    { label: 'Faible', data: [100, 75, 120] }
  ]
};

/**
 * Crée et initialise un graphique à puces (Bullet Chart) dans le canvas cible.
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
  const isDark = Boolean(tokens.isDark);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const showDataLabels = (customData && customData.showDataLabels !== undefined) ? customData.showDataLabels : (options.showDataLabels !== undefined ? options.showDataLabels : true);

  // Préparation des données
  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels ? [...rawData.labels] : [];
  const rawDatasets = rawData.datasets || [];

  const focalStyle = getEmphasisStyle(tokens, 'focal');
  const benchmarkStyle = getEmphasisStyle(tokens, 'benchmark');

  const datasets = rawDatasets.map((ds, idx) => {
    const label = (ds.label || '').toLowerCase();
    const primaryColor = focalStyle.backgroundColor || getColor(tokens, 0);

    // 1. Barre de performance principale (Réalisé)
    if (label.includes('réalisé') || label.includes('actual') || idx === 0) {
      let bg = ds.backgroundColor;
      if (!bg) {
        if (ds.emphasisRole || ds.role) {
          bg = getEmphasisStyle(tokens, ds.emphasisRole || ds.role).backgroundColor;
        } else if (ds.metricType || ds.valence !== undefined) {
          bg = getValenceColor(tokens, ds.valence !== undefined ? ds.valence : 1, ds.metricType || 'gain');
        } else {
          bg = primaryColor;
        }
      }

      return {
        label: ds.label || 'Réalisé',
        type: 'bar',
        data: Array.isArray(ds.data) ? [...ds.data] : [],
        backgroundColor: bg,
        borderColor: ds.borderColor || bg,
        borderWidth: 0,
        borderRadius: isTufte ? 0 : 3,
        barPercentage: 0.45,
        categoryPercentage: 0.8,
        order: 1
      };
    }

    // 2. Marqueur d'objectif cible (Objectif / Target)
    if (label.includes('objectif') || label.includes('target') || idx === 1) {
      const benchmarkColor = benchmarkStyle.borderColor || tokens.emphasis?.benchmark || tokens.textPrimary;
      return {
        label: ds.label || 'Objectif',
        type: 'scatter',
        data: (Array.isArray(ds.data) ? ds.data : []).map((val, i) => ({
          x: typeof val === 'object' && val !== null ? (val.x ?? val.value ?? 0) : Number(val),
          y: labels[i] || i
        })),
        backgroundColor: benchmarkColor,
        borderColor: benchmarkColor,
        pointStyle: 'line',
        pointRotation: 90,
        pointRadius: 12,
        pointHoverRadius: 14,
        borderWidth: 3,
        order: 0
      };
    }

    // 3. Paliers de contexte qualitatif (Bandes de fond)
    const bandOpacities = isDark
      ? [0.35, 0.22, 0.12]
      : [0.18, 0.10, 0.04];
    const bandIdx = Math.max(0, idx - 2);
    const alpha = bandOpacities[bandIdx % bandOpacities.length];
    const bandColor = isDark
      ? `rgba(236, 239, 244, ${alpha})`
      : `rgba(15, 23, 42, ${alpha})`;

    return {
      label: ds.label || `Palier ${idx}`,
      type: 'bar',
      data: Array.isArray(ds.data) ? [...ds.data] : [],
      backgroundColor: ds.backgroundColor || bandColor,
      borderColor: 'transparent',
      borderWidth: 0,
      borderRadius: 0,
      barPercentage: 0.85,
      categoryPercentage: 0.8,
      order: 10 + idx
    };
  });

  const chartData = { labels, datasets };

  // Options Chart.js v4+
  const defaultOpts = getChartDefaultOptions(tokens);
  const config = {
    type: 'bar',
    data: chartData,
    options: {
      ...defaultOpts,
      indexAxis: 'y', // Orientation horizontale Stephen Few
      animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
      interaction: {
        mode: 'index',
        intersect: false,
        axis: 'y'
      },
      hover: {
        mode: 'index',
        intersect: false,
        axis: 'y',
        animationDuration: (isTufte || isReducedMotionPreferred()) ? 0 : 100
      },
      categoryPercentage: 0.8,
      barPercentage: 0.9,
      plugins: {
        ...defaultOpts.plugins,
        datalabels: getDataLabelOptions(tokens, {
          display: showDataLabels,
          formatter: (val, ctx) => {
            // Only label dataset 0 (Réalisé)
            if (ctx && ctx.datasetIndex !== 0) return null;
            if (typeof val === 'number' && Math.abs(val) >= 1000) {
              return new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(val);
            }
            return val;
          }
        }),
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
              const rawVal = context.raw;
              const val = typeof rawVal === 'object' && rawVal !== null
                ? (rawVal.x ?? rawVal.y ?? 0)
                : rawVal;
              const formatted = typeof val === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(val)
                : val;
              return ` ${context.dataset.label || ''}: ${formatted}`;
            }
          }
        }
      },
      scales: {
        y: {
          grid: {
            display: false,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 8
          }
        },
        x: {
          beginAtZero: true, // Règle psychophysique obligatoire
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontMono || tokens.fontFamily,
              size: 11
            },
            padding: 6,
            callback: (val) => {
              if (typeof val === 'number' && Math.abs(val) >= 1000) {
                return new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(val);
              }
              return val;
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
