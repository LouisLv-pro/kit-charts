# Graphique à Puces (Bullet Graph / Bullet Chart) — Combo Fondateur

## 1. Description & Principe Visuel (Archétype du Graphique Combiné)
Inventé en 2005 par l'expert en ergonomie visuelle **Stephen Few** (*Perceptual Edge*, 2005 ; *Information Dashboard Design*, 2006) en remplacement direct des jauges circulaires (*speedometer gauges*), le **Bullet Graph** constitue le **combo historique fondateur** de la datavisualisation moderne.

Il réussit la synthèse élégante de **trois couches d'information hétérogènes sur un axe de mesure unique et partagé**, sans jamais recourir à un double axe :
1. **La mesure principale (Hero / Réalisé)** : Encodée par une barre centrale étroite (longueur proportionnelle à la valeur).
2. **Le repère comparatif (Benchmark / Cible)** : Encodé par un marqueur transversal fin et net (`pointStyle: 'line'`, rotation 90°).
3. **Le contexte qualitatif (Plages de performance)** : Encodé par 2 à 3 bandes d'arrière-plan en dégradé de nuances neutres monochromes (faible, moyen, excellent).

- **Encodage primaire** : Longueur sur échelle commune (Cleveland & McGill 1984 — niveau 2 de précision perceptive).
- **Ratio Data-Ink (Tufte 1983)** : Maximal — suppression de 100% du gaspillage spatial des jauges à cadran (gain d'espace jusqu'à 80%).
- **Intégration cognitive (Sweller 1988, Mayer 2001)** : Élimine l'effet de division de l'attention (*split-attention effect*) en intégrant la cible et le barème d'évaluation directement dans l'empreinte spatiale de la mesure.

---

## 2. Fondements Scientifiques & Justification Cognitive
- **Few, S. (2005)**. *Bullet Graph Design Specification*. Perceptual Edge.
- **Few, S. (2006)**. *Information Dashboard Design: The Effective Visual Communication of Data*. O'Reilly Media.
- **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception: Theory, Experimentation, and Application to the Development of Graphical Methods*. Journal of the American Statistical Association, 79(387), 531-554.
- **Sweller, J. (1988)**. *Cognitive Load During Problem Solving: Effects on Learning*. Cognitive Science, 12(2), 257-285.
- **Tufte, E. R. (1983)**. *The Visual Display of Quantitative Information*. Graphics Press.
- **Mayer, R. E. (2001)**. *Multimedia Learning*. Cambridge University Press.

---

## 3. Formulation Mathématique Déterministe

### 3.1 Écart Relatif à la Cible (Variance Delta)
$$\Delta_{\text{rel}} = \frac{v_{\text{actuel}} - v_{\text{cible}}}{v_{\text{cible}}} \times 100\%$$

### 3.2 Positionnement des Paliers Qualitatifs
Pour une métrique à polarité positive (*higher is better*) bornée sur $[0, V_{\max}]$ :
- **Zone 1 (Critique / Faible)** : $[0, k_1 \cdot v_{\text{cible}}]$ avec typiquement $k_1 = 0.60$
- **Zone 2 (Satisfaisant / Moyen)** : $[k_1 \cdot v_{\text{cible}}, k_2 \cdot v_{\text{cible}}]$ avec typiquement $k_2 = 0.85$
- **Zone 3 (Excellent / Optimal)** : $[k_2 \cdot v_{\text{cible}}, V_{\max}]$ avec $V_{\max} \ge 1.20 \cdot v_{\text{cible}}$

---

## 4. Quand l'utiliser (Cas d'usage cibles)
- **KPIs de performance opérationnelle** : Réalisé vs Objectif / Cible vs Année N-1.
- Remplacer avantageusement les jauges de type "compteur de vitesse" (*speedometer / gauge charts*) qui gaspillent jusqu'à 80% de l'espace écran pour un seul chiffre.
- Tableaux de bord denses nécessitant d'aligner 5 à 15 indicateurs clés sur un espace compact.
- Synthèses exécutives où le diagnostic de performance doit être immédiat (atteint / en retard / critique).

---

## 5. Quand NE PAS l'utiliser (Contre-indications)
- **Analyse de distribution statistique** : 👉 *Remplacer par un Box Plot, Box-Strip Plot ou Raincloud Plot*.
- **Évolution temporelle continue** : 👉 *Remplacer par une Sparkline, Line Chart ou Candlestick-Volume*.
- **Multiples cibles concurrentes (> 2 cibles par indicateur)** : Le marqueur unique devient confus.
- **Présentation grand public non formée** sans libellé explicatif direct.

---

## 6. Règles Cognitives d'Accentuation & Valence

### 1. Hiérarchie Visuelle (Ratio 90/10 de Tufte & Focus Narratif)
- **Barre de Réalisé (Hero)** : La barre de mesure réelle utilise la teinte focale vive `tokens.emphasis.focal` ou la couleur de valence `tokens.status.success / danger` avec une opacité maximale (1.0) et une largeur de 35% à 45% de la bande.
- **Marqueur de Cible (Benchmark)** : Trait perpendiculaire net en `tokens.emphasis.benchmark` ou `textPrimary` (`pointStyle: 'line'`, rotation 90°, épaisseur 3px).
- **Paliers Qualitatifs (Contexte)** : Bandes de fond désaturées (`tokens.emphasis.context` ou opacités décroissantes 0.18 / 0.10 / 0.04).

### 2. Valence Métier & Directionnalité (Gain vs Coût/Risque/Churn)
- **Évaluation de performance automatisée** :
  - Métrique de Gain (ex: CA réalisé vs objectif) : si $\text{Valeur} \ge \text{Cible}$, la barre est validée en `status.success` ; si critique (< 90%), en `status.danger`.
  - Métrique de Coût / Churn (ex: Coûts opérationnels vs plafond) : si $\text{Valeur} \le \text{Plafond}$, statut `status.success` ; si dépassement, statut `status.danger`.
- **Calculateur de seuil** : Exploiter le helper universel `getThresholdStatus(value, target, thresholds, polarity)`.

### 3. Matrice de Double-Encodage Strict
- **Non-ambiguïté des statuts de performance** :
  - Marqueur d'objectif : Symbole géométrique en barre verticale distincte + tooltip avec delta chiffré (`+/-X%`).
  - Statut KPI : Couleur de barre + libellé textuel explicite (*"Atteint"*, *"Vigilance"*, *"Critique"*).

---

## 7. Recommandations d'Implémentation Chart.js

```javascript
import { createChart } from './template.js';
import { getThemeTokens, getThresholdStatus } from '../../../themes/theme-tokens.js';

const tokens = getThemeTokens('colorbrewer-accessible');
const statusEmea = getThresholdStatus(275, 250, { warning: 0.9, success: 1.0 }, 'higher-is-better', tokens);

const customData = {
  labels: ['Ventes EMEA'],
  datasets: [
    {
      label: `Réalisé (${statusEmea.label})`,
      data: [275],
      backgroundColor: statusEmea.color
    },
    {
      label: 'Objectif (250 k€)',
      data: [250]
    },
    { label: 'Excellent', data: [300] },
    { label: 'Moyen', data: [200] },
    { label: 'Faible', data: [100] }
  ]
};

const chart = createChart('chartCanvas', customData, 'colorbrewer-accessible');
```

---

## 8. Psychophysique de l'Interaction, Infobulles & Micro-Animations

### 1. Loi de Fitts & Modélisation de la Cible Interactive (Fitts 1954, MacKenzie 1992)
- **Attraction 1D indexée sur l'axe Y** : Pour le Bullet Chart (Stephen Few), l'interaction est configurée en `mode: 'index'`, `axis: 'y'`, `intersect: false`. La capture englobe l'ensemble de la bande horizontale de la jauge, intégrant instantanément la barre de réalisation, la cible et les paliers qualitatifs ($W_e = H_{\text{jauge}}$).
- **Gain psychomoteur mesuré** : Réduction du temps d'acquisition motrice ($ID \to 1.1\text{ bit}$), supprimant la difficulté de viser le trait fin de la cible (3px).

### 2. Seuils Temporels & Model Human Processor (Card, Moran, Newell 1983 ; Nielsen 1993)
- **Réactivité de survol $\le 100\text{ms}$** : Activation immédiate du réticule et surbrillance du réalisé sans latence.
- **Dynamique d'infobulle** : Débounce anti-flicker d'entrée $70\text{ms}$, hystérésis de sortie $150\text{ms}$, fondu $120\text{ms}$ `easeOutQuad`.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du Split-Attention (Mayer 2001, Sweller 1988)
- L'infobulle consolide les 3 couches du Bullet Chart en une vue unifiée sans légende externe :
  1. Indicateur mesuré & Catégorie (`tokens.fontFamily`, Weight 600).
  2. Réalisé vs Cible (`fontMono` 12px, chiffres tabulaires `tabular-nums`).
  3. Variance chiffrée ($\Delta\%$) et palier qualitatif atteint (*"Excellent"*, *"Conforme"*, *"Critique"*).

### 4. Cinématique des Courbes d'Amorti & Constance d'Objet (Penner 2002, Heer & Robertson 2007)
- **Rendu initial** : Durée $400\text{ms}$ avec profil `easeOutQuart` ($s(t) = 1 - (1 - t)^4$). Émergence de la barre de mesure depuis $X=0$ et apparition simultanée du marqueur de cible.
- **Sobriété Few & Tufte** : Aucune animation de rebond (*bounce*) ou de pulsation continue.

### 5. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2 AAA)
- **Conformité SC 2.3.3** : Prise en charge native de `@media (prefers-reduced-motion: reduce)` via `isReducedMotionPreferred()` désactivant les transitions animées (`duration: 0`, `animation: false`).
- **Contraste de statut SC 1.4.3 / 1.4.11** : Contraste $\ge 4.5:1$ pour les barres de statut et $> 16:1$ pour le texte de l'infobulle.
