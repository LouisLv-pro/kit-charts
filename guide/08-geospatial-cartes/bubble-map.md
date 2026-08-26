# Carte à Symboles Proportionnels (Bubble Map / Proportional Symbol Map)

## 1. Description & Principe Visuel
La carte à bulles proportionnelles superpose des cercles (ou symboles géométriques) positionnés aux coordonnées géographiques précises (latitude, longitude ou centroïde de région) d'un fond de carte, où la **surface du cercle** est strictement proportionnelle à une grandeur quantitative absolue.
- **Encodage primaire** : Coordonnées géographiques $(X, Y)$ et **aire 2D du cercle** (niveau 5 de Cleveland & McGill).
- **Supériorité cognitive sur la carte choroplèthe** : Corrige le biais spatial de superficie : une petite métropole dense (ex: Paris) aura une grande bulle bien visible, tandis qu'un vaste désert aura une bulle minuscule ou inexistante.

---

## 2. Quand l'utiliser (Cas d'usage cibles)
- Cartographier des **totaux absolus bruts** localisés (ex: Nombre d'usines, Chiffre d'affaires par agence, Nombre de cas COVID par ville, Trafic passagers par aéroport).
- Événements ponctuels géolocalisés précis.

---

## 3. Quand NE PAS l'utiliser (Contre-indications)
- **Taux et pourcentages intensifs normalisés (ex: Taux de pauvreté %)** : 👉 *Remplacer par une Carte Choroplèthe*.
- **Trop de points très rapprochés** : Les bulles géantes se superposent en grappes illisibles.

---

## 4. Règles Cognitives & Meilleures Pratiques Spécifiques
- **Aire proportionnelle à la valeur ($\text{Rayon} \propto \sqrt{\text{Valeur}}$)** : Non négociable.
- **Transparence d'opacité ($0.4$ à $0.6$)** : Permet de distinguer les petites bulles sous les grandes bulles lors de chevauchements urbains.
- **Fond de carte monochrome très discret** : Utiliser un fond de carte gris très pâle (`#F1F5F9`) avec des frontières douces pour que les bulles ressortent en figure principale (Loi Figure/Fond).

---

## 4.1 Règles Cognitives d'Accentuation & Valence

### Hiérarchie Visuelle & Ratio 90/10 (Tufte)
- **Bulles Métropolitaines Focales (`role: 'focal'`)** : Les pôles stratégiques ou hubs d'investissement prioritaires (ex: Londres, Paris, Dublin) sont affichés avec une opacité élevée ($0.90$), la couleur focale `tokens.emphasis.focal` et une bordure renforcée ($2.5\text{px}$).
- **Bulles de Contexte (`role: 'context'`)** : Les métropoles secondaires sont atténuées (opacité $0.50$), laissant respirer le fond de carte.
- **Pôles en Anomalie (`role: 'anomaly'`)** : Les métropoles sous-performantes ou en rupture d'investissement reçoivent `tokens.emphasis.anomaly` ou `tokens.status.danger`.

### Valence Métier & Directionnalité
- **Croissance d'Investissement Régional** : Taux d'évolution positif encodé avec `getValenceColor(tokens, growth, 'gain')` (vert/succès).
- **Contraction d'Activité / Chute** : Taux négatif encodé avec `tokens.status.danger` (rouge/alerte).

### Double-Encodage Strict (Accessibilité & CVD Safe)
1. **Couleur + Rayon Flannery ($\propto \sqrt{V}$)** : La surface géométrique encode le montant absolu, rendant la comparaison robuste même en vision monochrome.
2. **Opacité et Épaisseur de Bordure** : Bulles focales à $2.5\text{px}$ de bordure et $\alpha=0.90$ vs contexte à $1.5\text{px}$ et $\alpha=0.50$.
3. **Étiquettes Directes de Ville** : Libellé textuel systématique centré au-dessus de chaque bulle pour éviter l'aller-retour visuel avec une légende externe.

### Exemple de Configuration avec Tokens d'Accentuation
```javascript
import { getEmphasisStyle, getValenceColor, getThemeTokens } from '../../themes/theme-tokens.js';

const tokens = getThemeTokens('colorbrewer-accessible');

// Bulle focale métropolitaine
const focalBubble = getEmphasisStyle(tokens, 'focal');
// { backgroundColor: '#2B8CBE', borderColor: '#FFFFFF', borderWidth: 2.5 }

// Valence basée sur la dynamique de croissance urbaine
const investmentGain = getValenceColor(tokens, +18.2, 'gain'); // tokens.status.success
const investmentDrop = getValenceColor(tokens, -8.5, 'gain'); // tokens.status.danger
```

---

## 5. Erreurs Fréquentes & Anti-Patterns Visuels
- ❌ **Mapper la valeur sur le diamètre ou rayon au lieu de l'aire**.
- ❌ **Bulles opaques cachant les territoires sous-jacents**.

---

## 6. Recommandations d'Implémentation Chart.js

### Configuration Type
- Plugin officiel requis : `chartjs-chart-geo` avec le type `bubbleMap`.

```javascript
// Requiert: npm install chartjs-chart-geo
import { BubbleMapController, GeoFeature, SizeScale, ProjectionScale } from 'chartjs-chart-geo';

const config = {
  type: 'bubbleMap',
  data: {
    datasets: [{
      label: 'Ventes par Métropole (k€)',
      data: [
        { latitude: 48.8566, longitude: 2.3522, value: 8500, label: 'Paris' },
        { latitude: 45.7640, longitude: 4.8357, value: 3200, label: 'Lyon' },
        { latitude: 43.2965, longitude: 5.3698, value: 2100, label: 'Marseille' },
        { latitude: 43.6047, longitude: 1.4442, value: 1800, label: 'Toulouse' }
      ],
      backgroundColor: 'rgba(37, 99, 235, 0.5)',
      borderColor: '#1D4ED8',
      borderWidth: 1.5
    }]
  },
  options: {
    responsive: true,
    scales: {
      projection: {
        axis: 'x',
        projection: 'mercator'
      },
      size: {
        axis: 'x',
        range: [4, 25] // Rayons min et max en pixels
      }
    }
  }
};
```

---

## 7. Sources & Références Académiques
- **Flannery, J. J. (1971)**. *The relative effectiveness of equated and unequalized circular symbols in statistical mapping*. The Cartographic Journal, 8(2), 96-109 (Compensation perceptuelle de Flannery pour les aires circulaires).
- **Dent, B. D. (2009)**. *Cartography: Thematic Map Design*.
- **MacKenzie, I. S., & Buxton, W. (1992)**. *Extending Fitts' law to two-dimensional tasks*. Proc. ACM CHI '92, 219–226.
- **Mayer, R. E. (2009)**. *Multimedia Learning* (2nd ed.). Cambridge University Press.
- **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception*. JASA.

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Modélisation du Pointage Cartographique Bivarié (MacKenzie & Buxton)
Dans une carte à symboles proportionnels (bubble map), les disques sont géolocalisés en projection cartographique conique ou Mercator ($X_{\text{lon}}, Y_{\text{lat}}$).
Selon la loi de Fitts en 2D :
- **Section Efficace Proportionnelle** : Le rayon de chaque bulle est dimensionné selon la racine carrée de la grandeur ($R \propto \sqrt{V}$ ou selon l'exposant perceptif de Flannery $R \propto V^{0.57}$). La configuration `interaction: { mode: 'nearest', intersect: false, axis: 'xy' }` étend la capture à toute la périphérie du symbole ($W_e = 2R + 12\text{px}$).
- **Index de Difficulté ($ID$)** : Les métropoles majeures présentent un $ID \le 1.5\text{ bits}$ permettant un temps d'acquisition $MT \le 290\text{ms}$, tandis que les petits centres urbains sont protégés de l'inaccessibilité motrice par un seuil minimal de rayon ($R_{\min} = 4\text{px}$).

### 2. Seuils Temporels & Modèle Humain Processeur (Card-Moran-Newell, Miller, Nielsen)
- **Instantanéité Visuo-Spatiale ($\le 100\text{ms}$)** : Dès l'entrée sur une bulle, l'accentuation de l'opacité ($\alpha = 0.90$) et l'épaississement du liseré (`borderWidth: 2.5px`) réagissent en $100\text{ms}$ (`hover.animationDuration: 100ms`).
- **Filtrage Anti-Scintillement & Persistance** : Le délai anti-rebond ($80\text{ms}$) prévient les déclenchements parasites lors de la navigation rapide à travers les corridors urbains denses, tandis que l'hystérésis de $150\text{ms}$ stabilise l'affichage lors des micro-mouvements de la main.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer, Sweller)
- **Positionnement Géodésique Anti-Occlusion** : L'infobulle est ancrée au-dessus du centre de la bulle avec un déport vertical proportionnel au rayon ($R + 10\text{px}$), évitant de masquer les frontières nationales ou les villes voisines.
- **Inversion Haut/Bas & Clamping de Projection** : Lorsque la bulle se situe près de la limite septentrionale de la carte ($y < \text{margin}$), l'infobulle bascule sous le pôle sud du symbole (`caretPosition: 'top'`) et s'aligne horizontalement pour rester dans le cadre géographique.

### 4. Hiérarchie Cognitive des Infobulles (*Details-on-Demand*) & Typographie Tabulaire
L'infobulle détaille les coordonnées géographiques et les indicateurs territoriaux :
1. **Strate 1 (Nom de la Métropole / Territoire)** : Nom officiel en sans-serif gras (`weight: 600`, $12\text{px}$).
2. **Strate 2 (Indicateur Quantitatif Principal)** : Valeur absolue formatée en chiffres tabulaires (`fontMono`, `toLocaleString('fr-FR')`).
3. **Strate 3 (Dynamique d'Évolution)** : Taux de variation territorial ($+/- \Delta\%$) avec valence colorée.
4. **Strate 4 (Rôle Géostratégique)** : Mention explicite *[Focal]*, *[Contexte]* ou *[Anomalie / Déviation]*.

### 5. Cinématique des Courbes d'Amorti (*Easing Curves*) & Constance d'Objet
- **Déploiement Initial Radial** : L'animation de croissance des rayons utilise la fonction `easeOutQuart` ($s(t) = 1 - (1-t)^4$) sur $400\text{ms}$, déployant harmonieusement les bulles depuis leur point d'ancrage géographique.
- **Interdiction des Déformations Élastiques** : Rejet des courbes `bounce` pour préserver l'exactitude de l'estimation visuelle des surfaces comparées.

### 6. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2)
- **SC 2.3.3 (Animation from Interactions - AAA)** : Désactivation immédiate de l'animation cartographique (`duration: 0`) sous `prefers-reduced-motion: reduce`.
- **SC 1.4.3 & 1.4.6 (Contraste Élevé)** : Contraste de l'infobulle $> 16:1$, liseré blanc ou sombre entourant chaque bulle pour la détacher nettement du fond de carte vectoriel.

