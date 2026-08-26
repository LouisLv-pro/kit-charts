# Cartogramme & Grille de Tuiles Géographiques (Cartogram / Tilegram)

## 1. Description & Principe Visuel
Le Cartogramme déforme géométriquement les frontières d'une carte pour rendre la surface de chaque région strictement proportionnelle à une variable quantitative (ex: population ou PIB). Le **Tilegram / Tile Grid Map** est une version discrète simplifiée où chaque territoire est représenté par un polygone régulier de taille identique (carré ou hexagone) disposé selon une proximité géographique approximative.
- **Encodage primaire** : Position relative sur la grille schématique et couleur thématique.
- **Bénéfice cognitif absolu** : Donne un **poids visuel strictement égal à chaque entité politique/administrative**, éliminant à 100% le biais de surface territoriale de la carte choroplèthe (ex: le Rhode Island ou l'Île-de-France pèse visuellement autant que l'Alaska ou la Guyane).

---

## 2. Quand l'utiliser (Cas d'usage cibles)
- Résultats d'élections démocratiques (ex: Élections présidentielles américaines par Grands Électeurs, Législatives françaises par circonscription).
- Comparaison d'indicateurs de santé ou socio-économiques entre États/Régions où chaque territoire administratif a le même statut institutionnel.

---

## 3. Quand NE PAS l'utiliser (Contre-indications)
- **Besoin de navigation GPS ou de repérage spatial géographique exact**.
- **Public non familier avec la géographie du pays** (la déformation rend les paysages méconnaissables si les repères mentaux ne sont pas solides).

---

## 4. Règles Cognitives & Meilleures Pratiques Spécifiques
- **Préservation des voisinages cardinaux** : Veiller à ce que le Nord, Sud, Est et Ouest relatifs des territoires soient respectés autant que possible sur la grille.
- **Sigles ou abréviations centrés dans chaque tuile** : Inscrire le code postal/code pays en 2 lettres (ex: `75`, `13`, `69` ou `CA`, `TX`, `NY`) en gras au centre de chaque hexagone ou carré.
- **Palette séquentielle ou catégorielle très lisible**.

---

## 4.1 Règles Cognitives d'Accentuation & Valence

### Hiérarchie Visuelle & Ratio 90/10 (Tufte)
- **Tuiles Régionales Focales (`role: 'focal'`)** : Les territoires clés ou leaders (ex: Île-de-France, Auvergne-Rhône-Alpes) reçoivent une bordure épaisse contrastée ($3\text{px}$) et la teinte focale `tokens.emphasis.focal` pour attirer l'attention sans distorsion de surface.
- **Tuiles de Contexte (`role: 'context'`)** : 90% des territoires constituent le tissu national et sont rendus avec la rampe séquentielle standard ou couleur de contexte.
- **Anomalies Territoriales (`role: 'anomaly'`)** : Les régions en rupture ou déficit critique (ex: Corse) sont marquées avec `tokens.emphasis.anomaly` ou `tokens.status.danger`.

### Valence Métier & Directionnalité
- **Dynamique Territoriale Positive (Gain / Progrès)** : Évolution régionale positive ($+16.8\%$) associée à `getValenceColor(tokens, growth, 'gain')` (vert/succès).
- **Régression / Retard Régional** : Évolution négative ($-4.3\%$) basculée sur `tokens.status.danger` (rouge/alerte).

### Double-Encodage Strict (Accessibilité & CVD Safe)
1. **Égalité Géométrique des Tuiles + Sigle Centré** : Poids visuel équitable de chaque région éliminant le biais de surface, avec sigle ISO/code régional en gras blanc contrasté.
2. **Bordure Différenciée (Épaisseur & Couleur)** : Tuiles focales et alertes avec contour à $3\text{px}$ vs $1.5\text{px}$ pour le contexte.
3. **Info-Bulle Sémantique Complète** : Mention explicite du rôle `[FOCAL]` ou `[ANOMALY]`, indice mesuré et taux de variation A/A-1.

### Exemple de Configuration avec Tokens d'Accentuation
```javascript
import { getEmphasisStyle, getValenceColor, getThemeTokens } from '../../themes/theme-tokens.js';

const tokens = getThemeTokens('colorbrewer-accessible');

// Tuile régionale focale
const focalTile = getEmphasisStyle(tokens, 'focal');
// { backgroundColor: '#2B8CBE', borderColor: '#0F172A', borderWidth: 3 }

// Valence selon la performance de l'indicateur territorial
const growthColor = getValenceColor(tokens, +16.8, 'gain'); // tokens.status.success
const dropColor = getValenceColor(tokens, -4.3, 'gain'); // tokens.status.danger
```

---

## 5. Erreurs Fréquentes & Anti-Patterns Visuels
- ❌ **Déformation topologique excessive** rompant toute reconnaissance visuelle du pays.
- ❌ **Oublier le libellé textuel dans la tuile**.

---

## 6. Recommandations d'Implémentation Chart.js

### Configuration Type
- Plugin officiel requis : `chartjs-chart-matrix` configuré avec des coordonnées de tuiles régulières $(X, Y)$ représentant la carte schématique.

```javascript
// Requiert: npm install chartjs-chart-matrix
import 'chartjs-chart-matrix';

// Données de tuiles schématiques (ex: États US ou Régions)
const tileData = [
  { state: 'WA', x: 0, y: 0, v: 'Dem' },
  { state: 'ID', x: 1, y: 0, v: 'Rep' },
  { state: 'MT', x: 2, y: 0, v: 'Rep' },
  { state: 'OR', x: 0, y: 1, v: 'Dem' },
  { state: 'NV', x: 1, y: 1, v: 'Dem' },
  { state: 'WY', x: 2, y: 1, v: 'Rep' },
  { state: 'CA', x: 0, y: 2, v: 'Dem' },
  { state: 'AZ', x: 1, y: 2, v: 'Dem' },
  { state: 'UT', x: 2, y: 2, v: 'Rep' }
];

const config = {
  type: 'matrix',
  data: {
    datasets: [{
      label: 'Élections',
      data: tileData,
      backgroundColor: (ctx) => ctx.raw?.v === 'Dem' ? '#2563EB' : '#DC2626',
      width: 45,
      height: 45,
      borderRadius: 6
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: { display: false, min: -0.5, max: 3.5 },
      y: { display: false, min: -0.5, max: 3.5 }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: () => '',
          label: (ctx) => `${ctx.raw.state} : ${ctx.raw.v}`
        }
      }
    }
  }
};
```

---

## 7. Sources & Références Académiques
- **Dorling, D. (1996)**. *Area Cartograms: Their Use and Creation*. Concepts and Techniques in Modern Geography.
- **Nusrat, S., & Kobourov, S. (2016)**. *The state of the art in cartograms*. Computer Graphics Forum, 35(3), 619-642.
- **Fitts, P. M. (1954)**. *The information capacity of the human motor system in symbolizing amplitude of movement*. Journal of Experimental Psychology, 47(6), 381–391.
- **Mayer, R. E. (2009)**. *Multimedia Learning* (2nd ed.). Cambridge University Press.
- **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception*. JASA.

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Modélisation du Pointage sur Grille de Tuiles Isométriques (Shannon-MacKenzie)
Dans une carte en grille de tuiles (cartogramme/tilegramme), toutes les unités territoriales sont représentées par des polygones ou rectangles d'aire rigoureusement identique ($W \times H \approx 45 \times 45\text{px}$), éliminant le biais de surface géographique.
Selon la loi de Fitts :
- **Largeur de Cible Constante ($W_e = 45\text{px}$)** : Contrairement aux cartes choroplèthes où les petites régions urbaines sont quasi-inaccessibles à la souris, chaque tuile offre une section de capture motrice étendue. L'Index de Difficulté ($ID$) est homogène et minimal sur tout le territoire : $MT \le 280\text{ms}$.
- **Attraction Surfacique Directe** : L'interaction `interaction: { mode: 'nearest', intersect: true }` garantit une réponse nette sans collision croisée avec les cellules adjacentes.

### 2. Seuils Temporels & Modèle Humain Processeur (Card-Moran-Newell, Miller, Nielsen)
- **Instantanéité du Changement d'État ($\le 100\text{ms}$)** : Dès que le pointeur pénètre une tuile, le renforcement de bordure (`borderWidth: 3px`) et la variation de luminance s'exécutent en $100\text{ms}$ (`hover.animationDuration: 100ms`).
- **Filtrage Anti-Scintillement & Persistance** : Le délai anti-rebond ($80\text{ms}$) supprime les bascules saccadées lors du survol diagonal de la grille, tandis que l'hystérésis de $150\text{ms}$ stabilise l'infobulle pour une lecture confortable.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer, Sweller)
- **Centrage Anti-Masquage** : L'infobulle est ancrée au centre de gravité de la cellule avec un déport vertical de $12\text{px}$, évitant d'obstruer le sigle textuel au centre de la tuile.
- **Inversion Haut/Bas et Clamping sur Bords de Grille** : Pour les tuiles situées sur la première rangée ($y = 1$) ou en bordure latérale ($x = 0$ ou $x = x_{\max}$), l'infobulle bascule sous la tuile (`caretPosition: 'top'`) et s'aligne horizontalement pour éviter toute troncature hors de l'écran.

### 4. Hiérarchie Cognitive des Infobulles (*Details-on-Demand*) & Typographie Tabulaire
L'infobulle structure les informations administratives et statistiques :
1. **Strate 1 (Nom Officiel & Sigle Trigramme)** : Nom complet du territoire en sans-serif gras (`weight: 600`, $12\text{px}$).
2. **Strate 2 (Indice Mesuré)** : Valeur normalisée en typographie tabulaire (`fontMono`, $12\text{px}$, `raw.v.toLocaleString('fr-FR')`).
3. **Strate 3 (Coordonnées Grille & Voisinage)** : Emplacement matriciel `[Col X, Ligne Y]`.
4. **Strate 4 (Variation Temporelle & Rôle)** : Évolution annuelle ($+/- \Delta\%$) et mention *[Focal]* ou *[Anomalie]*.

### 5. Cinématique des Courbes d'Amorti (*Easing Curves*) & Constance d'Objet
- **Déploiement Initial Matriciel** : L'animation d'apparition des tuiles en $400\text{ms}$ suit la courbe `easeOutQuart` ($s(t) = 1 - (1-t)^4$), générant une entrée ordonnée sans à-coups visuels.
- **Absence de Rebond** : Maintien de l'immobilité stricte de la structure pour respecter l'organisation topologique schématique.

### 6. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2)
- **SC 2.3.3 (Animation from Interactions - AAA)** : Désactivation intégrale des animations (`duration: 0`) sous `prefers-reduced-motion: reduce`.
- **SC 1.4.3 & 1.4.6 (Contraste Élevé)** : Contraste de l'infobulle $> 16:1$, sigles textuels intérieurs contrastés avec ombre portée subtile pour garantir une lisibilité parfaite sur toutes les teintes séquentielles de la palette.

