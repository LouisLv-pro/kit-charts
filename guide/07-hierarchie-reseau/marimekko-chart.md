# Graphique Marimekko (Marimekko / Mekko / Mosaic Chart)

## 1. Description & Principe Visuel
Le graphique Marimekko (ou Mekko / Mosaic Plot) est un diagramme en barres empilées bidimensionnel où **à la fois la largeur des colonnes ET la hauteur des segments intérieurs** sont proportionnelles à des variables quantitatives. La surface totale de chaque rectangle représente ainsi le volume absolu du sous-segment dans la matrice globale ($100\% \times 100\%$).
- **Encodage primaire** : Largeur de colonne (poids d'une catégorie principale), hauteur de segment (part relative de la sous-catégorie) et **aire 2D du rectangle** (volume total).
- **Fonction cognitive** : Vision panoramique complète d'un marché en une seule vue (taille des segments de marché $\times$ parts de marché des acteurs).

---

## 2. Quand l'utiliser (Cas d'usage cibles)
- Analyse stratégique d'entreprise (ex: Marchés géographiques en largeur de colonne $\times$ Familles de produits en hauteur de segment).
- Tableaux de contingence statistiques avec test du Chi-carré (Mosaic plot de dépendance statistique).
- Nombre idéal : **3 à 6 colonnes et 2 à 4 segments par colonne**.

---

## 3. Quand NE PAS l'utiliser (Contre-indications)
- **Grand public ou utilisateurs pressés** : Le décodage conjoint de largeurs et hauteurs variables engendre une charge cognitive élevée et des erreurs d'estimation d'aire (Cleveland & McGill). 👉 *Remplacer par une série de 100% Stacked Bars accompagnées d'un Bar Chart de taille totale*.
- **Trop de micro-segments**.

---

## 4. Règles Cognitives & Meilleures Pratiques Spécifiques
- **Tri décroissant des largeurs de colonnes** de gauche à droite (le plus grand marché à gauche).
- **Tri décroissant des segments verticaux** de bas en haut.
- **Étiquetage adaptatif avec valeurs numériques** : Inscrire les labels et pourcentages uniquement dans les boîtes de surface suffisante.
- **Bordures blanches nettes** : `borderWidth: 1` à `2` pour individualiser les rectangles.

---

## 4.1 Règles Cognitives d'Accentuation & Valence

### Hiérarchie Visuelle & Ratio 90/10 (Tufte)
- **Cellules Focales (`role: 'focal'`)** : Les segments stratégiques prioritaires (ex: transition Électrique BEV dans les SUV) sont colorés via `tokens.emphasis.focal` pour guider immédiatement la fixation oculaire.
- **Cellules de Contexte (`role: 'context'`)** : Les motorisations matures ou neutres (ex: Hybride, Thermique conventionnel) utilisent des teintes atténuées (`tokens.emphasis.context` ou palette de base avec contraste contrôlé).
- **Anomalies / Ruptures (`role: 'anomaly'`)** : Les effondrements de segments ou parts de marché atypiques reçoivent `tokens.emphasis.anomaly` ou `tokens.status.danger`.

### Valence Métier & Directionnalité
- **Gain / Croissance de Part de Marché** : Pour les segments en forte progression ($+34.2\%$), la couleur de valence est résolue avec `getValenceColor(tokens, growth, 'gain')` (vert/succès).
- **Déclin / Régression** : Pour les segments en repli (ex: $-28.0\%$), la couleur de valence bascule sur `tokens.status.danger` (rouge/alerte).

### Double-Encodage Strict (Accessibilité & CVD Safe)
1. **Couleur + Surface Proportionnelle 2D** : La largeur de colonne $\times$ hauteur de segment encode la magnitude absolue indépendamment de la teinte.
2. **Bordures Séparatrices Nettes** : Séparation physique de chaque tuile par une bordure contrastée (`#FFFFFF` en mode clair, `tokens.bg` en mode sombre).
3. **Info-Bulle Sémantique Complète** : Rôle sémantique `[FOCAL]`, volume total (%), part relative intra-segment (%) et taux d'évolution A/A-1 ($+/\-$).

### Exemple de Configuration avec Tokens d'Accentuation
```javascript
import { getEmphasisStyle, getValenceColor, getThemeTokens } from '../../themes/theme-tokens.js';

const tokens = getThemeTokens('colorbrewer-accessible');

// Cellule focale stratégique (ex: Électrique)
const focalStyle = getEmphasisStyle(tokens, 'focal');
// { backgroundColor: '#2B8CBE', borderColor: '#FFFFFF', borderWidth: 2 }

// Couleur de valence dynamique basée sur la croissance annuelle
const growthColor = getValenceColor(tokens, +34.2, 'gain'); // tokens.status.success
const declineColor = getValenceColor(tokens, -28.0, 'gain'); // tokens.status.danger
```

---

## 5. Erreurs Fréquentes & Anti-Patterns Visuels
- ❌ **Colonnes filiformes illisibles** créées par des segments marginaux.
- ❌ **Absence de repères d'échelle en % sur les deux axes**.

---

## 6. Recommandations d'Implémentation Chart.js

### Configuration Type
- Plugin officiel requis : `chartjs-chart-matrix` ou tracé personnalisé avec barres variables.

```javascript
// Requiert: npm install chartjs-chart-matrix
import 'chartjs-chart-matrix';

// Données normalisées Mekko (Largeurs de colonnes cumulées et hauteurs relatives)
const config = {
  type: 'matrix',
  data: {
    datasets: [{
      label: 'Part de Marché Mekko',
      data: [
        // Colonne 1 : Europe (Largeur = 50%)
        { x: 0.25, y: 0.35, w: 0.5, h: 0.7, label: 'Produit A (Europe)', v: 350 },
        { x: 0.25, y: 0.85, w: 0.5, h: 0.3, label: 'Produit B (Europe)', v: 150 },
        // Colonne 2 : USA (Largeur = 35%)
        { x: 0.675, y: 0.25, w: 0.35, h: 0.5, label: 'Produit A (USA)', v: 175 },
        { x: 0.675, y: 0.75, w: 0.35, h: 0.5, label: 'Produit B (USA)', v: 175 },
        // Colonne 3 : Asie (Largeur = 15%)
        { x: 0.925, y: 0.40, w: 0.15, h: 0.8, label: 'Produit A (Asie)', v: 120 },
        { x: 0.925, y: 0.90, w: 0.15, h: 0.2, label: 'Produit B (Asie)', v: 30 }
      ],
      backgroundColor: (ctx) => ctx.raw?.label.includes('Produit A') ? '#2563EB' : '#93C5FD',
      borderWidth: 1,
      borderColor: '#FFFFFF',
      width: ({ chart, datasetIndex, dataIndex }) => {
        const item = chart.data.datasets[datasetIndex].data[dataIndex];
        return (chart.chartArea.width || 400) * item.w;
      },
      height: ({ chart, datasetIndex, dataIndex }) => {
        const item = chart.data.datasets[datasetIndex].data[dataIndex];
        return (chart.chartArea.height || 300) * item.h;
      }
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: { min: 0, max: 1, ticks: { callback: (v) => `${v * 100}%` } },
      y: { min: 0, max: 1, ticks: { callback: (v) => `${v * 100}%` } }
    },
    plugins: { legend: { display: false } }
  }
};
```

---

## 7. Sources & Références Académiques
- **Friendly, M. (1994)**. *Mosaic displays for multi-way contingency tables*. Journal of the American Statistical Association, 89(425), 190-200.
- **Hartigan, J. A., & Kleiner, B. (1981)**. *Mosaics for contingency tables*. Computer Science and Statistics: Proceedings of the 13th Symposium on the Interface.
- **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception: Theory, Experimentation, and Application to the Development of Graphical Methods*. JASA.
- **Fitts, P. M. (1954)**. *The information capacity of the human motor system in symbolizing amplitude of movement*. Journal of Experimental Psychology, 47(6), 381–391.
- **Mayer, R. E. (2009)**. *Multimedia Learning* (2nd ed.). Cambridge University Press.

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Modélisation du Pointage sur Pavés Mosaïques 2D (MacKenzie & Buxton)
Dans un graphique Marimekko (Mekko / Mosaic), chaque tuile rectangulaire possède une aire $A = W_{\text{col}} \times H_{\text{seg}}$ variable encodant deux grandeurs relatives simultanées.
Selon l'extension bivariée de Fitts :
- **Largeur et Hauteur Effectives** : La configuration `interaction: { mode: 'nearest', intersect: true }` permet une activation par collision surfacique directe. Pour les tuiles étroites ($W_{\text{col}} < 0.15$), la hauteur étendue $H_{\text{seg}}$ compense la contrainte latérale ($W_e = \min(W_{\text{col}}, H_{\text{seg}})$).
- **Index de Difficulté ($ID$)** : Les segments majeurs bénéficient d'une acquisition rapide ($MT \le 320\text{ms}$), tandis que les micro-segments ($< 5\%$ du marché) sont assistés par un rayon de tolérance de survol étendu (`pointHitRadius: 12px`).

### 2. Seuils Temporels & Modèle Humain Processeur (Card-Moran-Newell, Miller, Nielsen)
- **Instantanéité Causale ($\le 100\text{ms}$)** : Dès l'entrée sur un pavé de la mosaïque, la surbrillance de bordure et le feedback visuel s'activent en $100\text{ms}$ (`hover.animationDuration: 100ms`).
- **Filtrage Anti-Scintillement & Hystérésis** : Le délai anti-rebond ($80\text{ms}$) prévient les bascules intempestives lors du survol des frontières de colonnes, complété d'une hystérésis de $150\text{ms}$ pour stabiliser la consultation des données détaillées.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer, Sweller)
- **Contiguïté Visuelle & Déport Anti-Masquage** : L'infobulle est ancrée au centre géométrique du pavé survolé avec un déport vertical de $12\text{px}$.
- **Algorithme d'Inversion et de Clamping** : Lorsque le pavé se trouve dans la rangée supérieure ($y > 0.75$) ou sur les bords latéraux ($x < 0.2$ ou $x > 0.8$), l'infobulle bascule automatiquement vers le bas (`caretPosition: 'top'`) et s'aligne horizontalement pour éviter tout débordement.

### 4. Hiérarchie Cognitive des Infobulles (*Details-on-Demand*) & Typographie Tabulaire
L'infobulle décompose simultanément les dimensions horizontale, verticale et surfacique :
1. **Strate 1 (Libellé du Segment & Sous-Catégorie)** : En-tête sans-serif gras (`weight: 600`, $12\text{px}$).
2. **Strate 2 (Poids de la Colonne)** : Largeur relative en chiffres tabulaires (`raw.colWeightPct}% du total`).
3. **Strate 3 (Part Relative Intra-Segment)** : Hauteur de tranche (`raw.subSharePct}% de la colonne`).
4. **Strate 4 (Poids Global Produit)** : Aire totale résultante (`raw.marketShare}% du marché global`) et métrique d'évolution ($+/- \Delta\%$).

### 5. Cinématique des Courbes d'Amorti (*Easing Curves*) & Constance d'Objet
- **Déploiement Initial Proportionnel** : Animation de croissance en $400\text{ms}$ régie par `easeOutQuart` ($s(t) = 1 - (1-t)^4$), étendant d'abord les largeurs de colonnes puis les strates verticales de bas en haut.
- **Maintien des Ratios d'Aire** : Respect strict de la proportionnalité surfacique sans rebond ni dilatation oscillatoire non métrologique.

### 6. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2)
- **SC 2.3.3 (Animation from Interactions - AAA)** : Désactivation intégrale des animations (`duration: 0`) sous `prefers-reduced-motion: reduce`.
- **SC 1.4.3 & 1.4.6 (Contraste Élevé)** : Infobulle sombre à contraste $> 16:1$, bordures de séparation blanches ou foncées nettes ($\text{borderWidth} \ge 1.5\text{px}$) pour isoler les pavés adjacents de teintes proches.

