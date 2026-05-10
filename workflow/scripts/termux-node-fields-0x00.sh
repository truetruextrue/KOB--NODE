#!/usr/bin/env bash
set -euo pipefail

ROOT="${KOBLLUX_ROOT:-$HOME/KOB--NODE}"
PORT="${NODE_FIELDS_PORT:-3697}"
HOST="${NODE_FIELDS_HOST:-127.0.0.1}"

printf '∆³ Preparando NODE.FIELDS em %s\n' "$ROOT"

if command -v pkg >/dev/null 2>&1; then
  pkg update -y
  pkg install -y nodejs git termux-api
fi

if [ ! -d "$ROOT" ]; then
  mkdir -p "$ROOT"
fi

cd "$ROOT"

if [ ! -f package.json ]; then
  cat >&2 <<MSG
package.json não encontrado em $ROOT.
Clone ou copie este repositório para o Termux antes de ativar:
  git clone <URL_DO_REPO> "$ROOT"
MSG
  exit 1
fi

npm install --ignore-scripts
npm run build

mkdir -p "$ROOT/state/node_fields"
cat > "$ROOT/state/node_fields/termux.env" <<ENV
export KOBLLUX_ROOT="$ROOT"
export NODE_FIELDS_HOST="$HOST"
export NODE_FIELDS_PORT="$PORT"
ENV

cat > "$ROOT/activate-node-fields.sh" <<'RUNNER'
#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/state/node_fields/termux.env"
cd "$KOBLLUX_ROOT"
exec npm run node:fields
RUNNER
chmod +x "$ROOT/activate-node-fields.sh"

printf '\n∆³ NODE.FIELDS configurado. Para ativar:\n'
printf '  cd %s && ./activate-node-fields.sh\n' "$ROOT"
printf '\nHealth check esperado:\n'
printf '  curl http://%s:%s/health\n' "$HOST" "$PORT"
