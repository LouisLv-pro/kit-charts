const fs = require('fs');
const path = require('path');

const THEMES_DATA = [
  {
    id: '01-colorbrewer-accessible',
    themeName: 'colorbrewer-accessible',
    title: 'ColorBrewer Accessible',
    badge: '01. ColorBrewer',
    mode: 'Mode Clair',
    isDark: false,
    origin: 'Dr. Cynthia Brewer & Mark Harrower (Penn State University)',
    fontSans: "'Inter', system-ui, -apple-system, sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap',
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
      { hex: '#2B8CBE', name: 'Bleu sarcelle soutenu', role: 'Série 1 / Primaire' },
      { hex: '#E66101', name: 'Orange brûlé', role: 'Série 2 / Accent chaud' },
      { hex: '#5E3C99', name: 'Violet pourpre', role: 'Série 3 / Contraste froid' },
      { hex: '#4DAC26', name: 'Vert feuillage', role: 'Série 4 / Naturel' },
      { hex: '#D01C8B', name: 'Magenta profond', role: 'Série 5 / Saillance' },
      { hex: '#FDB863', name: 'Ambre doré', role: 'Série 6 / Lumineux' },
      { hex: '#B8E186', name: 'Vert anis doux', role: 'Série 7 / Complément' },
      { hex: '#999999', name: 'Gris neutre', role: 'Série 8 / Référence' }
    ],
    sequential: ['#EFF3FF', '#C6DBEF', '#9ECAE1', '#6BAED6', '#3182BD', '#08519C'],
    divergent: { neg: '#CA0020', mid: '#FFFFFF', pos: '#0571B0' },
    status: {
      success: { hex: '#2E7D32', label: 'Succès' },
      warning: { hex: '#EF6C00', label: 'Attention' },
      danger: { hex: '#C62828', label: 'Danger / Alerte' },
      info: { hex: '#1565C0', label: 'Information' },
      neutral: { hex: '#94A3B8', label: 'Neutre' }
    },
    contrastRatio: '16.1:1 (WCAG AAA)',
    cvdCompliance: '100% CVD Safe',
    whenToUse: "Dashboards d'entreprise polyvalents, reportings de gestion, cartographie choroplèthe et visualisations catégorielles multi-séries (jusqu'à 8 catégories) soumises à une stricte obligation d'accessibilité WCAG AAA.",
    whenNotToUse: "Interfaces sombres natives (privilégier 07-nord-cognitive-dark), matrices denses spectrales continues (privilégier 02-viridis-perceptual) ou séries catégorielles dépassant 8 items simultanés."
  },
  {
    id: '02-viridis-perceptual',
    themeName: 'viridis-perceptual',
    title: 'Viridis Perceptual',
    badge: '02. Viridis',
    mode: 'Luminance Monotone',
    isDark: false,
    origin: 'Stéfan van der Walt & Nathaniel Smith (SciPy / Matplotlib 2015)',
    fontSans: "'IBM Plex Sans', system-ui, -apple-system, sans-serif",
    fontMono: "'IBM Plex Mono', monospace",
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap',
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
      { hex: '#3E4A89', name: 'Bleu cobalt', role: 'Intermédiaire froid' },
      { hex: '#26828E', name: 'Émeraude / Turquoise', role: 'Focale centrale' },
      { hex: '#35B779', name: 'Vert prairie', role: 'Luminance moyenne' },
      { hex: '#B4DE2C', name: 'Jaune verdâtre', role: 'Luminance haute' },
      { hex: '#440154', name: 'Violet sombre profond', role: 'Point zéro / basse intensité' },
      { hex: '#FDE725', name: 'Jaune vif solaire', role: 'Point max / haute intensité' },
      { hex: '#31688E', name: 'Sarcelle moyen', role: 'Transition sombre' },
      { hex: '#1F9E89', name: 'Vert jade', role: 'Transition médiane' }
    ],
    sequential: ['#440154', '#482777', '#3E4A89', '#31688E', '#26828E', '#1F9E89', '#35B779', '#6DCD59', '#B4DE2C', '#FDE725'],
    divergent: { neg: '#440154', mid: '#FFFFFF', pos: '#22A884' },
    status: {
      success: { hex: '#22A884', label: 'Succès' },
      warning: { hex: '#D8B400', label: 'Attention' },
      danger: { hex: '#440154', label: 'Danger / Alerte' },
      info: { hex: '#2A788E', label: 'Information' },
      neutral: { hex: '#8E9AAF', label: 'Neutre' }
    },
    contrastRatio: '14.8:1 (WCAG AAA)',
    cvdCompliance: '100% Monotone en Noir & Blanc',
    whenToUse: "Matrices de corrélation (Heatmaps), courbes de densité KDE, surfaces continues 3D, imagerie scientifique, visualisations médicales et impressions monochromes.",
    whenNotToUse: "Données catégorielles nominales pures sans ordre logique (l'échelle monotone suggère une hiérarchie erronée) ou dashboards commerciaux à codes rouge/vert stricts."
  },
  {
    id: '03-paul-tol-scientific',
    themeName: 'paul-tol-scientific',
    title: 'Paul Tol Scientific',
    badge: '03. Paul Tol',
    mode: 'Clarté Scientifique',
    isDark: false,
    origin: 'Dr. Paul Tol (SRON Space Research / Nature Methods)',
    fontSans: "'Fira Sans', system-ui, -apple-system, sans-serif",
    fontMono: "'Fira Code', monospace",
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;500;600;700&family=Fira+Code:wght@400;500;600&display=swap',
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
      { hex: '#4477AA', name: 'Bleu Tol primaire', role: 'Série 1 / Référence' },
      { hex: '#EE6677', name: 'Rouge corail vif', role: 'Série 2 / Opposition' },
      { hex: '#228833', name: 'Vert forêt', role: 'Série 3 / Végétal' },
      { hex: '#CCBB44', name: 'Jaune moutarde', role: 'Série 4 / Intermédiaire' },
      { hex: '#66CCEE', name: 'Cyan ciel', role: 'Série 5 / Fraîcheur' },
      { hex: '#AA3377', name: 'Pourpre magenta', role: 'Série 6 / Séparation' },
      { hex: '#BBBBBB', name: 'Gris neutre', role: 'Série 7 / Contexte' },
      { hex: '#555555', name: 'Gris anthracite', role: 'Série 8 / Base' }
    ],
    sequential: ['#FEFBE9', '#FCF7D5', '#F5EE9E', '#E5D965', '#C9B934', '#A8941C', '#846F11', '#5C4A08', '#332402'],
    divergent: { neg: '#EE6677', mid: '#FFFFFF', pos: '#4477AA' },
    status: {
      success: { hex: '#228833', label: 'Succès' },
      warning: { hex: '#CCBB44', label: 'Attention' },
      danger: { hex: '#EE6677', label: 'Danger / Alerte' },
      info: { hex: '#66CCEE', label: 'Information' },
      neutral: { hex: '#BBBBBB', label: 'Neutre' }
    },
    contrastRatio: '14.5:1 (WCAG AAA)',
    cvdCompliance: '100% CVD Safe (Nature Standard)',
    whenToUse: "Multi-Line Charts denses (3 à 6 courbes fines 1-2px), nuages de points (Scatter plots) multicatégoriels, publications académiques à comité de lecture (Nature, Science) et thèses.",
    whenNotToUse: "Interfaces marketing à teintes flashy/saturées, dashboards sombres sans ajustement de luminance ou grands aplats où les nuances peuvent sembler trop discrètes."
  },
  {
    id: '04-tableau-stone-categorical',
    themeName: 'tableau-stone-categorical',
    title: 'Tableau 10 Stone',
    badge: '04. Tableau 10',
    mode: 'Business Standard',
    isDark: false,
    origin: 'Maureen Stone, Cristy Miller & Jeffrey Heer (IEEE InfoVis)',
    fontSans: "'Roboto', system-ui, -apple-system, sans-serif",
    fontMono: "'Roboto Mono', monospace",
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Roboto+Mono:wght@400;500;700&display=swap',
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
      { hex: '#4E79A7', name: 'Bleu acier Tableau', role: 'Série principale' },
      { hex: '#F28E2B', name: 'Orange vif', role: 'Accent chaud' },
      { hex: '#E15759', name: 'Rouge brique', role: 'Contraste fort' },
      { hex: '#76B7B2', name: 'Sarcelle d\'eau', role: 'Teinte apaisante' },
      { hex: '#59A14F', name: 'Vert prairie', role: 'Croissance positive' },
      { hex: '#EDC948', name: 'Jaune bouton d\'or', role: 'Neutre chaud' },
      { hex: '#B07AA1', name: 'Prune doux', role: 'Nuance intermédiaire' },
      { hex: '#FF9DA7', name: 'Rose pastel saumoné', role: 'Série secondaire' }
    ],
    sequential: ['#D3E0EA', '#A1BED4', '#6F9DBE', '#4E79A7', '#2E5B88'],
    divergent: { neg: '#E15759', mid: '#FFFFFF', pos: '#4E79A7' },
    status: {
      success: { hex: '#59A14F', label: 'Succès' },
      warning: { hex: '#F28E2B', label: 'Attention' },
      danger: { hex: '#E15759', label: 'Danger / Alerte' },
      info: { hex: '#4E79A7', label: 'Information' },
      neutral: { hex: '#BAB0AC', label: 'Neutre' }
    },
    contrastRatio: '14.5:1 (WCAG AAA)',
    cvdCompliance: 'Nommabilité Cognitive Éprouvée',
    whenToUse: "Tableaux de bord de Business Intelligence (BI), reporting commercial/marketing/RH, réunions d'équipe nécessitant une nomination rapide des couleurs et barres groupées.",
    whenNotToUse: "Visualisations spectrales continues, environnements d'observabilité nocturne 24/7 ou protocoles médicaux soumis au standard Okabe-Ito."
  },
  {
    id: '05-okabe-ito-cud',
    themeName: 'okabe-ito-cud',
    title: 'Okabe-Ito CUD',
    badge: '05. Okabe-Ito',
    mode: 'Conformité Universelle',
    isDark: false,
    origin: 'Masataka Okabe & Kei Ito (Color Universal Design Standard)',
    fontSans: "'Source Sans 3', system-ui, -apple-system, sans-serif",
    fontMono: "'Source Code Pro', monospace",
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500;600&display=swap',
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
      { hex: '#0072B2', name: 'Bleu royal', role: 'Ancre de contraste principale' },
      { hex: '#D55E00', name: 'Vermillon', role: 'Remplace avantageusement le rouge' },
      { hex: '#009E73', name: 'Vert bleuté', role: 'Remplace avantageusement le vert' },
      { hex: '#E69F00', name: 'Orange ambré', role: 'Teinte lumineuse distincte' },
      { hex: '#56B4E9', name: 'Bleu ciel', role: 'Nuance claire fraîche' },
      { hex: '#F0E442', name: 'Jaune clair', role: 'Point de surbrillance' },
      { hex: '#CC79A7', name: 'Pourpre rosé', role: 'Discrimination douce' },
      { hex: '#595959', name: 'Gris anthracite', role: 'Ligne de contexte' }
    ],
    sequential: ['#E6F2F8', '#B3DAEE', '#56B4E9', '#0072B2', '#004C77'],
    divergent: { neg: '#D55E00', mid: '#FFFFFF', pos: '#0072B2' },
    status: {
      success: { hex: '#009E73', label: 'Succès' },
      warning: { hex: '#E69F00', label: 'Attention' },
      danger: { hex: '#D55E00', label: 'Danger / Alerte' },
      info: { hex: '#56B4E9', label: 'Information' },
      neutral: { hex: '#999999', label: 'Neutre' }
    },
    contrastRatio: '14.5:1 (WCAG AAA)',
    cvdCompliance: '100% CUD Certified',
    whenToUse: "Publications scientifiques et biomédicales, rapports publics institutionnels sous obligations légales d'accessibilité et présentations devant de larges audiences hétérogènes.",
    whenNotToUse: "Designs graphiques à esthétique monochrome minimaliste, mode sombre sans inversion de polarité, ou séries au-delà de 8 catégories."
  },
  {
    id: '06-tufte-minimalist-executive',
    themeName: 'tufte-minimalist-executive',
    title: 'Tufte Minimalist Executive',
    badge: '06. Tufte Minimalist',
    mode: 'Data-Ink Maximal',
    isDark: false,
    origin: 'Edward Tufte & Stephen Few (Data-Ink Maximization)',
    fontSans: "'Geist', 'Inter', system-ui, -apple-system, sans-serif",
    fontMono: "'Geist Mono', 'JetBrains Mono', monospace",
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap',
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
      { hex: '#1D4ED8', name: 'Bleu cobalt focal', role: 'Accent unique / Pop-out' },
      { hex: '#525252', name: 'Gris ardoise moyen', role: 'Série secondaire' },
      { hex: '#737373', name: 'Gris neutre', role: 'Série de contexte' },
      { hex: '#A3A3A3', name: 'Gris clair', role: 'Barres de fond' },
      { hex: '#D4D4D4', name: 'Gris très clair', role: 'Lignes de référence' },
      { hex: '#E5E5E5', name: 'Gris séparateur', role: 'Grilles légères' },
      { hex: '#171717', name: 'Noir d\'encre', role: 'Titres et métriques hero' },
      { hex: '#B91C1C', name: 'Rouge alerte', role: 'Anomalie / Écart négatif' }
    ],
    sequential: ['#EEEEEE', '#CCCCCC', '#999999', '#555555', '#111111'],
    divergent: { neg: '#B91C1C', mid: '#FFFFFF', pos: '#1D4ED8' },
    status: {
      success: { hex: '#15803D', label: 'Succès' },
      warning: { hex: '#B8860B', label: 'Attention' },
      danger: { hex: '#B91C1C', label: 'Danger / Alerte' },
      info: { hex: '#1D4ED8', label: 'Information' },
      neutral: { hex: '#737373', label: 'Neutre' }
    },
    contrastRatio: '18.5:1 (WCAG AAA)',
    cvdCompliance: 'Zéro risque de confusion',
    whenToUse: "Comités de direction (Comex/Codir), rapports annuels financiers, bilans, mémos d'actionnaires, Bullet Charts, Sparklines, Slopegraphs et Dumbbell charts.",
    whenNotToUse: "Graphiques nécessitant de différencier 4 à 8 catégories par la couleur, ou dashboards marketing grand public dynamiques et festifs."
  },
  {
    id: '07-nord-cognitive-dark',
    themeName: 'nord-cognitive-dark',
    title: 'Nord Cognitive Dark',
    badge: '07. Nord Dark',
    mode: 'Mode Sombre Anti-Fatigue',
    isDark: true,
    origin: 'Nord System & Ergonomie de l\'Asthénopie (Sheedy et al.)',
    fontSans: "'Inter', -apple-system, system-ui, sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap',
    bg: '#2E3440',
    surface: '#3B4252',
    surfaceRaised: '#434C5E',
    border: '#4C566A',
    borderStrong: '#616E85',
    textPrimary: '#ECEFF4',
    textSecondary: '#D8DEE9',
    textMuted: '#9EABC0',
    gridColor: 'rgba(236, 239, 244, 0.08)',
    axisColor: '#4C566A',
    zeroLine: '#88C0D0',
    palette: [
      { hex: '#88C0D0', name: 'Cyan givre éclatant', role: 'Focale principale / Série 1' },
      { hex: '#81A1C1', name: 'Bleu acier polaire', role: 'Série 2' },
      { hex: '#5E81AC', name: 'Bleu nuit profond', role: 'Série 3' },
      { hex: '#A3BE8C', name: 'Vert aurore doux', role: 'Statut Positif / Série 4' },
      { hex: '#EBCB8B', name: 'Ambre aurore', role: 'Statut Alerte / Série 5' },
      { hex: '#D08770', name: 'Orange cuivré', role: 'Série 6' },
      { hex: '#BF616A', name: 'Rouge aurore', role: 'Statut Négatif / Série 7' },
      { hex: '#B48EAD', name: 'Violet boréal', role: 'Série 8' }
    ],
    sequential: ['#3B4252', '#4C566A', '#5E81AC', '#81A1C1', '#88C0D0', '#ECEFF4'],
    divergent: { neg: '#BF616A', mid: '#4C566A', pos: '#88C0D0' },
    status: {
      success: { hex: '#A3BE8C', label: 'Succès' },
      warning: { hex: '#EBCB8B', label: 'Attention' },
      danger: { hex: '#BF616A', label: 'Danger / Alerte' },
      info: { hex: '#88C0D0', label: 'Information' },
      neutral: { hex: '#D8DEE9', label: 'Neutre' }
    },
    contrastRatio: '11.6:1 (WCAG AAA)',
    cvdCompliance: 'Calibré pour faible luminosité',
    whenToUse: "Centres de supervision réseau (NOC/SOC) 24/7, outils DevOps d'observabilité, plateformes de trading haute fréquence et interfaces utilisées en environnement sombre.",
    whenNotToUse: "Supports destinés à l'impression papier, environnements en plein soleil ou rapports administratifs classiques au format PDF."
  },
  {
    id: '08-atkinson-hyperlegible',
    themeName: 'atkinson-hyperlegible',
    title: 'Atkinson Hyperlegible',
    badge: '08. Atkinson',
    mode: 'Haute Lisibilité / Basse Vision',
    isDark: false,
    origin: 'Braille Institute of America & Applied Design Works',
    fontSans: "'Atkinson Hyperlegible', system-ui, -apple-system, sans-serif",
    fontMono: "'Fira Code', 'JetBrains Mono', monospace",
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=Fira+Code:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap',
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
      { hex: '#005AB5', name: 'Bleu cobalt foncé', role: 'Contraste max / Série 1' },
      { hex: '#DC3220', name: 'Vermillon éclatant', role: 'Opposition forte / Série 2' },
      { hex: '#009E73', name: 'Vert émeraude sombre', role: 'Série 3' },
      { hex: '#FE6100', name: 'Orange brûlé', role: 'Série 4' },
      { hex: '#785EF0', name: 'Violet ultra-contrasté', role: 'Série 5' },
      { hex: '#FFB000', name: 'Ambre haute luminance', role: 'Série 6' },
      { hex: '#3F3F46', name: 'Gris ardoise sombre', role: 'Série 7' },
      { hex: '#64748B', name: 'Gris acier', role: 'Série 8' }
    ],
    sequential: ['#E6F0FA', '#BDD7F1', '#6BA3DC', '#005AB5', '#003B75'],
    divergent: { neg: '#DC3220', mid: '#FFFFFF', pos: '#005AB5' },
    status: {
      success: { hex: '#009E73', label: 'Succès' },
      warning: { hex: '#FE6100', label: 'Attention' },
      danger: { hex: '#DC3220', label: 'Danger / Alerte' },
      info: { hex: '#005AB5', label: 'Information' },
      neutral: { hex: '#71717A', label: 'Neutre' }
    },
    contrastRatio: '21.0:1 (WCAG AAA Total)',
    cvdCompliance: 'Testé & Validé Braille Institute',
    whenToUse: "Applications de santé, hôpitaux, urgences, portails d'accessibilité publique (RGAA / WCAG AAA), interfaces seniors et bornes interactives accessibles.",
    whenNotToUse: "Interfaces de luxe à typographie fine/sérif décorative, graphiques à densité spatiale extrême ou palettes pastel très douces."
  }
];

function generatePreviewHtml(theme) {
  const isDark = theme.isDark;
  const themeBg = theme.bg;
  const themeSurface = theme.surface;
  const themeSurfaceRaised = theme.surfaceRaised;
  const themeBorder = theme.border;
  const themeTextPrimary = theme.textPrimary;
  const themeTextSecondary = theme.textSecondary;
  const themeTextMuted = theme.textMuted;
  const accentColor = theme.palette[0].hex;

  // Swatches
  const categoricalSwatchesHtml = theme.palette.map(p => `
    <div class="swatch-card" onclick="copyColor('${p.hex}')" title="Cliquer pour copier ${p.hex}">
      <div class="swatch-color" style="background-color: ${p.hex};"></div>
      <div class="swatch-info">
        <span class="swatch-name">${p.name}</span>
        <span class="swatch-hex">${p.hex}</span>
        <span class="swatch-role">${p.role}</span>
      </div>
    </div>
  `).join('');

  // Gradients
  const seqGradient = `linear-gradient(90deg, ${theme.sequential.join(', ')})`;
  const seqChips = theme.sequential.map(hex => `
    <div class="seq-chip" style="background: ${hex};" onclick="copyColor('${hex}')" title="Copier ${hex}">
      <span>${hex}</span>
    </div>
  `).join('');
  const divGradient = `linear-gradient(90deg, ${theme.divergent.neg} 0%, ${theme.divergent.mid} 50%, ${theme.divergent.pos} 100%)`;

  // Status
  const statusSwatches = Object.entries(theme.status).map(([k, v]) => `
    <div class="status-badge-item" onclick="copyColor('${v.hex}')" title="Copier ${v.hex}">
      <span class="status-dot" style="background: ${v.hex};"></span>
      <span class="status-lbl"><strong>${v.label}</strong> : ${v.hex}</span>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="fr" data-theme="${theme.themeName}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${theme.title} — kit-charts</title>
  <!-- Google Fonts pour ce thème et tous les thèmes -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${theme.googleFontsUrl}" rel="stylesheet">
  <!-- Chart.js v4.4.7 CDN -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js"></script>
  <!-- Theme Tokens & Stat Engine -->
  <script src="../theme-tokens.js"></script>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: ${theme.fontSans};
      background-color: ${isDark ? '#242933' : '#F8FAFC'};
      color: ${themeTextPrimary};
      min-height: 100vh;
      padding: 2rem 1.5rem;
      transition: background-color 0.25s ease, color 0.25s ease;
    }

    .wrapper {
      max-width: 1040px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .breadcrumb {
      font-size: 0.8125rem;
      color: #64748B;
      margin-bottom: 0.5rem;
    }

    .breadcrumb a {
      color: ${accentColor};
      text-decoration: none;
      font-weight: 500;
    }

    .breadcrumb a:hover {
      text-decoration: underline;
    }

    .header-panel {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid ${themeBorder};
    }

    .title-group h1 {
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: ${themeTextPrimary};
    }

    .title-group p {
      font-size: 0.875rem;
      color: ${themeTextMuted};
      margin-top: 0.25rem;
    }

    .controls-group {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      flex-wrap: wrap;
    }

    .active-theme-name-tag {
      font-size: 0.8rem;
      font-weight: 600;
      color: ${themeTextSecondary};
      background: ${themeSurface};
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      border: 1px solid ${themeBorder};
      white-space: nowrap;
    }

    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(460px, 1fr));
      gap: 1.25rem;
    }

    .chart-container {
      position: relative;
      width: 100%;
      background-color: ${themeSurface};
      border: 1px solid ${themeBorder};
      border-radius: 12px;
      padding: 1.25rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .chart-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: ${themeTextPrimary};
    }

    .chart-badge {
      font-size: 0.7rem;
      font-family: ${theme.fontMono};
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      background: ${accentColor}18;
      color: ${accentColor};
      border: 1px solid ${accentColor}35;
      font-weight: 600;
    }

    .canvas-wrapper {
      position: relative;
      width: 100%;
      height: 240px;
    }

    .palette-container {
      background-color: ${themeSurface};
      border: 1px solid ${themeBorder};
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .palette-section-title {
      font-size: 0.875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: ${accentColor};
      margin-bottom: 0.5rem;
    }

    .swatches-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
      gap: 0.75rem;
    }

    .swatch-card {
      background: ${themeSurfaceRaised};
      border: 1px solid ${themeBorder};
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      display: flex;
      flex-direction: column;
    }

    .swatch-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      border-color: ${accentColor};
    }

    .swatch-color {
      height: 44px;
      width: 100%;
    }

    .swatch-info {
      padding: 0.6rem 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .swatch-name {
      font-size: 0.8rem;
      font-weight: 700;
      color: ${themeTextPrimary};
    }

    .swatch-hex {
      font-family: ${theme.fontMono};
      font-size: 0.75rem;
      font-weight: 600;
      color: ${accentColor};
    }

    .swatch-role {
      font-size: 0.7rem;
      color: ${themeTextMuted};
    }

    .gradient-bar {
      height: 28px;
      border-radius: 6px;
      border: 1px solid ${themeBorder};
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
    }

    .seq-chips-row {
      display: flex;
      gap: 0.25rem;
      flex-wrap: wrap;
      margin-top: 0.5rem;
    }

    .seq-chip {
      flex: 1;
      min-width: 60px;
      height: 26px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: 1px solid ${themeBorder};
      transition: transform 0.15s ease;
    }

    .seq-chip:hover {
      transform: scale(1.08);
      z-index: 2;
    }

    .seq-chip span {
      font-family: ${theme.fontMono};
      font-size: 0.625rem;
      font-weight: 700;
      color: #000;
      background: rgba(255,255,255,0.85);
      padding: 0.05rem 0.25rem;
      border-radius: 3px;
    }

    .status-badges-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
    }

    .status-badge-item {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.35rem 0.75rem;
      background: ${themeSurfaceRaised};
      border: 1px solid ${themeBorder};
      border-radius: 9999px;
      cursor: pointer;
      font-size: 0.775rem;
      transition: transform 0.15s ease;
    }

    .status-badge-item:hover {
      border-color: ${accentColor};
      transform: translateY(-1px);
    }

    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .cognitive-rules-card {
      background-color: ${themeSurface};
      border: 1px solid ${themeBorder};
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.25rem;
      transition: background-color 0.25s ease, border-color 0.25s ease;
    }

    .rule-item {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .rule-item h3 {
      font-size: 0.8125rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #10B981;
    }

    .rule-item.bad h3 {
      color: #EF4444;
    }

    .rule-item p {
      font-size: 0.875rem;
      line-height: 1.45;
      color: ${themeTextSecondary};
    }

    .toast {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: #0F172A;
      color: #FFFFFF;
      padding: 0.75rem 1.25rem;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 9999;
      pointer-events: none;
    }

    .toast.show {
      transform: translateY(0);
      opacity: 1;
    }

    @media (max-width: 768px) {
      .charts-grid {
        grid-template-columns: 1fr;
      }
      body {
        padding: 1.25rem 1rem;
      }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <!-- Breadcrumb & Header -->
    <div>
      <div class="breadcrumb">
        <a href="../../index.html">← kit-charts</a> / <a href="../../index.html#section-themes">themes</a> / ${theme.id}
      </div>
      <div class="header-panel">
        <div class="title-group">
          <h1>${theme.title}</h1>
          <p>${theme.origin} — ${theme.mode}</p>
        </div>
        <div class="controls-group">
          <div class="active-theme-name-tag">${theme.badge} • ${theme.cvdCompliance}</div>
        </div>
      </div>
    </div>

    <!-- Démonstrateurs Graphiques Live -->
    <div class="charts-grid">
      <!-- 1. Bar Chart -->
      <div class="chart-container">
        <div class="chart-header">
          <span class="chart-title">Comparaison Catégorielle</span>
          <span class="chart-badge">Bar Chart</span>
        </div>
        <div class="canvas-wrapper">
          <canvas id="chartCanvasBar"></canvas>
        </div>
      </div>

      <!-- 2. Line Chart -->
      <div class="chart-container">
        <div class="chart-header">
          <span class="chart-title">Évolution Multi-Séries</span>
          <span class="chart-badge">Spline Line</span>
        </div>
        <div class="canvas-wrapper">
          <canvas id="chartCanvasLine"></canvas>
        </div>
      </div>

      <!-- 3. Doughnut Chart -->
      <div class="chart-container">
        <div class="chart-header">
          <span class="chart-title">Répartition & Composition</span>
          <span class="chart-badge">Doughnut</span>
        </div>
        <div class="canvas-wrapper">
          <canvas id="chartCanvasDonut"></canvas>
        </div>
      </div>

      <!-- 4. Area Chart -->
      <div class="chart-container">
        <div class="chart-header">
          <span class="chart-title">Progression Séquentielle</span>
          <span class="chart-badge">Area Chart</span>
        </div>
        <div class="canvas-wrapper">
          <canvas id="chartCanvasArea"></canvas>
        </div>
      </div>
    </div>

    <!-- Explorateur de Palette & Tokens -->
    <div class="palette-container">
      <div>
        <div class="palette-section-title">Palette Qualitative (8 Teintes)</div>
        <div class="swatches-grid">
          ${categoricalSwatchesHtml}
        </div>
      </div>

      <div>
        <div class="palette-section-title">Palette Séquentielle (Luminance Monotone)</div>
        <div class="gradient-bar" style="background: ${seqGradient};"></div>
        <div class="seq-chips-row">
          ${seqChips}
        </div>
      </div>

      <div>
        <div class="palette-section-title">Palette Divergente</div>
        <div class="gradient-bar" style="background: ${divGradient};"></div>
      </div>

      <div>
        <div class="palette-section-title">Couleurs Sémantiques & Statuts</div>
        <div class="status-badges-row">
          ${statusSwatches}
        </div>
      </div>
    </div>

    <!-- Synthèse des Recommandations & Règles Cognitives -->
    <div id="cognitiveRulesCard" class="cognitive-rules-card">
      <div class="rule-item">
        <h3>✅ Quand l'utiliser</h3>
        <p><strong>Cas d'usage :</strong> ${theme.whenToUse}</p>
      </div>
      <div class="rule-item bad">
        <h3>❌ Quand NE PAS l'utiliser</h3>
        <p><strong>Contre-indications :</strong> ${theme.whenNotToUse}</p>
      </div>
    </div>
  </div>

  <div id="toast" class="toast">Code couleur copié !</div>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const palette = ${JSON.stringify(theme.palette.map(p => p.hex))};
      const isDark = ${isDark};

      Chart.defaults.font.family = "${theme.fontSans.split(',')[0].replace(/'/g, '')}, system-ui, sans-serif";
      Chart.defaults.color = "${themeTextSecondary}";
      Chart.defaults.borderColor = "${theme.gridColor}";

      // 1. Bar Chart
      const cBar = document.getElementById('chartCanvasBar');
      if (cBar) {
        new Chart(cBar, {
          type: 'bar',
          data: {
            labels: ['R&D', 'Ventes', 'Marketing', 'Ops', 'Support', 'Produit', 'Finance', 'RH'],
            datasets: [{
              label: 'Performance',
              data: [142, 128, 98, 86, 74, 62, 54, 42],
              backgroundColor: palette,
              borderRadius: 4,
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false } },
              y: {
                grid: { color: "${theme.gridColor}" },
                ticks: { font: { family: "${theme.fontMono.split(',')[0].replace(/'/g, '')}", size: 11 } }
              }
            }
          }
        });
      }

      // 2. Line Chart
      const cLine = document.getElementById('chartCanvasLine');
      if (cLine) {
        new Chart(cLine, {
          type: 'line',
          data: {
            labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil'],
            datasets: [
              {
                label: 'Série A',
                data: [32, 45, 58, 51, 68, 84, 92],
                borderColor: palette[0],
                backgroundColor: palette[0] + '20',
                fill: false,
                tension: 0.35,
                borderWidth: 2.5,
                pointRadius: 4,
                pointBackgroundColor: palette[0]
              },
              {
                label: 'Série B',
                data: [48, 52, 44, 62, 55, 71, 79],
                borderColor: palette[1],
                backgroundColor: palette[1] + '20',
                fill: false,
                tension: 0.35,
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: palette[1]
              },
              {
                label: 'Série C',
                data: [20, 28, 35, 42, 49, 58, 64],
                borderColor: palette[2],
                backgroundColor: palette[2] + '20',
                fill: false,
                tension: 0.35,
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: palette[2]
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top', labels: { boxWidth: 10, usePointStyle: true } }
            },
            scales: {
              x: { grid: { display: false } },
              y: {
                grid: { color: "${theme.gridColor}" },
                ticks: { font: { family: "${theme.fontMono.split(',')[0].replace(/'/g, '')}", size: 11 } }
              }
            }
          }
        });
      }

      // 3. Doughnut Chart
      const cDonut = document.getElementById('chartCanvasDonut');
      if (cDonut) {
        new Chart(cDonut, {
          type: 'doughnut',
          data: {
            labels: ['Direct', 'Organique', 'Payant', 'Social', 'Affiliation'],
            datasets: [{
              data: [38, 27, 18, 11, 6],
              backgroundColor: [palette[0], palette[1], palette[2], palette[3], palette[4]],
              borderWidth: 2,
              borderColor: "${themeSurface}"
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
              legend: { position: 'right', labels: { boxWidth: 10, usePointStyle: true } }
            }
          }
        });
      }

      // 4. Area Chart
      const cArea = document.getElementById('chartCanvasArea');
      if (cArea) {
        const gradient = cArea.getContext('2d').createLinearGradient(0, 0, 0, 240);
        gradient.addColorStop(0, palette[0] + '55');
        gradient.addColorStop(1, palette[0] + '00');

        new Chart(cArea, {
          type: 'line',
          data: {
            labels: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'],
            datasets: [{
              label: 'Progression',
              data: [24, 38, 42, 59, 68, 74, 88, 96],
              borderColor: palette[0],
              backgroundColor: gradient,
              fill: true,
              tension: 0.35,
              borderWidth: 2.5,
              pointRadius: 3
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false } },
              y: {
                grid: { color: "${theme.gridColor}" },
                ticks: { font: { family: "${theme.fontMono.split(',')[0].replace(/'/g, '')}", size: 11 } }
              }
            }
          }
        });
      }
    });

    function showToast(msg) {
      const toast = document.getElementById('toast');
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => { toast.classList.remove('show'); }, 2000);
    }

    function copyColor(hex) {
      navigator.clipboard.writeText(hex).then(() => {
        showToast('Couleur ' + hex + ' copiée !');
      }).catch(() => {
        showToast('Code: ' + hex);
      });
    }
  </script>
</body>
</html>`;
}

THEMES_DATA.forEach(theme => {
  const targetDir = path.join(__dirname, '..', 'themes', theme.id);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  const filePath = path.join(targetDir, 'preview.html');
  const htmlContent = generatePreviewHtml(theme);
  fs.writeFileSync(filePath, htmlContent, 'utf8');
  console.log('✓ Generated:', filePath);
});
