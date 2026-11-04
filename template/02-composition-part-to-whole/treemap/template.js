/**
 * @file template/02-composition-part-to-whole/treemap/template.js
 * @description Standardized Universal treemap Template for kit-charts.
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
    global.KitCharts['treemap'] = exp;
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
 * @file 02-composition-part-to-whole/treemap/template.js
 * @description Template Chart.js v4+ pour Carte Proportionnelle (Treemap hiérarchique).
 * Psychophysique: Subdivision récursive de l'espace en rectangles proportionnels à la valeur (Squarified layout).
 * Règle d'or: Ratio hauteur/largeur proche du carré (aspect ratio ~1), étiquetage lisible, palette hiérarchique.
 */

/**
 * Données par défaut représentatives (Répartition de la capitalisation boursière par secteur et industrie)
 */
const DEFAULT_DATA = {
  datasets: [{
    tree: [
      { category: 'Tech', name: 'Software', value: 450 },
      { category: 'Tech', name: 'Hardware', value: 320 },
      { category: 'Tech', name: 'Cloud', value: 280 },
      { category: 'Finance', name: 'Banque', value: 390 },
      { category: 'Finance', name: 'Assurance', value: 210 },
      { category: 'Santé', name: 'Pharma', value: 310 },
      { category: 'Santé', name: 'Biotech', value: 160 }
    ],
    key: 'value',
    groups: ['category', 'name']
  }]
};

/**
 * Crée et initialise un treemap dans le canvas cible.
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

  // Préparation des données
  const rawData = customData || DEFAULT_DATA;
  const firstDs = (rawData.datasets || [])[0] || {};
  const valueKey = firstDs.key || 'value';
  const ctx0Total = (firstDs.tree || firstDs.data || []).reduce((a, it) => a + (Number(it && it[valueKey]) || 0), 0);
  const unitTxt = firstDs.unit ? ` ${firstDs.unit}` : '';
  const datasets = (rawData.datasets || []).map((ds, idx) => {
    // Couleur par groupe parent (teinte héritée), luminosité variable pour les feuilles
    const treeItems = ds.tree || ds.data || [];
    const groupKey = (ds.groups && ds.groups[0]) || 'category';
    const groupNames = [];
    treeItems.forEach(it => { if (it && !groupNames.includes(it[groupKey])) groupNames.push(it[groupKey]); });
    const leafRank = {};
    const leafCount = {};
    treeItems.forEach(it => { if (it) leafCount[it[groupKey]] = (leafCount[it[groupKey]] || 0) + 1; });
    const seenLeaf = {};
    treeItems.forEach(it => {
      if (!it) return;
      const g = it[groupKey];
      leafRank[g + '\u0000' + (it.name || '')] = seenLeaf[g] || 0;
      seenLeaf[g] = (seenLeaf[g] || 0) + 1;
    });
    const hexToRgb = (hex) => {
      const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim());
      if (!m) return null;
      const n = parseInt(m[1], 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    };
    const mixHex = (a, b, t) => {
      const ca = hexToRgb(a), cb = hexToRgb(b);
      if (!ca || !cb) return a;
      return '#' + ca.map((v, i) => Math.round(v + (cb[i] - v) * t).toString(16).padStart(2, '0')).join('');
    };
    const cellColor = (ctx) => {
      const raw = ctx.raw;
      const item = raw ? (raw._data || raw) : null;
      if (item) {
        if (item.emphasisRole || item.role) {
          return getEmphasisStyle(tokens, item.emphasisRole || item.role).backgroundColor || getColor(tokens, 0);
        }
        if (item.valence !== undefined || item.direction !== undefined) {
          return getValenceColor(tokens, item.valence !== undefined ? item.valence : item.direction, item.metricType || 'gain');
        }
      }
      const isLeaf = raw && raw.l !== undefined ? raw.l >= 1 : true;
      const gName = isLeaf ? (item && item[groupKey]) : (raw && raw.g);
      let gi = groupNames.indexOf(gName);
      if (gi < 0) gi = ctx.dataIndex !== undefined ? ctx.dataIndex : 0;
      const base = getColor(tokens, gi);
      if (!isLeaf) return base;
      const n = leafCount[gName] || 1;
      const k = leafRank[gName + '\u0000' + ((item && item.name) || '')] || 0;
      const t = n > 1 ? 0.12 + 0.38 * (k / (n - 1)) : 0.2;
      return mixHex(base, tokens.isDark ? '#000000' : '#FFFFFF', tokens.isDark ? t * 0.7 : t);
    };
    const textOn = (bg) => {
      const f = KitChartsTheme && KitChartsTheme.getContrastingTextColor;
      if (f) return f(bg, '#FFFFFF', '#0F172A');
      const c = hexToRgb(bg);
      return c && (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) < 140 ? '#FFFFFF' : '#0F172A';
    };
    const bgFn = typeof ds.backgroundColor === 'function' ? ds.backgroundColor : cellColor;

    return {
      tree: ds.tree || ds.data || [],
      key: ds.key || 'value',
      groups: ds.groups || ['category', 'name'],
      backgroundColor: ds.backgroundColor ? ds.backgroundColor : bgFn,
      borderColor: tokens.bg,
      borderWidth: isTufte ? 1 : 1.5,
      spacing: 1,
      labels: {
        display: showDataLabels,
        align: 'left',
        position: 'top',
        formatter: (ctx) => {
          if (!showDataLabels) return '';
          const raw = ctx.raw;
          const item = raw ? (raw._data || raw) : null;
          if (!item) return '';
          const name = item.name || item.category || '';
          const val = raw.v !== undefined ? raw.v : (item.value || '');
          return val ? `${name} (${val})` : name;
        },
        color: (ctx) => textOn(bgFn(ctx)),
        font: {
          family: tokens.fontFamily,
          size: 11,
          weight: '600'
        },
        padding: 4
      },
      captions: {
        display: true,
        color: (ctx) => textOn(bgFn(ctx)),
        font: { family: tokens.fontFamily, size: 12, weight: '700' }
      }
    };
  });

  const chartData = { datasets };

  // Options Chart.js v4+ pour Treemap avec capture de partition 2D
  const defaultOpts = getChartDefaultOptions(tokens);
  const config = {
    type: 'treemap',
    data: chartData,
    options: {
      scales: {},
      ...defaultOpts,
      animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
      interaction: {
        mode: 'nearest',
        intersect: true,
        axis: 'xy'
      },
      hover: {
        mode: 'nearest',
        intersect: true,
        animationDuration: (isTufte || isReducedMotionPreferred()) ? 0 : 100
      },
      plugins: {
        ...defaultOpts.plugins,
        legend: {
          display: false
        },
        tooltip: {
          ...defaultOpts.plugins.tooltip,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          titleFont: { family: tokens.fontFamily, size: 12, weight: '600' },
          bodyFont: { family: tokens.fontMono || 'monospace', size: 12, weight: '400' },
          animation: (isTufte || isReducedMotionPreferred()) ? false : { duration: 150, easing: 'easeOutQuad' },
          callbacks: {
            title: (items) => {
              if (!items || !items[0]) return '';
              const raw = items[0].raw;
              if (!raw) return '';
              const g = raw._data ? raw._data : raw;
              return g.name ? `${g.category || ''} > ${g.name}` : (g.category || '');
            },
            label: (context) => {
              const raw = context.raw;
              const val = raw && raw.v !== undefined ? raw.v : (raw && raw.value !== undefined ? raw.value : raw);
              const formatted = typeof val === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(val)
                : val;
              const tot = ctx0Total;
              const part = (typeof val === 'number' && tot > 0) ? ` (${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format((val / tot) * 100)}% du total)` : '';
              return ` Valeur : ${formatted}${unitTxt}${part}`;
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
