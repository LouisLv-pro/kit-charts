# -*- coding: utf-8 -*-
"""
Lot 4 (P3) Combo Generator:
13. waterfall-cumulative-line (06-flux-processus)
14. price-indicator-overlays (05-evolution-temporelle)
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path("/Users/louislaville/Desktop/kit-charts/scratch")))
from generate_all import write_file, preview_html

# ==============================================================================
# 13. WATERFALL-CUMULATIVE-LINE
# ==============================================================================
waterfall_js = """/**
 * @file 06-flux-processus/waterfall-cumulative-line/template.js
 * @description Standardized Waterfall Chart + Continuous Cumulative Trajectory Line Template.
 * Combines discrete sequential variance bridges and continuous net cumulative trend.
 */

(function(global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory(require('../../../themes/theme-tokens.js'));
  } else if (typeof define === 'function' && define.amd) {
    define(['../../../themes/theme-tokens.js'], factory);
  } else {
    global = typeof globalThis !== 'undefined' ? globalThis : global || self;
    var tokens = global.KitChartsTheme || (global.KitCharts && global.KitCharts.Theme) || {};
    var exp = factory(tokens);
    global.KitCharts = global.KitCharts || {};
    global.KitCharts['waterfall-cumulative-line'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.computeWaterfallBalances = exp.computeWaterfallBalances;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  function computeWaterfallBalances(steps) {
    let running = 0;
    const balances = [];
    const barRanges = [];
    const types = [];

    steps.forEach((s, idx) => {
      const val = Number(s.value) || 0;
      const isTotal = Boolean(s.isTotal);

      if (idx === 0 || isTotal) {
        if (isTotal) {
          barRanges.push([0, running]);
          balances.push(running);
          types.push('total');
        } else {
          barRanges.push([0, val]);
          running = val;
          balances.push(running);
          types.push('start');
        }
      } else {
        const prev = running;
        running += val;
        barRanges.push([Math.min(prev, running), Math.max(prev, running)]);
        balances.push(running);
        types.push(val >= 0 ? 'pos' : 'neg');
      }
    });

    return { balances, barRanges, types, finalTotal: running };
  }

  const DEFAULT_DATA = {
    labels: [
      'CA Brut Initial',
      'Nouveaux Contrats',
      'Expansion Comptes',
      'Remises Commerciales',
      'Désabonnements (Churn)',
      "Frais d'Infrastructure",
      'EBITDA Net'
    ],
    datasets: [{
      label: 'Pont Financier (k€)',
      data: [
        { label: 'CA Brut Initial', value: 500, isTotal: false },
        { label: 'Nouveaux Contrats', value: 180, isTotal: false },
        { label: 'Expansion Comptes', value: 75, isTotal: false },
        { label: 'Remises Commerciales', value: -45, isTotal: false },
        { label: 'Désabonnements (Churn)', value: -60, isTotal: false },
        { label: "Frais d'Infrastructure", value: -110, isTotal: false },
        { label: 'EBITDA Net', value: 0, isTotal: true }
      ]
    }]
  };

  function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
    const canvas = typeof canvasTarget === 'string'
      ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
      : canvasTarget;

    if (!canvas) throw new Error(`Canvas element "${canvasTarget}" not found`);

    if (typeof Chart !== 'undefined' && Chart.getChart) {
      const existing = Chart.getChart(canvas);
      if (existing) existing.destroy();
    }

    const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
    const tokens = getThemeTokens(themeName, container);
    const isDark = Boolean(tokens.isDark);

    const rawData = customData || DEFAULT_DATA;
    const labels = rawData.labels || DEFAULT_DATA.labels;
    const steps = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data) || DEFAULT_DATA.datasets[0].data;

    const analysis = computeWaterfallBalances(steps);

    const posColor = tokens.semantic?.positive || tokens.status?.success || '#2E7D32';
    const negColor = tokens.semantic?.negative || tokens.status?.danger || '#C62828';
    const totalColor = tokens.emphasis?.focal || tokens.palette?.[0] || '#2B8CBE';
    const lineColor = tokens.emphasis?.benchmark || (isDark ? '#ECEFF4' : '#0F172A');

    const barColors = analysis.types.map(t => {
      if (t === 'pos') return posColor;
      if (t === 'neg') return negColor;
      return totalColor;
    });

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            type: 'bar',
            label: 'Variation Étape',
            data: analysis.barRanges,
            backgroundColor: barColors.map(c => hexToRgba(c, isDark ? 0.85 : 0.75)),
            borderColor: barColors,
            borderWidth: 1.5,
            borderRadius: 4,
            order: 2
          },
          {
            type: 'line',
            label: 'Trajectoire Cumulée',
            data: analysis.balances,
            borderColor: lineColor,
            backgroundColor: lineColor,
            borderWidth: 2.5,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.15,
            order: 1
          }
        ]
      },
      options: {
        ...defaultOpts,
        animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          ...defaultOpts.plugins,
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              color: tokens.textPrimary,
              font: { family: tokens.fontFamily, size: 12 }
            }
          },
          tooltip: {
            ...defaultOpts.plugins.tooltip,
            callbacks: {
              title: (items) => items[0].label,
              label: (ctx) => {
                const idx = ctx.dataIndex;
                const s = steps[idx];
                const bal = analysis.balances[idx];
                if (ctx.dataset.type === 'bar') {
                  const valStr = s.isTotal ? `${bal} k€ (Total)` : `${s.value >= 0 ? '+' : ''}${s.value} k€`;
                  return `Impact : ${valStr}`;
                }
                return `Solde Cumulé : ${bal.toLocaleString('fr-FR')} k€`;
              }
            }
          }
        },
        scales: {
          x: {
            ...defaultOpts.scales.x,
            grid: { display: false },
            ticks: {
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 11 },
              maxRotation: 25
            }
          },
          y: {
            ...defaultOpts.scales.y,
            beginAtZero: true,
            grid: { color: tokens.gridColor },
            title: {
              display: true,
              text: 'Solde Net (k€)',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          }
        }
      }
    };

    if (typeof Chart === 'undefined') return { config, analysis, computeWaterfallBalances };
    return new Chart(canvas, config);
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeWaterfallBalances
  };
});
"""

waterfall_md = """# Waterfall + Ligne Cumulée (Waterfall-Cumulative Line)

## 1. Fondements Scientifiques & Justification Cognitive
Le diagramme Waterfall enrichi d'une ligne de trajectoire cumulée permet de suivre la réconciliation budgétaire pas-à-pas (pont de variance) tout en visualisant le niveau de solde instantané à chaque étape (Tufte 1983, Heer & Robertson 2007).
Alors que le waterfall simple encode les variations isolées par la hauteur relative des barres flottantes, l'œil humain peine à interpoler mentalement la pente du chemin cumulé. La ligne de cumul continu fournit un encodage par position directe (niveau 1 de Cleveland & McGill).

### Citations Fondatrices
- **Tufte, E. R. (1983)**. *The Visual Display of Quantitative Information*. Graphics Press.
- **Heer, J., & Robertson, G. G. (2007)**. *Animated Transitions in Statistical Data Graphics*. IEEE TVCG.
- **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception*. JASA.
- **Mayer, R. E. (2001)**. *Multimedia Learning*. Cambridge University Press.

---

## 2. Formulation Mathématique Déterministe

### 2.1 Solde et Bornes Flottantes
$$R_0 = \\text{Départ}, \\quad R_i = R_{i-1} + \\Delta_i, \\quad \\text{Barre}_i = [\\min(R_{i-1}, R_i), \\max(R_{i-1}, R_i)]$$

---

## 3. Double-Encodage & Garde-Fous Cognitifs
1. **Valence sémantique** : Gains en vert (`semantic.positive`), pertes en rouge (`semantic.negative`), totaux en couleur focale.
2. **Ligne de cumul continue** : Trait continu 2.5px contrasté reliant les sommets des soldes.
"""

write_file("template/06-flux-processus/waterfall-cumulative-line/template.js", waterfall_js)
write_file("template/06-flux-processus/waterfall-cumulative-line/waterfall-cumulative-line.md", waterfall_md)
write_file("guide/06-flux-processus/waterfall-cumulative-line.md", waterfall_md)
write_file("template/06-flux-processus/waterfall-cumulative-line/preview.html", preview_html(
    id_name="waterfall-cumulative-line",
    title="Waterfall + Ligne Cumulée Continue",
    subtitle="Pont de variance séquentiel des gains/pertes & courbe de trajectoire du solde net cumulé",
    category="06-flux-processus",
    when_use="Explication pas-à-pas de l'évolution d'un budget, pont d'EBITDA, réconciliation de trésorerie ou bilan d'impacts cumulés.",
    benefit="Combine l'analyse des deltas individuels (barres flottantes) et le suivi direct du solde total courant (courbe continue).",
    when_not="Grandes séries temporelles continues (> 20 dates).",
    alt="Utiliser Line Chart ou Stacked Area Chart pour les séries chronologiques denses."
))

# ==============================================================================
# 14. PRICE-INDICATOR-OVERLAYS
# ==============================================================================
price_overlays_js = """/**
 * @file 05-evolution-temporelle/price-indicator-overlays/template.js
 * @description Standardized Price Series + Technical Indicator Overlays (SMA / Bollinger Bands) Template.
 * Enforces strict 3-layer cognitive capacity constraint (Miller 1956 / Mayer 2001).
 */

(function(global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory(require('../../../themes/theme-tokens.js'));
  } else if (typeof define === 'function' && define.amd) {
    define(['../../../themes/theme-tokens.js'], factory);
  } else {
    global = typeof globalThis !== 'undefined' ? globalThis : global || self;
    var tokens = global.KitChartsTheme || (global.KitCharts && global.KitCharts.Theme) || {};
    var exp = factory(tokens);
    global.KitCharts = global.KitCharts || {};
    global.KitCharts['price-indicator-overlays'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.computeSMA = exp.computeSMA;
    global.computeEMA = exp.computeEMA;
    global.computeBollingerBands = exp.computeBollingerBands;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return o || {}; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  function computeSMA(prices, period = 20) {
    if (!Array.isArray(prices)) return [];
    return prices.map((val, idx, arr) => {
      if (idx < period - 1) {
        const slice = arr.slice(0, idx + 1);
        return Math.round((slice.reduce((s, v) => s + v, 0) / slice.length) * 100) / 100;
      }
      const slice = arr.slice(idx - period + 1, idx + 1);
      return Math.round((slice.reduce((s, v) => s + v, 0) / period) * 100) / 100;
    });
  }

  function computeEMA(prices, period = 50) {
    if (!Array.isArray(prices) || prices.length === 0) return [];
    const k = 2 / (period + 1);
    const ema = [prices[0]];
    for (let i = 1; i < prices.length; i++) {
      ema.push(Math.round((prices[i] * k + ema[i - 1] * (1 - k)) * 100) / 100);
    }
    return ema;
  }

  function computeBollingerBands(prices, period = 20, k = 2) {
    const sma = computeSMA(prices, period);
    const upper = [];
    const lower = [];

    prices.forEach((val, idx, arr) => {
      const start = Math.max(0, idx - period + 1);
      const slice = arr.slice(start, idx + 1);
      const mean = sma[idx];
      const variance = slice.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / slice.length;
      const sigma = Math.sqrt(variance);

      upper.push(Math.round((mean + k * sigma) * 100) / 100);
      lower.push(Math.round((mean - k * sigma) * 100) / 100);
    });

    return { sma, upper, lower };
  }

  const DEFAULT_DATA = {
    labels: [
      'J1', 'J2', 'J3', 'J4', 'J5', 'J6', 'J7', 'J8', 'J9', 'J10',
      'J11', 'J12', 'J13', 'J14', 'J15', 'J16', 'J17', 'J18', 'J19', 'J20',
      'J21', 'J22', 'J23', 'J24', 'J25', 'J26', 'J27', 'J28', 'J29', 'J30'
    ],
    datasets: [{
      label: 'Indice Synthétique (€)',
      data: [
        100, 102, 101, 104, 106, 105, 108, 110, 109, 112,
        115, 114, 116, 118, 120, 119, 122, 125, 124, 126,
        128, 127, 130, 133, 132, 135, 137, 136, 139, 142
      ]
    }]
  };

  function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
    const canvas = typeof canvasTarget === 'string'
      ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
      : canvasTarget;

    if (!canvas) throw new Error(`Canvas element "${canvasTarget}" not found`);

    if (typeof Chart !== 'undefined' && Chart.getChart) {
      const existing = Chart.getChart(canvas);
      if (existing) existing.destroy();
    }

    const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
    const tokens = getThemeTokens(themeName, container);
    const isDark = Boolean(tokens.isDark);

    const rawData = customData || DEFAULT_DATA;
    const labels = rawData.labels || DEFAULT_DATA.labels;
    const prices = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data) || DEFAULT_DATA.datasets[0].data;
    const seriesLabel = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].label) || 'Prix Clôture';

    const bollinger = computeBollingerBands(prices, 10, 2);

    const priceColor = tokens.emphasis?.focal || tokens.palette?.[0] || '#2B8CBE';
    const smaColor = tokens.palette?.[1] || '#E66101';
    const bandColor = tokens.emphasis?.context || (isDark ? '#4C566A' : '#CBD5E1');

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: seriesLabel,
            data: prices,
            borderColor: priceColor,
            backgroundColor: priceColor,
            borderWidth: 2.5,
            pointRadius: 3,
            pointHoverRadius: 5,
            tension: 0.2,
            order: 1
          },
          {
            label: 'Moyenne Mobile (SMA 10)',
            data: bollinger.sma,
            borderColor: smaColor,
            borderWidth: 1.5,
            borderDash: [3, 3],
            pointRadius: 0,
            tension: 0.3,
            order: 2
          },
          {
            label: 'Bollinger Supérieure (+2σ)',
            data: bollinger.upper,
            borderColor: hexToRgba(bandColor, 0.60),
            borderWidth: 1,
            pointRadius: 0,
            fill: '+1',
            backgroundColor: hexToRgba(bandColor, isDark ? 0.18 : 0.10),
            tension: 0.3,
            order: 3
          },
          {
            label: 'Bollinger Inférieure (-2σ)',
            data: bollinger.lower,
            borderColor: hexToRgba(bandColor, 0.60),
            borderWidth: 1,
            pointRadius: 0,
            fill: false,
            tension: 0.3,
            order: 3
          }
        ]
      },
      options: {
        ...defaultOpts,
        animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          ...defaultOpts.plugins,
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              color: tokens.textPrimary,
              font: { family: tokens.fontFamily, size: 12 },
              filter: (item) => !item.text.includes('Inférieure')
            }
          },
          tooltip: {
            ...defaultOpts.plugins.tooltip,
            callbacks: {
              title: (items) => `Jour : ${items[0].label}`,
              label: (ctx) => {
                return `${ctx.dataset.label} : ${ctx.parsed.y.toFixed(2)} €`;
              }
            }
          }
        },
        scales: {
          x: {
            ...defaultOpts.scales.x,
            grid: { color: tokens.gridColor }
          },
          y: {
            ...defaultOpts.scales.y,
            beginAtZero: false,
            grid: { color: tokens.gridColor },
            title: {
              display: true,
              text: 'Valeur (€)',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          }
        }
      }
    };

    if (typeof Chart === 'undefined') return { config, bollinger, computeSMA, computeEMA, computeBollingerBands };
    return new Chart(canvas, config);
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeSMA,
    computeEMA,
    computeBollingerBands
  };
});
"""

price_overlays_md = """# Prix + Overlays Indicateurs (SMA & Bandes de Bollinger)

## 1. Fondements Scientifiques & Justification Cognitive
Le combo **Prix + Overlays Indicateurs** est le standard analytique pour l'étude de séries temporelles avec volatilité et tendance (Bollinger 1980s, Wilder 1978).

### Garde-Fou Cognitif Strict : Maximum 3 Couches Visuelles
Conformément aux limites de la mémoire de travail humaine (**Miller 1956** : $7 \\pm 2$ chunks ; **Mayer 2001** : principe de cohérence cognitive), superposer plus de 3 indicateurs simultanés génère un bruit visuel toxique (*cognitive clutter*).
Ce template limite strictement l'affichage à :
1. **La série principale des prix** (Hero).
2. **La tendance centrale lissée** (Moyenne Mobile Simple - SMA).
3. **Le canal de volatilité à $\\pm 2\\sigma$** (Bandes de Bollinger en halo translucide).

### Citations Fondatrices
- **Bollinger, J. (2001)**. *Bollinger on Bollinger Bands*. McGraw-Hill.
- **Wilder, J. W. (1978)**. *New Concepts in Technical Trading Systems*. Trend Research.
- **Miller, G. A. (1956)**. *The Magical Number Seven, Plus or Minus Two*. Psychological Review.
- **Mayer, R. E. (2001)**. *Multimedia Learning*. Cambridge University Press.

---

## 2. Formulation Mathématique Déterministe

### 2.1 Moyenne Mobile Simple (SMA)
$$\\text{SMA}_n(t) = \\frac{1}{n} \\sum_{i=0}^{n-1} P_{t-i}$$

### 2.2 Bandes de Bollinger ($\\pm 2\\sigma$)
$$\\text{Upper}_t = \\text{SMA}_n(t) + 2 \\cdot \\sigma_n(t), \\quad \\text{Lower}_t = \\text{SMA}_n(t) - 2 \\cdot \\sigma_n(t)$$
où $\\sigma_n(t) = \\sqrt{\\frac{1}{n}\\sum_{i=0}^{n-1} (P_{t-i} - \\text{SMA}_n(t))^2}$.

---

## 3. Double-Encodage & Garde-Fous Cognitifs
1. **Halo de volatilité** : Remplissage doux $\\alpha = 0.10$ entre les bornes supérieure et inférieure.
2. **Courbe de prix Hero** : Trait plein d'épaisseur 2.5px.
3. **Contrainte 3 couches** : Aucune surcharge d'indicateurs secondaires superflus.
"""

write_file("template/05-evolution-temporelle/price-indicator-overlays/template.js", price_overlays_js)
write_file("template/05-evolution-temporelle/price-indicator-overlays/price-indicator-overlays.md", price_overlays_md)
write_file("guide/05-evolution-temporelle/price-indicator-overlays.md", price_overlays_md)
write_file("template/05-evolution-temporelle/price-indicator-overlays/preview.html", preview_html(
    id_name="price-indicator-overlays",
    title="Prix + Overlays Indicateurs (SMA / Bollinger)",
    subtitle="Série de prix chronologique avec canal de volatilité de Bollinger (±2σ) et moyenne mobile de tendance",
    category="05-evolution-temporelle",
    when_use="Analyse financière ou industrielle experte nécessitant d'observer simultanément le prix instantané, la tendance de fond et les seuils de surachat/survente.",
    benefit="Respecte le garde-fou cognitif des 3 couches maximum pour éviter la surcharge mentale sur les graphiques de trading.",
    when_not="Tableaux de bord destinés au grand public ou communication institutionnelle.",
    alt="Utiliser Line Chart simple ou Candlestick-Volume pour les présentations financières standards."
))

print("Lot 4 (P3) templates generated successfully!")
