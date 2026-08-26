# Carte Choroplèthe (Choropleth Map)

## 1. Description & Principe Visuel
La carte choroplèthe découpe une zone géographique en régions administratives ou territoriales prédéfinies (pays, départements, codes postaux) et colore chaque polygone surfacique selon une **échelle de couleur séquentielle ou divergente** encodant une variable statistique.
- **Encodage primaire** : Position géographique réelle (formes vectorielles des territoires) et **teinte/luminance/saturation de couleur**.
- **Biais perceptuel majeur (Le piège spatial)** : La surface géographique d'une région n'a aucun lien avec sa population ou son poids économique. Une immense région peu peuplée (ex: Sibérie, Alaska, Creuse) domine visuellement toute la carte au détriment de micro-territoires hyper-peuplés (ex: Paris, Singapour, Tokyo).

---

## 2. Quand l'utiliser (Cas d'usage cibles)
- Visualiser des **taux, ratios ou densités normalisés** (ex: Densité de population en hab/km², Taux de chômage en %, Revenu moyen par habitant).
- Analyse territoriale où la continuité spatiale et le voisinage géographique ont un impact direct (ex: propagation épidémique, météo).

---

## 3. Quand NE PAS l'utiliser (Contre-indications)
- **Totaux ou valeurs absolues non normalisées (ex: Nombre total de cas, PIB total)** : Viole les règles élémentaires de la cartographie statistique (une grande région aura toujours un total supérieur simplement par sa superficie). 👉 *Remplacer par une Bubble Map ou Cartogramme*.
- **Territoires de tailles trop inégales**.

---

## 4. Règles Cognitives & Meilleures Pratiques Spécifiques
- **Normalisation obligatoire (Taux et Pourcentages)** : Ne JAMAIS cartographier de totaux bruts sans diviser par la population ou la surface.
- **Palettes perceptuellement uniformes (ColorBrewer)** : Éviter les sauts brusques de couleur non représentatifs des données.
- **Discrétisation statistique déterministe** :
  - **Seuils naturels de Jenks (*Natural Breaks*)** : Maximise l'homogénéité intra-classe et l'hétérogénéité inter-classes.
  - **Quantiles** : Pour répartir équitablement le nombre de polygones par couleur.
- **Nombre de classes optimal : 4 à 6 classes**.

---

## 4.1 Règles Cognitives d'Accentuation & Valence

### Hiérarchie Visuelle & Ratio 90/10 (Tufte)
- **Territoires Focaux (`role: 'focal'`)** : Les pays/régions au centre de l'analyse (ex: France, Allemagne) sont délimités par une bordure sombre contrastée ($2.5\text{px}$) pour émerger sans déformer la palette de luminance globale.
- **Territoires de Contexte (`role: 'context'`)** : 90% des pays environnants portent la rampe séquentielle standard avec un liseré fin discret ($1.0\text{px}$).
- **Anomalies Géographiques (`role: 'anomaly'`)** : Les valeurs atypiques ou outliers régionaux (ex: Irlande avec PIB/croissance hors échelle) sont surlignés par une bordure d'alerte `tokens.emphasis.anomaly` ou `tokens.status.danger`.

### Valence Métier & Directionnalité
- **Rampes Séquentielles vs Divergentes** :
  - Métriques unidirectionnelles positives (PIB, IDH) : Rampe séquentielle de `tokens.sequential` ($0.0 \to 1.0$).
  - Métriques à valence bipolaire (Croissance $+/-$, Solde budgétaire) : Échelle divergente `tokens.divergent` ou `getValenceColor(tokens, growth, 'gain')`.

### Double-Encodage Strict (Accessibilité & CVD Safe)
1. **Luminance Séquentielle + Gradient Colorbar** : Barre d'échelle continue avec bornes quantitatives explicites en bas à droite.
2. **Sigle ISO Centré sur Capitale** : Code pays en 2 lettres (`FR`, `DE`, `UK`...) garantissant l'identification immédiate sans dépendance exclusive aux contours géographiques.
3. **Bordure Structurante** : Trait de séparation contrasté ($2.5\text{px}$ focal vs $1.0\text{px}$ standard).

### Exemple de Configuration avec Tokens d'Accentuation
```javascript
import { getEmphasisStyle, getValenceColor, getSequentialColor, getThemeTokens } from '../../themes/theme-tokens.js';

const tokens = getThemeTokens('colorbrewer-accessible');

// Remplissage selon ratio quantitatif
const countryFill = getSequentialColor(tokens, 0.75); // Teinte bleue saturée

// Pays focalisé
const focalCountryStyle = getEmphasisStyle(tokens, 'focal');
// { borderColor: '#0F172A', borderWidth: 2.5 }
```

---

## 5. Erreurs Fréquentes & Anti-Patterns Visuels
- ❌ **Cartographier des nombres absolus bruts**.
- ❌ **Palette arc-en-ciel désordonnée**.
- ❌ **Absence de boîte de légende avec bornes numériques claires**.

---

## 6. Recommandations d'Implémentation Chart.js

### Configuration Type
- Plugin officiel requis : `chartjs-chart-geo` avec données TopoJSON/GeoJSON.

```javascript
// Requiert: npm install chartjs-chart-geo
import { ChoroplethController, GeoFeature, ColorScale, ProjectionScale } from 'chartjs-chart-geo';
import * as topojson from 'topojson-client';

// Chargement des polygones TopoJSON (ex: Départements Français ou Pays du Monde)
const config = {
  type: 'choropleth',
  data: {
    labels: ['Île-de-France', 'Auvergne-Rhône-Alpes', 'Nouvelle-Aquitaine'],
    datasets: [{
      label: 'Taux de Chômage (%)',
      data: [
        { feature: /* GeoJSON Feature */, value: 7.2 },
        { feature: /* GeoJSON Feature */, value: 6.8 },
        { feature: /* GeoJSON Feature */, value: 7.9 }
      ],
      backgroundColor: (ctx) => {
        // Échelle séquentielle Blues
      }
    }]
  },
  options: {
    responsive: true,
    scales: {
      projection: {
        axis: 'x',
        projection: 'mercator'
      },
      color: {
        axis: 'x',
        interpolate: 'blues',
        quantize: 5 // 5 classes de couleurs
      }
    },
    plugins: {
      legend: { position: 'bottom' }
    }
  }
};
```

---

## 7. Sources & Références Académiques
- **Dent, B. D., Torguson, J. S., & Zhou, T. W. (2009)**. *Cartography: Thematic Map Design* (6th ed.). McGraw-Hill.
- **Brewer, C. A. (2003)**. *A Transition in Improving Color Schemes for Maps*. Policy and Management, 1-13.
- **Jenks, G. F. (1967)**. *The data model concept in statistical mapping*. International Yearbook of Cartography, 7, 186-190.
- **MacKenzie, I. S., & Buxton, W. (1992)**. *Extending Fitts' law to two-dimensional tasks*. Proc. ACM CHI '92, 219–226.
- **Mayer, R. E. (2009)**. *Multimedia Learning* (2nd ed.). Cambridge University Press.

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Modélisation du Pointage sur Polygones Irréguliers (MacKenzie & Buxton)
Dans une carte choroplèthe, les entités territoriales présentent des surfaces et des formes géométriques polygonales très hétérogènes (des micro-états urbains aux vastes étendues rurales).
Selon le modèle 2D de pointage :
- **Attraction Polygonale Directe** : L'interaction s'effectue par test d'inclusion point-in-polygon (`interaction: { mode: 'nearest', intersect: false, axis: 'xy' }`).
- **Correction pour Petites Entités** : Pour les petites entités administratives (ex: Luxembourg, Île-de-France), un point de capture étendu est ancré sur la capitale géographique, évitant l'explosion de l'Index de Difficulté ($ID$) prédite par la loi de Fitts standard sur les cibles exiguës ($MT \le 340\text{ms}$).

### 2. Seuils Temporels & Modèle Humain Processeur (Card-Moran-Newell, Miller, Nielsen)
- **Instantanéité Causale ($\le 100\text{ms}$)** : Dès l'entrée du pointeur dans les limites d'un polygone, le renforcement du liseré de frontière (`borderWidth: 2.5px`, couleur sombre `#0F172A` ou claire `#ECEFF4`) et la surbrillance chromatique réagissent en $100\text{ms}$ (`hover.animationDuration: 100ms`).
- **Filtrage Anti-Scintillement & Persistance** : Le délai de $80\text{ms}$ neutralise les à-coups lors du survol rapide des frontières découpées, tandis que la persistance de $150\text{ms}$ maintient l'infobulle stable lors des micro-mouvements d'exploration.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer, Sweller)
- **Positionnement Géodésique Anti-Occlusion** : L'infobulle est ancrée au centre géométrique ou au centroïde de la capitale avec un déport vertical de $12\text{px}$.
- **Inversion Haut/Bas et Clamping sur Bords du Cadre** : Lorsque le pays survolé se situe dans l'arc nord de la projection ($y < \text{margin}$), l'infobulle bascule sous le pays (`caretPosition: 'top'`) et s'aligne horizontalement pour rester parfaitement visible dans le viewport cartographique.

### 4. Hiérarchie Cognitive des Infobulles (*Details-on-Demand*) & Typographie Tabulaire
L'infobulle expose les métriques territoriales décomposées :
1. **Strate 1 (Nom du Pays / Région)** : Nom officiel en sans-serif gras (`weight: 600`, $12\text{px}$).
2. **Strate 2 (Métrique Choroplèthe Principale)** : Grandeur absolue ou ratio formaté en chiffres tabulaires (`fontMono`, `toLocaleString('fr-FR')`).
3. **Strate 3 (Classement / Quantile Jenks)** : Indication de la tranche de distribution (ex: `Top 10%`, `Classe 4/5`).
4. **Strate 4 (Rôle Sémantique)** : Mention *[Focal]* ou *[Anomalie / Déviation]*.

### 5. Cinématique des Courbes d'Amorti (*Easing Curves*) & Constance d'Objet
- **Déploiement Initial Conforme** : Animation d'apparition en $400\text{ms}$ régie par `easeOutQuart` ($s(t) = 1 - (1-t)^4$), éclairant progressivement les polygones depuis leur teinte neutre vers la valeur choroplèthe assignée.
- **Respect de la Morphologie Spatiale** : Aucune déformation d'échelle ou élasticité n'est tolérée afin de préserver l'intégrité de la projection géographique.

### 6. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2)
- **SC 2.3.3 (Animation from Interactions - AAA)** : Désactivation immédiate des animations (`duration: 0`) sous `prefers-reduced-motion: reduce`.
- **SC 1.4.3 & 1.4.6 (Contraste Élevé)** : Contraste d'infobulle $> 16:1$, barrette de légende séquentielle continue graduée avec chiffres lisibles (`fontMono`), frontières vectorielles contrastées (`#CBD5E1` en mode clair, `#4C566A` en mode sombre).

