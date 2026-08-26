/**
 * @file template/06-flux-processus/waterfall-chart/template.js
 * @description Standardized Universal waterfall-chart Template for kit-charts.
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
    global.KitCharts['waterfall-chart'] = exp;
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
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const kitChartsDataLabelsPlugin = (KitChartsTheme && KitChartsTheme.kitChartsDataLabelsPlugin) || (typeof window !== 'undefined' && window.kitChartsDataLabelsPlugin) || null;
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 06-flux-processus/waterfall-chart/template.js
 * @description Standardized Waterfall Chart template for kit-charts.
 * Visualizes sequential step-by-step reconciliation of cumulative financial gains (+) and losses (-).
 * Employs native floating bar ranges [y1, y2], semantic green/red valence coloring, and strict Y=0 baseline.
 */

/**
 * Données par défaut représentatives (Pont Financier de Réconciliation EBITDA en M€)
 */
const DEFAULT_DATA = {
  labels: [
    'EBITDA 2023 Initial',
    '+ Volume Ventes',
    '+ Mix Prix / Produits',
    '- Coûts Matières Premières',
    '- Frais R&D & Recrutement',
    'EBITDA 2024 Final'
  ],
  datasets: [{
    label: 'Pont Financier EBITDA (M€)',
    data: [
      [0, 100],      // Base Initial (100)
      [100, 135],    // +35 Gain
      [135, 155],    // +20 Gain
      [155, 125],    // -30 Loss
      [125, 110],    // -15 Loss
      [0, 110]       // Total Final (110)
    ]
  }]
};

/**
 * Creates and renders a Waterfall Chart in the specified canvas target.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - DOM Canvas ID or Canvas Element
 * @param {Object} [customData] - Optional user data payload
 * @param {string} [themeName='colorbrewer-accessible'] - Theme identifier
 * @param {Object} [options={}] - Additional options (e.g. showDataLabels)
 * @returns {Object} Initialized Chart.js instance or mock instance
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
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
  const showDataLabels = (customData && customData.showDataLabels !== undefined) ? customData.showDataLabels : (options.showDataLabels !== undefined ? options.showDataLabels : true);

  const posColor = getValenceColor(tokens, 'up', 'gain');
  const negColor = getValenceColor(tokens, 'down', 'gain');
  const totalColor = (tokens.emphasis?.benchmark && tokens.emphasis.benchmark !== negColor && tokens.emphasis.benchmark !== posColor)
    ? tokens.emphasis.benchmark
    : (tokens.zeroLine && tokens.zeroLine !== negColor && tokens.zeroLine !== posColor ? tokens.zeroLine : (getColor(tokens, 0) || '#475569'));

  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels ? [...rawData.labels] : [];

  const datasets = (rawData.datasets || []).map((ds, dsIdx) => {
    const rawPoints = Array.isArray(ds.data) ? ds.data : [];
    const len = rawPoints.length;

    const bgColors = rawPoints.map((val, idx) => {
      if (Array.isArray(val)) {
        if (idx === 0 || idx === len - 1) return totalColor;
        const diff = val[1] - val[0];
        return diff >= 0 ? posColor : negColor;
      }
      return totalColor;
    });

    return {
      label: ds.label || `Cascade ${dsIdx + 1}`,
      data: rawPoints,
      backgroundColor: ds.backgroundColor || bgColors,
      borderColor: ds.borderColor || (isTufte ? tokens.borderStrong : tokens.bg),
      borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : 1,
      borderRadius: isTufte ? 0 : 4,
      categoryPercentage: typeof ds.categoryPercentage === 'number' ? ds.categoryPercentage : 0.8,
      barPercentage: typeof ds.barPercentage === 'number' ? ds.barPercentage : 0.85
    };
  });

  const chartData = { labels, datasets };
  const baseOptions = getChartDefaultOptions(tokens);

  const config = {
    type: 'bar',
    data: chartData,
    options: {
      ...baseOptions,
      responsive: true,
      maintainAspectRatio: false,
      animation: getAccessibleAnimationOptions(tokens, {
        duration: (isTufte || reduceMotion) ? 0 : 400,
        easing: 'easeOutQuart'
      }),
      interaction: {
        mode: 'index',
        intersect: false,
        axis: 'x'
      },
      hover: {
        mode: 'index',
        intersect: false,
        axis: 'x',
        animationDuration: (isTufte || reduceMotion) ? 0 : 100
      },
      categoryPercentage: 0.8,
      barPercentage: 0.85,
      scales: {
        x: {
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
            padding: 6
          }
        },
        y: {
          beginAtZero: true, // Strict psychophysical mandate for waterfall baseline
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
            padding: 8
          }
        }
      },
      plugins: {
        datalabels: getDataLabelOptions(tokens, {
          display: showDataLabels,
          align: 'top',
          anchor: 'end',
          formatter: (val, ctx) => {
            const raw = ctx && ctx.rawVal !== undefined ? ctx.rawVal : (Array.isArray(val) ? val : null);
            if (Array.isArray(raw)) {
              const dIndex = ctx.dataIndex ?? ctx.index ?? 0;
              const dLen = (ctx.dataset && ctx.dataset.data) ? ctx.dataset.data.length : 0;
              const isTotal = dIndex === 0 || dIndex === dLen - 1;
              if (isTotal) {
                return `${formatLabelValue(raw[1])} M€`;
              }
              const diff = raw[1] - raw[0];
              const sign = diff > 0 ? '+' : '';
              return `${sign}${formatLabelValue(diff)}`;
            }
            return formatLabelValue(val);
          }
        }),
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
              const val = ctx.raw;
              if (Array.isArray(val)) {
                const diff = val[1] - val[0];
                const sign = diff > 0 ? '+' : '';
                const isTotal = ctx.dataIndex === 0 || ctx.dataIndex === ctx.dataset.data.length - 1;
                const formattedDiff = typeof diff === 'number' ? diff.toLocaleString('fr-FR') : diff;
                const formattedTotal = typeof val[1] === 'number' ? val[1].toLocaleString('fr-FR') : val[1];
                if (isTotal) {
                  return ` Solde Total: ${formattedTotal} M€`;
                }
                return [
                  ` Niveau Atteint: ${formattedTotal} M€`,
                  ` Contribution Étape: ${sign}${formattedDiff} M€ (${diff > 0 ? 'Gain' : 'Perte/Coût'})`
                ];
              }
              const formattedVal = typeof val === 'number' ? val.toLocaleString('fr-FR') : val;
              return ` Valeur: ${formattedVal} M€`;
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
