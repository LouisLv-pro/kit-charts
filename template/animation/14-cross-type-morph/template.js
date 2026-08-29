/**
 * @file template/animation/14-cross-type-morph/template.js
 * @description Morphing entre Types de Graphiques / Cross-Type Transition (Cleveland & McGill (1984), Robertson et al. (2008), Heer & Robertson (2007)) — kit-charts
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
    global.KitCharts["anim-14-cross-type-morph"] = exp;
    global.KitCharts["anim-cross-type-morph"] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.playTransition = exp.playTransition;
    global.animateCrossTypeMorph = exp.animateCrossTypeMorph;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  "use strict";

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || function(t, i) { return ["#2B8CBE", "#E66101", "#5E3C99", "#4DAC26", "#D01C8B"][i % 5]; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || function() { return false; };
  const animateCrossTypeMorphHelper = (KitChartsTheme && KitChartsTheme.animateCrossTypeMorph) || null;

  /**
   * Données catégorielles pour la transition Barres <-> Secteurs (N=5)
   */
  const DEFAULT_DATA = [
    { label: "Recherche & Dév.", value: 38 },
    { label: "Ingénierie Logicielle", value: 52 },
    { label: "Production & Infra", value: 24 },
    { label: "Marketing Digital", value: 30 },
    { label: "Service Client", value: 16 }
  ];

  /**
   * Animation de morphing géométrique continue à 32 points d'échantillonnage
   * Formule : x_i(p) = (1-p)*f_cart^-1(i) + p*g_polar^-1(i) avec p = easeInOutCubic(u)
   */
  function animateCrossTypeMorph(canvas, items = [], fromType = "bar", toType = "pie", options = {}) {
    if (animateCrossTypeMorphHelper) {
      return animateCrossTypeMorphHelper(canvas, items, fromType, toType, options);
    }

    if (!canvas) {
      if (options.onComplete) options.onComplete();
      return { stop: () => {} };
    }

    const ctx = canvas.getContext("2d");
    const duration = options.duration !== undefined ? options.duration : 800;
    const isReduced = options.reducedMotion !== undefined ? options.reducedMotion : isReducedMotionPreferred();
    const dpr = typeof window !== "undefined" ? (window.devicePixelRatio || 1) : 1;
    const rect = canvas.getBoundingClientRect();
    const W = (rect.width || 600) * dpr;
    const H = (rect.height || 400) * dpr;

    canvas.width = W;
    canvas.height = H;
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    const total = items.reduce((acc, it) => acc + it.value, 0) || 1;
    const N = items.length;

    const renderFrame = (p) => {
      ctx.clearRect(0, 0, W, H);
      ctx.save();

      const barArea = { x: W * 0.12, y: H * 0.15, w: W * 0.76, h: H * 0.70 };
      const pieCenter = { x: W * 0.5, y: H * 0.5, r: Math.min(W, H) * 0.32 };
      const maxVal = Math.max(...items.map(it => it.value), 1);

      // Fondu de l'axe cartésien sur [0, 0.25T]
      const axisAlpha = Math.max(0, 1 - p / 0.25);
      // Apparition des étiquettes de pourcentage sur [0.75T, 1.0T]
      const labelAlpha = Math.max(0, (p - 0.75) / 0.25);

      if (axisAlpha > 0) {
        ctx.strokeStyle = `rgba(148, 163, 184, ${axisAlpha * 0.4})`;
        ctx.lineWidth = 1 * dpr;
        ctx.beginPath();
        ctx.moveTo(barArea.x, barArea.y + barArea.h);
        ctx.lineTo(barArea.x + barArea.w, barArea.y + barArea.h);
        ctx.stroke();
      }

      let runningAngle = -Math.PI / 2;
      const barWidth = (barArea.w / N) * 0.65;
      const barSpacing = barArea.w / N;

      items.forEach((item, idx) => {
        const sliceAngle = (item.value / total) * 2 * Math.PI;
        const barH = (item.value / maxVal) * barArea.h;
        const barX = barArea.x + idx * barSpacing + (barSpacing - barWidth) / 2;
        const barY = barArea.y + barArea.h - barH;

        // Échantillonnage de contour sur 32 points géométriques
        const points = [];
        const M = 32;
        for (let s = 0; s < M; s++) {
          const uSample = s / (M - 1);

          // Coordonnées cartésiennes du rectangle
          let cx = 0, cy = 0;
          if (s < M / 4) {
            cx = barX + (s / (M / 4)) * barWidth;
            cy = barY;
          } else if (s < M / 2) {
            cx = barX + barWidth;
            cy = barY + ((s - M / 4) / (M / 4)) * barH;
          } else if (s < (3 * M) / 4) {
            cx = barX + barWidth - ((s - M / 2) / (M / 4)) * barWidth;
            cy = barY + barH;
          } else {
            cx = barX;
            cy = barY + barH - ((s - (3 * M) / 4) / (M / 4)) * barH;
          }

          // Coordonnées polaires du secteur
          const polarTheta = runningAngle + uSample * sliceAngle;
          const polarR = pieCenter.r;
          const px = pieCenter.x + polarR * Math.cos(polarTheta) * (s < M / 2 ? 1 : 0);
          const py = pieCenter.y + polarR * Math.sin(polarTheta) * (s < M / 2 ? 1 : 0);

          // Interpolation géométrique continue
          const morphX = (1 - p) * cx + p * px;
          const morphY = (1 - p) * cy + p * py;
          points.push({ x: morphX, y: morphY });
        }

        ctx.beginPath();
        ctx.fillStyle = item.color;
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();
        ctx.fill();

        // Étiquettes de pourcentages en vue polaire
        if (labelAlpha > 0) {
          const midA = runningAngle + sliceAngle / 2;
          const lx = pieCenter.x + (pieCenter.r + 24 * dpr) * Math.cos(midA);
          const ly = pieCenter.y + (pieCenter.r + 24 * dpr) * Math.sin(midA);
          ctx.fillStyle = `rgba(15, 23, 42, ${labelAlpha})`;
          ctx.font = `600 ${11 * dpr}px sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText(`${Math.round((item.value / total) * 100)}%`, lx, ly);
        }

        runningAngle += sliceAngle;
      });

      ctx.restore();
    };

    if (isReduced || duration === 0) {
      renderFrame(toType === "pie" ? 1 : 0);
      if (options.onComplete) options.onComplete();
      return { stop: () => {} };
    }

    let start = null;
    let animId = null;
    const forward = fromType === "bar" && toType === "pie";

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const u = Math.min(1, elapsed / duration);
      // Easing easeInOutCubic
      const eased = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
      const p = forward ? eased : (1 - eased);

      renderFrame(p);

      if (u < 1) {
        animId = requestAnimationFrame(step);
      } else {
        renderFrame(forward ? 1 : 0);
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
   * Crée le contrôleur de morphing 2D avec gestion du canvas, DPR et thèmes
   */
  function createChart(canvasTarget, customData = null, themeName = "colorbrewer-accessible", options = {}) {
    const canvas = typeof canvasTarget === "string"
      ? (typeof document !== "undefined" ? document.getElementById(canvasTarget) : null)
      : canvasTarget;

    if (!canvas) return null;

    let currentTheme = themeName;
    let tokens = getThemeTokens(currentTheme);
    let currentType = options.initialType || "bar";
    let activeAnimation = null;

    const rawData = customData || DEFAULT_DATA;
    let items = rawData.map((item, idx) => ({
      label: item.label,
      value: item.value,
      color: item.color || getColor(tokens, idx)
    }));

    const resizeAndDraw = () => {
      const dpr = typeof window !== "undefined" ? (window.devicePixelRatio || 1) : 1;
      const rect = canvas.getBoundingClientRect();
      const W = (rect.width || 600) * dpr;
      const H = (rect.height || 400) * dpr;
      canvas.width = W;
      canvas.height = H;
      canvas.style.width = "100%";
      canvas.style.height = "100%";

      animateCrossTypeMorph(canvas, items, currentType, currentType, {
        duration: 0,
        reducedMotion: true
      });
    };

    const handleResize = () => {
      resizeAndDraw();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
    }

    // Premier rendu immédiat
    resizeAndDraw();

    function morphTo(targetType, opts = {}) {
      if (activeAnimation && activeAnimation.stop) {
        activeAnimation.stop();
      }
      const from = currentType;
      const to = targetType || (currentType === "bar" ? "pie" : "bar");
      currentType = to;
      activeAnimation = animateCrossTypeMorph(canvas, items, from, to, {
        duration: opts.duration !== undefined ? opts.duration : 800,
        reducedMotion: opts.reducedMotion,
        onComplete: opts.onComplete
      });
      return activeAnimation;
    }

    function update(newThemeName) {
      if (newThemeName) {
        currentTheme = newThemeName;
        tokens = getThemeTokens(currentTheme);
        items = rawData.map((item, idx) => ({
          label: item.label,
          value: item.value,
          color: item.color || getColor(tokens, idx)
        }));
      }
      resizeAndDraw();
    }

    return {
      canvas: canvas,
      items: items,
      getCurrentType: () => currentType,
      morphTo: morphTo,
      playTransition: (toType, opts) => morphTo(toType, opts),
      update: update,
      destroy: () => {
        if (typeof window !== "undefined") {
          window.removeEventListener("resize", handleResize);
        }
        if (activeAnimation && activeAnimation.stop) {
          activeAnimation.stop();
        }
      }
    };
  }

  function playTransition(chartController, targetType = "pie", options = {}) {
    if (chartController && typeof chartController.morphTo === "function") {
      return chartController.morphTo(targetType, options);
    }
    return null;
  }

  return {
    createChart: createChart,
    playTransition: playTransition,
    animateCrossTypeMorph: animateCrossTypeMorph,
    DEFAULT_DATA: DEFAULT_DATA
  };
});
