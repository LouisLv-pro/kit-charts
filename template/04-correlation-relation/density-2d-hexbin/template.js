/**
 * @file template/04-correlation-relation/density-2d-hexbin/template.js
 * @description Standardized Universal Density 2D Hexagonal Binning (Hexbin) Template for kit-charts.
 * Renders a true regular honeycomb lattice of 6-sided hexagons with continuous bivariate density encoding.
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
    global.KitCharts['density-2d-hexbin'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.computeHexBins = exp.computeHexBins;
    global.compute2DBins = exp.compute2DBins;
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
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return '#2B8CBE'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function(t, r, o) { return { borderColor: '#2B8CBE', backgroundColor: '#2B8CBE', ...o }; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function() { return {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function(t, o) { return {}; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  /**
   * Calcule le pavage hexagonal d'un échantillon continu de points (x, y)
   */
  function computeHexBins(rawPoints, xBins = 14, yBins = 10) {
    if (!Array.isArray(rawPoints) || rawPoints.length === 0) {
      return { bins: [], minX: 145, maxX: 200, minY: 45, maxY: 110, maxCount: 0, total: 0 };
    }

    // Si les points sont déjà binnés ({x, y, v})
    if (rawPoints[0] && typeof rawPoints[0].v === 'number') {
      const maxCount = Math.max(...rawPoints.map(p => p.v || 0), 1);
      const total = rawPoints.reduce((s, p) => s + (p.v || 0), 0);
      return { bins: rawPoints, maxCount, total };
    }

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    rawPoints.forEach(p => {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    });

    const stepX = (maxX - minX) / xBins || 5;
    const stepY = (maxY - minY) / yBins || 6;
    const counts = new Map();
    let maxCount = 0;
    // Affectation au centre hexagonal le plus proche (pavage pointy-top, rangées impaires décalées d'un demi-pas).
    // Espace réel normalisé (R=1) : x = u * sqrt(3), y = v * 1.5.
    const S3 = Math.sqrt(3);
    rawPoints.forEach(p => {
      const u = (p.x - minX) / stepX;
      const v = (p.y - minY) / stepY;
      // Réseau pair : centres (i, 2j) ; réseau impair : centres (i + 0.5, 2j + 1)
      const rowA = 2 * Math.round(v / 2);
      const colA = Math.round(u);
      const rowB = 2 * Math.round((v - 1) / 2) + 1;
      const colB = Math.round(u - 0.5) + 0.5;
      const dA = Math.pow((u - colA) * S3, 2) + Math.pow((v - rowA) * 1.5, 2);
      const dB = Math.pow((u - colB) * S3, 2) + Math.pow((v - rowB) * 1.5, 2);
      const row = dA <= dB ? rowA : rowB;
      const colF = dA <= dB ? colA : colB;
      const hx = Math.round((minX + colF * stepX) * 10) / 10;
      const hy = Math.round((minY + row * stepY) * 10) / 10;
      const key = `${hx}_${hy}`;
      const count = (counts.get(key) || 0) + 1;
      counts.set(key, count);
      if (count > maxCount) maxCount = count;
    });
    const bins = [];
    counts.forEach((v, key) => {
      const [xStr, yStr] = key.split('_');
      bins.push({
        x: parseFloat(xStr),
        y: parseFloat(yStr),
        v
      });
    });

    return { bins, minX, maxX, minY, maxY, maxCount, total: rawPoints.length };
  }

  const compute2DBins = computeHexBins;

  /**
   * Données de démonstration bivariées : alvéoles pré-agrégées (Taille cm × Poids kg), N total affiché dans la légende
   */
  const DEFAULT_DATA = (() => {
    const bins = [];
    const xStep = 3.6;
    const yStep = 4.8;
    const numCols = 13;
    const numRows = 11;
    const startX = 152;
    const startY = 48;

    for (let r = 0; r < numRows; r++) {
      const isOdd = r % 2 !== 0;
      const xOffset = isOdd ? xStep * 0.5 : 0;
      const y = startY + r * yStep;

      for (let c = 0; c < numCols; c++) {
        const x = startX + c * xStep + xOffset;

        // Modèle de distribution bivariée corrélée gaussienne (Taille μ=174, Poids μ=72, corr=0.74)
        const zx = (x - 174) / 10.5;
        const zy = (y - 72) / 12.0;
        const rho = 0.74;
        const exponent = -0.5 * (zx * zx - 2 * rho * zx * zy + zy * zy) / (1 - rho * rho);
        const intensity = Math.exp(exponent);

        // Bruit statistique réaliste
        const noise = (Math.sin(c * 1.7 + r * 2.3) * 0.08);
        const v = Math.round(intensity * 148 + noise * 12);

        if (v >= 3) {
          bins.push({
            x: Math.round(x * 10) / 10,
            y: Math.round(y * 10) / 10,
            v
          });
        }
      }
    }

    return {
      datasets: [{
        label: 'Densité Biométrique (Taille cm × Poids kg)',
        data: bins
      }]
    };
  })();

  /**
   * Crée et initialise un Graphique Hexbin dans le canvas cible.
   */
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
    const isTufte = tokens.name === 'tufte-minimalist-executive';

    const rawData = customData || DEFAULT_DATA;
    // Données fournies mais incomplètes : refus visible, jamais de repli sur l'exemple DEFAULT_DATA.
    const invalidReason = customData ? checkRequiredArrays(rawData, ['datasets[0].data']) : null;
    if (invalidReason) return renderInvalidData(canvas, invalidReason);
    const rawPoints = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data);
    const seriesLabel = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].label) || 'Densité Spatiale 2D';

    const hexResult = computeHexBins(rawPoints);
    const bins = hexResult.bins || rawPoints;
    const maxCount = Math.max(...bins.map(b => b.v || 0), 1);
    const minCount = Math.min(...bins.map(b => b.v || 0), 1);
    const totalObs = bins.reduce((sum, b) => sum + (b.v || 0), 0);

    let activeHoverIdx = -1;

    // Calcul des bornes de l'axe
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    bins.forEach(b => {
      if (b.x < minX) minX = b.x;
      if (b.x > maxX) maxX = b.x;
      if (b.y < minY) minY = b.y;
      if (b.y > maxY) maxY = b.y;
    });
    // Pas réels du pavage (plus petits écarts positifs entre centres)
    const uniq = (arr) => Array.from(new Set(arr)).sort((a, b) => a - b);
    const minGap = (arr, fb) => { const u = uniq(arr); let g = Infinity; for (let i = 1; i < u.length; i++) g = Math.min(g, u[i] - u[i - 1]); return Number.isFinite(g) && g > 0 ? g : fb; };
    const yStepBin = minGap(bins.map(b => b.y), 4.8);
    const xStepBin = 2 * minGap(bins.map(b => b.x), 1.8);
    const niceFloor = (v, q) => Math.floor(v / q) * q;
    const niceCeil = (v, q) => Math.ceil(v / q) * q;
    const axMinX = niceFloor(minX - xStepBin * 0.6, 5);
    const axMaxX = niceCeil(maxX + xStepBin * 0.6, 5);
    const axMinY = niceFloor(minY - yStepBin * 0.8, 5);
    const axMaxY = niceCeil(maxY + yStepBin * 0.8, 5);
    const srgbLum = (c) => {
      let m = /^#?([0-9a-f]{6})$/i.exec(String(c).trim());
      let rgb;
      if (m) { const n = parseInt(m[1], 16); rgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
      else { const t = /rgba?\(([^)]+)\)/.exec(String(c)); rgb = t ? t[1].split(',').slice(0, 3).map(Number) : [128, 128, 128]; }
      const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
      return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]);
    };
    const textOn = (bg) => {
      const L = srgbLum(bg);
      const cLight = 1.05 / (L + 0.05);
      const cDark = (L + 0.05) / (0.0185 + 0.05);
      return cLight >= cDark ? '#FFFFFF' : '#0F172A';
    };
    // Étiquettes : jamais au-delà de 12 alvéoles ; sinon seulement les 3 plus denses (points focaux)
    const labelAll = bins.length <= 12;
    const focalSet = new Set(bins.map((b, i) => ({ i, v: b.v })).sort((a, b) => b.v - a.v).slice(0, 3).map(o => o.i));

    const hexbinCustomPlugin = {
      id: 'kitChartsHexbinHoneycombPainter',
      afterDatasetsDraw(chart) {
        const { ctx, scales: { x, y }, chartArea } = chart;
        if (!x || !y || !chartArea) return;

        ctx.save();
        ctx.lineJoin = 'round';

        ctx.save();
        ctx.beginPath();
        ctx.rect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
        ctx.clip();
        // Rayons elliptiques déduits des pas réels : pavage exact (pointy-top, rangées décalées)
        const pxStepX = Math.abs(x.getPixelForValue(minX + xStepBin) - x.getPixelForValue(minX));
        const pxStepY = Math.abs(y.getPixelForValue(minY + yStepBin) - y.getPixelForValue(minY));
        const hexRx = (pxStepX / Math.sqrt(3)) * 0.97;
        const hexRy = (pxStepY / 1.5) * 0.97;
        bins.forEach((bin, idx) => {
          const px = x.getPixelForValue(bin.x);
          const py = y.getPixelForValue(bin.y);
          // Échelle séquentielle linéaire, cohérente avec la légende
          const ratio = maxCount > minCount ? (bin.v - minCount) / (maxCount - minCount) : 1;
          const fillColor = getSequentialColor(tokens, Math.min(1, Math.max(0.06, ratio)));
          const isHovered = (idx === activeHoverIdx);
          const k = isHovered ? 1.12 : 1;
          ctx.beginPath();
          for (let q = 0; q < 6; q++) {
            const angle = (Math.PI / 6) + (q * Math.PI / 3);
            const vx = px + hexRx * k * Math.cos(angle);
            const vy = py + hexRy * k * Math.sin(angle);
            if (q === 0) ctx.moveTo(vx, vy);
            else ctx.lineTo(vx, vy);
          }
          ctx.closePath();
          ctx.fillStyle = fillColor;
          ctx.fill();
          if (isHovered) {
            ctx.strokeStyle = tokens.emphasis?.focal || tokens.textPrimary || '#FFFFFF';
            ctx.lineWidth = 2.5;
            ctx.stroke();
          } else {
            ctx.strokeStyle = isTufte
              ? tokens.textPrimary
              : (isDark ? 'rgba(36, 41, 51, 0.95)' : 'rgba(255, 255, 255, 0.90)');
            ctx.lineWidth = isTufte ? 0.75 : 1.5;
            ctx.stroke();
          }
          if ((labelAll || focalSet.has(idx)) && hexRx >= 11) {
            ctx.fillStyle = textOn(fillColor);
            ctx.font = `700 11px ${tokens.fontMono || 'monospace'}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(String(bin.v), px, py);
          }
        });
        ctx.restore();
        // 2. Échelle de Légende Continue en haut à droite
        const barW = Math.max(90, Math.min(120, Math.round((chartArea.right - chartArea.left) * 0.4)));
        const barH = 10;
        const barX = chartArea.right - barW - 6;
        const barY = chartArea.top - 26;

        // Boîtier de fond
        ctx.fillStyle = isDark ? 'rgba(36, 41, 51, 0.85)' : 'rgba(255, 255, 255, 0.85)';
        ctx.strokeStyle = tokens.gridColor || 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 1;
        if (ctx.roundRect) {
          ctx.beginPath();
          ctx.roundRect(barX - 12, barY - 18, barW + 24, barH + 34, 6);
          ctx.fill();
          ctx.stroke();
        }

        // Titre de l'échelle
        ctx.fillStyle = tokens.textSecondary || '#64748B';
        ctx.font = `600 10px ${tokens.fontFamily || 'sans-serif'}`;
        ctx.textAlign = 'left';
        ctx.fillText('Densité (obs / alvéole)', barX - 6, barY - 5);

        // Barre dégradée
        const legendGrad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
        legendGrad.addColorStop(0, getSequentialColor(tokens, 0.08));
        legendGrad.addColorStop(0.25, getSequentialColor(tokens, 0.25));
        legendGrad.addColorStop(0.5, getSequentialColor(tokens, 0.5));
        legendGrad.addColorStop(0.75, getSequentialColor(tokens, 0.75));
        legendGrad.addColorStop(1, getSequentialColor(tokens, 1.0));

        ctx.fillStyle = legendGrad;
        ctx.fillRect(barX, barY, barW, barH);
        ctx.strokeStyle = tokens.gridColor || 'rgba(0,0,0,0.1)';
        ctx.strokeRect(barX, barY, barW, barH);

        // Chiffres min et max
        ctx.fillStyle = tokens.textPrimary || '#0F172A';
        ctx.font = `500 9px ${tokens.fontMono || 'monospace'}`;
        ctx.textAlign = 'left';
        ctx.fillText(String(minCount), barX, barY + barH + 11);
        ctx.textAlign = 'right';
        ctx.fillText(`${maxCount}`, barX + barW, barY + barH + 11);

        ctx.restore();
      }
    };

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'scatter',
      data: {
        datasets: [{
          label: `${seriesLabel} (N ≈ ${totalObs} obs)`,
          data: bins.map(b => ({ x: b.x, y: b.y, v: b.v })),
          pointRadius: 0, // Les points sont dessinés comme de vrais hexagones par le plugin
          pointHoverRadius: 0,
          backgroundColor: 'transparent',
          borderColor: 'transparent'
        }]
      },
      options: {
        ...defaultOpts,
        layout: {
          padding: {
            top: 56,
            right: 24,
            bottom: 12,
            left: 12
          }
        },
        animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
        interaction: {
          mode: 'nearest',
          axis: 'xy',
          intersect: false
        },
        onHover: (evt, elements, chart) => {
          if (elements && elements.length > 0) {
            activeHoverIdx = elements[0].index;
            chart.draw();
          } else if (activeHoverIdx !== -1) {
            activeHoverIdx = -1;
            chart.draw();
          }
        },
        plugins: {
          ...defaultOpts.plugins,
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: tokens.textPrimary,
              font: { family: tokens.fontFamily, size: 11, weight: '500' },
              usePointStyle: true,
              boxWidth: 8,
              // Libellé abrégé en carte étroite : jamais rogné
              generateLabels: (chart) => {
                const full = chart.data.datasets[0].label;
                const text = chart.width < 460 ? `N ≈ ${totalObs} obs` : full;
                return [{ text, fillStyle: 'transparent', strokeStyle: 'transparent', lineWidth: 0, fontColor: tokens.textPrimary, hidden: false, datasetIndex: 0, pointStyle: 'rect' }];
              }
            }
          },
          tooltip: {
            ...defaultOpts.plugins.tooltip,
            callbacks: {
              title: (items) => {
                if (!items.length) return '';
                const r = items[0].raw;
                return `Alvéole : Taille ${r.x} cm × Poids ${r.y} kg`;
              },
              label: (context) => {
                const r = context.raw;
                const pct = totalObs > 0 ? ((r.v / totalObs) * 100).toFixed(1) : '0';
                return ` Densité : ${r.v} observations (${pct}% du total)`;
              }
            }
          }
        },
        scales: {
          x: {
            type: 'linear',
            ...defaultOpts.scales.x,
            min: axMinX,
            max: axMaxX,
            grid: { color: tokens.gridColor },
            title: {
              display: true,
              text: 'Taille corporelle (cm)',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '600' }
            }
          },
          y: {
            type: 'linear',
            ...defaultOpts.scales.y,
            min: axMinY,
            max: axMaxY,
            grid: { color: tokens.gridColor },
            title: {
              display: true,
              text: 'Masse corporelle (kg)',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '600' }
            }
          }
        }
      },
      plugins: [hexbinCustomPlugin]
    };

    if (typeof Chart === 'undefined') {
      return {
        canvas,
        config,
        data: config.data,
        options: config.options,
        ctx: canvas?.getContext ? canvas.getContext('2d') : {},
        destroy: () => {},
        update: () => {},
        resize: () => {},
        hexResult,
        bins,
        computeHexBins,
        compute2DBins,
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
    computeHexBins,
    compute2DBins,
    getEmphasisStyle,
    getValenceColor,
    getThresholdStatus
  };
});
