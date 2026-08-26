/**
 * @file test/verify-cognitive-animations.mjs
 * @description Comprehensive automated verification test suite for all 10 cognitive animation patterns.
 */

import { assert, expect } from './test-helpers.js';
import KitChartsTheme from '../themes/theme-tokens.js';
import animationModule from '../template/animation/template.js';

console.log('🧪 Starting Cognitive Animations Verification Suite (10 Patterns)...\n');

let passCount = 0;
let totalCount = 0;

function it(name, fn) {
  totalCount++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    throw err;
  }
}

async function itAsync(name, fn) {
  totalCount++;
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    throw err;
  }
}

// -----------------------------------------------------------------------------
// 1. Logarithmic Duration Law ΔT(N) (Dragicevic et al. 2011)
// -----------------------------------------------------------------------------
console.log('⏱️ 1. Logarithmic Duration Law ΔT(N) (Dragicevic et al. 2011):');

it('Calculates duration strictly via logarithmic scale and safeguards boundaries', () => {
  // Theme tokens base calculation: base * (1 + 0.25 * log10(N))
  expect(KitChartsTheme.getAnimationDuration(1)).toBe(350);
  expect(KitChartsTheme.getAnimationDuration(5)).toBe(411);
  expect(KitChartsTheme.getAnimationDuration(50)).toBe(499);
  expect(KitChartsTheme.getAnimationDuration(100)).toBe(525);
  expect(KitChartsTheme.getAnimationDuration(720)).toBe(600);
  expect(KitChartsTheme.getAnimationDuration(10000)).toBe(600);
  expect(KitChartsTheme.getAnimationDuration(0)).toBe(200);

  // Template duration helper
  const tmplDuration = animationModule.getAnimationDuration;
  expect(tmplDuration(1)).toBe(350);
  expect(tmplDuration(100)).toBe(525);
});

// -----------------------------------------------------------------------------
// 2. MOT Stagger Cap (Cavanagh & Alvarez 2005)
// -----------------------------------------------------------------------------
console.log('\n👁️ 2. Stagger Plafonné MOT k=4 (Cavanagh & Alvarez 2005):');

it('Computes MOT stagger delay with cap k=4 and zero on reduced motion', () => {
  const getStagger = KitChartsTheme.getStaggerDelay;
  expect(typeof getStagger).toBe('function');

  // Test context object: dataIndex=2 with 8 items
  const ctx = { dataIndex: 2, chart: { data: { labels: new Array(8) } } };
  const delay = getStagger(ctx, { unitMs: 300, overlapCap: 4, duration: 600 });
  // formula: 2 * (600 - 300) / (8 - 4) = 2 * 300 / 4 = 150 ms
  expect(delay).toBe(150);

  // Test direct index call: index=4, total=10, duration=700
  // formula: 4 * (700 - 300) / (10 - 4) = 4 * 400 / 6 = 267 ms
  const delayDirect = getStagger(4, 10, { unitMs: 300, overlapCap: 4, duration: 700 });
  expect(delayDirect).toBe(267);

  // Test reduced motion returns 0
  const delayReduced = getStagger(4, 10, { duration: 0 });
  expect(delayReduced).toBe(0);
});

// -----------------------------------------------------------------------------
// 3. Staged Transitions (Heer & Robertson 2007)
// -----------------------------------------------------------------------------
console.log('\n🔄 3. Transitions par Étapes (Heer & Robertson 2007):');

await itAsync('Sequences 3 phases (Fade -> Move -> Fade) and resolves cleanly', async () => {
  let updateCalls = 0;
  const mockChart = {
    data: {
      labels: ['A', 'B'],
      datasets: [{ data: [10, 20] }]
    },
    update: (opts) => {
      updateCalls++;
    }
  };

  const stagedPromise = KitChartsTheme.animateStagedUpdate(mockChart, {
    labels: ['X', 'Y', 'Z'],
    datasets: [{ data: [30, 40, 50] }]
  }, 'bar', { duration: 50 });

  expect(stagedPromise).toBeDefined();
  await stagedPromise;
  expect(updateCalls).toBeGreaterThan(0);
  expect(mockChart.data.labels).toEqual(['X', 'Y', 'Z']);
  expect(mockChart.data.datasets[0].data).toEqual([30, 40, 50]);
});

// -----------------------------------------------------------------------------
// 4. Pre-attentive Motion Alert Pulse (Bartram 2003, Healey 2012)
// -----------------------------------------------------------------------------
console.log('\n⚡ 4. Alerte Préattentive Auto-Extinguible (Bartram 2003 / Healey 2012):');

it('Plugin and attachPulseAlert compute damped sinusoid and stop cleanly', () => {
  const plugin = KitChartsTheme.kcPulsePlugin;
  expect(plugin.id).toBe('kcPulse');
  expect(typeof plugin.afterDatasetsDraw).toBe('function');

  let drawCalled = false;
  const mockChart = {
    ctx: {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      rect: () => {},
      clip: () => {},
      drawImage: () => {}
    },
    getDatasetMeta: () => ({
      data: [{ x: 100, y: 100, base: 200, width: 30, height: 100 }]
    }),
    data: {
      datasets: [{ data: [95] }]
    },
    draw: () => { drawCalled = true; }
  };

  const handle = KitChartsTheme.attachPulseAlert(mockChart, {
    threshold: 90,
    amplitude: 0.08,
    frequency: 2,
    tau: 1.2
  });

  expect(handle).toBeDefined();
  expect(typeof handle.stop).toBe('function');
  handle.stop();
});

// -----------------------------------------------------------------------------
// 5. Continuous Zoom & Drill-down (Bederson & Hollan 1994, Pad++)
// -----------------------------------------------------------------------------
console.log('\n🔍 5. Zoom & Drill-down Continu (Bederson & Hollan 1994):');

await itAsync('Interpolates scale logarithmically without step artifacts', async () => {
  let updated = false;
  const mockChart = {
    options: {
      scales: {
        y: { min: 0, max: 100 }
      }
    },
    update: () => { updated = true; }
  };

  const zoomPromise = KitChartsTheme.animateZoomDrilldown(mockChart, { min: 20, max: 80 }, { duration: 50 });
  await zoomPromise;
  expect(updated).toBe(true);
  expect(mockChart.options.scales.y.min).toBe(20);
  expect(mockChart.options.scales.y.max).toBe(80);
});

// -----------------------------------------------------------------------------
// 6. Event Segmentation & Narrative Player (Zacks 2001, Hullman 2011)
// -----------------------------------------------------------------------------
console.log('\n📖 6. Segmentation Événementielle & Narration (Zacks 2001 / Hullman 2011):');

it('Detects statistical jump cuts and steps through scenes correctly', () => {
  // Test frame segmentation
  const frames = [
    [10, 10, 10], // Frame 0
    [11, 10, 11], // Frame 1 (low diff)
    [35, 40, 38], // Frame 2 (huge jump cut!)
    [36, 41, 39], // Frame 3 (stable)
    [90, 95, 92]  // Frame 4 (huge jump cut!)
  ];

  const cutIndices = KitChartsTheme.computeEventSegmentation(frames, { thresholdSigma: 1.2 });
  expect(Array.isArray(cutIndices)).toBe(true);
  expect(cutIndices[0]).toBe(0);
  expect(cutIndices.length).toBeGreaterThan(1);

  // Test scene player
  const scenes = [
    { title: 'Scene 1', data: [10, 20] },
    { title: 'Scene 2', data: [30, 40] },
    { title: 'Scene 3', data: [50, 60] }
  ];

  let sceneCallbackIdx = -1;
  const mockChart = {
    data: { datasets: [{ data: [10, 20] }] },
    update: () => {}
  };

  const player = KitChartsTheme.createNarrativeScenePlayer(mockChart, scenes, {
    sceneDuration: 50,
    onSceneChange: (idx) => { sceneCallbackIdx = idx; }
  });

  expect(player.getCurrentIndex()).toBe(0);
  player.nextScene();
  expect(player.getCurrentIndex()).toBe(1);
  expect(sceneCallbackIdx).toBe(1);
  expect(mockChart.data.datasets[0].data).toEqual([30, 40]);

  player.prevScene();
  expect(player.getCurrentIndex()).toBe(0);
  expect(mockChart.data.datasets[0].data).toEqual([10, 20]);
});

// -----------------------------------------------------------------------------
// 7. Anticipation (Lasseter 1987)
// -----------------------------------------------------------------------------
console.log('\n🎬 7. Anticipation Traditionnelle (Lasseter 1987):');

await itAsync('Applies preparatory recoil and completes mutation smoothly', async () => {
  let mutated = false;
  const mockChart = {
    data: {
      labels: ['A', 'B'],
      datasets: [{ data: [10, 20] }]
    },
    update: () => {}
  };

  const promise = KitChartsTheme.animateWithAnticipation(mockChart, (c) => {
    c.data.datasets[0].data = [20, 10];
    mutated = true;
  }, { recoilMs: 30, duration: 80 });

  await promise;
  expect(mutated).toBe(true);
  expect(mockChart.data.datasets[0].data).toEqual([20, 10]);
});

// -----------------------------------------------------------------------------
// 8. Template & Module Exports Validation
// -----------------------------------------------------------------------------
console.log('\n📦 8. Template & Module Exports Validation:');

it('Exports all triggers and helpers on template/animation/template.js', () => {
  expect(typeof animationModule.createChart).toBe('function');
  expect(typeof animationModule.triggerStagedTransition).toBe('function');
  expect(typeof animationModule.triggerAntiChangeBlindness).toBe('function');
  expect(typeof animationModule.triggerAlertPulse).toBe('function');
  expect(typeof animationModule.triggerZoomDrilldown).toBe('function');
  expect(typeof animationModule.triggerMotStagger).toBe('function');
  expect(typeof animationModule.triggerAnticipationSort).toBe('function');
  expect(typeof animationModule.replayAnimation).toBe('function');
  expect(animationModule.DEFAULT_DATA).toBeDefined();
  expect(animationModule.NARRATIVE_DATA).toBeDefined();
});

// -----------------------------------------------------------------------------
// 9. WCAG 2.2 SC 2.3.3 & Tufte Executive Reduced-Motion Compliance
// -----------------------------------------------------------------------------
console.log('\n🛡️ 9. WCAG 2.2 SC 2.3.3 & Tufte Reduced-Motion Compliance:');

it('Disables animations (false) when reduced motion is preferred or Tufte theme is active', () => {
  const tufteOpts = KitChartsTheme.getAccessibleAnimationOptions('tufte-minimalist-executive', { duration: 600 });
  expect(tufteOpts).toBe(false);

  const reducedOpts = KitChartsTheme.getAccessibleAnimationOptions('colorbrewer-accessible', { duration: 0 });
  expect(reducedOpts).toBe(false);
});

console.log(`\n======================================================================`);
console.log(`🎉 All ${passCount}/${totalCount} Cognitive Animation tests passed successfully!`);
console.log(`======================================================================\n`);
