// @ts-check
// Stop : avant que Claude rende la main, relance lint et tests si la session a modifié du
// code (fichiers notés par check-file.js et encore modifiés dans git).
// Phase rouge du TDD : si seuls des fichiers de test ont changé, ils échouent tant que le code
// n'existe pas, et rien d'autre n'a bougé : pas de vérification.
// Code 2 = Claude reçoit l'erreur et doit corriger (ou expliquer pourquoi un test serait faux).
'use strict';

const { execFileSync, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const CODE = /\.(js|json|css|html)$/;

/** @param {string[]} args */
function git(args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' });
}

function main() {
  const input = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
  if (input.stop_hook_active) return; // Claude corrige déjà suite à ce hook : pas de boucle.
  if (!input.session_id) return;

  let touchedFile;
  try {
    const gitDir = path.resolve(root, git(['rev-parse', '--git-common-dir']).trim());
    touchedFile = path.join(gitDir, 'claude-touched', input.session_id);
  } catch {
    return;
  }
  if (!fs.existsSync(touchedFile)) return;

  const touched = new Set(
    fs
      .readFileSync(touchedFile, 'utf8')
      .split('\n')
      .filter(Boolean)
      .map((f) => path.resolve(f))
  );
  const top = git(['rev-parse', '--show-toplevel']).trim();
  const changed = git([
    '-c',
    'core.quotePath=false',
    'status',
    '--porcelain',
    '--untracked-files=all'
  ])
    .split('\n')
    .filter(Boolean)
    .map((l) => path.resolve(top, l.slice(3)))
    .filter((f) => touched.has(f) && CODE.test(f) && !f.includes(`${path.sep}output${path.sep}`));
  if (changed.length === 0) return;
  if (changed.every((f) => f.startsWith(path.join(top, 'test') + path.sep))) return;

  /** @type {Array<[string, string[]]>} */
  const steps = [
    // --quiet : seulement les erreurs, sinon la dette en avertissements masque la vraie faute.
    ['ESLint signale des erreurs', ['exec', '--', 'eslint', '.', '--quiet']],
    [
      'Stylelint signale des erreurs',
      ['exec', '--', 'stylelint', '**/*.css', '--allow-empty-input']
    ],
    ['Des tests échouent', ['test', '--silent']]
  ];
  for (const [label, args] of steps) {
    const r = spawnSync('npm', args, { cwd: root, encoding: 'utf8' });
    if (r.status !== 0) {
      const out = `${r.stdout || ''}${r.stderr || ''}`.split('\n').slice(-40).join('\n');
      process.stderr.write(
        `${label}. Corrige le code, ou explique pourquoi un test serait faux, avant de terminer :\n${out}\n`
      );
      process.exit(2);
    }
  }
}

main();
