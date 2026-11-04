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

const VENDOR = {
  'chart.js': 'https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js',
  'chartjs-chart-treemap': 'https://cdn.jsdelivr.net/npm/chartjs-chart-treemap@2.3.1/dist/chartjs-chart-treemap.min.js',
  'chartjs-chart-matrix': 'https://cdn.jsdelivr.net/npm/chartjs-chart-matrix@2.0.1/dist/chartjs-chart-matrix.min.js',
  'chartjs-chart-sankey': 'https://cdn.jsdelivr.net/npm/chartjs-chart-sankey@0.12.1/dist/chartjs-chart-sankey.min.js',
  'chartjs-chart-financial': 'https://cdn.jsdelivr.net/npm/chartjs-chart-financial@0.2.0/dist/chartjs-chart-financial.min.js',
  'chartjs-chart-geo': 'https://cdn.jsdelivr.net/npm/chartjs-chart-geo@4.3.4/build/index.umd.min.js',
  'topojson-client': 'https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js',
  'chartjs-adapter-luxon': 'https://cdn.jsdelivr.net/npm/chartjs-adapter-luxon@1.3.1/dist/chartjs-adapter-luxon.umd.min.js',
  luxon: 'https://cdn.jsdelivr.net/npm/luxon@3.5.0/build/global/luxon.min.js'
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

module.exports = { VENDOR, CHART_PLUGINS, parsePinnedUrl };
