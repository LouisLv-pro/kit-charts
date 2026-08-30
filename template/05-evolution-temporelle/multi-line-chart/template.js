/**
 * @file template/05-evolution-temporelle/multi-line-chart/template.js
 * @description Standardized Universal multi-line-chart Template for kit-charts.
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
    global.KitCharts['multi-line-chart'] = exp;
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
  const resolveSeriesBudget = (KitChartsTheme && KitChartsTheme.resolveSeriesBudget) || (typeof window !== 'undefined' && window.resolveSeriesBudget) || function(d) { return d; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return {}; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 05-evolution-temporelle/multi-line-chart/template.js
 * @description Standardized Multi-Line Chart template for kit-charts.
 * Visualizes multi-series temporal evolution with Focus + Context principles (2-4 series max).
 * Rejects dual-Y distortion, provides grouped index tooltips, and strict semantic double-encoding.
 */

/**
 * Données par défaut représentatives (Comparaison de croissance de gammes de produits avec focus narratif)
 */
const DEFAULT_DATA = {
  labels: ['T1-23', 'T2-23', 'T3-23', 'T4-23', 'T1-24', 'T2-24', 'T3-24', 'T4-24'],
  datasets: [
    {
      label: 'Produit Cloud Platform (Hero)',
      data: [42, 58, 78, 105, 140, 185, 230, 290],
      role: 'focal'
    },
    {
      label: 'Produit Core Enterprise (Benchmark)',
      data: [130, 145, 155, 168, 180, 192, 205, 218],
      role: 'benchmark'
    },
    {
      label: 'Produit Legacy Desktop (Context)',
      data: [95, 90, 84, 76, 68, 58, 48, 38],
      role: 'context'
    }
  ]
};

/**
 * Creates and renders a Multi-Line Chart in the specified canvas target.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - DOM Canvas ID or Canvas Element
 * @param {Object} [customData] - Optional user data payload
 * @param {string} [themeName='colorbrewer-accessible'] - Theme identifier
 * @param {Object} [options={}] - Additional options (maxSeries, aggregateRemainder, budgetSeries)
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

  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels ? [...rawData.labels] : [];
  const rawDatasets = rawData.datasets || [];

  const budgetedDatasets = (options.budgetSeries !== false && rawDatasets.length > (options.maxSeries || 7))
    ? resolveSeriesBudget(rawDatasets, {
        maxSeries: options.maxSeries || 7,
        aggregateRemainder: options.aggregateRemainder !== undefined ? options.aggregateRemainder : true,
        rankBy: options.rankBy || 'sum'
      })
    : rawDatasets;

  const datasets = budgetedDatasets.map((ds, idx) => {
    const defaultRole = idx === 0 ? 'focal' : (idx === 1 ? 'benchmark' : 'context');
    const role = ds.role || (ds.forecast ? 'forecast' : defaultRole);
    const isForecast = role === 'forecast' || Boolean(ds.forecast);


    let baseColor = getColor(tokens, idx);
    if (ds.valence && ds.metricType) {
      baseColor = getValenceColor(tokens, ds.valence, ds.metricType);
    } else if (ds.valence) {
      baseColor = getValenceColor(tokens, ds.valence, 'gain');
    }

    const emphasisStyle = getEmphasisStyle(tokens, role, {
      fill: ds.fill ?? false,
      alpha: ds.alpha,
      borderColor: ds.borderColor || (ds.valence ? baseColor : undefined),
      borderWidth: ds.borderWidth ?? (isTufte ? 1.5 : (role === 'focal' ? 3.0 : (role === 'benchmark' ? 2.0 : 1.5)))
    });

    const border = ds.borderColor || emphasisStyle.borderColor || baseColor;
    const bg = ds.backgroundColor || (typeof emphasisStyle.backgroundColor === 'string'
      ? emphasisStyle.backgroundColor
      : hexToRgba(border, 0.2));

    return {
      label: ds.label || `Série ${idx + 1}`,
      data: Array.isArray(ds.data) ? [...ds.data] : [],
      borderColor: border,
      backgroundColor: bg,
      borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : emphasisStyle.borderWidth,
      borderDash: ds.borderDash || emphasisStyle.borderDash || (isForecast ? [5, 5] : (role === 'benchmark' ? [4, 4] : [])),
      tension: typeof ds.tension === 'number' ? ds.tension : 0.25,
      fill: ds.fill !== undefined ? ds.fill : false,
      pointRadius: typeof ds.pointRadius === 'number' ? ds.pointRadius : (emphasisStyle.pointRadius ?? (role === 'focal' ? 4 : (role === 'benchmark' ? 3 : 2))),
      pointHoverRadius: 6,
      pointStyle: ds.pointStyle || emphasisStyle.pointStyle || (isForecast ? 'crossRot' : (role === 'benchmark' ? 'rectRot' : 'circle')),
      pointBackgroundColor: ds.pointBackgroundColor || emphasisStyle.pointBackgroundColor || border,
      pointBorderColor: ds.pointBorderColor || emphasisStyle.pointBorderColor || tokens.bg,
      pointBorderWidth: ds.pointBorderWidth ?? 1.5
    };
  });

  const chartData = { labels, datasets };
  const baseOptions = getChartDefaultOptions(tokens);
  const temporalOpts = getTemporalInteractionOptions(tokens, { mode: 'index', axis: 'x', hitRadius: 12, hoverRadius: 6 });
  const animOpts = getAccessibleAnimationOptions(tokens, { duration: 700, easing: 'easeOutCubic' });

  const config = {
    type: 'line',
    data: chartData,
    options: {
      ...baseOptions,
      ...temporalOpts,
      animation: animOpts,
      responsive: true,
      maintainAspectRatio: false,
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
            padding: 8,
            callback: (val) => {
              if (typeof val === 'number' && Math.abs(val) >= 1000) {
                return new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(val);
              }
              return val;
            }
          }
        }
      },
      plugins: {
        legend: {
          display: !isTufte,
          position: 'top',
          align: 'end',
          labels: {
            color: tokens.textPrimary,
            font: {
              family: tokens.fontFamily,
              size: 12,
              weight: '500'
            },
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
            padding: 14,
            generateLabels: (chart) => (chart.data.datasets || []).map((ds, i) => {
              const c = (typeof ds.borderColor === 'string')
                ? ds.borderColor
                : (Array.isArray(ds.borderColor) ? ds.borderColor[0] : (ds.backgroundColor || '#9CA3AF'));
              return {
                text: ds.label || ('Série ' + (i + 1)),
                fillStyle: c,
                strokeStyle: c,
                lineWidth: 2,
                pointStyle: 'line',
                hidden: !chart.isDatasetVisible(i),
                index: i
              };
            })
          }
        },
        tooltip: {
          backgroundColor: tokens.tooltipBg,
          titleColor: tokens.tooltipText,
          bodyColor: tokens.tooltipText,
          borderColor: tokens.borderStrong,
          borderWidth: 1,
          padding: 10,
          cornerRadius: 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono,
            size: 12,
            weight: '500'
          },
          callbacks: {
            label: (context) => {
              const val = context.parsed.y !== null && context.parsed.y !== undefined
                ? context.parsed.y
                : context.raw;
              const formatted = typeof val === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(val)
                : val;
              const roleTag = context.dataset.borderDash && context.dataset.borderDash.length > 0 ? ' [Tirets]' : '';
              return ` ${context.dataset.label || ''}: ${formatted}${roleTag}`;
            }
          }
        }
      }
    }
  };

  const budgetInfo = budgetedDatasets.__budget;

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    const chartInstance = new Chart(canvas, config);
    chartInstance.$kitBudget = budgetInfo;
    return chartInstance;
  }

  // Headless test fallback mock
  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    $kitBudget: budgetInfo,
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
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;
});
