#!/data/data/com.termux/files/usr/bin/bash
# ============================================================
# KOBLLUX · CALL CLAUDE ∆³ · DUAL SOBRE
# Invoca Claude Code a partir do Termux (KOB--NODE)
# Identidade dual: truetruextrue (prim) + kodux78k (sobre)
# ============================================================

KOB_HOME="$HOME/KOB--NODE"
KOB_DUAL_STATE="$HOME/.kob-dual/.ativo"
Z="${*:-∆³ verificar vault CODEX e próximos passos}"

# Verificar claude CLI
if ! command -v claude &>/dev/null; then
    echo "[ERRO] Claude Code CLI não encontrado."
    echo "  npm install -g @anthropic-ai/claude-code"
    exit 1
fi

# Identidade ativa
IDENTIDADE=$(cat "$KOB_DUAL_STATE" 2>/dev/null || echo "truetruextrue")
NOME=$(git config --global user.name 2>/dev/null || echo "truetruextrue")
EMAIL=$(git config --global user.email 2>/dev/null || echo "kobllux@infodose.com.br")

echo "ᛜᛇᛟ KOBLLUX · CALL CLAUDE ∆³ · DUAL SOBRE"
echo "  Identidade : $NOME <$EMAIL>"
echo "  Modo dual  : $IDENTIDADE"
echo ""

# Garantir identidade
git config --global user.name "$NOME"
git config --global user.email "$EMAIL"

# Invocar Claude
cd "$KOB_HOME"
claude --print "$Z"
