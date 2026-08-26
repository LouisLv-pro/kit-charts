# Project: kit-charts — Psychophysical Interaction, Tooltips, Micro-Animations & Combo Templates

## Architecture
- **Central Theme & Tokens Engine**: `themes/theme-tokens.js` (UMD/ESM/CommonJS module exporting 8 cognitive themes, `getChartDefaultOptions`, psychophysical interaction options, anti-occlusion tooltip configuration, tabular typography, and accessible animation controls).
- **Bundle Layer**: `catalog-bundle.js` (Zero-CORS monolithic bundle for offline `file://` and web browser runtime, bundling all 83 templates).
- **Template Catalog**: 83 templates total:
  - 7 KPI Cards (`00-kpi-card/`)
  - 60 Dataviz Charts across 8 categories (`01-comparaison` to `08-geospatial-cartes`), including 14 combo templates
  - 6 Dataviz Tables (`09-tableaux-dataviz/`)
  - 1 Tooltip Laboratory (`tooltip/`)
  - 9 Animation Presets & Kinematic Labs (`animation/`)
- **Test & Validation Harness**: `test/verify-tokens.mjs`, `test/verify-catalog.mjs`, `test/test-all-catalog.mjs`, `test/verify-graph-combine.mjs`, `test/runner.js`, `test/empirical-stress-challenger.mjs`.

## Feature Inventory & Milestones
| # | Feature / Milestone | Description | Status | Source |
|---|---------------------|-------------|--------|--------|
| 1 | Academic Research & Formalization | Formalize Fitts' Law, Mayer anti-occlusion, Sweller cognitive load, Tufte/Few, Cleveland & McGill, Weissgerber (2015), Allen & Kievit (2019) Raincloud, Freedman-Diaconis, Silverman KDE | DONE | MASTER_SPEC |
| 2 | Core Engine & Tokens (`themes/theme-tokens.js`) | 8 perceptual themes, `getChartDefaultOptions`, Fitts' law hit target radii (`hitRadius: 10-14px`), WCAG AAA contrast, tabular numbers (`fontMono`) | DONE | MASTER_SPEC |
| 3 | Core Catalog Triads (Lots 1 à 4) | 46 baseline chart templates + 7 KPI cards + 6 Dataviz tables + Tooltips & Animation labs | DONE | LOTS 1-4 |
| 4 | Combo Hybrid Templates (Lot 5) | 14 combo templates with deterministic formulas (KDE, Tukey R-7, OLS IC 95%, Gini, Base 100, Bollinger ±2σ, Waterfall, Gantt Progress) | DONE | MASTER_SPEC |
| 5 | Monolithic Runtime Synchronization | `catalog-bundle.js` updated to 83 bundled templates with zero-CORS IIFE execution | DONE | LOT 5 |
| 6 | Gallery Portal Synchronization | `index.html` updated with 83 catalog entries, category counters, and dynamic rendering | DONE | LOT 5 |
| 7 | Dedicated Verification Harness | `test/verify-graph-combine.mjs` verifying file triads, guides, academic citations, 8-theme headless instantiation, and math formulas | DONE | LOT 5 |

## Combo Hybrid Templates Inventory (14 Templates)
1. `01-comparaison/bullet-chart` (Founding Combo — Stephen Few 2005)
2. `01-comparaison/bar-target-overlay` (Horizontal Bar + Target Marker + Variance Deltas)
3. `02-composition-part-to-whole/pareto-chart` (Descending Bars + Cumulative 80% Curve + Gini)
4. `02-composition-part-to-whole/stacked-total-line` (Stacked Bars + Macro Total Summary Line)
5. `03-distribution/histogramme-kde` (Freedman-Diaconis Bins + Silverman Gaussian KDE)
6. `03-distribution/box-strip-plot` (Tukey 5-Number Box + Golden-Ratio Deterministic Jitter Points)
7. `03-distribution/raincloud-plot` (Half-KDE Cloud + Micro-Box + Rain Points — Allen & Kievit 2019)
8. `03-distribution/violin-plot` (Enriched with explicit sample size $n$ & area normalization guardrail)
9. `04-correlation-relation/scatter-regression` (Bivariate Scatter + OLS Trendline + 95% Confidence Band)
10. `04-correlation-relation/joint-scatter-marginals` (Central Scatter + 1D Marginal KDEs + 95% Covariance Ellipse)
11. `05-evolution-temporelle/candlestick-volume` (OHLC Price Panel + Volume Panel sharing temporal X-axis)
12. `05-evolution-temporelle/dual-axis-controlled` (Normalized Dual-Axis with aligned zeros & color matching)
13. `05-evolution-temporelle/price-indicator-overlays` (Price Line + SMA 10 + Bollinger Bands ±2σ)
14. `06-flux-processus/gantt-progress` (Gantt Interval Bars + Progress Completion Fill + 'Today' Reference Line)
15. `06-flux-processus/waterfall-cumulative-line` (Variance Bridge Bars + Continuous Cumulative Trajectory Line)
