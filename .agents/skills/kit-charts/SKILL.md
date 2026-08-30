---
name: kit-charts
description: Bibliothèque de datavisualisation agent-native fondée sur les sciences cognitives (Cleveland-McGill, Tufte, Sweller) et WCAG 2.2. Fournit 74 templates Chart.js standardisés, un registre machine-readable, 8 thèmes accessibles avec gestion déterministe de la polarité et un moteur de compilation/validation zéro-dépendance.
---

# 📊 Skill Datavisualisation : kit-charts

Le skill **`kit-charts`** permet aux agents IA de concevoir, valider et assembler des visualisations de données professionnelles sans jamais écrire de code graphique ad-hoc ni introduire de régressions cognitives.

---

## 🎯 Capacités Clés & Principes Fondamentaux

1. **74 Modèles Standardisés (Triplets)** : Chaque graphique est encapsulé dans un triplet (`template.html`, `schema.json`, `template.js`) garantissant une structure DOM propre, un schéma JSON strict et une isolation sans fuite.
2. **Conformité Psychophysique Déterministe** :
   - Respect strict de la hiérarchie de Cleveland & McGill (Position > Longueur > Pente > Aire > Teinte).
   - Ligne de base $Y = 0$ obligatoire sur tous les diagrammes en barres/colonnes/lollipops.
   - Limites de charge cognitive (Miller/Sweller) : $N \le 7$ pour colonnes verticales, $\le 5$ séries pour multi-lignes.
3. **8 Thèmes Cognitifs & Sémantique de Valence** :
   - Prise en compte de la polarité métier (`HIGHER_IS_BETTER`, `LOWER_IS_BETTER`, `TARGET_BASED`).
   - Accessibilité certifiée WCAG 2.2 AA ($Contrast \ge 4.5:1$) et palettes optimisées daltonisme (CVD).
4. **Outillage Déterministe Zéro-Dépendance & Rendu Instantané** :
   - `compile-chart.js` : Compilateur instantané de pages HTML autonomes et snippets (rendu déterministe `animation: false`).
   - `validate-chart.js` : Linter cognitif et d'accessibilité (< 50 ms).
   - `validate-hook.js` : Contrôle qualité continu via les hooks Antigravity.

---

## 🧭 Matrice de Décision Rapide (Sélection du Graphique)

| Intention Analytique | Structure des Données | Template Id Recommandé | Règle Cognitive Clé |
| :--- | :--- | :--- | :--- |
| **KPI Exécutif** | 1 métrique Hero $\pm$ tendance | `kpi-standard`, `kpi-sparkline` | Typographie tabulaire, double encodage du sens de variation. |
| **Comparaison discrète** | Catégoriel court ($N \le 7$) | `bar-chart-vertical` | Axe Y commence à 0 (`beginAtZero: true`). |
| **Comparaison / Classement** | Libellés longs ou $N > 7$ | `bar-chart-horizontal` | Lecture naturelle de gauche à droite, labels non tronqués. |
| **Multi-groupes** | Catégories $\times$ sous-groupes | `grouped-bar-chart` | Max 4 barres par groupe, espacement Gestalt resserré. |
| **Composition Part-to-Whole**| $N \le 5$ composantes | `stacked-bar-100`, `doughnut-chart` | Préférer la barre empilée 100% au camembert pour comparer. |
| **Distribution / Dispersion** | Échantillon continu | `box-plot`, `histogramme` | Résumé à 5 nombres de Tukey, détection visuelle des outliers. |
| **Relation / Corrélation** | 2 variables continues | `scatter-plot`, `scatter-regression` | Échelle commune visible, droite de tendance Tufte. |
| **Évolution Temporelle** | Série chronologique | `line-chart`, `area-chart` | Max 5 courbes simultanées, Direct Labeling privilégié. |

> Pour une analyse approfondie, consulter [references/decision-matrix.md](file:///.agents/skills/kit-charts/references/decision-matrix.md).

---

## 🛠️ Outils & Commandes CLI

### 1. Compilation d'une Visualisation (`compile-chart.js`)

Le compilateur transforme un fichier de spécification `dataviz-spec.json` en page HTML autonome ou snippet DOM :

```bash
# Compilation via fichier spec JSON
node .agents/skills/kit-charts/scripts/compile-chart.js dataviz-spec.json -o output/mon-graphique.html

# Compilation via options CLI directes
node .agents/skills/kit-charts/scripts/compile-chart.js \
  --template bar-chart-vertical \
  --theme colorbrewer-accessible \
  --polarity HIGHER_IS_BETTER \
  --title "Chiffre d'Affaires T4" \
  --data '{"labels":["Nord","Sud","Est","Ouest"],"datasets":[{"data":[420,380,290,310]}]}' \
  --output output/ca-t4.html
```

### 2. Audit & Validation Cognitive (`validate-chart.js`)

Le linter analyse un fichier spec JSON, HTML ou JS et vérifie les règles cognitives et WCAG :

```bash
# Validation standard
node .agents/skills/kit-charts/scripts/validate-chart.js dataviz-spec.json

# Validation avec sortie JSON pour machine/agent
node .agents/skills/kit-charts/scripts/validate-chart.js output/mon-graphique.html --json

# Mode strict (traite les warnings en erreurs bloquantes)
node .agents/skills/kit-charts/scripts/validate-chart.js dataviz-spec.json --strict
```

---

## 📋 Structure Contractuelle : `dataviz-spec.json`

Voici la structure standard que tout agent doit générer pour décrire une visualisation :

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "targetTemplateId": "bar-chart-vertical",
  "layout": {
    "title": "Chiffre d'Affaires par Filiale (2024)",
    "subtitle": "En millions d'euros (€) — Écart vs Objectif budgétaire",
    "height": 400
  },
  "colorStrategy": {
    "themeName": "colorbrewer-accessible",
    "mode": "semantic-valence",
    "metricPolarity": "HIGHER_IS_BETTER"
  },
  "cognitiveFeatures": {
    "showDataLabels": true,
    "tooltip": {
      "enabled": true,
      "mode": "index",
      "antiOcclusion": true
    }
  },
  "formattedData": {
    "labels": ["France", "Allemagne", "Italie", "Espagne"],
    "datasets": [{
      "label": "CA (M€)",
      "data": [450, 380, 210, 190]
    }]
  }
}
```

---

## 📚 Base de Connaissances & Références (Progressive Disclosure)

- [Règles Cognitives & Psychophysique](file:///.agents/skills/kit-charts/references/cognitive-rules.md) : Fondements de Cleveland-McGill, Gestalt, Sweller et Tufte.
- [Matrice de Décision Complète](file:///.agents/skills/kit-charts/references/decision-matrix.md) : Arbre de choix exhaustif pour les 74 motifs graphiques.
- [Guide Infobulles, Étiquettes & Légendes](file:///.agents/skills/kit-charts/references/interaction-tooltips-animations.md) : Calibrage précis des infobulles anti-occlusion, étiquettes directes et légendes.
- [Sémantique des Couleurs & Thèmes](file:///.agents/skills/kit-charts/references/color-semantics.md) : Modèle de valence, polarités et 8 thèmes certifiés.
- [Registre Machine-Readable](file:///.agents/skills/kit-charts/registry.json) : Catalogue JSON officiel des 74 templates et métadonnées.

