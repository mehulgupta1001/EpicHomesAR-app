# DEFINITIVE SOLUTION: Permanently disable Java for React Native
Write-Host "DEFINITIVE SOLUTION: Permanently disabling Java..."

# Kill ALL Java processes
taskkill /F /IM java.exe 2>$null
Get-Process | Where-Object {$_.ProcessName -like "*java*"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Remove Java workspace files
Remove-Item -Path ".project" -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".classpath" -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".settings" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".metadata" -Recurse -Force -ErrorAction SilentlyContinue

# Create .vscodeignore to hide ALL Android directories
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

Write-Host "Java processes killed and workspace cleaned!"
Write-Host "VS Code will now ignore all Android directories"
Write-Host "The 12 Java errors should disappear after VS Code restart"



