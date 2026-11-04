/**
 * @file template/08-geospatial-cartes/cartogram-tilegram/template.js
 * @description Standardized Universal cartogram-tilegram Template for kit-charts.
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
    global.KitCharts['cartogram-tilegram'] = exp;
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
 * @file 08-geospatial-cartes/cartogram-tilegram/template.js
 * @description Template Chart.js v4+ pour Cartogramme / Grille de Tuiles Égalitaires (Cartogram / Tilegram / Tile Grid Map).
 * Psychophysique: Encodage schématique spatial avec poids visuel identique (Cleveland-McGill: position relative + luminance).
 * Règle cognitive: Égalité visuelle stricte de chaque entité politique/administrative (élimination du biais de surface), sigles centrés, préservation des voisinages cardinaux.
 */

/**
 * Données par défaut représentatives (Indice d'innovation & transition numérique des 13 régions françaises)
 */
const DEFAULT_DATA = {
  datasets: [{
    label: 'Indice d’Innovation Régionale (sur 100)',
    data: [
      // Rangée 1
      { x: 2, y: 1, label: 'HDF', name: 'Hauts-de-France', v: 72, role: 'context', growth: 4.2 },

      // Rangée 2
      { x: 1, y: 2, label: 'NOR', name: 'Normandie', v: 68, role: 'context', growth: 2.5 },
      { x: 2, y: 2, label: 'IDF', name: 'Île-de-France', v: 98, role: 'focal', growth: 16.8 },
      { x: 3, y: 2, label: 'GES', name: 'Grand Est', v: 74, role: 'context', growth: 5.1 },

      // Rangée 3
      { x: 0, y: 3, label: 'BRE', name: 'Bretagne', v: 82, role: 'context', growth: 8.9 },
      { x: 1, y: 3, label: 'PDL', name: 'Pays de la Loire', v: 78, role: 'context', growth: 6.4 },
      { x: 2, y: 3, label: 'CVL', name: 'Centre-Val de Loire', v: 64, role: 'context', growth: 1.8 },
      { x: 3, y: 3, label: 'BFC', name: 'Bourgogne-Franche-Comté', v: 66, role: 'context', growth: 2.0 },

      // Rangée 4
      { x: 1, y: 4, label: 'NAQ', name: 'Nouvelle-Aquitaine', v: 76, role: 'context', growth: 7.2 },
      { x: 2, y: 4, label: 'ARA', name: 'Auvergne-Rhône-Alpes', v: 88, role: 'focal', growth: 12.4 },

      // Rangée 5
      { x: 1, y: 5, label: 'OCC', name: 'Occitanie', v: 80, role: 'context', growth: 9.1 },
      { x: 2, y: 5, label: 'PAC', name: "Provence-Alpes-Côte d'Azur", v: 84, role: 'context', growth: 10.5 },

      // Rangée 6
      { x: 3, y: 6, label: 'COR', name: 'Corse', v: 58, role: 'anomaly', growth: -4.3 }
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
 * Plugin Canvas Chart.js pour afficher les sigles régionaux centrés en gras dans chaque tuile.
 */
const tileLabelsPlugin = {
  id: 'tileLabelsPlugin',
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    const meta = chart.getDatasetMeta(0);
    if (!meta || !meta.data) return;

    const tokens = chart.options?.plugins?.tileMeta?.tokens;
    const fontMono = tokens?.fontMono || 'monospace';

    ctx.save();
    ctx.font = `700 11px ${fontMono}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < meta.data.length; i++) {
      const element = meta.data[i];
      const raw = chart.data.datasets[0].data[i];
      if (!element || !raw) continue;

      const code = raw.label || raw.code || (raw.name ? raw.name.substring(0, 3).toUpperCase() : '');
      if (!code) continue;

      const { x, y } = element.getCenterPoint ? element.getCenterPoint() : { x: element.x, y: element.y };
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue;

      // Texte noir ou blanc selon la luminance réelle de la tuile (WCAG >= 4.5:1)
      const bg = raw.color || '#FFFFFF';
      ctx.fillStyle = readableTextOn(bg);
      const tileH = Number.isFinite(element.height) ? element.height : 40;
      const tileW = Number.isFinite(element.width) ? element.width : 50;
      const valTxt = typeof raw.v === 'number' ? String(Math.round(raw.v * 10) / 10) : '';
      ctx.font = `700 11px ${fontMono}`;
      if (valTxt && tileH < 34) {
        // Tuile basse (carte étroite) : sigle et valeur sur une seule ligne, centrés
        const wCode = ctx.measureText(code).width;
        ctx.font = `400 11px ${fontMono}`;
        const wVal = ctx.measureText(valTxt).width;
        const gap = 5;
        if (wCode + gap + wVal <= tileW - 4) {
          const x0 = x - (wCode + gap + wVal) / 2;
          ctx.textAlign = 'left';
          ctx.font = `700 11px ${fontMono}`;
          ctx.fillText(code, x0, y);
          ctx.font = `400 11px ${fontMono}`;
          ctx.fillText(valTxt, x0 + wCode + gap, y);
          ctx.textAlign = 'center';
          continue;
        }
      }
      ctx.fillText(code, x, y - (valTxt ? 7 : 0));
      if (valTxt) {
        ctx.font = `400 11px ${fontMono}`;
        ctx.fillText(valTxt, x, y + 8);
      }
    }
    ctx.restore();
  }
};

/**
 * Légende : dégradé séquentiel de l'indice (min à max) sous la grille.
 */
const makeTileLegendPlugin = (meta) => ({
  id: 'tileLegendPlugin',
  afterDraw(chart) {
    const area = chart.chartArea;
    if (!meta || !area || !meta.getColor) return;
    const { tokens } = meta;
    const ctx = chart.ctx;
    const w = 180, h = 10;
    const x0 = area.left + (area.right - area.left - w) / 2;
    const y0 = chart.height - 22;
    ctx.save();
    for (let i = 0; i < w; i++) {
      ctx.fillStyle = meta.getColor(i / (w - 1));
      ctx.fillRect(x0 + i, y0, 1.5, h);
    }
    ctx.fillStyle = tokens.textSecondary || '#475569';
    ctx.font = `11px ${tokens.fontFamily || 'sans-serif'}`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'right';
    ctx.fillText(String(Math.round(meta.min)), x0 - 6, y0 + h / 2);
    ctx.textAlign = 'left';
    ctx.fillText(`${Math.round(meta.max)}  (indice /100)`, x0 + w + 6, y0 + h / 2);
    ctx.restore();
  }
});

/**
 * Crée et initialise un Cartogramme / Tilegramme dans le canvas cible.
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
  const rawItems = (rawData.datasets && rawData.datasets[0]?.data) ? rawData.datasets[0].data : [];

  const values = rawItems.map(d => typeof d === 'object' && d !== null ? (d.v ?? d.value ?? 50) : Number(d));
  const minVal = values.length > 0 ? Math.min(...values) : 0;
  const maxVal = values.length > 0 ? Math.max(...values) : 100;
  const valRange = Math.max(1, maxVal - minVal);

  const processedData = rawItems.map((item, idx) => {
    const x = typeof item.x === 'number' ? item.x : (idx % 4);
    const y = typeof item.y === 'number' ? item.y : Math.floor(idx / 4);
    const v = typeof item.v === 'number' ? item.v : (typeof item.value === 'number' ? item.value : 50);
    const code = item.label || item.code || `T${idx + 1}`;
    const name = item.name || `Territoire ${code}`;

    let borderColor = isDark ? tokens.surface : '#FFFFFF';
    let borderWidth = isTufte ? 1.5 : 2;

    if (item.role) {
      const emp = getEmphasisStyle(tokens, item.role);
      borderColor = emp.borderColor || borderColor;
      borderWidth = emp.borderWidth !== undefined ? emp.borderWidth : (item.role === 'focal' ? 3 : borderWidth);
    }

    const ratio = (v - minVal) / valRange;
    const color = getSequentialColor(tokens, ratio);

    return {
      x,
      y,
      v,
      color,
      label: code,
      name,
      role: item.role || null,
      growth: typeof item.growth === 'number' ? item.growth : null,
      borderColor,
      borderWidth
    };
  });

  const datasetLabel = (rawData.datasets && rawData.datasets[0]?.label) || 'Tuiles Régionales';

  const chartData = {
    datasets: [{
      label: datasetLabel,
      data: processedData,
      borderColor: processedData.map(d => d.borderColor),
      borderWidth: processedData.map(d => d.borderWidth),
      // La luminance encode toujours la valeur ; le rôle ne modifie que la bordure.
      backgroundColor: (ctx) => (ctx.raw && ctx.raw.color) || getSequentialColor(tokens, 0.5),
      width: ({ chart }) => {
        const area = chart.chartArea;
        const w = area ? area.width / 5.2 : 55;
        return Math.max(25, Math.min(68, w));
      },
      height: ({ chart }) => {
        const area = chart.chartArea;
        const h = area ? area.height / 7.5 : 45;
        return Math.max(25, Math.min(56, h));
      }
    }]
  };

  const defaultOpts = getChartDefaultOptions(tokens);

  const minX = processedData.length > 0 ? Math.min(...processedData.map(d => d.x)) - 0.7 : -0.7;
  const maxX = processedData.length > 0 ? Math.max(...processedData.map(d => d.x)) + 0.7 : 4.7;
  const minY = processedData.length > 0 ? Math.min(...processedData.map(d => d.y)) - 0.7 : 0.3;
  const maxY = processedData.length > 0 ? Math.max(...processedData.map(d => d.y)) + 0.7 : 7.7;

  const config = {
    type: 'matrix',
    data: chartData,
    options: {
      ...defaultOpts,
      layout: { padding: { bottom: 28 } },
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
          display: false
        },
        tileMeta: {
          tokens,
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
              const raw = items[0].raw;
              const roleInfo = raw?.role ? ` [${raw.role.toUpperCase()}]` : '';
              return `${raw?.name || 'Région'} (${raw?.label || ''})${roleInfo}`;
            },
            label: (item) => {
              const raw = item.raw;
              const formatted = typeof raw?.v === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(raw.v)
                : raw?.v;
              const growthInfo = typeof raw?.growth === 'number'
                ? ` Évolution A/A-1 : ${raw.growth > 0 ? '+' : ''}${raw.growth}%`
                : '';
              return [
                ` Indice mesuré : ${formatted} / 100`,
                ` Position grille : [Col ${raw?.x}, Ligne ${raw?.y}]`,
                ...(growthInfo ? [growthInfo] : [])
              ];
            }
          }
        }
      },
      scales: {
        x: {
          min: minX,
          max: maxX,
          grid: { display: false, drawBorder: false },
          border: { display: false },
          ticks: { display: false }
        },
        y: {
          min: minY,
          max: maxY,
          reverse: true,
          grid: { display: false, drawBorder: false },
          border: { display: false },
          ticks: { display: false }
        }
      }
    },
    plugins: [tileLabelsPlugin, makeTileLegendPlugin({ tokens, min: minVal, max: maxVal, getColor: (r) => getSequentialColor(tokens, r) })]
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
