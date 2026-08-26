/**
 * @file template/07-hierarchie-reseau/arc-diagram/template.js
 * @description Standardized Universal arc-diagram Template for kit-charts.
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
    global.KitCharts['arc-diagram'] = exp;
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
 * @file 07-hierarchie-reseau/arc-diagram/template.js
 * @description Template Chart.js v4+ pour Diagramme en Arcs (Arc Diagram).
 * Psychophysique: Encodage 1D ordonné des nœuds + arcs de liaison semi-circulaires (Cleveland-McGill: position 1D + épaisseur).
 * Règle cognitive: Préservation d'un ordre naturel séquentiel (ex: étapes de pipeline, chapitres, flux amont-aval).
 */

/**
 * Données par défaut représentatives (Interactions dans un pipeline de données en streaming)
 */
const DEFAULT_DATA = {
  nodes: [
    { id: 'ingest', label: '1. Ingestion', x: 1, y: 0, role: 'context' },
    { id: 'valid', label: '2. Validation', x: 2, y: 0, role: 'context' },
    { id: 'dedup', label: '3. Dédoublonnage', x: 3, y: 0, role: 'context' },
    { id: 'enrich', label: '4. Enrichissement', x: 4, y: 0, role: 'context' },
    { id: 'features', label: '5. Feature Store', x: 5, y: 0, role: 'context' },
    { id: 'infer', label: '6. Inférence IA', x: 6, y: 0, role: 'focal' },
    { id: 'alert', label: '7. Alerting / Dispatch', x: 7, y: 0, role: 'anomaly' }
  ],
  links: [
    { source: 0, target: 1, value: 8, label: 'Flux Brut' },
    { source: 1, target: 2, value: 7, label: 'Données Conformes' },
    { source: 1, target: 6, value: 2, label: 'Rejet / Erreur Schéma', role: 'anomaly' },
    { source: 2, target: 3, value: 6, label: 'Flux Unique' },
    { source: 0, target: 4, value: 4, label: 'Archivage Froid' },
    { source: 3, target: 5, value: 6, label: 'Vecteurs Calculés', role: 'focal' },
    { source: 4, target: 5, value: 3, label: 'Features Historiques' },
    { source: 5, target: 6, value: 5, label: 'Détections Anomalies', role: 'focal' }
  ],
  datasets: [{
    label: 'Étapes du Pipeline',
    data: [
      { x: 1, y: 0, label: '1. Ingestion', r: 8, role: 'context' },
      { x: 2, y: 0, label: '2. Validation', r: 8, role: 'context' },
      { x: 3, y: 0, label: '3. Dédoublonnage', r: 8, role: 'context' },
      { x: 4, y: 0, label: '4. Enrichissement', r: 8, role: 'context' },
      { x: 5, y: 0, label: '5. Feature Store', r: 8, role: 'context' },
      { x: 6, y: 0, label: '6. Inférence IA', r: 12, role: 'focal' },
      { x: 7, y: 0, label: '7. Alerting / Dispatch', r: 10, role: 'anomaly' }
    ]
  }]
};

/**
 * Plugin Canvas Chart.js pour le tracé des arcs semi-circulaires au-dessus de l'axe Y=0.
 */
const arcDiagramLinksPlugin = {
  id: 'arcDiagramLinksPlugin',
  beforeDatasetsDraw(chart) {
    const { ctx, data, scales } = chart;
    const xScale = scales.x;
    const yScale = scales.y;
    if (!xScale || !yScale) return;

    const rawData = data;
    const links = rawData.links || (rawData.datasets && rawData.datasets[0]?.links) || [];
    const nodes = rawData.datasets && rawData.datasets[0]?.data
      ? rawData.datasets[0].data
      : (Array.isArray(rawData.nodes) ? rawData.nodes : []);

    if (!links.length || !nodes.length) return;

    ctx.save();
    const isDark = chart.options?.plugins?.arcMeta?.isDark;
    const tokens = chart.options?.plugins?.arcMeta?.tokens || {};
    const palette = tokens.palette || ['#2B8CBE', '#E66101', '#5E3C99'];

    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      let sourceNode = null;
      let targetNode = null;

      if (typeof link.source === 'number') {
        sourceNode = nodes[link.source];
      } else if (typeof link.source === 'string') {
        sourceNode = nodes.find(n => n.id === link.source || n.label === link.source);
      } else if (link.source && typeof link.source === 'object') {
        sourceNode = link.source;
      }

      if (typeof link.target === 'number') {
        targetNode = nodes[link.target];
      } else if (typeof link.target === 'string') {
        targetNode = nodes.find(n => n.id === link.target || n.label === link.target);
      } else if (link.target && typeof link.target === 'object') {
        targetNode = link.target;
      }

      if (!sourceNode || !targetNode) continue;

      const x1 = xScale.getPixelForValue(sourceNode.x);
      const x2 = xScale.getPixelForValue(targetNode.x);
      const y0 = yScale.getPixelForValue(0);

      if (!Number.isFinite(x1) || !Number.isFinite(x2) || !Number.isFinite(y0)) {
        continue;
      }

      const cx = (x1 + x2) / 2;
      const radius = Math.abs(x2 - x1) / 2;
      if (radius <= 0) continue;

      const sourceIdx = typeof link.source === 'number' ? link.source : i;
      let color = palette[sourceIdx % palette.length];
      let isDashed = false;
      let strokeWidth = Math.max(1, Math.min(5, (link.value || link.weight || 2) * 0.6));

      if (link.role === 'anomaly' || link.valence === 'negative' || (link.label && (link.label.toLowerCase().includes('erreur') || link.label.toLowerCase().includes('rejet')))) {
        color = (tokens.status && tokens.status.danger) || (tokens.emphasis && tokens.emphasis.anomaly) || '#C62828';
        isDashed = true;
        strokeWidth = Math.max(2, strokeWidth);
      } else if (link.role === 'focal') {
        color = (tokens.emphasis && tokens.emphasis.focal) || color;
        strokeWidth = Math.max(2.5, strokeWidth + 1);
      } else if (link.role === 'context') {
        color = (tokens.emphasis && tokens.emphasis.context) || '#CBD5E1';
        strokeWidth = 1;
      }

      ctx.beginPath();
      if (isDashed) {
        ctx.setLineDash([4, 3]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.arc(cx, y0, radius, Math.PI, 0, false);
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    }

    ctx.restore();
  }
};

/**
 * Crée et initialise un diagramme en arcs dans le canvas cible.
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
  const nodes = rawData.datasets && rawData.datasets[0]?.data
    ? rawData.datasets[0].data
    : (Array.isArray(rawData.nodes) ? rawData.nodes : []);
  const links = rawData.links || (rawData.datasets && rawData.datasets[0]?.links) || [];

  const processedData = nodes.map((node, idx) => {
    let nodeColor = isTufte ? tokens.palette[0] : getColor(tokens, idx);
    let nodeRadius = typeof node.r === 'number' ? node.r : 8;
    let nodeBorderColor = isDark ? tokens.surface : '#FFFFFF';
    let nodeBorderWidth = 2;

    if (node.role) {
      const emp = getEmphasisStyle(tokens, node.role, { radius: nodeRadius });
      nodeColor = emp.backgroundColor || nodeColor;
      nodeBorderColor = emp.borderColor || nodeBorderColor;
      nodeBorderWidth = emp.borderWidth !== undefined ? emp.borderWidth : 2;
      if (node.role === 'focal') {
        nodeRadius = Math.max(nodeRadius, 12);
      } else if (node.role === 'context') {
        nodeRadius = Math.min(nodeRadius, 6);
      }
    } else if (node.valence !== undefined || node.delta !== undefined) {
      nodeColor = getValenceColor(tokens, node.valence !== undefined ? node.valence : node.delta, node.metricType || 'gain');
    }

    return {
      x: typeof node.x === 'number' ? node.x : (idx + 1),
      y: 0,
      r: nodeRadius,
      id: node.id || `node-${idx}`,
      label: node.label || `Étape ${idx + 1}`,
      role: node.role || 'context',
      color: nodeColor,
      borderColor: nodeBorderColor,
      borderWidth: nodeBorderWidth
    };
  });

  const datasetLabel = (rawData.datasets && rawData.datasets[0]?.label) || 'Nœuds Séquentiels';

  const chartData = {
    datasets: [{
      label: datasetLabel,
      data: processedData,
      backgroundColor: processedData.map(d => d.color),
      borderColor: processedData.map(d => d.borderColor),
      borderWidth: processedData.map(d => d.borderWidth),
      pointRadius: (ctx) => {
        const item = ctx.raw;
        return item && typeof item.r === 'number' ? item.r : (isTufte ? 4 : 8);
      },
      pointHoverRadius: (ctx) => {
        const item = ctx.raw;
        return item && typeof item.r === 'number' ? item.r + 3 : 11;
      },
      pointHitRadius: 14
    }],
    links
  };

  const defaultOpts = getChartDefaultOptions(tokens);

  const minX = processedData.length > 0 ? Math.min(...processedData.map(d => d.x)) - 0.8 : 0;
  const maxX = processedData.length > 0 ? Math.max(...processedData.map(d => d.x)) + 0.8 : 10;

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
        intersect: false,
        axis: 'xy'
      },
      hover: {
        mode: 'nearest',
        intersect: false,
        animationDuration: (isTufte || reduceMotion) ? 0 : 100
      },
      plugins: {
        ...defaultOpts.plugins,
        legend: {
          display: false
        },
        arcMeta: {
          isDark,
          tokens,
          palette: tokens.palette
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
              return items[0].raw?.label || `Point ${items[0].dataIndex + 1}`;
            },
            label: (item) => {
              const node = item.raw;
              const roleLabel = node.role ? ` [${node.role.toUpperCase()}]` : '';
              return [
                ` Position ordonnée : ${node.x}${roleLabel}`,
                ` Statut : ${node.role === 'anomaly' ? 'Anomalie / Déviation' : 'Opérationnel'}`
              ];
            }
          }
        }
      },
      scales: {
        x: {
          min: minX,
          max: maxX,
          afterBuildTicks: (scale) => {
            scale.ticks = processedData.map(d => ({ value: d.x }));
          },
          grid: {
            display: false,
            drawBorder: false
          },
          border: {
            color: tokens.borderStrong,
            width: 1.5
          },
          ticks: {
            autoSkip: false,
            stepSize: 1,
            color: tokens.textPrimary,
            font: {
              family: tokens.fontFamily,
              size: 11,
              weight: '600'
            },
            callback: (val) => {
              const match = processedData.find(d => Math.abs(d.x - val) < 0.1);
              return match ? match.label : '';
            },
            padding: 10
          }
        },
        y: {
          min: -0.5,
          max: 6,
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            display: false,
            color: tokens.textSecondary
          }
        }
      }
    },
    plugins: [arcDiagramLinksPlugin]
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
