/**
 * @file .agents/skills/kit-charts/scripts/validate-hook.js
 * @description Script pont pour les Hooks Antigravity (hooks.json).
 * Intercepte les écritures et modifications de fichiers (write_to_file, replace_file_content)
 * et déclenche l'audit cognitif et WCAG 2.2 automatique en temps réel.
 * @version 1.0.0
 * @license MIT
 */

const fs = require('fs');
const path = require('path');
const { validateChartFile, validateChartSpec } = require('./validate-chart.js');

/**
 * Lit l'intégralité du flux stdin de manière asynchrone
 */
async function readStdin() {
  return new Promise((resolve) => {
    if (process.stdin.isTTY) {
      resolve('');
      return;
    }

    let inputData = '';
    process.stdin.setEncoding('utf8');

    const timeout = setTimeout(() => {
      resolve(inputData);
    }, 2000);

    process.stdin.on('data', (chunk) => {
      inputData += chunk;
    });

    process.stdin.on('end', () => {
      clearTimeout(timeout);
      resolve(inputData);
    });

    process.stdin.on('error', () => {
      clearTimeout(timeout);
      resolve(inputData);
    });
  });
}

/**
 * Détermine si le fichier est un artefact de datavisualisation
 */
function isDatavizFile(filePath, content) {
  if (!filePath && !content) return false;

  const validExtensions = ['.json', '.html', '.js'];
  const ext = filePath ? path.extname(filePath).toLowerCase() : '';

  if (filePath) {
    const normalized = filePath.replace(/\\/g, '/');
    if (normalized.includes('template/') || normalized.includes('output/') || normalized.includes('dataviz-spec')) {
      return validExtensions.includes(ext);
    }
  }

  if (content && typeof content === 'string') {
    if (content.includes('targetTemplateId') || content.includes('formattedData') || content.includes('kit-charts') || content.includes('KitCharts')) {
      return true;
    }
  }

  return false;
}

/**
 * Point d'entrée principal du hook
 */
async function runHook() {
  let targetFile = process.argv[2] || null;
  let rawPayload = await readStdin();
  let parsedPayload = null;

  if (rawPayload && rawPayload.trim()) {
    try {
      parsedPayload = JSON.parse(rawPayload.trim());
    } catch (e) {
      // Payload texte brut ou JSON partiel
    }
  }

  // Extraction du fichier et du contenu depuis les structures Antigravity possibles
  let codeContent = null;

  if (parsedPayload) {
    const toolCall = parsedPayload.toolCall || parsedPayload;
    const toolArgs = toolCall.args || toolCall.arguments || parsedPayload.toolArgs || parsedPayload.args || {};

    targetFile = toolArgs.TargetFile || toolArgs.targetFile || toolArgs.FilePath || toolArgs.filePath || toolArgs.path || targetFile;
    codeContent = toolArgs.CodeContent || toolArgs.codeContent || toolArgs.ReplacementContent || toolArgs.replacementContent || null;
  }

  // Si aucun fichier détecté, quitter silencieusement
  if (!targetFile && !codeContent) {
    process.exit(0);
  }

  // Filtrer les fichiers hors périmètre dataviz
  if (!isDatavizFile(targetFile, codeContent)) {
    process.exit(0);
  }

  let resolvedPath = targetFile ? (path.isAbsolute(targetFile) ? targetFile : path.resolve(process.cwd(), targetFile)) : null;
  let report = null;

  if (resolvedPath && fs.existsSync(resolvedPath)) {
    report = validateChartFile(resolvedPath);
  } else if (codeContent) {
    if (codeContent.trim().startsWith('{')) {
      try {
        const spec = JSON.parse(codeContent);
        report = validateChartSpec(spec);
      } catch (e) {}
    }
  }

  if (!report) {
    process.exit(0);
  }

  // Si des erreurs bloquantes sont détectées, formater le feedback pour l'agent
  if (!report.valid) {
    console.log('\n🛑 [Antigravity Quality Gate] Erreur de conformité cognitive / WCAG 2.2 détectée :');
    console.log(`📁 Fichier : ${targetFile || 'Contenu injecté'}`);
    report.errors.forEach((err, idx) => {
      console.log(`   ❌ ${idx + 1}. [${err.ruleId}] ${err.message}`);
      if (err.suggestion) {
        console.log(`      💡 Recommandation : ${err.suggestion}`);
      }
    });
    if (report.warnings && report.warnings.length > 0) {
      console.log('\n⚠️ Avertissements additionnels :');
      report.warnings.forEach((warn, idx) => {
        console.log(`   ⚠️ ${idx + 1}. [${warn.ruleId}] ${warn.message}`);
      });
    }
    console.log('\n👉 Veuillez corriger la spécification ou le code avant de finaliser.\n');
  } else {
    const fileName = targetFile ? path.basename(targetFile) : 'dataviz';
    console.log(`✅ [Antigravity Quality Gate] Validation cognitive et WCAG 2.2 réussie pour "${fileName}".`);
  }

  process.exit(0);
}

runHook().catch(() => process.exit(0));
