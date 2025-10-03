const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')

const config = getDefaultConfig(__dirname)

// Add support for SQLite files
config.resolver.sourceExts.push('sql')

// Add support for NativeWind / Tailwind
module.exports = withNativeWind(config, { input: './global.css' })
