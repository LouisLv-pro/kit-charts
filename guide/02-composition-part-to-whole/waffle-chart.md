# Graphique Gaufre (Waffle Chart / Isotype Grid)

## 1. Description & Principe Visuel
Le Waffle Chart représente des proportions ou pourcentages à travers une grille régulière de $10 \times 10$ carrés (100 cellules au total), où chaque cellule correspond exactement à 1%.
- **Encodage primaire** : Dénombrement unitaire et aire discrète (alignement régulier en grille).
- **Supériorité cognitive** : Élimine totalement l'ambiguïté des angles d'un camembert. L'œil humain peut dénombrer précisément ou évaluer des blocs entiers de dizaines (lignes de 10) grâce au principe d'*estimation discrète rapide* (subitisation et chunking, Miller 1956).

---

## 2. Quand l'utiliser (Cas d'usage cibles)
- Présentation d'un KPI de pourcentage ou taux d'accomplissement auprès d'un large public.
- Comparaison de 2 à 4 segments dans un total de 100%.
- Infographies et tableaux de bord de synthèse orientés grand public et communication exécutive.

---

## 3. Quand NE PAS l'utiliser (Contre-indications)
- **Plus de 4 catégories** : Fragmentation de la grille difficile à décoder. 👉 *Remplacer par un Bar Chart ou Treemap*.
- **Chiffres continus à haute précision (ex: 23,847%)** : La granularité de 1 carré = 1% arrondit les valeurs.
- **Grands volumes de données simultanés** : Encombrement spatial si démultiplié.

---

## 4. Règles Cognitives & Meilleures Pratiques Spécifiques
- **Grille standard de $10 \times 10$ carrés** : Respecter impérativement la matrice 100 pour que 1 cellule = 1%.
- **Remplissage ordonné et continu** : Remplir la grille de bas en haut et de gauche à droite (ou de haut en bas) sans disperser les cellules d'une même catégorie.
- **Palette sobre et contrastée** : Couleur d'accent vive pour la part critique et couleur neutre désaturée (`#E2E8F0`) pour le reste.
- **Espacement régulier inter-cellules** : Espacement de 2px à 3px pour individualiser nettement les unités.

---

## 5. Erreurs Fréquentes & Anti-Patterns Visuels
- ❌ **Cellules dispersées aléatoirement** : Détruit le regroupement perceptuel.
- ❌ **Grille asymétrique (ex: $8 \times 12$)** : Fausse l'équivalence intuitive de 1 cellule = 1%.

---

## 6. Recommandations d'Implémentation Chart.js

### Configuration Type
- Implémenté via le plugin `chartjs-chart-matrix` avec une grille $10 \times 10$.

```javascript
// Requiert: npm install chartjs-chart-matrix
import 'chartjs-chart-matrix';

// Génération des 100 cellules (ex: 68% OUI, 32% NON)
const matrixData = [];
let count = 0;
for (let y = 0; y < 10; y++) {
  for (let x = 0; x < 10; x++) {
    count++;
    matrixData.push({
      x: x,
      y: y,
      v: count <= 68 ? 'Partie A (68%)' : 'Reste (32%)',
      color: count <= 68 ? '#2563EB' : '#E2E8F0'
    });
  }
}

const config = {
  type: 'matrix',
  data: {
    datasets: [{
      data: matrixData,
      backgroundColor: (ctx) => ctx.raw?.color,
      width: ({ chart }) => (chart.chartArea || {}).width / 10 - 3,
      height: ({ chart }) => (chart.chartArea || {}).height / 10 - 3,
      borderRadius: 2
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: { display: false, min: -0.5, max: 9.5 },
      y: { display: false, min: -0.5, max: 9.5 }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: () => '',
          label: (ctx) => ctx.raw.v
        }
      }
    }
  }
};
```

---

## 7. Sources & Références Académiques
- **Haroz, S., Kosara, R., & Franconeri, S. L. (2015)**. *ISOTYPE Visualization: Working Memory and Visual Search in Pictorial Displays*. ACM CHI 2015.
- **Miller, G. A. (1956)**. *The magical number seven, plus or minus two: Some limits on our capacity for processing information*. Psychological Review, 63(2), 81-97.

---

## Règles Cognitives d'Accentuation & Valence

### 1. Hiérarchie Visuelle (Ratio 90/10 de Tufte & Focus Narratif)
- **Cellules Actives (Hero Part)** : Les $K$ cellules pleines matérialisent le taux atteint avec la couleur saturée `tokens.emphasis.focal` (ou couleur de statut).
- **Cellules Inactives (Contexte)** : Les cellules complémentaires (100 - $K$) constituent la grille de fond neutre (`rgba(15, 23, 42, 0.08)` en mode clair ou `rgba(236, 239, 244, 0.12)` en mode sombre), facilitant l'estimation unitaire directe sans bruit visuel.

### 2. Valence Métier & Directionnalité (Gain vs Coût/Risque/Churn)
- **Objectif de complétion / KPI** :
  - Taux nominal satisfaisant : cellules colorées en `status.success` via `getValenceColor(tokens, 1, 'gain')`.
  - Taux critique / déficit d'objectif : cellules colorées en `status.danger` via `getValenceColor(tokens, -1, 'gain')` ou `status.warning`.

### 3. Matrice de Double-Encodage Strict
- **Décodage Isotype discret** :
  - Cellule unitaire = 1% exact (1 carré de la grille $10 \times 10$).
  - Info-bulle dynamique : Format d'avancement explicite (*"Score : 68 / 100 (68%)"*).

### 4. Exemple d'Implémentation Pratique

```javascript
import { createChart } from './template.js';
import { getThemeTokens, getThresholdStatus } from '../../themes/theme-tokens.js';

const tokens = getThemeTokens('colorbrewer-accessible');
const statusProgression = getThresholdStatus(84, 80, { warning: 0.9, success: 1.0 }, 'higher-is-better', tokens);

const customData = {
  datasets: [{
    label: `Progression (${statusProgression.label})`,
    data: [84],
    backgroundColor: statusProgression.color
  }]
};

const chart = createChart('chartCanvas', customData, 'colorbrewer-accessible');
```

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Modélisation de la Cible Interactive (Fitts 1954, MacKenzie 1992)
- **Formulation mathématique sur grille 2D discrète** : Le temps d'acquisition motrice d'une cellule de matrice $10 \times 10$ s'exprime selon le modèle Shannon-MacKenzie :
  $$MT = a + b \cdot \log_2\left(\frac{D}{W_e} + 1\right)$$
- **Zone de tolérance unitaire** : Chaque cellule possède une taille physique minimale $\approx 18\text{px} \times 18\text{px}$. L'interaction en `mode: 'nearest'`, `intersect: true`, `axis: 'xy'` permet de sélectionner instantanément la cellule survolée ou d'inspecter l'avancement global de la grille ($W_e \ge 20\text{px}$, $ID \approx 1.8\text{ bit}$).
- **Gain psychomoteur mesuré** : Comptage visuel direct supérieur de **$> 50\%$** en vitesse de décodage cognitif par rapport à l'estimation d'angles sur un camembert.

### 2. Seuils Temporels & Model Human Processor (Card, Moran, Newell 1983 ; Nielsen 1993)
- **Constantes MHP** : Cycle perceptif $\tau_p \approx 100\text{ms}$, cycle cognitif $\tau_c \approx 70\text{ms}$, cycle moteur $\tau_m \approx 70\text{ms}$.
- **Feedback matriciel $\le 100\text{ms}$** : Surbrillance de la cellule pointée avec `hover.animationDuration: 100ms`.
- **Dynamique d'infobulle** :
  - Débounce d'entrée : $70\text{ms}$.
  - Hystérésis de maintien : $150\text{ms}$.
  - Fondu d'opacité : $120\text{ms}$ en `easeOutQuad`.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer 2001, Sweller 1988)
- **Principe de Contiguïté Spatiale (Mayer 2001)** : L'infobulle affiche la consolidation du score global de complétion ($K/100$ et $K\%$) au-dessus de la cellule active sans masquer la matrice.
- **Anti-Occlusion déterministe** : Centrage et déport vertical $12\text{px}$ avec inversion si la cellule est sur la ligne supérieure $Y=10$.
- **Structure cognitive unifiée** :
  1. Indicateur / Intitulé de l'objectif (Sans-serif 12px, Weight 600).
  2. Ratio dénombré (`fontMono` 12px, format `tabular-nums` : *"84 / 100 (84.0%)"*).

### 4. Cinématique des Courbes d'Amorti & Constance d'Objet (Penner 2002, Heer & Robertson 2007)
- **Rendu initial unitaire** : Remplissage progressif des 100 cellules par balayage ordonné en $400\text{ms}$ avec profil polynomial `easeOutQuart` ($s(t) = 1 - (1 - t)^4$).

### 5. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2 AAA)
- **Conformité SC 2.3.3** : Désactivation instantanée des animations sous `prefers-reduced-motion: reduce` (`duration: 0`, `animation: false`).
- **Contraste non-textuel SC 1.4.11** : Grille inactive contrastée à $\ge 3:1$ avec les cellules actives et le fond.


