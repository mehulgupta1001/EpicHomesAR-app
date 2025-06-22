# Epic Homes AR

An augmented reality application for visualizing and constructing traditional Orang Asli houses, built with React Native and Expo.

---

## 🚀 Getting Started

This guide is for developers who want to set up, run, and build the application.

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version)
- [Git](https://git-scm.com/)
- [Android Studio](https://developer.android.com/studio) with the Android SDK and NDK installed.

### 1. Clone the Repository

First, clone the project to your local machine:

```bash
git clone https://github.com/mehulgupta1001/EpicHomesAR-app.git
cd EpicHomesAR-app
```

### 2. Install Dependencies

Install the required `npm` packages:

```bash
npm install
```

### 3. Run the App in Development

To run the app on your phone for development and testing, you'll need the **Expo Go** app.

1.  **Install Expo Go:**
    - Get it from the [App Store](https://apps.apple.com/us/app/expo-go/id982107779) (iOS) or [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) (Android).

2.  **Start the Metro Server:**
    - Make sure your phone and computer are on the same WiFi network.
    - Run the following command in your project root:

    ```bash
    npx expo start
    ```

3.  **Open the App on Your Phone:**
    - A QR code will appear in your terminal.
    - **On Android:** Open the Expo Go app and scan the QR code.
    - **On iOS:** Open the default Camera app and scan the QR code.

The app will now be running on your device.

---

## 📦 Building the APK for Android

To create an APK file for direct installation on Android devices (sideloading), follow these steps.

### 1. Generate the Native Project

First, you need to generate the native `/android` folder. If you don't already have it, run:

```bash
npx expo prebuild
```

### 2. Open the Project in Android Studio

1.  Launch **Android Studio**.
2.  Select **"Open an existing project"**.
3.  Navigate to your project folder and select the `android` directory.
4.  Wait for Android Studio to sync the project with Gradle (this may take a few minutes).

### 3. Build the APK

1.  From the top menu bar, navigate to:
    **Build > Build Bundle(s) / APK(s) > Build APK(s)**
2.  Android Studio will start building the APK.
3.  Once completed, a notification will appear. Click the **"locate"** link in the notification to find the APK file.

The APK will be located at:
`android/app/build/outputs/apk/debug/app-debug.apk`

You can now share this `app-debug.apk` file for internal testing and distribution.

---

## 🔧 Troubleshooting

-   **"Port already in use" Error:**
    -   Run `npx kill-port 19000` and then `npx expo start` again.
-   **App Crashes on Start:**
    -   Try clearing the cache: `npx expo start --clear`
-   **Build Failures:**
    -   Ensure your Android Studio, SDK, and NDK are up to date.
    -   Clean the Gradle build cache by running `./gradlew clean` inside the `android` directory.
