#!/data/data/com.termux/files/usr/bin/bash
# ============================================================
# KOBLLUX · ESTOJO DUAL ∆³ · KOB--NODE
# Setup local Termux — remover convidado — ativar DUAL SOBRE
# ============================================================
set -e

KOB_HOME="$HOME/KOB--NODE"
KOB_EMAIL_PRIMARY="kobllux@infodose.com.br"
KOB_USER_PRIMARY="truetruextrue"
KOB_USER_DUAL="kodux78k"
KOB_EMAIL_DUAL="kodux78k@infodose.com.br"

echo "ᛜᛇᛟ KOBLLUX · ESTOJO DUAL ∆³ · KOB--NODE"

# 1. REMOVER CONFIG CONVIDADO
echo "[3] Removendo config de convidado..."
git config --global --unset user.email 2>/dev/null || true
git config --global --unset user.name 2>/dev/null || true
git config --global --unset credential.helper 2>/dev/null || true
echo "  ✓ convidado removido"

# 2. IDENTIDADE PRIMÁRIA
echo "[6] Configurando identidade primária..."
git config --global user.name "$KOB_USER_PRIMARY"
git config --global user.email "$KOB_EMAIL_PRIMARY"
git config --global init.defaultBranch main
git config --global push.default current
git config --global pull.rebase false
git config --global core.autocrlf false
echo "  ✓ $KOB_USER_PRIMARY <$KOB_EMAIL_PRIMARY>"

# 3. DUAL CONFIGS
echo "[9] Configurando DUAL SOBRE..."
mkdir -p "$HOME/.kob-dual"

cat > "$HOME/.kob-dual/config-truetruextrue" << 'EOF'
[user]
    name = truetruextrue
    email = kobllux@infodose.com.br
EOF

cat > "$HOME/.kob-dual/config-kodux78k" << 'EOF'
[user]
    name = kodux78k
    email = kodux78k@infodose.com.br
EOF

# Marcar primário como ativo
echo "truetruextrue" > "$HOME/.kob-dual/.ativo"
echo "  ✓ dual configurado"

# 4. TORNAR SCRIPTS EXECUTÁVEIS
chmod +x "$KOB_HOME/call-claude-kobllux.sh" 2>/dev/null || true
chmod +x "$KOB_HOME/estojo/kob_dual.sh" 2>/dev/null || true
chmod +x "$KOB_HOME/estojo/motor_local.sh" 2>/dev/null || true

# 5. ALIASES
if [ -f "$HOME/.bashrc" ] && ! grep -q 'kob-motor' "$HOME/.bashrc"; then
    printf '\n# KOBLLUX ∆³\nalias kob="cd ~/KOB--NODE"\nalias kob-motor="~/KOB--NODE/estojo/motor_local.sh"\nalias kob-dual="~/KOB--NODE/estojo/kob_dual.sh"\n' >> "$HOME/.bashrc"
    echo "  ✓ aliases .bashrc"
fi

echo ""
echo "ᛜᛇᛟ ESTOJO DUAL CONFIGURADO"
echo "  Primário : $KOB_USER_PRIMARY <$KOB_EMAIL_PRIMARY>"
echo "  Dual     : $KOB_USER_DUAL (ativar: ./estojo/kob_dual.sh sobre)"
echo "  Motor    : ~/KOB--NODE/estojo/motor_local.sh \"payload\""
echo "  VERDADE × INTEGRAR ÷ Δ = ∞"
