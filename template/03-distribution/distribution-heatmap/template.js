/**
 * @file template/03-distribution/distribution-heatmap/template.js
 * @description Standardized Universal distribution-heatmap Template for kit-charts.
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
    global.KitCharts['distribution-heatmap'] = exp;
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
 * @file 03-distribution/distribution-heatmap/template.js
 * @description Template Chart.js v4+ pour Heatmap de Distribution 2D Bivariée (2D Distribution Heatmap).
 * Psychophysique: Encodage de densité conjointe (X, Y) par luminance/saturation séquentielle continue (Rang 7 Cleveland-McGill + Grille 2D).
 * Plugin: chartjs-chart-matrix@2.0.1
 * Règle d'or: Palette séquentielle perceptuellement uniforme (Viridis / ColorBrewer sequential), normalisation dynamique de contraste.
 */



/**
 * Données par défaut représentatives (Charge CPU serveur % par Plage Horaire x Jour de la semaine)
 */
const DEFAULT_DATA = (() => {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const hours = ['00-04h', '04-08h', '08-12h', '12-16h', '16-20h', '20-24h'];
  const matrix = [];

  for (let d = 0; d < days.length; d++) {
    for (let h = 0; h < hours.length; h++) {
      // Modèle réaliste : pics d'activité en journée de semaine
      const isWeekend = d >= 5;
      const isWorkHours = h >= 2 && h <= 4;
      let baseVal = isWeekend ? 15 : 30;
      if (isWorkHours && !isWeekend) baseVal += 55;
      if (h === 3 && !isWeekend) baseVal += 10;
      const noise = Math.sin(d * 3 + h * 5) * 6;
      const v = Math.max(5, Math.min(100, Math.round(baseVal + noise)));

      matrix.push({
        x: d + 1,
        y: h + 1,
        day: days[d],
        hour: hours[h],
        v
      });
    }
  }

  return {
    xLabels: days,
    yLabels: hours,
    datasets: [{
      label: 'Charge Serveur (%)',
      data: matrix
    }]
  };
})();

/**
 * Crée et initialise une Heatmap de Distribution 2D dans le canvas cible.
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
  const xLabels = rawData.xLabels || ['1', '2', '3', '4', '5', '6', '7'];
  const yLabels = rawData.yLabels || ['1', '2', '3', '4', '5', '6'];

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
      const v = raw?.v ?? raw?.value ?? (typeof raw === 'number' ? raw : 0);
      if (firstDs.valence || firstDs.metricType) {
        const threshold = firstDs.threshold ?? (maxVal + minVal) / 2;
        const delta = v - threshold;
        return getValenceColor(tokens, delta, firstDs.metricType || firstDs.valence || 'gain');
      }
      const ratio = maxVal > minVal ? Math.max(0, Math.min(1, (v - minVal) / (maxVal - minVal))) : 0.5;
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
        return 2;
      }
      return isTufte ? 0.5 : 1;
    },
    borderRadius: 2,
    width: ({ chart }) => {
      const area = chart.chartArea;
      if (!area) return 20;
      const cols = Math.max(1, xLabels.length);
      return (area.width / cols) - 3;
    },
    height: ({ chart }) => {
      const area = chart.chartArea;
      if (!area) return 20;
      const rows = Math.max(1, yLabels.length);
      return (area.height / rows) - 3;
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
              const xLbl = r.day || xLabels[(r.x || 1) - 1] || `X: ${r.x}`;
              const yLbl = r.hour || yLabels[(r.y || 1) - 1] || `Y: ${r.y}`;
              return `${xLbl} × ${yLbl}`;
            },
            label: (context) => {
              const r = context.raw;
              const v = r?.v ?? r?.value ?? 0;
              const formatted = typeof v === 'number'
                ? new Intl.NumberFormat('fr-FR').format(v)
                : v;
              return ` Densité: ${formatted}`;
            }
          }
        }
      },
      scales: {
        x: {
          type: 'linear',
          min: 0.5,
          max: xLabels.length + 0.5,
          grid: { display: false },
          border: { display: false },
          ticks: {
            stepSize: 1,
            color: tokens.textPrimary,
            font: {
              family: tokens.fontFamily,
              weight: '600',
              size: 11
            },
            padding: 6,
            callback: (val) => {
              const idx = Math.round(val) - 1;
              return xLabels[idx] || '';
            }
          }
        },
        y: {
          type: 'linear',
          min: 0.5,
          max: yLabels.length + 0.5,
          grid: { display: false },
          border: { display: false },
          ticks: {
            stepSize: 1,
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 8,
            callback: (val) => {
              const idx = Math.round(val) - 1;
              return yLabels[idx] || '';
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
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;
});
