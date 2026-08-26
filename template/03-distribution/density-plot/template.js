/**
 * @file template/03-distribution/density-plot/template.js
 * @description Standardized Universal density-plot Template for kit-charts.
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
    global.KitCharts['density-plot'] = exp;
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
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return '#2B8CBE'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function(t, r, o) { return {}; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function() { return {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function(t, o) { return {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return {}; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 03-distribution/density-plot/template.js
 * @description Template Chart.js v4+ pour Graphique de Densité Continue (Kernel Density Estimation - KDE).
 * Psychophysique: Encodage de fonction de densité de probabilité continue f(x) via courbe lisse et surface sous la courbe (Rang 1/2).
 * Règle d'or: beginAtZero: true sur l'axe Y, calcul authentique de KDE Gaussienne avec règle de Silverman pour la bande passante (bandwidth h).
 */



/**
 * Calcule l'estimation par noyau gaussien (Gaussian Kernel Density Estimation) sur un échantillon 1D.
 * f_hat(x) = (1 / (n * h)) * sum( K( (x - X_i) / h ) )
 * avec K(u) = (1 / sqrt(2 * pi)) * exp(-0.5 * u^2)
 *
 * @param {number[]} values - Échantillon de données continues
 * @param {number} [numPoints=60] - Nombre de points d'évaluation
 * @param {number} [bandwidthFactor=1.0] - Facteur d'ajustement du lissage
 * @returns {{ labels: string[], data: number[], points: {x: number, y: number}[], bandwidth: number }}
 */
function computeGaussianKDE(values, numPoints = 60, bandwidthFactor = 1.0) {
  if (!Array.isArray(values) || values.length === 0) {
    return { labels: [], data: [], points: [], bandwidth: 0 };
  }

  const valid = values.filter(v => typeof v === 'number' && Number.isFinite(v));
  if (valid.length === 0) {
    return { labels: [], data: [], points: [], bandwidth: 0 };
  }

  const n = valid.length;
  const sorted = [...valid].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[n - 1];

  // Calcul moyenne et écart-type
  const mean = valid.reduce((acc, v) => acc + v, 0) / n;
  const variance = valid.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (n > 1 ? n - 1 : 1);
  const std = Math.sqrt(variance) || 1.0;

  // Calcul IQR
  const q1 = sorted[Math.floor(n * 0.25)];
  const q3 = sorted[Math.floor(n * 0.75)];
  const iqr = q3 - q1;

  // Règle de Silverman: h = 0.9 * min(std, IQR / 1.34) * n^(-1/5)
  const spread = (iqr > 0 && iqr / 1.34 < std) ? (iqr / 1.34) : std;
  let h = 0.9 * spread * Math.pow(n, -0.2) * bandwidthFactor;
  if (h <= 0 || !Number.isFinite(h)) h = 1.0;

  // Plage d'évaluation étendue de [min - 3h, max + 3h]
  const xStart = min - 2.5 * h;
  const xEnd = max + 2.5 * h;
  const step = (xEnd - xStart) / (numPoints - 1);

  const SQRT_2PI = Math.sqrt(2 * Math.PI);
  const labels = [];
  const data = [];
  const points = [];

  for (let i = 0; i < numPoints; i++) {
    const x = xStart + i * step;
    let sumK = 0;

    for (let j = 0; j < n; j++) {
      const u = (x - valid[j]) / h;
      sumK += Math.exp(-0.5 * u * u) / SQRT_2PI;
    }

    const density = sumK / (n * h);
    labels.push(x.toFixed(1));
    data.push(density);
    points.push({ x, y: density });
  }

  return { labels, data, points, bandwidth: h };
}

/**
 * Données par défaut représentatives (Score d'évaluation de performance continue, N=200)
 */
const DEFAULT_DATA = (() => {
  // Génération synthétique bimodale représentative
  const points = [];
  for (let i = 0; i < 50; i++) {
    const x = i * 2;
    // Bimodal distribution (mix of 2 Gaussians)
    const g1 = (0.6 / (12 * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - 40) / 12, 2));
    const g2 = (0.4 / (10 * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - 70) / 10, 2));
    points.push({ x: x.toString(), y: g1 + g2 });
  }
  return {
    labels: points.map(p => p.x),
    datasets: [{
      label: 'Densité de Probabilité (KDE)',
      data: points.map(p => p.y)
    }]
  };
})();

/**
 * Crée et initialise un Graphique de Densité KDE dans le canvas cible.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément Canvas
 * @param {Object} [customData=null] - Données personnalisées
 * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème cognitif
 * @returns {Object} Instance Chart.js initialisée
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) {
    throw new Error(`Canvas element "${canvasTarget}" not found`);
  }

  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';

  const rawData = customData || DEFAULT_DATA;
  let chartLabels = [];
  let chartDatasets = [];

  const resolveDensityDatasetStyle = (ds, idx) => {
    if (ds.role || ds.emphasis) {
      const emp = getEmphasisStyle(tokens, ds.role || ds.emphasis, {
        fill: true,
        alpha: ds.fillAlpha ?? 0.2
      });
      return {
        borderColor: ds.borderColor || emp.borderColor,
        backgroundColor: ds.backgroundColor || emp.backgroundColor,
        borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : (emp.borderWidth || (isTufte ? 1.5 : 2.5)),
        borderDash: ds.borderDash || emp.borderDash || []
      };
    }
    if (ds.valence || ds.metricType || ds.direction !== undefined) {
      const vColor = getValenceColor(tokens, ds.direction ?? ds.delta ?? 0, ds.metricType || ds.valence || 'gain');
      return {
        borderColor: ds.borderColor || vColor,
        backgroundColor: ds.backgroundColor || hexToRgba(vColor, ds.fillAlpha ?? 0.2),
        borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : (isTufte ? 1.5 : 2.5),
        borderDash: ds.borderDash || []
      };
    }
    const color = getColor(tokens, idx);
    return {
      borderColor: ds.borderColor || color,
      backgroundColor: ds.backgroundColor || (ds.fill !== false ? hexToRgba(color, ds.fillAlpha ?? 0.2) : color),
      borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : (isTufte ? 1.5 : 2.5),
      borderDash: ds.borderDash || []
    };
  };

  if (Array.isArray(rawData)) {
    const kde = computeGaussianKDE(rawData);
    chartLabels = kde.labels;
    chartDatasets = [{
      label: 'Densité estimée (KDE)',
      data: kde.data,
      borderColor: tokens.palette[0],
      backgroundColor: hexToRgba(tokens.palette[0], 0.2)
    }];
  } else {
    chartLabels = rawData.labels ? [...rawData.labels] : [];
    chartDatasets = (rawData.datasets || []).map((ds, idx) => {
      const style = resolveDensityDatasetStyle(ds, idx);
      if (Array.isArray(ds.rawValues) && ds.rawValues.length > 0) {
        const kde = computeGaussianKDE(ds.rawValues);
        chartLabels = kde.labels;
        return {
          label: ds.label || `Densité Série ${idx + 1}`,
          data: kde.data,
          borderColor: style.borderColor,
          backgroundColor: style.backgroundColor,
          borderWidth: style.borderWidth,
          borderDash: style.borderDash,
          fill: ds.fill !== undefined ? ds.fill : 'origin',
          tension: 0.35,
          pointRadius: 0,
          pointHoverRadius: 5
        };
      }

      return {
        label: ds.label || `Densité Série ${idx + 1}`,
        data: Array.isArray(ds.data) ? [...ds.data] : [],
        borderColor: style.borderColor,
        backgroundColor: style.backgroundColor,
        borderWidth: style.borderWidth,
        borderDash: style.borderDash,
        fill: ds.fill !== undefined ? ds.fill : 'origin',
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: 5
      };
    });
  }

  const chartData = {
    labels: chartLabels,
    datasets: chartDatasets
  };

  const defaultOpts = getChartDefaultOptions(tokens);
  const spatialOpts = getSpatialInteractionOptions(tokens, { mode: 'nearest', axis: 'x', hitRadius: 14, hoverRadius: 7 });
  const animOpts = getAccessibleAnimationOptions(tokens, { duration: 450, easing: 'easeOutQuad' });

  const config = {
    type: 'line',
    data: chartData,
    options: {
      ...defaultOpts,
      ...spatialOpts,
      animation: animOpts,
      plugins: {
        ...defaultOpts.plugins,
        legend: {
          ...defaultOpts.plugins?.legend,
          display: chartDatasets.length > 1 && !isTufte
        },
        tooltip: {
          ...defaultOpts.plugins?.tooltip,
          titleFont: { family: tokens.fontFamily, size: 12, weight: '600' },
          bodyFont: { family: tokens.fontMono, size: 12, weight: '400' },
          callbacks: {
            title: (items) => {
              if (!items.length) return '';
              return `Valeur x : ${items[0].label}`;
            },
            label: (context) => {
              const val = context.parsed.y !== null && context.parsed.y !== undefined
                ? context.parsed.y
                : context.raw;
              const formatted = typeof val === 'number'
                ? val.toFixed(5)
                : val;
              return ` ${context.dataset.label || 'Densité'}: ${formatted}`;
            }
          }
        }
      },
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
            maxTicksLimit: 10,
            padding: 6
          }
        },
        y: {
          beginAtZero: true,
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
              if (typeof val === 'number') {
                return val.toFixed(3);
              }
              return val;
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function' && typeof Chart === 'function') {
    return new Chart(canvas, config);
  }

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
    getSpatialInteractionOptions: typeof getSpatialInteractionOptions === 'function' ? getSpatialInteractionOptions : null,
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;
});
