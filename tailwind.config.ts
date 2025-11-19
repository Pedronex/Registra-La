/** @type {import('tailwindcss').Config} */
import preset from 'nativewind/preset'

module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [preset],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-content': 'var(--color-primary-content)',
        secondary: 'var(--color-secondary)',
        'secondary-content': 'var(--color-secondary-content)',
        tertiary: 'var(--color-tertiary)',
        'tertiary-content': 'var(--color-tertiary-content)',
        error: 'var(--color-error)',
        'error-content': 'var(--color-error-content)',
        background: 'var(--color-background)',
        'background-content': 'var(--color-background-content)',
        surface: 'var(--color-surface)',
        'surface-content': 'var(--color-surface-content)',
        success: 'var(--color-success)',
        'success-content': 'var(--color-success-content)',
      },
    },
  },
  plugins: [],
}
