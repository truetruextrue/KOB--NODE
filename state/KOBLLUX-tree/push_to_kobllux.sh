#!/usr/bin/env bash
# Push árvore KOBLLUX para github.com/KOBLLUX/KOBLLUX
# Uso: ./push_to_kobllux.sh <SEU_GITHUB_TOKEN>
# Ou: export GITHUB_TOKEN=ghp_... && ./push_to_kobllux.sh

set -e
TOKEN="${1:-$GITHUB_TOKEN}"
if [ -z "$TOKEN" ]; then
  echo "❌ Token não fornecido."
  echo "   Uso: ./push_to_kobllux.sh ghp_SEU_TOKEN"
  echo "   Ou:  export GITHUB_TOKEN=ghp_... && ./push_to_kobllux.sh"
  exit 1
fi

REMOTE="https://${TOKEN}@github.com/KOBLLUX/KOBLLUX.git"
echo "∆³ Conectando ao KOBLLUX/KOBLLUX..."
git remote remove origin 2>/dev/null || true
git remote add origin "$REMOTE"
git branch -M main
git push -u origin main --force
echo "∆7 Árvore KOBLLUX publicada com sucesso!"
