#!/usr/bin/env python3
"""Servidor HTTPS local para modo webcam (cámara bloqueada en http://IP)."""
import datetime
import http.server
import ipaddress
import os
import socket
import socketserver
import ssl
import subprocess
import sys
from pathlib import Path

PORT = 8443
ROOT = Path(__file__).resolve().parent
CERT = ROOT / "local-cert.pem"
KEY = ROOT / "local-key.pem"


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        if args[1][0] not in ("2", "3"):
            super().log_message(format, *args)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


class ThreadedHTTPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True


def generate_cert_openssl():
    cmd = [
        "openssl",
        "req",
        "-x509",
        "-newkey",
        "rsa:2048",
        "-keyout",
        str(KEY),
        "-out",
        str(CERT),
        "-days",
        "365",
        "-nodes",
        "-subj",
        "/CN=localhost/O=PiedraPapelTijeras",
    ]
    try:
        subprocess.run(cmd, check=True, capture_output=True, text=True)
        return True
    except (FileNotFoundError, subprocess.CalledProcessError):
        return False


def generate_cert_cryptography():
    try:
        from cryptography import x509
        from cryptography.hazmat.primitives import hashes, serialization
        from cryptography.hazmat.primitives.asymmetric import rsa
        from cryptography.x509.oid import NameOID
    except ImportError:
        return False

    key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "localhost")])
    now = datetime.datetime.now(datetime.timezone.utc)

    san = [
        x509.DNSName("localhost"),
        x509.IPAddress(ipaddress.IPv4Address("127.0.0.1")),
    ]
    try:
        lan_ip = get_local_ip()
        if lan_ip and lan_ip != "TU-IP-LOCAL":
            san.append(x509.IPAddress(ipaddress.IPv4Address(lan_ip)))
    except ValueError:
        pass

    cert = (
        x509.CertificateBuilder()
        .subject_name(name)
        .issuer_name(name)
        .public_key(key.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(now)
        .not_valid_after(now + datetime.timedelta(days=365))
        .add_extension(x509.SubjectAlternativeName(san), critical=False)
        .sign(key, hashes.SHA256())
    )

    KEY.write_bytes(
        key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.TraditionalOpenSSL,
            encryption_algorithm=serialization.NoEncryption(),
        )
    )
    CERT.write_bytes(cert.public_bytes(serialization.Encoding.PEM))
    return True


def ensure_cert(force=False):
    lan_ip = get_local_ip()
    meta = ROOT / ".cert-ip"

    if (
        not force
        and CERT.exists()
        and KEY.exists()
        and meta.exists()
        and meta.read_text(encoding="utf-8").strip() == lan_ip
    ):
        return True

    print(f"Generando certificado para localhost + {lan_ip}...")
    if CERT.exists():
        CERT.unlink()
    if KEY.exists():
        KEY.unlink()

    if generate_cert_openssl() or generate_cert_cryptography():
        meta.write_text(lan_ip, encoding="utf-8")
        print("Certificado creado:", CERT.name)
        return True

    print()
    print("No se pudo crear el certificado HTTPS.")
    print("Opción A — instalar cryptography:")
    print("  pip install cryptography")
    print("  python serve-https.py")
    print()
    print("Opción B — solo probar en el PC:")
    print("  python -m http.server 8080")
    print("  Abre http://localhost:8080 (cámara funciona en localhost)")
    print()
    return False


def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except OSError:
        return "TU-IP-LOCAL"


def main():
    os.chdir(ROOT)
    if not ensure_cert():
        sys.exit(1)

    handler = QuietHandler
    with ThreadedHTTPServer(("0.0.0.0", PORT), handler) as httpd:
        ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        ctx.load_cert_chain(str(CERT), str(KEY))
        httpd.socket = ctx.wrap_socket(httpd.socket, server_side=True)
        ip = get_local_ip()
        print()
        print("=" * 52)
        print("  Servidor HTTPS — modo WEBCAM")
        print("=" * 52)
        print(f"  PC:     https://localhost:{PORT}")
        print(f"  Móvil:  https://{ip}:{PORT}")
        print()
        print("  • Acepta la advertencia del certificado (normal en local).")
        print("  • Permite cámara y micrófono en ambos dispositivos.")
        print("  • Detén con Ctrl+C")
        print("=" * 52)
        print()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor detenido.")


if __name__ == "__main__":
    main()
