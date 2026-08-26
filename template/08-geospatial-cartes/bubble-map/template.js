/**
 * @file template/08-geospatial-cartes/bubble-map/template.js
 * @description Standardized Universal bubble-map Template for kit-charts.
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
    global.KitCharts['bubble-map'] = exp;
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
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const kitChartsDataLabelsPlugin = (KitChartsTheme && KitChartsTheme.kitChartsDataLabelsPlugin) || (typeof window !== 'undefined' && window.kitChartsDataLabelsPlugin) || null;
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

const EUROPE_DATA = {"type":"FeatureCollection","features":[{"type":"Feature","id":"FRA","properties":{"name":"France","value":2800,"capital":"Paris","lat":48.8566,"lon":2.3522,"code":"FR"},"geometry":{"type":"Polygon","coordinates":[[[-4.8,48.4],[-1.9,49.7],[0.1,49.4],[1.6,50.1],[2.5,51.1],[4.2,49.9],[6.2,49.5],[7.7,49],[7.5,47.6],[6.8,45.9],[7.2,43.7],[5.3,43.3],[3.1,42.4],[1.8,42.5],[-1.8,43.4],[-1.2,46],[-3,47.6],[-4.8,48.4]]]}},{"type":"Feature","id":"DEU","properties":{"name":"Allemagne","value":4100,"capital":"Berlin","lat":52.52,"lon":13.405,"code":"DE"},"geometry":{"type":"Polygon","coordinates":[[[6,50.8],[6.9,53.6],[8.6,54.9],[10,54.4],[13.7,54.3],[14.2,53.9],[14.8,51.8],[15,51.1],[12.1,50.3],[13,47.7],[10,47.5],[7.6,49],[6.2,49.5],[6,50.8]]]}},{"type":"Feature","id":"GBR","properties":{"name":"Royaume-Uni","value":3100,"capital":"Londres","lat":51.5074,"lon":-0.1278,"code":"UK"},"geometry":{"type":"Polygon","coordinates":[[[-5.7,50],[-3,50.6],[1.4,51.2],[1.7,52.5],[0.1,53.8],[-1.8,55.8],[-2,57.5],[-3,58.6],[-5,58.6],[-5.6,55.4],[-3,53.4],[-5,51.5],[-5.7,50]]]}},{"type":"Feature","id":"ITA","properties":{"name":"Italie","value":2100,"capital":"Rome","lat":41.9028,"lon":12.4964,"code":"IT"},"geometry":{"type":"Polygon","coordinates":[[[6.8,45.9],[10.5,46.5],[13.8,46.5],[13,45.6],[12.3,44],[15,41.9],[18.5,40.2],[16.8,38.9],[15.8,38],[15.6,38.2],[14.8,40.8],[11.5,42.5],[9.5,44],[7.5,44.2],[6.8,45.9]]]}},{"type":"Feature","id":"ESP","properties":{"name":"Espagne","value":1500,"capital":"Madrid","lat":40.4168,"lon":-3.7038,"code":"ES"},"geometry":{"type":"Polygon","coordinates":[[[-9.3,43],[-1.8,43.4],[3.1,42.4],[3.3,41.9],[0.2,38.8],[-0.8,37.8],[-2.2,36.7],[-5.6,36],[-7.4,37.2],[-6.9,38],[-6.5,42],[-8.9,41.8],[-9.3,43]]]}},{"type":"Feature","id":"PRT","properties":{"name":"Portugal","value":260,"capital":"Lisbonne","lat":38.7223,"lon":-9.1393,"code":"PT"},"geometry":{"type":"Polygon","coordinates":[[[-8.9,41.8],[-6.5,42],[-6.9,38],[-7.4,37.2],[-9,37],[-9.5,38.7],[-8.9,41.8]]]}},{"type":"Feature","id":"NLD","properties":{"name":"Pays-Bas","value":1050,"capital":"Amsterdam","lat":52.3676,"lon":4.9041,"code":"NL"},"geometry":{"type":"Polygon","coordinates":[[[3.4,51.4],[4.7,52.9],[6.9,53.6],[7.1,53.2],[6,51.8],[5,51.4],[3.4,51.4]]]}},{"type":"Feature","id":"BEL","properties":{"name":"Belgique","value":580,"capital":"Bruxelles","lat":50.8503,"lon":4.3517,"code":"BE"},"geometry":{"type":"Polygon","coordinates":[[[2.5,51.1],[3.4,51.4],[5.9,50.8],[6.4,50.3],[5.8,49.5],[4.2,49.9],[2.5,51.1]]]}},{"type":"Feature","id":"CHE","properties":{"name":"Suisse","value":870,"capital":"Berne","lat":46.948,"lon":7.4474,"code":"CH"},"geometry":{"type":"Polygon","coordinates":[[[6,46.2],[6,47.5],[8.6,47.8],[10.5,46.9],[9,45.8],[6.8,45.9],[6,46.2]]]}},{"type":"Feature","id":"POL","properties":{"name":"Pologne","value":750,"capital":"Varsovie","lat":52.2297,"lon":21.0122,"code":"PL"},"geometry":{"type":"Polygon","coordinates":[[[14.2,53.9],[18.6,54.8],[22.8,54.3],[24.1,52.7],[23.5,50],[22.7,49],[18.9,49.5],[15,51.1],[14.2,53.9]]]}},{"type":"Feature","id":"AUT","properties":{"name":"Autriche","value":480,"capital":"Vienne","lat":48.2082,"lon":16.3738,"code":"AT"},"geometry":{"type":"Polygon","coordinates":[[[9.5,47.5],[13,47.7],[15,48.8],[17,48],[16,46.8],[13.8,46.5],[10.5,46.9],[9.5,47.5]]]}},{"type":"Feature","id":"SWE","properties":{"name":"Suède","value":590,"capital":"Stockholm","lat":59.3293,"lon":18.0686,"code":"SE"},"geometry":{"type":"Polygon","coordinates":[[[11.2,58.9],[12.8,56.3],[14.5,55.4],[16,56.5],[19,60],[24.1,65.8],[20.6,68.5],[14,64],[12,63.5],[11.2,58.9]]]}},{"type":"Feature","id":"NOR","properties":{"name":"Norvège","value":520,"capital":"Oslo","lat":59.9139,"lon":10.7522,"code":"NO"},"geometry":{"type":"Polygon","coordinates":[[[5,62],[6,58.5],[10,58],[11.2,58.9],[12,63.5],[14,64],[20.6,68.5],[28,71],[14,68],[5,62]]]}},{"type":"Feature","id":"IRL","properties":{"name":"Irlande","value":500,"capital":"Dublin","lat":53.3498,"lon":-6.2603,"code":"IE"},"geometry":{"type":"Polygon","coordinates":[[[-10.5,51.5],[-6,52.2],[-6,54],[-7.5,55.3],[-10,54.2],[-10.5,51.5]]]}}]};

const DEFAULT_DATA = {
  title: 'Investissements Métropoles Européennes (M€)',
  features: EUROPE_DATA.features,
  bubbles: [
    { city: 'Paris', lon: 2.3522, lat: 48.8566, val: 3400, role: 'focal', growth: 14.5 },
    { city: 'Londres', lon: -0.1278, lat: 51.5074, val: 3800, role: 'focal', growth: 18.2 },
    { city: 'Berlin', lon: 13.4050, lat: 52.5200, val: 2600, role: 'context', growth: 6.1 },
    { city: 'Madrid', lon: -3.7038, lat: 40.4168, val: 1900, role: 'context', growth: 3.4 },
    { city: 'Rome', lon: 12.4964, lat: 41.9028, val: 1400, role: 'anomaly', growth: -8.5 },
    { city: 'Amsterdam', lon: 4.9041, lat: 52.3676, val: 2100, role: 'context', growth: 9.0 },
    { city: 'Bruxelles', lon: 4.3517, lat: 50.8503, val: 1100, role: 'context', growth: 2.1 },
    { city: 'Stockholm', lon: 18.0686, lat: 59.3293, val: 1300, role: 'context', growth: 5.5 },
    { city: 'Dublin', lon: -6.2603, lat: 53.3498, val: 1600, role: 'focal', growth: 22.0 }
  ]
};

function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) throw new Error('Canvas not found');

  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const reduceMotion = isReducedMotionPreferred();
  const showDataLabels = (customData && customData.showDataLabels !== undefined) ? customData.showDataLabels : (options.showDataLabels !== undefined ? options.showDataLabels : true);

  const rawData = customData || DEFAULT_DATA;
  const features = rawData.features || EUROPE_DATA.features;
  const bubbles = rawData.bubbles || DEFAULT_DATA.bubbles;

  const defaultBubbleColor = getColor(tokens, 0);

  const bubbleMapPlugin = {
    id: 'bubbleVectorMap_' + Math.random().toString(36).substring(2, 7),
    afterDraw(chart) {
      const { ctx, chartArea } = chart;
      if (!chartArea) return;

      const { left, top, right, bottom, width, height } = chartArea;
      ctx.save();

      const lonMin = -11, lonMax = 28;
      const latMin = 35, latMax = 71;
      const cosLat = Math.cos(50 * Math.PI / 180);

      const geoWidth = (lonMax - lonMin) * cosLat;
      const geoHeight = (latMax - latMin);

      const padding = 12;
      const scale = Math.min((width - padding * 2) / geoWidth, (height - padding * 2) / geoHeight);

      const mapPixelWidth = geoWidth * scale;
      const mapPixelHeight = geoHeight * scale;
      const offsetX = left + (width - mapPixelWidth) / 2;
      const offsetY = top + (height - mapPixelHeight) / 2;

      const project = (lon, lat) => {
        const x = offsetX + (lon - lonMin) * cosLat * scale;
        const y = offsetY + (latMax - lat) * scale;
        return [x, y];
      };

      // 1. Draw Basemap Polygons
      features.forEach((feature) => {
        const coords = feature.geometry.coordinates[0];
        if (!coords || coords.length < 3) return;

        ctx.beginPath();
        const [startX, startY] = project(coords[0][0], coords[0][1]);
        ctx.moveTo(startX, startY);

        for (let i = 1; i < coords.length; i++) {
          const [px, py] = project(coords[i][0], coords[i][1]);
          ctx.lineTo(px, py);
        }
        ctx.closePath();

        ctx.fillStyle = tokens.isDark ? '#3B4252' : '#F1F5F9';
        ctx.fill();

        ctx.strokeStyle = tokens.isDark ? '#4C566A' : '#CBD5E1';
        ctx.lineWidth = 1.0;
        ctx.stroke();
      });

      // 2. Draw Proportional Bubbles (r ∝ √V for perceptual accuracy)
      const maxVal = Math.max(...bubbles.map(b => b.val));
      const maxRadius = Math.max(12, Math.min(22, width * 0.045));

      bubbles.forEach((b) => {
        const [bx, by] = project(b.lon, b.lat);
        const radius = Math.sqrt(b.val / maxVal) * maxRadius;

        let bColor = defaultBubbleColor;
        let bAlpha = tokens.isDark ? 0.75 : 0.65;
        let bBorderColor = tokens.bg || '#FFFFFF';
        let bBorderWidth = 1.5;

        if (b.role) {
          const emp = getEmphasisStyle(tokens, b.role);
          bColor = emp.backgroundColor || bColor;
          bBorderColor = emp.borderColor || bBorderColor;
          if (b.role === 'focal') {
            bAlpha = 0.90;
            bBorderWidth = 2.5;
          } else if (b.role === 'anomaly') {
            bAlpha = 0.85;
            bBorderColor = (tokens.status && tokens.status.danger) || '#C62828';
            bBorderWidth = 2.0;
          } else if (b.role === 'context') {
            bAlpha = 0.50;
          }
        } else if (typeof b.growth === 'number' || typeof b.valence === 'number') {
          bColor = getValenceColor(tokens, typeof b.growth === 'number' ? b.growth : b.valence, b.metricType || 'gain');
        }

        // Outer fill
        ctx.beginPath();
        ctx.fillStyle = bColor;
        ctx.globalAlpha = bAlpha;
        ctx.arc(bx, by, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Stroke
        ctx.strokeStyle = bBorderColor;
        ctx.lineWidth = bBorderWidth;
        ctx.stroke();

        // City & Data Label
        if (showDataLabels) {
          ctx.fillStyle = tokens.isDark ? '#ECEFF4' : '#0F172A';
          ctx.font = `600 9px ${tokens.fontFamily || 'sans-serif'}`;
          ctx.textAlign = 'center';
          const labelText = `${b.city} (${formatLabelValue(b.val)})`;
          ctx.fillText(labelText, bx, by - radius - 3);
        }
      });

      ctx.restore();
    }
  };

  const config = {
    type: 'scatter',
    data: { datasets: [{ data: [] }] },
    plugins: [bubbleMapPlugin],
    options: {
      responsive: true,
      maintainAspectRatio: false,
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
      scales: {
        x: { display: false, grid: { display: false } },
        y: { display: false, grid: { display: false } }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
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
            label: (ctx) => {
              const item = ctx.raw;
              if (!item) return '';
              const formatted = typeof item.val === 'number' ? item.val.toLocaleString('fr-FR') : item.val;
              return ` ${item.city || ''} : ${formatted} M€`;
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }
  return {
    canvas,
    config,
    data: config.data,
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
  moduleExports.getEmphasisStyle = moduleExports.getEmphasisStyle;
  moduleExports.getValenceColor = moduleExports.getValenceColor;
  moduleExports.getThresholdStatus = moduleExports.getThresholdStatus;

  return moduleExports;
});
