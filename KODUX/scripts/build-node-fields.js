// GENUS · renderer + tagger — build script
// Validates KOBLLUX artifacts and emits a build manifest

'use strict';

const fs   = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');

function sha256(filepath) {
  const buf = fs.readFileSync(filepath);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function validateJSON(filepath) {
  const src = fs.readFileSync(filepath, 'utf8');
  JSON.parse(src);
  return true;
}

const artifacts = [
  path.join(ROOT, 'package.json'),
  path.join(ROOT, 'src', 'node-fields-server.js'),
];

const manifest = {
  built_at: new Date().toISOString(),
  codex_hash: 'f544e7482b2c8426',
  equation: 'VERDADE × INTEGRAR ÷ Δ = ∞',
  files: [],
};

let ok = true;

for (const f of artifacts) {
  const rel = path.relative(ROOT, f);
  try {
    if (f.endsWith('.json')) validateJSON(f);
    const hash = sha256(f);
    manifest.files.push({ path: rel, sha256: hash });
    console.log(`[GENUS] ✓ ${rel} — ${hash.slice(0, 12)}…`);
  } catch (e) {
    console.error(`[GENUS] ✗ ${rel} — ${e.message}`);
    ok = false;
  }
}

const outPath = path.join(ROOT, 'build-manifest.json');
fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2));
console.log(`[GENUS] manifest → build-manifest.json`);

if (!ok) process.exit(1);
