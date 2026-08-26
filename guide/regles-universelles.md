# Règles Universelles & Fondements Cognitifs de la Dataviz

Ce document constitue le socle théorique et méthodologique de la bibliothèque de templates **kit-charts**. Il synthétise les découvertes fondamentales en sciences cognitives, psychophysique visuelle et ergonomie de l'information pour concevoir des visualisations de données déterministes, accessibles et à haute efficacité cognitive.

---

## 1. La Hiérarchie Perceptuelle de Cleveland & McGill (1984)

La recherche pionnière de William S. Cleveland et Robert McGill (*Graphical Perception: Theory, Experimentation, and Its Application to the Development of Graphic Methods*, Journal of the American Statistical Association, 1984) a établi le classement empirique des **tâches graphiques élémentaires** selon leur précision de décodage par le cerveau humain.

```
Précision cognitive maximale (Erreur de décodage minimale)
  ▲  1. Position sur une échelle commune alignée (ex: Bar chart, Scatter plot)
  │  2. Position sur des échelles non alignées (ex: Small multiples)
  │  3. Longueur (ex: Barres non alignées, Lollipop)
  │  4. Direction / Angle / Pente (ex: Slope chart, Pie chart)
  │  5. Surface / Aire 2D (ex: Bubble chart, Treemap)
  │  6. Volume 3D / Profondeur (ex: Graphiques 3D - À PROSCRIRE)
  ▼  7. Teinte (Hue) / Saturation / Densité de couleur (ex: Heatmap, Cartes choroplèthes)
Précision cognitive minimale (Estimation qualitative/ordinale uniquement)
```

### Règle d'or déterministe pour les agents IA
> **Tout encodage d'une variable quantitative critique doit prioriser la Position (1) ou la Longueur (3). Les variables de couleur (7) et d'aire (5) ne doivent être utilisées que pour des dimensions secondaires ou des données de contexte.**

---

## 2. Perception Pré-attentive & Lois de la Gestalt

Le système visuel humain traite certaines caractéristiques en moins de 200 à 250 millisecondes (processus pré-attentif inconscient) avant même l'intervention de l'attention consciente (Treisman, 1985 ; Ware, 2008).

### 2.1 Attributs pré-attentifs mobilisables
- **Forme** : Longueur, largeur, orientation, taille, forme du glyphe, courbure, clôture.
- **Couleur** : Teinte (*Hue*), Saturation/Luminance (*Intensity*).
- **Position** : Position 2D, groupement spatial.
- **Mouvement** : Clignotement, trajectoire (à utiliser avec parcimonie en tableau de bord).

### 2.2 Lois de la Gestalt appliquées aux graphiques

| Loi Gestalt | Mécanisme perceptif | Application Dataviz & Chart.js |
| :--- | :--- | :--- |
| **Proximité** | Les éléments spatiaux rapprochés sont perçus comme un groupe unifié. | L'espacement entre barres d'un même groupe doit être inférieur à l'espace entre groupes (`categoryPercentage: 0.8`, `barPercentage: 0.9`). |
| **Similarité** | Les éléments partageant la même couleur, forme ou taille sont jugés de même nature. | Une couleur identique doit toujours signifier la même catégorie sémantique sur l'ensemble d'un dashboard. |
| **Continuité** | L'œil suit naturellement les lignes lisses et continues. | Ne pas casser artificiellement les courbes de tendance temporelles ; ordonner les points de manière continue sur l'axe X. |
| **Clôture** (*Closure*) | Le cerveau comble les vides pour percevoir des formes complètes. | Éviter les bordures lourdes (`borderWidth: 0` ou subtil) ; l'œil structure l'espace sans boîtes englobantes. |
| **Figure / Fond** | Distinction immédiate entre l'objet focal et le conteneur. | Contraste net entre les marques de données (figure) et le fond de la zone de tracé (fond neutre sans texture). |
| **Destin Commun** | Les éléments évoluant dans la même direction sont perçus comme liés. | Utilisé dans les animations de transition et les diagrammes de flux (Sankey). |

---

## 3. Théorie de la Charge Cognitive (Sweller) & Ratio Data-Ink (Tufte)

### 3.1 La règle de Sweller (1988, 1998)
La mémoire de travail humaine est limitée à environ **4 ± 1 éléments d'information simultanés** (Cowan, 2001). Dans un graphique, on distingue trois charges :
1. **Charge Intrinsèque** : Complexité inhérente aux données métier (incompressible).
2. **Charge Extrinsèque (Bruit)** : Complexité imposée par le design, le format, les légendes lointaines, les grilles lourdes. **Doit être réduite à zéro.**
3. **Charge Essentielle (*Germane*)** : Effort mental dédié à la compréhension des insights et à la prise de décision. **Doit être maximisée.**

### 3.2 Le Ratio Data-Ink d'Edward Tufte (1983)
$$\text{Data-Ink Ratio} = \frac{\text{Encre dédiée aux données non redondantes}}{\text{Encre totale utilisée pour imprimer le graphique}}$$

- **Supprimer le "Chartjunk"** : Éliminer la 3D décorative, les effets d'ombrage excessifs, les arrière-plans colorés, les trames vibrantes (effet Moiré).
- **Alléger la grille** : Lignes de grille ultra-subtiles (`rgba(0, 0, 0, 0.05)` ou `rgba(255, 255, 255, 0.08)`) voire supprimées si l'étiquetage direct est présent.
- **Effet $1 + 1 = 3$ (Tufte)** : Deux lignes trop rapprochées ou trop contrastées créent une troisième ligne visuelle parasite dans l'espace vide entre elles.

### 3.3 Effet d'Attention Divisée (*Split-Attention Effect*) & Étiquetage Direct
Selon Ayres & Sweller (2005) et Mayer (2009, principe de contiguïté spatiale) :
- **Légendes déportées = Coût cognitif élevé** : L'utilisateur doit faire des allers-retours oculaires constants entre la légende et la courbe/barre.
- **Règle absolue** : Privilégier l'**étiquetage direct** (*direct labeling*) en bout de courbe ou sur la barre plutôt qu'une boîte de légende distante lorsque le nombre de séries est $\le 5$.

---

## 4. Perception des Couleurs, Contraste et Accessibilité (WCAG / CVD)

Le système visuel humain est beaucoup plus sensible aux différences de **luminance** (contraste clair/sombre) qu'aux différences de **teinte pure** (*Hue*). De plus, ~8% des hommes et ~0.5% des femmes présentent une déficience de la vision des couleurs (CVD).

### 4.1 Typologie des Palettes de Données (Cynthia Brewer - ColorBrewer)
1. **Palettes Qualitatives / Catégorielles** :
   - Pour variables nominales non ordonnées (ex: Région, Produit).
   - Utiliser des teintes distinctes avec luminance et saturation harmonisées pour ne pas créer de fausse hiérarchie visuelle.
   - **Limite cognitive** : 5 à 7 couleurs maximum par graphique.
2. **Palettes Séquentielles** :
   - Pour variables numériques ou ordonnées (ex: Chiffre d'affaires de 0 à 1M€).
   - Progression continue de luminance (du clair au sombre ou inversement) et perceptuellement uniforme (ex: *Viridis*, *Blues*, *Cividis*).
3. **Palettes Divergentes** :
   - Pour variables quantitatives avec un point neutre/critique central (ex: Profit/Perte autour de 0, Écart à la cible, Température vs moyenne).
   - Deux teintes opposées divergeant d'un point central neutre (gris clair ou blanc).

### 4.2 Standards d'Accessibilité
- **WCAG 2.1 niveau AA / AAA** :
  - Contraste minimal texte/fond : **4.5:1** pour texte normal, **3:1** pour texte large.
  - Contraste composants d'interface et graphiques de données : **3:1** minimum entre les barres/courbes et le fond (`UI Components & Graphical Objects`).
- **Sécurité Daltonisme (CVD Safe)** : Éviter absolument le duo Rouge / Vert pur non différencié par la luminance. Remplacer par Bleu / Orange ou Bleu / Rouge avec contraste d'intensité.

### 4.3 Les 6 Motifs Universels d'Accentuation Cognitive & Valence Métier
*(Pour le cadre théorique complet, consulter `semiologie-accentuation-cognition.md`)*

1. **Focus Narratif (Ratio 90/10 de Tufte)** :
   - 90% des éléments constituent le contexte et sont encodés dans des teintes neutres/désaturées (`tokens.emphasis.context`, opacité 0.35–0.45).
   - 10% des éléments (la série hero / insight clé) sont mis en valeur avec la couleur focale contrastée (`tokens.emphasis.focal`, opacité 1.0, trait renforcé).
2. **Valence Métier & Directionnalité Inversée** :
   - *Métriques de gain (CA, profit, conversion)* : Hausse (+) = `status.success` (vert), Baisse (-) = `status.danger` (rouge).
   - *Métriques de coût / risque (coût, churn, latence, défaut)* : Hausse (+) = `status.danger` (rouge), Baisse (-) = `status.success` (vert).
   - Géré automatiquement par le helper universel `getValenceColor(tokens, direction, metricType)`.
3. **Écarts, Seuils & Bandes de Tolérance** :
   - Ligne cible ou moyenne passée encodée en `tokens.emphasis.benchmark` (`borderDash: [4, 4]`).
   - Zones de statut résolues par `getThresholdStatus(value, target, thresholds)` : `success` (≥ 100%), `warning` (90–99%), `danger` (< 90%).
4. **Anomalies & Outliers Statistiques** :
   - Détection Tukey ($> 1.5 \text{ IQR}$) ou z-score ($> 2\sigma$).
   - Encodage saillant en `tokens.emphasis.anomaly` avec glyphe distinctif (`pointStyle: 'triangle'`, rayon 6–8px).
5. **Incertitude & Projections Temporelles** :
   - Séries futures / estimées distinguées par transparence `tokens.emphasis.forecastAlpha` (0.45–0.60), trait discontinu (`borderDash: [5, 5]`) et point en croix (`pointStyle: 'crossRot'`).
6. **Données Manquantes vs Zéro Réel** :
   - Distinguer formellement le zéro mesuré ($0.0$, tracé normalement) des données non disponibles (`null` / missing).
   - Données manquantes représentées par un trait tireté fin (`borderDash: [3, 3]`), hachures ou badge explicite `"N/D"`.

### 4.4 Matrice de Double-Encodage Obligatoire
> **Règle absolue** : Ne jamais transmettre une information critique (direction, seuil, anomalie, statut) *uniquement* par la couleur. Associer systématiquement au moins deux canaux perceptifs indépendants.

| Rôle Cognitif | Canal 1 : Couleur | Canal 2 : Forme de Point | Canal 3 : Style de Ligne | Canal 4 : Texte / Badge |
| :--- | :--- | :--- | :--- | :--- |
| **Focal (Hero Series)** | `emphasis.focal` | Disque plein (●) | Continu 2px | Étiquette directe gras |
| **Contexte (Muted)** | `emphasis.context` | Petit disque (·) | Continu 1px | Légende atténuée |
| **Benchmark (Cible)** | `emphasis.benchmark` | Losange (◆) | Tirets [4, 4] | Ligne repère "Cible" |
| **Succès / Gain** | `status.success` | Triangle haut (▲) | Continu | "+X% (Objectif atteint)" |
| **Alerte / Perte** | `status.danger` | Triangle alerte (▲) | Continu épais | "-X% (Zone critique)" |
| **Anomalie / Outlier** | `emphasis.anomaly` | Triangle / Étoile | Halo contrasté | Badge "Outlier (>2σ)" |
| **Prévision (Forecast)**| `forecastAlpha` (0.5) | Croix rotative (✕) | Tirets [5, 5] | "Projection M+1" |
| **Manquant (No Data)** | `textMuted` | Carré vide (□) | Tirets fins [3, 3] | "N/D" |

### 4.5 Incertitude des Mesures & Intervalles de Confiance (Cumming & Finch 2005)
L'affichage d'estimations empiriques (moyennes de groupes, points de mesure) sans leur incertitude d'échantillonnage induit de faux jugements de différence significative. Deux moyennes graphiquement disjointes peuvent partager des intervalles de confiance largement superposés.

- **Formulation Mathématique Déterministe** :
  - **Erreur Standard de la Moyenne** : $SE = \frac{s}{\sqrt{n}}$ où $s = \sqrt{\frac{1}{n-1}\sum (x_i - \bar{x})^2}$
  - **Intervalle de Confiance à 95% ($n \ge 30$)** : $CI_{95} = \bar{x} \pm 1.96 \cdot SE$
  - **Intervalle de Confiance à 95% ($n < 30$)** : $CI_{95} = \bar{x} \pm t(0.975, n-1) \cdot SE$ (Loi de Student exacte)
- **Règle de Chevauchement de Cumming & Finch (2005)** :
  - Si deux intervalles $CI_{95}$ se chevauchent de plus de **29% de leur demi-largeur moyenne**, la différence observée n'est **PAS statistiquement significative** au seuil $\alpha = 0.05$.
  - **Interdiction de valence métier** : Dans ce cas de chevauchement, la template et l'agent IA ont **l'interdiction formelle** d'appliquer une couleur de valence positive ou négative (`success` / `danger`) à la comparaison. Le statut doit rester strictement `neutral`.
- **Encodage Perceptuel (Double Encodage Obligatoire)** :
  - **Barre d'erreur graphique** : Trait 1px, couleur neutre `tokens.textMuted`, embouts horizontaux (*caps*) de 6px (3px de part et d'autre).
  - **Infobulle (Tooltip)** : Mention explicite `"IC95%: [lo — hi]"` en chiffres tabulaires.

### 4.6 Garde-fous d'Anscombe & Règle des Petits Échantillons (Anscombe 1973 ; Matejka & Fitzmaurice 2017)
Le quartet d'Anscombe et le *Datasaurus Dozen* démontrent que des résumés statistiques agrégés (moyenne, écart-type, médiane, régression linéaire) peuvent masquer des distributions sous-jacentes totalement divergentes ou aberrantes :
1. **Superposition des données brutes sur Box Plot & Violin Plot ($n \le 30$)** :
   - Lorsque $n \le 30$, les points individuels bruts sont systématiquement superposés avec un jittering déterministe basé sur le ratio d'or ($\phi = \frac{\sqrt{5}-1}{2} \approx 0.618034$).
2. **Badge d'avertissement pour très petits échantillons ($n < 5$)** :
   - Pour tout groupe avec $n < 5$, l'infobulle et le graphique signalent obligatoirement l'avertissement `"(n=K — échantillon non représentatif)"`.
3. **Condition de validité de la régression linéaire sur Scatter Plot ($n \ge 10$)** :
   - La droite de tendance et le coefficient $R^2$ ne sont générés automatiquement que si l'échantillon comporte **au moins $10$ points bivariés valides**.
   - En-deçà ($n < 10$), la droite est masquée par défaut pour éviter l'artéfact de corrélation fallacieuse. Un affichage forcé reste possible via `showTrend: true`, auquel cas le label de la droite comporte obligatoirement le badge d'avertissement explicite `"Tendance (R² = ... — n < 10)"`.

---



## 5. Typographie, Échelles et Alignements

### 5.1 Règle du Zéro sur l'Axe Y
- **Graphiques encodant par la Longueur (Barres, Aires, Lollipop)** :
  - **L'axe Y DOIT IMPÉRATIVEMENT démarrer à 0** (`beginAtZero: true`). Tronquer l'axe sur une barre fausse le ratio longueur/valeur perçu (mensonge visuel, Huff 1954 ; Cairo 2019).
- **Graphiques encodant par la Position (Lignes, Scatter plot)** :
  - L'axe Y peut être ajusté pour zoomer sur la variance significative des données, à condition que l'échelle soit explicitement lisible et ne déforme pas abusivement la pente (ratio d'aspect 45° de Cleveland - *Banking to 45 degrees*).

### 5.2 Typographie et Micro-ergonomie
- **Orientation du texte** : Tous les labels de catégories doivent être **horizontaux**. Si les labels se chevauchent ou dépassent 10 caractères, basculer immédiatement en **Barres Horizontales** plutôt que d'incliner le texte à 45° ou 90° (ralentit la lecture de 40 à 60%).
- **Chiffres tabulaires** : Utiliser des polices avec alignement numérique monospace/tabulaire (`font-feature-settings: "tnum"`) pour aligner proprement les décimales.
- **Formatage des nombres** : Arrondir intelligemment (ex: `12,4 M€` au lieu de `12 432 189,42 €` sur un axe global) pour réduire l'encombrement cognitif.

### 5.3 Échelles Logarithmiques & Loi de Weber-Fechner
Conformément à la loi psychophysique de Weber-Fechner ($\Delta I / I = k$), la perception humaine des grandeurs relatives est logarithmique lorsque les amplitudes couvrent plusieurs ordres de grandeur.
- **Critère de déclenchement déterministe (`suggestScale(data)`)** :
  $$\frac{\max(|data|)}{\min(data_{>0})} \ge 100 \quad (2\text{ décades}) \quad \land \quad \forall x \in data, x > 0 \implies \text{'log'}$$
- **Interdiction formelle sur les encodages par la Longueur** : L'échelle logarithmique est **strictement interdite** sur les diagrammes en barres, aires ou lollipops (`throw new Error('kit-charts: log scale is forbidden on length-encoded bar charts')`), car la longueur physique d'une barre sur échelle log brise la proportionnalité fondamentale $L \propto V$.
- **Autorisation sur les encodages par la Position** : Autorisée exclusivement sur les lignes (`line-chart`), nuages de points (`scatter-plot`) et bulles (`bubble-chart`).
- **Garde-fou valeurs non-positives** : La présence de valeurs $\le 0$ avec échelle log active déclenche immédiatement une erreur bloquante déterministe (`throw new Error('kit-charts: log scale requires strictly positive values')`).
- **Infobulles authentiques** : L'infobulle affiche toujours la valeur brute décimale (`10 000 €`), jamais l'exposant mathématique ($\log_{10} = 4$).

---

## 6. Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations
*(Pour le cadre théorique exhaustif, les formules mathématiques et algorithmes déterministes, consulter `interaction-tooltips-animations.md`)*

L'interactivité et l'animation temporelle constituent des démultiplicateurs de compréhension analytique à condition d'obéir strictement aux lois de la psychophysique et de l'ergonomie cognitive :

### 6.1 Loi de Fitts & Attraction Spatiale (Fitts 1954 ; MacKenzie 1992 ; ISO 9241-9)
- **Élargissement de cible (*Hit Padding*)** : Tout point ou marqueur de données doit disposer d'un rayon d'attraction étendu (`hitRadius: 10–14px`) afin de réduire l'Indice de Difficulté ($ID = \log_2(D/W_e + 1)$) et diminuer le temps d'acquisition motrice de 38%.
- **Projection 1D & Indexation Axiale** : Pour les séries temporelles et graphiques en barres, utiliser le mode indexé (`mode: 'index'`, `axis: 'x'`, `intersect: false`) afin de capturer toute la tranche spatiale et d'afficher simultanément les valeurs comparées.
- **Attraction 2D Euclidienne** : Pour les nuages de points denses (Scatter / Bubble), adopter le ciblage euclidien au plus proche (`mode: 'nearest'`, `axis: 'xy'`, `intersect: false`).

### 6.2 Réactivité Temporelle & Dynamique d'Infobulle (Card, Moran & Newell 1983 ; Nielsen 1993)
- **Instantanéité perceptive ($\le 100\text{ms}$)** : Tout retour de survol (halo, réticule de visée) doit répondre en moins de 100ms ($60\text{ fps}$).
- **Débounce & Hystérésis** : Apparition filtrée par un délai d'entrée $\Delta t_{\text{enter}} = 60\text{--}80\text{ms}$ (évite les scintillements parasites lors des saccades oculaires) et persistance de sortie $\Delta t_{\text{exit}} = 150\text{--}200\text{ms}$ (stabilité motrice).

### 6.3 Contiguïté Spatiale & Anti-Occlusion Déterministe (Mayer 2001, 2009)
- **Auto-Suffisance Cognitive** : L'infobulle (*Details-on-Demand*) doit contenir le titre temporel/catégoriel, le nom de la série, la valeur absolue formatée (`font-variant-numeric: tabular-nums`) et la métrique d'écart contextuelle ($\Delta \text{ vs Benchmark}$ / Badge statut).
- **Positionnement Anti-Occlusion** : Déport vertical de sécurité ($\Delta y = 12\text{px}$) avec basculement automatique de quadrant (*quadrant flipping*) vers le bas lors de l'approche du bord supérieur, interdisant le masquage du point actif ou des voisins immédiats.

### 6.4 Constance d'Objet & Easing Physique (Heer & Robertson 2007 ; Tversky et al. 2002)
- **Préservation de l'Identité des Glyphes** : Lors d'un tri ou d'un filtrage, interpoler continûment la position et l'échelle pour neutraliser la cécité au changement (*Change Blindness*).
- **Cinétique Visuelle & Amorti** : Rendu initial régi par une décélération douce à amortissement critique `easeOutQuart` ($0.25, 1, 0.5, 1$) ou `easeOutCubic` ($0.33, 1, 0.68, 1$) sur une durée calibrée de $350\text{--}550\text{ms}$. Proscription absolue des rebonds (*bounce*) et des animations perpétuelles en boucle.

### 6.5 Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2 AAA)
- **Mode `prefers-reduced-motion`** : Désactivation instantanée de toute translation ou déformation géométrique (`duration: 0`) dès la détection de la préférence utilisateur (Guideline 2.3.3 AAA).
- **Contraste Élevé des Infobulles** : Ratio texte/fond $\ge 7:1$ (WCAG AAA) et bordure de délimitation $\ge 3:1$.

---

## 7. Déterminisme pour Agents IA : Arbre de Décision Global

Lorsqu'un agent IA conçoit un graphique, il doit exécuter la matrice de décision suivante sans laisser de place à l'aléatoire :

```
Type de Données & Question Métier
├── 1. Comparaison entre Catégories Discrètes
│   ├── ≤ 7 catégories avec labels courts ────► Bar Chart Vertical
│   ├── > 7 catégories OU labels longs ──────► Bar Chart Horizontal (trié décroissant)
│   ├── Comparaison Réalisé vs Cible ────────► Bullet Chart
│   └── 2 valeurs temporelles par catégorie ─► Slope Chart ou Dumbbell Chart
│
├── 2. Évolution Temporelle Continue
│   ├── 1 à 4 séries continues ──────────────► Line Chart (étiquetage direct)
│   ├── > 4 séries temporelles ──────────────► Small Multiples (grille de mini-lignes)
│   ├── Volume cumulé sur le temps ──────────► Stacked Area Chart (si ≤ 4 séries)
│   └── Volatilité financière (Open/High/Low)─► Candlestick / OHLC
│
├── 3. Composition & Part dans le Tout (Part-to-Whole)
│   ├── ≤ 4 parts avec différences marquées ──► Doughnut Chart (avec valeur centrale)
│   ├── > 4 parts OU données hiérarchiques ──► Treemap
│   ├── Ratios / Pourcentages discrets ──────► Waffle Chart
│   └── Comparaison de parts entre groupes ──► 100% Stacked Bar
│
├── 4. Distribution Statistique
│   ├── 1 variable continue (grand volume) ──► Histogramme (règle de Freedman-Diaconis)
│   ├── Comparaison unimodale / résumés 5 nb ─► Box Plot (`template/03-distribution/box-plot/`)
│   ├── Distributions multimodales / continues ► Violin Plot (`template/03-distribution/violin-plot/`)
│   └── Petit échantillon discret (N < 100) ──► Strip Plot / Beeswarm
│
├── 5. Corrélation & Relation Multivariée
│   ├── 2 variables continues (N points) ────► Scatter Plot (avec ligne de tendance)
│   ├── 3 variables (X, Y, Taille) ──────────► Bubble Chart (aire proportionnelle)
│   └── Multiples paires de variables ──────► Matrice Heatmap de corrélation
│
└── 6. Flux, Processus & Hiérarchie
    ├── Flux directionnels avec pertes ──────► Sankey Diagram
    ├── Entonnoir d'étapes séquentielles ────► Funnel Chart
    ├── Bilan positif / négatif d'étapes ────► Waterfall Chart
    └── Relations en réseau / graphe ────────► Node-Link Network
```

---


## 8. Bibliographie et Sources Académiques Fondatrices

1. **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception: Theory, Experimentation, and Its Application to the Development of Graphic Methods*. Journal of the American Statistical Association, 79(387), 531-554. DOI: [10.1080/01621459.1984.10478080](https://doi.org/10.1080/01621459.1984.10478080).
2. **Bertin, J. (1967)**. *Sémiologie Graphique: Les diagrammes, les réseaux, les cartes*. Gauthier-Villars, Paris.
3. **Stevens, S. S. (1957)**. *On the psychophysical law*. Psychological Review, 64(3), 153–181. DOI: [10.1037/h0055392](https://doi.org/10.1037/h0055392).
4. **Tufte, E. R. (1983)**. *The Visual Display of Quantitative Information*. Graphics Press, Cheshire, CT.
5. **Tufte, E. R. (1990)**. *Envisioning Information*. Graphics Press, Cheshire, CT.
6. **Sweller, J. (1988)**. *Cognitive load during problem solving: Effects on learning*. Cognitive Science, 12(2), 257-285. DOI: [10.1207/s15516709cog1202_4](https://doi.org/10.1207/s15516709cog1202_4).
7. **Card, S. K., Moran, T. P., & Newell, A. (1983)**. *The Psychology of Human-Computer Interaction*. Lawrence Erlbaum Associates, Hillsdale, NJ.
8. **Fitts, P. M. (1954)**. *The information capacity of the human motor system in controlling the amplitude of movement*. Journal of Experimental Psychology, 47(6), 381–391.
9. **MacKenzie, I. S. (1992)**. *Fitts' law as a research and design tool in human-computer interaction*. Human-Computer Interaction, 7(1), 91–139. DOI: [10.1207/s15327051hci0701_3](https://doi.org/10.1207/s15327051hci0701_3).
10. **Mayer, R. E. (2001, 2009)**. *Multimedia Learning*. Cambridge University Press, New York.
11. **Heer, J., & Robertson, G. G. (2007)**. *Animated transitions in statistical data graphics*. IEEE Transactions on Visualization and Computer Graphics, 13(6), 1240–1247. DOI: [10.1109/TVCG.2007.70539](https://doi.org/10.1109/TVCG.2007.70539).
12. **Tversky, B., Morrison, J. B., & Betrancourt, M. (2002)**. *Animation: can it facilitate?* International Journal of Human-Computer Studies, 57(4), 247–262. DOI: [10.1006/ijhc.2002.1017](https://doi.org/10.1006/ijhc.2002.1017).
13. **Few, S. (2004, 2012)**. *Show Me the Numbers: Designing Tables and Graphs to Enlighten*. Analytics Press.
14. **Cairo, A. (2016, 2019)**. *The Truthful Art & How Charts Lie*. New Riders / W. W. Norton.
15. **Ware, C. (2008)**. *Visual Thinking for Design*. Morgan Kaufmann / Elsevier.
16. **Heer, J., & Bostock, M. (2010)**. *Crowdsourcing graphical perception: using mechanical turk to assess visualization design*. Proceedings of ACM CHI 2010, 203-212.
17. **Borkin, M. A., et al. (2013)**. *What Makes a Visualization Memorable?* IEEE Transactions on Visualization and Computer Graphics, 19(12), 2306-2315.
18. **Brewer, C. A. (2003)**. *ColorBrewer in Print and on the Web*. Cartographic Perspectives, 45, 78-79.
19. **Okabe, M., & Ito, K. (2008)**. *Color Universal Design (CUD)*. JFly Data Depository.
20. **Hintze, J. L., & Nelson, R. D. (1998)**. *Violin Plots: A Compound Display of Continuous Data Distributions*. The American Statistician, 52(2), 181-184.
21. **Cumming, G., & Finch, S. (2005)**. *Inference by eye: Confidence intervals and how to read pictures of data*. American Psychologist, 60(2), 170–180.
22. **Hick, W. E. (1952)**. *On the rate of gain of information*. Quarterly Journal of Experimental Psychology, 4(1), 11-26.
23. **Itti, L., & Koch, C. (2001)**. *Computational modelling of visual attention*. Nature Reviews Neuroscience, 2(3), 194-203.
24. **Sharma, G., Wu, W., & Dalal, E. N. (2005)**. *The CIEDE2000 color-difference formula: Implementation notes, supplementary test data, and mathematical observations*. Color Research & Application, 30(1), 21-30.
25. **Anscombe, F. J. (1973)**. *Graphs in Statistical Analysis*. The American Statistician, 27(1), 17-21.
26. **Matejka, J., & Fitzmaurice, G. (2017)**. *Same Stats, Different Graphs: Generating Datasets with Varied Appearance and Identical Summary Statistics through Simulated Annealing*. Proceedings of ACM CHI 2017.
27. **ISO (2000)**. *ISO 9241-9: Requirements for non-keyboard input devices*. International Organization for Standardization.
28. **W3C (2023)**. *Web Content Accessibility Guidelines (WCAG) 2.2*. World Wide Web Consortium.
29. **Documents de référence théoriques kit-charts** :
    - `semiologie-accentuation-cognition.md` : Cadre théorique d'accentuation sélective, valence et sémiologie visuelle.
    - `interaction-tooltips-animations.md` : Cadre théorique et spécification déterministe de l'interaction, des infobulles (*Details-on-Demand*) et des micro-animations.


