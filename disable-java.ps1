# Disable Java Language Server for React Native Project
Write-Host "Disabling Java Language Server for React Native project..."

# Kill any running Java language server processes
Get-Process | Where-Object {$_.ProcessName -like "*java*" -and $_.CommandLine -like "*language-server*"} | Stop-Process -Force

# Clear Java workspace cache
if (Test-Path ".vscode/java_workspace") {
    Remove-Item -Recurse -Force ".vscode/java_workspace"
}

# Clear Java project cache
if (Test-Path ".metadata") {
    Remove-Item -Recurse -Force ".metadata"
}

Write-Host "Java Language Server disabled. Please restart VS Code."
Write-Host "If errors persist, consider disabling the Java Extension Pack extension."



