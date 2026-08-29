/**
 * @file template/03-distribution/distribution-heatmap/template.js
 * @description Standardized Universal distribution-heatmap Template for kit-charts.
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
    global.KitCharts['distribution-heatmap'] = exp;
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
   * Données par défaut représentatives (Charge CPU serveur % par Plage Horaire x Jour de la semaine)
   */
  const DEFAULT_DATA = (() => {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const hours = ['00-04h', '04-08h', '08-12h', '12-16h', '16-20h', '20-24h'];
    const matrix = [];

    for (let d = 0; d < days.length; d++) {
      for (let h = 0; h < hours.length; h++) {
        const isWeekend = d >= 5;
        const isWorkHours = h >= 2 && h <= 4;
        let baseVal = isWeekend ? 15 : 30;
        if (isWorkHours && !isWeekend) baseVal += 52;
        if (h === 3 && !isWeekend) baseVal += 12;
        const noise = Math.sin(d * 3 + h * 5) * 5;
        const v = Math.max(5, Math.min(100, Math.round(baseVal + noise)));

        matrix.push({
          x: days[d],
          y: hours[h],
          day: days[d],
          hour: hours[h],
          v
        });
      }
    }

    return {
      labels: days,
      xLabels: days,
      yLabels: hours,
      datasets: [{
        label: 'Charge Serveur (%)',
        data: matrix
      }]
    };
  })();

  /**
   * Crée et initialise une Heatmap de Distribution 2D dans le canvas cible.
   */
  function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
    const canvas = typeof canvasTarget === 'string'
      ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
      : canvasTarget;

    if (!canvas) {
      throw new Error(`Canvas element "${canvasTarget}" not found`);
    }

    if (typeof Chart !== 'undefined' && Chart.getChart) {
      const existing = Chart.getChart(canvas);
      if (existing) existing.destroy();
    }

    const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
    const tokens = getThemeTokens(themeName, container);
    const isDark = Boolean(tokens.isDark);
    const isTufte = tokens.name === 'tufte-minimalist-executive';

    const rawData = customData || DEFAULT_DATA;
    const rawPoints = rawData.datasets?.[0]?.data || [];

    // Détection robuste des étiquettes X et Y
    let xLabels = rawData.xLabels || rawData.labels;
    let yLabels = rawData.yLabels;

    if (!xLabels || !Array.isArray(xLabels) || xLabels.length === 0) {
      const xSet = new Set();
      rawPoints.forEach(p => { if (p && p.x !== undefined) xSet.add(String(p.x)); });
      xLabels = Array.from(xSet);
      if (xLabels.length === 0) xLabels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    }

    if (!yLabels || !Array.isArray(yLabels) || yLabels.length === 0) {
      const ySet = new Set();
      rawPoints.forEach(p => { if (p && p.y !== undefined) ySet.add(String(p.y)); });
      yLabels = Array.from(ySet);
      if (yLabels.length === 0) yLabels = ['00-04h', '04-08h', '08-12h', '12-16h', '16-20h', '20-24h'];
    }

    // Normalisation des points pour correspondre aux labels de catégories
    const formattedData = rawPoints.map(p => {
      let xVal = p.x;
      let yVal = p.y;
      if (typeof xVal === 'number' && xLabels[xVal - 1]) xVal = xLabels[xVal - 1];
      if (typeof yVal === 'number' && yLabels[yVal - 1]) yVal = yLabels[yVal - 1];
      return {
        ...p,
        x: xVal,
        y: yVal,
        v: p.v ?? p.value ?? 0
      };
    });

    const maxVal = formattedData.length > 0
      ? Math.max(...formattedData.map(p => (typeof p === 'object' && p !== null ? (p.v ?? 0) : 0)), 1)
      : 100;
    const minVal = formattedData.length > 0
      ? Math.min(...formattedData.map(p => (typeof p === 'object' && p !== null ? (p.v ?? 0) : 0)), 0)
      : 0;

    const firstDs = rawData.datasets?.[0] || {};
    const dataset = {
      label: firstDs.label || 'Densité 2D',
      data: formattedData,
      backgroundColor: (ctx) => {
        const raw = ctx.raw;
        if (raw && (raw.role || raw.emphasis)) {
          return getEmphasisStyle(tokens, raw.role || raw.emphasis).backgroundColor;
        }
        if (raw && raw.isAnomaly) {
          return tokens.emphasis?.anomaly || '#D01C8B';
        }
        const v = raw?.v ?? raw?.value ?? (typeof raw === 'number' ? raw : 0);
        if (firstDs.valence || firstDs.metricType) {
          const threshold = firstDs.threshold ?? (maxVal + minVal) / 2;
          const delta = v - threshold;
          return getValenceColor(tokens, delta, firstDs.metricType || firstDs.valence || 'gain');
        }
        const ratio = maxVal > minVal ? Math.max(0, Math.min(1, (v - minVal) / (maxVal - minVal))) : 0.5;
        return getSequentialColor(tokens, ratio);
      },
      borderColor: (ctx) => {
        const raw = ctx.raw;
        if (raw && (raw.role === 'focal' || raw.emphasis === 'focal')) {
          return tokens.emphasis?.focal || tokens.textPrimary;
        }
        if (raw && (raw.role === 'anomaly' || raw.isAnomaly)) {
          return tokens.emphasis?.anomaly || '#D01C8B';
        }
        return isTufte ? tokens.textPrimary : (tokens.surface || '#FFFFFF');
      },
      borderWidth: (ctx) => {
        const raw = ctx.raw;
        if (raw && (raw.role === 'focal' || raw.role === 'anomaly' || raw.isAnomaly)) {
          return 2.5;
        }
        return isTufte ? 0.5 : 2;
      },
      borderRadius: 4,
      width: ({ chart }) => {
        const area = chart.chartArea;
        if (!area) return 24;
        const cols = Math.max(1, xLabels.length);
        return (area.width / cols) - 4;
      },
      height: ({ chart }) => {
        const area = chart.chartArea;
        if (!area) return 24;
        const rows = Math.max(1, yLabels.length);
        return (area.height / rows) - 4;
      }
    };

    const heatmapValueLabelsPlugin = {
      id: 'kitChartsHeatmapValuesPlugin',
      afterDatasetsDraw(chart) {
        const { ctx, data } = chart;
        const meta = chart.getDatasetMeta(0);
        if (!meta || !meta.data) return;

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `600 11px ${tokens.fontMono || 'monospace'}`;

        meta.data.forEach((element, i) => {
          const item = data.datasets[0].data[i];
          if (!item || item.v === undefined) return;
          const ratio = maxVal > minVal ? (item.v - minVal) / (maxVal - minVal) : 0.5;
          ctx.fillStyle = ratio > 0.45 ? '#FFFFFF' : (tokens.textPrimary || '#0F172A');
          const cp = typeof element.getCenterPoint === 'function'
            ? element.getCenterPoint()
            : { x: element.x + (element.width || 0) / 2, y: element.y + (element.height || 0) / 2 };
          ctx.fillText(`${item.v}%`, cp.x, cp.y);
        });

        ctx.restore();
      }
    };

    const chartData = { datasets: [dataset] };
    const defaultOpts = getChartDefaultOptions(tokens);
    const spatialOpts = getSpatialInteractionOptions(tokens, { mode: 'nearest', axis: 'xy', hitRadius: 12, hoverRadius: 6 });
    const animOpts = getAccessibleAnimationOptions(tokens, { duration: 350, easing: 'easeOutQuad' });

    const config = {
      type: 'matrix',
      data: chartData,
      options: {
        ...defaultOpts,
        ...spatialOpts,
        layout: {
          padding: {
            top: 20,
            right: 20,
            bottom: 34,
            left: 12
          }
        },
        animation: animOpts,
        plugins: {
          ...defaultOpts.plugins,
          legend: { display: false },
          tooltip: {
            ...defaultOpts.plugins?.tooltip,
            titleFont: { family: tokens.fontFamily, size: 12, weight: '600' },
            bodyFont: { family: tokens.fontMono, size: 12, weight: '400' },
            callbacks: {
              title: (items) => {
                if (!items.length) return '';
                const r = items[0].raw;
                return `${r.x} • Plage ${r.y}`;
              },
              label: (context) => {
                const r = context.raw;
                const v = r?.v ?? r?.value ?? 0;
                return ` Charge observée : ${v}%`;
              }
            }
          }
        },
        scales: {
          x: {
            type: 'category',
            labels: xLabels,
            position: 'bottom',
            grid: { display: false },
            border: { display: false },
            ticks: {
              display: true,
              color: tokens.textPrimary,
              font: {
                family: tokens.fontFamily,
                weight: '600',
                size: 12
              },
              padding: 12
            }
          },
          y: {
            type: 'category',
            labels: yLabels,
            position: 'left',
            grid: { display: false },
            border: { display: false },
            ticks: {
              display: true,
              color: tokens.textSecondary,
              font: {
                family: tokens.fontFamily,
                size: 11
              },
              padding: 12
            }
          }
        }
      },
      plugins: [heatmapValueLabelsPlugin]
    };

    if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function' && typeof Chart === 'function') {
      return new Chart(canvas, config);
    }

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
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : {},
    createChart: typeof createChart === 'function' ? createChart : null,
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
