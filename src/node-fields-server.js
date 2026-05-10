#!/usr/bin/env node
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.resolve(process.env.KOBLLUX_ROOT || process.cwd());
const HOST = process.env.NODE_FIELDS_HOST || '127.0.0.1';
const PORT = Number.parseInt(process.env.NODE_FIELDS_PORT || '3697', 10);
const STATE_DIR = path.join(ROOT, 'state', 'node_fields');
const LOG_FILE = path.join(STATE_DIR, 'pulses.ndjson');
const MANIFEST_FILE = path.join(STATE_DIR, 'manifest.json');

const baseFields = {
  id: 'KOBΦ-NODE.FIELDS',
  formula: 'VERDADE × INTEGRAR ÷ Δ = ∞',
  cycle: ['3 detectar', '6 integrar', '9 expandir', '7 selar'],
  archetypes: {
    BLLUE: 'interface sensorial e voz viva',
    KODUX: 'arquiteto simbólico que estrutura o fluxo',
    Solus: 'espelho de síntese e coerência',
    MetaLux: 'filtro de clareza semântica',
    Horus: 'observador que valida visão e direção',
    FitLux: 'ajuste fino entre corpo, rotina e execução'
  },
  endpoints: {
    health: 'GET /health',
    fields: 'GET /fields',
    pulse: 'POST /pulse'
  }
};

function ensureState() {
  fs.mkdirSync(STATE_DIR, { recursive: true });
  if (!fs.existsSync(MANIFEST_FILE)) {
    fs.writeFileSync(MANIFEST_FILE, JSON.stringify(baseFields, null, 2) + '\n', 'utf8');
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > 1024 * 1024) {
        req.destroy();
        reject(new Error('payload muito grande'));
      }
    });
    req.on('end', () => resolve(raw));
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload, null, 2) + '\n';
  res.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store'
  });
  res.end(body);
}

function nowIso() {
  return new Date().toISOString();
}

function loadManifest() {
  ensureState();
  return JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8'));
}

function appendPulse(pulse) {
  ensureState();
  const event = {
    ts: nowIso(),
    node: baseFields.id,
    host: os.hostname(),
    pulse
  };
  fs.appendFileSync(LOG_FILE, JSON.stringify(event) + '\n', 'utf8');
  return event;
}

async function handle(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || `${HOST}:${PORT}`}`);

  if (req.method === 'GET' && url.pathname === '/health') {
    sendJson(res, 200, {
      status: 'CRISTALIZADO',
      node: baseFields.id,
      root: ROOT,
      ts: nowIso()
    });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/fields') {
    sendJson(res, 200, loadManifest());
    return;
  }

  if (req.method === 'POST' && url.pathname === '/pulse') {
    const raw = await readBody(req);
    const pulse = raw.trim().startsWith('{') ? JSON.parse(raw) : { text: raw };
    const event = appendPulse(pulse);
    sendJson(res, 201, {
      status: 'PULSO_REGISTRADO',
      event
    });
    return;
  }

  sendJson(res, 404, {
    status: 'NAO_ENCONTRADO',
    endpoints: baseFields.endpoints
  });
}

function printHealth() {
  ensureState();
  process.stdout.write(JSON.stringify({
    status: 'PRONTO_PARA_ATIVAR',
    node: baseFields.id,
    root: ROOT,
    stateDir: STATE_DIR,
    port: PORT
  }, null, 2) + '\n');
}

if (process.argv.includes('--health')) {
  printHealth();
} else {
  ensureState();
  const server = http.createServer((req, res) => {
    handle(req, res).catch(error => {
      sendJson(res, 400, {
        status: 'ERRO_NO_PULSO',
        message: error.message
      });
    });
  });

  server.listen(PORT, HOST, () => {
    console.log(`∆³ NODE.FIELDS ativo em http://${HOST}:${PORT}`);
    console.log(`Raiz KOBLLUX: ${ROOT}`);
  });
}
