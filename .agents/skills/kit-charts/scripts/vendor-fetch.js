/**
 * @file .agents/skills/kit-charts/scripts/vendor-fetch.js
 * @description Copie dans vendor/ les dépendances épinglées de vendor-pins.js, pour le mode
 * hors ligne et l'export. Vérifie chaque fichier contre VENDOR_SHA384.
 *
 *   node vendor-fetch.js                  télécharge les fichiers absents, vérifie les empreintes
 *   node vendor-fetch.js --update-hashes  recalcule VENDOR_SHA384 (après un changement de version)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const PINS_PATH = path.join(__dirname, 'vendor-pins.js');
const { VENDOR, VENDOR_SHA384, vendorLocalPath } = require(PINS_PATH);

async function main() {
  const update = process.argv.includes('--update-hashes');
  const hashes = {};
  let bad = 0;
  for (const url of Object.values(VENDOR)) {
    const file = vendorLocalPath(url);
    if (!fs.existsSync(file)) {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${url} : HTTP ${res.status}`);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
      console.log(`téléchargé ${path.relative(process.cwd(), file)}`);
    }
    const digest = crypto.createHash('sha384').update(fs.readFileSync(file)).digest('base64');
    hashes[url] = digest;
    if (!update && VENDOR_SHA384[url] !== digest) {
      bad++;
      console.error(`empreinte différente : ${path.relative(process.cwd(), file)}`);
    }
  }
  if (update) {
    const src = fs.readFileSync(PINS_PATH, 'utf8');
    const body = Object.entries(hashes).map(([u, h]) => `  '${u}':\n    '${h}'`).join(',\n');
    fs.writeFileSync(PINS_PATH, src.replace(/const VENDOR_SHA384 = \{[\s\S]*?\};/, `const VENDOR_SHA384 = {\n${body}\n};`));
    console.log(`VENDOR_SHA384 mis à jour (${Object.keys(hashes).length} fichiers).`);
    return;
  }
  if (bad) process.exit(1);
  console.log(`vendor/ : ${Object.keys(hashes).length} fichiers conformes.`);
}

main().catch(err => { console.error(err.message); process.exit(1); });
