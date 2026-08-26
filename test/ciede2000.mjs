/**
 * @file test/ciede2000.mjs
 * @description Standard CIEDE2000 Color Difference Metric (Sharma, Wu, & Dalal 2005).
 * Pure mathematical implementation: sRGB -> Linear RGB -> CIE XYZ (D65) -> CIELAB -> CIEDE2000 (ΔE00).
 */

/**
 * Converts sRGB hex string (#RRGGBB or #RGB) to normalized [0, 1] sRGB components.
 * @param {string} hex
 * @returns {[number, number, number]} [r, g, b]
 */
export function hexToRgb01(hex) {
  let c = hex.replace('#', '').trim();
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  const num = parseInt(c, 16);
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;
  return [r, g, b];
}

/**
 * Gamma expansion: sRGB to Linear RGB
 * @param {number} c - sRGB component [0, 1]
 * @returns {number} Linear RGB component [0, 1]
 */
function sRgbToLinear(c) {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Linear RGB to CIE XYZ (Standard D65 Illuminant)
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {[number, number, number]} [X, Y, Z]
 */
export function rgbToXyz(r, g, b) {
  const lr = sRgbToLinear(r);
  const lg = sRgbToLinear(g);
  const lb = sRgbToLinear(b);

  const x = lr * 0.4124564 + lg * 0.3575761 + lb * 0.1804375;
  const y = lr * 0.2126729 + lg * 0.7151522 + lb * 0.0721750;
  const z = lr * 0.0193339 + lg * 0.1191920 + lb * 0.9503041;

  return [x, y, z];
}

/**
 * CIE XYZ to CIELAB (D65 Reference White: Xn=0.95047, Yn=1.00000, Zn=1.08883)
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @returns {[number, number, number]} [L*, a*, b*]
 */
export function xyzToLab(x, y, z) {
  const Xn = 0.95047;
  const Yn = 1.00000;
  const Zn = 1.08883;

  const xr = x / Xn;
  const yr = y / Yn;
  const zr = z / Zn;

  const delta = 6 / 29;
  const deltaSq = delta * delta;
  const deltaCb = deltaSq * delta;

  const f = (t) => t > deltaCb ? Math.cbrt(t) : (t / (3 * deltaSq)) + (4 / 29);

  const fx = f(xr);
  const fy = f(yr);
  const fz = f(zr);

  const L = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const b = 200 * (fy - fz);

  return [L, a, b];
}

/**
 * Converts Hex string directly to CIELAB [L*, a*, b*]
 * @param {string} hex
 * @returns {[number, number, number]}
 */
export function hexToLab(hex) {
  const [r, g, b] = hexToRgb01(hex);
  const [x, y, z] = rgbToXyz(r, g, b);
  return xyzToLab(x, y, z);
}

/**
 * Computes CIEDE2000 Color Difference ΔE00 between two CIELAB colors (Sharma et al. 2005).
 *
 * @param {[number, number, number]} lab1 - [L1*, a1*, b1*]
 * @param {[number, number, number]} lab2 - [L2*, a2*, b2*]
 * @param {number} [kL=1]
 * @param {number} [kC=1]
 * @param {number} [kH=1]
 * @returns {number} ΔE00
 */
export function ciede2000(lab1, lab2, kL = 1, kC = 1, kH = 1) {
  const [L1, a1, b1] = lab1;
  const [L2, a2, b2] = lab2;

  const deg2rad = Math.PI / 180;
  const rad2deg = 180 / Math.PI;

  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);
  const C_bar = (C1 + C2) / 2;

  const G = 0.5 * (1 - Math.sqrt(Math.pow(C_bar, 7) / (Math.pow(C_bar, 7) + Math.pow(25, 7))));

  const a1_prime = (1 + G) * a1;
  const a2_prime = (1 + G) * a2;

  const C1_prime = Math.sqrt(a1_prime * a1_prime + b1 * b1);
  const C2_prime = Math.sqrt(a2_prime * a2_prime + b2 * b2);

  const getH_prime = (a_p, b) => {
    if (a_p === 0 && b === 0) return 0;
    let h = Math.atan2(b, a_p) * rad2deg;
    if (h < 0) h += 360;
    return h;
  };

  const h1_prime = getH_prime(a1_prime, b1);
  const h2_prime = getH_prime(a2_prime, b2);

  const deltaL_prime = L2 - L1;
  const deltaC_prime = C2_prime - C1_prime;

  let deltah_prime = 0;
  if (C1_prime * C2_prime !== 0) {
    const diff = h2_prime - h1_prime;
    if (Math.abs(diff) <= 180) {
      deltah_prime = diff;
    } else if (diff > 180) {
      deltah_prime = diff - 360;
    } else {
      deltah_prime = diff + 360;
    }
  }

  const deltaH_prime = 2 * Math.sqrt(C1_prime * C2_prime) * Math.sin((deltah_prime / 2) * deg2rad);

  const L_bar_prime = (L1 + L2) / 2;
  const C_bar_prime = (C1_prime + C2_prime) / 2;

  let H_bar_prime = 0;
  if (C1_prime * C2_prime === 0) {
    H_bar_prime = h1_prime + h2_prime;
  } else {
    const sum = h1_prime + h2_prime;
    const diff = Math.abs(h1_prime - h2_prime);
    if (diff <= 180) {
      H_bar_prime = sum / 2;
    } else if (sum < 360) {
      H_bar_prime = (sum + 360) / 2;
    } else {
      H_bar_prime = (sum - 360) / 2;
    }
  }

  const T = 1
    - 0.17 * Math.cos((H_bar_prime - 30) * deg2rad)
    + 0.24 * Math.cos((2 * H_bar_prime) * deg2rad)
    + 0.32 * Math.cos((3 * H_bar_prime + 6) * deg2rad)
    - 0.20 * Math.cos((4 * H_bar_prime - 63) * deg2rad);

  const deltaTheta = 30 * Math.exp(-Math.pow((H_bar_prime - 275) / 25, 2));
  const RC = 2 * Math.sqrt(Math.pow(C_bar_prime, 7) / (Math.pow(C_bar_prime, 7) + Math.pow(25, 7)));

  const SL = 1 + ((0.015 * Math.pow(L_bar_prime - 50, 2)) / Math.sqrt(20 + Math.pow(L_bar_prime - 50, 2)));
  const SC = 1 + 0.045 * C_bar_prime;
  const SH = 1 + 0.015 * C_bar_prime * T;
  const RT = -Math.sin(2 * deltaTheta * deg2rad) * RC;

  const dL = deltaL_prime / (kL * SL);
  const dC = deltaC_prime / (kC * SC);
  const dH = deltaH_prime / (kH * SH);

  const deltaE00 = Math.sqrt(dL * dL + dC * dC + dH * dH + RT * dC * dH);
  return deltaE00;
}

/**
 * Computes ΔE00 directly between two Hex color strings.
 * @param {string} hex1
 * @param {string} hex2
 * @returns {number}
 */
export function deltaEHex(hex1, hex2) {
  const lab1 = hexToLab(hex1);
  const lab2 = hexToLab(hex2);
  return ciede2000(lab1, lab2);
}
