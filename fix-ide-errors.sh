# React Native IDE Error Fix Script
# Run this if you get Java/Eclipse errors in node_modules

echo "Fixing React Native IDE errors..."

# Clean Android build
echo "Cleaning Android build..."
cd android
./gradlew clean
cd ..

# Clear Metro cache
echo "Clearing Metro cache..."
npx react-native start --reset-cache &

# Kill Metro after a few seconds
sleep 3
pkill -f "react-native start"

echo "Done! Please restart your IDE (VS Code) to apply the fixes."
echo "The .vscode/settings.json file has been configured to exclude node_modules from Java workspace."




