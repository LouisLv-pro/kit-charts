/**
 * @file template/03-distribution/violin-plot/template.js
 * @description Standardized Universal violin-plot Template for kit-charts.
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
    global.KitCharts['violin-plot'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
var factory = function(KitChartsTheme) {
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
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  /**
   * Calcule la bande passante optimale selon la règle univariée de Scott (1992):
   * h = 1.06 * sigma * n^(-1/5)
   * @param {number[]} data - Échantillon de données
   * @returns {number}
   */
  function computeScottBandwidth(data) {
    if (!Array.isArray(data) || data.length < 2) return 1.0;
    const clean = data.map(Number).filter(v => !isNaN(v));
    const n = clean.length;
    if (n < 2) return 1.0;
    const mean = clean.reduce((sum, v) => sum + v, 0) / n;
    const variance = clean.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / (n - 1);
    const sigma = Math.sqrt(variance);
    if (sigma === 0 || isNaN(sigma)) return 1.0;
    return 1.06 * sigma * Math.pow(n, -0.2);
  }

  /**
   * Évalue le Kernel Density Estimator (KDE) gaussien sur une grille de points.
   * f̂(x) = (1 / (n * h)) * Σ K((x - x_i) / h), K(u) = (1 / √(2π)) * exp(-u^2 / 2)
   *
   * @param {number[]} data - Échantillon brut
   * @param {number} [bandwidth] - Bande passante h (auto Scott si omis)
   * @param {number} [gridPoints=128] - Nombre de points sur la grille d'évaluation
   * @returns {{ grid: number[], density: number[], maxDensity: number, h: number, min: number, max: number }}
   */
  function computeGaussianKDE(data, bandwidth = null, gridPoints = 128) {
    const clean = Array.isArray(data) ? data.map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b) : [];
    const n = clean.length;
    if (n === 0) {
      return { grid: [], density: [], maxDensity: 0, h: 1, min: 0, max: 0 };
    }

    const h = (typeof bandwidth === 'number' && bandwidth > 0) ? bandwidth : computeScottBandwidth(clean);
    const minVal = clean[0];
    const maxVal = clean[clean.length - 1];
    const spanMin = minVal - 3 * h;
    const spanMax = maxVal + 3 * h;
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

    return { grid, density, maxDensity, h, min: spanMin, max: spanMax };
  }

  /**
   * Calcule les quantiles Tukey pour le box plot interne
   */
  function computeSummaryStats(data) {
    const clean = Array.isArray(data) ? data.map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b) : [];
    const n = clean.length;
    if (n === 0) return { min: 0, q1: 0, median: 0, q3: 0, max: 0, n: 0 };

    const getQ = (p) => {
      const idx = (n - 1) * p;
      const lo = Math.floor(idx);
      const hi = Math.ceil(idx);
      if (lo === hi) return clean[lo];
      return clean[lo] + (clean[hi] - clean[lo]) * (idx - lo);
    };

    return {
      min: clean[0],
      q1: getQ(0.25),
      median: getQ(0.50),
      q3: getQ(0.75),
      max: clean[n - 1],
      n
    };
  }

  const DEFAULT_DATA = {
    labels: ['Groupe A (Contrôle)', 'Groupe B (Bimodal)', 'Groupe C (Asymétrique)'],
    datasets: [{
      label: 'Distribution Score',
      data: [
        [14, 15, 16, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 23, 24, 25],
        [10, 11, 12, 12, 13, 13, 14, 24, 25, 25, 26, 26, 27, 28, 29, 30],
        [5, 6, 6, 7, 7, 8, 9, 10, 12, 15, 18, 22, 26, 31, 37, 44]
      ]
    }]
  };

  /**
   * Crée et initialise un Violin Plot avec KDE gaussien dans le canvas cible.
   *
   * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément HTMLCanvasElement
   * @param {Object} [customData=null] - Jeu de données
   * @param {string} [themeName='colorbrewer-accessible'] - Thème cognitif
   * @param {Object} [options={}] - Options (showInnerBox, showRawPoints)
   * @returns {Object} Instance Chart.js
   */
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
    const isTufte = tokens.name === 'tufte-minimalist-executive';

    const rawData = customData || DEFAULT_DATA;
    const labels = rawData.labels || ['Groupe 1', 'Groupe 2', 'Groupe 3'];
    const groups = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data) || DEFAULT_DATA.datasets[0].data;

    const showInnerBox = options.showInnerBox !== undefined ? options.showInnerBox : true;
    const showRawPoints = options.showRawPoints !== undefined ? options.showRawPoints : (groups.some(g => Array.isArray(g) && g.length <= 30));

    // Pré-calcul du KDE et stats pour chaque groupe
    const groupAnalysis = groups.map((g, i) => {
      const rawPoints = Array.isArray(g) ? g : [];
      const kde = computeGaussianKDE(rawPoints);
      const stats = computeSummaryStats(rawPoints);
      const color = getColor(tokens, i);
      return { rawPoints, kde, stats, color, label: labels[i] || `Groupe ${i + 1}` };
    });

    // Calcul des bornes globales Y
    let globalMin = Infinity;
    let globalMax = -Infinity;
    groupAnalysis.forEach(ga => {
      if (ga.kde.min < globalMin) globalMin = ga.kde.min;
      if (ga.kde.max > globalMax) globalMax = ga.kde.max;
    });
    if (globalMin === Infinity) { globalMin = 0; globalMax = 100; }
    const span = globalMax - globalMin || 10;
    const yPad = span * 0.05;

    // Plugin custom de rendu Violin KDE
    const violinPainterPlugin = {
      id: 'kitChartsViolinPainter',
      afterDatasetsDraw(chart) {
        const { ctx, scales: { x, y } } = chart;
        if (!x || !y) return;

        ctx.save();
        const totalGroups = groupAnalysis.length;
        const catWidth = x.width / totalGroups;
        const maxViolinHalfWidth = Math.min(60, catWidth * 0.40);

        groupAnalysis.forEach((ga, idx) => {
          const xCenter = x.getPixelForValue(idx);
          const { kde, stats, color, rawPoints } = ga;
          if (!kde.grid.length || kde.maxDensity === 0) return;

          // 1. Trace de la silhouette du violon (symétrie miroir gauche/droite)
          ctx.beginPath();
          // Côté droit (de bas en haut)
          for (let j = 0; j < kde.grid.length; j++) {
            const yVal = kde.grid[j];
            const yPx = y.getPixelForValue(yVal);
            const wRatio = kde.density[j] / kde.maxDensity;
            const xOffset = wRatio * maxViolinHalfWidth;
            const xPx = xCenter + xOffset;
            if (j === 0) ctx.moveTo(xPx, yPx);
            else ctx.lineTo(xPx, yPx);
          }
          // Côté gauche (de haut en bas)
          for (let j = kde.grid.length - 1; j >= 0; j--) {
            const yVal = kde.grid[j];
            const yPx = y.getPixelForValue(yVal);
            const wRatio = kde.density[j] / kde.maxDensity;
            const xOffset = wRatio * maxViolinHalfWidth;
            const xPx = xCenter - xOffset;
            ctx.lineTo(xPx, yPx);
          }
          ctx.closePath();

          // Remplissage contextuel avec alpha 0.35
          ctx.fillStyle = hexToRgba(color, isDark ? 0.45 : 0.35);
          ctx.fill();

          // Contour du violon
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // 2. Boîte interne optionnelle (Tukey box plot compact)
          if (showInnerBox && stats.n >= 3) {
            const yQ1 = y.getPixelForValue(stats.q1);
            const yQ3 = y.getPixelForValue(stats.q3);
            const yMed = y.getPixelForValue(stats.median);
            const yMin = y.getPixelForValue(stats.min);
            const yMax = y.getPixelForValue(stats.max);

            // Moustache fine centrale [min - max]
            ctx.beginPath();
            ctx.strokeStyle = isDark ? '#D8DEE9' : '#334155';
            ctx.lineWidth = 1.5;
            ctx.moveTo(xCenter, yMin);
            ctx.lineTo(xCenter, yMax);
            ctx.stroke();

            // Rectangle interquartile [Q1 - Q3]
            const boxW = 8;
            ctx.fillStyle = isDark ? '#ECEFF4' : '#0F172A';
            ctx.fillRect(xCenter - boxW / 2, yQ3, boxW, yQ1 - yQ3);

            // Marqueur médiane (disque blanc 4px)
            ctx.beginPath();
            ctx.fillStyle = '#FFFFFF';
            ctx.arc(xCenter, yMed, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }

          // 3. Points bruts déterministes (Anscombe guard T9)
          if (showRawPoints && rawPoints.length > 0) {
            const phi = 0.618033988749895; // Golden ratio
            ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(15, 23, 42, 0.55)';
            rawPoints.forEach((val, pIdx) => {
              const yPt = y.getPixelForValue(val);
              const jitterOffset = (((pIdx * phi) % 1) - 0.5) * (maxViolinHalfWidth * 0.5);
              ctx.beginPath();
              ctx.arc(xCenter + jitterOffset, yPt, 2, 0, Math.PI * 2);
              ctx.fill();
            });
          }

          // 4. Affichage explicite de la taille d'échantillon n (Garde-fou cognitif Knific & Weissgerber 2018)
          ctx.save();
          ctx.font = `500 11px ${tokens.fontMono || "'JetBrains Mono', monospace"}`;
          ctx.fillStyle = tokens.textMuted || (isDark ? '#94A3B8' : '#64748B');
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          const topDensityY = y.getPixelForValue(kde.max);
          ctx.fillText(`n = ${stats.n}`, xCenter, Math.max(14, topDensityY - 6));
          ctx.restore();
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
          data: groupAnalysis.map(ga => [ga.stats.min, ga.stats.max]),
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
          intersect: false,
          axis: 'x'
        },
        plugins: {
          ...defaultOpts.plugins,
          legend: { display: false },
          tooltip: {
            enabled: true,
            callbacks: {
              title: (items) => labels[items[0].dataIndex] || '',
              label: (ctx) => {
                const ga = groupAnalysis[ctx.dataIndex];
                if (!ga) return '';
                const { stats, kde } = ga;
                const nBadge = stats.n < 5 ? ` (n=${stats.n} — échantillon non représentatif)` : ` (n=${stats.n})`;
                return [
                  `Échantillon : n = ${stats.n}`,
                  `Médiane : ${stats.median.toLocaleString('fr-FR')}${nBadge}`,
                  `IQR [Q1—Q3] : [${stats.q1.toLocaleString('fr-FR')} — ${stats.q3.toLocaleString('fr-FR')}]`,
                  `Étendue : [${stats.min.toLocaleString('fr-FR')} — ${stats.max.toLocaleString('fr-FR')}]`,
                  `Bande de Scott (h) : ${kde.h.toFixed(2)}`
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
      plugins: [violinPainterPlugin]
    };

    if (typeof Chart === 'undefined') return { config, groupAnalysis, computeScottBandwidth, computeGaussianKDE };
    return new Chart(canvas, config);
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeScottBandwidth,
    computeGaussianKDE,
    computeSummaryStats,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null
  };
    };
    return factory(KitChartsTheme);
});
