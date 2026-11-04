# 🤖 Directives & Architecture Agentique — Kit-Charts

Bienvenue sur le référentiel **kit-charts**. Ce fichier définit les règles fondamentales, les rôles des agents et les procédures d'orchestration pour tout agent IA (Antigravity, Claude, OpenAI, etc.) intervenant sur ce dépôt ou utilisant ses capacités de visualisation de données.

---

## 🏛️ Agent Unique : `dataviz`

Toute tâche de datavisualisation est confiée à un seul agent, [`dataviz`](.agents/agents/dataviz.md),
qui enchaîne trois postures sans relais :

1. **Qualifier** : question métier, données, polarité, thème, sortie. Hypothèses notées, pas d'interrogatoire.
2. **Construire** : `recommend-template.js` borne le choix, la spec est écrite dans `output/<slug>/spec.json`, `compile-chart.js` refuse toute spec non conforme (exit 1).
3. **Auditer** : `validate-chart.js` à zéro erreur, puis revue experte du sens ([`review-checklist.md`](.agents/skills/kit-charts/references/review-checklist.md)).

Le workflow complet, les commandes et le format du rapport sont dans le skill
[`.agents/skills/kit-charts/SKILL.md`](.agents/skills/kit-charts/SKILL.md).

---

## 📜 Règles Cognitives & Directives Obligatoires (Non Négociables)

Tout agent générant ou modifiant une visualisation **doit impérativement respecter les règles suivantes** :

### 1. Hiérarchie Visuelle de Cleveland & McGill (1984)
- **Ligne de base $Y=0$ absolue (`beginAtZero: true`)** sur tous les encodages de longueur (bar, column, lollipop, bullet). Il est formellement interdit de tronquer l'axe pour exagérer des variations.
- **Interdiction des échelles logarithmiques** sur les diagrammes en barres ou encodages de longueur.

### 2. Charge Cognitive & Lois de la Gestalt (Sweller / Miller)
- **Nombre de catégories sur Bar Chart Vertical** : Strictement $N \le 7$. Si $N > 7$ ou si les libellés sont longs, basculer obligatoirement sur `bar-chart-horizontal`.
- **Séries multi-lignes** : Strictement $\le 5$ courbes simultanées (éviter le *Spaghetti Chart*).
- **Étiquettes de données (DataLabels)** : Autorisées si $N \le 7$ ou sur des points focaux critiques. Désactivées si $N > 12$ pour éviter l'encombrement perceptif.

### 3. Sémantique de Valence & Polarité Métier
Ne jamais supposer qu'une hausse est toujours verte ou qu'une baisse est toujours rouge :
- **`HIGHER_IS_BETTER`** (CA, Marge, Rétention) : Hausse = Vert (`semantic.positive`), Baisse = Rouge (`semantic.negative`).
- **`LOWER_IS_BETTER`** (Churn, Coûts, Latence, Pannes, Consommation) : Hausse = Rouge (`semantic.negative`), Baisse = Vert (`semantic.positive`).
- **`TARGET_BASED`** (SLA, Température) : Dans la cible = Vert, Tolérance = Orange/Jaune, Dépassement = Rouge.
- **`NEUTRAL_CATEGORICAL`** (Pays, Départements) : Palette catégorielle neutre sans jugement de valeur.

### 4. Accessibilité WCAG 2.2, Infobulles & Rendu Instantané
- **Contraste minimal texte / fond** : $\ge 4.5:1$ (WCAG AA) et $\ge 7:1$ (WCAG AAA).
- **Rendu Instantané Déterministe** : `animation: false` par défaut pour une latence zéro (0 ms), une robustesse absolue et zéro glitch d'affichage.
- **Infobulles** : Positionnement anti-occlusion (Mayer) obligatoire pour ne jamais masquer les points ou barres adjacentes.

---

## 🛠️ Outillage Déterministe

Point d'entrée unique : le CLI `kit-charts` (`bin/kit-charts.js`, sans installation dans le dépôt :
`node bin/kit-charts.js`). Il délègue aux scripts de `.agents/skills/kit-charts/scripts/`.

```bash
# Parcours par défaut, en un appel (CSV, TSV ou JSON en lignes ; JSON formattedData sinon) :
# recommandation, conversion des données, compilation, audit, rendu réel, export.
kit-charts make data.csv --title "Le constat" --subtitle "Unité, période" --polarity HIGHER_IS_BETTER [--intent X] [--export png,svg,pdf] [--offline]
kit-charts update output/<slug> [--data data.csv] [--title ...]   # garde template, thème, polarité, colonnes
kit-charts compile output/<page>/page.json                        # page à plusieurs graphiques (charts: [spec ou chemin])
kit-charts export output/<slug>/index.html --format png,svg,pdf

# Pas à pas (cas non couverts par make)
kit-charts recommend data.json --intent comparison
kit-charts describe <id>
kit-charts init-spec <id> -o output/<slug>/spec.json
kit-charts compile output/<slug>/spec.json -o output/<slug>/index.html   # exit 1 si erreur bloquante, --force pour déboguer
kit-charts validate output/<slug>/index.html --json
kit-charts check output/<slug>/index.html

# Tests. Toute modification d'un template DOIT passer cette porte (voir § Discipline).
npm test             # intégration, parcours make, snapshots --check, benchmark tokens --assert
npm run test:render  # rendu réel des 73 templates (Chrome + réseau)
npm run test:export  # PNG, SVG, PDF (Chrome, pages hors ligne)
npm run test:cli     # paquet installé
npm run bench        # coût en tokens, pas à pas contre make, sur les 9 cas d'eval

# Régénérer les snapshots APRÈS modification intentionnelle d'un template.
# Relire le diff avant de commiter : jamais de régénération aveugle pour verdir un rouge.
npm run snapshots
node test/snapshot-configs.js --check

# Dépendances épinglées : changer une version dans scripts/vendor-pins.js, puis
npm run vendor -- --update-hashes   # télécharge dans vendor/ et recalcule les SHA-384
```

---

## 🧪 Discipline des Tests (Anti-Bruit)

Tout agent qui ajoute ou modifie un test **doit** respecter ces règles :

1. **Un test doit pouvoir échouer.** Exhiber la mutation du code de production qui le ferait
   rougir. Interdits : `fs.existsSync()` du fichier que le code sous test vient d'écrire ;
   constante comparée à son propre littéral ; disjonctions `a || b || c` où un membre passe
   pour une mauvaise raison (ex. un mot présent en commentaire).
2. **Tester le comportement observable, jamais le source.** Interdit d'asserter
   `codeSource.includes('...')` comme preuve. Exécuter le script et asserter ses sorties
   réelles : `compile-chart.js` sort en `1`, n'écrit rien et cite la règle sur une spec non
   conforme (Bloc 10).
3. **Un bug = un FAIL lisible.** Ne pas tripler statut + `ruleId` + catégorie sur le même
   objet d'erreur. Regrouper les cas en boucle avec les fautifs nommés dans le message
   (modèle des Blocs 9 et 11).
4. **Invariants relationnels, pas nombres magiques.** Compter depuis le registre
   (`registry.templates.length`), jamais `=== 74`. URLs CDN **versionnées** exactes
   (supply-chain, source unique `scripts/vendor-pins.js`), jamais de sous-chaînes de noms.
5. **Snapshots : filet, pas routine.** `--check` fige la config Chart émise par template ×
   thème (PRNG seedé, déterministe). Après modification intentionnelle : régénérer, **relire
   le diff**, puis `--check`. Un template peut violer `Y=0` en interne tout en passant la
   validation de spec : seuls les snapshots et le filet du point 6 le détectent.
6. **Y=0 vérifié à l'émission (Bloc 11).** Chaque template à encodage longueur
   (`LENGTH_ENCODED_TEMPLATES` de `validate-chart.js`) doit émettre `beginAtZero:true` sur son
   axe de valeur et jamais `beginAtZero:false`. Exemptions documentées et temporaires :
   `kpi-bullet`, `kpi-distribution` (gabarits DOM, à statuer). Tout agent modifiant un
   template longueur préserve cet invariant.
7. **Économie de tokens surveillée.** `test/token-benchmark.js --assert` (dans `npm test`)
   échoue si `make` ne coûte plus moins cher que le parcours pas à pas sur un des 9 cas
   d'eval, ou s'il ne les produit plus sans erreur. Garder la sortie de `make` compacte.
8. **Calculs en direct.** `themes/stat-helpers.js` (quantile, mean, studentT, ci95) : asserts
   sur fixtures avec valeurs exactes, jamais sur la présence de chaînes dans le HTML.

---

## 📁 Ressources & Références pour Agents

- [`.agents/skills/kit-charts/registry.json`](.agents/skills/kit-charts/registry.json) : Registre machine-readable exhaustif des 73 templates (le démonstrateur `template/tooltip/` n'en fait pas partie).
- [`.agents/agents/dataviz.md`](.agents/agents/dataviz.md) : Agent unique (qualifier, construire, auditer).
- [`.agents/skills/kit-charts/SKILL.md`](.agents/skills/kit-charts/SKILL.md) : Workflow du skill, contrat, règles et rapport.
- [`.agents/skills/kit-charts/references/spec-contract.md`](.agents/skills/kit-charts/references/spec-contract.md) : Champs de la spec et valeurs permises.
- [`.agents/skills/kit-charts/references/review-checklist.md`](.agents/skills/kit-charts/references/review-checklist.md) : Revue experte avant livraison.
- [`.agents/skills/kit-charts/evals/`](.agents/skills/kit-charts/evals/) : Cas d'évaluation du skill (format `claude plugin eval`).
- [`.agents/skills/kit-charts/references/decision-matrix.md`](.agents/skills/kit-charts/references/decision-matrix.md) : Arbre de décision analytique.
- [`.agents/skills/kit-charts/references/color-semantics.md`](.agents/skills/kit-charts/references/color-semantics.md) : Guide des 8 thèmes et polarités.
- [`.agents/skills/kit-charts/references/interaction-tooltips-animations.md`](.agents/skills/kit-charts/references/interaction-tooltips-animations.md) : Guide décisionnel infobulles, étiquettes directes et légendes.
- [`.agents/rules/dataviz-rules.md`](.agents/rules/dataviz-rules.md) : Fiche de synthèse des règles de garde.

