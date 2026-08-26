/**
 * @file test/verify-series-budget-stability.mjs
 * @description Verification suite for D2 (stability), D3 (__budget metadata), D4 (abs ranking), D9 (NaN handling).
 */

import { assert, expect } from './test-helpers.js';
import { resolveSeriesBudget } from '../themes/theme-tokens.js';
import multiLineChart from '../template/05-evolution-temporelle/multi-line-chart/template.js';

console.log('🧪 Starting Series Budget Stability & Robustness Suite (D2, D3, D4, D9)...');

// 1. D2: Stable tie-breaking on identical sums
console.log('\n🔀 1. D2: Stable tie-breaking (Val desc, Label asc):');
{
  const A = [{ label: 'b', data: [5] }, { label: 'a', data: [5] }, { label: 'c', data: [5] }];
  const B = [{ label: 'a', data: [5] }, { label: 'b', data: [5] }, { label: 'c', data: [5] }];

  const resA = resolveSeriesBudget(A, { maxSeries: 2, aggregateRemainder: false }).map(d => d.label);
  const resB = resolveSeriesBudget(B, { maxSeries: 2, aggregateRemainder: false }).map(d => d.label);

  console.log(`  Res A (input [b,a,c]):`, resA);
  console.log(`  Res B (input [a,b,c]):`, resB);

  expect(resA).toEqual(['a', 'b', 'c']);
  expect(resB).toEqual(['a', 'b', 'c']);

  // N=20 deterministic permutations
  // Simple LCG PRNG
  let seed = 12345;
  const lcg = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
  const baseItems = [
    { label: 'zeta', data: [10] },
    { label: 'alpha', data: [10] },
    { label: 'gamma', data: [10] },
    { label: 'beta', data: [10] },
    { label: 'delta', data: [10] }
  ];

  for (let p = 0; p < 20; p++) {
    const shuffled = [...baseItems].sort(() => lcg() - 0.5);
    const resolved = resolveSeriesBudget(shuffled, { maxSeries: 3, aggregateRemainder: false });
    const topLabels = resolved.filter(d => !d.hidden).map(d => d.label);
    expect(topLabels).toEqual(['alpha', 'beta', 'delta']);
  }
  console.log('  ✓ 20 permutations with identical values consistently yield alphabetical order: ["alpha", "beta", "delta"]');
}

// 2. D4: Ranking by absolute values
console.log('\n📊 2. D4: Ranking by sum of absolute values:');
{
  const mixedData = [
    { label: 'Negative Titan', data: [-1000] },
    { label: 'Tiny Positive', data: [10] }
  ];
  const budgeted = resolveSeriesBudget(mixedData, { maxSeries: 1, aggregateRemainder: false });
  expect(budgeted[0].label).toBe('Negative Titan');
  console.log('  ✓ Series with large negative magnitude (|-1000| > |10|) ranked first');
}

// 3. D3: __budget Metadata & Rationale
console.log('\n📋 3. D3: __budget Metadata & Rationale:');
{
  const tenSeries = Array.from({ length: 10 }, (_, i) => ({
    label: `S${i + 1}`,
    data: [100 - i * 5]
  }));
  const res = resolveSeriesBudget(tenSeries, { maxSeries: 7, aggregateRemainder: true });
  expect(res.__budget).toBeDefined();
  expect(res.__budget.strategy).toBe('topNAggregated');
  expect(res.__budget.totalSeries).toBe(10);
  expect(res.__budget.keptCount).toBe(6);
  expect(res.__budget.aggregatedCount).toBe(4);
  expect(res.__budget.rationale).toContain('loi de Hick');
  console.log(`  ✓ Metadata __budget: strategy="${res.__budget.strategy}", rationale="${res.__budget.rationale}"`);

  // Check multi-line chart integration
  const mockCanvas = { getContext: () => ({}) };
  const chart = multiLineChart.createChart(mockCanvas, {
    labels: ['T1'],
    datasets: tenSeries
  }, 'colorbrewer-accessible', { maxSeries: 7 });
  expect(chart.$kitBudget).toBeDefined();
  expect(chart.$kitBudget.strategy).toBe('topNAggregated');
  console.log('  ✓ Multi-line chart exposes chart.$kitBudget');
}

// 4. D9: NaN and null propagation in aggregated series
console.log('\n🕳️ 4. D9: NaN and null handling in aggregate series:');
{
  const seriesWithGaps = [
    { label: 'S1', data: [10, 20, 30] },
    { label: 'S2', data: [10, 20, 30] },
    { label: 'S3 (rem1)', data: [5, null, 15] },
    { label: 'S4 (rem2)', data: [5, null, 25] },
    { label: 'S5 (rem3)', data: [10, NaN, 10] }
  ];
  // maxSeries 3 -> top 2 kept (S1, S2), remainder 3 aggregated into Autres (3)
  const resGaps = resolveSeriesBudget(seriesWithGaps, { maxSeries: 3, aggregateRemainder: true });
  expect(resGaps.length).toBe(3);
  const aggregateDs = resGaps[2];
  expect(aggregateDs.label).toBe('Autres (3)');
  // index 0: 5 + 5 + 10 = 20
  expect(aggregateDs.data[0]).toBe(20);
  // index 1: all are null/NaN -> must be null
  expect(aggregateDs.data[1]).toBeNull();
  // index 2: 15 + 25 + 10 = 50
  expect(aggregateDs.data[2]).toBe(50);
  expect(resGaps.__budget.missingCount).toBeGreaterThan(0);
  console.log('  ✓ Aggregated series correctly sums valid values and outputs null when all are missing');
}

console.log('\n🎉 All Series Budget Stability tests passed successfully!');
