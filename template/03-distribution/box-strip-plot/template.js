/**
 * @file 03-distribution/box-strip-plot/template.js
 * @description Standardized Universal Box Plot + Strip/Jitter Plot Template for kit-charts.
 * Combines Tukey five-number summary and deterministic golden-ratio jittered observations.
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
    global.KitCharts['box-strip-plot'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.computeTukeyBoxStats = exp.computeTukeyBoxStats;
    global.computeDeterministicJitter = exp.computeDeterministicJitter;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  function computeTukeyBoxStats(data) {
    const clean = Array.isArray(data) ? data.map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b) : [];
    const n = clean.length;
    if (n === 0) return { min: 0, q1: 0, median: 0, q3: 0, max: 0, iqr: 0, lowerWhisker: 0, upperWhisker: 0, outliers: [], n: 0 };

    const getQ = (p) => {
      const idx = (n - 1) * p;
      const lo = Math.floor(idx);
      const hi = Math.ceil(idx);
      if (lo === hi) return clean[lo];
      return clean[lo] + (clean[hi] - clean[lo]) * (idx - lo);
    };

    const q1 = getQ(0.25);
    const median = getQ(0.50);
    const q3 = getQ(0.75);
    const iqr = q3 - q1;

    const lowerFence = q1 - 1.5 * iqr;
    const upperFence = q3 + 1.5 * iqr;

    let lowerWhisker = q1;
    let upperWhisker = q3;
    const outliers = [];

    clean.forEach(val => {
      if (val < lowerFence || val > upperFence) {
        outliers.push(val);
      }
    });

    for (let i = 0; i < n; i++) {
      if (clean[i] >= lowerFence) {
        lowerWhisker = clean[i];
        break;
      }
    }
    for (let i = n - 1; i >= 0; i--) {
      if (clean[i] <= upperFence) {
        upperWhisker = clean[i];
        break;
      }
    }

    return {
      min: clean[0],
      q1,
      median,
      q3,
      max: clean[n - 1],
      iqr,
      lowerWhisker,
      upperWhisker,
      outliers,
      n
    };
  }

  function computeDeterministicJitter(index, maxOffset = 20, seed = 0.618033988749895) {
    const phi = 0.618033988749895;
    const frac = ((index + 1) * phi + seed) % 1;
    return (frac - 0.5) * 2 * maxOffset;
  }

  const DEFAULT_DATA = {
    labels: ['Traitement A', 'Traitement B (Optimisé)', 'Contrôle'],
    datasets: [{
      label: 'Performance Score',
      data: [
        [45, 48, 50, 52, 54, 55, 56, 58, 60, 61, 62, 64, 65, 68, 72, 75, 88],
        [58, 60, 62, 65, 66, 68, 70, 72, 73, 75, 78, 80, 82, 85, 88, 92, 95],
        [30, 35, 38, 40, 42, 43, 45, 46, 48, 50, 52, 53, 55, 58, 60, 62]
      ]
    }]
  };

  function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
    const canvas = typeof canvasTarget === 'string'
      ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
      : canvasTarget;

    if (!canvas) throw new Error(`Canvas element "${canvasTarget}" not found`);

    if (typeof Chart !== 'undefined' && Chart.getChart) {
      const existing = Chart.getChart(canvas);
      if (existing) existing.destroy();
    }

    const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
    const tokens = getThemeTokens(themeName, container);
    const isDark = Boolean(tokens.isDark);

    const rawData = customData || DEFAULT_DATA;
    const labels = rawData.labels || ['Groupe 1', 'Groupe 2', 'Groupe 3'];
    const groups = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data) || DEFAULT_DATA.datasets[0].data;

    const groupStats = groups.map((g, i) => {
      const rawPoints = Array.isArray(g) ? g : [];
      const stats = computeTukeyBoxStats(rawPoints);
      const color = getColor(tokens, i);
      return { rawPoints, stats, color, label: labels[i] || `Groupe ${i + 1}` };
    });

    let globalMin = Infinity;
    let globalMax = -Infinity;
    groupStats.forEach(gs => {
      if (gs.stats.min < globalMin) globalMin = gs.stats.min;
      if (gs.stats.max > globalMax) globalMax = gs.stats.max;
    });
    if (globalMin === Infinity) { globalMin = 0; globalMax = 100; }
    const span = globalMax - globalMin || 10;
    const yPad = span * 0.08;

    const boxStripPainterPlugin = {
      id: 'kitChartsBoxStripPainter',
      afterDatasetsDraw(chart) {
        const { ctx, scales: { x, y } } = chart;
        if (!x || !y) return;

        ctx.save();
        const totalGroups = groupStats.length;
        const catWidth = x.width / totalGroups;
        const boxWidth = Math.min(40, catWidth * 0.32);
        const stripMaxOffset = Math.min(22, catWidth * 0.18);

        groupStats.forEach((gs, idx) => {
          const xCenter = x.getPixelForValue(idx);
          const { stats, color, rawPoints } = gs;
          if (stats.n === 0) return;

          const yQ1 = y.getPixelForValue(stats.q1);
          const yQ3 = y.getPixelForValue(stats.q3);
          const yMed = y.getPixelForValue(stats.median);
          const yLowW = y.getPixelForValue(stats.lowerWhisker);
          const yUpW = y.getPixelForValue(stats.upperWhisker);

          ctx.beginPath();
          ctx.strokeStyle = isDark ? '#94A3B8' : '#475569';
          ctx.lineWidth = 1.5;
          ctx.moveTo(xCenter, yLowW);
          ctx.lineTo(xCenter, yQ1);
          ctx.moveTo(xCenter, yQ3);
          ctx.lineTo(xCenter, yUpW);
          const capW = boxWidth * 0.4;
          ctx.moveTo(xCenter - capW / 2, yLowW);
          ctx.lineTo(xCenter + capW / 2, yLowW);
          ctx.moveTo(xCenter - capW / 2, yUpW);
          ctx.lineTo(xCenter + capW / 2, yUpW);
          ctx.stroke();

          ctx.fillStyle = hexToRgba(color, isDark ? 0.35 : 0.25);
          ctx.fillRect(xCenter - boxWidth / 2, yQ3, boxWidth, yQ1 - yQ3);
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.strokeRect(xCenter - boxWidth / 2, yQ3, boxWidth, yQ1 - yQ3);

          ctx.beginPath();
          ctx.strokeStyle = isDark ? '#FFFFFF' : '#0F172A';
          ctx.lineWidth = 2.5;
          ctx.moveTo(xCenter - boxWidth / 2, yMed);
          ctx.lineTo(xCenter + boxWidth / 2, yMed);
          ctx.stroke();

          rawPoints.forEach((val, pIdx) => {
            const yPt = y.getPixelForValue(val);
            const xOffset = computeDeterministicJitter(pIdx, stripMaxOffset);
            const isOutlier = val < stats.lowerWhisker || val > stats.upperWhisker;

            ctx.beginPath();
            ctx.fillStyle = isOutlier
              ? (tokens.emphasis?.anomaly || '#D01C8B')
              : hexToRgba(color, 0.85);
            ctx.arc(xCenter + xOffset, yPt, isOutlier ? 3.5 : 2.5, 0, Math.PI * 2);
            ctx.fill();

            if (isOutlier) {
              ctx.strokeStyle = isDark ? '#FFFFFF' : '#0F172A';
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          });

          ctx.font = `500 11px ${tokens.fontMono || 'monospace'}`;
          ctx.fillStyle = tokens.textMuted || '#64748B';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(`n=${stats.n}`, xCenter, Math.max(14, yUpW - 8));
        });

        ctx.restore();
      }
    };

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].label) || 'Distribution',
          data: groupStats.map(gs => [gs.stats.min, gs.stats.max]),
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          borderWidth: 0
        }]
      },
      options: {
        ...defaultOpts,
        animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          ...defaultOpts.plugins,
          legend: { display: false },
          tooltip: {
            enabled: true,
            callbacks: {
              title: (items) => labels[items[0].dataIndex] || '',
              label: (ctx) => {
                const gs = groupStats[ctx.dataIndex];
                if (!gs) return '';
                const { stats } = gs;
                return [
                  `Échantillon : n = ${stats.n} observations`,
                  `Médiane : ${stats.median.toLocaleString('fr-FR')}`,
                  `IQR [Q1—Q3] : [${stats.q1.toLocaleString('fr-FR')} — ${stats.q3.toLocaleString('fr-FR')}]`,
                  `Moustaches : [${stats.lowerWhisker.toLocaleString('fr-FR')} — ${stats.upperWhisker.toLocaleString('fr-FR')}]`,
                  `Outliers détectés : ${stats.outliers.length}`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            ...defaultOpts.scales.x,
            grid: { display: false }
          },
          y: {
            ...defaultOpts.scales.y,
            min: Math.floor(globalMin - yPad),
            max: Math.ceil(globalMax + yPad),
            title: {
              display: true,
              text: (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].label) || 'Valeur',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          }
        }
      },
      plugins: [boxStripPainterPlugin]
    };

    if (typeof Chart === 'undefined') return { config, groupStats, computeTukeyBoxStats, computeDeterministicJitter };
    return new Chart(canvas, config);
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeTukeyBoxStats,
    computeDeterministicJitter
  };
});
