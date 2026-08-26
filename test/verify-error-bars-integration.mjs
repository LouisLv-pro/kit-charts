/**
 * @file test/verify-error-bars-integration.mjs
 * @description Integration verification suite for Error Bars & CI Overlap Valence Guard (D1, D6).
 */

import { assert, expect } from './test-helpers.js';
import barChartVertical from '../template/01-comparaison/bar-chart-vertical/template.js';
import groupedBarChart from '../template/01-comparaison/grouped-bar-chart/template.js';
import scatterPlot from '../template/04-correlation-relation/scatter-plot/template.js';

console.log('🧪 Starting Error Bars & CI Overlap Valence Guard Integration Suite (D1, D6)...');

const mockCanvas = { getContext: () => ({}) };

// 1. D1: Error bars option integration in Bar Chart Vertical
console.log('\n📊 1. D1: Error bars option on Bar Chart Vertical:');
{
  // Without errorBars -> plugin absent
  const chartNoEb = barChartVertical.createChart(mockCanvas, {
    labels: ['A', 'B'],
    datasets: [{ data: [10, 20] }]
  }, 'colorbrewer-accessible');
  const pluginsNoEb = chartNoEb.config?.plugins || [];
  const hasPluginNoEb = pluginsNoEb.some(p => p && (p.id === 'kitChartsErrorBars' || p.id === 'errorBarsPlugin'));
  expect(hasPluginNoEb).toBe(false);
  console.log('  ✓ Default chart without errorBars options leaves config.plugins clean');

  // With errorBars ci95
  const chartWithEb = barChartVertical.createChart(mockCanvas, {
    labels: ['Groupe A', 'Groupe B'],
    datasets: [{
      label: 'Score',
      data: [
        [10, 12, 14, 11, 13], // array of raw observations
        [20, 22, 21, 23, 24]
      ]
    }]
  }, 'colorbrewer-accessible', {
    errorBars: { mode: 'ci95', confidence: 0.95 }
  });
  const pluginsWithEb = chartWithEb.config?.plugins || [];
  const hasPluginWithEb = pluginsWithEb.some(p => p && p.id === 'kitChartsErrorBars');
  expect(hasPluginWithEb).toBe(true);
  console.log('  ✓ Chart with options.errorBars successfully registers kitChartsErrorBars plugin');

  // Invalid confidence bounds [0.80, 0.99]
  let threw = false;
  try {
    barChartVertical.createChart(mockCanvas, {
      labels: ['A'],
      datasets: [{ data: [[1, 2, 3]] }]
    }, 'colorbrewer-accessible', {
      errorBars: { mode: 'ci95', confidence: 0.50 } // out of bounds!
    });
  } catch (err) {
    threw = true;
    expect(err.message).toContain('confidence');
  }
  expect(threw).toBe(true);
  console.log('  ✓ Out-of-bounds confidence (< 0.80) strictly throws validation error');
}

// 2. D1: Error bars option on Grouped Bar Chart
console.log('\n📊 2. D1: Error bars option on Grouped Bar Chart:');
{
  const chartGrouped = groupedBarChart.createChart(mockCanvas, {
    labels: ['2025', '2026'],
    datasets: [
      { label: 'S1', data: [10, 15], errorBarsData: [{ low: 8, high: 12 }, { low: 13, high: 17 }] },
      { label: 'S2', data: [20, 25], errorBarsData: [{ low: 18, high: 22 }, { low: 23, high: 27 }] }
    ]
  }, 'colorbrewer-accessible', {
    errorBars: { mode: 'explicit' }
  });
  const hasPlugin = (chartGrouped.config?.plugins || []).some(p => p && p.id === 'kitChartsErrorBars');
  expect(hasPlugin).toBe(true);
  console.log('  ✓ Grouped bar chart with explicit error bars registers kitChartsErrorBars plugin');
}

// 3. D1: Error bars option on Scatter Plot
console.log('\n📈 3. D1: Error bars option on Scatter Plot:');
{
  const chartScatter = scatterPlot.createChart(mockCanvas, {
    datasets: [{
      label: 'Observations',
      data: [
        { x: 1, y: 10, errorBars: { low: 8, high: 12 } },
        { x: 2, y: 20, errorBars: { low: 17, high: 23 } }
      ]
    }]
  }, 'colorbrewer-accessible', {
    errorBars: { mode: 'explicit' }
  });
  const hasPlugin = (chartScatter.config?.plugins || []).some(p => p && p.id === 'kitChartsErrorBars');
  expect(hasPlugin).toBe(true);
  console.log('  ✓ Scatter plot with error bars registers kitChartsErrorBars plugin');
}

// 4. D6: CI Overlap Valence Guardrail
console.log('\n🛡️ 4. D6: CI Overlap Valence Guardrail (Cumming & Finch 2005):');
{
  // Two overlapping datasets where one intended a 'success' (gain) valence
  // S1: mean 50, CI [45, 55]; S2: mean 52, CI [47, 57] -> massive overlap!
  const overlappingData = {
    labels: ['Série 1 (Base)', 'Série 2 (Test)'],
    datasets: [{
      label: 'Performance',
      data: [
        [45, 48, 50, 52, 55],
        [47, 50, 52, 54, 57]
      ],
      valence: 'gain',
      direction: 1 // intends positive green valence
    }]
  };

  const chartOverlap = barChartVertical.createChart(mockCanvas, overlappingData, 'colorbrewer-accessible', {
    errorBars: { mode: 'ci95', confidence: 0.95 }
  });

  // The valence must be forced to neutral because CI95 overlap > 29%
  expect(chartOverlap.$ciOverlapAnalysis).toBeDefined();
  expect(chartOverlap.$ciOverlapAnalysis.recommendedValence).toBe('neutral');
  expect(chartOverlap.$ciOverlapAnalysis.isSignificant).toBe(false);

  // Check tooltip contains disclaimer
  const tooltipFn = chartOverlap.config.options.plugins.tooltip.callbacks.label;
  const tooltipLines = tooltipFn({ dataIndex: 1, dataset: chartOverlap.config.data.datasets[0], raw: 52, parsed: { y: 52 } });
  const textJoined = Array.isArray(tooltipLines) ? tooltipLines.join(' ') : String(tooltipLines);
  expect(textJoined).toContain('IC95');
  console.log(`  ✓ Overlapping CIs force recommendedValence="neutral" and add disclaimer in tooltip: "${textJoined}"`);
}

console.log('\n🎉 All Error Bars & CI Overlap Integration tests passed successfully!');
