# Carte Proportionnelle (Treemap)

## 1. Description & Principe Visuel
Inventé par Ben Shneiderman (1992), le Treemap affiche des données hiérarchiques ou catégorielles imbriquées sous forme de rectangles imbriqués dont la **surface** est strictement proportionnelle à une variable quantitative.
- **Encodage primaire** : Aire 2D du rectangle et regroupement spatial (Lois de Gestalt de Proximité et Clôture).
- **Encodage secondaire** : Couleur / Teinte pour représenter une seconde métrique quantitative (ex: taux de croissance) ou la catégorie d'appartenance.

---

## 2. Quand l'utiliser (Cas d'usage cibles)
- Afficher une décomposition en parts dans un tout pour un **grand nombre de catégories** (10 à 50+ éléments) où un camembert échoue totalement.
- Données hiérarchiques à 2 ou 3 niveaux (ex: Secteur > Sous-secteur > Entreprise).
- Visualiser simultanément le poids relatif (par la taille du rectangle) et la performance relative (par la couleur séquentielle/divergente).

---

## 3. Quand NE PAS l'utiliser (Contre-indications)
- **Comparaison quantitative de haute précision** : Comparer deux rectangles d'aspects différents (ex: un long et fin vs un carré) engendre un biais cognitif d'estimation de surface (Stevens' Power Law). 👉 *Remplacer par un Bar Chart Horizontal si la précision prime*.
- **Séries temporelles continues** : 👉 *Remplacer par un Line Chart ou Stacked Area*.
- **Très peu de catégories (≤ 4)** : 👉 *Remplacer par un Bar Chart*.

---

## 4. Règles Cognitives & Meilleures Pratiques Spécifiques
- **Algorithme de squarification (*Squarified Treemap*)** : Privilégier les ratios d'aspect proches du carré (proche de 1:1) plutôt que des rectangles étroits (*slice-and-dice*), car les carrés sont décodés avec 30% moins d'erreur par le système visuel (Bruls et al., 2000).
- **Hiérarchie typographique et étiquetage adaptatif** : N'afficher les labels textuels que dans les rectangles suffisamment grands pour éviter le texte tronqué illisible.
- **Bordures de démarcation fines et claires** : Utiliser un séparateur de 1px à 2px blanc ou sombre pour délimiter les boîtes.
- **Palette divergente pour la couleur secondaire** : Si la couleur encode une performance, utiliser une échelle divergente normalisée (ex: Vert/Bleu pour positif, Rouge/Orange pour négatif, Gris pour neutre).

---

## 5. Erreurs Fréquentes & Anti-Patterns Visuels
- ❌ **Rectangles trop petits microscopiques** : Sature l'écran de bruit visuel.
- ❌ **Nesting excessif (> 3 niveaux hiérarchiques)** : Perte complète de lisibilité de la structure globale.

---

## 6. Recommandations d'Implémentation Chart.js

### Configuration Type
- Plugin officiel requis : `chartjs-chart-treemap`

```javascript
// Requiert: npm install chartjs-chart-treemap
import 'chartjs-chart-treemap';

const config = {
  type: 'treemap',
  data: {
    datasets: [{
      tree: [
        { category: 'Tech', name: 'Cloud', value: 450, change: +18 },
        { category: 'Tech', name: 'Software', value: 320, change: +12 },
        { category: 'Tech', name: 'Hardware', value: 180, change: -4 },
        { category: 'Santé', name: 'Pharma', value: 290, change: +5 },
        { category: 'Santé', name: 'BioTech', value: 210, change: +22 },
        { category: 'Finance', name: 'Banque', value: 380, change: -2 }
      ],
      key: 'value',
      groups: ['category', 'name'],
      spacing: 2,
      borderWidth: 1,
      borderColor: '#FFFFFF',
      backgroundColor: (ctx) => {
        const item = ctx.raw?._data;
        if (!item) return '#CBD5E1';
        return item.change >= 0 ? '#2563EB' : '#DC2626'; // Double encodage couleur
      },
      labels: {
        display: true,
        formatter: (ctx) => `${ctx.raw._data.name}\n${ctx.raw.v} M€`,
        color: '#FFFFFF',
        font: { size: 11, weight: 'bold' }
      }
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false }
    }
  }
};
```

---

## 7. Sources & Références Académiques
- **Shneiderman, B. (1992)**. *Tree visualization with tree-maps: 2-d space-filling approach*. ACM Transactions on Graphics (TOG), 11(1), 92-99.
- **Bruls, M., Huizing, K., & van Wijk, J. J. (2000)**. *Squarified treemaps*. Data Visualization 2000, 33-42.
- **Heer, J., & Bostock, M. (2010)**. *Crowdsourcing Graphical Perception*. ACM CHI 2010.

---

## Règles Cognitives d'Accentuation & Valence

### 1. Hiérarchie Visuelle (Ratio 90/10 de Tufte & Focus Narratif)
- **Tuile Focale / Valeur Majeure** : Mettre en saillance les tuiles stratégiques avec une couleur saturée `tokens.emphasis.focal` ou une bordure contrastée.
- **Tuiles de Contexte** : Les catégories secondaires adoptent une palette atténuée `tokens.emphasis.context` (`#CBD5E1`) ou une gradation séquentielle de saturation modérée pour réduire la fatigue visuelle sur les structures denses ($N > 15$).

### 2. Valence Métier & Directionnalité (Gain vs Coût/Risque/Churn)
- **Double encodage Taille + Valence** :
  - La surface rectangle encode le volume / poids absolu ($M$ ou $\text{CA}$).
  - La couleur de fond encode la variation métier via `getValenceColor(tokens, delta, metricType)` :
    - Hausse sur métrique de Gain : `status.success` (vert).
    - Baisse sur métrique de Gain : `status.danger` (rouge).
    - Hausse sur métrique de Coût : `status.danger` (rouge).

### 3. Matrice de Double-Encodage Strict
- **Lisibilité intra-tuile garantie** :
  - Contraste adaptatif du texte : Blanc pur `#FFFFFF` sur tuiles sombres/saturées, sombre `#0F172A` sur tuiles claires.
  - Étiquetage textuel binaire : Nom de l'entité + valeur numérique formatée sur 2 lignes pour éliminer le besoin de légende déportée.

### 4. Exemple d'Implémentation Pratique

```javascript
import { createChart } from './template.js';
import { getThemeTokens, getEmphasisStyle, getValenceColor } from '../../themes/theme-tokens.js';

const tokens = getThemeTokens('colorbrewer-accessible');

const customData = {
  datasets: [{
    tree: [
      { category: 'Tech', name: 'Software', value: 450, valence: 12, metricType: 'gain' },
      { category: 'Tech', name: 'Hardware', value: 320, valence: -4, metricType: 'gain' },
      { category: 'Finance', name: 'Banque', value: 390, emphasisRole: 'focal' },
      { category: 'Finance', name: 'Assurance', value: 210, emphasisRole: 'context' }
    ],
    key: 'value',
    groups: ['category', 'name']
  }]
};

const chart = createChart('chartCanvas', customData, 'colorbrewer-accessible');
```

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Modélisation de la Cible Interactive (Fitts 1954, MacKenzie 1992)
- **Formulation mathématique 2D sur pavage rectangulaire** : Le temps d'acquisition motrice d'une tuile de dimensions $W \times H$ s'exprime selon le modèle Shannon-MacKenzie :
  $$MT = a + b \cdot \log_2\left(\frac{D}{\min(W, H)} + 1\right)$$
- **Algorithme Squarified & Optimisation de Fitts** : En forçant le ratio d'aspect des rectangles vers $\approx 1.0$ (tuiles quasi-carrées), l'algorithme *Squarified Treemap* maximise la dimension minimale effective $\min(W, H)$, minimisant ainsi l'indice de difficulté $ID$.
- **Gain psychomoteur mesuré** : Amélioration du temps de pointage de **$> 40\%$** par rapport aux découpages linéaires allongés (*slice-and-dice*), avec $ID \approx 1.6\text{ bit}$.

### 2. Seuils Temporels & Model Human Processor (Card, Moran, Newell 1983 ; Nielsen 1993)
- **Constantes MHP** : Cycle perceptif $\tau_p \approx 100\text{ms}$, cycle cognitif $\tau_c \approx 70\text{ms}$, cycle moteur $\tau_m \approx 70\text{ms}$.
- **Feedback de tuile $\le 100\text{ms}$** : Assombrissement/éclaircissement de la cellule active avec `hover.animationDuration: 100ms`.
- **Dynamique d'infobulle** :
  - Débounce d'entrée : $70\text{ms}$.
  - Hystérésis de maintien : $150\text{ms}$.
  - Fondu d'opacité : $120\text{ms}$ en `easeOutQuad`.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer 2001, Sweller 1988)
- **Principe de Contiguïté Spatiale (Mayer 2001)** : L'infobulle résout le manque d'espace des petites tuiles en affichant l'intégralité du chemin hiérarchique (`Catégorie > Sous-catégorie`) et la métrique exacte.
- **Anti-Occlusion déterministe** : Positionnement centré au-dessus de la tuile avec déport et inversion automatique si la cellule borde le cadre du canvas.
- **Structure cognitive *Details-on-Demand*** :
  1. Catégorie et nom de l'entité (Sans-serif 12px, Weight 600).
  2. Valeur absolue (`fontMono` 12px, chiffres tabulaires `tabular-nums`).
  3. Poids relatif dans la branche et sur l'ensemble de la carte.

### 4. Cinématique des Courbes d'Amorti & Constance d'Objet (Penner 2002, Heer & Robertson 2007)
- **Rendu initial 2D** : Transition de pavage spatial en $400\text{ms}$ avec profil polynomial `easeOutQuart` ($s(t) = 1 - (1 - t)^4$), stabilisant la grille sans scintillement.

### 5. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2 AAA)
- **Conformité SC 2.3.3** : Désactivation instantanée des animations sous `prefers-reduced-motion: reduce` (`duration: 0`, `animation: false`).
- **Contraste de bordure SC 1.4.11** : Espacement et bordures nettes `tokens.bg` de $1.5\text{px}$ délimitant les cellules adjacentes.


