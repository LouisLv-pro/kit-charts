// @ts-check
/**
 * @file .agents/skills/kit-charts/scripts/focus.js
 * @description Mise en avant d'un élément (règle 90/10) : `cognitiveFeatures.focus` nomme une
 * catégorie ou une série. La compilation la traduit dans la forme que lit chaque template :
 * `focusIndex` (une catégorie parmi d'autres) ou `role` focal / contexte (une série parmi
 * d'autres). Exemple : « Lille passe de la 6e à la 1re place » -> Lille en bleu, le reste en gris.
 * @license MIT
 */

'use strict';

/** Templates qui lisent datasets[0].focusIndex (une catégorie). */
const BY_INDEX = new Set([
  'bar-chart-vertical', 'bar-chart-horizontal', 'lollipop-chart', 'polar-area-chart', 'pie-chart', 'doughnut-chart',
  'box-plot', 'violin-plot', 'box-strip-plot'
]);
/** Templates qui lisent datasets[i].role (une série). */
const BY_SERIES = new Set(['slope-chart', 'multi-line-chart']);
/** Valeurs qui retirent la mise en avant. */
const NO_FOCUS = new Set(['aucun', 'aucune', 'none', '']);

/** Texte comparable : sans accents, minuscules, ponctuation réduite à des espaces. */
function normalizeText(text) {
  return String(text ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

/** @param {unknown} focus */
function isNoFocus(focus) {
  return focus === null || focus === undefined || focus === false || NO_FOCUS.has(normalizeText(focus));
}

/** @param {string} templateId @returns {'index'|'series'|null} */
function focusMode(templateId) {
  if (BY_INDEX.has(templateId)) return 'index';
  if (BY_SERIES.has(templateId)) return 'series';
  return null;
}

/**
 * Noms parmi lesquels choisir : libellés (par catégorie) ou noms de séries.
 * @param {any} data @param {string} templateId @returns {string[]}
 */
function focusCandidates(data, templateId) {
  const mode = focusMode(templateId);
  if (!mode || !data || typeof data !== 'object') return [];
  if (mode === 'index') return Array.isArray(data.labels) ? data.labels.map(String) : [];
  return Array.isArray(data.datasets) ? data.datasets.map((/** @type {any} */ d) => String((d && d.label) || '')) : [];
}

/** Position de l'élément nommé, -1 s'il est absent. */
function findFocus(data, templateId, focus) {
  const wanted = normalizeText(focus);
  return focusCandidates(data, templateId).findIndex(name => normalizeText(name) === wanted);
}

/**
 * Traduit la mise en avant dans les données du template. Copie : l'entrée reste intacte.
 * Sans effet si le template ne sait pas mettre en avant ou si le nom est absent (le
 * validateur le signale).
 * @param {any} data @param {string} templateId @param {unknown} focus
 */
function applyFocus(data, templateId, focus) {
  if (isNoFocus(focus) || !data || typeof data !== 'object' || !Array.isArray(data.datasets)) return data;
  const at = findFocus(data, templateId, focus);
  if (at < 0) return data;
  const out = Object.assign({}, data);
  if (focusMode(templateId) === 'index') {
    out.datasets = data.datasets.map((/** @type {any} */ d, i) => (i === 0 ? Object.assign({}, d, { focusIndex: at }) : d));
  } else {
    out.datasets = data.datasets.map((/** @type {any} */ d, i) => Object.assign({}, d, { role: i === at ? 'focal' : 'context' }));
  }
  return out;
}

/**
 * Élément cité par le titre : un seul nom trouvé en mot entier, sinon aucun.
 * « Lille devance Lyon » cite deux agences : rien n'est mis en avant.
 * @param {string} title @param {any} data @param {string} templateId @returns {string|null}
 */
function focusFromTitle(title, data, templateId) {
  const text = ` ${normalizeText(title)} `;
  const hits = [...new Set(focusCandidates(data, templateId).filter(name => {
    const n = normalizeText(name);
    return n && text.includes(` ${n} `);
  }))];
  return hits.length === 1 ? hits[0] : null;
}

module.exports = { applyFocus, focusFromTitle, focusCandidates, findFocus, focusMode, isNoFocus, normalizeText, BY_INDEX, BY_SERIES };
