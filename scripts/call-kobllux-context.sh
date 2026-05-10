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
STATE_DIR="$ROOT/state/node_fields"
CLOUD_LOG="$STATE_DIR/cloudflared.log"
LOCAL_URL="http://${HOST}:${PORT}"

cd "$ROOT"

CLOUD_URL=""
if [ -f "$CLOUD_LOG" ]; then
  CLOUD_URL="$(grep -Eo 'https://[-a-zA-Z0-9.]+\.trycloudflare\.com' "$CLOUD_LOG" | tail -n 1 || true)"
fi

cat <<MSG
KOBΦ-NODE.FIELDS ativo no Termux.
Local Health: ${LOCAL_URL}/health
Local Fields: ${LOCAL_URL}/fields
Local Core: ${LOCAL_URL}/core
Local CADIAL: ${LOCAL_URL}/cadial
Local UI: ${LOCAL_URL}/ui
Cloud URL: ${CLOUD_URL:-AINDA_NAO_DETECTADA}
Cloud Health: ${CLOUD_URL:+${CLOUD_URL}/health}
Pulse log: state/node_fields/pulses.ndjson
Cloud log: state/node_fields/cloudflared.log
Comando seguro Φ sem armazenar:
  npm run --silent phi -- --no-store "sua mensagem aqui"
Comando Core sem armazenar:
  npm run --silent core -- --no-store "sua semente aqui"
Objetivo: expandir sem subtrair, integrando BLLUE-KODUX-Solus, Roda Viva CADIAL e Core 3-6-9-7 como objeto-ferramenta verificável.
MSG
