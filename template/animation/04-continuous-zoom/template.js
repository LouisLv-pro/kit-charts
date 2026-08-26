/**
 * @file template/animation/04-continuous-zoom/template.js
 * @description Zoom & Drill-down Continu Pad++ (Bederson & Hollan (1994, Pad++), Furnas (1986)) — kit-charts
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
    global.KitCharts["anim-continuous-zoom"] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  "use strict";

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || function() { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || function() { return "#2B8CBE"; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || function(c) { return c; };
  const getStaggerDelay = (KitChartsTheme && KitChartsTheme.getStaggerDelay) || function() { return 0; };
  const kcPulsePlugin = (KitChartsTheme && KitChartsTheme.kcPulsePlugin) || { id: "kcPulse" };

  const DEFAULT_DATA = {
  "labels": [
    "Recherche & Dév.",
    "Ingénierie Logicielle",
    "Production & Infra",
    "Marketing Digital",
    "Service Client",
    "Ressources Humaines",
    "Finance & Audit",
    "Logistique"
  ],
  "datasets": [
    {
      "label": "Score (%)",
      "data": [
        88,
        94,
        76,
        82,
        69,
        85,
        91,
        78
      ]
    }
  ]
};

  function createChart(canvas, customData = null, themeName = "colorbrewer-accessible", options = {}) {
    if (!canvas) return null;
    const tokens = getThemeTokens(themeName);
    const data = customData || JSON.parse(JSON.stringify(DEFAULT_DATA));
    const baseOptions = getChartDefaultOptions(tokens);
    const barColor = getColor(tokens, 0);
    const lineColor = getColor(tokens, 1);

    const datasets = (data.datasets || []).map((ds, idx) => {
      const copy = { ...ds };
      if (ds.type === "line" || idx === 1) {
        copy.type = "line";
        copy.borderColor = lineColor;
        copy.backgroundColor = lineColor;
      } else {
        copy.type = "bar";
        copy.backgroundColor = hexToRgba(barColor, 0.85);
        copy.borderColor = barColor;
        copy.borderWidth = 1.5;
        copy.borderRadius = 4;
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
        easing: "easeOutCubic",
        delay: (ctx) => {
          if (dur === 0) return 0;
          return getStaggerDelay(ctx, { unitMs: 300, overlapCap: 4, duration: dur });
        }
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

  return {
    createChart: createChart,
    DEFAULT_DATA: DEFAULT_DATA
  };
});
