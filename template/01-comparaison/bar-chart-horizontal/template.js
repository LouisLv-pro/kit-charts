/**
 * @file template/01-comparaison/bar-chart-horizontal/template.js
 * @description Standardized Universal bar-chart-horizontal Template for kit-charts.
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
    global.KitCharts['bar-chart-horizontal'] = exp;
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
 * @file 01-comparaison/bar-chart-horizontal/template.js
 * @description Template Chart.js v4+ pour Diagramme en Barres Horizontales (Horizontal Bar Chart).
 * Psychophysique: Idéal pour libellés longs (N=8-25) et élimination de la rotation textuelle.
 * Règle d'or: beginAtZero: true sur l'axe X, tri décroissant par magnitude, espacements Gestalt.
 */

/**
 * Données par défaut représentatives (Population des grandes métropoles mondiales en Millions)
 */
const DEFAULT_DATA = {
  labels: ['Tokyo', 'Delhi', 'Shanghai', 'São Paulo', 'Mexico', 'Le Caire', 'Mumbai', 'Pékin'],
  datasets: [{
    label: 'Population (Millions)',
    data: [37.4, 32.9, 29.2, 22.6, 22.3, 22.2, 21.3, 21.3]
  }]
};

/**
 * Crée et initialise un diagramme en barres horizontales dans le canvas cible.
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

  // Préparation des données avec support d'accentuation et tri cognitif
  const rawData = customData || DEFAULT_DATA;
  let labels = rawData.labels ? [...rawData.labels] : [];
  let datasets = (rawData.datasets || []).map((ds, idx) => {
    const dataLen = Array.isArray(ds.data) ? ds.data.length : labels.length;
    const primaryColor = getColor(tokens, idx);

    let bgColors = ds.backgroundColor;
    let borderColors = ds.borderColor;
    let borderWidths = ds.borderWidth;

    if (!bgColors || Array.isArray(ds.emphasisRoles) || Array.isArray(ds.roles) || Array.isArray(ds.valences) || ds.emphasisRole || ds.role || ds.metricType || ds.valence !== undefined || ds.focusIndex !== undefined) {
      if (Array.isArray(ds.emphasisRoles) || Array.isArray(ds.roles)) {
        const roles = ds.emphasisRoles || ds.roles;
        bgColors = roles.map(r => getEmphasisStyle(tokens, r).backgroundColor || primaryColor);
        borderColors = roles.map(r => getEmphasisStyle(tokens, r).borderColor || primaryColor);
      } else if (Array.isArray(ds.valences)) {
        const metricType = ds.metricType || 'gain';
        bgColors = ds.valences.map(v => getValenceColor(tokens, v, metricType));
        borderColors = bgColors;
      } else if (ds.focusIndex !== undefined) {
        bgColors = Array.from({ length: dataLen }, (_, i) =>
          i === ds.focusIndex ? (tokens.emphasis?.focal || primaryColor) : (tokens.emphasis?.context || tokens.textMuted || '#CBD5E1')
        );
        borderColors = bgColors;
      } else if (ds.emphasisRole || ds.role) {
        const style = getEmphasisStyle(tokens, ds.emphasisRole || ds.role);
        bgColors = ds.backgroundColor || style.backgroundColor || primaryColor;
        borderColors = ds.borderColor || style.borderColor || primaryColor;
      } else if (ds.valence !== undefined || ds.direction !== undefined) {
        const valColor = getValenceColor(tokens, ds.valence !== undefined ? ds.valence : ds.direction, ds.metricType || 'gain');
        bgColors = ds.backgroundColor || valColor;
        borderColors = ds.borderColor || valColor;
      } else {
        bgColors = ds.backgroundColor || primaryColor;
        borderColors = ds.borderColor || primaryColor;
      }
    }

    return {
      label: ds.label || `Série ${idx + 1}`,
      data: Array.isArray(ds.data) ? [...ds.data] : [],
      backgroundColor: bgColors,
      borderColor: borderColors,
      borderWidth: typeof borderWidths === 'number' ? borderWidths : 0,
      borderRadius: isTufte ? 0 : 4,
      borderSkipped: false,
      categoryPercentage: typeof ds.categoryPercentage === 'number' ? ds.categoryPercentage : 0.8,
      barPercentage: typeof ds.barPercentage === 'number' ? ds.barPercentage : 0.9,
      sorted: ds.sorted !== undefined ? ds.sorted : true
    };
  });

  // Tri cognitif par magnitude décroissante si 1 seule série pour optimiser la charge perceptive
  if (datasets.length === 1 && labels.length > 0 && datasets[0].data.length === labels.length && datasets[0].sorted !== false) {
    const ds0 = datasets[0];
    const isBgArray = Array.isArray(ds0.backgroundColor);
    const isBorderArray = Array.isArray(ds0.borderColor);

    const pairs = labels.map((lbl, i) => ({
      label: lbl,
      val: ds0.data[i],
      bg: isBgArray ? ds0.backgroundColor[i] : ds0.backgroundColor,
      border: isBorderArray ? ds0.borderColor[i] : ds0.borderColor
    }));

    // Trier de manière décroissante
    pairs.sort((a, b) => {
      const va = typeof a.val === 'object' && a.val !== null ? (a.val.x ?? a.val.y ?? a.val.value ?? 0) : Number(a.val);
      const vb = typeof b.val === 'object' && b.val !== null ? (b.val.x ?? b.val.y ?? b.val.value ?? 0) : Number(b.val);
      return vb - va;
    });

    labels = pairs.map(p => p.label);
    ds0.data = pairs.map(p => p.val);
    if (isBgArray) {
      ds0.backgroundColor = pairs.map(p => p.bg);
    }
    if (isBorderArray) {
      ds0.borderColor = pairs.map(p => p.border);
    }
  }

  const chartData = { labels, datasets };

  // Options Chart.js v4+ avec indexAxis: 'y' et interaction Fitts sur axe Y
  const defaultOpts = getChartDefaultOptions(tokens);
  const config = {
    type: 'bar',
    data: chartData,
    options: {
      ...defaultOpts,
      indexAxis: 'y', // Orientation horizontale
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
          formatter: (val) => {
            if (typeof val === 'number' && Math.abs(val) >= 1000) {
              return new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(val);
            }
            return val;
          }
        }),
        legend: {
          ...defaultOpts.plugins.legend,
          display: datasets.length > 1 && !isTufte
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
              const val = context.parsed.x !== null && context.parsed.x !== undefined
                ? context.parsed.x
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
          beginAtZero: true, // Règle psychophysique obligatoire pour encodage horizontal
          grace: '10%',
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
