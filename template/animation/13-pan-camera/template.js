/**
 * @file template/animation/13-pan-camera/template.js
 * @description Panoramique Caméra / Pan Overview+Detail (Shneiderman (1996), Plumlee & Ware (2006)) — kit-charts
 */
(function(global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory(require("../../../themes/theme-tokens.js"));
  } else if (typeof define === 'function' && define.amd) {
    define(["../../../themes/theme-tokens.js"], factory);
  } else {
    global = typeof globalThis !== "undefined" ? globalThis : global || self;
    var tokens = global.KitChartsTheme || (global.KitCharts && global.KitCharts.Theme) || {};
    var exp = factory(tokens);
    global.KitCharts = global.KitCharts || {};
    global.KitCharts["anim-13-pan-camera"] = exp;
    global.KitCharts["anim-pan-camera"] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.playTransition = exp.playTransition;
    global.animatePanCamera = exp.animatePanCamera;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  "use strict";

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || function() { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || function() { return "#2B8CBE"; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || function(c) { return c; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || function() { return false; };
  const animatePanCamera = (KitChartsTheme && KitChartsTheme.animatePanCamera) || function(chart, targetRange, options = {}) {
    if (!chart || !chart.options || !chart.options.scales || !chart.options.scales.x) {
      if (options.onComplete) options.onComplete();
      return { stop: () => {} };
    }
    chart.options.scales.x.min = targetRange.min;
    chart.options.scales.x.max = targetRange.max;
    chart.update('none');
    if (options.onComplete) options.onComplete();
    return { stop: () => {} };
  };

  /**
   * Données de série temporelle étendue sur 24 heures (N=24)
   * Débit de requêtes et charge système en temps réel
   */
  const DEFAULT_DATA = {
    labels: [
      "00:00", "01:00", "02:00", "03:00", "04:00", "05:00",
      "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
      "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
      "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
    ],
    datasets: [
      {
        label: "Débit Principal (k req/s)",
        data: [
          42, 38, 29, 25, 27, 34,
          58, 85, 120, 142, 155, 160,
          148, 158, 162, 170, 165, 152,
          138, 118, 98, 82, 65, 50
        ]
      },
      {
        label: "Capacité Nominale Allouée",
        data: [
          100, 100, 100, 100, 100, 100,
          180, 180, 180, 180, 180, 180,
          180, 180, 180, 180, 180, 180,
          180, 140, 140, 140, 100, 100
        ],
        type: "line",
        borderDash: [5, 5],
        borderWidth: 1.5,
        pointRadius: 0
      }
    ]
  };

  /**
   * Crée l'instance Chart.js avec configuration d'axe x borné
   */
  function createChart(canvas, customData = null, themeName = "colorbrewer-accessible", options = {}) {
    if (!canvas) return null;
    const tokens = getThemeTokens(themeName);
    const data = customData || JSON.parse(JSON.stringify(DEFAULT_DATA));
    const baseOptions = getChartDefaultOptions(tokens);
    const primaryColor = getColor(tokens, 0);
    const benchmarkColor = getColor(tokens, 1);

    const datasets = (data.datasets || []).map((ds, idx) => {
      const copy = { ...ds };
      if (ds.type === "line" || idx === 1) {
        copy.type = "line";
        copy.borderColor = benchmarkColor;
        copy.backgroundColor = benchmarkColor;
        copy.borderWidth = 2;
        copy.pointRadius = 0;
      } else {
        copy.type = "bar";
        copy.backgroundColor = hexToRgba(primaryColor, 0.85);
        copy.borderColor = primaryColor;
        copy.borderWidth = 1.5;
        copy.borderRadius = 4;
      }
      return copy;
    });

    const initMin = options.initialMin !== undefined ? options.initialMin : 0;
    const initMax = options.initialMax !== undefined ? options.initialMax : 7;

    const chartOptions = {
      ...baseOptions,
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: {
        ...baseOptions.plugins,
        legend: { display: true, position: "top", align: "end" }
      },
      scales: {
        x: {
          min: initMin,
          max: initMax,
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          max: 200,
          ticks: { callback: (v) => v + "k" }
        }
      }
    };

    if (typeof Chart !== "undefined") {
      return new Chart(canvas, {
        type: "bar",
        data: { labels: data.labels, datasets: datasets },
        options: chartOptions
      });
    }
    return null;
  }

  /**
   * Déclenche un déplacement caméra fluide vers un sous-intervalle temporel
   */
  function playTransition(chart, targetRange = { min: 8, max: 15 }, options = {}) {
    return animatePanCamera(chart, targetRange, {
      duration: options.duration,
      reducedMotion: options.reducedMotion,
      ...options
    });
  }

  return {
    createChart: createChart,
    playTransition: playTransition,
    animatePanCamera: animatePanCamera,
    DEFAULT_DATA: DEFAULT_DATA
  };
});
