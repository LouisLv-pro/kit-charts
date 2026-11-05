#!/usr/bin/env node
/**
 * @file test/token-benchmark.js
 * @description Mesure du coût en tokens d'un graphique pour un agent, sur les 9 cas d'eval du
 * skill : parcours pas à pas (recommend, describe, init-spec, écriture de la spec, compile,
 * validate, check) contre parcours `make` (écriture des données, un appel).
 *
 * Modèle de coût d'une conversation d'agent :
 *   - tokens lus : chaque appel d'outil renvoie au modèle tout le contexte accumulé (skill lu,
 *     commandes écrites, sorties reçues). Coût cumulé = somme, à chaque appel, du contexte.
 *   - tokens écrits : ce que le modèle produit lui-même (commandes, données, spec JSON).
 * Tokens estimés à 1 pour 3,5 caractères (texte français et JSON). Les tokens du prompt système
 * et du message utilisateur, identiques dans les deux parcours, sont exclus.
 *
 * Les sorties sont réelles : chaque commande est exécutée. Le skill du parcours pas à pas est
 * figé dans test/fixtures/benchmark/SKILL-pas-a-pas.md (version d'avant make, novembre 2026) :
 * la base de comparaison ne bouge pas quand le skill évolue.
 *
 * Usage : node test/token-benchmark.js [--render] [--json] [--assert]
 *   --render  inclut le contrôle de rendu Chrome dans les deux parcours (sinon exclu des deux)
 *   --assert  sort en 1 si make ne coûte pas moins que le pas à pas sur chaque cas (npm test)
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const CLI = path.join(ROOT, 'bin/kit-charts.js');
const FIXTURES = path.join(__dirname, 'fixtures/benchmark');
const SKILL_PATH = '.agents/skills/kit-charts/SKILL.md';
const CHARS_PER_TOKEN = 3.5;
const { loadSource } = require(path.join(ROOT, '.agents/skills/kit-charts/scripts/make-chart.js'));
const { tableToFormattedData, shapeOfTemplate } = require(path.join(ROOT, '.agents/skills/kit-charts/scripts/table-import.js'));

// Paramètres qu'un agent passerait pour chaque cas (titre = constat, polarité, template retenu).
const CASES = [
  { name: 'axe-tronque-refuse', template: 'bar-chart-vertical', intent: 'comparison', polarity: 'HIGHER_IS_BETTER',
    title: "L'agence C dépasse l'agence A de 65 ventes", subtitle: 'Ventes du trimestre, en nombre' },
  { name: 'classement-satisfaction-agences-2023-2025', template: 'slope-chart', intent: 'comparison', polarity: 'HIGHER_IS_BETTER',
    title: 'Lille passe de la 6e à la 1re place', subtitle: 'Clients satisfaits ou très satisfaits, en %, 2023 et 2025' },
  { name: 'couts-cloud-polarite-inverse', template: 'line-chart', intent: 'evolution', polarity: 'LOWER_IS_BETTER',
    title: 'La facture cloud a grimpé de 76 % en 2024', subtitle: 'Facture mensuelle, en k€' },
  { name: 'delais-livraison-observations-brutes-par-entrepot', template: 'violin-plot', intent: 'distribution', polarity: 'LOWER_IS_BETTER',
    title: 'Saint-Priest livre à deux vitesses', subtitle: 'Délai entre commande et remise, en heures, 15 colis par entrepôt' },
  { name: 'kpi-mrr-avec-reference', template: 'kpi-standard', intent: 'kpi', polarity: 'HIGHER_IS_BETTER',
    title: 'MRR de novembre', subtitle: 'En euros' },
  { name: 'neuf-regions-bascule-horizontal', template: 'bar-chart-horizontal', intent: 'comparison', polarity: 'HIGHER_IS_BETTER',
    title: "L'Île-de-France pèse plus que les deux régions suivantes réunies", subtitle: 'Chiffre d\'affaires 2024, en M€' },
  { name: 'parts-de-marche-trop-de-tranches', template: 'bar-chart-horizontal', intent: 'composition', polarity: 'NEUTRAL_CATEGORICAL',
    title: 'Apple et Samsung détiennent plus de la moitié du marché', subtitle: 'Parts de marché smartphones, en %' },
  { name: 'planning-migration-crm-taches-et-avancement', template: 'gantt-progress', intent: 'flow', polarity: 'TARGET_BASED',
    title: 'Deux chantiers sont en retard en semaine 7', subtitle: 'Migration CRM, avancement en %', extra: ['--today', '7'] },
  { name: 'pont-ebit-variations-en-paires-chainees', template: 'waterfall-chart', intent: 'flow', polarity: 'HIGHER_IS_BETTER',
    title: "Les coûts effacent les gains : l'EBIT recule de 1,2 M€", subtitle: "Pont d'EBIT 2024 à 2025, en M€" }
];

const tokens = text => Math.ceil(Buffer.byteLength(String(text || ''), 'utf8') / CHARS_PER_TOKEN);
const quote = s => (/^[\w./:@%,+-]+$/.test(s) ? s : `"${String(s).replace(/"/g, '\\"')}"`);

function run(args, cwd) {
  const r = spawnSync(process.execPath, [CLI, ...args], { cwd, encoding: 'utf8' });
  return { code: r.status, out: (r.stdout || '') + (r.stderr || '') };
}

function skillText(file) {
  return { text: fs.readFileSync(file, 'utf8'), source: path.relative(ROOT, file) };
}

/**
 * Coût d'une conversation : steps = [{ write, read }] (texte écrit par le modèle, texte reçu).
 * Le contexte initial (skill lu) est compté dans le premier appel.
 */
function conversationCost(initialContext, steps) {
  let context = tokens(initialContext);
  let cumulativeRead = 0;
  let written = 0;
  steps.forEach(s => {
    const w = tokens(s.write);
    written += w;
    context += w;
    cumulativeRead += context; // le modèle relit tout le contexte pour produire l'appel suivant
    context += tokens(s.read);
  });
  cumulativeRead += context; // dernière lecture, pour écrire la réponse finale
  return { calls: steps.length, written, cumulativeRead, finalContext: context };
}

function fixtureFor(name) {
  for (const ext of ['.csv', '.json']) {
    const f = path.join(FIXTURES, name + ext);
    if (fs.existsSync(f)) return f;
  }
  throw new Error(`Données de benchmark absentes pour ${name}`);
}

/** formattedData du template, à partir de la fixture : ce qu'un agent écrit dans la spec à la main. */
function formattedDataFor(c, file) {
  const loaded = loadSource(file);
  if (loaded.formattedData) return loaded.formattedData;
  const mod = require(path.join(ROOT, require(path.join(ROOT, '.agents/skills/kit-charts/registry.json')).templates.find(t => t.id === c.template).paths.js));
  const { shape, sizeKey, transposeWhenWide } = shapeOfTemplate(mod.DEFAULT_DATA, c.template);
  const mapping = {};
  if (c.extra && c.extra[0] === '--today') mapping.today = c.extra[1];
  let fd = tableToFormattedData(loaded.table, mapping, shape, sizeKey).formattedData;
  if (transposeWhenWide && fd.datasets.length === 2 && fd.labels.length > 2) {
    fd = tableToFormattedData(loaded.table, Object.assign({ transpose: true }, mapping), shape, sizeKey).formattedData;
  }
  return fd;
}

function benchCase(c, oldSkill, newSkill, opts) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `kc-bench-${c.name.slice(0, 20)}-`));
  try {
    const file = fixtureFor(c.name);
    const dataText = fs.readFileSync(file, 'utf8');
    const dataName = path.basename(file);
    fs.writeFileSync(path.join(dir, dataName), dataText);
    const formattedData = formattedDataFor(c, file);

    // --- Parcours pas à pas -------------------------------------------------
    const stepDir = path.join(dir, 'pas-a-pas');
    fs.mkdirSync(stepDir);
    fs.writeFileSync(path.join(stepDir, 'data.json'), JSON.stringify(formattedData, null, 2));
    const steps = [];
    const cmd = (args, write) => {
      const r = run(args, stepDir);
      steps.push({ write: write !== undefined ? write : `kit-charts ${args.map(quote).join(' ')}`, read: r.out });
      return r;
    };
    // L'agent écrit les données au format du template avant de pouvoir les profiler.
    steps.push({ write: JSON.stringify(formattedData, null, 2), read: 'Fichier écrit : data.json' });
    cmd(['recommend', 'data.json', '--intent', c.intent]);
    cmd(['describe', c.template]);
    cmd(['init-spec', c.template, '-o', 'output/g/spec.json']);
    const spec = {
      targetTemplateId: c.template,
      layout: { title: c.title, subtitle: c.subtitle },
      colorStrategy: { themeName: 'colorbrewer-accessible', metricPolarity: c.polarity },
      cognitiveFeatures: { tooltip: { enabled: true, antiOcclusion: true } },
      formattedData
    };
    const specText = JSON.stringify(spec, null, 2);
    fs.writeFileSync(path.join(stepDir, 'output/g/spec.json'), specText);
    steps.push({ write: specText, read: 'Fichier écrit : output/g/spec.json' });
    const compiled = cmd(['compile', 'output/g/spec.json', '-o', 'output/g/index.html']);
    cmd(['validate', 'output/g/index.html', '--json']);
    if (opts.render) cmd(['check', 'output/g/index.html']);
    const stepByStep = conversationCost(oldSkill, steps);

    // --- Parcours make --------------------------------------------------------
    const makeDir = path.join(dir, 'make');
    fs.mkdirSync(makeDir);
    const makeArgs = ['make', dataName, '--title', c.title, '--subtitle', c.subtitle, '--polarity', c.polarity,
      '--template', c.template, ...(c.extra || []), ...(opts.render ? [] : ['--no-check'])];
    fs.writeFileSync(path.join(makeDir, dataName), dataText);
    const made = run(makeArgs, makeDir);
    const makeSteps = [
      { write: dataText, read: `Fichier écrit : ${dataName}` },
      { write: `kit-charts ${makeArgs.map(quote).join(' ')}`, read: made.out }
    ];
    const oneCall = conversationCost(newSkill, makeSteps);

    return {
      name: c.name,
      template: c.template,
      ok: { stepByStep: compiled.code === 0, make: made.code === 0 },
      makeOutput: made.out,
      stepByStep,
      make: oneCall
    };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function pct(a, b) {
  return b ? Math.round((1 - a / b) * 100) : 0;
}

function main() {
  const args = process.argv.slice(2);
  const opts = { render: args.includes('--render') };
  const oldSkill = skillText(path.join(FIXTURES, 'SKILL-pas-a-pas.md'));
  const newSkill = skillText(path.join(ROOT, SKILL_PATH));
  const results = CASES.map(c => benchCase(c, oldSkill.text, newSkill.text, opts));

  const sum = (k, f) => results.reduce((a, r) => a + r[k][f], 0);
  const totals = {
    stepByStep: { calls: sum('stepByStep', 'calls'), written: sum('stepByStep', 'written'), cumulativeRead: sum('stepByStep', 'cumulativeRead') },
    make: { calls: sum('make', 'calls'), written: sum('make', 'written'), cumulativeRead: sum('make', 'cumulativeRead') }
  };

  if (args.includes('--json')) {
    console.log(JSON.stringify({ skills: { stepByStep: oldSkill.source, make: newSkill.source }, render: opts.render, results, totals }, null, 2));
  } else {
    console.log(`Skill pas à pas : ${oldSkill.source} (${tokens(oldSkill.text)} tokens) ; skill make : ${newSkill.source} (${tokens(newSkill.text)} tokens)`);
    console.log(`Rendu Chrome ${opts.render ? 'inclus' : 'exclu'} dans les deux parcours. Tokens estimés (1 pour ${CHARS_PER_TOKEN} caractères).\n`);
    const pad = (s, n) => String(s).padEnd(n);
    const padL = (s, n) => String(s).padStart(n);
    console.log(`${pad('cas', 46)}${padL('appels', 9)}${padL('écrits', 15)}${padL('lus (cumul)', 19)}${padL('gain', 7)}`);
    results.forEach(r => {
      const a = r.stepByStep;
      const b = r.make;
      console.log(`${pad(r.name.slice(0, 45), 46)}${padL(`${a.calls} → ${b.calls}`, 9)}${padL(`${a.written} → ${b.written}`, 15)}${padL(`${a.cumulativeRead} → ${b.cumulativeRead}`, 19)}${padL(`${pct(b.cumulativeRead + b.written, a.cumulativeRead + a.written)} %`, 7)}`);
    });
    const a = totals.stepByStep;
    const b = totals.make;
    console.log(`\n${pad('TOTAL (9 cas)', 46)}${padL(`${a.calls} → ${b.calls}`, 9)}${padL(`${a.written} → ${b.written}`, 15)}${padL(`${a.cumulativeRead} → ${b.cumulativeRead}`, 19)}${padL(`${pct(b.cumulativeRead + b.written, a.cumulativeRead + a.written)} %`, 7)}`);
    const failed = results.filter(r => !r.ok.make);
    if (failed.length) console.log(`\nmake en échec : ${failed.map(r => `${r.name}\n${r.makeOutput}`).join('\n')}`);
  }

  if (args.includes('--assert')) {
    const worse = results.filter(r => !(r.make.cumulativeRead + r.make.written < r.stepByStep.cumulativeRead + r.stepByStep.written) || r.make.calls >= r.stepByStep.calls);
    const broken = results.filter(r => !r.ok.make);
    if (worse.length || broken.length) {
      console.error(`Benchmark en échec : ${[...worse.map(r => `${r.name} (make pas moins cher)`), ...broken.map(r => `${r.name} (make exit ≠ 0)`)].join(', ')}`);
      process.exit(1);
    }
  }
}

if (require.main === module) main();

module.exports = { conversationCost, tokens, CASES };
