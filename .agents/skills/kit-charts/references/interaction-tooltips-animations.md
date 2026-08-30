# 🧭 Guide Décisionnel : Infobulles, Étiquettes & Légendes

Ce document est le **guide opérationnel de décision** pour l'Architecte Dataviz (`dataviz-architect`). Il répond de manière directe et structurée à la question fondamentale :
> **Pour la situation métier et le graphique analysés, comment calibrer précisément les infobulles, les étiquettes directes et les légendes pour une lisibilité cognitive maximale à latence zéro ?**

---

## 1. 🏷️ Étiquettes de Données Directes (*DataLabels*)

### Problème Métier Résolu
L'étiquette directe élimine l'effort de projection visuelle vers l'axe et permet une lecture instantanée de la valeur sans aucune interaction physique (idéal pour les rapports exécutifs, impressions et dashboards en coup d'œil rapide).

### Matrice Décisionnelle : Quand Activer ou Désactiver ?

| Critère / Situation | Décision | Justification Cognitive & Psychophysique |
| :--- | :---: | :--- |
| **Comparaison avec peu de catégories ($N \le 7$)** | ✅ **Activer** | Capacité de mémoire de travail respectée ($7 \pm 2$). Lecture immédiate sans encombrement. |
| **Bar Chart Horizontal (`bar-chart-horizontal`, `bullet-chart`)** | ✅ **Activer** | L'alignement au bout de la barre horizontale offre un espace naturel très lisible. |
| **Point Focal d'Alerte ou Extremum (Min / Max / Anomalie)** | ✅ **Activer** | Guidage de l'attention pré-attentive sur le signal prioritaire sans étiqueter le bruit de fond. |
| **Cartes KPI & Synthèses (`kpi-standard`, `kpi-bullet`)** | ✅ **Activer** | La valeur quantitative est le centre du message cognitif. |
| **Séries temporelles denses ($N > 12$ points)** | 🚫 **Désactiver** | Risque majeur de chevauchement (*visual clutter*) et destruction de la lisibilité de la pente. |
| **Multi-courbes denses ($> 3$ courbes simultanées)** | 🚫 **Désactiver** | Surcharge textuelle. Déléguer aux infobulles synchronisées. |
| **Nuages de points denses (Scatter / Bubble)** | 🚫 **Désactiver** | Occlusion des points voisins. Étiqueter uniquement les éventuels points isolés d'intérêt. |
| **Treemaps & Matrices très partitionnées** | 🚫 **Désactiver** | Les petits polygones n'ont pas la surface requise pour afficher le texte sans troncature. |

### Règles de Formatage des Étiquettes
1. **Unité et Format compact** : Utiliser `Intl.NumberFormat` (ex: `48,2 MW`, `1,2 M€`, `+14%`).
2. **Police Monospace Tabulaire** : Utiliser la police `fontMono` du thème pour un alignement décimal parfait.
3. **Contraste Élevé** : Toujours utiliser la couleur contrastée du thème (`#ECEFF4` en Dark, `#0F172A` en Light).

---

## 2. 💬 Infobulles (*Tooltips / Details-on-Demand*)

### Problème Métier Résolu
Appliquer le principe de Shneiderman (*"Overview first, zoom and filter, then details-on-demand"*). L'infobulle délivre la précision chirurgicale, les métriques d'écart calculées et les métadonnées contextuelles au moment exact où l'œil se focalise sur une entité.

### Matrice Décisionnelle : Quel Mode & Contenu Choisir ?

| Famille / Géométrie du Graphique | Mode Recommandé | Axe & Détection | Contenu Optimal de l'Infobulle |
| :--- | :--- | :--- | :--- |
| **Séries Temporelles & Multi-Lignes** | `mode: 'index'` | `axis: 'x'`, `intersect: false` | Date exacte, valeurs de toutes les séries superposées alignées en monospace, delta vs période $N-1$. |
| **Barres & Colonnes Simples** | `mode: 'index'` | `axis: 'x'` ou `'y'`, `intersect: false` | Catégorie, valeur absolue formatée, part du total ($X\%$). |
| **Comparaison Cibles (`bullet-chart`, `bar-target-overlay`)** | `mode: 'index'` | `axis: 'y'`, `intersect: false` | Réalisé, Cible, Alerte, Écart relatif ($\Delta\%$) et statut (Conforme / Alerte). |
| **Corrélation & Nuages 2D (`scatter-plot`, `bubble-chart`)** | `mode: 'nearest'` | `axis: 'xy'`, `intersect: false` | Nom de l'entité, coordonnée $X$, coordonnée $Y$, dimension bulle $Z$. |
| **Part-to-Whole (`doughnut-chart`, `treemap`, `waffle`)** | `mode: 'nearest'` | `axis: 'xy'`, `intersect: true` | Nom du segment, montant absolu, pourcentage exact ($XX.X\%$). |
| **Distributions (`box-plot`, `histogramme`)** | `mode: 'nearest'` | `axis: 'xy'`, `intersect: false` | Statistiques complètes (Médiane, Q1, Q3, Min, Max, Outliers détectés). |
| **Flux & Entonnoirs (`funnel-chart`, `waterfall-chart`)** | `mode: 'index'` | `axis: 'y'`, `intersect: false` | Étape actuelle, volume entrant, taux de conversion vs étape précédente et vs départ. |

### Règle d'Or Anti-Occlusion (Mayer)
L'infobulle **ne doit JAMAIS masquer le point ou la barre inspectée**. kit-charts configure automatiquement un déport de sécurité et le respect de la continuité spatiale.

---

## 3. 🧭 Légendes Ergonomiques (*Legends & Keys*)

### Problème Métier Résolu
La légende permet d'associer immédiatement une série à sa signification sémantique tout en limitant la charge cognitive.

### Matrice Décisionnelle : Quand Afficher la Légende ?

| Situation | Affichage | Position & Style Recommandés |
| :--- | :---: | :--- |
| **Série unique ($K = 1$)** | 🚫 **Masquée (`display: false`)** | Élimination du bruit non informatif (*non-data ink* de Tufte). Le titre ou le sous-titre porte déjà le sens de la métrique. |
| **Multi-séries ($2 \le K \le 5$)** | ✅ **Affichée (`display: true`)** | Position en haut (`position: 'top'`), alignée au début (`align: 'start'`) ou à droite, puces rondes (`usePointStyle: true`). |
| **Séries chronologiques ($K \le 3$)** | 🎯 **Direct Labeling privilégié** | Étiqueter directement l'extrémité droite des courbes plutôt que d'utiliser une boîte de légende déportée (principe de contiguïté de Mayer). |
| **Tableaux & Cartes thématiques** | 📊 **Barre de gradient intégrée** | Échelle continue avec repères numériques (Min, Médian, Max). |

---

## 4. ⚡ Rendu Instantané & Déterministe

Toutes les visualisations de kit-charts sont configurées avec **`animation: false`**.
- **Latence zéro (0 ms)** : Le graphique apparaît instantanément dès le chargement DOM ou le changement de filtre.
- **Zéro glitch** : Aucun saut de rendu, aucun problème de timing de plugins, compatibilité parfaite avec les captures automatisées et les environnements headless / SSR.
- **Survol fluide** : Les infobulles s'affichent instantanément sans délai d'attente.

---

## 📋 Synthèse Contractuelle pour l'Architecte (`dataviz-spec.json`)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "targetTemplateId": "bullet-chart",
  "layout": {
    "title": "Consommation Électrique Industrielle vs Cibles",
    "subtitle": "En Mégawatts (MW) — Supervision par atelier",
    "height": 420
  },
  "colorStrategy": {
    "themeName": "nord-cognitive-dark",
    "mode": "semantic-valence",
    "metricPolarity": "LOWER_IS_BETTER"
  },
  "cognitiveFeatures": {
    "showDataLabels": true,
    "tooltip": {
      "enabled": true,
      "mode": "index",
      "axis": "y",
      "antiOcclusion": true
    }
  },
  "formattedData": {
    "labels": ["Fonderie A", "Laminage B", "Usinage C"],
    "datasets": [
      { "label": "Consommation Réalisée", "data": [48.2, 32.1, 14.5] },
      { "label": "Seuil Cible", "data": [45.0, 35.0, 16.0] },
      { "label": "Seuil Alerte Maximale", "data": [50.0, 40.0, 20.0] }
    ]
  }
}
```
