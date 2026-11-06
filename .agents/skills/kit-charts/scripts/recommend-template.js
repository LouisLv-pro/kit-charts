/**
 * @file .agents/skills/kit-charts/scripts/recommend-template.js
 * @description Recommandation déterministe de templates à partir du profil des données.
 * Lit registry.json (dataRequirements) et applique les règles cognitives du kit
 * (N <= 7 en colonnes, <= 5 séries, parts < 3 %, libellés longs) pour classer les
 * candidats d'une intention analytique. Ne remplace pas le jugement : il borne le choix.
 * @license MIT
 */

const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.join(__dirname, '..', 'registry.json');
const { findModeGap } = require(path.join(__dirname, '..', '..', '..', '..', 'themes', 'stat-helpers.js'));
// Sous ce nombre d'observations par groupe, chaque point reste visible (box-strip-plot).
const FEW_SAMPLES = 30;

// Intention analytique -> templates par ordre de préférence par défaut
// (ordre issu de references/decision-matrix.md).
const INTENT_ORDER = {
  kpi: ['kpi-standard', 'kpi-sparkline', 'kpi-comparative', 'kpi-bullet', 'kpi-status-alert', 'kpi-distribution', 'kpi-composite'],
  comparison: ['bar-chart-vertical', 'bar-chart-horizontal', 'grouped-bar-chart', 'stacked-bar-chart', 'bullet-chart', 'bar-target-overlay', 'lollipop-chart', 'dumbbell-chart', 'slope-chart', 'radar-chart', 'polar-area-chart'],
  composition: ['stacked-bar-100', 'doughnut-chart', 'pie-chart', 'waffle-chart', 'treemap', 'sunburst', 'pareto-chart', 'stacked-total-line'],
  distribution: ['box-plot', 'histogramme', 'box-strip-plot', 'strip-plot', 'violin-plot', 'raincloud-plot', 'beeswarm-plot', 'density-plot', 'histogramme-kde', 'distribution-heatmap'],
  correlation: ['scatter-plot', 'scatter-regression', 'bubble-chart', 'matrix-heatmap', 'connected-scatter-plot', 'joint-scatter-marginals', 'density-2d-hexbin'],
  evolution: ['line-chart', 'multi-line-chart', 'area-chart', 'stacked-area-chart', 'sparkline', 'dual-axis-controlled', 'candlestick-ohlc', 'candlestick-volume', 'price-indicator-overlays', 'streamgraph'],
  flow: ['funnel-chart', 'waterfall-chart', 'sankey-diagram', 'waterfall-cumulative-line', 'alluvial-diagram', 'chord-diagram', 'gantt-progress'],
  hierarchy: ['treemap', 'sunburst', 'dendrogram', 'node-link-network', 'arc-diagram', 'marimekko-chart'],
  geo: ['choropleth-map', 'bubble-map', 'cartogram-tilegram'],
  table: ['table-kpi-scorecard', 'table-bar-in-cell', 'table-ranking-leaderboard', 'table-heatmap-matrix', 'table-financial-variance', 'table-hierarchical-tree']
};

const INTENTS = Object.keys(INTENT_ORDER);

// Seuils du tier cognitif (alignés sur validate-chart.js).
const MAX_VERTICAL_BARS = 7;
const MAX_LINE_SERIES = 5;
const MAX_PIE_SLICES = 7;
const LONG_LABEL_CHARS = 12;
const MIN_SHARE_PCT = 3;

// Templates qui n'ont de sens qu'avec au moins 2 séries (réalisé + cible, avant + après, sous-groupes).
const MIN_SERIES = {
  'grouped-bar-chart': 2, 'stacked-bar-chart': 2, 'bullet-chart': 2, 'bar-target-overlay': 2,
  'dumbbell-chart': 2, 'slope-chart': 2, 'multi-line-chart': 2, 'stacked-area-chart': 2,
  'streamgraph': 2, 'dual-axis-controlled': 2
};

const MONTHS = /^(jan|fev|fév|feb|mar|avr|apr|mai|may|juin|jun|juil|jul|aou|aoû|aug|sep|oct|nov|dec|déc)[a-zéû]*\.?(\s*\d{2,4})?$/i;
const TEMPORAL = [
  /^\d{4}$/,                        // 2024
  /^\d{4}[-/]\d{1,2}([-/]\d{1,2})?/, // 2024-03, 2024-03-15
  /^\d{1,2}[-/]\d{1,2}[-/]\d{2,4}$/, // 15/03/2024
  /^(t|q|s|h)[1-4](\s*\d{2,4})?$/i, // T1, Q3 2024, S2
  /^(\d{4}\s*)?(t|q|s|h)[1-4]$/i,   // 2024 Q1
  /^(w|s|sem\.?\s*)\d{1,2}$/i,      // W12, S12
  /^m\s*-?\s*\d{1,2}$/i,            // M-1, M12
  MONTHS
];

function loadRegistry() {
  return JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
}

function isTemporalLabel(label) {
  const s = String(label).trim();
  return TEMPORAL.some(re => re.test(s));
}

/**
 * Profile un objet formattedData (ou une spec complète qui le contient).
 * @param {Object} input - formattedData ou spec dataviz
 * @returns {Object} profil { categoryCount, seriesCount, maxLabelLength, labelsType, ... }
 */
function profileData(input) {
  const data = (input && (input.formattedData || input.data)) || input || {};
  const labels = Array.isArray(data.labels) ? data.labels : [];
  const datasets = Array.isArray(data.datasets) ? data.datasets : [];
  const seriesCount = datasets.length;
  const pointCounts = datasets.map(ds => (Array.isArray(ds.data) ? ds.data.length : 0));
  const categoryCount = Math.max(labels.length, ...pointCounts, 0);
  const maxLabelLength = labels.reduce((m, l) => Math.max(m, String(l).length), 0);

  const numbers = [];
  datasets.forEach(ds => (ds.data || []).forEach(v => { if (typeof v === 'number' && Number.isFinite(v)) numbers.push(v); }));
  const hasNegative = numbers.some(v => v < 0);
  const hasXY = datasets.some(ds => (ds.data || []).some(v => v && typeof v === 'object' && 'x' in v && 'y' in v));

  let labelsType = 'categorical';
  if (typeof data.value === 'number' && labels.length === 0) labelsType = 'none';
  else if (hasXY) labelsType = 'continuous';
  else if (labels.length >= 3 && labels.filter(isTemporalLabel).length / labels.length >= 0.8) labelsType = 'temporal';

  // Parts d'un tout : une seule série positive dont la somme vaut 100 (ou 1).
  let sumsTo100 = false;
  let minSharePct = null;
  if (seriesCount === 1 && numbers.length >= 2 && !hasNegative) {
    const sum = numbers.reduce((a, b) => a + b, 0);
    sumsTo100 = Math.abs(sum - 100) <= 1 || Math.abs(sum - 1) <= 0.01;
    if (sum > 0) minSharePct = (Math.min(...numbers) / sum) * 100;
  }

  const hasTargetSeries = datasets.some(ds => /cible|target|objectif|budget|goal|quota/i.test(String(ds.label || '')));

  const profile = { categoryCount, seriesCount, maxLabelLength, labelsType, hasNegative, sumsTo100, minSharePct, hasTargetSeries };
  // Observations brutes (un tableau de valeurs par groupe) : taille et forme des groupes.
  const groups = datasets.length === 1 && Array.isArray(datasets[0].data) && datasets[0].data.length > 0 && datasets[0].data.every(Array.isArray)
    ? datasets[0].data : null;
  if (groups) {
    profile.maxGroupSize = Math.max(...groups.map(g => g.length));
    profile.multimodalGroups = groups.map((g, i) => (findModeGap(g) ? String(labels[i] ?? `Groupe ${i + 1}`) : null)).filter(Boolean);
  }
  return profile;
}

function inferIntent(profile) {
  if (profile.labelsType === 'none') return 'kpi';
  if (profile.labelsType === 'temporal') return 'evolution';
  if (profile.labelsType === 'continuous') return 'correlation';
  if (profile.sumsTo100) return 'composition';
  return 'comparison';
}

/**
 * Classe les templates d'une intention pour un profil donné.
 * @param {Object} profile - sortie de profileData (champs surchargeables)
 * @param {Object} [opts] - { intent }
 * @returns {Object} { intent, intentSource, profile, recommended, eligible, rejected, warnings }
 */
function recommendTemplates(profile, opts = {}) {
  const registry = loadRegistry();
  const byId = new Map(registry.templates.map(t => [t.id, t]));
  const intentSource = opts.intent ? 'explicit' : 'inferred';
  const intent = opts.intent || inferIntent(profile);
  if (!INTENT_ORDER[intent]) {
    throw new Error(`Intention inconnue "${intent}". Valeurs : ${INTENTS.join(', ')}.`);
  }

  const N = profile.categoryCount || 0;
  const K = profile.seriesCount || 0;
  const longLabels = (profile.maxLabelLength || 0) > LONG_LABEL_CHARS;
  const warnings = [];
  const order = INTENT_ORDER[intent].filter(id => byId.has(id));
  const scored = [];
  const rejected = [];

  order.forEach((id, index) => {
    const meta = byId.get(id);
    const req = meta.dataRequirements || {};
    const reasons = [];
    const blockers = [];
    let score = 100 - index * 5;

    // Contraintes de cardinalité du registre (N et K mesurables seulement).
    if (N > 0 && typeof req.minCategories === 'number' && N < req.minCategories) blockers.push(`N=${N} < minimum ${req.minCategories}`);
    if (N > 0 && typeof req.maxCategories === 'number' && N > req.maxCategories) blockers.push(`N=${N} > maximum ${req.maxCategories}`);
    const seriesCap = id === 'multi-line-chart' ? MAX_LINE_SERIES : req.seriesCount;
    if (K > 0 && typeof seriesCap === 'number' && K > seriesCap) blockers.push(`${K} séries > maximum ${seriesCap}`);
    if (K > 0 && MIN_SERIES[id] && K < MIN_SERIES[id]) blockers.push(`${K} série(s) < minimum ${MIN_SERIES[id]} (cible, référence ou sous-groupes requis)`);

    // Règles cognitives spécifiques.
    if (id === 'bar-chart-vertical') {
      if (N > MAX_VERTICAL_BARS) blockers.push(`N=${N} > ${MAX_VERTICAL_BARS} (VERTICAL_BAR_MAX_CATEGORIES)`);
      if (longLabels) blockers.push(`libellés de ${profile.maxLabelLength} caractères > ${LONG_LABEL_CHARS} : collisions sur l'axe X`);
      if (K > 1) blockers.push('plusieurs séries : utiliser grouped-bar-chart');
    }
    if (id === 'bar-chart-horizontal') {
      if (N > MAX_VERTICAL_BARS || longLabels) { score += 40; reasons.push('N > 7 ou libellés longs : lecture gauche-droite sans collision'); }
      if (K > 1) blockers.push('plusieurs séries : utiliser grouped-bar-chart');
    }
    if (profile.hasTargetSeries && (id === 'bar-target-overlay' || id === 'bullet-chart')) {
      score += id === 'bar-target-overlay' ? 45 : 35;
      reasons.push('série cible détectée : réalisé vs objectif (Stephen Few)');
    }
    if (id === 'grouped-bar-chart' && K >= 2 && !profile.hasTargetSeries) { score += 30; reasons.push(`${K} séries comparées par catégorie`); }
    if (id === 'stacked-bar-chart' && K >= 2) { score += 10; reasons.push('cumul et décomposition par catégorie'); }
    if (id === 'line-chart' && K > 1) blockers.push('plusieurs séries : utiliser multi-line-chart');
    if (id === 'multi-line-chart') {
      if (K >= 2) { score += 30; reasons.push(`${K} séries temporelles (plafond ${MAX_LINE_SERIES})`); }
    }
    if (id === 'area-chart' && profile.hasNegative) blockers.push('valeurs négatives : une aire suppose une masse >= 0');
    if (id === 'stacked-area-chart' && profile.hasNegative) blockers.push('valeurs négatives incompatibles avec un empilement');
    if (intent === 'composition') {
      if (id === 'stacked-bar-100' && K <= 1) { score -= 30; reasons.push('une seule série : un 100 % empilé ne compare rien'); }
      if (id === 'stacked-bar-100' && K > 1) { score += 30; reasons.push('compare la composition entre plusieurs groupes'); }
      if ((id === 'pie-chart' || id === 'doughnut-chart') && N > MAX_PIE_SLICES) blockers.push(`N=${N} tranches > ${MAX_PIE_SLICES} (PIE_DONUT_MAX_SLICES)`);
      if ((id === 'pie-chart' || id === 'doughnut-chart' || id === 'waffle-chart') && K > 1) blockers.push('plusieurs séries : un disque ne montre qu\'un seul tout');
      if (profile.hasNegative && ['pie-chart', 'doughnut-chart', 'waffle-chart', 'treemap', 'stacked-bar-100'].includes(id)) blockers.push('valeurs négatives : pas une partition d\'un tout');
    }

    if (intent === 'distribution' && Array.isArray(profile.multimodalGroups)) {
      const twoPeaks = profile.multimodalGroups;
      if (id === 'violin-plot' && twoPeaks.length) { score += 40; reasons.push(`deux paquets dans ${twoPeaks.join(', ')} : la forme du violon les montre, une boîte les cache`); }
      if (id === 'box-strip-plot' && !twoPeaks.length && profile.maxGroupSize < FEW_SAMPLES) { score += 20; reasons.push(`moins de ${FEW_SAMPLES} observations par groupe : chaque point reste visible`); }
    }
    if (meta.supportedFeatures && meta.supportedFeatures.semanticValence) reasons.push('gère la polarité métier');

    const entry = { id, family: meta.family, name: meta.name, score, reasons };
    if (blockers.length) rejected.push({ id, family: meta.family, reasons: blockers });
    else scored.push(entry);
  });

  // Repli hors famille : composition trop fragmentée -> barres horizontales triées.
  if (intent === 'composition' && N > MAX_PIE_SLICES && K <= 1) {
    const meta = byId.get('bar-chart-horizontal');
    if (meta) scored.push({ id: meta.id, family: meta.family, name: meta.name, score: 120, reasons: [`N=${N} parts : barres horizontales triées plus précises qu'un disque (Cleveland-McGill)`] });
  }

  if (intent === 'composition' && profile.minSharePct !== null && profile.minSharePct < MIN_SHARE_PCT) {
    warnings.push(`Plus petite part = ${profile.minSharePct.toFixed(1)} % < ${MIN_SHARE_PCT} % : regrouper les petites parts dans "Autres".`);
  }
  if (intent === 'evolution' && K > MAX_LINE_SERIES) {
    warnings.push(`${K} séries > ${MAX_LINE_SERIES} : garder le top 4 + "Autres", ou plusieurs line-chart en petits multiples.`);
  }
  if (intent === 'comparison' && profile.labelsType === 'temporal') {
    warnings.push('Libellés temporels détectés : envisager l\'intention "evolution" (line-chart).');
  }
  if (intentSource === 'inferred') {
    warnings.push(`Intention déduite des données ("${intent}") : la confirmer avec la question métier.`);
  }

  scored.sort((a, b) => b.score - a.score);
  return {
    intent,
    intentSource,
    profile,
    recommended: scored[0] || null,
    eligible: scored.slice(1),
    rejected,
    warnings
  };
}

function parseArgs(argv) {
  const out = { overrides: {} };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--data' || a === '-d') out.data = argv[++i];
    else if (a === '--intent' || a === '-i') out.intent = argv[++i];
    else if (a === '--n') out.overrides.categoryCount = Number(argv[++i]);
    else if (a === '--series') out.overrides.seriesCount = Number(argv[++i]);
    else if (a === '--labels-type') out.overrides.labelsType = argv[++i];
    else if (a === '--max-label-length') out.overrides.maxLabelLength = Number(argv[++i]);
    else if (a === '--json') out.json = true;
    else if (a === '--help' || a === '-h') out.help = true;
    else if (!a.startsWith('-') && !out.data) out.data = a;
  }
  return out;
}

function readData(arg) {
  const t = String(arg).trim();
  if (t.startsWith('{') || t.startsWith('[')) return JSON.parse(t);
  return JSON.parse(fs.readFileSync(path.resolve(process.cwd(), t), 'utf8'));
}

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || (!args.data && Object.keys(args.overrides).length === 0)) {
    console.log(`
Recommandation de template kit-charts (recommend-template.js)

Usage:
  node recommend-template.js <data.json | spec.json | '{"labels":[...],"datasets":[...]}'> [options]
  node recommend-template.js --intent comparison --n 9 --series 1 [options]

Options:
  --intent, -i <intent>     ${INTENTS.join(' | ')} (déduite des données sinon)
  --n <entier>              Nombre de catégories ou de points (surcharge le profil)
  --series <entier>         Nombre de séries (surcharge le profil)
  --labels-type <type>      categorical | temporal | continuous | none
  --max-label-length <n>    Longueur du plus long libellé
  --json                    Sortie JSON pour agent
`);
    process.exit(args.help ? 0 : 1);
  }

  try {
    const base = args.data ? profileData(readData(args.data)) : {
      categoryCount: 0, seriesCount: 0, maxLabelLength: 0, labelsType: 'categorical',
      hasNegative: false, sumsTo100: false, minSharePct: null, hasTargetSeries: false
    };
    const profile = Object.assign(base, args.overrides);
    const result = recommendTemplates(profile, { intent: args.intent });

    if (args.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      const p = result.profile;
      console.log(`Intention : ${result.intent} (${result.intentSource === 'explicit' ? 'explicite' : 'déduite'})`);
      console.log(`Profil    : N=${p.categoryCount}, séries=${p.seriesCount}, libellé max=${p.maxLabelLength} car., type=${p.labelsType}${p.hasNegative ? ', valeurs négatives' : ''}${p.sumsTo100 ? ', somme = 100 %' : ''}`);
      if (result.recommended) {
        console.log(`\nRecommandé : ${result.recommended.id}${result.recommended.reasons.length ? `  (${result.recommended.reasons.join(' ; ')})` : ''}`);
      } else {
        console.log('\nAucun template éligible : revoir l\'intention ou agréger les données.');
      }
      if (result.eligible.length) console.log(`Alternatives : ${result.eligible.slice(0, 4).map(c => c.id).join(', ')}`);
      if (result.rejected.length) {
        console.log('\nÉcartés :');
        result.rejected.forEach(r => console.log(`  - ${r.id} : ${r.reasons.join(' ; ')}`));
      }
      if (result.warnings.length) {
        console.log('\nPoints d\'attention :');
        result.warnings.forEach(w => console.log(`  - ${w}`));
      }
    }
    process.exit(result.recommended ? 0 : 1);
  } catch (err) {
    console.error(`Erreur : ${err.message}`);
    process.exit(1);
  }
}

module.exports = { profileData, recommendTemplates, inferIntent, isTemporalLabel, INTENTS, INTENT_ORDER };
