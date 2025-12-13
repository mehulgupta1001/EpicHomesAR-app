# Epic Homes AR — Visual Housing Prototype (React Native)

**One-line purpose**  
Epic Homes AR helps indigenous families preview and compare house layouts in augmented reality before construction, reducing costly rework and helping families choose materials and layouts with confidence.

**Progress snapshot**  
Active development since June — UI complete; AR core fully functional. [View commit history](https://github.com/mehulgupta1001/EpicHomesAR-app/commits/pure-react-native)

---

## 📱 Quick Overview

Epic Homes AR is a bilingual (English/Malay) mobile application that allows users to visualize traditional Malaysian indigenous house designs in augmented reality. The app enables families and communities to:

- **Visualize** house designs in their actual environment using AR
- **Compare** different module sizes (1, 2, 4, and 6 modules) and color variants (Blue, Green, Brown)
- **Interact** with 3D models through rotation, scaling, and translation gestures
- **Explore** traditional house designs with cultural information
- **Use offline** - all models and features work without internet connection

---

## ✨ Key Features

### Core Functionality
- ✅ **AR Visualization** - Place and view house models in real-world environment
- ✅ **12 House Variants** - 1, 2, 4, and 6 module houses in Blue, Green, and Brown
- ✅ **Gesture Controls** - Rotate, scale, and translate models with touch gestures
- ✅ **House Selector** - Easy-to-use horizontal scrolling interface to select house designs
- ✅ **Bilingual Support** - English and Bahasa Melayu (Malay) language support
- ✅ **Offline Mode** - All models and features work without internet connection
- ✅ **Error Handling** - Comprehensive error boundaries and user-friendly error messages

### Technical Features
- ✅ **ARCore Integration** - Native Android AR support via react-native-ar-viewer
- ✅ **Custom Scaling** - Model-specific initial scales for optimal viewing
- ✅ **Centered Models** - All models properly centered for accurate AR placement
- ✅ **Performance Optimized** - Works on Android devices from 2019 onwards

---

## 🏗️ Available House Models

### Epic Homes Module Houses
- **1 Module** - Blue, Green, Brown (centered models)
- **2 Module** - Blue, Green, Brown (centered models)
- **4 Module** - Blue, Green, Brown (centered models)
- **6 Module** - Blue, Green, Brown (centered models)

### Traditional Houses
- **Traditional Malay House** - Detailed traditional architecture
- **Default House** - Basic traditional house model

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **Android Studio** with Android SDK
- **Android device** with ARCore support (Android 7.0+)
- **ARCore** installed from Google Play Store (on device)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mehulgupta1001/EpicHomesAR-app.git
   cd EpicHomesAR-app
   git checkout pure-react-native
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install patches** (automatically runs via postinstall script)
   ```bash
   npm run postinstall
   ```

4. **Connect Android device** or start emulator
   - Enable USB debugging on your Android device
   - Ensure ARCore is installed (required for AR functionality)

5. **Run the app**
   ```bash
   npm run android
   # or
   yarn android
   ```

---

## 📖 Usage Guide

### For Users

1. **Start the App**
   - Launch the app on your Android device
   - Grant camera permissions when prompted (required for AR)

2. **Select a House Design**
   - Scroll horizontally through available house designs
   - Tap on a house card to select it
   - Each card shows house name and dimensions

3. **Start AR Experience**
   - Tap "Start AR Experience" button
   - Point your camera at a flat surface (floor, table, etc.)
   - Wait for surface detection (you'll see visual feedback)

4. **Place the House Model**
   - Tap on the detected surface to place the house model
   - The model will appear centered on the surface

5. **Interact with the Model**
   - **Rotate**: Swipe horizontally with one finger to rotate
   - **Scale**: Pinch with two fingers to zoom in/out
   - **Move**: Drag with one finger to reposition (if enabled)

6. **Switch Language**
   - Tap the language toggle button (EN/MS) in the top-right corner
   - The entire UI will switch between English and Malay

### For Developers

#### Project Structure
```
src/
├── assets/              # Images and 3D models
│   ├── images/         # App icons, logos, thumbnails
│   └── models/         # GLB 3D model files
├── components/          # React components
│   ├── RealARView.tsx  # Main AR viewer component
│   ├── HouseSelector.tsx # House selection UI
│   └── ...
├── constants/           # Constants and configurations
│   ├── assets.ts       # Asset path definitions
│   ├── houseTypes.ts   # House type definitions
│   ├── i18n.ts         # Internationalization
│   └── values.ts       # App-wide constants
├── screens/            # Screen components
│   ├── HomeScreen.tsx  # Home/landing screen
│   └── ARScreen.tsx    # AR experience screen
└── services/           # Business logic services
    ├── ModelLoader.ts  # Model loading utilities
    └── OfflineManager.ts # Offline asset management
```

#### Key Files

- **`App.tsx`** - Main app entry point and navigation
- **`src/components/RealARView.tsx`** - AR viewer wrapper
- **`src/constants/assets.ts`** - Centralized asset paths
- **`src/constants/houseTypes.ts`** - House type definitions
- **`android/app/src/main/assets/models/houses/`** - Native Android assets folder (GLB files must be here)

#### Adding New House Models

1. **Add GLB file** to `src/assets/models/houses/`
2. **Add asset path** in `src/constants/assets.ts`
3. **Add house definition** in `src/constants/houseTypes.ts`
4. **Copy GLB file** to `android/app/src/main/assets/models/houses/`
5. **Update scale logic** in `node_modules/react-native-ar-viewer/android/src/main/java/com/reactnativearviewer/ArViewerView.kt` (if needed)

#### Modifying Native AR Code

The app uses patched versions of `react-native-ar-viewer`. Patches are stored in `patches/` and applied automatically via `patch-package`.

To modify AR behavior:
1. Edit files in `node_modules/react-native-ar-viewer/android/src/main/java/com/reactnativearviewer/`
2. Run `npx patch-package react-native-ar-viewer` to create/update patch
3. Commit the patch file to version control

---

## 🔧 Troubleshooting

### AR Not Working

**Problem**: AR session fails or models don't appear

**Solutions**:
1. **Check ARCore installation**
   - Ensure ARCore is installed from Google Play Store
   - Update ARCore to latest version
   - Restart device after installing/updating ARCore

2. **Check device compatibility**
   - Device must support ARCore (check [ARCore supported devices](https://developers.google.com/ar/discover/supported-devices))
   - Android 7.0 (API level 24) or higher required

3. **Check permissions**
   - Grant camera permission when prompted
   - Check app permissions in device settings

4. **Check lighting**
   - AR requires good lighting for surface detection
   - Avoid very dark or very bright environments
   - Point camera at textured surfaces (not mirrors or plain walls)

5. **Check model files**
   - Ensure GLB files exist in `android/app/src/main/assets/models/houses/`
   - Verify file names match exactly (case-sensitive)

### Models Not Loading

**Problem**: "AR session failed because they couldn't load the model"

**Solutions**:
1. **Verify file exists** in `android/app/src/main/assets/models/houses/`
2. **Check file name** matches exactly (including spaces and "(centered)" suffix)
3. **Rebuild app** after adding new models:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npm run android
   ```

### App Crashes on Launch

**Problem**: App crashes immediately after opening

**Solutions**:
1. **Check Metro bundler** is running (`npm start`)
2. **Clear cache and rebuild**:
   ```bash
   npm start -- --reset-cache
   cd android
   ./gradlew clean
   cd ..
   npm run android
   ```
3. **Check device logs**:
   ```bash
   adb logcat | grep -i "react\|error\|exception"
   ```

### Language Not Switching

**Problem**: Language toggle doesn't change UI text

**Solutions**:
1. **Check i18n integration** - Ensure components use `t()` function from `src/constants/i18n.ts`
2. **Verify translation keys** exist in both `en` and `ms` objects
3. **Restart app** after language change (if needed)

---

## 📋 Requirements

### Device Requirements
- **Android** 7.0 (API level 24) or higher
- **ARCore** support (check [supported devices list](https://developers.google.com/ar/discover/supported-devices))
- **Camera** with autofocus
- **RAM** 2GB minimum (3GB+ recommended)
- **Storage** 500MB free space

### Development Requirements
- **Node.js** 18.x or higher
- **npm** or **yarn**
- **Android Studio** with Android SDK
- **Java Development Kit (JDK)** 11 or higher
- **Android device** with USB debugging enabled (or emulator with ARCore support)

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] App launches without crashes
- [ ] All house models load correctly
- [ ] AR surface detection works
- [ ] Models place correctly on detected surfaces
- [ ] Rotation gesture works (horizontal swipe)
- [ ] Scaling gesture works (pinch to zoom)
- [ ] Translation gesture works (drag to move)
- [ ] Language switching works (EN ↔ MS)
- [ ] All UI text translates correctly
- [ ] House selector scrolls smoothly
- [ ] App works offline (disable WiFi/data)
- [ ] Error messages display correctly

### Testing on Different Devices

Test on at least 3 different Android devices:
1. **High-end device** (Samsung S23, Pixel 7, etc.)
2. **Mid-range device** (Samsung A series, etc.)
3. **Low-end device** (older devices with minimum specs)

---

## 📝 Known Issues & Limitations

### Current Limitations
- **iOS support** - Not yet implemented (Android only)
- **Model textures** - Some models may not display textures correctly
- **Performance** - May be slower on older/low-end devices
- **AR accuracy** - Surface detection may vary based on lighting and surface texture

### Planned Improvements
- [ ] iOS support via ARKit
- [ ] Additional house model variants
- [ ] Material customization UI
- [ ] Photo documentation features
- [ ] Construction progress tracking
- [ ] Export/share functionality

---

## 🤝 Contributing

This is a prototype project for Epic Homes. For contributions or questions, please contact:

**Mehul Gupta**  
Email: mehulgup1001@gmail.com

---

## 📄 License

This project is proprietary software developed for Epic Homes. All rights reserved.

---

## 🙏 Acknowledgments

- **Epic Homes** - For the opportunity and collaboration
- **React Native Community** - For the excellent framework
- **react-native-ar-viewer** - For AR functionality
- **ARCore** - For Android AR capabilities

---

## 📚 Additional Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [ARCore Developer Guide](https://developers.google.com/ar/develop)
- [React Native AR Viewer](https://github.com/akshay2211/react-native-ar-viewer)
- [ARCore Supported Devices](https://developers.google.com/ar/discover/supported-devices)

---

### Contact / Verification

**Mehul Gupta** — mehulgup1001@gmail.com  
**Proof**: Public commit history (link above), UI screenshots in `/screenshots`, and Epic Homes email confirming prototype review available on request.

---

**Last Updated**: December 2025  
**Version**: 0.9.7 (Development)  
**Branch**: `pure-react-native`
