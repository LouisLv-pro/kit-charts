# Review visuelle des 73 templates (novembre 2026)

Méthode : capture Chrome headless de chaque preview.html en thème clair (colorbrewer-accessible) et sombre (nord-cognitive-dark), puis revue experte de l'image et du code par 9 reviewers en parallèle (forme canonique, règles cognitives d'AGENTS.md, rendu, justesse statistique).

## Bilan avant correction

| Verdict | Templates |
|---|---|
| bloquant | 10 |
| majeur | 40 |
| mineur | 19 |
| ok | 4 |

Forme fausse (visuel halluciné) : `bullet-chart`, `polar-area-chart`, `sunburst`, `waffle-chart`, `streamgraph`, `chord-diagram`, `dendrogram`, `marimekko-chart`.

## Causes transverses

- `getContrastingTextColor` (themes/theme-tokens.js) choisissait le texte par un seuil de luma 0,58 et non par ratio WCAG : étiquettes blanches sous 4,5:1 sur les barres empilées, l'aire polaire, les cellules.
- Arrondi forcé à l'entier des étiquettes au-delà de 10 (21,5 affiché 22).
- Palette Nord sombre : les indices 0 à 2 étaient trois bleus, séries adjacentes indiscernables (radar, slope, dumbbell, empilés).
- Couleur de rôle `context` à 1,4:1 contre la surface : éléments de contexte quasi invisibles.
- `generateLabels` personnalisés sans `fontColor` : légende noire en thème sombre.
- Habillage des preview.html : couleurs claires en dur, texte illisible en thème sombre.
- index.html : les cartes KPI passaient par `createChart` (code mort) au lieu de `renderCard`, d'où des aperçus faux.

## Corrections appliquées

Toutes les formes fausses sont réécrites et revérifiées à l'œil sur captures finales (clair et sombre) par une seconde équipe de reviewers indépendants :
`chord-diagram` (arcs et rubans), `sunburst` (racine au centre, teinte héritée), `marimekko-chart` (rectangles largeur × hauteur), `streamgraph` (base symétrique), `dendrogram` (connecteurs en U), `bullet-chart` (bandes superposées, mesure, cible), `waffle-chart` (cases carrées), `polar-area-chart` (aire proportionnelle à la valeur), `histogramme-kde` (courbe continue, barres contiguës), `cartogram-tilegram` (nord en haut).

Corrections centrales (`themes/theme-tokens.js`) :
- `getContrastingTextColor` choisit le texte par ratio WCAG réel.
- Le plugin d'étiquettes lit la config brute : les `formatter` des templates s'appliquent enfin (Chart.js les exécutait comme options scriptables), `display` peut être une fonction.
- Thème transmis au plugin via `getChartDefaultOptions` (`themeName`) : badges corrects en sombre.
- Légende commune sans `pointStyle` forcé ; décimale conservée sous 1000 ; palette Nord réordonnée ; couleur `context` visible dans les 8 thèmes.

Pages de preview : habillage lisible en sombre, polices chargées à la demande, textes réécrits en langage simple.

Petite taille : chaque template a été vérifié dans une carte de la taille d'index.html (environ 380 × 226 px) ; marges, rayons et libellés s'adaptent à la largeur.

index.html :
- cartes KPI rendues par `renderCard` (même chemin que les previews et le compilateur) au lieu d'un code mort ;
- rendu paresseux (IntersectionObserver), plus de double rendu, changement de thème limité aux cartes visibles (336 ms → 40 ms bloquants) ;
- scripts en `defer`, une seule police au chargement (DOMContentLoaded 995 ms → 368 ms en local) ;
- textes réécrits sans jargon, footer remplacé par une signature typographique en dégradé.

Validation : `npm test` 85/85, snapshots régénérés (diff relu : aucun `beginAtZero:false`, aucune échelle log ; seuls les axes fantômes du sunburst perdent leur `beginAtZero`), `npm run test:render` 73/73.

Restes mineurs (corrigés en novembre 2026, vérifiés sur captures en clair et en sombre, à 380 px puis 1200 px) :
- `bullet-chart` : l'étiquette de valeur ne touche plus le trait de cible. Elle est posée par le template : à droite de la barre, ou de l'autre côté du trait quand l'écart entre la valeur et la cible est faible ; faute de place à droite, elle rentre dans la barre, avant la cible.
- `bubble-map` : Londres et Paris restent distinguables. Les petites bulles sont dessinées au-dessus des grandes, le remplissage est translucide, chaque cercle garde un contour entier (trait sombre bordé de la couleur du fond, dessiné au-dessus de toutes les bulles) et un point au centre marque le lieu. Les rayons ne changent pas : la surface reste proportionnelle à la valeur.
- Mode compact recalculé quand le conteneur change de largeur, dans les deux sens. Tableaux (`table-*`) : un ResizeObserver par conteneur, libéré au destroy, remplacé si le tableau est recréé (changement de thème) ; le re-rendu n'a lieu que si l'état compact bascule. Graphiques Chart.js (`waterfall-cumulative-line`, `bar-target-overlay`, `pareto-chart`, `stacked-total-line`, `sunburst`, `marimekko-chart`, `sankey-diagram`) : options reconstruites via le cycle de redimensionnement de Chart.js, qui observe déjà le conteneur et se libère au destroy. Aucune écoute de window.resize. `waterfall-chart` était déjà dynamique (largeur lue à chaque calcul des graduations).

Encore visible à 380 px, hors de ce lot : libellés d'axe serrés sur `waterfall-cumulative-line` (mots abrégés qui se touchent), tableaux `table-financial-variance` et `table-heatmap-matrix` plus larges que la carte (défilement horizontal).

## Détail par template (constats initiaux)

### kpi

**kpi-bullet** : majeur

- [majeur, cognitif] Carte 3 (latence 18,2 ms, cible 15 ms, metricType 'cost' dans preview.html:392) affiche badge vert '121% Atteint' et barre verte. template.js:112 `valence = attainment >= 100 ? 1 : ...` et :246 `isSuccess = attainment >= 100` ignorent metricType : pour LOWER_IS_BETTER, depasser la cible est un echec.
- [mineur, rendu] Les 3 bandes qualitatives sont a peine visibles en clair (alpha 0.08/0.05/0.03, template.js:165,175,185) ; en sombre l'ordre d'intensite est inverse (0.06/0.10/0.14 lignes 165-185) : incoherent avec la convention Few (plus fonce = plus mauvais).
- [mineur, cognitif] animation: { duration: 400 } (template.js:197) au lieu de animation:false exige par AGENTS.md §4.
- [mineur, rendu] Petit triangle '▼' dessine par le plugin (template.js:139) au-dessus du trait cible mais clippe par le canvas de 38px (non visible sur la capture). Y=0 respecte (x.min:0, ligne 211).

**kpi-comparative** : majeur

- [majeur, rendu] Donnees de demo incoherentes : preview.html fait Object.assign(DEFAULT_DATA, {value:142850,...}) donc les cartes montrent '142 850 €' avec 'VS ANNEE N-1 (64,2 €)' et '+4,3 € (+6,7%)', et '84,5 %' vs budget '70 %' ; les ecarts/references viennent de DEFAULT_DATA (marge 68,5 %) et ne correspondent pas a la valeur.
- [mineur, rendu] Libelles de reperes qui passent a la ligne ('VS BUDGET PREVU (70 / €)') et pastilles decalees entre cartes (carte 2 plus haute que 1 et 3). Aucun graphique visible : createChart (barres N/N-1/Budget, template.js:91) n'est jamais appele par renderCard.
- [mineur, cognitif] animation: {duration:400} dans createChart (template.js:149). Polarite ok : carte 3 (cost) +4,3 ms en rouge, -1,5 en vert.

**kpi-composite** : majeur

- [majeur, cognitif] Les leviers (Commandes, Panier moyen, Tx conv.) forcent la polarite 'gain' : template.js:98 `getValenceColor(tokens, isPos?1:-1,'gain')` et :171 idem, sans champ de polarite par driver. Un levier de type cout/churn en hausse s'afficherait en vert.
- [majeur, rendu] Les trois cartes affichent les memes 3 leviers (Commandes 10 240, Panier moyen 82,27 €, Tx conv. 3,42 %) sous 'Indicateur d'alerte C 18,2 ms' et '84,5 %' : causalite absurde, hero et leviers viennent de jeux de donnees differents (preview.html surcharge DEFAULT_DATA).
- [mineur, rendu] Le sous-titre annonce 'metrique dominante (60%)' : rien dans le rendu n'encode 60 %. Aucun createChart visible (deja code mort pour la carte). animation:400 (template.js:118).

**kpi-distribution** : majeur

- [majeur, rendu] Memes 4 canaux d'acquisition (Organique 45 / Direct 25 / Payant 20 / Referral 10 %) sous '142 850 €', '84,5 %' et '18,2 ms' : une latence ou un taux ne se decompose pas en canaux de trafic. Donnees de DEFAULT_DATA (trafic) greffees sur des valeurs sans rapport.
- [mineur, rendu] Carte 3 : 'ms' colle a 'vs semaine passee (23.6 ms)' sans espace (la rangee baseline n'a pas de gap).
- [mineur, cognitif] Largeurs = seg.pct brut (template.js:~158 `width: ${seg.pct}%`) ; validateData (l.52-62) n'impose pas somme = 100, donc barre incomplete ou tronquee possible. Segments en teintes proches de bleu en sombre (nord) : Organique/Direct/Payant peu distinguables.
- [mineur, cognitif] animation:400 dans createChart (template.js:116), createChart non utilise par renderCard.

**kpi-status-alert** : majeur

- [majeur, cognitif] Polarite ignoree par la demo : preview.html fait Object.assign(DEFAULT_DATA,...) donc polarity:'lower-is-better' et maxScale:200 s'appliquent aux 3 cartes. Carte 2 (84,5 %, 'higher is better' metier, seuil 80) est notee 'Attention' alors que 84,5 > 80 est conforme ; carte 3 reste 'Attention' avec footnote 'Latence nominale optimale'. Le template ne lit pas metricType, seulement data.polarity (template.js:~268).
- [majeur, rendu] Carte 1 : valeur 142 850 € avec seuils 100/150 et maxScale 200 : curseur colle au bord droit (clamp template.js createChart `Math.min(chartArea.right, ...)`), statut 'Critique' sans rapport avec les donnees ; footnote 'Cloture operationnelle certifiee' affichee en rouge (template.js:381). Echelle de la jauge non coherente avec la valeur.
- [mineur, rendu] Carte 1 : l'unite '€' passe a la ligne sous '142 850' car 'Plage nominale : < 100 €' occupe la place ; hauteur de cartes inegale.
- [mineur, contraste] Zones de jauge a alpha 0.25 (clair) / 0.35 (sombre) : zones vert/orange/rouge pales, distinction par la seule teinte hors badge ; le badge texte+icone compense (WCAG ok).
- [mineur, cognitif] animation:400 (template.js:215).

**kpi-sparkline** : mineur

- [mineur, rendu] Sparkline de seulement 6 points (preview.html history) alors que l'encart annonce 12 a 30 points ; carte 1 : history en k€ [120..142.85] sous la valeur '142 850 €' (tooltip afficherait '142.85€', template.js tooltip `${ctx.parsed.y}${data.unit}` sans espace ni echelle).
- [mineur, cognitif] Couleur du trait = signe du delta via getValenceColor(metricType) : carte 3 (cost, -5,4 %) en vert, polarite correcte. Mais le point max est colore avec palette[1] (orange sur carte 3) sans signification (template.js:~126).
- [mineur, cognitif] animation:400 (template.js:142).

**kpi-standard** : mineur

- [mineur, rendu] Le rendu est purement textuel (valeur + badge + libelle) ; createChart (doughnut 260 degres, valeur/benchmark ecretee a 100 %, template.js:100-125) n'est jamais appele par renderCard : code mort, et un anneau a 80 % de cutout avec ratio clamp masquerait un depassement de benchmark (142850 vs 125080).
- [mineur, cognitif] Polarite correcte (carte 3 cost, -5,4 % en vert). animation:400 (template.js:126).

### comparaison

**bullet-chart** : bloquant (forme fausse)

- [bloquant, forme] Le rendu n'est pas un bullet graph de Few : pour chaque métrique on voit 4 barres fines empilées côte à côte (Réalisé, puis Excellent, Moyen, Faible) au lieu de bandes qualitatives superposées en arrière-plan avec la barre de mesure fine centrée devant. Cause : tous les datasets 'bar' sont groupés par Chart.js (barPercentage 0.45 pour la mesure ligne 129, 0.85 pour les bandes ligne 168, sans grouped:false ni stack commun).
- [majeur, rendu] Les 3 paliers Excellent / Moyen / Faible ont exactement la même couleur #CBD5E1 (clair) ou #4C566A (sombre) (template.js:157, 169) : les pastilles de légende sont identiques et aucun gradient qualitatif n'est lisible, contrairement à la consigne 'plages qualitatives en niveaux de gris'.
- [mineur, rendu] Le marqueur d'objectif (scatter, y = label) tombe entre la 2e et la 3e barre du groupe et non au centre de la mesure ; avec les paliers superposés il sera centré, mais le trait de 3 px et les étiquettes de valeur ne portent que sur le Réalisé sans unité.

**bar-target-overlay** : majeur

- [majeur, rendu] Sur l'image claire, l'étiquette d'Allemagne est tronquée au bord droit : '620 k€ (−4.6%' sans parenthèse fermante. Position calculée xPos = max(actual, target) + 8 (template.js:138) sans test de débordement, le grace de 25 % ne suffit pas pour la barre la plus longue.
- [majeur, contraste] Étiquettes de statut 'warning' en orange #EF6C00 sur fond blanc (Allemagne, Espagne) : ratio calculé 3,08:1 < 4.5:1. Texte vert #2E7D32 correct, orange non. En sombre (#EBCB8B sur #2E3440) c'est conforme.
- [mineur, rendu] Légende désactivée (legend.display false, template.js:195) : rien n'explique que le trait vertical est l'objectif ni que vert/orange = écart. Trait de cible gris foncé #475569 sur barres vertes (#2E7D32 à 85 %) peu contrasté quand la cible tombe dans la barre (France, Royaume-Uni, Italie, Benelux). Format delta incohérent (+8% vs +6.7%).

**dumbbell-chart** : majeur

- [majeur, contraste] Le trait de liaison est tracé avec la couleur de la grille X (rgba(15,23,42,0.06) en clair, rgba(236,239,244,0.06) en sombre) : strokeStyle = scales.x.grid.color (template.js:77). Sur les captures il est quasi invisible, très loin du 3:1 exigé pour les contours de données. C'est pourtant l'élément qui définit un haltère.
- [mineur, contraste] Étiquettes orange (#E66101) sur fond blanc : 3,3:1 < 4.5:1. En sombre, 'Budget Initial' (#81A1C1) et 'Budget Final' (#88C0D0) sont deux bleus quasi identiques, seule la position distingue les séries.
- [mineur, cognitif] Aucun cue de direction (hausse/baisse) alors que le sous-titre parle d'écart : un budget en hausse n'est pas distingué d'une baisse. Les étiquettes se placent sous le point (31) pour éviter la collision, comportement acceptable.

**polar-area-chart** : majeur (forme fausse)

- [majeur, stat] Le sous-titre annonce 'rayon proportionnel à √V' (diagramme de Nightingale, aire proportionnelle à la valeur), mais l'échelle radiale r est linéaire (scales.r sans type ni transformation, template.js:189-208) et data brutes : rayon proportionnel à V, donc aire proportionnelle à V au carré. Sur l'image, le secteur 50 (Sud) a une aire environ 7,7 fois celle du 18 (Sud-Est) pour un rapport de valeurs de 2,8.
- [majeur, rendu] Graduations radiales tronquées et masquées : 50, 45, puis '4', '3', '3', '2' coupés/recouverts par le secteur Nord, car les ticks sont dessinés sous les secteurs (ticks.backdropColor transparent, template.js:198-206).
- [majeur, contraste] Étiquettes blanches calculées par getContrastingTextColor (seuil de luma 0.58, themes/theme-tokens.js:3509) : blanc sur #4DAC26 = 2,9:1, sur #E66101 = 3,46:1, sur #2B8CBE = 3,75:1 ; en sombre blanc sur #BF616A = 4,09:1 et #5E81AC = 4,03:1. Tous < 4.5:1.
- [mineur, forme] Les 8 secteurs compas démarrent à midi : Nord occupe 0 à 45 degrés au lieu d'être centré sur 0 degré, Sud occupe 180 à 225. Pour un compas, 'Nord' n'est pas pointé vers le haut. Aucun startAngle défini.
- [mineur, cognitif] 8 couleurs catégorielles différentes pour 8 directions (clair : magenta pour Sud, vert pomme pour Ouest) : la couleur n'apporte rien, la légende à droite oblige à un aller-retour alors que les directions pourraient être étiquetées sur le tour.

**radar-chart** : majeur

- [majeur, contraste] En thème sombre, 'Plateforme A' (#88C0D0) et 'Plateforme B' (#81A1C1) sont presque la même teinte, traits identiques et remplissages superposés : impossible de suivre un profil (capture sombre, polygones indiscernables). Pas de borderDash par défaut (borderDash = []), couleur seule en cause.
- [majeur, rendu] Étiquettes de valeur encadrées qui se chevauchent entre elles et avec les points : Sécurité (90 / 85), Ergonomie (88 / 75) et 'Scalabilité' (78 / 92) sont collées aux marqueurs. Radar très petit (rayon ~100 px dans une carte de 400 px de haut) avec grand espace vide.
- [mineur, rendu] Graduations radiales désactivées (ticks.display:false, template.js:261) : sans étiquettes de valeur, aucune échelle n'est lisible ; l'échelle commence bien à 0 (suggestedMin: 0) mais le max n'est pas fixé (suggestedMax absent) alors que les axes sont dits 'normés'. Texte orange #E66101 des étiquettes sur blanc : 3,3:1.

**slope-chart** : majeur

- [majeur, rendu] Les étiquettes de gauche (40, 25, 22, 13) se superposent aux graduations de l'axe Y : on lit '40', '25', '22' illisibles (images claire et sombre). Les ticks Y (5 à 45) et la grille horizontale subsistent alors qu'un slopegraph canonique n'a pas d'axe Y.
- [majeur, forme] Pas d'étiquetage direct du nom des séries : seules des légendes (legend.display, template.js:184-189) relient couleur et série. Un slopegraph porte le nom + valeur à gauche et à droite de chaque ligne ; ici le lecteur doit croiser couleurs et légende.
- [majeur, contraste] En sombre, 3 des 4 séries sont des bleus proches (#88C0D0, #81A1C1, #5E81AC) : Nucléaire et Gaz Naturel indiscernables. Palette catégorielle thème sombre ordonnée en bleus.
- [mineur, stat] Arrondis incohérents des étiquettes : 21.5 affiché '22', 38.2 '38', 35.8 '36', mais 7.8 '7,8' et 13.0 '13' (themes/theme-tokens.js:3480). 21.5 -> 22 déforme la pente affichée (16.7 points réels contre 16 affichés).

**stacked-bar-chart** : majeur

- [majeur, contraste] Valeurs inscrites dans les segments en blanc sur #2B8CBE (3,75:1) et #E66101 (3,46:1) en clair ; en sombre blanc sur #5E81AC (4,03:1). < 4.5:1. Origine : getContrastingTextColor (themes/theme-tokens.js:3509-3510), seuil de luma non WCAG.
- [mineur, cognitif] Le total empilé (260, 295, 330, 395) n'est visible nulle part (seulement dans le tooltip, d'après la règle d'or du fichier) alors que le titre vante la 'décomposition cumulative' ; en sombre E-commerce (#88C0D0) et Boutiques (#81A1C1) sont des bleus proches. Y=0 présent (template.js:238), pas d'unité (k€) sur l'axe.

**bar-chart-horizontal** : mineur

- [mineur, rendu] Les étiquettes sont arrondies à l'entier (37, 33, 22, 22, 21, 21 pour 37.4, 32.9, 22.3, 22.2, 21.3, 21.3) alors que les données ont une décimale. formatLabelValue (themes/theme-tokens.js:3480) retire les décimales dès /valeur/ >= 10, ce qui donne des égalités apparentes (Mexico / Le Caire, Mumbai / Pékin).
- [mineur, rendu] Aucune unité sur l'axe X (0 à 45) alors que la série est en millions d'habitants (label 'Population (Millions)' invisible car la légende est masquée pour 1 série).

**grouped-bar-chart** : mineur

- [mineur, cognitif] Les séries 2024, 2025, 2026 sont ordinales (années) mais la palette claire est catégorielle (bleu, orange, violet) ; le thème sombre utilise bien 3 bleus séquentiels. Incohérence entre thèmes, et en clair le violet/orange n'indique pas l'ordre temporel.
- [mineur, contraste] Étiquettes de 12 barres (limite de la règle N > 12) au-dessus des barres, lisibles. Y=0 présent (template.js:267). Pas d'unité sur l'axe Y ni de titre (ventes en quoi ?).

**bar-chart-vertical** : ok

- [mineur, rendu] Graduations en 'k' (2,5 k, 1,5 k) alors que les étiquettes de barres sont en pleines valeurs (2 800, 1 400) et que l'unité est 'Mds €' (PIB). Mélange de formats et unité absente de l'axe. Y=0 présent, N=7 conforme, log refusé (template.js:90).

**lollipop-chart** : ok

- [mineur, rendu] Étiquettes inconsistantes : '58' au lieu de '58,0' à côté de '88,5' (formatLabelValue, themes/theme-tokens.js:3480), axe Y 0 à 100 sans unité alors que le label du jeu est 'Popularité Index (%)'. Y=0 présent (template.js:294), tige et tête correctes.

### composition

**sunburst** : bloquant (forme fausse)

- [bloquant, forme] Chart.js dessine le 1er dataset à l'extérieur : sur la capture, la racine (Régions 40/30/20/10) est l'anneau extérieur et les sous-régions sont à l'intérieur : hiérarchie inversée, la racine doit être au centre. cutout:35% laisse en plus un trou vide.
- [bloquant, forme] Couleurs non héritées du parent : couleur = getColor(levelIdx*4+i) (template.js:119) ; les enfants d'Europe sont rose et orange alors qu'Europe est bleu.
- [bloquant, rendu] Axes cartésiens fantômes (grille 0 à 1, axe x 0 à 3) : `scales: {}` est placé avant `...defaultOpts` (l.141) qui le réécrase.
- [majeur, rendu] labels contient 4 entrées pour 12 arcs : légende et infobulle de l'anneau interne indiquent 'Europe, Amériques...' pour des sous-régions (indices 0-3) et rien pour les indices 4-7. Aucune nom de sous-région.

**pareto-chart** : majeur

- [majeur, stat] Axes non alignés : axe gauche en grace 8% (max 160 sur la capture, total=325) et axe droit 0 à 105%. Le premier point de la courbe (43,7%) flotte au milieu de la 1re barre au lieu d'être à son sommet ; la lecture 'barre vs cumul' canonique est perdue.
- [mineur, rendu] Graduation '105%' sur l'axe droit (absurde pour un cumul). Légende : l'entrée 'Cumul (%)' s'affiche comme un carré/barre et non comme une ligne. Le coefficient de Gini annoncé dans le sous-titre n'est visible que dans l'infobulle.
- [mineur, contraste] Mode sombre : barres hors seuil (context) quasi fondues dans le fond, graduations de l'axe gauche grises faibles (160, 140... peu lisibles).

**stacked-bar-100** : majeur

- [majeur, stat] Aucune normalisation : les données brutes sont tracées avec y.max=100 (template.js:219). DEFAULT_DATA somme exactement 100 par barre (75+15+10 etc.), mais toute donnée en valeurs absolues dépassera 100% ou sera tronquée.
- [majeur, cognitif] Sémantique Succès/En cours/Échec : couleurs catégorielles (bleu/orange/violet), l'Échec n'est pas rouge ni le Succès vert ; en sombre les 3 segments sont trois bleus-gris proches, difficiles à distinguer.
- [mineur, rendu] Étiquettes '75', '15' sans signe % alors que l'axe est en % ; segments de 5% (Équipe D) sans étiquette ; borderRadius sur le dernier dataset seulement.

**stacked-total-line** : majeur

- [majeur, rendu] Les étiquettes du total (datalabels de la ligne, template.js:~135) ne s'affichent pas sur la capture : seul le détail de chaque segment est étiqueté, alors que le sous-titre promet de 'supprimer le calcul mental'.
- [majeur, cognitif] La ligne Total (emphasis.focal, bleu) est de la même teinte que la série Cloud SaaS (palette[0], bleu) ; en sombre ligne et Cloud SaaS sont deux cyans proches. Légende : le Total apparaît comme une barre.
- [mineur, rendu] tension:0.25 lisse la ligne entre points trimestriels (interpolation fictive) ; en sombre, étiquettes foncées sur segments bleu moyen (#5E81AC) de contraste ~4,4:1.

**treemap** : majeur

- [majeur, contraste] Texte des feuilles toujours blanc en clair (template.js:142) : blanc sur vert clair #B8E186 = 1,48:1, sur orange clair #FDB863 = 1,72:1, sur gris = 2,85:1. En sombre, blanc sur jaune #EBCB8B (Hardware) = 1,35:1. En-têtes de groupe en noir par défaut : 2,58:1 sur violet Santé.
- [majeur, cognitif] Couleur par index de feuille (getColor(tokens, dataIndex)) : 7 teintes sans rapport avec le groupe, parent bleu mais enfants vert/magenta/orange ; la hiérarchie n'est pas portée par la couleur.
- [mineur, rendu] Unité 'Mds €' en dur dans l'infobulle (l.201), alors que le libellé de carte ne l'indique pas ; pas de part (%) du tout.

**waffle-chart** : majeur (forme fausse)

- [majeur, forme] Cellules très larges et basses (rectangles ~85x25px sur la capture) : width = chartArea.w/11, height = chartArea.h/11 (template.js:134,139), sur une zone non carrée. Un waffle est une grille de carrés ; la lecture à l'unité est faussée.
- [mineur, rendu] Un seul indicateur (68% atteint) ; aucune légende ni série à part. Remplissage de haut en bas, ligne par ligne ; état inactif très pâle (rgba 0.08) sur fond blanc, contraste < 3:1 pour les cellules vides.

**doughnut-chart** : mineur

- [mineur, rendu] Le centre affiche en dur ' M€' et 'TOTAL' (template.js:128) : unité fausse si les données ne sont pas en M€. Le total est affiché sans formatage.
- [mineur, rendu] Étiquettes de pourcentage ~10px bold dans les tranches, petites sur la capture ; légende très éloignée de l'anneau (grand vide horizontal).

**pie-chart** : mineur

- [mineur, rendu] Le formateur d'étiquettes ajoute '%' à la valeur brute (template.js:147) et l'infobulle écrit ' %' en dur (l.172) : faux si les données sont des valeurs absolues (le doughnut, lui, calcule le pourcentage depuis le total).
- [mineur, rendu] Aucune consolidation des tranches < 3% en 'Autres' (règle famille 02) ; étiquettes 10px ; légende décalée loin à droite.

### distribution

**distribution-heatmap** : bloquant

- [bloquant, contraste] En sombre (capture nord-cognitive-dark), les cellules à forte valeur sont presque blanches (97%, 90%, 98%, 99%, 87%) avec texte blanc : texte illisible, contraste ~1:1. Cause : heatmapValueLabelsPlugin fixe fillStyle='#FFFFFF' dès ratio>0.45 sans tenir compte de la luminance réelle de la cellule (template.js:~215).
- [majeur, rendu] Aucune légende de l'échelle de couleur (legend:{display:false}, template.js:~255) : impossible de relier teinte et valeur autrement que par les chiffres ; la règle matrices exige une légende continue.
- [mineur, forme] Titre/sous-titre annoncent une 'densité bivariée binnée' mais les données sont une charge serveur moyenne (%) par jour x tranche horaire (DEFAULT_DATA) : c'est une heatmap de valeurs, pas une distribution 2D. Les heures sont aussi ordonnées de bas en haut (00-04h en bas).

**box-plot** : majeur

- [majeur, stat] DEFAULT_DATA fournit des quartiles/outliers codés en dur incohérents avec la règle de Tukey 1.5×IQR : Contrôle Q1=18,Q3=31 (IQR 13, clôture haute 50.5) mais l'outlier 48 est dans la clôture ; Traitement B Q1=34,Q3=50 (clôtures 10 et 74) mais les outliers 14 et 68 sont à l'intérieur (template.js:112-117). Les triangles roses affichés sont donc de faux outliers.
- [mineur, forme] Moustaches en pointillés (setLineDash [3,3]) et outliers en triangles : conventions non canoniques, un pointillé se lit comme une incertitude.
- [mineur, rendu] Pas de titre d'axe Y ni d'unité (le dataset s'appelle 'Biomarqueur (mg/dL)' mais rien n'est affiché).

**histogramme-kde** : majeur

- [majeur, stat] La courbe KDE n'est pas continue : elle est échantillonnée uniquement aux milieux des 4 classes (binAnalysis.bins.map ... nearest grid point, template.js:~160-175) puis lissée par tension 0.35. On voit 4 points reliés, s'arrêtant au milieu de la 1re et de la 4e barre au lieu de couvrir tout le domaine. La KDE calculée sur 128 points (kdePoints) n'est pas tracée.
- [majeur, forme] Seulement 4 classes (42-75, 75-109, 109-142, 142-175) : l'échantillon est bimodal (≈42-95 puis 110-175) mais l'histogramme est aplati (22, 8, 9, 7) ; barres séparées par de larges espaces (borderRadius:3, catégories 0.8 par défaut, capture) donc pas un histogramme contigu. binCount = max(3, ceil(span/h)) avec binWidth FD.
- [mineur, rendu] Légende : l'entrée KDE affiche une pastille rectangulaire grise bordée (et non un trait), ce qui prête à confusion ; la couleur de la KDE en sombre (focal) est proche de celle des barres.

**raincloud-plot** : majeur

- [majeur, rendu] Domaine absurde : axe Y de -21 à 142 pour un 'Engagement Score (0-100)' (capture : ticks -21, 0, ..., 142) ; la demi-densité de Variante B descend à -9 et monte à ~130 (queues KDE de ±2.5h). Cause : globalMin/Max pris sur kde.min/kde.max non tronqués (template.js:~ globalMin = a.kde.min).
- [mineur, stat] Chaque nuage est normalisé par sa propre densité maximale (wRatio = density/maxDensity, template.js:~222) : la largeur n'est pas comparable entre cohortes (le nuage unimodal étroit a la même largeur que le bimodal étalé). Règle : échelles d'amplitude identiques entre séries.
- [mineur, contraste] En sombre, la pluie de points (rgba(color,0.8), r=2.5) est quasi invisible et le point médian blanc se confond avec la boîte blanche.

**strip-plot** : majeur

- [majeur, rendu] Libellés de catégories décalés d'une demi-catégorie : les labels 'Groupe A/B/C' sont sous les lignes de grille aux positions 0.5, 1.5, 2.5 (x≈160, 466, 772 px sur la capture), alors que les nuages sont centrés à x=1,2,3 (≈310, 620, 930 px). Le groupe C est étiqueté sous la frontière entre B et C. Cause : x.min=0.5 avec stepSize:1 génère des ticks à 0.5, 1.5, 2.5 (template.js:285-292).
- [mineur, rendu] Les gridlines verticales aux frontières 0.5/1.5/2.5 découpent le graphique en colonnes sans lien avec les nuages ; l'axe y 20-80 sans titre/unité.
- [mineur, contraste] En sombre, les groupes B et C sont deux bleus proches (légende) ; la couleur est redondante avec les libellés d'axe.

**violin-plot** : majeur

- [majeur, rendu] Domaine absurde : le violon du Groupe C descend à -22 alors que les données minimales sont 5 (DEFAULT_DATA:~134), l'axe Y va de -22 à 71 avec ticks irréguliers (71, 60, 40, 20, 0, -22). Le KDE est étendu à ±2.5h sans troncature (computeGaussianKDE, template.js:~76-101).
- [majeur, stat] Largeur normalisée par groupe (wRatio = density/maxDensity, template.js:221,231) : les trois violons ont la même largeur max malgré des étalements très différents (A étroit en valeurs, C large), ce qui écrase la comparaison d'amplitude exigée par la règle Violin (échelles d'amplitude identiques).
- [mineur, rendu] Ligne d'axe x très accentuée au niveau de la valeur min de l'axe (-22) : ligne de base visuelle trompeuse laissant croire à une origine à -22 ; labels 'n = 16' qui flottent au-dessus.

**beeswarm-plot** : mineur

- [mineur, rendu] Grille verticale tracée au centre de chaque essaim (lignes x=1,2,3 visibles sur la capture) qui traverse les points. template.js:313-321 (grid x active).
- [mineur, contraste] En sombre, les 3 séries sont trois bleus proches (légende : bleu clair, bleu moyen, bleu foncé) difficiles à distinguer ; la catégorie est déjà portée par l'axe x, la légende est redondante. template.js:279-282.
- [mineur, rendu] Pas de titre d'axe Y ni d'unité (30 à 90 sans libellé) alors que la description parle de scores. template.js:338-353.

**box-strip-plot** : mineur

- [mineur, rendu] Axe Y irrégulier : ticks 24, 30, 40 ... 90, 101 (min/max = floor/ceil(globalMin-pad / globalMax+pad), template.js:~min:Math.floor(globalMin - yPad)). Valeurs de bornes non rondes, espacement bizarre en bas et en haut.
- [mineur, contraste] En sombre, les points individuels (rgba(color,0.85), rayon 2.5) sont bleu-gris sur fond #2E3440 et très peu visibles ; la médiane de Traitement B est cachée par des points.
- [mineur, rendu] Ligne d'axe x colorée (accent) très marquée et labels 'n=17' au-dessus des moustaches qui chevauchent presque l'étiquette de l'outlier (Traitement A).

**density-plot** : mineur

- [mineur, stat] DEFAULT_DATA est un mélange analytique de deux gaussiennes évalué sur 0..98 (template.js:~110-125), pas une KDE d'un échantillon, alors que le titre dit 'Gaussian KDE'. La courbe est tronquée à x=98 avec densité non nulle (0.0003) : queue droite coupée.
- [mineur, stat] Bug latent multi-séries : pour chaque dataset avec rawValues, chartLabels = kde.labels est réécrit (template.js:~200) ; chaque KDE a sa propre grille (min-2.5h..max+2.5h), donc plusieurs densités se superposent sur des abscisses fausses (axe catégoriel).
- [mineur, rendu] Aucun titre d'axe (x : variable et unité ; y : densité) ; axe x catégoriel avec tension:0.35 sur une courbe de densité.

**histogramme** : mineur

- [mineur, forme] Les barres ne sont pas strictement contiguës : fines lignes blanches visibles entre les barres sur la capture. categoryPercentage:0.98 au niveau dataset (template.js:~149,~158) alors que la règle exige 1.0 ; la clé racine options.categoryPercentage (template.js:~178) est sans effet.
- [mineur, rendu] Aucun titre d'axe (x : variable en ms ; y : effectif) alors que le dataset est 'Latence Serveur (ms)'. Les ticks x sont en 10 px. Axe x catégoriel de libellés plutôt que bornes de classes numériques.
- [mineur, stat] Les bornes de classes dans computeFreedmanDiaconisBins sont min+i*w avec toFixed(1) (non arrondies) et les quartiles utilisent sorted[floor(n*p)] sans interpolation (template.js:~46-47).

### correlation

**bubble-chart** : majeur

- [majeur, rendu] Image : 12 bulles sans aucun libellé, sans titre d'axe X/Y, sans légende de taille. template.js:268-303 : scales x/y sans option title ; DEFAULT_DATA:98-109 porte un label par pays mais jamais dessiné (uniquement dans l'infobulle, l.251). La lecture statique est impossible (X = PIB/hab ? Y = espérance de vie ? taille = population ?).
- [mineur, stat] template.js:73-74 : r = rMin + (rMax-rMin)*sqrt(norm) avec rMin=4 : l'aire n'est pas proportionnelle à Z (Espagne z=48 -> r=6.9 ; proportionnel donnerait 5.1 ; le commentaire l.43 promet r = k*sqrt(Z)).
- [mineur, rendu] Image : bulle Inde (x=12.5,y=72.1) tangente à l'axe Y min=72 et dépasse le bord bas de la zone de tracé (auto-échelle ignore le rayon).

**connected-scatter-plot** : majeur

- [majeur, rendu] Image : trajectoire sans aucune indication d'ordre temporel (pas d'années, pas de flèche, début/fin non distincts) ; la courbe se croise (autour de x=7,9 / y=1,3) donc le sens est indéchiffrable. Les années (year, DEFAULT_DATA:44-53) ne sont que dans l'infobulle (l.201-205).
- [mineur, rendu] template.js:198 tension:0.15 lisse la courbe : l'interpolation invente des trajets (arrondi visible entre 7,6/2,1 et 7,1/6,8, dépassement possible) pour une trajectoire discrète.
- [mineur, rendu] Image : aucun titre d'axe ; X=chômage, Y=inflation n'apparaissent que dans l'infobulle (l.213-214). Aucune légende (1 série, legend masquée).

**density-2d-hexbin** : majeur

- [majeur, contraste] Image sombre (nord-cognitive-dark) : les nombres au centre des alvéoles denses (67, 97, 108, 142, 145, 137...) sont blancs sur fond quasi blanc, illisibles. template.js:~262 la couleur du texte dépend de logRatio>0.55 -> '#FFFFFF' sans tenir compte du thème (rampe sombre->claire).
- [majeur, cognitif] Image : ~90 alvéoles dont ~60 portent un chiffre. Règle AGENTS.md : étiquettes désactivées si N>12. Condition de dessin 'hexRadius >= 16 && bin.v >= 10' (fillText) ne tient pas compte de N.
- [majeur, rendu] Image : la légende (Densité obs/alvéole 1..145+) est posée sur les alvéoles du coin haut-droit (masque 2-3 alvéoles) ; les alvéoles du bas dépassent sous l'axe X et l'alvéole du haut sort de la zone (aucun clip ; seule garde l.'px<chartArea.left-10'). Rayon (26 px max) > pas vertical : les hexagones se chevauchent (rangs 46 px, hauteur 52 px).
- [majeur, stat] Échelle de couleur logarithmique (Math.log(v-min+1)/Math.log(max-min+1)) alors que la légende est un dégradé linéaire 1 -> 145+ (stops 0, 0.5, 1) : le milieu de la barre ne vaut pas la valeur médiane, lecture trompeuse. Les alvéoles à v~10 apparaissent presque aussi sombres que v~50.
- [mineur, stat] computeHexBins (template.js, bloc 'Calcule le pavage hexagonal') affecte un point à Math.round(row) puis Math.round(col) : pas de vrai plus-proche-centre hexagonal (algo d3-hexbin) -> bins biaisés. DEFAULT_DATA est un grillage gaussien synthétique pré-binné, jamais passé par cette fonction ; commentaire annonce N=1800 alors que le badge affiche N≈4340.

**joint-scatter-marginals** : majeur

- [majeur, rendu] Image : les deux densités marginales apparaissent enfermées dans un rectangle (cadre) avec arêtes verticales/horizontales aux bords ; template.js afterDraw clampe (Math.max/min chartArea) les x/y de la grille KDE qui dépasse l'axe (min = xmin-1.2h) -> segments plaqués sur le bord. La marginale Y est tronquée à y<20 et le sommet est coupé.
- [majeur, rendu] Image : l'ellipse de covariance 95% déborde largement : à gauche de l'axe Y (x<0), au-dessus de 100, sur la marginale Y et sous 20 à droite ; fond teinté sur zones hors domaine. computeCovarianceEllipse n'est pas clippée au chartArea ni inclus dans les bornes d'échelle.
- [mineur, rendu] Image : badge 'r = -0.933 • R² = 0.87' chevauche la marginale X dans le coin haut-droit ; label '▲ DENSITÉ MARGINALE Y' pivoté à 90° (flèche pointant vers la gauche) et collé à l'ellipse ; marginales de 38 px seulement, sans échelle de densité ; légende OLS affichée avec un rond au lieu d'un trait pointillé.
- [mineur, stat] Vérifié dans le code : KDE gaussien avec h=1.06*sigma*n^-0.2 (Silverman), Pearson, R², ellipse chi2(2 ddl)=5.991 avec paramétrage x=mx+k*sx*cos t, y=my+k*sy*(rho cos t + sqrt(1-rho^2) sin t) : calculs corrects. R² affiché 0.87 = 0.933^2 cohérent.

**matrix-heatmap** : majeur

- [majeur, rendu] Image (clair et sombre) : les libellés de l'axe X apparaissent DANS la dernière rangée de cellules ('Actions EU', 'Obligations', 'Or', 'Pétrole', 'Immobilier' tronqués, 'Actions US' invisible sous la cellule foncée) et la rangée du haut est coupée net au bord supérieur. Les cellules sont dimensionnées à chartArea/count - 3 (template.js width/height) mais l'échelle catégorielle n'est pas en offset.
- [majeur, rendu] Image : aucune valeur numérique dans les cellules alors que le sous-titre promet 'étiquetage direct' ; aucune légende de couleur (échelle divergente -1..+1) ; r n'est visible qu'en infobulle (template.js:~250, legend:{display:false}).
- [mineur, forme] Image : la diagonale (r=1, bleu foncé) va du bas-gauche vers le haut-droit ; la convention des matrices de corrélation est haut-gauche vers bas-droite. Les labels y sont dans l'ordre Actions US -> Immobilier de bas en haut (scale y non reversed).
- [mineur, rendu] getDivergentCorrelationColor (template.js:~55-70) module seulement l'alpha sur le fond de la carte : sur fond sombre (nord-cognitive-dark) les petites valeurs de r se confondent avec le fond (cellule 'Or' x 'Immobilier' r=0.08 quasi invisible) ; l'échelle n'est pas perceptuellement divergente.

**scatter-regression** : majeur

- [majeur, rendu] Image : la bande IC 95% est invisible (aucune zone teintée autour de la droite) alors que le titre promet 'IC 95%'. Dans la légende, l'entrée IC est filtrée (filter Inférieur/Supérieur) donc rien n'indique la bande. Données quasi parfaites (r=0.999, se petit).
- [majeur, rendu] Image : la droite de régression n'est pas droite : coudes visibles (autour de x=1.6, 3.2, 5.8) ; computeConfidenceBand arrondit x et y à 0.1 (Math.round(x*10)/10, Math.round(yHat*10)/10) sur 30 points. La droite et les points sont de la même teinte bleue (regColor = emphasis.focal = couleur palette 0 en colorbrewer et nord) : la droite se confond avec les points.
- [majeur, stat] template.js computeConfidenceBand : const tCrit = 1.96 ('Approximation asymptotique normale') pour n=15 (ddl=13, t=2.160) : bande trop étroite d'environ 10% ; le titre annonce 'IC 95%'.
- [mineur, rendu] Image : titres d'axe génériques 'Variable X (Investissement R&D)', 'Variable Y (Revenu)' sans unité (le label série précise M€) ; légende en boîtes pleines pour la droite.

**scatter-plot** : mineur

- [mineur, rendu] Image : aucun titre d'axe ni unité (R&D en % du CA vs croissance en % selon le commentaire de DEFAULT_DATA, template.js:~100) ; le titre de la légende 'Entreprises Tech (N=16)' ne dit pas ce qui est mesuré.
- [mineur, rendu] Image : dans la légende, 'Tendance (R² = 0.99)' est représentée par un rond au lieu d'un trait pointillé (usePointStyle hérité des défauts).
- [mineur, stat] Tendance calculée par MCO (n*Sxy - SxSy)/(n*Sxx - Sx^2) correcte ; garde-fou n>=10 présent. Espace blanc au-dessus de la légende (~40 px) dans la carte.

### evolution

**multi-line-chart** : bloquant

- [bloquant, contraste] Thème sombre : les libellés de légende sont noirs sur fond #2E3440 (capture sombre). generateLabels (template.js:219-230) ne renvoie pas fontColor, donc color:tokens.textPrimary est ignoré.
- [mineur, rendu] Sous-titre vante l'étiquetage direct mais il n'y a que la légende ; en sombre Legacy (bleu foncé) et ses points sont à peine visibles.

**stacked-area-chart** : bloquant

- [bloquant, contraste] Thème sombre : libellés de légende noirs sur fond sombre (capture sombre) : generateLabels sans fontColor (template.js:207-219).
- [majeur, rendu] Couches non propres en clair : la couche du bas apparaît gris-ardoise (mélange bleu+orange+violet) au lieu du bleu de la légende ; fill:true (template.js:109) remplit chaque série jusqu'à l'origine avec alpha 0.65, donc chevauchement.
- [mineur, cognitif] Trois couleurs catégorielles OK (≤5) mais ordre de légende inverse de l'empilement.

**streamgraph** : bloquant (forme fausse)

- [bloquant, forme] Le rendu est un aire empilée classique ancrée à 0 (capture : base plate à 0, axe Y 0-350). Aucune baseline symétrique ni ondulante, contrairement au sous-titre 'silhouette symétrique autour d'une ligne médiane'. Code : type line, y.stacked:true, aucun offset (template.js:147-190).
- [majeur, rendu] Même chevauchement d'alpha que stacked-area : fill:true (template.js:132), couche du bas bleu vif, autres couches fondues en gris pâle (capture claire).
- [mineur, cognitif] Données incohérentes avec 'macro-tendances' : séries Cloud et Blockchain décroissantes sans signalement.

**candlestick-volume** : majeur

- [majeur, rendu] Sous-titre annonce des panneaux empilés ; le code superpose volume et prix dans un seul chartArea (yVolume max=volMax*3.5, template.js:~270). Sur la capture, la bougie du 05 Jan et celles du 03-04 Jan chevauchent les barres de volume.
- [majeur, rendu] Le tracé n'occupe qu'environ 200 px sur ~480 px de carte : grand vide sous l'axe X.
- [mineur, rendu] Axe volume : un seul repère '20k' visible (callback template.js ligne ticks filtre val<=volMax) ; ticks prix irréguliers (144,150,155,160...).
- [mineur, contraste] Hausse vert / baisse rouge (semantic.positive/negative) sans second encodage : inaccessible en daltonisme, y compris dans le thème 'accessible'.

**dual-axis-controlled** : majeur

- [majeur, rendu] Étiquettes de données en collision : '15' sur '560' en octobre, '14' sur '490' en avril, '5.2' contre l'axe (capture claire).
- [majeur, cognitif] Thème sombre : les deux séries sont deux bleus proches (cyan #88C0D0 et acier) ; l'appariement couleur-axe, base du gabarit, devient illisible.
- [mineur, rendu] Axe droit 0..1 024 en graduations de 200 vs axe gauche 0..29 en 5 : les graduations de droite ne tombent pas sur la grille (seule la gauche est tracée). Max 29 et 1024 arbitraires (computeZeroAlignedBounds ×1,15).
- [mineur, rendu] Ligne de base y=0 très marquée en sombre (trait cyan vif) alors que les grilles sont discrètes.

**candlestick-ohlc** : mineur

- [mineur, rendu] Sous-titre annonce 'vert/rouge' mais le rendu est sarcelle/rose (valence via getValenceColor, template.js:62-63). Aucune légende ne dit quelle couleur = hausse.
- [mineur, rendu] Ticks X irrégulières (2, 6, 8, 10, 14 janv.) : échelle timeseries compresse les week-ends, libellés non alignés sur les bougies.
- [mineur, contraste] Mèches et bordures rose clair sur fond blanc (capture claire) : contour de données probablement < 3:1.

**price-indicator-overlays** : mineur

- [mineur, stat] computeBollingerBands (template.js:60-77) calcule la bande avec fenêtre partielle dès J1 (σ=0 à J1, SMA sur 1 à 9 points) : bande artificiellement serrée sur J1-J9.
- [mineur, rendu] Légende 'Bollinger Supérieure (+2σ)' alors que la zone remplie représente la bande entière ; remplissage clair presque invisible (alpha 0.10, template.js:159).
- [mineur, rendu] Encart annonce SMA 20/50 mais le code trace SMA 10 (template.js:119).

**sparkline** : mineur

- [mineur, rendu] Rendu en ~1000x400 px : ce n'est plus une micro-courbe ; sans axe, min, max ni valeur finale, aucune valeur lisible hors tooltip (capture).

**area-chart** : ok

- [mineur, rendu] Un marqueur sur chacun des 12 points alourdit l'aire (capture claire) alors que la lecture porte sur la forme globale.

**line-chart** : ok

- [mineur, rendu] Axe Y démarre à 120 (capture) : acceptable pour un encodage de position, mais aucune indication de troncature.

### flux

**chord-diagram** : bloquant (forme fausse)

- [bloquant, forme] Le rendu est un graphique radar (losange a 4 axes, polygones remplis, echelle radiale 0-30) : aucun arc sur un cercle, aucun ruban. Code : `type: 'radar'` (template.js:~125), `scales.r`, donnees = lignes d'une matrice de flux.
- [majeur, rendu] Echelle radiale '20' recouverte par le trace orange, 4 polygones superposes avec 4 'Flux Emis' dans la legende, graphe petit (~350px) dans une carte large avec grand espace vide a gauche/droite.
- [majeur, cognitif] Theme sombre : les 4 series sont quasi la meme teinte bleu-gris (legende : 3 bleus + 1 vert pale), indistinguables ; polygones alpha 0.18 sur fond sombre.

**alluvial-diagram** : majeur

- [majeur, rendu] Sur les deux captures, les noeuds intermediaires sont colores par une seule valence : 'Plan Pro' est rouge (barre rouge a x~607) alors que ses flux entrants et sortants sont majoritairement positifs. Le rouge signale a tort une perte (polarite).
- [majeur, contraste] Libelles de noeuds en noir (police par defaut du plugin sankey, aucune couleur definie dans le dataset) : en theme sombre, 'Acquisition Organique', 'Plan Gratuit (Actif)', 'Desabonne (Churn)' sont du noir sur ruban sombre/fond #2E3440, contraste nettement < 4.5:1.
- [mineur, forme] Le rendu est un sankey a 3 colonnes (type:'sankey', meme code que sankey-diagram, meme visuel). Un alluvial canonique garde les memes categories (strata) a chaque axe temporel, avec des flux entre les memes dimensions. Ici 'Plan Pro' (col. 2) et 'Plan Pro (Upgrade)'/'Plan Pro (Renouvele)' (col. 3) sont des noeuds distincts.
- [mineur, rendu] Les flux 'neutral' prennent une couleur pseudo-aleatoire (hash du nom du noeud) : degrade rose vers vert sur Acquisition Organique vers Plan Gratuit (capture claire), sans signification.

**funnel-chart** : majeur

- [majeur, cognitif] La regle famille 06 impose l'affichage systematique des taux de retention d'etape a etape. Les etiquettes visibles montrent seulement '10 k', '3 200', '1 450', '480', '390' ; le formatter qui produit '(x%)' (template.js:~137-146) n'a pas d'effet a l'ecran et calcule de toute facon le pct vs etape 1, pas vs etape precedente. Retention seulement en infobulle.
- [mineur, forme] Barres horizontales alignees a gauche sur axe 0-12000 : c'est un bar chart horizontal trie ; pas de centrage symetrique ni de connecteurs entre etapes (forme d'entonnoir absente). Acceptable en variante barre, mais peu distinctif.
- [mineur, rendu] Rampe sequentielle decorative sans sens : en sombre, les etapes 4 et 5 sont presque blanches et attirent l'oeil sur les pires etapes. Etape 5 (Renouvellements Annuels) n'est pas une etape du meme entonnoir (apres souscription).

**sankey-diagram** : majeur

- [majeur, rendu] Les noeuds intermediaires 'Electricite Reseau' et 'Chaleur Industrielle' sont rouges (capture claire et sombre) alors qu'ils representent des transformations, pas des pertes : lecture trompeuse (la perte est deja portee par les flux 'Pertes').
- [majeur, contraste] Libelles de noeuds noirs en sombre : 'Pertes Reseau & Transport', 'Pertes Thermiques' en noir sur ruban rouge sombre et fond #2E3440 (capture sombre), contraste insuffisant.
- [mineur, rendu] Degrades rose a vert sur Nucleaire vers Electricite et orange a bleu sur Gaz vers Chaleur : couleur issue d'un hash de nom (template.js:~100-108), non semantique ; conservation des flux OK (100=45+38+17 ; 40=28+12).

**waterfall-cumulative-line** : majeur

- [majeur, rendu] Les etiquettes des pertes affichent '45', '60', '110' sans signe ni unite (le formatter '-45 k€' a template.js:~104-108 n'a pas d'effet), alors que les gains affichent '180','75' ; seule la couleur distingue gain et perte. De plus la courbe et ses points chevauchent les etiquettes '500', '180', '75', '540'.
- [majeur, stat] Donnees incoherentes : 'CA Brut Initial' 500 k€ devient 'EBITDA Net' 540 k€ apres 360 k€ de pertes nettes... soit un EBITDA superieur au CA brut. Le calcul des soldes est juste (500+180+75-45-60-110=540, computeWaterfallBalances) mais l'exemple est faux metier.
- [mineur, rendu] Courbe lissee (tension 0.15, ~l.118) qui deborde entre les points ; la ligne cumulee est redondante avec le sommet des barres. Legende : 'Variation Etape' n'affiche que le bleu alors que les barres sont vertes/rouges/bleues.
- [mineur, rendu] Libelles X inclines a 25 degres alors que l'espace horizontal suffit (capture claire).

**gantt-progress** : mineur

- [mineur, rendu] Capture claire et sombre : le libelle '100%' de la tache 2 (x~630) est traverse par la ligne pointillee 'Aujourd'hui' (S6.5) car place a end+8px.
- [mineur, rendu] Libelle 'Aujourd'hui (S6.5)' ecrit en dur (template.js:~139) alors que todayWeek est un parametre ; categories 0/1/2 colorees bleu/orange/violet sans legende.
- [mineur, contraste] Theme sombre : graduations 'S0..S15' gris moyen sur #2E3440 et grille tres faible ; lecture limite (non mesure).

**waterfall-chart** : mineur

- [mineur, rendu] Calcul correct (100+35+20-30-15=110, bornes coherentes, totaux ancres a 0, Y=0 beginAtZero ligne ~118). Mais les etiquettes affichees sont '100','35','20','-30','-15','110' : le formatter prevu ('+35', '100 M€') n'est pas applique (template.js:~150-165) et l'axe Y n'a ni titre ni unite.
- [mineur, forme] Pas de connecteurs horizontaux entre le sommet d'une barre et la base suivante (canoniques en waterfall) ; l'utilisateur doit fournir des plages deja cumulees sans validation de continuite.

### hierarchie-geo

**dendrogram** : bloquant (forme fausse)

- [bloquant, forme] Capture : les branches ne sont pas des connecteurs orthogonaux en U ; des diagonales relient (0,2)->(14,1.5) et (18,3)... (Abonnés Premium / Acheteurs Fidèles ; Grands Comptes / PME). Les datasets sont des polylignes brisées dont l'ordre des points crée des traversées (DEFAULT_DATA l.67-70 : {x:0,y:2} suivi de {x:14,y:1.5}; l.77-78 idem). Le arbre ne se lit pas comme un dendrogramme.
- [majeur, stat] Données incohérentes : B2C fusion Abonnés Premium/Acheteurs à 18 puis intégrée avec le groupe Visiteurs/Chasseurs à 32 ; le nœud racine B2C à y=2.25 est dessiné à y=1.5 et y=3 (l.68-69), les barres horizontales ne se terminent pas sur les milieux de leurs enfants. Hauteurs 22 et 48 pour B2B incohérentes avec la racine à 65.
- [majeur, rendu] Légende liste 4 datasets techniques (Cluster B2C, Cluster B2B, Jonction, Seuil) : pastilles grises identiques B2C/Jonction illisibles ; marqueurs ronds (pointRadius 3, l.139) sur chaque sommet de segment qui alourdissent.
- [mineur, contraste] Mode sombre : branches 'context' gris (#4c566a) sur fond #2e3440, ratio visuel très faible ; clair : gris #CBD5E1 sur blanc (l.142-144 via getEmphasisStyle context).

**marimekko-chart** : bloquant (forme fausse)

- [bloquant, forme] Capture : 9 points ronds sur axes cartésiens 0,2..0,9 / 0..0,9, aucun rectangle. Le code calcule w et h (normalizeMekkoData l.132-147) mais type:'scatter' (l.257) avec pointRadius:8 (l.241-244) ne les dessine jamais ; pas de plugin de rectangles. Ce n'est pas un marimekko (largeurs ET hauteurs variables absentes).
- [majeur, cognitif] Axes numériques 0,2..0,9 non pourcentés, centres de colonnes (0,225 ; 0,625 ; 0,9) sans libellé de segment ; aucun libellé de colonne (SUV 45 %...). Légende Électrique/Hybride/Thermique mais points 'context' quasi blancs (hybride/thermique #EEF0F5 sur blanc).
- [majeur, contraste] Les rôles 'context' remplacent la couleur de série (l.202-206) : Hybride et Thermique deviennent gris très clair quasi invisibles en clair (#E8ECF2) et gris foncé sur fond sombre en dark ; la légende n'identifie plus les catégories.
- [mineur, stat] DEFAULT_DATA : sub-shares par colonne somment à 100 mais colWeight en 0.45/0.35/0.20 : OK ; en revanche A/A-1 et tri décroissant (annoncé l.46) non respecté : Électrique en tête alors que Hybride > Électrique dans SUV.

**cartogram-tilegram** : bloquant

- [bloquant, stat] Carte de France retournée : axe y non inversé (reverse:false, template.js:~315) ; HDF (y=1) est en bas, Corse (y=6) en haut, PAC au-dessus de ARA, NOR sous BFC... Capture : Hauts-de-France au sud de l'IDF, Corse en haut à droite. La préservation des voisinages cardinaux annoncée (l.8) est fausse (Nord/Sud inversés).
- [bloquant, contraste] tileLabelsPlugin dessine toujours '#FFFFFF' (l.~75) : texte blanc sur tuiles claires illisible (CVL quasi invisible en clair ; NOR/BFC/NAQ en clair ratio ~1,3-2:1 ; ARA/IDF teal clair en sombre ~2:1), < 4,5:1.
- [majeur, cognitif] Le rôle écrase l'encodage de valeur : IDF (98) et ARA (88) ont la même teinte focal, COR (58, anomalie) en magenta : la luminance ne code plus la valeur. Aucune légende de l'échelle (valeur 58 à 98) ; couleur des tuiles non interprétable.
- [mineur, rendu] Beaucoup d'espace vide ; grille irrégulière (Corse isolée en (3,6)), valeur non affichée dans les tuiles.

**arc-diagram** : majeur

- [majeur, rendu] Capture : les deux arcs en pointillés rouges (Validation vers Alerting, rayon 2,5 pas) sont coupés net en haut du canvas (arcs tronqués à y~222px). Le plugin trace des arcs en pixels (ctx.arc, template.js:168) sans lien avec l'échelle y (min -0.5, max 6, l.371-372) : le rayon dépasse la chartArea.
- [mineur, rendu] Grille horizontale sans signification (y.grid.color l.373-377) et axe y masqué : 7 lignes de repère parasites derrière les arcs.
- [mineur, cognitif] Couleur des arcs = palette[sourceIdx] (l.145-146) : la couleur encode le nœud source sans légende, pas une grandeur ; épaisseur = value*0.6 plafonnée à 5 sans légende. Nœuds 'context' réduits à r=6 (l.227) quasi invisibles et arcs 'context' sans rôle non distingués.
- [mineur, contraste] Sombre : nœuds context (gris-bleu #3b4252 sur #2e3440) et arcs 'Dédoublonnage/Enrichissement' bleu terne à faible contraste avec le fond.

**node-link-network** : majeur

- [majeur, rendu] Capture : 9 nœuds sans aucun libellé (ni nom de service) ni légende ; seul le tooltip nomme les nœuds (title callback l.301-306). Le réseau est illisible hors survol.
- [majeur, rendu] Axes cartésiens x/y 10..90 et grilles visibles (l.317-349) : coordonnées de mise en page présentées comme des mesures, artefacts pour un graphe.
- [majeur, cognitif] La couleur par communauté (getColor(cluster) l.198) est écrasée par getEmphasisStyle(role) (l.203-207) : tous les nœuds context sont gris pâle quasi invisibles (capture clair : disques #E9EDF3 sur blanc), on perd le clustering annoncé. Taille r fournie en dur sans lien avec 'connections'.
- [mineur, contraste] Sombre : nœuds context #3b4252 sur #2e3440 et arêtes rgba(216,222,233,0.28) faibles (l.134).
- [mineur, rendu] Layout manuel (coordonnées fixes), non force-directed contrairement à la description ; arêtes 1-2 et 3-5 traversent visuellement d'autres nœuds (ligne Auth-User horizontale).

**bubble-map** : majeur

- [majeur, rendu] Capture : 12 bulles sans aucun nom de ville ; le bouton Labels est actif mais aucune étiquette. Dans la branche ChartGeo (l.127-201) aucune étiquette n'est tracée ; showDataLabels (l.292) est une variable globale non définie dans template.js (fournie par preview.html:338) utilisée seulement dans le fallback : ReferenceError hors preview.
- [majeur, rendu] Londres et Paris, Shanghai et Tokyo se recouvrent presque totalement (capture) ; pas de tri décroissant des rayons ni transparence suffisante sur les focal (rôle focal = couleur pleine l.143).
- [mineur, cognitif] Sous-titre annonce r ∝ √V mais scales.size range [5,26] (l.195-198) donne un rayon 5 px pour la valeur 0 (légende '0' = petit disque) : l'aire n'est pas proportionnelle à la valeur.
- [mineur, rendu] Fond de carte très pâle (#F8FAFC sur carte blanche) ; Antarctique et mer vide occupent le bas, légende bulles flottant dans le Pacifique.
- [mineur, cognitif] Données d'exemple 'Investissements en Mds $' : les rôles focal/context mélangent mégapoles sans règle de polarité ; neutre catégoriel non précisé.

**choropleth-map** : majeur

- [majeur, cognitif] Les données par défaut sont des PIB absolus (DEFAULT_WORLD_VALUES l.52+, titre 'PIB Mondial (Mds $)') alors que le sous-titre et l'encart 'Quand ne pas l'utiliser' disent que le type exige des ratios normalisés et prohibe les valeurs absolues brutes : le template viole son propre contrat (biais de surface).
- [majeur, rendu] Capture : seuls les USA (25 400) et la Chine apparaissent colorés, tous les autres pays tombent dans la première classe quasi blanche : échelle linéaire dominée par 2 valeurs, carte lisible comme vide. Le fond de la classe 0 (#EEF3FB) est presque identique au fond de page blanc.
- [majeur, stat] Pays sans valeur reçoivent une valeur fabriquée : Math.floor(Math.abs(Math.sin(name.length*13.37))*250+20) (l.~103) ; données inventées présentées comme mesures dans le tooltip.
- [mineur, rendu] Antarctique et grand océan vide ; légende de couleur discrète collée en bas à droite ; sombre : classe basse #3b4252 presque confondue avec le fond carte #2e3440.
- [mineur, cognitif] Rôles focal/anomaly (bordure) ne sont appliqués que dans le fallback (l.~245), pas dans la branche choropleth ChartGeo.

### tableaux

**table-financial-variance** : majeur

- [majeur, rendu] La dernière colonne 'Structure Variance IBCS' (la seule qui contient les barres divergentes) est tronquée à droite : en-tête coupé 'STRUCTURE VARIANC', barres collées au bord (overflow-x:auto, capture 1200 px). Les barres sont l'élément visuel central du template.
- [majeur, rendu] Les montants se coupent sur deux lignes ('48 500' puis 'k€', '(9 700' puis 'k€)') dans Réalisé N, Budget N, N-1 : td sans nowrap (template.js:264-272). Lecture comptable dégradée, lignes doublées en hauteur.
- [majeur, contraste] En thème Nord sombre, les écarts négatifs sont en status.danger #BF616A sur surface #3B4252 : ratio 2.46:1 (calcul WCAG), visible sur les colonnes Écart absolu et % (capture sombre). Règle texte >= 4.5:1 violée.
- [mineur, cognitif] metricType est lu par generateIBCSVarianceBarSVG (ligne 75) mais jamais utilisé : la polarité n'est correcte que parce que les coûts sont stockés en négatif (isFavorable = deltaPct >= 0, ligne ~83). Une donnée de coût saisie en positif donnerait rouge/vert inversés. Échelle fixe +/-25 % : barres de 17 à 28 px seulement.

**table-heatmap-matrix** : majeur

- [majeur, contraste] Le texte passe en blanc dès luminance < 0.38 (template.js:342-343). Le point d'équilibre WCAG est environ 0.18 : entre 0.18 et 0.38 le texte blanc a un ratio de 1.9 à 4.4. Calcul sur DEFAULT_DATA : colorbrewer 6/96 cellules < 4.5:1 (pire 2.52), nord-cognitive-dark 26/96 (pire 1.92), viridis 11/96, tufte 11/96. Visible en clair sur 480, 520 (blanc sur bleu moyen) et en sombre sur les cellules moyennes.
- [mineur, rendu] Thème Nord : la rampe commence à #3B4252 (couleur de la surface) et finit à #ECEFF4 : les faibles valeurs se fondent dans le fond de carte, et le maximum 640 apparaît en cellule blanche (capture sombre), plus un point focal artificiel qu'une échelle continue lisible.

**table-kpi-scorecard** : majeur

- [majeur, cognitif] Dans generateSparklineSVG, les points min et max sont codés en dur rouge #C62828 / vert #2E7D32 quelle que soit la polarité (template.js:203-204). Pour CAC, Churn, Latence (LOWER_IS_BETTER) le max (mauvais) est vert et le min (bon) est rouge : sur la capture, Latence débute par un point vert sur la valeur la plus haute (145 ms) et CAC/Churn ont un point rouge sur leur creux.
- [mineur, rendu] '14,25 M €' et '13,80 M €' se coupent sur deux lignes dans Réalisé et Cible (capture) : formatNumber ajoute ' M' et l'unité ' €' avec espace sécable.
- [mineur, contraste] Statut 'Sous surveillance' #D97706 sur badge ambré = 2.79:1 (clair) ; 'Alerte' #E57373 sur badge rouge sombre = 3.17:1 (sombre). Statuts hors tokens thème (template.js:377-390).
- [mineur, rendu] Données d'exemple incohérentes : 'Latence API Médiane (p95)' mélange médiane et p95 ; NDR +3,82 % au-dessus de la cible est 'Conforme' alors que ARR +3,26 % est 'Dépassé' (statuts saisis à la main, non dérivés du delta).

**table-bar-in-cell** : mineur

- [mineur, contraste] Les valeurs 'Atteinte' sous objectif (92%, 86%, 81%) sont en tokens.status.warning (#EF6C00, ratio 3.08:1 sur blanc) : ligne 255-257 de template.js. Sous le seuil 4.5:1 en thème clair. Statut vert/orange porté par la seule couleur.
- [mineur, rendu] Espace vide d'environ 130 px sous le tableau dans la carte (capture clair et sombre, entre la dernière ligne et le bas de la carte).

**table-hierarchical-tree** : mineur

- [mineur, contraste] Statut 'Sous tension' et taux d'exécution orange : #D97706 sur fond teinté clair = 2.79:1 (badge), 3.19:1 sur blanc (template.js:339). En sombre, rouge #E57373 sur badge teinté = 3.17:1 (ligne 335). Couleurs codées en dur, indépendantes du thème choisi.
- [mineur, cognitif] Seuils de statut fixes (>=95 % tension, >100 % dépassement, template.js ~327-340) sans notion de période : un budget à 95 % consommé est 'Sous tension' quel que soit le moment de l'année ; et 'Maîtrisé' vert pour 86.7 % sans traiter la sous-consommation. Polarité TARGET_BASED non explicitée. Cohérence des agrégats vérifiée OK (effectifs 161, budget 19.5 M, dépenses 18.65 M, sous-totaux = somme des enfants).

**table-ranking-leaderboard** : mineur

- [mineur, rendu] Le tableau déborde à droite : en-tête 'ACTIVITÉ 6M' coupé et sparkbars collées au bord (overflow-x:auto, capture). Les noms d'équipe passent sur 2 lignes dans la colonne Équipe.
- [mineur, cognitif] Le sous-titre annonce une 'jauge relative au leader' alors que la jauge est score/100 (template.js:311 generateScoreBarSVG(row.score, 100, ...)) : le leader à 98.4 n'occupe pas 100 %. Pas d'erreur Y=0 : barres et sparkbars partent de zéro (template.js:78-86). Delta de rang cohérent avec prevRank (vérifié).

