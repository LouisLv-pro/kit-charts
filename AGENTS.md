# 🤖 Directives & Architecture Agentique — Kit-Charts

Bienvenue sur le référentiel **kit-charts**. Ce fichier définit les règles fondamentales, les rôles des agents et les procédures d'orchestration pour tout agent IA (Antigravity, Claude, OpenAI, etc.) intervenant sur ce dépôt ou utilisant ses capacités de visualisation de données.

---

## 🏛️ Rôles des Agents Spécialisés

Pour garantir zéro hallucination et un respect absolu des sciences cognitives, toute tâche de datavisualisation doit être exécutée selon une répartition stricte des rôles :

```
┌─────────────────────────────────────────────────────────────┐
│ 1. DATAVIZ-ARCHITECT (L'Architecte Décideur)                │
│    Analyse l'intention, choisit le template dans le         │
│    registre, qualifie le thème et la polarité métier,       │
│    justifie explicitement les infobulles/étiquettes/        │
│    animations, et produit le contrat dataviz-spec.json.     │
└──────────────────────────────┬──────────────────────────────┘
                               │ Contrat dataviz-spec.json
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. DATAVIZ-BUILDER (Le Constructeur / Exécuteur)            │
│    Consomme la spec, déclenche le skill kit-charts et       │
│    compile le template standardisé sans coder ad-hoc.       │
└──────────────────────────────┬──────────────────────────────┘
                               │ Fichier généré HTML / JS
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. DATAVIZ-REVIEWER (L'Auditeur Qualité & Linter)           │
│    Exécute validate-chart.js, audite les règles de garde    │
│    (Cleveland Axe 0, Sweller N<=7, WCAG >= 4.5:1) et valide.│
└─────────────────────────────────────────────────────────────┘
```

Les spécifications détaillées et prompts de chaque agent sont disponibles dans :
* [`.agents/agents/dataviz-architect.md`](.agents/agents/dataviz-architect.md)
* [`.agents/agents/dataviz-builder.md`](.agents/agents/dataviz-builder.md)
* [`.agents/agents/dataviz-reviewer.md`](.agents/agents/dataviz-reviewer.md)

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

### 4. Accessibilité WCAG 2.2 & Cinématique
- **Contraste minimal texte / fond** : $\ge 4.5:1$ (WCAG AA) et $\ge 7:1$ (WCAG AAA).
- **Cinématique & Animations** : Durée maximale $\le 800\text{ ms}$. Aucun rebond cartoon (`bounce`, `elastic`). Support obligatoire de `prefers-reduced-motion: reduce` ($\Delta T = 0\text{ ms}$).
- **Infobulles** : Positionnement anti-occlusion (Mayer) obligatoire pour ne jamais masquer les points ou barres adjacentes.

---

## 🛠️ Outillage Déterministe

Tout agent peut utiliser les scripts CLI situés dans `.agents/skills/kit-charts/scripts/` :

```bash
# 1. Compilation d'une spécification vers HTML autonome (dans un sous-dossier propre)
node .agents/skills/kit-charts/scripts/compile-chart.js dataviz-spec.json -o output/mon-graphique/index.html

# 2. Audit et linting cognitif / WCAG
node .agents/skills/kit-charts/scripts/validate-chart.js output/mon-graphique/index.html --json

# 3. Lancer la suite de tests complète
npm test
```

---

## 📁 Ressources & Références pour Agents

- [`.agents/skills/kit-charts/registry.json`](.agents/skills/kit-charts/registry.json) : Registre machine-readable exhaustif des 95 templates.
- [`.agents/skills/kit-charts/SKILL.md`](.agents/skills/kit-charts/SKILL.md) : Guide d'utilisation du skill.
- [`.agents/skills/kit-charts/references/decision-matrix.md`](.agents/skills/kit-charts/references/decision-matrix.md) : Arbre de décision analytique.
- [`.agents/skills/kit-charts/references/color-semantics.md`](.agents/skills/kit-charts/references/color-semantics.md) : Guide des 8 thèmes et polarités.
- [`.agents/skills/kit-charts/references/interaction-tooltips-animations.md`](.agents/skills/kit-charts/references/interaction-tooltips-animations.md) : Guide décisionnel infobulles, étiquettes et catalogue des 20 animations.
- [`.agents/rules/dataviz-rules.md`](.agents/rules/dataviz-rules.md) : Fiche de synthèse des règles de garde.
