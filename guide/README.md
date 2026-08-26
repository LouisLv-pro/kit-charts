# Kit-Charts — Guide & Documentation Méthodologique

Bienvenue dans la documentation complète de **Kit-Charts**. Ce dossier regroupe l'ensemble des règles psychophysiques, théories sémiologiques, spécifications d'ergonomie et fiches méthodologiques par famille graphique.

---

## 📚 1. Fondations & Règles Universelles

| Document | Description |
| :--- | :--- |
| **[Règles Psychophysiques Universelles](./regles-universelles.md)** | Hiérarchie perceptuelle de Cleveland & McGill, ratio Data-Ink de Tufte, lois de la Gestalt, standards d'accessibilité CVD (Color Vision Deficiency) et WCAG 2.2 AAA. |
| **[Sémiologie, Accentuation & Cognition](./semiologie-accentuation-cognition.md)** | Règle du 90/10 (Hero vs Contexte), matrices de valence binaire et directionnalité des couleurs (Gain vs Risque/Coût), double encodage universel. |
| **[Interactions, Tooltips & Micro-Animations](./interaction-tooltips-animations.md)** | Ergonomie Fitts (hitRadius optimisé), positionnement dynamique anti-occlusion (Mayer), alignement tabulaire des chiffres et durées logarithmiques $\Delta T(N)$ respectant `prefers-reduced-motion`. |
| **[Spécifications & Architecture](./PROJECT.md)** | Spécifications fonctionnelles, catalogue des 46 types de graphiques, plugins Chart.js v4+ et architecture zéro-dépendance. |
| **[Spécification Template Rapport KAM](./SPEC_TEMPLATE_RAPPORT_KAM.md)** | Modèle d'intégration executive pour rapports stratégiques et comptes-clés. |
| **[Rapport d'Audit Adversarial](./ADVERSARIAL_AUDIT_REPORT.md)** | Rapport d'audit de robustesse mathématique, stress tests et conformité normative. |

---

## 📊 2. Fiches Méthodologiques par Famille Graphique

### 01. Comparaison & Classement
- [bar-chart-vertical.md](./01-comparaison/bar-chart-vertical.md) — Diagramme en barres verticales (Y=0 obligatoire, espacement Gestalt).
- [bar-chart-horizontal.md](./01-comparaison/bar-chart-horizontal.md) — Diagramme en barres horizontales (labels longs, tri décroissant).
- [grouped-bar-chart.md](./01-comparaison/grouped-bar-chart.md) — Barres groupées multivariées.
- [stacked-bar-chart.md](./01-comparaison/stacked-bar-chart.md) — Barres empilées cumulatives.
- [bullet-chart.md](./01-comparaison/bullet-chart.md) — Graphique à puces de Stephen Few (Cible vs Réel).
- [lollipop-chart.md](./01-comparaison/lollipop-chart.md) — Graphique sucette (Data-Ink élevé).
- [slope-chart.md](./01-comparaison/slope-chart.md) — Graphique de pente (transitions temporelles ou d'état).
- [dumbbell-chart.md](./01-comparaison/dumbbell-chart.md) — Graphique en haltères (mise en évidence du delta).
- [radar-chart.md](./01-comparaison/radar-chart.md) — Graphique radar multivarié.
- [polar-area-chart.md](./01-comparaison/polar-area-chart.md) — Diagramme polaire de Nightingale (séries cycliques).

### 02. Composition & Part-to-Whole
- [pie-chart.md](./02-composition-part-to-whole/pie-chart.md) — Diagramme circulaire (2-5 segments, départ à 12h).
- [doughnut-chart.md](./02-composition-part-to-whole/doughnut-chart.md) — Diagramme en anneau avec métrique KPI centrale.
- [stacked-bar-100.md](./02-composition-part-to-whole/stacked-bar-100.md) — Barres empilées 100% normalisées.
- [sunburst.md](./02-composition-part-to-whole/sunburst.md) — Diagramme rayonnant hiérarchique.
- [treemap.md](./02-composition-part-to-whole/treemap.md) — Carte proportionnelle (subdivision rectangulaire).
- [waffle-chart.md](./02-composition-part-to-whole/waffle-chart.md) — Graphique gaufre 10×10 (dénombrement unitaire).

### 03. Distribution & Dispersion
- [histogramme.md](./03-distribution/histogramme.md) — Histogramme de fréquence (règle de Freedman-Diaconis).
- [density-plot.md](./03-distribution/density-plot.md) — Graphique de densité (KDE gaussien).
- [box-plot.md](./03-distribution/box-plot.md) — Boîte à moustaches de John Tukey (médiane, IQR, outliers).
- [strip-plot.md](./03-distribution/strip-plot.md) — Bande de points avec jittering contrôlé.
- [beeswarm-plot.md](./03-distribution/beeswarm-plot.md) — Essaim de points sans chevauchement.
- [distribution-heatmap.md](./03-distribution/distribution-heatmap.md) — Matrice de densité 2D.

### 04. Corrélation & Relation
- [scatter-plot.md](./04-correlation-relation/scatter-plot.md) — Nuage de points bivarié.
- [bubble-chart.md](./04-correlation-relation/bubble-chart.md) — Diagramme à bulles ($r \propto \sqrt{Z}$).
- [matrix-heatmap.md](./04-correlation-relation/matrix-heatmap.md) — Matrice de corrélation de Pearson [-1, +1].
- [connected-scatter-plot.md](./04-correlation-relation/connected-scatter-plot.md) — Nuage de points relié (trajectoires dynamiques).
- [density-2d-hexbin.md](./04-correlation-relation/density-2d-hexbin.md) — Densité 2D et agrégation hexagonale.

### 05. Évolution Temporelle
- [line-chart.md](./05-evolution-temporelle/line-chart.md) — Série temporelle continue simple.
- [multi-line-chart.md](./05-evolution-temporelle/multi-line-chart.md) — Séries multi-lignes avec étiquetage direct.
- [area-chart.md](./05-evolution-temporelle/area-chart.md) — Graphique en aires (volume sous courbe).
- [stacked-area-chart.md](./05-evolution-temporelle/stacked-area-chart.md) — Aires empilées (décomposition temporelle).
- [streamgraph.md](./05-evolution-temporelle/streamgraph.md) — Flux thématique fluide centré.
- [candlestick-ohlc.md](./05-evolution-temporelle/candlestick-ohlc.md) — Chandelier japonais financier OHLC.
- [sparkline.md](./05-evolution-temporelle/sparkline.md) — Micro-ligne de tendance d'Edward Tufte.

### 06. Flux & Processus
- [sankey-diagram.md](./06-flux-processus/sankey-diagram.md) — Diagramme de Sankey (conservation de flux).
- [chord-diagram.md](./06-flux-processus/chord-diagram.md) — Diagramme de corde circulaire (échanges bilatéraux).
- [funnel-chart.md](./06-flux-processus/funnel-chart.md) — Entonnoir de conversion séquentiel.
- [waterfall-chart.md](./06-flux-processus/waterfall-chart.md) — Cascade financière pas-à-pas.
- [alluvial-diagram.md](./06-flux-processus/alluvial-diagram.md) — Suivi de cohortes et redistributions.

### 07. Hiérarchie & Réseau
- [node-link-network.md](./07-hierarchie-reseau/node-link-network.md) — Graphe relationnel nœuds-liens.
- [arc-diagram.md](./07-hierarchie-reseau/arc-diagram.md) — Diagramme en arcs pour séquences linéaires.
- [dendrogram.md](./07-hierarchie-reseau/dendrogram.md) — Arbre taxonomique hiérarchique.
- [marimekko-chart.md](./07-hierarchie-reseau/marimekko-chart.md) — Graphique mosaïque Marimekko 100%×100%.

### 08. Géospatial & Cartes
- [choropleth-map.md](./08-geospatial-cartes/choropleth-map.md) — Carte choroplèthe pour taux et ratios normalisés.
- [bubble-map.md](./08-geospatial-cartes/bubble-map.md) — Carte à bulles proportionnelles pour valeurs absolues.
- [cartogram-tilegram.md](./08-geospatial-cartes/cartogram-tilegram.md) — Cartogramme à tuiles égales.

### 09. Ergonomie & Micro-Animations
- [tooltip/guide.md](./tooltip/guide.md) — Ergonomie des infobulles, loi de Fitts et anti-occlusion.
- [animation/guide.md](./animation/guide.md) — Micro-animations cognitives, constance d'objet et scaling $\Delta T(N)$.
