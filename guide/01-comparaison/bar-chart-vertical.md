# Fiche Méthodologique : Diagramme en Barres Verticales (Bar Chart / Column Chart)

> **Catégorie** : 01-comparaison  
> **Type Chart.js** : `bar` (avec `indexAxis: 'x'`)  
> **Niveau de précision Cleveland & McGill** : RANG 1 (Position le long d'une échelle commune) — Erreur 3-5%  
> **Dernière révision** : 2026-08-13  

---

## 1. Description & Principe visuel

Le **diagramme en barres verticales** (ou *Column Chart*) est le modèle canonique de la comparaison quantitative entre catégories discrètes. Il représente des variables qualitatives (nominales ou ordinales) sur l'axe horizontal ($X$) et des variables quantitatives continues sur l'axe vertical ($Y$).

### Encodages visuels mobilisés
1. **Position sur une échelle commune (Axe Y)** : Le sommet de chaque barre est positionné le long d'un axe gradué continu partageant une ligne de base zéro unique.
2. **Longueur / Hauteur 1D** : La grandeur numérique est encodée par la hauteur de la barre rectangulaire.
3. **Alignement spatial disjonctif (Axe X)** : Chaque barre occupe un intervalle spatial discret distinct, matérialisant la séparation logique entre les catégories.

```
       POSITIONS ET LONGUEURS SUR ÉCHELLE COMMUNE (Y)
  Y
 100 ┤              ┌──────┐
  80 ┤  ┌──────┐    │      │
  60 ┤  │      │    │      │    ┌──────┐
  40 ┤  │      │    │      │    │      │
  20 ┤  │      │    │      │    │      │
   0 ┼──┴──────┴────┴──────┴────┴──────┴──► X (Catégories Discrètes)
          Cat A        Cat B        Cat C
     ◄── Ligne de Base Zéro Obligatoire ──►
```

### Mécanisme Neuro-Cognitif
Le diagramme en barres verticales exploite le canal pré-attentif le plus performant du système visuel humain : la **position le long d'une échelle commune** ($< 200\text{ ms}$). Selon la hiérarchie psychophysique de Cleveland & McGill (1984), l'œil humain évalue les variations de hauteur avec une marge d'erreur moyenne inférieure à 5%. La loi psychophysique de Stevens (1957) attribue à la longueur 1D un exposant $\beta \approx 0.99 - 1.0$, garantissant une relation strictement linéaire entre l'intensité du stimulus physique et la perception psychologique.

---

## 2. Quand l'utiliser (Cas d'usage cibles)

### Types de variables adaptées
- **Axe X (Catégoriel)** : Variable qualitative nominale (ex: pays, départements, catégories de produits) ou ordinales à faible cardinalité (ex: tranches d'âge, niveaux de satisfaction).
- **Axe Y (Numérique)** : Variable quantitative continue (ex: chiffre d'affaires, effectifs, températures moyennes, volumes de vente).

### Cas d'usage privilégiés
- **Comparaison directe de 3 à 10 catégories discrètes** sur une métrique unique à un instant $T$.
- **Suivi temporel discret à faible résolution** (ex: 4 trimestres $Q1-Q4$, 12 mois de l'année) lorsque l'objectif principal est de comparer des valeurs individuelles d'étapes plutôt que d'analyser la continuité d'une tendance.
- **Évaluation par rapport à un seuil ou une référence** (ex: comparaison des ventes de 5 filiales par rapport à un objectif fixé).

### Questions d'analyse résolues
- *Quelle catégorie enregistre le niveau le plus élevé / le plus bas ?*
- *Quel est l'écart absolu et relatif entre la catégorie A et la catégorie B ?*
- *Comment se situent les différentes unités métiers par rapport à la moyenne globale ?*

---

## 3. Quand NE PAS l'utiliser (Contre-indications)

```markdown
| Situation & Données | Pourquoi le Bar Chart échoue | Alternative Recommandée |
| :--- | :--- | :--- |
| **Intitulés de catégories longs** (> 10-12 caractères) | Entraîne le chevauchement ou la rotation inclinée à 45°/90° des libellés (fatigue cognitive). | **Horizontal Bar Chart** (`horizontal-bar-chart.md`) |
| **Haute cardinalité** (> 10-12 catégories) | Surcharge l'axe horizontal et compresse la largeur des barres sous le seuil pré-attentif. | **Horizontal Bar Chart** (avec scroll) ou **Treemap** |
| **Séries temporelles denses** (> 15-20 points de mesure) | Brise la continuité visuelle de la tendance et encombre inutilement l'espace. | **Line Chart** (`line-chart.md`) |
| **Analyse de composition / Part-au-tout** (Somme = 100%) | Le bar chart standard ne force pas la perception de la somme globale à 100%. | **100% Stacked Bar** ou **Treemap** |
| **Données continues à distributions complexes** | Une barre unique masque la variance, la médiane, les quartiles et la bimodalité. | **Box Plot** ou **Violin Plot** |
| **Ligne de base non nulle requise** (ex: variations boursières $+0.5\%$) | Nécessite un zoom sur un intervalle étroit non nul. Les barres tronquées créent un *Lie Factor* massif. | **Line Chart** ou **Lollipop Chart** |
```

---

## 4. Règles cognitives & Meilleures pratiques spécifiques

### 4.1 La Règle Absolue de la Ligne de Base Zéro ($Y_{\min} = 0$)
L'encodage visuel d'un diagramme en barres repose simultanément sur la **position du sommet** et sur la **longueur totale** du rectangle. Tronquer l'axe $Y$ (par exemple faire démarrer l'axe à $90$ au lieu de $0$) modifie artificiellement le ratio de longueur des barres.

$$\text{Lie Factor} = \frac{\Delta \text{Visuel} \%}{\Delta \text{Données} \%}$$

Si la catégorie A vaut $100$ et la catégorie B vaut $105$, leur ratio réel est $1.05$. Si l'axe démarre à $90$, la barre A mesure $10\text{px}$ et la barre B mesure $15\text{px}$, générant un ratio visuel de $1.50$ (soit un *Lie Factor* de $\frac{50\%}{5\%} = 10.0$). **Règle déterministe** : Tout diagramme en barres doit impérativement paramétrer `scales.y.beginAtZero: true`.

### 4.2 Tri Logique des Catégories
- **Variables Nominales** : Ne jamais conserver l'ordre alphabétique par défaut ou l'ordre aléatoire de la base de données. **Trier impérativement par valeur décroissante** (ou croissante) pour permettre un balayage visuel hiérarchique (*top-down processing*).
- **Variables Ordinales** : Conserver l'ordre séquentiel naturel de la variable (ex: *Janvier $\rightarrow$ Février $\rightarrow$ Mars* ou *Faible $\rightarrow$ Moyen $\rightarrow$ Élevé*).

### 4.3 Gestion Spatial & Gestalt (Proximité)
- **Rapport largeur / espace** : La largeur de l'espace inter-barres (*gap*) doit être comprise entre **20% et 50%** de la largeur d'une barre.
- **Réglages Chart.js** : `categoryPercentage: 0.8` (réserve 80% de l'espace de la catégorie) et `barPercentage: 0.9` (occupe 90% du bloc réservé). Une barre trop fine ressemble à une ligne ; une barre trop large ressemble à un fond de carte.

### 4.4 Stratégie Chromatique & Saillance Uni-Canal
- **Règle de Monochromie par Défaut** : Utiliser **une seule et unique teinte neutre** (ex: bleu institutionnel `#0072B2` ou slate `#334155`) pour l'ensemble des barres d'un même jeu de données.
- **Interdiction du Raccordement Arc-en-ciel** : Ne jamais attribuer une couleur différente à chaque barre si elles appartiennent à la même métrique. Cela viole la loi de similarité de la Gestalt et introduit du bruit visuel extrinsèque.
- **Accentuation Ciblée (*Pop-out*)** : Pour mettre en évidence une catégorie d'intérêt (ex: "Notre Entreprise"), utiliser la couleur d'accentuation sur cette seule barre (ex: `#D55E00`) et passer les autres barres en gris neutre (`#CBD5E1`).

### 4.5 Étiquetage Direct & Typographie
- Si $N \le 8$ catégories, placer les étiquettes de données (*Data Labels*) directement au-dessus des barres avec une typographie à chiffres tabulaires (`font-variant-numeric: tabular-nums`).
- Lorsque l'étiquetage direct est actif, les lignes de grille horizontales de l'axe $Y$ deviennent redundantes et doivent être désactivées pour maximiser le *Data-Ink Ratio* de Tufte.

---

## 5. Erreurs fréquentes & Anti-patterns visuels

```
  [ ANTI-PATTERN 1 : Ligne de base tronquée ]       [ ANTI-PATTERN 2 : Incurvation des étiquettes à 45° ]
   Y                                                 Y
  105 ┤          ┌───┐                              100 ┤  ┌───┐  ┌───┐  ┌───┐
  100 ┤  ┌───┐   │   │                               50 ┤  │   │  │   │  │   │
   95 ┼──┴───┴───┴───┴───►                           0 ┼──┴───┴──┴───┴──┴───┴───►
         Cat A   Cat B                                    /      /      /
      (Axe Y démarré à 95)                               /      /      /
      (Barre B paraît 2x plus grande !)                (Lecture ralentie de 40%, fatigue cou)
```

1. **Axe Y tronqué ($Y_{\min} > 0$)** : Violation majeure de la fidélité visuelle. Produit une amplification fallacieuse des différences.
2. **Étiquettes de l'axe X inclinées à 45° ou 90°** : Résultat d'un manque d'espace horizontal. Réduit la vitesse de lecture de 40% (Wigdor & Balakrishnan, 2005). Basculer immédiatement sur un diagramme horizontal.
3. **Effets 3D, Ombres & Dégradés complexes** : Rajoute du *chartjunk* (Tufte, 1983). La perspective 3D altère la perception de la hauteur du bord supérieur de la barre.
4. **Utilisation d'une légende déportée pour des barres simples** : Génère un effet de division de l'attention (*Split-Attention Effect*, Sweller). Le nom de la catégorie doit figurer sous sa barre.
5. **Couleurs sémantiques inappropriées** : Utiliser du rouge et du vert sans redondance de forme pour distinguer des catégories qualitatives neutres, pénalisant 8% des utilisateurs hommes (protanopie/deutéranopie).

---

## 6. Recommandations d'implémentation Chart.js

### 6.1 Architecture technique : Type natif vs Plugins communautaires
Ce diagramme repose intégralement sur le type natif **`bar`** de Chart.js (avec `indexAxis: 'x'`). Aucun plugin tiers de moteur graphique n'est requis pour le tracé géométrique. Le plugin communautaire officiel **`chartjs-plugin-datalabels`** est utilisé pour l'étiquetage direct au-dessus des barres afin d'éliminer la division de l'attention.

### 6.2 Structure HTML & Accessibilité (DOM & ARIA)
Le canvas Chart.js doit être enveloppé dans un conteneur sémantique doté des attributs d'accessibilité ARIA (`role="img"`, `aria-label`) et accompagné d'un tableau HTML de secours dissimulé aux utilisateurs voyants (`.sr-only`) mais lisible par les lecteurs d'écran.

```html
<div class="chart-container" role="region" aria-label="Diagramme en barres verticales des ventes 2026" tabindex="0">
  <canvas id="barChartCanvas" role="img" aria-label="Graphique en barres montrant les ventes 2026 par catégorie. La catégorie Alpha est en tête à 145 k€." aria-describedby="bar-chart-fallback"></canvas>
  <div id="bar-chart-fallback" class="sr-only">
    <table>
      <caption>Ventes 2026 par catégorie (en milliers d'euros)</caption>
      <thead>
        <tr>
          <th scope="col">Catégorie</th>
          <th scope="col">Ventes (k€)</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Catégorie Alpha</td><td>145</td></tr>
        <tr><td>Catégorie Bêta</td><td>120</td></tr>
        <tr><td>Catégorie Gamma</td><td>98</td></tr>
        <tr><td>Catégorie Delta</td><td>85</td></tr>
        <tr><td>Catégorie Epsilon</td><td>62</td></tr>
      </tbody>
    </table>
  </div>
</div>
```

### 6.3 Style CSS & Typographie Tabulaire (`tabular-nums`)
Conformément à la règle 6.2 de `regles-universelles.md`, l'affichage des valeurs numériques dans le conteneur et les infobulles doit impérativement activer les chiffres tabulaires pour garantir l'alignement vertical exact des digits.

```css
.chart-container {
  position: relative;
  width: 100%;
  max-width: 800px;
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

### 6.4 Configuration standard baseline (Chart.js v4+)
Pour garantir la conformité scientifique, le code d'instanciation Chart.js doit utiliser le type `bar` et appliquer la configuration stricte ci-dessous.

```javascript
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Palette Okabe-Ito conforme WCAG AA/AAA
const COLOR_PRIMARY = '#0072B2';   // Bleu Okabe-Ito
const COLOR_ACCENT = '#D55E00';    // Vermillon (Pop-out)
const COLOR_NEUTRAL = '#94A3B8';   // Slate 400 pour barres non ciblées
const COLOR_TEXT = '#0F172A';      // Slate 900

const dataValues = [145, 120, 98, 85, 62];
const labels = ['Catégorie Alpha', 'Catégorie Bêta', 'Catégorie Gamma', 'Catégorie Delta', 'Catégorie Epsilon'];
const focusIndex = 0; // Index de la barre à mettre en avant

const config = {
  type: 'bar',
  plugins: [ChartDataLabels],
  data: {
    labels: labels,
    datasets: [{
      label: 'Ventes 2026 ( k€ )',
      data: dataValues,
      // Saillance uni-canal : couleur distincte uniquement pour l'élément focus
      backgroundColor: dataValues.map((_, i) => i === focusIndex ? COLOR_ACCENT : COLOR_PRIMARY),
      borderColor: dataValues.map((_, i) => i === focusIndex ? '#9A3412' : '#004C75'),
      borderWidth: 1,
      borderRadius: 4, // Arrondi très subtil au sommet
      borderSkipped: 'bottom', // Conserve la ligne de base nette à zéro
      categoryPercentage: 0.8, // Respect de la proximité Gestalt
      barPercentage: 0.9
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'x', // Barres verticales
    plugins: {
      legend: {
        display: false // Supprimé : le nom figure sous la barre (anti split-attention)
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#1E293B',
        titleFont: { family: 'Inter', size: 13, weight: '600' },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 10,
        cornerRadius: 6,
        callbacks: {
          label: (context) => ` Valeur : ${context.parsed.y.toLocaleString('fr-FR')} k€`
        }
      },
      datalabels: {
        anchor: 'end',
        align: 'top',
        offset: 4,
        color: COLOR_TEXT,
        font: {
          family: 'Inter',
          size: 12,
          weight: '600'
        },
        formatter: (value) => value.toLocaleString('fr-FR')
      }
    },
    scales: {
      x: {
        grid: {
          display: false // Supprime le bruit visuel vertical (Data-Ink ratio)
        },
        ticks: {
          color: COLOR_TEXT,
          font: { family: 'Inter', size: 12, weight: '500' },
          maxRotation: 0, // Interdiction absolue de rotation à 45°
          minRotation: 0
        }
      },
      y: {
        beginAtZero: true, // Règle d'or de fidélité (Lie Factor)
        grid: {
          color: '#F1F5F9', // Lignes de repère horizontales ultra-subtiles
          drawBorder: false
        },
        ticks: {
          color: '#64748B',
          font: { family: 'Inter', size: 11 },
          callback: (value) => `${value} k€`
        }
      }
    }
  }
};
```

---

## 7. Sources & Références académiques / clés

1. **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception: Theory, Computation, and Application to the Development of Graphic Methods*. Journal of the American Statistical Association, 79(387), 531-554.
   - *Apport* : Établissement de la position sur échelle commune comme canal quantitatif le plus précis.
2. **Heer, J., & Bostock, M. (2010)**. *Crowdsourcing Graphical Perception: Using Mechanical Turk to Assess Visualization Design*. ACM CHI 2010, 203-212.
   - *Apport* : Validation expérimentale moderne des taux d'erreur réduits du diagramme en barres.
3. **Tufte, E. R. (1983)**. *The Visual Display of Quantitative Information*. Graphics Press.
   - *Apport* : Formalisation du Data-Ink Ratio, de l'élimination du chartjunk et du Lie Factor ($Y_{\min} = 0$).
4. **Sweller, J. (1988)**. *Cognitive Load Theory During Learning: Measures and Classroom Applications*. Cognitive Science, 12(2), 257-285.
   - *Apport* : Réduction de la charge extrinsèque par étiquetage direct sans légende déportée.
5. **Wigdor, D., & Balakrishnan, R. (2005)**. *Empirical Investigation of the Effect of Orientation on Text Readability*. ACM CHI 2005, 211-220.
   - *Apport* : Preuve de la dégradation sévère des performances de lecture des textes inclinés à 45°/90°.
6. **Okabe, M., & Ito, K. (2008)**. *Color Universal Design (CUD): How to make figures and presentations that can be friendly to colorblind people*. JFLY.
   - *Apport* : Définition des constantes de palette accessibles.

---

## Règles Cognitives d'Accentuation & Valence

### 1. Hiérarchie Visuelle (Ratio 90/10 de Tufte & Focus Narratif)
- **Principe du Pop-out pré-attentif** : Pour guider immédiatement l'attention du lecteur sur l'élément clé (la catégorie *hero* ou l'insight décisionnel), réserver la couleur focale saturée (`tokens.emphasis.focal`) à une seule barre (≤ 10% des données).
- **Atténuation du contexte** : Toutes les autres barres de comparaison sont traitées en couleur de contexte désaturée (`tokens.emphasis.context` ou `tokens.textMuted`), réduisant la charge cognitive extrinsèque.

### 2. Valence Métier & Directionnalité (Gain vs Coût/Risque/Churn)
- **Métriques directes (Gain, CA, Marge, Volume)** :
  - Une variation positive ($\Delta > 0$) est encodée en `status.success` (vert).
  - Une variation négative ($\Delta < 0$) est encodée en `status.danger` (rouge).
- **Métriques inversées (Coût, Churn, Latence, Taux de défaut)** :
  - Une hausse ($\Delta > 0$) représente une dégradation et s'encode en `status.danger` (rouge).
  - Une baisse ($\Delta < 0$) représente une amélioration et s'encode en `status.success` (vert).
- **Résolution automatisée** : Utiliser le helper universel `getValenceColor(tokens, delta, metricType)`.

### 3. Matrice de Double-Encodage Strict
- **Non-dépendance à la couleur** : Ne jamais coder la significativité uniquement par la couleur (sécurité daltonisme / CVD).
- **Canaux secondaires obligatoires** :
  - Barre *Hero* / Focale : Couleur saturée + bordure contrastée (`borderWidth: 2`) + étiquette de données en gras.
  - Barre de Référence / Benchmark : Couleur `tokens.emphasis.benchmark` + ligne de seuil horizontale tiretée (`borderDash: [4, 4]`).
  - Barres de Contexte : Couleur atténuée + étiquette standard.

### 4. Exemple d'Implémentation Pratique

```javascript
import { createChart } from './template.js';
import { getThemeTokens, getEmphasisStyle, getValenceColor } from '../../themes/theme-tokens.js';

const tokens = getThemeTokens('colorbrewer-accessible');

// Données avec focus narratif sur "France" et coloration de valence sur la croissance
const dataWithEmphasis = {
  labels: ['France', 'Allemagne', 'Royaume-Uni', 'Italie', 'Espagne'],
  datasets: [{
    label: 'Croissance PIB (%)',
    data: [2.8, 1.2, -0.4, 0.8, 1.9],
    // Double encodage : rôle focal sur l'élément cible et valence sur les autres
    emphasisRoles: ['focal', 'context', 'context', 'context', 'context'],
    // Ou coloration directe par valence métier :
    backgroundColor: [
      getEmphasisStyle(tokens, 'focal').backgroundColor,
      getValenceColor(tokens, 1.2, 'gain'),
      getValenceColor(tokens, -0.4, 'gain'),
      getValenceColor(tokens, 0.8, 'gain'),
      getValenceColor(tokens, 1.9, 'gain')
    ]
  }]
};

const chartInstance = createChart('myCanvas', dataWithEmphasis, 'colorbrewer-accessible');
```

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Modélisation de la Cible Interactive (Fitts 1954, MacKenzie 1992)
- **Formulation mathématique formelle** : Le temps d'acquisition motrice d'une barre s'exprime selon le modèle Shannon-MacKenzie :
  $$MT = a + b \cdot \log_2\left(\frac{D}{W_e} + 1\right)$$
- **Attraction 1D indexée** : Pour le diagramme en barres verticales, l'interaction est configurée en mode `mode: 'index'`, `axis: 'x'`, `intersect: false`. La tranche interactive couvre l'intégralité de la bande verticale de la catégorie, augmentant la largeur effective $W_e$ à la largeur de tranche totale ($W_e \gg 28\text{px}$).
- **Gain psychomoteur mesuré** : Réduction de l'indice de difficulté $ID$ de $6.5\text{ bits}$ à $\le 1.5\text{ bits}$, soit un gain de temps d'acquisition motrice de **$> 45\%$** et une élimination totale des ratés de pointage (*first-aim target miss*).

### 2. Seuils Temporels & Model Human Processor (Card, Moran, Newell 1983 ; Nielsen 1993)
- **Constantes MHP** : Cycle perceptif $\tau_p \approx 100\text{ms}$, cycle cognitif $\tau_c \approx 70\text{ms}$, cycle moteur $\tau_m \approx 70\text{ms}$.
- **Réactivité de survol $\le 100\text{ms}$** : Le rehaussement visuel de la barre active (`hover.animationDuration: 100ms`) procure une sensation d'immédiateté physique et de causalité directe.
- **Micro-dynamique d'apparition de l'infobulle** :
  - Débounce anti-flicker d'entrée : $60\text{--}80\text{ms}$ pour neutraliser les saccades oculaires de balayage.
  - Hystérésis de maintien de sortie : $150\text{ms}$ pour absorber les micro-tremblements neuromusculaires ($8\text{--}12\text{ Hz}$).
  - Fondu d'opacité : $120\text{ms}$ avec profil `easeOutQuad`.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer 2001, Sweller 1988)
- **Principe de Contiguïté Spatiale (Mayer 2001)** : L'infobulle est assujettie à un algorithme déterministe d'anti-occlusion avec déport vertical de sécurité ($12\text{px}$) et inversion automatique de quadrant :
  - En cas de collision avec le bord supérieur ($y < \text{margin}$), l'infobulle bascule instantanément sous la barre avec flèche supérieure (`caretPosition: 'top'`).
  - Clamping latéral strict prévenant tout rognage hors du canevas visible (*Viewport Clipping*).
- **Structure cognitive *Details-on-Demand* (Shneiderman 1996)** :
  1. Catégorie inspectée (Sans-serif 12px, Weight 600).
  2. Métrique et valeur absolue (`fontMono` 12px, Regular, chiffres tabulaires).
  3. Écart au benchmark ou valence contextuelle ($\Delta\%$).
- **Typographie tabulaire à espacement fixe** : L'utilisation de `tokens.fontMono` et `font-variant-numeric: tabular-nums` garantit l'alignement vertical rigoureux des chiffres et divise par deux le temps d'exploration oculaire.

### 4. Cinématique des Courbes d'Amorti & Constance d'Objet (Penner 2002, Heer & Robertson 2007)
- **Rendu initial standard** : Durée $400\text{ms}$ avec courbe polynomiale `easeOutQuart` ($s(t) = 1 - (1 - t)^4$). Émergence fluide depuis la ligne de base $Y=0$, captant la fovéa avec amortissement critique sans oscillation ($\zeta = 1.0$).
- **Proscription formelle** : Fonctions `easeIn` (latence initiale perçue) et harmoniques sous-amorties `bounce`/`elastic` formellement proscrites pour préserver la sobriété analytique (Tufte 1983, Few 2012).

### 5. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2 AAA)
- **Respect du critère SC 2.3.3** : Détection universelle `@media (prefers-reduced-motion: reduce)` via `isReducedMotionPreferred()` désactivant immédiatement toute animation (`duration: 0`, `animation: false`).
- **Contraste renforcé SC 1.4.6 (AAA)** : Infobulles avec contraste de texte $\ge 16:1$ sur fond sombre, bordures `tokens.borderStrong` contrastées.
- **Mode exécutif Tufte** : Suppression totale des animations pour les rapports statiques ou les tableaux de bord à haute densité décisionnelle.


