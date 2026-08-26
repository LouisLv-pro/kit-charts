import fs from 'fs';
import path from 'path';

const ROOT = '/Users/louislaville/Desktop/kit-charts';

// 1. Read CATALOG from index.html
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const start = indexHtml.indexOf('const CATALOG = [');
const end = indexHtml.indexOf('];', start) + 2;
const catalogStr = indexHtml.substring(start + 'const CATALOG = '.length, end - 1);
const CATALOG = eval(catalogStr);

console.log(`Loaded ${CATALOG.length} items from CATALOG.`);

const CSS_TEMPLATE = `
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
      max-width: 1050px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
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
      gap: 0.65rem;
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
      padding: 0;
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
      height: 440px;
      background-color: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 1.25rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      transition: background-color 0.25s ease, border-color 0.25s ease;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.25rem;
      height: auto;
      background: transparent;
      border: none;
      padding: 0;
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
    }

    .kpi-scorecard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.25rem;
      height: auto;
      background: transparent;
      border: none;
      padding: 0;
      box-shadow: none;
    }

    .cognitive-rules-card {
      background-color: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
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

    .control-select {
      padding: 0.4rem 0.75rem;
      border-radius: 6px;
      border: 1px solid #CBD5E1;
      background-color: #FFFFFF;
      color: #0F172A;
      font-size: 0.825rem;
      font-weight: 500;
      cursor: pointer;
      outline: none;
    }

    .interactive-toolbar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 1rem;
      flex-wrap: wrap;
    }

    .toolbar-btn {
      padding: 0.4rem 0.75rem;
      border-radius: 6px;
      border: 1px solid #CBD5E1;
      background: #FFFFFF;
      color: #0F172A;
      font-size: 0.825rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .toolbar-btn:hover {
      border-color: #2B8CBE;
      color: #2B8CBE;
    }
`;

function getSwatchesControlsHtml(extra = '') {
  return `        <div class="controls-group">
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
          </button>${extra ? '\n          ' + extra : ''}
        </div>`;
}

// Extract clean cognitive rules for each template from its guide or metadata
function getCognitiveRules(id, cat, title, summary) {
  const guidePath = path.join(ROOT, 'guide', cat, `${id}.md`);
  let whenToUse = `Présentation et comparaison rigoureuse de métriques pour ${title.toLowerCase()}. Adapté aux analyses décisionnelles nécessitant clarté visuelle et décodage pré-attentif rapide.`;
  let whenNotToUse = `Éviter en cas de volume massif de catégories non ordonnées ou de distributions asymétriques extrêmes sans normalisation préalable.`;

  if (fs.existsSync(guidePath)) {
    const guide = fs.readFileSync(guidePath, 'utf8');
    // Try to extract Quand l'utiliser
    const whenMatch = guide.match(/##\s*2\.\s*Quand l'utiliser[\s\S]*?(?=##\s*3|$)/i);
    if (whenMatch) {
      const text = whenMatch[0].replace(/##[^\n]+/g, '').replace(/###[^\n]+/g, '').replace(/```[\s\S]*?```/g, '').replace(/\$[^$]+\$/g, '').trim();
      const lines = text.split('\n').map(l => l.replace(/^[-*•]\s*/, '').trim()).filter(l => l.length > 20);
      if (lines.length > 0) whenToUse = lines.slice(0, 2).join(' ');
    }

    const whenNotMatch = guide.match(/##\s*3\.\s*Quand NE PAS l'utiliser[\s\S]*?(?=##\s*4|$)/i);
    if (whenNotMatch) {
      const text = whenNotMatch[0].replace(/##[^\n]+/g, '').replace(/###[^\n]+/g, '').replace(/```[\s\S]*?```/g, '').replace(/\|[^\n]+\|/g, '').replace(/\$[^$]+\$/g, '').trim();
      const lines = text.split('\n').map(l => l.replace(/^[-*•]\s*/, '').trim()).filter(l => l.length > 20);
      if (lines.length > 0) whenNotToUse = lines.slice(0, 2).join(' ');
    }
  }

  // Clean raw math symbols
  whenToUse = whenToUse.replace(/\\frac\{[^}]*\}\{[^}]*\}/g, '').replace(/\\sum/g, '').replace(/\$+/g, '').replace(/\s+/g, ' ').trim();
  whenNotToUse = whenNotToUse.replace(/\\frac\{[^}]*\}\{[^}]*\}/g, '').replace(/\\sum/g, '').replace(/\$+/g, '').replace(/\s+/g, ' ').trim();

  return { whenToUse, whenNotToUse };
}

// Generate for each template in CATALOG
for (const item of CATALOG) {
  const { id, title, category, cognitiveSummary } = item;
  let targetPath = '';
  let relDir = '';
  let backLink = '../../../index.html';
  let themeTokensPath = '../../../themes/theme-tokens.js';
  let tplJsPath = './template.js';

  if (category === 'animation') {
    if (id === 'animation') {
      targetPath = path.join(ROOT, 'template/animation/preview.html');
      relDir = 'template/animation';
      backLink = '../../index.html';
      themeTokensPath = '../../themes/theme-tokens.js';
      tplJsPath = './template.js';
    } else {
      const folderNum = id.replace(/^anim-/, '');
      // Match folder 01-staged-transitions etc.
      const subFolders = fs.readdirSync(path.join(ROOT, 'template/animation')).filter(f => f.includes(folderNum));
      const subFolder = subFolders[0] || id;
      targetPath = path.join(ROOT, 'template/animation', subFolder, 'preview.html');
      relDir = `template/animation/${subFolder}`;
      backLink = '../../../index.html';
      themeTokensPath = '../../../themes/theme-tokens.js';
      tplJsPath = './template.js';
    }
  } else if (category === 'tooltip') {
    targetPath = path.join(ROOT, 'template/tooltip/preview.html');
    relDir = 'template/tooltip';
    backLink = '../../index.html';
    themeTokensPath = '../../themes/theme-tokens.js';
    tplJsPath = './template.js';
  } else {
    targetPath = path.join(ROOT, 'template', category, id, 'preview.html');
    relDir = `template/${category}/${id}`;
    backLink = '../../../index.html';
    themeTokensPath = '../../../themes/theme-tokens.js';
    tplJsPath = './template.js';
  }

  const { whenToUse, whenNotToUse } = getCognitiveRules(id, category, title, cognitiveSummary);

  let chartContainerHtml = '';
  let extraControls = '';
  let scriptContent = '';

  if (category === '00-kpi-card') {
    if (id === 'kpi-standard') {
      chartContainerHtml = `    <div id="chartContainer" class="chart-container cards-grid">
      <div id="cardTarget1"></div>
      <div id="cardTarget2"></div>
      <div class="chart-box" id="canvasBox">
        <div style="font-size: 0.8125rem; font-weight: 600; color: #64748B; text-transform: uppercase;">
          Atteinte de l'Objectif Mensuel
        </div>
        <div class="canvas-container">
          <canvas id="chartCanvas"></canvas>
        </div>
      </div>
    </div>`;
    } else if (id === 'kpi-sparkline') {
      chartContainerHtml = `    <div id="chartContainer" class="chart-container cards-grid">
      <div id="sparkCard1"></div>
      <div id="sparkCard2"></div>
      <div id="sparkCard3"></div>
    </div>`;
    } else if (id === 'kpi-bullet') {
      chartContainerHtml = `    <div id="chartContainer" class="chart-container cards-grid">
      <div id="bulletCard1"></div>
      <div id="bulletCard2"></div>
      <div id="bulletCard3"></div>
    </div>`;
    } else if (id === 'kpi-comparative') {
      chartContainerHtml = `    <div id="chartContainer" class="chart-container cards-grid">
      <div id="compCard1"></div>
      <div id="compCard2"></div>
    </div>`;
    } else if (id === 'kpi-distribution') {
      chartContainerHtml = `    <div id="chartContainer" class="chart-container cards-grid">
      <div id="distCard1"></div>
      <div id="distCard2"></div>
    </div>`;
    } else if (id === 'kpi-status-alert') {
      chartContainerHtml = `    <div id="chartContainer" class="chart-container cards-grid">
      <div id="alertCard1"></div>
      <div id="alertCard2"></div>
      <div id="alertCard3"></div>
    </div>`;
    } else if (id === 'kpi-composite') {
      chartContainerHtml = `    <div id="chartContainer" class="chart-container cards-grid">
      <div id="compositeCard1"></div>
      <div id="compositeCard2"></div>
    </div>`;
    }
  } else if (category === '09-tableaux-dataviz') {
    chartContainerHtml = `    <div id="chartContainer" class="chart-container" style="height:auto; min-height:420px; overflow-x:auto;">
      <div id="tableTarget"></div>
    </div>`;
  } else if (id === 'animation') {
    extraControls = `<label for="easingSelect" style="font-size:0.8rem; font-weight:600;">Amorti :</label>
          <select id="easingSelect" class="control-select">
            <option value="easeOutCubic" selected>easeOutCubic (Recommandé)</option>
            <option value="easeInOutQuad">easeInOutQuad</option>
            <option value="easeOutQuart">easeOutQuart</option>
            <option value="linear">linear</option>
          </select>`;
    chartContainerHtml = `    <div id="chartContainer" class="chart-container">
      <canvas id="animDemoCanvas"></canvas>
      <div class="interactive-toolbar">
        <button class="toolbar-btn" id="replayBtn">🔄 Rejouer l'Animation</button>
      </div>
    </div>`;
  } else if (category === 'animation') {
    chartContainerHtml = `    <div id="chartContainer" class="chart-container">
      <canvas id="chartCanvas"></canvas>
      <div class="interactive-toolbar">
        <button class="toolbar-btn" id="toggleDataBtn">🔀 Basculer les Données</button>
        <button class="toolbar-btn" id="replayBtn">🔄 Rejouer</button>
      </div>
    </div>`;
  } else if (category === 'tooltip') {
    extraControls = `<label for="modeSelect" style="font-size:0.8rem; font-weight:600;">Interaction :</label>
          <select id="modeSelect" class="control-select">
            <option value="index" selected>Multi-Séries (Index)</option>
            <option value="nearest">Point Proche (Fitts 2D)</option>
            <option value="point">Intersection Directe</option>
          </select>`;
    chartContainerHtml = `    <div id="chartContainer" class="chart-container">
      <canvas id="tooltipDemoCanvas"></canvas>
      <div class="interactive-toolbar">
        <span style="font-size: 0.8125rem; font-weight: 700; color: #64748B; margin-right: 0.5rem;">Ciblage Fitts :</span>
        <button class="toolbar-btn" data-index="0">Inspecter Q1</button>
        <button class="toolbar-btn" data-index="4">Inspecter Q2</button>
        <button class="toolbar-btn" data-index="7">Inspecter Q4 (Focus)</button>
        <button class="toolbar-btn" id="randomizeBtn" style="margin-left: auto;">Données Aléatoires</button>
      </div>
    </div>`;
  } else {
    chartContainerHtml = `    <div id="chartContainer" class="chart-container">
      <canvas id="chartCanvas"></canvas>
    </div>`;
  }

  // Generate Script
  if (category === '00-kpi-card') {
    scriptContent = `    document.addEventListener('DOMContentLoaded', function() {
      const chartContainer = document.getElementById('chartContainer');
      const rulesCard = document.getElementById('cognitiveRulesCard');
      const tokensEngine = window.KitChartsTheme || (window.KitCharts && window.KitCharts.Theme) || {};
      const cardModule = (window.KitCharts && window.KitCharts['${id}']) || {};
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

      function renderAllCards(themeName) {
        if (!cardModule) return;
        ${id === 'kpi-standard' ? `
        if (typeof cardModule.renderCard === 'function') {
          cardModule.renderCard('cardTarget1', {
            title: 'Chiffre d\\'Affaires Mensuel (MRR)',
            value: '€ 142 850',
            variation: 12.4,
            valence: 'positive',
            trend: 'up',
            comparisonText: 'vs M-1 (Budget: € 135 000)',
            format: 'currency'
          }, themeName);

          cardModule.renderCard('cardTarget2', {
            title: 'Taux d\\'Attrition (Churn Client)',
            value: '2.8 %',
            variation: -0.6,
            valence: 'positive',
            trend: 'down',
            comparisonText: 'vs objectif max 3.5%',
            format: 'percent'
          }, themeName);
        }
        if (typeof cardModule.createChart === 'function') {
          cardModule.createChart('chartCanvas', {
            value: 84.5,
            target: 100,
            unit: '%',
            label: 'Objectif Atteint'
          }, themeName);
        }` : id === 'kpi-sparkline' ? `
        if (typeof cardModule.renderCard === 'function') {
          cardModule.renderCard('sparkCard1', {
            title: 'Chiffre d\\'Affaires (12 Mois)',
            value: '124 500 €',
            variation: '+14.2%',
            trend: 'up',
            valence: 'positive',
            series: [88, 92, 90, 95, 102, 99, 105, 112, 108, 115, 120, 124.5],
            footnote: 'Tendance haussière continue'
          }, themeName);

          cardModule.renderCard('sparkCard2', {
            title: 'Coût d\\'Acquisition Client (CAC)',
            value: '42.30 €',
            variation: '-8.5%',
            trend: 'down',
            valence: 'positive',
            series: [58, 55, 52, 54, 50, 48, 49, 46, 45, 43, 44, 42.3],
            footnote: 'Optimisation des canaux payants'
          }, themeName);

          cardModule.renderCard('sparkCard3', {
            title: 'Temps de Réponse Serveur',
            value: '342 ms',
            variation: '+22.4%',
            trend: 'up',
            valence: 'negative',
            series: [210, 215, 220, 225, 230, 240, 250, 280, 290, 310, 325, 342],
            footnote: 'Alerte: dégradation de latence'
          }, themeName);
        }` : id === 'kpi-bullet' ? `
        if (typeof cardModule.renderCard === 'function') {
          cardModule.renderCard('bulletCard1', {
            title: 'Quota Commercial T3',
            value: 460000,
            target: 500000,
            unit: '€',
            ranges: [300000, 425000, 550000],
            footnote: 'Écart restant : -40 000 € • 18 jours ouvrés'
          }, themeName);

          cardModule.renderCard('bulletCard2', {
            title: 'Nouveaux Clients Signés',
            value: 128,
            target: 100,
            unit: '',
            ranges: [60, 85, 140],
            footnote: 'Objectif dépassé de +28 clients (+128%)'
          }, themeName);

          cardModule.renderCard('bulletCard3', {
            title: 'Disponibilité SLA Infra',
            value: 99.82,
            target: 99.95,
            unit: '%',
            ranges: [99.0, 99.7, 100.0],
            footnote: 'Incident mineur résolu • Seuil critique: < 99.70%'
          }, themeName);
        }` : id === 'kpi-comparative' ? `
        if (typeof cardModule.renderCard === 'function') {
          cardModule.renderCard('compCard1', {
            title: 'Chiffre d\\'Affaires Q3',
            current: 1840000,
            prior: 1620000,
            budget: 1750000,
            unit: '€',
            footnote: 'Performances commerciales globales'
          }, themeName);

          cardModule.renderCard('compCard2', {
            title: 'Marge Brute Réalisée',
            current: 685000,
            prior: 710000,
            budget: 720000,
            unit: '€',
            footnote: 'Tension sur coûts d\\'approvisionnement'
          }, themeName);
        }` : id === 'kpi-distribution' ? `
        if (typeof cardModule.renderCard === 'function') {
          cardModule.renderCard('distCard1', {
            title: 'NPS Score Utilisateurs',
            value: '+64',
            distribution: [12, 24, 64],
            labels: ['Détracteurs', 'Passifs', 'Promoteurs'],
            footnote: 'Échantillon n=1 250 répondants'
          }, themeName);

          cardModule.renderCard('distCard2', {
            title: 'Résolution des Tickets Support',
            value: '91.4%',
            distribution: [78, 13.4, 8.6],
            labels: ['< 2h', '2h - 24h', '> 24h'],
            footnote: 'SLA garanti: 85%'
          }, themeName);
        }` : id === 'kpi-status-alert' ? `
        if (typeof cardModule.renderCard === 'function') {
          cardModule.renderCard('alertCard1', {
            title: 'Statut Pipeline Déploiement',
            status: 'success',
            statusText: 'Opérationnel (100% stable)',
            value: '42 / 42',
            footnote: 'Dernier build réussi il y a 4 min'
          }, themeName);

          cardModule.renderCard('alertCard2', {
            title: 'Charge CPU Cluster Prod',
            status: 'warning',
            statusText: 'Seuil d\\'alerte atteint (84%)',
            value: '84.2 %',
            footnote: 'Auto-scaling déclenché'
          }, themeName);

          cardModule.renderCard('alertCard3', {
            title: 'Taux d\\'Erreurs API 5xx',
            status: 'danger',
            statusText: 'Incident critique en cours',
            value: '3.45 %',
            footnote: 'Seuil SLA max: 0.10%'
          }, themeName);
        }` : `
        if (typeof cardModule.renderCard === 'function') {
          cardModule.renderCard('compositeCard1', {
            title: 'Revenu Récurrent Annuel (ARR)',
            value: '1.84 M€',
            variation: '+24.5%',
            target: '2.0 M€',
            progress: 92,
            series: [1.1, 1.2, 1.25, 1.35, 1.45, 1.5, 1.6, 1.68, 1.72, 1.76, 1.8, 1.84],
            footnote: 'En avance sur la trajectoire budgétaire 2026'
          }, themeName);

          cardModule.renderCard('compositeCard2', {
            title: 'EBITDA d\\'Exploitation',
            value: '420 k€',
            variation: '-6.2%',
            target: '500 k€',
            progress: 84,
            series: [380, 410, 430, 440, 435, 450, 460, 455, 445, 430, 425, 420],
            footnote: 'Impact des investissements R&D Q3'
          }, themeName);
        }`}
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
        renderAllCards(currentTheme);
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
          renderAllCards(currentTheme);
        });
      }

      updateTheme('colorbrewer-accessible');
    });`;
  } else if (category === '09-tableaux-dataviz') {
    scriptContent = `    document.addEventListener('DOMContentLoaded', function() {
      const targetId = 'tableTarget';
      const chartContainer = document.getElementById('chartContainer');
      const rulesCard = document.getElementById('cognitiveRulesCard');
      const tokensEngine = window.KitChartsTheme || (window.KitCharts && window.KitCharts.Theme) || {};
      let currentInstance = null;
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

      function renderCurrentTable() {
        const tableModule = (window.KitCharts && window.KitCharts['${id}']) || window;
        if (typeof tableModule.createTable === 'function') {
          if (currentInstance && typeof currentInstance.destroy === 'function') {
            currentInstance.destroy();
          }
          currentInstance = tableModule.createTable(targetId, null, currentTheme, { showDataLabels });
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
          if (chartContainer) {
            chartContainer.style.backgroundColor = tokens.surface || '#FFFFFF';
            chartContainer.style.borderColor = tokens.border || '#E2E8F0';
          }
          if (rulesCard) {
            rulesCard.style.backgroundColor = tokens.surface || '#FFFFFF';
            rulesCard.style.borderColor = tokens.border || '#E2E8F0';
          }
        }

        setActiveThemeUI(currentTheme);
        renderCurrentTable();
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
          renderCurrentTable();
        });
      }

      updateTheme('colorbrewer-accessible');
    });`;
  } else if (id === 'animation') {
    scriptContent = `    (function() {
      'use strict';
      const canvas = document.getElementById('animDemoCanvas');
      const easingSelect = document.getElementById('easingSelect');
      const replayBtn = document.getElementById('replayBtn');
      const chartContainer = document.getElementById('chartContainer');
      const rulesCard = document.getElementById('cognitiveRulesCard');
      let currentChart = null;
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
        const tokensEngine = window.KitChartsTheme || (window.KitCharts && window.KitCharts.Theme) || {};
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
      }

      function render(themeName, easing) {
        updateTheme(themeName);
        if (window.KitCharts && window.KitCharts['animation']) {
          currentChart = window.KitCharts['animation'].createChart(
            canvas,
            null,
            themeName,
            { easing: easing, showDataLabels }
          );
        }
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
            currentTheme = swatch.dataset.themeName;
            render(currentTheme, easingSelect ? easingSelect.value : 'easeOutCubic');
          }
        });
      }

      if (easingSelect) {
        easingSelect.addEventListener('change', (e) => {
          render(currentTheme, e.target.value);
        });
      }

      if (replayBtn) {
        replayBtn.addEventListener('click', () => {
          render(currentTheme, easingSelect ? easingSelect.value : 'easeOutCubic');
        });
      }

      const dataLabelsToggleBtn = document.getElementById('dataLabelsToggleBtn');
      if (dataLabelsToggleBtn) {
        dataLabelsToggleBtn.addEventListener('click', function() {
          showDataLabels = !showDataLabels;
          dataLabelsToggleBtn.classList.toggle('active', showDataLabels);
          dataLabelsToggleBtn.setAttribute('aria-pressed', String(showDataLabels));
          dataLabelsToggleBtn.title = showDataLabels ? 'Étiquettes de données (Labels) : Activées' : 'Étiquettes de données (Labels) : Désactivées';
          render(currentTheme, easingSelect ? easingSelect.value : 'easeOutCubic');
        });
      }

      render('colorbrewer-accessible', easingSelect ? easingSelect.value : 'easeOutCubic');
    })();`;
  } else if (category === 'animation') {
    const animKey = id;
    scriptContent = `    document.addEventListener('DOMContentLoaded', function() {
      let chartInstance = null;
      let isReducedMotion = false;
      const canvas = document.getElementById("chartCanvas");
      const chartContainer = document.getElementById("chartContainer");
      const rulesCard = document.getElementById("cognitiveRulesCard");
      const replayBtn = document.getElementById("replayBtn");
      const toggleDataBtn = document.getElementById("toggleDataBtn");
      let currentTheme = 'colorbrewer-accessible';
      let showDataLabels = true;
      let isData2 = false;

      const data1 = {"labels":["Recherche & Dév.","Ingénierie Logicielle","Production & Infra","Marketing Digital","Service Client","Ressources Humaines","Finance & Audit","Logistique"],"datasets":[{"label":"Score d'Efficacité 2026","data":[88,94,76,82,69,85,91,78]}]};
      const data2 = {"labels":["R&D","Logiciel","Cloud Infra","Marketing","Support","RH","Audit","Logistique"],"datasets":[{"label":"Projection Budgétaire Q4","data":[95,98,85,90,78,82,94,88]}]};

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

      function updateTheme(theme) {
        currentTheme = theme || 'colorbrewer-accessible';
        const tokensEngine = window.KitChartsTheme || (window.KitCharts && window.KitCharts.Theme) || {};
        if (typeof tokensEngine.loadGoogleFonts === "function") {
          tokensEngine.loadGoogleFonts(currentTheme);
        }
        let tokens = null;
        if (typeof tokensEngine.applyThemeToContainer === "function") {
          tokens = tokensEngine.applyThemeToContainer(chartContainer, currentTheme);
        } else if (typeof tokensEngine.getThemeTokens === "function") {
          tokens = tokensEngine.getThemeTokens(currentTheme);
        }

        if (tokens) {
          document.body.style.backgroundColor = tokens.isDark ? "#242933" : "#F8FAFC";
          document.body.style.color = tokens.textPrimary || '#0F172A';
          if (rulesCard) {
            rulesCard.style.backgroundColor = tokens.surface || '#FFFFFF';
            rulesCard.style.borderColor = tokens.border || '#E2E8F0';
          }
        }
        setActiveThemeUI(currentTheme);
        renderCurrentChart();
      }

      function renderCurrentChart() {
        const mod = window.KitCharts && (window.KitCharts['${animKey}'] || window.KitCharts['anim-${animKey.replace(/^0[1-8]-/, '')}']);
        if (mod && mod.createChart) {
          if (chartInstance && typeof chartInstance.destroy === 'function') {
            chartInstance.destroy();
          }
          const d = isData2 ? data2 : data1;
          chartInstance = mod.createChart(canvas, JSON.parse(JSON.stringify(d)), currentTheme, {
            reducedMotion: isReducedMotion,
            showDataLabels: showDataLabels
          });
        }
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

      if (replayBtn) {
        replayBtn.addEventListener('click', () => {
          renderCurrentChart();
        });
      }

      if (toggleDataBtn) {
        toggleDataBtn.addEventListener('click', () => {
          isData2 = !isData2;
          const mod = window.KitCharts && (window.KitCharts['${animKey}'] || window.KitCharts['anim-${animKey.replace(/^0[1-8]-/, '')}']);
          if (mod && mod.playTransition && chartInstance) {
            const nextData = isData2 ? data2 : data1;
            mod.playTransition(chartInstance, nextData, { reducedMotion: isReducedMotion });
          } else {
            renderCurrentChart();
          }
        });
      }

      updateTheme('colorbrewer-accessible');
    });`;
  } else if (category === 'tooltip') {
    scriptContent = `    (function() {
      'use strict';
      const canvas = document.getElementById('tooltipDemoCanvas');
      const modeSelect = document.getElementById('modeSelect');
      const randomizeBtn = document.getElementById('randomizeBtn');
      const chartContainer = document.getElementById('chartContainer');
      const rulesCard = document.getElementById('cognitiveRulesCard');
      let currentChart = null;
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
        const tokensEngine = window.KitChartsTheme || (window.KitCharts && window.KitCharts.Theme) || {};
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
      }

      function render(themeName, tooltipMode) {
        updateTheme(themeName);
        const intersect = tooltipMode === 'point';
        const effectiveMode = tooltipMode === 'point' ? 'nearest' : tooltipMode;

        if (window.KitCharts && window.KitCharts['tooltip']) {
          currentChart = window.KitCharts['tooltip'].createChart(
            canvas,
            null,
            themeName,
            { tooltipMode: effectiveMode, intersect: intersect, showDataLabels }
          );
        }
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
            currentTheme = swatch.dataset.themeName;
            render(currentTheme, modeSelect ? modeSelect.value : 'index');
          }
        });
      }

      if (modeSelect) {
        modeSelect.addEventListener('change', (e) => {
          render(currentTheme, e.target.value);
        });
      }

      const dataLabelsToggleBtn = document.getElementById('dataLabelsToggleBtn');
      if (dataLabelsToggleBtn) {
        dataLabelsToggleBtn.addEventListener('click', function() {
          showDataLabels = !showDataLabels;
          dataLabelsToggleBtn.classList.toggle('active', showDataLabels);
          dataLabelsToggleBtn.setAttribute('aria-pressed', String(showDataLabels));
          dataLabelsToggleBtn.title = showDataLabels ? 'Étiquettes de données (Labels) : Activées' : 'Étiquettes de données (Labels) : Désactivées';
          render(currentTheme, modeSelect ? modeSelect.value : 'index');
        });
      }

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

      render('colorbrewer-accessible', modeSelect ? modeSelect.value : 'index');
    })();`;
  } else {
    // Standard Chart.js
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
        const chartModule = (window.KitCharts && window.KitCharts['${id}']) || window;
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
  }

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — kit-charts</title>
  <!-- Google Fonts pour tous les thèmes -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=Fira+Code:wght@400;500;600&family=Fira+Sans:wght@400;500;600;700&family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Roboto+Mono:wght@400;500;700&family=Roboto:wght@400;500;700&family=Source+Code+Pro:wght@400;500;600&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet">
  <!-- Chart.js v4.4.7 CDN -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js"></script>
  <!-- Theme Tokens & Template (Zero-CORS UMD loading for file:// & http://) -->
  <script src="${themeTokensPath}"></script>
  <script src="${tplJsPath}"></script>
  <style>${CSS_TEMPLATE}
  </style>
</head>
<body>
  <div class="wrapper">
    <div>
      <div class="breadcrumb">
        <a href="${backLink}">← kit-charts</a> / <a href="${backLink}#gallerySection">${category}</a> / ${id}
      </div>
      <div class="header-panel">
        <div class="title-group">
          <h1>${title}</h1>
          <p>${cognitiveSummary || 'Visualisation analytique optimisée selon les principes de cognition visuelle.'}</p>
        </div>
${getSwatchesControlsHtml(extraControls)}
      </div>
    </div>

    <!-- Conteneur Graphique -->
${chartContainerHtml}

    <!-- Synthèse des Recommandations & Règles Cognitives -->
    <div id="cognitiveRulesCard" class="cognitive-rules-card">
      <div class="rule-item">
        <h3>✅ Quand l'utiliser</h3>
        <p>${whenToUse}</p>
      </div>
      <div class="rule-item">
        <h3>❌ Quand NE PAS l'utiliser</h3>
        <p>${whenNotToUse}</p>
      </div>
    </div>
  </div>

  <script>
${scriptContent}
  </script>
</body>
</html>
`;

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, html.trim() + '\n', 'utf8');
}

// Also generate category overview preview: template/00-kpi-card/preview.html
const kpiOverviewPath = path.join(ROOT, 'template/00-kpi-card/preview.html');
const kpiOverviewHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Suite Complète de KPI Cards Cognitives — kit-charts</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=Fira+Code:wght@400;500;600&family=Fira+Sans:wght@400;500;600;700&family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&family=Roboto+Mono:wght@400;500;700&family=Roboto:wght@400;500;700&family=Source+Code+Pro:wght@400;500;600&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js"></script>
  <script src="../../themes/theme-tokens.js"></script>
  <script src="./kpi-standard/template.js"></script>
  <script src="./kpi-sparkline/template.js"></script>
  <script src="./kpi-bullet/template.js"></script>
  <script src="./kpi-comparative/template.js"></script>
  <script src="./kpi-distribution/template.js"></script>
  <script src="./kpi-status-alert/template.js"></script>
  <script src="./kpi-composite/template.js"></script>
  <style>${CSS_TEMPLATE}
  </style>
</head>
<body>
  <div class="wrapper">
    <div>
      <div class="breadcrumb">
        <a href="../../index.html">← kit-charts</a> / <a href="../../index.html#gallerySection">00-kpi-card</a> / Scorecard
      </div>
      <div class="header-panel">
        <div class="title-group">
          <h1>Scorecard de KPI Cards Cognitives — 7 Variantes</h1>
          <p>Composants analytiques haute performance conçus selon les sciences cognitives.</p>
        </div>
${getSwatchesControlsHtml('')}
      </div>
    </div>

    <!-- Grille des 7 Variantes de Cartes KPI -->
    <div id="chartContainer" class="chart-container kpi-scorecard-grid">
      <div id="targetCard1"></div>
      <div id="targetCard2"></div>
      <div id="targetCard3"></div>
      <div id="targetCard4"></div>
      <div id="targetCard5"></div>
      <div id="targetCard6"></div>
      <div id="targetCard7"></div>
    </div>

    <!-- Synthèse des Recommandations & Règles Cognitives -->
    <div id="cognitiveRulesCard" class="cognitive-rules-card">
      <div class="rule-item">
        <h3>✅ Quand l'utiliser</h3>
        <p>Tableaux de bord exécutifs, cockpit de pilotage stratégique et supervision opérationnelle en temps réel.</p>
      </div>
      <div class="rule-item">
        <h3>❌ Quand NE PAS l'utiliser</h3>
        <p>Analyse exploratoire fine de distributions statistiques ou de longues séries temporelles multi-variables.</p>
      </div>
    </div>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const rulesCard = document.getElementById('cognitiveRulesCard');
      const chartContainer = document.getElementById('chartContainer');
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

        const kc = window.KitCharts || {};
        if (kc['kpi-standard']) kc['kpi-standard'].renderCard('targetCard1', null, themeName);
        if (kc['kpi-sparkline']) kc['kpi-sparkline'].renderCard('targetCard2', null, themeName);
        if (kc['kpi-bullet']) kc['kpi-bullet'].renderCard('targetCard3', null, themeName);
        if (kc['kpi-comparative']) kc['kpi-comparative'].renderCard('targetCard4', null, themeName);
        if (kc['kpi-distribution']) kc['kpi-distribution'].renderCard('targetCard5', null, themeName);
        if (kc['kpi-status-alert']) kc['kpi-status-alert'].renderCard('targetCard6', null, themeName);
        if (kc['kpi-composite']) kc['kpi-composite'].renderCard('targetCard7', null, themeName);
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
    });
  </script>
</body>
</html>
`;
fs.writeFileSync(kpiOverviewPath, kpiOverviewHtml.trim() + '\n', 'utf8');

console.log('All 84 preview.html files regenerated with perfection!');
