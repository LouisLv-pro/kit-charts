# 📊 Kit-Charts : Bibliothèque Méthodologique & Cognitive de Dataviz pour Chart.js

Bienvenue dans **kit-charts**, le référentiel open-source de règles de conception graphique fondé sur les **sciences cognitives**, la **psychophysique de la vision** et l'**ergonomie de l'information**.

Ce guide a été conçu pour permettre aux développeurs et aux **agents IA** de concevoir des tableaux de bord et visualisations **déterministes**, exempts d'anti-patterns et optimisés pour la mémoire de travail humaine.

---

## 🏛️ Socle Fondamental

Avant de choisir un graphique, consultez le document de référence transversale :
👉 [**`guide/regles-universelles.md`**](file:///Users/louislaville/Desktop/kit-charts/guide/regles-universelles.md)
- *Hiérarchie de Cleveland & McGill (Position > Longueur > Angle > Surface > Couleur)*
- *Lois de la Gestalt appliquées aux interfaces visuelles*
- *Théorie de la charge cognitive (Sweller) & Ratio Data-Ink (Tufte)*
- *Accessibilité WCAG 2.1 AA/AAA & Vision des couleurs (CVD)*
- *Règles strictes sur l'Axe 0 et la typographie*
- *Bibliographie académique complète*

---

## 🧭 Matrice Déterministe de Sélection d'un Graphique

Utilisez cette matrice pour déterminer sans ambiguïté le graphique adapté à votre cas d'usage :

```
Objectif Analytique ────────► Structure des Données ─────────────► Graphique Recommandé
──────────────────────────────────────────────────────────────────────────────────────────
0. KPI CARDS & SYNTHÈSES DÉCISIONNELLES (Sciences Cognitives & Dashboard Ergonomics)
   ├── Métrique unique dominante + Delta temporel + Valence ────► KPI Card Standard
   ├── Tendance continue haute densité (Data-Ink Tufte) ────────► KPI Card Sparkline
   ├── Performance vs Cible + Seuils qualitatifs (Stephen Few) ─► KPI Card Micro-Bullet
   ├── Triangulation Réalisé vs N-1 vs Budget (Anti-ancrage) ───► KPI Card Comparative
   ├── Agrégat macro + Décomposition Part-to-Whole (Mayer) ─────► KPI Card Décomposition
   ├── Supervision d'infrastructure + Alerte RAG multi-états ───► KPI Card Statut & Seuil
   └── Équation d'affaires + Leviers causaux directs (DuPont) ──► KPI Card Composite

1. COMPARAISON
   ├── Catégories nominales (≤ 7, labels courts) ───────────────► Bar Chart Vertical
   ├── Catégories nominales (> 7 OU labels longs) ──────────────► Bar Chart Horizontal
   ├── Deux sous-groupes par catégorie (≤ 4 groupes) ──────────► Grouped Bar Chart
   ├── Cumul + décomposition (segment bas prioritaire) ────────► Stacked Bar Chart
   ├── Réalisé vs Cible / KPI vs Objectif (Stephen Few 2005) ──► Bullet Chart
   ├── Réalisé vs Cible avec deltas de variance automatisés ───► Bar + Target Overlay (Combo)
   ├── Classement élégant à forte densité (10-25 éléments) ────► Lollipop Chart
   ├── Évolution entre exactement 2 dates fixes ────────────────► Slope Chart
   ├── Écart / Delta binaire par entité (ex: Avant/Après) ──────► Dumbbell Chart
   └── Profil multidimensionnel synthétique (≤ 2 entités) ──────► Radar Chart

2. COMPOSITION (Part-to-Whole / 100%)
   ├── 2 à 3 tranches à fort contraste ─────────────────────────► Pie Chart
   ├── 2 à 4 tranches avec KPI central en grand format ────────► Doughnut Chart
   ├── Nombreux segments hiérarchiques (10 à 50+ éléments) ────► Treemap
   ├── Arborescence multi-niveaux concentrique ─────────────────► Sunburst Chart
   ├── Pourcentages discrets / Ratios intuitifs (1 cellule = 1%)► Waffle Chart
   ├── Comparaison de composition entre plusieurs groupes ──────► 100% Stacked Bar
   ├── Priorisation des causes vitales (Loi 80/20 & Gini) ──────► Diagramme de Pareto (Combo)
   └── Décomposition empilée + Courbe du total macro ──────────► Barres Empilées + Ligne de Total (Combo)

3. DISTRIBUTION STATISTIQUE
   ├── Variable continue unique ($N \ge 100$) ──────────────────► Histogramme
   ├── Forme de distribution continue lissée (2-4 groupes) ─────► Density Plot (KDE)
   ├── Effectif empirique + Courbe de densité théorique ────────► Histogramme + Densité KDE (Combo)
   ├── Comparaison robuste de dispersion & médiane (5-20 groupes)► Box Plot
   ├── Synthèse Tukey + Observations individuelles réelles ─────► Box Plot + Strip/Jitter (Combo)
   ├── Densité continue + Micro-box + Semis de points bruts ────► Raincloud Plot (Combo)
   ├── Distribution multimodale / bimodalité suspectée ────────► Violin Plot (+ KDE normalisé)
   ├── Données brutes individuelles ($N \le 100$) avec jitter ──► Strip Plot
   └── Données brutes empilées sans collision ($N = 30-300$) ───► Beeswarm Plot

4. CORRÉLATION & RELATION MULTIVARIÉE
   ├── 2 variables continues cartésiennes ($X, Y$) ──────────────► Scatter Plot
   ├── Nuage bivarié + Régression OLS + Bande IC 95% ───────────► Scatter Plot + Régression Linéaire (Combo)
   ├── Nuage 2D central + Densités marginales KDE + Ellipse 95% ─► Jointplot (Scatter + Marginals Combo)
   ├── 3 variables continues ($X, Y$ + $Z$ en surface $\sqrt{Z}$)► Bubble Chart
   ├── Matrice croisée / Corrélations bivariées multiples ──────► Matrix Heatmap
   ├── Trajectoire dynamique temporelle ordonnée ───────────────► Connected Scatter Plot
   └── Très grand volume bivarié ($N > 2 000$, anti-overplotting)► Density 2D / Hexbin

5. ÉVOLUTION TEMPORELLE (Séries chronologiques)
   ├── Série continue unique dans le temps ────────────────────► Line Chart
   ├── 2 à 4 séries temporelles (Focus + Context) ──────────────► Multi-Line Chart
   ├── Volume cumulé / masse sous la courbe ($Y \ge 0$) ────────► Area Chart
   ├── Somme de composantes additives continues ────────────────► Stacked Area Chart
   ├── Flux qualitatif thématique fluide ───────────────────────► Streamgraph
   ├── Cotation financière (Open, High, Low, Close) ────────────► Candlestick / OHLC
   ├── Cours boursier OHLC + Volume de transactions (2 zones) ──► Candlestick + Volume (Combo)
   ├── 2 séries hétérogènes avec zéros alignés et Pearson $r$ ──► Double Axe Y Contrôlé (Combo)
   ├── Cours + Tendance SMA + Canal de volatilité (±2σ) ────────► Prix + Overlays Bollinger (Combo)
   └── Tendance historique ultra-compacte dans un tableau/KPI ──► Sparkline

6. FLUX, PROCESSUS & PIPELINES
   ├── Transfert et conservation de flux directionnels ─────────► Sankey Diagram
   ├── Échanges bilatéraux circulaires réciproques ─────────────► Chord Diagram
   ├── Processus séquentiel à déperdition (Entonnoir) ──────────► Funnel Chart
   ├── Bilan séquentiel des gains (+) et pertes (-) ────────────► Waterfall Chart
   ├── Pont de variance + Courbe de trajectoire de solde net ───► Waterfall + Ligne Cumulée (Combo)
   ├── Planning de projet + Avancement interne + Repère du jour ─► Gantt + Progress (Combo)
   └── Reconfiguration de cohortes à travers des étapes ────────► Alluvial Diagram

7. HIÉRARCHIE & RÉSEAUX
   ├── Réseau topologique relationnel (15-80 nœuds) ────────────► Node-Link Network
   ├── Réseau séquentiel 1D ordonné ────────────────────────────► Arc Diagram
   ├── Taxonomie arborescente / Classification hiérarchique ────► Dendrogramme
   └── Tableau de contingence 2D ($100\% \times 100\%$) ────────► Marimekko Chart

8. GÉOSPATIAL & CARTES
   ├── Taux / Ratios normalisés par zone administrative ────────► Carte Choroplèthe
   ├── Totaux absolus localisés (Cercles proportionnels $\sqrt{N}$)► Bubble Map
   └── Égalité visuelle stricte entre entités territoriales ────► Cartogramme / Tilegram

9. TABLEAUX DE DATAVISUALISATION (Sciences Cognitives & Stephen Few)
   ├── Synthèse multi-indicateurs exécutifs + Cibles + 12M ──────► Tableau KPI Scorecard
   ├── Matrice de concentration 2D + Gradient continu WCAG AAA ─► Tableau Heatmap / Highlight Table
   ├── Comparaison instantanée de grandeurs (Cleveland Rang 1) ─► Tableau Bar-in-Cell / Bullet Graph
   ├── Taxonomie arborescente multiniveaux avec drill-down ─────► Tableau Hiérarchique (Tree Table)
   ├── États financiers & P&L avec écarts budgétaires IBCS ─────► Tableau Financier & Variance
   └── Classement ordonné + Podium + Mobilité de position ──────► Tableau de Classement (Leaderboard)
```

---

## 📁 Catalogue des Fiches Détaillées par Catégorie

### 00. KPI Cards & Synthèses Décisionnelles (`00-kpi-card/`)
- [`kpi-standard.md`](file:///Users/louislaville/Desktop/kit-charts/template/00-kpi-card/kpi-standard/kpi-standard.md) : KPI Card Standard / Synthèse exécutive C-Level.
- [`kpi-sparkline.md`](file:///Users/louislaville/Desktop/kit-charts/template/00-kpi-card/kpi-sparkline/kpi-sparkline.md) : KPI Card avec Micro-Tendance Sparkline continue de Tufte.
- [`kpi-bullet.md`](file:///Users/louislaville/Desktop/kit-charts/template/00-kpi-card/kpi-bullet/kpi-bullet.md) : KPI Card Micro-Bullet linéaire vs Objectif & Plages de tolérance (Stephen Few).
- [`kpi-comparative.md`](file:///Users/louislaville/Desktop/kit-charts/template/00-kpi-card/kpi-comparative/kpi-comparative.md) : KPI Card Comparative multi-période (Réalisé N vs N-1 vs Budget).
- [`kpi-distribution.md`](file:///Users/louislaville/Desktop/kit-charts/template/00-kpi-card/kpi-distribution/kpi-distribution.md) : KPI Card Décomposition 100% avec légendes directes contiguës (Mayer).
- [`kpi-status-alert.md`](file:///Users/louislaville/Desktop/kit-charts/template/00-kpi-card/kpi-status-alert/kpi-status-alert.md) : KPI Card Statut & Seuil d'Alerte RAG multi-états.
- [`kpi-composite.md`](file:///Users/louislaville/Desktop/kit-charts/template/00-kpi-card/kpi-composite/kpi-composite.md) : KPI Card Composite avec 3 drivers causaux liés.
- [`guide/00-kpi-card/kpi-cards.md`](file:///Users/louislaville/Desktop/kit-charts/guide/00-kpi-card/kpi-cards.md) : Guide scientifique & ergonomique complet des KPI Cards.

### 01. Comparaison & Classement (`01-comparaison/`)
- [`bar-chart-vertical.md`](file:///Users/louislaville/Desktop/kit-charts/guide/01-comparaison/bar-chart-vertical.md) : Diagramme en barres verticales standard.
- [`bar-chart-horizontal.md`](file:///Users/louislaville/Desktop/kit-charts/guide/01-comparaison/bar-chart-horizontal.md) : Barres horizontales pour libellés longs et rankings.
- [`grouped-bar-chart.md`](file:///Users/louislaville/Desktop/kit-charts/guide/01-comparaison/grouped-bar-chart.md) : Barres groupées multi-séries.
- [`stacked-bar-chart.md`](file:///Users/louislaville/Desktop/kit-charts/guide/01-comparaison/stacked-bar-chart.md) : Barres empilées de décomposition.
- [`bullet-chart.md`](file:///Users/louislaville/Desktop/kit-charts/guide/01-comparaison/bullet-chart.md) : Graphique à puces fondateur de Stephen Few (2005) (KPI vs Cible vs Plages).
- [`bar-target-overlay.md`](file:///Users/louislaville/Desktop/kit-charts/guide/01-comparaison/bar-target-overlay.md) : Barres horizontales + marqueur de cible et deltas de variance (Combo).
- [`lollipop-chart.md`](file:///Users/louislaville/Desktop/kit-charts/guide/01-comparaison/lollipop-chart.md) : Graphique sucette à haut ratio Data-Ink.
- [`slope-chart.md`](file:///Users/louislaville/Desktop/kit-charts/guide/01-comparaison/slope-chart.md) : Graphique de pente entre 2 points temporels fixes.
- [`dumbbell-chart.md`](file:///Users/louislaville/Desktop/kit-charts/guide/01-comparaison/dumbbell-chart.md) : Graphique en haltères pour deltas binaires.
- [`radar-chart.md`](file:///Users/louislaville/Desktop/kit-charts/guide/01-comparaison/radar-chart.md) : Graphique radar / spider pour profils multivariés.

### 02. Composition & Part dans le Tout (`02-composition-part-to-whole/`)
- [`pie-chart.md`](file:///Users/louislaville/Desktop/kit-charts/guide/02-composition-part-to-whole/pie-chart.md) : Diagramme circulaire / Camembert (2-3 parts max).
- [`doughnut-chart.md`](file:///Users/louislaville/Desktop/kit-charts/guide/02-composition-part-to-whole/doughnut-chart.md) : Anneau avec KPI central proéminent.
- [`treemap.md`](file:///Users/louislaville/Desktop/kit-charts/guide/02-composition-part-to-whole/treemap.md) : Carte proportionnelle squarifiée pour grands volumes.
- [`sunburst.md`](file:///Users/louislaville/Desktop/kit-charts/guide/02-composition-part-to-whole/sunburst.md) : Rayonnement solaire concentrique multi-niveaux.
- [`waffle-chart.md`](file:///Users/louislaville/Desktop/kit-charts/guide/02-composition-part-to-whole/waffle-chart.md) : Grille Isotype 100 carrés.
- [`stacked-bar-100.md`](file:///Users/louislaville/Desktop/kit-charts/guide/02-composition-part-to-whole/stacked-bar-100.md) : Barres empilées normalisées à 100%.
- [`pareto-chart.md`](file:///Users/louislaville/Desktop/kit-charts/guide/02-composition-part-to-whole/pareto-chart.md) : Diagramme de Pareto (Loi 80/20, causes vitales & Gini) (Combo).
- [`stacked-total-line.md`](file:///Users/louislaville/Desktop/kit-charts/guide/02-composition-part-to-whole/stacked-total-line.md) : Barres empilées + courbe de total macro consolidé (Combo).

### 03. Distribution Statistique (`03-distribution/`)
- [`histogram.md`](file:///Users/louislaville/Desktop/kit-charts/guide/03-distribution/histogram.md) : Histogramme avec binning optimal (Freedman-Diaconis).
- [`density-plot.md`](file:///Users/louislaville/Desktop/kit-charts/guide/03-distribution/density-plot.md) : Courbe de densité continue par noyau (KDE).
- [`histogramme-kde.md`](file:///Users/louislaville/Desktop/kit-charts/guide/03-distribution/histogramme-kde.md) : Histogramme binné + densité continue KDE de Silverman (Combo).
- [`box-plot.md`](file:///Users/louislaville/Desktop/kit-charts/guide/03-distribution/box-plot.md) : Boîte à moustaches de Tukey pour dispersion et quartiles.
- [`box-strip-plot.md`](file:///Users/louislaville/Desktop/kit-charts/guide/03-distribution/box-strip-plot.md) : Box plot de Tukey + Strip/Jitter plot déterministe (Combo).
- [`raincloud-plot.md`](file:///Users/louislaville/Desktop/kit-charts/guide/03-distribution/raincloud-plot.md) : Raincloud plot tri-hybride (Half-KDE + Micro-Box + Rain) (Combo).
- [`violin-plot.md`](file:///Users/louislaville/Desktop/kit-charts/guide/03-distribution/violin-plot.md) : Violon combinant KDE bilatérale et boîte interne (Knific & Weissgerber 2018).
- [`strip-plot.md`](file:///Users/louislaville/Desktop/kit-charts/guide/03-distribution/strip-plot.md) : Bandes de points individuels avec jitter contrôlé.
- [`beeswarm-chart.md`](file:///Users/louislaville/Desktop/kit-charts/guide/03-distribution/beeswarm-chart.md) : Essaim de points empilés sans collision.

### 04. Corrélation & Relation Multivariée (`04-correlation-relation/`)
- [`scatter-plot.md`](file:///Users/louislaville/Desktop/kit-charts/guide/04-correlation-relation/scatter-plot.md) : Nuage de points bivarié standard.
- [`scatter-regression.md`](file:///Users/louislaville/Desktop/kit-charts/guide/04-correlation-relation/scatter-regression.md) : Scatter plot + régression OLS + intervalle de confiance 95% (Combo).
- [`joint-scatter-marginals.md`](file:///Users/louislaville/Desktop/kit-charts/guide/04-correlation-relation/joint-scatter-marginals.md) : Jointplot 2D central + distributions marginales KDE + ellipse 95% (Combo).
- [`bubble-chart.md`](file:///Users/louislaville/Desktop/kit-charts/guide/04-correlation-relation/bubble-chart.md) : Bulles 3D en 2D avec aire proportionnelle $\sqrt{Z}$.
- [`matrix-heatmap.md`](file:///Users/louislaville/Desktop/kit-charts/guide/04-correlation-relation/matrix-heatmap.md) : Matrice de corrélation et tableaux croisés.
- [`connected-scatter-plot.md`](file:///Users/louislaville/Desktop/kit-charts/guide/04-correlation-relation/connected-scatter-plot.md) : Nuage de points relié chronologiquement.
- [`density-2d-hexbin.md`](file:///Users/louislaville/Desktop/kit-charts/guide/04-correlation-relation/density-2d-hexbin.md) : Hexagonal binning 2D anti-saturation.

### 05. Évolution Temporelle (`05-evolution-temporelle/`)
- [`line-chart.md`](file:///Users/louislaville/Desktop/kit-charts/guide/05-evolution-temporelle/line-chart.md) : Courbe continue simple et ratios d'aspect.
- [`multi-line-chart.md`](file:///Users/louislaville/Desktop/kit-charts/guide/05-evolution-temporelle/multi-line-chart.md) : Courbes multiples (Focus + Context) et Small Multiples.
- [`area-chart.md`](file:///Users/louislaville/Desktop/kit-charts/guide/05-evolution-temporelle/area-chart.md) : Graphique en aires simples avec dégradé vertical.
- [`stacked-area-chart.md`](file:///Users/louislaville/Desktop/kit-charts/guide/05-evolution-temporelle/stacked-area-chart.md) : Aires empilées pour volumes cumulatifs.
- [`streamgraph.md`](file:///Users/louislaville/Desktop/kit-charts/guide/05-evolution-temporelle/streamgraph.md) : Flux thématique organique centré.
- [`candlestick-ohlc.md`](file:///Users/louislaville/Desktop/kit-charts/guide/05-evolution-temporelle/candlestick-ohlc.md) : Chandeliers financiers Open/High/Low/Close.
- [`candlestick-volume.md`](file:///Users/louislaville/Desktop/kit-charts/guide/05-evolution-temporelle/candlestick-volume.md) : Cours boursier OHLC + volume de transactions en 2 panneaux étagés (Combo).
- [`dual-axis-controlled.md`](file:///Users/louislaville/Desktop/kit-charts/guide/05-evolution-temporelle/dual-axis-controlled.md) : Double axe Y avec zéros alignés et appariement chromatique strict (Combo).
- [`price-indicator-overlays.md`](file:///Users/louislaville/Desktop/kit-charts/guide/05-evolution-temporelle/price-indicator-overlays.md) : Série de prix + SMA + canal de Bollinger (±2σ, 3 couches max) (Combo).
- [`sparkline.md`](file:///Users/louislaville/Desktop/kit-charts/guide/05-evolution-temporelle/sparkline.md) : Micro-courbes intégrées dans tableaux et KPIs.

### 06. Flux & Processus (`06-flux-processus/`)
- [`sankey-diagram.md`](file:///Users/louislaville/Desktop/kit-charts/guide/06-flux-processus/sankey-diagram.md) : Flux directionnels avec conservation de masse.
- [`chord-diagram.md`](file:///Users/louislaville/Desktop/kit-charts/guide/06-flux-processus/chord-diagram.md) : Échanges bilatéraux circulaires matriciels.
- [`funnel-chart.md`](file:///Users/louislaville/Desktop/kit-charts/guide/06-flux-processus/funnel-chart.md) : Entonnoir d'étapes de conversion et taux de chute.
- [`waterfall-chart.md`](file:///Users/louislaville/Desktop/kit-charts/guide/06-flux-processus/waterfall-chart.md) : Cascade / pont d'étapes financières (+) et (-).
- [`waterfall-cumulative-line.md`](file:///Users/louislaville/Desktop/kit-charts/guide/06-flux-processus/waterfall-cumulative-line.md) : Waterfall séquentiel + ligne de trajectoire de solde cumulé (Combo).
- [`gantt-progress.md`](file:///Users/louislaville/Desktop/kit-charts/guide/06-flux-processus/gantt-progress.md) : Planning Gantt + avancement interne + repère vertical 'Aujourd\'hui' (Combo).
- [`alluvial-diagram.md`](file:///Users/louislaville/Desktop/kit-charts/guide/06-flux-processus/alluvial-diagram.md) : Évolution et redistribution de cohortes d'état en état.

### 07. Hiérarchie & Réseaux (`07-hierarchie-reseau/`)
- [`node-link-network.md`](file:///Users/louislaville/Desktop/kit-charts/guide/07-hierarchie-reseau/node-link-network.md) : Graphe nœuds-liens à équilibre de forces.
- [`arc-diagram.md`](file:///Users/louislaville/Desktop/kit-charts/guide/07-hierarchie-reseau/arc-diagram.md) : Diagramme en arcs sur axe linéaire ordonné.
- [`dendrogram.md`](file:///Users/louislaville/Desktop/kit-charts/guide/07-hierarchie-reseau/dendrogram.md) : Arbre de classification et distances de clustering.
- [`marimekko-chart.md`](file:///Users/louislaville/Desktop/kit-charts/guide/07-hierarchie-reseau/marimekko-chart.md) : Mosaïque Mekko bidimensionnelle ($100\% \times 100\%$).

### 08. Géospatial & Cartes (`08-geospatial-cartes/`)
- [`choropleth-map.md`](file:///Users/louislaville/Desktop/kit-charts/guide/08-geospatial-cartes/choropleth-map.md) : Carte thématique de ratios par polygones administratifs.
- [`bubble-map.md`](file:///Users/louislaville/Desktop/kit-charts/guide/08-geospatial-cartes/bubble-map.md) : Cercles proportionnels géolocalisés.
- [`cartogram-tilegram.md`](file:///Users/louislaville/Desktop/kit-charts/guide/08-geospatial-cartes/cartogram-tilegram.md) : Cartogramme schématique et grilles de tuiles équi-surfaciques.

### 09. Tableaux de Datavisualisation (`09-tableaux-dataviz/`)
- [`table-kpi-scorecard.md`](file:///Users/louislaville/Desktop/kit-charts/guide/09-tableaux-dataviz/table-kpi-scorecard.md) : Tableau Exécutif KPI Scorecard (Indicateurs clés, cibles, deltas, sparklines 12M).
- [`table-heatmap-matrix.md`](file:///Users/louislaville/Desktop/kit-charts/guide/09-tableaux-dataviz/table-heatmap-matrix.md) : Tableau Heatmap / Matrice 2D (Gradient continu, inversion de contraste WCAG AAA).
- [`table-bar-in-cell.md`](file:///Users/louislaville/Desktop/kit-charts/guide/09-tableaux-dataviz/table-bar-in-cell.md) : Tableau Comparatif Bar-in-Cell & Mini Bullet Graph (Longueur 1D sur échelle commune).
- [`table-hierarchical-tree.md`](file:///Users/louislaville/Desktop/kit-charts/guide/09-tableaux-dataviz/table-hierarchical-tree.md) : Tableau Hiérarchique & Arborescent (Tree Table, repliage interactif, sous-totaux).
- [`table-financial-variance.md`](file:///Users/louislaville/Desktop/kit-charts/guide/09-tableaux-dataviz/table-financial-variance.md) : Tableau Financier & Variance IBCS (Compte de résultat P&L, barres divergentes axe 0).
- [`table-ranking-leaderboard.md`](file:///Users/louislaville/Desktop/kit-charts/guide/09-tableaux-dataviz/table-ranking-leaderboard.md) : Tableau de Classement & Performance (Podium doux, delta de position, sparkbar 6M).

---

## 🎨 Thèmes Cognitifs & Typographies Spécialisées (`themes/`)

Découvrez nos **8 thèmes graphiques et typographiques** optimisés pour la perception visuelle, l'accessibilité CVD (daltonisme) et la réduction de la charge cognitive :
👉 [**`themes/README.md`**](file:///Users/louislaville/Desktop/kit-charts/themes/README.md) (Guide d'intégration globale et tokens CSS)

1. [**`01-colorbrewer-accessible/`**](file:///Users/louislaville/Desktop/kit-charts/themes/01-colorbrewer-accessible) : Palette généraliste équilibrée de Cynthia Brewer (Penn State).
2. [**`02-viridis-perceptual/`**](file:///Users/louislaville/Desktop/kit-charts/themes/02-viridis-perceptual) : Échelle de luminance strictement monotone de Van der Walt & Smith (SciPy / PLOS ONE).
3. [**`03-paul-tol-scientific/`**](file:///Users/louislaville/Desktop/kit-charts/themes/03-paul-tol-scientific) : Palettes scientifiques haute discrimination du Dr. Paul Tol (SRON).
4. [**`04-tableau-stone-categorical/`**](file:///Users/louislaville/Desktop/kit-charts/themes/04-tableau-stone-categorical) : Système business et mémorabilité des couleurs de Maureen Stone & Jeffrey Heer (IEEE InfoVis).
5. [**`05-okabe-ito-cud/`**](file:///Users/louislaville/Desktop/kit-charts/themes/05-okabe-ito-cud) : Standard mondial *Color Universal Design* (CUD) pour publications officielles.
6. [**`06-tufte-minimalist-executive/`**](file:///Users/louislaville/Desktop/kit-charts/themes/06-tufte-minimalist-executive) : Épurement radical et ratio Data-Ink d'Edward Tufte & Stephen Few.
7. [**`07-nord-cognitive-dark/`**](file:///Users/louislaville/Desktop/kit-charts/themes/07-nord-cognitive-dark) : Mode sombre anti-éblouissement et réduction de la fatigue oculaire pour monitoring 24/7.
8. [**`08-atkinson-hyperlegible/`**](file:///Users/louislaville/Desktop/kit-charts/themes/08-atkinson-hyperlegible) : Système haute différenciation des glyphes pour basse vision (Braille Institute).

---

## 🛠️ Stack & Écosystème Chart.js Requis

| Catégorie de Graphique | Type Chart.js natif ou Plugin requis |
| :--- | :--- |
| **Standards (Bar, Line, Pie, Doughnut, Radar, Bubble, Scatter, PolarArea)** | `chart.js` (natif) |
| **Étiquetage direct & Valeurs** | `chartjs-plugin-datalabels` |
| **Annotations, Lignes de seuils & Cibles** | `chartjs-plugin-annotation` |
| **Sankey & Alluvial** | `chartjs-chart-sankey` |
| **Treemap** | `chartjs-chart-treemap` |
| **Heatmap matricielle, Waffle & Marimekko** | `chartjs-chart-matrix` |
| **Box Plot & Violin Plot** | `@sgratzl/chartjs-chart-boxplot` |
| **Cartographie Choroplèthe & Bubble Map** | `chartjs-chart-geo` |
| **Graphes Nœuds-Liens & Réseaux** | `chartjs-chart-graph` |
| **Financial (Candlestick & OHLC)** | `chartjs-chart-financial` + `chartjs-adapter-date-fns` |
| **Funnel** | `chartjs-chart-funnel` |
| **Zoom & Pan interactif** | `chartjs-plugin-zoom` |

---

## 📜 Licence
Bibliothèque Open-Source sous licence MIT. Libre d'utilisation pour tout projet, template ou génération automatisée par agents IA.
