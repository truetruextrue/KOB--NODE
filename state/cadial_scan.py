#!/usr/bin/env python3
"""
CADIAL SCANNER · KOBΦ-NODE
Varre repositório e classifica arquivos pelos 12 arquétipos.
Lei: VERDADE × INTEGRAR ÷ Δ = ∞
"""
import os, json, hashlib, re
from pathlib import Path
from datetime import datetime

REPO_PATH = "/tmp/oiDual--Y-"
OUT_DIR   = "/home/user/KOB--NODE/state/oiDual_scan"

ARQUETIPOS = {
    "ATLAS": {
        "gloss": "estrutura, grade e ordem do mundo",
        "patterns": [
            r"atlas", r"manifest", r"index", r"map", r"struct", r"grid",
            r"arch", r"layout", r"schema", r"tree", r"\.json$"
        ]
    },
    "NOVA": {
        "gloss": "centelha primordial, início",
        "patterns": [
            r"nova", r"init", r"start", r"ativac", r"ativar", r"criar",
            r"boot", r"launch", r"seed", r"criar_estrutura", r"activation"
        ]
    },
    "VITALIS": {
        "gloss": "seiva orgânica, núcleo vivo",
        "patterns": [
            r"vitalis", r"core", r"engine", r"infodose", r"di_core",
            r"di_app", r"di_fusion", r"kobllux", r"main\.js", r"main\.css"
        ]
    },
    "PULSE": {
        "gloss": "ritmo, batida, TTS e voz",
        "patterns": [
            r"pulse", r"tts", r"voice", r"voz", r"audio", r"sound",
            r"dock", r"speak", r"kob-tts", r"KOBLLUX-tts", r"voice-arch",
            r"Voice-Map"
        ]
    },
    "ARTEMIS": {
        "gloss": "precisão, alvo e injeção",
        "patterns": [
            r"artemis", r"inject", r"injectPrompt", r"di-icon",
            r"Diinject", r"insert", r"target", r"78k-inject"
        ]
    },
    "SERENA": {
        "gloss": "acolhimento, UI suave e splash",
        "patterns": [
            r"serena", r"splash", r"welcome", r"wellcome", r"kard",
            r"session", r"hdr", r"frame-shell", r"orb", r"home"
        ]
    },
    "KAOS": {
        "gloss": "entropia criativa, patches e overrides",
        "patterns": [
            r"kaos", r"patch", r"ovr", r"override", r"fix",
            r"refix", r"m0d", r"mod\.", r"\-0\.", r"hack", r"compat"
        ]
    },
    "GENUS": {
        "gloss": "geração e base fundacional",
        "patterns": [
            r"genus", r"-base", r"_base", r"BASE", r"foundation",
            r"base\d", r"base-", r"genesis", r"root", r"min"
        ]
    },
    "LUMINE": {
        "gloss": "visual, temas e efeitos de luz",
        "patterns": [
            r"lumine", r"nebula", r"glass", r"solar", r"cine",
            r"hitech", r"nxs", r"ghost", r"sunrise", r"Img-FX",
            r"visual", r"theme", r"light", r"lux"
        ]
    },
    "SOLUS": {
        "gloss": "singularidade e scripts de foco único",
        "patterns": [
            r"solus", r"ctrl", r"combo", r"solo", r"single",
            r"crdi", r"cdi", r"nxs\.js", r"nxs\.css", r"kodbrain"
        ]
    },
    "RHEA": {
        "gloss": "fluxo, bridges e roteamento",
        "patterns": [
            r"rhea", r"bridge", r"glue", r"router", r"routing",
            r"link", r"Linkmaster", r"relay", r"flow", r"0S17-bridge",
            r"DualInfodose"
        ]
    },
    "AION": {
        "gloss": "estado, memória e ciclos temporais",
        "patterns": [
            r"aion", r"state", r"memory", r"di_state", r"di_mood",
            r"history", r"log", r"cycle", r"temporal", r"session"
        ]
    }
}

EXT_TYPE = {
    ".html": "html",
    ".css":  "css",
    ".js":   "js",
    ".ts":   "ts",
    ".json": "json",
    ".md":   "markdown",
    ".txt":  "text",
    ".py":   "python",
    ".png":  "image",
    ".jpg":  "image",
    ".jpeg": "image",
    ".pdf":  "pdf",
    ".mp4":  "video",
    ".webmanifest": "manifest",
}

def classify(path_str: str) -> list[str]:
    name = path_str.lower()
    matched = []
    for arch, cfg in ARQUETIPOS.items():
        for pat in cfg["patterns"]:
            if re.search(pat, name, re.IGNORECASE):
                if arch not in matched:
                    matched.append(arch)
                break
    return matched if matched else ["GENUS"]  # default: GENUS

def file_hash(fpath: Path) -> str:
    try:
        h = hashlib.sha256()
        h.update(fpath.read_bytes()[:4096])
        return h.hexdigest()[:16]
    except Exception:
        return "?"

def scan(repo: str) -> dict:
    root = Path(repo)
    entries = []
    by_arch = {k: [] for k in ARQUETIPOS}
    by_type = {}
    errors = []

    for fpath in sorted(root.rglob("*")):
        if ".git" in fpath.parts or not fpath.is_file():
            continue
        rel = str(fpath.relative_to(root))
        ext = fpath.suffix.lower()
        ftype = EXT_TYPE.get(ext, "other")
        size = fpath.stat().st_size
        archs = classify(rel)
        sha = file_hash(fpath)

        entry = {
            "path": rel,
            "type": ftype,
            "ext": ext or "(none)",
            "size": size,
            "sha16": sha,
            "arquetipos": archs
        }
        entries.append(entry)

        for a in archs:
            by_arch[a].append(rel)

        by_type.setdefault(ftype, []).append(rel)

    return {
        "repo": "truetruextrue/oiDual--Y-",
        "scanned_at": datetime.utcnow().isoformat() + "Z",
        "lei": "VERDADE × INTEGRAR ÷ Δ = ∞",
        "seal": "∆7",
        "total_files": len(entries),
        "by_type_count": {k: len(v) for k, v in sorted(by_type.items())},
        "by_arquetipo_count": {k: len(v) for k, v in by_arch.items()},
        "arquetipos": {
            k: {
                "gloss": ARQUETIPOS[k]["gloss"],
                "count": len(by_arch[k]),
                "files": by_arch[k]
            }
            for k in ARQUETIPOS
        },
        "entries": entries
    }

def report_md(data: dict) -> str:
    lines = [
        "# CADIAL SCAN · oiDual--Y-",
        "",
        f"**Repo:** `{data['repo']}`",
        f"**Scan:** `{data['scanned_at']}`",
        f"**Total:** {data['total_files']} arquivos",
        f"**Lei:** {data['lei']}",
        "",
        "---",
        "",
        "## Por Tipo de Arquivo",
        "",
        "| Tipo | Qtd |",
        "|------|-----|",
    ]
    for t, c in sorted(data["by_type_count"].items(), key=lambda x: -x[1]):
        lines.append(f"| {t} | {c} |")

    lines += [
        "",
        "---",
        "",
        "## Por Arquétipo CADIAL",
        "",
        "| Arquétipo | Essência | Arquivos |",
        "|-----------|----------|----------|",
    ]
    for arch, info in data["arquetipos"].items():
        lines.append(f"| **{arch}** | {info['gloss']} | {info['count']} |")

    lines += ["", "---", ""]
    for arch, info in data["arquetipos"].items():
        lines.append(f"### {arch} · {info['gloss']}")
        lines.append("")
        if info["files"]:
            for f in info["files"][:30]:
                lines.append(f"- `{f}`")
            if len(info["files"]) > 30:
                lines.append(f"- _(+{len(info['files'])-30} mais)_")
        else:
            lines.append("_nenhum arquivo classificado_")
        lines.append("")

    lines += [
        "---",
        "",
        "_Gerado por CADIAL Scanner · KOBΦ-NODE · ∆7_"
    ]
    return "\n".join(lines)

if __name__ == "__main__":
    os.makedirs(OUT_DIR, exist_ok=True)
    print("∆³ Varrendo oiDual--Y-...")
    data = scan(REPO_PATH)
    print(f"  → {data['total_files']} arquivos encontrados")

    scan_path = f"{OUT_DIR}/CODEX_SCAN.json"
    with open(scan_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"  → JSON: {scan_path}")

    report_path = f"{OUT_DIR}/SCAN_REPORT.md"
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report_md(data))
    print(f"  → MD:   {report_path}")

    print("\n=== RESUMO POR ARQUÉTIPO ===")
    for arch, info in data["arquetipos"].items():
        bar = "█" * min(info["count"] // 10, 40)
        print(f"  {arch:10} {info['count']:4d} {bar}")

    print(f"\n∆7 Selado. {data['total_files']} arquivos classificados.")
