#!/usr/bin/env bash
set -euo pipefail

if [ -n "${KOBLLUX_ROOT:-}" ]; then
  ROOT="$KOBLLUX_ROOT"
elif [ -f "$(pwd)/package.json" ]; then
  ROOT="$(pwd)"
else
  ROOT="$HOME/KOB--NODE"
fi

HOST="${NODE_FIELDS_HOST:-127.0.0.1}"
PORT="${NODE_FIELDS_PORT:-3697}"
LOCAL_URL="http://${HOST}:${PORT}"

cd "$ROOT"

cat <<MSG
KOBΦ-NODE.FIELDS contexto para Claude Code no Termux.
Arquivo Claude: CLAUDE.md
Comando para instalar/preparar Claude: bash scripts/termux-claude-code-0x01.sh
Comando para chamar Claude: ./call-claude-kobllux.sh
Local Health: ${LOCAL_URL}/health
Local Fields: ${LOCAL_URL}/fields
Local Core: ${LOCAL_URL}/core
Local CADIAL: ${LOCAL_URL}/cadial
Local UI: ${LOCAL_URL}/ui
Pulse log: state/node_fields/pulses.ndjson
Comando seguro Φ sem armazenar:
  npm run --silent phi -- --no-store "sua mensagem aqui"
Comando Core sem armazenar:
  npm run --silent core -- --no-store "sua semente aqui"
Objetivo: expandir sem subtrair, integrando BLLUE-KODUX-Solus, Roda Viva CADIAL, Claude Code e Core 3-6-9-7 como objeto-ferramenta verificável.
MSG
