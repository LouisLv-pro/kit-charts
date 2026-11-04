/**
 * @file template/01-comparaison/slope-chart/template.js
 * @description Standardized Universal slope-chart Template for kit-charts.
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
    global.KitCharts['slope-chart'] = exp;
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
 * @file 01-comparaison/slope-chart/template.js
 * @description Template Chart.js v4+ pour Graphique de Pente (Slopegraph / Slope Chart).
 * Psychophysique: Évaluation pré-attentive des variations relatives et inversions de rang entre 2 états/dates.
 * Règle d'or: tension: 0 (lignes rigoureusement droites), points d'extrémités nets, étiquetage direct.
 */

/**
 * Données par défaut représentatives (Transition du mix énergétique européen entre 2020 et 2025 en %)
 */
const DEFAULT_DATA = {
  labels: ['2020', '2025'],
  datasets: [
    { label: 'Énergie Renouvelable', data: [21.5, 38.2] },
    { label: 'Nucléaire', data: [40.1, 35.8] },
    { label: 'Gaz Naturel', data: [25.4, 18.2] },
    { label: 'Charbon', data: [13.0, 7.8] }
  ]
};


/**
 * Étiquetage direct d'un slopegraph : "Nom  valeur" à gauche, "valeur  Nom" à droite,
 * avec écartement vertical minimal pour éviter les chevauchements.
 */
const slopeDirectLabelsPlugin = {
  id: 'kcSlopeDirectLabels',
  // Réserve latérale proportionnelle à la largeur du canvas (carte étroite : colonnes non écrasées).
  beforeLayout(chart) {
    const pad = Math.round(Math.min(190, Math.max(70, chart.width * 0.31)));
    const p = chart.options.layout && chart.options.layout.padding;
    if (p && typeof p === 'object') { p.left = pad; p.right = pad; }
  },
  afterDatasetsDraw(chart) {
    if (chart.options?.showDataLabels === false) return;
    const tokens = chart.options?._kitChartsTokens || {};
    const ctx = chart.ctx;
    const narrow = chart.width < 420;
    const fontSize = narrow ? 10 : 11;
    const lineH = fontSize + 3;
    const fmt = (v) => new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(v);
    const sides = [
      { idx: 0, align: 'right', dx: -10 },
      { idx: null, align: 'left', dx: 10 }
    ];
    ctx.save();
    ctx.font = `600 ${fontSize}px ${tokens.fontFamily || 'sans-serif'}`;
    ctx.fillStyle = tokens.textPrimary || '#0F172A';
    ctx.textBaseline = 'middle';
    const padSide = Math.max(0, chart.chartArea.left);
    const avail = Math.max(40, padSide - 10 - 4);
    // Découpe le nom en lignes pour tenir dans la réserve latérale (sans jamais rogner) :
    // la valeur reste collée au mot côté tracé.
    const wrap = (name, valueText, left) => {
      const words = String(name).split(/\s+/);
      if (left) words[words.length - 1] += '  ' + valueText; else words[0] = valueText + '  ' + words[0];
      const lines = [];
      let cur = '';
      words.forEach((w) => {
        const test = cur ? cur + ' ' + w : w;
        if (cur && ctx.measureText(test).width > avail) { lines.push(cur); cur = w; } else cur = test;
      });
      if (cur) lines.push(cur);
      return lines;
    };
    sides.forEach((side) => {
      const items = [];
      chart.data.datasets.forEach((ds, di) => {
        const meta = chart.getDatasetMeta(di);
        if (!meta || meta.hidden || !meta.data.length) return;
        const i = side.idx === null ? meta.data.length - 1 : side.idx;
        const pt = meta.data[i];
        const v = ds.data[i];
        if (!pt || v === null || v === undefined) return;
        const valueText = fmt(v);
        const out = wrap(ds.label, valueText, side.idx === 0);
        items.push({ out, x: pt.x, y: pt.y, ly: pt.y, h: out.length * lineH });
      });
      items.sort((a, b) => a.y - b.y);
      for (let k = 1; k < items.length; k++) {
        const need = (items[k - 1].h + items[k].h) / 2;
        if (items[k].ly - items[k - 1].ly < need) items[k].ly = items[k - 1].ly + need;
      }
      ctx.textAlign = side.align;
      items.forEach((it) => {
        const top = it.ly - ((it.out.length - 1) * lineH) / 2;
        it.out.forEach((line, k) => ctx.fillText(line, it.x + side.dx, top + k * lineH));
      });
    });
    ctx.restore();
  }
};

/**
 * Crée et initialise un graphique de pente (Slope Chart) dans le canvas cible.
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

  // Préparation des données avec support de l'accentuation et de la valence de pente
  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels ? [...rawData.labels] : ['T0', 'T1'];
  const datasets = (rawData.datasets || []).map((ds, idx) => {
    const primaryColor = getColor(tokens, idx);

    let borderColor = ds.borderColor;
    let borderWidth = ds.borderWidth;
    let borderDash = ds.borderDash || [];
    let pointRadius = ds.pointRadius !== undefined ? ds.pointRadius : (isTufte ? 3 : 5);
    let pointStyle = ds.pointStyle || 'circle';

    if (ds.emphasisRole || ds.role) {
      const style = getEmphasisStyle(tokens, ds.emphasisRole || ds.role);
      borderColor = borderColor || style.borderColor || primaryColor;
      borderWidth = borderWidth !== undefined ? borderWidth : style.borderWidth;
      borderDash = style.borderDash || [];
      pointRadius = style.pointRadius || pointRadius;
      pointStyle = style.pointStyle || pointStyle;
    } else if (ds.valence !== undefined || ds.metricType) {
      const dataArr = Array.isArray(ds.data) ? ds.data : [];
      const delta = dataArr.length >= 2 ? (Number(dataArr[1]) - Number(dataArr[0])) : 0;
      const valColor = getValenceColor(tokens, ds.valence !== undefined ? ds.valence : delta, ds.metricType || 'gain');
      borderColor = borderColor || valColor;
    } else {
      borderColor = borderColor || primaryColor;
      borderWidth = borderWidth !== undefined ? borderWidth : (isTufte ? 1.5 : 2.5);
    }

    const bg = ds.backgroundColor || borderColor;

    return {
      label: ds.label || `Série ${idx + 1}`,
      data: Array.isArray(ds.data) ? [...ds.data] : [],
      borderColor: borderColor,
      backgroundColor: bg,
      borderWidth: borderWidth !== undefined ? borderWidth : (isTufte ? 1.5 : 2.5),
      borderDash: borderDash,
      tension: 0, // Règle psychophysique obligatoire : segment strictement linéaire
      pointRadius: pointRadius,
      pointHoverRadius: pointRadius + 2,
      pointHitRadius: 12,
      pointStyle: pointStyle,
      pointBackgroundColor: borderColor,
      pointBorderColor: tokens.bg,
      pointBorderWidth: 2,
      fill: false
    };
  });

  const chartData = { labels, datasets };

  // Options Chart.js v4+ avec synchronisation indexée
  const defaultOpts = getChartDefaultOptions(tokens);
  const config = {
    type: 'line',
    data: chartData,
    plugins: [slopeDirectLabelsPlugin],
    options: {
      ...defaultOpts,
      _kitChartsTokens: tokens,
      showDataLabels: showDataLabels,
      layout: {
        padding: {
          left: 120,
          right: 120,
          top: 16,
          bottom: 16
        }
      },
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
      plugins: {
        ...defaultOpts.plugins,
        // Étiquettes directes dessinées par le plugin local (nom + valeur)
        datalabels: getDataLabelOptions(tokens, { display: false }),
        legend: {
          ...defaultOpts.plugins.legend,
          display: false,
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
            color: tokens.textPrimary,
            font: {
              family: tokens.fontFamily,
              size: 13,
              weight: '600'
            },
            padding: 8
          }
        },
        y: {
          // Pas d'axe Y : les valeurs sont lues sur les étiquettes directes
          display: false,
          grid: { display: false },
          border: { display: false }
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
