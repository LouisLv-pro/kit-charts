# Sémiologie Visuelle, Accentuation & Cognition dans la Visualisation de Données

Ce document constitue le cadre théorique, méthodologique et opérationnel de référence de la bibliothèque **kit-charts** pour l'accentuation sélectives, la valence métier et la sémiologie graphique déterministe. Il fait la synthèse des lois de la psychophysique, des sciences de la perception et de la charge cognitive afin de guider le développement de graphiques analytiques exempts de biais perceptifs et accessibles à 100% des utilisateurs.

---

## 1. Fondements Scientifiques de la Perception Visuelle & Psychophysique

L'efficacité d'une visualisation de données repose sur l'alignement strict entre la structure mathématique de l'information et les mécanismes neuro-perceptifs du système visuel humain (HVS).

### 1.1 La Loi de Puissance de Stevens & la Compression Perceptive
En psychophysique, la loi de puissance de Stanley Smith Stevens (1957) modélise la relation entre l'intensité physique d'un stimulus ($I$) et son intensité psychologique perçue ($S$) :

$$S = k \cdot I^\alpha$$

où $k$ est une constante d'échelle et $\alpha$ l'exposant caractéristique du canal sensoriel :

```
Exposants de Stevens appliqués aux encodages graphiques :
┌──────────────────────────────────────┬─────────────┬────────────────────────────────────────────┐
│ Canal visuel                         │ Exposant α  │ Phénomène perceptif                        │
├──────────────────────────────────────┼─────────────┼────────────────────────────────────────────┤
│ Longueur d'une ligne / barre         │ α ≈ 0.9–1.0 │ Perception quasi-linéaire (Exacte)        │
│ Position sur un axe aligné           │ α = 1.0     │ Fidélité absolue (Décodage direct)        │
│ Surface 2D (Cercles, Aires)          │ α ≈ 0.6–0.7 │ Sous-estimation systématique (Flannery)   │
│ Volume 3D                            │ α ≈ 0.5–0.54│ Forte sous-estimation (Distorsion critique)│
│ Saturation / Luminance de couleur    │ Variable    │ Jugement ordinal non métrique              │
└──────────────────────────────────────┴─────────────┴────────────────────────────────────────────┘
```

**Implication mathématique** : Un cercle dont l'aire physique est 4 fois supérieure à un autre ne sera perçu par l'œil humain que comme étant $\approx 4^{0.7} = 2.64$ fois plus grand. Par conséquent, les encodages par la surface ou le volume sont proscrits pour les métriques quantitatives critiques et réservés aux encodages d'ordres de grandeur secondaires.

### 1.2 La Hiérarchie des Tâches Graphiques Élémentaires de Cleveland & McGill (1984)
William S. Cleveland et Robert McGill ont établi empiriquement le classement des tâches graphiques selon l'erreur absolue moyenne de décodage par le cerveau :

1. **Position le long d'une échelle commune alignée** (Erreur minimale : barres verticales/horizontales, nuages de points).
2. **Position le long d'échelles identiques mais non alignées** (*Small multiples*).
3. **Longueur** (Diagrammes en barres non alignées, diagrammes de Gantt, lollipops).
4. **Angle / Pente / Direction** (Slope charts, secteurs de camembert).
5. **Surface 2D** (Bubble charts, Treemaps, diagrammes de Venn).
6. **Volume 3D / Profondeur stéréoscopique** (3D charts — **strictement proscrits**).
7. **Luminance, Saturation et Teinte** (Cartes choroplèthes, heatmaps — estimation ordinale uniquement).

### 1.3 La Sémiologie Graphique de Jacques Bertin (1967)
Jacques Bertin a formalisé les propriétés sémiologiques des 8 variables visuelles fondamentales (les 2 dimensions du plan spatial $X, Y$ et les 6 variables rétiniennes : *Taille, Valeur/Luminance, Texture/Grain, Couleur/Teinte, Orientation, Forme*) selon 4 niveaux d'organisation perceptive :

- **Associative ($\equiv$)** : Permet de grouper sans hiérarchiser (Teinte, Forme, Orientation).
- **Sélective ($\neq$)** : Permet d'isoler instantanément une catégorie par vision pré-attentive (Couleur, Forme, Taille).
- **Ordonnée ($O$)** : Induit un classement perceptif naturel sans légende (Luminance, Taille, Épaisseur de trait).
- **Quantitative ($Q$)** : Permet de quantifier un rapport mathématique précis (Position, Longueur, Taille).

```
Propriétés sémiologiques des variables visuelles (Bertin) :
┌─────────────────────┬──────────────┬─────────────┬───────────┬──────────────┐
│ Variable visuelle   │ Associative  │ Sélective   │ Ordonnée  │ Quantitative │
├─────────────────────┼──────────────┼─────────────┼───────────┼──────────────┤
│ Position (X, Y)     │ Oui          │ Oui         │ Oui       │ OUI (Max)    │
│ Taille / Longueur   │ Non          │ Oui         │ Oui       │ OUI (Moyen)  │
│ Valeur / Luminance  │ Non          │ Oui         │ OUI       │ Non          │
│ Texture / Hachure   │ Oui          │ Oui         │ Oui       │ Non          │
│ Teinte / Couleur    │ OUI          │ OUI         │ Non       │ Non          │
│ Orientation         │ Oui          │ Oui         │ Non       │ Non          │
│ Forme du glyphe     │ OUI          │ Oui         │ Non       │ Non          │
└─────────────────────┴──────────────┴─────────────┴───────────┴──────────────┘
```

### 1.4 Le Ratio Data-Ink, le Principe 90/10 (Tufte 1983) et la Carte de Saillance (Itti & Koch 2001)
Edward Tufte postule que toute l'encre (ou pixels) affichée doit être porteuse d'information différentielle :

$$\text{Data-Ink Ratio} = \frac{\text{Pixels dédiés aux données non redondantes}}{\text{Pixels totaux de la scène visuelle}} \to 1.0$$

- **Règle du 90/10** : Dans un tableau de bord ou graphique analytique standard, **90% des éléments visuels constituent le contexte** et doivent être encodés dans des teintes neutres, désaturées et atténuées (`context` : ardoise, gris clair `#CBD5E1`, opacité 0.35–0.45). Seuls **$\le 10\text{--}15\%$ des éléments constituent le focus narratif ou l'insight d'action** (`focal` : couleur saturée et contrastée).
- **Modélisation Multicanale de la Saillance Visuelle (Itti & Koch 2001 ; Tufte 90/10)** :
  La saillance pré-attentive $S(i) \in [0, 1]$ d'un marqueur graphique $i$ combine les 4 canaux perceptifs fondamentaux :
  $$S(i) = 0.4 \cdot C_{\text{lum}} + 0.3 \cdot C_{\text{chroma}} + 0.2 \cdot C_{\text{fond}} + 0.1 \cdot C_{\text{taille}}$$
  où :
  - $C_{\text{lum}} = \frac{|\Delta L^*|}{100} \cdot \alpha$ (contraste de luminance relative avec le fond)
  - $C_{\text{chroma}} = \frac{\Delta E_{00}(\text{couleur}, \text{gris\_neutre})}{100} \cdot \alpha$ (saturation chromatique absolue)
  - $C_{\text{fond}} = \frac{\Delta E_{00}(\text{couleur}, \text{fond})}{100} \cdot \alpha$ (distance colorimétrique au fond)
  - $C_{\text{taille}} = \min\left(1.0, \frac{\text{Surface}_i}{\text{Surface}_{\text{ref}}}\right)$ (masse visuelle 2D)
  
  **Critère d'acceptation 90/10** : L'élément focal doit dominer au moins $90\%$ des éléments de contexte en saillance ($\text{argmax}(S) \in \text{série focale}$ et ratio de dominance $\ge 0.90$).
- **Élimination du "Chartjunk"** : Suppression totale des bordures lourdes, ombres portées décoratives, dégradés superflus et effet Moiré.


### 1.5 Théorie de la Charge Cognitive (Sweller) & Limites de la Mémoire de Travail
John Sweller (1988, 1998) et Nelson Cowan (2001) ont démontré que la mémoire de travail humaine ne peut manipuler que **$4 \pm 1$ blocs d'information simultanés** (*chunks*) :

- **Charge Intrinsèque** : Complexité inhérente aux données (nombre de séries, volume).
- **Charge Extrinsèque (Bruit)** : Coût mental imposé par des légendes déportées, des grilles denses ou un mauvais contraste. **Doit être réduite au strict minimum**.
- **Charge Essentielle (*Germane*)** : Mobilisation cognitive dédiée à la découverte d'insights stratégiques.

---

## 2. Les 6 Motifs Universels d'Accentuation Cognitive

Dans `kit-charts`, tout graphique analytique doit mettre en œuvre l'un ou plusieurs des 6 motifs universels d'accentuation sélectives :

```
                    LES 6 MOTIFS UNIVERSELS D'ACCENTUATION
┌─────────────────────────────┬───────────────────────────────┬──────────────────────────────────────────┐
│ Motif                       │ Objectif Cognitif             │ Encodages Graphiques                     │
├─────────────────────────────┼───────────────────────────────┼──────────────────────────────────────────┤
│ 1. Focus Narratif (90/10)   │ Guider l'attention vers l'axe │ Hero series = tokens.emphasis.focal      │
│                             │ prioritaire d'analyse         │ Contexte = tokens.emphasis.context       │
├─────────────────────────────┼───────────────────────────────┼──────────────────────────────────────────┤
│ 2. Valence Métier           │ Aligner couleur & sens métier │ Gain : Hausse = Vert, Baisse = Rouge     │
│    (Directionnalité)        │ (Gain vs Coût/Churn/Risque)   │ Coût : Hausse = Rouge, Baisse = Vert    │
├─────────────────────────────┼───────────────────────────────┼──────────────────────────────────────────┤
│ 3. Écarts & Seuils          │ Mesurer l'atteinte d'objectif │ Ligne cible = tokens.emphasis.benchmark │
│                             │ et les zones de tolérance     │ Statuts = success, warning, danger       │
├─────────────────────────────┼───────────────────────────────┼──────────────────────────────────────────┤
│ 4. Anomalies & Outliers     │ Détecter les ruptures et      │ > 1.5 IQR / 2σ = tokens.emphasis.anomaly │
│                             │ valeurs hors normes           │ Forme = Triangle / Losange rotatif       │
├─────────────────────────────┼───────────────────────────────┼──────────────────────────────────────────┤
│ 5. Incertitude & Prévisions │ Distinguer le réel de la      │ forecastAlpha (0.45–0.60)                │
│                             │ projection future             │ borderDash: [5, 5], pointStyle: crossRot │
├─────────────────────────────┼───────────────────────────────┼──────────────────────────────────────────┤
│ 6. Données Manquantes / N/D │ Traiter rigoureusement le     │ Hachures, borderDash: [3, 3], badge N/D  │
│                             │ vide sans fausser l'échelle   │ Zéro (0.0) ≠ Null/Missing                │
└─────────────────────────────┴───────────────────────────────┴──────────────────────────────────────────┘
```

---

### Motif 1 : Focus Narratif & Hiérarchie Visuelle (Ratio 90/10)
- **Problématique** : Lorsque 10 séries temporelles ou 15 catégories sont affichées avec des couleurs vives distinctes, le cerveau subit un effet de cacophonie perceptive (saturation de la mémoire de travail).
- **Règle opérationnelle** :
  - **Série Cible (*Hero Series*)** : Utiliser la couleur focale du thème (`tokens.emphasis.focal`), avec une opacité de 1.0 et une épaisseur de trait/bordure renforcée (`borderWidth: 2` ou `3`).
  - **Séries de Référence / Contexte (*Context Series*)** : Utiliser la couleur de contexte (`tokens.emphasis.context`), avec une opacité atténuée ($\approx 0.35–0.45$) et des traits plus fins (`borderWidth: 1`).
  - **Étiquetage direct** : Positionner le nom de la série cible directement au bout de la courbe plutôt que dans une boîte de légende générale.

---

### Motif 2 : Valence Métier & Directionnalité Inversée (Gain vs Coût)
- **Problématique** : Dans la culture occidentale et les normes financières internationales, le Vert signifie une issue favorable et le Rouge une issue défavorable. Cependant, une hausse numérique n'est pas universellement positive.
- **Règle de Polarité Métier** :
  - **Métriques de Gain / Croissance** (*Revenue, Margin, Profit, Conversion, CSAT, Volume*) :
    - Variation positive ($\Delta > 0$) $\to$ `status.success` (Vert / Bleu positif).
    - Variation négative ($\Delta < 0$) $\to$ `status.danger` (Rouge / Ambre alerte).
  - **Métriques de Coût / Perte / Risque** (*Cost, OPEX, CAC, Churn, Latency, Defect Rate, CO2, Debt*) :
    - Variation positive ($\Delta > 0$, augmentation du coût) $\to$ `status.danger` (Rouge / Alerte).
    - Variation négative ($\Delta < 0$, réduction du coût) $\to$ `status.success` (Vert / Favorable).
  - **Métriques Neutres / Descriptives** (*Market Share, Temperature, Headcount*) :
    - Variation $\to$ `status.info` ou `status.neutral`.

La fonction universelle `getValenceColor(tokens, direction, metricType)` implémente cette matrice déterministe.

---

### Motif 3 : Écarts, Seuils & Bandes de Tolérance (Contrat de Provenance à 3 Niveaux)
- **Problématique** : Une valeur brute (ex: 85%) n'a de sens que comparée à son objectif (Target = 90%) ou à sa trajectoire historique. Une template ne doit JAMAIS coder en dur des seuils métier arbitraires. La template fournit la **mécanique cognitive**, jamais la valeur du seuil.
- **Contrat de Provenance Déterministe** (Résolution par priorité stricte : `explicit` > `statistical` > `neutral`) :
  1. **Niveau 1 — Explicite (`explicit`)** : L'appelant fournit `{ target, warning, danger }` + `polarity`. Si un objet explicite incomplet est fourni, une erreur explicite est levée (`kit-charts: incomplete explicit thresholds`), interdisant toute complétion silencieuse.
  2. **Niveau 2 — Statistique Dérivé (`statistical`)** : Dérivation déterministe depuis les données brutes seules (autorisé uniquement si $n \ge 5$) :
     - **Méthode $\sigma$ (higher-is-better)** : $\text{target} = \mu$, $\text{warning} = \mu - 1\sigma$, $\text{danger} = \mu - k\sigma$ ($k=2$ par défaut)
     - **Méthode $\sigma$ (lower-is-better)** : $\text{target} = \mu$, $\text{warning} = \mu + 1\sigma$, $\text{danger} = \mu + k\sigma$
       où $\mu = \frac{1}{n}\sum x_i$ et $\sigma = \sqrt{\frac{1}{n-1}\sum (x_i - \mu)^2}$.
     - **Méthode Quantile** : $\text{danger} = Q(0.10)$, $\text{warning} = Q(0.25)$, $\text{target} = Q(0.50)$ (miroir pour `lower-is-better` : $\text{target}=Q(0.50), \text{warning}=Q(0.75), \text{danger}=Q(0.90)$).
       Interpolation quantile : position $h = (n-1) \cdot p$, résultat $= x_{\lfloor h \rfloor} + (h - \lfloor h \rfloor) \cdot (x_{\lceil h \rceil} - x_{\lfloor h \rfloor})$.
  3. **Niveau 3 — Neutre (`neutral`)** : Si $n < 5$ ou aucune donnée n'est fournie, refus du niveau statistique et fallback vers une ligne benchmark neutre sans zones de valence colorée.
- **Règles d'encodage & Double-encodage** :
  - **Ligne de Référence (*Benchmark*)** : Encodée avec `tokens.emphasis.benchmark` (`#475569` ou `#000000`), avec un style en tirets courts (`borderDash: [4, 4]`).
  - **Bandes de Tolérance** :
    - Zone Nominale / Cible atteinte : `status.success`.
    - Zone de Vigilance / Tolérance intermédiaire : `status.warning`.
    - Zone Critique / Danger : `status.danger`.
  - **Badge de Provenance dans le Tooltip** : Double encodage informatif obligatoire : `"Seuil: métier"`, `"Seuil: statistique (μ-2σ)"` ou `"Seuil: N/D"`.
  - La fonction `resolveThresholds(data, explicit, opts)` implémente ce contrat de résolution déterministe.
  - La fonction `getThresholdStatus(value, target, thresholds, polarity, tokens)` calcule la variance numérique, le ratio et la couleur associée.


---

### Motif 4 : Anomalies & Détection d'Outliers
- **Problématique** : Les points aberrants ou ruptures statistiques doivent attirer l'attention pré-attentive sans masquer la distribution globale.
- **Critères statistiques de détection** :
  - Règle de Tukey (Boîte à moustaches) : Valeur $x < Q_1 - 1.5 \cdot \text{IQR}$ ou $x > Q_3 + 1.5 \cdot \text{IQR}$.
  - Règle paramétrique des $2\sigma$ : $|z| = \frac{|x - \mu|}{\sigma} > 2.0$ (ou $3\sigma$ pour anomalies sévères).
- **Règles d'encodage de l'anomalie** :
  - Couleur : `tokens.emphasis.anomaly` (Rouge vif ou Magenta saillant).
  - Forme du glyphe : `pointStyle: 'triangle'` ou `pointStyle: 'rectRot'` avec un rayon élargi (`pointRadius: 6–8`).
  - Contour : Bordure blanche ou fond contrasté (`borderColor: tokens.surfaceRaised`, `borderWidth: 2`) pour découper le point du fond.

---

### Motif 5 : Incertitude, Prévisions & Projections Temporelles
- **Problématique** : L'utilisateur ne doit jamais confondre une mesure empirique passée (certaine) avec une extrapolation budgétaire ou prédictive (incertaine).
- **Règles d'encodage** :
  - **Opacité / Transparence** : Application du token `forecastAlpha` ($0.45 \le \alpha \le 0.60$) sur les surfaces et remplissages prévisionnels.
  - **Style de Ligne** : Trait pointillé ou tireté obligatoire (`borderDash: [5, 5]`).
  - **Forme de Point** : Croix de repérage (`pointStyle: 'crossRot'`) au lieu d'un disque plein.
  - **Ruban de Confiance** : Intervalle de prévision (ex: 80% ou 95%) représenté sous forme de bande d'aire transparente encadrant la médiane.

---

### Motif 6 : Données Manquantes, Incomplètes & Non Disponibles (N/D)
- **Problématique** : Confondre un zéro mesuré ($0.0$) avec une valeur manquante (`null`, `undefined`, `NaN`) constitue une erreur méthodologique majeure.
- **Règles d'encodage** :
  - **Zéro réel ($0.0$)** : Point tracé sur la ligne de base $Y=0$, encodage plein normal.
  - **Donnée Manquante / Non Disponible (`null`)** :
    - Segment de courbe : Trait discontinu très fin (`borderDash: [3, 3]`, couleur `textMuted`).
    - Barre / Rectangle : Remplissage avec motif de hachures à 45° (*diagonal hatching*) ou opacité $\alpha \le 0.15$.
    - Tooltip : Mention explicite `"N/D — Donnée non collectée"` avec formatage tabulaire.

---

## 3. Règle de Double-Encodage Strict (Accessibilité WCAG 2.1 & CVD)

Environ 8% de la population masculine et 0.5% de la population féminine sont affectés par une déficience de vision des couleurs (*Color Vision Deficiency* — deutéranopie, protanopie, tritanopie). De plus, les conditions de consultation mobiles (reflets solaires, écrans en mode nuit) altèrent la perception chromatique.

### 3.1 Règle Fondamentale
> **Aucune information sémantique, directionnelle, statutaire ou quantitative critique ne doit reposer exclusivement sur la couleur.**

Chaque état cognitif doit être encodé sur au moins **deux canaux sensoriels indépendants** :

```
                     MATRICE DE DOUBLE-ENCODAGE UNIVERSEL
┌─────────────────────┬───────────────────┬───────────────────┬───────────────────┬───────────────────┐
│ Rôle Cognitif       │ Canal 1 : Couleur │ Canal 2 : Forme   │ Canal 3 : Trait   │ Canal 4 : Texte   │
├─────────────────────┼───────────────────┼───────────────────┼───────────────────┼───────────────────┤
│ Focal (Hero Series) │ Focal Sémantique  │ Disque plein (●)  │ Trait continu 2px │ Label direct gras │
│ Contexte (Muted)    │ Gris ardoise (90%)│ Petit disque (·)  │ Trait continu 1px │ Légende atténuée  │
│ Benchmark (Cible)   │ Sombre / Neutre   │ Losange (◆)       │ Tiret moyen [4,4] │ Badge "Cible: X"  │
│ Succès (Objectif OK)│ status.success    │ Flèche haut (▲)   │ Ligne continue    │ "+X% (Atteint)"   │
│ Alerte / Danger     │ status.danger     │ Triangle alerte(▲)│ Trait épais rouge │ "-X% (Critique)"  │
│ Anomalie / Outlier  │ emphasis.anomaly  │ Triangle / Étoile │ Halo contrasté    │ "Outlier (>2σ)"   │
│ Prévision (Forecast)│ Forecast Alpha    │ Croix rotative (✕)│ Pointillés [5,5]  │ "Proj. M+1"       │
│ Manquant (No Data)  │ textMuted         │ Carré vide (□)    │ Tirets fins [3,3] │ "N/D"             │
└─────────────────────┴───────────────────┴───────────────────┴───────────────────┴───────────────────┘
```

---

## 4. Arbres de Décision Déterministes pour Agents IA

### 4.1 Arbre 1 : Sélection du Motif d'Accentuation selon l'Intention d'Analyse

```
Intention Analytique de la Visualisation
├── 1. Mettre en valeur 1 élément clé parmi N pairs
│   └── Motif 1 (Focus Narratif 90/10) : Hero = focal (saturé) + (N-1) = context (gris 0.4)
│
├── 2. Évaluer une performance financière ou opérationnelle
│   ├── Métrique de Gain (Chiffre d'affaires, Marge, Conversion)
│   │   └── Motif 2 (Valence Directe) : + = success (vert), - = danger (rouge)
│   └── Métrique de Coût / Risque (Coûts, Churn, Latence, Déchets)
│       └── Motif 2 (Valence Inversée) : + = danger (rouge), - = success (vert)
│
├── 3. Suivre la progression vers un seuil ou KPI
│   └── Motif 3 (Écarts & Seuils) : Ligne cible = benchmark [4,4] + Couleurs success/warning/danger
│
├── 4. Identifier des comportements atypiques ou fraudes
│   └── Motif 4 (Anomalies) : Points > 1.5 IQR en emphasis.anomaly + pointStyle 'triangle'
│
├── 5. Présenter un plan prévisionnel / budget futur
│   └── Motif 5 (Incertitude) : Séries futures avec forecastAlpha (0.5) + borderDash [5,5]
│
└── 6. Gérer des séries avec des trous de collecte
    └── Motif 6 (Données Manquantes) : borderDash [3,3] + badge explicite N/D (pas de point 0)
```

### 4.2 Arbre 2 : Sélection des Tokens Visuels dans `theme-tokens.js`

```
Rôle Visuel dans le Graphique
├── Élément principal à démontrer ───────────► getEmphasisStyle(tokens, 'focal')
├── Ligne d'objectif / Moyenne / N-1 ────────► getEmphasisStyle(tokens, 'benchmark')
├── Séries secondaires de comparaison ───────► getEmphasisStyle(tokens, 'context')
├── Point statistique exceptionnel ──────────► getEmphasisStyle(tokens, 'anomaly')
├── Projection future / Modélisation ────────► getEmphasisStyle(tokens, 'forecast')
├── Valeur nulle / Donnée non disponible ────► getEmphasisStyle(tokens, 'missing')
└── Indicateur de statut métier (KPI) ───────► getValenceColor(tokens, delta, metricType)
```

---

## 5. Spécifications Techniques des 8 Thèmes Cognitifs

Les 8 thèmes de `kit-charts` ont été rigoureusement calibrés pour respecter les ratios de contraste WCAG 2.1 AA/AAA et la résilience universelle aux daltonismes :

```
┌───────────────────────────┬───────────┬─────────────┬───────────┬───────────┬──────────────┬───────────┬───────────┬───────────┬───────────┬───────────┐
│ Thème                     │ Focal     │ Benchmark   │ Context   │ Anomaly   │ ForecastAlpha│ Success   │ Warning   │ Danger    │ Info      │ Neutral   │
├───────────────────────────┼───────────┼─────────────┼───────────┼───────────┼──────────────┼───────────┼───────────┼───────────┼───────────┼───────────┤
│ 01 ColorBrewer Accessible │ #2B8CBE   │ #475569     │ #CBD5E1   │ #D01C8B   │ 0.50         │ #2E7D32   │ #EF6C00   │ #C62828   │ #1565C0   │ #94A3B8   │
│ 02 Viridis Perceptual     │ #26828E   │ #440154     │ #CBD5E1   │ #FDE725   │ 0.50         │ #22A884   │ #D8B400   │ #440154   │ #2A788E   │ #8E9AAF   │
│ 03 Paul Tol Scientific    │ #4477AA   │ #000000     │ #BBBBBB   │ #EE6677   │ 0.50         │ #228833   │ #CCBB44   │ #EE6677   │ #66CCEE   │ #BBBBBB   │
│ 04 Tableau Stone          │ #4E79A7   │ #57606C     │ #BAB0AC   │ #E15759   │ 0.50         │ #59A14F   │ #F28E2B   │ #E15759   │ #4E79A7   │ #BAB0AC   │
│ 05 Okabe-Ito CUD          │ #0072B2   │ #000000     │ #CBD5E1   │ #D55E00   │ 0.50         │ #009E73   │ #E69F00   │ #D55E00   │ #56B4E9   │ #999999   │
│ 06 Tufte Minimalist       │ #1D4ED8   │ #111111     │ #D4D4D4   │ #B91C1C   │ 0.45         │ #15803D   │ #B8860B   │ #B91C1C   │ #1D4ED8   │ #737373   │
│ 07 Nord Dark              │ #88C0D0   │ #ECEFF4     │ #4C566A   │ #BF616A   │ 0.50         │ #A3BE8C   │ #EBCB8B   │ #BF616A   │ #88C0D0   │ #D8DEE9   │
│ 08 Atkinson Hyperlegible  │ #005AB5   │ #000000     │ #A1A1AA   │ #DC3220   │ 0.55         │ #009E73   │ #FE6100   │ #DC3220   │ #005AB5   │ #71717A   │
└───────────────────────────┴───────────┴─────────────┴───────────┴───────────┴──────────────┴───────────┴───────────┴───────────┴───────────┴───────────┘
```

---

## 6. Bibliographie & Normes Internationales de Référence

1. **Bertin, J. (1967)**. *Sémiologie Graphique: Les diagrammes, les réseaux, les cartes*. Gauthier-Villars, Paris.
2. **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception: Theory, Experimentation, and Its Application to the Development of Graphic Methods*. Journal of the American Statistical Association, 79(387), 531–554.
3. **Stevens, S. S. (1957)**. *On the psychophysical law*. Psychological Review, 64(3), 153–181.
4. **Tufte, E. R. (1983)**. *The Visual Display of Quantitative Information*. Graphics Press, Cheshire, CT.
5. **Sweller, J. (1988)**. *Cognitive load during problem solving: Effects on learning*. Cognitive Science, 12(2), 257–285.
6. **Cowan, N. (2001)**. *The magical number 4 in short-term memory: A reconsideration of mental storage capacity*. Behavioral and Brain Sciences, 24(1), 87–114.
7. **Treisman, A. (1985)**. *Preattentive processing in vision*. Computer Vision, Graphics, and Image Processing, 31(2), 156–177.
8. **Ware, C. (2008)**. *Visual Thinking for Design*. Morgan Kaufmann / Elsevier.
9. **Few, S. (2006)**. *Information Dashboard Design: The Effective Visual Communication of Data*. O'Reilly Media.
10. **Okabe, M., & Ito, K. (2008)**. *Color Universal Design (CUD) - How to make figures and presentations that are friendly to Colorblind People*. JFly Data Depository.
11. **Tol, P. (2021)**. *Colour Schemes and Templates*. SRON Technical Note SRON/EPS/TN/09-002, issue 3.2.
12. **Brewer, C. A. (2003)**. *ColorBrewer in Print and on the Web*. Cartographic Perspectives, 45, 78–79.
13. **World Wide Web Consortium (W3C) (2018)**. *Web Content Accessibility Guidelines (WCAG) 2.1*. W3C Recommendation.
14. **Cairo, A. (2019)**. *How Charts Lie: Getting Smarter about Visual Information*. W. W. Norton & Company.
