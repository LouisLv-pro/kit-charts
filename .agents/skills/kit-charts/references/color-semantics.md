# 🎨 Sémantique des Couleurs, Valence Métier & Thèmes Cognitifs

Ce document spécifie le modèle sémantique de gestion des couleurs, les règles de polarité métier et le système de thèmes accessibles de **kit-charts**.

---

## 1. Modèle de Polarité Métier & Valence Sémantique

Dans `kit-charts`, la couleur n'est jamais purement esthétique. Elle encode une signification métier déterministe selon la **polarité de la métrique** :

### 1.1 Les 4 Modes de Polarité Métier

```
1. HIGHER_IS_BETTER (ex: Chiffre d'affaires, Marge brute, Rétention, Taux de satisfaction)
   - Valeur positive (Hausse / Surperformance)  ──► tokens.semantic.positive (#2E7D32 / Vert accessible)
   - Valeur négative (Baisse / Sous-performance) ──► tokens.semantic.negative (#C62828 / Rouge accessible)
   - Valeur neutre / stable                     ──► tokens.semantic.neutral  (#64748B / Gris ardoise)

2. LOWER_IS_BETTER (ex: Churn client, Coûts fixes, Temps de réponse/latence, Taux de panne)
   - Valeur positive (Hausse des coûts/churn)   ──► tokens.semantic.negative (#C62828 / Rouge alerte)
   - Valeur négative (Baisse des coûts/churn)   ──► tokens.semantic.positive (#2E7D32 / Vert succès)
   - Valeur neutre / stable                     ──► tokens.semantic.neutral  (#64748B / Gris ardoise)

3. TARGET_BASED / TOLERANCE_BAND (ex: Objectifs budgétaires, SLA, Température industrielle)
   - Conforme / Dans la cible (valeur ≥ cible)   ──► tokens.semantic.positive (Vert)
   - Zone d'alerte (seuil d'avertissement)      ──► tokens.semantic.warning  (#E65100 / Orange)
   - Hors tolérance / Rupture critique          ──► tokens.semantic.negative (Rouge)

4. NEUTRAL_CATEGORICAL (ex: Répartition par pays, gammes de produits, secteurs d'activité)
   - Attribution séquentielle de la palette catégorielle sans jugement de valeur ni connotation émotionnelle.
```

---

## 2. Le Catalogue des 8 Thèmes Cognitifs

| ID Thème | Nom & Fondement Scientifique | Type Fond | Usage Recommandé |
| :--- | :--- | :--- | :--- |
| `colorbrewer-accessible` | Cynthia Brewer (Penn State) — Palette universelle équilibrée | Clair (`#FFFFFF`) | Tableaux de bord généraux, rapports financiers standard. |
| `viridis-perceptual` | Van der Walt & Smith (SciPy / PLOS ONE) — Monotone en luminance | Clair (`#FFFFFF`) | Heatmaps continues, distributions, imagerie scientifique. |
| `paul-tol-scientific` | Dr. Paul Tol (SRON) — Palettes haute discrimination CVD | Clair (`#FFFFFF`) | Graphiques scientifiques, courbes denses, multi-séries. |
| `tableau-stone-categorical` | Maureen Stone & Jeffrey Heer (IEEE InfoVis) — Mémorabilité | Clair (`#FFFFFF`) | Comparaisons business, présentations exécutives. |
| `okabe-ito-cud` | Masataka Okabe & Kei Ito — Standard Color Universal Design | Clair (`#FFFFFF`) | Publications officielles, conformité universelle daltonisme. |
| `tufte-minimalist-executive` | Edward Tufte & Stephen Few — Épure radicale Data-Ink | Clair (`#FFFFFF`) | Synthèses C-Level, graphiques imprimables haute densité. |
| `nord-cognitive-dark` | Arctic Dark UI — Anti-éblouissement et repos oculaire | Sombre (`#2E3440`) | Salles de contrôle, monitoring 24/7, dashboards tech. |
| `atkinson-hyperlegible` | Braille Institute — Haute différentiation des glyphes | Clair (`#FFFFFF`) | Basse vision, accessibilité renforcée WCAG AAA. |

---

## 3. Règles d'Accessibilité WCAG 2.2 & Vision des Couleurs (CVD)

1. **Ratios de Contraste Stricts** :
   - Texte normal sur fond : minimum **4.5:1** (AA) / **7.0:1** (AAA).
   - Éléments graphiques (barres, courbes, tranches) sur fond : minimum **3.0:1**.
2. **Double Encodage Obligatoire** :
   - Ne JAMAIS transmettre une information critique (ex: statut d'alerte, tendance positive/négative) uniquement par la teinte.
   - Toujours associer un symbole typographique (`▲` / `▼`), un texte descriptif ou une forme distincte.
3. **Sécurité Daltonisme (Deutéranopie, Protanopie, Tritanopie)** :
   - Les thèmes `okabe-ito-cud`, `colorbrewer-accessible` et `paul-tol-scientific` sont testés sous simulation Dalton pour préserver la séparabilité des séries même en vision monochromatique.
