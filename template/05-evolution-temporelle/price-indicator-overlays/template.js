/**
 * @file 05-evolution-temporelle/price-indicator-overlays/template.js
 * @description Standardized Price Series + Technical Indicator Overlays (SMA / Bollinger Bands) Template.
 * Enforces strict 3-layer cognitive capacity constraint (Miller 1956 / Mayer 2001).
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
    global.KitCharts['price-indicator-overlays'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.computeSMA = exp.computeSMA;
    global.computeEMA = exp.computeEMA;
    global.computeBollingerBands = exp.computeBollingerBands;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return o || {}; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  function computeSMA(prices, period = 20) {
    if (!Array.isArray(prices)) return [];
    return prices.map((val, idx, arr) => {
      if (idx < period - 1) {
        const slice = arr.slice(0, idx + 1);
        return Math.round((slice.reduce((s, v) => s + v, 0) / slice.length) * 100) / 100;
      }
      const slice = arr.slice(idx - period + 1, idx + 1);
      return Math.round((slice.reduce((s, v) => s + v, 0) / period) * 100) / 100;
    });
  }

  function computeEMA(prices, period = 50) {
    if (!Array.isArray(prices) || prices.length === 0) return [];
    const k = 2 / (period + 1);
    const ema = [prices[0]];
    for (let i = 1; i < prices.length; i++) {
      ema.push(Math.round((prices[i] * k + ema[i - 1] * (1 - k)) * 100) / 100);
    }
    return ema;
  }

  function computeBollingerBands(prices, period = 20, k = 2) {
    const sma = computeSMA(prices, period);
    const upper = [];
    const lower = [];

    prices.forEach((val, idx, arr) => {
      const start = Math.max(0, idx - period + 1);
      const slice = arr.slice(start, idx + 1);
      const mean = sma[idx];
      const variance = slice.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / slice.length;
      const sigma = Math.sqrt(variance);

      upper.push(Math.round((mean + k * sigma) * 100) / 100);
      lower.push(Math.round((mean - k * sigma) * 100) / 100);
    });

    return { sma, upper, lower };
  }

  const DEFAULT_DATA = {
    labels: [
      'J1', 'J2', 'J3', 'J4', 'J5', 'J6', 'J7', 'J8', 'J9', 'J10',
      'J11', 'J12', 'J13', 'J14', 'J15', 'J16', 'J17', 'J18', 'J19', 'J20',
      'J21', 'J22', 'J23', 'J24', 'J25', 'J26', 'J27', 'J28', 'J29', 'J30'
    ],
    datasets: [{
      label: 'Indice Synthétique (€)',
      data: [
        100, 102, 101, 104, 106, 105, 108, 110, 109, 112,
        115, 114, 116, 118, 120, 119, 122, 125, 124, 126,
        128, 127, 130, 133, 132, 135, 137, 136, 139, 142
      ]
    }]
  };

  function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
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

    const rawData = customData || DEFAULT_DATA;
    const labels = rawData.labels || DEFAULT_DATA.labels;
    const prices = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data) || DEFAULT_DATA.datasets[0].data;
    const seriesLabel = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].label) || 'Prix Clôture';

    const bollinger = computeBollingerBands(prices, 10, 2);

    const priceColor = tokens.emphasis?.focal || tokens.palette?.[0] || '#2B8CBE';
    const smaColor = tokens.palette?.[1] || '#E66101';
    const bandColor = tokens.emphasis?.context || (isDark ? '#4C566A' : '#CBD5E1');

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: seriesLabel,
            data: prices,
            borderColor: priceColor,
            backgroundColor: priceColor,
            borderWidth: 2.5,
            pointRadius: 3,
            pointHoverRadius: 5,
            tension: 0.2,
            order: 1
          },
          {
            label: 'Moyenne Mobile (SMA 10)',
            data: bollinger.sma,
            borderColor: smaColor,
            borderWidth: 1.5,
            borderDash: [3, 3],
            pointRadius: 0,
            tension: 0.3,
            order: 2
          },
          {
            label: 'Bollinger Supérieure (+2σ)',
            data: bollinger.upper,
            borderColor: hexToRgba(bandColor, 0.60),
            borderWidth: 1,
            pointRadius: 0,
            fill: '+1',
            backgroundColor: hexToRgba(bandColor, isDark ? 0.18 : 0.10),
            tension: 0.3,
            order: 3
          },
          {
            label: 'Bollinger Inférieure (-2σ)',
            data: bollinger.lower,
            borderColor: hexToRgba(bandColor, 0.60),
            borderWidth: 1,
            pointRadius: 0,
            fill: false,
            tension: 0.3,
            order: 3
          }
        ]
      },
      options: {
        ...defaultOpts,
        animation: getAccessibleAnimationOptions(tokens, { duration: 700, easing: 'easeOutCubic' }),
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          ...defaultOpts.plugins,
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              color: tokens.textPrimary,
              font: { family: tokens.fontFamily, size: 12 },
              filter: (item) => !item.text.includes('Inférieure')
            }
          },
          tooltip: {
            ...defaultOpts.plugins.tooltip,
            callbacks: {
              title: (items) => `Jour : ${items[0].label}`,
              label: (ctx) => {
                return `${ctx.dataset.label} : ${ctx.parsed.y.toFixed(2)} €`;
              }
            }
          }
        },
        scales: {
          x: {
            ...defaultOpts.scales.x,
            grid: { color: tokens.gridColor }
          },
          y: {
            ...defaultOpts.scales.y,
            beginAtZero: false,
            grid: { color: tokens.gridColor },
            title: {
              display: true,
              text: 'Valeur (€)',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          }
        }
      }
    };

    if (typeof Chart === 'undefined') return { config, bollinger, computeSMA, computeEMA, computeBollingerBands };
    return new Chart(canvas, config);
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeSMA,
    computeEMA,
    computeBollingerBands
  };
});
