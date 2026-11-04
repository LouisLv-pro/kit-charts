// ESLint (flat config). Deux mondes : les templates et thèmes UMD (navigateur + Node, mode
// script) et l'outillage Node en CommonJS (scripts du skill, CLI, tests).
const js = require('@eslint/js');
const globals = require('globals');
const prettier = require('eslint-config-prettier');

module.exports = [
  {
    ignores: [
      'node_modules/',
      'output/',
      'vendor/',
      '.playwright-cli/',
      '.claude/worktrees/',
      'catalog-bundle.js',
      'test/__snapshots__/'
    ]
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: { ...globals.node }
    },
    rules: {
      'no-unused-vars': ['warn', { args: 'none', caughtErrors: 'none' }],
      'prefer-const': 'warn',
      eqeqeq: ['error', 'smart'],
      'no-var': 'off'
    }
  },
  {
    // Templates et thèmes : exécutés tels quels dans le navigateur (file://) et requis par Node.
    files: ['template/**/*.js', 'themes/**/*.js'],
    languageOptions: {
      sourceType: 'script',
      globals: {
        ...globals.browser,
        ...globals.node,
        define: 'readonly',
        Chart: 'readonly',
        d3: 'readonly',
        topojson: 'readonly',
        ChartGeo: 'readonly',
        // Pied UMD commun aux 73 templates (`typeof defaultData !== 'undefined' ? …`).
        defaultData: 'readonly'
      }
    },
    rules: {
      // Le même pied UMD réassigne `moduleExports.createChart` à lui-même : sans effet, mais
      // présent partout. À retirer quand le pied sera nettoyé (docs/decisions/0001).
      'no-self-assign': 'off'
    }
  },
  prettier
];
