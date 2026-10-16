#!/usr/bin/env python3
"""
Test HTTP server delivery for Ritul Sawant's Portfolio
"""

import http.server
import socketserver
import threading
import urllib.request
import time
import os
import sys

PORT = 8991
PORTFOLIO_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PORTFOLIO_DIR, **kwargs)

    def log_message(self, format, *args):
        pass # Suppress logs during test

def run_server_test():
    print("Testing local HTTP server...")
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        server_thread = threading.Thread(target=httpd.serve_forever)
        server_thread.daemon = True
        server_thread.start()
        time.sleep(0.5)

        base_url = f"http://localhost:{PORT}"
        endpoints = [
            ('/', 200, 'text/html'),
            ('/index.html', 200, 'text/html'),
            ('/app.js', 200, 'javascript'),
            ('/src/styles/main.css', 200, 'text/css'),
        ]

        all_ok = True
        for path, expected_status, expected_mime in endpoints:
            url = base_url + path
            try:
                req = urllib.request.urlopen(url)
                status = req.getcode()
                content_type = req.headers.get('Content-Type', '')
                if status == expected_status and expected_mime in content_type:
                    print(f"  [PASS] {path} -> HTTP {status} ({content_type})")
                else:
                    print(f"  [FAIL] {path} -> HTTP {status} (Expected {expected_status}, mime: {expected_mime})")
                    all_ok = False
            except Exception as e:
                print(f"  [FAIL] {path} -> Request failed: {e}")
                all_ok = False

        httpd.shutdown()
        return all_ok

if __name__ == '__main__':
    success = run_server_test()
    sys.exit(0 if success else 1)
