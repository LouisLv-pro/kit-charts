#!/usr/bin/env node
/**
 * @file test/workflow-tests.js
 * @description Tests du parcours en un appel : import de tableaux, make, update, pages à
 * plusieurs graphiques, mode hors ligne et agrégation des statuts de rendu. Sans Chrome ni
 * réseau (make --no-check) ; l'export est testé par test/export-tests.js.
 * Discipline (AGENTS.md) : comportements observables, valeurs exactes, fautifs nommés.
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const SCRIPTS = path.join(ROOT, '.agents/skills/kit-charts/scripts');
const CLI = path.join(ROOT, 'bin/kit-charts.js');
const T = require(path.join(SCRIPTS, 'table-import.js'));
const { compileChart, validatePageSpec } = require(path.join(SCRIPTS, 'compile-chart.js'));
const pins = require(path.join(SCRIPTS, 'vendor-pins.js'));
const { parseRenderStatus } = require(path.join(SCRIPTS, 'render-check.js'));
const { quantile } = require(path.join(ROOT, 'themes/stat-helpers.js'));
const registry = require(path.join(ROOT, '.agents/skills/kit-charts/registry.json'));

let passed = 0;
let failed = 0;
function check(cond, label) {
  if (cond) { passed++; console.log(`  ✅ [PASS] ${label}`); } else { failed++; console.log(`  ❌ [FAIL] ${label}`); }
}
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kc-workflow-'));
const cli = (args, cwd = tmp) => {
  const r = spawnSync(process.execPath, [CLI, ...args], { cwd, encoding: 'utf8' });
  return { code: r.status, out: (r.stdout || '') + (r.stderr || '') };
};
const write = (name, text) => { fs.writeFileSync(path.join(tmp, name), text); return name; };
const readJson = f => JSON.parse(fs.readFileSync(path.join(tmp, f), 'utf8'));

try {
  console.log('\n🔹 Import de tableaux (table-import.js)');
  const numbers = { '1 234,5': 1234.5, '1,234.5': 1234.5, '12 %': 12, '45 k€': 45, '-3,2': -3.2, '1.234.567': 1234567, '€12': 12, '': null, abc: undefined };
  const badNumbers = Object.entries(numbers).filter(([raw, want]) => T.parseNumber(raw) !== want).map(([raw]) => JSON.stringify(raw));
  check(badNumbers.length === 0, `parseNumber : formats français et anglais, unités retirées${badNumbers.length ? ' | fautifs : ' + badNumbers.join(', ') : ''}`);

  const wide = T.tableToFormattedData(T.parseTable('region;"CA; 2026"\nParis;"1 200,5"\nLyon;900\n'), {});
  check(same(wide.formattedData, { labels: ['Paris', 'Lyon'], datasets: [{ label: 'CA; 2026', data: [1200.5, 900] }] }),
    'CSV « ; » avec champ entre guillemets contenant le délimiteur : une série par colonne numérique');

  const long = T.tableToFormattedData(T.parseTable('mois,agence,ventes\nJan,A,10\nJan,B,12\nFev,A,11\n'), { series: 'agence' });
  check(same(long.formattedData, { labels: ['Jan', 'Fev'], datasets: [{ label: 'A', data: [10, 11] }, { label: 'B', data: [12, null] }] }),
    'Format long (--series) : pivot catégorie × série, null pour une case absente');

  let dupError = '';
  try { T.tableToFormattedData(T.parseTable('r,v\nParis,1\nParis,2\n'), {}); } catch (e) { dupError = e.message; }
  check(/en double/.test(dupError), `Catégories répétées sans --series : refus explicite (message : ${dupError || 'aucun'})`);

  const ebit = T.tableToFormattedData(T.parseTable('poste;v\nEBIT 2024;18,6\nVolume;4,2\nPrix;1,8\nMatières;-2,7\nSalaires;-3,1\nÉnergie;-1,4\nEBIT 2025;17,4\n'), {}, 'waterfall');
  check(same(ebit.formattedData.datasets[0].data, [[0, 18.6], [18.6, 22.8], [22.8, 24.6], [24.6, 21.9], [21.9, 18.8], [18.8, 17.4], [0, 17.4]]),
    'Waterfall : variations signées converties en paires chaînées, totaux en [0, total]');
  const open = T.tableToFormattedData(T.parseTable('p,v\nDépart,10\nHausse,5\nBaisse,-2\n'), {}, 'waterfall');
  check(same(open.formattedData.datasets[0].data, [[0, 10], [10, 15], [15, 13]]),
    'Waterfall : une dernière ligne qui ne vaut pas le cumul reste une variation');

  const obs = [2, 3, 2.5, 9, 4, 3.5];
  const box = T.tableToFormattedData(T.parseTable('e,d\n' + obs.map(v => `N,${v}`).join('\n') + '\n'), {}, 'box-stats').formattedData.datasets[0].data[0];
  const sorted = obs.slice().sort((a, b) => a - b);
  const q1 = quantile(sorted, 0.25);
  const q3 = quantile(sorted, 0.75);
  check(box.q1 === q1 && box.median === quantile(sorted, 0.5) && box.q3 === q3 && same(box.outliers, sorted.filter(v => v > q3 + 1.5 * (q3 - q1) || v < q1 - 1.5 * (q3 - q1))),
    `Box-plot : quartiles de stat-helpers et valeurs hors moustaches de Tukey (reçu ${JSON.stringify(box)})`);

  const slope = T.transpose({ labels: ['Lille', 'Lyon', 'Nice'], datasets: [{ label: '2023', data: [68, 72, 70] }, { label: '2025', data: [84, 81, 79] }] });
  check(same(slope, { labels: ['2023', '2025'], datasets: [{ label: 'Lille', data: [68, 84] }, { label: 'Lyon', data: [72, 81] }, { label: 'Nice', data: [70, 79] }] }),
    'Transposition : une série par élément, les dates en catégories (slope-chart)');

  const xy = T.tableToFormattedData(T.parseTable('pays,pib,vie,pop\nFR,40,82,67\n'), { x: 'pib', y: 'vie', r: 'pop', label: 'pays' }, 'xy', 'z');
  check(same(xy.formattedData.datasets[0].data, [{ x: 40, y: 82, z: 67, label: 'FR' }]), 'Nuage de bulles : la taille suit la clé du template (z pour bubble-chart)');

  const shapes = registry.templates.map(t => [t.id, T.shapeOfTemplate(require(path.join(ROOT, t.paths.js)).DEFAULT_DATA, t.id).shape]);
  const shapeMismatch = shapes.filter(([id, shape]) => {
    const fd = require(path.join(ROOT, registry.templates.find(t => t.id === id).paths.js)).DEFAULT_DATA;
    return shape === 'labels-datasets' && !(Array.isArray(fd.labels) && Array.isArray(fd.datasets));
  }).map(([id]) => id);
  check(shapeMismatch.length === 0, `Forme « catégories × séries » attribuée seulement à des templates qui la lisent${shapeMismatch.length ? ' | ' + shapeMismatch.join(', ') : ''}`);

  console.log('\n🔹 kit-charts make');
  const regions = write('regions.csv', 'region;CA (M€)\nÎle-de-France;412\nAuvergne-Rhône-Alpes;198\nNouvelle-Aquitaine;151\nOccitanie;143\nHauts-de-France;139\nGrand Est;121\nProvence-Alpes-Côte d\'Azur;118\nBretagne;87\nNormandie;74\n');
  const made = cli(['make', regions, '--title', "L'Île-de-France pèse deux fois la suivante", '--subtitle', 'CA 2024, en M€', '--polarity', 'HIGHER_IS_BETTER', '--no-check', '-o', 'output/regions']);
  const spec = fs.existsSync(path.join(tmp, 'output/regions/spec.json')) ? readJson('output/regions/spec.json') : {};
  const vertical = registry.templates.find(t => t.id === 'bar-chart-vertical').dataRequirements.maxCategories;
  check(made.code === 0 && fs.existsSync(path.join(tmp, 'output/regions/index.html')), `make CSV : exit 0 et page écrite (exit ${made.code})`);
  check(spec.targetTemplateId === 'bar-chart-horizontal' && spec.formattedData.labels.length > vertical,
    `make : ${spec.formattedData ? spec.formattedData.labels.length : '?'} catégories > ${vertical} : bar-chart-horizontal retenu (reçu ${spec.targetTemplateId})`);
  check(/écartés : .*bar-chart-vertical/.test(made.out), 'make : la sortie nomme bar-chart-vertical parmi les écartés');
  check(made.out.split('\n').length <= 12, `make : sortie compacte (${made.out.split('\n').length} lignes)`);

  const noPol = cli(['make', regions, '--title', 'Un titre', '--no-check', '-o', 'output/sans-polarite']);
  check(noPol.code === 1 && /--polarity/.test(noPol.out) && !fs.existsSync(path.join(tmp, 'output/sans-polarite/index.html')),
    `make sans --polarity : exit 1, paramètre nommé, rien écrit (exit ${noPol.code})`);

  const pie = write('parts.csv', 'marque,part (%)\nA,28\nB,24\nC,13\nD,9\nE,8\nF,6\nG,5\nH,7\n');
  const blocked = cli(['make', pie, '--template', 'pie-chart', '--title', 'A et B dominent le marché', '--subtitle', 'Parts, en %', '--polarity', 'NEUTRAL_CATEGORICAL', '--no-check', '-o', 'output/camembert']);
  check(blocked.code === 1 && /PIE_DONUT_MAX_SLICES|SCHEMA_FORMATTED_DATA/.test(blocked.out) && !fs.existsSync(path.join(tmp, 'output/camembert/index.html')) && fs.existsSync(path.join(tmp, 'output/camembert/spec.json')),
    `make sur une spec non conforme : exit 1, règle citée, pas de page, spec gardée pour update (exit ${blocked.code})`);

  const kpi = write('kpi.json', JSON.stringify({ value: 148500, unit: '€', delta: 12.4, deltaLabel: 'vs octobre' }));
  const kpiMade = cli(['make', kpi, '--title', 'MRR de novembre', '--polarity', 'HIGHER_IS_BETTER', '--no-check', '-o', 'output/kpi']);
  check(kpiMade.code === 0 && readJson('output/kpi/spec.json').targetTemplateId === 'kpi-standard' && readJson('output/kpi/spec.json').formattedData.title === 'MRR de novembre',
    `make JSON KPI : kpi-standard déduit, titre reporté dans la carte (exit ${kpiMade.code})`);

  const ages = write('ages.csv', 'age,clients\n18-24 ans,120\n25-34 ans,340\n35-44 ans,280\n45-54 ans,190\n');
  cli(['make', ages, '--template', 'bar-chart-horizontal', '--title', 'Les 25-34 ans sont les plus nombreux', '--subtitle', 'Clients, en nombre', '--polarity', 'NEUTRAL_CATEGORICAL', '--no-check', '-o', 'output/ages']);
  check(readJson('output/ages/spec.json').formattedData.datasets[0].sorted === false, 'make : tranches d\'âge sur bar-chart-horizontal, ordre d\'origine gardé (sorted: false)');

  console.log('\n🔹 kit-charts update');
  write('regions.csv', 'region;CA (M€)\nÎle-de-France;430\nOccitanie;150\nBretagne;90\n');
  const upd = cli(['update', 'output/regions', '--no-check']);
  const updSpec = readJson('output/regions/spec.json');
  check(upd.code === 0 && same(updSpec.formattedData.datasets[0].data, [430, 150, 90]) && updSpec.layout.title === "L'Île-de-France pèse deux fois la suivante",
    `update sans --data : source relue, titre et template gardés (exit ${upd.code})`);
  const retitle = cli(['update', 'output/regions', '--title', "L'Île-de-France reste en tête", '--no-check']);
  check(retitle.code === 0 && readJson('output/regions/spec.json').layout.title === "L'Île-de-France reste en tête", 'update --title : seul le titre change');
  write('kpi.json', JSON.stringify({ value: 151200, unit: '€', delta: 1.8, deltaLabel: 'vs novembre' }));
  const kpiUpd = cli(['update', 'output/kpi', '--title', 'MRR de décembre', '--no-check']);
  const kpiSpec = readJson('output/kpi/spec.json');
  check(kpiUpd.code === 0 && kpiSpec.formattedData.value === 151200 && kpiSpec.formattedData.title === 'MRR de décembre',
    `update d'une carte KPI avec nouvelles données : titre reporté dans la carte (exit ${kpiUpd.code})`);
  const kpiRetitle = cli(['update', 'output/kpi', '--title', 'MRR de décembre, en hausse', '--no-check']);
  check(kpiRetitle.code === 0 && readJson('output/kpi/spec.json').formattedData.title === 'MRR de décembre, en hausse',
    'update --title seul sur une carte KPI : le titre de la carte suit');
  const missing = cli(['update', 'output/inexistant']);
  check(missing.code === 1 && /introuvable/.test(missing.out), 'update sur un dossier absent : exit 1, message explicite');

  console.log('\n🔹 Pages à plusieurs graphiques');
  fs.writeFileSync(path.join(tmp, 'output/page.json'), JSON.stringify({
    layout: { title: 'Le réseau progresse', subtitle: 'Bilan 2026', columns: 2 },
    colorStrategy: { themeName: 'nord-cognitive-dark' },
    charts: ['regions/spec.json', 'ages/spec.json', 'kpi/spec.json']
  }));
  const page = cli(['compile', 'output/page.json', '-o', 'output/bilan/index.html']);
  const html = fs.existsSync(path.join(tmp, 'output/bilan/index.html')) ? fs.readFileSync(path.join(tmp, 'output/bilan/index.html'), 'utf8') : '';
  const occurrences = (html.match(/Logique Spécifique du Template : bar-chart-horizontal/g) || []).length;
  check(page.code === 0 && /data-kc-page="3"/.test(html), `Page : 3 graphiques compilés en une page (exit ${page.code})`);
  check(occurrences === 1, `Page : code de bar-chart-horizontal inclus une fois pour deux graphiques (${occurrences})`);
  check((html.match(/Moteur de Thèmes kit-charts/g) || []).length === 1 && (html.match(/"nord-cognitive-dark"/g) || []).length >= 3,
    'Page : moteur de thèmes chargé une fois, thème de la page imposé à chaque graphique');

  const one = readJson('output/regions/spec.json');
  const tooMany = validatePageSpec({ layout: { title: 't' }, charts: Array.from({ length: 7 }, () => one) });
  const badCols = validatePageSpec({ layout: { title: 't', columns: 4 }, charts: [one] });
  check(tooMany.errors.some(e => e.ruleId === 'PAGE_TOO_MANY_CHARTS') && !validatePageSpec({ layout: { title: 't' }, charts: Array.from({ length: 6 }, () => one) }).errors.some(e => e.ruleId === 'PAGE_TOO_MANY_CHARTS'),
    'Page : 7 graphiques refusés (PAGE_TOO_MANY_CHARTS), 6 acceptés');
  check(badCols.errors.some(e => e.ruleId === 'PAGE_COLUMNS'), 'Page : 4 colonnes refusées (PAGE_COLUMNS)');
  const shortData = { labels: one.formattedData.labels, datasets: [{ label: 'CA', data: [1] }] };
  const badChart = validatePageSpec({ layout: { title: 't' }, charts: [one, Object.assign({}, one, { formattedData: shortData })] });
  check(badChart.errors.some(e => /^charts\[1\]/.test(e.message)), 'Page : l\'erreur d\'un graphique est préfixée par sa position (charts[1])');

  console.log('\n🔹 Mode hors ligne (copies locales vérifiées)');
  const offline = compileChart(one, { offline: true }).html;
  const online = compileChart(one, {}).html;
  check(!/<script src="https:\/\/cdn\.jsdelivr\.net/.test(offline) && /<script src="https:\/\/cdn\.jsdelivr\.net/.test(online),
    'Hors ligne : aucune balise script vers le CDN (la page en ligne en a)');
  check(offline.includes(pins.readVendor(pins.VENDOR['chart.js']).slice(0, 200)), 'Hors ligne : Chart.js épinglé inclus dans la page');
  const missingSums = Object.values(pins.VENDOR).filter(u => !pins.VENDOR_SHA384[u]);
  check(missingSums.length === 0, `Chaque dépendance épinglée a son empreinte SHA-384${missingSums.length ? ' | ' + missingSums.join(', ') : ''}`);
  const url = pins.VENDOR['chart.js'];
  const realSum = pins.VENDOR_SHA384[url];
  let tampered = '';
  pins.VENDOR_SHA384[url] = 'empreinte-falsifiee';
  try { pins.readVendor(url); } catch (e) { tampered = e.message; } finally { pins.VENDOR_SHA384[url] = realSum; }
  check(/SHA-384/.test(tampered), 'Copie locale dont l\'empreinte diffère : refusée');

  console.log('\n🔹 Statut de rendu d\'une page (render-check.js)');
  const s1 = parseRenderStatus('<div data-kc-page="3"><div data-kc-render="ok"></div><div data-kc-render="invalid" data-kc-error="trop de tranches"></div><div data-kc-render="ok"></div>');
  const s2 = parseRenderStatus('<div data-kc-page="3"><div data-kc-render="ok"></div>');
  const s3 = parseRenderStatus('<div data-kc-render="ok"></div>');
  check(s1.status === 'invalid' && /graphique 2\/3 : trop de tranches/.test(s1.reason), `Le pire statut l'emporte et nomme le graphique (${s1.status} : ${s1.reason})`);
  check(s2.status === 'error', `Graphiques de la page sans statut : erreur (${s2.status})`);
  check(s3.status === 'ok', 'Page à un graphique rendue : ok');
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

console.log(`\n🏁 Parcours en un appel : ${passed}/${passed + failed} tests réussis`);
process.exit(failed ? 1 : 0);
