/**
 * @file .agents/skills/kit-charts/scripts/vendor-pins.js
 * @description Source unique des dépendances CDN épinglées de kit-charts.
 *
 * Le compilateur et les pages de preview (index.html et les preview.html des templates)
 * chargeaient des versions différentes des mêmes plugins. Le même template
 * pouvait donc rendre différemment selon le chemin, sans qu'aucun test le voie :
 *
 *   paquet                  | compilateur (avant)  | previews
 *   ------------------------|----------------------|--------------------
 *   chartjs-chart-sankey    | 0.12.0               | 0.12.1
 *   chartjs-chart-treemap   | 2.3.0                | 2.3.1
 *   chartjs-chart-matrix    | 1.2.0                | 2.0.1
 *   chartjs-chart-financial | 0.2.1                | 0.2.0
 *   adaptateur d'axe temps  | date-fns@3.0.0       | luxon@1.3.1 (+ luxon 3.5.0)
 *   chartjs-plugin-datalabels | 2.2.0 (inutilisé)  | absent
 *
 * Règle : les previews sont la surface que les humains regardent, leurs
 * versions font foi et le compilateur s'y aligne. `chartjs-plugin-datalabels`
 * est retiré du HTML compilé : aucun template ne l'enregistre, les étiquettes
 * de données sont dessinées par le plugin canvas maison de theme-tokens.js.
 *
 * Garde exécutable : test/run-integration-tests.js (« versions CDN identiques
 * entre compilateur et previews ») échoue si l'un des chemins change seul.
 *
 * Aucune plage de version n'est tolérée (supply-chain) : uniquement `@x.y.z`.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const VENDOR = {
  'chart.js': 'https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js',
  'chartjs-chart-treemap': 'https://cdn.jsdelivr.net/npm/chartjs-chart-treemap@2.3.1/dist/chartjs-chart-treemap.min.js',
  'chartjs-chart-matrix': 'https://cdn.jsdelivr.net/npm/chartjs-chart-matrix@2.0.1/dist/chartjs-chart-matrix.min.js',
  'chartjs-chart-sankey': 'https://cdn.jsdelivr.net/npm/chartjs-chart-sankey@0.12.1/dist/chartjs-chart-sankey.min.js',
  'chartjs-chart-financial': 'https://cdn.jsdelivr.net/npm/chartjs-chart-financial@0.2.0/dist/chartjs-chart-financial.min.js',
  'chartjs-chart-geo': 'https://cdn.jsdelivr.net/npm/chartjs-chart-geo@4.3.4/build/index.umd.min.js',
  'topojson-client': 'https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js',
  'chartjs-adapter-luxon': 'https://cdn.jsdelivr.net/npm/chartjs-adapter-luxon@1.3.1/dist/chartjs-adapter-luxon.umd.min.js',
  luxon: 'https://cdn.jsdelivr.net/npm/luxon@3.5.0/build/global/luxon.min.js',
  // Export SVG uniquement (kit-charts export) : contexte canvas 2D qui écrit du SVG.
  // Jamais chargé dans une page compilée.
  svgcanvas: 'https://cdn.jsdelivr.net/npm/svgcanvas@2.6.0/dist/svgcanvas.js'
};

// Plugins Chart.js non-core requis par template (contrôleurs non-core).
// Carte : templateId -> URLs à charger après chart.umd.min.js, dans l'ordre
// (luxon avant son adaptateur, adaptateur avant chartjs-chart-financial).
const CHART_PLUGINS = {
  treemap: [VENDOR['chartjs-chart-treemap']],
  'matrix-heatmap': [VENDOR['chartjs-chart-matrix']],
  'distribution-heatmap': [VENDOR['chartjs-chart-matrix']],
  'waffle-chart': [VENDOR['chartjs-chart-matrix']],
  'cartogram-tilegram': [VENDOR['chartjs-chart-matrix']],
  'choropleth-map': [VENDOR['topojson-client'], VENDOR['chartjs-chart-geo']],
  'bubble-map': [VENDOR['topojson-client'], VENDOR['chartjs-chart-geo']],
  'sankey-diagram': [VENDOR['chartjs-chart-sankey']],
  'alluvial-diagram': [VENDOR['chartjs-chart-sankey']],
  'candlestick-ohlc': [VENDOR['luxon'], VENDOR['chartjs-adapter-luxon'], VENDOR['chartjs-chart-financial']],
  'candlestick-volume': [VENDOR['luxon'], VENDOR['chartjs-adapter-luxon'], VENDOR['chartjs-chart-financial']]
};

/**
 * Extrait `paquet` + `version` épinglée d'une URL jsDelivr.
 * @param {string} url
 * @returns {{pkg: string, version: string}|null}
 */
function parsePinnedUrl(url) {
  const m = String(url || '').match(/cdn\.jsdelivr\.net\/npm\/((?:@[^/]+\/)?[^@/]+)@([^/]+)\//);
  return m ? { pkg: m[1], version: m[2] } : null;
}

/**
 * Empreintes SHA-384 des fichiers épinglés, copiés dans vendor/ pour le mode hors ligne
 * (kit-charts compile --offline) et l'export. Un fichier local dont l'empreinte diffère
 * est refusé : la copie locale ne peut pas dériver de la version épinglée.
 * Régénérer avec : node .agents/skills/kit-charts/scripts/vendor-fetch.js --update-hashes
 */
const VENDOR_SHA384 = {
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js':
    'vsrfeLOOY6KuIYKDlmVH5UiBmgIdB1oEf7p01YgWHuqmOHfZr374+odEv96n9tNC',
  'https://cdn.jsdelivr.net/npm/chartjs-chart-treemap@2.3.1/dist/chartjs-chart-treemap.min.js':
    '2iT6D7wyb5HstzKoC271/lYvvVhEpI0dyfsa2DVm2Hme4y8BhFIT/HpobnLcCgDf',
  'https://cdn.jsdelivr.net/npm/chartjs-chart-matrix@2.0.1/dist/chartjs-chart-matrix.min.js':
    'a7esWkFf+Il6h/+W+5aJjvkI7IVLbCVGkyH9OiFy3Jf0Rdn2cEyIymqq/hBdXsvj',
  'https://cdn.jsdelivr.net/npm/chartjs-chart-sankey@0.12.1/dist/chartjs-chart-sankey.min.js':
    'R5LF8opcxOg7Ibk9Tcz2v5qJ/2FKaqqJfvGRDQtj5e7gQ4AzhwYCB61EOu/N6qoh',
  'https://cdn.jsdelivr.net/npm/chartjs-chart-financial@0.2.0/dist/chartjs-chart-financial.min.js':
    'IHYx5l+UUYZ9CT585FhUwMje9dTNAqbKZpWUwPJ9+xGF7nQ8hOwTzqR4n6amLKQx',
  'https://cdn.jsdelivr.net/npm/chartjs-chart-geo@4.3.4/build/index.umd.min.js':
    'w1pUD3mXXBR/E/GTwT4uFKy89MVbiK9B2muZoTm4RLgdZM9u1xnIgzUlixoW/NLR',
  'https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js':
    'Ukv1p/xTma6P4/2bY5KzWBw+ydSpXmhCMtyciIQVDJ1RmOxtCYNMF1uXT9T63H67',
  'https://cdn.jsdelivr.net/npm/chartjs-adapter-luxon@1.3.1/dist/chartjs-adapter-luxon.umd.min.js':
    '7cWzHabR6ZyfMWzZgVssYaOQRTccHUWZ0F09AanlF3RAJ/JNyFnIma2JTYIVKEUP',
  'https://cdn.jsdelivr.net/npm/luxon@3.5.0/build/global/luxon.min.js':
    'CU0J6nu6GO5gWB5IqOOhPQsG0LKyjpotF5Gw502R+0zbkzKHjDWc6FKSZsNTJfLX',
  'https://cdn.jsdelivr.net/npm/svgcanvas@2.6.0/dist/svgcanvas.js':
    'GEQVrWyqzgGmMDstAAUCRWLjfuwqE8auH5B8OoancBDrVKRzWrg5In1XXs+Yk5I3'
};

const VENDOR_DIR = path.resolve(__dirname, '../../../..', 'vendor');

/** Chemin local d'une URL épinglée : vendor/<paquet>@<version>/<fichier>. */
function vendorLocalPath(url) {
  const pinned = parsePinnedUrl(url);
  if (!pinned) throw new Error(`URL non épinglée : ${url}`);
  return path.join(VENDOR_DIR, `${pinned.pkg.replace('/', '__')}@${pinned.version}`, path.basename(url));
}

/**
 * Contenu local vérifié d'une dépendance épinglée.
 * @param {string} url - URL de VENDOR
 * @returns {string}
 */
function readVendor(url) {
  const file = vendorLocalPath(url);
  if (!fs.existsSync(file)) {
    throw new Error(`Copie locale absente : ${path.relative(process.cwd(), file)}. Lancer : node .agents/skills/kit-charts/scripts/vendor-fetch.js`);
  }
  const buf = fs.readFileSync(file);
  const expected = VENDOR_SHA384[url];
  const actual = crypto.createHash('sha384').update(buf).digest('base64');
  if (!expected || expected !== actual) {
    throw new Error(`Empreinte SHA-384 inattendue pour ${path.basename(file)} : copie locale refusée.`);
  }
  return buf.toString('utf8');
}

module.exports = { VENDOR, CHART_PLUGINS, VENDOR_SHA384, VENDOR_DIR, parsePinnedUrl, vendorLocalPath, readVendor };
