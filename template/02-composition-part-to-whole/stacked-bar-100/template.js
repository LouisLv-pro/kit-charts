/**
 * @file template/02-composition-part-to-whole/stacked-bar-100/template.js
 * @description Standardized Universal stacked-bar-100 Template for kit-charts.
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
    global.KitCharts['stacked-bar-100'] = exp;
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
 * @file 02-composition-part-to-whole/stacked-bar-100/template.js
 * @description Template Chart.js v4+ pour Barres Empilées 100% (100% Stacked Bar Chart).
 * Psychophysique: Comparaison normalisée de la composition relative entre multiples entités/groupes.
 * Règle d'or: beginAtZero: true sur Y, total normalisé à 100%, segments de base et de sommet stables.
 */

/**
 * Données par défaut représentatives (Répartition en % de l'état des projets par équipe opérationnelle)
 */
const DEFAULT_DATA = {
  labels: ['Équipe A', 'Équipe B', 'Équipe C', 'Équipe D'],
  datasets: [
    { label: 'Succès', data: [75, 60, 82, 90], valence: 1 },
    { label: 'En cours', data: [15, 25, 10, 5], valence: 0 },
    { label: 'Échec', data: [10, 15, 8, 5], valence: -1 }
  ]
};

/**
 * Crée et initialise un diagramme en barres empilées 100% dans le canvas cible.
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

  // Préparation des données avec support d'accentuation et de valence
  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels ? [...rawData.labels] : [];
  // Normalisation 100% : chaque catégorie est ramenée à sa somme (valeurs brutes conservées pour l'infobulle)
  const srcDatasets = rawData.datasets || [];
  const numOf = (v) => {
    const n = typeof v === 'object' && v !== null ? (v.value ?? v.y ?? v.v ?? 0) : v;
    return Number(n) || 0;
  };
  const colTotals = labels.map((_, i) => srcDatasets.reduce((acc, d) => acc + numOf((d.data || [])[i]), 0));
  const datasets = srcDatasets.map((ds, idx) => {
    const primaryColor = getColor(tokens, idx);

    let bgColors = ds.backgroundColor;
    let borderColors = ds.borderColor;
    let borderWidths = ds.borderWidth;

    if (!bgColors || ds.emphasisRole || ds.role || ds.valence !== undefined || ds.metricType) {
      if (ds.emphasisRole || ds.role) {
        const style = getEmphasisStyle(tokens, ds.emphasisRole || ds.role);
        bgColors = ds.backgroundColor || style.backgroundColor || primaryColor;
        borderColors = ds.borderColor || style.borderColor || primaryColor;
        borderWidths = typeof ds.borderWidth === 'number' ? ds.borderWidth : (style.borderWidth || 0);
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
      label: ds.label || `Segment ${idx + 1}`,
      data: Array.isArray(ds.data) ? ds.data.map((v, i) => (colTotals[i] > 0 ? (numOf(v) / colTotals[i]) * 100 : 0)) : [],
      rawValues: Array.isArray(ds.data) ? ds.data.map(numOf) : [],
      backgroundColor: bgColors,
      borderColor: borderColors,
      borderWidth: typeof borderWidths === 'number' ? borderWidths : 0,
      borderRadius: isTufte ? 0 : (idx === (rawData.datasets?.length || 1) - 1 ? 4 : 0),
      borderSkipped: false,
      categoryPercentage: typeof ds.categoryPercentage === 'number' ? ds.categoryPercentage : 0.8,
      barPercentage: typeof ds.barPercentage === 'number' ? ds.barPercentage : 0.9
    };
  });

  const chartData = { labels, datasets };

  // Segments trop petits pour porter leur étiquette (part < 5 % ou hauteur < 16 px, mêmes seuils
  // que le plugin commun) : la part est posée à droite de la barre, dans l'espace entre barres.
  const smallSegmentLabelsPlugin = {
    id: 'kitChartsSmallSegmentLabels',
    afterDatasetsDraw(chart) {
      if (!showDataLabels || chart.options?.showDataLabels === false) return;
      // Carte étroite : pas de place entre les barres, les parts se lisent à l'infobulle.
      if (chart.width < 420) return;
      const ctx = chart.ctx;
      const fs = 10;
      ctx.save();
      ctx.font = `600 ${fs}px ${tokens.fontMono || 'monospace'}`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      const ref = chart.getDatasetMeta(0);
      const count = ref && ref.data ? ref.data.length : 0;
      for (let i = 0; i < count; i++) {
        const items = [];
        chart.data.datasets.forEach((ds, di) => {
          const meta = chart.getDatasetMeta(di);
          if (!meta || meta.hidden) return;
          const el = meta.data[i];
          const v = ds.data[i];
          if (!el || !(v > 0)) return;
          const p = el.getProps ? el.getProps(['x', 'y', 'base', 'width'], true) : el;
          const segH = Math.abs(p.base - p.y);
          if (v / 100 >= 0.05 && segH >= 16) return; // déjà étiqueté dans le segment
          const color = Array.isArray(ds.backgroundColor) ? ds.backgroundColor[i] : ds.backgroundColor;
          if (segH >= 11) {
            // Segment bas mais lisible : part à l'intérieur, en police réduite
            const contrast = (KitChartsTheme && KitChartsTheme.getContrastingTextColor) ? KitChartsTheme.getContrastingTextColor(color) : '#0F172A';
            ctx.save();
            ctx.font = `600 9px ${tokens.fontMono || 'monospace'}`;
            ctx.textAlign = 'center';
            ctx.fillStyle = contrast;
            ctx.fillText(`${Math.round(v)}%`, p.x, (p.y + p.base) / 2);
            ctx.restore();
            return;
          }
          items.push({ y: (p.y + p.base) / 2, text: `${Math.round(v)}%`, color: color, x: p.x, w: p.width || 0, el: ref.data[i] });
        });
        if (!items.length) continue;
        items.sort((a, b) => a.y - b.y);
        for (let k = 1; k < items.length; k++) if (items[k].y - items[k - 1].y < 12) items[k].y = items[k - 1].y + 12;
        const first = items[0];
        const left = first.x + first.w / 2 + 4;
        const nextEl = ref.data[i + 1];
        const limit = nextEl ? (nextEl.x - (nextEl.width || 0) / 2) : chart.chartArea.right;
        items.forEach((it) => {
          const tw = ctx.measureText(it.text).width;
          if (limit - left < tw + 10) return;
          // Pastille de la couleur du segment : lie l'étiquette à sa série malgré le décalage
          ctx.fillStyle = it.color || '#999';
          ctx.fillRect(left, it.y - 3, 6, 6);
          ctx.fillStyle = tokens.textPrimary || '#0F172A';
          ctx.fillText(it.text, left + 9, it.y);
        });
      }
      ctx.restore();
    }
  };

  // Options Chart.js v4+ avec empilement 100% et capture Fitts 1D
  const defaultOpts = getChartDefaultOptions(tokens);
  const config = {
    type: 'bar',
    data: chartData,
    plugins: [smallSegmentLabelsPlugin],
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
          isPercent: true, // lu par le plugin de labels (les fonctions d'options sont résolues comme scriptables par Chart.js)
          formatter: (val) => {
            const num = typeof val === 'object' && val !== null ? (val.value ?? val.y ?? val.v ?? 0) : Number(val);
            return `${Math.round(num)}%`;
          }
        }),
        legend: {
          ...defaultOpts.plugins.legend,
          display: !isTufte,
          position: 'top',
          align: 'end',
          reverse: true // Aligne la légende visuelle avec l'ordre d'empilement
        },
        tooltip: {
          ...defaultOpts.plugins.tooltip,
          mode: 'index',
          intersect: false,
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
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(val)
                : val;
              const rv = context.dataset.rawValues && context.dataset.rawValues[context.dataIndex];
              const rawTxt = (typeof rv === 'number' && Math.abs(rv - val) > 0.05)
                ? ` (valeur : ${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(rv)})`
                : '';
              return ` ${context.dataset.label || ''}: ${formatted}%${rawTxt}`;
            }
          }
        }
      },
      scales: {
        x: {
          stacked: true, // Empilement sur l'axe X
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
          stacked: true, // Empilement sur l'axe Y
          beginAtZero: true, // Règle psychophysique absolue
          max: 100, // Plafond normalisé à 100%
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
            callback: (val) => `${val}%`
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
