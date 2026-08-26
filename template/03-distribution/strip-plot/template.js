/**
 * @file template/03-distribution/strip-plot/template.js
 * @description Standardized Universal strip-plot Template for kit-charts.
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
    global.KitCharts['strip-plot'] = exp;
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
 * @file 03-distribution/strip-plot/template.js
 * @description Template Chart.js v4+ pour Graphique en Bandes de Points avec Jitter Déterministe (Strip / Jitter Plot).
 * Psychophysique: Affichage 100% granulaire des observations individuelles sans perte d'information (Rang 1 Cleveland-McGill).
 * Règle d'or: Générateur pseudo-aléatoire déterministe (Mulberry32 PRNG) pour un étalement spatial constant et reproductible.
 */



/**
 * Générateur PRNG Mulberry32 déterministe pour jitter reproductible sans effet stroboscopique.
 * @param {number} seed
 * @returns {() => number} Fonction retournant un float dans [0, 1[
 */
function createMulberry32(seed = 123456789) {
  let s = seed | 0;
  return function () {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Applique un étalement (jitter) 1D déterministe sur un tableau d'observations.
 *
 * @param {number[]} values - Valeurs d'observations Y
 * @param {number} categoryIndex - Indice de la catégorie sur l'axe X (1, 2, ...)
 * @param {number} [jitterWidth=0.28] - Largeur d'étalement maximale
 * @param {number} [seed=42] - Graine du générateur PRNG
 * @returns {{x: number, y: number}[]}
 */
function generateJitter(values, categoryIndex, jitterWidth = 0.28, seed = 42) {
  if (!Array.isArray(values)) return [];
  const rng = createMulberry32(seed + categoryIndex * 1000);
  return values.map(v => {
    const valY = typeof v === 'number' ? v : (v?.y ?? 0);
    const offset = (rng() - 0.5) * jitterWidth;
    return {
      x: categoryIndex + offset,
      y: valY
    };
  });
}

/**
 * Données par défaut représentatives (Score de récupération clinique, 3 cohortes, N=90)
 */
const DEFAULT_DATA = (() => {
  const rng = createMulberry32(98765);
  const genVals = (count, mean, std) => Array.from({ length: count }, () => {
    // Box-Muller transform
    const u1 = Math.max(1e-6, rng());
    const u2 = rng();
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return Math.round((mean + z * std) * 10) / 10;
  });

  const c1 = genVals(30, 45, 8);
  const c2 = genVals(30, 62, 11);
  const c3 = genVals(30, 54, 9);

  return {
    categories: ['Groupe A (Témoin)', 'Groupe B (Traitement 1)', 'Groupe C (Traitement 2)'],
    datasets: [
      {
        label: 'Groupe A (Témoin)',
        data: generateJitter(c1, 1, 0.26, 101)
      },
      {
        label: 'Groupe B (Traitement 1)',
        data: generateJitter(c2, 2, 0.26, 202)
      },
      {
        label: 'Groupe C (Traitement 2)',
        data: generateJitter(c3, 3, 0.26, 303)
      }
    ]
  };
})();

/**
 * Crée et initialise un Strip Plot dans le canvas cible.
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
  const categories = rawData.categories || (rawData.datasets || []).map(d => d.label || '');

  const resolveStripDatasetStyle = (ds, idx) => {
    if (ds.role || ds.emphasis) {
      const emp = getEmphasisStyle(tokens, ds.role || ds.emphasis);
      return {
        bg: ds.backgroundColor || emp.backgroundColor,
        border: ds.borderColor || emp.borderColor,
        borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : (emp.borderWidth || 1),
        pointStyle: ds.pointStyle || emp.pointStyle || 'circle',
        pointRadius: ds.pointRadius || (isTufte ? 3.5 : 4.5)
      };
    }
    if (ds.valence || ds.metricType || ds.direction !== undefined) {
      const vColor = getValenceColor(tokens, ds.direction ?? ds.delta ?? 0, ds.metricType || ds.valence || 'gain');
      return {
        bg: ds.backgroundColor || vColor,
        border: ds.borderColor || (isTufte ? tokens.textPrimary : vColor),
        borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : 1,
        pointStyle: ds.pointStyle || 'circle',
        pointRadius: ds.pointRadius || (isTufte ? 3.5 : 4.5)
      };
    }
    const color = getColor(tokens, idx);
    return {
      bg: ds.backgroundColor || color,
      border: ds.borderColor || (isTufte ? tokens.textPrimary : color),
      borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : 1,
      pointStyle: ds.pointStyle || 'circle',
      pointRadius: ds.pointRadius || (isTufte ? 3.5 : 4.5)
    };
  };

  const datasets = (rawData.datasets || []).map((ds, idx) => {
    const baseStyle = resolveStripDatasetStyle(ds, idx);
    const rawPoints = Array.isArray(ds.data) ? ds.data : [];
    const points = rawPoints.map((p, pIdx) => {
      if (typeof p === 'number') {
        const phi = 0.618033988749895;
        const jitterOffset = (((pIdx * phi) % 1) - 0.5) * 0.28;
        return { x: idx + 1 + jitterOffset, y: p };
      }
      return p;
    });

    const hasPerPointRoles = points.some(p => p && (p.role || p.emphasis || p.anomaly)) || ds.highlightIndices || ds.anomalies;
    let pointBackgroundColors = baseStyle.bg;
    let pointBorderColors = baseStyle.border;
    let pointStyles = baseStyle.pointStyle;
    let pointRadii = baseStyle.pointRadius;

    if (hasPerPointRoles) {
      pointBackgroundColors = points.map((p, pIdx) => {
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

      pointStyles = points.map((p, pIdx) => {
        if (p && (p.role === 'anomaly' || p.emphasis === 'anomaly' || p.anomaly) || (ds.anomalies && ds.anomalies.includes(pIdx))) {
          return 'triangle';
        }
        return baseStyle.pointStyle;
      });

      pointRadii = points.map((p, pIdx) => {
        if (p && (p.role === 'anomaly' || p.emphasis === 'anomaly' || p.anomaly) || (ds.anomalies && ds.anomalies.includes(pIdx))) {
          return 7;
        }
        if (p && (p.role === 'focal' || p.emphasis === 'focal') || (ds.highlightIndices && ds.highlightIndices.includes(pIdx))) {
          return 6;
        }
        return baseStyle.pointRadius;
      });
    }

    return {
      label: ds.label || `Série ${idx + 1}`,
      data: points,
      backgroundColor: pointBackgroundColors,
      borderColor: pointBorderColors,
      borderWidth: baseStyle.borderWidth,
      pointStyle: pointStyles,
      pointRadius: pointRadii,
      pointHoverRadius: 7,
      pointHitRadius: 14
    };
  });

  const chartData = { datasets };
  const defaultOpts = getChartDefaultOptions(tokens);
  const spatialOpts = getSpatialInteractionOptions(tokens, { mode: 'nearest', axis: 'xy', hitRadius: 14, hoverRadius: 7 });
  const animOpts = getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' });

  const config = {
    type: 'scatter',
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
              const xVal = Math.round(items[0].parsed.x);
              const catLabel = categories[xVal - 1] || `Catégorie ${xVal}`;
              return `${catLabel}`;
            },
            label: (context) => {
              const yVal = context.parsed.y;
              const formatted = typeof yVal === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(yVal)
                : yVal;
              return ` ${context.dataset.label || 'Obs'}: ${formatted}`;
            }
          }
        }
      },
      scales: {
        x: {
          type: 'linear',
          min: 0.5,
          max: (categories.length || datasets.length) + 0.5,
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            stepSize: 1,
            color: tokens.textPrimary,
            font: {
              family: tokens.fontFamily,
              weight: '600',
              size: 11
            },
            padding: 8,
            callback: (val) => {
              const idx = Math.round(val) - 1;
              return categories[idx] || '';
            }
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
