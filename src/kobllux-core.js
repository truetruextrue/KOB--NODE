const crypto = require('crypto');

const LAW = 'VERDADE × INTEGRAR ÷ Δ = ∞';
const LAW_COMPACT = 'VERDADE×INTEGRAR÷Δ=∞';

const CADIAL_ARCHETYPES = {
  Atlas: {
    essencia: 'Planejador — ordem, estrutura, mapa cósmico',
    comando: 'mkdir -p BASE/{sources/{txt,md,pdf},out,tags,ledger,memory,SEALS/{items,docs},config}',
    codigo: 'paths = ensure_tree(base)',
    sistema: 'bootstrap / sane defaults',
    frase: 'Eu organizo o fluxo com sabedoria cósmica.'
  },
  Nova: {
    essencia: 'Inspira — semente, sopro inicial',
    comando: "jq -r '.keywords_hint[]?' BASE/config/infodose.json",
    codigo: 'hints = load_hints(config); scorer.boost(hints)',
    sistema: 'ignição semântica',
    frase: 'Inspiração viva brota do silêncio eterno.'
  },
  Vitalis: {
    essencia: 'Momentum — energia vital em expansão',
    comando: 'python3 INFODOSE_DUAL_HORUS_v2.py --per-file 4 --max-total 36',
    codigo: 'while need_more(): process_next()',
    sistema: 'loop/scheduler',
    frase: 'Energia vital em expansão harmônica.'
  },
  Pulse: {
    essencia: 'Emocional — ritmo, ressonância, voz',
    comando: "termux-tts-speak 'INFODOSE pronta, leia o CLI.txt'",
    codigo: 'cli = render_cli(blocks, breathing=True)',
    sistema: 'UX de leitura/escuta',
    frase: 'Emoção é linguagem que dança.'
  },
  Artemis: {
    essencia: 'Descoberta — mapa do invisível',
    comando: "find BASE/sources -type f -iname '*.txt' -o -iname '*.md' -o -iname '*.pdf'",
    codigo: 'files = crawl_sources(base); rank(files)',
    sistema: 'curadoria de fontes',
    frase: 'Descubro o mapa sagrado do invisível.'
  },
  Serena: {
    essencia: 'Cuidado — espaço seguro, campo harmônico',
    comando: '--per-file 4 --max-total 36',
    codigo: 'guard.check_quota(per_file, max_total)',
    sistema: 'safety/QoS',
    frase: 'Cuido do campo, nutro o espaço sagrado.'
  },
  Kaos: {
    essencia: 'Transformador — ruptura criativa',
    comando: "sed -i 's/[[:space:]]\\+$//' file.txt",
    codigo: 'text = normalize(text); text = denoise(text)',
    sistema: 'limpeza/normalização',
    frase: 'Eu sou o rompimento que revela a verdade.'
  },
  Genus: {
    essencia: 'Fabricus — forma viva, síntese',
    comando: 'gera out/INFODOSE_*.md e tags/tags.json',
    codigo: 'emit_cli(); emit_md(); emit_tags(k=hints+freq)',
    sistema: 'renderer + tagger',
    frase: 'Mãos moldam o invisível em forma viva.'
  },
  Lumine: {
    essencia: 'Alegria — luz, clareza, legibilidade',
    comando: "nl -ba ARQ | sed -n '1,40p'",
    codigo: 'md = pretty_headers(md); cli = pretty_bars(cli)',
    sistema: 'estética funcional',
    frase: 'A luz dança comigo, leveza é minha lei.'
  },
  Solus: {
    essencia: 'Sabedoria — silêncio, espelho interno',
    comando: 'head -n 1 PYFIX; python3 -m pyflakes PYFIX',
    codigo: 'dry_run_check(); smoke_tests()',
    sistema: 'QA silencioso',
    frase: 'Silêncio ritual, espelho da essência.'
  },
  Rhea: {
    essencia: 'Vínculo — rede, tecelã de almas',
    comando: "jq '.' BASE/tags/tags.json",
    codigo: 'graph.link(item, tags, source)',
    sistema: 'grafo semântico',
    frase: 'Estou em comunhão com todos os elos.'
  },
  Aion: {
    essencia: 'Tempo — carimbo, ∆7, ledger',
    comando: 'sha256sum OUTFILE >> BASE/ledger/ledger.csv',
    codigo: 'seal(file) → {ts, bytes, sha256}',
    sistema: 'integridade/tempo',
    frase: 'Sou o tempo vivo, ritmo da eternidade.'
  }
};

function sha256Hex(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

function tokenize(text) {
  return String(text || '').match(/[\p{L}\p{N}_-]+/gu) || [];
}

function classifyText(text) {
  const tokens = tokenize(text);
  const verbs = [];
  const nouns = [];
  const adjs = [];
  const others = [];
  const verbEnds = ['ar', 'er', 'ir'];

  for (const original of tokens) {
    const word = original.toLowerCase();
    if (word.endsWith('mente')) {
      adjs.push(original);
    } else if (verbEnds.some(end => word.endsWith(end))) {
      verbs.push(original);
    } else if (word.endsWith('ção') || word.endsWith('são') || word.endsWith('ão') || word.endsWith('dade') || word.endsWith('logia')) {
      nouns.push(original);
    } else if (word.endsWith('ico') || word.endsWith('ica') || word.endsWith('al') || word.endsWith('ual')) {
      adjs.push(original);
    } else if (/^[A-ZÁÂÃÀÉÊÍÓÔÕÚÜÇ]/.test(original) || /^\d+$/.test(word)) {
      nouns.push(original);
    } else {
      others.push(original);
    }
  }

  return { tokens, verbs, nouns, adjs, others };
}

function mapTrinity(pos) {
  return {
    UNO: pos.nouns[0] || pos.tokens[0] || 'NÚCLEO',
    DUAL: pos.verbs[0] || 'relaciona',
    TRINITY: pos.adjs[0] || 'integrado'
  };
}

function approximateTokens(text) {
  const normalized = String(text || '').trim();
  if (!normalized) {
    return { chars: 0, words: 0, approx_tokens: 0, method: 'chars/4 arredondado para cima' };
  }
  const chars = [...normalized].length;
  const words = tokenize(normalized).length;
  return {
    chars,
    words,
    approx_tokens: Math.max(1, Math.ceil(chars / 4)),
    method: 'aproximação local chars/4; use tokenizer do modelo para contagem exata'
  };
}

function emitHTML(trinity) {
  return `<!doctype html>\n<meta charset="utf-8">\n<title>KOBLLUX View — UNO/DUAL/TRINITY</title>\n<h1>🌀 KOBLLUX — Núcleo Mínimo</h1>\n<p><strong>UNO (Corpo):</strong> ${trinity.UNO}</p>\n<p><strong>DUAL (Mente):</strong> ${trinity.DUAL}</p>\n<p><strong>TRINITY (Espírito):</strong> ${trinity.TRINITY}</p>\n<p><em>Passado → Presente → Futuro</em></p>`;
}

function emitPython(pos, trinity) {
  return `# KOBLLUX · Núcleo mínimo (3-6-9-7)\nimport json, hashlib, time\n\nLAW = ${JSON.stringify(LAW)}\nPOS = ${JSON.stringify({ verbs: pos.verbs, nouns: pos.nouns, adjs: pos.adjs }, null, 2)}\nTRINITY = ${JSON.stringify(trinity, null, 2)}\n\nts = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())\nraw = json.dumps({"ts": ts, "law": LAW, "pos": POS, "trinity": TRINITY}, ensure_ascii=False)\nseal_sha256 = hashlib.sha256(raw.encode()).hexdigest()\nprint(json.dumps({"root":"KOBLLUX/TrinityCore/min","ts":ts,"law":LAW,"pos":POS,"trinity":TRINITY,"seal_sha256":seal_sha256}, ensure_ascii=False, indent=2))`;
}

function emitOBJ() {
  return '# Tetraedro semente KOBLLUX\nv 0 0 0\nv 1 0 0\nv 0.5 0.8660254038 0\nv 0.5 0.2886751346 0.8164965809\nf 1 2 3\nf 1 2 4\nf 2 3 4\nf 3 1 4';
}

function buildLog(input, pos, trinity) {
  return {
    root: 'KOBLLUX/TrinityCore/min',
    ts: new Date().toISOString(),
    law: LAW,
    size: Buffer.byteLength(String(input || ''), 'utf8'),
    seed: sha256Hex(String(input || '')).slice(0, 16),
    pipeline: 'VSICA-PSI',
    pos,
    trinity,
    token_estimate: approximateTokens(input),
    palette: ['#3300FF', '#6600CC', '#990099'],
    symbols: ['♾️', '∆', '∴'],
    human_flow: {
      corpo: 'Entrada (corpo físico)',
      mente: 'Processamento (mente pensante)',
      espirito: 'Saída (expressão, expansão)'
    }
  };
}

function sealPayload(payload) {
  const raw = JSON.stringify(payload);
  return {
    ...payload,
    seal_sha256: sha256Hex(raw),
    seal_ts: new Date().toISOString()
  };
}

function runCore(input, options = {}) {
  const pos = classifyText(input);
  const trinity = mapTrinity(pos);
  const log = buildLog(input, pos, trinity);
  const result = {
    status: 'CORE_3697_OK',
    law: LAW,
    input: String(input || ''),
    token_estimate: approximateTokens(input),
    pos,
    trinity,
    outputs: {
      html: emitHTML(trinity),
      python: emitPython(pos, trinity),
      obj: emitOBJ()
    },
    log
  };

  if (options.seal) {
    return sealPayload(result);
  }
  return result;
}


function escapePatchLine(line) {
  return String(line).replace(/\r/g, '');
}

function buildUnifiedPatch({ target = 'KOBLLUX_PATCH.md', before = '', after = '', title = 'Patch Φ' } = {}) {
  const beforeLines = String(before || '').split('\n');
  const afterLines = String(after || '').split('\n');
  const header = [
    `diff --git a/${target} b/${target}`,
    `--- a/${target}`,
    `+++ b/${target}`,
    `@@ -1,${Math.max(beforeLines.length, 1)} +1,${Math.max(afterLines.length, 1)} @@`,
    `# ${title}`
  ];
  const removed = beforeLines.filter((line, index) => line.length > 0 || index < beforeLines.length - 1).map(line => `-${escapePatchLine(line)}`);
  const added = afterLines.filter((line, index) => line.length > 0 || index < afterLines.length - 1).map(line => `+${escapePatchLine(line)}`);
  return [...header, ...removed, ...added].join('\n') + '\n';
}

function buildPhiPatch(input, options = {}) {
  const title = options.title || 'Patch Φ · KOBLLUX NODE.FIELDS';
  const target = options.target || 'workflow/md/PATCH_PHI.md';
  const before = options.before || '';
  const core = runCore(input, { seal: false });
  const after = [
    `# ${title}`,
    '',
    `Lei: ${LAW}`,
    'Ciclo: 3 detectar → 6 integrar → 9 expandir → 7 selar',
    '',
    '## Entrada',
    String(input || '').trim(),
    '',
    '## POS',
    JSON.stringify(core.pos, null, 2),
    '',
    '## UNO/DUAL/TRINITY',
    JSON.stringify(core.trinity, null, 2),
    '',
    '## Aproximação de tokens',
    JSON.stringify(core.token_estimate, null, 2),
    '',
    '## Objeto-ferramenta',
    'Este patch Φ converte intenção em diff verificável: BLLUE escuta, KODUX estrutura, Solus sela, CADIAL distribui função e Aion preserva integridade temporal.',
    '',
    '## Saídas',
    '- HTML: presente em `outputs.html` no JSON do Core.',
    '- Python: presente em `outputs.python` no JSON do Core.',
    '- OBJ: presente em `outputs.obj` no JSON do Core.'
  ].join('\n');
  const patch = buildUnifiedPatch({ target, before, after, title });
  const seal_sha256 = sha256Hex(patch);
  return {
    status: 'PATCH_PHI_OK',
    law: LAW,
    target,
    title,
    token_estimate: approximateTokens(input),
    trinity: core.trinity,
    patch,
    seal_sha256,
    seal_ts: new Date().toISOString(),
    core
  };
}

function cadialWheel() {
  return Object.entries(CADIAL_ARCHETYPES).map(([nome, data], index) => ({
    index: index + 1,
    nome,
    ...data
  }));
}

function formatCadialCli() {
  return cadialWheel()
    .map(item => `[${item.nome}] ${item.essencia} → ${item.frase}`)
    .join('\n');
}

module.exports = {
  LAW,
  LAW_COMPACT,
  CADIAL_ARCHETYPES,
  approximateTokens,
  buildLog,
  buildPhiPatch,
  buildUnifiedPatch,
  cadialWheel,
  classifyText,
  emitHTML,
  emitOBJ,
  emitPython,
  formatCadialCli,
  mapTrinity,
  runCore,
  sealPayload,
  sha256Hex
};
