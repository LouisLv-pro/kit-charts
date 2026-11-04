/**
 * @file template/05-evolution-temporelle/streamgraph/template.js
 * @description Standardized Universal streamgraph Template for kit-charts.
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
    global.KitCharts['streamgraph'] = exp;
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
 * @file 05-evolution-temporelle/streamgraph/template.js
 * @description Standardized Streamgraph template for kit-charts.
 * Visualizes qualitative shifts in thematic volume over continuous time using organic, fluid splines.
 * Employs smooth Bézier tension (0.4), layered areas around a computed wiggle baseline (Byron & Wattenberg), and semantic emphasis tokens.
 */

/**
 * Données par défaut représentatives (Mentions thématiques dans les médias au fil du temps)
 */
const DEFAULT_DATA = {
  labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct'],
  datasets: [
    {
      label: 'Intelligence Artificielle',
      data: [30, 45, 70, 110, 140, 120, 90, 75, 85, 105],
      role: 'focal'
    },
    {
      label: 'Cybersécurité & Privacy',
      data: [60, 75, 100, 90, 70, 60, 80, 115, 130, 110],
      role: 'context'
    },
    {
      label: 'Cloud & DevOps',
      data: [80, 70, 55, 50, 65, 90, 110, 95, 70, 55],
      role: 'context'
    },
    {
      label: 'Blockchain & Web3',
      data: [40, 55, 65, 50, 30, 25, 35, 50, 45, 30],
      role: 'context'
    }
  ]
};

/**
 * Calcule la baseline (bord inférieur) d'un streamgraph.
 * 'wiggle' : algorithme de Byron & Wattenberg (minimise la variation de pente, équivalent d3.stackOffsetWiggle).
 * 'silhouette' : couches centrées autour de 0.
 * Dans les deux cas le résultat est recentré pour que la silhouette soit symétrique autour de 0.
 *
 * @param {number[][]} series - valeurs par couche (couche x temps)
 * @param {string} [offset='wiggle']
 * @returns {number[]} baseline par pas de temps
 */
function computeStreamBaseline(series, offset = 'wiggle') {
  const m = series.length ? series[0].length : 0;
  const n = series.length;
  const num = (v) => (typeof v === 'number' && isFinite(v) ? v : 0);
  const totals = [];
  for (let j = 0; j < m; j++) {
    let t = 0;
    for (let i = 0; i < n; i++) t += num(series[i][j]);
    totals.push(t);
  }
  const base = new Array(m).fill(0);
  if (offset === 'silhouette') {
    for (let j = 0; j < m; j++) base[j] = -totals[j] / 2;
    return base;
  }
  let y = 0;
  for (let j = 1; j < m; j++) {
    let s1 = 0;
    let s2 = 0;
    for (let i = 0; i < n; i++) {
      const cur = num(series[i][j]);
      const prev = num(series[i][j - 1]);
      let s3 = (cur - prev) / 2;
      for (let k = 0; k < i; k++) s3 += num(series[k][j]) - num(series[k][j - 1]);
      s1 += cur;
      s2 += s3 * cur;
    }
    base[j - 1] = y;
    if (s1) y -= s2 / s1;
  }
  if (m) base[m - 1] = y;
  // Recentrage : la ligne médiane moyenne de la silhouette est ramenée à 0.
  let meanMid = 0;
  for (let j = 0; j < m; j++) meanMid += base[j] + totals[j] / 2;
  meanMid = m ? meanMid / m : 0;
  return base.map((v) => v - meanMid);
}

/**
 * Creates and renders a Streamgraph in the specified canvas target.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - DOM Canvas ID or Canvas Element
 * @param {Object} [customData] - Optional user data payload
 * @param {string} [themeName='colorbrewer-accessible'] - Theme identifier
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

  const datasets = (rawData.datasets || []).map((ds, idx) => {
    const role = ds.role || (ds.forecast ? 'forecast' : (idx === 0 ? 'focal' : 'context'));
    const isForecast = role === 'forecast' || Boolean(ds.forecast);
    const alpha = ds.alpha ?? (isForecast ? (tokens.emphasis?.forecastAlpha || 0.4) : (isTufte ? 0.4 : 0.65));

    let baseColor = getColor(tokens, idx);
    if (ds.valence && ds.metricType) {
      baseColor = getValenceColor(tokens, ds.valence, ds.metricType);
    } else if (ds.valence) {
      baseColor = getValenceColor(tokens, ds.valence, 'gain');
    }

    const emphasisStyle = getEmphasisStyle(tokens, role, {
      fill: true,
      alpha,
      borderColor: ds.borderColor || (ds.valence ? baseColor : undefined),
      borderWidth: ds.borderWidth ?? (isTufte ? 1.0 : (role === 'focal' ? 2.0 : 1.0))
    });

    // Streamgraph : teinte catégorielle par couche (pas de grisage 'contexte'), chaque couche reste identifiable.
    const border = ds.borderColor || baseColor;
    const bg = ds.backgroundColor || hexToRgba(baseColor, isTufte ? 0.55 : 0.85);

    return {
      label: ds.label || `Série ${idx + 1}`,
      data: Array.isArray(ds.data) ? [...ds.data] : [],
      borderColor: border,
      backgroundColor: bg,
      borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : emphasisStyle.borderWidth,
      borderDash: ds.borderDash || emphasisStyle.borderDash || (isForecast ? [5, 5] : []),
      fill: ds.fill !== undefined ? ds.fill : true,
      tension: typeof ds.tension === 'number' ? ds.tension : 0.4,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointStyle: ds.pointStyle || emphasisStyle.pointStyle || (isForecast ? 'crossRot' : 'circle'),
      pointBackgroundColor: border,
      pointBorderColor: tokens.bg
    };
  });

  // Streamgraph : bords calculés ici (pas d'empilement Chart.js ancré à 0).
  // Dataset 0 = baseline invisible (bord inférieur), puis une courbe par couche = bord supérieur cumulé.
  const rawSeries = datasets.map((ds) => ds.data);
  const offsetMode = (options && options.offset) || rawData.offset || 'silhouette';
  const baseline = computeStreamBaseline(rawSeries, offsetMode);
  const round2 = (v) => Math.round(v * 100) / 100;
  const cumulative = baseline.slice();
  const layerDatasets = datasets.map((ds, idx) => {
    const upper = ds.data.map((v, j) => {
      cumulative[j] += (typeof v === 'number' && isFinite(v) ? v : 0);
      return round2(cumulative[j]);
    });
    return Object.assign({}, ds, {
      data: upper,
      rawValues: ds.data,
      fill: '-1'
    });
  });
  const baseDataset = {
    label: '__baseline',
    data: baseline.map(round2),
    borderWidth: 0,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    pointRadius: 0,
    pointHoverRadius: 0,
    fill: false,
    tension: 0.4,
    isStreamBaseline: true
  };
  const chartData = { labels, datasets: [baseDataset, ...layerDatasets] };
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
          display: false,
          grid: { display: false, drawBorder: false },
          border: { display: false },
          ticks: { display: false }
        }
      },
      plugins: {
        legend: {
          display: true && !isTufte,
          position: 'top',
          align: 'end',
          labels: {
            color: tokens.textPrimary,
            filter: (item, chartData) => !(chartData.datasets[item.datasetIndex] || {}).isStreamBaseline,
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
          filter: (item) => !item.dataset.isStreamBaseline,
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
              const rv = context.dataset.rawValues;
              const val = rv ? rv[context.dataIndex] : (context.parsed.y !== null && context.parsed.y !== undefined
                ? context.parsed.y
                : context.raw);
              const formatted = typeof val === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(val)
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
    computeStreamBaseline: computeStreamBaseline,
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
