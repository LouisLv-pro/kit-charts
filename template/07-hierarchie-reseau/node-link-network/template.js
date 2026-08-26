/**
 * @file template/07-hierarchie-reseau/node-link-network/template.js
 * @description Standardized Universal node-link-network Template for kit-charts.
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
    global.KitCharts['node-link-network'] = exp;
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
 * @file 07-hierarchie-reseau/node-link-network/template.js
 * @description Template Chart.js v4+ pour Réseau Nœuds-Liens (Force-Directed / Node-Link Network).
 * Psychophysique: Encodage topologique de relations et centralité (Cleveland-McGill: position spatiale + aire du nœud).
 * Règle cognitive: Finesse et transparence des arêtes pour éviter l'effet 'Hairball', clustering par couleur qualitative.
 */

/**
 * Données par défaut représentatives (Architecture micro-services et flux de données)
 */
const DEFAULT_DATA = {
  datasets: [{
    label: 'Services & Modules',
    data: [
      { x: 50, y: 85, r: 16, id: 'api-gw', label: 'API Gateway', cluster: 0, connections: 4, role: 'focal' },
      { x: 25, y: 65, r: 12, id: 'auth-svc', label: 'Auth Service', cluster: 1, connections: 2, role: 'context' },
      { x: 75, y: 65, r: 13, id: 'user-svc', label: 'User Service', cluster: 1, connections: 3, role: 'context' },
      { x: 40, y: 45, r: 14, id: 'order-engine', label: 'Order Engine', cluster: 2, connections: 4, role: 'focal' },
      { x: 15, y: 35, r: 11, id: 'pay-gw', label: 'Payment Gateway', cluster: 2, connections: 2, role: 'context' },
      { x: 65, y: 45, r: 13, id: 'inventory-svc', label: 'Inventory Service', cluster: 3, connections: 3, role: 'context' },
      { x: 85, y: 25, r: 15, id: 'primary-db', label: 'Primary PostgreSQL', cluster: 3, connections: 3, role: 'focal' },
      { x: 50, y: 20, r: 12, id: 'cache-redis', label: 'Redis Cache Cluster', cluster: 3, connections: 3, role: 'anomaly' },
      { x: 30, y: 15, r: 10, id: 'analytics-bus', label: 'Kafka Event Bus', cluster: 4, connections: 2, role: 'context' }
    ]
  }],
  links: [
    { source: 0, target: 1, weight: 3, role: 'context' },
    { source: 0, target: 2, weight: 3, role: 'context' },
    { source: 0, target: 3, weight: 4, role: 'focal' },
    { source: 1, target: 2, weight: 2, role: 'context' },
    { source: 3, target: 4, weight: 3, role: 'context' },
    { source: 3, target: 5, weight: 3, role: 'context' },
    { source: 2, target: 6, weight: 2, role: 'context' },
    { source: 5, target: 6, weight: 3, role: 'focal' },
    { source: 3, target: 7, weight: 2, role: 'anomaly', label: 'Latence Critique' },
    { source: 5, target: 7, weight: 2, role: 'anomaly', label: 'Timeout Détecté' },
    { source: 4, target: 8, weight: 2, role: 'context' },
    { source: 3, target: 8, weight: 2, role: 'context' }
  ]
};

/**
 * Plugin Canvas Chart.js pour le tracé des liens / arêtes entre les nœuds.
 */
const networkLinksPlugin = {
  id: 'networkLinksPlugin',
  beforeDatasetsDraw(chart) {
    const { ctx, data, scales } = chart;
    const xScale = scales.x;
    const yScale = scales.y;
    if (!xScale || !yScale) return;

    const rawData = data;
    const links = rawData.links || (rawData.datasets && rawData.datasets[0]?.links) || [];
    const nodes = rawData.datasets && rawData.datasets[0]?.data ? rawData.datasets[0].data : [];
    if (!links.length || !nodes.length) return;

    ctx.save();
    const isDark = chart.options?.plugins?.networkMeta?.isDark;
    const tokens = chart.options?.plugins?.networkMeta?.tokens || {};

    for (const link of links) {
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
      const y1 = yScale.getPixelForValue(sourceNode.y);
      const x2 = xScale.getPixelForValue(targetNode.x);
      const y2 = yScale.getPixelForValue(targetNode.y);

      if (!Number.isFinite(x1) || !Number.isFinite(y1) || !Number.isFinite(x2) || !Number.isFinite(y2)) {
        continue;
      }

      let strokeColor = isDark ? 'rgba(216, 222, 233, 0.28)' : 'rgba(71, 85, 105, 0.25)';
      let strokeWidth = Math.max(1, Math.min(4, link.weight || 1.5));
      let isDashed = false;

      if (link.role === 'anomaly' || (link.label && (link.label.toLowerCase().includes('latence') || link.label.toLowerCase().includes('timeout') || link.label.toLowerCase().includes('erreur')))) {
        strokeColor = (tokens.status && tokens.status.danger) || (tokens.emphasis && tokens.emphasis.anomaly) || '#C62828';
        strokeWidth = Math.max(2, strokeWidth);
        isDashed = true;
      } else if (link.role === 'focal') {
        strokeColor = (tokens.emphasis && tokens.emphasis.focal) || strokeColor;
        strokeWidth = Math.max(2.5, strokeWidth + 1);
      }

      ctx.beginPath();
      if (isDashed) {
        ctx.setLineDash([4, 3]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineWidth = strokeWidth;
      ctx.strokeStyle = strokeColor;
      ctx.stroke();
    }

    ctx.restore();
  }
};

/**
 * Crée et initialise un graphique Node-Link Network dans le canvas cible.
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
  const rawNodes = (rawData.datasets && rawData.datasets[0]?.data) ? rawData.datasets[0].data : (Array.isArray(rawData.nodes) ? rawData.nodes : []);
  const links = rawData.links || (rawData.datasets && rawData.datasets[0]?.links) || [];

  const processedData = rawNodes.map((node, idx) => {
    let nodeColor = getColor(tokens, node.cluster !== undefined ? node.cluster : idx);
    let nodeRadius = typeof node.r === 'number' ? node.r : 10;
    let nodeBorderColor = isDark ? tokens.surface : '#FFFFFF';
    let nodeBorderWidth = 2;

    if (node.role) {
      const emp = getEmphasisStyle(tokens, node.role, { radius: nodeRadius });
      nodeColor = emp.backgroundColor || nodeColor;
      nodeBorderColor = emp.borderColor || nodeBorderColor;
      nodeBorderWidth = emp.borderWidth !== undefined ? emp.borderWidth : 2;
    } else if (node.valence !== undefined || node.delta !== undefined) {
      nodeColor = getValenceColor(tokens, node.valence !== undefined ? node.valence : node.delta, node.metricType || 'gain');
    }

    return {
      x: typeof node.x === 'number' ? node.x : Math.random() * 80 + 10,
      y: typeof node.y === 'number' ? node.y : Math.random() * 80 + 10,
      r: isTufte ? Math.max(4, nodeRadius * 0.75) : nodeRadius,
      id: node.id || `node-${idx}`,
      label: node.label || `Nœud ${idx + 1}`,
      cluster: node.cluster !== undefined ? node.cluster : 0,
      role: node.role || null,
      connections: node.connections || 1,
      color: nodeColor,
      borderColor: nodeBorderColor,
      borderWidth: nodeBorderWidth
    };
  });

  const datasetLabel = (rawData.datasets && rawData.datasets[0]?.label) || 'Entités Réseau';

  const chartData = {
    datasets: [{
      label: datasetLabel,
      data: processedData,
      backgroundColor: processedData.map(d => d.color),
      borderColor: processedData.map(d => d.borderColor),
      borderWidth: processedData.map(d => d.borderWidth),
      pointRadius: (ctx) => {
        const item = ctx.raw;
        return item && typeof item.r === 'number' ? item.r : 8;
      },
      pointHoverRadius: (ctx) => {
        const item = ctx.raw;
        return item && typeof item.r === 'number' ? item.r + 4 : 12;
      },
      pointHitRadius: 14
    }],
    links
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
        networkMeta: {
          isDark,
          tokens
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
              return `${raw?.label || `Nœud (${raw?.x}, ${raw?.y})`}${roleInfo}`;
            },
            label: (item) => {
              const raw = item.raw;
              const clusterName = `Communauté ${raw?.cluster !== undefined ? raw.cluster + 1 : 1}`;
              const radiusInfo = raw?.r ? `Rayon: ${raw.r}px` : `Coord: [${raw?.x}, ${raw?.y}]`;
              const statusInfo = raw?.role === 'anomaly' ? 'État : Dégradé / Alerte Latence' : 'État : Nominal';
              return [` ${clusterName}`, ` ${radiusInfo}`, ` ${statusInfo}`];
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 6
          }
        },
        y: {
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 8
          }
        }
      }
    },
    plugins: [networkLinksPlugin]
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
