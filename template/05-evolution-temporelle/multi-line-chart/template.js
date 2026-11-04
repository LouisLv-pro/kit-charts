/**
 * @file template/05-evolution-temporelle/multi-line-chart/template.js
 * @description Standardized Universal multi-line-chart Template for kit-charts.
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
    global.KitCharts['multi-line-chart'] = exp;
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
  const resolveSeriesBudget = (KitChartsTheme && KitChartsTheme.resolveSeriesBudget) || (typeof window !== 'undefined' && window.resolveSeriesBudget) || function(d) { return d; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return {}; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 05-evolution-temporelle/multi-line-chart/template.js
 * @description Standardized Multi-Line Chart template for kit-charts.
 * Visualizes multi-series temporal evolution with Focus + Context principles (2-4 series max).
 * Rejects dual-Y distortion, provides grouped index tooltips, and strict semantic double-encoding.
 */

/**
 * Données par défaut représentatives (Comparaison de croissance de gammes de produits avec focus narratif)
 */
const DEFAULT_DATA = {
  labels: ['T1-23', 'T2-23', 'T3-23', 'T4-23', 'T1-24', 'T2-24', 'T3-24', 'T4-24'],
  datasets: [
    {
      label: 'Produit Cloud Platform (Hero)',
      data: [42, 58, 78, 105, 140, 185, 230, 290],
      role: 'focal'
    },
    {
      label: 'Produit Core Enterprise (Benchmark)',
      data: [130, 145, 155, 168, 180, 192, 205, 218],
      role: 'benchmark'
    },
    {
      label: 'Produit Legacy Desktop (Context)',
      data: [95, 90, 84, 76, 68, 58, 48, 38],
      role: 'context'
    }
  ]
};

/**
 * Creates and renders a Multi-Line Chart in the specified canvas target.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - DOM Canvas ID or Canvas Element
 * @param {Object} [customData] - Optional user data payload
 * @param {string} [themeName='colorbrewer-accessible'] - Theme identifier
 * @param {Object} [options={}] - Additional options (maxSeries, aggregateRemainder, budgetSeries)
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

  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels ? [...rawData.labels] : [];
  const rawDatasets = rawData.datasets || [];

  const budgetedDatasets = (options.budgetSeries !== false && rawDatasets.length > (options.maxSeries || 7))
    ? resolveSeriesBudget(rawDatasets, {
        maxSeries: options.maxSeries || 7,
        aggregateRemainder: options.aggregateRemainder !== undefined ? options.aggregateRemainder : true,
        rankBy: options.rankBy || 'sum'
      })
    : rawDatasets;

  const datasets = budgetedDatasets.map((ds, idx) => {
    const defaultRole = idx === 0 ? 'focal' : (idx === 1 ? 'benchmark' : 'context');
    const role = ds.role || (ds.forecast ? 'forecast' : defaultRole);
    const isForecast = role === 'forecast' || Boolean(ds.forecast);


    let baseColor = getColor(tokens, idx);
    if (ds.valence && ds.metricType) {
      baseColor = getValenceColor(tokens, ds.valence, ds.metricType);
    } else if (ds.valence) {
      baseColor = getValenceColor(tokens, ds.valence, 'gain');
    }

    const emphasisStyle = getEmphasisStyle(tokens, role, {
      fill: ds.fill ?? false,
      alpha: ds.alpha,
      borderColor: ds.borderColor || (ds.valence ? baseColor : undefined),
      borderWidth: ds.borderWidth ?? (isTufte ? 1.5 : (role === 'focal' ? 3.0 : (role === 'benchmark' ? 2.0 : 1.5)))
    });

    const border = ds.borderColor || emphasisStyle.borderColor || baseColor;
    const bg = ds.backgroundColor || (typeof emphasisStyle.backgroundColor === 'string'
      ? emphasisStyle.backgroundColor
      : hexToRgba(border, 0.2));

    return {
      label: ds.label || `Série ${idx + 1}`,
      data: Array.isArray(ds.data) ? [...ds.data] : [],
      borderColor: border,
      backgroundColor: bg,
      borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : emphasisStyle.borderWidth,
      borderDash: ds.borderDash || emphasisStyle.borderDash || (isForecast ? [5, 5] : (role === 'benchmark' ? [4, 4] : [])),
      tension: typeof ds.tension === 'number' ? ds.tension : 0.25,
      fill: ds.fill !== undefined ? ds.fill : false,
      pointRadius: typeof ds.pointRadius === 'number' ? ds.pointRadius : (emphasisStyle.pointRadius ?? (role === 'focal' ? 4 : (role === 'benchmark' ? 3 : 2))),
      pointHoverRadius: 6,
      pointStyle: ds.pointStyle || emphasisStyle.pointStyle || (isForecast ? 'crossRot' : (role === 'benchmark' ? 'rectRot' : 'circle')),
      pointBackgroundColor: ds.pointBackgroundColor || emphasisStyle.pointBackgroundColor || border,
      pointBorderColor: ds.pointBorderColor || emphasisStyle.pointBorderColor || tokens.bg,
      pointBorderWidth: ds.pointBorderWidth ?? 1.5
    };
  });

  const chartData = { labels, datasets };

  // Texte lisible (WCAG AA 4.5:1) : assombrit/éclaircit la couleur de série jusqu'au contraste requis sur la surface.
function legibleOn(color, surface) {
  const hex = (c) => {
    const m = /^#([0-9a-f]{6})$/i.exec(String(c || '').trim());
    return m ? [0, 2, 4].map(i => parseInt(m[1].substr(i, 2), 16)) : null;
  };
  const lum = (rgb) => {
    const ch = rgb.map(v => { const x = v / 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); });
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  };
  const fg = hex(color);
  const bg = hex(surface) || [255, 255, 255];
  if (!fg) return color;
  const target = lum(bg) > 0.4 ? 0 : 255;
  let cur = fg;
  for (let k = 0; k <= 20; k++) {
    const l1 = lum(cur), l2 = lum(bg);
    if ((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05) >= 4.5) break;
    cur = fg.map(v => Math.round(v + (target - v) * (k + 1) * 0.05));
  }
  return '#' + cur.map(v => v.toString(16).padStart(2, '0')).join('');
}


  // Étiquettes directes en fin de courbe (plugin local) : remplacent la légende.
  const directLabels = options.directLabels !== false && datasets.length > 0;
  // Découpe un libellé en lignes d'au plus maxW pixels (retour à la ligne aux espaces, jamais de rognage).
  const wrapLabel = (ctx, text, maxW) => {
    const words = String(text).split(' ');
    const lines = [];
    let cur = '';
    words.forEach((w) => {
      const t = cur ? cur + ' ' + w : w;
      if (cur && ctx.measureText(t).width > maxW) { lines.push(cur); cur = w; } else { cur = t; }
    });
    if (cur) lines.push(cur);
    return lines;
  };
  const labelFont = (chart) => (chart.width < 460 ? 11 : 12);
  const directLabelPlugin = {
    id: 'kitChartsDirectLabels',
    beforeLayout(chart) {
      if (!directLabels) return;
      const ctx = chart.ctx;
      ctx.save();
      ctx.font = `600 ${labelFont(chart)}px ${tokens.fontFamily || 'sans-serif'}`;
      let w = 0;
      (chart.data.datasets || []).forEach((d) => { w = Math.max(w, ctx.measureText(d.label || '').width); });
      ctx.restore();
      // Réservation proportionnelle à la largeur : au plus 36 % du graphique, le reste passe à la ligne.
      const reserve = Math.ceil(Math.min(w, chart.width * 0.36)) + 16;
      const pad = chart.options.layout && chart.options.layout.padding;
      if (pad && typeof pad === 'object' && pad.right === reserve) return;
      const base = (pad && typeof pad === 'object' && pad.left !== undefined) ? pad : { top: 4, bottom: 4, left: 4, right: 4 };
      chart.options.layout = { ...(chart.options.layout || {}), padding: { ...base, right: reserve } };
    },
    afterDatasetsDraw(chart) {
      if (!directLabels) return;
      const { ctx, chartArea } = chart;
      const fs = labelFont(chart);
      const lineH = fs + 2;
      const maxW = Math.max(40, chart.width - chartArea.right - 14);
      ctx.save();
      ctx.font = `600 ${fs}px ${tokens.fontFamily || 'sans-serif'}`;
      const items = [];
      chart.data.datasets.forEach((d, i) => {
        if (!chart.isDatasetVisible(i)) return;
        const meta = chart.getDatasetMeta(i);
        let last = meta.data.length - 1;
        while (last >= 0 && (meta.data[last] == null || d.data[last] == null)) last--;
        if (last < 0) return;
        const raw = (typeof d.borderColor === 'string' ? d.borderColor : tokens.textPrimary);
        const lines = wrapLabel(ctx, d.label || '', maxW);
        items.push({ lines, h: lines.length * lineH, color: legibleOn(raw, tokens.surface), x: meta.data[last].x, y: meta.data[last].y });
      });
      items.sort((a, b) => a.y - b.y);
      // Centres des blocs : posés sur la courbe puis écartés pour ne jamais se chevaucher.
      items.forEach((it, k) => {
        it.cy = it.y;
        if (k > 0) it.cy = Math.max(it.cy, items[k - 1].cy + (items[k - 1].h + it.h) / 2 + 2);
      });
      for (let k = items.length - 1; k >= 0; k--) {
        const maxC = k === items.length - 1 ? chartArea.bottom + 4 - items[k].h / 2 : items[k + 1].cy - (items[k + 1].h + items[k].h) / 2 - 2;
        if (items[k].cy > maxC) items[k].cy = maxC;
      }
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      items.forEach((it) => {
        ctx.fillStyle = it.color;
        it.lines.forEach((ln, j) => {
          ctx.fillText(ln, it.x + 10, it.cy - it.h / 2 + lineH * (j + 0.5));
        });
      });
      ctx.restore();
    }
  };
  const baseOptions = getChartDefaultOptions(tokens);
  const temporalOpts = getTemporalInteractionOptions(tokens, { mode: 'index', axis: 'x', hitRadius: 12, hoverRadius: 6 });
  const animOpts = getAccessibleAnimationOptions(tokens, { duration: 700, easing: 'easeOutCubic' });

  const config = {
    type: 'line',
    data: chartData,
    plugins: [directLabelPlugin],
    options: {
      ...baseOptions,
      ...temporalOpts,
      animation: animOpts,
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 6
          }
        },
        y: {
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 8,
            callback: (val) => {
              if (typeof val === 'number' && Math.abs(val) >= 1000) {
                return new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(val);
              }
              return val;
            }
          }
        }
      },
      plugins: {
        legend: {
          display: !isTufte && !directLabels,
          position: 'top',
          align: 'end',
          labels: {
            color: tokens.textPrimary,
            font: {
              family: tokens.fontFamily,
              size: 12,
              weight: '500'
            },
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
            padding: 14,
            generateLabels: (chart) => (chart.data.datasets || []).map((ds, i) => {
              const c = (typeof ds.borderColor === 'string')
                ? ds.borderColor
                : (Array.isArray(ds.borderColor) ? ds.borderColor[0] : (ds.backgroundColor || '#9CA3AF'));
              return {
                text: ds.label || ('Série ' + (i + 1)),
                fillStyle: c,
                strokeStyle: c,
                fontColor: tokens.textPrimary,
                lineWidth: 2,
                pointStyle: 'line',
                hidden: !chart.isDatasetVisible(i),
                index: i
              };
            })
          }
        },
        tooltip: {
          backgroundColor: tokens.tooltipBg,
          titleColor: tokens.tooltipText,
          bodyColor: tokens.tooltipText,
          borderColor: tokens.borderStrong,
          borderWidth: 1,
          padding: 10,
          cornerRadius: 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono,
            size: 12,
            weight: '500'
          },
          callbacks: {
            label: (context) => {
              const val = context.parsed.y !== null && context.parsed.y !== undefined
                ? context.parsed.y
                : context.raw;
              const formatted = typeof val === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(val)
                : val;
              const roleTag = context.dataset.borderDash && context.dataset.borderDash.length > 0 ? ' [Tirets]' : '';
              return ` ${context.dataset.label || ''}: ${formatted}${roleTag}`;
            }
          }
        }
      }
    }
  };

  const budgetInfo = budgetedDatasets.__budget;

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    const chartInstance = new Chart(canvas, config);
    chartInstance.$kitBudget = budgetInfo;
    return chartInstance;
  }

  // Headless test fallback mock
  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    $kitBudget: budgetInfo,
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
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;
});
