/**
 * @file template/animation/18-scrollytelling/template.js
 * @description Scrollytelling à pas avec hystérésis (Conlen & Heer (2019) / Zacks & Tversky (2001)) — kit-charts
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
    global.KitCharts["anim-18-scrollytelling"] = exp;
    global.KitCharts["anim-scrollytelling"] = exp;
    global.KitCharts["18-scrollytelling"] = exp;
    global.KitCharts["scrollytelling"] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.SCROLL_STEPS = exp.SCROLL_STEPS;
    global.initScrollytelling = exp.initScrollytelling;
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
   * B10 (18): Données et étapes du scrollytelling (Conlen & Heer 2019 / Zacks & Tversky 2001)
   */
  const SCROLL_STEPS = [
    {
      id: "step-1",
      title: "Étape 1 : Diagnostic Initial (2023)",
      badge: "Point de départ",
      description: "Forte disparité de performance entre les pôles avec un retard marqué sur le Service Client et le Cloud.",
      data: [65, 72, 58, 60, 50, 68, 74, 62],
      highlightIndex: 4
    },
    {
      id: "step-2",
      title: "Étape 2 : Restructuration Cloud & Infra (2024)",
      badge: "Accélération Tech",
      description: "Migration massive vers l'infrastructure distribuée : bond spectaculaire de l'Ingénierie Logicielle (+22 pts).",
      data: [78, 94, 82, 64, 52, 70, 78, 66],
      highlightIndex: 1
    },
    {
      id: "step-3",
      title: "Étape 3 : Automatisation & IA (2025)",
      badge: "Gains Métiers",
      description: "Déploiement des copilotes IA : rattrapage majeur du Service Client (+17 pts) et du Marketing Digital.",
      data: [88, 94, 76, 82, 69, 85, 91, 78],
      highlightIndex: 3
    },
    {
      id: "step-4",
      title: "Étape 4 : Cible Stratégique (2026)",
      badge: "Convergence Globale",
      description: "Tous les départements franchissent le seuil d'excellence de 85% d'efficacité opérationnelle.",
      data: [92, 98, 88, 90, 84, 91, 95, 87],
      highlightIndex: 0
    }
  ];

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
        label: SCROLL_STEPS[0].title,
        data: [...SCROLL_STEPS[0].data]
      }
    ]
  };

  /**
   * B10 (18): Scrollytelling à pas avec hystérésis (Conlen & Heer 2019 / Zacks & Tversky 2001).
   * Fraction mapping: r = (scrollTop / scrollMax) * (n - 1) in [0, n - 1].
   * Advance: r >= k + 0.65 ; Recede: r <= k - 0.65 (deadband +-0.15 around k + 0.5).
   *
   * @param {HTMLElement|string} scrollContainer Conteneur DOM scrollable
   * @param {Array<Object>} steps Définition des étapes [{ id, title, data, highlightIndex }]
   * @param {Object} [options={}] Options { onStepChange: Function }
   * @returns {Object} Handle du gestionnaire { getCurrentStep, destroy }
   */
  function initScrollytelling(scrollContainer, steps = SCROLL_STEPS, options = {}) {
    if (KitChartsTheme && typeof KitChartsTheme.initScrollytelling === "function") {
      return KitChartsTheme.initScrollytelling(scrollContainer, steps, options);
    }

    const container = typeof scrollContainer === "string" ? document.querySelector(scrollContainer) : scrollContainer;
    if (!container || !steps.length) return { destroy: () => {}, getCurrentStep: () => 0 };

    let currentStep = 0;
    let lastScrollTop = container.scrollTop;
    const n = steps.length;

    const onScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollMax = Math.max(1, container.scrollHeight - container.clientHeight);
      const r = (scrollTop / scrollMax) * (n - 1);
      const isScrollingDown = scrollTop >= lastScrollTop;
      lastScrollTop = scrollTop;

      let targetStep = currentStep;
      if (isScrollingDown) {
        if (r >= currentStep + 0.65 && currentStep < n - 1) {
          targetStep = currentStep + 1;
        }
      } else {
        if (r <= currentStep - 0.65 && currentStep > 0) {
          targetStep = currentStep - 1;
        }
      }

      if (targetStep !== currentStep) {
        currentStep = targetStep;
        if (typeof options.onStepChange === "function") {
          options.onStepChange(currentStep, steps[currentStep]);
        }
      }
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return {
      getCurrentStep: () => currentStep,
      destroy: () => container.removeEventListener("scroll", onScroll)
    };
  }

  function createChart(canvas, customData = null, themeName = "colorbrewer-accessible", options = {}) {
    if (!canvas) return null;
    const tokens = getThemeTokens(themeName);
    const data = customData || JSON.parse(JSON.stringify(DEFAULT_DATA));
    const baseOptions = getChartDefaultOptions(tokens);
    const primaryColor = getColor(tokens, 0);
    const accentColor = getColor(tokens, 1);

    const stepIndex = options.stepIndex || 0;
    const activeStep = SCROLL_STEPS[stepIndex] || SCROLL_STEPS[0];
    const highlightIdx = activeStep.highlightIndex !== undefined ? activeStep.highlightIndex : -1;

    const datasets = (data.datasets || []).map((ds) => {
      const copy = { ...ds };
      copy.type = "bar";
      const bgColors = data.labels.map((_, i) => (i === highlightIdx ? accentColor : hexToRgba(primaryColor, 0.85)));
      const borderColors = data.labels.map((_, i) => (i === highlightIdx ? accentColor : primaryColor));
      copy.backgroundColor = bgColors;
      copy.borderColor = borderColors;
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
            text: "Score d'Efficacité (%)",
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
      return new Chart(canvas, {
        type: "bar",
        data: { labels: data.labels, datasets: datasets },
        options: chartOptions
      });
    }
    return null;
  }

  function playTransition(chart, stepIndex = 0, themeName = "colorbrewer-accessible", options = {}) {
    if (!chart || !chart.data || !chart.data.datasets[0]) return;
    const tokens = getThemeTokens(themeName);
    const primaryColor = getColor(tokens, 0);
    const accentColor = getColor(tokens, 1);
    const step = SCROLL_STEPS[stepIndex] || SCROLL_STEPS[0];

    chart.data.datasets[0].label = step.title;
    chart.data.datasets[0].data = [...step.data];
    chart.data.datasets[0].backgroundColor = chart.data.labels.map((_, i) => (i === step.highlightIndex ? accentColor : hexToRgba(primaryColor, 0.85)));
    chart.data.datasets[0].borderColor = chart.data.labels.map((_, i) => (i === step.highlightIndex ? accentColor : primaryColor));

    const dur = (isReducedMotionPreferred() || options.reducedMotion) ? 0 : (options.duration !== undefined ? options.duration : 600);
    if (chart.options && chart.options.animation) {
      chart.options.animation.duration = dur;
      chart.options.animation.easing = "easeOutCubic";
    }
    chart.update();
  }

  return {
    createChart: createChart,
    playTransition: playTransition,
    initScrollytelling: initScrollytelling,
    DEFAULT_DATA: DEFAULT_DATA,
    SCROLL_STEPS: SCROLL_STEPS
  };
});
