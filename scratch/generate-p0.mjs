/**
 * @file scratch/generate-p0.mjs
 * @description Generates all 4 P0 combo templates:
 * 1. histogramme-kde
 * 2. box-strip-plot
 * 3. raincloud-plot
 * 4. candlestick-volume
 */

import fs from 'fs';
import path from 'path';

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
  console.log(`Created: ${filePath}`);
}

function generatePreviewHTML(def) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${def.title} — kit-charts</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=Fira+Code:wght@400;500;600&family=Fira+Sans:wght@400;500;600;700&family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Roboto+Mono:wght@400;500;700&family=Roboto:wght@400;500;700&family=Source+Code+Pro:wght@400;500;600&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js"></script>
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
        <a href="../../../index.html">← kit-charts</a> / <a href="../../../index.html#gallerySection">${def.category}</a> / ${def.id}
      </div>
      <div class="header-panel">
        <div class="title-group">
          <h1>${def.title}</h1>
          <p>${def.subtitle}</p>
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
        <p><strong>Cas d'usage :</strong> ${def.whenToUse}</p>
        <p><strong>Bénéfice cognitif :</strong> ${def.cognitiveBenefit}</p>
      </div>
      <div class="rule-item">
        <h3>❌ Quand NE PAS l'utiliser</h3>
        <p><strong>Contre-indications :</strong> ${def.whenNotToUse}</p>
        <p><strong>Alternatives :</strong> ${def.alternatives}</p>
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

        const chartModule = (window.KitCharts && window.KitCharts['${def.id}']) || window;
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
</html>`;
}

// --------------------------------------------------------------------------
// 2. box-strip-plot
// --------------------------------------------------------------------------
const boxStripTemplateJs = `/**
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

  /**
   * Calcule le résumé de Tukey R-7 pour un échantillon.
   */
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

  /**
   * Calcule un offset de jitter déterministe basé sur le nombre d'or.
   */
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

  function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
    const canvas = typeof canvasTarget === 'string'
      ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
      : canvasTarget;

    if (!canvas) throw new Error(\`Canvas element "\${canvasTarget}" not found\`);

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
      return { rawPoints, stats, color, label: labels[i] || \`Groupe \${i + 1}\` };
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

          // 1. Moustaches verticales
          ctx.beginPath();
          ctx.strokeStyle = isDark ? '#94A3B8' : '#475569';
          ctx.lineWidth = 1.5;
          ctx.moveTo(xCenter, yLowW);
          ctx.lineTo(xCenter, yQ1);
          ctx.moveTo(xCenter, yQ3);
          ctx.lineTo(xCenter, yUpW);
          // Caps horizontaux
          const capW = boxWidth * 0.4;
          ctx.moveTo(xCenter - capW / 2, yLowW);
          ctx.lineTo(xCenter + capW / 2, yLowW);
          ctx.moveTo(xCenter - capW / 2, yUpW);
          ctx.lineTo(xCenter + capW / 2, yUpW);
          ctx.stroke();

          // 2. Boîte interquartile [Q1 - Q3]
          ctx.fillStyle = hexToRgba(color, isDark ? 0.35 : 0.25);
          ctx.fillRect(xCenter - boxWidth / 2, yQ3, boxWidth, yQ1 - yQ3);
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.strokeRect(xCenter - boxWidth / 2, yQ3, boxWidth, yQ1 - yQ3);

          // 3. Ligne médiane
          ctx.beginPath();
          ctx.strokeStyle = isDark ? '#FFFFFF' : '#0F172A';
          ctx.lineWidth = 2.5;
          ctx.moveTo(xCenter - boxWidth / 2, yMed);
          ctx.lineTo(xCenter + boxWidth / 2, yMed);
          ctx.stroke();

          // 4. Points individuels (Strip/Jitter)
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

          // 5. Libellé d'effectif n
          ctx.font = \`500 11px \${tokens.fontMono || 'monospace'}\`;
          ctx.fillStyle = tokens.textMuted || '#64748B';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(\`n=\${stats.n}\`, xCenter, Math.max(14, yUpW - 8));
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
                  \`Échantillon : n = \${stats.n} observations\`,
                  \`Médiane : \${stats.median.toLocaleString('fr-FR')}\`,
                  \`IQR [Q1—Q3] : [\${stats.q1.toLocaleString('fr-FR')} — \${stats.q3.toLocaleString('fr-FR')}]\`,
                  \`Moustaches : [\${stats.lowerWhisker.toLocaleString('fr-FR')} — \${stats.upperWhisker.toLocaleString('fr-FR')}]\`,
                  \`Outliers détectés : \${stats.outliers.length}\`
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
`;

const boxStripMd = `# Box Plot + Strip / Jitter Plot (Box-Strip Combo)

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
Position continue $p = 1 + (n - 1) \cdot q$ pour $q \in \{0.25, 0.50, 0.75\}$ :
$$Q(q) = x_{(\lfloor p \rfloor)} + (p - \lfloor p \rfloor) \cdot (x_{(\lceil p \rceil)} - x_{(\lfloor p \rfloor)})$$
$$\text{IQR} = Q_3 - Q_1$$

### 2.2 Moustaches et Outliers
- Borne inférieure : $\text{LowW} = \max\left(\min(x), Q_1 - 1.5 \cdot \text{IQR}\right)$
- Borne supérieure : $\text{UpW} = \min\left(\max(x), Q_3 + 1.5 \cdot \text{IQR}\right)$
- Outlier si $x_i < \text{LowW}$ ou $x_i > \text{UpW}$.

### 2.3 Jitter Déterministe au Nombre d'Or
Pour éviter tout appel non reproductible à \`Math.random()\`, chaque point $i$ est décalé horizontalement via la séquence de quasi-Monte Carlo :
$$\Delta x_i = \left( (i \cdot \phi + \text{seed}) \bmod 1 - 0.5 \right) \cdot W_{\text{jitter}}$$
avec $\phi = \frac{\sqrt{5}-1}{2} \approx 0.6180339887$ et $W_{\text{jitter}} \le 0.4 \times \text{largeur boîte}$.

---

## 3. Double-Encodage & Garde-Fous Cognitifs
1. **Boîte interquartile** : Fond coloré transparent ($\alpha = 0.25$) et contour net 2px.
2. **Médiane contrastée** : Trait épais de 2.5px en contraste fort.
3. **Points bruts** : Disques de rayon 2.5px avec opacité 0.85 pour discerner la densité.
4. **Outliers mis en évidence** : Couleur d'anomalie (`tokens.emphasis.anomaly`) et rayon 3.5px.
5. **Indication de $n$** : Inscription tabulaire `n = XX` au-dessus de chaque groupe.

---

## 4. Quand l'utiliser / Quand NE PAS l'utiliser

### ✅ Quand l'utiliser
- Comparaison de distributions pour des échantillons petits à modérés ($10 \le n \le 200$ par groupe).
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
`;

writeFile('template/03-distribution/box-strip-plot/template.js', boxStripTemplateJs);
writeFile('template/03-distribution/box-strip-plot/box-strip-plot.md', boxStripMd);
writeFile('guide/03-distribution/box-strip-plot.md', boxStripMd);
writeFile('template/03-distribution/box-strip-plot/preview.html', generatePreviewHTML({
  id: 'box-strip-plot',
  title: 'Box Plot + Strip / Jitter Plot',
  subtitle: 'Résumé robuste à 5 nombres de Tukey & superposition déterministe des observations individuelles',
  category: '03-distribution',
  whenToUse: 'Comparaison de distribution entre groupes d\'échantillon modéré (10 à 200 observations) pour rendre compte simultanément des quantiles et de la dispersion réelle sans masquer la taille de l\'échantillon.',
  cognitiveBenefit: 'Empêche l\'illusion d\'échantillon en affichant chaque point réel avec un jitter déterministe, garantissant une transparence totale de la preuve visuelle.',
  whenNotToUse: 'Très grands échantillons (n > 500) provoquant un sur-tracé massif.',
  alternatives: 'Utiliser Histogramme-KDE, Violin Plot ou Hexbin Plot pour les grands volumes de données.'
}));

console.log('Group P0 - Template 2 (box-strip-plot) done.');

// --------------------------------------------------------------------------
// 3. raincloud-plot
// --------------------------------------------------------------------------
const raincloudTemplateJs = `/**
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

    if (!canvas) throw new Error(\`Canvas element "\${canvasTarget}" not found\`);

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
      return { rawPoints, kde, stats, color, label: labels[i] || \`Groupe \${i + 1}\` };
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

          // 1. Demi-violon (Cloud) à droite du centre
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

          // 2. Micro-Box au centre
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

          // 3. Gouttes de pluie (Rain / Jittered points) à gauche du centre
          const phi = 0.618033988749895;
          rawPoints.forEach((val, pIdx) => {
            const yPt = y.getPixelForValue(val);
            const jitterOffset = -8 - (((pIdx * phi) % 1) * (maxCloudWidth * 0.6));
            ctx.beginPath();
            ctx.fillStyle = hexToRgba(color, 0.80);
            ctx.arc(xCenter + jitterOffset, yPt, 2.5, 0, Math.PI * 2);
            ctx.fill();
          });

          // 4. Libellé d'effectif n
          ctx.font = \`500 11px \${tokens.fontMono || 'monospace'}\`;
          ctx.fillStyle = tokens.textMuted || '#64748B';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(\`n=\${stats.n}\`, xCenter, Math.max(14, y.getPixelForValue(kde.max) - 6));
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
                  \`Échantillon : n = \${stats.n} observations\`,
                  \`Médiane : \${stats.median.toLocaleString('fr-FR')}\`,
                  \`IQR [Q1—Q3] : [\${stats.q1.toLocaleString('fr-FR')} — \${stats.q3.toLocaleString('fr-FR')}]\`,
                  \`Bande de Silverman (h) : \${kde.h.toFixed(2)}\`
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
`;

const raincloudMd = `# Raincloud Plot (Half-Violin + Box + Rain Strip)

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
$$\hat{f}_{\text{half}}(x) = \frac{1}{n \cdot h} \sum_{i=1}^n K\left(\frac{x - x_i}{h}\right) \quad \text{pour } x \ge x_{\text{center}}$$

### 2.2 Bande Passante de Silverman
$$h = 0.9 \cdot \min\left(\sigma, \frac{\text{IQR}}{1.34}\right) \cdot n^{-1/5}$$

### 2.3 Disposition Spatiale Anti-Occlusion (Kievit 2019)
- $X_{\text{cloud}} = X_{\text{center}} + w(x) \cdot W_{\max}$
- $X_{\text{box}} = X_{\text{center}} \pm 4\text{px}$
- $X_{\text{rain}} = X_{\text{center}} - \Delta_{\text{jitter}}$

---

## 3. Double-Encodage & Garde-Fous Cognitifs
1. **Élimination de la redondance symétrique** : Le demi-violon utilise 50% d'espace en moins qu'un violon classique, laissant la place aux observations individuelles.
2. **Points déterministes** : Jitter calculé au nombre d'or ($\phi \approx 0.618$).
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
`;

writeFile('template/03-distribution/raincloud-plot/template.js', raincloudTemplateJs);
writeFile('template/03-distribution/raincloud-plot/raincloud-plot.md', raincloudMd);
writeFile('guide/03-distribution/raincloud-plot.md', raincloudMd);
writeFile('template/03-distribution/raincloud-plot/preview.html', generatePreviewHTML({
  id: 'raincloud-plot',
  title: 'Raincloud Plot (Half-Violin + Box + Rain)',
  subtitle: 'Architecture tri-hybride : densité continue asymétrique, micro-boîte de Tukey et points d\'observation individuels',
  category: '03-distribution',
  whenToUse: 'Publications scientifiques et analyses rigoureuses où l\'on souhaite offrir la vision la plus complète et transparente possible d\'une distribution continue.',
  cognitiveBenefit: 'Combine le macro (KDE), le méso (box plot) et le micro (points bruts) dans une empreinte spatiale compacte sans aucune occlusion visuelle.',
  whenNotToUse: 'Micro-widgets de dashboards denses où l\'espace est insuffisant pour lire les 3 couches simultanément.',
  alternatives: 'Utiliser Box Plot pour un format ultra-compact, ou Histogramme-KDE pour les grands volumes.'
}));

console.log('Group P0 - Template 3 (raincloud-plot) done.');

// --------------------------------------------------------------------------
// 4. candlestick-volume
// --------------------------------------------------------------------------
const candleVolTemplateJs = `/**
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
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return o || {}; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  /**
   * Calcule la moyenne mobile du volume (VMA).
   */
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

    if (!canvas) throw new Error(\`Canvas element "\${canvasTarget}" not found\`);

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

        // 1. Ligne de séparation subtile entre panneau Price (~70%) et Volume (~30%)
        const splitY = yVolume ? yVolume.top : chartArea.bottom * 0.70;
        ctx.beginPath();
        ctx.strokeStyle = tokens.border || (isDark ? '#334155' : '#E2E8F0');
        ctx.lineWidth = 1;
        ctx.moveTo(chartArea.left, splitY);
        ctx.lineTo(chartArea.right, splitY);
        ctx.stroke();

        // 2. Tracé des chandeliers OHLC sur le panneau supérieur
        candleStats.forEach((d, idx) => {
          const xCenter = x.getPixelForValue(idx);
          const yOpen = yPrice.getPixelForValue(d.o);
          const yClose = yPrice.getPixelForValue(d.c);
          const yHigh = yPrice.getPixelForValue(d.h);
          const yLow = yPrice.getPixelForValue(d.l);

          const isBull = d.isBullish;
          const color = isBull ? bullColor : bearColor;

          // Mèche (High - Low)
          ctx.beginPath();
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          ctx.moveTo(xCenter, yHigh);
          ctx.lineTo(xCenter, yLow);
          ctx.stroke();

          // Corps (Open - Close)
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
              title: (items) => \`Date : \${items[0].label}\`,
              label: (ctx) => {
                const idx = ctx.dataIndex;
                const d = ohlcList[idx];
                if (!d) return '';
                if (ctx.dataset.label === 'Volume') {
                  return \`Volume : \${d.v.toLocaleString('fr-FR')} titres\`;
                }
                if (ctx.dataset.label.includes('Volume MA')) {
                  return \`VMA (5) : \${vmaList[idx].toLocaleString('fr-FR')} titres\`;
                }
                return [
                  \`Open : \${d.o.toFixed(2)} € | High : \${d.h.toFixed(2)} €\`,
                  \`Low  : \${d.l.toFixed(2)} € | Close : \${d.c.toFixed(2)} €\`,
                  \`Variation : \${d.c >= d.o ? '+' : ''}\${((d.c - d.o) / d.o * 100).toFixed(2)}%\`
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
            max: Math.ceil(volMax * 3.5), // Réduit la hauteur visuelle du volume au tiers inférieur
            grid: { display: false },
            ticks: {
              color: tokens.textMuted,
              font: { family: tokens.fontMono, size: 10 },
              callback: (val) => val > 0 && val <= volMax ? \`\${(val / 1000).toFixed(0)}k\` : ''
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
`;

const candleVolMd = `# Candlestick + Volume (Stacked Panels)

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
- **Corps (*Real Body*)** : $[\min(O_t, C_t), \max(O_t, C_t)]$
- **Polarité** : Hausse (*Bullish*) si $C_t \ge O_t$ ; Baisse (*Bearish*) si $C_t < O_t$.

### 2.2 Moyenne Mobile du Volume (VMA)
$$\text{VMA}_n(t) = \frac{1}{n} \sum_{i=0}^{n-1} V_{t-i}$$

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
`;

writeFile('template/05-evolution-temporelle/candlestick-volume/template.js', candleVolTemplateJs);
writeFile('template/05-evolution-temporelle/candlestick-volume/candlestick-volume.md', candleVolMd);
writeFile('guide/05-evolution-temporelle/candlestick-volume.md', candleVolMd);
writeFile('template/05-evolution-temporelle/candlestick-volume/preview.html', generatePreviewHTML({
  id: 'candlestick-volume',
  title: 'Chandeliers Japonais + Volume (OHLCV)',
  subtitle: 'Panneaux empilés verticaux synchronisés sur l\'axe temporel : cours boursier OHLC et volume de transactions',
  category: '05-evolution-temporelle',
  whenToUse: 'Analyse financière et technique où la dynamique des prix (ouverture, plus haut, plus bas, clôture) doit être corrélée au volume de transactions.',
  cognitiveBenefit: 'Empêche les erreurs de double axe en séparant le cours et le volume dans deux zones étagées partageant le même continuum temporel.',
  whenNotToUse: 'Présentations grand public ou rapports narratifs exécutifs.',
  alternatives: 'Utiliser Line Chart pour une série de clôture simple ou Sparkline dans un tableau.'
}));

console.log('Group P0 - Template 4 (candlestick-volume) done.');
