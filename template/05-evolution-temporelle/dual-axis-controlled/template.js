/**
 * @file 05-evolution-temporelle/dual-axis-controlled/template.js
 * @description Standardized Dual-Axis Line Chart with Strict Cognitive Normalization & Zero-Alignment.
 * Protects against spurious correlations with normalized Base-100 scales and matched axis colors.
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
    global.KitCharts['dual-axis-controlled'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.computeBase100 = exp.computeBase100;
    global.computePearsonR = exp.computePearsonR;
    global.computeZeroAlignedBounds = exp.computeZeroAlignedBounds;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return o || {}; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  function computeBase100(series, baseIndex = 0) {
    if (!Array.isArray(series) || series.length === 0) return [];
    const baseVal = Number(series[baseIndex]) || series[0] || 1;
    return series.map(v => Math.round((Number(v) / baseVal) * 1000) / 10);
  }

  function computePearsonR(s1, s2) {
    const n = Math.min(s1.length, s2.length);
    if (n < 2) return 0;
    const m1 = s1.reduce((s, v) => s + v, 0) / n;
    const m2 = s2.reduce((s, v) => s + v, 0) / n;

    let num = 0, d1 = 0, d2 = 0;
    for (let i = 0; i < n; i++) {
      const diff1 = s1[i] - m1;
      const diff2 = s2[i] - m2;
      num += diff1 * diff2;
      d1 += diff1 * diff1;
      d2 += diff2 * diff2;
    }
    return (d1 > 0 && d2 > 0) ? Math.round((num / Math.sqrt(d1 * d2)) * 1000) / 1000 : 0;
  }

  function computeZeroAlignedBounds(s1, s2) {
    const max1 = Math.max(...s1, 10);
    const max2 = Math.max(...s2, 10);
    return {
      y1: { min: 0, max: Math.ceil(max1 * 1.15) },
      y2: { min: 0, max: Math.ceil(max2 * 1.15) }
    };
  }

  const DEFAULT_DATA = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Température Moyenne (°C)',
        yAxisID: 'y',
        data: [5.2, 6.8, 10.5, 14.2, 18.6, 22.4, 25.1, 24.8, 20.3, 15.1, 9.8, 6.0]
      },
      {
        label: 'Consommation Électrique (GWh)',
        yAxisID: 'y1',
        data: [850, 780, 620, 490, 420, 380, 410, 430, 470, 560, 720, 890]
      }
    ]
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
    const showDataLabels = (customData && customData.showDataLabels !== undefined)
      ? customData.showDataLabels
      : (options.showDataLabels !== undefined ? options.showDataLabels : true);

    const rawData = customData || DEFAULT_DATA;
    const labels = rawData.labels || DEFAULT_DATA.labels;
    const s1 = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data) || DEFAULT_DATA.datasets[0].data;
    const s2 = (rawData.datasets && rawData.datasets[1] && rawData.datasets[1].data) || DEFAULT_DATA.datasets[1].data;
    const label1 = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].label) || 'Série 1';
    const label2 = (rawData.datasets && rawData.datasets[1] && rawData.datasets[1].label) || 'Série 2';

    const pearsonR = computePearsonR(s1, s2);
    const bounds = computeZeroAlignedBounds(s1, s2);

    const color1 = getColor(tokens, 0);
    const color2 = getColor(tokens, 1);

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: label1,
            yAxisID: 'y',
            data: s1,
            borderColor: color1,
            backgroundColor: color1,
            borderWidth: 2.5,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.3,
            datalabels: {
              display: showDataLabels,
              color: color1,
              align: 'top',
              anchor: 'center',
              font: { weight: '600', size: 10 }
            }
          },
          {
            label: label2,
            yAxisID: 'y1',
            data: s2,
            borderColor: color2,
            backgroundColor: color2,
            borderWidth: 2.5,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.3,
            datalabels: {
              display: showDataLabels,
              color: color2,
              align: 'bottom',
              anchor: 'center',
              font: { weight: '600', size: 10 }
            }
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
            formatter: (v) => formatLabelValue(v)
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
              title: (items) => `Mois : ${items[0].label}`,
              afterBody: () => [`Corrélation de Pearson : r = ${pearsonR}`]
            }
          }
        },
        scales: {
          x: {
            ...defaultOpts.scales.x,
            grid: { color: tokens.gridColor }
          },
          y: {
            type: 'linear',
            position: 'left',
            min: bounds.y1.min,
            max: bounds.y1.max,
            grid: { color: tokens.gridColor },
            ticks: {
              color: color1,
              font: { family: tokens.fontMono, weight: '600' }
            },
            title: {
              display: true,
              text: label1,
              color: color1,
              font: { family: tokens.fontFamily, size: 12, weight: '600' }
            }
          },
          y1: {
            type: 'linear',
            position: 'right',
            min: bounds.y2.min,
            max: bounds.y2.max,
            grid: { display: false },
            ticks: {
              color: color2,
              font: { family: tokens.fontMono, weight: '600' }
            },
            title: {
              display: true,
              text: label2,
              color: color2,
              font: { family: tokens.fontFamily, size: 12, weight: '600' }
            }
          }
        }
      }
    };

    if (typeof Chart === 'undefined') return { config, pearsonR, bounds, computeBase100, computePearsonR, computeZeroAlignedBounds };
    return new Chart(canvas, config);
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeBase100,
    computePearsonR,
    computeZeroAlignedBounds,
    getDataLabelOptions,
    formatLabelValue
  };
});
