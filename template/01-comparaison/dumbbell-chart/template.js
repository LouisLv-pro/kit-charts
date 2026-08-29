/**
 * @file template/01-comparaison/dumbbell-chart/template.js
 * @description Standardized Universal dumbbell-chart Template for kit-charts.
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
    global.KitCharts['dumbbell-chart'] = exp;
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
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function() { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function() { return {}; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function() { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function(t, o) { return o || {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return o || {}; };
  const getPartitionInteractionOptions = (KitChartsTheme && KitChartsTheme.getPartitionInteractionOptions) || (typeof window !== 'undefined' && window.getPartitionInteractionOptions) || function(t, o) { return o || {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const kitChartsDataLabelsPlugin = (KitChartsTheme && KitChartsTheme.kitChartsDataLabelsPlugin) || (typeof window !== 'undefined' && window.kitChartsDataLabelsPlugin) || null;
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 01-comparaison/dumbbell-chart/template.js
 * @description Template Chart.js v4+ pour Graphique en Haltères (Dumbbell Plot / Connected Dot Plot).
 * Psychophysique: Comparaison bivariée Avant/Après ou Écart A/B par entité avec ligne de liaison.
 * Règle d'or: Points contrastés, ligne de liaison claire, axe catégoriel vertical pour libellés lisibles.
 */

/**
 * Données par défaut représentatives (Évolution budgétaire par ministère en Mds €)
 */
const DEFAULT_DATA = {
  labels: ['Santé', 'Éducation', 'Défense', 'Infrastructures', 'Recherche'],
  datasets: [
    { label: 'Budget Initial', data: [45, 38, 32, 28, 15] },
    { label: 'Budget Final', data: [58, 46, 39, 31, 24] }
  ]
};

/**
 * Plugin inline pour tracer la barre de liaison (connector line) entre les deux points de chaque haltère
 * et afficher les étiquettes de données latérales sans chevauchement.
 */
const dumbbellConnectorPlugin = {
  id: 'dumbbellConnectorPlugin',
  beforeDatasetsDraw(chart) {
    const { ctx } = chart;
    const meta0 = chart.getDatasetMeta(0);
    const meta1 = chart.getDatasetMeta(1);

    if (!meta0 || !meta1 || meta0.hidden || meta1.hidden) return;

    const count = Math.min(meta0.data.length, meta1.data.length);
    ctx.save();
    ctx.lineWidth = 3;
    ctx.strokeStyle = chart.options.scales?.x?.grid?.color || 'rgba(148, 163, 184, 0.4)';

    for (let i = 0; i < count; i++) {
      const p0 = meta0.data[i];
      const p1 = meta1.data[i];
      if (p0 && p1) {
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
      }
    }
    ctx.restore();
  },
  afterDatasetsDraw(chart) {
    const showLabels = chart.options?.plugins?.datalabels?.display !== false && chart.options?.showDataLabels !== false && chart.config?.showDataLabels !== false;
    if (!showLabels) return;
    const { ctx } = chart;
    const tokens = chart.options?._kitChartsTokens || getThemeTokens(DEFAULT_THEME);
    const meta0 = chart.getDatasetMeta(0);
    const meta1 = chart.getDatasetMeta(1);
    if (!meta0 || !meta1 || meta0.hidden || meta1.hidden) return;

    const count = Math.min(meta0.data.length, meta1.data.length);
    ctx.save();
    ctx.font = `600 11px ${tokens.fontMono || 'monospace'}`;

    for (let i = 0; i < count; i++) {
      const p0 = meta0.data[i];
      const p1 = meta1.data[i];
      const raw0 = chart.data.datasets[0]?.data?.[i];
      const raw1 = chart.data.datasets[1]?.data?.[i];
      const v0 = typeof raw0 === 'object' && raw0 !== null ? raw0.x : raw0;
      const v1 = typeof raw1 === 'object' && raw1 !== null ? raw1.x : raw1;

      if (!p0 || !p1) continue;

      const dx = Math.abs(p1.x - p0.x);
      const isClose = dx < 36;

      if (v0 !== undefined && v0 !== null) {
        ctx.fillStyle = chart.data.datasets[0]?.backgroundColor || tokens.palette[1] || '#E66101';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(String(v0), p0.x, p0.y - 8);
      }

      if (v1 !== undefined && v1 !== null) {
        ctx.fillStyle = chart.data.datasets[1]?.backgroundColor || tokens.palette[0] || '#2B8CBE';
        ctx.textAlign = 'center';
        ctx.textBaseline = isClose ? 'top' : 'bottom';
        const yOffset = isClose ? 14 : -8;
        ctx.fillText(String(v1), p1.x, p1.y + yOffset);
      }
    }
    ctx.restore();
  }
};

/**
 * Crée et initialise un diagramme en haltères (Dumbbell Chart) dans le canvas cible.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément HTMLCanvasElement
 * @param {Object} [customData=null] - Jeu de données optionnel
 * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème cognitif
 * @param {Object} [options={}] - Options additionnelles (ex: showDataLabels)
 * @returns {Object} Instance Chart.js initialisée
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) {
    throw new Error(`Canvas element "${canvasTarget}" not found`);
  }

  // Destruction propre de l'instance précédente
  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const showDataLabels = (customData && customData.showDataLabels !== undefined) ? customData.showDataLabels : (options.showDataLabels !== undefined ? options.showDataLabels : true);

  // Préparation des données avec support de l'accentuation et de la valence
  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels ? [...rawData.labels] : ['A', 'B', 'C', 'D', 'E'];
  const rawDatasets = rawData.datasets || [];

  const datasets = rawDatasets.map((ds, idx) => {
    const defaultColor = idx === 0 ? (tokens.palette[1] || '#E66101') : (tokens.palette[0] || '#2B8CBE');
    let color = ds.backgroundColor;

    if (!color || ds.emphasisRole || ds.role || ds.valence !== undefined || ds.metricType) {
      if (ds.emphasisRole || ds.role) {
        const style = getEmphasisStyle(tokens, ds.emphasisRole || ds.role);
        color = ds.backgroundColor || style.borderColor || style.backgroundColor || defaultColor;
      } else if (ds.valence !== undefined || ds.direction !== undefined) {
        color = ds.backgroundColor || getValenceColor(tokens, ds.valence !== undefined ? ds.valence : ds.direction, ds.metricType || 'gain');
      } else {
        color = ds.backgroundColor || defaultColor;
      }
    }

    // Normalisation des points au format { x, y } pour type 'scatter'
    const pointData = (Array.isArray(ds.data) ? ds.data : []).map((item, i) => {
      if (typeof item === 'object' && item !== null && 'x' in item) {
        return item;
      }
      return {
        x: typeof item === 'number' ? item : Number(item) || 0,
        y: labels[i] !== undefined ? labels[i] : i
      };
    });

    return {
      label: ds.label || (idx === 0 ? 'Point A' : 'Point B'),
      type: 'scatter',
      data: pointData,
      backgroundColor: color,
      borderColor: tokens.bg,
      borderWidth: 2,
      pointRadius: isTufte ? 5 : 7,
      pointHoverRadius: 9,
      pointHitRadius: 12,
      datalabels: false,
      displayDataLabels: false
    };
  });

  const chartData = { labels, datasets };

  // Options Chart.js v4+ avec respect des règles de pointage Fitts 2D
  const defaultOpts = getChartDefaultOptions(tokens);
  const config = {
    type: 'scatter',
    data: chartData,
    plugins: [dumbbellConnectorPlugin],
    options: {
      ...defaultOpts,
      _kitChartsTokens: tokens,
      showDataLabels: showDataLabels,
      layout: {
        padding: {
          right: 24,
          left: 12,
          top: 12,
          bottom: 12
        }
      },
      animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
      interaction: {
        mode: 'nearest',
        intersect: false,
        axis: 'xy'
      },
      hover: {
        mode: 'nearest',
        intersect: false,
        animationDuration: (isTufte || isReducedMotionPreferred()) ? 0 : 100
      },
      plugins: {
        ...defaultOpts.plugins,
        datalabels: getDataLabelOptions(tokens, {
          display: showDataLabels
        }),
        legend: {
          ...defaultOpts.plugins.legend,
          display: !isTufte,
          position: 'top',
          align: 'end'
        },
        tooltip: {
          ...defaultOpts.plugins.tooltip,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono || 'monospace',
            size: 12,
            weight: '400'
          },
          animation: (isTufte || isReducedMotionPreferred()) ? false : { duration: 150, easing: 'easeOutQuad' },
          callbacks: {
            label: (context) => {
              const raw = context.raw;
              const xVal = typeof raw === 'object' && raw !== null ? raw.x : raw;
              const formatted = typeof xVal === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(xVal)
                : xVal;
              return ` ${context.dataset.label || ''}: ${formatted}`;
            }
          }
        }
      },
      scales: {
        y: {
          type: 'category',
          labels: labels,
          offset: true,
          grid: {
            display: false,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 12,
              weight: '500'
            },
            padding: 20
          }
        },
        x: {
          min: 0,
          beginAtZero: true,
          grace: '14%',
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontMono || tokens.fontFamily,
              size: 11
            },
            padding: 6,
            callback: (val) => {
              if (typeof val === 'number' && Math.abs(val) >= 1000) {
                return new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(val);
              }
              return val;
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }

  // Simulation mock pour environnement Node.js headless
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
    dumbbellConnectorPlugin: typeof dumbbellConnectorPlugin !== 'undefined' ? dumbbellConnectorPlugin : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    isReducedMotionPreferred: typeof isReducedMotionPreferred === 'function' ? isReducedMotionPreferred : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null,
    getSpatialInteractionOptions: typeof getSpatialInteractionOptions === 'function' ? getSpatialInteractionOptions : null,
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getPartitionInteractionOptions: typeof getPartitionInteractionOptions === 'function' ? getPartitionInteractionOptions : null,
    computeAntiOcclusionTooltipPosition: typeof computeAntiOcclusionTooltipPosition === 'function' ? computeAntiOcclusionTooltipPosition : null,
    getDataLabelOptions: typeof getDataLabelOptions === 'function' ? getDataLabelOptions : null,
    formatLabelValue: typeof formatLabelValue === 'function' ? formatLabelValue : null,
    kitChartsDataLabelsPlugin: typeof kitChartsDataLabelsPlugin !== 'undefined' ? kitChartsDataLabelsPlugin : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;
});
