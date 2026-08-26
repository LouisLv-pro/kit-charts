/**
 * @file template/04-correlation-relation/scatter-plot/template.js
 * @description Standardized Universal scatter-plot Template for kit-charts.
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
    global.KitCharts['scatter-plot'] = exp;
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
  const suggestScale = (KitChartsTheme && KitChartsTheme.suggestScale) || (typeof window !== 'undefined' && window.suggestScale) || function() { return 'linear'; };
  const getLogScaleOptions = (KitChartsTheme && KitChartsTheme.getLogScaleOptions) || (typeof window !== 'undefined' && window.getLogScaleOptions) || function() { return { type: 'logarithmic' }; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function(t, o) { return {}; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';


/**
 * @file 04-correlation-relation/scatter-plot/template.js
 * @description Template Chart.js v4+ pour Nuage de Points Bivarié avec Droite de Tendance (Scatter Plot).
 * Psychophysique: Encodage de relation bidimensionnelle (X, Y) par double position sur échelles orthogonales (Rang 1 Cleveland-McGill).
 * Règle d'or: Calcul authentique de régression linéaire par moindres carrés (y = ax + b), coefficient de corrélation de Pearson (r) et R².
 */



/**
 * Calcule la droite de régression linéaire (moindres carrés ordinaires) et les métriques de corrélation.
 *
 * @param {{x: number, y: number}[]} points - Tableau de coordonnées bivariées
 * @returns {{ slope: number, intercept: number, r: number, r2: number, trendPoints: {x: number, y: number}[] }}
 */
function computeLinearRegression(points) {
  if (!Array.isArray(points) || points.length < 2) {
    return { slope: 0, intercept: 0, r: 0, r2: 0, trendPoints: [] };
  }

  const valid = points.filter(p => typeof p === 'object' && p !== null && Number.isFinite(p.x) && Number.isFinite(p.y));
  const n = valid.length;
  if (n < 2) {
    return { slope: 0, intercept: 0, r: 0, r2: 0, trendPoints: [] };
  }

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;
  let sumY2 = 0;
  let minX = Infinity;
  let maxX = -Infinity;

  for (const p of valid) {
    sumX += p.x;
    sumY += p.y;
    sumXY += p.x * p.y;
    sumX2 += p.x * p.x;
    sumY2 += p.y * p.y;
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
  }

  const denomX = n * sumX2 - sumX * sumX;
  const denomY = n * sumY2 - sumY * sumY;

  if (Math.abs(denomX) < 1e-12) {
    return { slope: 0, intercept: sumY / n, r: 0, r2: 0, trendPoints: [] };
  }

  const slope = (n * sumXY - sumX * sumY) / denomX;
  const intercept = (sumY - slope * sumX) / n;

  // Corrélation de Pearson r
  const denomR = Math.sqrt(Math.max(0, denomX * denomY));
  const r = denomR > 0 ? (n * sumXY - sumX * sumY) / denomR : 0;
  const r2 = r * r;

  const trendPoints = [
    { x: minX, y: slope * minX + intercept },
    { x: maxX, y: slope * maxX + intercept }
  ];

  return { slope, intercept, r, r2, trendPoints };
}

/**
 * Données par défaut représentatives (Dépenses R&D en % du CA vs Croissance annuelle du CA en %)
 */
const DEFAULT_DATA = {
  datasets: [{
    label: 'Entreprises Tech (N=16)',
    data: [
      { x: 4.2, y: 5.1 }, { x: 5.0, y: 7.4 }, { x: 6.1, y: 8.8 }, { x: 7.3, y: 11.2 },
      { x: 8.0, y: 10.5 }, { x: 9.2, y: 14.8 }, { x: 10.5, y: 16.0 }, { x: 11.8, y: 17.5 },
      { x: 12.4, y: 21.0 }, { x: 13.5, y: 22.4 }, { x: 14.8, y: 25.1 }, { x: 16.0, y: 28.5 },
      { x: 17.2, y: 29.0 }, { x: 18.5, y: 33.2 }, { x: 19.8, y: 35.8 }, { x: 21.0, y: 39.0 }
    ]
  }]
};

/**
 * Crée et initialise un Nuage de Points avec Droite de Tendance dans le canvas cible.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément Canvas
 * @param {Object} [customData=null] - Données personnalisées
 * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème cognitif
 * @returns {Object} Instance Chart.js initialisée
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
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

  let statHelpers;
  try {
    statHelpers = typeof require === 'function' ? require('../../../themes/stat-helpers.js') : (typeof window !== 'undefined' ? window.KitChartsStats : null);
  } catch (e) {
    try {
      statHelpers = typeof require === 'function' ? require('../../themes/stat-helpers.js') : (typeof window !== 'undefined' ? window.KitChartsStats : null);
    } catch (e2) {}
  }

  const ebOption = options.errorBars || (customData && customData.errorBars);
  if (ebOption && ebOption.confidence !== undefined) {
    if (typeof ebOption.confidence !== 'number' || ebOption.confidence < 0.80 || ebOption.confidence > 0.99) {
      throw new Error('kit-charts: confidence must be bounded to [0.80, 0.99]');
    }
  }

  const rawData = customData || DEFAULT_DATA;
  const datasets = [];

  const resolveScatterDatasetStyle = (ds, idx) => {
    if (ds.role || ds.emphasis) {
      const emp = getEmphasisStyle(tokens, ds.role || ds.emphasis);
      return {
        bg: ds.backgroundColor || emp.backgroundColor,
        border: ds.borderColor || emp.borderColor,
        borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : (emp.borderWidth || 1),
        pointStyle: ds.pointStyle || emp.pointStyle || 'circle',
        pointRadius: ds.pointRadius || (isTufte ? 3.5 : 5)
      };
    }
    if (ds.valence || ds.metricType || ds.direction !== undefined) {
      const vColor = getValenceColor(tokens, ds.direction ?? ds.delta ?? 0, ds.metricType || ds.valence || 'gain');
      return {
        bg: ds.backgroundColor || vColor,
        border: ds.borderColor || (isTufte ? tokens.textPrimary : vColor),
        borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : 1,
        pointStyle: ds.pointStyle || 'circle',
        pointRadius: ds.pointRadius || (isTufte ? 3.5 : 5)
      };
    }
    const color = getColor(tokens, idx);
    return {
      bg: ds.backgroundColor || color,
      border: ds.borderColor || (isTufte ? tokens.textPrimary : color),
      borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : 1,
      pointStyle: ds.pointStyle || 'circle',
      pointRadius: ds.pointRadius || (isTufte ? 3.5 : 5)
    };
  };

  (rawData.datasets || []).forEach((ds, idx) => {
    const baseStyle = resolveScatterDatasetStyle(ds, idx);
    const rawPoints = Array.isArray(ds.data) ? ds.data : [];

    const hasPerPointRoles = rawPoints.some(p => p && (p.role || p.emphasis || p.anomaly)) || ds.highlightIndices || ds.anomalies;
    let pointBackgroundColors = baseStyle.bg;
    let pointBorderColors = baseStyle.border;
    let pointStyles = baseStyle.pointStyle;
    let pointRadii = baseStyle.pointRadius;

    if (hasPerPointRoles) {
      pointBackgroundColors = rawPoints.map((p, pIdx) => {
        if (p && (p.role === 'anomaly' || p.emphasis === 'anomaly' || p.anomaly) || (ds.anomalies && ds.anomalies.includes(pIdx))) {
          return tokens.emphasis?.anomaly || '#D01C8B';
        }
        if (p && (p.role === 'focal' || p.emphasis === 'focal') || (ds.highlightIndices && ds.highlightIndices.includes(pIdx))) {
          return tokens.emphasis?.focal || getColor(tokens, 0);
        }
        if (p && (p.role === 'context' || p.emphasis === 'context')) {
          return tokens.emphasis?.context || '#CBD5E1';
        }
        return baseStyle.bg;
      });

      pointStyles = rawPoints.map((p, pIdx) => {
        if (p && (p.role === 'anomaly' || p.emphasis === 'anomaly' || p.anomaly) || (ds.anomalies && ds.anomalies.includes(pIdx))) {
          return 'triangle';
        }
        return baseStyle.pointStyle;
      });

      pointRadii = rawPoints.map((p, pIdx) => {
        if (p && (p.role === 'anomaly' || p.emphasis === 'anomaly' || p.anomaly) || (ds.anomalies && ds.anomalies.includes(pIdx))) {
          return 8;
        }
        if (p && (p.role === 'focal' || p.emphasis === 'focal') || (ds.highlightIndices && ds.highlightIndices.includes(pIdx))) {
          return 7;
        }
        return baseStyle.pointRadius;
      });
    }

    const errorBarsData = ds.errorBarsData || (ds.errorBars && ds.errorBars.explicit) || (ebOption && ebOption.explicit) || rawPoints.map(p => p?.errorBars || null);

    // Dataset principal : Nuage de points
    datasets.push({
      type: 'scatter',
      label: ds.label || `Série ${idx + 1}`,
      data: rawPoints,
      errorBarsData,
      backgroundColor: pointBackgroundColors,
      borderColor: pointBorderColors,
      borderWidth: baseStyle.borderWidth,
      pointStyle: pointStyles,
      pointRadius: pointRadii,
      pointHoverRadius: 7,
      pointHitRadius: 14
    });

    // Ajout automatique de la droite de régression linéaire si >= 10 points (Garde-fou Anscombe 1973)
    const minPointsForTrend = (options.minTrendPoints !== undefined) ? options.minTrendPoints : (ds.minTrendPoints !== undefined ? ds.minTrendPoints : 10);
    const shouldShowTrend = (rawPoints.length >= minPointsForTrend && ds.showTrend !== false) || (rawPoints.length >= 2 && ds.showTrend === true);
    if (shouldShowTrend) {
      const reg = computeLinearRegression(rawPoints);
      if (reg.trendPoints.length === 2) {
        const isSmallN = rawPoints.length < 10;
        const trendColor = tokens.emphasis?.benchmark || getColor(tokens, idx + 1) || tokens.textSecondary;
        datasets.push({
          type: 'line',
          label: isSmallN ? `Tendance (R² = ${reg.r2.toFixed(2)} — n < 10)` : `Tendance (R² = ${reg.r2.toFixed(2)})`,
          data: reg.trendPoints,
          borderColor: trendColor,
          borderWidth: isTufte ? 1.5 : 2,
          borderDash: [6, 6],
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: false,
          tension: 0
        });
      }
    }
  });

  const chartData = { datasets };
  const defaultOpts = getChartDefaultOptions(tokens);
  const spatialOpts = getSpatialInteractionOptions(tokens, { mode: 'nearest', axis: 'xy', hitRadius: 14, hoverRadius: 7 });
  const animOpts = getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' });

  const pluginsList = [];
  if (ebOption && statHelpers && statHelpers.errorBarsPlugin) {
    pluginsList.push(statHelpers.errorBarsPlugin);
  }

  const isYLogRequested = Boolean(options.logScale || options.logScaleY || (options.scales && options.scales.y && options.scales.y.type === 'logarithmic'));
  const isXLogRequested = Boolean(options.logScaleX || (options.scales && options.scales.x && options.scales.x.type === 'logarithmic'));

  if (isYLogRequested || isXLogRequested) {
    const rawPoints = (rawData.datasets || []).flatMap(ds => Array.isArray(ds.data) ? ds.data : []);
    if (isYLogRequested && rawPoints.some(p => p && typeof p.y === 'number' && p.y <= 0)) {
      throw new Error('kit-charts: log scale requires strictly positive values');
    }
    if (isXLogRequested && rawPoints.some(p => p && typeof p.x === 'number' && p.x <= 0)) {
      throw new Error('kit-charts: log scale requires strictly positive values');
    }
  }

  const config = {
    type: 'scatter',
    data: chartData,
    plugins: pluginsList,
    options: {
      ...defaultOpts,
      ...spatialOpts,
      animation: animOpts,
      plugins: {
        ...defaultOpts.plugins,
        legend: {
          ...defaultOpts.plugins?.legend,
          display: datasets.length > 1 && !isTufte
        },
        tooltip: {
          ...defaultOpts.plugins?.tooltip,
          titleFont: { family: tokens.fontFamily, size: 12, weight: '600' },
          bodyFont: { family: tokens.fontMono, size: 12, weight: '400' },
          callbacks: {
            title: (items) => {
              if (!items.length) return '';
              const ds = items[0].dataset;
              return `${ds.label || 'Observation'}`;
            },
            label: (context) => {
              const xVal = context.parsed.x;
              const yVal = context.parsed.y;
              const fmt = (v) => typeof v === 'number' ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(v) : v;
              const lines = [` (X: ${fmt(xVal)}, Y: ${fmt(yVal)})`];
              const pt = context.raw || {};
              const eb = pt.errorBars || (context.dataset.errorBarsData && context.dataset.errorBarsData[context.dataIndex]);
              if (eb && eb.low !== undefined && eb.high !== undefined) {
                lines.push(` IC95%: [${eb.low.toFixed(1)} — ${eb.high.toFixed(1)}]`);
              }
              return lines;
            }
          }
        }
      },
      scales: {
        x: isXLogRequested ? {
          ...getLogScaleOptions(tokens, typeof options.logScaleX === 'object' ? options.logScaleX : {}),
          border: { display: false }
        } : {
          type: 'linear',
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
            padding: 6
          }
        },
        y: isYLogRequested ? {
          ...getLogScaleOptions(tokens, typeof options.logScale === 'object' ? options.logScale : (typeof options.logScaleY === 'object' ? options.logScaleY : {})),
          border: { display: false }
        } : {
          type: 'linear',
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
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;
});
