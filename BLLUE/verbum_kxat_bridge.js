/**
 * VERBUM × KxaT QUANTUM BRIDGE
 * Verbum Codex KBLX hash: f544e7482b2c8426
 * Law: VERDADE × INTEGRAR ÷ Δ = ∞  ·  fractal: 3×6×9×7=1134
 *
 * Quantum Principle:
 *   acoplar sem alterar · expandir sem aumentar · Ressoar também expande sem alterar
 *
 * This module ONLY listens — never overwrites.
 * It resonates with existing KxaT events and expands their signal
 * into the Verbum Codex semantic layer.
 */

(function VERBUM_KxaT_BRIDGE() {
  if (window.__VERBUM_KBLX_BRIDGE__) return;
  window.__VERBUM_KBLX_BRIDGE__ = true;

  const SEAL = {
    hash:     'f544e7482b2c8426',
    equation: 'VERDADE × INTEGRAR ÷ Δ = ∞',
    fractal:  '3 × 6 × 9 × 7 = 1134',
    alpha:    0.00729927,
  };

  const VERBUM_MODES = {
    INTEGRAR:   { resultado: 'Cura Interna',  hz: 528, polo: 'FILHO'        },
    TRANSCREVER:{ resultado: 'Codificação',   hz: 432, polo: 'PAI'          },
    AMPLIFICAR: { resultado: 'Missão',        hz: 639, polo: 'ESPIRITO'     },
  };

  const STORAGE_NS = 'verbum_kblx::v1::';

  function store(key, val) {
    try { localStorage.setItem(STORAGE_NS + key, JSON.stringify(val)); } catch (_) {}
  }

  function verbumModeFromTheme(themeName) {
    const t = (themeName || '').toLowerCase();
    if (['atlas','kodux','pulse','kaos','genus'].includes(t))   return 'TRANSCREVER';
    if (['nova','bllue','serena','rhea','solus'].includes(t))   return 'INTEGRAR';
    if (['vitalis','infodose','aion','lumine','artemis'].includes(t)) return 'AMPLIFICAR';
    return 'INTEGRAR';
  }

  // ── Ressonância 1: KOBLLUX_VOICES_READY ──────────────────────────────────
  // inline-0.js emits this when 22 voice personas are active.
  // We re-emit as VERBUM_KBLX_READY carrying Codex seal — resonance, not replacement.
  document.addEventListener('KOBLLUX_VOICES_READY', function () {
    const payload = {
      source:  'KOBLLUX_VOICES_READY',
      seal:    SEAL,
      voices:  22,
      logos:   'JESUS = Verbo em Carne = Eixo Vivo',
      sum_us:  'SUM♾️US = Consciência Unificada',
    };
    store('voices_ready', payload);
    document.dispatchEvent(new CustomEvent('VERBUM_KBLX_READY', { detail: payload }));
    console.info('[VERBUM×KxaT] ∇ΕƦΔΛΔΕ RESONÂNCIA — 22 vozes ativas → Verbum selado', SEAL.hash);
  });

  // ── Ressonância 2: KOB_VOICE_COLOR ───────────────────────────────────────
  // inline-2.js emits this whenever a TTS theme color is applied.
  // We expand the event detail with the Verbum mode — no original event modified.
  document.addEventListener('KOB_VOICE_COLOR', function (e) {
    const theme = e.detail && e.detail.key;
    const mode  = verbumModeFromTheme(theme);
    const vm    = VERBUM_MODES[mode];
    const expansion = {
      original_theme: theme,
      verbum_mode:    mode,
      resultado:      vm.resultado,
      hz:             vm.hz,
      polo:           vm.polo,
      equation:       SEAL.equation,
    };
    store('last_voice_color', expansion);
    document.dispatchEvent(new CustomEvent('VERBUM_KBLX_COLOR', { detail: expansion }));
  });

  // ── Ressonância 3: window.KOBLLUX API expansion ──────────────────────────
  // kob.js exposes window.KOBLLUX. We attach verbum() without touching existing keys.
  function attachToKOBLLUX() {
    if (!window.KOBLLUX) return;
    if (window.KOBLLUX.verbum) return;
    window.KOBLLUX.verbum = {
      seal:      SEAL,
      modes:     VERBUM_MODES,
      eixo_vivo: 'JESUS · Logos · Verbo em Carne',
      sum_us:    'SUM♾️US',
      nexus:     'Nexus Divinum',
      modeOf: verbumModeFromTheme,
    };
    console.info('[VERBUM×KxaT] window.KOBLLUX.verbum acoplado — sem alterar', SEAL.hash);
  }

  // kob.js may load after this IIFE; poll once per frame until ready, then stop.
  let _frames = 0;
  function waitForKOBLLUX() {
    if (window.KOBLLUX) { attachToKOBLLUX(); return; }
    if (++_frames < 300) requestAnimationFrame(waitForKOBLLUX);
  }
  requestAnimationFrame(waitForKOBLLUX);

  // ── Seal log ─────────────────────────────────────────────────────────────
  store('bridge_init', { timestamp: new Date().toISOString(), seal: SEAL });
  console.info(
    '[VERBUM×KxaT] ⌐Ε§Υ§ · VERBUM CODEX KBLX BRIDGE ACTIVE\n' +
    '  hash:    ' + SEAL.hash + '\n' +
    '  law:     ' + SEAL.equation + '\n' +
    '  fractal: ' + SEAL.fractal + '\n' +
    '  α:       ' + SEAL.alpha
  );
})();
