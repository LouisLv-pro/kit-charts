# Fiche Méthodologique : Boîte à Moustaches (Box Plot / Box-and-Whisker Plot / Diagramme de Tukey)

> **Catégorie** : 03-distribution  
> **Type Chart.js** : `boxplot` (via plugin `@sgratzl/chartjs-chart-boxplot`, enregistrement de `BoxPlotController` et `BoxAndWhiskers`)  
> **Niveau de précision Cleveland & McGill** : RANG 1 (Position le long d'une échelle commune pour la Médiane et les Quartiles) & RANG 3 (Longueur 1D pour l'Écart Interquartile IQR et l'étendue des moustaches) — Erreur 3-5%  
> **Dernière révision** : 2026-08-13  

---

## 1. Description & Principe visuel

Le **diagramme en boîte à moustaches** (ou *Box Plot*, inventé par John Tukey en 1977) est le standard statistique universel pour résumer et comparer la distribution empirique d'une variable quantitative à travers plusieurs catégories. Il condense l'information d'un ensemble de données en une représentation visuelle compacte construite sur un **résumé à cinq nombres** (*five-number summary*) non paramétrique : le **Minimum effectif**, le **1er quartile ($Q_1$ / 25ème centile)**, la **Médiane ($Q_2$ / 50ème centile)**, le **3ème quartile ($Q_3$ / 75ème centile)** et le **Maximum effectif**, augmentés des **valeurs aberrantes** (*outliers*) représentées sous forme de points individuels isolés.

```
                  SCHÉMA STRUCTUREL D'UNE BOÎTE À MOUSTACHES DE TUKEY
  Échelle Y (Valeurs Quantitatives Continues)
   80 ┤                                 * Outlier Extrême (> Q3 + 3*IQR)
   70 ┤
   60 ┤                                 o Outlier Modéré (> Q3 + 1.5*IQR)
   50 ┤         ┬ ─── Moustaches Supérieure : Max(x_i <= Q3 + 1.5*IQR)
   40 ┤        ┌┴┐
      ┤        │ │
   30 ┤ ───────┼─┼─────── Q3 (75% / 3ème Quartile)
      ┤        │█│ ◄───── Médiane (Q2 / 50%) ─ Barre centrale appuyée
   20 ┤ ───────┼─┼─────── Q1 (25% / 1er Quartile)
      ┤        └┬┘
   10 ┤         ┴ ─── Moustaches Inférieure : Min(x_i >= Q1 - 1.5*IQR)
    0 ┼─────────┴────────────────────────► Axe X (Catégories Discrètes)
               ◄─ Box Width (IQR = Q3 - Q1) ─►
```

### Fondements Mathématiques & Règle des Moustaches de Tukey ($1.5 \times \text{IQR}$)
Soit un jeu de données ordonné $X = \{x_1, x_2, \dots, x_N\}$ avec $x_1 \le x_2 \le \dots \le x_N$.

1. **Positions des Quartiles** :
   - **Médiane ($Q_2$)** : Valeur centrale séparant la population en deux moitiés égales ($50\%$).
   - **Premier Quartile ($Q_1$)** : $25\%$ des données sont inférieures ou égales à $Q_1$.
   - **Troisième Quartile ($Q_3$)** : $75\%$ des données sont inférieures ou égales à $Q_3$.
2. **Écart Interquartile ($\text{IQR}$)** :
   $$\text{IQR} = Q_3 - Q_1$$
   *La boîte centrale englobe exactement $50\%$ centraux des observations.*
3. **Barrières d'Atypicité (*Fences*) et Moustaches de Tukey** :
   - Barrière inférieure (*Lower Fence*) : $\text{LF} = Q_1 - 1.5 \times \text{IQR}$
   - Barrière supérieure (*Upper Fence*) : $\text{UF} = Q_3 + 1.5 \times \text{IQR}$
   - **Moustache inférieure** : Égale au point de donnée réel le plus petit supérieur ou égal à $\text{LF}$ :
     $$\text{Whisker}_{\text{lower}} = \min \{ x_i \in X \mid x_i \ge Q_1 - 1.5 \times \text{IQR} \}$$
   - **Moustache supérieure** : Égale au point de donnée réel le plus grand inférieur ou égal à $\text{UF}$ :
     $$\text{Whisker}_{\text{upper}} = \max \{ x_i \in X \mid x_i \le Q_3 + 1.5 \times \text{IQR} \}$$
4. **Valeurs Aberrantes (*Outliers*)** :
   - **Outliers modérés** : Toute valeur $x_i$ telle que $x_i < \text{LF}$ ou $x_i > \text{UF}$.
   - **Outliers extrêmes** (Tukey $3 \times \text{IQR}$) : Toute valeur $x_i < Q_1 - 3 \times \text{IQR}$ ou $x_i > Q_3 + 3 \times \text{IQR}$.
5. **Encoche d'Incertitude de la Médiane (*Notch*)** (McGill et al., 1978) :
   $$\text{Notch} = Q_2 \pm 1.58 \times \frac{\text{IQR}}{\sqrt{N}}$$
   *Si les encoches de deux boîtes ne se chevauchent pas, leurs médianes diffèrent de manière statistiquement significative au niveau de confiance d'environ $95\%$.*

### Encodages visuels mobilisés
1. **Position sur échelle commune (Axe Y)** : Emplacement vertical de la médiane, de $Q_1$, $Q_3$, des extrémités des moustaches et des outliers.
2. **Longueur 1D (Hauteur du rectangle)** : Représente directement l'Écart Interquartile $\text{IQR} = Q_3 - Q_1$ (dispersion centrale).
3. **Longueur 1D des moustaches** : Représente la portée des données non aberrantes.
4. **Marques ponctuelles (Glyphes)** : Points isolés pour matérialiser chaque valeur aberrante.

### Mécanisme Neuro-Cognitif
Le Box Plot tire sa puissance cognitive exceptionnelle du principe de **compression d'information**. Plutôt que d'obliger le cerveau à traiter des milliers de points individuels (saturation de la mémoire de travail), il résume la distribution en une figure géométrique simple.
- **Hiérarchie de Cleveland & McGill** : Le décodage repose sur la position sur échelle commune (Rang 1) pour comparer les médianes d'un coup d'œil ($< 200\text{ ms}$).
- **Loi de Clôture (Gestalt)** : Le rectangle englobant $Q_1-Q_3$ crée une figure autonome (*Figure/Ground*) détachée des moustaches.
- **Réduction de la charge extrinsèque (Sweller)** : En condensant $50\%$ des données dans la boîte, le Box Plot limite le nombre d'éléments manipulés à $4 \pm 1$ chunks cognitifs par groupe.

---

## 2. Quand l'utiliser (Cas d'usage cibles)

### Types de variables adaptées
- **Axe horizontal (Axe X)** : Variable qualitative catégorielle (ex: Départements, Serveurs, Canaux de vente, Groupes d'âge, Traitements).
- **Axe vertical (Axe Y)** : Variable quantitative continue (ex: Salaire, Temps d'exécution en ms, Chiffre d'affaires, Pression artérielle).

### Cas d'usage privilégiés
- **Comparaison simultanée de 5 à 20+ distributions** (ex: comparer le temps de latence de 15 microservices). C'est l'outil le plus compact et efficace au monde pour cette tâche.
- **Détection objective et standardisée des anomalies (*Outlier detection*)** sans hypothèse de normalité gaussienne.
- **Évaluation de l'asymétrie (*Skewness*)** : Si la ligne médiane n'est pas au centre de la boîte ou si une moustache est nettement plus longue que l'autre, la distribution est asymétrique.
- **Échantillons de taille modérée à grande** ($N \ge 20-30$ par catégorie).

### Questions d'analyse résolues
- *Quelle catégorie possède la médiane la plus élevée ou la plus basse ?*
- *Quel groupe présente la plus forte variabilité / dispersion interquartile ($\text{IQR}$) ?*
- *Y a-t-il des anomalies extrêmes dans certains départements nécessitant une investigation ?*
- *Les distributions sont-elles symétriques ou étalées vers les hautes valeurs ?*

---

## 3. Quand NE PAS l'utiliser (Contre-indications)

```markdown
| Situation & Données | Pourquoi le Box Plot échoue | Alternative Recommandée |
| :--- | :--- | :--- |
| **Distributions multimodales** (bimodales / deux pics) | Le Box Plot masque complètement les creux et pics multiples, ne montrant qu'un rectangle central trompeur. | **Density Plot** (`density-plot.md`) ou **Violin Plot** |
| **Très petits échantillons** ($N < 15-20$) | Les quartiles calculés sur 5 ou 10 points n'ont aucun sens statistique et donnent une illusion de rigueur. | **Strip Plot** (`strip-plot.md`) ou **Beeswarm Plot** (`beeswarm-plot.md`) |
| **Public grand public sans formation** | La notion de quartile et de $1.5 \times \text{IQR}$ nécessite un apprentissage préalable. | **Bar Chart avec barres d'erreur** ou **Density Plot** annoté |
| **Visualisation d'une seule distribution** ($K = 1$) | Un seul Box Plot laisse trop d'espace vide et n'exploite pas la largeur du graphique. | **Histogramme** (`histogramme.md`) ou **Density Plot** (`density-plot.md`) |
| **Besoin de voir la masse des points individuels** | Le Box Plot agrège $100\%$ des données non aberrantes dans la boîte et les moustaches. | **Strip Plot** (`strip-plot.md`) superposé au Box Plot |
```

---

## 4. Règles cognitives & Meilleures pratiques spécifiques

### 4.1 La Règle Scientifique de Tukey ($1.5 \times \text{IQR}$)
L'agent IA ou le développeur **ne doit jamais** remplacer les moustaches de Tukey par le minimum et le maximum absolus sans faire ressortir les outliers. Étendre les moustaches jusqu'au Min/Max absolu masque les anomalies sous une moustache artificiellement géante et fausse la perception de la dispersion.

```
       MOUSTACHES DE TUKEY (Correcte)              MOUSTACHES MIN/MAX (Anti-Pattern)
  ┌─────────────────────────────────────┐   ┌─────────────────────────────────────┐
  │         * (Outlier isolé)           │   │                                     │
  │         ┬ (Max non-outlier)         │   │         ┬ (Max absolu incluant       │
  │        ┌┴┐                          │   │        │ │  l'outlier)              │
  │        │█│ (Médiane)                │   │        │█│ (Médiane décalée)        │
  │        └┬┘                          │   │        └┬┘                          │
  │         ┴ (Min)                     │   │         ┴ (Min)                     │
  └─────────────────────────────────────┘   └─────────────────────────────────────┘
   Anomalie détectée & dispersion réelle     Outlier masqué, moustache étirée
```

### 4.2 Tri Logique par la Médiane (Cognitive Ordering)
- **Ordre alphabétique = Anti-pattern cognitif** : Ne jamais afficher les catégories dans l'ordre alphabétique brut par défaut.
- **Règle déterministe** : Trier systématiquement les catégories sur l'axe X par ordre **décroissant** (ou croissant) de leur valeur **médiane** ($Q_2$). Cela crée une ligne de tendance visuelle diagonale immédiate permettant au cerveau de classer les groupes en $< 100\text{ ms}$.

### 4.3 Orientation Spatiale & Labels longs
- Si le graphique contient $> 8$ catégories ou si les libellés de catégories dépassent 10 caractères, basculer impérativement la boîte à moustaches en **orientation horizontale** (Catégories sur Y, Valeurs sur X).
- Cela garantit une typographie parfaitement horizontale pour les noms de groupes, évitant l'inclinaison des textes à 45° ou 90° (qui dégrade la vitesse de lecture de $40\%$ à $60\%$).

### 4.4 Palette Chromatique, Accentuation & Saillance
- **Monochromie sémantique** : Utiliser un fond neutre translucide pour les boîtes (`rgba(0, 114, 178, 0.2)`) avec un contour sombre et net (`#0072B2`, `borderWidth: 1.5px`).
- **Ligne Médiane appuyée** : Rendre la ligne médiane pré-attentivement saillante avec une couleur très contrastée et une épaisseur renforcée (`medianColor: '#0F172A'`, `medianWidth: 3px`).
- **Outliers en couleur d'accent** : Colorer les points aberrants avec une teinte d'alerte vive (ex: Rouge Vermillon `#D55E00` ou `#DC2626`) pour capter l'attention pré-attentive immédiatement.

---

## 5. Erreurs fréquentes & Anti-patterns visuels

```
   [ ANTI-PATTERN 1 : Masquage d'une distribution bimodale ]   [ ANTI-PATTERN 2 : Enchevetrement de couleurs arc-en-ciel ]
  Y                                                              Y
 50 ┤        ┌─┐                                                50 ┤   ┌─┐   ┌─┐   ┌─┐   ┌─┐
 40 ┤        │█│ ◄── Masque deux pics distincts à Y=20 et Y=45   40 ┤   │█│   │█│   │█│   │█│  (Chaque boîte
 30 ┤        └─┘                                                30 ┤   └─┘   └─┘   └─┘   └─┘   a une couleur
  0 ┼─────────┴─────────► X                                      0 ┼────┴─────┴─────┴─────┴─► Rouge, Vert, Violet, Jaune)
```

1. **Masquage de bimodalité** : Utiliser un Box Plot sur des données ayant deux populations (ex. salaires de juniors et de seniors) sans vérifier la multimodalité.
2. **Confusion entre Médiane et Moyenne** : Associer la boîte à la moyenne. Si la moyenne est affichée, l'indiquer explicitement par un losange ou un symbole distinct.
3. **Suppression ou masquage des outliers** : Filtrer silencieusement les valeurs extrêmes sous prétexte qu'elles "déforment le graphique". C'est une altération grave de l'intégrité des données.
4. **Utilisation d'une palette arc-en-ciel (*Rainbow Palette*)** : Colorer chaque boîte avec une couleur différente sans signification catégorielle crée un bruit visuel massif qui viole le ratio Data-Ink de Tufte.
5. **Boîtes trop larges ou trop étroites** : Un ratio d'espacement incorrect entre les boîtes détruit la perception de groupement Gestalt. Fixer `itemRadius` et `padding` de façon équilibrée.

---

## 6. Recommandations d'implémentation Chart.js

### 6.1 Architecture technique : Plugin `@sgratzl/chartjs-chart-boxplot`
Chart.js ne prend pas en charge nativement le type `boxplot`. Il est nécessaire d'installer et d'enregistrer le plugin officiel `@sgratzl/chartjs-chart-boxplot`.

**Important** : Lors de l'enregistrement du plugin en ES Modules, il convient d'importer et d'enregistrer explicitement les composants controller et element sous les noms du package : `BoxPlotController` et `BoxAndWhiskers`.

```javascript
import { Chart } from 'chart.js/auto';
import { BoxPlotController, BoxAndWhiskers } from '@sgratzl/chartjs-chart-boxplot';

// Enregistrement obligatoire des composants auprès de Chart.js
Chart.register(BoxPlotController, BoxAndWhiskers);
```

### 6.2 Structure HTML & Accessibilité (DOM & ARIA)
```html
<div class="chart-container" role="region" aria-label="Boîte à moustaches de la distribution du temps de résolution des tickets par équipe" tabindex="0">
  <canvas id="boxplotCanvas" role="img" aria-label="Graphique en boîte à moustaches comparant la distribution des temps de résolution pour 4 équipes. L'équipe Alpha présente la médiane la plus basse à 14.5 heures." aria-describedby="boxplot-fallback"></canvas>
  <div id="boxplot-fallback" class="sr-only">
    <table>
      <caption>Résumé statistique des temps de résolution par équipe (heures)</caption>
      <thead>
        <tr>
          <th scope="col">Équipe</th>
          <th scope="col">Min (h)</th>
          <th scope="col">Q1 (25%)</th>
          <th scope="col">Médiane (Q2)</th>
          <th scope="col">Q3 (75%)</th>
          <th scope="col">Max (h)</th>
          <th scope="col">IQR (h)</th>
          <th scope="col">Outliers</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Équipe Alpha</td><td>8.0</td><td>11.5</td><td>14.5</td><td>18.0</td><td>24.0</td><td>6.5</td><td>35.0, 42.0</td></tr>
        <tr><td>Équipe Beta</td><td>10.0</td><td>15.0</td><td>19.0</td><td>23.5</td><td>30.0</td><td>8.5</td><td>Aucun</td></tr>
        <tr><td>Équipe Gamma</td><td>12.0</td><td>18.0</td><td>24.0</td><td>31.0</td><td>38.0</td><td>13.0</td><td>55.0</td></tr>
        <tr><td>Équipe Delta</td><td>15.0</td><td>22.0</td><td>28.5</td><td>35.0</td><td>44.0</td><td>13.0</td><td>Aucun</td></tr>
      </tbody>
    </table>
  </div>
</div>
```

### 6.3 Style CSS & Micro-Ergonomie (`tabular-nums`)
```css
.chart-container {
  position: relative;
  width: 100%;
  max-width: 850px;
  height: 480px;
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

### 6.4 Configuration Chart.js v4+ avec `@sgratzl/chartjs-chart-boxplot`

```javascript
import { Chart } from 'chart.js/auto';
import { BoxPlotController, BoxAndWhiskers } from '@sgratzl/chartjs-chart-boxplot';

Chart.register(BoxPlotController, BoxAndWhiskers);

// 1. Données brutes par catégorie
const rawDataGroups = {
  'Équipe Alpha': [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 24, 35, 42],
  'Équipe Beta':  [10, 12, 14, 15, 16, 18, 19, 20, 22, 23, 24, 26, 28, 30],
  'Équipe Gamma': [12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 55],
  'Équipe Delta': [15, 18, 20, 22, 24, 27, 30, 32, 34, 36, 38, 40, 44]
};

// 2. Calcul de la médiane pour trier les catégories par ordre croissant/décroissant (Déterminisme IA)
function getMedian(arr) {
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 !== 0 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

// Tri des catégories par médiane croissante
const sortedCategories = Object.keys(rawDataGroups).sort((a, b) => {
  return getMedian(rawDataGroups[a]) - getMedian(rawDataGroups[b]);
});

const sortedData = sortedCategories.map(cat => rawDataGroups[cat]);

// Palettes Okabe-Ito (Bleu principal, Slate pour texte, Vermillon pour Outliers)
const COLOR_BOX_BG = 'rgba(0, 114, 178, 0.25)';
const COLOR_BOX_BORDER = '#0072B2';
const COLOR_MEDIAN = '#0F172A';
const COLOR_OUTLIER = '#D55E00';
const COLOR_TEXT = '#0F172A';

// 3. Configuration Chart.js v4+ Boxplot
const config = {
  type: 'boxplot',
  data: {
    labels: sortedCategories,
    datasets: [{
      label: 'Temps de résolution (heures)',
      data: sortedData, // Accepte directement les tableaux de nombres bruts
      backgroundColor: COLOR_BOX_BG,
      borderColor: COLOR_BOX_BORDER,
      borderWidth: 1.5,
      itemRadius: 4, // Taille des points d'outliers
      itemStyle: 'circle',
      itemBackgroundColor: COLOR_OUTLIER,
      itemBorderColor: '#FFFFFF',
      itemBorderWidth: 1,
      medianColor: COLOR_MEDIAN,
      outlierColor: COLOR_OUTLIER,
      outlierRadius: 4,
      lowerBoxColor: COLOR_BOX_BG,
      padding: 10
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#1E293B',
        titleFont: { family: 'Inter', size: 13, weight: '600' },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 10,
        cornerRadius: 6,
        callbacks: {
          title: (items) => `Groupe : ${items[0].label}`,
          label: (context) => {
            const v = context.parsed;
            if (!v) return '';
            return [
              ` Max effectif : ${v.max} h`,
              ` Q3 (75%)      : ${v.q3} h`,
              ` Médiane (Q2)  : ${v.median} h`,
              ` Q1 (25%)      : ${v.q1} h`,
              ` Min effectif : ${v.min} h`,
              ` Écart IQR    : ${(v.q3 - v.q1).toFixed(1)} h`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Équipes (Triées par Médiane croissante)',
          color: COLOR_TEXT,
          font: { family: 'Inter', size: 12, weight: '600' }
        },
        grid: { display: false },
        ticks: { color: COLOR_TEXT, font: { family: 'Inter', size: 11 } }
      },
      y: {
        beginAtZero: true, // Règle d'or de fidélité
        title: {
          display: true,
          text: 'Temps de résolution (heures)',
          color: COLOR_TEXT,
          font: { family: 'Inter', size: 12, weight: '600' }
        },
        grid: { color: '#F1F5F9' },
        ticks: { color: '#64748B', font: { family: 'Inter', size: 11 } }
      }
    }
  }
};
```

### 6.5 Principes de Déterminisme pour Agents IA
1. **Tri obligatoire des catégories** : L'agent IA doit toujours trier l'axe des catégories par ordre croissant ou décroissant de la médiane ($Q_2$). L'ordre alphabétique non trié est interdit.
2. **Calcul strict des moustaches de Tukey ($1.5 \times \text{IQR}$)** : Interdire la modification arbitraire du facteur de moustaches sans justification statistique explicite.
3. **Guardrail d'invalidation** : Si le nombre d'observations par groupe est $N < 20$, l'agent IA doit rejeter le Box Plot seul et basculer vers un **Strip Plot** (`strip-plot.md`) ou un **Beeswarm Plot** (`beeswarm-plot.md`).

---

## Règles Cognitives d'Accentuation & Valence

Le diagramme en boîte à moustaches (Box Plot) tire sa puissance de la synthèse en 5 nombres de Tukey combinée à une sémiologie d'accentuation ciblée :

### 1. Hiérarchie Visuelle & Ratio 90/10 (Tufte)
- **Groupes de Contexte (90%)** : Les distributions témoins ou secondaires adoptent `tokens.emphasis.context` (`#CBD5E1`), avec une opacité de boîte réduite ($\alpha \approx 0.35$) pour estomper la masse visuelle.
- **Groupe Focal / Hero Cohort (10%)** : Le traitement ou groupe stratégique d'intérêt est mis en exergue avec `tokens.emphasis.focal` (boîte saturée, bordure contrastée `borderWidth: 2`, médiane renforcée).

### 2. Détection d'Outliers & Points Aberrants (Règle de Tukey)
- **Critère Mathématique** : Les points situés hors de l'intervalle $[Q_1 - 1.5 \cdot \text{IQR}, Q_3 + 1.5 \cdot \text{IQR}]$ sont qualifiés d'anomalies.
- **Double Encodage des Outliers** :
  - **Couleur** : `tokens.emphasis.anomaly` (magenta saillant `#D01C8B` ou alerte `#BF616A`).
  - **Forme du Glyphe** : Glyphe géométrique distinct (triangle ou losange) avec liseré contrasté (`borderColor: tokens.surfaceRaised`, `borderWidth: 1.5`) pour se découper de l'arrière-plan.

### 3. Valence Métier & Directionnalité
- Si le biomarqueur ou la métrique représente un coût ou un risque (latence, taux de défaut), un groupe à médiane élevée adopte `tokens.status.danger` (`#C62828`), tandis qu'un groupe à faible dispersion et médiane basse adopte `tokens.status.success` (`#2E7D32`).

### 4. Exemple d'Implémentation Chart.js v4+ (Accentuation & Valence)

```javascript
import { createChart } from './template.js';
import { getEmphasisStyle, getValenceColor } from '../../themes/theme-tokens.js';

// Comparaison d'efficacité clinique avec groupe Hero accentué et détection d'outliers
const clinicalData = {
  labels: ['Contrôle', 'Placebo', 'Traitement Standard', 'Nouveau Candidat (Hero)'],
  datasets: [{
    label: 'Réduction Symptômes (%)',
    data: [
      { min: 10, q1: 18, median: 24, q3: 31, max: 42, outliers: [48], role: 'context' },
      { min: 12, q1: 16, median: 22, q3: 29, max: 38, outliers: [],   role: 'context' },
      { min: 18, q1: 28, median: 36, q3: 44, max: 55, outliers: [],   role: 'context' },
      { min: 32, q1: 45, median: 58, q3: 68, max: 80, outliers: [92], role: 'focal' }
    ]
  }]
};

// Initialisation avec le thème Paul Tol Scientific
const chart = createChart('myCanvas', clinicalData, 'paul-tol-scientific');
```

---

## 7. Sources & Références académiques / clés

1. **Tukey, J. W. (1977)**. *Exploratory Data Analysis*. Addison-Wesley Publishing Company.
   - *Apport* : Invention originale du Box-and-Whisker Plot et formalisation de la règle des moustaches à $1.5 \times \text{IQR}$.
2. **McGill, R., Tukey, J. W., & Larsen, W. A. (1978)**. *Variations of Box Plots*. The American Statistician, 32(1), 12-16.
   - *Apport* : Introduction des encoches (*Notches*) pour les tests de comparaison visuelle de médianes et boîtes à largeur variable selon $N$.
3. **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception: Theory, Experimentation, and Application to the Development of Graphic Methods*. JASA, 79(387), 531-554.
   - *Apport* : Évaluation de la précision visuelle des positions sur échelle commune et de la longueur 1D.
4. **Tufte, E. R. (1983)**. *The Visual Display of Quantitative Information*. Graphics Press.
   - *Apport* : Concepts de Data-Ink ratio, réduction du bruit visuel et dérivation de Box Plots minimalistes.
5. **Wickham, H., & Stryjewski, L. (2011)**. *40 years of boxplots*. Technical Report, Hadley Wickham.
   - *Apport* : Rétrospective critique sur l'évolution du Box Plot, ses variantes informatiques et ses limites sur les distributions multimodales.
6. **Kampstra, P. (2008)**. *Beanplot: A Boxplot Alternative for Visual Comparison of Distributions*. Journal of Statistical Software, 28(1), 1-9.
   - *Apport* : Analyse comparative entre Box Plots, Strip Plots et Density Plots.

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Ciblage Spatial 2D (MacKenzie 1992, ISO 9241-9)
- **Zone d'Attraction Optimisée ($W_e$)** : L'acquisition motrice d'une boîte ou d'un outlier ($2r = 5\text{px}$) à une amplitude $D = 320\text{px}$ requiert un temps moteur initial $MT \approx 1350\text{ms}$ ($ID \approx 6.02\text{ bits}$). En appliquant les options spatiales `getSpatialInteractionOptions(tokens, { mode: 'nearest', axis: 'xy', hitRadius: 14, hoverRadius: 7 })`, la surface effective de pointage atteint $W_e = 33\text{px}$, ramenant $ID$ à $3.42\text{ bits}$ ($MT \approx 815\text{ms}$), soit un gain de **$39.6\%$** d'efficacité motrice.
- **Partition Cartésienne Continue** : Le mode `nearest` en coordonnées $XY$ sans intersection stricte permet de survoler les résumés statistiques (IQR, Médiane, Moustaches) sans exiger une précision au pixel près sur la ligne médiane.

### 2. Réactivité Temporelle & Latences Perceptives (Card-Moran-Newell 1983, Nielsen 1993)
- **Instantanéité Perceptive ($\le 100\text{ms}$)** : Réaction visuelle de focus de la boîte et surbrillance des valeurs repères sous les $100\text{ms}$ ($60\text{ fps}$).
- **Débounce & Hystérésis Physiologique** : Délai d'entrée $\Delta t_{\text{enter}} = 80\text{ms}$ neutralisant les clignotements lors des mouvements de balayage oculaire et délai d'extinction $\Delta t_{\text{exit}} = 150\text{ms}$ prévenant la fermeture intempestive lors des micro-tremblements musculaires ($8\text{--}12\text{ Hz}$).

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer 2001, Sweller 1988)
- **Auto-Suffisance des *Details-on-Demand*** : L'infobulle détaille la synthèse complète de Tukey (Max, $Q_3$, Médiane, $Q_1$, Min, liste des outliers) avec un alignement strict des chiffres grâce à la typographie tabulaire `tokens.fontMono` (`font-variant-numeric: tabular-nums`).
- **Algorithme Anti-Occlusion Déterministe** : Positionnement via `computeAntiOcclusionTooltipPosition` avec inversion de quadrant vertical vers le bas en cas de collision avec le haut du canvas ($y < \text{margin}$) et clamping latéral strict.

### 4. Constance d'Objet & Physique des Courbes d'Amorti (Heer & Robertson 2007, Penner 2002)
- **Transitions Amorties Déterminées** : Les réordonnancements de catégories et ajustements d'échelle s'exécutent avec une courbe `easeOutQuart` ($400\text{ms}$) ou `easeOutCubic` ($350\text{ms}$) garantissant un arrêt net sans vibration sous-amortie ($\zeta = 1.0$), prévenant la cécité au changement (*Change Blindness*).

### 5. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2 AAA)
- **Conformité SC 2.3.3 (Animation from Interactions)** : Désactivation instantanée des transitions (`duration: 0`) sous `@media (prefers-reduced-motion: reduce)` via `isReducedMotionPreferred()`.
- **Contraste Élevé & Typographie Tabulaire** : Ratios de contraste $\ge 16:1$ pour le texte d'infobulle et $\ge 3:1$ pour les bordures de boîte et moustaches, conformité WCAG AAA.
