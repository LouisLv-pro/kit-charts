/**
 * @file template/01-comparaison/bar-chart-vertical/template.js
 * @description Standardized Universal bar-chart-vertical Template for kit-charts.
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
    global.KitCharts['bar-chart-vertical'] = exp;
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
 * @file 01-comparaison/bar-chart-vertical/template.js
 * @description Template Chart.js v4+ pour Diagramme en Barres Verticales (Column Chart).
 * Psychophysique: Encodage par position sur échelle commune (Rang 1 Cleveland-McGill) + longueur 1D.
 * Règle d'or: beginAtZero: true absolu sur l'axe Y, espacements Gestalt (0.8 / 0.9), tabular nums.
 */

/**
 * Données par défaut représentatives (PIB des principales économies européennes en Mds €)
 */
const DEFAULT_DATA = {
  labels: ['France', 'Allemagne', 'Royaume-Uni', 'Italie', 'Espagne', 'Pays-Bas', 'Belgique'],
  datasets: [{
    label: 'PIB (Mds €)',
    data: [2800, 2600, 2400, 1900, 1400, 950, 520]
  }]
};

/**
 * Crée et initialise un diagramme en barres verticales dans le canvas cible.
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

  if (options.logScale || (options.scales && options.scales.y && options.scales.y.type === 'logarithmic')) {
    throw new Error('kit-charts: log scale is forbidden on length-encoded bar charts');
  }

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

  // Préparation des données avec support de l'accentuation sémantique et de la valence
  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels ? [...rawData.labels] : [];
  let ciOverlapAnalysis = null;

  const datasets = (rawData.datasets || []).map((ds, idx) => {
    const rawDataArr = Array.isArray(ds.data) ? ds.data : [];
    const dataLen = rawDataArr.length || labels.length;
    const primaryColor = getColor(tokens, idx);

    // Extraction des barres d'erreur / calcul CI95 si données brutes imbriquées
    let errorBarsData = ds.errorBarsData || (ebOption && ebOption.explicit) || null;
    let computedData = [...rawDataArr];

    if (rawDataArr.some(item => Array.isArray(item))) {
      const computedCIs = rawDataArr.map(item => {
        if (Array.isArray(item) && statHelpers && typeof statHelpers.ci95 === 'function') {
          return statHelpers.ci95(item, ebOption?.confidence || 0.95);
        }
        return null;
      });
      computedData = rawDataArr.map((item, i) => Array.isArray(item) ? (computedCIs[i]?.mean ?? 0) : item);
      errorBarsData = computedCIs.map(ci => ci ? { low: ci.low, high: ci.high } : null);

      // Garde-fou de valence sur IC chevauchants (Cumming & Finch 2005)
      if (computedCIs.length >= 2 && computedCIs[0] && computedCIs[1] && statHelpers && typeof statHelpers.checkCIOverlap === 'function') {
        ciOverlapAnalysis = statHelpers.checkCIOverlap(computedCIs[0], computedCIs[1]);
      }
    }

    // Résolution des couleurs par barre si accentuation ou valence spécifiée
    let bgColors = ds.backgroundColor;
    let borderColors = ds.borderColor;
    let borderWidths = ds.borderWidth;

    const hasOverlapNeutral = ciOverlapAnalysis && !ciOverlapAnalysis.isSignificant;

    if (!bgColors || Array.isArray(ds.emphasisRoles) || Array.isArray(ds.roles) || Array.isArray(ds.valences) || ds.emphasisRole || ds.role || ds.metricType || ds.valence !== undefined || ds.focusIndex !== undefined || hasOverlapNeutral) {
      if (hasOverlapNeutral) {
        const neutralColor = tokens.status?.neutral || tokens.emphasis?.context || '#8E9AAF';
        bgColors = neutralColor;
        borderColors = neutralColor;
      } else if (Array.isArray(ds.emphasisRoles) || Array.isArray(ds.roles)) {
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
      data: computedData,
      errorBarsData,
      backgroundColor: bgColors,
      borderColor: borderColors,
      borderWidth: typeof borderWidths === 'number' ? borderWidths : (Array.isArray(borderWidths) ? borderWidths : 0),
      borderRadius: isTufte ? 0 : 4,
      borderSkipped: false,
      categoryPercentage: typeof ds.categoryPercentage === 'number' ? ds.categoryPercentage : 0.8,
      barPercentage: typeof ds.barPercentage === 'number' ? ds.barPercentage : 0.9
    };
  });

  const chartData = { labels, datasets };

  // Options Chart.js v4+ avec respect des règles psychophysiques (Fitts, Mayer, WCAG 2.2)
  const defaultOpts = getChartDefaultOptions(tokens);
  const pluginsList = [];
  if (ebOption && statHelpers && statHelpers.errorBarsPlugin) {
    pluginsList.push(statHelpers.errorBarsPlugin);
  }

  const config = {
    type: 'bar',
    data: chartData,
    plugins: pluginsList,
    options: {
      ...defaultOpts,
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
          ...defaultOpts.plugins?.legend,
          display: datasets.length > 1 && !isTufte
        },
        tooltip: {
          ...defaultOpts.plugins?.tooltip,
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
              const lines = [` ${context.dataset.label || ''}: ${formatted}`];
              const eb = context.dataset.errorBarsData && context.dataset.errorBarsData[context.dataIndex];
              if (eb && eb.low !== undefined && eb.high !== undefined) {
                const overlapNotice = (ciOverlapAnalysis && !ciOverlapAnalysis.isSignificant) ? ' — Δ non significative (IC95 chevauchants)' : '';
                lines.push(` IC95%: [${eb.low.toFixed(1)} — ${eb.high.toFixed(1)}]${overlapNotice}`);
              }
              return lines;
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
            padding: 6
          }
        },
        y: {
          beginAtZero: true, // Règle psychophysique obligatoire pour encodage par longueur
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
    const chartInstance = new Chart(canvas, config);
    chartInstance.$ciOverlapAnalysis = ciOverlapAnalysis;
    return chartInstance;
  }

  // Simulation mock pour environnement Node.js headless
  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    $ciOverlapAnalysis: ciOverlapAnalysis,
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
