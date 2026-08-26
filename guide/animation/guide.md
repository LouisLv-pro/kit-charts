# Guide d'Ingénierie & Psychophysique des Micro-Animations Cognitives

Ce guide expose les 10 motifs cinématiques, fondements psychophysiques, formulations mathématiques et l'implémentation déterministe des micro-animations au sein de la bibliothèque **kit-charts** (compatible Chart.js v4.4.7 et Zero-CORS offline).

---

## 1. Les 10 Motifs Cognitifs & Modèles Psychophysiques

### 1.1 Transitions par Étapes (*Staged Transitions*) — Heer & Robertson (2007)
Pour éviter la surcharge cognitive lors d'un changement simultané de structure graphique et de valeurs, la transition totale $T$ est découpée en 3 sous-phases séquentielles :
$$T = T_{\text{out}} + T_{\text{move}} + T_{\text{in}} \quad \text{avec} \quad T_{\text{out}} = 0.25T, \; T_{\text{move}} = 0.50T, \; T_{\text{in}} = 0.25T$$
- **Phase 1 (Fade-out)** : Disparition des éléments sortants ou de l'ancien encodage.
- **Phase 2 (Move/Morph)** : Translation spatiale et morphing des éléments persistants.
- **Phase 3 (Fade-in)** : Apparition progressive des nouveaux éléments ou annotations.

### 1.2 Interpolation Fluide Anti-« Change Blindness » — Simons & Levin (1997), Rensink (1997)
La mise à jour d'un jeu de données s'effectue par interpolation continue de la position et de la hauteur des marques géométriques, sans jamais détruire ni recréer l'instance Canvas :
$$v(t) = v_0 + (v_1 - v_0) \cdot \text{easeOutCubic}\left(\frac{t}{T}\right)$$
Cette continuité spatio-temporelle préserve la constance d'objet (*Object Constancy*) et élimine le phénomène de cécité au changement.

### 1.3 Motion = Alerte Uniquement — Bartram et al. (2003), Healey & Enns (2012)
Le mouvement visuel est le stimulus préattentif le plus puissant du cortex visuel humain. Il ne doit être utilisé en régime permanent que pour signaler une rupture critique ou un dépassement de seuil, modélisé par une oscillation sinusoïdale amortie auto-extinguible :
$$\text{scale}(t) = 1 + A \cdot \sin(2\pi f t) \cdot \exp\left(-\frac{t}{\tau}\right) \quad \text{avec} \quad t \le \frac{3}{f}$$
- **Paramètres optimaux** : Amplitude $A = 0.06 - 0.08$, Fréquence $f = 2\text{ Hz}$, Constante d'amortissement $\tau = 1.0 - 1.2\text{ s}$, Nombre d'impulsions $N_p \le 3$.

### 1.4 Zoom / Drill-down Continu — Bederson & Hollan (1994, Pad++), Furnas (1986)
Lors de l'exploration multivariée (drill-down hiérarchique ou zoom temporel), l'échelle d'affichage $s(t)$ suit une interpolation logarithmique continue pour maintenir la perception de l'espace global :
$$s(t) = s_0 \cdot \left(\frac{s_1}{s_0}\right)^p \quad \text{où} \quad p = \text{easeInOutCubic}\left(\frac{t}{T}\right)$$

### 1.5 Stagger Plafonné pour Grand $N$ — Cavanagh & Alvarez (2005)
Le décalage en cascade (*stagger*) entre éléments est plafonné pour respecter la limite du *Multiple Object Tracking* (MOT) de la vision humaine ($k \le 4$ cibles suivies simultanément) :
$$\text{delay}(i) = i \cdot \frac{\max(0, T - T_{\text{unit}})}{\max(1, N - k)} \quad \text{avec} \quad k = 4, \; T_{\text{unit}} = 300\text{ ms}$$

### 1.6 Appréhension & Replay — Tversky, Morrison, Bétrancourt (2002)
- **Durée totale bornée** : $T \le 800\text{ ms}$ pour empêcher toute saturation de la mémoire de travail.
- **Interruptibilité & Contrôle** : Toute interaction utilisateur (clic, survol, nouveau filtre) interrompt immédiatement la transition en cours sans bloquer le rendu.
- **Bouton Rejouer** : Fourni par défaut pour permettre à l'analyste de réexaminer un phénomène dynamique.

### 1.7 Modèles d'Amorti Calibrés (*Easing*) — Dragicevic et al. (2011), Penner (2002)
- **Courbe par défaut** : `easeOutCubic` ($1 - (1-u)^3$) simulant une décélération naturelle sous frottement visqueux.
- **Interdiction formelle des rebonds (*Bounce / Elastic*)** : Les dépassements oscillatoires créent des artéfacts de fausse mesure et violent les règles d'intégrité de Tufte (1983).

### 1.8 Budget Temporel des Micro-Interactions — Card, Robertson & Mackinlay (1991)
- Réactivité aux interactions directes (survol de tooltip, focus, activation) calibrée à $T \le 150\text{ ms}$ avec amorti `easeOutQuad`.

### 1.9 Segmentation Événementielle Narrative — Zacks & Tversky (2001), Hullman et al. (2011)
Pour les présentations séquentielles, le partitionnement en scènes narratives est automatisé en détectant les points d'inflexion statistique majeurs :
$$\frac{\Delta(f_i, f_{i+1})}{\sigma_v} > \theta \quad (\text{seuil standard } \theta = 1.5)$$

### 1.10 Anticipation Traditionnelle — Lasseter (SIGGRAPH 1987)
Avant une réorganisation spatiale majeure (ex: tri complet), un micro-recul inverse préparatoire de faible amplitude focalise l'attention de l'utilisateur :
$$x(t) = x_0 + \Delta x \cdot \left[ -a \cdot g\left(\frac{t}{T_a}\right) + \text{easeOutCubic}\left(\frac{t}{T_m}\right) \right]$$
- **Paramètres** : Amplitude de recul $a = 0.05 - 0.08$, Durée $T_a \approx 60\text{ ms}$.

---

## 2. Formulation Mathématique de Durée $\Delta T(N)$

La durée optimale d'une transition est calculée par la loi logarithmique de Dragicevic :
$$\Delta T(N) = \min\left(800\text{ms}, 300 + 100 \cdot \log_2(\max(1, N))\right)$$

| Nombre d'éléments $N$ | Durée calculée $\Delta T$ | Rationale perceptif |
| :--- | :--- | :--- |
| **$N = 4$** | $500\text{ ms}$ | Traitement subitizing immédiat |
| **$N = 8$** | $600\text{ ms}$ | Transition standard optimale |
| **$N = 16$** | $700\text{ ms}$ | Exploration visuelle étendue |
| **$N \ge 32$** | $800\text{ ms}$ | Plafond strict de mémoire de travail |

---

## 3. Matrice de Conformité WCAG 2.2 AAA & Réduction de Mouvement

| Critère WCAG 2.2 | Exigence | Implémentation `kit-charts` |
| :--- | :--- | :--- |
| **SC 2.3.3 Mouvement Réduit** | Désactivation sur demande utilisateur | Bascule instantanée à $\Delta T = 0\text{ ms}$ si `@media (prefers-reduced-motion: reduce)` est détecté |
| **SC 2.3.1 Seuil de Clignotement** | Pas de flashs $> 3\text{ Hz}$ | Pulsations d'alerte limitées à $f \le 2\text{ Hz}$ et $N_p \le 3$ cycles auto-extinguibles |
| **Data-Ink Tufte 1983** | Clarté exécutive et zéro bruit visuel | Thème `tufte-minimalist-executive` avec animations désactivées par défaut ($\Delta T = 0\text{ ms}$) |

---

## 4. Guide d'Utilisation des APIs d'Animation

### 4.1 Fonctions Déclaratives sur `window.KitChartsTheme` / `KitCharts.animation`

```javascript
// 1. Calcul de durée logarithmique
const duration = KitChartsTheme.getAnimationDuration(8); // 600 ms

// 2. Stagger plafonné MOT k=4
const delay = KitChartsTheme.getStaggerDelay(ctx, { unitMs: 300, overlapCap: 4, duration: 600 });

// 3. Transition par étapes (Fade -> Move -> Fade)
await KitChartsTheme.animateStagedUpdate(chart, {
  labels: ['R&D', 'Infra', 'Support', 'RH'],
  datasets: [{ data: [90, 85, 75, 80] }]
}, 'bar', { duration: 700 });

// 4. Alerte préattentive auto-extinguible
const handle = KitChartsTheme.attachPulseAlert(chart, {
  threshold: 85,
  amplitude: 0.07,
  frequency: 2
});

// 5. Zoom / Drill-down continu
await KitChartsTheme.animateZoomDrilldown(chart, { min: 50, max: 100 }, { duration: 400 });

// 6. Tri avec micro-anticipation Lasseter
await KitChartsTheme.animateWithAnticipation(chart, (c) => {
  // Mutation des données ici
}, { recoilMs: 60 });
```

---

## 5. Pages de Démonstration Isolées par Pattern

Chaque motif cinématique dispose d'une page HTML autonome de test et d'analyse :

1. [**01. Transitions par Étapes (Heer &amp; Robertson 2007)**](../../template/animation/01-staged-transitions.html) — Découpage $T = 0.25T + 0.50T + 0.25T$ et morphing de type.
2. [**02. Interpolation Anti-Change Blindness (Simons &amp; Levin 1997)**](../../template/animation/02-anti-change-blindness.html) — Mutation continue in-place des valeurs.
3. [**03. Alerte Préattentive Auto-Extinguible (Bartram 2003 / Healey 2012)**](../../template/animation/03-preattentive-pulse.html) — Onde sinusoïdale amortie ($\le 3$ impulsions).
4. [**04. Zoom &amp; Drill-down Continu Pad++ (Bederson &amp; Hollan 1994)**](../../template/animation/04-continuous-zoom.html) — Interpolation logarithmique continue d'échelle.
5. [**05. Stagger Plafonné MOT (Cavanagh &amp; Alvarez 2005)**](../../template/animation/05-mot-stagger.html) — Plafonnement du suivi visuel à $k \le 4$ marques.
6. [**06. Appréhension &amp; Replay (Tversky et al. 2002)**](../../template/animation/06-apprehension-replay.html) — Durée bornée $\le 800\text{ ms}$ et replay interactif.
7. [**07. Segmentation Événementielle Narrative (Zacks 2001 / Hullman 2011)**](../../template/animation/07-event-segmentation.html) — Découpage par seuil statistique $\Delta/\sigma > \theta$.
8. [**08. Anticipation Traditionnelle Lasseter (Lasseter 1987)**](../../template/animation/08-lasseter-anticipation.html) — Micro-recul inverse préparatoire $T_a \approx 60\text{ ms}$.

