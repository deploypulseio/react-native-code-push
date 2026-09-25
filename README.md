<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/logo-dark.png">
    <img src="assets/logo-light.png" width="300" alt="DeployPulse" />
  </picture>
</p>

# @deploypulseio/react-native-code-push

React Native CodePush SDK pre-configured for [DeployPulse](https://deploypulse.io), the hosted CodePush alternative for React Native OTA updates.

Push JavaScript and asset updates to your users instantly, without an app store release. Works with both **Expo managed workflow** (via config plugin) and **bare React Native**.

---

## Contents

- [Compatibility](#compatibility)
- [Installation](#installation)
- [Expo Managed Workflow Setup](#expo-managed-workflow-setup)
- [Bare React Native Setup](#bare-react-native-setup)
- [Usage](#usage)
- [Releasing Updates](#releasing-updates)
- [API Reference](#api-reference)
- [Upstream](#upstream)

---

## Compatibility

| React Native version     | SDK version                                       |
|--------------------------|---------------------------------------------------|
| < 0.76                   | Use [microsoft/react-native-code-push](https://github.com/microsoft/react-native-code-push) |
| 0.76 – 0.79              | 10.0+ _(Old & New Architecture)_                  |
| 0.80                     | 10.1+ _(Old & New Architecture)_                  |
| 0.81                     | 10.3+ _(Old & New Architecture)_                  |
| 0.82+                    | 10.4+ _(New Architecture)_                        |

| Expo SDK | Supported |
|----------|-----------|
| 52+      | ✓         |
| < 52     | ✗         |

**Platforms:** iOS 7+, Android 4.1+ (TLS 1.2), Windows (UWP, untested)

---

## Installation

```sh
npm install @deploypulseio/react-native-code-push
# or
yarn add @deploypulseio/react-native-code-push
```

Get your deployment keys from the [DeployPulse dashboard](https://deploypulse.io) or via the CLI:

```sh
dpctl deployment list <AppName>
```

---

## Expo Managed Workflow Setup

Add the plugin to your `app.json` / `app.config.js`. The server URL is pre-configured to DeployPulse, so you only need to provide your deployment keys.

```json
{
  "expo": {
    "plugins": [
      [
        "@deploypulseio/react-native-code-push",
        {
          "ios": {
            "CodePushDeploymentKey": "YOUR_IOS_DEPLOYMENT_KEY"
          },
          "android": {
            "CodePushDeploymentKey": "YOUR_ANDROID_DEPLOYMENT_KEY"
          }
        }
      ]
    ]
  }
}
```

Then run prebuild (or let EAS Build handle it):

```sh
npx expo prebuild
```

The plugin automatically:
- Adds `CodePushDeploymentKey` and `CodePushServerURL` to `Info.plist` (iOS)
- Adds `CodePushDeploymentKey` and `CodePushServerUrl` to `strings.xml` (Android)
- Patches `AppDelegate` with the CodePush `bundleURL()` override (iOS)
- Patches `MainApplication.kt` with CodePush package registration and `getJSBundleFile()` (Android)
- Adds the CodePush gradle apply line to `app/build.gradle` (Android)

No manual native file editing required.

### Overriding the server URL

The plugin defaults to `https://apps.deploypulse.io`. To point at a different server (e.g. a self-hosted instance), pass `serverUrl` or per-platform overrides:

```json
{
  "expo": {
    "plugins": [
      [
        "@deploypulseio/react-native-code-push",
        {
          "serverUrl": "https://your-own-server.example.com",
          "ios": { "CodePushDeploymentKey": "YOUR_IOS_KEY" },
          "android": { "CodePushDeploymentKey": "YOUR_ANDROID_KEY" }
        }
      ]
    ]
  }
}
```

---

## Bare React Native Setup

For bare React Native (no Expo), follow the standard native setup guides. Set the server URL to `https://apps.deploypulse.io` in each platform.

- [iOS Setup](https://docs.deploypulse.io/mobile#ios-setup)
- [Android Setup](https://docs.deploypulse.io/mobile#android-setup)
- [Windows Setup](docs/setup-windows.md)

In `Info.plist` (iOS), add:

```xml
<key>CodePushDeploymentKey</key>
<string>YOUR_IOS_DEPLOYMENT_KEY</string>
<key>CodePushServerURL</key>
<string>https://apps.deploypulse.io</string>
```

In `android/app/src/main/res/values/strings.xml` (Android), add:

```xml
<string name="CodePushDeploymentKey" translatable="false">YOUR_ANDROID_DEPLOYMENT_KEY</string>
<string name="CodePushServerUrl" translatable="false">https://apps.deploypulse.io</string>
```

---

## Usage

Wrap your root component with the `CodePush` higher-order component:

```js
import CodePush from '@deploypulseio/react-native-code-push';

const App = () => <View>...</View>;

export default CodePush(App);
```

With options:

```js
export default CodePush({
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  installMode: CodePush.InstallMode.ON_NEXT_RESTART,
})(App);
```

---

## Releasing Updates

Use the [DeployPulse CLI](https://github.com/deploypulseio/cli) (`dpctl`) to push updates:

```sh
# Bundle and release
dpctl release-react <AppName> <Platform>

# Example
dpctl release-react MyApp ios
dpctl release-react MyApp android
```

---

## API Reference

The JavaScript API is identical to the original CodePush SDK. Full reference:

- [JavaScript API](docs/api-js.md)
- [Objective-C API (iOS)](docs/api-ios.md)
- [Java API (Android)](docs/api-android.md)

---

## Upstream

This package is a fork of [react-native-code-push](https://github.com/codemagic-ci-cd/react-native-code-push) (formerly CodePushNext, now maintained by Codemagic), which is itself a fork of [microsoft/react-native-code-push](https://github.com/microsoft/react-native-code-push). We track upstream changes and apply DeployPulse-specific configuration on top.

**DeployPulse additions over upstream:**
- Expo managed workflow config plugin (`expo.js`) with pre-configured server URL
- `@deploypulseio` npm scope and package metadata
- Automated npm publish via GitHub Actions
