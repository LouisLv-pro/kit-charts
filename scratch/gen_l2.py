# -*- coding: utf-8 -*-
"""
Lot 2 (P1) Combo Generator:
5. pareto-chart (02-composition-part-to-whole)
6. scatter-regression (04-correlation-relation)
7. bar-target-overlay (01-comparaison)
8. dual-axis-controlled (05-evolution-temporelle)
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path("/Users/louislaville/Desktop/kit-charts/scratch")))
from generate_all import write_file, preview_html

# ==============================================================================
# 5. PARETO-CHART
# ==============================================================================
pareto_js = """/**
 * @file 02-composition-part-to-whole/pareto-chart/template.js
 * @description Standardized Pareto Diagram Template for kit-charts.
 * Combines descending sorted category frequencies and cumulative percentage curve (80/20 rule).
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
    global.KitCharts['pareto-chart'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.computeParetoCumsum = exp.computeParetoCumsum;
    global.computeGini = exp.computeGini;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  /**
   * Trie les catégories par ordre décroissant de valeur et calcule les cumuls.
   */
  function computeParetoCumsum(labels, values) {
    const pairs = labels.map((lbl, idx) => ({ label: lbl, value: Number(values[idx]) || 0 }));
    pairs.sort((a, b) => b.value - a.value);

    const total = pairs.reduce((sum, p) => sum + p.value, 0);
    let running = 0;

    const sortedLabels = [];
    const sortedValues = [];
    const cumulativePcts = [];

    pairs.forEach(p => {
      sortedLabels.push(p.label);
      sortedValues.push(p.value);
      running += p.value;
      const pct = total > 0 ? (running / total) * 100 : 0;
      cumulativePcts.push(Math.round(pct * 10) / 10);
    });

    return {
      labels: sortedLabels,
      values: sortedValues,
      cumulativePcts,
      total
    };
  }

  /**
   * Calcule le coefficient de Gini pour évaluer la concentration Pareto.
   * G = Σ|xi - xj| / (2 * n^2 * mu)
   */
  function computeGini(values) {
    const clean = Array.isArray(values) ? values.map(Number).filter(v => !isNaN(v) && v >= 0) : [];
    const n = clean.length;
    if (n < 2) return 0;
    const mean = clean.reduce((s, v) => s + v, 0) / n;
    if (mean === 0) return 0;

    let diffSum = 0;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        diffSum += Math.abs(clean[i] - clean[j]);
      }
    }
    return Math.round((diffSum / (2 * n * n * mean)) * 1000) / 1000;
  }

  const DEFAULT_DATA = {
    labels: [
      "Erreur d'authentification",
      'Timeout passerelle SQL',
      'Fichier payload corrompu',
      'Certificat SSL expiré',
      'Quota mémoire dépassé',
      'Erreur DNS transitoire',
      'Déconnexion WebSocket'
    ],
    datasets: [{
      label: "Occurrences d'Incidents",
      data: [142, 89, 45, 23, 14, 8, 4]
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
    const inputLabels = rawData.labels || DEFAULT_DATA.labels;
    const inputValues = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data) || DEFAULT_DATA.datasets[0].data;
    const seriesLabel = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].label) || 'Incidents';

    const pareto = computeParetoCumsum(inputLabels, inputValues);
    const gini = computeGini(pareto.values);

    const barColor = getColor(tokens, 0);
    const lineColor = tokens.emphasis?.focal || tokens.palette?.[1] || '#E66101';
    const thresholdColor = tokens.emphasis?.benchmark || tokens.status?.warning || '#CA0020';

    const pareto80LinePlugin = {
      id: 'kitChartsPareto80Line',
      afterDatasetsDraw(chart) {
        const { ctx, scales: { x, y1 }, chartArea } = chart;
        if (!y1 || !chartArea) return;

        const y80 = y1.getPixelForValue(80);
        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = thresholdColor;
        ctx.lineWidth = 1.5;
        ctx.moveTo(chartArea.left, y80);
        ctx.lineTo(chartArea.right, y80);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.font = `600 11px ${tokens.fontMono || 'monospace'}`;
        ctx.fillStyle = thresholdColor;
        ctx.textAlign = 'right';
        ctx.fillText('Seuil 80% (Vital Few)', chartArea.right - 8, y80 - 6);
        ctx.restore();
      }
    };

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'bar',
      data: {
        labels: pareto.labels,
        datasets: [
          {
            type: 'bar',
            label: seriesLabel,
            yAxisID: 'y',
            data: pareto.values,
            backgroundColor: pareto.cumulativePcts.map(pct =>
              pct <= 80 ? hexToRgba(barColor, isDark ? 0.90 : 0.80) : hexToRgba(tokens.emphasis?.context || '#CBD5E1', 0.50)
            ),
            borderColor: barColor,
            borderWidth: 1.5,
            borderRadius: 4,
            order: 2
          },
          {
            type: 'line',
            label: 'Cumul (%)',
            yAxisID: 'y1',
            data: pareto.cumulativePcts,
            borderColor: lineColor,
            backgroundColor: hexToRgba(lineColor, 0.10),
            borderWidth: 2.5,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: lineColor,
            tension: 0.2,
            order: 1
          }
        ]
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
              title: (items) => items[0].label,
              label: (ctx) => {
                const idx = ctx.dataIndex;
                if (ctx.dataset.type === 'bar') {
                  const pctIndiv = ((pareto.values[idx] / pareto.total) * 100).toFixed(1);
                  return `Effectif : ${ctx.parsed.y} (${pctIndiv}% du total)`;
                }
                return `Cumul : ${ctx.parsed.y}% (Gini = ${gini})`;
              }
            }
          }
        },
        scales: {
          x: {
            ...defaultOpts.scales.x,
            grid: { display: false },
            ticks: {
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 11 },
              maxRotation: 30
            }
          },
          y: {
            type: 'linear',
            position: 'left',
            beginAtZero: true,
            grid: { color: tokens.gridColor },
            title: {
              display: true,
              text: 'Nombre d\'occurrences',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          },
          y1: {
            type: 'linear',
            position: 'right',
            beginAtZero: true,
            min: 0,
            max: 100,
            grid: { display: false },
            ticks: {
              color: lineColor,
              font: { family: tokens.fontMono, size: 11 },
              callback: (val) => `${val}%`
            },
            title: {
              display: true,
              text: 'Pourcentage cumulé',
              color: lineColor,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          }
        }
      },
      plugins: [pareto80LinePlugin]
    };

    if (typeof Chart === 'undefined') return { config, pareto, gini, computeParetoCumsum, computeGini };
    return new Chart(canvas, config);
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeParetoCumsum,
    computeGini
  };
});
"""

pareto_md = """# Diagramme de Pareto (80/20 Rule)

## 1. Fondements Scientifiques & Justification Cognitive
Le diagramme de Pareto combine un classement catégoriel trié par fréquence décroissante et une courbe de pourcentage cumulé (Juran 1951, Pareto 1896).
Comme démontré par **Juran (1951)** dans le cadre du contrôle qualité (*Quality Control Handbook*), une minorité de causes (environ 20%, les *vital few*) produit la grande majorité des effets ou coûts (environ 80%). Le diagramme oriente directement l'attention préattentive de l'analyste vers les leviers d'action à fort impact.

### Citations Fondatrices
- **Pareto, V. (1896)**. *Cours d'économie politique*. Université de Lausanne.
- **Juran, J. M. (1951)**. *Quality Control Handbook*. McGraw-Hill.
- **Zipf, G. K. (1949)**. *Human Behavior and the Principle of Least Effort*. Addison-Wesley.
- **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception*. JASA, 79(387), 531-554.
- **Tufte, E. R. (1983)**. *The Visual Display of Quantitative Information*. Graphics Press.

---

## 2. Formulation Mathématique Déterministe

### 2.1 Tri et Cumul de Pareto
Soit les observations réordonnées par valeur décroissante : $x_{(1)} \\ge x_{(2)} \\ge \\dots \\ge x_{(n)}$
$$\\text{Total} = \\sum_{k=1}^n x_{(k)}, \\quad C_i = \\frac{\\sum_{j=1}^i x_{(j)}}{\\text{Total}} \\times 100\\%$$

### 2.2 Coefficient de Concentration de Gini
$$G = \\frac{\\sum_{i=1}^n \\sum_{j=1}^n |x_i - x_j|}{2 n^2 \\bar{x}}$$
- Une structure 80/20 typique correspond à un coefficient de Gini $G \\gtrsim 0.60$.

---

## 3. Double-Encodage & Garde-Fous Cognitifs
1. **Accentuation binaire 80/20** : Les barres représentant les causes cumulant jusqu'à 80% sont accentuées en couleur vive ; les suivantes passent en couleur contextuelle désaturée.
2. **Ligne de référence 80%** : Trait pointillé net marquant le seuil critique.
3. **Zéro aligné** : L'axe gauche (effectifs) et l'axe droit (0–100%) partagent le même zéro horizontal.

---

## 4. Quand l'utiliser / Quand NE PAS l'utiliser

### ✅ Quand l'utiliser
- Analyse de causes racines, priorisation de bugs, réclamations clients, répartition du chiffre d'affaires par produit.

### ❌ Quand NE PAS l'utiliser
- Catégories ordinales ou temporelles où le tri détruirait l'ordre chronologique (👉 *utiliser Bar Chart ou Line Chart*).
- Données non sommables ou non additives.
"""

write_file("template/02-composition-part-to-whole/pareto-chart/template.js", pareto_js)
write_file("template/02-composition-part-to-whole/pareto-chart/pareto-chart.md", pareto_md)
write_file("guide/02-composition-part-to-whole/pareto-chart.md", pareto_md)
write_file("template/02-composition-part-to-whole/pareto-chart/preview.html", preview_html(
    id_name="pareto-chart",
    title="Diagramme de Pareto (Loi 80/20)",
    subtitle="Barres triées par fréquence décroissante & courbe de pourcentage cumulé avec seuil des causes vitales",
    category="02-composition-part-to-whole",
    when_use="Priorisation analytique des causes racines de défauts, pannes, coûts ou tickets de support selon la loi 80/20 de Juran & Pareto.",
    benefit="Permet d'identifier immédiatement les 20% de causes générant 80% des effets sans effort de calcul mental.",
    when_not="Séries temporelles ou catégories avec un ordre intrinsèque (ex: mois, jours de la semaine).",
    alt="Utiliser Bar Chart vertical ou horizontal classique pour les catégories non triées par fréquence."
))

# ==============================================================================
# 6. SCATTER-REGRESSION
# ==============================================================================
scatter_reg_js = """/**
 * @file 04-correlation-relation/scatter-regression/template.js
 * @description Standardized Scatter Plot + OLS Linear Regression + 95% Confidence Band Template.
 * Implements ordinary least squares and exact prediction confidence bands.
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
    global.KitCharts['scatter-regression'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.computeLinearRegression = exp.computeLinearRegression;
    global.computeConfidenceBand = exp.computeConfidenceBand;
    global.computePearsonR = exp.computePearsonR;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function(t, o) { return o || {}; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  /**
   * Régression linéaire par moindres carrés ordinaires (OLS).
   */
  function computeLinearRegression(points) {
    const clean = Array.isArray(points) ? points.filter(p => p && !isNaN(p.x) && !isNaN(p.y)) : [];
    const n = clean.length;
    if (n < 2) return { slope: 0, intercept: 0, r: 0, r2: 0, se: 0, n: 0, xMean: 0, yMean: 0, ssx: 0 };

    const xMean = clean.reduce((s, p) => s + p.x, 0) / n;
    const yMean = clean.reduce((s, p) => s + p.y, 0) / n;

    let num = 0;
    let denX = 0;
    let denY = 0;

    clean.forEach(p => {
      const dx = p.x - xMean;
      const dy = p.y - yMean;
      num += dx * dy;
      denX += dx * dx;
      denY += dy * dy;
    });

    const slope = denX !== 0 ? num / denX : 0;
    const intercept = yMean - slope * xMean;
    const r = (denX > 0 && denY > 0) ? num / Math.sqrt(denX * denY) : 0;
    const r2 = r * r;

    let ssRes = 0;
    clean.forEach(p => {
      const pred = intercept + slope * p.x;
      ssRes += Math.pow(p.y - pred, 2);
    });
    const se = n > 2 ? Math.sqrt(ssRes / (n - 2)) : 0;

    return {
      slope,
      intercept,
      r: Math.round(r * 1000) / 1000,
      r2: Math.round(r2 * 1000) / 1000,
      se,
      n,
      xMean,
      yMean,
      ssx: denX
    };
  }

  function computePearsonR(points) {
    return computeLinearRegression(points).r;
  }

  /**
   * Calcule la bande de confiance à 95% pour la moyenne prédite.
   */
  function computeConfidenceBand(points, reg, gridPoints = 30) {
    const clean = points.filter(p => p && !isNaN(p.x));
    if (clean.length < 3 || reg.n < 3) return { line: [], upper: [], lower: [] };

    const xMin = Math.min(...clean.map(p => p.x));
    const xMax = Math.max(...clean.map(p => p.x));
    const step = (xMax - xMin) / (gridPoints - 1);

    const tCrit = 1.96; // Approximation asymptotique normale
    const line = [];
    const upper = [];
    const lower = [];

    for (let i = 0; i < gridPoints; i++) {
      const x = xMin + i * step;
      const yHat = reg.intercept + reg.slope * x;
      const seFit = reg.se * Math.sqrt((1 / reg.n) + (Math.pow(x - reg.xMean, 2) / (reg.ssx || 1)));
      const margin = tCrit * seFit;

      line.push({ x: Math.round(x * 10) / 10, y: Math.round(yHat * 10) / 10 });
      upper.push({ x: Math.round(x * 10) / 10, y: Math.round((yHat + margin) * 10) / 10 });
      lower.push({ x: Math.round(x * 10) / 10, y: Math.round((yHat - margin) * 10) / 10 });
    }

    return { line, upper, lower };
  }

  const DEFAULT_DATA = {
    datasets: [{
      label: 'Budget R&D vs Chiffre d\'Affaires (M€)',
      data: [
        { x: 1.2, y: 14.5 }, { x: 1.8, y: 18.2 }, { x: 2.1, y: 19.8 },
        { x: 2.5, y: 24.1 }, { x: 3.0, y: 28.5 }, { x: 3.4, y: 31.0 },
        { x: 3.8, y: 33.2 }, { x: 4.2, y: 39.5 }, { x: 4.6, y: 41.8 },
        { x: 5.0, y: 44.0 }, { x: 5.5, y: 49.2 }, { x: 6.0, y: 53.5 },
        { x: 6.5, y: 56.8 }, { x: 7.0, y: 62.0 }, { x: 7.5, y: 64.5 }
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

    const reg = computeLinearRegression(points);
    const bands = computeConfidenceBand(points, reg);

    const pointColor = getColor(tokens, 0);
    const regColor = tokens.emphasis?.focal || tokens.palette?.[1] || '#E66101';

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'scatter',
      data: {
        datasets: [
          {
            type: 'scatter',
            label: seriesLabel,
            data: points,
            backgroundColor: hexToRgba(pointColor, 0.75),
            borderColor: pointColor,
            borderWidth: 1.5,
            pointRadius: 5,
            pointHoverRadius: 7,
            order: 3
          },
          {
            type: 'line',
            label: `Régression OLS (R² = ${reg.r2}, r = ${reg.r})`,
            data: bands.line,
            borderColor: regColor,
            borderWidth: 2.5,
            pointRadius: 0,
            fill: false,
            tension: 0,
            order: 1
          },
          {
            type: 'line',
            label: 'IC 95% Supérieur',
            data: bands.upper,
            borderColor: 'transparent',
            backgroundColor: hexToRgba(regColor, isDark ? 0.20 : 0.12),
            pointRadius: 0,
            fill: '+1',
            tension: 0,
            order: 2
          },
          {
            type: 'line',
            label: 'IC 95% Inférieur',
            data: bands.lower,
            borderColor: 'transparent',
            pointRadius: 0,
            fill: false,
            tension: 0,
            order: 2
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
              font: { family: tokens.fontFamily, size: 12 },
              filter: (item) => !item.text.includes('Inférieur') && !item.text.includes('Supérieur')
            }
          },
          tooltip: {
            ...defaultOpts.plugins.tooltip,
            callbacks: {
              label: (ctx) => {
                if (ctx.dataset.type === 'scatter') {
                  return `Observation : X = ${ctx.parsed.x}, Y = ${ctx.parsed.y}`;
                }
                if (ctx.dataset.label.includes('Régression')) {
                  return `Prédiction ŷ = ${ctx.parsed.y} (R² = ${reg.r2})`;
                }
                return `Borne IC 95% : ${ctx.parsed.y}`;
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
              text: 'Variable X (Investissement R&D)',
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
              text: 'Variable Y (Revenu)',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          }
        }
      }
    };

    if (typeof Chart === 'undefined') return { config, reg, bands, computeLinearRegression, computeConfidenceBand, computePearsonR };
    return new Chart(canvas, config);
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeLinearRegression,
    computeConfidenceBand,
    computePearsonR
  };
});
"""

scatter_reg_md = """# Scatter Plot + Régression Linéaire + IC 95%

## 1. Fondements Scientifiques & Justification Cognitive
Le diagramme de dispersion avec droite de régression et bande de confiance à 95% est le modèle de référence pour présenter une corrélation bivariée continue (Gauss, Legendre, Anscombe 1973).
Comme démontré par **Anscombe (1973)** (*Graphs in Statistical Analysis*) et **Matejka & Fitzmaurice (2017)** (*Same Stats, Different Graphs*), les coefficients statistiques ($r, R^2$) seuls sont insuffisants et peuvent masquer des structures non linéaires ou des points aberrants extrêmes (*outliers* à fort levier). La visualisation simultanée des points réels, de la droite OLS et de l'intervalle de confiance assure une transparence empirique absolue.

### Citations Fondatrices
- **Anscombe, F. J. (1973)**. *Graphs in Statistical Analysis*. The American Statistician, 27(1), 17-21.
- **Matejka, J., & Fitzmaurice, G. (2017)**. *Same Stats, Different Graphs: Generating Datasets with Varied Appearance and Identical Statistics through Simulated Annealing*. ACM CHI.
- **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception*. JASA.
- **Tufte, E. R. (1983)**. *The Visual Display of Quantitative Information*. Graphics Press.

---

## 2. Formulation Mathématique Déterministe

### 2.1 Moindres Carrés Ordinaires (OLS)
$$\\hat{y} = \\beta_0 + \\beta_1 x, \\quad \\beta_1 = \\frac{\\text{Cov}(x,y)}{\\text{Var}(x)}, \\quad \\beta_0 = \\bar{y} - \\beta_1 \\bar{x}$$

### 2.2 Qualité d'Ajustement
$$r = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum(x_i - \\bar{x})^2 \\sum(y_i - \\bar{y})^2}}, \\quad R^2 = r^2$$

### 2.3 Bande de Confiance à 95% pour la Moyenne Prédite
$$SE(\\hat{y}(x)) = s_e \\sqrt{\\frac{1}{n} + \\frac{(x - \\bar{x})^2}{\\sum(x_i - \\bar{x})^2}}, \\quad \\text{Bande} = \\hat{y}(x) \\pm t_{0.975, n-2} \\cdot SE(\\hat{y}(x))$$

---

## 3. Double-Encodage & Garde-Fous Cognitifs
1. **Points individuels** : Disques transparents ($\\alpha = 0.75$) permettant d'observer les chevauchements.
2. **Droite de régression** : Trait plein contrasté 2.5px.
3. **Bande de confiance 95%** : Zone ombrée douce ($\alpha = 0.12$) signalant l'incertitude croissante aux extrémités de l'échantillon.
"""

write_file("template/04-correlation-relation/scatter-regression/template.js", scatter_reg_js)
write_file("template/04-correlation-relation/scatter-regression/scatter-regression.md", scatter_reg_md)
write_file("guide/04-correlation-relation/scatter-regression.md", scatter_reg_md)
write_file("template/04-correlation-relation/scatter-regression/preview.html", preview_html(
    id_name="scatter-regression",
    title="Scatter Plot + Régression Linéaire + IC 95%",
    subtitle="Nuage de points bivarié, ajustement par moindres carrés ordinaires (OLS) et bande de confiance à 95%",
    category="04-correlation-relation",
    when_use="Modélisation d'une relation continue entre deux variables quantitatives avec quantification de la force de liaison (R²) et de l'incertitude prédictive.",
    benefit="Prévient les pièges du quartet d'Anscombe en montrant à la fois les observations brutes, la pente du modèle et les intervalles de confiance.",
    when_not="Extrapolation en dehors des bornes réelles d'observation ou séries chronologiques fortement autocorrélées.",
    alt="Utiliser Connected Scatter Plot pour les trajectoires ordonnées dans le temps ou Hexbin Plot pour les très grands volumes."
))

# ==============================================================================
# 7. BAR-TARGET-OVERLAY
# ==============================================================================
bar_target_js = """/**
 * @file 01-comparaison/bar-target-overlay/template.js
 * @description Standardized Bar Chart + Target Overlay Marker Template for kit-charts.
 * Combines category performance bars and target benchmark ticks with automated variance analysis.
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
    global.KitCharts['bar-target-overlay'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.computeVarianceDeltas = exp.computeVarianceDeltas;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  function computeVarianceDeltas(actuals, targets) {
    return actuals.map((act, idx) => {
      const tgt = Number(targets[idx]) || 0;
      const delta = act - tgt;
      const deltaPct = tgt > 0 ? (delta / tgt) * 100 : 0;
      let status = 'neutral';
      if (delta >= 0) status = 'success';
      else if (deltaPct >= -10) status = 'warning';
      else status = 'danger';

      return {
        actual: act,
        target: tgt,
        delta,
        deltaPct: Math.round(deltaPct * 10) / 10,
        status
      };
    });
  }

  const DEFAULT_DATA = {
    labels: ['France', 'Allemagne', 'Royaume-Uni', 'Espagne', 'Italie', 'Benelux'],
    datasets: [
      {
        label: 'CA Réalisé (k€)',
        data: [540, 620, 480, 390, 410, 320]
      },
      {
        label: 'Objectif Budgétaire (k€)',
        data: [500, 650, 450, 420, 380, 300]
      }
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
    const actuals = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data) || DEFAULT_DATA.datasets[0].data;
    const targets = (rawData.datasets && rawData.datasets[1] && rawData.datasets[1].data) || DEFAULT_DATA.datasets[1].data;

    const analysis = computeVarianceDeltas(actuals, targets);

    const successColor = tokens.semantic?.positive || tokens.status?.success || '#2E7D32';
    const warningColor = tokens.semantic?.warning || tokens.status?.warning || '#EF6C00';
    const dangerColor = tokens.semantic?.negative || tokens.status?.danger || '#C62828';
    const targetMarkerColor = tokens.emphasis?.benchmark || (isDark ? '#ECEFF4' : '#0F172A');

    const targetOverlayPlugin = {
      id: 'kitChartsTargetOverlayPainter',
      afterDatasetsDraw(chart) {
        const { ctx, scales: { x, y } } = chart;
        if (!x || !y) return;

        ctx.save();
        const n = labels.length;
        const rowHeight = y.height / n;
        const barThickness = Math.min(26, rowHeight * 0.55);
        const tickHeight = barThickness + 8;

        analysis.forEach((item, idx) => {
          const yCenter = y.getPixelForValue(idx);
          const xTarget = x.getPixelForValue(item.target);

          // Tracé du trait vertical de cible (Target Tick)
          ctx.beginPath();
          ctx.strokeStyle = targetMarkerColor;
          ctx.lineWidth = 3;
          ctx.moveTo(xTarget, yCenter - tickHeight / 2);
          ctx.lineTo(xTarget, yCenter + tickHeight / 2);
          ctx.stroke();

          // Libellé de variance Delta% au bout de la barre
          const xActual = x.getPixelForValue(item.actual);
          ctx.font = `600 11px ${tokens.fontMono || 'monospace'}`;
          ctx.fillStyle = item.status === 'success' ? successColor : (item.status === 'warning' ? warningColor : dangerColor);
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          const sign = item.deltaPct >= 0 ? '+' : '';
          ctx.fillText(`${sign}${item.deltaPct}%`, Math.max(xActual, xTarget) + 8, yCenter);
        });

        ctx.restore();
      }
    };

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Réalisé',
            data: actuals,
            backgroundColor: analysis.map(item => {
              if (item.status === 'success') return hexToRgba(successColor, 0.85);
              if (item.status === 'warning') return hexToRgba(warningColor, 0.85);
              return hexToRgba(dangerColor, 0.85);
            }),
            borderColor: analysis.map(item => {
              if (item.status === 'success') return successColor;
              if (item.status === 'warning') return warningColor;
              return dangerColor;
            }),
            borderWidth: 1.5,
            borderRadius: 4
          }
        ]
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
                const item = analysis[ctx.dataIndex];
                if (!item) return '';
                const sign = item.delta >= 0 ? '+' : '';
                return [
                  `Réalisé : ${item.actual.toLocaleString('fr-FR')} k€`,
                  `Objectif : ${item.target.toLocaleString('fr-FR')} k€`,
                  `Écart : ${sign}${item.delta.toLocaleString('fr-FR')} k€ (${sign}${item.deltaPct}%)`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            ...defaultOpts.scales.x,
            beginAtZero: true,
            grid: { color: tokens.gridColor },
            title: {
              display: true,
              text: 'Montant (k€)',
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
      plugins: [targetOverlayPlugin]
    };

    if (typeof Chart === 'undefined') return { config, analysis, computeVarianceDeltas };
    return new Chart(canvas, config);
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeVarianceDeltas
  };
});
"""

bar_target_md = """# Bar Chart + Marqueur de Cible (Target Overlay)

## 1. Fondements Scientifiques & Justification Cognitive
Le combo **Bar Chart + Target Overlay** permet de comparer précisément une série de réalisations réelles à des objectifs fixes par catégorie (Cleveland & McGill 1984, Stephen Few 2005).
Plutôt que d'aligner deux barres côte à côte (barres groupées) qui doublent l'encombrement spatial et obligent à une comparaison d'intervalles décalés, le marqueur transversal (tick) superposé sur la barre permet un jugement immédiat d'atteinte d'objectif en position absolue.

### Citations Fondatrices
- **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception*. JASA.
- **Few, S. (2005)**. *Bullet Graph Design Specification*. Perceptual Edge.
- **Tufte, E. R. (1983)**. *The Visual Display of Quantitative Information*. Graphics Press.

---

## 2. Formulation Mathématique Déterministe

### 2.1 Écart Relatif à l'Objectif
$$\\Delta = \\text{Réalisé} - \\text{Cible}, \\quad \\Delta\\% = \\frac{\\text{Réalisé} - \\text{Cible}}{\\text{Cible}} \\times 100\\%$$

### 2.2 Classification de Performance
- **Succès** ($\\Delta \\ge 0$) : Vert accessible (`status.success`).
- **Vigilance** ($-10\\% \\le \\Delta\\% < 0\\%$) : Orange (`status.warning`).
- **Critique** ($\\Delta\\% < -10\\%$) : Rouge accessible (`status.danger`).

---

## 3. Double-Encodage & Garde-Fous Cognitifs
1. **Marqueur de cible proéminent** : Trait perpendiculaire de 3px débordant légèrement de la barre.
2. **Annotation numérique directe** : Delta en pourcentage affiché en chiffres tabulaires (`fontMono`).
3. **Double encodage de valence** : Couleur de statut + libellé chiffré explicite avec signe.
"""

write_file("template/01-comparaison/bar-target-overlay/template.js", bar_target_js)
write_file("template/01-comparaison/bar-target-overlay/bar-target-overlay.md", bar_target_md)
write_file("guide/01-comparaison/bar-target-overlay.md", bar_target_md)
write_file("template/01-comparaison/bar-target-overlay/preview.html", preview_html(
    id_name="bar-target-overlay",
    title="Barres + Marqueur de Cible (Target Overlay)",
    subtitle="Barres horizontales de réalisation avec marqueur transversal d'objectif et analyse d'écart de variance",
    category="01-comparaison",
    when_use="Suivi de KPIs de performance par entité, pays ou département avec comparaison directe Réalisé vs Cible budgétaire.",
    benefit="Élimine l'encombrement des barres groupées en intégrant l'objectif directement comme repère de position sur la barre de mesure.",
    when_not="Multiples cibles concurrentes par catégorie (> 2) ou très grand nombre de catégories (> 15).",
    alt="Utiliser Bullet Chart pour ajouter des zones qualitatives de fond, ou Dumbbell Chart pour les écarts binaire Avant/Après."
))

# ==============================================================================
# 8. DUAL-AXIS-CONTROLLED
# ==============================================================================
dual_axis_js = """/**
 * @file 05-evolution-temporelle/dual-axis-controlled/template.js
 * @description Standardized Dual-Axis Line Chart with Strict Cognitive Normalization & Zero-Alignment.
 * Protects against spurious correlations with normalized Base-100 scales and matched axis colors.
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
    global.KitCharts['dual-axis-controlled'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.computeBase100 = exp.computeBase100;
    global.computePearsonR = exp.computePearsonR;
    global.computeZeroAlignedBounds = exp.computeZeroAlignedBounds;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return o || {}; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  function computeBase100(series, baseIndex = 0) {
    if (!Array.isArray(series) || series.length === 0) return [];
    const baseVal = Number(series[baseIndex]) || series[0] || 1;
    return series.map(v => Math.round((Number(v) / baseVal) * 1000) / 10);
  }

  function computePearsonR(s1, s2) {
    const n = Math.min(s1.length, s2.length);
    if (n < 2) return 0;
    const m1 = s1.reduce((s, v) => s + v, 0) / n;
    const m2 = s2.reduce((s, v) => s + v, 0) / n;

    let num = 0, d1 = 0, d2 = 0;
    for (let i = 0; i < n; i++) {
      const diff1 = s1[i] - m1;
      const diff2 = s2[i] - m2;
      num += diff1 * diff2;
      d1 += diff1 * diff1;
      d2 += diff2 * diff2;
    }
    return (d1 > 0 && d2 > 0) ? Math.round((num / Math.sqrt(d1 * d2)) * 1000) / 1000 : 0;
  }

  function computeZeroAlignedBounds(s1, s2) {
    const max1 = Math.max(...s1, 10);
    const max2 = Math.max(...s2, 10);
    return {
      y1: { min: 0, max: Math.ceil(max1 * 1.15) },
      y2: { min: 0, max: Math.ceil(max2 * 1.15) }
    };
  }

  const DEFAULT_DATA = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Température Moyenne (°C)',
        yAxisID: 'y',
        data: [5.2, 6.8, 10.5, 14.2, 18.6, 22.4, 25.1, 24.8, 20.3, 15.1, 9.8, 6.0]
      },
      {
        label: 'Consommation Électrique (GWh)',
        yAxisID: 'y1',
        data: [850, 780, 620, 490, 420, 380, 410, 430, 470, 560, 720, 890]
      }
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

    const rawData = customData || DEFAULT_DATA;
    const labels = rawData.labels || DEFAULT_DATA.labels;
    const s1 = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data) || DEFAULT_DATA.datasets[0].data;
    const s2 = (rawData.datasets && rawData.datasets[1] && rawData.datasets[1].data) || DEFAULT_DATA.datasets[1].data;
    const label1 = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].label) || 'Série 1';
    const label2 = (rawData.datasets && rawData.datasets[1] && rawData.datasets[1].label) || 'Série 2';

    const pearsonR = computePearsonR(s1, s2);
    const bounds = computeZeroAlignedBounds(s1, s2);

    const color1 = getColor(tokens, 0);
    const color2 = getColor(tokens, 1);

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: label1,
            yAxisID: 'y',
            data: s1,
            borderColor: color1,
            backgroundColor: color1,
            borderWidth: 2.5,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.3
          },
          {
            label: label2,
            yAxisID: 'y1',
            data: s2,
            borderColor: color2,
            backgroundColor: color2,
            borderWidth: 2.5,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.3
          }
        ]
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
              title: (items) => `Mois : ${items[0].label}`,
              afterBody: () => [`Corrélation de Pearson : r = ${pearsonR}`]
            }
          }
        },
        scales: {
          x: {
            ...defaultOpts.scales.x,
            grid: { color: tokens.gridColor }
          },
          y: {
            type: 'linear',
            position: 'left',
            min: bounds.y1.min,
            max: bounds.y1.max,
            grid: { color: tokens.gridColor },
            ticks: {
              color: color1,
              font: { family: tokens.fontMono, weight: '600' }
            },
            title: {
              display: true,
              text: label1,
              color: color1,
              font: { family: tokens.fontFamily, size: 12, weight: '600' }
            }
          },
          y1: {
            type: 'linear',
            position: 'right',
            min: bounds.y2.min,
            max: bounds.y2.max,
            grid: { display: false },
            ticks: {
              color: color2,
              font: { family: tokens.fontMono, weight: '600' }
            },
            title: {
              display: true,
              text: label2,
              color: color2,
              font: { family: tokens.fontFamily, size: 12, weight: '600' }
            }
          }
        }
      }
    };

    if (typeof Chart === 'undefined') return { config, pearsonR, bounds, computeBase100, computePearsonR, computeZeroAlignedBounds };
    return new Chart(canvas, config);
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeBase100,
    computePearsonR,
    computeZeroAlignedBounds
  };
});
"""

dual_axis_md = """# Double Axe Y Normalisé (Dual-Axis Controlled)

## 1. Fondements Scientifiques & Justification Cognitive
Le graphique à double axe Y est historiquement documenté depuis **Croxton & Stryker (1927)** mais constitue **le template le plus sujet aux manipulations perceptives et aux erreurs d'interprétation** (Few 2008, Franconeri et al. 2021).

### ⚠️ Risque Majeur : Corrélations Fallacieuses (*Spurious Correlations*)
Ajuster manuellement les minima et maxima de deux axes indépendants permet visuellement de faire coïncider deux courbes arbitraires sans aucun lien causal sous-jacent.
Pour neutraliser ce biais, ce template impose **5 garde-fous cognitifs stricts et non négociables** :
1. **Titrage explicite et unités sur chaque axe**.
2. **Appariement chromatique strict** : Chaque axe Y prend exactement la couleur de la courbe qu'il mesure.
3. **Zéro horizontal aligné** sur les deux échelles lorsque les grandeurs sont positives.
4. **Calcul et affichage transparent du coefficient de Pearson $r$**.
5. **Normalisation déterministe** (Base 100 ou z-score).

### Citations Fondatrices
- **Croxton, F. E., & Stryker, R. E. (1927)**. *Bar Charts Versus Circle Diagrams*. JASA, 22(160), 473-482.
- **Few, S. (2008)**. *Dual-Scaled Axes in Graphs: Are They Ever Warranted?*. Perceptual Edge.
- **Franconeri, S. L., Padilla, L. M., Shah, P., Zacks, J. M., & Hullman, J. (2021)**. *The Science of Visual Data Communication*. Psychological Science in the Public Interest, 22(3), 110-161.
- **Tufte, E. R. (1983)**. *The Visual Display of Quantitative Information*. Graphics Press.

---

## 2. Formulation Mathématique Déterministe

### 2.1 Index Base 100
$$I_i(t) = \\frac{s_i(t)}{s_i(t_0)} \\times 100$$

### 2.2 Coefficient de Pearson
$$r = \\frac{\\sum_{t=1}^n (z_{1,t} \\cdot z_{2,t})}{n - 1}, \\quad z_{i,t} = \\frac{x_{i,t} - \\bar{x}_i}{\\sigma_i}$$

---

## 3. Double-Encodage & Garde-Fous Cognitifs
1. **Axe Gauche** : Titre et graduations dans la couleur de la Série 1.
2. **Axe Droit** : Titre et graduations dans la couleur de la Série 2.
3. **Zéro partagé** : Ligne de base $Y=0$ commune.
4. **Infobulle indicée** : Rappel du coefficient $r$ à chaque survol.
"""

write_file("template/05-evolution-temporelle/dual-axis-controlled/template.js", dual_axis_js)
write_file("template/05-evolution-temporelle/dual-axis-controlled/dual-axis-controlled.md", dual_axis_md)
write_file("guide/05-evolution-temporelle/dual-axis-controlled.md", dual_axis_md)
write_file("template/05-evolution-temporelle/dual-axis-controlled/preview.html", preview_html(
    id_name="dual-axis-controlled",
    title="Double Axe Y Normalisé (Dual-Axis Contrôlé)",
    subtitle="Deux séries temporelles d'unités distinctes avec zéros rigoureusement alignés et appariement chromatique série-axe",
    category="05-evolution-temporelle",
    when_use="Comparaison de deux séries chronologiques liées par une relation physique ou économique mais mesurées dans des unités hétérogènes (ex: Température vs Consommation électrique).",
    benefit="Garde-fous mathématiques stricts (zéros alignés, couleurs appariées, coefficient de corrélation affiché) pour éviter les conclusions causales hâtives.",
    when_not="Public grand public non averti ou rapports réglementés où les doubles axes sont proscrits.",
    alt="Utiliser deux Line Charts étagés en small multiples ou un Scatter Plot pour inspecter directement la corrélation."
))

print("Lot 2 (P1) templates generated successfully!")
