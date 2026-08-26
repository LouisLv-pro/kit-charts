/**
 * @file test/verify-threshold-provenance.mjs
 * @description Verification suite for the 3-level threshold provenance contract (T1).
 */

import { assert, expect } from './test-helpers.js';
import { resolveThresholds } from '../themes/theme-tokens.js';

console.log('🧪 Starting Threshold Provenance Verification Suite (T1)...');

// 1. Explicit Thresholds Validation
console.log('\n📦 1. Explicit Provenance Level:');
{
  const explicitHIB = { target: 100, warning: 90, danger: 80, polarity: 'higher-is-better' };
  const res1 = resolveThresholds([50, 60, 70, 80, 90, 100], explicitHIB);
  expect(res1.provenance).toBe('explicit');
  expect(res1.target).toBe(100);
  expect(res1.warning).toBe(90);
  expect(res1.danger).toBe(80);
  expect(res1.polarity).toBe('higher-is-better');
  expect(res1.badge).toBe('Seuil: métier');
  console.log('  ✓ Valid explicit higher-is-better resolved correctly');

  const explicitLIB = { target: 20, warning: 30, danger: 50, polarity: 'lower-is-better' };
  const res2 = resolveThresholds([10, 20, 30, 40, 50], explicitLIB);
  expect(res2.provenance).toBe('explicit');
  expect(res2.target).toBe(20);
  expect(res2.warning).toBe(30);
  expect(res2.danger).toBe(50);
  expect(res2.polarity).toBe('lower-is-better');
  expect(res2.badge).toBe('Seuil: métier');
  console.log('  ✓ Valid explicit lower-is-better resolved correctly');

  // Incomplete explicit must throw
  expect(() => resolveThresholds([10, 20, 30, 40, 50], { target: 100 })).toThrow();
  expect(() => resolveThresholds([10, 20, 30, 40, 50], { target: 100, warning: 90 })).toThrow();
  expect(() => resolveThresholds([10, 20, 30, 40, 50], { warning: 90, danger: 80 })).toThrow();
  console.log('  ✓ Incomplete explicit thresholds strictly throw error');
}

// 2. Statistical Thresholds Validation (Sigma method)
console.log('\n📊 2. Statistical Provenance Level (Sigma Method):');
{
  const rawData = [10, 12, 14, 16, 18, 20];
  const n = rawData.length;
  const mu = 15; // (10+12+14+16+18+20)/6 = 90/6 = 15
  // variance: ((10-15)^2 + (12-15)^2 + (14-15)^2 + (16-15)^2 + (18-15)^2 + (20-15)^2) / 5
  // = (25 + 9 + 1 + 1 + 9 + 25) / 5 = 70 / 5 = 14
  const sigma = Math.sqrt(14); // ~3.741657

  const resSigmaHIB = resolveThresholds(rawData, null, { method: 'sigma', k: 2, polarity: 'higher-is-better' });
  expect(resSigmaHIB.provenance).toBe('statistical');
  expect(resSigmaHIB.method).toBe('sigma');
  expect(resSigmaHIB.target).toBeCloseTo(mu, 4);
  expect(resSigmaHIB.warning).toBeCloseTo(mu - 1 * sigma, 4);
  expect(resSigmaHIB.danger).toBeCloseTo(mu - 2 * sigma, 4);
  expect(resSigmaHIB.polarity).toBe('higher-is-better');
  expect(resSigmaHIB.badge).toBe('Seuil: statistique (μ-2σ)');
  console.log('  ✓ Statistical sigma higher-is-better matches exact mathematical formula');

  const resSigmaLIB = resolveThresholds(rawData, null, { method: 'sigma', k: 2, polarity: 'lower-is-better' });
  expect(resSigmaLIB.provenance).toBe('statistical');
  expect(resSigmaLIB.target).toBeCloseTo(mu, 4);
  expect(resSigmaLIB.warning).toBeCloseTo(mu + 1 * sigma, 4);
  expect(resSigmaLIB.danger).toBeCloseTo(mu + 2 * sigma, 4);
  expect(resSigmaLIB.polarity).toBe('lower-is-better');
  expect(resSigmaLIB.badge).toBe('Seuil: statistique (μ+2σ)');
  console.log('  ✓ Statistical sigma lower-is-better matches exact mathematical formula');
}

// 3. Statistical Thresholds Validation (Quantile method)
console.log('\n📈 3. Statistical Provenance Level (Quantile Method):');
{
  const rawData = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]; // n = 10
  // n = 10, h = (n-1)*p = 9*p
  // Q(0.50): h = 4.5 -> x[4] + 0.5*(x[5]-x[4]) = 50 + 0.5*10 = 55
  // Q(0.25): h = 2.25 -> x[2] + 0.25*(x[3]-x[2]) = 30 + 0.25*10 = 32.5
  // Q(0.10): h = 0.90 -> x[0] + 0.90*(x[1]-x[0]) = 10 + 0.90*10 = 19

  const resQuantileHIB = resolveThresholds(rawData, null, { method: 'quantile', polarity: 'higher-is-better' });
  expect(resQuantileHIB.provenance).toBe('statistical');
  expect(resQuantileHIB.method).toBe('quantile');
  expect(resQuantileHIB.target).toBeCloseTo(55, 4);
  expect(resQuantileHIB.warning).toBeCloseTo(32.5, 4);
  expect(resQuantileHIB.danger).toBeCloseTo(19, 4);
  expect(resQuantileHIB.badge).toBe('Seuil: statistique (quantile)');
  console.log('  ✓ Statistical quantile higher-is-better matches continuous interpolation');

  // Lower-is-better: Q(0.50), Q(0.75), Q(0.90)
  // Q(0.75): h = 6.75 -> x[6] + 0.75*(x[7]-x[6]) = 70 + 0.75*10 = 77.5
  // Q(0.90): h = 8.10 -> x[8] + 0.10*(x[9]-x[8]) = 90 + 0.10*10 = 91
  const resQuantileLIB = resolveThresholds(rawData, null, { method: 'quantile', polarity: 'lower-is-better' });
  expect(resQuantileLIB.target).toBeCloseTo(55, 4);
  expect(resQuantileLIB.warning).toBeCloseTo(77.5, 4);
  expect(resQuantileLIB.danger).toBeCloseTo(91, 4);
  console.log('  ✓ Statistical quantile lower-is-better matches mirrored continuous interpolation');
}

// 4. Neutral Provenance Level (n < 5 Fallback)
console.log('\n🔒 4. Neutral Provenance Level (n < 5 Fallback):');
{
  const smallData = [10, 20, 30, 40]; // n = 4 < 5
  const resSmall = resolveThresholds(smallData, null);
  expect(resSmall.provenance).toBe('neutral');
  expect(resSmall.target).toBe(25); // mean of 4 points
  expect(resSmall.warning).toBeNull();
  expect(resSmall.danger).toBeNull();
  expect(resSmall.badge).toBe('Seuil: N/D');
  console.log('  ✓ Fallback to neutral triggered when n < 5');

  const emptyRes = resolveThresholds([], null);
  expect(emptyRes.provenance).toBe('neutral');
  expect(emptyRes.target).toBeNull();
  expect(emptyRes.badge).toBe('Seuil: N/D');
  console.log('  ✓ Fallback to neutral on empty dataset');
}

// 5. Strict Determinism Validation
console.log('\n🔄 5. Strict Determinism:');
{
  const testData = [14, 18, 22, 29, 35, 42, 50, 61];
  const run1 = resolveThresholds(testData, null, { method: 'sigma', k: 2.5 });
  const run2 = resolveThresholds(testData, null, { method: 'sigma', k: 2.5 });
  expect(JSON.stringify(run1)).toBe(JSON.stringify(run2));
  console.log('  ✓ Two identical calls produce 100% byte-for-byte identical output');
}

console.log('\n🎉 All Threshold Provenance tests passed successfully!');
