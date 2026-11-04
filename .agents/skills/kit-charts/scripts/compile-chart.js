/**
 * @file .agents/skills/kit-charts/scripts/compile-chart.js
 * @description Compilateur et assembleur déterministe autonome de datavisualisations pour kit-charts.
 * Fusionne les spécifications (dataviz-spec.json), fragments DOM (template.html),
 * modules de rendu (template.js) et tokens accessibles (themes/theme-tokens.js) en pages HTML ou snippets autonomes.
 * @version 1.0.0
 * @license MIT
 */

const fs = require('fs');
const path = require('path');
const { validateChartSpec } = require('./validate-chart.js');

// Chemins de base du projet
const ROOT_DIR = path.resolve(__dirname, '../../../..');
const REGISTRY_PATH = path.join(ROOT_DIR, '.agents/skills/kit-charts/registry.json');
const THEMES_PATH = path.join(ROOT_DIR, 'themes/theme-tokens.js');
const STATS_PATH = path.join(ROOT_DIR, 'themes/stat-helpers.js');
const WORLD_ATLAS_PATH = path.join(ROOT_DIR, 'themes/world-atlas.js');

let WORLD_ATLAS_CODE = '';
if (fs.existsSync(WORLD_ATLAS_PATH)) {
  WORLD_ATLAS_CODE = fs.readFileSync(WORLD_ATLAS_PATH, 'utf8');
}

// Plugins Chart.js non-core requis par template, injectés après chart.umd.min.js
// pour éviter les canvas vides (erreur 'type not registered').
// Source unique des URL épinglées : vendor-pins.js (alignée sur les previews).
const { CHART_PLUGINS, VENDOR } = require('./vendor-pins.js');

/**
 * Charge le registre des templates
 */
function loadRegistry() {
  if (!fs.existsSync(REGISTRY_PATH)) {
    throw new Error(`Registre introuvable : ${REGISTRY_PATH}`);
  }
  return JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
}

/**
 * Charge le module de thèmes
 */
function loadThemeModule() {
  if (!fs.existsSync(THEMES_PATH)) {
    throw new Error(`Module de thème introuvable : ${THEMES_PATH}`);
  }
  return require(THEMES_PATH);
}

/**
 * Lit le contenu d'un fichier source
 */
function readFileSafe(filePath) {
  const abs = path.isAbsolute(filePath) ? filePath : path.join(ROOT_DIR, filePath);
  if (!fs.existsSync(abs)) {
    throw new Error(`Fichier introuvable : ${abs}`);
  }
  return fs.readFileSync(abs, 'utf8');
}

/**
 * Génère un identifiant unique aléatoire court
 */
function generateId(prefix = 'kc') {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Compile une spécification Dataviz en page HTML autonome ou snippet
 *
 * @param {Object} rawSpec - Spécification (dataviz-spec.json ou objet options)
 * @param {Object} [options={}] - Options de compilation (output, format, standalone, strict)
 * @returns {Object} { success: boolean, html: string, outputPath?: string, report: Object }
 */
function compileChart(rawSpec, options = {}) {
  const registry = loadRegistry();
  const themeModule = loadThemeModule();

  // Résolution du template cible
  const templateId = rawSpec.targetTemplateId || rawSpec.templateId || rawSpec.template || options.template;
  if (!templateId) {
    throw new Error('Spécification invalide : aucun "targetTemplateId" spécifié.');
  }

  const templateEntry = registry.templates ? registry.templates.find(t => t.id === templateId) : null;
  if (!templateEntry) {
    throw new Error(`Template "${templateId}" non trouvé dans le registre officiel (${registry.templates?.length || 0} templates).`);
  }

  // Résolution du thème
  const themeName = rawSpec.colorStrategy?.themeName || rawSpec.theme || options.theme || themeModule.DEFAULT_THEME || 'colorbrewer-accessible';
  const tokens = themeModule.getThemeTokens ? themeModule.getThemeTokens(themeName) : {};

  // Validation de la spec
  const validationReport = validateChartSpec(rawSpec, { strict: options.strict });
  if (options.strict && !validationReport.valid) {
    throw new Error(`Échec de validation de la spec dataviz :\n${validationReport.errors.map(e => ` - [${e.ruleId}] ${e.message}${e.suggestion ? `\n   Correctif : ${e.suggestion}` : ''}`).join('\n')}`);
  }

  // Chargement des fichiers du triplet
  const htmlTemplateContent = readFileSafe(templateEntry.paths.html);
  const jsTemplateContent = readFileSafe(templateEntry.paths.js);
  const themeTokensContent = readFileSafe('themes/theme-tokens.js');
  let statHelpersContent = '';
  if (fs.existsSync(STATS_PATH)) {
    statHelpersContent = readFileSafe('themes/stat-helpers.js');
  }

  // Détermination des métadonnées de layout
  const layout = rawSpec.layout || {};
  const title = layout.title || rawSpec.title || templateEntry.name;
  const subtitle = layout.subtitle || rawSpec.subtitle || templateEntry.description;
  const height = layout.height || rawSpec.height || 400;
  const footnote = layout.footnote || rawSpec.footnote || '';

  // IDs uniques pour le DOM
  const containerId = layout.containerId || generateId(`kc-container-${templateId}`);
  const canvasId = layout.canvasId || generateId(`kc-canvas-${templateId}`);

  // Données formatées ou données brutes
  const chartData = rawSpec.formattedData || rawSpec.data || null;

  // Options avancées passées à createChart
  const chartOpts = Object.assign({}, rawSpec.options || {}, {
    colorStrategy: rawSpec.colorStrategy || {},
    cognitiveFeatures: rawSpec.cognitiveFeatures || {},
    metricPolarity: rawSpec.colorStrategy?.metricPolarity || rawSpec.metricPolarity,
    showDataLabels: rawSpec.cognitiveFeatures?.showDataLabels,
    layout: layout
  });

  // Remplacement des balises dans template.html.
  // Sans footnote, le pied de carte des graphiques et tableaux est retiré (pas de ligne vide).
  const htmlSource = footnote
    ? htmlTemplateContent
    : htmlTemplateContent.replace(/[ \t]*<p class="kit-charts-footnote"[^>]*>\{\{FOOTNOTE\}\}<\/p>\r?\n?/g, '');
  let domFragment = htmlSource
    .replace(/\{\{CONTAINER_ID\}\}/g, containerId)
    .replace(/\{\{CANVAS_ID\}\}/g, canvasId)
    .replace(/\{\{TITLE\}\}/g, escapeHtml(title))
    .replace(/\{\{SUBTITLE\}\}/g, escapeHtml(subtitle))
    .replace(/\{\{HEIGHT\}\}/g, String(height))
    .replace(/\{\{FOOTNOTE\}\}/g, escapeHtml(footnote));

  // Injection des variables CSS de thème
  const cssVars = `
    --kc-bg: ${tokens.bg || '#FFFFFF'};
    --kc-bg-card: ${tokens.surface || tokens.surfaceRaised || '#FFFFFF'};
    --kc-border: ${tokens.border || '#E2E8F0'};
    --kc-border-strong: ${tokens.borderStrong || '#CBD5E1'};
    --kc-text-primary: ${tokens.textPrimary || '#0F172A'};
    --kc-text-secondary: ${tokens.textSecondary || '#334155'};
    --kc-text-muted: ${tokens.textMuted || '#64748B'};
    --kc-font-family: ${tokens.fontFamily || 'Inter, sans-serif'};
    --kc-font-mono: ${tokens.fontMono || 'monospace'};
    --kc-focal: ${tokens.emphasis?.focal || tokens.palette?.[0] || '#2B8CBE'};
    --kc-positive: ${tokens.semantic?.positive || '#2E7D32'};
    --kc-negative: ${tokens.semantic?.negative || '#C62828'};
    --kc-warning: ${tokens.semantic?.warning || '#EF6C00'};
  `;

  // Cartes KPI : renderCard() dessine la carte complète ; layout.footnote (et layout.title) y sont
  // reportés quand formattedData ne les fournit pas. L'échappement HTML est fait par les templates
  // eux-mêmes, au point d'injection (escapeHtml de theme-tokens.js).
  const isCardTemplate = /function\s+renderCard\b/.test(jsTemplateContent);
  let renderData = chartData;
  if (isCardTemplate && renderData && typeof renderData === 'object') {
    renderData = Object.assign({}, renderData);
    if (renderData.title === undefined && layout.title) renderData.title = layout.title;
    if (renderData.footnote === undefined && footnote) renderData.footnote = footnote;
  }
  // Les JSON sérialisés dans <script> ont leurs < en \u003c : aucune donnée ne peut fermer le bloc.

  // Construction du script d'initialisation
  const serializedData = renderData ? JSON.stringify(renderData, null, 2).replace(/</g, '\\u003c') : 'null';
  const serializedOptions = JSON.stringify(chartOpts, null, 2).replace(/</g, '\\u003c');
  const serializedTheme = JSON.stringify(themeName).replace(/</g, '\\u003c');

  // Cible du rendu : les tableaux s'hydratent dans {{TABLE_ID}}, les cartes KPI dessinent
  // leur propre carte dans le conteneur (renderCard, comme les previews), le reste sur le canvas.
  const isTable = htmlTemplateContent.includes('{{TABLE_ID}}');
  const tableId = generateId(`kc-table-${templateId}`);
  const renderTargetId = isTable ? tableId : canvasId;
  domFragment = domFragment.replace(/\{\{TABLE_ID\}\}/g, tableId);

  // Statut de rendu posé sur le conteneur, lu par test/render-check.js et `kit-charts check` :
  // data-kc-render = ok | invalid | error, data-kc-error = raison.
  const initScriptContent = `
(function() {
  const container = document.getElementById('${containerId}');
  function setStatus(status, reason) {
    if (!container) return;
    container.setAttribute('data-kc-render', status);
    if (reason) container.setAttribute('data-kc-error', String(reason).slice(0, 500));
  }
  try {
    const customData = ${serializedData};
    const themeName = ${serializedTheme};
    const options = ${serializedOptions};
    const canvas = document.getElementById('${canvasId}');
    const mod = (typeof KitCharts !== 'undefined' && KitCharts['${templateId}']) || null;

    if (container && typeof KitChartsTheme !== 'undefined' && KitChartsTheme.applyThemeToContainer) {
      KitChartsTheme.applyThemeToContainer(container, themeName);
    }

    let result = null;
    if (mod && typeof mod.renderCard === 'function') {
      result = mod.renderCard('${containerId}', customData, themeName);
    } else if (mod && typeof mod.createChart === 'function') {
      result = mod.createChart('${renderTargetId}', customData, themeName, options);
    } else if (typeof createChart === 'function') {
      result = createChart('${renderTargetId}', customData, themeName, options);
    } else {
      throw new Error('module du template ${templateId} introuvable');
    }
    window['chart_${templateId.replace(/[^a-zA-Z0-9]/g, '_')}'] = result;

    const earlyErrors = window.__kcErrors || [];
    const invalid = container && container.querySelector('[data-kc-invalid]');
    if (earlyErrors.length) {
      setStatus('error', earlyErrors[0]);
    } else if (invalid) {
      setStatus('invalid', invalid.getAttribute('data-kc-invalid'));
    } else {
      const host = document.getElementById('${renderTargetId}');
      const chartOk = canvas && typeof Chart !== 'undefined' && Chart.getChart && Chart.getChart(canvas);
      const domOk = host && host.tagName !== 'CANVAS' && host.children.length > 0;
      const cardOk = mod && typeof mod.renderCard === 'function' && container && container.children.length > 0;
      let painted = false;
      if (!chartOk && !domOk && !cardOk && canvas && canvas.width && canvas.height) {
        const px = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
        for (let i = 3; i < px.length; i += 4) { if (px[i] !== 0) { painted = true; break; } }
      }
      if (chartOk || domOk || cardOk || painted) setStatus('ok');
      else setStatus('error', 'rendu vide : aucun graphique, aucun DOM, canvas vierge');
    }
  } catch (err) {
    setStatus('error', err && err.message ? err.message : err);
    console.error('[kit-charts] Erreur lors de l\\'initialisation du graphique ${templateId}:', err);
  }
})();
  `.trim();

  // Mode Snippet
  if (options.format === 'snippet') {
    const snippetHtml = `
<!-- kit-charts snippet : ${templateId} (${themeName}) -->
<div style="${cssVars}">
  ${domFragment}
</div>
<script>
${initScriptContent}
</script>
    `.trim();

    return {
      success: true,
      html: snippetHtml,
      templateId,
      themeName,
      validationReport
    };
  }

  // Mode Page HTML Complète Autonome
  const googleFontsLink = tokens.googleFontsUrl
    ? `<link rel="preconnect" href="https://fonts.googleapis.com">\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n  <link href="${tokens.googleFontsUrl}" rel="stylesheet">`
    : '';

  // Injecte les plugins Chart.js non-core requis par le template (ex: treemap, sankey, candlestick)
  const chartPluginTags = (CHART_PLUGINS[templateId] || [])
    .map(u => `  <script src="${u}"></script>`)
    .join('\n');

  const fullHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <script>
    // Erreurs de chargement (CDN, plugin, template) collectées avant tout le reste, pour data-kc-render.
    window.__kcErrors = [];
    window.addEventListener('error', function(e) {
      window.__kcErrors.push(e.message || ('ressource non chargée : ' + ((e.target && (e.target.src || e.target.href)) || 'inconnue')));
    }, true);
  </script>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} — kit-charts</title>
  ${googleFontsLink}
  <style>
    :root {
      ${cssVars}
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: var(--kc-font-family);
      background-color: var(--kc-bg);
      color: var(--kc-text-primary);
      padding: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }
    .kit-charts-standalone-container {
      width: 100%;
      max-width: 900px;
      margin: 0 auto;
    }
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  </style>

  <!-- Dépendances Chart.js UMD Officielles -->
  <script src="${VENDOR['chart.js']}"></script>
  <!-- Plugins Chart.js non-core requis par ce template (contrôleurs treemap / matrix / sankey / candlestick) -->
${chartPluginTags}

  <!-- Fonctions Statistiques kit-charts : chargées AVANT le moteur de thèmes, qui les
       lit via window.KitChartsStatHelpers. Isolées dans une IIFE : les deux fichiers
       déclarent des const globales homonymes (errorBarsPlugin), ce qui faisait
       échouer le second script (SyntaxError) et privait les templates des helpers. -->
  <script>
(function () {
${statHelpersContent}
})();
  </script>

  <!-- Moteur de Thèmes kit-charts -->
  <script>
${themeTokensContent}
  </script>
${(templateId === 'choropleth-map' || templateId === 'bubble-map') && WORLD_ATLAS_CODE ? `
  <!-- Données Cartographiques World Atlas 110m -->
  <script>
${WORLD_ATLAS_CODE}
  </script>` : ''}

  <!-- Logique Spécifique du Template : ${templateId} -->
  <script>
${jsTemplateContent}
  </script>
</head>
<body>
  <div class="kit-charts-standalone-container">
    ${domFragment}
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      ${initScriptContent}
    });
  </script>
</body>
</html>`;

  // Sauvegarde sur disque si demandée (toujours isolée dans un sous-dossier propre)
  let finalOutputPath = options.output;
  if (finalOutputPath) {
    let absOutput = path.isAbsolute(finalOutputPath) ? finalOutputPath : path.resolve(process.cwd(), finalOutputPath);
    const parsedPath = path.parse(absOutput);
    const parentDirName = path.basename(parsedPath.dir);

    // Si le fichier cible est placé directement à la racine de output/ (ex: output/mon-graph.html)
    // on l'isole automatiquement dans son sous-dossier dédié output/mon-graph/mon-graph.html
    if (parentDirName === 'output' && parsedPath.ext) {
      const subfolderName = parsedPath.name;
      absOutput = path.join(parsedPath.dir, subfolderName, `${subfolderName}.html`);
    } else if (!parsedPath.ext) {
      // Si c'est un dossier (ex: output/mon-graph), on génère index.html à l'intérieur
      absOutput = path.join(absOutput, 'index.html');
    }

    const parentDir = path.dirname(absOutput);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.writeFileSync(absOutput, fullHtml, 'utf8');

    // Sauvegarde automatique du contrat JSON associé dans le même sous-dossier
    if (rawSpec && typeof rawSpec === 'object') {
      const specPath = path.join(parentDir, 'spec.json');
      fs.writeFileSync(specPath, JSON.stringify(rawSpec, null, 2), 'utf8');
    }

    finalOutputPath = absOutput;
  }

  return {
    success: true,
    html: fullHtml,
    outputPath: finalOutputPath,
    templateId,
    themeName,
    validationReport,
    stats: {
      htmlLength: fullHtml.length,
      generatedAt: new Date().toISOString()
    }
  };
}

/**
 * Échappe les caractères HTML dangereux
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return String(str ?? '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Parse les arguments CLI
 */
function parseCliArgs(args) {
  const parsed = {
    options: {
      // CLI : une erreur bloquante de validation interdit la génération (exit 1).
      // --force rétablit l'ancien comportement (génère malgré les erreurs).
      strict: true,
      format: 'html',
      validate: true
    }
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--spec' || arg === '-s') {
      parsed.specFile = args[++i];
    } else if (arg === '--template' || arg === '-t') {
      parsed.template = args[++i];
    } else if (arg === '--data' || arg === '-d') {
      parsed.data = args[++i];
    } else if (arg === '--theme') {
      parsed.theme = args[++i];
    } else if (arg === '--polarity') {
      parsed.polarity = args[++i];
    } else if (arg === '--title') {
      parsed.title = args[++i];
    } else if (arg === '--subtitle') {
      parsed.subtitle = args[++i];
    } else if (arg === '--output' || arg === '-o') {
      parsed.options.output = args[++i];
    } else if (arg === '--format') {
      parsed.options.format = args[++i];
    } else if (arg === '--strict') {
      parsed.options.strict = true;
    } else if (arg === '--force') {
      parsed.options.strict = false;
    } else if (arg === '--json') {
      parsed.options.json = true;
    } else if (arg === '--help' || arg === '-h') {
      parsed.help = true;
    } else if (!arg.startsWith('-') && !parsed.specFile) {
      parsed.specFile = arg;
    }
  }

  return parsed;
}

// Interface CLI
if (require.main === module) {
  const cliArgs = parseCliArgs(process.argv.slice(2));

  if (cliArgs.help) {
    console.log(`
🚀 Compilateur Déterministe kit-charts (compile-chart.js)

Usage:
  node compile-chart.js <dataviz-spec.json> [options]
  node compile-chart.js --template <templateId> --data <data.json> [options]

Options:
  --spec, -s <path>       Chemin vers le fichier de spécification dataviz-spec.json
  --template, -t <id>     ID du template à compiler (ex: bar-chart-vertical, kpi-standard)
  --data, -d <path|json>  Données JSON ou chemin vers un fichier JSON
  --theme <name>          Nom du thème (default: colorbrewer-accessible)
  --polarity <polarity>   Polarité métier (HIGHER_IS_BETTER, LOWER_IS_BETTER, TARGET_BASED)
  --title <title>         Titre du graphique
  --subtitle <subtitle>   Sous-titre explicatif
  --output, -o <path>     Chemin du fichier HTML/snippet généré en sortie
  --format <html|snippet> Format de sortie (html complet ou snippet, default: html)
  --strict                Bloquer la génération en cas d'erreur bloquante (défaut en CLI)
  --force                 Générer malgré les erreurs bloquantes (debug uniquement, sortie non conforme)
  --json                  Afficher le résultat au format JSON sur stdout
  --help, -h              Afficher cette aide

Exemples:
  node compile-chart.js dataviz-spec.json -o output/my-chart.html
  node compile-chart.js -t bar-chart-vertical -d data.json --theme nord-cognitive-dark -o output/chart.html
`);
    process.exit(0);
  }

  try {
    let spec = {};

    if (cliArgs.specFile) {
      const absSpec = path.isAbsolute(cliArgs.specFile) ? cliArgs.specFile : path.resolve(process.cwd(), cliArgs.specFile);
      if (!fs.existsSync(absSpec)) {
        console.error(`Erreur: Fichier de spécification non trouvé: "${absSpec}"`);
        process.exit(1);
      }
      spec = JSON.parse(fs.readFileSync(absSpec, 'utf8'));
    }

    if (cliArgs.template) spec.targetTemplateId = cliArgs.template;
    if (cliArgs.theme) {
      spec.colorStrategy = spec.colorStrategy || {};
      spec.colorStrategy.themeName = cliArgs.theme;
    }
    if (cliArgs.polarity) {
      spec.colorStrategy = spec.colorStrategy || {};
      spec.colorStrategy.metricPolarity = cliArgs.polarity;
    }
    if (cliArgs.title) {
      spec.layout = spec.layout || {};
      spec.layout.title = cliArgs.title;
    }
    if (cliArgs.subtitle) {
      spec.layout = spec.layout || {};
      spec.layout.subtitle = cliArgs.subtitle;
    }
    if (cliArgs.data) {
      if (cliArgs.data.trim().startsWith('{') || cliArgs.data.trim().startsWith('[')) {
        spec.formattedData = JSON.parse(cliArgs.data);
      } else {
        const dataPath = path.isAbsolute(cliArgs.data) ? cliArgs.data : path.resolve(process.cwd(), cliArgs.data);
        spec.formattedData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      }
    }

    // Par défaut si pas d'output spécifié
    if (!cliArgs.options.output) {
      const outName = `${spec.targetTemplateId || 'chart'}-${Date.now()}.html`;
      cliArgs.options.output = path.join(process.cwd(), 'output', outName);
    }

    const result = compileChart(spec, cliArgs.options);

    if (cliArgs.options.json) {
      console.log(JSON.stringify({
        success: true,
        outputPath: result.outputPath,
        templateId: result.templateId,
        themeName: result.themeName,
        validation: result.validationReport,
        stats: result.stats
      }, null, 2));
    } else {
      console.log('======================================================================');
      console.log(result.validationReport.valid
        ? ' ✨ COMPILATION DATAVIZ RÉUSSIE — KIT-CHARTS'
        : ' ⚠️ COMPILATION FORCÉE (--force) : SORTIE NON CONFORME');
      console.log('======================================================================');
      console.log(` 🎯 Template      : ${result.templateId}`);
      console.log(` 🎨 Thème         : ${result.themeName}`);
      console.log(` 📁 Fichier généré : ${result.outputPath}`);
      console.log(` 📏 Taille HTML   : ${result.stats.htmlLength} octets`);
      console.log(` 🚦 Validation    : ${result.validationReport.summary}`);
      console.log('======================================================================');
    }

    process.exit(result.validationReport.valid ? 0 : 1);
  } catch (err) {
    if (cliArgs.options && cliArgs.options.json) {
      console.error(JSON.stringify({ success: false, error: err.message }, null, 2));
    } else {
      console.error(`\n❌ Erreur de compilation : ${err.message}\n`);
    }
    process.exit(1);
  }
}

module.exports = {
  compileChart,
  loadRegistry,
  loadThemeModule
};
