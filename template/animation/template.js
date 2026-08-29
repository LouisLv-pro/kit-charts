/**
 * @file animation/template.js
 * @description Standardized Universal Cognitive Micro-Animation & Object Constancy Showcase Template for kit-charts.
 * Implements logarithmic duration scaling ΔT(N), Tversky congruence & apprehension principles,
 * Heer & Robertson object constancy transitions, Dragicevic kinematic easing, and WCAG 2.2 SC 2.3.3.
 * Compatible with browsers (file://, http://), Node.js, and bundlers.
 */

(function(global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory(require('../../themes/theme-tokens.js'));
  } else if (typeof define === 'function' && define.amd) {
    define(['../../themes/theme-tokens.js'], factory);
  } else {
    global = typeof globalThis !== 'undefined' ? globalThis : global || self;
    var tokens = global.KitChartsTheme || (global.KitCharts && global.KitCharts.Theme) || {};
    var exp = factory(tokens);
    global.KitCharts = global.KitCharts || {};
    global.KitCharts['animation'] = exp;
    global.KitCharts['animation-showcase'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.NARRATIVE_DATA = exp.NARRATIVE_DATA;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return '#2B8CBE'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function(t, r, o) { return {}; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function() { return {}; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getAnimationDuration = (KitChartsTheme && KitChartsTheme.getAnimationDuration) || (typeof window !== 'undefined' && window.getAnimationDuration) || function(n) { return Math.min(800, Math.round(300 + 100 * Math.log2(Math.max(1, n)))); };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const getStaggerDelay = (KitChartsTheme && KitChartsTheme.getStaggerDelay) || (typeof window !== 'undefined' && window.getStaggerDelay) || function(ctx, opts) { return 0; };
  const animateStagedUpdate = (KitChartsTheme && KitChartsTheme.animateStagedUpdate) || (typeof window !== 'undefined' && window.animateStagedUpdate) || function(chart, data) { if (chart && chart.update) chart.update(); return Promise.resolve(); };
  const attachPulseAlert = (KitChartsTheme && KitChartsTheme.attachPulseAlert) || (typeof window !== 'undefined' && window.attachPulseAlert) || function() { return { stop: () => {} }; };
  const kcPulsePlugin = (KitChartsTheme && KitChartsTheme.kcPulsePlugin) || (typeof window !== 'undefined' && window.kcPulsePlugin) || { id: 'kcPulse' };
  const animateZoomDrilldown = (KitChartsTheme && KitChartsTheme.animateZoomDrilldown) || (typeof window !== 'undefined' && window.animateZoomDrilldown) || function(chart) { if (chart && chart.update) chart.update(); return Promise.resolve(); };
  const computeEventSegmentation = (KitChartsTheme && KitChartsTheme.computeEventSegmentation) || (typeof window !== 'undefined' && window.computeEventSegmentation) || function() { return [0]; };
  const createNarrativeScenePlayer = (KitChartsTheme && KitChartsTheme.createNarrativeScenePlayer) || (typeof window !== 'undefined' && window.createNarrativeScenePlayer) || function() { return {}; };
  const animateWithAnticipation = (KitChartsTheme && KitChartsTheme.animateWithAnticipation) || (typeof window !== 'undefined' && window.animateWithAnticipation) || function(c, fn) { if (fn) fn(c); if (c && c.update) c.update(); return Promise.resolve(); };
  const createAnimationTicker = (KitChartsTheme && KitChartsTheme.createAnimationTicker) || (typeof window !== 'undefined' && window.createAnimationTicker) || function(o) { return { stop: () => {} }; };
  const animatePathDrawing = (KitChartsTheme && KitChartsTheme.animatePathDrawing) || (typeof window !== 'undefined' && window.animatePathDrawing) || function() { return { stop: () => {} }; };
  const animateCountUp = (KitChartsTheme && KitChartsTheme.animateCountUp) || (typeof window !== 'undefined' && window.animateCountUp) || function() { return { stop: () => {} }; };
  const animateFocusContext = (KitChartsTheme && KitChartsTheme.animateFocusContext) || (typeof window !== 'undefined' && window.animateFocusContext) || function() { return { stop: () => {} }; };
  const animateBarChartRace = (KitChartsTheme && KitChartsTheme.animateBarChartRace) || (typeof window !== 'undefined' && window.animateBarChartRace) || function() { return {}; };
  const animatePanCamera = (KitChartsTheme && KitChartsTheme.animatePanCamera) || (typeof window !== 'undefined' && window.animatePanCamera) || function() { return { stop: () => {} }; };
  const animateCrossTypeMorph = (KitChartsTheme && KitChartsTheme.animateCrossTypeMorph) || (typeof window !== 'undefined' && window.animateCrossTypeMorph) || function() { return { stop: () => {} }; };
  const animateAxisRescale = (KitChartsTheme && KitChartsTheme.animateAxisRescale) || (typeof window !== 'undefined' && window.animateAxisRescale) || function() { return { stop: () => {} }; };
  const animateMotionTrails = (KitChartsTheme && KitChartsTheme.animateMotionTrails) || (typeof window !== 'undefined' && window.animateMotionTrails) || function() { return { stop: () => {} }; };
  const animateSeriesBuildup = (KitChartsTheme && KitChartsTheme.animateSeriesBuildup) || (typeof window !== 'undefined' && window.animateSeriesBuildup) || function() { return { stop: () => {} }; };
  const initScrollytelling = (KitChartsTheme && KitChartsTheme.initScrollytelling) || (typeof window !== 'undefined' && window.initScrollytelling) || function() { return { destroy: () => {} }; };
  const animateCriticalDamping = (KitChartsTheme && KitChartsTheme.animateCriticalDamping) || (typeof window !== 'undefined' && window.animateCriticalDamping) || function() { return { stop: () => {} }; };
  const kcDeltaFlashPlugin = (KitChartsTheme && KitChartsTheme.kcDeltaFlashPlugin) || (typeof window !== 'undefined' && window.kcDeltaFlashPlugin) || { id: 'kcDeltaFlash' };
  const attachDeltaFlash = (KitChartsTheme && KitChartsTheme.attachDeltaFlash) || (typeof window !== 'undefined' && window.attachDeltaFlash) || function() { return { stop: () => {} }; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  /**
   * Données par défaut pour la démonstration des micro-animations
   * Indices d'efficacité opérationnelle par pôle métier (N=8)
   */
  const DEFAULT_DATA = {
    labels: ['Recherche & Dév.', 'Ingénierie Logicielle', 'Production & Infra', 'Marketing Digital', 'Service Client', 'Ressources Humaines', 'Finance & Audit', 'Logistique'],
    datasets: [
      {
        label: "Score d'Efficacité 2026",
        data: [88, 94, 76, 82, 69, 85, 91, 78]
      },
      {
        label: 'Benchmark Sectoriel 2025',
        data: [80, 85, 72, 75, 70, 80, 86, 74],
        type: 'line',
        borderDash: [4, 4],
        borderWidth: 2,
        pointRadius: 4
      }
    ]
  };

  /**
   * Série temporelle pour la segmentation événementielle narrative (§9)
   */
  const NARRATIVE_DATA = {
    labels: ['Recherche & Dév.', 'Ingénierie Logicielle', 'Production & Infra', 'Marketing Digital', 'Service Client', 'Ressources Humaines', 'Finance & Audit', 'Logistique'],
    scenes: [
      {
        id: 'scene-1',
        title: 'Phase 1 : Diagnostic Initial',
        description: 'Point de départ pré-optimisation : disparités fortes entre pôles.',
        data: [65, 72, 58, 60, 50, 68, 74, 62]
      },
      {
        id: 'scene-2',
        title: 'Phase 2 : Restructuration Cloud & Infra',
        description: 'Bond statistique majeur sur l\'Ingénierie et la Production (+25%).',
        data: [78, 94, 82, 64, 52, 70, 78, 66]
      },
      {
        id: 'scene-3',
        title: 'Phase 3 : Automatisation & IA',
        description: 'Montée en puissance générale du Service Client et du Marketing.',
        data: [88, 94, 76, 82, 69, 85, 91, 78]
      },
      {
        id: 'scene-4',
        title: 'Phase 4 : Performance Cible 2026',
        description: 'Harmonisation globale supérieure au benchmark sectoriel.',
        data: [92, 98, 88, 90, 84, 91, 95, 87]
      }
    ]
  };

  /**
   * Crée et initialise le démonstrateur interactif de micro-animations cognitives.
   *
   * @param {string|HTMLCanvasElement} canvasTarget - ID ou élément Canvas
   * @param {Object} [customData=null] - Données personnalisées
   * @param {string} [themeName='colorbrewer-accessible'] - Nom du thème cognitif
   * @param {Object} [options={}] - Options de configuration de l'animation
   * @returns {Object} Instance Chart.js
   */
  function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
    const canvas = typeof canvasTarget === 'string'
      ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
      : canvasTarget;

    if (!canvas) {
      if (typeof process !== 'undefined' && process.versions && process.versions.node) {
        return {
          id: 'animation-mock',
          destroy: () => {},
          update: () => {},
          draw: () => {},
          resize: () => {},
          data: customData || DEFAULT_DATA,
          options: {},
          canvas: null
        };
      }
      throw new Error(`Canvas element "${canvasTarget}" not found`);
    }

    if (typeof Chart !== 'undefined' && Chart.getChart) {
      const existing = Chart.getChart(canvas);
      if (existing) existing.destroy();
    }

    const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
    const tokens = getThemeTokens(themeName, container);
    const isTufte = tokens.name === 'tufte-minimalist-executive';

    const data = customData || DEFAULT_DATA;
    const labels = data.labels || [];
    const n = labels.length;

    // Calcul déterministe de la durée selon l'échelle logarithmique
    const computedDuration = options.duration !== undefined ? options.duration : getAnimationDuration(n);
    const easing = options.easing || 'easeOutCubic';
    const forceReducedMotion = options.reducedMotion !== undefined ? options.reducedMotion : isReducedMotionPreferred();

    const effectiveDuration = (forceReducedMotion || isTufte) ? 0 : computedDuration;

    const barColor = isTufte ? '#333333' : getColor(tokens, 0);
    const lineColor = isTufte ? '#777777' : getColor(tokens, 1);

    const datasets = (data.datasets || []).map((ds, idx) => {
      const copy = { ...ds };
      if (ds.type === 'line' || idx === 1) {
        copy.type = 'line';
        copy.borderColor = lineColor;
        copy.backgroundColor = lineColor;
        copy.pointBackgroundColor = lineColor;
        copy.pointBorderColor = tokens.surfaceRaised || tokens.bg || '#FFFFFF';
        copy.pointHoverRadius = 7;
        copy.pointHitRadius = 12;
      } else {
        copy.type = 'bar';
        if (Array.isArray(ds.emphasisRoles) || Array.isArray(ds.roles)) {
          const roles = ds.emphasisRoles || ds.roles;
          copy.backgroundColor = roles.map(r => getEmphasisStyle(tokens, r).backgroundColor || barColor);
          copy.borderColor = roles.map(r => getEmphasisStyle(tokens, r).borderColor || barColor);
        } else {
          copy.backgroundColor = isTufte ? 'rgba(0, 0, 0, 0.12)' : hexToRgba(barColor, 0.85);
          copy.borderColor = barColor;
        }
        copy.borderWidth = 1.5;
        copy.borderRadius = 4;
        copy.hoverBorderWidth = 2.5;
        copy.hoverBackgroundColor = barColor;
      }
      return copy;
    });

    const baseOptions = getChartDefaultOptions(tokens);

    const chartOptions = {
      ...baseOptions,
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: effectiveDuration,
        easing: easing,
        // Cavanagh & Alvarez MOT capped stagger
        delay: (ctx) => {
          if (effectiveDuration === 0) return 0;
          return getStaggerDelay(ctx, {
            unitMs: 300,
            overlapCap: 4,
            duration: effectiveDuration
          });
        }
      },
      transitions: {
        active: {
          animation: {
            duration: effectiveDuration === 0 ? 0 : 150,
            easing: 'easeOutQuad'
          }
        },
        resize: {
          animation: {
            duration: 0
          }
        }
      },
      plugins: {
        ...baseOptions.plugins,
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            color: tokens.textSecondary,
            font: { family: tokens.fontFamily, size: 11, weight: '500' },
            usePointStyle: true,
            boxWidth: 10
          }
        },
        tooltip: {
          ...baseOptions.plugins.tooltip,
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: { family: tokens.fontFamily, size: 11 }
          }
        },
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Score d\'Efficacité (%)',
            color: tokens.textSecondary,
            font: { family: tokens.fontFamily, size: 11, weight: '600' }
          },
          grid: { color: tokens.gridColor || 'rgba(0,0,0,0.06)' },
          ticks: {
            color: tokens.textSecondary,
            font: { family: tokens.fontMono || 'monospace', size: 10.5 },
            callback: (v) => `${v}%`
          }
        }
      }
    };

    if (typeof Chart !== 'undefined') {
      const plugins = [kcPulsePlugin];
      return new Chart(canvas, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: datasets
        },
        options: chartOptions,
        plugins: plugins
      });
    }

    return null;
  }

  /**
   * Exécute une transition par étapes Heer & Robertson (Fade Out -> Morph -> Fade In)
   */
  function triggerStagedTransition(chart, newDataset, options = {}) {
    return animateStagedUpdate(chart, newDataset, options.type, options);
  }

  /**
   * Exécute une interpolation fluide anti-change-blindness
   */
  function triggerAntiChangeBlindness(chart, newData, options = {}) {
    if (!chart || !chart.data) return;
    if (newData && Array.isArray(newData)) {
      if (chart.data.datasets[0]) chart.data.datasets[0].data = [...newData];
    } else if (newData && newData.datasets) {
      chart.data.datasets = newData.datasets.map(ds => ({ ...ds }));
      if (newData.labels) chart.data.labels = [...newData.labels];
    }
    const dur = isReducedMotionPreferred() ? 0 : (options.duration || getAnimationDuration(chart.data.labels ? chart.data.labels.length : 8));
    if (chart.options && chart.options.animation) {
      chart.options.animation.duration = dur;
      chart.options.animation.easing = options.easing || 'easeOutCubic';
    }
    chart.update();
  }

  /**
   * Déclenche un pulse préattentif auto-extinguible sur franchissement de seuil
   */
  function triggerAlertPulse(chart, options = {}) {
    return attachPulseAlert(chart, {
      datasetIndex: 0,
      threshold: 88,
      amplitude: 0.08,
      frequency: 2,
      tau: 1.2,
      color: '#D95F02',
      ...options
    });
  }

  /**
   * Déclenche un zoom / drilldown animé continu
   */
  function triggerZoomDrilldown(chart, targetBoundsOrRange, options = {}) {
    let bounds = targetBoundsOrRange;
    if (!bounds) {
      const isZoomed = chart.options?.scales?.y?.min > 10;
      bounds = isZoomed ? { min: 0, max: 100 } : { min: 50, max: 100 };
    }
    return animateZoomDrilldown(chart, bounds, options);
  }

  /**
   * Déclenche un stagger MOT-capped sur données modifiées
   */
  function triggerMotStagger(chart, newData, options = {}) {
    if (!chart || !chart.data) return;
    if (newData && Array.isArray(newData)) {
      if (chart.data.datasets[0]) chart.data.datasets[0].data = [...newData];
    }
    const dur = isReducedMotionPreferred() ? 0 : (options.duration || getAnimationDuration(chart.data.labels ? chart.data.labels.length : 8));
    if (chart.options && chart.options.animation) {
      chart.options.animation.duration = dur;
      chart.options.animation.easing = options.easing || 'easeOutCubic';
    }
    chart.update();
  }

  /**
   * Déclenche un tri avec micro-anticipation Lasseter (1987)
   */
  function triggerAnticipationSort(chart, sortDirection = 'desc', options = {}) {
    return animateWithAnticipation(chart, (c) => {
      const labels = [...c.data.labels];
      const data0 = [...c.data.datasets[0].data];
      const data1 = c.data.datasets[1] ? [...c.data.datasets[1].data] : [];

      const pairs = labels.map((l, i) => ({
        label: l,
        v0: data0[i],
        v1: data1[i] !== undefined ? data1[i] : null
      }));

      if (sortDirection === 'desc') {
        pairs.sort((a, b) => b.v0 - a.v0);
      } else if (sortDirection === 'asc') {
        pairs.sort((a, b) => a.v0 - b.v0);
      } else {
        pairs.sort(() => Math.random() - 0.5);
      }

      c.data.labels = pairs.map(p => p.label);
      c.data.datasets[0].data = pairs.map(p => p.v0);
      if (c.data.datasets[1]) {
        c.data.datasets[1].data = pairs.map(p => p.v1);
      }
    }, options);
  }

  /**
   * Rejoue l'animation complète (Tversky 2002)
   */
  function replayAnimation(chart, options = {}) {
    if (!chart || !chart.data) return;
    const dur = isReducedMotionPreferred() ? 0 : (options.duration || getAnimationDuration(chart.data.labels ? chart.data.labels.length : 8));
    if (chart.options && chart.options.animation) {
      chart.options.animation.duration = dur;
      chart.options.animation.easing = options.easing || 'easeOutCubic';
    }
    chart.update();
  }

  return {
    createChart: createChart,
    createAnimationDemo: createChart,
    triggerStagedTransition: triggerStagedTransition,
    triggerAntiChangeBlindness: triggerAntiChangeBlindness,
    triggerAlertPulse: triggerAlertPulse,
    triggerZoomDrilldown: triggerZoomDrilldown,
    triggerMotStagger: triggerMotStagger,
    triggerAnticipationSort: triggerAnticipationSort,
    replayAnimation: replayAnimation,
    animateStagedUpdate: animateStagedUpdate,
    attachPulseAlert: attachPulseAlert,
    kcPulsePlugin: kcPulsePlugin,
    animateZoomDrilldown: animateZoomDrilldown,
    computeEventSegmentation: computeEventSegmentation,
    createNarrativeScenePlayer: createNarrativeScenePlayer,
    animateWithAnticipation: animateWithAnticipation,
    createAnimationTicker: createAnimationTicker,
    animatePathDrawing: animatePathDrawing,
    animateCountUp: animateCountUp,
    animateFocusContext: animateFocusContext,
    animateBarChartRace: animateBarChartRace,
    animatePanCamera: animatePanCamera,
    animateCrossTypeMorph: animateCrossTypeMorph,
    animateAxisRescale: animateAxisRescale,
    animateMotionTrails: animateMotionTrails,
    animateSeriesBuildup: animateSeriesBuildup,
    initScrollytelling: initScrollytelling,
    animateCriticalDamping: animateCriticalDamping,
    kcDeltaFlashPlugin: kcDeltaFlashPlugin,
    attachDeltaFlash: attachDeltaFlash,
    getStaggerDelay: getStaggerDelay,
    getAnimationDuration: getAnimationDuration,
    DEFAULT_DATA: DEFAULT_DATA,
    NARRATIVE_DATA: NARRATIVE_DATA
  };
});
