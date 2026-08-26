/**
 * @file template/04-correlation-relation/matrix-heatmap/template.js
 * @description Standardized Universal matrix-heatmap Template for kit-charts.
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
    global.KitCharts['matrix-heatmap'] = exp;
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
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 04-correlation-relation/matrix-heatmap/template.js
 * @description Template Chart.js v4+ pour Matrice de Corrélation / Heatmap Matricielle (Correlation Matrix).
 * Psychophysique: Encodage de coefficients de dépendance bivariée r dans [-1.0, +1.0] par palette divergente symétrique (Rang 7 Cleveland-McGill + Grille 2D).
 * Plugin: chartjs-chart-matrix@2.0.1
 * Règle d'or: Échelle de couleur divergente strictement symétrique centrée sur r=0, étiquetage tabulaire précis dans l'infobulle.
 */



/**
 * Calcule la couleur divergente interpolée pour un coefficient de corrélation r dans [-1, +1].
 *
 * @param {number} r - Coefficient de corrélation dans [-1.0, +1.0]
 * @param {Object} tokens - Tokens du thème actif
 * @returns {string} Chaîne de couleur CSS (RGBA ou Hex)
 */
function getDivergentCorrelationColor(r, tokens) {
  const clamped = Math.max(-1, Math.min(1, Number(r) || 0));
  const div = tokens.divergent || { neg: '#CA0020', mid: '#FFFFFF', pos: '#0571B0' };

  if (clamped >= 0) {
    const alpha = Math.max(0.08, Math.min(1, clamped));
    // Extraction ou fallback couleur positive
    const posHex = div.pos || tokens.palette[0] || '#2B8CBE';
    return hexToRgba(posHex, alpha);
  } else {
    const alpha = Math.max(0.08, Math.min(1, Math.abs(clamped)));
    const negHex = div.neg || tokens.semantic?.negative || '#CA0020';
    return hexToRgba(negHex, alpha);
  }
}

/**
 * Convertit une couleur Hex en chaîne RGBA avec opacité alpha.
 */
function hexToRgba(hex, alpha) {
  if (!hex || typeof hex !== 'string') return `rgba(43, 140, 190, ${alpha})`;
  if (hex.startsWith('rgba(') || hex.startsWith('rgb(')) return hex;
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return `rgba(43, 140, 190, ${alpha})`;
}

/**
 * Données par défaut représentatives (Matrice de corrélation multi-actifs financiers)
 */
const DEFAULT_DATA = (() => {
  const vars = ['Actions US', 'Actions EU', 'Obligations', 'Or', 'Pétrole', 'Immobilier'];
  const matrixValues = [
    [ 1.00,  0.82, -0.35,  0.12,  0.45,  0.64],
    [ 0.82,  1.00, -0.28,  0.18,  0.52,  0.58],
    [-0.35, -0.28,  1.00,  0.42, -0.15, -0.22],
    [ 0.12,  0.18,  0.42,  1.00,  0.25,  0.08],
    [ 0.45,  0.52, -0.15,  0.25,  1.00,  0.38],
    [ 0.64,  0.58, -0.22,  0.08,  0.38,  1.00]
  ];

  const data = [];
  for (let r = 0; r < vars.length; r++) {
    for (let c = 0; c < vars.length; c++) {
      data.push({
        x: vars[c],
        y: vars[r],
        v: matrixValues[r][c]
      });
    }
  }

  return {
    labels: vars,
    datasets: [{
      label: 'Corrélation Inter-Actifs',
      data
    }]
  };
})();

/**
 * Crée et initialise une Matrice de Corrélation Heatmap dans le canvas cible.
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
  const rawPoints = rawData.datasets?.[0]?.data || [];

  // Extraction unique des étiquettes de lignes et colonnes
  let xLabels = [];
  let yLabels = [];

  if (Array.isArray(rawData.labels)) {
    xLabels = [...rawData.labels];
    yLabels = [...rawData.labels];
  } else {
    const xSet = new Set();
    const ySet = new Set();
    rawPoints.forEach(p => {
      if (p.x !== undefined) xSet.add(String(p.x));
      if (p.y !== undefined) ySet.add(String(p.y));
    });
    xLabels = Array.from(xSet);
    yLabels = Array.from(ySet);
    if (xLabels.length === 0) xLabels = ['A', 'B', 'C'];
    if (yLabels.length === 0) yLabels = ['A', 'B', 'C'];
  }

  const firstDs = rawData.datasets?.[0] || {};
  const dataset = {
    label: firstDs.label || 'Matrice de Corrélation',
    data: rawPoints,
    backgroundColor: (ctx) => {
      const raw = ctx.raw;
      if (raw && (raw.role || raw.emphasis)) {
        return getEmphasisStyle(tokens, raw.role || raw.emphasis).backgroundColor;
      }
      if (raw && raw.isAnomaly) {
        return tokens.emphasis?.anomaly || '#D01C8B';
      }
      const val = raw?.v ?? raw?.value ?? 0;
      if (firstDs.valence || firstDs.metricType) {
        return getValenceColor(tokens, val, firstDs.metricType || firstDs.valence || 'gain');
      }
      return getDivergentCorrelationColor(val, tokens);
    },
    borderColor: (ctx) => {
      const raw = ctx.raw;
      if (raw && (raw.role === 'focal' || raw.emphasis === 'focal')) {
        return tokens.emphasis?.focal || tokens.textPrimary;
      }
      if (raw && (raw.role === 'anomaly' || raw.isAnomaly)) {
        return tokens.emphasis?.anomaly || '#D01C8B';
      }
      return isTufte ? tokens.textPrimary : tokens.surface;
    },
    borderWidth: (ctx) => {
      const raw = ctx.raw;
      if (raw && (raw.role === 'focal' || raw.role === 'anomaly' || raw.isAnomaly)) {
        return 2.5;
      }
      return isTufte ? 0.5 : 1.5;
    },
    borderRadius: 3,
    width: ({ chart }) => {
      const area = chart.chartArea;
      if (!area) return 24;
      const count = Math.max(1, xLabels.length);
      return (area.width / count) - 3;
    },
    height: ({ chart }) => {
      const area = chart.chartArea;
      if (!area) return 24;
      const count = Math.max(1, yLabels.length);
      return (area.height / count) - 3;
    }
  };

  const chartData = { datasets: [dataset] };
  const defaultOpts = getChartDefaultOptions(tokens);
  const spatialOpts = getSpatialInteractionOptions(tokens, { mode: 'nearest', axis: 'xy', hitRadius: 10, hoverRadius: 5 });
  const animOpts = getAccessibleAnimationOptions(tokens, { duration: 350, easing: 'easeOutQuad' });

  const config = {
    type: 'matrix',
    data: chartData,
    options: {
      ...defaultOpts,
      ...spatialOpts,
      animation: animOpts,
      plugins: {
        ...defaultOpts.plugins,
        legend: { display: false },
        tooltip: {
          ...defaultOpts.plugins?.tooltip,
          titleFont: { family: tokens.fontFamily, size: 12, weight: '600' },
          bodyFont: { family: tokens.fontMono, size: 12, weight: '400' },
          callbacks: {
            title: (items) => {
              if (!items.length) return '';
              const r = items[0].raw;
              return `${r.x} × ${r.y}`;
            },
            label: (context) => {
              const r = context.raw;
              const v = r?.v ?? r?.value ?? 0;
              const sign = v > 0 ? '+' : '';
              const fmt = typeof v === 'number' ? `${sign}${v.toFixed(2)}` : v;
              return ` Corrélation (r): ${fmt}`;
            }
          }
        }
      },
      scales: {
        x: {
          type: 'category',
          labels: xLabels,
          grid: { display: false },
          border: { display: false },
          ticks: {
            color: tokens.textPrimary,
            font: {
              family: tokens.fontFamily,
              weight: '600',
              size: 11
            },
            padding: 6
          }
        },
        y: {
          type: 'category',
          labels: yLabels,
          grid: { display: false },
          border: { display: false },
          ticks: {
            color: tokens.textPrimary,
            font: {
              family: tokens.fontFamily,
              weight: '600',
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
    getDivergentCorrelationColor: typeof getDivergentCorrelationColor === 'function' ? getDivergentCorrelationColor : null,
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
