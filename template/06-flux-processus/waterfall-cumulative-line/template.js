/**
 * @file 06-flux-processus/waterfall-cumulative-line/template.js
 * @description Standardized Waterfall Chart + Continuous Cumulative Trajectory Line Template.
 * Combines discrete sequential variance bridges and continuous net cumulative trend.
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
    global.KitCharts['waterfall-cumulative-line'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.computeWaterfallBalances = exp.computeWaterfallBalances;
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

  function computeWaterfallBalances(steps) {
    let running = 0;
    const balances = [];
    const barRanges = [];
    const types = [];

    steps.forEach((s, idx) => {
      const val = Number(s.value) || 0;
      const isTotal = Boolean(s.isTotal);

      if (idx === 0 || isTotal) {
        if (isTotal) {
          barRanges.push([0, running]);
          balances.push(running);
          types.push('total');
        } else {
          barRanges.push([0, val]);
          running = val;
          balances.push(running);
          types.push('start');
        }
      } else {
        const prev = running;
        running += val;
        barRanges.push([Math.min(prev, running), Math.max(prev, running)]);
        balances.push(running);
        types.push(val >= 0 ? 'pos' : 'neg');
      }
    });

    return { balances, barRanges, types, finalTotal: running };
  }

  const DEFAULT_DATA = {
    labels: [
      'CA Brut Initial',
      'Nouveaux Contrats',
      'Expansion Comptes',
      'Remises Commerciales',
      'Désabonnements (Churn)',
      "Frais d'Infrastructure",
      'EBITDA Net'
    ],
    datasets: [{
      label: 'Pont Financier (k€)',
      data: [
        { label: 'CA Brut Initial', value: 500, isTotal: false },
        { label: 'Nouveaux Contrats', value: 180, isTotal: false },
        { label: 'Expansion Comptes', value: 75, isTotal: false },
        { label: 'Remises Commerciales', value: -45, isTotal: false },
        { label: 'Désabonnements (Churn)', value: -60, isTotal: false },
        { label: "Frais d'Infrastructure", value: -110, isTotal: false },
        { label: 'EBITDA Net', value: 0, isTotal: true }
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
    const labels = rawData.labels || DEFAULT_DATA.labels;
    const steps = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data) || DEFAULT_DATA.datasets[0].data;

    const analysis = computeWaterfallBalances(steps);

    const posColor = tokens.semantic?.positive || tokens.status?.success || '#2E7D32';
    const negColor = tokens.semantic?.negative || tokens.status?.danger || '#C62828';
    const totalColor = tokens.emphasis?.focal || tokens.palette?.[0] || '#2B8CBE';
    const lineColor = tokens.emphasis?.benchmark || (isDark ? '#ECEFF4' : '#0F172A');

    const barColors = analysis.types.map(t => {
      if (t === 'pos') return posColor;
      if (t === 'neg') return negColor;
      return totalColor;
    });

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            type: 'bar',
            label: 'Variation Étape',
            data: analysis.barRanges,
            backgroundColor: barColors.map(c => hexToRgba(c, isDark ? 0.85 : 0.75)),
            borderColor: barColors,
            borderWidth: 1.5,
            borderRadius: 4,
            datalabels: {
              display: showDataLabels,
              formatter: (val, ctx) => {
                const s = steps[ctx.dataIndex];
                if (!s) return '';
                if (s.isTotal) return `${analysis.balances[ctx.dataIndex]} k€`;
                return `${s.value >= 0 ? '+' : ''}${s.value} k€`;
              }
            },
            order: 2
          },
          {
            type: 'line',
            label: 'Trajectoire Cumulée',
            data: analysis.balances,
            borderColor: lineColor,
            backgroundColor: lineColor,
            borderWidth: 2.5,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.15,
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
            formatter: (val, ctx) => {
              const s = steps[ctx.dataIndex];
              if (!s) return '';
              if (s.isTotal) return `${analysis.balances[ctx.dataIndex]} k€`;
              return `${s.value >= 0 ? '+' : ''}${s.value} k€`;
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
              title: (items) => items[0].label,
              label: (ctx) => {
                const idx = ctx.dataIndex;
                const s = steps[idx];
                const bal = analysis.balances[idx];
                if (ctx.dataset.type === 'bar') {
                  const valStr = s.isTotal ? `${bal} k€ (Total)` : `${s.value >= 0 ? '+' : ''}${s.value} k€`;
                  return `Impact : ${valStr}`;
                }
                return `Solde Cumulé : ${bal.toLocaleString('fr-FR')} k€`;
              }
            }
          }
        },
        scales: {
          x: {
            ...defaultOpts.scales.x,
            grid: { display: false },
            ticks: {
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 11 },
              maxRotation: 25
            }
          },
          y: {
            ...defaultOpts.scales.y,
            beginAtZero: true,
            grace: '8%',
            grid: { color: tokens.gridColor },
            title: {
              display: true,
              text: 'Solde Net (k€)',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          }
        }
      }
    };

    if (typeof Chart === 'undefined') return { config, analysis, computeWaterfallBalances };
    return new Chart(canvas, config);
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeWaterfallBalances,
    getDataLabelOptions,
    formatLabelValue
  };
});
