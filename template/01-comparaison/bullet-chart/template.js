/**
 * @file template/01-comparaison/bullet-chart/template.js
 * @description Standardized Universal bullet-chart Template for kit-charts.
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
    global.KitCharts['bullet-chart'] = exp;
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
  const resolveThresholds = (KitChartsTheme && KitChartsTheme.resolveThresholds) || (typeof window !== 'undefined' && window.resolveThresholds) || null;
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };

  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function(t, o) { return o || {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return o || {}; };
  const getPartitionInteractionOptions = (KitChartsTheme && KitChartsTheme.getPartitionInteractionOptions) || (typeof window !== 'undefined' && window.getPartitionInteractionOptions) || function(t, o) { return o || {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const kitChartsDataLabelsPlugin = (KitChartsTheme && KitChartsTheme.kitChartsDataLabelsPlugin) || (typeof window !== 'undefined' && window.kitChartsDataLabelsPlugin) || null;
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };
  const getContrastingTextColor = (KitChartsTheme && KitChartsTheme.getContrastingTextColor) || (typeof window !== 'undefined' && window.getContrastingTextColor) || function() { return '#FFFFFF'; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 01-comparaison/bullet-chart/template.js
 * @description Template Chart.js v4+ pour Graphique à Puces (Stephen Few Bullet Chart).
 * Psychophysique: Remplacement compact et dense des cadrans/jauges analogiques.
 * Règle d'or: beginAtZero: true sur X, bande de performance, seuils qualitatifs et cible.
 */

/**
 * Données par défaut représentatives (Performance commerciale vs objectifs et paliers)
 */
const DEFAULT_DATA = {
  labels: ['Ventes EMEA', 'Ventes APAC', 'Ventes AMER'],
  datasets: [
    { label: 'Réalisé', data: [275, 185, 310] },
    { label: 'Objectif', data: [250, 200, 300] },
    { label: 'Excellent', data: [300, 250, 350] },
    { label: 'Moyen', data: [200, 150, 250] },
    { label: 'Faible', data: [100, 75, 120] }
  ]
};

/**
 * Crée et initialise un graphique à puces (Bullet Chart) dans le canvas cible.
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
  const isDark = Boolean(tokens.isDark);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const showDataLabels = (customData && customData.showDataLabels !== undefined) ? customData.showDataLabels : (options.showDataLabels !== undefined ? options.showDataLabels : true);

  // Préparation des données
  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels ? [...rawData.labels] : [];
  const rawDatasets = rawData.datasets || [];

  const focalStyle = getEmphasisStyle(tokens, 'focal');
  const benchmarkStyle = getEmphasisStyle(tokens, 'benchmark');

  const datasets = rawDatasets.map((ds, idx) => {
    const label = (ds.label || '').toLowerCase();
    const primaryColor = focalStyle.backgroundColor || getColor(tokens, 0);

    // 1. Barre de performance principale (Réalisé)
    if (label.includes('réalisé') || label.includes('actual') || idx === 0) {
      let bg = ds.backgroundColor;
      if (!bg) {
        if (ds.emphasisRole || ds.role) {
          bg = getEmphasisStyle(tokens, ds.emphasisRole || ds.role).backgroundColor;
        } else if (ds.metricType || ds.valence !== undefined) {
          bg = getValenceColor(tokens, ds.valence !== undefined ? ds.valence : 1, ds.metricType || 'gain');
        } else {
          bg = primaryColor;
        }
      }

      return {
        label: ds.label || 'Réalisé',
        type: 'bar',
        data: Array.isArray(ds.data) ? [...ds.data] : [],
        backgroundColor: bg,
        borderColor: ds.borderColor || bg,
        borderWidth: 0,
        borderRadius: isTufte ? 0 : 3,
        grouped: false, // superposition : la mesure se dessine devant les paliers
        barPercentage: 0.32,
        categoryPercentage: 0.7,
        order: 1
      };
    }

    // 2. Marqueur d'objectif cible (Objectif / Target / Cible / Benchmark)
    if (label.includes('objectif') || label.includes('target') || label.includes('cible') || label.includes('benchmark') || idx === 1) {
      const benchmarkColor = benchmarkStyle.borderColor || tokens.emphasis?.benchmark || tokens.textPrimary;
      return {
        label: ds.label || 'Objectif',
        type: 'scatter',
        data: (Array.isArray(ds.data) ? ds.data : []).map((val, i) => ({
          x: typeof val === 'object' && val !== null ? (val.x ?? val.value ?? 0) : Number(val),
          y: labels[i] || i
        })),
        backgroundColor: benchmarkColor,
        borderColor: benchmarkColor,
        pointStyle: 'line',
        pointRotation: 90,
        pointRadius: 12,
        pointHoverRadius: 14,
        borderWidth: 3,
        order: 0
      };
    }

    // 3. Paliers de contexte qualitatif : bandes superposées, le plus large derrière,
    // dégradé de gris (le palier le plus bas est le plus sombre, convention Few).
    const bandIdxs = rawDatasets.map((d, i) => i).filter(i => {
      const l = (rawDatasets[i].label || '').toLowerCase();
      return i > 1 && !(l.includes('réalisé') || l.includes('actual') || l.includes('objectif') || l.includes('target') || l.includes('cible') || l.includes('benchmark'));
    });
    const bandSum = (i) => (Array.isArray(rawDatasets[i].data) ? rawDatasets[i].data : []).reduce((a, v) => a + (Number(v) || 0), 0);
    const bandsAsc = bandIdxs.slice().sort((a, b) => bandSum(a) - bandSum(b));
    const bandRank = Math.max(0, bandsAsc.indexOf(idx));
    const bandCount = Math.max(1, bandsAsc.length);
    const lightShades = ['#94A3B8', '#CBD5E1', '#E2E8F0', '#F1F5F9'];
    const darkShades = ['#8693B0', '#65728F', '#4A566F', '#3E4860']; // le palier le plus large reste nettement plus clair que le fond sombre
    const shades = isDark ? darkShades : lightShades;
    const shadeIdx = bandCount === 1 ? 1 : Math.min(shades.length - 1, Math.round(bandRank * (Math.min(3, bandCount) - 1) / (bandCount - 1)));
    const bandColor = shades[shadeIdx];

    return {
      label: ds.label || `Palier ${idx}`,
      type: 'bar',
      data: Array.isArray(ds.data) ? [...ds.data] : [],
      backgroundColor: ds.backgroundColor || bandColor,
      borderColor: ds.borderColor || bandColor,
      borderWidth: 0,
      borderRadius: 0,
      grouped: false,
      barPercentage: 1.0,
      categoryPercentage: 0.7,
      order: 10 + bandRank // ordre élevé = dessiné en premier : le plus large derrière, le plus petit devant
    };
  });

  const chartData = { labels, datasets };

  // Étiquette de valeur de la mesure, posée par le template (le plugin commun place toujours
  // le texte 8 px après la barre, même quand le trait de cible s'y trouve).
  // Règle : à droite de la barre ; si le trait de cible tombe dans la zone du texte, le texte
  // passe de l'autre côté du trait ; faute de place à droite, il rentre dans la barre.
  const measureIdx = datasets.findIndex(d => d.type === 'bar' && d.order === 1);
  const targetIdx = datasets.findIndex(d => d.type === 'scatter');
  const labelFont = `600 11px ${tokens.fontMono || 'monospace'}`;
  const labelColor = isDark ? '#ECEFF4' : '#0F172A';
  const nfLabel = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 });
  const valueLabelsPlugin = {
    id: 'bulletValueLabels',
    afterDatasetsDraw(chart) {
      if (!showDataLabels || measureIdx < 0) return;
      const area = chart.chartArea;
      const meta = chart.getDatasetMeta(measureIdx);
      if (!area || !meta || meta.hidden || !chart.isDatasetVisible(measureIdx)) return;
      const tMeta = targetIdx >= 0 && chart.isDatasetVisible(targetIdx) ? chart.getDatasetMeta(targetIdx) : null;
      const ds = chart.data.datasets[measureIdx];
      const ctx = chart.ctx;
      const GAP = 8;      // écart entre la barre (ou le trait) et le texte
      const CLEAR = 6;    // demi-largeur protégée autour du trait de cible (trait de 3 px + marge)
      ctx.save();
      ctx.font = labelFont;
      ctx.textBaseline = 'middle';
      meta.data.forEach((el, i) => {
        const raw = ds.data[i];
        const v = typeof raw === 'object' && raw !== null ? (raw.x ?? raw.value) : raw;
        if (!el || typeof v !== 'number' || !Number.isFinite(v)) return;
        const p = el.getProps ? el.getProps(['x', 'y', 'base'], true) : el;
        const barLeft = Math.min(p.base, p.x);
        const barRight = Math.max(p.base, p.x);
        const text = nfLabel.format(v);
        const tw = ctx.measureText(text).width;
        const tp = tMeta && tMeta.data && tMeta.data[i];
        const tx = tp && Number.isFinite(tp.x) ? tp.x : null;
        const hitsTarget = (x0) => tx !== null && x0 < tx + CLEAR && x0 + tw > tx - CLEAR;
        const maxRight = chart.width - 2;
        let x0 = barRight + GAP;
        let color = labelColor;
        if (hitsTarget(x0)) x0 = tx + CLEAR + GAP / 2;
        if (x0 + tw > maxRight) {
          // Pas de place à droite : dans la barre, calé avant la cible si elle y tombe
          const end = (tx !== null && tx < barRight ? tx - CLEAR : barRight) - GAP / 2;
          if (end - tw >= barLeft + 4) {
            x0 = end - tw;
            const bg = Array.isArray(ds.backgroundColor) ? ds.backgroundColor[i] : ds.backgroundColor;
            color = getContrastingTextColor(bg);
          } else {
            x0 = Math.max(area.left, maxRight - tw);
          }
        }
        ctx.fillStyle = color;
        ctx.textAlign = 'left';
        ctx.fillText(text, x0, p.y);
      });
      ctx.restore();
    }
  };

  // Options Chart.js v4+
  const defaultOpts = getChartDefaultOptions(tokens);
  const config = {
    type: 'bar',
    data: chartData,
    plugins: [valueLabelsPlugin],
    options: {
      ...defaultOpts,
      indexAxis: 'y', // Orientation horizontale Stephen Few
      animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
      interaction: {
        mode: 'index',
        intersect: false,
        axis: 'y'
      },
      hover: {
        mode: 'index',
        intersect: false,
        axis: 'y',
        animationDuration: (isTufte || isReducedMotionPreferred()) ? 0 : 100
      },
      categoryPercentage: 0.8,
      barPercentage: 0.9,
      plugins: {
        ...defaultOpts.plugins,
        // Plugin commun désactivé : l'étiquette est posée par bulletValueLabels (évitement de la cible)
        datalabels: getDataLabelOptions(tokens, {
          display: false,
          anchor: 'end',
          align: 'right',
          offset: 8,
          clip: false,
          color: isDark ? '#ECEFF4' : '#0F172A',
          font: {
            family: tokens.fontMono || 'monospace',
            size: 11,
            weight: '600'
          },
          formatter: (val, ctx) => {
            // Only label dataset 0 (Réalisé)
            if (ctx && ctx.datasetIndex !== 0) return null;
            const rawVal = typeof val === 'object' && val !== null ? (val.x ?? val.value ?? 0) : val;
            if (typeof rawVal === 'number') {
              return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(rawVal) ;
            }
            return String(rawVal || '');
          }
        }),
        legend: {
          ...defaultOpts.plugins.legend,
          display: !isTufte,
          position: 'top',
          align: 'end',
          labels: {
            usePointStyle: true,
            boxWidth: 10,
            boxHeight: 10,
            color: tokens.textPrimary,
            font: {
              family: tokens.fontFamily,
              size: 11,
              weight: '500'
            }
          }
        },
        tooltip: {
          ...defaultOpts.plugins.tooltip,
          usePointStyle: true,
          boxWidth: 10,
          boxHeight: 10,
          boxPadding: 4,
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
            title: (items) => {
              if (!items || items.length === 0) return '';
              return items[0].label || '';
            },
            label: (context) => {
              const ds = context.dataset;
              const rawVal = context.raw;
              const val = typeof rawVal === 'object' && rawVal !== null
                ? (rawVal.x ?? rawVal.y ?? 0)
                : rawVal;
              const formatted = typeof val === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(val)
                : val;
              return ` ${ds.label || ''}: ${formatted}`;
            },
            labelColor: (context) => {
              const ds = context.dataset;
              const bg = Array.isArray(ds.backgroundColor) ? ds.backgroundColor[context.dataIndex] : ds.backgroundColor;
              const border = Array.isArray(ds.borderColor) ? ds.borderColor[context.dataIndex] : (ds.borderColor || bg);
              return {
                borderColor: border,
                backgroundColor: bg,
                borderWidth: 1,
                borderRadius: 2
              };
            },
            labelPointStyle: (context) => {
              return {
                pointStyle: 'circle',
                rotation: 0
              };
            }
          }
        }
      },
      scales: {
        y: {
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
        x: {
          beginAtZero: true, // Règle psychophysique obligatoire
          grace: '15%', // Espace suffisant pour les étiquettes à droite
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
