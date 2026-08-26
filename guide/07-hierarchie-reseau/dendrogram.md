# Dendrogramme & Arbre Hiérarchique (Dendrogram / Tree Diagram)

## 1. Description & Principe Visuel
Le dendrogramme est un diagramme arborescent qui visualise la taxonomie, la structure d'emboîtement ou les regroupements hiérarchiques issus d'un algorithme de classification (*Hierarchical Cluster Analysis* - HCA).
- **Encodage primaire** : Position des feuilles le long d'un axe (entités discrètes) et **hauteur/longueur des branches** (distance de dissimilarité ou niveau taxonomique).
- **Loi de Gestalt mobilisée** : Loi de Continuité et de Clôture (regroupements en sous-arbres évidents).

---

## 2. Quand l'utiliser (Cas d'usage cibles)
- Phylogénie, génomique et classification biologique des espèces.
- Segmentation de marché et classification automatique de clients/produits (*Cluster analysis*).
- Organigrammes d'entreprises et arbres de décision d'algorithmes (Random Forest / Decision Tree).

---

## 3. Quand NE PAS l'utiliser (Contre-indications)
- **Réseaux à maillages transversaux non arborescents** : Un dendrogramme impose un parent unique par nœud enfant. 👉 *Remplacer par un Graphe Nœuds-Liens*.
- **Focus sur la part dans le tout plutôt que la distance** : 👉 *Remplacer par un Treemap ou Sunburst*.

---

## 4. Règles Cognitives & Meilleures Pratiques Spécifiques
- **Orientation horizontale recommandée** : Racine à gauche, branches s'étendant vers la droite (facilite la lecture des noms d'entités sur les feuilles à droite sans rotation du texte).
- **Ligne de coupe de seuil (*Cutoff line*)** : Tracer une ligne perpendiculaire pointillée pour indiquer le niveau de similarité choisi découpant les $K$ clusters retenus.
- **Coloration des branches par cluster** : Colorer chaque sous-arbre distinct d'une teinte catégorielle spécifique sous la ligne de coupe.

---

## 4.1 Règles Cognitives d'Accentuation & Valence

### Hiérarchie Visuelle & Ratio 90/10 (Tufte)
- **Cluster Focal Cible (`role: 'focal'`)** : Le groupe d'intérêt prioritaire (ex: Grands Comptes B2B) est mis en avant avec la couleur saturée `tokens.emphasis.focal`, une largeur de trait supérieure ($3\text{px}$) et des points de feuilles grossis ($6\text{px}$).
- **Branches de Contexte (`role: 'context'`)** : Les clusters secondaires ou branches amont sont tracés en ardoise atténuée (`tokens.emphasis.context` ou `tokens.textMuted`), réduisant l'encombrement perceptif.
- **Ligne de Seuil Benchmark (`role: 'benchmark'`)** : La ligne de coupe $K$-clusters est encodée comme repère objectif (`tokens.emphasis.benchmark` ou `tokens.semantic.warning`, `borderDash: [6, 6]`).

### Valence Métier & Directionnalité
- **Clusters à Haute Valeur / Croissance** : Associés à une valence positive via `getValenceColor(tokens, '+', 'revenue')` ou `tokens.status.success`.
- **Clusters à Risque / Attrition (Churn)** : Encodés avec `tokens.status.danger` via `getValenceColor(tokens, 'up', 'churn')`.

### Double-Encodage Strict (Accessibilité & CVD Safe)
1. **Couleur + Épaisseur de Trait** : Les branches focales ont une épaisseur de $3\text{px}$ contre $1.5\text{px}$–$2\text{px}$ pour le contexte.
2. **Style de Ligne (Plein vs Pointillé)** : Branches taxonomiques en trait plein vs ligne de coupe seuil en pointillés stricts `[6, 6]`.
3. **Rayon des Points Terminaux** : Points feuilles à $6\text{px}$ (focal) vs $4\text{px}$ (contexte) vs $0\text{px}$ (seuils).

### Exemple de Configuration avec Tokens d'Accentuation
```javascript
import { getEmphasisStyle, getValenceColor, getThemeTokens } from '../../themes/theme-tokens.js';

const tokens = getThemeTokens('colorbrewer-accessible');

// Ligne de coupe benchmark (seuil HCA)
const benchmarkCutoff = getEmphasisStyle(tokens, 'benchmark', { borderDash: [6, 6] });
// { borderColor: '#475569', borderWidth: 2, borderDash: [6, 6] }

// Cluster B2B focalisé
const focalCluster = getEmphasisStyle(tokens, 'focal', { borderWidth: 3 });
// { borderColor: '#2B8CBE', backgroundColor: '#2B8CBE', borderWidth: 3 }
```

---

## 5. Erreurs Fréquentes & Anti-Patterns Visuels
- ❌ **Branches diagonales désordonnées** : Utiliser des connecteurs orthogonaux à angle droit ($90^\circ$) pour faciliter la comparaison de la hauteur des paliers.
- ❌ **Absence d'axe de distance / dissimilarité**.

---

## 6. Recommandations d'Implémentation Chart.js

### Configuration Type
- Plugin officiel requis : `chartjs-chart-dendrogram` (ou tracé en segments orthogonaux Canvas).

```javascript
// Requiert: npm install chartjs-chart-dendrogram
import 'chartjs-chart-dendrogram';

const config = {
  type: 'dendrogram',
  data: {
    datasets: [{
      tree: {
        id: 'Root',
        children: [
          {
            id: 'Cluster A',
            children: [{ id: 'Item 1' }, { id: 'Item 2' }]
          },
          {
            id: 'Cluster B',
            children: [{ id: 'Item 3' }, { id: 'Item 4' }]
          }
        ]
      },
      borderColor: '#2563EB',
      borderWidth: 2
    }]
  },
  options: {
    responsive: true,
    indexAxis: 'y'
  }
};
```

---

## 7. Sources & Références Académiques
- **Sokal, R. R., & Sneath, P. H. (1963)**. *Principles of Numerical Taxonomy*. W. H. Freeman.
- **Ward, J. H. (1963)**. *Hierarchical grouping to optimize an objective function*. Journal of the American Statistical Association, 58(301), 236-244.
- **Fitts, P. M. (1954)**. *The information capacity of the human motor system in symbolizing amplitude of movement*. Journal of Experimental Psychology, 47(6), 381–391.
- **Mayer, R. E. (2009)**. *Multimedia Learning* (2nd ed.). Cambridge University Press.
- **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception*. JASA.

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Modélisation du Pointage Hiérarchique Orthogonal (Shannon-MacKenzie)
Dans un dendrogramme horizontal, les embranchements successifs et les feuilles alignées sur l'axe vertical forment une grille orthogonale de segmentation.
Selon la modélisation de Fitts :
- **Attraction Continue 2D** : La configuration `interaction: { mode: 'nearest', intersect: false, axis: 'xy' }` couplée au rayon de capture `pointHitRadius: 12px` permet de cibler instantanément n'importe quel nœud ou coude de jonction sans exiger un centrage micrométrique du curseur.
- **Index de Difficulté ($ID$)** : Grâce à l'espacement unitaire régulier des feuilles sur l'axe Y (`stepSize: 1`), la distance motrice inter-clusters est bornée, assurant un temps d'acquisition $MT \le 360\text{ms}$.

### 2. Seuils Temporels & Modèle Humain Processeur (Card-Moran-Newell, Miller, Nielsen)
- **Instantanéité Perceptive ($\le 100\text{ms}$)** : Dès l'entrée du pointeur sur un nœud d'agrégation, la surbrillance de la branche et de ses sous-clade s'opère en $100\text{ms}$ (`hover.animationDuration: 100ms`).
- **Filtrage Anti-Scintillement & Persistance** : Le délai d'activation de $80\text{ms}$ supprime les papillotements lors du balayage de la ligne de coupe (*cutoff*), tandis que la persistance de $150\text{ms}$ garantit la stabilité de l'infobulle face aux tremblements physiologiques.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer, Sweller)
- **Ancrage Localisé Anti-Masquage** : L'infobulle est déportée de $12\text{px}$ à l'opposé du sens de progression de l'arbre pour ne pas masquer la ligne de coupe de seuil (*cutoff benchmark*) ou les feuilles adjacentes.
- **Inversion Automatique Haut/Bas** : En présence d'un cluster situé aux extrémités supérieure ou inférieure ($y \approx 1$ ou $y \approx y_{\max}$), l'infobulle inverse son quadrant vertical (`caretPosition: 'top'` / `'bottom'`) avec clamping latéral.

### 4. Hiérarchie Cognitive des Infobulles (*Details-on-Demand*) & Typographie Tabulaire
L'infobulle expose les caractéristiques taxonomiques de la partition :
1. **Strate 1 (Identifiant de Feuille / Sous-Clade)** : Nom du cluster ou profil client en sans-serif gras (`weight: 600`, $12\text{px}$).
2. **Strate 2 (Distance de Dissimilarité)** : Hauteur de jonction (Indice de Ward) formatée en chiffres tabulaires (`fontMono`, `raw.x.toLocaleString('fr-FR')`).
3. **Strate 3 (Position Taxonomique)** : Coordonnée ordinale sur l'axe hiérarchique ($Y$).
4. **Strate 4 (Rôle Analytique)** : Mention explicite *[Focal]*, *[Contexte]* ou *[Seuil de Partition]*.

### 5. Cinématique des Courbes d'Amorti (*Easing Curves*) & Constance d'Objet
- **Déploiement Initial** : Progression en $400\text{ms}$ suivant `easeOutQuart` ($s(t) = 1 - (1-t)^4$), animant les branches de la racine vers les feuilles pour refléter le processus de division hiérarchique.
- **Orthogonalité Stricte** : Tracé orthogonal sans courbure de Bézier afin de maintenir la rigueur métrologique de la projection de distance.

### 6. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2)
- **SC 2.3.3 (Animation from Interactions - AAA)** : Désactivation intégrale des micro-mouvements (`duration: 0`) sous `prefers-reduced-motion: reduce`.
- **SC 1.4.3 & 1.4.6 (Contraste Élevé)** : Fond d'infobulle `#0F172A` avec contraste $> 16:1$, ligne de coupe en tirets (`borderDash: [6, 6]`) pour une distinction sans ambiguïté chromatique.

