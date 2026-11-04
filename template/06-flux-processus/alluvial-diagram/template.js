/**
 * @file template/06-flux-processus/alluvial-diagram/template.js
 * @description Standardized Universal alluvial-diagram Template for kit-charts.
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
    global.KitCharts['alluvial-diagram'] = exp;
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
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 06-flux-processus/alluvial-diagram/template.js
 * @description Standardized Alluvial Diagram template for kit-charts.
 * Les mêmes catégories sont répétées à chaque étape (strates alignées en colonnes) ; chaque flux
 * prend la couleur de sa catégorie d'origine. Chart.js + chartjs-chart-sankey, plugin d'en-têtes d'étapes.
 */

/**
 * Données par défaut : migration d'une cohorte de 1 500 utilisateurs entre les mêmes
 * états (Gratuit, Pro, Entreprise, Désabonné) sur trois trimestres. Conservation par étape.
 */
const DEFAULT_DATA = {
  stages: ['T1 2025', 'T2 2025', 'T3 2025'],
  datasets: [{
    label: 'Migration de la cohorte (utilisateurs)',
    data: [
      { from: 'Gratuit', to: 'Gratuit', fromStage: 'T1 2025', toStage: 'T2 2025', flow: 650 },
      { from: 'Gratuit', to: 'Pro', fromStage: 'T1 2025', toStage: 'T2 2025', flow: 200 },
      { from: 'Gratuit', to: 'Désabonné', fromStage: 'T1 2025', toStage: 'T2 2025', flow: 150, valence: 'negative' },
      { from: 'Pro', to: 'Pro', fromStage: 'T1 2025', toStage: 'T2 2025', flow: 330 },
      { from: 'Pro', to: 'Entreprise', fromStage: 'T1 2025', toStage: 'T2 2025', flow: 40 },
      { from: 'Pro', to: 'Désabonné', fromStage: 'T1 2025', toStage: 'T2 2025', flow: 30, valence: 'negative' },
      { from: 'Entreprise', to: 'Entreprise', fromStage: 'T1 2025', toStage: 'T2 2025', flow: 95 },
      { from: 'Entreprise', to: 'Désabonné', fromStage: 'T1 2025', toStage: 'T2 2025', flow: 5, valence: 'negative' },
      { from: 'Gratuit', to: 'Gratuit', fromStage: 'T2 2025', toStage: 'T3 2025', flow: 480 },
      { from: 'Gratuit', to: 'Pro', fromStage: 'T2 2025', toStage: 'T3 2025', flow: 120 },
      { from: 'Gratuit', to: 'Désabonné', fromStage: 'T2 2025', toStage: 'T3 2025', flow: 50, valence: 'negative' },
      { from: 'Pro', to: 'Pro', fromStage: 'T2 2025', toStage: 'T3 2025', flow: 440 },
      { from: 'Pro', to: 'Entreprise', fromStage: 'T2 2025', toStage: 'T3 2025', flow: 50 },
      { from: 'Pro', to: 'Désabonné', fromStage: 'T2 2025', toStage: 'T3 2025', flow: 40, valence: 'negative' },
      { from: 'Entreprise', to: 'Entreprise', fromStage: 'T2 2025', toStage: 'T3 2025', flow: 128 },
      { from: 'Entreprise', to: 'Désabonné', fromStage: 'T2 2025', toStage: 'T3 2025', flow: 7, valence: 'negative' },
      { from: 'Désabonné', to: 'Désabonné', fromStage: 'T2 2025', toStage: 'T3 2025', flow: 185, valence: 'negative' }
    ]
  }]
};

/**
 * Creates and renders an Alluvial Diagram in the specified canvas target.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - DOM Canvas ID or Canvas Element
 * @param {Object} [customData] - Optional user data payload
 * @param {string} [themeName='colorbrewer-accessible'] - Theme identifier
 * @param {Object} [options] - Options (showDataLabels)
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
  const showDataLabels = (customData && customData.showDataLabels !== undefined)
    ? customData.showDataLabels
    : (options && options.showDataLabels !== undefined ? options.showDataLabels : true);

  const rawData = customData || DEFAULT_DATA;
  const rawDatasets = rawData.datasets || [];
  const stages = Array.isArray(rawData.stages) ? rawData.stages : [];
  const fmt = (v) => (typeof v === 'number' ? v.toLocaleString('fr-FR') : v);

  const datasets = rawDatasets.map((ds, dsIdx) => {
    const flowItems = Array.isArray(ds.data) ? ds.data : [];
    const keyOf = (name, stage) => (stage === undefined || stage === null ? name : `${name}@${stage}`);
    const flowData = flowItems.map(it => ({
      ...it,
      from: keyOf(it.from, it.fromStage),
      to: keyOf(it.to, it.toStage),
      fromName: it.from,
      toName: it.to
    }));

    // Catégories (ordre d'apparition) et couleur par catégorie ; catégorie "négative" = destination de flux négatifs
    const categories = [];
    const negative = new Set();
    flowItems.forEach(it => {
      [it.from, it.to].forEach(c => { if (categories.indexOf(c) < 0) categories.push(c); });
      if (it.valence === 'negative') negative.add(it.to);
    });
    categories.sort((a, b) => (negative.has(a) ? 1 : 0) - (negative.has(b) ? 1 : 0));
    const negColor = (tokens.semantic && tokens.semantic.negative) || '#C62828';
    let paletteIdx = 0;
    const catColor = {};
    categories.forEach(c => {
      catColor[c] = negative.has(c) ? negColor : getColor(tokens, paletteIdx++);
    });

    // Colonnes et ordre vertical identique à chaque étape
    const column = {};
    const priority = {};
    const labels = {};
    const nodeTotals = {};
    flowData.forEach(f => {
      [['from', 'fromStage', 'fromName'], ['to', 'toStage', 'toName']].forEach(([k, s, n]) => {
        const key = f[k];
        const stageIdx = stages.indexOf(f[s]);
        if (stageIdx >= 0) column[key] = stageIdx;
        priority[key] = categories.indexOf(f[n]);
        labels[key] = f[n];
      });
    });
    const outSum = {}, inSum = {};
    flowData.forEach(f => {
      outSum[f.from] = (outSum[f.from] || 0) + (Number(f.flow) || 0);
      inSum[f.to] = (inSum[f.to] || 0) + (Number(f.flow) || 0);
    });
    const shortLabels = {};
    Object.keys(labels).forEach(key => {
      shortLabels[key] = labels[key];
      nodeTotals[key] = Math.max(outSum[key] || 0, inSum[key] || 0);
      if (showDataLabels) labels[key] = `${labels[key]} · ${fmt(nodeTotals[key])}`;
    });

    return {
      label: ds.label || `Flux ${dsIdx + 1}`,
      data: flowData,
      colorFrom: (ctx) => {
        const item = ctx.dataset && ctx.dataset.data && ctx.dataset.data[ctx.dataIndex];
        return catColor[item && item.fromName] || getColor(tokens, 0);
      },
      colorTo: (ctx) => {
        const item = ctx.dataset && ctx.dataset.data && ctx.dataset.data[ctx.dataIndex];
        return catColor[item && item.toName] || getColor(tokens, 0);
      },
      colorMode: 'from',
      borderWidth: 0,
      nodeWidth: ds.nodeWidth ?? 16,
      nodePadding: ds.nodePadding ?? 18,
      color: tokens.textPrimary,
      font: { family: tokens.fontFamily, size: 12, weight: '600' },
      ...(Object.keys(column).length ? { column } : {}),
      priority,
      labels: Object.keys(labels).reduce((m, k) => { m[k] = ' '; return m; }, {}),
      kcLabels: labels,
      kcShort: shortLabels,
      backgroundColor: ds.backgroundColor || getColor(tokens, dsIdx)
    };
  });

  // Libellés de nœuds dessinés ici (et non par chartjs-chart-sankey) : halo de la couleur de fond pour
  // garantir le contraste sur les rubans, et résolution des chevauchements verticaux par colonne.
  const nodeLabelPlugin = {
    id: 'kitChartsSankeyNodeLabels',
    afterDatasetsDraw(chart) {
      const meta = chart.getDatasetMeta(0);
      const ctrl = meta && meta.controller;
      const nodes = ctrl && ctrl._nodes;
      const xs = meta && meta.xScale, ys = meta && meta.yScale;
      const ds = chart.data.datasets[0];
      if (!nodes || !xs || !ys || !ds || !chart.chartArea) return;
      const { ctx, chartArea } = chart;
      const size = chart.width < 460 ? 11 : 12;
      const lineH = size + 3;
      const nodeW = ds.nodeWidth || 14;
      const texts = ds.kcLabels || {};
      const shorts = ds.kcShort || {};
      const halo = tokens.surfaceRaised || tokens.bg || '#FFFFFF';
      const groups = {};
      nodes.forEach((n) => {
        const px = xs.getPixelForValue(n.x);
        const top = ys.getPixelForValue(n.y);
        const h = Math.abs(ys.getPixelForValue(n.y + Math.max(n.in || n.out, n.out || n.in)) - top);
        const left = px < chartArea.left + (chartArea.right - chartArea.left) / 2;
        const key = (left ? 'L' : 'R') + Math.round(px);
        (groups[key] = groups[key] || []).push({
          text: String(chart.width < 460 && h < 26 && shorts[n.key] !== undefined ? shorts[n.key] : (texts[n.key] !== undefined ? texts[n.key] : n.key)),
          left, y: top + h / 2, x: left ? px + nodeW + 4 : px - 4
        });
      });
      ctx.save();
      ctx.font = `600 ${size}px ${tokens.fontFamily}`;
      ctx.textBaseline = 'middle';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 3;
      Object.keys(groups).forEach((k) => {
        const g = groups[k].sort((a, b) => a.y - b.y);
        for (let i = 1; i < g.length; i++) if (g[i].y < g[i - 1].y + lineH) g[i].y = g[i - 1].y + lineH;
        const maxY = chartArea.bottom - lineH / 2;
        if (g.length && g[g.length - 1].y > maxY) {
          g[g.length - 1].y = maxY;
          for (let i = g.length - 2; i >= 0; i--) if (g[i].y > g[i + 1].y - lineH) g[i].y = g[i + 1].y - lineH;
        }
        g.forEach((it) => {
          ctx.textAlign = it.left ? 'left' : 'right';
          ctx.strokeStyle = halo;
          ctx.strokeText(it.text, it.x, it.y);
          ctx.fillStyle = tokens.textPrimary;
          ctx.fillText(it.text, it.x, it.y);
        });
      });
      ctx.restore();
    }
  };

  const stageHeadersPlugin = {
    id: 'kitChartsAlluvialStages',
    afterDatasetsDraw(chart) {
      if (!stages.length) return;
      const meta = chart.getDatasetMeta(0);
      const ctrl = meta && meta.controller;
      const nodes = ctrl && ctrl._nodes;
      const xScale = meta && meta.xScale;
      const ds = chart.data.datasets[0];
      if (!nodes || !xScale || !ds || !ds.column) return;
      const { ctx, chartArea } = chart;
      const nodeWidth = ds.nodeWidth || 16;
      ctx.save();
      ctx.font = `700 ${chart.width < 460 ? 11 : 12}px ${tokens.fontFamily}`;
      ctx.fillStyle = tokens.textSecondary || tokens.textPrimary;
      ctx.textBaseline = 'bottom';
      const done = {};
      nodes.forEach((node) => {
        if (!(node.key in ds.column) || done[node.x]) return;
        done[node.x] = true;
        const px = xScale.getPixelForValue(node.x);
        const stage = stages[ds.column[node.key]];
        const first = ds.column[node.key] === 0;
        const last = ds.column[node.key] === stages.length - 1;
        ctx.textAlign = first ? 'left' : (last ? 'right' : 'center');
        ctx.fillText(stage, first ? px : (last ? px + nodeWidth : px + nodeWidth / 2), chartArea.top - 8);
      });
      ctx.restore();
    }
  };

  const chartData = { datasets };
  const baseOptions = getChartDefaultOptions(tokens);

  const config = {
    type: 'sankey',
    data: chartData,
    options: {
      scales: {},
      ...baseOptions,
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: 'nearest', intersect: true },
      layout: { padding: { top: 34, bottom: 16, left: 16, right: 16 } },
      plugins: {
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
              const item = ctx.raw;
              if (!item) return '';
              const st = (s) => (s === undefined || s === null ? '' : ` (${s})`);
              return ` ${item.fromName}${st(item.fromStage)} → ${item.toName}${st(item.toStage)} : ${fmt(item.flow)} utilisateurs`;
            }
          }
        }
      }
    },
    plugins: [stageHeadersPlugin, nodeLabelPlugin]
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
    createChart: typeof createChart === 'function' ? createChart : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;
});
