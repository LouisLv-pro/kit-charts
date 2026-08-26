/**
 * @file template/04-correlation-relation/connected-scatter-plot/template.js
 * @description Standardized Universal connected-scatter-plot Template for kit-charts.
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
    global.KitCharts['connected-scatter-plot'] = exp;
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
 * @file 04-correlation-relation/connected-scatter-plot/template.js
 * @description Template Chart.js v4+ pour Nuage de Points Relié Temporel (Connected Scatter Plot).
 * Psychophysique: Encodage d'une trajectoire bivariée dynamique (X_t, Y_t) au fil du temps (Loi de Continuité Gestalt + Rang 1 Cleveland-McGill).
 * Règle d'or: Ligne ordonnée chronologiquement révélant les cycles d'hystérésis, points de mesure temporels explicites dans l'infobulle.
 */



/**
 * Données par défaut représentatives (Trajectoire Macroéconomique : Inflation % vs Chômage % sur 10 ans)
 */
const DEFAULT_DATA = {
  datasets: [{
    label: 'Courbe de Phillips Dynamique (2015-2024)',
    data: [
      { x: 9.8, y: 0.8, year: 2015 },
      { x: 9.4, y: 0.6, year: 2016 },
      { x: 8.8, y: 1.2, year: 2017 },
      { x: 8.2, y: 1.6, year: 2018 },
      { x: 7.9, y: 1.3, year: 2019 },
      { x: 8.5, y: 0.5, year: 2020 },
      { x: 7.6, y: 2.1, year: 2021 },
      { x: 7.1, y: 6.8, year: 2022 },
      { x: 7.2, y: 4.9, year: 2023 },
      { x: 7.4, y: 2.4, year: 2024 }
    ]
  }]
};

/**
 * Crée et initialise un Nuage de Points Relié dans le canvas cible.
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
  const resolveConnectedScatterStyle = (ds, idx) => {
    if (ds.role || ds.emphasis) {
      const emp = getEmphasisStyle(tokens, ds.role || ds.emphasis);
      return {
        lineColor: ds.borderColor || emp.borderColor,
        lineWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : (emp.borderWidth || (isTufte ? 1.5 : 2.5)),
        borderDash: ds.borderDash || emp.borderDash || [],
        pointBg: isTufte ? tokens.bg : (emp.pointBackgroundColor || tokens.surface),
        pointBorder: emp.pointBorderColor || emp.borderColor,
        pointRadius: ds.pointRadius || emp.pointRadius || (isTufte ? 4 : 5.5)
      };
    }
    if (ds.valence || ds.metricType || ds.direction !== undefined) {
      const vColor = getValenceColor(tokens, ds.direction ?? ds.delta ?? 0, ds.metricType || ds.valence || 'gain');
      return {
        lineColor: ds.borderColor || vColor,
        lineWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : (isTufte ? 1.5 : 2.5),
        borderDash: ds.borderDash || [],
        pointBg: isTufte ? tokens.bg : tokens.surface,
        pointBorder: vColor,
        pointRadius: ds.pointRadius || (isTufte ? 4 : 5.5)
      };
    }
    const color = getColor(tokens, idx);
    return {
      lineColor: ds.borderColor || color,
      lineWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : (isTufte ? 1.5 : 2.5),
      borderDash: ds.borderDash || [],
      pointBg: isTufte ? tokens.bg : tokens.surface,
      pointBorder: color,
      pointRadius: ds.pointRadius || (isTufte ? 4 : 5.5)
    };
  };

  const datasets = (rawData.datasets || []).map((ds, idx) => {
    const baseStyle = resolveConnectedScatterStyle(ds, idx);
    const points = Array.isArray(ds.data) ? ds.data : [];

    const hasPerPointRoles = points.some(p => p && (p.role || p.emphasis || p.anomaly)) || ds.highlightIndices || ds.anomalies;
    let pointBgColors = baseStyle.pointBg;
    let pointBorderColors = baseStyle.pointBorder;
    let pointStyles = 'circle';
    let pointRadii = baseStyle.pointRadius;

    if (hasPerPointRoles) {
      pointBgColors = points.map((p, pIdx) => {
        if (p && (p.role === 'anomaly' || p.emphasis === 'anomaly' || p.anomaly) || (ds.anomalies && ds.anomalies.includes(pIdx))) {
          return tokens.emphasis?.anomaly || '#D01C8B';
        }
        if (p && (p.role === 'focal' || p.emphasis === 'focal') || (ds.highlightIndices && ds.highlightIndices.includes(pIdx))) {
          return tokens.emphasis?.focal || getColor(tokens, 0);
        }
        if (p && (p.role === 'context' || p.emphasis === 'context')) {
          return tokens.emphasis?.context || '#CBD5E1';
        }
        return baseStyle.pointBg;
      });

      pointBorderColors = points.map((p, pIdx) => {
        if (p && (p.role === 'anomaly' || p.emphasis === 'anomaly' || p.anomaly) || (ds.anomalies && ds.anomalies.includes(pIdx))) {
          return tokens.emphasis?.anomaly || '#D01C8B';
        }
        if (p && (p.role === 'focal' || p.emphasis === 'focal') || (ds.highlightIndices && ds.highlightIndices.includes(pIdx))) {
          return tokens.emphasis?.focal || getColor(tokens, 0);
        }
        if (p && (p.role === 'context' || p.emphasis === 'context')) {
          return tokens.emphasis?.context || '#CBD5E1';
        }
        return baseStyle.pointBorder;
      });

      pointStyles = points.map((p, pIdx) => {
        if (p && (p.role === 'anomaly' || p.emphasis === 'anomaly' || p.anomaly) || (ds.anomalies && ds.anomalies.includes(pIdx))) {
          return 'triangle';
        }
        return 'circle';
      });

      pointRadii = points.map((p, pIdx) => {
        if (p && (p.role === 'anomaly' || p.emphasis === 'anomaly' || p.anomaly) || (ds.anomalies && ds.anomalies.includes(pIdx))) {
          return 8;
        }
        if (p && (p.role === 'focal' || p.emphasis === 'focal') || (ds.highlightIndices && ds.highlightIndices.includes(pIdx))) {
          return 7;
        }
        return baseStyle.pointRadius;
      });
    }

    return {
      type: 'line',
      label: ds.label || `Trajectoire ${idx + 1}`,
      data: points,
      borderColor: baseStyle.lineColor,
      backgroundColor: ds.backgroundColor || baseStyle.lineColor,
      borderDash: baseStyle.borderDash,
      borderWidth: baseStyle.lineWidth,
      pointBackgroundColor: pointBgColors,
      pointBorderColor: pointBorderColors,
      pointBorderWidth: isTufte ? 1.5 : 2.5,
      pointStyle: pointStyles,
      pointRadius: pointRadii,
      pointHoverRadius: 8.5,
      pointHitRadius: 12,
      fill: false,
      showLine: true,
      tension: 0.15
    };
  });

  const chartData = { datasets };
  const defaultOpts = getChartDefaultOptions(tokens);
  const spatialOpts = getSpatialInteractionOptions(tokens, { mode: 'nearest', axis: 'xy', hitRadius: 14, hoverRadius: 7 });
  const animOpts = getAccessibleAnimationOptions(tokens, { duration: 450, easing: 'easeOutQuad' });

  const config = {
    type: 'line',
    data: chartData,
    options: {
      ...defaultOpts,
      ...spatialOpts,
      animation: animOpts,
      showLine: true,
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
              if (raw && (raw.year || raw.label || raw.t)) {
                return `Période : ${raw.year || raw.label || raw.t}`;
              }
              return items[0].dataset.label || 'Point temporel';
            },
            label: (context) => {
              const xVal = context.parsed.x;
              const yVal = context.parsed.y;
              const fmt = (v) => typeof v === 'number' ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(v) : v;
              return [
                ` Chômage (X): ${fmt(xVal)}%`,
                ` Inflation (Y): ${fmt(yVal)}%`
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
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;
});
