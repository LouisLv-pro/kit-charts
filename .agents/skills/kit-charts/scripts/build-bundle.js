/**
 * @file .agents/skills/kit-charts/scripts/build-bundle.js
 * @description Générateur déterministe du bundle universel catalog-bundle.js pour kit-charts.
 * Compile les 95 templates de visualisations en un seul artefact UMD autonome zéro-CORS.
 * @version 1.0.0
 * @license MIT
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../../../..');
const REGISTRY_PATH = path.join(ROOT_DIR, '.agents/skills/kit-charts/registry.json');
const OUTPUT_BUNDLE_PATH = path.join(ROOT_DIR, 'catalog-bundle.js');

function buildBundle() {
  console.log('📦 Génération de catalog-bundle.js en cours...');

  if (!fs.existsSync(REGISTRY_PATH)) {
    throw new Error(`Registre introuvable : ${REGISTRY_PATH}`);
  }

  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
  const templates = registry.templates || [];

  let bundleContent = `/**
 * @file catalog-bundle.js
 * @description All kit-charts template generators pre-bundled for instant zero-CORS execution.
 * Allows index.html and npm consumers to render all 95 charts immediately on file://, http://, and Node.js.
 * @version 1.0.0
 * @generated ${new Date().toISOString()}
 */

(function(global) {
  "use strict";

  global.KitCharts = global.KitCharts || {};
  var ThemeModule = global.KitChartsTheme || (global.KitCharts && global.KitCharts.Theme) || (typeof window !== "undefined" && (window.KitChartsTheme || window.KitChartsTokens)) || {};
  var WorldAtlasModule = global.KitChartsWorldAtlas || (typeof window !== "undefined" && window.KitChartsWorldAtlas) || null;

`;

  let count = 0;
  for (const t of templates) {
    const jsPath = path.join(ROOT_DIR, t.paths.js);
    if (!fs.existsSync(jsPath)) {
      console.warn(`⚠️ Fichier template introuvable pour ${t.id}: ${jsPath}`);
      continue;
    }

    const fileContent = fs.readFileSync(jsPath, 'utf8');

    // Extraction du corps de la fonction factory(KitChartsTheme, KitChartsWorldAtlas) { ... }
    const factoryMatch = fileContent.match(/function\s*\(\s*KitChartsTheme[\s\w,]*\)\s*\{([\s\S]*)\}\s*\)\s*;\s*$/);

    if (factoryMatch && factoryMatch[1]) {
      const factoryBody = factoryMatch[1];
      bundleContent += `  // --------------------------------------------------------------------------\n`;
      bundleContent += `  // Chart: ${t.paths.js.replace('/template.js', '')}\n`;
      bundleContent += `  // --------------------------------------------------------------------------\n`;
      bundleContent += `  global.KitCharts["${t.id}"] = (function() {\n`;
      bundleContent += `    var KitChartsTheme = ThemeModule;\n`;
      bundleContent += `    var KitChartsWorldAtlas = WorldAtlasModule;\n`;
      bundleContent += `    var factory = function(KitChartsTheme, KitChartsWorldAtlas) {\n`;
      bundleContent += factoryBody;
      bundleContent += `\n    };\n`;
      bundleContent += `    return factory(KitChartsTheme, KitChartsWorldAtlas);\n`;
      bundleContent += `  })();\n\n`;
    } else {
      // Si la structure UMD standard diffère, encapsulation sûre
      bundleContent += `  // --------------------------------------------------------------------------\n`;
      bundleContent += `  // Chart: ${t.paths.js.replace('/template.js', '')} (Direct wrapper)\n`;
      bundleContent += `  // --------------------------------------------------------------------------\n`;
      bundleContent += `  (function() {\n`;
      bundleContent += `    var module = { exports: {} };\n`;
      bundleContent += `    var exports = module.exports;\n`;
      bundleContent += `    ${fileContent}\n`;
      bundleContent += `    if (module.exports && (module.exports.createChart || typeof module.exports === 'function')) {\n`;
      bundleContent += `      global.KitCharts["${t.id}"] = module.exports;\n`;
      bundleContent += `    }\n`;
      bundleContent += `  })();\n\n`;
    }

    count++;
  }

  bundleContent += `})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : this);\n`;

  fs.writeFileSync(OUTPUT_BUNDLE_PATH, bundleContent, 'utf8');
  console.log(`✅ Bundle généré avec succès : ${OUTPUT_BUNDLE_PATH}`);
  console.log(`📊 Total des templates compilés : ${count}/${templates.length} (${(bundleContent.length / 1024).toFixed(1)} Ko)`);

  return { success: true, count, size: bundleContent.length };
}

if (require.main === module) {
  buildBundle();
}

module.exports = { buildBundle };
