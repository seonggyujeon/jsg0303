# Ocean Log Mobile

This directory packages the deployed Ocean Log web application as a single Capacitor project for Android and iOS.

## Architecture

- Web/PC: existing vinext app deployed on Vercel
- Android: Capacitor native shell
- iOS: Capacitor native shell
- Mobile start URL: `https://jsg0303.vercel.app/home`
- App ID: `kr.co.oceanlog.app`
- App name: `Ocean Log`

The existing web project is intentionally unchanged.

## Android

```bash
cd mobile
npm install
npm run add:android
npm run sync
npm run android
```

Android Studio opens the generated `android/` project. Run it on a device/emulator, then create a signed Android App Bundle (`.aab`) for Google Play.

## iOS

Requires macOS and Xcode.

```bash
cd mobile
npm install
npm run add:ios
npm run sync
npm run ios
```

Xcode opens the generated `ios/` project. Configure the Apple Developer signing team and archive the app for App Store Connect.

## Updating the web application

Normal Ocean Log UI and server changes continue to be deployed through the existing Vercel project. The native shell loads the production `/home` route, so ordinary web updates do not require rebuilding the native app unless native configuration, permissions, plugins, icons, or store metadata change.

## Before store submission

Replace the generated default Android/iOS icons and splash assets with the final Ocean Log brand assets. Also test navigation, external links, authentication, location permissions, offline/network-error behavior, and platform back-navigation on physical devices.

> Note: App Store and Google Play review may reject apps that provide only a thin web wrapper. Before public store submission, add native-value features where appropriate (for example native geolocation permissions, sharing, push notifications, deep links, or platform-specific navigation behavior).
