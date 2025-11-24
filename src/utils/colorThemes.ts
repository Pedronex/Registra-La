import { vars } from 'nativewind'

export const colors = {
  light: {
    primary: '#52276C',
    primaryContent: '#FFFFFF',
    secondary: '#E6CCFF',
    secondaryContent: '#000',
    tertiary: '#F0E6F7',
    tertiaryContent: '#000000',
    error: '#FF6B6B',
    errorContent: '#4F1C1C',
    success: '#6BFF8E',
    successContent: '#194A25',
    background: '#F4F6FB',
    backgroundColor: '#4A4A4A',
    surface: '#FFFFFF',
    surfaceContent: '#4A4A4A',
  },
  dark: {
    primary: '#52276C',
    primaryContent: '#FFFFFF',
    secondary: '#2C2C2C',
    secondaryContent: '#FFFFFF',
    tertiary: '#3A1F4C',
    tertiaryContent: '#FFFFFF',
    error: '#4F1C1C',
    errorContent: '#FF6B6B',
    success: '#194A25',
    successContent: '#6BFF8E',
    background: '#121212',
    backgroundColor: '#E0E0E0',
    surface: '#1E1E1E',
    surfaceContent: '#E0E0E0',
  },
}

export const themes = {
  light: vars({
    /* Cores principais da marca */
    '--color-primary': '#52276C',
    '--color-primary-content': '#FFFFFF',

    /* Cores secundárias para acentos */
    '--color-secondary': '#c484fc',
    '--color-secondary-content': '#000',

    /* Cores terciárias */
    '--color-tertiary': '#F0E6F7',
    '--color-tertiary-content': '#000000',

    /* Cores de feedback */
    '--color-error': '#4F1C1C',
    '--color-error-content': '#FF6B6B',
    '--color-success': '#6BFF8E',
    '--color-success-content': '#194A25',

    /* Fundo e superfícies */
    '--color-background': '#F4F6FB',
    '--color-background-content': '#4A4A4A',
    '--color-surface': '#FFFFFF',
    '--color-surface-content': '#4A4A4A',
  }),
  dark: vars({
    /* Cores principais da marca */
    '--color-primary': '#52276C',
    '--color-primary-content': '#FFFFFF',

    /* Cores secundárias para acentos */
    '--color-secondary': '#2C2C2C',
    '--color-secondary-content': '#FFFFFF',

    /* Cores terciárias */
    '--color-tertiary': '#3A1F4C',
    '--color-tertiary-content': '#FFFFFF',

    /* Cores de feedback */
    '--color-error-content': '#FF6B6B',
    '--color-error': '#4F1C1C',
    '--color-success': '#194A25',
    '--color-success-content': '#6BFF8E',

    /* Fundo e superfícies */
    '--color-background': '#121212',
    '--color-background-content': '#E0E0E0',
    '--color-surface': '#1E1E1E',
    '--color-surface-content': '#E0E0E0',
  }),
}
