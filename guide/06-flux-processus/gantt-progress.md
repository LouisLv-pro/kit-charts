# Gantt + Avancement + Repère "Aujourd'hui" (Gantt-Progress)

## 1. Fondements Scientifiques & Justification Cognitive
Le diagramme de Gantt avec progression et repère temporel synchronisé trouve son origine chez **Henry Gantt (1910–1917)** et la recherche préattentive sur les repères visuels verticaux (**Healey, Boothby & Enns 1996**).
Visualiser des barres de tâches sans repère temporel "maintenant" (*Now Line*) oblige l'analyste à des allers-retours oculaires constants entre l'axe temporel et chaque barre. Le trait d'accentuation vertical active le traitement préattentif instantané des retards.

### Citations Fondatrices
- **Gantt, H. L. (1916)**. *Work, Wages, and Profits*. The Engineering Magazine Co.
- **Healey, C. G., Booth, K. S., & Enns, J. T. (1996)**. *High-Speed Visual Estimation Using Preattentive Processing*. ACM TOCHI.
- **Heer, J., & Robertson, G. G. (2007)**. *Animated Transitions in Statistical Data Graphics*. IEEE TVCG.
- **Tufte, E. R. (1983)**. *The Visual Display of Quantitative Information*. Graphics Press.

---

## 2. Formulation Mathématique Déterministe

### 2.1 Avancement Temporel
Pour chaque tâche $i$ avec intervalle $[S_i, E_i]$ et avancement $p_i \in [0, 100]\%$ :
$$D_i = E_i - S_i, \quad X_{\text{done}, i} = S_i + D_i \cdot \left(\frac{p_i}{100}\right)$$
- Statut en retard (*Late*) si $T_{\text{today}} > X_{\text{done}, i}$ et $p_i < 100\%$.

---

## 3. Double-Encodage & Garde-Fous Cognitifs
1. **Barre de tâche** : Fond translucide $(\alpha = 0.20)$ marquant l'intervalle total prévu.
2. **Sous-barre d'avancement** : Remplissage opaque $(\alpha = 0.85)$ indiquant le travail réel achevé.
3. **Repère Aujourd'hui** : Ligne pointillée préattentive (`tokens.emphasis.benchmark`).
