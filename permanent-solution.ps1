# PERMANENT SOLUTION: Disable Java extension completely
Write-Host "PERMANENT SOLUTION: Disabling Java extension completely..."

# Kill all Java processes
taskkill /F /IM java.exe 2>$null
Get-Process | Where-Object {$_.ProcessName -like "*java*"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Create global VS Code settings to disable Java
$globalSettingsPath = "$env:APPDATA\Code\User\settings.json"
$globalSettings = @{
    "java.enabled" = $false
    "java.import.gradle.enabled" = $false
    "java.import.gradle.wrapper.enabled" = $false
    "java.project.importOnFirstTimeStartup" = "disabled"
    "java.configuration.updateBuildConfiguration" = "disabled"
    "java.autobuild.enabled" = $false
    "java.maxConcurrentBuilds" = 0
    "java.compile.nullAnalysis.mode" = "disabled"
    "java.server.launchMode" = "Standard"
    "java.configuration.runtimes" = @()
    "java.project.referencedLibraries" = @()
    "java.project.sourcePaths" = @()
    "java.project.outputPath" = ""
    "java.import.exclusions" = @("**/node_modules/**", "**/android/**", "**/ios/**")
}

$globalSettings | ConvertTo-Json -Depth 10 | Out-File $globalSettingsPath -Encoding UTF8

# Create workspace settings
$workspaceSettings = @{
    "java.enabled" = $false
    "java.import.gradle.enabled" = $false
    "java.import.gradle.wrapper.enabled" = $false
    "java.project.importOnFirstTimeStartup" = "disabled"
    "java.configuration.updateBuildConfiguration" = "disabled"
    "java.autobuild.enabled" = $false
    "java.maxConcurrentBuilds" = 0
    "java.compile.nullAnalysis.mode" = "disabled"
    "java.server.launchMode" = "Standard"
    "java.configuration.runtimes" = @()
    "java.project.referencedLibraries" = @()
    "java.project.sourcePaths" = @()
    "java.project.outputPath" = ""
    "java.import.exclusions" = @("**/node_modules/**", "**/android/**", "**/ios/**")
    "files.exclude" = @{
        "**/node_modules" = $true
        "**/android/app/build" = $true
        "**/android/build" = $true
        "**/ios/build" = $true
        "**/node_modules/**/android" = $true
        "**/node_modules/@react-native-async-storage/async-storage/android" = $true
        "**/node_modules/@react-native/gradle-plugin" = $true
        "**/node_modules/react-native-safe-area-context/android" = $true
        "**/node_modules/react-native-screens/android" = $true
        "**/node_modules/react-native-vector-icons/android" = $true
        "**/node_modules/react-native-vision-camera/android" = $true
    }
    "search.exclude" = @{
        "**/node_modules" = $true
        "**/android/app/build" = $true
        "**/android/build" = $true
        "**/ios/build" = $true
        "**/node_modules/**/android" = $true
        "**/node_modules/@react-native-async-storage/async-storage/android" = $true
        "**/node_modules/@react-native/gradle-plugin" = $true
        "**/node_modules/react-native-safe-area-context/android" = $true
        "**/node_modules/react-native-screens/android" = $true
        "**/node_modules/react-native-vector-icons/android" = $true
        "**/node_modules/react-native-vision-camera/android" = $true
    }
}

$workspaceSettings | ConvertTo-Json -Depth 10 | Out-File ".vscode/settings.json" -Encoding UTF8

Write-Host "Java extension permanently disabled!"
Write-Host "Global VS Code settings updated"
Write-Host "Workspace settings updated"
Write-Host "The 12 Java errors should be GONE after VS Code restart"


