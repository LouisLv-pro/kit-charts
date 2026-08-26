/**
 * @file 06-flux-processus/gantt-progress/template.js
 * @description Standardized Gantt Schedule + Progress Fill + 'Today' Marker Template.
 * Visualizes project task lifecycles, progress completion percentages, and temporal milestones.
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
    global.KitCharts['gantt-progress'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.computeGanttSchedule = exp.computeGanttSchedule;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  function computeGanttSchedule(tasks, todayWeek = 6) {
    return tasks.map(t => {
      const start = Number(t.start) || 0;
      const end = Number(t.end) || 0;
      const progress = Math.max(0, Math.min(100, Number(t.progress) || 0));
      const duration = end - start;
      const doneTime = start + (duration * (progress / 100));

      return {
        ...t,
        start,
        end,
        duration,
        progress,
        doneTime,
        isLate: todayWeek > doneTime && progress < 100
      };
    });
  }

  const DEFAULT_DATA = {
    labels: [
      '1. Spécifications & Cadrage',
      '2. Architecture & Schéma DB',
      '3. Développement API Core',
      '4. Intégration Frontend UI',
      '5. Tests E2E & Recette',
      '6. Déploiement Production'
    ],
    datasets: [{
      label: 'Planning Projet',
      todayWeek: 6.5,
      tasks: [
        { label: '1. Spécifications & Cadrage', start: 1, end: 4, progress: 100, category: 0 },
        { label: '2. Architecture & Schéma DB', start: 3, end: 6, progress: 100, category: 0 },
        { label: '3. Développement API Core', start: 5, end: 9, progress: 65, category: 1 },
        { label: '4. Intégration Frontend UI', start: 6, end: 11, progress: 30, category: 1 },
        { label: '5. Tests E2E & Recette', start: 9, end: 12, progress: 0, category: 2 },
        { label: '6. Déploiement Production', start: 11, end: 13, progress: 0, category: 2 }
      ]
    }]
  };

  function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
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
    const showDataLabels = (customData && customData.showDataLabels !== undefined)
      ? customData.showDataLabels
      : (options.showDataLabels !== undefined ? options.showDataLabels : true);

    const rawData = customData || DEFAULT_DATA;
    const labels = rawData.labels || DEFAULT_DATA.labels;
    const rawTasks = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].tasks) || DEFAULT_DATA.datasets[0].tasks;
    const todayWeek = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].todayWeek) || 6.5;

    const schedule = computeGanttSchedule(rawTasks, todayWeek);

    const todayColor = tokens.emphasis?.benchmark || tokens.status?.danger || '#CA0020';

    const ganttPainterPlugin = {
      id: 'kitChartsGanttPainter',
      afterDatasetsDraw(chart) {
        const { ctx, scales: { x, y }, chartArea } = chart;
        if (!x || !y || !chartArea) return;

        ctx.save();
        const n = schedule.length;
        const rowH = y.height / n;
        const barH = Math.min(22, rowH * 0.50);

        // 1. Tracé des sous-barres d'avancement interne (Progress fill)
        schedule.forEach((t, idx) => {
          const yCenter = y.getPixelForValue(idx);
          const xStart = x.getPixelForValue(t.start);
          const xEnd = x.getPixelForValue(t.end);
          const xDone = x.getPixelForValue(t.doneTime);
          const color = getColor(tokens, t.category || 0);

          // Barre d'avancement réel (opacité forte)
          if (t.progress > 0) {
            ctx.fillStyle = color;
            ctx.fillRect(xStart, yCenter - barH / 2, xDone - xStart, barH);
          }

          // Libellé de pourcentage %
          if (showDataLabels) {
            ctx.font = `600 11px ${tokens.fontMono || 'monospace'}`;
            ctx.fillStyle = isDark ? '#ECEFF4' : '#0F172A';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${t.progress}%`, xEnd + 8, yCenter);
          }
        });

        // 2. Ligne repère "Aujourd'hui" (Now vertical line)
        const xToday = x.getPixelForValue(todayWeek);
        ctx.beginPath();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = todayColor;
        ctx.lineWidth = 2;
        ctx.moveTo(xToday, chartArea.top);
        ctx.lineTo(xToday, chartArea.bottom);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.font = `600 11px ${tokens.fontFamily}`;
        ctx.fillStyle = todayColor;
        ctx.textAlign = 'center';
        ctx.fillText("Aujourd'hui (S6.5)", xToday, chartArea.top - 6);

        ctx.restore();
      }
    };

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Durée Prévue',
          data: schedule.map(t => [t.start, t.end]),
          backgroundColor: schedule.map(t => hexToRgba(getColor(tokens, t.category || 0), isDark ? 0.30 : 0.20)),
          borderColor: schedule.map(t => getColor(tokens, t.category || 0)),
          borderWidth: 1.5,
          borderRadius: 4,
          datalabels: {
            display: false // Drawn precisely in ganttPainterPlugin
          }
        }]
      },
      options: {
        ...defaultOpts,
        indexAxis: 'y',
        _kitChartsTokens: tokens,
        showDataLabels: showDataLabels,
        animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          ...defaultOpts.plugins,
          datalabels: getDataLabelOptions(tokens, {
            display: showDataLabels
          }),
          legend: { display: false },
          tooltip: {
            ...defaultOpts.plugins.tooltip,
            callbacks: {
              title: (items) => items[0].label,
              label: (ctx) => {
                const item = schedule[ctx.dataIndex];
                if (!item) return '';
                return [
                  `Période : Semaine ${item.start} à Semaine ${item.end} (${item.duration} sem.)`,
                  `Avancement : ${item.progress}% achevé`,
                  `Statut : ${item.progress === 100 ? 'Terminé' : (item.isLate ? 'En retard' : 'En cours')}`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            type: 'linear',
            ...defaultOpts.scales.x,
            min: 0,
            max: 14,
            grid: { color: tokens.gridColor },
            ticks: {
              stepSize: 1,
              callback: (val) => `S${val}`
            },
            title: {
              display: true,
              text: 'Calendrier (Semaines)',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          },
          y: {
            ...defaultOpts.scales.y,
            grid: { display: false }
          }
        }
      },
      plugins: [ganttPainterPlugin]
    };

    if (typeof Chart === 'undefined') return { config, schedule, computeGanttSchedule };
    return new Chart(canvas, config);
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeGanttSchedule,
    getDataLabelOptions,
    formatLabelValue
  };
});
