/**
 * @file template/05-evolution-temporelle/candlestick-ohlc/template.js
 * @description Standardized Universal candlestick-ohlc Template for kit-charts.
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
    global.KitCharts['candlestick-ohlc'] = exp;
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
 * @file 05-evolution-temporelle/candlestick-ohlc/template.js
 * @description Standardized Candlestick (OHLC) Chart template for kit-charts.
 * Visualizes financial price intervals (Open, High, Low, Close) over continuous time.
 * Employs chartjs-chart-financial plugin, Luxon time scale adapter, and psychophysically calibrated semantic valence colors.
 */

/**
 * Données par défaut représentatives (Cours boursier journalier TECH EUR)
 */
const DEFAULT_DATA = {
  datasets: [{
    label: 'Action TECH EUR (OHLC)',
    data: [
      { x: new Date('2025-01-02').getTime(), o: 152.4, h: 156.8, l: 151.2, c: 155.6 },
      { x: new Date('2025-01-03').getTime(), o: 155.6, h: 161.0, l: 154.5, c: 159.8 },
      { x: new Date('2025-01-06').getTime(), o: 160.0, h: 162.5, l: 157.0, c: 158.2 },
      { x: new Date('2025-01-07').getTime(), o: 157.8, h: 159.4, l: 153.0, c: 154.5 },
      { x: new Date('2025-01-08').getTime(), o: 154.2, h: 158.0, l: 153.5, c: 157.1 },
      { x: new Date('2025-01-09').getTime(), o: 157.0, h: 164.2, l: 156.8, c: 163.5 },
      { x: new Date('2025-01-10').getTime(), o: 163.8, h: 167.0, l: 162.0, c: 166.4 },
      { x: new Date('2025-01-13').getTime(), o: 166.0, h: 168.5, l: 163.2, c: 164.0 },
      { x: new Date('2025-01-14').getTime(), o: 164.0, h: 165.5, l: 159.0, c: 160.2 },
      { x: new Date('2025-01-15').getTime(), o: 160.5, h: 163.8, l: 158.5, c: 162.9 }
    ],
    role: 'focal'
  }]
};

/**
 * Creates and renders a Candlestick OHLC Chart in the specified canvas target.
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
  const datasets = (rawData.datasets || []).map((ds, idx) => {
    const metricType = ds.metricType || 'gain';
    const upColor = getValenceColor(tokens, 'up', metricType);
    const downColor = getValenceColor(tokens, 'down', metricType);
    const neutralColor = tokens.status?.neutral || tokens.semantic?.neutral || '#94A3B8';

    const role = ds.role || (ds.forecast ? 'forecast' : 'focal');
    const isForecast = role === 'forecast' || Boolean(ds.forecast);
    const alpha = isForecast ? (tokens.emphasis?.forecastAlpha || 0.5) : 1.0;

    const colorConfig = {
      up: isForecast ? hexToRgba(upColor, alpha) : upColor,
      down: isForecast ? hexToRgba(downColor, alpha) : downColor,
      unchanged: isForecast ? hexToRgba(neutralColor, alpha) : neutralColor
    };

    return {
      label: ds.label || `Série ${idx + 1}`,
      data: Array.isArray(ds.data) ? [...ds.data] : [],
      color: ds.color || colorConfig,
      borderColor: ds.borderColor || colorConfig,
      backgroundColor: ds.backgroundColor || (role === 'focal' ? getColor(tokens, idx) : tokens.emphasis?.context || '#CBD5E1')
    };
  });

  const chartData = { datasets };
  const baseOptions = getChartDefaultOptions(tokens);
  const temporalOpts = getTemporalInteractionOptions(tokens, { mode: 'index', axis: 'x', hitRadius: 12, hoverRadius: 6 });
  const animOpts = getAccessibleAnimationOptions(tokens, { duration: 700, easing: 'easeOutCubic' });

  const config = {
    type: 'candlestick',
    data: chartData,
    options: {
      ...baseOptions,
      ...temporalOpts,
      animation: animOpts,
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'timeseries',
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
            padding: 8
          }
        }
      },
      plugins: {
        legend: {
          display: datasets.length > 1 && !isTufte,
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
            padding: 14
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
            label: (ctx) => {
              const raw = ctx.raw;
              if (raw && typeof raw === 'object') {
                const delta = raw.c - raw.o;
                const sign = delta >= 0 ? '+' : '';
                const pct = raw.o !== 0 ? ((delta / raw.o) * 100).toFixed(2) : '0.00';
                return [
                  ` O: ${raw.o} | H: ${raw.h} | L: ${raw.l} | C: ${raw.c}`,
                  ` Variation: ${sign}${delta.toFixed(2)} (${sign}${pct}%)`
                ];
              }
              return '';
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
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;
});
