/**
 * @file template/05-evolution-temporelle/area-chart/template.js
 * @description Standardized Universal area-chart Template for kit-charts.
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
    global.KitCharts['area-chart'] = exp;
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
 * @file 05-evolution-temporelle/area-chart/template.js
 * @description Standardized Area Chart template for kit-charts.
 * Encodes cumulative single/multi-series volume under a continuous temporal curve.
 * Enforces strict Y=0 baseline origin (Cleveland-McGill magnitude rule) and semantic emphasis tokens.
 */

/**
 * Données par défaut représentatives (Volume mensuel de données réseau en To et projection)
 */
const DEFAULT_DATA = {
  labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
  datasets: [{
    label: 'Volume Données Réseau (To)',
    data: [120, 135, 150, 165, 180, 210, 240, 260, 290, 310, 340, 380],
    role: 'focal'
  }]
};

/**
 * Creates and renders an Area Chart in the specified canvas target.
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
    const role = ds.role || (ds.forecast ? 'forecast' : (idx === 0 ? 'focal' : 'context'));
    const isForecast = role === 'forecast' || Boolean(ds.forecast);
    const alpha = ds.alpha ?? (isForecast ? (tokens.emphasis?.forecastAlpha || 0.4) : (isTufte ? 0.15 : 0.25));

    let baseColor = getColor(tokens, idx);
    if (ds.valence && ds.metricType) {
      baseColor = getValenceColor(tokens, ds.valence, ds.metricType);
    } else if (ds.valence) {
      baseColor = getValenceColor(tokens, ds.valence, 'gain');
    }

    const emphasisStyle = getEmphasisStyle(tokens, role, {
      fill: true,
      alpha,
      fillAlpha: ds.fillAlpha ?? alpha * 0.5,
      borderColor: ds.borderColor || (ds.valence ? baseColor : undefined),
      borderWidth: ds.borderWidth ?? (isTufte ? 1.5 : (role === 'focal' ? 2.5 : 1.5))
    });

    const border = ds.borderColor || emphasisStyle.borderColor || baseColor;
    const bg = ds.backgroundColor || (typeof emphasisStyle.backgroundColor === 'string'
      ? emphasisStyle.backgroundColor
      : hexToRgba(border, alpha));

    return {
      label: ds.label || `Série ${idx + 1}`,
      data: Array.isArray(ds.data) ? [...ds.data] : [],
      borderColor: border,
      backgroundColor: bg,
      borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : emphasisStyle.borderWidth,
      borderDash: ds.borderDash || emphasisStyle.borderDash || (isForecast ? [5, 5] : []),
      tension: typeof ds.tension === 'number' ? ds.tension : 0.3,
      fill: ds.fill !== undefined ? ds.fill : 'origin',
      pointRadius: typeof ds.pointRadius === 'number' ? ds.pointRadius : (emphasisStyle.pointRadius ?? 3),
      pointHoverRadius: 6,
      pointStyle: ds.pointStyle || emphasisStyle.pointStyle || (isForecast ? 'crossRot' : 'circle'),
      pointBackgroundColor: ds.pointBackgroundColor || emphasisStyle.pointBackgroundColor || border,
      pointBorderColor: ds.pointBorderColor || emphasisStyle.pointBorderColor || tokens.bg,
      pointBorderWidth: ds.pointBorderWidth ?? 1.5
    };
  });

  const chartData = { labels, datasets };
  const baseOptions = getChartDefaultOptions(tokens);
  const temporalOpts = getTemporalInteractionOptions(tokens, { mode: 'index', axis: 'x', hitRadius: 12, hoverRadius: 6 });
  const animOpts = getAccessibleAnimationOptions(tokens, { duration: 450, easing: 'easeOutQuad' });

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
          beginAtZero: true, // Strict psychophysical mandate for area-encoded charts
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
            label: (context) => {
              const val = context.parsed.y !== null && context.parsed.y !== undefined
                ? context.parsed.y
                : context.raw;
              const formatted = typeof val === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(val)
                : val;
              const isForecastDs = context.dataset.borderDash && context.dataset.borderDash.length > 0;
              const suffix = isForecastDs ? ' (Projection)' : '';
              return ` ${context.dataset.label || ''}: ${formatted}${suffix}`;
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
