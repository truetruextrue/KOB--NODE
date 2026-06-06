#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
KOBLLUX • PIPELINE RUNNER — arquivo único (TXT ou JSON)
Uso: python3 bin/kobllux_run_single.py --file workflow/txt/arquivo.txt
"""
import sys, os, re, json, argparse, hashlib, random
from datetime import datetime
from collections import Counter
from pathlib import Path

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

TRI_CHARS = {0: " ", 1: "█", 2: "▒"}

# ─────────────────────────────────────────────
def safe_name(filename):
    stem = Path(filename).stem
    clean = re.sub(r"[^\w\s-]", "", stem, flags=re.UNICODE)
    clean = re.sub(r"\s+", "_", clean.strip())
    return re.sub(r"_+", "_", clean)[:60] or "run"

def read_file(path):
    if not os.path.isfile(path):
        return ""
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        raw = f.read()
    if path.endswith(".json"):
        try:
            data = json.loads(raw)
            parts = []
            def extract(obj):
                if isinstance(obj, str): parts.append(obj)
                elif isinstance(obj, (list, tuple)):
                    for i in obj: extract(i)
                elif isinstance(obj, dict):
                    for v in obj.values(): extract(v)
            extract(data)
            return "\n".join(parts)
        except Exception:
            return raw
    return raw

def mirror_text(txt):
    return "\n".join(line[::-1] for line in txt.splitlines())

# ─── M1 ───────────────────────────────────────
def run_m1(src_d, src_m):
    def cnt(t):
        return {
            "letters":   len(re.findall(r"[a-zA-ZÀ-ſ]", t)),
            "digits":    len(re.findall(r"\d", t)),
            "words":     len(re.findall(r"\b\w+\b", t, flags=re.UNICODE)),
            "lines":     len(t.splitlines()),
            "sentences": len(re.findall(r"[.!?]+(?=\s|$)", t)) or t.count("\n\n"),
        }
    return {"timestamp": datetime.now().isoformat(),
            "direct": cnt(src_d), "mirror": cnt(src_m), "seal": "∆7_DETECTAR"}

# ─── M2 ───────────────────────────────────────
STOP_PT = {"de","do","da","que","em","um","uma","para","no","na","os","as","é",
           "e","a","o","com","por","se","não","mas","ao","dos","das","nos"}
DIAC_PT = "áàâãéêíóôõúç"

def run_m2(src_d, m1):
    tokens = [w.lower() for w in re.findall(r"\b\w+\b", src_d, flags=re.UNICODE)]
    tset   = set(tokens)
    pt     = sum(1 for w in tset if w in STOP_PT) + sum(1 for c in DIAC_PT if c in "".join(tset))
    return {"timestamp": datetime.now().isoformat(),
            "m1_context": {"words_direct": m1["direct"]["words"]},
            "language_score": {"pt_score": pt, "token_count": len(tokens)},
            "integration_focus": "Correlacionar camadas e unir sentido (KODUX ETL Engine)",
            "seal": "∆7_INTEGRAR"}

# ─── M3 ───────────────────────────────────────
SYM_MATH   = set("+-=×÷*/^()[]{}∆∞♾∴∵<>≥≤±%")
SYM_ARROWS = set("→←↔↕⇄⇆⇒⇐⇔↑↓")
SYM_BOX    = set("╔═╗║╚╝╩╦╠╣╬█▀▄▌▐")
SYM_STARS  = set("★☆✦✧✪✫✬✭✮✯")
SYM_SEAL   = set("∆⁷♾")

def run_m3(src_d, src_m):
    def csym(t):
        c = Counter()
        for ch in t:
            if ch in SYM_MATH:   c["math"]   += 1
            if ch in SYM_ARROWS: c["arrows"] += 1
            if ch in SYM_BOX:    c["box"]    += 1
            if ch in SYM_STARS:  c["stars"]  += 1
            if ch in SYM_SEAL:   c["seal"]   += 1
        return dict(c)
    def pat(t):
        return {
            "A": bool(re.search(r"\b1{2,}\b", t) and re.search(r"\b9\s*×\s*[\d\s]+", t)),
            "B": bool(re.search(r"8{3,}\s*=\s*.*\+\s*9\s*×\s*.*89", t)),
            "C": bool(re.search(r"\b12321\b|\b1234321\b|\b123454321\b", t)),
            "D": bool(re.search(r"9{2,}\s*×\s*9{2,}", t) or re.search(r"10+0+\s*8+9+", t)),
        }
    return {"timestamp": datetime.now().isoformat(),
            "symbols":  {"direct": csym(src_d), "mirror": csym(src_m)},
            "patterns": {"direct": pat(src_d),  "mirror": pat(src_m)},
            "seal": "∆7",
            "synthesis": {"law": "VERDADE × INTEGRAR ÷ Δ = ♾️",
                          "interdependence": ["M1→M2→M3 selam ∆⁷"]}}

# ─── M4 ───────────────────────────────────────
def run_m4(src_d, src_m, m1, m2, size=33):
    h = hashlib.sha256()
    for c in [src_d, src_m, json.dumps(m1), json.dumps(m2)]:
        if c: h.update(c.encode("utf-8", errors="ignore"))
    seed = int(h.hexdigest(), 16) & ((1 << 63) - 1)

    def dr(n):
        while n >= 10: n = sum(int(d) for d in str(n))
        return n

    if size % 2 == 0: size += 1
    rng  = random.Random(seed)
    half = size // 2
    raw  = [None] * size
    for r in range(size):
        rh  = [rng.randrange(0, 3) for _ in range(half)]
        raw[r] = rh + [rng.randrange(0, 3)] + rh[::-1]
    grid = [None] * size
    for r in range(half + 1):
        grid[r] = raw[r]
        if r < half: grid[size - 1 - r] = raw[r]

    tri   = "\n".join(" ".join(map(str, row)) for row in grid)
    ascii_art = "\n".join("".join(TRI_CHARS[v] for v in row) for row in grid)

    report = {"timestamp": datetime.now().isoformat(), "size": size,
              "seed": seed, "digital_root": dr(seed),
              "encoding": {"0": "PAI( )", "1": "FILHO(█)", "2": "ESPÍRITO(▒)"},
              "pal_h": True, "pal_v": True, "seal": "∆7_EXPANDIR", "loop": "3×6×9×7"}
    return report, tri, ascii_art, grid

# ─── M5 ───────────────────────────────────────
def run_m5(src_d, m3):
    mir = "\n".join(line[::-1] for line in src_d.splitlines())
    def cb(t):
        return {"letters":   len(re.findall(r"\S", t, flags=re.UNICODE)),
                "words":     len(re.findall(r"\b\w+\b", t, flags=re.UNICODE)),
                "sentences": len(re.findall(r"[.!?]+(?=\s|$)", t)) or t.count("\n\n")}
    pat_d = m3["patterns"]["direct"]
    pat_m = m3["patterns"]["mirror"]
    cd, cm = cb(src_d), cb(mir)
    return {"timestamp": datetime.now().isoformat(),
            "counts":   {"direct": cd, "mirror": cm},
            "patterns": {"direct": pat_d, "mirror": pat_m},
            "thesis_antithesis": {
                "direct": {"thesis": len(re.findall(r"\b[A-D]\s*§", src_d)), "antithesis": src_d.count("✗")},
                "mirror": {"thesis": len(re.findall(r"\b[A-D]\s*§", mir)),   "antithesis": mir.count("✗")},
            },
            "synthesis": {"UNO":    {"law": "VERDADE × INTEGRAR ÷ Δ = ♾"},
                          "DUAL":   {"mirror": True, "invariant_letters": cd["letters"] == cm["letters"]},
                          "TRINITY":{"procedure": ["detectar A/B/C/D","contar","selar ∆⁷","loop 3×9×7"]}},
            "seal": "∆7", "loop": "3×9×7"}

# ─── MAIN ─────────────────────────────────────
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--file", required=True)
    ap.add_argument("--root", default=ROOT)
    ap.add_argument("--size", type=int, default=33)
    args = ap.parse_args()

    fpath  = args.file if os.path.isabs(args.file) else os.path.join(args.root, args.file)
    fname  = os.path.basename(fpath)
    sname  = safe_name(fname)
    print(f"[KOBLLUX] → {fname}")

    src_d = read_file(fpath)
    src_m = mirror_text(src_d)

    m1          = run_m1(src_d, src_m)
    m2          = run_m2(src_d, m1)
    m3          = run_m3(src_d, src_m)
    m4, tri, ascii_art, grid = run_m4(src_d, src_m, m1, m2, args.size)
    m5          = run_m5(src_d, m3)

    state_dir = os.path.join(args.root, "state", "PIPELINE_RUNS", sname)
    cards_dir = os.path.join(args.root, "cards", "PIPELINE_RUNS", sname)
    os.makedirs(state_dir, exist_ok=True)
    os.makedirs(cards_dir, exist_ok=True)

    # Salvar JSONs + TRI + ASCII
    for nm, obj in [("m1_chars_report.json", m1), ("m2_lang_report.json", m2),
                     ("m3_symbol_report.json", m3), ("m4_fractal_report.json", m4),
                     ("espelho_report.json", m5)]:
        with open(os.path.join(state_dir, nm), "w", encoding="utf-8") as f:
            json.dump(obj, f, ensure_ascii=False, indent=2)

    with open(os.path.join(state_dir, "m4_sci_art.tri.txt"), "w", encoding="utf-8") as f:
        f.write(tri)
    with open(os.path.join(state_dir, "m4_sci_art.ascii.txt"), "w", encoding="utf-8") as f:
        f.write(ascii_art)

    # Cards MD
    pat_d  = m3["patterns"]["direct"]
    active = [k for k, v in pat_d.items() if v]
    sym_d  = m3["symbols"]["direct"]
    cd     = m5["counts"]["direct"]
    cm     = m5["counts"]["mirror"]
    inv    = cd["letters"] == cm["letters"]

    with open(os.path.join(cards_dir, "M3_SYMBOL_CARD.md"), "w", encoding="utf-8") as f:
        f.write(f"# M3 • Símbolo — {sname}\n\n")
        f.write(f"**Arquivo:** `{fname}`\n\n")
        f.write(f"**Símbolos (direto):** {sym_d}\n\n")
        f.write(f"**Padrões A/B/C/D:** {pat_d}\n")
        f.write(f"**Ativos:** {active if active else 'nenhum'}\n\n")
        f.write(f"> Seed: `{m4['seed']}` · DR={m4['digital_root']} · Selo: ∆⁷\n")

    with open(os.path.join(cards_dir, "ESPELHO_CARD.md"), "w", encoding="utf-8") as f:
        f.write(f"# ESPELHO CARD — {sname}\n\n")
        f.write(f"**(V×I÷Δ=∞)** · `{fname}`\n\n")
        f.write("## Métricas\n")
        f.write("| Campo | Direto | Espelho | Invariante |\n")
        f.write("|-------|--------|---------|------------|\n")
        for k in ("letters", "words", "sentences"):
            inv_k = "✓" if cd.get(k) == cm.get(k) else "✗"
            f.write(f"| {k} | {cd.get(k,0)} | {cm.get(k,0)} | {inv_k} |\n")
        f.write(f"\n**Invariante global:** {'✓' if inv else '✗'}\n\n")
        f.write(f"> Selo: ∆⁷ · Loop: 3×9×7\n")

    # Card SCI-ART ASCII
    with open(os.path.join(cards_dir, "M4_SCIART_CARD.md"), "w", encoding="utf-8") as f:
        f.write(f"# M4 • SCI-ART ASCII — {sname}\n\n")
        f.write(f"**Seed:** `{m4['seed']}` · **DR:** {m4['digital_root']}\n\n")
        f.write("**Encoding:** `0`=PAI( ) · `1`=FILHO(█) · `2`=ESPÍRITO(▒)\n\n")
        f.write("```\n")
        f.write(ascii_art)
        f.write("\n```\n\n")
        f.write(f"> pal_h=True · pal_v=True · {args.size}×{args.size} · ∆7\n")

    print(f"  M1 words={m1['direct']['words']} letters={m1['direct']['letters']}")
    print(f"  M2 pt_score={m2['language_score']['pt_score']}")
    print(f"  M3 padrões ativos={active}")
    print(f"  M4 seed={m4['seed']} DR={m4['digital_root']}")
    print(f"  M5 invariante={'✓' if inv else '✗'}")
    print(f"  → state/{sname}/  cards/{sname}/")
    print(f"[KOBLLUX] SELADO ∆7")

if __name__ == "__main__":
    main()
