/**
 * @file template/06-flux-processus/funnel-chart/template.js
 * @description Standardized Universal funnel-chart Template for kit-charts.
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
    global.KitCharts['funnel-chart'] = exp;
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
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function(t, r, o) { return { borderColor: '#2B8CBE', backgroundColor: '#2B8CBE', ...o }; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function(v, tr, th, p, t) { return {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function() { return {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function() { return {}; };
  const getPartitionInteractionOptions = (KitChartsTheme && KitChartsTheme.getPartitionInteractionOptions) || (typeof window !== 'undefined' && window.getPartitionInteractionOptions) || function() { return {}; };
  const getExecutiveModeOptions = (KitChartsTheme && KitChartsTheme.getExecutiveModeOptions) || (typeof window !== 'undefined' && window.getExecutiveModeOptions) || function() { return {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const kitChartsDataLabelsPlugin = (KitChartsTheme && KitChartsTheme.kitChartsDataLabelsPlugin) || (typeof window !== 'undefined' && window.kitChartsDataLabelsPlugin) || null;
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 06-flux-processus/funnel-chart/template.js
 * @description Standardized Funnel Chart template for kit-charts.
 * Visualizes sequential multi-stage conversion pipeline with monotonic drop-off.
 * Enforces horizontal orientation (indexAxis: 'y'), strict X=0 baseline, sorted stages, semantic emphasis, and Gestalt spacing.
 */


/**
 * Données par défaut représentatives (Entonnoir d'acquisition et de conversion SaaS)
 */
const DEFAULT_DATA = {
  labels: [
    '1. Visiteurs Uniques',
    '2. Inscriptions Gratuites',
    '3. Utilisateurs Actifs (WAU)',
    '4. Souscriptions Payantes',
    '5. Abonnés actifs à 3 mois'
  ],
  datasets: [{
    label: 'Volume Utilisateurs',
    data: [10000, 3200, 1450, 480, 390],
    role: 'focal'
  }]
};

/**
 * Creates and renders a centered Funnel Chart in the specified canvas target.
 * Chaque étape est une barre centrée de longueur proportionnelle à son effectif (axe symétrique),
 * avec le taux de rétention d'étape à étape affiché entre les barres.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - DOM Canvas ID or Canvas Element
 * @param {Object} [customData] - Optional user data payload
 * @param {string} [themeName='colorbrewer-accessible'] - Theme identifier
 * @param {Object} [options={}] - Additional options (e.g. showDataLabels)
 * @returns {Object} Initialized Chart.js instance or mock instance
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
  const canvas = typeof canvasTarget === 'string' && typeof document !== 'undefined'
    ? document.getElementById(canvasTarget)
    : canvasTarget;

  if (typeof Chart !== 'undefined' && canvas) {
    const existing = Chart.getChart(canvas);
    if (existing) {
      existing.destroy();
    }
  }

  const container = canvas && canvas.parentElement ? canvas.parentElement : null;
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const showDataLabels = (customData && customData.showDataLabels !== undefined) ? customData.showDataLabels : (options.showDataLabels !== undefined ? options.showDataLabels : true);

  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels ? [...rawData.labels] : [];
  const ds0 = (rawData.datasets && rawData.datasets[0]) || { data: [] };
  const values = (Array.isArray(ds0.data) ? ds0.data : []).map(v => {
    const n = typeof v === 'object' && v !== null ? (v.value ?? v.x ?? 0) : Number(v);
    return isFinite(n) && n > 0 ? n : 0;
  });
  const maxV = values.reduce((a, b) => Math.max(a, b), 0) || 1;
  const fmt = (v) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(v);
  const pctFmt = (p) => `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(p)} %`;

  const barColor = ds0.backgroundColor && typeof ds0.backgroundColor === 'string' ? ds0.backgroundColor : getColor(tokens, 0);

  // Luminance relative (WCAG) pour choisir le texte lisible sur la couleur de barre
  const toRgb = (c) => {
    if (typeof c !== 'string') return [0, 0, 0];
    const h = c.trim();
    if (h[0] === '#') {
      const x = h.length === 4 ? h.slice(1).split('').map(ch => ch + ch).join('') : h.slice(1, 7);
      return [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2, 4), 16), parseInt(x.slice(4, 6), 16)];
    }
    const m = h.match(/\d+(\.\d+)?/g);
    return m ? m.slice(0, 3).map(Number) : [0, 0, 0];
  };
  const luminance = (c) => {
    const [r, g, b] = toRgb(c).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrast = (a, b) => { const l1 = luminance(a), l2 = luminance(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
  const textOnBar = contrast('#0F172A', barColor) >= contrast('#FFFFFF', barColor) ? '#0F172A' : '#FFFFFF';

  const funnelPlugin = {
    id: 'kitChartsFunnelLabels',
    afterDatasetsDraw(chart) {
      const meta = chart.getDatasetMeta(0);
      if (!meta || !meta.data) return;
      const { ctx } = chart;
      ctx.save();
      ctx.textBaseline = 'middle';
      meta.data.forEach((bar, i) => {
        const p = bar.getProps(['x', 'y', 'base', 'height'], true);
        const left = Math.min(p.x, p.base), right = Math.max(p.x, p.base);
        const cx = (left + right) / 2;
        const w = right - left;
        if (showDataLabels) {
          const txt = fmt(values[i]);
          ctx.font = `700 12px ${tokens.fontMono || tokens.fontFamily}`;
          ctx.textAlign = 'center';
          if (ctx.measureText(txt).width + 10 <= w) {
            ctx.fillStyle = textOnBar;
            ctx.fillText(txt, cx, p.y);
          } else {
            ctx.fillStyle = tokens.textPrimary;
            ctx.textAlign = 'left';
            ctx.fillText(txt, right + 8, p.y);
          }
        }
        // Taux de rétention vers l'étape suivante (toujours affiché) : placé entre cette barre et la suivante
        if (i < values.length - 1 && values[i] > 0) {
          const next = meta.data[i + 1].getProps(['y', 'height'], true);
          const yMid = (p.y + p.height / 2 + next.y - next.height / 2) / 2;
          const compact = chart.width < 460;
          ctx.font = `600 ${compact ? 10 : 11}px ${tokens.fontMono || tokens.fontFamily}`;
          ctx.fillStyle = tokens.textSecondary || tokens.textPrimary;
          ctx.textAlign = 'center';
          const rate = pctFmt((values[i + 1] / values[i]) * 100);
          const full = `↓ ${rate} passent à l'étape suivante`;
          const short = `↓ ${rate} passent`;
          const ca = chart.chartArea;
          const avail = ca ? ca.right - ca.left : chart.width;
          const txt = ctx.measureText(full).width <= avail ? full : short;
          const tw = ctx.measureText(txt).width;
          // Centré sur la barre, mais jamais hors de la zone du tracé
          let tx = cx;
          if (ca) tx = Math.min(Math.max(cx, ca.left + tw / 2), ca.right - tw / 2);
          ctx.fillText(txt, tx, yMid);
        }
      });
      ctx.restore();
    }
  };

  const chartData = {
    labels,
    datasets: [{
      label: ds0.label || 'Étape',
      data: values.map(v => [-v / 2, v / 2]),
      backgroundColor: barColor,
      borderColor: isTufte ? tokens.borderStrong : tokens.bg,
      borderWidth: 1,
      borderRadius: isTufte ? 0 : 4,
      categoryPercentage: 0.9,
      barPercentage: 0.62
    }]
  };
  const baseOptions = getChartDefaultOptions(tokens);

  const config = {
    type: 'bar',
    data: chartData,
    options: {
      ...baseOptions,
      indexAxis: 'y', // Barres horizontales centrées (axe de valeur symétrique autour de 0)
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: 'index', intersect: false, axis: 'y' },
      layout: { padding: { right: 12 } },
      scales: {
        x: {
          type: 'linear',
          beginAtZero: true,
          min: -maxV / 2,
          max: maxV / 2,
          display: false,
          grid: { display: false }
        },
        y: {
          reverse: false,
          grid: { display: false },
          border: { display: false },
          ticks: {
            color: tokens.textPrimary,
            font: { family: tokens.fontFamily, size: 12, weight: '500' },
            padding: 8,
            callback(v) {
              const t = this.getLabelForValue(v);
              return this.chart.width < 460 && String(t).length > 22 ? String(t).replace(/\s*\(.*\)\s*$/, '') : t;
            }
          }
        }
      },
      plugins: {
        datalabels: { display: false },
        legend: { display: false },
        tooltip: {
          backgroundColor: tokens.tooltipBg || '#0F172A',
          titleColor: tokens.tooltipText || '#F8FAFC',
          bodyColor: tokens.tooltipText || '#F8FAFC',
          borderColor: tokens.borderStrong || tokens.border || '#334155',
          borderWidth: 1,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          boxPadding: 6,
          titleFont: { family: tokens.fontFamily, size: 12, weight: '600' },
          bodyFont: { family: tokens.fontMono, size: 12, weight: '400' },
          callbacks: {
            label: (ctx) => {
              const i = ctx.dataIndex;
              const cur = values[i];
              const prev = i > 0 ? values[i - 1] : cur;
              const first = values[0] || cur || 1;
              const step = i > 0 && prev > 0 ? (cur / prev) * 100 : 100;
              return [
                ` Effectif : ${fmt(cur)}`,
                ` Conversion globale : ${pctFmt((cur / first) * 100)}`,
                ` Rétention étape précédente : ${pctFmt(step)}`,
                ` Déperdition : ${pctFmt(100 - step)}`
              ];
            }
          }
        }
      }
    },
    plugins: [funnelPlugin]
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }

  // Headless test fallback mock
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
