# 📊 Guide Méthodologique & Cognitif : KPI Cards & Synthèses Décisionnelles

Bienvenue dans le guide de référence pour la conception scientifique des **KPI Cards** (cartes d'indicateurs clés de performance) dans **kit-charts**.

---

## 1. Fondements Théoriques & Psychophysiques

### 1.1 Théorie de la Charge Cognitive (John Sweller)
Dans un tableau de bord analytique, la mémoire de travail humaine ne peut traiter simultanément qu'un nombre restreint d'unités d'information ($4 \pm 1$ blocs selon Cowan, 2001).
- **Charge Intrinsèque** : Doit être isolée (1 concept métier par carte).
- **Charge Extrinsèque** : Réduite à 0 (aucun élément décoratif ou 3D non porteur de sens).
- **Charge Essentielle** : Maximisée par un encodage explicite des écarts et des seuils.

### 1.2 Hiérarchie de Cleveland & McGill (1984)
- **Position & Longueur (Rang 1)** : Privilégiées pour l'évaluation des écarts et des progressions (Micro-Bullets, réglettes de seuil).
- **Angle & Surface (Rangs 4-5)** : Proscrits pour les métriques critiques (remplacement des speedometers par des micro-bullets).
- **Teinte (Rang 7)** : Réservée au statut qualitatif et à la valence positive/négative.

### 1.3 Redondance Visuelle Multicanale (WCAG 2.1 AAA)
Ne jamais coder un état uniquement par la couleur rouge/vert. Toujours associer :
1. Une couleur accessible avec contraste $\ge 4.5:1$.
2. Un glyphe directionnel ($\uparrow, \downarrow, \bullet$).
3. Un signe arithmétique ($+ / -$).
4. Un libellé textuel explicite.
5. Une police numérique tabulaire (`font-variant-numeric: tabular-nums`).

---

## 2. La Typologie des 7 Variantes

| N° | Variante | Cas d'Usage | Encodage Visuel |
| :--- | :--- | :--- | :--- |
| **01** | [**KPI Standard**](../../template/00-kpi-card/kpi-standard/kpi-standard.md) | Synthèse exécutive C-Level | Chiffre Hero 32px + Badge de valence + Benchmark |
| **02** | [**KPI Sparkline**](../../template/00-kpi-card/kpi-sparkline/kpi-sparkline.md) | Métriques continues / volatiles | Trajectoire continue de Tufte (Data-Ink élevé) |
| **03** | [**KPI Micro-Bullet**](../../template/00-kpi-card/kpi-bullet/kpi-bullet.md) | Pilotage d'objectifs / OKR | Barre 1D + Marqueur cible + 3 plages de tolérance |
| **04** | [**KPI Comparative**](../../template/00-kpi-card/kpi-comparative/kpi-comparative.md) | Diagnostic financier multi-repères | Grille bivalente Réalisé vs N-1 vs Budget |
| **05** | [**KPI Décomposition**](../../template/00-kpi-card/kpi-distribution/kpi-distribution.md) | Total agrégé + Part-to-Whole | Micro-barre 100% + Légendes directes contiguës |
| **06** | [**KPI Statut & Alerte**](../../template/00-kpi-card/kpi-status-alert/kpi-status-alert.md) | Supervision opérationnelle & SLA | Badge RAG multi-états + Réglette linéaire de seuils |
| **07** | [**KPI Composite**](../../template/00-kpi-card/kpi-composite/kpi-composite.md) | Équation d'affaires / Drivers | Chiffre Hero (60%) + 3 drivers causaux liés (40%) |
