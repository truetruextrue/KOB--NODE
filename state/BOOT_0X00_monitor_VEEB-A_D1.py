#!/usr/bin/env python3
# monitor.py - scans directories, computes hashes, detects changes, generates images from ASCII seeds,
# updates prompts base and flags suspicious events.
import os, sys, time, json, hashlib, traceback
from pathlib import Path

try:
    from PIL import Image
except Exception:
    Image = None

ROOT = os.environ.get("KOBLLUX_ROOT", "/sdcard/JESUS_VERBO/CODEX")
STATE_DB = os.path.join(ROOT, "state", "state_db.json")
PROMPT_BASE = os.path.join(ROOT, "state", "prompts.txt")
OUTPUTS_DIR = os.path.join(ROOT, "outputs")
LOG_FILE = os.path.join(ROOT, "logs", "kobllux_watch.log")
MONITOR_PATHS = [ROOT, "/sdcard"]
SLEEP_INTERVAL = int(os.environ.get("SLEEP_INTERVAL", "8"))
INTRUSION_THRESHOLD = int(os.environ.get("INTRUSION_THRESHOLD", "5"))
SUSPICIOUS_PATTERNS = os.environ.get("SUSPICIOUS_PATTERNS","payload,exploit,cmd.exe,hacker,.sh,.bin,.apk").split(",")

ASCII_SEEDS = {
    "SCI_ART_seed_2963847": [
"   █▒▒ ▒ ▒ █ ██▒█▒██ █ ▒ ▒ ▒▒█   ",
" █▒ ▒▒█ ██▒▒██▒█▒█▒██▒▒██ █▒▒ ▒█ ",
"█ ▒▒█▒   ▒█  ▒ █ █ ▒  █▒   ▒█▒▒ █",
"▒▒ ▒████  █▒████▒████▒█  ████▒ ▒▒",
"  █ ██▒▒▒██ ▒ ██▒██ ▒ ██▒▒▒██ █  ",
"▒▒█ ▒    █▒█▒█▒▒ ▒▒█▒█▒█    ▒ █▒▒",
"██   ▒▒▒▒▒▒▒█▒ ▒█▒ ▒█▒▒▒▒▒▒▒   ██",
"███▒▒ ▒█ █▒▒   █▒█   ▒▒█ █▒ ▒▒███",
"█ ▒▒ █ ▒██ █ ▒ ▒█▒ ▒ █ ██▒ █ ▒▒ █",
"▒█  ▒ █▒█ ▒ ▒█▒   ▒█▒ ▒ █▒█ ▒  █▒",
"▒ ▒█  █▒▒  █   █ █   █  ▒▒█  █▒ ▒",
" ██ ▒ ▒▒█ ▒ █▒█▒▒▒█▒█ ▒ █▒▒ ▒ ██ ",
"████ █▒▒████ ▒ █▒█ ▒ ████▒▒█ ████",
"  ▒▒█▒▒   ▒██ ██▒██ ██▒   ▒▒█▒▒  ",
"  ▒█ ▒   █▒▒ █▒▒ ▒▒█ ▒▒█   ▒ █▒  ",
" ▒█▒ ▒ █ █▒██   ▒   ██▒█ █ ▒ ▒█▒ ",
"  ▒█ ▒█▒▒▒█▒█▒▒▒ ▒▒▒█▒█▒▒▒█▒ █▒  ",
" ▒█▒ ▒ █ █▒██   ▒   ██▒█ █ ▒ ▒█▒ ",
"  ▒█ ▒   █▒▒ █▒▒ ▒▒█ ▒▒█   ▒ █▒  ",
"  ▒▒█▒▒   ▒██ ██▒██ ██▒   ▒▒█▒▒  ",
"████ █▒▒████ ▒ █▒█ ▒ ████▒▒█ ████",
" ██ ▒ ▒▒█ ▒ █▒█▒▒▒█▒█ ▒ █▒▒ ▒ ██ ",
"▒ ▒█  █▒▒  █   █ █   █  ▒▒█  █▒ ▒",
"▒█  ▒ █▒█ ▒ ▒█▒   ▒█▒ ▒ █▒█ ▒  █▒",
"█ ▒▒ █ ▒██ █ ▒ ▒█▒ ▒ █ ██▒ █ ▒▒ █",
"███▒▒ ▒█ █▒▒   █▒█   ▒▒█ █▒ ▒▒███",
"██   ▒▒▒▒▒▒▒█▒ ▒█▒ ▒█▒▒▒▒▒▒▒   ██",
"▒▒█ ▒    █▒█▒█▒▒ ▒▒█▒█▒█    ▒ █▒▒",
"  █ ██▒▒▒██ ▒ ██▒██ ▒ ██▒▒▒██ █  ",
"▒▒ ▒████  █▒████▒████▒█  ████▒ ▒▒",
"█ ▒▒█▒   ▒█  ▒ █ █ ▒  █▒   ▒█▒▒ █",
" █▒ ▒▒█ ██▒▒██▒█▒█▒██▒▒██ █▒▒ ▒█ ",
"   █▒▒ ▒ ▒ █ ██▒█▒██ █ ▒ ▒ ▒▒█   "
    ],
    # você pode adicionar outros seeds aqui...
}

def log(msg):
    ts = time.strftime("%Y-%m-%dT%H:%M:%S%z")
    s = f"{ts} | {msg}\n"
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(s)
    except Exception:
        pass
    print(s, end="")

def md5_for_file(path, block_size=65536):
    md5 = hashlib.md5()
    try:
        with open(path, "rb") as f:
            for chunk in iter(lambda: f.read(block_size), b''):
                md5.update(chunk)
        return md5.hexdigest()
    except Exception:
        return None

def load_state():
    if os.path.exists(STATE_DB):
        try:
            with open(STATE_DB, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {"files": {}}
    return {"files": {}}

def save_state(state):
    with open(STATE_DB, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2, ensure_ascii=False)

def scan_paths():
    found = {}
    for base in MONITOR_PATHS:
        for root, dirs, files in os.walk(base):
            # evitar varrer /proc /sys e ocultos que causem loops
            if root.startswith("/proc") or root.startswith("/sys") or "/Android/data" in root:
                continue
            for fn in files:
                full = os.path.join(root, fn)
                try:
                    st = os.path.getsize(full)
                except Exception:
                    continue
                # consider only images and text/scripts for analysis
                lower = fn.lower()
                if any(lower.endswith(ext) for ext in (".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp", ".txt", ".py", ".sh", ".js", ".html", ".apk", ".bin")):
                    found[full] = {"size": st, "name": fn}
    return found

def generate_png_from_ascii(seed_name, ascii_lines, outpath):
    if Image is None:
        log("Pillow não disponível, ignorando geração de PNG.")
        return False
    try:
        w = max(len(line) for line in ascii_lines)
        h = len(ascii_lines)
        img = Image.new("L", (w, h), color=255)
        pixels = img.load()
        for y, line in enumerate(ascii_lines):
            for x, ch in enumerate(line):
                if ch == "█":
                    pixels[x,y] = 0
                elif ch == "▒":
                    pixels[x,y] = 128
                else:
                    pixels[x,y] = 255
        img = img.resize((w*8, h*8), Image.NEAREST)
        img.save(outpath)
        return True
    except Exception as e:
        log(f"Erro ao gerar PNG seed {seed_name}: {e}")
        return False

def append_prompt(event_type, path):
    try:
        with open(PROMPT_BASE, "a", encoding="utf-8") as f:
            f.write(f"{time.strftime('%Y-%m-%dT%H:%M:%S%z')} | {event_type} | {path}\n")
    except Exception:
        pass

def is_suspicious(name):
    n = name.lower()
    for p in SUSPICIOUS_PATTERNS:
        if p.strip() and p.strip() in n:
            return True
    return False

def main_loop():
    state = load_state()
    last_events = []
    while True:
        try:
            found = scan_paths()
            new_state_files = {}
            added = []
            removed = []
            modified = []
            for path, meta in found.items():
                md5 = md5_for_file(path)
                new_state_files[path] = {"md5": md5, "size": meta["size"], "name": meta["name"], "ts": time.time()}
                old = state.get("files", {}).get(path)
                if old is None:
                    added.append(path)
                else:
                    if old.get("md5") != md5:
                        modified.append(path)
            # detect removed
            for path in list(state.get("files", {}).keys()):
                if path not in new_state_files:
                    removed.append(path)

            # log events
            if added or modified or removed:
                if added:
                    for p in added:
                        log(f"ADDED: {p}")
                        append_prompt("ADDED", p)
                if modified:
                    for p in modified:
                        log(f"MODIFIED: {p}")
                        append_prompt("MODIFIED", p)
                if removed:
                    for p in removed:
                        log(f"REMOVED: {p}")
                        append_prompt("REMOVED", p)

            # generate PNGs from seeds once per run if not existing
            for seed_name, ascii_lines in ASCII_SEEDS.items():
                outpng = os.path.join(OUTPUTS_DIR, f"{seed_name}.png")
                if not os.path.exists(outpng):
                    ok = generate_png_from_ascii(seed_name, ascii_lines, outpng)
                    if ok:
                        log(f"Seed PNG gerado: {outpng}")
                        append_prompt("SEED_GEN", outpng)

            # intrusion heuristics: muitos arquivos adicionados / nomes suspeitos
            recent_added = added[-(INTRUSION_THRESHOLD*2):] if added else []
            suspicious = [p for p in (added+modified) if is_suspicious(os.path.basename(p))]
            if len(added) >= INTRUSION_THRESHOLD or len(recent_added) >= INTRUSION_THRESHOLD or suspicious:
                msg = f"POSSÍVEL INTRUSÃO: added={len(added)}, modified={len(modified)}, suspicious={len(suspicious)}"
                log(msg)
                append_prompt("ALERT_INTRUSION", msg)
                # write a lightweight incident file
                incident_path = os.path.join(ROOT, "state", f"incident_{int(time.time())}.txt")
                with open(incident_path, "w", encoding="utf-8") as f:
                    f.write(msg + "\n")
                    for p in (suspicious or recently_added if 'recently_added' in locals() else suspicious):
                        f.write(p + "\n")

            # update state and sleep
            state["files"] = new_state_files
            save_state(state)

            time.sleep(SLEEP_INTERVAL)
        except KeyboardInterrupt:
            log("Monitor interrompido pelo usuário.")
            break
        except Exception as e:
            log("Erro no loop: " + str(e) + "\n" + traceback.format_exc())
            time.sleep(SLEEP_INTERVAL)

if __name__ == "__main__":
    log("Monitor iniciado - KOBLLUX")
    main_loop()
