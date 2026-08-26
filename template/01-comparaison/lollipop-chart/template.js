/**
 * @file template/01-comparaison/lollipop-chart/template.js
 * @description Standardized Universal lollipop-chart Template for kit-charts.
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
    global.KitCharts['lollipop-chart'] = exp;
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
 * @file 01-comparaison/lollipop-chart/template.js
 * @description Template Chart.js v4+ pour Graphique Sucette (Lollipop Chart).
 * Psychophysique: Alternative épurée au diagramme en barres avec un ratio Data-Ink maximal.
 * Règle d'or: beginAtZero: true sur Y, tige fine (2-3px) et tête circulaire pré-attentive.
 */

/**
 * Données par défaut représentatives (Indice de popularité des langages de programmation en %)
 */
const DEFAULT_DATA = {
  labels: ['Python', 'JavaScript', 'TypeScript', 'Rust', 'Go', 'Java', 'C++'],
  datasets: [{
    label: 'Popularité Index (%)',
    data: [88.5, 82.4, 76.1, 68.9, 64.2, 58.0, 52.3]
  }]
};

/**
 * Plugin inline Chart.js pour dessiner les têtes circulaires au sommet de chaque tige de sucette.
 */
const lollipopHeadPlugin = {
  id: 'lollipopHeadPlugin',
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    const tokens = chart.options?._kitChartsTokens || getThemeTokens(DEFAULT_THEME);
    const showLabels = chart.options?.plugins?.datalabels?.display !== false && chart.options?.showDataLabels !== false && chart.config?.showDataLabels !== false;

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      if (meta.hidden) return;

      meta.data.forEach((element, index) => {
        const val = dataset.data[index];
        if (val === null || val === undefined || isNaN(val)) return;

        const { x, y } = element.tooltipPosition();
        const headColor = Array.isArray(dataset.backgroundColor)
          ? dataset.backgroundColor[index]
          : dataset.backgroundColor;

        const headRadius = Array.isArray(dataset.headRadius)
          ? dataset.headRadius[index]
          : (dataset.headRadius || 6);

        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, headRadius, 0, Math.PI * 2);
        ctx.fillStyle = headColor || '#2B8CBE';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = chart.options.scales?.y?.grid?.color || '#FFFFFF';
        ctx.stroke();

        // Data label direct au sommet
        if (showLabels) {
          const font = chart.options?.plugins?.datalabels?.font || {};
          const fSize = font.size || 10;
          const fFam = font.family || tokens.fontMono || 'monospace';
          const fWeight = font.weight || '600';
          const formatted = typeof val === 'number'
            ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(val)
            : val;
          ctx.font = `${fWeight} ${fSize}px ${fFam}`;
          ctx.fillStyle = chart.options?.plugins?.datalabels?.color || tokens.textPrimary || '#0F172A';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(formatted, x, y - headRadius - 4);
        }

        ctx.restore();
      });
    });
  }
};

/**
 * Crée et initialise un diagramme lollipop dans le canvas cible.
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

  // Préparation des données avec support de l'accentuation sémantique et de la valence
  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels ? [...rawData.labels] : [];
  const datasets = (rawData.datasets || []).map((ds, idx) => {
    const dataLen = Array.isArray(ds.data) ? ds.data.length : labels.length;
    const primaryColor = getColor(tokens, idx);

    let bgColors = ds.backgroundColor;
    let borderColors = ds.borderColor;

    if (!bgColors || Array.isArray(ds.emphasisRoles) || Array.isArray(ds.roles) || Array.isArray(ds.valences) || ds.emphasisRole || ds.role || ds.metricType || ds.valence !== undefined || ds.focusIndex !== undefined) {
      if (Array.isArray(ds.emphasisRoles) || Array.isArray(ds.roles)) {
        const roles = ds.emphasisRoles || ds.roles;
        bgColors = roles.map(r => getEmphasisStyle(tokens, r).backgroundColor || primaryColor);
        borderColors = roles.map(r => getEmphasisStyle(tokens, r).borderColor || primaryColor);
      } else if (Array.isArray(ds.valences)) {
        const metricType = ds.metricType || 'gain';
        bgColors = ds.valences.map(v => getValenceColor(tokens, v, metricType));
        borderColors = bgColors;
      } else if (ds.focusIndex !== undefined) {
        bgColors = Array.from({ length: dataLen }, (_, i) =>
          i === ds.focusIndex ? (tokens.emphasis?.focal || primaryColor) : (tokens.emphasis?.context || tokens.textMuted || '#CBD5E1')
        );
        borderColors = bgColors;
      } else if (ds.emphasisRole || ds.role) {
        const style = getEmphasisStyle(tokens, ds.emphasisRole || ds.role);
        bgColors = ds.backgroundColor || style.backgroundColor || primaryColor;
        borderColors = ds.borderColor || style.borderColor || primaryColor;
      } else if (ds.valence !== undefined || ds.direction !== undefined) {
        const valColor = getValenceColor(tokens, ds.valence !== undefined ? ds.valence : ds.direction, ds.metricType || 'gain');
        bgColors = ds.backgroundColor || valColor;
        borderColors = ds.borderColor || valColor;
      } else {
        bgColors = ds.backgroundColor || primaryColor;
        borderColors = ds.borderColor || primaryColor;
      }
    }

    return {
      label: ds.label || `Série ${idx + 1}`,
      data: Array.isArray(ds.data) ? [...ds.data] : [],
      backgroundColor: bgColors,
      borderColor: borderColors,
      borderWidth: 0,
      borderRadius: 0,
      barThickness: 3, // Tige étroite pour ratio Data-Ink élevé
      maxBarThickness: 4,
      headRadius: ds.headRadius || (isTufte ? 4 : 6),
      categoryPercentage: typeof ds.categoryPercentage === 'number' ? ds.categoryPercentage : 0.8,
      barPercentage: typeof ds.barPercentage === 'number' ? ds.barPercentage : 0.9
    };
  });

  const chartData = { labels, datasets };

  // Options Chart.js v4+ avec capture Fitts 1D
  const defaultOpts = getChartDefaultOptions(tokens);
  const config = {
    type: 'bar',
    data: chartData,
    plugins: [lollipopHeadPlugin],
    options: {
      ...defaultOpts,
      _kitChartsTokens: tokens,
      showDataLabels: showDataLabels,
      animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
      interaction: {
        mode: 'index',
        intersect: false,
        axis: 'x'
      },
      hover: {
        mode: 'index',
        intersect: false,
        axis: 'x',
        animationDuration: (isTufte || isReducedMotionPreferred()) ? 0 : 100
      },
      categoryPercentage: 0.8,
      barPercentage: 0.9,
      plugins: {
        ...defaultOpts.plugins,
        datalabels: getDataLabelOptions(tokens, {
          display: showDataLabels,
          formatter: (val) => {
            if (typeof val === 'number' && Math.abs(val) >= 1000) {
              return new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(val);
            }
            return val;
          }
        }),
        legend: {
          ...defaultOpts.plugins.legend,
          display: datasets.length > 1 && !isTufte
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
              const val = context.parsed.y !== null && context.parsed.y !== undefined
                ? context.parsed.y
                : context.raw;
              const formatted = typeof val === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(val)
                : val;
              return ` ${context.dataset.label || ''}: ${formatted}`;
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
            padding: 8
          }
        },
        y: {
          beginAtZero: true, // Règle psychophysique obligatoire
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
            padding: 8,
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
    lollipopHeadPlugin: typeof lollipopHeadPlugin !== 'undefined' ? lollipopHeadPlugin : null,
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
