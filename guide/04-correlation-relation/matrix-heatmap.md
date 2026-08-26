# Fiche Méthodologique : Matrice de Corrélation / Heatmap Matricielle (Correlation Matrix)

> **Catégorie** : 04-correlation-relation  
> **Type Chart.js** : `matrix` (via le plugin officiel `chartjs-chart-matrix`)  
> **Niveau de précision Cleveland & McGill** : RANG 7 (Teinte/Saturation de couleur) combiné au RANG 1 (Position matricielle 2D X, Y) & ÉTIQUETAGE NUMÉRIQUE DIRECT (Précision 100%)  
> **Dernière révision** : 2026-08-13  

---

## 1. Description & Principe visuel

La **matrice de corrélation** (ou *Correlation Matrix Heatmap*) représente sous forme de grille bidimensionnelle les coefficients de corrélation par paire ($r \in [-1.0, +1.0]$, Pearson ou Spearman) entre plusieurs variables quantitatives continues. Chaque cellule à l'intersection de la ligne $i$ et de la colonne $j$ encode la force et la direction du lien entre les variables $X_i$ et $X_j$.

### Encodages visuels mobilisés
1. **Position matricielle 2D ($X_i, Y_j$)** : Identifie le couple de variables analysé à l'intersection de la ligne et de la colonne.
2. **Teinte & Saturation de Couleur (Palette Divergente)** : Encodage qualitatif et d'intensité de la valeur de corrélation $r$ (Rang 7 Cleveland & McGill).
3. **Étiquetage Numérique Direct (Valeur textuelle $r$)** : Affiche la valeur numérique exacte arrondie à 2 décimales dans chaque cellule, compensant totalement l'imprécision perceptive de la couleur.

```
       MATRICE DE CORRÉLATION DIVERGENTE (RANG 7 + ÉTIQUETAGE DIRECT)
              Var A      Var B      Var C      Var D
  Var A   [  +1.00  ] [  +0.85  ] [  -0.62  ] [  +0.12  ]  ◄─ Bleu saturé (+1) à Blanc (0)
  Var B   [  +0.85  ] [  +1.00  ] [  -0.45  ] [  +0.05  ]  ◄─ Bleu moyen / Rose clair
  Var C   [  -0.62  ] [  -0.45  ] [  +1.00  ] [  -0.78  ]  ◄─ Rouge moyen / Rouge saturé (-1)
  Var D   [  +0.12  ] [  +0.05  ] [  -0.78  ] [  +1.00  ]

     ÉCHELLE DE COULEUR DIVERGENTE (ColorBrewer RdBu)
     [ Rouge -1.0 ] ◄─── [ Blanc / Gris 0.0 ] ───► [ Bleu +1.0 ]
      Corrélation          Absence de            Corrélation
    Négative Forte         Corrélation          Positive Forte
```

### Mécanisme Neuro-Cognitif & Triple Encodage
La matrice de corrélation associe de manière optimale trois mécanismes du traitement visuel humain :
- **Détection pré-attentive globale (< 200 ms)** : La teinte et la saturation (Rang 7) permettent au cerveau de repérer instantanément les "blocs" de variables fortement corrélées (zones bleues denses ou rouges denses) sans lire aucun chiffre.
- **Orientation spatiale 2D** : La grille cartésienne permet de localiser sans ambiguïté la paire de variables concernée.
- **Lecture fovéale de précision** : L'impression de la valeur exacte de $r$ en chiffres tabulaires dans la cellule permet une validation analytique rigoureuse, éliminant la marge d'erreur de 20-30% inhérente à l'estimation visuelle d'une couleur seule (Ware, 2008).

---

## 2. Quand l'utiliser (Cas d'usage cibles)

### Types de variables adaptées
- **Axes X et Y** : Liste identique de $N$ variables quantitatives continues (ex: indicateurs financiers, métriques de performance web, paramètres biomédicaux).
- **Valeurs de cellule** : Coefficient de corrélation linéaire de Pearson ($r$) ou de rang de Spearman ($\rho$), borné sur l'intervalle continu $[-1.00, +1.00]$.

### Cas d'usage privilégiés
- **Analyse exploratoire multivariée (EDA)** : Détecter rapidement la structure globale des dépendances au sein d'un grand jeu de données avant modélisation.
- **Détection de multicolinéarité** : Identifier les variables fortement corrélées entre elles ($|r| > 0.80$) pour les supprimer ou les combiner avant de former un modèle de régression linéaire ou logistique.
- **Analyse de portefeuille financier** : Vérifier la diversification d'un portefeuille d'actifs (recherche d'actifs non corrélés $r \approx 0$ ou négativement corrélés $r < 0$).
- **Cardinalité cible** : Idéalement $N \in [4, 25]$ variables (générant une matrice de $16$ à $625$ cellules).

### Questions d'analyse résolues
- *Quelles sont les métriques marketing les plus fortement corrélées avec la conversion des utilisateurs ?*
- *Y a-t-il des redondances massives de variables dans notre base de données ?*
- *Quels sous-groupes de facteurs évoluent de manière strictement opposée ($r \rightarrow -1$) ?*

---

## 3. Quand NE PAS l'utiliser (Contre-indications)

| Situation & Données | Pourquoi la Matrice de Corrélation échoue | Alternative Recommandée |
| :--- | :--- | :--- |
| **Variables qualitatives / nominales purement discrètes** | Le coefficient de Pearson $r$ n'a aucun sens mathématique sur des catégories non ordonnées. | **Tableau de contingence avec Heatmap du V de Cramér** |
| **Relations non linéaires complexes** (ex: parabole $Y = X^2$) | Le coefficient de Pearson mesure uniquement la dépendance *linéaire*. Deux variables liées par une parabole parfaite donneront $r \approx 0.00$. | **Matrice de Nuages de Points (Scatter Plot Matrix / SPLOM)** |
| **Très grand nombre de variables** ($N > 40-50$) | Les cellules deviennent trop petites pour afficher le texte des chiffres ; le texte devient un pâté d'encre illisible. | **Heatmap sans texte avec Dendrogramme de clustering** ou **Graphe de réseau (Network Graph avec seuil $|r| > 0.5$)** |
| **Seulement 2 ou 3 variables quantitatives** | La grille matricielle est inutilement lourde pour évaluer 1 ou 3 paires. | **Scatter Plot 2D** (`scatter-plot.md`) ou **Bubble Chart** (`bubble-chart.md`) |

---

## 4. Règles cognitives & Meilleures pratiques spécifiques

### 4.1 Palette de Couleur Divergente et Point Neutre Central ($r = 0$)
- **RÈGLE ABSOLUE** : Utiliser impérativement une **palette de couleurs divergente** à 3 ancres (ex: **ColorBrewer RdBu** : Bleu pour $+1.00$, Blanc/Gris clair pour $0.00$, Rouge pour $-1.00$).
- **L'Ancre Neutre à 0** : Le point central de la palette ($r = 0.00$) **DOIT** obligatoirement être attribué à une couleur neutre désaturée (blanc `#FFFFFF` ou slate clair `#F8FAFC`). Utiliser une palette séquentielle monotone (ex: du rose clair au rouge sombre) est un anti-pattern majeur qui fait paraître l'absence de corrélation ($r=0$) comme une corrélation négative forte.
- **Sécurité Daltonisme (CVD)** : Éviter absolument les palettes Rouge / Vert pur. Remplacer par **Bleu / Rouge** (RdBu) ou **Violet / Vert-Jaune** (PiYG).

```
[ ÉCHEC : Palette Séquentielle (Génère une fausse hiérarchie) ]  [ SUCCÈS : Palette Divergente (Centre Neutre) ]
  r = -1.0 : Rose très clair                                       r = -1.0 : Rouge vif (Corrélation Négative)
  r =  0.0 : Rouge moyen  ◄── ERREUR : Paraît positif !           r =  0.0 : Blanc neutre (Absence de lien)
  r = +1.0 : Rouge foncé                                           r = +1.0 : Bleu vif (Corrélation Positive)
```

### 4.2 Étiquetage Numérique Direct & Contraste Dynamique du Texte (WCAG AAA)
- **Affichage obligatoire des valeurs** : Chaque cellule doit afficher son coefficient $r$ formaté à 2 décimales (ex: `+0.82`, `-0.45`, `0.00`).
- **Règle du Contraste Dynamique** : La couleur de la police doit basculer automatiquement en fonction de la saturation de la couleur de fond de la cellule (Norme WCAG 4.5:1) :
  - Si $|r| > 0.45$ (fond sombre/saturé) $\rightarrow$ **Texte Blanc (`#FFFFFF`)**.
  - Si $|r| \le 0.45$ (fond clair/neutre) $\rightarrow$ **Texte Sombre (`#0F172A`)**.

### 4.3 Réordonnancement des Lignes et Colonnes (*Hierarchical Clustering*)
Ne jamais conserver l'ordre alphabétique par défaut ou l'ordre brut de la base de données. 
- **Sériation / Clustering Hiérarchique** : Appliquer un algorithme de classification ascendante hiérarchique (CAH / Ward's linkage) pour regrouper les variables fortement corrélées en **blocs contigus** le long de la diagonale principale. Cela transforme une grille désordonnée en "bruit de damier" en une structure visuelle claire composée de blocs homogènes (*clusters*).

### 4.4 Traitement de la Diagonale Principale ($r(X_i, X_i) = 1.00$)
La diagonale principale représente la corrélation de chaque variable avec elle-même, qui vaut trivialement $+1.00$. Pour éviter d'attirer inutilement le regard sur ces cellules sans valeur informative :
- Masquer ou désaturer la diagonale (ex: couleur gris neutre `#E2E8F0` ou symbole `-` sans valeur numérique voyante).

---

## 5. Erreurs fréquentes & Anti-patterns visuels

```
  [ ANTI-PATTERN 1 : Bruit en Damier (Matrice Non Triée) ]   [ ANTI-PATTERN 2 : Texte Noir sur Fond Sombre ]
     Var A  Var B  Var C  Var D                                 Var A  Var B
  A  [ +1 ] [ -0.8] [ +0.9] [ -0.1]                          A  [ +1.00 ] [ -0.85 ]  <- Ilisible !
  B  [ -0.8] [ +1 ] [ -0.7] [ +0.8]                          B  [ -0.85 ] [ +1.00 ]  (WCAG < 2.0:1)
  (Blocs de corrélation invisibles, fouillis visuel)         (Texte noir noyé dans le rouge foncé)
```

1. **Utilisation d'une palette séquentielle unicolore** : Masque le changement de signe entre corrélations positives et négatives.
2. **Matrice non réordonnée (Non triée)** : L'absence de clustering hiérarchique produit un effet de damier aléatoire empêchant la perception des structures de groupe.
3. **Absence de texte numérique dans les cellules** : Oblige l'utilisateur à deviner les valeurs de corrélation par comparaison de teintes (erreur de décodage du Rang 7 pouvant atteindre 30%).
4. **Texte à contraste fixe** : Écrire le texte en noir partout rend les chiffres totalement illisibles sur les cellules bleu foncé ou rouge foncé ($r = \pm 0.90$).
5. **Palettes Rouge/Vert non accessibles** : Rend la distinction entre corrélation positive et négative impossible pour les 8% d'hommes daltoniens.

---

## 6. Recommandations d'implémentation Chart.js

### 6.1 Architecture technique : Plugin officiel `'chartjs-chart-matrix'`
Chart.js ne contient pas de type `matrix` dans son cœur natif. Il faut importer le plugin officiel communautaire **`chartjs-chart-matrix`** (type `'matrix'`).

L'affichage des valeurs numériques dans chaque cellule est pris en charge par le plugin officiel **`chartjs-plugin-datalabels`** avec une fonction de contraste dynamique de couleur.

### 6.2 Structure HTML & Accessibilité (DOM & ARIA)
```html
<div class="chart-container" role="region" aria-label="Matrice de corrélation des métriques de performance" tabindex="0">
  <canvas id="matrixChartCanvas" role="img" aria-label="Matrice de corrélation 5x5. Corrélation positive forte identifiée entre Ventes et Dépenses R&D (r = +0.85)." aria-describedby="matrix-fallback"></canvas>
  <div id="matrix-fallback" class="sr-only">
    <table>
      <caption>Matrice des coefficients de corrélation de Pearson</caption>
      <thead>
        <tr>
          <th scope="col">Variables</th>
          <th scope="col">R&D</th>
          <th scope="col">Ventes</th>
          <th scope="col">Marketing</th>
          <th scope="col">Churn</th>
          <th scope="col">Coût Client</th>
        </tr>
      </thead>
      <tbody>
        <tr><th scope="row">R&D</th><td>+1.00</td><td>+0.85</td><td>+0.42</td><td>-0.58</td><td>-0.12</td></tr>
        <tr><th scope="row">Ventes</th><td>+0.85</td><td>+1.00</td><td>+0.65</td><td>-0.72</td><td>-0.05</td></tr>
        <tr><th scope="row">Marketing</th><td>+0.42</td><td>+0.65</td><td>+1.00</td><td>-0.31</td><td>+0.48</td></tr>
        <tr><th scope="row">Churn</th><td>-0.58</td><td>-0.72</td><td>-0.31</td><td>+1.00</td><td>+0.61</td></tr>
        <tr><th scope="row">Coût Client</th><td>-0.12</td><td>-0.05</td><td>+0.48</td><td>+0.61</td><td>+1.00</td></tr>
      </tbody>
    </table>
  </div>
</div>
```

### 6.3 Style CSS & Typographie Tabulaire (`tabular-nums`)
```css
.chart-container {
  position: relative;
  width: 100%;
  max-width: 650px;
  aspect-ratio: 1 / 1; /* Matrice strictement carrée N x N */
  margin: 0 auto;
  font-family: Inter, system-ui, -apple-system, sans-serif;
  font-variant-numeric: tabular-nums lining-nums;
  font-feature-settings: "tnum" 1, "lnum" 1;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### 6.4 Algorithme JS Matrix Computation & Configuration Chart.js v4+

```javascript
import { Chart } from 'chart.js/auto';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Enregistrement des plugins obligatoires
Chart.register(MatrixController, MatrixElement, ChartDataLabels);

// 1. Algorithme JS de calcul complet de la Matrice de Corrélation de Pearson (N x N)
function computePearsonCorrelationMatrix(multivariateData, variableNames) {
  const numVars = variableNames.length;
  const n = multivariateData.length;

  // Calcul des moyennes et écarts-types pour chaque variable
  const means = new Array(numVars).fill(0);
  for (let i = 0; i < n; i++) {
    for (let v = 0; v < numVars; v++) {
      means[v] += multivariateData[i][variableNames[v]];
    }
  }
  for (let v = 0; v < numVars; v++) {
    means[v] /= n;
  }

  const stdDevs = new Array(numVars).fill(0);
  for (let i = 0; i < n; i++) {
    for (let v = 0; v < numVars; v++) {
      const diff = multivariateData[i][variableNames[v]] - means[v];
      stdDevs[v] += diff * diff;
    }
  }
  for (let v = 0; v < numVars; v++) {
    stdDevs[v] = Math.sqrt(stdDevs[v]);
  }

  // Calcul de la matrice N x N des coefficients r
  const matrix = Array.from({ length: numVars }, () => new Array(numVars).fill(0));
  for (let i = 0; i < numVars; i++) {
    for (let j = 0; j < numVars; j++) {
      if (i === j) {
        matrix[i][j] = 1.0; // Corrélation parfaite avec soi-même
      } else if (i < j) {
        let sumCov = 0;
        const nameI = variableNames[i];
        const nameJ = variableNames[j];
        for (let k = 0; k < n; k++) {
          sumCov += (multivariateData[k][nameI] - means[i]) * (multivariateData[k][nameJ] - means[j]);
        }
        const denom = stdDevs[i] * stdDevs[j];
        const r = denom === 0 ? 0 : sumCov / denom;
        matrix[i][j] = r;
        matrix[j][i] = r; // Matrice symétrique
      }
    }
  }
  return matrix;
}

// 2. Interpolation chromatique divergente ColorBrewer RdBu (Red-White-Blue)
function getDivergingColor(r, isDiagonal = false) {
  if (isDiagonal) return '#F1F5F9'; // Teinte neutre pour la diagonale r = 1.00
  if (r > 0) {
    // Interpolation Blanc (#F8FAFC) vers Bleu (#2166AC)
    const alpha = Math.min(1.0, Math.max(0.0, r));
    return `rgba(33, 102, 172, ${alpha.toFixed(2)})`;
  } else {
    // Interpolation Blanc (#F8FAFC) vers Rouge (#B2182B)
    const alpha = Math.min(1.0, Math.max(0.0, Math.abs(r)));
    return `rgba(178, 24, 43, ${alpha.toFixed(2)})`;
  }
}

// 3. Calcul du contraste dynamique du texte (WCAG 4.5:1)
function getContrastTextColor(r, isDiagonal = false) {
  if (isDiagonal) return '#64748B';
  return Math.abs(r) > 0.45 ? '#FFFFFF' : '#0F172A';
}

// Variables d'étude
const variables = ['R&D', 'Ventes', 'Marketing', 'Churn', 'Coût Client'];

// Jeu de données brut multivarié (40 observations)
const sampleData = Array.from({ length: 40 }, (_, idx) => {
  const rd = 100 + idx * 10 + Math.random() * 20;
  const ventes = rd * 0.85 + Math.random() * 30;
  const mkt = 50 + idx * 5 + Math.random() * 40;
  const churn = 100 - ventes * 0.4 + Math.random() * 10;
  const cost = mkt * 0.5 + Math.random() * 15;
  return { 'R&D': rd, 'Ventes': ventes, 'Marketing': mkt, 'Churn': churn, 'Coût Client': cost };
});

const matrixValues = computePearsonCorrelationMatrix(sampleData, variables);

// Transformation au format plat exigé par chartjs-chart-matrix: { x, y, v, isDiag }
const matrixData = [];
for (let i = 0; i < variables.length; i++) {
  for (let j = 0; j < variables.length; j++) {
    matrixData.push({
      x: variables[j], // Colonnes (Axe X)
      y: variables[i], // Lignes (Axe Y)
      v: matrixValues[i][j],
      isDiag: i === j
    });
  }
}

const config = {
  type: 'matrix',
  data: {
    datasets: [{
      label: 'Matrice de Corrélation',
      data: matrixData,
      backgroundColor: (context) => getDivergingColor(context.raw.v, context.raw.isDiag),
      borderColor: '#FFFFFF',
      borderWidth: 2,
      width: ({ chart }) => (chart.chartArea || {}).width / variables.length - 2,
      height: ({ chart }) => (chart.chartArea || {}).height / variables.length - 2
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1E293B',
        titleFont: { family: 'Inter', size: 13, weight: '600' },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 10,
        cornerRadius: 6,
        callbacks: {
          title: () => 'Coefficient de Corrélation (Pearson)',
          label: (context) => {
            const item = context.raw;
            const sign = item.v > 0 ? '+' : '';
            return ` Pair : ${item.y} ↔ ${item.x} | r = ${sign}${item.v.toFixed(2)}`;
          }
        }
      },
      datalabels: {
        display: true,
        formatter: (value) => {
          if (value.isDiag) return '-';
          const r = value.v;
          const sign = r > 0 ? '+' : '';
          return `${sign}${r.toFixed(2)}`;
        },
        color: (context) => getContrastTextColor(context.raw.v, context.raw.isDiag),
        font: {
          family: 'Inter',
          size: 12,
          weight: '600'
        }
      }
    },
    scales: {
      x: {
        type: 'category',
        labels: variables,
        grid: { display: false },
        ticks: {
          color: '#0F172A',
          font: { family: 'Inter', size: 12, weight: '600' }
        }
      },
      y: {
        type: 'category',
        labels: [...variables].reverse(), // Inversion pour placer le premier élément en haut à gauche
        grid: { display: false },
        ticks: {
          color: '#0F172A',
          font: { family: 'Inter', size: 12, weight: '600' }
        }
      }
    }
  }
};
```

### 6.5 Principes de Déterminisme pour Agents IA
1. **Palette Divergente Obligatoire avec Centre Neutre à $r=0$** : Interdire strictement l'utilisation de palettes monocolores ou séquentielles. L'agent IA doit employer une échelle RdBu (Rouge/Blanc/Bleu) ou PiYG (Violet/Blanc/Vert) où le zéro est représenté par la couleur neutre `#F8FAFC` ou `#FFFFFF`.
2. **Contraste Dynamique du Texte (Garde-fou WCAG)** : Obligation de basculer la couleur de police entre blanc (`#FFFFFF`) pour $|r| > 0.45$ et sombre (`#0F172A`) pour $|r| \le 0.45$.
3. **Seuil d'invalidation (Bascule automatique)** :
   - Si le nombre de variables $N > 40$, masquer les étiquettes textuelles de datalabels et activer un dendrogramme de clustering hiérarchique.
   - Si les variables sont uniquement qualitatives/catégorielles, rejeter le coefficient de Pearson $r$ et utiliser le **V de Cramér** sur tableau de contingence.

---

## Règles Cognitives d'Accentuation & Valence

La Matrice de Corrélation (Correlation Matrix Heatmap) structure les dépendances croisées entre variables. L'accentuation cognitive permet d'orienter le décodage pré-attentif vers les corrélations majeures ou anomalies :

### 1. Hiérarchie Visuelle & Ratio 90/10 (Tufte)
- **Corrélations Modérées ou Neutres (90%)** : Les cellules dont le coefficient $|r| < 0.40$ adoptent des teintes très claires/désaturées proches du blanc/centre neutre, évitant le bruit visuel.
- **Paires Focales d'Intérêt (10%)** : Les dépendances clés (ex: corrélation stratégique entre deux actifs) sont soulignées par une bordure contrastée `tokens.emphasis.focal` (`borderWidth: 2.5`).

### 2. Détection de Décorrélations & Ruptures Inattendues
- **Anomalies de Dépendance** : Une inversion inattendue de corrélation historique (ex: deux actifs historiquement décorrélés qui deviennent fortement corrélés positivement) est mise en exergue avec `tokens.emphasis.anomaly`.
- **Double Encodage Strict** :
  - **Canal 1 (Couleur Divergente)** : Palette divergente symétrique (`tokens.divergent.pos` vs `tokens.divergent.neg`).
  - **Canal 2 (Bordure)** : Cadre d'accentuation épais (`borderWidth: 2.5`).
  - **Canal 3 (Texte Tabulaire)** : Inscription explicite du coefficient signé tabulaire `$r = +0.82$` au centre de la cellule.

### 3. Valence Métier & Directionnalité
- Si la corrélation implique un actif de couverture contre le risque, une corrélation négative forte est valorisée avec `status.success` (protection optimale du portefeuille), tandis qu'une corrélation positive indésirable adopte `status.danger`.

### 4. Exemple d'Implémentation Chart.js v4+ (Accentuation & Valence)

```javascript
import { createChart } from './template.js';
import { getEmphasisStyle, getValenceColor } from '../../themes/theme-tokens.js';

// Matrice multi-actifs avec mise en exergue de la diversification Or/Actions
const portfolioCorrelation = {
  labels: ['Actions US', 'Obligations', 'Or', 'Pétrole'],
  datasets: [{
    label: 'Corrélation Portefeuille',
    data: [
      { x: 'Actions US', y: 'Actions US', v: 1.0 },
      { x: 'Obligations', y: 'Actions US', v: -0.35, role: 'focal' }, // Focus couverture
      { x: 'Or', y: 'Actions US', v: 0.12 },
      { x: 'Pétrole', y: 'Actions US', v: 0.78, role: 'anomaly', isAnomaly: true } // Alerte risque
    ]
  }]
};

// Initialisation avec le thème Paul Tol Scientific
const chart = createChart('myCanvas', portfolioCorrelation, 'paul-tol-scientific');
```

---

## 7. Sources & Références académiques / clés

1. **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception: Theory, Computation, and Application to the Development of Graphic Methods*. Journal of the American Statistical Association, 79(387), 531-554.
   - *Contribution* : Analyse de l'erreur d'estimation des teintes et de la saturation (Rang 7).
2. **Wilkinson, L., & Friendly, M. (2009)**. *The History of the Cluster Heat Map*. The American Statistician, 63(2), 179-184.
   - *Contribution* : Histoire et justification méthodologique du réordonnancement par clustering hiérarchique des matrices.
3. **Ware, C. (2008)**. *Visual Thinking for Design*. Morgan Kaufmann.
   - *Contribution* : Théorie des palettes divergentes et principes d'inhibition latérale de la perception des couleurs.
4. **Brewer, C. A. (2003)**. *ColorBrewer in Print and on the Web*. Cartographic Perspectives, 45, 78-79.
   - *Contribution* : Standardisation des palettes divergentes accessibles (RdBu, PuOr).
5. **Tufte, E. R. (1983)**. *The Visual Display of Quantitative Information*. Graphics Press.
   - *Contribution* : Principes de contiguïté et maximalisation de la densité d'information non redondante.

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Ciblage Matriciel 2D (MacKenzie 1992, ISO 9241-9)
- **Ciblage de Cellule de Corrélation** : Dans une matrice de coefficients symétriques, chaque cellule d'interaction couvre une zone rectangulaire/carrée ($W \times H \approx 30\text{--}50\text{px}$). En appliquant les options spatiales `getSpatialInteractionOptions(tokens, { mode: 'nearest', axis: 'xy', hitRadius: 10, hoverRadius: 5 })`, le curseur active immédiatement la paire de variables la plus proche, ramenant l'Indice de Difficulté de Fitts à $ID \le 2.2\text{ bits}$ ($MT \le 550\text{ms}$).
- **Partition Régulière sans Zone Morte** : Le partitionnement continu garantit que chaque déplacement dans l'espace $(X, Y)$ met en valeur la case correspondante sans latence.

### 2. Réactivité Temporelle & Latences Perceptives (Card-Moran-Newell 1983, Nielsen 1993)
- **Instantanéité Perceptive ($\le 100\text{ms}$)** : Réaction visuelle immédiate au survol (mise en valeur du cadre de la cellule) en $100\text{ms}$ à $60\text{ fps}$.
- **Débounce & Hystérésis Physiologique** : Filtre d'entrée $\Delta t_{\text{enter}} = 80\text{ms}$ neutralisant les clignotements lors de la traversée de la diagonale et rémanence $\Delta t_{\text{exit}} = 150\text{ms}$ stabilisant l'infobulle.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer 2001, Sweller 1988)
- **Auto-Suffisance des *Details-on-Demand*** : L'infobulle détaille le nom des deux variables croisées ($X \times Y$), le coefficient de corrélation exact avec signe et deux décimales au format tabulaire `tokens.fontMono` (`font-variant-numeric: tabular-nums`) et son niveau de significativité.
- **Algorithme Anti-Occlusion Déterministe** : Positionnement via `computeAntiOcclusionTooltipPosition` avec déport vertical de sécurité ($12\text{px}$) et inversion automatique vers le bas ($y < \text{margin}$) pour les cellules de la première rangée.

### 4. Constance d'Objet & Physique des Courbes d'Amorti (Heer & Robertson 2007, Penner 2002)
- **Cinétique Visuelle Contrôlée** : Les changements de variables ou permutations de lignes/colonnes s'exécutent avec `easeOutQuad` ($350\text{ms}$), assurant une transition chromatique douce sans artefact stroboscopique.

### 5. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2 AAA)
- **Conformité SC 2.3.3 (Animation from Interactions)** : Durée ramenée à `0ms` dès détection de `@media (prefers-reduced-motion: reduce)` via `isReducedMotionPreferred()`.
- **Contraste Élevé & Typographie Tabulaire** : Ratios de contraste $\ge 16:1$ dans l'infobulle et contours de cases contrastés avec le fond du thème, conformité WCAG AAA.
