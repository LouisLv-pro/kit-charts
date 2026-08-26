/**
 * @file scratch/generate-all-combos.mjs
 * @description Master generator for all 13 new combo templates in kit-charts.
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

function previewHTML(def) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${def.title} — kit-charts</title>
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
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

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
      height: 460px;
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

console.log('Scaffold ready.');
