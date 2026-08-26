/**
 * @file template/05-evolution-temporelle/sparkline/template.js
 * @description Standardized Universal sparkline Template for kit-charts.
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
    global.KitCharts['sparkline'] = exp;
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
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return {}; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 05-evolution-temporelle/sparkline/template.js
 * @description Standardized Sparkline template for kit-charts.
 * Ultra-compact, high Data-Ink micro trendline designed for executive KPI scorecards.
 * Eliminates axis chrome and legends to maximize cognitive signal density (Edward Tufte).
 */

/**
 * Données par défaut représentatives (Micro-tendance de taux de conversion en %)
 */
const DEFAULT_DATA = {
  labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  datasets: [{
    label: 'Taux de Conversion (%)',
    data: [3.2, 3.4, 3.1, 3.6, 3.8, 3.5, 4.0, 4.2, 3.9, 4.5, 4.8, 5.2],
    role: 'focal'
  }]
};

/**
 * Creates and renders a Sparkline in the specified canvas target.
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

  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels ? [...rawData.labels] : [];

  const datasets = (rawData.datasets || []).map((ds, idx) => {
    const role = ds.role || (ds.forecast ? 'forecast' : 'focal');
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
      borderWidth: ds.borderWidth ?? (isTufte ? 1.5 : 2.0)
    });

    const border = ds.borderColor || emphasisStyle.borderColor || baseColor;
    const bg = ds.backgroundColor || (typeof emphasisStyle.backgroundColor === 'string'
      ? emphasisStyle.backgroundColor
      : hexToRgba(border, 0.15));

    return {
      label: ds.label || `Série ${idx + 1}`,
      data: Array.isArray(ds.data) ? [...ds.data] : [],
      borderColor: border,
      backgroundColor: bg,
      borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : emphasisStyle.borderWidth,
      borderDash: ds.borderDash || emphasisStyle.borderDash || (isForecast ? [4, 4] : []),
      tension: typeof ds.tension === 'number' ? ds.tension : 0.25,
      fill: ds.fill !== undefined ? ds.fill : false,
      pointRadius: typeof ds.pointRadius === 'number' ? ds.pointRadius : (ctx) => {
        const count = ctx.chart?.data?.datasets?.[idx]?.data?.length || 12;
        return ctx.dataIndex === count - 1 ? 4 : 0;
      },
      pointHoverRadius: 5,
      pointStyle: ds.pointStyle || emphasisStyle.pointStyle || (isForecast ? 'crossRot' : 'circle'),
      pointBackgroundColor: ds.pointBackgroundColor || emphasisStyle.pointBackgroundColor || border,
      pointBorderColor: ds.pointBorderColor || emphasisStyle.pointBorderColor || tokens.bg,
      pointBorderWidth: ds.pointBorderWidth ?? 1.5
    };
  });

  const chartData = { labels, datasets };
  const baseOptions = getChartDefaultOptions(tokens);
  const temporalOpts = getTemporalInteractionOptions(tokens, { mode: 'index', axis: 'x', hitRadius: 10, hoverRadius: 5 });
  const animOpts = getAccessibleAnimationOptions(tokens, { duration: 300, easing: 'easeOutQuad' });

  const config = {
    type: 'line',
    data: chartData,
    options: {
      ...baseOptions,
      ...temporalOpts,
      animation: animOpts,
      responsive: true,
      maintainAspectRatio: false,
      events: ['mousemove', 'mouseout', 'touchstart', 'touchmove'],
      layout: {
        padding: { top: 4, bottom: 4, left: 2, right: 6 }
      },
      scales: {
        x: {
          display: false,
          grid: { display: false },
          border: { display: false }
        },
        y: {
          display: false,
          grid: { display: false },
          border: { display: false }
        }
      },
      plugins: {
        legend: {
          display: false // Sparkline rule: zero legend clutter
        },
        tooltip: {
          backgroundColor: tokens.tooltipBg,
          titleColor: tokens.tooltipText,
          bodyColor: tokens.tooltipText,
          borderColor: tokens.borderStrong,
          borderWidth: 1,
          padding: 8,
          cornerRadius: 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 11,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono,
            size: 11,
            weight: '500'
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
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;
});
