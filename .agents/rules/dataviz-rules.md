# 🛡️ Règles Dataviz & Garde-Fous Cognitifs Exhaustifs (10 Familles)

> **Portée** : Ces règles s'appliquent à tous les agents IA intervenant sur le dépôt `kit-charts` ou générant des visualisations de données. Toute violation est auditée et bloquée automatiquement par le linter `validate-chart.js` et le hook `dataviz-quality-gate`.

---

## 🏛️ 1. Règles Transversales Universelles (Toutes Visualisations)

1. **Hiérarchie Perceptive de Cleveland & McGill (1984)** :
   - Privilégier les encodages les plus précis : Position sur échelle commune > Longueur physique > Pente/Angle > Aire $\gg$ Teinte/Luminance.
2. **Accessibilité Numérique WCAG 2.2 (Niveau AAA)** :
   - Contraste minimal texte / fond $\ge 4.5:1$ (AA) et $\ge 7:1$ (AAA).
   - Contraste des contours de données $\ge 3:1$.
   - Typographie des valeurs numériques en **police monospace tabulaire** (`fontMono`) pour l'alignement des chiffres.
3. **Sémantique de Valence Métier Déterministe** :
   - `HIGHER_IS_BETTER` (CA, Rétention) : Hausse = Vert (`tokens.semantic.positive`), Baisse = Rouge (`tokens.semantic.negative`).
   - `LOWER_IS_BETTER` (Churn, Latence, Coûts) : Hausse = Rouge (`tokens.semantic.negative`), Baisse = Vert (`tokens.semantic.positive`).
   - `TARGET_BASED` (SLA, Consommation) : Conforme = Vert, Tolérance = Orange, Dépassement = Rouge.
   - `NEUTRAL_CATEGORICAL` (Régions, Départements) : Palette catégorielle neutre sans jugement de valeur.
4. **Cinématique & Mouvement** :
   - Durée maximale $\le 800\text{ ms}$ (nominale : 400 à 600 ms).
   - Aucun rebond cartoon (`bounce`, `elastic`). Utiliser `easeOutQuart` ou `easeOutQuad`.
   - Support strict de `@media (prefers-reduced-motion: reduce)` ($\Delta T = 0\text{ ms}$).
5. **Infobulles Anti-Occlusion (Mayer)** :
   - L'infobulle ne doit jamais recouvrir le point inspecté ni masquer la tendance locale contiguë.

---

## 📊 2. Règles Spécifiques par Famille Analytique (95 Templates)

### 🔹 Famille 01 — Comparaison Discrète
- **Ligne de base $Y=0$ absolue (`beginAtZero: true`)** : Obligatoire sur tous les graphiques de longueur (`bar-chart-vertical`, `bar-chart-horizontal`, `grouped-bar-chart`, `stacked-bar-chart`, `lollipop-chart`, `bullet-chart`, `kpi-bullet`). Il est formellement interdit de tronquer l'axe pour exagérer artificiellement des variations.
- **Interdiction des échelles logarithmiques** sur les diagrammes en barres ou encodages de longueur.
- **Cardinalité Verticale ($N \le 7$)** : `bar-chart-vertical` est strictement limité à 7 catégories. Si $N > 7$ ou si les libellés dépassent 12 caractères, basculer obligatoirement sur `bar-chart-horizontal`.
- **Tri Déterministe sur Barres Horizontales** : Toujours ordonner les barres par valeur décroissante (sauf chronologie ou ordre ordinal naturel).
- **Bullet Graph & Target Overlays** : Le marqueur d'objectif doit être un symbole distinct (trait vertical ou point contrasté) nettement dissocié des bandes contextuelles.

### 🔹 Famille 02 — Composition & Part-to-Whole
- **Somme stricte $= 100\%$** : La somme des composantes doit égaler exactement 100% (ou le total du tout).
- **Graphiques circulaires (`doughnut-chart`, `pie-chart`)** :
  - Maximum **2 à 5 tranches**.
  - Toute tranche $< 3\%$ doit obligatoirement être consolidée dans une catégorie "Autres".
  - **Interdiction formelle des effets 3D ou des camemberts éclatés** (distorsion des angles et surfaces).
- **Barres Empilées 100% (`stacked-bar-100`)** : Ligne de base $0\%$ et sommet $100\%$ strictement alignés. Maximum 4 à 5 segments par barre.
- **Treemaps & Waffles** : Tri décroissant des surfaces de haut-gauche à bas-droite. Les étiquettes ne s'affichent que sur les cellules ayant une aire suffisante.

### 🔹 Famille 03 — Distribution & Dispersion
- **Boxplot (Boîte à Moustaches de Tukey)** :
  - Calcul strict des 5 indicateurs statistiques : Minimum, Q1 (25%), Médiane (50%), Q3 (75%), Maximum.
  - Moustaches délimitées à $1.5 \times \text{IQR}$ ($\text{IQR} = Q3 - Q1$). Tout point au-delà doit être représenté comme un outlier individuel isolé.
- **Histogramme** :
  - Largeur de classe (*bin width*) calculée mathématiquement par la formule de Freedman-Diaconis ou Sturges.
  - Pas d'espace entre les barres (`barPercentage: 1.0`, `categoryPercentage: 1.0`) pour matérialiser le continuum numérique.
- **Violin & Ridgeline Plots** : Échelles d'amplitude identiques entre séries comparées.

### 🔹 Famille 04 — Corrélation & Relations 2D
- **Nuage de Points (`scatter-plot`)** :
  - Ratio d'aspect visuel 1:1 pour ne pas biaiser la perception de la pente de corrélation (Cleveland 1993).
  - En cas de sur-densité ($N > 100$), appliquer l'opacité alpha ($\alpha \le 0.4$) ou le jittering pour contrer l'overplotting.
- **Graphique à Bulles (`bubble-chart`)** :
  - **La 3ème dimension $Z$ DOIT impérativement être encodée par l'AIRE du disque ($\pi r^2$) et JAMAIS par le rayon $r$** (l'œil humain perçoit les surfaces, encoder par le rayon quadruple faussement les proportions).
- **Matrices & Heatmaps** : Palette séquentielle monotone ou divergente avec point médian neutre explicite et échelle de légende continue.

### 🔹 Famille 05 — Évolution Temporelle
- **Axe Chronologique** : Le temps s'écoule strictement de gauche à droite sur l'axe horizontal $X$.
- **Plafond Multi-Lignes ($K \le 5$)** : Strictement $\le 5$ courbes simultanées pour éviter le *Spaghetti Chart*. Au-delà, basculer sur `faceted-line-chart` (Small Multiples).
- **Graphiques en Aires (`area-chart`, `streamgraph`)** : Ligne de base $Y=0$. Opacité modérée ($\alpha \approx 0.25$) en cas de séries superposées pour visualiser les croisements.

### 🔹 Famille 06 — Flux, Processus & Cascades
- **Entonnoir de Conversion (`funnel-chart`)** : Ordre strictement décroissant des étapes ; affichage systématique des taux de rétention d'étape à étape.
- **Graphique en Cascade (`waterfall-chart`)** : Distinction absolue entre les piliers de totaux (ancrés à 0) et les barres flottantes d'incréments/décréments (colorées selon la polarité métier gains/pertes).

### 🔹 Famille 07 — Hiérarchies & Réseaux
- **Graphes de Réseau & Sankey** : Limiter la densité d'arêtes pour éviter la saturation visuelle (*hairball*).
- **Sunburst & Dendrogrammes** : Profondeur maximale limitée à 3 niveaux hierarchiques.

### 🔹 Famille 08 — Cartographie & Géospatial
- **Cartes Choroplèthes** : **Normalisation obligatoire par habitant, densité ou ratio**. Interdiction formelle de représenter des totaux bruts sur des polygones de surface (le biais de surface géographique fausse l'analyse, ex: un grand département peu peuplé dominerait visuellement).
- **Cartes à Bulles** : Réservées aux totaux bruts, centrées sur les centroïdes géographiques avec disques proportionnels à l'aire.

### 🔹 Famille 09 — Finance & Bourse
- **Chandeliers Japonais & OHLC** : Vert si $Close \ge Open$ (hausse), Rouge si $Close < Open$ (baisse) ; mèches hautes ($Max$) et basses ($Min$) visibles.

### 🔹 Famille 10 — Tableaux & Synthèses KPI
- **Cartes KPI (`kpi-standard`, `kpi-sparkline`)** :
  - Valeur principale monumentale ($\ge 24\text{px}$) en typographie forte.
  - Badge de variation avec polarité métier et libellé de référence obligatoire (ex: `"vs M-1"` ou `"vs Budget"`).
- **Tableaux de Données & Sparklines** : Alignement à droite des nombres en police monospace tabulaire, alignement à gauche du texte.

---

## 🚫 3. Interdictions Absolues pour les Agents

1. ❌ **Ne JAMAIS générer de code Chart.js ad-hoc non standardisé.**
2. ❌ **Ne JAMAIS utiliser de codes couleur hexadécimaux arbitraires sans passer par `themes/theme-tokens.js`.**
3. ❌ **Ne JAMAIS tronquer l'axe $Y=0$ sur un graphique en barres ou colonnes.**
4. ❌ **Ne JAMAIS placer plus de 7 catégories sur un bar chart vertical ou plus de 5 courbes sur un multi-line.**
5. ❌ **Ne JAMAIS insérer d'animations avec rebonds cartoons (`bounce`, `elastic`) ou durée $> 800\text{ ms}$.**
