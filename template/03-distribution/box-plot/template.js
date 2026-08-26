/**
 * @file template/03-distribution/box-plot/template.js
 * @description Standardized Universal box-plot Template for kit-charts.
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
    global.KitCharts['box-plot'] = exp;
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
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return '#2B8CBE'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function(t, r, o) { return {}; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function() { return {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function(t, o) { return {}; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 03-distribution/box-plot/template.js
 * @description Native Box Plot (Tukey 5-number summary) for kit-charts.
 * Standalone, robust, 100% offline with zero CDN dependencies.
 */

/**
 * Calcule déterministement les statistiques Tukey à 5 nombres (Min, Q1, Médiane, Q3, Max, Outliers)
 * @param {Array<number>} rawArray - Tableau de valeurs numériques
 * @returns {Object} { min, q1, median, q3, max, outliers, mean }
 */
function computeTukeyBoxplotStats(rawArray) {
  if (!Array.isArray(rawArray) || rawArray.length === 0) {
    return { min: 0, q1: 0, median: 0, q3: 0, max: 0, outliers: [], mean: 0 };
  }
  const sorted = [...rawArray].filter(v => typeof v === 'number' && !isNaN(v)).sort((a, b) => a - b);
  if (sorted.length === 0) {
    return { min: 0, q1: 0, median: 0, q3: 0, max: 0, outliers: [], mean: 0 };
  }
  const n = sorted.length;
  const mean = sorted.reduce((sum, v) => sum + v, 0) / n;

  function getQuantile(p) {
    const idx = (n - 1) * p;
    const low = Math.floor(idx);
    const high = Math.ceil(idx);
    if (low === high) return sorted[low];
    return sorted[low] + (sorted[high] - sorted[low]) * (idx - low);
  }

  const median = getQuantile(0.5);
  const q1 = getQuantile(0.25);
  const q3 = getQuantile(0.75);
  const iqr = q3 - q1;
  const lowerFence = q1 - 1.5 * iqr;
  const upperFence = q3 + 1.5 * iqr;

  const outliers = [];
  const valid = [];
  for (const v of sorted) {
    if (v < lowerFence || v > upperFence) {
      outliers.push(v);
    } else {
      valid.push(v);
    }
  }

  const min = valid.length > 0 ? valid[0] : (sorted[0] ?? 0);
  const max = valid.length > 0 ? valid[valid.length - 1] : (sorted[sorted.length - 1] ?? 0);

  return { min, q1, median, q3, max, outliers, mean, n, rawPoints: sorted };
}

const DEFAULT_DATA = {
  labels: ['Contrôle', 'Traitement A', 'Traitement B', 'Placebo'],
  datasets: [{
    label: 'Biomarqueur (mg/dL)',
    data: [
      { min: 12, q1: 18, median: 24, q3: 31, max: 42, outliers: [48] },
      { min: 19, q1: 28, median: 36, q3: 44, max: 55, outliers: [] },
      { min: 22, q1: 34, median: 42, q3: 50, max: 62, outliers: [14, 68] },
      { min: 10, q1: 16, median: 22, q3: 29, max: 38, outliers: [] }
    ]
  }]
};

function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) throw new Error('Canvas not found');

  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';

  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels || ['Groupe 1', 'Groupe 2', 'Groupe 3', 'Groupe 4'];
  const rawBoxData = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data) || [
    { min: 12, q1: 18, median: 24, q3: 31, max: 42, outliers: [48] },
    { min: 19, q1: 28, median: 36, q3: 44, max: 55, outliers: [] },
    { min: 22, q1: 34, median: 42, q3: 50, max: 62, outliers: [14, 68] },
    { min: 10, q1: 16, median: 22, q3: 29, max: 38, outliers: [] }
  ];
  const boxStats = rawBoxData.map(d => Array.isArray(d) ? computeTukeyBoxplotStats(d) : d);

  // Floating bars [q1, q3]
  const barData = boxStats.map(s => [s.q1, s.q3]);

  // Compute absolute min & max across all Tukey stats & outliers to properly bound the Y scale
  const allValues = [];
  boxStats.forEach(stat => {
    if (!stat) return;
    ['min', 'q1', 'median', 'q3', 'max'].forEach(key => {
      if (typeof stat[key] === 'number' && !isNaN(stat[key])) {
        allValues.push(stat[key]);
      }
    });
    if (Array.isArray(stat.outliers)) {
      stat.outliers.forEach(val => {
        if (typeof val === 'number' && !isNaN(val)) {
          allValues.push(val);
        }
      });
    }
  });

  const rawMin = allValues.length > 0 ? Math.min(...allValues) : 0;
  const rawMax = allValues.length > 0 ? Math.max(...allValues) : 100;
  const span = rawMax - rawMin || 10;
  const yPadding = span * 0.08;
  const suggestedMin = rawMin >= 0 && (rawMin - yPadding < 0) ? 0 : Math.floor(rawMin - yPadding);
  const suggestedMax = Math.ceil(rawMax + yPadding);

  const primaryColors = boxStats.map((stat, i) => {
    if (stat.role || stat.emphasis) {
      return getEmphasisStyle(tokens, stat.role || stat.emphasis).borderColor || getColor(tokens, i);
    }
    if (stat.valence || stat.metricType || stat.direction !== undefined) {
      return getValenceColor(tokens, stat.direction ?? stat.delta ?? 0, stat.metricType || stat.valence || 'gain');
    }
    if (rawData.datasets?.[0]?.role || rawData.datasets?.[0]?.emphasis) {
      const empRole = rawData.datasets[0].role || rawData.datasets[0].emphasis;
      return getEmphasisStyle(tokens, empRole).borderColor || getColor(tokens, i);
    }
    return getColor(tokens, i);
  });

  // Custom Tukey Boxplot Painter Plugin
  const boxplotPainterPlugin = {
    id: 'nativeTukeyPainter_' + Math.random().toString(36).substring(2, 7),
    afterDatasetsDraw(chart) {
      const { ctx, scales: { x, y } } = chart;
      if (!x || !y) return;

      ctx.save();

      boxStats.forEach((stat, i) => {
        const xPos = x.getPixelForValue(i);
        const yMin = y.getPixelForValue(stat.min);
        const yQ1 = y.getPixelForValue(stat.q1);
        const yMed = y.getPixelForValue(stat.median);
        const yQ3 = y.getPixelForValue(stat.q3);
        const yMax = y.getPixelForValue(stat.max);
        const color = primaryColors[i];

        const boxWidth = Math.min(48, Math.max(24, (x.width / boxStats.length) * 0.45));
        const halfBox = boxWidth / 2;
        const whiskerWidth = boxWidth * 0.4;

        // 1. Lower Whisker (min to q1)
        ctx.beginPath();
        ctx.strokeStyle = tokens.isDark ? '#D8DEE9' : '#334155';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.moveTo(xPos, yMin);
        ctx.lineTo(xPos, yQ1);
        ctx.stroke();
        ctx.setLineDash([]);

        // Lower Cap
        ctx.beginPath();
        ctx.moveTo(xPos - whiskerWidth / 2, yMin);
        ctx.lineTo(xPos + whiskerWidth / 2, yMin);
        ctx.stroke();

        // 2. Upper Whisker (q3 to max)
        ctx.beginPath();
        ctx.setLineDash([3, 3]);
        ctx.moveTo(xPos, yQ3);
        ctx.lineTo(xPos, yMax);
        ctx.stroke();
        ctx.setLineDash([]);

        // Upper Cap
        ctx.beginPath();
        ctx.moveTo(xPos - whiskerWidth / 2, yMax);
        ctx.lineTo(xPos + whiskerWidth / 2, yMax);
        ctx.stroke();

        // 3. Solid Box [q1, q3]
        ctx.fillStyle = color;
        ctx.globalAlpha = tokens.isDark ? 0.65 : 0.45;
        ctx.fillRect(xPos - halfBox, yQ3, boxWidth, yQ1 - yQ3);
        ctx.globalAlpha = 1.0;

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(xPos - halfBox, yQ3, boxWidth, yQ1 - yQ3);

        // 4. Median Line (salient)
        ctx.beginPath();
        ctx.strokeStyle = tokens.isDark ? '#ECEFF4' : '#0F172A';
        ctx.lineWidth = 3;
        ctx.moveTo(xPos - halfBox, yMed);
        ctx.lineTo(xPos + halfBox, yMed);
        ctx.stroke();

        // 5. Outliers (Double encoding: Distinctive Anomaly Token + Triangle Glyphs)
        if (Array.isArray(stat.outliers)) {
          const anomalyColor = tokens.emphasis?.anomaly || tokens.semantic?.negative || '#D01C8B';
          stat.outliers.forEach(outVal => {
            const yOut = y.getPixelForValue(outVal);
            const size = 5;
            ctx.beginPath();
            ctx.fillStyle = anomalyColor;
            ctx.moveTo(xPos, yOut - size);
            ctx.lineTo(xPos + size, yOut + size);
            ctx.lineTo(xPos - size, yOut + size);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = tokens.surfaceRaised || tokens.bg || '#FFFFFF';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          });
        }

        // 6. Anscombe Guard: Raw points overlay for small n (n <= 30)
        if (stat.rawPoints && stat.rawPoints.length > 0 && stat.rawPoints.length <= 30) {
          const phi = 0.618033988749895;
          ctx.fillStyle = tokens.isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(15, 23, 42, 0.55)';
          stat.rawPoints.forEach((val, pIdx) => {
            const yPt = y.getPixelForValue(val);
            const jitterOffset = (((pIdx * phi) % 1) - 0.5) * (boxWidth * 0.3);
            ctx.beginPath();
            ctx.arc(xPos + jitterOffset, yPt, 2.5, 0, Math.PI * 2);
            ctx.fill();
          });
        }
      });

      ctx.restore();
    }
  };

  const defaultOpts = getChartDefaultOptions(tokens);
  const spatialOpts = getSpatialInteractionOptions(tokens, { mode: 'nearest', axis: 'xy', hitRadius: 14, hoverRadius: 7 });
  const animOpts = getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' });

  const config = {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'IQR [Q1 - Q3]',
        data: barData,
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderWidth: 0
      }]
    },
    plugins: [boxplotPainterPlugin],
    options: {
      ...defaultOpts,
      ...spatialOpts,
      animation: animOpts,
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: tokens.textPrimary,
            font: { family: tokens.fontFamily, size: 12, weight: '600' }
          }
        },
        y: {
          beginAtZero: false,
          suggestedMin,
          suggestedMax,
          grid: { color: tokens.gridColor },
          ticks: {
            color: tokens.textSecondary,
            font: { family: tokens.fontMono, size: 11 }
          }
        }
      },
      plugins: {
        ...defaultOpts.plugins,
        legend: { display: false },
        tooltip: {
          ...defaultOpts.plugins?.tooltip,
          titleFont: { family: tokens.fontFamily, size: 12, weight: '600' },
          bodyFont: { family: tokens.fontMono, size: 12, weight: '400' },
          callbacks: {
            label: (ctx) => {
              const stat = boxStats[ctx.dataIndex];
              if (!stat) return '';
              const nWarning = stat.n !== undefined && stat.n < 5 ? ` (n=${stat.n} — non représentatif)` : (stat.n ? ` (n=${stat.n})` : '');
              return [
                ` Médiane: ${stat.median}${nWarning}`,
                ` Q3 (75%): ${stat.q3}`,
                ` Q1 (25%): ${stat.q1}`,
                ` Max: ${stat.max}`,
                ` Min: ${stat.min}`,
                stat.outliers?.length ? ` Outliers: ${stat.outliers.join(', ')}` : null
              ].filter(Boolean);
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }
  return {
    canvas,
    config,
    data: config.data,
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
    computeTukeyBoxplotStats: typeof computeTukeyBoxplotStats === 'function' ? computeTukeyBoxplotStats : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    getSpatialInteractionOptions: typeof getSpatialInteractionOptions === 'function' ? getSpatialInteractionOptions : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;
});
