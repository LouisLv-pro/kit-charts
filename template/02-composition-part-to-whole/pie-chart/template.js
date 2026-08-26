/**
 * @file template/02-composition-part-to-whole/pie-chart/template.js
 * @description Standardized Universal pie-chart Template for kit-charts.
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
    global.KitCharts['pie-chart'] = exp;
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
 * @file 02-composition-part-to-whole/pie-chart/template.js
 * @description Template Chart.js v4+ pour Diagramme Circulaire (Pie Chart).
 * Psychophysique: Pas d'axes cartésiens x/y, départ à 12h, tri décroissant.
 */

const DEFAULT_DATA = {
  labels: ['Mobile', 'Desktop', 'Tablette'],
  datasets: [{
    label: 'Trafic Web (%)',
    data: [58, 34, 8]
  }]
};

function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) throw new Error('Canvas not found');

  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const showDataLabels = (customData && customData.showDataLabels !== undefined) ? customData.showDataLabels : (options.showDataLabels !== undefined ? options.showDataLabels : true);

  const rawData = customData || DEFAULT_DATA;
  let labels = rawData.labels ? [...rawData.labels] : [];
  let rawValues = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data) || [58, 34, 8];
  const ds0 = rawData.datasets?.[0] || {};

  // Support d'accentuation et de valence
  const dataLen = Array.isArray(rawValues) ? rawValues.length : labels.length;
  let initialColors = null;

  if (Array.isArray(ds0.emphasisRoles) || Array.isArray(ds0.roles)) {
    const roles = ds0.emphasisRoles || ds0.roles;
    initialColors = roles.map((r, i) => getEmphasisStyle(tokens, r).backgroundColor || getColor(tokens, i));
  } else if (Array.isArray(ds0.valences)) {
    const metricType = ds0.metricType || 'gain';
    initialColors = ds0.valences.map(v => getValenceColor(tokens, v, metricType));
  } else if (ds0.focusIndex !== undefined) {
    initialColors = Array.from({ length: dataLen }, (_, i) =>
      i === ds0.focusIndex ? (tokens.emphasis?.focal || getColor(tokens, 0)) : (tokens.emphasis?.context || tokens.textMuted || '#CBD5E1')
    );
  } else if (Array.isArray(ds0.backgroundColor)) {
    initialColors = [...ds0.backgroundColor];
  }

  // Tri décroissant pour maximiser la discrimination angulaire
  const pairs = labels.map((lbl, i) => ({
    label: lbl,
    val: typeof rawValues[i] === 'object' && rawValues[i] !== null ? (rawValues[i].value ?? rawValues[i].v ?? 0) : Number(rawValues[i]) || 0,
    color: initialColors ? initialColors[i] : null
  }));

  if (ds0.sorted !== false) {
    pairs.sort((a, b) => b.val - a.val);
  }

  labels = pairs.map(p => p.label);
  const data = pairs.map(p => p.val);
  const bgColors = pairs.map((p, i) => p.color || getColor(tokens, i));

  const defaultOpts = getChartDefaultOptions(tokens);
  const config = {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        label: ds0.label || 'Proportion',
        data,
        backgroundColor: bgColors,
        borderColor: tokens.bg || '#FFFFFF',
        borderWidth: isTufte ? 1 : 2
      }]
    },
    options: {
      ...defaultOpts,
      responsive: true,
      maintainAspectRatio: false,
      rotation: -90, // Départ à 12h
      scales: {}, // AUCUN AXE CARTÉSIEN X/Y
      animation: getAccessibleAnimationOptions(tokens, { duration: 450, easing: 'easeOutQuart' }),
      interaction: {
        mode: 'nearest',
        intersect: true,
        axis: 'xy'
      },
      hover: {
        mode: 'nearest',
        intersect: true,
        animationDuration: (isTufte || isReducedMotionPreferred()) ? 0 : 120
      },
      plugins: {
        datalabels: getDataLabelOptions(tokens, {
          display: showDataLabels,
          formatter: (val) => {
            const num = typeof val === 'object' && val !== null ? (val.value ?? val.v ?? 0) : val;
            return `${num}%`;
          }
        }),
        legend: {
          display: !isTufte,
          position: 'right',
          labels: {
            color: tokens.textPrimary,
            font: { family: tokens.fontFamily, size: 12, weight: '500' },
            boxWidth: 12,
            padding: 12,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          ...defaultOpts.plugins.tooltip,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          titleFont: { family: tokens.fontFamily, size: 12, weight: '600' },
          bodyFont: { family: tokens.fontMono || 'monospace', size: 12, weight: '400' },
          animation: (isTufte || isReducedMotionPreferred()) ? false : { duration: 150, easing: 'easeOutQuad' },
          callbacks: {
            label: (ctx) => {
              const val = ctx.parsed;
              return ` ${ctx.label} : ${val} %`;
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }
  return { canvas, config, data: config.data, options: config.options, destroy: () => {}, update: () => {}, resize: () => {} };
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
