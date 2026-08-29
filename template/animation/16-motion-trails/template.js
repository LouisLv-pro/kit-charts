/**
 * @file template/animation/16-motion-trails/template.js
 * @description Traînée Cométaire / Motion Trails / Comet Chart (Heer & Robertson (2007), Robertson et al. (2008)) — kit-charts
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
    global.KitCharts["anim-16-motion-trails"] = exp;
    global.KitCharts["anim-motion-trails"] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.playTransition = exp.playTransition;
    global.animateMotionTrails = exp.animateMotionTrails;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  "use strict";

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || function() { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || function(t, i) { return ["#2B8CBE", "#E66101", "#5E3C99", "#4DAC26"][i % 4]; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || function(c, a) { return c; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || function() { return false; };
  const animateMotionTrailsHelper = (KitChartsTheme && KitChartsTheme.animateMotionTrails) || null;
  const createAnimationTicker = (KitChartsTheme && KitChartsTheme.createAnimationTicker) || function(options = {}) {
    let animId = null;
    let start = null;
    const dur = options.duration || 2000;
    const step = (now) => {
      if (!start) start = now;
      const elapsed = now - start;
      const u = Math.min(1, elapsed / dur);
      if (options.onFrame) options.onFrame(u, elapsed);
      if (u < 1) {
        animId = requestAnimationFrame(step);
      } else {
        if (options.onComplete) options.onComplete();
      }
    };
    animId = requestAnimationFrame(step);
    return { stop: () => { if (animId) cancelAnimationFrame(animId); } };
  };

  /**
   * Trajectoire multidimensionnelle 2D (Investissement vs Efficacité Opérationnelle sur 12 ans)
   */
  const DEFAULT_DATA = {
    years: ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"],
    series: [
      {
        name: "Pôle R&D & Innovation",
        colorIndex: 0,
        points: [
          { x: 15, y: 35, year: "2015" },
          { x: 18, y: 40, year: "2016" },
          { x: 24, y: 42, year: "2017" },
          { x: 30, y: 52, year: "2018" },
          { x: 38, y: 60, year: "2019" },
          { x: 36, y: 56, year: "2020" },
          { x: 46, y: 70, year: "2021" },
          { x: 55, y: 78, year: "2022" },
          { x: 68, y: 85, year: "2023" },
          { x: 78, y: 90, year: "2024" },
          { x: 88, y: 94, year: "2025" },
          { x: 95, y: 98, year: "2026" }
        ]
      },
      {
        name: "Pôle Opérations & Infra",
        colorIndex: 1,
        points: [
          { x: 25, y: 22, year: "2015" },
          { x: 32, y: 28, year: "2016" },
          { x: 40, y: 35, year: "2017" },
          { x: 48, y: 44, year: "2018" },
          { x: 55, y: 50, year: "2019" },
          { x: 52, y: 46, year: "2020" },
          { x: 60, y: 58, year: "2021" },
          { x: 66, y: 65, year: "2022" },
          { x: 72, y: 72, year: "2023" },
          { x: 78, y: 80, year: "2024" },
          { x: 82, y: 86, year: "2025" },
          { x: 88, y: 91, year: "2026" }
        ]
      },
      {
        name: "Pôle Services & Support",
        colorIndex: 2,
        points: [
          { x: 12, y: 50, year: "2015" },
          { x: 16, y: 54, year: "2016" },
          { x: 22, y: 58, year: "2017" },
          { x: 26, y: 62, year: "2018" },
          { x: 32, y: 65, year: "2019" },
          { x: 30, y: 61, year: "2020" },
          { x: 38, y: 68, year: "2021" },
          { x: 48, y: 73, year: "2022" },
          { x: 58, y: 78, year: "2023" },
          { x: 65, y: 82, year: "2024" },
          { x: 72, y: 85, year: "2025" },
          { x: 80, y: 89, year: "2026" }
        ]
      }
    ]
  };

  /**
   * Plugin Chart.js pour le rendu cinématique de la traînée cométaire
   */
  const kcCometTrailPlugin = {
    id: "kcCometTrail",
    afterDatasetsDraw(chart) {
      const ctx = chart.ctx;
      const xScale = chart.scales.x;
      const yScale = chart.scales.y;
      if (!ctx || !xScale || !yScale) return;

      const progress = chart._kcTrailProgress !== undefined ? chart._kcTrailProgress : 1;
      const lambdaFrac = chart._kcTrailLambdaFrac || 0.20;
      const seriesList = chart._kcSeriesData || [];

      seriesList.forEach((s) => {
        const pts = s.points || [];
        if (pts.length < 2) return;

        // Conversion en coordonnées pixels
        const pixelPts = pts.map(p => ({
          x: xScale.getPixelForValue(p.x),
          y: yScale.getPixelForValue(p.y),
          year: p.year
        }));

        // Calcul des longueurs cumulées d'arc
        const cumLens = [0];
        let totalLen = 0;
        for (let i = 1; i < pixelPts.length; i++) {
          const dx = pixelPts[i].x - pixelPts[i - 1].x;
          const dy = pixelPts[i].y - pixelPts[i - 1].y;
          totalLen += Math.sqrt(dx * dx + dy * dy);
          cumLens.push(totalLen);
        }

        if (totalLen <= 0) return;

        // 1. Tracé de fond statique discret (alpha = 0.18) pour préservation du contexte
        ctx.save();
        ctx.strokeStyle = hexToRgba(s.color, 0.18);
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(pixelPts[0].x, pixelPts[0].y);
        for (let i = 1; i < pixelPts.length; i++) {
          ctx.lineTo(pixelPts[i].x, pixelPts[i].y);
        }
        ctx.stroke();
        ctx.restore();

        // 2. Traînée cométaire active avec atténuation exponentielle
        const sHead = Math.max(0.001, progress * totalLen);
        const lambda = Math.max(10, lambdaFrac * totalLen);

        // Interpolation de la position de tête à vitesse constante s_head
        let headPos = { x: pixelPts[0].x, y: pixelPts[0].y };
        for (let i = 1; i < pixelPts.length; i++) {
          if (sHead <= cumLens[i]) {
            const segStart = cumLens[i - 1];
            const segLen = cumLens[i] - segStart;
            const frac = segLen > 0 ? (sHead - segStart) / segLen : 0;
            headPos = {
              x: pixelPts[i - 1].x + (pixelPts[i].x - pixelPts[i - 1].x) * frac,
              y: pixelPts[i - 1].y + (pixelPts[i].y - pixelPts[i - 1].y) * frac
            };
            break;
          }
          if (i === pixelPts.length - 1) {
            headPos = { x: pixelPts[i].x, y: pixelPts[i].y };
          }
        }

        // Échantillonnage dense de la queue
        const numSamples = 60;
        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        for (let k = 0; k < numSamples; k++) {
          const sampleDist = (k / numSamples) * sHead;
          const nextDist = ((k + 1) / numSamples) * sHead;
          const distFromHead = sHead - sampleDist;

          // Décroissance exponentielle alpha(s) = exp(-s / lambda)
          const alpha = Math.max(0.02, Math.exp(-distFromHead / lambda));
          const strokeWidth = Math.max(1, 4 * (1 - (distFromHead / (sHead * 1.5))));

          const getPointAtDist = (d) => {
            for (let i = 1; i < pixelPts.length; i++) {
              if (d <= cumLens[i]) {
                const segStart = cumLens[i - 1];
                const segLen = cumLens[i] - segStart;
                const frac = segLen > 0 ? (d - segStart) / segLen : 0;
                return {
                  x: pixelPts[i - 1].x + (pixelPts[i].x - pixelPts[i - 1].x) * frac,
                  y: pixelPts[i - 1].y + (pixelPts[i].y - pixelPts[i - 1].y) * frac
                };
              }
            }
            return pixelPts[pixelPts.length - 1];
          };

          const p0 = getPointAtDist(sampleDist);
          const p1 = getPointAtDist(nextDist);

          ctx.strokeStyle = hexToRgba(s.color, alpha * 0.9);
          ctx.lineWidth = strokeWidth;
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.stroke();
        }
        ctx.restore();

        // 3. Tête lumineuse de la comète
        ctx.save();
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 8;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(headPos.x, headPos.y, 6, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(headPos.x, headPos.y, 2.5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();

        // 4. Points clés et étiquettes d'années traversées
        ctx.save();
        pixelPts.forEach((p, idx) => {
          if (cumLens[idx] <= sHead) {
            ctx.fillStyle = s.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI);
            ctx.fill();

            if (idx === 0 || idx === pixelPts.length - 1 || idx % 3 === 0) {
              ctx.font = "600 10px 'JetBrains Mono', monospace";
              ctx.fillStyle = "#475569";
              ctx.textAlign = "center";
              ctx.fillText(p.year, p.x, p.y - 8);
            }
          }
        });
        ctx.restore();
      });
    }
  };

  /**
   * Animation de traînée cométaire à vitesse constante
   */
  function animateMotionTrails(chart, seriesPaths = [], options = {}) {
    if (animateMotionTrailsHelper) {
      return animateMotionTrailsHelper(chart, seriesPaths, options);
    }

    if (!chart) {
      if (options.onComplete) options.onComplete();
      return { stop: () => {} };
    }

    const duration = options.duration !== undefined ? options.duration : 2000;
    const lambdaFrac = options.lambdaFrac || 0.20;
    const isReduced = options.reducedMotion !== undefined ? options.reducedMotion : isReducedMotionPreferred();

    if (isReduced || duration === 0) {
      chart._kcTrailProgress = 1;
      chart._kcTrailLambdaFrac = lambdaFrac;
      chart.update("none");
      if (options.onComplete) options.onComplete();
      return { stop: () => {} };
    }

    return createAnimationTicker({
      duration: duration,
      easing: "linear",
      reducedMotion: options.reducedMotion,
      onFrame: (easedU) => {
        chart._kcTrailProgress = easedU;
        chart._kcTrailLambdaFrac = lambdaFrac;
        chart.update("none");
      },
      onComplete: () => {
        chart._kcTrailProgress = 1;
        chart.update("none");
        if (options.onComplete) options.onComplete();
      }
    });
  }

  /**
   * Crée l'instance Connected Scatter Plot avec plugin de traînée cométaire
   */
  function createChart(canvas, customData = null, themeName = "colorbrewer-accessible", options = {}) {
    if (!canvas) return null;
    const tokens = getThemeTokens(themeName);
    const data = customData || JSON.parse(JSON.stringify(DEFAULT_DATA));
    const baseOptions = getChartDefaultOptions(tokens);

    const seriesData = (data.series || []).map((s, idx) => ({
      name: s.name,
      color: getColor(tokens, s.colorIndex !== undefined ? s.colorIndex : idx),
      points: s.points || []
    }));

    const datasets = seriesData.map((s) => ({
      label: s.name,
      data: s.points.map(p => ({ x: p.x, y: p.y })),
      borderColor: "transparent",
      backgroundColor: "transparent",
      pointRadius: 0,
      showLine: false
    }));

    const chartOptions = {
      ...baseOptions,
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: {
        ...baseOptions.plugins,
        legend: {
          display: true,
          position: "top",
          align: "end",
          labels: {
            usePointStyle: true,
            generateLabels: () => {
              return seriesData.map((s) => ({
                text: s.name,
                fillStyle: s.color,
                strokeStyle: s.color,
                pointStyle: "circle"
              }));
            }
          }
        },
        tooltip: {
          ...baseOptions.plugins?.tooltip,
          callbacks: {
            label: (ctx) => {
              const p = ctx.raw;
              return ` Investissement : ${p.x}% | Efficacité : ${p.y} pts`;
            }
          }
        }
      },
      scales: {
        x: {
          type: "linear",
          min: 0,
          max: 100,
          title: { display: true, text: "Investissement R&D / CA (%)", color: tokens.textSecondary },
          ticks: { callback: (v) => v + "%" },
          grid: { color: tokens.gridColor }
        },
        y: {
          type: "linear",
          min: 0,
          max: 100,
          title: { display: true, text: "Score d'Efficacité Opérationnelle (0 - 100)", color: tokens.textSecondary },
          ticks: { callback: (v) => v + " pts" },
          grid: { color: tokens.gridColor }
        }
      }
    };

    if (typeof Chart !== "undefined") {
      const chartInstance = new Chart(canvas, {
        type: "scatter",
        data: { datasets: datasets },
        options: chartOptions,
        plugins: [kcCometTrailPlugin]
      });

      chartInstance._kcSeriesData = seriesData;
      chartInstance._kcTrailProgress = options.reducedMotion ? 1 : 1;
      chartInstance._kcTrailLambdaFrac = 0.20;

      return chartInstance;
    }
    return null;
  }

  function playTransition(chart, options = {}) {
    return animateMotionTrails(chart, chart._kcSeriesData || [], {
      duration: options.duration !== undefined ? options.duration : 2200,
      lambdaFrac: 0.20,
      reducedMotion: options.reducedMotion,
      ...options
    });
  }

  return {
    createChart: createChart,
    playTransition: playTransition,
    animateMotionTrails: animateMotionTrails,
    kcCometTrailPlugin: kcCometTrailPlugin,
    DEFAULT_DATA: DEFAULT_DATA
  };
});
