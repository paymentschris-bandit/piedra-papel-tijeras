#!/usr/bin/env python3
"""Arranca el juego + tunel HTTPS para movil (sin IP local)."""
import http.server
import os
import re
import shutil
import socketserver
import subprocess
import sys
import threading
import time
import urllib.request
import webbrowser
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PORT = 8765
URL_FILE = ROOT / "tunnel-url.txt"
LINK_PAGE = ROOT / "enlace-movil.html"


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass


def find_cloudflared():
    for candidate in [
        shutil.which("cloudflared"),
        Path(os.environ.get("ProgramFiles", "")) / "cloudflared" / "cloudflared.exe",
        Path(os.environ.get("LOCALAPPDATA", "")) / "Microsoft" / "WinGet" / "Links" / "cloudflared.exe",
    ]:
        if candidate and Path(candidate).exists() if isinstance(candidate, str) else candidate.exists():
            return str(candidate)
    return None


def kill_old_tunnels():
    if sys.platform != "win32":
        return
    subprocess.run(
        ["taskkill", "/F", "/IM", "cloudflared.exe"],
        capture_output=True,
        text=True,
    )


def copy_to_clipboard(text):
    try:
        subprocess.run("clip", input=text, text=True, check=True, shell=True)
        return True
    except (subprocess.CalledProcessError, OSError):
        return False


def show_url_popup(url):
    # No bloquear el proceso en segundo plano; aviso solo en consola
    pass


def wait_tunnel_ready(url, seconds=15):
    test_url = url + "/test-movil.html"
    for _ in range(seconds):
        try:
            with urllib.request.urlopen(test_url, timeout=3) as resp:
                if resp.status == 200:
                    return True
        except OSError:
            time.sleep(1)
    return False


def start_http():
    os.chdir(ROOT)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("127.0.0.1", PORT), QuietHandler) as httpd:
        httpd.serve_forever()


def write_link_page(url):
    html = f"""<!DOCTYPE html>
<html lang="es"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Abrir en movil</title>
<style>
body{{font-family:sans-serif;background:#1a1020;color:#fff;text-align:center;padding:1.5rem;}}
h1{{color:#e0567a;font-size:1.4rem;}}
.warn{{background:#5c2a3a;padding:12px;border-radius:10px;margin:1rem 0;font-size:.95rem;}}
.url{{background:#2a2030;padding:1rem;border-radius:12px;word-break:break-all;
font-size:1.1rem;color:#f0c896;margin:1rem 0;user-select:all;}}
img{{max-width:280px;margin:1rem auto;display:block;}}
ol{{text-align:left;max-width:360px;margin:1rem auto;line-height:1.6;}}
a.btn{{display:inline-block;background:#c44569;color:#fff;padding:14px 24px;
border-radius:10px;text-decoration:none;font-weight:600;margin-top:1rem;}}
</style></head><body>
<h1>Enlace para el movil</h1>
<div class="warn">Este enlace solo funciona mientras la ventana negra del PC esta ABIERTA.</div>
<p>Escanea el QR con el movil:</p>
<img src="https://api.qrserver.com/v1/create-qr-code/?size=280x280&data={url}" alt="QR">
<div class="url" id="url">{url}</div>
<a class="btn" href="{url}">Abrir juego aqui</a>
<ol>
<li>Escanea el QR o copia el enlace en Chrome del movil.</li>
<li>Modo <strong>Webcam</strong> o <strong>Dos moviles</strong>.</li>
<li>Uno crea sala, el otro se une con el codigo.</li>
</ol>
</body></html>"""
    LINK_PAGE.write_text(html, encoding="utf-8")
    URL_FILE.write_text(url, encoding="utf-8")


def announce_url(url):
    write_link_page(url)
    print()
    print("=" * 54)
    print("  ENLACE ACTIVO - USA ESTE (no enlaces viejos):")
    print()
    print(" ", url)
    print()
    print("  QR:", url + "/enlace-movil.html")
    print("=" * 54)
    print()
    print("  Esperando que el tunel responda...")
    if wait_tunnel_ready(url):
        print("  OK - Tunel listo.")
    else:
        print("  Aviso: el tunel tarda un poco. Prueba el enlace en 10 segundos.")
    if copy_to_clipboard(url):
        print("  Enlace copiado al portapapeles.")
    show_url_popup(url)
    try:
        webbrowser.open(url + "/enlace-movil.html")
    except OSError:
        pass


def main():
    kill_old_tunnels()
    time.sleep(0.5)

    cf = find_cloudflared()
    if not cf:
        print("ERROR: cloudflared no instalado.")
        print("Ejecuta: winget install Cloudflare.cloudflared")
        input("Pulsa Enter...")
        sys.exit(1)

    print()
    print("=" * 54)
    print("  JUEGO + ENLACE PARA MOVIL")
    print("=" * 54)
    print("  NO CIERRES ESTA VENTANA mientras juegues.")
    print("  Cada vez que abres el .bat sale un enlace NUEVO.")
    print("  Los enlaces viejos (trycloudflare) NO funcionan.")
    print()

    threading.Thread(target=start_http, daemon=True).start()
    time.sleep(1)

    proc = subprocess.Popen(
        [cf, "tunnel", "--url", f"http://127.0.0.1:{PORT}"],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
    )

    url_pattern = re.compile(r"https://[a-z0-9-]+\.trycloudflare\.com", re.I)
    url = None
    assert proc.stdout is not None
    for line in proc.stdout:
        print(line.rstrip(), flush=True)
        match = url_pattern.search(line)
        if match and not url:
            url = match.group(0)
            announce_url(url)

    proc.wait()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nTunel cerrado. El enlace ya no funciona.")
