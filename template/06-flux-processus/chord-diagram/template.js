/**
 * @file template/06-flux-processus/chord-diagram/template.js
 * @description Standardized Universal chord-diagram Template for kit-charts.
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
    global.KitCharts['chord-diagram'] = exp;
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
 * @file 06-flux-processus/chord-diagram/template.js
 * @description Standardized Chord Diagram / Circular Matrix Flow template for kit-charts.
 * Visualizes bilateral inter-entity quantitative exchanges around a circular radial topology.
 * Arcs de cercle proportionnels aux flux émis et rubans de Bézier dessinés par un plugin canvas.
 */


/**
 * Données par défaut : matrice de flux (en M€) entre quatre régions.
 * Chaque dataset est une LIGNE de la matrice : flux émis par l'entité `labels[i]`
 * vers chaque entité `labels[j]` (la diagonale est ignorée).
 */
const DEFAULT_DATA = {
  labels: ['Région Nord (Focal)', 'Région Sud', 'Région Est', 'Région Ouest'],
  datasets: [
    { label: 'Flux émis par Région Nord (Focal)', data: [0, 25, 18, 12], role: 'focal' },
    { label: 'Flux émis par Région Sud', data: [20, 0, 15, 30], role: 'context' },
    { label: 'Flux émis par Région Est', data: [14, 16, 0, 22], role: 'context' },
    { label: 'Flux émis par Région Ouest', data: [10, 28, 20, 0], role: 'context' }
  ]
};

function buildMatrix(labels, datasets) {
  const n = labels.length;
  const m = [];
  for (let i = 0; i < n; i++) {
    const row = [];
    const src = datasets[i] && Array.isArray(datasets[i].data) ? datasets[i].data : [];
    for (let j = 0; j < n; j++) {
      const d = src[j];
      const v = typeof d === 'object' && d !== null ? (d.value ?? d.flow ?? d.v ?? 0) : Number(d);
      row.push(i === j || !isFinite(v) || v < 0 ? 0 : v);
    }
    m.push(row);
  }
  return m;
}

function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
  const canvas = typeof canvasTarget === 'string' && typeof document !== 'undefined'
    ? document.getElementById(canvasTarget)
    : canvasTarget;

  if (typeof Chart !== 'undefined' && canvas) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas && canvas.parentElement ? canvas.parentElement : null;
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const showDataLabels = (customData && customData.showDataLabels !== undefined)
    ? customData.showDataLabels
    : (options.showDataLabels !== undefined ? options.showDataLabels : true);

  const rawData = customData || DEFAULT_DATA;
  const labels = (rawData.labels || []).slice();
  const datasets = rawData.datasets || [];
  const n = labels.length;
  const matrix = buildMatrix(labels, datasets);
  const rowSum = matrix.map(r => r.reduce((a, b) => a + b, 0));
  const colSum = labels.map((_, j) => matrix.reduce((a, r) => a + r[j], 0));
  const focalIdx = datasets.findIndex((d, i) => (d.role || (i === 0 ? 'focal' : 'context')) === 'focal');
  const colors = labels.map((_, i) => getColor(tokens, i));
  const fmt = (v) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(v);

  // Taille d'arc = flux émis (somme de ligne), plancher pour éviter un arc nul
  const arcValues = rowSum.map(v => (v > 0 ? v : 0.0001));

  // Métriques de libellés selon la largeur du graphique (compact sous ~460 px)
  const labelMetrics = (w) => {
    const width = w > 0 ? w : 800;
    const compact = width < 460;
    return {
      compact,
      nameSize: compact ? 11 : 12,
      subSize: compact ? 10 : 11,
      padX: compact ? Math.round(width * 0.26) : Math.round(Math.min(150, Math.max(110, width * 0.18))),
      padY: compact ? 30 : 36
    };
  };
  const fitText = (ctx, text, maxW) => {
    if (ctx.measureText(text).width <= maxW) return text;
    let t = text;
    while (t.length > 1 && ctx.measureText(t + '…').width > maxW) t = t.slice(0, -1);
    return t.trimEnd() + '…';
  };

  const chordPlugin = {
    id: 'kitChartsChordRibbons',
    beforeDatasetsDraw(chart) {
      const meta = chart.getDatasetMeta(0);
      if (!meta || !meta.data || meta.data.length !== n) return;
      const { ctx } = chart;
      const arcs = meta.data.map(a => a.getProps(['x', 'y', 'startAngle', 'endAngle', 'innerRadius'], true));
      const cx = arcs[0].x, cy = arcs[0].y, r = arcs[0].innerRadius - 2;
      if (!(r > 0)) return;

      // Sous-arcs : pour l'entité i, un segment par destination j, de largeur proportionnelle à m[i][j]
      const sub = arcs.map((a, i) => {
        const span = a.endAngle - a.startAngle;
        let cur = a.startAngle;
        return labels.map((_, j) => {
          const w = rowSum[i] > 0 ? (matrix[i][j] / rowSum[i]) * span : 0;
          const seg = [cur, cur + w];
          cur += w;
          return seg;
        });
      });

      const pt = (ang) => [cx + r * Math.cos(ang), cy + r * Math.sin(ang)];
      const ribbon = (s0, s1, t0, t1) => {
        ctx.beginPath();
        let p = pt(s0);
        ctx.moveTo(p[0], p[1]);
        ctx.arc(cx, cy, r, s0, s1);
        p = pt(t0);
        ctx.quadraticCurveTo(cx, cy, p[0], p[1]);
        ctx.arc(cx, cy, r, t0, t1);
        p = pt(s0);
        ctx.quadraticCurveTo(cx, cy, p[0], p[1]);
        ctx.closePath();
      };

      ctx.save();
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const a = matrix[i][j], b = matrix[j][i];
          if (a <= 0 && b <= 0) continue;
          const dominant = a >= b ? i : j; // couleur = entité d'origine du flux dominant
          const touchesFocal = focalIdx >= 0 && (i === focalIdx || j === focalIdx);
          const alpha = isTufte ? 0.35 : (focalIdx < 0 ? 0.55 : (touchesFocal ? 0.7 : 0.3));
          const si = sub[i][j], sj = sub[j][i];
          ribbon(si[0], Math.max(si[1], si[0] + 0.004), sj[0], Math.max(sj[1], sj[0] + 0.004));
          ctx.fillStyle = hexToRgba(colors[dominant], alpha);
          ctx.fill();
          ctx.lineWidth = 0.8;
          ctx.strokeStyle = hexToRgba(colors[dominant], 0.9);
          ctx.stroke();
        }
      }
      ctx.restore();
    },
    beforeLayout(chart) {
      // Réservation proportionnelle à la largeur : le cercle garde l'essentiel de la place
      const m = labelMetrics(chart.width);
      const pad = chart.options.layout && chart.options.layout.padding;
      if (pad) { pad.left = m.padX; pad.right = m.padX; pad.top = m.padY; pad.bottom = m.padY; }
    },
    afterDatasetsDraw(chart) {
      const meta = chart.getDatasetMeta(0);
      if (!meta || !meta.data || meta.data.length !== n) return;
      const { ctx } = chart;
      const m = labelMetrics(chart.width);
      ctx.save();
      meta.data.forEach((arc, i) => {
        const p = arc.getProps(['x', 'y', 'startAngle', 'endAngle', 'outerRadius'], true);
        const mid = (p.startAngle + p.endAngle) / 2;
        const rr = p.outerRadius + (m.compact ? 14 : 12);
        const x = p.x + rr * Math.cos(mid);
        const y = p.y + rr * Math.sin(mid);
        const right = Math.cos(mid) >= 0;
        ctx.textAlign = right ? 'left' : 'right';
        ctx.textBaseline = showDataLabels ? 'bottom' : 'middle';
        ctx.fillStyle = tokens.textPrimary;
        ctx.font = `${i === focalIdx ? '700' : '600'} ${m.nameSize}px ${tokens.fontFamily}`;
        ctx.fillText(fitText(ctx, m.compact ? String(labels[i]).replace(/\s*\(.*\)\s*$/, '') : labels[i], m.padX - 8), x, y);
        if (showDataLabels) {
          ctx.textBaseline = 'top';
          ctx.fillStyle = tokens.textSecondary || tokens.textPrimary;
          ctx.font = `500 ${m.subSize}px ${tokens.fontMono || tokens.fontFamily}`;
          if (m.compact) {
            ctx.fillText(`${fmt(rowSum[i])} émis`, x, y + 2);
            ctx.fillText(`${fmt(colSum[i])} reçu`, x, y + 2 + m.subSize + 1);
          } else {
            ctx.fillText(`émis ${fmt(rowSum[i])} / reçu ${fmt(colSum[i])}`, x, y + 2);
          }
        }
      });
      ctx.restore();
    }
  };

  const chartData = {
    labels,
    datasets: [{
      label: 'Flux émis',
      data: arcValues,
      backgroundColor: colors,
      borderColor: tokens.surface || tokens.bg,
      borderWidth: 3,
      hoverOffset: 0
    }]
  };
  const baseOptions = getChartDefaultOptions(tokens);

  const config = {
    type: 'doughnut',
    data: chartData,
    options: {
      ...baseOptions,
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      cutout: '90%',
      rotation: 0,
      layout: { padding: { top: 36, bottom: 36, left: 150, right: 150 } },
      scales: {},
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
          titleFont: { family: tokens.fontFamily, size: 12, weight: '600' },
          bodyFont: { family: tokens.fontMono, size: 12, weight: '400' },
          callbacks: {
            title: (items) => (items[0] ? items[0].label : ''),
            label: (ctx) => {
              const i = ctx.dataIndex;
              const lines = [` Émis : ${fmt(rowSum[i])}  |  Reçu : ${fmt(colSum[i])}`];
              labels.forEach((l, j) => {
                if (matrix[i][j] > 0) lines.push(` ${labels[i]} → ${l} : ${fmt(matrix[i][j])}`);
              });
              return lines;
            }
          }
        }
      }
    },
    plugins: [chordPlugin]
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
    matrix,
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
