// Lets an Expo app reference this plugin by its package name alone:
//
//   "plugins": [["@deploypulseio/react-native-code-push", { "android": { ... } }]]
//
// @expo/config-plugins looks for app.plugin.js at the package root and only falls back to the
// package's `main` when it is missing. `main` here is CodePush.js, which is untranspiled JSX, so
// without this file the fallback throws "Unexpected token '<'" and the prebuild fails. The
// "@deploypulseio/react-native-code-push/expo" subpath keeps working either way.
module.exports = require("./expo");
