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
  const observeCompactWidth = (KitChartsTheme && KitChartsTheme.observeCompactWidth) || (typeof window !== 'undefined' && window.observeCompactWidth) || function() { return function() {}; };
  const escapeHtml = (KitChartsTheme && KitChartsTheme.escapeHtml) || (typeof window !== 'undefined' && window.escapeHtml) || function(v) { return String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); };
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
   * Mélange une couleur hex avec un fond hex (alpha 0..1) et renvoie un hex opaque.
   */
  function blendHex(fg, alpha, bg) {
    const parse = (h) => {
      let c = String(h || '').replace('#', '');
      if (c.length === 3) c = c.split('').map(x => x + x).join('');
      return /^[0-9a-fA-F]{6}$/.test(c) ? [0, 2, 4].map(i => parseInt(c.substr(i, 2), 16)) : null;
    };
    const f = parse(fg), b = parse(bg);
    if (!f || !b) return bg;
    return '#' + f.map((v, i) => Math.round(v * alpha + b[i] * (1 - alpha)).toString(16).padStart(2, '0')).join('');
  }

  /**
   * Ajuste une couleur de texte jusqu'à atteindre un contraste >= minRatio sur le fond (WCAG AA).
   * Éclaircit sur fond sombre, assombrit sur fond clair. Retourne la couleur d'origine si non-hex.
   */
  function readableOn(fg, bg, minRatio) {
    const min = minRatio || 4.5;
    const parse = (h) => {
      if (typeof h !== 'string') return null;
      let c = h.replace('#', '');
      if (c.length === 3) c = c.split('').map(x => x + x).join('');
      if (!/^[0-9a-fA-F]{6}$/.test(c)) return null;
      return [0, 2, 4].map(i => parseInt(c.substr(i, 2), 16));
    };
    const lum = (rgb) => {
      const a = rgb.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };
    const f = parse(fg);
    const b = parse(bg);
    if (!f || !b) return fg;
    const lb = lum(b);
    const towardWhite = lb < 0.3;
    const target = towardWhite ? 255 : 0;
    for (let t = 0; t <= 1.0001; t += 0.05) {
      const m = f.map(v => Math.round(v + (target - v) * t));
      const lf = lum(m);
      const ratio = (Math.max(lf, lb) + 0.05) / (Math.min(lf, lb) + 0.05);
      if (ratio >= min) return '#' + m.map(v => v.toString(16).padStart(2, '0')).join('');
    }
    return towardWhite ? '#FFFFFF' : '#000000';
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

    // Largeur de la zone : null tant qu'elle est inconnue (conteneur masqué)
    const measureCompact = () => {
      const w = container.clientWidth || (container.parentElement && container.parentElement.clientWidth) || 0;
      return w > 0 ? w < 460 : null;
    };

    function render() {
      if (!container) return;
      // Mode compact (zone < 460 px) : effectifs, dépenses et badge masqués (statut porté par la couleur du taux), retrait réduit
      const compact = measureCompact() === true;
      const hiddenKeys = compact ? ['headcount', 'spent', 'status'] : [];
      const cp = compact ? '7px 6px' : '9px 14px';

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
            min-width: ${compact ? 0 : 620}px;
            border-collapse: collapse;
            border-spacing: 0;
            font-size: ${compact ? '0.75rem' : '0.8125rem'};
            line-height: 1.4;
            font-variant-numeric: tabular-nums lining-nums;
            font-feature-settings: 'tnum' 1, 'lnum' 1;
          ">
            <thead>
              <tr style="
                background: ${bgHeader};
                border-bottom: 1.5px solid ${borderStrong};
              ">
      `;

      data.columns.filter(col => hiddenKeys.indexOf(col.key) < 0).forEach(col => {
        const shortLabels = { name: 'Équipe', budget: 'Budget', burnRate: 'Exécution' };
        html += `
          <th style="
            padding: ${compact ? '8px 6px' : '10px 14px'};
            text-align: ${escapeHtml(col.align)};
            font-weight: 600;
            font-size: ${compact ? '0.65rem' : '0.725rem'};
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: ${textSecondary};
            border: none;
            white-space: nowrap;
          ">
            ${escapeHtml(compact && shortLabels[col.key] ? shortLabels[col.key] : col.label)}
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
        const indentPx = row.level * (compact ? 12 : 22);

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
        const warnThreshold = typeof options.warningThreshold === 'number' ? options.warningThreshold : 95;
        const isWarning = burnRate >= warnThreshold && burnRate <= 100;

        // Statut TARGET_BASED : dans la cible = vert, tension = orange, dépassement = rouge (couleurs du thème)
        let statusBase = tokens.status?.success || '#2E7D32';
        let statusLabel = 'Maîtrisé';
        if (isOverBudget) {
          statusBase = tokens.status?.danger || '#C62828';
          statusLabel = 'Dépassement';
        } else if (isWarning) {
          statusBase = tokens.status?.warning || '#EF6C00';
          statusLabel = 'Sous tension';
        }
        const statusBgAlpha = isDark ? 0.25 : 0.14;
        const statusBg = blendHex(statusBase, statusBgAlpha, bgSurface);
        const statusColor = readableOn(statusBase, statusBg, 4.5);

        const chevron = row.hasChildren
          ? `<span class="kc-tree-toggle" data-node-id="${escapeHtml(row.id)}" style="
              display: inline-block;
              width: 16px;
              height: 16px;
              line-height: 16px;
              text-align: center;
              font-size: 0.65rem;
              margin-right: ${compact ? 2 : 6}px;
              cursor: pointer;
              user-select: none;
              color: ${primaryColor};
              font-weight: 700;
            ">${row.isExpanded ? '▼' : '▶'}</span>`
          : `<span style="display: inline-block; width: ${compact ? 18 : 22}px;"></span>`;

        html += `
          <tr class="kc-table-row" style="
            background: ${rowBg};
            border-bottom: ${borderBottom};
            font-weight: ${fontWeight};
            transition: background 0.15s ease;
          ">
            <td style="padding: ${cp}; text-align: left; vertical-align: middle; white-space: ${compact ? 'normal' : 'nowrap'};">
              <div style="padding-left: ${indentPx}px; display: flex; align-items: center;">
                ${chevron}
                <span style="color: ${textColor};">${escapeHtml(row.name)}</span>
              </div>
            </td>
            ${compact ? '' : `<td style="padding: ${cp}; text-align: right; font-family: ${fontMono}; color: ${textColor}; vertical-align: middle;">
              ${escapeHtml(row.headcount)} ETP
            </td>`}
            <td style="padding: ${cp}; text-align: right; font-family: ${fontMono}; color: ${textColor}; vertical-align: middle; white-space: nowrap;">
              ${(row.budget / 1000000).toFixed(2)} M€
            </td>
            ${compact ? '' : `<td style="padding: ${cp}; text-align: right; font-family: ${fontMono}; color: ${textColor}; vertical-align: middle;">
              ${(row.spent / 1000000).toFixed(2)} M€
            </td>`}
            <td style="padding: ${cp}; text-align: right; vertical-align: middle; white-space: nowrap;" title="${statusLabel}">
              <span style="
                font-family: ${fontMono};
                font-weight: ${isParent ? '700' : '600'};
                color: ${statusColor};
              ">
                ${burnRate.toFixed(1)}%
              </span>
            </td>
            ${compact ? '' : `<td style="padding: ${cp}; text-align: center; vertical-align: middle;">
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
            </td>`}
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
                <td style="padding: ${compact ? '8px 6px' : '11px 14px'}; text-align: left; color: ${textPrimary};">
                  ${compact ? 'TOTAL' : 'TOTAL ORGANISATION'}
                </td>
                ${compact ? '' : `<td style="padding: 11px 14px; text-align: right; font-family: ${fontMono}; color: ${textPrimary};">
                  ${escapeHtml(totalHeadcount)} ETP
                </td>`}
                <td style="padding: ${compact ? '8px 6px' : '11px 14px'}; text-align: right; font-family: ${fontMono}; color: ${textPrimary}; white-space: nowrap;">
                  ${(totalBudget / 1000000).toFixed(2)} M€
                </td>
                ${compact ? '' : `<td style="padding: 11px 14px; text-align: right; font-family: ${fontMono}; color: ${textPrimary};">
                  ${(totalSpent / 1000000).toFixed(2)} M€
                </td>`}
                <td style="padding: ${compact ? '8px 6px' : '11px 14px'}; text-align: right; font-family: ${fontMono}; color: ${readableOn(grandBurnRate <= 100 ? (tokens.status?.success || '#2E7D32') : (tokens.status?.danger || '#C62828'), bgSurface, 4.5)};">
                  ${grandBurnRate.toFixed(1)}%
                </td>
                ${compact ? '' : `<td style="padding: 11px 14px; text-align: center; color: ${textPrimary}; font-size: 0.725rem;">
                  100% Alloué
                </td>`}
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
    // Mode compact recalculé quand le conteneur change de largeur, pas seulement à la création
    const stopObserving = observeCompactWidth(container, measureCompact, measureCompact() === true, () => render());

    return {
      container,
      canvas: canvasElement,
      data,
      options: options || {},
      theme: themeName,
      destroy: () => {
        stopObserving();
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
