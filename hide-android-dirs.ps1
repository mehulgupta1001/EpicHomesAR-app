# Hide Android directories in node_modules to stop Java errors
Write-Host "Hiding Android directories in node_modules..."

$directories = @(
    "node_modules/@react-native-async-storage/async-storage/android",
    "node_modules/@react-native/gradle-plugin",
    "node_modules/react-native-safe-area-context/android",
    "node_modules/react-native-screens/android",
    "node_modules/react-native-vector-icons/android",
    "node_modules/react-native-vision-camera/android"
)

foreach ($dir in $directories) {
    if (Test-Path $dir) {
        $hiddenDir = $dir + ".hidden"
        if (Test-Path $hiddenDir) {
            Remove-Item -Recurse -Force $hiddenDir
        }
        Rename-Item $dir $hiddenDir
        Write-Host "Hidden: $dir"
    }
}

Write-Host "Android directories hidden. Restart VS Code."
Write-Host "To restore: run restore-android-dirs.ps1"





