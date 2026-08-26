/**
 * @file 04-correlation-relation/joint-scatter-marginals/template.js
 * @description Standardized Universal Joint Scatter + Marginal Distributions Template.
 * Combines 2D bivariate scatter plot, 1D marginal KDE distributions on top/right margins, and 95% confidence ellipse.
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
    global.KitCharts['joint-scatter-marginals'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.computeMarginalKDE = exp.computeMarginalKDE;
    global.computeConfidenceEllipse = exp.computeConfidenceEllipse;
    global.computePearsonR = exp.computePearsonR;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  function computeMarginalKDE(values, gridPoints = 64) {
    const clean = Array.isArray(values) ? values.map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b) : [];
    const n = clean.length;
    if (n < 2) return { grid: [], density: [], maxDensity: 0 };

    const mean = clean.reduce((s, v) => s + v, 0) / n;
    const variance = clean.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / (n - 1);
    const sigma = Math.sqrt(variance) || 1;
    const h = 1.06 * sigma * Math.pow(n, -0.2);

    const min = clean[0] - 2 * h;
    const max = clean[n - 1] + 2 * h;
    const step = (max - min) / (gridPoints - 1);

    const SQRT_2PI = Math.sqrt(2 * Math.PI);
    const grid = new Array(gridPoints);
    const density = new Array(gridPoints);
    let maxDensity = 0;

    for (let j = 0; j < gridPoints; j++) {
      const x = min + j * step;
      grid[j] = x;
      let sum = 0;
      for (let i = 0; i < n; i++) {
        const u = (x - clean[i]) / h;
        sum += Math.exp(-0.5 * u * u) / SQRT_2PI;
      }
      const d = sum / (n * h);
      density[j] = d;
      if (d > maxDensity) maxDensity = d;
    }

    return { grid, density, maxDensity, h, min, max };
  }

  function computePearsonR(points) {
    const clean = points.filter(p => p && !isNaN(p.x) && !isNaN(p.y));
    const n = clean.length;
    if (n < 2) return 0;
    const mx = clean.reduce((s, p) => s + p.x, 0) / n;
    const my = clean.reduce((s, p) => s + p.y, 0) / n;
    let num = 0, dx2 = 0, dy2 = 0;
    clean.forEach(p => {
      const dx = p.x - mx;
      const dy = p.y - my;
      num += dx * dy;
      dx2 += dx * dx;
      dy2 += dy * dy;
    });
    return (dx2 > 0 && dy2 > 0) ? Math.round((num / Math.sqrt(dx2 * dy2)) * 1000) / 1000 : 0;
  }

  function computeConfidenceEllipse(points, confidence = 0.95, numPoints = 64) {
    const clean = points.filter(p => p && !isNaN(p.x) && !isNaN(p.y));
    const n = clean.length;
    if (n < 3) return [];

    const mx = clean.reduce((s, p) => s + p.x, 0) / n;
    const my = clean.reduce((s, p) => s + p.y, 0) / n;

    let varX = 0, varY = 0, covXY = 0;
    clean.forEach(p => {
      const dx = p.x - mx;
      const dy = p.y - my;
      varX += dx * dx;
      varY += dy * dy;
      covXY += dx * dy;
    });
    varX /= (n - 1);
    varY /= (n - 1);
    covXY /= (n - 1);

    const trace = varX + varY;
    const det = varX * varY - covXY * covXY;
    const term = Math.sqrt(Math.max(0, Math.pow((varX - varY) / 2, 2) + covXY * covXY));
    const lambda1 = trace / 2 + term;
    const lambda2 = Math.max(0, trace / 2 - term);

    const theta = Math.atan2(lambda1 - varX, covXY);
    const chi2Val = 5.991; // 95% quantile for df=2
    const a = Math.sqrt(Math.max(0, chi2Val * lambda1));
    const b = Math.sqrt(Math.max(0, chi2Val * lambda2));

    const ellipsePoints = [];
    for (let i = 0; i <= numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const ex = a * Math.cos(angle);
      const ey = b * Math.sin(angle);
      const rotX = mx + ex * Math.cos(theta) - ey * Math.sin(theta);
      const rotY = my + ex * Math.sin(theta) + ey * Math.cos(theta);
      ellipsePoints.push({ x: Math.round(rotX * 100) / 100, y: Math.round(rotY * 100) / 100 });
    }
    return ellipsePoints;
  }

  const DEFAULT_DATA = {
    datasets: [{
      label: "Temps d'Attente (s) vs Satisfaction (Score)",
      data: [
        { x: 12, y: 88 }, { x: 15, y: 85 }, { x: 18, y: 82 }, { x: 22, y: 78 },
        { x: 25, y: 75 }, { x: 28, y: 72 }, { x: 30, y: 70 }, { x: 35, y: 65 },
        { x: 40, y: 60 }, { x: 45, y: 55 }, { x: 50, y: 48 }, { x: 55, y: 45 },
        { x: 60, y: 38 }, { x: 65, y: 35 }, { x: 70, y: 30 }, { x: 75, y: 25 },
        { x: 20, y: 80 }, { x: 32, y: 68 }, { x: 48, y: 52 }, { x: 58, y: 42 }
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

    const xVals = points.map(p => p.x);
    const yVals = points.map(p => p.y);

    const kdeX = computeMarginalKDE(xVals);
    const kdeY = computeMarginalKDE(yVals);
    const ellipse = computeConfidenceEllipse(points);
    const pearsonR = computePearsonR(points);

    const mainColor = getColor(tokens, 0);
    const ellipseColor = tokens.emphasis?.focal || tokens.palette?.[1] || '#E66101';

    const marginalPainterPlugin = {
      id: 'kitChartsJointMarginalsPainter',
      afterDatasetsDraw(chart) {
        const { ctx, scales: { x, y }, chartArea } = chart;
        if (!x || !y || !chartArea) return;

        ctx.save();

        // 1. Marginal KDE X (au sommet du graphique)
        if (kdeX.grid.length && kdeX.maxDensity > 0) {
          const topBandH = 30;
          ctx.beginPath();
          for (let j = 0; j < kdeX.grid.length; j++) {
            const px = x.getPixelForValue(kdeX.grid[j]);
            const ratio = kdeX.density[j] / kdeX.maxDensity;
            const py = chartArea.top + topBandH - (ratio * topBandH);
            if (j === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.strokeStyle = hexToRgba(mainColor, 0.75);
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // 2. Marginal KDE Y (sur la marge droite du graphique)
        if (kdeY.grid.length && kdeY.maxDensity > 0) {
          const rightBandW = 30;
          ctx.beginPath();
          for (let j = 0; j < kdeY.grid.length; j++) {
            const py = y.getPixelForValue(kdeY.grid[j]);
            const ratio = kdeY.density[j] / kdeY.maxDensity;
            const px = chartArea.right - rightBandW + (ratio * rightBandW);
            if (j === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.strokeStyle = hexToRgba(mainColor, 0.75);
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        ctx.restore();
      }
    };

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'scatter',
      data: {
        datasets: [
          {
            type: 'scatter',
            label: seriesLabel,
            data: points,
            backgroundColor: hexToRgba(mainColor, 0.80),
            borderColor: mainColor,
            borderWidth: 1.5,
            pointRadius: 5,
            pointHoverRadius: 7,
            order: 2
          },
          {
            type: 'line',
            label: `Ellipse de confiance 95% (r = ${pearsonR})`,
            data: ellipse,
            borderColor: hexToRgba(ellipseColor, 0.85),
            backgroundColor: hexToRgba(ellipseColor, isDark ? 0.15 : 0.08),
            borderWidth: 1.5,
            pointRadius: 0,
            fill: true,
            tension: 0.1,
            order: 1
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
              font: { family: tokens.fontFamily, size: 12 }
            }
          },
          tooltip: {
            ...defaultOpts.plugins.tooltip,
            callbacks: {
              label: (ctx) => {
                if (ctx.dataset.type === 'scatter') {
                  return `Observation : X = ${ctx.parsed.x}, Y = ${ctx.parsed.y}`;
                }
                return `Ellipse 95% (Corrélation r = ${pearsonR})`;
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
              text: "Temps d'attente (s)",
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
              text: 'Score de satisfaction (0-100)',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          }
        }
      },
      plugins: [marginalPainterPlugin]
    };

    if (typeof Chart === 'undefined') return { config, kdeX, kdeY, ellipse, pearsonR, computeMarginalKDE, computeConfidenceEllipse, computePearsonR };
    return new Chart(canvas, config);
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeMarginalKDE,
    computeConfidenceEllipse,
    computePearsonR
  };
});
