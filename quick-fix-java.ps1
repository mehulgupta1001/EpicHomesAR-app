# Quick fix for Java errors - disable Java extensions
Write-Host "Disabling Java extensions for this workspace..."

# Create a simple settings file that completely disables Java
$settings = @"
{
  "java.import.gradle.enabled": false,
  "java.import.gradle.wrapper.enabled": false,
  "java.project.importOnFirstTimeStartup": "disabled",
  "java.configuration.updateBuildConfiguration": "disabled",
  "java.autobuild.enabled": false,
  "java.maxConcurrentBuilds": 0,
  "java.compile.nullAnalysis.mode": "disabled",
  "java.import.exclusions": ["**/node_modules/**", "**/android/**"],
  "files.exclude": {"**/node_modules": true, "**/android/build": true},
  "search.exclude": {"**/node_modules": true, "**/android/build": true}
}
"@

$settings | Out-File -FilePath ".vscode/settings.json" -Encoding UTF8

Write-Host "Java extensions disabled. Please:"
Write-Host "1. Close VS Code completely"
Write-Host "2. Reopen VS Code"
Write-Host "3. If errors persist, go to Extensions and disable 'Extension Pack for Java'"


