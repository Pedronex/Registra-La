const { getDefaultConfig } = require('expo/metro-config')
const { withNativewind } = require('nativewind/metro')

const config = getDefaultConfig(__dirname)

// Add support for SQLite files
config.resolver.sourceExts.push('sql')

module.exports = withNativewind(config)
