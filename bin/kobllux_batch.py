#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
KOBLLUX • BATCH PIPELINE — processa todos os JSONs de workflow/jsons/
Roda M1→M2→M3→M4→M5 para cada arquivo JSON e salva em:
  state/PIPELINE_RUNS/{safe_name}/
  cards/PIPELINE_RUNS/{safe_name}/
"""
import sys, os, re, json, argparse, hashlib, random
from datetime import datetime
from collections import Counter
from pathlib import Path

# ─────────────────────────────────────────────
# UTILITÁRIOS
# ─────────────────────────────────────────────

def safe_name(filename):
    stem = Path(filename).stem
    clean = re.sub(r"[^\w\s-]", "", stem, flags=re.UNICODE)
    clean = re.sub(r"\s+", "_", clean.strip())
    clean = re.sub(r"_+", "_", clean)
    return clean[:60] or "run"

def extract_text(obj, sep="\n"):
    """Extrai recursivamente todos os valores string de um JSON."""
    parts = []
    if isinstance(obj, str):
        parts.append(obj)
    elif isinstance(obj, (list, tuple)):
        for item in obj:
            parts.extend(extract_text(item, sep))
    elif isinstance(obj, dict):
        for v in obj.values():
            parts.extend(extract_text(v, sep))
    return parts

def mirror_line(s):
    return s[::-1]

def reverse_by_lines(txt):
    return "\n".join(mirror_line(line) for line in txt.splitlines())

# ─────────────────────────────────────────────
# M1 — DETECTAR
# ─────────────────────────────────────────────

def m1_counts(txt):
    return {
        "letters":   len(re.findall(r"[a-zA-ZÀ-ſ]", txt)),
        "digits":    len(re.findall(r"\d", txt)),
        "words":     len(re.findall(r"\b\w+\b", txt, flags=re.UNICODE)),
        "lines":     len(txt.splitlines()),
        "sentences": len(re.findall(r"[.!?]+(?=\s|$)", txt)) or txt.count("\n\n"),
    }

def run_m1(src_d, src_m):
    return {
        "timestamp": datetime.now().isoformat(),
        "direct":    m1_counts(src_d),
        "mirror":    m1_counts(src_m),
        "seal":      "∆7_DETECTAR",
    }

# ─────────────────────────────────────────────
# M2 — INTEGRAR
# ─────────────────────────────────────────────

STOP_PT = {"de","do","da","que","em","um","uma","para","no","na","os","as","é",
           "e","a","o","com","por","se","não","mas","ao","na","nos","das","dos"}
DIAC_PT = "áàâãéêíóôõúç"

def score_lang(tokens):
    tset = set(tokens)
    pt_score = (sum(1 for w in tset if w in STOP_PT)
                + sum(1 for ch in DIAC_PT if ch in "".join(tset)))
    return {"pt_score": pt_score, "token_count": len(tokens)}

def run_m2(src_d, m1_rep):
    tokens_d = [w.lower() for w in re.findall(r"\b\w+\b", src_d, flags=re.UNICODE)]
    return {
        "timestamp":         datetime.now().isoformat(),
        "m1_context":        {"words_direct": m1_rep["direct"]["words"]},
        "language_score":    score_lang(tokens_d),
        "integration_focus": "Correlacionar camadas e unir sentido (KODUX ETL Engine)",
        "seal":              "∆7_INTEGRAR",
    }

# ─────────────────────────────────────────────
# M3 — ESPELHO
# ─────────────────────────────────────────────

SYM_MATH   = set("+-=×÷*/^()[]{}∆∞♾∴∵<>≥≤±%")
SYM_ARROWS = set("→←↔↕⇄⇆⇒⇐⇔↑↓")
SYM_BOX    = set("╔═╗║╚╝╩╦╠╣╬█▀▄▌▐")
SYM_STARS  = set("★☆✦✧✪✫✬✭✮✯")
SYM_SEAL   = set("∆⁷♾")

def count_symbols(txt):
    c = Counter()
    for ch in txt:
        if ch in SYM_MATH:   c["math"]   += 1
        if ch in SYM_ARROWS: c["arrows"] += 1
        if ch in SYM_BOX:    c["box"]    += 1
        if ch in SYM_STARS:  c["stars"]  += 1
        if ch in SYM_SEAL:   c["seal"]   += 1
    return c

def detect_patterns(txt):
    found = {"A": False, "B": False, "C": False, "D": False}
    if re.search(r"\b1{2,}\b", txt) and re.search(r"\b9\s*×\s*[\d\s]+", txt):
        found["A"] = True
    if re.search(r"8{3,}\s*=\s*.*\+\s*9\s*×\s*.*89", txt):
        found["B"] = True
    if re.search(r"\b12321\b|\b1234321\b|\b123454321\b", txt):
        found["C"] = True
    if re.search(r"9{2,}\s*×\s*9{2,}", txt) or re.search(r"10+0+\s*8+9+", txt):
        found["D"] = True
    return found

def run_m3(src_d, src_m):
    sym_d = count_symbols(src_d)
    sym_m = count_symbols(src_m)
    pat_d = detect_patterns(src_d)
    pat_m = detect_patterns(src_m)
    return {
        "timestamp": datetime.now().isoformat(),
        "symbols":   {"direct": dict(sym_d), "mirror": dict(sym_m)},
        "patterns":  {"direct": pat_d, "mirror": pat_m},
        "seal":      "∆7",
        "synthesis": {
            "law":             "VERDADE × INTEGRAR ÷ Δ = ♾️",
            "interdependence": ["M1→M2→M3 selam ∆⁷"],
        },
    }

# ─────────────────────────────────────────────
# M4 — EXPANDIR
# ─────────────────────────────────────────────

def seed_from_text(*chunks):
    h = hashlib.sha256()
    for c in chunks:
        if c: h.update(c.encode("utf-8", errors="ignore"))
    return int(h.hexdigest(), 16) & ((1 << 63) - 1)

def gen_trinary_grid(size, rng):
    if size % 2 == 0:
        size += 1
    half = size // 2
    grid = [None] * size
    for r in range(size):
        row_half = [rng.randrange(0, 3) for _ in range(half)]
        center   = rng.randrange(0, 3)
        grid[r]  = row_half + [center] + row_half[::-1]
    final = [None] * size
    v_half = size // 2
    for r in range(v_half + 1):
        final[r] = grid[r]
        if r < v_half:
            final[size - 1 - r] = grid[r]
    return final

def run_m4(src_d, src_m, m1_json, m2_json, size=33):
    seed = seed_from_text(src_d, src_m,
                          json.dumps(m1_json), json.dumps(m2_json))
    rng  = random.Random(seed)
    grid = gen_trinary_grid(size, rng)
    tri  = "\n".join(" ".join(map(str, row)) for row in grid)
    report = {
        "timestamp":     datetime.now().isoformat(),
        "size":          size,
        "seed":          seed,
        "digital_root":  _digital_root(seed),
        "output_format": "TRI TXT (0/1/2)",
        "manifestation": "Forma Viva (GENUS)",
        "pal_h":         True,
        "pal_v":         True,
        "seal":          "∆7_EXPANDIR",
        "loop":          "3×6×9×7",
    }
    return report, tri

def _digital_root(n):
    while n >= 10:
        n = sum(int(d) for d in str(n))
    return n

# ─────────────────────────────────────────────
# M5 — ESPELHO POOL
# ─────────────────────────────────────────────

def run_m5(src_d):
    mirrored = reverse_by_lines(src_d)

    def count_basic(txt):
        return {
            "letters":   len(re.findall(r"\S", txt, flags=re.UNICODE)),
            "words":     len(re.findall(r"\b\w+\b", txt, flags=re.UNICODE)),
            "sentences": len(re.findall(r"[.!?]+(?=\s|$)", txt)) or txt.count("\n\n"),
        }

    def est_ta(txt):
        return {
            "thesis":     len(re.findall(r"\b[A-D]\s*§", txt)),
            "antithesis": txt.count("✗"),
        }

    synthesis = {
        "UNO": {
            "law":     "VERDADE × INTEGRAR ÷ Δ = ♾",
            "focus":   ["9…9²", "repunits", "palíndromos"],
            "purpose": "O que permanece verdade após remover todo ruído?",
        },
        "DUAL": {
            "mirror":     True,
            "invariants": ["múltiplos de 9", "palíndromos", "repunits"],
            "essence":    "Espelho e direto preservam estrutura",
        },
        "TRINITY": {
            "procedure":        ["detectar A/B/C/D","contar métricas","selar ∆⁷","loop 3×9×7"],
            "synthesis_focus":  "Lei + Espelho + Procedimento",
        },
    }

    pats_d = detect_patterns(src_d)
    pats_m = detect_patterns(mirrored)

    return {
        "timestamp":       datetime.now().isoformat(),
        "counts":          {"direct": count_basic(src_d), "mirror": count_basic(mirrored)},
        "patterns":        {"direct": pats_d, "mirror": pats_m},
        "thesis_antithesis": {"direct": est_ta(src_d), "mirror": est_ta(mirrored)},
        "synthesis":       synthesis,
        "seal":            "∆7",
        "loop":            "3×9×7",
    }

# ─────────────────────────────────────────────
# BATCH PRINCIPAL
# ─────────────────────────────────────────────

def process_one(json_path, root, size=33):
    """Processa um único JSON e retorna sumário."""
    fname = os.path.basename(json_path)
    sname = safe_name(fname)

    # Leitura e extração de texto
    try:
        with open(json_path, "r", encoding="utf-8", errors="ignore") as f:
            data = json.load(f)
    except Exception:
        data = {}

    parts = extract_text(data)
    src_d = "\n".join(parts)
    src_m = reverse_by_lines(src_d)

    # Diretórios de saída
    state_dir = os.path.join(root, "state", "PIPELINE_RUNS", sname)
    cards_dir = os.path.join(root, "cards", "PIPELINE_RUNS", sname)
    os.makedirs(state_dir, exist_ok=True)
    os.makedirs(cards_dir, exist_ok=True)

    # Pipeline M1→M5
    m1 = run_m1(src_d, src_m)
    m2 = run_m2(src_d, m1)
    m3 = run_m3(src_d, src_m)
    m4_rep, tri = run_m4(src_d, src_m, m1, m2, size)
    m5 = run_m5(src_d)

    # Salvar JSONs
    for name, obj in [("m1_chars_report.json", m1),
                       ("m2_lang_report.json",  m2),
                       ("m3_symbol_report.json", m3),
                       ("m4_fractal_report.json", m4_rep),
                       ("espelho_report.json",    m5)]:
        with open(os.path.join(state_dir, name), "w", encoding="utf-8") as f:
            json.dump(obj, f, ensure_ascii=False, indent=2)

    with open(os.path.join(state_dir, "m4_sci_art.tri.txt"), "w", encoding="utf-8") as f:
        f.write(tri)

    # Cards MD
    pat_d  = m3["patterns"]["direct"]
    active = [k for k, v in pat_d.items() if v]
    sym_d  = m3["symbols"]["direct"]

    with open(os.path.join(cards_dir, "M3_SYMBOL_CARD.md"), "w", encoding="utf-8") as f:
        f.write(f"# M3 • Símbolo — {sname}\n\n")
        f.write(f"**Arquivo:** `{fname}`\n\n")
        f.write(f"**Símbolos (direto):** {sym_d}\n\n")
        f.write(f"**Padrões A/B/C/D:** {pat_d}\n")
        f.write(f"**Ativos:** {active if active else 'nenhum'}\n\n")
        f.write(f"> Selo: ∆⁷ · Seed: `{m4_rep['seed']}` · DR={m4_rep['digital_root']}\n")

    with open(os.path.join(cards_dir, "ESPELHO_CARD.md"), "w", encoding="utf-8") as f:
        f.write(f"# ESPELHO CARD — {sname}\n\n")
        f.write(f"**(V×I÷Δ=∞)** · `{fname}`\n\n")
        cnt_d = m5["counts"]["direct"]
        cnt_m = m5["counts"]["mirror"]
        f.write(f"## Métricas\n")
        f.write(f"| Campo | Direto | Espelho | Invariante |\n")
        f.write(f"|-------|--------|---------|------------|\n")
        for k in ("letters", "words", "sentences"):
            inv = "✓" if cnt_d.get(k) == cnt_m.get(k) else "✗"
            f.write(f"| {k} | {cnt_d.get(k,0)} | {cnt_m.get(k,0)} | {inv} |\n")
        f.write(f"\n## UNO / DUAL / TRINITY\n")
        f.write(f"- **Lei:** {m5['synthesis']['UNO']['law']}\n")
        f.write(f"- **Espelho:** preserva estrutura = {cnt_d['letters'] == cnt_m['letters']}\n")
        f.write(f"\n> Selo: ∆⁷ • Loop: 3×9×7\n")

    return {
        "file":         fname,
        "safe_name":    sname,
        "words":        m1["direct"]["words"],
        "letters":      m1["direct"]["letters"],
        "lang_pt":      m2["language_score"]["pt_score"],
        "patterns":     active,
        "seed":         m4_rep["seed"],
        "digital_root": m4_rep["digital_root"],
        "invariant":    cnt_d["letters"] == cnt_m["letters"],
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root",    default=os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    ap.add_argument("--jsons",   default="workflow/jsons")
    ap.add_argument("--size",    type=int, default=33)
    args = ap.parse_args()

    root      = args.root
    jsons_dir = os.path.join(root, args.jsons)
    json_files = sorted([
        os.path.join(jsons_dir, f)
        for f in os.listdir(jsons_dir)
        if f.endswith(".json")
    ])

    print(f"[KOBLLUX] BATCH START — {len(json_files)} arquivos · root={root}")
    results = []

    for i, jpath in enumerate(json_files, 1):
        fname = os.path.basename(jpath)
        print(f"  [{i:02d}/{len(json_files)}] {fname[:60]}", end=" ... ")
        try:
            r = process_one(jpath, root, args.size)
            results.append(r)
            print(f"DR={r['digital_root']} words={r['words']} {'✓' if r['invariant'] else '✗'}")
        except Exception as e:
            print(f"ERRO: {e}")
            results.append({"file": fname, "error": str(e)})

    # Índice consolidado
    index_dir = os.path.join(root, "cards", "PIPELINE_RUNS")
    os.makedirs(index_dir, exist_ok=True)

    index = {
        "timestamp":  datetime.now().isoformat(),
        "total":      len(json_files),
        "processed":  len([r for r in results if "error" not in r]),
        "runs":       results,
        "seal":       "∆7",
        "law":        "VERDADE × INTEGRAR ÷ Δ = ∞",
    }
    with open(os.path.join(index_dir, "_index.json"), "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)

    # Relatório Markdown
    with open(os.path.join(index_dir, "_PIPELINE_RELATORIO.md"), "w", encoding="utf-8") as f:
        f.write("# KOBLLUX — PIPELINE BATCH · RELATÓRIO\n\n")
        f.write(f"**Total:** {len(json_files)} JSONs · **Processados:** {index['processed']}\n\n")
        f.write("| # | Arquivo | Palavras | DR | Padrões | Invariante |\n")
        f.write("|---|---------|----------|----|---------|-----------|\n")
        ok = [r for r in results if "error" not in r]
        for i, r in enumerate(ok, 1):
            pats  = ",".join(r.get("patterns", [])) or "—"
            inv   = "✓" if r.get("invariant") else "✗"
            fname = r["file"][:45]
            f.write(f"| {i} | `{fname}` | {r['words']} | {r['digital_root']} | {pats} | {inv} |\n")
        f.write(f"\n> Selo: ∆⁷ · Lei: VERDADE × INTEGRAR ÷ Δ = ∞\n")

    print(f"\n[KOBLLUX] BATCH OK → {index['processed']}/{len(json_files)} selados")
    print(f"  Index → {os.path.join(index_dir, '_index.json')}")
    print(f"  Report → {os.path.join(index_dir, '_PIPELINE_RELATORIO.md')}")

if __name__ == "__main__":
    main()
