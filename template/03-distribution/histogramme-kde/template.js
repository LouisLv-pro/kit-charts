/**
 * @file 03-distribution/histogramme-kde/template.js
 * @description Standardized Universal Histogram + Gaussian KDE Template for kit-charts.
 * Combines Freedman-Diaconis binned counts and Silverman rule-of-thumb density estimation.
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
    global.KitCharts['histogramme-kde'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.computeFreedmanDiaconisBins = exp.computeFreedmanDiaconisBins;
    global.computeSilvermanBandwidth = exp.computeSilvermanBandwidth;
    global.computeGaussianKDE = exp.computeGaussianKDE;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };
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

  function computeFreedmanDiaconisBins(data) {
    const clean = Array.isArray(data) ? data.map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b) : [];
    const n = clean.length;
    if (n < 2) return { binWidth: 1, binCount: 1, bins: [], min: 0, max: 1 };

    const q1 = quantile(clean, 0.25);
    const q3 = quantile(clean, 0.75);
    const iqr = q3 - q1;
    const min = clean[0];
    const max = clean[n - 1];

    let binWidth = 2 * iqr * Math.pow(n, -1 / 3);
    if (binWidth <= 0 || isNaN(binWidth)) {
      const mean = clean.reduce((s, v) => s + v, 0) / n;
      const sigma = Math.sqrt(clean.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / (n - 1));
      binWidth = (3.49 * (sigma || 1)) * Math.pow(n, -1 / 3) || 1;
    }

    const span = max - min;
    const binCount = Math.max(3, Math.min(50, Math.ceil(span / binWidth)));
    const actualWidth = span / binCount;

    const bins = [];
    for (let i = 0; i < binCount; i++) {
      const bMin = min + i * actualWidth;
      const bMax = (i === binCount - 1) ? max + 0.0001 : min + (i + 1) * actualWidth;
      bins.push({
        index: i,
        min: bMin,
        max: bMax,
        mid: (bMin + bMax) / 2,
        count: 0
      });
    }

    clean.forEach(val => {
      for (let i = 0; i < bins.length; i++) {
        if (val >= bins[i].min && val < bins[i].max) {
          bins[i].count++;
          break;
        }
      }
    });

    return { binWidth: actualWidth, binCount, bins, min, max, n };
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

  const DEFAULT_DATA = {
    datasets: [{
      label: 'Temps de Réponse API (ms)',
      data: [
        42, 45, 48, 50, 52, 53, 55, 56, 58, 59, 60, 61, 62, 63, 65, 66,
        68, 70, 71, 72, 73, 75, 76, 78, 80, 82, 85, 88, 92, 95, 110, 115,
        120, 125, 130, 132, 135, 138, 140, 142, 145, 148, 150, 155, 160, 175
      ]
    }]
  };

  function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
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
    const showDataLabels = (customData && customData.showDataLabels !== undefined)
      ? customData.showDataLabels
      : (options.showDataLabels !== undefined ? options.showDataLabels : true);

    const rawData = customData || DEFAULT_DATA;
    const seriesData = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data) || DEFAULT_DATA.datasets[0].data;
    const seriesLabel = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].label) || 'Distribution';

    const binAnalysis = computeFreedmanDiaconisBins(seriesData);
    const kdeAnalysis = computeGaussianKDE(seriesData);

    const mainColor = getColor(tokens, 0);
    const kdeColor = tokens.emphasis?.focal || tokens.palette[1] || '#E66101';

    const countScaleFactor = binAnalysis.n * binAnalysis.binWidth;
    const kdePoints = kdeAnalysis.grid.map((x, idx) => ({
      x: Math.round(x * 10) / 10,
      y: kdeAnalysis.density[idx] * countScaleFactor
    }));

    const barLabels = binAnalysis.bins.map(b => `${Math.round(b.min)}–${Math.round(b.max)}`);
    const barData = binAnalysis.bins.map(b => b.count);

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'bar',
      data: {
        labels: barLabels,
        datasets: [
          {
            type: 'bar',
            label: `Histogramme (${seriesLabel})`,
            data: barData,
            backgroundColor: hexToRgba(mainColor, isDark ? 0.40 : 0.30),
            borderColor: mainColor,
            borderWidth: 1.5,
            borderRadius: 3,
            datalabels: {
              display: showDataLabels
            },
            order: 2
          },
          {
            type: 'line',
            label: `Densité KDE (Silverman h=${kdeAnalysis.h.toFixed(1)})`,
            data: binAnalysis.bins.map(b => {
              let bestY = 0;
              let minDiff = Infinity;
              kdePoints.forEach(p => {
                const diff = Math.abs(p.x - b.mid);
                if (diff < minDiff) {
                  minDiff = diff;
                  bestY = p.y;
                }
              });
              return Math.round(bestY * 100) / 100;
            }),
            borderColor: kdeColor,
            borderWidth: 2.5,
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: 0.35,
            fill: false,
            datalabels: {
              display: false
            },
            order: 1
          }
        ]
      },
      options: {
        ...defaultOpts,
        _kitChartsTokens: tokens,
        showDataLabels: showDataLabels,
        animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          ...defaultOpts.plugins,
          datalabels: getDataLabelOptions(tokens, {
            display: showDataLabels,
            formatter: (v, ctx) => {
              if (ctx && ctx.dataset && ctx.dataset.type === 'bar' && v > 0) {
                return String(v);
              }
              return '';
            }
          }),
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              color: tokens.textPrimary,
              font: { family: tokens.fontFamily, size: 12 }
            }
          },
          tooltip: {
            ...defaultOpts.plugins.tooltip,
            callbacks: {
              title: (items) => `Classe : ${items[0].label} ms`,
              label: (ctx) => {
                if (ctx.dataset.type === 'bar') {
                  const pct = ((ctx.parsed.y / binAnalysis.n) * 100).toFixed(1);
                  return `Effectif : ${ctx.parsed.y} obs. (${pct}%)`;
                }
                return `Densité théorique : ${ctx.parsed.y.toFixed(2)} obs./bin`;
              }
            }
          }
        },
        scales: {
          x: {
            ...defaultOpts.scales.x,
            title: {
              display: true,
              text: seriesLabel,
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          },
          y: {
            ...defaultOpts.scales.y,
            beginAtZero: true,
            grace: '8%',
            title: {
              display: true,
              text: 'Effectif (Fréquence)',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          }
        }
      }
    };

    if (typeof Chart === 'undefined') return { config, binAnalysis, kdeAnalysis, computeFreedmanDiaconisBins, computeSilvermanBandwidth, computeGaussianKDE };
    return new Chart(canvas, config);
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeFreedmanDiaconisBins,
    computeSilvermanBandwidth,
    computeGaussianKDE,
    getDataLabelOptions,
    formatLabelValue
  };
});
