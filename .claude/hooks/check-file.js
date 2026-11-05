// @ts-check
// PostToolUse (Edit|Write) : contrôle le fichier que Claude vient d'écrire.
//   1. Prettier, sauf fichiers listés dans .prettierignore (code existant pas encore migré).
//   2. ESLint pour le JS, Stylelint pour le CSS.
//   3. Audit kit-charts (validate-chart.js) pour une spec ou une page dans output/.
// Code 2 = le message sur stderr est renvoyé à Claude, qui doit corriger.
'use strict';

const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();

/** @param {string} msg */
function fail(msg) {
  process.stderr.write(msg.endsWith('\n') ? msg : `${msg}\n`);
  process.exit(2);
}

/**
 * Note le fichier pour la session : le hook Stop ne vérifie que ce qu'elle a touché.
 * @param {string} session
 * @param {string} file
 */
function noteTouched(session, file) {
  try {
    const gitDir = execFileSync('git', ['rev-parse', '--git-common-dir'], {
      cwd: root,
      encoding: 'utf8'
    }).trim();
    const dir = path.resolve(root, gitDir, 'claude-touched');
    fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(path.join(dir, session), `${file}\n`);
  } catch {
    // Hors dépôt git : rien à noter.
  }
}

/** @param {string[]} args */
function npx(args) {
  return execFileSync('npx', ['--no-install', ...args], {
    cwd: root,
    stdio: 'pipe',
    encoding: 'utf8'
  });
}

/** @param {string} file */
function auditChart(file) {
  const validator = path.join(root, '.agents/skills/kit-charts/scripts/validate-chart.js');
  const { validateChartFile } = require(validator);
  const report = validateChartFile(file);
  if (!report || report.valid) return;
  const lines = report.errors.map(
    (/** @type {{ruleId: string, message: string, suggestion?: string}} */ e) =>
      `  [${e.ruleId}] ${e.message}${e.suggestion ? `\n    Correctif : ${e.suggestion}` : ''}`
  );
  fail(`kit-charts refuse ${path.relative(root, file)} :\n${lines.join('\n')}`);
}

function main() {
  const input = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
  const file = input.tool_input?.file_path ?? '';
  // Un fichier hors du dépôt (scratchpad, autre dépôt) n'est pas contrôlé ici.
  if (!file || !path.resolve(file).startsWith(path.resolve(root) + path.sep)) return;
  if (!fs.existsSync(file)) return;
  if (input.session_id) noteTouched(input.session_id, file);

  const rel = path.relative(root, file);
  const ext = path.extname(file).slice(1);

  if (['js', 'mjs', 'cjs', 'css', 'html', 'json', 'md', 'yaml', 'yml'].includes(ext)) {
    try {
      npx(['prettier', '--write', '--ignore-unknown', '--log-level', 'warn', file]);
    } catch {
      // Fichier syntaxiquement invalide : le linter ci-dessous le signalera.
    }
  }

  /** @type {Record<string, string[]>} */
  const linters = {
    js: ['eslint', '--no-warn-ignored', file],
    mjs: ['eslint', '--no-warn-ignored', file],
    cjs: ['eslint', '--no-warn-ignored', file],
    css: ['stylelint', file]
  };
  const linter = linters[ext];
  if (linter) {
    try {
      npx(linter);
    } catch (/** @type {any} */ err) {
      fail(
        `${linter[0]} a trouvé des problèmes dans ${rel} :\n${err.stdout || ''}${err.stderr || ''}`
      );
    }
  }

  if (/^output\/[^/]+\/(spec\.json|index\.html)$/.test(rel.split(path.sep).join('/'))) {
    auditChart(file);
  }
}

main();
