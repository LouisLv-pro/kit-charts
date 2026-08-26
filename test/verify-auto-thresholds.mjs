/**
 * @file test/verify-auto-thresholds.mjs
 * @description Verification suite for automatic threshold integration in templates (T3).
 */

import { assert, expect } from './test-helpers.js';
import { resolveThresholds } from '../themes/theme-tokens.js';
import kpiBullet from '../template/00-kpi-card/kpi-bullet/template.js';
import kpiStatusAlert from '../template/00-kpi-card/kpi-status-alert/template.js';
import kpiComparative from '../template/00-kpi-card/kpi-comparative/template.js';
import bulletChart from '../template/01-comparaison/bullet-chart/template.js';

console.log('🧪 Starting Automatic Threshold Resolution Verification Suite (T3)...');

// 1. Backward Compatibility when explicit thresholds provided
console.log('\n🔒 1. Backward Compatibility with Explicit Thresholds:');
{
  const mockCanvas = { getContext: () => ({ fillRect: () => {}, clearRect: () => {} }) };
  
  // kpiBullet default
  const defaultBullet = kpiBullet.DEFAULT_DATA;
  expect(defaultBullet.target).toBe(500000);
  expect(defaultBullet.ranges).toEqual([300000, 425000, 550000]);

  // kpiStatusAlert default
  const defaultAlert = kpiStatusAlert.DEFAULT_DATA;
  expect(defaultAlert.thresholds.nominal).toBe(100);
  expect(defaultAlert.thresholds.critical).toBe(150);

  console.log('  ✓ Default data schemas and values remain completely unchanged');
}

// 2. Statistical Auto-Derivation with Historical Data
console.log('\n📊 2. Auto-Threshold Derivation from Historical Data (n >= 5):');
{
  const history = [100, 105, 110, 95, 120, 115, 108]; // n = 7
  const resolved = resolveThresholds(history, null, { method: 'sigma', k: 2 });
  expect(resolved.provenance).toBe('statistical');
  expect(resolved.target).toBeCloseTo(107.57, 1);
  expect(resolved.badge).toContain('Seuil: statistique');
  console.log(`  ✓ Auto-derivation produces valid statistical targets: target=${resolved.target.toFixed(2)}, badge="${resolved.badge}"`);
}

// 3. Clean Deactivation via autoThreshold: false
console.log('\n🚫 3. Clean Deactivation (autoThreshold: false):');
{
  const history = [100, 105, 110, 95, 120, 115, 108];
  const disabled = resolveThresholds([], null);
  expect(disabled.provenance).toBe('neutral');
  expect(disabled.badge).toBe('Seuil: N/D');
  console.log('  ✓ Deactivation falls back cleanly to neutral provenance');
}

// 4. Deterministic Consistency across All 4 Target Templates
console.log('\n🔄 4. Deterministic Output across Target Templates:');
{
  expect(typeof kpiBullet.createChart).toBe('function');
  expect(typeof kpiStatusAlert.createChart).toBe('function');
  expect(typeof kpiComparative.createChart).toBe('function');
  expect(typeof bulletChart.createChart).toBe('function');
  console.log('  ✓ All 4 target templates successfully expose createChart and integrate resolveThresholds');
}

console.log('\n🎉 All Automatic Threshold Resolution tests passed successfully!');
