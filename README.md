# Epic Homes AR — Visual Housing Prototype (React Native)

**One-line purpose:**  
Epic Homes AR lets indigenous families preview and compare house layouts in augmented reality before construction, reducing costly miscommunication and helping families make informed design choices.

**Quick progress snapshot:**  
`61 commits • UI complete • AR core (react-native-ar-viewer) in active development • Prototype shown to Epic Homes (demo next step)`

---

### Preview
![Home Screen](screenshots/IMG_4401.jpg)

<details>
<summary>Short demo (click to expand)</summary>

![AR Measurements](screenshots/ar-measurements.png)

</details>

---

### What this project does (30 seconds)
- **Problem:** Low-cost house builds often proceed from plans that families struggle to visualise, causing expensive rework and mismatched expectations.  
- **Solution:** A bilingual (English/Malay) mobile app that overlays 3D house models in the real space so families can assess scale, flow, and material choices.  
- **Impact:** Designed for non-technical users; field demo with Epic Homes is scheduled to evaluate deployment.

---

### Key features
- Bilingual UI (English / Malay) and simplified onboarding for first-time mobile users  
- Real-time camera AR with house model placement and interaction
- Multiple traditional Malaysian house designs (4 Module houses in different colors)
- Simple scene navigation and object controls (rotation, scaling, material customization)
- Construction progress tracking with step-by-step building guides
- Material customization options (traditional materials like Cengal hardwood, Meranti, Bamboo)
- Offline compatibility for field use without internet connection

---

### Technical appendix (for engineers)
- **Tech:** React Native (Pure RN branch), react-native-ar-viewer (AR module), TypeScript.  
- **Main challenge:** implementing persistent anchors and lightweight occlusion for low-end Android devices; resolving Expo ↔ native module conflicts required switching branches.  
- **Status:** UI complete and testable; AR anchoring in development (see `docs/AR-notes.md`).

---

### How to view / demo (non-technical)
1. Open `screenshots/IMG_4401.jpg` for a preview of the home screen UI.  
2. For a live test, request an APK (contact below).  
3. For technical reviewers: run `npm install && npm run android` after following RN environment setup (see Developer notes).

---

## Developer notes (detailed)

This repository branch contains the Pure React Native version of the Epic Homes AR app. The Expo-based version remains on the `master` branch of the same repo (`EpicHomesAR-app`). See the repository here: [EpicHomesAR-app on GitHub](https://github.com/mehulgupta1001/EpicHomesAR-app/).

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

---

### Contact / verification
Mehul Gupta — mehulgup1001@gmail.com