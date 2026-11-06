/**
 * @file .agents/skills/kit-charts/scripts/make-chart.js
 * @description Chaîne complète en un appel : données -> template recommandé -> spec -> page
 * compilée -> audit -> rendu réel -> export. Remplace la suite recommend, describe, init-spec,
 * édition de la spec, compile, validate et check (7 à 8 appels d'outil) par un seul, avec une
 * sortie de quelques lignes : c'est là que l'agent économise ses tokens.
 *
 *   make   : part des données (CSV, TSV, JSON en lignes, ou formattedData JSON).
 *   update : repart d'un dossier output/<slug>/ déjà produit (spec.json + make.json) et ne
 *            remplace que ce qui est donné (nouvelles données, titre...).
 * @license MIT
 */

'use strict';

const fs = require('fs');
const path = require('path');

const SCRIPTS = __dirname;
const ROOT_DIR = path.resolve(SCRIPTS, '../../../..');
const { compileChart, loadRegistry } = require('./compile-chart.js');
const { validateChartSpec, isOrdinalLabel } = require('./validate-chart.js');
const { profileData, recommendTemplates, INTENTS } = require('./recommend-template.js');
const { loadTableFile, parseTable, tableToFormattedData, shapeOfTemplate } = require('./table-import.js');
const { focusFromTitle, focusMode, isNoFocus } = require('./focus.js');

const POLARITIES = ['HIGHER_IS_BETTER', 'LOWER_IS_BETTER', 'TARGET_BASED', 'NEUTRAL_CATEGORICAL'];
const EXPORT_FORMATS = ['png', 'svg', 'pdf'];
const MAKE_META = 'make.json';

class MakeError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.details = details;
  }
}

function slugify(text) {
  return String(text || 'graphique')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    .split('-').slice(0, 6).join('-').slice(0, 48) || 'graphique';
}

/**
 * Charge la source de données : un tableau (CSV, TSV, JSON en lignes) ou un objet JSON.
 * @returns {{table?: Object, formattedData?: Object, spec?: Object}}
 */
function loadSource(source) {
  if (source === undefined || source === null) throw new MakeError('Données manquantes : un fichier CSV, TSV ou JSON.');
  if (typeof source === 'object') {
    if (Array.isArray(source)) return { table: parseTable(source) };
    return source.targetTemplateId ? { spec: source } : { formattedData: source.formattedData || source };
  }
  const text = String(source).trim();
  if (text.startsWith('{') || text.startsWith('[')) return loadSource(JSON.parse(text));
  const abs = path.resolve(process.cwd(), text);
  if (!fs.existsSync(abs)) throw new MakeError(`Fichier de données introuvable : ${text}`);
  if (/\.json$/i.test(abs)) {
    const table = loadTableFile(abs);
    return table ? { table } : loadSource(JSON.parse(fs.readFileSync(abs, 'utf8')));
  }
  return { table: loadTableFile(abs) };
}

function templateMeta(id) {
  const t = loadRegistry().templates.find(x => x.id === id);
  if (!t) throw new MakeError(`Template inconnu "${id}". Voir : kit-charts list`);
  return t;
}

function templateShape(id) {
  const t = templateMeta(id);
  return shapeOfTemplate(require(path.join(ROOT_DIR, t.paths.js)).DEFAULT_DATA, id);
}

/** formattedData pour un template donné, depuis la source chargée. */
function dataFor(loaded, templateId, mapping) {
  if (loaded.formattedData) return { formattedData: loaded.formattedData, mapping: null };
  const { shape, sizeKey, transposeWhenWide } = templateShape(templateId);
  if (shape === 'other') {
    throw new MakeError(`${templateId} n'attend pas un tableau catégories × séries : fournir formattedData en JSON.`, { hint: `kit-charts describe ${templateId}` });
  }
  // slope-chart : deux dates en colonnes, une ligne par élément -> transposé automatiquement.
  const m = Object.assign({}, mapping);
  if (transposeWhenWide && m.transpose === undefined) {
    const probe = tableToFormattedData(loaded.table, m, shape, sizeKey).formattedData;
    if (probe.datasets.length === 2 && probe.labels.length > 2) m.transpose = true;
  }
  return tableToFormattedData(loaded.table, m, shape, sizeKey);
}

/** Données de profilage pour le recommandeur, avant de connaître le template. */
function profileSource(loaded, mapping, intent) {
  if (loaded.formattedData) return profileData(loaded.formattedData);
  const wantsXY = mapping.x || mapping.y || intent === 'correlation';
  try {
    return profileData(tableToFormattedData(loaded.table, mapping, wantsXY ? 'xy' : 'labels-datasets').formattedData);
  } catch (err) {
    // Catégories répétées sans --series : des observations brutes (distribution).
    if (/en double/.test(err.message)) {
      const p = profileData(tableToFormattedData(loaded.table, mapping, 'samples').formattedData);
      return Object.assign(p, { rawSamples: true });
    }
    throw err;
  }
}

/** Nature des données chargées, pour écarter les templates qui ne savent pas les lire. */
function dataKind(loaded, mapping, profile) {
  if (loaded.formattedData) return 'formatted';
  if (mapping.x || mapping.y || profile.labelsType === 'continuous') return 'xy';
  if (profile.rawSamples) return 'samples';
  return 'labels-datasets';
}

function compatible(id, kind, mapping) {
  if (kind === 'formatted') return true;
  const { shape, sizeKey } = templateShape(id);
  if (kind === 'xy') return shape === 'xy' && (!mapping.r || Boolean(sizeKey));
  if (kind === 'samples') return shape === 'samples' || shape === 'box-stats';
  return shape === 'labels-datasets' || shape === 'waterfall' || shape === 'gantt';
}

function chooseTemplate(loaded, opts) {
  if (opts.template) {
    templateMeta(opts.template);
    return { id: opts.template, source: 'imposé', alternatives: [], rejected: [], warnings: [] };
  }
  if (opts.intent && !INTENTS.includes(opts.intent)) {
    throw new MakeError(`Intention inconnue "${opts.intent}". Valeurs : ${INTENTS.join(', ')}.`);
  }
  const mapping = opts.mapping || {};
  const profile = profileSource(loaded, mapping, opts.intent);
  const kind = dataKind(loaded, mapping, profile);
  const explicit = opts.intent || (profile.rawSamples ? 'distribution' : (kind === 'xy' ? 'correlation' : undefined));
  // Intention déduite sans candidat (ex. 3 mois : trop peu pour une courbe) : repli sur la comparaison.
  const attempts = explicit ? [explicit] : [undefined, 'comparison'];
  let rec = null;
  let pick = null;
  const shapeRejected = [];
  for (const intent of attempts) {
    rec = recommendTemplates(profile, { intent });
    const ranked = [rec.recommended, ...rec.eligible].filter(Boolean);
    pick = ranked.find(c => compatible(c.id, kind, mapping)) || null;
    ranked.filter(c => c !== pick && !compatible(c.id, kind, mapping)).forEach(c => shapeRejected.push(`${c.id} (forme de données différente)`));
    if (pick) break;
  }
  if (!pick) {
    // Tous écartés faute de points : agréger aggraverait le manque, on propose la comparaison.
    const minimums = rec.rejected.map(r => r.reasons.map(x => x.match(/^N=(\d+) < minimum (\d+)$/)).find(Boolean));
    const tooFew = minimums.length > 0 && minimums.every(Boolean);
    const hint = tooFew
      ? `Trop peu de données (${minimums[0][1]} points) : il en faut ${Math.min(...minimums.map(m => Number(m[2])))} au moins. Ajouter des observations, ou comparer les valeurs une à une (--intent comparison).`
      : 'Agréger les données (top N + « Autres »), changer d\'intention (--intent) ou imposer un template (--template).';
    throw new MakeError(`Aucun template éligible pour l'intention "${rec.intent}".`, {
      rejected: rec.rejected.map(r => `${r.id} (${r.reasons.join(' ; ')})`).concat(shapeRejected),
      hint
    });
  }
  const ranked = [rec.recommended, ...rec.eligible].filter(Boolean);
  return {
    id: pick.id,
    source: `recommandé, intention ${rec.intent}${rec.intentSource === 'inferred' ? ' déduite' : ''}`,
    reasons: pick.reasons,
    alternatives: ranked.filter(c => c !== pick && compatible(c.id, kind, mapping)).slice(0, 3).map(c => c.id),
    // Sortie courte : la première raison suffit à l'agent pour ne pas reprendre le template.
    rejected: rec.rejected.map(r => `${r.id} (${String(r.reasons[0] || '').split(' (')[0]})`),
    warnings: rec.warnings
  };
}

function resolveOutDir(out, title) {
  const target = out || path.join('output', slugify(title));
  const abs = path.resolve(process.cwd(), target);
  return /\.html?$/i.test(abs) ? path.dirname(abs) : abs;
}

function parseExports(value) {
  if (!value) return [];
  const list = (Array.isArray(value) ? value : String(value).split(',')).map(s => s.trim().toLowerCase()).filter(Boolean);
  const bad = list.filter(f => !EXPORT_FORMATS.includes(f));
  if (bad.length) throw new MakeError(`Format d'export inconnu : ${bad.join(', ')}. Valeurs : ${EXPORT_FORMATS.join(', ')}.`);
  return [...new Set(list)];
}

/**
 * Compile, vérifie le rendu et exporte. Partagé par make et update.
 * @returns {Promise<Object>} résultat compact
 */
async function buildFromSpec(spec, outDir, opts, choice, meta) {
  const report = validateChartSpec(spec);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'spec.json'), JSON.stringify(spec, null, 2) + '\n', 'utf8');
  fs.writeFileSync(path.join(outDir, MAKE_META), JSON.stringify(meta, null, 2) + '\n', 'utf8');

  const result = {
    ok: false,
    page: null,
    spec: path.join(outDir, 'spec.json'),
    template: spec.targetTemplateId,
    choice,
    errors: report.errors.map(e => ({ ruleId: e.ruleId, message: e.message, fix: e.suggestion })),
    warnings: report.warnings.map(w => ({ ruleId: w.ruleId, message: w.message, fix: w.suggestion })),
    render: null,
    exports: []
  };
  if (!report.valid) return result;

  const page = path.join(outDir, 'index.html');
  compileChart(spec, { strict: true, output: page, offline: Boolean(opts.offline) });
  result.page = page;

  if (opts.check === false && !opts.exports.length) {
    result.render = { status: 'skipped', reason: 'vérification désactivée (--no-check)' };
    result.ok = true;
    return result;
  }
  const { findChrome, checkPage } = require('./render-check.js');
  const chrome = findChrome();
  if (!chrome) {
    result.render = { status: 'unchecked', reason: 'Chrome introuvable (CHROME_PATH)' };
    if (opts.exports.length) result.exports.push({ format: opts.exports.join(','), error: 'export impossible sans Chrome' });
    result.ok = !opts.exports.length;
    return result;
  }
  if (opts.exports.length) {
    // L'export ouvre la page et lit son statut : il vaut contrôle de rendu.
    const { exportPage } = require('./export-chart.js');
    const ex = await exportPage(page, { formats: opts.exports, chrome, scale: opts.scale });
    result.render = { status: ex.status, reason: ex.reason || '' };
    result.exports = ex.files.map(f => ({ format: f.format, file: f.file, note: f.note }));
    if (ex.errors.length) ex.errors.forEach(e => result.exports.push({ format: e.format, error: e.message }));
  } else {
    const r = await checkPage(chrome, page);
    result.render = { status: r.status, reason: r.reason };
  }
  result.ok = result.render.status === 'ok' && !result.exports.some(e => e.error);
  return result;
}

/**
 * Cartes KPI et tableaux portent leur titre dans formattedData : il est repris de --title
 * (et --subtitle, --footnote) quand leur schéma l'exige ou l'accepte et que les données ne
 * le fournissent pas.
 */
function fillRequiredTexts(spec) {
  const fd = spec.formattedData;
  if (!fd || typeof fd !== 'object' || Array.isArray(fd)) return;
  const t = templateMeta(spec.targetTemplateId);
  const schema = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, t.paths.schema), 'utf8')).properties.formattedData || {};
  const props = schema.properties || {};
  const required = schema.required || [];
  [['title', spec.layout.title], ['subtitle', spec.layout.subtitle], ['footnote', spec.layout.footnote]].forEach(([k, v]) => {
    if (fd[k] === undefined && v && (required.includes(k) || (props[k] && /^kpi-|^table-/.test(t.id)))) fd[k] = v;
  });
}

/**
 * bar-chart-horizontal trie une série unique par valeur. Sur des libellés ordonnés (tranches
 * d'âge, échelle de satisfaction), l'ordre naturel prime : le tri est désactivé et signalé.
 */
function keepOrdinalOrder(spec, choice) {
  const fd = spec.formattedData || {};
  const ds = Array.isArray(fd.datasets) ? fd.datasets : [];
  const labels = Array.isArray(fd.labels) ? fd.labels : [];
  if (spec.targetTemplateId !== 'bar-chart-horizontal' || ds.length !== 1 || ds[0].sorted !== undefined || labels.length < 3) return;
  if (labels.filter(isOrdinalLabel).length / labels.length >= 0.5) {
    ds[0].sorted = false;
    choice.notes = (choice.notes || []).concat('libellés ordonnés : ordre d\'origine gardé (sorted: false)');
  }
}

/**
 * Mise en avant : imposée par --focus, retirée par --focus aucun, sinon déduite du titre quand
 * il cite exactement un libellé (« Lille passe de la 6e à la 1re place » -> Lille).
 * @param {Object} spec - spec en cours (cognitiveFeatures modifié)
 * @param {string|undefined} requested - valeur de --focus
 * @param {string|undefined} previousSource - 'titre' | 'imposé' | 'aucun' (update)
 * @returns {string|null} source retenue, pour make.json
 */
function resolveFocus(spec, choice, requested, previousSource) {
  const cf = spec.cognitiveFeatures = spec.cognitiveFeatures || {};
  if (requested !== undefined) {
    if (isNoFocus(requested)) { delete cf.focus; return 'aucun'; }
    cf.focus = String(requested);
    return 'imposé';
  }
  if (previousSource === 'imposé' || previousSource === 'aucun') return previousSource;
  // Spec écrite à la main (ou antérieure à make.json focusSource) : son choix est gardé.
  if (!previousSource && cf.focus !== undefined) return 'imposé';
  delete cf.focus;
  if (!focusMode(spec.targetTemplateId)) return null;
  const found = focusFromTitle(spec.layout.title, spec.formattedData, spec.targetTemplateId);
  if (!found) return null;
  cf.focus = found;
  choice.notes = (choice.notes || []).concat(`mise en avant « ${found} » (citée dans le titre ; --focus aucun pour l'enlever)`);
  return 'titre';
}

/**
 * kit-charts make <données> --title "..." --polarity X [options]
 * @param {Object} opts - { data, title, subtitle, footnote, polarity, theme, intent, template,
 *   mapping: {label, value, series, x, y, r}, out, exports, offline, check, height, dataLabels }
 */
async function make(opts) {
  const missing = [];
  if (!opts.title || !String(opts.title).trim()) missing.push('--title "le constat en une phrase"');
  if (!opts.polarity) missing.push(`--polarity ${POLARITIES.join('|')}`);
  if (missing.length) throw new MakeError(`Paramètre(s) requis : ${missing.join(', ')}.`);
  if (!POLARITIES.includes(opts.polarity)) throw new MakeError(`Polarité inconnue "${opts.polarity}". Valeurs : ${POLARITIES.join(', ')}.`);
  const exportsList = parseExports(opts.exports);

  const loaded = loadSource(opts.data);
  const base = loaded.spec || null;
  if (base) loaded.formattedData = base.formattedData;
  const choice = chooseTemplate(loaded, Object.assign({}, opts, { template: opts.template || (base && base.targetTemplateId) }));
  const { formattedData, mapping } = dataFor(loaded, choice.id, opts.mapping || {});

  const spec = {
    targetTemplateId: choice.id,
    layout: Object.assign({}, base && base.layout, {
      title: String(opts.title).trim(),
      subtitle: opts.subtitle !== undefined ? opts.subtitle : (base && base.layout && base.layout.subtitle) || '',
      footnote: opts.footnote !== undefined ? opts.footnote : (base && base.layout && base.layout.footnote) || ''
    }),
    colorStrategy: Object.assign({}, base && base.colorStrategy, {
      themeName: opts.theme || (base && base.colorStrategy && base.colorStrategy.themeName) || 'colorbrewer-accessible',
      metricPolarity: opts.polarity
    }),
    cognitiveFeatures: Object.assign({ tooltip: { enabled: true, antiOcclusion: true } }, base && base.cognitiveFeatures),
    formattedData
  };
  if (opts.height) spec.layout.height = Number(opts.height);
  if (opts.dataLabels !== undefined) spec.cognitiveFeatures.showDataLabels = opts.dataLabels;
  keepOrdinalOrder(spec, choice);
  const focusSource = resolveFocus(spec, choice, opts.focus, undefined);
  fillRequiredTexts(spec);
  if (!spec.layout.footnote) delete spec.layout.footnote;
  if (!spec.layout.subtitle) delete spec.layout.subtitle;

  const outDir = resolveOutDir(opts.out, opts.title);
  const meta = {
    source: typeof opts.data === 'string' && !/^\s*[[{]/.test(opts.data) ? path.relative(outDir, path.resolve(process.cwd(), opts.data)) : null,
    mapping: mapping || null,
    intent: opts.intent || null,
    templateChoice: choice.source,
    focusSource,
    exports: exportsList,
    offline: Boolean(opts.offline)
  };
  return buildFromSpec(spec, outDir, { offline: opts.offline, check: opts.check, exports: exportsList, scale: opts.scale }, choice, meta);
}

/**
 * kit-charts update output/<slug> [--data nouvelles-données] [--title ...]
 * Garde le template, le thème, la polarité et la correspondance des colonnes déjà choisis.
 */
async function update(opts) {
  const dir = path.resolve(process.cwd(), opts.dir || '');
  if (!fs.existsSync(dir)) {
    const parent = path.dirname(dir);
    const near = fs.existsSync(parent) ? fs.readdirSync(parent).filter(n => fs.existsSync(path.join(parent, n, 'spec.json'))).slice(0, 5) : [];
    throw new MakeError(`Dossier introuvable : ${path.relative(process.cwd(), dir)}.${near.length ? ` Existants : ${near.join(', ')}.` : ''}`);
  }
  const specFile = /\.json$/i.test(dir) ? dir : path.join(fs.existsSync(dir) && fs.statSync(dir).isDirectory() ? dir : path.dirname(dir), 'spec.json');
  const outDir = path.dirname(specFile);
  if (!fs.existsSync(specFile)) throw new MakeError(`Aucune spec à mettre à jour : ${path.relative(process.cwd(), specFile)} introuvable. Créer d'abord avec kit-charts make.`);
  const spec = JSON.parse(fs.readFileSync(specFile, 'utf8'));
  if (Array.isArray(spec.charts)) throw new MakeError('update vise un graphique : pour une page, modifier les graphiques puis recompiler la page (kit-charts compile).');
  const metaFile = path.join(outDir, MAKE_META);
  const meta = fs.existsSync(metaFile) ? JSON.parse(fs.readFileSync(metaFile, 'utf8')) : {};

  let choice = { id: spec.targetTemplateId, source: 'conservé', alternatives: [], rejected: [], warnings: [] };
  const mapping = Object.assign({}, meta.mapping || {}, opts.mapping || {});
  // Sans --data, la source d'origine est relue : un même fichier mis à jour chaque mois suffit.
  let dataSource = opts.data;
  if (dataSource === undefined && meta.source && fs.existsSync(path.resolve(outDir, meta.source))) {
    dataSource = path.resolve(outDir, meta.source);
  }
  if (dataSource !== undefined) {
    const loaded = loadSource(dataSource);
    if (loaded.spec) throw new MakeError('update attend des données, pas une spec complète.');
    if (opts.template || opts.intent) {
      choice = chooseTemplate(loaded, { template: opts.template, intent: opts.intent, mapping });
    }
    const built = dataFor(loaded, choice.id, mapping);
    spec.formattedData = built.formattedData;
    meta.mapping = built.mapping || meta.mapping || null;
    if (typeof dataSource === 'string' && !/^\s*[[{]/.test(dataSource)) meta.source = path.relative(outDir, path.resolve(process.cwd(), dataSource));
  } else if (opts.template) {
    choice = { id: opts.template, source: 'imposé', alternatives: [], rejected: [], warnings: [] };
  }
  spec.targetTemplateId = choice.id;
  spec.layout = spec.layout || {};
  spec.colorStrategy = spec.colorStrategy || {};
  // Un texte de carte KPI ou de tableau repris de layout suit sa nouvelle valeur.
  const fd = spec.formattedData && typeof spec.formattedData === 'object' ? spec.formattedData : {};
  ['title', 'subtitle', 'footnote'].forEach(k => {
    if (opts[k] === undefined) return;
    if (fd[k] !== undefined && fd[k] === spec.layout[k]) fd[k] = opts[k];
    spec.layout[k] = opts[k];
  });
  if (opts.height) spec.layout.height = Number(opts.height);
  if (opts.theme) spec.colorStrategy.themeName = opts.theme;
  if (opts.polarity) {
    if (!POLARITIES.includes(opts.polarity)) throw new MakeError(`Polarité inconnue "${opts.polarity}". Valeurs : ${POLARITIES.join(', ')}.`);
    spec.colorStrategy.metricPolarity = opts.polarity;
  }
  if (opts.dataLabels !== undefined) {
    spec.cognitiveFeatures = spec.cognitiveFeatures || {};
    spec.cognitiveFeatures.showDataLabels = opts.dataLabels;
  }
  // Mêmes traitements que make : titre des cartes KPI et tableaux, ordre des libellés ordonnés.
  if (dataSource !== undefined || opts.template) keepOrdinalOrder(spec, choice);
  // Mise en avant déduite : recalculée sur le nouveau titre ou les nouvelles données.
  meta.focusSource = resolveFocus(spec, choice, opts.focus, meta.focusSource);
  fillRequiredTexts(spec);
  const exportsList = opts.exports !== undefined ? parseExports(opts.exports) : (meta.exports || []);
  const offline = opts.offline !== undefined ? opts.offline : Boolean(meta.offline);
  Object.assign(meta, { exports: exportsList, offline, templateChoice: choice.source });
  return buildFromSpec(spec, outDir, { offline, check: opts.check, exports: exportsList, scale: opts.scale }, choice, meta);
}

/** Sortie texte compacte : ce dont l'agent a besoin, rien d'autre. */
function formatResult(r, cwd = process.cwd()) {
  const rel = f => (f ? path.relative(cwd, f) || '.' : f);
  const lines = [];
  lines.push(r.ok ? `OK ${rel(r.page)}` : `ÉCHEC ${r.page ? rel(r.page) : `(spec écrite : ${rel(r.spec)})`}`);
  const c = r.choice || {};
  lines.push(`template : ${r.template} (${c.source || '?'}${c.alternatives && c.alternatives.length ? ` ; autres : ${c.alternatives.join(', ')}` : ''})`);
  (c.notes || []).forEach(n => lines.push(`note : ${n}`));
  if (c.rejected && c.rejected.length) lines.push(`écartés : ${c.rejected.slice(0, 3).join(' ; ')}${c.rejected.length > 3 ? ` ; +${c.rejected.length - 3}` : ''}`);
  lines.push(`audit : ${r.errors.length} erreur(s), ${r.warnings.length} avertissement(s)`);
  [...r.errors.map(e => ['erreur', e]), ...r.warnings.map(w => ['avert.', w])].forEach(([kind, e]) => {
    lines.push(`  ${kind} [${e.ruleId}] ${e.message}${e.fix ? `\n    correctif : ${e.fix}` : ''}`);
  });
  if (r.render) lines.push(`rendu : ${r.render.status}${r.render.reason ? ` (${r.render.reason})` : ''}`);
  r.exports.forEach(e => lines.push(e.error ? `export ${e.format} : échec, ${e.error}` : `export ${e.format} : ${rel(e.file)}${e.note ? ` (${e.note})` : ''}`));
  if (!r.ok && r.errors.length) lines.push(`Corriger puis : kit-charts update ${rel(path.dirname(r.spec))} [--data ...] [--title ...], ou éditer ${rel(r.spec)} et kit-charts compile.`);
  return lines.join('\n');
}

module.exports = { make, update, formatResult, slugify, loadSource, MakeError, POLARITIES, EXPORT_FORMATS };
