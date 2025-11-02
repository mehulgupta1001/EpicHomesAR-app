# Restore Android directories in node_modules
Write-Host "Restoring Android directories in node_modules..."

$directories = @(
    "node_modules/@react-native-async-storage/async-storage/android",
    "node_modules/@react-native/gradle-plugin",
    "node_modules/react-native-safe-area-context/android",
    "node_modules/react-native-screens/android",
    "node_modules/react-native-vector-icons/android",
    "node_modules/react-native-vision-camera/android"
)

foreach ($dir in $directories) {
    $hiddenDir = $dir + ".hidden"
    if (Test-Path $hiddenDir) {
        if (Test-Path $dir) {
            Remove-Item -Recurse -Force $dir
        }
        Rename-Item $hiddenDir $dir
        Write-Host "Restored: $dir"
    }
}

Write-Host "Android directories restored."





