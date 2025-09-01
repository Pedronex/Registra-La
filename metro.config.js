const { withNativeWind } = require("nativewind/metro");
const {
  getSentryExpoConfig
} = require("@sentry/react-native/metro");

const config = getSentryExpoConfig(__dirname);

// Add support for SQLite files
config.resolver.sourceExts.push("sql");

// Add support for NativeWind / Tailwind
module.exports = withNativeWind(config, { input: "./global.css" });