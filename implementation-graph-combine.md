# implémentation-graph-combinée.md — Spécification d'orchestration pour les Graphiques Combinés

> **Destinataire** : agent IA chargé de l'implémentation.
> **Contexte** : le catalogue `kit-charts` couvre 46 templates « atomiques » mais aucun hybride/combiné.
> Ce document formalise **les recommandations scientifiques**, **les maths déterministes** et
> **le plan d'orchestration** pour combler ce vide. Il doit être exécuté en respectant les
> conventions existantes du repo (triade `template.js` / `<nom>.md` / `preview.html`,
> registre `themes/theme-tokens.js`, bundle `catalog-bundle.js`, suite `test/`).

---

## 0. Règle d'or transversale

Un graphique combiné est légitime quand il **partage un axe commun et raconte UNE histoire à deux niveaux**.
Il devient toxique quand il juxtapose **deux histoires sur deux échelles arbitraires**.

Fondements (à citer dans chaque `.md` produit) :
- **Cleveland & McGill 1984** — *Graphical Perception*, JASA : hiérarchie des tâches perceptives élémentaires ; position sur échelle non-alignée ≈ la plus error-prone après angle/aire.
- **Sweller 1988** — Cognitive Load Theory : le combo réduit la charge extrinsèque (split-attention) si intégré, l'augmente si redondant.
- **Paivio 1971/1986** — Dual Coding Theory : double encodage redondant = meilleure mémorisation.
- **Mayer 2001** — *Multimedia Learning* : principes de cohérence et de signaling ; max ~3 couches (cf. Miller 1956, 7±2).
- **Tufte 1983** — *The Visual Display of Quantitative Information* : data-ink ratio, lie factor (risque du choix d'échelle).
- **Few 2005/2008** — Perceptual Edge : critique des doubles axes, bullet chart.
- **Franconeri, Padilla et al. 2021** — *The Science of Visual Data Communication*, Psychological Science in the Public Interest.
- **Heer, Bostock & Ogievetsky 2010** — *A Tour Through the Visualization Zoo*, ACM TVE.

---

## 1. Table de priorisation (ordre d'implémentation)

| # | Combo | Famille cible (`template/`) | Risque cognitif | Priorité |
|---|-------|------------------------------|-----------------|----------|
| 1 | Histogramme + densité KDE | `03-distribution` | Très faible | P0 |
| 2 | Box plot + strip/jitter | `03-distribution` | Très faible | P0 |
| 3 | Raincloud (half-violin + box + points) | `03-distribution` | Très faible | P0 |
| 4 | Candlestick + volume (panneaux empilés) | `05-evolution-temporelle` | Faible | P0 |
| 5 | Diagramme de Pareto (barres triées + courbe cumulée) | `02-composition-part-to-whole` | Faible | P1 |
| 6 | Scatter + droite de régression + IC 95% | `04-correlation-relation` | Faible | P1 |
| 7 | Barres + marqueur de cible (target overlay) | `01-comparaison` | Faible | P1 |
| 8 | Double axe Y normalisé (dual-axis contrôlé) | `05-evolution-temporelle` | Élevé → garde-fous obligatoires | P1 |
| 9 | Violin + box interne (variante « violin-box » enrichie) | `03-distribution` | Moyen | P2 |
| 10 | Scatter + distributions marginales (jointplot) | `04-correlation-relation` | Moyen | P2 |
| 11 | Aire/barres empilées + ligne de total | `02-composition-part-to-whole` | Moyen | P2 |
| 12 | Gantt + ligne « aujourd'hui » / avancement | `06-flux-processus` | Moyen | P2 |
| 13 | Waterfall + ligne cumulée | `06-flux-processus` | Faible | P3 |
| 14 | Prix + overlays indicateurs (SMA/Bollinger) | `05-evolution-temporelle` | Moyen (expert only) | P3 |

> Note : le **bullet chart** (déjà présent dans `guide/01-comparaison`) est déjà un combo
> (barre + zones qualitatives + marqueur). Mettre à jour son `.md` pour le référencer comme tel
> avec sa source fondatrice (Few 2005) — aucune refonte technique nécessaire.

---

## 2. Conventions d'implémentation (obligatoires)

Chaque combo = triade dans le dossier famille :

```
template/<famille>/<combo-name>/
├── template.js        # UMD, exposé sous window.KitCharts[...], Chart.js v4
├── <combo-name>.md    # doc au format des 46 templates existants (voir §2.1)
└── preview.html       # démo statique compatible file:// (zéro CORS, CDN UMD)
```

### 2.1 Structure imposée du fichier `.md`
Reprendre le format existant (ex. `template/03-distribution/violin-plot/violin-plot.md`) :
1. Fondements Scientifiques & Justification Cognitive (citations complètes)
2. Formulation Mathématique Déterministe (LaTeX, formules exactes du §3)
3. Double-Encodage & Garde-Fous Cognitifs
4. Quand utiliser / Quand ne pas utiliser
5. Intégration tokens (`getChartDefaultOptions`, helpers interaction, `prefers-reduced-motion`)
6. Données de démonstration déterministes (pas de random non seedé)

### 2.2 Intégration moteur central
- Utiliser `getChartDefaultOptions(themeTokens)` comme base.
- Combos temporels (4, 8, 11, 13, 14) → `getTemporalInteractionOptions`.
- Combos spatiaux (6, 10) → `getSpatialInteractionOptions`.
- Respecter `isReducedMotionPreferred()` via `getAccessibleAnimationOptions`.
- Couleurs : uniquement via tokens (`emphasis`, `status`, palettes CVD-safe). Aucune couleur codée en dur.

### 2.3 Validation finale (critères d'acceptation)
- [ ] `test/verify-catalog.mjs`, `verify-tokens.mjs`, `test-all-catalog.mjs` passent à 100%.
- [ ] `catalog-bundle.js` resynchronisé (parité Node/ESM/`file://`).
- [ ] Chaque `.md` cite ses sources avec année et venue (journal/conf).
- [ ] Aucun combo ne dépasse **3 couches visuelles** (Miller 1956 / Mayer 2001).
- [ ] Tout double axe est interdit sauf template #8, qui DOIT afficher : les deux axes, zéro aligné, couleur appariée série↔axe, et un rappel anti-corrélation fallacieuse dans son `.md`.

---

## 3. Spécifications détaillées par combo

### #1 — Histogramme + densité KDE  ·  P0 · `03-distribution/histogramme-kde/`

**Sources** : Rosenblatt 1956 ; Parzen 1962 ; Silverman 1986 (*Density Estimation*) ; Scott 1979/1992.

**Quand utiliser** : comparer l'empirique à un modèle théorique (normalité), détecter multimodalité.
**Quand ne pas utiliser** : n < 30 (KDE instable), données discrètes ou ordinales.

**Maths** :
- Largeur de classe : règle de Freedman-Diaconis `h_bin = 2·IQR·n^(−1/3)` (fallback Scott : `3,49·σ·n^(−1/3)`).
- KDE gaussien : `f̂(x) = (1/n·h)·Σ K((x−xᵢ)/h)`, `K(u) = (1/√(2π))e^(−u²/2)`.
- Bande passante de Silverman : `h = 0,9·min(σ, IQR/1,34)·n^(−1/5)`.
- Grille uniforme 128 points sur `[min−3h, max+3h]`.

**Garde-fou** : courbe KDE en trait plein `tokens.emphasis.foreground`, histogramme en remplissage contextuel α ≤ 0,35.

---

### #2 — Box plot + strip/jitter  ·  P0 · `03-distribution/box-strip-plot/`

**Sources** : Tukey 1977 (*Exploratory Data Analysis*) ; Cleveland & McGill 1984 ; Weissgerber et al. 2015 (*Beyond Bar and Line Plots*, Nature Methods).

**Quand utiliser** : résumé de distribution où montrer le n réel (10 ≤ n ≤ ~200).
**Quand ne pas utiliser** : n très grand (sur-tracé → préférer #1 ou hexbin).

**Maths** :
- Quartiles par interpolation linéaire type R-7 : position `p = 1 + (n−1)·q`, `q ∈ {0.25, 0.5, 0.75}`.
- Whiskers : `Q1 − 1,5·IQR` / `Q3 + 1,5·IQR`, bornés aux observations ; points hors bornes = outliers individuels.
- Jitter uniforme : offset horizontal `±U(−w/2, w/2)` avec `w ≤ 0,5 × largeur boîte` (seed déterministe obligatoire).

---

### #3 — Raincloud plot  ·  P0 · `03-distribution/raincloud-plot/`

**Sources** : Allen, Poggiali, Whitaker, Marshall & Kievit 2019 (*Raincloud plots: a multi-platform tool*, Wellcome Open Research) ; Weissgerber 2015 ; Cumming 2012 (*Understanding the New Statistics*).

**Quand utiliser** : le meilleur compromis « montrer toutes les données » — publications, rapports scientifiques.
**Quand ne pas utiliser** : dashboards compacts (coût spatial élevé), n énorme (> ~500/groupe).

**Maths** :
- Demi-KDE (miroir coupé verticalement) + box réduite + points jitterés.
- Géométrie déterministe anti-occlusion (recommandation Kievit) : demi-violon au-dessus, box au milieu, points en dessous ; offsets verticaux fixes en px via tokens.
- Mêmes formules KDE que #1 ; jitter φ = nombre d'or (cohérent avec violin-plot.md existant).

---

### #4 — Candlestick + volume  ·  P0 · `05-evolution-temporelle/candlestick-volume/`

**Sources** : Homma Munehisa (~1750, marché Dojima, origine historique) ; Heer, Bostock & Ogievetsky 2010 ; Wilder 1978 (indicateurs associés).

**Architecture cognitive obligatoire** : **deux panneaux empilés verticalement partageant le même axe X**
(candlesticks ~70% hauteur, volume ~30%). **Interdit de superposer le volume sur le même axe Y** (double axe).

**Quand utiliser** : analyse technique, rapports financiers.
**Quand ne pas utiliser** : public non financier, horizons intraday bruités.

**Maths** :
- Corps : `|open − close|` ; mèches : `high` / `low` ; hausse/baisse via tokens `status.positive/negative` (CVD-safe, pas rouge/vert seuls).
- Volume MA : `VMA(n) = Σᵢ₌₁ⁿ Vᵢ / n` (ligne overlay sur le panneau volume).
- Synchroniser tooltips via `mode: 'index', axis: 'x'` sur les deux panneaux.

---

### #5 — Diagramme de Pareto  ·  P1 · `02-composition-part-to-whole/pareto-chart/`

**Sources** : Pareto 1896 ; Juran 1951 (*Quality Control Handbook*) ; loi de Zipf 1949 (distributions en rangs).

**Quand utiliser** : analyse 80/20, priorisation de défauts/causes, catégories nominales déjà triables.
**Quand ne pas utiliser** : catégories ordinales ou temporelles (le tri détruit l'ordre naturel), données non additives.

**Maths** :
- Cumulé : `cumul_i = Σⱼ≤ᵢ xⱼ / Σx` (ligne, axe droit 0–100%, zéro aligné).
- Test de Paretoïté (à documenter dans le .md) : coefficient de Gini `G = Σ|xi − xj| / (2n²μ)` ; structure 80/20 typique si `G ≳ 0,6`.
- Seuil 80% tracé en référence discrète (data-ink minimal).

---

### #6 — Scatter + régression + IC 95%  ·  P1 · `04-correlation-relation/scatter-regression/`

**Sources** : Gauss-Legendre (moindres carrés) ; Anscombe 1973 (*Graphs in Statistical Analysis*) ; Matejka & Fitzmaurice 2017 (*Same Stats, Different Graphs*, CHI).

**Quand utiliser** : toute modélisation linéaire présentée à un public.
**Quand ne pas utiliser** : extrapolation hors range des données ; séries autocorrélées (IC invalide) sans correction.

**Maths** :
- OLS : `ŷ = β₀ + β₁x`, `β₁ = cov(x,y)/var(x)`, `β₀ = ȳ − β₁x̄`.
- IC 95% de la moyenne prédite : `ŷ ± t_{α/2, n−2}·SE(ŷ)`, bande dessinée en aire α faible.
- Qualité : `R² = 1 − SS_res/SS_tot` ; Pearson `r` affiché en annotation tabulaire.
- Afficher équation + n directement sur le graphe (transparence, style Anscombe).

---

### #7 — Barres + marqueur de cible  ·  P1 · `01-comparaison/bar-target-overlay/`

**Sources** : Cleveland & McGill 1984 (position vs position = jugement précis) ; Tufte 1983 (référence discrète low-ink).

**Quand utiliser** : KPI vs objectif par catégorie (horizontal recommandé pour labels longs).
**Quand ne pas utiliser** : plusieurs cibles par catégorie ; catégories trop nombreuses (> 15).

**Maths** :
- Marqueur = tick vertical (trait ≤ 2px, `tokens.emphasis.accent`) positionné à la valeur cible.
- Écart relatif annotable : `(réel − cible)/cible`, format % avec chiffres tabulaires (`fontMono`).
- Atteinte/non-atteinte : accentuation par tokens `status`, jamais par couleur seule (+ forme/tick).

---

### #8 — Double axe Y normalisé (dual-axis contrôlé)  ·  P1 · `05-evolution-temporelle/dual-axis-controlled/`

**Sources** : Croxton & Stryker 1927 (origines historiques, JASA) ; Few 2008 (Perceptual Edge, critique) ; Franconeri et al. 2021.

⚠️ **Template à risque — garde-fous TOUS obligatoires** (sinon ne pas livrer) :
1. Les **deux axes Y sont affichés** explicitement, titrés et unités mentionnées.
2. **Zéro aligné** sur les deux axes quand les séries sont de signe positif.
3. Couleur appariée série↔axe (l'axe gauche prend la couleur de la série 1, etc.).
4. Ratio d'échelles fixé par normalisation : index base 100 (`s_i(t)/s_i(t₀)×100`) ou z-score `(x−μ)/σ` — **jamais ajusté manuellement pour « faire apparaître » une corrélation**.
5. Le `.md` contient une section « Danger : corrélation fallacieuse » avec la formule de Pearson `r = Σ(z₁z₂)/(n−1)` et l'avertissement que r dépend du choix d'échelle.

**Quand utiliser** : deux séries causalement liées d'unités différentes (ex. température vs ventes), public analytique averti.
**Quand ne pas utiliser** : grand public, rapports réglementés, toute situation où la corrélation pourrait être mal interprétée comme causale.

---

### #9 — Violin + box interne (enrichissement)  ·  P2

**Action** : ce combo existe déjà partiellement (`violin-plot`). Enrichir plutôt que dupliquer :
ajouter l'affichage explicite de **n par groupe** près de chaque violon et documenter le piège
« l'aire du violon ∝ densité, pas n » (Hintze & Nelson 1998 ; critiques Knific & Weissgerber 2018).
Normaliser chaque violon à aire constante OU afficher n — jamais laisser l'aire coder n implicitement.

---

### #10 — Scatter + marginales (jointplot)  ·  P2 · `04-correlation-relation/joint-scatter-marginals/`

**Sources** : Tufte 1983 (rug plots, small multiples) ; théorie des probabilités (marginales vs jointe).

**Quand utiliser** : corrélations masquées par les marges (ex. relation en U invisible sur les histogrammes seuls).
**Quand ne pas utiliser** : format < 400px (marges illisibles).

**Maths** :
- Marginales : `f(x) = ∫f(x,y)dy`, `f(y) = ∫f(x,y)dx` (KDE 1D de chaque variable, cf. #1).
- Optionnel : ellipse de confiance 95% via matrice de covariance `Σ` et quantile χ² : `d²_M = (x−μ)ᵀ Σ⁻¹ (x−μ) ≤ χ²₂(0,975)`.

---

### #11 — Empilé + ligne de total  ·  P2 · `02-composition-part-to-whole/stacked-total-line/`

**Sources** : Tufte 1983 ; Skau & Kosara 2016 (perception des empilements) ; Heer et al. 2010.

**Quand utiliser** : storytelling « le total croît mais un segment décroît » (bascule).
**Ne pas utiliser** : si le lecteur doit comparer précisément les segments intermédiaires (impossible perceptuellement → préférer barres groupées).

**Maths** : `total(t) = Σ segments(t)` ; ordre des couches stable dans le temps (constance d'objet, Heer & Robertson 2007) ; ligne de total = somme, trait plein accentué.

---

### #12 — Gantt + repère « aujourd'hui » / avancement  ·  P2 · `06-flux-processus/gantt-progress/`

**Sources** : Gantt 1910–1917 ; recherche préattentive (Healey, Boothby & Enns 1996) pour la ligne verticale.

**Quand utiliser** : suivi de projet avec jalons.
**Ne pas utiliser** : > ~30 tâches sans regroupement hiérarchique.

**Maths** : positions temporelles `x_start/x_end` (échelle temps partagée) ; avancement interne `p = done/(end−start)` rendu en sous-barre ; ligne « now » = trait vertical discret préattentif (accent token).

---

### #13 — Waterfall + ligne cumulée  ·  P3 · `06-flux-processus/waterfall-cumulative-line/`

**Sources** : peu d'études dédiées — s'appuyer sur Tufte 1983 et Heer & Robertson 2007 (object constancy).

**Quand utiliser** : pont de variance budgétaire où le chemin cumulé compte autant que les écarts.
**Ne pas utiliser** : si le waterfall seul suffit (redondance = violation du principe de cohérence de Mayer).

**Maths** : `run_i = run_{i−1} + Δ_i` ; bornes Y = `[min(run), max(run)]` avec padding 5%.

---

### #14 — Prix + overlays indicateurs (SMA / Bollinger)  ·  P3 · `05-evolution-temporelle/price-indicator-overlays/`

**Sources** : Bollinger (années 1980) ; Wilder 1978 (*New Concepts in Technical Trading Systems*).

**Contrainte dure** : **max 3 overlays simultanés** (Miller 1956 ; Mayer 2001).

**Quand utiliser** : contexte analytique expert uniquement.
**Ne pas utiliser** : communication générale (charge extrinsèque maximale).

**Maths** :
- SMA : `SMA(n)_t = Σᵢ₌₀ⁿ⁻¹ x_{t−i} / n`.
- EMA récursif : `EMA_t = αx_t + (1−α)EMA_{t−1}`, `α = 2/(n+1)`.
- Bandes de Bollinger : `moyenne mobile ± k·σ_rolling(n)`, k = 2.

---

## 4. Plan d'orchestration proposé pour l'agent

| Lot | Contenu | Livrables |
|-----|---------|-----------|
| L1 | P0 (#1–#4) | 4 triades + docs + previews |
| L2 | P1 (#5–#8) | 4 triades + section danger du #8 |
| L3 | P2 (#9–#12) | 3 triades + enrichissement violin-plot |
| L4 | P3 (#13–#14) | 2 triades |
| L5 | Sync & validation | rebuild `catalog-bundle.js`, mise à jour `PROJECT.md` (Feature Inventory + compteur templates), passage suite `test/` à 100%, update README/index.html |

À chaque lot : mettre à jour `PROJECT.md` (nouvelles lignes Feature Inventory, milestones) et
vérifier la compatibilité `file://` (aucun module ES pur, CDN UMD uniquement).

---

## 5. Checklist qualité par template (rappel des standards du kit)

- [ ] Hit targets ≥ 10px (Fitts' law) via `getChartDefaultOptions`.
- [ ] Tooltips anti-occlusion (Mayer) via config centrale.
- [ ] Animations ≤ 450ms, `easeOutQuart`, supprimées si `prefers-reduced-motion`.
- [ ] Contraste WCAG AAA, palette CVD-safe via tokens uniquement.
- [ ] Chiffres tabulaires (`fontMono`) pour toutes les annotations numériques.
- [ ] Données de démo déterministes (seed fixe).
- [ ] Sources académiques citées avec année + venue dans le `.md`.
