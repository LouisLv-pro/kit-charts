# Diagramme Alluvial (Alluvial Diagram)

## 1. Description & Principe Visuel
Variante du diagramme de Sankey, le diagramme alluvial visualise comment des éléments ou groupes d'individus se redistribuent, fusionnent ou se scindent à travers plusieurs dimensions catégorielles successives ou au fil du temps.
- **Encodage primaire** : Hauteur des blocs verticaux aux nœuds (effectif d'un groupe) et **largeur des rubans curvilignes** reliant les étapes.
- **Différence avec Sankey** : Le Sankey se concentre sur la conservation physique d'une quantité énergétique ou monétaire dans un réseau, tandis que l'Alluvial se concentre sur les **changements d'états structurels ou catégoriels** d'une population fixe.

---

## 2. Quand l'utiliser (Cas d'usage cibles)
- Suivi de cohortes médicales ou sociologiques (ex: Statut professionnel à 20 ans $\rightarrow$ 30 ans $\rightarrow$ 40 ans).
- Étude des reports de voix entre deux tours d'élections politiques.
- Évolution des profils de clients (Nouveau $\rightarrow$ Régulier $\rightarrow$ VIP $\rightarrow$ Inactif).

---

## 3. Quand NE PAS l'utiliser (Contre-indications)
- **Comparaison purement statique de deux variables indépendantes** : 👉 *Remplacer par un Bar Chart 100% ou Mosaic Plot*.
- **Plus de 5 étapes consécutives avec fragmentation extrême**.

---

## 4. Règles Cognitives & Meilleures Pratiques Spécifiques
- **Alignement strict des blocs d'étapes verticaux** : Facilite la comparaison de la distribution marginale à chaque stade.
- **Couleur constante attachée à la cohorte d'origine** : Permet de suivre visuellement le devenir d'un groupe initial tout au long de la chaîne (Loi de Similarité).
- **Courbes splines lisses (Bézier cubique)** avec opacité `0.4` à `0.6`.

---

## 5. Erreurs Fréquentes & Anti-Patterns Visuels
- ❌ **Couleurs changeant à chaque étape pour un même flux** : Détruit la mémoire de travail de suivi.
- ❌ **Croisements de flux désordonnés** non optimisés algorithmiquement.

---

## 6. Recommandations d'Implémentation Chart.js

### Configuration Type
- Plugin officiel requis : `chartjs-chart-sankey` (configuré en mode catégoriel multi-étapes).

```javascript
// Requiert: npm install chartjs-chart-sankey
import 'chartjs-chart-sankey';

const config = {
  type: 'sankey',
  data: {
    datasets: [{
      label: 'Parcours Étudiants',
      data: [
        { from: 'Bac Général', to: 'Université', flow: 450 },
        { from: 'Bac Général', to: 'Grande École', flow: 250 },
        { from: 'Bac Techno', to: 'Université', flow: 80 },
        { from: 'Bac Techno', to: 'IUT / BTS', flow: 320 },
        { from: 'Université', to: 'Master / Cadre', flow: 380 },
        { from: 'Grande École', to: 'Master / Cadre', flow: 245 }
      ],
      colorFrom: (ctx) => '#3B82F6',
      colorTo: (ctx) => '#10B981',
      colorMode: 'gradient',
      nodeWidth: 12
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } }
  }
};
```

---

## Règles Cognitives d'Accentuation & Valence

### 1. Hiérarchie Visuelle & Ratio 90/10 (Cohorte Clé vs Flux Secondaires)
- **Cohorte Stratégique (*Hero Cohort*)** : Les rubans issus ou à destination du groupe d'intérêt principal (ex: Clients VIP ou Conversion cible) utilisent la couleur focale `tokens.emphasis.focal` avec une opacité renforcée ($\alpha \approx 0.70$).
- **Flux de Transition Secondaires (*Context Cohorts*)** : Encodés avec `tokens.emphasis.context` ou des nuances atténuées ($\alpha \approx 0.25 - 0.35$).

### 2. Valence Métier & Directionnalité dans les Parcours
Dans les diagrammes de flux d'utilisateurs ou de cohortes, chaque transition porte une charge sémantique orientée métier :
- **Transitions Positives / Upgrades (*Passage Gratuit $\to$ Pro, Renouvellement*)** : Mises en évidence via `status.success` (`getValenceColor(tokens, 'up', 'gain')`).
- **Transitions Négatives / Pertes (*Désabonnement, Churn, Abandon*)** : Encodées avec `status.danger` (`getValenceColor(tokens, 'up', 'churn')` ou `getValenceColor(tokens, 'down', 'gain')`).
- **Transitions Neutres / Maintien d'état** : Encodées en teintes neutres ou `tokens.status.info`.

### 3. Encodage des Flux Prévisionnels
- Si l'étape finale modélise une projection future de cohorte (ex: prévision d'attrition à $M+6$) :
  - Rubans avec opacité `tokens.emphasis.forecastAlpha` ($0.35 - 0.45$).
  - Bordures de nœuds en pointillés `borderDash: [4, 4]`.

### 4. Double-Encodage Strict (Direction, Teinte & Infobulle Qualifiée)
Pour pallier toute incertitude de décodage chromatique :
1. **Canal 1 (Couleur)** : Gradient de liaison teinté selon la valence de l'issue (`success` vert vs `danger` rouge).
2. **Canal 2 (Orientation spatiale)** : Flux strictly orienté de gauche à droite le long des niveaux de nœuds.
3. **Canal 3 (Infobulle contextuelle)** : Libellé explicite `"[Favorable]"` ou `"[Alerte / Churn]"` avec effectif brut et taux de passage en pourcentage.

### 5. Guide d'Implémentation & Exemple de Code

```javascript
import { getValenceColor, getThemeTokens } from '../../themes/theme-tokens.js';

const tokens = getThemeTokens('colorbrewer-accessible');

const alluvialDataset = {
  datasets: [{
    data: [
      { from: 'Inscrits', to: 'Actifs (Upgrade)', flow: 450, valence: 'positive' },
      { from: 'Inscrits', to: 'Désabonnés (Churn)', flow: 350, valence: 'negative' }
    ],
    colorFrom: (ctx) => {
      const item = ctx.dataset.data[ctx.dataIndex];
      return item.valence === 'positive'
        ? getValenceColor(tokens, 'up', 'gain')
        : getValenceColor(tokens, 'down', 'gain');
    },
    colorTo: (ctx) => {
      const item = ctx.dataset.data[ctx.dataIndex];
      return item.valence === 'positive'
        ? getValenceColor(tokens, 'up', 'gain')
        : getValenceColor(tokens, 'down', 'gain');
    },
    colorMode: 'gradient'
  }]
};
```

## 8. Sources & Références Académiques
- **Rosvall, M., & Bergstrom, C. T. (2010)**. *Mapping change in large networks*. PloS ONE, 5(1), e8694.
- **Vehlow, C., Beck, F., & Weiskopf, D. (2015)**. *Visualizing group structures in graphs: a survey*. Computer Graphics Forum.
- **Fitts, P. M. (1954)**. *The information capacity of the human motor system in symbolizing amplitude of movement*. Journal of Experimental Psychology, 47(6), 381–391.
- **Mayer, R. E. (2009)**. *Multimedia Learning* (2nd ed.). Cambridge University Press.
- **Card, S. K., Moran, T. P., & Newell, A. (1983)**. *The Psychology of Human-Computer Interaction*. Lawrence Erlbaum Associates.

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Modélisation du Pointage Topologique des Rubans (Shannon-MacKenzie)
Dans un diagramme alluvial, l'interaction s'effectue sur deux typologies d'entités géométriques : les **blocs de nœuds verticaux** (colonnes d'états à largeur fixe $W_n \approx 16\text{px}$) et les **rubans de flux curvilignes** (splines de Bézier à hauteur variable $H_f$).
Selon la formulation de Shannon-MacKenzie ($MT = a + b \cdot \log_2(D/W_e + 1)$) :
- **Rubans de flux** : La surface active s'étend horizontalement sur toute la travée inter-stades ($\Delta X \approx 120\text{--}200\text{px}$). En configurant l'intersection topologique (`mode: 'nearest', intersect: true`), la cible motrice bénéficie d'une tolérance d'acquisition continue le long de la spline, abaissant l'Index de Difficulté ($ID$) sous les $2.2\text{ bits}$ et autorisant un temps moteur $MT < 450\text{ms}$.
- **Nœuds d'étapes** : Les blocs verticaux sont dotés d'un espacement vertical (`nodePadding: 18px`) évitant toute collision parasite lors des microsaccades de pointage vertical.

### 2. Seuils Temporels & Modèle Humain Processeur (Card-Moran-Newell, Miller, Nielsen)
Le cycle perception-action lors de l'exploration de flux obéit aux constantes du Model Human Processor (MHP) :
- **Perception immédiate de causalité ($\le 100\text{ms}$)** : Au survol d'un ruban alluvial, le retour visuel (opacité accrue de $0.4$ à $0.75$, mise en surbrillance des nœuds source et cible) s'exécute avec une latence $\le 100\text{ms}$ (`hover.animationDuration: 100ms`), garantissant l'illusion cognitive de réactivité instantanée.
- **Stabilisation Anti-Scintillement (*Debounce & Hystérésis*)** : Un seuil de déclenchement de $80\text{ms}$ neutralise l'apparition intempestive d'infobulles lors des traversées transversales rapides du canvas. Une hystérésis de sortie ($150\text{ms}$) préserve l'affichage lors des tremblements physiologiques de l'opérateur.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer, Sweller)
- **Contiguïté Visuelle Fovéale** : L'infobulle (*Details-on-Demand*) est positionnée au point d'ancrage exact du curseur sur le ruban de flux avec un déport vertical de sécurité de $12\text{px}$.
- **Algorithme Anti-Occlusion** : Lorsque le pointeur approche des bordures supérieures ou latérales de la zone de tracé, la position de l'infobulle bascule automatiquement dans le quadrant opposé (`caretPosition: 'top'` si $y < \text{margin}$) avec clamping strict dans les limites du canvas ($x \in [\text{margin}, W - \text{margin}]$). Ce mécanisme élimine toute rupture attentionnelle (*split-attention effect*, Sweller 1988).

### 4. Hiérarchie Cognitive des Infobulles (*Details-on-Demand*) & Typographie Tabulaire
L'infobulle structure l'information en 4 strates cognitives distinctes :
1. **Strate 1 (Titre Contextuel)** : Nœud de départ $\to$ Nœud d'arrivée en typographie sans-serif demi-gras (`weight: 600`, $12\text{px}$).
2. **Strate 2 (Grandeur Primaire)** : Effectif exact de la cohorte formaté en chiffres tabulaires (`fontMono`, `toLocaleString('fr-FR')`).
3. **Strate 3 (Part Relative)** : Pourcentage de conversion vis-à-vis de l'étape amont ($X\%$).
4. **Strate 4 (Valence Métier)** : Qualification sémantique explicite (*[Favorable / Progression]*, *[Maintien]*, *[Alerte / Churn]*).

### 5. Cinématique des Courbes d'Amorti (*Easing Curves*) & Constance d'Objet
- **Déploiement Initial** : L'animation d'émergence des flux utilise la courbe `easeOutQuart` ($s(t) = 1 - (1-t)^4$) sur une durée bornée de $450\text{ms}$. L'expansion rapide initiale capte immédiatement la fovéa avant une décélération fluide sans à-coup.
- **Préservation de la Constance d'Objet (Heer & Robertson 2007)** : Les flux progressent strictement de gauche à droite selon la flèche du temps, renforçant le principe de congruence spatio-temporelle de Tversky. Les fonctions `easeIn`, `bounce` et `elastic` sont formellement proscrites pour éviter toute distraction oscillatoire en contexte analytique.

### 6. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2)
- **Critère de Succès 2.3.3 (Animation from Interactions - Niveau AAA)** : L'interrogation automatique de la préférence utilisateur `@media (prefers-reduced-motion: reduce)` via `isReducedMotionPreferred()` neutralise instantanément toutes les transitions animées (`duration: 0`, `hover.animationDuration: 0`).
- **Critère de Succès 1.4.3 & 1.4.6 (Contraste Élevé)** : Fond d'infobulle sombre (`#0F172A`) avec texte blanc pur (`#F8FAFC`) assurant un ratio de contraste $> 16:1$, complété par une bordure nette (`tokens.borderStrong`).

