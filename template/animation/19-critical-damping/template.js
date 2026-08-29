/**
 * @file template/animation/19-critical-damping/template.js
 * @description Amorti critique physique / Spring sans dépassement (Card et al. (1991) / Dragicevic (2011)) — kit-charts
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
    global.KitCharts["anim-19-critical-damping"] = exp;
    global.KitCharts["anim-critical-damping"] = exp;
    global.KitCharts["19-critical-damping"] = exp;
    global.KitCharts["critical-damping"] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.animateCriticalDamping = exp.animateCriticalDamping;
    global.playTransition = exp.playTransition;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  "use strict";

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || function() { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || function(t, i) { return "#2B8CBE"; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || function(c, a) { return c; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || function() { return false; };
  const createAnimationTicker = (KitChartsTheme && KitChartsTheme.createAnimationTicker) || function(o) { return { stop: () => {} }; };

  /**
   * B11 (19): Données pour démonstration du ressort amorti critique (Card et al. 1991 / Dragicevic 2011)
   */
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
        label: "Score Réel (Amorti Critique ζ=1)",
        data: [75, 88, 68, 79, 62, 80, 85, 72]
      }
    ]
  };

  /**
   * B11 (19): Amorti critique physique / Spring sans dépassement (Card et al. 1991 / Dragicevic 2011).
   * Exact analytic solution of critically damped oscillator (ζ = 1):
   * x(t) = x1 - (x1 - x0)(1 + ω*t) * e^(-ω*t) with ω = 6 / T for T = 500ms.
   * Evaluated with physical elapsed ms from ticker (never normalized u).
   *
   * @param {HTMLElement|Function} target Élément cible ou callback(x)
   * @param {number|Array<number>} x0 Position ou valeurs initiales
   * @param {number|Array<number>} x1 Position ou valeurs cibles à l'équilibre
   * @param {Object} [options={}] Options { duration: 500, onComplete, reducedMotion }
   * @returns {Object} Handle de contrôle { stop: Function }
   */
  function animateCriticalDamping(target, x0 = 0, x1 = 100, options = {}) {
    if (KitChartsTheme && typeof KitChartsTheme.animateCriticalDamping === "function" && typeof target !== "function") {
      return KitChartsTheme.animateCriticalDamping(target, x0, x1, options);
    }

    const duration = options.duration !== undefined ? Number(options.duration) : 500;
    const omega = 6 / duration; // ω for t_95% = 3/ω = 500ms

    const isArray = Array.isArray(x0) && Array.isArray(x1);

    const setPos = (val) => {
      if (typeof target === "function") {
        target(val);
      } else if (target && target.style) {
        target.style.transform = `translateX(${val}px)`;
      }
    };

    if (isReducedMotionPreferred() || options.reducedMotion || duration === 0) {
      setPos(x1);
      if (typeof options.onComplete === "function") options.onComplete();
      return { stop: () => {} };
    }

    return createAnimationTicker({
      duration: duration,
      easing: "linear", // physical math drives the easing internally
      reducedMotion: options.reducedMotion,
      onFrame: (easedU, elapsedMs) => {
        const t = elapsedMs; // physical ms
        if (isArray) {
          const currentArr = x0.map((v0, i) => {
            const v1 = x1[i] !== undefined ? x1[i] : v0;
            return v1 - (v1 - v0) * (1 + omega * t) * Math.exp(-omega * t);
          });
          setPos(currentArr);
        } else {
          const xt = x1 - (x1 - x0) * (1 + omega * t) * Math.exp(-omega * t);
          setPos(xt);
        }
      },
      onComplete: () => {
        setPos(x1);
        if (typeof options.onComplete === "function") options.onComplete();
      }
    });
  }

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

    const chartOptions = {
      ...baseOptions,
      responsive: true,
      maintainAspectRatio: false,
      animation: false, // Physical ticker controls the animation smoothly
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
          max: 100,
          title: {
            display: true,
            text: "Score Opérationnel (%)",
            color: tokens.textSecondary || "#334155",
            font: { family: tokens.fontFamily, size: 11, weight: "600" }
          },
          grid: { color: tokens.gridColor || "rgba(0,0,0,0.06)" },
          ticks: {
            color: tokens.textSecondary || "#64748B",
            font: { family: tokens.fontMono || "monospace", size: 10.5 },
            callback: (v) => `${Math.round(v)}%`
          }
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

  function playTransition(chart, targetValues = null, options = {}) {
    if (!chart || !chart.data || !chart.data.datasets[0]) return { stop: () => {} };
    const currentValues = [...chart.data.datasets[0].data];
    const targets = targetValues || currentValues.map(v => Math.min(98, Math.max(30, Math.round(v * (0.85 + Math.random() * 0.3)))));

    return animateCriticalDamping(
      (vals) => {
        chart.data.datasets[0].data = vals;
        chart.update("none");
      },
      currentValues,
      targets,
      {
        duration: options.duration || 500,
        reducedMotion: options.reducedMotion,
        ...options
      }
    );
  }

  return {
    createChart: createChart,
    playTransition: playTransition,
    animateCriticalDamping: animateCriticalDamping,
    DEFAULT_DATA: DEFAULT_DATA
  };
});
