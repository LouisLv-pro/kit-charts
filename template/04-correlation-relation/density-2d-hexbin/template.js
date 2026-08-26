/**
 * @file template/04-correlation-relation/density-2d-hexbin/template.js
 * @description Standardized Universal density-2d-hexbin Template for kit-charts.
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
    global.KitCharts['density-2d-hexbin'] = exp;
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
 * @file 04-correlation-relation/density-2d-hexbin/template.js
 * @description Template Chart.js v4+ pour Densité 2D et Agrégation Spatiale Hexbin (2D Density / Hexagonal Binning).
 * Psychophysique: Résolution du sur-traçage massif (overplotting) par agrégation 2D et encodage séquentiel de densité (Rang 7 + Rang 1).
 * Plugin: chartjs-chart-matrix@2.0.1
 * Règle d'or: Échelle de couleur séquentielle logarithmique/linéaire continue, agrégation spatiale déterministe.
 */



/**
 * Agrège un grand échantillon de points continus (x, y) en une grille matricielle 2D de densité.
 *
 * @param {{x: number, y: number}[]} rawPoints - Échantillon de coordonnées continues
 * @param {number} [numXBins=10] - Nombre de classes en X
 * @param {number} [numYBins=10] - Nombre de classes en Y
 * @returns {{ data: {x: number, y: number, v: number}[], minX: number, maxX: number, minY: number, maxY: number, maxCount: number }}
 */
function compute2DBins(rawPoints, numXBins = 10, numYBins = 10) {
  if (!Array.isArray(rawPoints) || rawPoints.length === 0) {
    return { data: [], minX: 0, maxX: 10, minY: 0, maxY: 10, maxCount: 0 };
  }

  const valid = rawPoints.filter(p => typeof p === 'object' && p !== null && Number.isFinite(p.x) && Number.isFinite(p.y));
  if (valid.length === 0) {
    return { data: [], minX: 0, maxX: 10, minY: 0, maxY: 10, maxCount: 0 };
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const p of valid) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }

  const stepX = (maxX - minX) / numXBins || 1;
  const stepY = (maxY - minY) / numYBins || 1;

  const counts = {};
  let maxCount = 0;

  for (const p of valid) {
    let bx = Math.floor((p.x - minX) / stepX);
    let by = Math.floor((p.y - minY) / stepY);
    if (bx >= numXBins) bx = numXBins - 1;
    if (by >= numYBins) by = numYBins - 1;
    if (bx < 0) bx = 0;
    if (by < 0) by = 0;

    const key = `${bx}_${by}`;
    counts[key] = (counts[key] || 0) + 1;
    if (counts[key] > maxCount) maxCount = counts[key];
  }

  const data = [];
  for (let bx = 0; bx < numXBins; bx++) {
    for (let by = 0; by < numYBins; by++) {
      const key = `${bx}_${by}`;
      const c = counts[key] || 0;
      if (c > 0) {
        data.push({
          x: minX + (bx + 0.5) * stepX,
          y: minY + (by + 0.5) * stepY,
          v: c
        });
      }
    }
  }

  return { data, minX, maxX, minY, maxY, maxCount };
}

/**
 * Données par défaut représentatives (Agrégation 2D de N=1800 mesures biométriques : Taille cm x Poids kg)
 */
const DEFAULT_DATA = (() => {
  const points = [];
  const cols = 8;
  const rows = 8;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = 150 + i * 6 + 3;
      const y = 50 + j * 7 + 3.5;
      // Densité gaussienne bivariée centrée autour de (175 cm, 72 kg)
      const dx = (x - 175) / 12;
      const dy = (y - 72) / 14;
      const density = Math.exp(-0.5 * (dx * dx + dy * dy + 0.6 * dx * dy));
      const v = Math.round(density * 180 + (Math.sin(i + j) * 5) + 2);

      if (v > 0) {
        points.push({ x, y, v });
      }
    }
  }

  return {
    datasets: [{
      label: 'Densité Biométrique (Taille × Poids)',
      data: points
    }]
  };
})();

/**
 * Crée et initialise un Graphique de Densité 2D Hexbin dans le canvas cible.
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

  const maxVal = rawPoints.length > 0
    ? Math.max(...rawPoints.map(p => (typeof p === 'object' && p !== null ? (p.v ?? p.value ?? 0) : 0)), 1)
    : 100;
  const minVal = rawPoints.length > 0
    ? Math.min(...rawPoints.map(p => (typeof p === 'object' && p !== null ? (p.v ?? p.value ?? 0) : 0)), 0)
    : 0;

  const firstDs = rawData.datasets?.[0] || {};
  const dataset = {
    label: firstDs.label || 'Densité 2D',
    data: rawPoints,
    backgroundColor: (ctx) => {
      const raw = ctx.raw;
      if (raw && (raw.role || raw.emphasis)) {
        return getEmphasisStyle(tokens, raw.role || raw.emphasis).backgroundColor;
      }
      if (raw && raw.isAnomaly) {
        return tokens.emphasis?.anomaly || '#D01C8B';
      }
      const v = raw?.v ?? raw?.value ?? 0;
      if (firstDs.valence || firstDs.metricType) {
        const threshold = firstDs.threshold ?? (maxVal + minVal) / 2;
        return getValenceColor(tokens, v - threshold, firstDs.metricType || firstDs.valence || 'gain');
      }
      // Normalisation logarithmique pour contraster les fortes concentrations
      const ratio = maxVal > minVal
        ? Math.log(Math.max(1, v - minVal + 1)) / Math.log(Math.max(2, maxVal - minVal + 1))
        : 0.5;
      return getSequentialColor(tokens, ratio);
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
      return isTufte ? 0.5 : 1;
    },
    borderRadius: 2,
    width: ({ chart }) => {
      const area = chart.chartArea;
      if (!area) return 22;
      return (area.width / 9) - 2;
    },
    height: ({ chart }) => {
      const area = chart.chartArea;
      if (!area) return 22;
      return (area.height / 9) - 2;
    }
  };

  const chartData = { datasets: [dataset] };
  const defaultOpts = getChartDefaultOptions(tokens);
  const spatialOpts = getSpatialInteractionOptions(tokens, { mode: 'nearest', axis: 'xy', hitRadius: 14, hoverRadius: 7 });
  const animOpts = getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' });

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
              return `Alvéole (X: ${r.x}, Y: ${r.y})`;
            },
            label: (context) => {
              const r = context.raw;
              const v = r?.v ?? r?.value ?? 0;
              const formatted = typeof v === 'number'
                ? new Intl.NumberFormat('fr-FR').format(v)
                : v;
              return ` Décompte: ${formatted} observations`;
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
