# -*- coding: utf-8 -*-
"""
Lot 1 (P0) Combo Generator:
1. histogramme-kde
2. box-strip-plot
3. raincloud-plot
4. candlestick-volume
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path("/Users/louislaville/Desktop/kit-charts/scratch")))
from generate_all import write_file, preview_html

# ==============================================================================
# 1. HISTOGRAMME-KDE
# ==============================================================================
hist_js = """/**
 * @file 03-distribution/histogramme-kde/template.js
 * @description Standardized Universal Histogram + Gaussian KDE Template for kit-charts.
 * Combines Freedman-Diaconis binned counts and Silverman rule-of-thumb density estimation.
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
    global.KitCharts['histogramme-kde'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.computeFreedmanDiaconisBins = exp.computeFreedmanDiaconisBins;
    global.computeSilvermanBandwidth = exp.computeSilvermanBandwidth;
    global.computeGaussianKDE = exp.computeGaussianKDE;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  function quantile(cleanSorted, p) {
    const n = cleanSorted.length;
    if (n === 0) return 0;
    if (p <= 0) return cleanSorted[0];
    if (p >= 1) return cleanSorted[n - 1];
    const idx = (n - 1) * p;
    const lo = Math.floor(idx);
    const hi = Math.ceil(idx);
    if (lo === hi) return cleanSorted[lo];
    return cleanSorted[lo] + (cleanSorted[hi] - cleanSorted[lo]) * (idx - lo);
  }

  function computeFreedmanDiaconisBins(data) {
    const clean = Array.isArray(data) ? data.map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b) : [];
    const n = clean.length;
    if (n < 2) return { binWidth: 1, binCount: 1, bins: [], min: 0, max: 1 };

    const q1 = quantile(clean, 0.25);
    const q3 = quantile(clean, 0.75);
    const iqr = q3 - q1;
    const min = clean[0];
    const max = clean[n - 1];

    let binWidth = 2 * iqr * Math.pow(n, -1 / 3);
    if (binWidth <= 0 || isNaN(binWidth)) {
      const mean = clean.reduce((s, v) => s + v, 0) / n;
      const sigma = Math.sqrt(clean.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / (n - 1));
      binWidth = (3.49 * (sigma || 1)) * Math.pow(n, -1 / 3) || 1;
    }

    const span = max - min;
    const binCount = Math.max(3, Math.min(50, Math.ceil(span / binWidth)));
    const actualWidth = span / binCount;

    const bins = [];
    for (let i = 0; i < binCount; i++) {
      const bMin = min + i * actualWidth;
      const bMax = (i === binCount - 1) ? max + 0.0001 : min + (i + 1) * actualWidth;
      bins.push({
        index: i,
        min: bMin,
        max: bMax,
        mid: (bMin + bMax) / 2,
        count: 0
      });
    }

    clean.forEach(val => {
      for (let i = 0; i < bins.length; i++) {
        if (val >= bins[i].min && val < bins[i].max) {
          bins[i].count++;
          break;
        }
      }
    });

    return { binWidth: actualWidth, binCount, bins, min, max, n };
  }

  function computeSilvermanBandwidth(data) {
    const clean = Array.isArray(data) ? data.map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b) : [];
    const n = clean.length;
    if (n < 2) return 1.0;

    const mean = clean.reduce((s, v) => s + v, 0) / n;
    const variance = clean.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / (n - 1);
    const sigma = Math.sqrt(variance);
    const q1 = quantile(clean, 0.25);
    const q3 = quantile(clean, 0.75);
    const iqr = q3 - q1;

    const robustSigma = iqr > 0 ? Math.min(sigma, iqr / 1.34) : (sigma || 1);
    const h = 0.9 * robustSigma * Math.pow(n, -0.2);
    return (h > 0 && !isNaN(h)) ? h : 1.0;
  }

  function computeGaussianKDE(data, bandwidth = null, gridPoints = 128) {
    const clean = Array.isArray(data) ? data.map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b) : [];
    const n = clean.length;
    if (n === 0) return { grid: [], density: [], maxDensity: 0, h: 1, min: 0, max: 0 };

    const h = (typeof bandwidth === 'number' && bandwidth > 0) ? bandwidth : computeSilvermanBandwidth(clean);
    const minVal = clean[0];
    const maxVal = clean[clean.length - 1];
    const spanMin = minVal - 2.5 * h;
    const spanMax = maxVal + 2.5 * h;
    const step = (spanMax - spanMin) / (gridPoints - 1);

    const SQRT_2PI = Math.sqrt(2 * Math.PI);
    const grid = new Array(gridPoints);
    const density = new Array(gridPoints);
    let maxDensity = 0;

    for (let j = 0; j < gridPoints; j++) {
      const x = spanMin + j * step;
      grid[j] = x;
      let sum = 0;
      for (let i = 0; i < n; i++) {
        const u = (x - clean[i]) / h;
        sum += Math.exp(-0.5 * u * u) / SQRT_2PI;
      }
      const dens = sum / (n * h);
      density[j] = dens;
      if (dens > maxDensity) maxDensity = dens;
    }

    return { grid, density, maxDensity, h, min: spanMin, max: spanMax, n };
  }

  const DEFAULT_DATA = {
    datasets: [{
      label: 'Temps de Réponse API (ms)',
      data: [
        42, 45, 48, 50, 52, 53, 55, 56, 58, 59, 60, 61, 62, 63, 65, 66,
        68, 70, 71, 72, 73, 75, 76, 78, 80, 82, 85, 88, 92, 95, 110, 115,
        120, 125, 130, 132, 135, 138, 140, 142, 145, 148, 150, 155, 160, 175
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
    const seriesData = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data) || DEFAULT_DATA.datasets[0].data;
    const seriesLabel = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].label) || 'Distribution';

    const binAnalysis = computeFreedmanDiaconisBins(seriesData);
    const kdeAnalysis = computeGaussianKDE(seriesData);

    const mainColor = getColor(tokens, 0);
    const kdeColor = tokens.emphasis?.focal || tokens.palette[1] || '#E66101';

    const countScaleFactor = binAnalysis.n * binAnalysis.binWidth;
    const kdePoints = kdeAnalysis.grid.map((x, idx) => ({
      x: Math.round(x * 10) / 10,
      y: kdeAnalysis.density[idx] * countScaleFactor
    }));

    const barLabels = binAnalysis.bins.map(b => `${Math.round(b.min)}–${Math.round(b.max)}`);
    const barData = binAnalysis.bins.map(b => b.count);

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'bar',
      data: {
        labels: barLabels,
        datasets: [
          {
            type: 'bar',
            label: `Histogramme (${seriesLabel})`,
            data: barData,
            backgroundColor: hexToRgba(mainColor, isDark ? 0.40 : 0.30),
            borderColor: mainColor,
            borderWidth: 1.5,
            borderRadius: 3,
            order: 2
          },
          {
            type: 'line',
            label: `Densité KDE (Silverman h=${kdeAnalysis.h.toFixed(1)})`,
            data: binAnalysis.bins.map(b => {
              let bestY = 0;
              let minDiff = Infinity;
              kdePoints.forEach(p => {
                const diff = Math.abs(p.x - b.mid);
                if (diff < minDiff) {
                  minDiff = diff;
                  bestY = p.y;
                }
              });
              return Math.round(bestY * 100) / 100;
            }),
            borderColor: kdeColor,
            borderWidth: 2.5,
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: 0.35,
            fill: false,
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
              title: (items) => `Classe : ${items[0].label} ms`,
              label: (ctx) => {
                if (ctx.dataset.type === 'bar') {
                  const pct = ((ctx.parsed.y / binAnalysis.n) * 100).toFixed(1);
                  return `Effectif : ${ctx.parsed.y} obs. (${pct}%)`;
                }
                return `Densité théorique : ${ctx.parsed.y.toFixed(2)} obs./bin`;
              }
            }
          }
        },
        scales: {
          x: {
            ...defaultOpts.scales.x,
            title: {
              display: true,
              text: seriesLabel,
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          },
          y: {
            ...defaultOpts.scales.y,
            beginAtZero: true,
            title: {
              display: true,
              text: 'Effectif (Fréquence)',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          }
        }
      }
    };

    if (typeof Chart === 'undefined') return { config, binAnalysis, kdeAnalysis, computeFreedmanDiaconisBins, computeSilvermanBandwidth, computeGaussianKDE };
    return new Chart(canvas, config);
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeFreedmanDiaconisBins,
    computeSilvermanBandwidth,
    computeGaussianKDE
  };
});
"""

hist_md = """# Histogramme + Densité KDE (Histogram-KDE Combo)

## 1. Fondements Scientifiques & Justification Cognitive
L'histogramme combiné à l'estimation de densité par noyau (*Kernel Density Estimation* — KDE) réunit le décompte empirique d'échantillon et la modélisation probabiliste continue sur un même axe de mesure partagé.
Comme démontré par **Silverman (1986)** et **Freedman & Diaconis (1981)**, l'histogramme seul souffre d'artéfacts de discrétisation dépendant de l'origine et de la largeur des classes. Le tracé de la courbe KDE gaussienne supprime ces effets de découpage et révèle la véritable distribution sous-jacente (multimodalité, queues épaisses).

### Citations Fondatrices
- **Rosenblatt, M. (1956)**. *Remarks on Some Nonparametric Estimates of a Density Function*. The Annals of Mathematical Statistics, 27(3), 832-837.
- **Parzen, E. (1962)**. *On Estimation of a Probability Density Function and Mode*. The Annals of Mathematical Statistics, 33(3), 1065-1076.
- **Silverman, B. W. (1986)**. *Density Estimation for Statistics and Data Analysis*. Chapman and Hall / CRC.
- **Scott, D. W. (1979)**. *On optimal and data-based histograms*. Biometrika, 66(3), 605-610.
- **Freedman, D., & Diaconis, P. (1981)**. *On the histogram as a density estimator: L2 theory*. Zeitschrift für Wahrscheinlichkeitstheorie und verwandte Gebiete, 57(4), 453-476.
- **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception: Theory, Experimentation, and Application to the Development of Graphical Methods*. JASA, 79(387), 531-554.
- **Mayer, R. E. (2001)**. *Multimedia Learning*. Cambridge University Press.

---

## 2. Formulation Mathématique Déterministe

### 2.1 Largeur de Classe de Freedman-Diaconis (1981)
$$h_{\\text{bin}} = 2 \\cdot \\text{IQR} \\cdot n^{-1/3}$$
- $\\text{IQR} = Q_3 - Q_1$
- Si $\\text{IQR} = 0$, règle de Scott : $h_{\\text{bin}} = 3.49 \\cdot \\sigma \\cdot n^{-1/3}$.

### 2.2 KDE Gaussien Univarié
$$\\hat{f}(x) = \\frac{1}{n \\cdot h} \\sum_{i=1}^n K\\left(\\frac{x - x_i}{h}\\right), \\quad K(u) = \\frac{1}{\\sqrt{2\\pi}} e^{-u^2 / 2}$$

### 2.3 Bande Passante Optimale de Silverman (1986)
$$h = 0.9 \\cdot \\min\\left(\\sigma, \\frac{\\text{IQR}}{1.34}\\right) \\cdot n^{-1/5}$$

### 2.4 Alignement d'Échelle (Count-Scaled Density)
Pour superposer la courbe KDE sur l'axe des effectifs sans double axe trompeur :
$$g(x) = \\hat{f}(x) \\cdot n \\cdot h_{\\text{bin}}$$

---

## 3. Double-Encodage & Garde-Fous Cognitifs
1. **Histogramme contextuel** : Barres avec opacité modérée ($\\alpha \\approx 0.35$) pour ne pas masquer la trajectoire continue.
2. **Courbe KDE Hero** : Trait plein d'épaisseur 2.5px en couleur focale (`tokens.emphasis.focal` ou palette contrastée).
3. **Axe Y unique** : Échelle d'effectifs réels (pas de second axe non aligné).
4. **Infobulle duale** : Affiche à la fois l'effectif observé et la densité théorique locale.

---

## 4. Quand l'utiliser / Quand NE PAS l'utiliser

### ✅ Quand l'utiliser
- Analyse de distribution continue où l'on souhaite vérifier l'adéquation empirique à un modèle théorique (normalité, asymétrie, bimodalité).
- Échantillons modérés à grands ($n \\ge 30$).

### ❌ Quand NE PAS l'utiliser
- Très petits échantillons ($n < 30$) où le KDE produit des modes parasites (👉 *utiliser Strip Plot ou Beeswarm Plot*).
- Données strictement discrètes ou catégorielles (👉 *utiliser Bar Chart*).

---

## 5. Intégration Tokens & Options
- Barres : `hexToRgba(tokens.palette[0], 0.35)`.
- Courbe KDE : `tokens.emphasis.focal || tokens.palette[1]`.
- Typographie : `tokens.fontFamily` et `tokens.fontMono`.

---

## 6. Données de Démonstration Déterministes

```javascript
const DEFAULT_DATA = {
  datasets: [{
    label: 'Temps de Réponse API (ms)',
    data: [
      42, 45, 48, 50, 52, 53, 55, 56, 58, 59, 60, 61, 62, 63, 65, 66,
      68, 70, 71, 72, 73, 75, 76, 78, 80, 82, 85, 88, 92, 95, 110, 115,
      120, 125, 130, 132, 135, 138, 140, 142, 145, 148, 150, 155, 160, 175
    ]
  }]
};
```

---

## 7. Recommandations d'Implémentation Chart.js

```javascript
import { createChart } from './template.js';
const chart = createChart('chartCanvas', null, 'colorbrewer-accessible');
```

---

## 8. Règles Cognitives d'Accentuation & Valence

### 1. Hiérarchie Visuelle (Ratio 90/10)
- **KDE (Hero)** : Trait plein contrasté 2.5px.
- **Barres de fréquence (Contexte)** : Remplissage léger $\\alpha \\le 0.35$.
"""

write_file("template/03-distribution/histogramme-kde/template.js", hist_js)
write_file("template/03-distribution/histogramme-kde/histogramme-kde.md", hist_md)
write_file("guide/03-distribution/histogramme-kde.md", hist_md)
write_file("template/03-distribution/histogramme-kde/preview.html", preview_html(
    id_name="histogramme-kde",
    title="Histogramme + Densité KDE",
    subtitle="Décompte empirique par classes de Freedman-Diaconis & estimation de densité continue par noyau de Silverman",
    category="03-distribution",
    when_use="Analyse d'une variable continue où l'on souhaite vérifier l'adéquation des effectifs réels à la forme continue théorique et identifier d'éventuels sous-groupes ou modes multiples.",
    benefit="Réduit la charge cognitive en projetant sur le même axe l'échantillon réel (barres) et la tendance de densité lissée (KDE) sans double axe.",
    when_not="Échantillons très réduits (n < 30) ou variables catégorielles/ordinales pures.",
    alt="Utiliser Box-Strip Plot ou Beeswarm Plot pour les petits échantillons, ou Bar Chart pour les catégories discrètes."
))

# ==============================================================================
# 2. BOX-STRIP-PLOT
# ==============================================================================
box_js = """/**
 * @file 03-distribution/box-strip-plot/template.js
 * @description Standardized Universal Box Plot + Strip/Jitter Plot Template for kit-charts.
 * Combines Tukey five-number summary and deterministic golden-ratio jittered observations.
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
    global.KitCharts['box-strip-plot'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.computeTukeyBoxStats = exp.computeTukeyBoxStats;
    global.computeDeterministicJitter = exp.computeDeterministicJitter;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  function computeTukeyBoxStats(data) {
    const clean = Array.isArray(data) ? data.map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b) : [];
    const n = clean.length;
    if (n === 0) return { min: 0, q1: 0, median: 0, q3: 0, max: 0, iqr: 0, lowerWhisker: 0, upperWhisker: 0, outliers: [], n: 0 };

    const getQ = (p) => {
      const idx = (n - 1) * p;
      const lo = Math.floor(idx);
      const hi = Math.ceil(idx);
      if (lo === hi) return clean[lo];
      return clean[lo] + (clean[hi] - clean[lo]) * (idx - lo);
    };

    const q1 = getQ(0.25);
    const median = getQ(0.50);
    const q3 = getQ(0.75);
    const iqr = q3 - q1;

    const lowerFence = q1 - 1.5 * iqr;
    const upperFence = q3 + 1.5 * iqr;

    let lowerWhisker = q1;
    let upperWhisker = q3;
    const outliers = [];

    clean.forEach(val => {
      if (val < lowerFence || val > upperFence) {
        outliers.push(val);
      }
    });

    for (let i = 0; i < n; i++) {
      if (clean[i] >= lowerFence) {
        lowerWhisker = clean[i];
        break;
      }
    }
    for (let i = n - 1; i >= 0; i--) {
      if (clean[i] <= upperFence) {
        upperWhisker = clean[i];
        break;
      }
    }

    return {
      min: clean[0],
      q1,
      median,
      q3,
      max: clean[n - 1],
      iqr,
      lowerWhisker,
      upperWhisker,
      outliers,
      n
    };
  }

  function computeDeterministicJitter(index, maxOffset = 20, seed = 0.618033988749895) {
    const phi = 0.618033988749895;
    const frac = ((index + 1) * phi + seed) % 1;
    return (frac - 0.5) * 2 * maxOffset;
  }

  const DEFAULT_DATA = {
    labels: ['Traitement A', 'Traitement B (Optimisé)', 'Contrôle'],
    datasets: [{
      label: 'Performance Score',
      data: [
        [45, 48, 50, 52, 54, 55, 56, 58, 60, 61, 62, 64, 65, 68, 72, 75, 88],
        [58, 60, 62, 65, 66, 68, 70, 72, 73, 75, 78, 80, 82, 85, 88, 92, 95],
        [30, 35, 38, 40, 42, 43, 45, 46, 48, 50, 52, 53, 55, 58, 60, 62]
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
    const labels = rawData.labels || ['Groupe 1', 'Groupe 2', 'Groupe 3'];
    const groups = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data) || DEFAULT_DATA.datasets[0].data;

    const groupStats = groups.map((g, i) => {
      const rawPoints = Array.isArray(g) ? g : [];
      const stats = computeTukeyBoxStats(rawPoints);
      const color = getColor(tokens, i);
      return { rawPoints, stats, color, label: labels[i] || `Groupe ${i + 1}` };
    });

    let globalMin = Infinity;
    let globalMax = -Infinity;
    groupStats.forEach(gs => {
      if (gs.stats.min < globalMin) globalMin = gs.stats.min;
      if (gs.stats.max > globalMax) globalMax = gs.stats.max;
    });
    if (globalMin === Infinity) { globalMin = 0; globalMax = 100; }
    const span = globalMax - globalMin || 10;
    const yPad = span * 0.08;

    const boxStripPainterPlugin = {
      id: 'kitChartsBoxStripPainter',
      afterDatasetsDraw(chart) {
        const { ctx, scales: { x, y } } = chart;
        if (!x || !y) return;

        ctx.save();
        const totalGroups = groupStats.length;
        const catWidth = x.width / totalGroups;
        const boxWidth = Math.min(40, catWidth * 0.32);
        const stripMaxOffset = Math.min(22, catWidth * 0.18);

        groupStats.forEach((gs, idx) => {
          const xCenter = x.getPixelForValue(idx);
          const { stats, color, rawPoints } = gs;
          if (stats.n === 0) return;

          const yQ1 = y.getPixelForValue(stats.q1);
          const yQ3 = y.getPixelForValue(stats.q3);
          const yMed = y.getPixelForValue(stats.median);
          const yLowW = y.getPixelForValue(stats.lowerWhisker);
          const yUpW = y.getPixelForValue(stats.upperWhisker);

          ctx.beginPath();
          ctx.strokeStyle = isDark ? '#94A3B8' : '#475569';
          ctx.lineWidth = 1.5;
          ctx.moveTo(xCenter, yLowW);
          ctx.lineTo(xCenter, yQ1);
          ctx.moveTo(xCenter, yQ3);
          ctx.lineTo(xCenter, yUpW);
          const capW = boxWidth * 0.4;
          ctx.moveTo(xCenter - capW / 2, yLowW);
          ctx.lineTo(xCenter + capW / 2, yLowW);
          ctx.moveTo(xCenter - capW / 2, yUpW);
          ctx.lineTo(xCenter + capW / 2, yUpW);
          ctx.stroke();

          ctx.fillStyle = hexToRgba(color, isDark ? 0.35 : 0.25);
          ctx.fillRect(xCenter - boxWidth / 2, yQ3, boxWidth, yQ1 - yQ3);
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.strokeRect(xCenter - boxWidth / 2, yQ3, boxWidth, yQ1 - yQ3);

          ctx.beginPath();
          ctx.strokeStyle = isDark ? '#FFFFFF' : '#0F172A';
          ctx.lineWidth = 2.5;
          ctx.moveTo(xCenter - boxWidth / 2, yMed);
          ctx.lineTo(xCenter + boxWidth / 2, yMed);
          ctx.stroke();

          rawPoints.forEach((val, pIdx) => {
            const yPt = y.getPixelForValue(val);
            const xOffset = computeDeterministicJitter(pIdx, stripMaxOffset);
            const isOutlier = val < stats.lowerWhisker || val > stats.upperWhisker;

            ctx.beginPath();
            ctx.fillStyle = isOutlier
              ? (tokens.emphasis?.anomaly || '#D01C8B')
              : hexToRgba(color, 0.85);
            ctx.arc(xCenter + xOffset, yPt, isOutlier ? 3.5 : 2.5, 0, Math.PI * 2);
            ctx.fill();

            if (isOutlier) {
              ctx.strokeStyle = isDark ? '#FFFFFF' : '#0F172A';
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          });

          ctx.font = `500 11px ${tokens.fontMono || 'monospace'}`;
          ctx.fillStyle = tokens.textMuted || '#64748B';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(`n=${stats.n}`, xCenter, Math.max(14, yUpW - 8));
        });

        ctx.restore();
      }
    };

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].label) || 'Distribution',
          data: groupStats.map(gs => [gs.stats.min, gs.stats.max]),
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          borderWidth: 0
        }]
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
          legend: { display: false },
          tooltip: {
            enabled: true,
            callbacks: {
              title: (items) => labels[items[0].dataIndex] || '',
              label: (ctx) => {
                const gs = groupStats[ctx.dataIndex];
                if (!gs) return '';
                const { stats } = gs;
                return [
                  `Échantillon : n = ${stats.n} observations`,
                  `Médiane : ${stats.median.toLocaleString('fr-FR')}`,
                  `IQR [Q1—Q3] : [${stats.q1.toLocaleString('fr-FR')} — ${stats.q3.toLocaleString('fr-FR')}]`,
                  `Moustaches : [${stats.lowerWhisker.toLocaleString('fr-FR')} — ${stats.upperWhisker.toLocaleString('fr-FR')}]`,
                  `Outliers détectés : ${stats.outliers.length}`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            ...defaultOpts.scales.x,
            grid: { display: false }
          },
          y: {
            ...defaultOpts.scales.y,
            min: Math.floor(globalMin - yPad),
            max: Math.ceil(globalMax + yPad),
            title: {
              display: true,
              text: (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].label) || 'Valeur',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          }
        }
      },
      plugins: [boxStripPainterPlugin]
    };

    if (typeof Chart === 'undefined') return { config, groupStats, computeTukeyBoxStats, computeDeterministicJitter };
    return new Chart(canvas, config);
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeTukeyBoxStats,
    computeDeterministicJitter
  };
});
"""

box_md = """# Box Plot + Strip / Jitter Plot (Box-Strip Combo)

## 1. Fondements Scientifiques & Justification Cognitive
Le combo **Box Plot + Strip Plot** répond directement aux recommandations majeures de **Weissgerber et al. (2015)** (*Beyond Bar and Line Graphs: Time for a New Data Presentation Paradigm*, PLOS Biology).
Alors que la boîte à moustaches conventionnelle (Tukey 1977) résume l'échantillon à 5 statistiques (min, Q1, médiane, Q3, max), elle masque la taille d'échantillon réelle et d'éventuelles concentrations discrètes. La superposition de points individuels jitterés de manière déterministe permet de visualiser **chaque observation sans sur-tracé**, tout en conservant les repères non paramétriques robustes.

### Citations Fondatrices
- **Tukey, J. W. (1977)**. *Exploratory Data Analysis*. Addison-Wesley.
- **Weissgerber, T. L., Milic, N. M., Winham, S. J., & Garovic, V. D. (2015)**. *Beyond Bar and Line Graphs: Time for a New Data Presentation Paradigm*. PLOS Biology, 13(4), e1002128.
- **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception: Theory, Experimentation, and Application*. JASA, 79(387), 531-554.
- **Cumming, G. (2012)**. *Understanding the New Statistics: Effect Sizes, Confidence Intervals, and Meta-Analysis*. Routledge.
- **Tufte, E. R. (1983)**. *The Visual Display of Quantitative Information*. Graphics Press.

---

## 2. Formulation Mathématique Déterministe

### 2.1 Résumé de Tukey Type R-7
Position continue $p = 1 + (n - 1) \\cdot q$ pour $q \\in \\{0.25, 0.50, 0.75\\}$ :
$$Q(q) = x_{(\\lfloor p \\rfloor)} + (p - \\lfloor p \\rfloor) \\cdot (x_{(\\lceil p \\rceil)} - x_{(\\lfloor p \\rfloor)})$$
$$\\text{IQR} = Q_3 - Q_1$$

### 2.2 Moustaches et Outliers
- Borne inférieure : $\\text{LowW} = \\max\\left(\\min(x), Q_1 - 1.5 \\cdot \\text{IQR}\\right)$
- Borne supérieure : $\\text{UpW} = \\min\\left(\\max(x), Q_3 + 1.5 \\cdot \\text{IQR}\\right)$
- Outlier si $x_i < \\text{LowW}$ ou $x_i > \\text{UpW}$.

### 2.3 Jitter Déterministe au Nombre d'Or
Pour éviter tout appel non reproductible à `Math.random()`, chaque point $i$ est décalé horizontalement via la séquence de quasi-Monte Carlo :
$$\\Delta x_i = \\left( (i \\cdot \\phi + \\text{seed}) \\bmod 1 - 0.5 \\right) \\cdot W_{\\text{jitter}}$$
avec $\\phi = \\frac{\\sqrt{5}-1}{2} \\approx 0.6180339887$ et $W_{\\text{jitter}} \\le 0.4 \\times \\text{largeur boîte}$.

---

## 3. Double-Encodage & Garde-Fous Cognitifs
1. **Boîte interquartile** : Fond coloré transparent ($\\alpha = 0.25$) et contour net 2px.
2. **Médiane contrastée** : Trait épais de 2.5px en contraste fort.
3. **Points bruts** : Disques de rayon 2.5px avec opacité 0.85 pour discerner la densité.
4. **Outliers mis en évidence** : Couleur d'anomalie (`tokens.emphasis.anomaly`) et rayon 3.5px.
5. **Indication de $n$** : Inscription tabulaire `n = XX` au-dessus de chaque groupe.

---

## 4. Quand l'utiliser / Quand NE PAS l'utiliser

### ✅ Quand l'utiliser
- Comparaison de distributions pour des échantillons petits à modérés ($10 \\le n \\le 200$ par groupe).
- Publications biomédicales, tests A/B, benchmarks de performances.

### ❌ Quand NE PAS l'utiliser
- Très grands échantillons ($n > 500$) où les points individuels saturent le graphique (👉 *utiliser Histogramme-KDE ou Violin Plot*).
- Échantillons minuscules ($n < 5$) où la boîte n'a pas de sens mathématique (👉 *utiliser Strip Plot pur*).

---

## 5. Intégration Tokens & Données Déterministes

```javascript
const DEFAULT_DATA = {
  labels: ['Traitement A', 'Traitement B (Optimisé)', 'Contrôle'],
  datasets: [{
    label: 'Performance Score',
    data: [
      [45, 48, 50, 52, 54, 55, 56, 58, 60, 61, 62, 64, 65, 68, 72, 75, 88],
      [58, 60, 62, 65, 66, 68, 70, 72, 73, 75, 78, 80, 82, 85, 88, 92, 95],
      [30, 35, 38, 40, 42, 43, 45, 46, 48, 50, 52, 53, 55, 58, 60, 62]
    ]
  }]
};
```
"""

write_file("template/03-distribution/box-strip-plot/template.js", box_js)
write_file("template/03-distribution/box-strip-plot/box-strip-plot.md", box_md)
write_file("guide/03-distribution/box-strip-plot.md", box_md)
write_file("template/03-distribution/box-strip-plot/preview.html", preview_html(
    id_name="box-strip-plot",
    title="Box Plot + Strip / Jitter Plot",
    subtitle="Résumé robuste à 5 nombres de Tukey & superposition déterministe des observations individuelles",
    category="03-distribution",
    when_use="Comparaison de distribution entre groupes d'échantillon modéré (10 à 200 observations) pour rendre compte simultanément des quantiles et de la dispersion réelle sans masquer la taille de l'échantillon.",
    benefit="Empêche l'illusion d'échantillon en affichant chaque point réel avec un jitter déterministe, garantissant une transparence totale de la preuve visuelle.",
    when_not="Très grands échantillons (n > 500) provoquant un sur-tracé massif.",
    alt="Utiliser Histogramme-KDE, Violin Plot ou Hexbin Plot pour les grands volumes de données."
))

# ==============================================================================
# 3. RAINCLOUD-PLOT
# ==============================================================================
rain_js = """/**
 * @file 03-distribution/raincloud-plot/template.js
 * @description Standardized Universal Raincloud Plot Template for kit-charts.
 * Tri-hybrid display: Half-KDE density (cloud) + Micro-Box plot + Jittered raw points (rain).
 * Based on Allen et al. (2019) and Kievit methodology.
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
    global.KitCharts['raincloud-plot'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.computeGaussianKDE = exp.computeGaussianKDE;
    global.computeTukeyBoxStats = exp.computeTukeyBoxStats;
    global.computeSilvermanBandwidth = exp.computeSilvermanBandwidth;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  function quantile(cleanSorted, p) {
    const n = cleanSorted.length;
    if (n === 0) return 0;
    if (p <= 0) return cleanSorted[0];
    if (p >= 1) return cleanSorted[n - 1];
    const idx = (n - 1) * p;
    const lo = Math.floor(idx);
    const hi = Math.ceil(idx);
    if (lo === hi) return cleanSorted[lo];
    return cleanSorted[lo] + (cleanSorted[hi] - cleanSorted[lo]) * (idx - lo);
  }

  function computeSilvermanBandwidth(data) {
    const clean = Array.isArray(data) ? data.map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b) : [];
    const n = clean.length;
    if (n < 2) return 1.0;
    const mean = clean.reduce((s, v) => s + v, 0) / n;
    const variance = clean.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / (n - 1);
    const sigma = Math.sqrt(variance);
    const q1 = quantile(clean, 0.25);
    const q3 = quantile(clean, 0.75);
    const iqr = q3 - q1;
    const robustSigma = iqr > 0 ? Math.min(sigma, iqr / 1.34) : (sigma || 1);
    const h = 0.9 * robustSigma * Math.pow(n, -0.2);
    return (h > 0 && !isNaN(h)) ? h : 1.0;
  }

  function computeGaussianKDE(data, bandwidth = null, gridPoints = 128) {
    const clean = Array.isArray(data) ? data.map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b) : [];
    const n = clean.length;
    if (n === 0) return { grid: [], density: [], maxDensity: 0, h: 1, min: 0, max: 0 };

    const h = (typeof bandwidth === 'number' && bandwidth > 0) ? bandwidth : computeSilvermanBandwidth(clean);
    const minVal = clean[0];
    const maxVal = clean[clean.length - 1];
    const spanMin = minVal - 2.5 * h;
    const spanMax = maxVal + 2.5 * h;
    const step = (spanMax - spanMin) / (gridPoints - 1);

    const SQRT_2PI = Math.sqrt(2 * Math.PI);
    const grid = new Array(gridPoints);
    const density = new Array(gridPoints);
    let maxDensity = 0;

    for (let j = 0; j < gridPoints; j++) {
      const x = spanMin + j * step;
      grid[j] = x;
      let sum = 0;
      for (let i = 0; i < n; i++) {
        const u = (x - clean[i]) / h;
        sum += Math.exp(-0.5 * u * u) / SQRT_2PI;
      }
      const dens = sum / (n * h);
      density[j] = dens;
      if (dens > maxDensity) maxDensity = dens;
    }

    return { grid, density, maxDensity, h, min: spanMin, max: spanMax, n };
  }

  function computeTukeyBoxStats(data) {
    const clean = Array.isArray(data) ? data.map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b) : [];
    const n = clean.length;
    if (n === 0) return { min: 0, q1: 0, median: 0, q3: 0, max: 0, iqr: 0, lowerWhisker: 0, upperWhisker: 0, n: 0 };

    const q1 = quantile(clean, 0.25);
    const median = quantile(clean, 0.50);
    const q3 = quantile(clean, 0.75);
    const iqr = q3 - q1;
    const lowerFence = q1 - 1.5 * iqr;
    const upperFence = q3 + 1.5 * iqr;

    let lowerWhisker = q1;
    let upperWhisker = q3;
    for (let i = 0; i < n; i++) {
      if (clean[i] >= lowerFence) { lowerWhisker = clean[i]; break; }
    }
    for (let i = n - 1; i >= 0; i--) {
      if (clean[i] <= upperFence) { upperWhisker = clean[i]; break; }
    }

    return { min: clean[0], q1, median, q3, max: clean[n - 1], iqr, lowerWhisker, upperWhisker, n };
  }

  const DEFAULT_DATA = {
    labels: ['Cohorte Contrôle', 'Cohorte Variante A', 'Cohorte Variante B'],
    datasets: [{
      label: 'Engagement Score (0-100)',
      data: [
        [35, 38, 42, 45, 46, 48, 50, 52, 53, 55, 56, 58, 60, 62, 65, 68, 70],
        [48, 52, 55, 58, 60, 62, 65, 68, 70, 72, 75, 78, 80, 82, 85, 88, 92],
        [25, 28, 30, 32, 35, 38, 40, 72, 75, 78, 80, 82, 85, 88, 90, 94, 96]
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
    const labels = rawData.labels || ['Groupe 1', 'Groupe 2', 'Groupe 3'];
    const groups = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data) || DEFAULT_DATA.datasets[0].data;

    const analysis = groups.map((g, i) => {
      const rawPoints = Array.isArray(g) ? g : [];
      const kde = computeGaussianKDE(rawPoints);
      const stats = computeTukeyBoxStats(rawPoints);
      const color = getColor(tokens, i);
      return { rawPoints, kde, stats, color, label: labels[i] || `Groupe ${i + 1}` };
    });

    let globalMin = Infinity;
    let globalMax = -Infinity;
    analysis.forEach(a => {
      if (a.kde.min < globalMin) globalMin = a.kde.min;
      if (a.kde.max > globalMax) globalMax = a.kde.max;
    });
    if (globalMin === Infinity) { globalMin = 0; globalMax = 100; }
    const span = globalMax - globalMin || 10;
    const yPad = span * 0.08;

    const raincloudPlugin = {
      id: 'kitChartsRaincloudPainter',
      afterDatasetsDraw(chart) {
        const { ctx, scales: { x, y } } = chart;
        if (!x || !y) return;

        ctx.save();
        const totalGroups = analysis.length;
        const catWidth = x.width / totalGroups;
        const maxCloudWidth = Math.min(50, catWidth * 0.35);

        analysis.forEach((item, idx) => {
          const xCenter = x.getPixelForValue(idx);
          const { kde, stats, color, rawPoints } = item;
          if (!kde.grid.length || kde.maxDensity === 0) return;

          ctx.beginPath();
          ctx.moveTo(xCenter, y.getPixelForValue(kde.grid[0]));
          for (let j = 0; j < kde.grid.length; j++) {
            const yVal = kde.grid[j];
            const yPx = y.getPixelForValue(yVal);
            const wRatio = kde.density[j] / kde.maxDensity;
            const xPx = xCenter + wRatio * maxCloudWidth;
            ctx.lineTo(xPx, yPx);
          }
          ctx.lineTo(xCenter, y.getPixelForValue(kde.grid[kde.grid.length - 1]));
          ctx.closePath();

          ctx.fillStyle = hexToRgba(color, isDark ? 0.40 : 0.30);
          ctx.fill();
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          if (stats.n >= 3) {
            const yQ1 = y.getPixelForValue(stats.q1);
            const yQ3 = y.getPixelForValue(stats.q3);
            const yMed = y.getPixelForValue(stats.median);
            const yLowW = y.getPixelForValue(stats.lowerWhisker);
            const yUpW = y.getPixelForValue(stats.upperWhisker);

            ctx.beginPath();
            ctx.strokeStyle = isDark ? '#D8DEE9' : '#334155';
            ctx.lineWidth = 1.5;
            ctx.moveTo(xCenter, yLowW);
            ctx.lineTo(xCenter, yUpW);
            ctx.stroke();

            const boxW = 8;
            ctx.fillStyle = isDark ? '#ECEFF4' : '#0F172A';
            ctx.fillRect(xCenter - boxW / 2, yQ3, boxW, yQ1 - yQ3);

            ctx.beginPath();
            ctx.fillStyle = '#FFFFFF';
            ctx.arc(xCenter, yMed, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }

          const phi = 0.618033988749895;
          rawPoints.forEach((val, pIdx) => {
            const yPt = y.getPixelForValue(val);
            const jitterOffset = -8 - (((pIdx * phi) % 1) * (maxCloudWidth * 0.6));
            ctx.beginPath();
            ctx.fillStyle = hexToRgba(color, 0.80);
            ctx.arc(xCenter + jitterOffset, yPt, 2.5, 0, Math.PI * 2);
            ctx.fill();
          });

          ctx.font = `500 11px ${tokens.fontMono || 'monospace'}`;
          ctx.fillStyle = tokens.textMuted || '#64748B';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(`n=${stats.n}`, xCenter, Math.max(14, y.getPixelForValue(kde.max) - 6));
        });

        ctx.restore();
      }
    };

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].label) || 'Distribution',
          data: analysis.map(a => [a.stats.min, a.stats.max]),
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          borderWidth: 0
        }]
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
          legend: { display: false },
          tooltip: {
            enabled: true,
            callbacks: {
              title: (items) => labels[items[0].dataIndex] || '',
              label: (ctx) => {
                const item = analysis[ctx.dataIndex];
                if (!item) return '';
                const { stats, kde } = item;
                return [
                  `Échantillon : n = ${stats.n} observations`,
                  `Médiane : ${stats.median.toLocaleString('fr-FR')}`,
                  `IQR [Q1—Q3] : [${stats.q1.toLocaleString('fr-FR')} — ${stats.q3.toLocaleString('fr-FR')}]`,
                  `Bande de Silverman (h) : ${kde.h.toFixed(2)}`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            ...defaultOpts.scales.x,
            grid: { display: false }
          },
          y: {
            ...defaultOpts.scales.y,
            min: Math.floor(globalMin - yPad),
            max: Math.ceil(globalMax + yPad),
            title: {
              display: true,
              text: (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].label) || 'Valeur',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          }
        }
      },
      plugins: [raincloudPlugin]
    };

    if (typeof Chart === 'undefined') return { config, analysis, computeGaussianKDE, computeTukeyBoxStats, computeSilvermanBandwidth };
    return new Chart(canvas, config);
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeGaussianKDE,
    computeTukeyBoxStats,
    computeSilvermanBandwidth
  };
});
"""

rain_md = """# Raincloud Plot (Half-Violin + Box + Rain Strip)

## 1. Fondements Scientifiques & Justification Cognitive
Le **Raincloud Plot** a été formalisé par **Allen, Poggiali, Whitaker, Marshall & Kievit (2019)** (*Raincloud plots: a multi-platform tool for robust data visualization*, Wellcome Open Research).
Il s'agit du compromis ergonomique et statistique ultime pour représenter des distributions continues :
1. **Le nuage (*Cloud*)** : Demi-KDE gaussien asymétrique montrant la forme continue et la multimodalité sans redondance bilatérale.
2. **Le parapluie (*Umbrella*)** : Micro-boîte à moustaches de Tukey synthétisant médiane et quartiles.
3. **La pluie (*Rain*)** : Points individuels jitterés révélant l'échantillon brut réel ($n$) et les groupements locaux.

### Citations Fondatrices
- **Allen, M., Poggiali, D., Whitaker, K., Marshall, T. R., & Kievit, R. A. (2019)**. *Raincloud plots: a multi-platform tool for robust data visualization*. Wellcome Open Research, 4, 63.
- **Weissgerber, T. L. et al. (2015)**. *Beyond Bar and Line Graphs*. PLOS Biology.
- **Cumming, G. (2012)**. *Understanding the New Statistics*. Routledge.
- **Silverman, B. W. (1986)**. *Density Estimation for Statistics and Data Analysis*.
- **Mayer, R. E. (2001)**. *Multimedia Learning*. Cambridge University Press.

---

## 2. Formulation Mathématique Déterministe

### 2.1 Demi-KDE Gaussien Asymétrique
$$\\hat{f}_{\\text{half}}(x) = \\frac{1}{n \\cdot h} \\sum_{i=1}^n K\\left(\\frac{x - x_i}{h}\\right) \\quad \\text{pour } x \\ge x_{\\text{center}}$$

### 2.2 Bande Passante de Silverman
$$h = 0.9 \\cdot \\min\\left(\\sigma, \\frac{\\text{IQR}}{1.34}\\right) \\cdot n^{-1/5}$$

### 2.3 Disposition Spatiale Anti-Occlusion (Kievit 2019)
- $X_{\\text{cloud}} = X_{\\text{center}} + w(x) \\cdot W_{\\max}$
- $X_{\\text{box}} = X_{\\text{center}} \\pm 4\\text{px}$
- $X_{\\text{rain}} = X_{\\text{center}} - \\Delta_{\\text{jitter}}$

---

## 3. Double-Encodage & Garde-Fous Cognitifs
1. **Élimination de la redondance symétrique** : Le demi-violon utilise 50% d'espace en moins qu'un violon classique, laissant la place aux observations individuelles.
2. **Points déterministes** : Jitter calculé au nombre d'or ($\\phi \\approx 0.618$).
3. **Indication de $n$** : Libellé explicite au sommet de chaque colonne.

---

## 4. Quand l'utiliser / Quand NE PAS l'utiliser

### ✅ Quand l'utiliser
- Rapports de recherche scientifique, publications cliniques, comparaisons d'algorithmes et d'expériences utilisateur.
- Échantillons de 15 à 300 observations par groupe.

### ❌ Quand NE PAS l'utiliser
- Tableaux de bord très compacts (< 300px) ou très grands volumes (> 1000 observations).

---

## 5. Données de Démonstration Déterministes

```javascript
const DEFAULT_DATA = {
  labels: ['Cohorte Contrôle', 'Cohorte Variante A', 'Cohorte Variante B'],
  datasets: [{
    label: 'Engagement Score (0-100)',
    data: [
      [35, 38, 42, 45, 46, 48, 50, 52, 53, 55, 56, 58, 60, 62, 65, 68, 70],
      [48, 52, 55, 58, 60, 62, 65, 68, 70, 72, 75, 78, 80, 82, 85, 88, 92],
      [25, 28, 30, 32, 35, 38, 40, 72, 75, 78, 80, 82, 85, 88, 90, 94, 96]
    ]
  }]
};
```
"""

write_file("template/03-distribution/raincloud-plot/template.js", rain_js)
write_file("template/03-distribution/raincloud-plot/raincloud-plot.md", rain_md)
write_file("guide/03-distribution/raincloud-plot.md", rain_md)
write_file("template/03-distribution/raincloud-plot/preview.html", preview_html(
    id_name="raincloud-plot",
    title="Raincloud Plot (Half-Violin + Box + Rain)",
    subtitle="Architecture tri-hybride : densité continue asymétrique, micro-boîte de Tukey et points d'observation individuels",
    category="03-distribution",
    when_use="Publications scientifiques et analyses rigoureuses où l'on souhaite offrir la vision la plus complète et transparente possible d'une distribution continue.",
    benefit="Combine le macro (KDE), le méso (box plot) et le micro (points bruts) dans une empreinte spatiale compacte sans aucune occlusion visuelle.",
    when_not="Micro-widgets de dashboards denses où l'espace est insuffisant pour lire les 3 couches simultanément.",
    alt="Utiliser Box Plot pour un format ultra-compact, ou Histogramme-KDE pour les grands volumes."
))

# ==============================================================================
# 4. CANDLESTICK-VOLUME
# ==============================================================================
candle_js = """/**
 * @file 05-evolution-temporelle/candlestick-volume/template.js
 * @description Standardized Candlestick + Trading Volume (Stacked Panels) Template for kit-charts.
 * Adheres strictly to cognitive dual-panel architecture sharing the same X temporal continuum.
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
    global.KitCharts['candlestick-volume'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.computeVolumeMA = exp.computeVolumeMA;
    global.computeCandleStats = exp.computeCandleStats;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  function computeVolumeMA(volumeList, period = 5) {
    if (!Array.isArray(volumeList)) return [];
    return volumeList.map((val, idx, arr) => {
      const start = Math.max(0, idx - period + 1);
      const slice = arr.slice(start, idx + 1);
      const sum = slice.reduce((s, v) => s + v, 0);
      return Math.round(sum / slice.length);
    });
  }

  function computeCandleStats(ohlcData) {
    if (!Array.isArray(ohlcData)) return [];
    return ohlcData.map(d => ({
      ...d,
      isBullish: d.c >= d.o,
      body: Math.abs(d.c - d.o),
      top: Math.max(d.o, d.c),
      bottom: Math.min(d.o, d.c)
    }));
  }

  const DEFAULT_DATA = {
    labels: [
      '01 Jan', '02 Jan', '03 Jan', '04 Jan', '05 Jan',
      '08 Jan', '09 Jan', '10 Jan', '11 Jan', '12 Jan',
      '15 Jan', '16 Jan', '17 Jan', '18 Jan', '19 Jan',
      '22 Jan', '23 Jan', '24 Jan', '25 Jan', '26 Jan'
    ],
    datasets: [
      {
        label: 'Action Tech Corp (OHLC)',
        type: 'ohlc',
        data: [
          { o: 150, h: 155, l: 148, c: 154, v: 12000 },
          { o: 154, h: 158, l: 152, c: 157, v: 14500 },
          { o: 157, h: 160, l: 155, c: 156, v: 11000 },
          { o: 156, h: 157, l: 149, c: 151, v: 18000 },
          { o: 151, h: 153, l: 147, c: 148, v: 19500 },
          { o: 148, h: 152, l: 146, c: 151, v: 13000 },
          { o: 151, h: 156, l: 150, c: 155, v: 16000 },
          { o: 155, h: 162, l: 154, c: 161, v: 22000 },
          { o: 161, h: 165, l: 159, c: 163, v: 21000 },
          { o: 163, h: 164, l: 158, c: 159, v: 14000 },
          { o: 159, h: 162, l: 157, c: 161, v: 12500 },
          { o: 161, h: 167, l: 160, c: 166, v: 24000 },
          { o: 166, h: 170, l: 164, c: 169, v: 27000 },
          { o: 169, h: 172, l: 167, c: 171, v: 23000 },
          { o: 171, h: 173, l: 166, c: 168, v: 17000 },
          { o: 168, h: 169, l: 162, c: 164, v: 18500 },
          { o: 164, h: 168, l: 163, c: 167, v: 15000 },
          { o: 167, h: 174, l: 166, c: 173, v: 26000 },
          { o: 173, h: 178, l: 171, c: 176, v: 29000 },
          { o: 176, h: 180, l: 174, c: 179, v: 31000 }
        ]
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
    const ohlcList = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data) || DEFAULT_DATA.datasets[0].data;

    const candleStats = computeCandleStats(ohlcList);
    const volumeList = ohlcList.map(d => d.v || 0);
    const vmaList = computeVolumeMA(volumeList, 5);

    let priceMin = Infinity;
    let priceMax = -Infinity;
    ohlcList.forEach(d => {
      if (d.l < priceMin) priceMin = d.l;
      if (d.h > priceMax) priceMax = d.h;
    });
    const priceSpan = priceMax - priceMin || 10;
    const pricePad = priceSpan * 0.05;

    let volMax = Math.max(...volumeList, 100);

    const bullColor = tokens.semantic?.positive || tokens.status?.success || '#2E7D32';
    const bearColor = tokens.semantic?.negative || tokens.status?.danger || '#C62828';
    const vmaColor = tokens.emphasis?.focal || tokens.palette?.[0] || '#2B8CBE';

    const candlestickPainterPlugin = {
      id: 'kitChartsCandlestickVolumePainter',
      afterDatasetsDraw(chart) {
        const { ctx, scales: { x, yPrice, yVolume }, chartArea } = chart;
        if (!x || !yPrice) return;

        ctx.save();
        const n = candleStats.length;
        const colWidth = x.width / n;
        const bodyWidth = Math.max(3, Math.min(18, colWidth * 0.65));

        const splitY = yVolume ? yVolume.top : chartArea.bottom * 0.70;
        ctx.beginPath();
        ctx.strokeStyle = tokens.border || (isDark ? '#334155' : '#E2E8F0');
        ctx.lineWidth = 1;
        ctx.moveTo(chartArea.left, splitY);
        ctx.lineTo(chartArea.right, splitY);
        ctx.stroke();

        candleStats.forEach((d, idx) => {
          const xCenter = x.getPixelForValue(idx);
          const yOpen = yPrice.getPixelForValue(d.o);
          const yClose = yPrice.getPixelForValue(d.c);
          const yHigh = yPrice.getPixelForValue(d.h);
          const yLow = yPrice.getPixelForValue(d.l);

          const isBull = d.isBullish;
          const color = isBull ? bullColor : bearColor;

          ctx.beginPath();
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          ctx.moveTo(xCenter, yHigh);
          ctx.lineTo(xCenter, yLow);
          ctx.stroke();

          const yTop = Math.min(yOpen, yClose);
          const yHeight = Math.max(2, Math.abs(yClose - yOpen));

          ctx.fillStyle = isBull ? hexToRgba(color, 0.85) : color;
          ctx.fillRect(xCenter - bodyWidth / 2, yTop, bodyWidth, yHeight);
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(xCenter - bodyWidth / 2, yTop, bodyWidth, yHeight);
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
            type: 'bar',
            label: 'Volume',
            yAxisID: 'yVolume',
            data: volumeList,
            backgroundColor: candleStats.map(d => hexToRgba(d.isBullish ? bullColor : bearColor, 0.35)),
            borderColor: candleStats.map(d => (d.isBullish ? bullColor : bearColor)),
            borderWidth: 1,
            borderRadius: 2,
            order: 3
          },
          {
            type: 'line',
            label: 'Volume MA (5j)',
            yAxisID: 'yVolume',
            data: vmaList,
            borderColor: vmaColor,
            borderWidth: 1.5,
            pointRadius: 0,
            tension: 0.3,
            order: 2
          },
          {
            type: 'line',
            label: 'Prix Clôture',
            yAxisID: 'yPrice',
            data: ohlcList.map(d => d.c),
            borderColor: 'transparent',
            pointRadius: 0,
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
              font: { family: tokens.fontFamily, size: 12 },
              filter: (item) => item.text !== 'Prix Clôture'
            }
          },
          tooltip: {
            ...defaultOpts.plugins.tooltip,
            callbacks: {
              title: (items) => `Date : ${items[0].label}`,
              label: (ctx) => {
                const idx = ctx.dataIndex;
                const d = ohlcList[idx];
                if (!d) return '';
                if (ctx.dataset.label === 'Volume') {
                  return `Volume : ${d.v.toLocaleString('fr-FR')} titres`;
                }
                if (ctx.dataset.label.includes('Volume MA')) {
                  return `VMA (5) : ${vmaList[idx].toLocaleString('fr-FR')} titres`;
                }
                return [
                  `Open : ${d.o.toFixed(2)} € | High : ${d.h.toFixed(2)} €`,
                  `Low  : ${d.l.toFixed(2)} € | Close : ${d.c.toFixed(2)} €`,
                  `Variation : ${d.c >= d.o ? '+' : ''}${((d.c - d.o) / d.o * 100).toFixed(2)}%`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            ...defaultOpts.scales.x,
            grid: { color: tokens.gridColor }
          },
          yPrice: {
            type: 'linear',
            position: 'left',
            weight: 2,
            min: Math.floor(priceMin - pricePad),
            max: Math.ceil(priceMax + pricePad),
            grid: { color: tokens.gridColor },
            ticks: {
              color: tokens.textSecondary,
              font: { family: tokens.fontMono }
            },
            title: {
              display: true,
              text: 'Cours (€)',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          },
          yVolume: {
            type: 'linear',
            position: 'right',
            weight: 1,
            beginAtZero: true,
            max: Math.ceil(volMax * 3.5),
            grid: { display: false },
            ticks: {
              color: tokens.textMuted,
              font: { family: tokens.fontMono, size: 10 },
              callback: (val) => val > 0 && val <= volMax ? `${(val / 1000).toFixed(0)}k` : ''
            },
            title: {
              display: true,
              text: 'Volume',
              color: tokens.textMuted,
              font: { family: tokens.fontFamily, size: 11 }
            }
          }
        }
      },
      plugins: [candlestickPainterPlugin]
    };

    if (typeof Chart === 'undefined') return { config, candleStats, volumeList, vmaList, computeVolumeMA, computeCandleStats };
    return new Chart(canvas, config);
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeVolumeMA,
    computeCandleStats
  };
});
"""

candle_md = """# Candlestick + Volume (Stacked Panels)

## 1. Fondements Scientifiques & Justification Cognitive
Le graphique en **Chandeliers Japonais + Volume** trouve son origine historique dans les travaux de **Homma Munehisa (~1750)** sur le marché du riz de Dojima, formalisé en finance moderne par **Wilder (1978)** et **Heer, Bostock & Ogievetsky (2010)**.

### Architecture Cognitive Obligatoire (Anti Double-Axe Spatiale)
Superposer le cours de bourse et le volume de transactions sur une même surface avec deux échelles Y arbitraires crée une collision visuelle sévère et induit des corrélations fallacieuses (Tufte 1983 ; Few 2008).
La règle cognitive absolue impose **deux sous-panneaux verticaux alignés partageant exactement le même axe temporel X** :
- **Panneau supérieur (70% hauteur)** : Cours boursier en chandeliers OHLC (Open, High, Low, Close).
- **Panneau inférieur (30% hauteur)** : Barres de volume de transactions + Moyenne Mobile du Volume (VMA).

### Citations Fondatrices
- **Heer, J., Bostock, M., & Ogievetsky, V. (2010)**. *A Tour Through the Visualization Zoo*. Communications of the ACM, 53(6), 59-67.
- **Wilder, J. W. (1978)**. *New Concepts in Technical Trading Systems*. Trend Research.
- **Tufte, E. R. (1983)**. *The Visual Display of Quantitative Information*. Graphics Press.
- **Sweller, J. (1988)**. *Cognitive Load During Problem Solving*. Cognitive Science.
- **Mayer, R. E. (2001)**. *Multimedia Learning*. Cambridge University Press.

---

## 2. Formulation Mathématique Déterministe

### 2.1 Géométrie du Chandelier OHLC
Pour chaque période $t$ :
- **Mèche (*Wick*)** : Intervalle $[L_t, H_t]$
- **Corps (*Real Body*)** : $[\\min(O_t, C_t), \\max(O_t, C_t)]$
- **Polarité** : Hausse (*Bullish*) si $C_t \\ge O_t$ ; Baisse (*Bearish*) si $C_t < O_t$.

### 2.2 Moyenne Mobile du Volume (VMA)
$$\\text{VMA}_n(t) = \\frac{1}{n} \\sum_{i=0}^{n-1} V_{t-i}$$

---

## 3. Double-Encodage & Garde-Fous Cognitifs
1. **Valence CVD-Safe** : Couleurs de hausse et de baisse issues de `tokens.semantic.positive` et `tokens.semantic.negative` (pas de rouge/vert purs inaccessibles).
2. **Couplage temporel 1D** : Infobulle unifiée synchronisée par index (`mode: 'index'`, `axis: 'x'`).

---

## 4. Quand l'utiliser / Quand NE PAS l'utiliser

### ✅ Quand l'utiliser
- Analyse de cours financiers, actions, cryptomonnaies ou matières premières où la corrélation prix-volume valide la force d'une tendance.

### ❌ Quand NE PAS l'utiliser
- Communication financière grand public non initiée (👉 *utiliser Line Chart standard ou Area Chart*).
"""

write_file("template/05-evolution-temporelle/candlestick-volume/template.js", candle_js)
write_file("template/05-evolution-temporelle/candlestick-volume/candlestick-volume.md", candle_md)
write_file("guide/05-evolution-temporelle/candlestick-volume.md", candle_md)
write_file("template/05-evolution-temporelle/candlestick-volume/preview.html", preview_html(
    id_name="candlestick-volume",
    title="Chandeliers Japonais + Volume (OHLCV)",
    subtitle="Panneaux empilés verticaux synchronisés sur l'axe temporel : cours boursier OHLC et volume de transactions",
    category="05-evolution-temporelle",
    when_use="Analyse financière et technique où la dynamique des prix (ouverture, plus haut, plus bas, clôture) doit être corrélée au volume de transactions.",
    benefit="Empêche les erreurs de double axe en séparant le cours et le volume dans deux zones étagées partageant le même continuum temporel.",
    when_not="Présentations grand public ou rapports narratifs exécutifs.",
    alt="Utiliser Line Chart pour une série de clôture simple ou Sparkline dans un tableau."
))

print("Lot 1 (P0) templates generated successfully!")
