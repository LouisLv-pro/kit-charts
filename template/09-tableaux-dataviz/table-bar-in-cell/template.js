/**
 * @file template/09-tableaux-dataviz/table-bar-in-cell/template.js
 * @description Standardized Universal table-bar-in-cell Template for kit-charts.
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
    global.KitCharts['table-bar-in-cell'] = exp;
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
   * Données par défaut représentatives : Tableau comparatif des lignes de produits et performance vs objectifs
   */
  const DEFAULT_DATA = {
    title: 'Benchmark des Lignes de Produits — Chiffre d\'Affaires & Taux d\'Atteinte',
    subtitle: 'Micro-barres proportionnelles 1D et mini bullet graphs Stephen Few',
    columns: [
      { key: 'product', label: 'Gamme de Produit', align: 'left', sortable: true },
      { key: 'category', label: 'Division', align: 'center', sortable: true },
      { key: 'revenue', label: 'Chiffre d\'Affaires', align: 'right', sortable: true, format: 'bar_in_cell' },
      { key: 'volume', label: 'Volume Ventes', align: 'right', sortable: true, format: 'number' },
      { key: 'bullet', label: 'Réalisé vs Objectif (Bullet)', align: 'left', sortable: true, format: 'bullet' },
      { key: 'completion', label: 'Atteinte', align: 'right', sortable: true, format: 'percent' }
    ],
    rows: [
      { product: 'Enterprise Cloud Platform', category: 'SaaS B2B', revenue: 4850000, maxRevenue: 5000000, volume: 1420, actualRate: 97, targetRate: 90, unit: ' €' },
      { product: 'Cybersecurity Suite X', category: 'Sécurité', revenue: 3920000, maxRevenue: 5000000, volume: 2150, actualRate: 108, targetRate: 100, unit: ' €' },
      { product: 'AI Analytics Engine Pro', category: 'Data & IA', revenue: 3450000, maxRevenue: 5000000, volume: 980, actualRate: 115, targetRate: 100, unit: ' €' },
      { product: 'Workflow Automation Hub', category: 'Productivité', revenue: 2780000, maxRevenue: 5000000, volume: 3400, actualRate: 92, targetRate: 95, unit: ' €' },
      { product: 'Identity Access Manager', category: 'Sécurité', revenue: 2150000, maxRevenue: 5000000, volume: 1890, actualRate: 86, targetRate: 90, unit: ' €' },
      { product: 'Customer Data Platform', category: 'Data & IA', revenue: 1940000, maxRevenue: 5000000, volume: 760, actualRate: 102, targetRate: 100, unit: ' €' },
      { product: 'DevOps CI/CD Pipeline', category: 'Infrastructure', revenue: 1620000, maxRevenue: 5000000, volume: 1240, actualRate: 81, targetRate: 85, unit: ' €' }
    ]
  };

  /**
   * Génère une micro-barre horizontale proportionnelle SVG intégrée dans la cellule
   */
  function generateDataBarSVG(value, maxValue, width = 120, height = 14, color = '#2B8CBE', isDark = false, isTufte = false) {
    const ratio = Math.max(0, Math.min(1, value / maxValue));
    const barWidth = Math.max(2, ratio * width).toFixed(1);
    const bgTrack = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.05)';

    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="display:inline-block; vertical-align:middle; margin-right:8px;" aria-hidden="true">
        <rect x="0" y="1" width="${width}" height="${height - 2}" rx="${isTufte ? 0 : 3}" fill="${bgTrack}" />
        <rect x="0" y="1" width="${barWidth}" height="${height - 2}" rx="${isTufte ? 0 : 3}" fill="${color}" />
      </svg>
    `;
  }

  /**
   * Génère un mini Bullet Graph Stephen Few (Réalisé + Marqueur Cible + Plages)
   */
  function generateBulletGraphSVG(actual, target, width = 130, height = 18, color = '#2B8CBE', isDark = false, isTufte = false) {
    const maxScale = 125; // 0 à 125%
    const actualWidth = Math.max(2, Math.min(width, (actual / maxScale) * width)).toFixed(1);
    const targetX = Math.min(width - 2, Math.max(2, (target / maxScale) * width)).toFixed(1);

    // Plages qualitatives en niveaux de gris discrets
    const poorW = (60 / maxScale) * width;
    const satisfactoryW = (90 / maxScale) * width;
    const targetColor = isDark ? '#ECEFF4' : '#0F172A';

    const bg1 = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.04)';
    const bg2 = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)';
    const bg3 = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';

    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="display:inline-block; vertical-align:middle;" aria-label="Réalisé: ${actual}%, Cible: ${target}%">
        <title>Réalisé: ${actual}%, Cible: ${target}%</title>
        <!-- Plages de fond Stephen Few -->
        <rect x="0" y="2" width="${width}" height="${height - 4}" fill="${bg1}" rx="${isTufte ? 0 : 2}" />
        <rect x="0" y="2" width="${satisfactoryW.toFixed(1)}" height="${height - 4}" fill="${bg2}" />
        <rect x="0" y="2" width="${poorW.toFixed(1)}" height="${height - 4}" fill="${bg3}" />
        <!-- Barre de performance réalisée -->
        <rect x="0" y="5" width="${actualWidth}" height="${height - 10}" fill="${color}" rx="${isTufte ? 0 : 1}" />
        <!-- Marqueur cible vertical -->
        <line x1="${targetX}" y1="1" x2="${targetX}" y2="${height - 1}" stroke="${targetColor}" stroke-width="2.5" stroke-linecap="butt" />
      </svg>
    `;
  }

  /**
   * Crée et initialise un Tableau Comparatif avec Barres Intégrées
   *
   * @param {string|HTMLElement} target - ID ou élément DOM cible
   * @param {Object} [customData=null] - Jeu de données optionnel
   * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème
   * @param {Object} [options={}] - Options de configuration
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
        sort: () => {},
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
    let sortColumn = options.sortColumn || 'revenue';
    let sortDirection = options.sortDirection || 'desc';

    function render() {
      if (!container) return;

      const primaryColor = getColor(tokens, 0);
      const bgSurface = tokens.surface || (isDark ? '#242933' : '#FFFFFF');
      const bgHeader = isDark ? '#1F232B' : (isTufte ? '#FFFFFF' : '#F8FAFC');
      const borderCol = tokens.border || (isDark ? '#4C566A' : '#E2E8F0');
      const borderStrong = tokens.borderStrong || (isDark ? '#5E81AC' : '#CBD5E1');
      const textPrimary = tokens.textPrimary || (isDark ? '#ECEFF4' : '#0F172A');
      const textSecondary = tokens.textSecondary || (isDark ? '#D8DEE9' : '#475569');
      const textMuted = tokens.textMuted || (isDark ? '#9EABC0' : '#64748B');
      const fontSans = tokens.fontFamily || "'Inter', sans-serif";
      const fontMono = tokens.fontMono || "'JetBrains Mono', monospace";

      // Calcul du maximum absolu pour calibrer l'échelle de toutes les barres de la colonne
      const maxRevenueCol = Math.max(...data.rows.map(r => r.revenue || 0));

      // Tri des lignes
      let displayRows = [...data.rows];
      if (sortColumn) {
        displayRows.sort((a, b) => {
          let valA = a[sortColumn];
          let valB = b[sortColumn];
          if (sortColumn === 'bullet') {
            valA = a.actualRate;
            valB = b.actualRate;
          }
          if (typeof valA === 'string') valA = valA.toLowerCase();
          if (typeof valB === 'string') valB = valB.toLowerCase();
          if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
          if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
          return 0;
        });
      }

      let html = `
        <div class="kc-dataviz-barincell-container" style="
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
        const isSorted = sortColumn === col.key;
        const sortIcon = isSorted ? (sortDirection === 'asc' ? ' ▲' : ' ▼') : '';
        const cursor = col.sortable ? 'cursor: pointer; user-select: none;' : '';
        html += `
          <th data-key="${col.key}" style="
            padding: 10px 14px;
            text-align: ${col.align};
            font-weight: 600;
            font-size: 0.725rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: ${isSorted ? primaryColor : textSecondary};
            border: none;
            white-space: nowrap;
            ${cursor}
          " title="${col.sortable ? 'Cliquer pour trier' : ''}">
            ${col.label}${sortIcon}
          </th>
        `;
      });

      html += `
              </tr>
            </thead>
            <tbody>
      `;

      displayRows.forEach((row, idx) => {
        const rowBg = isTufte
          ? 'transparent'
          : (idx % 2 === 1 ? (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(15,23,42,0.015)') : 'transparent');
        const borderBottom = idx === displayRows.length - 1 ? 'none' : `1px solid ${borderCol}`;

        const isOverTarget = row.actualRate >= row.targetRate;
        const bulletColor = isOverTarget
          ? (tokens.status?.success || '#2E7D32')
          : (tokens.status?.warning || '#D97706');

        html += `
          <tr class="kc-table-row" style="
            background: ${rowBg};
            border-bottom: ${borderBottom};
            transition: background 0.15s ease;
          ">
            <td style="padding: 10px 14px; text-align: left; vertical-align: middle;">
              <div style="font-weight: 600; color: ${textPrimary};">${row.product}</div>
            </td>
            <td style="padding: 10px 14px; text-align: center; vertical-align: middle;">
              <span style="
                display: inline-block;
                padding: 2px 7px;
                border-radius: 9999px;
                font-size: 0.7rem;
                font-weight: 500;
                background: ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.05)'};
                color: ${textSecondary};
              ">${row.category}</span>
            </td>
            <td style="padding: 10px 14px; text-align: right; vertical-align: middle; white-space: nowrap;">
              <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
                ${generateDataBarSVG(row.revenue, maxRevenueCol, 95, 14, primaryColor, isDark, isTufte)}
                <span style="font-family: ${fontMono}; font-weight: 600; color: ${textPrimary};">
                  ${(row.revenue / 1000000).toFixed(2)} M€
                </span>
              </div>
            </td>
            <td style="padding: 10px 14px; text-align: right; font-family: ${fontMono}; color: ${textSecondary}; vertical-align: middle;">
              ${row.volume.toLocaleString('fr-FR')}
            </td>
            <td style="padding: 10px 14px; text-align: left; vertical-align: middle; white-space: nowrap;">
              <div style="display: flex; align-items: center; gap: 8px;">
                ${generateBulletGraphSVG(row.actualRate, row.targetRate, 110, 16, bulletColor, isDark, isTufte)}
                <span style="font-size: 0.7rem; color: ${textMuted}; font-family: ${fontMono};">
                  Cible: ${row.targetRate}%
                </span>
              </div>
            </td>
            <td style="padding: 10px 14px; text-align: right; vertical-align: middle;">
              <span style="
                font-family: ${fontMono};
                font-weight: 700;
                font-size: 0.8125rem;
                color: ${bulletColor};
              ">
                ${row.actualRate}%
              </span>
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

      // Écouteurs de tri
      const headers = container.querySelectorAll('th[data-key]');
      headers.forEach(th => {
        const key = th.getAttribute('data-key');
        const colDef = data.columns.find(c => c.key === key);
        if (colDef && colDef.sortable) {
          th.addEventListener('click', () => {
            if (sortColumn === key) {
              sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
              sortColumn = key;
              sortDirection = 'desc';
            }
            render();
          });
        }
      });
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
      sort: (key, direction = 'desc') => {
        sortColumn = key;
        sortDirection = direction;
        render();
      },
      exportCSV: () => {
        const headers = data.columns.map(c => `"${c.label}"`).join(';');
        const rows = data.rows.map(r => [
          `"${r.product}"`,
          `"${r.category}"`,
          r.revenue,
          r.volume,
          r.actualRate,
          r.targetRate
        ].join(';')).join('\n');
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
    generateDataBarSVG,
    generateBulletGraphSVG
  };

  moduleExports.default = moduleExports;
  return moduleExports;
});
