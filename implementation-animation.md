# Spécification d'Implémentation — Animations Cognitives Manquantes (kit-charts)

> **Document destiné à un agent IA orchestrateur.** Il inventorie les motifs d'animation déjà couverts par le kit, puis spécifie **12 nouveaux motifs** à implémenter, avec fondements scientifiques, règles d'usage, mathématiques déterministes, conventions de fichiers et critères d'acceptation. L'agent doit construire l'intégralité des implémentations **exclusivement à partir de ce document** (maths, études, conventions) et des conventions du dépôt — aucune dépendance extérieure.
>
> **Interdictions transverses (non négociables)** : aucun rebond (`bounce`/`elastic`), aucune boucle infinie décorative, aucun délai aléatoire, aucune rotation 3D, aucun spinner décoratif, aucune animation au premier rendu en dashboard. Sources : Tufte 1983, Bartram 2003, Zacks & Tversky 2001, Cleveland & McGill 1984, Tversky et al. 2002.

---

## 0. Contexte du dépôt

- Bibliothèque : `kit-charts` (templates de dataviz ultra-optimisés pour les sciences cognitives, Chart.js v4.4.7, offline Zero-CORS).
- Guide théorique existant : [`guide/animation/guide.md`](guide/animation/guide.md) — 10 motifs cognitifs documentés.
- Templates d'animation existants : `template/animation/01-staged-transitions` → `08-lasseter-anticipation` (chaque motif = 1 dossier avec `preview.html` + `template.js`, plus 1 page racine `NN-slug.html`, cf. `template/animation/template.js`, `preview.html` central).
- API runtime : `window.KitChartsTheme` / `KitCharts.animation` (fournit `getAnimationDuration`, `getStaggerDelay`, `animateStagedUpdate`, `attachPulseAlert`, `animateZoomDrilldown`, `animateWithAnticipation`, `isReducedMotionPreferred`).
- Tests : `test/verify-animation-pages.mjs` vérifie l'existence des pages/folders et le chargement de `chart.umd.min.js` via un tableau `patterns` codé en dur — **à étendre à chaque ajout**.

### Motifs déjà implémentés ✅ (ne pas refaire)

| # | Motif | Fondement |
|---|---|---|
| 01 | Transitions par étapes (out→move→in 25/50/25 %) | Heer & Robertson 2007 |
| 02 | Interpolation anti-change-blindness | Simons & Levin 1997 ; Rensink 1997 |
| 03 | Pulsation d'alerte auto-extinguible | Bartram 2003 ; Healey & Enns 2012 |
| 04 | Zoom / drill-down continu | Bederson & Hollan 1994 (Pad++) ; Furnas 1986 |
| 05 | Stagger plafonné MOT k=4 | Cavanagh & Alvarez 2005 |
| 06 | Durée bornée ≤800 ms + replay interruptible | Tversky, Morrison & Bétrancourt 2002 |
| 07 | Segmentation événementielle narrative | Zacks & Tversky 2001 ; Hullman 2011 |
| 08 | Anticipation Lasseter (micro-recul) | Lasseter 1987 |

---

## 1. Conventions d'implémentation à respecter

1. **Numérotation** : les nouveaux motifs prennent la suite, `09-*` → `20-*`, dans `template/animation/`.
2. **Structure par motif** (répliquer le modèle des motifs 01–08) :
   - Dossier `template/animation/NN-slug/` contenant `preview.html` + `template.js` ;
   - Page racine autonome `template/animation/NN-slug.html` ;
   - `template.js` en module UMD exposant sur `global.KitCharts["anim-NN-slug"]` avec factory `(KitChartsTheme) => ({ createChart, DEFAULT_DATA })`, dépendance `themes/theme-tokens.js` ;
   - Chargement de `chart.umd.min.js` obligatoire (Zero-CORS offline).
3. **Contraintes psychophysiques universelles** :
   - Transitions de données : $\Delta T(N) = \min(800, 300 + 100\log_2(\max(1,N)))$ ms (Dragicevic) ;
   - Micro-interactions : $\le 150$ ms (Card, Robertson & Mackinlay 1991) ;
   - Easing sans dépassement : `easeOutCubic` $= 1-(1-u)^3$, `easeInOutCubic`, `easeOutQuad` — **jamais** bounce/elastic ;
   - Stagger plafonné : $\text{delay}(i) = i \cdot \frac{\max(0, T-300)}{\max(1, N-k)}$ avec $k=4$ (MOT) ;
   - Interruptible instantanément + bouton Rejouer (§1.6 du guide) ;
   - `prefers-reduced-motion: reduce` → $\Delta T = 0$ ms [WCAG 2.2 SC 2.3.3] ;
   - Flashs : $f \le 2$ Hz, $\le 3$ cycles auto-extinguibles [WCAG SC 2.3.1].
4. **Documentation** : chaque motif ajouté à `guide/animation/guide.md` (section, maths, lien démo) et au tableau `patterns` de `test/verify-animation-pages.mjs`.
5. **Déterminisme** : toutes les durées/amplitudes calculées par formule (aucune valeur magique non justifiée par une étude).
6. **Contrat du moteur d'animation (ticker rAF)** : toute boucle d'animation expose `onFrame(easedU, elapsedMs)` où le 2ᵉ argument est le **temps réel écoulé en millisecondes** (jamais la progression normalisée `u`). Justification cognitive : plusieurs motifs exigent une grandeur temporelle physique — throttle perceptuel du count-up (≥ 33 ms entre rendus, cf. B2) et solutions analytiques en temps réel du ressort amorti (cf. B11). Une API qui ne fournirait que `u` rend ces motifs silencieusement non fonctionnels.
7. **Sizing CSS des canvas dessinés manuellement** : tout canvas rendu hors de Chart.js (rendu 2D brut) en pixels physiques (`canvas.width = rect.width × devicePixelRatio`) **doit** voir sa taille CSS fixée explicitement sur le wrapper (`width/height: 100 %`). Sans quoi le canvas s'affiche à sa taille attribut (× dpr) et déborde du conteneur — violation de la stabilité du cadre perceptif.
8. **Visibilité de l'état Reduced Motion** : le contrôle UI doit afficher l'état réellement détecté (« Actif (auto) » si `prefers-reduced-motion`, « Inactif » sinon) et permettre la bascule manuelle. Sans cet affichage, un utilisateur dont l'OS réduit les animations voit ΔT = 0 ms partout et conclut à une défaillance.

---

## 2. Les 12 motifs manquants à créer

### B1. Révélation progressive de tracé (Path Drawing / Line Reveal) — `09`

- **Usage storytelling** : révéler une courbe point-par-point comme narration chronologique (« et ensuite… »). Levier de suspense temporel n°1.
- **Études** : Tversky, Morrison & Bétrancourt 2002 (congruence spatio-temporelle + exigence d'appréhension) ; Heer & Robertson 2007 ; Zacks & Tversky 2001.
- **Quand** : ligne/aire unique, ≤2 séries, révélation chronologique, présentation guidée.
- **Ne pas utiliser** : comparaison multi-séries (l'attente détruit la comparaison), données non temporelles, dashboards permanents.
- **Maths** :
$$\text{dashoffset}(t) = L \cdot \left(1 - \text{easeInOut}\!\left(\tfrac{t}{T}\right)\right), \quad \text{dasharray} = L$$
$L$ = longueur d'arc totale. **Reparamétrisation par longueur d'arc obligatoire** ($\|\gamma'(s)\| = 1$) : cumuler les longueurs de segments en pixels et interpoler le front de révélation $x$ par recherche du seuil dans le tableau cumulé.
- **Durée** : deux régimes distincts. Mode narration guidée : $T \approx 2\,200$ ms — une révélation doit être assez longue pour être « appréhendée » (Tversky et al. 2002), interruptible + replay obligatoires ; toute mise à jour de données reste quant à elle plafonnée à $\Delta T(N) \le 800$ ms.

### B2. Compteur numérique animé (Count-up / Odometer) — `10`

- **Usage storytelling** : KPI héros, chiffre-clé d'une slide. Complète `00-kpi-card`.
- **Études** : Dehaene (magnitude analogique) ; Tversky et al. 2002 (≤800 ms) ; WCAG 2.2.
- **Quand** : UN seul chiffre héros, montée ≤800 ms ($\Delta T(4) = 500$ ms), chiffre final affiché ≥2 s.
- **Ne pas utiliser** : compteurs simultanés multiples (MOT), valeurs <5 (subitizing), tableaux, dashboards denses.
- **Maths** :
$$v(t) = \mathrm{round}\!\left(v_0 + \Delta v \cdot \text{easeOutCubic}\!\left(\tfrac{t}{T}\right)\right)$$
Contraintes : `font-variant-numeric: tabular-nums` (anti-jitter de largeur) ; fréquence de mise à jour plafonnée ~30 Hz ; finition exacte garantie en `onDone`.

### B3. Focus + Context (Dimming des non-sélectionnés) — `11`

- **Usage storytelling** : guider l'œil vers UNE série/point pendant que le reste reste lisible en périphérie.
- **Études** : Pirolli & Card 1999 (information foraging) ; Furnas 1986 (fisheye) ; Treisman (contraste préattentionnel) ; Franconeri et al.
- **Quand** : annotation ponctuelle, survol de légende, comparaison « 1 vs reste ».
- **Ne pas utiliser** : comparaison multi-séries simultanée, impression/statique, pénombre active >~20 % du temps d'interaction.
- **Maths** :
$$\alpha_{target} = \begin{cases} 1 & i \in S \\ 0.25 & \text{sinon} \end{cases} \qquad \alpha_i(t) = \alpha_{target} + (\alpha_0 - \alpha_{target})(1-u)^2$$
$T \le 150$ ms, easeOutQuad. **Jamais combiné avec un mouvement de position simultané** ; mise à jour via `chart.update('none')` (opacité seule).

### B4. Course de barres classée (Bar Chart Race / Rank Morphing) — `12`

- **Usage storytelling** : évolution animée de classements. Fort impact mais risqué.
- **Études** : Robertson et al. CHI 2008 ; Cavanagh & Alvarez 2005 (MOT k≤4) ; Heer & Robertson 2007 (constance d'objet par verrouillage couleur).
- **Quand** : N ≤ 6 entités, présentation/replay contrôlé, couleurs stables par entité.
- **Ne pas utiliser** : N > 8, lecture précise de valeurs, export statique.
- **Maths** : interpolation en espace de rang, **inversions adjacentes uniquement** entre frames consécutives :
$$y_i(u) = y_{r_0(i)} + \left(y_{r_1(i)} - y_{r_0(i)}\right)\cdot \text{easeInOutCubic}(u), \quad \Delta T(N) \text{ par étape, pause} \ge 450\text{ ms}$$
Implémentation Chart.js viable : réordonner `labels`/`data`/`backgroundColor` par frame, laisser Chart.js morpher (easing `easeInOutCubic`).

### B5. Panoramique caméra (Pan / Overview+Detail) — `13`

- **Usage storytelling** : balayer un domaine étendu avant de zoomer. Complète le zoom (motif 04).
- **Études** : Shneiderman 1996 ; Plumlee & Ware 2006 ; Furnas 1986.
- **Quand** : domaine >> viewport (séries longues, cartes), drill-down hiérarchique.
- **Ne pas utiliser** : déplacement > 3× le viewport (perte de repères), données sans continuité spatiale.
- **Maths** :
$$c(u) = c_0 + (c_1 - c_0)\cdot \text{easeInOutCubic}(u)$$
échelle constante ; $T = \text{clamp}\left(\frac{\text{dist\_px}}{2000\ \text{px}\cdot\text{s}^{-1}},\ 120\text{ ms},\ 600\text{ ms}\right)$ ; mise à jour `scales.x.min/max` par frame avec `update('none')`.

### B6. Morphing entre types de graphiques (Cross-Type Transition) — `14`

- **Usage storytelling** : même vérité, autre question posée (bar→pie = valeurs absolues → parts).
- **Études** : Robertson et al. CHI 2008 ; Cleveland & McGill 1984 (hiérarchie des encodages).
- **Quand** : rhétorique de reformulation, structure out→move→in stricte, N ≤ 12.
- **Ne pas utiliser** : encodages incommensurables (pie→scatter), >2 types enchaînés.
- **Maths** : échantillonner les deux contours à $M = 32$ points (périmètre du rectangle uniformément ; secteur = apex en index 0 + arc), interpolation index-wise :
$$x_i(p) = (1-p)\cdot f^{-1}_{cart}(i) + p\cdot g^{-1}_{polar}(i), \quad p = \text{easeInOutCubic}(u)$$
Décor d'axes : fondu sortant sur [0, 0.25T], libellés entrants sur [0.75T, T]. **Rendu canvas brut requis** (Chart.js ne morphe pas entre types) — appliquer la contrainte de sizing CSS (§1, point 7).

### B7. Rescaling d'axe animé (Linéaire ↔ Logarithmique) — `15`

- **Usage storytelling** : révéler la nature exponentielle d'une croissance (droite en log = explosive en linéaire).
- **Études** : Cleveland & McGill 1984 ; Cumming & Fidler ; Tufte 1983.
- **Quand** : pédagogie de croissance, **labels d'axe synchrones pendant toute la transition** (fondu croisé des deux graduations).
- **Ne pas utiliser** : jamais sans labels synchrones (violation d'intégrité graphique), données ≤0.
- **Maths** : interpolation dans l'espace perceptuel, axe y fixé [0,1] :
$$y_v(p) = (1-p)\cdot m_{lin}(v) + p\cdot m_{log}(v), \quad m_{lin} = \frac{v - v_{min}}{v_{max} - v_{min}}, \quad m_{log} = \frac{\ln v - \ln v_{min}}{\ln v_{max} - \ln v_{min}}$$
Plugin custom dessinant les ticks des deux échelles avec $\alpha_{lin} = 1-p$, $\alpha_{log} = p$.

### B8. Traînée cométaire (Motion Trails / Comet Chart) — `16`

- **Usage storytelling** : trajectoire chronologique X-Y — motif signature Gapminder. Complète le connected-scatter-plot.
- **Études** : Heer & Robertson 2007 (les trails réduisent les erreurs de correspondance) ; Rensink.
- **Quand** : connected scatter plot, ≤4 trajectoires, révélation chronologique.
- **Ne pas utiliser** : >4 trajectoires, données discrètes sans ordre.
- **Maths** :
$$\alpha(s) = e^{-s/\lambda}, \quad \lambda \approx 15{-}25\,\%\ \text{de } L$$
Tête avance à vitesse constante par longueur d'arc ($s_{head} = u \cdot L$, reparamétrisation $\|\gamma'\| = 1$) ; trace complète en fond faible (α ≈ 0.18) ; tête à rayon constant.

### B9. Construction sérielle narrative (Build-up par série) — `17`

- **Usage storytelling** : les séries entrent une par une (« d'abord X… puis Y arrive »). Diffère du stagger (motif 05) : entre **séries**, pas entre éléments.
- **Études** : Miller 1956 (7±2) ; Cavanagh & Alvarez 2005 ; Hullman et al. 2013 (scaffolding).
- **Quand** : multi-line en présentation, ≤4 séries, ≥1,5 s de lecture par étape.
- **Ne pas utiliser** : exploration autonome, >4 séries, dashboards.
- **Maths** : porte cumulée :
$$\text{série } j \text{ visible} \iff t > j \cdot T_s, \quad T_s \ge 800\text{ ms}, \; \text{fade-in } 250\text{ ms}, \; j_{max} \le 4$$
Fade-in par alpha rgba (`borderColor`), `chart.update('none')` par frame — opacité seule, zéro mouvement.

### B10. Scrollytelling à pas avec hystérésis — `18`

- **Usage storytelling** : le scroll pilote les étapes narratives — l'**orchestrateur** de tous les autres motifs.
- **Études** : Conlen & Heer 2019 (Idyll) ; Brehmer et al. 2017 ; Hullman & Adar 2015 ; Zacks & Tversky 2001.
- **Quand** : page narrative verticale, 3–8 étapes, texte visible lié à chaque état.
- **Ne pas utiliser** : dashboards, scroll mobile instable sans garde, >8 étapes.
- **Maths** (le mapping par fraction de scroll est prescriptif) :
$$r = \frac{\text{scrollTop}}{\text{scrollMax}} \times (n-1) \in [0, n-1]$$
$$\text{avance}: r \ge k + 0.65 \quad ; \quad \text{recule}: r \le k - 0.65 \quad (\text{bande morte } \pm 0.15 \text{ autour du milieu } k+0.5)$$
Le mapping par **fraction de scroll** garantit que la dernière étape est atteignable quel que soit le ratio contenu/viewport (un mapping `scrollTop/H` fixe peut rendre les dernières étapes inaccessibles). Chaque changement $k_n \to k_{n+1}$ déclenche `animateStagedUpdate`. Direction détectée par comparaison `scrollTop` vs précédent. Les sections du récit dans un conteneur scrollable exigent `flex-shrink: 0` (sinon elles se compressent et le scroll disparaît).

### B11. Amorti critique physique (Spring sans dépassement) — `19`

- **Usage storytelling** : sensation « vivante » sans rebond — seul ressort compatible Tufte.
- **Études** : Card, Robertson & Mackinlay 1991 ; Dragicevic 2011.
- **Quand** : drag & drop, retour d'élément à son ancre.
- **Ne pas utiliser** : transitions de données (garder easeOutCubic), alertes (garder le motif 03).
- **Maths** : solution **exacte** de l'oscillateur à amortissement critique ($\zeta = 1$), évaluée par frame (aucune intégration numérique) :
$$x(t) = x_1 - (x_1 - x_0)(1 + \omega t)\,e^{-\omega t}, \quad \omega \approx \frac{6}{T} \text{ pour } t_{95\%} = \frac{3}{\omega} = T = 500\text{ ms}$$
⚠️ $t$ est le **temps réel écoulé en ms** fourni par le ticker (§1, point 6) — jamais la progression normalisée, sinon $\omega t \approx 0$ et le point reste figé.

### B12. Flash d'onset pour valeurs modifiées (Delta Highlight) — `20`

- **Usage storytelling** : signaler *ce qui vient de changer* en flux temps réel, sans déplacement.
- **Études** : Jonides & Yantis 1988 (les onsets captent l'attention préattentionnellement) ; Healey & Enns 2012 ; WCAG SC 2.3.1.
- **Quand** : flux temps réel, 1–3 cellules modifiées par tick.
- **Ne pas utiliser** : >10 % des marques modifiées simultanément, clignotement persistant, superposition avec le motif 03.
- **Maths** :
$$B(t) = B_0\, e^{-t/\tau}, \quad B_0 \le 0.35, \; \tau \approx 400\text{ ms}, \; \text{tick fixe} \ge 800\text{ ms} \; (\Rightarrow \le \sim2\text{ flashes/s})$$
Plugin `afterDatasetsDraw` dessinant la surbrillance sur les barres modifiées ; purge quand $B < 0.01$ ; tick **fixe** (jamais de délai aléatoire). Reduced motion : bordure brève au lieu du flash.

---

## 3. Priorisation recommandée (ordre de création)

1. **09 Path drawing** (B1) — motif narratif n°1, faible risque cognitif.
2. **11 Focus+Context** (B3) — bénéficie à toutes les familles de charts existantes.
3. **18 Scrollytelling** (B10) — infrastructure qui orchestre tous les autres motifs.
4. **17 Series build-up** (B9) + **16 Motion trails** (B8) — complètent la famille 05-evolution-temporelle.
5. **12 Bar race** (B4) — gros effet, garde-fous MOT stricts obligatoires.
6. **10 Count-up** (B2) — petit effort, complète `00-kpi-card`.
7. **13 Pan** (B5), **14 Cross-type morph** (B6), **15 Axis rescale** (B7), **19 Critical damping** (B11), **20 Delta flash** (B12) — secondaires, complétude académique.

---

## 4. Critères d'acceptation (checklist par motif)

Pour chaque nouveau motif NN-slug :

- [ ] Dossier `template/animation/NN-slug/` contenant `preview.html` + `template.js` (module UMD `KitCharts["anim-NN-slug"]`).
- [ ] Page racine autonome `template/animation/NN-slug.html` chargeant `chart.umd.min.js` (offline Zero-CORS).
- [ ] Fonction exposée sur `window.KitChartsTheme` / `KitCharts.animation`, signature documentée.
- [ ] Paramètres numériques conformes aux maths ci-dessus (aucune valeur arbitraire).
- [ ] Durées respectant : $\Delta T(N) \le 800$ ms (données), $\le 150$ ms (micro-interaction) — sauf exception narration documentée (09).
- [ ] Interruptible + bouton Rejouer.
- [ ] Support `prefers-reduced-motion: reduce` → $\Delta T = 0$ ms, avec état visible dans l'UI (« Actif (auto) » si détecté).
- [ ] Garde-fou si Chart.js ne charge pas (bannière explicite, pas de canvas silencieusement vide).
- [ ] Pas de bounce/elastic, pas de boucle infinie, pas de délai aléatoire.
- [ ] Cartes « ✅ Quand l'utiliser / ❌ Quand NE PAS l'utiliser » documentées avec sources.
- [ ] Section ajoutée à `guide/animation/guide.md` (études + maths + lien démo).
- [ ] Entrée ajoutée au tableau `patterns` de `test/verify-animation-pages.mjs` ; test passant (`node test/verify-animation-pages.mjs`).
- [ ] Enregistrement dans `template/animation/preview.html` (index des motifs).

---

## 5. Anti-patterns à proscrire (à documenter comme tels)

| Anti-pattern | Pourquoi | Source |
|---|---|---|
| Bounce / elastic | Artéfact de fausse mesure | Tufte 1983 ; règle §1.7 guide |
| Boucles infinies décoratives | Habituation + fatigue attentionnelle permanente | Bartram 2003 |
| Délais aléatoires (random stagger) | Détruit prédictibilité et segmentation d'événements | Zacks & Tversky 2001 |
| Rotation 3D de graphiques | Occlusion + distorsion perspective | Cleveland & McGill 1984 |
| Spinners décoratifs hors latence réelle | Coût attentionnel pur (chartjunk cinétique) | Tufte 1983 |
| Animation au premier rendu en dashboard | Retard d'accès à l'info pour l'expert | Tversky et al. 2002 |
| Deux signaux préattentionnels simultanés (pulse + flash) | Ils se neutralisent et épuisent l'attention | Healey & Enns 2012 |

---

