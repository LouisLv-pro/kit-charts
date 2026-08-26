# Diagramme en Arcs (Arc Diagram)

## 1. Description & Principe Visuel
L'Arc Diagram est une variante 1D du graphe de réseau où tous les nœuds sont alignés de façon ordonnée le long d'un axe linéaire horizontal unique, et les relations/liens sont représentés par des demi-cercles ou arcs reliant les paires de nœuds au-dessus (ou au-dessous) de l'axe.
- **Encodage primaire** : Position 1D ordonnée des nœuds, épaisseur de l'arc (intensité de la relation) et portée de l'arc (distance structurelle).
- **Avantage cognitif** : Préserve un ordre logique naturel des nœuds (chronologique, alphabétique, fonctionnel) qui est souvent détruit par les algorithmes de force 2D.

---

## 2. Quand l'utiliser (Cas d'usage cibles)
- Analyse de séquences de texte ou phrases (liens de co-occurrence ou répétition de mots).
- Appels de fonctions dans une trace d'exécution de code ou chaîne séquentielle de traitement.
- Réseaux où les nœuds ont un ordre naturel strict (ex: lignes de métro séquentielles, chapitres d'un livre).

---

## 3. Quand NE PAS l'utiliser (Contre-indications)
- **Réseaux topologiques non ordonnés très denses** : La superposition des arcs crée un fouillis horizontal. 👉 *Remplacer par une Matrice d'Adjacence ou Force-directed graph*.

---

## 4. Règles Cognitives & Meilleures Pratiques Spécifiques
- **Ordre méticuleux des nœuds** : L'efficacité cognitive d'un diagramme en arcs dépend à 90% du tri des nœuds. Utiliser un algorithme de réduction de bande passante (*Barycenter heuristic* ou clustering 1D) pour rapprocher les nœuds fortement connectés.
- **Opacité et épaisseur adaptatives des arcs** : Finesse et transparence proportionnelles pour distinguer les arcs courts des grands arcs englobants.

---

## 4.1 Règles Cognitives d'Accentuation & Valence

### Hiérarchie Visuelle & Ratio 90/10 (Tufte)
- **Nœuds & Arcs Focaux (`role: 'focal'`)** : Les étapes critiques ou flux majeurs (ex: Inférence IA, Détections Anomalies) reçoivent la couleur focale du thème (`tokens.emphasis.focal`), un rayon élargi ($r=12\text{px}$) et un trait d'arc renforcé.
- **Nœuds & Arcs de Contexte (`role: 'context'`)** : 90% des étapes amont constituent la chaîne nominale et sont atténuées avec la teinte de contexte (`tokens.emphasis.context` ou palette désaturée, $r=8\text{px}$, opacité 0.65).
- **Anomalies & Alertes (`role: 'anomaly'`)** : Les déviations ou erreurs de validation sont surlignées via `tokens.emphasis.anomaly` ou `tokens.status.danger`.

### Valence Métier & Directionnalité
- **Flux Nominaux / Gains Métier** : Traités avec la couleur focale ou `getValenceColor(tokens, '+', 'gain')` (vert/succès ou bleu focal).
- **Flux d'Erreurs / Rejets** : Encodés avec `tokens.status.danger` via `getValenceColor(tokens, '-', 'error')`.

### Double-Encodage Strict (Accessibilité & CVD Safe)
Ne jamais s'appuyer sur la couleur seule pour signaler un statut critique :
1. **Couleur + Rayon** : Les nœuds focaux et alertes possèdent un rayon différencié ($r=12\text{px}$ vs $r=8\text{px}$).
2. **Style de Trait d'Arc** : Arcs nominaux en trait continu (`ctx.setLineDash([])`) vs flux de rejet/erreur en pointillés (`ctx.setLineDash([4, 3])`).
3. **Badge Textuel** : Le tooltip affiche explicitement le rôle sémantique `[FOCAL]` ou `[ANOMALY]` et le statut d'opération.

### Exemple de Configuration avec Tokens d'Accentuation
```javascript
import { getEmphasisStyle, getValenceColor, getThemeTokens } from '../../themes/theme-tokens.js';

const tokens = getThemeTokens('colorbrewer-accessible');

// Configuration d'un nœud focal avec double-encodage
const focalNodeStyle = getEmphasisStyle(tokens, 'focal', { radius: 12 });
// { backgroundColor: '#2B8CBE', borderColor: '#FFFFFF', borderWidth: 2, pointRadius: 12 }

// Couleur d'un flux d'erreur (valence inversée / danger)
const errorLinkColor = getValenceColor(tokens, 'down', 'defect'); // '#C62828'
```

---

## 5. Erreurs Fréquentes & Anti-Patterns Visuels
- ❌ **Arcs opaques se croisant en masse au niveau de l'axe**.
- ❌ **Ordre aléatoire des nœuds** créant des enchevêtrements artificiels évitables.

---

## 6. Recommandations d'Implémentation Chart.js

### Configuration Type
- Implémenté sur Canvas Chart.js en dessinant des arcs de cercle `ctx.arc()` au-dessus d'un axe de points scatter.

```javascript
// Principe d'intégration des arcs sur Canvas
const nodes = [{ id: 'A', x: 1 }, { id: 'B', x: 2 }, { id: 'C', x: 3 }, { id: 'D', x: 4 }];
const links = [
  { source: 1, target: 2, weight: 2 },
  { source: 1, target: 4, weight: 4 },
  { source: 2, target: 3, weight: 1 }
];
// Les arcs sont dessinés avec un rayon R = Math.abs(x2 - x1) / 2 et centre au milieu
```

---

## 7. Sources & Références Académiques
- **Wattenberg, M. (2002)**. *Arc diagrams: visualizing structure in strings*. IEEE Symposium on Information Visualization (InfoVis 2002).
- **Heer, J., Bostock, M., & Ogievetsky, V. (2010)**. *A tour through the visualization zoo*. Communications of the ACM, 53(6), 59-67.
- **MacKenzie, I. S., & Buxton, W. (1992)**. *Extending Fitts' law to two-dimensional tasks*. Proc. ACM CHI '92, 219–226.
- **Mayer, R. E. (2009)**. *Multimedia Learning* (2nd ed.). Cambridge University Press.
- **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception*. JASA.

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Modélisation du Pointage Linéaire 1D (Shannon-MacKenzie)
Dans un diagramme en arcs, tous les nœuds sont alignés horizontalement sur l'axe $Y=0$. La trajectoire motrice s'effectue selon un balayage unidimensionnel ($X$) avec contrainte verticale stricte.
Selon la loi de Fitts :
- **Rayon d'Attraction Élargi** : Avec `interaction: { mode: 'nearest', intersect: false, axis: 'xy' }` et `pointHitRadius: 14px`, la largeur de cible motrice effective $W_e = 28\text{px}$ compense l'étroitesse visuelle des points discrets ($R \in [6, 12\text{px}]$).
- **Index de Difficulté ($ID$)** : La colinéarité des nœuds simplifie la loi de Fitts en un balayage 1D quasi-idéal : $MT \approx 110 + 175 \cdot \log_2(D/W_e + 1) \le 340\text{ms}$.

### 2. Seuils Temporels & Modèle Humain Processeur (Card-Moran-Newell, Miller, Nielsen)
- **Rétroaction Visuelle Instantanée ($\le 100\text{ms}$)** : Au survol d'un nœud, l'agrandissement dynamique (`pointHoverRadius: 11px`) et la mise en évidence des arcs incidents s'exécutent en $100\text{ms}$ (`hover.animationDuration: 100ms`).
- **Filtrage Anti-Scintillement & Persistance** : Un délai d'entrée de $80\text{ms}$ neutralise les activations parasites lors du balayage rapide de l'axe, complété par une persistance de $150\text{ms}$ pour garantir une lecture fluide sans clignotement.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer, Sweller)
- **Positionnement Infobulle Hors-Zone des Arcs** : Les arcs semi-circulaires se déployant au-dessus de l'axe ($y > 0$), l'infobulle est ancrée avec un déport de $14\text{px}$ et orientée de façon à ne pas masquer les courbures des liaisons critiques.
- **Inversion Verticale & Clamping Latéral** : En cas de proximité avec les bords horizontaux ($x < \text{margin}$ ou $x > \text{width} - \text{margin}$), l'infobulle subit un réalignement automatique empêchant tout débordement hors du canvas.

### 4. Hiérarchie Cognitive des Infobulles (*Details-on-Demand*) & Typographie Tabulaire
L'infobulle détaille les caractéristiques structurales du nœud ou de la liaison :
1. **Strate 1 (Identité du Nœud / Étape)** : Nom de l'entité en sans-serif gras (`weight: 600`, $12\text{px}$).
2. **Strate 2 (Position Séquentielle)** : Index ordinal en typographie tabulaire (`fontMono`, $12\text{px}$).
3. **Strate 3 (Degré & Connectivité)** : Nombre d'arcs entrants et sortants ($k_{\text{in}} / k_{\text{out}}$).
4. **Strate 4 (Rôle Sémantique & Statut)** : Mention explicite *[Focal]*, *[Contexte]* ou *[Anomalie / Déviation]*.

### 5. Cinématique des Courbes d'Amorti (*Easing Curves*) & Constance d'Objet
- **Déploiement Initial** : Transition en $400\text{ms}$ animée par `easeOutQuart` ($s(t) = 1 - (1-t)^4$), produisant une apparition progressive des nœuds suivie de l'élévation des arcs de liaison.
- **Préservation de la Topologie** : Aucune déformation élastique n'est appliquée sur les rayons de courbure pour éviter toute illusion d'oscillation gravitationnelle non physique.

### 6. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2)
- **SC 2.3.3 (Animation from Interactions - AAA)** : Désactivation immédiate (`duration: 0`) sous `@media (prefers-reduced-motion: reduce)`.
- **SC 1.4.3 & 1.4.6 (Contraste Élevé)** : Contraste de l'infobulle $> 16:1$, distinction des liaisons d'anomalie en pointillés (`setLineDash([4, 3])`) doublée d'un encodage couleur contrasté pour les usagers daltoniens.

