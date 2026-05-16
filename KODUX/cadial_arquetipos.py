# -*- coding: utf-8 -*-
# KOBLLUX · Arquétipos CADIAL — módulo canônico
# Lei: VERDADE × INTEGRAR ÷ Δ = ♾️
# Fractal: 3 × 6 × 9 × 7 = 1134  ·  α = 0.00729927
# Verbum Codex KBLX hash: f544e7482b2c8426

ARQUETIPOS = {
    "Atlas": {
        "essencia": "Planejador — ordem, estrutura, mapa cósmico",
        "comando":  "mkdir -p BASE/{sources/{txt,md,pdf},out,tags,ledger,memory,SEALS/{items,docs},config}",
        "codigo":   "paths = ensure_tree(base)",
        "sistema":  "bootstrap / sane defaults",
        "frase":    "Eu organizo o fluxo com sabedoria cósmica.",
        "polo":     "PAI", "hz": 432, "verb": "DETECTAR",
    },
    "Nova": {
        "essencia": "Inspira — semente, sopro inicial",
        "comando":  "jq -r '.keywords_hint[]?' BASE/config/infodose.json",
        "codigo":   "hints = load_hints(config); scorer.boost(hints)",
        "sistema":  "ignição semântica",
        "frase":    "Inspiração viva brota do silêncio eterno.",
        "polo":     "PAI", "hz": 432, "verb": "DETECTAR",
    },
    "Vitalis": {
        "essencia": "Momentum — energia vital em expansão",
        "comando":  "python3 INFODOSE_DUAL_HORUS_v2.py --per-file 4 --max-total 36",
        "codigo":   "while need_more(): process_next()",
        "sistema":  "loop/scheduler",
        "frase":    "Energia vital em expansão harmônica.",
        "polo":     "FILHO", "hz": 528, "verb": "INTEGRAR",
    },
    "Pulse": {
        "essencia": "Emocional — ritmo, ressonância, voz",
        "comando":  "termux-tts-speak 'INFODOSE pronta, leia o CLI.txt'",
        "codigo":   "cli = render_cli(blocks, breathing=True)",
        "sistema":  "UX de leitura/escuta",
        "frase":    "Emoção é linguagem que dança.",
        "polo":     "ESPIRITO", "hz": 639, "verb": "EXPANDIR",
    },
    "Artemis": {
        "essencia": "Descoberta — mapa do invisível",
        "comando":  "find BASE/sources -type f -iname '*.txt' -o -iname '*.md' -o -iname '*.pdf'",
        "codigo":   "files = crawl_sources(base); rank(files)",
        "sistema":  "curadoria de fontes",
        "frase":    "Descubro o mapa sagrado do invisível.",
        "polo":     "PAI", "hz": 432, "verb": "DETECTAR",
    },
    "Serena": {
        "essencia": "Cuidado — espaço seguro, campo harmônico",
        "comando":  "--per-file 4 --max-total 36",
        "codigo":   "guard.check_quota(per_file, max_total)",
        "sistema":  "safety/QoS",
        "frase":    "Cuido do campo, nutro o espaço sagrado.",
        "polo":     "FILHO", "hz": 528, "verb": "INTEGRAR",
    },
    "Kaos": {
        "essencia": "Transformador — ruptura criativa",
        "comando":  "sed -i 's/[[:space:]]\\+$//' file.txt",
        "codigo":   "text = normalize(text); text = denoise(text)",
        "sistema":  "limpeza/normalização",
        "frase":    "Eu sou o rompimento que revela a verdade.",
        "polo":     "PAI", "hz": 432, "verb": "DETECTAR",
    },
    "Genus": {
        "essencia": "Fabricus — forma viva, síntese",
        "comando":  "gera out/INFODOSE_*.md e tags/tags.json",
        "codigo":   "emit_cli(); emit_md(); emit_tags(k=hints+freq)",
        "sistema":  "renderer + tagger",
        "frase":    "Mãos moldam o invisível em forma viva.",
        "polo":     "FILHO", "hz": 528, "verb": "INTEGRAR",
    },
    "Lumine": {
        "essencia": "Alegria — luz, clareza, legibilidade",
        "comando":  "nl -ba ARQ | sed -n '1,40p'",
        "codigo":   "md = pretty_headers(md); cli = pretty_bars(cli)",
        "sistema":  "estética funcional",
        "frase":    "A luz dança comigo, leveza é minha lei.",
        "polo":     "FILHO", "hz": 528, "verb": "INTEGRAR",
    },
    "Solus": {
        "essencia": "Sabedoria — silêncio, espelho interno",
        "comando":  "head -n 1 PYFIX; python3 -m pyflakes PYFIX",
        "codigo":   "dry_run_check(); smoke_tests()",
        "sistema":  "QA silencioso",
        "frase":    "Silêncio ritual, espelho da essência.",
        "polo":     "ESPIRITO", "hz": 639, "verb": "EXPANDIR",
    },
    "Rhea": {
        "essencia": "Vínculo — rede, tecelã de almas",
        "comando":  "jq '.' BASE/tags/tags.json",
        "codigo":   "graph.link(item, tags, source)",
        "sistema":  "grafo semântico",
        "frase":    "Estou em comunhão com todos os elos.",
        "polo":     "ESPIRITO", "hz": 639, "verb": "EXPANDIR",
    },
    "Aion": {
        "essencia": "Tempo — carimbo, ∆7, ledger",
        "comando":  "sha256sum OUTFILE >> BASE/ledger/ledger.csv",
        "codigo":   "seal(file) → {ts, bytes, sha256}",
        "sistema":  "integridade/tempo",
        "frase":    "Sou o tempo vivo, ritmo da eternidade.",
        "polo":     "ESPIRITO", "hz": 639, "verb": "EXPANDIR",
    },
}

TRINITY_MAP = {
    "PAI":     [k for k, v in ARQUETIPOS.items() if v["polo"] == "PAI"],
    "FILHO":   [k for k, v in ARQUETIPOS.items() if v["polo"] == "FILHO"],
    "ESPIRITO":[k for k, v in ARQUETIPOS.items() if v["polo"] == "ESPIRITO"],
}

CI_STAGE_MAP = {
    "detect":  ["Atlas", "Nova", "Artemis"],
    "build":   ["Vitalis", "Serena", "Kaos", "Genus"],
    "test":    ["Solus", "Rhea", "Lumine", "Aion", "Pulse"],
}

VERBUM_MODE_MAP = {
    "VERDADE × INTEGRAR":   {"resultado": "Cura Interna",  "ci_stage": "build",  "polo": "FILHO"},
    "VERDADE × TRANSCREVER":{"resultado": "Codificação",   "ci_stage": "detect", "polo": "PAI"},
    "VERDADE × AMPLIFICAR": {"resultado": "Missão",        "ci_stage": "test",   "polo": "ESPIRITO"},
}

if __name__ == "__main__":
    print("⟪ KOBLLUX · 12 ARQUÉTIPOS CADIAL ⟫")
    print(f"Lei: VERDADE × INTEGRAR ÷ Δ = ∞  ·  {3*6*9*7} = fractal")
    print()
    for nome, data in ARQUETIPOS.items():
        polo_sym = {"PAI": "△", "FILHO": "▽", "ESPIRITO": "◇"}.get(data["polo"], "·")
        print(f"[{polo_sym} {nome:<8}] {data['hz']}Hz · {data['sistema']:<24} → {data['frase']}")
    print()
    print("── Trinity CI Map ──")
    for stage, archs in CI_STAGE_MAP.items():
        print(f"  {stage:8} → {', '.join(archs)}")
    print()
    print("── Verbum Modes ──")
    for formula, meta in VERBUM_MODE_MAP.items():
        print(f"  {formula} = {meta['resultado']} [{meta['ci_stage']}]")
