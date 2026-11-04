#!/usr/bin/env node
/**
 * @file test/snapshot-configs.js
 * @description Filet de non-régression des configs émises par les templates.
 *
 * Capture la config Chart.js (ou l'objet de contrôle pour les templates
 * non-Chart comme les tableaux) produite par chaque template avec son
 * DEFAULT_DATA, pour chacun des 8 thèmes cognitifs, et la sérialise dans
 * test/__snapshots__/cognitive/.
 *
 * Déterminisme : Math.random est remplacé par un PRNG seedé (mulberry32)
 * car certains templates génèrent des IDs de plugin via Math.random
 * (ex. doughnutCenterKpi_xxxxx). Les fonctions sont remplacées par un
 * marqueur stable. Aucun timestamp n'est écrit dans les snapshots.
 *
 * Usage :
 *   node test/snapshot-configs.js          # (ré)génère les snapshots
 *   node test/snapshot-configs.js --check  # vérifie sans écrire (CI)
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SNAP_DIR = path.join(__dirname, '__snapshots__', 'cognitive');
const CHECK_MODE = process.argv.includes('--check');

// ---------------------------------------------------------------------------
// 0. PRNG déterministe (mulberry32, seed fixe) : neutralise Math.random
// ---------------------------------------------------------------------------
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const FIXED_SEED = 20260914;
function resetRandom() {
  Math.random = mulberry32(FIXED_SEED);
}
resetRandom();

// ---------------------------------------------------------------------------
// 1. Stub global Chart : capture la config passée au constructeur.
//    Doit être posé AVANT le require des templates.
// ---------------------------------------------------------------------------
class StubChart {
  constructor(canvas, config) {
    StubChart.lastConfig = config;
    this.canvas = canvas;
    this.config = config;
    this.data = config && config.data;
    this.options = config && config.options;
  }

  static getChart() {
    return null;
  }

  static register() {}

  destroy() {}

  update() {}

  resize() {}

  render() {}

  draw() {}
}
StubChart.lastConfig = null;
global.Chart = StubChart;

// ---------------------------------------------------------------------------
// 2. Registre + thèmes cognitifs
// ---------------------------------------------------------------------------
const registry = require('../.agents/skills/kit-charts/registry.json');
const themeTokens = require('../themes/theme-tokens.js');

// Le filet couvre les 8 thèmes cognitifs, comptés depuis le module de thèmes
// (aucun nombre magique : un thème ajouté est couvert d'office).
const COGNITIVE_THEMES = Array.isArray(themeTokens.THEME_NAMES)
  ? [...themeTokens.THEME_NAMES]
  : Object.keys(themeTokens.THEMES || {});

if (COGNITIVE_THEMES.length === 0) {
  console.error('❌ Aucun thème exporté par themes/theme-tokens.js');
  process.exit(1);
}

const SUITES = [
  { key: 'cognitive', themes: COGNITIVE_THEMES, dir: SNAP_DIR, createOptions: {} }
];

// ---------------------------------------------------------------------------
// 3. Sérialisation stable (clés triées, fonctions -> marqueur)
// ---------------------------------------------------------------------------
function stabilize(value, seen) {
  seen = seen || new Set();
  if (typeof value === 'function') {
    return `[Function:${value.name || 'anonymous'}]`;
  }
  if (typeof value === 'undefined') {
    return '[undefined]';
  }
  if (typeof value === 'symbol') {
    return `[Symbol:${String(value)}]`;
  }
  if (typeof value === 'bigint') {
    return `[BigInt:${value.toString()}]`;
  }
  if (value === null) return null;
  if (typeof value === 'number') {
    if (Number.isNaN(value)) return '[NaN]';
    if (!Number.isFinite(value)) return value > 0 ? '[Infinity]' : '[-Infinity]';
    return value;
  }
  if (typeof value !== 'object') return value;
  if (seen.has(value)) return '[Circular]';
  seen.add(value);
  let out;
  if (Array.isArray(value)) {
    out = value.map((v) => stabilize(v, seen));
  } else {
    out = {};
    for (const key of Object.keys(value).sort()) {
      try {
        out[key] = stabilize(value[key], seen);
      } catch (e) {
        out[key] = '[Unserializable]';
      }
    }
  }
  seen.delete(value);
  return out;
}

function stableStringify(value) {
  return JSON.stringify(stabilize(value), null, 2) + '\n';
}

// ---------------------------------------------------------------------------
// 4. Faux élément canvas/DOM (aucun document en Node)
// ---------------------------------------------------------------------------
function makeFakeCanvas() {
  const gradientStub = { addColorStop: () => {} };
  const ctxStub = new Proxy(
    {},
    {
      get(target, prop) {
        if (prop === 'createLinearGradient') return () => gradientStub;
        if (prop === 'canvas') return {};
        if (typeof prop === 'string') return () => gradientStub;
        return undefined;
      }
    }
  );
  return {
    tagName: 'DIV',
    parentElement: { querySelector: () => null, appendChild: () => {} },
    style: {},
    dataset: {},
    innerHTML: '',
    width: 800,
    height: 600,
    clientHeight: 0,
    clientWidth: 0,
    getContext: () => ctxStub,
    getAttribute: () => null,
    setAttribute: () => {},
    querySelector: () => null,
    querySelectorAll: () => [],
    getBoundingClientRect: () => ({ width: 800, height: 600, top: 0, left: 0 }),
    addEventListener: () => {},
    removeEventListener: () => {}
  };
}

// ---------------------------------------------------------------------------
// 5. Extraction de la partie snapshotable d'un résultat
// ---------------------------------------------------------------------------
const EXCLUDED_RESULT_KEYS = new Set(['canvas', 'ctx', 'target']);

function extractSnapshotPayload(result) {
  if (StubChart.lastConfig) {
    return { kind: 'chart-config', config: StubChart.lastConfig };
  }
  if (result && typeof result === 'object' && result.config) {
    return { kind: 'chart-config', config: result.config };
  }
  if (result && typeof result === 'object') {
    const cleaned = {};
    for (const key of Object.keys(result)) {
      if (EXCLUDED_RESULT_KEYS.has(key)) continue;
      cleaned[key] = result[key];
    }
    return { kind: 'control-object', result: cleaned };
  }
  return { kind: 'scalar', result };
}

// ---------------------------------------------------------------------------
// 6. Boucle principale : template × thème
// ---------------------------------------------------------------------------
let written = 0;
let checked = 0;
let mismatched = [];
let errors = [];

if (!CHECK_MODE) {
  for (const suite of SUITES) {
    if (!fs.existsSync(suite.dir)) fs.mkdirSync(suite.dir, { recursive: true });
  }
}

for (const suite of SUITES) {
const suiteTemplates = registry.templates;
for (const tpl of suiteTemplates) {
  let mod;
  try {
    mod = require(path.join(ROOT, tpl.paths.js));
  } catch (e) {
    errors.push(`${tpl.id}: require impossible : ${e.message}`);
    continue;
  }
  if (!mod || typeof mod.createChart !== 'function') {
    errors.push(`${tpl.id}: createChart manquant dans ${tpl.paths.js}`);
    continue;
  }

  for (const themeName of suite.themes) {
    resetRandom();
    StubChart.lastConfig = null;
    const fake = makeFakeCanvas();
    let result = null;
    let callError = null;
    try {
      result = mod.createChart(fake, null, themeName, suite.createOptions);
    } catch (e) {
      callError = e;
    }
    if (callError) {
      errors.push(`${tpl.id} × ${themeName}: createChart a levé : ${callError.message}`);
      continue;
    }
    const payload = extractSnapshotPayload(result);
    if (!payload.config && !payload.result) {
      errors.push(`${tpl.id} × ${themeName}: aucun payload capturé (ni Chart ni objet de contrôle)`);
      continue;
    }

    const doc = {
      _meta: {
        generator: 'test/snapshot-configs.js',
        templateId: tpl.id,
        family: tpl.family,
        themeName
      },
      payload: stabilize(payload)
    };
    const serialized = stableStringify(doc);
    const fileName = `${tpl.id}--${themeName}.json`;
    const filePath = path.join(suite.dir, fileName);

    if (CHECK_MODE) {
      checked++;
      let existing = null;
      try {
        existing = fs.readFileSync(filePath, 'utf8');
      } catch (e) {
        mismatched.push(`${suite.key}/${fileName}: snapshot absent`);
        continue;
      }
      if (existing !== serialized) {
        mismatched.push(`${suite.key}/${fileName}: contenu différent`);
      }
    } else {
      fs.writeFileSync(filePath, serialized);
      written++;
    }
  }
}
}

// ---------------------------------------------------------------------------
// 7. Rapport
// ---------------------------------------------------------------------------
let expectedTotal = 0;
for (const suite of SUITES) {
  const suiteTemplateCount = registry.templates.length;
  const expected = suiteTemplateCount * suite.themes.length;
  expectedTotal += expected;
  console.log(`Suite ${suite.key} : ${suiteTemplateCount} templates × ${suite.themes.length} thèmes = ${expected} snapshots`);
}
const expected = expectedTotal;
console.log(`Thèmes    : ${COGNITIVE_THEMES.join(', ')}`);
console.log('──────────────────────────────────────────────');

if (errors.length > 0) {
  console.error(`\n❌ ${errors.length} erreur(s) :`);
  for (const e of errors) console.error(`   - ${e}`);
  process.exit(1);
}

if (CHECK_MODE) {
  console.log(`Vérifiés : ${checked}/${expected}`);
  if (mismatched.length > 0) {
    console.error(`\n❌ ${mismatched.length} snapshot(s) en écart :`);
    for (const m of mismatched.slice(0, 20)) console.error(`   - ${m}`);
    if (mismatched.length > 20) console.error(`   … et ${mismatched.length - 20} autre(s)`);
    process.exit(1);
  }
  console.log('✅ Tous les snapshots sont identiques (reproductible).');
} else {
  console.log(`Écrits   : ${written}/${expected} dans test/__snapshots__/cognitive/`);
  if (written !== expected) {
    console.error(`❌ Compte inattendu : ${written} écrits pour ${expected} attendus`);
    process.exit(1);
  }
  console.log('✅ Snapshots générés. Relancez pour vérifier la reproductibilité (--check).');
}
