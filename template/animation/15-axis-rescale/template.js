/**
 * @file template/animation/15-axis-rescale/template.js
 * @description Rescaling d'Axe Animé Linéaire <-> Logarithmique (Cleveland & McGill (1984), Tufte (1983), Heer & Robertson (2007)) — kit-charts
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
    global.KitCharts["anim-15-axis-rescale"] = exp;
    global.KitCharts["anim-axis-rescale"] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.playTransition = exp.playTransition;
    global.animateAxisRescale = exp.animateAxisRescale;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  "use strict";

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || function() { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || function() { return "#2B8CBE"; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || function(c) { return c; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || function() { return false; };
  const animateAxisRescaleHelper = (KitChartsTheme && KitChartsTheme.animateAxisRescale) || null;

  /**
   * Données en loi de puissance couvrant 5 ordres de grandeur (10^1 à 10^6)
   */
  const DEFAULT_DATA = {
    labels: [
      "Capteur IoT Local",
      "Serveur Edge",
      "Cluster Régional",
      "Datacenter National",
      "Passerelle Cloud EU",
      "Infrastructure Mondiale",
      "Réseau Global CDN"
    ],
    datasets: [
      {
        label: "Débit Réseau Traité (Req / sec)",
        data: [12, 140, 1250, 9800, 75000, 480000, 2400000]
      }
    ]
  };

  /**
   * Rescaling d'axe synchronisé Linéaire <-> Logarithmique avec interpolation continue
   * Formule : y_v(p) = (1-p)*m_lin(v) + p*m_log(v) avec p = easeInOutCubic(u)
   */
  function animateAxisRescale(chart, targetType = "logarithmic", options = {}) {
    if (animateAxisRescaleHelper) {
      return animateAxisRescaleHelper(chart, targetType, options);
    }

    if (!chart || !chart.data || !chart.data.datasets || !chart.data.datasets[0]) {
      if (options.onComplete) options.onComplete();
      return { stop: () => {} };
    }

    const duration = options.duration !== undefined ? options.duration : 600;
    const isReduced = options.reducedMotion !== undefined ? options.reducedMotion : isReducedMotionPreferred();
    const ds = chart.data.datasets[0];

    if (!chart._kcOriginalValues) {
      chart._kcOriginalValues = [...ds.data];
    }
    const rawVals = chart._kcOriginalValues;
    const minVal = Math.max(1, Math.min(...rawVals));
    const maxVal = Math.max(...rawVals);

    const mLin = (v) => (v - minVal) / (maxVal - minVal);
    const mLog = (v) => (Math.log(v) - Math.log(minVal)) / (Math.log(maxVal) - Math.log(minVal));

    const targetP = targetType === "logarithmic" ? 1 : 0;
    const initialP = chart._kcCurrentRescaleP !== undefined ? chart._kcCurrentRescaleP : (targetType === "logarithmic" ? 0 : 1);

    if (isReduced || duration === 0) {
      chart._kcCurrentRescaleP = targetP;
      ds.data = rawVals.map(v => (targetP === 1 ? mLog(v) * 100 : mLin(v) * 100));
      chart.update("none");
      if (options.onComplete) options.onComplete();
      return { stop: () => {} };
    }

    let start = null;
    let animId = null;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const u = Math.min(1, elapsed / duration);
      // easeInOutCubic
      const easedU = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
      const p = initialP + (targetP - initialP) * easedU;
      chart._kcCurrentRescaleP = p;

      ds.data = rawVals.map(v => {
        const norm = (1 - p) * mLin(v) + p * mLog(v);
        return norm * 100;
      });
      chart.update("none");

      if (u < 1) {
        animId = requestAnimationFrame(step);
      } else {
        chart._kcCurrentRescaleP = targetP;
        ds.data = rawVals.map(v => (targetP === 1 ? mLog(v) * 100 : mLin(v) * 100));
        chart.update("none");
        if (options.onComplete) options.onComplete();
      }
    };

    animId = requestAnimationFrame(step);

    return {
      stop: () => {
        if (animId) cancelAnimationFrame(animId);
      }
    };
  }

  /**
   * Crée l'instance Chart.js avec interpolation continue d'échelle et formatage dynamique
   */
  function createChart(canvas, customData = null, themeName = "colorbrewer-accessible", options = {}) {
    if (!canvas) return null;
    const tokens = getThemeTokens(themeName);
    const data = customData || JSON.parse(JSON.stringify(DEFAULT_DATA));
    const baseOptions = getChartDefaultOptions(tokens);
    const primaryColor = getColor(tokens, 0);

    const rawValues = [...(data.datasets[0]?.data || [])];
    const minVal = Math.max(1, Math.min(...rawValues));
    const maxVal = Math.max(...rawValues);

    const mLin = (v) => (v - minVal) / (maxVal - minVal);
    const mLog = (v) => (Math.log(v) - Math.log(minVal)) / (Math.log(maxVal) - Math.log(minVal));

    const initialType = options.initialScale || "linear";
    const initialP = initialType === "logarithmic" ? 1 : 0;

    const datasets = (data.datasets || []).map((ds) => {
      const copy = { ...ds };
      copy.type = "bar";
      copy.backgroundColor = hexToRgba(primaryColor, 0.85);
      copy.borderColor = primaryColor;
      copy.borderWidth = 1.5;
      copy.borderRadius = 4;
      // Normalisation 0..100
      copy.data = rawValues.map(v => (initialP === 1 ? mLog(v) * 100 : mLin(v) * 100));
      return copy;
    });

    const chartOptions = {
      ...baseOptions,
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: {
        ...baseOptions.plugins,
        legend: { display: true, position: "top", align: "end" },
        tooltip: {
          ...baseOptions.plugins?.tooltip,
          callbacks: {
            label: (ctx) => {
              const idx = ctx.dataIndex;
              const val = rawValues[idx] || 0;
              const p = ctx.chart?._kcCurrentRescaleP !== undefined ? ctx.chart._kcCurrentRescaleP : initialP;
              const mode = p > 0.5 ? "Échelle Logarithmique" : "Échelle Linéaire";
              return ` Débit Réel : ${val.toLocaleString("fr-FR")} req/s (${mode})`;
            }
          }
        }
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          beginAtZero: true,
          min: 0,
          max: 100,
          ticks: {
            stepSize: 20,
            callback: function(val) {
              const p = this.chart?._kcCurrentRescaleP !== undefined ? this.chart._kcCurrentRescaleP : initialP;
              if (p >= 0.95) {
                // Log ticks
                const logVal = Math.exp(Math.log(minVal) + (val / 100) * (Math.log(maxVal) - Math.log(minVal)));
                if (logVal >= 1000000) return (logVal / 1000000).toFixed(1) + "M";
                if (logVal >= 1000) return (logVal / 1000).toFixed(0) + "k";
                return Math.round(logVal).toString();
              } else if (p <= 0.05) {
                // Lin ticks
                const linVal = minVal + (val / 100) * (maxVal - minVal);
                if (linVal >= 1000000) return (linVal / 1000000).toFixed(1) + "M";
                if (linVal >= 1000) return (linVal / 1000).toFixed(0) + "k";
                return Math.round(linVal).toString();
              } else {
                // Transitioning ticks
                return `${Math.round(val)}%`;
              }
            }
          },
          title: {
            display: true,
            text: initialType === "logarithmic" ? "Progression Logarithmique (log₁₀)" : "Progression Linéaire (0 → Max)",
            color: tokens.textSecondary
          }
        }
      }
    };

    if (typeof Chart !== "undefined") {
      const chartInstance = new Chart(canvas, {
        type: "bar",
        data: { labels: data.labels, datasets: datasets },
        options: chartOptions
      });
      chartInstance._kcOriginalValues = rawValues;
      chartInstance._kcCurrentRescaleP = initialP;
      return chartInstance;
    }
    return null;
  }

  function playTransition(chart, targetType = "logarithmic", options = {}) {
    return animateAxisRescale(chart, targetType, options);
  }

  return {
    createChart: createChart,
    playTransition: playTransition,
    animateAxisRescale: animateAxisRescale,
    DEFAULT_DATA: DEFAULT_DATA
  };
});
