/**
 * @file test/challenger-m2-empirical-suite.mjs
 * @description Empirical & Adversarial Mathematical Stress-Testing Suite for Milestone 2
 * Tests:
 * 1. Fitts' Law calculations and hit testing under extreme parameters (D=10 to 1000px, W=1 to 50px, hitRadius=0 to 30px)
 * 2. computeAntiOcclusionTooltipPosition across 200+ randomized coordinates and extreme boundaries
 * 3. Duration scaling ΔT(N) across N=0, 1, 10, 100, 1000, 100000, negative, NaN, non-numeric inputs
 * 4. isReducedMotionPreferred and getAccessibleAnimationOptions across simulated window.matchMedia environments
 * 5. Theme tokens consistency & interaction presets verification
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import KitChartsTheme, {
  THEMES,
  THEME_NAMES,
  DEFAULT_THEME,
  getThemeTokens,
  getChartDefaultOptions,
  isReducedMotionPreferred,
  getAnimationDuration,
  getAccessibleAnimationOptions,
  getSpatialInteractionOptions,
  getTemporalInteractionOptions,
  getPartitionInteractionOptions,
  getExecutiveModeOptions,
  computeAntiOcclusionTooltipPosition
} from '../themes/theme-tokens.js';

// -----------------------------------------------------------------------------
// SUITE 1: FITTS' LAW & HIT TESTING UNDER EXTREME PARAMETERS
// -----------------------------------------------------------------------------

describe('M2 Challenger — 1. Fitts Law & Hit Testing Parameter Stress Testing', () => {
  const a = 150; // ms baseline cognitive-motor reaction time
  const b = 180; // ms/bit movement time slope

  function calcID(D, W_effective) {
    if (W_effective <= 0) return Infinity;
    return Math.log2(D / W_effective + 1);
  }

  function calcMT(D, W_effective) {
    const id = calcID(D, W_effective);
    return a + b * id;
  }

  function calcThroughput(D, W_effective) {
    const id = calcID(D, W_effective);
    const mt = calcMT(D, W_effective);
    return id / (mt / 1000); // bits/second
  }

  it('1.1 Stress test ID and MT across extreme grid: D in [10, 1000], W in [1, 50], hitRadius in [0, 30]', () => {
    const distances = [10, 20, 50, 100, 200, 300, 500, 750, 1000];
    const rawWidths = [1, 2, 3, 4, 5, 8, 10, 15, 20, 30, 50];
    const hitRadii = [0, 2, 4, 6, 8, 10, 12, 14, 18, 20, 25, 30];

    let evaluationsCount = 0;

    for (const D of distances) {
      for (const W of rawWidths) {
        for (const r of hitRadii) {
          const We = W + 2 * r;
          const id = calcID(D, We);
          const mt = calcMT(D, We);
          const tp = calcThroughput(D, We);

          evaluationsCount++;

          // Invariant 1: ID is non-negative and finite
          assert(Number.isFinite(id) && id >= 0, `ID invalid (${id}) for D=${D}, W=${W}, r=${r}`);

          // Invariant 2: MT is >= a (150ms) and finite
          assert(Number.isFinite(mt) && mt >= a, `MT invalid (${mt}) for D=${D}, W=${W}, r=${r}`);

          // Invariant 3: Throughput is finite and positive for D > 0
          if (D > 0) {
            assert(Number.isFinite(tp) && tp >= 0, `Throughput invalid (${tp}) for D=${D}, W=${W}, r=${r}`);
          }
        }
      }
    }

    assert.equal(evaluationsCount, distances.length * rawWidths.length * hitRadii.length);
    assert.equal(evaluationsCount, 9 * 11 * 12); // 1188 parameter evaluations
  });

  it('1.2 Verify strictly monotonic properties: d(MT)/d(D) > 0 and d(MT)/d(We) < 0', () => {
    const D_list = [10, 50, 100, 250, 500, 1000];
    const We_list = [1, 5, 10, 20, 30, 50, 70];

    // Distance monotonicity check
    for (const We of We_list) {
      let prevMT = -1;
      for (const D of D_list) {
        const mt = calcMT(D, We);
        assert(mt > prevMT, `Distance monotonicity violated for We=${We}: D=${D}, mt=${mt} <= prev=${prevMT}`);
        prevMT = mt;
      }
    }

    // Width / HitRadius monotonicity check
    for (const D of D_list) {
      let prevMT = Infinity;
      for (const We of We_list) {
        const mt = calcMT(D, We);
        assert(mt < prevMT, `Width monotonicity violated for D=${D}: We=${We}, mt=${mt} >= prev=${prevMT}`);
        prevMT = mt;
      }
    }
  });

  it('1.3 Verify psychophysical hitRadius gains across all preset chart helpers', () => {
    const D = 300;
    const rawPointWidth = 3;
    const rawMT = calcMT(D, rawPointWidth);

    // Test default preset (hitRadius = 10) -> We = 23
    const defOpts = getChartDefaultOptions();
    const r_def = defOpts.elements.point.hitRadius;
    assert.equal(r_def, 10);
    const mt_def = calcMT(D, rawPointWidth + 2 * r_def);
    const gain_def = (rawMT - mt_def) / rawMT;
    assert(gain_def > 0.35 && gain_def < 0.40, `Default gain was ${gain_def * 100}%, expected ~38%`);

    // Test spatial preset (hitRadius = 14) -> We = 31
    const spatialOpts = getSpatialInteractionOptions();
    const r_spatial = spatialOpts.elements.point.hitRadius;
    assert.equal(r_spatial, 14);
    const mt_spatial = calcMT(D, rawPointWidth + 2 * r_spatial);
    const gain_spatial = (rawMT - mt_spatial) / rawMT;
    assert(gain_spatial > 0.40 && gain_spatial < 0.46, `Spatial gain was ${gain_spatial * 100}%, expected ~43%`);

    // Test temporal preset (hitRadius = 12) -> We = 27
    const temporalOpts = getTemporalInteractionOptions();
    const r_temporal = temporalOpts.elements.point.hitRadius;
    assert.equal(r_temporal, 12);
    const mt_temporal = calcMT(D, rawPointWidth + 2 * r_temporal);
    const gain_temporal = (rawMT - mt_temporal) / rawMT;
    assert(gain_temporal > 0.38 && gain_temporal < 0.44, `Temporal gain was ${gain_temporal * 100}%, expected ~41%`);

    // Test partition preset (hitRadius = 8) -> We = 19
    const partOpts = getPartitionInteractionOptions();
    const r_part = partOpts.elements.point.hitRadius;
    assert.equal(r_part, 8);
    const mt_part = calcMT(D, rawPointWidth + 2 * r_part);
    const gain_part = (rawMT - mt_part) / rawMT;
    assert(gain_part > 0.30 && gain_part < 0.37, `Partition gain was ${gain_part * 100}%, expected ~34%`);
  });
});

// -----------------------------------------------------------------------------
// SUITE 2: COMPUTE ANTI-OCCLUSION TOOLTIP POSITION STRESS TESTS
// -----------------------------------------------------------------------------

describe('M2 Challenger — 2. computeAntiOcclusionTooltipPosition Stress Testing', () => {
  const canvas = { width: 800, height: 600 };
  const tooltip = { width: 140, height: 70 };

  it('2.1 Stress test 200+ randomized coordinates across and beyond canvas bounds', () => {
    const margin = 8;
    const offset = 12;
    let randomTestsCount = 0;

    // Seeded-like deterministic pseudo-random generator
    let seed = 123456789;
    function rnd() {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    }

    for (let i = 0; i < 250; i++) {
      const px = Math.round((rnd() * 1200) - 200); // [-200, 1000]
      const py = Math.round((rnd() * 900) - 150);  // [-150, 750]

      const pos = computeAntiOcclusionTooltipPosition({ x: px, y: py }, tooltip, canvas, offset, margin);
      randomTestsCount++;

      // Invariants:
      assert(Number.isInteger(pos.x), `x must be integer at (${px}, ${py}): ${pos.x}`);
      assert(Number.isInteger(pos.y), `y must be integer at (${px}, ${py}): ${pos.y}`);
      assert(['top', 'bottom'].includes(pos.caretPosition), `Invalid caretPosition: ${pos.caretPosition}`);
      assert(['left', 'center', 'right'].includes(pos.align), `Invalid align: ${pos.align}`);

      // Vertical quadrant rule:
      // If py - th - offset < margin => must flip to top quadrant: y = py + offset, caretPosition = 'top'
      if (py - tooltip.height - offset < margin) {
        assert.equal(pos.caretPosition, 'top', `Expected caret top for py=${py}`);
        // If flipped, y initially py + offset; if bottom edge exceeds ch-margin, it clamps
        const expectedYUnclamped = py + offset;
        if (expectedYUnclamped + tooltip.height > canvas.height - margin) {
          assert.equal(pos.y, canvas.height - tooltip.height - margin, `Bottom clamp failed for py=${py}`);
        } else {
          assert.equal(pos.y, expectedYUnclamped, `Unclamped top flip failed for py=${py}`);
        }
      } else {
        assert.equal(pos.caretPosition, 'bottom', `Expected caret bottom for py=${py}`);
      }

      // Horizontal containment within canvas bounds when tw <= cw - 2*margin
      if (px - tooltip.width / 2 < margin) {
        assert.equal(pos.x, margin, `Left clamp failed for px=${px}`);
        assert.equal(pos.align, 'left', `Left align failed for px=${px}`);
      } else if (px - tooltip.width / 2 + tooltip.width > canvas.width - margin) {
        assert.equal(pos.x, canvas.width - tooltip.width - margin, `Right clamp failed for px=${px}`);
        assert.equal(pos.align, 'right', `Right align failed for px=${px}`);
      } else {
        assert.equal(pos.align, 'center', `Center align failed for px=${px}`);
        assert.equal(pos.x, Math.round(px - tooltip.width / 2));
      }
    }

    assert.equal(randomTestsCount, 250);
  });

  it('2.2 Exact 4 corners stress test: (0,0), (cw, 0), (0, ch), (cw, ch)', () => {
    const cw = 800;
    const ch = 600;
    const tw = 120;
    const th = 60;
    const margin = 10;
    const offset = 15;
    const cDim = { width: cw, height: ch };
    const tDim = { width: tw, height: th };

    // 1. Top-Left Corner (0, 0)
    const tl = computeAntiOcclusionTooltipPosition({ x: 0, y: 0 }, tDim, cDim, offset, margin);
    assert.equal(tl.caretPosition, 'top');
    assert.equal(tl.align, 'left');
    assert.equal(tl.x, margin); // 10
    assert.equal(tl.y, 0 + offset); // 15

    // 2. Top-Right Corner (cw, 0)
    const tr = computeAntiOcclusionTooltipPosition({ x: cw, y: 0 }, tDim, cDim, offset, margin);
    assert.equal(tr.caretPosition, 'top');
    assert.equal(tr.align, 'right');
    assert.equal(tr.x, cw - tw - margin); // 800 - 120 - 10 = 670
    assert.equal(tr.y, 0 + offset); // 15

    // 3. Bottom-Left Corner (0, ch)
    const bl = computeAntiOcclusionTooltipPosition({ x: 0, y: ch }, tDim, cDim, offset, margin);
    assert.equal(bl.caretPosition, 'bottom');
    assert.equal(bl.align, 'left');
    assert.equal(bl.x, margin); // 10
    // ty = 600 - 60 - 15 = 525. 525 + 60 = 585 <= 600 - 10 = 590, so unclamped 525
    assert.equal(bl.y, ch - th - offset); // 525

    // 4. Bottom-Right Corner (cw, ch)
    const br = computeAntiOcclusionTooltipPosition({ x: cw, y: ch }, tDim, cDim, offset, margin);
    assert.equal(br.caretPosition, 'bottom');
    assert.equal(br.align, 'right');
    assert.equal(br.x, cw - tw - margin); // 670
    assert.equal(br.y, ch - th - offset); // 525
  });

  it('2.3 Extreme and pathological inputs (negative coords, nulls, oversized tooltip)', () => {
    // 1. Far negative point (-500, -300)
    const neg = computeAntiOcclusionTooltipPosition({ x: -500, y: -300 }, tooltip, canvas, 12, 8);
    assert.equal(neg.caretPosition, 'top');
    assert.equal(neg.align, 'left');
    assert.equal(neg.x, 8);
    assert.equal(neg.y, -300 + 12);

    // 2. Oversized tooltip (tooltip larger than canvas: tw = 1000 > cw = 800)
    const bigTooltip = { width: 1000, height: 700 };
    const bigPos = computeAntiOcclusionTooltipPosition({ x: 400, y: 300 }, bigTooltip, canvas);
    assert(Number.isFinite(bigPos.x));
    assert(Number.isFinite(bigPos.y));
    assert(['top', 'bottom'].includes(bigPos.caretPosition));
    assert(['left', 'center', 'right'].includes(bigPos.align));

    // 3. Null / undefined argument fallbacks
    const nullPos = computeAntiOcclusionTooltipPosition(null, null, null);
    assert.ok(nullPos);
    assert.equal(typeof nullPos.x, 'number');
    assert.equal(typeof nullPos.y, 'number');
  });
});

// -----------------------------------------------------------------------------
// SUITE 3: DURATION SCALING FORMULA DELTA T(N) STRESS TESTS
// -----------------------------------------------------------------------------

describe('M2 Challenger — 3. Duration Scaling ΔT(N) Formula Stress Testing', () => {
  it('3.1 Verify calibrated values across requested N: 0, 1, 10, 100, 1000, 100000', () => {
    // N = 0 -> 200ms floor
    assert.equal(getAnimationDuration(0), 200);

    // N = 1 -> 350ms base
    assert.equal(getAnimationDuration(1), 350);

    // N = 10 -> 350 * (1 + 0.25 * log10(10)) = 350 * 1.25 = 437.5 -> 438ms
    assert.equal(getAnimationDuration(10), 438);

    // N = 100 -> 350 * (1 + 0.25 * 2) = 350 * 1.5 = 525ms
    assert.equal(getAnimationDuration(100), 525);

    // N = 1000 -> 350 * (1 + 0.25 * 3) = 350 * 1.75 = 612.5 -> capped at 600ms
    assert.equal(getAnimationDuration(1000), 600);

    // N = 100000 -> capped at 600ms
    assert.equal(getAnimationDuration(100000), 600);
  });

  it('3.2 Adversarial inputs: negative, zero, fractional, NaN, strings, objects, infinities', () => {
    // Negative numbers
    assert.equal(getAnimationDuration(-1), 200);
    assert.equal(getAnimationDuration(-9999), 200);
    assert.equal(getAnimationDuration(-Infinity), 200);

    // Non-numeric / NaN
    assert.equal(getAnimationDuration(NaN), 200);
    assert.equal(getAnimationDuration(undefined), 350); // Default param elementCount = 1
    assert.equal(getAnimationDuration(null), 200); // Number(null) is 0 -> count <= 0 -> 200
    assert.equal(getAnimationDuration('invalid_string'), 200);
    assert.equal(getAnimationDuration({}), 200);
    assert.equal(getAnimationDuration([]), 200);

    // Numeric strings
    assert.equal(getAnimationDuration('1'), 350);
    assert.equal(getAnimationDuration('10'), 438);
    assert.equal(getAnimationDuration('100'), 525);
    assert.equal(getAnimationDuration('10000'), 600);

    // Positive Infinity
    assert.equal(getAnimationDuration(Infinity), 600);
  });

  it('3.3 Custom base durations and bounds adherence', () => {
    // Custom base duration 250ms
    assert.equal(getAnimationDuration(1, 250), 250);
    assert.equal(getAnimationDuration(10, 250), Math.min(600, Math.max(200, Math.round(250 * 1.25)))); // 313ms
    assert.equal(getAnimationDuration(10000, 250), Math.min(600, Math.round(250 * (1 + 0.25 * 4)))); // 500ms

    // Base duration 0 or negative
    assert.equal(getAnimationDuration(10, 0), 438); // 0 falsy falls back to default 350ms base -> 438ms
    assert.equal(getAnimationDuration(10, -100), 200); // Negative base clamps to minimum floor 200ms
  });
});

// -----------------------------------------------------------------------------
// SUITE 4: REDUCED MOTION & ACCESSIBILITY MATRICES
// -----------------------------------------------------------------------------

describe('M2 Challenger — 4. Reduced Motion & A11y Simulation Matrix', () => {
  it('4.1 Simulated window.matchMedia: true, false, undefined, threw error, SSR', () => {
    // Case 1: Pure SSR / Node.js (no window)
    delete global.window;
    assert.equal(isReducedMotionPreferred(), false);

    // Case 2: window exists, matchMedia is undefined
    global.window = {};
    assert.equal(isReducedMotionPreferred(), false);

    // Case 3: matchMedia returns matches: true
    global.window = {
      matchMedia: (query) => ({
        matches: query.includes('prefers-reduced-motion: reduce')
      })
    };
    assert.equal(isReducedMotionPreferred(), true);

    // Case 4: matchMedia returns matches: false
    global.window = {
      matchMedia: () => ({ matches: false })
    };
    assert.equal(isReducedMotionPreferred(), false);

    // Case 5: matchMedia throws an exception (e.g. cross-origin iframe security error)
    global.window = {
      matchMedia: () => {
        throw new Error('SecurityError: Access denied');
      }
    };
    assert.equal(isReducedMotionPreferred(), false); // Must be handled gracefully without bubbling exception

    // Cleanup
    delete global.window;
  });

  it('4.2 getAccessibleAnimationOptions across combinatorial matrix', () => {
    const themes = [
      'colorbrewer-accessible',
      'viridis-perceptual',
      'tufte-minimalist-executive',
      'nord-cognitive-dark'
    ];

    const motionStates = [false, true];
    const optionCases = [
      {},
      { duration: 0 },
      { animate: false },
      { animation: false },
      { duration: 500, easing: 'linear' }
    ];

    for (const themeSlug of themes) {
      const isTufte = themeSlug === 'tufte-minimalist-executive';

      for (const motionReduced of motionStates) {
        global.window = {
          matchMedia: () => ({ matches: motionReduced })
        };

        for (const opts of optionCases) {
          const res = getAccessibleAnimationOptions(themeSlug, opts);

          const shouldBeFalse = isTufte || motionReduced || opts.duration === 0 || opts.animate === false || opts.animation === false;

          if (shouldBeFalse) {
            assert.equal(res, false, `Expected false for theme=${themeSlug}, reducedMotion=${motionReduced}, opts=${JSON.stringify(opts)}`);
          } else {
            assert.equal(typeof res, 'object', `Expected config object for theme=${themeSlug}, reducedMotion=${motionReduced}, opts=${JSON.stringify(opts)}`);
            assert.equal(res.duration, opts.duration !== undefined ? opts.duration : 400);
            assert.equal(res.easing, opts.easing || 'easeOutQuart');
          }
        }
      }
    }

    delete global.window;
  });
});

// -----------------------------------------------------------------------------
// SUITE 5: THEME TOKENS CONSISTENCY & INTERACTION PRESETS
// -----------------------------------------------------------------------------

describe('M2 Challenger — 5. Theme Tokens Consistency & Interaction Presets', () => {
  it('5.1 All 8 themes have valid interaction options and tooltip styling in getChartDefaultOptions', () => {
    for (const name of THEME_NAMES) {
      const tokens = getThemeTokens(name);
      const opts = getChartDefaultOptions(tokens);
      const isTufte = name === 'tufte-minimalist-executive';

      assert.equal(opts.interaction.mode, 'nearest');
      assert.equal(opts.interaction.intersect, false);
      assert.equal(opts.elements.point.hitRadius, 10);
      assert.equal(opts.elements.point.radius, 4);

      if (isTufte) {
        assert.equal(opts.animation, false);
        assert.equal(opts.hover.animationDuration, 0);
        assert.equal(opts.plugins.tooltip.cornerRadius, 0);
      } else {
        assert.equal(opts.hover.animationDuration, 120);
        assert.equal(opts.plugins.tooltip.cornerRadius, 6);
      }
    }
  });

  it('5.2 Verify specialized family interaction helpers return proper structure and immutability', () => {
    const t = getThemeTokens('viridis-perceptual');

    const spatial = getSpatialInteractionOptions(t);
    assert.equal(spatial.interaction.mode, 'nearest');
    assert.equal(spatial.interaction.axis, 'xy');
    assert.equal(spatial.elements.point.hitRadius, 14);

    const temporal = getTemporalInteractionOptions(t);
    assert.equal(temporal.interaction.mode, 'index');
    assert.equal(temporal.interaction.axis, 'x');
    assert.equal(temporal.elements.point.hitRadius, 12);

    const temporalY = getTemporalInteractionOptions(t, 'y');
    assert.equal(temporalY.interaction.axis, 'y');

    const partition = getPartitionInteractionOptions(t);
    assert.equal(partition.interaction.mode, 'nearest');
    assert.equal(partition.interaction.intersect, true);
    assert.equal(partition.elements.point.hitRadius, 8);

    const exec = getExecutiveModeOptions(t);
    assert.equal(exec.animation, false);
    assert.equal(exec.elements.bar.borderRadius, 0);
    assert.equal(exec.plugins.legend.display, false);
  });
});
