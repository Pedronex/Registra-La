// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config')
const expoConfig = require('eslint-config-expo/flat')
const importX = require('eslint-plugin-import-x')

module.exports = defineConfig([
  expoConfig,
  {
    plugins: {
      'import-x': importX,
    },
    settings: {
      'import-x/resolver': {
        typescript: true,
        node: true,
      },
    },
    ignores: ['dist/*'],
  },
  {
    rules: {
      'import-x/no-unresolved': [
        'error',
        {
          ignore: ['^bun(:\\w+)?$'], // Ignores modules starting with 'bun:'
        },
      ],
    },
  },
])
