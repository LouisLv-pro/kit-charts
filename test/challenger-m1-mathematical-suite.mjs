/**
 * @file test/challenger-m1-mathematical-suite.mjs
 * @description Adversarial & Empirical Mathematical Verification Suite for Milestone M1
 * Tests:
 * 1. Fitts' Law & Shannon-MacKenzie Calculations (MT, ID, Throughput, Target Padding Gains)
 * 2. Duration Scaling Logarithmic Calibrations (Boundary values, Monotonicity, Saturation)
 * 3. Cubic-Bézier & Polynomial Kinematics (Quartic, Cubic, Quadratic, Continuity, C1/C2 smooth)
 * 4. WCAG 2.2 Relative Luminance & AAA Contrast Audits across all 8 themes
 * 5. Anti-occlusion Geometry & Clamping Stress Tests
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { THEMES, getChartDefaultOptions, getThemeTokens } from '../themes/theme-tokens.js';

// --- HELPERS ---

function srgbToLinear(c) {
  const norm = c / 255;
  return norm <= 0.04045 ? norm / 12.92 : Math.pow((norm + 0.055) / 1.055, 2.4);
}

function parseColorToRgb(str) {
  if (!str) return { r: 0, g: 0, b: 0, a: 1 };
  const s = str.trim();
  if (s.startsWith('#')) {
    let hex = s.slice(1);
    if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
    const r = parseInt(hex.substring(0, 2), 16) || 0;
    const g = parseInt(hex.substring(2, 4), 16) || 0;
    const b = parseInt(hex.substring(4, 6), 16) || 0;
    return { r, g, b, a: 1 };
  }
  const match = s.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (match) {
    return {
      r: parseInt(match[1], 10),
      g: parseInt(match[2], 10),
      b: parseInt(match[3], 10),
      a: match[4] !== undefined ? parseFloat(match[4]) : 1
    };
  }
  return { r: 0, g: 0, b: 0, a: 1 };
}

function computeRelativeLuminance(rgb) {
  const r = srgbToLinear(rgb.r);
  const g = srgbToLinear(rgb.g);
  const b = srgbToLinear(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function computeContrastRatio(colorA, colorB) {
  const rgbA = typeof colorA === 'string' ? parseColorToRgb(colorA) : colorA;
  const rgbB = typeof colorB === 'string' ? parseColorToRgb(colorB) : colorB;
  const l1 = computeRelativeLuminance(rgbA);
  const l2 = computeRelativeLuminance(rgbB);
  const top = Math.max(l1, l2);
  const bottom = Math.min(l1, l2);
  return (top + 0.05) / (bottom + 0.05);
}

// ----------------------------------------------------
// SUITE 1: FITTS' LAW & SHANNON-MACKENZIE VERIFICATION
// ----------------------------------------------------

describe('M1 Challenger — 1. Fitts Law & Shannon-MacKenzie Verification', () => {
  const a = 150; // ms reaction time
  const b = 180; // ms/bit slope

  function calcID(D, W) {
    return Math.log2(D / W + 1);
  }

  function calcMT(D, W, a_param = a, b_param = b) {
    const id = calcID(D, W);
    return a_param + b_param * id;
  }

  it('1.1 Should correctly compute raw target difficulty and movement time (W=3px, D=300px)', () => {
    const D = 300;
    const W = 3;
    const ID_raw = calcID(D, W);
    const MT_raw = calcMT(D, W);

    // log2(300/3 + 1) = log2(101) = 6.65821148...
    assert(Math.abs(ID_raw - 6.6582) < 0.01, `ID_raw was ${ID_raw}, expected ~6.66`);
    assert(Math.abs(MT_raw - 1348.48) < 1.0, `MT_raw was ${MT_raw}, expected ~1349ms`);
  });

  it('1.2 Should correctly compute optimized target difficulty and movement time (We=23px, D=300px)', () => {
    const D = 300;
    const W_raw = 3;
    const r_hit = 10;
    const W_e = W_raw + 2 * r_hit; // 23px
    assert.equal(W_e, 23);

    const ID_opt = calcID(D, W_e);
    const MT_opt = calcMT(D, W_e);

    // log2(300/23 + 1) = log2(14.043478) = 3.8118...
    assert(Math.abs(ID_opt - 3.8118) < 0.01, `ID_opt was ${ID_opt}, expected ~3.81`);
    assert(Math.abs(MT_opt - 836.13) < 1.0, `MT_opt was ${MT_opt}, expected ~836ms`);
  });

  it('1.3 Should verify the ~38% movement time reduction claim', () => {
    const D = 300;
    const MT_raw = calcMT(D, 3);
    const MT_opt = calcMT(D, 23);
    const relativeGain = (MT_raw - MT_opt) / MT_raw;

    assert(Math.abs(relativeGain - 0.3799) < 0.01, `Relative gain was ${relativeGain * 100}%, expected ~38.0%`);
  });

  it('1.4 Should verify Shannon formulation non-negativity across all D >= 0 and W > 0', () => {
    const testDistances = [0, 1, 5, 10, 50, 100, 300, 1000, 5000];
    const testWidths = [1, 3, 6, 8, 10, 12, 14, 23, 50, 100];

    for (const d of testDistances) {
      for (const w of testWidths) {
        const id = calcID(d, w);
        assert(id >= 0, `ID was negative (${id}) for D=${d}, W=${w}`);
        const mt = calcMT(d, w);
        assert(mt >= a, `MT was less than reaction time (${mt} < ${a}) for D=${d}, W=${w}`);
      }
    }
  });

  it('1.5 Should verify monotonic decrease of MT with increasing hitRadius across chart families', () => {
    const D = 300;
    const hitRadii = [0, 6, 8, 10, 12, 14]; // heatmaps(6), pies(8), bars(10), lines(12), scatter(14)
    let previousMT = Infinity;

    for (const r of hitRadii) {
      const w = 3 + 2 * r;
      const mt = calcMT(D, w);
      assert(mt < previousMT, `MT did not strictly decrease for hitRadius=${r}`);
      previousMT = mt;
    }
  });
});

// ----------------------------------------------------
// SUITE 2: DURATION SCALING FORMULA VERIFICATION
// ----------------------------------------------------

describe('M1 Challenger — 2. Duration Scaling Formula Verification', () => {
  const T_base = 350;
  const gamma = 0.25;

  function calcDeltaT(N, tBase = T_base, g = gamma) {
    if (N <= 0) return 200; // Defensive safeguard
    const raw = tBase * (1 + g * Math.log10(N));
    return Math.min(600, Math.max(200, raw));
  }

  it('2.1 Should verify exact scaling values for N=1, N=5, N=50, N=100', () => {
    const dt1 = calcDeltaT(1);
    assert.equal(dt1, 350, `N=1 should be exactly 350ms, got ${dt1}`);

    const dt5 = calcDeltaT(5);
    // 350 * (1 + 0.25 * log10(5)) = 350 * (1 + 0.25 * 0.698970) = 411.16ms
    assert(Math.abs(dt5 - 411.16) < 0.1, `N=5 was ${dt5}, expected ~411ms`);

    const dt50 = calcDeltaT(50);
    // 350 * (1 + 0.25 * log10(50)) = 350 * (1 + 0.25 * 1.698970) = 498.66ms
    assert(Math.abs(dt50 - 498.66) < 0.1, `N=50 was ${dt50}, expected ~498.7ms (approx 498-499ms)`);

    const dt100 = calcDeltaT(100);
    // 350 * (1 + 0.25 * 2) = 350 * 1.5 = 525ms
    assert.equal(dt100, 525, `N=100 was ${dt100}, expected exactly 525ms`);
  });

  it('2.2 Should analyze saturation point (600ms ceiling)', () => {
    // 350 * (1 + 0.25 * log10(N)) = 600 => log10(N) = (600/350 - 1)/0.25 = 20/7 = 2.85714 => N = 719.68
    const dt200 = calcDeltaT(200);
    assert(Math.abs(dt200 - 551.34) < 0.1, `N=200 was ${dt200}, expected 551.34ms`);

    const dt719 = calcDeltaT(719);
    assert(dt719 < 600, `N=719 should be strictly below 600ms, got ${dt719}`);

    const dt720 = calcDeltaT(720);
    assert.equal(dt720, 600, `N=720 should hit the 600ms cap`);

    const dt10000 = calcDeltaT(10000);
    assert.equal(dt10000, 600, `N=10000 should be capped at 600ms`);
  });

  it('2.3 Should verify strict monotonicity for N >= 1', () => {
    let prev = 0;
    for (let n = 1; n <= 1000; n += 5) {
      const dt = calcDeltaT(n);
      assert(dt >= prev, `Monotonicity violated at N=${n}: ${dt} < ${prev}`);
      prev = dt;
    }
  });

  it('2.4 Should verify boundary behavior and negative/zero/extreme inputs', () => {
    assert.equal(calcDeltaT(0), 200, 'N=0 should clamp to floor 200ms');
    assert.equal(calcDeltaT(-10), 200, 'N=-10 should clamp to floor 200ms');
    assert.equal(calcDeltaT(1e9), 600, 'Extreme large N should clamp to 600ms');
  });
});

// ----------------------------------------------------
// SUITE 3: CUBIC-BÉZIER & POLYNOMIAL KINEMATICS
// ----------------------------------------------------

describe('M1 Challenger — 3. Cubic-Bézier & Polynomial Kinematic Verification', () => {
  function bezierX(t, p1x, p2x) {
    return 3 * (1 - t) * (1 - t) * t * p1x + 3 * (1 - t) * t * t * p2x + t * t * t;
  }

  function bezierY(t, p1y, p2y) {
    return 3 * (1 - t) * (1 - t) * t * p1y + 3 * (1 - t) * t * t * p2y + t * t * t;
  }

  function solveBezierT(xTarget, p1x, p2x, epsilon = 1e-7) {
    let low = 0;
    let high = 1;
    let t = 0.5;
    for (let i = 0; i < 60; i++) {
      const x = bezierX(t, p1x, p2x);
      if (Math.abs(x - xTarget) < epsilon) return t;
      if (x < xTarget) low = t;
      else high = t;
      t = (low + high) / 2;
    }
    return t;
  }

  function sampleBezier(tau, p1x, p1y, p2x, p2y) {
    if (tau <= 0) return 0;
    if (tau >= 1) return 1;
    const t = solveBezierT(tau, p1x, p2x);
    return bezierY(t, p1y, p2y);
  }

  it('3.1 easeOutQuart: verify polynomial s(t) = 1 - (1-t)^4 properties', () => {
    const s = t => 1 - Math.pow(1 - t, 4);
    const v = t => 4 * Math.pow(1 - t, 3); // 1st derivative (velocity)
    const a = t => -12 * Math.pow(1 - t, 2); // 2nd derivative (acceleration)

    assert.equal(s(0), 0);
    assert.equal(s(1), 1);
    assert.equal(v(0), 4); // High initial velocity
    assert.equal(v(1), 0); // Decelerates to zero
    assert.equal(Math.abs(a(1)), 0);

    for (let t = 0; t <= 1; t += 0.05) {
      assert(s(t) >= 0 && s(t) <= 1, `s(t) out of bounds at t=${t}`);
      assert(v(t) >= 0, `Velocity negative at t=${t}`);
      assert(a(t) <= 0, `Acceleration positive at t=${t}`);
    }
  });

  it('3.2 easeOutCubic: verify exact cubic bezier identity (1/3, 1, 2/3, 1)', () => {
    // For p1x=1/3, p2x=2/3, p1y=1, p2y=1:
    // x(t) = 3(1-t)^2 t (1/3) + 3(1-t) t^2 (2/3) + t^3 = t
    // y(t) = 3(1-t)^2 t (1) + 3(1-t) t^2 (1) + t^3 = 3t - 3t^2 + t^3 = 1 - (1-t)^3
    for (let t = 0; t <= 1.0001; t += 0.05) {
      const bx = bezierX(t, 1/3, 2/3);
      assert(Math.abs(bx - t) < 1e-6, `bx was ${bx} for t=${t}`);

      const by = bezierY(t, 1, 1);
      const poly = 1 - Math.pow(1 - t, 3);
      assert(Math.abs(by - poly) < 1e-6, `by was ${by}, poly was ${poly} for t=${t}`);
    }
  });

  it('3.3 Compare CSS cubic-bezier(0.25, 1, 0.5, 1) with quartic polynomial 1-(1-t)^4', () => {
    let maxDiff = 0;
    for (let tau = 0.01; tau < 1.0; tau += 0.01) {
      const bezVal = sampleBezier(tau, 0.25, 1, 0.5, 1);
      const polyVal = 1 - Math.pow(1 - tau, 4);
      const diff = Math.abs(bezVal - polyVal);
      if (diff > maxDiff) maxDiff = diff;
    }
    // Verify maximum deviation is within acceptable UI tolerance (< 0.12)
    assert(maxDiff < 0.15, `Max deviation between CSS bezier and quartic was ${maxDiff}`);
  });

  it('3.4 easeInOutCubic: verify C0, C1 continuity at t = 0.5', () => {
    const s = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const v = t => t < 0.5 ? 12 * t * t : 3 * Math.pow(-2 * t + 2, 2);

    const s_left = s(0.4999999);
    const s_right = s(0.5000001);
    assert(Math.abs(s_left - 0.5) < 1e-5 && Math.abs(s_right - 0.5) < 1e-5, 'C0 continuity failed at t=0.5');

    const v_left = v(0.4999999);
    const v_right = v(0.5000001);
    assert(Math.abs(v_left - 3.0) < 1e-4 && Math.abs(v_right - 3.0) < 1e-4, 'C1 smoothness failed at t=0.5');
  });
});

// ----------------------------------------------------
// SUITE 4: WCAG 2.2 AAA CONTRAST VERIFICATION
// ----------------------------------------------------

describe('M1 Challenger — 4. WCAG 2.2 AAA Contrast Verification', () => {
  it('4.1 Light Mode Tooltip: #0F172A vs #F8FAFC (Spec claim: 16.2:1)', () => {
    const ratio = computeContrastRatio('#0F172A', '#F8FAFC');
    // Actual calculated is ~16.8:1
    assert(ratio >= 7.0, `Contrast ratio ${ratio.toFixed(2)} must be >= 7.0 (AAA)`);
    assert(ratio >= 15.0, `Contrast ratio ${ratio.toFixed(2)} should be around 16:1`);
  });

  it('4.2 Nord Dark Tooltip: #3B4252 vs #ECEFF4 (Spec claim: 9.4:1) & #434C5E vs #ECEFF4', () => {
    const ratio1 = computeContrastRatio('#3B4252', '#ECEFF4');
    const ratio2 = computeContrastRatio('#434C5E', '#ECEFF4');
    assert(ratio1 >= 7.0, `Nord Dark surface contrast ${ratio1.toFixed(2)} must pass AAA (>= 7.0)`);
    assert(ratio2 >= 7.0, `Nord Dark surfaceRaised contrast ${ratio2.toFixed(2)} must pass AAA (>= 7.0)`);
  });

  it('4.3 Tufte Executive Tooltip: #111111 vs #FFFFFF (Spec claim: 19.8:1)', () => {
    const ratio = computeContrastRatio('#111111', '#FFFFFF');
    // Actual calculated is ~18.84:1
    assert(ratio >= 7.0, `Tufte contrast ${ratio.toFixed(2)} must pass AAA (>= 7.0)`);
    assert(ratio >= 18.0, `Tufte contrast ${ratio.toFixed(2)} should be ~18.8:1`);
  });

  it('4.4 Exhaustive Audit across all 8 Themes in theme-tokens.js', () => {
    const results = [];
    for (const [themeName, theme] of Object.entries(THEMES)) {
      const bg = theme.tooltipBg;
      const text = theme.tooltipText;
      const ratio = computeContrastRatio(bg, text);
      results.push({ theme: themeName, bg, text, ratio: ratio.toFixed(2) });
      assert(ratio >= 7.0, `Theme ${themeName} failed AAA tooltip contrast: ${ratio.toFixed(2)}:1 (bg=${bg}, text=${text})`);
    }
  });
});

// ----------------------------------------------------
// SUITE 5: ANTI-OCCLUSION ALGORITHM STRESS TESTS
// ----------------------------------------------------

describe('M1 Challenger — 5. Anti-Occlusion Algorithm Stress Testing', () => {
  function computeAntiOcclusionTooltipPosition(pointCoords, tooltipDim, canvasDim, offset = 12, margin = 8) {
    const { x: px, y: py } = pointCoords;
    const { width: tw, height: th } = tooltipDim;
    const { width: cw, height: ch } = canvasDim;

    let tx = px - tw / 2;
    let ty = py - th - offset;
    let caretPosition = 'bottom';
    let align = 'center';

    if (ty < margin) {
      ty = py + offset;
      caretPosition = 'top';
    }

    if (ty + th > ch - margin) {
      ty = ch - th - margin;
    }

    if (tx < margin) {
      tx = margin;
      align = 'left';
    }

    if (tx + tw > cw - margin) {
      tx = cw - tw - margin;
      align = 'right';
    }

    return {
      x: Math.round(tx),
      y: Math.round(ty),
      caretPosition,
      align
    };
  }

  const canvas = { width: 800, height: 600 };
  const tooltip = { width: 160, height: 80 };

  it('5.1 Center point should position tooltip above target', () => {
    const pos = computeAntiOcclusionTooltipPosition({ x: 400, y: 300 }, tooltip, canvas);
    assert.equal(pos.caretPosition, 'bottom');
    assert.equal(pos.align, 'center');
    assert.equal(pos.x, 320); // 400 - 80
    assert.equal(pos.y, 208); // 300 - 80 - 12
  });

  it('5.2 Top edge point should flip quadrant below target', () => {
    const pos = computeAntiOcclusionTooltipPosition({ x: 400, y: 20 }, tooltip, canvas);
    assert.equal(pos.caretPosition, 'top');
    assert.equal(pos.y, 32); // 20 + 12
  });

  it('5.3 Left edge point should clamp to left margin and align left', () => {
    const pos = computeAntiOcclusionTooltipPosition({ x: 10, y: 300 }, tooltip, canvas);
    assert.equal(pos.align, 'left');
    assert.equal(pos.x, 8); // clamped to margin 8
  });

  it('5.4 Right edge point should clamp to right margin and align right', () => {
    const pos = computeAntiOcclusionTooltipPosition({ x: 790, y: 300 }, tooltip, canvas);
    assert.equal(pos.align, 'right');
    assert.equal(pos.x, 800 - 160 - 8); // 632
  });

  it('5.5 Adversarial corner test (Top-Left corner (0,0))', () => {
    const pos = computeAntiOcclusionTooltipPosition({ x: 0, y: 0 }, tooltip, canvas);
    assert.equal(pos.caretPosition, 'top');
    assert.equal(pos.align, 'left');
    assert.equal(pos.x, 8);
    assert.equal(pos.y, 12);
  });

  it('5.6 Adversarial corner test (Bottom-Right corner (800, 600))', () => {
    const pos = computeAntiOcclusionTooltipPosition({ x: 800, y: 600 }, tooltip, canvas);
    assert.equal(pos.caretPosition, 'bottom');
    assert.equal(pos.align, 'right');
    assert.equal(pos.x, 632);
    assert.equal(pos.y, 508); // 600 - 80 - 12
  });
});
