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
  const checkRequiredArrays = (KitChartsTheme && KitChartsTheme.checkRequiredArrays) || (typeof window !== 'undefined' && window.checkRequiredArrays) || function() { return null; };
  const renderInvalidData = (KitChartsTheme && KitChartsTheme.renderInvalidData) || (typeof window !== 'undefined' && window.renderInvalidData) || function(t, r) { if (typeof console !== 'undefined') console.error('[kit-charts] Données invalides : ' + r); return null; };
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
  function computeConfidenceBand(points, regOrGrid, gridPoints = 30) {
    const reg = (typeof regOrGrid === 'object' && regOrGrid !== null && regOrGrid.slope !== undefined)
      ? regOrGrid
      : computeLinearRegression(points);
    const numPoints = (typeof regOrGrid === 'number') ? regOrGrid : gridPoints;

    const clean = points.filter(p => p && !isNaN(p.x));
    if (clean.length < 2 || reg.n < 2) {
      return { line: [], upper: [], lower: [], trendPoints: [], ciUpperPoints: [], ciLowerPoints: [] };
    }

    const xMin = Math.min(...clean.map(p => p.x));
    const xMax = Math.max(...clean.map(p => p.x));
    const step = numPoints > 1 ? (xMax - xMin) / (numPoints - 1) : 0;

    // Quantile de Student bilatéral 95% (ddl = n - 2), table exacte jusqu'à 30 puis développement de Cornish-Fisher
    const T975 = [0, 12.706, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365, 2.306, 2.262, 2.228, 2.201, 2.179, 2.160, 2.145, 2.131, 2.120, 2.110, 2.101, 2.093, 2.086, 2.080, 2.074, 2.069, 2.064, 2.060, 2.056, 2.052, 2.048, 2.045, 2.042];
    const df = Math.max(1, reg.n - 2);
    const tCrit = df <= 30 ? T975[df] : (1.95996 + (Math.pow(1.95996, 3) + 1.95996) / (4 * df) + (5 * Math.pow(1.95996, 5) + 16 * Math.pow(1.95996, 3) + 3 * 1.95996) / (96 * df * df));
    const line = [];
    const upper = [];
    const lower = [];

    for (let i = 0; i < numPoints; i++) {
      const x = xMin + i * step;
      const yHat = reg.intercept + reg.slope * x;
      const seFit = reg.se * Math.sqrt((1 / reg.n) + (Math.pow(x - reg.xMean, 2) / (reg.ssx || 1)));
      const margin = tCrit * seFit;

      const rd = (v) => Math.round(v * 1000) / 1000;
      line.push({ x: rd(x), y: rd(yHat) });
      upper.push({ x: rd(x), y: rd(yHat + margin) });
      lower.push({ x: rd(x), y: rd(yHat - margin) });
    }

    return {
      line,
      upper,
      lower,
      trendPoints: line,
      ciUpperPoints: upper,
      ciLowerPoints: lower
    };
  }

  function computeConfidenceInterval95(points, gridPoints = 30) {
    return computeConfidenceBand(points, gridPoints);
  }

  const DEFAULT_DATA = {
    datasets: [{
      label: "Budget R&D vs Chiffre d'Affaires (M€)",
      data: [
        { x: 1.2, y: 17.5 }, { x: 1.8, y: 15.2 }, { x: 2.1, y: 23.8 },
        { x: 2.5, y: 21.1 }, { x: 3.0, y: 31.5 }, { x: 3.4, y: 27.0 },
        { x: 3.8, y: 36.2 }, { x: 4.2, y: 35.5 }, { x: 4.6, y: 45.8 },
        { x: 5.0, y: 40.0 }, { x: 5.5, y: 52.2 }, { x: 6.0, y: 49.5 },
        { x: 6.5, y: 60.8 }, { x: 7.0, y: 56.0 }, { x: 7.5, y: 66.5 }
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
    // Données fournies mais incomplètes : refus visible, jamais de repli sur l'exemple DEFAULT_DATA.
    const invalidReason = customData ? checkRequiredArrays(rawData, ['datasets[0].data']) : null;
    if (invalidReason) return renderInvalidData(canvas, invalidReason);
    const points = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data);
    const seriesLabel = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].label) || 'Observations';

    const reg = computeLinearRegression(points);
    const bands = computeConfidenceBand(points, reg);

    const pointColor = getColor(tokens, 0);
    const regColor = (tokens.emphasis && tokens.emphasis.benchmark && tokens.emphasis.benchmark !== pointColor) ? tokens.emphasis.benchmark : (getColor(tokens, 1) || '#E66101');

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
            pointStyle: 'line',
            pointRadius: 0,
            fill: false,
            tension: 0,
            order: 1
          },
          {
            type: 'line',
            label: 'Bande IC 95% (moyenne prédite)',
            data: bands.upper,
            borderColor: hexToRgba(regColor, 0.55),
            borderWidth: 1,
            borderDash: [4, 3],
            pointStyle: 'rect',
            backgroundColor: hexToRgba(regColor, isDark ? 0.28 : 0.20),
            pointRadius: 0,
            fill: '+1',
            tension: 0,
            order: 2
          },
          {
            type: 'line',
            label: 'IC 95% Inférieur',
            data: bands.lower,
            borderColor: hexToRgba(regColor, 0.55),
            borderWidth: 1,
            borderDash: [4, 3],
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
              font: { family: tokens.fontFamily, size: 11 },
              usePointStyle: true,
              boxWidth: 20,
              padding: 8,
              filter: (item) => !item.text.includes('Inférieur')
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
              text: 'Investissement R&D (M€)',
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
              text: 'Chiffre d\'affaires (M€)',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          }
        }
      }
    };

    if (typeof Chart === 'undefined') return Object.assign(config, { reg, bands, computeLinearRegression, computeConfidenceBand, computePearsonR });
    return new Chart(canvas, config);
  }

  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || function() { return {}; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || function() { return '#2B8CBE'; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || function() { return 'nominal'; };

  return {
    createChart,
    DEFAULT_DATA,
    computeLinearRegression,
    computeLinearRegressionOLS: computeLinearRegression,
    computeConfidenceBand,
    computeConfidenceInterval95: computeConfidenceBand,
    computePearsonR,
    computeR2: (pts) => computeLinearRegression(pts).r2,
    getEmphasisStyle,
    getValenceColor,
    getThresholdStatus
  };
});
