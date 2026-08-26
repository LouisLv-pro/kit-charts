import fs from 'fs';
import path from 'path';

const ROOT = '/Users/louislaville/Desktop/kit-charts';

function walk(dir) {
  let files = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git') files = files.concat(walk(full));
    } else if (f.endsWith('preview.html')) {
      files.push(full);
    }
  }
  return files;
}

const previewFiles = walk(path.join(ROOT, 'template'));
console.log(`Modernizing scripts in ${previewFiles.length} files...`);

for (const file of previewFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const rel = path.relative(ROOT, file);

  // Identify template ID and Category
  // rel: template/01-comparaison/bar-chart-vertical/preview.html
  const parts = rel.split(path.sep);
  const cat = parts[1];
  const tplId = parts[2] === 'preview.html' ? parts[1] : parts[2];

  let newScript = '';

  if (rel === 'template/00-kpi-card/preview.html') {
    newScript = `  <script>
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
  </script>`;
  } else if (cat === '00-kpi-card') {
    // Individual KPI card
    // Extract renderCard calls from original script
    const scriptMatch = content.match(/<script[\s\S]*?>([\s\S]*?)<\/script>\s*<\/body>/i);
    const originalScript = scriptMatch ? scriptMatch[1] : '';

    newScript = `  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const chartContainer = document.getElementById('chartContainer');
      const rulesCard = document.getElementById('cognitiveRulesCard');
      const tokensEngine = window.KitChartsTheme || (window.KitCharts && window.KitCharts.Theme) || {};
      const cardModule = (window.KitCharts && window.KitCharts['${tplId}']) || {};
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
        ${tplId === 'kpi-standard' ? `
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
        }` : tplId === 'kpi-sparkline' ? `
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
        }` : tplId === 'kpi-bullet' ? `
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
        }` : tplId === 'kpi-comparative' ? `
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
        }` : tplId === 'kpi-distribution' ? `
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
        }` : tplId === 'kpi-status-alert' ? `
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
    });
  </script>`;
  } else if (cat === '09-tableaux-dataviz') {
    newScript = `  <script>
    document.addEventListener('DOMContentLoaded', function() {
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
        const tableModule = (window.KitCharts && window.KitCharts['${tplId}']) || window;
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
    });
  </script>`;
  } else if (cat === 'animation' && tplId === 'animation') {
    // Main animation preview
    newScript = `  <script>
    (function() {
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
    })();
  </script>`;
  } else if (cat === 'animation') {
    // Individual animation files (01 to 08)
    // Extract data1 and data2 if present
    const scriptMatch = content.match(/<script[\s\S]*?>([\s\S]*?)<\/script>\s*<\/body>/i);
    const orig = scriptMatch ? scriptMatch[1] : '';

    const animKey = tplId;
    newScript = `  <script>
    document.addEventListener('DOMContentLoaded', function() {
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
        const mod = window.KitCharts && (window.KitCharts['anim-${animKey.replace(/^0[1-8]-/, '')}'] || window.KitCharts['${animKey}']);
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
          const mod = window.KitCharts && (window.KitCharts['anim-${animKey.replace(/^0[1-8]-/, '')}'] || window.KitCharts['${animKey}']);
          if (mod && mod.playTransition && chartInstance) {
            const nextData = isData2 ? data2 : data1;
            mod.playTransition(chartInstance, nextData, { reducedMotion: isReducedMotion });
          } else {
            renderCurrentChart();
          }
        });
      }

      updateTheme('colorbrewer-accessible');
    });
  </script>`;
  } else if (cat === 'tooltip') {
    newScript = `  <script>
    (function() {
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

      // Inspection buttons
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
    })();
  </script>`;
  } else {
    // All standard Chart.js templates
    newScript = `  <script>
    document.addEventListener('DOMContentLoaded', function() {
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
        const chartModule = (window.KitCharts && window.KitCharts['${tplId}']) || window;
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
    });
  </script>`;
  }

  // Replace script in content
  const oldScriptRegex = /<script[\s\S]*?>[\s\S]*?<\/script>\s*<\/body>/i;
  const updatedContent = content.replace(oldScriptRegex, `${newScript}\n</body>`);

  fs.writeFileSync(file, updatedContent, 'utf8');
}

console.log('All 84 preview scripts updated and standardized!');
