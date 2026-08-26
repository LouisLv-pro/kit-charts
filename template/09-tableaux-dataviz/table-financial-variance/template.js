/**
 * @file template/09-tableaux-dataviz/table-financial-variance/template.js
 * @description Standardized Universal table-financial-variance Template for kit-charts.
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
    global.KitCharts['table-financial-variance'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return d >= 0 ? '#2E7D32' : '#C62828'; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  /**
   * Données par défaut représentatives : Compte de Résultat Simplifié (P&L) avec analyse des variances vs Budget et N-1
   */
  const DEFAULT_DATA = {
    title: 'Compte de Résultat & Analyse des Variances (k€)',
    subtitle: 'Standards IBCS® — Comparaison Réalisé 2026 vs Budget et N-1 avec barres divergentes',
    columns: [
      { key: 'item', label: 'Structure du Compte (P&L)', align: 'left' },
      { key: 'actual', label: 'Réalisé N', align: 'right', format: 'currency' },
      { key: 'budget', label: 'Budget N', align: 'right', format: 'currency' },
      { key: 'priorYear', label: 'Réalisé N-1', align: 'right', format: 'currency' },
      { key: 'varAbs', label: 'Écart Absolue (Δ)', align: 'right', format: 'delta_currency' },
      { key: 'varPct', label: 'Écart Relatif (%)', align: 'right', format: 'delta_percent' },
      { key: 'varBar', label: 'Structure Variance IBCS', align: 'center', format: 'ibcs_bar' }
    ],
    rows: [
      { item: 'CHIFFRE D\'AFFAIRES BRUT', isSummary: false, isHeader: true, level: 0, actual: 48500, budget: 45000, priorYear: 41200, metricType: 'revenue' },
      { item: '  Ventes Licences SaaS', isSummary: false, isHeader: false, level: 1, actual: 36200, budget: 33000, priorYear: 29500, metricType: 'revenue' },
      { item: '  Services Professionnels & Conseil', isSummary: false, isHeader: false, level: 1, actual: 12300, budget: 12000, priorYear: 11700, metricType: 'revenue' },
      { item: 'COÛTS DES VENTES (COGS)', isSummary: false, isHeader: true, level: 0, actual: -9700, budget: -9000, priorYear: -8500, metricType: 'cost' },
      { item: '  Hébergement Cloud & Télécom', isSummary: false, isHeader: false, level: 1, actual: -4200, budget: -3800, priorYear: -3500, metricType: 'cost' },
      { item: '  Support Technique & Opérations', isSummary: false, isHeader: false, level: 1, actual: -5500, budget: -5200, priorYear: -5000, metricType: 'cost' },
      { item: 'MARGE BRUTE', isSummary: true, isHeader: true, level: 0, actual: 38800, budget: 36000, priorYear: 32700, metricType: 'revenue' },
      { item: 'CHARGES D\'EXPLOITATION (OPEX)', isSummary: false, isHeader: true, level: 0, actual: -26400, budget: -25000, priorYear: -23800, metricType: 'cost' },
      { item: '  R&D & Ingénierie Produit', isSummary: false, isHeader: false, level: 1, actual: -11800, budget: -11000, priorYear: -10200, metricType: 'cost' },
      { item: '  Ventes & Marketing', isSummary: false, isHeader: false, level: 1, actual: -10200, budget: -9800, priorYear: -9500, metricType: 'cost' },
      { item: '  Frais Généraux & Administratifs', isSummary: false, isHeader: false, level: 1, actual: -4400, budget: -4200, priorYear: -4100, metricType: 'cost' },
      { item: 'EBITDA OPÉRATIONNEL', isSummary: true, isHeader: true, level: 0, actual: 12400, budget: 11000, priorYear: 8900, metricType: 'revenue' }
    ]
  };

  /**
   * Formate une valeur monétaire selon la norme comptable (parenthèses pour les négatifs)
   */
  function formatAccounting(val, unit = ' k€') {
    if (val === null || val === undefined || isNaN(val)) return '—';
    const isNegative = val < 0;
    const absVal = Math.abs(val);
    const formatted = absVal.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    return isNegative ? `(${formatted}${unit})` : `${formatted}${unit}`;
  }

  /**
   * Génère une micro-barre divergente de variance IBCS à axe zéro central
   */
  function generateIBCSVarianceBarSVG(deltaPct, metricType = 'revenue', width = 120, height = 16, tokens = {}, isDark = false, isTufte = false) {
    const maxScalePct = 25; // Axe de -25% à +25%
    const midX = width / 2;

    // Règle de valence financière : delta >= 0 est Favorable (Vert), delta < 0 est Défavorable / Perte (Rouge)
    const isFavorable = deltaPct >= 0;
    const barColor = isFavorable
      ? (tokens.status?.success || '#2E7D32')
      : (tokens.status?.danger || '#C62828');

    const absRatio = Math.min(1, Math.abs(deltaPct) / maxScalePct);
    const barLength = Math.max(2, absRatio * (width / 2)).toFixed(1);

    let startX = midX;
    if (deltaPct < 0) {
      startX = midX - barLength;
    }

    const axisColor = isDark ? '#D8DEE9' : '#0F172A';

    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="display:block; margin:0 auto;" aria-label="Variance: ${deltaPct.toFixed(1)}%">
        <title>Variance: ${deltaPct > 0 ? '+' : ''}${deltaPct.toFixed(1)}%</title>
        <!-- Ligne d'axe zéro central -->
        <line x1="${midX}" y1="1" x2="${midX}" y2="${height - 1}" stroke="${axisColor}" stroke-width="1.5" />
        <!-- Micro-barre divergente -->
        <rect x="${startX}" y="3" width="${barLength}" height="${height - 6}" fill="${barColor}" rx="${isTufte ? 0 : 2}" />
      </svg>
    `;
  }

  /**
   * Crée et initialise un Tableau Financier & Variance IBCS
   *
   * @param {string|HTMLElement} target - ID ou élément DOM cible
   * @param {Object} [customData=null] - Jeu de données optionnel
   * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème
   * @param {Object} [options={}] - Options de rendu
   * @returns {Object} Instance de contrôle
   */
  function createTable(target, customData = null, themeName = DEFAULT_THEME, options = {}) {
    let container = null;
    let canvasElement = null;

    if (typeof target === 'string') {
      container = typeof document !== 'undefined' ? document.getElementById(target) : null;
    } else {
      container = target;
    }

    if (!container) {
      return {
        target,
        canvas: null,
        data: customData || DEFAULT_DATA,
        options: options || {},
        theme: themeName,
        destroy: () => {},
        update: () => {},
        setTheme: () => {},
        exportCSV: () => ''
      };
    }

    if (container.tagName === 'CANVAS') {
      canvasElement = container;
      canvasElement.style.display = 'none';
      let wrapper = container.parentElement.querySelector('.kc-table-wrapper');
      if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.className = 'kc-table-wrapper';
        container.parentElement.appendChild(wrapper);
      }
      container = wrapper;
    }

    const tokens = getThemeTokens(themeName, container);
    const isTufte = tokens.name === 'tufte-minimalist-executive';
    const isDark = Boolean(tokens.isDark);

    let data = JSON.parse(JSON.stringify(customData || DEFAULT_DATA));

    function render() {
      if (!container) return;

      const bgSurface = tokens.surface || (isDark ? '#242933' : '#FFFFFF');
      const bgHeader = isDark ? '#1F232B' : (isTufte ? '#FFFFFF' : '#F8FAFC');
      const borderCol = tokens.border || (isDark ? '#4C566A' : '#E2E8F0');
      const borderStrong = tokens.borderStrong || (isDark ? '#5E81AC' : '#CBD5E1');
      const textPrimary = tokens.textPrimary || (isDark ? '#ECEFF4' : '#0F172A');
      const textSecondary = tokens.textSecondary || (isDark ? '#D8DEE9' : '#475569');
      const textMuted = tokens.textMuted || (isDark ? '#9EABC0' : '#64748B');
      const fontSans = tokens.fontFamily || "'Inter', sans-serif";
      const fontMono = tokens.fontMono || "'JetBrains Mono', monospace";

      let html = `
        <div class="kc-dataviz-financial-container" style="
          width: 100%;
          overflow-x: auto;
          background: ${bgSurface};
          border: 1px solid ${borderCol};
          border-radius: ${isTufte ? '0' : '10px'};
          box-shadow: ${isTufte ? 'none' : (isDark ? '0 4px 16px rgba(0,0,0,0.3)' : '0 2px 8px rgba(15,23,42,0.04)')};
          font-family: ${fontSans};
          color: ${textPrimary};
          box-sizing: border-box;
        ">
          <table style="
            width: 100%;
            border-collapse: collapse;
            border-spacing: 0;
            font-size: 0.8125rem;
            line-height: 1.45;
            font-variant-numeric: tabular-nums lining-nums;
            font-feature-settings: 'tnum' 1, 'lnum' 1;
          ">
            <thead>
              <tr style="
                background: ${bgHeader};
                border-bottom: 1.5px solid ${borderStrong};
              ">
      `;

      data.columns.forEach(col => {
        html += `
          <th style="
            padding: 10px 14px;
            text-align: ${col.align};
            font-weight: 600;
            font-size: 0.725rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: ${textSecondary};
            border: none;
            white-space: nowrap;
          ">
            ${col.label}
          </th>
        `;
      });

      html += `
              </tr>
            </thead>
            <tbody>
      `;

      data.rows.forEach((row, idx) => {
        const isHeaderRow = row.isHeader;
        const isSummaryRow = row.isSummary;
        const indentPx = (row.level || 0) * 16;

        let rowBg = 'transparent';
        let borderBottom = `1px solid ${borderCol}`;
        let borderTop = 'none';

        if (isSummaryRow) {
          rowBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.03)';
          borderTop = `1.5px solid ${borderStrong}`;
          borderBottom = `2px double ${borderStrong}`;
        } else if (isHeaderRow) {
          rowBg = isDark ? 'rgba(255,255,255,0.015)' : 'rgba(15,23,42,0.01)';
        }

        const deltaAbs = row.actual - row.budget;
        const deltaPct = row.budget !== 0 ? (deltaAbs / Math.abs(row.budget)) * 100 : 0;

        const isFavorable = deltaAbs >= 0;
        const deltaColor = isFavorable
          ? (tokens.status?.success || '#2E7D32')
          : (tokens.status?.danger || '#C62828');

        const arrow = deltaAbs > 0 ? '+' : '';
        const fontWeight = isSummaryRow ? '700' : (isHeaderRow ? '600' : '400');
        const textColor = isSummaryRow ? textPrimary : (isHeaderRow ? textPrimary : textSecondary);

        html += `
          <tr class="kc-table-row" style="
            background: ${rowBg};
            border-top: ${borderTop};
            border-bottom: ${borderBottom};
            font-weight: ${fontWeight};
            transition: background 0.15s ease;
          ">
            <td style="padding: 8px 14px; text-align: left; vertical-align: middle; white-space: nowrap;">
              <span style="padding-left: ${indentPx}px; color: ${textColor};">
                ${row.item}
              </span>
            </td>
            <td style="padding: 8px 14px; text-align: right; font-family: ${fontMono}; color: ${textColor}; vertical-align: middle;">
              ${formatAccounting(row.actual)}
            </td>
            <td style="padding: 8px 14px; text-align: right; font-family: ${fontMono}; color: ${textSecondary}; vertical-align: middle;">
              ${formatAccounting(row.budget)}
            </td>
            <td style="padding: 8px 14px; text-align: right; font-family: ${fontMono}; color: ${textMuted}; vertical-align: middle;">
              ${formatAccounting(row.priorYear)}
            </td>
            <td style="padding: 8px 14px; text-align: right; font-family: ${fontMono}; color: ${deltaColor}; vertical-align: middle;">
              ${arrow}${deltaAbs.toLocaleString('fr-FR')} k€
            </td>
            <td style="padding: 8px 14px; text-align: right; font-family: ${fontMono}; color: ${deltaColor}; vertical-align: middle;">
              ${arrow}${deltaPct.toFixed(1)}%
            </td>
            <td style="padding: 6px 10px; text-align: center; vertical-align: middle;">
              ${generateIBCSVarianceBarSVG(deltaPct, row.metricType, 110, 16, tokens, isDark, isTufte)}
            </td>
          </tr>
        `;
      });

      html += `
            </tbody>
          </table>
        </div>
      `;

      container.innerHTML = html;
    }

    render();

    return {
      container,
      canvas: canvasElement,
      data,
      options: options || {},
      theme: themeName,
      destroy: () => {
        if (container) container.innerHTML = '';
        if (canvasElement) canvasElement.style.display = '';
      },
      update: (newData) => {
        if (newData) data = JSON.parse(JSON.stringify(newData));
        render();
      },
      setTheme: (newTheme) => {
        themeName = newTheme;
        render();
      },
      exportCSV: () => {
        const headers = ['Structure P&L', 'Réalisé', 'Budget', 'N-1', 'Var Abs', 'Var %'].join(';');
        const rows = data.rows.map(r => {
          const delta = r.actual - r.budget;
          const pct = r.budget !== 0 ? (delta / Math.abs(r.budget)) * 100 : 0;
          return [`"${r.item}"`, r.actual, r.budget, r.priorYear, delta, pct.toFixed(1)].join(';');
        }).join('\n');
        return `${headers}\n${rows}`;
      }
    };
  }

  const createChart = function(target, customData = null, themeName = DEFAULT_THEME, options = {}) {
    return createTable(target, customData, themeName, options);
  };

  const moduleExports = {
    DEFAULT_DATA,
    createTable,
    createChart,
    formatAccounting,
    generateIBCSVarianceBarSVG
  };

  moduleExports.default = moduleExports;
  return moduleExports;
});
