# Spec : Compilation d'une spec en page HTML

Statut : livrée. Date : 2026-11-04.

## Objectif

À partir d'une `spec.json`, on obtient une page HTML autonome qui affiche le graphique. Une spec non conforme est refusée : rien n'est écrit.

## Comportement attendu

- Script : `compile-chart.js` (`kit-charts compile <spec.json> [-o sortie]`). La spec est d'abord auditée par `validateChartSpec` (voir la spec `validation-et-rendu`).
- Par défaut, le CLI est strict : une erreur bloquante interdit la génération. Il affiche `Échec de validation de la spec dataviz` avec chaque `[ruleId]` et son correctif, sur stderr, sans rien écrire, et sort en 1. Les avertissements ne bloquent pas.
- `--force` génère malgré les erreurs (débogage). Le fichier est écrit mais le code de sortie reste 1 si la spec n'est pas conforme.
- Un `targetTemplateId` absent, ou absent du registre, fait échouer la compilation (exit 1).
- Options du CLI : `--spec`/`-s`, `--template`/`-t`, `--data`/`-d` (fichier ou JSON en ligne), `--theme`, `--polarity`, `--title`, `--subtitle`, `--output`/`-o`, `--format`, `--strict`, `--force`, `--json`. Elles surchargent la spec.
- Thème : `colorStrategy.themeName`, sinon `colorbrewer-accessible`. Titre, sous-titre et hauteur par défaut : nom et description du template, 400. Sans `footnote`, le pied de carte est retiré.
- La page contient tout, sauf Chart.js : `theme-tokens.js`, `stat-helpers.js`, le `template.js` et le HTML du template, plus les polices du thème et, pour les cartes, `world-atlas`.
- Les dépendances viennent du CDN jsDelivr à une version exacte (source unique `vendor-pins.js`) : `chart.js`, plus les plugins nécessaires au template (`CHART_PLUGINS`). Aucune plage de version.
- Les données sont sérialisées dans un bloc `<script>` avec `<` écrit `\u003c`, et le titre est échappé : aucune donnée ne peut fermer le bloc.
- Au chargement, un script pose `data-kc-render` (`ok`, `invalid`, `error`) sur le conteneur, lu par `check`.
- Sortie : sans `-o`, `output/<id>-<horodatage>.html`. Un fichier posé directement dans `output/` est rangé dans `output/<nom>/<nom>.html`. Un chemin sans extension devient un dossier avec `index.html`. La spec est copiée en `spec.json` à côté.
- Règles cognitives touchées : toutes celles du validateur (Y=0, N ≤ 7, ≤ 5 courbes, WCAG), appliquées avant d'écrire.

## Hors périmètre

- Le mode `format: 'snippet'` (bloc DOM sans page) marche par l'API `compileChart`. Dans le CLI il n'écrit rien et affiche `undefined` : non pris en charge.
- Pas de rendu réel ici : c'est `check` (voir `validation-et-rendu`).
- Pas de téléchargement local des bibliothèques : le réseau est requis à l'ouverture de la page.

## Critères d'acceptation

Chaque critère nomme sa preuve.

- [x] Spec à 9 colonnes : exit 1, aucun fichier écrit, règle `VERTICAL_BAR_MAX_CATEGORIES` citée → `test/run-integration-tests.js`, Bloc 10
- [x] `--force` écrit le fichier et sort quand même en 1 → Bloc 10
- [x] Spec conforme : exit 0 et fichier écrit → Bloc 10
- [x] Mode strict de l'API : une spec non conforme lève une erreur (axe tronqué, schéma violé avec `SCHEMA_FORMATTED_DATA`) → Blocs 4 et 12
- [x] Toutes les URL CDN de la page sont épinglées, `chartjs-plugin-datalabels` absent → Bloc 7
- [x] Les plugins du template sont dans la page : treemap à l'URL versionnée exacte de `vendor-pins.js`, carte avec `chartjs-chart-geo` (nom seul) → Bloc 7
- [x] Versions CDN du compilateur identiques à celles des previews et de `index.html` → Bloc 11
- [x] Accents conservés, `footnote` rendue et échappée, retirée si absente → Blocs 2 et 12
- [x] `</script>` dans une donnée ou un titre ne sort pas du bloc ; apostrophe et `&` intacts dans les données → Bloc 12
- [x] Mode snippet de l'API : pas de `<!DOCTYPE html>` → Bloc 7
- [x] `compile` via `kit-charts` : sortie dans le dossier courant, y compris sans `-o` → Bloc 13
- [x] Les pages compilées s'affichent vraiment dans Chrome → `npm run test:render` (73 templates, réseau requis, hors `npm test`)
- [ ] Template inconnu ou `targetTemplateId` absent : exit 1 (pas de test aujourd'hui)
- [ ] Rangement de `output/` (sous-dossier, `index.html`, copie de `spec.json`) (pas de test aujourd'hui)
- [ ] Options `--template`, `--data`, `--theme`, `--polarity`, `--title`, `--subtitle` (pas de test aujourd'hui)
- [ ] `--json` : rapport `success`, `outputPath`, `validation` (pas de test aujourd'hui)
