/**
 * @file template/animation/10-count-up/template.js
 * @description Compteur Numérique Animé / Count-up (Stanislas Dehaene (1997), Tversky et al. (2002)) — kit-charts
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
    global.KitCharts["anim-10-count-up"] = exp;
    global.KitCharts["anim-count-up"] = exp;
    global.KitCharts["10-count-up"] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.ALT_DATA = exp.ALT_DATA;
    global.playTransition = exp.playTransition;
    global.triggerCountUp = exp.triggerCountUp;
    global.animateCountUp = exp.animateCountUp;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  "use strict";

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || function() { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || function() { return "#2B8CBE"; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || function(c) { return c; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || function() { return false; };
  const animateCountUp = (KitChartsTheme && KitChartsTheme.animateCountUp) || function(target, targetValue, options) {
    const val = Number(targetValue) || 0;
    const formatted = `${options && options.prefix ? options.prefix : ""}${Math.round(val).toLocaleString("fr-FR")}${options && options.suffix ? options.suffix : ""}`;
    if (typeof target === "function") {
      target(val, formatted);
    } else if (target && typeof target === "object") {
      target.textContent = formatted;
    }
    if (options && options.onComplete) options.onComplete();
    return { stop: function() {} };
  };

  const DEFAULT_DATA = {
    kpis: [
      { id: "rev", label: "Chiffre d'Affaires Global", value: 12450, prefix: "", suffix: " k€", delta: "+18.4% vs N-1" },
      { id: "users", label: "Utilisateurs Actifs Mensuels", value: 84200, prefix: "", suffix: " hab", delta: "+12.1% vs N-1" },
      { id: "csat", label: "Indice de Satisfaction Client", value: 94, prefix: "", suffix: " %", delta: "+3.5 pts vs N-1" },
      { id: "ret", label: "Taux de Rétention Annuelle", value: 88, prefix: "", suffix: " %", delta: "+5.0 pts vs N-1" }
    ],
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"],
    datasets: [
      {
        label: "Volume d'Activité Réalisé (k€)",
        data: [780, 850, 920, 990, 1050, 1120, 1180, 1240, 1310, 1370, 1420, 1500]
      }
    ]
  };

  const ALT_DATA = {
    kpis: [
      { id: "rev", label: "Chiffre d'Affaires Global", value: 15800, prefix: "", suffix: " k€", delta: "+32.8% vs N-1" },
      { id: "users", label: "Utilisateurs Actifs Mensuels", value: 104500, prefix: "", suffix: " hab", delta: "+28.4% vs N-1" },
      { id: "csat", label: "Indice de Satisfaction Client", value: 98, prefix: "", suffix: " %", delta: "+6.2 pts vs N-1" },
      { id: "ret", label: "Taux de Rétention Annuelle", value: 93, prefix: "", suffix: " %", delta: "+9.1 pts vs N-1" }
    ],
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"],
    datasets: [
      {
        label: "Projection Objectif Révisé (k€)",
        data: [850, 940, 1050, 1180, 1290, 1410, 1530, 1650, 1780, 1890, 2020, 2150]
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
        legend: {
          display: true,
          position: "top",
          align: "end"
        }
      },
      scales: {
        x: {
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          grid: { color: tokens.gridColor || "rgba(15, 23, 42, 0.06)" },
          ticks: { callback: (v) => v.toLocaleString("fr-FR") + " k€" }
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

  function triggerCountUp(target, targetValue, options = {}) {
    return animateCountUp(target, targetValue, {
      duration: options.duration !== undefined ? options.duration : 500,
      reducedMotion: options.reducedMotion,
      ...options
    });
  }

  function playTransition(targetOrElements, targetValues, options = {}) {
    if (Array.isArray(targetOrElements) && Array.isArray(targetValues)) {
      const handles = targetOrElements.map((el, i) => {
        const item = targetValues[i];
        const val = typeof item === "object" ? item.value : item;
        const prefix = typeof item === "object" ? item.prefix : "";
        const suffix = typeof item === "object" ? item.suffix : "";
        return triggerCountUp(el, val, {
          prefix: prefix,
          suffix: suffix,
          startValue: options.startValue !== undefined ? options.startValue : 0,
          ...options
        });
      });
      return {
        stop: () => handles.forEach(h => h && h.stop && h.stop())
      };
    }
    return triggerCountUp(targetOrElements, targetValues, options);
  }

  return {
    createChart: createChart,
    playTransition: playTransition,
    triggerCountUp: triggerCountUp,
    animateCountUp: animateCountUp,
    DEFAULT_DATA: DEFAULT_DATA,
    ALT_DATA: ALT_DATA
  };
});
