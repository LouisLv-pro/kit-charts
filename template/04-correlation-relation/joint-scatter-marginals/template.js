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
    global.computeMarginalKDEs = exp.computeMarginalKDEs;
    global.computeConfidenceEllipse = exp.computeConfidenceEllipse;
    global.computeCovarianceEllipse = exp.computeCovarianceEllipse;
    global.computePearsonR = exp.computePearsonR;
    global.getEmphasisStyle = exp.getEmphasisStyle;
    global.getValenceColor = exp.getValenceColor;
    global.getThresholdStatus = exp.getThresholdStatus;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const checkRequiredArrays = (KitChartsTheme && KitChartsTheme.checkRequiredArrays) || (typeof window !== 'undefined' && window.checkRequiredArrays) || function() { return null; };
  const renderInvalidData = (KitChartsTheme && KitChartsTheme.renderInvalidData) || (typeof window !== 'undefined' && window.renderInvalidData) || function(t, r) { if (typeof console !== 'undefined') console.error('[kit-charts] Données invalides : ' + r); return null; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function(t, r, o) { return { borderColor: '#2B8CBE', backgroundColor: '#2B8CBE', ...o }; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function(v, tr, th, p, t) { return {}; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  function computeMarginalKDE(values, gridPoints = 64, range = null) {
    const clean = Array.isArray(values) ? values.map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b) : [];
    const n = clean.length;
    if (n < 2) return { grid: [], density: [], maxDensity: 0, h: 1, min: 0, max: 0 };

    const mean = clean.reduce((s, v) => s + v, 0) / n;
    const variance = clean.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / (n - 1);
    const sigma = Math.sqrt(variance) || 1;
    const h = 1.06 * sigma * Math.pow(n, -0.2);

    const min = (range && Number.isFinite(range[0])) ? range[0] : clean[0] - 1.2 * h;
    const max = (range && Number.isFinite(range[1])) ? range[1] : clean[n - 1] + 1.2 * h;
    const step = (max - min) / (gridPoints - 1);

    const SQRT_2PI = Math.sqrt(2 * Math.PI);
    const grid = new Array(gridPoints);
    const density = new Array(gridPoints);
    let maxDensity = 0;

    for (let j = 0; j < gridPoints; j++) {
      const x = min + j * step;
      grid[j] = Math.round(x * 100) / 100;
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

  function computeCovarianceEllipse(points, confidence = 0.95, numPoints = 64) {
    const clean = points.filter(p => p && !isNaN(p.x) && !isNaN(p.y));
    const n = clean.length;
    if (n < 3) return { centerX: 0, centerY: 0, ellipsePoints: [], sx: 0, sy: 0, rho: 0 };

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

    const sx = Math.sqrt(Math.max(1e-9, varX));
    const sy = Math.sqrt(Math.max(1e-9, varY));
    const rho = Math.max(-0.9999, Math.min(0.9999, covXY / (sx * sy)));

    const chi2 = confidence === 0.99 ? 9.210 : confidence === 0.90 ? 4.605 : 5.991;
    const k = Math.sqrt(chi2);
    const sqrt1MinusRho2 = Math.sqrt(Math.max(0, 1 - rho * rho));

    const ellipsePoints = [];
    for (let i = 0; i <= numPoints; i++) {
      const t = (i / numPoints) * Math.PI * 2;
      const cosT = Math.cos(t);
      const sinT = Math.sin(t);
      const x = mx + k * sx * cosT;
      const y = my + k * sy * (rho * cosT + sqrt1MinusRho2 * sinT);
      ellipsePoints.push({ x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 });
    }

    return {
      centerX: Math.round(mx * 100) / 100,
      centerY: Math.round(my * 100) / 100,
      ellipsePoints,
      sx, sy, rho, k, varX, varY, covXY
    };
  }

  function computeConfidenceEllipse(points, confidence = 0.95, numPoints = 64) {
    const res = computeCovarianceEllipse(points, confidence, numPoints);
    return res.ellipsePoints || [];
  }

  function computeMarginalKDEs(points, gridPoints = 64, ranges = null) {
    const clean = points.filter(p => p && !isNaN(p.x) && !isNaN(p.y));
    const n = clean.length;
    if (n < 2) return { n, pearsonR: 0, rSquared: 0, xKde: { grid: [], density: [], maxDensity: 0 }, yKde: { grid: [], density: [], maxDensity: 0 } };

    const xVals = clean.map(p => p.x);
    const yVals = clean.map(p => p.y);

    const xKde = computeMarginalKDE(xVals, gridPoints, ranges && ranges.x);
    const yKde = computeMarginalKDE(yVals, gridPoints, ranges && ranges.y);
    const pearsonR = computePearsonR(clean);
    const rSquared = Math.round(pearsonR * pearsonR * 1000) / 1000;

    return {
      n,
      pearsonR,
      rSquared,
      xKde,
      yKde
    };
  }

  const DEFAULT_DATA = {
    datasets: [{
      label: "Temps d'attente (min) vs Satisfaction (0-100)",
      data: [
        { x: 4.2, y: 92 }, { x: 5.8, y: 86 }, { x: 6.5, y: 95 }, { x: 7.8, y: 81 }, { x: 8.4, y: 89 },
        { x: 9.6, y: 77 }, { x: 10.5, y: 85 }, { x: 11.8, y: 73 }, { x: 12.4, y: 82 }, { x: 13.9, y: 70 },
        { x: 15.1, y: 78 }, { x: 15.8, y: 64 }, { x: 16.9, y: 75 }, { x: 17.5, y: 62 }, { x: 18.9, y: 69 },
        { x: 19.4, y: 58 }, { x: 20.8, y: 67 }, { x: 21.5, y: 53 }, { x: 22.9, y: 63 }, { x: 23.4, y: 48 },
        { x: 24.8, y: 59 }, { x: 25.5, y: 45 }, { x: 26.9, y: 55 }, { x: 27.8, y: 42 }, { x: 28.5, y: 51 },
        { x: 29.8, y: 39 }, { x: 31.2, y: 46 }, { x: 32.5, y: 35 }, { x: 33.8, y: 41 }, { x: 35.0, y: 32 },
        { x: 11.2, y: 90 }, { x: 14.0, y: 65 }, { x: 18.0, y: 79 }, { x: 22.0, y: 47 }, { x: 27.0, y: 38 }
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

    const finitePts = points.filter(p => p && Number.isFinite(p.x) && Number.isFinite(p.y));
    const niceMax = (v, q) => Math.ceil(v / q) * q;
    const niceMin = (v, q) => Math.floor(v / q) * q;
    const dMinX = Math.min(...finitePts.map(p => p.x));
    const dMaxX = Math.max(...finitePts.map(p => p.x));
    const dMinY = Math.min(...finitePts.map(p => p.y));
    const dMaxY = Math.max(...finitePts.map(p => p.y));
    const inPercent = dMinY >= 0 && dMaxY <= 100;
    const ellipseData = computeCovarianceEllipse(points, 0.95, 64);
    const ellipsePoints = ellipseData.ellipsePoints;
    const ellX = ellipsePoints.map(p => p.x);
    const ellY = ellipsePoints.map(p => p.y);
    const eMinX = ellX.length ? Math.min(...ellX) : dMinX;
    const eMaxX = ellX.length ? Math.max(...ellX) : dMaxX;
    const eMinY = ellY.length ? Math.min(...ellY) : dMinY;
    const eMaxY = ellY.length ? Math.max(...ellY) : dMaxY;
    // Axes bornés pour contenir données ET ellipse de confiance (aucune coupe par le cadre)
    const axisX = [Math.max(0, niceMin(Math.min(dMinX - 2, eMinX), 5)), niceMax(Math.max(dMaxX + 2, eMaxX), 5)];
    const axisY = inPercent
      ? [Math.min(0, niceMin(eMinY, 10)), Math.max(100, niceMax(eMaxY, 10))]
      : [niceMin(Math.min(dMinY - 5, eMinY), 10), niceMax(Math.max(dMaxY + 5, eMaxY), 10)];
    const marginals = computeMarginalKDEs(points, 64, { x: axisX, y: axisY });
    const kdeX = marginals.xKde;
    const kdeY = marginals.yKde;
    const pearsonR = marginals.pearsonR;
    const rSquared = marginals.rSquared;

    const mainColor = getColor(tokens, 0) || '#2B8CBE';
    const accentColor = tokens.emphasis?.focal || getColor(tokens, 1) || '#E66101';
    const textColor = tokens.textPrimary || '#0F172A';
    const textMuted = tokens.textMuted || '#64748B';
    const gridColor = tokens.gridColor || (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)');

    // OLS Linear Regression
    let minX = Infinity, maxX = -Infinity;
    let sumX = 0, sumY = 0;
    points.forEach(p => {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      sumX += p.x;
      sumY += p.y;
    });
    const meanX = sumX / points.length;
    const meanY = sumY / points.length;
    let num = 0, den = 0;
    points.forEach(p => {
      num += (p.x - meanX) * (p.y - meanY);
      den += (p.x - meanX) * (p.x - meanX);
    });
    const slope = den !== 0 ? num / den : 0;
    const intercept = meanY - slope * meanX;
    const regressionPoints = [
      { x: Math.floor(minX), y: Math.round((intercept + slope * Math.floor(minX)) * 10) / 10 },
      { x: Math.ceil(maxX), y: Math.round((intercept + slope * Math.ceil(maxX)) * 10) / 10 }
    ];

    // Géométrie proportionnelle à la zone : marginales plus fines et sans texte en carte étroite
    const jointGeom = (w, h) => {
      const narrow = w < 460;
      const mW = narrow ? Math.max(16, Math.round(w * 0.045)) : Math.max(24, Math.min(38, Math.round(w * 0.035)));
      const mH = narrow ? Math.max(16, Math.round(h * 0.06)) : Math.max(24, Math.min(38, Math.round(h * 0.09)));
      return { narrow, mW, mH, labels: !narrow };
    };
    const jointplotPainterPlugin = {
      id: 'kitChartsJointMarginalsPainter',
      beforeLayout(chart) {
        const g = jointGeom(chart.width, chart.height);
        const want = {
          top: g.mH + (g.labels ? 18 : 12),
          right: g.mW + (g.labels ? 28 : 14),
          bottom: 4,
          left: 4
        };
        const cur = chart.options.layout && chart.options.layout.padding;
        if (cur && cur.top === want.top && cur.right === want.right) return;
        chart.options.layout.padding = want;
      },
      beforeDatasetsDraw(chart) {
        const { ctx, scales: { x, y } } = chart;
        if (!x || !y) return;

        // 1. Dessin de l'ellipse de confiance bivariée 95%
        if (ellipsePoints && ellipsePoints.length > 2) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(chart.chartArea.left, chart.chartArea.top, chart.chartArea.right - chart.chartArea.left, chart.chartArea.bottom - chart.chartArea.top);
          ctx.clip();
          ctx.beginPath();
          for (let i = 0; i < ellipsePoints.length; i++) {
            const px = x.getPixelForValue(ellipsePoints[i].x);
            const py = y.getPixelForValue(ellipsePoints[i].y);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fillStyle = hexToRgba(accentColor, isDark ? 0.16 : 0.08);
          ctx.fill();
          ctx.strokeStyle = hexToRgba(accentColor, 0.70);
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 3]);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.restore();
        }
      },
      afterDraw(chart) {
        const { ctx, scales: { x, y }, chartArea } = chart;
        if (!x || !y || !chartArea) return;

        ctx.save();

        // -------------------------------------------------------------
        // 2. DISTRIBUTION MARGINALE X (Haut)
        // -------------------------------------------------------------
        if (kdeX.grid.length && kdeX.maxDensity > 0) {
          const topMarginH = jointGeom(chart.width, chart.height).mH;
          const baseY = chartArea.top - 8;

          // Ligne de base
          ctx.strokeStyle = gridColor;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(chartArea.left, baseY);
          ctx.lineTo(chartArea.right, baseY);
          ctx.stroke();

          // Courbe KDE remplie
          ctx.beginPath();
          const firstX = Math.max(chartArea.left, Math.min(chartArea.right, x.getPixelForValue(kdeX.grid[0])));
          ctx.moveTo(firstX, baseY);
          for (let j = 0; j < kdeX.grid.length; j++) {
            const px = Math.max(chartArea.left, Math.min(chartArea.right, x.getPixelForValue(kdeX.grid[j])));
            const ratio = kdeX.density[j] / kdeX.maxDensity;
            const py = baseY - (ratio * topMarginH);
            ctx.lineTo(px, py);
          }
          const lastX = Math.max(chartArea.left, Math.min(chartArea.right, x.getPixelForValue(kdeX.grid[kdeX.grid.length - 1])));
          ctx.lineTo(lastX, baseY);
          ctx.closePath();

          const gradX = ctx.createLinearGradient(0, baseY - topMarginH, 0, baseY);
          gradX.addColorStop(0, hexToRgba(mainColor, 0.35));
          gradX.addColorStop(1, hexToRgba(mainColor, 0.04));
          ctx.fillStyle = gradX;
          ctx.fill();

          ctx.strokeStyle = hexToRgba(mainColor, 0.85);
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let j = 0; j < kdeX.grid.length; j++) {
            const px = Math.max(chartArea.left, Math.min(chartArea.right, x.getPixelForValue(kdeX.grid[j])));
            const py = baseY - (kdeX.density[j] / kdeX.maxDensity) * topMarginH;
            if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.stroke();

          // Label indicateur
          if (jointGeom(chart.width, chart.height).labels) {
            ctx.fillStyle = textMuted;
            ctx.font = `600 10px ${tokens.fontFamily || 'Inter, sans-serif'}`;
            ctx.textAlign = 'left';
            ctx.fillText('Densité marginale X', chartArea.left + 2, baseY - topMarginH + 2);
          }
        }

        // -------------------------------------------------------------
        // 3. DISTRIBUTION MARGINALE Y (Droite)
        // -------------------------------------------------------------
        if (kdeY.grid.length && kdeY.maxDensity > 0) {
          const rightMarginW = jointGeom(chart.width, chart.height).mW;
          const baseX = chartArea.right + 8;

          // Ligne de base
          ctx.strokeStyle = gridColor;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(baseX, chartArea.top);
          ctx.lineTo(baseX, chartArea.bottom);
          ctx.stroke();

          // Courbe KDE remplie
          ctx.beginPath();
          const firstY = Math.max(chartArea.top, Math.min(chartArea.bottom, y.getPixelForValue(kdeY.grid[0])));
          ctx.moveTo(baseX, firstY);
          for (let j = 0; j < kdeY.grid.length; j++) {
            const py = Math.max(chartArea.top, Math.min(chartArea.bottom, y.getPixelForValue(kdeY.grid[j])));
            const ratio = kdeY.density[j] / kdeY.maxDensity;
            const px = baseX + (ratio * rightMarginW);
            ctx.lineTo(px, py);
          }
          const lastY = Math.max(chartArea.top, Math.min(chartArea.bottom, y.getPixelForValue(kdeY.grid[kdeY.grid.length - 1])));
          ctx.lineTo(baseX, lastY);
          ctx.closePath();

          const gradY = ctx.createLinearGradient(baseX + rightMarginW, 0, baseX, 0);
          gradY.addColorStop(0, hexToRgba(mainColor, 0.35));
          gradY.addColorStop(1, hexToRgba(mainColor, 0.04));
          ctx.fillStyle = gradY;
          ctx.fill();

          ctx.strokeStyle = hexToRgba(mainColor, 0.85);
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let j = 0; j < kdeY.grid.length; j++) {
            const py = Math.max(chartArea.top, Math.min(chartArea.bottom, y.getPixelForValue(kdeY.grid[j])));
            const px = baseX + (kdeY.density[j] / kdeY.maxDensity) * rightMarginW;
            if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.stroke();

          // Label indicateur
          if (jointGeom(chart.width, chart.height).labels) {
            ctx.fillStyle = textMuted;
            ctx.font = `600 10px ${tokens.fontFamily || 'Inter, sans-serif'}`;
            ctx.textAlign = 'left';
            ctx.save();
            ctx.translate(baseX + rightMarginW + 12, chartArea.bottom);
            ctx.rotate(-Math.PI / 2);
            ctx.fillText('Densité marginale Y', 0, 0);
            ctx.restore();
          }
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
            label: `${seriesLabel} (N = ${points.length})`,
            data: points,
            backgroundColor: hexToRgba(mainColor, 0.75),
            borderColor: mainColor,
            borderWidth: 1.5,
            pointRadius: 5.5,
            pointHoverRadius: 8,
            order: 2
          },
          {
            type: 'line',
            label: `Régression OLS (r = ${pearsonR}, R² = ${rSquared})`,
            data: regressionPoints,
            borderColor: hexToRgba(tokens.textSecondary || '#475569', 0.85),
            borderWidth: 2,
            borderDash: [5, 4],
            pointStyle: 'line',
            pointRadius: 0,
            pointHoverRadius: 0,
            fill: false,
            tension: 0,
            order: 3
          }
        ]
      },
      options: {
        ...defaultOpts,
        layout: {
          padding: { top: 54, right: 64, bottom: 4, left: 4 }
        },
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
            position: 'bottom',
            align: 'center',
            labels: {
              color: tokens.textPrimary,
              font: { family: tokens.fontFamily, size: 11 },
              usePointStyle: true,
              boxWidth: 8,
              padding: 10
            }
          },
          tooltip: {
            ...defaultOpts.plugins.tooltip,
            callbacks: {
              label: (ctx) => {
                if (ctx.dataset.type === 'scatter') {
                  return `Observation : X = ${ctx.parsed.x} min, Y = ${ctx.parsed.y} / 100`;
                }
                return `Régression : y = ${Math.round(slope * 100) / 100}x + ${Math.round(intercept * 10) / 10}`;
              }
            }
          }
        },
        scales: {
          x: {
            type: 'linear',
            ...defaultOpts.scales.x,
            min: axisX[0],
            max: axisX[1],
            grid: { color: tokens.gridColor },
            title: {
              display: true,
              text: "Temps d'attente au support (min)",
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '600' }
            }
          },
          y: {
            type: 'linear',
            ...defaultOpts.scales.y,
            min: axisY[0],
            max: axisY[1],
            ticks: {
              ...(defaultOpts.scales.y && defaultOpts.scales.y.ticks),
              // Score borné à 100 : pas de graduation au-delà (l'ellipse peut dépasser)
              callback: (v) => (inPercent && (v > 100 || v < 0)) ? '' : v
            },
            grid: { color: tokens.gridColor },
            title: {
              display: true,
              text: 'Score de satisfaction client CSAT (0-100)',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '600' }
            }
          }
        }
      },
      plugins: [jointplotPainterPlugin]
    };

    if (typeof Chart === 'undefined') {
      return {
        config,
        kdeX,
        kdeY,
        ellipsePoints,
        ellipseData,
        pearsonR,
        rSquared,
        computeMarginalKDE,
        computeMarginalKDEs,
        computeConfidenceEllipse,
        computeCovarianceEllipse,
        computePearsonR,
        getEmphasisStyle,
        getValenceColor,
        getThresholdStatus
      };
    }
    return new Chart(canvas, config);
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeMarginalKDE,
    computeMarginalKDEs,
    computeConfidenceEllipse,
    computeCovarianceEllipse,
    computePearsonR,
    getEmphasisStyle,
    getValenceColor,
    getThresholdStatus
  };
});
