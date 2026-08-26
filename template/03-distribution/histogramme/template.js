/**
 * @file template/03-distribution/histogramme/template.js
 * @description Standardized Universal histogramme Template for kit-charts.
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
    global.KitCharts['histogramme'] = exp;
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
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 03-distribution/histogramme/template.js
 * @description Template Chart.js v4+ pour Histogramme de Fréquence (Histogram).
 * Psychophysique: Encodage de distribution continue via surfaces de barres contiguës (Rang 1/2 Cleveland-McGill).
 * Règle d'or: beginAtZero: true absolu sur l'axe Y, espacement contigu (barPercentage: 1.0, categoryPercentage: 0.98),
 * algorithme de binning Freedman-Diaconis déterministe pour découpage optimal en classes de fréquence.
 */



/**
 * Calcule les bornes et fréquences d'un histogramme selon la règle de Freedman-Diaconis.
 * h = 2 * IQR(x) * n^(-1/3)
 *
 * @param {number[]} values - Tableau brut d'observations continues
 * @param {number} [maxBins=20] - Plafond de sécurité du nombre de classes
 * @returns {{ labels: string[], data: number[], binWidth: number, min: number, max: number }}
 */
function computeFreedmanDiaconisBins(values, maxBins = 20) {
  if (!Array.isArray(values) || values.length === 0) {
    return { labels: [], data: [], binWidth: 0, min: 0, max: 0 };
  }

  const valid = values.filter(v => typeof v === 'number' && Number.isFinite(v));
  if (valid.length === 0) {
    return { labels: [], data: [], binWidth: 0, min: 0, max: 0 };
  }

  const sorted = [...valid].sort((a, b) => a - b);
  const n = sorted.length;
  const min = sorted[0];
  const max = sorted[n - 1];

  if (min === max || n === 1) {
    return {
      labels: [`[${min.toFixed(1)}]`],
      data: [n],
      binWidth: 1,
      min,
      max
    };
  }

  // Calcul Quartiles et IQR
  const q1 = sorted[Math.floor(n * 0.25)];
  const q3 = sorted[Math.floor(n * 0.75)];
  const iqr = q3 - q1;

  // Largeur de bin selon Freedman-Diaconis ou Sturges fallback si IQR nul
  let h = iqr > 0 ? (2 * iqr * Math.pow(n, -1 / 3)) : 0;
  if (h <= 0 || !Number.isFinite(h)) {
    // Sturges fallback: k = ceil(log2(n) + 1)
    const kSturges = Math.max(1, Math.ceil(Math.log2(n) + 1));
    h = (max - min) / kSturges;
  }

  let numBins = Math.max(1, Math.min(maxBins, Math.ceil((max - min) / h)));
  const binWidth = (max - min) / numBins;

  const counts = new Array(numBins).fill(0);
  const labels = [];

  for (let i = 0; i < numBins; i++) {
    const bStart = min + i * binWidth;
    const bEnd = min + (i + 1) * binWidth;
    labels.push(`[${bStart.toFixed(1)} - ${bEnd.toFixed(1)}[`);
  }

  for (const v of sorted) {
    let idx = Math.floor((v - min) / binWidth);
    if (idx >= numBins) idx = numBins - 1;
    if (idx < 0) idx = 0;
    counts[idx]++;
  }

  return { labels, data: counts, binWidth, min, max };
}

/**
 * Données par défaut représentatives (Temps de réponse serveur en ms, N=320 requêtes)
 */
const DEFAULT_DATA = {
  labels: ['[10-25[', '[25-40[', '[40-55[', '[55-70[', '[70-85[', '[85-100[', '[100-115[', '[115-130['],
  datasets: [{
    label: 'Distribution Latence Serveur (ms)',
    data: [14, 42, 88, 96, 51, 20, 7, 2]
  }]
};

/**
 * Crée et initialise un Histogramme de fréquence dans le canvas cible.
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

  // Destruction propre de l'instance préexistante
  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';

  // Traitement et normalisation des données
  const rawData = customData || DEFAULT_DATA;
  let chartLabels = [];
  let chartDatasets = [];

  const resolveDatasetColors = (ds, idx, labels) => {
    if (ds.role || ds.emphasis) {
      const emp = getEmphasisStyle(tokens, ds.role || ds.emphasis, { fill: true });
      return {
        bg: ds.backgroundColor || emp.backgroundColor,
        border: ds.borderColor || emp.borderColor,
        borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : (emp.borderWidth || (isTufte ? 1 : 0.5))
      };
    }
    if (ds.valence || ds.metricType || ds.direction !== undefined) {
      const vColor = getValenceColor(tokens, ds.direction ?? ds.delta ?? 0, ds.metricType || ds.valence || 'gain');
      return {
        bg: ds.backgroundColor || vColor,
        border: ds.borderColor || (isTufte ? tokens.textPrimary : tokens.surface),
        borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : (isTufte ? 1 : 0.5)
      };
    }
    if (ds.highlightIndices || ds.binRoles || ds.anomalies) {
      const bg = labels.map((lbl, bIdx) => {
        if (ds.highlightIndices && ds.highlightIndices.includes(bIdx)) {
          return tokens.emphasis?.focal || getColor(tokens, 0);
        }
        if (ds.binRoles && ds.binRoles[bIdx]) {
          return getEmphasisStyle(tokens, ds.binRoles[bIdx], { fill: true }).backgroundColor;
        }
        if (ds.anomalies && ds.anomalies.includes(bIdx)) {
          return tokens.emphasis?.anomaly || getEmphasisStyle(tokens, 'anomaly').backgroundColor;
        }
        return getEmphasisStyle(tokens, 'context', { fill: true }).backgroundColor || getColor(tokens, idx);
      });
      return {
        bg: ds.backgroundColor || bg,
        border: ds.borderColor || (isTufte ? tokens.textPrimary : tokens.surface),
        borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : (isTufte ? 1 : 0.5)
      };
    }
    const primaryColor = getColor(tokens, idx);
    return {
      bg: ds.backgroundColor || primaryColor,
      border: ds.borderColor || (isTufte ? tokens.textPrimary : tokens.surface),
      borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : (isTufte ? 1 : 0.5)
    };
  };

  // Si un tableau de nombres bruts est passé directement
  if (Array.isArray(rawData)) {
    const binned = computeFreedmanDiaconisBins(rawData);
    chartLabels = binned.labels;
    chartDatasets = [{
      label: 'Fréquence d’observations',
      data: binned.data,
      backgroundColor: tokens.palette[0]
    }];
  } else {
    chartLabels = rawData.labels ? [...rawData.labels] : [];
    chartDatasets = (rawData.datasets || []).map((ds, idx) => {
      // Si le dataset contient des valeurs brutes continues au lieu de fréquences pré-agrégées
      if (Array.isArray(ds.rawValues) && ds.rawValues.length > 0) {
        const binned = computeFreedmanDiaconisBins(ds.rawValues);
        chartLabels = binned.labels;
        const colors = resolveDatasetColors(ds, idx, chartLabels);
        return {
          label: ds.label || `Fréquence Série ${idx + 1}`,
          data: binned.data,
          backgroundColor: colors.bg,
          borderColor: colors.border,
          borderWidth: colors.borderWidth,
          borderRadius: 0,
          categoryPercentage: 0.98,
          barPercentage: 1.0
        };
      }

      const colors = resolveDatasetColors(ds, idx, chartLabels);
      return {
        label: ds.label || `Fréquence ${idx + 1}`,
        data: Array.isArray(ds.data) ? [...ds.data] : [],
        backgroundColor: colors.bg,
        borderColor: colors.border,
        borderWidth: colors.borderWidth,
        borderRadius: 0, // Pas de bordure arrondie pour signifier la continuité physique des bins
        categoryPercentage: 0.98,
        barPercentage: 1.0
      };
    });
  }

  const chartData = {
    labels: chartLabels,
    datasets: chartDatasets
  };

  const defaultOpts = getChartDefaultOptions(tokens);
  const spatialOpts = getSpatialInteractionOptions(tokens, { mode: 'index', axis: 'x', hitRadius: 12, hoverRadius: 6 });
  const animOpts = getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' });

  const config = {
    type: 'bar',
    data: chartData,
    options: {
      ...defaultOpts,
      ...spatialOpts,
      animation: animOpts,
      // Encodage continu Gestalt : barres contiguës sans interstices parasites
      categoryPercentage: 0.98,
      barPercentage: 1.0,
      plugins: {
        ...defaultOpts.plugins,
        legend: {
          ...defaultOpts.plugins?.legend,
          display: chartDatasets.length > 1 && !isTufte
        },
        tooltip: {
          ...defaultOpts.plugins?.tooltip,
          titleFont: { family: tokens.fontFamily, size: 12, weight: '600' },
          bodyFont: { family: tokens.fontMono, size: 12, weight: '400' },
          callbacks: {
            title: (items) => {
              if (!items.length) return '';
              return `Classe : ${items[0].label}`;
            },
            label: (context) => {
              const val = context.parsed.y !== null && context.parsed.y !== undefined
                ? context.parsed.y
                : context.raw;
              const total = (context.dataset.data || []).reduce((acc, cur) => acc + (typeof cur === 'number' ? cur : (cur?.y || 0)), 0);
              const pct = total > 0 && typeof val === 'number' ? ((val / total) * 100).toFixed(1) : null;
              const formatted = typeof val === 'number'
                ? new Intl.NumberFormat('fr-FR').format(val)
                : val;
              const pctSuffix = pct !== null ? ` (${pct}%)` : '';
              return ` ${context.dataset.label || 'Effectif'}: ${formatted} obs.${pctSuffix}`;
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
              size: 10
            },
            maxRotation: 45,
            minRotation: 0,
            padding: 6
          }
        },
        y: {
          beginAtZero: true, // Règle psychophysique obligatoire pour encodage par hauteur de bin
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
