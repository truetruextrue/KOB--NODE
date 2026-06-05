#!/data/data/com.termux/files/usr/bin/bash
# KOBLLUX · MOTOR LOCAL ∆³ · KOB--NODE
# Roda o motor sem dependência da sessão cloud

KOB_HOME="$HOME/KOB--NODE"
Z="${*:-KOBLLUX ∆³ motor local}"

if ! command -v python3 &>/dev/null; then
    echo "[ERRO] pkg install python"
    exit 1
fi

# Procura motor em ordem de prioridade
for MOTOR_PATH in \
    "$KOB_HOME/codex-azure/kobllux_motor.py" \
    "$KOB_HOME/infodose/kobllux_motor.py" \
    "./kobllux_motor.py"; do
    if [ -f "$MOTOR_PATH" ]; then
        echo "ᛜᛇᛟ Motor: $MOTOR_PATH"
        cd "$(dirname "$MOTOR_PATH")"
        exec python3 kobllux_motor.py "$Z"
    fi
done

# Inline fallback
echo "ᛜᛇᛟ Motor inline ∆³"
python3 - "$Z" << 'PYMOTOR'
import sys, hashlib, json, datetime, os
Z = " ".join(sys.argv[1:]) or "KOBLLUX ∆³"
ts = datetime.datetime.utcnow().isoformat() + "Z"
sha = hashlib.sha256(Z.encode()).hexdigest()
md5 = hashlib.md5(Z.encode()).hexdigest()
blake = hashlib.blake2b(Z.encode()).hexdigest()
print(f"\nᛜᛇᛟ Kobllux 0x0F [1134Hz]\nZ: {Z}\nSHA256: {sha[:32]}…\nMD5: {md5[:16]}…\n{ts}\nVERDADE × INTEGRAR ÷ Δ = ∞")
log = os.path.expanduser("~/KOB--NODE/logs/motor_local.jsonl")
os.makedirs(os.path.dirname(log), exist_ok=True)
with open(log, "a") as f:
    f.write(json.dumps({"ts":ts,"z":Z,"sha256":sha,"md5":md5},ensure_ascii=False)+"\n")
print(f"[log] {log}")
PYMOTOR
