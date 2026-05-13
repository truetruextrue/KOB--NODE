#!/usr/bin/env bash
# ∆7 PUSH KOBLLUX · Aplica preenchimento da árvore no KOBLLUX/KOBLLUX
# Uso: ./push_kobllux.sh <GITHUB_TOKEN>
# Ou:  export GITHUB_TOKEN=ghp_... && ./push_kobllux.sh
#
# Requer: token com permissão write no repo KOBLLUX/KOBLLUX
set -euo pipefail

TOKEN="${1:-${GITHUB_TOKEN:-}}"
BUNDLE="$(dirname "$0")/KOBLLUX_patch.bundle"
REPO="https://${TOKEN}@github.com/KOBLLUX/KOBLLUX.git"
TMPDIR_WORK="/tmp/KOBLLUX-push-$$"

if [ -z "$TOKEN" ]; then
  echo "❌ Token não fornecido."
  echo "   Uso: $0 ghp_SEU_TOKEN"
  echo "   Ou:  export GITHUB_TOKEN=ghp_... && $0"
  exit 1
fi

echo "∆³ Preparando push para KOBLLUX/KOBLLUX..."

# Clonar repo atual
git clone "$REPO" "$TMPDIR_WORK" 2>&1 | tail -1

# Aplicar bundle
cd "$TMPDIR_WORK"
git fetch "$BUNDLE" main:refs/remotes/bundle/main
git merge --no-ff refs/remotes/bundle/main \
  -m "CADIAL · Preencher arvore · 12 arquetipos + CORE + BRIDGE + TTS + _index" \
  || git cherry-pick FETCH_HEAD

# Push
git push origin main
echo "∆7 Árvore KOBLLUX publicada! 122 arquivos adicionados."

# Limpeza
rm -rf "$TMPDIR_WORK"
