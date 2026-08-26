# Graphique en Cascade (Waterfall / Bridge Chart)

## 1. Description & Principe Visuel
Le graphique en cascade décompose la transition séquentielle d'une valeur initiale vers une valeur finale en affichant les contributions positives (gains) et négatives (pertes) successives sous forme de barres flottantes reliant chaque étape.
- **Encodage primaire** : Position et longueur des barres flottantes (encodage de niveau 1 & 3 de Cleveland & McGill).
- **Fonction cognitive** : Éclairer immédiatement le "Pourquoi" d'une variation financière ou opérationnelle (ex: Pourquoi le résultat net est passé de 10M€ à 7M€ malgré la hausse du chiffre d'affaires).

---

## 2. Quand l'utiliser (Cas d'usage cibles)
- Comptes de résultat financiers (EBITDA $\rightarrow$ Dépréciations $\rightarrow$ Intérêts $\rightarrow$ Impôts $\rightarrow$ Résultat Net).
- Réconciliation budgétaire (Budget Prévu vs Réalisé avec détail des écarts).
- Évolution du Headcount RH (Effectif initial + Recrutements - Démissions - Départs = Effectif final).
- Nombre d'étapes recommandé : **5 à 10 étapes**.

---

## 3. Quand NE PAS l'utiliser (Contre-indications)
- **Données non séquentielles ou non cumulatives** : 👉 *Remplacer par un Bar Chart standard*.
- **Plus de 15 étapes intermédiaires** : Surcharge la cascade de micro-piliers.

---

## 4. Règles Cognitives & Meilleures Pratiques Spécifiques
- **Code couleur sémantique strict** :
  - **Piliers totaux (Début et Fin)** : Couleur neutre sobre (Bleu ardoise foncé `#0F172A`).
  - **Contributions positives (+)** : Vert émeraude (`#059669`) ou Bleu vif.
  - **Contributions négatives (-)** : Rouge / Orange vif (`#DC2626`).
- **Lignes de liaison horizontales (Connecteurs)** : Tracer de fines lignes horizontales pointillées reliant le sommet de chaque barre à la base de la suivante pour renforcer la Loi de Continuité de la Gestalt.
- **Ligne de base zéro bien visible**.

---

## 5. Erreurs Fréquentes & Anti-Patterns Visuels
- ❌ **Colorer les barres de totaux de la même couleur que les variations positives**.
- ❌ **Absence de lignes de liaison** : Force l'utilisateur à projeter mentalement les alignements horizontaux.

---

## 6. Recommandations d'Implémentation Chart.js

### Configuration Type
- Type natif : `'bar'` avec barres flottantes définies par des paires de valeurs `[start, end]`.

```javascript
const config = {
  type: 'bar',
  data: {
    labels: ['CA Initial', 'Nouveaux Contrats', 'Pertes Clients', 'Inflation Coûts', 'Impôts', 'Résultat Net'],
    datasets: [{
      label: 'Montant (k€)',
      data: [
        [0, 500],      // Total initial
        [500, 680],    // +180 (Gain)
        [680, 590],    // -90  (Perte)
        [590, 520],    // -70  (Coût)
        [520, 430],    // -90  (Impôt)
        [0, 430]       // Total final
      ],
      backgroundColor: [
        '#0F172A',     // Total départ
        '#059669',     // Gain
        '#DC2626',     // Perte
        '#DC2626',     // Perte
        '#DC2626',     // Perte
        '#0F172A'      // Total arrivée
      ],
      borderRadius: 3
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: { grid: { display: false } },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: { callback: (v) => `${v} k€` }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const raw = ctx.raw;
            const diff = raw[1] - raw[0];
            return `Valeur : ${raw[1]} k€ (Variation : ${diff > 0 ? '+' : ''}${diff} k€)`;
          }
        }
      }
    }
  }
};
```

---

## Règles Cognitives d'Accentuation & Valence

### 1. Hiérarchie Visuelle & Ratio 90/10 (Totaux vs Variations d'Étapes)
Dans un graphique en cascade, la structure narrative repose sur la distinction nette entre les ancres d'agrégation et les flux de transition :
- **Piliers de Totaux (*Initial & Final Totals*)** : Encodés dans une teinte sombre et neutre (`tokens.emphasis.benchmark` ou `#0F172A` / `#475569`), démarrant toujours depuis la ligne de base zéro ($Y=0$).
- **Étapes Intermédiaires (*Gains & Losses Steps*)** : Barres flottantes encodées dynamiquement via le moteur de valence métier (`getValenceColor`).

### 2. Valence Métier & Directionnalité dans les Ponts Financiers
Le sens de la variation commande la coloration de chaque barre flottante :
- **Étape Favorable / Gain (+)** : $[y_0, y_1]$ avec $y_1 > y_0 \to$ `tokens.status.success` (`getValenceColor(tokens, 'up', 'gain')`).
- **Étape Défavorable / Perte / Coût (-)** : $[y_0, y_1]$ avec $y_1 < y_0 \to$ `tokens.status.danger` (`getValenceColor(tokens, 'down', 'gain')` ou `getValenceColor(tokens, 'up', 'cost')`).
- **Étape Neutre / Virement interne ($\Delta = 0$)** : Teinte `tokens.status.neutral`.

### 3. Double-Encodage Strict (Direction Flottante + Couleur + Signe Préfixe)
1. **Canal 1 (Couleur)** : Vert émeraude pour les flux positifs, rouge/ambre pour les flux négatifs, gris sombre pour les totaux.
2. **Canal 2 (Orientation spatiale)** : Barre ascendante (sommet plus haut que base) vs descendante (base suspendue au sommet précédent).
3. **Canal 3 (Signe explicite dans le libellé)** : Préfixes systématiques `+` et `-` dans les labels de catégories (`"+ Volume Ventes"`, `"- Coûts R&D"`).
4. **Canal 4 (Infobulle tabulaire)** : Décomposition du niveau absolu atteint et de la contribution nette de l'étape (`tabular-nums`).

### 4. Guide d'Implémentation & Exemple de Code

```javascript
import { getValenceColor, getThemeTokens } from '../../themes/theme-tokens.js';

const tokens = getThemeTokens('colorbrewer-accessible');

const posColor = getValenceColor(tokens, 'up', 'gain');
const negColor = getValenceColor(tokens, 'down', 'gain');
const totalColor = tokens.emphasis.benchmark || '#0F172A';

const waterfallDataset = {
  labels: ['Départ', '+ Ventes', '- Rabais', '- Frais', 'Arrivée'],
  datasets: [{
    data: [
      [0, 100],     // Total départ
      [100, 140],   // +40
      [140, 125],   // -15
      [125, 95],    // -30
      [0, 95]       // Total final
    ],
    backgroundColor: [totalColor, posColor, negColor, negColor, totalColor]
  }]
};
```

---

## 8. Sources & Références Académiques
- **Few, S. (2012)**. *Show Me the Numbers*, pp. 182-186.
- **Wong, D. M. (2010)**. *The Wall Street Journal Guide to Information Graphics*. W. W. Norton & Company.
- **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception*. JASA.
- **Fitts, P. M. (1954)**. *The information capacity of the human motor system in symbolizing amplitude of movement*. Journal of Experimental Psychology, 47(6), 381–391.
- **Card, S. K., Moran, T. P., & Newell, A. (1983)**. *The Psychology of Human-Computer Interaction*. Lawrence Erlbaum Associates.

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Modélisation du Pointage par Tranche Ordinale (Shannon-MacKenzie)
Dans un graphique en cascade (waterfall), les barres flottantes représentent des deltas relatifs superposés le long de l'axe temporel ou catégoriel.
Selon la formulation de Fitts :
- **Capture Indexée Continue ($X$)** : La configuration `interaction: { mode: 'index', intersect: false, axis: 'x' }` capture la colonne entière au survol sans exiger que le pointeur touche précisément le rectangle suspendu. L'Index de Difficulté ($ID$) est réduit à $1.0\text{ bit}$.
- **Épaisseur Effective des Barres** : Les ratios d'espacement Gestalt (`categoryPercentage: 0.8`, `barPercentage: 0.85`) fournissent une largeur effective $W_e \ge 35\text{px}$, éliminant les ratés moteurs et assurant un temps d'acquisition $MT \le 350\text{ms}$.

### 2. Seuils Temporels & Modèle Humain Processeur (Card-Moran-Newell, Miller, Nielsen)
- **Causalité Perceptive Immédiate ($\le 100\text{ms}$)** : L'effet de focus sur la colonne sélectionnée réagit en $100\text{ms}$ (`hover.animationDuration: 100ms`).
- **Filtrage Anti-Scintillement & Hystérésis** : Le délai de $80\text{ms}$ évite le papillotement lors du balayage horizontal des différentes étapes de la cascade, tandis que la persistance de $150\text{ms}$ maintient l'infobulle stable pour une lecture reposée.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer, Sweller)
- **Positionnement Anti-Occlusion Déterministe** : L'infobulle est ancrée verticalement au-dessus de la barre flottante avec un déport de $12\text{px}$.
- **Inversion de Quadrant & Clamping** : Si la barre atteint le sommet du graphique ou si le total initial/final touche le bord supérieur, l'infobulle bascule automatiquement vers le bas (`caretPosition: 'top'`) et s'aligne latéralement pour rester dans le canvas sans masquer le solde ou les connecteurs de cascade.

### 4. Hiérarchie Cognitive des Infobulles (*Details-on-Demand*) & Typographie Tabulaire
L'infobulle sépare rigoureusement les composantes de réconciliation financière :
1. **Strate 1 (Libellé de l'Étape)** : Intitulé de la variation ou du total en sans-serif gras (`weight: 600`).
2. **Strate 2 (Niveau Absolu Atteint)** : Valeur du palier cumulé formatée en chiffres tabulaires (`fontMono`, `val[1].toLocaleString('fr-FR')`).
3. **Strate 3 (Contribution Nette de l'Étape)** : Variation signée $+ / -$ formatée avec valence explicite (*[Gain]* vs *[Perte/Coût]*).
4. **Strate 4 (Poids Relatif)** : Impact en points de pourcentage vis-à-vis de l'ancre initiale.

### 5. Cinématique des Courbes d'Amorti (*Easing Curves*) & Constance d'Objet
- **Déploiement Initial Séquencé** : L'animation en $400\text{ms}$ utilise la courbe `easeOutQuart` ($s(t) = 1 - (1-t)^4$), guidant le regard séquentiellement de l'agrégat de départ vers l'agrégat d'arrivée.
- **Respect de la Congruence Physique** : Les barres flottantes émergent depuis leur niveau d'ancrage amont ($y_0 \to y_1$), matérialisant physiquement la cascade sans rupture spatio-temporelle.

### 6. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2)
- **SC 2.3.3 (Animation from Interactions - AAA)** : Désactivation instantanée (`duration: 0`) sous `prefers-reduced-motion: reduce`.
- **SC 1.4.3 & 1.4.6 (Contraste Élevé)** : Fond d'infobulle `#0F172A` avec texte `#F8FAFC` (contraste $> 16:1$), couleurs de valence vert (`status.success`) et rouge (`status.danger`) calibrées pour être CVD-Safe.

