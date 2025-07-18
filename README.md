# Epic Homes AR - Traditional House Visualizer

An advanced augmented reality application for visualizing and constructing traditional Orang Asli and Malay houses, built with React Native, Expo, and React Viro AR technology.

## 🏠 About the App

Epic Homes AR is a comprehensive AR-powered construction visualization tool designed to help builders, architects, and communities visualize traditional house designs in real-world environments. The app provides detailed construction guides, material customization, and progress tracking for traditional Malaysian house construction.

## ✨ Key Features

### 🥽 Augmented Reality Visualization
- **Real-time AR Placement**: Place 3D house models in your actual environment
- **Multiple House Types**: Choose from traditional Orang Asli and Malay house designs
- **Interactive 3D Models**: High-quality GLB models with realistic textures
- **Measurement Overlays**: Real-time dimension display and measurement tools
- **Gesture Controls**: Rotate and manipulate models with touch gestures

### 🏗️ Construction Management
- **Step-by-Step Guides**: Detailed construction process with 8 major phases
- **Material Lists**: Comprehensive material and tool requirements for each step
- **Time Estimates**: Realistic time projections for each construction phase
- **Safety Guidelines**: Built-in safety notes and best practices
- **Progress Tracking**: Track completion status and add notes for each step

### 🎨 Material Customization
- **Traditional Materials**: Cengal hardwood, Meranti, Bamboo, Nipah palm leaves
- **Roofing Options**: Nipah, Rumbia, and bamboo shingle materials
- **Binding Materials**: Rattan, natural fiber, and modern binding options
- **Real-time Preview**: See material changes instantly in AR view

### 📱 User Experience
- **Offline Functionality**: Works without internet connection
- **Photo Documentation**: Capture and save construction progress photos
- **Progress Sharing**: Export and share construction progress reports
- **Tutorial System**: Interactive onboarding for new users
- **Performance Monitoring**: Built-in performance tracking and optimization

### 🌍 Cultural Preservation
- **Traditional Designs**: Authentic Orang Asli and Malay house models
- **Cultural Information**: Educational content about traditional architecture
- **Heritage Preservation**: Digital documentation of traditional building methods

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version)
- [Git](https://git-scm.com/)
- [Android Studio](https://developer.android.com/studio) with Android SDK and NDK
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/mehulgupta1001/EpicHomesAR-app.git
   cd EpicHomesAR-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run in Development Mode**
   ```bash
   npx expo start
   ```

4. **Test on Device**
   - Install Expo Go from [App Store](https://apps.apple.com/us/app/expo-go/id982107779) (iOS) or [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) (Android)
   - Scan the QR code with your device
   - Ensure your device and computer are on the same WiFi network

## 📦 Building for Production

### Generate Native Project
```bash
npx expo prebuild --clean
```

### Build APK (Android)
1. Open the `android` folder in Android Studio
2. Wait for Gradle sync to complete
3. Go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**
4. Find the APK at: `android/app/build/outputs/apk/debug/app-debug.apk`

## 🏗️ Construction Phases

The app includes detailed guides for 8 major construction phases:

1. **Site Preparation** - Ground clearing and foundation marking
2. **Foundation Posts** - Installing main support posts
3. **Platform Beams** - Connecting foundation posts with beams
4. **Floor Joists** - Installing floor support structure
5. **Floor Installation** - Bamboo/wooden floor board installation
6. **Wall Frame Construction** - Erecting main wall frames
7. **Roof Structure** - Traditional pitched roof construction
8. **Final Finishing** - Interior and exterior completion

Each phase includes:
- Detailed material lists
- Required tools
- Time estimates
- Safety guidelines
- Progress tracking

## 🛑 Known Issues
- Some Android devices may not support ARCore. See troubleshooting below.
- AR tracking may fail in low light or on reflective surfaces.
- If assets/models are not loading, ensure you have sufficient storage and permissions.

## 🛠️ ARCore/ARKit Troubleshooting
- **Android:** Ensure your device supports ARCore. Install/update Google Play Services for AR from the Play Store.
- **iOS:** ARKit requires iOS 11+ and a compatible device (iPhone 6s or newer).
- **General:** Restart the app and ensure all permissions are granted. Try clearing the app cache if issues persist.

## 📦 Updating Models/Assets
- Place new `.glb` models in `assets/models/houses/` and reference them in `app/constants/assets.ts`.
- Add new images/textures to `assets/images/` and update references in `app/constants/assets.ts`.
- Update `app/constants/houseTypes.ts` to register new house types or models.

## 🔒 Privacy & Permissions
- The app only requests permissions required for AR, photo documentation, and offline storage.
- No personal data is collected or shared. See `PRIVACY_POLICY.md` for details.

## 🛠️ Technical Stack

- **Frontend**: React Native 0.71.14
- **AR Engine**: React Viro 2.43.0
- **Framework**: Expo SDK 53
- **Navigation**: React Navigation 6
- **Storage**: AsyncStorage for offline data
- **3D Models**: GLB format with embedded textures
- **Performance**: Custom performance monitoring system

## 📁 Project Structure

```
EpicHomesAR-app/
├── app/                    # Main application code
│   ├── components/         # Reusable UI components
│   ├── screens/           # Main app screens
│   ├── services/          # Business logic and storage
│   ├── constants/         # App constants and configurations
│   └── utils/             # Utility functions
├── assets/                # Static assets
│   ├── models/           # 3D house models
│   └── images/           # App images and textures
├── android/              # Android-specific configuration
└── components/           # Shared UI components
```

## 🔧 Development

### Available Scripts
- `npm start` - Start development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run prebuild` - Generate native project files

### Key Components
- `ARScreen.tsx` - Main AR experience screen
- `ARView.tsx` - AR visualization component
- `MaterialCustomizer.tsx` - Material selection interface
- `InfoPanel.tsx` - Construction information display
- `OfflineManager.ts` - Offline data management

## 🐛 Troubleshooting

### Common Issues
- **"Port already in use"**: Run `npx kill-port 19000` then restart
- **App crashes on start**: Clear cache with `npx expo start --clear`
- **AR not working**: Ensure good lighting and clear surfaces
- **Build failures**: Update Android Studio, SDK, and NDK

### Performance Tips
- Use devices with ARCore support for best performance
- Ensure adequate lighting for AR tracking
- Close background apps to free up memory
- Use the performance monitor to identify bottlenecks

## 📄 License

This project is developed for Epic Homes and is proprietary software.

## 🤝 Contributing

This project is specifically developed for Epic Homes' traditional house construction initiatives. For questions or support, please contact the development team.

## 📞 Support

For technical support or feature requests, please create an issue in the repository or contact:
mehulgup1001@gmail.com

---

**Built with ❤️ for Epic Homes' mission to preserve traditional architecture through modern technology.**
