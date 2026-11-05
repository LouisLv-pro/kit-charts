/**
 * @file template/02-composition-part-to-whole/sunburst/template.js
 * @description Standardized Universal sunburst Template for kit-charts.
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
    global.KitCharts['sunburst'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const createCompactResizePlugin = (KitChartsTheme && KitChartsTheme.createCompactResizePlugin) || (typeof window !== 'undefined' && window.createCompactResizePlugin) || function() { return { id: 'kcCompactResize' }; };
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
 * @file 02-composition-part-to-whole/sunburst/template.js
 * @description Template Chart.js v4+ pour Diagramme Rayonnant (Sunburst Chart / Multi-level Doughnut).
 * Psychophysique: Encodage hiérarchique radial en anneaux concentriques (Niveau 1 au centre, Niveau 2 en périphérie).
 * Règle d'or: Alignement angulaire des sous-branches, palettes graduelles cohérentes par branche.
 */

/**
 * Données par défaut représentatives (Répartition géographique hiérarchique : Régions > Sous-régions)
 */
const DEFAULT_DATA = {
  // Niveau 0 (racine, centre) : 4 régions
  labels: ['Europe', 'Amériques', 'Asie-Pacifique', 'Afrique & ME'],
  datasets: [
    {
      label: 'Régions',
      data: [40, 30, 20, 10],
      weight: 1
    },
    // Niveau 1 (anneau extérieur) : sous-régions, regroupées par parent dans l'ordre
    {
      label: 'Sous-Régions',
      labels: ['Europe de l\'Ouest', 'Europe du Nord', 'Amérique du Nord', 'Amérique latine', 'Asie de l\'Est', 'Asie du Sud-Est', 'Moyen-Orient', 'Afrique'],
      data: [20, 20, 15, 15, 12, 8, 6, 4],
      weight: 1.4
    }
  ]
};

/**
 * Crée et initialise un diagramme rayonnant (Sunburst Chart) dans le canvas cible.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément HTMLCanvasElement
 * @param {Object} [customData=null] - Jeu de données optionnel
 * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème cognitif
 * @param {Object} [options={}] - Options additionnelles (ex: showDataLabels)
 * @returns {Object} Instance Chart.js initialisée
 */
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

  // Préparation des données : datasets[0] = racine (centre), datasets[i] = niveau i vers l'extérieur.
  // Chart.js dessine le dataset 0 le plus à l'extérieur : l'ordre est donc inversé au tracé.
  const rawData = customData || DEFAULT_DATA;
  const rootLabels = rawData.labels ? [...rawData.labels] : [];
  const levels = (rawData.datasets || []).map((ds, levelIdx) => {
    const data = Array.isArray(ds.data) ? ds.data.map(v => (typeof v === 'object' && v !== null ? (v.value ?? v.v ?? 0) : Number(v) || 0)) : [];
    const lbls = Array.isArray(ds.labels) ? [...ds.labels] : (levelIdx === 0 ? rootLabels : data.map((_, i) => `${ds.label || 'Niveau ' + (levelIdx + 1)} ${i + 1}`));
    return { ds, data, labels: lbls, levelIdx };
  });

  const hexToRgb = (hex) => {
    const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim());
    if (!m) return null;
    const n = parseInt(m[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const mixHex = (a, b, t) => {
    const ca = hexToRgb(a), cb = hexToRgb(b);
    if (!ca || !cb) return a;
    const c = ca.map((v, i) => Math.round(v + (cb[i] - v) * t));
    return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
  };
  const contrastText = (bg) => {
    const f = KitChartsTheme && KitChartsTheme.getContrastingTextColor;
    if (f) return f(bg, '#FFFFFF', '#0F172A');
    const c = hexToRgb(bg);
    if (!c) return '#0F172A';
    const l = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    return l < 140 ? '#FFFFFF' : '#0F172A';
  };

  // Parent de chaque arc : celui dont l'intervalle angulaire contient le milieu de l'arc.
  const startsOf = (arr) => { let acc = 0; return arr.map(v => { const s = acc; acc += v; return [s, acc]; }); };
  const levelColors = [];
  levels.forEach((lv, levelIdx) => {
    const { ds, data } = lv;
    let colors;
    if (Array.isArray(ds.backgroundColor)) {
      colors = [...ds.backgroundColor];
    } else if (levelIdx === 0) {
      if (Array.isArray(ds.emphasisRoles) || Array.isArray(ds.roles)) {
        const roles = ds.emphasisRoles || ds.roles;
        colors = roles.map((r, i) => getEmphasisStyle(tokens, r).backgroundColor || getColor(tokens, i));
      } else if (Array.isArray(ds.valences)) {
        const metricType = ds.metricType || 'gain';
        colors = ds.valences.map(v => getValenceColor(tokens, v, metricType));
      } else if (ds.focusIndex !== undefined) {
        colors = data.map((_, i) => i === ds.focusIndex ? (tokens.emphasis?.focal || getColor(tokens, 0)) : (tokens.emphasis?.context || tokens.textMuted || '#CBD5E1'));
      } else {
        colors = data.map((_, i) => getColor(tokens, i));
      }
    } else {
      // Teinte héritée du parent, luminosité variable selon le rang parmi les frères.
      const parentIv = startsOf(levels[levelIdx - 1].data);
      const iv = startsOf(data);
      const siblingCount = {};
      const parentOf = iv.map(([s, e]) => {
        const mid = (s + e) / 2;
        const p = parentIv.findIndex(([ps, pe]) => mid >= ps && mid < pe);
        return p < 0 ? parentIv.length - 1 : p;
      });
      parentOf.forEach(p => { siblingCount[p] = (siblingCount[p] || 0) + 1; });
      const seen = {};
      colors = parentOf.map((p) => {
        const base = levelColors[levelIdx - 1][p] || getColor(tokens, p);
        const k = seen[p] || 0; seen[p] = k + 1;
        const n = siblingCount[p];
        const t = n > 1 ? 0.18 + 0.32 * (k / (n - 1)) : 0.25;
        return mixHex(base, tokens.isDark ? '#000000' : '#FFFFFF', t * (tokens.isDark ? 0.8 : 1));
      });
    }
    levelColors.push(colors);
  });

  const total = levels[0] ? levels[0].data.reduce((a, b) => a + b, 0) : 0;
  // Recalculé au redimensionnement du conteneur (plugin kcCompactResize), pas seulement à la création
  const measureNarrow = () => {
    const cw = (canvas.clientWidth || (canvas.parentElement && canvas.parentElement.clientWidth) || 0);
    return cw > 0 ? cw < 420 : null;
  };
  let narrow = measureNarrow() === true;

  // Étiquettes d'arcs locales : anneau extérieur = nom (sur 1 ou 2 lignes) + part quand l'arc est
  // assez grand, sinon la part seule ; anneaux intérieurs = part seule (noms en légende).
  const sunburstLabelsPlugin = {
    id: 'kitChartsSunburstLabels',
    afterDatasetsDraw(chart) {
      if (!showDataLabels || chart.options?.showDataLabels === false) return;
      const ctx = chart.ctx;
      const fs = narrow ? 9 : 11;
      const lh = fs + 2;
      const nDs = chart.data.datasets.length;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      chart.data.datasets.forEach((ds, di) => {
        const meta = chart.getDatasetMeta(di);
        if (!meta || meta.hidden) return;
        const isOuter = di === 0 && nDs > 1;
        (meta.data || []).forEach((arc, i) => {
          const v = ds.data[i];
          if (!arc || !(v > 0)) return;
          const p = arc.getProps(['x', 'y', 'startAngle', 'endAngle', 'innerRadius', 'outerRadius'], true);
          const mid = (p.startAngle + p.endAngle) / 2;
          const rMid = (p.innerRadius + p.outerRadius) / 2;
          const thick = p.outerRadius - p.innerRadius;
          const arcLen = rMid * (p.endAngle - p.startAngle);
          const cx = p.x + Math.cos(mid) * rMid, cy = p.y + Math.sin(mid) * rMid;
          const pct = total > 0 ? `${Math.round((v / total) * 100)}%` : '';
          const name = String((ds.kcLabels || [])[i] || '');
          const bg = Array.isArray(ds.backgroundColor) ? ds.backgroundColor[i] : ds.backgroundColor;
          const wrapName = (maxW) => {
            const lines = []; let cur = '';
            name.split(/\s+/).forEach((w) => {
              const t = cur ? cur + ' ' + w : w;
              if (cur && ctx.measureText(t).width > maxW) { lines.push(cur); cur = w; } else cur = t;
            });
            if (cur) lines.push(cur);
            return lines;
          };
          const fits = (lines) => {
            const w = Math.max(...lines.map(l => ctx.measureText(l).width));
            const h = lines.length * lh;
            const c = Math.abs(Math.cos(mid)), sn = Math.abs(Math.sin(mid));
            const radial = c * w + sn * h;
            const tang = sn * w + c * h;
            return radial <= thick - 3 && tang <= arcLen - 3;
          };
          ctx.font = `600 ${fs}px ${tokens.fontFamily || 'sans-serif'}`;
          let lines = null;
          if (isOuter && name) {
            const cand = wrapName(Math.max(30, thick * 1.1));
            if (cand.length <= 2 && fits(cand.concat(pct ? [pct] : []))) lines = cand.concat(pct ? [pct] : []);
            else if (cand.length <= 3 && fits(cand)) lines = cand;
          }
          if (!lines && pct && fits([pct])) lines = [pct];
          if (!lines) return;
          ctx.fillStyle = contrastText(bg);
          const top = cy - ((lines.length - 1) * lh) / 2;
          lines.forEach((l, k) => ctx.fillText(l, cx, top + k * lh));
        });
      });
      ctx.restore();
    }
  };
  const datasets = levels.map((lv) => ({
    label: lv.ds.label || `Niveau ${lv.levelIdx + 1}`,
    data: lv.data,
    kcLabels: lv.labels,
    backgroundColor: levelColors[lv.levelIdx],
    borderColor: tokens.bg,
    borderWidth: isTufte ? 1 : 2,
    weight: lv.ds.weight !== undefined ? lv.ds.weight : 1
  })).reverse();

  // Les labels globaux suivent le dataset le plus externe (arcs les plus nombreux).
  const labels = datasets.length ? datasets[0].kcLabels : [];
  const chartData = { labels, datasets };

  // Options Chart.js v4+ avec capture de partition multi-niveaux
  const defaultOpts = getChartDefaultOptions(tokens);
  // Options reconstruites à chaque bascule du mode étroit (Chart.js observe déjà le conteneur)
  const buildOptions = () => ({
    ...defaultOpts,
    scales: {}, // AUCUN AXE CARTÉSIEN (après defaultOpts pour ne pas être écrasé)
    cutout: 0, // Pas de trou central : la racine est le disque le plus interne
    rotation: -90, // Départ à 12h
    animation: getAccessibleAnimationOptions(tokens, { duration: 450, easing: 'easeOutQuart' }),
    interaction: {
      mode: 'nearest',
      intersect: true,
      axis: 'xy'
    },
    hover: {
      mode: 'nearest',
      intersect: true,
      animationDuration: (isTufte || isReducedMotionPreferred()) ? 0 : 120
    },
    plugins: {
      ...defaultOpts.plugins,
      // Étiquettes dessinées par kitChartsSunburstLabels (nom + part selon la place disponible)
      datalabels: getDataLabelOptions(tokens, { display: () => false }),
      legend: {
        ...defaultOpts.plugins.legend,
        display: !isTufte,
        position: 'right',
        align: 'center',
        labels: {
          color: tokens.textPrimary,
          font: { family: tokens.fontFamily, size: narrow ? 11 : 12, weight: '500' },
          boxWidth: narrow ? 8 : 12,
          padding: narrow ? 8 : 12,
          usePointStyle: true,
          pointStyle: 'circle',
          // Légende = niveau racine uniquement (les sous-niveaux héritent de sa teinte)
          generateLabels: () => (levels[0] ? levels[0].labels : []).map((name, i) => ({
            text: name,
            fillStyle: levelColors[0][i],
            strokeStyle: levelColors[0][i],
            fontColor: tokens.textPrimary,
            pointStyle: 'circle',
            hidden: false,
            index: i
          }))
        },
        onClick: () => {}
      },
      tooltip: {
        ...defaultOpts.plugins.tooltip,
        padding: { top: 10, bottom: 10, left: 14, right: 14 },
        cornerRadius: isTufte ? 0 : 6,
        titleFont: { family: tokens.fontFamily, size: 12, weight: '600' },
        bodyFont: { family: tokens.fontMono || 'monospace', size: 12, weight: '400' },
        animation: (isTufte || isReducedMotionPreferred()) ? false : { duration: 150, easing: 'easeOutQuad' },
        callbacks: {
          title: (items) => {
            const it = items && items[0];
            if (!it) return '';
            const names = it.dataset.kcLabels || [];
            return names[it.dataIndex] || '';
          },
          label: (context) => {
            const val = Number(context.parsed !== null && context.parsed !== undefined ? context.parsed : context.raw) || 0;
            const formatted = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(val);
            const pct = total > 0 ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format((val / total) * 100) : '0';
            return ` ${context.dataset.label || ''} : ${formatted} (${pct}% du total)`;
          }
        }
      }
    }
  });

  const config = {
    type: 'doughnut',
    data: chartData,
    plugins: [createCompactResizePlugin(measureNarrow, narrow, (next, chart) => {
      narrow = next;
      chart.options = buildOptions();
    }), sunburstLabelsPlugin],
    options: buildOptions()
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
