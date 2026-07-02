# Install newest APK on all connected physical Android devices (skips emulators)
# Run from repo root: .\scripts\install-apk-on-devices.ps1

$apkPath = "APK Working Prototype - 2026-01-27\Epic Homes AR Visualizer V3.apk"
if (-not (Test-Path $apkPath)) {
    Write-Host "APK not found: $apkPath" -ForegroundColor Red
    exit 1
}

$deviceLines = adb devices | Select-Object -Skip 1
$physicalDevices = @()
foreach ($line in $deviceLines) {
    $line = $line.Trim()
    if (-not $line) { continue }
    $parts = $line -split '\s+', 2
    $id = $parts[0]
    $status = $parts[1]
    if ($id -like 'emulator*') { continue }
    if ($status -eq 'device') {
        $physicalDevices += $id
    }
}

if ($physicalDevices.Count -eq 0) {
    Write-Host "No physical devices found (emulators are skipped). Connect phones with USB debugging enabled." -ForegroundColor Yellow
    adb devices -l
    exit 0
}

Write-Host "Installing APK on $($physicalDevices.Count) device(s)..." -ForegroundColor Green
foreach ($id in $physicalDevices) {
    Write-Host "  Installing on $id ..." -ForegroundColor Cyan
    adb -s $id install -r $apkPath
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  Done: $id" -ForegroundColor Green
    } else {
        Write-Host "  Failed: $id" -ForegroundColor Red
    }
}
