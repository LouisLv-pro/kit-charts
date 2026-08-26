/**
 * @file 03-distribution/raincloud-plot/template.js
 * @description Standardized Universal Raincloud Plot Template for kit-charts.
 * Tri-hybrid display: Half-KDE density (cloud) + Micro-Box plot + Jittered raw points (rain).
 * Based on Allen et al. (2019) and Kievit methodology.
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
    global.KitCharts['raincloud-plot'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.computeGaussianKDE = exp.computeGaussianKDE;
    global.computeTukeyBoxStats = exp.computeTukeyBoxStats;
    global.computeSilvermanBandwidth = exp.computeSilvermanBandwidth;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  function quantile(cleanSorted, p) {
    const n = cleanSorted.length;
    if (n === 0) return 0;
    if (p <= 0) return cleanSorted[0];
    if (p >= 1) return cleanSorted[n - 1];
    const idx = (n - 1) * p;
    const lo = Math.floor(idx);
    const hi = Math.ceil(idx);
    if (lo === hi) return cleanSorted[lo];
    return cleanSorted[lo] + (cleanSorted[hi] - cleanSorted[lo]) * (idx - lo);
  }

  function computeSilvermanBandwidth(data) {
    const clean = Array.isArray(data) ? data.map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b) : [];
    const n = clean.length;
    if (n < 2) return 1.0;
    const mean = clean.reduce((s, v) => s + v, 0) / n;
    const variance = clean.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / (n - 1);
    const sigma = Math.sqrt(variance);
    const q1 = quantile(clean, 0.25);
    const q3 = quantile(clean, 0.75);
    const iqr = q3 - q1;
    const robustSigma = iqr > 0 ? Math.min(sigma, iqr / 1.34) : (sigma || 1);
    const h = 0.9 * robustSigma * Math.pow(n, -0.2);
    return (h > 0 && !isNaN(h)) ? h : 1.0;
  }

  function computeGaussianKDE(data, bandwidth = null, gridPoints = 128) {
    const clean = Array.isArray(data) ? data.map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b) : [];
    const n = clean.length;
    if (n === 0) return { grid: [], density: [], maxDensity: 0, h: 1, min: 0, max: 0 };

    const h = (typeof bandwidth === 'number' && bandwidth > 0) ? bandwidth : computeSilvermanBandwidth(clean);
    const minVal = clean[0];
    const maxVal = clean[clean.length - 1];
    const spanMin = minVal - 2.5 * h;
    const spanMax = maxVal + 2.5 * h;
    const step = (spanMax - spanMin) / (gridPoints - 1);

    const SQRT_2PI = Math.sqrt(2 * Math.PI);
    const grid = new Array(gridPoints);
    const density = new Array(gridPoints);
    let maxDensity = 0;

    for (let j = 0; j < gridPoints; j++) {
      const x = spanMin + j * step;
      grid[j] = x;
      let sum = 0;
      for (let i = 0; i < n; i++) {
        const u = (x - clean[i]) / h;
        sum += Math.exp(-0.5 * u * u) / SQRT_2PI;
      }
      const dens = sum / (n * h);
      density[j] = dens;
      if (dens > maxDensity) maxDensity = dens;
    }

    return { grid, density, maxDensity, h, min: spanMin, max: spanMax, n };
  }

  function computeTukeyBoxStats(data) {
    const clean = Array.isArray(data) ? data.map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b) : [];
    const n = clean.length;
    if (n === 0) return { min: 0, q1: 0, median: 0, q3: 0, max: 0, iqr: 0, lowerWhisker: 0, upperWhisker: 0, n: 0 };

    const q1 = quantile(clean, 0.25);
    const median = quantile(clean, 0.50);
    const q3 = quantile(clean, 0.75);
    const iqr = q3 - q1;
    const lowerFence = q1 - 1.5 * iqr;
    const upperFence = q3 + 1.5 * iqr;

    let lowerWhisker = q1;
    let upperWhisker = q3;
    for (let i = 0; i < n; i++) {
      if (clean[i] >= lowerFence) { lowerWhisker = clean[i]; break; }
    }
    for (let i = n - 1; i >= 0; i--) {
      if (clean[i] <= upperFence) { upperWhisker = clean[i]; break; }
    }

    return { min: clean[0], q1, median, q3, max: clean[n - 1], iqr, lowerWhisker, upperWhisker, n };
  }

  const DEFAULT_DATA = {
    labels: ['Cohorte Contrôle', 'Cohorte Variante A', 'Cohorte Variante B'],
    datasets: [{
      label: 'Engagement Score (0-100)',
      data: [
        [35, 38, 42, 45, 46, 48, 50, 52, 53, 55, 56, 58, 60, 62, 65, 68, 70],
        [48, 52, 55, 58, 60, 62, 65, 68, 70, 72, 75, 78, 80, 82, 85, 88, 92],
        [25, 28, 30, 32, 35, 38, 40, 72, 75, 78, 80, 82, 85, 88, 90, 94, 96]
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

    const analysis = groups.map((g, i) => {
      const rawPoints = Array.isArray(g) ? g : [];
      const kde = computeGaussianKDE(rawPoints);
      const stats = computeTukeyBoxStats(rawPoints);
      const color = getColor(tokens, i);
      return { rawPoints, kde, stats, color, label: labels[i] || `Groupe ${i + 1}` };
    });

    let globalMin = Infinity;
    let globalMax = -Infinity;
    analysis.forEach(a => {
      if (a.kde.min < globalMin) globalMin = a.kde.min;
      if (a.kde.max > globalMax) globalMax = a.kde.max;
    });
    if (globalMin === Infinity) { globalMin = 0; globalMax = 100; }
    const span = globalMax - globalMin || 10;
    const yPad = span * 0.08;

    const raincloudPlugin = {
      id: 'kitChartsRaincloudPainter',
      afterDatasetsDraw(chart) {
        const { ctx, scales: { x, y } } = chart;
        if (!x || !y) return;

        ctx.save();
        const totalGroups = analysis.length;
        const catWidth = x.width / totalGroups;
        const maxCloudWidth = Math.min(50, catWidth * 0.35);

        analysis.forEach((item, idx) => {
          const xCenter = x.getPixelForValue(idx);
          const { kde, stats, color, rawPoints } = item;
          if (!kde.grid.length || kde.maxDensity === 0) return;

          ctx.beginPath();
          ctx.moveTo(xCenter, y.getPixelForValue(kde.grid[0]));
          for (let j = 0; j < kde.grid.length; j++) {
            const yVal = kde.grid[j];
            const yPx = y.getPixelForValue(yVal);
            const wRatio = kde.density[j] / kde.maxDensity;
            const xPx = xCenter + wRatio * maxCloudWidth;
            ctx.lineTo(xPx, yPx);
          }
          ctx.lineTo(xCenter, y.getPixelForValue(kde.grid[kde.grid.length - 1]));
          ctx.closePath();

          ctx.fillStyle = hexToRgba(color, isDark ? 0.40 : 0.30);
          ctx.fill();
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          if (stats.n >= 3) {
            const yQ1 = y.getPixelForValue(stats.q1);
            const yQ3 = y.getPixelForValue(stats.q3);
            const yMed = y.getPixelForValue(stats.median);
            const yLowW = y.getPixelForValue(stats.lowerWhisker);
            const yUpW = y.getPixelForValue(stats.upperWhisker);

            ctx.beginPath();
            ctx.strokeStyle = isDark ? '#D8DEE9' : '#334155';
            ctx.lineWidth = 1.5;
            ctx.moveTo(xCenter, yLowW);
            ctx.lineTo(xCenter, yUpW);
            ctx.stroke();

            const boxW = 8;
            ctx.fillStyle = isDark ? '#ECEFF4' : '#0F172A';
            ctx.fillRect(xCenter - boxW / 2, yQ3, boxW, yQ1 - yQ3);

            ctx.beginPath();
            ctx.fillStyle = '#FFFFFF';
            ctx.arc(xCenter, yMed, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }

          const phi = 0.618033988749895;
          rawPoints.forEach((val, pIdx) => {
            const yPt = y.getPixelForValue(val);
            const jitterOffset = -8 - (((pIdx * phi) % 1) * (maxCloudWidth * 0.6));
            ctx.beginPath();
            ctx.fillStyle = hexToRgba(color, 0.80);
            ctx.arc(xCenter + jitterOffset, yPt, 2.5, 0, Math.PI * 2);
            ctx.fill();
          });

          ctx.font = `500 11px ${tokens.fontMono || 'monospace'}`;
          ctx.fillStyle = tokens.textMuted || '#64748B';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(`n=${stats.n}`, xCenter, Math.max(14, y.getPixelForValue(kde.max) - 6));
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
          data: analysis.map(a => [a.stats.min, a.stats.max]),
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
                const item = analysis[ctx.dataIndex];
                if (!item) return '';
                const { stats, kde } = item;
                return [
                  `Échantillon : n = ${stats.n} observations`,
                  `Médiane : ${stats.median.toLocaleString('fr-FR')}`,
                  `IQR [Q1—Q3] : [${stats.q1.toLocaleString('fr-FR')} — ${stats.q3.toLocaleString('fr-FR')}]`,
                  `Bande de Silverman (h) : ${kde.h.toFixed(2)}`
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
      plugins: [raincloudPlugin]
    };

    if (typeof Chart === 'undefined') return { config, analysis, computeGaussianKDE, computeTukeyBoxStats, computeSilvermanBandwidth };
    return new Chart(canvas, config);
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeGaussianKDE,
    computeTukeyBoxStats,
    computeSilvermanBandwidth
  };
});
