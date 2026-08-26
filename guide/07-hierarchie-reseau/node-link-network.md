# Réseau Nœuds-Liens (Node-Link Network / Graph)

## 1. Description & Principe Visuel
Le diagramme nœuds-liens modélise un réseau de relations en représentant les entités sous forme de sommets/cercles (**nœuds**) et leurs interconnexions ou interactions sous forme de segments ou courbes (**liens / arêtes**), généralement positionnés par un algorithme d'équilibre physique (*force-directed layout*).
- **Encodage primaire** : Topologie de connexion, position spatiale 2D, taille des nœuds (centralité / degré), épaisseur des liens (poids de la relation).
- **Lois de Gestalt mobilisées** : Continuité, Destin Commun et Clôture (détection visuelle immédiate des communautés denses).

---

## 2. Quand l'utiliser (Cas d'usage cibles)
- Réseaux sociaux et cartographie d'influence (qui interagit avec qui).
- Topologie d'infrastructure informatique (serveurs, micro-services, dépendances de paquets).
- Détection de fraudes, transactions financières suspectes en étoile ou en cycle.
- Volume idéal : **15 à 80 nœuds** avec densité de liens modérée.

---

## 3. Quand NE PAS l'utiliser (Contre-indications)
- **Réseaux ultra-denses (> 150 nœuds et > 1000 liens)** : S'effondre en un fouillis opaque impénétrable appelé *Hairball* (pelote de cheveux). 👉 *Remplacer par une Matrice d'Adjacence / Heatmap*.
- **Hiérarchies strictes sans relations transversales** : 👉 *Remplacer par un Dendrogramme ou Treemap*.

---

## 4. Règles Cognitives & Meilleures Pratiques Spécifiques
- **Gestion de la force répulsive et d'attraction** : Ajuster les forces d'attraction des liens et de répulsion des nœuds pour étaler les clusters sans chevauchement.
- **Transparence et finesse des liens** : Liens fins (`1px` à `1.5px`) et semi-transparents (`rgba(148, 163, 184, 0.4)`) pour laisser ressortir les nœuds d'intérêt.
- **Couleur des nœuds par communauté** : Identifier les clusters algorithmiques (ex: modularité de Louvain) et attribuer une teinte qualitative distincte par communauté.
- **Filtres interactifs** : Permettre d'isoler le voisinage direct à 1 degré d'un nœud sélectionné.

---

## 4.1 Règles Cognitives d'Accentuation & Valence

### Hiérarchie Visuelle & Ratio 90/10 (Tufte)
- **Nœuds Hubs / Critiques (`role: 'focal'`)** : Les points névralgiques de l'architecture (ex: API Gateway, Order Engine, Primary DB) sont dimensionnés à $r=15\text{px}$–$16\text{px}$ avec la couleur focale `tokens.emphasis.focal` et une bordure renforcée.
- **Nœuds Périphériques / Contexte (`role: 'context'`)** : 90% des modules passifs sont réduits ($r=10\text{px}$–$12\text{px}$) et traités en teintes de palette désaturées.
- **Nœuds en Alerte / Défaillance (`role: 'anomaly'`)** : Les composants en rupture ou surcharge (ex: Cache Redis avec latence) sont mis en exergue via `tokens.emphasis.anomaly` ou `tokens.status.danger`.

### Valence Métier & Directionnalité
- **Santé Système & Liens Haute Performance** : Les arêtes saines et haut débit sont encodées avec la couleur de statut positif `tokens.status.success` ou couleur de communauté nominale.
- **Liens Dégradés & Incidents (Risque / Latence)** : Liens avec erreurs de routage ou timeouts encodés avec `tokens.status.danger` via `getValenceColor(tokens, 'down', 'latency')`.

### Double-Encodage Strict (Accessibilité & CVD Safe)
1. **Couleur + Rayon de Sommet** : Les hubs focaux ont un rayon supérieur ($16\text{px}$ vs $11\text{px}$) pour assurer la hiérarchisation en niveaux de gris.
2. **Style de Trait des Liens** : Liens nominaux continus vs liens dégradés/surchargés en pointillés (`setLineDash([4, 3])`).
3. **Badge et Statut Info-Bulle** : Mention explicite `[FOCAL]` ou `[ANOMALY]` avec état du nœud (`Opérationnel` vs `Dégradé / Alerte Latence`).

### Exemple de Configuration avec Tokens d'Accentuation
```javascript
import { getEmphasisStyle, getValenceColor, getThemeTokens } from '../../themes/theme-tokens.js';

const tokens = getThemeTokens('colorbrewer-accessible');

// Nœud focal central (Hub d'architecture)
const hubStyle = getEmphasisStyle(tokens, 'focal', { radius: 16 });
// { backgroundColor: '#2B8CBE', borderColor: '#FFFFFF', borderWidth: 2, pointRadius: 16 }

// Nœud en anomalie de latence
const anomalyNode = getEmphasisStyle(tokens, 'anomaly', { radius: 13 });
// { backgroundColor: '#D01C8B', borderColor: '#C62828', borderWidth: 2 }
```

---

## 5. Erreurs Fréquentes & Anti-Patterns Visuels
- ❌ **L'effet "Hairball"** : Présenter un graphe dense non filtré sans interactivité.
- ❌ **Flèches directionnelles géantes** créant du bruit visuel sur chaque lien.

---

## 6. Recommandations d'Implémentation Chart.js

### Configuration Type
- Plugin officiel requis : `chartjs-chart-graph` (ou intégration D3-force sur canvas).

```javascript
// Requiert: npm install chartjs-chart-graph
import 'chartjs-chart-graph';

const config = {
  type: 'graph',
  data: {
    nodes: [
      { id: 'Serveur Central', value: 20, color: '#1D4ED8' },
      { id: 'BDD Primaire', value: 14, color: '#059669' },
      { id: 'Cache Redis', value: 10, color: '#F59E0B' },
      { id: 'Client Web 1', value: 8, color: '#64748B' },
      { id: 'Client Web 2', value: 8, color: '#64748B' }
    ],
    edges: [
      { source: 'Client Web 1', target: 'Serveur Central', width: 2 },
      { source: 'Client Web 2', target: 'Serveur Central', width: 2 },
      { source: 'Serveur Central', target: 'Cache Redis', width: 3 },
      { source: 'Serveur Central', target: 'BDD Primaire', width: 4 }
    ]
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
- **Fruchterman, T. M., & Reingold, E. M. (1991)**. *Graph drawing by force-directed placement*. Software: Practice and Experience, 21(11), 1129-1164.
- **Bostock, M., et al. (2011)**. *D³: Data-Driven Documents*. IEEE TVCG.
- **Von Landesberger, T., et al. (2011)**. *Visual analysis of large graphs: state-of-the-art and future research challenges*. Computer Graphics Forum.
- **MacKenzie, I. S., & Buxton, W. (1992)**. *Extending Fitts' law to two-dimensional tasks*. Proc. ACM CHI '92, 219–226.
- **Mayer, R. E. (2009)**. *Multimedia Learning* (2nd ed.). Cambridge University Press.

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Modélisation du Pointage Topologique 2D (MacKenzie & Buxton)
Dans un réseau nœuds-liens (force-directed / topological graph), les entités sont dispersées en coordonnées 2D libres $(x, y)$, rendant la visée bidimensionnelle omnidirectionnelle.
Selon le modèle de pointage 2D étendu :
- **Attraction Continue Isotrope** : La configuration `interaction: { mode: 'nearest', intersect: false, axis: 'xy' }` couplée au rayon `pointHitRadius: 14px` augmente la section efficace de capture à $W_e = 28\text{px}$. L'opérateur peut acquérir un nœud sans placer le curseur exactement au centre de masse du disque.
- **Index de Difficulté ($ID$)** : En limitant le ratio de dispersion $D/W_e$, le temps d'acquisition moyen reste contenu sous $MT \approx 135 + 195 \cdot \log_2(D/W_e + 1) \le 420\text{ms}$.

### 2. Seuils Temporels & Modèle Humain Processeur (Card-Moran-Newell, Miller, Nielsen)
- **Instantanéité Causale ($\le 100\text{ms}$)** : Dès l'entrée du pointeur sur un nœud, l'agrandissement (`pointHoverRadius: r + 4px`) et la mise en surbrillance des arêtes adjacentes (`strokeWidth: 2.5px`, $\alpha = 0.75$) s'exécutent en $100\text{ms}$ (`hover.animationDuration: 100ms`).
- **Filtrage Anti-Scintillement & Persistance** : Le filtre anti-rebond ($80\text{ms}$) supprime les activations accidentelles lors du survol rapide des arêtes non ciblées, tandis que l'hystérésis de $150\text{ms}$ stabilise l'affichage lors de l'exploration minutieuse des grappes denses (*clusters*).

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer, Sweller)
- **Déport Radiale Anti-Masquage** : L'infobulle est ancrée au-dessus du nœud avec un déport vertical de sécurité de $14\text{px}$ pour éviter de recouvrir les liaisons d'anomalie ou les voisins immédiats.
- **Inversion et Clamping Multi-Quadrant** : En cas de proximité avec les frontières du canvas ($x < \text{margin}$, $y < \text{margin}$), l'infobulle bascule automatiquement vers le bas (`caretPosition: 'top'`) ou latéralement, assurant la lisibilité sans clipping.

### 4. Hiérarchie Cognitive des Infobulles (*Details-on-Demand*) & Typographie Tabulaire
L'infobulle décompose la topologie relationnelle en strates cognitives :
1. **Strate 1 (Identifiant du Nœud / Rôle)** : Nom du service ou entité en sans-serif gras (`weight: 600`, $12\text{px}$).
2. **Strate 2 (Communauté & Grappe)** : Nom de la partition ou du cluster d'appartenance (`Communauté K`).
3. **Strate 3 (Degré de Centralité)** : Nombre de connexions actives ($k$) et rayon effectif en typographie tabulaire (`fontMono`, $12\text{px}$).
4. **Strate 4 (Statut Opérationnel)** : État nominal vs alerte de latence/anomalie.

### 5. Cinématique des Courbes d'Amorti (*Easing Curves*) & Constance d'Objet
- **Stabilisation Force-Directed** : Les micro-transitions de réarrangement utilisent le profil `easeOutQuart` ($s(t) = 1 - (1-t)^4$) sur $400\text{ms}$, évitant les oscillations non amorties (*jitter* ou répulsion divergente).
- **Proscription des Rebonds** : Absence totale de fonctions élastiques (`bounce`) pour maintenir la stabilité topologique.

### 6. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2)
- **SC 2.3.3 (Animation from Interactions - AAA)** : Désactivation instantanée des forces dynamiques et animations (`duration: 0`) sous `prefers-reduced-motion: reduce`.
- **SC 1.4.3 & 1.4.6 (Contraste Élevé)** : Contraste de l'infobulle $> 16:1$, arêtes d'anomalie en pointillés contrastés (`setLineDash([4, 3])`) pour une identification non exclusive à la couleur.

