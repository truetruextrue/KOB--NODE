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
URL="http://${HOST}:${PORT}"
STATE_DIR="$ROOT/state/node_fields"
LOG_FILE="$STATE_DIR/cloudflared.log"

printf '∆³ KOBLLUX CLOUD 0x01 · preparando túnel para %s\n' "$URL"

if [ ! -d "$ROOT" ]; then
  printf 'Pasta não encontrada: %s\n' "$ROOT" >&2
  printf 'Clone/copie o repositório primeiro e rode: bash scripts/termux-node-fields-0x00.sh\n' >&2
  exit 1
fi

cd "$ROOT"
mkdir -p "$STATE_DIR"

if command -v pkg >/dev/null 2>&1; then
  pkg update -y
  pkg install -y curl ca-certificates
fi

if ! command -v cloudflared >/dev/null 2>&1; then
  printf 'cloudflared não encontrado. Tentando instalar via pkg...\n'
  if command -v pkg >/dev/null 2>&1 && pkg install -y cloudflared; then
    printf 'cloudflared instalado via pkg.\n'
  else
    printf 'pkg não instalou cloudflared. Tentando fallback via Go...\n'
    if command -v pkg >/dev/null 2>&1; then
      pkg install -y golang git
    fi
    export GOPATH="${GOPATH:-$HOME/go}"
    export PATH="$PATH:$GOPATH/bin"
    go install github.com/cloudflare/cloudflared/cmd/cloudflared@latest
  fi
fi

if ! command -v cloudflared >/dev/null 2>&1; then
  printf 'Não consegui encontrar cloudflared no PATH.\n' >&2
  printf 'Abra um novo Termux ou exporte PATH="$PATH:$HOME/go/bin" e rode novamente.\n' >&2
  exit 1
fi

if ! curl -fsS "$URL/health" >/dev/null; then
  cat >&2 <<MSG
NODE.FIELDS ainda não está respondendo em $URL.
Abra outro Termux e rode:
  cd "$ROOT" && ./activate-node-fields.sh
Depois volte aqui e rode novamente:
  bash scripts/termux-cloud-0x01.sh
MSG
  exit 1
fi

cat > "$STATE_DIR/cloud.env" <<ENV
export KOBLLUX_ROOT="$ROOT"
export NODE_FIELDS_HOST="$HOST"
export NODE_FIELDS_PORT="$PORT"
export NODE_FIELDS_LOCAL_URL="$URL"
export NODE_FIELDS_CLOUD_LOG="$LOG_FILE"
ENV

printf '\n∆³ NODE.FIELDS local confirmado. Abrindo Cloudflare Quick Tunnel...\n'
printf 'Quando aparecer a URL https://*.trycloudflare.com, copie ela para me chamar.\n'
printf 'Log: %s\n\n' "$LOG_FILE"

exec cloudflared tunnel --url "$URL" 2>&1 | tee "$LOG_FILE"
