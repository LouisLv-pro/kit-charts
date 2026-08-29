/**
 * @file template/animation/02-anti-change-blindness/template.js
 * @description Interpolation Anti-Change Blindness (Simons & Levin (1997), Rensink (1997)) — kit-charts
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
    global.KitCharts["anim-02-anti-change-blindness"] = exp;
    global.KitCharts["anim-anti-change-blindness"] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.ALT_DATA = exp.ALT_DATA;
    global.playTransition = exp.playTransition;
    global.triggerAntiChangeBlindness = exp.triggerAntiChangeBlindness;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  "use strict";

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || function() { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || function() { return "#2B8CBE"; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || function(c) { return c; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || function() { return false; };

  const DEFAULT_DATA = {
    labels: [
      "Recherche & Dév.",
      "Ingénierie Logicielle",
      "Production & Infra",
      "Marketing Digital",
      "Service Client",
      "Ressources Humaines",
      "Finance & Audit",
      "Logistique"
    ],
    datasets: [
      {
        label: "Score Actuel",
        data: [88, 94, 76, 82, 69, 85, 91, 78]
      }
    ]
  };

  const ALT_DATA = {
    labels: [
      "Recherche & Dév.",
      "Ingénierie Logicielle",
      "Production & Infra",
      "Marketing Digital",
      "Service Client",
      "Ressources Humaines",
      "Finance & Audit",
      "Logistique"
    ],
    datasets: [
      {
        label: "Score Actualisé (In-Place)",
        data: [92, 88, 79, 95, 84, 90, 96, 85]
      }
    ]
  };

  function createChart(canvas, customData = null, themeName = "colorbrewer-accessible", options = {}) {
    if (!canvas) return null;
    const tokens = getThemeTokens(themeName);
    const data = customData || JSON.parse(JSON.stringify(DEFAULT_DATA));
    const baseOptions = getChartDefaultOptions(tokens);
    const barColor = getColor(tokens, 0);

    const datasets = (data.datasets || []).map((ds) => {
      const copy = { ...ds };
      copy.type = "bar";
      copy.backgroundColor = hexToRgba(barColor, 0.85);
      copy.borderColor = barColor;
      copy.borderWidth = 1.5;
      copy.borderRadius = 4;
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
      plugins: {
        ...baseOptions.plugins,
        legend: { display: true, position: "top", align: "end" }
      },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, max: 100, ticks: { callback: (v) => v + "%" } }
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

  function playTransition(chart, targetData = null, options = {}) {
    if (!chart || !chart.data || !chart.data.datasets || !chart.data.datasets[0]) return;
    const next = targetData || ALT_DATA;
    const nextValues = Array.isArray(next) ? next : (next.datasets ? next.datasets[0].data : DEFAULT_DATA.datasets[0].data);
    const nextLabel = (!Array.isArray(next) && next.datasets && next.datasets[0].label) ? next.datasets[0].label : chart.data.datasets[0].label;

    chart.data.datasets[0].data = [...nextValues];
    chart.data.datasets[0].label = nextLabel;
    if (chart.options && chart.options.animation) {
      chart.options.animation.duration = options.reducedMotion ? 0 : (options.duration !== undefined ? options.duration : 600);
      chart.options.animation.easing = "easeOutCubic";
    }
    chart.update();
  }

  return {
    createChart: createChart,
    playTransition: playTransition,
    triggerAntiChangeBlindness: playTransition,
    DEFAULT_DATA: DEFAULT_DATA,
    ALT_DATA: ALT_DATA
  };
});
