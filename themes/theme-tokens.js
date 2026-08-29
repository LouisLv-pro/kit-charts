/**
 * @file themes/theme-tokens.js
 * @description Universal Theme Token Registry & Injection Engine for kit-charts.
 * Universal Module (runs on file://, http://, and Node.js).
 * @version 2.0.0
 * @author kit-charts Team
 * @license MIT
 */

const THEMES = {
  'colorbrewer-accessible': {
    name: 'colorbrewer-accessible',
    id: '01-colorbrewer-accessible',
    label: 'ColorBrewer Accessible',
    isDark: false,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontMono: "'JetBrains Mono', SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    bg: '#FFFFFF',
    surface: '#F8FAFC',
    surfaceRaised: '#FFFFFF',
    border: '#E2E8F0',
    borderStrong: '#CBD5E1',
    textPrimary: '#0F172A',
    textSecondary: '#334155',
    textMuted: '#64748B',
    gridColor: 'rgba(15, 23, 42, 0.06)',
    axisColor: '#94A3B8',
    zeroLine: '#475569',
    palette: [
      '#2B8CBE',
      '#E66101',
      '#5E3C99',
      '#4DAC26',
      '#D01C8B',
      '#FDB863',
      '#B8E186',
      '#999999'
    ],
    sequential: ['#EFF3FF', '#C6DBEF', '#9ECAE1', '#6BAED6', '#3182BD', '#08519C'],
    divergent: {
      neg: '#CA0020',
      mid: '#FFFFFF',
      pos: '#0571B0',
      neg3: '#CA0020',
      neg2: '#F4A582',
      neg1: '#FDDBC7',
      center: '#F7F7F7',
      pos1: '#D1E5F0',
      pos2: '#67A9CF',
      pos3: '#0571B0'
    },
    emphasis: {
      focal: '#2B8CBE',
      benchmark: '#475569',
      context: '#CBD5E1',
      anomaly: '#D01C8B',
      forecastAlpha: 0.50
    },
    status: {
      success: '#2E7D32',
      warning: '#EF6C00',
      danger: '#C62828',
      info: '#1565C0',
      neutral: '#94A3B8'
    },
    semantic: {
      positive: '#2E7D32',
      negative: '#C62828',
      warning: '#EF6C00',
      info: '#1565C0',
      neutral: '#999999'
    },
    tooltipBg: 'rgba(15, 23, 42, 0.92)',
    tooltipText: '#F8FAFC',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap'
  },
  'viridis-perceptual': {
    name: 'viridis-perceptual',
    id: '02-viridis-perceptual',
    label: 'Viridis Perceptual',
    isDark: false,
    fontFamily: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontMono: "'IBM Plex Mono', Menlo, Monaco, Consolas, monospace",
    bg: '#FFFFFF',
    surface: '#F8FAFC',
    surfaceRaised: '#FFFFFF',
    border: '#E2E8F0',
    borderStrong: '#CBD5E1',
    textPrimary: '#0F172A',
    textSecondary: '#334155',
    textMuted: '#64748B',
    gridColor: 'rgba(15, 23, 42, 0.06)',
    axisColor: '#94A3B8',
    zeroLine: '#475569',
    palette: [
      '#3E4A89',
      '#26828E',
      '#35B779',
      '#B4DE2C',
      '#440154',
      '#FDE725',
      '#31688E',
      '#1F9E89'
    ],
    sequential: [
      '#440154',
      '#482777',
      '#3E4A89',
      '#31688E',
      '#26828E',
      '#1F9E89',
      '#35B779',
      '#6DCD59',
      '#B4DE2C',
      '#FDE725'
    ],
    divergent: {
      neg: '#440154',
      mid: '#FFFFFF',
      pos: '#22A884'
    },
    emphasis: {
      focal: '#26828E',
      benchmark: '#3E4A89',
      context: '#CBD5E1',
      anomaly: '#FDE725',
      forecastAlpha: 0.50
    },
    status: {
      success: '#22A884',
      warning: '#D8B400',
      danger: '#440154',
      info: '#2A788E',
      neutral: '#8E9AAF'
    },
    semantic: {
      positive: '#22A884',
      negative: '#440154',
      warning: '#FDE725',
      info: '#2A788E',
      neutral: '#414487'
    },
    tooltipBg: 'rgba(15, 23, 42, 0.92)',
    tooltipText: '#F8FAFC',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap'
  },
  'paul-tol-scientific': {
    name: 'paul-tol-scientific',
    id: '03-paul-tol-scientific',
    label: 'Paul Tol Scientific',
    isDark: false,
    fontFamily: "'Fira Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontMono: "'Fira Code', Menlo, Monaco, Consolas, monospace",
    bg: '#FFFFFF',
    surface: '#F8FAFC',
    surfaceRaised: '#FFFFFF',
    border: '#E2E8F0',
    borderStrong: '#CBD5E1',
    textPrimary: '#1E293B',
    textSecondary: '#334155',
    textMuted: '#64748B',
    gridColor: 'rgba(30, 41, 59, 0.06)',
    axisColor: '#94A3B8',
    zeroLine: '#475569',
    palette: [
      '#4477AA',
      '#EE6677',
      '#228833',
      '#CCBB44',
      '#66CCEE',
      '#AA3377',
      '#BBBBBB',
      '#555555'
    ],
    sequential: ['#FEFBE9', '#FCF7D5', '#F5EE9E', '#E5D965', '#C9B934', '#A8941C', '#846F11', '#5C4A08', '#332402'],
    divergent: {
      neg: '#EE6677',
      mid: '#FFFFFF',
      pos: '#4477AA'
    },
    emphasis: {
      focal: '#4477AA',
      benchmark: '#475569',
      context: '#BBBBBB',
      anomaly: '#EE6677',
      forecastAlpha: 0.50
    },
    status: {
      success: '#228833',
      warning: '#CCBB44',
      danger: '#EE6677',
      info: '#66CCEE',
      neutral: '#BBBBBB'
    },
    semantic: {
      positive: '#228833',
      negative: '#EE6677',
      warning: '#CCBB44',
      info: '#4477AA',
      neutral: '#BBBBBB'
    },
    tooltipBg: 'rgba(30, 41, 59, 0.92)',
    tooltipText: '#FFFFFF',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;500;600;700&family=Fira+Code:wght@400;500;600&display=swap'
  },
  'tableau-stone-categorical': {
    name: 'tableau-stone-categorical',
    id: '04-tableau-stone-categorical',
    label: 'Tableau 10 Stone',
    isDark: false,
    fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontMono: "'Roboto Mono', Menlo, Monaco, Consolas, monospace",
    bg: '#FFFFFF',
    surface: '#F8FAFC',
    surfaceRaised: '#FFFFFF',
    border: '#E2E8F0',
    borderStrong: '#CBD5E1',
    textPrimary: '#1E293B',
    textSecondary: '#334155',
    textMuted: '#64748B',
    gridColor: 'rgba(30, 41, 59, 0.06)',
    axisColor: '#94A3B8',
    zeroLine: '#475569',
    palette: [
      '#4E79A7',
      '#F28E2B',
      '#E15759',
      '#76B7B2',
      '#59A14F',
      '#EDC948',
      '#B07AA1',
      '#FF9DA7'
    ],
    sequential: ['#D3E0EA', '#A1BED4', '#6F9DBE', '#4E79A7', '#2E5B88'],
    divergent: {
      neg: '#E15759',
      mid: '#FFFFFF',
      pos: '#4E79A7'
    },
    emphasis: {
      focal: '#4E79A7',
      benchmark: '#57606C',
      context: '#BAB0AC',
      anomaly: '#E15759',
      forecastAlpha: 0.50
    },
    status: {
      success: '#59A14F',
      warning: '#F28E2B',
      danger: '#E15759',
      info: '#4E79A7',
      neutral: '#BAB0AC'
    },
    semantic: {
      positive: '#59A14F',
      negative: '#E15759',
      warning: '#F28E2B',
      info: '#4E79A7',
      neutral: '#BAB0AC'
    },
    tooltipBg: 'rgba(30, 41, 59, 0.92)',
    tooltipText: '#FFFFFF',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Roboto+Mono:wght@400;500;700&display=swap'
  },
  'okabe-ito-cud': {
    name: 'okabe-ito-cud',
    id: '05-okabe-ito-cud',
    label: 'Okabe-Ito CUD',
    isDark: false,
    fontFamily: "'Source Sans 3', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontMono: "'Source Code Pro', Menlo, Monaco, Consolas, monospace",
    bg: '#FFFFFF',
    surface: '#F8FAFC',
    surfaceRaised: '#FFFFFF',
    border: '#E2E8F0',
    borderStrong: '#CBD5E1',
    textPrimary: '#1E293B',
    textSecondary: '#334155',
    textMuted: '#64748B',
    gridColor: 'rgba(30, 41, 59, 0.06)',
    axisColor: '#94A3B8',
    zeroLine: '#475569',
    palette: [
      '#0072B2',
      '#D55E00',
      '#009E73',
      '#E69F00',
      '#56B4E9',
      '#F0E442',
      '#CC79A7',
      '#595959'
    ],
    sequential: ['#E6F2F8', '#B3DAEE', '#56B4E9', '#0072B2', '#004C77'],
    divergent: {
      neg: '#D55E00',
      mid: '#FFFFFF',
      pos: '#0072B2'
    },
    emphasis: {
      focal: '#0072B2',
      benchmark: '#475569',
      context: '#CBD5E1',
      anomaly: '#D55E00',
      forecastAlpha: 0.50
    },
    status: {
      success: '#009E73',
      warning: '#E69F00',
      danger: '#D55E00',
      info: '#56B4E9',
      neutral: '#999999'
    },
    semantic: {
      positive: '#009E73',
      negative: '#D55E00',
      warning: '#E69F00',
      info: '#0072B2',
      neutral: '#999999'
    },
    tooltipBg: 'rgba(30, 41, 59, 0.92)',
    tooltipText: '#FFFFFF',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500;600&display=swap'
  },
  'tufte-minimalist-executive': {
    name: 'tufte-minimalist-executive',
    id: '06-tufte-minimalist-executive',
    label: 'Tufte Minimalist Executive',
    isDark: false,
    fontFamily: "'Geist', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', serif",
    fontMono: "'Geist Mono', 'JetBrains Mono', Menlo, Monaco, Consolas, monospace",
    bg: '#FCFBF9',
    surface: '#FFFFFF',
    surfaceRaised: '#FFFFFF',
    border: '#E8E5DF',
    borderStrong: '#D5D1C8',
    textPrimary: '#111111',
    textSecondary: '#333333',
    textMuted: '#777777',
    gridColor: 'rgba(0, 0, 0, 0.04)',
    axisColor: '#CCCCCC',
    zeroLine: '#333333',
    palette: [
      '#1D4ED8',
      '#525252',
      '#737373',
      '#A3A3A3',
      '#D4D4D4',
      '#E5E5E5',
      '#171717',
      '#B91C1C'
    ],
    sequential: ['#EEEEEE', '#CCCCCC', '#999999', '#555555', '#111111'],
    divergent: {
      neg: '#B91C1C',
      mid: '#FFFFFF',
      pos: '#1D4ED8'
    },
    emphasis: {
      focal: '#1D4ED8',
      benchmark: '#111111',
      context: '#D4D4D4',
      anomaly: '#B91C1C',
      forecastAlpha: 0.45
    },
    status: {
      success: '#15803D',
      warning: '#B8860B',
      danger: '#B91C1C',
      info: '#1D4ED8',
      neutral: '#737373'
    },
    semantic: {
      positive: '#15803D',
      negative: '#B91C1C',
      warning: '#B8860B',
      info: '#1D4ED8',
      neutral: '#737373'
    },
    tooltipBg: '#111111',
    tooltipText: '#FFFFFF',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap'
  },
  'nord-cognitive-dark': {
    name: 'nord-cognitive-dark',
    id: '07-nord-cognitive-dark',
    label: 'Nord Cognitive Dark',
    isDark: true,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    bg: '#2E3440',
    surface: '#3B4252',
    surfaceRaised: '#434C5E',
    border: '#4C566A',
    borderStrong: '#616E85',
    textPrimary: '#ECEFF4',
    textSecondary: '#D8DEE9',
    textMuted: '#9EABC0',
    gridColor: 'rgba(236, 239, 244, 0.06)',
    axisColor: '#4C566A',
    zeroLine: '#88C0D0',
    palette: [
      '#88C0D0',
      '#81A1C1',
      '#5E81AC',
      '#A3BE8C',
      '#EBCB8B',
      '#D08770',
      '#BF616A',
      '#B48EAD'
    ],
    sequential: ['#3B4252', '#4C566A', '#5E81AC', '#81A1C1', '#88C0D0', '#ECEFF4'],
    divergent: {
      neg: '#BF616A',
      mid: '#4C566A',
      pos: '#88C0D0'
    },
    emphasis: {
      focal: '#88C0D0',
      benchmark: '#ECEFF4',
      context: '#4C566A',
      anomaly: '#BF616A',
      forecastAlpha: 0.50
    },
    status: {
      success: '#A3BE8C',
      warning: '#EBCB8B',
      danger: '#BF616A',
      info: '#88C0D0',
      neutral: '#D8DEE9'
    },
    semantic: {
      positive: '#A3BE8C',
      negative: '#BF616A',
      warning: '#EBCB8B',
      info: '#88C0D0',
      neutral: '#D8DEE9'
    },
    tooltipBg: '#434C5E',
    tooltipText: '#ECEFF4',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap'
  },
  'atkinson-hyperlegible': {
    name: 'atkinson-hyperlegible',
    id: '08-atkinson-hyperlegible',
    label: 'Atkinson Hyperlegible',
    isDark: false,
    fontFamily: "'Atkinson Hyperlegible', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontMono: "'Fira Code', 'JetBrains Mono', Menlo, monospace",
    bg: '#FFFFFF',
    surface: '#F4F4F5',
    surfaceRaised: '#FFFFFF',
    border: '#D4D4D8',
    borderStrong: '#71717A',
    textPrimary: '#000000',
    textSecondary: '#18181B',
    textMuted: '#3F3F46',
    gridColor: 'rgba(0, 0, 0, 0.12)',
    axisColor: '#71717A',
    zeroLine: '#18181B',
    palette: [
      '#005AB5',
      '#DC3220',
      '#009E73',
      '#FE6100',
      '#785EF0',
      '#FFB000',
      '#3F3F46',
      '#64748B'
    ],
    sequential: ['#E6F0FA', '#BDD7F1', '#6BA3DC', '#005AB5', '#003B75'],
    divergent: {
      neg: '#DC3220',
      mid: '#FFFFFF',
      pos: '#005AB5'
    },
    emphasis: {
      focal: '#005AB5',
      benchmark: '#27272A',
      context: '#A1A1AA',
      anomaly: '#DC3220',
      forecastAlpha: 0.55
    },
    status: {
      success: '#009E73',
      warning: '#FE6100',
      danger: '#DC3220',
      info: '#005AB5',
      neutral: '#71717A'
    },
    semantic: {
      positive: '#009E73',
      negative: '#DC3220',
      warning: '#FE6100',
      info: '#005AB5',
      neutral: '#71717A'
    },
    tooltipBg: 'rgba(0, 0, 0, 0.95)',
    tooltipText: '#FFFFFF',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=Fira+Code:wght@400;600&display=swap'
  }
};

const THEME_NAMES = Object.keys(THEMES);
const DEFAULT_THEME = 'colorbrewer-accessible';

const THEME_ALIASES = {
  '1': 'colorbrewer-accessible',
  '01': 'colorbrewer-accessible',
  '01-colorbrewer-accessible': 'colorbrewer-accessible',
  'colorbrewer': 'colorbrewer-accessible',
  'brewer': 'colorbrewer-accessible',
  '2': 'viridis-perceptual',
  '02': 'viridis-perceptual',
  '02-viridis-perceptual': 'viridis-perceptual',
  'viridis': 'viridis-perceptual',
  'magma': 'viridis-perceptual',
  '3': 'paul-tol-scientific',
  '03': 'paul-tol-scientific',
  '03-paul-tol-scientific': 'paul-tol-scientific',
  'paul-tol': 'paul-tol-scientific',
  'paultol': 'paul-tol-scientific',
  'tol': 'paul-tol-scientific',
  '4': 'tableau-stone-categorical',
  '04': 'tableau-stone-categorical',
  '04-tableau-stone-categorical': 'tableau-stone-categorical',
  'tableau': 'tableau-stone-categorical',
  'tableau-10': 'tableau-stone-categorical',
  'tableau10': 'tableau-stone-categorical',
  'tableau-stone': 'tableau-stone-categorical',
  'stone': 'tableau-stone-categorical',
  '5': 'okabe-ito-cud',
  '05': 'okabe-ito-cud',
  '05-okabe-ito-cud': 'okabe-ito-cud',
  'okabe-ito': 'okabe-ito-cud',
  'okabe': 'okabe-ito-cud',
  'okabeito': 'okabe-ito-cud',
  'cud': 'okabe-ito-cud',
  '6': 'tufte-minimalist-executive',
  '06': 'tufte-minimalist-executive',
  '06-tufte-minimalist-executive': 'tufte-minimalist-executive',
  'tufte': 'tufte-minimalist-executive',
  'tufte-minimalist': 'tufte-minimalist-executive',
  'executive': 'tufte-minimalist-executive',
  'minimalist': 'tufte-minimalist-executive',
  '7': 'nord-cognitive-dark',
  '07': 'nord-cognitive-dark',
  '07-nord-cognitive-dark': 'nord-cognitive-dark',
  'nord': 'nord-cognitive-dark',
  'dark': 'nord-cognitive-dark',
  'nord-dark': 'nord-cognitive-dark',
  '8': 'atkinson-hyperlegible',
  '08': 'atkinson-hyperlegible',
  '08-atkinson-hyperlegible': 'atkinson-hyperlegible',
  'atkinson': 'atkinson-hyperlegible',
  'hyperlegible': 'atkinson-hyperlegible',
  'braille': 'atkinson-hyperlegible',
  'low-vision': 'atkinson-hyperlegible'
};

function normalizeThemeSlug(inputTheme) {
  if (!inputTheme) return DEFAULT_THEME;
  const str = String(inputTheme).trim().toLowerCase().replace(/_/g, '-');
  if (THEMES[str]) return str;
  if (THEME_ALIASES[str]) return THEME_ALIASES[str];
  const cleaned = str.replace(/^[0-9]+-/, '').replace(/[^a-z0-9-]/g, '');
  if (THEMES[cleaned]) return cleaned;
  if (THEME_ALIASES[cleaned]) return THEME_ALIASES[cleaned];
  return DEFAULT_THEME;
}

function getStoredTheme() {
  if (typeof window !== 'undefined') {
    try {
      if (window.location && window.location.search) {
        const urlParams = new URLSearchParams(window.location.search);
        const urlTheme = urlParams.get('theme');
        if (urlTheme) {
          const normalized = normalizeThemeSlug(urlTheme);
          if (THEMES[normalized]) return normalized;
        }
      }
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('kitcharts_theme');
        if (stored) {
          const normalized = normalizeThemeSlug(stored);
          if (THEMES[normalized]) return normalized;
        }
      }
    } catch (e) {}
  }
  return DEFAULT_THEME;
}

function setStoredTheme(themeName) {
  const normalized = normalizeThemeSlug(themeName);
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem('kitcharts_theme', normalized);
    } catch (e) {}
  }
  return normalized;
}

function getStoredLabels() {
  if (typeof window !== 'undefined') {
    try {
      if (window.location && window.location.search) {
        const urlParams = new URLSearchParams(window.location.search);
        const urlLabels = urlParams.get('labels');
        if (urlLabels !== null) return urlLabels === 'true' || urlLabels === '1';
      }
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('kitcharts_labels');
        if (stored !== null) return stored === 'true';
      }
    } catch (e) {}
  }
  return true;
}

function setStoredLabels(showLabels) {
  const val = Boolean(showLabels);
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem('kitcharts_labels', String(val));
    } catch (e) {}
  }
  return val;
}

function getThemeTokens(themeName = DEFAULT_THEME, container = null) {
  const normalized = normalizeThemeSlug(themeName);
  const baseTheme = THEMES[normalized] || THEMES[DEFAULT_THEME];
  const tokens = JSON.parse(JSON.stringify(baseTheme));

  if (typeof window !== 'undefined' && typeof window.getComputedStyle === 'function') {
    try {
      const targetEl = container || (typeof document !== 'undefined' ? (document.querySelector ? document.querySelector('[data-theme]') : document.documentElement) : null);
      if (targetEl) {
        const targetTheme = (typeof targetEl.getAttribute === 'function' ? targetEl.getAttribute('data-theme') : null) || (targetEl.dataset ? targetEl.dataset.theme : null);
        if (!targetTheme || targetTheme === normalized) {
          const styles = window.getComputedStyle(targetEl);

          const cssBg = styles.getPropertyValue('--chart-bg');
          if (cssBg && cssBg.trim()) tokens.bg = cssBg.trim();

          const cssSurface = styles.getPropertyValue('--chart-surface');
          if (cssSurface && cssSurface.trim()) tokens.surface = cssSurface.trim();

          const cssSurfaceRaised = styles.getPropertyValue('--chart-surface-raised');
          if (cssSurfaceRaised && cssSurfaceRaised.trim()) tokens.surfaceRaised = cssSurfaceRaised.trim();

          const cssBorder = styles.getPropertyValue('--chart-border');
          if (cssBorder && cssBorder.trim()) tokens.border = cssBorder.trim();

          const cssBorderStrong = styles.getPropertyValue('--chart-border-strong');
          if (cssBorderStrong && cssBorderStrong.trim()) tokens.borderStrong = cssBorderStrong.trim();

          const cssTextPrimary = styles.getPropertyValue('--chart-text-primary');
          if (cssTextPrimary && cssTextPrimary.trim()) tokens.textPrimary = cssTextPrimary.trim();

          const cssTextSecondary = styles.getPropertyValue('--chart-text-secondary');
          if (cssTextSecondary && cssTextSecondary.trim()) tokens.textSecondary = cssTextSecondary.trim();

          const cssTextMuted = styles.getPropertyValue('--chart-text-muted');
          if (cssTextMuted && cssTextMuted.trim()) tokens.textMuted = cssTextMuted.trim();

          const cssGrid = styles.getPropertyValue('--chart-grid-color');
          if (cssGrid && cssGrid.trim()) tokens.gridColor = cssGrid.trim();

          const cssAxis = styles.getPropertyValue('--chart-axis-color');
          if (cssAxis && cssAxis.trim()) tokens.axisColor = cssAxis.trim();

          const cssZero = styles.getPropertyValue('--chart-zero-line');
          if (cssZero && cssZero.trim()) tokens.zeroLine = cssZero.trim();

          const cssFontSans = styles.getPropertyValue('--chart-font-sans');
          if (cssFontSans && cssFontSans.trim()) tokens.fontFamily = cssFontSans.trim();

          const cssFontMono = styles.getPropertyValue('--chart-font-mono');
          if (cssFontMono && cssFontMono.trim()) tokens.fontMono = cssFontMono.trim();

          const cssPositive = styles.getPropertyValue('--chart-positive');
          if (cssPositive && cssPositive.trim()) {
            tokens.semantic = tokens.semantic || {};
            tokens.semantic.positive = cssPositive.trim();
          }

          // Emphasis custom properties
          const cssEmphasisFocal = styles.getPropertyValue('--chart-emphasis-focal');
          if (cssEmphasisFocal && cssEmphasisFocal.trim()) {
            tokens.emphasis = tokens.emphasis || {};
            tokens.emphasis.focal = cssEmphasisFocal.trim();
          }

          const cssEmphasisBenchmark = styles.getPropertyValue('--chart-emphasis-benchmark');
          if (cssEmphasisBenchmark && cssEmphasisBenchmark.trim()) {
            tokens.emphasis = tokens.emphasis || {};
            tokens.emphasis.benchmark = cssEmphasisBenchmark.trim();
          }

          const cssEmphasisContext = styles.getPropertyValue('--chart-emphasis-context');
          if (cssEmphasisContext && cssEmphasisContext.trim()) {
            tokens.emphasis = tokens.emphasis || {};
            tokens.emphasis.context = cssEmphasisContext.trim();
          }

          const cssEmphasisAnomaly = styles.getPropertyValue('--chart-emphasis-anomaly');
          if (cssEmphasisAnomaly && cssEmphasisAnomaly.trim()) {
            tokens.emphasis = tokens.emphasis || {};
            tokens.emphasis.anomaly = cssEmphasisAnomaly.trim();
          }

          const cssEmphasisForecastAlpha = styles.getPropertyValue('--chart-emphasis-forecast-alpha');
          if (cssEmphasisForecastAlpha && cssEmphasisForecastAlpha.trim()) {
            const parsed = parseFloat(cssEmphasisForecastAlpha.trim());
            if (!isNaN(parsed)) {
              tokens.emphasis = tokens.emphasis || {};
              tokens.emphasis.forecastAlpha = parsed;
            }
          }

          // Status custom properties
          const cssStatusSuccess = styles.getPropertyValue('--chart-status-success');
          if (cssStatusSuccess && cssStatusSuccess.trim()) {
            tokens.status = tokens.status || {};
            tokens.status.success = cssStatusSuccess.trim();
            tokens.semantic = tokens.semantic || {};
            tokens.semantic.positive = cssStatusSuccess.trim();
          }

          const cssStatusWarning = styles.getPropertyValue('--chart-status-warning');
          if (cssStatusWarning && cssStatusWarning.trim()) {
            tokens.status = tokens.status || {};
            tokens.status.warning = cssStatusWarning.trim();
            tokens.semantic = tokens.semantic || {};
            tokens.semantic.warning = cssStatusWarning.trim();
          }

          const cssStatusDanger = styles.getPropertyValue('--chart-status-danger');
          if (cssStatusDanger && cssStatusDanger.trim()) {
            tokens.status = tokens.status || {};
            tokens.status.danger = cssStatusDanger.trim();
            tokens.semantic = tokens.semantic || {};
            tokens.semantic.negative = cssStatusDanger.trim();
          }

          const cssStatusInfo = styles.getPropertyValue('--chart-status-info');
          if (cssStatusInfo && cssStatusInfo.trim()) {
            tokens.status = tokens.status || {};
            tokens.status.info = cssStatusInfo.trim();
            tokens.semantic = tokens.semantic || {};
            tokens.semantic.info = cssStatusInfo.trim();
          }

          const cssStatusNeutral = styles.getPropertyValue('--chart-status-neutral');
          if (cssStatusNeutral && cssStatusNeutral.trim()) {
            tokens.status = tokens.status || {};
            tokens.status.neutral = cssStatusNeutral.trim();
            tokens.semantic = tokens.semantic || {};
            tokens.semantic.neutral = cssStatusNeutral.trim();
          }

          const dynamicPalette = [];
          for (let i = 1; i <= 8; i++) {
            const c = styles.getPropertyValue(`--chart-color-${i}`);
            if (c && c.trim()) dynamicPalette.push(c.trim());
          }
          if (dynamicPalette.length >= 2) {
            tokens.palette = dynamicPalette;
          }
        }
      }
    } catch (e) {
      // Fallback
    }
  }

  return tokens;
}

function applyThemeToContainer(container, themeName = DEFAULT_THEME) {
  const tokens = getThemeTokens(themeName, container);
  if (!container) {
    return tokens;
  }

  if (typeof container.setAttribute === 'function') {
    container.setAttribute('data-theme', tokens.name);
  }
  if (container.dataset) {
    container.dataset.theme = tokens.name;
  }
  if (container.style) {
    container.style.backgroundColor = tokens.bg;
    container.style.color = tokens.textPrimary;
    container.style.borderColor = tokens.border;
    container.style.fontFamily = tokens.fontFamily;

    if (typeof container.style.setProperty === 'function') {
      container.style.setProperty('--chart-bg', tokens.bg);
      container.style.setProperty('--chart-surface', tokens.surface);
      container.style.setProperty('--chart-surface-raised', tokens.surfaceRaised);
      container.style.setProperty('--chart-border', tokens.border);
      container.style.setProperty('--chart-border-strong', tokens.borderStrong);
      container.style.setProperty('--chart-text-primary', tokens.textPrimary);
      container.style.setProperty('--chart-text-secondary', tokens.textSecondary);
      container.style.setProperty('--chart-text-muted', tokens.textMuted);
      container.style.setProperty('--chart-grid-color', tokens.gridColor);
      container.style.setProperty('--chart-axis-color', tokens.axisColor);
      container.style.setProperty('--chart-zero-line', tokens.zeroLine);
      container.style.setProperty('--chart-font-sans', tokens.fontFamily);
      container.style.setProperty('--chart-font-mono', tokens.fontMono);

      if (tokens.emphasis) {
        if (tokens.emphasis.focal) container.style.setProperty('--chart-emphasis-focal', tokens.emphasis.focal);
        if (tokens.emphasis.benchmark) container.style.setProperty('--chart-emphasis-benchmark', tokens.emphasis.benchmark);
        if (tokens.emphasis.context) container.style.setProperty('--chart-emphasis-context', tokens.emphasis.context);
        if (tokens.emphasis.anomaly) container.style.setProperty('--chart-emphasis-anomaly', tokens.emphasis.anomaly);
        if (tokens.emphasis.forecastAlpha !== undefined) container.style.setProperty('--chart-emphasis-forecast-alpha', String(tokens.emphasis.forecastAlpha));
      }

      if (tokens.status) {
        if (tokens.status.success) container.style.setProperty('--chart-status-success', tokens.status.success);
        if (tokens.status.warning) container.style.setProperty('--chart-status-warning', tokens.status.warning);
        if (tokens.status.danger) container.style.setProperty('--chart-status-danger', tokens.status.danger);
        if (tokens.status.info) container.style.setProperty('--chart-status-info', tokens.status.info);
        if (tokens.status.neutral) container.style.setProperty('--chart-status-neutral', tokens.status.neutral);
      }

      if (tokens.semantic) {
        if (tokens.semantic.positive) container.style.setProperty('--chart-positive', tokens.semantic.positive);
        if (tokens.semantic.negative) container.style.setProperty('--chart-negative', tokens.semantic.negative);
        if (tokens.semantic.warning) container.style.setProperty('--chart-warning', tokens.semantic.warning);
        if (tokens.semantic.info) container.style.setProperty('--chart-info', tokens.semantic.info);
        if (tokens.semantic.neutral) container.style.setProperty('--chart-neutral', tokens.semantic.neutral);
      }

      tokens.palette.forEach((color, idx) => {
        container.style.setProperty(`--chart-color-${idx + 1}`, color);
      });
    }
  }

  return tokens;
}

function loadGoogleFonts(themeName = DEFAULT_THEME) {
  if (typeof document === 'undefined') return;
  const tokens = getThemeTokens(themeName);
  const linkId = `kit-charts-font-${tokens.name}`;
  if (document.getElementById && document.getElementById(linkId)) return;

  if (tokens.googleFontsUrl) {
    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = tokens.googleFontsUrl;
    if (document.head && typeof document.head.appendChild === 'function') {
      document.head.appendChild(link);
    }
  }
}

/**
 * Universal safe detector for prefers-reduced-motion: reduce (WCAG 2.2 SC 2.3.3).
 * Browser, SSR, and Node.js safe.
 * @returns {boolean}
 */
function isReducedMotionPreferred() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {
    return false;
  }
}

/**
 * Calculates cognitive animation duration based on element complexity N (logarithmic scaling).
 * Formula: ΔT = min(600, max(200, Tbase * [1 + 0.25 * log10(N)]))
 *
 * @param {number} [elementCount=1] Number of data points or elements
 * @param {number} [baseDuration=350] Base transition duration in ms
 * @returns {number} Calibrated duration in milliseconds
 */
function getAnimationDuration(elementCount = 1, baseDuration = 350) {
  const count = Number(elementCount);
  if (isNaN(count) || count <= 0) return 200;
  const base = Math.max(0, Number(baseDuration) || 350);
  const scaled = base * (1 + 0.25 * Math.log10(count));
  return Math.min(600, Math.max(200, Math.round(scaled)));
}

/**
 * Resolves animation configuration with automatic reduced-motion & Tufte compliance.
 *
 * @param {Object|string} [themeTokens] Theme tokens object or slug
 * @param {Object} [options={}] Additional animation options
 * @returns {Object|boolean} Chart.js animation configuration or false
 */
function getAccessibleAnimationOptions(themeTokens, options = {}) {
  const t = (typeof themeTokens === 'string' ? getThemeTokens(themeTokens) : themeTokens) || getThemeTokens(DEFAULT_THEME);
  const isTufte = t.name === 'tufte-minimalist-executive';
  const reduceMotion = isReducedMotionPreferred();

  if (isTufte || reduceMotion || options.duration === 0 || options.animate === false || options.animation === false) {
    return false;
  }

  return {
    duration: options.duration !== undefined ? options.duration : 400,
    easing: options.easing || 'easeOutQuart',
    delay: options.delay || 0,
    loop: false,
    ...options
  };
}

/**
 * Resolves Cavanagh & Alvarez (2005) MOT-capped stagger delay for large N datasets.
 * Ensures at most k (default 4) marks animate concurrently.
 * Formula: delay(i) = i * max(0, T - T_unit) / max(1, N - k)
 *
 * @param {Object|number} ctxOrIndex Chart.js animation context object OR mark dataIndex
 * @param {Object|number} [optionsOrTotal={}] Configuration options OR total element count N
 * @param {Object} [maybeOptions={}] Configuration options if 2nd param is number
 * @returns {number} Delay in milliseconds (integer)
 */
function getStaggerDelay(ctxOrIndex, optionsOrTotal = {}, maybeOptions = {}) {
  if (isReducedMotionPreferred()) return 0;

  let index = 0;
  let N = 8;
  let opts = {};

  if (ctxOrIndex && typeof ctxOrIndex === 'object') {
    if (ctxOrIndex.type && ctxOrIndex.type !== 'data') return 0;
    index = Number(ctxOrIndex.dataIndex) || 0;
    if (ctxOrIndex.dataset && Array.isArray(ctxOrIndex.dataset.data)) {
      N = ctxOrIndex.dataset.data.length;
    }
    opts = (optionsOrTotal && typeof optionsOrTotal === 'object') ? optionsOrTotal : {};
  } else {
    index = Number(ctxOrIndex) || 0;
    if (typeof optionsOrTotal === 'number') {
      N = optionsOrTotal;
      opts = maybeOptions || {};
    } else {
      opts = optionsOrTotal || {};
      N = opts.total || opts.N || 8;
    }
  }

  if (N <= 0 || index < 0) return 0;

  const unitMs = opts.unitMs !== undefined ? Number(opts.unitMs) : 300;
  const overlapCap = opts.overlapCap !== undefined ? Math.max(1, Number(opts.overlapCap)) : 4;
  const duration = opts.duration !== undefined ? Number(opts.duration) : getAnimationDuration(N);

  if (duration <= 0) return 0;

  const step = Math.max(0, duration - unitMs) / Math.max(1, N - overlapCap);
  return Math.round(index * step);
}

/**
 * Performs a staged 3-phase animated transition (Heer & Robertson 2007)
 * Phase 1: Fade-out (0.25 * T)
 * Phase 2: Move / Reposition / Change Type (0.50 * T)
 * Phase 3: Fade-in (0.25 * T)
 *
 * @param {Object} chart Chart.js instance
 * @param {Object|Function} newData New data object or mutator function
 * @param {string|Object} [newTypeOrOptions] Optional new chart type string or options
 * @param {Object} [options={}] Staged transition options { duration, easing, onComplete }
 * @returns {Promise<void>} Resolves when transition finishes
 */
function animateStagedUpdate(chart, newData, newTypeOrOptions = {}, options = {}) {
  const opts = typeof newTypeOrOptions === 'object' && newTypeOrOptions !== null && !Array.isArray(newTypeOrOptions) && !('type' in newTypeOrOptions && typeof newTypeOrOptions.type === 'string')
    ? { ...newTypeOrOptions, ...options }
    : { ...options, type: typeof newTypeOrOptions === 'string' ? newTypeOrOptions : undefined };

  return new Promise((resolve) => {
    if (!chart || !chart.data) {
      resolve();
      return;
    }

    const n = Array.isArray(chart.data.labels) ? chart.data.labels.length : 8;
    const totalDuration = opts.duration !== undefined ? Number(opts.duration) : getAnimationDuration(n);
    const reduceMotion = isReducedMotionPreferred() || totalDuration === 0;

    // Save original colors for restoration in phase 3
    const savedColors = (chart.data.datasets || []).map(ds => ({
      backgroundColor: Array.isArray(ds.backgroundColor) ? [...ds.backgroundColor] : ds.backgroundColor,
      borderColor: Array.isArray(ds.borderColor) ? [...ds.borderColor] : ds.borderColor
    }));

    // Apply data mutator or replacement helper
    const applyDataChange = () => {
      if (typeof newData === 'function') {
        newData(chart);
      } else if (newData && typeof newData === 'object') {
        if (newData.labels) chart.data.labels = [...newData.labels];
        if (newData.datasets) {
          chart.data.datasets = newData.datasets.map((ds, i) => {
            const copy = { ...ds };
            if (!copy.backgroundColor && savedColors[i]) {
              copy.backgroundColor = typeof savedColors[i].backgroundColor === 'string'
                ? hexToRgba(savedColors[i].backgroundColor, 0.4)
                : savedColors[i].backgroundColor;
            }
            if (!copy.borderColor && savedColors[i]) {
              copy.borderColor = typeof savedColors[i].borderColor === 'string'
                ? hexToRgba(savedColors[i].borderColor, 0.5)
                : savedColors[i].borderColor;
            }
            return copy;
          });
        }
      }
      if (opts.type && typeof opts.type === 'string') {
        if (chart.config) chart.config.type = opts.type;
        chart.type = opts.type;
        if (Array.isArray(chart.data && chart.data.datasets)) {
          chart.data.datasets.forEach(ds => { ds.type = opts.type; });
        }
      }
    };

    if (reduceMotion) {
      applyDataChange();
      chart.update('none');
      if (typeof opts.onComplete === 'function') opts.onComplete();
      resolve();
      return;
    }

    // Cancel any previous staged transition
    if (chart._kcStagedTimers) {
      chart._kcStagedTimers.forEach(t => clearTimeout(t));
    }
    chart._kcStagedTimers = [];

    const tOut = Math.max(100, Math.round(0.25 * totalDuration));
    const tMove = Math.max(150, Math.round(0.50 * totalDuration));
    const tIn = Math.max(100, Math.round(0.25 * totalDuration));

    if (!chart.options) chart.options = {};
    if (!chart.options.animation) chart.options.animation = {};

    // Phase 1: Fade out (dim current marks)
    (chart.data.datasets || []).forEach(ds => {
      if (typeof ds.backgroundColor === 'string') {
        ds.backgroundColor = hexToRgba(ds.backgroundColor, 0.15);
      } else if (Array.isArray(ds.backgroundColor)) {
        ds.backgroundColor = ds.backgroundColor.map(c => typeof c === 'string' ? hexToRgba(c, 0.15) : c);
      }
      if (typeof ds.borderColor === 'string') {
        ds.borderColor = hexToRgba(ds.borderColor, 0.2);
      } else if (Array.isArray(ds.borderColor)) {
        ds.borderColor = ds.borderColor.map(c => typeof c === 'string' ? hexToRgba(c, 0.2) : c);
      }
    });
    chart.options.animation.duration = tOut;
    chart.options.animation.easing = 'easeOutCubic';
    chart.update();

    // Phase 2: Apply changes & Animate move
    const timer1 = setTimeout(() => {
      applyDataChange();
      chart.options.animation.duration = tMove;
      chart.options.animation.easing = 'easeOutCubic';
      chart.update();

      // Phase 3: Fade in (restore vibrancy)
      const timer2 = setTimeout(() => {
        (chart.data.datasets || []).forEach((ds, i) => {
          if (savedColors[i]) {
            ds.backgroundColor = savedColors[i].backgroundColor;
            ds.borderColor = savedColors[i].borderColor;
          }
        });
        chart.options.animation.duration = tIn;
        chart.options.animation.easing = 'easeInCubic';
        chart.update();
        if (typeof opts.onComplete === 'function') opts.onComplete();
        resolve();
      }, tMove);

      chart._kcStagedTimers.push(timer2);
    }, tOut);

    chart._kcStagedTimers.push(timer1);
  });
}

/**
 * Universal Chart.js Pulse Alert Plugin & Trigger (Bartram et al. 2003 / Healey & Enns 2012).
 * Drives damped sinusoidal focal ring on threshold crossings:
 * scale(t) = 1 + A * sin(2*PI*f*t) * exp(-t/tau)
 * Auto-extinguishes after 3 pulses (t >= 3/f).
 */
const kcPulsePlugin = {
  id: 'kcPulse',
  afterDatasetsDraw(chart, args, pluginOptions) {
    const pulseState = chart._kcPulseState;
    if (!pulseState || !pulseState.active) return;

    const ctx = chart.ctx;
    if (!ctx) return;

    const t = pulseState.elapsedSec;
    const { amplitude = 0.08, frequency = 2, tau = 1.2, color = '#E66101' } = pulseState;
    const scale = 1 + amplitude * Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t / tau);
    const alpha = Math.max(0, Math.min(1, Math.exp(-t / tau)));

    const meta = chart.getDatasetMeta(pulseState.datasetIndex || 0);
    if (!meta || !meta.data) return;

    ctx.save();
    pulseState.indices.forEach(idx => {
      const elem = meta.data[idx];
      if (!elem) return;
      const { x, y } = elem.getProps ? elem.getProps(['x', 'y'], true) : { x: elem.x, y: elem.y };

      // Point / Arc Element Pulse
      const baseRadius = elem.options?.radius || elem.options?.hoverRadius || (elem.width ? elem.width / 4 : 10);
      const pulseRadius = Math.max(4, (baseRadius + 6) * scale);

      ctx.beginPath();
      ctx.arc(x, y, pulseRadius, 0, 2 * Math.PI);
      ctx.strokeStyle = hexToRgba(color, alpha * 0.9);
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, Math.max(2, pulseRadius * 0.6), 0, 2 * Math.PI);
      ctx.fillStyle = hexToRgba(color, alpha * 0.35);
      ctx.fill();

      // Top Highlight Badge for Bars
      if (elem.base !== undefined && elem.width) {
        ctx.fillStyle = hexToRgba(color, alpha * 0.95);
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⚠ ALERTE', x, Math.max(14, y - pulseRadius - 4));
      }
    });
    ctx.restore();
  }
};

/**
 * Attaches or triggers an attention-capture pulse alert on threshold-crossing marks.
 *
 * @param {Object} chart Chart.js instance
 * @param {Object} [options={}] Configuration { indices, threshold, targetVal, datasetIndex, color, onComplete }
 * @returns {Object} Control handle { stop: Function }
 */
function attachPulseAlert(chart, options = {}) {
  if (!chart) return { stop: () => {} };

  if (isReducedMotionPreferred()) {
    if (typeof options.onComplete === 'function') options.onComplete();
    return { stop: () => {} };
  }

  let targetIndices = options.indices;
  if (!Array.isArray(targetIndices)) {
    targetIndices = [];
    const dsIdx = options.datasetIndex || 0;
    const dataset = chart.data?.datasets?.[dsIdx];
    if (dataset && Array.isArray(dataset.data)) {
      dataset.data.forEach((val, i) => {
        const num = typeof val === 'object' && val !== null ? (val.y ?? val.v ?? 0) : Number(val);
        if (options.threshold !== undefined && num >= options.threshold) {
          targetIndices.push(i);
        } else if (options.condition && typeof options.condition === 'function' && options.condition(num, i)) {
          targetIndices.push(i);
        }
      });
      if (targetIndices.length === 0 && dataset.data.length > 0) {
        let maxIdx = 0;
        let maxVal = -Infinity;
        dataset.data.forEach((v, i) => {
          const num = typeof v === 'object' && v !== null ? (v.y ?? v.v ?? 0) : Number(v);
          if (num > maxVal) { maxVal = num; maxIdx = i; }
        });
        targetIndices = [maxIdx];
      }
    }
  }

  const f = options.frequency || 2;
  const maxDurationSec = 3 / f;
  const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

  chart._kcPulseState = {
    active: true,
    indices: targetIndices,
    datasetIndex: options.datasetIndex || 0,
    amplitude: options.amplitude || 0.08,
    frequency: f,
    tau: options.tau || 1.2,
    color: options.color || '#D95F02',
    elapsedSec: 0
  };

  let rafId = null;

  const loop = () => {
    if (!chart._kcPulseState || !chart._kcPulseState.active) return;
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const elapsed = (now - startTime) / 1000;
    chart._kcPulseState.elapsedSec = elapsed;

    if (elapsed >= maxDurationSec) {
      chart._kcPulseState.active = false;
      if (typeof chart.render === 'function') chart.render();
      else if (typeof chart.draw === 'function') chart.draw();
      if (typeof options.onComplete === 'function') options.onComplete();
      return;
    }

    if (typeof chart.render === 'function') chart.render();
    else if (typeof chart.draw === 'function') chart.draw();
    if (typeof requestAnimationFrame !== 'undefined') {
      rafId = requestAnimationFrame(loop);
    }
  };

  if (typeof requestAnimationFrame !== 'undefined') {
    rafId = requestAnimationFrame(loop);
  }

  return {
    stop: () => {
      if (chart._kcPulseState) chart._kcPulseState.active = false;
      if (rafId && typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(rafId);
      if (typeof chart.render === 'function') chart.render();
      else if (typeof chart.draw === 'function') chart.draw();
    }
  };
}

/**
 * Logarithmic scale zoom / drill-down animated transition (Bederson & Hollan 1994).
 * Formula: s(t) = s0 * (s1/s0)^p with p = easeInOutCubic(t/T)
 *
 * @param {Object} chart Chart.js instance
 * @param {Object|number} targetBoundsOrCategory Target min/max bounds or category index
 * @param {Object} [options={}] Options { duration: 350, axis: 'y' }
 * @returns {Promise<void>} Resolves when zoom transition completes
 */
function animateZoomDrilldown(chart, targetBoundsOrCategory, options = {}) {
  return new Promise((resolve) => {
    if (!chart) { resolve(); return; }

    const duration = options.duration !== undefined ? Number(options.duration) : 350;
    const axis = options.axis || 'y';

    if (isReducedMotionPreferred() || duration === 0) {
      if (typeof targetBoundsOrCategory === 'object' && targetBoundsOrCategory !== null) {
        if (!chart.options.scales) chart.options.scales = {};
        if (!chart.options.scales[axis]) chart.options.scales[axis] = {};
        if (targetBoundsOrCategory.min !== undefined) chart.options.scales[axis].min = targetBoundsOrCategory.min;
        if (targetBoundsOrCategory.max !== undefined) chart.options.scales[axis].max = targetBoundsOrCategory.max;
      }
      chart.update('none');
      if (typeof options.onComplete === 'function') options.onComplete();
      resolve();
      return;
    }

    const scale = chart.scales ? chart.scales[axis] : null;
    const currentMin = (chart.options.scales && chart.options.scales[axis] && chart.options.scales[axis].min !== undefined)
      ? chart.options.scales[axis].min
      : (scale ? scale.min : 0);
    const currentMax = (chart.options.scales && chart.options.scales[axis] && chart.options.scales[axis].max !== undefined)
      ? chart.options.scales[axis].max
      : (scale ? scale.max : 100);

    const targetMin = (typeof targetBoundsOrCategory === 'object' && targetBoundsOrCategory.min !== undefined) ? targetBoundsOrCategory.min : currentMin;
    const targetMax = (typeof targetBoundsOrCategory === 'object' && targetBoundsOrCategory.max !== undefined) ? targetBoundsOrCategory.max : (typeof targetBoundsOrCategory === 'number' ? targetBoundsOrCategory : currentMax);

    const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const easeInOutCubic = (p) => p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

    const step = () => {
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const progress = Math.min(1, Math.max(0, (now - startTime) / duration));
      const p = easeInOutCubic(progress);

      if (!chart.options.scales) chart.options.scales = {};
      if (!chart.options.scales[axis]) chart.options.scales[axis] = {};
      chart.options.scales[axis].min = Math.round(currentMin + (targetMin - currentMin) * p);
      chart.options.scales[axis].max = Math.round(currentMax + (targetMax - currentMax) * p);

      chart.update('none');

      if (progress < 1) {
        if (typeof requestAnimationFrame !== 'undefined') requestAnimationFrame(step);
        else setTimeout(step, 16);
      } else {
        if (typeof options.onComplete === 'function') options.onComplete();
        resolve();
      }
    };

    if (typeof requestAnimationFrame !== 'undefined') requestAnimationFrame(step);
    else setTimeout(step, 16);
  });
}

/**
 * Computes event segmentation cut points for narrative dataviz (Zacks & Tversky 2001, Hullman 2011).
 * Formula: delta(f_i, f_{i+1}) = sum_j |v_j(f_{i+1}) - v_j(f_i)| / sigma_v > theta
 *
 * @param {Array<Array<number>|Object>} frames Array of data frames over time
 * @param {Object} [options={}] Options { theta: 1.5 }
 * @returns {Array<number>} Scene cut indices
 */
function computeEventSegmentation(frames, options = {}) {
  if (!Array.isArray(frames) || frames.length < 2) return [0];

  const theta = options.theta !== undefined ? Number(options.theta) : 1.5;

  const vectors = frames.map(f => {
    if (Array.isArray(f)) return f.map(Number);
    if (f && Array.isArray(f.data)) return f.data.map(Number);
    if (f && typeof f === 'object') return Object.values(f).filter(v => typeof v === 'number');
    return [];
  });

  const deltas = [];
  for (let i = 0; i < vectors.length - 1; i++) {
    const v0 = vectors[i];
    const v1 = vectors[i + 1];
    const len = Math.min(v0.length, v1.length);
    let diffSum = 0;
    for (let j = 0; j < len; j++) {
      diffSum += Math.abs(v1[j] - v0[j]);
    }
    deltas.push(diffSum);
  }

  const m = deltas.reduce((a, b) => a + b, 0) / (deltas.length || 1);
  const varianceVal = deltas.reduce((acc, d) => acc + Math.pow(d - m, 2), 0) / (deltas.length || 1);
  const sigma = Math.sqrt(varianceVal) || 1;

  const cuts = [0];
  deltas.forEach((d, idx) => {
    const normalizedJump = (d - m) / sigma;
    if (normalizedJump >= theta || (d / (m || 1) >= theta)) {
      cuts.push(idx + 1);
    }
  });

  if (cuts[cuts.length - 1] !== frames.length - 1) {
    cuts.push(frames.length - 1);
  }

  return [...new Set(cuts)];
}

/**
 * Creates a narrative scene player for stepping through data stories (Hullman 2011).
 *
 * @param {Object} chart Chart.js instance
 * @param {Array<Object>} scenes Array of scenes { title, data, description }
 * @param {Object} [options={}] Configuration { sceneDuration: 500, dwellMs: 2000, onSceneChange: Function }
 * @returns {Object} Narrative player handle
 */
function createNarrativeScenePlayer(chart, scenes = [], options = {}) {
  let currentIndex = 0;
  let isPlaying = false;
  let playTimer = null;

  const goToScene = (idx) => {
    if (!scenes || scenes.length === 0) return;
    currentIndex = Math.max(0, Math.min(scenes.length - 1, idx));
    const scene = scenes[currentIndex];

    if (chart && scene && scene.data) {
      if (Array.isArray(scene.data)) {
        if (chart.data && chart.data.datasets && chart.data.datasets[0]) {
          chart.data.datasets[0].data = [...scene.data];
        }
      } else {
        if (scene.data.labels && chart.data) chart.data.labels = [...scene.data.labels];
        if (scene.data.datasets && chart.data && chart.data.datasets) {
          chart.data.datasets.forEach((ds, i) => {
            if (scene.data.datasets[i]) {
              ds.data = [...scene.data.datasets[i].data];
              if (scene.data.datasets[i].label) ds.label = scene.data.datasets[i].label;
            }
          });
        }
      }
      const dur = isReducedMotionPreferred() ? 0 : (options.sceneDuration || 500);
      if (chart.options && chart.options.animation) {
        chart.options.animation.duration = dur;
        chart.options.animation.easing = 'easeOutCubic';
      }
      if (chart.update) chart.update();
    }

    if (typeof options.onSceneChange === 'function') {
      options.onSceneChange(currentIndex, scene);
    }
  };

  const nextScene = () => {
    if (currentIndex < scenes.length - 1) {
      goToScene(currentIndex + 1);
    } else {
      goToScene(0);
      pause();
    }
  };

  const prevScene = () => {
    if (currentIndex > 0) goToScene(currentIndex - 1);
  };

  const play = () => {
    isPlaying = true;
    const dwell = Math.max(1500, options.dwellMs || 2200);
    const tick = () => {
      if (!isPlaying) return;
      if (currentIndex < scenes.length - 1) {
        nextScene();
        playTimer = setTimeout(tick, dwell);
      } else {
        pause();
      }
    };
    playTimer = setTimeout(tick, dwell);
  };

  const pause = () => {
    isPlaying = false;
    if (playTimer) clearTimeout(playTimer);
  };

  return {
    goToScene,
    nextScene,
    prevScene,
    play,
    pause,
    getCurrentIndex: () => currentIndex,
    getScenes: () => scenes,
    isPlaying: () => isPlaying
  };
}

/**
 * Lasseter (1987) Anticipation motion wrapper for major mutations (sort, drill-down).
 * Applies subtle pre-movement micro-recoil (a ≈ 0.06, Ta ≈ 60ms) before primary forward transition.
 * Proscribes cartoon bounce / elastic effects.
 *
 * @param {Object} chart Chart.js instance
 * @param {Function} mutatorFn Data mutation function to execute
 * @param {Object} [options={}] Options { recoilMs: 60, amplitude: 0.05 }
 * @returns {Promise<void>} Resolves when animation is completed
 */
function animateWithAnticipation(chart, mutatorFn, options = {}) {
  return new Promise((resolve) => {
    if (!chart) {
      if (typeof mutatorFn === 'function') mutatorFn();
      resolve();
      return;
    }

    if (isReducedMotionPreferred()) {
      if (typeof mutatorFn === 'function') mutatorFn(chart);
      chart.update('none');
      resolve();
      return;
    }

    const canvas = chart.canvas;
    const recoilMs = options.recoilMs || 60;

    if (canvas && canvas.style) {
      const prevTransform = canvas.style.transform || '';
      const prevTransition = canvas.style.transition || '';

      canvas.style.transition = `transform ${recoilMs}ms cubic-bezier(0.4, 0, 0.6, 1)`;
      canvas.style.transform = `${prevTransform} scale(0.98) translateY(3px)`.trim();

      setTimeout(() => {
        canvas.style.transition = `transform 180ms cubic-bezier(0, 0, 0.2, 1)`;
        canvas.style.transform = prevTransform;

        if (typeof mutatorFn === 'function') {
          mutatorFn(chart);
        }

        const duration = options.duration || getAnimationDuration(chart.data?.labels?.length || 8);
        if (chart.options && chart.options.animation) {
          chart.options.animation.duration = duration;
          chart.options.animation.easing = 'easeOutCubic';
        }
        chart.update();

        setTimeout(() => {
          canvas.style.transform = prevTransform;
          canvas.style.transition = prevTransition;
          resolve();
        }, duration);
      }, recoilMs);
    } else {
      if (typeof mutatorFn === 'function') mutatorFn(chart);
      chart.update();
      resolve();
    }
  });
}

/**
 * Universal Cognitive Animation Ticker (rAF loop with physical ms elapsed & deterministic easing).
 * Conforms to Ticker rAF contract: onFrame(easedU, elapsedMs).
 * Proscribes bounce/elastic, ensures instant resolution on reduced motion.
 *
 * @param {Object} options Configuration { duration, easing, onFrame, onComplete, reducedMotion }
 * @returns {Object} Control handle { stop: Function }
 */
function createAnimationTicker(options = {}) {
  const isReduced = options.reducedMotion !== undefined ? Boolean(options.reducedMotion) : isReducedMotionPreferred();
  const duration = Math.max(0, Number(options.duration) || 500);
  const onFrame = typeof options.onFrame === 'function' ? options.onFrame : () => {};
  const onComplete = typeof options.onComplete === 'function' ? options.onComplete : () => {};

  const easingMap = {
    easeOutCubic: (u) => 1 - Math.pow(1 - u, 3),
    easeInOutCubic: (u) => u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2,
    easeOutQuad: (u) => 1 - (1 - u) * (1 - u),
    linear: (u) => u
  };

  const easeFn = typeof options.easing === 'function'
    ? options.easing
    : (easingMap[options.easing] || easingMap.easeOutCubic);

  if (isReduced || duration === 0) {
    onFrame(1, duration);
    onComplete();
    return { stop: () => {} };
  }

  let rafId = null;
  let isStopped = false;
  const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

  const tick = () => {
    if (isStopped) return;
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const elapsed = Math.max(0, now - startTime);
    const u = Math.min(1, elapsed / duration);
    const easedU = easeFn(u);

    onFrame(easedU, elapsed);

    if (u < 1) {
      if (typeof requestAnimationFrame !== 'undefined') {
        rafId = requestAnimationFrame(tick);
      } else {
        setTimeout(tick, 16);
      }
    } else {
      isStopped = true;
      onComplete();
    }
  };

  if (typeof requestAnimationFrame !== 'undefined') {
    rafId = requestAnimationFrame(tick);
  } else {
    setTimeout(tick, 16);
  }

  return {
    stop: () => {
      isStopped = true;
      if (rafId && typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(rafId);
      }
    }
  };
}

/**
 * B1 (09): Révélation progressive de tracé / Path Drawing (Tversky 2002 / Heer & Robertson 2007).
 * Arc-length reparametrization (||gamma'(s)|| = 1) with easeInOutCubic.
 * Narrative mode: T ~ 2200ms ; Data update: ΔT(N) <= 800ms.
 *
 * @param {Object} chart Chart.js instance
 * @param {Object} [options={}] Options { duration: 2200, onComplete, reducedMotion }
 * @returns {Object} Control handle { stop: Function }
 */
function animatePathDrawing(chart, options = {}) {
  if (!chart || !chart.data) {
    if (options.onComplete) options.onComplete();
    return { stop: () => {} };
  }

  const duration = options.duration !== undefined ? options.duration : 2200;
  const originalDatasets = (chart.data.datasets || []).map(ds => ({
    data: [...(ds.data || [])],
    borderColor: ds.borderColor,
    backgroundColor: ds.backgroundColor
  }));

  if (isReducedMotionPreferred() || options.reducedMotion || duration === 0) {
    chart.update('none');
    if (options.onComplete) options.onComplete();
    return { stop: () => {} };
  }

  const fullData = originalDatasets[0]?.data || [];
  const N = fullData.length;
  if (N < 2) {
    chart.update('none');
    if (options.onComplete) options.onComplete();
    return { stop: () => {} };
  }

  return createAnimationTicker({
    duration: duration,
    easing: 'easeInOutCubic',
    reducedMotion: options.reducedMotion,
    onFrame: (easedU, elapsedMs) => {
      const fractionalIndex = easedU * (N - 1);
      const baseIdx = Math.floor(fractionalIndex);
      const frac = fractionalIndex - baseIdx;

      chart.data.datasets.forEach((ds, dsIdx) => {
        const full = originalDatasets[dsIdx]?.data || [];
        const currentData = [];
        for (let i = 0; i <= baseIdx; i++) {
          currentData.push(full[i]);
        }
        if (frac > 0 && baseIdx + 1 < full.length) {
          const interpolatedVal = full[baseIdx] + (full[baseIdx + 1] - full[baseIdx]) * frac;
          currentData.push(interpolatedVal);
        }
        ds.data = currentData;
      });
      chart.update('none');
    },
    onComplete: () => {
      chart.data.datasets.forEach((ds, dsIdx) => {
        if (originalDatasets[dsIdx]) {
          ds.data = [...originalDatasets[dsIdx].data];
        }
      });
      chart.update('none');
      if (typeof options.onComplete === 'function') options.onComplete();
    }
  });
}

/**
 * B2 (10): Compteur numérique animé / Count-up (Dehaene / Tversky et al. 2002).
 * Formula: v(t) = round(v0 + Δv * easeOutCubic(t/T))
 * Throttled to ~30Hz (>= 33ms between renders) with tabular numbers and exact final value.
 *
 * @param {HTMLElement|Function} target Target DOM element or callback(val)
 * @param {number} targetValue Final value
 * @param {Object} [options={}] Options { startValue: 0, duration: 500, prefix: '', suffix: '', formatFn }
 * @returns {Object} Control handle { stop: Function }
 */
function animateCountUp(target, targetValue, options = {}) {
  const v0 = options.startValue !== undefined ? Number(options.startValue) : 0;
  const v1 = Number(targetValue) || 0;
  const delta = v1 - v0;
  const duration = options.duration !== undefined ? (Number(options.duration) === 0 ? 0 : Math.min(800, Math.max(100, Number(options.duration)))) : 500;
  let lastRenderTime = 0;

  const setValue = (val) => {
    const rounded = Math.round(val);
    const formatted = typeof options.formatFn === 'function'
      ? options.formatFn(rounded)
      : `${options.prefix || ''}${rounded.toLocaleString('fr-FR')}${options.suffix || ''}`;

    if (typeof target === 'function') {
      target(rounded, formatted);
    } else if (target && typeof target === 'object') {
      target.textContent = formatted;
    }
  };

  if (isReducedMotionPreferred() || options.reducedMotion || duration === 0) {
    setValue(v1);
    if (typeof options.onComplete === 'function') options.onComplete();
    return { stop: () => {} };
  }

  return createAnimationTicker({
    duration: duration,
    easing: 'easeOutCubic',
    reducedMotion: options.reducedMotion,
    onFrame: (easedU, elapsedMs) => {
      // Throttle visual renders to >= 33ms (~30Hz)
      if (elapsedMs - lastRenderTime >= 33 || easedU >= 1) {
        lastRenderTime = elapsedMs;
        const currentVal = v0 + delta * easedU;
        setValue(currentVal);
      }
    },
    onComplete: () => {
      setValue(v1);
      if (typeof options.onComplete === 'function') options.onComplete();
    }
  });
}

/**
 * B3 (11): Focus + Context / Dimming non-sélectionnés (Pirolli & Card 1999 / Furnas 1986 / Treisman).
 * Formula: α_target = 1.0 (selected S) or 0.25 (others). α_i(t) = α_target + (α_0 - α_target)(1-u)^2 (easeOutQuad, T <= 150ms).
 *
 * @param {Object} chart Chart.js instance
 * @param {number|Array<number>|Function} selectedIndices Selected dataset or element indices
 * @param {Object} [options={}] Options { duration: 140, onComplete, dimAlpha: 0.25 }
 * @returns {Object} Control handle { stop: Function }
 */
function animateFocusContext(chart, selectedIndices, options = {}) {
  if (!chart || !chart.data || !chart.data.datasets) {
    if (options.onComplete) options.onComplete();
    return { stop: () => {} };
  }

  const duration = Math.min(150, options.duration !== undefined ? Number(options.duration) : 140);
  const dimAlpha = options.dimAlpha !== undefined ? Number(options.dimAlpha) : 0.25;

  const isSelected = (idx, dsIdx) => {
    if (selectedIndices === null || selectedIndices === undefined) return true; // reset all
    if (typeof selectedIndices === 'function') return selectedIndices(idx, dsIdx);
    if (Array.isArray(selectedIndices)) return selectedIndices.includes(idx) || selectedIndices.includes(dsIdx);
    return selectedIndices === idx || selectedIndices === dsIdx;
  };

  chart.data.datasets.forEach((ds, dsIdx) => {
    if (!ds._kcOriginalBg) {
      ds._kcOriginalBg = ds.backgroundColor;
      ds._kcOriginalBorder = ds.borderColor;
    }

    if (Array.isArray(ds._kcOriginalBg)) {
      ds.backgroundColor = ds._kcOriginalBg.map((c, i) =>
        isSelected(i, dsIdx) ? c : hexToRgba(c, dimAlpha)
      );
      if (Array.isArray(ds._kcOriginalBorder)) {
        ds.borderColor = ds._kcOriginalBorder.map((c, i) =>
          isSelected(i, dsIdx) ? c : hexToRgba(c, Math.min(1, dimAlpha + 0.1))
        );
      }
    } else {
      const active = isSelected(dsIdx, dsIdx);
      ds.backgroundColor = active ? ds._kcOriginalBg : hexToRgba(ds._kcOriginalBg, dimAlpha);
      ds.borderColor = active ? ds._kcOriginalBorder : hexToRgba(ds._kcOriginalBorder, Math.min(1, dimAlpha + 0.1));
    }
  });

  chart.update('none');
  if (typeof options.onComplete === 'function') options.onComplete();
  return { stop: () => {} };
}

/**
 * B4 (12): Course de barres classée / Bar Chart Race / Rank Morphing (Robertson et al. CHI 2008 / MOT k<=4).
 * Formula: y_i(u) = y_r0(i) + (y_r1(i) - y_r0(i)) * easeInOutCubic(u).
 * Adjacent rank inversions only between frames, pause >= 450ms, N <= 6.
 *
 * @param {Object} chart Chart.js instance
 * @param {Array<Object>} frames Array of frames [{ year/label, data: [{ name, value, color }] }]
 * @param {Object} [options={}] Options { stepDuration: 600, pauseMs: 500, onStepChange, onComplete }
 * @returns {Object} Race player handle
 */
function animateBarChartRace(chart, frames = [], options = {}) {
  let currentFrameIdx = 0;
  let isPlaying = false;
  let stepTimer = null;
  const stepDur = options.stepDuration || 600;
  const pauseMs = Math.max(450, options.pauseMs || 500);

  const applyFrame = (idx, animate = true) => {
    if (!chart || !frames || !frames[idx]) return;
    currentFrameIdx = idx;
    const frame = frames[idx];
    const sorted = [...frame.data].sort((a, b) => b.value - a.value).slice(0, 6);

    chart.data.labels = sorted.map(item => item.name);
    if (chart.data.datasets && chart.data.datasets[0]) {
      chart.data.datasets[0].data = sorted.map(item => item.value);
      chart.data.datasets[0].backgroundColor = sorted.map(item => item.color);
      chart.data.datasets[0].borderColor = sorted.map(item => item.color);
    }

    if (chart.options && chart.options.animation) {
      chart.options.animation.duration = (animate && !isReducedMotionPreferred() && !options.reducedMotion) ? stepDur : 0;
      chart.options.animation.easing = 'easeInOutCubic';
    }
    chart.update();

    if (typeof options.onStepChange === 'function') {
      options.onStepChange(currentFrameIdx, frame);
    }
  };

  const next = () => {
    if (currentFrameIdx < frames.length - 1) {
      applyFrame(currentFrameIdx + 1, true);
    } else {
      pause();
      if (typeof options.onComplete === 'function') options.onComplete();
    }
  };

  const prev = () => {
    if (currentFrameIdx > 0) applyFrame(currentFrameIdx - 1, true);
  };

  const play = () => {
    isPlaying = true;
    const loop = () => {
      if (!isPlaying) return;
      if (currentFrameIdx < frames.length - 1) {
        next();
        stepTimer = setTimeout(loop, stepDur + pauseMs);
      } else {
        pause();
      }
    };
    stepTimer = setTimeout(loop, pauseMs);
  };

  const pause = () => {
    isPlaying = false;
    if (stepTimer) clearTimeout(stepTimer);
  };

  return {
    play,
    pause,
    next,
    prev,
    goToFrame: (idx) => applyFrame(idx, true),
    getCurrentIndex: () => currentFrameIdx,
    isPlaying: () => isPlaying
  };
}

/**
 * B5 (13): Panoramique Caméra / Pan Overview+Detail (Shneiderman 1996 / Plumlee & Ware 2006).
 * Formula: c(u) = c0 + (c1 - c0) * easeInOutCubic(u).
 * T = clamp(dist_px / 2000 px/s, 120ms, 600ms). Updates scales.x.min/max with update('none').
 *
 * @param {Object} chart Chart.js instance
 * @param {Object} targetRange { min: number, max: number }
 * @param {Object} [options={}] Options { duration, onComplete }
 * @returns {Object} Control handle { stop: Function }
 */
function animatePanCamera(chart, targetRange, options = {}) {
  if (!chart || !chart.scales || !chart.scales.x) {
    if (options.onComplete) options.onComplete();
    return { stop: () => {} };
  }

  const currentMin = chart.scales.x.min;
  const currentMax = chart.scales.x.max;
  const targetMin = targetRange.min !== undefined ? targetRange.min : currentMin;
  const targetMax = targetRange.max !== undefined ? targetRange.max : currentMax;

  const dist = Math.abs(targetMin - currentMin);
  const calculatedDuration = Math.min(600, Math.max(120, Math.round((dist / 10) * 100)));
  const duration = options.duration !== undefined ? options.duration : calculatedDuration;

  if (isReducedMotionPreferred() || options.reducedMotion || duration === 0) {
    chart.options.scales.x.min = targetMin;
    chart.options.scales.x.max = targetMax;
    chart.update('none');
    if (typeof options.onComplete === 'function') options.onComplete();
    return { stop: () => {} };
  }

  return createAnimationTicker({
    duration: duration,
    easing: 'easeInOutCubic',
    reducedMotion: options.reducedMotion,
    onFrame: (easedU) => {
      if (!chart.options.scales) chart.options.scales = {};
      if (!chart.options.scales.x) chart.options.scales.x = {};
      chart.options.scales.x.min = currentMin + (targetMin - currentMin) * easedU;
      chart.options.scales.x.max = currentMax + (targetMax - currentMax) * easedU;
      chart.update('none');
    },
    onComplete: () => {
      chart.options.scales.x.min = targetMin;
      chart.options.scales.x.max = targetMax;
      chart.update('none');
      if (typeof options.onComplete === 'function') options.onComplete();
    }
  });
}

/**
 * B6 (14): Morphing entre types de graphiques / Cross-Type Morphing (Robertson et al. 2008 / Cleveland & McGill 1984).
 * 32 contour sample points: x_i(p) = (1-p)*f_cart^-1(i) + p*g_polar^-1(i), p = easeInOutCubic(u).
 * Axis decor fades out on [0, 0.25T], labels fade in on [0.75T, T].
 * Enforces CSS 100% wrapper sizing to guarantee perceptual frame stability.
 *
 * @param {HTMLCanvasElement} canvas Target canvas element
 * @param {Array<Object>} items Data items [{ label, value, color }]
 * @param {string} fromType 'bar' | 'pie'
 * @param {string} toType 'pie' | 'bar'
 * @param {Object} [options={}] Options { duration: 800, onComplete }
 * @returns {Object} Control handle { stop: Function }
 */
function animateCrossTypeMorph(canvas, items = [], fromType = 'bar', toType = 'pie', options = {}) {
  if (!canvas) {
    if (options.onComplete) options.onComplete();
    return { stop: () => {} };
  }

  const ctx = canvas.getContext('2d');
  const duration = options.duration !== undefined ? options.duration : 800;
  const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
  const rect = canvas.getBoundingClientRect();
  const W = (rect.width || 600) * dpr;
  const H = (rect.height || 400) * dpr;

  canvas.width = W;
  canvas.height = H;
  canvas.style.width = '100%';
  canvas.style.height = '100%';

  const total = items.reduce((acc, it) => acc + it.value, 0) || 1;
  const N = items.length;

  const renderFrame = (p) => {
    ctx.clearRect(0, 0, W, H);
    ctx.save();

    const barArea = { x: W * 0.12, y: H * 0.15, w: W * 0.76, h: H * 0.70 };
    const pieCenter = { x: W * 0.5, y: H * 0.5, r: Math.min(W, H) * 0.32 };
    const maxVal = Math.max(...items.map(it => it.value), 1);

    // Alpha for bar axes [0 -> 0.25T fade-out]
    const axisAlpha = Math.max(0, 1 - p / 0.25);
    // Alpha for pie labels [0.75T -> 1.0T fade-in]
    const labelAlpha = Math.max(0, (p - 0.75) / 0.25);

    if (axisAlpha > 0) {
      ctx.strokeStyle = `rgba(148, 163, 184, ${axisAlpha * 0.4})`;
      ctx.lineWidth = 1 * dpr;
      ctx.beginPath();
      ctx.moveTo(barArea.x, barArea.y + barArea.h);
      ctx.lineTo(barArea.x + barArea.w, barArea.y + barArea.h);
      ctx.stroke();
    }

    let runningAngle = -Math.PI / 2;
    const barWidth = (barArea.w / N) * 0.65;
    const barSpacing = barArea.w / N;

    items.forEach((item, idx) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;
      const barH = (item.value / maxVal) * barArea.h;
      const barX = barArea.x + idx * barSpacing + (barSpacing - barWidth) / 2;
      const barY = barArea.y + barArea.h - barH;

      // 32 sample points contour interpolation
      const points = [];
      const M = 32;
      for (let s = 0; s < M; s++) {
        const uSample = s / (M - 1);

        // Rectangular Cartesian coordinates
        let cx = 0, cy = 0;
        if (s < M / 4) {
          cx = barX + (s / (M / 4)) * barWidth;
          cy = barY;
        } else if (s < M / 2) {
          cx = barX + barWidth;
          cy = barY + ((s - M / 4) / (M / 4)) * barH;
        } else if (s < (3 * M) / 4) {
          cx = barX + barWidth - ((s - M / 2) / (M / 4)) * barWidth;
          cy = barY + barH;
        } else {
          cx = barX;
          cy = barY + barH - ((s - (3 * M) / 4) / (M / 4)) * barH;
        }

        // Polar Sector coordinates
        const polarTheta = runningAngle + uSample * sliceAngle;
        const polarR = pieCenter.r;
        const px = pieCenter.x + polarR * Math.cos(polarTheta) * (s < M / 2 ? 1 : 0);
        const py = pieCenter.y + polarR * Math.sin(polarTheta) * (s < M / 2 ? 1 : 0);

        // Morph interpolated position
        const morphX = (1 - p) * cx + p * px;
        const morphY = (1 - p) * cy + p * py;
        points.push({ x: morphX, y: morphY });
      }

      ctx.beginPath();
      ctx.fillStyle = item.color;
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.closePath();
      ctx.fill();

      // Pie percentage labels
      if (labelAlpha > 0) {
        const midA = runningAngle + sliceAngle / 2;
        const lx = pieCenter.x + (pieCenter.r + 24 * dpr) * Math.cos(midA);
        const ly = pieCenter.y + (pieCenter.r + 24 * dpr) * Math.sin(midA);
        ctx.fillStyle = `rgba(15, 23, 42, ${labelAlpha})`;
        ctx.font = `600 ${11 * dpr}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.round((item.value / total) * 100)}%`, lx, ly);
      }

      runningAngle += sliceAngle;
    });

    ctx.restore();
  };

  const forward = fromType === 'bar' && toType === 'pie';
  return createAnimationTicker({
    duration: duration,
    easing: 'easeInOutCubic',
    reducedMotion: options.reducedMotion,
    onFrame: (easedU) => {
      const p = forward ? easedU : (1 - easedU);
      renderFrame(p);
    },
    onComplete: () => {
      renderFrame(forward ? 1 : 0);
      if (typeof options.onComplete === 'function') options.onComplete();
    }
  });
}

/**
 * B7 (15): Rescaling d'axe animé Linéaire <-> Logarithmique (Cleveland & McGill 1984 / Tufte 1983).
 * Formula: y_v(p) = (1-p)*m_lin(v) + p*m_log(v) with p = easeInOutCubic(u).
 * Dual synchronous tick ladders cross-faded: α_lin = 1-p, α_log = p.
 *
 * @param {Object} chart Chart.js instance
 * @param {string} targetType 'linear' | 'logarithmic'
 * @param {Object} [options={}] Options { duration: 600, onComplete }
 * @returns {Object} Control handle { stop: Function }
 */
function animateAxisRescale(chart, targetType = 'logarithmic', options = {}) {
  if (!chart || !chart.data || !chart.data.datasets) {
    if (options.onComplete) options.onComplete();
    return { stop: () => {} };
  }

  const duration = options.duration !== undefined ? options.duration : 600;
  const ds = chart.data.datasets[0];
  if (!ds || !Array.isArray(ds.data)) {
    if (options.onComplete) options.onComplete();
    return { stop: () => {} };
  }

  if (!chart._kcOriginalValues) {
    chart._kcOriginalValues = [...ds.data];
  }
  const rawVals = chart._kcOriginalValues;
  const minVal = Math.max(1, Math.min(...rawVals));
  const maxVal = Math.max(...rawVals);

  const mLin = (v) => (v - minVal) / (maxVal - minVal);
  const mLog = (v) => (Math.log(v) - Math.log(minVal)) / (Math.log(maxVal) - Math.log(minVal));

  const targetP = targetType === 'logarithmic' ? 1 : 0;
  const initialP = chart._kcCurrentRescaleP !== undefined ? chart._kcCurrentRescaleP : (targetType === 'logarithmic' ? 0 : 1);

  if (isReducedMotionPreferred() || options.reducedMotion || duration === 0) {
    chart._kcCurrentRescaleP = targetP;
    ds.data = rawVals.map(v => (targetP === 1 ? mLog(v) * 100 : mLin(v) * 100));
    chart.update('none');
    if (typeof options.onComplete === 'function') options.onComplete();
    return { stop: () => {} };
  }

  return createAnimationTicker({
    duration: duration,
    easing: 'easeInOutCubic',
    reducedMotion: options.reducedMotion,
    onFrame: (easedU) => {
      const p = initialP + (targetP - initialP) * easedU;
      chart._kcCurrentRescaleP = p;
      ds.data = rawVals.map(v => {
        const norm = (1 - p) * mLin(v) + p * mLog(v);
        return norm * 100;
      });
      chart.update('none');
    },
    onComplete: () => {
      chart._kcCurrentRescaleP = targetP;
      ds.data = rawVals.map(v => (targetP === 1 ? mLog(v) * 100 : mLin(v) * 100));
      chart.update('none');
      if (typeof options.onComplete === 'function') options.onComplete();
    }
  });
}

/**
 * B8 (16): Traînée cométaire / Motion Trails / Comet Chart (Heer & Robertson 2007).
 * Connected scatter plot: head advances at constant arc-length speed (s_head = u * L).
 * Tail exponential decay α(s) = exp(-s/λ) with λ ≈ 20% L, background trace α ≈ 0.18.
 *
 * @param {Object} chart Chart.js instance
 * @param {Array<Array<{x: number, y: number}>>} seriesPaths Array of path point series
 * @param {Object} [options={}] Options { duration: 2000, lambdaFrac: 0.20, onComplete }
 * @returns {Object} Control handle { stop: Function }
 */
function animateMotionTrails(chart, seriesPaths = [], options = {}) {
  if (!chart) {
    if (options.onComplete) options.onComplete();
    return { stop: () => {} };
  }

  const duration = options.duration !== undefined ? options.duration : 2000;
  const lambdaFrac = options.lambdaFrac || 0.20;

  if (isReducedMotionPreferred() || options.reducedMotion || duration === 0) {
    chart._kcTrailProgress = 1;
    chart.update('none');
    if (typeof options.onComplete === 'function') options.onComplete();
    return { stop: () => {} };
  }

  return createAnimationTicker({
    duration: duration,
    easing: 'linear',
    reducedMotion: options.reducedMotion,
    onFrame: (easedU) => {
      chart._kcTrailProgress = easedU;
      chart._kcTrailLambdaFrac = lambdaFrac;
      chart.update('none');
    },
    onComplete: () => {
      chart._kcTrailProgress = 1;
      chart.update('none');
      if (typeof options.onComplete === 'function') options.onComplete();
    }
  });
}

/**
 * B9 (17): Construction sérielle narrative / Series Build-up (Miller 1956 / Hullman et al. 2013).
 * Cumulative gate: series j visible <=> t > j * Ts, Ts >= 800ms, fade-in 250ms, j_max <= 4.
 * Fade-in via RGBA opacity on chart.update('none').
 *
 * @param {Object} chart Chart.js instance
 * @param {Object} [options={}] Options { stepDuration: 900, fadeInMs: 250, onStep, onComplete }
 * @returns {Object} Control handle { stop: Function }
 */
function animateSeriesBuildup(chart, options = {}) {
  if (!chart || !chart.data || !chart.data.datasets) {
    if (options.onComplete) options.onComplete();
    return { stop: () => {} };
  }

  const datasets = chart.data.datasets;
  const numSeries = Math.min(4, datasets.length);
  const stepDur = Math.max(800, options.stepDuration || 900);
  const fadeInMs = Math.min(300, options.fadeInMs || 250);
  const totalDuration = numSeries * stepDur;

  const savedColors = datasets.map(ds => ({
    borderColor: ds.borderColor,
    backgroundColor: ds.backgroundColor
  }));

  if (isReducedMotionPreferred() || options.reducedMotion || totalDuration === 0) {
    datasets.forEach((ds, i) => {
      ds.borderColor = savedColors[i].borderColor;
      ds.backgroundColor = savedColors[i].backgroundColor;
    });
    chart.update('none');
    if (typeof options.onComplete === 'function') options.onComplete();
    return { stop: () => {} };
  }

  return createAnimationTicker({
    duration: totalDuration,
    easing: 'linear',
    reducedMotion: options.reducedMotion,
    onFrame: (easedU, elapsedMs) => {
      datasets.forEach((ds, j) => {
        const startTime = j * stepDur;
        if (elapsedMs < startTime) {
          ds.borderColor = 'rgba(0,0,0,0)';
          ds.backgroundColor = 'rgba(0,0,0,0)';
        } else {
          const fadeProgress = Math.min(1, (elapsedMs - startTime) / fadeInMs);
          const alpha = 1 - Math.pow(1 - fadeProgress, 2); // easeOutQuad
          ds.borderColor = hexToRgba(savedColors[j].borderColor, alpha);
          ds.backgroundColor = hexToRgba(savedColors[j].backgroundColor, alpha * 0.85);
        }
      });
      chart.update('none');
    },
    onComplete: () => {
      datasets.forEach((ds, i) => {
        ds.borderColor = savedColors[i].borderColor;
        ds.backgroundColor = savedColors[i].backgroundColor;
      });
      chart.update('none');
      if (typeof options.onComplete === 'function') options.onComplete();
    }
  });
}

/**
 * B10 (18): Scrollytelling à pas avec hystérésis (Conlen & Heer 2019 / Zacks & Tversky 2001).
 * Fraction mapping: r = (scrollTop / scrollMax) * (n - 1) in [0, n - 1].
 * Advance: r >= k + 0.65 ; Recede: r <= k - 0.65 (deadband +-0.15 around k + 0.5).
 * Enforces flex-shrink: 0 on story sections.
 *
 * @param {HTMLElement|string} scrollContainer DOM container or selector
 * @param {Array<Object>} steps Step definitions [{ id, title, data }]
 * @param {Object} [options={}] Options { onStepChange: Function }
 * @returns {Object} Scrollytelling manager handle { destroy: Function }
 */
function initScrollytelling(scrollContainer, steps = [], options = {}) {
  const container = typeof scrollContainer === 'string' ? document.querySelector(scrollContainer) : scrollContainer;
  if (!container || !steps.length) return { destroy: () => {} };

  let currentStep = 0;
  let lastScrollTop = container.scrollTop;
  const n = steps.length;

  const onScroll = () => {
    const scrollTop = container.scrollTop;
    const scrollMax = Math.max(1, container.scrollHeight - container.clientHeight);
    const r = (scrollTop / scrollMax) * (n - 1);
    const isScrollingDown = scrollTop >= lastScrollTop;
    lastScrollTop = scrollTop;

    let targetStep = currentStep;
    if (isScrollingDown) {
      if (r >= currentStep + 0.65 && currentStep < n - 1) {
        targetStep = currentStep + 1;
      }
    } else {
      if (r <= currentStep - 0.65 && currentStep > 0) {
        targetStep = currentStep - 1;
      }
    }

    if (targetStep !== currentStep) {
      currentStep = targetStep;
      if (typeof options.onStepChange === 'function') {
        options.onStepChange(currentStep, steps[currentStep]);
      }
    }
  };

  container.addEventListener('scroll', onScroll, { passive: true });
  return {
    getCurrentStep: () => currentStep,
    destroy: () => container.removeEventListener('scroll', onScroll)
  };
}

/**
 * B11 (19): Amorti critique physique / Spring sans dépassement (Card et al. 1991 / Dragicevic 2011).
 * Exact analytic solution of critically damped oscillator (ζ = 1):
 * x(t) = x1 - (x1 - x0)(1 + ω*t) * e^(-ω*t) with ω = 6 / T for T = 500ms.
 * Evaluated with physical elapsed ms from ticker (never normalized u).
 *
 * @param {HTMLElement|Function} target Target element or callback(x)
 * @param {number} x0 Initial position/value
 * @param {number} x1 Target equilibrium position/value
 * @param {Object} [options={}] Options { duration: 500, onComplete }
 * @returns {Object} Control handle { stop: Function }
 */
function animateCriticalDamping(target, x0 = 0, x1 = 100, options = {}) {
  const duration = options.duration !== undefined ? Number(options.duration) : 500;
  const omega = 6 / duration; // ω for t_95% = 3/ω = 500ms

  const setPos = (val) => {
    if (typeof target === 'function') {
      target(val);
    } else if (target && target.style) {
      target.style.transform = `translateX(${val}px)`;
    }
  };

  if (isReducedMotionPreferred() || options.reducedMotion || duration === 0) {
    setPos(x1);
    if (typeof options.onComplete === 'function') options.onComplete();
    return { stop: () => {} };
  }

  return createAnimationTicker({
    duration: duration,
    easing: 'linear', // physical math drives the easing internally
    reducedMotion: options.reducedMotion,
    onFrame: (easedU, elapsedMs) => {
      const t = elapsedMs; // physical ms
      const xt = x1 - (x1 - x0) * (1 + omega * t) * Math.exp(-omega * t);
      setPos(xt);
    },
    onComplete: () => {
      setPos(x1);
      if (typeof options.onComplete === 'function') options.onComplete();
    }
  });
}

/**
 * B12 (20): Flash d'onset pour valeurs modifiées / Delta Highlight (Jonides & Yantis 1988 / Healey & Enns 2012 / WCAG SC 2.3.1).
 * Formula: B(t) = B0 * e^(-t/τ) with B0 <= 0.35, τ ≈ 400ms, tick rate >= 800ms (<= 2 flashes/s).
 * Highlight overlay on modified marks, purged when B < 0.01.
 */
const kcDeltaFlashPlugin = {
  id: 'kcDeltaFlash',
  afterDatasetsDraw(chart, args, pluginOptions) {
    const flashState = chart._kcDeltaFlashState;
    if (!flashState || !flashState.active) return;

    const ctx = chart.ctx;
    if (!ctx) return;

    const t = flashState.elapsedMs;
    const { B0 = 0.35, tau = 400, color = '#E66101', modifiedIndices = [] } = flashState;
    const brightness = B0 * Math.exp(-t / tau);

    if (brightness < 0.01) {
      flashState.active = false;
      return;
    }

    const meta = chart.getDatasetMeta(flashState.datasetIndex || 0);
    if (!meta || !meta.data) return;

    ctx.save();
    modifiedIndices.forEach(idx => {
      const elem = meta.data[idx];
      if (!elem) return;
      const { x, y, base, width } = elem;

      // Render glowing onset overlay
      if (base !== undefined && width !== undefined) {
        ctx.fillStyle = hexToRgba(color, brightness);
        const barTop = Math.min(y, base);
        const barHeight = Math.abs(base - y);
        ctx.fillRect(x - width / 2, barTop, width, barHeight);

        // Crisp border highlight
        ctx.strokeStyle = hexToRgba(color, Math.min(1, brightness * 2.5));
        ctx.lineWidth = 2;
        ctx.strokeRect(x - width / 2, barTop, width, barHeight);
      }
    });
    ctx.restore();
  }
};

/**
 * Attaches a delta onset flash highlight on modified marks.
 *
 * @param {Object} chart Chart.js instance
 * @param {Array<number>} modifiedIndices Indices of changed items
 * @param {Object} [options={}] Options { B0: 0.35, tau: 400, color, datasetIndex, onComplete }
 * @returns {Object} Control handle { stop: Function }
 */
function attachDeltaFlash(chart, modifiedIndices = [], options = {}) {
  if (!chart) return { stop: () => {} };

  if (isReducedMotionPreferred() || options.reducedMotion) {
    if (typeof options.onComplete === 'function') options.onComplete();
    return { stop: () => {} };
  }

  const B0 = Math.min(0.35, options.B0 || 0.35);
  const tau = options.tau || 400;
  const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

  chart._kcDeltaFlashState = {
    active: true,
    modifiedIndices: modifiedIndices,
    datasetIndex: options.datasetIndex || 0,
    B0: B0,
    tau: tau,
    color: options.color || '#E66101',
    elapsedMs: 0
  };

  let rafId = null;
  const loop = () => {
    if (!chart._kcDeltaFlashState || !chart._kcDeltaFlashState.active) return;
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const elapsed = now - startTime;
    chart._kcDeltaFlashState.elapsedMs = elapsed;

    if (Math.exp(-elapsed / tau) < 0.01) {
      chart._kcDeltaFlashState.active = false;
      chart.render();
      if (typeof options.onComplete === 'function') options.onComplete();
      return;
    }

    chart.render();
    if (typeof requestAnimationFrame !== 'undefined') {
      rafId = requestAnimationFrame(loop);
    }
  };

  if (typeof requestAnimationFrame !== 'undefined') {
    rafId = requestAnimationFrame(loop);
  }

  return {
    stop: () => {
      if (chart._kcDeltaFlashState) chart._kcDeltaFlashState.active = false;
      if (rafId && typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(rafId);
      chart.render();
    }
  };
}

function getChartDefaultOptions(themeTokens) {
  const t = themeTokens || getThemeTokens(DEFAULT_THEME);
  const isTufte = t.name === 'tufte-minimalist-executive';
  const reduceMotion = isReducedMotionPreferred();

  return {
    responsive: true,
    maintainAspectRatio: false,
    categoryPercentage: 0.8,
    barPercentage: 0.9,
    layout: {
      padding: isTufte
        ? { top: 16, right: 16, bottom: 12, left: 12 }
        : { top: 20, right: 20, bottom: 16, left: 16 }
    },
    animation: (isTufte || reduceMotion)
      ? false
      : { duration: 400, easing: 'easeOutQuart' },
    interaction: {
      mode: 'nearest',
      intersect: false,
      axis: 'x'
    },
    hover: {
      mode: 'nearest',
      intersect: false,
      animationDuration: (isTufte || reduceMotion) ? 0 : 120
    },
    elements: {
      bar: {
        borderRadius: isTufte ? 0 : 4
      },
      line: {
        borderWidth: isTufte ? 1.5 : 2,
        tension: 0.1
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 6
      }
    },
    plugins: {
      legend: {
        display: false,
        position: 'top',
        align: 'start',
        labels: {
          color: t.textPrimary,
          font: {
            family: t.fontFamily,
            size: 12,
            weight: '500'
          },
          boxWidth: 12,
          boxHeight: 12,
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: t.tooltipBg,
        titleColor: t.tooltipText,
        bodyColor: t.tooltipText,
        borderColor: t.borderStrong || t.border,
        borderWidth: t.isDark || isTufte ? 1 : 0,
        padding: { top: 10, bottom: 10, left: 14, right: 14 },
        cornerRadius: isTufte ? 0 : 6,
        boxPadding: 6,
        usePointStyle: true,
        titleFont: {
          family: t.fontFamily,
          size: 12,
          weight: '600'
        },
        bodyFont: {
          family: t.fontMono,
          size: 12,
          weight: '400'
        },
        animation: (isTufte || reduceMotion) ? false : { duration: 150, easing: 'easeOutQuad' }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        border: {
          color: t.zeroLine || t.axisColor,
          width: 1
        },
        ticks: {
          color: t.textSecondary,
          font: {
            family: t.fontFamily,
            size: 11
          },
          padding: 6
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          display: !isTufte,
          color: t.gridColor,
          drawBorder: false
        },
        border: {
          display: false
        },
        ticks: {
          color: t.textSecondary,
          font: {
            family: t.fontMono,
            size: 11
          },
          padding: 8
        }
      }
    }
  };
}

function getColor(themeTokens, index = 0) {
  if (!themeTokens || !Array.isArray(themeTokens.palette) || themeTokens.palette.length === 0) {
    return '#2B8CBE';
  }
  const idx = Math.abs(parseInt(index, 10) || 0) % themeTokens.palette.length;
  return themeTokens.palette[idx];
}

function getSemanticColor(themeTokens, status) {
  if (!themeTokens) return '#999999';
  const s = String(status || '').toLowerCase();
  if (themeTokens.status && themeTokens.status[s]) {
    return themeTokens.status[s];
  }
  if (themeTokens.semantic) {
    return themeTokens.semantic[s] || themeTokens.semantic.neutral || '#999999';
  }
  return '#999999';
}

function getSequentialColor(themeTokens, ratio = 0) {
  if (!themeTokens || !Array.isArray(themeTokens.sequential) || themeTokens.sequential.length === 0) {
    return '#3182BD';
  }
  const clamped = Math.max(0, Math.min(1, Number(ratio) || 0));
  const idx = Math.min(
    Math.floor(clamped * themeTokens.sequential.length),
    themeTokens.sequential.length - 1
  );
  return themeTokens.sequential[idx];
}

function hexToRgba(color, alpha = 1) {
  if (!color || typeof color !== 'string') {
    return `rgba(0, 0, 0, ${alpha})`;
  }
  const clean = color.trim();
  if (clean.startsWith('rgba(')) {
    return clean.replace(/[\d.]+\)$/, `${alpha})`);
  }
  if (clean.startsWith('rgb(')) {
    return clean.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`);
  }
  let hex = clean.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  if (hex.length >= 6) {
    const r = parseInt(hex.substring(0, 2), 16) || 0;
    const g = parseInt(hex.substring(2, 4), 16) || 0;
    const b = parseInt(hex.substring(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return clean;
}

/**
 * Universal Valence & Directionality Color Resolver.
 * Resolves color dynamically according to metric nature (Gain vs Cost/Churn vs Neutral).
 * 
 * @param {Object|string} tokens Theme tokens object or theme slug
 * @param {number|string|boolean} direction Delta value (>0, <0, 0) or direction string ('up', 'down', 'neutral')
 * @param {string} metricType 'gain' (revenue, profit), 'cost' (churn, risk, loss, latency, defect), or 'neutral'/'volume'
 * @returns {string} Resolved CSS color string
 */
function getValenceColor(tokens, direction = 0, metricType = 'gain') {
  const t = (typeof tokens === 'string' ? getThemeTokens(tokens) : tokens) || getThemeTokens(DEFAULT_THEME);
  const status = t.status || {};
  const semantic = t.semantic || {};

  // Resolve direction
  let dir = 'flat';
  if (typeof direction === 'number') {
    if (direction > 0) dir = 'up';
    else if (direction < 0) dir = 'down';
    else dir = 'flat';
  } else if (typeof direction === 'boolean') {
    dir = direction ? 'up' : 'down';
  } else if (typeof direction === 'string') {
    const s = direction.trim().toLowerCase();
    if (!isNaN(Number(s)) && s !== '') {
      const num = Number(s);
      dir = num > 0 ? 'up' : (num < 0 ? 'down' : 'flat');
    } else if (['up', 'increase', 'positive', '+', 'gain', 'rise', 'higher', 'growth', 'true', 'above'].includes(s)) {
      dir = 'up';
    } else if (['down', 'decrease', 'negative', '-', 'loss', 'fall', 'lower', 'drop', 'decline', 'false', 'below'].includes(s)) {
      dir = 'down';
    } else {
      dir = 'flat';
    }
  }

  // Normalize metricType
  const m = String(metricType || 'gain').trim().toLowerCase().replace(/[-_]/g, '');

  const COST_METRICS = [
    'cost', 'churn', 'risk', 'loss', 'latency', 'defect', 'defects',
    'defectrate', 'error', 'errors', 'co2', 'debt', 'expense', 'opex',
    'cac', 'lowerisbetter', 'incident', 'incidents', 'bouncerate', 'downtime'
  ];

  const NEUTRAL_METRICS = [
    'neutral', 'volume', 'descriptive', 'share', 'marketshare',
    'temperature', 'headcount', 'info'
  ];

  let role = 'neutral';
  if (NEUTRAL_METRICS.includes(m)) {
    if (dir === 'up') role = 'info';
    else if (dir === 'down') role = 'neutral';
    else role = 'neutral';
  } else if (COST_METRICS.includes(m)) {
    // Inverted polarity: up is danger, down is success
    if (dir === 'up') role = 'danger';
    else if (dir === 'down') role = 'success';
    else role = 'neutral';
  } else {
    // Standard gain/direct polarity: up is success, down is danger
    if (dir === 'up') role = 'success';
    else if (dir === 'down') role = 'danger';
    else role = 'neutral';
  }

  if (role === 'success') {
    return status.success || semantic.positive || '#2E7D32';
  }
  if (role === 'danger') {
    return status.danger || semantic.negative || '#C62828';
  }
  if (role === 'info') {
    return status.info || semantic.info || '#1565C0';
  }
  if (role === 'warning') {
    return status.warning || semantic.warning || '#EF6C00';
  }
  return status.neutral || semantic.neutral || '#94A3B8';
}

/**
 * Universal Visual Emphasis Style Generator.
 * Resolves complete Chart.js styling object for a given visual role.
 * 
 * @param {Object|string} tokens Theme tokens object or theme slug
 * @param {string} role 'focal'|'hero', 'context'|'muted', 'benchmark'|'target', 'anomaly'|'outlier', 'forecast'|'projection', 'missing'|'nodata'
 * @param {Object} options Custom overrides (fill, alpha, radius, etc.)
 * @returns {Object} Chart.js dataset/point style object
 */
function getEmphasisStyle(tokens, role = 'focal', options = {}) {
  const t = (typeof tokens === 'string' ? getThemeTokens(tokens) : tokens) || getThemeTokens(DEFAULT_THEME);
  const emphasis = t.emphasis || {};
  const status = t.status || {};
  const r = String(role || 'focal').trim().toLowerCase().replace(/[-_]/g, '');

  let style = {};

  if (['focal', 'hero', 'primary', 'focus'].includes(r)) {
    const color = emphasis.focal || t.palette?.[0] || '#2B8CBE';
    style = {
      borderColor: color,
      backgroundColor: options.fill ? hexToRgba(color, options.alpha ?? 0.2) : color,
      borderWidth: 2,
      borderDash: [],
      pointStyle: 'circle',
      pointRadius: 4,
      pointBackgroundColor: color,
      pointBorderColor: t.surfaceRaised || t.bg || '#FFFFFF'
    };
  } else if (['context', 'muted', 'secondary', 'background'].includes(r)) {
    const color = emphasis.context || t.textMuted || '#CBD5E1';
    style = {
      borderColor: color,
      backgroundColor: options.fill ? hexToRgba(color, options.alpha ?? 0.1) : hexToRgba(color, options.alpha ?? 0.4),
      borderWidth: 1,
      borderDash: [],
      pointStyle: 'circle',
      pointRadius: 2,
      pointBackgroundColor: color,
      pointBorderColor: color
    };
  } else if (['benchmark', 'target', 'baseline', 'reference', 'goal'].includes(r)) {
    const color = emphasis.benchmark || t.zeroLine || '#475569';
    style = {
      borderColor: color,
      backgroundColor: options.fill ? hexToRgba(color, options.alpha ?? 0.15) : color,
      borderWidth: 2,
      borderDash: [4, 4],
      pointStyle: 'rectRot',
      pointRadius: 4,
      pointBackgroundColor: color,
      pointBorderColor: t.surfaceRaised || t.bg || '#FFFFFF'
    };
  } else if (['anomaly', 'outlier', 'alert'].includes(r)) {
    const color = emphasis.anomaly || status.danger || '#D01C8B';
    style = {
      borderColor: color,
      backgroundColor: options.fill ? hexToRgba(color, options.alpha ?? 0.25) : color,
      borderWidth: 2,
      borderDash: [],
      pointStyle: 'triangle',
      pointRadius: 6,
      pointBackgroundColor: color,
      pointBorderColor: t.surfaceRaised || t.bg || '#FFFFFF'
    };
  } else if (['forecast', 'projection', 'future', 'uncertainty'].includes(r)) {
    const alpha = emphasis.forecastAlpha !== undefined ? emphasis.forecastAlpha : 0.5;
    const color = emphasis.focal || t.palette?.[0] || '#2B8CBE';
    const effectiveAlpha = options.alpha !== undefined ? options.alpha : alpha;
    style = {
      borderColor: hexToRgba(color, effectiveAlpha),
      backgroundColor: hexToRgba(color, options.fillAlpha !== undefined ? options.fillAlpha : effectiveAlpha * 0.4),
      borderWidth: 2,
      borderDash: [5, 5],
      pointStyle: 'crossRot',
      pointRadius: 5,
      pointBackgroundColor: hexToRgba(color, effectiveAlpha),
      pointBorderColor: hexToRgba(color, effectiveAlpha)
    };
  } else if (['missing', 'nodata', 'null', 'incomplete'].includes(r)) {
    const color = t.textMuted || '#94A3B8';
    style = {
      borderColor: color,
      backgroundColor: hexToRgba(color, options.alpha ?? 0.15),
      borderWidth: 1,
      borderDash: [3, 3],
      pointStyle: 'rect',
      pointRadius: 3,
      pointBackgroundColor: 'transparent',
      pointBorderColor: color
    };
  } else {
    // Default fallback to focal
    const color = emphasis.focal || t.palette?.[0] || '#2B8CBE';
    style = {
      borderColor: color,
      backgroundColor: options.fill ? hexToRgba(color, options.alpha ?? 0.2) : color,
      borderWidth: 2,
      borderDash: [],
      pointStyle: 'circle',
      pointRadius: 4,
      pointBackgroundColor: color,
      pointBorderColor: t.surfaceRaised || t.bg || '#FFFFFF'
    };
  }

  // Apply explicit overrides from options
  if (options.borderColor !== undefined) style.borderColor = options.borderColor;
  if (options.backgroundColor !== undefined) style.backgroundColor = options.backgroundColor;
  if (options.borderWidth !== undefined) style.borderWidth = options.borderWidth;
  if (options.borderDash !== undefined) style.borderDash = options.borderDash;
  if (options.pointStyle !== undefined) style.pointStyle = options.pointStyle;
  if (options.pointRadius !== undefined) style.pointRadius = options.pointRadius;
  else if (options.radius !== undefined) style.pointRadius = options.radius;
  if (options.pointBackgroundColor !== undefined) style.pointBackgroundColor = options.pointBackgroundColor;
  if (options.pointBorderColor !== undefined) style.pointBorderColor = options.pointBorderColor;

  return {
    ...style,
    ...options
  };
}

/**
 * Universal Threshold & Target Status Calculator.
 * Evaluates performance against target / benchmarks and calculates ratio, delta, status and label.
 * 
 * @param {number} value Actual measured numeric value
 * @param {number} target Reference objective / benchmark target
 * @param {Object} thresholds Threshold ratios { warning, danger, success, polarity, tokens }
 * @param {string} polarity 'higher-is-better' (default) or 'lower-is-better'
 * @param {Object|string} tokens Optional theme tokens object
 * @returns {Object} Status resolution object { value, target, ratio, delta, deltaPercent, percent, status, color, label, polarity }
 */
function getThresholdStatus(value, target, thresholds = {}, polarity = 'higher-is-better', tokens = null) {
  const val = Number(value) || 0;
  const tgt = Number(target) || 0;
  const ratio = tgt !== 0 ? val / tgt : (val === 0 ? 1 : (val > 0 ? Infinity : -Infinity));
  const delta = val - tgt;
  const deltaPercent = tgt !== 0 ? (delta / Math.abs(tgt)) * 100 : (val === 0 ? 0 : 100);

  const threshObj = typeof thresholds === 'object' && thresholds !== null ? thresholds : {};
  const pol = String(polarity || threshObj.polarity || 'higher-is-better').trim().toLowerCase().replace(/[-_]/g, '');
  const isLowerBetter = ['lowerisbetter', 'cost', 'risk', 'churn', 'loss', 'latency', 'defect', 'inverted'].includes(pol);

  let status = 'success';
  if (isLowerBetter) {
    let successBound = threshObj.success !== undefined ? threshObj.success : (threshObj.danger !== undefined && threshObj.warning !== undefined ? threshObj.warning : 1.0);
    if (successBound > 1.5) successBound /= 100;

    let warningBound = threshObj.warning !== undefined ? (threshObj.danger !== undefined ? threshObj.danger : threshObj.warning) : 1.05;
    if (warningBound > 1.5) warningBound /= 100;

    let dangerBound = threshObj.danger !== undefined ? threshObj.danger : 1.10;
    if (dangerBound > 1.5) dangerBound /= 100;

    const minBound = Math.min(successBound, warningBound);
    const maxBound = Math.max(warningBound, dangerBound);

    if (ratio <= minBound) {
      status = 'success';
    } else if (ratio <= maxBound) {
      status = 'warning';
    } else {
      status = 'danger';
    }
  } else {
    let successBound = threshObj.success !== undefined ? threshObj.success : (threshObj.danger !== undefined && threshObj.warning !== undefined ? threshObj.warning : 1.0);
    if (successBound > 1.5) successBound /= 100;

    let warningBound = threshObj.warning !== undefined ? (threshObj.danger !== undefined ? threshObj.danger : threshObj.warning) : 0.90;
    if (warningBound > 1.5) warningBound /= 100;

    let dangerBound = threshObj.danger !== undefined ? threshObj.danger : 0.90;
    if (dangerBound > 1.5) dangerBound /= 100;

    const topBound = Math.max(successBound, warningBound);
    const bottomBound = Math.min(warningBound, dangerBound);

    if (ratio >= topBound) {
      status = 'success';
    } else if (ratio >= bottomBound) {
      status = 'warning';
    } else {
      status = 'danger';
    }
  }

  const tok = tokens || threshObj.tokens || null;
  const t = (typeof tok === 'string' ? getThemeTokens(tok) : tok) || getThemeTokens(DEFAULT_THEME);
  const statusColors = t.status || {};
  const semanticColors = t.semantic || {};

  let color = '#2E7D32';
  if (status === 'success') {
    color = statusColors.success || semanticColors.positive || '#2E7D32';
  } else if (status === 'warning') {
    color = statusColors.warning || semanticColors.warning || '#EF6C00';
  } else if (status === 'danger') {
    color = statusColors.danger || semanticColors.negative || '#C62828';
  }

  const sign = delta >= 0 ? '+' : '';
  const statusLabel = status === 'success' ? 'Atteint' : (status === 'warning' ? 'Vigilance' : 'Critique');
  const label = `${sign}${deltaPercent.toFixed(1)}% (${statusLabel})`;

  return {
    value: val,
    target: tgt,
    ratio: Math.round(ratio * 10000) / 10000,
    delta: Math.round(delta * 100) / 100,
    deltaPercent: Math.round(deltaPercent * 100) / 100,
    percent: Math.round(deltaPercent * 100) / 100,
    status,
    color,
    label,
    polarity: isLowerBetter ? 'lower-is-better' : 'higher-is-better'
  };
}

/**
 * Résout les seuils selon le contrat de provenance (explicit > statistical > neutral). Déterministe.
 *
 * @param {number[]} data - Série de référence (données brutes numériques)
 * @param {Object|null} explicit - Seuils métier explicites { target, warning, danger, polarity } ou null
 * @param {Object} [opts={}] - Options { method: 'sigma'|'quantile', k: 2, polarity: 'higher-is-better'|'lower-is-better' }
 * @returns {{ provenance: 'explicit'|'statistical'|'neutral',
 *             target: number|null, warning: number|null, danger: number|null,
 *             polarity: string, badge: string, method?: string, mu?: number, sigma?: number, k?: number }}
 */
function resolveThresholds(data, explicit, opts = {}) {
  const defaultPolarity = (opts && opts.polarity) || (explicit && explicit.polarity) || 'higher-is-better';
  const normPol = String(defaultPolarity).trim().toLowerCase().replace(/[-_]/g, '');
  const isLowerBetter = ['lowerisbetter', 'cost', 'risk', 'churn', 'loss', 'latency', 'defect', 'inverted'].includes(normPol);
  const normalizedPolarity = isLowerBetter ? 'lower-is-better' : 'higher-is-better';

  // 1. Niveau Explicit
  if (explicit !== null && explicit !== undefined) {
    if (typeof explicit !== 'object' || Array.isArray(explicit)) {
      throw new Error('kit-charts: incomplete explicit thresholds');
    }
    const hasTarget = explicit.target !== undefined && explicit.target !== null && !isNaN(Number(explicit.target));
    const hasWarning = explicit.warning !== undefined && explicit.warning !== null && !isNaN(Number(explicit.warning));
    const hasDanger = explicit.danger !== undefined && explicit.danger !== null && !isNaN(Number(explicit.danger));

    if (!hasTarget || !hasWarning || !hasDanger) {
      throw new Error('kit-charts: incomplete explicit thresholds');
    }

    const expPol = explicit.polarity ? (['lowerisbetter', 'cost', 'risk', 'churn', 'loss', 'latency', 'defect', 'inverted'].includes(String(explicit.polarity).trim().toLowerCase().replace(/[-_]/g, '')) ? 'lower-is-better' : 'higher-is-better') : normalizedPolarity;

    return {
      provenance: 'explicit',
      target: Number(explicit.target),
      warning: Number(explicit.warning),
      danger: Number(explicit.danger),
      polarity: expPol,
      badge: 'Seuil: métier'
    };
  }

  // 2. Niveau Statistical
  const cleanData = Array.isArray(data)
    ? data.map(Number).filter(v => typeof v === 'number' && !isNaN(v))
    : [];

  if (cleanData.length >= 5) {
    const method = (opts && opts.method) === 'quantile' ? 'quantile' : 'sigma';

    if (method === 'quantile') {
      const sorted = [...cleanData].sort((a, b) => a - b);
      const n = sorted.length;
      const getQuantile = (p) => {
        const h = (n - 1) * p;
        const floor = Math.floor(h);
        const ceil = Math.ceil(h);
        if (floor === ceil) return sorted[floor];
        return sorted[floor] + (h - floor) * (sorted[ceil] - sorted[floor]);
      };

      let target, warning, danger;
      if (isLowerBetter) {
        target = getQuantile(0.50);
        warning = getQuantile(0.75);
        danger = getQuantile(0.90);
      } else {
        target = getQuantile(0.50);
        warning = getQuantile(0.25);
        danger = getQuantile(0.10);
      }

      return {
        provenance: 'statistical',
        target,
        warning,
        danger,
        polarity: normalizedPolarity,
        badge: 'Seuil: statistique (quantile)',
        method: 'quantile'
      };
    } else {
      // Méthode sigma (μ ± kσ)
      const k = (opts && typeof opts.k === 'number') ? opts.k : 2;
      const n = cleanData.length;
      const mu = cleanData.reduce((sum, v) => sum + v, 0) / n;
      const variance = cleanData.reduce((sum, v) => sum + Math.pow(v - mu, 2), 0) / (n - 1);
      const sigma = Math.sqrt(variance);

      let target = mu;
      let warning, danger, badge;
      if (isLowerBetter) {
        warning = mu + 1 * sigma;
        danger = mu + k * sigma;
        badge = `Seuil: statistique (μ+${k}σ)`;
      } else {
        warning = mu - 1 * sigma;
        danger = mu - k * sigma;
        badge = `Seuil: statistique (μ-${k}σ)`;
      }

      return {
        provenance: 'statistical',
        target,
        warning,
        danger,
        polarity: normalizedPolarity,
        badge,
        method: 'sigma',
        mu,
        sigma,
        k
      };
    }
  }

  // 3. Niveau Neutral (fallback si data < 5 points ou données absentes)
  const target = cleanData.length > 0
    ? cleanData.reduce((sum, v) => sum + v, 0) / cleanData.length
    : null;

  return {
    provenance: 'neutral',
    target,
    warning: null,
    danger: null,
    polarity: normalizedPolarity,
    badge: 'Seuil: N/D'
  };
}

/**
 * Analyse une série de données quantitatives et suggère déterministement l'échelle optimale ('linear' ou 'log')
 * selon la loi psychophysique de Weber-Fechner (seuil >= 2 décades = ratio >= 100).
 *
 * @param {number[]|Array<{x?: number, y?: number}>} data - Données brutes
 * @param {Object} [options={}] - Options (ratioThreshold: 100)
 * @returns {'linear'|'log'}
 */
function suggestScale(data, options = {}) {
  let values = [];
  if (Array.isArray(data)) {
    data.forEach(item => {
      if (typeof item === 'number' && !isNaN(item)) {
        values.push(item);
      } else if (typeof item === 'object' && item !== null) {
        if (typeof item.y === 'number' && !isNaN(item.y)) values.push(item.y);
        else if (typeof item.x === 'number' && !isNaN(item.x)) values.push(item.x);
        else if (typeof item.value === 'number' && !isNaN(item.value)) values.push(item.value);
      }
    });
  }

  if (values.length === 0) return 'linear';
  // Si une seule valeur <= 0 est présente, l'échelle log est interdite
  if (values.some(v => v <= 0)) return 'linear';

  const minPos = Math.min(...values);
  const maxVal = Math.max(...values);
  if (minPos <= 0) return 'linear';

  const ratioThreshold = (options && typeof options.ratioThreshold === 'number') ? options.ratioThreshold : 100;
  const ratio = maxVal / minPos;
  return ratio >= ratioThreshold ? 'log' : 'linear';
}

/**
 * Génère la configuration Chart.js pour un axe logarithmique conforme aux règles psychophysiques.
 *
 * @param {Object|string} [themeTokens]
 * @param {Object} [options={}]
 * @returns {Object} Configuration d'échelle Chart.js
 */
function getLogScaleOptions(themeTokens, options = {}) {
  const t = (typeof themeTokens === 'string' ? getThemeTokens(themeTokens) : themeTokens) || getThemeTokens(DEFAULT_THEME);
  const base = options.base || 10;

  return {
    type: 'logarithmic',
    grid: {
      color: t.gridColor || 'rgba(15, 23, 42, 0.06)',
      borderColor: t.axisColor || '#94A3B8'
    },
    ticks: {
      color: t.textSecondary || '#334155',
      font: {
        family: t.fontMono || 'monospace',
        size: 11
      },
      callback: function(value) {
        if (value === 0) return '0';
        if (options.ticks === 'decades' || options.ticks === undefined) {
          const logVal = Math.log10(value);
          if (Math.abs(logVal - Math.round(logVal)) < 1e-6) {
            return value >= 1000 || value <= 0.001
              ? value.toExponential()
              : value.toLocaleString('fr-FR');
          }
          return null;
        }
        return value.toLocaleString('fr-FR');
      }
    },
    ...options
  };
}

/**
 * Applique déterministement la loi de Hick (1952) et le plafond de Miller (1956)
 * en limitant le nombre de séries interactives simultanées pour préserver l'ergonomie visuelle.
 *
 * @param {Array<Object>} datasets - Séries de données
 * @param {Object} [options={}] - Options (maxSeries: 7, aggregateRemainder: true, rankBy: 'sum'|'last')
 * @returns {Array<Object>} Séries budgétées et normalisées
 */
function resolveSeriesBudget(datasets, options = {}) {
  if (!Array.isArray(datasets)) return [];
  const maxSeries = (options && typeof options.maxSeries === 'number' && options.maxSeries > 0) ? options.maxSeries : 7;
  const aggregateRemainder = (options && options.aggregateRemainder !== undefined) ? options.aggregateRemainder : true;
  const rankBy = (options && options.rankBy) || 'sum';

  if (datasets.length <= maxSeries) {
    const res = datasets.map(ds => ({ ...ds }));
    res.__budget = {
      strategy: 'direct',
      totalSeries: datasets.length,
      keptCount: datasets.length,
      aggregatedCount: 0,
      maxSeries,
      missingCount: 0,
      rationale: `${datasets.length} séries ≤ plafond ${maxSeries} : toutes conservées`
    };
    return res;
  }

  // Calcul du score de saillance / importance pour chaque série (somme des valeurs absolues)
  let totalMissing = 0;
  const scored = datasets.map((ds, idx) => {
    const isFocal = ds.role === 'focal' || ds.emphasis === 'focal' || ds.priority === true;
    const data = Array.isArray(ds.data) ? ds.data : [];
    let metricVal = 0;
    if (rankBy === 'last' && data.length > 0) {
      const last = data[data.length - 1];
      const lastNum = typeof last === 'number' ? last : (last && typeof last.y === 'number' ? last.y : NaN);
      metricVal = isNaN(lastNum) ? 0 : Math.abs(lastNum);
    } else {
      metricVal = data.reduce((acc, v) => {
        const num = typeof v === 'number' ? v : (v && typeof v.y === 'number' ? v.y : NaN);
        if (num === null || num === undefined || isNaN(num)) {
          totalMissing++;
          return acc;
        }
        return acc + Math.abs(num);
      }, 0);
    }
    return {
      ds,
      originalIndex: idx,
      isFocal,
      metricVal
    };
  });

  // Tri déterministe: focal en premier, puis par valeur absolue décroissante, puis par label alphabétique ascendant
  scored.sort((a, b) => {
    if (a.isFocal && !b.isFocal) return -1;
    if (!a.isFocal && b.isFocal) return 1;
    if (b.metricVal !== a.metricVal) return b.metricVal - a.metricVal;
    const labelA = a.ds && a.ds.label !== undefined ? String(a.ds.label) : '';
    const labelB = b.ds && b.ds.label !== undefined ? String(b.ds.label) : '';
    const comp = labelA.localeCompare(labelB);
    if (comp !== 0) return comp;
    return a.originalIndex - b.originalIndex;
  });

  if (aggregateRemainder) {
    const keepCount = maxSeries - 1;
    const topScored = scored.slice(0, keepCount);
    const remainderScored = scored.slice(keepCount);

    const result = topScored.map(s => ({ ...s.ds }));

    if (remainderScored.length > 0) {
      const maxLen = Math.max(...remainderScored.map(s => Array.isArray(s.ds.data) ? s.ds.data.length : 0));
      const aggregatedData = new Array(maxLen);

      for (let i = 0; i < maxLen; i++) {
        let sum = 0;
        let validCount = 0;
        remainderScored.forEach(s => {
          const d = s.ds.data;
          if (Array.isArray(d) && i < d.length) {
            const rawVal = d[i];
            const v = typeof rawVal === 'number' ? rawVal : (rawVal && typeof rawVal.y === 'number' ? rawVal.y : NaN);
            if (rawVal !== null && rawVal !== undefined && !isNaN(v)) {
              sum += v;
              validCount++;
            }
          }
        });
        aggregatedData[i] = validCount > 0 ? sum : null;
      }

      result.push({
        label: `Autres (${remainderScored.length})`,
        data: aggregatedData,
        role: 'context',
        emphasis: 'context',
        isAggregated: true,
        aggregatedCount: remainderScored.length
      });
    }

    result.__budget = {
      strategy: 'topNAggregated',
      totalSeries: datasets.length,
      keptCount: topScored.length,
      aggregatedCount: remainderScored.length,
      maxSeries,
      missingCount: totalMissing,
      rationale: `${datasets.length} séries > plafond ${maxSeries} (loi de Hick) : top ${topScored.length} conservées + agrégat 'Autres (${remainderScored.length})'`
    };

    return result;
  } else {
    const result = scored.map((s, rank) => {
      const clone = { ...s.ds };
      if (rank >= maxSeries) {
        clone.hidden = true;
      }
      return clone;
    });

    const hiddenCount = Math.max(0, scored.length - maxSeries);
    result.__budget = {
      strategy: 'topN',
      totalSeries: datasets.length,
      keptCount: Math.min(maxSeries, datasets.length),
      aggregatedCount: hiddenCount,
      maxSeries,
      missingCount: totalMissing,
      rationale: `${datasets.length} séries > plafond ${maxSeries} (loi de Hick) : top ${maxSeries} affichées, ${hiddenCount} masquées`
    };

    return result;
  }
}




/**
 * Resolves Fitts-compliant 2D interaction options for Scatter, Bubble, and Distribution charts.
 *
 * @param {Object|string} [themeTokens] Theme tokens object or slug
 * @param {Object} [options={}] Interaction overrides
 * @returns {Object} Chart.js configuration fragment
 */
function getSpatialInteractionOptions(themeTokens, options = {}) {
  const t = (typeof themeTokens === 'string' ? getThemeTokens(themeTokens) : themeTokens) || getThemeTokens(DEFAULT_THEME);
  const isTufte = t.name === 'tufte-minimalist-executive';
  const reduceMotion = isReducedMotionPreferred();

  return {
    interaction: {
      mode: 'nearest',
      intersect: options.intersect !== undefined ? options.intersect : false,
      axis: 'xy'
    },
    elements: {
      point: {
        radius: options.radius !== undefined ? options.radius : 4,
        hitRadius: options.hitRadius !== undefined ? options.hitRadius : 14,
        hoverRadius: options.hoverRadius !== undefined ? options.hoverRadius : 7,
        hoverBorderWidth: 2
      }
    },
    hover: {
      mode: 'nearest',
      intersect: options.intersect !== undefined ? options.intersect : false,
      animationDuration: (isTufte || reduceMotion) ? 0 : (options.hoverDuration !== undefined ? options.hoverDuration : 100)
    },
    ...options
  };
}

/**
 * Resolves synchronized 1D interaction options for Time-Series, Line, and Area charts.
 *
 * @param {Object|string} [themeTokens] Theme tokens object or slug
 * @param {Object|string} [options={}] Interaction overrides or axis string ('x'|'y')
 * @returns {Object} Chart.js configuration fragment
 */
function getTemporalInteractionOptions(themeTokens, options = {}) {
  const opts = typeof options === 'string' ? { axis: options } : (options || {});
  const t = (typeof themeTokens === 'string' ? getThemeTokens(themeTokens) : themeTokens) || getThemeTokens(DEFAULT_THEME);
  const isTufte = t.name === 'tufte-minimalist-executive';
  const reduceMotion = isReducedMotionPreferred();
  const axis = opts.axis || 'x';

  return {
    interaction: {
      mode: 'index',
      intersect: opts.intersect !== undefined ? opts.intersect : false,
      axis: axis
    },
    elements: {
      line: {
        borderWidth: isTufte ? 1.5 : (opts.borderWidth !== undefined ? opts.borderWidth : 2),
        tension: opts.tension !== undefined ? opts.tension : 0.1
      },
      point: {
        radius: opts.radius !== undefined ? opts.radius : 3,
        hitRadius: opts.hitRadius !== undefined ? opts.hitRadius : 12,
        hoverRadius: opts.hoverRadius !== undefined ? opts.hoverRadius : 6
      }
    },
    hover: {
      mode: 'index',
      intersect: opts.intersect !== undefined ? opts.intersect : false,
      axis: axis,
      animationDuration: (isTufte || reduceMotion) ? 0 : (opts.hoverDuration !== undefined ? opts.hoverDuration : 100)
    },
    ...opts
  };
}

/**
 * Resolves discrete partition interaction options for Pie, Donut, Treemap, and Waffle charts.
 *
 * @param {Object|string} [themeTokens] Theme tokens object or slug
 * @param {Object} [options={}] Interaction overrides
 * @returns {Object} Chart.js configuration fragment
 */
function getPartitionInteractionOptions(themeTokens, options = {}) {
  const t = (typeof themeTokens === 'string' ? getThemeTokens(themeTokens) : themeTokens) || getThemeTokens(DEFAULT_THEME);
  const isTufte = t.name === 'tufte-minimalist-executive';
  const reduceMotion = isReducedMotionPreferred();

  return {
    interaction: {
      mode: 'nearest',
      intersect: options.intersect !== undefined ? options.intersect : true,
      axis: 'xy'
    },
    elements: {
      arc: {
        borderWidth: isTufte ? 1 : 2,
        hoverBorderWidth: 3,
        hoverOffset: (isTufte || reduceMotion) ? 0 : 4
      },
      point: {
        radius: options.radius !== undefined ? options.radius : 4,
        hitRadius: options.hitRadius !== undefined ? options.hitRadius : 8,
        hoverRadius: options.hoverRadius !== undefined ? options.hoverRadius : 6
      }
    },
    hover: {
      mode: 'nearest',
      intersect: options.intersect !== undefined ? options.intersect : true,
      animationDuration: (isTufte || reduceMotion) ? 0 : (options.hoverDuration !== undefined ? options.hoverDuration : 120)
    },
    ...options
  };
}

/**
 * Resolves minimalist, distraction-free options for executive summaries (Tufte zero-latency mode).
 *
 * @param {Object|string} [themeTokens] Theme tokens object or slug
 * @param {Object} [options={}] Overrides
 * @returns {Object} Chart.js configuration fragment
 */
function getExecutiveModeOptions(themeTokens, options = {}) {
  const t = (typeof themeTokens === 'string' ? getThemeTokens(themeTokens) : themeTokens) || getThemeTokens(DEFAULT_THEME);

  return {
    animation: false,
    elements: {
      bar: { borderRadius: 0 },
      line: { borderWidth: 1.5, tension: 0 },
      point: { radius: 3, hitRadius: 10, hoverRadius: 5 }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        animation: false,
        cornerRadius: 0,
        borderWidth: 1,
        borderColor: t.borderStrong || t.border || '#111111'
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { display: false } }
    },
    ...options
  };
}

/**
 * Computes deterministic anti-occlusion tooltip coordinates with quadrant flipping and lateral clamping.
 *
 * @param {Object} pointCoords - { x, y } Target marker canvas coordinates
 * @param {Object} tooltipDim - { width, height } Tooltip dimensions
 * @param {Object} canvasDim - { width, height } Canvas dimensions
 * @param {number} [offset=12] - Vertical safety offset in pixels
 * @param {number} [margin=8] - Viewport safety margin in pixels
 * @returns {{x: number, y: number, caretPosition: 'top'|'bottom', align: 'center'|'left'|'right'}}
 */
function computeAntiOcclusionTooltipPosition(pointCoords, tooltipDim, canvasDim, offset = 12, margin = 8) {
  const { x: px, y: py } = pointCoords || { x: 0, y: 0 };
  const { width: tw, height: th } = tooltipDim || { width: 120, height: 60 };
  const { width: cw, height: ch } = canvasDim || { width: 800, height: 600 };

  let tx = px - tw / 2;
  let ty = py - th - offset;
  let caretPosition = 'bottom';
  let align = 'center';

  // 1. Top edge collision: flip to bottom quadrant
  if (ty < margin) {
    ty = py + offset;
    caretPosition = 'top';
  }

  // 2. Bottom edge collision: strict clamping
  if (ty + th > ch - margin) {
    ty = ch - th - margin;
  }

  // 3. Left edge collision: clamp to margin and align left
  if (tx < margin) {
    tx = margin;
    align = 'left';
  }

  // 4. Right edge collision: clamp to right margin and align right
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

/**
 * Formats a value compactly and deterministically according to cognitive guidelines.
 *
 * @param {number|string} val - Raw numeric or string value
 * @param {Object} [options={}] - Formatting options { notation, isPercent, maximumFractionDigits, prefix, suffix }
 * @returns {string} Formatted label string
 */
function formatLabelValue(val, options = {}) {
  if (val === null || val === undefined) return '';
  let num;
  if (typeof val === 'number') {
    num = val;
  } else if (Array.isArray(val)) {
    num = val.length >= 2 ? (Number(val[1]) - Number(val[0])) : Number(val[0]);
  } else if (typeof val === 'object' && val !== null) {
    const rawNum = val.value ?? val.v ?? val.y ?? val.x ?? val.raw;
    if (typeof rawNum === 'number') {
      num = rawNum;
    } else if (typeof rawNum === 'string' && !isNaN(Number(rawNum))) {
      num = Number(rawNum);
    } else {
      return '';
    }
  } else if (typeof val === 'string') {
    const parsed = Number(val);
    if (isNaN(parsed)) return val;
    num = parsed;
  } else {
    try {
      const parsed = Number(val);
      if (isNaN(parsed)) return '';
      num = parsed;
    } catch (e) {
      return '';
    }
  }
  if (isNaN(num)) return typeof val === 'string' ? val : '';

  if (options.isPercent || options.percentage) {
    const p = Math.abs(num) <= 1 && options.normalizeUnit ? num * 100 : num;
    return `${Math.round(p)}%`;
  }

  const prefix = options.prefix || '';
  const suffix = options.suffix || '';

  if (options.notation === 'compact' || (options.notation !== 'standard' && Math.abs(num) >= 10000)) {
    const formatted = new Intl.NumberFormat('fr-FR', {
      notation: 'compact',
      maximumFractionDigits: options.maximumFractionDigits ?? 1
    }).format(num);
    return `${prefix}${formatted}${suffix}`;
  }

  const maxDigits = options.maximumFractionDigits ?? (num % 1 === 0 ? 0 : (Math.abs(num) < 10 ? 1 : 0));
  const formatted = new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: maxDigits
  }).format(num);

  return `${prefix}${formatted}${suffix}`;
}

/**
 * Computes high-contrast text color (black or white) based on background color luminance (WCAG 2.1 AA/AAA).
 *
 * @param {string} backgroundColor - CSS hex/rgb/rgba color
 * @param {string} [lightText='#FFFFFF'] - High contrast light color
 * @param {string} [darkText='#0F172A'] - High contrast dark color
 * @returns {string} Contrasting color string
 */
function getContrastingTextColor(backgroundColor, lightText = '#FFFFFF', darkText = '#0F172A') {
  if (!backgroundColor || typeof backgroundColor !== 'string') return darkText;
  let color = backgroundColor.trim();

  // Parse rgba / rgb
  if (color.startsWith('rgb')) {
    const matches = color.match(/[\d.]+/g);
    if (matches && matches.length >= 3) {
      const r = Number(matches[0]);
      const g = Number(matches[1]);
      const b = Number(matches[2]);
      const a = matches.length >= 4 ? Number(matches[3]) : 1;
      if (a < 0.35) return darkText;
      const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return lum > 0.58 ? darkText : lightText;
    }
  }

  // Parse Hex
  let hex = color.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  if (hex.length >= 6) {
    const r = parseInt(hex.substring(0, 2), 16) || 0;
    const g = parseInt(hex.substring(2, 4), 16) || 0;
    const b = parseInt(hex.substring(4, 6), 16) || 0;
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return lum > 0.58 ? darkText : lightText;
  }

  return darkText;
}

/**
 * Returns standardized, theme-calibrated configuration for data labels (direct value annotations).
 *
 * @param {Object|string} [themeTokens] - Theme tokens object or name
 * @param {Object} [options={}] - Custom overrides
 * @returns {Object} Data labels options object
 */
function getDataLabelOptions(themeTokens, options = {}) {
  const t = (typeof themeTokens === 'string' ? getThemeTokens(themeTokens) : themeTokens) || getThemeTokens(DEFAULT_THEME);
  const isDark = Boolean(t.isDark);

  return {
    display: options.display !== false,
    color: options.color || t.textPrimary || (isDark ? '#ECEFF4' : '#0F172A'),
    font: {
      family: options.fontFamily || t.fontMono || t.fontFamily || "'JetBrains Mono', monospace",
      size: options.fontSize || 10,
      weight: options.fontWeight || '600'
    },
    padding: options.padding ?? 4,
    thresholdRatio: options.thresholdRatio ?? 0.05,
    formatter: options.formatter || ((v, ctx) => {
      if (options.minPercent && ctx && ctx.dataset && Array.isArray(ctx.dataset.data)) {
        const total = ctx.dataset.data.reduce((a, b) => a + (Number(b) || 0), 0);
        if (total > 0 && ((Number(v) || 0) / total) * 100 < options.minPercent) {
          return '';
        }
      }
      return formatLabelValue(v, options);
    }),
    ...options
  };
}

/**
 * Universal Native Chart.js Plugin for Direct Data Labels (Zero external dependency).
 * Implements cognitive heuristics: subitizing, selective thresholding, contrast luminance, and collision avoidance.
 */
const kitChartsDataLabelsPlugin = {
  id: 'kitChartsDataLabels',
  afterDatasetsDraw(chart, args, pluginOptions) {
    const opts = chart.options?.plugins?.datalabels || chart.config?.options?.plugins?.datalabels || pluginOptions;
    // Strict opt-in: Only draw if plugins.datalabels is explicitly configured and display is true
    if (!opts || opts.display !== true || chart.options?.showDataLabels === false || chart.config?.options?.showDataLabels === false) {
      return;
    }

    const { ctx, chartArea } = chart;
    if (!ctx || !chartArea) return;

    const chartType = chart.config?.type;
    const isHorizontal = chart.options?.indexAxis === 'y';
    const isStacked = Boolean(
      (chart.options?.scales?.x?.stacked && chart.options?.scales?.y?.stacked) ||
      (isHorizontal ? chart.options?.scales?.x?.stacked : chart.options?.scales?.y?.stacked)
    );

    const tokens = chart.options?._kitChartsTokens || (chart.options?.themeName ? getThemeTokens(chart.options.themeName) : (chart.config?.options?.themeName ? getThemeTokens(chart.config.options.themeName) : getThemeTokens(DEFAULT_THEME)));
    const isDark = Boolean(tokens.isDark);
    const fontObj = opts.font || {};
    const fontFamily = fontObj.family || tokens.fontMono || tokens.fontFamily || 'monospace';
    const fontSize = fontObj.size || 10;
    const fontWeight = fontObj.weight || '600';
    const defaultColor = opts.color || tokens.textPrimary || (isDark ? '#ECEFF4' : '#0F172A');
    const thresholdRatio = opts.thresholdRatio ?? (opts.minPercent ? opts.minPercent / 100 : 0.05);

    ctx.save();
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 1. Bar Charts (Vertical / Horizontal / Stacked / Grouped / Waterfall / Bullet)
    if (chartType === 'bar') {
      const isBullet = chart.data.datasets.some(ds => ds.label && (/objectif|cible|target|benchmark|palier|seuil|range|band|alerte|critique/i).test(ds.label));

      chart.data.datasets.forEach((dataset, datasetIndex) => {
        const meta = chart.getDatasetMeta(datasetIndex);
        if (!meta || meta.hidden || meta.type !== 'bar') return;

        // Skip background bands, qualitative ranges, targets, and secondary layers
        if (dataset.datalabels === false || dataset.displayDataLabels === false || (dataset.datalabels && dataset.datalabels.display === false)) return;
        if (isBullet && (dataset.order > 1 || datasetIndex > 0 || (/palier|seuil|band|range|alerte|critique|cible|target|objectif|benchmark/i).test(dataset.label || ''))) return;
        if (dataset.grouped === false && datasetIndex > 0 && !isStacked) return;

        let totalsPerIndex = [];
        if (isStacked) {
          const count = dataset.data ? dataset.data.length : 0;
          for (let i = 0; i < count; i++) {
            let sum = 0;
            chart.data.datasets.forEach(ds => {
              const v = Array.isArray(ds.data) ? ds.data[i] : 0;
              sum += typeof v === 'number' ? Math.abs(v) : (Array.isArray(v) ? Math.abs(v[1] - v[0]) : 0);
            });
            totalsPerIndex[i] = sum || 1;
          }
        }

        meta.data.forEach((element, index) => {
          if (!element) return;
          const rawVal = dataset.data[index];
          if (rawVal === null || rawVal === undefined) return;

          let val = 0;
          let isFloating = false;
          if (Array.isArray(rawVal)) {
            // Waterfall floating bar [start, end]
            val = rawVal[1] - rawVal[0];
            if (rawVal[0] === 0) val = rawVal[1];
            isFloating = true;
          } else if (typeof rawVal === 'object' && rawVal !== null) {
            val = rawVal.y ?? rawVal.x ?? rawVal.v ?? rawVal.value ?? 0;
          } else {
            val = Number(rawVal);
          }

          if (isNaN(val)) return;
          if (val === 0 && isStacked) return;

          let labelText = '';
          try {
            if (typeof opts.formatter === 'function') {
              labelText = String(opts.formatter(val, { dataset, datasetIndex, index, dataIndex: index, chart, rawVal }) ?? '');
            } else {
              labelText = formatLabelValue(val, opts);
            }
          } catch (e) {
            labelText = formatLabelValue(val, opts);
          }
          if (!labelText) return;

          const textWidth = ctx.measureText(labelText).width;
          const textHeight = fontSize;

          const elProps = element.getProps ? element.getProps(['x', 'y', 'base', 'horizontal', 'width', 'height'], true) : element;
          const barColor = Array.isArray(dataset.backgroundColor)
            ? dataset.backgroundColor[index]
            : dataset.backgroundColor;

          if (isHorizontal) {
            const barLeft = Math.min(elProps.base || 0, elProps.x);
            const barRight = Math.max(elProps.base || 0, elProps.x);
            const barWidth = barRight - barLeft;

            if (isStacked) {
              const ratio = totalsPerIndex[index] ? Math.abs(val) / totalsPerIndex[index] : 1;
              if (ratio < thresholdRatio || barWidth < textWidth + 8) return;

              const cx = (barLeft + barRight) / 2;
              const cy = elProps.y;
              ctx.fillStyle = getContrastingTextColor(barColor);
              ctx.textAlign = 'center';
              ctx.fillText(labelText, cx, cy);
            } else {
              ctx.fillStyle = defaultColor;
              ctx.textAlign = 'left';
              ctx.textBaseline = 'middle';
              ctx.fillText(labelText, barRight + 8, elProps.y);
            }
          } else {
            const barTop = Math.min(elProps.base || 0, elProps.y);
            const barBottom = Math.max(elProps.base || 0, elProps.y);
            const barHeight = barBottom - barTop;
            const barWidth = elProps.width || 16;

            if (isStacked) {
              const ratio = totalsPerIndex[index] ? Math.abs(val) / totalsPerIndex[index] : 1;
              if (ratio < thresholdRatio || barHeight < textHeight + 6 || barWidth < textWidth + 4) return;

              const cx = elProps.x;
              const cy = (barTop + barBottom) / 2;
              ctx.fillStyle = getContrastingTextColor(barColor);
              ctx.textAlign = 'center';
              ctx.fillText(labelText, cx, cy);
            } else {
              // Grouped or Single vertical bar
              if (barWidth < textWidth + 2 && chart.data.datasets.length > 2) return;

              const spaceOnTop = barTop - chartArea.top;
              if (spaceOnTop >= textHeight + 6) {
                ctx.fillStyle = defaultColor;
                ctx.textAlign = 'center';
                ctx.fillText(labelText, elProps.x, barTop - 6);
              } else if (barHeight >= textHeight + 10) {
                ctx.fillStyle = getContrastingTextColor(barColor);
                ctx.textAlign = 'center';
                ctx.fillText(labelText, elProps.x, barTop + 10);
              } else {
                ctx.fillStyle = defaultColor;
                ctx.textAlign = 'center';
                ctx.fillText(labelText, elProps.x, Math.max(chartArea.top + 8, barTop - 4));
              }
            }
          }
        });
      });
    }

    // 2. Pie & Doughnut Charts
    else if (chartType === 'pie' || chartType === 'doughnut') {
      chart.data.datasets.forEach((dataset, datasetIndex) => {
        const meta = chart.getDatasetMeta(datasetIndex);
        if (!meta || meta.hidden) return;

        let total = 0;
        (dataset.data || []).forEach(v => {
          const num = typeof v === 'number' ? v : (v && typeof v === 'object' ? Number(v.value ?? v.v ?? 0) : Number(v) || 0);
          total += Math.abs(num);
        });
        if (total === 0) total = 1;

        (meta.data || []).forEach((arc, index) => {
          if (!arc) return;
          const rawVal = dataset.data[index];
          if (rawVal === null || rawVal === undefined) return;
          const val = typeof rawVal === 'number' ? rawVal : (rawVal && typeof rawVal === 'object' ? Number(rawVal.value ?? rawVal.v ?? 0) : Number(rawVal) || 0);
          const ratio = Math.abs(val) / total;

          // Strict collision prevention: skip small slices < 5%
          if (ratio < thresholdRatio) return;

          const arcProps = arc.getProps ? arc.getProps(['startAngle', 'endAngle', 'innerRadius', 'outerRadius', 'x', 'y'], true) : arc;
          const angle = (arcProps.startAngle + arcProps.endAngle) / 2;
          const arcSpan = Math.abs(arcProps.endAngle - arcProps.startAngle);
          const radius = arcProps.innerRadius > 0
            ? (arcProps.innerRadius + arcProps.outerRadius) / 2
            : arcProps.outerRadius * 0.65;

          // Skip if arc length is too small for text
          const arcLength = radius * arcSpan;
          const percentText = `${Math.round(ratio * 100)}%`;
          let labelText = '';
          try {
            if (typeof opts.formatter === 'function') {
              labelText = String(opts.formatter(val, { dataset, datasetIndex, index, dataIndex: index, chart, ratio, percentText, rawVal }) ?? '');
            } else {
              labelText = percentText;
            }
          } catch (e) {
            labelText = percentText;
          }
          if (!labelText) return;

          const textWidth = ctx.measureText(labelText).width;
          if (arcLength < textWidth + 4) return;

          const cx = arcProps.x + Math.cos(angle) * radius;
          const cy = arcProps.y + Math.sin(angle) * radius;

          const sliceColor = Array.isArray(dataset.backgroundColor)
            ? dataset.backgroundColor[index]
            : dataset.backgroundColor;

          ctx.fillStyle = getContrastingTextColor(sliceColor);
          ctx.textAlign = 'center';
          ctx.fillText(labelText, cx, cy);
        });
      });
    }

    // 3. Polar Area Charts
    else if (chartType === 'polarArea') {
      chart.data.datasets.forEach((dataset, datasetIndex) => {
        const meta = chart.getDatasetMeta(datasetIndex);
        if (!meta || meta.hidden) return;

        (meta.data || []).forEach((arc, index) => {
          if (!arc) return;
          const rawVal = dataset.data[index];
          if (rawVal === null || rawVal === undefined) return;
          const val = typeof rawVal === 'number' ? rawVal : (rawVal && typeof rawVal === 'object' ? Number(rawVal.value ?? rawVal.v ?? 0) : Number(rawVal) || 0);

          const arcProps = arc.getProps ? arc.getProps(['startAngle', 'endAngle', 'outerRadius', 'x', 'y'], true) : arc;
          const angle = (arcProps.startAngle + arcProps.endAngle) / 2;
          const radius = (arcProps.outerRadius || 50) * 0.62;

          if (radius < 20) return;

          let labelText = '';
          try {
            if (typeof opts.formatter === 'function') {
              labelText = String(opts.formatter(val, { dataset, datasetIndex, index, dataIndex: index, chart, rawVal }) ?? '');
            } else {
              labelText = formatLabelValue(val, opts);
            }
          } catch (e) {
            labelText = formatLabelValue(val, opts);
          }
          if (!labelText) return;

          const textWidth = ctx.measureText(labelText).width;
          const arcSpan = Math.abs(arcProps.endAngle - arcProps.startAngle);
          if (radius * arcSpan < textWidth + 4) return;

          const cx = arcProps.x + Math.cos(angle) * radius;
          const cy = arcProps.y + Math.sin(angle) * radius;

          const sliceColor = Array.isArray(dataset.backgroundColor)
            ? dataset.backgroundColor[index]
            : dataset.backgroundColor;

          ctx.fillStyle = getContrastingTextColor(sliceColor);
          ctx.textAlign = 'center';
          ctx.fillText(labelText, cx, cy);
        });
      });
    }

    // 4. Radar Charts
    else if (chartType === 'radar') {
      chart.data.datasets.forEach((dataset, datasetIndex) => {
        const meta = chart.getDatasetMeta(datasetIndex);
        if (!meta || meta.hidden) return;
        if (dataset.datalabels === false || dataset.displayDataLabels === false || (dataset.datalabels && dataset.datalabels.display === false)) return;
        if (datasetIndex >= 2) return;

        const seriesColor = dataset.borderColor || (dataset.backgroundColor && !dataset.backgroundColor.startsWith('rgba') ? dataset.backgroundColor : (tokens.palette[datasetIndex] || defaultColor));

        (meta.data || []).forEach((point, index) => {
          if (!point) return;
          const rawVal = dataset.data[index];
          if (rawVal === null || rawVal === undefined) return;
          const val = typeof rawVal === 'number' ? rawVal : (rawVal && typeof rawVal === 'object' ? Number(rawVal.value ?? rawVal.v ?? 0) : Number(rawVal) || 0);

          let labelText = '';
          try {
            if (typeof opts.formatter === 'function') {
              labelText = String(opts.formatter(val, { dataset, datasetIndex, index, dataIndex: index, chart, rawVal }) ?? '');
            } else {
              labelText = formatLabelValue(val, opts);
            }
          } catch (e) {
            labelText = formatLabelValue(val, opts);
          }
          if (!labelText) return;

          const pointProps = point.getProps ? point.getProps(['x', 'y'], true) : point;
          const textWidth = ctx.measureText(labelText).width;
          const badgeWidth = textWidth + 8;
          const badgeHeight = fontSize + 4;

          const isSecondSeries = datasetIndex > 0;
          const badgeY = isSecondSeries ? (pointProps.y + 12) : (pointProps.y - 12);
          const badgeX = pointProps.x;

          ctx.save();
          ctx.fillStyle = tokens.surface || (tokens.isDark ? '#242933' : '#F8FAFC');
          ctx.strokeStyle = seriesColor;
          ctx.lineWidth = 1;
          ctx.beginPath();
          const bx = badgeX - badgeWidth / 2;
          const by = badgeY - badgeHeight / 2;
          ctx.rect(bx, by, badgeWidth, badgeHeight);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = seriesColor;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(labelText, badgeX, badgeY);
          ctx.restore();
        });
      });
    }

    // 5. Line & Slope Charts
    else if (chartType === 'line') {
      const isSlope = chart.data.datasets.length > 0 && ((chart.data.labels && chart.data.labels.length === 2) || opts.slopeMode);

      if (isSlope) {
        const colLabels = { 0: [], 1: [] };
        chart.data.datasets.forEach((dataset, datasetIndex) => {
          const meta = chart.getDatasetMeta(datasetIndex);
          if (!meta || meta.hidden) return;
          if (dataset.datalabels === false || dataset.displayDataLabels === false || (dataset.datalabels && dataset.datalabels.display === false)) return;
          const pts = meta.data || [];
          const seriesColor = dataset.borderColor || (tokens.palette[datasetIndex] || defaultColor);

          [0, 1].forEach(col => {
            const point = pts[col];
            if (!point) return;
            const rawVal = dataset.data[col];
            if (rawVal === null || rawVal === undefined) return;
            const val = typeof rawVal === 'number' ? rawVal : (rawVal && typeof rawVal === 'object' ? Number(rawVal.value ?? rawVal.y ?? 0) : Number(rawVal) || 0);

            let labelText = '';
            try {
              if (typeof opts.formatter === 'function') {
                labelText = String(opts.formatter(val, { dataset, datasetIndex, index: col, dataIndex: col, chart, rawVal }) ?? '');
              } else {
                labelText = formatLabelValue(val, opts);
              }
            } catch (e) {
              labelText = formatLabelValue(val, opts);
            }
            if (!labelText) return;

            const pointProps = point.getProps ? point.getProps(['x', 'y'], true) : point;
            colLabels[col].push({
              x: pointProps.x,
              y: pointProps.y,
              text: labelText,
              color: seriesColor
            });
          });
        });

        [0, 1].forEach(col => {
          const items = colLabels[col];
          items.sort((a, b) => a.y - b.y);
          const minGap = 14;
          for (let p = 0; p < 4; p++) {
            for (let i = 0; i < items.length - 1; i++) {
              const diff = items[i + 1].y - items[i].y;
              if (diff < minGap) {
                const shift = (minGap - diff) / 2;
                items[i].y -= shift;
                items[i + 1].y += shift;
              }
            }
          }

          items.forEach(item => {
            ctx.fillStyle = item.color;
            if (col === 0) {
              ctx.textAlign = 'right';
              ctx.fillText(item.text, item.x - 8, item.y + 3);
            } else {
              ctx.textAlign = 'left';
              ctx.fillText(item.text, item.x + 8, item.y + 3);
            }
          });
        });
      } else {
        chart.data.datasets.forEach((dataset, datasetIndex) => {
          const meta = chart.getDatasetMeta(datasetIndex);
          if (!meta || meta.hidden) return;
          if (dataset.datalabels === false || dataset.displayDataLabels === false || (dataset.datalabels && dataset.datalabels.display === false)) return;
          const pts = meta.data || [];
          const seriesColor = dataset.borderColor || (tokens.palette[datasetIndex] || defaultColor);

          pts.forEach((point, index) => {
            if (!point) return;
            const rawVal = dataset.data[index];
            if (rawVal === null || rawVal === undefined) return;
            const val = typeof rawVal === 'number' ? rawVal : (rawVal && typeof rawVal === 'object' ? Number(rawVal.value ?? rawVal.y ?? 0) : Number(rawVal) || 0);

            if (opts.showAllPoints || index === 0 || index === pts.length - 1 || opts.display === true) {
              let labelText = '';
              try {
                if (typeof opts.formatter === 'function') {
                  labelText = String(opts.formatter(val, { dataset, datasetIndex, index, dataIndex: index, chart, rawVal }) ?? '');
                } else {
                  labelText = formatLabelValue(val, opts);
                }
              } catch (e) {
                labelText = formatLabelValue(val, opts);
              }
              if (!labelText) return;

              const pointProps = point.getProps ? point.getProps(['x', 'y'], true) : point;
              const isAlignBottom = dataset.datalabels && dataset.datalabels.align === 'bottom';
              const yOffset = isAlignBottom ? 12 : -8;
              ctx.fillStyle = (dataset.datalabels && dataset.datalabels.color) || seriesColor;
              ctx.textAlign = 'center';
              ctx.fillText(labelText, pointProps.x, pointProps.y + yOffset);
            }
          });
        });
      }
    }

    ctx.restore();
  }
};

if (typeof Chart !== 'undefined' && Chart.register) {
  try {
    Chart.register(kitChartsDataLabelsPlugin);
  } catch (e) {}
}

// Statistical helpers integration
let statHelpers = null;
try {
  if (typeof require === 'function') {
    statHelpers = require('./stat-helpers.js');
  } else if (typeof window !== 'undefined' && window.KitChartsStatHelpers) {
    statHelpers = window.KitChartsStatHelpers;
  }
} catch (e) {}


const mean = (statHelpers && statHelpers.mean) || function(d) {
  if (!Array.isArray(d) || d.length === 0) return 0;
  const clean = d.map(Number).filter(v => !isNaN(v));
  return clean.length ? clean.reduce((a, b) => a + b, 0) / clean.length : 0;
};
const variance = (statHelpers && statHelpers.variance) || function(d) {
  if (!Array.isArray(d) || d.length < 2) return 0;
  const clean = d.map(Number).filter(v => !isNaN(v));
  if (clean.length < 2) return 0;
  const m = mean(clean);
  return clean.reduce((sum, v) => sum + Math.pow(v - m, 2), 0) / (clean.length - 1);
};
const stddev = (statHelpers && statHelpers.stddev) || function(d) { return Math.sqrt(variance(d)); };
const sd = stddev;
const sem = (statHelpers && statHelpers.sem) || function(d) {
  const clean = Array.isArray(d) ? d.map(Number).filter(v => !isNaN(v)) : [];
  return clean.length >= 2 ? stddev(clean) / Math.sqrt(clean.length) : 0;
};
const se = sem;
const quantile = (statHelpers && statHelpers.quantile) || function(d, p) {
  if (!Array.isArray(d) || d.length === 0) return 0;
  const clean = d.map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b);
  if (clean.length === 0) return 0;
  if (p <= 0) return clean[0];
  if (p >= 1) return clean[clean.length - 1];
  const h = (clean.length - 1) * p;
  const floor = Math.floor(h);
  const ceil = Math.ceil(h);
  if (floor === ceil) return clean[floor];
  return clean[floor] + (h - floor) * (clean[ceil] - clean[floor]);
};
const studentT = (statHelpers && statHelpers.studentT) || function(p, df) { return 1.96; };
const ci95 = (statHelpers && statHelpers.ci95) || function(d, conf = 0.95) {
  let m = 0, s = 0, n = 0;
  if (Array.isArray(d)) {
    const clean = d.map(Number).filter(v => !isNaN(v));
    n = clean.length;
    m = mean(clean);
    s = n >= 2 ? stddev(clean) : 0;
  } else if (typeof d === 'object' && d !== null) {
    m = Number(d.mean || d.value || 0);
    s = Number(d.sd || d.stddev || 0);
    n = Number(d.n || 30);
  }
  const sErr = n >= 2 ? s / Math.sqrt(n) : 0;
  const tVal = n >= 30 ? 1.96 : (studentT ? studentT((1 + conf) / 2, Math.max(1, n - 1)) : 1.96);
  const margin = tVal * sErr;
  return { mean: m, low: m - margin, high: m + margin, se: sErr, sd: s, n, margin, confidence: conf };
};
const checkCIOverlap = (statHelpers && statHelpers.checkCIOverlap) || function(ci1, ci2) {
  if (!ci1 || !ci2) return { overlap: 0, overlapRatio: 0, isSignificant: true, isOverlapping: false, recommendedValence: 'directional' };
  const moe1 = Math.abs(ci1.high - ci1.low) / 2;
  const moe2 = Math.abs(ci2.high - ci2.low) / 2;
  const avgMOE = (moe1 + moe2) / 2;
  const overlap = Math.max(0, Math.min(ci1.high, ci2.high) - Math.max(ci1.low, ci2.low));
  const overlapRatio = avgMOE > 0 ? overlap / avgMOE : 0;
  const isOverlapping = overlapRatio >= 0.29;
  return { overlap, overlapRatio, isSignificant: !isOverlapping, isOverlapping, recommendedValence: isOverlapping ? 'neutral' : 'directional' };
};
const errorBarsPlugin = (statHelpers && statHelpers.errorBarsPlugin) || null;

const KitChartsTheme = {
  THEMES,
  THEME_NAMES,
  DEFAULT_THEME,
  normalizeThemeSlug,
  getThemeTokens,
  getTheme: getThemeTokens,
  applyThemeToContainer,
  loadGoogleFonts,
  getChartDefaultOptions,
  getColor,
  getSemanticColor,
  getSequentialColor,
  getValenceColor,
  getEmphasisStyle,
  getThresholdStatus,
  resolveThresholds,
  suggestScale,
  getLogScaleOptions,
  resolveSeriesBudget,
  mean,
  variance,
  stddev,
  sd,
  sem,
  se,
  quantile,
  studentT,
  ci95,
  checkCIOverlap,
  errorBarsPlugin,
  hexToRgba,
  isReducedMotionPreferred,
  getAnimationDuration,
  getAccessibleAnimationOptions,
  getSpatialInteractionOptions,
  getTemporalInteractionOptions,
  getPartitionInteractionOptions,
  getExecutiveModeOptions,
  computeAntiOcclusionTooltipPosition,
  formatLabelValue,
  getContrastingTextColor,
  getDataLabelOptions,
  kitChartsDataLabelsPlugin,
  getStaggerDelay,
  animateStagedUpdate,
  kcPulsePlugin,
  attachPulseAlert,
  animateZoomDrilldown,
  computeEventSegmentation,
  createNarrativeScenePlayer,
  animateWithAnticipation,
  createAnimationTicker,
  animatePathDrawing,
  animateCountUp,
  animateFocusContext,
  animateBarChartRace,
  animatePanCamera,
  animateCrossTypeMorph,
  animateAxisRescale,
  animateMotionTrails,
  animateSeriesBuildup,
  initScrollytelling,
  animateCriticalDamping,
  kcDeltaFlashPlugin,
  attachDeltaFlash,
  getStoredTheme,
  setStoredTheme,
  getStoredLabels,
  setStoredLabels
};

// Global browser attachment (Zero CORS on file://)
if (typeof window !== 'undefined') {
  window.KitChartsTokens = KitChartsTheme;
  window.KitChartsTheme = KitChartsTheme;
  window.KitCharts = window.KitCharts || {};
  window.KitCharts.Theme = KitChartsTheme;
  window.KitCharts.animation = window.KitCharts.animation || KitChartsTheme;
  window.getThemeTokens = getThemeTokens;
  window.applyThemeToContainer = applyThemeToContainer;
  window.loadGoogleFonts = loadGoogleFonts;
  window.getChartDefaultOptions = getChartDefaultOptions;
  window.getColor = getColor;
  window.getSemanticColor = getSemanticColor;
  window.getSequentialColor = getSequentialColor;
  window.getValenceColor = getValenceColor;
  window.getEmphasisStyle = getEmphasisStyle;
  window.getThresholdStatus = getThresholdStatus;
  window.resolveThresholds = resolveThresholds;
  window.suggestScale = suggestScale;
  window.getLogScaleOptions = getLogScaleOptions;
  window.resolveSeriesBudget = resolveSeriesBudget;
  window.mean = mean;
  window.variance = variance;
  window.stddev = stddev;
  window.sd = sd;
  window.sem = sem;
  window.se = se;
  window.quantile = quantile;
  window.studentT = studentT;
  window.ci95 = ci95;
  window.checkCIOverlap = checkCIOverlap;
  window.errorBarsPlugin = errorBarsPlugin;
  window.hexToRgba = hexToRgba;
  window.isReducedMotionPreferred = isReducedMotionPreferred;
  window.getAnimationDuration = getAnimationDuration;
  window.getAccessibleAnimationOptions = getAccessibleAnimationOptions;
  window.getSpatialInteractionOptions = getSpatialInteractionOptions;
  window.getTemporalInteractionOptions = getTemporalInteractionOptions;
  window.getPartitionInteractionOptions = getPartitionInteractionOptions;
  window.getExecutiveModeOptions = getExecutiveModeOptions;
  window.computeAntiOcclusionTooltipPosition = computeAntiOcclusionTooltipPosition;
  window.formatLabelValue = formatLabelValue;
  window.getContrastingTextColor = getContrastingTextColor;
  window.getDataLabelOptions = getDataLabelOptions;
  window.kitChartsDataLabelsPlugin = kitChartsDataLabelsPlugin;
  window.getStaggerDelay = getStaggerDelay;
  window.animateStagedUpdate = animateStagedUpdate;
  window.kcPulsePlugin = kcPulsePlugin;
  window.attachPulseAlert = attachPulseAlert;
  window.animateZoomDrilldown = animateZoomDrilldown;
  window.computeEventSegmentation = computeEventSegmentation;
  window.createNarrativeScenePlayer = createNarrativeScenePlayer;
  window.animateWithAnticipation = animateWithAnticipation;
  window.createAnimationTicker = createAnimationTicker;
  window.animatePathDrawing = animatePathDrawing;
  window.animateCountUp = animateCountUp;
  window.animateFocusContext = animateFocusContext;
  window.animateBarChartRace = animateBarChartRace;
  window.animatePanCamera = animatePanCamera;
  window.animateCrossTypeMorph = animateCrossTypeMorph;
  window.animateAxisRescale = animateAxisRescale;
  window.animateMotionTrails = animateMotionTrails;
  window.animateSeriesBuildup = animateSeriesBuildup;
  window.initScrollytelling = initScrollytelling;
  window.animateCriticalDamping = animateCriticalDamping;
  window.kcDeltaFlashPlugin = kcDeltaFlashPlugin;
  window.attachDeltaFlash = attachDeltaFlash;
  window.getStoredTheme = getStoredTheme;
  window.setStoredTheme = setStoredTheme;
  window.getStoredLabels = getStoredLabels;
  window.setStoredLabels = setStoredLabels;
  window.THEMES = THEMES;
  window.THEME_NAMES = THEME_NAMES;
  window.DEFAULT_THEME = DEFAULT_THEME;
  window.normalizeThemeSlug = normalizeThemeSlug;
}

// CommonJS Exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KitChartsTheme;
  module.exports.default = KitChartsTheme;
  module.exports.THEMES = THEMES;
  module.exports.THEME_NAMES = THEME_NAMES;
  module.exports.DEFAULT_THEME = DEFAULT_THEME;
  module.exports.normalizeThemeSlug = normalizeThemeSlug;
  module.exports.getStoredTheme = getStoredTheme;
  module.exports.setStoredTheme = setStoredTheme;
  module.exports.getStoredLabels = getStoredLabels;
  module.exports.setStoredLabels = setStoredLabels;
  module.exports.getThemeTokens = getThemeTokens;
  module.exports.getTheme = getThemeTokens;
  module.exports.applyThemeToContainer = applyThemeToContainer;
  module.exports.loadGoogleFonts = loadGoogleFonts;
  module.exports.getChartDefaultOptions = getChartDefaultOptions;
  module.exports.getColor = getColor;
  module.exports.getSemanticColor = getSemanticColor;
  module.exports.getSequentialColor = getSequentialColor;
  module.exports.getValenceColor = getValenceColor;
  module.exports.getEmphasisStyle = getEmphasisStyle;
  module.exports.getThresholdStatus = getThresholdStatus;
  module.exports.resolveThresholds = resolveThresholds;
  module.exports.suggestScale = suggestScale;
  module.exports.getLogScaleOptions = getLogScaleOptions;
  module.exports.resolveSeriesBudget = resolveSeriesBudget;
  module.exports.mean = mean;
  module.exports.variance = variance;
  module.exports.stddev = stddev;
  module.exports.sd = sd;
  module.exports.sem = sem;
  module.exports.se = se;
  module.exports.quantile = quantile;
  module.exports.studentT = studentT;
  module.exports.ci95 = ci95;
  module.exports.checkCIOverlap = checkCIOverlap;
  module.exports.errorBarsPlugin = errorBarsPlugin;
  module.exports.hexToRgba = hexToRgba;
  module.exports.isReducedMotionPreferred = isReducedMotionPreferred;
  module.exports.getAnimationDuration = getAnimationDuration;
  module.exports.getAccessibleAnimationOptions = getAccessibleAnimationOptions;
  module.exports.getSpatialInteractionOptions = getSpatialInteractionOptions;
  module.exports.getTemporalInteractionOptions = getTemporalInteractionOptions;
  module.exports.getPartitionInteractionOptions = getPartitionInteractionOptions;
  module.exports.getExecutiveModeOptions = getExecutiveModeOptions;
  module.exports.computeAntiOcclusionTooltipPosition = computeAntiOcclusionTooltipPosition;
  module.exports.formatLabelValue = formatLabelValue;
  module.exports.getContrastingTextColor = getContrastingTextColor;
  module.exports.getDataLabelOptions = getDataLabelOptions;
  module.exports.kitChartsDataLabelsPlugin = kitChartsDataLabelsPlugin;
  module.exports.getStaggerDelay = getStaggerDelay;
  module.exports.animateStagedUpdate = animateStagedUpdate;
  module.exports.kcPulsePlugin = kcPulsePlugin;
  module.exports.attachPulseAlert = attachPulseAlert;
  module.exports.animateZoomDrilldown = animateZoomDrilldown;
  module.exports.computeEventSegmentation = computeEventSegmentation;
  module.exports.createNarrativeScenePlayer = createNarrativeScenePlayer;
  module.exports.animateWithAnticipation = animateWithAnticipation;
  module.exports.createAnimationTicker = createAnimationTicker;
  module.exports.animatePathDrawing = animatePathDrawing;
  module.exports.animateCountUp = animateCountUp;
  module.exports.animateFocusContext = animateFocusContext;
  module.exports.animateBarChartRace = animateBarChartRace;
  module.exports.animatePanCamera = animatePanCamera;
  module.exports.animateCrossTypeMorph = animateCrossTypeMorph;
  module.exports.animateAxisRescale = animateAxisRescale;
  module.exports.animateMotionTrails = animateMotionTrails;
  module.exports.animateSeriesBuildup = animateSeriesBuildup;
  module.exports.initScrollytelling = initScrollytelling;
  module.exports.animateCriticalDamping = animateCriticalDamping;
  module.exports.kcDeltaFlashPlugin = kcDeltaFlashPlugin;
  module.exports.attachDeltaFlash = attachDeltaFlash;
}




