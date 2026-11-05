#!/usr/bin/env node
/**
 * @file test/export-tests.js
 * @description Export PNG, SVG et PDF dans Chrome headless. Les pages sont compilées hors ligne
 * (--offline) : aucun réseau requis. Sans Chrome : exit 2 (comme kit-charts check).
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SCRIPTS = path.join(ROOT, '.agents/skills/kit-charts/scripts');
const { compileChart } = require(path.join(SCRIPTS, 'compile-chart.js'));
const { exportPage } = require(path.join(SCRIPTS, 'export-chart.js'));
const { findChrome } = require(path.join(SCRIPTS, 'render-check.js'));
const { VENDOR, readVendor } = require(path.join(SCRIPTS, 'vendor-pins.js'));

let passed = 0;
let failed = 0;
function check(cond, label) {
  if (cond) { passed++; console.log(`  ✅ [PASS] ${label}`); } else { failed++; console.log(`  ❌ [FAIL] ${label}`); }
}

const bar = {
  targetTemplateId: 'bar-chart-horizontal',
  layout: { title: 'Lyon dépasse Paris', subtitle: 'CA 2026, en k€' },
  colorStrategy: { metricPolarity: 'HIGHER_IS_BETTER' },
  formattedData: { labels: ['Lyon', 'Paris', 'Lille'], datasets: [{ label: 'CA (k€)', data: [140, 120, 80] }] }
};
const line = {
  targetTemplateId: 'line-chart',
  layout: { title: 'Le CA progresse chaque trimestre', subtitle: 'CA, en k€' },
  colorStrategy: { metricPolarity: 'HIGHER_IS_BETTER' },
  formattedData: { labels: ['T1', 'T2', 'T3', 'T4'], datasets: [{ label: 'CA (k€)', data: [80, 95, 105, 120] }] }
};

async function main() {
  const chrome = findChrome();
  if (!chrome) { console.error('Chrome introuvable : tests d\'export ignorés (CHROME_PATH).'); process.exit(2); }
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kc-export-test-'));
  try {
    console.log('\n🔹 Export d\'une page à plusieurs graphiques (hors ligne)');
    const page = compileChart({ layout: { title: 'Bilan', columns: 2 }, charts: [bar, line] }, { offline: true, output: path.join(tmp, 'bilan/index.html') });
    const maxWidth = Number(page.html.match(/max-width: (\d+)px/)[1]);
    const r = await exportPage(page.outputPath, { formats: ['png', 'svg', 'pdf'], chrome, scale: 2 });
    const file = f => (r.files.find(x => x.format === f) || {}).file;
    check(r.status === 'ok' && r.files.length === 3 && r.errors.length === 0, `Trois formats exportés, rendu ok (statut ${r.status}${r.errors.length ? ', ' + r.errors.map(e => e.message).join(' ; ') : ''})`);

    const png = file('png') ? fs.readFileSync(file('png')) : Buffer.alloc(0);
    const pngWidth = png.length > 24 ? png.readUInt32BE(16) : 0;
    check(png.slice(1, 4).toString() === 'PNG' && pngWidth === (maxWidth + 48) * 2, `PNG à densité 2 : largeur ${pngWidth} = (${maxWidth} + 48) × 2`);

    const svg = file('svg') ? fs.readFileSync(file('svg'), 'utf8') : '';
    check(/<svg[^>]*viewBox=/.test(svg) && (svg.match(/<path/g) || []).length > 10 && !/<image/.test(svg),
      `SVG vectoriel : chemins dessinés, aucune image incluse (${(svg.match(/<path/g) || []).length} chemins)`);
    check(['Lyon dépasse Paris', 'Le CA progresse chaque trimestre', 'Lyon', 'T4'].every(t => svg.includes(`>${t}<`)),
      'SVG : titres HTML et libellés d\'axes en texte');
    // La courbe lissée passe par Path2D : sans relecture des commandes, elle disparaît du SVG.
    const curves = (svg.match(/<path fill="none" stroke="#[0-9A-Fa-f]{6}"[^>]* d="[^"]*( C [^"]*){3}"/g) || []).length;
    check(curves >= 1, `SVG : la courbe du line-chart (Path2D, 3 segments de Bézier) est tracée (${curves})`);

    const pdf = file('pdf') ? fs.readFileSync(file('pdf')) : Buffer.alloc(0);
    const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
    check(pdf.slice(0, 5).toString() === '%PDF-' && pages === 1, `PDF d'une seule page (${pages})`);

    console.log('\n🔹 Refus d\'exporter un rendu en échec');
    const broken = compileChart(bar, { offline: true }).html.replace(readVendor(VENDOR['chart.js']).replace(/<\/script/gi, '<\\/script'), '');
    const brokenFile = path.join(tmp, 'casse/index.html');
    fs.mkdirSync(path.dirname(brokenFile), { recursive: true });
    fs.writeFileSync(brokenFile, broken);
    const b = await exportPage(brokenFile, { formats: ['png'], chrome });
    check(b.status !== 'ok' && b.files.length === 0 && !fs.existsSync(path.join(tmp, 'casse/index.png')),
      `Page sans Chart.js : statut ${b.status}, rien exporté (${b.reason})`);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  console.log(`\n🏁 Export : ${passed}/${passed + failed} tests réussis`);
  process.exit(failed ? 1 : 0);
}

main().catch(err => { console.error(err); process.exit(1); });
