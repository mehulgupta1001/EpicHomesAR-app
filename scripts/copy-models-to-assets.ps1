# Script to copy GLB models to Android assets folder
# Run this before building Android app

Write-Host "Copying GLB models to Android assets..." -ForegroundColor Green

# Create directories if they don't exist
$assetsDir = "android/app/src/main/assets/models/houses"
if (-not (Test-Path $assetsDir)) {
    New-Item -ItemType Directory -Path $assetsDir -Force | Out-Null
    Write-Host "Created directory: $assetsDir" -ForegroundColor Yellow
}

# Copy GLB files
$sourceDir = "src/assets/models/houses"
$glbFiles = Get-ChildItem "$sourceDir/*.glb"

if ($glbFiles.Count -eq 0) {
    Write-Host "No GLB files found in $sourceDir" -ForegroundColor Red
    exit 1
}

foreach ($file in $glbFiles) {
    $destPath = Join-Path $assetsDir $file.Name
    Copy-Item $file.FullName -Destination $destPath -Force
    Write-Host "Copied: $($file.Name)" -ForegroundColor Green
}

Write-Host "`nAll models copied successfully!" -ForegroundColor Green
Write-Host "Models are now in: $assetsDir" -ForegroundColor Cyan

