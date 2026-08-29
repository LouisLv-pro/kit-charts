/**
 * @file template/animation/03-preattentive-pulse/template.js
 * @description Alerte Préattentive Auto-Extinguible (Bartram et al. (2003), Healey & Enns (2012)) — kit-charts
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
    global.KitCharts["anim-03-preattentive-pulse"] = exp;
    global.KitCharts["anim-preattentive-pulse"] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.playTransition = exp.playTransition;
    global.triggerAlertPulse = exp.triggerAlertPulse;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  "use strict";

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || function() { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || function() { return "#2B8CBE"; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || function(c) { return c; };
  const kcPulsePlugin = (KitChartsTheme && KitChartsTheme.kcPulsePlugin) || { id: "kcPulse" };
  const attachPulseAlert = (KitChartsTheme && KitChartsTheme.attachPulseAlert) || function() { return { stop: () => {} }; };

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
        label: "Score Opérationnel (Seuil Alerte = 88%)",
        data: [88, 94, 76, 82, 69, 85, 91, 78]
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
        options: chartOptions,
        plugins: [kcPulsePlugin]
      });
    }
    return null;
  }

  function playTransition(chart, options = {}) {
    return attachPulseAlert(chart, {
      threshold: 88,
      amplitude: 0.09,
      frequency: 2,
      tau: 1.2,
      color: "#D95F02",
      ...options
    });
  }

  return {
    createChart: createChart,
    playTransition: playTransition,
    triggerAlertPulse: playTransition,
    attachPulseAlert: attachPulseAlert,
    kcPulsePlugin: kcPulsePlugin,
    DEFAULT_DATA: DEFAULT_DATA
  };
});
