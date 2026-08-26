# Graphique en Entonnoir (Funnel Chart)

## 1. Description & Principe Visuel
Le diagramme en entonnoir visualise la réduction progressive d'une population ou d'un volume d'éléments à travers une séquence ordonnée d'étapes d'un processus linéaire.
- **Encodage primaire** : Largeur des sections ou barres horizontales (longueur 1D alignée) ordonnées de haut en bas.
- **Fonction cognitive** : Identifier instantanément les étapes de **friction majeure**, d'abandon et les **taux de conversion d'étape à étape**.

---

## 2. Quand l'utiliser (Cas d'usage cibles)
- Entonnoirs de conversion e-commerce (Visite $\rightarrow$ Ajout Panier $\rightarrow$ Paiement $\rightarrow$ Achat confirmé).
- Processus de recrutement RH (Candidatures $\rightarrow$ Entretiens RH $\rightarrow$ Tests $\rightarrow$ Offres $\rightarrow$ Embauches).
- Pipeline commercial B2B (Leads $\rightarrow$ Opportunités qualifiées $\rightarrow$ Devis $\rightarrow$ Signatures).
- Nombre d'étapes recommandé : **3 à 6 étapes séquentielles**.

---

## 3. Quand NE PAS l'utiliser (Contre-indications)
- **Étapes non linéaires ou avec retours en arrière** : 👉 *Remplacer par un Diagramme de Sankey*.
- **Mesures indépendantes ne formant pas un flux de rétention** : 👉 *Remplacer par un Bar Chart Horizontal*.

---

## 4. Règles Cognitives & Meilleures Pratiques Spécifiques
- **Double affichage systématique des métriques** :
  1. Le **volume absolu** restant à chaque étape (ex: `12 500 utilisateurs`).
  2. Le **taux de conversion relatif** par rapport à l'étape précédente (ex: `Taux d'abandon: 32%` ou `Conversion: 68%`).
- **Forme en barres horizontales calibrées plutôt qu'en entonnoir 3D biseauté** : L'entonnoir trapézoïdal lisse déforme l'aire perçue, tandis que des barres horizontales préservent l'exactitude de l'encodage par la longueur sur un axe commun.
- **Palette séquentielle décroissante ou accentuation sur l'étape critique**.

---

## 5. Erreurs Fréquentes & Anti-Patterns Visuels
- ❌ **Entonnoir 3D en cône** : Biais cognitif massif sur la hauteur vs le volume.
- ❌ **Omettre le calcul du delta / taux de chute entre étapes**.

---

## 6. Recommandations d'Implémentation Chart.js

### Configuration Type
- Type natif : `'bar'` avec `indexAxis: 'y'` et `scales.x.beginAtZero: true`.

```javascript
const config = {
  type: 'bar',
  data: {
    labels: ['1. Visiteurs', '2. Inscriptions', '3. Panier', '4. Paiement'],
    datasets: [{
      label: 'Volume',
      data: [10000, 3200, 1450, 480],
      backgroundColor: ['#1D4ED8', '#2563EB', '#3B82F6', '#60A5FA']
    }]
  },
  options: {
    responsive: true,
    indexAxis: 'y',
    scales: {
      x: { beginAtZero: true }
    },
    plugins: {
      legend: { display: false }
    }
  }
};
```

---

## Règles Cognitives d'Accentuation & Valence

### 1. Hiérarchie Visuelle & Ratio 90/10 (Étape de Chute Critique / Goulot d'Étranglement)
- **Étape Normale (*Progression Régulière*)** : Encodée avec la palette séquentielle naturelle du thème (`tokens.sequential`) ou une teinte neutre/bleutée (`tokens.emphasis.focal`).
- **Étape de Friction Critique / Décrochage (*Choke Point / Drop-Off Alert*)** : Si la déperdition entre deux étapes dépasse un seuil d'alerte (ex: $> 60\%$ d'abandon), la barre peut être rehaussée via `tokens.status.danger` ou `tokens.emphasis.anomaly` pour un déclenchement d'attention immédiat.
- **Étape de Conversion Finale (*Success Stage*)** : Le palier terminal peut être encodé avec `tokens.status.success` (`getValenceColor(tokens, 'up', 'gain')`) pour signifier l'aboutissement favorable du flux.

### 2. Valence Métier & Directionnalité dans le Pipeline
- **Rétention / Conversion Favorable** : $\text{Taux} \ge \text{Cible}$ $\to$ `tokens.status.success`.
- **Attrition / Abandon Anormal** : $\text{Chute} \ge \text{Seuil Critique}$ $\to$ `tokens.status.danger`.

### 3. Double-Encodage Strict (Longueur + Label Pourcentage + Badge d'Abandon)
1. **Canal 1 (Longueur 1D de barre)** : Encodage quantitatif exact du volume absolu ($X=0$ obligatoire).
2. **Canal 2 (Couleur séquentielle)** : Dégradé de saturation décroissant le long du tunnel.
3. **Canal 3 (Infobulle à calcul déterministe)** : Affichage systématique de 3 métriques :
   - Volume résiduel absolu.
   - Taux de conversion global depuis l'entrée ($E_i / E_0$).
   - Taux de rétention marginal ($E_i / E_{i-1}$) et pourcentage de perte.

### 4. Guide d'Implémentation & Exemple de Code

```javascript
import { getSequentialColor, getValenceColor, getThemeTokens } from '../../themes/theme-tokens.js';

const tokens = getThemeTokens('colorbrewer-accessible');

// Coloration séquentielle avec mise en valeur de la conversion finale
const funnelColors = [
  getSequentialColor(tokens, 0.4),
  getSequentialColor(tokens, 0.6),
  getSequentialColor(tokens, 0.8),
  getValenceColor(tokens, 'up', 'gain') // Vert succès pour l'achat final
];

const funnelDataset = {
  labels: ['Visites', 'Paniers', 'Adresses', 'Commandes'],
  datasets: [{
    data: [50000, 12000, 6000, 3200],
    backgroundColor: funnelColors
  }]
};
```

---

## 8. Sources & Références Académiques
- **Few, S. (2013)**. *Information Dashboard Design*, Section 5.
- **Ware, C. (2008)**. *Visual Thinking for Design*, pp. 88-95.
- **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception*. JASA.
- **Fitts, P. M. (1954)**. *The information capacity of the human motor system in symbolizing amplitude of movement*. Journal of Experimental Psychology, 47(6), 381–391.
- **Sweller, J. (1988)**. *Cognitive load during problem solving: Effects on learning*. Cognitive Science, 12(2), 257–285.

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Modélisation du Pointage par Tranche Horizontale (Shannon-MacKenzie)
Dans un entonnoir de conversion orienté horizontalement (`indexAxis: 'y'`), la tâche motrice consiste à explorer successivement des étapes superposées verticalement.
Selon la loi de Fitts :
- **Capture Indexée par Axe ($Y$)** : La configuration `interaction: { mode: 'index', intersect: false, axis: 'y' }` étend la surface de capture motrice à toute la hauteur de la tranche horizontale. L'Index de Difficulté ($ID$) tend vers $1.0\text{ bit}$ puisque le curseur n'a pas besoin de pointer avec précision sur la barre elle-même.
- **Largeur Effective Maximale** : Avec des ratios Gestalt calibrés (`categoryPercentage: 0.8`, `barPercentage: 0.85`), la hauteur de barre effective $W_e \ge 35\text{px}$ assure un temps de sélection neuromusculaire minimal $MT \approx 120 + 180 \cdot \log_2(D/W_e + 1) \le 350\text{ms}$.

### 2. Seuils Temporels & Modèle Humain Processeur (Card-Moran-Newell, Miller, Nielsen)
- **Instantanéité du Feedback ($\le 100\text{ms}$)** : Dès l'entrée du pointeur sur une strate du tunnel, l'effet de surbrillance s'active en $100\text{ms}$ (`hover.animationDuration: 100ms`).
- **Filtrage Anti-Flicker & Hystérésis** : Le filtre anti-rebond ($80\text{ms}$) prévient les à-coups visuels lors d'un défilement vertical rapide de haut en bas, tandis que l'hystérésis de $150\text{ms}$ stabilise l'affichage lors du survol des frontières d'étapes.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer, Sweller)
- **Contiguïté Visuo-Spatiale** : L'infobulle est ancrée directement sur l'étape pointée avec un déport horizontal/vertical de sécurité de $12\text{px}$.
- **Algorithme Anti-Occlusion Déterministe** : Lorsque la première étape (en haut) ou la dernière (en bas) est survolée, l'infobulle inverse son quadrant vertical (`caretPosition: 'top'` / `'bottom'`) avec clamping latéral strict, évitant tout masquage du libellé de l'étape ou de la barre de conversion.

### 4. Hiérarchie Cognitive des Infobulles (*Details-on-Demand*) & Typographie Tabulaire
L'infobulle calcule dynamiquement et affiche 4 grandeurs dérivées en typographie monospace tabulaire (`fontMono`) :
1. **Strate 1 (Étape du Pipeline)** : Libellé ordinal de l'étape en sans-serif gras (`weight: 600`).
2. **Strate 2 (Effectif Résiduel)** : Nombre absolu formaté (`currentVal.toLocaleString('fr-FR')`).
3. **Strate 3 (Taux de Conversion Global)** : Pourcentage cumulé depuis l'entrée ($E_i / E_0 \times 100\%$).
4. **Strate 4 (Rétention Marginale & Déperdition)** : Taux de passage ($E_i / E_{i-1}\%$) et chute d'étape ($\text{Chute}\%$).

### 5. Cinématique des Courbes d'Amorti (*Easing Curves*) & Constance d'Objet
- **Déploiement Initial** : L'animation de croissance des barres depuis $X=0$ utilise le profil `easeOutQuart` ($s(t) = 1 - (1-t)^4$) sur $400\text{ms}$. L'extension synchronisée de gauche à droite préserve l'analogie physique de remplissage de fluide.
- **Proscription Formelle** : Absence d'oscillations élastiques (`bounce`/`elastic`) pour maintenir la rigueur métrologique de la lecture quantitative.

### 6. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2)
- **SC 2.3.3 (Animation from Interactions - AAA)** : Bascule immédiate à `duration: 0` dès que le système client active `prefers-reduced-motion: reduce`.
- **SC 1.4.3 & 1.4.6 (Contraste Élevé)** : Infobulle sombre avec ratio de contraste $> 16:1$, libellés sur l'axe Y en typographie contrastée $\ge 4.5:1$.

