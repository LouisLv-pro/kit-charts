/**
 * @file test/verify-series-budget.mjs
 * @description Verification suite for Hick's Law Interactive Series Budget (T6).
 */

import { assert, expect } from './test-helpers.js';
import { resolveSeriesBudget } from '../themes/theme-tokens.js';
import multiLineChart from '../template/05-evolution-temporelle/multi-line-chart/template.js';

console.log("🧪 Starting Hick's Law Interactive Series Budget Verification Suite (T6)...");

// 1. Unaltered Output for <= maxSeries
console.log('\n📊 1. Datasets within Budget (<= 7 series):');
{
  const fourSeries = [
    { label: 'S1', data: [10, 20] },
    { label: 'S2', data: [15, 25] },
    { label: 'S3', data: [5, 12] },
    { label: 'S4', data: [8, 18] }
  ];
  const budgeted = resolveSeriesBudget(fourSeries, { maxSeries: 7 });
  expect(budgeted.length).toBe(4);
  expect(budgeted[0].label).toBe('S1');
  console.log('  ✓ 4 series returned untouched without truncation or aggregation');
}

// 2. Budget Enforcement with Remainder Aggregation (10 series -> Top 6 + Autres (4))
console.log('\n🗜️ 2. Budget Enforcement with Aggregation (10 series, maxSeries: 7):');
{
  const tenSeries = [
    { label: 'S1', data: [100, 100] }, // sum = 200
    { label: 'S2', data: [90, 90] },   // sum = 180
    { label: 'S3', data: [80, 80] },   // sum = 160
    { label: 'S4', data: [70, 70] },   // sum = 140
    { label: 'S5', data: [60, 60] },   // sum = 120
    { label: 'S6', data: [50, 50] },   // sum = 100
    { label: 'S7', data: [40, 40] },   // sum = 80
    { label: 'S8', data: [30, 30] },   // sum = 60
    { label: 'S9', data: [20, 20] },   // sum = 40
    { label: 'S10', data: [10, 10] }   // sum = 20
  ];

  const budgeted = resolveSeriesBudget(tenSeries, { maxSeries: 7, aggregateRemainder: true });
  expect(budgeted.length).toBe(7);
  expect(budgeted[0].label).toBe('S1');
  expect(budgeted[5].label).toBe('S6');
  expect(budgeted[6].label).toBe('Autres (4)');
  expect(budgeted[6].data).toEqual([100, 100]); // 40 + 30 + 20 + 10 = 100
  expect(budgeted[6].role).toBe('context');
  console.log('  ✓ 10 series capped to top 6 + "Autres (4)" with accurate data summation');
}

// 3. Focal Series Priority Preservation
console.log('\n🌟 3. Focal Priority Preservation:');
{
  const seriesWithFocal = [
    { label: 'S1', data: [100, 100] },
    { label: 'S2', data: [90, 90] },
    { label: 'S3', data: [80, 80] },
    { label: 'S4', data: [70, 70] },
    { label: 'S5', data: [60, 60] },
    { label: 'S6', data: [50, 50] },
    { label: 'S7', data: [40, 40] },
    { label: 'Tiny Hero', data: [1, 1], role: 'focal' } // small value but focal!
  ];

  const budgeted = resolveSeriesBudget(seriesWithFocal, { maxSeries: 7, aggregateRemainder: true });
  expect(budgeted.some(ds => ds.label === 'Tiny Hero')).toBe(true);
  expect(budgeted[0].label).toBe('Tiny Hero');
  console.log('  ✓ Series explicitly marked with role="focal" preserved in top slot despite lower magnitude');
}

// 4. Non-Aggregated Mode (hidden: true)
console.log('\n👁️ 4. Non-Aggregated Mode (aggregateRemainder: false):');
{
  const tenSeries = Array.from({ length: 10 }, (_, i) => ({
    label: `S${i + 1}`,
    data: [10 * (10 - i)]
  }));

  const budgeted = resolveSeriesBudget(tenSeries, { maxSeries: 7, aggregateRemainder: false });
  expect(budgeted.length).toBe(10);
  expect(budgeted[0].hidden).toBeFalsy();
  expect(budgeted[6].hidden).toBeFalsy();
  expect(budgeted[7].hidden).toBe(true);
  expect(budgeted[8].hidden).toBe(true);
  expect(budgeted[9].hidden).toBe(true);
  console.log('  ✓ Non-aggregated mode flags series beyond rank 7 as hidden: true');
}

// 5. Determinism Check (100 runs)
console.log('\n🔄 5. Strict Determinism (100 runs):');
{
  const tenSeries = Array.from({ length: 10 }, (_, i) => ({
    label: `S${i + 1}`,
    data: [10, 20, 30]
  }));

  const firstRun = JSON.stringify(resolveSeriesBudget(tenSeries));
  for (let r = 0; r < 100; r++) {
    const run = JSON.stringify(resolveSeriesBudget(tenSeries));
    assert(run === firstRun, `Determinism check failed on run ${r}`);
  }
  console.log('  ✓ 100 consecutive budget resolutions produced 100% identical JSON structures');
}

// 6. Template createChart Instantiation
console.log('\n📈 6. Multi-Line Chart Integration:');
{
  const mockCanvas = { getContext: () => ({}) };
  const bigPayload = {
    labels: ['Jan', 'Feb'],
    datasets: Array.from({ length: 12 }, (_, i) => ({ label: `S${i + 1}`, data: [i * 5, i * 10] }))
  };
  const chart = multiLineChart.createChart(mockCanvas, bigPayload, 'colorbrewer-accessible', { maxSeries: 7 });
  expect(chart.config.data.datasets.length).toBe(7);
  console.log('  ✓ Multi-line chart automatically applies series budget in createChart');
}

console.log("\n🎉 All Hick's Law Series Budget tests passed successfully!");
