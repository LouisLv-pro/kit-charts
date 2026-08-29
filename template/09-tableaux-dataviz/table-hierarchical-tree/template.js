/**
 * @file template/09-tableaux-dataviz/table-hierarchical-tree/template.js
 * @description Standardized Universal table-hierarchical-tree Template for kit-charts.
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
    global.KitCharts['table-hierarchical-tree'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  /**
   * Données par défaut représentatives : Structure budgétaire et allocation des effectifs par département
   */
  const DEFAULT_DATA = {
    title: 'Budget Opérationnel & Allocation des Ressources par Organisation',
    subtitle: 'Arborescence interactive multi-niveaux avec sous-totaux et taux d\'exécution',
    columns: [
      { key: 'name', label: 'Département / Équipe', align: 'left' },
      { key: 'headcount', label: 'Effectifs (ETP)', align: 'right', format: 'number' },
      { key: 'budget', label: 'Budget Alloué', align: 'right', format: 'currency' },
      { key: 'spent', label: 'Dépenses Réalisées', align: 'right', format: 'currency' },
      { key: 'burnRate', label: 'Taux d\'Exécution', align: 'right', format: 'percent' },
      { key: 'status', label: 'Statut Budget', align: 'center', format: 'badge' }
    ],
    items: [
      {
        id: 'eng',
        name: 'Ingénierie & R&D',
        level: 0,
        expanded: true,
        headcount: 85,
        budget: 9500000,
        spent: 8900000,
        children: [
          {
            id: 'eng-core',
            name: 'Core Platform & Infrastructure',
            level: 1,
            expanded: true,
            headcount: 32,
            budget: 3800000,
            spent: 3650000,
            children: [
              { id: 'eng-core-cloud', name: 'Cloud Architecture & SRE', level: 2, headcount: 14, budget: 1800000, spent: 1750000 },
              { id: 'eng-core-sec', name: 'Security & Compliance', level: 2, headcount: 8, budget: 1100000, spent: 1050000 },
              { id: 'eng-core-db', name: 'Data Pipeline & Storage', level: 2, headcount: 10, budget: 900000, spent: 850000 }
            ]
          },
          {
            id: 'eng-app',
            name: 'Applications & Produits Web',
            level: 1,
            expanded: true,
            headcount: 38,
            budget: 4200000,
            spent: 3950000,
            children: [
              { id: 'eng-app-front', name: 'Frontend & Design System', level: 2, headcount: 18, budget: 2000000, spent: 1900000 },
              { id: 'eng-app-api', name: 'Microservices & API Gateway', level: 2, headcount: 20, budget: 2200000, spent: 2050000 }
            ]
          },
          {
            id: 'eng-ai',
            name: 'Intelligence Artificielle & ML',
            level: 1,
            expanded: false,
            headcount: 15,
            budget: 1500000,
            spent: 1300000,
            children: [
              { id: 'eng-ai-models', name: 'LLM Fine-tuning & Agents', level: 2, headcount: 9, budget: 950000, spent: 820000 },
              { id: 'eng-ai-ops', name: 'MLOps & Inference Cluster', level: 2, headcount: 6, budget: 550000, spent: 480000 }
            ]
          }
        ]
      },
      {
        id: 'sales',
        name: 'Ventes & Développement Commercial',
        level: 0,
        expanded: true,
        headcount: 54,
        budget: 6800000,
        spent: 6650000,
        children: [
          {
            id: 'sales-ent',
            name: 'Grands Comptes (Enterprise)',
            level: 1,
            expanded: false,
            headcount: 28,
            budget: 3900000,
            spent: 3850000,
            children: [
              { id: 'sales-ent-emea', name: 'EMEA Enterprise', level: 2, headcount: 16, budget: 2300000, spent: 2280000 },
              { id: 'sales-ent-us', name: 'North America Enterprise', level: 2, headcount: 12, budget: 1600000, spent: 1570000 }
            ]
          },
          {
            id: 'sales-mid',
            name: 'Mid-Market & SMB',
            level: 1,
            expanded: false,
            headcount: 26,
            budget: 2900000,
            spent: 2800000,
            children: [
              { id: 'sales-mid-inbound', name: 'Inbound Sales', level: 2, headcount: 14, budget: 1500000, spent: 1460000 },
              { id: 'sales-mid-outbound', name: 'Outbound SDRs', level: 2, headcount: 12, budget: 1400000, spent: 1340000 }
            ]
          }
        ]
      },
      {
        id: 'mkt',
        name: 'Marketing & Communication',
        level: 0,
        expanded: false,
        headcount: 22,
        budget: 3200000,
        spent: 3100000,
        children: [
          { id: 'mkt-growth', name: 'Growth & Acquisition Numérique', level: 1, headcount: 12, budget: 1900000, spent: 1850000 },
          { id: 'mkt-brand', name: 'Marque, Événements & RP', level: 1, headcount: 10, budget: 1300000, spent: 1250000 }
        ]
      }
    ]
  };

  /**
   * Aplati la structure arborescente en respectant l'état d'expansion de chaque nœud
   */
  function flattenTree(items, expandedStateMap) {
    let result = [];
    function traverse(nodeList) {
      nodeList.forEach(node => {
        const isExpanded = expandedStateMap[node.id] !== undefined ? expandedStateMap[node.id] : Boolean(node.expanded);
        result.push({ ...node, isExpanded, hasChildren: Boolean(node.children && node.children.length > 0) });
        if (node.children && node.children.length > 0 && isExpanded) {
          traverse(node.children);
        }
      });
    }
    traverse(items);
    return result;
  }

  /**
   * Crée et initialise un Tableau Hiérarchique & Arborescent
   *
   * @param {string|HTMLElement} target - ID ou élément DOM cible
   * @param {Object} [customData=null] - Jeu de données
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
        toggleAll: () => {},
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
    let expandedStateMap = {};

    // Initialiser l'état d'expansion
    function initExpanded(items) {
      items.forEach(item => {
        if (item.expanded !== undefined) {
          expandedStateMap[item.id] = item.expanded;
        }
        if (item.children) initExpanded(item.children);
      });
    }
    initExpanded(data.items);

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

      const flatRows = flattenTree(data.items, expandedStateMap);

      // Calcul des totaux globaux
      let totalHeadcount = 0;
      let totalBudget = 0;
      let totalSpent = 0;
      data.items.forEach(topItem => {
        totalHeadcount += topItem.headcount || 0;
        totalBudget += topItem.budget || 0;
        totalSpent += topItem.spent || 0;
      });
      const grandBurnRate = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

      let html = `
        <div class="kc-dataviz-tree-container" style="
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

      flatRows.forEach((row, idx) => {
        const isParent = row.level === 0;
        const isSubParent = row.level === 1;
        const indentPx = row.level * 22;

        let rowBg = 'transparent';
        if (isParent) {
          rowBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.03)';
        } else if (isSubParent) {
          rowBg = isDark ? 'rgba(255,255,255,0.015)' : 'rgba(15,23,42,0.01)';
        }

        const fontWeight = isParent ? '700' : (isSubParent ? '600' : '400');
        const textColor = isParent ? textPrimary : (isSubParent ? textPrimary : textSecondary);
        const borderBottom = idx === flatRows.length - 1 ? 'none' : `1px solid ${borderCol}`;

        const burnRate = row.budget > 0 ? (row.spent / row.budget) * 100 : 0;
        const isOverBudget = burnRate > 100;
        const isWarning = burnRate >= 95 && burnRate <= 100;

        let statusBg = isDark ? 'rgba(46, 125, 50, 0.2)' : 'rgba(46, 125, 50, 0.12)';
        let statusColor = isDark ? '#81C784' : '#2E7D32';
        let statusLabel = 'Maîtrisé';

        if (isOverBudget) {
          statusBg = isDark ? 'rgba(198, 40, 40, 0.25)' : 'rgba(198, 40, 40, 0.12)';
          statusColor = isDark ? '#E57373' : '#C62828';
          statusLabel = 'Dépassement';
        } else if (isWarning) {
          statusBg = isDark ? 'rgba(239, 108, 0, 0.25)' : 'rgba(239, 108, 0, 0.12)';
          statusColor = isDark ? '#FFB74D' : '#D97706';
          statusLabel = 'Sous tension';
        }

        const chevron = row.hasChildren
          ? `<span class="kc-tree-toggle" data-node-id="${row.id}" style="
              display: inline-block;
              width: 16px;
              height: 16px;
              line-height: 16px;
              text-align: center;
              font-size: 0.65rem;
              margin-right: 6px;
              cursor: pointer;
              user-select: none;
              color: ${primaryColor};
              font-weight: 700;
            ">${row.isExpanded ? '▼' : '▶'}</span>`
          : `<span style="display: inline-block; width: 22px;"></span>`;

        html += `
          <tr class="kc-table-row" style="
            background: ${rowBg};
            border-bottom: ${borderBottom};
            font-weight: ${fontWeight};
            transition: background 0.15s ease;
          ">
            <td style="padding: 9px 14px; text-align: left; vertical-align: middle; white-space: nowrap;">
              <div style="padding-left: ${indentPx}px; display: flex; align-items: center;">
                ${chevron}
                <span style="color: ${textColor};">${row.name}</span>
              </div>
            </td>
            <td style="padding: 9px 14px; text-align: right; font-family: ${fontMono}; color: ${textColor}; vertical-align: middle;">
              ${row.headcount} ETP
            </td>
            <td style="padding: 9px 14px; text-align: right; font-family: ${fontMono}; color: ${textColor}; vertical-align: middle;">
              ${(row.budget / 1000000).toFixed(2)} M€
            </td>
            <td style="padding: 9px 14px; text-align: right; font-family: ${fontMono}; color: ${textColor}; vertical-align: middle;">
              ${(row.spent / 1000000).toFixed(2)} M€
            </td>
            <td style="padding: 9px 14px; text-align: right; vertical-align: middle;">
              <span style="
                font-family: ${fontMono};
                font-weight: ${isParent ? '700' : '600'};
                color: ${statusColor};
              ">
                ${burnRate.toFixed(1)}%
              </span>
            </td>
            <td style="padding: 9px 14px; text-align: center; vertical-align: middle;">
              <span style="
                display: inline-block;
                padding: 2px 7px;
                border-radius: ${isTufte ? '0' : '4px'};
                font-size: 0.7rem;
                font-weight: 600;
                background: ${statusBg};
                color: ${statusColor};
                border: ${isTufte ? `1px solid ${statusColor}` : 'none'};
                white-space: nowrap;
              ">${statusLabel}</span>
            </td>
          </tr>
        `;
      });

      // Ligne Totaux
      html += `
              <tr style="
                border-top: 2px solid ${borderStrong};
                background: ${bgHeader};
                font-weight: 700;
              ">
                <td style="padding: 11px 14px; text-align: left; color: ${textPrimary};">
                  TOTAL ORGANISATION
                </td>
                <td style="padding: 11px 14px; text-align: right; font-family: ${fontMono}; color: ${textPrimary};">
                  ${totalHeadcount} ETP
                </td>
                <td style="padding: 11px 14px; text-align: right; font-family: ${fontMono}; color: ${textPrimary};">
                  ${(totalBudget / 1000000).toFixed(2)} M€
                </td>
                <td style="padding: 11px 14px; text-align: right; font-family: ${fontMono}; color: ${textPrimary};">
                  ${(totalSpent / 1000000).toFixed(2)} M€
                </td>
                <td style="padding: 11px 14px; text-align: right; font-family: ${fontMono}; color: ${grandBurnRate <= 100 ? (tokens.status?.success || '#2E7D32') : (tokens.status?.danger || '#C62828')};">
                  ${grandBurnRate.toFixed(1)}%
                </td>
                <td style="padding: 11px 14px; text-align: center; color: ${textPrimary}; font-size: 0.725rem;">
                  100% Alloué
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      `;

      container.innerHTML = html;

      // Attacher les écouteurs de clic sur les toggles d'arborescence
      const toggles = container.querySelectorAll('.kc-tree-toggle');
      toggles.forEach(t => {
        t.addEventListener('click', (e) => {
          e.stopPropagation();
          const nodeId = t.getAttribute('data-node-id');
          expandedStateMap[nodeId] = !expandedStateMap[nodeId];
          render();
        });
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
      toggleAll: (expand = true) => {
        function setAll(items) {
          items.forEach(i => {
            expandedStateMap[i.id] = expand;
            if (i.children) setAll(i.children);
          });
        }
        setAll(data.items);
        render();
      },
      exportCSV: () => {
        const rows = flattenTree(data.items, expandedStateMap);
        const headers = ['Nom', 'Niveau', 'Effectifs', 'Budget', 'Dépenses'].join(';');
        const body = rows.map(r => [`"${'  '.repeat(r.level) + r.name}"`, r.level, r.headcount, r.budget, r.spent].join(';')).join('\n');
        return `${headers}\n${body}`;
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
    renderTable: createTable,
    flattenTree
  };

  moduleExports.default = moduleExports;
  return moduleExports;
});
