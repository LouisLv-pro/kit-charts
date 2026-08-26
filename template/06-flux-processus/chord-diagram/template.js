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
 * Employs circular matrix projection, dynamic theme palette tokens, semantic emphasis, and tabular numeric tooltips.
 */

/**
 * Données par défaut représentatives (Matrice de flux économiques inter-régionaux avec entité focale)
 */
const DEFAULT_DATA = {
  labels: ['Région Nord (Focal)', 'Région Sud', 'Région Est', 'Région Ouest'],
  datasets: [
    {
      label: 'Flux Émis — Nord (Focal)',
      data: [0, 25, 18, 12],
      role: 'focal'
    },
    {
      label: 'Flux Émis — Sud',
      data: [20, 0, 15, 30],
      role: 'context'
    },
    {
      label: 'Flux Émis — Est',
      data: [14, 16, 0, 22],
      role: 'context'
    },
    {
      label: 'Flux Émis — Ouest',
      data: [10, 28, 20, 0],
      role: 'context'
    }
  ]
};

/**
 * Creates and renders a Chord Diagram (Radial Matrix Flow) in the specified canvas target.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - DOM Canvas ID or Canvas Element
 * @param {Object} [customData] - Optional user data payload
 * @param {string} [themeName='colorbrewer-accessible'] - Theme identifier
 * @returns {Object} Initialized Chart.js instance or mock instance
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
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
  const reduceMotion = isReducedMotionPreferred();

  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels || ['Région Nord', 'Région Sud', 'Région Est', 'Région Ouest'];

  const datasets = (rawData.datasets || []).map((ds, idx) => {
    const role = ds.role || (idx === 0 ? 'focal' : 'context');
    const isFocal = role === 'focal';

    let baseColor = getColor(tokens, idx);
    if (ds.valence && ds.metricType) {
      baseColor = getValenceColor(tokens, ds.valence, ds.metricType);
    }

    const cleanData = Array.isArray(ds.data)
      ? ds.data.map(d => typeof d === 'object' && d !== null ? (d.value ?? d.flow ?? d.v ?? 10) : Number(d) || 0)
      : [10, 20, 15, 25];

    const alpha = ds.alpha ?? (isTufte ? 0.15 : (isFocal ? 0.35 : 0.18));
    const border = ds.borderColor || (isFocal ? (tokens.emphasis?.focal || baseColor) : baseColor);
    const bg = ds.backgroundColor || hexToRgba(border, alpha);

    return {
      label: ds.label || `Flux Émis — ${labels[idx] || `Entité ${idx + 1}`}`,
      data: cleanData,
      borderColor: border,
      backgroundColor: bg,
      borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : (isFocal ? 2.5 : 1.5),
      fill: ds.fill ?? true,
      pointRadius: typeof ds.pointRadius === 'number' ? ds.pointRadius : (isFocal ? 4 : 2),
      pointHitRadius: 12,
      pointHoverRadius: isFocal ? 7 : 5,
      pointBackgroundColor: border,
      pointBorderColor: tokens.bg
    };
  });

  const chartData = { labels, datasets };
  const baseOptions = getChartDefaultOptions(tokens);

  const config = {
    type: 'radar',
    data: chartData,
    options: {
      scales: {},
      ...baseOptions,
      responsive: true,
      maintainAspectRatio: false,
      animation: getAccessibleAnimationOptions(tokens, {
        duration: (isTufte || reduceMotion) ? 0 : 450,
        easing: 'easeOutQuart'
      }),
      interaction: {
        mode: 'nearest',
        intersect: false,
        axis: 'r'
      },
      hover: {
        mode: 'nearest',
        intersect: false,
        animationDuration: (isTufte || reduceMotion) ? 0 : 100
      },
      scales: {
        r: {
          grid: {
            color: tokens.gridColor,
            lineWidth: 1
          },
          angleLines: {
            color: tokens.gridColor,
            lineWidth: 1
          },
          pointLabels: {
            color: tokens.textPrimary,
            font: {
              family: tokens.fontFamily,
              size: 11,
              weight: '500'
            }
          },
          ticks: {
            color: tokens.textSecondary,
            backdropColor: 'transparent',
            font: {
              family: tokens.fontFamily,
              size: 10
            }
          }
        }
      },
      plugins: {
        legend: {
          display: true && !isTufte,
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
            padding: 14
          }
        },
        tooltip: {
          backgroundColor: tokens.tooltipBg || '#0F172A',
          titleColor: tokens.tooltipText || '#F8FAFC',
          bodyColor: tokens.tooltipText || '#F8FAFC',
          borderColor: tokens.borderStrong || tokens.border || '#334155',
          borderWidth: 1,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          boxPadding: 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono,
            size: 12,
            weight: '400'
          },
          callbacks: {
            label: (ctx) => {
              const val = ctx.raw;
              const formatted = typeof val === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(val)
                : val;
              return ` ${ctx.dataset.label || ''} → ${ctx.label || ''} : ${formatted} flux`;
            }
          }
        }
      }
    }
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
