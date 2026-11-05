#!/usr/bin/env node
// @ts-check
/**
 * @file test/narrow-tests.js
 * @description Lisibilité sur petit écran, mesurée dans Chrome headless. Pages compilées hors
 * ligne (--offline) : aucun réseau requis. Sans Chrome : exit 2 (comme kit-charts check).
 *
 * Invariants vérifiés à plusieurs largeurs de fenêtre (téléphone, tablette, portable) :
 * - libellés d'axe x de waterfall-cumulative-line : deux libellés voisins ne se touchent pas ;
 * - tableaux : aucun élément ne déborde de la zone (pas de défilement horizontal), et le texte
 *   d'une cellule ne touche pas ses voisines (au moins 1 px libre de chaque côté).
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SCRIPTS = path.join(ROOT, '.agents/skills/kit-charts/scripts');
const { compileChart } = require(path.join(SCRIPTS, 'compile-chart.js'));
const { launchChrome, connect } = require(path.join(SCRIPTS, 'export-chart.js'));
const { findChrome } = require(path.join(SCRIPTS, 'render-check.js'));

let passed = 0;
let failed = 0;
/** @param {boolean} cond @param {string} label */
function check(cond, label) {
  if (cond) {
    passed++;
    console.log(`  ✅ [PASS] ${label}`);
  } else {
    failed++;
    console.log(`  ❌ [FAIL] ${label}`);
  }
}

const sleep = (/** @type {number} */ ms) => new Promise((r) => setTimeout(r, ms));

// Largeurs de fenêtre : petit téléphone, téléphone courant, carte de galerie, tablette, portable.
const VIEWPORTS = [340, 375, 428, 600, 1000];

/** Mesure exécutée dans la page : chevauchement des libellés de l'axe x (Chart.js). */
const MEASURE_TICKS = `(function () {
  var canvas = document.querySelector('canvas');
  var chart = canvas && window.Chart && Chart.getChart(canvas);
  if (!chart) return null;
  var scale = chart.scales.x;
  var ctx = chart.ctx;
  var items = scale.getLabelItems();
  var boxes = items.map(function (it) {
    ctx.save();
    ctx.font = it.font.string;
    var lines = Array.isArray(it.label) ? it.label : [it.label];
    var w = Math.max.apply(null, lines.map(function (l) { return ctx.measureText(String(l)).width; }));
    ctx.restore();
    var x = it.options.translation[0];
    return { left: x - w / 2, right: x + w / 2, lines: lines.map(String) };
  });
  var gaps = [];
  for (var i = 1; i < boxes.length; i++) gaps.push(boxes[i].left - boxes[i - 1].right);
  return { gaps: gaps, lines: boxes.map(function (b) { return b.lines; }), count: boxes.length };
})()`;

/** Mesure exécutée dans la page : plus grand débordement horizontal d'un élément. */
const MEASURE_OVERFLOW = `(function () {
  var zone = document.querySelector('.kit-charts-standalone-container');
  var worst = { px: 0, who: '' };
  zone.querySelectorAll('*').forEach(function (e) {
    var over = e.scrollWidth - e.clientWidth;
    // Texte réservé aux lecteurs d'écran (boîte d'1 px rognée) : invisible, ignoré
    if (e.clientWidth > 1 && over > worst.px) worst = { px: over, who: e.tagName + '.' + String(e.className).slice(0, 40) };
  });
  var zoneOver = Math.round(zone.getBoundingClientRect().width - zone.clientWidth);
  // Chiffres lisibles : le texte visible d'une cellule laisse au moins 1 px de chaque côté
  var tight = { px: Infinity, text: '' };
  zone.querySelectorAll('td').forEach(function (td) {
    var walker = document.createTreeWalker(td, NodeFilter.SHOW_TEXT);
    var text = 0;
    var shown = '';
    for (var n = walker.nextNode(); n; n = walker.nextNode()) {
      if (!n.textContent.trim() || (n.parentElement !== td && n.parentElement.getBoundingClientRect().width <= 1)) continue;
      var r = document.createRange();
      r.selectNodeContents(n);
      text += r.getBoundingClientRect().width;
      shown += n.textContent.trim();
    }
    if (text === 0) return;
    var free = td.getBoundingClientRect().width - text;
    if (free < tight.px) tight = { px: free, text: shown };
  });
  return { worst: worst, page: document.documentElement.scrollWidth - window.innerWidth, zone: zone.clientWidth, zoneOver: zoneOver, tight: tight };
})()`;

async function main() {
  const chrome = findChrome();
  if (!chrome) {
    console.error("Chrome introuvable : tests petit écran ignorés (CHROME_PATH).");
    process.exit(2);
  }
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kc-narrow-test-'));
  const { child, wsUrl, profile } = await launchChrome(chrome);
  const cdp = await connect(wsUrl);
  try {
    const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
    const send = (/** @type {string} */ m, /** @type {Object} */ p = {}) => cdp.send(m, p, sessionId);
    await send('Page.enable');
    await send('Runtime.enable');
    /** @param {string} expression */
    const evaluate = async (expression) => {
      const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      return r.exceptionDetails ? null : r.result.value;
    };
    /** Ouvre une page compilée à la largeur de fenêtre voulue et attend le rendu. */
    const open = async (/** @type {string} */ file, /** @type {number} */ viewport) => {
      await send('Emulation.setDeviceMetricsOverride', { width: viewport, height: 800, deviceScaleFactor: 1, mobile: false });
      await send('Page.navigate', { url: `file://${file}` });
      const deadline = Date.now() + 15000;
      while (Date.now() < deadline) {
        const st = await evaluate(`document.readyState === 'complete' && (document.querySelector('[data-kc-render]') || {}).getAttribute && document.querySelector('[data-kc-render]').getAttribute('data-kc-render')`);
        if (st) return st;
        await sleep(100);
      }
      return null;
    };
    /** @param {string} id */
    const page = (id) => {
      const out = path.join(tmp, id, 'index.html');
      compileChart({ targetTemplateId: id, layout: { title: `${id} reste lisible`, subtitle: 'Données d’exemple, en k€' } }, { offline: true, output: out });
      return out;
    };

    console.log('\n🔹 waterfall-cumulative-line : libellés d’axe x séparés');
    const waterfall = page('waterfall-cumulative-line');
    for (const vw of VIEWPORTS) {
      const st = await open(waterfall, vw);
      await sleep(300);
      const m = st === 'ok' ? await evaluate(MEASURE_TICKS) : null;
      const minGap = m ? Math.min(...m.gaps) : -Infinity;
      const readable = !!m && m.lines.every((/** @type {string[]} */ l) => l.join('').replace(/[.\s]/g, '').length >= 3);
      check(!!m && m.count === 7 && minGap >= 2 && readable,
        `fenêtre ${vw} px : ${m ? m.count : 0} libellés, écart minimal ${Number.isFinite(minGap) ? minGap.toFixed(1) : '?'} px (≥ 2), libellés d’au moins 3 lettres (${m ? m.lines.map((/** @type {string[]} */ l) => l.join(' ')).join(' | ') : st})`);
    }

    for (const id of ['table-financial-variance', 'table-heatmap-matrix']) {
      console.log(`\n🔹 ${id} : tient dans sa zone`);
      const file = page(id);
      for (const vw of VIEWPORTS) {
        const st = await open(file, vw);
        await sleep(300);
        const m = st === 'ok' ? await evaluate(MEASURE_OVERFLOW) : null;
        check(!!m && m.worst.px <= 1 && m.page <= 0 && m.zoneOver <= 1 && m.tight.px >= 2,
          `fenêtre ${vw} px (zone ${m ? m.zone : '?'} px) : débordement ${m ? m.worst.px : '?'} px${m && m.worst.who ? ' (' + m.worst.who + ')' : ''}, page ${m ? m.page : '?'} px, marge minimale autour d’un texte de cellule ${m ? m.tight.px.toFixed(1) : '?'} px (≥ 2, « ${m ? m.tight.text : ''} ») (rendu ${st})`);
      }
    }
  } finally {
    cdp.close();
    child.kill('SIGKILL');
    await new Promise((r) => (child.exitCode !== null ? r(null) : child.once('exit', r)));
    fs.rmSync(tmp, { recursive: true, force: true });
    fs.rmSync(profile, { recursive: true, force: true, maxRetries: 3 });
  }
  console.log(`\n🏁 Petit écran : ${passed}/${passed + failed} tests réussis`);
  process.exit(failed ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
