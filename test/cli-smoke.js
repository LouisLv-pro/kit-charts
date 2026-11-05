/**
 * @file test/cli-smoke.js
 * @description Le CLI tel qu'un utilisateur l'installe : npm pack, installation dans un préfixe
 * temporaire, puis parcours complet depuis un dossier sans rapport avec le dépôt.
 * Lancer : npm run test:cli (npm requis, réseau non requis ; `check` est sauté sans Chrome).
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const work = fs.mkdtempSync(path.join(os.tmpdir(), 'kc-cli-'));
const prefix = path.join(work, 'prefix');
const project = path.join(work, 'projet');
fs.mkdirSync(project, { recursive: true });

let failures = 0;
function check(condition, message) {
  console.log(`  ${condition ? '✅ [PASS]' : '❌ [FAIL]'} ${message}`);
  if (!condition) failures++;
}
function run(cmd, args, cwd) {
  return spawnSync(cmd, args, { cwd, encoding: 'utf8' });
}

console.log('🔹 CLI kit-charts installé depuis le paquet (npm pack + install -g --prefix)');
const pack = run('npm', ['pack', '--pack-destination', work, '--silent'], ROOT);
const tgz = pack.stdout.trim().split('\n').pop();
check(pack.status === 0 && tgz.endsWith('.tgz'), `npm pack produit l'archive (${tgz || pack.stderr.trim()})`);
const install = run('npm', ['install', '-g', '--prefix', prefix, path.join(work, tgz)], work);
const bin = path.join(prefix, process.platform === 'win32' ? 'kit-charts.cmd' : 'bin/kit-charts');
check(install.status === 0 && fs.existsSync(bin), 'installation globale dans un préfixe temporaire');

const registry = JSON.parse(fs.readFileSync(path.join(ROOT, '.agents/skills/kit-charts/registry.json'), 'utf8'));
const list = run(bin, ['list', '--json'], project);
const listed = list.status === 0 ? JSON.parse(list.stdout) : [];
check(listed.length === registry.templates.length, `list : ${listed.length} templates, autant que le registre`);

const desc = run(bin, ['describe', 'gantt-progress', '--json'], project);
const descJson = desc.status === 0 ? JSON.parse(desc.stdout) : {};
check(!!(descJson.formattedDataSchema && descJson.example && descJson.example.datasets), 'describe renvoie le schéma et l\'exemple du template');

const unknown = run(bin, ['describe', 'bar-chart'], project);
check(unknown.status === 2 && unknown.stderr.includes('bar-chart-'), 'describe sur un id inconnu : exit 2 et suggestions');

const init = run(bin, ['init-spec', 'waterfall-chart', '-o', 'output/pont/spec.json'], project);
const specPath = path.join(project, 'output/pont/spec.json');
check(init.status === 0 && fs.existsSync(specPath), 'init-spec écrit la spec dans le dossier courant');
const skeletonCompile = run(bin, ['compile', specPath, '-o', 'output/pont/index.html'], project);
check(skeletonCompile.status === 1 && skeletonCompile.stderr.includes('SCHEMA_FORMATTED_DATA'),
  'Squelette non rempli : compilation refusée (aucune donnée d\'exemple)');

const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
spec.layout = { title: 'Le prix compense la hausse des coûts', subtitle: 'Résultat opérationnel, M€, 2023 à 2024', footnote: 'Source : contrôle de gestion' };
spec.colorStrategy.metricPolarity = 'HIGHER_IS_BETTER';
spec.formattedData = { labels: ['Résultat 2023', 'Volume', 'Prix', 'Coûts', 'Résultat 2024'], datasets: [{ label: 'M€', data: [[0, 100], [100, 130], [130, 140], [140, 118], [0, 118]] }] };
fs.writeFileSync(specPath, JSON.stringify(spec, null, 2));
const compiled = run(bin, ['compile', specPath, '-o', 'output/pont/index.html'], project);
const page = path.join(project, 'output/pont/index.html');
check(compiled.status === 0 && fs.existsSync(page), 'compile depuis un dossier hors dépôt, sortie dans ce dossier');
check(fs.existsSync(page) && fs.readFileSync(page, 'utf8').includes('Source : contrôle de gestion'), 'footnote rendue dans la page compilée');

const validated = run(bin, ['validate', page, '--json'], project);
check(validated.status === 0 && JSON.parse(validated.stdout).valid === true, 'validate sur la page compilée : conforme');

const { findChrome } = require(path.join(ROOT, '.agents/skills/kit-charts/scripts/render-check.js'));
if (findChrome()) {
  const rendered = run(bin, ['check', page, '--json'], project);
  check(rendered.status === 0 && JSON.parse(rendered.stdout).failed === 0, 'check : rendu réel ok dans Chrome headless');
} else {
  console.log('  ⏭️  check sauté : Chrome introuvable (CHROME_PATH)');
}

// Parcours en un appel depuis le paquet installé : CSV -> page hors ligne (copies vendor/ du paquet).
fs.writeFileSync(path.join(project, 'ventes.csv'), 'region;CA (k€)\nParis;120\nLyon;140\nLille;80\n');
const made = run(bin, ['make', 'ventes.csv', '--title', 'Lyon dépasse Paris', '--subtitle', 'CA 2026, en k€', '--polarity', 'HIGHER_IS_BETTER',
  '--offline', '-o', 'output/ventes', ...(findChrome() ? ['--export', 'png'] : ['--no-check'])], project);
const madePage = path.join(project, 'output/ventes/index.html');
check(made.status === 0 && fs.existsSync(madePage) && !/<script src="https:/.test(fs.readFileSync(madePage, 'utf8')),
  `make --offline depuis le paquet installé : page sans dépendance réseau (exit ${made.status}${made.status ? ' : ' + made.stdout.trim() : ''})`);
if (findChrome()) check(fs.existsSync(path.join(project, 'output/ventes/index.png')), 'make --export png depuis le paquet installé');

const skill = run(bin, ['install-skill'], project);
check(skill.status === 0 && fs.existsSync(path.join(project, '.claude/skills/kit-charts/SKILL.md')) && fs.existsSync(path.join(project, '.claude/agents/dataviz.md')),
  'install-skill copie le skill et l\'agent dans .claude/ du projet');
const skillText = fs.existsSync(path.join(project, '.claude/skills/kit-charts/SKILL.md')) ? fs.readFileSync(path.join(project, '.claude/skills/kit-charts/SKILL.md'), 'utf8') : '';
const brokenLinks = [...skillText.matchAll(/\]\((references\/[^)]+)\)/g)].map(m => m[1]).filter(rel => !fs.existsSync(path.join(project, '.claude/skills/kit-charts', rel)));
check(skillText.length > 0 && brokenLinks.length === 0, `liens du skill installé résolus${brokenLinks.length ? ' | absents : ' + brokenLinks.join(', ') : ''}`);
const again = run(bin, ['install-skill'], project);
check(again.status === 2, 'install-skill refuse d\'écraser sans --force');

fs.rmSync(work, { recursive: true, force: true });
console.log(failures ? `\n❌ ${failures} échec(s)` : '\n✅ CLI conforme');
process.exit(failures ? 1 : 0);
