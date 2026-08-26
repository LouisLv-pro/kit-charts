/**
 * @file 02-composition-part-to-whole/stacked-total-line/template.js
 * @description Standardized Stacked Bar/Area + Macro Total Line Template for kit-charts.
 * Combines granular part-to-whole categorical breakdown and cumulative macro total trendline.
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
    global.KitCharts['stacked-total-line'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.computeStackedTotals = exp.computeStackedTotals;
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

  function computeStackedTotals(datasets) {
    if (!Array.isArray(datasets) || datasets.length === 0) return [];
    const len = datasets[0].data.length;
    const totals = new Array(len).fill(0);
    datasets.forEach(ds => {
      ds.data.forEach((val, idx) => {
        totals[idx] += Number(val) || 0;
      });
    });
    return totals.map(v => Math.round(v * 10) / 10);
  }

  const DEFAULT_DATA = {
    labels: ['T1 2024', 'T2 2024', 'T3 2024', 'T4 2024', 'T1 2025', 'T2 2025', 'T3 2025', 'T4 2025'],
    datasets: [
      { label: 'Cloud SaaS', data: [120, 145, 170, 195, 230, 260, 290, 330] },
      { label: 'Services Pro', data: [80, 85, 90, 95, 90, 85, 80, 75] },
      { label: 'Licences On-Prem', data: [110, 100, 90, 80, 70, 60, 50, 40] }
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
    const isDark = Boolean(tokens.isDark);
    const showDataLabels = (customData && customData.showDataLabels !== undefined)
      ? customData.showDataLabels
      : (options.showDataLabels !== undefined ? options.showDataLabels : true);

    const rawData = customData || DEFAULT_DATA;
    const labels = rawData.labels || DEFAULT_DATA.labels;
    const rawDatasets = rawData.datasets || DEFAULT_DATA.datasets;

    const totals = computeStackedTotals(rawDatasets);
    const totalColor = tokens.emphasis?.focal || (isDark ? '#ECEFF4' : '#0F172A');

    const processedDatasets = rawDatasets.map((ds, idx) => {
      const color = getColor(tokens, idx);
      return {
        type: 'bar',
        label: ds.label,
        data: ds.data,
        backgroundColor: hexToRgba(color, 0.85),
        borderColor: color,
        borderWidth: 1,
        stack: 'totalStack',
        datalabels: {
          display: showDataLabels
        },
        order: 2
      };
    });

    processedDatasets.push({
      type: 'line',
      label: "Chiffre d'Affaires Total",
      data: totals,
      borderColor: totalColor,
      backgroundColor: totalColor,
      borderWidth: 3,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointBackgroundColor: totalColor,
      tension: 0.25,
      datalabels: {
        display: showDataLabels,
        align: 'top',
        anchor: 'center',
        color: totalColor,
        font: { weight: '700', size: 10 },
        formatter: (v) => formatLabelValue(v)
      },
      order: 1
    });

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'bar',
      data: {
        labels,
        datasets: processedDatasets
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
              title: (items) => `Période : ${items[0].label}`,
              footer: (items) => {
                const totalVal = totals[items[0].dataIndex];
                return `Total Consolidé : ${totalVal.toLocaleString('fr-FR')} k€`;
              }
            }
          }
        },
        scales: {
          x: {
            ...defaultOpts.scales.x,
            stacked: true,
            grid: { display: false }
          },
          y: {
            ...defaultOpts.scales.y,
            stacked: true,
            beginAtZero: true,
            grace: '10%',
            grid: { color: tokens.gridColor },
            title: {
              display: true,
              text: 'Revenu (k€)',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          }
        }
      }
    };

    if (typeof Chart === 'undefined') return { config, totals, computeStackedTotals };
    return new Chart(canvas, config);
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeStackedTotals,
    getDataLabelOptions,
    formatLabelValue
  };
});
