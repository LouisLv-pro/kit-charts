/**
 * @file .agents/skills/kit-charts/scripts/table-import.js
 * @description Import de données tabulaires (CSV, TSV, JSON en lignes) vers le formattedData
 * d'un template. L'agent ne recopie plus les valeurs à la main dans la spec : il désigne les
 * colonnes, le script fait la conversion (moins de tokens, aucune erreur de recopie).
 *
 * Correspondance des colonnes (toutes facultatives) :
 *   label  : colonne des catégories (défaut : première colonne non numérique)
 *   value  : colonnes de valeurs, une série par colonne (défaut : toutes les colonnes numériques)
 *   series : colonne qui nomme la série (format long : une ligne par catégorie × série)
 *   x, y, r: nuages de points et bulles (r facultatif)
 * @license MIT
 */

'use strict';

const fs = require('fs');
const path = require('path');

/** Découpe une ligne CSV en respectant les guillemets ("a;b", "dit ""oui"""). */
function splitCsvLine(line, delimiter) {
  const out = [];
  let cur = '';
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cur += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === delimiter) { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur);
  return out.map(v => v.trim());
}

/** Délimiteur le plus fréquent hors guillemets dans l'en-tête : tabulation, point-virgule ou virgule. */
function detectDelimiter(headerLine) {
  const counts = { '\t': 0, ';': 0, ',': 0 };
  let quoted = false;
  for (const ch of headerLine) {
    if (ch === '"') quoted = !quoted;
    else if (!quoted && ch in counts) counts[ch]++;
  }
  const [best, n] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return n > 0 ? best : ',';
}

/**
 * Convertit une cellule en nombre : « 1 234,5 », « 1,234.5 », « 12 % », « 45 k€ » (unité
 * retirée, pas de multiplication). Renvoie null pour une cellule vide, undefined si ce n'est
 * pas un nombre.
 */
function parseNumber(raw) {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : undefined;
  let s = String(raw).trim();
  if (s === '' || /^(na|n\/a|null|-|—)$/i.test(s)) return null;
  s = s.replace(/[\s  ]/g, '').replace(/(%|‰|[a-zA-Z€$£¥°]+)$/u, '').replace(/^[€$£¥]/, '');
  if (!/^[-+]?[\d.,]+$/.test(s)) return undefined;
  const lastComma = s.lastIndexOf(',');
  const lastDot = s.lastIndexOf('.');
  if (lastComma > -1 && lastDot > -1) {
    // Le dernier séparateur est le décimal, l'autre groupe les milliers.
    s = lastComma > lastDot ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '');
  } else if (lastComma > -1) {
    // « 1,234 » (3 chiffres après une seule virgule) reste ambigu : traité en décimal à la française.
    s = (s.match(/,/g).length > 1) ? s.replace(/,/g, '') : s.replace(',', '.');
  } else if ((s.match(/\./g) || []).length > 1) {
    s = s.replace(/\./g, '');
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * Lit un tableau depuis du texte CSV/TSV ou un tableau JSON d'objets.
 * @param {string|Array<Object>} input
 * @returns {{columns: string[], rows: Array<Object>, numeric: Set<string>}}
 */
function parseTable(input) {
  let columns;
  let rows;
  if (Array.isArray(input)) {
    if (!input.length || typeof input[0] !== 'object' || Array.isArray(input[0])) {
      throw new Error('Tableau JSON attendu : une liste d\'objets, une clé par colonne.');
    }
    columns = [];
    input.forEach(r => Object.keys(r).forEach(k => { if (!columns.includes(k)) columns.push(k); }));
    rows = input.map(r => Object.assign({}, r));
  } else {
    const lines = String(input).replace(/^﻿/, '').split(/\r?\n/).filter(l => l.trim() !== '');
    if (lines.length < 2) throw new Error('CSV vide : une ligne d\'en-tête et au moins une ligne de données attendues.');
    const delimiter = detectDelimiter(lines[0]);
    columns = splitCsvLine(lines[0], delimiter);
    rows = lines.slice(1).map((line, i) => {
      const cells = splitCsvLine(line, delimiter);
      if (cells.length !== columns.length) {
        throw new Error(`CSV ligne ${i + 2} : ${cells.length} cellule(s) pour ${columns.length} colonne(s).`);
      }
      const row = {};
      columns.forEach((c, j) => { row[c] = cells[j]; });
      return row;
    });
  }
  // Colonne numérique : au moins 80 % des cellules non vides sont des nombres.
  const numeric = new Set(columns.filter(c => {
    const vals = rows.map(r => r[c]).filter(v => v !== null && v !== undefined && String(v).trim() !== '');
    return vals.length > 0 && vals.filter(v => parseNumber(v) !== undefined).length / vals.length >= 0.8;
  }));
  return { columns, rows, numeric };
}

/** Lit un fichier .csv, .tsv, .txt ou .json (tableau d'objets). Renvoie null si le JSON n'est pas tabulaire. */
function loadTableFile(file) {
  const abs = path.resolve(process.cwd(), file);
  const text = fs.readFileSync(abs, 'utf8');
  if (/\.json$/i.test(abs)) {
    const json = JSON.parse(text);
    return Array.isArray(json) && json.length && typeof json[0] === 'object' && !Array.isArray(json[0]) ? parseTable(json) : null;
  }
  return parseTable(text);
}

function requireColumn(table, name, role) {
  if (!table.columns.includes(name)) {
    throw new Error(`Colonne ${role} "${name}" absente. Colonnes : ${table.columns.join(', ')}.`);
  }
  return name;
}

function splitList(v) {
  if (!v) return null;
  return Array.isArray(v) ? v : String(v).split(',').map(s => s.trim()).filter(Boolean);
}

// Templates dont chaque catégorie porte la liste brute de ses observations (data: [[...], [...]]).
const SAMPLE_TEMPLATES = new Set(['box-strip-plot', 'raincloud-plot', 'violin-plot']);
const XY_KEYS = new Set(['x', 'y', 'z', 'r', 'label']);

/**
 * Forme de formattedData qu'un template attend, lue sur son DEFAULT_DATA (les schema.json des
 * nuages de points sont trop lâches pour la déduire).
 * @param {Object} defaultData - DEFAULT_DATA du template
 * @param {string} templateId
 * @returns {{shape: 'labels-datasets'|'xy'|'samples'|'other', sizeKey?: string}}
 */
function shapeOfTemplate(defaultData, templateId) {
  if (SAMPLE_TEMPLATES.has(templateId)) return { shape: 'samples' };
  if (templateId === 'box-plot') return { shape: 'box-stats' };
  if (templateId === 'waterfall-chart') return { shape: 'waterfall' };
  if (templateId === 'gantt-progress') return { shape: 'gantt' };
  if (templateId === 'slope-chart') return { shape: 'labels-datasets', transposeWhenWide: true };
  const d = defaultData || {};
  const ds = Array.isArray(d.datasets) ? d.datasets : null;
  const first = ds && ds[0] && Array.isArray(ds[0].data) ? ds[0].data.find(v => v !== null && v !== undefined) : undefined;
  if (ds && Array.isArray(d.labels) && (typeof first === 'number' || first === undefined)) return { shape: 'labels-datasets' };
  if (ds && !d.labels && first && typeof first === 'object' && 'x' in first && 'y' in first
      && Object.keys(first).every(k => XY_KEYS.has(k))) {
    return { shape: 'xy', sizeKey: 'z' in first ? 'z' : ('r' in first ? 'r' : undefined) };
  }
  return { shape: 'other' };
}

/**
 * Construit formattedData à partir d'un tableau.
 * @param {Object} table - sortie de parseTable
 * @param {Object} mapping - { label, value, series, x, y, r }
 * @param {string} [shape='labels-datasets'] - forme attendue par le template
 * @returns {{formattedData: Object, mapping: Object}} mapping résolu (colonnes réellement utilisées)
 */
function tableToFormattedData(table, mapping = {}, shape = 'labels-datasets', sizeKey = 'r') {
  const nonNumeric = table.columns.filter(c => !table.numeric.has(c));
  const num = (v, col, i) => {
    const n = parseNumber(v);
    if (n === undefined) throw new Error(`Valeur non numérique "${v}" en colonne "${col}", ligne ${i + 2}.`);
    return n;
  };

  if (shape === 'xy' || mapping.x || mapping.y) {
    const numericCols = table.columns.filter(c => table.numeric.has(c));
    const x = requireColumn(table, mapping.x || numericCols[0], 'x');
    const y = requireColumn(table, mapping.y || numericCols.find(c => c !== x), 'y');
    if (!x || !y) throw new Error('Nuage de points : deux colonnes numériques attendues (--x et --y).');
    const r = mapping.r ? requireColumn(table, mapping.r, 'r') : null;
    const series = mapping.series ? requireColumn(table, mapping.series, 'series') : null;
    const groups = new Map();
    table.rows.forEach((row, i) => {
      const key = series ? String(row[series]) : (mapping.seriesLabel || y);
      if (!groups.has(key)) groups.set(key, []);
      const pt = { x: num(row[x], x, i), y: num(row[y], y, i) };
      if (r) pt[sizeKey || 'r'] = num(row[r], r, i);
      if (mapping.label && row[mapping.label] !== undefined) pt.label = String(row[mapping.label]);
      groups.get(key).push(pt);
    });
    return {
      formattedData: { datasets: [...groups].map(([label, data]) => ({ label, data })) },
      mapping: { x, y, r: r || undefined, series: series || undefined, label: mapping.label || undefined }
    };
  }

  if (shape === 'waterfall') {
    // Pont : première ligne = total de départ, variations signées, dernière ligne = total
    // d'arrivée si elle vaut le cumul (à 1 % près). Les variations deviennent des paires
    // chaînées [cumul avant, cumul après] : c'est ce que dessine waterfall-chart.
    const label = requireColumn(table, mapping.label || nonNumeric[0], 'label');
    const valueCols = splitList(mapping.value) || table.columns.filter(c => table.numeric.has(c) && c !== label);
    if (valueCols.length !== 1) throw new Error(`Pont waterfall : une colonne de valeur attendue, trouvé ${valueCols.length}. Préciser --value.`);
    const value = requireColumn(table, valueCols[0], 'value');
    const vals = table.rows.map((row, i) => num(row[value], value, i));
    const round = v => Math.round(v * 1e6) / 1e6;
    let cum = vals[0];
    const data = [[0, vals[0]]];
    const last = vals.length - 1;
    for (let i = 1; i <= last; i++) {
      const isTotal = i === last && Math.abs(vals[i] - cum) <= Math.max(Math.abs(vals[i]) * 0.01, 1e-9);
      if (isTotal) { data.push([0, vals[i]]); continue; }
      data.push([round(cum), round(cum + vals[i])]);
      cum = round(cum + vals[i]);
    }
    return {
      formattedData: { labels: table.rows.map(r => String(r[label])), datasets: [{ label: mapping.seriesLabel || value, data }] },
      mapping: { label, value: [value] }
    };
  }

  if (shape === 'gantt') {
    // Planning : une ligne par tâche (libellé, début, fin, avancement en %), semaine du jour en --today.
    const pick = (role, re) => mapping[role] || table.columns.find(c => re.test(c));
    const label = requireColumn(table, mapping.label || nonNumeric[0], 'label');
    const start = requireColumn(table, pick('start', /d[ée]but|start/i), 'start (--start)');
    const end = requireColumn(table, pick('end', /fin|end/i), 'end (--end)');
    const progressCol = pick('progress', /avancement|progress|%/i);
    const tasks = table.rows.map((row, i) => ({
      label: String(row[label]),
      start: num(row[start], start, i),
      end: num(row[end], end, i),
      progress: progressCol ? (num(row[progressCol], progressCol, i) ?? 0) : 0
    }));
    const ds = { label: mapping.seriesLabel || 'Planning', tasks };
    if (mapping.today !== undefined) ds.todayWeek = Number(mapping.today);
    return {
      formattedData: { labels: tasks.map(t => t.label), datasets: [ds] },
      mapping: { label, start, end, progress: progressCol, today: mapping.today }
    };
  }

  if (shape === 'box-stats') {
    // Boîte à moustaches : quartiles calculés ici (méthode de stat-helpers.js), moustaches à
    // 1,5 écart interquartile (Tukey), valeurs au-delà en points isolés.
    const { quantile } = require(path.resolve(__dirname, '../../../../themes/stat-helpers.js'));
    const built = tableToFormattedData(table, mapping, 'samples');
    built.formattedData.datasets = built.formattedData.datasets.map(ds => Object.assign({}, ds, {
      data: ds.data.map(values => {
        const sorted = values.slice().sort((a, b) => a - b);
        const q1 = quantile(sorted, 0.25);
        const median = quantile(sorted, 0.5);
        const q3 = quantile(sorted, 0.75);
        const fence = 1.5 * (q3 - q1);
        const inside = sorted.filter(v => v >= q1 - fence && v <= q3 + fence);
        return {
          min: inside[0], q1, median, q3, max: inside[inside.length - 1],
          outliers: sorted.filter(v => v < q1 - fence || v > q3 + fence)
        };
      })
    }));
    return built;
  }

  if (shape === 'samples') {
    // Observations brutes : une ligne par observation, regroupées par catégorie.
    const label = requireColumn(table, mapping.label || nonNumeric[0], 'label');
    const valueCols = splitList(mapping.value) || table.columns.filter(c => table.numeric.has(c) && c !== label);
    if (valueCols.length !== 1) throw new Error(`Observations brutes : une colonne de valeur attendue, trouvé ${valueCols.length}. Préciser --value.`);
    const value = requireColumn(table, valueCols[0], 'value');
    const groups = new Map();
    table.rows.forEach((row, i) => {
      const l = String(row[label]);
      if (!groups.has(l)) groups.set(l, []);
      const n = num(row[value], value, i);
      if (n !== null) groups.get(l).push(n);
    });
    return {
      formattedData: { labels: [...groups.keys()], datasets: [{ label: mapping.seriesLabel || value, data: [...groups.values()] }] },
      mapping: { label, value: [value] }
    };
  }

  if (shape !== 'labels-datasets') {
    throw new Error('Ce template n\'attend pas un tableau catégories × séries : fournir formattedData en JSON (forme : kit-charts describe <id>).');
  }

  const label = requireColumn(table, mapping.label || nonNumeric[0] || table.columns[0], 'label');
  const labels = [];
  table.rows.forEach(row => { const l = String(row[label]); if (!labels.includes(l)) labels.push(l); });

  if (mapping.series) {
    // Format long : une ligne par (catégorie, série), une seule colonne de valeur.
    const series = requireColumn(table, mapping.series, 'series');
    const valueCols = splitList(mapping.value) || table.columns.filter(c => table.numeric.has(c) && c !== label && c !== series);
    if (valueCols.length !== 1) {
      throw new Error(`Format long (--series ${series}) : une seule colonne de valeur attendue, trouvé ${valueCols.length} (${valueCols.join(', ')}). Préciser --value.`);
    }
    const value = requireColumn(table, valueCols[0], 'value');
    const bySeries = new Map();
    table.rows.forEach((row, i) => {
      const s = String(row[series]);
      if (!bySeries.has(s)) bySeries.set(s, new Map());
      const cell = bySeries.get(s);
      if (cell.has(String(row[label]))) throw new Error(`Doublon : "${row[label]}" × "${s}" apparaît deux fois.`);
      cell.set(String(row[label]), num(row[value], value, i));
    });
    return {
      formattedData: {
        labels,
        datasets: [...bySeries].map(([s, cell]) => ({ label: s, data: labels.map(l => (cell.has(l) ? cell.get(l) : null)) }))
      },
      mapping: { label, series, value: [value] }
    };
  }

  const valueCols = (splitList(mapping.value) || table.columns.filter(c => table.numeric.has(c) && c !== label))
    .map(c => requireColumn(table, c, 'value'));
  if (!valueCols.length) throw new Error('Aucune colonne numérique trouvée : préciser --value.');
  if (labels.length !== table.rows.length) {
    throw new Error(`Catégories en double dans "${label}" : agréger les lignes, ou passer en format long avec --series.`);
  }
  const formattedData = {
    labels,
    datasets: valueCols.map(c => ({ label: c, data: table.rows.map((row, i) => num(row[c], c, i)) }))
  };
  return { formattedData: mapping.transpose ? transpose(formattedData) : formattedData, mapping: { label, value: valueCols, transpose: mapping.transpose || undefined } };
}

/** Échange catégories et séries : « agence, 2023, 2025 » devient labels [2023, 2025], une série par agence. */
function transpose(fd) {
  return {
    labels: fd.datasets.map(ds => String(ds.label)),
    datasets: fd.labels.map((l, i) => ({ label: l, data: fd.datasets.map(ds => ds.data[i]) }))
  };
}

module.exports = { transpose, parseNumber, parseTable, loadTableFile, tableToFormattedData, shapeOfTemplate, splitCsvLine, detectDelimiter };
