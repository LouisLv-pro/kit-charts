/**
 * @file template/09-tableaux-dataviz/table-kpi-scorecard/template.js
 * @description Standardized Universal table-kpi-scorecard Template for kit-charts.
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
    global.KitCharts['table-kpi-scorecard'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const escapeHtml = (KitChartsTheme && KitChartsTheme.escapeHtml) || (typeof window !== 'undefined' && window.escapeHtml) || function(v) { return String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) {
    const isCost = ['cost', 'churn', 'risk', 'loss', 'latency', 'cac', 'expense', 'debt', 'defect'].includes(String(m || 'revenue').toLowerCase().trim());
    const isPositive = typeof d === 'number' ? d > 0 : (d === 'up' || d === '+');
    const isNegative = typeof d === 'number' ? d < 0 : (d === 'down' || d === '-');
    if (isCost) {
      return isNegative ? '#2E7D32' : (isPositive ? '#C62828' : '#94A3B8');
    }
    return isPositive ? '#2E7D32' : (isNegative ? '#C62828' : '#94A3B8');
  };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  /**
   * Données par défaut représentatives : Tableau de bord exécutif d'une entreprise SaaS B2B
   */
  const DEFAULT_DATA = {
    title: 'Tableau de Bord Stratégique — Performance Trimestrielle',
    subtitle: 'Suivi des indicateurs clés vs cibles annuelles avec tendances 12 mois',
    columns: [
      { key: 'kpi', label: 'Indicateur Clé', align: 'left', sortable: true },
      { key: 'category', label: 'Domaine', align: 'center', sortable: true },
      { key: 'actual', label: 'Réalisé', align: 'right', sortable: true, format: 'number' },
      { key: 'target', label: 'Cible', align: 'right', sortable: true, format: 'number' },
      { key: 'delta', label: 'Écart vs Cible', align: 'right', sortable: true, format: 'delta' },
      { key: 'trend', label: 'Tendance 12M', align: 'center', sortable: false, format: 'sparkline' },
      { key: 'status', label: 'Statut', align: 'center', sortable: true, format: 'status' }
    ],
    rows: [
      {
        kpi: 'Chiffre d\'Affaires Récurrent (ARR)',
        desc: 'Revenus annuels souscrits normalisés',
        category: 'Revenu',
        actual: 14250000,
        target: 13800000,
        unit: ' €',
        delta: 3.26,
        metricType: 'revenue',
        trend: [11.2, 11.5, 11.9, 12.1, 12.4, 12.8, 13.0, 13.3, 13.7, 13.9, 14.1, 14.25],
        status: 'success',
        statusText: 'Dépassé'
      },
      {
        kpi: 'Taux de Rétention Nette (NDR)',
        desc: 'Expansion nette sur cohorte existante',
        category: 'Clients',
        actual: 114.2,
        target: 110.0,
        unit: ' %',
        delta: 3.82,
        metricType: 'revenue',
        trend: [108.0, 108.5, 109.2, 110.0, 109.8, 111.0, 111.8, 112.5, 113.0, 113.8, 114.0, 114.2],
        status: 'success',
        statusText: 'Dépassé'
      },
      {
        kpi: 'Coût d\'Acquisition Client (CAC)',
        desc: 'Dépenses sales & marketing par nouveau client',
        category: 'Marketing',
        actual: 840,
        target: 750,
        unit: ' €',
        delta: 12.0,
        metricType: 'cost',
        trend: [720, 710, 740, 750, 760, 780, 810, 790, 820, 830, 835, 840],
        status: 'danger',
        statusText: 'Dérive'
      },
      {
        kpi: 'Marge Brute Opérationnelle',
        desc: 'Marge brute après coûts d\'infrastructure & support',
        category: 'Finance',
        actual: 78.5,
        target: 80.0,
        unit: ' %',
        delta: -1.88,
        metricType: 'revenue',
        trend: [81.0, 80.5, 80.2, 79.8, 79.5, 79.0, 78.8, 78.5, 78.2, 78.4, 78.6, 78.5],
        status: 'warning',
        statusText: 'Sous surveillance'
      },
      {
        kpi: 'Net Promoter Score (NPS)',
        desc: 'Score de recommandation client ([-100, +100])',
        category: 'Qualité',
        actual: 64,
        target: 60,
        unit: ' pts',
        delta: 6.67,
        metricType: 'revenue',
        trend: [52, 54, 55, 57, 56, 58, 60, 59, 61, 62, 63, 64],
        status: 'success',
        statusText: 'Excellent'
      },
      {
        kpi: 'Taux d\'Attrition Mensuel (Churn)',
        desc: 'Pourcentage de logos perdus par mois',
        category: 'Clients',
        actual: 0.85,
        target: 0.70,
        unit: ' %',
        delta: 21.43,
        metricType: 'cost',
        trend: [0.65, 0.68, 0.70, 0.72, 0.71, 0.75, 0.78, 0.80, 0.82, 0.84, 0.83, 0.85],
        status: 'danger',
        statusText: 'Alerte'
      },
      {
        kpi: 'Latence API (p95)',
        desc: 'Temps de réponse des requêtes de production',
        category: 'Tech',
        actual: 118,
        target: 120,
        unit: ' ms',
        delta: -1.67,
        metricType: 'cost',
        trend: [145, 140, 135, 130, 128, 125, 122, 120, 119, 118, 118, 118],
        status: 'success',
        statusText: 'Conforme'
      }
    ]
  };

  /**
   * Formate un nombre selon la norme locale avec séparateurs de milliers et décimales fixes
   */
  function formatNumber(val, unit = '') {
    if (val === null || val === undefined || isNaN(val)) return '—';
    const absVal = Math.abs(val);
    let formatted = '';
    if (absVal >= 1000000) {
      formatted = (val / 1000000).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '\u00A0M';
    } else if (absVal >= 1000) {
      formatted = val.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 1 });
    } else {
      formatted = Number.isInteger(val) ? val.toString() : val.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
    }
    return formatted + String(unit).replace(/ /g, '\u00A0');
  }

  /**
   * Génère le SVG inline de la sparkline de tendance (Edward Tufte)
   */
  function generateSparklineSVG(values, width = 110, height = 28, strokeColor = '#2B8CBE', isTufte = false, lowerIsBetter = false, goodColor = '#2E7D32', badColor = '#C62828') {
    if (!values || values.length < 2) return '<span style="color:#94A3B8;">—</span>';
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = (max - min) === 0 ? 1 : (max - min);
    const paddingX = 4;
    const paddingY = 4;
    const innerW = width - 2 * paddingX;
    const innerH = height - 2 * paddingY;

    const points = values.map((val, idx) => {
      const x = paddingX + (idx / (values.length - 1)) * innerW;
      const y = height - paddingY - ((val - min) / range) * innerH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const minIdx = values.indexOf(min);
    const maxIdx = values.lastIndexOf(max);
    const lastIdx = values.length - 1;

    const minX = (paddingX + (minIdx / (values.length - 1)) * innerW).toFixed(1);
    const minY = (height - paddingY - ((min - min) / range) * innerH).toFixed(1);

    const maxX = (paddingX + (maxIdx / (values.length - 1)) * innerW).toFixed(1);
    const maxY = (height - paddingY - ((max - min) / range) * innerH).toFixed(1);

    const lastX = (paddingX + (lastIdx / (values.length - 1)) * innerW).toFixed(1);
    const lastY = (height - paddingY - ((values[lastIdx] - min) / range) * innerH).toFixed(1);

    const titleText = `Tendance: Début ${values[0]} → Fin ${values[lastIdx]} (Min: ${min}, Max: ${max})`;

    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="overflow:visible; display:block; margin:0 auto;" aria-label="${escapeHtml(titleText)}">
        <title>${escapeHtml(titleText)}</title>
        <polyline fill="none" stroke="${strokeColor}" stroke-width="${isTufte ? '1.25' : '1.75'}" stroke-linecap="round" stroke-linejoin="round" points="${points.join(' ')}" />
        ${!isTufte ? `<circle cx="${minX}" cy="${minY}" r="2.5" fill="${lowerIsBetter ? goodColor : badColor}" opacity="0.95"><title>Min: ${escapeHtml(min)}</title></circle>` : ''}
        ${!isTufte ? `<circle cx="${maxX}" cy="${maxY}" r="2.5" fill="${lowerIsBetter ? badColor : goodColor}" opacity="0.95"><title>Max: ${escapeHtml(max)}</title></circle>` : ''}
        <circle cx="${lastX}" cy="${lastY}" r="${isTufte ? '2' : '2.5'}" fill="${strokeColor}"><title>Dernier: ${escapeHtml(values[lastIdx])}</title></circle>
      </svg>
    `;
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
   * Crée et initialise un Tableau Exécutif KPI Scorecard
   *
   * @param {string|HTMLElement} target - ID ou élément DOM cible
   * @param {Object} [customData=null] - Jeu de données optionnel
   * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème
   * @param {Object} [options={}] - Options de configuration
   * @returns {Object} Instance de contrôle du tableau
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
      // Simulation pour environnement Node.js headless
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

    // Si la cible est un canvas, adapter son conteneur parent pour insérer le tableau
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
    let sortColumn = options.sortColumn || null;
    let sortDirection = options.sortDirection || 'asc';

    function render() {
      if (!container) return;
      // Mode compact (zone < 460 px) : domaine et cible masqués, sparkline réduite, statut en pastille symbole
      const hostW = container.clientWidth || (container.parentElement && container.parentElement.clientWidth) || 0;
      const compact = hostW > 0 && hostW < 460;
      const hiddenKeys = compact ? ['category', 'target'] : [];
      const cp = compact ? '7px 5px' : '10px 14px';

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

      // Tri des lignes si requis
      let displayRows = [...data.rows];
      if (sortColumn) {
        displayRows.sort((a, b) => {
          let valA = a[sortColumn];
          let valB = b[sortColumn];
          if (sortColumn === 'delta') {
            valA = typeof a.delta === 'number' ? a.delta : (typeof a.actual === 'number' && typeof a.target === 'number' && a.target !== 0 ? ((a.actual - a.target) / Math.abs(a.target)) * 100 : 0);
            valB = typeof b.delta === 'number' ? b.delta : (typeof b.actual === 'number' && typeof b.target === 'number' && b.target !== 0 ? ((b.actual - b.target) / Math.abs(b.target)) * 100 : 0);
          }
          if (typeof valA === 'string') valA = valA.toLowerCase();
          if (typeof valB === 'string') valB = valB.toLowerCase();
          if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
          if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
          return 0;
        });
      }

      let html = `
        <div class="kc-dataviz-table-container" style="
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
            min-width: ${compact ? 0 : 760}px;
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
        const shortLabels = { kpi: 'KPI', delta: 'Écart', trend: '12M', status: '' };
        const isSorted = sortColumn === col.key;
        const sortIcon = isSorted ? (sortDirection === 'asc' ? ' ▲' : ' ▼') : '';
        const cursor = col.sortable ? 'cursor: pointer; user-select: none;' : '';
        html += `
          <th data-key="${escapeHtml(col.key)}" style="
            padding: ${compact ? '8px 5px' : '10px 14px'};
            text-align: ${escapeHtml(col.align)};
            font-weight: 600;
            font-size: ${compact ? '0.65rem' : '0.725rem'};
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: ${isSorted ? primaryColor : textSecondary};
            border: none;
            white-space: nowrap;
            ${cursor}
          " title="${col.sortable ? 'Cliquer pour trier' : ''}">
            ${escapeHtml(compact && shortLabels[col.key] !== undefined ? shortLabels[col.key] : col.label)}${sortIcon}
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

        // Calcul automatique du delta si non spécifié
        let deltaVal = row.delta;
        if (typeof deltaVal !== 'number' && typeof row.actual === 'number' && typeof row.target === 'number' && row.target !== 0) {
          deltaVal = ((row.actual - row.target) / Math.abs(row.target)) * 100;
        }
        const hasDelta = typeof deltaVal === 'number' && !isNaN(deltaVal);
        const effectiveDelta = hasDelta ? deltaVal : 0;
        const deltaColor = hasDelta ? readableOn(getValenceColor(tokens, effectiveDelta, row.metricType || 'revenue'), bgSurface, 4.5) : textSecondary;
        const arrow = effectiveDelta > 0 ? '↑' : (effectiveDelta < 0 ? '↓' : '=');
        const plusSign = effectiveDelta > 0 ? '+' : '';
        const deltaFormatted = hasDelta ? `${plusSign}${effectiveDelta.toFixed(2)}%` : '—';

        // Badge de statut accessible (Double encodage: couleur + texte + symbole)
        let statusBg = 'rgba(148, 163, 184, 0.15)';
        let statusColor = textSecondary;
        let statusSymbol = '●';

        const statusBase = row.status === 'success' ? (tokens.status?.success || '#2E7D32')
          : row.status === 'warning' ? (tokens.status?.warning || '#EF6C00')
          : row.status === 'danger' ? (tokens.status?.danger || '#C62828') : null;
        if (statusBase) {
          statusBg = blendHex(statusBase, isDark ? 0.25 : 0.14, bgSurface);
          statusColor = readableOn(statusBase, statusBg, 4.5);
          statusSymbol = row.status === 'success' ? '✓' : (row.status === 'warning' ? '▲' : '■');
        }

        html += `
          <tr class="kc-table-row" style="
            background: ${rowBg};
            border-bottom: ${borderBottom};
            transition: background 0.15s ease;
          ">
            <td style="padding: ${cp}; text-align: left; vertical-align: middle;">
              <div style="font-weight: 600; color: ${textPrimary};">${escapeHtml(row.kpi)}</div>
              ${row.desc && !compact ? `<div style="font-size: 0.7rem; color: ${textMuted}; margin-top: 1px;">${escapeHtml(row.desc)}</div>` : ''}
            </td>
            ${compact ? '' : `<td style="padding: ${cp}; text-align: center; vertical-align: middle;">
              <span style="
                display: inline-block;
                padding: 2px 7px;
                border-radius: 9999px;
                font-size: 0.7rem;
                font-weight: 500;
                background: ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.05)'};
                color: ${textSecondary};
              ">${escapeHtml(row.category)}</span>
            </td>`}
            <td style="padding: ${cp}; white-space: nowrap; text-align: right; font-family: ${fontMono}; font-weight: 600; color: ${textPrimary}; vertical-align: middle;">
              ${escapeHtml(formatNumber(row.actual, row.unit || ''))}
            </td>
            ${compact ? '' : `<td style="padding: ${cp}; white-space: nowrap; text-align: right; font-family: ${fontMono}; color: ${textSecondary}; vertical-align: middle;">
              ${escapeHtml(formatNumber(row.target, row.unit || ''))}
            </td>`}
            <td style="padding: ${cp}; text-align: right; vertical-align: middle; white-space: nowrap;">
              <span style="
                display: inline-flex;
                align-items: center;
                gap: 3px;
                font-family: ${fontMono};
                font-weight: 600;
                font-size: ${compact ? '0.7rem' : '0.775rem'};
                color: ${deltaColor};
              ">
                <span>${hasDelta ? arrow : ''}</span>
                <span>${deltaFormatted}</span>
              </span>
            </td>
            <td style="padding: ${compact ? '4px 4px' : '6px 10px'}; text-align: center; vertical-align: middle;">
              ${generateSparklineSVG(row.trend, compact ? 48 : 105, compact ? 22 : 26, primaryColor, isTufte, ['cost', 'churn', 'risk', 'loss', 'latency', 'cac', 'expense', 'debt', 'defect'].includes(String(row.metricType || 'revenue').toLowerCase().trim()), tokens.status?.success || '#2E7D32', tokens.status?.danger || '#C62828')}
            </td>
            <td style="padding: ${cp}; text-align: center; vertical-align: middle;">
              <span title="${escapeHtml(row.statusText || row.status)}" style="
                display: inline-flex;
                align-items: center;
                gap: 4px;
                padding: 3px ${compact ? 6 : 8}px;
                border-radius: ${isTufte ? '0' : '4px'};
                font-size: 0.725rem;
                font-weight: 600;
                background: ${statusBg};
                color: ${statusColor};
                border: ${isTufte ? `1px solid ${statusColor}` : 'none'};
                white-space: nowrap;
              ">
                <span aria-hidden="true" style="font-size: 0.65rem;">${statusSymbol}</span>
                ${compact ? `<span style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);">${escapeHtml(row.statusText || row.status)}</span>` : `<span>${escapeHtml(row.statusText || row.status)}</span>`}
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

      // Attacher les gestionnaires de tri interactif
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
              sortDirection = 'asc';
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
          `"${r.kpi}"`,
          `"${r.category}"`,
          r.actual,
          r.target,
          r.delta,
          `"${(r.trend || []).join(',')}"`,
          `"${r.statusText || r.status}"`
        ].join(';')).join('\n');
        return `${headers}\n${rows}`;
      }
    };
  }

  // Alias createChart pour conformité absolue avec le registre global kit-charts
  const createChart = function(target, customData = null, themeName = DEFAULT_THEME, options = {}) {
    return createTable(target, customData, themeName, options);
  };

  const moduleExports = {
    DEFAULT_DATA,
    createTable,
    createChart,
    renderTable: createTable,
    formatNumber,
    generateSparklineSVG
  };

  moduleExports.default = moduleExports;
  return moduleExports;
});
