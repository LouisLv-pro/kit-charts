# Fiche Méthodologique : Diagramme à Bulles (Bubble Chart)

> **Catégorie** : 04-correlation-relation  
> **Type Chart.js** : `bubble` (Type natif)  
> **Niveau de précision Cleveland & McGill** : RANG 1 (Position X, Y) & RANG 5 (Surface 2D de la bulle Z) — Erreur de 15 à 25% sur la 3ème dimension  
> **Dernière révision** : 2026-08-13  

---

## 1. Description & Principe visuel

Le **diagramme à bulles** (ou *Bubble Chart*) est une extension trivariée du nuage de points cartésien. Il permet de visualiser simultanément la relation entre trois variables quantitatives continues sur un plan à deux dimensions en encodant la troisième variable par la **surface** d'un disque (bulle). Une quatrième variable qualitative (catégorielle) peut éventuellement être ajoutée via la teinte de couleur du marqueur.

### Encodages visuels mobilisés
1. **Position sur l'axe horizontal ($X$)** : Variable quantitative 1 (Rang 1 Cleveland & McGill — Précision maximale).
2. **Position sur l'axe vertical ($Y$)** : Variable quantitative 2 (Rang 1 Cleveland & McGill — Précision maximale).
3. **Surface 2D de la bulle ($Z$)** : Variable quantitative 3 de magnitude positive (Rang 5 Cleveland & McGill — Estimation qualitative/ordinale).
4. **Teinte de couleur (*Hue*)** *(Optionnel)* : Variable qualitative discrète (Catégorie / Segment).

```
       CORRÉLATION 3D : POSITION (X, Y) ET SURFACE (Z)
  Y (Espérance de Vie)
  85 ┤                                    ◯ (Z = 1.4B - Chine)
  75 ┤                           ◯      ◯
  65 ┤                  ◯ (Z=330M)    ◯
  55 ┤           ● (Z=50M)
  45 ┤     ●
   0 ┼─────┴────────────┴─────────────┴─────────────┴──► X (PIB par Habitant)
         1 000        10 000        30 000        60 000

     LÉGENDE DE TAILLE DES BULLES (Z = Population)
     ◯ 100M     ◯ 500M     ◯ 1B
```

### Mécanisme Neuro-Cognitif & Lois Psychophysiques
Le diagramme à bulles réalise un compromis cognitif entre la précision analytique et la capacité de synthèse :
- **Double perception hétérogène** : Les coordonnées cartésiennes $(X, Y)$ bénéficient du décodage à faible erreur du Rang 1 (position sur échelles communes). En revanche, la variable $Z$ est soumise à la perception des aires (Rang 5), caractérisée par une marge d'erreur de décodage de 15% à 25%.
- **Loi de Stevens & Échelle de Flannery (1971)** : La perception humaine des surfaces 2D n'est pas strictly linéaire. Selon Stevens (1957), la sensation visuelle d'une aire suit une loi de puissance $S = k \cdot A^\beta$ avec $\beta \approx 0.7 - 0.8$. L'œil humain sous-estime systématiquement la taille des grandes surfaces par rapport aux petites. J. J. Flannery (1971) a établi une correction empirique exponentielle ($\beta = 0.57$ pour le rayon) pour compenser cette sous-estimation visuelle.

---

## 2. Quand l'utiliser (Cas d'usage cibles)

### Types de variables adaptées
- **Axe X** : Variable quantitative continue (ex: PIB par habitant, dépense R&D, ancienneté client).
- **Axe Y** : Variable quantitative continue (ex: espérance de vie, score de satisfaction, chiffre d'affaires).
- **Surface Z** : Variable quantitative continue strictement **positive** de taille ou de volume (ex: population totale, volume de ventes, valeur du portefeuille, effectif).

### Cas d'usage privilégiés
- **Visualisation macroéconomique ou stratégique trivariée** : Le modèle célèbre de Hans Rosling (Gapminder) comparant le PIB ($X$), l'espérance de vie ($Y$) et la population ($Z$) par pays.
- **Analyse de portefeuille d'activités / Matrice BCG avancée** : Positionner des unités d'affaires selon la croissance du marché ($Y$), la part de marché ($X$) et le chiffre d'affaires total ($Z$).
- **Évaluation de campagnes marketing** : Coût par acquisition ($X$), Taux de conversion ($Y$) et Volume total de leads ($Z$).
- **Cardinalité cible** : Idéalement $N \in [10, 100]$ points. Au-delà, les chevauchements dégradent la lisibilité.

### Questions d'analyse résolues
- *Les marchés à forte croissance ($Y$) et forte rentabilité ($X$) représentent-ils un volume d'affaires ($Z$) significatif ?*
- *Existe-t-il une corrélation entre les dépenses de santé ($X$) et la longévité ($Y$), et quel est le poids démographique ($Z$) des pays concernés ?*

---

## 3. Quand NE PAS l'utiliser (Contre-indications)

| Situation & Données | Pourquoi le Bubble Chart échoue | Alternative Recommandée |
| :--- | :--- | :--- |
| **La variable $Z$ contient des valeurs négatives ou nulles** | Une surface géométrique ou un rayon ne peut pas physiquement encoder une aire négative sans créer d'aberration. | **Scatter Plot 2D** avec codage par couleur ou **Bar Charts séparés** |
| **Comparaison quantitative de haute précision requise sur $Z$** | L'erreur de décodage des aires (15-25%) empêche de juger si $Z_A = 120$ est supérieur à $Z_B = 110$. | **Small Multiples de Bar Charts** ou **Matrice de graphiques** |
| **Forte densité de données** ($N > 150-200$) | Les bulles se chevauchent massivement (*Screen Occlusion*), masquant totalement les points d'arrière-plan. | **Scatter Plot avec dégradé de couleur** ou **Treemap** |
| **Grandes variations d'échelle sur $Z$** (ex: $Z \in [1, 100\text{ }000]$) | Les plus petites bulles deviennent invisibles (1px) ou les plus grandes envahissent l'écran entier. | **Scatter Plot avec axe $Z$ encodé sur une échelle de couleur $\log$** |

---

## 4. Règles cognitives & Meilleures pratiques spécifiques

### 4.1 La Règle Absolue d'Encodage : Aire Proportionnelle à la Valeur ($A \propto Z$)
C'est le piège le plus dévastateur de la dataviz. La surface d'un disque est donnée par $A = \pi r^2$. 
- **L'ERREUR FATALE** : Rendre le **rayon** proportionnel à la valeur ($r \propto Z$). Dans ce cas, doubler la valeur $Z$ ($Z_2 = 2 Z_1$) entraîne le doublement du rayon ($r_2 = 2 r_1$), ce qui multiplie la surface par $4$ ($A_2 = 4 A_1$). La perception visuelle étant dominée par l'aire, le graphique induit un **Lie Factor de 2.0 à 4.0** (mensonge visuel massif).
- **LA RÈGLE OBLIGATOIRE** : La **surface** doit être strictement proportionnelle à la valeur ($A \propto Z$). Par conséquent, le rayon $r$ doit être proportionnel à la **racine carrée** de la valeur :
  $$r_i = k \cdot \sqrt{Z_i}$$

```
[ ÉCHEC : Rayon proportionnel r ∝ Z (Mensonge visuel) ]   [ SUCCÈS : Aire proportionnelle r ∝ √Z (Fidélité) ]
  Valeur 10 : r = 10px (Aire = 314px²)                       Valeur 10 : r = 10px (Aire = 314px²)
  Valeur 20 : r = 20px (Aire = 1256px² -> x4 aire !)         Valeur 20 : r = 14.1px (Aire = 628px² -> x2 aire !)
     ◯           ◯◯◯◯                                           ◯           ◯◯
```

### 4.2 Gestion du Chevauchement et Ordre de Tracé (Z-Index)
Pour éviter que les grandes bulles ne masquent les plus petites placées derrière elles :
1. **Transparence Alpha dynamique** : Remplir les bulles avec une opacité de $40\%$ à $60\%$ (`rgba(0, 114, 178, 0.5)`).
2. **Bordure de contour solide** : Appliquer un contour net (`borderWidth: 1.5` à `2px`, couleur saturée) pour préserver la forme du cercle lors de chevauchements multiples.
3. **Tri par taille décroissante (Z-Index)** : **IMPÉRATIF**. Le tableau de données doit être trié par ordre décroissant de la variable $Z$ avant d'être dessiné. Les bulles géantes sont ainsi dessinées en premier (à l'arrière-plan) et les petites bulles en dernier (au premier plan).

### 4.3 Légende de Taille des Bulles (Échelle de Référence)
Un diagramme à bulles sans échelle de taille est impossible à calibrer cognitivement. Le graphique **DOIT** inclure une légende visuelle dédiée présentant 3 à 4 bulles de référence alignées ou emboîtées (ex: valeur minimale, valeur médiane, valeur maximale de $Z$) avec leurs chiffres explicites.

---

## 5. Erreurs fréquentes & Anti-patterns visuels

```
  [ ANTI-PATTERN 1 : Occlusion totale par bulles opaques ]    [ ANTI-PATTERN 2 : Bulles 3D / Sphères dégradées ]
   Y                                                           Y
  10 ┤   ████████                                             10 ┤    ( ( ◯ ) )  <- Rendu 3D parasite
   5 ┤   ████████ (Bulles 100% opaques = Masquage)            5 ┤   (Chartjunk de Tufte)
   0 ┼───┴────────► X                                          0 ┼───┴────────► X
```

1. **Calcul du rayon linéaire ($r \propto Z$)** : Déformation quadratique de l'aire perçue.
2. **Bulles 100% opaques** : Masquage total des petites données situées sous les grands disques.
3. **Absence de légende pour la dimension $Z$** : L'utilisateur n'a aucun moyen de convertir l'aire d'une bulle en quantité numérique réelle.
4. **Rendu 3D en sphères avec reflets et ombrages portés** : Violation directe du principe de Tufte (*Chartjunk*). La brillance et l'ombre déforment les limites perçues du rayon.
5. **Normalisation incorrecte de l'échelle des rayons** : Attribuer un rayon minimum trop grand (ex: $r_{\min} = 20\text{px}$) écrase le ratio relatif d'aire entre les petites et grandes valeurs.

---

## 6. Recommandations d'implémentation Chart.js

### 6.1 Architecture technique : Type natif `'bubble'`
Chart.js propose le type natif `'bubble'`. La structure de données pour chaque point est un objet `{x: number, y: number, r: number}`.

**Attention cruciale** : Le paramètre `r` dans Chart.js représente le **rayon en pixels**. Pour respecter la loi d'équivalence d'aire ($A \propto Z$), nous devons convertir les valeurs brutes $Z_i$ en rayons $r_i$ en appliquant la racine carrée :
$$r_i = r_{\min} + (r_{\max} - r_{\min}) \times \sqrt{\frac{Z_i - Z_{\min}}{Z_{\max} - Z_{\min}}}$$

### 6.2 Structure HTML & Accessibilité (DOM & ARIA)
```html
<div class="chart-container" role="region" aria-label="Diagramme à bulles : Analyse PIB, Espérance de vie et Population" tabindex="0">
  <canvas id="bubbleChartCanvas" role="img" aria-label="Diagramme à bulles comparant le PIB par habitant (X), l'espérance de vie (Y) et la population (Z). La Chine et l'Inde apparaissent sous forme de bulles majeures." aria-describedby="bubble-fallback"></canvas>
  <div id="bubble-fallback" class="sr-only">
    <table>
      <caption>Données du Diagramme à Bulles par Pays (2026)</caption>
      <thead>
        <tr>
          <th scope="col">Pays</th>
          <th scope="col">PIB par Habitant ($)</th>
          <th scope="col">Espérance de vie (années)</th>
          <th scope="col">Population (Millions)</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Chine</td><td>12 500</td><td>78.2</td><td>1 411</td></tr>
        <tr><td>Inde</td><td>2 650</td><td>70.8</td><td>1 408</td></tr>
        <tr><td>États-Unis</td><td>76 300</td><td>77.5</td><td>333</td></tr>
        <tr><td>Allemagne</td><td>48 700</td><td>80.9</td><td>84</td></tr>
        <tr><td>Japon</td><td>33 800</td><td>84.6</td><td>125</td></tr>
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
  aspect-ratio: 16 / 10;
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

### 6.4 Algorithmes JS d'Échelle de Rayon ($r \propto \sqrt{Z}$) & Configuration Chart.js v4+

```javascript
import { Chart } from 'chart.js/auto';

// Jeu de données brut trivarié { label, x: PIB, y: Espérance, z: Population }
const rawCountryData = [
  { label: 'Chine', x: 12500, y: 78.2, z: 1411 },
  { label: 'Inde', x: 2650, y: 70.8, z: 1408 },
  { label: 'États-Unis', x: 76300, y: 77.5, z: 333 },
  { label: 'Indonésie', x: 4780, y: 67.6, z: 275 },
  { label: 'Brésil', x: 8900, y: 72.8, z: 214 },
  { label: 'Nigeria', x: 2180, y: 52.7, z: 218 },
  { label: 'Allemagne', x: 48700, y: 80.9, z: 84 },
  { label: 'Japon', x: 33800, y: 84.6, z: 125 },
  { label: 'France', x: 40900, y: 82.3, z: 68 }
];

// 1. Algorithme de calcul du rayon proportionnel à la RACINE CARRÉE de Z (Aire proportionnelle)
// Option Flannery : si useFlannery = true, applique r ∝ Z^0.57 pour corriger la sous-estimation perceptive
function calculateBubbleRadius(valZ, minZ, maxZ, minRadiusPx = 4, maxRadiusPx = 32, useFlannery = false) {
  if (maxZ === minZ) return (minRadiusPx + maxRadiusPx) / 2;
  if (valZ <= 0) return minRadiusPx; // Garde-fou pour valeurs non positives

  const exponent = useFlannery ? 0.57 : 0.5; // 0.5 pour aire exacte, 0.57 pour correction Flannery
  const valTrans = Math.pow(valZ, exponent);
  const minTrans = Math.pow(minZ, exponent);
  const maxTrans = Math.pow(maxZ, exponent);

  const normalized = (valTrans - minTrans) / (maxTrans - minTrans);
  return minRadiusPx + normalized * (maxRadiusPx - minRadiusPx);
}

// 2. Algorithme de calcul des coefficients de corrélation par paire (X, Y), (X, Z), (Y, Z)
function calculateTrivariatePearsonR(data) {
  const calcR = (vecA, vecB) => {
    const n = vecA.length;
    let sumA = 0, sumB = 0, sumAB = 0, sumAA = 0, sumBB = 0;
    for (let i = 0; i < n; i++) {
      sumA += vecA[i];
      sumB += vecB[i];
      sumAB += vecA[i] * vecB[i];
      sumAA += vecA[i] * vecA[i];
      sumBB += vecB[i] * vecB[i];
    }
    const num = n * sumAB - sumA * sumB;
    const den = Math.sqrt((n * sumAA - sumA * sumA) * (n * sumBB - sumB * sumB));
    return den === 0 ? 0 : num / den;
  };

  const xVec = data.map(d => d.x);
  const yVec = data.map(d => d.y);
  const zVec = data.map(d => d.z);

  return {
    rXY: calcR(xVec, yVec),
    rXZ: calcR(xVec, zVec),
    rYZ: calcR(yVec, zVec)
  };
}

// 3. Préparation des données avec TRI DÉCROISSANT selon Z (Gestion déterministe du Z-Index)
const zValues = rawCountryData.map(d => d.z);
const minZ = Math.min(...zValues);
const maxZ = Math.max(...zValues);

const formattedData = rawCountryData
  .map(d => ({
    label: d.label,
    x: d.x,
    y: d.y,
    z: d.z, // Conservation de la valeur quantitative d'origine pour l'infobulle
    r: calculateBubbleRadius(d.z, minZ, maxZ, 4, 32, false) // Calculation du rayon en px
  }))
  .sort((a, b) => b.z - a.z); // RÈGLE ABSOLUE : Bulles géantes d'abord (arrière-plan)

const COLOR_PRIMARY = 'rgba(0, 114, 178, 0.5)';   // Bleu Okabe-Ito semi-transparent
const COLOR_BORDER = '#004C75';                     // Contour foncé net
const COLOR_TEXT = '#0F172A';

const config = {
  type: 'bubble',
  data: {
    datasets: [{
      label: 'Pays',
      data: formattedData,
      backgroundColor: COLOR_PRIMARY,
      borderColor: COLOR_BORDER,
      borderWidth: 1.5,
      hoverBackgroundColor: 'rgba(213, 94, 0, 0.7)', // Vermillon au survol
      hoverBorderColor: '#9A3412',
      hoverBorderWidth: 2
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1E293B',
        titleFont: { family: 'Inter', size: 13, weight: '600' },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 12,
        cornerRadius: 6,
        callbacks: {
          title: (items) => items[0].raw.label,
          label: (context) => {
            const pt = context.raw;
            return [
              ` PIB par hab. : $${pt.x.toLocaleString('fr-FR')}`,
              ` Espérance de vie : ${pt.y} ans`,
              ` Population (Z) : ${pt.z.toLocaleString('fr-FR')} M hab.`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        type: 'logarithmic', // Échelle log recommandée si fortes disparités sur X
        title: {
          display: true,
          text: 'PIB par habitant en USD (Échelle logarithmique)',
          color: COLOR_TEXT,
          font: { family: 'Inter', size: 12, weight: '600' }
        },
        grid: { color: '#F1F5F9' },
        ticks: {
          color: '#64748B',
          font: { family: 'Inter', size: 11 },
          callback: (val) => `$${val.toLocaleString('fr-FR')}`
        }
      },
      y: {
        type: 'linear',
        beginAtZero: false,
        title: {
          display: true,
          text: 'Espérance de Vie (en années)',
          color: COLOR_TEXT,
          font: { family: 'Inter', size: 12, weight: '600' }
        },
        grid: { color: '#F1F5F9' },
        ticks: {
          color: '#64748B',
          font: { family: 'Inter', size: 11 },
          callback: (val) => `${val} ans`
        }
      }
    }
  }
};
```

### 6.5 Principes de Déterminisme pour Agents IA
1. **Interdiction de l'échelle linéaire de rayon ($r \propto Z$)** : Un agent IA doit lever une exception de validation si le rayon est directement assigné à la valeur sans passer par la racine carrée ($r \propto \sqrt{Z}$) ou la correction de Flannery ($r \propto Z^{0.57}$).
2. **Tri automatique par $Z$ décroissant** : Le tableau de données injecté dans Chart.js **doit impérativement être trié par ordre décroissant de $Z$** (`sort((a,b) => b.z - a.z)`). Cela garantit le rendu Z-index correct sans masquage des petites bulles par les plus grandes.
3. **Seuil d'invalidation (Bascule automatique)** : Si la variable $Z$ contient au moins une valeur négative ou nulle ($Z \le 0$), l'agent IA **doit rejeter le Bubble Chart** et basculer sur un **Scatter Plot avec encodage de $Z$ par la couleur** ou deux sous-graphiques distincts.

---

## Règles Cognitives d'Accentuation & Valence

Le Diagramme à Bulles (Bubble Chart) encode trois dimensions continues ($X, Y, Z$). L'accentuation cognitive y est cruciale pour structurer l'attention et éviter la surcharge sensorielle causée par les grandes aires circulaires :

### 1. Hiérarchie Visuelle & Ratio 90/10 (Tufte)
- **Bulles de Contexte (90%)** : Les entités non focales sont encodées avec `tokens.emphasis.context` (`#CBD5E1` / gris bleuté atténué), avec une opacité modérée ($\alpha \approx 0.35$) et un liseré fin pour éviter l'occlusion des petits disques sous-jacents.
- **Bulles Héroïques / Marchés Focaux (10%)** : Le marché cible ou concurrent de référence est mis en exergue avec `tokens.emphasis.focal` (couleur saturée, $\alpha \approx 0.85$, bordure contrastée épaisse `borderWidth: 2.5`).

### 2. Détection d'Anomalies & Bulles Hors Normes
- **Outliers Multidimensionnels** : Les observations combinant des valeurs aberrantes ou un ratio Z/X exceptionnel sont qualifiées d'anomalies.
- **Double Encodage Strict** :
  - **Canal Couleur** : `tokens.emphasis.anomaly` (magenta saillant `#D01C8B`).
  - **Canal Bordure** : Contour contrasté blanc/sombre (`borderWidth: 2.5`).
  - **Tooltip Tabulaire** : Décomposition explicite des 3 grandeurs $(X, Y, Z)$ avec formatage tabulaire des nombres.

### 3. Valence Métier & Polarité
- Pour des analyses de rentabilité (Marge $X$ vs Croissance $Y$ vs Chiffre d'affaires $Z$), la couleur des bulles s'aligne sur la valence métier : `status.success` pour les zones de profit élevé, `status.danger` pour les unités déficitaires.

### 4. Exemple d'Implémentation Chart.js v4+ (Accentuation & Valence)

```javascript
import { createChart } from './template.js';
import { getEmphasisStyle, getValenceColor } from '../../themes/theme-tokens.js';

// Analyse de portefeuille de produits (Prix vs Volume vs Marge) avec produit Hero et alerte
const portfolioData = {
  datasets: [{
    label: 'Portefeuille Produits',
    data: [
      { x: 120, y: 1500, z: 45, label: 'Produit A (Legacy)', role: 'context' },
      { x: 240, y: 3200, z: 85, label: 'Produit B (Hero)',   role: 'focal' },
      { x: 80,  y: 800,  z: 15, label: 'Produit C (Low-end)', role: 'context' },
      { x: 450, y: 120,  z: 5,  label: 'Produit D (Alerte)',  role: 'anomaly' }
    ]
  }]
};

// Initialisation avec le thème Atkinson Hyperlegible
const chart = createChart('myCanvas', portfolioData, 'atkinson-hyperlegible');
```

---

## 7. Sources & Références académiques / clés

1. **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception: Theory, Computation, and Application to the Development of Graphic Methods*. JASA, 79(387), 531-554.
   - *Contribution* : Évaluation empirique du Rang 5 (surface 2D) et de son imprécision relative par rapport au Rang 1 (position).
2. **Flannery, J. J. (1971)**. *The Relative Effectiveness of Some Common Graduated Point Symbols in the Presentation of Quantitative Data*. The Canadian Cartographer, 8(2), 96-109.
   - *Contribution* : Formulation de la loi d'échelle perceptuelle pour les symboles gradués circulaires.
3. **Stevens, S. S. (1957)**. *On the psychophysical law*. Psychological Review, 64(3), 153-181.
   - *Contribution* : Loi de puissance de la perception de la surface ($\beta \approx 0.7$).
4. **Rosling, H. (2006)**. *The best stats you've ever seen*. TED Talk & Gapminder Foundation.
   - *Contribution* : Démonstration globale de l'efficacité du Bubble Chart pour la vulgarisation de la dataviz macroéconomique.
5. **Monmonier, M. (1991)**. *How to Lie with Maps*. University of Chicago Press.
   - *Contribution* : Analyse des biais d'encodage visuel par le rayon vs par la surface.

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Ciblage Spatial 2D Continu (MacKenzie 1992, ISO 9241-9)
- **Ciblage Spatial 2D & Rayon d'Attraction Élargi** : Pour une bulle de petit rayon ($r = 4\text{px}$, diamètre effectif $8\text{px}$) à distance $D = 350\text{px}$, l'Indice de Difficulté de Fitts brut est $ID = \log_2(350/8 + 1) \approx 5.48\text{ bits}$ ($MT \approx 1226\text{ms}$). En intégrant les options spatiales `getSpatialInteractionOptions(tokens, { mode: 'nearest', axis: 'xy', hitRadius: 14, hoverRadius: 7 })`, la surface effective de pointage atteint $W_e = 8 + 2 \times 14 = 36\text{px}$, réduisant $ID$ à $3.42\text{ bits}$ ($MT \approx 814\text{ms}$), soit un gain moteur de **$33.6\%$** et la suppression des ratés de sélection sur petites bulles.
- **Partition Spatiale Continue** : Le mode `nearest` en coordonnées $XY$ sans intersection stricte permet d'activer l'infobulle dès que le curseur s'approche de la bulle, sans exiger de survoler précisément le disque opaque.

### 2. Réactivité Temporelle & Latences Perceptives (Card-Moran-Newell 1983, Nielsen 1993)
- **Instantanéité Perceptive ($\le 100\text{ms}$)** : L'effet de survol (expansion du contour `hoverBorderWidth: 2.5` et surbrillance chromatique) s'exécute en $100\text{ms}$ à $60\text{ fps}$.
- **Débounce & Hystérésis Physiologique** : Filtre d'entrée $\Delta t_{\text{enter}} = 80\text{ms}$ prévenant les clignotements lors du survol de zones denses et rémanence de sortie $\Delta t_{\text{exit}} = 150\text{ms}$ stabilisant l'infobulle face aux micro-tremblements moteurs.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer 2001, Sweller 1988)
- **Auto-Suffisance des *Details-on-Demand*** : L'infobulle décompose simultanément les 3 grandeurs $(X, Y, Z)$ avec le label de l'entité et une typographie tabulaire `tokens.fontMono` (`font-variant-numeric: tabular-nums`) alignant rigoureusement les décimales.
- **Algorithme Anti-Occlusion Déterministe** : Positionnement via `computeAntiOcclusionTooltipPosition` avec déport vertical de sécurité ($12\text{px}$) et basculement automatique vers le quadrant inférieur ($y < \text{margin}$) pour les bulles situées en haut du canvas.

### 4. Constance d'Objet & Physique des Courbes d'Amorti (Heer & Robertson 2007, Penner 2002)
- **Transitions Amorties Déterminées** : Les changements d'échelles, filtres ou tris appliquent une cinétique `easeOutQuart` ($400\text{ms}$) avec interpolation douce des coordonnées $(x, y)$ et du rayon $r$, prévenant la cécité au changement (*Change Blindness*).

### 5. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2 AAA)
- **Conformité SC 2.3.3 (Animation from Interactions)** : Durée ramenée à `0ms` dès détection de `@media (prefers-reduced-motion: reduce)` via `isReducedMotionPreferred()`.
- **Contraste Élevé & Typographie Tabulaire** : Ratios de contraste $\ge 16:1$ dans l'infobulle et $\ge 3:1$ pour les bordures de bulles, conformité WCAG AAA.
