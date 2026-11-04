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
  const checkRequiredArrays = (KitChartsTheme && KitChartsTheme.checkRequiredArrays) || (typeof window !== 'undefined' && window.checkRequiredArrays) || function() { return null; };
  const renderInvalidData = (KitChartsTheme && KitChartsTheme.renderInvalidData) || (typeof window !== 'undefined' && window.renderInvalidData) || function(t, r) { if (typeof console !== 'undefined') console.error('[kit-charts] Données invalides : ' + r); return null; };
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
    // Nombre de classes : max(Freedman-Diaconis, Sturges) pour ne pas écraser une distribution multimodale
    const sturges = Math.ceil(Math.log2(n) + 1);
    const binCount = Math.max(5, Math.min(50, Math.max(Math.ceil(span / binWidth), sturges)));
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

  function computeGaussianKDE(data, bandwidth = null, gridPoints = 128, domain = null) {
    const clean = Array.isArray(data) ? data.map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b) : [];
    const n = clean.length;
    if (n === 0) return { grid: [], density: [], maxDensity: 0, h: 1, min: 0, max: 0 };

    const h = (typeof bandwidth === 'number' && bandwidth > 0) ? bandwidth : computeSilvermanBandwidth(clean);
    const minVal = clean[0];
    const maxVal = clean[clean.length - 1];
    const spanMin = domain && Number.isFinite(domain.min) ? domain.min : minVal - 2.5 * h;
    const spanMax = domain && Number.isFinite(domain.max) ? domain.max : maxVal + 2.5 * h;
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

  const DEFAULT_DATA = (() => {
    // Temps de réponse API (ms), N=60 : cache chaud (~N(55,9)) et cache froid (~N(140,15)), PRNG seedé déterministe
    let seed = 7321;
    const rnd = () => {
      seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const gauss = (m, sd) => m + sd * Math.sqrt(-2 * Math.log(Math.max(1e-9, rnd()))) * Math.cos(2 * Math.PI * rnd());
    const values = [];
    for (let i = 0; i < 40; i++) values.push(Math.round(gauss(55, 9)));
    for (let i = 0; i < 20; i++) values.push(Math.round(gauss(140, 15)));
    return {
      datasets: [{
        label: 'Temps de Réponse API (ms)',
        data: values.sort((a, b) => a - b)
      }]
    };
  })();

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
    // Données fournies mais incomplètes : refus visible, jamais de repli sur l'exemple DEFAULT_DATA.
    const invalidReason = customData ? checkRequiredArrays(rawData, ['datasets[0].data']) : null;
    if (invalidReason) return renderInvalidData(canvas, invalidReason);
    const seriesData = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data);
    const seriesLabel = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].label) || 'Distribution';

    const binAnalysis = computeFreedmanDiaconisBins(seriesData);
    const kdeAnalysis = computeGaussianKDE(seriesData, null, 160, { min: binAnalysis.min, max: binAnalysis.max });

    const mainColor = getColor(tokens, 0);
    const kdeColor = tokens.emphasis?.focal || tokens.palette[1] || '#E66101';

    const countScaleFactor = binAnalysis.n * binAnalysis.binWidth;
    const kdePoints = kdeAnalysis.grid.map((x, idx) => ({
      x: x,
      y: kdeAnalysis.density[idx] * countScaleFactor
    }));

    const barLabels = binAnalysis.bins.map(b => `${Math.round(b.min)}–${Math.round(b.max)}`);
    const barData = binAnalysis.bins.map(b => b.count);

    // Étiquettes d'effectif locales : au-dessus de la barre, ou dans la barre si la courbe KDE traverse l'emplacement.
    const barLabelsPlugin = {
      id: 'kitChartsHistKdeBarLabels',
      afterDatasetsDraw(chart) {
        if (!showDataLabels) return;
        const { ctx, chartArea, scales } = chart;
        const yS = scales.y;
        const xK = scales.xKde;
        const barMeta = chart.getDatasetMeta(0);
        if (!yS || !xK || !barMeta) return;
        const curve = kdePoints.map(p => ({ px: xK.getPixelForValue(p.x), py: yS.getPixelForValue(p.y) }));
        const fs = chart.width < 460 ? 10 : 11;
        ctx.save();
        ctx.font = `600 ${fs}px ${tokens.fontMono || 'monospace'}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const hits = (r) => {
          for (let i = 1; i < curve.length; i++) {
            const a = curve[i - 1], b = curve[i];
            if (Math.max(a.px, b.px) < r.x0 || Math.min(a.px, b.px) > r.x1) continue;
            // échantillonnage du segment : tout point dans le rectangle compte
            for (let k = 0; k <= 4; k++) {
              const px = a.px + (b.px - a.px) * k / 4;
              const py = a.py + (b.py - a.py) * k / 4;
              if (px >= r.x0 && px <= r.x1 && py >= r.y0 && py <= r.y1) return true;
            }
          }
          return false;
        };
        barMeta.data.forEach((el, i) => {
          const v = barData[i];
          if (!el || !(v > 0)) return;
          const text = String(v);
          const w = ctx.measureText(text).width + 4;
          const h = fs + 2;
          const above = { x0: el.x - w / 2, x1: el.x + w / 2, y0: el.y - 3 - h, y1: el.y - 3 };
          const barH = el.base - el.y;
          const inside = { x0: el.x - w / 2, x1: el.x + w / 2, y0: el.y + 4, y1: el.y + 4 + h };
          let r = null;
          if (above.y0 >= chartArea.top - 2 && !hits(above)) r = above;
          else if (barH >= h + 8 && !hits(inside)) r = inside;
          else if (above.y0 >= chartArea.top - 2) r = null; // aucune place libre : valeur lisible dans l'infobulle
          if (!r) return;
          ctx.fillStyle = tokens.textPrimary;
          ctx.fillText(text, el.x, (r.y0 + r.y1) / 2);
        });
        ctx.restore();
      }
    };

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      plugins: [barLabelsPlugin],
      type: 'bar',
      data: {
        labels: barLabels,
        datasets: [
          {
            type: 'bar',
            xAxisID: 'x',
            label: `Histogramme (${seriesLabel})`,
            data: barData,
            backgroundColor: hexToRgba(mainColor, isDark ? 0.40 : 0.30),
            borderColor: mainColor,
            borderWidth: 1,
            borderRadius: 0,
            categoryPercentage: 1.0,
            barPercentage: 1.0,
            datalabels: { display: false },
            order: 2
          },
          {
            type: 'line',
            label: `Densité KDE (Silverman h=${kdeAnalysis.h.toFixed(1)})`,
            data: kdePoints.map(p => ({ x: p.x, y: Math.round(p.y * 1000) / 1000 })),
            xAxisID: 'xKde',
            borderColor: kdeColor,
            borderWidth: 2.5,
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: 0,
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
            display: false, // étiquettes gérées par le plugin local (évitement de la courbe KDE)
            formatter: (v, ctx) => {
              if (ctx && ctx.dataset && ctx.dataset.type === 'bar' && v > 0) {
                return String(v);
              }
              return '';
            }
          }),
          legend: {
            display: true,
            position: 'bottom',
            align: 'center',
            labels: {
              color: tokens.textPrimary,
              font: { family: tokens.fontFamily, size: 11 },
              usePointStyle: true,
              boxWidth: 14,
              padding: 10,
              generateLabels: (chart) => {
                const base = (typeof Chart !== 'undefined' && Chart.defaults && Chart.defaults.plugins.legend.labels.generateLabels)
                  ? Chart.defaults.plugins.legend.labels.generateLabels(chart) : [];
                return base.map(item => {
                  const ds = chart.data.datasets[item.datasetIndex] || {};
                  const isLine = ds.type === 'line';
                  return Object.assign(item, {
                    pointStyle: isLine ? 'line' : 'rect',
                    fontColor: tokens.textPrimary,
                    fillStyle: isLine ? 'transparent' : item.fillStyle,
                    lineWidth: isLine ? 2.5 : 1.5
                  });
                });
              }
            }
          },
          tooltip: {
            ...defaultOpts.plugins.tooltip,
            filter: (item) => item.dataset.type === 'bar',
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
          xKde: {
            type: 'linear',
            display: false,
            offset: false,
            position: 'bottom',
            min: binAnalysis.min,
            max: binAnalysis.max,
            grid: { display: false }
          },
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
