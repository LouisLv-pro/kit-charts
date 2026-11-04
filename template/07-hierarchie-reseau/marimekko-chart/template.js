/**
 * @file template/07-hierarchie-reseau/marimekko-chart/template.js
 * @description Standardized Universal marimekko-chart Template for kit-charts.
 * Compatible with browsers (file://, http://), Node.js, and bundlers.
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
    global.KitCharts['marimekko-chart'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function() { return {}; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function() { return {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function() { return ''; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function() { return {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function() { return {}; };
  const getPartitionInteractionOptions = (KitChartsTheme && KitChartsTheme.getPartitionInteractionOptions) || (typeof window !== 'undefined' && window.getPartitionInteractionOptions) || function() { return {}; };
  const getExecutiveModeOptions = (KitChartsTheme && KitChartsTheme.getExecutiveModeOptions) || (typeof window !== 'undefined' && window.getExecutiveModeOptions) || function() { return {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 07-hierarchie-reseau/marimekko-chart/template.js
 * @description Template Chart.js v4+ pour Graphique Marimekko / Mosaïque (Marimekko / Mekko / Mosaic Chart).
 * Psychophysique: Encodage bidimensionnel proportionnel (Cleveland-McGill: aire 2D = largeur de colonne x hauteur de segment).
 * Règle cognitive: Tri décroissant des colonnes, ordre des séries fixe et identique dans chaque colonne, bordures blanches nettes, repères de pourcentages.
 */

/**
 * Données par défaut représentatives (Marché automobile européen par segment et motorisation)
 */
const DEFAULT_DATA = {
  datasets: [{
    label: 'Marché Automobile Européen (% x %)',
    data: [
      // 1. SUV (Part de marché totale = 45%)
      { col: 'SUV (45%)', sub: 'Électrique (BEV)', v: 38, colWeight: 0.45, subShare: 0.38, label: 'SUV - Électrique', role: 'focal', growth: 34.2 },
      { col: 'SUV (45%)', sub: 'Hybride (HEV/PHEV)', v: 42, colWeight: 0.45, subShare: 0.42, label: 'SUV - Hybride', role: 'context', growth: 12.0 },
      { col: 'SUV (45%)', sub: 'Thermique Pur', v: 20, colWeight: 0.45, subShare: 0.20, label: 'SUV - Thermique', role: 'context', growth: -18.5 },

      // 2. Berlines & Compactes (Part de marché totale = 35%)
      { col: 'Berlines & Compactes (35%)', sub: 'Électrique (BEV)', v: 45, colWeight: 0.35, subShare: 0.45, label: 'Berlines - Électrique', role: 'focal', growth: 26.5 },
      { col: 'Berlines & Compactes (35%)', sub: 'Hybride (HEV/PHEV)', v: 35, colWeight: 0.35, subShare: 0.35, label: 'Berlines - Hybride', role: 'context', growth: 8.4 },
      { col: 'Berlines & Compactes (35%)', sub: 'Thermique Pur', v: 20, colWeight: 0.35, subShare: 0.20, label: 'Berlines - Thermique', role: 'context', growth: -22.1 },

      // 3. Citadines (Part de marché totale = 20%)
      { col: 'Citadines (20%)', sub: 'Électrique (BEV)', v: 50, colWeight: 0.20, subShare: 0.50, label: 'Citadines - Électrique', role: 'focal', growth: 41.0 },
      { col: 'Citadines (20%)', sub: 'Hybride (HEV/PHEV)', v: 25, colWeight: 0.20, subShare: 0.25, label: 'Citadines - Hybride', role: 'context', growth: 4.1 },
      { col: 'Citadines (20%)', sub: 'Thermique Pur', v: 25, colWeight: 0.20, subShare: 0.25, label: 'Citadines - Thermique', role: 'anomaly', growth: -28.0 }
    ]
  }]
};

/**
 * Couleur de texte lisible (WCAG) selon la luminance du fond.
 */
function readableTextOn(bg) {
  const fn = (KitChartsTheme && KitChartsTheme.getContrastingTextColor) || (typeof window !== 'undefined' && window.getContrastingTextColor);
  if (typeof fn === 'function') {
    try { return fn(bg); } catch (e) { /* repli ci-dessous */ }
  }
  const m = /^#?([0-9a-f]{6})$/i.exec(String(bg || '').trim());
  if (!m) return '#0F172A';
  const n = parseInt(m[1], 16);
  const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const L = 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
  return L > 0.4 ? '#0F172A' : '#FFFFFF';
}

/**
 * Normalise un jeu de données en matrice Mekko : colonnes triées par poids décroissant,
 * segments dans l'ordre fixe des séries, coordonnées en pourcentage (0-100).
 *
 * @param {Array} rawItems
 * @returns {Array} Éléments { x0, x1, y0, y1, w, h, v, col, sub, label, role, growth, ... } (x/y en %)
 */
function normalizeMekkoData(rawItems) {
  if (!Array.isArray(rawItems) || !rawItems.length) return [];

  const columnsMap = new Map();
  const subOrder = [];
  for (const item of rawItems) {
    const colName = item.col || (typeof item.x === 'string' ? item.x : `Col-${item.x ?? 0}`);
    const subName = item.sub || (typeof item.y === 'string' ? item.y : `Sub-${item.y ?? 0}`);
    const val = typeof item.v === 'number' ? item.v : (typeof item.value === 'number' ? item.value : (Number(item.y) || 10));
    const widthHint = typeof item.colWeight === 'number' ? item.colWeight : (typeof item.width === 'number' ? item.width / 100 : (typeof item.w === 'number' ? item.w : null));
    if (subOrder.indexOf(subName) < 0) subOrder.push(subName);
    if (!columnsMap.has(colName)) columnsMap.set(colName, { name: colName, widthHint, items: [] });
    columnsMap.get(colName).items.push({ colName, subName, val, rawItem: item });
  }

  const columns = Array.from(columnsMap.values());
  let totalColumnWeight = 0;
  for (const col of columns) {
    col.total = col.items.reduce((s, it) => s + Math.max(0, it.val), 0) || 1;
    col.weight = (col.widthHint !== null && col.widthHint > 0) ? col.widthHint : col.total;
    totalColumnWeight += col.weight;
  }
  columns.sort((a, b) => b.weight - a.weight);

  let cumX = 0;
  const result = [];
  for (const col of columns) {
    const colFraction = totalColumnWeight > 0 ? col.weight / totalColumnWeight : 1 / columns.length;
    // Ordre des séries identique dans toutes les colonnes (ordre de première apparition = ordre de la légende)
    const items = col.items.slice().sort((a, b) => subOrder.indexOf(a.subName) - subOrder.indexOf(b.subName));
    let cumY = 0;
    for (const item of items) {
      const segFraction = Math.max(0, item.val) / col.total;
      result.push({
        x0: cumX * 100,
        x1: (cumX + colFraction) * 100,
        y0: cumY * 100,
        y1: (cumY + segFraction) * 100,
        x: (cumX + colFraction / 2) * 100,
        y: (cumY + segFraction / 2) * 100,
        w: colFraction,
        h: segFraction,
        v: item.val,
        col: item.colName,
        sub: item.subName,
        label: item.rawItem.label || `${item.colName} - ${item.subName}`,
        role: item.rawItem.role || null,
        growth: typeof item.rawItem.growth === 'number' ? item.rawItem.growth : null,
        marketShare: (colFraction * segFraction * 100).toFixed(1),
        subSharePct: (segFraction * 100).toFixed(1),
        colWeightPct: (colFraction * 100).toFixed(1),
        subIndex: subOrder.indexOf(item.subName)
      });
      cumY += segFraction;
    }
    cumX += colFraction;
  }
  return result;
}

/**
 * Plugin canvas : dessine les rectangles Mekko (largeur = poids de colonne, hauteur = part du segment),
 * les libellés de colonnes au-dessus et les libellés de segments à l'intérieur.
 */
const mekkoRectsPlugin = {
  id: 'mekkoRectsPlugin',
  beforeDatasetsDraw(chart) {
    const meta = chart.options.plugins.mekkoMeta;
    if (!meta) return;
    const { ctx, chartArea, scales } = chart;
    const xs = scales.x, ys = scales.y;
    if (!xs || !ys || !chartArea) return;
    const { tokens, items, showLabels } = meta;
    ctx.save();
    const seen = new Set();
    for (const it of items) {
      const px0 = xs.getPixelForValue(it.x0);
      const px1 = xs.getPixelForValue(it.x1);
      const py0 = ys.getPixelForValue(it.y0);
      const py1 = ys.getPixelForValue(it.y1);
      const w = px1 - px0;
      const h = py0 - py1;
      if (!(w > 0) || !(h > 0)) continue;
      ctx.fillStyle = it.color;
      ctx.fillRect(px0, py1, w, h);
      ctx.lineWidth = it.borderWidth;
      ctx.strokeStyle = it.borderColor;
      ctx.strokeRect(px0 + 0.5, py1 + 0.5, w - 1, h - 1);

      if (showLabels && w > 40 && h > 30) {
        const txt = readableTextOn(it.color);
        ctx.fillStyle = txt;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `600 11px ${tokens.fontFamily || 'sans-serif'}`;
        let name = it.sub;
        if (ctx.measureText(name).width > w - 8) name = name.replace(/\s*\(.*\)\s*$/, '');
        while (name.length > 3 && ctx.measureText(name).width > w - 8) name = name.slice(0, -2) + '…';
        ctx.fillText(name, px0 + w / 2, py1 + h / 2 - 7);
        ctx.font = `400 11px ${tokens.fontMono || tokens.fontFamily || 'monospace'}`;
        ctx.fillText(`${Math.round(Number(it.subSharePct))} %`, px0 + w / 2, py1 + h / 2 + 8);
      }

      if (!seen.has(it.col)) {
        seen.add(it.col);
        ctx.fillStyle = tokens.textPrimary || '#0F172A';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.font = `600 11px ${tokens.fontFamily || 'sans-serif'}`;
        const colName = it.col.replace(/\s*\(\d+\s*%\)\s*$/, '');
        const colPct = `${Math.round(Number(it.colWeightPct))} %`;
        const fit = (t, max) => { let r = t; while (r.length > 3 && ctx.measureText(r).width > max) r = r.slice(0, -2).trimEnd() + '…'; return r; };
        const oneLine = `${colName} (${colPct})`;
        if (ctx.measureText(oneLine).width <= w - 4) {
          ctx.fillText(oneLine, px0 + w / 2, chartArea.top - 6);
        } else {
          // Colonne étroite : nom sur une ligne, part sur la ligne du dessous
          ctx.fillText(fit(colName, w - 4), px0 + w / 2, chartArea.top - 20);
          ctx.fillText(colPct, px0 + w / 2, chartArea.top - 6);
        }
      }
    }
    ctx.restore();
  }
};

/**
 * Crée et initialise un graphique Marimekko dans le canvas cible.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément HTMLCanvasElement
 * @param {Object} [customData=null] - Jeu de données optionnel
 * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème cognitif
 * @returns {Object} Instance Chart.js initialisée
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) {
    throw new Error(`Canvas element "${canvasTarget}" not found`);
  }

  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const isDark = Boolean(tokens.isDark);
  const showLabels = !(customData && customData.showDataLabels === false) && !(options && options.showDataLabels === false);

  const rawData = customData || DEFAULT_DATA;
  const rawItems = (rawData.datasets && rawData.datasets[0]?.data) || (Array.isArray(rawData) ? rawData : []);
  const normalizedData = normalizeMekkoData(rawItems);

  const availW = (container && container.clientWidth) || (canvas && canvas.clientWidth) || 0;
  const compact = availW > 0 && availW < 460;
  const distinctSubNames = Array.from(new Set(normalizedData.map(d => d.sub)));
  const surfaceBorder = isDark ? (tokens.surface || '#2E3440') : '#FFFFFF';

  // Couleur = catégorie (stable) ; le rôle ne joue que sur la bordure.
  for (const it of normalizedData) {
    it.color = getColor(tokens, it.subIndex);
    it.borderColor = surfaceBorder;
    it.borderWidth = isTufte ? 1 : 2;
    // Seule l'anomalie est soulignée (bordure rouge, expliquée en infobulle) ; le focal se lit par sa couleur
    if (it.role === 'anomaly') {
      it.borderColor = (tokens.status && tokens.status.danger) || '#C62828';
      it.borderWidth = 3;
    }
  }

  const datasets = distinctSubNames.map((subName, sIdx) => {
    const itemsOfSub = normalizedData.filter(d => d.sub === subName);
    const color = getColor(tokens, itemsOfSub.length ? itemsOfSub[0].subIndex : sIdx);
    return {
      label: subName,
      data: itemsOfSub.map(it => ({ ...it })),
      backgroundColor: color,
      borderColor: color,
      pointStyle: 'rect',
      pointRadius: 0,
      pointHoverRadius: 0,
      pointHitRadius: 40
    };
  });

  const chartData = { datasets };
  const defaultOpts = getChartDefaultOptions(tokens);

  const axisTick = {
    color: tokens.textSecondary,
    font: { family: tokens.fontFamily, size: 11 },
    callback: (v) => `${v} %`,
    stepSize: 25
  };

  const config = {
    type: 'scatter',
    data: chartData,
    options: {
      ...defaultOpts,
      animation: false,
      layout: { padding: { top: 40 } },
      interaction: { mode: 'nearest', intersect: false },
      hover: { mode: 'nearest', intersect: false, animationDuration: 0 },
      plugins: {
        ...defaultOpts.plugins,
        mekkoMeta: { tokens, items: normalizedData, showLabels },
        legend: {
          display: !isTufte && distinctSubNames.length > 1,
          position: 'bottom',
          labels: {
            color: tokens.textPrimary,
            usePointStyle: true,
            pointStyle: 'rect',
            boxWidth: 10,
            boxHeight: 10,
            font: { family: tokens.fontFamily, size: 11 }
          }
        },
        tooltip: {
          ...defaultOpts.plugins.tooltip,
          backgroundColor: tokens.tooltipBg || '#0F172A',
          titleColor: tokens.tooltipText || '#F8FAFC',
          bodyColor: tokens.tooltipText || '#F8FAFC',
          borderColor: tokens.borderStrong || tokens.border || '#334155',
          borderWidth: 1,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          boxPadding: 6,
          titleFont: { family: tokens.fontFamily, size: 12, weight: '600' },
          bodyFont: { family: tokens.fontMono, size: 12, weight: '400' },
          callbacks: {
            title: (items) => (items.length ? (items[0].raw?.label || 'Segment Mekko') : ''),
            label: (item) => {
              const raw = item.raw;
              if (!raw) return '';
              const growthInfo = typeof raw.growth === 'number'
                ? ` Évolution A/A-1 : ${raw.growth > 0 ? '+' : ''}${raw.growth}%`
                : '';
              return [
                ` Segment : ${raw.col} (Poids: ${raw.colWeightPct}%)`,
                ` Catégorie : ${raw.sub} (Part: ${raw.subSharePct}%)`,
                ` Volume Global : ${raw.marketShare}% du marché total`,
                ...(growthInfo ? [growthInfo] : []),
                ...(raw.role === 'anomaly' ? [' Bordure rouge : segment atypique'] : [])
              ];
            }
          }
        }
      },
      scales: {
        x: {
          type: 'linear', min: 0, max: 100,
          title: { display: true, text: compact ? 'Part cumulée du marché (largeur)' : 'Part cumulée des segments de marché (largeur)', color: tokens.textSecondary, font: { family: tokens.fontFamily, size: 11 } },
          grid: { display: false },
          border: { display: false },
          ticks: axisTick
        },
        y: {
          type: 'linear', min: 0, max: 100, beginAtZero: true,
          title: { display: true, text: compact ? 'Part dans le segment (hauteur)' : 'Part de chaque motorisation dans le segment (hauteur)', color: tokens.textSecondary, font: { family: tokens.fontFamily, size: 11 } },
          grid: { display: false },
          border: { display: false },
          ticks: axisTick
        }
      }
    },
    plugins: [mekkoRectsPlugin]
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }

  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;
  moduleExports.getEmphasisStyle = moduleExports.getEmphasisStyle;
  moduleExports.getValenceColor = moduleExports.getValenceColor;
  moduleExports.getThresholdStatus = moduleExports.getThresholdStatus;

  return moduleExports;
});
