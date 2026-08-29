/**
 * @file template/animation/07-event-segmentation/template.js
 * @description Segmentation Événementielle Narrative (Zacks & Tversky (2001), Hullman et al. (2011)) — kit-charts
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
    global.KitCharts["anim-07-event-segmentation"] = exp;
    global.KitCharts["anim-event-segmentation"] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.NARRATIVE_DATA = exp.NARRATIVE_DATA;
    global.createNarrativeScenePlayer = exp.createNarrativeScenePlayer;
    global.computeEventSegmentation = exp.computeEventSegmentation;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  "use strict";

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || function() { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || function() { return "#2B8CBE"; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || function(c) { return c; };
  const computeEventSegmentation = (KitChartsTheme && KitChartsTheme.computeEventSegmentation) || function() { return [0]; };
  const createNarrativeScenePlayer = (KitChartsTheme && KitChartsTheme.createNarrativeScenePlayer) || function() { return {}; };

  const NARRATIVE_DATA = {
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
    scenes: [
      {
        id: "scene-1",
        title: "Phase 1 : Diagnostic Initial",
        description: "Disparités pré-optimisation entre les différents pôles opérationnels.",
        data: [65, 72, 58, 60, 50, 68, 74, 62]
      },
      {
        id: "scene-2",
        title: "Phase 2 : Restructuration Cloud & Infra",
        description: "Bond d'efficacité majeur sur l'Ingénierie et la Production (+25%).",
        data: [78, 94, 82, 64, 52, 70, 78, 66]
      },
      {
        id: "scene-3",
        title: "Phase 3 : Automatisation & IA",
        description: "Montée en puissance générale du Service Client et du Marketing.",
        data: [88, 94, 76, 82, 69, 85, 91, 78]
      },
      {
        id: "scene-4",
        title: "Phase 4 : Performance Cible 2026",
        description: "Harmonisation globale supérieure au benchmark sectoriel.",
        data: [92, 98, 88, 90, 84, 91, 95, 87]
      }
    ]
  };

  const DEFAULT_DATA = {
    labels: NARRATIVE_DATA.labels,
    datasets: [
      {
        label: NARRATIVE_DATA.scenes[0].title,
        data: [...NARRATIVE_DATA.scenes[0].data]
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

  return {
    createChart: createChart,
    createNarrativeScenePlayer: createNarrativeScenePlayer,
    computeEventSegmentation: computeEventSegmentation,
    DEFAULT_DATA: DEFAULT_DATA,
    NARRATIVE_DATA: NARRATIVE_DATA
  };
});
