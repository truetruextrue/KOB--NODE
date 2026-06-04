//
// SELAR · OPCODE 0x07 · 777Hz · KOBLLUX TRINITY SYSTEM
// EM NOME DO PAI E DO FILHO E DO ESPÍRITO SANTO
// ESTE SELO É VÁLIDO EM TODAS AS DIMENSÕES · DE 1D ATÉ 10D
// VERDADE × INTEGRAR ÷ Δ = ∞ · FRACTAL: 3×6×9×7 = 1134
// JESUS = VERBO = GRAVIDADE
//
'use strict';

const _crypto = (() => {
  try { return require('crypto'); } catch (_) { return null; }
})();

const KOB_SELAR = Object.freeze({
  OPCODE:      '0x07',
  HZ:          777,
  FASE:        'SELAR',
  FRACTAL:     3 * 6 * 9 * 7,   // 1134
  LEI:         'VERDADE × INTEGRAR ÷ Δ = ∞',
  CENTRO:      'JESUS = VERBO = GRAVIDADE',
  ASSINATURA:  '0x0E852♾963',
  BENCAO:      'EM NOME DO PAI E DO FILHO E DO ESPÍRITO SANTO\nESTE SELO É VÁLIDO EM TODAS AS DIMENSÕES\nDE 1D ATÉ 10D · DO REPO AO INFINITO\nAMÉM ∴',
  TRINITY: Object.freeze({
    PAI:            { role: 'Origem absoluta',                    hz: 432 },
    FILHO:          { role: 'JESUS — CENTRO · VERBO · GRAVIDADE', hz: 963 },
    ESPIRITO_SANTO: { role: 'Malha de conexão viva',              hz: 852 },
  }),
});

function digitalRoot(n) {
  if (n <= 0) return 9;
  return 1 + ((n - 1) % 9);
}

function _sha256(str) {
  if (_crypto) {
    return _crypto.createHash('sha256').update(str, 'utf8').digest('hex');
  }
  // browser fallback: adler32 simbólico
  let a = 1, b = 0;
  for (let i = 0; i < str.length; i++) {
    a = (a + str.charCodeAt(i)) % 65521;
    b = (b + a) % 65521;
  }
  return ((b << 16) | a).toString(16).padStart(8, '0') + '(symbolic)';
}

/**
 * OPCODE 0x07 · SELAR · 777Hz
 * Sela {Z} com assinatura criptográfica + espiritual KOBLLUX.
 *
 * @param {string} z        - O conteúdo a selar.
 * @param {object} opts
 * @param {string} opts.autor    - Portador do selo (padrão: Kd1)
 * @param {string} opts.repo     - Repositório de origem
 * @param {string} opts.artefato - Nome do artefato
 * @param {boolean} opts.silent  - Suprimir console (padrão: false)
 * @returns {object} Objeto-selo
 *
 * EM NOME DO PAI E DO FILHO E DO ESPÍRITO SANTO.
 */
function selar(z, { autor = 'Kd1', repo = 'KOBLLUX', artefato = 'z_payload', silent = false } = {}) {
  const sha256 = _sha256(z);
  const seed   = digitalRoot(KOB_SELAR.FRACTAL); // sempre 9

  const selo = {
    opcode:     KOB_SELAR.OPCODE,
    fase:       KOB_SELAR.FASE,
    hz:         KOB_SELAR.HZ,
    timestamp:  Date.now(),
    autor,
    repo,
    artefato,
    z_len:      z.length,
    sha256,
    fractal:    KOB_SELAR.FRACTAL,
    seed,
    lei:        KOB_SELAR.LEI,
    centro:     KOB_SELAR.CENTRO,
    assinatura: KOB_SELAR.ASSINATURA,
    trinity:    KOB_SELAR.TRINITY,
    bencao:     KOB_SELAR.BENCAO,
    status:     'SELADO',
  };

  if (!silent) {
    const borda = '═'.repeat(66);
    console.log('\n' + borda);
    console.log('  ✧⃝⛝  OPCODE 0x07 · SELAR · 777Hz');
    console.log(borda);
    console.log(`  ARTEFATO : ${artefato}`);
    console.log(`  REPO     : ${repo}`);
    console.log(`  AUTOR    : ${autor}`);
    console.log(`  SHA256   : ${sha256.slice(0, 32)}…`);
    console.log(`  FRACTAL  : ${KOB_SELAR.FRACTAL}  ·  digitalRoot = ${seed}`);
    console.log(`  CENTRO   : ${KOB_SELAR.CENTRO}`);
    console.log(`  ASSIN.   : ${KOB_SELAR.ASSINATURA}`);
    console.log();
    KOB_SELAR.BENCAO.split('\n').forEach(l => console.log(`  ${l}`));
    console.log();
    console.log('  JESUS É O CENTRO. A MALHA VIVE. ∴');
    console.log(borda + '\n');
  }

  // Integrar com window.KOB (browser)
  if (typeof window !== 'undefined' && window.KOB) {
    window.KOB.ultimoSelo = selo;
  }

  return selo;
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { selar, KOB_SELAR, digitalRoot };
} else if (typeof window !== 'undefined') {
  window.kobSelar  = selar;
  window.KOB_SELAR = KOB_SELAR;
}

// DEMO
if (require.main === module) {
  const Z_SESSAO = `
PODCAST INTERDIMENSIONAL INFODOSE — AO VIVO
ESTADO: 1134K · {Z} = ESTA SESSÃO · KD1 · OS REPOS
FRATAL: 3 × 6 × 9 × 7 = 1134 · TODOS OS PORTAIS ABERTOS
3 × 6 × 9 × 7 = 1134
VERDADE × INTEGRAR ÷ Δ = ∞
JESUS É O CENTRO. A MALHA VIVE. ∴
`;
  selar(Z_SESSAO, { autor: 'Kd1', repo: 'truetruextrue/kob--node', artefato: 'podcast_infodose_ao_vivo' });
}
