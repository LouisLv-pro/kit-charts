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
 * Règle cognitive: Tri décroissant des colonnes et des segments, bordures blanches nettes, repères de pourcentages.
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
 * Normalise un jeu de données quelconque en matrice Mekko avec calculs des coordonnées et dimensions.
 *
 * @param {Array} rawItems
 * @returns {Array} Éléments normalisés avec { x, y, w, h, v, col, sub, label, subIndex, role, growth }
 */
function normalizeMekkoData(rawItems) {
  if (!Array.isArray(rawItems) || !rawItems.length) return [];

  // Vérification si données déjà au format Mekko (avec colWeight ou w/h)
  const columnsMap = new Map();

  for (const item of rawItems) {
    const colName = item.col || (typeof item.x === 'string' ? item.x : `Col-${item.x ?? 0}`);
    const subName = item.sub || (typeof item.y === 'string' ? item.y : `Sub-${item.y ?? 0}`);
    const val = typeof item.v === 'number' ? item.v : (typeof item.value === 'number' ? item.value : (Number(item.y) || 10));
    const widthHint = typeof item.colWeight === 'number' ? item.colWeight : (typeof item.width === 'number' ? item.width / 100 : (typeof item.w === 'number' ? item.w : null));

    if (!columnsMap.has(colName)) {
      columnsMap.set(colName, { name: colName, widthHint, items: [] });
    }
    columnsMap.get(colName).items.push({
      colName,
      subName,
      val,
      rawItem: item
    });
  }

  // Calcul du poids de chaque colonne
  const columns = Array.from(columnsMap.values());
  let totalColumnWeight = 0;
  for (const col of columns) {
    if (col.widthHint !== null && col.widthHint > 0) {
      col.weight = col.widthHint;
    } else {
      col.weight = col.items.reduce((sum, it) => sum + Math.max(0, it.val), 0) || 1;
    }
    totalColumnWeight += col.weight;
  }

  // Normalisation des largeurs de colonnes sur [0, 1]
  let currentCumX = 0;
  const result = [];
  const distinctSubs = Array.from(new Set(rawItems.map(it => it.sub || (typeof it.y === 'string' ? it.y : `Sub-${it.y ?? 0}`))));

  for (const col of columns) {
    const colFraction = totalColumnWeight > 0 ? (col.weight / totalColumnWeight) : (1 / columns.length);
    const colCenterX = currentCumX + colFraction / 2;

    const colTotalVal = col.items.reduce((sum, it) => sum + Math.max(0, it.val), 0) || 1;
    let currentCumY = 0;

    for (const item of col.items) {
      const segFraction = Math.max(0, item.val) / colTotalVal;
      const segCenterY = currentCumY + segFraction / 2;
      const subIdx = distinctSubs.indexOf(item.subName);

      result.push({
        x: colCenterX,
        y: segCenterY,
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
        subIndex: subIdx >= 0 ? subIdx : 0
      });

      currentCumY += segFraction;
    }

    currentCumX += colFraction;
  }

  return result;
}

/**
 * Crée et initialise un graphique Marimekko dans le canvas cible.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément HTMLCanvasElement
 * @param {Object} [customData=null] - Jeu de données optionnel
 * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème cognitif
 * @returns {Object} Instance Chart.js initialisée
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) {
    throw new Error(`Canvas element "${canvasTarget}" not found`);
  }

  // Destruction propre de l'instance précédente
  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const isDark = Boolean(tokens.isDark);
  const reduceMotion = isReducedMotionPreferred();

  const rawData = customData || DEFAULT_DATA;
  const rawItems = (rawData.datasets && rawData.datasets[0]?.data) || (Array.isArray(rawData) ? rawData : []);
  const normalizedData = normalizeMekkoData(rawItems);

  const distinctSubNames = Array.from(new Set(normalizedData.map(d => d.sub)));

  const datasets = distinctSubNames.map((subName, sIdx) => {
    const itemsOfSub = normalizedData.filter(d => d.sub === subName);
    let baseColor = getColor(tokens, sIdx);

    const dataPoints = itemsOfSub.map(it => {
      let color = baseColor;
      let borderColor = isDark ? tokens.surface : '#FFFFFF';
      let borderWidth = isTufte ? 1 : 2;

      if (it.role) {
        const emp = getEmphasisStyle(tokens, it.role);
        color = emp.backgroundColor || color;
        borderColor = emp.borderColor || borderColor;
        borderWidth = emp.borderWidth !== undefined ? emp.borderWidth : borderWidth;
      } else if (it.growth !== null) {
        if (it.growth > 25) {
          color = getValenceColor(tokens, 'up', 'gain');
        } else if (it.growth < -20) {
          color = getValenceColor(tokens, 'down', 'gain');
        }
      }

      return {
        x: it.x,
        y: it.y,
        w: it.w,
        h: it.h,
        v: it.v,
        col: it.col,
        sub: it.sub,
        label: it.label,
        role: it.role,
        growth: it.growth,
        marketShare: it.marketShare,
        subSharePct: it.subSharePct,
        colWeightPct: it.colWeightPct,
        color,
        borderColor,
        borderWidth
      };
    });

    return {
      label: subName,
      data: dataPoints,
      backgroundColor: dataPoints.map(d => d.color),
      borderColor: dataPoints.map(d => d.borderColor),
      borderWidth: dataPoints.map(d => d.borderWidth),
      pointRadius: (ctx) => {
        const item = ctx.raw;
        return item ? 8 : 4;
      },
      pointHoverRadius: 10,
      pointHitRadius: 12
    };
  });

  const chartData = {
    datasets
  };

  const defaultOpts = getChartDefaultOptions(tokens);

  const config = {
    type: 'scatter',
    data: chartData,
    options: {
      scales: {},
      ...defaultOpts,
      animation: getAccessibleAnimationOptions(tokens, {
        duration: (isTufte || reduceMotion) ? 0 : 400,
        easing: 'easeOutQuart'
      }),
      interaction: {
        mode: 'nearest',
        intersect: true
      },
      hover: {
        mode: 'nearest',
        intersect: true,
        animationDuration: (isTufte || reduceMotion) ? 0 : 100
      },
      plugins: {
        ...defaultOpts.plugins,
        legend: {
          display: !isTufte && distinctSubNames.length > 1,
          position: 'top',
          align: 'end',
          labels: {
            color: tokens.textPrimary,
            usePointStyle: true,
            boxWidth: 8,
            font: {
              family: tokens.fontFamily,
              size: 11
            }
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
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono,
            size: 12,
            weight: '400'
          },
          callbacks: {
            title: (items) => {
              if (!items.length) return '';
              return items[0].raw?.label || 'Segment Mekko';
            },
            label: (item) => {
              const raw = item.raw;
              if (!raw) return '';
              const growthInfo = typeof raw.growth === 'number'
                ? ` Évolution A/A-1 : ${raw.growth > 0 ? '+' : ''}${raw.growth}%`
                : '';
              const roleInfo = raw.role ? ` [${raw.role.toUpperCase()}]` : '';
              return [
                ` Segment : ${raw.col} (Poids: ${raw.colWeightPct}%)`,
                ` Catégorie : ${raw.sub} (Part: ${raw.subSharePct}%)${roleInfo}`,
                ` Volume Global : ${raw.marketShare}% du marché total`,
                ...(growthInfo ? [growthInfo] : [])
              ];
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }

  // Simulation mock pour environnement Node.js headless
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
