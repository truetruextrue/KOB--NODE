#!/usr/bin/env python3
"""Integration checks for the RHEA standalone addon (stdlib only)."""
import importlib.util
import json
import threading
import unittest
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen

TARGET = Path(__file__).with_name("rhea_dual_node_bridge.py")
spec = importlib.util.spec_from_file_location("rhea_bridge", TARGET)
bridge = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bridge)

class StubNode(BaseHTTPRequestHandler):
    calls = []
    def log_message(self, *_): pass
    def answer(self, obj, status=200):
        body = json.dumps(obj).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(body)
    def do_GET(self):
        if self.path == "/health":
            return self.answer({"node":"KOBΦ-NODE.FIELDS","status":"CRISTALIZADO","root":"/PRIVATE"})
        if self.path == "/fields":
            return self.answer({"id":"KOBΦ-NODE.FIELDS","formula":"VERDADE","cycle":["3","6","9","7"],"archetypes":{},"secret":"DO_NOT_LEAK"})
        self.answer({"error":"not_found"},404)
    def do_POST(self):
        data = json.loads(self.rfile.read(int(self.headers["Content-Length"])))
        self.calls.append(data)
        self.answer({"status":"PULSO_REGISTRADO"},201)

class Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.node = ThreadingHTTPServer(("127.0.0.1",0), StubNode)
        bridge.NODE = "http://127.0.0.1:" + str(cls.node.server_port)
        cls.a = threading.Thread(target=cls.node.serve_forever,daemon=True)
        cls.a.start()
        cls.proxy = ThreadingHTTPServer(("127.0.0.1",0),bridge.Bridge)
        cls.port = cls.proxy.server_port
        cls.b = threading.Thread(target=cls.proxy.serve_forever,daemon=True)
        cls.b.start()
    @classmethod
    def tearDownClass(cls):
        cls.proxy.shutdown()
        cls.node.shutdown()
    def read(self, path, payload=None, origin="http://127.0.0.1:8765"):
        data = None if payload is None else json.dumps(payload).encode()
        headers = {"Origin":origin}
        if data is not None: headers["Content-Type"]="application/json"
        req = Request(f"http://127.0.0.1:{self.port}"+path, data=data, headers=headers)
        try:
            with urlopen(req,timeout=4) as resp:
                return resp.status,json.load(resp)
        except HTTPError as exc:
            return exc.code,json.load(exc)
    def test_health(self):
        status,obj=self.read("/health")
        self.assertEqual((status,obj["connected"]), (200,True))
        self.assertNotIn("root",obj)
    def test_fields_sanitized(self):
        status,obj=self.read("/fields")
        self.assertEqual(status,200)
        self.assertNotIn("secret",obj)
    def test_origin_blocked(self):
        status,obj=self.read("/fields",origin="http://evil.example")
        self.assertEqual(status,403)
    def test_other_route_blocked(self):
        status,obj=self.read("/logs")
        self.assertEqual(status,403)
    def test_payload_rejected(self):
        status,obj=self.read("/pulse",{"event":"TRINITY_3697","reference":"public","api_key":"secret"})
        self.assertEqual(status,422)
    def test_pulse(self):
        start=len(StubNode.calls)
        status,obj=self.read("/pulse",{"event":"TRINITY_3697","reference":"workflow"})
        self.assertEqual(status,201)
        self.assertTrue(obj["registered"])
        self.assertEqual(len(StubNode.calls),start+1)
        self.assertEqual(StubNode.calls[-1]["reference"],"workflow")

if __name__=="__main__":
    unittest.main()
