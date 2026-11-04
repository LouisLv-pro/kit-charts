/**
 * @file template/01-comparaison/radar-chart/template.js
 * @description Standardized Universal radar-chart Template for kit-charts.
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
    global.KitCharts['radar-chart'] = exp;
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
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function() { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function() { return {}; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function() { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function(t, o) { return o || {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return o || {}; };
  const getPartitionInteractionOptions = (KitChartsTheme && KitChartsTheme.getPartitionInteractionOptions) || (typeof window !== 'undefined' && window.getPartitionInteractionOptions) || function(t, o) { return o || {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const kitChartsDataLabelsPlugin = (KitChartsTheme && KitChartsTheme.kitChartsDataLabelsPlugin) || (typeof window !== 'undefined' && window.kitChartsDataLabelsPlugin) || null;
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 01-comparaison/radar-chart/template.js
 * @description Template Chart.js v4+ pour Graphique Radar / Profil Multivarié (Radar Chart / Spider Chart).
 * Psychophysique: Évaluation globale d'une empreinte multidimensionnelle (5 à 8 critères, max 2 entités).
 * Règle d'or: Échelle radiale partagée, opacité de remplissage faible (20-30%) pour éviter les masquages.
 */

/**
 * Données par défaut représentatives (Comparaison de profils techniques entre plateformes logicielles)
 */
const DEFAULT_DATA = {
  labels: ['Vitesse', 'Fiabilité', 'Sécurité', 'Scalabilité', 'Ergonomie', 'Documentation'],
  datasets: [
    { label: 'Plateforme A', data: [85, 92, 90, 78, 88, 95] },
    { label: 'Plateforme B', data: [70, 80, 85, 92, 75, 80] }
  ]
};

/**
 * Convertit une couleur Hex en chaîne RGBA valide.
 * @param {string} hex
 * @param {number} alpha
 * @returns {string}
 */
function hexToRgba(hex, alpha = 0.2) {
  if (!hex || typeof hex !== 'string') return `rgba(43, 140, 190, ${alpha})`;
  if (hex.startsWith('rgba') || hex.startsWith('rgb')) return hex;
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const num = parseInt(clean.substring(0, 6), 16);
  if (isNaN(num)) return `rgba(43, 140, 190, ${alpha})`;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Crée et initialise un graphique radar dans le canvas cible.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément HTMLCanvasElement
 * @param {Object} [customData=null] - Jeu de données optionnel
 * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème cognitif
 * @param {Object} [options={}] - Options additionnelles (ex: showDataLabels)
 * @returns {Object} Instance Chart.js initialisée
 */
// Carte étroite ou basse (< 420 px de large ou < 300 px de haut) : mise en page compacte.
function isNarrow(chart) {
  if (!chart) return false;
  const w = chart.width || (chart.canvas && chart.canvas.clientWidth) || 0;
  const h = chart.height || (chart.canvas && chart.canvas.clientHeight) || 0;
  return (w > 0 && w < 420) || (h > 0 && h < 300);
}

/**
 * Badges de valeur du radar, placés radialement par rapport au centre (jamais sur le point).
 * Large : profil principal vers l'extérieur, second profil vers l'intérieur, badges encadrés.
 * Étroit : profil principal seul, valeur vers l'intérieur avec halo, sans cadre.
 */
const radarBadgesPlugin = {
  id: 'kcRadarBadges',
  afterDatasetsDraw(chart) {
    if (chart.options?.showDataLabels === false) return;
    const rScale = chart.scales && chart.scales.r;
    if (!rScale) return;
    const tokens = chart.options?._kitChartsTokens || {};
    const ctx = chart.ctx;
    const narrow = isNarrow(chart);
    const fontSize = narrow ? 9 : 10;
    const surface = tokens.surface || (tokens.isDark ? '#242933' : '#FFFFFF');
    const fmt = (v) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(v);
    ctx.save();
    ctx.font = `700 ${fontSize}px ${tokens.fontMono || 'monospace'}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const count = Math.min(chart.data.datasets.length, narrow ? 1 : 2);
    for (let di = 0; di < count; di++) {
      const meta = chart.getDatasetMeta(di);
      const ds = chart.data.datasets[di];
      if (!meta || meta.hidden) continue;
      (meta.data || []).forEach((pt, i) => {
        const v = ds.data[i];
        if (typeof v !== 'number' || !pt) return;
        const text = fmt(v);
        const w = ctx.measureText(text).width + (narrow ? 2 : 8);
        const h = fontSize + (narrow ? 2 : 4);
        let ux = pt.x - rScale.xCenter, uy = pt.y - rScale.yCenter;
        const len = Math.hypot(ux, uy) || 1;
        ux /= len; uy /= len;
        // Large : la valeur la plus haute se pose vers l'extérieur, la plus basse vers l'intérieur
        // (le badge ne recouvre jamais le point de l'autre profil). Étroit : vers l'intérieur.
        const other = chart.data.datasets[di === 0 ? 1 : 0];
        const ov = other && other.data ? other.data[i] : undefined;
        const higher = typeof ov !== 'number' ? di === 0 : (v > ov || (v === ov && di === 0));
        const dir = narrow ? -1 : (higher ? 1 : -1);
        const d = 5 + Math.abs(ux) * w / 2 + Math.abs(uy) * h / 2;
        const bx = pt.x + dir * ux * d, by = pt.y + dir * uy * d;
        if (narrow) {
          ctx.lineWidth = 3; ctx.lineJoin = 'round';
          ctx.strokeStyle = surface;
          ctx.strokeText(text, bx, by);
        } else {
          ctx.fillStyle = surface;
          ctx.strokeStyle = ds.borderColor || tokens.border;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.rect(bx - w / 2, by - h / 2, w, h);
          ctx.fill();
          ctx.stroke();
        }
        ctx.fillStyle = tokens.textPrimary || '#0F172A';
        ctx.fillText(text, bx, by);
      });
    }
    ctx.restore();
  }
};

function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
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
  const showDataLabels = (customData && customData.showDataLabels !== undefined) ? customData.showDataLabels : (options.showDataLabels !== undefined ? options.showDataLabels : true);

  // Préparation des données avec support d'accentuation et de valence
  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels ? [...rawData.labels] : [];
  const datasets = (rawData.datasets || []).map((ds, idx) => {
    const primaryColor = getColor(tokens, idx);

    let borderColor = ds.borderColor;
    let borderWidth = ds.borderWidth;
    let borderDash = ds.borderDash || [];
    let pointRadius = ds.pointRadius !== undefined ? ds.pointRadius : (isTufte ? 3 : 4);
    let pointStyle = ds.pointStyle || 'circle';
    let alpha = 0.2;

    if (ds.emphasisRole || ds.role) {
      const style = getEmphasisStyle(tokens, ds.emphasisRole || ds.role);
      borderColor = borderColor || style.borderColor || primaryColor;
      borderWidth = borderWidth !== undefined ? borderWidth : style.borderWidth;
      borderDash = style.borderDash || [];
      pointRadius = style.pointRadius || pointRadius;
      pointStyle = style.pointStyle || pointStyle;
      alpha = (ds.emphasisRole === 'context' || ds.role === 'context') ? 0.08 : 0.25;
    } else if (ds.valence !== undefined || ds.metricType) {
      const valColor = getValenceColor(tokens, ds.valence !== undefined ? ds.valence : 1, ds.metricType || 'gain');
      borderColor = borderColor || valColor;
    } else {
      borderColor = borderColor || primaryColor;
      borderWidth = borderWidth !== undefined ? borderWidth : (isTufte ? 1.5 : 2);
    }

    const fillColor = ds.backgroundColor || hexToRgba(borderColor, alpha);

    return {
      label: ds.label || `Profil ${idx + 1}`,
      data: Array.isArray(ds.data) ? [...ds.data] : [],
      backgroundColor: fillColor,
      borderColor: borderColor,
      borderWidth: borderWidth !== undefined ? borderWidth : (isTufte ? 1.5 : 2),
      // Double codage pour ne pas dépendre de la seule teinte : profil secondaire en pointillés
      borderDash: (Array.isArray(borderDash) && borderDash.length) ? borderDash : (idx > 0 ? [6, 4] : []),
      pointBackgroundColor: borderColor,
      pointBorderColor: tokens.bg,
      pointBorderWidth: 1.5,
      pointRadius: pointRadius,
      pointHoverRadius: pointRadius + 3,
      pointHitRadius: 10,
      pointStyle: (ds.pointStyle || idx === 0) ? pointStyle : 'rectRot',
      fill: ds.fill !== undefined ? ds.fill : true
    };
  });

  const chartData = { labels, datasets };
  // Axes normés : échelle 0-100 fixe quand toutes les valeurs y tiennent
  const allWithin100 = datasets.length > 0 && datasets.every(d => d.data.every(v => typeof v === 'number' && v >= 0 && v <= 100));

  // Options Chart.js v4+ pour échelle radiale 'r' avec interaction Fitts indexée
  const defaultOpts = getChartDefaultOptions(tokens);
  const config = {
    type: 'radar',
    data: chartData,
    plugins: [radarBadgesPlugin],
    options: {
      ...defaultOpts,
      _kitChartsTokens: tokens,
      showDataLabels: showDataLabels,
      animation: getAccessibleAnimationOptions(tokens, { duration: 450, easing: 'easeOutQuart' }),
      interaction: {
        mode: 'index',
        intersect: false
      },
      hover: {
        mode: 'index',
        intersect: false,
        animationDuration: (isTufte || isReducedMotionPreferred()) ? 0 : 100
      },
      plugins: {
        ...defaultOpts.plugins,
        // Badges dessinés par le plugin local kcRadarBadges (placement radial, adapté à la taille)
        datalabels: { display: () => false },
        legend: {
          ...defaultOpts.plugins.legend,
          display: !isTufte,
          position: (context) => (isNarrow(context && context.chart) ? 'right' : 'top'),
          align: (context) => (isNarrow(context && context.chart) ? 'center' : 'end'),
          labels: {
            ...(defaultOpts.plugins.legend && defaultOpts.plugins.legend.labels),
            boxWidth: 10,
            boxHeight: 10,
            font: { family: tokens.fontFamily, size: 10 }
          }
        },
        tooltip: {
          ...defaultOpts.plugins.tooltip,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono || 'monospace',
            size: 12,
            weight: '400'
          },
          animation: (isTufte || isReducedMotionPreferred()) ? false : { duration: 150, easing: 'easeOutQuad' },
          callbacks: {
            label: (context) => {
              const val = context.parsed.r !== null && context.parsed.r !== undefined
                ? context.parsed.r
                : context.raw;
              const formatted = typeof val === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(val)
                : val;
              return ` ${context.dataset.label || ''}: ${formatted}`;
            }
          }
        }
      },
      scales: {
        x: { display: false },
        y: { display: false },
        r: {
          angleLines: {
            color: tokens.gridColor,
            lineWidth: 1
          },
          grid: {
            color: tokens.gridColor,
            lineWidth: 1
          },
          pointLabels: {
            color: tokens.textPrimary,
            font: (context) => ({
              family: tokens.fontFamily,
              size: isNarrow(context && context.chart) ? 10 : 11,
              weight: '500'
            }),
            padding: (context) => (isNarrow(context && context.chart) ? 6 : 20)
          },
          ticks: {
            display: false, // les valeurs sont lues sur les étiquettes ; anneaux tous les 25 points
            stepSize: allWithin100 ? 25 : undefined,
            showLabelBackdrop: false,
            backdropColor: 'transparent',
            color: tokens.textMuted,
            font: { family: tokens.fontMono || tokens.fontFamily, size: 9 }
          },
          min: 0,
          max: allWithin100 ? 100 : undefined,
          suggestedMin: 0
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
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    isReducedMotionPreferred: typeof isReducedMotionPreferred === 'function' ? isReducedMotionPreferred : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null,
    getSpatialInteractionOptions: typeof getSpatialInteractionOptions === 'function' ? getSpatialInteractionOptions : null,
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getPartitionInteractionOptions: typeof getPartitionInteractionOptions === 'function' ? getPartitionInteractionOptions : null,
    computeAntiOcclusionTooltipPosition: typeof computeAntiOcclusionTooltipPosition === 'function' ? computeAntiOcclusionTooltipPosition : null,
    getDataLabelOptions: typeof getDataLabelOptions === 'function' ? getDataLabelOptions : null,
    formatLabelValue: typeof formatLabelValue === 'function' ? formatLabelValue : null,
    kitChartsDataLabelsPlugin: typeof kitChartsDataLabelsPlugin !== 'undefined' ? kitChartsDataLabelsPlugin : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;
});
