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
const { applyFocus } = require('./focus.js');

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
const { CHART_PLUGINS, VENDOR, parsePinnedUrl, readVendor } = require('./vendor-pins.js');

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

// Polarité de la spec traduite dans le vocabulaire que lisent les templates (décision 0002).
const POLARITY_METRIC_TYPE = {
  HIGHER_IS_BETTER: 'gain',
  LOWER_IS_BETTER: 'cost',
  NEUTRAL_CATEGORICAL: 'neutral'
};
const POLARITY_FIELD = {
  HIGHER_IS_BETTER: 'higher-is-better',
  LOWER_IS_BETTER: 'lower-is-better'
};

/**
 * Complète formattedData depuis colorStrategy.metricPolarity, sans rien écraser : metricType à la
 * racine, metricType des séries qui portent une valence, et `polarity` si le template la lit.
 * Lignes, nœuds et indicateurs gardent leur propre nature. L'entrée n'est pas modifiée.
 *
 * @param {Object} data - formattedData de la spec
 * @param {string} metricPolarity - HIGHER_IS_BETTER, LOWER_IS_BETTER, TARGET_BASED, NEUTRAL_CATEGORICAL
 * @param {Object} [opts] - { polarityField: true si le schéma du template déclare `polarity` }
 * @returns {Object} copie complétée (ou l'entrée telle quelle si rien à compléter)
 */
function applyMetricPolarity(data, metricPolarity, opts = {}) {
  const metricType = POLARITY_METRIC_TYPE[metricPolarity];
  if (!metricType || !data || typeof data !== 'object' || Array.isArray(data)) return data;
  const out = Object.assign({}, data);
  if (out.metricType === undefined) out.metricType = metricType;
  if (opts.polarityField && out.polarity === undefined && POLARITY_FIELD[metricPolarity]) {
    out.polarity = POLARITY_FIELD[metricPolarity];
  }
  if (Array.isArray(data.datasets)) {
    out.datasets = data.datasets.map(ds => {
      const hasValence = ds && (ds.valence !== undefined || Array.isArray(ds.valences) || ds.direction !== undefined);
      return hasValence && ds.metricType === undefined ? Object.assign({}, ds, { metricType }) : ds;
    });
  }
  return out;
}

/** Le schéma du template déclare-t-il formattedData.polarity ? */
function schemaHasPolarity(templateEntry) {
  if (!templateEntry.paths || !templateEntry.paths.schema) return false;
  try {
    const schema = JSON.parse(readFileSafe(templateEntry.paths.schema));
    const props = (schema.properties && schema.properties.formattedData && schema.properties.formattedData.properties) || schema.properties || {};
    return Object.prototype.hasOwnProperty.call(props, 'polarity');
  } catch (e) {
    return false;
  }
}

/**
 * Prépare un graphique : validation, fragment DOM et script d'initialisation.
 * Partagé par la page à un graphique (compileChart) et la page à plusieurs (compilePage).
 *
 * @param {Object} rawSpec - Spécification dataviz
 * @param {Object} [options={}] - { strict, theme (impose le thème, pages multi-graphiques) }
 * @returns {Object} parties du graphique
 */
function prepareChart(userSpec, options = {}) {
  const registry = loadRegistry();
  const themeModule = loadThemeModule();

  // Résolution du template cible
  const templateId = userSpec.targetTemplateId || userSpec.templateId || userSpec.template || options.template;
  if (!templateId) {
    throw new Error('Spécification invalide : aucun "targetTemplateId" spécifié.');
  }

  const templateEntry = registry.templates ? registry.templates.find(t => t.id === templateId) : null;
  if (!templateEntry) {
    throw new Error(`Template "${templateId}" non trouvé dans le registre officiel (${registry.templates?.length || 0} templates).`);
  }

  // La polarité de la spec complète les données avant validation et rendu (décision 0002).
  // Copie : la spec de l'utilisateur (et sa copie spec.json) reste intacte.
  const metricPolarity = userSpec.colorStrategy?.metricPolarity || userSpec.metricPolarity;
  const dataKey = userSpec.formattedData ? 'formattedData' : (userSpec.data ? 'data' : null);
  const polarized = metricPolarity && dataKey
    ? Object.assign({}, userSpec, {
      [dataKey]: applyMetricPolarity(userSpec[dataKey], metricPolarity, { polarityField: schemaHasPolarity(templateEntry) })
    })
    : userSpec;
  // Mise en avant (cognitiveFeatures.focus) traduite en focusIndex ou en rôles, même principe.
  const focus = userSpec.cognitiveFeatures && userSpec.cognitiveFeatures.focus;
  const rawSpec = focus !== undefined && dataKey
    ? Object.assign({}, polarized, { [dataKey]: applyFocus(polarized[dataKey], templateId, focus) })
    : polarized;

  // Résolution du thème (imposé par la page dans une page à plusieurs graphiques)
  const themeName = options.theme || rawSpec.colorStrategy?.themeName || rawSpec.theme || themeModule.DEFAULT_THEME || 'colorbrewer-accessible';
  const tokens = themeModule.getThemeTokens ? themeModule.getThemeTokens(themeName) : {};

  // Validation de la spec
  const validationReport = validateChartSpec(rawSpec, { strict: options.strict });
  if (options.strict && !validationReport.valid) {
    throw new Error(`Échec de validation de la spec dataviz${options.label ? ` (${options.label})` : ''} :\n${validationReport.errors.map(e => ` - [${e.ruleId}] ${e.message}${e.suggestion ? `\n   Correctif : ${e.suggestion}` : ''}`).join('\n')}`);
  }

  // Chargement des fichiers du triplet
  const htmlTemplateContent = readFileSafe(templateEntry.paths.html);
  const jsTemplateContent = readFileSafe(templateEntry.paths.js);

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
    colorStrategy: Object.assign({}, rawSpec.colorStrategy || {}, options.theme ? { themeName } : {}),
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
  // Les JSON sérialisés dans <script> ont leurs < en < : aucune donnée ne peut fermer le bloc.

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

  return {
    templateId,
    templateEntry,
    themeName,
    tokens,
    validationReport,
    title,
    domFragment,
    initScriptContent,
    jsTemplateContent,
    plugins: CHART_PLUGINS[templateId] || [],
    needsAtlas: templateId === 'choropleth-map' || templateId === 'bubble-map'
  };
}

/** Variables CSS de thème injectées dans :root (page) ou sur l'enveloppe (snippet). */
function themeCssVars(tokens) {
  return `
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
}

/**
 * Balise d'une dépendance épinglée : <script src> vers le CDN, ou contenu local vérifié
 * (SHA-384) en mode hors ligne. `</script` est neutralisé dans le contenu inliné.
 */
function vendorScriptTag(url, offline) {
  if (!offline) return `  <script src="${url}"></script>`;
  return `  <!-- ${parsePinnedUrl(url).pkg}@${parsePinnedUrl(url).version} (copie locale vérifiée) -->\n  <script>\n${readVendor(url).replace(/<\/script/gi, '<\\/script')}\n  </script>`;
}

/**
 * Assemble une page HTML autonome autour d'un ou plusieurs graphiques préparés.
 * Moteur de thèmes, fonctions statistiques et code de chaque template ne sont inclus qu'une fois.
 */
function assemblePage({ title, tokens, charts, bodyHtml, offline, maxWidth, extraCss }) {
  const themeTokensContent = readFileSafe('themes/theme-tokens.js');
  const statHelpersContent = fs.existsSync(STATS_PATH) ? readFileSafe('themes/stat-helpers.js') : '';

  // Hors ligne : pas de Google Fonts, la pile de polices du thème se replie sur les polices système.
  const googleFontsLink = tokens.googleFontsUrl && !offline
    ? `<link rel="preconnect" href="https://fonts.googleapis.com">\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n  <link href="${tokens.googleFontsUrl}" rel="stylesheet">`
    : '';

  // Plugins Chart.js non-core requis (ex : treemap, sankey, candlestick), dédoublonnés dans l'ordre.
  const pluginUrls = [];
  charts.forEach(c => c.plugins.forEach(u => { if (!pluginUrls.includes(u)) pluginUrls.push(u); }));
  const chartPluginTags = pluginUrls.map(u => vendorScriptTag(u, offline)).join('\n');

  const templateScripts = [];
  const seen = new Set();
  charts.forEach(c => {
    if (seen.has(c.templateId)) return;
    seen.add(c.templateId);
    templateScripts.push(`  <!-- Logique Spécifique du Template : ${c.templateId} -->\n  <script>\n${c.jsTemplateContent}\n  </script>`);
  });
  const needsAtlas = charts.some(c => c.needsAtlas) && WORLD_ATLAS_CODE;
  const initScripts = charts.map(c => c.initScriptContent).join('\n');

  return `<!DOCTYPE html>
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
      ${themeCssVars(tokens)}
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
      max-width: ${maxWidth || 900}px;
      margin: 0 auto;
    }
    /* Téléphone : marge de page réduite, la place va au graphique */
    @media (max-width: 520px) {
      body { padding: 0.75rem; }
    }${extraCss || ''}
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  </style>

  <!-- Dépendances Chart.js UMD Officielles -->
${vendorScriptTag(VENDOR['chart.js'], offline)}
  <!-- Plugins Chart.js non-core requis (contrôleurs treemap / matrix / sankey / candlestick) -->
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
${needsAtlas ? `
  <!-- Données Cartographiques World Atlas 110m -->
  <script>
${WORLD_ATLAS_CODE}
  </script>` : ''}

${templateScripts.join('\n')}
</head>
<body>
  <div class="kit-charts-standalone-container">
    ${bodyHtml}
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      ${initScripts}
    });
  </script>
</body>
</html>`;
}

/**
 * Résout le chemin de sortie (toujours isolé dans un sous-dossier propre) et écrit la page
 * et sa spec à côté.
 */
function writeOutput(outputOption, html, rawSpec) {
  let absOutput = path.isAbsolute(outputOption) ? outputOption : path.resolve(process.cwd(), outputOption);
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
  fs.writeFileSync(absOutput, html, 'utf8');

  // Sauvegarde automatique du contrat JSON associé dans le même sous-dossier
  if (rawSpec && typeof rawSpec === 'object') {
    fs.writeFileSync(path.join(parentDir, 'spec.json'), JSON.stringify(rawSpec, null, 2), 'utf8');
  }
  return absOutput;
}

/**
 * Compile une spécification Dataviz en page HTML autonome ou snippet.
 * Une spec qui porte `charts` (tableau de specs) est une page à plusieurs graphiques : compilePage.
 *
 * @param {Object} rawSpec - Spécification (dataviz-spec.json ou objet options)
 * @param {Object} [options={}] - Options de compilation (output, format, strict, offline)
 * @returns {Object} { success: boolean, html: string, outputPath?: string, report: Object }
 */
function compileChart(rawSpec, options = {}) {
  if (rawSpec && Array.isArray(rawSpec.charts)) return compilePage(rawSpec, options);

  const part = prepareChart(rawSpec, options);
  const { templateId, themeName, tokens, validationReport } = part;

  // Mode Snippet
  if (options.format === 'snippet') {
    const snippetHtml = `
<!-- kit-charts snippet : ${templateId} (${themeName}) -->
<div style="${themeCssVars(tokens)}">
  ${part.domFragment}
</div>
<script>
${part.initScriptContent}
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

  const fullHtml = assemblePage({
    title: part.title,
    tokens,
    charts: [part],
    bodyHtml: part.domFragment,
    offline: options.offline
  });

  const finalOutputPath = options.output ? writeOutput(options.output, fullHtml, rawSpec) : options.output;

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

// Au-delà, le lecteur ne retient plus l'ensemble : mieux vaut deux pages.
const MAX_CHARTS_PER_PAGE = 6;
const MAX_PAGE_COLUMNS = 3;

/**
 * Valide une page à plusieurs graphiques : chaque graphique avec validateChartSpec (erreurs
 * préfixées par charts[i]), plus les règles de page (nombre de graphiques, colonnes). Le thème
 * de la page s'impose à tous les graphiques : un seul thème par page.
 * @param {Object} pageSpec - { layout, colorStrategy: { themeName }, charts: [spec, ...] }
 * @returns {Object} rapport { valid, errors, warnings, summary, charts: [rapport par graphique] }
 */
function validatePageSpec(pageSpec) {
  const errors = [];
  const warnings = [];
  const charts = Array.isArray(pageSpec.charts) ? pageSpec.charts : [];
  const layout = pageSpec.layout || {};
  if (charts.length === 0) {
    errors.push({ ruleId: 'PAGE_EMPTY', message: 'La page ne contient aucun graphique (charts vide).', suggestion: 'Ajouter au moins une spec dans charts.' });
  }
  if (charts.length > MAX_CHARTS_PER_PAGE) {
    errors.push({ ruleId: 'PAGE_TOO_MANY_CHARTS', message: `${charts.length} graphiques sur une page (maximum ${MAX_CHARTS_PER_PAGE}) : le lecteur ne retient plus l'ensemble.`, suggestion: 'Garder les graphiques qui portent le message, ou répartir sur deux pages.' });
  }
  const columns = layout.columns === undefined ? null : layout.columns;
  if (columns !== null && (!Number.isInteger(columns) || columns < 1 || columns > MAX_PAGE_COLUMNS)) {
    errors.push({ ruleId: 'PAGE_COLUMNS', message: `layout.columns = ${JSON.stringify(columns)} : entier de 1 à ${MAX_PAGE_COLUMNS} attendu.`, suggestion: '2 colonnes pour 2 à 4 graphiques, 3 pour une rangée de cartes KPI.' });
  }
  if (!layout.title || !String(layout.title).trim()) {
    warnings.push({ ruleId: 'PAGE_MISSING_TITLE', message: 'La page n\'a pas de titre (layout.title).', suggestion: 'Un titre de page qui énonce le message d\'ensemble.' });
  }
  const reports = charts.map((spec, i) => {
    const r = validateChartSpec(spec);
    r.errors.forEach(e => errors.push(Object.assign({}, e, { message: `charts[${i}] (${spec.targetTemplateId || '?'}) : ${e.message}` })));
    r.warnings.forEach(w => warnings.push(Object.assign({}, w, { message: `charts[${i}] (${spec.targetTemplateId || '?'}) : ${w.message}` })));
    return r;
  });
  const valid = errors.length === 0;
  return {
    valid,
    errors,
    warnings,
    charts: reports,
    summary: valid
      ? `Page conforme : ${charts.length} graphique(s), ${warnings.length} avertissement(s).`
      : `Page non conforme : ${errors.length} erreur(s) bloquante(s), ${warnings.length} avertissement(s).`
  };
}

/**
 * Compile une page à plusieurs graphiques (tableau de bord, rapport) en un seul HTML :
 * un thème, une grille, et le code partagé chargé une seule fois.
 *
 * pageSpec = {
 *   layout: { title, subtitle, footnote, columns: 1..3 },
 *   colorStrategy: { themeName },
 *   charts: [ spec, ... ]   // specs habituelles ; layout.span (1..columns) élargit une cellule
 * }
 */
function compilePage(pageSpec, options = {}) {
  const themeModule = loadThemeModule();
  const themeName = pageSpec.colorStrategy?.themeName || pageSpec.charts?.find(c => c.colorStrategy?.themeName)?.colorStrategy.themeName || themeModule.DEFAULT_THEME || 'colorbrewer-accessible';
  const tokens = themeModule.getThemeTokens(themeName);
  const validationReport = validatePageSpec(pageSpec);
  if (options.strict && !validationReport.valid) {
    throw new Error(`Échec de validation de la page :\n${validationReport.errors.map(e => ` - [${e.ruleId}] ${e.message}${e.suggestion ? `\n   Correctif : ${e.suggestion}` : ''}`).join('\n')}`);
  }

  const layout = pageSpec.layout || {};
  const charts = pageSpec.charts.map((spec, i) => prepareChart(spec, { strict: false, theme: themeName, label: `charts[${i}]` }));
  const columns = Math.min(Math.max(parseInt(layout.columns, 10) || (charts.length >= 2 ? 2 : 1), 1), MAX_PAGE_COLUMNS);
  const cells = charts.map((c, i) => {
    const span = Math.min(Math.max(parseInt(pageSpec.charts[i].layout?.span, 10) || 1, 1), columns);
    return `<div class="kc-page-cell"${span > 1 ? ` style="grid-column: span ${span}"` : ''}>\n      ${c.domFragment}\n    </div>`;
  });
  const title = layout.title || 'kit-charts';
  const header = `<header class="kc-page-header">
      ${layout.title ? `<h1 class="kc-page-title">${escapeHtml(layout.title)}</h1>` : ''}
      ${layout.subtitle ? `<p class="kc-page-subtitle">${escapeHtml(layout.subtitle)}</p>` : ''}
    </header>`;
  const footer = layout.footnote ? `<p class="kc-page-footnote">${escapeHtml(layout.footnote)}</p>` : '';
  const bodyHtml = `<div class="kc-page" data-kc-page="${charts.length}">
    ${header}
    <div class="kc-page-grid" style="--kc-cols: ${columns}">
    ${cells.join('\n    ')}
    </div>
    ${footer}
  </div>`;
  const extraCss = `
    .kc-page { display: flex; flex-direction: column; gap: 1.5rem; }
    .kc-page-title { font-size: 1.6rem; font-weight: 700; line-height: 1.25; color: var(--kc-text-primary); }
    .kc-page-subtitle { margin-top: 0.35rem; font-size: 1rem; color: var(--kc-text-secondary); }
    .kc-page-footnote { font-size: 0.8rem; color: var(--kc-text-muted); }
    .kc-page-grid { display: grid; grid-template-columns: repeat(var(--kc-cols), minmax(0, 1fr)); gap: 1.25rem; align-items: start; }
    .kc-page-cell { min-width: 0; }
    @media (max-width: 760px) {
      .kc-page-grid { grid-template-columns: minmax(0, 1fr); }
      .kc-page-cell { grid-column: auto !important; }
    }`;

  const fullHtml = assemblePage({
    title,
    tokens,
    charts,
    bodyHtml,
    offline: options.offline,
    maxWidth: columns === 1 ? 900 : columns === 2 ? 1240 : 1440,
    extraCss
  });

  const finalOutputPath = options.output ? writeOutput(options.output, fullHtml, pageSpec) : options.output;
  return {
    success: true,
    html: fullHtml,
    outputPath: finalOutputPath,
    templateId: charts.map(c => c.templateId).join(', '),
    templateIds: charts.map(c => c.templateId),
    themeName,
    validationReport,
    stats: {
      htmlLength: fullHtml.length,
      charts: charts.length,
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
    } else if (arg === '--offline') {
      parsed.options.offline = true;
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
  --offline               Inclut Chart.js et ses plugins dans la page (copies locales vérifiées) : s'ouvre sans réseau
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
  applyFocus,
  applyMetricPolarity,
  compileChart,
  compilePage,
  validatePageSpec,
  prepareChart,
  loadRegistry,
  loadThemeModule
};
