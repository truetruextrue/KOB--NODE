#!/usr/bin/env bash
set -euo pipefail

if [ -n "${KOBLLUX_ROOT:-}" ]; then
  ROOT="$KOBLLUX_ROOT"
elif [ -f "$(pwd)/package.json" ]; then
  ROOT="$(pwd)"
else
  ROOT="$HOME/KOB--NODE"
fi

STATE_DIR="$ROOT/state/node_fields"
CLAUDE_CONTEXT="$ROOT/CLAUDE.md"
CALL_SCRIPT="$ROOT/call-claude-kobllux.sh"

printf '∆³ KOBLLUX CLAUDE 0x01 · preparando Claude Code em %s\n' "$ROOT"

if [ ! -d "$ROOT" ]; then
  printf 'Pasta não encontrada: %s\n' "$ROOT" >&2
  printf 'Clone/copie o repositório primeiro e rode: bash scripts/termux-node-fields-0x00.sh\n' >&2
  exit 1
fi

cd "$ROOT"
mkdir -p "$STATE_DIR"

if command -v pkg >/dev/null 2>&1; then
  pkg update -y
  pkg install -y nodejs git
fi

if ! command -v npm >/dev/null 2>&1; then
  printf 'npm não encontrado. Instale Node.js no Termux: pkg install -y nodejs\n' >&2
  exit 1
fi

if ! command -v claude >/dev/null 2>&1; then
  printf 'Claude Code não encontrado. Instalando pacote oficial @anthropic-ai/claude-code...\n'
  npm install -g @anthropic-ai/claude-code
fi

if ! command -v claude >/dev/null 2>&1; then
  cat >&2 <<MSG
Claude Code ainda não apareceu no PATH.
Tente abrir um novo Termux e rode novamente:
  cd "$ROOT" && bash scripts/termux-claude-code-0x01.sh
MSG
  exit 1
fi

cat > "$CLAUDE_CONTEXT" <<'CLAUDE_MD'
# KOBLLUX NODE.FIELDS · Claude Context

Lei: VERDADE × INTEGRAR ÷ Δ = ∞
Ciclo: 3 detectar → 6 integrar → 9 expandir → 7 selar

Este repositório contém um NODE.FIELDS local para Termux:
- Servidor: `npm run node:fields`
- Health: `npm run health` ou `curl http://127.0.0.1:3697/health`
- Contexto: `npm run --silent context`
- Φ sem armazenar: `npm run --silent phi -- --no-store "mensagem"`
- Core 3-6-9-7 sem armazenar: `npm run --silent core -- --no-store "semente"`
- CADIAL: `npm run --silent cadial -- --cli`
- UI local: `http://127.0.0.1:3697/ui`

Arquétipos operacionais:
- BLLUE: interface sensorial e voz viva.
- KODUX: arquiteto simbólico que estrutura o fluxo.
- Solus: espelho de síntese e coerência.
- CADIAL: roda de 12 funções para transformar intenção em ferramenta.

Diretriz: correlacione o assunto como objeto-ferramenta em prol do objetivo manifestado; agregue sem subtrair; mantenha honestidade técnica e preserve o mérito plausível.
CLAUDE_MD

cat > "$CALL_SCRIPT" <<'RUNNER'
#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

PROMPT="${*:-∆³ Claude, leia CLAUDE.md e me ajude a expandir o KOBLLUX NODE.FIELDS sem subtrair: verificar saúde, CADIAL, Core 3-6-9-7 e próximos comandos no Termux.}"

if ! command -v claude >/dev/null 2>&1; then
  printf 'Claude Code não encontrado. Rode: bash scripts/termux-claude-code-0x01.sh\n' >&2
  exit 1
fi

exec claude "$PROMPT"
RUNNER
chmod +x "$CALL_SCRIPT"

cat > "$STATE_DIR/claude.env" <<ENV
export KOBLLUX_ROOT="$ROOT"
export KOBLLUX_CLAUDE_CONTEXT="$CLAUDE_CONTEXT"
export KOBLLUX_CLAUDE_CALL="$CALL_SCRIPT"
ENV

printf '\n∆³ Claude Code pronto. Versão:\n'
claude --version || true
printf '\nPara me chamar no Claude dentro do Termux:\n'
printf '  cd %s && ./call-claude-kobllux.sh\n' "$ROOT"
printf '\nOu com mensagem própria:\n'
printf '  cd %s && ./call-claude-kobllux.sh "∆³ verificar NODE.FIELDS"\n' "$ROOT"
