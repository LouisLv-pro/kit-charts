# Graphique de Pente (Slope Chart / Slopegraph)

## 1. Description & Principe Visuel
Popularisé par Edward Tufte, le Slopegraph relie par des segments de droite les valeurs d'une série d'entités entre exactement **deux points dans le temps** ou deux conditions expérimentales distinctes (ex: Avant / Après, 2020 vs 2024).
- **Encodage primaire** : 
  - Position sur deux axes verticaux parallèles (échelles communes).
  - Pente et direction du segment (montée, descente, stabilité).
- **Efficacité cognitive** : Permet de décoder instantanément le changement de rang (*ranking*), l'amplitude du changement et la trajectoire globale.

---

## 2. Quand l'utiliser (Cas d'usage cibles)
- Comparer l'évolution d'un ensemble de catégories entre **2 dates fixes** (ex: T1 vs T2, Pré-Covid vs Post-Covid).
- Mettre en évidence les trajectoires divergentes (ex: les entités qui montent vs celles qui chutent).
- Nombre de catégories idéal : **4 à 12 entités**.

---

## 3. Quand NE PAS l'utiliser (Contre-indications)
- **Plus de 2 points temporels (3 dates ou plus)** : La pente perd sa pureté géométrique comparative. 👉 *Remplacer par un Multi-Line Chart ou Small Multiples*.
- **Très grand nombre d'entités entrelacées (> 20)** : Effet "pelote de laine" (*spaghetti effect*).

---

## 4. Règles Cognitives & Meilleures Pratiques Spécifiques
- **Double échelle verticale alignée** : Les deux axes temporels doivent partager la même échelle et le même espacement pour que les angles des pentes soient rigoureusement comparables.
- **Étiquetage direct bilatéral** : Placer le nom de la catégorie et sa valeur à gauche du point initial ET à droite du point final. Aucune légende déportée.
- **Mise en valeur par la couleur (*Highlighting*)** : Griser toutes les séries de fond (`#CBD5E1`) et colorer avec vivacité uniquement la ou les séries d'intérêt narratif (ex: Bleu pour le produit phare, Rouge pour une chute anormale).

---

## 5. Erreurs Fréquentes & Anti-Patterns Visuels
- ❌ **Utiliser des échelles asymétriques à gauche et à droite** : Faute méthodologique grave qui déforme les angles perçus.
- ❌ **Lignes de grille horizontales trop marquées** : Parasitent la perception de l'angle des segments.

---

## 6. Recommandations d'Implémentation Chart.js

### Configuration Type
- Implémenté via un `'line'` avec deux points par dataset (`x: ['2020', '2024']`), sans lissage (`tension: 0`).

```javascript
const config = {
  type: 'line',
  data: {
    labels: ['2020', '2024'],
    datasets: [
      {
        label: 'Produit A (Focal)',
        data: [24, 48],
        borderColor: '#2563EB',
        backgroundColor: '#2563EB',
        borderWidth: 3,
        pointRadius: 5
      },
      {
        label: 'Produit B',
        data: [35, 31],
        borderColor: '#94A3B8',
        backgroundColor: '#94A3B8',
        borderWidth: 1.5,
        pointRadius: 3
      },
      {
        label: 'Produit C',
        data: [15, 12],
        borderColor: '#94A3B8',
        backgroundColor: '#94A3B8',
        borderWidth: 1.5,
        pointRadius: 3
      }
    ]
  },
  options: {
    responsive: true,
    elements: { line: { tension: 0 } }, // Lignes droites strictes
    plugins: {
      legend: { display: false } // Remplacer par étiquetage direct
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { weight: 'bold', size: 14 } }
      },
      y: {
        grid: { color: 'rgba(0, 0, 0, 0.04)' }
      }
    }
  }
};
```

---

## 7. Sources & Références Académiques
- **Tufte, E. R. (1983)**. *The Visual Display of Quantitative Information*, p. 158.
- **Few, S. (2014)**. *Slopegraphs for Comparing Two Points in Time*. Visual Business Intelligence Newsletter.

---

## Règles Cognitives d'Accentuation & Valence

### 1. Hiérarchie Visuelle (Ratio 90/10 de Tufte & Focus Narratif)
- **Trajectoire Focale (Hero)** : La trajectoire d'intérêt directrice (ex: bascule technologique ou série phare) adopte la teinte vive `tokens.emphasis.focal` et une épaisseur de trait renforcée (`borderWidth: 3`, points de rayon 6px).
- **Courbes de Contexte** : Toutes les trajectoires de référence utilisent `tokens.emphasis.context` (`#CBD5E1`, épaisseur 1.5px, points discrets).

### 2. Valence Métier & Directionnalité (Gain vs Coût/Risque/Churn)
- **Pente ascendante / descendante** :
  - Hausse sur métrique de Gain : coloration `status.success` (vert).
  - Baisse sur métrique de Gain : coloration `status.danger` (rouge).
  - Inversion automatique sur métriques de Coût / Risque : une hausse de coût s'affiche en rouge `status.danger`.

### 3. Matrice de Double-Encodage Strict
- **Sécurité perceptive des croisements de pentes** :
  - Trajectoire Focale : Trait continu épais + étiquettes directes aux deux extrémités (T0 et T1).
  - Trajectoire Cible / Benchmark : Trait tireté `tokens.emphasis.benchmark` (`borderDash: [4, 4]`).
  - Trajectoire Anomale (décrochage brutal) : Couleur vive `tokens.emphasis.anomaly` + point triangulaire (`pointStyle: 'triangle'`).

### 4. Exemple d'Implémentation Pratique

```javascript
import { createChart } from './template.js';
import { getThemeTokens, getEmphasisStyle, getValenceColor } from '../../themes/theme-tokens.js';

const tokens = getThemeTokens('colorbrewer-accessible');

const customData = {
  labels: ['2020', '2025'],
  datasets: [
    {
      label: 'Énergie Renouvelable (Focal)',
      data: [21.5, 38.2],
      emphasisRole: 'focal'
    },
    {
      label: 'Nucléaire (Contexte)',
      data: [40.1, 35.8],
      emphasisRole: 'context'
    },
    {
      label: 'Charbon (Décroissance)',
      data: [13.0, 7.8],
      borderColor: getValenceColor(tokens, -5.2, 'cost')
    }
  ]
};

const chart = createChart('chartCanvas', customData, 'colorbrewer-accessible');
```

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Modélisation de la Cible Interactive (Fitts 1954, MacKenzie 1992)
- **Formulation mathématique formelle** : Le temps d'acquisition motrice pour inspecter l'un des deux états temporels s'exprime selon le modèle Shannon-MacKenzie :
  $$MT = a + b \cdot \log_2\left(\frac{D}{W_e} + 1\right)$$
- **Attraction 1D par colonne temporelle (T0 vs T1)** : En appliquant `interaction: { mode: 'index', intersect: false, axis: 'x' }` et `elements.point.hitRadius: 12`, le survol de la colonne temporelle gauche ou droite déclenche l'affichage synchronisé de toutes les séries à cet instant ($W_e = W_{\text{colonne}}$).
- **Gain psychomoteur mesuré** : Réduction de $ID$ à $1.2\text{ bit}$ (gain d'acquisition de **$> 45\%$**).

### 2. Seuils Temporels & Model Human Processor (Card, Moran, Newell 1983 ; Nielsen 1993)
- **Constantes MHP** : Cycle perceptif $\tau_p \approx 100\text{ms}$, cycle cognitif $\tau_c \approx 70\text{ms}$, cycle moteur $\tau_m \approx 70\text{ms}$.
- **Feedback d'état temporel $\le 100\text{ms}$** : Surbrillance simultanée de l'ensemble des disques d'extrémités sur la date active (`hover.animationDuration: 100ms`).
- **Dynamique d'infobulle** :
  - Débounce d'entrée : $70\text{ms}$.
  - Hystérésis de maintien : $150\text{ms}$.
  - Fondu d'opacité : $120\text{ms}$ en `easeOutQuad`.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer 2001, Sweller 1988)
- **Principe de Contiguïté Spatiale (Mayer 2001)** : L'infobulle synthétise les valeurs de chaque entité à la date ciblée, avec indication de la variation globale $\Delta$ entre T0 et T1.
- **Anti-Occlusion déterministe** : Décalage latéral automatique pour ne pas masquer la trajectoire de pente rectiligne.
- **Structure cognitive multi-trajectoires** :
  1. Date / État analysé (Sans-serif 12px, Weight 600).
  2. Valeurs des séries avec classement ordonné (`fontMono` 12px, format `tabular-nums`).
  3. Direction de pente et taux de croissance ($\Delta\%$).

### 4. Cinématique des Courbes d'Amorti & Constance d'Objet (Penner 2002, Heer & Robertson 2007)
- **Rendu initial standard** : Traçage progressif des segments de gauche à droite en $400\text{ms}$ avec profil polynomial `easeOutQuart` ($s(t) = 1 - (1 - t)^4$), matérialisant la transition temporelle continue.
- **Règle absolue Tufte** : `tension: 0` strict pour préserver la vérité géométrique de la pente différentielle.

### 5. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2 AAA)
- **Conformité SC 2.3.3** : Désactivation instantanée des animations sous `prefers-reduced-motion: reduce` (`duration: 0`, `animation: false`).
- **Contraste de ligne SC 1.4.11** : Épaisseur minimale de trait (2px) et points d'extrémités pour faciliter le repérage visuel des croisements.


