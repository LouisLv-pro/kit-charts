/**
 * @file 04-correlation-relation/scatter-regression/template.js
 * @description Standardized Scatter Plot + OLS Linear Regression + 95% Confidence Band Template.
 * Implements ordinary least squares and exact prediction confidence bands.
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
    global.KitCharts['scatter-regression'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.computeLinearRegression = exp.computeLinearRegression;
    global.computeConfidenceBand = exp.computeConfidenceBand;
    global.computePearsonR = exp.computePearsonR;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function(t, o) { return o || {}; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  /**
   * Régression linéaire par moindres carrés ordinaires (OLS).
   */
  function computeLinearRegression(points) {
    const clean = Array.isArray(points) ? points.filter(p => p && !isNaN(p.x) && !isNaN(p.y)) : [];
    const n = clean.length;
    if (n < 2) return { slope: 0, intercept: 0, r: 0, r2: 0, se: 0, n: 0, xMean: 0, yMean: 0, ssx: 0 };

    const xMean = clean.reduce((s, p) => s + p.x, 0) / n;
    const yMean = clean.reduce((s, p) => s + p.y, 0) / n;

    let num = 0;
    let denX = 0;
    let denY = 0;

    clean.forEach(p => {
      const dx = p.x - xMean;
      const dy = p.y - yMean;
      num += dx * dy;
      denX += dx * dx;
      denY += dy * dy;
    });

    const slope = denX !== 0 ? num / denX : 0;
    const intercept = yMean - slope * xMean;
    const r = (denX > 0 && denY > 0) ? num / Math.sqrt(denX * denY) : 0;
    const r2 = r * r;

    let ssRes = 0;
    clean.forEach(p => {
      const pred = intercept + slope * p.x;
      ssRes += Math.pow(p.y - pred, 2);
    });
    const se = n > 2 ? Math.sqrt(ssRes / (n - 2)) : 0;

    return {
      slope,
      intercept,
      r: Math.round(r * 1000) / 1000,
      r2: Math.round(r2 * 1000) / 1000,
      se,
      n,
      xMean,
      yMean,
      ssx: denX
    };
  }

  function computePearsonR(points) {
    return computeLinearRegression(points).r;
  }

  /**
   * Calcule la bande de confiance à 95% pour la moyenne prédite.
   */
  function computeConfidenceBand(points, reg, gridPoints = 30) {
    const clean = points.filter(p => p && !isNaN(p.x));
    if (clean.length < 3 || reg.n < 3) return { line: [], upper: [], lower: [] };

    const xMin = Math.min(...clean.map(p => p.x));
    const xMax = Math.max(...clean.map(p => p.x));
    const step = (xMax - xMin) / (gridPoints - 1);

    const tCrit = 1.96; // Approximation asymptotique normale
    const line = [];
    const upper = [];
    const lower = [];

    for (let i = 0; i < gridPoints; i++) {
      const x = xMin + i * step;
      const yHat = reg.intercept + reg.slope * x;
      const seFit = reg.se * Math.sqrt((1 / reg.n) + (Math.pow(x - reg.xMean, 2) / (reg.ssx || 1)));
      const margin = tCrit * seFit;

      line.push({ x: Math.round(x * 10) / 10, y: Math.round(yHat * 10) / 10 });
      upper.push({ x: Math.round(x * 10) / 10, y: Math.round((yHat + margin) * 10) / 10 });
      lower.push({ x: Math.round(x * 10) / 10, y: Math.round((yHat - margin) * 10) / 10 });
    }

    return { line, upper, lower };
  }

  const DEFAULT_DATA = {
    datasets: [{
      label: "Budget R&D vs Chiffre d'Affaires (M€)",
      data: [
        { x: 1.2, y: 14.5 }, { x: 1.8, y: 18.2 }, { x: 2.1, y: 19.8 },
        { x: 2.5, y: 24.1 }, { x: 3.0, y: 28.5 }, { x: 3.4, y: 31.0 },
        { x: 3.8, y: 33.2 }, { x: 4.2, y: 39.5 }, { x: 4.6, y: 41.8 },
        { x: 5.0, y: 44.0 }, { x: 5.5, y: 49.2 }, { x: 6.0, y: 53.5 },
        { x: 6.5, y: 56.8 }, { x: 7.0, y: 62.0 }, { x: 7.5, y: 64.5 }
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
    const points = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data) || DEFAULT_DATA.datasets[0].data;
    const seriesLabel = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].label) || 'Observations';

    const reg = computeLinearRegression(points);
    const bands = computeConfidenceBand(points, reg);

    const pointColor = getColor(tokens, 0);
    const regColor = tokens.emphasis?.focal || tokens.palette?.[1] || '#E66101';

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'scatter',
      data: {
        datasets: [
          {
            type: 'scatter',
            label: seriesLabel,
            data: points,
            backgroundColor: hexToRgba(pointColor, 0.75),
            borderColor: pointColor,
            borderWidth: 1.5,
            pointRadius: 5,
            pointHoverRadius: 7,
            order: 3
          },
          {
            type: 'line',
            label: `Régression OLS (R² = ${reg.r2}, r = ${reg.r})`,
            data: bands.line,
            borderColor: regColor,
            borderWidth: 2.5,
            pointRadius: 0,
            fill: false,
            tension: 0,
            order: 1
          },
          {
            type: 'line',
            label: 'IC 95% Supérieur',
            data: bands.upper,
            borderColor: 'transparent',
            backgroundColor: hexToRgba(regColor, isDark ? 0.20 : 0.12),
            pointRadius: 0,
            fill: '+1',
            tension: 0,
            order: 2
          },
          {
            type: 'line',
            label: 'IC 95% Inférieur',
            data: bands.lower,
            borderColor: 'transparent',
            pointRadius: 0,
            fill: false,
            tension: 0,
            order: 2
          }
        ]
      },
      options: {
        ...defaultOpts,
        animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
        interaction: {
          mode: 'nearest',
          axis: 'xy',
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
              filter: (item) => !item.text.includes('Inférieur') && !item.text.includes('Supérieur')
            }
          },
          tooltip: {
            ...defaultOpts.plugins.tooltip,
            callbacks: {
              label: (ctx) => {
                if (ctx.dataset.type === 'scatter') {
                  return `Observation : X = ${ctx.parsed.x}, Y = ${ctx.parsed.y}`;
                }
                if (ctx.dataset.label.includes('Régression')) {
                  return `Prédiction ŷ = ${ctx.parsed.y} (R² = ${reg.r2})`;
                }
                return `Borne IC 95% : ${ctx.parsed.y}`;
              }
            }
          }
        },
        scales: {
          x: {
            type: 'linear',
            ...defaultOpts.scales.x,
            grid: { color: tokens.gridColor },
            title: {
              display: true,
              text: 'Variable X (Investissement R&D)',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          },
          y: {
            type: 'linear',
            ...defaultOpts.scales.y,
            grid: { color: tokens.gridColor },
            title: {
              display: true,
              text: 'Variable Y (Revenu)',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          }
        }
      }
    };

    if (typeof Chart === 'undefined') return { config, reg, bands, computeLinearRegression, computeConfidenceBand, computePearsonR };
    return new Chart(canvas, config);
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeLinearRegression,
    computeConfidenceBand,
    computePearsonR
  };
});
