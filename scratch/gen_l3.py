# -*- coding: utf-8 -*-
"""
Lot 3 (P2) Combo Generator:
10. joint-scatter-marginals (04-correlation-relation)
11. stacked-total-line (02-composition-part-to-whole)
12. gantt-progress (06-flux-processus)
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path("/Users/louislaville/Desktop/kit-charts/scratch")))
from generate_all import write_file, preview_html

# ==============================================================================
# 10. JOINT-SCATTER-MARGINALS
# ==============================================================================
joint_js = """/**
 * @file 04-correlation-relation/joint-scatter-marginals/template.js
 * @description Standardized Universal Joint Scatter + Marginal Distributions Template.
 * Combines 2D bivariate scatter plot, 1D marginal KDE distributions on top/right margins, and 95% confidence ellipse.
 */

(function(global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory(require('../../../themes/theme-tokens.js'));
  } else if (typeof define === 'function' && define.amd) {
    define(['../../../themes/theme-tokens.js'], factory);
  } else {
    global = typeof globalThis !== 'undefined' ? globalThis : global || self;
    var tokens = global.KitChartsTheme || (global.KitCharts && global.KitCharts.Theme) || {};
    var exp = factory(tokens);
    global.KitCharts = global.KitCharts || {};
    global.KitCharts['joint-scatter-marginals'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.computeMarginalKDE = exp.computeMarginalKDE;
    global.computeConfidenceEllipse = exp.computeConfidenceEllipse;
    global.computePearsonR = exp.computePearsonR;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  function computeMarginalKDE(values, gridPoints = 64) {
    const clean = Array.isArray(values) ? values.map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b) : [];
    const n = clean.length;
    if (n < 2) return { grid: [], density: [], maxDensity: 0 };

    const mean = clean.reduce((s, v) => s + v, 0) / n;
    const variance = clean.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / (n - 1);
    const sigma = Math.sqrt(variance) || 1;
    const h = 1.06 * sigma * Math.pow(n, -0.2);

    const min = clean[0] - 2 * h;
    const max = clean[n - 1] + 2 * h;
    const step = (max - min) / (gridPoints - 1);

    const SQRT_2PI = Math.sqrt(2 * Math.PI);
    const grid = new Array(gridPoints);
    const density = new Array(gridPoints);
    let maxDensity = 0;

    for (let j = 0; j < gridPoints; j++) {
      const x = min + j * step;
      grid[j] = x;
      let sum = 0;
      for (let i = 0; i < n; i++) {
        const u = (x - clean[i]) / h;
        sum += Math.exp(-0.5 * u * u) / SQRT_2PI;
      }
      const d = sum / (n * h);
      density[j] = d;
      if (d > maxDensity) maxDensity = d;
    }

    return { grid, density, maxDensity, h, min, max };
  }

  function computePearsonR(points) {
    const clean = points.filter(p => p && !isNaN(p.x) && !isNaN(p.y));
    const n = clean.length;
    if (n < 2) return 0;
    const mx = clean.reduce((s, p) => s + p.x, 0) / n;
    const my = clean.reduce((s, p) => s + p.y, 0) / n;
    let num = 0, dx2 = 0, dy2 = 0;
    clean.forEach(p => {
      const dx = p.x - mx;
      const dy = p.y - my;
      num += dx * dy;
      dx2 += dx * dx;
      dy2 += dy * dy;
    });
    return (dx2 > 0 && dy2 > 0) ? Math.round((num / Math.sqrt(dx2 * dy2)) * 1000) / 1000 : 0;
  }

  function computeConfidenceEllipse(points, confidence = 0.95, numPoints = 64) {
    const clean = points.filter(p => p && !isNaN(p.x) && !isNaN(p.y));
    const n = clean.length;
    if (n < 3) return [];

    const mx = clean.reduce((s, p) => s + p.x, 0) / n;
    const my = clean.reduce((s, p) => s + p.y, 0) / n;

    let varX = 0, varY = 0, covXY = 0;
    clean.forEach(p => {
      const dx = p.x - mx;
      const dy = p.y - my;
      varX += dx * dx;
      varY += dy * dy;
      covXY += dx * dy;
    });
    varX /= (n - 1);
    varY /= (n - 1);
    covXY /= (n - 1);

    const trace = varX + varY;
    const det = varX * varY - covXY * covXY;
    const term = Math.sqrt(Math.max(0, Math.pow((varX - varY) / 2, 2) + covXY * covXY));
    const lambda1 = trace / 2 + term;
    const lambda2 = Math.max(0, trace / 2 - term);

    const theta = Math.atan2(lambda1 - varX, covXY);
    const chi2Val = 5.991; // 95% quantile for df=2
    const a = Math.sqrt(Math.max(0, chi2Val * lambda1));
    const b = Math.sqrt(Math.max(0, chi2Val * lambda2));

    const ellipsePoints = [];
    for (let i = 0; i <= numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const ex = a * Math.cos(angle);
      const ey = b * Math.sin(angle);
      const rotX = mx + ex * Math.cos(theta) - ey * Math.sin(theta);
      const rotY = my + ex * Math.sin(theta) + ey * Math.cos(theta);
      ellipsePoints.push({ x: Math.round(rotX * 100) / 100, y: Math.round(rotY * 100) / 100 });
    }
    return ellipsePoints;
  }

  const DEFAULT_DATA = {
    datasets: [{
      label: 'Temps d\'Attente (s) vs Satisfaction (Score)',
      data: [
        { x: 12, y: 88 }, { x: 15, y: 85 }, { x: 18, y: 82 }, { x: 22, y: 78 },
        { x: 25, y: 75 }, { x: 28, y: 72 }, { x: 30, y: 70 }, { x: 35, y: 65 },
        { x: 40, y: 60 }, { x: 45, y: 55 }, { x: 50, y: 48 }, { x: 55, y: 45 },
        { x: 60, y: 38 }, { x: 65, y: 35 }, { x: 70, y: 30 }, { x: 75, y: 25 },
        { x: 20, y: 80 }, { x: 32, y: 68 }, { x: 48, y: 52 }, { x: 58, y: 42 }
      ]
    }]
  };

  function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
    const canvas = typeof canvasTarget === 'string'
      ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
      : canvasTarget;

    if (!canvas) throw new Error(`Canvas element "${canvasTarget}" not found`);

    if (typeof Chart !== 'undefined' && Chart.getChart) {
      const existing = Chart.getChart(canvas);
      if (existing) existing.destroy();
    }

    const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
    const tokens = getThemeTokens(themeName, container);
    const isDark = Boolean(tokens.isDark);

    const rawData = customData || DEFAULT_DATA;
    const points = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data) || DEFAULT_DATA.datasets[0].data;
    const seriesLabel = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].label) || 'Observations';

    const xVals = points.map(p => p.x);
    const yVals = points.map(p => p.y);

    const kdeX = computeMarginalKDE(xVals);
    const kdeY = computeMarginalKDE(yVals);
    const ellipse = computeConfidenceEllipse(points);
    const pearsonR = computePearsonR(points);

    const mainColor = getColor(tokens, 0);
    const ellipseColor = tokens.emphasis?.focal || tokens.palette?.[1] || '#E66101';

    const marginalPainterPlugin = {
      id: 'kitChartsJointMarginalsPainter',
      afterDatasetsDraw(chart) {
        const { ctx, scales: { x, y }, chartArea } = chart;
        if (!x || !y || !chartArea) return;

        ctx.save();

        // 1. Marginal KDE X (au sommet du graphique)
        if (kdeX.grid.length && kdeX.maxDensity > 0) {
          const topBandH = 30;
          ctx.beginPath();
          for (let j = 0; j < kdeX.grid.length; j++) {
            const px = x.getPixelForValue(kdeX.grid[j]);
            const ratio = kdeX.density[j] / kdeX.maxDensity;
            const py = chartArea.top + topBandH - (ratio * topBandH);
            if (j === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.strokeStyle = hexToRgba(mainColor, 0.75);
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // 2. Marginal KDE Y (sur la marge droite du graphique)
        if (kdeY.grid.length && kdeY.maxDensity > 0) {
          const rightBandW = 30;
          ctx.beginPath();
          for (let j = 0; j < kdeY.grid.length; j++) {
            const py = y.getPixelForValue(kdeY.grid[j]);
            const ratio = kdeY.density[j] / kdeY.maxDensity;
            const px = chartArea.right - rightBandW + (ratio * rightBandW);
            if (j === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.strokeStyle = hexToRgba(mainColor, 0.75);
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        ctx.restore();
      }
    };

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'scatter',
      data: {
        datasets: [
          {
            type: 'scatter',
            label: seriesLabel,
            data: points,
            backgroundColor: hexToRgba(mainColor, 0.80),
            borderColor: mainColor,
            borderWidth: 1.5,
            pointRadius: 5,
            pointHoverRadius: 7,
            order: 2
          },
          {
            type: 'line',
            label: `Ellipse de confiance 95% (r = ${pearsonR})`,
            data: ellipse,
            borderColor: hexToRgba(ellipseColor, 0.85),
            backgroundColor: hexToRgba(ellipseColor, isDark ? 0.15 : 0.08),
            borderWidth: 1.5,
            pointRadius: 0,
            fill: true,
            tension: 0.1,
            order: 1
          }
        ]
      },
      options: {
        ...defaultOpts,
        animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
        interaction: {
          mode: 'nearest',
          axis: 'xy',
          intersect: false
        },
        plugins: {
          ...defaultOpts.plugins,
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              color: tokens.textPrimary,
              font: { family: tokens.fontFamily, size: 12 }
            }
          },
          tooltip: {
            ...defaultOpts.plugins.tooltip,
            callbacks: {
              label: (ctx) => {
                if (ctx.dataset.type === 'scatter') {
                  return `Observation : X = ${ctx.parsed.x}, Y = ${ctx.parsed.y}`;
                }
                return `Ellipse 95% (Corrélation r = ${pearsonR})`;
              }
            }
          }
        },
        scales: {
          x: {
            type: 'linear',
            ...defaultOpts.scales.x,
            grid: { color: tokens.gridColor },
            title: {
              display: true,
              text: 'Temps d\'attente (s)',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          },
          y: {
            type: 'linear',
            ...defaultOpts.scales.y,
            grid: { color: tokens.gridColor },
            title: {
              display: true,
              text: 'Score de satisfaction (0-100)',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          }
        }
      },
      plugins: [marginalPainterPlugin]
    };

    if (typeof Chart === 'undefined') return { config, kdeX, kdeY, ellipse, pearsonR, computeMarginalKDE, computeConfidenceEllipse, computePearsonR };
    return new Chart(canvas, config);
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeMarginalKDE,
    computeConfidenceEllipse,
    computePearsonR
  };
});
"""

joint_md = """# Scatter Plot + Distributions Marginales (Jointplot)

## 1. Fondements Scientifiques & Justification Cognitive
Le graphique conjoint associe un nuage de points bivarié central et les projections marginales 1D de chaque variable le long des axes (Tufte 1983, Silverman 1986).
En statistique multivariée, analyser uniquement les marges ($X$ et $Y$ séparément) peut masquer des corrélations fortes, tandis qu'analyser le scatter seul sans les densités marginales dissimule la présence de sous-populations multimodales sur un seul des axes.

### Citations Fondatrices
- **Tufte, E. R. (1983)**. *The Visual Display of Quantitative Information*. Graphics Press.
- **Silverman, B. W. (1986)**. *Density Estimation for Statistics and Data Analysis*.
- **Pearson, K. (1896)**. *Mathematical Contributions to the Theory of Evolution*. Phil. Trans. R. Soc.
- **Heer, J., Bostock, M., & Ogievetsky, V. (2010)**. *A Tour Through the Visualization Zoo*. ACM.

---

## 2. Formulation Mathématique Déterministe

### 2.1 Distributions Marginales
$$f_X(x) = \\int f(x,y) dy, \\quad f_Y(y) = \\int f(x,y) dx$$

### 2.2 Ellipse de Confiance Bivariée à 95%
$$(x - \\mu)^T \\Sigma^{-1} (x - \\mu) \\le \\chi^2_2(0.95) \\approx 5.991$$
où $\\Sigma = \\begin{pmatrix} \\sigma_x^2 & \\sigma_{xy} \\\\ \\sigma_{xy} & \\sigma_y^2 \\end{pmatrix}$ est la matrice de covariance empirique.

---

## 3. Double-Encodage & Garde-Fous Cognitifs
1. **Points 2D** : Observation directe des paires individuelles.
2. **Ellipse 95%** : Zone de covariance gaussienne pour apprécier la dispersion bidirectionnelle.
3. **Rubans marginaux** : Trajectoires KDE continues intégrées aux bordures du canvas.
"""

write_file("template/04-correlation-relation/joint-scatter-marginals/template.js", joint_js)
write_file("template/04-correlation-relation/joint-scatter-marginals/joint-scatter-marginals.md", joint_md)
write_file("guide/04-correlation-relation/joint-scatter-marginals.md", joint_md)
write_file("template/04-correlation-relation/joint-scatter-marginals/preview.html", preview_html(
    id_name="joint-scatter-marginals",
    title="Scatter Plot + Distributions Marginales (Jointplot)",
    subtitle="Nuage de points 2D central, densités marginales univariées KDE et ellipse de confiance bivariée à 95%",
    category="04-correlation-relation",
    when_use="Inspection approfondie de relations bivariées où la forme des distributions marginales de X et Y éclaire la corrélation globale.",
    benefit="Permet de déceler des bimodalités marginales invisibles sur le scatter simple tout en quantifiant la corrélation bivariée.",
    when_not="Espaces graphiques réduits (< 400px) où les rubans marginaux manquent de lisibilité.",
    alt="Utiliser Scatter Plot standard ou Matrix Heatmap pour les corrélations multiples."
))

# ==============================================================================
# 11. STACKED-TOTAL-LINE
# ==============================================================================
stacked_js = """/**
 * @file 02-composition-part-to-whole/stacked-total-line/template.js
 * @description Standardized Stacked Bar/Area + Macro Total Line Template for kit-charts.
 * Combines granular part-to-whole categorical breakdown and cumulative macro total trendline.
 */

(function(global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory(require('../../../themes/theme-tokens.js'));
  } else if (typeof define === 'function' && define.amd) {
    define(['../../../themes/theme-tokens.js'], factory);
  } else {
    global = typeof globalThis !== 'undefined' ? globalThis : global || self;
    var tokens = global.KitChartsTheme || (global.KitCharts && global.KitCharts.Theme) || {};
    var exp = factory(tokens);
    global.KitCharts = global.KitCharts || {};
    global.KitCharts['stacked-total-line'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.computeStackedTotals = exp.computeStackedTotals;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  function computeStackedTotals(datasets) {
    if (!Array.isArray(datasets) || datasets.length === 0) return [];
    const len = datasets[0].data.length;
    const totals = new Array(len).fill(0);
    datasets.forEach(ds => {
      ds.data.forEach((val, idx) => {
        totals[idx] += Number(val) || 0;
      });
    });
    return totals.map(v => Math.round(v * 10) / 10);
  }

  const DEFAULT_DATA = {
    labels: ['T1 2024', 'T2 2024', 'T3 2024', 'T4 2024', 'T1 2025', 'T2 2025', 'T3 2025', 'T4 2025'],
    datasets: [
      { label: 'Cloud SaaS', data: [120, 145, 170, 195, 230, 260, 290, 330] },
      { label: 'Services Pro', data: [80, 85, 90, 95, 90, 85, 80, 75] },
      { label: 'Licences On-Prem', data: [110, 100, 90, 80, 70, 60, 50, 40] }
    ]
  };

  function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
    const canvas = typeof canvasTarget === 'string'
      ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
      : canvasTarget;

    if (!canvas) throw new Error(`Canvas element "${canvasTarget}" not found`);

    if (typeof Chart !== 'undefined' && Chart.getChart) {
      const existing = Chart.getChart(canvas);
      if (existing) existing.destroy();
    }

    const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
    const tokens = getThemeTokens(themeName, container);
    const isDark = Boolean(tokens.isDark);

    const rawData = customData || DEFAULT_DATA;
    const labels = rawData.labels || DEFAULT_DATA.labels;
    const rawDatasets = rawData.datasets || DEFAULT_DATA.datasets;

    const totals = computeStackedTotals(rawDatasets);
    const totalColor = tokens.emphasis?.focal || (isDark ? '#ECEFF4' : '#0F172A');

    const processedDatasets = rawDatasets.map((ds, idx) => {
      const color = getColor(tokens, idx);
      return {
        type: 'bar',
        label: ds.label,
        data: ds.data,
        backgroundColor: hexToRgba(color, 0.85),
        borderColor: color,
        borderWidth: 1,
        stack: 'totalStack',
        order: 2
      };
    });

    processedDatasets.push({
      type: 'line',
      label: 'Chiffre d\'Affaires Total',
      data: totals,
      borderColor: totalColor,
      backgroundColor: totalColor,
      borderWidth: 3,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointBackgroundColor: totalColor,
      tension: 0.25,
      order: 1
    });

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'bar',
      data: {
        labels,
        datasets: processedDatasets
      },
      options: {
        ...defaultOpts,
        animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          ...defaultOpts.plugins,
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              color: tokens.textPrimary,
              font: { family: tokens.fontFamily, size: 12 }
            }
          },
          tooltip: {
            ...defaultOpts.plugins.tooltip,
            callbacks: {
              title: (items) => `Période : ${items[0].label}`,
              footer: (items) => {
                const totalVal = totals[items[0].dataIndex];
                return `Total Consolidé : ${totalVal.toLocaleString('fr-FR')} k€`;
              }
            }
          }
        },
        scales: {
          x: {
            ...defaultOpts.scales.x,
            stacked: true,
            grid: { display: false }
          },
          y: {
            ...defaultOpts.scales.y,
            stacked: true,
            beginAtZero: true,
            grid: { color: tokens.gridColor },
            title: {
              display: true,
              text: 'Revenu (k€)',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          }
        }
      }
    };

    if (typeof Chart === 'undefined') return { config, totals, computeStackedTotals };
    return new Chart(canvas, config);
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeStackedTotals
  };
});
"""

stacked_md = """# Barres Empilées + Ligne de Total (Stacked Total Combo)

## 1. Fondements Scientifiques & Justification Cognitive
Le combo **Barres Empilées + Ligne de Total** permet de répondre au paradoxe perceptif des graphiques empilés identifié par **Skau & Kosara (2016)** (*Arcs, Angles, or Areas: Individual Data Encodings in Pie and Donut Charts*, EuroVis) et **Heer & Robertson (2007)**.
Dans un empilement classique, seul le segment inférieur est aligné sur une ligne de base commune ($Y=0$). Les segments supérieurs subissent la gigue des composantes inférieures, rendant l'appréciation du total macro fastidieuse. La superposition d'une ligne de total sommée résout cette charge cognitive.

### Citations Fondatrices
- **Skau, D., & Kosara, R. (2016)**. *Arcs, Angles, or Areas: Individual Data Encodings*. EuroVis.
- **Heer, J., & Robertson, G. G. (2007)**. *Animated Transitions in Statistical Data Graphics*. IEEE TVCG.
- **Tufte, E. R. (1983)**. *The Visual Display of Quantitative Information*. Graphics Press.
- **Miller, G. A. (1956)**. *The Magical Number Seven, Plus or Minus Two*. Psychological Review.

---

## 2. Formulation Mathématique Déterministe

### 2.1 Somme Consolidée Macro
$$T(t) = \\sum_{k=1}^K S_k(t)$$
où $S_k(t)$ représente le montant du segment $k$ à la période $t$.

---

## 3. Double-Encodage & Garde-Fous Cognitifs
1. **Ligne de Total Hero** : Trait plein épais (3px) avec marqueurs discrets contrastés.
2. **Ordre stable des segments** : Préservation stricte de l'ordre des couches dans le temps (*Object Constancy*).
3. **Infobulle consolidée** : Détail des parts individuelles et total calculé dans le footer.
"""

write_file("template/02-composition-part-to-whole/stacked-total-line/template.js", stacked_js)
write_file("template/02-composition-part-to-whole/stacked-total-line/stacked-total-line.md", stacked_md)
write_file("guide/02-composition-part-to-whole/stacked-total-line.md", stacked_md)
write_file("template/02-composition-part-to-whole/stacked-total-line/preview.html", preview_html(
    id_name="stacked-total-line",
    title="Barres Empilées + Ligne de Total",
    subtitle="Décomposition part-to-whole des composantes & courbe de synthèse du total consolidé",
    category="02-composition-part-to-whole",
    when_use="Visualisation de revenus ou volumes multi-segments dans le temps pour suivre à la fois la bascule des parts et la trajectoire globale du total.",
    benefit="Supprime l'effort d'addition mentale en affichant directement la ligne de tendance globale au-dessus des segments empilés.",
    when_not="Comparaison fine et isolée entre segments intermédiaires.",
    alt="Utiliser Grouped Bar Chart pour comparer directement chaque composante sans empilement."
))

# ==============================================================================
# 12. GANTT-PROGRESS
# ==============================================================================
gantt_js = """/**
 * @file 06-flux-processus/gantt-progress/template.js
 * @description Standardized Gantt Schedule + Progress Fill + 'Today' Marker Template.
 * Visualizes project task lifecycles, progress completion percentages, and temporal milestones.
 */

(function(global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory(require('../../../themes/theme-tokens.js'));
  } else if (typeof define === 'function' && define.amd) {
    define(['../../../themes/theme-tokens.js'], factory);
  } else {
    global = typeof globalThis !== 'undefined' ? globalThis : global || self;
    var tokens = global.KitChartsTheme || (global.KitCharts && global.KitCharts.Theme) || {};
    var exp = factory(tokens);
    global.KitCharts = global.KitCharts || {};
    global.KitCharts['gantt-progress'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.computeGanttSchedule = exp.computeGanttSchedule;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  function computeGanttSchedule(tasks, todayWeek = 6) {
    return tasks.map(t => {
      const start = Number(t.start) || 0;
      const end = Number(t.end) || 0;
      const progress = Math.max(0, Math.min(100, Number(t.progress) || 0));
      const duration = end - start;
      const doneTime = start + (duration * (progress / 100));

      return {
        ...t,
        start,
        end,
        duration,
        progress,
        doneTime,
        isLate: todayWeek > doneTime && progress < 100
      };
    });
  }

  const DEFAULT_DATA = {
    labels: [
      '1. Spécifications & Cadrage',
      '2. Architecture & Schéma DB',
      '3. Développement API Core',
      '4. Intégration Frontend UI',
      '5. Tests E2E & Recette',
      '6. Déploiement Production'
    ],
    datasets: [{
      label: 'Planning Projet',
      todayWeek: 6.5,
      tasks: [
        { label: '1. Spécifications & Cadrage', start: 1, end: 4, progress: 100, category: 0 },
        { label: '2. Architecture & Schéma DB', start: 3, end: 6, progress: 100, category: 0 },
        { label: '3. Développement API Core', start: 5, end: 9, progress: 65, category: 1 },
        { label: '4. Intégration Frontend UI', start: 6, end: 11, progress: 30, category: 1 },
        { label: '5. Tests E2E & Recette', start: 9, end: 12, progress: 0, category: 2 },
        { label: '6. Déploiement Production', start: 11, end: 13, progress: 0, category: 2 }
      ]
    }]
  };

  function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
    const canvas = typeof canvasTarget === 'string'
      ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
      : canvasTarget;

    if (!canvas) throw new Error(`Canvas element "${canvasTarget}" not found`);

    if (typeof Chart !== 'undefined' && Chart.getChart) {
      const existing = Chart.getChart(canvas);
      if (existing) existing.destroy();
    }

    const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
    const tokens = getThemeTokens(themeName, container);
    const isDark = Boolean(tokens.isDark);

    const rawData = customData || DEFAULT_DATA;
    const labels = rawData.labels || DEFAULT_DATA.labels;
    const rawTasks = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].tasks) || DEFAULT_DATA.datasets[0].tasks;
    const todayWeek = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].todayWeek) || 6.5;

    const schedule = computeGanttSchedule(rawTasks, todayWeek);

    const todayColor = tokens.emphasis?.benchmark || tokens.status?.danger || '#CA0020';

    const ganttPainterPlugin = {
      id: 'kitChartsGanttPainter',
      afterDatasetsDraw(chart) {
        const { ctx, scales: { x, y }, chartArea } = chart;
        if (!x || !y || !chartArea) return;

        ctx.save();
        const n = schedule.length;
        const rowH = y.height / n;
        const barH = Math.min(22, rowH * 0.50);

        // 1. Tracé des sous-barres d'avancement interne (Progress fill)
        schedule.forEach((t, idx) => {
          const yCenter = y.getPixelForValue(idx);
          const xStart = x.getPixelForValue(t.start);
          const xEnd = x.getPixelForValue(t.end);
          const xDone = x.getPixelForValue(t.doneTime);
          const color = getColor(tokens, t.category || 0);

          // Barre d'avancement réel (opacité forte)
          if (t.progress > 0) {
            ctx.fillStyle = color;
            ctx.fillRect(xStart, yCenter - barH / 2, xDone - xStart, barH);
          }

          // Libellé de pourcentage %
          ctx.font = `600 11px ${tokens.fontMono || 'monospace'}`;
          ctx.fillStyle = isDark ? '#ECEFF4' : '#0F172A';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${t.progress}%`, xEnd + 8, yCenter);
        });

        // 2. Ligne repère "Aujourd'hui" (Now vertical line)
        const xToday = x.getPixelForValue(todayWeek);
        ctx.beginPath();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = todayColor;
        ctx.lineWidth = 2;
        ctx.moveTo(xToday, chartArea.top);
        ctx.lineTo(xToday, chartArea.bottom);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.font = `600 11px ${tokens.fontFamily}`;
        ctx.fillStyle = todayColor;
        ctx.textAlign = 'center';
        ctx.fillText('Aujourd\'hui (S6.5)', xToday, chartArea.top - 6);

        ctx.restore();
      }
    };

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Durée Prévue',
          data: schedule.map(t => [t.start, t.end]),
          backgroundColor: schedule.map(t => hexToRgba(getColor(tokens, t.category || 0), isDark ? 0.30 : 0.20)),
          borderColor: schedule.map(t => getColor(tokens, t.category || 0)),
          borderWidth: 1.5,
          borderRadius: 4
        }]
      },
      options: {
        ...defaultOpts,
        indexAxis: 'y',
        animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          ...defaultOpts.plugins,
          legend: { display: false },
          tooltip: {
            ...defaultOpts.plugins.tooltip,
            callbacks: {
              title: (items) => items[0].label,
              label: (ctx) => {
                const item = schedule[ctx.dataIndex];
                if (!item) return '';
                return [
                  `Période : Semaine ${item.start} à Semaine ${item.end} (${item.duration} sem.)`,
                  `Avancement : ${item.progress}% achevé`,
                  `Statut : ${item.progress === 100 ? 'Terminé' : (item.isLate ? 'En retard' : 'En cours')}`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            type: 'linear',
            ...defaultOpts.scales.x,
            min: 0,
            max: 14,
            grid: { color: tokens.gridColor },
            ticks: {
              stepSize: 1,
              callback: (val) => `S${val}`
            },
            title: {
              display: true,
              text: 'Calendrier (Semaines)',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          },
          y: {
            ...defaultOpts.scales.y,
            grid: { display: false }
          }
        }
      },
      plugins: [ganttPainterPlugin]
    };

    if (typeof Chart === 'undefined') return { config, schedule, computeGanttSchedule };
    return new Chart(canvas, config);
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeGanttSchedule
  };
});
"""

gantt_md = """# Gantt + Avancement + Repère "Aujourd'hui" (Gantt-Progress)

## 1. Fondements Scientifiques & Justification Cognitive
Le diagramme de Gantt avec progression et repère temporel synchronisé trouve son origine chez **Henry Gantt (1910–1917)** et la recherche préattentive sur les repères visuels verticaux (**Healey, Boothby & Enns 1996**).
Visualiser des barres de tâches sans repère temporel "maintenant" (*Now Line*) oblige l'analyste à des allers-retours oculaires constants entre l'axe temporel et chaque barre. Le trait d'accentuation vertical active le traitement préattentif instantané des retards.

### Citations Fondatrices
- **Gantt, H. L. (1916)**. *Work, Wages, and Profits*. The Engineering Magazine Co.
- **Healey, C. G., Booth, K. S., & Enns, J. T. (1996)**. *High-Speed Visual Estimation Using Preattentive Processing*. ACM TOCHI.
- **Heer, J., & Robertson, G. G. (2007)**. *Animated Transitions in Statistical Data Graphics*. IEEE TVCG.
- **Tufte, E. R. (1983)**. *The Visual Display of Quantitative Information*. Graphics Press.

---

## 2. Formulation Mathématique Déterministe

### 2.1 Avancement Temporel
Pour chaque tâche $i$ avec intervalle $[S_i, E_i]$ et avancement $p_i \in [0, 100]\%$ :
$$D_i = E_i - S_i, \\quad X_{\\text{done}, i} = S_i + D_i \\cdot \\left(\\frac{p_i}{100}\\right)$$
- Statut en retard (*Late*) si $T_{\\text{today}} > X_{\\text{done}, i}$ et $p_i < 100\\%$.

---

## 3. Double-Encodage & Garde-Fous Cognitifs
1. **Barre de tâche** : Fond translucide $(\\alpha = 0.20)$ marquant l'intervalle total prévu.
2. **Sous-barre d'avancement** : Remplissage opaque $(\\alpha = 0.85)$ indiquant le travail réel achevé.
3. **Repère Aujourd'hui** : Ligne pointillée préattentive (`tokens.emphasis.benchmark`).
"""

write_file("template/06-flux-processus/gantt-progress/template.js", gantt_js)
write_file("template/06-flux-processus/gantt-progress/gantt-progress.md", gantt_md)
write_file("guide/06-flux-processus/gantt-progress.md", gantt_md)
write_file("template/06-flux-processus/gantt-progress/preview.html", preview_html(
    id_name="gantt-progress",
    title="Gantt + Avancement + Ligne Repère",
    subtitle="Planning de projet avec barres flottantes d'intervalles, avancement interne et repère vertical préattentif",
    category="06-flux-processus",
    when_use="Pilotage de projets, suivi d'itérations produit et détection précoce des retards d'exécution.",
    benefit="Permet d'évaluer d'un seul regard si l'avancement d'une tâche est en avance ou en retard par rapport à la date du jour.",
    when_not="Projets massifs comportant plus de 30 tâches sans regroupement hiérarchique.",
    alt="Utiliser Table KPI Scorecard ou Timeline simplifiée pour les vues macro exécutives."
))

print("Lot 3 (P2) templates generated successfully!")
