/**
 * @file template/06-flux-processus/sankey-diagram/template.js
 * @description Standardized Universal sankey-diagram Template for kit-charts.
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
    global.KitCharts['sankey-diagram'] = exp;
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
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function(t, r, o) { return { borderColor: '#2B8CBE', backgroundColor: '#2B8CBE', ...o }; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function(v, tr, th, p, t) { return {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function() { return {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function() { return {}; };
  const getPartitionInteractionOptions = (KitChartsTheme && KitChartsTheme.getPartitionInteractionOptions) || (typeof window !== 'undefined' && window.getPartitionInteractionOptions) || function() { return {}; };
  const getExecutiveModeOptions = (KitChartsTheme && KitChartsTheme.getExecutiveModeOptions) || (typeof window !== 'undefined' && window.getExecutiveModeOptions) || function() { return {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 06-flux-processus/sankey-diagram/template.js
 * @description Standardized Sankey Diagram template for kit-charts.
 * Visualizes directed multi-stage quantitative flow transfers with strict mass conservation (Σ In = Σ Out).
 * Utilizes chartjs-chart-sankey plugin with dynamic theme node and gradient link coloring and semantic valence.
 */

/**
 * Données par défaut représentatives (Bilan flux énergétique national en TWh avec valence de flux)
 */
const DEFAULT_DATA = {
  datasets: [{
    label: 'Bilan Flux Énergétique National (TWh)',
    data: [
      { from: 'Nucléaire', to: 'Électricité Réseau', flow: 68, valence: 'neutral' },
      { from: 'Renouvelable (Éolien/Solaire)', to: 'Électricité Réseau', flow: 32, valence: 'positive' },
      { from: 'Gaz Naturel', to: 'Chaleur Industrielle', flow: 40, valence: 'neutral' },
      { from: 'Électricité Réseau', to: 'Secteur Résidentiel', flow: 45, valence: 'positive' },
      { from: 'Électricité Réseau', to: 'Industrie Électrifiée', flow: 38, valence: 'positive' },
      { from: 'Électricité Réseau', to: 'Pertes Réseau & Transport', flow: 17, valence: 'negative' },
      { from: 'Chaleur Industrielle', to: 'Transformation & Chimie', flow: 28, valence: 'positive' },
      { from: 'Chaleur Industrielle', to: 'Pertes Thermiques', flow: 12, valence: 'negative' }
    ]
  }]
};

/**
 * Creates and renders a Sankey Diagram in the specified canvas target.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - DOM Canvas ID or Canvas Element
 * @param {Object} [customData] - Optional user data payload
 * @param {string} [themeName='colorbrewer-accessible'] - Theme identifier
 * @returns {Object} Initialized Chart.js instance or mock instance
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
  const canvas = typeof canvasTarget === 'string' && typeof document !== 'undefined'
    ? document.getElementById(canvasTarget)
    : canvasTarget;

  if (typeof Chart !== 'undefined' && canvas) {
    const existing = Chart.getChart(canvas);
    if (existing) {
      existing.destroy();
    }
  }

  const container = canvas && canvas.parentElement ? canvas.parentElement : null;
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const reduceMotion = isReducedMotionPreferred();

  const rawData = customData || DEFAULT_DATA;
  const rawDatasets = rawData.datasets || [];

  const datasets = rawDatasets.map((ds, dsIdx) => {
    const flowData = Array.isArray(ds.data) ? ds.data : [];

    const defaultColorFrom = (ctx) => {
      const palette = tokens.palette || ['#2B8CBE', '#E66101', '#5E3C99', '#4DAC26'];
      const item = ctx.dataset?.data?.[ctx.dataIndex];
      if (item && item.valence) {
        if (item.valence === 'positive' || item.valence === 'gain') return getValenceColor(tokens, 'up', 'gain');
        if (item.valence === 'negative' || item.valence === 'cost' || item.valence === 'loss') return getValenceColor(tokens, 'up', 'cost');
      }
      const fromNode = item?.from || '';
      let hash = 0;
      for (let i = 0; i < fromNode.length; i++) hash += fromNode.charCodeAt(i);
      return palette[Math.abs(hash) % palette.length];
    };

    const defaultColorTo = (ctx) => {
      const palette = tokens.palette || ['#2B8CBE', '#E66101', '#5E3C99', '#4DAC26'];
      const item = ctx.dataset?.data?.[ctx.dataIndex];
      if (item && item.valence) {
        if (item.valence === 'positive' || item.valence === 'gain') return getValenceColor(tokens, 'up', 'gain');
        if (item.valence === 'negative' || item.valence === 'cost' || item.valence === 'loss') return getValenceColor(tokens, 'up', 'cost');
      }
      const toNode = item?.to || '';
      let hash = 0;
      for (let i = 0; i < toNode.length; i++) hash += toNode.charCodeAt(i);
      return palette[Math.abs(hash) % palette.length];
    };

    return {
      label: ds.label || `Flux ${dsIdx + 1}`,
      data: flowData,
      colorFrom: ds.colorFrom || defaultColorFrom,
      colorTo: ds.colorTo || defaultColorTo,
      colorMode: ds.colorMode || 'gradient',
      borderWidth: ds.borderWidth ?? 0,
      nodeWidth: ds.nodeWidth ?? 14,
      nodePadding: ds.nodePadding ?? 16,
      backgroundColor: ds.backgroundColor || getColor(tokens, dsIdx)
    };
  });

  const chartData = { datasets };
  const baseOptions = getChartDefaultOptions(tokens);

  const config = {
    type: 'sankey',
    data: chartData,
    options: {
      scales: {},
      ...baseOptions,
      responsive: true,
      maintainAspectRatio: false,
      animation: getAccessibleAnimationOptions(tokens, {
        duration: (isTufte || reduceMotion) ? 0 : 450,
        easing: 'easeOutQuart'
      }),
      interaction: {
        mode: 'nearest',
        intersect: true
      },
      hover: {
        mode: 'nearest',
        intersect: true,
        animationDuration: (isTufte || reduceMotion) ? 0 : 100
      },
      layout: {
        padding: { top: 16, bottom: 16, left: 16, right: 16 }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
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
            label: (ctx) => {
              const item = ctx.raw;
              if (!item) return '';
              const valTag = item.valence === 'positive' ? ' [Utile / Valeur]' : (item.valence === 'negative' ? ' [Perte / Dissipation]' : '');
              const formatted = typeof item.flow === 'number' ? item.flow.toLocaleString('fr-FR') : item.flow;
              return ` ${item.from} → ${item.to} : ${formatted}${valTag}`;
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }

  // Headless test fallback mock
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
    createChart: typeof createChart === 'function' ? createChart : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;
});
