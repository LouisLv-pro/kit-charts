/**
 * @file template/01-comparaison/polar-area-chart/template.js
 * @description Standardized Universal polar-area-chart Template for kit-charts.
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
    global.KitCharts['polar-area-chart'] = exp;
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
  const getContrastingTextColor = (KitChartsTheme && KitChartsTheme.getContrastingTextColor) || (typeof window !== 'undefined' && window.getContrastingTextColor) || null;
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 01-comparaison/polar-area-chart/template.js
 * @description Template Chart.js v4+ pour Diagramme de Zone Polaire (Florence Nightingale Polar Area Chart).
 * Psychophysique: Encodage cyclique ou directionnel par rayon variable sur angles constants.
 * Règle d'or: Angles de secteurs égaux, échelle radiale proportionnelle, séparation nette par fond.
 */

/**
 * Données par défaut représentatives (Distribution directionnelle des flux en 8 secteurs cardinaux)
 */
const DEFAULT_DATA = {
  labels: ['Nord', 'Nord-Est', 'Est', 'Sud-Est', 'Sud', 'Sud-Ouest', 'Ouest', 'Nord-Ouest'],
  datasets: [{
    data: [42, 28, 35, 18, 50, 32, 45, 22]
  }]
};


/**
 * Étiquettes de valeurs réelles au centre des secteurs (le rayon porte √V, pas V).
 */
const polarValueLabelsPlugin = {
  id: 'kcPolarValueLabels',
  afterDatasetsDraw(chart) {
    if (chart.options?.showDataLabels === false) return;
    const tokens = chart.options?._kitChartsTokens || {};
    const ctx = chart.ctx;
    ctx.save();
    ctx.font = `600 11px ${tokens.fontMono || 'monospace'}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    chart.data.datasets.forEach((ds, di) => {
      const meta = chart.getDatasetMeta(di);
      if (!meta || meta.hidden) return;
      (meta.data || []).forEach((arc, i) => {
        const raw = ds.rawValues ? ds.rawValues[i] : ds.data[i];
        if (raw === null || raw === undefined || !arc) return;
        const p = arc.getProps(['startAngle', 'endAngle', 'outerRadius', 'x', 'y'], true);
        const r = p.outerRadius * 0.62;
        if (r < 14) return;
        const a = (p.startAngle + p.endAngle) / 2;
        const bg = Array.isArray(ds.backgroundColor) ? ds.backgroundColor[i] : ds.backgroundColor;
        ctx.fillStyle = (typeof getContrastingTextColor === 'function' ? getContrastingTextColor(bg) : '#0F172A');
        const txt = typeof raw === 'number' && Math.abs(raw) >= 1000
          ? new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(raw)
          : new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(raw);
        ctx.fillText(txt, p.x + Math.cos(a) * r, p.y + Math.sin(a) * r);
      });
    });
    ctx.restore();
  }
};

/**
 * Crée et initialise un diagramme polaire (Polar Area Chart) dans le canvas cible.
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
  const datasets = (rawData.datasets || []).map((ds, idx) => {
    const dataLen = Array.isArray(ds.data) ? ds.data.length : labels.length;
    let bgColors = ds.backgroundColor;

    if (!bgColors || Array.isArray(ds.emphasisRoles) || Array.isArray(ds.roles) || Array.isArray(ds.valences) || ds.focusIndex !== undefined) {
      if (Array.isArray(ds.emphasisRoles) || Array.isArray(ds.roles)) {
        const roles = ds.emphasisRoles || ds.roles;
        bgColors = roles.map((r, i) => getEmphasisStyle(tokens, r).backgroundColor || getColor(tokens, i));
      } else if (Array.isArray(ds.valences)) {
        const metricType = ds.metricType || 'gain';
        bgColors = ds.valences.map(v => getValenceColor(tokens, v, metricType));
      } else if (ds.focusIndex !== undefined) {
        bgColors = Array.from({ length: dataLen }, (_, i) =>
          i === ds.focusIndex ? (tokens.emphasis?.focal || getColor(tokens, 0)) : (tokens.emphasis?.context || tokens.textMuted || '#CBD5E1')
        );
      } else if (!Array.isArray(bgColors)) {
        // Teinte unique : les directions sont déjà portées par les étiquettes angulaires
        const mono = getColor(tokens, 0);
        bgColors = Array.from({ length: dataLen }, () => mono);
      }
    }

    const rawValues = Array.isArray(ds.data) ? [...ds.data] : [];
    return {
      label: ds.label || 'Valeur',
      rawValues,
      // Nightingale : rayon = racine de la valeur pour que l'AIRE soit proportionnelle à la valeur
      data: rawValues.map(v => Math.sqrt(Math.max(0, Number(v) || 0))),
      backgroundColor: bgColors,
      borderColor: tokens.bg,
      borderWidth: isTufte ? 1 : 2
    };
  });

  const chartData = { labels, datasets };

  // Options Chart.js v4+ avec respect des partitions polaires Fitts
  const defaultOpts = getChartDefaultOptions(tokens);
  const config = {
    type: 'polarArea',
    data: chartData,
    plugins: [polarValueLabelsPlugin],
    options: {
      ...defaultOpts,
      animation: getAccessibleAnimationOptions(tokens, { duration: 450, easing: 'easeOutQuart' }),
      interaction: {
        mode: 'nearest',
        intersect: true,
        axis: 'xy'
      },
      hover: {
        mode: 'nearest',
        intersect: true,
        animationDuration: (isTufte || isReducedMotionPreferred()) ? 0 : 120
      },
      plugins: {
        ...defaultOpts.plugins,
        // Étiquettes dessinées par le plugin local (valeurs réelles, pas les rayons √V)
        datalabels: getDataLabelOptions(tokens, { display: false }),
        legend: {
          ...defaultOpts.plugins.legend,
          display: false,
          position: 'right',
          align: 'center'
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
              const rv = context.dataset.rawValues;
              const val = rv ? rv[context.dataIndex] : context.raw;
              const formatted = typeof val === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(val)
                : val;
              return ` ${context.label || ''}: ${formatted}`;
            }
          }
        }
      },
      scales: {
        x: { display: false },
        y: { display: false },
        r: {
          angleLines: {
            color: tokens.gridColor,
            lineWidth: 1
          },
          grid: {
            color: tokens.border || tokens.gridColor,
            lineWidth: 1
          },
          // Centre chaque secteur sur sa direction (Nord = haut) : décalage d'une demi-part
          startAngle: labels.length > 0 ? -180 / labels.length : 0,
          // Libellés de direction autour du cercle (remplacent la légende)
          pointLabels: {
            display: true,
            centerPointLabels: true,
            color: tokens.textPrimary,
            font: { family: tokens.fontFamily, size: 11, weight: '500' },
            padding: 6
          },
          // Anneaux positionnés sur des valeurs réelles rondes (échelle racine)
          afterBuildTicks: (scale) => {
            const maxRaw = scale.max * scale.max;
            const steps = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 5000, 10000, 100000];
            const step = steps.find(st => maxRaw / st <= 5) || steps[steps.length - 1];
            const ticks = [];
            for (let v = step; v <= maxRaw * 1.0001; v += step) ticks.push({ value: Math.sqrt(v) });
            scale.ticks = ticks;
          },
          ticks: {
            display: false
          },
          min: 0,
          suggestedMin: 0
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
