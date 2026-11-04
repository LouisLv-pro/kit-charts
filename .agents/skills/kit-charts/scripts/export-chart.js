/**
 * @file .agents/skills/kit-charts/scripts/export-chart.js
 * @description Export d'une page compilée en PNG, SVG ou PDF, dans Chrome headless piloté par
 * le protocole DevTools (WebSocket natif de Node, zéro dépendance npm).
 *
 *   PNG : capture de la page entière, densité 2 par défaut (--scale).
 *   PDF : une page aux dimensions exactes du contenu ; textes HTML vectoriels, graphiques
 *         Chart.js en image haute densité.
 *   SVG : vectoriel. Chaque graphique Chart.js est redessiné dans un contexte SVG (svgcanvas),
 *         boîtes et textes HTML (titre, cartes KPI, tableaux) sont convertis en <rect> et <text>.
 *         Un canvas qui n'est pas un graphique Chart.js est inclus en image (signalé).
 *
 * L'export ouvre la page et lit son statut data-kc-render : il vaut contrôle de rendu, et
 * refuse d'exporter une page dont un graphique est en erreur.
 *
 * Usage : node export-chart.js <page.html> [--format png,svg,pdf] [-o dossier] [--scale 2] [--json]
 * Codes de sortie : 0 exporté, 1 rendu ou export en échec, 2 usage ou Chrome introuvable.
 * @license MIT
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');
const { VENDOR, readVendor } = require('./vendor-pins.js');

const FORMATS = ['png', 'svg', 'pdf'];
const LOAD_TIMEOUT_MS = 20000;
const EXPORT_PADDING = 24;

/** Lance Chrome headless avec le port DevTools, renvoie { child, wsUrl, profile }. */
function launchChrome(chrome) {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'kc-export-'));
  const child = spawn(chrome, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--hide-scrollbars', '--remote-debugging-port=0', `--user-data-dir=${profile}`,
    '--allow-file-access-from-files', 'about:blank'
  ], { stdio: ['ignore', 'ignore', 'pipe'] });
  return new Promise((resolve, reject) => {
    let err = '';
    const timer = setTimeout(() => { child.kill('SIGKILL'); reject(new Error('Chrome ne répond pas (DevTools)')); }, 15000);
    child.stderr.on('data', d => {
      err += d;
      const m = err.match(/DevTools listening on (ws:\/\/\S+)/);
      if (m) { clearTimeout(timer); resolve({ child, wsUrl: m[1], profile }); }
    });
    child.on('exit', code => { clearTimeout(timer); reject(new Error(`Chrome s'est arrêté (code ${code})`)); });
  });
}

/** Client DevTools minimal : send(method, params) -> résultat, sessions « flatten ». */
function connect(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    let id = 0;
    const pending = new Map();
    ws.onmessage = ev => {
      const msg = JSON.parse(typeof ev.data === 'string' ? ev.data : Buffer.from(ev.data).toString('utf8'));
      if (msg.id && pending.has(msg.id)) {
        const { ok, ko } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) ko(new Error(msg.error.message)); else ok(msg.result);
      }
    };
    ws.onerror = () => reject(new Error('connexion DevTools impossible'));
    ws.onopen = () => resolve({
      send(method, params = {}, sessionId) {
        return new Promise((ok, ko) => {
          const msgId = ++id;
          pending.set(msgId, { ok, ko });
          ws.send(JSON.stringify(Object.assign({ id: msgId, method, params }, sessionId ? { sessionId } : {})));
        });
      },
      close() { try { ws.close(); } catch (e) { /* déjà fermé */ } }
    });
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

/**
 * Sérialiseur exécuté dans la page : DOM + graphiques Chart.js -> chaîne SVG.
 * Renvoie { svg, rasterCanvases }.
 */
function pageToSvgSource() {
  /* global Chart, SVGCanvas */
  const NS = 'http://www.w3.org/2000/svg';
  const doc = document;
  const W = Math.ceil(doc.documentElement.scrollWidth);
  const H = Math.ceil(doc.documentElement.scrollHeight);
  const svg = doc.createElementNS(NS, 'svg');
  svg.setAttribute('xmlns', NS);
  svg.setAttribute('width', W);
  svg.setAttribute('height', H);
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  let rasterCanvases = 0;
  const measure = doc.createElement('canvas').getContext('2d');
  const sx = window.scrollX;
  const sy = window.scrollY;
  const transparent = c => !c || c === 'transparent' || /rgba\([^)]*,\s*0\)$/.test(c);
  const el = (name, attrs, parent) => {
    const n = doc.createElementNS(NS, name);
    Object.entries(attrs).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') n.setAttribute(k, v); });
    (parent || svg).appendChild(n);
    return n;
  };

  class RecordedPath {
    constructor() { this.ops = []; }
  }
  ['moveTo', 'lineTo', 'bezierCurveTo', 'quadraticCurveTo', 'arc', 'arcTo', 'ellipse', 'rect', 'roundRect', 'closePath'].forEach(m => {
    RecordedPath.prototype[m] = function () { this.ops.push([m, Array.prototype.slice.call(arguments)]); };
  });

  const bodyBg = getComputedStyle(doc.body).backgroundColor;
  el('rect', { width: W, height: H, fill: transparent(bodyBg) ? '#FFFFFF' : bodyBg });

  function drawBox(node, cs, r) {
    const x = r.left + sx;
    const y = r.top + sy;
    const rx = parseFloat(cs.borderTopLeftRadius) || 0;
    if (!transparent(cs.backgroundColor)) {
      el('rect', { x, y, width: r.width, height: r.height, rx: rx || undefined, fill: cs.backgroundColor });
    }
    const sides = ['Top', 'Right', 'Bottom', 'Left'].map(s => ({
      s, w: parseFloat(cs[`border${s}Width`]) || 0, c: cs[`border${s}Color`], style: cs[`border${s}Style`]
    }));
    const visible = sides.filter(b => b.w > 0 && b.style !== 'none' && !transparent(b.c));
    if (!visible.length) return;
    const same = visible.length === 4 && visible.every(b => b.w === visible[0].w && b.c === visible[0].c);
    if (same) {
      const w = visible[0].w;
      el('rect', { x: x + w / 2, y: y + w / 2, width: Math.max(r.width - w, 0), height: Math.max(r.height - w, 0), rx: rx ? Math.max(rx - w / 2, 0) : undefined, fill: 'none', stroke: visible[0].c, 'stroke-width': w });
      return;
    }
    visible.forEach(b => {
      const o = b.w / 2;
      const line = {
        Top: [x, y + o, x + r.width, y + o], Bottom: [x, y + r.height - o, x + r.width, y + r.height - o],
        Left: [x + o, y, x + o, y + r.height], Right: [x + r.width - o, y, x + r.width - o, y + r.height]
      }[b.s];
      el('line', { x1: line[0], y1: line[1], x2: line[2], y2: line[3], stroke: b.c, 'stroke-width': b.w, 'stroke-dasharray': b.style === 'dashed' ? `${b.w * 3} ${b.w * 2}` : (b.style === 'dotted' ? `${b.w} ${b.w}` : undefined) });
    });
  }

  function drawCanvas(canvas, r) {
    const x = r.left + sx;
    const y = r.top + sy;
    const chart = typeof Chart !== 'undefined' && Chart.getChart ? Chart.getChart(canvas) : null;
    if (chart && typeof SVGCanvas !== 'undefined' && drawChartSvg(chart, x, y, r)) return;
    rasterCanvases++;
    el('image', { x, y, width: r.width, height: r.height, href: canvas.toDataURL('image/png') });
  }

  // Redessine un graphique Chart.js en SVG. Renvoie false si un élément n'est pas
  // transposable (dégradé ou motif créé sur le canvas natif, par exemple) : le graphique est
  // alors inclus en image, et le canvas réel est redessiné intact.
  function drawChartSvg(chart, x, y, r) {
      const ctx = new SVGCanvas.Context({ width: chart.width, height: chart.height });
      // Le contexte SVG part vide : effacer ne doit rien dessiner (svgcanvas peint un
      // rectangle blanc quand la zone ne correspond pas exactement à sa taille).
      ctx.clearRect = function () {};
      // Canvas accepte une largeur ou une hauteur négative (bougie baissière), SVG non.
      ['fillRect', 'strokeRect', 'rect'].forEach(method => {
        const native = ctx[method].bind(ctx);
        ctx[method] = function (rx, ry, rw, rh) {
          if (rw < 0) { rx += rw; rw = -rw; }
          if (rh < 0) { ry += rh; rh = -rh; }
          return native(rx, ry, rw, rh);
        };
      });
      const original = chart.ctx;
      // Chart.js copie le contexte dans ses axes, boîtes de mise en page et contrôleurs
      // (ctx, _ctx) : tous sont redirigés le temps du dessin, puis rétablis.
      const holders = [chart, chart.tooltip, chart.legend, chart.titleBlock]
        .concat(Object.values(chart.scales || {}), chart.boxes || [], (chart._metasets || []).map(m => m && m.controller))
        .filter(Boolean);
      const swapped = [];
      holders.forEach(h => ['ctx', '_ctx'].forEach(k => {
        if (h[k] === original && !swapped.some(x => x[0] === h && x[1] === k)) { swapped.push([h, k]); h[k] = ctx; }
      }));
      // Les courbes passent par Path2D, opaque pour svgcanvas : le temps du dessin, Path2D
      // enregistre ses commandes et le contexte SVG les rejoue dans fill, stroke et clip.
      const RealPath2D = window.Path2D;
      const clearPathCaches = () => (chart._metasets || []).forEach(m => {
        if (!m) return;
        if (m.dataset) m.dataset._path = undefined;
        (m.data || []).forEach(e => { if (e) e._path = undefined; });
      });
      ['fill', 'stroke', 'clip'].forEach(method => {
        const native = ctx[method].bind(ctx);
        // Règle de remplissage : Chart.js trace les bordures de barres et de cellules en
        // fill('evenodd') (contour moins intérieur) ; svgcanvas l'ignore, la bordure couvrirait
        // alors toute la barre. Elle est posée sur l'élément SVG produit.
        ctx[method] = function (a, b) {
          const rule = typeof a === 'string' ? a : b;
          if (a instanceof RecordedPath) {
            ctx.beginPath();
            a.ops.forEach(([m, args]) => ctx[m].apply(ctx, args));
          }
          // Second remplissage du même chemin (fond, puis bordure en evenodd : plugin matrix) :
          // svgcanvas écraserait le premier ; le chemin est dupliqué dans un nouvel élément.
          if (method === 'fill' && ctx.__currentElement && ctx.__currentElement.__kcFilled) {
            const kept = ctx.__currentDefaultPath;
            ctx.beginPath();
            ctx.__currentDefaultPath = kept;
          }
          if (rule === 'evenodd' && ctx.__currentElement && ctx.__currentElement.setAttribute) {
            ctx.__currentElement.setAttribute(method === 'clip' ? 'clip-rule' : 'fill-rule', 'evenodd');
          }
          if (method === 'fill') {
            const res = native();
            if (ctx.__currentElement) ctx.__currentElement.__kcFilled = true;
            return res;
          }
          if (method !== 'clip') return native();
          // Un canvas garde le chemin courant après clip() ; svgcanvas le vide. Chart.js en
          // dépend (bordure de barre : contour, clip, intérieur, fill('evenodd')).
          const kept = ctx.__currentDefaultPath;
          const res = native();
          ctx.beginPath();
          ctx.__currentDefaultPath = kept;
          return res;
        };
      });
      let failed = false;
      try {
        window.Path2D = RecordedPath;
        clearPathCaches();
        chart.draw();
      } catch (e) {
        failed = true;
      } finally {
        window.Path2D = RealPath2D;
        clearPathCaches();
        swapped.forEach(([h, k]) => { h[k] = original; });
        chart.draw();
      }
      if (failed) return false;
      const inner = ctx.getSvg();
      inner.setAttribute('x', x);
      inner.setAttribute('y', y);
      inner.setAttribute('width', r.width);
      inner.setAttribute('height', r.height);
      inner.setAttribute('viewBox', `0 0 ${chart.width} ${chart.height}`);
      svg.appendChild(doc.importNode(inner, true));
      return true;
  }

  function drawText(textNode, cs) {
    const raw = textNode.textContent;
    if (!raw || !raw.trim()) return;
    const transform = cs.textTransform;
    const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    measure.font = font;
    const m = measure.measureText('Hg');
    const ascent = m.fontBoundingBoxAscent || parseFloat(cs.fontSize) * 0.8;
    const descent = m.fontBoundingBoxDescent || parseFloat(cs.fontSize) * 0.2;
    // Regroupe les mots par ligne affichée (retours à la ligne du navigateur conservés).
    const range = doc.createRange();
    const lines = [];
    const re = /\S+/g;
    let match;
    while ((match = re.exec(raw))) {
      range.setStart(textNode, match.index);
      range.setEnd(textNode, match.index + match[0].length);
      const rects = range.getClientRects();
      if (!rects.length) continue;
      const rr = rects[0];
      if (rr.width === 0 && rr.height === 0) continue;
      const last = lines[lines.length - 1];
      if (last && Math.abs(last.top - rr.top) < rr.height / 2) {
        last.words.push(match[0]);
        last.right = rr.right;
      } else {
        lines.push({ top: rr.top, height: rr.height, left: rr.left, right: rr.right, words: [match[0]] });
      }
    }
    lines.forEach(line => {
      let text = line.words.join(' ');
      if (transform === 'uppercase') text = text.toUpperCase();
      else if (transform === 'lowercase') text = text.toLowerCase();
      const baseline = line.top + sy + (line.height - (ascent + descent)) / 2 + ascent;
      const t = el('text', {
        x: line.left + sx, y: baseline,
        'font-family': cs.fontFamily, 'font-size': cs.fontSize, 'font-weight': cs.fontWeight,
        'font-style': cs.fontStyle === 'normal' ? undefined : cs.fontStyle,
        'letter-spacing': cs.letterSpacing === 'normal' ? undefined : cs.letterSpacing,
        fill: cs.color, textLength: line.words.length > 1 ? (line.right - line.left).toFixed(1) : undefined,
        lengthAdjust: line.words.length > 1 ? 'spacing' : undefined
      });
      t.textContent = text;
    });
  }

  function walk(node) {
    const cs = getComputedStyle(node);
    if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) return;
    const r = node.getBoundingClientRect();
    if (node !== doc.body && node !== doc.documentElement) drawBox(node, cs, r);
    const tag = node.tagName;
    if (tag === 'CANVAS') { if (r.width && r.height) drawCanvas(node, r); return; }
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return;
    if (node instanceof SVGSVGElement) {
      const copy = node.cloneNode(true);
      copy.setAttribute('x', r.left + sx);
      copy.setAttribute('y', r.top + sy);
      copy.setAttribute('width', r.width);
      copy.setAttribute('height', r.height);
      svg.appendChild(copy);
      return;
    }
    if (tag === 'IMG' && node.currentSrc) {
      el('image', { x: r.left + sx, y: r.top + sy, width: r.width, height: r.height, href: node.currentSrc });
      return;
    }
    node.childNodes.forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) drawText(child, cs);
      else if (child.nodeType === Node.ELEMENT_NODE) walk(child);
    });
  }

  walk(doc.body);
  return { svg: '<?xml version="1.0" encoding="UTF-8"?>\n' + new XMLSerializer().serializeToString(svg), rasterCanvases };
}

/**
 * Exporte une page compilée.
 * @param {string} htmlPath
 * @param {Object} opts - { formats: ['png','svg','pdf'], outDir, chrome, scale }
 * @returns {Promise<{status, reason, files: Array<{format, file, note}>, errors: Array<{format, message}>}>}
 */
async function exportPage(htmlPath, opts = {}) {
  const abs = path.resolve(htmlPath);
  const formats = (opts.formats && opts.formats.length ? opts.formats : ['png']).filter(f => FORMATS.includes(f));
  const outDir = path.resolve(opts.outDir || path.dirname(abs));
  const base = path.basename(abs).replace(/\.html?$/i, '');
  const scale = Number(opts.scale) > 0 ? Number(opts.scale) : 2;
  const chrome = opts.chrome || require('./render-check.js').findChrome();
  if (!chrome) throw Object.assign(new Error('Chrome ou Chromium introuvable. Définir CHROME_PATH vers l\'exécutable.'), { code: 2 });

  // Largeur de rendu : celle du conteneur de la page, plus la marge d'export.
  const html = fs.readFileSync(abs, 'utf8');
  const maxWidth = Number((html.match(/\.kit-charts-standalone-container\s*\{[^}]*max-width:\s*(\d+)px/) || [])[1] || 900);
  const width = maxWidth + EXPORT_PADDING * 2;

  const { child, wsUrl, profile } = await launchChrome(chrome);
  const cdp = await connect(wsUrl);
  const result = { status: 'error', reason: '', files: [], errors: [] };
  try {
    const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
    const send = (m, p) => cdp.send(m, p, sessionId);
    await send('Page.enable');
    await send('Runtime.enable');
    // Viewport haut d'emblée : la page n'est jamais redimensionnée après le rendu (un
    // redimensionnement relance le dessin Chart.js, que la capture pourrait devancer).
    await send('Emulation.setDeviceMetricsOverride', { width, height: 600, deviceScaleFactor: scale, mobile: false });
    await send('Emulation.setEmulatedMedia', { media: 'screen' });
    // Mise en page d'export : marge fixe, pas de centrage vertical sur 100vh.
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `document.addEventListener('DOMContentLoaded', function () {
        var s = document.createElement('style');
        s.textContent = 'body{padding:${EXPORT_PADDING}px !important;display:block !important;min-height:0 !important}';
        document.head.appendChild(s);
      });`
    });
    await send('Page.navigate', { url: `file://${abs}` });

    const evaluate = async expression => {
      const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
      return r.result.value;
    };
    const deadline = Date.now() + LOAD_TIMEOUT_MS;
    let statuses = null;
    while (Date.now() < deadline) {
      statuses = await evaluate(`(function () {
        if (document.readyState !== 'complete') return null;
        var n = Array.prototype.slice.call(document.querySelectorAll('[data-kc-render]'));
        var page = document.querySelector('[data-kc-page]');
        var expected = page ? Number(page.getAttribute('data-kc-page')) : 1;
        return n.length >= expected ? n.map(function (x) { return [x.getAttribute('data-kc-render'), x.getAttribute('data-kc-error') || '']; }) : null;
      })()`).catch(() => null);
      if (statuses) break;
      await sleep(150);
    }
    if (!statuses) {
      result.reason = 'page non rendue dans le délai (statut data-kc-render absent)';
      return result;
    }
    const bad = statuses.findIndex(s => s[0] !== 'ok');
    if (bad >= 0) {
      result.status = statuses[bad][0];
      result.reason = `${statuses.length > 1 ? `graphique ${bad + 1}/${statuses.length} : ` : ''}${statuses[bad][1]}`;
      return result;
    }
    result.status = 'ok';
    await evaluate('document.fonts.ready.then(function () { return new Promise(function (r) { requestAnimationFrame(function () { requestAnimationFrame(r); }); }); })');
    const height = await evaluate(`Math.ceil(document.querySelector('.kit-charts-standalone-container').getBoundingClientRect().bottom + window.scrollY + ${EXPORT_PADDING})`);

    fs.mkdirSync(outDir, { recursive: true });
    for (const format of formats) {
      const file = path.join(outDir, `${base}.${format}`);
      try {
        if (format === 'png') {
          const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width, height, scale: 1 } });
          fs.writeFileSync(file, Buffer.from(shot.data, 'base64'));
          result.files.push({ format, file, note: `${width * scale}×${height * scale} px` });
        } else if (format === 'pdf') {
          const pdf = await send('Page.printToPDF', {
            printBackground: true, paperWidth: width / 96, paperHeight: (height + 1) / 96,
            marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0, pageRanges: '1', preferCSSPageSize: false
          });
          fs.writeFileSync(file, Buffer.from(pdf.data, 'base64'));
          result.files.push({ format, file, note: '1 page' });
        } else if (format === 'svg') {
          const lib = readVendor(VENDOR.svgcanvas);
          await evaluate(`(function () { var exports = {}; var module = { exports: exports };\n${lib}\n;window.SVGCanvas = exports; return true; })()`);
          const out = await evaluate(`(${pageToSvgSource.toString()})()`);
          fs.writeFileSync(file, out.svg, 'utf8');
          result.files.push({ format, file, note: out.rasterCanvases ? `vectoriel, sauf ${out.rasterCanvases} graphique(s) inclus en image` : 'vectoriel' });
        }
      } catch (err) {
        result.errors.push({ format, message: err.message });
      }
    }
    return result;
  } finally {
    cdp.close();
    child.kill('SIGKILL');
    await sleep(50);
    fs.rmSync(profile, { recursive: true, force: true });
  }
}

async function main() {
  const args = process.argv.slice(2);
  const opt = names => { const i = args.findIndex(a => names.includes(a)); return i >= 0 ? args[i + 1] : undefined; };
  const valueOpts = ['--format', '-f', '-o', '--output', '--scale'];
  const files = args.filter((a, i) => !a.startsWith('-') && !valueOpts.includes(args[i - 1]));
  if (!files.length || args.includes('--help')) {
    console.log('Usage : kit-charts export <page.html> [--format png,svg,pdf] [-o dossier] [--scale 2] [--json]');
    process.exit(files.length ? 0 : 2);
  }
  const formats = String(opt(['--format', '-f']) || 'png').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  const unknown = formats.filter(f => !FORMATS.includes(f));
  if (unknown.length) { console.error(`Format inconnu : ${unknown.join(', ')}. Valeurs : ${FORMATS.join(', ')}.`); process.exit(2); }
  let failed = 0;
  const reports = [];
  for (const f of files) {
    try {
      const r = await exportPage(f, { formats, outDir: opt(['-o', '--output']), scale: opt(['--scale']) });
      reports.push(Object.assign({ page: path.resolve(f) }, r));
      if (r.status !== 'ok' || r.errors.length) failed++;
    } catch (err) {
      if (err.code === 2) { console.error(err.message); process.exit(2); }
      reports.push({ page: path.resolve(f), status: 'error', reason: err.message, files: [], errors: [] });
      failed++;
    }
  }
  if (args.includes('--json')) {
    console.log(JSON.stringify(reports, null, 2));
  } else {
    reports.forEach(r => {
      const rel = p => path.relative(process.cwd(), p);
      if (r.status !== 'ok') console.log(`❌ ${rel(r.page)} : rendu ${r.status}${r.reason ? ` (${r.reason})` : ''}, rien exporté`);
      r.files.forEach(x => console.log(`✅ ${x.format} : ${rel(x.file)}${x.note ? ` (${x.note})` : ''}`));
      r.errors.forEach(e => console.log(`❌ ${e.format} : ${e.message}`));
    });
  }
  process.exit(failed ? 1 : 0);
}

if (require.main === module) main();

module.exports = { exportPage, FORMATS, launchChrome, connect };
