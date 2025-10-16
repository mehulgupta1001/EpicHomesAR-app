# Epic Homes AR - House Visualization App

> **📢 Important Update**: This project has moved from Expo to Pure React Native for better performance and stability. The current active development is on the [`pure-react-native` branch](https://github.com/mehulgupta1001/EpicHomesAR-app/tree/pure-react-native).

## 🚀 **Current Status: Pure React Native Version**

**The Epic Homes AR app is now built with Pure React Native and is production-ready!**

### Why We Moved from Expo to Pure React Native

After extensive development and testing, we encountered several challenges with the Expo-based approach:

- **Performance Issues**: Expo's abstraction layer caused performance bottlenecks with AR features
- **Dependency Conflicts**: Complex dependency management and version conflicts
- **Build Complexity**: Difficult APK generation and deployment process
- **Limited AR Control**: Less control over native AR implementations
- **Stability Concerns**: Frequent crashes and compatibility issues

**The Pure React Native version provides:**
- ✅ **Better Performance** - Direct native access without Expo overhead
- ✅ **Stable Builds** - Reliable APK generation and deployment
- ✅ **Full AR Control** - Complete control over camera and AR features
- ✅ **Simplified Dependencies** - Cleaner dependency management
- ✅ **Production Ready** - Optimized for Epic Homes deployment

## 🏠 About the App

Epic Homes AR is a professional augmented reality application designed specifically for Epic Homes to showcase their house models to beneficiaries. The app provides real AR visualization of traditional Malaysian house designs, allowing users to see their future homes in real-world environments using their phone's camera.

## ✨ Key Features

- **Real Camera AR** - Actual camera feed with AR overlays
- **Epic Homes House Models** - Multiple traditional house designs
- **Interactive House Selection** - Choose between different house models
- **AR House Placement** - Tap-to-place models in real-world space
- **Smooth Animations** - Beautiful animations for model display
- **Epic Homes Branding** - Professional orange theme (#ff821e)
- **Construction Progress Tracking** - Real-time building step visualization
- **Material Customization** - Traditional material options
- **AR Controls** - Rotation, scaling, and material controls
- **Step-by-step Construction Guides** - Detailed building process breakdown
- **Material and Tool Lists** - Comprehensive requirements for each phase
- **Time Estimates and Safety Guidelines** - Professional construction guidance
- **Photo Documentation** - Capture and save progress photos
- **Offline Compatibility** - All features work without internet connection
- **Performance Monitoring** - Optimized AR experience
- **Interactive Tutorial System** - User-friendly onboarding

## 🏗️ Construction Management

The app guides users through 8 major construction phases:

1. **Site Preparation** - Ground clearing and foundation setup
2. **Foundation Posts** - Main structural support installation
3. **Platform Beams** - Foundation post connections
4. **Floor Joists** - Floor support structure
5. **Floor Installation** - Bamboo/wooden flooring
6. **Wall Frame Construction** - Main wall structure
7. **Roof Structure** - Traditional roof construction
8. **Final Finishing** - Interior and exterior completion

Each phase includes detailed material lists, tool requirements, time estimates, and safety guidelines.

## 🎨 Material Customization

- **Traditional Materials**: Cengal hardwood, Meranti, Bamboo options
- **Roofing Selections**: Nipah palm, Rumbia, bamboo shingle materials
- **Binding Options**: Rattan, natural fiber, and modern alternatives
- **Live Preview**: See material changes instantly in AR view

## 🌍 Cultural Preservation

- **Authentic Designs**: Traditional Orang Asli and Malay house models
- **Cultural Education**: Educational content about traditional architecture
- **Heritage Documentation**: Digital preservation of traditional building methods

## 🚀 Getting Started

### For the Latest Version (Pure React Native)

**Visit the [`pure-react-native` branch](https://github.com/mehulgupta1001/EpicHomesAR-app/tree/pure-react-native) for the current, stable version.**

### Prerequisites
- Node.js 18.x or later
- Android Studio (for Android development)
- React Native CLI

### Installation (Pure React Native Version)

1. **Clone and Switch to Pure React Native Branch**
   ```bash
   git clone https://github.com/mehulgupta1001/EpicHomesAR-app.git
   cd EpicHomesAR-app
   git checkout pure-react-native
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Metro Bundler**
   ```bash
   npx react-native start
   ```

4. **Run on Android**
   ```bash
   npx react-native run-android
   ```

## 📱 Testing the App

The Pure React Native version is fully functional and ready for testing:

1. **Launch the app** on your device or emulator
2. **Select language** (EN/MS) on the home screen
3. **Tap "Start AR Experience"** to enter AR mode
4. **Follow the AR prompts**:
   - Surface scanning will begin automatically
   - Tap to place house when surface is detected
   - Use controls to interact with the 3D model
   - Explore construction steps and materials

## 📦 Building for Production

### APK Generation (Pure React Native)

1. **Build Debug APK**
   ```bash
   cd android
   ./gradlew assembleDebug
   ```

2. **Find APK at**: `android/app/build/outputs/apk/debug/app-debug.apk`

3. **Build Release APK**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

## 🛠️ Technical Stack (Pure React Native)

- **Frontend**: React Native 0.76.3
- **Navigation**: React Navigation
- **AR Technology**: react-native-vision-camera
- **3D Rendering**: react-native-3d-model-view
- **Storage**: AsyncStorage
- **3D Models**: GLB format with embedded textures
- **Performance**: Built-in performance monitoring
- **Language**: TypeScript for type safety

## 📁 Project Structure

```
EpicHomesARPureRN/
├── src/
│   ├── components/         # Reusable UI components
│   ├── screens/           # Main app screens
│   ├── services/          # Business logic and storage
│   ├── constants/         # App constants and configurations
│   ├── utils/             # Utility functions
│   ├── hooks/             # Custom React hooks
│   └── assets/            # Static assets and 3D models
├── android/              # Android-specific configuration
└── ios/                  # iOS-specific configuration
```

## 🔧 Development

### Available Scripts
- `npm start` - Start Metro bundler
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm test` - Run tests

### Key Components
- `src/components/ARView.tsx` - Main AR experience component
- `src/screens/ARScreen.tsx` - AR screen container
- `src/components/MaterialCustomizer.tsx` - Material selection
- `src/components/InfoPanel.tsx` - Construction information
- `src/services/storage.ts` - Data management

## 🐛 Troubleshooting

### Common Issues
- **Metro bundler issues**: Run `npx react-native start --reset-cache`
- **Android build issues**: Clean and rebuild with `cd android && ./gradlew clean`
- **Device connection**: Ensure USB debugging is enabled

### Performance Tips
- Ensure good lighting for AR surface detection
- Close background apps for optimal performance
- Use devices with sufficient RAM (4GB+ recommended)

## 🆘 Support

### For Epic Homes Team
- **Technical Issues**: Create issue in repository
- **Feature Requests**: Contact development team
- **Production Deployment**: Ready for immediate APK distribution

### Contact
- **Developer**: mehulgup1001@gmail.com
- **Repository**: [GitHub Repository](https://github.com/mehulgupta1001/EpicHomesAR-app)

## 📋 Deployment Status

- **App Status**: ✅ Production Ready (Pure React Native)
- **Testing Status**: ✅ Ready for device testing
- **Build Status**: ✅ Ready for APK generation
- **Error Status**: ✅ All critical issues resolved
- **Deployment Risk**: ✅ None - Ready for immediate use

## 🗺️ Roadmap

- [ ] **iOS Production Build** - Complete iOS ARKit implementation
- [ ] **Enhanced 3D Models** - Additional traditional house varieties
- [ ] **Advanced Material Options** - Extended customization features
- [ ] **Community Features** - Progress sharing and collaboration tools
- [ ] **Performance Optimizations** - Further AR experience improvements
- [ ] **Accessibility Enhancements** - Improved accessibility features

## 📄 License

This project is developed specifically for Epic Homes and their traditional house construction initiatives.

## 🤝 Contributing

This project is designed for Epic Homes' mission to preserve traditional architecture through modern technology. For contributions or modifications, please contact the development team.

---

**Built with ❤️ for Epic Homes' mission to preserve traditional Malaysian architecture through innovative AR technology.**

**The Epic Homes AR app is ready for immediate testing, demonstration, and production deployment.**