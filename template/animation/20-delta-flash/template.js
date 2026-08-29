/**
 * @file template/animation/20-delta-flash/template.js
 * @description Flash d'onset pour valeurs modifiées / Delta Highlight (Jonides & Yantis (1988) / Healey & Enns (2012) / WCAG SC 2.3.1) — kit-charts
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
    global.KitCharts["anim-20-delta-flash"] = exp;
    global.KitCharts["anim-delta-flash"] = exp;
    global.KitCharts["20-delta-flash"] = exp;
    global.KitCharts["delta-flash"] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.attachDeltaFlash = exp.attachDeltaFlash;
    global.kcDeltaFlashPlugin = exp.kcDeltaFlashPlugin;
    global.playTransition = exp.playTransition;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  "use strict";

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || function() { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || function(t, i) { return "#2B8CBE"; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || function(c, a) { return c; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || function() { return false; };

  /**
   * B12 (20): Flash d'onset pour valeurs modifiées / Delta Highlight (Jonides & Yantis 1988 / Healey & Enns 2012 / WCAG SC 2.3.1).
   * Formula: B(t) = B0 * e^(-t/tau) with B0 <= 0.35, tau approx 400ms, tick rate >= 800ms (<= 2 flashes/s).
   */
  const kcDeltaFlashPlugin = (KitChartsTheme && KitChartsTheme.kcDeltaFlashPlugin) || {
    id: "kcDeltaFlash",
    afterDatasetsDraw(chart, args, pluginOptions) {
      const flashState = chart._kcDeltaFlashState;
      if (!flashState || !flashState.active) return;

      const ctx = chart.ctx;
      if (!ctx) return;

      const t = flashState.elapsedMs;
      const { B0 = 0.35, tau = 400, color = "#E66101", modifiedIndices = [] } = flashState;
      const brightness = B0 * Math.exp(-t / tau);

      if (brightness < 0.01) {
        flashState.active = false;
        return;
      }

      const meta = chart.getDatasetMeta(flashState.datasetIndex || 0);
      if (!meta || !meta.data) return;

      ctx.save();
      modifiedIndices.forEach(idx => {
        const elem = meta.data[idx];
        if (!elem) return;
        const { x, y, base, width } = elem;

        if (base !== undefined && width !== undefined) {
          ctx.fillStyle = hexToRgba(color, brightness);
          const barTop = Math.min(y, base);
          const barHeight = Math.abs(base - y);
          ctx.fillRect(x - width / 2, barTop, width, barHeight);

          ctx.strokeStyle = hexToRgba(color, Math.min(1, brightness * 2.5));
          ctx.lineWidth = 2;
          ctx.strokeRect(x - width / 2, barTop, width, barHeight);
        }
      });
      ctx.restore();
    }
  };

  /**
   * Attache un flash d'onset lumineux auto-extinguible sur les marques modifiées.
   *
   * @param {Object} chart Instance Chart.js
   * @param {Array<number>} modifiedIndices Indices des colonnes modifiées
   * @param {Object} [options={}] Options { B0: 0.35, tau: 400, color, datasetIndex, onComplete, reducedMotion }
   * @returns {Object} Handle de contrôle { stop: Function }
   */
  function attachDeltaFlash(chart, modifiedIndices = [], options = {}) {
    if (KitChartsTheme && typeof KitChartsTheme.attachDeltaFlash === "function") {
      return KitChartsTheme.attachDeltaFlash(chart, modifiedIndices, options);
    }

    if (!chart) return { stop: () => {} };

    if (isReducedMotionPreferred() || options.reducedMotion) {
      if (typeof options.onComplete === "function") options.onComplete();
      return { stop: () => {} };
    }

    const B0 = Math.min(0.35, options.B0 || 0.35);
    const tau = options.tau || 400;
    const startTime = typeof performance !== "undefined" ? performance.now() : Date.now();

    chart._kcDeltaFlashState = {
      active: true,
      modifiedIndices: modifiedIndices,
      datasetIndex: options.datasetIndex || 0,
      B0: B0,
      tau: tau,
      color: options.color || "#E66101",
      elapsedMs: 0
    };

    let rafId = null;
    const loop = () => {
      if (!chart._kcDeltaFlashState || !chart._kcDeltaFlashState.active) return;
      const now = typeof performance !== "undefined" ? performance.now() : Date.now();
      const elapsed = now - startTime;
      chart._kcDeltaFlashState.elapsedMs = elapsed;

      if (Math.exp(-elapsed / tau) < 0.01) {
        chart._kcDeltaFlashState.active = false;
        chart.render();
        if (typeof options.onComplete === "function") options.onComplete();
        return;
      }

      chart.render();
      if (typeof requestAnimationFrame !== "undefined") {
        rafId = requestAnimationFrame(loop);
      }
    };

    if (typeof requestAnimationFrame !== "undefined") {
      rafId = requestAnimationFrame(loop);
    }

    return {
      stop: () => {
        if (chart._kcDeltaFlashState) chart._kcDeltaFlashState.active = false;
        if (rafId && typeof cancelAnimationFrame !== "undefined") cancelAnimationFrame(rafId);
        chart.render();
      }
    };
  }

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
        label: "Indicateur Temps Réel (Flash d'Onset)",
        data: [78, 92, 65, 84, 58, 82, 89, 74]
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

    const dur = options.reducedMotion ? 0 : (options.duration !== undefined ? options.duration : 400);

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
          max: 100,
          title: {
            display: true,
            text: "Score Métrique (%)",
            color: tokens.textSecondary || "#334155",
            font: { family: tokens.fontFamily, size: 11, weight: "600" }
          },
          grid: { color: tokens.gridColor || "rgba(0,0,0,0.06)" },
          ticks: {
            color: tokens.textSecondary || "#64748B",
            font: { family: tokens.fontMono || "monospace", size: 10.5 },
            callback: (v) => `${v}%`
          }
        }
      }
    };

    if (typeof Chart !== "undefined") {
      const plugins = [kcDeltaFlashPlugin];
      return new Chart(canvas, {
        type: "bar",
        data: { labels: data.labels, datasets: datasets },
        options: chartOptions,
        plugins: plugins
      });
    }
    return null;
  }

  function playTransition(chart, modifiedIndices = [1, 4], nextValues = null, options = {}) {
    if (!chart || !chart.data || !chart.data.datasets[0]) return { stop: () => {} };
    const tokens = getThemeTokens(options.themeName || "colorbrewer-accessible");
    const flashColor = options.color || getColor(tokens, 1) || "#E66101";

    if (nextValues) {
      chart.data.datasets[0].data = [...nextValues];
    } else {
      modifiedIndices.forEach(idx => {
        if (chart.data.datasets[0].data[idx] !== undefined) {
          const current = chart.data.datasets[0].data[idx];
          chart.data.datasets[0].data[idx] = Math.min(98, Math.max(40, Math.round(current + (Math.random() > 0.5 ? 15 : -15))));
        }
      });
    }

    const dur = (isReducedMotionPreferred() || options.reducedMotion) ? 0 : 350;
    if (chart.options && chart.options.animation) {
      chart.options.animation.duration = dur;
    }
    chart.update();

    return attachDeltaFlash(chart, modifiedIndices, {
      B0: 0.35,
      tau: 400,
      color: flashColor,
      reducedMotion: options.reducedMotion,
      ...options
    });
  }

  return {
    createChart: createChart,
    playTransition: playTransition,
    attachDeltaFlash: attachDeltaFlash,
    kcDeltaFlashPlugin: kcDeltaFlashPlugin,
    DEFAULT_DATA: DEFAULT_DATA
  };
});
