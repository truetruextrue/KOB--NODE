#!/usr/bin/env bash
# launcher for the python monitor
export KOBLLUX_ROOT="${KOBLLUX_ROOT:-/sdcard/JESUS_VERBO/CODEX}"
export SLEEP_INTERVAL="${SLEEP_INTERVAL:-8}"
export INTRUSION_THRESHOLD="${INTRUSION_THRESHOLD:-5}"
export SUSPICIOUS_PATTERNS="payload,exploit,cmd.exe,hacker,.sh,.bin,.apk"
exec "${PYTHON_BIN:-python3}" "$(dirname "$0")/monitor.py"
