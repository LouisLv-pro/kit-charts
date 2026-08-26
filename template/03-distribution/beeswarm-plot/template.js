/**
 * @file template/03-distribution/beeswarm-plot/template.js
 * @description Standardized Universal beeswarm-plot Template for kit-charts.
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
    global.KitCharts['beeswarm-plot'] = exp;
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
 * @file 03-distribution/beeswarm-plot/template.js
 * @description Template Chart.js v4+ pour Essaim de Points Non-Chevauchants (Beeswarm Swarm Plot).
 * Psychophysique: Encodage 1D individuel exact combiné à une compacité d'essaim (packing) révélant la densité locale sans aucun chevauchement.
 * Règle d'or: Algorithme d'empilement déterministe par force/collision assurant une distance minimale garantie entre chaque point.
 */



/**
 * Calcule un positionnement d'essaim (beeswarm packing) déterministe et sans collision.
 *
 * @param {number[]} values - Valeurs d'observations Y
 * @param {number} categoryX - Position centrale sur l'axe X (ex: 1, 2, ...)
 * @param {number} [radiusY=1.5] - Rayon de collision effectif en unités Y
 * @param {number} [stepX=0.035] - Incrément de déplacement latéral
 * @returns {{x: number, y: number}[]} Points positionnés sans collision
 */
function computeBeeswarmLayout(values, categoryX, radiusY = 1.5, stepX = 0.035) {
  if (!Array.isArray(values) || values.length === 0) return [];

  const valid = values.map(v => typeof v === 'number' ? v : (v?.y ?? 0)).filter(v => Number.isFinite(v));
  if (valid.length === 0) return [];

  // Tri pour empilement cohérent
  const sorted = [...valid].sort((a, b) => a - b);
  const placed = [];

  const yRange = (sorted[sorted.length - 1] - sorted[0]) || 1;
  const effectiveRadiusY = radiusY || (yRange / 40);

  for (let i = 0; i < sorted.length; i++) {
    const y = sorted[i];
    let bestX = categoryX;
    let found = false;

    // Tester l'axe central puis les décalages alternés gauche / droite
    let k = 0;
    while (!found && k < 100) {
      const offset = (k === 0) ? 0 : (k % 2 === 1 ? 1 : -1) * Math.ceil(k / 2) * stepX;
      const candX = categoryX + offset;

      let collides = false;
      for (const p of placed) {
        const dy = Math.abs(p.y - y);
        const dx = Math.abs(p.x - candX);
        // Distance normalisée elliptique (ratio hauteur/largeur d'affichage)
        const distSq = Math.pow(dx / stepX, 2) + Math.pow(dy / effectiveRadiusY, 2);
        if (distSq < 1.0) {
          collides = true;
          break;
        }
      }

      if (!collides) {
        bestX = candX;
        found = true;
      }
      k++;
    }

    placed.push({ x: bestX, y });
  }

  return placed;
}

/**
 * Données par défaut représentatives (Scores de test d'utilisabilité par cohorte, N=120)
 */
const DEFAULT_DATA = (() => {
  const genVals = (count, mean, std) => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      // Approximation normale déterministe
      const z = (Math.sin(i * 1.7) + Math.cos(i * 2.3) + Math.sin(i * 3.1)) / 1.7;
      arr.push(Math.round((mean + z * std) * 10) / 10);
    }
    return arr;
  };

  const v1 = genVals(40, 42, 7.5);
  const v2 = genVals(40, 68, 9.0);
  const v3 = genVals(40, 55, 8.0);

  return {
    categories: ['Design Système A', 'Design Système B', 'Design Système C'],
    datasets: [
      {
        label: 'Design Système A',
        data: computeBeeswarmLayout(v1, 1, 1.4, 0.035)
      },
      {
        label: 'Design Système B',
        data: computeBeeswarmLayout(v2, 2, 1.4, 0.035)
      },
      {
        label: 'Design Système C',
        data: computeBeeswarmLayout(v3, 3, 1.4, 0.035)
      }
    ]
  };
})();

/**
 * Crée et initialise un Beeswarm Plot dans le canvas cible.
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

  const resolveBeeswarmDatasetStyle = (ds, idx) => {
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
    const baseStyle = resolveBeeswarmDatasetStyle(ds, idx);
    let points = [];

    if (Array.isArray(ds.data)) {
      if (ds.data.length > 0 && typeof ds.data[0] === 'number') {
        points = computeBeeswarmLayout(ds.data, idx + 1);
      } else {
        points = ds.data;
      }
    }

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
      label: ds.label || `Essaim ${idx + 1}`,
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
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono,
            size: 12,
            weight: '400'
          },
          callbacks: {
            title: (items) => {
              if (!items.length) return '';
              const xVal = Math.round(items[0].parsed.x);
              const catLabel = categories[xVal - 1] || `Groupe ${xVal}`;
              return `${catLabel}`;
            },
            label: (context) => {
              const yVal = context.parsed.y;
              const formatted = typeof yVal === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(yVal)
                : yVal;
              return ` ${context.dataset.label || 'Point'}: ${formatted}`;
            }
          }
        }
      },
      scales: {
        x: {
          type: 'linear',
          min: 0.4,
          max: (categories.length || datasets.length) + 0.6,
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
