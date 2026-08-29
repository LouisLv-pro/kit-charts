/**
 * @file template/animation/12-bar-chart-race/template.js
 * @description Course de Barres Classée / Bar Chart Race / Rank Morphing (Robertson et al. (CHI 2008), Heer & Robertson (2007)) — kit-charts
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
    global.KitCharts["anim-12-bar-chart-race"] = exp;
    global.KitCharts["anim-bar-chart-race"] = exp;
    global.KitCharts["12-bar-chart-race"] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.FRAMES_DATA = exp.FRAMES_DATA;
    global.playTransition = exp.playTransition;
    global.triggerRace = exp.triggerRace;
    global.animateBarChartRace = exp.animateBarChartRace;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  "use strict";

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || function() { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || function() { return "#2B8CBE"; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || function(c) { return c; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || function() { return false; };
  const animateBarChartRace = (KitChartsTheme && KitChartsTheme.animateBarChartRace) || function(chart, frames, options) {
    return {
      play: function() {},
      pause: function() {},
      next: function() {},
      prev: function() {},
      goToFrame: function() {},
      getCurrentIndex: function() { return 0; },
      isPlaying: function() { return false; }
    };
  };

  const FRAMES_DATA = [
    {
      year: "2022",
      label: "Année 2022 : Phase d'Amorçage",
      data: [
        { name: "Plateforme Alpha", value: 85, color: "#2B8CBE" },
        { name: "Plateforme Beta", value: 78, color: "#E66101" },
        { name: "Plateforme Gamma", value: 65, color: "#5E3C99" },
        { name: "Plateforme Delta", value: 52, color: "#4DAC26" },
        { name: "Plateforme Epsilon", value: 44, color: "#D01C8B" },
        { name: "Plateforme Zeta", value: 38, color: "#FDB863" }
      ]
    },
    {
      year: "2023",
      label: "Année 2023 : Montée en Puissance",
      data: [
        { name: "Plateforme Beta", value: 92, color: "#E66101" },
        { name: "Plateforme Alpha", value: 89, color: "#2B8CBE" },
        { name: "Plateforme Gamma", value: 76, color: "#5E3C99" },
        { name: "Plateforme Delta", value: 68, color: "#4DAC26" },
        { name: "Plateforme Zeta", value: 58, color: "#FDB863" },
        { name: "Plateforme Epsilon", value: 50, color: "#D01C8B" }
      ]
    },
    {
      year: "2024",
      label: "Année 2024 : Pivot Technologique",
      data: [
        { name: "Plateforme Beta", value: 108, color: "#E66101" },
        { name: "Plateforme Gamma", value: 102, color: "#5E3C99" },
        { name: "Plateforme Alpha", value: 95, color: "#2B8CBE" },
        { name: "Plateforme Delta", value: 84, color: "#4DAC26" },
        { name: "Plateforme Zeta", value: 79, color: "#FDB863" },
        { name: "Plateforme Epsilon", value: 61, color: "#D01C8B" }
      ]
    },
    {
      year: "2025",
      label: "Année 2025 : Expansion Internationale",
      data: [
        { name: "Plateforme Gamma", value: 126, color: "#5E3C99" },
        { name: "Plateforme Beta", value: 120, color: "#E66101" },
        { name: "Plateforme Delta", value: 110, color: "#4DAC26" },
        { name: "Plateforme Alpha", value: 104, color: "#2B8CBE" },
        { name: "Plateforme Zeta", value: 96, color: "#FDB863" },
        { name: "Plateforme Epsilon", value: 75, color: "#D01C8B" }
      ]
    },
    {
      year: "2026",
      label: "Année 2026 : Maturité de Marché",
      data: [
        { name: "Plateforme Gamma", value: 148, color: "#5E3C99" },
        { name: "Plateforme Delta", value: 139, color: "#4DAC26" },
        { name: "Plateforme Beta", value: 132, color: "#E66101" },
        { name: "Plateforme Zeta", value: 121, color: "#FDB863" },
        { name: "Plateforme Alpha", value: 114, color: "#2B8CBE" },
        { name: "Plateforme Epsilon", value: 92, color: "#D01C8B" }
      ]
    }
  ];

  const DEFAULT_DATA = {
    frames: FRAMES_DATA,
    labels: FRAMES_DATA[0].data.map(d => d.name),
    datasets: [
      {
        label: "Part de Marché / Indice d'Adoption",
        data: FRAMES_DATA[0].data.map(d => d.value),
        backgroundColor: FRAMES_DATA[0].data.map(d => d.color)
      }
    ]
  };

  function createChart(canvas, customData = null, themeName = "colorbrewer-accessible", options = {}) {
    if (!canvas) return null;
    const tokens = getThemeTokens(themeName);
    const frames = (customData && customData.frames) || FRAMES_DATA;
    const initialFrame = frames[0];
    const sorted = [...initialFrame.data].sort((a, b) => b.value - a.value).slice(0, 6);
    const palette = tokens.palette || ["#2B8CBE", "#E66101", "#5E3C99", "#4DAC26", "#D01C8B", "#FDB863"];

    // Appliquer la palette de couleurs du thème actif aux entités fixes
    const entityColorMap = {};
    sorted.forEach((item, i) => {
      entityColorMap[item.name] = palette[i % palette.length];
    });

    frames.forEach(f => {
      f.data.forEach(item => {
        if (!entityColorMap[item.name]) {
          entityColorMap[item.name] = palette[Object.keys(entityColorMap).length % palette.length];
        }
        item.color = entityColorMap[item.name];
      });
    });

    const baseOptions = getChartDefaultOptions(tokens);
    const dur = options.reducedMotion ? 0 : (options.stepDuration || 600);

    const chartOptions = {
      ...baseOptions,
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: dur,
        easing: "easeInOutCubic"
      },
      plugins: {
        ...baseOptions.plugins,
        legend: {
          display: false
        },
        tooltip: {
          ...baseOptions.plugins?.tooltip
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 160,
          grid: { color: tokens.gridColor || "rgba(15, 23, 42, 0.06)" },
          ticks: { callback: (v) => v + " pts" }
        },
        y: {
          grid: { display: false }
        }
      }
    };

    if (typeof Chart !== "undefined") {
      return new Chart(canvas, {
        type: "bar",
        data: {
          labels: sorted.map(d => d.name),
          datasets: [
            {
              label: "Indice d'Adoption",
              data: sorted.map(d => d.value),
              backgroundColor: sorted.map(d => d.color),
              borderColor: sorted.map(d => d.color),
              borderWidth: 1.5,
              borderRadius: 4
            }
          ]
        },
        options: chartOptions
      });
    }
    return null;
  }

  function playTransition(chart, frames = null, options = {}) {
    const activeFrames = frames || FRAMES_DATA;
    return animateBarChartRace(chart, activeFrames, {
      stepDuration: options.stepDuration || 600,
      pauseMs: options.pauseMs || 500,
      reducedMotion: options.reducedMotion,
      ...options
    });
  }

  return {
    createChart: createChart,
    playTransition: playTransition,
    triggerRace: playTransition,
    animateBarChartRace: animateBarChartRace,
    DEFAULT_DATA: DEFAULT_DATA,
    FRAMES_DATA: FRAMES_DATA
  };
});
