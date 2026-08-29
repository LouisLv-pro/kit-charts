/**
 * @file template/animation/09-path-drawing/template.js
 * @description Révélation Progressive de Tracé (Line Reveal) (Tversky et al. (2002), Heer & Robertson (2007)) — kit-charts
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
    global.KitCharts["anim-09-path-drawing"] = exp;
    global.KitCharts["anim-path-drawing"] = exp;
    global.KitCharts["09-path-drawing"] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.ALT_DATA = exp.ALT_DATA;
    global.playTransition = exp.playTransition;
    global.triggerPathReveal = exp.triggerPathReveal;
    global.animatePathDrawing = exp.animatePathDrawing;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  "use strict";

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || function() { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || function() { return "#2B8CBE"; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || function(c) { return c; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || function() { return false; };
  const animatePathDrawing = (KitChartsTheme && KitChartsTheme.animatePathDrawing) || function(chart, options) {
    if (chart && chart.update) chart.update();
    if (options && options.onComplete) options.onComplete();
    return { stop: function() {} };
  };

  const DEFAULT_DATA = {
    labels: [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Juin",
      "Juil",
      "Août",
      "Sep",
      "Oct",
      "Nov",
      "Déc"
    ],
    datasets: [
      {
        label: "Trajectoire Réalisée 2026",
        data: [42, 48, 55, 62, 59, 71, 78, 85, 92, 89, 96, 104]
      },
      {
        label: "Objectif Prévisionnel",
        data: [40, 45, 52, 58, 65, 70, 76, 82, 88, 94, 100, 106],
        type: "line",
        borderDash: [5, 5],
        borderWidth: 2,
        pointRadius: 3
      }
    ]
  };

  const ALT_DATA = {
    labels: [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Juin",
      "Juil",
      "Août",
      "Sep",
      "Oct",
      "Nov",
      "Déc"
    ],
    datasets: [
      {
        label: "Scénario Accéléré 2026",
        data: [35, 42, 50, 68, 74, 82, 88, 95, 91, 98, 105, 114]
      },
      {
        label: "Benchmark Sectoriel",
        data: [38, 44, 49, 56, 62, 68, 74, 80, 85, 90, 95, 100],
        type: "line",
        borderDash: [4, 4],
        borderWidth: 2,
        pointRadius: 3
      }
    ]
  };

  function createChart(canvas, customData = null, themeName = "colorbrewer-accessible", options = {}) {
    if (!canvas) return null;
    const tokens = getThemeTokens(themeName);
    const data = customData || JSON.parse(JSON.stringify(DEFAULT_DATA));
    const baseOptions = getChartDefaultOptions(tokens);
    const lineColor = getColor(tokens, 0);
    const targetColor = (tokens.emphasis && tokens.emphasis.benchmark) || getColor(tokens, 1);

    const datasets = (data.datasets || []).map((ds, idx) => {
      const copy = { ...ds };
      copy.type = "line";
      if (idx === 0) {
        copy.borderColor = lineColor;
        copy.backgroundColor = hexToRgba(lineColor, 0.15);
        copy.borderWidth = 3;
        copy.pointBackgroundColor = lineColor;
        copy.pointBorderColor = tokens.surface || "#FFFFFF";
        copy.pointBorderWidth = 1.5;
        copy.pointRadius = 4;
        copy.pointHoverRadius = 6;
        copy.tension = 0.3;
        copy.fill = false;
      } else {
        copy.borderColor = targetColor;
        copy.backgroundColor = "transparent";
        copy.borderWidth = copy.borderWidth || 2;
        copy.borderDash = copy.borderDash || [5, 5];
        copy.pointBackgroundColor = targetColor;
        copy.pointRadius = copy.pointRadius || 3;
        copy.tension = 0.2;
        copy.fill = false;
      }
      return copy;
    });

    const dur = options.reducedMotion ? 0 : (options.duration !== undefined ? options.duration : 600);

    const chartOptions = {
      ...baseOptions,
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: dur,
        easing: "easeOutCubic"
      },
      interaction: {
        mode: "index",
        intersect: false
      },
      plugins: {
        ...baseOptions.plugins,
        legend: {
          display: true,
          position: "top",
          align: "end",
          labels: {
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8
          }
        },
        tooltip: {
          ...baseOptions.plugins?.tooltip,
          mode: "index",
          intersect: false
        }
      },
      scales: {
        x: {
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          grid: { color: tokens.gridColor || "rgba(15, 23, 42, 0.06)" },
          ticks: { callback: (v) => v + " pts" }
        }
      }
    };

    if (typeof Chart !== "undefined") {
      const chartInstance = new Chart(canvas, {
        type: "line",
        data: { labels: data.labels, datasets: datasets },
        options: chartOptions
      });

      // Stocker les données complètes initiales pour la révélation de tracé
      chartInstance._fullDatasetBackup = (data.datasets || []).map(ds => ({
        data: [...(ds.data || [])],
        borderColor: ds.borderColor,
        backgroundColor: ds.backgroundColor
      }));

      return chartInstance;
    }
    return null;
  }

  function playTransition(chart, options = {}) {
    return animatePathDrawing(chart, {
      duration: options.duration !== undefined ? options.duration : 2200,
      reducedMotion: options.reducedMotion,
      ...options
    });
  }

  return {
    createChart: createChart,
    playTransition: playTransition,
    triggerPathReveal: playTransition,
    animatePathDrawing: animatePathDrawing,
    DEFAULT_DATA: DEFAULT_DATA,
    ALT_DATA: ALT_DATA
  };
});
