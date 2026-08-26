# -*- coding: utf-8 -*-
"""
Generator for P0 combo templates:
1. histogramme-kde (03-distribution)
2. box-strip-plot (03-distribution)
3. raincloud-plot (03-distribution)
4. candlestick-volume (05-evolution-temporelle)
"""

import os
from pathlib import Path

ROOT = Path("/Users/louislaville/Desktop/kit-charts")

def write_file(rel_path, content):
    full_path = ROOT / rel_path
    full_path.parent.mkdir(parents=True, exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print(f"Created: {rel_path}")

def preview_html(id_name, title, subtitle, category, when_use, benefit, when_not, alt):
    tpl = """<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>__TITLE__ — kit-charts</title>
  <!-- Google Fonts pour tous les thèmes -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=Fira+Code:wght@400;500;600&family=Fira+Sans:wght@400;500;600;700&family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Roboto+Mono:wght@400;500;700&family=Roboto:wght@400;500;700&family=Source+Code+Pro:wght@400;500;600&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet">
  <!-- Chart.js v4.4.7 CDN -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js"></script>
  <!-- Theme Tokens & Template (Zero-CORS UMD loading for file:// & http://) -->
  <script src="../../../themes/theme-tokens.js"></script>
  <script src="./template.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background-color: #F8FAFC;
      color: #0F172A;
      min-height: 100vh;
      padding: 2rem 1.5rem;
      transition: background-color 0.25s ease, color 0.25s ease;
    }
    .wrapper {
      max-width: 1000px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .breadcrumb {
      font-size: 0.8125rem;
      color: #64748B;
      margin-bottom: 0.5rem;
    }
    .breadcrumb a {
      color: #2B8CBE;
      text-decoration: none;
    }
    .breadcrumb a:hover {
      text-decoration: underline;
    }
    .header-panel {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #E2E8F0;
    }
    .title-group h1 {
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .title-group p {
      font-size: 0.875rem;
      color: #64748B;
      margin-top: 0.25rem;
    }
    .controls-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .controls-group label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #334155;
    }
    select.theme-select {
      padding: 0.5rem 0.875rem;
      border-radius: 6px;
      border: 1px solid #CBD5E1;
      background-color: #FFFFFF;
      color: #0F172A;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    select.theme-select:focus {
      border-color: #2B8CBE;
      box-shadow: 0 0 0 3px rgba(43, 140, 190, 0.15);
    }
    .chart-container {
      position: relative;
      width: 100%;
      height: 480px;
      background-color: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 1.25rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      transition: background-color 0.25s ease, border-color 0.25s ease;
    }
    .cognitive-rules-card {
      background-color: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.25rem;
      transition: background-color 0.25s ease, border-color 0.25s ease;
    }
    .rule-item {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .rule-item h3 {
      font-size: 0.8125rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #2B8CBE;
    }
    .rule-item p {
      font-size: 0.875rem;
      line-height: 1.45;
      color: #475569;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div>
      <div class="breadcrumb">
        <a href="../../../index.html">← kit-charts</a> / <a href="../../../index.html#gallerySection">__CATEGORY__</a> / __ID__
      </div>
      <div class="header-panel">
        <div class="title-group">
          <h1>__TITLE__</h1>
          <p>__SUBTITLE__</p>
        </div>
        <div class="controls-group">
          <label for="themeSelector">Thème Cognitif :</label>
          <select id="themeSelector" class="theme-select">
            <option value="colorbrewer-accessible" selected>01. ColorBrewer Accessible (Défaut)</option>
            <option value="viridis-perceptual">02. Viridis Perceptual</option>
            <option value="paul-tol-scientific">03. Paul Tol Scientific</option>
            <option value="tableau-stone-categorical">04. Tableau Stone Categorical</option>
            <option value="okabe-ito-cud">05. Okabe-Ito CUD</option>
            <option value="tufte-minimalist-executive">06. Tufte Minimalist Executive</option>
            <option value="nord-cognitive-dark">07. Nord Cognitive Dark</option>
            <option value="atkinson-hyperlegible">08. Atkinson Hyperlegible</option>
          </select>
        </div>
      </div>
    </div>

    <div id="chartContainer" class="chart-container">
      <canvas id="chartCanvas"></canvas>
    </div>

    <div id="cognitiveRulesCard" class="cognitive-rules-card">
      <div class="rule-item">
        <h3>✅ Quand l'utiliser</h3>
        <p><strong>Cas d'usage :</strong> __WHEN_USE__</p>
        <p><strong>Bénéfice cognitif :</strong> __BENEFIT__</p>
      </div>
      <div class="rule-item">
        <h3>❌ Quand NE PAS l'utiliser</h3>
        <p><strong>Contre-indications :</strong> __WHEN_NOT__</p>
        <p><strong>Alternatives :</strong> __ALT__</p>
      </div>
    </div>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const canvasId = 'chartCanvas';
      const chartContainer = document.getElementById('chartContainer');
      const themeSelector = document.getElementById('themeSelector');
      const rulesCard = document.getElementById('cognitiveRulesCard');
      const tokensEngine = window.KitChartsTheme || (window.KitCharts && window.KitCharts.Theme) || {};

      function updateTheme(themeName) {
        if (typeof tokensEngine.loadGoogleFonts === 'function') {
          tokensEngine.loadGoogleFonts(themeName);
        }
        let tokens = null;
        if (typeof tokensEngine.applyThemeToContainer === 'function') {
          tokens = tokensEngine.applyThemeToContainer(chartContainer, themeName);
        } else if (typeof tokensEngine.getThemeTokens === 'function') {
          tokens = tokensEngine.getThemeTokens(themeName);
        }

        if (tokens) {
          document.body.style.backgroundColor = tokens.isDark ? '#242933' : '#F8FAFC';
          document.body.style.color = tokens.textPrimary;
          if (rulesCard) {
            rulesCard.style.backgroundColor = tokens.surface;
            rulesCard.style.borderColor = tokens.border;
          }
        }

        const chartModule = (window.KitCharts && window.KitCharts['__ID__']) || window;
        if (typeof chartModule.createChart === 'function') {
          chartModule.createChart(canvasId, null, themeName);
        }
      }

      if (themeSelector) {
        updateTheme(themeSelector.value);
        themeSelector.addEventListener('change', function(e) {
          updateTheme(e.target.value);
        });
      } else {
        updateTheme('colorbrewer-accessible');
      }
    });
  </script>
</body>
</html>"""
    return (tpl
            .replace("__TITLE__", title)
            .replace("__SUBTITLE__", subtitle)
            .replace("__CATEGORY__", category)
            .replace("__ID__", id_name)
            .replace("__WHEN_USE__", when_use)
            .replace("__BENEFIT__", benefit)
            .replace("__WHEN_NOT__", when_not)
            .replace("__ALT__", alt))

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
write_file("template/03-distribution/box-strip-plot/template.js", boxStripTemplateJs)
write_file("template/03-distribution/box-strip-plot/box-strip-plot.md", boxStripMd)
write_file("guide/03-distribution/box-strip-plot.md", boxStripMd)
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
write_file("template/03-distribution/raincloud-plot/template.js", raincloudTemplateJs)
write_file("template/03-distribution/raincloud-plot/raincloud-plot.md", raincloudMd)
write_file("guide/03-distribution/raincloud-plot.md", raincloudMd)
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
write_file("template/05-evolution-temporelle/candlestick-volume/template.js", candleVolTemplateJs)
write_file("template/05-evolution-temporelle/candlestick-volume/candlestick-volume.md", candleVolMd)
write_file("guide/05-evolution-temporelle/candlestick-volume.md", candleVolMd)
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

print("P0 generated successfully!")
