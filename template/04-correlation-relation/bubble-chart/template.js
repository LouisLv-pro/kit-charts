/**
 * @file template/04-correlation-relation/bubble-chart/template.js
 * @description Standardized Universal bubble-chart Template for kit-charts.
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
    global.KitCharts['bubble-chart'] = exp;
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
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 04-correlation-relation/bubble-chart/template.js
 * @description Template Chart.js v4+ pour Diagramme à Bulles Trivarié (Bubble Chart).
 * Psychophysique: Encodage trivarié (X, Y, Z) combinant double position orthogonale (Rang 1) et aire de surface circulaire (Rang 6).
 * Règle d'or: Proportionnalité stricte de l'aire au signal (r = k * sqrt(Z)) évitant l'exagération quadratique de surface (Facteur de distorsion de Tufte).
 */



/**
 * Calcule le rayon des bulles avec proportionnalité stricte à la racine carrée de Z (Aire = pi * r^2).
 * r = rMin + (rMax - rMin) * sqrt((z - zMin) / (zMax - zMin))
 *
 * @param {{x: number, y: number, z?: number, r?: number, label?: string}[]} points - Tableau de points avec grandeur Z
 * @param {number} [minRadius=4] - Rayon minimal en pixels
 * @param {number} [maxRadius=28] - Rayon maximal en pixels
 * @returns {{x: number, y: number, r: number, z: number, label?: string}[]} Points normalisés
 */
function computeBubbleRadii(points, minRadius = 4, maxRadius = 28) {
  if (!Array.isArray(points) || points.length === 0) return [];

  const valid = points.map(p => {
    if (typeof p !== 'object' || p === null) return { x: 0, y: 0, z: 0, r: minRadius };
    const zVal = typeof p.z === 'number' ? p.z : (typeof p.r === 'number' ? Math.pow(p.r, 2) : 10);
    return { ...p, z: zVal };
  });

  const zValues = valid.map(p => Math.max(0, p.z));
  const minZ = Math.min(...zValues);
  const maxZ = Math.max(...zValues);
  const rangeZ = maxZ - minZ;

  return valid.map(p => {
    let r = minRadius;
    if (rangeZ > 0) {
      const normSqrt = Math.sqrt((p.z - minZ) / rangeZ);
      r = minRadius + (maxRadius - minRadius) * normSqrt;
    } else if (typeof p.r === 'number' && p.r > 0) {
      r = p.r;
    } else {
      r = (minRadius + maxRadius) / 2;
    }

    return {
      ...p,
      x: p.x,
      y: p.y,
      r: Math.round(r * 10) / 10,
      z: p.z
    };
  });
}

/**
 * Données par défaut représentatives (PIB par hab en k$ vs Espérance de vie vs Population en Millions)
 */
const DEFAULT_DATA = {
  datasets: [{
    label: 'Marchés Mondiaux (N=12)',
    data: [
      { x: 12.5, y: 72.1, z: 1420, label: 'Inde' },
      { x: 21.4, y: 77.4, z: 1410, label: 'Chine' },
      { x: 76.3, y: 79.2, z: 335, label: 'États-Unis' },
      { x: 17.8, y: 75.8, z: 215, label: 'Brésil' },
      { x: 44.2, y: 82.5, z: 125, label: 'Japon' },
      { x: 54.1, y: 81.3, z: 84, label: 'Allemagne' },
      { x: 48.6, y: 83.0, z: 68, label: 'France' },
      { x: 51.2, y: 81.8, z: 67, label: 'Royaume-Uni' },
      { x: 38.9, y: 83.2, z: 59, label: 'Italie' },
      { x: 34.5, y: 83.6, z: 48, label: 'Espagne' },
      { x: 62.4, y: 82.1, z: 38, label: 'Canada' },
      { x: 65.8, y: 83.3, z: 26, label: 'Australie' }
    ]
  }]
};

/**
 * Crée et initialise un Diagramme à Bulles dans le canvas cible.
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
  const resolveBubbleDatasetStyle = (ds, idx) => {
    if (ds.role || ds.emphasis) {
      const emp = getEmphasisStyle(tokens, ds.role || ds.emphasis, { fill: true, alpha: 0.6 });
      return {
        bg: ds.backgroundColor || emp.backgroundColor,
        border: ds.borderColor || emp.borderColor,
        borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : (emp.borderWidth || 1.5)
      };
    }
    if (ds.valence || ds.metricType || ds.direction !== undefined) {
      const vColor = getValenceColor(tokens, ds.direction ?? ds.delta ?? 0, ds.metricType || ds.valence || 'gain');
      return {
        bg: ds.backgroundColor || hexToRgba(vColor, 0.6),
        border: ds.borderColor || vColor,
        borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : 1.5
      };
    }
    const color = getColor(tokens, idx);
    return {
      bg: ds.backgroundColor || hexToRgba(color, 0.6),
      border: ds.borderColor || (isTufte ? tokens.textPrimary : color),
      borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : 1.5
    };
  };

  const datasets = (rawData.datasets || []).map((ds, idx) => {
    const baseStyle = resolveBubbleDatasetStyle(ds, idx);
    let points = [];

    if (Array.isArray(ds.data)) {
      points = computeBubbleRadii(ds.data);
    }

    const hasPerPointRoles = points.some(p => p && (p.role || p.emphasis || p.anomaly)) || ds.highlightIndices || ds.anomalies;
    let bgColors = baseStyle.bg;
    let borderColors = baseStyle.border;
    let borderWidths = baseStyle.borderWidth;

    if (hasPerPointRoles) {
      bgColors = points.map((p, pIdx) => {
        if (p && (p.role === 'anomaly' || p.emphasis === 'anomaly' || p.anomaly) || (ds.anomalies && ds.anomalies.includes(pIdx))) {
          return hexToRgba(tokens.emphasis?.anomaly || '#D01C8B', 0.85);
        }
        if (p && (p.role === 'focal' || p.emphasis === 'focal') || (ds.highlightIndices && ds.highlightIndices.includes(pIdx))) {
          return hexToRgba(tokens.emphasis?.focal || getColor(tokens, 0), 0.85);
        }
        if (p && (p.role === 'context' || p.emphasis === 'context')) {
          return hexToRgba(tokens.emphasis?.context || '#CBD5E1', 0.35);
        }
        return baseStyle.bg;
      });

      borderColors = points.map((p, pIdx) => {
        if (p && (p.role === 'anomaly' || p.emphasis === 'anomaly' || p.anomaly) || (ds.anomalies && ds.anomalies.includes(pIdx))) {
          return tokens.emphasis?.anomaly || '#D01C8B';
        }
        if (p && (p.role === 'focal' || p.emphasis === 'focal') || (ds.highlightIndices && ds.highlightIndices.includes(pIdx))) {
          return tokens.emphasis?.focal || getColor(tokens, 0);
        }
        if (p && (p.role === 'context' || p.emphasis === 'context')) {
          return tokens.emphasis?.context || '#CBD5E1';
        }
        return baseStyle.border;
      });

      borderWidths = points.map((p, pIdx) => {
        if (p && (p.role === 'anomaly' || p.emphasis === 'anomaly' || p.anomaly || p.role === 'focal' || p.emphasis === 'focal')) {
          return 2.5;
        }
        return baseStyle.borderWidth;
      });
    }

    return {
      type: 'bubble',
      label: ds.label || `Série ${idx + 1}`,
      data: points,
      backgroundColor: bgColors,
      borderColor: borderColors,
      borderWidth: borderWidths,
      hoverBorderWidth: 2.5
    };
  });

  const chartData = { datasets };
  const defaultOpts = getChartDefaultOptions(tokens);
  const spatialOpts = getSpatialInteractionOptions(tokens, { mode: 'nearest', axis: 'xy', hitRadius: 14, hoverRadius: 7 });
  const animOpts = getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' });

  const config = {
    type: 'bubble',
    data: chartData,
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
              const raw = items[0].raw;
              return raw.label ? `${raw.label}` : `${items[0].dataset.label || 'Bulle'}`;
            },
            label: (context) => {
              const raw = context.raw;
              const xVal = context.parsed.x;
              const yVal = context.parsed.y;
              const zVal = raw.z !== undefined ? raw.z : Math.round(Math.pow(raw.r || 5, 2));
              const fmt = (v) => typeof v === 'number' ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(v) : v;
              return [
                ` Axe X: ${fmt(xVal)}`,
                ` Axe Y: ${fmt(yVal)}`,
                ` Grandeur Z (Aire): ${fmt(zVal)}`
              ];
            }
          }
        }
      },
      scales: {
        x: {
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
        y: {
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
