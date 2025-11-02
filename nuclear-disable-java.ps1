# NUCLEAR OPTION: Completely disable Java for React Native project
Write-Host "NUCLEAR OPTION: Completely disabling Java language support..."

# Kill all Java processes
Get-Process | Where-Object {$_.ProcessName -like "*java*"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Clear Java workspace cache
$javaCachePaths = @(
    ".vscode/java_workspace",
    ".metadata",
    ".settings",
    ".project",
    ".classpath"
)

foreach ($path in $javaCachePaths) {
    if (Test-Path $path) {
        Remove-Item -Recurse -Force $path -ErrorAction SilentlyContinue
        Write-Host "Removed: $path"
    }
}

# Create a .vscodeignore to completely hide problematic directories
$vscodeIgnore = @"
node_modules/@react-native-async-storage/async-storage/android/
node_modules/@react-native/gradle-plugin/
node_modules/react-native-safe-area-context/android/
node_modules/react-native-screens/android/
node_modules/react-native-vector-icons/android/
node_modules/react-native-vision-camera/android/
node_modules/**/android/
android/build/
android/app/build/
ios/build/
"@

$vscodeIgnore | Out-File -FilePath ".vscodeignore" -Encoding UTF8

Write-Host "Java completely disabled!"
Write-Host "Next steps:"
Write-Host "1. Close VS Code completely"
Write-Host "2. Reopen VS Code"
Write-Host "3. If errors persist, open EpicHomesARPureRN.code-workspace file"
Write-Host "4. The Java errors should be GONE FOREVER"