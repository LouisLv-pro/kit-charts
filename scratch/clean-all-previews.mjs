/**
 * @file scratch/clean-all-previews.mjs
 * @description Script d'automatisation pour parser, nettoyer et réécrire les 84 templates preview.html
 * selon la structure ISO single-column parfaite, sans duplication, avec la toolbar colorimétrique
 * et le bouton d'activation/désactivation des étiquettes de données (Data Labels).
 */

import fs from 'fs';
import path from 'path';

const ROOT_DIR = '/Users/louislaville/Desktop/kit-charts';
const TEMPLATE_DIR = path.join(ROOT_DIR, 'template');
const GUIDE_DIR = path.join(ROOT_DIR, 'guide');
const INDEX_PATH = path.join(ROOT_DIR, 'index.html');

// 1. Charger le catalogue officiel depuis index.html
const indexContent = fs.readFileSync(INDEX_PATH, 'utf8');
const catalogStart = indexContent.indexOf('const CATALOG = [');
const catalogEnd = indexContent.indexOf('    ];\n\n    // ========================================================================', catalogStart);
const catalogCode = indexContent.slice(catalogStart, catalogEnd + 6).replace('const CATALOG =', 'return');
const catalog = (new Function(catalogCode))();
const catalogMap = new Map();
catalog.forEach(item => catalogMap.set(item.id, item));

// 2. Charger les guides markdown
function findFiles(dir, ext) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findFiles(full, ext));
    else if (entry.name.endsWith(ext)) results.push(full);
  }
  return results;
}

const guideFiles = findFiles(GUIDE_DIR, '.md');
const guideMap = new Map();
for (const gf of guideFiles) {
  const base = path.basename(gf, '.md');
  const content = fs.readFileSync(gf, 'utf8');
  guideMap.set(base, content);
}

// Trouver tous les preview.html
const previewFiles = findFiles(TEMPLATE_DIR, 'preview.html').sort();
console.log(`🔍 ${previewFiles.length} fichiers preview.html trouvés à standardiser.`);

const THEME_NAMES = {
  'colorbrewer-accessible': 'ColorBrewer Accessible',
  'viridis-perceptual': 'Viridis Perceptual',
  'paul-tol-scientific': 'Paul Tol Scientific',
  'tableau-stone-categorical': 'Tableau Stone Categorical',
  'okabe-ito-cud': 'Okabe-Ito CUD',
  'tufte-minimalist-executive': 'Tufte Minimalist Executive',
  'nord-cognitive-dark': 'Nord Cognitive Dark',
  'atkinson-hyperlegible': 'Atkinson Hyperlegible'
};

const SWATCHES_TOOLBAR_HTML = `        <div class="controls-group">
          <div class="toolbar-theme-label"><span>🎨</span> Thème :</div>
          <div class="theme-swatches-group" id="themeSwatchesGroup" role="radiogroup" aria-label="Sélection du thème colorimétrique">
            <button type="button" class="theme-swatch active" data-theme-name="colorbrewer-accessible" style="background: linear-gradient(135deg, #2B8CBE 50%, #E66101 50%);" title="01. ColorBrewer Accessible" aria-label="Thème ColorBrewer Accessible"></button>
            <button type="button" class="theme-swatch" data-theme-name="viridis-perceptual" style="background: linear-gradient(135deg, #3E4A89 50%, #35B779 50%);" title="02. Viridis Perceptual" aria-label="Thème Viridis Perceptual"></button>
            <button type="button" class="theme-swatch" data-theme-name="paul-tol-scientific" style="background: linear-gradient(135deg, #4477AA 50%, #CC6677 50%);" title="03. Paul Tol Scientific" aria-label="Thème Paul Tol Scientific"></button>
            <button type="button" class="theme-swatch" data-theme-name="tableau-stone-categorical" style="background: linear-gradient(135deg, #4E79A7 50%, #F28E2B 50%);" title="04. Tableau Stone Categorical" aria-label="Thème Tableau Stone"></button>
            <button type="button" class="theme-swatch" data-theme-name="okabe-ito-cud" style="background: linear-gradient(135deg, #E69F00 50%, #56B4E9 50%);" title="05. Okabe-Ito CUD" aria-label="Thème Okabe-Ito CUD"></button>
            <button type="button" class="theme-swatch" data-theme-name="tufte-minimalist-executive" style="background: linear-gradient(135deg, #111111 50%, #B22222 50%);" title="06. Tufte Minimalist Executive" aria-label="Thème Tufte Minimalist"></button>
            <button type="button" class="theme-swatch" data-theme-name="nord-cognitive-dark" style="background: linear-gradient(135deg, #2E3440 50%, #88C0D0 50%);" title="07. Nord Cognitive Dark" aria-label="Thème Nord Cognitive Dark"></button>
            <button type="button" class="theme-swatch" data-theme-name="atkinson-hyperlegible" style="background: linear-gradient(135deg, #000000 50%, #005A9C 50%);" title="08. Atkinson Hyperlegible" aria-label="Thème Atkinson Hyperlegible"></button>
          </div>
          <div id="activeThemeIndicator" class="active-theme-name-tag">ColorBrewer Accessible</div>

          <!-- Bouton Dessin de Label en Surbrillance -->
          <button id="dataLabelsToggleBtn" class="btn-label-toggle active" type="button" aria-pressed="true" title="Étiquettes de données (Labels) : Activées" aria-label="Activer ou désactiver les étiquettes de données">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
              <circle cx="7" cy="7" r="1.5" fill="currentColor"></circle>
            </svg>
          </button>
        </div>`;

function extractRulesHTML(content, folderName, chartId) {
  const ruleItems = [...content.matchAll(/<div\s+class=[\"']rule-item[\"'][^>]*>([\s\S]*?)<\/div>/gi)];
  if (ruleItems.length >= 2) {
    return ruleItems.map(m => `      <div class="rule-item">\n        ${m[1].trim()}\n      </div>`).join('\n');
  }

  const guideContent = guideMap.get(folderName) || guideMap.get(chartId) || '';
  const whenUseMatch = guideContent.match(/##\s*2\.\s*Quand l'utiliser[^\n]*\n([\s\S]*?)(?=\n##|$)/i);
  const whenNotMatch = guideContent.match(/##\s*3\.\s*Quand NE PAS l'utiliser[^\n]*\n([\s\S]*?)(?=\n##|$)/i);

  if (whenUseMatch && whenNotMatch) {
    const uText = whenUseMatch[1].trim().replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ');
    const nText = whenNotMatch[1].trim().replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ');
    return `      <div class="rule-item">
        <h3>✅ Quand l'utiliser</h3>
        <p>${uText}</p>
      </div>
      <div class="rule-item">
        <h3>❌ Quand NE PAS l'utiliser</h3>
        <p>${nText}</p>
      </div>`;
  }

  const catalogItem = catalogMap.get(chartId) || catalogMap.get(folderName);
  if (catalogItem && catalogItem.cognitiveSummary) {
    return `      <div class="rule-item">
        <h3>✅ Quand l'utiliser</h3>
        <p><strong>Cas d'usage :</strong> ${catalogItem.cognitiveSummary}</p>
      </div>
      <div class="rule-item">
        <h3>❌ Recommandation Cognitive</h3>
        <p><strong>Règle :</strong> ${catalogItem.cognitiveRank || 'Respecter les contraintes de contraste et d\'accessibilité WCAG AAA.'}</p>
      </div>`;
  }

  return `      <div class="rule-item">
        <h3>✅ Quand l'utiliser</h3>
        <p>Visualisation standardisée de haute précision cognitive.</p>
      </div>
      <div class="rule-item">
        <h3>❌ Quand NE PAS l'utiliser</h3>
        <p>Éviter les surcharges graphiques et respecter les principes de Tufte et Sweller.</p>
      </div>`;
}

let processedCount = 0;

for (const filePath of previewFiles) {
  const relPath = path.relative(TEMPLATE_DIR, filePath);
  const parts = relPath.split(path.sep);
  const dirPath = path.dirname(filePath);
  const folderName = path.basename(dirPath);
  const originalContent = fs.readFileSync(filePath, 'utf8');

  // Déterminer la profondeur par rapport à la racine du projet
  const depth = parts.length;
  const relToIndex = depth === 2 ? '../../index.html' : '../../../index.html';
  const relToThemes = depth === 2 ? '../../themes/theme-tokens.js' : '../../../themes/theme-tokens.js';

  // Identifier le chart ID & informations du catalogue
  let chartId = folderName;
  let isRootKpiShowcase = false;
  let isRootAnimationShowcase = false;
  let isRootTooltipShowcase = false;
  let isAnimationSubPrinciple = false;

  if (parts.length === 2 && parts[0] === '00-kpi-card') {
    isRootKpiShowcase = true;
    chartId = '00-kpi-card';
  } else if (parts.length === 2 && parts[0] === 'animation') {
    isRootAnimationShowcase = true;
    chartId = 'animation';
  } else if (parts.length === 2 && parts[0] === 'tooltip') {
    isRootTooltipShowcase = true;
    chartId = 'tooltip';
  } else if (parts.length === 3 && parts[0] === 'animation') {
    isAnimationSubPrinciple = true;
    chartId = 'anim-' + parts[1].replace(/^[0-9]+-/, '');
  }

  const catalogItem = catalogMap.get(chartId) || catalogMap.get(folderName) || {};

  // 1. Extraire ou déterminer le titre
  let pageTitle = '';
  if (isRootKpiShowcase) {
    pageTitle = 'Suite Complète de KPI Cards Cognitives — kit-charts';
  } else if (isRootAnimationShowcase) {
    pageTitle = 'Laboratoire de Micro-Animations Cognitives — kit-charts';
  } else if (isRootTooltipShowcase) {
    pageTitle = 'Laboratoire d\'Ergonomie des Tooltips & Details-on-Demand — kit-charts';
  } else {
    const titleMatch = originalContent.match(/<title>([^<]*)<\/title>/i);
    if (titleMatch && titleMatch[1].trim() && !titleMatch[1].startsWith('00-kpi-card')) {
      pageTitle = titleMatch[1].trim();
    } else if (catalogItem.title) {
      pageTitle = `${catalogItem.title} — kit-charts`;
    } else {
      pageTitle = `${folderName} — kit-charts`;
    }
  }

  // 2. Extraire ou déterminer le Breadcrumb
  let categoryName = parts[0];
  let breadcrumbHTML = '';
  if (isRootKpiShowcase) {
    breadcrumbHTML = `<a href="${relToIndex}">← kit-charts</a> / <a href="${relToIndex}#gallerySection">00-kpi-card</a> / Showcase Exécutif`;
  } else if (isRootAnimationShowcase) {
    breadcrumbHTML = `<a href="${relToIndex}">← kit-charts</a> / <a href="${relToIndex}#gallerySection">11-animation</a> / preview`;
  } else if (isRootTooltipShowcase) {
    breadcrumbHTML = `<a href="${relToIndex}">← kit-charts</a> / <a href="${relToIndex}#gallerySection">10-tooltip</a> / preview`;
  } else if (isAnimationSubPrinciple) {
    breadcrumbHTML = `<a href="${relToIndex}">← kit-charts</a> / <a href="${relToIndex}#gallerySection">11-animation</a> / ${parts[1]}`;
  } else {
    breadcrumbHTML = `<a href="${relToIndex}">← kit-charts</a> / <a href="${relToIndex}#gallerySection">${categoryName}</a> / ${folderName}`;
  }

  // 3. Extraire ou déterminer h1 et p dans .title-group
  let titleH1 = '';
  let subtitleP = '';

  if (isRootKpiShowcase) {
    titleH1 = 'Scorecard de KPI Cards Cognitives — 7 Variantes';
    subtitleP = 'Composants analytiques haute performance conçus selon les sciences cognitives.';
  } else if (isRootAnimationShowcase) {
    titleH1 = 'Laboratoire de Micro-Animations Cognitives';
    subtitleP = 'Constance d\'objet, transitions perceptives fluides et conformité WCAG 2.2 prefers-reduced-motion.';
  } else if (isRootTooltipShowcase) {
    titleH1 = 'Laboratoire d\'Ergonomie des Tooltips';
    subtitleP = 'Psychophysique des Infobulles, Details-on-Demand et Accessibilité WCAG AAA.';
  } else {
    const h1Match = originalContent.match(/<div\s+class=[\"']title-group[\"'][^>]*>[\s\S]*?<h1>([^<]*)<\/h1>/i);
    const pMatch = originalContent.match(/<div\s+class=[\"']title-group[\"'][^>]*>[\s\S]*?<p>([^<]*)<\/p>/i);

    if (h1Match && h1Match[1].trim() && !h1Match[1].includes('00-kpi-card')) {
      titleH1 = h1Match[1].trim();
    } else if (catalogItem.title) {
      titleH1 = catalogItem.title;
    } else {
      titleH1 = folderName;
    }

    if (pMatch && pMatch[1].trim() && pMatch[1].trim().length > 5) {
      subtitleP = pMatch[1].trim();
    } else if (catalogItem.cognitiveSummary) {
      subtitleP = catalogItem.cognitiveSummary;
    } else if (chartId === 'table-heatmap-matrix') {
      subtitleP = 'Matrice bidimensionnelle dense avec encodage chromatique séquentiel ou divergent.';
    } else {
      subtitleP = 'Visualisation graphique standardisée avec discrimination psychophysique optimale.';
    }
  }

  // 4. Extraire le contenu de #cognitiveRulesCard
  const rulesCardHTML = extractRulesHTML(originalContent, folderName, chartId);

  // 5. Scripts externes spécifiques dans <head>
  let extraHeadScripts = '';
  if (folderName === 'matrix-heatmap' || folderName === 'density-2d-hexbin' || chartId === 'table-heatmap-matrix') {
    extraHeadScripts += `  <script src="https://cdn.jsdelivr.net/npm/chartjs-chart-matrix@2.0.1/dist/chartjs-chart-matrix.min.js"></script>\n`;
  }
  if (folderName === 'sankey-diagram' || folderName === 'alluvial-diagram') {
    extraHeadScripts += `  <script src="https://cdn.jsdelivr.net/npm/chartjs-chart-sankey@0.12.1/dist/chartjs-chart-sankey.min.js"></script>\n`;
  }
  if (folderName === 'treemap') {
    extraHeadScripts += `  <script src="https://cdn.jsdelivr.net/npm/chartjs-chart-treemap@2.3.1/dist/chartjs-chart-treemap.min.js"></script>\n`;
  }
  if (folderName === 'bubble-map' || folderName === 'choropleth-map' || folderName === 'cartogram-tilegram') {
    extraHeadScripts += `  <script src="https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js"></script>\n`;
    extraHeadScripts += `  <script src="https://cdn.jsdelivr.net/npm/chartjs-chart-geo@4.3.4/build/index.umd.min.js"></script>\n`;
  }
  if (folderName === 'candlestick-ohlc' || folderName === 'candlestick-volume' || folderName === 'dual-axis-controlled') {
    extraHeadScripts += `  <script src="https://cdn.jsdelivr.net/npm/luxon@3.5.0/build/global/luxon.min.js"></script>\n`;
    extraHeadScripts += `  <script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-luxon@1.3.1/dist/chartjs-adapter-luxon.umd.min.js"></script>\n`;
    extraHeadScripts += `  <script src="https://cdn.jsdelivr.net/npm/chartjs-chart-financial@0.2.0/dist/chartjs-chart-financial.min.js"></script>\n`;
  }
  if (['box-plot', 'box-strip-plot', 'violin-plot', 'raincloud-plot', 'beeswarm-plot'].includes(folderName)) {
    extraHeadScripts += `  <script src="https://cdn.jsdelivr.net/npm/@sgratzl/chartjs-chart-boxplot@4.3.4/build/index.umd.min.js"></script>\n`;
  }

  // Scripts de templates dans <head>
  let templateScriptsHTML = '';
  if (isRootKpiShowcase) {
    templateScriptsHTML = `  <script src="./kpi-standard/template.js"></script>
  <script src="./kpi-sparkline/template.js"></script>
  <script src="./kpi-bullet/template.js"></script>
  <script src="./kpi-comparative/template.js"></script>
  <script src="./kpi-distribution/template.js"></script>
  <script src="./kpi-status-alert/template.js"></script>
  <script src="./kpi-composite/template.js"></script>`;
  } else if (isAnimationSubPrinciple) {
    templateScriptsHTML = `  <script src="../template.js"></script>
  <script src="./template.js"></script>`;
  } else {
    templateScriptsHTML = `  <script src="./template.js"></script>`;
  }

  // 6. Contenu du conteneur #chartContainer et styles personnalisés
  let containerClasses = 'chart-container';
  let containerInnerContent = '';
  let customCSS = '';
  let isWideWrapper = isRootKpiShowcase;

  if (isRootKpiShowcase) {
    containerClasses = 'chart-container kpi-scorecard-grid';
    containerInnerContent = `      <div id="targetCard1"></div>
      <div id="targetCard2"></div>
      <div id="targetCard3"></div>
      <div id="targetCard4"></div>
      <div id="targetCard5"></div>
      <div id="targetCard6"></div>
      <div id="targetCard7"></div>`;
    customCSS = `    .chart-container.kpi-scorecard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
      gap: 1.25rem;
      width: 100%;
      min-height: auto;
      padding: 0;
      background: transparent;
      border: none;
      box-shadow: none;
    }\n`;
  } else if (folderName === 'kpi-standard') {
    containerClasses = 'chart-container cards-grid';
    containerInnerContent = `      <div id="cardTarget1"></div>
      <div id="cardTarget2"></div>
      <div class="chart-box" id="canvasBox">
        <div style="font-size: 0.8125rem; font-weight: 600; color: #64748B; text-transform: uppercase;">
          Atteinte de l'Objectif Mensuel
        </div>
        <div class="canvas-container">
          <canvas id="chartCanvas"></canvas>
        </div>
      </div>`;
    customCSS = `    .chart-container.cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.25rem;
      width: 100%;
      min-height: auto;
      padding: 0;
      background: transparent;
      border: none;
      box-shadow: none;
    }
    .chart-box {
      background-color: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 14px;
      padding: 1.25rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-height: 220px;
      transition: background-color 0.25s ease, border-color 0.25s ease;
    }
    .canvas-container {
      position: relative;
      width: 100%;
      height: 120px;
    }\n`;
  } else if (parts[0] === '00-kpi-card') {
    containerClasses = 'chart-container';
    containerInnerContent = `      <div id="cardTarget"></div>
      <div style="position: relative; width: 100%; height: 180px; margin-top: 1rem; display: none;">
        <canvas id="chartCanvas"></canvas>
      </div>`;
  } else if (isRootTooltipShowcase) {
    containerClasses = 'chart-container';
    containerInnerContent = `      <div class="chart-canvas-wrapper" style="position: relative; width: 100%; height: 420px;">
        <canvas id="tooltipDemoCanvas"></canvas>
      </div>

      <div class="interactive-toolbar" style="display: flex; flex-wrap: wrap; gap: 0.5rem; padding-top: 0.75rem; border-top: 1px solid #E2E8F0; align-items: center;">
        <span style="font-size: 0.8125rem; font-weight: 700; color: #64748B; margin-right: 0.5rem;">Ciblage Fitts :</span>
        <button class="toolbar-btn" data-index="0">Inspecter Q1 2025</button>
        <button class="toolbar-btn" data-index="4">Inspecter Q1 2026</button>
        <button class="toolbar-btn" data-index="7">Inspecter Q4 2026 (Focus)</button>
        <button class="toolbar-btn" id="randomizeBtn" style="margin-left: auto;">Données Aléatoires</button>
      </div>`;
    customCSS = `    .toolbar-btn {
      padding: 0.45rem 0.85rem;
      border-radius: 6px;
      border: 1px solid #CBD5E1;
      background: #F1F5F9;
      color: #0F172A;
      font-size: 0.825rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .toolbar-btn:hover {
      background: #2B8CBE;
      color: #FFFFFF;
      border-color: #2B8CBE;
    }\n`;
  } else if (isRootAnimationShowcase) {
    containerClasses = 'chart-container';
    containerInnerContent = `      <div class="chart-canvas-wrapper" style="position: relative; width: 100%; height: 420px;">
        <canvas id="animationDemoCanvas"></canvas>
      </div>

      <div class="interactive-toolbar" id="contextualToolbar" style="display: flex; flex-wrap: wrap; gap: 0.5rem; padding-top: 0.75rem; border-top: 1px solid #E2E8F0; align-items: center;">
        <button class="toolbar-btn btn-primary" id="sortDescBtn">Trier Décroissant</button>
        <button class="toolbar-btn" id="sortAscBtn">Trier Croissant</button>
        <button class="toolbar-btn" id="shuffleBtn">Mélanger</button>
        <button class="toolbar-btn" id="filterTopBtn">Top 4 Pôles</button>
        <button class="toolbar-btn" id="replayBtn">🔄 Rejouer</button>
        <button class="toolbar-btn" id="resetBtn">Données Initiales</button>
        <button class="toolbar-btn" id="reducedMotionBtn" style="margin-left: auto;">Reduced Motion : Inactif</button>
      </div>`;
    customCSS = `    .toolbar-btn {
      padding: 0.45rem 0.85rem;
      border-radius: 6px;
      border: 1px solid #CBD5E1;
      background: #F1F5F9;
      color: #0F172A;
      font-size: 0.825rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .toolbar-btn:hover {
      background: #2B8CBE;
      color: #FFFFFF;
      border-color: #2B8CBE;
    }
    .toolbar-btn.btn-primary {
      background: #2B8CBE;
      color: #FFFFFF;
      border-color: #2B8CBE;
    }\n`;
  } else if (isAnimationSubPrinciple) {
    containerClasses = 'chart-container';
    const toolbarMatch = originalContent.match(/<div class=\"interactive-toolbar\"[\s\S]*?<\/div>/i);
    const toolbarHTML = toolbarMatch ? toolbarMatch[0] : `      <div class="interactive-toolbar" style="display: flex; flex-wrap: wrap; gap: 0.5rem; padding-top: 0.75rem; border-top: 1px solid #E2E8F0; align-items: center;">
        <button class="btn-action btn-primary" id="btnAction1">▶ Déclencher l'Animation</button>
        <button class="btn-action" id="btnAction2">Mettre à jour les données</button>
        <button class="btn-action" id="btnAction3">Données Initiales</button>
      </div>`;
    containerInnerContent = `      <div class="chart-canvas-wrapper" style="position: relative; width: 100%; height: 420px;">
        <canvas id="chartCanvas"></canvas>
      </div>
${toolbarHTML}`;
    customCSS = `    .btn-action {
      padding: 0.45rem 0.85rem;
      border-radius: 6px;
      border: 1px solid #CBD5E1;
      background: #F1F5F9;
      color: #0F172A;
      font-size: 0.825rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .btn-action:hover {
      background: #2B8CBE;
      color: #FFFFFF;
      border-color: #2B8CBE;
    }
    .btn-action.btn-primary {
      background: #2B8CBE;
      color: #FFFFFF;
      border-color: #2B8CBE;
    }\n`;
  } else if (parts[0] === '09-tableaux-dataviz') {
    containerClasses = 'chart-container';
    containerInnerContent = `      <div id="tableTarget" style="width: 100%; overflow-x: auto;">
        <canvas id="chartCanvas"></canvas>
      </div>`;
  } else {
    containerClasses = 'chart-container';
    containerInnerContent = `      <canvas id="chartCanvas"></canvas>`;
  }

  // 7. Script JavaScript propre
  let scriptContent = '';

  if (isRootKpiShowcase) {
    scriptContent = `    document.addEventListener('DOMContentLoaded', function() {
      const chartContainer = document.getElementById('chartContainer');
      const rulesCard = document.getElementById('cognitiveRulesCard');
      const tokensEngine = window.KitChartsTheme || (window.KitCharts && window.KitCharts.Theme) || {};
      let currentTheme = 'colorbrewer-accessible';
      let showDataLabels = true;

      const THEME_NAMES = {
        'colorbrewer-accessible': 'ColorBrewer Accessible',
        'viridis-perceptual': 'Viridis Perceptual',
        'paul-tol-scientific': 'Paul Tol Scientific',
        'tableau-stone-categorical': 'Tableau Stone Categorical',
        'okabe-ito-cud': 'Okabe-Ito CUD',
        'tufte-minimalist-executive': 'Tufte Minimalist Executive',
        'nord-cognitive-dark': 'Nord Cognitive Dark',
        'atkinson-hyperlegible': 'Atkinson Hyperlegible'
      };

      function refreshAllCards(themeName) {
        if (typeof tokensEngine.loadGoogleFonts === 'function') {
          tokensEngine.loadGoogleFonts(themeName);
        }
        const tokens = typeof tokensEngine.getThemeTokens === 'function' ? tokensEngine.getThemeTokens(themeName) : {};

        document.body.style.backgroundColor = tokens.isDark ? '#242933' : '#F8FAFC';
        document.body.style.color = tokens.textPrimary || '#0F172A';

        if (rulesCard) {
          rulesCard.style.backgroundColor = tokens.surface || '#FFFFFF';
          rulesCard.style.borderColor = tokens.border || '#E2E8F0';
        }

        const mods = window.KitCharts || {};

        if (mods['kpi-standard'] && typeof mods['kpi-standard'].renderCard === 'function') {
          mods['kpi-standard'].renderCard('targetCard1', {
            title: 'Revenu Récurrent (MRR)',
            value: 142850,
            unit: '€',
            delta: 14.2,
            deltaLabel: 'vs mois précédent (125 080 €)',
            metricType: 'gain',
            footnote: 'Clôture mensuelle certifiée'
          }, themeName);
        }

        if (mods['kpi-sparkline'] && typeof mods['kpi-sparkline'].renderCard === 'function') {
          mods['kpi-sparkline'].renderCard('targetCard2', {
            title: 'Taux de Conversion Global',
            value: 3.84,
            unit: '%',
            delta: 0.8,
            deltaLabel: 'vs moyenne 30j (3.04%)',
            metricType: 'gain',
            history: [2.9, 3.1, 3.0, 3.4, 3.2, 3.6, 3.5, 3.3, 3.7, 3.9, 3.6, 3.84],
            footnote: 'Tendance 12j • Max: 3.90%'
          }, themeName);
        }

        if (mods['kpi-bullet'] && typeof mods['kpi-bullet'].renderCard === 'function') {
          mods['kpi-bullet'].renderCard('targetCard3', {
            title: 'Quota Commercial T3',
            value: 460000,
            target: 500000,
            unit: '€',
            ranges: [300000, 425000, 550000],
            footnote: 'Écart restant: -40 000 € (92% atteint)'
          }, themeName);
        }

        if (mods['kpi-comparative'] && typeof mods['kpi-comparative'].renderCard === 'function') {
          mods['kpi-comparative'].renderCard('targetCard4', {
            title: 'Marge Brute Opérationnelle',
            value: 68.5,
            unit: '%',
            historical: { label: 'vs N-1', value: 64.2, deltaAbs: 4.3, deltaPct: 6.7 },
            budget: { label: 'vs Budget', value: 70.0, deltaAbs: -1.5, deltaPct: -2.1 },
            footnote: 'Consolidation semestrielle'
          }, themeName);
        }

        if (mods['kpi-distribution'] && typeof mods['kpi-distribution'].renderCard === 'function') {
          mods['kpi-distribution'].renderCard('targetCard5', {
            title: 'Acquisition Globale (Trafic)',
            value: 1240000,
            unit: 'visites',
            delta: 8.5,
            deltaLabel: 'vs N-1 (1 142 850)',
            segments: [
              { label: 'Organique', pct: 45, value: 558000 },
              { label: 'Direct', pct: 25, value: 310000 },
              { label: 'Payant', pct: 20, value: 248000 },
              { label: 'Referral', pct: 10, value: 124000 }
            ],
            footnote: 'Canaux GA4 qualifiés'
          }, themeName);
        }

        if (mods['kpi-status-alert'] && typeof mods['kpi-status-alert'].renderCard === 'function') {
          mods['kpi-status-alert'].renderCard('targetCard6', {
            title: 'Latence Serveur P99',
            value: 142,
            unit: 'ms',
            thresholds: { nominal: 100, critical: 150 },
            polarity: 'lower-is-better',
            maxScale: 200,
            footnote: '⚠️ Seuil d\\'attention franchi (> 100 ms)'
          }, themeName);
        }

        if (mods['kpi-composite'] && typeof mods['kpi-composite'].renderCard === 'function') {
          mods['kpi-composite'].renderCard('targetCard7', {
            title: 'Chiffre d\\'Affaires E-Commerce',
            value: 842500,
            unit: '€',
            delta: 18.4,
            deltaLabel: 'vs N-1 (711 500 €)',
            drivers: [
              { label: 'Commandes', value: 10240, unit: '', delta: 12.1, deltaUnit: '%' },
              { label: 'Panier Moyen', value: 82.27, unit: '€', delta: 5.6, deltaUnit: '%' },
              { label: 'Tx Conv.', value: 3.42, unit: '%', delta: -0.2, deltaUnit: 'pt' }
            ],
            footnote: 'Équation: CA = Commandes × Panier'
          }, themeName);
        }
      }

      function updateTheme(themeName) {
        currentTheme = themeName || 'colorbrewer-accessible';
        setActiveThemeUI(currentTheme);
        refreshAllCards(currentTheme);
      }

      function setActiveThemeUI(themeName) {
        const swatches = document.querySelectorAll('.theme-swatch');
        swatches.forEach(s => {
          if (s.dataset.themeName === themeName) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
        const activeThemeIndicator = document.getElementById('activeThemeIndicator');
        if (activeThemeIndicator) {
          activeThemeIndicator.textContent = THEME_NAMES[themeName] || themeName;
        }
      }

      const themeSwatchesGroup = document.getElementById('themeSwatchesGroup');
      if (themeSwatchesGroup) {
        themeSwatchesGroup.addEventListener('click', function(e) {
          const swatch = e.target.closest('.theme-swatch');
          if (swatch && swatch.dataset.themeName) {
            updateTheme(swatch.dataset.themeName);
          }
        });
      }

      const dataLabelsToggleBtn = document.getElementById('dataLabelsToggleBtn');
      if (dataLabelsToggleBtn) {
        dataLabelsToggleBtn.addEventListener('click', function() {
          showDataLabels = !showDataLabels;
          dataLabelsToggleBtn.classList.toggle('active', showDataLabels);
          dataLabelsToggleBtn.setAttribute('aria-pressed', String(showDataLabels));
          dataLabelsToggleBtn.title = showDataLabels ? 'Étiquettes de données (Labels) : Activées' : 'Étiquettes de données (Labels) : Désactivées';
          refreshAllCards(currentTheme);
        });
      }

      updateTheme('colorbrewer-accessible');
    });`;
  } else if (folderName === 'kpi-standard') {
    scriptContent = `    document.addEventListener('DOMContentLoaded', function() {
      const rulesCard = document.getElementById('cognitiveRulesCard');
      const tokensEngine = window.KitChartsTheme || (window.KitCharts && window.KitCharts.Theme) || {};
      const cardModule = (window.KitCharts && window.KitCharts['kpi-standard']) || {};
      let currentTheme = 'colorbrewer-accessible';
      let showDataLabels = true;

      const THEME_NAMES = {
        'colorbrewer-accessible': 'ColorBrewer Accessible',
        'viridis-perceptual': 'Viridis Perceptual',
        'paul-tol-scientific': 'Paul Tol Scientific',
        'tableau-stone-categorical': 'Tableau Stone Categorical',
        'okabe-ito-cud': 'Okabe-Ito CUD',
        'tufte-minimalist-executive': 'Tufte Minimalist Executive',
        'nord-cognitive-dark': 'Nord Cognitive Dark',
        'atkinson-hyperlegible': 'Atkinson Hyperlegible'
      };

      function updateTheme(themeName) {
        currentTheme = themeName || 'colorbrewer-accessible';
        if (typeof tokensEngine.loadGoogleFonts === 'function') {
          tokensEngine.loadGoogleFonts(currentTheme);
        }
        const tokens = typeof tokensEngine.getThemeTokens === 'function' ? tokensEngine.getThemeTokens(currentTheme) : {};

        document.body.style.backgroundColor = tokens.isDark ? '#1A1E24' : '#F8FAFC';
        document.body.style.color = tokens.textPrimary || '#0F172A';

        if (rulesCard) {
          rulesCard.style.backgroundColor = tokens.surface || '#FFFFFF';
          rulesCard.style.borderColor = tokens.border || '#E2E8F0';
        }

        const box = document.getElementById('canvasBox');
        if (box) {
          box.style.backgroundColor = tokens.surface || '#FFFFFF';
          box.style.borderColor = tokens.border || '#E2E8F0';
        }

        if (typeof cardModule.renderCard === 'function') {
          cardModule.renderCard('cardTarget1', {
            title: 'Revenu Mensuel Récurrent (MRR)',
            value: 142850,
            unit: '€',
            delta: 14.2,
            deltaLabel: 'vs mois précédent (125 080 €)',
            metricType: 'gain',
            footnote: 'Mise à jour aujourd\\'hui • Clôture confirmée'
          }, currentTheme);

          cardModule.renderCard('cardTarget2', {
            title: 'Taux de Churn Utilisateurs',
            value: 1.85,
            unit: '%',
            delta: -0.4,
            deltaLabel: 'vs trimestre précédent (2.25%)',
            metricType: 'cost',
            footnote: 'Objectif trimestriel : < 2.0%'
          }, currentTheme);
        }

        if (typeof cardModule.createChart === 'function') {
          cardModule.createChart('chartCanvas', {
            value: 142850,
            benchmark: 150000,
            delta: 14.2,
            metricType: 'gain'
          }, currentTheme);
        }

        setActiveThemeUI(currentTheme);
      }

      function setActiveThemeUI(themeName) {
        const swatches = document.querySelectorAll('.theme-swatch');
        swatches.forEach(s => {
          if (s.dataset.themeName === themeName) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
        const activeThemeIndicator = document.getElementById('activeThemeIndicator');
        if (activeThemeIndicator) {
          activeThemeIndicator.textContent = THEME_NAMES[themeName] || themeName;
        }
      }

      const themeSwatchesGroup = document.getElementById('themeSwatchesGroup');
      if (themeSwatchesGroup) {
        themeSwatchesGroup.addEventListener('click', function(e) {
          const swatch = e.target.closest('.theme-swatch');
          if (swatch && swatch.dataset.themeName) {
            updateTheme(swatch.dataset.themeName);
          }
        });
      }

      const dataLabelsToggleBtn = document.getElementById('dataLabelsToggleBtn');
      if (dataLabelsToggleBtn) {
        dataLabelsToggleBtn.addEventListener('click', function() {
          showDataLabels = !showDataLabels;
          dataLabelsToggleBtn.classList.toggle('active', showDataLabels);
          dataLabelsToggleBtn.setAttribute('aria-pressed', String(showDataLabels));
          dataLabelsToggleBtn.title = showDataLabels ? 'Étiquettes de données (Labels) : Activées' : 'Étiquettes de données (Labels) : Désactivées';
          updateTheme(currentTheme);
        });
      }

      updateTheme('colorbrewer-accessible');
    });`;
  } else if (parts[0] === '00-kpi-card') {
    // KPI Cards individuelles
    scriptContent = `    document.addEventListener('DOMContentLoaded', function() {
      const canvasId = 'chartCanvas';
      const chartContainer = document.getElementById('chartContainer');
      const rulesCard = document.getElementById('cognitiveRulesCard');
      const tokensEngine = window.KitChartsTheme || (window.KitCharts && window.KitCharts.Theme) || {};
      let currentTheme = 'colorbrewer-accessible';
      let showDataLabels = true;

      const THEME_NAMES = {
        'colorbrewer-accessible': 'ColorBrewer Accessible',
        'viridis-perceptual': 'Viridis Perceptual',
        'paul-tol-scientific': 'Paul Tol Scientific',
        'tableau-stone-categorical': 'Tableau Stone Categorical',
        'okabe-ito-cud': 'Okabe-Ito CUD',
        'tufte-minimalist-executive': 'Tufte Minimalist Executive',
        'nord-cognitive-dark': 'Nord Cognitive Dark',
        'atkinson-hyperlegible': 'Atkinson Hyperlegible'
      };

      function renderCurrentChart() {
        const chartModule = (window.KitCharts && window.KitCharts['${chartId}']) || window;
        if (typeof chartModule.renderCard === 'function') {
          chartModule.renderCard('cardTarget', null, currentTheme);
        } else if (typeof chartModule.createChart === 'function') {
          chartModule.createChart(canvasId, null, currentTheme);
        }
      }

      function updateTheme(themeName) {
        currentTheme = themeName || 'colorbrewer-accessible';
        if (typeof tokensEngine.loadGoogleFonts === 'function') {
          tokensEngine.loadGoogleFonts(currentTheme);
        }
        let tokens = null;
        if (typeof tokensEngine.applyThemeToContainer === 'function') {
          tokens = tokensEngine.applyThemeToContainer(chartContainer, currentTheme);
        } else if (typeof tokensEngine.getThemeTokens === 'function') {
          tokens = tokensEngine.getThemeTokens(currentTheme);
        }

        if (tokens) {
          document.body.style.backgroundColor = tokens.isDark ? '#1A1E24' : '#F8FAFC';
          document.body.style.color = tokens.textPrimary || '#0F172A';
          if (rulesCard) {
            rulesCard.style.backgroundColor = tokens.surface || '#FFFFFF';
            rulesCard.style.borderColor = tokens.border || '#E2E8F0';
          }
        }

        setActiveThemeUI(currentTheme);
        renderCurrentChart();
      }

      function setActiveThemeUI(themeName) {
        const swatches = document.querySelectorAll('.theme-swatch');
        swatches.forEach(s => {
          if (s.dataset.themeName === themeName) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
        const activeThemeIndicator = document.getElementById('activeThemeIndicator');
        if (activeThemeIndicator) {
          activeThemeIndicator.textContent = THEME_NAMES[themeName] || themeName;
        }
      }

      const themeSwatchesGroup = document.getElementById('themeSwatchesGroup');
      if (themeSwatchesGroup) {
        themeSwatchesGroup.addEventListener('click', function(e) {
          const swatch = e.target.closest('.theme-swatch');
          if (swatch && swatch.dataset.themeName) {
            updateTheme(swatch.dataset.themeName);
          }
        });
      }

      const dataLabelsToggleBtn = document.getElementById('dataLabelsToggleBtn');
      if (dataLabelsToggleBtn) {
        dataLabelsToggleBtn.addEventListener('click', function() {
          showDataLabels = !showDataLabels;
          dataLabelsToggleBtn.classList.toggle('active', showDataLabels);
          dataLabelsToggleBtn.setAttribute('aria-pressed', String(showDataLabels));
          dataLabelsToggleBtn.title = showDataLabels ? 'Étiquettes de données (Labels) : Activées' : 'Étiquettes de données (Labels) : Désactivées';
          renderCurrentChart();
        });
      }

      updateTheme('colorbrewer-accessible');
    });`;
  } else if (isRootTooltipShowcase) {
    // Tooltip Lab
    scriptContent = `    document.addEventListener('DOMContentLoaded', function() {
      const canvas = document.getElementById('tooltipDemoCanvas');
      const chartContainer = document.getElementById('chartContainer');
      const rulesCard = document.getElementById('cognitiveRulesCard');
      const tokensEngine = window.KitChartsTheme || (window.KitCharts && window.KitCharts.Theme) || {};
      let currentTheme = 'colorbrewer-accessible';
      let showDataLabels = true;
      let currentChart = null;

      const THEME_NAMES = {
        'colorbrewer-accessible': 'ColorBrewer Accessible',
        'viridis-perceptual': 'Viridis Perceptual',
        'paul-tol-scientific': 'Paul Tol Scientific',
        'tableau-stone-categorical': 'Tableau Stone Categorical',
        'okabe-ito-cud': 'Okabe-Ito CUD',
        'tufte-minimalist-executive': 'Tufte Minimalist Executive',
        'nord-cognitive-dark': 'Nord Cognitive Dark',
        'atkinson-hyperlegible': 'Atkinson Hyperlegible'
      };

      function renderCurrentChart() {
        const mod = (window.KitCharts && window.KitCharts['tooltip']) || window;
        if (typeof mod.createChart === 'function' && canvas) {
          currentChart = mod.createChart(canvas, null, currentTheme, { showDataLabels });
        }
      }

      function updateTheme(themeName) {
        currentTheme = themeName || 'colorbrewer-accessible';
        if (typeof tokensEngine.loadGoogleFonts === 'function') {
          tokensEngine.loadGoogleFonts(currentTheme);
        }
        let tokens = null;
        if (typeof tokensEngine.applyThemeToContainer === 'function') {
          tokens = tokensEngine.applyThemeToContainer(chartContainer, currentTheme);
        } else if (typeof tokensEngine.getThemeTokens === 'function') {
          tokens = tokensEngine.getThemeTokens(currentTheme);
        }

        if (tokens) {
          document.body.style.backgroundColor = tokens.isDark ? '#242933' : '#F8FAFC';
          document.body.style.color = tokens.textPrimary || '#0F172A';
          if (rulesCard) {
            rulesCard.style.backgroundColor = tokens.surface || '#FFFFFF';
            rulesCard.style.borderColor = tokens.border || '#E2E8F0';
          }
        }

        setActiveThemeUI(currentTheme);
        renderCurrentChart();
      }

      function setActiveThemeUI(themeName) {
        const swatches = document.querySelectorAll('.theme-swatch');
        swatches.forEach(s => {
          if (s.dataset.themeName === themeName) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
        const activeThemeIndicator = document.getElementById('activeThemeIndicator');
        if (activeThemeIndicator) {
          activeThemeIndicator.textContent = THEME_NAMES[themeName] || themeName;
        }
      }

      const themeSwatchesGroup = document.getElementById('themeSwatchesGroup');
      if (themeSwatchesGroup) {
        themeSwatchesGroup.addEventListener('click', function(e) {
          const swatch = e.target.closest('.theme-swatch');
          if (swatch && swatch.dataset.themeName) {
            updateTheme(swatch.dataset.themeName);
          }
        });
      }

      const dataLabelsToggleBtn = document.getElementById('dataLabelsToggleBtn');
      if (dataLabelsToggleBtn) {
        dataLabelsToggleBtn.addEventListener('click', function() {
          showDataLabels = !showDataLabels;
          dataLabelsToggleBtn.classList.toggle('active', showDataLabels);
          dataLabelsToggleBtn.setAttribute('aria-pressed', String(showDataLabels));
          dataLabelsToggleBtn.title = showDataLabels ? 'Étiquettes de données (Labels) : Activées' : 'Étiquettes de données (Labels) : Désactivées';
          renderCurrentChart();
        });
      }

      // Boutons Fitts
      document.querySelectorAll('.toolbar-btn[data-index]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.currentTarget.dataset.index, 10);
          if (currentChart && currentChart.tooltip) {
            const meta = currentChart.getDatasetMeta(0);
            if (meta && meta.data && meta.data[idx]) {
              currentChart.setActiveElements([
                { datasetIndex: 0, index: idx },
                { datasetIndex: 1, index: idx },
                { datasetIndex: 2, index: idx }
              ]);
              currentChart.tooltip.setActiveElements([
                { datasetIndex: 0, index: idx },
                { datasetIndex: 1, index: idx },
                { datasetIndex: 2, index: idx }
              ]);
              currentChart.update();
            }
          }
        });
      });

      const randomizeBtn = document.getElementById('randomizeBtn');
      if (randomizeBtn) {
        randomizeBtn.addEventListener('click', () => {
          if (!currentChart) return;
          const newCA = [
            Math.round(350 + Math.random() * 400),
            Math.round(400 + Math.random() * 400),
            Math.round(450 + Math.random() * 400),
            Math.round(500 + Math.random() * 400),
            Math.round(520 + Math.random() * 400),
            Math.round(600 + Math.random() * 400),
            Math.round(680 + Math.random() * 400),
            Math.round(750 + Math.random() * 400)
          ];
          currentChart.data.datasets[0].data = newCA;
          currentChart.update();
        });
      }

      updateTheme('colorbrewer-accessible');
    });`;
  } else if (isRootAnimationShowcase) {
    // Animation Lab
    scriptContent = `    document.addEventListener('DOMContentLoaded', function() {
      const canvas = document.getElementById('animationDemoCanvas');
      const chartContainer = document.getElementById('chartContainer');
      const rulesCard = document.getElementById('cognitiveRulesCard');
      const tokensEngine = window.KitChartsTheme || (window.KitCharts && window.KitCharts.Theme) || {};
      let currentTheme = 'colorbrewer-accessible';
      let showDataLabels = true;
      let currentChart = null;
      let forceReducedMotion = false;

      const ORIGINAL_DATA = {
        labels: ['Recherche & Dév.', 'Ingénierie Logicielle', 'Production & Infra', 'Marketing Digital', 'Service Client', 'Ressources Humaines', 'Finance & Audit', 'Logistique'],
        datasets: [
          {
            label: 'Score d\\'Efficacité 2026',
            data: [88, 94, 76, 82, 69, 85, 91, 78]
          },
          {
            label: 'Benchmark Sectoriel 2025',
            data: [80, 85, 72, 75, 70, 80, 86, 74],
            type: 'line',
            borderDash: [4, 4],
            borderWidth: 2,
            pointRadius: 4
          }
        ]
      };

      const THEME_NAMES = {
        'colorbrewer-accessible': 'ColorBrewer Accessible',
        'viridis-perceptual': 'Viridis Perceptual',
        'paul-tol-scientific': 'Paul Tol Scientific',
        'tableau-stone-categorical': 'Tableau Stone Categorical',
        'okabe-ito-cud': 'Okabe-Ito CUD',
        'tufte-minimalist-executive': 'Tufte Minimalist Executive',
        'nord-cognitive-dark': 'Nord Cognitive Dark',
        'atkinson-hyperlegible': 'Atkinson Hyperlegible'
      };

      function renderCurrentChart(customData = null) {
        const animMod = (window.KitCharts && window.KitCharts['animation']) || window;
        if (typeof animMod.createChart === 'function' && canvas) {
          const dataToRender = customData || ORIGINAL_DATA;
          const n = dataToRender.labels.length;
          const duration = typeof animMod.getAnimationDuration === 'function' ? animMod.getAnimationDuration(n) : 600;
          currentChart = animMod.createChart(canvas, dataToRender, currentTheme, {
            duration: duration,
            easing: 'easeOutCubic',
            reducedMotion: forceReducedMotion,
            showDataLabels: showDataLabels
          });
        }
      }

      function updateTheme(themeName) {
        currentTheme = themeName || 'colorbrewer-accessible';
        if (typeof tokensEngine.loadGoogleFonts === 'function') {
          tokensEngine.loadGoogleFonts(currentTheme);
        }
        let tokens = null;
        if (typeof tokensEngine.applyThemeToContainer === 'function') {
          tokens = tokensEngine.applyThemeToContainer(chartContainer, currentTheme);
        } else if (typeof tokensEngine.getThemeTokens === 'function') {
          tokens = tokensEngine.getThemeTokens(currentTheme);
        }

        if (tokens) {
          document.body.style.backgroundColor = tokens.isDark ? '#242933' : '#F8FAFC';
          document.body.style.color = tokens.textPrimary || '#0F172A';
          if (rulesCard) {
            rulesCard.style.backgroundColor = tokens.surface || '#FFFFFF';
            rulesCard.style.borderColor = tokens.border || '#E2E8F0';
          }
        }

        setActiveThemeUI(currentTheme);
        renderCurrentChart();
      }

      function setActiveThemeUI(themeName) {
        const swatches = document.querySelectorAll('.theme-swatch');
        swatches.forEach(s => {
          if (s.dataset.themeName === themeName) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
        const activeThemeIndicator = document.getElementById('activeThemeIndicator');
        if (activeThemeIndicator) {
          activeThemeIndicator.textContent = THEME_NAMES[themeName] || themeName;
        }
      }

      const themeSwatchesGroup = document.getElementById('themeSwatchesGroup');
      if (themeSwatchesGroup) {
        themeSwatchesGroup.addEventListener('click', function(e) {
          const swatch = e.target.closest('.theme-swatch');
          if (swatch && swatch.dataset.themeName) {
            updateTheme(swatch.dataset.themeName);
          }
        });
      }

      const dataLabelsToggleBtn = document.getElementById('dataLabelsToggleBtn');
      if (dataLabelsToggleBtn) {
        dataLabelsToggleBtn.addEventListener('click', function() {
          showDataLabels = !showDataLabels;
          dataLabelsToggleBtn.classList.toggle('active', showDataLabels);
          dataLabelsToggleBtn.setAttribute('aria-pressed', String(showDataLabels));
          dataLabelsToggleBtn.title = showDataLabels ? 'Étiquettes de données (Labels) : Activées' : 'Étiquettes de données (Labels) : Désactivées';
          renderCurrentChart();
        });
      }

      const sortDescBtn = document.getElementById('sortDescBtn');
      if (sortDescBtn) {
        sortDescBtn.addEventListener('click', () => {
          if (!currentChart) return;
          const pairs = ORIGINAL_DATA.labels.map((l, i) => ({
            label: l,
            score: ORIGINAL_DATA.datasets[0].data[i],
            bench: ORIGINAL_DATA.datasets[1].data[i]
          }));
          pairs.sort((a, b) => b.score - a.score);
          currentChart.data.labels = pairs.map(p => p.label);
          currentChart.data.datasets[0].data = pairs.map(p => p.score);
          currentChart.data.datasets[1].data = pairs.map(p => p.bench);
          currentChart.update();
        });
      }

      const sortAscBtn = document.getElementById('sortAscBtn');
      if (sortAscBtn) {
        sortAscBtn.addEventListener('click', () => {
          if (!currentChart) return;
          const pairs = ORIGINAL_DATA.labels.map((l, i) => ({
            label: l,
            score: ORIGINAL_DATA.datasets[0].data[i],
            bench: ORIGINAL_DATA.datasets[1].data[i]
          }));
          pairs.sort((a, b) => a.score - b.score);
          currentChart.data.labels = pairs.map(p => p.label);
          currentChart.data.datasets[0].data = pairs.map(p => p.score);
          currentChart.data.datasets[1].data = pairs.map(p => p.bench);
          currentChart.update();
        });
      }

      const shuffleBtn = document.getElementById('shuffleBtn');
      if (shuffleBtn) {
        shuffleBtn.addEventListener('click', () => {
          if (!currentChart) return;
          const pairs = ORIGINAL_DATA.labels.map((l, i) => ({
            label: l,
            score: ORIGINAL_DATA.datasets[0].data[i],
            bench: ORIGINAL_DATA.datasets[1].data[i]
          }));
          pairs.sort(() => Math.random() - 0.5);
          currentChart.data.labels = pairs.map(p => p.label);
          currentChart.data.datasets[0].data = pairs.map(p => p.score);
          currentChart.data.datasets[1].data = pairs.map(p => p.bench);
          currentChart.update();
        });
      }

      const filterTopBtn = document.getElementById('filterTopBtn');
      if (filterTopBtn) {
        filterTopBtn.addEventListener('click', () => {
          if (!currentChart) return;
          const pairs = ORIGINAL_DATA.labels.map((l, i) => ({
            label: l,
            score: ORIGINAL_DATA.datasets[0].data[i],
            bench: ORIGINAL_DATA.datasets[1].data[i]
          }));
          pairs.sort((a, b) => b.score - a.score);
          const top4 = pairs.slice(0, 4);
          currentChart.data.labels = top4.map(p => p.label);
          currentChart.data.datasets[0].data = top4.map(p => p.score);
          currentChart.data.datasets[1].data = top4.map(p => p.bench);
          currentChart.update();
        });
      }

      const replayBtn = document.getElementById('replayBtn');
      if (replayBtn) {
        replayBtn.addEventListener('click', () => {
          if (!currentChart) return;
          const animMod = window.KitCharts && window.KitCharts['animation'];
          if (animMod && typeof animMod.replayAnimation === 'function') {
            animMod.replayAnimation(currentChart);
          } else {
            currentChart.update();
          }
        });
      }

      const resetBtn = document.getElementById('resetBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          renderCurrentChart(ORIGINAL_DATA);
        });
      }

      const reducedMotionBtn = document.getElementById('reducedMotionBtn');
      if (reducedMotionBtn) {
        reducedMotionBtn.addEventListener('click', () => {
          forceReducedMotion = !forceReducedMotion;
          reducedMotionBtn.textContent = forceReducedMotion ? 'Reduced Motion : Actif' : 'Reduced Motion : Inactif';
          reducedMotionBtn.classList.toggle('active', forceReducedMotion);
          renderCurrentChart();
        });
      }

      updateTheme('colorbrewer-accessible');
    });`;
  } else if (isAnimationSubPrinciple) {
    // Animation Sub-Principles
    scriptContent = `    document.addEventListener('DOMContentLoaded', function() {
      const canvasId = 'chartCanvas';
      const chartContainer = document.getElementById('chartContainer');
      const rulesCard = document.getElementById('cognitiveRulesCard');
      const tokensEngine = window.KitChartsTheme || (window.KitCharts && window.KitCharts.Theme) || {};
      let currentTheme = 'colorbrewer-accessible';
      let showDataLabels = true;

      const THEME_NAMES = {
        'colorbrewer-accessible': 'ColorBrewer Accessible',
        'viridis-perceptual': 'Viridis Perceptual',
        'paul-tol-scientific': 'Paul Tol Scientific',
        'tableau-stone-categorical': 'Tableau Stone Categorical',
        'okabe-ito-cud': 'Okabe-Ito CUD',
        'tufte-minimalist-executive': 'Tufte Minimalist Executive',
        'nord-cognitive-dark': 'Nord Cognitive Dark',
        'atkinson-hyperlegible': 'Atkinson Hyperlegible'
      };

      function renderCurrentChart() {
        const chartModule = (window.KitCharts && window.KitCharts['${chartId}']) || window;
        if (typeof chartModule.createChart === 'function') {
          const chartData = chartModule.DEFAULT_DATA ? { ...chartModule.DEFAULT_DATA, showDataLabels } : null;
          chartModule.createChart(canvasId, chartData, currentTheme, { showDataLabels });
        }
      }

      function updateTheme(themeName) {
        currentTheme = themeName || 'colorbrewer-accessible';
        if (typeof tokensEngine.loadGoogleFonts === 'function') {
          tokensEngine.loadGoogleFonts(currentTheme);
        }
        let tokens = null;
        if (typeof tokensEngine.applyThemeToContainer === 'function') {
          tokens = tokensEngine.applyThemeToContainer(chartContainer, currentTheme);
        } else if (typeof tokensEngine.getThemeTokens === 'function') {
          tokens = tokensEngine.getThemeTokens(currentTheme);
        }

        if (tokens) {
          document.body.style.backgroundColor = tokens.isDark ? '#242933' : '#F8FAFC';
          document.body.style.color = tokens.textPrimary || '#0F172A';
          if (rulesCard) {
            rulesCard.style.backgroundColor = tokens.surface || '#FFFFFF';
            rulesCard.style.borderColor = tokens.border || '#E2E8F0';
          }
        }

        setActiveThemeUI(currentTheme);
        renderCurrentChart();
      }

      function setActiveThemeUI(themeName) {
        const swatches = document.querySelectorAll('.theme-swatch');
        swatches.forEach(s => {
          if (s.dataset.themeName === themeName) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
        const activeThemeIndicator = document.getElementById('activeThemeIndicator');
        if (activeThemeIndicator) {
          activeThemeIndicator.textContent = THEME_NAMES[themeName] || themeName;
        }
      }

      const themeSwatchesGroup = document.getElementById('themeSwatchesGroup');
      if (themeSwatchesGroup) {
        themeSwatchesGroup.addEventListener('click', function(e) {
          const swatch = e.target.closest('.theme-swatch');
          if (swatch && swatch.dataset.themeName) {
            updateTheme(swatch.dataset.themeName);
          }
        });
      }

      const dataLabelsToggleBtn = document.getElementById('dataLabelsToggleBtn');
      if (dataLabelsToggleBtn) {
        dataLabelsToggleBtn.addEventListener('click', function() {
          showDataLabels = !showDataLabels;
          dataLabelsToggleBtn.classList.toggle('active', showDataLabels);
          dataLabelsToggleBtn.setAttribute('aria-pressed', String(showDataLabels));
          dataLabelsToggleBtn.title = showDataLabels ? 'Étiquettes de données (Labels) : Activées' : 'Étiquettes de données (Labels) : Désactivées';
          renderCurrentChart();
        });
      }

      updateTheme('colorbrewer-accessible');
    });`;
  } else {
    // Standard chart
    scriptContent = `    document.addEventListener('DOMContentLoaded', function() {
      const canvasId = 'chartCanvas';
      const chartContainer = document.getElementById('chartContainer');
      const rulesCard = document.getElementById('cognitiveRulesCard');
      const tokensEngine = window.KitChartsTheme || (window.KitCharts && window.KitCharts.Theme) || {};
      let currentTheme = 'colorbrewer-accessible';
      let showDataLabels = true;

      const THEME_NAMES = {
        'colorbrewer-accessible': 'ColorBrewer Accessible',
        'viridis-perceptual': 'Viridis Perceptual',
        'paul-tol-scientific': 'Paul Tol Scientific',
        'tableau-stone-categorical': 'Tableau Stone Categorical',
        'okabe-ito-cud': 'Okabe-Ito CUD',
        'tufte-minimalist-executive': 'Tufte Minimalist Executive',
        'nord-cognitive-dark': 'Nord Cognitive Dark',
        'atkinson-hyperlegible': 'Atkinson Hyperlegible'
      };

      function renderCurrentChart() {
        const chartModule = (window.KitCharts && window.KitCharts['${chartId}']) || window;
        if (typeof chartModule.createChart === 'function') {
          const chartData = chartModule.DEFAULT_DATA ? { ...chartModule.DEFAULT_DATA, showDataLabels } : null;
          chartModule.createChart(canvasId, chartData, currentTheme, { showDataLabels });
        }
      }

      function updateTheme(themeName) {
        currentTheme = themeName || 'colorbrewer-accessible';
        if (typeof tokensEngine.loadGoogleFonts === 'function') {
          tokensEngine.loadGoogleFonts(currentTheme);
        }
        let tokens = null;
        if (typeof tokensEngine.applyThemeToContainer === 'function') {
          tokens = tokensEngine.applyThemeToContainer(chartContainer, currentTheme);
        } else if (typeof tokensEngine.getThemeTokens === 'function') {
          tokens = tokensEngine.getThemeTokens(currentTheme);
        }

        if (tokens) {
          document.body.style.backgroundColor = tokens.isDark ? '#242933' : '#F8FAFC';
          document.body.style.color = tokens.textPrimary || '#0F172A';
          if (rulesCard) {
            rulesCard.style.backgroundColor = tokens.surface || '#FFFFFF';
            rulesCard.style.borderColor = tokens.border || '#E2E8F0';
          }
        }

        setActiveThemeUI(currentTheme);
        renderCurrentChart();
      }

      function setActiveThemeUI(themeName) {
        const swatches = document.querySelectorAll('.theme-swatch');
        swatches.forEach(s => {
          if (s.dataset.themeName === themeName) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
        const activeThemeIndicator = document.getElementById('activeThemeIndicator');
        if (activeThemeIndicator) {
          activeThemeIndicator.textContent = THEME_NAMES[themeName] || themeName;
        }
      }

      const themeSwatchesGroup = document.getElementById('themeSwatchesGroup');
      if (themeSwatchesGroup) {
        themeSwatchesGroup.addEventListener('click', function(e) {
          const swatch = e.target.closest('.theme-swatch');
          if (swatch && swatch.dataset.themeName) {
            updateTheme(swatch.dataset.themeName);
          }
        });
      }

      const dataLabelsToggleBtn = document.getElementById('dataLabelsToggleBtn');
      if (dataLabelsToggleBtn) {
        dataLabelsToggleBtn.addEventListener('click', function() {
          showDataLabels = !showDataLabels;
          dataLabelsToggleBtn.classList.toggle('active', showDataLabels);
          dataLabelsToggleBtn.setAttribute('aria-pressed', String(showDataLabels));
          dataLabelsToggleBtn.title = showDataLabels ? 'Étiquettes de données (Labels) : Activées' : 'Étiquettes de données (Labels) : Désactivées';
          renderCurrentChart();
        });
      }

      updateTheme('colorbrewer-accessible');
    });`;
  }

  // 8. Assemblage HTML final ISO single-column
  const finalHTML = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <!-- Google Fonts pour tous les thèmes -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=Fira+Code:wght@400;500;600&family=Fira+Sans:wght@400;500;600;700&family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Roboto+Mono:wght@400;500;700&family=Roboto:wght@400;500;700&family=Source+Code+Pro:wght@400;500;600&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet">
  <!-- Chart.js v4.4.7 CDN -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js"></script>
${extraHeadScripts}  <!-- Theme Tokens & Template (Zero-CORS UMD loading for file:// & http://) -->
  <script src="${relToThemes}"></script>
${templateScriptsHTML}
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
      max-width: ${isWideWrapper ? '1400px' : '1000px'};
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
      flex-wrap: wrap;
    }

    .toolbar-theme-label {
      font-size: 0.825rem;
      font-weight: 700;
      color: #0F172A;
      display: flex;
      align-items: center;
      gap: 0.35rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .theme-swatches-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #F1F5F9;
      padding: 0.3rem 0.5rem;
      border-radius: 9999px;
      border: 1px solid #E2E8F0;
    }

    .theme-swatch {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      border: 2px solid transparent;
      cursor: pointer;
      position: relative;
      transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      outline: none;
      padding: 0;
      flex-shrink: 0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    }

    .theme-swatch:hover {
      transform: scale(1.18);
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
    }

    .theme-swatch.active {
      transform: scale(1.22);
      border-color: #FFFFFF;
      box-shadow: 0 0 0 3px #2B8CBE, 0 3px 10px rgba(43, 140, 190, 0.35);
    }

    .active-theme-name-tag {
      font-size: 0.8rem;
      font-weight: 600;
      color: #475569;
      background: #FFFFFF;
      padding: 0.3rem 0.75rem;
      border-radius: 9999px;
      border: 1px solid #E2E8F0;
      white-space: nowrap;
    }

    .btn-label-toggle {
      width: 38px;
      height: 38px;
      border-radius: 9999px;
      border: 1px solid #E2E8F0;
      background: #F1F5F9;
      color: #94A3B8;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      outline: none;
    }

    .btn-label-toggle svg {
      width: 18px;
      height: 18px;
      transition: transform 0.2s ease;
    }

    .btn-label-toggle:hover {
      background: #FFFFFF;
      border-color: #2B8CBE;
      color: #2B8CBE;
      transform: translateY(-1px);
    }

    .btn-label-toggle.active {
      background: #2B8CBE;
      color: #FFFFFF !important;
      border-color: #2B8CBE;
      box-shadow: 0 0 14px rgba(43, 140, 190, 0.4), 0 2px 8px rgba(43, 140, 190, 0.3);
      transform: translateY(-1px);
    }

    .btn-label-toggle.active svg {
      filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.6));
    }

    .chart-container {
      position: relative;
      width: 100%;
      min-height: 440px;
      background-color: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 1.25rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      transition: background-color 0.25s ease, border-color 0.25s ease;
    }
${customCSS}
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
        ${breadcrumbHTML}
      </div>
      <div class="header-panel">
        <div class="title-group">
          <h1>${titleH1}</h1>
          <p>${subtitleP}</p>
        </div>
${SWATCHES_TOOLBAR_HTML}
      </div>
    </div>

    <!-- Conteneur Graphique -->
    <div id="chartContainer" class="${containerClasses}">
${containerInnerContent}
    </div>

    <!-- Synthèse des Recommandations & Règles Cognitives -->
    <div id="cognitiveRulesCard" class="cognitive-rules-card">
${rulesCardHTML}
    </div>
  </div>

  <script>
${scriptContent}
  </script>
</body>
</html>
`;

  fs.writeFileSync(filePath, finalHTML, 'utf8');
  processedCount++;
  console.log(`[${processedCount}/84] ✅ ${relPath} réécrit avec succès.`);
}

console.log(`\n🎉 Succès total : ${processedCount}/84 templates preview.html nettoyés et standardisés !`);
