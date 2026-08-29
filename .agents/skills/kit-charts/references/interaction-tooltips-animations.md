# 🧭 Guide Décisionnel : Infobulles, Étiquettes & Animations

Ce document est le **guide opérationnel de décision** pour l'Architecte Dataviz (`dataviz-architect`). Il répond de manière directe et structurée à la question fondamentale :
> **Pour la situation métier et le graphique analysés, faut-il inclure des infobulles, des étiquettes directes et/ou une animation ? Et lesquelles choisir précisément ?**

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
L'infobulle **ne doit JAMAIS masquer le point ou la barre inspectée**. kit-charts calcule automatiquement l'inversion de quadrant (`top` / `bottom`) et le déport de sécurité de $12\text{px}$.

---

## 3. 🎬 Micro-Animations Déterministes (Catalogue des 20 Patterns)

### Problème Métier Résolu
Guider l'attention visuelle sans cécité au changement (*change blindness*, Simons & Rensink), expliciter la structure des données (ordre temporel, relations part-to-whole) et matérialiser les alertes critiques.

### Matrice Décisionnelle des 20 Patterns de `template/animation/`

| Pattern ID | Nom du Pattern | Problème Analytique & Situation Métier | Graphiques Cibles Idéaux | Comportement Cinématique |
| :--- | :--- | :--- | :--- | :--- |
| **`01`** | **`01-staged-transitions`** | Décomposition étape par étape, cascade de coûts, impact séquentiel. | `waterfall-chart`, `stacked-bar-chart`, `funnel-chart` | Transition séquentielle ordonnée sans télescopage. |
| **`02`** | **`02-progressive-drilldown`** | Navigation du global vers le détail, zoom hiérarchique. | `treemap`, `sunburst`, `drilldown-bar` | Zoom fluide avec conservation de l'ancre visuelle parente. |
| **`03`** | **`03-preattentive-pulse`** | **Alerte industrielle, dépassement de seuil, anomalie critique**. | `bullet-chart`, `kpi-standard`, `gauge-chart` | Pulsation lumineuse discrète (1-2 cycles) sur l'élément hors-norme. |
| **`04`** | **`04-time-scrubber`** | Replay d'une séquence historique, simulation chronologique. | `connected-scatter`, `bubble-chart`, `line-chart` | Défilement temporel fluide piloté par curseur. |
| **`05`** | **`05-morphing-scales`** | Changement de repère (linéaire $\leftrightarrow$ log, absolu $\leftrightarrow$ $100\%$). | `stacked-bar-100`, `area-chart` | Interpolation continue des axes sans saut brutal. |
| **`06`** | **`06-focus-context-lens`** | Exploration d'une série chronologique ultra-longue. | `multi-line-chart`, `candlestick-financial` | Zoom loupe localisé préservant la courbe globale de contexte. |
| **`07`** | **`07-streaming-realtime`** | Télémétrie en direct, IoT, flux d'activité réseau 24/7. | `realtime-line`, `sparkline-dense` | Translation glissante continue vers la gauche ($60\text{ fps}$). |
| **`08`** | **`08-difference-reveal`** | Comparaison A/B, écart Budget vs Réel, scénario Before/After. | `dumbbell-plot`, `slope-chart`, `bullet-chart` | Apparition de l'état A puis traînée révélant l'écart vers l'état B. |
| **`09`** | **`09-path-drawing`** | Mise en évidence d'une trajectoire ou tendance historique. | `line-chart`, `step-line-chart`, `area-chart` | Tracé progressif de gauche à droite matérialisant le temps irréversible. |
| **`10`** | **`10-count-up`** | Chiffre clé marquant, totalisation financière, KPI exécutif. | `kpi-standard`, `kpi-comparison`, `kpi-sparkline` | Incrémentation chiffrée rapide avec décélération `easeOutQuart`. |
| **`11`** | **`11-ranked-reordering`** | **Classements compétitifs, ligues, parts de marché évolutives**. | `bar-chart-horizontal`, `bump-chart` | Glissement vertical des barres échangeant leur rang (Heer 2007). |
| **`12`** | **`12-cluster-settle`** | Détection de segments clients, nuages de points multivariés. | `scatter-plot`, `bubble-chart` | Déploiement des points depuis le centre vers leurs attracteurs. |
| **`13`** | **`13-confidence-sweep`** | Prévisions statistiques, incertitude météo/financière, cône d'erreur. | `fan-chart`, `band-line-chart` | Déploiement de la médiane puis balayage du ruban de confiance. |
| **`14`** | **`14-distribution-wave`** | Analyse de dispersion, pyramide des âges, distribution salariale. | `histogramme`, `ridgeline-plot`, `violin-plot` | Vague d'émergence des densités de gauche à droite. |
| **`15`** | **`15-flow-pulse`** | Circulation de capitaux, chaîne logistique, parcours utilisateurs. | `sankey-diagram`, `chord-diagram` | Impulsion d'opacité voyageant le long des rubans de flux. |
| **`16`** | **`16-tree-expansion`** | Organigrammes d'entreprise, taxonomies, catalogues de produits. | `radial-tree`, `dendrogramme` | Dépliage progressif des branches nœud par nœud. |
| **`17`** | **`17-divergent-split`** | Sondages d'opinion (Pour/Contre), pyramides, bilans comptables. | `diverging-bar-chart`, `likert-scale` | Séparation symétrique bilatérale depuis l'axe zéro central. |
| **`18`** | **`18-radial-sweep`** | Évaluation de compétences (360°), jauges de conformité. | `radar-chart`, `gauge-radial-progress` | Balayage angulaire horaire de $0^\circ$ à $360^\circ$. |
| **`19`** | **`19-geo-choropleth-flow`** | Déploiement géographique, diffusion épidémique ou commerciale. | `choropleth-map`, `bubble-map` | Révélation cartographique par proximité spatiale ou intensité. |
| **`20`** | **`20-delta-flash`** | Événement boursier soudain, pic de charge serveur imprévu. | `candlestick-chart`, `kpi-standard` | Flash d'accentuation ponctuel sur la cellule ou barre modifiée. |

### Quand Désactiver les Animations (`duration: 0`) ?
1. **Accessibilité WCAG 2.2** : Lorsque `prefers-reduced-motion: reduce` est actif.
2. **Thème Tufte Minimalist** : `tufte-minimalist-executive` privilégie le zéro-latence absolu.
3. **Tableaux denses & Grilles financières** : Pas de mouvement dans les tableaux multi-lignes pour éviter la fatigue oculaire.

---

## 📋 Synthèse Rapide pour l'Architecte (`dataviz-spec.json`)

```json
{
  "cognitiveFeatures": {
    "showDataLabels": true,
    "tooltip": {
      "enabled": true,
      "mode": "index",
      "antiOcclusion": true
    },
    "animation": {
      "patternId": "03-preattentive-pulse",
      "durationMs": 500,
      "easing": "easeOutQuart"
    }
  }
}
```
