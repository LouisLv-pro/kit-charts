/**
 * @file .agents/skills/kit-charts/scripts/render-check.js
 * @description Contrôle du rendu réel d'une page compilée, dans Chrome headless (zéro dépendance npm).
 * Le linter ne lit que la spec ; ce script ouvre la page et lit le statut que le script
 * d'initialisation compilé pose sur le conteneur : data-kc-render = ok | invalid | error.
 *
 * Usage :
 *   node render-check.js output/<slug>/index.html [autres.html...] [--json]
 *   node render-check.js --all-templates [--only id1,id2] [--json]
 *
 * Codes de sortie : 0 tout est rendu, 1 au moins un rendu en échec, 2 Chrome introuvable.
 * Le réseau est requis : Chart.js et ses plugins viennent du CDN épinglé (vendor-pins.js).
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '../../../..');
const REGISTRY_PATH = path.join(ROOT_DIR, '.agents/skills/kit-charts/registry.json');
const VIRTUAL_TIME_BUDGET_MS = 10000;
const PROCESS_TIMEOUT_MS = 45000;
const CONCURRENCY = 4;

/**
 * Trouve un exécutable Chrome ou Chromium : CHROME_PATH d'abord, puis les emplacements usuels.
 * @returns {string|null}
 */
function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  ].filter(Boolean);
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  for (const bin of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser']) {
    const r = spawnSync('which', [bin], { encoding: 'utf8' });
    if (r.status === 0 && r.stdout.trim()) return r.stdout.trim();
  }
  return null;
}

/**
 * Extrait le statut de rendu du DOM sérialisé.
 * @param {string} dom
 * @returns {{status: string, reason: string}}
 */
function parseRenderStatus(dom) {
  const tag = dom.match(/<[^>]*\bdata-kc-render="([^"]*)"[^>]*>/);
  if (!tag) {
    return { status: 'error', reason: 'aucun statut data-kc-render : le script d\'initialisation ne s\'est pas exécuté' };
  }
  const reason = (tag[0].match(/\bdata-kc-error="([^"]*)"/) || [])[1] || '';
  return { status: tag[1], reason: reason.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>') };
}

/**
 * Ouvre une page dans Chrome headless et renvoie son statut de rendu.
 * @param {string} chrome - Exécutable
 * @param {string} htmlPath - Page compilée
 * @returns {Promise<{file: string, status: string, reason: string}>}
 */
function checkPage(chrome, htmlPath) {
  const abs = path.resolve(htmlPath);
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'kc-chrome-'));
  const args = [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--hide-scrollbars', `--user-data-dir=${profile}`,
    `--virtual-time-budget=${VIRTUAL_TIME_BUDGET_MS}`, '--dump-dom', `file://${abs}`
  ];
  return new Promise(resolve => {
    const child = spawn(chrome, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    const timer = setTimeout(() => child.kill('SIGKILL'), PROCESS_TIMEOUT_MS);
    child.stdout.on('data', d => { out += d; });
    child.on('close', () => {
      clearTimeout(timer);
      fs.rmSync(profile, { recursive: true, force: true });
      const parsed = out ? parseRenderStatus(out) : { status: 'error', reason: 'Chrome n\'a rien renvoyé (délai dépassé ?)' };
      resolve(Object.assign({ file: abs }, parsed));
    });
  });
}

/**
 * Vérifie une liste de pages avec une concurrence bornée.
 */
async function checkPages(chrome, files) {
  const results = new Array(files.length);
  let next = 0;
  const worker = async () => {
    while (next < files.length) {
      const i = next++;
      results[i] = await checkPage(chrome, files[i]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, files.length) }, worker));
  return results;
}

/**
 * Compile chaque template du registre avec son DEFAULT_DATA fourni comme formattedData
 * (le chemin qu'emprunte un agent) et renvoie les pages produites.
 */
function compileAllTemplates(onlyIds) {
  const { compileChart } = require('./compile-chart.js');
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'kc-render-'));
  const pages = [];
  for (const t of registry.templates) {
    if (onlyIds && !onlyIds.includes(t.id)) continue;
    const mod = require(path.join(ROOT_DIR, t.paths.js));
    const res = compileChart({
      targetTemplateId: t.id,
      layout: { title: t.name, footnote: 'Contrôle de rendu kit-charts' },
      formattedData: mod.DEFAULT_DATA
    }, { strict: false, output: path.join(outDir, t.id, 'index.html') });
    pages.push({ id: t.id, file: res.outputPath });
  }
  return { outDir, pages };
}

async function main() {
  const args = process.argv.slice(2);
  const asJson = args.includes('--json');
  const chrome = findChrome();
  if (!chrome) {
    console.error('Chrome ou Chromium introuvable. Définir CHROME_PATH vers l\'exécutable.');
    process.exit(2);
  }

  let pages;
  let outDir = null;
  if (args.includes('--all-templates')) {
    const onlyIdx = args.indexOf('--only');
    const only = onlyIdx >= 0 ? String(args[onlyIdx + 1] || '').split(',').filter(Boolean) : null;
    const compiled = compileAllTemplates(only);
    pages = compiled.pages;
    outDir = compiled.outDir;
  } else {
    pages = args.filter(a => !a.startsWith('--')).map(f => ({ id: path.basename(path.dirname(path.resolve(f))) + '/' + path.basename(f), file: f }));
  }
  if (pages.length === 0) {
    console.error('Usage : render-check.js <page.html...> | --all-templates [--only id1,id2] [--json]');
    process.exit(2);
  }

  const results = await checkPages(chrome, pages.map(p => p.file));
  const report = results.map((r, i) => ({ id: pages[i].id, status: r.status, reason: r.reason, file: r.file }));
  const failed = report.filter(r => r.status !== 'ok');

  if (asJson) {
    console.log(JSON.stringify({ total: report.length, failed: failed.length, results: report }, null, 2));
  } else {
    report.forEach(r => console.log(`${r.status === 'ok' ? '✅' : '❌'} ${r.id.padEnd(28)} ${r.status}${r.reason ? ' : ' + r.reason : ''}`));
    console.log(`\nRendu réel : ${report.length - failed.length}/${report.length} pages rendues.`);
  }
  if (outDir && failed.length === 0) fs.rmSync(outDir, { recursive: true, force: true });
  else if (outDir) console.error(`Pages en échec conservées dans ${outDir}`);
  process.exit(failed.length ? 1 : 0);
}

if (require.main === module) {
  main();
}

module.exports = { findChrome, checkPage, checkPages, parseRenderStatus, compileAllTemplates };
