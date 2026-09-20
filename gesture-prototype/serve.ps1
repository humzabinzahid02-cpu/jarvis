# Lightweight Local Server for JARVIS Gesture Prototype
# Serves on http://localhost:8080 to unlock Web Speech API & Camera in Chrome
$port = 8080
$prefix = "http://localhost:$port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "  JARVIS Local Server Active at $prefix" -ForegroundColor Green
    Write-Host "  Chrome SpeechRecognition & Camera Unlocked!" -ForegroundColor Yellow
    Write-Host "  Press Ctrl+C in this window to stop the server." -ForegroundColor White
    Write-Host "==========================================================" -ForegroundColor Cyan

    Start-Process "$prefix`index.html"

    $mimeTypes = @{
        ".html" = "text/html"
        ".htm"  = "text/html"
        ".js"   = "application/javascript"
        ".css"  = "text/css"
        ".json" = "application/json"
        ".png"  = "image/png"
        ".jpg"  = "image/jpeg"
        ".jpeg" = "image/jpeg"
        ".svg"  = "image/svg+xml"
        ".ico"  = "image/x-icon"
        ".gz"   = "application/gzip"
        ".bin"  = "application/octet-stream"
        ".csv"  = "text/csv"
        ".wasm" = "application/wasm"
    }

    $workspaceRoot = Split-Path $PSScriptRoot -Parent

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawUrl = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($rawUrl)) {
            $rawUrl = "index.html"
        }

        # Check in gesture-prototype first, then workspace root (for flybrain)
        $localPath = Join-Path $PSScriptRoot $rawUrl
        if (-not (Test-Path $localPath -PathType Leaf)) {
            $altPath = Join-Path $workspaceRoot $rawUrl
            if (Test-Path $altPath -PathType Leaf) {
                $localPath = $altPath
            }
        }

        if (Test-Path $localPath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
            $mime = "application/octet-stream"
            if ($mimeTypes.ContainsKey($ext)) {
                $mime = $mimeTypes[$ext]
            }

            $bytes = [System.IO.File]::ReadAllBytes($localPath)
            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("File Not Found")
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.Close()
    }
} catch {
    Write-Host "Server stopped: $_" -ForegroundColor Red
} finally {
    $listener.Stop()
}
