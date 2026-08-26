/**
 * @file template/02-composition-part-to-whole/waffle-chart/template.js
 * @description Standardized Universal waffle-chart Template for kit-charts.
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
    global.KitCharts['waffle-chart'] = exp;
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
 * @file 02-composition-part-to-whole/waffle-chart/template.js
 * @description Template Chart.js v4+ pour Graphique Gaufre (Waffle Chart / 10x10 Isotype Grid).
 * Psychophysique: Encodage unitaire discret (100 cellules carrées, 1 cellule = 1%).
 * Règle d'or: Grille 10x10 régulière, comptage visuel direct, forte supériorité sur le camembert pour les pourcentages entiers.
 */

/**
 * Génère une grille 10x10 (100 cellules) pour une valeur de pourcentage donnée (0-100%).
 * @param {number} percentage
 * @returns {Array<{x: number, y: number, v: number}>}
 */
function generateWaffleData(percentage = 68) {
  const clamped = Math.max(0, Math.min(100, Math.round(percentage)));
  return Array.from({ length: 100 }, (_, i) => ({
    x: (i % 10) + 1,
    y: Math.floor(i / 10) + 1,
    v: i < clamped ? 1 : 0
  }));
}

/**
 * Données par défaut représentatives (Taux d'atteinte de l'objectif annuel : 68%)
 */
const DEFAULT_DATA = {
  datasets: [{
    label: 'Progression des Objectifs (%)',
    data: generateWaffleData(68)
  }]
};

/**
 * Crée et initialise un graphique gaufre (Waffle Chart) dans le canvas cible.
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
  const primaryColor = getColor(tokens, 0);
  const inactiveColor = isDark ? 'rgba(236, 239, 244, 0.12)' : 'rgba(15, 23, 42, 0.08)';

  // Préparation des données avec support d'accentuation et de valence
  const rawData = customData || DEFAULT_DATA;
  const datasets = (rawData.datasets || []).map((ds, idx) => {
    let data = ds.data;
    if (!data || !Array.isArray(data) || data.length === 0) {
      data = generateWaffleData(68);
    } else if (typeof data[0] === 'number') {
      // Si un simple nombre de pourcentage est passé
      data = generateWaffleData(data[0]);
    }

    let dsColor = ds.backgroundColor;
    if (!dsColor) {
      if (ds.emphasisRole || ds.role) {
        dsColor = getEmphasisStyle(tokens, ds.emphasisRole || ds.role).backgroundColor || primaryColor;
      } else if (ds.metricType || ds.valence !== undefined) {
        dsColor = getValenceColor(tokens, ds.valence !== undefined ? ds.valence : 1, ds.metricType || 'gain');
      } else {
        dsColor = primaryColor;
      }
    }

    return {
      label: ds.label || 'Progression (%)',
      data: data,
      width: ({ chart }) => {
        const area = chart.chartArea || {};
        const w = (area.right - area.left) || 300;
        return Math.max(12, Math.floor(w / 11) - 3);
      },
      height: ({ chart }) => {
        const area = chart.chartArea || {};
        const h = (area.bottom - area.top) || 300;
        return Math.max(12, Math.floor(h / 11) - 3);
      },
      backgroundColor: (c) => {
        const raw = c.raw || (c.dataset?.data?.[c.dataIndex]);
        const active = raw ? (raw.v === 1 || raw.v === true) : false;
        return active ? dsColor : inactiveColor;
      },
      borderColor: tokens.bg,
      borderWidth: 2,
      borderRadius: isTufte ? 0 : 3
    };
  });

  const chartData = { datasets };

  const waffleSummaryPlugin = {
    id: 'waffleSummaryPlugin_' + Math.random().toString(36).substring(2, 7),
    afterDraw(chart) {
      if (!showDataLabels) return;
      const { ctx, chartArea } = chart;
      if (!chartArea) return;
      const ds = chart.data.datasets?.[0];
      if (!ds) return;
      const activeCount = (ds.data || []).filter(d => d && (d.v === 1 || d.v === true)).length;

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      const cx = (chartArea.left + chartArea.right) / 2;
      const cy = chartArea.bottom + 8;
      ctx.font = `700 14px ${tokens.fontMono || 'monospace'}`;
      ctx.fillStyle = tokens.textPrimary || '#0F172A';
      ctx.fillText(`${activeCount}% atteint (${activeCount} / 100)`, cx, cy);
      ctx.restore();
    }
  };

  // Options Chart.js v4+ pour Matrix / Waffle avec capture 2D
  const defaultOpts = getChartDefaultOptions(tokens);
  const config = {
    type: 'matrix',
    data: chartData,
    plugins: [waffleSummaryPlugin],
    options: {
      ...defaultOpts,
      layout: {
        padding: { bottom: showDataLabels ? 25 : 5 }
      },
      animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
      interaction: {
        mode: 'nearest',
        intersect: true,
        axis: 'xy'
      },
      hover: {
        mode: 'nearest',
        intersect: true,
        animationDuration: (isTufte || isReducedMotionPreferred()) ? 0 : 100
      },
      plugins: {
        ...defaultOpts.plugins,
        legend: {
          display: false
        },
        tooltip: {
          ...defaultOpts.plugins.tooltip,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          titleFont: { family: tokens.fontFamily, size: 12, weight: '600' },
          bodyFont: { family: tokens.fontMono || 'monospace', size: 12, weight: '400' },
          animation: (isTufte || isReducedMotionPreferred()) ? false : { duration: 150, easing: 'easeOutQuad' },
          callbacks: {
            title: () => 'Avancement Global',
            label: (context) => {
              const dataset = context.dataset;
              const activeCount = (dataset.data || []).filter(d => d && (d.v === 1 || d.v === true)).length;
              return ` ${dataset.label || 'Score'} : ${activeCount} / 100 (${activeCount}%)`;
            }
          }
        }
      },
      scales: {
        x: {
          display: false,
          min: 0.5,
          max: 10.5
        },
        y: {
          display: false,
          min: 0.5,
          max: 10.5
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
