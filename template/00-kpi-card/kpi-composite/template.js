/**
 * @file template/00-kpi-card/kpi-composite/template.js
 * @description Standardized Universal kpi-composite Template for kit-charts.
 * Compatible with browsers (file://, http://), Node.js, and bundlers.
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
    global.KitCharts['kpi-composite'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return d >= 0 ? '#2E7D32' : '#C62828'; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  const DEFAULT_DATA = {
    title: 'Chiffre d\'Affaires E-Commerce',
    value: 842500,
    unit: '€',
    delta: 18.4,
    deltaLabel: 'vs N-1 (711 500 €)',
    metricType: 'gain',
    drivers: [
      { label: 'Commandes', value: 10240, unit: '', delta: 12.1, deltaUnit: '%' },
      { label: 'Panier Moyen', value: 82.27, unit: '€', delta: 5.6, deltaUnit: '%' },
      { label: 'Tx Conv.', value: 3.42, unit: '%', delta: -0.2, deltaUnit: 'pt' }
    ],
    footnote: 'Équation : CA = Commandes × Panier Moyen'
  };

  /**
   * Crée et initialise un micro-bar Chart.js pour visualiser les 3 drivers.
   */
  function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
    const canvas = typeof canvasTarget === 'string' && typeof document !== 'undefined'
      ? document.getElementById(canvasTarget)
      : canvasTarget;

    if (!canvas) return null;

    if (typeof Chart !== 'undefined') {
      const existing = Chart.getChart(canvas);
      if (existing) existing.destroy();
    }

    const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
    const tokens = getThemeTokens(themeName, container);
    const data = Object.assign({}, DEFAULT_DATA, customData || {});
    const drivers = data.drivers || DEFAULT_DATA.drivers;

    const bgColors = drivers.map(d => {
      const isPos = d.delta >= 0;
      return getValenceColor(tokens, isPos ? 1 : -1, 'gain');
    });

    if (typeof Chart === 'undefined') return null;

    const chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: drivers.map(d => d.label),
        datasets: [{
          data: drivers.map(d => d.delta),
          backgroundColor: bgColors,
          borderRadius: 4,
          barThickness: 16
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 400, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            callbacks: {
              label: (ctx) => `Variation : ${ctx.parsed.x > 0 ? '+' : ''}${ctx.parsed.x}%`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 10, family: tokens.fontMono }, color: tokens.textSecondary }
          },
          y: {
            grid: { display: false },
            ticks: { font: { size: 11, family: tokens.fontFamily }, color: tokens.textPrimary }
          }
        }
      }
    });

    return chart;
  }

  /**
   * Rendu complet du composant DOM de la KPI Card Composite.
   */
  function renderCard(targetElement, customData = null, themeName = DEFAULT_THEME) {
    const el = typeof targetElement === 'string' && typeof document !== 'undefined'
      ? document.getElementById(targetElement)
      : targetElement;

    if (!el) return null;

    const tokens = getThemeTokens(themeName, el);
    const data = Object.assign({}, DEFAULT_DATA, customData || {});
    const drivers = data.drivers || DEFAULT_DATA.drivers;
    const isDark = Boolean(tokens.isDark);

    const isPositive = data.delta >= 0;
    const valence = isPositive ? 1 : -1;
    const valenceColor = getValenceColor(tokens, valence, data.metricType || 'gain');
    const badgeBg = hexToRgba(valenceColor, isDark ? 0.18 : 0.10);
    const badgeBorder = hexToRgba(valenceColor, isDark ? 0.35 : 0.25);

    // Génération des 3 colonnes drivers
    const driversHtml = drivers.map(drv => {
      const drvPos = drv.delta >= 0;
      const drvColor = getValenceColor(tokens, drvPos ? 1 : -1, 'gain');
      const valStr = typeof drv.value === 'number' ? drv.value.toLocaleString('fr-FR') : String(drv.value);
      return `
        <div style="display: flex; flex-direction: column; gap: 2px;">
          <span style="font-size: 0.6875rem; font-weight: 600; color: ${tokens.textMuted}; text-transform: uppercase;">
            ${drv.label}
          </span>
          <span style="font-size: 1.05rem; font-weight: 700; color: ${tokens.textPrimary}; font-variant-numeric: tabular-nums;">
            ${valStr} <span style="font-size: 0.75rem; font-weight: 500; color: ${tokens.textMuted};">${drv.unit || ''}</span>
          </span>
          <span style="font-size: 0.7rem; font-weight: 700; color: ${drvColor}; font-variant-numeric: tabular-nums;">
            ${drvPos ? '▲ +' : '▼ '}${drv.delta}${drv.deltaUnit || '%'}
          </span>
        </div>
      `;
    }).join('');

    el.innerHTML = `
      <div class="kpi-card kpi-card--composite" style="
        background: ${tokens.surfaceRaised || tokens.surface};
        border: 1px solid ${tokens.border};
        border-radius: 14px;
        padding: 1.25rem 1.4rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        font-family: ${tokens.fontFamily};
        color: ${tokens.textPrimary};
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 220px;
        position: relative;
        transition: all 0.2s ease;
      ">
        <!-- En-tête Hero -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 0.4rem;">
          <span style="
            font-size: 0.8125rem;
            font-weight: 600;
            color: ${tokens.textSecondary};
            text-transform: uppercase;
            letter-spacing: 0.04em;
          ">${data.title}</span>
          <span style="
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 3px 8px;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 700;
            font-variant-numeric: tabular-nums;
            background: ${badgeBg};
            color: ${valenceColor};
            border: 1px solid ${badgeBorder};
          ">
            <span>${isPositive ? '▲' : '▼'}</span>
            <span>${isPositive ? '+' : ''}${data.delta}%</span>
          </span>
        </div>

        <!-- Valeur Hero -->
        <div style="margin-bottom: 0.6rem;">
          <div style="
            font-size: 2.1rem;
            font-weight: 800;
            line-height: 1.1;
            letter-spacing: -0.03em;
            color: ${tokens.textPrimary};
            font-variant-numeric: tabular-nums;
          ">
            ${data.value.toLocaleString('fr-FR')} <span style="font-size: 1.25rem; font-weight: 500; color: ${tokens.textMuted};">${data.unit || ''}</span>
          </div>
          <div style="font-size: 0.75rem; color: ${tokens.textMuted}; margin-top: 2px;">
            ${data.deltaLabel}
          </div>
        </div>

        <!-- Séparateur Subtil -->
        <div style="
          width: 100%;
          height: 1px;
          background: ${tokens.gridColor || tokens.border};
          margin-bottom: 0.6rem;
        "></div>

        <!-- Grille des Drivers Liés -->
        <div style="
          display: grid;
          grid-template-columns: repeat(${drivers.length}, 1fr);
          gap: 10px;
          margin-bottom: 0.4rem;
        ">
          ${driversHtml}
        </div>

        ${data.footnote ? `
        <div style="
          padding-top: 0.4rem;
          border-top: 1px solid ${tokens.gridColor || tokens.border};
          font-size: 0.7rem;
          color: ${tokens.textMuted};
        ">
          ${data.footnote}
        </div>` : ''}
      </div>
    `;

    return el;
  }

  return {
    createChart,
    renderCard,
    DEFAULT_DATA
  };
});
