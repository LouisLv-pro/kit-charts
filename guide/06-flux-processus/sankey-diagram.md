# Diagramme de Sankey (Sankey Diagram)

## 1. Description & Principe Visuel
Le diagramme de Sankey visualise le transfert et la transformation de flux (énergie, argent, matières, trafic web) entre différents nœuds à travers un réseau orienté.
- **Encodage primaire** : **Largeur de la bande de liaison (*Link width*)** strictement proportionnelle au volume du flux transporté (Loi de conservation du flux : $\sum \text{Entrées} = \sum \text{Sorties}$).
- **Lois de Gestalt mobilisées** : Continuité et Destin Commun (l'œil suit les flux ramifiés d'une étape à la suivante).

---

## 2. Quand l'utiliser (Cas d'usage cibles)
- Analyser les déperditions d'énergie, les allocations budgétaires complexes (recettes $\rightarrow$ ministères $\rightarrow$ programmes).
- Parcours utilisateurs Web multi-étapes avec embranchements et abandons.
- Nombre de nœuds recommandé : 10 à 30 nœuds répartis sur 2 à 5 niveaux de profondeur.

---

## 3. Quand NE PAS l'utiliser (Contre-indications)
- **Comparaison quantitative de haute précision entre flux non adjacents** : L'estimation de l'épaisseur d'une bande courbée est imprécise. 👉 *Remplacer par un Bar Chart*.
- **Réseaux hautement cycliques ou chaotiques avec 100+ nœuds entremêlés** : Crée un "plat de nouilles" (*hairball*).

---

## 4. Règles Cognitives & Meilleures Pratiques Spécifiques
- **Flux orienté de gauche à droite** (sens de lecture occidental naturel).
- **Couleur des flux héritée des nœuds sources ou cibles** : Utiliser la couleur du nœud d'origine avec une transparence (`rgba(..., 0.35)`) pour suivre facilement la provenance.
- **Minimisation des croisements de liens** : Utiliser un algorithme de disposition minimisant les croisements pour réduire la charge cognitive extrinsèque.
- **Étiquetage clair des nœuds** avec libellé et volume total entrant/sortant.

---

## 5. Erreurs Fréquentes & Anti-Patterns Visuels
- ❌ **Non-conservation des flux** : Si un flux entrant de 100 se sépare en 30 et 50 (manque 20 sans nœud de déperdition explicite), le graphique viole la logique mathématique.
- ❌ **Liens opaques** masquant les croisements.

---

## 6. Recommandations d'Implémentation Chart.js

### Configuration Type
- Plugin officiel requis : `chartjs-chart-sankey`

```javascript
// Requiert: npm install chartjs-chart-sankey
import 'chartjs-chart-sankey';

const config = {
  type: 'sankey',
  data: {
    datasets: [{
      label: 'Budget Entreprise (k€)',
      data: [
        { from: 'Chiffre d\'Affaires', to: 'Coût des Ventes', flow: 400 },
        { from: 'Chiffre d\'Affaires', to: 'Marge Brute', flow: 600 },
        { from: 'Marge Brute', to: 'R&D', flow: 250 },
        { from: 'Marge Brute', to: 'Marketing', flow: 200 },
        { from: 'Marge Brute', to: 'Bénéfice Net', flow: 150 }
      ],
      colorFrom: (ctx) => '#2563EB',
      colorTo: (ctx) => '#60A5FA',
      colorMode: 'gradient',
      borderWidth: 0,
      nodeWidth: 14,
      nodePadding: 20
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

## Règles Cognitives d'Accentuation & Valence

### 1. Hiérarchie Visuelle & Ratio 90/10 (Flux Prioritaire vs Ramifications)
- **Flux Clé de Valeur (*Hero Flow*)** : La branche directrice de création de valeur (ex: Marge Brute $\to$ Bénéfice Net) utilise la couleur vive `tokens.emphasis.focal` avec une opacité renforcée ($\alpha \approx 0.65$).
- **Branches de Déperdition (*Cost / Leak Flows*)** : Encodées distinctement en teintes d'alerte (`tokens.status.danger`) pour identifier immédiatement les pertes.
- **Flux Intermédiaires Standard** : Encodés via la palette catégorielle ou `tokens.emphasis.context` avec opacité douce ($\alpha \approx 0.25 - 0.35$).

### 2. Valence Métier & Directionnalité Énergétique / Financière
- **Flux Productifs / Utiles (*Énergie délivrée, Marge, Conversion*)** : `tokens.status.success` (`getValenceColor(tokens, 'up', 'gain')`).
- **Flux de Perte / Dissipation (*Pertes thermiques, Friction réseau, Coûts fixes*)** : `tokens.status.danger` (`getValenceColor(tokens, 'up', 'cost')`).

### 3. Double-Encodage Strict (Largeur Géométrique + Gradient Sémantique)
1. **Canal 1 (Largeur de bande)** : Encodage proportionnel strict de la masse physique conservée ($\sum \text{In} = \sum \text{Out}$).
2. **Canal 2 (Teinte sémantique)** : Liens verticaux ou horizontaux teintés de la couleur du nœud émetteur ou de la valence de sortie.
3. **Canal 3 (Infobulle contextuelle)** : Mention précise du flux absolu et de la part dans le nœud parent.

### 4. Guide d'Implémentation & Exemple de Code

```javascript
import { getValenceColor, getThemeTokens } from '../../themes/theme-tokens.js';

const tokens = getThemeTokens('colorbrewer-accessible');

const sankeyConfig = {
  datasets: [{
    data: [
      { from: 'Recettes', to: 'Bénéfice Net', flow: 150, valence: 'positive' },
      { from: 'Recettes', to: 'Pertes & Coûts', flow: 250, valence: 'negative' }
    ],
    colorFrom: (ctx) => {
      const item = ctx.dataset.data[ctx.dataIndex];
      return item.valence === 'positive'
        ? getValenceColor(tokens, 'up', 'gain')
        : getValenceColor(tokens, 'up', 'cost');
    },
    colorMode: 'gradient'
  }]
};
```

---

## 8. Sources & Références Académiques
- **Sankey, H. R. (1898)**. *The Thermal Efficiency of Steam Engines*. Minutes of Proceedings of The Institution of Civil Engineers.
- **Riehmann, P., Hanfler, M., & Froehlich, B. (2005)**. *Interactive Sankey diagrams*. IEEE Symposium on Information Visualization.
- **Fitts, P. M. (1954)**. *The information capacity of the human motor system in symbolizing amplitude of movement*. Journal of Experimental Psychology, 47(6), 381–391.
- **Mayer, R. E. (2009)**. *Multimedia Learning* (2nd ed.). Cambridge University Press.
- **Card, S. K., Moran, T. P., & Newell, A. (1983)**. *The Psychology of Human-Computer Interaction*. Lawrence Erlbaum Associates.

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Modélisation du Pointage des Liens et Nœuds Conservatifs (Shannon-MacKenzie)
Dans un diagramme de Sankey, le principe fondamental de conservation de masse impose une continuité spatiale entre des nœuds discrets ($W_n \approx 14\text{px}$) et des bandes polygonales curvilignes d'épaisseur variable proportionnelle au débit ($H_f$).
Selon le modèle de Fitts :
- **Surface d'Attraction Moteur** : L'activation topologique (`mode: 'nearest', intersect: true`) permet de cibler n'importe quel segment du lien le long de sa trajectoire horizontale $\Delta X \in [100, 250\text{px}]$. La tolérance géométrique de visée élargit la cible effective $W_e$ à la hauteur locale du ruban, assurant un temps d'acquisition $MT \le 400\text{ms}$.
- **Séparation Verticale des Nœuds** : L'espacement minimal inter-nœuds (`nodePadding: 16px`) garantit l'absence de chevauchement des cibles motrices au sein d'une même strate verticale.

### 2. Seuils Temporels & Modèle Humain Processeur (Card-Moran-Newell, Miller, Nielsen)
- **Rétroaction Visuelle Instantanée ($\le 100\text{ms}$)** : Au survol d'un lien, la modulation d'opacité ($\alpha = 0.70$) et la surbrillance des nœuds émetteur et récepteur s'exécutent en $100\text{ms}$ (`hover.animationDuration: 100ms`).
- **Filtrage Anti-Scintillement & Persistance** : Le délai d'entrée ($80\text{ms}$) élimine les micro-flashs visuels lors des mouvements balistiques rapides traversant les faisceaux de liens, tandis que l'hystérésis de sortie ($150\text{ms}$) stabilise l'infobulle face aux micro-tremblements moteurs de l'utilisateur.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer, Sweller)
- **Ancrage Localisé & Prévention de la Scission Attentionnelle** : L'infobulle est ancrée au point de collision curseur-ruban avec un déport vertical de $12\text{px}$.
- **Algorithme Anti-Occlusion avec Inversion de Quadrant** : En cas de proximité avec la bordure supérieure ou le bas du graphique, l'infobulle inverse sa position verticale (`caretPosition: 'top'` / `'bottom'`) et subit un clamping latéral automatique, garantissant la visibilité simultanée du texte et du tracé sans masquage.

### 4. Hiérarchie Cognitive des Infobulles (*Details-on-Demand*) & Typographie Tabulaire
L'infobulle structure le transfert énergétique ou financier en strates normées :
1. **Strate 1 (Nœud Source $\to$ Nœud Destination)** : Libellés en sans-serif demi-gras (`weight: 600`, $12\text{px}$).
2. **Strate 2 (Débit Absolu du Flux)** : Valeur numérique exacte formatée en police à chasse fixe tabulaire (`fontMono`, `toLocaleString('fr-FR')`).
3. **Strate 3 (Part dans le Bilan)** : Pourcentage du flux sortant de la source ($X\%$) et part dans l'entrée de la cible ($Y\%$).
4. **Strate 4 (Valence Métier)** : Mention sémantique *[Utile / Valeur]* ou *[Perte / Dissipation]*.

### 5. Cinématique des Courbes d'Amorti (*Easing Curves*) & Constance d'Objet
- **Déploiement Initial** : Animation globale en $450\text{ms}$ suivant `easeOutQuart` ($s(t) = 1 - (1-t)^4$), produisant une propagation continue de gauche à droite qui respecte la causalité physique du flux.
- **Proscription Formelle** : Les fonctions oscillatoires ou accélératrices (`easeIn`, `elastic`) sont rejetées pour préserver la lisibilité de la proportionnalité des surfaces.

### 6. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2)
- **SC 2.3.3 (Animation from Interactions - AAA)** : Désactivation intégrale des animations (`duration: 0`) sous `prefers-reduced-motion: reduce`.
- **SC 1.4.3 & 1.4.6 (Contraste Élevé)** : Contraste de l'infobulle $> 16:1$ (`#F8FAFC` sur `#0F172A`), bordure contrastée `tokens.borderStrong`.

