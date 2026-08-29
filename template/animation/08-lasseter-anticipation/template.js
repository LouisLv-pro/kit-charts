/**
 * @file template/animation/08-lasseter-anticipation/template.js
 * @description Anticipation Traditionnelle (Micro-Recul) (Lasseter (SIGGRAPH 1987)) — kit-charts
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
    global.KitCharts["anim-08-lasseter-anticipation"] = exp;
    global.KitCharts["anim-lasseter-anticipation"] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.playTransition = exp.playTransition;
    global.triggerAnticipationSort = exp.triggerAnticipationSort;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  "use strict";

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || function() { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || function() { return "#2B8CBE"; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || function(c) { return c; };
  const animateWithAnticipation = (KitChartsTheme && KitChartsTheme.animateWithAnticipation) || function(c, fn) { if (fn) fn(c); if (c && c.update) c.update(); return Promise.resolve(); };

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
        label: "Score d'Efficacité 2026",
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
        options: chartOptions
      });
    }
    return null;
  }

  function playTransition(chart, sortDirection = "desc", options = {}) {
    return animateWithAnticipation(chart, (c) => {
      const labels = [...c.data.labels];
      const data0 = [...c.data.datasets[0].data];

      const pairs = labels.map((l, i) => ({
        label: l,
        v0: data0[i]
      }));

      if (sortDirection === "desc") {
        pairs.sort((a, b) => b.v0 - a.v0);
      } else if (sortDirection === "asc") {
        pairs.sort((a, b) => a.v0 - b.v0);
      } else {
        pairs.sort(() => Math.random() - 0.5);
      }

      c.data.labels = pairs.map(p => p.label);
      c.data.datasets[0].data = pairs.map(p => p.v0);
    }, {
      recoilMs: 60,
      ...options
    });
  }

  return {
    createChart: createChart,
    playTransition: playTransition,
    triggerAnticipationSort: playTransition,
    animateWithAnticipation: animateWithAnticipation,
    DEFAULT_DATA: DEFAULT_DATA
  };
});
