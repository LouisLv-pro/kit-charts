/**
 * @file template/09-tableaux-dataviz/table-ranking-leaderboard/template.js
 * @description Standardized Universal table-ranking-leaderboard Template for kit-charts.
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
    global.KitCharts['table-ranking-leaderboard'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  /**
   * Données par défaut représentatives : Classement de performance des équipes commerciales & scoring global
   */
  const DEFAULT_DATA = {
    title: 'Classement de la Performance Commerciale — Leaderboard Trimestriel',
    subtitle: 'Classement ordonné par score global, progression de rang et dynamique sur 6 mois',
    columns: [
      { key: 'rank', label: 'Rang', align: 'center', sortable: true },
      { key: 'trendRank', label: 'Progression', align: 'center', sortable: true },
      { key: 'team', label: 'Équipe Commerciale', align: 'left', sortable: true },
      { key: 'region', label: 'Région', align: 'center', sortable: true },
      { key: 'score', label: 'Score Global (Base 100)', align: 'right', sortable: true, format: 'score_bar' },
      { key: 'deals', label: 'Contrats Signés', align: 'right', sortable: true, format: 'number' },
      { key: 'conversion', label: 'Taux Conv.', align: 'right', sortable: true, format: 'percent' },
      { key: 'monthlyActivity', label: 'Activité 6M', align: 'center', sortable: false, format: 'sparkbar' }
    ],
    rows: [
      { rank: 1, prevRank: 2, team: 'Équipe Alpha Grands Comptes', leader: 'Sophie Martin', region: 'EMEA', score: 98.4, deals: 42, conversion: 34.2, activity: [18, 22, 25, 28, 35, 42] },
      { rank: 2, prevRank: 1, team: 'Division Fintech & Banking', leader: 'Marc Dupont', region: 'US East', score: 95.1, deals: 39, conversion: 31.8, activity: [24, 28, 32, 36, 38, 39] },
      { rank: 3, prevRank: 4, team: 'Pôle Retail & E-Commerce', leader: 'Camille Leroy', region: 'Europe Ouest', score: 91.8, deals: 36, conversion: 29.5, activity: [15, 19, 24, 28, 30, 36] },
      { rank: 4, prevRank: 3, team: 'Équipe Santé & Pharma', leader: 'Alexandre Roux', region: 'France', score: 86.2, deals: 29, conversion: 27.0, activity: [22, 25, 27, 28, 29, 29] },
      { rank: 5, prevRank: 7, team: 'SaaS & Scale-ups', leader: 'Elena Rossi', region: 'DACH', score: 82.5, deals: 31, conversion: 25.4, activity: [12, 16, 20, 24, 28, 31] },
      { rank: 6, prevRank: 5, team: 'Secteur Public & Éducation', leader: 'Thomas Bernard', region: 'France', score: 79.3, deals: 24, conversion: 22.8, activity: [18, 20, 22, 23, 25, 24] },
      { rank: 7, prevRank: 6, team: 'Industrie & Manufacturing', leader: 'David Chen', region: 'APAC', score: 74.6, deals: 21, conversion: 21.0, activity: [16, 17, 19, 20, 22, 21] },
      { rank: 8, prevRank: 8, team: 'Mid-Market Emerging', leader: 'Inès Dubois', region: 'Nordics', score: 68.0, deals: 18, conversion: 18.5, activity: [10, 12, 14, 15, 16, 18] }
    ]
  };

  /**
   * Génère une micro-jauge de score proportionnelle à la première place
   */
  function generateScoreBarSVG(score, maxScore = 100, width = 100, height = 12, color = '#2B8CBE', isDark = false, isTufte = false) {
    const ratio = Math.max(0, Math.min(1, score / maxScore));
    const barWidth = Math.max(2, ratio * width).toFixed(1);
    const bgTrack = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.05)';

    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="display:inline-block; vertical-align:middle; margin-right:6px;" aria-hidden="true">
        <rect x="0" y="1" width="${width}" height="${height - 2}" rx="${isTufte ? 0 : 3}" fill="${bgTrack}" />
        <rect x="0" y="1" width="${barWidth}" height="${height - 2}" rx="${isTufte ? 0 : 3}" fill="${color}" />
      </svg>
    `;
  }

  /**
   * Génère une micro sparkbar mensuelle d'activité SVG (6 barres verticales)
   */
  function generateSparkbarSVG(values, width = 72, height = 22, baseColor = '#94A3B8', focalColor = '#2B8CBE', isTufte = false) {
    if (!values || values.length === 0) return '';
    const max = Math.max(...values, 1);
    const count = values.length;
    const barWidth = 7;
    const gap = 4;
    const totalW = count * barWidth + (count - 1) * gap;

    const bars = values.map((val, idx) => {
      const isLast = idx === count - 1;
      const h = Math.max(2, (val / max) * (height - 4));
      const x = idx * (barWidth + gap);
      const y = height - h;
      const color = isLast ? focalColor : baseColor;
      return `<rect x="${x}" y="${y.toFixed(1)}" width="${barWidth}" height="${h.toFixed(1)}" rx="${isTufte ? 0 : 1.5}" fill="${color}" opacity="${isLast ? '1' : '0.65'}"><title>Mois ${idx + 1}: ${val}</title></rect>`;
    });

    return `
      <svg width="${totalW}" height="${height}" viewBox="0 0 ${totalW} ${height}" style="display:block; margin:0 auto;" aria-hidden="true">
        ${bars.join('')}
      </svg>
    `;
  }

  /**
   * Crée et initialise un Tableau de Classement Leaderboard
   *
   * @param {string|HTMLElement} target - ID ou élément DOM cible
   * @param {Object} [customData=null] - Données personnalisées
   * @param {string} [themeName='colorbrewer-accessible'] - Nom du thème
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
    let sortColumn = options.sortColumn || 'rank';
    let sortDirection = options.sortDirection || 'asc';

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

      // Tri des lignes
      let displayRows = [...data.rows];
      if (sortColumn) {
        displayRows.sort((a, b) => {
          let valA = a[sortColumn];
          let valB = b[sortColumn];
          if (sortColumn === 'trendRank') {
            valA = (a.prevRank || a.rank) - a.rank;
            valB = (b.prevRank || b.rank) - b.rank;
          }
          if (typeof valA === 'string') valA = valA.toLowerCase();
          if (typeof valB === 'string') valB = valB.toLowerCase();
          if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
          if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
          return 0;
        });
      }

      let html = `
        <div class="kc-dataviz-leaderboard-container" style="
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

        // Badge de Podium (Rang 1 Or, Rang 2 Argent, Rang 3 Bronze)
        let rankBadge = '';
        if (row.rank === 1) {
          rankBadge = `<span style="
            display: inline-flex; align-items: center; justify-content: center;
            width: 24px; height: 24px; border-radius: 50%;
            background: #FEF3C7; color: #92400E; font-weight: 700; font-size: 0.75rem;
            box-shadow: 0 1px 3px rgba(180, 83, 9, 0.2);
          ">1</span>`;
        } else if (row.rank === 2) {
          rankBadge = `<span style="
            display: inline-flex; align-items: center; justify-content: center;
            width: 24px; height: 24px; border-radius: 50%;
            background: #E2E8F0; color: #334155; font-weight: 700; font-size: 0.75rem;
          ">2</span>`;
        } else if (row.rank === 3) {
          rankBadge = `<span style="
            display: inline-flex; align-items: center; justify-content: center;
            width: 24px; height: 24px; border-radius: 50%;
            background: #FFEDD5; color: #9A3412; font-weight: 700; font-size: 0.75rem;
          ">3</span>`;
        } else {
          rankBadge = `<span style="font-family: ${fontMono}; font-weight: 600; color: ${textMuted};">${row.rank}</span>`;
        }

        // Évolution de position
        const deltaRank = (row.prevRank || row.rank) - row.rank;
        let trendHtml = `<span style="color: ${textMuted}; font-size: 0.75rem;">=</span>`;
        if (deltaRank > 0) {
          trendHtml = `<span style="color: ${tokens.status?.success || '#2E7D32'}; font-weight: 700; font-size: 0.75rem;">▲ +${deltaRank}</span>`;
        } else if (deltaRank < 0) {
          trendHtml = `<span style="color: ${tokens.status?.danger || '#C62828'}; font-weight: 700; font-size: 0.75rem;">▼ ${deltaRank}</span>`;
        }

        html += `
          <tr class="kc-table-row" style="
            background: ${rowBg};
            border-bottom: ${borderBottom};
            transition: background 0.15s ease;
          ">
            <td style="padding: 10px 14px; text-align: center; vertical-align: middle;">
              ${rankBadge}
            </td>
            <td style="padding: 10px 14px; text-align: center; vertical-align: middle;">
              ${trendHtml}
            </td>
            <td style="padding: 10px 14px; text-align: left; vertical-align: middle;">
              <div style="font-weight: 600; color: ${textPrimary};">${row.team}</div>
              ${row.leader ? `<div style="font-size: 0.7rem; color: ${textMuted};">Lead: ${row.leader}</div>` : ''}
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
              ">${row.region}</span>
            </td>
            <td style="padding: 10px 14px; text-align: right; vertical-align: middle; white-space: nowrap;">
              <div style="display: flex; align-items: center; justify-content: flex-end;">
                ${generateScoreBarSVG(row.score, 100, 75, 12, primaryColor, isDark, isTufte)}
                <span style="font-family: ${fontMono}; font-weight: 700; color: ${textPrimary}; width: 38px; text-align: right;">
                  ${row.score.toFixed(1)}
                </span>
              </div>
            </td>
            <td style="padding: 10px 14px; text-align: right; font-family: ${fontMono}; color: ${textPrimary}; vertical-align: middle;">
              ${row.deals}
            </td>
            <td style="padding: 10px 14px; text-align: right; font-family: ${fontMono}; color: ${textSecondary}; vertical-align: middle;">
              ${row.conversion.toFixed(1)}%
            </td>
            <td style="padding: 6px 10px; text-align: center; vertical-align: middle;">
              ${generateSparkbarSVG(row.activity, 72, 22, textMuted, primaryColor, isTufte)}
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
              sortDirection = key === 'rank' ? 'asc' : 'desc';
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
      sort: (key, direction = 'asc') => {
        sortColumn = key;
        sortDirection = direction;
        render();
      },
      exportCSV: () => {
        const headers = data.columns.map(c => `"${c.label}"`).join(';');
        const rows = data.rows.map(r => [
          r.rank,
          (r.prevRank || r.rank) - r.rank,
          `"${r.team}"`,
          `"${r.region}"`,
          r.score,
          r.deals,
          r.conversion
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
    generateScoreBarSVG,
    generateSparkbarSVG
  };

  moduleExports.default = moduleExports;
  return moduleExports;
});
