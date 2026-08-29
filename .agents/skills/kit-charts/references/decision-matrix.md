# 🧭 Matrice Déterministe de Sélection Dataviz (Kit-Charts)

Ce document fournit aux agents IA et aux architectes de données l'algorithme déterministe pour associer un **objectif analytique métier** et une **structure de données** au **template optimal** parmi les 89 composants de `kit-charts`.

---

## 1. Arbre de Décision Global

```
Objectif Analytique ────────► Structure des Données ─────────────► Template ID Recommandé
──────────────────────────────────────────────────────────────────────────────────────────
0. KPI CARDS & SYNTHÈSES DÉCISIONNELLES
   ├── Métrique unique dominante + Delta temporel + Valence ────► kpi-standard
   ├── Tendance continue haute densité (Data-Ink Tufte) ────────► kpi-sparkline
   ├── Performance vs Cible + Seuils qualitatifs (Stephen Few) ─► kpi-bullet
   ├── Triangulation Réalisé vs N-1 vs Budget (Anti-ancrage) ───► kpi-comparative
   ├── Agrégat macro + Décomposition Part-to-Whole (Mayer) ─────► kpi-distribution
   ├── Supervision d'infrastructure + Alerte RAG multi-états ───► kpi-status-alert
   └── Équation d'affaires + Leviers causaux directs (DuPont) ──► kpi-composite

1. COMPARAISON & CLASSEMENT
   ├── Catégories nominales (≤ 7, labels courts) ───────────────► bar-chart-vertical
   ├── Catégories nominales (> 7 OU labels longs) ──────────────► bar-chart-horizontal
   ├── Deux sous-groupes par catégorie (≤ 4 groupes) ──────────► grouped-bar-chart
   ├── Cumul + décomposition (segment bas prioritaire) ────────► stacked-bar-chart
   ├── Réalisé vs Cible / KPI vs Objectif (Stephen Few) ───────► bullet-chart
   ├── Réalisé vs Cible avec deltas de variance automatisés ───► bar-target-overlay
   ├── Classement élégant à forte densité (10-25 éléments) ────► lollipop-chart
   ├── Évolution entre exactement 2 dates fixes ────────────────► slope-chart
   ├── Écart / Delta binaire par entité (ex: Avant/Après) ──────► dumbbell-chart
   ├── Profil multidimensionnel synthétique (≤ 2 entités) ──────► radar-chart
   └── Données cycliques ou angulaires à forte symétrie ───────► polar-area-chart

2. COMPOSITION (Part-to-Whole / 100%)
   ├── 2 à 3 tranches à fort contraste ─────────────────────────► pie-chart
   ├── 2 à 4 tranches avec KPI central en grand format ────────► doughnut-chart
   ├── Nombreux segments hiérarchiques (10 à 50+ éléments) ────► treemap
   ├── Arborescence multi-niveaux concentrique ─────────────────► sunburst
   ├── Pourcentages discrets / Ratios intuitifs (1 cellule = 1%)► waffle-chart
   ├── Comparaison de composition entre plusieurs groupes ──────► stacked-bar-100
   ├── Priorisation des causes vitales (Loi 80/20 & Gini) ──────► pareto-chart
   └── Décomposition empilée + Courbe du total macro ──────────► stacked-total-line

3. DISTRIBUTION STATISTIQUE
   ├── Variable continue unique (N ≥ 100) ──────────────────────► histogramme
   ├── Forme de distribution continue lissée (2-4 groupes) ─────► density-plot
   ├── Effectif empirique + Courbe de densité théorique ────────► histogramme-kde
   ├── Comparaison robuste de dispersion & médiane (5-20 groupes)► box-plot
   ├── Synthèse Tukey + Observations individuelles réelles ─────► box-strip-plot
   ├── Densité continue + Micro-box + Semis de points bruts ────► raincloud-plot
   ├── Distribution multimodale / bimodalité suspectée ────────► violin-plot
   ├── Données brutes individuelles (N ≤ 100) avec jitter ──────► strip-plot
   ├── Données brutes empilées sans collision (N = 30-300) ─────► beeswarm-plot
   └── Densité croisée sur 2 axes discrets / binnés ───────────► distribution-heatmap

4. CORRÉLATION & RELATION MULTIVARIÉE
   ├── 2 variables continues cartésiennes (X, Y) ──────────────► scatter-plot
   ├── Nuage bivarié + Régression OLS + Bande IC 95% ───────────► scatter-regression
   ├── Nuage 2D central + Densités marginales KDE + Ellipse 95% ─► joint-scatter-marginals
   ├── 3 variables continues (X, Y + Z en surface √Z) ──────────► bubble-chart
   ├── Matrice croisée / Corrélations bivariées multiples ──────► matrix-heatmap
   ├── Trajectoire dynamique temporelle ordonnée ───────────────► connected-scatter-plot
   └── Très grand volume bivarié (N > 2 000, anti-overplotting)► density-2d-hexbin

5. ÉVOLUTION TEMPORELLE (Séries chronologiques)
   ├── Série continue unique dans le temps ────────────────────► line-chart
   ├── 2 à 4 séries temporelles (Focus + Context) ──────────────► multi-line-chart
   ├── Volume cumulé / masse sous la courbe (Y ≥ 0) ────────────► area-chart
   ├── Somme de composantes additives continues ────────────────► stacked-area-chart
   ├── Flux qualitatif thématique fluide ───────────────────────► streamgraph
   ├── Cotation financière (Open, High, Low, Close) ────────────► candlestick-ohlc
   ├── Cours boursier OHLC + Volume de transactions (2 zones) ──► candlestick-volume
   ├── 2 séries hétérogènes avec zéros alignés et Pearson r ──► dual-axis-controlled
   ├── Cours + Tendance SMA + Canal de volatilité (±2σ) ────────► price-indicator-overlays
   └── Tendance historique ultra-compacte dans un tableau/KPI ──► sparkline

6. FLUX, PROCESSUS & PIPELINES
   ├── Transfert et conservation de flux directionnels ─────────► sankey-diagram
   ├── Échanges bilatéraux circulaires réciproques ─────────────► chord-diagram
   ├── Processus séquentiel à déperdition (Entonnoir) ──────────► funnel-chart
   ├── Bilan séquentiel des gains (+) et pertes (-) ────────────► waterfall-chart
   ├── Pont de variance + Courbe de trajectoire de solde net ───► waterfall-cumulative-line
   ├── Planning de projet + Avancement interne + Repère du jour ─► gantt-progress
   └── Reconfiguration de cohortes à travers des étapes ────────► alluvial-diagram

7. HIÉRARCHIE & RÉSEAUX
   ├── Réseau topologique relationnel (15-80 nœuds) ────────────► node-link-network
   ├── Réseau séquentiel 1D ordonné ────────────────────────────► arc-diagram
   ├── Taxonomie arborescente / Classification hiérarchique ────► dendrogram
   └── Tableau de contingence 2D (100% × 100%) ────────────────► marimekko-chart

8. GÉOSPATIAL & CARTES
   ├── Taux / Ratios normalisés par zone administrative ────────► choropleth-map
   ├── Totaux absolus localisés (Cercles proportionnels √N) ────► bubble-map
   └── Égalité visuelle stricte entre entités territoriales ────► cartogram-tilegram

9. TABLEAUX DE DATAVISUALISATION
   ├── Synthèse multi-indicateurs exécutifs + Cibles + 12M ──────► table-kpi-scorecard
   ├── Matrice de concentration 2D + Gradient continu WCAG AAA ─► table-heatmap-matrix
   ├── Comparaison instantanée de grandeurs (Cleveland Rang 1) ─► table-bar-in-cell
   ├── Taxonomie arborescente multiniveaux avec drill-down ─────► table-hierarchical-tree
   ├── États financiers & P&L avec écarts budgétaires IBCS ─────► table-financial-variance
   └── Classement ordonné + Podium + Mobilité de position ──────► table-ranking-leaderboard
```

---

## 2. Tableau Récapitulatif des Contraintes & Limites

| Template ID | Famille | Min Catégories | Max Catégories | Séries Max | Contrainte Critique |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `kpi-standard` | `00-kpi-card` | 1 | 1 | 1 | Métrique unique + delta |
| `kpi-sparkline` | `00-kpi-card` | 5 | 30 | 1 | Tendance continue sans axe Y |
| `kpi-bullet` | `00-kpi-card` | 1 | 1 | 3 | Réalisé + Cible + Bandes |
| `kpi-comparative` | `00-kpi-card` | 1 | 1 | 3 | Réalisé N + N-1 + Budget |
| `kpi-distribution` | `00-kpi-card` | 2 | 5 | 1 | Somme normalisée à 100% |
| `kpi-status-alert` | `00-kpi-card` | 1 | 1 | 1 | 3 à 4 états de sévérité |
| `kpi-composite` | `00-kpi-card` | 3 | 5 | 1 | Formule causale liée |
| `bar-chart-vertical` | `01-comparaison` | 1 | 7 | 1 | `beginAtZero: true` obligatoire |
| `bar-chart-horizontal` | `01-comparaison` | 1 | 25 | 1 | Tri décroissant recommandé |
| `grouped-bar-chart` | `01-comparaison` | 2 | 6 | 4 | Max 4 barres par groupe |
| `stacked-bar-chart` | `01-comparaison` | 2 | 8 | 5 | Base segment 0 critique |
| `bullet-chart` | `01-comparaison` | 1 | 10 | 3 | Repère cible Stephen Few |
| `bar-target-overlay` | `01-comparaison` | 1 | 12 | 2 | Barres + marqueur cible |
| `lollipop-chart` | `01-comparaison` | 5 | 30 | 1 | Haut Data-Ink ratio |
| `slope-chart` | `01-comparaison` | 2 | 10 | 2 dates | Exactement 2 périodes |
| `dumbbell-chart` | `01-comparaison` | 2 | 15 | 2 points | Paires de valeurs |
| `radar-chart` | `01-comparaison` | 3 | 8 | 2 | Max 2 entités comparées |
| `polar-area-chart` | `01-comparaison` | 3 | 7 | 1 | Angles égaux, rayons $\sqrt{V}$ |
| `pie-chart` | `02-composition-part-to-whole` | 2 | 3 | 1 | 3 parts max, $100\%$ |
| `doughnut-chart` | `02-composition-part-to-whole` | 2 | 4 | 1 | KPI au centre |
| `treemap` | `02-composition-part-to-whole` | 4 | 50 | 1 | Aires rectangulaires |
| `sunburst` | `02-composition-part-to-whole` | 4 | 30 | multi-level | Hiérarchie radiale |
| `waffle-chart` | `02-composition-part-to-whole` | 2 | 5 | 1 | Grille 100 cellules |
| `stacked-bar-100` | `02-composition-part-to-whole` | 2 | 10 | 5 | Normalisation 100% |
| `pareto-chart` | `02-composition-part-to-whole` | 4 | 15 | 2 | Barres triées + Cumul 80% |
| `stacked-total-line` | `02-composition-part-to-whole` | 3 | 12 | 4 | Barres + Ligne somme |
| `histogramme` | `03-distribution` | 50 points | 10 000 | 1 | Freedman-Diaconis bins |
| `density-plot` | `03-distribution` | 30 points | 10 000 | 3 | Silverman bandwidth |
| `box-plot` | `03-distribution` | 1 | 15 groupes | 1 | Quartiles de Tukey |
| `raincloud-plot` | `03-distribution` | 1 | 6 groupes | 3 layers | Half-KDE + Box + Jitter |
| `violin-plot` | `03-distribution` | 1 | 8 groupes | 1 | KDE bilatérale symétrique |
| `scatter-plot` | `04-correlation-relation` | 10 points | 1 000 | 2 var | Axes X, Y continus |
| `scatter-regression` | `04-correlation-relation` | 15 points | 500 | 2 var | OLS line + IC 95% |
| `bubble-chart` | `04-correlation-relation` | 5 points | 100 | 3 var | Rayon $R \propto \sqrt{Z}$ |
| `matrix-heatmap` | `04-correlation-relation` | 3 × 3 | 20 × 20 | 1 | Échelle séquentielle |
| `line-chart` | `05-evolution-temporelle` | 4 | 50 dates | 1 | Échelle temporelle X |
| `multi-line-chart` | `05-evolution-temporelle` | 4 | 50 dates | 4 | Max 4-5 lignes |
| `candlestick-ohlc` | `05-evolution-temporelle` | 10 | 100 dates | 4 var | Open, High, Low, Close |
| `candlestick-volume` | `05-evolution-temporelle` | 10 | 100 dates | 5 var | OHLC + Panneau volume |
| `sankey-diagram` | `06-flux-processus` | 4 nœuds | 30 nœuds | liens | Conservation de flux |
| `funnel-chart` | `06-flux-processus` | 3 | 8 étapes | 1 | Taux de conversion |
| `waterfall-chart` | `06-flux-processus` | 3 | 12 étapes | 1 | Pont de variance (+ / -) |
| `choropleth-map` | `08-geospatial-cartes` | 5 régions | 100 régions | 1 | Ratios normalisés |
