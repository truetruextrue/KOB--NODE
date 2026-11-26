#!/usr/bin/env python3
"""RHEA: bridge local DUAL :8765 -> NODE.FIELDS :3697 (append-only addon).
Run: python3 integrations/rhea_dual_node_bridge.py
No filesystem writes, no Vault access, no third-party dependencies.
"""
import json
import os
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

HOST = "127.0.0.1"
PORT = int(os.getenv("RHEA_BRIDGE_PORT", "8770"))
ORIGIN = "http://127.0.0.1:8765"
NODE = "http://127.0.0.1:3697"
MAX_BODY = 4096
ALLOWED_EVENTS = {"TRINITY_3697", "DUAL_CONNECTED", "AST_REFERENCE_SELECTED"}

def upstream(path, payload=None):
    data = None if payload is None else json.dumps(payload, ensure_ascii=False).encode("utf-8")
    req = Request(NODE + path, data=data, headers={"Content-Type": "application/json"}, method="POST" if data is not None else "GET")
    with urlopen(req, timeout=3) as response:
        return json.load(response)

class Bridge(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print("RHEA", fmt % args, flush=True)

    def headers_json(self, status=200, cors=True):
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        if cors:
            self.send_header("Access-Control-Allow-Origin", ORIGIN)
            self.send_header("Vary", "Origin")
        self.end_headers()

    def reply(self, status, body, cors=True):
        self.headers_json(status, cors)
        self.wfile.write(json.dumps(body, ensure_ascii=False).encode("utf-8"))

    def origin_ok(self):
        origin = self.headers.get("Origin")
        # Request from browser must present exact Dual origin; no-origin CLI is localhost-only.
        return origin is None or origin == ORIGIN

    def do_OPTIONS(self):
        if self.path not in ("/health", "/fields", "/pulse") or self.headers.get("Origin") != ORIGIN:
            self.reply(403, {"error": "origin_or_path_denied"}, False)
            return
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", ORIGIN)
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Max-Age", "300")
        self.send_header("Vary", "Origin")
        self.end_headers()

    def do_GET(self):
        if not self.origin_ok() or self.path not in ("/health", "/fields"):
            self.reply(403, {"error": "origin_or_path_denied"}, False)
            return
        try:
            if self.path == "/health":
                result = upstream("/health")
                self.reply(200, {"bridge": "RHEA_ONLINE", "node": result.get("node"), "status": result.get("status"), "connected": True})
            else:
                result = upstream("/fields")
                # Explicitly remove untrusted manifest fields, secrets, and local paths.
                self.reply(200, {key: result.get(key) for key in ("id", "formula", "cycle", "archetypes")})
        except (OSError, ValueError, URLError, HTTPError) as exc:
            self.reply(502, {"bridge": "RHEA_OFFLINE", "connected": False, "error_type": type(exc).__name__})

    def do_POST(self):
        if not self.origin_ok() or self.path != "/pulse":
            self.reply(403, {"error": "origin_or_path_denied"}, False)
            return
        if self.headers.get("Content-Type", "").split(";")[0].strip().lower() != "application/json":
            self.reply(415, {"error": "json_required"})
            return
        try:
            length = int(self.headers.get("Content-Length", "-1"))
            if not 0 < length <= MAX_BODY:
                self.reply(413, {"error": "invalid_payload_size"})
                return
            body = json.loads(self.rfile.read(length))
            if not isinstance(body, dict) or set(body) != {"event", "reference"}:
                self.reply(422, {"error": "only_event_and_reference_allowed"})
                return
            event, ref = body["event"], body["reference"]
            if event not in ALLOWED_EVENTS or not isinstance(ref, str) or len(ref) > 160 or not ref.isprintable():
                self.reply(422, {"error": "invalid_event_or_reference"})
                return
            payload = {"source": "KOBLLUX_DUAL_RHEA", "event": event, "reference": ref, "ts": datetime.now(timezone.utc).isoformat()}
            saved = upstream("/pulse", payload)
            self.reply(201, {"bridge": "RHEA", "status": saved.get("status"), "registered": saved.get("status") == "PULSO_REGISTRADO"})
        except (ValueError, TypeError, json.JSONDecodeError):
            self.reply(400, {"error": "invalid_json"})
        except (OSError, URLError, HTTPError) as exc:
            self.reply(502, {"bridge": "RHEA_OFFLINE", "error_type": type(exc).__name__})

if __name__ == "__main__":
    if not (1024 <= PORT <= 65535) or PORT in (3697, 8765):
        raise SystemExit("RHEA_BRIDGE_PORT must be a free port >=1024, distinct from 3697 and 8765")
    print(f"RHEA bridge: http://{HOST}:{PORT} (Dual origin {ORIGIN}; NODE {NODE})", flush=True)
    ThreadingHTTPServer((HOST, PORT), Bridge).serve_forever()
