/**
 * @file template/animation/11-focus-context/template.js
 * @description Focus + Context / Dimming des Éléments Non-Sélectionnés (Pirolli & Card (1999), Furnas (1986), Treisman (1988)) — kit-charts
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
    global.KitCharts["anim-11-focus-context"] = exp;
    global.KitCharts["anim-focus-context"] = exp;
    global.KitCharts["11-focus-context"] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.ALT_DATA = exp.ALT_DATA;
    global.playTransition = exp.playTransition;
    global.triggerFocus = exp.triggerFocus;
    global.clearFocus = exp.clearFocus;
    global.animateFocusContext = exp.animateFocusContext;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  "use strict";

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || function() { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || function() { return "#2B8CBE"; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || function(c) { return c; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || function() { return false; };
  const animateFocusContext = (KitChartsTheme && KitChartsTheme.animateFocusContext) || function(chart, selectedIndices, options) {
    if (!chart || !chart.data || !chart.data.datasets) {
      if (options && options.onComplete) options.onComplete();
      return { stop: function() {} };
    }
    const dimAlpha = options && options.dimAlpha !== undefined ? options.dimAlpha : 0.25;
    const isSelected = (idx, dsIdx) => {
      if (selectedIndices === null || selectedIndices === undefined) return true;
      if (typeof selectedIndices === "function") return selectedIndices(idx, dsIdx);
      if (Array.isArray(selectedIndices)) return selectedIndices.includes(idx) || selectedIndices.includes(dsIdx);
      return selectedIndices === idx || selectedIndices === dsIdx;
    };

    chart.data.datasets.forEach((ds, dsIdx) => {
      if (!ds._kcOriginalBg) {
        ds._kcOriginalBg = ds.backgroundColor;
        ds._kcOriginalBorder = ds.borderColor;
      }
      if (Array.isArray(ds._kcOriginalBg)) {
        ds.backgroundColor = ds._kcOriginalBg.map((c, i) =>
          isSelected(i, dsIdx) ? c : hexToRgba(c, dimAlpha)
        );
        if (Array.isArray(ds._kcOriginalBorder)) {
          ds.borderColor = ds._kcOriginalBorder.map((c, i) =>
            isSelected(i, dsIdx) ? c : hexToRgba(c, Math.min(1, dimAlpha + 0.1))
          );
        }
      } else {
        const active = isSelected(dsIdx, dsIdx);
        ds.backgroundColor = active ? ds._kcOriginalBg : hexToRgba(ds._kcOriginalBg, dimAlpha);
        ds.borderColor = active ? ds._kcOriginalBorder : hexToRgba(ds._kcOriginalBorder, Math.min(1, dimAlpha + 0.1));
      }
    });

    chart.update("none");
    if (options && typeof options.onComplete === "function") options.onComplete();
    return { stop: function() {} };
  };

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
        label: "Score de Performance Opérationnelle",
        data: [86, 94, 78, 91, 72, 68, 83, 89]
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
        label: "Taux de Réalisation Cible Q4",
        data: [92, 98, 84, 88, 79, 85, 95, 90]
      }
    ]
  };

  function createChart(canvas, customData = null, themeName = "colorbrewer-accessible", options = {}) {
    if (!canvas) return null;
    const tokens = getThemeTokens(themeName);
    const data = customData || JSON.parse(JSON.stringify(DEFAULT_DATA));
    const baseOptions = getChartDefaultOptions(tokens);
    const palette = tokens.palette || ["#2B8CBE", "#E66101", "#5E3C99", "#4DAC26", "#D01C8B", "#FDB863", "#B8E186", "#999999"];

    const datasets = (data.datasets || []).map((ds) => {
      const copy = { ...ds };
      copy.type = "bar";
      const colors = (copy.data || []).map((_, i) => palette[i % palette.length]);
      copy.backgroundColor = colors;
      copy.borderColor = colors;
      copy.borderWidth = 1.5;
      copy.borderRadius = 4;
      copy._kcOriginalBg = [...colors];
      copy._kcOriginalBorder = [...colors];
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
        legend: {
          display: true,
          position: "top",
          align: "end"
        },
        tooltip: {
          ...baseOptions.plugins?.tooltip
        }
      },
      onClick: (e, elements, chart) => {
        if (elements && elements.length > 0) {
          const index = elements[0].index;
          animateFocusContext(chart, [index], {
            dimAlpha: 0.25,
            duration: isReducedMotionPreferred() || options.reducedMotion ? 0 : 140
          });
        } else {
          animateFocusContext(chart, null);
        }
      },
      scales: {
        x: {
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          max: 100,
          grid: { color: tokens.gridColor || "rgba(15, 23, 42, 0.06)" },
          ticks: { callback: (v) => v + " pts" }
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

  function playTransition(chart, selectedIndices, options = {}) {
    return animateFocusContext(chart, selectedIndices, {
      dimAlpha: options.dimAlpha !== undefined ? options.dimAlpha : 0.25,
      duration: options.duration !== undefined ? options.duration : 140,
      reducedMotion: options.reducedMotion,
      ...options
    });
  }

  function triggerFocus(chart, selectedIndices, options = {}) {
    return playTransition(chart, selectedIndices, options);
  }

  function clearFocus(chart) {
    return playTransition(chart, null);
  }

  return {
    createChart: createChart,
    playTransition: playTransition,
    triggerFocus: triggerFocus,
    clearFocus: clearFocus,
    animateFocusContext: animateFocusContext,
    DEFAULT_DATA: DEFAULT_DATA,
    ALT_DATA: ALT_DATA
  };
});
