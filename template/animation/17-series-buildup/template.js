/**
 * @file template/animation/17-series-buildup/template.js
 * @description Construction sérielle narrative / Series Build-up (Miller (1956) / Hullman et al. (2013)) — kit-charts
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
    global.KitCharts["anim-17-series-buildup"] = exp;
    global.KitCharts["anim-series-buildup"] = exp;
    global.KitCharts["17-series-buildup"] = exp;
    global.KitCharts["series-buildup"] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.playTransition = exp.playTransition;
    global.triggerSeriesBuildup = exp.triggerSeriesBuildup;
    global.animateSeriesBuildup = exp.animateSeriesBuildup;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  "use strict";

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || function() { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || function(t, i) { return ["#2B8CBE", "#E66101", "#5E3C99", "#4DAC26"][i % 4]; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || function(c, a) { return c; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || function() { return false; };
  const createAnimationTicker = (KitChartsTheme && KitChartsTheme.createAnimationTicker) || function(o) { return { stop: () => {} }; };

  /**
   * B9 (17): Données multi-séries pour démonstration de construction cumulative (Miller 1956 / Hullman 2013)
   */
  const DEFAULT_DATA = {
    labels: [
      "Q1-2025",
      "Q2-2025",
      "Q3-2025",
      "Q4-2025",
      "Q1-2026",
      "Q2-2026",
      "Q3-2026",
      "Q4-2026"
    ],
    datasets: [
      {
        label: "Europe - Nord",
        data: [42, 48, 55, 63, 68, 74, 82, 89]
      },
      {
        label: "Europe - Sud",
        data: [35, 39, 44, 50, 57, 62, 70, 76]
      },
      {
        label: "Amérique du Nord",
        data: [50, 56, 62, 71, 79, 85, 91, 98]
      },
      {
        label: "Asie - Pacifique",
        data: [28, 34, 41, 49, 58, 66, 75, 84]
      }
    ]
  };

  /**
   * Construction cumulative séquentielle par série (Miller 1956 / Hullman 2013).
   * Cumulative gate: série j visible <=> t > j * Ts, Ts >= 800ms, fadeInMs <= 300ms (250ms), j_max <= 4.
   *
   * @param {Object} chart Instance Chart.js
   * @param {Object} [options={}] Options { stepDuration: 900, fadeInMs: 250, onStep, onComplete, reducedMotion }
   * @returns {Object} Handle de contrôle { stop: Function }
   */
  function animateSeriesBuildup(chart, options = {}) {
    if (KitChartsTheme && typeof KitChartsTheme.animateSeriesBuildup === "function") {
      return KitChartsTheme.animateSeriesBuildup(chart, options);
    }

    if (!chart || !chart.data || !chart.data.datasets) {
      if (typeof options.onComplete === "function") options.onComplete();
      return { stop: () => {} };
    }

    const datasets = chart.data.datasets;
    const numSeries = Math.min(4, datasets.length);
    const stepDur = Math.max(800, options.stepDuration || 900);
    const fadeInMs = Math.min(300, options.fadeInMs || 250);
    const totalDuration = numSeries * stepDur;

    const savedColors = datasets.map(ds => ({
      borderColor: ds.borderColor,
      backgroundColor: ds.backgroundColor,
      pointBackgroundColor: ds.pointBackgroundColor,
      pointBorderColor: ds.pointBorderColor
    }));

    if (isReducedMotionPreferred() || options.reducedMotion || totalDuration === 0) {
      datasets.forEach((ds, i) => {
        ds.borderColor = savedColors[i].borderColor;
        ds.backgroundColor = savedColors[i].backgroundColor;
        ds.pointBackgroundColor = savedColors[i].pointBackgroundColor;
        ds.pointBorderColor = savedColors[i].pointBorderColor;
      });
      chart.update("none");
      if (typeof options.onComplete === "function") options.onComplete();
      return { stop: () => {} };
    }

    return createAnimationTicker({
      duration: totalDuration,
      easing: "linear",
      reducedMotion: options.reducedMotion,
      onFrame: (easedU, elapsedMs) => {
        datasets.forEach((ds, j) => {
          const startTime = j * stepDur;
          if (elapsedMs < startTime) {
            ds.borderColor = "rgba(0,0,0,0)";
            ds.backgroundColor = "rgba(0,0,0,0)";
            ds.pointBackgroundColor = "rgba(0,0,0,0)";
            ds.pointBorderColor = "rgba(0,0,0,0)";
          } else {
            const fadeProgress = Math.min(1, (elapsedMs - startTime) / fadeInMs);
            const alpha = 1 - Math.pow(1 - fadeProgress, 2); // easeOutQuad
            ds.borderColor = hexToRgba(savedColors[j].borderColor, alpha);
            ds.backgroundColor = hexToRgba(savedColors[j].backgroundColor, alpha * 0.15);
            ds.pointBackgroundColor = hexToRgba(savedColors[j].pointBackgroundColor || savedColors[j].borderColor, alpha);
            ds.pointBorderColor = hexToRgba(savedColors[j].pointBorderColor || "#FFFFFF", alpha);
          }
        });
        chart.update("none");
      },
      onComplete: () => {
        datasets.forEach((ds, i) => {
          ds.borderColor = savedColors[i].borderColor;
          ds.backgroundColor = savedColors[i].backgroundColor;
          ds.pointBackgroundColor = savedColors[i].pointBackgroundColor;
          ds.pointBorderColor = savedColors[i].pointBorderColor;
        });
        chart.update("none");
        if (typeof options.onComplete === "function") options.onComplete();
      }
    });
  }

  function createChart(canvas, customData = null, themeName = "colorbrewer-accessible", options = {}) {
    if (!canvas) return null;
    const tokens = getThemeTokens(themeName);
    const data = customData || JSON.parse(JSON.stringify(DEFAULT_DATA));
    const baseOptions = getChartDefaultOptions(tokens);

    const datasets = (data.datasets || []).map((ds, idx) => {
      const color = getColor(tokens, idx);
      const copy = { ...ds };
      copy.type = "line";
      copy.borderColor = color;
      copy.backgroundColor = hexToRgba(color, 0.15);
      copy.pointBackgroundColor = color;
      copy.pointBorderColor = tokens.surfaceRaised || tokens.bg || "#FFFFFF";
      copy.pointHoverBackgroundColor = color;
      copy.borderWidth = 2.5;
      copy.tension = 0.25;
      copy.fill = false;
      copy.pointRadius = 4;
      copy.pointHoverRadius = 7;
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
          align: "end",
          labels: {
            color: tokens.textSecondary || "#334155",
            font: { family: tokens.fontFamily, size: 11, weight: "500" },
            usePointStyle: true,
            boxWidth: 8
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
          grid: { display: false },
          ticks: { color: tokens.textSecondary || "#64748B", font: { family: tokens.fontFamily, size: 11 } }
        },
        y: {
          beginAtZero: true,
          max: 110,
          title: {
            display: true,
            text: "Indice de Croissance (pts)",
            color: tokens.textSecondary || "#334155",
            font: { family: tokens.fontFamily, size: 11, weight: "600" }
          },
          grid: { color: tokens.gridColor || "rgba(0,0,0,0.06)" },
          ticks: {
            color: tokens.textSecondary || "#64748B",
            font: { family: tokens.fontMono || "monospace", size: 10.5 },
            callback: (v) => `${v} pts`
          }
        }
      }
    };

    if (typeof Chart !== "undefined") {
      return new Chart(canvas, {
        type: "line",
        data: { labels: data.labels, datasets: datasets },
        options: chartOptions
      });
    }
    return null;
  }

  function playTransition(chart, options = {}) {
    return animateSeriesBuildup(chart, {
      stepDuration: options.stepDuration || 900,
      fadeInMs: options.fadeInMs || 250,
      reducedMotion: options.reducedMotion,
      ...options
    });
  }

  return {
    createChart: createChart,
    playTransition: playTransition,
    triggerSeriesBuildup: playTransition,
    animateSeriesBuildup: animateSeriesBuildup,
    DEFAULT_DATA: DEFAULT_DATA
  };
});
