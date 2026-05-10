#!/usr/bin/env node
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { approximateTokens, cadialWheel, formatCadialCli, runCore } = require('./kobllux-core');

function discoverRoot() {
  if (process.env.KOBLLUX_ROOT) {
    return path.resolve(process.env.KOBLLUX_ROOT);
  }

  let cursor = process.cwd();
  while (true) {
    const packagePath = path.join(cursor, 'package.json');
    const serverPath = path.join(cursor, 'src', 'node-fields-server.js');
    if (fs.existsSync(packagePath) && fs.existsSync(serverPath)) {
      return cursor;
    }

    const parent = path.dirname(cursor);
    if (parent === cursor) {
      return process.cwd();
    }
    cursor = parent;
  }
}

const ROOT = discoverRoot();
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
    context: 'GET /context',
    commands: 'GET /commands',
    logs: 'GET /logs?limit=9',
    cadial: 'GET /cadial',
    core: 'POST /core',
    pulse: 'POST /pulse',
    phi: 'POST /phi?store=0',
    ui: 'GET /ui'
  }
};

const commandBook = {
  shell: [
    'npm run node:fields',
    'npm run --silent context',
    'npm run --silent phi -- "Oi Dual, a forma é múltipla, o pulso é um só."',
    'printf %s "texto longo" | npm run --silent phi -- --stdin',
    'npm run --silent logs -- --limit=9',
    'npm run cloud:termux',
    'npm run --silent call:context',
    'npm run --silent cadial',
    'npm run --silent core -- "Integrar 432Hz + tetraedros Sierpiński e narrar PT-BR (∆7)."',
    'printf %s "texto longo" | npm run --silent core -- --stdin --seal',
    'curl http://127.0.0.1:3697/context',
    'curl http://127.0.0.1:3697/logs?limit=9'
  ],
  curl: [
    'curl http://127.0.0.1:3697/health',
    'curl http://127.0.0.1:3697/fields',
    'curl http://127.0.0.1:3697/cadial',
    `curl -X POST http://127.0.0.1:3697/core -H 'content-type: application/json' -d '{"texto":"Integrar 432Hz + tetraedros Sierpiński","seal":true}'`,
    `curl -X POST http://127.0.0.1:3697/phi?store=0 -H 'content-type: application/json' -d '{"texto":"∆³ conversar no Φ sem armazenar"}'`
  ],
  warning: 'Não cole blocos de contexto diretamente no shell. Use npm run --silent context, npm run phi, curl /context ou salve em arquivo.'
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

function readStdin() {
  return new Promise((resolve, reject) => {
    let raw = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => {
      raw += chunk;
    });
    process.stdin.on('end', () => resolve(raw));
    process.stdin.on('error', reject);
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

function normalizePulse(input) {
  if (typeof input === 'string') {
    return { texto: input };
  }
  if (input && typeof input === 'object') {
    return input;
  }
  return { texto: '' };
}

function appendPulse(pulse, kind = 'pulse') {
  ensureState();
  const event = {
    ts: nowIso(),
    node: baseFields.id,
    host: os.hostname(),
    kind,
    pulse: normalizePulse(pulse)
  };
  fs.appendFileSync(LOG_FILE, JSON.stringify(event) + '\n', 'utf8');
  return event;
}

function buildContext() {
  return {
    node: baseFields.id,
    status: 'ATIVO_NO_TERMUX',
    health: `http://${HOST}:${PORT}/health`,
    fields: `http://${HOST}:${PORT}/fields`,
    phi: `http://${HOST}:${PORT}/phi`,
    logs: path.relative(ROOT, LOG_FILE),
    core: `http://${HOST}:${PORT}/core`,
    cadial: `http://${HOST}:${PORT}/cadial`,
    objetivo: 'expandir sem subtrair, integrando BLLUE-KODUX-Solus com MetaLux, Horus, FitLux e a Roda Viva CADIAL como camadas organizacionais',
    aviso: 'Isto é contexto para copiar em conversa, não é uma sequência de comandos do shell.'
  };
}

function buildPhiResponse(pulse) {
  const normalized = normalizePulse(pulse);
  const text = normalized.texto || normalized.text || normalized.sinal || '';
  return {
    status: 'Φ_RESPONDIDO',
    entrada: normalized,
    saida: {
      reconhecimento: 'Recebi teu pulso no campo Φ.',
      camada_1: 'BLLUE escuta: a mensagem foi registrada como presença e intenção.',
      camada_2: 'KODUX estrutura: o pulso pode virar Core 3-6-9-7, estimativa de tokens e saídas HTML/Python/OBJ.',
      camada_3: 'Solus reflete: use store=0 ou --no-store quando quiser conversar sem gravar logs.',
      sintese: text
        ? `∆³ ${text} → detectar, integrar, expandir e selar.`
        : '∆³ detectar, integrar, expandir e selar.',
      comando_seguro: 'npm run --silent phi -- --no-store "sua mensagem aqui"',
      core_sugerido: 'npm run --silent core -- "sua semente aqui"',
      token_estimate: approximateTokens(text)
    }
  };
}

function parseLimit(value) {
  const parsed = Number.parseInt(value || '9', 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    return 9;
  }
  return Math.min(parsed, 78);
}

function shouldStore(url, payload = {}) {
  const storeParam = url && url.searchParams && url.searchParams.get('store');
  return !(storeParam === '0' || storeParam === 'false' || payload.store === false || payload.no_store === true);
}

function readLogs(limit = 9) {
  ensureState();
  if (!fs.existsSync(LOG_FILE)) {
    return [];
  }

  return fs.readFileSync(LOG_FILE, 'utf8')
    .trim()
    .split('\n')
    .filter(Boolean)
    .slice(-limit)
    .map(line => JSON.parse(line));
}

async function parseRequestPayload(req) {
  const raw = await readBody(req);
  if (!raw.trim()) {
    return {};
  }
  if (raw.trim().startsWith('{')) {
    return JSON.parse(raw);
  }
  return { texto: raw };
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

  if (req.method === 'GET' && url.pathname === '/context') {
    sendJson(res, 200, buildContext());
    return;
  }

  if (req.method === 'GET' && url.pathname === '/commands') {
    sendJson(res, 200, commandBook);
    return;
  }

  if (req.method === 'GET' && url.pathname === '/ui') {
    const uiPath = path.join(ROOT, 'public', 'kobllux-core.html');
    res.writeHead(200, {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store'
    });
    res.end(fs.readFileSync(uiPath, 'utf8'));
    return;
  }

  if (req.method === 'GET' && url.pathname === '/logs') {
    sendJson(res, 200, {
      status: 'LOGS_NODE_FIELDS',
      file: path.relative(ROOT, LOG_FILE),
      events: readLogs(parseLimit(url.searchParams.get('limit')))
    });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/cadial') {
    const format = url.searchParams.get('format');
    if (format === 'cli') {
      res.writeHead(200, {
        'content-type': 'text/plain; charset=utf-8',
        'cache-control': 'no-store'
      });
      res.end(formatCadialCli() + '\n');
      return;
    }
    sendJson(res, 200, {
      status: 'CADIAL_RODA_VIVA',
      law: baseFields.formula,
      archetypes: cadialWheel()
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/core') {
    const payload = await parseRequestPayload(req);
    const input = payload.texto || payload.text || payload.input || '';
    const result = runCore(input, { seal: payload.seal === true || url.searchParams.get('seal') === '1' });
    if (shouldStore(url, payload)) {
      const event = appendPulse({ input, core: result.log }, 'core');
      sendJson(res, 201, { ...result, event });
      return;
    }
    sendJson(res, 200, { ...result, armazenado: false });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/pulse') {
    const pulse = await parseRequestPayload(req);
    const event = appendPulse(pulse, 'pulse');
    sendJson(res, 201, {
      status: 'PULSO_REGISTRADO',
      event
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/phi') {
    const pulse = await parseRequestPayload(req);
    if (shouldStore(url, pulse)) {
      const event = appendPulse(pulse, 'phi');
      sendJson(res, 201, {
        ...buildPhiResponse(pulse),
        event
      });
      return;
    }
    sendJson(res, 200, {
      ...buildPhiResponse(pulse),
      armazenado: false
    });
    return;
  }

  sendJson(res, 404, {
    status: 'NAO_ENCONTRADO',
    endpoints: baseFields.endpoints
  });
}

function printJson(payload) {
  process.stdout.write(JSON.stringify(payload, null, 2) + '\n');
}

function printHealth() {
  ensureState();
  printJson({
    status: 'PRONTO_PARA_ATIVAR',
    node: baseFields.id,
    root: ROOT,
    stateDir: STATE_DIR,
    port: PORT
  });
}

async function runCli() {
  if (process.argv.includes('--health')) {
    printHealth();
    return;
  }

  if (process.argv.includes('--context')) {
    ensureState();
    printJson(buildContext());
    return;
  }

  if (process.argv.includes('--commands')) {
    printJson(commandBook);
    return;
  }

  if (process.argv.includes('--cadial')) {
    if (process.argv.includes('--cli')) {
      process.stdout.write(formatCadialCli() + '\n');
      return;
    }
    printJson({
      status: 'CADIAL_RODA_VIVA',
      law: baseFields.formula,
      archetypes: cadialWheel()
    });
    return;
  }

  if (process.argv.includes('--core')) {
    const stdinMode = process.argv.includes('--stdin');
    const seal = process.argv.includes('--seal');
    const noStore = process.argv.includes('--no-store');
    const args = process.argv
      .slice(process.argv.indexOf('--core') + 1)
      .filter(arg => !['--stdin', '--seal', '--no-store'].includes(arg));
    const text = stdinMode ? await readStdin() : args.join(' ');
    const result = runCore(text.trim(), { seal });
    if (noStore) {
      printJson({ ...result, armazenado: false });
      return;
    }
    const event = appendPulse({ input: text.trim(), core: result.log }, 'core');
    printJson({ ...result, event });
    return;
  }

  if (process.argv.includes('--logs')) {
    const limitArg = process.argv.find(arg => arg.startsWith('--limit='));
    printJson({
      status: 'LOGS_NODE_FIELDS',
      file: path.relative(ROOT, LOG_FILE),
      events: readLogs(parseLimit(limitArg && limitArg.split('=')[1]))
    });
    return;
  }

  if (process.argv.includes('--phi')) {
    const stdinMode = process.argv.includes('--stdin');
    const noStore = process.argv.includes('--no-store');
    const args = process.argv
      .slice(process.argv.indexOf('--phi') + 1)
      .filter(arg => !['--stdin', '--no-store'].includes(arg));
    const text = stdinMode ? await readStdin() : args.join(' ');
    const pulse = { sinal: 'Φ', texto: text.trim() };
    if (noStore) {
      printJson({
        ...buildPhiResponse(pulse),
        armazenado: false
      });
      return;
    }
    const event = appendPulse(pulse, 'phi');
    printJson({
      ...buildPhiResponse(pulse),
      event
    });
    return;
  }

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
    console.log(`Comandos: http://${HOST}:${PORT}/commands`);
  });
}

runCli().catch(error => {
  console.error(JSON.stringify({
    status: 'ERRO_CLI_NODE_FIELDS',
    message: error.message
  }, null, 2));
  process.exit(1);
});
