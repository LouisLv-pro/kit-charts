import fs from 'fs';
import path from 'path';

const ROOT = '/Users/louislaville/Desktop/kit-charts';

function walk(dir) {
  let files = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git') files = files.concat(walk(full));
    } else if (f.endsWith('preview.html')) {
      files.push(full);
    }
  }
  return files;
}

const CSS_INJECTION = `
    .toolbar-theme-label {
      font-size: 0.825rem;
      font-weight: 700;
      color: #0F172A;
      display: flex;
      align-items: center;
      gap: 0.35rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .theme-swatches-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #F1F5F9;
      padding: 0.3rem 0.5rem;
      border-radius: 9999px;
      border: 1px solid #E2E8F0;
    }
    .theme-swatch {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      border: 2px solid transparent;
      cursor: pointer;
      position: relative;
      transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      outline: none;
      padding: 0;
      flex-shrink: 0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    }
    .theme-swatch:hover {
      transform: scale(1.18);
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
    }
    .theme-swatch.active {
      transform: scale(1.22);
      border-color: #FFFFFF;
      box-shadow: 0 0 0 3px #2B8CBE, 0 3px 10px rgba(43, 140, 190, 0.35);
    }
    .active-theme-name-tag {
      font-size: 0.8rem;
      font-weight: 600;
      color: #475569;
      background: #FFFFFF;
      padding: 0.3rem 0.75rem;
      border-radius: 9999px;
      border: 1px solid #E2E8F0;
      white-space: nowrap;
    }
    .btn-label-toggle {
      width: 38px;
      height: 38px;
      border-radius: 9999px;
      border: 1px solid #E2E8F0;
      background: #F1F5F9;
      color: #94A3B8;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      outline: none;
    }
    .btn-label-toggle svg {
      width: 18px;
      height: 18px;
      transition: transform 0.2s ease;
    }
    .btn-label-toggle:hover {
      background: #FFFFFF;
      border-color: #2B8CBE;
      color: #2B8CBE;
      transform: translateY(-1px);
    }
    .btn-label-toggle.active {
      background: #2B8CBE;
      color: #FFFFFF !important;
      border-color: #2B8CBE;
      box-shadow: 0 0 14px rgba(43, 140, 190, 0.4), 0 2px 8px rgba(43, 140, 190, 0.3);
      transform: translateY(-1px);
    }
    .btn-label-toggle.active svg {
      filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.6));
    }
`;

function buildControlsHtml(extraControls = '') {
  return `        <div class="controls-group">
          <div class="toolbar-theme-label"><span>🎨</span> Thème :</div>
          <div class="theme-swatches-group" id="themeSwatchesGroup" role="radiogroup" aria-label="Sélection du thème colorimétrique">
            <button type="button" class="theme-swatch active" data-theme-name="colorbrewer-accessible" style="background: linear-gradient(135deg, #2B8CBE 50%, #E66101 50%);" title="01. ColorBrewer Accessible" aria-label="Thème ColorBrewer Accessible"></button>
            <button type="button" class="theme-swatch" data-theme-name="viridis-perceptual" style="background: linear-gradient(135deg, #3E4A89 50%, #35B779 50%);" title="02. Viridis Perceptual" aria-label="Thème Viridis Perceptual"></button>
            <button type="button" class="theme-swatch" data-theme-name="paul-tol-scientific" style="background: linear-gradient(135deg, #4477AA 50%, #CC6677 50%);" title="03. Paul Tol Scientific" aria-label="Thème Paul Tol Scientific"></button>
            <button type="button" class="theme-swatch" data-theme-name="tableau-stone-categorical" style="background: linear-gradient(135deg, #4E79A7 50%, #F28E2B 50%);" title="04. Tableau Stone Categorical" aria-label="Thème Tableau Stone"></button>
            <button type="button" class="theme-swatch" data-theme-name="okabe-ito-cud" style="background: linear-gradient(135deg, #E69F00 50%, #56B4E9 50%);" title="05. Okabe-Ito CUD" aria-label="Thème Okabe-Ito CUD"></button>
            <button type="button" class="theme-swatch" data-theme-name="tufte-minimalist-executive" style="background: linear-gradient(135deg, #111111 50%, #B22222 50%);" title="06. Tufte Minimalist Executive" aria-label="Thème Tufte Minimalist"></button>
            <button type="button" class="theme-swatch" data-theme-name="nord-cognitive-dark" style="background: linear-gradient(135deg, #2E3440 50%, #88C0D0 50%);" title="07. Nord Cognitive Dark" aria-label="Thème Nord Cognitive Dark"></button>
            <button type="button" class="theme-swatch" data-theme-name="atkinson-hyperlegible" style="background: linear-gradient(135deg, #000000 50%, #005A9C 50%);" title="08. Atkinson Hyperlegible" aria-label="Thème Atkinson Hyperlegible"></button>
          </div>
          <div id="activeThemeIndicator" class="active-theme-name-tag">ColorBrewer Accessible</div>

          <!-- Bouton Dessin de Label en Surbrillance -->
          <button id="dataLabelsToggleBtn" class="btn-label-toggle active" type="button" aria-pressed="true" title="Étiquettes de données (Labels) : Activées" aria-label="Activer ou désactiver les étiquettes de données">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
              <circle cx="7" cy="7" r="1.5" fill="currentColor"></circle>
            </svg>
          </button>${extraControls ? '\n          ' + extraControls.trim() : ''}
        </div>`;
}

const files = walk(path.join(ROOT, 'template'));
console.log(`Processing ${files.length} preview.html files...`);

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // 1. Ensure CSS
  if (!content.includes('theme-swatches-group')) {
    content = content.replace(/<\/style>/, CSS_INJECTION + '\n  </style>');
  }

  // 2. Extract extra controls (easingSelect or modeSelect)
  let extraControls = '';
  const extraMatch = content.match(/(<label for="(easingSelect|modeSelect)"[\s\S]*?<\/select>)/i);
  if (extraMatch) {
    extraControls = extraMatch[1];
  }

  // 3. Replace controls-group in HTML
  content = content.replace(/<div class="controls-group">[\s\S]*?<\/div>\s*(?=<\/div>|\n\s*<!--|\n\s*<div id="chartContainer")/i, buildControlsHtml(extraControls) + '\n');

  fs.writeFileSync(file, content, 'utf8');
}

console.log('HTML and CSS updated in all files.');
