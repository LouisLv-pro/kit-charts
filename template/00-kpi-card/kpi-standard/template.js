/**
 * @file template/00-kpi-card/kpi-standard/template.js
 * @description Standardized Universal kpi-standard Template for kit-charts.
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
    global.KitCharts['kpi-standard'] = exp;
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

  /**
   * Données représentatives par défaut (Revenu Mensuel Récurrent - MRR)
   */
  const DEFAULT_DATA = {
    title: 'Revenu Mensuel Récurrent (MRR)',
    value: 142850,
    unit: '€',
    format: 'currency',
    delta: 14.2,
    deltaLabel: 'vs mois précédent (125 080 €)',
    metricType: 'gain', // 'gain' (ex: CA, profit) ou 'cost' (ex: churn, coûts, délai)
    footnote: 'Mise à jour aujourd\'hui • Clôture M-1 confirmée',
    benchmark: 125080,
    history: [118000, 121500, 120200, 124000, 122800, 125080, 142850]
  };

  /**
   * Formate une valeur numérique avec séparateurs de milliers et chiffres tabulaires.
   */
  function formatValue(val, format, unit) {
    if (typeof val !== 'number') return String(val);
    let str = val.toLocaleString('fr-FR', { maximumFractionDigits: 1 });
    if (unit) str += ' ' + unit;
    return str;
  }

  /**
   * Rendu Canvas Chart.js d'une micro-jauge / anneau de complétion stylisé et moderne.
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

    const valence = data.delta > 0 ? 1 : (data.delta < 0 ? -1 : 0);
    const valenceColor = getValenceColor(tokens, valence, data.metricType || 'gain');
    const primaryColor = getColor(tokens, 0);

    // Dessin d'une micro-visualisation en anneau avec Chart.js
    if (typeof Chart === 'undefined') return null;

    const progressRatio = data.benchmark ? Math.min(100, Math.round((data.value / data.benchmark) * 100)) : 100;
    const isDark = Boolean(tokens.isDark);

    const chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Réalisé', 'Reste'],
        datasets: [{
          data: [progressRatio, Math.max(0, 100 - progressRatio)],
          backgroundColor: [
            valenceColor,
            isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.06)'
          ],
          borderWidth: 0,
          cutout: '80%',
          circumference: 260,
          rotation: 230
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 400, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            callbacks: {
              label: (ctx) => `Atteinte : ${progressRatio}% (${formatValue(data.value, data.format, data.unit)})`
            }
          }
        }
      }
    });

    return chart;
  }

  /**
   * Rendu complet du composant HTML de la carte KPI avec gestion réactive du thème.
   */
  function renderCard(targetElement, customData = null, themeName = DEFAULT_THEME) {
    const el = typeof targetElement === 'string' && typeof document !== 'undefined'
      ? document.getElementById(targetElement)
      : targetElement;

    if (!el) return null;

    const tokens = getThemeTokens(themeName, el);
    const data = Object.assign({}, DEFAULT_DATA, customData || {});

    const isPositive = data.delta >= 0;
    const valence = isPositive ? 1 : -1;
    const valenceColor = getValenceColor(tokens, valence, data.metricType || 'gain');
    const badgeBg = hexToRgba(valenceColor, tokens.isDark ? 0.18 : 0.10);
    const badgeBorder = hexToRgba(valenceColor, tokens.isDark ? 0.35 : 0.25);
    const arrowGlyph = isPositive ? '▲' : '▼';
    const deltaSign = isPositive ? '+' : '';

    el.innerHTML = `
      <div class="kpi-card" style="
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
        min-height: 160px;
        position: relative;
        transition: all 0.2s ease;
      ">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 0.75rem;">
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
            justify-content: center;
            text-align: center;
            flex-shrink: 0;
            white-space: nowrap;
            gap: 4px;
            padding: 4px 10px;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 700;
            font-variant-numeric: tabular-nums;
            background: ${badgeBg};
            color: ${valenceColor};
            border: 1px solid ${badgeBorder};
          ">
            <span>${arrowGlyph}</span>
            <span>${deltaSign}${data.delta}%</span>
          </span>
        </div>

        <div style="margin-bottom: 0.75rem;">
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
          <div style="
            font-size: 0.8125rem;
            color: ${tokens.textMuted};
            margin-top: 0.35rem;
          ">
            ${data.deltaLabel}
          </div>
        </div>

        ${data.footnote ? `
        <div style="
          padding-top: 0.6rem;
          border-top: 1px solid ${tokens.gridColor || tokens.border};
          font-size: 0.725rem;
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
