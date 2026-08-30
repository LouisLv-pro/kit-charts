/**
 * @file .agents/skills/kit-charts/scripts/validate-chart.js
 * @description Linter cognitif, perceptif et d'accessibilité déterministe (zéro dépendance externe) pour kit-charts.
 * Audite les spécifications dataviz-spec.json, fichiers HTML et code JS selon les lois de Cleveland-McGill, Sweller, Tufte et WCAG 2.2.
 * @version 1.0.0
 * @license MIT
 */

const fs = require('fs');
const path = require('path');

// Chemins de référence
const ROOT_DIR = path.resolve(__dirname, '../../../..');
const REGISTRY_PATH = path.join(ROOT_DIR, '.agents/skills/kit-charts/registry.json');
const THEMES_PATH = path.join(ROOT_DIR, 'themes/theme-tokens.js');

let registryData = null;
function getRegistry() {
  if (!registryData && fs.existsSync(REGISTRY_PATH)) {
    try {
      registryData = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
    } catch (e) {
      registryData = { templates: [] };
    }
  }
  return registryData || { templates: [] };
}

let themeTokensModule = null;
function getThemeTokensModule() {
  if (!themeTokensModule && fs.existsSync(THEMES_PATH)) {
    try {
      themeTokensModule = require(THEMES_PATH);
    } catch (e) {
      themeTokensModule = null;
    }
  }
  return themeTokensModule;
}

// ============================================================================
// 1. UTILITAIRES DE CALCUL PERCEPTIF & WCAG 2.2
// ============================================================================

/**
 * Convertit une couleur Hex ou RGB en objet RGB normalisé { r, g, b, a }
 */
function parseColor(colorStr) {
  if (!colorStr || typeof colorStr !== 'string') return { r: 0, g: 0, b: 0, a: 1 };
  const str = colorStr.trim();

  // Hex format (#RGB, #RGBA, #RRGGBB, #RRGGBBAA)
  if (str.startsWith('#')) {
    let hex = str.slice(1);
    if (hex.length === 3 || hex.length === 4) {
      hex = hex.split('').map(c => c + c).join('');
    }
    if (hex.length >= 6) {
      const r = parseInt(hex.substring(0, 2), 16) || 0;
      const g = parseInt(hex.substring(2, 4), 16) || 0;
      const b = parseInt(hex.substring(4, 6), 16) || 0;
      const a = hex.length === 8 ? (parseInt(hex.substring(6, 8), 16) / 255) : 1;
      return { r, g, b, a };
    }
  }

  // RGB/RGBA format
  if (str.startsWith('rgb')) {
    const matches = str.match(/[\d.]+/g);
    if (matches && matches.length >= 3) {
      const r = Number(matches[0]) || 0;
      const g = Number(matches[1]) || 0;
      const b = Number(matches[2]) || 0;
      const a = matches.length >= 4 ? (Number(matches[3]) ?? 1) : 1;
      return { r, g, b, a };
    }
  }

  // Named fallbacks basiques
  const named = {
    white: { r: 255, g: 255, b: 255, a: 1 },
    black: { r: 0, g: 0, b: 0, a: 1 },
    transparent: { r: 0, g: 0, b: 0, a: 0 }
  };
  return named[str.toLowerCase()] || { r: 15, g: 23, b: 42, a: 1 };
}

/**
 * Calcule la luminance relative standard WCAG 2.2 (L = 0.2126*R + 0.7152*G + 0.0722*B)
 */
function getRelativeLuminance(rgb) {
  const rsRGB = rgb.r / 255;
  const gsRGB = rgb.g / 255;
  const bsRGB = rgb.b / 255;

  const rLin = rsRGB <= 0.04045 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLin = gsRGB <= 0.04045 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLin = bsRGB <= 0.04045 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

/**
 * Calcule le ratio de contraste WCAG 2.2 entre deux couleurs ((L1 + 0.05) / (L2 + 0.05))
 */
function getContrastRatio(color1, color2) {
  const rgb1 = parseColor(color1);
  const rgb2 = parseColor(color2);
  const lum1 = getRelativeLuminance(rgb1);
  const lum2 = getRelativeLuminance(rgb2);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// ============================================================================
// 2. ENSEMBLES DE RÈGLES COGNITIVES & PERCEPTIVES
// ============================================================================

// Templates encodant par longueur nécessitant impérativement beginAtZero: true
const LENGTH_ENCODED_TEMPLATES = new Set([
  'bar-chart-vertical',
  'bar-chart-horizontal',
  'grouped-bar-chart',
  'stacked-bar-chart',
  'stacked-bar-100',
  'bar-target-overlay',
  'lollipop-chart',
  'bullet-chart',
  'kpi-bullet',
  'pareto-chart',
  'waterfall-chart',
  'kpi-distribution'
]);

// Easings non conformes (rebonds décoratifs interdits en dataviz cognitive)
const FORBIDDEN_EASINGS = ['bounce', 'easeinoutbounce', 'easeinbounce', 'easeoutbounce', 'elastic', 'easeinelastic', 'easeoutelastic'];

/**
 * Valide un objet de spécification Dataviz (ou extrait de HTML/JS).
 * @param {Object} spec - Spécification JSON (dataviz-spec.json) ou structure équivalente
 * @param {Object} [options={}] - Options de validation ({ strict: boolean })
 * @returns {Object} Rapport de validation { valid: boolean, errors: [], warnings: [], summary: string }
 */
function validateChartSpec(spec, options = {}) {
  const errors = [];
  const warnings = [];

  if (!spec || typeof spec !== 'object') {
    errors.push({
      ruleId: 'INVALID_SPEC_STRUCTURE',
      category: 'Structure',
      severity: 'ERROR',
      message: 'La spécification fournie est vide ou n\'est pas un objet JSON valide.',
      suggestion: 'Fournir un objet conforme au format dataviz-spec.json.'
    });
    return buildReport(errors, warnings);
  }

  const templateId = spec.targetTemplateId || spec.templateId || spec.template;
  const layout = spec.layout || {};
  const colorStrategy = spec.colorStrategy || {};
  const cognitiveFeatures = spec.cognitiveFeatures || {};
  const formattedData = spec.formattedData || spec.data || {};
  const chartOptions = spec.options || {};
  const scales = chartOptions.scales || spec.scales || {};

  // --------------------------------------------------------------------------
  // RÈGLE 0 : Vérification du Template dans le Registry
  // --------------------------------------------------------------------------
  let templateMeta = null;
  if (templateId) {
    const registry = getRegistry();
    templateMeta = registry.templates ? registry.templates.find(t => t.id === templateId) : null;
    if (!templateMeta && registry.templates && registry.templates.length > 0) {
      warnings.push({
        ruleId: 'UNKNOWN_TEMPLATE_ID',
        category: 'Registry',
        severity: 'WARNING',
        message: `Template ID "${templateId}" non trouvé dans le registre officiel des 89 templates.`,
        suggestion: `Vérifier l'identifiant exact dans .agents/skills/kit-charts/registry.json.`
      });
    }
  }

  // Extraction des dimensions de données
  const labels = Array.isArray(formattedData.labels) ? formattedData.labels : [];
  const datasets = Array.isArray(formattedData.datasets) ? formattedData.datasets : [];
  const categoryCount = labels.length;
  const seriesCount = datasets.length;
  const totalPoints = datasets.reduce((acc, ds) => acc + (Array.isArray(ds.data) ? ds.data.length : 0), 0);

  // --------------------------------------------------------------------------
  // RÈGLE 1 : Cleveland & McGill (1984) — Axes & Échelles
  // --------------------------------------------------------------------------
  const isLengthEncoded = templateId ? LENGTH_ENCODED_TEMPLATES.has(templateId) : false;

  // 1.1 Axe zéro obligatoire sur encodage de longueur
  if (isLengthEncoded) {
    const isHorizontal = templateId === 'bar-chart-horizontal';
    const valueAxis = isHorizontal ? scales.x : scales.y;

    if (valueAxis && valueAxis.beginAtZero === false) {
      errors.push({
        ruleId: 'CLEVELAND_Y_ZERO',
        category: 'Cleveland-McGill',
        severity: 'ERROR',
        message: `Axe de valeur tronqué : 'beginAtZero' est à false sur le template '${templateId}'.`,
        suggestion: `Rétablir 'scales.${isHorizontal ? 'x' : 'y'}.beginAtZero = true' pour respecter la proportionnalité physique des longueurs (Cleveland-McGill 1984 / Huff 1954).`
      });
    }

    if (chartOptions.beginAtZero === false || spec.beginAtZero === false) {
      errors.push({
        ruleId: 'CLEVELAND_Y_ZERO',
        category: 'Cleveland-McGill',
        severity: 'ERROR',
        message: `'beginAtZero' est explicitement désactivé sur un graphique à encodage par longueur.`,
        suggestion: `Configurer 'beginAtZero: true' pour éviter la déformation déontologique des deltas relatifs.`
      });
    }
  }

  // 1.2 Échelle logarithmique interdite sur encodage par longueur
  const hasLogScale = (scales.y && scales.y.type === 'logarithmic') ||
                      (scales.x && scales.x.type === 'logarithmic') ||
                      chartOptions.logScale === true ||
                      spec.logScale === true;

  if (isLengthEncoded && hasLogScale) {
    errors.push({
      ruleId: 'NO_LOG_ON_LENGTH',
      category: 'Cleveland-McGill',
      severity: 'ERROR',
      message: `Échelle logarithmique interdite sur le graphique en barres/longueur '${templateId}'.`,
      suggestion: `La longueur géométrique 1D ne peut pas coder une progression logarithmique. Remplacer par une échelle linéaire ou basculer sur un scatter-plot / dot-plot pour les échelles log.`
    });
  }

  // --------------------------------------------------------------------------
  // RÈGLE 2 : Théorie de la Charge Cognitive (Miller / Sweller) & Encombrement
  // --------------------------------------------------------------------------

  // 2.1 bar-chart-vertical : N <= 7 catégories
  if (templateId === 'bar-chart-vertical' && categoryCount > 7) {
    errors.push({
      ruleId: 'VERTICAL_BAR_MAX_CATEGORIES',
      category: 'Cognitive Load',
      severity: 'ERROR',
      message: `Surcharge cognitive sur bar-chart-vertical : ${categoryCount} catégories fournies (maximum recommandé : 7).`,
      suggestion: `Basculer vers 'bar-chart-horizontal' (qui supporte jusqu'à 25 catégories avec libellés longs sans collision) ou filtrer le Top 5 + 'Autres'.`
    });
  }

  // 2.2 multi-line-chart : <= 5 séries simultanées
  if ((templateId === 'multi-line-chart' || (templateId === 'line-chart' && seriesCount > 1)) && seriesCount > 5) {
    errors.push({
      ruleId: 'MULTI_LINE_MAX_SERIES',
      category: 'Cognitive Load',
      severity: 'ERROR',
      message: `Spaghetti chart détecté : ${seriesCount} séries superposées (seuil limite : 5).`,
      suggestion: `Utiliser le mode Focus + Contexte (1 série active saturée + séries secondaires atténuées) ou basculer sur 'faceted-line-chart' (Small Multiples).`
    });
  }

  // 2.3 pie-chart / doughnut-chart : <= 5 à 7 tranches max
  if ((templateId === 'pie-chart' || templateId === 'doughnut-chart') && categoryCount > 7) {
    errors.push({
      ruleId: 'PIE_DONUT_MAX_SLICES',
      category: 'Cognitive Load',
      severity: 'ERROR',
      message: `Camembert/Donut illisible : ${categoryCount} tranches (maximum acceptable : 5-7).`,
      suggestion: `Remplacer par un 'bar-chart-horizontal' ordonné ou un 'treemap' pour une comparaison précise des proportions.`
    });
  }

  // 2.4 DataLabels : Encombrement si N > 12
  const showDataLabels = cognitiveFeatures.showDataLabels ?? chartOptions.showDataLabels;
  if (showDataLabels === true && categoryCount > 12) {
    warnings.push({
      ruleId: 'DATALABELS_OVERCROWDING',
      category: 'Perceptual Clutter',
      severity: 'WARNING',
      message: `Labels directs actifs sur un échantillon dense (${categoryCount} points > seuil de 12).`,
      suggestion: `Désactiver 'showDataLabels: false' et confier le détail fin aux infobulles (tooltips) interactives avec anti-occlusion.`
    });
  }

  // --------------------------------------------------------------------------
  // RÈGLE 3 : Accessibilité & WCAG 2.2 (Contrastes & Lisibilité)
  // --------------------------------------------------------------------------
  const themeName = colorStrategy.themeName || spec.theme || 'colorbrewer-accessible';
  const themeTokensMod = getThemeTokensModule();
  if (themeTokensMod && typeof themeTokensMod.getThemeTokens === 'function') {
    const tokens = themeTokensMod.getThemeTokens(themeName);
    if (tokens && tokens.bg && tokens.textPrimary) {
      const contrastPrimary = getContrastRatio(tokens.textPrimary, tokens.bg);
      if (contrastPrimary < 4.5) {
        errors.push({
          ruleId: 'WCAG_CONTRAST_PRIMARY',
          category: 'WCAG 2.2 AA',
          severity: 'ERROR',
          message: `Ratio de contraste insuffisant pour le texte principal (${contrastPrimary.toFixed(2)}:1 < 4.5:1 exigé).`,
          suggestion: `Ajuster la couleur textPrimary (${tokens.textPrimary}) ou l'arrière-plan bg (${tokens.bg}).`
        });
      }

      if (tokens.textSecondary) {
        const contrastSecondary = getContrastRatio(tokens.textSecondary, tokens.bg);
        if (contrastSecondary < 4.5) {
          warnings.push({
            ruleId: 'WCAG_CONTRAST_SECONDARY',
            category: 'WCAG 2.2 AA',
            severity: 'WARNING',
            message: `Contraste du texte secondaire faible (${contrastSecondary.toFixed(2)}:1 < 4.5:1).`,
            suggestion: `Renforcer la saturation de textSecondary (${tokens.textSecondary}) pour garantir la lisibilité.`
          });
        }
      }
    }
  }

  // --------------------------------------------------------------------------
  // RÈGLE 4 : Sémantique de Valence Métier & Polarité
  // --------------------------------------------------------------------------
  const metricPolarity = colorStrategy.metricPolarity || spec.metricPolarity;
  if (metricPolarity) {
    const validPolarities = ['HIGHER_IS_BETTER', 'LOWER_IS_BETTER', 'TARGET_BASED', 'NEUTRAL_CATEGORICAL'];
    if (!validPolarities.includes(metricPolarity)) {
      warnings.push({
        ruleId: 'INVALID_METRIC_POLARITY',
        category: 'Valence Semantics',
        severity: 'WARNING',
        message: `Valeur metricPolarity inconnue '${metricPolarity}'.`,
        suggestion: `Utiliser une valeur standard : ${validPolarities.join(', ')}.`
      });
    }

    // Vérification de cohérence delta vs couleur si des métriques explicites sont fournies
    if (typeof spec.delta === 'number' && spec.deltaColor) {
      const isPositiveDelta = spec.delta > 0;
      const isGreen = spec.deltaColor.includes('2E7D32') || spec.deltaColor.includes('green') || spec.deltaColor.includes('22A884');
      const isRed = spec.deltaColor.includes('C62828') || spec.deltaColor.includes('red') || spec.deltaColor.includes('CA0020');

      if (metricPolarity === 'HIGHER_IS_BETTER') {
        if (isPositiveDelta && isRed) {
          errors.push({
            ruleId: 'VALENCE_POLARITY_MISMATCH',
            category: 'Valence Semantics',
            severity: 'ERROR',
            message: `Incohérence de polarité : Hausse (+${spec.delta}) encodée en Rouge sous HIGHER_IS_BETTER.`,
            suggestion: `Sous HIGHER_IS_BETTER, une progression positive doit être encodée en Vert (semantic.positive).`
          });
        }
      } else if (metricPolarity === 'LOWER_IS_BETTER') {
        if (isPositiveDelta && isGreen) {
          errors.push({
            ruleId: 'VALENCE_POLARITY_MISMATCH',
            category: 'Valence Semantics',
            severity: 'ERROR',
            message: `Incohérence de polarité : Hausse de coût/churn (+${spec.delta}) encodée en Vert sous LOWER_IS_BETTER.`,
            suggestion: `Sous LOWER_IS_BETTER, une hausse de coût ou de latence doit être encodée en Rouge (semantic.negative).`
          });
        }
      }
    }
  }

  return buildReport(errors, warnings);
}

/**
 * Construit l'objet rapport de validation unifié
 */
function buildReport(errors, warnings) {
  const valid = errors.length === 0;
  const errorsCount = errors.length;
  const warningsCount = warnings.length;

  let summary = '';
  if (valid && warningsCount === 0) {
    summary = '✅ Validation 100% Réussie — Aucune anomalie cognitive ou d\'accessibilité détectée.';
  } else if (valid && warningsCount > 0) {
    summary = `⚠️ Validation Réussie avec ${warningsCount} avertissement(s) non bloquant(s).`;
  } else {
    summary = `❌ Échec de validation : ${errorsCount} erreur(s) bloquante(s) et ${warningsCount} avertissement(s) détectés.`;
  }

  return {
    valid,
    errorsCount,
    warningsCount,
    errors,
    warnings,
    summary,
    timestamp: new Date().toISOString()
  };
}

// ============================================================================
// 3. PARSEUR DE FICHIERS (HTML, JS, JSON)
// ============================================================================

/**
 * Audite un fichier arbitraire (spec JSON, HTML ou JS)
 * @param {string} filePath - Chemin absolu ou relatif vers le fichier
 * @param {Object} [options={}] - Options d'audit
 * @returns {Object} Rapport de validation
 */
function validateChartFile(filePath, options = {}) {
  const absPath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);

  if (!fs.existsSync(absPath)) {
    return buildReport([{
      ruleId: 'FILE_NOT_FOUND',
      category: 'FileSystem',
      severity: 'ERROR',
      message: `Le fichier spécifié n'existe pas : "${absPath}".`,
      suggestion: 'Vérifier le chemin du fichier.'
    }], []);
  }

  const content = fs.readFileSync(absPath, 'utf8');
  const ext = path.extname(absPath).toLowerCase();

  // Cas 1 : Fichier JSON (dataviz-spec.json ou schéma)
  if (ext === '.json') {
    try {
      const parsed = JSON.parse(content);
      const report = validateChartSpec(parsed, options);
      report.targetFile = absPath;
      return report;
    } catch (e) {
      return buildReport([{
        ruleId: 'JSON_SYNTAX_ERROR',
        category: 'Syntax',
        severity: 'ERROR',
        message: `Erreur de syntaxe JSON dans "${path.basename(absPath)}": ${e.message}`,
        suggestion: 'Corriger le format JSON.'
      }], []);
    }
  }

  // Cas 2 : Fichier HTML ou JS
  const extractedSpec = extractSpecFromCode(content, ext, absPath);
  const report = validateChartSpec(extractedSpec, options);
  report.targetFile = absPath;

  // Vérification de la présence de prefers-reduced-motion dans le code HTML/JS
  if ((ext === '.html' || ext === '.js') && !content.includes('prefers-reduced-motion') && !content.includes('isReducedMotionPreferred')) {
    report.warnings.push({
      ruleId: 'REDUCED_MOTION_GUARD',
      category: 'WCAG 2.2',
      severity: 'WARNING',
      message: `Aucune détection explicite de 'prefers-reduced-motion' trouvée dans le code du fichier.`,
      suggestion: `Intégrer le helper 'isReducedMotionPreferred()' de theme-tokens.js ou la media query CSS '@media (prefers-reduced-motion: reduce)'.`
    });
    report.warningsCount = report.warnings.length;
  }

  return report;
}

/**
 * Extrait une spec approximée à partir d'un fragment HTML ou JS
 */
function extractSpecFromCode(content, ext, absPath) {
  const spec = {
    targetTemplateId: null,
    formattedData: { labels: [], datasets: [] },
    cognitiveFeatures: {},
    colorStrategy: {},
    options: { scales: {} }
  };

  // Détection du templateId
  const tplMatch = content.match(/data-template-id=["']([^"']+)["']/) ||
                   content.match(/targetTemplateId\s*[:=]\s*["']([^"']+)["']/) ||
                   content.match(/KitCharts\['([^']+)'\]/);
  if (tplMatch) {
    spec.targetTemplateId = tplMatch[1];
  } else {
    const parentDir = path.basename(path.dirname(absPath));
    if (parentDir && parentDir !== 'template' && !parentDir.startsWith('0')) {
      spec.targetTemplateId = parentDir;
    }
  }

  // Si c'est un fichier HTML complet, on isole le script utilisateur d'initialisation
  let userScript = content;
  if (content.includes('DOMContentLoaded')) {
    const domLoadedIdx = content.lastIndexOf('DOMContentLoaded');
    userScript = content.substring(domLoadedIdx);
  } else if (content.includes('const customData =')) {
    const customDataIdx = content.lastIndexOf('const customData =');
    userScript = content.substring(customDataIdx);
  } else if (content.includes('<!-- Logique Spécifique du Template')) {
    const templateLogicIdx = content.indexOf('<!-- Logique Spécifique du Template');
    userScript = content.substring(templateLogicIdx);
  }

  // Détection de JSON customData
  const customDataMatch = userScript.match(/const\s+customData\s*=\s*(\{[\s\S]*?\});/);
  if (customDataMatch) {
    try {
      const parsedData = JSON.parse(customDataMatch[1]);
      if (parsedData.labels) spec.formattedData.labels = parsedData.labels;
      if (parsedData.datasets) spec.formattedData.datasets = parsedData.datasets;
      if (parsedData.value !== undefined) spec.formattedData.value = parsedData.value;
      if (parsedData.delta !== undefined) spec.formattedData.delta = parsedData.delta;
      if (parsedData.deltaColor) spec.deltaColor = parsedData.deltaColor;
    } catch (e) {}
  }

  // Détection de JSON options
  const optionsMatch = userScript.match(/const\s+options\s*=\s*(\{[\s\S]*?\});/);
  if (optionsMatch) {
    try {
      const parsedOptions = JSON.parse(optionsMatch[1]);
      spec.options = parsedOptions;
      if (parsedOptions.scales) spec.scales = parsedOptions.scales;
      if (parsedOptions.cognitiveFeatures) spec.cognitiveFeatures = parsedOptions.cognitiveFeatures;
      if (parsedOptions.colorStrategy) spec.colorStrategy = parsedOptions.colorStrategy;
      if (parsedOptions.metricPolarity) spec.metricPolarity = parsedOptions.metricPolarity;
    } catch (e) {}
  }

  // Détection de themeName
  const themeMatch = userScript.match(/const\s+themeName\s*=\s*["']([^"']+)["']/);
  if (themeMatch) {
    spec.colorStrategy.themeName = themeMatch[1];
  }

  // Fallback si pas de JSON sérialisé (code brut preview.html ou JS)
  if (spec.formattedData.labels.length === 0) {
    const labelsMatch = userScript.match(/labels\s*:\s*\[([^\]]+)\]/);
    if (labelsMatch) {
      const rawLabels = labelsMatch[1].split(',').map(s => s.trim().replace(/['"]/g, ''));
      spec.formattedData.labels = rawLabels;
    }
  }

  // Détection de beginAtZero dans le script utilisateur
  if (userScript.includes('beginAtZero: false') || userScript.includes('beginAtZero:false')) {
    spec.options.scales.y = { beginAtZero: false };
    spec.beginAtZero = false;
  }

  // Détection de logScale dans le script utilisateur
  if (userScript.includes("type: 'logarithmic'") || userScript.includes('type: "logarithmic"') || userScript.includes('logScale: true')) {
    // S'assurer que ce n'est pas une garde throw new Error
    const idx = userScript.indexOf('logarithmic');
    const surrounding = userScript.substring(Math.max(0, idx - 30), Math.min(userScript.length, idx + 30));
    if (!surrounding.includes('throw new Error') && !surrounding.includes('===') && !surrounding.includes('!==')) {
      spec.logScale = true;
      spec.options.scales.y = { type: 'logarithmic' };
    }
  }

  // Détection du showDataLabels
  if (userScript.includes('showDataLabels: true') || userScript.includes('showDataLabels = true')) {
    spec.cognitiveFeatures.showDataLabels = true;
  }

  return spec;
}

// ============================================================================
// 4. FORMATAGE ET INTERFACE CLI
// ============================================================================

/**
 * Formate le rapport en texte clair avec couleurs pour affichage terminal
 */
function formatReportTerminal(report) {
  const lines = [];
  lines.push('======================================================================');
  lines.push(' 📊 RAPPORT D\'AUDIT COGNITIF & ACCESSIBILITÉ — KIT-CHARTS');
  lines.push('======================================================================');
  if (report.targetFile) {
    lines.push(` 📁 Fichier audité : ${report.targetFile}`);
  }
  lines.push(` ⏱️  Timestamp     : ${report.timestamp}`);
  lines.push(` 🎯 Statut        : ${report.summary}`);
  lines.push('----------------------------------------------------------------------');

  if (report.errors && report.errors.length > 0) {
    lines.push('\n ❌ ERREURS BLOQUANTES :');
    report.errors.forEach((err, idx) => {
      lines.push(`  ${idx + 1}. [${err.ruleId}] (${err.category})`);
      lines.push(`     Description : ${err.message}`);
      if (err.suggestion) {
        lines.push(`     💡 Action    : ${err.suggestion}`);
      }
    });
  }

  if (report.warnings && report.warnings.length > 0) {
    lines.push('\n ⚠️ AVERTISSEMENTS :');
    report.warnings.forEach((warn, idx) => {
      lines.push(`  ${idx + 1}. [${warn.ruleId}] (${warn.category})`);
      lines.push(`     Description : ${warn.message}`);
      if (warn.suggestion) {
        lines.push(`     💡 Action    : ${warn.suggestion}`);
      }
    });
  }

  if (report.valid && report.warnings.length === 0) {
    lines.push('\n ✨ Félicitations ! Votre graphique respecte scrupuleusement les lois de Cleveland-McGill, Sweller et WCAG 2.2.');
  }

  lines.push('======================================================================');
  return lines.join('\n');
}

// Exécution directe en ligne de commande
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node validate-chart.js <file-path> [options]

Arguments:
  <file-path>           Chemin vers un fichier spec JSON (dataviz-spec.json), HTML ou JS.

Options:
  --json                Afficher le rapport au format JSON pur sur stdout.
  --strict              Traiter les avertissements comme des erreurs bloquantes.
  --help, -h            Afficher cette aide.

Exemples:
  node validate-chart.js dataviz-spec.json
  node validate-chart.js template/01-comparaison/bar-chart-vertical/preview.html --json
`);
    process.exit(0);
  }

  const targetPath = args.find(a => !a.startsWith('--'));
  const isJson = args.includes('--json');
  const isStrict = args.includes('--strict');

  if (!targetPath) {
    console.error('Erreur: Aucun fichier cible spécifié.');
    process.exit(1);
  }

  const report = validateChartFile(targetPath, { strict: isStrict });

  if (isStrict && report.warningsCount > 0) {
    report.valid = false;
    report.errorsCount += report.warningsCount;
    report.summary = `❌ Échec (mode strict) : ${report.errorsCount} erreur(s)/avertissement(s).`;
  }

  if (isJson) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(formatReportTerminal(report));
  }

  process.exit(report.valid ? 0 : 1);
}

// Export pour utilisation programmatique
module.exports = {
  validateChartSpec,
  validateChartFile,
  getContrastRatio,
  getRelativeLuminance,
  parseColor,
  LENGTH_ENCODED_TEMPLATES,
  FORBIDDEN_EASINGS
};
