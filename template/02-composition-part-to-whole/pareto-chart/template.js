/**
 * @file 02-composition-part-to-whole/pareto-chart/template.js
 * @description Standardized Pareto Diagram Template for kit-charts.
 * Combines descending sorted category frequencies and cumulative percentage curve (80/20 rule).
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
    global.KitCharts['pareto-chart'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.computeParetoCumsum = exp.computeParetoCumsum;
    global.computeGini = exp.computeGini;
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

  /**
   * Trie les catégories par ordre décroissant de valeur et calcule les cumuls.
   */
  function computeParetoCumsum(labels, values) {
    const pairs = labels.map((lbl, idx) => ({ label: lbl, value: Number(values[idx]) || 0 }));
    pairs.sort((a, b) => b.value - a.value);

    const total = pairs.reduce((sum, p) => sum + p.value, 0);
    let running = 0;

    const sortedLabels = [];
    const sortedValues = [];
    const cumulativePcts = [];

    pairs.forEach(p => {
      sortedLabels.push(p.label);
      sortedValues.push(p.value);
      running += p.value;
      const pct = total > 0 ? (running / total) * 100 : 0;
      cumulativePcts.push(Math.round(pct * 10) / 10);
    });

    const thresholdIndex80 = cumulativePcts.findIndex(p => p >= 80);

    return {
      labels: sortedLabels,
      values: sortedValues,
      cumulativePcts,
      thresholdIndex80,
      total
    };
  }

  /**
   * Calcule le coefficient de Gini pour évaluer la concentration Pareto.
   * G = Σ|xi - xj| / (2 * n^2 * mu)
   */
  function computeGini(values) {
    const clean = Array.isArray(values) ? values.map(Number).filter(v => !isNaN(v) && v >= 0) : [];
    const n = clean.length;
    if (n < 2) return 0;
    const mean = clean.reduce((s, v) => s + v, 0) / n;
    if (mean === 0) return 0;

    let diffSum = 0;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        diffSum += Math.abs(clean[i] - clean[j]);
      }
    }
    return Math.round((diffSum / (2 * n * n * mean)) * 1000) / 1000;
  }

  const DEFAULT_DATA = {
    labels: [
      "Erreur d'authentification",
      'Timeout passerelle SQL',
      'Fichier payload corrompu',
      'Certificat SSL expiré',
      'Quota mémoire dépassé',
      'Erreur DNS transitoire',
      'Déconnexion WebSocket'
    ],
    datasets: [{
      label: "Occurrences d'Incidents",
      data: [142, 89, 45, 23, 14, 8, 4]
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
    const inputLabels = rawData.labels || DEFAULT_DATA.labels;
    const inputValues = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data) || DEFAULT_DATA.datasets[0].data;
    const seriesLabel = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].label) || 'Incidents';

    const pareto = computeParetoCumsum(inputLabels, inputValues);
    const gini = computeGini(pareto.values);

    const barColor = getColor(tokens, 0);
    const lineColor = tokens.emphasis?.focal || tokens.palette?.[1] || '#E66101';
    const thresholdColor = tokens.emphasis?.benchmark || tokens.status?.warning || '#CA0020';

    const pareto80LinePlugin = {
      id: 'kitChartsPareto80Line',
      afterDatasetsDraw(chart) {
        const { ctx, scales: { x, y1 }, chartArea } = chart;
        if (!y1 || !chartArea) return;

        const y80 = y1.getPixelForValue(80);
        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = thresholdColor;
        ctx.lineWidth = 1.5;
        ctx.moveTo(chartArea.left, y80);
        ctx.lineTo(chartArea.right, y80);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.font = `600 11px ${tokens.fontMono || 'monospace'}`;
        ctx.fillStyle = thresholdColor;
        ctx.textAlign = 'right';
        ctx.fillText('Seuil 80% (Vital Few)', chartArea.right - 8, y80 - 6);
        ctx.restore();
      }
    };

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'bar',
      data: {
        labels: pareto.labels,
        datasets: [
          {
            type: 'bar',
            label: seriesLabel,
            yAxisID: 'y',
            data: pareto.values,
            backgroundColor: pareto.cumulativePcts.map(pct =>
              pct <= 80 ? hexToRgba(barColor, isDark ? 0.90 : 0.80) : hexToRgba(tokens.emphasis?.context || '#CBD5E1', 0.50)
            ),
            borderColor: barColor,
            borderWidth: 1.5,
            borderRadius: 4,
            datalabels: {
              display: showDataLabels,
              color: tokens.textPrimary
            },
            order: 2
          },
          {
            type: 'line',
            label: 'Cumul (%)',
            yAxisID: 'y1',
            data: pareto.cumulativePcts,
            borderColor: lineColor,
            backgroundColor: hexToRgba(lineColor, 0.10),
            borderWidth: 2.5,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: lineColor,
            tension: 0.2,
            datalabels: {
              display: showDataLabels,
              align: 'top',
              anchor: 'center',
              color: lineColor,
              font: { weight: '700', size: 10 },
              formatter: (v) => `${v}%`
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
              if (ctx && ctx.dataset && ctx.dataset.type === 'line') {
                return `${v}%`;
              }
              return formatLabelValue(v);
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
                if (ctx.dataset.type === 'bar') {
                  const pctIndiv = ((pareto.values[idx] / pareto.total) * 100).toFixed(1);
                  return `Effectif : ${ctx.parsed.y} (${pctIndiv}% du total)`;
                }
                return `Cumul : ${ctx.parsed.y}% (Gini = ${gini})`;
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
              maxRotation: 30
            }
          },
          y: {
            type: 'linear',
            position: 'left',
            beginAtZero: true,
            grace: '8%',
            grid: { color: tokens.gridColor },
            title: {
              display: true,
              text: "Nombre d'occurrences",
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          },
          y1: {
            type: 'linear',
            position: 'right',
            beginAtZero: true,
            min: 0,
            max: 105,
            grid: { display: false },
            ticks: {
              color: lineColor,
              font: { family: tokens.fontMono, size: 11 },
              callback: (val) => `${val}%`
            },
            title: {
              display: true,
              text: 'Pourcentage cumulé',
              color: lineColor,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          }
        }
      },
      plugins: [pareto80LinePlugin]
    };

    if (typeof Chart === 'undefined') return Object.assign(config, { pareto, gini, computeParetoCumsum, computeGini });
    return new Chart(canvas, config);
  }

  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || function() { return {}; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || function() { return '#2B8CBE'; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || function() { return 'nominal'; };

  function computeParetoCumulative(labels, values) {
    const res = computeParetoCumsum(labels, values);
    return {
      sortedLabels: res.labels,
      sortedValues: res.values,
      cumulativePcts: res.cumulativePcts,
      cumulativePercentages: res.cumulativePcts,
      total: res.total,
      thresholdIndex80: res.thresholdIndex80,
      labels: res.labels,
      values: res.values
    };
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeParetoCumsum,
    computeParetoCumulative,
    computeGini,
    computeGiniCoefficient: computeGini,
    getDataLabelOptions,
    formatLabelValue,
    getEmphasisStyle,
    getValenceColor,
    getThresholdStatus
  };
});
