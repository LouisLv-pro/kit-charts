# Fiche Méthodologique : Diagramme en Barres Empilées 100% (100% Stacked Bar Chart)

> **Catégorie** : Composition / Part-to-Whole  
> **Type Chart.js** : `bar` (avec `stacked: true` et normalisation 100%)  
> **Niveau de précision Cleveland & McGill** : RANG 1 (Ligne de base : Position sur échelle commune) / RANG 3 (Segments internes : Longueur non alignée) — Erreur 4–8%  
> **Dernière révision** : 2026-08-13  

---

## 1. Description & Principe visuel

Le **diagramme en barres empilées 100%** (ou *100% Stacked Bar Chart*) représente la composition relative sous forme de segments rectangulaires normalisés dont la somme cumulée pour chaque barre s'élève exactement à **$100\%$**. Il permet de comparer simultanément la répartition interne de plusieurs séries ou groupes sans biais lié aux variations de volumes totaux absolus.

### Encodages visuels mobilisés
1. **Position sur échelle commune (Segment de base)** : Le premier segment ancré sur la ligne de base zéro bénéficie d'une évaluation par position ($Y=0$ ou $X=0$).
2. **Longueur 1D de segment (Segments internes)** : La proportion $p_i$ de chaque sous-catégorie détermine la longueur relative du segment rectangulaire.
3. **Longueur totale constante ($100\%$)** : Toutes les barres ont une longueur identique normalisée à $100\%$, éliminant le biais de taille globale.
4. **Teinte / Couleur séquentielle ou divergente** : Identification des catégories composantes.

```
            COMPOSITION RELATIVE PAR GROUPE NORMALISÉE À 100%
  100% ┼──────────────────────────────────────────────────┐
       │ ┌───────────────┐  ┌───────────────┐  ┌────────┐ │
   75% ┤ │ Segment C     │  │ Segment C     │  │Seg. C  │ │  ◄── Segment supérieur
       │ │ (25%)         │  │ (35%)         │  │(15%)   │ │      (Non aligné)
   50% ┤ ├───────────────┤  ├───────────────┤  ├────────┤ │
       │ │ Segment B     │  │ Segment B     │  │Seg. B  │ │  ◄── Segment intermédiaire
   25% ┤ │ (35%)         │  │ (25%)         │  │(35%)   │ │      (Longueur non alignée)
       │ ├───────────────┤  ├───────────────┤  ├────────┤ │
    0% ┴─┴───────────────┴──┴───────────────┴──┴────────┴─┴─► X (Groupes)
         │ Segment A     │  │ Segment A     │  │Seg. A  │
         │ (40%)         │  │ (40%)         │  │(50%)   │    ◄── Segment de base (Rang 1)
         └───────────────┘  └───────────────┘  └────────┘        Ancré sur la ligne zéro
              Groupe 1           Groupe 2       Groupe 3
```

### Mécanisme Neuro-Cognitif
Le diagramme 100% empilé combine deux niveaux de perception quantitative selon la hiérarchie de Cleveland & McGill (1984) :
- **Segment de base (Rang 1)** : La première catégorie appuyée sur la ligne de base $0\%$ est évaluée avec la plus haute précision (erreur $< 5\%$), car son sommet correspond directement à une position sur une échelle commune.
- **Segments intermédiaires et supérieurs (Rang 3)** : Les catégories empilées au-dessus ne partagent pas de ligne de base commune. L'œil doit évaluer leur longueur 1D relative par comparaison non alignée (erreur de $6\%$ à $9\%$).

Selon Spence & Lewandowsky (1991), le bar chart empilé 100% surpasse très nettement les diagrammes circulaires multiples (*Multi-pie charts*) lorsqu'il s'agit de comparer la part relative de plusieurs groupes. La normalisation à $100\%$ annule la charge cognitive liée à la conversion mentale des totaux absolus variables.

---

## 2. Quand l'utiliser (Cas d'usage cibles)

### Types de variables adaptées
- **Groupes (Axe X/Y)** : Variable qualitative nominale ou ordinale (ex: régions, tranches d'âge, trimestres).
- **Sous-catégories (Légende/Empilement)** : Variable qualitative à faible cardinalité ($2 \le K \le 5$).
- **Valeurs (Métriques)** : Variables quantitatives continues normalisées en pourcentages dont la somme par groupe égale 100%.

### Cas d'usage privilégiés
- **Comparaison de parts de marché régionales** (ex: *Part relative d'Android vs iOS dans 5 pays différents*).
- **Analyse de résultats d'enquêtes d'opinion (Échelle de Likert)** (ex: *Répartition Tout à fait d'accord $\rightarrow$ Pas du tout d'accord sur 10 questions*).
- **Évolution de la structure des coûts** (ex: *Répartition % R&D / Ventes / Admin au cours des 5 dernières années*).

### Questions d'analyse résolues
- *Comment la composition interne d'un phénomène varie-t-elle d'un groupe à l'autre ?*
- *Quelle est la part relative du segment principal à travers les différentes entités ?*

---

## 3. Quand NE PAS l'utiliser (Contre-indications)

```markdown
| Situation & Données | Pourquoi le 100% Stacked Bar échoue | Alternative Recommandée |
| :--- | :--- | :--- |
| **Comparaison des volumes absolus** | La normalisation à 100% masque totalement les écarts de taille globale entre groupes. | **Stacked Bar Chart standard** ou **Grouped Bar Chart** |
| **Trop de sous-segments empilés** ($K > 5$) | Les segments intérieurs deviennent très étroits, créant de la confusion visuelle. | **Facet Bar Chart** ou **Treemap** |
| **Valeurs négatives** | L'empilement à 100% casse lorsqu'il y a un mélange de valeurs positives et négatives. | **Diverging Bar Chart** |
| **Catégorie clé en position intermédiaire** | Les segments du milieu sont difficiles à comparer en raison de l'absence de ligne de base fixe. | Déplacer la catégorie clé sur le **segment de base ($Y=0$)** |
```

---

## 4. Règles cognitives & Meilleures pratiques spécifiques

### 4.1 Placement Stratégique de la Catégorie Clé en Base ($0\%$)
Placer impérativement la sous-catégorie la plus importante (celle qui répond à la question d'analyse principale) sur la **ligne de base zéro** (le tout premier segment). Elle bénéficiera du Rang 1 de Cleveland & McGill (position sur échelle commune) pour une précision de lecture optimale.

### 4.2 Limite d'Empilement ($K \le 4-5$)
Ne jamais empiler plus de **4 à 5 sous-catégories** par barre. Au-delà, l'incertitude sur les longueurs non alignées des segments intermédiaires provoque une dégradation sévère des performances cognitives (Sweller, 1988).

### 4.3 Palettes Chromatiques Sémantiques
- **Données Qualitatives Distintes** : Utiliser une palette catégorielle accessible (ex: Okabe-Ito).
- **Données Ordinales / Likert** : Utiliser impérativement une **palette divergente** (ex: Bleu pour Accord $\rightarrow$ Gris pour Neutre $\rightarrow$ Rouge/Orange pour Désaccord) ou séquentielle (ColorBrewer).
- Ajouter un liseré fin blanc (`#FFFFFF`, $1\text{px}$) entre les segments empilés.

### 4.4 Étiquetage Direct Intérieur
Si les barres sont suffisamment larges, inscrire les pourcentages ($XX\%$) **directement à l'intérieur des segments** en typographie tabulaire contrastée (Blanc sur fond sombre, Sombre sur fond clair). Masquer les étiquettes si le segment $< 6\%$.

### 4.5 Mobilisation des Principes de la Gestalt
Le traitement perceptif du diagramme en barres empilées 100% repose de manière fondamentale sur la théorie de la **Gestalt** et ses lois d'organisation visuelle :
- **Loi de Proximité** : Les segments empilés verticalement (ou horizontalement) au sein d'un même rectangle enveloppe sont perçus comme un tout unifié associé à un groupe ou une entité spécifique.
- **Loi de Similitude (Similarité)** : La répétition d'une même couleur pour une sous-catégorie à travers l'ensemble des barres permet au cerveau de les associer immédiatement comme une série comparable sans réinterroger la légende.
- **Loi de Clôture** : La structure englobante rectangulaire fermée (normalisée à 100%) et la présence de liserés fins (`#FFFFFF`, 1px) incitent l'esprit à percevoir chaque tranche comme une sous-région fermée d'un tout indivisible.
- **Loi de Continuité** : Les alignements horizontaux des frontières de segments entre barres contiguës créent des lignes de force perceptives aidant l'œil à déceler les évolutions de proportion.
- **Loi de Destin commun** : En contexte d'interaction dynamique (survol, filtrage ou animation), le déplacement synchrone des segments d'une barre confirme leur appartenance au même groupe de données.

### 4.6 Accessibilité et Normes de Contraste WCAG 2.1/2.2
Afin de garantir un accès universel aux données (conformité **WCAG 2.1** et **WCAG 2.2** aux niveaux AA et AAA) :
- **Objets graphiques et séparateurs de segments (Contraste $\ge 3:1$)** : En vertu du critère WCAG 2.1 (1.4.11 Objets non textuels), un ratio de contraste d'au moins **3:1** doit être respecté entre chaque segment empilé et les segments adjacents ou l'arrière-plan. Un liseré blanc (`#FFFFFF`) de 1px permet d'isoler visuellement les nuances proches.
- **Textes d'étiquettes directes et éléments d'axe (Contraste $\ge 4.5:1$ / $7:1$)** : Le texte inscrit au cœur des segments ou sur les axes doit atteindre un ratio de contraste minimal de **4.5:1** pour le niveau AA (WCAG 1.4.3 - Texte normal) et **7:1** pour le niveau AAA. Basculer l'écriture en blanc (`#FFFFFF`) sur fond sombre et en sombre (`#0F172A`) sur fond clair.
- **Support ARIA et alternatives textuelles** : Le graphique doit comporter un conteneur accessible avec `role="region"`, `aria-label`, un élément `<canvas>` avec `role="img"` et un tableau HTML alternatif structuré masqué sous la classe `.sr-only` pour les lecteurs d'écran.

---

## 5. Erreurs fréquentes & Anti-patterns visuels

```
   [ ANTI-PATTERN 1 : Désordre des Segments Intérieurs ]   [ ANTI-PATTERN 2 : Empilement Excessif (> 6 Couleurs) ]
  100% ┤ ┌──────┐ ┌──────┐                                100% ┤ ┌──┬──┬──┬──┬──┬──┐
       │ │ C (20│ │ B (40│                                     │ │1 │2 │3 │4 │5 │6 │  (Effet "Salade de fruits"
   50% ┤ ├──────┤ ├──────┤                                 50% ┤ ├──┼──┼──┼──┼──┼──┤   incomparable)
       │ │ B (50│ │ C (10│                                     │ │  │  │  │  │  │  │
    0% ┴─┴──────┴─┴──────┴─►                                0% ┴─┴──┴──┴──┴──┴──┴─►
        (Ordre de l'empilement inversé d'une barre à l'autre :   (Surcharge cognitive extrinsèque massive)
         Ligne de base détruite)
```

1. **Permutation de l'Ordre des Segments** : Changer l'ordre d'empilement des sous-catégories d'une barre à l'autre. Rend toute comparaison impossible.
2. **Omission de la Normalisation à 100%** : Présenter des barres empilées de hauteurs différentes en prétendant comparer des proportions relatives.
3. **Empilement de plus de 5 Segments ("Salade de fruits")** : Multiplier les tranches colorées, détruisant la lisibilité des couches médianes.
4. **Couleurs Arc-en-Ciel pour Échelle Ordinale** : Utiliser des teintes qualitatives au lieu d'une palette séquentielle/divergente sur un questionnaire de satisfaction.
5. **Absence d'affichage du Pourcentage** : Contraindre l'utilisateur à effectuer des soustractions d'axes pour trouver la valeur d'un segment intermédiaire.

---

## 6. Recommandations d'implémentation Chart.js

### 6.1 Architecture technique : Type natif vs Plugins communautaires
Le diagramme en barres empilées 100% s'appuie sur le type natif **`bar`** de Chart.js en activant la propriété `stacked: true` sur les axes $X$ et $Y$, combiné avec une pré-normalisation des valeurs en pourcentages (ou un plugin de normalisation). L'étiquetage direct est assuré par **`chartjs-plugin-datalabels`**.

### 6.2 Structure HTML & Accessibilité (DOM & ARIA)

```html
<div class="chart-container" role="region" aria-label="Diagramme 100% empilé des parts de marché régionales 2026" tabindex="0">
  <canvas id="stacked100Canvas" role="img" aria-label="Graphique en barres empilées 100% montrant la répartition des ventes par canal dans 3 régions. Le canal Digital est leader à 50% en Europe." aria-describedby="stacked100-fallback"></canvas>
  <div id="stacked100-fallback" class="sr-only">
    <table>
      <caption>Composition des ventes par région et par canal (100%)</caption>
      <thead>
        <tr>
          <th scope="col">Région</th>
          <th scope="col">Ventes Directes (%)</th>
          <th scope="col">Partenaires (%)</th>
          <th scope="col">Digital (%)</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Europe</td><td>25,0%</td><td>25,0%</td><td>50,0%</td></tr>
        <tr><td>Amériques</td><td>40,0%</td><td>30,0%</td><td>30,0%</td></tr>
        <tr><td>Asie-Pacifique</td><td>20,0%</td><td>50,0%</td><td>30,0%</td></tr>
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
  max-width: 800px;
  height: 420px;
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

### 6.4 Configuration standard baseline (Chart.js v4+ Bar Stacked 100%)

```javascript
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Palette Okabe-Ito pour 3 canaux
const COLOR_DIGITAL = '#0072B2';    // Bleu (Segment de base - Prioritaire)
const COLOR_PARTNERS = '#D55E00';   // Vermillon (Segment intermédiaire)
const COLOR_DIRECT = '#009E73';     // Vert (Segment supérieur)

const regions = ['Europe', 'Amériques', 'Asie-Pacifique'];

const config = {
  type: 'bar',
  plugins: [ChartDataLabels],
  data: {
    labels: regions,
    datasets: [
      // Dataset 1 : Segment de base à Y=0 (Rang 1 Cleveland & McGill)
      {
        label: 'Canal Digital (%)',
        data: [50, 30, 30],
        backgroundColor: COLOR_DIGITAL,
        borderColor: '#FFFFFF',
        borderWidth: 1
      },
      // Dataset 2 : Segment intermédiaire
      {
        label: 'Ventes Partenaires (%)',
        data: [25, 30, 50],
        backgroundColor: COLOR_PARTNERS,
        borderColor: '#FFFFFF',
        borderWidth: 1
      },
      // Dataset 3 : Segment supérieur
      {
        label: 'Ventes Directes (%)',
        data: [25, 40, 20],
        backgroundColor: COLOR_DIRECT,
        borderColor: '#FFFFFF',
        borderWidth: 1
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'x', // Barres verticales (ou 'y' pour horizontales)
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#0F172A',
          font: { family: 'Inter', size: 12, weight: '500' },
          usePointStyle: true
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#1E293B',
        titleFont: { family: 'Inter', size: 13, weight: '600' },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 10,
        callbacks: {
          label: (context) => ` ${context.dataset.label}: ${context.parsed.y}%`
        }
      },
      datalabels: {
        color: '#FFFFFF',
        font: { family: 'Inter', size: 11, weight: '700' },
        formatter: (value) => value >= 8 ? `${value}%` : '' // N'affiche que si >= 8%
      }
    },
    scales: {
      x: {
        stacked: true, // Activation de l'empilement X
        grid: { display: false },
        ticks: { color: '#0F172A', font: { family: 'Inter', size: 12, weight: '500' } }
      },
      y: {
        stacked: true, // Activation de l'empilement Y
        min: 0,
        max: 100, // Garantie de la graduation 100%
        grid: { color: '#F1F5F9' },
        ticks: {
          color: '#64748B',
          font: { family: 'Inter', size: 11 },
          callback: (value) => `${value}%`
        }
      }
    }
  }
};
```

---

## 7. Sources & Références académiques / clés

1. **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception: Theory, Computation, and Application to the Development of Graphic Methods*. Journal of the American Statistical Association, 79(387), 531-554.
   - *Apport* : Distinction fondatrice entre la précision de position du segment de base (Rang 1) et des segments non alignés (Rang 3).
2. **Spence, I., & Lewandowsky, S. (1991)**. *Displaying Proportions and Percentages*. Applied Cognitive Psychology, 5(1), 61-77.
   - *Apport* : Preuve expérimentale de la supériorité des barres empilées 100% sur les diagrammes circulaires multiples.
3. **Heiberger, R. M., & Robbins, N. B. (2014)**. *Design of Diverging Stacked Bar Charts for Likert Scales and Other Applications*. Journal of Statistical Software, 57(5), 1-32.
   - *Apport* : Directives d'utilisation des barres empilées 100% et divergentes pour l'analyse d'enquêtes d'opinion.
4. **Tufte, E. R. (1983)**. *The Visual Display of Quantitative Information*. Graphics Press.
   - *Apport* : Principes de clarté visuelle et d'élimination du bruit d'empilement.
5. **Sweller, J. (1988)**. *Cognitive Load Theory During Learning: Measures and Classroom Applications*. Cognitive Science, 12(2), 257-285.
   - *Apport* : Limites de la mémoire de travail appliquées à la restriction du nombre de tranches empilées ($K \le 5$).

---

## Règles Cognitives d'Accentuation & Valence

### 1. Hiérarchie Visuelle (Ratio 90/10 de Tufte & Focus Narratif)
- **Segment Focal Basal** : Positionner le segment d'intérêt primaire (ex: "Succès" ou "Satisfaction Positive") à la base de la pile (aligné sur $Y=0$), encodé avec la teinte focale vive `tokens.emphasis.focal`.
- **Atténuation des Segments Intermédiaires** : Les catégories intermédiaires (ex: "Neutre / En cours") utilisent une nuance de gris de contexte `tokens.emphasis.context`.

### 2. Valence Métier & Directionnalité (Gain vs Coût/Risque/Churn)
- **Décomposition d'états d'avancement / enquêtes Likert** :
  - Segment Succès / Accord : `status.success` via `getValenceColor(tokens, 1, 'gain')`.
  - Segment Échec / Désaccord / Risque : `status.danger` via `getValenceColor(tokens, 1, 'cost')`.
  - Segment Neutre : `status.neutral` (`#94A3B8`).

### 3. Matrice de Double-Encodage Strict
- **Décodage direct sans charge mnésique** :
  - Ordre de légende inversé : Aligner l'ordre vertical de la légende avec l'ordre réel d'empilement des barres (`legend.reverse: true`).
  - Segments à risque : Teinte d'alerte `tokens.emphasis.anomaly` ou hachures / bordure délimitée.
  - Normalisation stricte : Plafond fixe à `max: 100` avec suffixes `%` explicites sur l'axe et dans les tooltips.

### 4. Exemple d'Implémentation Pratique

```javascript
import { createChart } from './template.js';
import { getThemeTokens, getValenceColor } from '../../themes/theme-tokens.js';

const tokens = getThemeTokens('colorbrewer-accessible');

const customData = {
  labels: ['Équipe A', 'Équipe B', 'Équipe C', 'Équipe D'],
  datasets: [
    {
      label: 'Succès (Gain)',
      data: [75, 60, 82, 90],
      backgroundColor: getValenceColor(tokens, 1, 'gain')
    },
    {
      label: 'En cours (Neutre)',
      data: [15, 25, 10, 5],
      backgroundColor: tokens.status?.neutral || '#94A3B8'
    },
    {
      label: 'Échec (Risque)',
      data: [10, 15, 8, 5],
      backgroundColor: getValenceColor(tokens, 1, 'cost')
    }
  ]
};

const chart = createChart('chartCanvas', customData, 'colorbrewer-accessible');
```

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Modélisation de la Cible Interactive (Fitts 1954, MacKenzie 1992)
- **Formulation mathématique formelle** : Le temps d'acquisition motrice pour inspecter la composition relative d'une colonne s'exprime selon le modèle Shannon-MacKenzie :
  $$MT = a + b \cdot \log_2\left(\frac{D}{W_e} + 1\right)$$
- **Attraction 1D de la colonne 100%** : En configurant `mode: 'index'`, `axis: 'x'`, `intersect: false`, l'utilisateur survole l'intégralité de la bande verticale normalisée ($W_e = W_{\text{colonne}}$), déclenchant l'infobulle comparant tous les pourcentages contributifs.
- **Gain psychomoteur mesuré** : Réduction de $ID$ de $4.5\text{ bits}$ à $1.2\text{ bit}$ (gain d'acquisition de **$> 45\%$**).

### 2. Seuils Temporels & Model Human Processor (Card, Moran, Newell 1983 ; Nielsen 1993)
- **Constantes MHP** : Cycle perceptif $\tau_p \approx 100\text{ms}$, cycle cognitif $\tau_c \approx 70\text{ms}$, cycle moteur $\tau_m \approx 70\text{ms}$.
- **Feedback de colonne $\le 100\text{ms}$** : Rehaussement simultané des sous-segments empilés avec `hover.animationDuration: 100ms`.
- **Dynamique d'infobulle** :
  - Débounce d'entrée : $70\text{ms}$.
  - Hystérésis de maintien : $150\text{ms}$.
  - Fondu d'opacité : $120\text{ms}$ en `easeOutQuad`.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer 2001, Sweller 1988)
- **Principe de Contiguïté Spatiale (Mayer 2001)** : L'infobulle déploie la liste des parts relatives avec leur libellé de série et pourcentage exact, éliminant les allers-retours vers la légende.
- **Anti-Occlusion déterministe** : Positionnement à mi-hauteur ou au sommet de la colonne avec inversion de quadrant près des bords.
- **Structure cognitive *Details-on-Demand*** :
  1. Catégorie / Équipe / Cohorte (Sans-serif 12px, Weight 600).
  2. Pourcentages contributifs classés dans l'ordre d'empilement (`fontMono` 12px, `tabular-nums`).
  3. Somme normalisée de contrôle ($100.0\%$).

### 4. Cinématique des Courbes d'Amorti & Constance d'Objet (Penner 2002, Heer & Robertson 2007)
- **Rendu initial standard** : Durée $400\text{ms}$ en `easeOutQuart` ($s(t) = 1 - (1 - t)^4$). Érection ordonnée de la pile jusqu'au plafond $100\%$ avec amorti asymptotique.

### 5. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2 AAA)
- **Conformité SC 2.3.3** : Prise en charge immédiate de `prefers-reduced-motion: reduce` $\implies$ `duration: 0`, `animation: false`.
- **Contraste inter-segments SC 1.4.11** : Bordure de séparation de 1px entre strates pour isoler les couleurs adjacentes.


