# Spec : Galerie

Statut : livrée. Date : 2026-11-04.

## Objectif

Une personne ouvre `index.html` dans son navigateur, voit les 73 templates dessinés avec leurs données
d'exemple, change de thème en un clic, et ouvre un template en grand pour savoir quand l'utiliser.

## Comportement attendu

- `index.html` s'ouvre par double-clic (`file://`), sans serveur. Elle charge Chart.js et ses plugins (versions épinglées) et les polices depuis Internet : sans réseau, les graphiques ne se dessinent pas. `catalog-bundle.js` (généré par `npm run build`) embarque tous les templates, donc aucune requête locale n'est bloquée.
- Au chargement : titre « Kit-Charts : des graphiques clairs, prêts à l'emploi », 74 cartes (les 73 templates du registre et le démonstrateur d'infobulles), 8 cartes de thème, 8 pastilles de thème, thème actif `colorbrewer-accessible`.
- Les sections sont : Thèmes, Indicateurs (famille `00`), Graphiques (familles `01` à `08`), Tableaux (`09`), Infobulles.
- Les cartes se dessinent à leur arrivée à l'écran (chargement paresseux, 600 px d'avance). Une carte en échec affiche « Aperçu indisponible ».
- Clic sur une pastille : tous les graphiques sont redessinés dans ce thème, le fond de la page change, le nom du thème apparaît dans la barre d'outils, et le choix est gardé (`localStorage`, clé `kitcharts_theme`) pour la visite suivante.
- Le bouton lune bascule seulement entre `nord-cognitive-dark` (icône soleil) et `colorbrewer-accessible` (icône lune), quel que soit le thème choisi avant.
- Le bouton d'étiquettes (`aria-pressed`) active ou coupe les étiquettes de valeur sur tous les graphiques.
- Chaque lien « Voir en grand » porte le thème et l'état des étiquettes dans son adresse (`?theme=...&labels=...`) et s'ouvre dans un nouvel onglet. La page `preview.html` affiche le graphique, 8 pastilles, un lien « ← kit-charts » vers la galerie, et deux blocs « Quand l'utiliser » et « Quand NE PAS l'utiliser ».
- Le démonstrateur d'infobulles ouvre `template/tooltip/preview.html` : au survol d'un point, une infobulle apparaît sans masquer les points voisins. Le bouton « Données Aléatoires » regénère les données.
- Cas d'erreur : un thème inconnu dans l'adresse (`?theme=`) est ignoré, le thème enregistré puis le défaut sont utilisés.
- Règles cognitives touchées : rendu instantané 0 ms, infobulle anti-occlusion, thèmes accessibles.

## Hors périmètre

- Usage hors ligne.
- Tri, recherche ou filtre de cartes (la galerie n'en a pas).
- La liste des cartes (`CATALOG`, écrite à la main dans `index.html`) n'est pas générée depuis le registre.

## Critères d'acceptation

Les gestes se font avec `agent-browser`, sur `file://<dépôt>/index.html`.

- [x] Test : les versions CDN de `index.html` correspondent à celles du compilateur (`vendor-pins.js`) → `test/run-integration-tests.js`, Bloc 11.3
- [ ] Navigateur : `open` la page, `snapshot`. Attendu : 8 pastilles de thème, le nom « ColorBrewer Accessible » dans la barre d'outils, 74 cartes, console sans erreur (pas de test aujourd'hui, constaté à la main)
- [ ] Navigateur : `scrollintoview` sur la carte `bar-chart-vertical`, attendre 2 s. Attendu : un graphique en barres est dessiné, plus de texte « Initialisation... » (pas de test aujourd'hui, constaté à la main)
- [ ] Navigateur : cliquer la pastille « Thème Nord Cognitive Dark ». Attendu : fond de page sombre (`rgb(46, 52, 64)`), nom « Nord Cognitive Dark », icône soleil, graphiques redessinés (pas de test aujourd'hui, constaté à la main)
- [ ] Navigateur : choisir un thème, recharger la page. Attendu : le même thème est actif (pas de test aujourd'hui, constaté à la main)
- [ ] Navigateur : cliquer le bouton d'étiquettes. Attendu : `aria-pressed` passe à `false` et les liens « Voir en grand » finissent par `labels=false` (pas de test aujourd'hui, constaté à la main)
- [ ] Navigateur : ouvrir le lien « Voir en grand » de `bar-chart-vertical`. Attendu : titre « Barres verticales », graphique dessiné, thème repris de la galerie, deux blocs « Quand l'utiliser » et « Quand NE PAS l'utiliser » (pas de test aujourd'hui, constaté à la main)
- [ ] Navigateur : ouvrir la carte Infobulles, survoler un point du graphique. Attendu : une infobulle avec la valeur, sans cacher les points voisins (pas de test aujourd'hui, le survol n'a pas été rejoué)
- [ ] Chaque template du registre a une carte dans `CATALOG`, et aucune carte n'est orpheline (pas de test aujourd'hui, vérifié une fois à la main : 73 + tooltip)
- [ ] `catalog-bundle.js` est à jour avec les `template.js` (pas de test aujourd'hui)
- [x] `npm test` passe (rappel : aucun de ses tests n'ouvre la galerie)
