#!/usr/bin/env node
/**
 * @file bin/kit-charts.js
 * @description Point d'entrée unique de kit-charts, utilisable depuis n'importe quel dossier.
 * Les templates, thèmes et scripts viennent du paquet installé ; specs et sorties restent
 * dans le dossier courant.
 *
 *   kit-charts recommend <data.json> [--intent <intention>] [--json]
 *   kit-charts describe <templateId> [--json]
 *   kit-charts init-spec <templateId> [--data <data.json>] [-o output/<slug>/spec.json]
 *   kit-charts compile <spec.json> [-o output/<slug>/index.html] [--force] [--json]
 *   kit-charts validate <spec.json|index.html> [--json] [--strict]
 *   kit-charts check <index.html...> [--json]            (rendu réel, Chrome headless)
 *   kit-charts install-skill [--dir <dossier>] [--force]  (copie skill + agent dans .claude/)
 *   kit-charts list [--family <famille>] [--json]
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const PKG_ROOT = path.resolve(__dirname, '..');
const SKILL_DIR = path.join(PKG_ROOT, '.agents/skills/kit-charts');
const SCRIPTS = path.join(SKILL_DIR, 'scripts');
const REGISTRY_PATH = path.join(SKILL_DIR, 'registry.json');

const HELP = `kit-charts : templates Chart.js fondés sur les sciences cognitives, pour agents.

Commandes :
  recommend <data.json> [--intent X]   Templates éligibles et écartés pour ces données
  describe <templateId>                Forme exigée de formattedData (schema.json) et exemple
  init-spec <templateId>               Écrit une spec squelette à compléter (output/<slug>/spec.json)
  compile <spec.json> [-o page.html]   Compile en page HTML autonome (refus si spec non conforme)
  validate <spec.json|page.html>       Audit cognitif, WCAG et contrat de données
  check <page.html...>                 Rendu réel dans Chrome headless (data-kc-render)
  install-skill [--dir D]              Installe le skill et l'agent dataviz dans D/.claude/
  list [--family F]                    Liste les templates du registre

Options communes : --json (sortie machine), --help.
Codes de sortie : 0 conforme, 1 non conforme ou erreur, 2 usage ou prérequis manquant.`;

function loadRegistry() {
  return JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
}

function findTemplate(id) {
  const registry = loadRegistry();
  const t = registry.templates.find(x => x.id === id);
  if (!t) {
    const close = registry.templates.filter(x => x.id.includes(id) || id.includes(x.id.split('-')[0])).map(x => x.id).slice(0, 5);
    fail(`Template inconnu "${id}".${close.length ? ` Proches : ${close.join(', ')}.` : ''} Voir : kit-charts list`, 2);
  }
  return t;
}

function fail(message, code = 1) {
  console.error(`kit-charts : ${message}`);
  process.exit(code);
}

/** Délègue à un script existant en conservant ses arguments, sa sortie et son code. */
function delegate(script, args) {
  const r = spawnSync(process.execPath, [path.join(SCRIPTS, script), ...args], { stdio: 'inherit', cwd: process.cwd() });
  process.exit(r.status === null ? 1 : r.status);
}

function readJsonArg(value) {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) return JSON.parse(trimmed);
  return JSON.parse(fs.readFileSync(path.resolve(process.cwd(), value), 'utf8'));
}

function optionValue(args, names) {
  const i = args.findIndex(a => names.includes(a));
  return i >= 0 ? args[i + 1] : undefined;
}

function positional(args, valueOptions = []) {
  const out = [];
  for (let i = 0; i < args.length; i++) {
    if (valueOptions.includes(args[i])) { i++; continue; }
    if (!args[i].startsWith('-')) out.push(args[i]);
  }
  return out;
}

/**
 * Squelette de données à partir du schéma : la forme est montrée, les valeurs sont vides.
 * Les valeurs vides (null, tableaux vides) font volontairement échouer la compilation tant
 * qu'elles ne sont pas remplacées par les vraies données : jamais de données d'exemple.
 */
function skeletonFromSchema(schema) {
  if (!schema || typeof schema !== 'object') return null;
  const type = Array.isArray(schema.type) ? schema.type[0] : schema.type;
  if (type === 'object' || (!type && schema.properties)) {
    const out = {};
    const props = schema.properties || {};
    (schema.required || []).forEach(k => { out[k] = skeletonFromSchema(props[k]); });
    return out;
  }
  if (type === 'array') {
    const item = schema.items;
    const itemType = item && (Array.isArray(item.type) ? item.type[0] : item.type);
    return itemType === 'object' ? [skeletonFromSchema(item)] : [];
  }
  if (type === 'string') return '';
  if (type === 'boolean') return false;
  return null;
}

function describe(args) {
  const id = positional(args)[0];
  if (!id) fail('Usage : kit-charts describe <templateId>', 2);
  const t = findTemplate(id);
  const schema = JSON.parse(fs.readFileSync(path.join(PKG_ROOT, t.paths.schema), 'utf8'));
  const mod = require(path.join(PKG_ROOT, t.paths.js));
  const info = {
    id: t.id,
    family: t.family,
    name: t.name,
    description: t.description,
    dataRequirements: t.dataRequirements,
    formattedDataSchema: schema.properties.formattedData,
    example: mod.DEFAULT_DATA
  };
  if (args.includes('--json')) {
    console.log(JSON.stringify(info, null, 2));
    return;
  }
  const req = t.dataRequirements || {};
  console.log(`${t.id} (${t.family})\n${t.name}\n${t.description}\n`);
  console.log(`Catégories : ${req.minCategories} à ${req.maxCategories} ; séries : ${req.seriesCount} au plus${req.dataPerLabel === false ? ' ; data non indexé par label' : ''}`);
  console.log('\nForme exigée de formattedData (schema.json) :');
  console.log(JSON.stringify(info.formattedDataSchema, null, 2));
  console.log('\nExemple conforme (DEFAULT_DATA du template, à remplacer par les vraies données) :');
  console.log(JSON.stringify(info.example, null, 2));
}

function initSpec(args) {
  const id = positional(args, ['--data', '-d', '-o', '--output'])[0];
  if (!id) fail('Usage : kit-charts init-spec <templateId> [--data data.json] [-o output/<slug>/spec.json]', 2);
  const t = findTemplate(id);
  const schema = JSON.parse(fs.readFileSync(path.join(PKG_ROOT, t.paths.schema), 'utf8'));
  const dataArg = optionValue(args, ['--data', '-d']);
  const formattedData = dataArg ? readJsonArg(dataArg) : skeletonFromSchema(schema.properties.formattedData);
  const spec = {
    targetTemplateId: t.id,
    layout: { title: '', subtitle: '', footnote: '' },
    colorStrategy: { themeName: 'colorbrewer-accessible' },
    cognitiveFeatures: { tooltip: { enabled: true, antiOcclusion: true } },
    formattedData
  };
  const out = path.resolve(process.cwd(), optionValue(args, ['-o', '--output']) || path.join('output', t.id, 'spec.json'));
  if (fs.existsSync(out) && !args.includes('--force')) fail(`${out} existe déjà (--force pour écraser).`, 2);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(spec, null, 2) + '\n', 'utf8');

  const { validateChartSpec } = require(path.join(SCRIPTS, 'validate-chart.js'));
  const report = validateChartSpec(spec);
  const contract = report.errors.filter(e => e.ruleId === 'SCHEMA_FORMATTED_DATA');
  console.log(`Spec écrite : ${out}`);
  console.log('À compléter avant compilation :');
  console.log('  - layout.title : le constat en une phrase (pas le sujet)');
  console.log('  - layout.subtitle : unité, périmètre, période ; layout.footnote : source');
  console.log('  - colorStrategy.metricPolarity : HIGHER_IS_BETTER, LOWER_IS_BETTER, TARGET_BASED ou NEUTRAL_CATEGORICAL');
  if (contract.length) {
    console.log(`  - formattedData : ${contract.length} écart(s) au schéma, la compilation sera refusée tant qu'ils restent :`);
    contract.forEach(e => console.log(`      ${e.message}`));
    console.log(`    Forme et exemple : kit-charts describe ${t.id}`);
  } else {
    console.log('  - formattedData : conforme au schéma.');
  }
}

function list(args) {
  const family = optionValue(args, ['--family']);
  const templates = loadRegistry().templates.filter(t => !family || t.family.includes(family));
  if (args.includes('--json')) {
    console.log(JSON.stringify(templates.map(t => ({ id: t.id, family: t.family, name: t.name, dataRequirements: t.dataRequirements })), null, 2));
    return;
  }
  let current = null;
  templates.forEach(t => {
    if (t.family !== current) { current = t.family; console.log(`\n${current}`); }
    console.log(`  ${t.id.padEnd(28)} ${t.name}`);
  });
  console.log(`\n${templates.length} template(s).`);
}

function copyDir(src, dest, skip) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (skip && skip(entry.name)) continue;
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d, skip);
    else fs.copyFileSync(s, d);
  }
}

function installSkill(args) {
  const base = path.resolve(process.cwd(), optionValue(args, ['--dir']) || '.');
  const skillDest = path.join(base, '.claude/skills/kit-charts');
  const agentDest = path.join(base, '.claude/agents/dataviz.md');
  if ((fs.existsSync(skillDest) || fs.existsSync(agentDest)) && !args.includes('--force')) {
    fail(`${skillDest} ou ${agentDest} existe déjà (--force pour remplacer).`, 2);
  }
  // Le skill installé s'appuie sur la commande kit-charts : scripts, registre et evals restent dans le paquet.
  fs.rmSync(skillDest, { recursive: true, force: true });
  fs.mkdirSync(skillDest, { recursive: true });
  fs.copyFileSync(path.join(SKILL_DIR, 'SKILL.md'), path.join(skillDest, 'SKILL.md'));
  copyDir(path.join(SKILL_DIR, 'references'), path.join(skillDest, 'references'));
  const agentSrc = path.join(PKG_ROOT, '.agents/agents/dataviz.md');
  if (fs.existsSync(agentSrc)) {
    fs.mkdirSync(path.dirname(agentDest), { recursive: true });
    fs.copyFileSync(agentSrc, agentDest);
  }
  console.log(`Skill installé : ${skillDest}`);
  if (fs.existsSync(agentSrc)) console.log(`Agent installé : ${agentDest}`);
  console.log('Les agents de ce projet appellent désormais la commande kit-charts (recommend, describe, compile, validate, check).');
}

function main() {
  const [cmd, ...args] = process.argv.slice(2);
  if (!cmd || cmd === '--help' || cmd === '-h' || cmd === 'help') {
    console.log(HELP);
    process.exit(cmd ? 0 : 2);
  }
  if (cmd === '--version' || cmd === '-v') {
    console.log(require(path.join(PKG_ROOT, 'package.json')).version);
    return;
  }
  switch (cmd) {
    case 'recommend': return delegate('recommend-template.js', args);
    case 'compile': return delegate('compile-chart.js', args);
    case 'validate': return delegate('validate-chart.js', args);
    case 'check': return delegate('render-check.js', args);
    case 'describe': return describe(args);
    case 'init-spec': return initSpec(args);
    case 'install-skill': return installSkill(args);
    case 'list': return list(args);
    default: fail(`Commande inconnue "${cmd}". Voir : kit-charts --help`, 2);
  }
}

main();
